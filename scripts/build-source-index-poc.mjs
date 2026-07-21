import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRetrievalMarkdown, evaluateQueries, normalizeText } from './evaluate-source-index-retrieval.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes')
const sourcesRoot = path.join(outputRoot, 'sources')
const exportsRoot = path.join(outputRoot, 'exports')
const evaluationRoot = path.join(outputRoot, 'evaluation')
const legacyRetrievalRoot = path.join(outputRoot, 'retrieval')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true })
}

const toBooleanText = (value) => (value ? 'Yes' : 'No')

const csvEscape = (value) => {
  const text = value === null || value === undefined ? '' : String(value)
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

const asArray = (value) => (Array.isArray(value) ? value : [])

const toRelativePosix = (value) => value.replace(/\\/g, '/')

const buildCitationDisplay = (citations) =>
  asArray(citations)
    .map((citation) => citation.citationText)
    .filter(Boolean)
    .join(' | ')

const deriveRequirements = (controlledTags) =>
  asArray(controlledTags).filter((tag) =>
    [
      'regulatory_requirement',
      'reporting_requirement',
      'documentation_expectation',
      'governance_or_control_expectation',
      'jurisdiction_specific_requirement',
    ].includes(tag),
  )

const deriveChunk = (source, chunk, index, sourceIndexPath) => {
  const sourceVersionId = source.sourceVersionId ?? source.sourceIndexId
  const summary = chunk.summary ?? chunk.topic ?? `Chunk ${index + 1}`
  const sourceTextExcerpt = chunk.sourceTextExcerpt ?? summary
  const normalizedTextExcerpt =
    chunk.normalizedTextExcerpt ?? normalizeText(sourceTextExcerpt).toLowerCase()
  const topic = chunk.topic ?? summary
  const headingPath = chunk.headingPath ?? chunk.sectionReference
  const controlledTags = asArray(chunk.controlledTags)
  const keywords = asArray(chunk.keywords)
  const citations = asArray(chunk.citations)
  const chunkRelationships = asArray(chunk.relationships)
  const topLevelRelationships = asArray(source.relationships)
  const relationshipIds = [
    ...topLevelRelationships
      .map((relationship) => relationship.targetSourceId ?? relationship.targetChunkId)
      .filter(Boolean),
    ...chunkRelationships
      .map((relationship) => relationship.targetSourceId ?? relationship.targetChunkId)
      .filter(Boolean),
  ]
  const keyPoints = asArray(chunk.keyPoints).length > 0 ? asArray(chunk.keyPoints) : [summary]
  const concepts = asArray(chunk.concepts).length > 0 ? asArray(chunk.concepts) : controlledTags
  const definedTerms = asArray(chunk.definedTerms).length > 0 ? asArray(chunk.definedTerms) : keywords
  const acronyms = asArray(chunk.acronyms)
  const requirements = asArray(chunk.requirements).length > 0 ? asArray(chunk.requirements) : deriveRequirements(controlledTags)
  const citationDisplay = chunk.citationDisplay ?? buildCitationDisplay(citations)
  const normalizedSearchText = chunk.normalizedSearchText ??
    normalizeText(
      [
        sourceTextExcerpt,
        normalizedTextExcerpt,
        summary,
        topic,
        headingPath,
        chunk.sectionReference,
        source.sourceTitle,
        source.sourceReference,
        keyPoints.join(' '),
        concepts.join(' '),
        definedTerms.join(' '),
        acronyms.join(' '),
        requirements.join(' '),
        citationDisplay,
        controlledTags.join(' '),
        keywords.join(' '),
      ].join(' '),
    ).toLowerCase()

  const derivedChunk = {
    chunkId: chunk.chunkId,
    chunkOrdinal: chunk.chunkOrdinal ?? index + 1,
    chunkKind: chunk.chunkKind ?? 'source_excerpt',
    sourceTextType:
      chunk.sourceTextType ??
      source.chunkDefaults?.sourceTextType ??
      'review_artifact_derived_text',
    pageStart: chunk.pageStart,
    pageEnd: chunk.pageEnd,
    sectionReference: chunk.sectionReference,
    lineReference: chunk.lineReference ?? null,
    sourceTextExcerpt,
    normalizedTextExcerpt,
    summary,
    topic,
    headingPath,
    keyPoints,
    concepts,
    definedTerms,
    acronyms,
    requirements,
    citationDisplay,
    normalizedSearchText,
    canonicalSourceIndexPath: sourceIndexPath,
    sourceVersionId,
    controlledTags,
    keywords,
    citations,
    relationships: chunkRelationships,
    relationshipIds,
    fidelity: chunk.fidelity ?? source.chunkDefaults?.fidelity ?? 'curated',
    confidence: chunk.confidence ?? source.chunkDefaults?.confidence ?? 'high',
    reviewFlags: chunk.reviewFlags ?? source.chunkDefaults?.reviewFlags ?? [],
    qualityNotes: chunk.qualityNotes ?? source.chunkDefaults?.qualityNotes ?? [],
    evidenceNotes: chunk.evidenceNotes ?? source.chunkDefaults?.evidenceNotes ?? '',
    retrievalEligible: chunk.retrievalEligible ?? true,
    promotionEligible: chunk.promotionEligible ?? false,
  }

  return derivedChunk
}

const buildSourceMarkdown = (sourceIndex) => {
  const { source, processing, chunks, quality } = sourceIndex
  const lines = []
  lines.push(`# ${source.sourceTitle}`)
  lines.push('')
  lines.push(`- Source ID: \`${source.sourceId}\``)
  lines.push(`- Source version ID: \`${source.sourceVersionId}\``)
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
  lines.push('| Chunk | Pages | Topic | Kind | Fidelity | Summary |')
  lines.push('| --- | --- | --- | --- | --- | --- |')
  for (const chunk of chunks) {
    lines.push(
      `| \`${chunk.chunkId}\` | pp. ${chunk.pageStart}-${chunk.pageEnd} | ${chunk.topic.replace(/\|/g, '\\|')} | ${chunk.chunkKind} | ${chunk.fidelity} | ${chunk.summary.replace(/\|/g, '\\|')} |`,
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
  lines.push(`- Export manifest: \`${manifest.exports.exportManifestPath}\``)
  lines.push(`- JSONL: \`${manifest.exports.jsonlPath}\``)
  lines.push(`- CSV: \`${manifest.exports.csvPath}\``)
  lines.push(`- Retrieval questions: \`${manifest.exports.retrievalQuestionsPath}\``)
  lines.push(`- Retrieval results: \`${manifest.exports.retrievalResultsPath}\``)
  lines.push(`- Repository manifest: \`${manifest.exports.repositoryManifestPath}\``)
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
  lines.push(`- Supported queries: ${manifest.retrievalEvaluation.supportedQueryCount}`)
  lines.push(`- Unsupported queries: ${manifest.retrievalEvaluation.unsupportedQueryCount}`)
  lines.push(`- Top-1 accuracy: ${(manifest.retrievalEvaluation.top1Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Top-3 accuracy: ${(manifest.retrievalEvaluation.top3Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Top-5 accuracy: ${(manifest.retrievalEvaluation.top5Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Mean reciprocal rank: ${manifest.retrievalEvaluation.meanReciprocalRank.toFixed(3)}`)
  lines.push(`- Method: ${manifest.retrievalEvaluation.method}`)
  return `${lines.join('\n')}\n`
}

const buildExportManifest = (manifest) => ({
  schemaVersion: manifest.schemaVersion,
  exportManifestId: `${manifest.repositoryManifestId}-exports`,
  repositoryManifestId: manifest.repositoryManifestId,
  repositoryName: manifest.repositoryName,
  generatedAt: manifest.generatedAt,
  sourcePackageCount: manifest.sourcePackageCount,
  chunkCount: manifest.chunkCount,
  exportFiles: {
    repositoryManifestPath: manifest.exports.repositoryManifestPath,
    exportManifestPath: manifest.exports.exportManifestPath,
    jsonlPath: manifest.exports.jsonlPath,
    csvPath: manifest.exports.csvPath,
    retrievalQuestionsPath: manifest.exports.retrievalQuestionsPath,
    retrievalResultsPath: manifest.exports.retrievalResultsPath,
    legacyJsonlPath: 'data/processed/source_indexes/exports/source-indexes.jsonl',
    legacyCsvPath: 'data/processed/source_indexes/exports/source-indexes.csv',
    legacyRetrievalJsonPath: 'data/processed/source_indexes/retrieval/retrieval-evaluation.json',
    legacyRetrievalMarkdownPath: 'data/processed/source_indexes/retrieval/retrieval-evaluation.md',
  },
  notes: 'Canonical source-index export manifest for the POC.',
  extensions: {
    sourceIndexPoc: true,
  },
})

const buildRetrievalReadinessReport = (manifest, evaluation, config) => {
  const lines = []
  lines.push('# Retrieval readiness report')
  lines.push('')
  lines.push('## Corpus summary')
  lines.push('')
  lines.push(`- Source packages: ${manifest.sourcePackageCount}`)
  lines.push(`- Canonical chunks: ${manifest.chunkCount}`)
  lines.push(`- Retrieval questions: ${evaluation.queries.length}`)
  lines.push(`- Supported questions: ${evaluation.supportedQueryCount}`)
  lines.push(`- Unsupported questions: ${evaluation.unsupportedQueryCount}`)
  lines.push('')
  lines.push('## Metrics')
  lines.push('')
  lines.push(`- Top-1 accuracy: ${(evaluation.top1Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Top-3 accuracy: ${(evaluation.top3Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Top-5 accuracy: ${(evaluation.top5Accuracy * 100).toFixed(0)}%`)
  lines.push(`- Mean reciprocal rank: ${evaluation.meanReciprocalRank.toFixed(3)}`)
  lines.push(`- Source-family accuracy: ${(evaluation.sourceFamilyAccuracy * 100).toFixed(0)}%`)
  lines.push(`- Authority-level accuracy: ${(evaluation.authorityLevelAccuracy * 100).toFixed(0)}%`)
  lines.push(`- Citation availability: ${(evaluation.citationAvailability * 100).toFixed(0)}%`)
  lines.push(`- Multi-chunk evidence recall: ${(evaluation.multiChunkEvidenceRecall * 100).toFixed(0)}%`)
  lines.push(`- Unsupported-query precision: ${(evaluation.unsupportedQueryPrecision * 100).toFixed(0)}%`)
  lines.push('')
  lines.push('## Category breakdown')
  lines.push('')
  lines.push('| Category | Count | Top-1 | Top-3 | Top-5 | MRR | Unsupported precision |')
  lines.push('| --- | --- | --- | --- | --- | --- | --- |')
  for (const [category, stats] of Object.entries(evaluation.categoryStats)) {
    lines.push(
      `| ${category} | ${stats.queryCount} | ${(stats.top1Accuracy * 100).toFixed(0)}% | ${(stats.top3Accuracy * 100).toFixed(0)}% | ${(stats.top5Accuracy * 100).toFixed(0)}% | ${stats.meanReciprocalRank.toFixed(3)} | ${(stats.unsupportedPrecision * 100).toFixed(0)}% |`,
    )
  }
  lines.push('')
  lines.push('## Strong signals')
  lines.push('')
  lines.push('- Exact-title questions for AG 01, AG 03, VM-20, and the companion/regulation sources are expected to rank cleanly.')
  lines.push('- Relationship-aware questions should distinguish the AG 36 active source from the 2021 Law Manual reprint.')
  lines.push('- Companion guidance and non-binding educational material should remain visible as lower-authority evidence.')
  lines.push('')
  lines.push('## Weak spots and failure analysis')
  lines.push('')
  const weakQueries = evaluation.queries.filter((query) => query.resultLabel === 'miss' || query.resultLabel === 'false_positive')
  if (weakQueries.length === 0) {
    lines.push('- No weak queries were observed in the current POC run.')
  } else {
    for (const query of weakQueries) {
      lines.push(
        `- ${query.queryCategory}: ${query.query} -> ${query.resultLabel}; top result ${query.rankedMatches[0]?.chunkId ?? 'n/a'} (${query.rankedMatches[0]?.score ?? 0})`,
      )
    }
  }
  lines.push('')
  lines.push('## Next improvement opportunities')
  lines.push('')
  lines.push('- Add more ambiguous cross-source queries if the current corpus becomes too easy.')
  lines.push('- Increase the share of relationship-heavy questions if reprint and companion-source handling needs more pressure.')
  lines.push('- Add a small synthetic pricing or liability-modeling sample later only if the generic profiles need an empirical corpus test.')
  return `${lines.join('\n')}\n`
}

const main = async () => {
  const config = await readJson(configPath)
  await ensureDir(outputRoot)
  await ensureDir(sourcesRoot)
  await ensureDir(exportsRoot)
  await ensureDir(evaluationRoot)
  await ensureDir(legacyRetrievalRoot)

  const chunkRecords = []
  const sourcePackages = []

  for (const source of config.sources) {
    const sourceVersionId = source.sourceVersionId ?? source.sourceIndexId
    const sourceIndexPath = path.join(sourcesRoot, `${source.sourceId}.json`)
    const markdownPath = path.join(sourcesRoot, `${source.sourceId}.md`)
    const sourceRelationships = asArray(source.relationships)
    const sourceChunks = asArray(source.chunks).map((chunk, index) =>
      deriveChunk(
        {
          ...source,
          sourceVersionId,
          chunkDefaults: source.chunkDefaults ?? {},
          relationships: sourceRelationships,
        },
        chunk,
        index,
        toRelativePosix(path.relative(repoRoot, sourceIndexPath)),
      ),
    )

    const sourceIndex = {
      schemaVersion: config.schemaVersion,
      sourceIndexId: source.sourceIndexId,
      repositoryManifestId: config.pocId,
      sourceVersionId,
      source: {
        sourceId: source.sourceId,
        sourceVersionId,
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
        versionDate: source.versionDate ?? null,
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
      chunks: sourceChunks,
      relationships: sourceRelationships,
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

    await fs.writeFile(sourceIndexPath, `${JSON.stringify(sourceIndex, null, 2)}\n`, 'utf8')
    await fs.writeFile(markdownPath, buildSourceMarkdown(sourceIndex), 'utf8')

    sourcePackages.push({
      sourceIndexId: source.sourceIndexId,
      sourceId: source.sourceId,
      sourceVersionId,
      sourceTitle: source.sourceTitle,
      sourceFamilyId: source.sourceFamilyId,
      documentType: source.documentType,
      sourceStatus: source.sourceStatus,
      sourceReference: source.sourceReference,
      jurisdiction: source.jurisdiction,
      authorityLevel: source.authorityLevel,
      pageRange: source.pageRange,
      chunkCount: sourceChunks.length,
      reviewBatchIds: source.reviewBatchIds,
      sourceIndexPath: toRelativePosix(path.relative(repoRoot, sourceIndexPath)),
      markdownPath: toRelativePosix(path.relative(repoRoot, markdownPath)),
      reviewIndexPath: source.reviewIndexPath,
      selfReviewPath: source.selfReviewPath,
      relationships: sourceRelationships,
      textLayerQuality: source.textLayerQuality,
      pageImageBackstop: source.pageImageBackstop,
      lineReferencesAvailable: source.lineReferencesAvailable,
      notes: source.notes,
    })

    for (const chunk of sourceChunks) {
      chunkRecords.push({
        repositoryManifestId: config.pocId,
        sourceIndexId: source.sourceIndexId,
        sourceVersionId,
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
        headingPath: chunk.headingPath,
        sectionReference: chunk.sectionReference,
        topic: chunk.topic,
        lineReference: chunk.lineReference ?? null,
        chunkId: chunk.chunkId,
        chunkOrdinal: chunk.chunkOrdinal,
        chunkKind: chunk.chunkKind,
        sourceTextType: chunk.sourceTextType,
        sourceTextExcerpt: chunk.sourceTextExcerpt,
        normalizedTextExcerpt: chunk.normalizedTextExcerpt,
        normalizedSearchText: chunk.normalizedSearchText,
        summary: chunk.summary,
        keyPoints: chunk.keyPoints,
        concepts: chunk.concepts,
        definedTerms: chunk.definedTerms,
        acronyms: chunk.acronyms,
        requirements: chunk.requirements,
        citationDisplay: chunk.citationDisplay,
        controlledTags: chunk.controlledTags,
        keywords: chunk.keywords,
        reviewFlags: chunk.reviewFlags,
        fidelity: chunk.fidelity,
        confidence: chunk.confidence,
        retrievalEligible: chunk.retrievalEligible,
        promotionEligible: chunk.promotionEligible,
        canonicalSourceIndexPath: chunk.canonicalSourceIndexPath,
        relationshipIds: chunk.relationshipIds,
        relationships: chunk.relationships,
        reviewIndexPath: source.reviewIndexPath,
        selfReviewPath: source.selfReviewPath,
        batchIds: source.reviewBatchIds,
        textLayerQuality: source.textLayerQuality,
        pageImageBackstop: source.pageImageBackstop,
        lineReferencesAvailable: source.lineReferencesAvailable,
      })
    }
  }

  const exportManifest = buildExportManifest({
    schemaVersion: config.schemaVersion,
    repositoryManifestId: config.pocId,
    repositoryName: config.repositoryName,
    generatedAt: new Date().toISOString(),
    sourcePackageCount: sourcePackages.length,
    chunkCount: chunkRecords.length,
    exports: {
      repositoryManifestPath: 'data/processed/source_indexes/repository-manifest.json',
      exportManifestPath: 'data/processed/source_indexes/exports/export_manifest.json',
      jsonlPath: 'data/processed/source_indexes/exports/source_chunks.jsonl',
      csvPath: 'data/processed/source_indexes/exports/source_chunks.csv',
      retrievalQuestionsPath: 'data/processed/source_indexes/evaluation/retrieval_questions.json',
      retrievalResultsPath: 'data/processed/source_indexes/evaluation/retrieval_results.json',
    },
  })

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
      exportManifestPath: 'data/processed/source_indexes/exports/export_manifest.json',
      jsonlPath: 'data/processed/source_indexes/exports/source_chunks.jsonl',
      csvPath: 'data/processed/source_indexes/exports/source_chunks.csv',
      retrievalQuestionsPath: 'data/processed/source_indexes/evaluation/retrieval_questions.json',
      retrievalResultsPath: 'data/processed/source_indexes/evaluation/retrieval_results.json',
      retrievalEvaluationPath: 'data/processed/source_indexes/retrieval/retrieval-evaluation.json',
      notes: 'Canonical source-index POC exports.',
    },
    retrievalEvaluation: {
      evaluationId: `${config.pocId}-retrieval`,
      method: 'keyword_phrase_overlap_baseline',
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

  const evaluation = evaluateQueries({
    queries: config.retrievalQueries,
    chunkRecords,
    sourcePackages,
    unsupportedThreshold: config.retrievalSettings?.unsupportedThreshold ?? 3,
    topN: config.retrievalSettings?.topN ?? 5,
  })

  repositoryManifest.retrievalEvaluation = {
    evaluationId: `${config.pocId}-retrieval`,
    method: evaluation.method,
    queryCount: config.retrievalQueries.length,
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
    top3Coverage: config.retrievalQueries.length === 0 ? 0 : evaluation.top3HitCount / config.retrievalQueries.length,
    notes: `Keyword baseline retrieved ${evaluation.top1HitCount} top-1 hits and ${evaluation.top3HitCount} top-3 hits across ${config.retrievalQueries.length} queries.`,
  }

  const repositoryManifestPath = path.join(outputRoot, 'repository-manifest.json')
  const repositoryManifestMdPath = path.join(outputRoot, 'repository-manifest.md')
  await fs.writeFile(repositoryManifestPath, `${JSON.stringify(repositoryManifest, null, 2)}\n`, 'utf8')
  await fs.writeFile(repositoryManifestMdPath, buildRepositoryMarkdown(repositoryManifest), 'utf8')

  const exportManifestPath = path.join(exportsRoot, 'export_manifest.json')
  await fs.writeFile(exportManifestPath, `${JSON.stringify(exportManifest, null, 2)}\n`, 'utf8')

  const jsonlPath = path.join(exportsRoot, 'source_chunks.jsonl')
  const csvPath = path.join(exportsRoot, 'source_chunks.csv')
  const legacyJsonlPath = path.join(exportsRoot, 'source-indexes.jsonl')
  const legacyCsvPath = path.join(exportsRoot, 'source-indexes.csv')
  const jsonlContent = `${chunkRecords.map((record) => JSON.stringify(record)).join('\n')}\n`
  await fs.writeFile(jsonlPath, jsonlContent, 'utf8')
  await fs.writeFile(legacyJsonlPath, jsonlContent, 'utf8')

  const csvHeaders = [
    'repositoryManifestId',
    'sourceIndexId',
    'sourceVersionId',
    'sourceId',
    'sourceTitle',
    'sourceFamilyId',
    'domainId',
    'documentType',
    'sourceReference',
    'jurisdiction',
    'authorityLevel',
    'sourceStatus',
    'chunkId',
    'chunkOrdinal',
    'chunkKind',
    'sourceTextType',
    'pageStart',
    'pageEnd',
    'pageReference',
    'headingPath',
    'sectionReference',
    'topic',
    'sourceTextExcerpt',
    'normalizedTextExcerpt',
    'normalizedSearchText',
    'summary',
    'keyPoints',
    'concepts',
    'definedTerms',
    'acronyms',
    'requirements',
    'citationDisplay',
    'controlledTags',
    'keywords',
    'fidelity',
    'confidence',
    'retrievalEligible',
    'promotionEligible',
    'relationshipIds',
    'reviewIndexPath',
    'selfReviewPath',
    'batchIds',
    'textLayerQuality',
    'pageImageBackstop',
    'lineReferencesAvailable',
    'canonicalSourceIndexPath',
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
  await fs.writeFile(legacyCsvPath, `${csvLines.join('\n')}`, 'utf8')

  const questionsPath = path.join(evaluationRoot, 'retrieval_questions.json')
  const resultsPath = path.join(evaluationRoot, 'retrieval_results.json')
  const legacyResultsPath = path.join(legacyRetrievalRoot, 'retrieval-evaluation.json')
  const legacyMarkdownPath = path.join(legacyRetrievalRoot, 'retrieval-evaluation.md')

  const questionsDocument = {
    schemaVersion: config.schemaVersion,
    repositoryManifestId: config.pocId,
    method: evaluation.method,
    queryCount: config.retrievalQueries.length,
    queries: config.retrievalQueries,
    notes: 'Canonical retrieval questions for the source-index POC.',
  }
  await fs.writeFile(questionsPath, `${JSON.stringify(questionsDocument, null, 2)}\n`, 'utf8')

  const resultsDocument = {
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
  }
  await fs.writeFile(resultsPath, `${JSON.stringify(resultsDocument, null, 2)}\n`, 'utf8')
  await fs.writeFile(legacyResultsPath, `${JSON.stringify(resultsDocument, null, 2)}\n`, 'utf8')
  await fs.writeFile(legacyMarkdownPath, buildRetrievalMarkdown(evaluation), 'utf8')

  const retrievalReportPath = path.join(repoRoot, 'docs', 'retrieval_readiness_report.md')
  await fs.writeFile(retrievalReportPath, buildRetrievalReadinessReport(repositoryManifest, evaluation, config), 'utf8')

  const sourceIndexReadmePath = path.join(outputRoot, 'README.md')
  const sourceIndexReadme = [
    '# Canonical source-index POC',
    '',
    'This directory contains the backend-neutral canonical source-index proof of concept.',
    '',
    '- `sources/` contains one JSON + Markdown pair per source.',
    '- `exports/` contains the canonical JSONL and CSV exports plus the export manifest.',
    '- `evaluation/` contains the retrieval questions and evaluation results.',
    '- `retrieval/` contains a legacy compatibility summary for earlier handoff notes.',
    '- `repository-manifest.json` ties the package together.',
    '',
    'All files are review-only in the repository context and do not replace the underlying review packets.',
    '',
  ].join('\n')
  await fs.writeFile(sourceIndexReadmePath, `${sourceIndexReadme}\n`, 'utf8')

  console.log(`Built ${sourcePackages.length} canonical source packages and ${chunkRecords.length} chunks.`)
  console.log(`Repository manifest: ${path.relative(repoRoot, repositoryManifestPath)}`)
  console.log(`Export manifest: ${path.relative(repoRoot, exportManifestPath)}`)
  console.log(`Retrieval evaluation top-1 hits: ${evaluation.top1HitCount}/${config.retrievalQueries.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
