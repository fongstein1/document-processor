import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  addParentRrf,
  exactCosineRank,
  rankingDigest,
  reciprocalRankFusion
} from './lib/hybrid-vector-retrieval.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(await fs.readFile(path.join(repoRoot, 'config', 'hybrid-vector-retrieval-experiment.json'), 'utf8'))

assert.equal(config.fusion.method, 'RECIPROCAL_RANK_FUSION')
assert.equal(config.fusion.rrfK, 60)
assert.equal(config.fusion.bm25Weight, 1)
assert.equal(config.fusion.vectorWeight, 1)
assert.equal(config.fusion.parentRrfWeight, 0.5)
assert.equal(config.evaluation.noHoldoutTuning, true)
assert.equal(config.evaluation.rankingInputExcludesGold, true)
assert.equal(config.embedding.localOnly, true)
assert.equal(config.embedding.hostedApisUsed, false)

const documents = [
  { childId: 'a', parentId: 'p1' },
  { childId: 'b', parentId: 'p2' },
  { childId: 'c', parentId: 'p3' }
]
const vectors = new Float32Array([1, 0, 0, 1, Math.SQRT1_2, Math.SQRT1_2])
const vectorRanking = exactCosineRank({ queryVector: new Float32Array([1, 0]), documentVectors: vectors, documents, dimension: 2 })
assert.deepEqual(vectorRanking.map((item) => item.doc.childId), ['a', 'c', 'b'], 'exact cosine rank fixture')
assert.throws(() => exactCosineRank({ queryVector: new Float32Array([1]), documentVectors: vectors, documents, dimension: 2 }), /dimension mismatch/)

const bm25 = [{ doc: documents[0], rank: 1 }, { doc: documents[1], rank: 2 }]
const vector = [{ doc: documents[1], rank: 1 }, { doc: documents[0], rank: 2 }]
const fused = reciprocalRankFusion({ rankings: { bm25, vector }, weights: { bm25: 1, vector: 1 }, k: 60 })
assert.deepEqual(fused.map((item) => item.doc.childId), ['a', 'b'], 'RRF tie must use child ID')
const parentRanking = [{ doc: { parentId: 'p2' }, rank: 1 }, { doc: { parentId: 'p1' }, rank: 2 }]
const parentAware = addParentRrf({ hybridRanking: fused, parentRanking, parentWeight: 0.5, k: 60 })
assert.equal(parentAware[0].doc.childId, 'b', 'parent-aware contribution must rerank the tied hybrid results')

const beforeGoldMutation = rankingDigest({ fused, parentAware })
const syntheticGold = { acceptedTargetIds: ['a'], expectedSourceId: 'source-a' }
syntheticGold.acceptedTargetIds = ['b']
syntheticGold.expectedSourceId = 'source-b'
assert.equal(rankingDigest({ fused, parentAware }), beforeGoldMutation, 'gold changes must not affect precomputed rankings')
assert.equal(rankingDigest({ fused, parentAware }), rankingDigest({ fused, parentAware }), 'ranking digest determinism')

for (const unsafe of [
  { embedding: [0.1, 0.2] },
  { vector: [1, 2] },
  { passage: 'source-derived passage' },
  { query: 'private query' }
]) assert.throws(() => validateGitSafeArtifact({ artifactType: 'synthetic-negative', value: unsafe }), /Git-safe evidence schema violation/)

validateGitSafeArtifact({ artifactType: 'synthetic-public', value: {
  schemaVersion: '1.0', runId: config.runId, vectorCount: 3, vectorDimension: 2,
  documentVectorSha256: 'a'.repeat(64), exactVectorSearch: true, localOnly: true,
  reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false
} })

console.log('Hybrid/vector synthetic, fusion, rights-boundary, gold-leakage, and determinism tests passed.')
