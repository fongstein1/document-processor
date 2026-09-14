import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { provenanceTypes, sha256, stableJson } from './natural-question-expansion-batch-01-lib.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.resolve(process.env.DOCUMENT_PROCESSOR_SOURCE_ROOT || 'C:\\Dev\\Document Processor Sources')
const privateRoot = path.join(sourceRoot, '_processed-private', 'natural-question-expansion-batch-01-2026-09')
const handoffRoot = path.join(privateRoot, 'handoff')
const intakePath = path.join(privateRoot, 'intake.json')
const approvedPath = path.join(handoffRoot, 'natural_question_expansion_batch01_approved_eligible_41.json')
const quarantinePath = path.join(handoffRoot, 'natural_question_expansion_batch01_authentic_nonquestion_quarantine.json')
const notFoundPath = path.join(handoffRoot, 'natural_question_expansion_batch01_not_found_candidates.json')
const goldPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-gold-v1', 'natural_question_gold_v1.json')
const readBytesJson = async (file) => { const bytes = await fs.readFile(file); return { bytes, value: JSON.parse(bytes.toString('utf8')) } }

assert.ok(!privateRoot.toLowerCase().includes('onedrive'))
const current = await readBytesJson(intakePath)
const approved = await readBytesJson(approvedPath)
const quarantine = await readBytesJson(quarantinePath)
const notFound = await readBytesJson(notFoundPath)
const gold = JSON.parse(await fs.readFile(goldPath, 'utf8'))
assert.equal(approved.value.intakeId, current.value.intakeId)
assert.equal(approved.value.status, 'OPEN_INTAKE')
assert.equal(approved.value.approvedEligibleQuestionCount, 41)
assert.equal(approved.value.questions.length, 41)
assert.equal(quarantine.value.candidateCount, 3)
assert.equal(quarantine.value.records.length, 3)
assert.equal(notFound.value.candidateNumbers.length, 9)
assert.deepEqual(approved.value.allowedProvenanceTypes, provenanceTypes)
assert.equal(approved.value.createdFromGoldRepositorySha, current.value.createdFromGoldRepositorySha)
assert.equal(approved.value.questionArraySha256ToExclude, current.value.questionArraySha256ToExclude)
const approvedHashes = approved.value.questions.map((item, index) => {
  assert.equal(typeof item.questionTextExact, 'string', `Approved question ${index + 1} lacks exact text.`)
  assert.equal(item.questionTextExact, item.questionTextExact.trim(), `Approved question ${index + 1} has boundary whitespace.`)
  assert.ok(provenanceTypes.includes(item.provenanceType), `Approved question ${index + 1} has invalid provenance.`)
  assert.equal(item.modelGenerated, false); assert.equal(item.paraphrased, false); assert.equal(item.questionId ?? null, null); assert.equal(item.querySha256 ?? null, null)
  return sha256(item.questionTextExact)
})
assert.equal(new Set(approvedHashes).size, 41, 'The approved list contains exact duplicates.')
const goldHashes = new Set(gold.cases.map((item) => item.querySha256))
assert.equal(approvedHashes.filter((hash) => goldHashes.has(hash)).length, 0, 'The approved list exactly duplicates frozen Gold V1.')
const approvedByHash = new Map(approvedHashes.map((hash, index) => [hash, approved.value.questions[index]]))
const currentHashes = current.value.questions.map((item) => sha256(item.questionTextExact))
assert.deepEqual(currentHashes.filter((hash) => !approvedByHash.has(hash)), [], 'Current intake contains text outside the authoritative approved 41; refusing to delete or mutate it.')
assert.equal(new Set(currentHashes).size, currentHashes.length, 'Current intake contains exact duplicates.')
const missing = approvedHashes.filter((hash) => !currentHashes.includes(hash)).map((hash) => approvedByHash.get(hash))
const updated = { ...current.value, status: 'OPEN_INTAKE', allowedProvenanceTypes: provenanceTypes, questions: [...current.value.questions, ...missing], freeze: null }
assert.equal(updated.questions.length, 41)
await fs.writeFile(intakePath, stableJson(updated))
console.log(JSON.stringify({ priorPrivateIntakeCount: current.value.questions.length, approvedCount: 41, newlyAppendedCount: missing.length, finalOpenIntakeCount: updated.questions.length, exactDuplicatesWithinApproved: 0, exactDuplicatesAgainstGoldV1: 0, inputs: [approvedPath, quarantinePath, notFoundPath].map((file, index) => ({ path: file, sha256: sha256([approved, quarantine, notFound][index].bytes), byteCount: [approved, quarantine, notFound][index].bytes.byteLength })) }, null, 2))
