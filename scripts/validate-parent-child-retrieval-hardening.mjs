import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { publicRoot, externalRoot, runId, reciprocalRank } from './parent-child-retrieval-hardening.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const read = async (p) => JSON.parse(await fs.readFile(p, 'utf8'))
const publicFiles = ['architecture-manifest.json', 'architecture-source-records.json', 'parent-manifest.json', 'child-manifest.json', 'context-expansion-manifest.json', 'baseline-comparison.json', 'ablation-report.json', 'evidence-packages.json', 'external-artifact-manifest.json', 'evaluation-freeze.json', 'diagnostic-summary.json', 'overnight-pass-report.json']
const prohibited = new Set(['sourceTextExcerpt', 'normalizedTextExcerpt', 'normalizedSearchText', 'searchText', 'body', 'contextText', 'query', 'headingText', 'headerText', 'tableValues', 'keywords', 'keyPoints', 'concepts', 'definedTerms', 'requirements'])
const walk = (value, key = '') => {
  if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) { if (prohibited.has(k)) throw new Error(`prohibited content key in public evidence: ${k}`); walk(v, k) }
}
for (const file of publicFiles) { const value = await read(path.join(publicRoot, file)); walk(value); validateGitSafeArtifact({ artifactType: file, value }) }
const architecture = await read(path.join(publicRoot, 'architecture-manifest.json')); const parents = await read(path.join(publicRoot, 'parent-manifest.json')); const children = await read(path.join(publicRoot, 'child-manifest.json')); const evaluation = await read(path.join(publicRoot, 'baseline-comparison.json')); const freeze = await read(path.join(publicRoot, 'evaluation-freeze.json')); const manifest = await read(path.join(publicRoot, 'external-artifact-manifest.json'))
assert.equal(architecture.sourceCount, 6); assert.equal(freeze.developmentCaseCount, 24); assert.equal(freeze.holdoutCaseCount, 15); assert.equal(evaluation.cases.length, 39); assert.equal(evaluation.rankingInputExcludesTestExpectations, true)
assert.equal(new Set(parents.parents.map((p) => p.parentId)).size, parents.parents.length); assert.equal(new Set(children.children.map((c) => c.childId)).size, children.children.length)
const childIds = new Set(children.children.map((c) => c.childId)); const parentIds = new Set(parents.parents.map((p) => p.parentId)); for (const p of parents.parents) for (const id of p.childIds) assert(childIds.has(id)); for (const c of children.children) assert(parentIds.has(c.parentId))
for (const artifact of manifest.artifacts) { const bytes = await fs.readFile(artifact.externalPath); const hash = (await import('node:crypto')).createHash('sha256').update(bytes).digest('hex'); assert.equal(hash, artifact.sha256); assert.equal(bytes.length, artifact.byteCount); assert.equal(path.resolve(artifact.externalPath).startsWith(path.resolve('C:\\Dev\\Document Processor Sources')), true) }
for (const metric of [evaluation.metrics.baseline, evaluation.metrics.parentChildContext]) for (const key of ['sourceTop1', 'sourceTop3', 'targetTop1', 'targetTop3', 'targetMrr']) assert(metric[key] >= 0 && metric[key] <= 1)
assert.equal(reciprocalRank(1), 1); assert.equal(reciprocalRank(2), 0.5); assert.equal(reciprocalRank(0), 0)
console.log(JSON.stringify({ validator: 'parent-child-retrieval-hardening', result: 'PASS', runId, sourceCount: architecture.sourceCount, parentCount: architecture.parentCount, childCount: architecture.childCount, evaluationCases: evaluation.cases.length, externalArtifacts: manifest.artifacts.length, rightsSafePublicEvidence: true }, null, 2))
