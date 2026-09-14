import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildNearDuplicateReview, provenanceTypes, sha256, stableJson } from './natural-question-expansion-batch-01-lib.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.resolve(process.env.DOCUMENT_PROCESSOR_SOURCE_ROOT || 'C:\\Dev\\Document Processor Sources')
const privateRoot = path.join(sourceRoot, '_processed-private', 'natural-question-expansion-batch-01-2026-09')
const handoffRoot = path.join(privateRoot, 'handoff')
const artifactPaths = {
  intake: path.join(privateRoot, 'intake.json'),
  approvedEligible: path.join(handoffRoot, 'natural_question_expansion_batch01_approved_eligible_41.json'),
  nonQuestionQuarantine: path.join(handoffRoot, 'natural_question_expansion_batch01_authentic_nonquestion_quarantine.json'),
  notFoundCandidates: path.join(handoffRoot, 'natural_question_expansion_batch01_not_found_candidates.json'),
  nearDuplicateReview: path.join(privateRoot, 'near_duplicate_review.json'),
}
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-expansion-batch-01')
const goldPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-gold-v1', 'natural_question_gold_v1.json')
const benchmarkPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-benchmark-v1', 'natural_question_benchmark_v1.json')
const readArtifact = async (file) => { const bytes = await fs.readFile(file); return { bytes, value: JSON.parse(bytes.toString('utf8')) } }
assert.ok(path.isAbsolute(sourceRoot) && privateRoot.startsWith(sourceRoot + path.sep) && !privateRoot.startsWith(repoRoot + path.sep) && !privateRoot.toLowerCase().includes('onedrive'))

const intakeArtifact = await readArtifact(artifactPaths.intake)
const approvedArtifact = await readArtifact(artifactPaths.approvedEligible)
const quarantineArtifact = await readArtifact(artifactPaths.nonQuestionQuarantine)
const notFoundArtifact = await readArtifact(artifactPaths.notFoundCandidates)
const intake = intakeArtifact.value
const approved = approvedArtifact.value
const quarantine = quarantineArtifact.value
const notFound = notFoundArtifact.value
const gold = JSON.parse(await fs.readFile(goldPath, 'utf8'))
const benchmark = JSON.parse(await fs.readFile(benchmarkPath, 'utf8'))
assert.equal(intake.status, 'OPEN_INTAKE')
assert.equal(intake.questions.length, 41)
assert.equal(approved.approvedEligibleQuestionCount, 41)
assert.equal(quarantine.records.length, 3)
assert.equal(notFound.candidateNumbers.length, 9)
assert.deepEqual(intake.allowedProvenanceTypes, provenanceTypes)
const approvedHashes = approved.questions.map((item) => sha256(item.questionTextExact))
const goldHashes = new Set(gold.cases.map((item) => item.querySha256))
const intakeHashes = intake.questions.map((item, index) => {
  assert.equal(item.questionTextExact, item.questionTextExact.trim(), `Question ${index + 1} has boundary whitespace.`)
  assert.ok(provenanceTypes.includes(item.provenanceType)); assert.equal(item.modelGenerated, false); assert.equal(item.paraphrased, false)
  assert.equal(item.querySha256 ?? null, null); assert.equal(item.questionId ?? null, null)
  return sha256(item.questionTextExact)
})
assert.equal(new Set(intakeHashes).size, 41)
assert.deepEqual(intakeHashes, approvedHashes)
assert.equal(intakeHashes.filter((hash) => goldHashes.has(hash)).length, 0)
assert.equal(benchmark.questionCount, 65)
const goldQuestions = benchmark.questions.map((item) => ({ questionId: item.questionId, question: item.query }))
const nearDuplicateReview = buildNearDuplicateReview(intake.questions, goldQuestions)
await fs.writeFile(artifactPaths.nearDuplicateReview, stableJson(nearDuplicateReview))
const nearDuplicateArtifact = await readArtifact(artifactPaths.nearDuplicateReview)
const artifacts = { intake: intakeArtifact, approvedEligible: approvedArtifact, nonQuestionQuarantine: quarantineArtifact, notFoundCandidates: notFoundArtifact, nearDuplicateReview: nearDuplicateArtifact }
const provenanceCounts = Object.fromEntries(provenanceTypes.map((key) => [key, intake.questions.filter((item) => item.provenanceType === key).length]))
const privateArtifacts = Object.entries(artifacts).map(([role, artifact]) => ({ role, relativeExternalLocation: path.relative(sourceRoot, artifactPaths[role]).replaceAll('\\', '/'), sha256: sha256(artifact.bytes), byteCount: artifact.bytes.byteLength }))
const projection = {
  schemaVersion: '1.0', intakeId: intake.intakeId, status: 'OPEN_INTAKE', boundary: 'HUMAN_AUTHORED_INTAKE_ONLY', createdFromGoldRepositorySha: intake.createdFromGoldRepositorySha, priorQuestionArraySha256: intake.questionArraySha256ToExclude,
  questionCount: 41, approvedEligibleQuestionCount: 41, quarantinedAuthenticNonQuestionCount: 3, notFoundExcludedCount: 9, provenanceCounts,
  duplicateScreen: { exactDuplicatesWithinApproved: 0, exactDuplicatesWithinIntake: 0, exactDuplicatesAgainstNaturalQuestionGoldV1: 0, automaticNearDuplicateCandidatesWithinBatch: nearDuplicateReview.automaticCandidates.withinBatch.length, automaticNearDuplicateCandidatesAgainstNaturalQuestionGoldV1: nearDuplicateReview.automaticCandidates.batchVersusGold.length, disposition: 'HUMAN_REVIEW_REQUIRED_NO_AUTOMATIC_REMOVAL' },
  controls: { exactHumanWordingRequired: true, modelGeneratedAllowed: false, paraphrasingAllowed: false, deterministicIdsAssignedOnlyAtFreeze: true, duplicateCheckAgainstNaturalQuestionGoldV1: true, lexicalMechanicalNearDuplicateScreenOnly: true, nearDuplicateAutomaticRemovalAllowed: false, nonQuestionRecordsQuarantined: true, notFoundCandidatesExcluded: true, retrievalExecuted: false, adjudicationExecuted: false },
  frozenQuestionRecords: [], privateArtifacts,
}
await fs.mkdir(outputRoot, { recursive: true })
await fs.writeFile(path.join(outputRoot, 'intake_projection.json'), stableJson(projection))
const projectionBytes = await fs.readFile(path.join(outputRoot, 'intake_projection.json'))
await fs.writeFile(path.join(outputRoot, 'manifest.json'), stableJson({ schemaVersion: '1.0', intakeId: intake.intakeId, files: [{ path: 'intake_projection.json', sha256: sha256(projectionBytes), byteCount: projectionBytes.byteLength }] }))
console.log(JSON.stringify({ status: projection.status, questionCount: projection.questionCount, provenanceCounts, duplicateScreen: projection.duplicateScreen, privateArtifacts }, null, 2))
