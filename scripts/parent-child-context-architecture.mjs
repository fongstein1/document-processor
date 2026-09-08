import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const architectureRunId = 'parent-child-context-architecture-2026-09'
export const publicOutputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', architectureRunId)
export const externalProcessingRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', architectureRunId)
const generatedAt = '2026-09-02T00:00:00.000Z'
const replayRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', 'processing-scaled-wave-01-replay-2026-09')
const pilotRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', 'processing-acquisition-pilot-2026-09-02')

export const provingGrounds = [
  { sourceId: 'naic-accounting-publications-appm-2026', inputRoot: pilotRoot, provingGround: 'A3' },
  { sourceId: 'naic-life-fraternal-reporting-asb-life-2025', inputRoot: replayRoot, provingGround: 'W07' },
  { sourceId: 'naic-life-fraternal-reporting-qsi-life-2026', inputRoot: replayRoot, provingGround: 'W08' },
  { sourceId: 'naic-pbr-vm-20-vm-31-vm-51-vm20-tables-2026-f-g', inputRoot: replayRoot, provingGround: 'XLSX-FG' },
  { sourceId: 'naic-pbr-vm-20-vm-31-vm-51-vm31-templates-reports', inputRoot: replayRoot, provingGround: 'XLSX-VM31' },
  { sourceId: 'society-of-actuaries-experience-studies-soa-2015-vbt-improvement', inputRoot: replayRoot, provingGround: 'XLSX-SOA' }
]

const readJson = async (filePath) => JSON.parse((await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, ''))
const writeJson = async (filePath, value) => { await fs.mkdir(path.dirname(filePath), { recursive: true }); await writeFile(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8') }
const sha256Bytes = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const stableId = (...parts) => 'pc-' + crypto.createHash('sha256').update(parts.map((part) => String(part ?? '')).join('|')).digest('hex').slice(0, 24)
const normalize = (value) => String(value || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim()
const tokens = (value) => [...new Set(normalize(value).toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4))]
const isPdf = (chunk, source) => /\.pdf$/i.test(source.filename || '') || source.documentType?.toLowerCase().includes('pdf') || chunk?.pageStart !== null && chunk?.pageStart !== undefined
const safeRole = (source) => source.extensions?.authoritySupportRole || source.authoritySupportRole || source.authorityLevel || null
const citation = (chunk) => ({
  pageReference: chunk.citations?.[0]?.pageReference || null,
  sectionReference: chunk.citations?.[0]?.sectionReference || chunk.sectionReference || null,
  sourceReference: chunk.citations?.[0]?.sourceReference || null,
  worksheetPath: chunk.extensions?.worksheet || null,
  cellRefs: Array.isArray(chunk.extensions?.tableBlock?.cellRefs) ? chunk.extensions.tableBlock.cellRefs : []
})

const pdfMarkers = [
  { type: 'ssap', regex: /\bSSAP\s+\d+[A-Z]?\b/i },
  { type: 'appendix', regex: /\bAPPENDIX\s+[A-Z0-9]+\b/i },
  { type: 'section', regex: /\bSECTION\s+\d+(?:\.\d+)*\b/i },
  { type: 'part', regex: /\bPART\s+[A-Z0-9IVX]+\b/i },
  { type: 'schedule', regex: /\bSCHEDULE\s+[A-Z0-9]+\b/i }
]
export const detectPdfStructure = (text) => {
  const lines = String(text || '').split(/\n+/).map(normalize).filter(Boolean)
  for (const line of lines) {
    for (const marker of pdfMarkers) {
      const match = line.match(marker.regex)
      if (match) return { parentType: marker.type, structuralIdentifier: match[0].toUpperCase(), detectionMethod: 'deterministic_marker_line', confidence: 'medium' }
    }
  }
  return null
}

const workbookBlock = (chunk) => {
  const block = chunk.extensions?.tableBlock || {}
  return {
    worksheetPath: chunk.extensions?.worksheet || null,
    sheetName: chunk.sectionReference?.match(/^Sheet:\s*(.*?)\s+rows\s+/i)?.[1] || null,
    sheetState: chunk.extensions?.sheetState || null,
    rowStart: block.startRow ?? null,
    rowEnd: block.endRow ?? null,
    cellRefs: Array.isArray(block.cellRefs) ? block.cellRefs : [],
    blockOrdinal: block.blockOrdinal ?? null
  }
}

const makeSourceRecord = (source, spec, representation, counts, externalArtifact) => ({
  sourceId: source.sourceId,
  provingGround: spec.provingGround,
  filename: source.filename,
  sourceSha256: source.sourceSha256,
  sourceFamilyId: source.sourceFamilyId,
  documentType: source.documentType,
  sourceTitle: source.sourceTitle,
  sourceReference: source.sourceReference,
  authoritySupportRole: safeRole(source),
  rightsStatus: source.rightsStatus,
  processingRepresentation: representation,
  parentCount: counts.parentCount,
  childCount: counts.childCount,
  fallbackUnitCount: counts.fallbackUnitCount,
  structureDetectionCoverage: counts.childCount ? counts.structureAwareChildCount / counts.childCount : 0,
  externalArtifactPath: externalArtifact.externalPath,
  externalArtifactSha256: externalArtifact.sha256,
  externalArtifactByteCount: externalArtifact.byteCount,
  reviewOnly: true,
  promotionStatus: 'not_promoted',
  ragReadyAllowed: false
})

const buildPdf = (source, spec, chunks) => {
  const parents = []
  const children = []
  const fallbackUnits = []
  let active = null
  let occurrence = 0
  for (const chunk of chunks) {
    const marker = detectPdfStructure(chunk.sourceTextExcerpt)
    if (marker) {
      occurrence += 1
      active = { ...marker, occurrence, firstChunkId: chunk.chunkId, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, childIds: [] }
      active.parentId = stableId(source.sourceId, 'pdf-parent', marker.parentType, marker.structuralIdentifier, chunk.pageStart, occurrence)
      parents.push(active)
    }
    if (!active) {
      fallbackUnits.push({ unitId: stableId(source.sourceId, 'fallback-page-window', chunk.chunkId), sourceId: source.sourceId, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, citation: citation(chunk), baselineChunkId: chunk.chunkId, processingRepresentation: 'STRUCTURE_FALLBACK_PAGE_WINDOWS', reviewOnly: true, promotionStatus: 'not_promoted' })
      continue
    }
    active.pageEnd = chunk.pageEnd
    const child = {
      childId: stableId(source.sourceId, active.parentId, chunk.pageStart, chunk.pageEnd, chunk.chunkId),
      parentId: active.parentId,
      sourceId: source.sourceId,
      sourceSha256: source.sourceSha256,
      sourceFamilyId: source.sourceFamilyId,
      documentType: source.documentType,
      authoritySupportRole: safeRole(source),
      structuralType: 'semantic_retrieval_child',
      pageStart: chunk.pageStart,
      pageEnd: chunk.pageEnd,
      sectionReference: chunk.sectionReference || null,
      citation: citation(chunk),
      sourceChunkId: chunk.chunkId,
      reviewFlags: Array.isArray(chunk.reviewFlags) ? chunk.reviewFlags : [],
      confidence: active.confidence,
      detectionMethod: active.detectionMethod,
      rightsStatus: source.rightsStatus,
      sourceTextExternal: true,
      reviewOnly: true,
      promotionStatus: 'not_promoted',
      ragReadyAllowed: false,
      searchText: normalize(chunk.normalizedSearchText || chunk.sourceTextExcerpt),
      sourceTextExcerpt: chunk.sourceTextExcerpt || '',
      normalizedTextExcerpt: chunk.normalizedTextExcerpt || normalize(chunk.sourceTextExcerpt),
      adjacentSourceChunkId: null
    }
    active.childIds.push(child.childId)
    children.push(child)
  }
  for (const parent of parents) {
    parent.parentId = parent.parentId
    parent.sourceId = source.sourceId
    parent.sourceSha256 = source.sourceSha256
    parent.sourceFamilyId = source.sourceFamilyId
    parent.documentType = source.documentType
    parent.authoritySupportRole = safeRole(source)
    parent.hierarchyLevel = 1
    parent.structuralLabel = 'detected ' + parent.parentType
    parent.pageStart = parent.pageStart
    parent.pageEnd = parent.pageEnd
    parent.childIds = parent.childIds
    parent.rightsStatus = source.rightsStatus
    parent.reviewFlags = []
    parent.reviewOnly = true
    parent.promotionStatus = 'not_promoted'
    parent.ragReadyAllowed = false
    delete parent.firstChunkId
    delete parent.occurrence
  }
  for (let index = 0; index < children.length; index += 1) children[index].adjacentSourceChunkId = chunks[index]?.chunkId || null
  return { parents, children, fallbackUnits, representation: children.length ? 'STRUCTURE_AWARE_PARENT_CHILD' : 'STRUCTURE_FALLBACK_PAGE_WINDOWS' }
}

const buildXlsx = (source, chunks) => {
  const parentMap = new Map()
  const children = []
  for (const chunk of chunks) {
    const block = workbookBlock(chunk)
    const key = [source.sourceId, block.worksheetPath, block.rowStart, block.rowEnd, block.blockOrdinal].join('|')
    if (!parentMap.has(key)) {
      const parentId = stableId(source.sourceId, 'workbook-block-parent', key)
      parentMap.set(key, { parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: safeRole(source), hierarchyLevel: 2, parentType: 'workbook_table_block', structuralLabel: 'logical workbook table block', structuralIdentifier: key, sheetName: block.sheetName, worksheetPath: block.worksheetPath, sheetState: block.sheetState, rowStart: block.rowStart, rowEnd: block.rowEnd, cellRefs: block.cellRefs, childIds: [], confidence: 'high', detectionMethod: 'deterministic_table_block_coordinates', rightsStatus: source.rightsStatus, reviewFlags: [], reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
    }
    const parent = parentMap.get(key)
    const child = { childId: stableId(source.sourceId, parent.parentId, chunk.chunkId), parentId: parent.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: safeRole(source), structuralType: 'workbook_range_child', pageStart: null, pageEnd: null, sheetName: block.sheetName, worksheetPath: block.worksheetPath, rowStart: block.rowStart, rowEnd: block.rowEnd, cellRefs: block.cellRefs, sectionReference: chunk.sectionReference || null, citation: citation(chunk), sourceChunkId: chunk.chunkId, reviewFlags: Array.isArray(chunk.reviewFlags) ? chunk.reviewFlags : [], confidence: 'high', detectionMethod: 'deterministic_table_block_coordinates', rightsStatus: source.rightsStatus, sourceTextExternal: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false, searchText: normalize(chunk.normalizedSearchText || chunk.sourceTextExcerpt), sourceTextExcerpt: chunk.sourceTextExcerpt || '', normalizedTextExcerpt: chunk.normalizedTextExcerpt || normalize(chunk.sourceTextExcerpt) }
    parent.childIds.push(child.childId)
    children.push(child)
  }
  return { parents: [...parentMap.values()], children, fallbackUnits: [], representation: children.length ? 'STRUCTURE_AWARE_PARENT_CHILD' : 'STRUCTURE_FALLBACK_WORKBOOK_BLOCKS' }
}

const publicParent = (parent, externalArtifact) => ({
  parentId: parent.parentId,
  sourceId: parent.sourceId,
  sourceSha256: parent.sourceSha256,
  sourceFamilyId: parent.sourceFamilyId,
  documentType: parent.documentType,
  authoritySupportRole: parent.authoritySupportRole,
  hierarchyLevel: parent.hierarchyLevel,
  parentType: parent.parentType,
  structuralLabel: parent.structuralLabel,
  structuralIdentifier: parent.structuralIdentifier,
  pageStart: parent.pageStart,
  pageEnd: parent.pageEnd,
  sheetName: parent.sheetName || null,
  worksheetPath: parent.worksheetPath || null,
  sheetState: parent.sheetState || null,
  rowStart: parent.rowStart ?? null,
  rowEnd: parent.rowEnd ?? null,
  cellRefs: Array.isArray(parent.cellRefs) ? parent.cellRefs : [],
  childIds: Array.isArray(parent.childIds) ? parent.childIds : [],
  confidence: parent.confidence || null,
  detectionMethod: parent.detectionMethod || null,
  rightsStatus: parent.rightsStatus,
  reviewFlags: Array.isArray(parent.reviewFlags) ? parent.reviewFlags : [],
  externalArtifactPath: externalArtifact.externalPath,
  externalArtifactSha256: externalArtifact.sha256,
  externalArtifactByteCount: externalArtifact.byteCount,
  reviewOnly: true,
  promotionStatus: 'not_promoted',
  ragReadyAllowed: false
})
const publicChild = (child, externalArtifact) => ({
  childId: child.childId,
  parentId: child.parentId,
  sourceId: child.sourceId,
  sourceSha256: child.sourceSha256,
  sourceFamilyId: child.sourceFamilyId,
  documentType: child.documentType,
  authoritySupportRole: child.authoritySupportRole,
  structuralType: child.structuralType,
  pageStart: child.pageStart,
  pageEnd: child.pageEnd,
  sectionReference: child.sectionReference,
  sheetName: child.sheetName || null,
  worksheetPath: child.worksheetPath || null,
  rowStart: child.rowStart ?? null,
  rowEnd: child.rowEnd ?? null,
  cellRefs: Array.isArray(child.cellRefs) ? child.cellRefs : [],
  citation: child.citation,
  sourceChunkId: child.sourceChunkId,
  reviewFlags: Array.isArray(child.reviewFlags) ? child.reviewFlags : [],
  confidence: child.confidence,
  detectionMethod: child.detectionMethod,
  rightsStatus: child.rightsStatus,
  sourceTextExternal: true,
  externalArtifactPath: externalArtifact.externalPath,
  externalArtifactSha256: externalArtifact.sha256,
  externalArtifactByteCount: externalArtifact.byteCount,
  reviewOnly: true,
  promotionStatus: 'not_promoted',
  ragReadyAllowed: false
})

export const scoreChild = (query, child) => {
  const queryTokens = tokens(query)
  const textTokens = new Set(tokens(child.searchText))
  const lexical = queryTokens.filter((token) => textTokens.has(token)).length
  const structural = queryTokens.filter((token) => tokens(child.sectionReference).includes(token)).length
  const citationQuality = child.citation?.pageReference || child.citation?.worksheetPath ? 1 : 0
  return lexical + structural * 2 + citationQuality * 0.25
}
export const retrieveChildren = (query, children, parentsById) => {
  const ranked = children.map((child) => ({ child, lexicalScore: scoreChild(query, child) })).filter((item) => item.lexicalScore > 0).sort((a, b) => b.lexicalScore - a.lexicalScore || a.child.childId.localeCompare(b.child.childId))
  const reranked = ranked.map((item, index) => ({ ...item, rerankScore: item.lexicalScore + (parentsById.get(item.child.parentId)?.confidence === 'high' ? 0.1 : 0), rank: index + 1 }))
    .sort((a, b) => b.rerankScore - a.rerankScore || a.child.childId.localeCompare(b.child.childId))
    .map((item, index) => ({ ...item, rank: index + 1 }))
  return reranked
}
export const expandContext = (selected, ranked, childrenByParent) => {
  if (!selected) return { adjacent: [], reason: 'no_selection', bounded: true }
  const siblings = childrenByParent.get(selected.child.parentId) || []
  const position = siblings.findIndex((child) => child.childId === selected.child.childId)
  const adjacent = []
  if (position > 0) adjacent.push(siblings[position - 1])
  if (position >= 0 && position < siblings.length - 1 && adjacent.length < 2) adjacent.push(siblings[position + 1])
  const continuation = /(?:continued|see|defined|except|following|above|below|scope|applicable)/i.test(selected.child.searchText || '')
  return { adjacent: continuation ? adjacent : adjacent.slice(0, 1), reason: continuation ? 'bounded_continuation_or_scope_signal' : 'bounded_adjacent_context', bounded: true }
}

const chooseTarget = (chunks, category, sourceIndex) => {
  const byText = (regex) => chunks.find((chunk) => regex.test(chunk.sourceTextExcerpt || ''))
  if (category === 'LOCAL_REQUIREMENT') return chunks[Math.min(2, chunks.length - 1)]
  if (category === 'SCOPE_REQUIREMENT') return byText(/scope|applicable|purpose/i) || chunks[0]
  if (category === 'REQUIREMENT_EXCEPTION') return byText(/exception|except|unless/i) || chunks[Math.min(1, chunks.length - 1)]
  if (category === 'DEFINITION_APPLICATION') return byText(/means|defined|definition/i) || chunks[0]
  if (category === 'CROSS_PAGE_REQUIREMENT') return chunks.find((chunk) => chunk.pageStart !== chunk.pageEnd) || chunks[Math.min(1, chunks.length - 1)]
  if (category === 'TABLE_PROSE') return chunks.find((chunk) => chunk.extensions?.tableBlock?.cellRefs?.length > 3) || chunks[0]
  if (category === 'LONG_DOCUMENT_SECTION') return chunks[Math.floor(chunks.length * 0.6)] || chunks[0]
  if (category === 'WRONG_SECTION_NEGATIVE') return byText(/section|appendix|schedule/i) || chunks[0]
  if (category === 'WRONG_SOURCE_NEGATIVE') return chunks[0]
  if (category === 'AUTHORITY_SUPPORT_CONFUSION') return chunks[0]
  return chunks[0]
}
const queryFromTarget = (chunk, category) => {
  const words = tokens(chunk.sourceTextExcerpt || chunk.normalizedSearchText)
  const prefix = category === 'SCOPE_REQUIREMENT' ? ['scope'] : category === 'REQUIREMENT_EXCEPTION' ? ['exception'] : category === 'DEFINITION_APPLICATION' ? ['definition'] : []
  return [...new Set([...prefix, ...words])].slice(0, 8).join(' ')
}

export const buildEvaluation = ({ sources, privateBySource, parentRecords, childRecords }) => {
  const categories = ['LOCAL_REQUIREMENT', 'SCOPE_REQUIREMENT', 'REQUIREMENT_EXCEPTION', 'DEFINITION_APPLICATION', 'CROSS_PAGE_REQUIREMENT', 'TABLE_PROSE', 'LONG_DOCUMENT_SECTION', 'WRONG_SECTION_NEGATIVE', 'WRONG_SOURCE_NEGATIVE', 'AUTHORITY_SUPPORT_CONFUSION']
  const allChildren = childRecords.map((child) => ({ ...child, searchText: privateBySource.get(child.sourceId).children.find((item) => item.childId === child.childId)?.searchText || '' }))
  const allBaseline = sources.flatMap((source) => privateBySource.get(source.sourceId).baselineChunks)
  const parentsById = new Map(parentRecords.map((parent) => [parent.parentId, parent]))
  const childrenByParent = new Map()
  for (const child of allChildren) { if (!childrenByParent.has(child.parentId)) childrenByParent.set(child.parentId, []); childrenByParent.get(child.parentId).push(child) }
  for (const siblings of childrenByParent.values()) siblings.sort((a, b) => a.childId.localeCompare(b.childId))
  const cases = []
  for (let index = 0; index < categories.length; index += 1) {
    const source = sources[index % sources.length]
    const privateSource = privateBySource.get(source.sourceId)
    const target = chooseTarget(privateSource.baselineChunks, categories[index], source.sourceId)
    if (!target) continue
    const query = queryFromTarget(target, categories[index])
    const baselineRanked = allBaseline.map((chunk) => ({ chunk, score: tokens(query).filter((token) => tokens(chunk.searchText).includes(token)).length })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.chunk.chunkId.localeCompare(b.chunk.chunkId))
    const architectureRanked = retrieveChildren(query, allChildren, parentsById)
    const baselineTop = baselineRanked[0]?.chunk || null
    const selected = architectureRanked[0] || null
    const targetChild = allChildren.find((child) => child.sourceChunkId === target.chunkId && child.sourceId === source.sourceId) || null
    const selectedParent = selected ? parentsById.get(selected.child.parentId) : null
    const expansion = expandContext(selected, architectureRanked, childrenByParent)
    const requiresContext = ['SCOPE_REQUIREMENT', 'REQUIREMENT_EXCEPTION', 'DEFINITION_APPLICATION', 'CROSS_PAGE_REQUIREMENT', 'TABLE_PROSE', 'LONG_DOCUMENT_SECTION'].includes(categories[index])
    cases.push({ caseId: 'pc-eval-' + String(index + 1).padStart(2, '0'), category: categories[index], expectedSourceId: source.sourceId, expectedRole: source.authoritySupportRole, expectedBaselineChunkId: target.chunkId, expectedChildId: targetChild?.childId || null, queryExternal: true, baseline: { top1SourceId: baselineTop?.sourceId || null, top1ChunkId: baselineTop?.chunkId || null, top3SourceIds: baselineRanked.slice(0, 3).map((item) => item.chunk.sourceId), top1Correct: baselineTop?.sourceId === source.sourceId, top3Correct: baselineRanked.slice(0, 3).some((item) => item.chunk.sourceId === source.sourceId), rank: baselineRanked.findIndex((item) => item.chunk.sourceId === source.sourceId) + 1 || null, citationCorrect: Boolean(baselineTop?.citations?.length) }, parentChild: { selectedChildId: selected?.child.childId || null, selectedSourceId: selected?.child.sourceId || null, selectedRole: selected?.child.authoritySupportRole || null, selectedParentId: selectedParent?.parentId || null, rank: selected?.rank || null, retrievalScore: selected?.lexicalScore || 0, rerankScore: selected?.rerankScore || 0, top1Correct: selected?.child.sourceId === source.sourceId, top3Correct: architectureRanked.slice(0, 3).some((item) => item.child.sourceId === source.sourceId), targetChildTop1: selected?.child.childId === targetChild?.childId, parentCorrect: selectedParent?.sourceId === source.sourceId, roleCorrect: selected?.child.authoritySupportRole === source.authoritySupportRole, citationCorrect: Boolean(selected?.child.citation?.pageReference || selected?.child.citation?.worksheetPath), adjacentChildIds: expansion.adjacent.map((child) => child.childId), expansionReason: expansion.reason, childOnlySufficient: !requiresContext, parentExpansionRequired: requiresContext, adjacentExpansionRequired: requiresContext, requiredContextPresent: !requiresContext || expansion.adjacent.length > 0, unrelatedContextIntroduced: expansion.adjacent.some((child) => child.sourceId !== source.sourceId || child.parentId !== selectedParent?.parentId), contextSize: 1 + expansion.adjacent.length } })
  }
  const metric = (selector) => cases.length ? cases.filter(selector).length / cases.length : 0
  const mrr = (kind) => cases.reduce((sum, item) => sum + (1 / (item[kind].rank || Number.POSITIVE_INFINITY)), 0) / Math.max(cases.length, 1)
  const improvements = cases.filter((item) => item.parentChild.targetChildTop1 && !item.baseline.top1Correct).map((item) => item.caseId)
  const noDifference = cases.filter((item) => item.parentChild.targetChildTop1 === item.baseline.top1Correct).map((item) => item.caseId)
  const worse = cases.filter((item) => !item.parentChild.targetChildTop1 && item.baseline.top1Correct).map((item) => item.caseId)
  return { schemaVersion: '1.0', runId: architectureRunId, evaluationMode: 'review_only', rankingInputExcludesTestExpectations: true, cases: cases.map((item) => ({ caseId: item.caseId, category: item.category, expectedSourceId: item.expectedSourceId, expectedRole: item.expectedRole, expectedBaselineChunkId: item.expectedBaselineChunkId, expectedChildId: item.expectedChildId, queryExternal: true, baseline: item.baseline, parentChild: item.parentChild })), metrics: { caseCount: cases.length, baseline: { top1: metric((item) => item.baseline.top1Correct), top3: metric((item) => item.baseline.top3Correct), mrr: mrr('baseline'), wrongSourceRate: metric((item) => !item.baseline.top1Correct), citationCorrectness: metric((item) => item.baseline.citationCorrect), averageContextSize: 1 }, parentChildContext: { top1: metric((item) => item.parentChild.top1Correct), top3: metric((item) => item.parentChild.top3Correct), mrr: mrr('parentChild'), correctParentRate: metric((item) => item.parentChild.parentCorrect), requiredContextRate: metric((item) => item.parentChild.requiredContextPresent), wrongSourceRate: metric((item) => !item.parentChild.top1Correct), authoritySupportCorrectness: metric((item) => item.parentChild.roleCorrect), citationCorrectness: metric((item) => item.parentChild.citationCorrect), averageContextSize: cases.reduce((sum, item) => sum + item.parentChild.contextSize, 0) / Math.max(cases.length, 1), boundedContextMaximum: 3, unrelatedContextRate: metric((item) => item.parentChild.unrelatedContextIntroduced) } }, examples: { materiallyImproved: improvements, noDifference, performedWorse: worse }, limitations: ['Queries and substantive evaluation evidence remain external/private.', 'Metrics are a focused architecture comparison, not production RAG readiness.', 'Semantic hierarchy remains conservative; fallback page windows/workbook blocks remain available.'] }
}

export const buildArchitecture = async ({ outputRoot = publicOutputRoot, externalRoot = externalProcessingRoot } = {}) => {
  await fs.mkdir(outputRoot, { recursive: true })
  await fs.mkdir(externalRoot, { recursive: true })
  const sourceBundles = []
  const publicParents = []
  const publicChildren = []
  const publicContexts = []
  const externalArtifacts = []
  for (const spec of provingGrounds) {
    const index = await readJson(path.join(spec.inputRoot, spec.sourceId, 'source-index.json'))
    const chunkManifest = await readJson(path.join(spec.inputRoot, spec.sourceId, 'chunk-manifest.json'))
    const source = index.source
    const chunks = chunkManifest.chunks || []
    const built = isPdf(chunks[0], source) ? buildPdf(source, spec, chunks) : buildXlsx(source, chunks)
    const externalValue = { schemaVersion: '1.0', runId: architectureRunId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, processingRepresentation: built.representation, parents: built.parents, children: built.children, fallbackUnits: built.fallbackUnits, baselineChunks: chunks.map((chunk) => ({ chunkId: chunk.chunkId, sourceId: chunk.sourceId, sourceSha256: source.sourceSha256, sourceTextExcerpt: chunk.sourceTextExcerpt || '', normalizedSearchText: chunk.normalizedSearchText || normalize(chunk.sourceTextExcerpt), sectionReference: chunk.sectionReference || null, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, citations: chunk.citations || [], extensions: chunk.extensions || {} })), contexts: [], rightsStatus: source.rightsStatus, reviewOnly: true, promotionStatus: 'not_promoted' }
    const bytes = Buffer.from(JSON.stringify(externalValue, null, 2) + '\n', 'utf8')
    const externalPath = path.join(externalRoot, source.sourceId, 'parent-child-substantive.json')
    await fs.mkdir(path.dirname(externalPath), { recursive: true }); await fs.writeFile(externalPath, bytes)
    const externalArtifact = { runId: architectureRunId, sourceId: source.sourceId, artifactType: 'parent-child-substantive', externalPath, sha256: sha256Bytes(bytes), byteCount: bytes.length, sourceRawSha256: source.sourceSha256, generatedTimestamp: generatedAt, rightsStorageStatus: source.rightsStatus, reviewOnly: true }
    externalArtifacts.push(externalArtifact)
    const counts = { parentCount: built.parents.length, childCount: built.children.length, fallbackUnitCount: built.fallbackUnits.length, structureAwareChildCount: built.children.length }
    sourceBundles.push({ source, spec, private: externalValue, externalArtifact, counts })
    publicParents.push(...built.parents.map((parent) => publicParent(parent, externalArtifact)))
    publicChildren.push(...built.children.map((child) => publicChild(child, externalArtifact)))
  }
  const sourceRecords = sourceBundles.map((bundle) => makeSourceRecord(bundle.source, bundle.spec, bundle.private.processingRepresentation, bundle.counts, bundle.externalArtifact))
  const parentsById = new Map(publicParents.map((parent) => [parent.parentId, parent]))
  const parentByChild = new Map(publicChildren.map((child) => [child.childId, parentsById.get(child.parentId)]))
  for (const child of publicChildren) publicContexts.push({ contextId: stableId(architectureRunId, 'context', child.childId), selectedChildId: child.childId, parentId: child.parentId, adjacentChildIds: [], expansionReason: 'bounded_adjacent_context', contextTextExternal: true, sourceId: child.sourceId, sourceSha256: child.sourceSha256, authoritySupportRole: child.authoritySupportRole, citation: child.citation, contextSize: 1, reviewFlags: child.reviewFlags, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  const publicBySource = new Map(sourceBundles.map((bundle) => [bundle.source.sourceId, bundle.private]))
  const evaluation = buildEvaluation({ sources: sourceRecords, privateBySource: publicBySource, parentRecords: publicParents, childRecords: publicChildren })
  const evaluatedContexts = evaluation.cases.map((item) => ({ contextId: stableId(architectureRunId, 'context', item.parentChild.selectedChildId || item.caseId), evaluationCaseId: item.caseId, selectedChildId: item.parentChild.selectedChildId, parentId: item.parentChild.selectedParentId, adjacentChildIds: item.parentChild.adjacentChildIds, expansionReason: item.parentChild.expansionReason, contextTextExternal: true, sourceId: item.parentChild.selectedSourceId, sourceSha256: sourceRecords.find((source) => source.sourceId === item.parentChild.selectedSourceId)?.sourceSha256 || null, authoritySupportRole: item.parentChild.selectedRole, contextSize: item.parentChild.contextSize, reviewFlags: publicChildren.find((child) => child.childId === item.parentChild.selectedChildId)?.reviewFlags || [], reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }))
  const architectureManifest = { schemaVersion: '1.0', runId: architectureRunId, generatedAt, processingMode: 'review_only_architecture_evaluation', processingRepresentation: 'STRUCTURE_AWARE_PARENT_CHILD with explicit fallback representations', sourceIds: sourceRecords.map((source) => source.sourceId), sourceCount: sourceRecords.length, pdfSourceCount: sourceRecords.filter((source) => /\.pdf$/i.test(source.filename || '')).length, xlsxSourceCount: sourceRecords.filter((source) => /\.xlsx$/i.test(source.filename || '')).length, structureAwareSourceCount: sourceRecords.filter((source) => source.processingRepresentation === 'STRUCTURE_AWARE_PARENT_CHILD').length, fallbackSourceCount: sourceRecords.filter((source) => source.processingRepresentation !== 'STRUCTURE_AWARE_PARENT_CHILD').length, parentCount: publicParents.length, childCount: publicChildren.length, fallbackUnitCount: sourceRecords.reduce((sum, source) => sum + source.fallbackUnitCount, 0), rightsStatus: 'RIGHTS_REVIEW_REQUIRED', externalProcessingRoot: externalRoot, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
  const externalManifest = { schemaVersion: '1.0', manifestId: 'external-artifacts-' + architectureRunId, runId: architectureRunId, generatedTimestamp: generatedAt, externalProcessingRoot: externalRoot, rightsStorageStatuses: ['RIGHTS_REVIEW_REQUIRED'], reviewOnly: true, artifacts: externalArtifacts }
  await writeJson(path.join(outputRoot, 'architecture-manifest.json'), architectureManifest)
  await writeJson(path.join(outputRoot, 'parent-manifest.json'), { schemaVersion: '1.0', runId: architectureRunId, parents: publicParents, summary: { parentCount: publicParents.length, pdfParentCount: publicParents.filter((parent) => parent.parentType !== 'workbook_table_block').length, xlsxParentCount: publicParents.filter((parent) => parent.parentType === 'workbook_table_block').length }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(outputRoot, 'child-manifest.json'), { schemaVersion: '1.0', runId: architectureRunId, children: publicChildren, summary: { childCount: publicChildren.length, pdfChildCount: publicChildren.filter((child) => child.structuralType === 'semantic_retrieval_child').length, xlsxChildCount: publicChildren.filter((child) => child.structuralType === 'workbook_range_child').length }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(outputRoot, 'context-expansion-manifest.json'), { schemaVersion: '1.0', runId: architectureRunId, contexts: evaluatedContexts, summary: { contextCount: evaluatedContexts.length, maximumContextSize: 3, contextTextExternal: true }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(outputRoot, 'evidence-packages.json'), { schemaVersion: '1.0', runId: architectureRunId, packages: evaluation.cases.map((item) => ({ packageId: stableId(architectureRunId, 'package', item.caseId), evaluationCaseId: item.caseId, selectedChildId: item.parentChild.selectedChildId, parentId: item.parentChild.selectedParentId, adjacentChildIds: item.parentChild.adjacentChildIds, sourceId: item.parentChild.selectedSourceId, sourceSha256: sourceRecords.find((source) => source.sourceId === item.parentChild.selectedSourceId)?.sourceSha256 || null, authoritySupportRole: item.parentChild.selectedRole, expansionReason: item.parentChild.expansionReason, retrievalScore: item.parentChild.retrievalScore, rerankScore: item.parentChild.rerankScore, reviewFlags: publicChildren.find((child) => child.childId === item.parentChild.selectedChildId)?.reviewFlags || [], boundedContextExternal: true, contextSize: item.parentChild.contextSize, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })), summary: { packageCount: evaluation.cases.length, boundedContextMaximum: 3 }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(outputRoot, 'baseline-comparison.json'), evaluation)
  await writeJson(path.join(outputRoot, 'external-artifact-manifest.json'), externalManifest)
  await writeJson(path.join(outputRoot, 'architecture-source-records.json'), { schemaVersion: '1.0', runId: architectureRunId, sources: sourceRecords, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  return { architectureManifest, sourceRecords, parents: publicParents, children: publicChildren, contexts: evaluatedContexts, evaluation, externalManifest, publicOutputRoot: outputRoot, externalProcessingRoot: externalRoot }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildArchitecture().then((result) => console.log(JSON.stringify({ runId: architectureRunId, sourceCount: result.sourceRecords.length, parentCount: result.parents.length, childCount: result.children.length, evaluationCases: result.evaluation.cases.length, outputRoot: result.publicOutputRoot, externalProcessingRoot: result.externalProcessingRoot }, null, 2))).catch((error) => { console.error(error.stack || error.message); process.exitCode = 1 })
