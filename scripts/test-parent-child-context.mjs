import fs from 'node:fs/promises'
import path from 'node:path'
import { publicOutputRoot, externalProcessingRoot, buildArchitecture, detectPdfStructure, retrieveChildren, expandContext, scoreBaseline, reciprocalRank, computeContextMetrics, orderChildren } from './parent-child-context-architecture.mjs'
import { validateGitSafeArtifact, sha256Bytes } from './rights-storage.mjs'

const publicNames = [
  'architecture-manifest.json',
  'parent-manifest.json',
  'child-manifest.json',
  'context-expansion-manifest.json',
  'evidence-packages.json',
  'baseline-comparison.json',
  'external-artifact-manifest.json',
  'architecture-source-records.json'
]
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const snapshot = async () => {
  const paths = publicNames.map((name) => path.join(publicOutputRoot, name))
  const manifest = JSON.parse(await fs.readFile(path.join(publicOutputRoot, 'external-artifact-manifest.json'), 'utf8'))
  paths.push(...(manifest.artifacts || []).map((artifact) => artifact.externalPath))
  const result = new Map()
  for (const filePath of paths) result.set(filePath, sha256Bytes(await fs.readFile(filePath)))
  return result
}
const expectRightsFailure = (value, label) => {
  let failed = false
  try { validateGitSafeArtifact({ artifactType: label, value }) } catch { failed = true }
  assert(failed, 'Rights fixture unexpectedly passed: ' + label)
}

const main = async () => {
  assert(detectPdfStructure('SSAP 1. Deterministic heading')?.parentType === 'ssap', 'PDF marker detection failed.')
  assert(detectPdfStructure('ordinary prose') === null, 'PDF detector invented structure.')
  assert(scoreBaseline('statutory requirement', { normalizedSearchText: 'statutory requirement' }) === 2, 'Baseline retrieval did not use normalized retrieval text.')
  assert(reciprocalRank(1) === 1 && reciprocalRank(2) === 0.5 && reciprocalRank(null) === 0, 'Target-rank reciprocal-rank fixture failed.')
  const safe = { schemaVersion: '1.0', parentId: 'p-1', childId: 'c-1', sourceId: 'source-1', sourceSha256: 'a'.repeat(64), pageStart: 1, pageEnd: 2, sheetName: 'Sheet1', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 1, rowEnd: 3, cellRefs: ['A1:B3'], childIds: ['c-1'], reviewFlags: ['REVIEW_ONLY'], authoritySupportRole: 'current support', exceptionCode: 'NONE', expectedStoredValue: 46023, expectedFormula: null, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
  validateGitSafeArtifact({ artifactType: 'positive-parent-child-evidence', value: safe })
  expectRightsFailure({ ...safe, extensions: { duplicateLabelValues: ['Age', '0.9975'] } }, 'negative-duplicate-label-values')
  expectRightsFailure({ ...safe, extensions: { tableBlock: { titleCandidates: ['Amendments adopted for the 2026 Valuation Manual'] } } }, 'negative-title-candidates')
  expectRightsFailure({ ...safe, extensions: { arbitrarySourceMetadata: { prose: 'substantive source-derived instructions' } } }, 'negative-unexpected-nested-content')
  expectRightsFailure({ ...safe, sourceTextExcerpt: 'source-derived text' }, 'negative-parent-child-source-text')
  const children = [
    { childId: 'c-1', parentId: 'p-1', sourceId: 'source-1', sourceSha256: 'a'.repeat(64), authoritySupportRole: 'current support', sectionReference: 'Section 1', citation: { pageReference: '1' }, searchText: 'scope requirement' },
    { childId: 'c-2', parentId: 'p-1', sourceId: 'source-1', sourceSha256: 'a'.repeat(64), authoritySupportRole: 'current support', sectionReference: 'Section 1', citation: { pageReference: '2' }, searchText: 'scope exception requirement' },
    { childId: 'c-3', parentId: 'p-2', sourceId: 'source-2', sourceSha256: 'b'.repeat(64), authoritySupportRole: 'current authority', sectionReference: 'Section 2', citation: { pageReference: '3' }, searchText: 'scope requirement' }
  ]
  const parents = new Map([
    ['p-1', { parentId: 'p-1', confidence: 'high' }],
    ['p-2', { parentId: 'p-2', confidence: 'high' }]
  ])
  const ranked = retrieveChildren('scope exception', children, parents)
  assert(ranked[0]?.child.childId === 'c-2', 'Child retrieval did not prefer the semantically matching child.')
  assert(ranked.every((item, index) => item.rank === index + 1), 'Child ranks are not deterministic.')
  const sourceOrdered = orderChildren([
    { childId: 'hash-z', pageStart: 3, pageEnd: 3, sourceChunkOrdinal: 3 },
    { childId: 'hash-a', pageStart: 1, pageEnd: 1, sourceChunkOrdinal: 1 },
    { childId: 'hash-m', pageStart: 2, pageEnd: 2, sourceChunkOrdinal: 2 }
  ])
  assert(sourceOrdered.map((child) => child.childId).join(',') === 'hash-a,hash-m,hash-z', 'Adjacency ordering used IDs instead of source coordinates.')
  const childrenByParent = new Map([['p-1', sourceOrdered.map((child) => ({ ...child, parentId: 'p-1', sourceId: 'source-1', sourceSha256: 'a'.repeat(64), searchText: 'scope', citation: { pageReference: String(child.pageStart) } }))]])
  const adjacency = expandContext({ child: childrenByParent.get('p-1')[1] }, [], childrenByParent, { includeParent: true, includePrevious: true, includeFollowing: true })
  assert(adjacency.precedingChild.childId === 'hash-a' && adjacency.followingChild.childId === 'hash-z', 'Previous/next adjacency is not source ordered.')
  const contextMetrics = computeContextMetrics(['required-1', 'required-2'], ['required-1', 'extra-1'])
  assert(contextMetrics.contextPrecision === 0.5 && contextMetrics.contextRecall === 0.5 && contextMetrics.irrelevantEvidenceCount === 1, 'Required-context precision/recall fixture failed.')
  const expectationNeutral = retrieveChildren('scope exception', children.map((child) => ({ ...child, expectedSourceId: 'source-2', expectedChildId: 'not-used', expectedRegion: 'not-used' })), parents)
  assert(JSON.stringify(expectationNeutral.map((item) => item.child.childId)) === JSON.stringify(ranked.map((item) => item.child.childId)), 'Evaluation expectation metadata leaked into ranking.')
  const first = await buildArchitecture()
  const firstSnapshot = await snapshot()
  const second = await buildArchitecture()
  const secondSnapshot = await snapshot()
  assert(first.architectureManifest.parentCount === second.architectureManifest.parentCount, 'Parent counts changed on deterministic rerun.')
  assert(first.architectureManifest.childCount === second.architectureManifest.childCount, 'Child counts changed on deterministic rerun.')
  assert(firstSnapshot.size === secondSnapshot.size, 'Artifact set changed on deterministic rerun.')
  for (const [filePath, digest] of firstSnapshot) assert(secondSnapshot.get(filePath) === digest, 'Deterministic artifact mismatch: ' + filePath)
  assert((await fs.readdir(externalProcessingRoot)).length >= 1, 'External architecture processing root is empty.')
  console.log(JSON.stringify({
    positiveRightsFixture: 'PASS',
    negativeRightsFixtures: 4,
    pdfStructureFixtures: 'PASS',
    childRetrievalFixture: 'PASS',
    deterministicRerun: 'PASS',
    artifactCount: firstSnapshot.size
  }, null, 2))
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1 })
