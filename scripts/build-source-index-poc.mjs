import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRetrievalMarkdown, evaluateQueries, normalizeText } from './evaluate-source-index-retrieval.mjs'
import { buildVm01DefinitionChunks } from './lib/vm01-definitions.mjs'
import { buildVm21Chunks } from './lib/vm21-current-manual.mjs'
import { buildVm22Chunks } from './lib/vm22-current-manual.mjs'
import { buildVm30Chunks } from './lib/vm30-current-manual.mjs'
import { buildVm31Chunks } from './lib/vm31-current-manual.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes')
const sourcesRoot = path.join(outputRoot, 'sources')
const exportsRoot = path.join(outputRoot, 'exports')
const evaluationRoot = path.join(outputRoot, 'evaluation')
const classificationRoot = path.join(outputRoot, 'classification')
const legacyRetrievalRoot = path.join(outputRoot, 'retrieval')
const reviewPackagesRoot = path.join(repoRoot, 'data', 'processed', 'review_packages')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true })
}

const toBooleanText = (value) => (value ? 'Yes' : 'No')

const inferProfileName = (source) => {
  switch (source.domainId) {
    case 'pricing_documents':
      return 'pricing'
    case 'liability_modeling':
      return 'liability_modeling'
    case 'actuarial_governance':
      return 'governance'
    case 'reporting_documents':
      return 'reporting'
    case 'product_documents':
      return 'product'
    default:
      return 'regulatory'
  }
}

const inferAuthoritySourceType = (source) => {
  if (source.classification?.authoritySourceType) {
    return source.classification.authoritySourceType
  }
  if (source.domainId === 'pricing_documents') return 'synthetic'
  if (['practice_notes', 'educational_notes'].includes(source.sourceFamilyId)) return 'companion'
  if (source.domainId === 'naic_regulatory') return 'regulatory'
  return 'internal'
}

const inferIntendedAudience = (source) => {
  if (source.classification?.intendedAudience) {
    return source.classification.intendedAudience
  }
  switch (source.domainId) {
    case 'pricing_documents':
      return 'Pricing, product, and actuarial governance reviewers'
    case 'liability_modeling':
      return 'Reserve and model reviewers'
    case 'actuarial_governance':
      return 'Control and evidence reviewers'
    case 'reporting_documents':
      return 'Reporting and filing reviewers'
    case 'product_documents':
      return 'Pricing and product reviewers'
    default:
      return 'Valuation, regulatory, and governance reviewers'
  }
}

const inferChunkingStrategy = (source) => {
  if (source.classification?.recommendedChunkingStrategy) {
    return source.classification.recommendedChunkingStrategy
  }
  if (['approval_memo', 'assumption_memo'].includes(source.documentType)) {
    return 'structure_first'
  }
  if (['product_specification', 'profitability_study'].includes(source.documentType)) {
    return 'section_window'
  }
  if (source.domainId === 'naic_regulatory') {
    return 'heading_first'
  }
  return 'structure_first'
}

const buildClassification = (source) => {
  const classification = source.classification ?? {}
  const publicationDate = classification.publicationDate ?? source.versionDate ?? null
  const effectiveDate = classification.effectiveDate ?? source.versionDate ?? null
  return {
    domainId: classification.domainId ?? source.domainId,
    subdomainId: classification.subdomainId ?? null,
    documentType: classification.documentType ?? source.documentType,
    purpose: classification.purpose ?? source.notes ?? source.sourceTitle,
    intendedAudience: inferIntendedAudience(source),
    authoritySourceType: inferAuthoritySourceType(source),
    confidentiality: classification.confidentiality ?? (source.domainId === 'pricing_documents' ? 'internal' : 'internal'),
    publicationDate,
    effectiveDate,
    version: classification.version ?? source.sourceEditionId ?? source.sourceVersionIdentifier ?? (source.versionDate ? '1.0' : null),
    approvalStatus: classification.approvalStatus ?? (source.sourceStatus === 'active' ? 'reviewed' : source.sourceStatus),
    language: classification.language ?? 'en',
    recommendedProfile: classification.recommendedProfile ?? inferProfileName(source),
    recommendedChunkingStrategy: inferChunkingStrategy(source),
    confidence: classification.confidence ?? (source.textLayerQuality === 'clean' ? 'high' : 'medium'),
    unresolvedQuestions: classification.unresolvedQuestions ?? (source.lineReferencesAvailable ? [] : ['Line references are unavailable and page locators are primary.']),
    notes: classification.notes ?? source.notes ?? '',
  }
}

const buildClassificationMarkdown = (manifest, classificationRecords) => {
  const lines = []
  lines.push(`# ${manifest.repositoryName} classification summary`)
  lines.push('')
  lines.push(`- Manifest ID: \`${manifest.repositoryManifestId}\``)
  lines.push(`- Source packages classified: ${classificationRecords.length}`)
  lines.push('')
  lines.push('| Source | Domain | Document type | Recommended profile | Chunking strategy | Authority type | Confidence |')
  lines.push('| --- | --- | --- | --- | --- | --- | --- |')
  for (const record of classificationRecords) {
    lines.push(
      `| ${record.sourceTitle.replace(/\|/g, '\\|')} | ${record.classification.domainId} | ${record.classification.documentType} | ${record.classification.recommendedProfile} | ${record.classification.recommendedChunkingStrategy} | ${record.classification.authoritySourceType} | ${record.classification.confidence} |`,
    )
  }
  lines.push('')
  lines.push('## Notes')
  lines.push('')
  lines.push('- The synthetic pricing corpus is explicitly labeled as synthetic in the classification stage.')
  lines.push('- Regulatory, pricing, liability-modeling, governance, product, and reporting concepts stay in optional profile metadata.')
  return `${lines.join('\n')}\n`
}

const csvEscape = (value) => {
  const text = value === null || value === undefined
    ? ''
    : String(value).replace(/[ \t]+(?=\r?$)/gm, '').replace(/\r?\n/g, '\\n')
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

const asArray = (value) => (Array.isArray(value) ? value : [])

const toRelativePosix = (value) => value.replace(/\\/g, '/')

const buildCitationDisplay = (citations) =>
  asArray(citations)
    .map((citation) => citation.citationText)
    .filter(Boolean)
    .join(' | ')

const deriveRequirements = (controlledTags) =>
  asArray(controlledTags).filter((tag) =>
    [
      'regulatory_requirement',
      'reporting_requirement',
      'documentation_expectation',
      'governance_or_control_expectation',
      'jurisdiction_specific_requirement',
    ].includes(tag),
  )

const normalizeStructuralHeading = (value) => {
  const heading = normalizeText(value)
  if (/^Appendix 1 F\./i.test(heading)) {
    return 'Appendix 1 F. SERT scenario set'
  }
  return heading
}

const LOCAL_TOPIC_RULES = [
  ['company_mortality_experience', ['company experience', 'company mortality', 'aggregate company experience']],
  ['underwriting_segmentation', ['underwriting process', 'underwriting processes', 'risk class']],
  ['credibility', ['credibility', 'Bühlmann']],
  ['relative_risk_tool', ['relative risk tool']],
  ['industry_mortality_tables', ['industry basic table', 'industry mortality', 'industry experience rates']],
  ['mortality_margins', ['mortality margin', 'margin percentage', 'prescribed margin']],
  ['grading', ['grading to', 'grade to', 'grading period']],
  ['mortality_improvement', ['mortality improvement', 'future mortality improvement']],
  ['policyholder_behavior', ['policyholder behavior', 'lapse', 'premium persistency']],
  ['expense_assumptions', ['expense assumption', 'unit expense', 'expense inflation']],
  ['asset_defaults_spreads', ['default cost', 'default costs', 'benchmark spread', 'swap spread', 'asset spread']],
  ['revenue_sharing', ['revenue sharing', 'revenue-sharing']],
]

const deriveLocalTopics = (text) => {
  const lowerText = String(text ?? '').toLowerCase()
  return LOCAL_TOPIC_RULES
    .filter(([, terms]) => terms.some((term) => lowerText.includes(term.toLowerCase())))
    .map(([topic]) => topic)
}

const deriveProvisionTypes = (text) => {
  const lowerText = String(text ?? '').toLowerCase()
  const types = []
  if (/\b(shall|must|required to|required that)\b/.test(lowerText)) types.push('regulatory_requirement')
  if (/\b(may|permitted|permission|elect|election|option)\b/.test(lowerText)) types.push('permission_or_election')
  if (/\b(may not|must not|prohibited|not permissible)\b/.test(lowerText)) types.push('prohibition')
  if (/\b(unless|except|exception|provided that|in the absence of)\b/.test(lowerText)) types.push('exception_or_condition')
  if (/guidance note/.test(lowerText)) types.push('guidance_note')
  if (/\bprescribed\b/.test(lowerText)) types.push('prescribed_methodology_or_assumption')
  if (/\b(company experience|company-developed|company developed|own experience)\b/.test(lowerText)) types.push('company_developed_assumption')
  if (/\b(disclose|disclosure|document|documentation|report|reporting|actuarial report)\b/.test(lowerText)) types.push('documentation_or_reporting_obligation')
  return [...new Set(types)]
}

const deriveCrossReferenceCandidates = (text) => {
  const value = String(text ?? '')
  const references = []
  const add = (target, pattern) => {
    if (pattern.test(value)) references.push({ target, relationType: 'cross_reference_candidate', status: 'pending_human_review', basis: 'explicit_source_text_reference' })
  }
  add('Model #820', /Model\s+#?820/i)
  add('AG 48', /AG\s*48/i)
  add('Model #830', /Model\s+#?830/i)
  add('Model #787', /Model\s+#?787/i)
  add('VM-31', /VM-31/i)
  add('VM-G', /VM-G/i)
  add('Appendix 1', /Appendix\s+1/i)
  add('Appendix 2', /Appendix\s+2/i)
  add('NAIC current table sources', /NAIC|National Association of Insurance Commissioners/i)
  return references
}

const deriveBoundaryMetadata = (text, heading, childNumber) => {
  const lines = String(text ?? '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const firstLine = lines.find((line) => !/^\[p\.\s*\d+\]/i.test(line)) ?? lines[0] ?? ''
  const markerMatch = firstLine.match(/^(\d+\.|[A-Z]\.|[a-z]\.|[ivx]+\.|[A-Z]\s*=)/)
  const startsAtBoundary = Boolean(markerMatch)
  return {
    status: startsAtBoundary ? 'numbered_or_lettered_boundary' : 'source_paragraph_boundary_with_context',
    startsAtBoundary,
    structuralBreadcrumb: `${heading} > ${markerMatch?.[1] ?? `child ${childNumber} continuation; inspect preceding context`}`,
    note: startsAtBoundary
      ? 'Child begins at a source-derived numbered, lettered, or formula boundary.'
      : 'Child begins at a source paragraph boundary without a local marker; preceding and following links provide context before interpretation.',
  }
}

const deriveChunk = (source, chunk, index, sourceIndexPath) => {
  const sourceVersionId = source.sourceVersionId ?? source.sourceIndexId
  const summary = chunk.summary ?? chunk.topic ?? `Chunk ${index + 1}`
  const sourceTextExcerpt = chunk.sourceTextExcerpt ?? summary
  const normalizedTextExcerpt =
    chunk.normalizedTextExcerpt ?? normalizeText(sourceTextExcerpt).toLowerCase()
  const topic = chunk.topic ?? summary
  const headingPath = chunk.headingPath ?? chunk.sectionReference
  const controlledTags = asArray(chunk.controlledTags)
  const keywords = asArray(chunk.keywords)
  const citations = asArray(chunk.citations)
  const chunkRelationships = asArray(chunk.relationships)
  const topLevelRelationships = asArray(source.relationships)
  const relationshipIds = [
    ...topLevelRelationships
      .map((relationship) => relationship.targetSourceId ?? relationship.targetChunkId)
      .filter(Boolean),
    ...chunkRelationships
      .map((relationship) => relationship.targetSourceId ?? relationship.targetChunkId)
      .filter(Boolean),
  ]
  const keyPoints = asArray(chunk.keyPoints).length > 0 ? asArray(chunk.keyPoints) : [summary]
  const concepts = asArray(chunk.concepts).length > 0 ? asArray(chunk.concepts) : controlledTags
  const definedTerms = chunk.preserveEmptyDefinedTerms ? asArray(chunk.definedTerms) : asArray(chunk.definedTerms).length > 0 ? asArray(chunk.definedTerms) : keywords
  const acronyms = asArray(chunk.acronyms)
  const requirements = chunk.preserveEmptyRequirements ? asArray(chunk.requirements) : asArray(chunk.requirements).length > 0 ? asArray(chunk.requirements) : deriveRequirements(controlledTags)
  const citationDisplay = chunk.citationDisplay ?? buildCitationDisplay(citations)
  const hierarchyFields = chunk.chunkLevel ? {
    chunkLevel: chunk.chunkLevel,
    parentChunkId: chunk.parentChunkId ?? null,
    childChunkIds: asArray(chunk.childChunkIds),
    precedingChunkId: chunk.precedingChunkId ?? null,
    followingChunkId: chunk.followingChunkId ?? null,
    structuralLocator: chunk.structuralLocator,
    chunkingMethod: chunk.chunkingMethod,
  } : {}
  const normalizedSearchText = chunk.normalizedSearchText ??
    normalizeText(
      [
        sourceTextExcerpt,
        normalizedTextExcerpt,
        summary,
        topic,
        headingPath,
        chunk.sectionReference,
        source.sourceTitle,
        source.sourceReference,
        keyPoints.join(' '),
        concepts.join(' '),
        definedTerms.join(' '),
        acronyms.join(' '),
        requirements.join(' '),
        citationDisplay,
        controlledTags.join(' '),
        keywords.join(' '),
      ].join(' '),
    ).toLowerCase()

  const derivedChunk = {
    chunkId: chunk.chunkId,
    chunkOrdinal: chunk.chunkOrdinal ?? index + 1,
    chunkKind: chunk.chunkKind ?? 'source_excerpt',
    sourceTextType:
      chunk.sourceTextType ??
      source.chunkDefaults?.sourceTextType ??
      'review_artifact_derived_text',
    pageStart: chunk.pageStart,
    pageEnd: chunk.pageEnd,
    sectionReference: chunk.sectionReference,
    lineReference: chunk.lineReference ?? null,
    sourceTextExcerpt,
    ...(chunk.sourceTextSha256 ? { sourceTextSha256: chunk.sourceTextSha256 } : {}),
    normalizedTextExcerpt,
    summary,
    topic,
    headingPath,
    keyPoints,
    concepts,
    definedTerms,
    acronyms,
    requirements,
    citationDisplay,
    normalizedSearchText,
    canonicalSourceIndexPath: sourceIndexPath,
    sourceVersionId,
    controlledTags,
    keywords,
    citations,
    relationships: chunkRelationships,
    relationshipIds,
    fidelity: chunk.fidelity ?? source.chunkDefaults?.fidelity ?? 'curated',
    confidence: chunk.confidence ?? source.chunkDefaults?.confidence ?? 'high',
    reviewFlags: chunk.reviewFlags ?? source.chunkDefaults?.reviewFlags ?? [],
    qualityNotes: chunk.qualityNotes ?? source.chunkDefaults?.qualityNotes ?? [],
    evidenceNotes: chunk.evidenceNotes ?? source.chunkDefaults?.evidenceNotes ?? '',
    ...(chunk.metadataDerivation ? {
      localTopics: asArray(chunk.localTopics),
      provisionTypes: asArray(chunk.provisionTypes),
      provisionTypeBasis: chunk.provisionTypeBasis ?? 'source_text_pattern_only',
      structuralBreadcrumb: chunk.structuralBreadcrumb ?? null,
      boundaryQuality: chunk.boundaryQuality ?? null,
      crossReferenceCandidates: asArray(chunk.crossReferenceCandidates),
      metadataDerivation: chunk.metadataDerivation,
    } : {}),
    ...hierarchyFields,
    retrievalEligible: chunk.retrievalEligible ?? true,
    promotionEligible: chunk.promotionEligible ?? false,
    ...(chunk.retrievalRole ? { retrievalRole: chunk.retrievalRole } : {}),
    ...(chunk.structuredEvidence ? { structuredEvidence: asArray(chunk.structuredEvidence) } : {}),
  }

  return derivedChunk
}

const parsePageRange = (text, fallbackStart, fallbackEnd) => {
  const pages = [...String(text).matchAll(/\[p\.\s*(\d+)\]/g)].map((match) => Number(match[1]))
  return { start: pages[0] ?? fallbackStart, end: pages.at(-1) ?? fallbackEnd }
}

const splitParagraphs = (text) => String(text).split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)

const packParagraphs = (paragraphs, targetWords = 360) => {
  const groups = []
  let current = []
  let words = 0
  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.split(/\s+/).length
    if (current.length > 0 && words >= targetWords) {
      groups.push(current.join('\n\n'))
      current = []
      words = 0
    }
    current.push(paragraph)
    words += paragraphWords
  }
  if (current.length > 0) groups.push(current.join('\n\n'))
  return groups
}

const buildHierarchicalChunks = async (source) => {
  const input = source.hierarchicalInput
  if (!input) return asArray(source.chunks)
  const extraction = await readJson(path.resolve(repoRoot, input.extractionPath))
  const group = extraction.sourceGroups.find((candidate) => candidate.sourceId === input.sourceId)
  const item = group?.extractedItems?.find((candidate) => candidate.itemKind === 'review_note' || candidate.itemKind === 'chunk')
  if (!item) throw new Error(`Hierarchical input has no extracted item: ${input.sourceId}`)
  const text = item.chunkText
  const parentBoundaries = [
    ['Section 3.C.1 Mortality Rates', /C\.\s+Net Premium Reserve Assumptions[\s\S]*?(?=\n\s*2\.\s+Interest Rates)/],
    ['Section 3.C.2 Interest Rates', /2\.\s+Interest Rates[\s\S]*?(?=\n\s*3\.\s+Lapse Rates)/],
    ['Section 3.C.3 Lapse Rates', /3\.\s+Lapse Rates[\s\S]*?(?=\n\s*D\.\s+NPR Calculation)/],
    ['Section 3.D NPR Calculation and Cash Surrender Value Floor', /D\.\s+NPR Calculation and Cash Surrender Value Floor[\s\S]*/],
  ]
  const parents = []
  for (const [heading, pattern] of parentBoundaries) {
    const match = text.match(pattern)
    if (!match?.[0]) continue
    const parentId = `${source.sourceId}-${slugify(heading)}`
    const pageRange = parsePageRange(match[0], source.pageRange.start, source.pageRange.end)
    const paragraphs = splitParagraphs(match[0])
    const childTexts = packParagraphs(paragraphs)
    const childIds = childTexts.map((_, index) => `${parentId}-child-${String(index + 1).padStart(3, '0')}`)
    parents.push({ heading, parentId, match: match[0], pageRange, childTexts, childIds })
  }
  const chunks = []
  let ordinal = 1
  const allIds = parents.flatMap((parent) => [parent.parentId, ...parent.childIds])
  for (const parent of parents) {
    const parentIndex = allIds.indexOf(parent.parentId)
    chunks.push({
      chunkId: parent.parentId,
      chunkOrdinal: ordinal++,
      chunkKind: 'source_excerpt',
      sourceTextType: 'actual_extracted_source_text',
      pageStart: parent.pageRange.start,
      pageEnd: parent.pageRange.end,
      sectionReference: parent.heading,
      sourceTextExcerpt: parent.match,
      normalizedTextExcerpt: normalizeText(parent.match).toLowerCase(),
      summary: `${parent.heading} from the reviewed VM-20 source slice.`,
      topic: parent.heading,
      headingPath: `VM-20 > Section 3.C > ${parent.heading.replace(/^Section 3\.C\.\d+\s+/, '')}`,
      structuralLocator: `VM-20 / ${parent.heading}`,
      chunkLevel: 'parent',
      childChunkIds: parent.childIds,
      precedingChunkId: allIds[parentIndex - 1] ?? null,
      followingChunkId: allIds[parentIndex + 1] ?? null,
      chunkingMethod: 'hierarchical_structure',
      controlledTags: ['core_vm_course', 'hierarchical_parent', 'review_only'],
      keywords: ['VM-20', 'Section 3.C', parent.heading],
      citations: [{ citationText: parent.heading, pageReference: `pp. ${parent.pageRange.start}-${parent.pageRange.end}`, sectionReference: parent.heading, sourceReference: source.sourceReference, lineReference: null }],
      fidelity: 'exact',
      confidence: 'high',
      reviewFlags: ['review_only', 'hierarchical_parent'],
      qualityNotes: ['Parent preserves the explicit VM-20 section boundary.', 'Child chunks remain contiguous source-text excerpts.'],
      evidenceNotes: 'Derived from ignored batch-006 extraction-output.json; review-only and not promoted.',
      retrievalEligible: true,
      promotionEligible: false,
    })
    parent.childTexts.forEach((childText, index) => {
      const childId = parent.childIds[index]
      const childIndex = allIds.indexOf(childId)
      const childPages = parsePageRange(childText, parent.pageRange.start, parent.pageRange.end)
      chunks.push({
        chunkId: childId,
        chunkOrdinal: ordinal++,
        chunkKind: 'source_excerpt',
        sourceTextType: 'actual_extracted_source_text',
        pageStart: childPages.start,
        pageEnd: childPages.end,
        sectionReference: parent.heading,
        sourceTextExcerpt: childText,
        normalizedTextExcerpt: normalizeText(childText).toLowerCase(),
        summary: `Retrieval child for ${parent.heading}; preserves contiguous requirement and qualification text.`,
        topic: parent.heading,
        headingPath: `VM-20 > Section 3.C > ${parent.heading.replace(/^Section 3\.C\.\d+\s+/, '')}`,
        structuralLocator: `VM-20 / ${parent.heading} / child ${index + 1}`,
        chunkLevel: 'child',
        parentChunkId: parent.parentId,
        precedingChunkId: allIds[childIndex - 1] ?? null,
        followingChunkId: allIds[childIndex + 1] ?? null,
        chunkingMethod: 'semantic_boundary',
        controlledTags: ['core_vm_course', 'hierarchical_child', 'review_only'],
        keywords: ['VM-20', 'Section 3.C', parent.heading],
        citations: [{ citationText: parent.heading, pageReference: `pp. ${childPages.start}-${childPages.end}`, sectionReference: parent.heading, sourceReference: source.sourceReference, lineReference: null }],
        fidelity: 'exact',
        confidence: 'high',
        reviewFlags: ['review_only', 'hierarchical_child'],
        qualityNotes: ['Child boundaries follow paragraph/semantic boundaries.', 'Requirement and qualification paragraphs are kept contiguous.'],
        evidenceNotes: 'Derived from ignored batch-006 extraction-output.json; review-only and not promoted.',
        retrievalEligible: true,
        promotionEligible: false,
      })
    })
  }
  return chunks
}

const buildBatchCoverageChunks = async (source) => {
  const input = source.batchCoverageInput
  if (!input) return asArray(source.chunks)
  const qaMetadataEnabled = source.sourceId === 'vm20-remaining-prose-appendix-coverage'
  const allowedSourceIds = new Set(input.sourceIds ?? [])
  const allowedKinds = new Set(input.includeKinds ?? ['chunk', 'review_note'])
  const items = []
  for (const extractionPath of input.extractionPaths ?? []) {
    const extraction = await readJson(path.resolve(repoRoot, extractionPath))
    for (const group of extraction.sourceGroups ?? []) {
      if (allowedSourceIds.size > 0 && !allowedSourceIds.has(group.sourceId)) continue
      for (const item of group.extractedItems ?? []) {
        if (!allowedKinds.has(item.itemKind) || !item.chunkText) continue
        items.push({ ...item, groupSourceId: group.sourceId })
      }
    }
  }
  if (items.length === 0) throw new Error(`Batch coverage input has no extracted source text: ${source.sourceId}`)

  const records = items.map((item) => {
    const heading = normalizeStructuralHeading(item.sectionReference ?? item.sourceId ?? item.stableId)
    const parentId = `${source.sourceId}-${slugify(item.sourceId ?? item.stableId)}`
    const parentText = String(item.chunkText).trim()
    const childTexts = packParagraphs(splitParagraphs(parentText), input.childTargetWords ?? 360)
    const childIds = childTexts.map((_, index) => `${parentId}-child-${String(index + 1).padStart(3, '0')}`)
    const pageRange = parsePageRange(parentText, source.pageRange.start, source.pageRange.end)
    const localTopics = qaMetadataEnabled ? deriveLocalTopics(parentText) : []
    const crossReferenceCandidates = qaMetadataEnabled ? deriveCrossReferenceCandidates(parentText) : []
    const parentProvisionTypes = qaMetadataEnabled ? deriveProvisionTypes(parentText) : []
    const parentIsLarge = qaMetadataEnabled && /Section 9 C\./i.test(heading) && parentText.split(/\s+/).length > 1400 && childTexts.length > 1
    const parentIsDuplicate = qaMetadataEnabled && childTexts.length === 1 && normalizeText(parentText) === normalizeText(childTexts[0])
    return { item, heading, parentId, parentText, childTexts, childIds, pageRange, localTopics, crossReferenceCandidates, parentProvisionTypes, parentIsLarge, parentIsDuplicate }
  })
  const allIds = records.flatMap((record) => [record.parentId, ...record.childIds])
  const sourceTags = source.chunkDefaults?.controlledTags ?? []
  const baseFlags = source.chunkDefaults?.reviewFlags ?? ['review_only']
  const baseQualityNotes = source.chunkDefaults?.qualityNotes ?? []
  const evidenceNotes = source.chunkDefaults?.evidenceNotes ?? `Derived from the ignored VM-20 review batches; ${source.authorityLevel === 'companion_guidance' ? 'companion guidance remains non-binding and review-only.' : 'source text remains review-only and not promoted.'}`
  const chunks = []
  let ordinal = 1
  for (const record of records) {
    const parentIndex = allIds.indexOf(record.parentId)
    const itemFlags = asArray(record.item.reviewFlags)
    const itemTags = asArray(record.item.reviewFlags)
    chunks.push({
      chunkId: record.parentId,
      chunkOrdinal: ordinal++,
      chunkKind: 'source_excerpt',
      sourceTextType: 'actual_extracted_source_text',
      pageStart: record.pageRange.start,
      pageEnd: record.pageRange.end,
      sectionReference: record.heading,
      sourceTextExcerpt: record.parentText,
      normalizedTextExcerpt: normalizeText(record.parentText).toLowerCase(),
      summary: record.item.summary ?? `${record.heading} from the reviewed VM-20 source material.`,
      topic: record.localTopics.length > 0 ? `${record.heading} — ${record.localTopics.join(', ')}` : record.heading,
      headingPath: `VM-20 > ${record.heading}`,
      structuralLocator: `VM-20 / ${record.heading}`,
      chunkLevel: 'parent',
      parentChunkId: null,
      childChunkIds: record.childIds,
      precedingChunkId: allIds[parentIndex - 1] ?? null,
      followingChunkId: allIds[parentIndex + 1] ?? null,
      chunkingMethod: 'hierarchical_structure',
      controlledTags: [...new Set([...sourceTags, ...itemTags, 'hierarchical_parent', 'review_only'])],
      keywords: record.localTopics.length > 0 ? [...new Set(['VM-20', record.heading, record.item.sourceId ?? '', ...record.localTopics])] : ['VM-20', record.heading, record.item.sourceId ?? ''],
      citations: [{ citationText: record.heading, pageReference: `pp. ${record.pageRange.start}-${record.pageRange.end}`, sectionReference: record.heading, sourceReference: source.sourceReference, lineReference: null }],
      fidelity: source.chunkDefaults?.fidelity ?? 'exact',
      confidence: source.chunkDefaults?.confidence ?? 'high',
      reviewFlags: [...new Set([...baseFlags, ...itemFlags, 'hierarchical_parent', 'review_only'])],
      qualityNotes: [...baseQualityNotes, 'Parent preserves the reviewed source boundary.', 'Child chunks retain contiguous paragraph or semantic boundaries.'],
      evidenceNotes,
      ...(qaMetadataEnabled ? {
        localTopics: record.localTopics,
        provisionTypes: record.parentProvisionTypes,
        provisionTypeBasis: 'source_text_pattern_only',
        structuralBreadcrumb: record.heading,
        boundaryQuality: { status: 'source_structural_parent', note: 'Parent preserves the complete reviewed source boundary.' },
        crossReferenceCandidates: record.crossReferenceCandidates,
        metadataDerivation: 'generated_from_source_text_without_source_text_rewrite',
      } : {}),
      retrievalEligible: !(record.parentIsLarge || record.parentIsDuplicate),
      ...(qaMetadataEnabled ? { retrievalRole: record.parentIsLarge || record.parentIsDuplicate ? 'context_only_parent' : 'first_stage_retrieval' } : {}),
      promotionEligible: false,
    })
    record.childTexts.forEach((childText, index) => {
      const childId = record.childIds[index]
      const childIndex = allIds.indexOf(childId)
      const childPages = parsePageRange(childText, record.pageRange.start, record.pageRange.end)
      const childLocalTopics = qaMetadataEnabled ? deriveLocalTopics(childText) : []
      const childProvisionTypes = qaMetadataEnabled ? deriveProvisionTypes(childText) : []
      const childBoundary = qaMetadataEnabled ? deriveBoundaryMetadata(childText, record.heading, index + 1) : null
      const childCrossReferences = qaMetadataEnabled ? deriveCrossReferenceCandidates(childText) : []
      chunks.push({
        chunkId: childId,
        chunkOrdinal: ordinal++,
        chunkKind: 'source_excerpt',
        sourceTextType: 'actual_extracted_source_text',
        pageStart: childPages.start,
        pageEnd: childPages.end,
        sectionReference: record.heading,
        sourceTextExcerpt: childText,
        normalizedTextExcerpt: normalizeText(childText).toLowerCase(),
        summary: qaMetadataEnabled ? `Generated retrieval metadata from ${record.item.summary ?? record.heading}; local source terms: ${(childLocalTopics.length > 0 ? childLocalTopics : record.localTopics).join(', ') || 'no additional local topic terms'}.` : `Retrieval child for ${record.heading}; preserves contiguous source text and associated qualifications.`,
        topic: `${record.heading}${childLocalTopics.length > 0 ? ` — ${childLocalTopics.join(', ')}` : record.localTopics.length > 0 ? ` — ${record.localTopics.join(', ')}` : ''}`,
        headingPath: `VM-20 > ${record.heading}`,
        structuralLocator: `VM-20 / ${record.heading} / child ${index + 1}`,
        chunkLevel: 'child',
        parentChunkId: record.parentId,
        childChunkIds: [],
        precedingChunkId: allIds[childIndex - 1] ?? null,
        followingChunkId: allIds[childIndex + 1] ?? null,
        chunkingMethod: 'semantic_boundary',
        controlledTags: [...new Set([...sourceTags, ...itemTags, 'hierarchical_child', 'review_only'])],
        keywords: qaMetadataEnabled ? [...new Set(['VM-20', record.heading, record.item.sourceId ?? '', ...(childLocalTopics.length > 0 ? childLocalTopics : record.localTopics)])] : ['VM-20', record.heading, record.item.sourceId ?? ''],
        citations: [{ citationText: record.heading, pageReference: `pp. ${childPages.start}-${childPages.end}`, sectionReference: record.heading, sourceReference: source.sourceReference, lineReference: null }],
        fidelity: source.chunkDefaults?.fidelity ?? 'exact',
        confidence: source.chunkDefaults?.confidence ?? 'high',
        reviewFlags: [...new Set([...baseFlags, ...itemFlags, 'hierarchical_child', 'review_only'])],
        qualityNotes: [...baseQualityNotes, 'Child boundary follows paragraph or semantic packing within the reviewed source slice.', 'Requirement, exception, qualification, and condition text remains contiguous where present.'],
        evidenceNotes,
        ...(qaMetadataEnabled ? {
          localTopics: [...new Set([...record.localTopics, ...childLocalTopics])],
          provisionTypes: childProvisionTypes,
          provisionTypeBasis: 'source_text_pattern_only',
          structuralBreadcrumb: childBoundary.structuralBreadcrumb,
          boundaryQuality: childBoundary,
          crossReferenceCandidates: childCrossReferences,
          metadataDerivation: 'generated_from_source_text_without_source_text_rewrite',
        } : {}),
        retrievalEligible: true,
        ...(qaMetadataEnabled ? { retrievalRole: 'first_stage_retrieval' } : {}),
        promotionEligible: false,
      })
    })
  }
  return chunks
}

const buildSourceMarkdown = (sourceIndex) => {
  const { source, processing, chunks, quality } = sourceIndex
  const lines = []
  lines.push(`# ${source.sourceTitle}`)
  lines.push('')
  lines.push(`- Source ID: \`${source.sourceId}\``)
  lines.push(`- Source version ID: \`${source.sourceVersionId}\``)
  if (source.sourceEditionId || source.sourceVersionIdentifier || source.sourceSha256) {
    lines.push(`- Source edition ID: \`${source.sourceEditionId ?? 'n/a'}\``)
    lines.push(`- Source version identifier: ${source.sourceVersionIdentifier ?? 'n/a'}`)
    lines.push(`- Source SHA-256: \`${source.sourceSha256 ?? 'n/a'}\``)
  }
  lines.push(`- Source reference: ${source.sourceReference}`)
  lines.push(`- Source family: ${source.sourceFamilyId}`)
  lines.push(`- Domain: ${source.domainId}`)
  lines.push(`- Status: ${source.sourceStatus}`)
  lines.push(`- Authority: ${source.authorityLevel}`)
  lines.push(`- Jurisdiction: ${source.jurisdiction ?? 'n/a'}`)
  lines.push(`- Review batches: ${source.reviewBatchIds.join(', ')}`)
  lines.push(`- Page range: pp. ${source.pageRange.start}-${source.pageRange.end}`)
  lines.push(`- Text layer quality: ${source.textLayerQuality}`)
  lines.push(`- Page-image backstop: ${toBooleanText(source.pageImageBackstop)}`)
  if (source.sourceTextVerification) lines.push(`- Source-text verification: ${source.sourceTextVerification.sourceTextMode}; ${source.sourceTextVerification.pageRepresentationQA}`)
  lines.push(`- Line references available: ${toBooleanText(source.lineReferencesAvailable)}`)
  lines.push('')
  lines.push('## Classification')
  lines.push('')
  lines.push(`- Domain: ${source.classification?.domainId ?? source.domainId}`)
  lines.push(`- Document type: ${source.classification?.documentType ?? source.documentType}`)
  lines.push(`- Purpose: ${source.classification?.purpose ?? source.notes}`)
  lines.push(`- Intended audience: ${source.classification?.intendedAudience ?? 'n/a'}`)
  lines.push(`- Authority/source type: ${source.classification?.authoritySourceType ?? inferAuthoritySourceType(source)}`)
  lines.push(`- Recommended profile: ${source.classification?.recommendedProfile ?? inferProfileName(source)}`)
  lines.push(`- Recommended chunking strategy: ${source.classification?.recommendedChunkingStrategy ?? inferChunkingStrategy(source)}`)
  lines.push(`- Confidence: ${source.classification?.confidence ?? (source.textLayerQuality === 'clean' ? 'high' : 'medium')}`)
  lines.push('')
  if (source.profileData && Object.keys(source.profileData).length > 0) {
    lines.push('## Profile Data')
    lines.push('')
    for (const [key, value] of Object.entries(source.profileData)) {
      lines.push(`- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    }
    lines.push('')
  }
  lines.push('## Processing')
  lines.push('')
  lines.push(`- Processing mode: ${processing.processingMode}`)
  lines.push(`- Canonicality: ${processing.canonicality}`)
  lines.push(`- Review only: ${toBooleanText(processing.reviewOnly)}`)
  lines.push(`- Learner facing allowed: ${toBooleanText(processing.learnerFacingAllowed)}`)
  lines.push(`- App ready allowed: ${toBooleanText(processing.appReadyAllowed)}`)
  lines.push(`- RAG ready allowed: ${toBooleanText(processing.ragReadyAllowed)}`)
  lines.push(`- Promotion status: ${processing.promotionStatus}`)
  lines.push('')
  lines.push('## Chunks')
  lines.push('')
  lines.push('| Chunk | Pages | Topic | Kind | Fidelity | Summary |')
  lines.push('| --- | --- | --- | --- | --- | --- |')
  for (const chunk of chunks) {
    lines.push(
      `| \`${chunk.chunkId}\` | pp. ${chunk.pageStart}-${chunk.pageEnd} | ${chunk.topic.replace(/\|/g, '\\|')} | ${chunk.chunkKind} | ${chunk.fidelity} | ${chunk.summary.replace(/\|/g, '\\|')} |`,
    )
  }
  lines.push('')
  lines.push('## Quality Notes')
  lines.push('')
  lines.push(`- Citation completeness: ${quality.citationCompleteness}`)
  lines.push(`- Page-image backstop: ${toBooleanText(quality.pageImageBackstop)}`)
  lines.push(`- Line references available: ${toBooleanText(quality.lineReferencesAvailable)}`)
  lines.push(`- Notes: ${quality.notes}`)
  return `${lines.join('\n')}\n`
}

const buildRepositoryMarkdown = (manifest) => {
  const lines = []
  lines.push(`# ${manifest.repositoryName} canonical source-index POC`)
  lines.push('')
  lines.push(`- Repository purpose: ${manifest.repositoryPurpose}`)
  lines.push(`- Manifest ID: \`${manifest.repositoryManifestId}\``)
  lines.push(`- Canonical layer: ${manifest.canonicalLayer}`)
  lines.push(`- Model version: ${manifest.modelVersion}`)
  lines.push(`- Generated at: ${manifest.generatedAt}`)
  lines.push(`- Source package count: ${manifest.sourcePackageCount}`)
  lines.push(`- Chunk count: ${manifest.chunkCount}`)
  lines.push('')
  lines.push('## Export files')
  lines.push('')
  lines.push(`- Export manifest: \`${manifest.exports.exportManifestPath}\``)
  lines.push(`- JSONL: \`${manifest.exports.jsonlPath}\``)
  lines.push(`- CSV: \`${manifest.exports.csvPath}\``)
  lines.push(`- Retrieval questions: \`${manifest.exports.retrievalQuestionsPath}\``)
  lines.push(`- Retrieval results: \`${manifest.exports.retrievalResultsPath}\``)
  lines.push(`- Repository manifest: \`${manifest.exports.repositoryManifestPath}\``)
  lines.push('')
  lines.push('## Source packages')
  lines.push('')
  lines.push('| Source | Pages | Source index | Review posture |')
  lines.push('| --- | --- | --- | --- |')
  for (const pkg of manifest.sourcePackages) {
    lines.push(
      `| ${pkg.sourceTitle.replace(/\|/g, '\\|')} | pp. ${pkg.pageRange.start}-${pkg.pageRange.end} | \`${pkg.sourceIndexPath}\` | ${pkg.promotionStatus === 'promoted' ? 'canonical promoted; downstream export blocked' : 'review-only'} |`,
    )
  }
  lines.push('')
  lines.push('## Retrieval summary')
  lines.push('')
  lines.push(`- Queries evaluated: ${manifest.retrievalEvaluation.queryCount}`)
  lines.push(`- Supported queries: ${manifest.retrievalEvaluation.supportedQueryCount}`)
  lines.push(`- Unsupported queries: ${manifest.retrievalEvaluation.unsupportedQueryCount}`)
  lines.push(`- Top-1 accuracy: ${(manifest.retrievalEvaluation.top1Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Top-3 accuracy: ${(manifest.retrievalEvaluation.top3Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Top-5 accuracy: ${(manifest.retrievalEvaluation.top5Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Mean reciprocal rank: ${manifest.retrievalEvaluation.meanReciprocalRank.toFixed(3)}`)
  lines.push(`- Method: ${manifest.retrievalEvaluation.method}`)
  return `${lines.join('\n')}\n`
}

const buildExportManifest = (manifest, promotionDecision = null) => ({
  schemaVersion: manifest.schemaVersion,
  exportManifestId: `${manifest.repositoryManifestId}-exports`,
  repositoryManifestId: manifest.repositoryManifestId,
  repositoryName: manifest.repositoryName,
  generatedAt: manifest.generatedAt,
  sourcePackageCount: manifest.sourcePackageCount,
  chunkCount: manifest.chunkCount,
  exportFiles: {
    repositoryManifestPath: manifest.exports.repositoryManifestPath,
    exportManifestPath: manifest.exports.exportManifestPath,
    jsonlPath: manifest.exports.jsonlPath,
    csvPath: manifest.exports.csvPath,
    retrievalQuestionsPath: manifest.exports.retrievalQuestionsPath,
    retrievalResultsPath: manifest.exports.retrievalResultsPath,
    legacyJsonlPath: 'data/processed/source_indexes/exports/source-indexes.jsonl',
    legacyCsvPath: 'data/processed/source_indexes/exports/source-indexes.csv',
    legacyRetrievalJsonPath: 'data/processed/source_indexes/retrieval/retrieval-evaluation.json',
    legacyRetrievalMarkdownPath: 'data/processed/source_indexes/retrieval/retrieval-evaluation.md',
  },
  notes: 'Canonical source-index export manifest for the POC.',
  extensions: {
    sourceIndexPoc: true,
    ...(promotionDecision ? {
      canonicalPromotionDecisionId: promotionDecision.promotionDecisionId,
      copilotExportEligible: promotionDecision.downstreamEligibility.copilotExportEligible,
      downstreamExportDecisionRequired: true,
    } : {}),
  },
})

const buildRetrievalReadinessReport = (manifest, evaluation, config) => {
  const lines = []
  lines.push('# Retrieval readiness report')
  lines.push('')
  lines.push('## Corpus summary')
  lines.push('')
  lines.push(`- Source packages: ${manifest.sourcePackageCount}`)
  lines.push(`- Canonical chunks: ${manifest.chunkCount}`)
  lines.push(`- Retrieval questions: ${evaluation.queries.length}`)
  lines.push(`- Supported questions: ${evaluation.supportedQueryCount}`)
  lines.push(`- Unsupported questions: ${evaluation.unsupportedQueryCount}`)
  lines.push('')
  lines.push('## Metrics')
  lines.push('')
  lines.push(`- Top-1 accuracy: ${(evaluation.top1Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Top-3 accuracy: ${(evaluation.top3Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Top-5 accuracy: ${(evaluation.top5Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Mean reciprocal rank: ${evaluation.meanReciprocalRank.toFixed(3)}`)
  lines.push(`- Source-family accuracy: ${(evaluation.sourceFamilyAccuracy * 100).toFixed(0)}%`)
  lines.push(`- Authority-level accuracy: ${(evaluation.authorityLevelAccuracy * 100).toFixed(0)}%`)
  lines.push(`- Citation availability: ${(evaluation.citationAvailability * 100).toFixed(0)}%`)
  lines.push(`- Multi-chunk evidence recall: ${(evaluation.multiChunkEvidenceRecall * 100).toFixed(0)}%`)
  lines.push(`- Unsupported-query precision: ${(evaluation.unsupportedQueryPrecision * 100).toFixed(0)}%`)
  lines.push('')
  lines.push('## Category breakdown')
  lines.push('')
  lines.push('| Category | Count | Top-1 | Top-3 | Top-5 | MRR | Unsupported precision |')
  lines.push('| --- | --- | --- | --- | --- | --- | --- |')
  for (const [category, stats] of Object.entries(evaluation.categoryStats)) {
    lines.push(
      `| ${category} | ${stats.queryCount} | ${(stats.top1Accuracy * 100).toFixed(0)}% | ${(stats.top3Accuracy * 100).toFixed(0)}% | ${(stats.top5Accuracy * 100).toFixed(0)}% | ${stats.meanReciprocalRank.toFixed(3)} | ${(stats.unsupportedPrecision * 100).toFixed(0)}% |`,
    )
  }
  lines.push('')
  lines.push('## Strong signals')
  lines.push('')
  lines.push('- Exact-title questions for AG 01, AG 03, VM-20, and the companion/regulation sources are expected to rank cleanly.')
  lines.push('- Relationship-aware questions should distinguish the AG 36 active source from the 2021 Law Manual reprint.')
  lines.push('- Companion guidance and non-binding educational material should remain visible as lower-authority evidence.')
  lines.push('')
  lines.push('## Weak spots and failure analysis')
  lines.push('')
  const weakQueries = evaluation.queries.filter((query) => query.resultLabel === 'miss' || query.resultLabel === 'false_positive')
  if (weakQueries.length === 0) {
    lines.push('- No weak queries were observed in the current POC run.')
  } else {
    for (const query of weakQueries) {
      lines.push(
        `- ${query.queryCategory}: ${query.query} -> ${query.resultLabel}; top result ${query.rankedMatches[0]?.chunkId ?? 'n/a'} (${query.rankedMatches[0]?.score ?? 0})`,
      )
    }
  }
  lines.push('')
  lines.push('## Next improvement opportunities')
  lines.push('')
  lines.push('- Add more ambiguous cross-source queries if the current corpus becomes too easy.')
  lines.push('- Increase the share of relationship-heavy questions if reprint and companion-source handling needs more pressure.')
  lines.push('- Add a small synthetic pricing or liability-modeling sample later only if the generic profiles need an empirical corpus test.')
  return `${lines.join('\n')}\n`
}

const buildVm20ReviewPackage = ({ chunkRecords, sourcePackages, evaluation, promotionDecision, promotionDecisionPath }) => {
  const currentSourceIds = new Set(['vm20-framework-overview', 'vm20-framework-boundary', 'vm20-assumptions-section-3c', 'vm20-section3c-hierarchical', 'vm20-canonical-coverage', 'vm20-remaining-prose-appendix-coverage'])
  const companionSourceIds = new Set(['vm20-practice-note-companion'])
  const currentPackages = sourcePackages.filter((source) => currentSourceIds.has(source.sourceId))
  const companionPackages = sourcePackages.filter((source) => companionSourceIds.has(source.sourceId))
  const currentChunks = chunkRecords.filter((chunk) => currentSourceIds.has(chunk.sourceId))
  const companionChunks = chunkRecords.filter((chunk) => companionSourceIds.has(chunk.sourceId))
  const allChunks = [...currentChunks, ...companionChunks]
  const countBy = (chunks, property) => chunks.reduce((counts, chunk) => {
    const key = chunk[property] ?? 'unknown'
    counts[key] = (counts[key] ?? 0) + 1
    return counts
  }, {})
  const vm20Queries = evaluation.queries.filter((query) => query.queryId.startsWith('q-vm20'))
  const supportedQueries = vm20Queries.filter((query) => query.expectedOutcome !== 'unsupported')
  const unsupportedQueries = vm20Queries.filter((query) => query.expectedOutcome === 'unsupported')
  const vm20Deduplication = {
    topN: evaluation.deduplication?.topN ?? 5,
    rawTopKCollisionCount: vm20Queries.reduce((sum, query) => sum + (query.deduplication?.rawTopKCollisionGroups?.length ?? 0), 0),
    rawTopKCollisionGroupCount: new Set(vm20Queries.flatMap((query) => (query.deduplication?.rawTopKCollisionGroups ?? []).map((group) => group.parentChunkId))).size,
    postDeduplicationCollisionCount: vm20Queries.reduce((sum, query) => sum + (query.deduplication?.postDeduplicationCollisionCount ?? 0), 0),
    affectedQueries: vm20Queries.filter((query) => (query.deduplication?.rawTopKCollisionGroups?.length ?? 0) > 0).map((query) => ({ queryId: query.queryId, collisionGroups: query.deduplication.rawTopKCollisionGroups })),
  }
  const evidenceChunkIds = (sourceId, limit = 2) => chunkRecords.filter((chunk) => chunk.sourceId === sourceId).slice(0, limit).map((chunk) => chunk.chunkId)
  const explicitCrossReferences = new Map()
  for (const chunk of currentChunks) {
    for (const candidate of chunk.crossReferenceCandidates ?? []) {
      const existing = explicitCrossReferences.get(candidate.target) ?? { ...candidate, evidenceChunkIds: [] }
      if (!existing.evidenceChunkIds.includes(chunk.chunkId)) existing.evidenceChunkIds.push(chunk.chunkId)
      explicitCrossReferences.set(candidate.target, existing)
    }
  }
  const packageJson = {
    schemaVersion: '1.0',
    reviewPackageId: 'vm20-canonical-coverage-review-package-2026-08-26',
    generatedBy: 'scripts/build-source-index-poc.mjs',
    status: 'canonical_promoted',
    learnerFacing: false,
    appReady: false,
    ragReady: false,
    promoted: true,
    promotionDecision: {
      promotionDecisionId: promotionDecision.promotionDecisionId,
      decision: promotionDecision.decision,
      decisionDate: promotionDecision.decisionDate,
      scopeId: promotionDecision.scope.scopeId,
      sourceIds: promotionDecision.scope.sourceIds,
      expectedChunkCount: promotionDecision.scope.expectedChunkCount,
      decisionRecordPath: promotionDecisionPath,
      downstreamEligibility: promotionDecision.downstreamEligibility,
      reviewerRecord: promotionDecision.reviewerRecord,
      exclusions: promotionDecision.exclusions,
    },
    promotionReadiness: {
      blockersClosed: unsupportedQueries.every((query) => query.supportDecision?.supportState === 'unsupported') && (evaluation.deduplication?.postDeduplicationCollisionCount ?? 0) === 0,
      status: 'promoted_after_independent_review',
      automatedPromotion: false,
      findings: [
        { blocker: 'evidence_sufficiency', status: unsupportedQueries.every((query) => query.supportDecision?.supportState === 'unsupported') ? 'closed' : 'open', evidence: 'Generic post-retrieval support decisions classify insufficient structured/current/jurisdiction/product evidence.' },
        { blocker: 'equivalent_parent_child_top_k_duplication', status: (evaluation.deduplication?.postDeduplicationCollisionCount ?? 0) === 0 ? 'closed' : 'open', evidence: 'Structural and equivalent parent-child overlaps are suppressed from first-stage top-k while hierarchy remains intact.' },
      ],
      note: 'The readiness result was followed by the recorded independent-review decision. Promotion is limited to the six current-manual prose packages; downstream export remains separately blocked.',
    },
    scope: {
      objective: 'Complete the remaining VM-20 prose and appendix coverage while preserving the frozen source-index architecture and deferring structured current-table ingestion.',
      currentManualCoverage: 'Reviewed current-manual slices from batches 003-012 plus authoritative remaining prose and appendix extraction batches 231-234; Section 4, Section 5, Section 9, Appendix 1, and Appendix 2 prose are now represented hierarchically.',
      companionCoverage: 'Reviewed VM-20 practice-note batches 055-075 remain separately indexed non-binding historical companion guidance and are excluded from this promotion.',
      sourceAvailability: 'External raw sources remain authoritative; this package records only source text available in ignored reviewed batch outputs.'
    },
    coverage: {
      sectionsCanonicalized: [
        'Section 1 purpose and Section 2 minimum-reserve framework',
        'Section 3 Net Premium Reserve applicability, definitions, setup, formula entry, and Section 3.C assumptions',
        'Section 4 Deterministic Reserve complete extracted mechanics',
        'Section 5 Stochastic Reserve complete extracted mechanics',
        'Section 6 stochastic and deterministic exclusion tests',
        'Section 7 cash-flow model structure, starting assets, asset mechanics, scenarios, and proxy mapping',
        'Section 8 reinsurance credit and projected reinsurance cash-flow treatment',
        'Section 9 assumptions subsections A-G, including general assumptions, margins, mortality, policyholder behavior, expense, asset, and revenue-sharing assumptions',
        'Appendix 1 economic-scenario description, generator context, scenario set, and governance',
        'Appendix 2 prose basis for asset default costs, recovery rates, benchmark spreads, swap spreads, and table publication',
        'Practice-note Sections 1-21 as separately labeled companion guidance'
      ],
      sectionsMissing: [
        'Appendix 2 current prescribed asset-default, asset-spread, and swap-spread table rows and version metadata remain deferred to the structured-table milestone',
        'Independent page-image backstop and line-reference confirmation remain pending human review'
      ],
      parentCount: allChunks.filter((chunk) => chunk.chunkLevel === 'parent').length,
      childCount: allChunks.filter((chunk) => chunk.chunkLevel === 'child').length,
      currentManualParentCount: currentChunks.filter((chunk) => chunk.chunkLevel === 'parent').length,
      currentManualChildCount: currentChunks.filter((chunk) => chunk.chunkLevel === 'child').length,
      companionParentCount: companionChunks.filter((chunk) => chunk.chunkLevel === 'parent').length,
      companionChildCount: companionChunks.filter((chunk) => chunk.chunkLevel === 'child').length,
      sourceTextFidelity: { currentManual: countBy(currentChunks, 'fidelity'), companion: countBy(companionChunks, 'fidelity') },
      citationCompleteness: {
        chunksWithPageOrCitationDisplay: allChunks.filter((chunk) => chunk.citationDisplay).length,
        totalChunks: allChunks.length,
        lineReferencesAvailable: false,
        note: 'Page and section citations are present in the canonical chunks; the reviewed extraction did not preserve stable line references.'
      }
    },
    unresolvedSourceGaps: [
      'The authoritative PDF is external to the repository; ignored batches 231-234 retain its SHA-256 and exact extracted source text for this wave.',
      'The current-manual wave is source-complete for the targeted Sections 4, 5, 9 and Appendix 1-2 prose boundaries, but not a full structured-table ingestion.',
      'Practice-note text is 2020 companion guidance and must be checked against the current manual before implementation use.',
      'Table rows, version metadata, and page-image confirmation remain outside the current prose canonical layer.'
    ],
    crossReferences: [
      { target: 'VM-31', relationType: 'cross_reference_candidate', status: 'pending_human_review', evidenceChunkIds: evidenceChunkIds('vm20-canonical-coverage'), note: 'The source text points to report and demonstration support; no legal effect is inferred.' },
      { target: 'VM-A / VM-C', relationType: 'cross_reference_candidate', status: 'pending_human_review', evidenceChunkIds: evidenceChunkIds('vm20-practice-note-companion'), note: 'Practice-note references are companion guidance and do not establish current authority.' },
      { target: 'Model #820', relationType: 'cross_reference_candidate', status: 'pending_human_review', evidenceChunkIds: evidenceChunkIds('vm20-framework-overview'), note: 'The current manual framework slice names the model-law context; the model law itself is not canonicalized here.' },
      { target: 'SSAP No. 61R', relationType: 'cross_reference_candidate', status: 'pending_human_review', evidenceChunkIds: evidenceChunkIds('vm20-canonical-coverage'), note: 'The reinsurance slice records the source reference without interpreting accounting authority.' },
      { target: 'VM-20 Section 7 / Section 8 / Appendix 1 / Appendix 2', relationType: 'cross_reference_candidate', status: 'pending_human_review', evidenceChunkIds: evidenceChunkIds('vm20-remaining-prose-appendix-coverage'), note: 'The new source text records explicit operational cross-references; no legal effect or duplicate source authority is inferred.' },
      { target: 'VM-20 Appendix 2 current tables', relationType: 'coverage_gap_candidate', status: 'pending_structured_table_milestone', evidenceChunkIds: evidenceChunkIds('vm20-remaining-prose-appendix-coverage'), note: 'Appendix 2 prose explains the basis and publication locations, while generalized current table rows and version metadata remain deferred.' },
      ...[...explicitCrossReferences.values()].map((candidate) => ({ ...candidate, note: 'Review-only candidate derived from an explicit source-text reference; no applicability, supersession, or legal effect is inferred.' }))
    ],
    retrievalEvaluation: {
      queryCount: vm20Queries.length,
      supportedQueryCount: supportedQueries.length,
      unsupportedQueryCount: unsupportedQueries.length,
      top1HitCount: supportedQueries.filter((query) => query.top1Hit).length,
      top3HitCount: supportedQueries.filter((query) => query.top3Hit).length,
      top5HitCount: supportedQueries.filter((query) => query.top5Hit).length,
      top1Accuracy: supportedQueries.length ? supportedQueries.filter((query) => query.top1Hit).length / supportedQueries.length : 0,
      top3Accuracy: supportedQueries.length ? supportedQueries.filter((query) => query.top3Hit).length / supportedQueries.length : 0,
      unsupportedQueriesDetected: unsupportedQueries.filter((query) => query.resultLabel?.startsWith('unsupported')).length,
      unsupportedSupportDecisions: unsupportedQueries.map((query) => ({ queryId: query.queryId, supportState: query.supportDecision?.supportState, reasonCode: query.supportDecision?.reasonCode, reason: query.supportDecision?.reason, relatedEvidence: query.supportDecision?.relatedEvidence, corpusGap: query.supportDecision?.corpusGap })),
      meanReciprocalRank: supportedQueries.length ? supportedQueries.reduce((sum, query) => sum + query.reciprocalRank, 0) / supportedQueries.length : 0,
      deduplication: vm20Deduplication,
      corpusDeduplication: evaluation.deduplication,
      parentExpansionChecks: ['q-vm20-section5-scenario-reserve', 'q-vm20-section9-mortality-parent-context', 'q-vm20-appendix1-scenarios'].map((queryId) => {
        const query = vm20Queries.find((candidate) => candidate.queryId === queryId)
        const childChunkId = query?.expectedChunkIds?.find((chunkId) => chunkId.includes('-child-')) ?? null
        const childChunk = childChunkId ? chunkRecords.find((chunk) => chunk.chunkId === childChunkId) : null
        const parentChunk = childChunk?.parentChunkId ? chunkRecords.find((chunk) => chunk.chunkId === childChunk.parentChunkId) : null
        const childRetrieved = Boolean(query?.rankedMatches?.some((match) => match.chunkId === childChunkId))
        const parentRetrieved = Boolean(query?.rankedMatches?.some((match) => match.chunkId === parentChunk?.chunkId))
        return { queryId, childChunkId, parentChunkId: parentChunk?.chunkId ?? null, childRetrieved, parentResolvable: Boolean(parentChunk), parentRetrieved, expandedEvidenceChunkCount: parentChunk ? 2 : 0, note: 'Deterministic structural check only; the baseline evaluator does not rerank or synthesize parent-expanded answers.' }
      }),
      sourceQaPath: 'data/processed/review_packages/vm20-qa-source-spotcheck.json',
      retrievalQaReportPath: 'data/processed/review_packages/vm20-retrieval-qa-report.json',
      duplicateParentChildPolicy: 'Equivalent parent/child source excerpts are deduplicated after scoring with the child preferred; very large parents can be context-only and are expanded after child retrieval.',
      baselineBeforeExpansion: { queryCount: 22, supportedQueryCount: 20, unsupportedQueryCount: 2, top1HitCount: 14, top3HitCount: 20, top1Accuracy: 0.70, top3Accuracy: 1.0, note: 'Baseline read from the 9aff2bf retrieval result before VM-20 expansion; query set and corpus size differ from this VM-20 benchmark.' },
      queryResults: vm20Queries.map((query) => ({ queryId: query.queryId, category: query.queryCategory, expectedChunkIds: query.expectedChunkIds, top1ChunkId: query.rankedMatches?.[0]?.chunkId ?? null, top3ChunkIds: query.rankedMatches?.slice(0, 3).map((match) => match.chunkId) ?? [], top1Hit: query.top1Hit, top3Hit: query.top3Hit, resultLabel: query.resultLabel, supportState: query.supportDecision?.supportState, supportReasonCode: query.supportDecision?.reasonCode, rawTopKCollisionGroups: query.deduplication?.rawTopKCollisionGroups ?? [] }))
    },
    knownRetrievalRisks: [
      'The keyword baseline can still rank a nearby parent or companion section above a precise child when terms overlap.',
      'Long source excerpts remain useful for recall but can dilute top-1 precision for broad comparison questions.',
      'Unsupported table questions correctly remain outside the current canonical evidence package.',
      'Parent expansion remains a deterministic evidence-package step; first-stage retrieval excludes only context-only parents and equivalent duplicate excerpts.'
    ],
    humanReview: {
      decisionOptions: ['APPROVE', 'APPROVE WITH FIXES', 'REPROCESS', 'REJECT'],
      provisionalDisposition: 'APPROVE WITH FIXES',
      finalDisposition: 'APPROVE',
      rationale: 'Independent review approved the source-bound current-manual prose scope after the targeted blockers were closed. Structured tables, downstream export, historical companion guidance, and review-only relationship candidates remain outside the decision.',
      reviewHistory: [
        { stage: 'pre_promotion_review_handoff', disposition: 'APPROVE WITH FIXES', status: 'completed', note: 'The prior review package required evidence-sufficiency and retrieval-deduplication corrections before a final decision.' },
        { stage: 'final_independent_review', disposition: 'APPROVE', status: 'recorded', decisionDate: promotionDecision.decisionDate, note: 'Approval applies only to the six current-manual prose packages named in the promotion decision.' }
      ],
      requiredChecks: [
        'Preserve the approved current-manual source text, hierarchy, citations, and retrieval behavior.',
        'Keep Appendix 2 structured values review-only until their own independent table review and promotion decision.',
        'Keep the 2020 practice note non-binding, historical, review-only, and excluded from canonical authority.',
        'Keep relationship candidates pending and do not infer legal effect or supersession.',
        'Require a separate decision before learner-facing, app, RAG, or Copilot export use.'
      ]
    },
    packageInventory: [...currentPackages, ...companionPackages].map((source) => ({ sourceId: source.sourceId, title: source.sourceTitle, authorityLevel: source.authorityLevel, pageRange: source.pageRange, chunkCount: source.chunkCount, reviewBatches: source.reviewBatchIds }))
  }
  const markdown = [
    '# VM-20 Canonical Coverage Review Package', '',
    '- Status: canonical promoted (current-manual prose scope only)', '- Final disposition: APPROVE', '- Prior provisional disposition retained: APPROVE WITH FIXES', '- Learner-facing: no', '- App-ready: no', '- RAG-ready: no', '- Promoted: yes', `- Promotion decision: \`${promotionDecisionPath}\``, '',
    '## Coverage summary', '',
    `- Hierarchical parents: ${packageJson.coverage.parentCount}`,
    `- Hierarchical children: ${packageJson.coverage.childCount}`,
    `- Current-manual parents / children: ${packageJson.coverage.currentManualParentCount} / ${packageJson.coverage.currentManualChildCount}`,
    `- Companion parents / children: ${packageJson.coverage.companionParentCount} / ${packageJson.coverage.companionChildCount}`,
    `- Chunks with page or citation display: ${packageJson.coverage.citationCompleteness.chunksWithPageOrCitationDisplay}/${packageJson.coverage.citationCompleteness.totalChunks}`,
    '- Source-text fidelity: exact extracted source text for both packages; companion authority remains non-binding.', '',
    '## Sections canonicalized', '', ...packageJson.coverage.sectionsCanonicalized.map((section) => `- ${section}`), '',
    '## Sections and source packages still missing', '', ...packageJson.coverage.sectionsMissing.map((section) => `- ${section}`), '',
    '## Retrieval evaluation', '',
    `- VM-20 queries: ${packageJson.retrievalEvaluation.queryCount} (${packageJson.retrievalEvaluation.supportedQueryCount} supported, ${packageJson.retrievalEvaluation.unsupportedQueryCount} unsupported)`,
    `- Supported top-1: ${packageJson.retrievalEvaluation.top1HitCount}/${packageJson.retrievalEvaluation.supportedQueryCount}`,
    `- Supported top-3: ${packageJson.retrievalEvaluation.top3HitCount}/${packageJson.retrievalEvaluation.supportedQueryCount}`,
    `- Unsupported queries detected: ${packageJson.retrievalEvaluation.unsupportedQueriesDetected}/${packageJson.retrievalEvaluation.unsupportedQueryCount}`,
    `- Mean reciprocal rank: ${packageJson.retrievalEvaluation.meanReciprocalRank.toFixed(3)}`,
    `- Raw equivalent parent-child top-k collision slots: ${packageJson.retrievalEvaluation.deduplication?.rawTopKCollisionCount ?? 0}; post-deduplication: ${packageJson.retrievalEvaluation.deduplication?.postDeduplicationCollisionCount ?? 0}`,
    '- Retrieval uses generic local-topic metadata, equivalent parent/child deduplication, and context-only handling for very large parents; no question-specific rule was added.',
    '- Raw PDF spot-check: `data/processed/review_packages/vm20-qa-source-spotcheck.json`.',
    '- Full 26-query report: `data/processed/review_packages/vm20-retrieval-qa-report.json`.', '',
    '## Promotion readiness', '',
    `- Blocking findings closed: ${packageJson.promotionReadiness.blockersClosed ? 'Yes' : 'No'}`,
    '- Automated promotion: no; the final independent-review decision is recorded.', '',
    '## Human review', '', packageJson.humanReview.rationale, '', ...packageJson.humanReview.requiredChecks.map((check) => `- ${check}`), '',
    '## Governance boundary', '', 'Promotion applies only to the six reviewed current-manual prose packages. It does not promote structured tables, the 2020 practice note, relationship candidates, or any learner-facing, application, RAG, or Copilot export use.', ''
  ].join('\n')
  return { packageJson, markdown }
}

const main = async () => {
  const config = await readJson(configPath)
  if (!config.promotionDecisionPath) throw new Error('Missing promotionDecisionPath in source-index config.')
  const promotionDecisionPath = toRelativePosix(config.promotionDecisionPath)
  const promotionDecision = await readJson(path.resolve(repoRoot, config.promotionDecisionPath))
  if (promotionDecision.decision !== 'approved_for_canonical_promotion') throw new Error('Promotion decision is not approved.')
  const promotionDecisionPaths = [config.promotionDecisionPath, ...asArray(config.additionalPromotionDecisionPaths)]
  const promotionDecisionRecords = await Promise.all(promotionDecisionPaths.map(async (decisionPath) => ({
    path: toRelativePosix(decisionPath),
    decision: await readJson(path.resolve(repoRoot, decisionPath)),
  })))
  const promotionBySourceId = new Map()
  for (const record of promotionDecisionRecords) {
    if (record.decision.decision !== 'approved_for_canonical_promotion' || record.decision.reviewEvidence?.blockersClosed !== true) throw new Error(`Promotion decision is not approved with closed blockers: ${record.path}`)
    for (const sourceId of record.decision.scope?.sourceIds ?? []) {
      if (promotionBySourceId.has(sourceId)) throw new Error(`Source ${sourceId} appears in multiple promotion decisions.`)
      promotionBySourceId.set(sourceId, record)
    }
  }
  const promotedSourceIds = new Set(promotionBySourceId.keys())
  const generatedAt = config.generatedAt ?? new Date().toISOString()
  await ensureDir(outputRoot)
  await ensureDir(sourcesRoot)
  await ensureDir(exportsRoot)
  await ensureDir(evaluationRoot)
  await ensureDir(classificationRoot)
  await ensureDir(legacyRetrievalRoot)
  await ensureDir(reviewPackagesRoot)

  const chunkRecords = []
  const sourcePackages = []
  const classificationRecords = []

  for (const source of config.sources) {
    const sourceVersionId = source.sourceVersionId ?? source.sourceIndexId
    const sourceIndexPath = path.join(sourcesRoot, `${source.sourceId}.json`)
    const markdownPath = path.join(sourcesRoot, `${source.sourceId}.md`)
    let processingCreatedAt = source.processingCreatedAt ?? generatedAt
    if (!source.processingCreatedAt) try {
      const previous = await readJson(sourceIndexPath)
      processingCreatedAt = previous.processing?.createdAt ?? generatedAt
    } catch {
      // New packages use the deterministic config timestamp.
    }
    const sourceRelationships = asArray(source.relationships)
    const hydratedChunks = source.definitionInput
      ? await buildVm01DefinitionChunks(repoRoot, source)
      : source.vm21Input
        ? await buildVm21Chunks(repoRoot, source)
      : source.vm22Input
        ? await buildVm22Chunks(repoRoot, source)
      : source.vm30Input
        ? await buildVm30Chunks(repoRoot, source)
      : source.vm31Input
        ? await buildVm31Chunks(repoRoot, source)
      : source.batchCoverageInput
        ? await buildBatchCoverageChunks(source)
        : await buildHierarchicalChunks(source)
    const sourcePromotion = promotionBySourceId.get(source.sourceId) ?? null
    const promoted = Boolean(sourcePromotion)
    const sourceChunks = asArray(hydratedChunks).map((chunk, index) =>
      deriveChunk(
        {
          ...source,
          sourceVersionId,
          chunkDefaults: source.chunkDefaults ?? {},
          relationships: sourceRelationships,
        },
        chunk,
        index,
        toRelativePosix(path.relative(repoRoot, sourceIndexPath)),
      ),
    ).map((chunk) => promoted ? { ...chunk, promotionEligible: true } : chunk)

    const sourceIndex = {
      schemaVersion: config.schemaVersion,
      sourceIndexId: source.sourceIndexId,
      repositoryManifestId: config.pocId,
      sourceVersionId,
      source: {
        classification: buildClassification(source),
        profileData: source.profileData ?? null,
        sourceId: source.sourceId,
        sourceVersionId,
        filename: source.filename,
        filePath: source.filePath,
        sourceFamilyId: source.sourceFamilyId,
        domainId: source.domainId,
        documentType: source.documentType,
        sourceTitle: source.sourceTitle,
        sourceReference: source.sourceReference,
        jurisdiction: source.jurisdiction,
        authorityLevel: source.authorityLevel,
        sourceStatus: source.sourceStatus,
        versionDate: source.versionDate ?? null,
        ...(source.sourceEditionId ? { sourceEditionId: source.sourceEditionId } : {}),
        ...(source.sourceVersionIdentifier ? { sourceVersionIdentifier: source.sourceVersionIdentifier } : {}),
        ...(source.sourceSha256 ? { sourceSha256: source.sourceSha256 } : {}),
        ...(source.sourceTextVerification ? { sourceTextVerification: source.sourceTextVerification } : {}),
        ...(source.coverageDeclarations ? { coverageDeclarations: source.coverageDeclarations } : {}),
        pageCount: source.pageCount,
        pageRange: source.pageRange,
        reviewBatchIds: source.reviewBatchIds,
        reviewIndexPath: source.reviewIndexPath,
        selfReviewPath: source.selfReviewPath,
        pageImageBackstop: source.pageImageBackstop,
        lineReferencesAvailable: source.lineReferencesAvailable,
        textLayerQuality: source.textLayerQuality,
        notes: source.notes,
      },
      processing: {
        createdAt: processingCreatedAt,
        createdBy: 'scripts/build-source-index-poc.mjs',
        processingMode: promoted || source.canonicalCandidate ? 'canonical_index' : 'canonical_index_poc',
        canonicality: promoted || source.canonicalCandidate ? 'canonical' : 'poc',
        reviewOnly: !promoted,
        learnerFacingAllowed: false,
        appReadyAllowed: false,
        ragReadyAllowed: false,
        promotionStatus: promoted ? 'promoted' : 'not_promoted',
        notes: promoted
          ? sourcePromotion.path === promotionDecisionPath
            ? `Promoted for the recorded current-manual prose scope; downstream export remains blocked. Decision: ${sourcePromotion.path}`
            : `Promoted for the scope recorded in ${sourcePromotion.path}; downstream export remains blocked.`
          : source.notes,
      },
      chunks: sourceChunks,
      relationships: sourceRelationships,
      quality: {
        textLayerQuality: source.textLayerQuality,
        citationCompleteness: source.lineReferencesAvailable ? 'mostly_complete' : 'partial',
        pageImageBackstop: source.pageImageBackstop,
        lineReferencesAvailable: source.lineReferencesAvailable,
        notes: source.qualityNotes ?? source.notes,
      },
      exportHints: {
        jsonlEligible: true,
        csvEligible: true,
        vectorEligible: promoted || source.canonicalCandidate ? false : true,
        notes: promoted || source.canonicalCandidate ? 'Canonical JSONL/CSV serialization is available for review and audit; vector, learner, app, RAG, and Copilot export remain blocked pending a separate decision.' : 'Backend-neutral POC exports generated from review-only batch artifacts.',
      },
      notes: source.notes,
      extensions: {
        batchIds: source.reviewBatchIds,
        sourceIndexGeneratedBy: 'build-source-index-poc',
        ...source.extensions,
        ...(promoted ? { promotionDecisionId: sourcePromotion.decision.promotionDecisionId, promotionDecisionPath: sourcePromotion.path } : {}),
      },
    }

    await fs.writeFile(sourceIndexPath, `${JSON.stringify(sourceIndex, null, 2)}\n`, 'utf8')
    await fs.writeFile(markdownPath, buildSourceMarkdown(sourceIndex), 'utf8')

    sourcePackages.push({
      sourceIndexId: source.sourceIndexId,
      classification: buildClassification(source),
      sourceId: source.sourceId,
      sourceVersionId,
      sourceTitle: source.sourceTitle,
      sourceFamilyId: source.sourceFamilyId,
      documentType: source.documentType,
      sourceStatus: source.sourceStatus,
      ...(source.sourceEditionId ? { sourceEditionId: source.sourceEditionId } : {}),
      ...(source.sourceVersionIdentifier ? { sourceVersionIdentifier: source.sourceVersionIdentifier } : {}),
      ...(source.sourceSha256 ? { sourceSha256: source.sourceSha256 } : {}),
      ...(source.sourceTextVerification ? { sourceTextVerification: source.sourceTextVerification } : {}),
      ...(source.coverageDeclarations ? { coverageDeclarations: source.coverageDeclarations } : {}),
      sourceReference: source.sourceReference,
      jurisdiction: source.jurisdiction,
      authorityLevel: source.authorityLevel,
      pageRange: source.pageRange,
      chunkCount: sourceChunks.length,
      reviewBatchIds: source.reviewBatchIds,
      sourceIndexPath: toRelativePosix(path.relative(repoRoot, sourceIndexPath)),
      markdownPath: toRelativePosix(path.relative(repoRoot, markdownPath)),
      reviewIndexPath: source.reviewIndexPath,
      selfReviewPath: source.selfReviewPath,
      relationships: sourceRelationships,
      textLayerQuality: source.textLayerQuality,
      pageImageBackstop: source.pageImageBackstop,
      lineReferencesAvailable: source.lineReferencesAvailable,
      reviewOnly: !promoted,
      promotionStatus: promoted ? 'promoted' : 'not_promoted',
      ...(promoted ? { promotionDecisionPath: sourcePromotion.path } : {}),
      notes: source.notes,
    })

    classificationRecords.push({
      repositoryManifestId: config.pocId,
      sourceIndexId: source.sourceIndexId,
      sourceId: source.sourceId,
      sourceTitle: source.sourceTitle,
      sourceFamilyId: source.sourceFamilyId,
      domainId: source.domainId,
      documentType: source.documentType,
      classification: buildClassification(source),
      reviewIndexPath: source.reviewIndexPath,
      selfReviewPath: source.selfReviewPath,
    })

    for (const chunk of sourceChunks) {
      chunkRecords.push({
        repositoryManifestId: config.pocId,
        sourceIndexId: source.sourceIndexId,
        sourceVersionId,
        sourceId: source.sourceId,
        sourceTitle: source.sourceTitle,
        sourceFamilyId: source.sourceFamilyId,
        domainId: source.domainId,
        documentType: source.documentType,
        sourceReference: source.sourceReference,
        jurisdiction: source.jurisdiction,
        sourceStatus: source.sourceStatus,
        ...(source.sourceEditionId ? { sourceEditionId: source.sourceEditionId } : {}),
        ...(source.sourceVersionIdentifier ? { sourceVersionIdentifier: source.sourceVersionIdentifier } : {}),
        ...(source.sourceSha256 ? { sourceSha256: source.sourceSha256 } : {}),
        ...(source.sourceTextVerification ? { sourceTextVerification: source.sourceTextVerification } : {}),
        ...(source.coverageDeclarations ? { coverageDeclarations: source.coverageDeclarations } : {}),
        authorityLevel: source.authorityLevel,
        pageStart: chunk.pageStart,
        pageEnd: chunk.pageEnd,
        pageReference: `pp. ${chunk.pageStart}-${chunk.pageEnd}`,
        headingPath: chunk.headingPath,
        sectionReference: chunk.sectionReference,
        topic: chunk.topic,
        lineReference: chunk.lineReference ?? null,
        chunkId: chunk.chunkId,
        chunkOrdinal: chunk.chunkOrdinal,
        chunkKind: chunk.chunkKind,
        sourceTextType: chunk.sourceTextType,
        chunkLevel: chunk.chunkLevel,
        parentChunkId: chunk.parentChunkId,
        childChunkIds: chunk.childChunkIds,
        precedingChunkId: chunk.precedingChunkId,
        followingChunkId: chunk.followingChunkId,
        structuralLocator: chunk.structuralLocator,
        chunkingMethod: chunk.chunkingMethod,
        sourceTextExcerpt: chunk.sourceTextExcerpt,
        normalizedTextExcerpt: chunk.normalizedTextExcerpt,
        normalizedSearchText: chunk.normalizedSearchText,
        summary: chunk.summary,
        keyPoints: chunk.keyPoints,
        concepts: chunk.concepts,
        definedTerms: chunk.definedTerms,
        acronyms: chunk.acronyms,
        requirements: chunk.requirements,
        citationDisplay: chunk.citationDisplay,
        controlledTags: chunk.controlledTags,
        keywords: chunk.keywords,
        localTopics: chunk.localTopics,
        provisionTypes: chunk.provisionTypes,
        provisionTypeBasis: chunk.provisionTypeBasis,
        structuralBreadcrumb: chunk.structuralBreadcrumb,
        boundaryQuality: chunk.boundaryQuality,
        crossReferenceCandidates: chunk.crossReferenceCandidates,
        metadataDerivation: chunk.metadataDerivation,
        reviewFlags: chunk.reviewFlags,
        fidelity: chunk.fidelity,
        confidence: chunk.confidence,
        retrievalEligible: chunk.retrievalEligible,
        retrievalRole: chunk.retrievalRole,
        promotionEligible: chunk.promotionEligible,
        canonicalSourceIndexPath: chunk.canonicalSourceIndexPath,
        relationshipIds: chunk.relationshipIds,
        relationships: chunk.relationships,
        reviewIndexPath: source.reviewIndexPath,
        selfReviewPath: source.selfReviewPath,
        batchIds: source.reviewBatchIds,
        textLayerQuality: source.textLayerQuality,
        pageImageBackstop: source.pageImageBackstop,
        lineReferencesAvailable: source.lineReferencesAvailable,
      })
    }
  }

  const exportManifest = buildExportManifest({
    schemaVersion: config.schemaVersion,
    repositoryManifestId: config.pocId,
    repositoryName: config.repositoryName,
    generatedAt,
    sourcePackageCount: sourcePackages.length,
    chunkCount: chunkRecords.length,
    exports: {
      repositoryManifestPath: 'data/processed/source_indexes/repository-manifest.json',
      exportManifestPath: 'data/processed/source_indexes/exports/export_manifest.json',
      jsonlPath: 'data/processed/source_indexes/exports/source_chunks.jsonl',
      csvPath: 'data/processed/source_indexes/exports/source_chunks.csv',
      retrievalQuestionsPath: 'data/processed/source_indexes/evaluation/retrieval_questions.json',
      retrievalResultsPath: 'data/processed/source_indexes/evaluation/retrieval_results.json',
      classificationPath: 'data/processed/source_indexes/classification/source-classifications.json',
      reviewPackagePath: 'data/processed/review_packages/vm20-canonical-coverage-review-package.json',
    },
  }, promotionDecision)

  const repositoryManifest = {
    schemaVersion: config.schemaVersion,
    repositoryManifestId: config.pocId,
    repositoryName: config.repositoryName,
    repositoryPurpose: config.repositoryPurpose,
    generatedAt,
    canonicalLayer: 'source-index',
    modelVersion: config.modelVersion,
    domainProfiles: config.domainProfiles,
    sourcePackageCount: sourcePackages.length,
    sourcePackages,
    chunkCount: chunkRecords.length,
    exports: {
      repositoryManifestPath: 'data/processed/source_indexes/repository-manifest.json',
      exportManifestPath: 'data/processed/source_indexes/exports/export_manifest.json',
      jsonlPath: 'data/processed/source_indexes/exports/source_chunks.jsonl',
      csvPath: 'data/processed/source_indexes/exports/source_chunks.csv',
      retrievalQuestionsPath: 'data/processed/source_indexes/evaluation/retrieval_questions.json',
      retrievalResultsPath: 'data/processed/source_indexes/evaluation/retrieval_results.json',
      retrievalEvaluationPath: 'data/processed/source_indexes/retrieval/retrieval-evaluation.json',
      notes: 'Canonical source-index POC exports.',
    },
    retrievalEvaluation: {
      evaluationId: `${config.pocId}-retrieval`,
      method: 'keyword_phrase_overlap_baseline',
      queryCount: config.retrievalQueries.length,
      top1HitCount: 0,
      top3Coverage: 0,
      notes: 'Filled after retrieval evaluation runs.',
    },
    notes: 'Canonical source-index proof of concept.',
    extensions: {
      sourceIndexPoc: true,
      promotionDecisionId: promotionDecision.promotionDecisionId,
      promotionDecisionPath,
      promotionDecisionIds: promotionDecisionRecords.map((record) => record.decision.promotionDecisionId),
      promotionDecisionPaths: promotionDecisionRecords.map((record) => record.path),
      promotedSourcePackageCount: sourcePackages.filter((source) => source.promotionStatus === 'promoted').length,
      promotedChunkCount: chunkRecords.filter((chunk) => chunk.promotionEligible).length,
    },
  }

  const evaluation = evaluateQueries({
    queries: config.retrievalQueries,
    chunkRecords,
    sourcePackages,
    unsupportedThreshold: config.retrievalSettings?.unsupportedThreshold ?? 3,
    topN: config.retrievalSettings?.topN ?? 5,
  })

  repositoryManifest.retrievalEvaluation = {
    evaluationId: `${config.pocId}-retrieval`,
    method: evaluation.method,
    queryCount: config.retrievalQueries.length,
    supportedQueryCount: evaluation.supportedQueryCount,
    unsupportedQueryCount: evaluation.unsupportedQueryCount,
    top1HitCount: evaluation.top1HitCount,
    top3HitCount: evaluation.top3HitCount,
    top5HitCount: evaluation.top5HitCount,
    top1Accuracy: evaluation.top1Accuracy,
    top3Accuracy: evaluation.top3Accuracy,
    top5Accuracy: evaluation.top5Accuracy,
    meanReciprocalRank: evaluation.meanReciprocalRank,
    sourceFamilyAccuracy: evaluation.sourceFamilyAccuracy,
    authorityLevelAccuracy: evaluation.authorityLevelAccuracy,
    citationAvailability: evaluation.citationAvailability,
    multiChunkEvidenceRecall: evaluation.multiChunkEvidenceRecall,
    unsupportedQueryPrecision: evaluation.unsupportedQueryPrecision,
    top3Coverage: config.retrievalQueries.length === 0 ? 0 : evaluation.top3HitCount / config.retrievalQueries.length,
    notes: `Keyword baseline retrieved ${evaluation.top1HitCount} top-1 hits and ${evaluation.top3HitCount} top-3 hits across ${config.retrievalQueries.length} queries.`,
  }

  // Keep the independently approved VM-20 review package on its accepted
  // corpus/query boundary. Adding the VM-01 terminology layer may change the
  // global mixed-corpus ranking, but it must not rewrite the historical VM-20
  // promotion evidence as though that later corpus existed during review.
  const vm20ReviewEvaluation = evaluateQueries({
    queries: config.retrievalQueries.filter((query) => !query.queryId.startsWith('q-vm01-')),
    chunkRecords: chunkRecords.filter((chunk) => chunk.sourceId !== 'vm01-definitions'),
    sourcePackages: sourcePackages.filter((source) => source.sourceId !== 'vm01-definitions'),
    unsupportedThreshold: config.retrievalSettings?.unsupportedThreshold ?? 3,
    topN: config.retrievalSettings?.topN ?? 5,
  })
  const vm20ReviewPackage = buildVm20ReviewPackage({ chunkRecords: chunkRecords.filter((chunk) => chunk.sourceId !== 'vm01-definitions'), sourcePackages: sourcePackages.filter((source) => source.sourceId !== 'vm01-definitions'), evaluation: vm20ReviewEvaluation, promotionDecision, promotionDecisionPath })
  const vm20ReviewPackageJsonPath = path.join(reviewPackagesRoot, 'vm20-canonical-coverage-review-package.json')
  const vm20ReviewPackageMarkdownPath = path.join(reviewPackagesRoot, 'vm20-canonical-coverage-review-package.md')
  await fs.writeFile(vm20ReviewPackageJsonPath, `${JSON.stringify(vm20ReviewPackage.packageJson, null, 2)}\n`, 'utf8')
  await fs.writeFile(vm20ReviewPackageMarkdownPath, vm20ReviewPackage.markdown, 'utf8')
  repositoryManifest.reviewPackagePath = 'data/processed/review_packages/vm20-canonical-coverage-review-package.json'
  repositoryManifest.exports.reviewPackagePath = 'data/processed/review_packages/vm20-canonical-coverage-review-package.json'

  const repositoryManifestPath = path.join(outputRoot, 'repository-manifest.json')
  const repositoryManifestMdPath = path.join(outputRoot, 'repository-manifest.md')
  await fs.writeFile(repositoryManifestPath, `${JSON.stringify(repositoryManifest, null, 2)}\n`, 'utf8')
  await fs.writeFile(repositoryManifestMdPath, buildRepositoryMarkdown(repositoryManifest), 'utf8')

  const exportManifestPath = path.join(exportsRoot, 'export_manifest.json')
  await fs.writeFile(exportManifestPath, `${JSON.stringify(exportManifest, null, 2)}\n`, 'utf8')

  const jsonlPath = path.join(exportsRoot, 'source_chunks.jsonl')
  const csvPath = path.join(exportsRoot, 'source_chunks.csv')
  const legacyJsonlPath = path.join(exportsRoot, 'source-indexes.jsonl')
  const legacyCsvPath = path.join(exportsRoot, 'source-indexes.csv')
  const jsonlContent = `${chunkRecords.map((record) => JSON.stringify(record)).join('\n')}\n`
  await fs.writeFile(jsonlPath, jsonlContent, 'utf8')
  await fs.writeFile(legacyJsonlPath, jsonlContent, 'utf8')

  const csvHeaders = [
    'repositoryManifestId',
    'sourceIndexId',
    'sourceVersionId',
    'sourceId',
    'sourceTitle',
    'sourceFamilyId',
    'domainId',
    'documentType',
    'sourceReference',
    'jurisdiction',
    'authorityLevel',
    'sourceStatus',
    'chunkId',
    'chunkOrdinal',
    'chunkKind',
    'sourceTextType',
    'chunkLevel',
    'parentChunkId',
    'childChunkIds',
    'precedingChunkId',
    'followingChunkId',
    'structuralLocator',
    'chunkingMethod',
    'pageStart',
    'pageEnd',
    'pageReference',
    'headingPath',
    'sectionReference',
    'topic',
    'sourceTextExcerpt',
    'normalizedTextExcerpt',
    'normalizedSearchText',
    'summary',
    'keyPoints',
    'concepts',
    'definedTerms',
    'acronyms',
    'requirements',
    'citationDisplay',
    'controlledTags',
    'keywords',
    'fidelity',
    'confidence',
    'retrievalEligible',
    'promotionEligible',
    'relationshipIds',
    'reviewIndexPath',
    'selfReviewPath',
    'batchIds',
    'textLayerQuality',
    'pageImageBackstop',
    'lineReferencesAvailable',
    'canonicalSourceIndexPath',
  ]
  const csvLines = [csvHeaders.join(',')]
  for (const record of chunkRecords) {
    csvLines.push(
      csvHeaders
        .map((header) => {
          const value = record[header]
          if (Array.isArray(value)) {
            return csvEscape(value.join('|'))
          }
          if (typeof value === 'boolean') {
            return value ? 'true' : 'false'
          }
          return csvEscape(value)
        })
        .join(','),
    )
  }
  csvLines.push('')
  await fs.writeFile(csvPath, `${csvLines.join('\n')}`, 'utf8')
  await fs.writeFile(legacyCsvPath, `${csvLines.join('\n')}`, 'utf8')

  const questionsPath = path.join(evaluationRoot, 'retrieval_questions.json')
  const resultsPath = path.join(evaluationRoot, 'retrieval_results.json')
  const legacyResultsPath = path.join(legacyRetrievalRoot, 'retrieval-evaluation.json')
  const legacyMarkdownPath = path.join(legacyRetrievalRoot, 'retrieval-evaluation.md')

  const questionsDocument = {
    schemaVersion: config.schemaVersion,
    repositoryManifestId: config.pocId,
    method: evaluation.method,
    queryCount: config.retrievalQueries.length,
    queries: config.retrievalQueries,
    notes: 'Canonical retrieval questions for the source-index POC.',
  }
  await fs.writeFile(questionsPath, `${JSON.stringify(questionsDocument, null, 2)}\n`, 'utf8')

  const resultsDocument = {
    schemaVersion: config.schemaVersion,
    evaluationId: `${config.pocId}-retrieval`,
    repositoryManifestId: config.pocId,
    method: evaluation.method,
    supportedQueryCount: evaluation.supportedQueryCount,
    unsupportedQueryCount: evaluation.unsupportedQueryCount,
    top1HitCount: evaluation.top1HitCount,
    top3HitCount: evaluation.top3HitCount,
    top5HitCount: evaluation.top5HitCount,
    top1Accuracy: evaluation.top1Accuracy,
    top3Accuracy: evaluation.top3Accuracy,
    top5Accuracy: evaluation.top5Accuracy,
    meanReciprocalRank: evaluation.meanReciprocalRank,
    sourceFamilyAccuracy: evaluation.sourceFamilyAccuracy,
    authorityLevelAccuracy: evaluation.authorityLevelAccuracy,
    citationAvailability: evaluation.citationAvailability,
    multiChunkEvidenceRecall: evaluation.multiChunkEvidenceRecall,
    unsupportedQueryPrecision: evaluation.unsupportedQueryPrecision,
    deduplication: evaluation.deduplication,
    categoryStats: evaluation.categoryStats,
    queries: evaluation.queries,
    notes: 'Canonical retrieval evaluation generated from the source-index POC.',
  }
  await fs.writeFile(resultsPath, `${JSON.stringify(resultsDocument, null, 2)}\n`, 'utf8')
  await fs.writeFile(legacyResultsPath, `${JSON.stringify(resultsDocument, null, 2)}\n`, 'utf8')
  await fs.writeFile(legacyMarkdownPath, buildRetrievalMarkdown(evaluation), 'utf8')

  const classificationPath = path.join(classificationRoot, 'source-classifications.json')
  const classificationMarkdownPath = path.join(classificationRoot, 'source-classifications.md')
  const classificationDocument = {
    schemaVersion: config.schemaVersion,
    repositoryManifestId: config.pocId,
    sourceCount: classificationRecords.length,
    classifications: classificationRecords,
    notes: 'Canonical classification stage for the source-index POC.',
  }
  await fs.writeFile(classificationPath, `${JSON.stringify(classificationDocument, null, 2)}\n`, 'utf8')
  await fs.writeFile(
    classificationMarkdownPath,
    buildClassificationMarkdown(
      {
        repositoryName: config.repositoryName,
        repositoryManifestId: config.pocId,
      },
      classificationRecords,
    ),
    'utf8',
  )

  const retrievalReportPath = path.join(repoRoot, 'docs', 'retrieval_readiness_report.md')
  await fs.writeFile(retrievalReportPath, buildRetrievalReadinessReport(repositoryManifest, evaluation, config), 'utf8')

  const sourceIndexReadmePath = path.join(outputRoot, 'README.md')
  const sourceIndexReadme = [
    '# Canonical source-index POC',
    '',
    'This directory contains the backend-neutral canonical source-index proof of concept.',
    '',
    '- `sources/` contains one JSON + Markdown pair per source.',
    '- `exports/` contains the canonical JSONL and CSV exports plus the export manifest.',
    '- `evaluation/` contains the retrieval questions and evaluation results.',
    '- `retrieval/` contains a legacy compatibility summary for earlier handoff notes.',
    '- `repository-manifest.json` ties the package together.',
    '',
    'Packages retain per-source governance. Explicitly promoted VM-20 packages remain promoted; VM-01 and other unpromoted packages remain review-only. No package replaces the underlying review evidence or grants downstream export eligibility.',
    '',
  ].join('\n')
  await fs.writeFile(sourceIndexReadmePath, `${sourceIndexReadme}\n`, 'utf8')

  console.log(`Built ${sourcePackages.length} canonical source packages and ${chunkRecords.length} chunks.`)
  console.log(`Repository manifest: ${path.relative(repoRoot, repositoryManifestPath)}`)
  console.log(`Export manifest: ${path.relative(repoRoot, exportManifestPath)}`)
  console.log(`Retrieval evaluation top-1 hits: ${evaluation.top1HitCount}/${config.retrievalQueries.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
