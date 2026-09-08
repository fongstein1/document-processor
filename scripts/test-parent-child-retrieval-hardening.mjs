import assert from 'node:assert/strict'
import { makeIndex, rankWithIndex, regulatoryTokens, reciprocalRank, orderChildren, classifyQueryNeed } from './parent-child-retrieval-hardening.mjs'

const config = { k1: 1.2, b: 0.75, fieldWeights: { body: 1, section: 2, identifier: 4, parentHeading: 1.5, sourceTitle: 0.35, header: 1.5 } }
const docs = [
  { childId: 'a', parentId: 'pa', sourceId: 's1', sourceSha256: 'sha1', body: 'VM-20 Table F current benchmark spreads', section: 'Table F', identifier: 'VM-20', parentHeading: 'Current spreads', sourceTitle: 'Valuation', header: 'WAL' },
  { childId: 'b', parentId: 'pb', sourceId: 's2', sourceSha256: 'sha2', body: 'annual statement reporting instructions and schedule', section: 'Schedule Y', identifier: 'Schedule Y', parentHeading: 'Reporting', sourceTitle: 'Annual blank', header: '' }
]
const parents = new Map([
  ['pa', { parentId: 'pa', structuralIdentifier: 'VM-20', structuralLabel: 'Current spreads' }],
  ['pb', { parentId: 'pb', structuralIdentifier: 'Schedule Y', structuralLabel: 'Reporting' }]
])
const index = makeIndex(docs, Object.keys(config.fieldWeights), config)
const ranked = rankWithIndex('VM20 Table F current spreads', docs, index, null, parents, 'baseline')
assert.equal(ranked[0].doc.childId, 'a', 'BM25/identifier retrieval should select the matching child')
assert.deepEqual(regulatoryTokens('VM20 SSAP51R Table F'), ['vm-20', 'ssap-51r', 'table f'])
assert.equal(reciprocalRank(1), 1)
assert.equal(reciprocalRank(2), 0.5)
assert.equal(reciprocalRank(null), 0)
const ordered = orderChildren([{ childId: 'next', pageStart: 3 }, { childId: 'prev', pageStart: 1 }, { childId: 'middle', pageStart: 2 }])
assert.deepEqual(ordered.map((x) => x.childId), ['prev', 'middle', 'next'], 'adjacency follows source coordinates')
assert.equal(classifyQueryNeed('what is the scope of this section'), 'SCOPE_CONTEXT')
assert.equal(classifyQueryNeed('which table range contains the value'), 'TABLE_HEADER_CONTEXT')
const expectationFree = rankWithIndex('VM20 Table F current spreads', docs.map((d) => ({ ...d, expectedSourceId: 's2', expectedChildId: 'b', requiredEvidenceIds: ['b'] })), makeIndex(docs.map((d) => ({ ...d, expectedSourceId: 's2', expectedChildId: 'b', requiredEvidenceIds: ['b'] })), Object.keys(config.fieldWeights), config), null, parents, 'baseline')
assert.deepEqual(ranked.map((x) => x.doc.childId), expectationFree.map((x) => x.doc.childId), 'evaluation expectation metadata cannot affect ranking')
console.log('parent-child retrieval hardening tests: PASS')
