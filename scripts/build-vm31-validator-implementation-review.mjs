import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const reviewRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm31-validator-implementation-review')
const liveSourceRelativePath = 'scripts/validate-vm31-current-manual.mjs'
const snapshotRelativePath = 'data/processed/review_packages/vm31-validator-implementation-review/validate-vm31-current-manual.mjs'
const regressionSourceRelativePath = 'scripts/test-vm31-relationship-label-normalization.mjs'
const regressionArtifactRelativePath = 'data/processed/review_packages/vm31-validator-implementation-review/relationship-label-normalization-regression.json'
const manifestPath = path.join(reviewRoot, 'manifest.json')
const snapshotPath = path.join(reviewRoot, 'validate-vm31-current-manual.mjs')
const regressionArtifactPath = path.join(reviewRoot, 'relationship-label-normalization-regression.json')
const sourcePackagePath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources', 'vm31-current-manual.json')
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))

const canonicalArtifactBaselines = [
  ['data/processed/source_indexes/sources/vm31-current-manual.json', 'bb1d16707693390c837121c432757300624f92f8ddb2a374fd12d04ab2f3406b'],
  ['data/processed/relationship_registries/vm31-current-manual-relationship-candidates.json', 'abc3f6cfa6bc792a50569e28758039b60e902e9400201f7207b813b890df103d'],
  ['data/processed/review_packages/vm31-focused-retrieval-evaluation.json', '0bcfe4da9bbe99111e11e656869f9ee64e362de46ef1eb7d6c87cc679df7df5c'],
  ['data/processed/review_packages/vm31-source-qa.json', '9dea317a8ee85a0d0bf78d5542cace887f17eee1dbf3cdb85c826f4b88eeb2f7'],
  ['data/processed/review_packages/vm31-canonical-coverage-review-package.json', '63ff36dd08b24b20edebda2a47d7190408ffc983a42742f7de1318c7715a336a'],
  ['data/processed/review_packages/vm31-support-gate-regression.json', '02170a656f06c7354eda634d2d86eeff36ab9f23eff193023b2088c54695613d'],
  ['data/processed/review_packages/vm31-validation-report.json', 'a35c181edae4c59352869468671c1deeb58f846d30c1135b2fd0736a0b2bcae4'],
].map(([artifactPath, expectedSha256]) => ({ artifactPath, expectedSha256 }))

const main = async () => {
  const sourcePackage = await readJson(sourcePackagePath)
  if (sourcePackage.processing?.promotionStatus === 'promoted') throw new Error('The independently approved VM-31 validator evidence package is immutable after canonical promotion; validate the retained snapshot instead of rebuilding it.')
  const liveSourcePath = path.join(repoRoot, ...liveSourceRelativePath.split('/'))
  const regressionSourcePath = path.join(repoRoot, ...regressionSourceRelativePath.split('/'))
  const [liveBytes, regressionSourceBytes, regressionArtifact] = await Promise.all([
    fs.readFile(liveSourcePath),
    fs.readFile(regressionSourcePath),
    readJson(regressionArtifactPath),
  ])
  if (regressionArtifact.status !== 'pass') throw new Error('VM-31 relationship-label regression must pass before packaging validator evidence.')
  await fs.mkdir(reviewRoot, { recursive: true })
  await fs.writeFile(snapshotPath, liveBytes)
  const snapshotBytes = await fs.readFile(snapshotPath)
  const liveSource = liveBytes.toString('utf8')
  const lines = liveSource.split(/\r?\n/)
  const normalizerLine = lines.findIndex((line) => line.includes('const normalizeSourceLabel =')) + 1
  const assertionLine = lines.findIndex((line) => line.includes('normalizeSourceLabel(sourceChunk.sourceTextExcerpt).includes(normalizeSourceLabel(candidate.targetLabel))')) + 1
  if (normalizerLine === 0 || assertionLine === 0) throw new Error('VM-31 relationship-label implementation line locations could not be identified.')
  const liveSourceSha256 = sha256(liveBytes)
  const snapshotSha256 = sha256(snapshotBytes)
  const regressionArtifactBytes = await fs.readFile(regressionArtifactPath)
  const manifest = {
    schemaVersion: '1.0',
    artifactType: 'implementation_source_snapshot_manifest',
    artifactPurpose: 'narrow_independent_vm31_validator_code_review',
    generatedAt: '2026-08-28T00:00:00.000Z',
    reviewFindingAddressed: 'Provide independently inspectable, byte-exact production validator evidence for the transparent explicit-source relationship-label check.',
    liveSourcePath: liveSourceRelativePath,
    liveSourceFullWindowsPath: 'C:\\Users\\David\\OneDrive\\Documents\\Document Processor\\scripts\\validate-vm31-current-manual.mjs',
    snapshotPath: snapshotRelativePath,
    snapshotFullWindowsPath: 'C:\\Users\\David\\OneDrive\\Documents\\Document Processor\\data\\processed\\review_packages\\vm31-validator-implementation-review\\validate-vm31-current-manual.mjs',
    liveSourceSha256,
    snapshotSha256,
    liveByteLength: liveBytes.length,
    snapshotByteLength: snapshotBytes.length,
    byteIdentical: liveBytes.equals(snapshotBytes),
    equalityResult: liveBytes.equals(snapshotBytes) ? 'equal' : 'mismatch',
    implementationLocations: {
      transparentNormalizer: { identifier: 'normalizeSourceLabel', line: normalizerLine, rule: "lowercase, then remove characters outside a-z and 0-9" },
      directSourceFacingAssertion: { line: assertionLine, retainedSourceInput: 'sourceChunk.sourceTextExcerpt', sourceFacingLabelInput: 'candidate.targetLabel' },
    },
    matchingBoundary: {
      permittedNormalization: ['case', 'punctuation', 'spacing'],
      inputsUsed: ['retained sourceTextExcerpt', 'source-facing targetLabel'],
      inputsNotUsed: ['targetId', 'canonicalTargetLabel', 'alias registry', 'semantic similarity', 'fuzzy entity equivalence', 'acronym expansion', 'curated synonyms'],
    },
    regression: {
      sourcePath: regressionSourceRelativePath,
      sourceSha256: sha256(regressionSourceBytes),
      artifactPath: regressionArtifactRelativePath,
      artifactSha256: sha256(regressionArtifactBytes),
      status: regressionArtifact.status,
      caseCount: regressionArtifact.caseCount,
      passedCaseCount: regressionArtifact.passedCaseCount,
    },
    canonicalArtifactBaselines,
    expectedCanonicalArtifactChangeCount: 0,
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false, canonicalSourceEvidence: false, corpusModifiedByPackage: false },
  }
  if (!manifest.byteIdentical || liveSourceSha256 !== snapshotSha256) throw new Error('VM-31 validator snapshot is not byte-identical to the live source.')
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  await fs.writeFile(path.join(reviewRoot, 'README.md'), `${[
    '# VM-31 validator implementation review snapshot', '',
    'This directory contains a byte-exact snapshot of the live VM-31 validator and focused evidence for the explicit-source relationship-label boundary.', '',
    `- Live source: \`${liveSourceRelativePath}\``,
    `- Snapshot: \`${snapshotRelativePath}\``,
    `- SHA-256: \`${liveSourceSha256}\``,
    `- Byte length: ${liveBytes.length}`,
    '- Byte equality: **PASS**',
    `- Focused regression: \`${regressionArtifactRelativePath}\` (${regressionArtifact.passedCaseCount}/${regressionArtifact.caseCount} passed)`, '',
    'The snapshot is review evidence, not a second production implementation. Run `npm run vm31:validator-evidence:validate` to recalculate both hashes and lengths and compare the byte streams.', '',
  ].join('\n')}`, 'utf8')
  await fs.writeFile(path.join(reviewRoot, 'independent-review-prompt.md'), `${[
    '# Narrow code-review prompt: VM-31 validator implementation evidence', '',
    'Please review only the VM-31 validator implementation-evidence package. Do not modify or promote the corpus and do not repeat the accepted source, retrieval, or metadata audits unless this evidence contradicts them.', '',
    '## Files', '',
    '- Manifest: `data/processed/review_packages/vm31-validator-implementation-review/manifest.json`',
    '- Byte-exact snapshot: `data/processed/review_packages/vm31-validator-implementation-review/validate-vm31-current-manual.mjs`',
    '- Focused regression artifact: `data/processed/review_packages/vm31-validator-implementation-review/relationship-label-normalization-regression.json`',
    '- Focused regression source: `scripts/test-vm31-relationship-label-normalization.mjs`',
    '- Evidence validator: `scripts/validate-vm31-validator-implementation-review.mjs`', '',
    '## Review scope', '',
    '1. Recalculate the live validator and snapshot byte lengths and SHA-256 values; confirm direct byte equality and manifest consistency.',
    '2. Inspect `normalizeSourceLabel` and confirm it only lowercases and removes punctuation/spacing through non-alphanumeric removal.',
    '3. Confirm the explicit-source assertion compares retained `sourceTextExcerpt` directly with source-facing `candidate.targetLabel`.',
    '4. Confirm target IDs, canonical expanded labels, aliases, semantic similarity, fuzzy equivalence, acronym expansion, and curated synonyms cannot independently satisfy that assertion.',
    '5. Confirm the generic regression passes `AG 43` against source `AG 43`, rejects `Actuarial Guideline XLIII` against source containing only `AG 43`, and permits a separate canonical label without using it as match evidence.',
    '6. Confirm the current 92/92 relationship-label validation still passes and the evidence package changed zero VM-31 canonical artifacts.',
    '7. Confirm VM-31 remains review-only and unpromoted.', '',
    'End with exactly one disposition:', '',
    '- APPROVE FOR CANONICAL PROMOTION',
    '- APPROVE WITH FIXES',
    '- DO NOT PROMOTE', '',
  ].join('\n')}`, 'utf8')
  console.log(`Packaged byte-identical VM-31 validator evidence: ${liveSourceSha256} (${liveBytes.length} bytes).`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
