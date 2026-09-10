import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(await fs.readFile(path.join(repoRoot, 'config', 'hybrid-vector-retrieval-experiment.json'), 'utf8'))
const publicRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', config.runId)
const externalRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', config.runId)
const read = async (file) => JSON.parse(await fs.readFile(file, 'utf8'))
const hash = async (file) => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')
const files = ['experiment-configuration.json', 'evaluation-results.json', 'source-slice-results.json', 'unsupported-query-diagnostics.json', 'external-artifact-manifest.json', 'experiment-report.json', 'validation-report.json']
const publicArtifacts = Object.fromEntries(await Promise.all(files.map(async (name) => [name, await read(path.join(publicRoot, name))])))
for (const [name, value] of Object.entries(publicArtifacts)) validateGitSafeArtifact({ artifactType: name, value })

const provenance = publicArtifacts['experiment-configuration.json']
assert.equal(provenance.startingSha, config.startingSha)
assert.equal(provenance.goldFreezeSha256, config.evaluation.goldFreezeSha256)
assert.equal(provenance.goldUnchanged, true)
assert.equal(provenance.noHoldoutTuning, true)
assert.equal(provenance.rankingInputExcludesGold, true)
assert.equal(provenance.embeddingModel, 'intfloat/e5-base-v2')
assert.equal(provenance.embeddingRevision, config.embedding.revision)
assert.equal(provenance.embeddingLicense, 'mit')
assert.equal(provenance.inferencePrecision, 'dynamic-int8-linear')
assert.equal(provenance.localOnly, true)
assert.equal(provenance.hostedApisUsed, false)
assert.equal(provenance.exactVectorSearch, true)
assert.equal(provenance.bruteForce, true)
assert.equal(provenance.vectorDimension, 768)
assert.equal(provenance.vectorCount, 14103)
assert.equal(provenance.queryVectorCount, 39)
assert.equal(provenance.determinismPassed, true)
assert(provenance.normMaximumDeviation <= 1e-5)

const evaluation = publicArtifacts['evaluation-results.json']
assert.deepEqual(Object.keys(evaluation.systems), ['BM25', 'VECTOR', 'HYBRID_RRF', 'HYBRID_RRF_PARENT', 'HYBRID_RRF_PARENT_CONTEXT'])
for (const [systemId, metrics] of Object.entries(evaluation.metrics)) {
  assert.equal(metrics.development.caseCount, 6, `${systemId} development count`)
  assert.equal(metrics.holdout.caseCount, 11, `${systemId} holdout count`)
  for (const split of ['development', 'holdout', 'combined']) for (const [key, value] of Object.entries(metrics[split])) if (key !== 'caseCount' && key !== 'irrelevantContextCount' && value !== null) assert(value >= 0 && value <= 1, `${systemId}/${split}/${key} outside [0,1]`)
}
const slices = publicArtifacts['source-slice-results.json']
assert(slices.a3.every((item) => item.development.caseCount === 0 && item.holdout.caseCount === 1), 'A3 should disclose its single holdout-only Gold V2 case.')
assert(slices.xlsx.every((item) => item.combined.caseCount > 0), 'XLSX aggregate should be evaluable.')
const diagnostics = publicArtifacts['unsupported-query-diagnostics.json']
assert.equal(diagnostics.invalidTargetCaseCount, 9)
assert.equal(diagnostics.ambiguousCaseCount, 13)
const report = publicArtifacts['experiment-report.json']
assert.equal(report.maturityLevel, 'LEVEL_1')
assert.equal(report.nextStep, 'A')
assert.equal(report.outcome, 'PASS_WITH_LIMITATIONS')
assert.equal(publicArtifacts['validation-report.json'].allPassed, true)

const manifest = publicArtifacts['external-artifact-manifest.json']
assert.equal(path.resolve(manifest.externalProcessingRoot), path.resolve(externalRoot))
let total = 0
for (const artifact of manifest.artifacts) {
  const absolute = path.resolve(artifact.externalPath)
  assert.equal(path.relative(path.resolve(externalRoot), absolute).startsWith('..'), false, `Artifact outside private root: ${absolute}`)
  const bytes = await fs.readFile(absolute)
  assert.equal(bytes.length, artifact.byteCount)
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), artifact.sha256)
  assert.equal(artifact.reviewOnly, true)
  total += artifact.byteCount
}
assert.equal(total, manifest.privateArtifactByteCount)
assert.equal(await hash(path.join(repoRoot, 'data', 'processed', 'review_packages', 'semantic-evidence-unit-correction-2026-09', 'evaluation-v2-freeze.json')), config.evaluation.goldFreezeSha256)
const diff = spawnSync('git', ['diff', '--name-only', config.startingSha, '--', 'data/processed'], { cwd: repoRoot, encoding: 'utf8' })
assert.equal(diff.status, 0)
const approvedSuccessorReviewRuns = ['retrieval-gold-v3-expansion-2026-09', 'hierarchical-retrieval-hardening-2026-09', 'multi-unit-gold-v1-2026-09', 'multi-unit-sidecar-hardening-2026-09']
for (const changed of diff.stdout.trim().split(/\r?\n/).filter(Boolean)) {
  const belongsToThisRun = changed.startsWith(`data/processed/review_packages/${config.runId}/`)
  const belongsToApprovedSuccessor = approvedSuccessorReviewRuns.some((successor) => changed.startsWith(`data/processed/review_packages/${successor}/`))
  assert(belongsToThisRun || belongsToApprovedSuccessor, `Protected processed artifact changed: ${changed}`)
}
console.log(`Validated local hybrid/vector experiment: ${evaluation.systems.BM25.length} cases, ${manifest.artifacts.length} private artifacts, rights-safe public evidence.`)
