import { evaluateQueries } from './evaluate-source-index-retrieval.mjs'

const sourcePackage = {
  sourceId: 'fixture-source',
  sourceFamilyId: 'fixture-family',
  authorityLevel: 'primary',
  sourceTitle: 'Fixture Manual',
  coverageDeclarations: { structuredDataAvailable: false },
}

const parentText = 'Alpha method requires deterministic reserve treatment. This parent retains surrounding section context.'
const childText = 'Alpha method requires deterministic reserve treatment.'
const chunkRecords = [
  {
    chunkId: 'fixture-parent', sourceId: 'fixture-source', sourceFamilyId: 'fixture-family', authorityLevel: 'primary',
    chunkLevel: 'parent', sourceTextExcerpt: parentText, summary: 'Alpha method', topic: 'alpha method',
    headingPath: 'Section 1', citations: [{ locator: 'p. 1' }], retrievalEligible: true,
    childChunkIds: ['fixture-child'],
  },
  {
    chunkId: 'fixture-child', sourceId: 'fixture-source', sourceFamilyId: 'fixture-family', authorityLevel: 'primary',
    chunkLevel: 'child', parentChunkId: 'fixture-parent', sourceTextExcerpt: childText, summary: 'Alpha method', topic: 'alpha method',
    headingPath: 'Section 1 > Method', citations: [{ locator: 'p. 1' }], retrievalEligible: true,
  },
]

const result = evaluateQueries({
  queries: [{
    queryId: 'fixture-alpha-method',
    query: 'alpha method deterministic reserve treatment',
    queryCategory: 'fixture',
    expectedChunkIds: ['fixture-child'],
    expectedSourceIds: ['fixture-source'],
    expectedOutcome: 'supported',
  }],
  chunkRecords,
  sourcePackages: [sourcePackage],
  topN: 2,
})

const queryResult = result.queries[0]
if (result.deduplication.rawTopKCollisionCount !== 1) throw new Error('Expected one raw parent-child collision in the fixture top-k.')
if (result.deduplication.postDeduplicationCollisionCount !== 0) throw new Error('Expected zero post-deduplication parent-child collisions.')
if (queryResult.rankedMatches.some((match) => ['fixture-parent', 'fixture-child'].every((chunkId) => queryResult.rankedMatches.some((candidate) => candidate.chunkId === chunkId)))) {
  throw new Error('Equivalent parent and child both remained in the deduplicated top-k.')
}
if (!chunkRecords.some((chunk) => chunk.chunkId === 'fixture-parent' && chunk.childChunkIds?.includes('fixture-child'))) {
  throw new Error('Fixture hierarchy was not retained for parent context expansion.')
}

console.log('Passed generic equivalent parent-child retrieval dedup fixture.')
