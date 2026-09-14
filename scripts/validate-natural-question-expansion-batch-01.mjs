import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildNearDuplicateReview, provenanceTypes, sha256, stableJson } from './natural-question-expansion-batch-01-lib.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-expansion-batch-01')
const sourceRoot = path.resolve(process.env.DOCUMENT_PROCESSOR_SOURCE_ROOT || 'C:\\Dev\\Document Processor Sources')
const privateRoot = path.join(sourceRoot, '_processed-private', 'natural-question-expansion-batch-01-2026-09')
const paths = { intake: path.join(privateRoot, 'intake.json'), approvedEligible: path.join(privateRoot, 'handoff', 'natural_question_expansion_batch01_approved_eligible_41.json'), nonQuestionQuarantine: path.join(privateRoot, 'handoff', 'natural_question_expansion_batch01_authentic_nonquestion_quarantine.json'), notFoundCandidates: path.join(privateRoot, 'handoff', 'natural_question_expansion_batch01_not_found_candidates.json'), nearDuplicateReview: path.join(privateRoot, 'near_duplicate_review.json') }
const readBytesJson = async (file) => { const bytes = await fs.readFile(file); return { bytes, value: JSON.parse(bytes.toString('utf8')) } }
const artifacts = Object.fromEntries(await Promise.all(Object.entries(paths).map(async ([role, file]) => [role, await readBytesJson(file)])))
const projection = JSON.parse(await fs.readFile(path.join(outputRoot, 'intake_projection.json'), 'utf8'))
const manifest = JSON.parse(await fs.readFile(path.join(outputRoot, 'manifest.json'), 'utf8'))
const gold = JSON.parse(await fs.readFile(path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-gold-v1', 'natural_question_gold_v1.json'), 'utf8'))
const benchmark = JSON.parse(await fs.readFile(path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-benchmark-v1', 'natural_question_benchmark_v1.json'), 'utf8'))
const intake = artifacts.intake.value
const approved = artifacts.approvedEligible.value
assert.equal(projection.status, 'OPEN_INTAKE'); assert.equal(intake.status, 'OPEN_INTAKE'); assert.equal(projection.questionCount, 41); assert.equal(intake.questions.length, 41); assert.equal(approved.questions.length, 41)
assert.equal(artifacts.nonQuestionQuarantine.value.records.length, 3); assert.equal(artifacts.notFoundCandidates.value.candidateNumbers.length, 9); assert.deepEqual(intake.allowedProvenanceTypes, provenanceTypes)
const goldHashes = new Set(gold.cases.map((item) => item.querySha256))
const hashes = intake.questions.map((item, index) => { assert.equal(item.questionTextExact, approved.questions[index].questionTextExact); assert.equal(item.modelGenerated, false); assert.equal(item.paraphrased, false); assert.equal(item.questionId ?? null, null); assert.equal(item.querySha256 ?? null, null); return sha256(item.questionTextExact) })
assert.equal(new Set(hashes).size, 41); assert.equal(hashes.filter((hash) => goldHashes.has(hash)).length, 0)
assert.equal(benchmark.questionCount, 65)
assert.equal(sha256(JSON.stringify(benchmark.questions)), 'ebf779edc4caa38954a4ba8ca7d190807c3240b86b548d452791a0714cec9055')
const goldQuestions = benchmark.questions.map((item) => ({ questionId: item.questionId, question: item.query }))
const expectedReview = buildNearDuplicateReview(intake.questions, goldQuestions)
assert.equal(stableJson(expectedReview), artifacts.nearDuplicateReview.bytes.toString('utf8'))
assert.deepEqual(projection.duplicateScreen, { exactDuplicatesWithinApproved: 0, exactDuplicatesWithinIntake: 0, exactDuplicatesAgainstNaturalQuestionGoldV1: 0, automaticNearDuplicateCandidatesWithinBatch: expectedReview.automaticCandidates.withinBatch.length, automaticNearDuplicateCandidatesAgainstNaturalQuestionGoldV1: expectedReview.automaticCandidates.batchVersusGold.length, disposition: 'HUMAN_REVIEW_REQUIRED_NO_AUTOMATIC_REMOVAL' })
assert.deepEqual(projection.provenanceCounts, Object.fromEntries(provenanceTypes.map((key) => [key, intake.questions.filter((item) => item.provenanceType === key).length])))
assert.equal(projection.quarantinedAuthenticNonQuestionCount, 3); assert.equal(projection.notFoundExcludedCount, 9); assert.deepEqual(projection.frozenQuestionRecords, [])
for (const entry of projection.privateArtifacts) { const artifact = artifacts[entry.role]; assert.ok(artifact); assert.equal(entry.sha256, sha256(artifact.bytes)); assert.equal(entry.byteCount, artifact.bytes.byteLength); assert.ok(entry.relativeExternalLocation.startsWith('_processed-private/')) }
const publicText = (await Promise.all((await fs.readdir(outputRoot)).filter((name) => name.endsWith('.json')).map((name) => fs.readFile(path.join(outputRoot, name), 'utf8')))).join('\n')
assert.equal(/questionTextExact|answerText|expectedSource|acceptedEvidence|rationale|retrievedResults|sourceTextExact/i.test(publicText), false)
for (const file of manifest.files) { const bytes = await fs.readFile(path.join(outputRoot, file.path)); assert.equal(file.sha256, sha256(bytes)); assert.equal(file.byteCount, bytes.byteLength) }
console.log(JSON.stringify({ intakeId: projection.intakeId, status: projection.status, questionCount: projection.questionCount, duplicateScreen: projection.duplicateScreen, validation: 'pass' }, null, 2))
