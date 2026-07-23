import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const requiredFiles = [
  path.join(repoRoot, 'data', 'schemas', 'document-family-intake.schema.json'),
  path.join(repoRoot, 'data', 'templates', 'document-family-intake.template.json'),
  path.join(repoRoot, 'data', 'samples', 'contract-demo', 'document-family-intake.example.json'),
  path.join(repoRoot, 'data', 'schemas', 'document-family-reviewed-source-pack.schema.json'),
  path.join(repoRoot, 'data', 'schemas', 'document-family-relationship-registry.schema.json'),
  path.join(repoRoot, 'data', 'templates', 'document-family-reviewed-source-pack.template.json'),
  path.join(repoRoot, 'data', 'templates', 'document-family-relationship-registry.template.json'),
  path.join(repoRoot, 'data', 'samples', 'contract-demo', 'document-family-reviewed-source-pack.example.json'),
  path.join(repoRoot, 'data', 'samples', 'contract-demo', 'document-family-relationship-registry.example.json'),
  path.join(repoRoot, 'data', 'intake', 'README.md'),
  path.join(repoRoot, 'docs', 'processor', 'document_family_intake_workflow.md'),
  path.join(repoRoot, 'docs', 'processor', 'document_family_source_index_adapter.md'),
  path.join(repoRoot, 'scripts', 'scan-document-family-intake.mjs'),
  path.join(repoRoot, 'scripts', 'build-family-source-index-poc.mjs'),
  path.join(repoRoot, 'scripts', 'build-document-family-relationship-registry.mjs'),
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

const validateStructure = (document, label) => {
  if (document.schemaVersion !== '1.0') {
    fail(`${label}: schemaVersion must be 1.0.`)
  }
  ;[
    'familyId',
    'familyName',
    'familyDescription',
    'createdAt',
    'createdBy',
    'defaultProfile',
    'documentInventory',
    'confidentialityDefaults',
    'relationshipHints',
    'expectedValidationRules',
    'outputDestination',
    'processingStatus',
  ].forEach((field) => {
    if (!(field in document)) {
      fail(`${label}: missing ${field}.`)
    }
  })
  if (!Array.isArray(document.documentInventory) || document.documentInventory.length === 0) {
    fail(`${label}: documentInventory must contain at least one entry.`)
  }
  if (typeof document.outputDestination !== 'object' || document.outputDestination === null) {
    fail(`${label}: outputDestination must be an object.`)
  }
}

const main = async () => {
  for (const filePath of requiredFiles) {
    if (!(await exists(filePath))) {
      fail(`Missing required document-family intake artifact: ${path.relative(repoRoot, filePath)}`)
    }
  }

  const examplePath = path.join(repoRoot, 'data', 'samples', 'contract-demo', 'document-family-intake.example.json')
  const example = await readJson(examplePath)
  validateStructure(example, 'document-family-intake example')

  const outputDir = path.join(repoRoot, 'data', 'work', 'intake-validation', example.familyId)
  const sourceRoot = path.join(repoRoot, 'data', 'samples', 'synthetic-pricing')
  const scannerPath = path.join(repoRoot, 'scripts', 'scan-document-family-intake.mjs')
  const result = spawnSync(
    process.execPath,
    [scannerPath, '--manifest', examplePath, '--source-root', sourceRoot, '--output-dir', outputDir],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_NO_WARNINGS: '1',
      },
    },
  )
  if (result.status !== 0) {
    fail(`document-family intake scanner failed: ${result.stderr || result.stdout || result.error?.message || 'unknown error'}`)
  }

  const inventoryPath = path.join(outputDir, 'intake-inventory.json')
  const inventoryMarkdownPath = path.join(outputDir, 'intake-inventory.md')
  const handoffPath = path.join(outputDir, 'intake-handoff.json')
  const sourceIndexInputPath = path.join(outputDir, 'source-index-input.json')
  const repositoryManifestHandoffPath = path.join(outputDir, 'repository-manifest-handoff.json')
  const retrievalTestHandoffPath = path.join(outputDir, 'retrieval-test-handoff.json')
  if (!(await exists(inventoryPath))) {
    fail('Missing intake inventory JSON.')
  }
  if (!(await exists(inventoryMarkdownPath))) {
    fail('Missing intake inventory Markdown.')
  }
  if (!(await exists(handoffPath))) {
    fail('Missing intake handoff JSON.')
  }
  if (!(await exists(sourceIndexInputPath))) {
    fail('Missing source-index input handoff JSON.')
  }
  if (!(await exists(repositoryManifestHandoffPath))) {
    fail('Missing repository-manifest handoff JSON.')
  }
  if (!(await exists(retrievalTestHandoffPath))) {
    fail('Missing retrieval-test handoff JSON.')
  }

  const inventory = await readJson(inventoryPath)
  const handoff = await readJson(handoffPath)
  const sourceIndexInput = await readJson(sourceIndexInputPath)
  const repositoryManifestHandoff = await readJson(repositoryManifestHandoffPath)
  const retrievalTestHandoff = await readJson(retrievalTestHandoffPath)
  if (inventory.familyId !== example.familyId) {
    fail('Intake inventory familyId does not match the example manifest.')
  }
  if (inventory.defaultProfile !== example.defaultProfile) {
    fail('Intake inventory defaultProfile does not match the example manifest.')
  }
  if (inventory.selectedDomainProfile !== example.defaultProfile) {
    fail('Intake inventory selectedDomainProfile does not match the example manifest.')
  }
  if (!Array.isArray(inventory.documentInventory) || inventory.documentInventory.length !== example.documentInventory.length) {
    fail('Intake inventory document count does not match the example manifest.')
  }
  if (handoff.reviewOnly !== true || handoff.learnerFacingAllowed !== false || handoff.appReadyAllowed !== false || handoff.ragReadyAllowed !== false) {
    fail('Intake handoff must remain review-only and block downstream promotion by default.')
  }
  if (handoff.selectedDomainProfile !== example.defaultProfile) {
    fail('Intake handoff should report the selected domain profile.')
  }
  if (!handoff.selectedProfiles?.length || !handoff.selectedProfiles.includes(example.defaultProfile)) {
    fail('Intake handoff should report the selected default profile.')
  }
  if (handoff.validation?.status !== 'passed') {
    fail('Demo intake scan should pass validation against the synthetic pricing sample corpus.')
  }
  for (const document of [sourceIndexInput, repositoryManifestHandoff, retrievalTestHandoff]) {
    if (document.reviewOnly !== true || document.learnerFacingAllowed !== false || document.appReadyAllowed !== false || document.ragReadyAllowed !== false) {
      fail(`${document.handoffType} must remain review-only and block downstream promotion by default.`)
    }
  }
  if (sourceIndexInput.sourceRecords?.length !== example.documentInventory.length) {
    fail('Source-index input handoff should include one source record per manifest document.')
  }
  if (repositoryManifestHandoff.repositoryManifestStatus !== 'not_built') {
    fail('Repository-manifest handoff must remain an explicit preparation artifact.')
  }
  if (retrievalTestHandoff.retrievalTestStatus !== 'pending_canonical_source_index_build' || retrievalTestHandoff.testQueries?.length !== 0) {
    fail('Retrieval-test handoff must remain pending until canonical source-index packages and reviewed queries exist.')
  }

  const reviewedPackPath = path.join(repoRoot, 'data', 'samples', 'contract-demo', 'document-family-reviewed-source-pack.example.json')
  const adapterPath = path.join(repoRoot, 'scripts', 'build-family-source-index-poc.mjs')
  const canonicalOutputDir = path.join(outputDir, 'canonical')
  const adapterResult = spawnSync(
    process.execPath,
    [
      adapterPath,
      '--intake',
      sourceIndexInputPath,
      '--reviewed-packages',
      reviewedPackPath,
      '--output-dir',
      canonicalOutputDir,
    ],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_NO_WARNINGS: '1',
      },
    },
  )
  if (adapterResult.status !== 0) {
    fail(`family source-index adapter failed: ${adapterResult.stderr || adapterResult.stdout || adapterResult.error?.message || 'unknown error'}`)
  }

  const adapterReportPath = path.join(canonicalOutputDir, 'adapter-report.json')
  const repositoryManifestPath = path.join(canonicalOutputDir, 'repository-manifest.json')
  const sourceIndexPath = path.join(canonicalOutputDir, 'sources', 'source-index-synthetic-pricing-intake-demo-product-specification.json')
  const retrievalHandoffPath = path.join(canonicalOutputDir, 'retrieval-test-handoff.json')
  const retrievalResultsPath = path.join(canonicalOutputDir, 'retrieval-results-pending.json')
  const retrievalEvaluationPath = path.join(canonicalOutputDir, 'retrieval-evaluation-pending.json')
  for (const filePath of [adapterReportPath, repositoryManifestPath, sourceIndexPath, retrievalHandoffPath, retrievalResultsPath, retrievalEvaluationPath]) {
    if (!(await exists(filePath))) {
      fail(`Missing family source-index adapter output: ${path.relative(repoRoot, filePath)}`)
    }
  }
  const adapterReport = await readJson(adapterReportPath)
  const repositoryManifest = await readJson(repositoryManifestPath)
  const sourceIndex = await readJson(sourceIndexPath)
  const retrievalHandoff = await readJson(retrievalHandoffPath)
  const retrievalResults = await readJson(retrievalResultsPath)
  const retrievalEvaluation = await readJson(retrievalEvaluationPath)
  if (adapterReport.status !== 'passed' || adapterReport.reviewOnly !== true || adapterReport.learnerFacingAllowed !== false || adapterReport.appReadyAllowed !== false || adapterReport.ragReadyAllowed !== false) {
    fail('Family source-index adapter report must pass while preserving review-only guardrails.')
  }
  if (repositoryManifest.sourcePackageCount !== 1 || repositoryManifest.chunkCount !== 1 || repositoryManifest.retrievalEvaluation?.queryCount !== 0) {
    fail('Family source-index adapter repository manifest has unexpected counts or retrieval state.')
  }
  if (repositoryManifest.exports?.retrievalResultsPath === null || repositoryManifest.exports?.retrievalEvaluationPath === null) {
    fail('Family source-index adapter repository manifest must use concrete pending retrieval artifact paths.')
  }
  if (sourceIndex.processing?.reviewOnly !== true || sourceIndex.processing?.promotionStatus !== 'not_promoted' || sourceIndex.processing?.learnerFacingAllowed !== false || sourceIndex.processing?.appReadyAllowed !== false || sourceIndex.processing?.ragReadyAllowed !== false) {
    fail('Family source-index package must remain review-only and not promoted.')
  }
  if (sourceIndex.chunks?.some((chunk) => chunk.promotionEligible !== false || !Array.isArray(chunk.citations) || chunk.citations.length === 0)) {
    fail('Family source-index chunks must retain citations and block promotion.')
  }
  for (const retrievalArtifact of [retrievalHandoff, retrievalResults, retrievalEvaluation]) {
    if (retrievalArtifact.reviewOnly !== true) {
      fail('Pending retrieval artifacts must remain review-only.')
    }
  }
  if (retrievalHandoff.retrievalTestStatus !== 'pending_reviewed_query_set' || retrievalHandoff.testQueries?.length !== 0) {
    fail('Pending retrieval handoff must not claim reviewed queries exist.')
  }

  const relationshipBuilderPath = path.join(repoRoot, 'scripts', 'build-document-family-relationship-registry.mjs')
  const relationshipRegistryPath = path.join(canonicalOutputDir, 'relationship-registry.json')
  const relationshipResult = spawnSync(
    process.execPath,
    [
      relationshipBuilderPath,
      '--intake',
      sourceIndexInputPath,
      '--reviewed-packages',
      reviewedPackPath,
      '--output',
      relationshipRegistryPath,
    ],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_NO_WARNINGS: '1',
      },
    },
  )
  if (relationshipResult.status !== 0) {
    fail(`relationship registry builder failed: ${relationshipResult.stderr || relationshipResult.stdout || relationshipResult.error?.message || 'unknown error'}`)
  }
  if (!(await exists(relationshipRegistryPath))) {
    fail('Missing relationship registry output.')
  }
  const relationshipRegistry = await readJson(relationshipRegistryPath)
  if (relationshipRegistry.relationshipCount !== example.relationshipHints.length) {
    fail('Relationship registry count should match the intake relationship hints for the demo.')
  }
  if (relationshipRegistry.relationships.some((relationship) => relationship.relationshipStatus !== 'candidate' || relationship.reviewRequired !== true)) {
    fail('Relationship registry edges must remain candidate relationships requiring review.')
  }
  if (relationshipRegistry.relationships.some((relationship) => relationship.sourceId.startsWith('external:') || relationship.targetScope !== 'family')) {
    fail('Demo relationship registry should resolve all source and target references to the family.')
  }

  console.log(`Validated document-family intake schema and example for ${example.familyId}.`)
  console.log(`Validated intake scan outputs under ${path.relative(repoRoot, outputDir)}.`)
  console.log(`Validated family source-index adapter outputs under ${path.relative(repoRoot, canonicalOutputDir)}.`)
  console.log(`Validated relationship registry under ${path.relative(repoRoot, relationshipRegistryPath)}.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
