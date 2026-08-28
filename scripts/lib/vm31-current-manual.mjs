import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export const VM31_SOURCE_SHA256 = '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9'
export const VM31_PAGE_RANGE = { start: 341, end: 386 }
export const VM31_PARENT_COUNT = 9
export const VM31_CHILD_COUNT = 75
export const VM31_CHUNK_COUNT = VM31_PARENT_COUNT + VM31_CHILD_COUNT

const parentSpecs = [
  {
    id: 'section-1-purpose',
    title: 'Section 1: Purpose',
    anchor: 'Section 1 Purpose',
    occurrence: 2,
    children: [{ id: 'purpose', title: 'Purpose', anchor: 'Section 1 Purpose', occurrence: 1 }],
  },
  {
    id: 'section-2-general-requirements',
    title: 'Section 2: General Requirements',
    anchor: 'Section 2 General Requirements',
    occurrence: 2,
    children: [
      ['a-annual-report-applicability', 'A. Annual report applicability and assigned actuaries', 'A Each year a company shall prepare'],
      ['b-material-decisions', 'B. Material decisions and minimum documentation', 'B The PBR Actuarial Report must include descriptions'],
      ['c-submission-timing', 'C. Summary and full-report submission timing', 'C The Executive Summary Life Summary and Annuity Summary'],
      ['d-seven-year-retention', 'D. Seven-year retention and reproducibility documentation', 'D The company shall retain on file'],
      ['e-searchable-pdf-and-data', 'E. Searchable PDF, graphs, and accompanying data', 'E The PBR Actuarial Report shall be submitted in searchable'],
    ],
  },
  {
    id: 'section-3-a-report-order-and-applicability',
    title: 'Section 3.A: Report order and applicability',
    anchor: 'Section 3 PBR Actuarial Report Requirements',
    occurrence: 2,
    children: [{ id: 'report-order-and-applicability', title: 'A. Report order, headers, and applicability', anchor: 'Section 3 PBR Actuarial Report Requirements', occurrence: 1 }],
  },
  {
    id: 'section-3-b-executive-summary',
    title: 'Section 3.B: Executive Summary',
    anchor: 'B Executive Summary',
    children: [
      ['general-requirement', 'Executive Summary general requirement', 'B Executive Summary'],
      ['1-qualified-actuary', '1. Qualified Actuary', '1 Qualified Actuary'],
      ['2-groups-of-policies-and-contracts', '2. Groups of Policies and/or Contracts', '2 Groups of Policies and or Contracts'],
      ['3-policies', '3. Policies', '3 Policies'],
      ['4-contracts', '4. Contracts', '4 Contracts'],
      ['5-high-level-results', '5. High-Level Results', '5 High Level Results'],
      ['6-governance', '6. Governance', '6 Governance'],
    ],
  },
  {
    id: 'section-3-c-life-summary',
    title: 'Section 3.C: Life Summary',
    anchor: 'C Life Summary',
    children: [
      ['general-requirement', 'Life Summary general requirement', 'C Life Summary'],
      ['1-vm20-materiality', '1. VM-20 Materiality', '1 VM 20 Materiality'],
      ['2-monitored-risks', '2. Monitored Risks and Findings or Concerns', '2 Monitored Risks and Findings or Concerns'],
      ['3-changes-in-reserve-amounts', '3. Changes in Reserve Amounts', '3 Changes in Reserve Amounts'],
      ['4-changes-in-methods', '4. Changes in Methods', '4 Changes in Methods'],
      ['5-assets-and-risk-management', '5. Assets and Risk Management', '5 Assets and Risk Management'],
      ['6-consistency-between-sub-reports', '6. Consistency between Life Sub-Reports', '6 Consistency between Life Sub Reports'],
      ['7-closing-section', '7. Closing Section', '7 Closing Section'],
      ['8-supplement-part-1', '8. Supplement Part 1', '8 Supplement Part 1'],
      ['9-supplement-part-2', '9. Supplement Part 2', '9 Supplement Part 2'],
      ['10-reconciliation-of-reported-values', '10. Reconciliation of Reported Values', '10 Reconciliation of Reported Values'],
    ],
  },
  {
    id: 'section-3-d-life-report',
    title: 'Section 3.D: Life Report',
    anchor: 'D Life Report',
    children: [
      ['general-requirement', 'Life Report general requirement', 'D Life Report'],
      ['1-assumptions-and-margins', '1. Assumptions and Margins', '1 Assumptions and Margins'],
      ['2-cash-flow-models', '2. Cash-Flow Models', '2 Cash Flow Models'],
      ['3-mortality', '3. Mortality', '3 Mortality'],
      ['4-policyholder-behavior', '4. Policyholder Behavior', '4 Policyholder Behavior'],
      ['5-expenses', '5. Expenses', '5 Expenses'],
      ['6-assets', '6. Assets', '6 Assets'],
      ['7-revenue-sharing-assumptions', '7. Revenue-Sharing Assumptions', '7 Revenue Sharing Assumptions'],
      ['8-reinsurance', '8. Reinsurance', '8 Reinsurance'],
      ['9-non-guaranteed-elements', '9. Non-guaranteed Elements', '9 Non guaranteed Elements'],
      ['10-exclusion-tests', '10. Exclusion Tests', '10 Exclusion Tests'],
      ['11-additional-information', '11. Additional Information', '11 Additional Information'],
      ['12-riders-and-supplemental-benefits', '12. Riders and Supplemental Benefits', '12 Riders and Supplemental Benefits'],
      ['13-reliance-descriptions-and-statements', '13. Reliance Descriptions and Statements', '13 Reliance Descriptions and Statements'],
      ['14-certifications', '14. Certifications', '14 Certifications'],
      ['15-closing-paragraph', '15. Closing Paragraph', '15 Closing Paragraph'],
    ],
  },
  {
    id: 'section-3-e-annuity-summary',
    title: 'Section 3.E: Annuity Summary',
    anchor: 'E Annuity Summary',
    children: [
      ['general-requirement', 'Annuity Summary general requirement', 'E Annuity Summary'],
      ['1-materiality', '1. Materiality', '1 Materiality'],
      ['2-material-risks', '2. Material Risks', '2 Material Risks'],
      ['3-changes-in-reserve-amounts', '3. Changes in Reserve Amounts', '3 Changes in Reserve Amounts'],
      ['4-changes-in-methods', '4. Changes in Methods', '4 Changes in Methods'],
      ['5-assets-and-risk-management', '5. Assets and Risk Management', '5 Assets and Risk Management'],
      ['6-consistency-between-sub-reports', '6. Consistency between Annuity Sub-Reports', '6 Consistency between'],
      ['7-closing-section', '7. Closing Section', '7 Closing Section'],
      ['8-va-supplement-part-1', '8. VA Supplement Part 1', '8 VA Supplement Part 1'],
      ['9-va-supplement-part-2', '9. VA Supplement Part 2', '9 VA Supplement Part 2'],
      ['10-vm22-supplement-part-1', '10. VM-22 Supplement Part 1', '10 VM 22 Supplement Part 1'],
      ['11-vm22-supplement-part-2', '11. VM-22 Supplement Part 2', '11 VM 22 Supplement Part 2'],
    ],
  },
  {
    id: 'section-3-f-annuity-report',
    title: 'Section 3.F: Annuity Report',
    anchor: 'F Annuity Report',
    children: [
      ['general-requirement', 'Annuity Report general requirement', 'F Annuity Report'],
      ['1-liabilities', '1. Liabilities', '1 Liabilities'],
      ['2-cash-flow-models', '2. Cash-Flow Models', '2 Cash Flow Models'],
      ['3-liability-assumptions-and-margins', '3. Liability Assumptions and Margins', '3 Liability Assumptions and Margins'],
      ['4-starting-assets', '4. Starting Assets', '4 Starting Assets'],
      ['5-separate-account-assets', '5. Separate Account Assets', '5 Separate Account Assets'],
      ['6-general-account-assets', '6. General Account Assets', '6 General Account Assets'],
      ['7-revenue-sharing-assumptions', '7. Revenue-Sharing Assumptions', '7 Revenue Sharing Assumptions'],
      ['8-hedging-and-risk-management', '8. Hedging and Risk Management', '8 Hedging and Risk Management'],
      ['9-non-guaranteed-elements', '9. Non-guaranteed Elements', '9 Non guaranteed Elements'],
      ['10-scenario-generation', '10. Scenario Generation', '10 Scenario Generation'],
      ['11-reinsurance', '11. Reinsurance', '11 Reinsurance'],
      ['12-alternative-methodology-vm21', '12. Alternative Methodology for VM-21', '12 Alternative Methodology for VM 21'],
      ['13-exclusion-tests-vm22', '13. Exclusion Tests for VM-22', '13 Exclusion Tests'],
      ['14-additional-standard-projection-amount', '14. Additional Standard Projection Amount', '14 Additional Standard Projection Amount'],
      ['15-riders-and-supplemental-benefits', '15. Riders and Supplemental Benefits', '15 Riders and Supplemental Benefits'],
      ['16-additional-information', '16. Additional Information', '16 Additional Information'],
      ['17-rbc', '17. RBC', '17 RBC'],
      ['18-reliance-descriptions-and-statements', '18. Reliance Descriptions and Statements', '18 Reliance Descriptions and Statements'],
      ['19-certifications', '19. Certifications', '19 Certifications'],
      ['20-closing-paragraph', '20. Closing Paragraph', '20 Closing Paragraph'],
    ],
  },
  {
    id: 'closing-boundary',
    title: 'VM-31 closing boundary before VM-50',
    anchor: 'This page intentionally left blank',
    boundaryPage: 386,
    children: [{ id: 'intentional-blank-page', title: 'Intentional blank page 31-46', anchor: 'This page intentionally left blank' }],
  },
]

for (const parent of parentSpecs) {
  parent.children = parent.children.map((child) => Array.isArray(child)
    ? { id: child[0], title: child[1], anchor: child[2] }
    : child)
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const anchorRegex = (anchor) => {
  const tokens = String(anchor).match(/[A-Za-z0-9]+/g) ?? []
  if (tokens.length === 0) throw new Error(`VM-31 anchor has no searchable tokens: ${anchor}`)
  return new RegExp(tokens.map(escapeRegex).join('[^A-Za-z0-9]+'), 'gi')
}

const findAnchor = (text, anchor, from = 0, occurrence = 1, limit = text.length) => {
  const regex = anchorRegex(anchor)
  regex.lastIndex = from
  let match = null
  for (let index = 0; index < occurrence; index += 1) {
    match = regex.exec(text)
    if (!match || match.index >= limit) throw new Error(`VM-31 anchor not found in structural order: ${anchor}`)
  }
  return { index: match.index, end: match.index + match[0].length, match: match[0] }
}

const markerIndexForPage = (text, page) => {
  const marker = `[p. ${page}]`
  const index = text.indexOf(marker)
  if (index < 0) throw new Error(`VM-31 extraction is missing page marker ${marker}.`)
  return index
}

const pageAt = (text, index) => {
  const markerAtIndex = text.slice(index).match(/^\[p\.\s*(\d+)\]/)
  if (markerAtIndex) return Number(markerAtIndex[1])
  const prefix = text.slice(0, index)
  const matches = [...prefix.matchAll(/\[p\.\s*(\d+)\]/g)]
  if (matches.length === 0) throw new Error(`VM-31 source segment at offset ${index} has no preceding page marker.`)
  return Number(matches.at(-1)[1])
}

const pageRangeFor = (chapterText, start, end) => ({
  start: pageAt(chapterText, start),
  end: pageAt(chapterText, Math.max(start, end - 1)),
})

const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const sha256 = (value) => crypto.createHash('sha256').update(value, 'utf8').digest('hex')
const unique = (values) => [...new Set(values.filter(Boolean))]

const deriveProvisionTypes = (text, title) => {
  const value = `${title} ${normalize(text)}`
  const types = ['reporting_requirement']
  if (/document|description|discussion|summary|statement|disclosure|information|report/i.test(value)) types.push('documentation_requirement')
  if (/certif/i.test(value)) types.push('certification')
  if (/qualified actuary|actuarial|under the direction of one or more qualified actuaries/i.test(value)) types.push('actuarial_responsibility')
  if (/\bcompany\b|company shall|assigned by the company/i.test(value)) types.push('company_responsibility')
  if (/supplement|exhibit|table|spreadsheet|graph|chart/i.test(value)) types.push('required_exhibit')
  if (/analysis|test|testing|study|reconciliation|comparison|validation|back-testing/i.test(value)) types.push('required_analysis')
  if (/disclos|provide|include|listing|identify|identification/i.test(value)) types.push('required_disclosure')
  if (/each year|April 1|within 30 days|seven years|annually|prior year|valuation date|submission/i.test(value)) types.push('timing_or_frequency')
  if (/applicable|subject to|if the company|if only|for groups|exclusion|alternative methodology/i.test(value)) types.push('applicability_or_exception')
  if (/Guidance Note/i.test(value)) types.push('guidance_note_present')
  if (/VM\s*-\s*(?:01|20|21|22|30)|VM\s*-\s*[GMC]\b|Actuarial Guideline|AG\s*(?:43|XLIII)/i.test(value)) types.push('cross_reference')
  return unique(types)
}

const crossReferencePatterns = [
  ['VM-01', /VM\s*-\s*01\b/i],
  ['VM-20', /VM\s*-\s*20\b/i],
  ['VM-21', /VM\s*-\s*21\b/i],
  ['VM-22', /VM\s*-\s*22\b/i],
  ['VM-30', /VM\s*-\s*30\b/i],
  ['VM-G', /VM\s*-\s*G\b/i],
  ['VM-M', /VM\s*-\s*M\b/i],
  ['Actuarial Guideline XLIII', /(?:Actuarial Guideline\s+XLIII|AG\s*43)\b/i],
]

export const deriveVm31CrossReferences = (text) => crossReferencePatterns
  .filter(([, pattern]) => pattern.test(text))
  .map(([label]) => label)

const extractAcronyms = (text) => unique((String(text).match(/\b(?:PBR|PDF|DR|SR|SERT|CTE\s*70|NPR|RBC|NAER|PIMR|CDHS|NGE|ULSG|VA|DET)\b/gi) ?? []).map((value) => normalize(value).toUpperCase()))

const titleKeywords = (title) => unique(String(title).replace(/\d+|[A-F]\./g, ' ').split(/[^A-Za-z0-9]+/).filter((token) => token.length > 2))

export const loadVm31Chapter = async (repoRoot, input) => {
  const texts = []
  const sourceRecords = []
  for (const entry of input.extractions) {
    const [manifest, extraction] = await Promise.all([
      fs.readFile(path.resolve(repoRoot, entry.batchManifestPath), 'utf8').then(JSON.parse),
      fs.readFile(path.resolve(repoRoot, entry.extractionPath), 'utf8').then(JSON.parse),
    ])
    const sourceRecord = manifest.sourceFiles.find((source) => source.sourceId === entry.sourceId)
    const group = extraction.sourceGroups.find((candidate) => candidate.sourceId === entry.sourceId)
    const item = group?.extractedItems?.find((candidate) => candidate.chunkText)
    if (!sourceRecord || !group || !item) throw new Error(`VM-31 extraction input is incomplete for ${entry.sourceId}.`)
    if (sourceRecord.fileHash !== VM31_SOURCE_SHA256) throw new Error(`VM-31 source hash mismatch for ${entry.sourceId}.`)
    texts.push(String(item.chunkText).trim())
    sourceRecords.push(sourceRecord)
  }
  const chapterText = texts.join('\n\n')
  for (let page = VM31_PAGE_RANGE.start; page <= VM31_PAGE_RANGE.end; page += 1) markerIndexForPage(chapterText, page)
  const vm50Boundary = markerIndexForPage(chapterText, 386) + chapterText.slice(markerIndexForPage(chapterText, 386)).length
  if (/VM\s*-\s*50/i.test(chapterText)) throw new Error('VM-31 extraction unexpectedly includes the VM-50 opener.')
  return { chapterText, sourceRecords, aggregateExtractionSha256: sha256(chapterText), vm50Boundary }
}

export const segmentVm31Chapter = (chapterText) => {
  const parents = []
  const parentStarts = parentSpecs.map((spec) => spec.boundaryPage
    ? markerIndexForPage(chapterText, spec.boundaryPage)
    : findAnchor(chapterText, spec.anchor, 0, spec.occurrence ?? 1).index)
  for (let index = 1; index < parentStarts.length; index += 1) {
    if (parentStarts[index] <= parentStarts[index - 1]) throw new Error(`VM-31 parent anchors are out of order at ${parentSpecs[index].id}.`)
  }
  for (let parentIndex = 0; parentIndex < parentSpecs.length; parentIndex += 1) {
    const spec = parentSpecs[parentIndex]
    const start = parentStarts[parentIndex]
    const end = parentStarts[parentIndex + 1] ?? chapterText.length
    const children = []
    let childSearchFrom = start
    for (let childIndex = 0; childIndex < spec.children.length; childIndex += 1) {
      const childSpec = spec.children[childIndex]
      let childStart
      if (spec.boundaryPage) childStart = start
      else childStart = findAnchor(chapterText, childSpec.anchor, childSearchFrom, childSpec.occurrence ?? 1, end).index
      const nextChild = spec.children[childIndex + 1]
      const childEnd = nextChild
        ? findAnchor(chapterText, nextChild.anchor, childStart + 1, nextChild.occurrence ?? 1, end).index
        : end
      if (childEnd <= childStart) throw new Error(`Invalid VM-31 child boundary: ${spec.id}/${childSpec.id}.`)
      const text = chapterText.slice(childStart, childEnd).trim()
      const pages = pageRangeFor(chapterText, childStart, childEnd)
      children.push({ ...childSpec, start: childStart, end: childEnd, text, pages, sourceTextSha256: sha256(text) })
      childSearchFrom = childEnd
    }
    const text = chapterText.slice(start, end).trim()
    const pages = pageRangeFor(chapterText, start, end)
    parents.push({ ...spec, start, end, text, pages, sourceTextSha256: sha256(text), children })
  }
  if (parents.length !== VM31_PARENT_COUNT) throw new Error(`Expected ${VM31_PARENT_COUNT} VM-31 parents; found ${parents.length}.`)
  if (parents.reduce((sum, parent) => sum + parent.children.length, 0) !== VM31_CHILD_COUNT) throw new Error(`Expected ${VM31_CHILD_COUNT} VM-31 children.`)
  for (let index = 1; index < parents.length; index += 1) {
    if (parents[index - 1].end !== parents[index].start) throw new Error(`VM-31 parent coverage gap before ${parents[index].id}.`)
  }
  return parents
}

export const buildVm31Chunks = async (repoRoot, source) => {
  const { chapterText } = await loadVm31Chapter(repoRoot, source.vm31Input)
  const parents = segmentVm31Chapter(chapterText)
  const ids = parents.flatMap((parent) => [
    `vm31-${parent.id}`,
    ...parent.children.map((child) => `vm31-${parent.id}-${child.id}`),
  ])
  const chunks = []
  let ordinal = 1
  for (const parent of parents) {
    const parentId = `vm31-${parent.id}`
    const parentIdIndex = ids.indexOf(parentId)
    const childIds = parent.children.map((child) => `vm31-${parent.id}-${child.id}`)
    const parentTypes = unique(parent.children.flatMap((child) => deriveProvisionTypes(child.text, child.title)))
    const parentReferences = deriveVm31CrossReferences(parent.text)
    chunks.push({
      chunkId: parentId,
      chunkOrdinal: ordinal++,
      chunkKind: parent.id === 'closing-boundary' ? 'boundary_slice' : 'source_excerpt',
      sourceTextType: 'actual_extracted_source_text',
      pageStart: parent.pages.start,
      pageEnd: parent.pages.end,
      sectionReference: parent.title,
      sourceTextExcerpt: parent.text,
      normalizedTextExcerpt: normalize(parent.text).toLowerCase(),
      summary: `Structural context for ${parent.title}; generated metadata does not replace the retained VM-31 source text.`,
      topic: parent.title,
      headingPath: `VM-31 > ${parent.title}`,
      keyPoints: [`Context parent for ${parent.children.length} source-bound requirement unit${parent.children.length === 1 ? '' : 's'}.`],
      concepts: parentTypes,
      definedTerms: [],
      preserveEmptyDefinedTerms: true,
      acronyms: extractAcronyms(parent.text),
      requirements: parentTypes,
      controlledTags: unique(['vm31_current_manual', 'hierarchical_parent', 'review_only', ...parentTypes]),
      keywords: unique(['VM-31', parent.title, ...parentReferences, ...titleKeywords(parent.title)]),
      citations: [{ citationText: parent.title, pageReference: `pp. ${parent.pages.start}-${parent.pages.end}`, sectionReference: parent.title, sourceReference: source.sourceReference, lineReference: null }],
      fidelity: 'exact',
      confidence: 'high',
      reviewFlags: ['review_only', 'hierarchical_parent', 'requires_independent_review'],
      qualityNotes: ['Parent follows an explicit VM-31 section or subsection boundary.', 'Numbered requirement children retain their complete nested lists, qualifications, and guidance notes.'],
      evidenceNotes: `Exact source segment from reviewed batches 019-021; source-text SHA-256 ${parent.sourceTextSha256}.`,
      chunkLevel: 'parent',
      parentChunkId: null,
      childChunkIds: childIds,
      precedingChunkId: ids[parentIdIndex - 1] ?? null,
      followingChunkId: ids[parentIdIndex + 1] ?? null,
      structuralLocator: `VM-31 / ${parent.title}`,
      chunkingMethod: 'hierarchical_structure',
      localTopics: titleKeywords(parent.title),
      provisionTypes: parentTypes,
      provisionTypeBasis: 'source_text_pattern_only',
      structuralBreadcrumb: `VM-31 > ${parent.title}`,
      boundaryQuality: { status: 'source_structural_parent', startsAtBoundary: true, note: 'Parent begins at an explicit source heading or the intentional closing-boundary page.' },
      crossReferenceCandidates: parentReferences,
      metadataDerivation: 'generated_from_source_text_without_source_text_rewrite',
      retrievalEligible: false,
      retrievalRole: 'context_only_parent',
      promotionEligible: false,
    })
    for (const child of parent.children) {
      const childId = `vm31-${parent.id}-${child.id}`
      const childIdIndex = ids.indexOf(childId)
      const types = deriveProvisionTypes(child.text, child.title)
      const references = deriveVm31CrossReferences(child.text)
      const boundaryOnly = parent.id === 'closing-boundary'
      chunks.push({
        chunkId: childId,
        chunkOrdinal: ordinal++,
        chunkKind: boundaryOnly ? 'boundary_slice' : 'source_excerpt',
        sourceTextType: 'actual_extracted_source_text',
        pageStart: child.pages.start,
        pageEnd: child.pages.end,
        sectionReference: child.title,
        sourceTextExcerpt: child.text,
        normalizedTextExcerpt: normalize(child.text).toLowerCase(),
        summary: boundaryOnly
          ? 'VM-31 ends with an intentional blank page before VM-50 begins on the next PDF page.'
          : `VM-31 source requirement for ${child.title}; classification metadata is derivative and the retained excerpt controls.`,
        topic: `${parent.title} > ${child.title}`,
        headingPath: `VM-31 > ${parent.title} > ${child.title}`,
        keyPoints: boundaryOnly ? ['Boundary control only; this is not a reporting requirement.'] : [`Complete numbered or lettered source unit for ${child.title}.`],
        concepts: boundaryOnly ? ['boundary_control'] : types,
        definedTerms: [],
        preserveEmptyDefinedTerms: true,
        acronyms: extractAcronyms(child.text),
        requirements: boundaryOnly ? [] : types,
        controlledTags: unique(['vm31_current_manual', 'hierarchical_child', 'review_only', ...(boundaryOnly ? ['boundary_control'] : types)]),
        keywords: unique(['VM-31', parent.title, child.title, ...references, ...titleKeywords(child.title)]),
        citations: [{ citationText: child.title, pageReference: `pp. ${child.pages.start}-${child.pages.end}`, sectionReference: child.title, sourceReference: source.sourceReference, lineReference: null }],
        fidelity: 'exact',
        confidence: 'high',
        reviewFlags: unique(['review_only', 'hierarchical_child', 'requires_independent_review', ...(types.includes('guidance_note_present') ? ['guidance_note_present'] : [])]),
        qualityNotes: ['Child retains one complete numbered or lettered VM-31 source unit, including nested items.', 'Generated reporting classifications remain subordinate to the exact source excerpt.'],
        evidenceNotes: `Exact source segment from reviewed batches 019-021; source-text SHA-256 ${child.sourceTextSha256}.`,
        chunkLevel: 'child',
        parentChunkId: parentId,
        childChunkIds: [],
        precedingChunkId: ids[childIdIndex - 1] ?? null,
        followingChunkId: ids[childIdIndex + 1] ?? null,
        structuralLocator: `VM-31 / ${parent.title} / ${child.title}`,
        chunkingMethod: 'semantic_boundary',
        localTopics: titleKeywords(child.title),
        provisionTypes: boundaryOnly ? ['boundary_control'] : types,
        provisionTypeBasis: 'source_text_pattern_only',
        structuralBreadcrumb: `VM-31 > ${parent.title} > ${child.title}`,
        boundaryQuality: { status: 'numbered_or_lettered_boundary', startsAtBoundary: true, note: 'Child is a complete source-numbered, source-lettered, or explicit boundary-control unit.' },
        crossReferenceCandidates: references,
        metadataDerivation: 'generated_from_source_text_without_source_text_rewrite',
        retrievalEligible: !boundaryOnly,
        retrievalRole: boundaryOnly ? 'context_only_boundary' : 'first_stage_retrieval',
        promotionEligible: false,
      })
    }
  }
  if (chunks.length !== VM31_CHUNK_COUNT) throw new Error(`Expected ${VM31_CHUNK_COUNT} VM-31 chunks; found ${chunks.length}.`)
  return chunks
}

export const getVm31StructureSpecs = () => structuredClone(parentSpecs)
export const hashVm31SourceText = sha256
