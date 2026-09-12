import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const goldRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-gold-v1')
const benchmarkRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-benchmark-v1')
const approvedSourceRoot = path.resolve(process.env.DOCUMENT_PROCESSOR_SOURCE_ROOT || 'C:\\Dev\\Document Processor Sources')
const privateRoot = path.join(approvedSourceRoot, '_processed-private', 'natural-question-gold-v1-2026-09')
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'))

const benchmark = await readJson(path.join(benchmarkRoot, 'natural_question_benchmark_v1.json'))
const gold = await readJson(path.join(goldRoot, 'natural_question_gold_v1.json'))
const summary = await readJson(path.join(goldRoot, 'natural_question_gold_v1_summary.json'))
const sme = await readJson(path.join(goldRoot, 'natural_question_gold_v1_sme_projection.json'))
const manifest = await readJson(path.join(goldRoot, 'manifest.json'))
const privateAdjudicationBytes = await fs.readFile(path.join(privateRoot, 'private_adjudication.json'))
const privateAdjudication = JSON.parse(privateAdjudicationBytes.toString('utf8'))
const privateSmeBytes = await fs.readFile(path.join(privateRoot, 'sme_review_packet.json'))
const privateSme = JSON.parse(privateSmeBytes.toString('utf8'))
const repositoryManifest = await readJson(path.join(repoRoot, 'data', 'processed', 'source_indexes', 'repository-manifest.json'))
const sourceMap = new Map(repositoryManifest.sourcePackages.map((item) => [item.sourceId, item]))
const chunks = (await fs.readFile(path.join(repoRoot, 'data', 'processed', 'source_indexes', 'exports', 'source_chunks.jsonl'), 'utf8')).trim().split(/\r?\n/).map(JSON.parse)
const chunkMap = new Map(chunks.map((item) => [item.chunkId, item]))

assert.equal(gold.status, 'GOLD_CANDIDATE_PENDING_HUMAN_APPROVAL')
assert.ok(privateRoot.startsWith(approvedSourceRoot + path.sep))
assert.ok(!privateRoot.startsWith(repoRoot + path.sep))
assert.ok(privateRoot.split(path.sep).includes('_processed-private'))
assert.equal(gold.evaluationLayer, 'review_only_non_canonical')
assert.equal(gold.questionCount, 65)
assert.equal(gold.cases.length, 65)
assert.equal(gold.questionArraySha256, 'ebf779edc4caa38954a4ba8ca7d190807c3240b86b548d452791a0714cec9055')
assert.equal(sha256(JSON.stringify(benchmark.questions)), gold.questionArraySha256)
assert.equal(gold.inputBindings.benchmarkFileSha256, sha256(await fs.readFile(path.join(benchmarkRoot, 'natural_question_benchmark_v1.json'))))
assert.equal(gold.inputBindings.baselineResultsSha256, sha256(await fs.readFile(path.join(benchmarkRoot, 'natural_question_benchmark_v1_baseline_results.json'))))
assert.equal(gold.inputBindings.provisionalAssessmentsSha256, sha256(await fs.readFile(path.join(benchmarkRoot, 'natural_question_benchmark_v1_provisional_assessments.json'))))
assert.deepEqual(gold.cases.map((item) => item.questionId), benchmark.questions.map((item) => item.questionId))
assert.deepEqual(privateAdjudication.cases.map((item) => item.questionId), benchmark.questions.map((item) => item.questionId))
for (let index = 0; index < gold.cases.length; index += 1) {
  assert.equal(gold.cases[index].querySha256, sha256(benchmark.questions[index].query))
  assert.equal(privateAdjudication.cases[index].query, benchmark.questions[index].query)
  assert.equal(privateAdjudication.cases[index].querySha256, gold.cases[index].querySha256)
  assert.equal(privateAdjudication.cases[index].primarySupportStatus, gold.cases[index].primarySupportStatus)
  assert.ok(privateAdjudication.cases[index].rationale.length > 0)
  assert.equal(privateAdjudication.cases[index].pass1.completedAgainstWholeCorpus, true)
  assert.equal(privateAdjudication.cases[index].pass2.state, 'INDEPENDENT_MODEL_REVIEWED')
}

const statuses = new Set(['FULLY_SUPPORTED', 'PARTIALLY_SUPPORTED', 'UNSUPPORTED_CORPUS_GAP', 'UNSUPPORTED_COMPANY_SPECIFIC', 'UNSUPPORTED_OUT_OF_SCOPE', 'AMBIGUOUS_REQUIRES_SME'])
const structures = new Set(['SINGLE_UNIT', 'MULTI_UNIT_REQUIRED', 'NOT_APPLICABLE'])
const roles = new Set(['PRIMARY_GOVERNING', 'PRIMARY_OPERATIVE', 'DEFINITIONAL', 'INTERPRETIVE_COMPANION', 'CORROBORATING', 'CONTEXT_ONLY'])
const outcomes = new Set(['AGREE', 'DISAGREE_SUPPORT_STATUS', 'DISAGREE_EVIDENCE_SET', 'DISAGREE_AUTHORITY_ROLE', 'NEEDS_SME'])
for (const item of gold.cases) {
  assert.ok(statuses.has(item.primarySupportStatus))
  assert.ok(structures.has(item.supportStructure))
  assert.ok(outcomes.has(item.pass2Outcome))
  assert.ok(['MODEL_ADJUDICATED', 'INDEPENDENT_MODEL_REVIEWED', 'HUMAN_APPROVED'].includes(item.humanReviewState))
  assert.equal(item.humanReviewState, 'INDEPENDENT_MODEL_REVIEWED')
  const supported = ['FULLY_SUPPORTED', 'PARTIALLY_SUPPORTED'].includes(item.primarySupportStatus)
  assert.equal(item.acceptedEvidenceSets.length > 0, supported)
  assert.equal(item.supportStructure === 'NOT_APPLICABLE', !supported)
  assert.equal(item.needsSme, item.primarySupportStatus === 'AMBIGUOUS_REQUIRES_SME')
  if (item.pass2Outcome === 'DISAGREE_SUPPORT_STATUS') {
    const privateItem = privateAdjudication.cases.find((entry) => entry.questionId === item.questionId)
    assert.notEqual(privateItem.pass1.supportStatus, item.primarySupportStatus)
  }
  assert.equal(item.split === 'diagnostic', !supported)
  for (const set of item.acceptedEvidenceSets) {
    assert.ok(['FULL', 'PARTIAL'].includes(set.sufficiency))
    assert.ok(set.evidence.length > 0)
    assert.equal(new Set(set.evidence.map((entry) => entry.chunkId)).size, set.evidence.length)
    for (const evidence of set.evidence) {
      assert.ok(roles.has(evidence.role))
      const chunk = chunkMap.get(evidence.chunkId)
      assert.ok(chunk, `Missing accepted evidence ${evidence.chunkId}`)
      assert.equal(chunk.sourceId, evidence.sourceId)
      assert.equal(chunk.parentChunkId ?? null, evidence.parentChunkId ?? null)
      assert.equal(chunk.pageStart, evidence.citation.pageStart)
      assert.equal(chunk.pageEnd, evidence.citation.pageEnd)
      const source = sourceMap.get(evidence.sourceId)
      assert.ok(source, `Missing source package ${evidence.sourceId}`)
      assert.equal(evidence.sourceIndexSha256, sha256(await fs.readFile(path.join(repoRoot, source.sourceIndexPath))))
      assert.equal(evidence.sourceSha256, source.sourceSha256 || null)
    }
  }
}

assert.equal(gold.reviewMethod.retrievalOutputsUsedForAdjudication, false)
assert.equal(gold.reviewMethod.humanApprovalGranted, false)
assert.deepEqual(gold.splitProtocol.forbiddenInputs, ['baseline rank', 'baseline score', 'provisional assessment', 'retrieval success', 'retrieval failure'])
assert.equal(summary.humanApprovedCount, 0)
assert.equal(summary.modelComparisonReadiness, 'NOT_READY')
assert.equal(summary.privateArtifactCount, 2)
assert.equal(summary.privateArtifacts.length, 2)
for (const artifact of summary.privateArtifacts) {
  assert.ok(artifact.relativeExternalLocation.startsWith('_processed-private/'))
  assert.match(artifact.sha256, /^[a-f0-9]{64}$/)
  assert.ok(artifact.byteCount > 0)
}
assert.equal(summary.privateArtifacts[0].sha256, sha256(privateAdjudicationBytes))
assert.equal(summary.privateArtifacts[0].byteCount, privateAdjudicationBytes.byteLength)
assert.equal(summary.privateArtifacts[1].sha256, sha256(privateSmeBytes))
assert.equal(summary.privateArtifacts[1].byteCount, privateSmeBytes.byteLength)
assert.deepEqual(privateSme.cases.map((item) => item.questionId), sme.caseIds)
assert.deepEqual(sme.needsSmeCaseIds, gold.cases.filter((item) => item.needsSme).map((item) => item.questionId))
assert.deepEqual(sme.disagreementCaseIds, gold.cases.filter((item) => !['AGREE', 'NEEDS_SME'].includes(item.pass2Outcome)).map((item) => item.questionId))
assert.equal(new Set(sme.caseIds).size, sme.caseIds.length)
assert.equal(new Set(sme.agreementQcCaseIds).size, sme.agreementQcCaseIds.length)

const publicText = (await Promise.all((await fs.readdir(goldRoot)).filter((name) => name.endsWith('.json')).map((name) => fs.readFile(path.join(goldRoot, name), 'utf8')))).join('\n')
for (const item of benchmark.questions) assert.equal(publicText.includes(item.query), false, `Query leaked for ${item.questionId}`)
assert.equal(/sourceTextExcerpt|acceptedEvidenceText|rationale|disagreementNotes|baselineRank|baselineScore|retrievedResults/i.test(publicText), false)
assert.equal(/baselineRank|baselineScore|retrievedResults|provisionalAssessment/i.test(privateAdjudicationBytes.toString('utf8')), false)

for (const file of manifest.files) {
  const bytes = await fs.readFile(path.join(goldRoot, file.path))
  assert.equal(bytes.byteLength, file.byteCount)
  assert.equal(sha256(bytes), file.sha256)
}

console.log(JSON.stringify({
  goldId: gold.goldId,
  status: gold.status,
  questionCount: gold.questionCount,
  supportedCount: gold.cases.filter((item) => ['FULLY_SUPPORTED', 'PARTIALLY_SUPPORTED'].includes(item.primarySupportStatus)).length,
  splitCounts: summary.splitCounts,
  validation: 'pass',
}, null, 2))
