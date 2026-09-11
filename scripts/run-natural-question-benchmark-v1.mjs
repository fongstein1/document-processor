import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { evaluateQueries, normalizeText } from './evaluate-source-index-retrieval.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const defaultOutputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-benchmark-v1')
const benchmarkPath = path.join(defaultOutputRoot, 'natural_question_benchmark_v1.json')
const assessmentPath = path.join(defaultOutputRoot, 'natural_question_benchmark_v1_provisional_assessments.json')
const manifestPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'repository-manifest.json')
const chunksPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'exports', 'source_chunks.jsonl')
const baselineSha = '5afedfc5ade397179560880508a13821347f0545'
const topN = 10
const unsupportedThreshold = 3

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const fileSha256 = async (filePath) => sha256(await fs.readFile(filePath))
const questionArraySha256 = (questions) => sha256(JSON.stringify(questions))
const cleanExcerpt = (value, maxLength = 360) => {
  const text = normalizeText(value)
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`
}
const markdownCell = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
const relative = (value) => path.relative(repoRoot, value).replace(/\\/g, '/')

const parseArgs = () => {
  const index = process.argv.indexOf('--output-root')
  return { outputRoot: index >= 0 ? path.resolve(process.argv[index + 1]) : defaultOutputRoot }
}

const loadAssessments = async () => {
  try {
    const value = await readJson(assessmentPath)
    return new Map(value.assessments.map((item) => [item.questionId, item]))
  } catch (error) {
    if (error.code === 'ENOENT') return new Map()
    throw error
  }
}

const loadSourceGovernance = async (sourcePackages) => {
  const entries = await Promise.all(sourcePackages.map(async (sourcePackage) => {
    const sourceIndex = await readJson(path.join(repoRoot, sourcePackage.sourceIndexPath))
    return [sourcePackage.sourceId, {
      canonicality: sourceIndex.processing?.canonicality ?? null,
      reviewOnly: sourceIndex.processing?.reviewOnly ?? sourcePackage.reviewOnly ?? null,
      promotionStatus: sourceIndex.processing?.promotionStatus ?? sourcePackage.promotionStatus ?? null,
      ragReadyAllowed: sourceIndex.processing?.ragReadyAllowed ?? null,
      learnerFacingAllowed: sourceIndex.processing?.learnerFacingAllowed ?? null,
      appReadyAllowed: sourceIndex.processing?.appReadyAllowed ?? null,
      vectorEligible: sourceIndex.exportHints?.vectorEligible ?? null,
    }]
  }))
  return new Map(entries)
}

const formatTopHits = (results, limit = 3) => results.slice(0, limit).map((hit) =>
  `${hit.rank}. ${hit.sourceId} — ${hit.sectionOrProvisionIdentifier ?? 'section unavailable'} — ${hit.chunkId} (score ${hit.score})`,
).join('<br>')

const buildReviewMarkdown = (artifact) => {
  const lines = [
    '# Natural Question Benchmark v1 — baseline review',
    '',
    '> Review-only, non-canonical, and not human-adjudicated Gold. Assessments are provisional diagnostics; they do not establish correctness.',
    '',
    `- Frozen questions: ${artifact.execution.questionCount}`,
    `- Successfully executed: ${artifact.execution.successCount}`,
    `- Failures: ${artifact.execution.failureCount}`,
    `- Retrieval: \`${artifact.retrieval.method}\` via \`${artifact.retrieval.implementationPath}\``,
    `- Result depth: top ${artifact.retrieval.topN}`,
    `- Corpus: ${artifact.corpus.retrievalEligibleChunkCount} retrieval-eligible chunks from ${artifact.corpus.totalChunkCount} exported chunks and ${artifact.corpus.sourcePackageCount} source packages`,
    '',
    '| ID | Frozen query | Top three retrieved hits | Provisional assessment | Scope diagnostic | Observation |',
    '|---:|---|---|---|---|---|',
  ]
  for (const item of artifact.results) {
    lines.push(`| ${item.questionId} | ${markdownCell(item.query)} | ${markdownCell(formatTopHits(item.retrievedResults))} | ${markdownCell(item.provisionalAssessment.retrievalQuality)} | ${markdownCell(item.provisionalAssessment.scopeDiagnostic)} | ${markdownCell(item.provisionalAssessment.observation)} |`)
  }
  lines.push('', 'The machine-readable results contain all top-10 hits, scores, governance states, and short excerpts.', '')
  return `${lines.join('\n')}\n`
}

const buildSummaryMarkdown = (artifact) => {
  const quality = artifact.provisionalSummary.retrievalQualityCounts
  const scope = artifact.provisionalSummary.scopeDiagnosticCounts
  const scores = artifact.objectiveSummary.topScore
  return `# Natural Question Benchmark v1 — baseline summary

## Boundary

This is an unadjudicated retrieval baseline, not a correctness evaluation. No expected answers, sources, chunks, or Gold labels were supplied or created. Retrieval logic and corpus records were not changed after observing the questions.

## Architecture exercised

The run reused the repository's deterministic \`${artifact.retrieval.method}\` implementation in \`${artifact.retrieval.implementationPath}\`. It performs weighted token overlap over source-index text and structured metadata, applies its existing phrase/definition/authority signals, excludes records with \`retrievalEligible=false\`, and applies the existing exact-text and parent/child collision deduplication. Top 10 was captured for review; this changes output depth only, not candidate scores or ordering.

The repository does not contain a production answer-generation layer. Every indexed package remains \`ragReadyAllowed=false\`; these results are review evidence, not RAG-ready output.

## Corpus searched

- Repository baseline SHA: \`${artifact.repository.baselineSha}\`
- Manifest: \`${artifact.corpus.manifestPath}\`
- Chunk export: \`${artifact.corpus.chunkExportPath}\`
- Source packages: ${artifact.corpus.sourcePackageCount}
- Exported chunks: ${artifact.corpus.totalChunkCount}
- Retrieval-eligible chunks searched: ${artifact.corpus.retrievalEligibleChunkCount}
- Promoted packages: ${artifact.corpus.promotionStatusCounts.promoted ?? 0}
- Not-promoted packages: ${artifact.corpus.promotionStatusCounts.not_promoted ?? 0}

The corpus is a mixed-governance canonical source-index POC: it includes promoted current-manual slices, review-only companion/regulatory material, and a small synthetic pricing set. Canonical serialization does not confer downstream RAG eligibility.

## Execution

- Frozen questions: ${artifact.execution.questionCount}
- Executed successfully: ${artifact.execution.successCount}
- Failures: ${artifact.execution.failureCount}
- Empty result sets: ${artifact.execution.emptyResultCount}
- Top-N depth: ${artifact.retrieval.topN}
- Top score (minimum / median / maximum): ${scores.minimum} / ${scores.median} / ${scores.maximum}
- Questions with top score below the evaluator's diagnostic threshold (${artifact.retrieval.unsupportedThreshold}): ${scores.belowUnsupportedThresholdCount}

## Provisional diagnostic counts

Retrieval-quality labels (mutually exclusive, total ${artifact.execution.questionCount}):

- Apparently strong retrieval: ${quality.apparently_strong_retrieval ?? 0}
- Mixed / partially relevant retrieval: ${quality.mixed_or_partially_relevant_retrieval ?? 0}
- Apparently weak retrieval: ${quality.apparently_weak_retrieval ?? 0}
- No plausible relevant evidence: ${quality.no_plausible_relevant_evidence ?? 0}
- Not yet reviewed: ${quality.not_yet_reviewed ?? 0}

Scope diagnostics (mutually exclusive, total ${artifact.execution.questionCount}):

- General regulatory/actuarial: ${scope.general_regulatory_or_actuarial ?? 0}
- Likely corpus gap: ${scope.likely_corpus_gap ?? 0}
- Likely company-specific: ${scope.likely_company_specific ?? 0}
- Context-dependent: ${scope.context_dependent ?? 0}
- Not yet reviewed: ${scope.not_yet_reviewed ?? 0}

## Headline patterns

- Only questions 49, 50, 51, and 62 received an apparently strong provisional retrieval assessment. These align closely with represented mortality, expense-assumption, and model-governance terminology.
- Twenty-nine questions had mixed evidence, while 24 were apparently weak and eight had no plausible retrieved evidence. High lexical scores often reflected shared reserve terminology rather than direct support.
- The corpus appears to lack the specialized half-cx, AAT/PVMVS, LTC-rider morbidity, and New York-specific material requested in questions 29, 31, 32, 35, 39, and 64.
- Twenty-two questions appear company-specific: they ask about observed block results, bulk calculations, reconciliations, treaty terms, portfolio mix, or reporting-system conflicts that this regulatory corpus cannot settle by itself.
- The source-index contains review-only companion and synthetic pricing material alongside promoted manual slices. Synthetic results outrank regulatory material for some natural questions, notably 41, 44, 52, and 54.
- Broad parent/section metadata creates ties and weak child discrimination. Questions 49 and 50, for example, return many Section 9.C children at identical scores.
- The evaluator always returns a ranked list. Question 23 has a top score below the configured diagnostic threshold, demonstrating that a non-empty result set is not evidence of answerability.

## Interpretation and next evaluation step

The provisional labels are human-review aids only. Strong-looking lexical retrieval can still be substantively wrong, and weak-looking retrieval may omit relevant material deeper in the corpus. The next evaluation step should be independent human adjudication of expected evidence and corpus-answerability, followed by a frozen Gold layer. Retrieval tuning must wait until that boundary exists.

## Reproduction

Run \`npm run benchmark:natural-question:v1\`. The runner consumes the frozen benchmark verbatim, invokes the existing evaluator, and writes only this non-canonical review package.
`
}

const main = async () => {
  const { outputRoot } = parseArgs()
  const benchmark = await readJson(benchmarkPath)
  const manifest = await readJson(manifestPath)
  const chunkRecords = (await fs.readFile(chunksPath, 'utf8')).trim().split(/\r?\n/).filter(Boolean).map(JSON.parse)
  const assessmentLookup = await loadAssessments()
  const governanceLookup = await loadSourceGovernance(manifest.sourcePackages)
  const sourceLookup = new Map(manifest.sourcePackages.map((item) => [item.sourceId, item]))
  const evaluation = evaluateQueries({
    queries: benchmark.questions.map((item) => ({
      queryId: item.questionId,
      query: item.query,
      queryCategory: 'unadjudicated_natural_question',
      expectedOutcome: 'supported',
      expectedChunkIds: [],
      expectedSourceIds: [],
    })),
    chunkRecords,
    sourcePackages: manifest.sourcePackages,
    unsupportedThreshold,
    topN,
  })
  const chunkLookup = new Map(chunkRecords.map((item) => [item.chunkId, item]))
  const results = evaluation.queries.map((queryResult) => {
    const assessment = assessmentLookup.get(queryResult.queryId) ?? {
      retrievalQuality: 'not_yet_reviewed',
      scopeDiagnostic: 'not_yet_reviewed',
      observation: 'No provisional human diagnostic has been recorded.',
    }
    return {
      questionId: queryResult.queryId,
      query: queryResult.query,
      executionStatus: 'success',
      provisionalAssessment: {
        ...assessment,
        status: 'provisional_not_gold',
      },
      retrievedResults: queryResult.rankedMatches.map((match, index) => {
        const chunk = chunkLookup.get(match.chunkId)
        const source = sourceLookup.get(match.sourceId)
        const governance = governanceLookup.get(match.sourceId)
        return {
          rank: index + 1,
          score: match.score,
          sourceId: match.sourceId,
          documentTitle: chunk?.sourceTitle ?? source?.sourceTitle ?? null,
          sectionOrProvisionIdentifier: chunk?.sectionReference ?? null,
          chunkId: match.chunkId,
          chunkType: chunk?.chunkKind ?? null,
          chunkLevel: chunk?.chunkLevel ?? null,
          parentChunkId: chunk?.parentChunkId ?? null,
          canonicalReviewPromotionStatus: {
            ...governance,
            retrievalEligible: chunk?.retrievalEligible ?? null,
            promotionEligible: chunk?.promotionEligible ?? null,
          },
          retrievalTextExcerpt: cleanExcerpt(chunk?.sourceTextExcerpt || chunk?.normalizedTextExcerpt || chunk?.summary),
          retrievalMethodOrComponent: evaluation.method,
        }
      }),
      deduplication: queryResult.deduplication,
    }
  })
  const countBy = (key) => Object.fromEntries([...new Set(results.map((item) => item.provisionalAssessment[key]))].sort().map((value) => [value, results.filter((item) => item.provisionalAssessment[key] === value).length]))
  const promotionStatusCounts = Object.fromEntries([...new Set(manifest.sourcePackages.map((item) => item.promotionStatus))].sort().map((value) => [value, manifest.sourcePackages.filter((item) => item.promotionStatus === value).length]))
  const topScores = results.map((item) => item.retrievedResults[0]?.score ?? 0).sort((left, right) => left - right)
  const top1SourceCounts = Object.fromEntries([...new Set(results.map((item) => item.retrievedResults[0]?.sourceId ?? 'none'))].sort().map((value) => [value, results.filter((item) => (item.retrievedResults[0]?.sourceId ?? 'none') === value).length]))
  const artifact = {
    schemaVersion: '1.0',
    evaluationId: 'natural-question-benchmark-v1-baseline',
    evaluationStatus: 'review_only_unadjudicated_baseline',
    repository: {
      branchAtStart: 'processing/scaled-wave-01-replay-2026-09',
      baselineSha,
      benchmarkBranch: 'evaluation/natural-question-benchmark-v1',
    },
    benchmark: {
      benchmarkId: benchmark.benchmarkId,
      benchmarkPath: relative(benchmarkPath),
      benchmarkFileSha256: await fileSha256(benchmarkPath),
      questionArraySha256: questionArraySha256(benchmark.questions),
      containsGoldLabels: false,
      containsExpectedAnswers: false,
      exactQueryTextPreserved: true,
    },
    retrieval: {
      method: evaluation.method,
      implementationPath: 'scripts/evaluate-source-index-retrieval.mjs',
      topN,
      unsupportedThreshold,
      queryRewriting: false,
      retrievalLogicChanged: false,
      note: 'The established evaluator was invoked with empty scoring expectations. Its Gold-dependent accuracy fields were discarded; only its unchanged rankings and deduplication were retained.',
    },
    corpus: {
      manifestPath: relative(manifestPath),
      manifestSha256: await fileSha256(manifestPath),
      chunkExportPath: relative(chunksPath),
      chunkExportSha256: await fileSha256(chunksPath),
      sourcePackageCount: manifest.sourcePackageCount,
      totalChunkCount: chunkRecords.length,
      retrievalEligibleChunkCount: chunkRecords.filter((item) => item.retrievalEligible !== false).length,
      promotionStatusCounts,
      sourcePackages: manifest.sourcePackages.map((item) => ({
        sourceId: item.sourceId,
        sourceTitle: item.sourceTitle,
        documentType: item.documentType,
        authorityLevel: item.authorityLevel,
        chunkCount: item.chunkCount,
        reviewOnly: item.reviewOnly,
        promotionStatus: item.promotionStatus,
        ragReadyAllowed: governanceLookup.get(item.sourceId)?.ragReadyAllowed ?? null,
      })),
    },
    execution: {
      questionCount: benchmark.questions.length,
      successCount: results.filter((item) => item.executionStatus === 'success').length,
      failureCount: 0,
      emptyResultCount: results.filter((item) => item.retrievedResults.length === 0).length,
    },
    objectiveSummary: {
      topScore: {
        minimum: topScores[0],
        median: topScores[Math.floor(topScores.length / 2)],
        maximum: topScores.at(-1),
        belowUnsupportedThresholdCount: topScores.filter((score) => score < unsupportedThreshold).length,
      },
      top1SourceCounts,
    },
    provisionalSummary: {
      status: 'provisional_not_gold',
      retrievalQualityCounts: countBy('retrievalQuality'),
      scopeDiagnosticCounts: countBy('scopeDiagnostic'),
    },
    results,
  }
  await fs.mkdir(outputRoot, { recursive: true })
  await fs.writeFile(path.join(outputRoot, 'natural_question_benchmark_v1_baseline_results.json'), `${JSON.stringify(artifact, null, 2)}\n`)
  await fs.writeFile(path.join(outputRoot, 'natural_question_benchmark_v1_baseline_review.md'), buildReviewMarkdown(artifact))
  await fs.writeFile(path.join(outputRoot, 'natural_question_benchmark_v1_baseline_summary.md'), buildSummaryMarkdown(artifact))
  console.log(JSON.stringify({
    outputRoot,
    questionCount: artifact.execution.questionCount,
    successCount: artifact.execution.successCount,
    failureCount: artifact.execution.failureCount,
    emptyResultCount: artifact.execution.emptyResultCount,
    retrievalQualityCounts: artifact.provisionalSummary.retrievalQualityCounts,
    scopeDiagnosticCounts: artifact.provisionalSummary.scopeDiagnosticCounts,
  }, null, 2))
}

await main()
