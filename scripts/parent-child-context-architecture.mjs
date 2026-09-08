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
export const normalizedRetrievalText = (record) => normalize(record?.normalizedSearchText || record?.searchText || record?.normalizedTextExcerpt || record?.sourceTextExcerpt)
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
      sourceChunkOrdinal: chunk.chunkOrdinal ?? null,
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
  return { parents, children, fallbackUnits, representation: children.length ? 'STRUCTURE_AWARE_PARENT_CHILD' : 'STRUCTURE_FALLBACK_PAGE_WINDOWS' }
}

const buildXlsx = (source, chunks) => {
  const parentMap = new Map()
  const worksheetOrder = new Map()
  const children = []
  for (const chunk of chunks) {
    const block = workbookBlock(chunk)
    if (!worksheetOrder.has(block.sheetName)) worksheetOrder.set(block.sheetName, worksheetOrder.size)
    const key = [source.sourceId, block.worksheetPath, block.rowStart, block.rowEnd, block.blockOrdinal].join('|')
    if (!parentMap.has(key)) {
      const parentId = stableId(source.sourceId, 'workbook-block-parent', key)
      parentMap.set(key, { parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: safeRole(source), hierarchyLevel: 2, parentType: 'workbook_table_block', structuralLabel: 'logical workbook table block', structuralIdentifier: key, sheetName: block.sheetName, worksheetPath: block.worksheetPath, worksheetOrder: worksheetOrder.get(block.sheetName), sheetState: block.sheetState, rowStart: block.rowStart, rowEnd: block.rowEnd, cellRefs: block.cellRefs, childIds: [], confidence: 'high', detectionMethod: 'deterministic_table_block_coordinates', rightsStatus: source.rightsStatus, reviewFlags: [], reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
    }
    const parent = parentMap.get(key)
    const child = { childId: stableId(source.sourceId, parent.parentId, chunk.chunkId), parentId: parent.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: safeRole(source), structuralType: 'workbook_range_child', pageStart: null, pageEnd: null, sheetName: block.sheetName, worksheetPath: block.worksheetPath, worksheetOrder: worksheetOrder.get(block.sheetName), rowStart: block.rowStart, rowEnd: block.rowEnd, cellRefs: block.cellRefs, sectionReference: chunk.sectionReference || null, citation: citation(chunk), sourceChunkId: chunk.chunkId, sourceChunkOrdinal: chunk.chunkOrdinal ?? null, reviewFlags: Array.isArray(chunk.reviewFlags) ? chunk.reviewFlags : [], confidence: 'high', detectionMethod: 'deterministic_table_block_coordinates', rightsStatus: source.rightsStatus, sourceTextExternal: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false, searchText: normalizedRetrievalText(chunk), sourceTextExcerpt: chunk.sourceTextExcerpt || '', normalizedTextExcerpt: chunk.normalizedTextExcerpt || normalize(chunk.sourceTextExcerpt) }
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
  worksheetOrder: parent.worksheetOrder ?? null,
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
  worksheetOrder: child.worksheetOrder ?? null,
  rowStart: child.rowStart ?? null,
  rowEnd: child.rowEnd ?? null,
  cellRefs: Array.isArray(child.cellRefs) ? child.cellRefs : [],
  citation: child.citation,
  sourceChunkId: child.sourceChunkId,
  sourceChunkOrdinal: child.sourceChunkOrdinal ?? null,
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
  const textTokens = new Set(tokens(normalizedRetrievalText(child)))
  const lexical = queryTokens.filter((token) => textTokens.has(token)).length
  const structural = queryTokens.filter((token) => tokens(child.sectionReference).includes(token)).length
  const citationQuality = child.citation?.pageReference || child.citation?.worksheetPath ? 1 : 0
  return lexical + structural * 2 + citationQuality * 0.25
}
export const retrieveChildren = (query, children, parentsById) => {
  const queryTokens = tokens(query)
  const scoreWithTokens = (child) => {
    const textTokens = new Set(tokens(normalizedRetrievalText(child)))
    const lexical = queryTokens.filter((token) => textTokens.has(token)).length
    const structural = queryTokens.filter((token) => tokens(child.sectionReference).includes(token)).length
    const citationQuality = child.citation?.pageReference || child.citation?.worksheetPath ? 1 : 0
    return lexical + structural * 2 + citationQuality * 0.25
  }
  const ranked = children.map((child) => ({ child, lexicalScore: scoreWithTokens(child) })).filter((item) => item.lexicalScore > 0).sort((a, b) => b.lexicalScore - a.lexicalScore || a.child.childId.localeCompare(b.child.childId))
  const reranked = ranked.map((item, index) => ({ ...item, rerankAdjustment: parentsById.get(item.child.parentId)?.confidence === 'high' ? 0.1 : 0, rerankScore: item.lexicalScore + (parentsById.get(item.child.parentId)?.confidence === 'high' ? 0.1 : 0), rank: index + 1 }))
    .sort((a, b) => b.rerankScore - a.rerankScore || a.child.childId.localeCompare(b.child.childId))
    .map((item, index) => ({ ...item, rank: index + 1 }))
  return reranked
}
export const expandContext = (selected, ranked, childrenByParent, options = {}) => {
  if (!selected) return { parentContext: null, precedingChild: null, followingChild: null, reason: 'no_selection', bounded: true }
  const siblings = childrenByParent.get(selected.child.parentId) || []
  const position = siblings.findIndex((child) => child.childId === selected.child.childId)
  const continuation = /(?:continued|see|defined|except|following|above|below|scope|applicable)/i.test(selected.child.searchText || '')
  const includeParent = options.includeParent !== false
  const includePrevious = options.includePrevious ?? true
  const includeFollowing = options.includeFollowing ?? continuation
  return {
    parentContext: includeParent ? { parentId: selected.child.parentId, bounded: true, textExternal: true } : null,
    precedingChild: includePrevious && position > 0 ? siblings[position - 1] : null,
    followingChild: includeFollowing && position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null,
    reason: continuation ? 'bounded_continuation_or_scope_signal' : 'bounded_adjacent_context',
    bounded: true
  }
}

const evaluationDefinitions = [
  { sourceIndex: 0, category: 'LOCAL_REQUIREMENT', query: 'What accounting principle recognition requirement applies?', target: /recognition|accounting principle/i, required: 'target' },
  { sourceIndex: 0, category: 'SCOPE_REQUIREMENT', query: 'What is the scope and applicability of statutory accounting guidance?', target: /scope|applicability|applicable/i, required: 'preceding-and-target', parentContext: true },
  { sourceIndex: 0, category: 'DEFINITION_APPLICATION', query: 'How is a statutory accounting term defined and applied?', target: /definition|means|defined/i, required: 'preceding-and-target', parentContext: true },
  { sourceIndex: 0, category: 'LONG_DOCUMENT_SECTION', query: 'Which SSAP section governs the accounting treatment?', target: /SSAP\s+\d+/i, required: 'parent-and-target', parentContext: true },
  { sourceIndex: 1, category: 'LOCAL_REQUIREMENT', query: 'Which annual statement blank field is required for life reporting?', target: /annual statement|life.*blank/i, required: 'target' },
  { sourceIndex: 1, category: 'CROSS_PAGE_REQUIREMENT', query: 'Which annual statement schedule instruction continues across pages?', target: /continued|schedule|instruction/i, required: 'preceding-and-following', parentContext: true },
  { sourceIndex: 1, category: 'TABLE_PROSE', query: 'Which life reporting schedule and explanatory instruction belong together?', target: /schedule|instruction|table/i, required: 'preceding-and-target', parentContext: true },
  { sourceIndex: 1, category: 'WRONG_SECTION_NEGATIVE', query: 'Which annual statement schedule section addresses assets?', target: /assets|schedule/i, required: 'target', parentContext: true },
  { sourceIndex: 2, category: 'LOCAL_REQUIREMENT', query: 'What quarterly statement instruction applies to life and fraternal reporting?', target: /quarterly statement|life|fraternal/i, required: 'target' },
  { sourceIndex: 2, category: 'SCOPE_REQUIREMENT', query: 'What is the scope of the quarterly statement instructions?', target: /scope|applicable|purpose/i, required: 'preceding-and-target', parentContext: true },
  { sourceIndex: 2, category: 'REQUIREMENT_EXCEPTION', query: 'What reporting instruction has an exception or qualification?', target: /exception|except|unless/i, required: 'target-and-following', parentContext: true },
  { sourceIndex: 2, category: 'WRONG_SECTION_NEGATIVE', query: 'Which quarterly schedule instruction is relevant to life reporting?', target: /schedule|instruction/i, required: 'target', parentContext: true },
  { sourceIndex: 3, category: 'LOCAL_REQUIREMENT', query: 'What is the VM-20 Table F current spread rate material?', target: /Table F|current spread|valuation/i, required: 'target' },
  { sourceIndex: 3, category: 'TABLE_PROSE', query: 'Which valuation bucket and current spread range are associated?', target: /valuation bucket|spread/i, required: 'target-and-following', parentContext: true },
  { sourceIndex: 3, category: 'LONG_DOCUMENT_SECTION', query: 'Which workbook table contains the VM-20 current spread values?', target: /Table G|current spread/i, required: 'parent-and-target', parentContext: true },
  { sourceIndex: 3, category: 'AUTHORITY_SUPPORT_CONFUSION', query: 'Which workbook provides published VM-20 valuation-rate authority?', target: /valuation|spread|VM-20/i, required: 'parent-and-target', parentContext: true },
  { sourceIndex: 4, category: 'LOCAL_REQUIREMENT', query: 'Which VM-31 actuarial report template is required?', target: /actuarial report|template/i, required: 'target' },
  { sourceIndex: 4, category: 'SCOPE_REQUIREMENT', query: 'What scope applies to the VM-31 actuarial report template?', target: /scope|report|template/i, required: 'preceding-and-target', parentContext: true },
  { sourceIndex: 4, category: 'DEFINITION_APPLICATION', query: 'How does the actuarial report template apply to VM-31 documentation?', target: /actuarial|report|documentation/i, required: 'preceding-and-target', parentContext: true },
  { sourceIndex: 4, category: 'WRONG_SOURCE_NEGATIVE', query: 'Which VM-31 worksheet template is distinct from the VM-20 spread tables?', target: /VM-31|template|worksheet/i, required: 'target', parentContext: true },
  { sourceIndex: 5, category: 'LOCAL_REQUIREMENT', query: 'What does the 2015 VBT improvement-factor experience study report?', target: /2015|VBT|improvement factor/i, required: 'target' },
  { sourceIndex: 5, category: 'TABLE_PROSE', query: 'Which experience-study table explains mortality improvement factors?', target: /experience|mortality|improvement/i, required: 'target-and-following', parentContext: true },
  { sourceIndex: 5, category: 'WRONG_SOURCE_NEGATIVE', query: 'Which empirical VBT material is historical support rather than current valuation authority?', target: /VBT|experience study|historical/i, required: 'parent-and-target', parentContext: true },
  { sourceIndex: 5, category: 'AUTHORITY_SUPPORT_CONFUSION', query: 'What empirical mortality study supports but does not establish regulatory authority?', target: /mortality|support|study|VBT/i, required: 'parent-and-target', parentContext: true }
]

const sourceOrder = (child) => [child.worksheetOrder ?? 0, child.pageStart ?? Number.MAX_SAFE_INTEGER, child.pageEnd ?? Number.MAX_SAFE_INTEGER, child.rowStart ?? Number.MAX_SAFE_INTEGER, child.rowEnd ?? Number.MAX_SAFE_INTEGER, child.sourceChunkOrdinal ?? Number.MAX_SAFE_INTEGER, child.blockOrdinal ?? Number.MAX_SAFE_INTEGER, child.childId]
export const compareSourceOrder = (left, right) => { const a = sourceOrder(left); const b = sourceOrder(right); for (let index = 0; index < a.length; index += 1) { if (a[index] < b[index]) return -1; if (a[index] > b[index]) return 1 } return 0 }
export const orderChildren = (children) => [...children].sort(compareSourceOrder)
const chooseTarget = (chunks, definition) => chunks.find((chunk) => definition.target.test(chunk.sourceTextExcerpt || '')) || chunks[definition.fallbackIndex || 0]
const lexicalScore = (query, record) => tokens(query).filter((token) => tokens(normalizedRetrievalText(record)).includes(token)).length
export const scoreBaseline = lexicalScore
export const reciprocalRank = (rank) => rank ? 1 / rank : 0
export const computeContextMetrics = (requiredEvidenceIds, capturedEvidenceIds) => {
  const required = [...new Set(requiredEvidenceIds)]
  const captured = [...new Set(capturedEvidenceIds)]
  const requiredCaptured = required.filter((id) => captured.includes(id)).length
  const extraEvidenceIds = captured.filter((id) => !required.includes(id))
  return { requiredEvidenceCaptured: required.length > 0 && required.every((id) => captured.includes(id)), extraEvidenceIds, irrelevantEvidenceCount: extraEvidenceIds.length, contextPrecision: captured.length ? requiredCaptured / captured.length : 0, contextRecall: required.length ? requiredCaptured / required.length : 0 }
}
const deriveRequiredEvidence = (targetChild, siblings, mode) => {
  if (!targetChild) return []
  const position = siblings.findIndex((child) => child.childId === targetChild.childId)
  const previous = position > 0 ? siblings[position - 1] : null
  const next = position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null
  const result = [targetChild.childId]
  if (mode.includes('preceding') && previous) result.unshift(previous.childId)
  if (mode.includes('following') && next) result.push(next.childId)
  if (mode.includes('parent')) result.push('parent:' + targetChild.parentId)
  return [...new Set(result)]
}

export const buildEvaluation = ({ sources, privateBySource, parentRecords, childRecords }) => {
  const allChildren = childRecords.map((child) => ({ ...child, searchText: privateBySource.get(child.sourceId).children.find((item) => item.childId === child.childId)?.searchText || '' }))
  const allBaseline = sources.flatMap((source) => privateBySource.get(source.sourceId).baselineChunks)
  const parentsById = new Map(parentRecords.map((parent) => [parent.parentId, parent]))
  const childrenByParent = new Map()
  for (const child of allChildren) { if (!childrenByParent.has(child.parentId)) childrenByParent.set(child.parentId, []); childrenByParent.get(child.parentId).push(child) }
  for (const [parentId, siblings] of childrenByParent) childrenByParent.set(parentId, orderChildren(siblings))
  const cases = []
  for (let index = 0; index < evaluationDefinitions.length; index += 1) {
    const definition = evaluationDefinitions[index]
    const source = sources[definition.sourceIndex]
    const privateSource = privateBySource.get(source.sourceId)
    const targetCandidates = privateSource.baselineChunks.filter((chunk) => definition.target.test(chunk.sourceTextExcerpt || ''))
    const target = targetCandidates.find((chunk) => allChildren.some((child) => child.sourceId === source.sourceId && child.sourceChunkId === chunk.chunkId)) || privateSource.baselineChunks.find((chunk) => allChildren.some((child) => child.sourceId === source.sourceId && child.sourceChunkId === chunk.chunkId))
    if (!target) continue
    const query = definition.query
    const queryTokens = tokens(query)
    const baselineScore = (chunk) => queryTokens.filter((token) => tokens(normalizedRetrievalText(chunk)).includes(token)).length
    const baselineRanked = allBaseline.map((chunk) => ({ chunk, lexicalScore: baselineScore(chunk) })).filter((item) => item.lexicalScore > 0).sort((a, b) => b.lexicalScore - a.lexicalScore || a.chunk.chunkId.localeCompare(b.chunk.chunkId)).map((item, rank) => ({ ...item, rank: rank + 1 }))
    const architectureRanked = retrieveChildren(query, allChildren, parentsById)
    const targetChild = allChildren.find((child) => child.sourceChunkId === target.chunkId && child.sourceId === source.sourceId) || null
    const expectedParentId = targetChild?.parentId || null
    const selected = architectureRanked[0] || null
    const selectedParent = selected ? parentsById.get(selected.child.parentId) : null
    const siblings = selected ? childrenByParent.get(selected.child.parentId) || [] : []
    const expansion = expandContext(selected, architectureRanked, childrenByParent, { includeParent: Boolean(definition.parentContext), includePrevious: definition.required.includes('preceding'), includeFollowing: definition.required.includes('following') })
    const requiredEvidenceIds = deriveRequiredEvidence(targetChild, targetChild ? childrenByParent.get(targetChild.parentId) || [] : [], definition.required)
    const capturedEvidenceIds = [selected?.child.childId, expansion.parentContext ? 'parent:' + expansion.parentContext.parentId : null, expansion.precedingChild?.childId, expansion.followingChild?.childId].filter(Boolean)
    const contextMetrics = computeContextMetrics(requiredEvidenceIds, capturedEvidenceIds)
    const baselineTargetRank = baselineRanked.find((item) => item.chunk.chunkId === target.chunkId)?.rank || null
    const childTargetRank = architectureRanked.find((item) => item.child.childId === targetChild?.childId)?.rank || null
    const baselineTop = baselineRanked[0]?.chunk || null
    const expectedTargetSource = source.sourceId
    const selectedParentId = selectedParent?.parentId || null
    cases.push({
      caseId: 'pc-eval-' + String(index + 1).padStart(2, '0'),
      category: definition.category,
      query,
      expectedSourceId: expectedTargetSource,
      expectedRole: source.authoritySupportRole,
      expectedBaselineChunkId: target.chunkId,
      expectedChildId: targetChild?.childId || null,
      expectedParentId,
      requiredEvidenceIds,
      queryExternal: true,
      baseline: {
        top1SourceId: baselineTop?.sourceId || null,
        top1ChunkId: baselineTop?.chunkId || null,
        top3SourceIds: baselineRanked.slice(0, 3).map((item) => item.chunk.sourceId),
        baselineLexicalScore: baselineTop ? lexicalScore(query, baselineTop) : 0,
        sourceTop1Correct: baselineTop?.sourceId === expectedTargetSource,
        sourceTop3Correct: baselineRanked.slice(0, 3).some((item) => item.chunk.sourceId === expectedTargetSource),
        targetTop1Correct: baselineTop?.chunkId === target.chunkId,
        targetTop3Correct: baselineRanked.slice(0, 3).some((item) => item.chunk.chunkId === target.chunkId),
        baselineTargetRank,
        targetMrrContribution: reciprocalRank(baselineTargetRank),
        citationCorrect: Boolean(baselineTop?.citations?.length),
        contextSize: 1
      },
      parentChild: {
        selectedChildId: selected?.child.childId || null,
        selectedSourceId: selected?.child.sourceId || null,
        selectedRole: selected?.child.authoritySupportRole || null,
        selectedParentId,
        childLexicalScore: selected?.lexicalScore || 0,
        rerankAdjustment: selected?.rerankAdjustment || 0,
        finalRerankScore: selected?.rerankScore || 0,
        childTargetRank,
        targetMrrContribution: reciprocalRank(childTargetRank),
        correctSource: selected?.child.sourceId === expectedTargetSource,
        correctChild: selected?.child.childId === targetChild?.childId,
        correctParent: selectedParentId === expectedParentId,
        sourceTop3Correct: architectureRanked.slice(0, 3).some((item) => item.child.sourceId === expectedTargetSource),
        childTop3Correct: architectureRanked.slice(0, 3).some((item) => item.child.childId === targetChild?.childId),
        roleCorrect: selected?.child.authoritySupportRole === source.authoritySupportRole,
        citationCorrect: Boolean(selected?.child.citation?.pageReference || selected?.child.citation?.worksheetPath),
        parentContextId: expansion.parentContext?.parentId || null,
        parentContextExternal: Boolean(expansion.parentContext),
        precedingChildId: expansion.precedingChild?.childId || null,
        followingChildId: expansion.followingChild?.childId || null,
        expansionReason: expansion.reason,
        ...contextMetrics,
        childOnlySufficient: definition.required === 'target',
        parentExpansionRequired: definition.required.includes('parent') || Boolean(definition.parentContext),
        adjacentExpansionRequired: definition.required.includes('preceding') || definition.required.includes('following'),
        contextSize: capturedEvidenceIds.length
      }
    })
  }
  const metric = (selector) => cases.length ? cases.filter(selector).length / cases.length : 0
  const mrr = (kind) => cases.reduce((sum, item) => sum + item[kind].targetMrrContribution, 0) / Math.max(cases.length, 1)
  const improvements = cases.filter((item) => item.parentChild.correctChild && !item.baseline.targetTop1Correct).map((item) => item.caseId)
  const baselineWins = cases.filter((item) => !item.parentChild.correctChild && item.baseline.targetTop1Correct).map((item) => item.caseId)
  const ties = cases.filter((item) => item.parentChild.correctChild === item.baseline.targetTop1Correct).map((item) => item.caseId)
  return { schemaVersion: '1.0', runId: architectureRunId, evaluationMode: 'review_only', rankingInputExcludesTestExpectations: true, cases: cases.map((item) => ({ caseId: item.caseId, category: item.category, expectedSourceId: item.expectedSourceId, expectedRole: item.expectedRole, expectedBaselineChunkId: item.expectedBaselineChunkId, expectedChildId: item.expectedChildId, expectedParentId: item.expectedParentId, requiredEvidenceIds: item.requiredEvidenceIds, queryExternal: true, baseline: item.baseline, parentChild: item.parentChild })), privateCases: cases, metrics: {
    caseCount: cases.length,
    baseline: { sourceTop1: metric((item) => item.baseline.sourceTop1Correct), sourceTop3: metric((item) => item.baseline.sourceTop3Correct), targetTop1: metric((item) => item.baseline.targetTop1Correct), targetTop3: metric((item) => item.baseline.targetTop3Correct), targetMrr: mrr('baseline'), wrongSourceRate: metric((item) => !item.baseline.sourceTop1Correct), citationCorrectness: metric((item) => item.baseline.citationCorrect), averageContextSize: 1 },
    parentChildContext: { sourceTop1: metric((item) => item.parentChild.correctSource), sourceTop3: metric((item) => item.parentChild.sourceTop3Correct), targetTop1: metric((item) => item.parentChild.correctChild), targetTop3: metric((item) => item.parentChild.childTop3Correct), targetMrr: mrr('parentChild'), correctParentRate: metric((item) => item.parentChild.correctParent), requiredContextRecall: cases.reduce((sum, item) => sum + item.parentChild.contextRecall, 0) / Math.max(cases.length, 1), contextPrecision: cases.reduce((sum, item) => sum + item.parentChild.contextPrecision, 0) / Math.max(cases.length, 1), wrongSourceRate: metric((item) => !item.parentChild.correctSource), wrongSectionRate: metric((item) => !item.parentChild.correctParent), authoritySupportCorrectness: metric((item) => item.parentChild.roleCorrect), citationCorrectness: metric((item) => item.parentChild.citationCorrect), averageContextSize: cases.reduce((sum, item) => sum + item.parentChild.contextSize, 0) / Math.max(cases.length, 1), maximumContextSize: Math.max(...cases.map((item) => item.parentChild.contextSize), 0), irrelevantEvidenceCount: cases.reduce((sum, item) => sum + item.parentChild.irrelevantEvidenceCount, 0) } }, examples: { parentChildImproves: improvements, baselineImproves: baselineWins, ties, performedWorse: baselineWins }, limitations: ['Queries and substantive evaluation details are external/private.', 'Metrics are a focused architecture comparison, not production RAG readiness.', 'PDF children remain structural-parent/page-window children until reliable semantic subdivision is available.', 'PDF parent relationships are flat structural parents; deeper semantic nesting is not claimed.'] }
}

export const buildArchitecture = async ({ outputRoot = publicOutputRoot, externalRoot = externalProcessingRoot } = {}) => {
  await fs.mkdir(outputRoot, { recursive: true })
  await fs.mkdir(externalRoot, { recursive: true })
  const sourceBundles = []
  const publicParents = []
  const publicChildren = []
  const externalArtifacts = []
  for (const spec of provingGrounds) {
    const index = await readJson(path.join(spec.inputRoot, spec.sourceId, 'source-index.json'))
    const chunkManifest = await readJson(path.join(spec.inputRoot, spec.sourceId, 'chunk-manifest.json'))
    const source = index.source
    const chunks = chunkManifest.chunks || []
    const built = isPdf(chunks[0], source) ? buildPdf(source, spec, chunks) : buildXlsx(source, chunks)
    const parentContexts = built.parents.map((parent) => ({ parentId: parent.parentId, sourceId: source.sourceId, structuralLabel: parent.structuralLabel || null, structuralIdentifier: parent.structuralIdentifier || null, contextText: normalize(built.children.find((child) => child.parentId === parent.parentId)?.sourceTextExcerpt).slice(0, 600), bounded: true }))
    const externalValue = { schemaVersion: '1.0', runId: architectureRunId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, processingRepresentation: built.representation, parents: built.parents, parentContexts, children: built.children, fallbackUnits: built.fallbackUnits, baselineChunks: chunks.map((chunk) => ({ chunkId: chunk.chunkId, sourceId: chunk.sourceId, sourceSha256: source.sourceSha256, sourceTextExcerpt: chunk.sourceTextExcerpt || '', normalizedSearchText: normalizedRetrievalText(chunk), sectionReference: chunk.sectionReference || null, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, citations: chunk.citations || [], extensions: chunk.extensions || {} })), contexts: [], rightsStatus: source.rightsStatus, reviewOnly: true, promotionStatus: 'not_promoted' }
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
  const publicBySource = new Map(sourceBundles.map((bundle) => [bundle.source.sourceId, bundle.private]))
  const evaluation = buildEvaluation({ sources: sourceRecords, privateBySource: publicBySource, parentRecords: publicParents, childRecords: publicChildren })
  const privateEvaluationCases = evaluation.privateCases
  const publicEvaluation = { ...evaluation }
  delete publicEvaluation.privateCases
  const evaluatedContexts = publicEvaluation.cases.map((item) => ({ contextId: stableId(architectureRunId, 'context', item.parentChild.selectedChildId || item.caseId), evaluationCaseId: item.caseId, selectedChildId: item.parentChild.selectedChildId, parentContextId: item.parentChild.parentContextId, precedingChildId: item.parentChild.precedingChildId, followingChildId: item.parentChild.followingChildId, expansionReason: item.parentChild.expansionReason, contextTextExternal: true, sourceId: item.parentChild.selectedSourceId, sourceSha256: sourceRecords.find((source) => source.sourceId === item.parentChild.selectedSourceId)?.sourceSha256 || null, authoritySupportRole: item.parentChild.selectedRole, contextSize: item.parentChild.contextSize, reviewFlags: publicChildren.find((child) => child.childId === item.parentChild.selectedChildId)?.reviewFlags || [], reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }))
  const evaluationPath = path.join(externalRoot, 'evaluation-details.json')
  const evaluationBytes = Buffer.from(JSON.stringify({ schemaVersion: '1.0', runId: architectureRunId, cases: privateEvaluationCases, rightsStatus: 'RIGHTS_REVIEW_REQUIRED', reviewOnly: true }, null, 2) + '\n', 'utf8')
  await fs.writeFile(evaluationPath, evaluationBytes)
  externalArtifacts.push({ runId: architectureRunId, sourceId: 'architecture-evaluation', artifactType: 'parent-child-evaluation', externalPath: evaluationPath, sha256: sha256Bytes(evaluationBytes), byteCount: evaluationBytes.length, sourceRawSha256: null, generatedTimestamp: generatedAt, rightsStorageStatus: 'RIGHTS_REVIEW_REQUIRED', reviewOnly: true })
  const architectureManifest = { schemaVersion: '1.0', runId: architectureRunId, generatedAt, processingMode: 'review_only_architecture_evaluation', processingRepresentation: 'STRUCTURE_AWARE_PARENT_CHILD with explicit fallback representations', sourceIds: sourceRecords.map((source) => source.sourceId), sourceCount: sourceRecords.length, pdfSourceCount: sourceRecords.filter((source) => /\.pdf$/i.test(source.filename || '')).length, xlsxSourceCount: sourceRecords.filter((source) => /\.xlsx$/i.test(source.filename || '')).length, structureAwareSourceCount: sourceRecords.filter((source) => source.processingRepresentation === 'STRUCTURE_AWARE_PARENT_CHILD').length, fallbackSourceCount: sourceRecords.filter((source) => source.processingRepresentation !== 'STRUCTURE_AWARE_PARENT_CHILD').length, parentCount: publicParents.length, childCount: publicChildren.length, fallbackUnitCount: sourceRecords.reduce((sum, source) => sum + source.fallbackUnitCount, 0), rightsStatus: 'RIGHTS_REVIEW_REQUIRED', externalProcessingRoot: externalRoot, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
  const externalManifest = { schemaVersion: '1.0', manifestId: 'external-artifacts-' + architectureRunId, runId: architectureRunId, generatedTimestamp: generatedAt, externalProcessingRoot: externalRoot, rightsStorageStatuses: ['RIGHTS_REVIEW_REQUIRED'], reviewOnly: true, artifacts: externalArtifacts }
  await writeJson(path.join(outputRoot, 'architecture-manifest.json'), architectureManifest)
  await writeJson(path.join(outputRoot, 'parent-manifest.json'), { schemaVersion: '1.0', runId: architectureRunId, parents: publicParents, summary: { parentCount: publicParents.length, pdfParentCount: publicParents.filter((parent) => parent.parentType !== 'workbook_table_block').length, xlsxParentCount: publicParents.filter((parent) => parent.parentType === 'workbook_table_block').length }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(outputRoot, 'child-manifest.json'), { schemaVersion: '1.0', runId: architectureRunId, children: publicChildren, summary: { childCount: publicChildren.length, pdfChildCount: publicChildren.filter((child) => child.structuralType === 'semantic_retrieval_child').length, xlsxChildCount: publicChildren.filter((child) => child.structuralType === 'workbook_range_child').length }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(outputRoot, 'context-expansion-manifest.json'), { schemaVersion: '1.0', runId: architectureRunId, contexts: evaluatedContexts, summary: { contextCount: evaluatedContexts.length, maximumContextSize: 3, contextTextExternal: true }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(outputRoot, 'evidence-packages.json'), { schemaVersion: '1.0', runId: architectureRunId, packages: publicEvaluation.cases.map((item) => ({ packageId: stableId(architectureRunId, 'package', item.caseId), evaluationCaseId: item.caseId, selectedChildId: item.parentChild.selectedChildId, parentId: item.parentChild.selectedParentId, parentContextId: item.parentChild.parentContextId, precedingChildId: item.parentChild.precedingChildId, followingChildId: item.parentChild.followingChildId, sourceId: item.parentChild.selectedSourceId, sourceSha256: sourceRecords.find((source) => source.sourceId === item.parentChild.selectedSourceId)?.sourceSha256 || null, authoritySupportRole: item.parentChild.selectedRole, expansionReason: item.parentChild.expansionReason, retrievalScore: item.parentChild.childLexicalScore, rerankScore: item.parentChild.finalRerankScore, reviewFlags: publicChildren.find((child) => child.childId === item.parentChild.selectedChildId)?.reviewFlags || [], boundedContextExternal: true, contextSize: item.parentChild.contextSize, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })), summary: { packageCount: publicEvaluation.cases.length, boundedContextMaximum: 3 }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(outputRoot, 'baseline-comparison.json'), publicEvaluation)
  await writeJson(path.join(outputRoot, 'external-artifact-manifest.json'), externalManifest)
  await writeJson(path.join(outputRoot, 'architecture-source-records.json'), { schemaVersion: '1.0', runId: architectureRunId, sources: sourceRecords, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  return { architectureManifest, sourceRecords, parents: publicParents, children: publicChildren, contexts: evaluatedContexts, evaluation: publicEvaluation, externalManifest, publicOutputRoot: outputRoot, externalProcessingRoot: externalRoot }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildArchitecture().then((result) => console.log(JSON.stringify({ runId: architectureRunId, sourceCount: result.sourceRecords.length, parentCount: result.parents.length, childCount: result.children.length, evaluationCases: result.evaluation.cases.length, outputRoot: result.publicOutputRoot, externalProcessingRoot: result.externalProcessingRoot }, null, 2))).catch((error) => { console.error(error.stack || error.message); process.exitCode = 1 })
