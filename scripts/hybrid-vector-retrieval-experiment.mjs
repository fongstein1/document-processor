import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  expandRoleAwareContext,
  makeFieldedBm25Index,
  rankBm25
} from './lib/semantic-evidence-units.mjs'
import {
  addParentRrf,
  exactCosineRank,
  firstAcceptedRank,
  rankingDigest,
  reciprocalRankFusion,
  sha256,
  stableJson,
  summarizeMetrics
} from './lib/hybrid-vector-retrieval.mjs'

export const runId = 'hybrid-vector-retrieval-experiment-2026-09'
export const repoRoot = path.resolve(import.meta.dirname, '..')
export const publicRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', runId)
export const externalRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', runId)
const semanticRunId = 'semantic-evidence-unit-correction-2026-09'
const semanticPublicRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', semanticRunId)
const semanticExternalRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', semanticRunId)
const configPath = path.join(repoRoot, 'config', 'hybrid-vector-retrieval-experiment.json')
const fields = ['body', 'section', 'identifier', 'parentHeading', 'sourceTitle', 'header']

const readJson = async (file) => JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, ''))
const writeJson = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8') }
const writeJsonl = async (file, rows) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n', 'utf8') }
const fileSha256 = async (file) => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')
const fileRecord = async (file, artifactType) => { const bytes = await fs.readFile(file); return { artifactType, externalPath: path.resolve(file), sha256: crypto.createHash('sha256').update(bytes).digest('hex'), byteCount: bytes.length, rightsStorageStatus: 'RIGHTS_EXTERNAL_STORAGE_ONLY', reviewOnly: true } }

export const loadInputs = async () => {
  const config = await readJson(configPath)
  const freezePath = path.join(semanticPublicRoot, 'evaluation-v2-freeze.json')
  if (await fileSha256(freezePath) !== config.evaluation.goldFreezeSha256) throw new Error('Frozen Gold V2 physical bytes changed.')
  const freeze = await readJson(freezePath)
  if (freeze.developmentCaseCount !== config.evaluation.developmentCaseCount || freeze.holdoutCaseCount !== config.evaluation.holdoutCaseCount) throw new Error('Frozen Gold V2 split counts changed.')
  const sourceRecords = (await readJson(path.join(semanticPublicRoot, 'architecture-v2-source-records.json'))).sources
  const publicChildren = (await readJson(path.join(semanticPublicRoot, 'child-v2-manifest.json'))).children
  const publicParents = (await readJson(path.join(semanticPublicRoot, 'parent-v2-manifest.json'))).parents
  const substantive = []
  for (const sourceRecord of sourceRecords) {
    const sourceFile = path.join(semanticExternalRoot, sourceRecord.sourceId, 'semantic-evidence-substantive.json')
    if (await fileSha256(sourceFile) !== sourceRecord.externalArtifactSha256) throw new Error(`Corrected evidence artifact hash mismatch: ${sourceRecord.sourceId}`)
    const value = await readJson(sourceFile)
    if (value.reviewOnly !== true || value.promotionStatus !== 'not_promoted' || value.ragReadyAllowed !== false) throw new Error(`Corrected evidence governance mismatch: ${sourceRecord.sourceId}`)
    substantive.push(value)
  }
  const children = substantive.flatMap((item) => item.children)
  const parents = substantive.flatMap((item) => item.parents)
  const headers = substantive.flatMap((item) => item.headerContexts)
  const parentContexts = substantive.flatMap((item) => item.parentContexts)
  if (children.length !== publicChildren.length || parents.length !== publicParents.length) throw new Error('Corrected evidence public/private count mismatch.')
  const privateGold = await readJson(path.join(semanticExternalRoot, 'gold-v2-adjudication.json'))
  if (privateGold.adjudications.filter((item) => item.included).length !== config.evaluation.developmentCaseCount + config.evaluation.holdoutCaseCount) throw new Error('Private Gold V2 included-case count mismatch.')
  return { config, freeze, sourceRecords, substantive, children, parents, headers, parentContexts, privateGold }
}

export const buildRetrievalDocs = ({ substantive, children, parents, parentContexts }) => {
  const parentById = new Map(parents.map((parent) => [parent.parentId, parent]))
  const contextByParent = new Map(parentContexts.map((context) => [context.parentId, context]))
  const sourceById = new Map(substantive.map((item) => [item.source.sourceId, item.source]))
  const docs = children.map((child) => {
    const parent = parentById.get(child.parentId)
    const source = sourceById.get(child.sourceId)
    return {
      ...child,
      body: child.searchText || child.sourceTextExcerpt || '',
      section: child.sectionReference || '',
      identifier: parent?.structuralIdentifier || '',
      parentHeading: parent?.structuralLabel || '',
      sourceTitle: source?.sourceTitle || source?.provingGround || '',
      header: child.headerText || child.sheetName || ''
    }
  })
  const parentDocs = parents.map((parent) => {
    const source = sourceById.get(parent.sourceId)
    const context = contextByParent.get(parent.parentId)
    return {
      ...parent,
      body: context?.contextText || '',
      section: parent.structuralIdentifier || '',
      identifier: parent.structuralIdentifier || '',
      parentHeading: parent.structuralLabel || '',
      sourceTitle: source?.sourceTitle || source?.provingGround || '',
      header: parent.sheetName || ''
    }
  })
  return { docs, parentDocs, parentById, sourceById }
}

const passageText = (doc, prefix) => `${prefix}source: ${doc.sourceTitle}\nsection: ${doc.section}\nidentifier: ${doc.identifier}\nparent: ${doc.parentHeading}\nrole: ${doc.semanticRole}\nheader: ${doc.header}\n${doc.body}`

export const prepareHybridExperiment = async () => {
  const inputs = await loadInputs()
  const { docs } = buildRetrievalDocs(inputs)
  const queryRows = inputs.privateGold.adjudications.map((item) => ({ id: item.caseId, text: inputs.config.embedding.queryPrefix + item.query, queryHash: item.queryHash, included: item.included, split: item.split, adjudicationStatus: item.ambiguityStatus }))
  const passageRows = docs.map((doc) => ({ id: doc.childId, text: passageText(doc, inputs.config.embedding.passagePrefix), sourceId: doc.sourceId, parentId: doc.parentId, contentHash: doc.contentHash }))
  const passagesPath = path.join(externalRoot, 'passages.jsonl')
  const queriesPath = path.join(externalRoot, 'queries.jsonl')
  await writeJsonl(passagesPath, passageRows)
  await writeJsonl(queriesPath, queryRows)
  const manifest = {
    schemaVersion: '1.0', runId, startingSha: inputs.config.startingSha,
    evaluationVersion: inputs.config.evaluation.evaluationVersion,
    goldFreezeSha256: inputs.config.evaluation.goldFreezeSha256,
    rankingInputExcludesGold: true,
    vectorCount: passageRows.length,
    queryVectorCount: queryRows.length,
    passageIdsSha256: sha256(stableJson(passageRows.map((item) => item.id))),
    queryIdsSha256: sha256(stableJson(queryRows.map((item) => item.id))),
    passageManifestSha256: await fileSha256(passagesPath),
    queryManifestSha256: await fileSha256(queriesPath),
    sourceIds: inputs.sourceRecords.map((item) => item.sourceId),
    reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false
  }
  await writeJson(path.join(externalRoot, 'ranking-input-manifest.json'), manifest)
  console.log(`Prepared ${passageRows.length} corrected evidence passages and ${queryRows.length} frozen query inputs under ${externalRoot}.`)
  return manifest
}

const readFloat32 = async (file) => {
  const bytes = await fs.readFile(file)
  if (bytes.length % 4 !== 0) throw new Error(`Invalid float32 byte length: ${file}`)
  const copy = Buffer.from(bytes)
  return new Float32Array(copy.buffer, copy.byteOffset, copy.byteLength / 4)
}

const colIndex = (name) => { if (!name) return null; let result = 0; for (const char of name) result = result * 26 + char.charCodeAt(0) - 64; return result }
const overlaps = (leftStart, leftEnd, rightStart, rightEnd) => leftStart === null || leftStart === undefined || rightStart === null || rightStart === undefined || leftStart <= rightEnd && leftEnd >= rightStart
const resolveTargets = (goldCase, children) => [...new Set(goldCase.chosenGoldEvidence.flatMap((evidence) => {
  let candidates = children.filter((child) => child.sourceId === goldCase.sourceId && (child.sourceChunkIds || []).includes(evidence.sourceChunkId))
  if (evidence.worksheetPath) candidates = candidates.filter((child) => child.worksheetPath === evidence.worksheetPath && overlaps(child.rowStart, child.rowEnd, evidence.rowStart, evidence.rowEnd) && overlaps(colIndex(child.colStart), colIndex(child.colEnd), colIndex(evidence.colStart), colIndex(evidence.colEnd)))
  if (evidence.targetRole) { const roleMatches = candidates.filter((child) => child.semanticRole === evidence.targetRole); if (roleMatches.length) candidates = roleMatches }
  return candidates.map((child) => child.childId)
}))]
const coordinateValid = (child) => Boolean(child && ((child.pageStart !== null && child.pageStart !== undefined) || (child.worksheetPath && child.rowStart !== null && child.rowStart !== undefined)))

const publicCase = (item) => ({
  caseId: item.caseId, split: item.split, category: item.category, systemId: item.systemId,
  expectedSourceId: item.expectedSourceId, expectedRole: item.expectedRole,
  acceptedTargetIds: item.acceptedTargetIds, acceptedParentIds: item.acceptedParentIds,
  selectedChildId: item.selectedChildId, selectedParentId: item.selectedParentId,
  selectedSourceId: item.selectedSourceId, selectedRole: item.selectedRole,
  targetRank: item.targetRank, sourceTop1: item.sourceTop1, sourceTop3: item.sourceTop3, sourceTop5: item.sourceTop5,
  acceptedTop1: item.acceptedTop1, acceptedTop3: item.acceptedTop3, acceptedTop5: item.acceptedTop5, acceptedTop10: item.acceptedTop10,
  acceptedMrr: item.acceptedMrr, exactChildEligible: item.exactChildEligible, exactChildTop1: item.exactChildTop1,
  exactParent: item.exactParent, wrongSource: item.wrongSource, wrongSection: item.wrongSection,
  authoritySupportCorrectness: item.authoritySupportCorrectness, citationCoordinateValidity: item.citationCoordinateValidity,
  targetCitationCorrectness: item.targetCitationCorrectness, requiredRoles: item.requiredRoles,
  requiredRoleRecall: item.requiredRoleRecall, acceptedEvidenceRecall: item.acceptedEvidenceRecall,
  contextPrecision: item.contextPrecision, completeContext: item.completeContext,
  irrelevantContextCount: item.irrelevantContextCount, contextEvidenceIds: item.contextEvidenceIds,
  queryIntent: item.queryIntent, contextBounded: item.contextBounded, queryExternal: true
})

const evaluateCase = ({ goldCase, systemId, ranked, documents, childrenByParent, parentById, headerById, contextAware }) => {
  const acceptedTargetIds = resolveTargets(goldCase, documents)
  const targetRank = firstAcceptedRank(ranked, acceptedTargetIds)
  const selected = ranked[0]?.doc || null
  const acceptedParentIds = [...new Set(documents.filter((item) => acceptedTargetIds.includes(item.childId)).map((item) => item.parentId).filter(Boolean))]
  const context = contextAware
    ? expandRoleAwareContext({ query: goldCase.query, selected, childrenByParent, parentById, headerById })
    : { queryIntent: 'NONE', contextEvidenceIds: selected ? [selected.childId] : [], contextRecords: selected ? [{ evidenceId: selected.childId, role: selected.semanticRole || 'OTHER' }] : [], bounded: true }
  const selectedAccepted = Boolean(selected && acceptedTargetIds.includes(selected.childId))
  const requiredRoles = goldCase.requiredSupportingEvidence.map((item) => item.role)
  const capturedRoles = new Set(context.contextRecords.map((record) => record.role))
  const requiredRoleHits = requiredRoles.filter((role) => capturedRoles.has(role)).length
  const requiredRoleRecall = requiredRoles.length ? requiredRoleHits / requiredRoles.length : 1
  const complete = selectedAccepted && requiredRoleRecall === 1
  const requiredEvidenceCount = 1 + requiredRoles.length
  const contextPrecision = context.contextEvidenceIds.length ? (Number(selectedAccepted) + requiredRoleHits) / context.contextEvidenceIds.length : 0
  return {
    caseId: goldCase.caseId, split: goldCase.split, category: goldCase.category, systemId,
    expectedSourceId: goldCase.sourceId, expectedRole: goldCase.authoritySupportRole,
    acceptedTargetIds, acceptedParentIds, selectedChildId: selected?.childId || null,
    selectedParentId: selected?.parentId || null, selectedSourceId: selected?.sourceId || null,
    selectedRole: selected?.authoritySupportRole || null, selectedRankScore: ranked[0]?.finalScore || 0,
    targetRank, sourceTop1: selected?.sourceId === goldCase.sourceId,
    sourceTop3: ranked.slice(0, 3).some((item) => item.doc.sourceId === goldCase.sourceId),
    sourceTop5: ranked.slice(0, 5).some((item) => item.doc.sourceId === goldCase.sourceId),
    acceptedTop1: targetRank === 1, acceptedTop3: Boolean(targetRank && targetRank <= 3),
    acceptedTop5: Boolean(targetRank && targetRank <= 5), acceptedTop10: Boolean(targetRank && targetRank <= 10),
    acceptedMrr: targetRank ? 1 / targetRank : 0, exactChildEligible: acceptedTargetIds.length === 1,
    exactChildTop1: acceptedTargetIds.length === 1 && targetRank === 1,
    exactParent: Boolean(selected?.parentId && acceptedParentIds.includes(selected.parentId)),
    wrongSource: Boolean(selected && selected.sourceId !== goldCase.sourceId),
    wrongSection: Boolean(selected && selected.sourceId === goldCase.sourceId && acceptedParentIds.length && !acceptedParentIds.includes(selected.parentId)),
    authoritySupportCorrectness: selected?.authoritySupportRole === goldCase.authoritySupportRole,
    citationCoordinateValidity: coordinateValid(selected), targetCitationCorrectness: selectedAccepted && coordinateValid(selected),
    requiredRoles, requiredRoleRecall, acceptedEvidenceRecall: complete ? 1 : selectedAccepted ? 1 / requiredEvidenceCount : 0,
    contextPrecision, completeContext: complete,
    irrelevantContextCount: Math.max(0, context.contextEvidenceIds.length - Number(selectedAccepted) - requiredRoleHits),
    contextEvidenceIds: context.contextEvidenceIds, queryIntent: context.queryIntent, contextBounded: context.bounded
  }
}

const systemMetrics = (results) => ({
  development: summarizeMetrics(results.filter((item) => item.split === 'development')),
  holdout: summarizeMetrics(results.filter((item) => item.split === 'holdout')),
  combined: summarizeMetrics(results)
})

const diagnosticSummary = (items) => {
  const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null
  return {
    diagnosticCaseCount: items.length,
    scoreMaximum: items.length ? Math.max(...items.map((item) => item.top1Score)) : null,
    scoreMean: average(items.map((item) => item.top1Score)),
    top1Top2MarginMean: average(items.map((item) => item.margin)),
    top1Top2MarginMinimum: items.length ? Math.min(...items.map((item) => item.margin)) : null
  }
}

export const evaluateHybridExperiment = async () => {
  const inputs = await loadInputs()
  const { docs, parentDocs, parentById, sourceById } = buildRetrievalDocs(inputs)
  const passageRows = (await fs.readFile(path.join(externalRoot, 'passages.jsonl'), 'utf8')).trim().split(/\r?\n/).map(JSON.parse)
  const queryRows = (await fs.readFile(path.join(externalRoot, 'queries.jsonl'), 'utf8')).trim().split(/\r?\n/).map(JSON.parse)
  if (passageRows.length !== docs.length || passageRows.some((row, index) => row.id !== docs[index].childId)) throw new Error('Passage/vector order differs from corrected evidence units.')
  const embeddingMetadata = await readJson(path.join(externalRoot, 'embedding-metadata.json'))
  if (embeddingMetadata.model !== inputs.config.embedding.model || embeddingMetadata.revision !== inputs.config.embedding.revision || embeddingMetadata.license !== inputs.config.embedding.license || embeddingMetadata.inferencePrecision !== inputs.config.embedding.inferencePrecision) throw new Error('Embedding model provenance differs from frozen protocol.')
  const documentVectors = await readFloat32(path.join(externalRoot, 'document-embeddings.f32'))
  const queryVectors = await readFloat32(path.join(externalRoot, 'query-embeddings.f32'))
  const dimension = embeddingMetadata.vectorDimension
  if (documentVectors.length !== docs.length * dimension || queryVectors.length !== queryRows.length * dimension) throw new Error('Embedding matrix shape mismatch.')

  const bm25Index = makeFieldedBm25Index(docs, fields, inputs.config.bm25)
  const parentIndex = makeFieldedBm25Index(parentDocs, fields, inputs.config.bm25)
  const queryById = new Map(queryRows.map((item, index) => [item.id, { ...item, index }]))
  const rankings = new Map()
  for (const goldCase of inputs.privateGold.adjudications) {
    const queryRow = queryById.get(goldCase.caseId)
    if (!queryRow || sha256(goldCase.query) !== goldCase.queryHash) throw new Error(`Frozen query hash mismatch: ${goldCase.caseId}`)
    const bm25 = rankBm25(goldCase.query, docs, bm25Index)
    const vector = exactCosineRank({ queryVector: queryVectors.subarray(queryRow.index * dimension, (queryRow.index + 1) * dimension), documentVectors, documents: docs, dimension })
    const hybrid = reciprocalRankFusion({ rankings: { bm25, vector }, weights: { bm25: inputs.config.fusion.bm25Weight, vector: inputs.config.fusion.vectorWeight }, k: inputs.config.fusion.rrfK })
    const parentBm25 = rankBm25(goldCase.query, parentDocs, parentIndex)
    const parent = addParentRrf({ hybridRanking: hybrid, parentRanking: parentBm25, parentWeight: inputs.config.fusion.parentRrfWeight, k: inputs.config.fusion.rrfK })
    rankings.set(goldCase.caseId, { bm25, vector, hybrid, parent })
    console.log(`ranked ${goldCase.caseId}`)
  }

  const childrenByParent = new Map()
  for (const child of docs) { const rows = childrenByParent.get(child.parentId) || []; rows.push(child); childrenByParent.set(child.parentId, rows) }
  for (const rows of childrenByParent.values()) rows.sort((left, right) => (left.worksheetOrder ?? 0) - (right.worksheetOrder ?? 0) || (left.pageStart ?? 0) - (right.pageStart ?? 0) || (left.rowStart ?? 0) - (right.rowStart ?? 0) || (left.childOrdinal ?? 0) - (right.childOrdinal ?? 0) || left.childId.localeCompare(right.childId))
  const headerById = new Map(inputs.headers.map((header) => [header.headerContextId, header]))
  const activeGold = inputs.privateGold.adjudications.filter((item) => item.included)
  const systemDefinitions = [
    ['BM25', 'bm25', false], ['VECTOR', 'vector', false], ['HYBRID_RRF', 'hybrid', false],
    ['HYBRID_RRF_PARENT', 'parent', false], ['HYBRID_RRF_PARENT_CONTEXT', 'parent', true]
  ]
  const systems = {}
  for (const [systemId, rankingName, contextAware] of systemDefinitions) systems[systemId] = activeGold.map((goldCase) => evaluateCase({ goldCase, systemId, ranked: rankings.get(goldCase.caseId)[rankingName], documents: docs, childrenByParent, parentById, headerById, contextAware }))
  const metrics = Object.fromEntries(Object.entries(systems).map(([systemId, results]) => [systemId, systemMetrics(results)]))

  const sourceSlices = []
  for (const [systemId, results] of Object.entries(systems)) {
    for (const provingGround of ['A3', 'W07', 'W08', 'XLSX-FG', 'XLSX-VM31', 'XLSX-SOA']) {
      const sourceIds = [...sourceById.values()].filter((source) => source.provingGround === provingGround).map((source) => source.sourceId)
      const slice = results.filter((item) => sourceIds.includes(item.expectedSourceId))
      const diagnosticOnlyCaseCount = inputs.privateGold.adjudications.filter((item) => !item.included && sourceIds.includes(item.sourceId)).length
      sourceSlices.push({ systemId, provingGround, includedCaseCount: slice.length, diagnosticOnlyCaseCount, evaluable: slice.length > 0, reason: slice.length ? 'FROZEN_GOLD_V2_INCLUDED_CASES' : 'NO_INCLUDED_GOLD_V2_CASES', ...systemMetrics(slice) })
    }
  }
  const xlsxSourceIds = inputs.sourceRecords.filter((item) => item.provingGround.startsWith('XLSX')).map((item) => item.sourceId)
  const xlsx = Object.entries(systems).map(([systemId, results]) => ({ systemId, ...systemMetrics(results.filter((item) => xlsxSourceIds.includes(item.expectedSourceId))) }))
  const a3SourceId = inputs.sourceRecords.find((item) => item.provingGround === 'A3')?.sourceId
  const a3 = Object.entries(systems).map(([systemId, results]) => ({ systemId, ...systemMetrics(results.filter((item) => item.expectedSourceId === a3SourceId)) }))

  const diagnostics = []
  for (const [systemId, rankingName] of systemDefinitions.slice(0, 4).map(([systemId, rankingName]) => [systemId, rankingName])) {
    const invalid = []; const ambiguous = []
    for (const item of inputs.privateGold.adjudications.filter((goldCase) => !goldCase.included)) {
      const ranked = rankings.get(item.caseId)[rankingName]
      const row = { top1Score: ranked[0]?.finalScore || 0, margin: (ranked[0]?.finalScore || 0) - (ranked[1]?.finalScore || 0) }
      if (item.ambiguityStatus === 'INVALID_TARGET_EXCLUDED') invalid.push(row); else ambiguous.push(row)
    }
    diagnostics.push({ systemId, diagnosticStatus: 'INVALID_TARGET_EXCLUDED', ...diagnosticSummary(invalid) })
    diagnostics.push({ systemId, diagnosticStatus: 'AMBIGUOUS_EXCLUDED', ...diagnosticSummary(ambiguous) })
  }

  const rankingHashes = {}
  for (const [caseId, value] of rankings) rankingHashes[caseId] = rankingDigest(value)
  const determinismSha256 = sha256(stableJson(rankingHashes))
  const privateRankingDetails = inputs.privateGold.adjudications.map((goldCase) => ({
    caseId: goldCase.caseId, query: goldCase.query, queryHash: goldCase.queryHash, included: goldCase.included,
    adjudicationStatus: goldCase.ambiguityStatus,
    rankings: Object.fromEntries(Object.entries(rankings.get(goldCase.caseId)).map(([name, ranked]) => [name, ranked.slice(0, 100).map((item) => ({ childId: item.doc.childId, parentId: item.doc.parentId, sourceId: item.doc.sourceId, score: item.finalScore, rank: item.rank }))]))
  }))
  await writeJson(path.join(externalRoot, 'ranking-details.json'), { schemaVersion: '1.0', runId, rankingInputExcludesGold: true, rankingHashes, cases: privateRankingDetails, reviewOnly: true })
  await writeJson(path.join(externalRoot, 'evaluation-private.json'), { schemaVersion: '1.0', runId, evaluationVersion: 'EVALUATION_V2', systems, metrics, sourceSlices, diagnostics, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  const index = { schemaVersion: '1.0', runId, vectorDimension: dimension, vectorCount: docs.length, vectorDtype: embeddingMetadata.vectorDtype, childIds: docs.map((item) => item.childId), documentVectorSha256: embeddingMetadata.documentVectorSha256, exactVectorSearch: true, bruteForce: true, reviewOnly: true }
  await writeJson(path.join(externalRoot, 'document-embedding-index.json'), index)
  const indexSha256 = await fileSha256(path.join(externalRoot, 'document-embedding-index.json'))

  const artifacts = []
  const artifactSpecs = [
    ['passages.jsonl', 'embedding-passages'], ['queries.jsonl', 'private-queries'], ['ranking-input-manifest.json', 'ranking-input-manifest'],
    ['document-embeddings.f32', 'document-vectors'], ['query-embeddings.f32', 'query-vectors'], ['embedding-metadata.json', 'embedding-provenance'],
    ['document-embedding-index.json', 'exact-vector-index'], ['ranking-details.json', 'private-ranking-details'], ['evaluation-private.json', 'private-evaluation-details']
  ]
  const determinismPath = path.join(externalRoot, 'determinism-evidence.json')
  const determinismEvidence = await fs.access(determinismPath).then(() => readJson(determinismPath)).catch(() => null)
  if (determinismEvidence) artifactSpecs.push(['determinism-evidence.json', 'determinism-evidence'], ['determinism-rerun/document-embeddings.f32', 'determinism-document-vectors'], ['determinism-rerun/query-embeddings.f32', 'determinism-query-vectors'], ['determinism-rerun/embedding-metadata.json', 'determinism-embedding-provenance'])
  for (const [name, artifactType] of artifactSpecs) artifacts.push(await fileRecord(path.join(externalRoot, name), artifactType))
  const privateArtifactByteCount = artifacts.reduce((sum, item) => sum + item.byteCount, 0)
  const aggregateSha256 = sha256(stableJson(artifacts.map(({ artifactType, sha256: hash, byteCount }) => ({ artifactType, sha256: hash, byteCount }))))
  const rankingInput = await readJson(path.join(externalRoot, 'ranking-input-manifest.json'))
  const publicConfiguration = {
    schemaVersion: '1.0', runId, protocolFrozenAt: inputs.config.protocolFrozenAt,
    startingSha: inputs.config.startingSha, sourceBranch: inputs.config.sourceBranch,
    evaluation: inputs.config.evaluation,
    embeddingModel: inputs.config.embedding.model, embeddingRevision: inputs.config.embedding.revision,
    embeddingLicense: inputs.config.embedding.license, embeddingSourceUrl: inputs.config.embedding.sourceUrl,
    device: embeddingMetadata.device, inferencePrecision: embeddingMetadata.inferencePrecision, pooling: embeddingMetadata.pooling, normalization: embeddingMetadata.normalization,
    passagePrefix: inputs.config.embedding.passagePrefix, queryPrefix: inputs.config.embedding.queryPrefix,
    maxSequenceLength: inputs.config.embedding.maxSequenceLength, vectorDtype: embeddingMetadata.vectorDtype,
    vectorDimension: dimension, vectorCount: docs.length, queryVectorCount: queryRows.length,
    exactVectorSearch: true, bruteForce: true, localOnly: true, hostedApisUsed: false,
    bm25: inputs.config.bm25, fusion: inputs.config.fusion, context: inputs.config.context,
    runtime: embeddingMetadata.runtime, modelSnapshotSha256: embeddingMetadata.modelSnapshotSha256,
    modelSnapshotByteCount: embeddingMetadata.modelSnapshotByteCount,
    normMaximumDeviation: embeddingMetadata.normMaximumDeviation,
    goldFreezeSha256: inputs.config.evaluation.goldFreezeSha256, goldUnchanged: true,
    rankingInputExcludesGold: true, noHoldoutTuning: true,
    rankingInputManifestSha256: await fileSha256(path.join(externalRoot, 'ranking-input-manifest.json')),
    passageManifestSha256: rankingInput.passageManifestSha256, queryManifestSha256: rankingInput.queryManifestSha256,
    documentVectorSha256: embeddingMetadata.documentVectorSha256, queryVectorSha256: embeddingMetadata.queryVectorSha256,
    indexSha256, determinismSha256, determinismPassed: determinismEvidence?.allPassed === true,
    reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false
  }
  const publicSystems = Object.fromEntries(Object.entries(systems).map(([systemId, results]) => [systemId, results.map(publicCase)]))
  const report = {
    schemaVersion: '1.0', runId, startingSha: inputs.config.startingSha,
    evaluationVersion: 'EVALUATION_V2', developmentCaseCount: inputs.config.evaluation.developmentCaseCount,
    holdoutCaseCount: inputs.config.evaluation.holdoutCaseCount, metrics,
    a3, xlsx, unsupportedDiagnostics: diagnostics,
    provenance: publicConfiguration,
    privateArtifactByteCount, artifactCount: artifacts.length, aggregateSha256,
    noNewSources: true, canonicalCorporaUnchanged: true, rawSourceBytesUnchanged: true,
    goldV2Unchanged: true, noAnswerGeneration: true, noProductionRag: true,
    noLearnerFacingOutput: true, noHostedModels: true, embeddingInputsExternal: true,
    vectorsExternal: true, queriesExternal: true, goldRationaleExternal: true,
    maturityLevel: 'LEVEL_1', nextStep: 'A', outcome: 'PASS_WITH_LIMITATIONS',
    limitations: [
      'Frozen Gold V2 has only 6 development and 11 holdout cases.',
      'Development accepted-target Top-1 is zero for all five systems.',
      'Hybrid and parent-aware reranking improve source selection more than accepted-target selection.',
      'Bounded role-aware context does not achieve complete-context capture.',
      'A3 has one included holdout case and no included development cases.',
      'Excluded-query diagnostics are not a calibrated unsupported-query abstention evaluation.',
      'The committed PyTorch dynamic quantization API is deprecated and requires a future runtime migration before reuse.'
    ],
    reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false
  }
  await writeJson(path.join(publicRoot, 'experiment-configuration.json'), publicConfiguration)
  await writeJson(path.join(publicRoot, 'evaluation-results.json'), { schemaVersion: '1.0', runId, evaluationVersion: 'EVALUATION_V2', metrics, systems: publicSystems, rankingInputExcludesGold: true, noHoldoutTuning: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(publicRoot, 'source-slice-results.json'), { schemaVersion: '1.0', runId, sourceSlices, a3, xlsx, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  await writeJson(path.join(publicRoot, 'unsupported-query-diagnostics.json'), { schemaVersion: '1.0', runId, invalidTargetCaseCount: inputs.privateGold.adjudications.filter((item) => item.ambiguityStatus === 'INVALID_TARGET_EXCLUDED').length, ambiguousCaseCount: inputs.privateGold.adjudications.filter((item) => item.ambiguityStatus === 'AMBIGUOUS_EXCLUDED').length, diagnostics, queryExternal: true, rationaleExternal: true, reviewOnly: true })
  await writeJson(path.join(publicRoot, 'external-artifact-manifest.json'), { schemaVersion: '1.0', runId, externalProcessingRoot: externalRoot, artifacts, privateArtifactByteCount, artifactCount: artifacts.length, aggregateSha256, reviewOnly: true })
  await writeJson(path.join(publicRoot, 'experiment-report.json'), report)
  console.log(`Evaluated ${activeGold.length} frozen Gold V2 cases across five systems.`)
  return { metrics, systems, report, artifacts }
}

const command = process.argv[2] || 'evaluate'
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (command === 'prepare') await prepareHybridExperiment()
  else if (command === 'evaluate') await evaluateHybridExperiment()
  else throw new Error(`Unknown command: ${command}`)
}
