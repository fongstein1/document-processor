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
  path.join(repoRoot, 'data', 'schemas', 'source-index.schema.json'),
  path.join(repoRoot, 'data', 'schemas', 'repository-manifest.schema.json'),
  path.join(repoRoot, 'docs', 'prompts', 'generic_document_processing_prompt.md'),
  path.join(repoRoot, 'docs', 'prompts', 'pricing_document_processing_prompt.md'),
  path.join(repoRoot, 'docs', 'domain_profiles', 'regulatory_profile.md'),
  path.join(repoRoot, 'docs', 'domain_profiles', 'pricing_profile.md'),
  path.join(repoRoot, 'docs', 'domain_profiles', 'liability_modeling_profile.md'),
  path.join(repoRoot, 'docs', 'domain_profiles', 'governance_profile.md'),
    path.join(repoRoot, 'data', 'templates', 'source-index.template.json'),
    path.join(repoRoot, 'data', 'templates', 'repository-manifest.template.json'),
    path.join(repoRoot, 'data', 'processed', 'source_indexes', 'README.md'),
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

  if (repositoryManifest.repositoryManifestId !== config.pocId) {
    fail('Repository manifest ID does not match source-index POC config.')
  }
  if (repositoryManifest.sourcePackageCount !== config.sources.length) {
    fail('Repository manifest source-package count does not match config.')
  }
  if (repositoryManifest.chunkCount < config.sources.length) {
    fail('Repository manifest chunk count is unexpectedly low.')
  }

  const expectedSourceIds = config.sources.map((source) => source.sourceId)
  const observedSourceIds = repositoryManifest.sourcePackages.map((source) => source.sourceId)
  for (const sourceId of expectedSourceIds) {
    if (!observedSourceIds.includes(sourceId)) {
      fail(`Repository manifest is missing source package ${sourceId}.`)
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
  const expectedChunkCount = config.sources.reduce((sum, source) => sum + source.chunks.length, 0)
  if (jsonlLines.length !== expectedChunkCount) {
    fail(`JSONL export chunk count mismatch. Expected ${expectedChunkCount}, found ${jsonlLines.length}.`)
  }

  const csvLines = (await fs.readFile(csvPath, 'utf8')).trim().split(/\r?\n/)
  if (csvLines.length !== expectedChunkCount + 1) {
    fail(`CSV export row count mismatch. Expected ${expectedChunkCount + 1}, found ${csvLines.length}.`)
  }

  const evaluation = await readJson(evaluationPath)
  if (evaluation.queryCount !== config.retrievalQueries.length) {
    fail('Retrieval evaluation query count mismatch.')
  }
  if (typeof evaluation.top3Coverage !== 'number' || evaluation.top3Coverage < 0 || evaluation.top3Coverage > 1) {
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
