import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const parseArgs = (argv) => {
  const args = {}
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const value = argv[index + 1]
    if (value && !value.startsWith('--')) {
      args[key] = value
      index += 1
    } else {
      args[key] = true
    }
  }
  return args
}

const resolvePath = (value, baseDir = repoRoot) => {
  if (!value) return null
  return path.isAbsolute(value) ? value : path.resolve(baseDir, value)
}

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
const writeText = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${value}\n`, 'utf8')
}

const fail = (message) => {
  throw new Error(message)
}

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const relativeRepoPath = (filePath) => filePath.replace(`${repoRoot}${path.sep}`, '').split(path.sep).join('/')

const profileDomainMap = {
  regulatory: 'naic_regulatory',
  pricing: 'pricing_documents',
  liability_modeling: 'liability_modeling',
  governance: 'actuarial_governance',
  product: 'product_documents',
  reporting: 'reporting_documents',
}

const domainForProfile = (profile) => profileDomainMap[profile] ?? profile

const ensureReviewOnly = (value, label) => {
  if (value?.reviewOnly !== true || value?.learnerFacingAllowed !== false || value?.appReadyAllowed !== false || value?.ragReadyAllowed !== false) {
    fail(`${label} must remain review-only and block downstream promotion.`)
  }
}

const buildClassification = (record, reviewed) => {
  const classification = {
    ...(record.classification ?? {}),
    ...(reviewed.classification ?? {}),
  }
  const profile = reviewed.selectedProfile ?? record.selectedProfile ?? classification.recommendedProfile ?? 'regulatory'
  return {
    domainId: classification.domainId ?? domainForProfile(profile),
    subdomainId: classification.subdomainId ?? null,
    documentType: classification.documentType ?? reviewed.documentType ?? record.documentType ?? 'source_document',
    purpose: classification.purpose ?? reviewed.notes ?? reviewed.sourceTitle ?? record.title,
    intendedAudience: classification.intendedAudience ?? 'document reviewers',
    authoritySourceType: classification.authoritySourceType ?? reviewed.authorityLevel ?? 'source_document',
    confidentiality: classification.confidentiality ?? 'internal',
    publicationDate: classification.publicationDate ?? null,
    effectiveDate: classification.effectiveDate ?? null,
    version: classification.version ?? reviewed.sourceVersionId,
    language: classification.language ?? 'en',
    recommendedProfile: classification.recommendedProfile ?? profile,
    recommendedChunkingStrategy: classification.recommendedChunkingStrategy ?? 'deterministic_topic_slices',
    confidence: classification.confidence ?? 'medium',
    unresolvedQuestions: classification.unresolvedQuestions ?? [],
    notes: classification.notes ?? '',
  }
}

const buildSourceMarkdown = (sourceIndex) => {
  const source = sourceIndex.source
  const lines = [
    `# ${source.sourceTitle}`,
    '',
    `- Source ID: \`${source.sourceId}\``,
    `- Source reference: ${source.sourceReference}`,
    `- Source family: ${source.sourceFamilyId}`,
    `- Document type: ${source.documentType}`,
    `- Status: ${source.sourceStatus}`,
    `- Review batches: ${source.reviewBatchIds.join(', ')}`,
    `- Page range: pp. ${source.pageRange.start}-${source.pageRange.end}`,
    `- Review only: Yes`,
    `- Learner-facing allowed: No`,
    `- App-ready allowed: No`,
    `- RAG-ready allowed: No`,
    '',
    '## Classification',
    '',
    `- Domain: ${source.classification.domainId}`,
    `- Profile: ${source.classification.recommendedProfile}`,
    `- Authority/source type: ${source.classification.authoritySourceType}`,
    `- Confidence: ${source.classification.confidence}`,
    '',
    '## Chunks',
    '',
    '| Chunk | Pages | Topic | Summary |',
    '| --- | --- | --- | --- |',
  ]
  for (const chunk of sourceIndex.chunks) {
    lines.push(`| \`${chunk.chunkId}\` | pp. ${chunk.pageStart}-${chunk.pageEnd} | ${chunk.sectionReference ?? chunk.chunkKind} | ${chunk.summary.replace(/\|/g, '\\|')} |`)
  }
  lines.push('', '## Review posture', '', '- This package is a review-only canonical POC artifact.', '- It is not learner-facing, app-ready, RAG-ready, or promoted.', '')
  return lines.join('\n')
}

const csvEscape = (value) => {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const buildRepositoryMarkdown = (manifest) => {
  const lines = [
    `# ${manifest.repositoryName}`,
    '',
    `- Manifest ID: \`${manifest.repositoryManifestId}\``,
    `- Canonical layer: ${manifest.canonicalLayer}`,
    `- Source packages: ${manifest.sourcePackageCount}`,
    `- Chunks: ${manifest.chunkCount}`,
    `- Retrieval evaluation: pending reviewed query set`,
    '',
    '## Review posture',
    '',
    '- Review-only POC output.',
    '- Not learner-facing, app-ready, RAG-ready, or promoted.',
    '',
    '## Source packages',
    '',
    '| Source | Pages | Package |',
    '| --- | --- | --- |',
  ]
  for (const source of manifest.sourcePackages) {
    lines.push(`| ${source.sourceTitle.replace(/\|/g, '\\|')} | pp. ${source.pageRange.start}-${source.pageRange.end} | \`${source.sourceIndexPath}\` |`)
  }
  return lines.join('\n')
}

const main = async () => {
  const args = parseArgs(process.argv)
  const intakePath = resolvePath(args.intake)
  const reviewedPackPath = resolvePath(args['reviewed-packages'])
  const outputDir = resolvePath(args['output-dir'])
  if (!intakePath || !reviewedPackPath || !outputDir) {
    throw new Error('Required arguments: --intake, --reviewed-packages, and --output-dir.')
  }

  const intake = await readJson(intakePath)
  const reviewedPack = await readJson(reviewedPackPath)
  ensureReviewOnly(intake, 'Intake source-index input')
  ensureReviewOnly(reviewedPack, 'Reviewed source pack')
  if (reviewedPack.handoffType !== 'family_intake_reviewed_source_pack') {
    fail('Reviewed source pack has an unexpected handoffType.')
  }
  if (reviewedPack.familyId !== intake.familyId) {
    fail('Reviewed source pack familyId does not match intake source-index input.')
  }
  if (!Array.isArray(intake.sourceRecords) || intake.sourceRecords.length === 0) {
    fail('Intake source-index input must contain sourceRecords.')
  }

  const recordsById = new Map(intake.sourceRecords.map((record) => [record.sourceId, record]))
  const sourceIndexes = []
  const sourcePackages = []
  const chunkRecords = []
  const outputSourceDir = path.join(outputDir, 'sources')

  for (const reviewed of reviewedPack.sourcePackages ?? []) {
    const record = recordsById.get(reviewed.sourceId)
    if (!record) fail(`Reviewed package source is not present in intake input: ${reviewed.sourceId}`)
    if (!Array.isArray(reviewed.chunks) || reviewed.chunks.length === 0) {
      fail(`Reviewed package has no chunks: ${reviewed.sourceId}`)
    }
    if (reviewed.chunks.some((chunk) => chunk.promotionEligible !== false)) {
      fail(`Reviewed package contains a promotable chunk: ${reviewed.sourceId}`)
    }

    const filenameSlug = slugify(reviewed.sourceIndexId)
    const sourceJsonPath = path.join(outputSourceDir, `${filenameSlug}.json`)
    const sourceMarkdownPath = path.join(outputSourceDir, `${filenameSlug}.md`)
    const sourceIndexPath = relativeRepoPath(sourceJsonPath)
    const sourceMarkdownRelativePath = relativeRepoPath(sourceMarkdownPath)
    const classification = buildClassification(record, reviewed)
    const chunks = reviewed.chunks.map((chunk) => ({
      ...chunk,
      sourceVersionId: chunk.sourceVersionId ?? reviewed.sourceVersionId,
      canonicalSourceIndexPath: sourceIndexPath,
      promotionEligible: false,
    }))
    const sourceIndex = {
      schemaVersion: '1.0',
      sourceIndexId: reviewed.sourceIndexId,
      repositoryManifestId: `${intake.familyId}-source-index-poc`,
      source: {
        classification,
        sourceId: reviewed.sourceId,
        filename: reviewed.filename ?? record.filename,
        filePath: record.sourcePath,
        sourceFamilyId: record.sourceFamilyId,
        domainId: classification.domainId,
        documentType: classification.documentType,
        sourceTitle: reviewed.sourceTitle ?? record.title,
        sourceReference: reviewed.sourceReference,
        jurisdiction: reviewed.jurisdiction ?? null,
        sourceStatus: reviewed.sourceStatus,
        authorityLevel: reviewed.authorityLevel ?? classification.authoritySourceType,
        reviewBatchIds: reviewed.reviewBatchIds,
        reviewIndexPath: reviewed.reviewIndexPath,
        selfReviewPath: reviewed.selfReviewPath,
        pageImageBackstop: reviewed.pageImageBackstop,
        lineReferencesAvailable: reviewed.lineReferencesAvailable,
        textLayerQuality: reviewed.textLayerQuality,
        pageCount: reviewed.pageRange.end,
        pageRange: reviewed.pageRange,
        notes: reviewed.notes ?? '',
      },
      processing: {
        createdAt: new Date().toISOString(),
        createdBy: 'document-family-intake-adapter',
        processingMode: 'canonical_index_poc',
        canonicality: 'poc',
        reviewOnly: true,
        learnerFacingAllowed: false,
        appReadyAllowed: false,
        ragReadyAllowed: false,
        promotionStatus: 'not_promoted',
        notes: 'Built from intake metadata and reviewed source-bound chunks; retrieval evaluation remains pending.',
      },
      chunks,
      relationships: reviewed.relationships ?? [],
      quality: {
        textLayerQuality: reviewed.textLayerQuality,
        citationCompleteness: reviewed.quality?.citationCompleteness ?? 'complete',
        pageImageBackstop: reviewed.pageImageBackstop,
        lineReferencesAvailable: reviewed.lineReferencesAvailable,
        notes: reviewed.quality?.notes ?? 'Citations and review locators come from the reviewed source pack.',
      },
      exportHints: {
        jsonlEligible: true,
        csvEligible: true,
        vectorEligible: false,
        notes: 'Retrieval and vector promotion remain pending human review.',
      },
      notes: 'Review-only family intake adapter output.',
    }
    await writeJson(sourceJsonPath, sourceIndex)
    await writeText(sourceMarkdownPath, buildSourceMarkdown(sourceIndex))
    sourceIndexes.push(sourceIndex)
    sourcePackages.push({
      sourceIndexId: reviewed.sourceIndexId,
      classification,
      sourceId: reviewed.sourceId,
      sourceTitle: reviewed.sourceTitle ?? record.title,
      sourceFamilyId: record.sourceFamilyId,
      documentType: classification.documentType,
      sourceStatus: reviewed.sourceStatus,
      sourceReference: reviewed.sourceReference,
      sourceVersionId: reviewed.sourceVersionId,
      jurisdiction: reviewed.jurisdiction ?? null,
      authorityLevel: reviewed.authorityLevel ?? classification.authoritySourceType,
      pageRange: reviewed.pageRange,
      chunkCount: chunks.length,
      reviewBatchIds: reviewed.reviewBatchIds,
      sourceIndexPath,
      markdownPath: sourceMarkdownRelativePath,
      reviewIndexPath: reviewed.reviewIndexPath,
      selfReviewPath: reviewed.selfReviewPath,
      textLayerQuality: reviewed.textLayerQuality,
      pageImageBackstop: reviewed.pageImageBackstop,
      lineReferencesAvailable: reviewed.lineReferencesAvailable,
      relationships: reviewed.relationships ?? [],
      notes: reviewed.notes ?? '',
    })
    chunkRecords.push(...chunks.map((chunk) => ({
      repositoryManifestId: `${intake.familyId}-source-index-poc`,
      sourceIndexId: reviewed.sourceIndexId,
      sourceVersionId: reviewed.sourceVersionId,
      sourceId: reviewed.sourceId,
      sourceTitle: reviewed.sourceTitle ?? record.title,
      sourceFamilyId: record.sourceFamilyId,
      documentType: classification.documentType,
      sourceReference: reviewed.sourceReference,
      jurisdiction: reviewed.jurisdiction ?? null,
      sourceStatus: reviewed.sourceStatus,
      pageStart: chunk.pageStart,
      pageEnd: chunk.pageEnd,
      pageReference: `pp. ${chunk.pageStart}-${chunk.pageEnd}`,
      headingPath: chunk.sectionReference ?? null,
      sectionReference: chunk.sectionReference ?? null,
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
      citations: chunk.citations,
      retrievalEligible: chunk.retrievalEligible,
      promotionEligible: false,
    })))
  }

  if (sourceIndexes.length === 0) fail('Reviewed source pack must contain at least one source package.')
  const generatedAt = new Date().toISOString()
  const repositoryManifestPath = relativeRepoPath(path.join(outputDir, 'repository-manifest.json'))
  const repositoryManifest = {
    schemaVersion: '1.0',
    repositoryManifestId: `${intake.familyId}-source-index-poc`,
    repositoryName: `${intake.familyName} source-index POC`,
    repositoryPurpose: 'Review-only canonical source-index package generated from a document-family intake handoff.',
    generatedAt,
    canonicalLayer: 'source-index',
    modelVersion: '1.0',
    domainProfiles: Array.from(new Set(sourcePackages.map((source) => source.classification.recommendedProfile))).map((profile) => ({
      domainId: domainForProfile(profile),
      profileName: profile,
      profilePath: `docs/domain_profiles/${profile}_profile.md`,
      notes: 'Profile selected during family intake; verify before promotion.',
    })),
    sourcePackageCount: sourcePackages.length,
    sourcePackages,
    chunkCount: chunkRecords.length,
    exports: {
      repositoryManifestPath,
      exportManifestPath: relativeRepoPath(path.join(outputDir, 'export_manifest.json')),
      jsonlPath: relativeRepoPath(path.join(outputDir, 'source_chunks.jsonl')),
      csvPath: relativeRepoPath(path.join(outputDir, 'source_chunks.csv')),
      retrievalQuestionsPath: relativeRepoPath(path.join(outputDir, 'retrieval-test-handoff.json')),
      retrievalResultsPath: relativeRepoPath(path.join(outputDir, 'retrieval-results-pending.json')),
      retrievalEvaluationPath: relativeRepoPath(path.join(outputDir, 'retrieval-evaluation-pending.json')),
      notes: 'Canonical POC exports are review-only; retrieval evaluation is pending reviewed queries.',
    },
    retrievalEvaluation: {
      evaluationId: `${intake.familyId}-retrieval-pending`,
      method: 'pending_reviewed_query_set',
      queryCount: 0,
      top1HitCount: 0,
      top3Coverage: 0,
      notes: 'No retrieval claims are made until human-reviewed queries are added.',
    },
    notes: 'Generated by the family-intake adapter; not promoted.',
  }

  const csvHeader = 'sourceId,sourceTitle,chunkId,chunkOrdinal,pageStart,pageEnd,topic,summary,sourceReference,promotionEligible'
  const csvLines = [csvHeader, ...chunkRecords.map((chunk) => [
    chunk.sourceId,
    chunk.sourceTitle,
    chunk.chunkId,
    chunk.chunkOrdinal,
    chunk.pageStart,
    chunk.pageEnd,
    chunk.sectionReference,
    chunk.summary,
    chunk.sourceReference,
    false,
  ].map((value) => {
    const text = value === null || value === undefined ? '' : String(value)
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }).join(','))]

  await writeJson(path.join(outputDir, 'repository-manifest.json'), repositoryManifest)
  await writeText(path.join(outputDir, 'repository-manifest.md'), buildRepositoryMarkdown(repositoryManifest))
  await writeText(path.join(outputDir, 'source_chunks.jsonl'), chunkRecords.map((chunk) => JSON.stringify(chunk)).join('\n'))
  await writeText(path.join(outputDir, 'source_chunks.csv'), csvLines.join('\n'))
  await writeJson(path.join(outputDir, 'export_manifest.json'), {
    schemaVersion: '1.0',
    exportManifestId: `${repositoryManifest.repositoryManifestId}-exports`,
    repositoryManifestId: repositoryManifest.repositoryManifestId,
    generatedAt,
    sourcePackageCount: sourcePackages.length,
    chunkCount: chunkRecords.length,
    exportFiles: repositoryManifest.exports,
    reviewOnly: true,
    promotionStatus: 'not_promoted',
  })
  await writeJson(path.join(outputDir, 'retrieval-test-handoff.json'), {
    schemaVersion: '1.0',
    handoffType: 'family_intake_retrieval_test_handoff',
    generatedAt,
    familyId: intake.familyId,
    retrievalTestStatus: 'pending_reviewed_query_set',
    reviewOnly: true,
    learnerFacingAllowed: false,
    appReadyAllowed: false,
    ragReadyAllowed: false,
    candidateSourceIds: sourcePackages.map((source) => source.sourceId),
    testQueries: [],
    nextStep: 'Add human-reviewed retrieval queries after source package review.',
  })
  await writeJson(path.join(outputDir, 'retrieval-results-pending.json'), {
    schemaVersion: '1.0',
    repositoryManifestId: repositoryManifest.repositoryManifestId,
    retrievalEvaluationStatus: 'pending_reviewed_query_set',
    queryCount: 0,
    results: [],
    reviewOnly: true,
  })
  await writeJson(path.join(outputDir, 'retrieval-evaluation-pending.json'), {
    schemaVersion: '1.0',
    evaluationId: repositoryManifest.retrievalEvaluation.evaluationId,
    method: repositoryManifest.retrievalEvaluation.method,
    queryCount: 0,
    top1HitCount: 0,
    top3Coverage: 0,
    status: 'pending_reviewed_query_set',
    reviewOnly: true,
  })
  await writeJson(path.join(outputDir, 'adapter-report.json'), {
    schemaVersion: '1.0',
    adapter: 'document-family-intake-to-source-index-poc',
    generatedAt,
    familyId: intake.familyId,
    status: 'passed',
    sourcePackageCount: sourcePackages.length,
    chunkCount: chunkRecords.length,
    reviewOnly: true,
    learnerFacingAllowed: false,
    appReadyAllowed: false,
    ragReadyAllowed: false,
    promotionStatus: 'not_promoted',
    retrievalEvaluationStatus: 'pending_reviewed_query_set',
  })

  console.log(`Built ${sourcePackages.length} review-only family source packages and ${chunkRecords.length} chunks.`)
  console.log(`Repository manifest: ${repositoryManifestPath}`)
  console.log(`Output directory: ${relativeRepoPath(outputDir)}`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
