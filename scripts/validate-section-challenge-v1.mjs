import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')
const cfg = JSON.parse(await fs.readFile(path.join(repoRoot, 'config/section-challenge-v1.json'), 'utf8'))
const publicRoot = path.join(repoRoot, 'data/processed/review_packages', cfg.runId)
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const read = async name => JSON.parse(await fs.readFile(path.join(publicRoot, name), 'utf8'))

const evaluation = await read('evaluation-freeze.json')
const architecture = await read('architecture-freeze.json')
const development = await read('development-results.json')
const holdout = await read('holdout-results.json')
const manifest = await read('external-artifact-manifest.json')

assert.equal(evaluation.evaluationVersion, 'SECTION_CHALLENGE_V1')
assert.equal(evaluation.counts.supported, 48)
assert.equal(evaluation.counts.diagnostic, 6)
assert.equal(evaluation.counts.development, 28)
assert.equal(evaluation.counts.holdout, 20)
assert.deepEqual(evaluation.successThresholds, cfg.successThresholds)
assert.deepEqual(evaluation.damageBudget, cfg.damageBudget)
assert.equal(evaluation.goldCreatedBeforeRerankerImplementation, true)
assert.equal(evaluation.holdoutAccessProhibitedUntilArchitectureFreeze, true)

for (const item of architecture.implementationArtifacts) {
  assert.equal(sha(await fs.readFile(path.join(repoRoot, item.path))), item.sha256, `Frozen implementation changed: ${item.path}`)
}
assert.equal(architecture.developmentResultsSha256, sha(await fs.readFile(path.join(publicRoot, 'development-results.json'))))
assert.equal(architecture.holdoutAccessedBeforeFreeze, false)
assert.equal(architecture.rankingInputExcludesGold, true)
assert.equal(development.runtimeRankingInputExcludesGold, true)
assert.equal(holdout.runtimeRankingInputExcludesGold, true)
assert.equal(holdout.noHoldoutTuning, true)
assert.equal(development.caseCount, 28)
assert.equal(holdout.caseCount, 20)
assert.ok(development.unionCandidateDiagnostics.averageUnionSize >= 100)
assert.ok(holdout.unionCandidateDiagnostics.averageUnionSize >= 100)

for (const artifact of [evaluation, architecture, development, holdout, manifest]) validateGitSafeArtifact({ artifactType: 'section-challenge-v1', value: artifact })
for (const record of manifest.artifacts) {
  const bytes = await fs.readFile(record.externalPath)
  assert.equal(sha(bytes), record.sha256, `External artifact SHA mismatch: ${record.externalPath}`)
  assert.equal(bytes.length, record.byteCount, `External artifact byte count mismatch: ${record.externalPath}`)
}

console.log(JSON.stringify({
  evaluationCases: evaluation.counts.supported,
  developmentCases: development.caseCount,
  holdoutCases: holdout.caseCount,
  frozenImplementationArtifacts: architecture.implementationArtifacts.length,
  externalArtifacts: manifest.artifactCount,
  developmentThresholdsPassed: development.thresholdAssessment.successThresholdsPassed,
  developmentDamageBudgetPassed: development.thresholdAssessment.damageBudgetPassed,
  holdoutThresholdsPassed: holdout.thresholdAssessment.successThresholdsPassed,
  holdoutDamageBudgetPassed: holdout.thresholdAssessment.damageBudgetPassed,
  rightsSafe: true,
  deterministicInputsBound: true
}, null, 2))
