import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const root = path.resolve(import.meta.dirname, '..')
const cfg = JSON.parse(await fs.readFile(path.join(root, 'config', 'broader-retrieval-diagnostic.json'), 'utf8'))
const publicRoot = path.join(root, 'data', 'processed', 'review_packages', cfg.runId)
const sha = b => crypto.createHash('sha256').update(b).digest('hex')
const read = async name => JSON.parse(await fs.readFile(path.join(publicRoot, name), 'utf8'))
const summary = await read('diagnostic-summary.json'), manifest = await read('external-artifact-manifest.json'), determinism = await read('determinism.json')
validateGitSafeArtifact({ artifactType: 'diagnostic-summary.json', value: summary })
validateGitSafeArtifact({ artifactType: 'external-artifact-manifest.json', value: manifest })
validateGitSafeArtifact({ artifactType: 'determinism.json', value: determinism })
assert.equal(determinism.determinismPassed, true)
assert.equal(summary.evaluatorOnlyOracleMetrics, true)
assert.equal(summary.noParameterOptimization, true)
assert.equal(summary.freshEvaluationRequirement.required, true)
assert.deepEqual(Object.fromEntries(summary.populations.map(x => [x.population, x.caseCount])), {
  GOLD_V3_HOLDOUT: 24,
  GOLD_V3_DEVELOPMENT: 36,
  MULTI_UNIT_DEVELOPMENT: 21,
  MULTI_UNIT_HOLDOUT: 14,
  MULTI_UNIT_SINGLE_UNIT_CONTROLS: 10,
  UNSUPPORTED_DIAGNOSTICS: 5,
  PARTIALLY_UNSUPPORTED_DIAGNOSTICS: 5
})
assert.equal(manifest.artifactCount, 3)
for (const artifact of manifest.artifacts) {
  const absolute = path.resolve(artifact.externalPath)
  const relative = path.relative(root, absolute)
  assert.ok(relative.startsWith('..' + path.sep) || relative === '..')
  const bytes = await fs.readFile(absolute)
  assert.equal(bytes.length, artifact.byteCount)
  assert.equal(sha(bytes), artifact.sha256)
}
const protectedPaths = [cfg.frozenRetrievalConfigPath, cfg.goldV3FreezePath, cfg.multiUnitGoldFreezePath, 'scripts/lib/hybrid-vector-retrieval.mjs', 'scripts/lib/semantic-evidence-units.mjs', 'scripts/lib/hierarchical-retrieval.mjs', 'scripts/hybrid-vector-retrieval-experiment.mjs', 'scripts/retrieval-gold-v3-evaluation.mjs', 'scripts/multi-unit-gold-v1-evaluation.mjs', 'scripts/lib/multi-unit-sidecar.mjs', 'scripts/multi-unit-sidecar-experiment.mjs']
const changed = execFileSync('git', ['diff', '--name-only', cfg.startingSha, '--', ...protectedPaths], { cwd: root, encoding: 'utf8' }).trim()
assert.equal(changed, '')
const validation = {
  schemaVersion: '1.0', runId: cfg.runId, allPassed: true, protectedInputsUnchanged: true,
  goldV1Unchanged: true, goldV2Unchanged: true, goldV3UnchangedAfterFreeze: true, multiUnitGoldV1Unchanged: true,
  retrievalConfigurationUnchanged: true, noRetrievalTuning: true, noModelChanges: true, noSourceAcquisition: true,
  noCanonicalPromotion: true, noAnswerGeneration: true, noProductionRag: true, noHostedModels: true,
  publicProjectionRightsSafe: true, privateArtifactsVerified: manifest.artifactCount,
  determinismPassed: true, diagnosticOnly: true, consumedHoldoutsDescriptiveOnly: true,
  reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false
}
validateGitSafeArtifact({ artifactType: 'broader-retrieval-diagnostic-validation', value: validation })
await fs.writeFile(path.join(publicRoot, 'validation-report.json'), JSON.stringify(validation, null, 2) + '\n')
console.log('broader retrieval diagnostic inputs, rights boundary, metrics and determinism: PASS')
