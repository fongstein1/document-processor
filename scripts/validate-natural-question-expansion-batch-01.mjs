import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-expansion-batch-01')
const sourceRoot = path.resolve(process.env.DOCUMENT_PROCESSOR_SOURCE_ROOT || 'C:\\Dev\\Document Processor Sources')
const privatePath = path.join(sourceRoot, '_processed-private', 'natural-question-expansion-batch-01-2026-09', 'intake.json')
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'))

const projection = await readJson(path.join(outputRoot, 'intake_projection.json'))
const manifest = await readJson(path.join(outputRoot, 'manifest.json'))
const privateBytes = await fs.readFile(privatePath)
const intake = JSON.parse(privateBytes.toString('utf8'))
assert.equal(projection.status, 'OPEN_EMPTY')
assert.equal(projection.questionCount, 0)
assert.equal(intake.questions.length, 0)
assert.equal(projection.boundary, 'HUMAN_AUTHORED_INTAKE_ONLY')
assert.equal(projection.createdFromGoldRepositorySha, '94b269b16ef1aaae83f0b8484964259e7b6ae0ad')
assert.equal(projection.priorQuestionArraySha256, 'ebf779edc4caa38954a4ba8ca7d190807c3240b86b548d452791a0714cec9055')
assert.deepEqual(projection.controls, {
  exactHumanWordingRequired: true,
  modelGeneratedAllowed: false,
  paraphrasingAllowed: false,
  deterministicIdsAssignedOnlyAtFreeze: true,
  duplicateCheckAgainstNaturalQuestionGoldV1: true,
  retrievalExecuted: false,
  adjudicationExecuted: false,
})
assert.deepEqual(projection.frozenQuestionRecords, [])
assert.equal(projection.privateArtifact.sha256, sha256(privateBytes))
assert.equal(projection.privateArtifact.byteCount, privateBytes.byteLength)
assert.ok(projection.privateArtifact.relativeExternalLocation.startsWith('_processed-private/'))
const publicText = (await Promise.all((await fs.readdir(outputRoot)).filter((name) => name.endsWith('.json')).map((name) => fs.readFile(path.join(outputRoot, name), 'utf8')))).join('\n')
assert.equal(/questionTextExact|answerText|expectedSource|acceptedEvidence|rationale|retrievedResults/i.test(publicText), false)
for (const file of manifest.files) {
  const bytes = await fs.readFile(path.join(outputRoot, file.path))
  assert.equal(file.sha256, sha256(bytes))
  assert.equal(file.byteCount, bytes.byteLength)
}
console.log(JSON.stringify({ intakeId: projection.intakeId, status: projection.status, questionCount: projection.questionCount, validation: 'pass' }, null, 2))
