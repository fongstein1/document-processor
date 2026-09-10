import assert from 'node:assert/strict'
import {
  assertNoEvaluationLeakage,
  buildDeepUnion,
  extractStructuralIdentifiers,
  inferQueryStructure,
  rerankDeepUnion,
  scoreStructuralCompatibility
} from './lib/soft-structural-reranker.mjs'

const bounds = {
  maximumBonus: 0.18,
  maximumConflictPenalty: 0.12,
  lowConfidenceScale: 0.25,
  mediumConfidenceScale: 0.60,
  highConfidenceScale: 1
}

const doc = (childId, overrides = {}) => ({
  childId,
  parentId: `parent-${childId}`,
  sourceId: 'source-1',
  sourceTitle: 'Regulatory Manual',
  documentType: 'pdf',
  semanticRole: 'REQUIREMENT',
  body: 'A reporting entity must recognize the specified requirement.',
  ...overrides
})

const ranked = (documents, offset = 0) => documents.map((item, index) => ({ doc: item, rank: index + 1, finalScore: 1 / (index + 1 + offset) }))

assert.deepEqual(extractStructuralIdentifiers('Under SSAP No. 51R and VM-20 Table F, what applies?'), ['ssap 51r', 'table f', 'vm 20'])
assert.deepEqual(extractStructuralIdentifiers('On the Instructions Template A worksheet, what applies?'), ['instructions template a'])
assert.equal(inferQueryStructure('Where should a reporting entity look when instructions omit a topic?').intentRoles.includes('TABLE_OR_FORM'), false)
assert.equal(inferQueryStructure('Which tables must reporting entities complete?').intentRoles.includes('TABLE_OR_FORM'), true)

const unionDocs = [doc('a'), doc('b'), doc('c'), doc('d')]
const union = buildDeepUnion({
  bm25: ranked([unionDocs[0], unionDocs[1], unionDocs[2]]),
  vector: ranked([unionDocs[1], unionDocs[3], unionDocs[0]]),
  hybrid: ranked([unionDocs[2], unionDocs[1], unionDocs[3]]),
  cutoffs: { bm25: 2, vector: 2, hybrid: 2 }
})
assert.deepEqual(union.map(item => item.doc.childId).sort(), ['a', 'b', 'c', 'd'])
assert.deepEqual(union.find(item => item.doc.childId === 'b').origins, ['bm25', 'hybrid', 'vector'])

const parentById = new Map([
  ['local-51', { parentId: 'local-51', structuralIdentifier: 'SSAP 51R', structuralLabel: 'SSAP No. 51R', parentParentId: 'document' }],
  ['local-52', { parentId: 'local-52', structuralIdentifier: 'SSAP 52', structuralLabel: 'SSAP No. 52', parentParentId: 'document' }],
  ['nested', { parentId: 'nested', structuralIdentifier: 'Scope', structuralLabel: 'Scope', parentParentId: 'local-51' }],
  ['document', { parentId: 'document', structuralIdentifier: 'Manual', structuralLabel: 'Manual' }]
])
const plan = inferQueryStructure('Under SSAP No. 51R, which requirement applies to reinsurance?')
const local = scoreStructuralCompatibility({ plan, doc: doc('local', { parentId: 'local-51', section: 'SSAP 51R', body: 'The reinsurance requirement applies.' }), ranks: { bm25: 2, vector: 2, hybrid: 2 }, parentById, bounds })
const ancestor = scoreStructuralCompatibility({ plan, doc: doc('nested', { parentId: 'nested', section: 'Scope', body: 'The reinsurance requirement applies.' }), ranks: { bm25: 2, vector: 2, hybrid: 2 }, parentById, bounds })
const sibling = scoreStructuralCompatibility({ plan, doc: doc('sibling', { parentId: 'local-52', section: 'SSAP 52', body: 'The reinsurance requirement applies.' }), ranks: { bm25: 1, vector: 1, hybrid: 1 }, parentById, bounds })
assert.ok(local.features.localIdentifierMatches > 0)
assert.ok(ancestor.features.ancestorIdentifierMatches > 0)
assert.ok(local.adjustment > ancestor.adjustment)
assert.ok(local.adjustment > sibling.adjustment)

for (const confidence of ['HIGH', 'MEDIUM', 'LOW_OR_UNKNOWN']) {
  const scored = scoreStructuralCompatibility({ plan: { ...plan, confidence }, doc: doc(confidence, { parentId: 'local-51', section: 'SSAP 51R' }), ranks: { bm25: 1, vector: 1, hybrid: 1 }, parentById, bounds })
  assert.ok(scored.bonus <= bounds.maximumBonus)
  assert.ok(scored.penalty <= bounds.maximumConflictPenalty)
}

for (const forbidden of ['acceptedTargetIds', 'acceptedParentIds', 'expectedSourceId', 'goldClassifications', 'splitLabel', 'oracleResults']) {
  assert.throws(() => assertNoEvaluationLeakage({ runtime: { [forbidden]: ['secret'] } }), /Gold leakage/)
}
assert.equal(assertNoEvaluationLeakage({ query: 'safe', union: [{ doc: { childId: 'safe' }, ranks: { hybrid: 1 } }] }), true)

const tieDocs = [doc('z'), doc('a')]
const tieUnion = tieDocs.map(item => ({ doc: item, ranks: { bm25: 1, vector: 1, hybrid: 1 }, scores: { bm25: 1, vector: 1, hybrid: 1 }, origins: ['bm25','hybrid','vector'] }))
const first = rerankDeepUnion({ query: 'requirement', union: tieUnion, parentById: new Map(), bounds }).ranked.map(item => item.doc.childId)
const second = rerankDeepUnion({ query: 'requirement', union: tieUnion, parentById: new Map(), bounds }).ranked.map(item => item.doc.childId)
assert.deepEqual(first, second)
assert.deepEqual(first, ['a', 'z'])

console.log('Section structural reranker synthetic tests passed: union, identifiers, confidence, bounded scoring, sibling discrimination, leakage, and deterministic ties.')
