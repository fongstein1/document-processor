import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes')
const sourcesRoot = path.join(outputRoot, 'sources')
const exportsRoot = path.join(outputRoot, 'exports')
const retrievalRoot = path.join(outputRoot, 'retrieval')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true })
}

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toBooleanText = (value) => (value ? 'Yes' : 'No')

const csvEscape = (value) => {
  const text = value === null || value === undefined ? '' : String(value)
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

const buildSourceMarkdown = (sourceIndex) => {
  const { source, processing, chunks, quality } = sourceIndex
  const lines = []
  lines.push(`# ${source.sourceTitle}`)
  lines.push('')
  lines.push(`- Source ID: \`${source.sourceId}\``)
  lines.push(`- Source reference: ${source.sourceReference}`)
  lines.push(`- Source family: ${source.sourceFamilyId}`)
  lines.push(`- Domain: ${source.domainId}`)
  lines.push(`- Status: ${source.sourceStatus}`)
  lines.push(`- Authority: ${source.authorityLevel}`)
  lines.push(`- Jurisdiction: ${source.jurisdiction ?? 'n/a'}`)
  lines.push(`- Review batches: ${source.reviewBatchIds.join(', ')}`)
  lines.push(`- Page range: pp. ${source.pageRange.start}-${source.pageRange.end}`)
  lines.push(`- Text layer quality: ${source.textLayerQuality}`)
  lines.push(`- Page-image backstop: ${toBooleanText(source.pageImageBackstop)}`)
  lines.push(`- Line references available: ${toBooleanText(source.lineReferencesAvailable)}`)
  lines.push('')
  lines.push('## Processing')
  lines.push('')
  lines.push(`- Processing mode: ${processing.processingMode}`)
  lines.push(`- Canonicality: ${processing.canonicality}`)
  lines.push(`- Review only: ${toBooleanText(processing.reviewOnly)}`)
  lines.push(`- Learner facing allowed: ${toBooleanText(processing.learnerFacingAllowed)}`)
  lines.push(`- App ready allowed: ${toBooleanText(processing.appReadyAllowed)}`)
  lines.push(`- RAG ready allowed: ${toBooleanText(processing.ragReadyAllowed)}`)
  lines.push(`- Promotion status: ${processing.promotionStatus}`)
  lines.push('')
  lines.push('## Chunks')
  lines.push('')
  lines.push('| Chunk | Pages | Kind | Fidelity | Summary |')
  lines.push('| --- | --- | --- | --- | --- |')
  for (const chunk of chunks) {
    lines.push(
      `| \`${chunk.chunkId}\` | pp. ${chunk.pageStart}-${chunk.pageEnd} | ${chunk.chunkKind} | ${chunk.fidelity} | ${chunk.summary.replace(/\|/g, '\\|')} |`,
    )
  }
  lines.push('')
  lines.push('## Quality Notes')
  lines.push('')
  lines.push(`- Citation completeness: ${quality.citationCompleteness}`)
  lines.push(`- Page-image backstop: ${toBooleanText(quality.pageImageBackstop)}`)
  lines.push(`- Line references available: ${toBooleanText(quality.lineReferencesAvailable)}`)
  lines.push(`- Notes: ${quality.notes}`)
  return `${lines.join('\n')}\n`
}

const buildRepositoryMarkdown = (manifest) => {
  const lines = []
  lines.push(`# ${manifest.repositoryName} canonical source-index POC`)
  lines.push('')
  lines.push(`- Repository purpose: ${manifest.repositoryPurpose}`)
  lines.push(`- Manifest ID: \`${manifest.repositoryManifestId}\``)
  lines.push(`- Canonical layer: ${manifest.canonicalLayer}`)
  lines.push(`- Model version: ${manifest.modelVersion}`)
  lines.push(`- Generated at: ${manifest.generatedAt}`)
  lines.push(`- Source package count: ${manifest.sourcePackageCount}`)
  lines.push(`- Chunk count: ${manifest.chunkCount}`)
  lines.push('')
  lines.push('## Export files')
  lines.push('')
  lines.push(`- JSONL: \`${manifest.exports.jsonlPath}\``)
  lines.push(`- CSV: \`${manifest.exports.csvPath}\``)
  lines.push(`- Repository manifest: \`${manifest.exports.repositoryManifestPath}\``)
  lines.push(`- Retrieval evaluation: \`${manifest.exports.retrievalEvaluationPath}\``)
  lines.push('')
  lines.push('## Source packages')
  lines.push('')
  lines.push('| Source | Pages | Source index | Review posture |')
  lines.push('| --- | --- | --- | --- |')
  for (const pkg of manifest.sourcePackages) {
    lines.push(
      `| ${pkg.sourceTitle.replace(/\|/g, '\\|')} | pp. ${pkg.pageRange.start}-${pkg.pageRange.end} | \`${pkg.sourceIndexPath}\` | review-only |`,
    )
  }
  lines.push('')
  lines.push('## Retrieval summary')
  lines.push('')
  lines.push(`- Queries evaluated: ${manifest.retrievalEvaluation.queryCount}`)
  lines.push(`- Top-1 hits: ${manifest.retrievalEvaluation.top1HitCount}`)
  lines.push(`- Top-3 coverage: ${(manifest.retrievalEvaluation.top3Coverage * 100).toFixed(0)}%`)
  lines.push(`- Method: ${manifest.retrievalEvaluation.method}`)
  return `${lines.join('\n')}\n`
}

const scoreChunk = (query, chunk) => {
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
  ])
  const tokenize = (text) =>
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(/\s+/)
      .filter((token) => token && !stopWords.has(token))
  const queryTokens = new Set(tokenize(query))
  const haystackTokens = new Set(
    tokenize(
      [
        chunk.sourceTextExcerpt,
        chunk.normalizedTextExcerpt,
        chunk.summary,
        chunk.keywords.join(' '),
        chunk.controlledTags.join(' '),
        chunk.sectionReference,
      ].join(' '),
    ),
  )
  let score = 0
  for (const token of queryTokens) {
    if (haystackTokens.has(token)) {
      score += 1
    }
  }
  if (chunk.sourceId && query.toLowerCase().includes(chunk.sourceId.split('-')[0])) {
    score += 0.25
  }
  return score
}

const main = async () => {
  const config = await readJson(configPath)
  await ensureDir(outputRoot)
  await ensureDir(sourcesRoot)
  await ensureDir(exportsRoot)
  await ensureDir(retrievalRoot)

  const chunkRecords = []
  const sourcePackages = []

  for (const source of config.sources) {
    const chunks = source.chunks.map((chunk, index) => ({
      ...chunk,
      chunkOrdinal: chunk.chunkOrdinal ?? index + 1,
      sourceId: source.sourceId,
      sourceIndexId: source.sourceIndexId,
      sourceFamilyId: source.sourceFamilyId,
      domainId: source.domainId,
      documentType: source.documentType,
      sourceTitle: source.sourceTitle,
      sourceReference: source.sourceReference,
      jurisdiction: source.jurisdiction,
      sourceStatus: source.sourceStatus,
      authorityLevel: source.authorityLevel,
      pageRange: source.pageRange,
      reviewBatchIds: source.reviewBatchIds,
      reviewIndexPath: source.reviewIndexPath,
      selfReviewPath: source.selfReviewPath,
      pageImageBackstop: source.pageImageBackstop,
      lineReferencesAvailable: source.lineReferencesAvailable,
      textLayerQuality: source.textLayerQuality,
    }))

    const sourceIndex = {
      schemaVersion: config.schemaVersion,
      sourceIndexId: source.sourceIndexId,
      repositoryManifestId: config.pocId,
      source: {
        sourceId: source.sourceId,
        filename: source.filename,
        filePath: source.filePath,
        sourceFamilyId: source.sourceFamilyId,
        domainId: source.domainId,
        documentType: source.documentType,
        sourceTitle: source.sourceTitle,
        sourceReference: source.sourceReference,
        jurisdiction: source.jurisdiction,
        authorityLevel: source.authorityLevel,
        sourceStatus: source.sourceStatus,
        versionDate: source.versionDate,
        pageCount: source.pageCount,
        pageRange: source.pageRange,
        reviewBatchIds: source.reviewBatchIds,
        reviewIndexPath: source.reviewIndexPath,
        selfReviewPath: source.selfReviewPath,
        pageImageBackstop: source.pageImageBackstop,
        lineReferencesAvailable: source.lineReferencesAvailable,
        textLayerQuality: source.textLayerQuality,
        notes: source.notes,
      },
      processing: {
        createdAt: new Date().toISOString(),
        createdBy: 'scripts/build-source-index-poc.mjs',
        processingMode: 'canonical_index_poc',
        canonicality: 'poc',
        reviewOnly: true,
        learnerFacingAllowed: false,
        appReadyAllowed: false,
        ragReadyAllowed: false,
        promotionStatus: 'not_promoted',
        notes: source.notes,
      },
      chunks: chunks.map((chunk) => ({
        chunkId: chunk.chunkId,
        chunkOrdinal: chunk.chunkOrdinal,
        chunkKind: chunk.chunkKind,
        sourceTextType: chunk.sourceTextType,
        pageStart: chunk.pageStart,
        pageEnd: chunk.pageEnd,
        sectionReference: chunk.sectionReference,
        lineReference: chunk.lineReference ?? null,
        sourceTextExcerpt: chunk.sourceTextExcerpt,
        normalizedTextExcerpt: chunk.normalizedTextExcerpt,
        summary: chunk.summary,
        controlledTags: chunk.controlledTags,
        keywords: chunk.keywords,
        citations: chunk.citations,
        relationships: chunk.relationships ?? [],
        fidelity: chunk.fidelity,
        confidence: chunk.confidence,
        reviewFlags: chunk.reviewFlags ?? chunk.controlledTags,
        qualityNotes: chunk.qualityNotes ?? [],
        evidenceNotes: chunk.evidenceNotes ?? '',
        retrievalEligible: chunk.retrievalEligible,
        promotionEligible: chunk.promotionEligible,
      })),
      relationships: source.relationships ?? [],
      quality: {
        textLayerQuality: source.textLayerQuality,
        citationCompleteness: source.lineReferencesAvailable ? 'mostly_complete' : 'partial',
        pageImageBackstop: source.pageImageBackstop,
        lineReferencesAvailable: source.lineReferencesAvailable,
        notes: source.qualityNotes ?? source.notes,
      },
      exportHints: {
        jsonlEligible: true,
        csvEligible: true,
        vectorEligible: true,
        notes: 'Backend-neutral POC exports generated from review-only batch artifacts.',
      },
      notes: source.notes,
      extensions: {
        batchIds: source.reviewBatchIds,
        sourceIndexGeneratedBy: 'build-source-index-poc',
      },
    }

    const sourcePath = path.join(sourcesRoot, `${source.sourceId}.json`)
    const markdownPath = path.join(sourcesRoot, `${source.sourceId}.md`)
    await fs.writeFile(sourcePath, `${JSON.stringify(sourceIndex, null, 2)}\n`, 'utf8')
    await fs.writeFile(markdownPath, buildSourceMarkdown(sourceIndex), 'utf8')

    sourcePackages.push({
      sourceIndexId: source.sourceIndexId,
      sourceId: source.sourceId,
      sourceTitle: source.sourceTitle,
      sourceFamilyId: source.sourceFamilyId,
      documentType: source.documentType,
      sourceStatus: source.sourceStatus,
      sourceReference: source.sourceReference,
      jurisdiction: source.jurisdiction,
      authorityLevel: source.authorityLevel,
      pageRange: source.pageRange,
      chunkCount: chunks.length,
      reviewBatchIds: source.reviewBatchIds,
      sourceIndexPath: path.relative(repoRoot, sourcePath).replace(/\\/g, '/'),
      markdownPath: path.relative(repoRoot, markdownPath).replace(/\\/g, '/'),
      reviewIndexPath: source.reviewIndexPath,
      selfReviewPath: source.selfReviewPath,
      textLayerQuality: source.textLayerQuality,
      pageImageBackstop: source.pageImageBackstop,
      lineReferencesAvailable: source.lineReferencesAvailable,
      notes: source.notes,
    })

    for (const chunk of chunks) {
      chunkRecords.push({
        repositoryManifestId: config.pocId,
        sourceIndexId: source.sourceIndexId,
        sourceId: source.sourceId,
        sourceTitle: source.sourceTitle,
        sourceFamilyId: source.sourceFamilyId,
        domainId: source.domainId,
        documentType: source.documentType,
        sourceReference: source.sourceReference,
        jurisdiction: source.jurisdiction,
        sourceStatus: source.sourceStatus,
        authorityLevel: source.authorityLevel,
        pageStart: chunk.pageStart,
        pageEnd: chunk.pageEnd,
        pageReference: `pp. ${chunk.pageStart}-${chunk.pageEnd}`,
        sectionReference: chunk.sectionReference,
        lineReference: chunk.lineReference ?? null,
        chunkId: chunk.chunkId,
        chunkOrdinal: chunk.chunkOrdinal,
        chunkKind: chunk.chunkKind,
        sourceTextType: chunk.sourceTextType,
        sourceTextExcerpt: chunk.sourceTextExcerpt,
        normalizedTextExcerpt: chunk.normalizedTextExcerpt,
        summary: chunk.summary,
        controlledTags: chunk.controlledTags,
        keywords: chunk.keywords,
        reviewFlags: chunk.reviewFlags ?? chunk.controlledTags,
        fidelity: chunk.fidelity,
        confidence: chunk.confidence,
        retrievalEligible: chunk.retrievalEligible,
        promotionEligible: chunk.promotionEligible,
        reviewIndexPath: source.reviewIndexPath,
        selfReviewPath: source.selfReviewPath,
        batchIds: source.reviewBatchIds,
        textLayerQuality: source.textLayerQuality,
        pageImageBackstop: source.pageImageBackstop,
        lineReferencesAvailable: source.lineReferencesAvailable,
      })
    }
  }

  const repositoryManifest = {
    schemaVersion: config.schemaVersion,
    repositoryManifestId: config.pocId,
    repositoryName: config.repositoryName,
    repositoryPurpose: config.repositoryPurpose,
    generatedAt: new Date().toISOString(),
    canonicalLayer: 'source-index',
    modelVersion: config.modelVersion,
    domainProfiles: config.domainProfiles,
    sourcePackageCount: sourcePackages.length,
    sourcePackages,
    chunkCount: chunkRecords.length,
    exports: {
      repositoryManifestPath: 'data/processed/source_indexes/repository-manifest.json',
      jsonlPath: 'data/processed/source_indexes/exports/source-indexes.jsonl',
      csvPath: 'data/processed/source_indexes/exports/source-indexes.csv',
      retrievalEvaluationPath: 'data/processed/source_indexes/retrieval/retrieval-evaluation.json',
      notes: 'Canonical source-index POC exports.',
    },
    retrievalEvaluation: {
      evaluationId: `${config.pocId}-retrieval`,
      method: 'keyword_overlap_baseline',
      queryCount: config.retrievalQueries.length,
      top1HitCount: 0,
      top3Coverage: 0,
      notes: 'Filled after retrieval evaluation runs.',
    },
    notes: 'Canonical source-index proof of concept.',
    extensions: {
      sourceIndexPoc: true,
    },
  }

  const evaluationResults = []
  let top1HitCount = 0
  let top3HitCount = 0
  const normalizedChunks = chunkRecords.map((chunk) => ({
    ...chunk,
    searchableText: [
      chunk.sourceTextExcerpt,
      chunk.normalizedTextExcerpt,
      chunk.summary,
      chunk.keywords.join(' '),
      chunk.controlledTags.join(' '),
      chunk.sectionReference,
      chunk.sourceTitle,
    ]
      .join(' ')
      .toLowerCase(),
  }))

  for (const query of config.retrievalQueries) {
    const ranked = normalizedChunks
      .map((chunk) => ({
        chunkId: chunk.chunkId,
        sourceId: chunk.sourceId,
        score: scoreChunk(query.query, chunk),
      }))
      .sort((left, right) => right.score - left.score || left.chunkId.localeCompare(right.chunkId))
    const topMatches = ranked.slice(0, 3)
    const top1Hit = topMatches[0] && query.expectedChunkIds.includes(topMatches[0].chunkId)
    const top3Hit = topMatches.some((match) => query.expectedChunkIds.includes(match.chunkId))
    if (top1Hit) {
      top1HitCount += 1
    }
    if (top3Hit) {
      top3HitCount += 1
    }
    evaluationResults.push({
      ...query,
      rankedMatches: topMatches,
      top1Hit,
      top3Hit
    })
  }

  repositoryManifest.retrievalEvaluation.top1HitCount = top1HitCount
  repositoryManifest.retrievalEvaluation.top3Coverage =
    config.retrievalQueries.length === 0 ? 0 : top3HitCount / config.retrievalQueries.length
  repositoryManifest.retrievalEvaluation.notes = `Keyword baseline retrieved ${top1HitCount} top-1 hits and ${top3HitCount} top-3 hits across ${config.retrievalQueries.length} queries.`

  const repositoryManifestPath = path.join(outputRoot, 'repository-manifest.json')
  const repositoryManifestMd = path.join(outputRoot, 'repository-manifest.md')
  await fs.writeFile(repositoryManifestPath, `${JSON.stringify(repositoryManifest, null, 2)}\n`, 'utf8')
  await fs.writeFile(repositoryManifestMd, buildRepositoryMarkdown(repositoryManifest), 'utf8')

  const jsonlPath = path.join(exportsRoot, 'source-indexes.jsonl')
  const csvPath = path.join(exportsRoot, 'source-indexes.csv')
  const jsonlContent = `${chunkRecords.map((record) => JSON.stringify(record)).join('\n')}\n`
  await fs.writeFile(jsonlPath, jsonlContent, 'utf8')

  const csvHeaders = [
    'repositoryManifestId',
    'sourceIndexId',
    'sourceId',
    'chunkId',
    'chunkOrdinal',
    'sourceFamilyId',
    'documentType',
    'sourceStatus',
    'pageStart',
    'pageEnd',
    'sectionReference',
    'summary',
    'controlledTags',
    'keywords',
    'reviewIndexPath',
    'selfReviewPath',
    'batchIds',
    'textLayerQuality',
    'pageImageBackstop',
    'lineReferencesAvailable',
  ]
  const csvLines = [csvHeaders.join(',')]
  for (const record of chunkRecords) {
    csvLines.push(
      csvHeaders
        .map((header) => {
          const value = record[header]
          if (Array.isArray(value)) {
            return csvEscape(value.join('|'))
          }
          if (typeof value === 'boolean') {
            return value ? 'true' : 'false'
          }
          return csvEscape(value)
        })
        .join(','),
    )
  }
  csvLines.push('')
  await fs.writeFile(csvPath, `${csvLines.join('\n')}`, 'utf8')

  const evaluationPath = path.join(retrievalRoot, 'retrieval-evaluation.json')
  const evaluationMdPath = path.join(retrievalRoot, 'retrieval-evaluation.md')
  const evaluationDocument = {
    schemaVersion: config.schemaVersion,
    evaluationId: `${config.pocId}-retrieval`,
    repositoryManifestId: config.pocId,
    method: 'keyword_overlap_baseline',
    queryCount: config.retrievalQueries.length,
    top1HitCount,
    top3HitCount,
    top3Coverage:
      config.retrievalQueries.length === 0 ? 0 : top3HitCount / config.retrievalQueries.length,
    queries: evaluationResults,
    notes: 'POC retrieval evaluation generated from the canonical source-index layer.',
  }
  await fs.writeFile(evaluationPath, `${JSON.stringify(evaluationDocument, null, 2)}\n`, 'utf8')

  const evaluationMdLines = [
    '# Retrieval evaluation',
    '',
    `- Evaluation ID: \`${evaluationDocument.evaluationId}\``,
    `- Method: ${evaluationDocument.method}`,
    `- Queries: ${evaluationDocument.queryCount}`,
    `- Top-1 hits: ${evaluationDocument.top1HitCount}`,
    `- Top-3 coverage: ${(evaluationDocument.top3Coverage * 100).toFixed(0)}%`,
    '',
    '| Query | Expected chunk(s) | Top ranked chunk(s) | Top-1 hit | Top-3 hit |',
    '| --- | --- | --- | --- | --- |',
  ]
  for (const query of evaluationDocument.queries) {
    evaluationMdLines.push(
      `| ${query.query.replace(/\|/g, '\\|')} | ${query.expectedChunkIds.join('<br>')} | ${query.rankedMatches
        .map((match) => `${match.chunkId} (${match.score})`)
        .join('<br>')} | ${query.top1Hit ? 'Yes' : 'No'} | ${query.top3Hit ? 'Yes' : 'No'} |`,
    )
  }
  evaluationMdLines.push('')
  evaluationMdLines.push('## Notes')
  evaluationMdLines.push('')
  evaluationMdLines.push('This baseline is intentionally lightweight and offline. It exists to prove the POC contract, not to replace a production search backend.')
  await fs.writeFile(evaluationMdPath, `${evaluationMdLines.join('\n')}\n`, 'utf8')

  const sourceIndexReadmePath = path.join(outputRoot, 'README.md')
  const sourceIndexReadme = [
    '# Canonical source-index POC',
    '',
    'This directory contains the backend-neutral canonical source-index proof of concept.',
    '',
    '- `sources/` contains one JSON + Markdown pair per source.',
    '- `exports/` contains flat JSONL and CSV exports for downstream backends.',
    '- `retrieval/` contains a lightweight retrieval baseline and its human-readable summary.',
    '- `repository-manifest.json` ties the package together.',
    '',
    'All files are review-only in the repository context and do not replace the underlying review packets.',
    '',
  ].join('\n')
  await fs.writeFile(sourceIndexReadmePath, `${sourceIndexReadme}\n`, 'utf8')

  console.log(`Built ${sourcePackages.length} canonical source packages and ${chunkRecords.length} chunks.`)
  console.log(`Repository manifest: ${path.relative(repoRoot, repositoryManifestPath)}`)
  console.log(`Retrieval evaluation top-1 hits: ${top1HitCount}/${config.retrievalQueries.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
