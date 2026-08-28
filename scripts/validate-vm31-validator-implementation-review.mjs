import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const reviewRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm31-validator-implementation-review')
const manifestPath = path.join(reviewRoot, 'manifest.json')
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const resolveRelative = (relativePath) => path.join(repoRoot, ...relativePath.split('/'))
const normalizeSourceLabel = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '')

const expectedCanonicalArtifactBaselines = new Map([
  ['data/processed/source_indexes/sources/vm31-current-manual.json', 'bb1d16707693390c837121c432757300624f92f8ddb2a374fd12d04ab2f3406b'],
  ['data/processed/relationship_registries/vm31-current-manual-relationship-candidates.json', 'abc3f6cfa6bc792a50569e28758039b60e902e9400201f7207b813b890df103d'],
  ['data/processed/review_packages/vm31-focused-retrieval-evaluation.json', '0bcfe4da9bbe99111e11e656869f9ee64e362de46ef1eb7d6c87cc679df7df5c'],
  ['data/processed/review_packages/vm31-source-qa.json', '9dea317a8ee85a0d0bf78d5542cace887f17eee1dbf3cdb85c826f4b88eeb2f7'],
  ['data/processed/review_packages/vm31-canonical-coverage-review-package.json', '63ff36dd08b24b20edebda2a47d7190408ffc983a42742f7de1318c7715a336a'],
  ['data/processed/review_packages/vm31-support-gate-regression.json', '02170a656f06c7354eda634d2d86eeff36ab9f23eff193023b2088c54695613d'],
  ['data/processed/review_packages/vm31-validation-report.json', 'a35c181edae4c59352869468671c1deeb58f846d30c1135b2fd0736a0b2bcae4'],
])

const main = async () => {
  const manifest = await readJson(manifestPath)
  const [liveBytes, snapshotBytes, regressionSourceBytes, regressionArtifactBytes] = await Promise.all([
    fs.readFile(resolveRelative(manifest.liveSourcePath)),
    fs.readFile(resolveRelative(manifest.snapshotPath)),
    fs.readFile(resolveRelative(manifest.regression.sourcePath)),
    fs.readFile(resolveRelative(manifest.regression.artifactPath)),
  ])
  const liveSha256 = sha256(liveBytes)
  const snapshotSha256 = sha256(snapshotBytes)
  assert(liveBytes.equals(snapshotBytes), 'VM-31 validator live source and review snapshot bytes differ.')
  assert(liveSha256 === snapshotSha256 && liveSha256 === manifest.liveSourceSha256 && snapshotSha256 === manifest.snapshotSha256, 'VM-31 validator live/snapshot SHA-256 or manifest value differs.')
  assert(liveBytes.length === snapshotBytes.length && liveBytes.length === manifest.liveByteLength && snapshotBytes.length === manifest.snapshotByteLength, 'VM-31 validator live/snapshot byte length or manifest value differs.')
  assert(manifest.byteIdentical === true && manifest.equalityResult === 'equal', 'VM-31 validator manifest does not record byte equality.')

  const liveSource = liveBytes.toString('utf8')
  const lines = liveSource.split(/\r?\n/)
  const normalizerLine = lines.findIndex((line) => line.includes('const normalizeSourceLabel =')) + 1
  const assertionLine = lines.findIndex((line) => line.includes('normalizeSourceLabel(sourceChunk.sourceTextExcerpt).includes(normalizeSourceLabel(candidate.targetLabel))')) + 1
  assert(normalizerLine === manifest.implementationLocations.transparentNormalizer.line && assertionLine === manifest.implementationLocations.directSourceFacingAssertion.line, 'VM-31 validator implementation line locations differ from the manifest.')
  assert(manifest.matchingBoundary.inputsNotUsed.length === 7 && manifest.matchingBoundary.inputsUsed.length === 2, 'VM-31 validator matching-boundary manifest is incomplete.')

  const regressionArtifact = JSON.parse(regressionArtifactBytes.toString('utf8'))
  assert(sha256(regressionSourceBytes) === manifest.regression.sourceSha256 && sha256(regressionArtifactBytes) === manifest.regression.artifactSha256, 'VM-31 relationship-label regression source/artifact hash differs from the manifest.')
  assert(regressionArtifact.status === 'pass' && regressionArtifact.caseCount === manifest.regression.caseCount && regressionArtifact.passedCaseCount === regressionArtifact.caseCount, 'VM-31 relationship-label regression is incomplete or failed.')

  const [sourcePackage, relationships, validationReport] = await Promise.all([
    readJson(resolveRelative('data/processed/source_indexes/sources/vm31-current-manual.json')),
    readJson(resolveRelative('data/processed/relationship_registries/vm31-current-manual-relationship-candidates.json')),
    readJson(resolveRelative('data/processed/review_packages/vm31-validation-report.json')),
  ])
  const chunkById = new Map(sourcePackage.chunks.map((chunk) => [chunk.chunkId, chunk]))
  assert(relationships.relationshipCount === 92 && relationships.candidates.length === 92, 'VM-31 relationship count changed during validator evidence packaging.')
  for (const candidate of relationships.candidates) {
    const sourceChunk = chunkById.get(candidate.sourceChunkId)
    assert(sourceChunk && normalizeSourceLabel(sourceChunk.sourceTextExcerpt).includes(normalizeSourceLabel(candidate.targetLabel)), `VM-31 source-facing relationship label failed evidence-package validation: ${candidate.relationshipId}.`)
  }
  const ag43Relationships = relationships.candidates.filter((candidate) => candidate.targetId === 'ag-43')
  assert(ag43Relationships.length === 2 && ag43Relationships.every((candidate) => candidate.targetLabel === 'AG 43' && candidate.canonicalTargetLabel === 'Actuarial Guideline XLIII'), 'VM-31 AG 43 source/canonical labels changed during validator evidence packaging.')
  assert(validationReport.checks.sourceFaithfulRelationshipLabels === 92 && validationReport.checks.ag43SourceLabelCorrections === 2, 'Current VM-31 validation report does not record 92/92 source labels and two AG 43 corrections.')
  assert(sourcePackage.processing.reviewOnly === true && sourcePackage.processing.promotionStatus === 'not_promoted' && sourcePackage.chunks.every((chunk) => chunk.promotionEligible === false), 'VM-31 governance changed during validator evidence packaging.')

  assert(manifest.canonicalArtifactBaselines.length === expectedCanonicalArtifactBaselines.size, 'VM-31 canonical artifact baseline count differs from the evidence validator.')
  let canonicalArtifactChangeCount = 0
  for (const baseline of manifest.canonicalArtifactBaselines) {
    const expectedSha256 = expectedCanonicalArtifactBaselines.get(baseline.artifactPath)
    assert(expectedSha256 && expectedSha256 === baseline.expectedSha256, `Unexpected VM-31 canonical artifact baseline: ${baseline.artifactPath}.`)
    const actualSha256 = sha256(await fs.readFile(resolveRelative(baseline.artifactPath)))
    if (actualSha256 !== expectedSha256) canonicalArtifactChangeCount += 1
  }
  assert(canonicalArtifactChangeCount === 0 && manifest.expectedCanonicalArtifactChangeCount === 0, `VM-31 canonical artifact change count must be zero; found ${canonicalArtifactChangeCount}.`)
  assert(manifest.governance.reviewOnly === true && manifest.governance.promotionStatus === 'not_promoted' && manifest.governance.promotionEligible === false && manifest.governance.corpusModifiedByPackage === false, 'VM-31 validator evidence-package governance is incorrect.')

  console.log(`Validated byte-identical VM-31 validator evidence: ${liveSha256} (${liveBytes.length} bytes).`)
  console.log(`Validated ${relationships.relationshipCount}/${relationships.relationshipCount} source-facing relationship labels and ${regressionArtifact.passedCaseCount}/${regressionArtifact.caseCount} focused regression cases.`)
  console.log(`VM-31 canonical artifact changes: ${canonicalArtifactChangeCount}.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
