import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const approvedSourceRoot = path.resolve(process.env.DOCUMENT_PROCESSOR_SOURCE_ROOT || 'C:\\Dev\\Document Processor Sources')
const privateRoot = path.join(approvedSourceRoot, '_processed-private', 'natural-question-expansion-batch-01-2026-09')
const privatePath = path.join(privateRoot, 'intake.json')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-expansion-batch-01')
const goldPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-gold-v1', 'natural_question_gold_v1.json')
const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const provenanceTypes = new Set(['USER_WORK_CHAT', 'TEAM_OR_COLLEAGUE', 'INTERNAL_MEETING_OR_NOTES', 'USER_DIRECT_ENTRY', 'OTHER_HUMAN_AUTHORED'])

assert.ok(path.isAbsolute(approvedSourceRoot))
assert.ok(privateRoot.startsWith(approvedSourceRoot + path.sep))
assert.ok(!privateRoot.startsWith(repoRoot + path.sep))
assert.ok(!privateRoot.toLowerCase().includes('onedrive'))

const privateBytes = await fs.readFile(privatePath)
const intake = JSON.parse(privateBytes.toString('utf8'))
const gold = JSON.parse(await fs.readFile(goldPath, 'utf8'))
const priorHashes = new Set(gold.cases.map((item) => item.querySha256))
assert.equal(intake.schemaVersion, '1.0')
assert.equal(intake.intakeId, 'natural-question-expansion-batch-01')
assert.ok(['OPEN_EMPTY', 'OPEN_INTAKE', 'INTAKE_FROZEN'].includes(intake.status))
assert.deepEqual(intake.allowedProvenanceTypes, [...provenanceTypes])
assert.ok(Array.isArray(intake.questions))

const computedHashes = []
for (const [index, item] of intake.questions.entries()) {
  assert.equal(typeof item.questionTextExact, 'string', `Question ${index + 1} has no exact text.`)
  assert.ok(item.questionTextExact.length > 0, `Question ${index + 1} is empty.`)
  assert.equal(item.questionTextExact, item.questionTextExact.trim(), `Question ${index + 1} has unpreserved boundary whitespace.`)
  assert.ok(provenanceTypes.has(item.provenanceType), `Question ${index + 1} has invalid provenance.`)
  assert.equal(item.modelGenerated, false, `Question ${index + 1} must be human-authored.`)
  assert.equal(item.paraphrased, false, `Question ${index + 1} must retain exact human wording.`)
  const querySha256 = sha256(item.questionTextExact)
  assert.ok(!priorHashes.has(querySha256), `Question ${index + 1} duplicates Natural Question Gold V1.`)
  computedHashes.push(querySha256)
  if (intake.status === 'INTAKE_FROZEN') {
    assert.equal(item.querySha256, querySha256)
    assert.equal(item.questionId, `NQX01-${String(index + 1).padStart(3, '0')}-${querySha256.slice(0, 12)}`)
  } else {
    assert.equal(item.querySha256 ?? null, null, 'Hashes are assigned only at intake freeze.')
    assert.equal(item.questionId ?? null, null, 'Deterministic IDs are assigned only at intake freeze.')
  }
}
assert.equal(new Set(computedHashes).size, computedHashes.length, 'Duplicate exact questions exist within this batch.')
assert.equal(intake.status === 'OPEN_EMPTY', intake.questions.length === 0)
if (intake.status === 'INTAKE_FROZEN') {
  assert.equal(intake.freeze.questionCount, intake.questions.length)
  assert.equal(intake.freeze.questionHashesSha256, sha256(JSON.stringify(computedHashes)))
}

const projection = {
  schemaVersion: '1.0',
  intakeId: intake.intakeId,
  status: intake.status,
  boundary: 'HUMAN_AUTHORED_INTAKE_ONLY',
  createdFromGoldRepositorySha: intake.createdFromGoldRepositorySha,
  priorQuestionArraySha256: intake.questionArraySha256ToExclude,
  questionCount: intake.questions.length,
  provenanceCounts: Object.fromEntries([...provenanceTypes].map((key) => [key, intake.questions.filter((item) => item.provenanceType === key).length])),
  controls: {
    exactHumanWordingRequired: true,
    modelGeneratedAllowed: false,
    paraphrasingAllowed: false,
    deterministicIdsAssignedOnlyAtFreeze: true,
    duplicateCheckAgainstNaturalQuestionGoldV1: true,
    retrievalExecuted: false,
    adjudicationExecuted: false,
  },
  frozenQuestionRecords: intake.status === 'INTAKE_FROZEN'
    ? intake.questions.map((item) => ({ questionId: item.questionId, querySha256: item.querySha256, provenanceType: item.provenanceType }))
    : [],
  privateArtifact: {
    relativeExternalLocation: '_processed-private/natural-question-expansion-batch-01-2026-09/intake.json',
    sha256: sha256(privateBytes),
    byteCount: privateBytes.byteLength,
  },
}

await fs.mkdir(outputRoot, { recursive: true })
await fs.writeFile(path.join(outputRoot, 'intake_projection.json'), stableJson(projection))
const projectionBytes = await fs.readFile(path.join(outputRoot, 'intake_projection.json'))
await fs.writeFile(path.join(outputRoot, 'manifest.json'), stableJson({
  schemaVersion: '1.0',
  intakeId: intake.intakeId,
  files: [{ path: 'intake_projection.json', sha256: sha256(projectionBytes), byteCount: projectionBytes.byteLength }],
}))

console.log(JSON.stringify({ status: projection.status, questionCount: projection.questionCount, outputRoot, privateArtifact: projection.privateArtifact }, null, 2))
