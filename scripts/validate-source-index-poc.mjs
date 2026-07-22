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

const main = async () => {
  for (const filePath of requiredFiles) {
    if (!(await exists(filePath))) {
      fail(`Missing required source-index artifact: ${path.relative(repoRoot, filePath)}`)
    }
  }

  const config = await readJson(configPath)
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
  const expectedChunkCount = config.sources.reduce((sum, source) => sum + source.chunks.length, 0)
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
    if (sourceIndex.chunks.length !== source.chunks.length) {
      fail(`Chunk count mismatch for ${source.sourceId}.`)
    }
    for (const chunk of source.chunks) {
      if (!sourceIndex.chunks.some((observed) => observed.chunkId === chunk.chunkId)) {
        fail(`Missing chunk ${chunk.chunkId} in source index ${source.sourceId}.`)
      }
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

  const jsonlLines = (await fs.readFile(jsonlPath, 'utf8')).trim().split(/\r?\n/).filter(Boolean)
  const jsonlChunkCount = config.sources.reduce((sum, source) => sum + source.chunks.length, 0)
  if (jsonlLines.length !== jsonlChunkCount) {
    fail(`JSONL export chunk count mismatch. Expected ${jsonlChunkCount}, found ${jsonlLines.length}.`)
  }

  const csvLines = (await fs.readFile(csvPath, 'utf8')).trim().split(/\r?\n/)
  if (csvLines.length !== jsonlChunkCount + 1) {
    fail(`CSV export row count mismatch. Expected ${jsonlChunkCount + 1}, found ${csvLines.length}.`)
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
  for (const query of evaluation.queries) {
    if (!Array.isArray(query.rankedMatches) || query.rankedMatches.length === 0) {
      fail(`Retrieval evaluation query ${query.queryId} has no ranked matches.`)
    }
    if ((query.expectedOutcome ?? 'supported') === 'unsupported') {
      if (!['unsupported', 'false_positive'].includes(query.resultLabel)) {
        fail(`Retrieval evaluation query ${query.queryId} was expected to be unsupported but was labeled ${query.resultLabel}.`)
      }
      continue
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
