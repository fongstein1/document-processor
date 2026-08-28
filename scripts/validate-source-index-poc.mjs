import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes')

const requiredFiles = [
    path.join(repoRoot, 'AGENTS.md'),
    path.join(repoRoot, 'docs', 'source_index_architecture_audit.md'),
    path.join(repoRoot, 'docs', 'retrieval_poc_corpus_plan.md'),
    path.join(repoRoot, 'docs', 'antigravity_source_index_ui_contract.md'),
    path.join(repoRoot, 'docs', 'retrieval_readiness_report.md'),
    path.join(repoRoot, 'data', 'schemas', 'source-index.schema.json'),
    path.join(repoRoot, 'data', 'schemas', 'repository-manifest.schema.json'),
    path.join(repoRoot, 'data', 'schemas', 'canonical-promotion-decision.schema.json'),
    path.join(repoRoot, 'data', 'manual-input', 'promotion-decisions', 'vm20-2026-prose-promotion.json'),
    path.join(repoRoot, 'data', 'manual-input', 'promotion-decisions', 'vm01-2026-definitions-promotion.json'),
    path.join(repoRoot, 'data', 'schemas', 'document-classification.schema.json'),
    path.join(repoRoot, 'docs', 'prompts', 'generic_document_processing_prompt.md'),
    path.join(repoRoot, 'docs', 'prompts', 'pricing_document_processing_prompt.md'),
    path.join(repoRoot, 'docs', 'prompts', 'new_domain_profile_prompt.md'),
    path.join(repoRoot, 'docs', 'prompts', 'process_document_family_prompt.md'),
    path.join(repoRoot, 'docs', 'domain_profiles', 'regulatory_profile.md'),
    path.join(repoRoot, 'docs', 'domain_profiles', 'pricing_profile.md'),
    path.join(repoRoot, 'docs', 'domain_profiles', 'liability_modeling_profile.md'),
    path.join(repoRoot, 'docs', 'domain_profiles', 'governance_profile.md'),
    path.join(repoRoot, 'docs', 'domain_profiles', 'product_profile.md'),
    path.join(repoRoot, 'docs', 'domain_profiles', 'reporting_profile.md'),
    path.join(repoRoot, 'data', 'templates', 'source-index.template.json'),
    path.join(repoRoot, 'data', 'templates', 'repository-manifest.template.json'),
    path.join(repoRoot, 'data', 'samples', 'contract-demo', 'document-classification.example.json'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'README.md'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'classification', 'source-classifications.json'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'classification', 'source-classifications.md'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'exports', 'export_manifest.json'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'exports', 'source_chunks.jsonl'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'exports', 'source_chunks.csv'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'evaluation', 'retrieval_questions.json'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'evaluation', 'retrieval_results.json'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'retrieval', 'retrieval-evaluation.json'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'retrieval', 'retrieval-evaluation.md'),
  ]

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const exists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const fail = (message) => {
  throw new Error(message)
}

const countCsvRecords = (text) => {
  const normalized = text.trim()
  if (!normalized) return 0
  let records = 1
  let quoted = false
  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index]
    if (char === '"') {
      if (quoted && normalized[index + 1] === '"') index += 1
      else quoted = !quoted
    } else if (char === '\n' && !quoted) {
      records += 1
    }
  }
  return records
}

const validateHierarchy = (sourceIndex) => {
  const chunks = sourceIndex.chunks.filter((chunk) => chunk.chunkLevel)
  if (chunks.length === 0) return
  const byId = new Map(chunks.map((chunk) => [chunk.chunkId, chunk]))
  const parents = chunks.filter((chunk) => chunk.chunkLevel === 'parent')
  const children = chunks.filter((chunk) => chunk.chunkLevel === 'child')
  if (parents.length === 0 || children.length === 0) fail(`Hierarchical source ${sourceIndex.source.sourceId} must contain both parent and child chunks.`)
  for (const parent of parents) {
    if (!Array.isArray(parent.childChunkIds) || parent.childChunkIds.length === 0) fail(`Parent ${parent.chunkId} has no childChunkIds.`)
    for (const childId of parent.childChunkIds) {
      const child = byId.get(childId)
      if (!child || child.chunkLevel !== 'child' || child.parentChunkId !== parent.chunkId) fail(`Parent-child link does not resolve for ${parent.chunkId} -> ${childId}.`)
    }
  }
  for (const child of children) {
    if (!child.parentChunkId || !byId.has(child.parentChunkId)) fail(`Orphan child chunk ${child.chunkId}.`)
    if (!Array.isArray(byId.get(child.parentChunkId).childChunkIds) || !byId.get(child.parentChunkId).childChunkIds.includes(child.chunkId)) fail(`Child ${child.chunkId} is not listed by its parent.`)
    if (!child.structuralLocator || !child.headingPath) fail(`Child ${child.chunkId} is missing structural locator or heading path.`)
  }
  for (const chunk of chunks) {
    for (const adjacentId of [chunk.precedingChunkId, chunk.followingChunkId].filter(Boolean)) {
      if (!byId.has(adjacentId)) fail(`Adjacent link ${chunk.chunkId} -> ${adjacentId} does not resolve.`)
    }
    if (!Array.isArray(chunk.citations) || chunk.citations.length === 0) fail(`Hierarchical chunk ${chunk.chunkId} has no citation.`)
  }
  if (!children.some((child) => child.precedingChunkId || child.followingChunkId)) fail(`Hierarchical source ${sourceIndex.source.sourceId} has no child adjacency links.`)
}

const main = async () => {
  for (const filePath of requiredFiles) {
    if (!(await exists(filePath))) {
      fail(`Missing required source-index artifact: ${path.relative(repoRoot, filePath)}`)
    }
  }

  const config = await readJson(configPath)
  const promotionDecision = await readJson(path.resolve(repoRoot, config.promotionDecisionPath))
  const promotionDecisionPaths = [config.promotionDecisionPath, ...(config.additionalPromotionDecisionPaths ?? [])]
  const promotionDecisionRecords = await Promise.all(promotionDecisionPaths.map(async (decisionPath) => ({ decisionPath, decision: await readJson(path.resolve(repoRoot, decisionPath)) })))
  const promotionBySourceId = new Map()
  for (const record of promotionDecisionRecords) {
    if (record.decision.decision !== 'approved_for_canonical_promotion' || record.decision.reviewEvidence?.blockersClosed !== true) fail(`Promotion decision is not approved with closed blockers: ${record.decisionPath}.`)
    for (const sourceId of record.decision.scope?.sourceIds ?? []) {
      if (promotionBySourceId.has(sourceId)) fail(`Source ${sourceId} appears in multiple promotion decisions.`)
      promotionBySourceId.set(sourceId, record)
    }
  }
  const promotedSourceIds = new Set(promotionBySourceId.keys())
  if (promotionDecision.decision !== 'approved_for_canonical_promotion' || promotionDecision.reviewEvidence?.blockersClosed !== true) {
    fail('VM-20 promotion decision is not approved with closed blockers.')
  }
  const repositoryManifestPath = path.join(outputRoot, 'repository-manifest.json')
  const repositoryManifest = await readJson(repositoryManifestPath)
  const exportManifestPath = path.join(outputRoot, 'exports', 'export_manifest.json')
  const exportManifest = await readJson(exportManifestPath)

  if (repositoryManifest.repositoryManifestId !== config.pocId) {
    fail('Repository manifest ID does not match source-index POC config.')
  }
  if (repositoryManifest.sourcePackageCount !== config.sources.length) {
    fail('Repository manifest source-package count does not match config.')
  }
  const expectedChunkCount = config.sources.reduce((sum, source) => sum + (source.expectedChunkCount ?? source.chunks?.length ?? 0), 0)
  if (repositoryManifest.chunkCount !== expectedChunkCount) {
    fail(`Repository manifest chunk count does not match config. Expected ${expectedChunkCount}, found ${repositoryManifest.chunkCount}.`)
  }
  if (expectedChunkCount <= 31) {
    fail(`Unexpected canonical chunk count. Expected more than 31 after expanding the POC corpus, found ${expectedChunkCount}.`)
  }
  if (exportManifest.repositoryManifestId !== config.pocId) {
    fail('Export manifest repository ID does not match source-index POC config.')
  }
  if (exportManifest.chunkCount !== expectedChunkCount) {
    fail('Export manifest chunk count does not match config.')
  }

  const classificationPath = path.join(outputRoot, 'classification', 'source-classifications.json')
  const classificationMarkdownPath = path.join(outputRoot, 'classification', 'source-classifications.md')
  const classificationDocument = await readJson(classificationPath)
  if (classificationDocument.sourceCount !== config.sources.length) {
    fail('Classification document source count does not match config.')
  }
  if (!Array.isArray(classificationDocument.classifications) || classificationDocument.classifications.length !== config.sources.length) {
    fail('Classification document classification list does not match config.')
  }
  if (!(await exists(classificationMarkdownPath))) {
    fail('Missing source-index classification Markdown.')
  }

  const expectedSourceIds = config.sources.map((source) => source.sourceId)
  const observedSourceIds = repositoryManifest.sourcePackages.map((source) => source.sourceId)
  for (const sourceId of expectedSourceIds) {
    if (!observedSourceIds.includes(sourceId)) {
      fail(`Repository manifest is missing source package ${sourceId}.`)
    }
  }
  const syntheticSourceIds = config.sources
    .filter((source) => source.sourceFamilyId === 'synthetic_pricing_documents')
    .map((source) => source.sourceId)
  if (syntheticSourceIds.length !== 5) {
    fail(`Synthetic pricing corpus must include 5 source packages, found ${syntheticSourceIds.length}.`)
  }
  for (const sourceId of syntheticSourceIds) {
    if (!observedSourceIds.includes(sourceId)) {
      fail(`Repository manifest is missing synthetic pricing source package ${sourceId}.`)
    }
  }
  const classificationSourceIds = classificationDocument.classifications.map((entry) => entry.sourceId)
  for (const sourceId of expectedSourceIds) {
    if (!classificationSourceIds.includes(sourceId)) {
      fail(`Classification document is missing source package ${sourceId}.`)
    }
  }

  for (const source of config.sources) {
    const sourceJsonPath = path.join(outputRoot, 'sources', `${source.sourceId}.json`)
    const sourceMdPath = path.join(outputRoot, 'sources', `${source.sourceId}.md`)
    if (!(await exists(sourceJsonPath))) {
      fail(`Missing source-index JSON for ${source.sourceId}.`)
    }
    if (!(await exists(sourceMdPath))) {
      fail(`Missing source-index Markdown for ${source.sourceId}.`)
    }
    const sourceIndex = await readJson(sourceJsonPath)
    if (sourceIndex.source.sourceId !== source.sourceId) {
      fail(`Source index sourceId mismatch for ${source.sourceId}.`)
    }
    const expectedSourceChunkCount = source.expectedChunkCount ?? source.chunks?.length ?? 0
    if (sourceIndex.chunks.length !== expectedSourceChunkCount) {
      fail(`Chunk count mismatch for ${source.sourceId}. Expected ${expectedSourceChunkCount}, found ${sourceIndex.chunks.length}.`)
    }
    for (const chunk of source.chunks ?? []) {
      if (!sourceIndex.chunks.some((observed) => observed.chunkId === chunk.chunkId)) {
        fail(`Missing chunk ${chunk.chunkId} in source index ${source.sourceId}.`)
      }
    }
    validateHierarchy(sourceIndex)
    const promoted = promotedSourceIds.has(source.sourceId)
    if (promoted) {
      if (sourceIndex.processing?.processingMode !== 'canonical_index' || sourceIndex.processing?.canonicality !== 'canonical' || sourceIndex.processing?.reviewOnly !== false || sourceIndex.processing?.promotionStatus !== 'promoted') {
        fail(`Promoted source package has incorrect governance metadata: ${source.sourceId}.`)
      }
      if (sourceIndex.chunks.some((chunk) => chunk.promotionEligible !== true)) fail(`Promoted source contains a non-promotable chunk: ${source.sourceId}.`)
    } else if (sourceIndex.processing?.promotionStatus !== 'not_promoted' || sourceIndex.processing?.reviewOnly !== true || sourceIndex.chunks.some((chunk) => chunk.promotionEligible !== false)) {
      fail(`Unpromoted source package lost its review-only guardrail: ${source.sourceId}.`)
    }
    const markdown = await fs.readFile(sourceMdPath, 'utf8')
    if (!markdown.includes(source.sourceTitle) || !markdown.includes(source.sourceId)) {
      fail(`Markdown companion for ${source.sourceId} does not include the source title and ID.`)
    }
  }

  const jsonlPath = path.join(outputRoot, 'exports', 'source-indexes.jsonl')
  const csvPath = path.join(outputRoot, 'exports', 'source-indexes.csv')
  const evaluationPath = path.join(outputRoot, 'retrieval', 'retrieval-evaluation.json')
  const evaluationMdPath = path.join(outputRoot, 'retrieval', 'retrieval-evaluation.md')
  const vm20ReviewPackagePath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-canonical-coverage-review-package.json')
  const vm20ReviewPackageMarkdownPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-canonical-coverage-review-package.md')
  if (!(await exists(jsonlPath))) {
    fail('Missing source-index JSONL export.')
  }
  if (!(await exists(csvPath))) {
    fail('Missing source-index CSV export.')
  }
  if (!(await exists(evaluationPath))) {
    fail('Missing source-index retrieval evaluation JSON.')
  }
  if (!(await exists(evaluationMdPath))) {
    fail('Missing source-index retrieval evaluation Markdown.')
  }
  if (!(await exists(vm20ReviewPackagePath)) || !(await exists(vm20ReviewPackageMarkdownPath))) {
    fail('Missing dedicated VM-20 review package.')
  }
  const vm20ReviewPackage = await readJson(vm20ReviewPackagePath)
  if (vm20ReviewPackage.status !== 'canonical_promoted' || vm20ReviewPackage.promoted !== true) {
    fail('VM-20 review package must record the approved canonical promotion.')
  }
  if (vm20ReviewPackage.promotionReadiness?.automatedPromotion !== false || vm20ReviewPackage.promotionReadiness?.blockersClosed !== true || vm20ReviewPackage.humanReview?.finalDisposition !== 'APPROVE') {
    fail('VM-20 promotion must retain closed blockers and the final independent-review decision.')
  }
  if (vm20ReviewPackage.promotionDecision?.decisionRecordPath !== config.promotionDecisionPath || vm20ReviewPackage.promotionDecision?.downstreamEligibility?.copilotExportEligible !== false) fail('VM-20 promotion boundary or downstream export guardrail is missing.')
  const vm20PromotedChunkCount = promotionDecision.scope.sourceIds.reduce((sum, sourceId) => sum + (config.sources.find((source) => source.sourceId === sourceId)?.expectedChunkCount ?? config.sources.find((source) => source.sourceId === sourceId)?.chunks?.length ?? 0), 0)
  if (vm20PromotedChunkCount !== promotionDecision.scope.expectedChunkCount || vm20PromotedChunkCount !== 149) fail(`VM-20 promotion chunk count mismatch: ${vm20PromotedChunkCount}.`)
  const vm01PromotionRecord = promotionDecisionRecords.find((record) => record.decision.scope?.sourceIds?.includes('vm01-definitions'))
  if (!vm01PromotionRecord || vm01PromotionRecord.decision.scope.expectedChunkCount !== 98 || vm01PromotionRecord.decision.downstreamEligibility?.copilotExportEligible !== false || !vm01PromotionRecord.decision.exclusions.some((item) => item.includes('29 VM-01'))) fail('VM-01 promotion decision scope or exclusions are incomplete.')
  const vm01SourcePackage = await readJson(path.join(outputRoot, 'sources', 'vm01-definitions.json'))
  if (vm01SourcePackage.processing?.reviewOnly !== false || vm01SourcePackage.processing?.promotionStatus !== 'promoted' || vm01SourcePackage.chunks.length !== 98 || vm01SourcePackage.chunks.some((chunk) => chunk.promotionEligible !== true) || vm01SourcePackage.extensions?.promotionDecisionPath !== vm01PromotionRecord.decisionPath) fail('VM-01 canonical promotion metadata is incomplete or inconsistent.')
  const vm31SourcePackage = await readJson(path.join(outputRoot, 'sources', 'vm31-current-manual.json'))
  const vm30SourcePackage = await readJson(path.join(outputRoot, 'sources', 'vm30-current-manual.json'))
  const vm30PromotionRecord = promotionDecisionRecords.find((record) => record.decision.scope?.sourceIds?.includes('vm30-current-manual'))
  if (!vm30PromotionRecord || vm30PromotionRecord.decision.scope.expectedChunkCount !== 51 || vm30PromotionRecord.decision.downstreamEligibility?.copilotExportEligible !== false || !vm30PromotionRecord.decision.exclusions.some((item) => item.includes('16 VM-30'))) fail('VM-30 promotion decision scope or exclusions are incomplete.')
  if (vm30SourcePackage.processing?.reviewOnly !== false || vm30SourcePackage.processing?.promotionStatus !== 'promoted' || vm30SourcePackage.chunks.length !== 51 || vm30SourcePackage.chunks.filter((chunk) => chunk.chunkLevel === 'parent').length !== 8 || vm30SourcePackage.chunks.filter((chunk) => chunk.chunkLevel === 'child').length !== 43 || vm30SourcePackage.chunks.filter((chunk) => chunk.retrievalEligible).length !== 42 || vm30SourcePackage.chunks.some((chunk) => chunk.promotionEligible !== true) || vm30SourcePackage.extensions?.promotionDecisionPath !== vm30PromotionRecord.decisionPath) fail('VM-30 canonical promotion metadata or hierarchy is incomplete.')
  if (vm30SourcePackage.source?.sourceSha256 !== '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9' || vm30SourcePackage.source?.pageRange?.start !== 325 || vm30SourcePackage.source?.pageRange?.end !== 339) fail('VM-30 authoritative source identity or chapter boundary is inconsistent.')
  if (vm30SourcePackage.chunks.some((chunk) => /\[p\.\s*340\]|VM\s*-\s*31/i.test(chunk.sourceTextExcerpt))) fail('VM-30 source package crosses the authoritative chapter boundary.')
  const vm31PromotionRecord = promotionDecisionRecords.find((record) => record.decision.scope?.sourceIds?.includes('vm31-current-manual'))
  if (!vm31PromotionRecord || vm31PromotionRecord.decision.scope.expectedChunkCount !== 84 || vm31PromotionRecord.decision.downstreamEligibility?.copilotExportEligible !== false || !vm31PromotionRecord.decision.exclusions.some((item) => item.includes('92 VM-31'))) fail('VM-31 promotion decision scope or exclusions are incomplete.')
  if (vm31SourcePackage.processing?.reviewOnly !== false || vm31SourcePackage.processing?.promotionStatus !== 'promoted' || vm31SourcePackage.chunks.length !== 84 || vm31SourcePackage.chunks.filter((chunk) => chunk.chunkLevel === 'parent').length !== 9 || vm31SourcePackage.chunks.filter((chunk) => chunk.chunkLevel === 'child').length !== 75 || vm31SourcePackage.chunks.some((chunk) => chunk.promotionEligible !== true) || vm31SourcePackage.extensions?.promotionDecisionPath !== vm31PromotionRecord.decisionPath) fail('VM-31 canonical promotion metadata or hierarchy is incomplete.')
  if (vm31SourcePackage.source?.sourceSha256 !== '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9' || vm31SourcePackage.source?.pageRange?.start !== 341 || vm31SourcePackage.source?.pageRange?.end !== 386) fail('VM-31 authoritative source identity or chapter boundary is inconsistent.')
  if (repositoryManifest.extensions?.promotionDecisionPaths?.length !== promotionDecisionRecords.length || repositoryManifest.extensions?.promotedSourcePackageCount !== 9 || repositoryManifest.extensions?.promotedChunkCount !== 382) fail('Repository manifest does not record all scope-specific canonical promotions.')
  if ((vm20ReviewPackage.coverage?.parentCount ?? 0) < 10 || (vm20ReviewPackage.coverage?.childCount ?? 0) < 20) {
    fail('VM-20 review package does not contain the expected hierarchical coverage.')
  }
  if (vm20ReviewPackage.retrievalEvaluation?.queryCount < 10 || !Array.isArray(vm20ReviewPackage.humanReview?.decisionOptions)) {
    fail('VM-20 review package is missing retrieval or human-review handoff data.')
  }

  const jsonlLines = (await fs.readFile(jsonlPath, 'utf8')).trim().split(/\r?\n/).filter(Boolean)
  const jsonlChunkCount = config.sources.reduce((sum, source) => sum + (source.expectedChunkCount ?? source.chunks?.length ?? 0), 0)
  if (jsonlLines.length !== jsonlChunkCount) {
    fail(`JSONL export chunk count mismatch. Expected ${jsonlChunkCount}, found ${jsonlLines.length}.`)
  }

  const csvRecordCount = countCsvRecords(await fs.readFile(csvPath, 'utf8'))
  if (csvRecordCount !== jsonlChunkCount + 1) {
    fail(`CSV export row count mismatch. Expected ${jsonlChunkCount + 1}, found ${csvRecordCount}.`)
  }

  const evaluation = await readJson(evaluationPath)
  const evaluationQueryCount =
    evaluation.queryCount ?? evaluation.queries?.length ?? (evaluation.supportedQueryCount ?? 0) + (evaluation.unsupportedQueryCount ?? 0)
  if (evaluationQueryCount !== config.retrievalQueries.length) {
    fail('Retrieval evaluation query count mismatch.')
  }
  if (config.retrievalQueries.length < 15) {
    fail('Retrieval evaluation query set is too small for the expanded POC corpus.')
  }
  const pricingQueryIds = [
    'q-synth-product-spec',
    'q-synth-assumption-memo',
    'q-synth-pricing-methodology',
    'q-synth-profitability-study',
    'q-synth-approval-memo',
  ]
  for (const queryId of pricingQueryIds) {
    if (!config.retrievalQueries.some((query) => query.queryId === queryId)) {
      fail(`Missing pricing retrieval query ${queryId}.`)
    }
  }
  const evaluationTop3Coverage =
    evaluation.top3Coverage ?? (evaluationQueryCount === 0 ? 0 : (evaluation.top3HitCount ?? 0) / evaluationQueryCount)
  if (evaluationTop3Coverage < 0.2) {
    fail('Retrieval evaluation top-3 coverage is unexpectedly low for the expanded POC corpus.')
  }
  if (typeof evaluationTop3Coverage !== 'number' || evaluationTop3Coverage < 0 || evaluationTop3Coverage > 1) {
    fail('Retrieval evaluation coverage ratio must be a normalized number between 0 and 1.')
  }
  if (typeof evaluation.top3HitCount !== 'number' || evaluation.top3HitCount < 0) {
    fail('Retrieval evaluation top-3 hit count must be a non-negative number.')
  }
  if (evaluation.queries.length !== config.retrievalQueries.length) {
    fail('Retrieval evaluation query detail count mismatch.')
  }
  if ((evaluation.deduplication?.postDeduplicationCollisionCount ?? 0) !== 0) {
    fail('Retrieval evaluation contains equivalent parent-child collisions after deduplication.')
  }
  for (const query of evaluation.queries) {
    if (!Array.isArray(query.rankedMatches) || query.rankedMatches.length === 0) {
      fail(`Retrieval evaluation query ${query.queryId} has no ranked matches.`)
    }
    if ((query.expectedOutcome ?? 'supported') === 'unsupported') {
      if (query.queryId === 'q-vm20-current-table-gap' && (query.supportDecision?.supportState !== 'unsupported' || query.resultLabel !== 'unsupported')) {
        fail(`VM-20 table-gap query must be labeled unsupported with an unsupported support state; found ${query.resultLabel}/${query.supportDecision?.supportState}.`)
      }
      if (!['unsupported', 'false_positive'].includes(query.resultLabel)) {
        fail(`Retrieval evaluation query ${query.queryId} was expected to be unsupported but was labeled ${query.resultLabel}.`)
      }
      continue
    }
    if (!query.supportDecision || !query.deduplication) {
      fail(`Retrieval evaluation query ${query.queryId} is missing support-decision or deduplication metadata.`)
    }
    if (!query.expectedChunkIds.some((chunkId) => query.rankedMatches.some((match) => match.chunkId === chunkId))) {
      fail(`Retrieval evaluation query ${query.queryId} did not surface any expected chunk in the top ranks.`)
    }
  }

  console.log(`Validated ${config.sources.length} canonical source packages and ${expectedChunkCount} chunks.`)
  console.log(`Validated retrieval evaluation for ${config.retrievalQueries.length} queries.`)
  console.log(`Validated source-index artifacts under ${path.relative(repoRoot, outputRoot)}.`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
