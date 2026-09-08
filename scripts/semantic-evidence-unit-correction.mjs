import fs from 'node:fs/promises'
import path from 'node:path'
import {
  average,
  classifyEvidenceRole,
  colName,
  detectMajorPdfMarker,
  detectPdfSubsection,
  expandRoleAwareContext,
  firstAcceptedRank,
  makeFieldedBm25Index,
  rankBm25,
  reciprocalRank,
  regulatoryTokens,
  sha256,
  splitPdfSemanticUnits,
  stableId,
  subdivideWorkbookBlock
} from './lib/semantic-evidence-units.mjs'

export const runId = 'semantic-evidence-unit-correction-2026-09'
export const repoRoot = path.resolve(import.meta.dirname, '..')
export const publicRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', runId)
export const externalRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', runId)
const contextRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', 'parent-child-context-architecture-2026-09')
const hardeningRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', 'parent-child-retrieval-hardening-2026-09')
const generatedAt = '2026-09-08T00:00:00.000Z'
const sources = [
  ['naic-accounting-publications-appm-2026', 'A3'],
  ['naic-life-fraternal-reporting-asb-life-2025', 'W07'],
  ['naic-life-fraternal-reporting-qsi-life-2026', 'W08'],
  ['naic-pbr-vm-20-vm-31-vm-51-vm20-tables-2026-f-g', 'XLSX-FG'],
  ['naic-pbr-vm-20-vm-31-vm-51-vm31-templates-reports', 'XLSX-VM31'],
  ['society-of-actuaries-experience-studies-soa-2015-vbt-improvement', 'XLSX-SOA']
]
const bm25Config = { k1: 1.2, b: 0.75, fieldWeights: { body: 1, section: 2.5, identifier: 4, parentHeading: 1.5, sourceTitle: 0.35, header: 1.5 } }
const fields = Object.keys(bm25Config.fieldWeights)
const readJson = async (file) => JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, ''))
const writeJson = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8') }
const isPdfSource = (old) => old.baselineChunks.some((chunk) => chunk.pageStart !== null && chunk.pageStart !== undefined)
const sourceOrder = (left, right) => (left.worksheetOrder ?? 0) - (right.worksheetOrder ?? 0) || (left.pageStart ?? 0) - (right.pageStart ?? 0) || (left.rowStart ?? 0) - (right.rowStart ?? 0) || (left.childOrdinal ?? 0) - (right.childOrdinal ?? 0) || String(left.childId).localeCompare(String(right.childId))

const sourceMetadata = (context, hardening, sourceId, provingGround) => ({
  sourceId,
  provingGround,
  sourceSha256: context.sourceSha256,
  sourceFamilyId: context.children[0]?.sourceFamilyId || hardening.children[0]?.sourceFamilyId || null,
  documentType: context.children[0]?.documentType || hardening.children[0]?.documentType || null,
  authoritySupportRole: context.children[0]?.authoritySupportRole || hardening.children[0]?.authoritySupportRole || null,
  rightsStatus: context.rightsStatus,
  sourceTitle: context.baselineChunks[0]?.sourceTitle || provingGround
})

const makeDocumentRoot = (source, documentType) => ({
  parentId: stableId(source.sourceId, 'document-root'), parentParentId: null, sourceId: source.sourceId, sourceSha256: source.sourceSha256,
  sourceFamilyId: source.sourceFamilyId, documentType, authoritySupportRole: source.authoritySupportRole, hierarchyLevel: 0,
  parentType: documentType === 'pdf' ? 'document' : 'workbook', structuralIdentifier: source.sourceId, structuralLabel: source.provingGround,
  pageStart: null, pageEnd: null, childParentIds: [], childIds: [], confidence: 'high', detectionMethod: 'source_identity_root', rightsStatus: source.rightsStatus,
  reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false
})

const buildPdfSource = (source, old) => {
  const root = makeDocumentRoot(source, 'pdf'); const parents = [root]; const children = []; const parentContexts = []
  let activeMajor = root; let activeMarkerKey = null; let activePageEnd = null
  const baseline = [...old.baselineChunks].sort((a, b) => (a.pageStart ?? 0) - (b.pageStart ?? 0) || String(a.chunkId).localeCompare(String(b.chunkId)))
  for (let chunkOrdinal = 0; chunkOrdinal < baseline.length; chunkOrdinal += 1) {
    const chunk = baseline[chunkOrdinal]; const marker = detectMajorPdfMarker(chunk.sourceTextExcerpt || '')
    const markerKey = marker ? `${marker.parentType}|${marker.structuralIdentifier}` : null
    if (marker && (markerKey !== activeMarkerKey || activePageEnd === null || (chunk.pageStart ?? 0) > activePageEnd + 2)) {
      activeMajor = { parentId: stableId(source.sourceId, 'major-parent', markerKey, chunk.pageStart), parentParentId: root.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: source.authoritySupportRole, hierarchyLevel: 1, ...marker, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, childParentIds: [], childIds: [], confidence: marker.confidence, detectionMethod: marker.detectionMethod, rightsStatus: source.rightsStatus, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
      parents.push(activeMajor); root.childParentIds.push(activeMajor.parentId); activeMarkerKey = markerKey
    } else if (!marker && activeMajor !== root && activePageEnd !== null && (chunk.pageStart ?? 0) > activePageEnd + 2) { activeMajor = root; activeMarkerKey = null }
    activePageEnd = Math.max(activePageEnd ?? 0, chunk.pageEnd ?? chunk.pageStart ?? 0)
    if (activeMajor !== root) activeMajor.pageEnd = Math.max(activeMajor.pageEnd ?? 0, chunk.pageEnd ?? chunk.pageStart ?? 0)
    const subsection = detectPdfSubsection(chunk.sourceTextExcerpt || '', activeMajor.structuralIdentifier)
    let childParent = activeMajor
    if (subsection) {
      childParent = { parentId: stableId(source.sourceId, 'subsection-parent', activeMajor.parentId, chunk.chunkId, subsection.structuralIdentifier), parentParentId: activeMajor.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: source.authoritySupportRole, hierarchyLevel: activeMajor === root ? 1 : 2, ...subsection, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, childParentIds: [], childIds: [], confidence: subsection.confidence, detectionMethod: subsection.detectionMethod, rightsStatus: source.rightsStatus, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
      parents.push(childParent); activeMajor.childParentIds.push(childParent.parentId)
    }
    const units = splitPdfSemanticUnits(chunk.sourceTextExcerpt || '')
    for (let unitOrdinal = 0; unitOrdinal < units.length; unitOrdinal += 1) {
      const unit = units[unitOrdinal]; const childId = stableId(source.sourceId, 'pdf-child', childParent.parentId, chunk.chunkId, unitOrdinal, sha256(unit.text))
      const child = { childId, parentId: childParent.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: source.authoritySupportRole, structuralType: unit.representation, processingRepresentation: unit.representation, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, sectionReference: childParent.structuralIdentifier || chunk.sectionReference || null, sourceChunkIds: [chunk.chunkId], sourceChunkOrdinal: chunkOrdinal, childOrdinal: unitOrdinal, paragraphCount: unit.paragraphCount, semanticRole: unit.role.role, roleConfidence: unit.role.confidence, roleDetectionMethod: unit.role.detectionMethod, reviewFlags: [], confidence: unit.confidence, detectionMethod: unit.detectionMethod, rightsStatus: source.rightsStatus, contentHash: sha256(unit.text), searchText: unit.text, sourceTextExcerpt: unit.text, citation: { pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, sourceChunkId: chunk.chunkId }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
      children.push(child); childParent.childIds.push(childId)
    }
  }
  const sourcePages = baseline.flatMap((chunk) => [chunk.pageStart, chunk.pageEnd]).filter((value) => value !== null && value !== undefined)
  root.pageStart = sourcePages.length ? Math.min(...sourcePages) : null; root.pageEnd = sourcePages.length ? Math.max(...sourcePages) : null
  for (const parent of parents) {
    const direct = children.filter((child) => child.parentId === parent.parentId); parent.childIds = direct.sort(sourceOrder).map((child) => child.childId)
    const opening = direct.find((child) => child.semanticRole === 'SCOPE_OR_APPLICABILITY') || direct[0]
    if (opening) { parent.parentContextId = stableId(source.sourceId, 'parent-context', parent.parentId, opening.contentHash); parent.parentContextRole = opening.semanticRole === 'SCOPE_OR_APPLICABILITY' ? 'SCOPE_OR_APPLICABILITY' : 'OTHER'; parentContexts.push({ parentContextId: parent.parentContextId, parentId: parent.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, heading: parent.structuralLabel, structuralIdentifier: parent.structuralIdentifier, openingEvidenceId: opening.childId, role: parent.parentContextRole, contextText: opening.sourceTextExcerpt.slice(0, 800), contentHash: sha256(opening.sourceTextExcerpt.slice(0, 800)), bounded: true, rightsStatus: source.rightsStatus }) }
  }
  return { parents, children: children.sort(sourceOrder), headerContexts: [], parentContexts, baselineChunks: old.baselineChunks }
}

const buildXlsxSource = (source, old) => {
  const root = makeDocumentRoot(source, 'xlsx'); const parents = [root]; const children = []; const headerContexts = []; const parentContexts = []
  const childByChunk = new Map(old.children.map((child) => [child.sourceChunkId, child])); const sheetParents = new Map()
  for (let chunkOrdinal = 0; chunkOrdinal < old.baselineChunks.length; chunkOrdinal += 1) {
    const chunk = old.baselineChunks[chunkOrdinal]; const metadata = childByChunk.get(chunk.chunkId) || {}; const table = chunk.extensions?.tableBlock || {}; const inventory = chunk.extensions?.contentInventory || {}
    const worksheetPath = metadata.worksheetPath || chunk.extensions?.worksheet || null; const sheetName = metadata.sheetName || chunk.sectionReference || worksheetPath; const worksheetOrder = metadata.worksheetOrder ?? 0
    if (!sheetParents.has(worksheetPath)) {
      const sheetParent = { parentId: stableId(source.sourceId, 'sheet-parent', worksheetPath), parentParentId: root.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: source.authoritySupportRole, hierarchyLevel: 1, parentType: 'worksheet', structuralIdentifier: worksheetPath, structuralLabel: sheetName, sheetName, worksheetPath, worksheetOrder, sheetState: chunk.extensions?.sheetState || 'visible', childParentIds: [], childIds: [], reviewFlags: [], confidence: 'high', detectionMethod: 'native_worksheet_identity', rightsStatus: source.rightsStatus, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
      sheetParents.set(worksheetPath, sheetParent); parents.push(sheetParent); root.childParentIds.push(sheetParent.parentId)
    }
    const exception = chunk.extensions?.exceptionCode || inventory.exceptionCode || null; const reviewFlags = [...new Set([...(metadata.reviewFlags || []), ...(exception ? [exception] : [])])]
    const built = subdivideWorkbookBlock({ sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: source.authoritySupportRole, rightsStatus: source.rightsStatus, oldParentId: metadata.parentId, sourceChunkId: chunk.chunkId, sourceChunkOrdinal: chunkOrdinal, sheetName, worksheetPath, worksheetOrder, sheetState: chunk.extensions?.sheetState || 'visible', mergedRanges: chunk.extensions?.mergedRanges || [], reviewFlags, text: chunk.sourceTextExcerpt || '', blockOrdinal: table.blockOrdinal ?? chunkOrdinal + 1 })
    if (table.cellRefs?.length && built.parsedCellCount !== table.cellRefs.length) throw new Error(`Workbook cell parse mismatch: ${source.sourceId}/${chunk.chunkId}: ${built.parsedCellCount}/${table.cellRefs.length}`)
    const sheetParent = sheetParents.get(worksheetPath)
    for (const parent of built.parents) { parent.parentParentId = sheetParent.parentId; parent.hierarchyLevel = 2; parents.push(parent); sheetParent.childParentIds.push(parent.parentId) }
    for (const header of built.headerContexts) {
      headerContexts.push(header)
      const coveredByChild = built.children.some((child) => child.rowStart <= header.rowStart && child.rowEnd >= header.rowEnd && child.colStart === header.colStart && child.colEnd === header.colEnd)
      if (!coveredByChild) {
        const headerChild = { childId: header.headerContextId, parentId: header.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, sourceFamilyId: source.sourceFamilyId, documentType: source.documentType, authoritySupportRole: source.authoritySupportRole, structuralType: 'XLSX_HEADER_CONTEXT_CHILD', processingRepresentation: 'XLSX_HEADER_CONTEXT_CHILD', sheetName, worksheetPath, worksheetOrder, rowStart: header.rowStart, rowEnd: header.rowEnd, colStart: header.colStart, colEnd: header.colEnd, cellRefs: header.cellRefs, mergedRangeIntersections: [], nonEmptyCellCount: header.cellRefs.length, formulaCellCount: 0, valueCellCount: header.cellRefs.length, headerContextId: header.headerContextId, sourceChunkIds: [chunk.chunkId], sourceChunkOrdinal: chunkOrdinal, childOrdinal: -1, semanticRole: 'HEADER_CONTEXT', roleConfidence: 'high', roleDetectionMethod: 'bounded_header_range', reviewFlags, confidence: 'high', detectionMethod: 'bounded_header_range', rightsStatus: source.rightsStatus, contentHash: header.contentHash, searchText: header.text, sourceTextExcerpt: header.text, headerText: header.text, citation: { worksheetPath, sheetName, rowStart: header.rowStart, rowEnd: header.rowEnd, colStart: header.colStart, colEnd: header.colEnd }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
        built.children.push(headerChild); built.parents.find((parent) => parent.parentId === header.parentId).childIds.unshift(headerChild.childId)
      }
    }
    children.push(...built.children)
  }
  for (const parent of parents) {
    parent.childIds = children.filter((child) => child.parentId === parent.parentId).sort(sourceOrder).map((child) => child.childId)
    if (parent.headerContextId) { const header = headerContexts.find((item) => item.headerContextId === parent.headerContextId); if (header) { parent.parentContextId = header.headerContextId; parent.parentContextRole = 'HEADER_CONTEXT'; parentContexts.push({ parentContextId: header.headerContextId, parentId: parent.parentId, sourceId: source.sourceId, sourceSha256: source.sourceSha256, heading: parent.structuralLabel, structuralIdentifier: parent.structuralIdentifier, openingEvidenceId: header.headerContextId, role: 'HEADER_CONTEXT', contextText: header.text, contentHash: header.contentHash, bounded: true, rightsStatus: source.rightsStatus }) } }
  }
  return { parents, children: children.sort(sourceOrder), headerContexts, parentContexts, baselineChunks: old.baselineChunks }
}

const publicParent = (parent, externalPath) => ({ parentId: parent.parentId, parentParentId: parent.parentParentId, childParentIds: parent.childParentIds || [], sourceId: parent.sourceId, sourceSha256: parent.sourceSha256, sourceFamilyId: parent.sourceFamilyId, documentType: parent.documentType, authoritySupportRole: parent.authoritySupportRole, hierarchyLevel: parent.hierarchyLevel, parentType: parent.parentType, structuralIdentifier: parent.structuralIdentifier, structuralLabel: parent.structuralLabel, pageStart: parent.pageStart ?? null, pageEnd: parent.pageEnd ?? null, sheetName: parent.sheetName || null, worksheetPath: parent.worksheetPath || null, worksheetOrder: parent.worksheetOrder ?? null, sheetState: parent.sheetState || null, rowStart: parent.rowStart ?? null, rowEnd: parent.rowEnd ?? null, colStart: parent.colStart || null, colEnd: parent.colEnd || null, cellRefs: parent.cellRefs || [], childIds: parent.childIds || [], headerContextId: parent.headerContextId || null, parentContextId: parent.parentContextId || null, parentContextRole: parent.parentContextRole || null, reviewFlags: parent.reviewFlags || [], confidence: parent.confidence, detectionMethod: parent.detectionMethod, rightsStatus: parent.rightsStatus, externalArtifactPath: externalPath, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
const publicChild = (child, externalPath) => ({ childId: child.childId, parentId: child.parentId, sourceId: child.sourceId, sourceSha256: child.sourceSha256, sourceFamilyId: child.sourceFamilyId, documentType: child.documentType, authoritySupportRole: child.authoritySupportRole, structuralType: child.structuralType, processingRepresentation: child.processingRepresentation, pageStart: child.pageStart ?? null, pageEnd: child.pageEnd ?? null, sheetName: child.sheetName || null, worksheetPath: child.worksheetPath || null, worksheetOrder: child.worksheetOrder ?? null, sheetState: child.sheetState || null, rowStart: child.rowStart ?? null, rowEnd: child.rowEnd ?? null, colStart: child.colStart || null, colEnd: child.colEnd || null, cellRefs: child.cellRefs || [], mergedRangeIntersections: child.mergedRangeIntersections || [], nonEmptyCellCount: child.nonEmptyCellCount ?? null, formulaCellCount: child.formulaCellCount ?? null, valueCellCount: child.valueCellCount ?? null, headerContextId: child.headerContextId || null, sectionReference: child.sectionReference || null, sourceChunkIds: child.sourceChunkIds || [], sourceChunkOrdinal: child.sourceChunkOrdinal, childOrdinal: child.childOrdinal, paragraphCount: child.paragraphCount ?? null, semanticRole: child.semanticRole, roleConfidence: child.roleConfidence, roleDetectionMethod: child.roleDetectionMethod, reviewFlags: child.reviewFlags || [], confidence: child.confidence, detectionMethod: child.detectionMethod, rightsStatus: child.rightsStatus, contentHash: child.contentHash, sourceTextExternal: true, externalArtifactPath: externalPath, citation: child.citation, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })

const retrievalDoc = (child, parent, source) => ({ ...child, body: child.searchText || child.sourceTextExcerpt || '', section: child.sectionReference || '', identifier: parent?.structuralIdentifier || '', parentHeading: parent?.structuralLabel || '', sourceTitle: source?.sourceTitle || source?.provingGround || '', header: child.headerText || child.sheetName || '' })
const parentDoc = (parent, context, source) => ({ ...parent, body: context?.contextText || '', section: parent.structuralIdentifier || '', identifier: parent.structuralIdentifier || '', parentHeading: parent.structuralLabel || '', sourceTitle: source?.sourceTitle || source?.provingGround || '', header: parent.sheetName || '' })
const colIndex = (name) => { if (!name) return null; let result = 0; for (const char of name) result = result * 26 + char.charCodeAt(0) - 64; return result }
const overlaps = (leftStart, leftEnd, rightStart, rightEnd) => leftStart === null || leftStart === undefined || rightStart === null || rightStart === undefined || leftStart <= rightEnd && leftEnd >= rightStart
const resolveTargets = (goldCase, children) => {
  const resolved = []
  for (const evidence of goldCase.chosenGoldEvidence) {
    let candidates = children.filter((child) => child.sourceId === goldCase.sourceId && (child.sourceChunkIds || []).includes(evidence.sourceChunkId))
    if (evidence.worksheetPath) candidates = candidates.filter((child) => child.worksheetPath === evidence.worksheetPath && overlaps(child.rowStart, child.rowEnd, evidence.rowStart, evidence.rowEnd) && overlaps(colIndex(child.colStart), colIndex(child.colEnd), colIndex(evidence.colStart), colIndex(evidence.colEnd)))
    if (evidence.targetRole) { const roleMatches = candidates.filter((child) => child.semanticRole === evidence.targetRole); if (roleMatches.length) candidates = roleMatches }
    resolved.push({ goldUnitId: evidence.goldUnitId, childIds: candidates.map((child) => child.childId) })
  }
  return [...new Set(resolved.flatMap((item) => item.childIds))]
}
const resolveLegacyTargets = (goldCase, docs) => [...new Set(goldCase.chosenGoldEvidence.flatMap((evidence) => docs.filter((doc) => doc.sourceId === goldCase.sourceId && (doc.sourceChunkId === evidence.sourceChunkId || doc.chunkId === evidence.sourceChunkId)).map((doc) => doc.childId || doc.chunkId)))]
const coordinateValid = (child) => Boolean(child && ((child.pageStart !== null && child.pageStart !== undefined) || (child.worksheetPath && child.rowStart !== null && child.rowStart !== undefined)))

const evaluateSystem = ({ systemId, cases, docs, rank, acceptedFor, parentAware = false, contextAware = false, parentById, childrenByParent, headerById }) => cases.map((goldCase) => {
  const ranked = rank(goldCase.query); const acceptedTargetIds = acceptedFor(goldCase); const targetRank = firstAcceptedRank(ranked, acceptedTargetIds); const selected = ranked[0]?.doc || null
  const acceptedParentIds = [...new Set(docs.filter((doc) => acceptedTargetIds.includes(doc.childId || doc.chunkId)).map((doc) => doc.parentId).filter(Boolean))]
  const context = contextAware ? expandRoleAwareContext({ query: goldCase.query, selected, childrenByParent, parentById, headerById }) : { queryIntent: 'NONE', contextEvidenceIds: selected ? [selected.childId || selected.chunkId] : [], contextRecords: selected ? [{ evidenceId: selected.childId || selected.chunkId, role: selected.semanticRole || 'OTHER' }] : [], bounded: true }
  const selectedAccepted = Boolean(selected && acceptedTargetIds.includes(selected.childId || selected.chunkId)); const capturedRoles = new Set(context.contextRecords.map((record) => record.role)); const requiredRoles = goldCase.requiredSupportingEvidence.map((item) => item.role)
  const requiredRoleHits = requiredRoles.filter((role) => capturedRoles.has(role)).length; const requiredRoleRecall = requiredRoles.length ? requiredRoleHits / requiredRoles.length : 1
  const complete = selectedAccepted && requiredRoleRecall === 1; const requiredEvidenceCount = 1 + requiredRoles.length; const contextPrecision = context.contextEvidenceIds.length ? (Number(selectedAccepted) + requiredRoleHits) / context.contextEvidenceIds.length : 0
  return { caseId: goldCase.caseId, split: goldCase.split, category: goldCase.category, systemId, expectedSourceId: goldCase.sourceId, expectedRole: goldCase.authoritySupportRole, acceptedTargetIds, acceptedParentIds, selectedChildId: selected?.childId || selected?.chunkId || null, selectedParentId: selected?.parentId || null, selectedSourceId: selected?.sourceId || null, selectedRole: selected?.authoritySupportRole || null, selectedRankScore: ranked[0]?.finalScore || 0, targetRank, sourceTop1: selected?.sourceId === goldCase.sourceId, sourceTop3: ranked.slice(0, 3).some((item) => item.doc.sourceId === goldCase.sourceId), sourceTop5: ranked.slice(0, 5).some((item) => item.doc.sourceId === goldCase.sourceId), acceptedTop1: targetRank === 1, acceptedTop3: Boolean(targetRank && targetRank <= 3), acceptedTop5: Boolean(targetRank && targetRank <= 5), acceptedTop10: Boolean(targetRank && targetRank <= 10), acceptedMrr: reciprocalRank(targetRank), exactChildEligible: acceptedTargetIds.length === 1, exactChildTop1: acceptedTargetIds.length === 1 && targetRank === 1, exactParent: parentAware ? Boolean(selected?.parentId && acceptedParentIds.includes(selected.parentId)) : null, wrongSource: Boolean(selected && selected.sourceId !== goldCase.sourceId), wrongSection: Boolean(selected && selected.sourceId === goldCase.sourceId && acceptedParentIds.length && !acceptedParentIds.includes(selected.parentId)), authoritySupportCorrectness: selected?.authoritySupportRole === goldCase.authoritySupportRole, citationCoordinateValidity: coordinateValid(selected), targetCitationCorrectness: selectedAccepted && coordinateValid(selected), requiredRoles, requiredRoleRecall, acceptedEvidenceRecall: complete ? 1 : selectedAccepted ? 1 / requiredEvidenceCount : 0, contextPrecision, completeContext: complete, irrelevantContextCount: Math.max(0, context.contextEvidenceIds.length - Number(selectedAccepted) - requiredRoleHits), contextEvidenceIds: context.contextEvidenceIds, queryIntent: context.queryIntent, contextBounded: context.bounded }
})

const summarize = (results) => ({
  caseCount: results.length,
  sourceTop1: average(results.map((item) => Number(item.sourceTop1))), sourceTop3: average(results.map((item) => Number(item.sourceTop3))), sourceTop5: average(results.map((item) => Number(item.sourceTop5))),
  acceptedTargetTop1: average(results.map((item) => Number(item.acceptedTop1))), acceptedTargetTop3: average(results.map((item) => Number(item.acceptedTop3))), acceptedTargetTop5: average(results.map((item) => Number(item.acceptedTop5))), acceptedTargetTop10: average(results.map((item) => Number(item.acceptedTop10))), acceptedTargetMrr: average(results.map((item) => item.acceptedMrr)),
  exactChildTop1: average(results.filter((item) => item.exactChildEligible).map((item) => Number(item.exactChildTop1))), exactParentRate: average(results.filter((item) => item.exactParent !== null).map((item) => Number(item.exactParent))), wrongSourceRate: average(results.map((item) => Number(item.wrongSource))), wrongSectionRate: average(results.map((item) => Number(item.wrongSection))), authoritySupportCorrectness: average(results.map((item) => Number(item.authoritySupportCorrectness))), citationCoordinateValidity: average(results.map((item) => Number(item.citationCoordinateValidity))), targetCitationCorrectness: average(results.map((item) => Number(item.targetCitationCorrectness))), requiredRoleRecall: average(results.map((item) => item.requiredRoleRecall)), acceptedEvidenceRecall: average(results.map((item) => item.acceptedEvidenceRecall)), contextPrecision: average(results.map((item) => item.contextPrecision)), completeContextRate: average(results.map((item) => Number(item.completeContext))), irrelevantContextCount: results.reduce((sum, item) => sum + item.irrelevantContextCount, 0)
})

const publicEvaluationCase = (item) => ({ caseId: item.caseId, split: item.split, category: item.category, systemId: item.systemId, expectedSourceId: item.expectedSourceId, expectedRole: item.expectedRole, acceptedTargetIds: item.acceptedTargetIds, acceptedParentIds: item.acceptedParentIds, selectedChildId: item.selectedChildId, selectedParentId: item.selectedParentId, selectedSourceId: item.selectedSourceId, selectedRole: item.selectedRole, targetRank: item.targetRank, sourceTop1: item.sourceTop1, sourceTop3: item.sourceTop3, sourceTop5: item.sourceTop5, acceptedTop1: item.acceptedTop1, acceptedTop3: item.acceptedTop3, acceptedTop5: item.acceptedTop5, acceptedTop10: item.acceptedTop10, acceptedMrr: item.acceptedMrr, exactChildEligible: item.exactChildEligible, exactChildTop1: item.exactChildTop1, exactParent: item.exactParent, wrongSource: item.wrongSource, wrongSection: item.wrongSection, authoritySupportCorrectness: item.authoritySupportCorrectness, citationCoordinateValidity: item.citationCoordinateValidity, targetCitationCorrectness: item.targetCitationCorrectness, requiredRoles: item.requiredRoles, requiredRoleRecall: item.requiredRoleRecall, acceptedEvidenceRecall: item.acceptedEvidenceRecall, contextPrecision: item.contextPrecision, completeContext: item.completeContext, irrelevantContextCount: item.irrelevantContextCount, contextEvidenceIds: item.contextEvidenceIds, queryIntent: item.queryIntent, contextBounded: item.contextBounded, queryExternal: true })

export const buildSemanticEvidenceCorrection = async ({ output = publicRoot, external = externalRoot } = {}) => {
  const goldPrivate = await readJson(path.join(externalRoot, 'gold-v2-adjudication.json')); const activeGold = goldPrivate.adjudications.filter((item) => item.included)
  const builtSources = []; const externalArtifacts = []
  for (const [sourceId, provingGround] of sources) {
    const context = await readJson(path.join(contextRoot, sourceId, 'parent-child-substantive.json')); const hardening = await readJson(path.join(hardeningRoot, sourceId, 'parent-child-retrieval-substantive.json')); const source = sourceMetadata(context, hardening, sourceId, provingGround)
    const built = isPdfSource(context) ? buildPdfSource(source, context) : buildXlsxSource(source, context)
    const privateValue = { schemaVersion: '3.0', runId, source, parents: built.parents, children: built.children, headerContexts: built.headerContexts, parentContexts: built.parentContexts, baselineChunks: built.baselineChunks, rightsStatus: source.rightsStatus, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
    const externalPath = path.join(external, sourceId, 'semantic-evidence-substantive.json'); await writeJson(externalPath, privateValue); const bytes = await fs.readFile(externalPath)
    externalArtifacts.push({ runId, sourceId, artifactType: 'semantic-evidence-substantive', externalPath, sha256: sha256(bytes), byteCount: bytes.length, sourceRawSha256: source.sourceSha256, generatedTimestamp: generatedAt, rightsStorageStatus: source.rightsStatus, reviewOnly: true })
    builtSources.push({ source, built, hardening, externalPath })
  }
  const allParents = builtSources.flatMap((item) => item.built.parents); const allChildren = builtSources.flatMap((item) => item.built.children); const allHeaders = builtSources.flatMap((item) => item.built.headerContexts); const allContexts = builtSources.flatMap((item) => item.built.parentContexts)
  const parentById = new Map(allParents.map((parent) => [parent.parentId, parent])); const headerById = new Map(allHeaders.map((header) => [header.headerContextId, header])); const sourceById = new Map(builtSources.map((item) => [item.source.sourceId, item.source])); const contextByParent = new Map(allContexts.map((context) => [context.parentId, context])); const childrenByParent = new Map()
  for (const child of allChildren) { if (!childrenByParent.has(child.parentId)) childrenByParent.set(child.parentId, []); childrenByParent.get(child.parentId).push(child) }
  for (const values of childrenByParent.values()) values.sort(sourceOrder)
  const newDocs = allChildren.map((child) => retrievalDoc(child, parentById.get(child.parentId), sourceById.get(child.sourceId)))
  const newIndex = makeFieldedBm25Index(newDocs, fields, bm25Config); const parentDocs = allParents.map((parent) => parentDoc(parent, contextByParent.get(parent.parentId), sourceById.get(parent.sourceId))); const parentIndex = makeFieldedBm25Index(parentDocs, fields, bm25Config)
  const baselineDocs = builtSources.flatMap((item) => item.built.baselineChunks.map((chunk) => ({ ...chunk, childId: chunk.chunkId, parentId: null, authoritySupportRole: item.source.authoritySupportRole, body: chunk.normalizedSearchText || chunk.sourceTextExcerpt || '', section: chunk.sectionReference || '', identifier: '', parentHeading: '', sourceTitle: item.source.sourceTitle, header: chunk.extensions?.worksheet || '' })))
  const baselineIndex = makeFieldedBm25Index(baselineDocs, fields, bm25Config)
  const oldDocs = builtSources.flatMap((item) => item.hardening.children.map((child) => ({ ...child, body: child.searchText || child.sourceTextExcerpt || '', section: child.sectionReference || '', identifier: parentById.get(child.parentId)?.structuralIdentifier || '', parentHeading: parentById.get(child.parentId)?.structuralLabel || '', sourceTitle: item.source.sourceTitle, header: child.sheetName || '' })))
  const oldIndex = makeFieldedBm25Index(oldDocs, fields, bm25Config)
  const rankBaseline = (query) => rankBm25(query, baselineDocs, baselineIndex)
  const rankOld = (query) => rankBm25(query, oldDocs, oldIndex)
  const rankNew = (query) => rankBm25(query, newDocs, newIndex)
  const rankParent = (query) => rankBm25(query, newDocs, newIndex, { parentIndex, parentById, parentWeight: 0.55, phraseWeight: 1.4 })
  const systems = {
    A_OLD_PAGE_WINDOW_BM25: evaluateSystem({ systemId: 'A_OLD_PAGE_WINDOW_BM25', cases: activeGold, docs: baselineDocs, rank: rankBaseline, acceptedFor: (item) => resolveLegacyTargets(item, baselineDocs), parentById: new Map(), childrenByParent: new Map(), headerById }),
    B_OLD_SEMANTIC_44D96FF_BM25: evaluateSystem({ systemId: 'B_OLD_SEMANTIC_44D96FF_BM25', cases: activeGold, docs: oldDocs, rank: rankOld, acceptedFor: (item) => resolveLegacyTargets(item, oldDocs), parentById: new Map(), childrenByParent: new Map(), headerById }),
    C_CORRECTED_SEMANTIC_BM25: evaluateSystem({ systemId: 'C_CORRECTED_SEMANTIC_BM25', cases: activeGold, docs: newDocs, rank: rankNew, acceptedFor: (item) => resolveTargets(item, allChildren), parentAware: true, parentById, childrenByParent, headerById }),
    D_CORRECTED_PARENT_RERANK: evaluateSystem({ systemId: 'D_CORRECTED_PARENT_RERANK', cases: activeGold, docs: newDocs, rank: rankParent, acceptedFor: (item) => resolveTargets(item, allChildren), parentAware: true, parentById, childrenByParent, headerById }),
    E_ROLE_AWARE_CONTEXT: evaluateSystem({ systemId: 'E_ROLE_AWARE_CONTEXT', cases: activeGold, docs: newDocs, rank: rankParent, acceptedFor: (item) => resolveTargets(item, allChildren), parentAware: true, contextAware: true, parentById, childrenByParent, headerById })
  }
  const metrics = {}
  for (const [systemId, results] of Object.entries(systems)) metrics[systemId] = { development: summarize(results.filter((item) => item.split === 'development')), holdout: summarize(results.filter((item) => item.split === 'holdout')), combined: summarize(results) }
  const evaluationPrivate = { schemaVersion: '2.0', runId, evaluationVersion: 'EVALUATION_V2', bm25Configuration: bm25Config, systems, metrics, adjudications: activeGold, queryTextExternal: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
  const evalPath = path.join(external, 'evaluation-v2-details.json'); await writeJson(evalPath, evaluationPrivate); const evalBytes = await fs.readFile(evalPath)
  externalArtifacts.push({ runId, sourceId: 'architecture-evaluation-v2', artifactType: 'semantic-evidence-evaluation-details', externalPath: evalPath, sha256: sha256(evalBytes), byteCount: evalBytes.length, sourceRawSha256: null, generatedTimestamp: generatedAt, rightsStorageStatus: 'RIGHTS_REVIEW_REQUIRED', reviewOnly: true })
  const goldPath = path.join(externalRoot, 'gold-v2-adjudication.json'); const goldBytes = await fs.readFile(goldPath)
  externalArtifacts.push({ runId, sourceId: 'gold-evaluation-v2', artifactType: 'gold-v2-adjudication', externalPath: goldPath, sha256: sha256(goldBytes), byteCount: goldBytes.length, sourceRawSha256: null, generatedTimestamp: generatedAt, rightsStorageStatus: 'RIGHTS_REVIEW_REQUIRED', reviewOnly: true })

  const publicParents = builtSources.flatMap((item) => item.built.parents.map((parent) => publicParent(parent, item.externalPath))); const publicChildren = builtSources.flatMap((item) => item.built.children.map((child) => publicChild(child, item.externalPath)))
  const representations = Object.fromEntries([...new Set(publicChildren.map((child) => child.structuralType))].sort().map((type) => [type, publicChildren.filter((child) => child.structuralType === type).length]))
  const xlsxSourceIds = new Set(builtSources.filter((item) => item.built.children.some((child) => child.worksheetPath)).map((item) => item.source.sourceId)); const xlsxTableParents = publicParents.filter((parent) => parent.parentType === 'workbook_table_block'); const xlsxChildCounts = xlsxTableParents.map((parent) => parent.childIds.length).sort((left, right) => left - right); const pdfTokenSizes = builtSources.flatMap((item) => item.built.children.filter((child) => child.pageStart !== null && child.pageStart !== undefined).map((child) => regulatoryTokens(child.searchText || '').length)).sort((left, right) => left - right)
  const architecture = { schemaVersion: '3.0', runId, evaluationVersion: 'EVALUATION_V2', generatedAt, sourceIds: sources.map(([sourceId]) => sourceId), sourceCount: builtSources.length, parentCount: publicParents.length, nestedParentCount: publicParents.filter((parent) => parent.parentParentId).length, parentsByHierarchyLevel: Object.fromEntries([...new Set(publicParents.map((parent) => parent.hierarchyLevel))].sort().map((level) => [level, publicParents.filter((parent) => parent.hierarchyLevel === level).length])), childCount: publicChildren.length, childRepresentations: representations, pdfParentCount: publicParents.filter((parent) => !xlsxSourceIds.has(parent.sourceId)).length, pdfChildCount: publicChildren.filter((child) => child.pageStart !== null).length, pdfChildTokenSize: { average: average(pdfTokenSizes), median: pdfTokenSizes[Math.floor(pdfTokenSizes.length / 2)] || 0, maximum: pdfTokenSizes.at(-1) || 0 }, xlsxParentCount: publicParents.filter((parent) => xlsxSourceIds.has(parent.sourceId)).length, xlsxTableParentCount: xlsxTableParents.length, xlsxChildCount: publicChildren.filter((child) => child.worksheetPath).length, xlsxSingleChildParentCount: xlsxChildCounts.filter((count) => count === 1).length, xlsxMultiChildParentCount: xlsxChildCounts.filter((count) => count > 1).length, xlsxAverageChildrenPerParent: average(xlsxChildCounts), xlsxMedianChildrenPerParent: xlsxChildCounts[Math.floor(xlsxChildCounts.length / 2)] || 0, xlsxMaximumChildrenPerParent: xlsxChildCounts.at(-1) || 0, xlsxNonEmptyCellCount: publicChildren.filter((child) => child.worksheetPath).reduce((sum, child) => sum + (child.nonEmptyCellCount || 0), 0), xlsxFormulaCellCount: publicChildren.filter((child) => child.worksheetPath).reduce((sum, child) => sum + (child.formulaCellCount || 0), 0), xlsxValueCellCount: publicChildren.filter((child) => child.worksheetPath).reduce((sum, child) => sum + (child.valueCellCount || 0), 0), headerContextCount: allHeaders.length, rightsStatus: 'RIGHTS_REVIEW_REQUIRED', reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
  const sourceRecords = builtSources.map((item) => ({ sourceId: item.source.sourceId, provingGround: item.source.provingGround, sourceSha256: item.source.sourceSha256, sourceFamilyId: item.source.sourceFamilyId, documentType: item.source.documentType, authoritySupportRole: item.source.authoritySupportRole, rightsStatus: item.source.rightsStatus, parentCount: item.built.parents.length, nestedParentCount: item.built.parents.filter((parent) => parent.parentParentId).length, childCount: item.built.children.length, semanticChildCount: item.built.children.filter((child) => child.structuralType.startsWith('SEMANTIC_')).length, structuralPageWindowChildCount: item.built.children.filter((child) => child.structuralType === 'STRUCTURAL_PARENT_PAGE_WINDOW_CHILD').length, headerContextCount: item.built.headerContexts.length, externalArtifactPath: item.externalPath, externalArtifactSha256: externalArtifacts.find((artifact) => artifact.externalPath === item.externalPath).sha256, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }))
  const publicCases = Object.fromEntries(Object.entries(systems).map(([systemId, results]) => [systemId, results.map(publicEvaluationCase)]))
  const contextResults = systems.E_ROLE_AWARE_CONTEXT.map((item) => ({ caseId: item.caseId, split: item.split, selectedChildId: item.selectedChildId, selectedParentId: item.selectedParentId, queryIntent: item.queryIntent, contextEvidenceIds: item.contextEvidenceIds, requiredRoles: item.requiredRoles, requiredRoleRecall: item.requiredRoleRecall, acceptedEvidenceRecall: item.acceptedEvidenceRecall, contextPrecision: item.contextPrecision, completeContext: item.completeContext, irrelevantContextCount: item.irrelevantContextCount, bounded: item.contextBounded, contextTextExternal: true, reviewOnly: true }))
  const manifest = { schemaVersion: '3.0', runId, generatedTimestamp: generatedAt, externalProcessingRoot: external, artifacts: externalArtifacts, reviewOnly: true }
  await writeJson(path.join(output, 'architecture-v2-manifest.json'), architecture)
  await writeJson(path.join(output, 'architecture-v2-source-records.json'), { schemaVersion: '3.0', runId, sources: sourceRecords, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(output, 'parent-v2-manifest.json'), { schemaVersion: '3.0', runId, parents: publicParents, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(output, 'child-v2-manifest.json'), { schemaVersion: '3.0', runId, children: publicChildren, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(output, 'header-context-v2-manifest.json'), { schemaVersion: '1.0', runId, headerContexts: allHeaders.map((header) => ({ headerContextId: header.headerContextId, parentId: header.parentId, sourceId: header.sourceId, sourceSha256: header.sourceSha256, sheetName: header.sheetName, worksheetPath: header.worksheetPath, worksheetOrder: header.worksheetOrder, rowStart: header.rowStart, rowEnd: header.rowEnd, colStart: header.colStart, colEnd: header.colEnd, cellRefs: header.cellRefs, contentHash: header.contentHash, role: header.role, confidence: header.confidence, detectionMethod: header.detectionMethod, rightsStatus: header.rightsStatus, textExternal: true })), reviewOnly: true })
  await writeJson(path.join(output, 'evaluation-v2-results.json'), { schemaVersion: '2.0', runId, evaluationVersion: 'EVALUATION_V2', metrics, systems: publicCases, rankingInputExcludesTestExpectations: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(output, 'structure-ablation-v2.json'), { schemaVersion: '1.0', runId, evaluationVersion: 'EVALUATION_V2', bm25ParametersUnchanged: { k1: 1.2, b: 0.75 }, systems: metrics, reviewOnly: true })
  await writeJson(path.join(output, 'context-v2-results.json'), { schemaVersion: '1.0', runId, contexts: contextResults, summary: metrics.E_ROLE_AWARE_CONTEXT, reviewOnly: true })
  await writeJson(path.join(output, 'external-artifact-v2-manifest.json'), manifest)
  await writeJson(path.join(output, 'semantic-evidence-correction-report.json'), { schemaVersion: '1.0', runId, architecture, evaluationCaseCount: activeGold.length, excludedCaseCount: goldPrivate.adjudications.length - activeGold.length, metrics, noAcquisition: true, noVectorRetrieval: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  return { architecture, sourceRecords, parents: publicParents, children: publicChildren, headers: allHeaders, metrics, systems, artifacts: externalArtifacts, output, external }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) buildSemanticEvidenceCorrection().then((result) => console.log(JSON.stringify({ runId, sourceCount: result.sourceRecords.length, parentCount: result.parents.length, childCount: result.children.length, headerContextCount: result.headers.length, evaluationCaseCount: result.systems.E_ROLE_AWARE_CONTEXT.length, output: result.output, external: result.external }, null, 2))).catch((error) => { console.error(error.stack || error.message); process.exitCode = 1 })
