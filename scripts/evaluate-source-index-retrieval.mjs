import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const defaultConfigPath = path.join(repoRoot, 'config', 'source-index-poc.json')

const stopWords = new Set([
  'the',
  'and',
  'or',
  'of',
  'to',
  'a',
  'an',
  'in',
  'for',
  'what',
  'how',
  'does',
  'say',
  'about',
  'when',
  'is',
  'are',
  'with',
  'where',
  'that',
  'this',
  'it',
  'as',
  'by',
  'be',
  'on',
  'do',
  'does',
  'which',
  'would',
  'could',
  'should',
  'what',
  'who',
  'why',
  'best',
  'next',
  'source',
  'sources',
  'document',
  'documents',
])

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))

export const normalizeText = (value) =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()

export const tokenize = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token && !stopWords.has(token))

export const buildSearchText = (chunk) =>
  [
    chunk.sourceTextExcerpt,
    chunk.normalizedTextExcerpt,
    chunk.summary,
    chunk.topic,
    chunk.headingPath,
    chunk.sectionReference,
    chunk.sourceTitle,
    chunk.sourceReference,
    (chunk.keyPoints ?? []).join(' '),
    (chunk.concepts ?? []).join(' '),
    (chunk.definedTerms ?? []).join(' '),
    (chunk.acronyms ?? []).join(' '),
    (chunk.requirements ?? []).join(' '),
    chunk.citationDisplay,
    (chunk.controlledTags ?? []).join(' '),
    (chunk.relationshipIds ?? []).join(' '),
  ]
    .filter(Boolean)
    .join(' ')

const phraseBoost = (query, candidate, weight) => {
  const queryText = normalizeText(query).toLowerCase()
  const candidateText = normalizeText(candidate).toLowerCase()
  if (!queryText || !candidateText) {
    return 0
  }
  return queryText.includes(candidateText) ? weight : 0
}

export const scoreChunk = (query, chunk) => {
  const queryTokens = new Set(tokenize(query))
  const haystackTokens = new Set(tokenize(buildSearchText(chunk)))
  let score = 0

  for (const token of queryTokens) {
    if (haystackTokens.has(token)) {
      score += 1
    }
  }

  score += phraseBoost(query, chunk.sourceTitle, 4)
  score += phraseBoost(query, chunk.sectionReference, 2.5)
  score += phraseBoost(query, chunk.topic, 2)
  score += phraseBoost(query, chunk.headingPath, 1.5)
  score += phraseBoost(query, chunk.sourceReference, 1.5)

  const lowerQuery = normalizeText(query).toLowerCase()
  const authorityHints = [
    ['regulation', 'regulation'],
    ['guideline', 'guideline'],
    ['practice note', 'practice_note'],
    ['practice-note', 'practice_note'],
    ['educational note', 'educational_note'],
    ['manual', 'manual_section'],
    ['companion', 'companion'],
  ]
  for (const [needle, tag] of authorityHints) {
    if (lowerQuery.includes(needle) && buildSearchText(chunk).toLowerCase().includes(tag)) {
      score += 0.5
    }
  }

  return score
}

const buildLookup = (sourcePackages) => {
  const lookup = new Map()
  for (const sourcePackage of sourcePackages) {
    lookup.set(sourcePackage.sourceId, sourcePackage)
  }
  return lookup
}

const deriveExpectedFamilies = (expectedSourceIds, lookup) => {
  const families = new Set()
  const authorities = new Set()
  for (const sourceId of expectedSourceIds ?? []) {
    const sourcePackage = lookup.get(sourceId)
    if (sourcePackage) {
      if (sourcePackage.sourceFamilyId) {
        families.add(sourcePackage.sourceFamilyId)
      }
      if (sourcePackage.authorityLevel) {
        authorities.add(sourcePackage.authorityLevel)
      }
    }
  }
  return {
    sourceFamilyIds: [...families],
    authorityLevels: [...authorities],
  }
}

export const evaluateQueries = ({
  queries,
  chunkRecords,
  sourcePackages,
  unsupportedThreshold = 3,
  topN = 5,
}) => {
  const sourceLookup = buildLookup(sourcePackages)
  const normalizedChunks = chunkRecords.map((chunk) => ({
    ...chunk,
    searchableText: buildSearchText(chunk).toLowerCase(),
  }))

  let top1HitCount = 0
  let top3HitCount = 0
  let top5HitCount = 0
  let reciprocalRankSum = 0
  let supportedQueryCount = 0
  let unsupportedQueryCount = 0
  let unsupportedCorrectCount = 0
  let citationAvailabilityCount = 0
  let sourceFamilyAccuracyCount = 0
  let authorityLevelAccuracyCount = 0
  let multiChunkEvidenceRecallCount = 0
  const categoryStats = new Map()

  const queryResults = queries.map((query) => {
    const rankedMatches = normalizedChunks
      .map((chunk) => ({
        chunkId: chunk.chunkId,
        sourceId: chunk.sourceId,
        sourceFamilyId: chunk.sourceFamilyId,
        authorityLevel: chunk.authorityLevel,
        score: scoreChunk(query.query, chunk),
        citationCount: Array.isArray(chunk.citations) ? chunk.citations.length : 0,
      }))
      .sort((left, right) => right.score - left.score || left.chunkId.localeCompare(right.chunkId))

    const topMatches = rankedMatches.slice(0, topN)
    const top1 = topMatches[0] ?? null
    const expectedChunkIds = query.expectedChunkIds ?? []
    const expectedSourceIds = query.expectedSourceIds ?? []
    const expectedSupport = query.expectedOutcome ?? 'supported'
    const expectedFamilies = deriveExpectedFamilies(expectedSourceIds, sourceLookup)
    const top1Hit = expectedSupport !== 'unsupported' && Boolean(top1 && expectedChunkIds.includes(top1.chunkId))
    const top3Hit =
      expectedSupport !== 'unsupported' &&
      topMatches.some((match) => expectedChunkIds.includes(match.chunkId))
    const top5Hit =
      expectedSupport !== 'unsupported' &&
      rankedMatches.slice(0, 5).some((match) => expectedChunkIds.includes(match.chunkId))

    const firstExpectedRank = expectedSupport !== 'unsupported'
      ? rankedMatches.findIndex((match) => expectedChunkIds.includes(match.chunkId))
      : -1
    const reciprocalRank = firstExpectedRank >= 0 ? 1 / (firstExpectedRank + 1) : 0

    const insufficientSupportDetected = Boolean(top1 && top1.score < unsupportedThreshold)
    const unsupportedCorrect =
      expectedSupport === 'unsupported' ? insufficientSupportDetected : false

    if (expectedSupport !== 'unsupported') {
      supportedQueryCount += 1
      if (top1Hit) {
        top1HitCount += 1
      }
      if (top3Hit) {
        top3HitCount += 1
      }
      if (top5Hit) {
        top5HitCount += 1
      }
      reciprocalRankSum += reciprocalRank
      if (top1 && top1.citationCount > 0) {
        citationAvailabilityCount += 1
      }
      if (top1 && expectedFamilies.sourceFamilyIds.includes(top1.sourceFamilyId)) {
        sourceFamilyAccuracyCount += 1
      }
      if (top1 && expectedFamilies.authorityLevels.includes(top1.authorityLevel)) {
        authorityLevelAccuracyCount += 1
      }
      if (
        expectedChunkIds.length > 1 &&
        expectedChunkIds.every((chunkId) => rankedMatches.slice(0, 5).some((match) => match.chunkId === chunkId))
      ) {
        multiChunkEvidenceRecallCount += 1
      }
    } else {
      unsupportedQueryCount += 1
      if (unsupportedCorrect) {
        unsupportedCorrectCount += 1
      }
    }

    const category = query.queryCategory ?? 'uncategorized'
    const categoryEntry = categoryStats.get(category) ?? {
      queryCount: 0,
      top1HitCount: 0,
      top3HitCount: 0,
      top5HitCount: 0,
      mrrSum: 0,
      unsupportedCorrectCount: 0,
      unsupportedCount: 0,
    }
    categoryEntry.queryCount += 1
    if (expectedSupport !== 'unsupported') {
      if (top1Hit) {
        categoryEntry.top1HitCount += 1
      }
      if (top3Hit) {
        categoryEntry.top3HitCount += 1
      }
      if (top5Hit) {
        categoryEntry.top5HitCount += 1
      }
      categoryEntry.mrrSum += reciprocalRank
    } else {
      categoryEntry.unsupportedCount += 1
      if (unsupportedCorrect) {
        categoryEntry.unsupportedCorrectCount += 1
      }
    }
    categoryStats.set(category, categoryEntry)

    return {
      ...query,
      expectedSourceFamilyIds: expectedFamilies.sourceFamilyIds,
      expectedAuthorityLevels: expectedFamilies.authorityLevels,
      rankedMatches: topMatches,
      top1Hit,
      top3Hit,
      top5Hit,
      reciprocalRank,
      predictedSourceFamilyId: top1?.sourceFamilyId ?? null,
      predictedAuthorityLevel: top1?.authorityLevel ?? null,
      citationAvailable: Boolean(top1 && top1.citationCount > 0),
      insufficientSupportDetected,
      resultLabel:
        expectedSupport === 'unsupported'
          ? insufficientSupportDetected
            ? 'unsupported'
            : 'false_positive'
          : top1Hit
            ? 'supported_top1'
            : top3Hit
              ? 'supported_top3'
              : top5Hit
                ? 'supported_top5'
                : 'miss',
    }
  })

  const supportedTop1Accuracy =
    supportedQueryCount === 0 ? 0 : top1HitCount / supportedQueryCount
  const supportedTop3Accuracy =
    supportedQueryCount === 0 ? 0 : top3HitCount / supportedQueryCount
  const supportedTop5Accuracy =
    supportedQueryCount === 0 ? 0 : top5HitCount / supportedQueryCount
  const meanReciprocalRank = supportedQueryCount === 0 ? 0 : reciprocalRankSum / supportedQueryCount
  const sourceFamilyAccuracy =
    supportedQueryCount === 0 ? 0 : sourceFamilyAccuracyCount / supportedQueryCount
  const authorityLevelAccuracy =
    supportedQueryCount === 0 ? 0 : authorityLevelAccuracyCount / supportedQueryCount
  const citationAvailability =
    supportedQueryCount === 0 ? 0 : citationAvailabilityCount / supportedQueryCount
  const multiChunkQueries = queries.filter(
    (query) => (query.expectedOutcome ?? 'supported') !== 'unsupported' && (query.expectedChunkIds ?? []).length > 1,
  )
  const multiChunkEvidenceRecall =
    multiChunkQueries.length === 0 ? 0 : multiChunkEvidenceRecallCount / multiChunkQueries.length
  const unsupportedQueryPrecision =
    unsupportedQueryCount === 0 ? 0 : unsupportedCorrectCount / unsupportedQueryCount

  return {
    method: 'keyword_overlap_baseline',
    supportedQueryCount,
    unsupportedQueryCount,
    top1HitCount,
    top3HitCount,
    top5HitCount,
    top1Accuracy: supportedTop1Accuracy,
    top3Accuracy: supportedTop3Accuracy,
    top5Accuracy: supportedTop5Accuracy,
    meanReciprocalRank,
    sourceFamilyAccuracy,
    authorityLevelAccuracy,
    citationAvailability,
    multiChunkEvidenceRecall,
    unsupportedQueryPrecision,
    categoryStats: Object.fromEntries(
      [...categoryStats.entries()].map(([category, stats]) => [
        category,
        {
          queryCount: stats.queryCount,
          top1Accuracy: stats.queryCount === stats.unsupportedCount ? 0 : stats.top1HitCount / Math.max(stats.queryCount - stats.unsupportedCount, 1),
          top3Accuracy: stats.queryCount === stats.unsupportedCount ? 0 : stats.top3HitCount / Math.max(stats.queryCount - stats.unsupportedCount, 1),
          top5Accuracy: stats.queryCount === stats.unsupportedCount ? 0 : stats.top5HitCount / Math.max(stats.queryCount - stats.unsupportedCount, 1),
          meanReciprocalRank: stats.queryCount === stats.unsupportedCount ? 0 : stats.mrrSum / Math.max(stats.queryCount - stats.unsupportedCount, 1),
          unsupportedCount: stats.unsupportedCount,
          unsupportedPrecision: stats.unsupportedCount === 0 ? 0 : stats.unsupportedCorrectCount / stats.unsupportedCount,
        },
      ]),
    ),
    queries: queryResults,
  }
}

export const buildRetrievalMarkdown = (evaluation) => {
  const lines = [
    '# Retrieval evaluation',
    '',
    `- Method: \`${evaluation.method}\``,
    `- Supported queries: ${evaluation.supportedQueryCount}`,
    `- Unsupported queries: ${evaluation.unsupportedQueryCount}`,
    `- Top-1 accuracy: ${(evaluation.top1Accuracy * 100).toFixed(0)}%`,
    `- Top-3 accuracy: ${(evaluation.top3Accuracy * 100).toFixed(0)}%`,
    `- Top-5 accuracy: ${(evaluation.top5Accuracy * 100).toFixed(0)}%`,
    `- Mean reciprocal rank: ${evaluation.meanReciprocalRank.toFixed(3)}`,
    `- Source-family accuracy: ${(evaluation.sourceFamilyAccuracy * 100).toFixed(0)}%`,
    `- Authority-level accuracy: ${(evaluation.authorityLevelAccuracy * 100).toFixed(0)}%`,
    `- Citation availability: ${(evaluation.citationAvailability * 100).toFixed(0)}%`,
    `- Multi-chunk evidence recall: ${(evaluation.multiChunkEvidenceRecall * 100).toFixed(0)}%`,
    `- Unsupported-query precision: ${(evaluation.unsupportedQueryPrecision * 100).toFixed(0)}%`,
    '',
    '| Query | Category | Expected outcome | Top ranked chunk(s) | Result |',
    '| --- | --- | --- | --- | --- |',
  ]

  for (const query of evaluation.queries) {
    lines.push(
      `| ${query.query.replace(/\|/g, '\\|')} | ${query.queryCategory ?? 'uncategorized'} | ${query.expectedOutcome ?? 'supported'} | ${query.rankedMatches
        .map((match) => `${match.chunkId} (${match.score})`)
        .join('<br>')} | ${query.resultLabel} |`,
    )
  }

  lines.push('')
  lines.push('## Notes')
  lines.push('')
  lines.push('Unsupported queries should return an explicit insufficient-support result instead of weakly matched evidence.')
  lines.push('The ranking baseline is intentionally lightweight and deterministic.')

  return `${lines.join('\n')}\n`
}

const writeJson = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

const main = async () => {
  const args = new Set(process.argv.slice(2))
  const configPath = args.has('--config')
    ? process.argv[process.argv.indexOf('--config') + 1]
    : defaultConfigPath
  const outputRoot = args.has('--output-root')
    ? process.argv[process.argv.indexOf('--output-root') + 1]
    : path.join(repoRoot, 'data', 'processed', 'source_indexes')
  const evaluationDir = path.join(outputRoot, 'evaluation')
  const legacyRetrievalDir = path.join(outputRoot, 'retrieval')
  const questionsPath = path.join(evaluationDir, 'retrieval_questions.json')
  const resultsPath = path.join(evaluationDir, 'retrieval_results.json')
  const legacyResultsPath = path.join(legacyRetrievalDir, 'retrieval-evaluation.json')
  const legacyMarkdownPath = path.join(legacyRetrievalDir, 'retrieval-evaluation.md')

  const config = await readJson(configPath)
  const repositoryManifestPath = path.join(outputRoot, 'repository-manifest.json')
  const repositoryManifest = await readJson(repositoryManifestPath)
  const jsonlPath = path.join(outputRoot, 'exports', 'source_chunks.jsonl')

  const sourcePackages = repositoryManifest.sourcePackages ?? []
  const chunkRecords = (await fs.readFile(jsonlPath, 'utf8'))
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))

  const evaluation = evaluateQueries({
    queries: config.retrievalQueries ?? [],
    chunkRecords,
    sourcePackages,
    unsupportedThreshold: config.retrievalSettings?.unsupportedThreshold ?? 3,
    topN: config.retrievalSettings?.topN ?? 5,
  })

  const questionsDocument = {
    schemaVersion: config.schemaVersion,
    repositoryManifestId: config.pocId,
    method: evaluation.method,
    queryCount: config.retrievalQueries?.length ?? 0,
    queries: config.retrievalQueries ?? [],
    notes: 'Canonical retrieval questions for the source-index POC.',
  }

  await writeJson(questionsPath, questionsDocument)
  await writeJson(resultsPath, {
    schemaVersion: config.schemaVersion,
    evaluationId: `${config.pocId}-retrieval`,
    repositoryManifestId: config.pocId,
    method: evaluation.method,
    supportedQueryCount: evaluation.supportedQueryCount,
    unsupportedQueryCount: evaluation.unsupportedQueryCount,
    top1HitCount: evaluation.top1HitCount,
    top3HitCount: evaluation.top3HitCount,
    top5HitCount: evaluation.top5HitCount,
    top1Accuracy: evaluation.top1Accuracy,
    top3Accuracy: evaluation.top3Accuracy,
    top5Accuracy: evaluation.top5Accuracy,
    meanReciprocalRank: evaluation.meanReciprocalRank,
    sourceFamilyAccuracy: evaluation.sourceFamilyAccuracy,
    authorityLevelAccuracy: evaluation.authorityLevelAccuracy,
    citationAvailability: evaluation.citationAvailability,
    multiChunkEvidenceRecall: evaluation.multiChunkEvidenceRecall,
    unsupportedQueryPrecision: evaluation.unsupportedQueryPrecision,
    categoryStats: evaluation.categoryStats,
    queries: evaluation.queries,
    notes: 'Canonical retrieval evaluation generated from the source-index POC.',
  })

  await writeJson(legacyResultsPath, {
    schemaVersion: config.schemaVersion,
    evaluationId: `${config.pocId}-retrieval`,
    repositoryManifestId: config.pocId,
    method: evaluation.method,
    queryCount: config.retrievalQueries?.length ?? 0,
    top1HitCount: evaluation.top1HitCount,
    top3HitCount: evaluation.top3HitCount,
    top3Coverage:
      (config.retrievalQueries?.length ?? 0) === 0
        ? 0
        : evaluation.top3HitCount / (config.retrievalQueries?.length ?? 1),
    queries: evaluation.queries,
    notes: 'Legacy compatibility retrieval evaluation output.',
  })

  await fs.mkdir(legacyRetrievalDir, { recursive: true })
  await fs.writeFile(legacyMarkdownPath, buildRetrievalMarkdown(evaluation), 'utf8')

  console.log(`Validated retrieval evaluation for ${config.retrievalQueries?.length ?? 0} queries.`)
  console.log(`Wrote retrieval questions to ${path.relative(repoRoot, questionsPath)}`)
  console.log(`Wrote retrieval results to ${path.relative(repoRoot, resultsPath)}`)
}

const invokedAsScript =
  process.argv[1] && path.resolve(process.argv[1]) === __filename

if (invokedAsScript) {
  main().catch((error) => {
    console.error(error.message ?? error)
    process.exitCode = 1
  })
}

export default {
  normalizeText,
  tokenize,
  buildSearchText,
  scoreChunk,
  evaluateQueries,
  buildRetrievalMarkdown,
}
