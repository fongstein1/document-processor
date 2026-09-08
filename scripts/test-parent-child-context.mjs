import fs from 'node:fs/promises'
import path from 'node:path'
import { publicOutputRoot, externalProcessingRoot, buildArchitecture, detectPdfStructure, retrieveChildren } from './parent-child-context-architecture.mjs'
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
