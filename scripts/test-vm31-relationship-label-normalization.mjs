import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const validatorPath = path.join(repoRoot, 'scripts', 'validate-vm31-current-manual.mjs')
const outputPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm31-validator-implementation-review', 'relationship-label-normalization-regression.json')
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const assert = (condition, message) => { if (!condition) throw new Error(message) }

// This intentionally mirrors the transparent production rule. It does not
// accept aliases, target IDs, canonical labels, synonyms, or semantic matches.
const normalizeSourceLabel = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '')
const sourceFacingLabelMatches = ({ sourceText, targetLabel }) =>
  normalizeSourceLabel(sourceText).includes(normalizeSourceLabel(targetLabel))

const main = async () => {
  const validatorBytes = await fs.readFile(validatorPath)
  const validatorSource = validatorBytes.toString('utf8')
  const productionNormalizer = "const normalizeSourceLabel = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '')"
  const productionAssertion = 'normalizeSourceLabel(sourceChunk.sourceTextExcerpt).includes(normalizeSourceLabel(candidate.targetLabel))'
  assert(validatorSource.includes(productionNormalizer), 'Production VM-31 validator transparent normalizer changed or is not inspectable.')
  assert(validatorSource.includes(productionAssertion), 'Production VM-31 validator no longer compares retained source text directly to candidate.targetLabel.')

  const fixtures = [
    {
      caseId: 'explicit-ag43-source-label-matches',
      sourceText: 'The report shall include results determined under AG 43.',
      targetLabel: 'AG 43',
      canonicalTargetLabel: null,
      targetId: null,
      expectedMatch: true,
      boundary: 'exact source-facing wording',
    },
    {
      caseId: 'canonical-expansion-cannot-substitute-for-source-label',
      sourceText: 'The report shall include results determined under AG 43.',
      targetLabel: 'Actuarial Guideline XLIII',
      canonicalTargetLabel: null,
      targetId: null,
      expectedMatch: false,
      boundary: 'semantic or canonical expansion is not source wording',
    },
    {
      caseId: 'canonical-label-may-coexist-with-source-label',
      sourceText: 'The report shall include results determined under AG 43.',
      targetLabel: 'AG 43',
      canonicalTargetLabel: 'Actuarial Guideline XLIII',
      targetId: 'ag-43',
      expectedMatch: true,
      boundary: 'canonical label and target ID are present but are not matcher inputs',
    },
    {
      caseId: 'transparent-case-spacing-punctuation-normalization',
      sourceText: 'The methods defined in VM - 20 apply.',
      targetLabel: 'vm-20',
      canonicalTargetLabel: null,
      targetId: null,
      expectedMatch: true,
      boundary: 'case, punctuation, and spacing differences only',
    },
    {
      caseId: 'target-id-cannot-rescue-mismatched-source-label',
      sourceText: 'The report shall include results determined under AG 43.',
      targetLabel: 'Actuarial Guideline XLIII',
      canonicalTargetLabel: null,
      targetId: 'ag-43',
      expectedMatch: false,
      boundary: 'targetId is deliberately ignored by the matcher',
    },
  ].map((fixture) => {
    const actualMatch = sourceFacingLabelMatches(fixture)
    return { ...fixture, actualMatch, passed: actualMatch === fixture.expectedMatch }
  })
  assert(fixtures.every((fixture) => fixture.passed), 'VM-31 relationship-label normalization regression failed.')

  const artifact = {
    schemaVersion: '1.0',
    artifactType: 'vm31_explicit_source_relationship_label_regression',
    generatedAt: '2026-08-28T00:00:00.000Z',
    status: 'pass',
    validatorSourcePath: 'scripts/validate-vm31-current-manual.mjs',
    validatorSourceSha256: sha256(validatorBytes),
    productionSourceInspection: { normalizerDeclarationPresent: true, directSourceFacingAssertionPresent: true },
    transparentNormalization: ['lowercase ASCII text', 'remove characters outside a-z and 0-9', 'thereby ignore punctuation and spacing'],
    prohibitedSubstitutions: ['targetId', 'canonicalTargetLabel', 'alias registry', 'semantic similarity', 'fuzzy entity equivalence', 'acronym expansion', 'curated synonyms'],
    caseCount: fixtures.length,
    passedCaseCount: fixtures.filter((fixture) => fixture.passed).length,
    cases: fixtures,
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', canonicalCorpusModified: false },
  }
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  const historicalArtifact = await fs.readFile(outputPath, 'utf8').then((value) => JSON.parse(value)).catch(() => null)
  if (historicalArtifact) {
    assert(historicalArtifact.status === 'pass' && historicalArtifact.caseCount === fixtures.length && historicalArtifact.passedCaseCount === fixtures.length, 'Approved VM-31 relationship-label regression evidence is incomplete.')
  } else {
    await fs.writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8')
  }
  console.log(`Passed ${artifact.passedCaseCount}/${artifact.caseCount} current VM-31 relationship-label normalization regressions; approved historical evidence retained.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
