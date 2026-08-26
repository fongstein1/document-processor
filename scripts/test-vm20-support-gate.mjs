import assert from 'node:assert/strict'
import { assessEvidenceSufficiency } from './evidence-sufficiency.mjs'

const chunk = {
  chunkId: 'fixture-chunk-001',
  sourceId: 'fixture-source',
  chunkKind: 'source_excerpt',
  chunkLevel: 'child',
  sourceTextExcerpt: 'Methodology prose explains the general treatment but does not contain structured rows.',
  topic: 'General methodology',
  sectionReference: 'General methodology',
}

const packageFixture = (overrides = {}) => ({
  sourceId: 'fixture-source',
  sourceStatus: 'active',
  sourceEditionId: 'FIXTURE-2026',
  jurisdiction: 'NAIC',
  notes: 'General prose only.',
  coverageDeclarations: {
    scopeType: 'general_prose',
    structuredDataAvailable: false,
    deferredInformationTypes: [],
    knownGaps: [],
  },
  ...overrides,
})

const run = (query, source = packageFixture(), chunks = [chunk]) => {
  const request = typeof query === 'string' ? { query } : query
  return assessEvidenceSufficiency({
  query: { queryId: 'fixture-query', ...request },
  topMatches: [{ chunkId: chunks[0].chunkId, sourceId: chunks[0].sourceId, score: 20, authorityLevel: 'manual_section' }],
  chunkRecords: chunks,
  sourcePackages: [source],
  })
}

const tableDecision = run({
  query: 'What exact current table rows and version metadata are available?',
  supportRequirements: { informationTypes: ['structured_table_rows', 'current_version_metadata'], exact: true, current: true },
}, packageFixture({
  coverageDeclarations: {
    scopeType: 'prose_methodology',
    structuredDataAvailable: false,
    deferredInformationTypes: ['structured_table_rows', 'current_table_values', 'table_version_metadata'],
    knownGaps: ['Structured table rows and version metadata are deferred.'],
  },
}))
assert.equal(tableDecision.supportState, 'unsupported')
assert.equal(tableDecision.reasonCode, 'missing_structured_data')
assert.equal(tableDecision.relatedEvidence.length, 1)

const jurisdictionDecision = run('What New York jurisdiction-specific requirement applies?', packageFixture())
assert.equal(jurisdictionDecision.supportState, 'unsupported')
assert.equal(jurisdictionDecision.reasonCode, 'missing_requested_jurisdiction')

const versionDecision = run('What is the current version metadata?', packageFixture({ sourceStatus: 'historical', sourceEditionId: 'FIXTURE-2020' }))
assert.equal(versionDecision.supportState, 'unsupported')
assert.equal(versionDecision.reasonCode, 'missing_current_version_metadata')

const productDecision = run('What product-specific indexed universal life assumption applies?', packageFixture())
assert.equal(productDecision.supportState, 'unsupported')
assert.equal(productDecision.reasonCode, 'missing_product_specific_scope')

const proseDecision = run('What general methodology does this source describe?')
assert.equal(proseDecision.supportState, 'supported')
assert.equal(proseDecision.evidenceSufficient, true)

console.log('Passed generic evidence-sufficiency support-gate fixtures (5 cases).')
