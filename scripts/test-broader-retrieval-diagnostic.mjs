import assert from 'node:assert/strict'
import { classifyPrimaryStage, reachability } from './broader-retrieval-diagnostic.mjs'

const accepted = new Set(['accepted']), parents = new Set(['right-parent'])
assert.equal(classifyPrimaryStage({ hybrid: [{ childId: 'accepted', parentId: 'right-parent', sourceId: 'source' }], sourceId: 'source', acceptedParents: parents, acceptedIds: accepted }), 'SUCCESS')
assert.equal(classifyPrimaryStage({ hybrid: [{ childId: 'wrong', parentId: 'wrong-parent', sourceId: 'other' }], sourceId: 'source', acceptedParents: parents, acceptedIds: accepted }), 'SOURCE_MISS')
assert.equal(classifyPrimaryStage({ hybrid: [{ childId: 'wrong', parentId: 'wrong-parent', sourceId: 'source' }], sourceId: 'source', acceptedParents: parents, acceptedIds: accepted }), 'RIGHT_SOURCE_WRONG_PARENT')
assert.equal(classifyPrimaryStage({ hybrid: [{ childId: 'wrong', parentId: 'right-parent', sourceId: 'source' }], sourceId: 'source', acceptedParents: parents, acceptedIds: accepted }), 'RIGHT_PARENT_WRONG_CHILD')
assert.deepEqual(reachability([1, 3, 11, null], [1, 3, 10]), { top1: .25, top3: .5, top10: .5, notMeaningfullyRetrieved: .25 })
console.log('broader retrieval diagnostic stage and reachability fixtures: PASS')
