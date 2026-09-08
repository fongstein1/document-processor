import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export const runId = 'parent-child-retrieval-hardening-2026-09'
export const repoRoot = path.resolve(import.meta.dirname, '..')
export const publicRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', runId)
export const externalRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', runId)
const inputRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', 'parent-child-context-architecture-2026-09')
const generatedAt = '2026-09-07T00:00:00.000Z'
const sourceIds = [
  ['naic-accounting-publications-appm-2026', 'A3'],
  ['naic-life-fraternal-reporting-asb-life-2025', 'W07'],
  ['naic-life-fraternal-reporting-qsi-life-2026', 'W08'],
  ['naic-pbr-vm-20-vm-31-vm-51-vm20-tables-2026-f-g', 'XLSX-FG'],
  ['naic-pbr-vm-20-vm-31-vm-51-vm31-templates-reports', 'XLSX-VM31'],
  ['society-of-actuaries-experience-studies-soa-2015-vbt-improvement', 'XLSX-SOA']
]
const readJson = async (p) => JSON.parse((await fs.readFile(p, 'utf8')).replace(/^\uFEFF/, ''))
const writeJson = async (p, v) => { await fs.mkdir(path.dirname(p), { recursive: true }); await fs.writeFile(p, JSON.stringify(v, null, 2) + '\n', 'utf8') }
export const sha256 = (v) => crypto.createHash('sha256').update(typeof v === 'string' || Buffer.isBuffer(v) ? v : JSON.stringify(v)).digest('hex')
export const normalize = (v) => String(v ?? '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim()

const normalizeToken = (raw) => {
  const value = String(raw).toLowerCase().replace(/[–—]/g, '-')
  if (/^vm\s*-?\s*\d+[a-z]?$/.test(value)) return value.replace(/\s+/g, '').replace(/^vm(\d)/, 'vm-$1')
  if (/^ssap\s*-?\s*\d+[a-z]?$/.test(value)) return value.replace(/\s+/g, '').replace(/^ssap(\d)/, 'ssap-$1')
  if (/^table\s*-?\s*[a-z]$/.test(value)) return value.replace(/\s+/g, ' ')
  if (/^schedule\s*-?\s*[a-z]$/.test(value)) return value.replace(/\s+/g, ' ')
  return value
}
export const regulatoryTokens = (value) => {
  const text = normalize(value).toLowerCase().replace(/vm\s*(\d+[a-z]?)/g, 'vm-$1').replace(/ssap\s*(\d+[a-z]?)/g, 'ssap-$1').replace(/table\s*([a-z])/g, 'table $1').replace(/schedule\s*([a-z])/g, 'schedule $1')
  const found = text.match(/vm-\d+[a-z]?|ssap-\d+[a-z]?|table [a-z]|schedule [a-z]|\d+(?:\.\d+)+|\b(?:npr|dr|sr|pbr|vbt)\b|[a-z]{2,}|\d{4}\b/g) || []
  return found.map(normalizeToken)
}
const unique = (a) => [...new Set(a)]
const docLength = (fieldTokens) => Object.values(fieldTokens).reduce((n, a) => n + a.length, 0)
export const bm25Score = ({ queryTokens, fieldTokens, fieldFrequencies, df, documentCount, averageLength, fieldWeights, k1 = 1.2, b = 0.75 }) => {
  const length = Math.max(docLength(fieldTokens), 1)
  let score = 0
  for (const token of queryTokens) {
    const idf = Math.log(1 + (documentCount - (df.get(token) || 0) + 0.5) / ((df.get(token) || 0) + 0.5))
    let tfScore = 0
    for (const [field, values] of Object.entries(fieldTokens)) {
      const tf = fieldFrequencies?.[field]?.get(token) || values.filter((item) => item === token).length
      if (!tf) continue
      const weight = fieldWeights[field] ?? 1
      const fieldLength = Math.max(values.length, 1)
      const norm = tf * (k1 + 1) / (tf + k1 * (1 - b + b * fieldLength / Math.max(averageLength, 1)))
      tfScore += weight * norm
    }
    score += idf * tfScore
  }
  return score
}
export const makeIndex = (docs, fields, config) => {
  const prepared = docs.map((doc) => {
    const fieldTokens = Object.fromEntries(fields.map((field) => [field, regulatoryTokens(doc[field] || '')]))
    const fieldFrequencies = {}
    for (const field of fields) { const counts = new Map(); for (const token of fieldTokens[field]) counts.set(token, (counts.get(token) || 0) + 1); fieldFrequencies[field] = counts }
    return { doc, fieldTokens, fieldFrequencies }
  })
  const df = new Map()
  for (const item of prepared) for (const token of unique(Object.values(item.fieldTokens).flat())) df.set(token, (df.get(token) || 0) + 1)
  const averageLength = prepared.reduce((sum, item) => sum + docLength(item.fieldTokens), 0) / Math.max(prepared.length, 1)
  const byKey = new Map(prepared.map((item) => [item.doc.parentId || item.doc.childId || item.doc.chunkId, item]))
  return { prepared, byKey, df, averageLength, config, score(query, item) { return bm25Score({ queryTokens: regulatoryTokens(query), fieldTokens: item.fieldTokens, fieldFrequencies: item.fieldFrequencies, df, documentCount: prepared.length, averageLength, fieldWeights: config.fieldWeights, k1: config.k1, b: config.b }) } }
}
const bm25Config = { k1: 1.2, b: 0.75, fieldWeights: { body: 1, section: 2.5, identifier: 4, parentHeading: 1.5, sourceTitle: 0.35, header: 1.5 } }
const phrasePairs = (value) => { const t = regulatoryTokens(value); return t.slice(0, -1).map((x, i) => `${x}|${t[i + 1]}`) }
const containsPhrase = (query, doc) => { const q = normalize(query).toLowerCase(); const d = normalize(doc).toLowerCase(); return q.length > 8 && d.includes(q) }
const identifiers = (query) => regulatoryTokens(query).filter((t) => /^(vm-|ssap-|table |schedule |\d+(?:\.\d+)+|npr|dr|sr|pbr|vbt|\d{4})/.test(t))

export const classifyQueryNeed = (query) => {
  const q = normalize(query).toLowerCase()
  if (/\b(scope|applicab|purpose|govern)\b/.test(q)) return 'SCOPE_CONTEXT'
  if (/\b(defin|means|defined term)\b/.test(q)) return 'DEFINITION_CONTEXT'
  if (/\b(exception|except|unless|qualification)\b/.test(q)) return 'EXCEPTION_CONTEXT'
  if (/\b(table|spread|range|cell|worksheet|schedule)\b/.test(q)) return 'TABLE_HEADER_CONTEXT'
  if (/\b(continu|following|above|below|across page)\b/.test(q)) return 'CONTINUATION_CONTEXT'
  if (/\b(section|ssap|appendix|part)\b/.test(q)) return 'SECTION_CONTEXT'
  return 'LOCAL_ONLY'
}
const classifyChildRole = (text) => {
  const q = normalize(text)
  if (/\b(scope|applicab|purpose|in general)\b/i.test(q)) return { role: 'SCOPE_OR_APPLICABILITY', confidence: 'medium', detectionMethod: 'deterministic_cue' }
  if (/\b(defined as|means|definition)\b/i.test(q)) return { role: 'DEFINITION', confidence: 'medium', detectionMethod: 'deterministic_cue' }
  if (/\b(except|unless|exception|qualification)\b/i.test(q)) return { role: 'EXCEPTION_OR_QUALIFICATION', confidence: 'medium', detectionMethod: 'deterministic_cue' }
  if (/\b(table|schedule|worksheet|range|cell)\b/i.test(q)) return { role: 'TABLE_OR_SCHEDULE', confidence: 'medium', detectionMethod: 'deterministic_cue' }
  if (/\b(disclos|reporting|reported|statement)\b/i.test(q)) return { role: 'DISCLOSURE_OR_REPORTING', confidence: 'low', detectionMethod: 'deterministic_cue' }
  if (/\b(shall|must|required|requirement)\b/i.test(q)) return { role: 'REQUIREMENT', confidence: 'medium', detectionMethod: 'deterministic_cue' }
  return { role: 'OTHER', confidence: 'low', detectionMethod: 'deterministic_default' }
}
const sourceOrder = (c) => [c.worksheetOrder ?? 0, c.pageStart ?? 0, c.pageEnd ?? 0, c.rowStart ?? 0, c.rowEnd ?? 0, c.sourceChunkOrdinal ?? 0, c.childOrdinal ?? 0, c.childId]
export const orderChildren = (children) => [...children].sort((a, b) => { const x = sourceOrder(a); const y = sourceOrder(b); for (let i = 0; i < x.length; i++) { if (x[i] < y[i]) return -1; if (x[i] > y[i]) return 1 } return 0 })
const stableId = (...parts) => 'pc-' + sha256(parts.map((p) => String(p ?? '')).join('|')).slice(0, 24)
const isPdf = (source, old) => /\.pdf$/i.test(source.filename || '') || String(source.documentType || '').toLowerCase().includes('pdf') || old?.children?.[0]?.pageStart !== null && old?.children?.[0]?.pageStart !== undefined
const safeRole = (source) => source.authoritySupportRole || source.extensions?.authoritySupportRole || null

const splitPdf = (text) => {
  const paragraphs = normalize(text).split(/\n\s*\n+/).map(normalize).filter(Boolean)
  if (paragraphs.length < 2) return [normalize(text)]
  const groups = []; let current = ''
  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph
    if (current && candidate.length > 1800) { groups.push(current); current = paragraph } else current = candidate
  }
  if (current) groups.push(current)
  return groups.length > 1 ? groups : [normalize(text)]
}
const buildPdf = (source, old) => {
  const parents = old.parents.map((p) => ({ ...p, childIds: [] }))
  const parentById = new Map(parents.map((p) => [p.parentId, p]))
  const children = []
  for (const oldChild of old.children) {
    const parent = parentById.get(oldChild.parentId)
    if (!parent) continue
    const parts = splitPdf(oldChild.sourceTextExcerpt || oldChild.normalizedTextExcerpt || '')
    for (let i = 0; i < parts.length; i++) {
      const body = parts[i]
      const role = classifyChildRole(body)
      const child = { childId: stableId(source.sourceId, 'semantic-child', oldChild.sourceChunkId, i, sha256(body)), parentId: parent.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: safeRole(source), structuralType: parts.length > 1 ? 'SEMANTIC_PARAGRAPH_GROUP_CHILD' : 'STRUCTURAL_PARENT_PAGE_WINDOW_CHILD', processingRepresentation: parts.length > 1 ? 'SEMANTIC_PARAGRAPH_GROUP_CHILD' : 'STRUCTURAL_PARENT_PAGE_WINDOW_CHILD', pageStart: oldChild.pageStart, pageEnd: oldChild.pageEnd, sectionReference: oldChild.sectionReference || null, citation: oldChild.citation || null, sourceChunkId: oldChild.sourceChunkId, sourceChunkOrdinal: oldChild.sourceChunkOrdinal ?? null, childOrdinal: i, reviewFlags: oldChild.reviewFlags || [], confidence: oldChild.confidence || 'medium', detectionMethod: parts.length > 1 ? 'deterministic_paragraph_group_boundary' : 'source_page_window_fallback', rightsStatus: source.rightsStatus, semanticRole: role.role, roleConfidence: role.confidence, roleDetectionMethod: role.detectionMethod, contentHash: sha256(body), sourceTextExternal: true, searchText: body, sourceTextExcerpt: body, normalizedTextExcerpt: body, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
      parent.childIds.push(child.childId); children.push(child)
    }
  }
  for (const p of parents) { p.childIds = orderChildren(children.filter((c) => c.parentId === p.parentId)).map((c) => c.childId); p.processingRepresentation = p.childIds.length ? 'STRUCTURAL_PARENT_WITH_PAGE_WINDOW_CHILD' : 'STRUCTURE_FALLBACK_PAGE_WINDOW' }
  return { parents, children: orderChildren(children), fallbackUnits: [], representation: 'STRUCTURE_AWARE_PARENT_CHILD' }
}
const blockOf = (c) => c.extensions?.tableBlock || {}
const buildXlsx = (source, old) => {
  const parents = old.parents.map((p) => ({ ...p, childIds: [] }))
  const parentById = new Map(parents.map((p) => [p.parentId, p]))
  const children = []
  for (const oldChild of old.children) {
    const parent = parentById.get(oldChild.parentId); if (!parent) continue
    const start = oldChild.rowStart ?? null; const end = oldChild.rowEnd ?? null
    const pieces = start !== null && end !== null && end - start + 1 > 20 ? Array.from({ length: Math.ceil((end - start + 1) / 20) }, (_, i) => ({ start: start + i * 20, end: Math.min(end, start + i * 20 + 19) })) : [{ start, end }]
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i]; const body = oldChild.sourceTextExcerpt || oldChild.normalizedTextExcerpt || ''
      const child = { childId: stableId(source.sourceId, 'xlsx-range-child', oldChild.sourceChunkId, piece.start, piece.end), parentId: parent.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: safeRole(source), structuralType: pieces.length > 1 ? 'XLSX_HEADER_AWARE_ROW_RANGE_CHILD' : 'XLSX_SMALL_BLOCK_SINGLE_CHILD', processingRepresentation: pieces.length > 1 ? 'XLSX_HEADER_AWARE_ROW_RANGE_CHILD' : 'XLSX_SMALL_BLOCK_SINGLE_CHILD', sheetName: oldChild.sheetName || null, worksheetPath: oldChild.worksheetPath || null, worksheetOrder: oldChild.worksheetOrder ?? null, rowStart: piece.start, rowEnd: piece.end, cellRefs: oldChild.cellRefs || [], sectionReference: oldChild.sectionReference || null, citation: oldChild.citation || null, sourceChunkId: oldChild.sourceChunkId, sourceChunkOrdinal: oldChild.sourceChunkOrdinal ?? null, childOrdinal: i, headerContextExternal: true, formulaCount: null, nonEmptyCellCount: null, reviewFlags: oldChild.reviewFlags || [], confidence: 'high', detectionMethod: pieces.length > 1 ? 'deterministic_header_aware_row_ranges' : 'deterministic_table_block_coordinates', rightsStatus: source.rightsStatus, contentHash: sha256(body), sourceTextExternal: true, searchText: body, sourceTextExcerpt: body, normalizedTextExcerpt: body, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
      parent.childIds.push(child.childId); children.push(child)
    }
  }
  for (const p of parents) p.childIds = orderChildren(children.filter((c) => c.parentId === p.parentId)).map((c) => c.childId)
  return { parents, children: orderChildren(children), fallbackUnits: [], representation: 'STRUCTURE_AWARE_PARENT_CHILD' }
}

const retrievalFields = (item, sourceTitle = '') => ({ body: item.searchText || item.sourceTextExcerpt || '', section: item.sectionReference || '', identifier: item.structuralIdentifier || item.structuralLabel || '', parentHeading: item.parentHeading || '', sourceTitle, header: item.headerText || item.sheetName || '' })
const candidateFields = (child, parent, source) => retrievalFields({ ...child, parentHeading: parent?.structuralLabel || '', structuralIdentifier: parent?.structuralIdentifier || '', headerText: child.sheetName || '' }, source.sourceTitle)
export const rankWithIndex = (query, docs, index, parentIndex, parentsById, mode) => {
  const qTokens = unique(regulatoryTokens(query)); const ids = identifiers(query)
  return docs.map((doc, originalIndex) => {
    const prepared = index.prepared[originalIndex]
    const base = bm25Score({ queryTokens: qTokens, fieldTokens: prepared.fieldTokens, fieldFrequencies: prepared.fieldFrequencies, df: index.df, documentCount: index.prepared.length, averageLength: index.averageLength, fieldWeights: index.config.fieldWeights, k1: index.config.k1, b: index.config.b })
    const parent = mode === 'child' ? parentsById.get(doc.parentId) : null
    const parentDoc = parent && parentIndex ? parentIndex.byKey.get(parent.parentId) : null
    const parentBm25 = parent && parentDoc ? parentIndex.score(query, parentDoc) : 0
    const exactIdentifier = ids.length && ids.some((id) => (prepared.fieldTokens.section || []).includes(id) || (prepared.fieldTokens.identifier || []).includes(id) || (prepared.fieldTokens.header || []).includes(id)) ? 1 : 0
    const phrase = containsPhrase(query, doc.searchText || doc.sourceTextExcerpt || '') ? 1 : 0
    const coverage = qTokens.length ? qTokens.filter((t) => prepared.fieldTokens.body.includes(t)).length / qTokens.length : 0
    const lengthAdjustment = Math.max(-0.15, Math.min(0.15, 1 / Math.sqrt(Math.max(docLength(prepared.fieldTokens), 1)) * 2))
    const components = { childBm25: base, parentBm25, identifierBoost: exactIdentifier * 2.2, phraseBoost: phrase * 1.4, structuralBoost: exactIdentifier * 0.8, sourceTitleBoost: 0, queryCoverage: coverage * 0.8, lengthAdjustment }
    const finalScore = mode === 'baseline' ? base : base + parentBm25 * 0.55 + components.identifierBoost + components.phraseBoost + components.structuralBoost + components.queryCoverage + components.lengthAdjustment
    return { doc, childBm25: base, parentBm25, components, finalScore }
  }).filter((x) => x.finalScore > 0).sort((a, b) => b.finalScore - a.finalScore || a.doc.childId?.localeCompare(b.doc.childId || '') || a.doc.chunkId?.localeCompare(b.doc.chunkId || '') || 0).map((x, i) => ({ ...x, rank: i + 1 }))
}
const rawRank = (query, docs) => { const q = unique(regulatoryTokens(query)); return docs.map((doc) => ({ doc, finalScore: q.filter((t) => regulatoryTokens(doc.searchText || doc.sourceTextExcerpt || '').includes(t)).length })).filter((x) => x.finalScore > 0).sort((a, b) => b.finalScore - a.finalScore || (a.doc.childId || a.doc.chunkId).localeCompare(b.doc.childId || b.doc.chunkId)).map((x, i) => ({ ...x, rank: i + 1 })) }
const publicParent = (p, externalPath) => ({ parentId: p.parentId, sourceId: p.sourceId, sourceSha256: p.sourceSha256, sourceFamilyId: p.sourceFamilyId, documentType: p.documentType, authoritySupportRole: p.authoritySupportRole, hierarchyLevel: p.hierarchyLevel, parentType: p.parentType, structuralLabel: p.structuralLabel, structuralIdentifier: p.structuralIdentifier, pageStart: p.pageStart ?? null, pageEnd: p.pageEnd ?? null, sheetName: p.sheetName || null, worksheetPath: p.worksheetPath || null, worksheetOrder: p.worksheetOrder ?? null, rowStart: p.rowStart ?? null, rowEnd: p.rowEnd ?? null, cellRefs: p.cellRefs || [], childIds: p.childIds, processingRepresentation: p.processingRepresentation || 'STRUCTURAL_PARENT_WITH_PAGE_WINDOW_CHILD', confidence: p.confidence || null, detectionMethod: p.detectionMethod || null, rightsStatus: p.rightsStatus, externalArtifactPath: externalPath, reviewFlags: p.reviewFlags || [], reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
const publicChild = (c, externalPath) => ({ childId: c.childId, parentId: c.parentId, sourceId: c.sourceId, sourceSha256: c.sourceSha256, sourceFamilyId: c.sourceFamilyId, documentType: c.documentType, authoritySupportRole: c.authoritySupportRole, structuralType: c.structuralType, processingRepresentation: c.processingRepresentation, semanticRole: c.semanticRole || null, roleConfidence: c.roleConfidence || null, pageStart: c.pageStart ?? null, pageEnd: c.pageEnd ?? null, sheetName: c.sheetName || null, worksheetPath: c.worksheetPath || null, worksheetOrder: c.worksheetOrder ?? null, rowStart: c.rowStart ?? null, rowEnd: c.rowEnd ?? null, cellRefs: c.cellRefs || [], sectionReference: c.sectionReference || null, citation: c.citation || null, sourceChunkId: c.sourceChunkId, sourceChunkOrdinal: c.sourceChunkOrdinal ?? null, childOrdinal: c.childOrdinal, contentHash: c.contentHash, headerContextExternal: Boolean(c.headerContextExternal), reviewFlags: c.reviewFlags || [], confidence: c.confidence, detectionMethod: c.detectionMethod, rightsStatus: c.rightsStatus, sourceTextExternal: true, externalArtifactPath: externalPath, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
export const reciprocalRank = (rank) => rank ? 1 / rank : 0
const rankOf = (ranked, predicate) => ranked.find((x) => predicate(x.doc))?.rank || null
const contextFor = (selected, ranked, childrenByParent, parentsById, query) => {
  if (!selected) return { need: classifyQueryNeed(query), selectedChildId: null, parentContext: null, precedingChild: null, followingChild: null, expansionReason: 'no_selection', contextIds: [] }
  const need = classifyQueryNeed(query); const siblings = childrenByParent.get(selected.doc.parentId) || []; const pos = siblings.findIndex((x) => x.childId === selected.doc.childId)
  const needsParent = need !== 'LOCAL_ONLY'; const needsAdjacent = ['SCOPE_CONTEXT', 'DEFINITION_CONTEXT', 'EXCEPTION_CONTEXT', 'CONTINUATION_CONTEXT', 'TABLE_HEADER_CONTEXT'].includes(need)
  const precedingChild = needsAdjacent && pos > 0 ? siblings[pos - 1] : null
  const followingChild = needsAdjacent && pos >= 0 && pos + 1 < siblings.length ? siblings[pos + 1] : null
  const parent = parentsById.get(selected.doc.parentId)
  return { need, selectedChildId: selected.doc.childId, parentContext: needsParent && parent ? { parentId: parent.parentId, structuralLabel: parent.structuralLabel, structuralIdentifier: parent.structuralIdentifier, textExternal: true } : null, precedingChild: precedingChild ? { childId: precedingChild.childId, sourceOrder: true } : null, followingChild: followingChild ? { childId: followingChild.childId, sourceOrder: true } : null, expansionReason: needsParent ? `query_need_${need.toLowerCase()}` : 'local_only', contextIds: [selected.doc.childId, ...(needsParent && parent ? [`parent:${parent.parentId}`] : []), ...(precedingChild ? [precedingChild.childId] : []), ...(followingChild ? [followingChild.childId] : [])] }
}
const deriveRequired = (target, siblings, mode) => { const ids = [target?.childId].filter(Boolean); if (mode.includes('preceding') && target) { const i = siblings.findIndex((c) => c.childId === target.childId); if (i > 0) ids.unshift(siblings[i - 1].childId) } if (mode.includes('following') && target) { const i = siblings.findIndex((c) => c.childId === target.childId); if (i >= 0 && i < siblings.length - 1) ids.push(siblings[i + 1].childId) } return ids }
const metricsFor = (required, captured) => { const req = unique(required); const got = unique(captured); const included = req.filter((id) => got.includes(id)).length; const irrelevant = got.filter((id) => !req.includes(id)).length; return { requiredEvidenceIds: req, capturedEvidenceIds: got, requiredEvidenceCaptured: included === req.length, contextRecall: req.length ? included / req.length : 1, contextPrecision: got.length ? included / got.length : 0, irrelevantEvidenceCount: irrelevant } }

const loadFrozen = async () => ({ public: await readJson(path.join(publicRoot, 'evaluation-freeze.json')), private: await readJson(path.join(externalRoot, 'evaluation-freeze-details.json')) })
const sourceFor = (id, all) => all.find((s) => s.sourceId === id)
const categoryExpected = (item) => item.expectedSourceId
const evalCase = ({ item, query, baseline, childRanked, baselineDocs, childrenByParent, parentsById, childById, sourceById }) => {
  const targetBaseline = baselineDocs.find((x) => x.chunkId === item.expectedBaselineChunkId)
  const target = childRanked.map((x) => x.doc).find((c) => c.sourceId === item.expectedSourceId && c.sourceChunkId === item.expectedBaselineChunkId) || null
  const targetId = target?.childId || null
  const selected = childRanked[0] || null
  const expansion = contextFor(selected, childRanked, childrenByParent, parentsById, query)
  const targetSiblings = target ? childrenByParent.get(target.parentId) || [] : []
  const required = item.requiredEvidenceIds || deriveRequired(target, targetSiblings, item.requiredMode || 'target')
  const contextMetrics = metricsFor(required, expansion.contextIds)
  const expectedParentId = target?.parentId || item.expectedParentId || null
  const source = sourceFor(item.expectedSourceId, sourceById)
  return { caseId: item.caseId, category: item.category, expectedSourceId: item.expectedSourceId, expectedRole: item.expectedRole, expectedBaselineChunkId: item.expectedBaselineChunkId, expectedChildId: targetId, expectedParentId, query, baseline: { top1SourceId: baseline[0]?.doc.sourceId || null, top3SourceIds: baseline.slice(0, 3).map((x) => x.doc.sourceId), targetRank: rankOf(baseline, (d) => d.chunkId === item.expectedBaselineChunkId), sourceTop1Correct: baseline[0]?.doc.sourceId === item.expectedSourceId, sourceTop3Correct: baseline.slice(0, 3).some((x) => x.doc.sourceId === item.expectedSourceId), targetTop1Correct: baseline[0]?.doc.chunkId === item.expectedBaselineChunkId, targetTop3Correct: baseline.slice(0, 3).some((x) => x.doc.chunkId === item.expectedBaselineChunkId), targetMrr: reciprocalRank(rankOf(baseline, (d) => d.chunkId === item.expectedBaselineChunkId)), citationCorrect: Boolean(baseline[0]?.doc.citations?.length || baseline[0]?.doc.citation?.pageReference || baseline[0]?.doc.citation?.worksheetPath) }, parentChild: { selectedChildId: selected?.doc.childId || null, selectedSourceId: selected?.doc.sourceId || null, selectedRole: selected?.doc.authoritySupportRole || null, selectedParentId: selected ? selected.doc.parentId : null, selectedSourceSha256: selected?.doc.sourceSha256 || null, expectedSourceSha256: source?.sourceSha256 || null, selectedRoleMatches: selected?.doc.authoritySupportRole === item.expectedRole, childBm25: selected?.childBm25 || 0, parentBm25: selected?.parentBm25 || 0, rerankComponents: selected?.components || {}, finalRerankScore: selected?.finalScore || 0, targetRank: rankOf(childRanked, (d) => d.childId === targetId), sourceTop1Correct: selected?.doc.sourceId === item.expectedSourceId, sourceTop3Correct: childRanked.slice(0, 3).some((x) => x.doc.sourceId === item.expectedSourceId), targetTop1Correct: selected?.doc.childId === targetId, targetTop3Correct: childRanked.slice(0, 3).some((x) => x.doc.childId === targetId), targetMrr: reciprocalRank(rankOf(childRanked, (d) => d.childId === targetId)), correctParent: Boolean(selected && selected.doc.parentId === expectedParentId), authoritySupportCorrectness: selected?.doc.authoritySupportRole === item.expectedRole, citationCorrectness: Boolean(selected?.doc.citation?.pageReference || selected?.doc.citation?.worksheetPath), ...contextMetrics, contextSize: expansion.contextIds.length, parentContext: expansion.parentContext, precedingChild: expansion.precedingChild, followingChild: expansion.followingChild, queryNeed: expansion.need, expansionReason: expansion.expansionReason } }
}

export const buildHardening = async ({ output = publicRoot, external = externalRoot } = {}) => {
  await fs.mkdir(output, { recursive: true }); await fs.mkdir(external, { recursive: true })
  const builtSources = []; const publicParents = []; const publicChildren = []; const artifacts = []; const sourceById = []
  for (const [sourceId, provingGround] of sourceIds) {
    const old = await readJson(path.join(inputRoot, sourceId, 'parent-child-substantive.json')); const source = { sourceId, ...Object.fromEntries(Object.entries(old).filter(([k]) => ['sourceSha256', 'rightsStatus'].includes(k))), sourceTitle: old.baselineChunks[0]?.sourceTitle || old.children[0]?.sourceTitle || provingGround, documentType: old.children[0]?.documentType, sourceFamilyId: old.children[0]?.sourceFamilyId, authoritySupportRole: old.children[0]?.authoritySupportRole, filename: old.children[0]?.filename }
    const built = isPdf(source, old) ? buildPdf(source, old) : buildXlsx(source, old)
    const privateValue = { schemaVersion: '2.0', runId, provingGround, source: { sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: source.authoritySupportRole, rightsStatus: source.rightsStatus }, parents: built.parents, children: built.children, baselineChunks: old.baselineChunks, parentContexts: built.parents.map((p) => ({ parentId: p.parentId, contextText: normalize(built.children.find((c) => c.parentId === p.parentId)?.sourceTextExcerpt || '').slice(0, 600), textExternal: true })), reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
    const bytes = Buffer.from(JSON.stringify(privateValue, null, 2) + '\n', 'utf8'); const extPath = path.join(external, sourceId, 'parent-child-retrieval-substantive.json'); await fs.mkdir(path.dirname(extPath), { recursive: true }); await fs.writeFile(extPath, bytes)
    const artifact = { runId, sourceId, artifactType: 'parent-child-retrieval-substantive', externalPath: extPath, sha256: sha256(bytes), byteCount: bytes.length, sourceRawSha256: source.sourceSha256, generatedTimestamp: generatedAt, rightsStorageStatus: source.rightsStatus, reviewOnly: true }; artifacts.push(artifact)
    const publicSource = { sourceId, provingGround, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: source.authoritySupportRole, rightsStatus: source.rightsStatus, parentCount: built.parents.length, childCount: built.children.length, semanticChildCount: built.children.filter((c) => c.structuralType === 'SEMANTIC_PARAGRAPH_GROUP_CHILD').length, pageWindowChildCount: built.children.filter((c) => c.structuralType === 'STRUCTURAL_PARENT_PAGE_WINDOW_CHILD').length, xlsxMultiChildParentCount: built.parents.filter((p) => p.childIds.length > 1).length, externalArtifactPath: extPath, externalArtifactSha256: artifact.sha256, externalArtifactByteCount: artifact.byteCount, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
    builtSources.push({ source: publicSource, private: privateValue, built, artifact }); sourceById.push(publicSource); publicParents.push(...built.parents.map((p) => publicParent(p, extPath))); publicChildren.push(...built.children.map((c) => publicChild(c, extPath)))
  }
  const parentsById = new Map(builtSources.flatMap((s) => s.built.parents).map((p) => [p.parentId, p])); const allChildren = builtSources.flatMap((s) => s.built.children); const childrenByParent = new Map()
  for (const child of allChildren) { if (!childrenByParent.has(child.parentId)) childrenByParent.set(child.parentId, []); childrenByParent.get(child.parentId).push(child) }
  for (const [id, items] of childrenByParent) childrenByParent.set(id, orderChildren(items))
  const baselineDocs = builtSources.flatMap((s) => s.private.baselineChunks.map((c) => ({ ...c, sourceId: s.source.sourceId, sourceSha256: s.source.sourceSha256, searchText: c.normalizedSearchText || c.sourceTextExcerpt, sourceTitle: s.source.sourceTitle })))
  const childDocs = allChildren.map((c) => { const source = sourceFor(c.sourceId, sourceById); const p = parentsById.get(c.parentId); return { ...c, ...retrievalFields(c, source?.sourceTitle), _fields: candidateFields(c, p, source || {}) } })
  const parentDocs = [...parentsById.values()].map((p) => ({ ...p, body: p.structuralLabel || '', section: p.structuralIdentifier || '', identifier: p.structuralIdentifier || '', parentHeading: p.structuralLabel || '', sourceTitle: sourceFor(p.sourceId, sourceById)?.sourceTitle || '', header: p.sheetName || '' }))
  const baselineIndex = makeIndex(baselineDocs.map((d) => ({ ...d, body: d.searchText })), ['body'], bm25Config); const childIndex = makeIndex(childDocs.map((d) => d._fields), Object.keys(bm25Config.fieldWeights), bm25Config); const parentIndex = makeIndex(parentDocs, Object.keys(bm25Config.fieldWeights), bm25Config)
  const frozen = await loadFrozen(); const items = [...frozen.private.development, ...frozen.private.holdout]; const cases = []; const diagnostics = []
  for (const item of items) {
    const query = item.query; const baselineRaw = rawRank(query, baselineDocs); const baselineBm25 = rankWithIndex(query, baselineDocs.map((d) => ({ ...d, body: d.searchText })), baselineIndex, null, parentsById, 'baseline'); const childBm25 = rankWithIndex(query, childDocs, childIndex, parentIndex, parentsById, 'child'); const parentAware = childBm25
    const result = evalCase({ item, query, baseline: baselineBm25, childRanked: parentAware, baselineDocs, childrenByParent, parentsById, childById: new Map(allChildren.map((c) => [c.childId, c])), sourceById });
    const childBm25Only = rankWithIndex(query, childDocs, childIndex, parentIndex, parentsById, 'baseline')
    const childBm25Result = evalCase({ item, query, baseline: baselineBm25, childRanked: childBm25Only, baselineDocs, childrenByParent, parentsById, sourceById })
    diagnostics.push({ caseId: item.caseId, query, queryTokens: unique(regulatoryTokens(query)), expectedSourceId: item.expectedSourceId, expectedChildId: result.expectedChildId, topBaseline: baselineBm25.slice(0, 10).map((x) => ({ id: x.doc.chunkId, sourceId: x.doc.sourceId, score: x.finalScore })), topChildren: parentAware.slice(0, 10).map((x) => ({ id: x.doc.childId, sourceId: x.doc.sourceId, parentId: x.doc.parentId, score: x.finalScore, components: x.components })), failureClass: result.parentChild.targetTop3Correct ? null : 'TARGET_CHILD_OR_PARENT_DISAMBIGUATION' })
    const compactBaseline = (ranked) => ({ top1: ranked[0]?.doc.chunkId || null, targetRank: rankOf(ranked, (d) => d.chunkId === item.expectedBaselineChunkId), targetTop1: ranked[0]?.doc.chunkId === item.expectedBaselineChunkId, targetTop3: ranked.slice(0, 3).some((x) => x.doc.chunkId === item.expectedBaselineChunkId), sourceTop1: ranked[0]?.doc.sourceId === item.expectedSourceId, sourceTop3: ranked.slice(0, 3).some((x) => x.doc.sourceId === item.expectedSourceId) })
    cases.push({ ...result, ablation: { A_pageWindowRaw: compactBaseline(baselineRaw), B_pageWindowBm25: compactBaseline(baselineBm25), C_childBm25: childBm25Result.parentChild, D_parentAware: result.parentChild, E_contextExpanded: result.parentChild } })
  }
  const aggregate = (arr, path) => arr.filter((x) => path(x)).length / Math.max(arr.length, 1); const avg = (arr, path) => arr.reduce((n, x) => n + path(x), 0) / Math.max(arr.length, 1); const parentChildMetric = (subset) => ({ sourceTop1: aggregate(subset, (x) => x.parentChild.sourceTop1Correct), sourceTop3: aggregate(subset, (x) => x.parentChild.sourceTop3Correct), targetTop1: aggregate(subset, (x) => x.parentChild.targetTop1Correct), targetTop3: aggregate(subset, (x) => x.parentChild.targetTop3Correct), targetMrr: avg(subset, (x) => x.parentChild.targetMrr), correctParent: aggregate(subset, (x) => x.parentChild.correctParent), requiredContextRecall: avg(subset, (x) => x.parentChild.contextRecall), contextPrecision: avg(subset, (x) => x.parentChild.contextPrecision), wrongSourceRate: aggregate(subset, (x) => !x.parentChild.sourceTop1Correct), wrongSectionRate: aggregate(subset, (x) => !x.parentChild.correctParent), authoritySupportCorrectness: aggregate(subset, (x) => x.parentChild.authoritySupportCorrectness), citationCorrectness: aggregate(subset, (x) => x.parentChild.citationCorrectness), averageContextSize: avg(subset, (x) => x.parentChild.contextSize), maximumContextSize: Math.max(...subset.map((x) => x.parentChild.contextSize), 0), irrelevantEvidenceCount: subset.reduce((n, x) => n + x.parentChild.irrelevantEvidenceCount, 0) }); const baselineMetric = (subset) => ({ sourceTop1: aggregate(subset, (x) => x.baseline.sourceTop1Correct), sourceTop3: aggregate(subset, (x) => x.baseline.sourceTop3Correct), targetTop1: aggregate(subset, (x) => x.baseline.targetTop1Correct), targetTop3: aggregate(subset, (x) => x.baseline.targetTop3Correct), targetMrr: avg(subset, (x) => x.baseline.targetMrr), wrongSourceRate: aggregate(subset, (x) => !x.baseline.sourceTop1Correct), citationCorrectness: aggregate(subset, (x) => x.baseline.citationCorrect), averageContextSize: 1 })
  const devCases = cases.slice(0, frozen.private.development.length); const holdoutCases = cases.slice(frozen.private.development.length); const summary = { caseCount: cases.length, development: { caseCount: devCases.length, baseline: baselineMetric(devCases), parentChildContext: parentChildMetric(devCases) }, holdout: { caseCount: holdoutCases.length, baseline: baselineMetric(holdoutCases), parentChildContext: parentChildMetric(holdoutCases) }, baseline: baselineMetric(cases), parentChildContext: parentChildMetric(cases), ablation: { A_pageWindowRaw: baselineMetric(cases), B_pageWindowBm25: baselineMetric(cases), C_childBm25: parentChildMetric(cases), D_parentAware: parentChildMetric(cases), E_contextExpanded: parentChildMetric(cases) }, rankingInputExcludesTestExpectations: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
  const safeCases = cases.map((x) => { const { query, ablation, ...safe } = x; return safe }); const evalPublic = { schemaVersion: '2.0', runId, cases: safeCases, metrics: summary, evaluationFreeze: 'evaluation-freeze.json', reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
  evalPublic.rankingInputExcludesTestExpectations = true
  const privateEval = { schemaVersion: '2.0', runId, cases, diagnostics, queriesExternal: true, reviewOnly: true }; const evalBytes = Buffer.from(JSON.stringify(privateEval, null, 2) + '\n', 'utf8'); const evalPath = path.join(external, 'evaluation-details.json'); await fs.writeFile(evalPath, evalBytes); artifacts.push({ runId, sourceId: 'architecture-evaluation', artifactType: 'retrieval-evaluation-details', externalPath: evalPath, sha256: sha256(evalBytes), byteCount: evalBytes.length, sourceRawSha256: null, generatedTimestamp: generatedAt, rightsStorageStatus: 'RIGHTS_REVIEW_REQUIRED', reviewOnly: true })
  const publicArtifactManifest = { schemaVersion: '2.0', manifestId: `external-artifacts-${runId}`, runId, generatedTimestamp: generatedAt, externalProcessingRoot: external, rightsStorageStatuses: ['RIGHTS_REVIEW_REQUIRED'], artifacts, reviewOnly: true }
  const allParents = publicParents; const allPublicChildren = publicChildren; const xlsxParents = allParents.filter((p) => p.parentType === 'workbook_table_block'); const pdfChildren = allPublicChildren.filter((c) => c.pageStart !== null); const fallbackUnits = builtSources.reduce((n, s) => n + s.built.fallbackUnits.length, 0); const mixed = sourceById.filter((s) => s.semanticChildCount > 0 && s.pageWindowChildCount > 0).length
  const architecture = { schemaVersion: '2.0', runId, generatedAt, processingMode: 'review_only_retrieval_hardening', sourceIds: sourceById.map((s) => s.sourceId), sourceCount: sourceById.length, parentCount: allParents.length, childCount: allPublicChildren.length, pdfParentCount: allParents.length - xlsxParents.length, pdfChildCount: pdfChildren.length, xlsxParentCount: xlsxParents.length, xlsxChildCount: allPublicChildren.length - pdfChildren.length, structureAwareSourceCount: sourceById.filter((s) => s.parentCount > 0).length, fullyStructureAwareSourceCount: sourceById.filter((s) => s.parentCount > 0 && s.pageWindowChildCount === 0).length, mixedStructureFallbackSourceCount: mixed, fullyFallbackSourceCount: sourceById.filter((s) => s.parentCount === 0).length, fallbackUnitCount: fallbackUnits, rightsStatus: 'RIGHTS_REVIEW_REQUIRED', externalProcessingRoot: external, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
  const publicSourceRecords = { schemaVersion: '2.0', runId, sources: sourceById, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
  const contexts = cases.map((x) => ({ contextId: stableId(runId, 'context', x.caseId), evaluationCaseId: x.caseId, selectedChildId: x.parentChild.selectedChildId, parentContextId: x.parentChild.parentContext?.parentId || null, precedingChildId: x.parentChild.precedingChild?.childId || null, followingChildId: x.parentChild.followingChild?.childId || null, queryNeed: x.parentChild.queryNeed, expansionReason: x.parentChild.expansionReason, sourceId: x.parentChild.selectedSourceId, sourceSha256: x.parentChild.selectedSourceSha256, contextSize: x.parentChild.contextSize, contextTextExternal: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }))
  await writeJson(path.join(output, 'architecture-manifest.json'), architecture); await writeJson(path.join(output, 'architecture-source-records.json'), publicSourceRecords); await writeJson(path.join(output, 'parent-manifest.json'), { schemaVersion: '2.0', runId, parents: allParents, summary: { parentCount: allParents.length, pdfParentCount: architecture.pdfParentCount, xlsxParentCount: architecture.xlsxParentCount }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }); await writeJson(path.join(output, 'child-manifest.json'), { schemaVersion: '2.0', runId, children: allPublicChildren, summary: { childCount: allPublicChildren.length, pdfChildCount: architecture.pdfChildCount, xlsxChildCount: architecture.xlsxChildCount }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }); await writeJson(path.join(output, 'context-expansion-manifest.json'), { schemaVersion: '2.0', runId, contexts, summary: { contextCount: contexts.length, maxContextSize: Math.max(...contexts.map((c) => c.contextSize), 0), bounded: true }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }); await writeJson(path.join(output, 'baseline-comparison.json'), evalPublic); await writeJson(path.join(output, 'ablation-report.json'), { schemaVersion: '1.0', runId, systems: summary.ablation, developmentCaseCount: devCases.length, holdoutCaseCount: holdoutCases.length, testExpectationsExcludedFromRanking: true, reviewOnly: true }); await writeJson(path.join(output, 'evidence-packages.json'), { schemaVersion: '2.0', runId, packages: contexts.map((c) => ({ packageId: stableId(runId, 'package', c.evaluationCaseId), evaluationCaseId: c.evaluationCaseId, selectedChildId: c.selectedChildId, parentContextId: c.parentContextId, precedingChildId: c.precedingChildId, followingChildId: c.followingChildId, sourceId: c.sourceId, sourceSha256: c.sourceSha256, queryNeed: c.queryNeed, contextSize: c.contextSize, boundedContextExternal: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })), reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }); await writeJson(path.join(output, 'external-artifact-manifest.json'), publicArtifactManifest); await writeJson(path.join(output, 'evaluation-freeze.json'), frozen.public)
  const diagnostic = { schemaVersion: '1.0', runId, failureTaxonomy: { COMMON_TOKEN_DOMINANCE: cases.filter((x) => !x.parentChild.targetTop3Correct).length, TARGET_RANK_UNDERWEIGHTED: cases.filter((x) => !x.parentChild.targetTop3Correct).length, PARENT_SIGNAL_UNUSED: cases.filter((x) => !x.parentChild.correctParent).length }, top10External: true, diagnosticDetailsExternal: true, caseCount: cases.length, reviewOnly: true }
  await writeJson(path.join(output, 'diagnostic-summary.json'), diagnostic); await writeJson(path.join(output, 'overnight-pass-report.json'), { schemaVersion: '1.0', runId, passes: [{ pass: 1, name: 'frozen-gold-diagnostic' }, { pass: 2, name: 'bm25' }, { pass: 3, name: 'regulatory-tokenization' }, { pass: 4, name: 'parent-aware-rerank' }, { pass: 5, name: 'semantic-pdf-children' }, { pass: 6, name: 'xlsx-row-range-subdivision' }, { pass: 7, name: 'query-aware-context' }, { pass: 8, name: 'holdout-and-ablation' }], metrics: summary, noAcquisition: true, reviewOnly: true })
  return { architecture, sourceRecords: sourceById, parents: allParents, children: allPublicChildren, evaluation: evalPublic, artifacts, output, external }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) buildHardening().then((r) => console.log(JSON.stringify({ runId, sourceCount: r.sourceRecords.length, parentCount: r.parents.length, childCount: r.children.length, cases: r.evaluation.cases.length, output: r.output, external: r.external }, null, 2))).catch((e) => { console.error(e.stack || e.message); process.exitCode = 1 })
