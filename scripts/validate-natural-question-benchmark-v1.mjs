import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const packageRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-benchmark-v1')
const benchmark = JSON.parse(await fs.readFile(path.join(packageRoot, 'natural_question_benchmark_v1.json'), 'utf8'))
const expectedQuestionArraySha256 = 'ebf779edc4caa38954a4ba8ca7d190807c3240b86b548d452791a0714cec9055'
const actualQuestionArraySha256 = crypto.createHash('sha256').update(JSON.stringify(benchmark.questions)).digest('hex')

assert.equal(benchmark.questionCount, 65)
assert.equal(benchmark.questions.length, 65)
assert.equal(new Set(benchmark.questions.map((item) => item.questionId)).size, 65)
assert.equal(new Set(benchmark.questions.map((item) => item.query)).size, 65)
assert.deepEqual(benchmark.questions.map((item) => item.questionId), Array.from({ length: 65 }, (_, index) => String(index + 1)))
assert.equal(actualQuestionArraySha256, expectedQuestionArraySha256)
for (const item of benchmark.questions) {
  assert.deepEqual(Object.keys(item), ['questionId', 'query'])
  assert.ok(item.query.endsWith('?'))
}

const forbiddenGoldKeys = /expected(?:Answer|Source|Chunk|Evidence)|accepted(?:Target|Evidence)|gold|rationale/i
assert.equal(forbiddenGoldKeys.test(JSON.stringify(benchmark.questions)), false)

const assessments = JSON.parse(await fs.readFile(path.join(packageRoot, 'natural_question_benchmark_v1_provisional_assessments.json'), 'utf8'))
assert.equal(assessments.status, 'provisional_not_gold')
assert.equal(assessments.assessments.length, 65)
assert.equal(new Set(assessments.assessments.map((item) => item.questionId)).size, 65)
assert.deepEqual(assessments.assessments.map((item) => item.questionId), benchmark.questions.map((item) => item.questionId))
const allowedRetrievalQuality = new Set(['apparently_strong_retrieval', 'mixed_or_partially_relevant_retrieval', 'apparently_weak_retrieval', 'no_plausible_relevant_evidence'])
const allowedScopeDiagnostic = new Set(['general_regulatory_or_actuarial', 'likely_corpus_gap', 'likely_company_specific', 'context_dependent'])
for (const item of assessments.assessments) {
  assert.ok(allowedRetrievalQuality.has(item.retrievalQuality))
  assert.ok(allowedScopeDiagnostic.has(item.scopeDiagnostic))
  assert.ok(item.observation.length > 0)
}

try {
  const results = JSON.parse(await fs.readFile(path.join(packageRoot, 'natural_question_benchmark_v1_baseline_results.json'), 'utf8'))
  assert.equal(results.benchmark.questionArraySha256, expectedQuestionArraySha256)
  assert.equal(results.execution.questionCount, 65)
  assert.equal(results.execution.successCount, 65)
  assert.equal(results.execution.failureCount, 0)
  assert.equal(results.results.length, 65)
  assert.equal(results.retrieval.retrievalLogicChanged, false)
  assert.equal(results.retrieval.queryRewriting, false)
  assert.equal(results.retrieval.topN, 10)
  assert.equal(results.benchmark.containsGoldLabels, false)
  assert.equal(results.benchmark.containsExpectedAnswers, false)
  assert.equal(results.benchmark.exactQueryTextPreserved, true)
  assert.equal(Object.values(results.provisionalSummary.retrievalQualityCounts).reduce((sum, value) => sum + value, 0), 65)
  assert.equal(Object.values(results.provisionalSummary.scopeDiagnosticCounts).reduce((sum, value) => sum + value, 0), 65)
  for (let index = 0; index < results.results.length; index += 1) {
    assert.equal(results.results[index].questionId, benchmark.questions[index].questionId)
    assert.equal(results.results[index].query, benchmark.questions[index].query)
    assert.equal(results.results[index].retrievedResults.length, 10)
    assert.deepEqual(results.results[index].retrievedResults.map((item) => item.rank), Array.from({ length: 10 }, (_, rank) => rank + 1))
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

console.log(JSON.stringify({
  benchmarkId: benchmark.benchmarkId,
  questionCount: benchmark.questions.length,
  questionArraySha256: actualQuestionArraySha256,
  validation: 'pass',
}, null, 2))
