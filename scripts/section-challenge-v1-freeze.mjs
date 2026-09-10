import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')
const cfg = JSON.parse(await fs.readFile(path.join(repoRoot, 'config/section-challenge-v1.json'), 'utf8'))
const privateFile = path.join(cfg.privateRoot, 'section-challenge-v1-adjudication.json')
const publicRoot = path.join(repoRoot, 'data/processed/review_packages', cfg.runId)
const sha = value => crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : String(value)).digest('hex')
const read = async file => JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, ''))
const stable = value => JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a],[b]) => a.localeCompare(b))) : item)
const write = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n') }
const countBy = (items, fn) => Object.fromEntries([...items.reduce((m, x) => m.set(fn(x), (m.get(fn(x)) || 0) + 1), new Map()).entries()].sort((a,b) => String(a[0]).localeCompare(String(b[0]))))
const rankingKeys = new Set(['rank','score','similarity','margin','top1','top3','top5','top10','mrr','selectedChildId','retrievalScore','finalScore'])
const scanRankingLeakage = (value, location = '$') => value && typeof value === 'object' ? Object.entries(value).flatMap(([key,item]) => rankingKeys.has(key) ? [`${location}.${key}`] : scanRankingLeakage(item, `${location}.${key}`)) : []

const bytes = await fs.readFile(privateFile)
const gold = JSON.parse(bytes)
assert.equal(gold.createdBeforeRerankerImplementation, true)
assert.equal(gold.createdWithoutSectionChallengeRankings, true)
assert.deepEqual(scanRankingLeakage(gold), [], 'Gold contains ranking leakage')
const supported = gold.cases.filter(x => x.included)
const diagnostic = gold.cases.filter(x => !x.included)
assert.deepEqual([supported.length, supported.filter(x=>x.split==='development').length, supported.filter(x=>x.split==='holdout').length, diagnostic.length], [cfg.supportedCaseCount,cfg.developmentCaseCount,cfg.holdoutCaseCount,cfg.diagnosticCaseCount])
assert.equal(new Set(gold.cases.map(x => x.caseId)).size, gold.cases.length)
assert.equal(new Set(gold.cases.map(x => x.queryHash)).size, gold.cases.length)

const children = new Map(), parents = new Map(), sourceShas = new Map()
for (const sourceId of gold.sourceIds) {
  const doc = await read(path.join(cfg.semanticRoot, sourceId, 'semantic-evidence-substantive.json'))
  sourceShas.set(sourceId, doc.source.sourceSha256)
  for (const child of doc.children) children.set(child.childId, child)
  for (const parent of doc.parents) parents.set(parent.parentId, parent)
}
for (const item of gold.cases) {
  assert.equal(sha(item.query), item.queryHash, `Query hash mismatch: ${item.caseId}`)
  if (!item.included) {
    assert.equal(item.classification, 'UNSUPPORTED_DIAGNOSTIC')
    assert.equal(item.sourceId, null)
    assert.deepEqual(item.acceptedTargetIds, [])
    continue
  }
  assert.equal(sourceShas.get(item.sourceId), item.sourceSha256, `Source SHA mismatch: ${item.caseId}`)
  assert.ok(item.acceptedTargetIds.length)
  assert.ok(item.acceptedParentIds.length)
  for (const id of item.acceptedTargetIds) {
    const child = children.get(id)
    assert.ok(child, `Missing accepted target: ${id}`)
    assert.equal(child.sourceId, item.sourceId)
    assert.ok(item.acceptedParentIds.includes(child.parentId), `Accepted parent lineage mismatch: ${id}`)
  }
  for (const id of item.acceptedParentIds) assert.ok(parents.has(id), `Missing accepted parent: ${id}`)
}
const pairs = new Map()
for (const item of supported) {
  const list = pairs.get(item.matchedPairId) || []
  list.push(item)
  pairs.set(item.matchedPairId, list)
}
for (const [pairId, items] of pairs) {
  assert.equal(items.length, 2, `Pair size mismatch: ${pairId}`)
  assert.equal(new Set(items.map(x => x.split)).size, 1, `Pair crosses split: ${pairId}`)
  assert.deepEqual(new Set(items.map(x => x.structuralClassifications.identifierPresence)), new Set(['PRESENT','ABSENT']))
  assert.deepEqual(new Set(items.flatMap(x => x.acceptedTargetIds)), new Set(items[0].acceptedTargetIds))
}

const protectedPaths = [
  'config/hybrid-vector-retrieval-experiment.json',
  'config/retrieval-gold-v3-evaluation.json',
  'config/multi-unit-gold-v1.json',
  'scripts/lib/hybrid-vector-retrieval.mjs',
  'scripts/lib/semantic-evidence-units.mjs',
  'scripts/hybrid-vector-retrieval-experiment.mjs',
  'data/processed/review_packages/retrieval-gold-v3-expansion-2026-09/evaluation-v3-freeze.json',
  'data/processed/review_packages/multi-unit-gold-v1-2026-09/gold-freeze.json'
]
const protectedArtifacts = protectedPaths.map(rel => ({ path: rel, sha256: sha(execFileSync('git', ['show', `${cfg.startingSha}:${rel}`], { cwd: repoRoot })) }))
for (const item of protectedArtifacts) assert.equal(sha(await fs.readFile(path.join(repoRoot, item.path))), item.sha256, `Protected input changed: ${item.path}`)

const cases = gold.cases.map(item => ({
  caseId: item.caseId, matchedPairId: item.matchedPairId, split: item.split, classification: item.classification,
  queryHash: item.queryHash, sourceId: item.sourceId, sourceSha256: item.sourceSha256,
  acceptedTargetIds: item.acceptedTargetIds, acceptedParentIds: item.acceptedParentIds,
  acceptedAlternativeTargetSets: item.acceptedAlternatives, citationCoordinates: item.citationCoordinates,
  authoritySupportRole: item.authoritySupportRole, modality: item.modality,
  structuralClassifications: item.structuralClassifications, reviewerStatus: item.reviewerStatus,
  included: item.included, queryExternal: true, rationaleExternal: true
}))
const gov = { reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
const freeze = {
  schemaVersion: '1.0', evaluationVersion: cfg.evaluationVersion, runId: cfg.runId,
  startingSha: cfg.startingSha, sourceBranch: cfg.sourceBranch, protocolFrozenAt: '2026-09-10T00:00:00.000Z',
  counts: { supported: supported.length, development: supported.filter(x=>x.split==='development').length, holdout: supported.filter(x=>x.split==='holdout').length, diagnostic: diagnostic.length, matchedPairs: pairs.size },
  sourceCounts: countBy(supported, x=>x.sourceId), modalityCounts: countBy(supported, x=>x.modality), splitCounts: countBy(supported, x=>x.split),
  structuralClassCounts: {
    identifierPresence: countBy(supported, x=>x.structuralClassifications.identifierPresence),
    phrasing: countBy(supported, x=>x.structuralClassifications.phrasing),
    seedReachabilityClass: countBy(supported, x=>x.structuralClassifications.seedReachabilityClass)
  },
  candidateCutoffs: { bm25Cutoff: cfg.candidateCutoffs.bm25, vectorCutoff: cfg.candidateCutoffs.vector, hybridCutoff: cfg.candidateCutoffs.hybrid }, reachabilityCutoffs: cfg.reachabilityCutoffs,
  evaluationMetrics: cfg.evaluationMetrics, successThresholds: cfg.successThresholds, damageBudget: cfg.damageBudget,
  structuralScoreBounds: cfg.structuralScoreBounds, normalization: { method: cfg.normalization.method, formulaCode: 'ONE_DIVIDED_BY_RANK', unionMissingRank: cfg.normalization.unionMissingRank, tieBreak: cfg.normalization.tieBreak },
  featureInventory: {
    available: ['query_explicit_identifiers','query_intent_cues','query_multipart_cues','query_structural_phrases','candidate_source_id','candidate_parent_id','candidate_parent_ancestry','candidate_structural_identifier','candidate_structural_label','candidate_parent_type','candidate_section_reference','candidate_semantic_role','candidate_hierarchy_depth','candidate_modality','candidate_worksheet','candidate_component_ranks'],
    usedByPlannedReranker: ['query_explicit_identifiers','query_intent_cues','query_multipart_cues','query_structural_phrases','candidate_source_id','candidate_parent_ancestry','candidate_structural_identifier','candidate_structural_label','candidate_parent_type','candidate_section_reference','candidate_semantic_role','candidate_modality','candidate_worksheet','candidate_component_ranks'],
    unavailable: ['calibrated_section_ontology','learned_query_classifier','cross_encoder_score','complete_paragraph_number_registry','verified_defined_term_registry']
  },
  protectedArtifacts, privateAdjudicationPath: privateFile, privateAdjudicationSha256: sha(bytes), privateAdjudicationByteCount: bytes.length,
  goldCreatedBeforeRerankerImplementation: true, rankingInputExcludesGold: true, holdoutAccessProhibitedUntilArchitectureFreeze: true,
  cases, ...gov
}
validateGitSafeArtifact({ artifactType: 'section-challenge-v1-freeze', value: freeze })
await write(path.join(publicRoot, 'evaluation-freeze.json'), freeze)
const manifest = { schemaVersion: '1.0', runId: cfg.runId, artifactCount: 1, totalByteCount: bytes.length, aggregateSha256: sha(stable([{ artifactType: 'private-section-challenge-adjudication', sha256: sha(bytes), byteCount: bytes.length }])), artifacts: [{ artifactType: 'private-section-challenge-adjudication', externalPath: privateFile, sha256: sha(bytes), byteCount: bytes.length, rightsStorageStatus: 'EXTERNAL_PRIVATE' }], ...gov }
validateGitSafeArtifact({ artifactType: 'section-challenge-v1-manifest', value: manifest })
await write(path.join(publicRoot, 'external-artifact-manifest.json'), manifest)
console.log(JSON.stringify({ freezePath: path.join(publicRoot, 'evaluation-freeze.json'), counts: freeze.counts, privateSha256: freeze.privateAdjudicationSha256 }, null, 2))
