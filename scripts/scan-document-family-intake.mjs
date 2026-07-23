import crypto from 'node:crypto'
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

const exists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
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

const sha256 = async (filePath) => {
  const buffer = await fs.readFile(filePath)
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

const normalizeRelativePath = (value) => value.split(path.sep).join('/')

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const titleFromFilename = (filename) =>
  path
    .basename(filename, path.extname(filename))
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const inferAuthoritySourceType = (documentType) => {
  const normalized = String(documentType || '').toLowerCase()
  if (normalized.includes('regulation')) return 'binding_regulation'
  if (normalized.includes('practice_note') || normalized.includes('practice note')) return 'companion_guidance'
  if (normalized.includes('educational_note') || normalized.includes('educational note')) return 'educational_guidance'
  if (normalized.includes('approval_memo') || normalized.includes('memo')) return 'internal_governance'
  if (normalized.includes('product_specification')) return 'product_specification'
  if (normalized.includes('profitability') || normalized.includes('pricing')) return 'pricing_support'
  if (normalized.includes('assumption')) return 'pricing_support'
  return 'source_document'
}

const inferIntendedAudience = (profile, documentType) => {
  const normalizedProfile = String(profile || '').toLowerCase()
  const normalizedType = String(documentType || '').toLowerCase()
  if (normalizedType.includes('approval_memo')) return 'governance reviewers'
  if (normalizedProfile.includes('pricing')) return 'pricing analysts'
  if (normalizedProfile.includes('liability')) return 'liability-modeling reviewers'
  if (normalizedProfile.includes('product')) return 'product reviewers'
  if (normalizedType.includes('regulation')) return 'regulatory reviewers'
  return 'document reviewers'
}

const inferChunkingStrategy = (profile, documentType) => {
  const normalizedProfile = String(profile || '').toLowerCase()
  const normalizedType = String(documentType || '').toLowerCase()
  if (normalizedType.includes('regulation')) return 'sectioned_regulatory_chunks'
  if (normalizedType.includes('practice_note') || normalizedType.includes('educational_note')) return 'companion_guidance_slices'
  if (normalizedProfile.includes('pricing')) return 'pricing_topic_slices'
  if (normalizedProfile.includes('product')) return 'product_feature_slices'
  if (normalizedProfile.includes('governance')) return 'governance_control_slices'
  return 'deterministic_topic_slices'
}

const buildClassification = (manifest, document, fallbackProfile) => {
  const selectedProfile = document.overrides?.selectedProfile ?? document.expectedProfile ?? fallbackProfile
  const documentType = document.documentType ?? 'unknown'
  const classification = {
    selectedProfile,
    authoritySourceType: inferAuthoritySourceType(documentType),
    intendedAudience: inferIntendedAudience(selectedProfile, documentType),
    recommendedChunkingStrategy: inferChunkingStrategy(selectedProfile, documentType),
    confidence: document.overrides?.classificationConfidence ?? (document.expectedProfile ? 'high' : 'medium'),
    confidentiality: document.confidentiality ?? manifest.confidentialityDefaults?.classification ?? 'internal',
  }
  return classification
}

const buildMarkdown = (manifest, inventory) => {
  const lines = [
    `# Document family intake: ${manifest.familyName}`,
    '',
    `- Family ID: ${manifest.familyId}`,
    `- Selected profile: ${manifest.defaultProfile}`,
    `- Processing status: ${manifest.processingStatus}`,
    `- Source root: ${manifest.sourceRoot ?? 'source/'}`,
    `- Document count: ${inventory.length}`,
    '',
    '## Inventory',
    '',
    '| Document ID | Filename | Profile | Type | Status | Notes |',
    '| --- | --- | --- | --- | --- | --- |',
  ]
  for (const item of inventory) {
    lines.push(
      `| ${item.documentId} | ${item.filename.replace(/\|/g, '\\|')} | ${item.selectedProfile} | ${item.documentType} | ${item.draftFinalStatus ?? 'n/a'} / ${item.approvalStatus ?? 'n/a'} | ${(item.notes ?? '').replace(/\|/g, '\\|')} |`,
    )
  }
  lines.push('', '## Validation', '', '- Review-only intake scan completed locally.', '- Raw source documents remain outside Git.', '')
  return lines.join('\n')
}

const buildHandoff = (manifest, inventory, validation, outputFiles) => ({
  schemaVersion: manifest.schemaVersion ?? '1.0',
  generatedAt: new Date().toISOString(),
  familyId: manifest.familyId,
  familyName: manifest.familyName,
  familyDescription: manifest.familyDescription,
  defaultProfile: manifest.defaultProfile,
  selectedDomainProfile: manifest.defaultProfile,
  processingStatus: manifest.processingStatus,
  reviewOnly: true,
  learnerFacingAllowed: false,
  appReadyAllowed: false,
  ragReadyAllowed: false,
  outputFiles,
  inventoryCount: inventory.length,
  selectedProfiles: Array.from(new Set(inventory.map((item) => item.selectedProfile))),
  validation,
  relationshipHints: manifest.relationshipHints ?? [],
  notes: 'Deterministic family intake handoff for the source-index POC.',
})

const buildSourceIndexInput = (manifest, inventory, outputFiles) => ({
  schemaVersion: '1.0',
  handoffType: 'family_intake_source_index_input',
  generatedAt: new Date().toISOString(),
  familyId: manifest.familyId,
  familyName: manifest.familyName,
  defaultProfile: manifest.defaultProfile,
  processingStatus: 'pending_canonical_source_index_build',
  reviewOnly: true,
  learnerFacingAllowed: false,
  appReadyAllowed: false,
  ragReadyAllowed: false,
  sourceRecords: inventory.map((item) => ({
    sourceId: `${manifest.familyId}:${item.documentId}`,
    documentId: item.documentId,
    sourcePath: item.sourcePath,
    sourceFamilyId: item.sourceFamilyId,
    documentType: item.documentType,
    title: item.title,
    selectedProfile: item.selectedProfile,
    classification: item.classification,
    sourceStatus: item.sourceStatus,
    sourceBoundRequired: true,
    reviewOnly: true,
    promotionEligible: false,
  })),
  relationshipHints: manifest.relationshipHints ?? [],
  nextStep: 'Build canonical source-index packages from reviewed source-bound extraction artifacts.',
  outputFiles,
})

const buildRepositoryManifestHandoff = (manifest, inventory, outputFiles) => ({
  schemaVersion: '1.0',
  handoffType: 'family_intake_repository_manifest_handoff',
  generatedAt: new Date().toISOString(),
  familyId: manifest.familyId,
  familyName: manifest.familyName,
  repositoryManifestStatus: 'not_built',
  canonicalLayer: 'source-index',
  reviewOnly: true,
  learnerFacingAllowed: false,
  appReadyAllowed: false,
  ragReadyAllowed: false,
  sourcePackageCount: inventory.length,
  sourcePackages: inventory.map((item) => ({
    sourceId: `${manifest.familyId}:${item.documentId}`,
    sourceTitle: item.title,
    sourcePath: item.sourcePath,
    sourceFamilyId: item.sourceFamilyId,
    documentType: item.documentType,
    sourceStatus: item.sourceStatus,
    selectedProfile: item.selectedProfile,
    sourceIndexPath: null,
    reviewIndexPath: null,
    selfReviewPath: null,
    promotionStatus: 'not_promoted',
  })),
  relationshipHints: manifest.relationshipHints ?? [],
  nextStep: 'Populate canonical source package paths only after source-bound extraction and human review.',
  outputFiles,
})

const buildRetrievalTestHandoff = (manifest, inventory, outputFiles) => ({
  schemaVersion: '1.0',
  handoffType: 'family_intake_retrieval_test_handoff',
  generatedAt: new Date().toISOString(),
  familyId: manifest.familyId,
  familyName: manifest.familyName,
  retrievalTestStatus: 'pending_canonical_source_index_build',
  reviewOnly: true,
  learnerFacingAllowed: false,
  appReadyAllowed: false,
  ragReadyAllowed: false,
  candidateSourceIds: inventory.map((item) => `${manifest.familyId}:${item.documentId}`),
  testQueries: [],
  expectedEvidencePolicy: {
    sourceBoundRequired: true,
    citationRequired: true,
    pageOrSectionLocatorRequired: true,
    lineReferencePreferred: true,
  },
  nextStep: 'Add reviewed retrieval queries after canonical source-index packages exist; do not infer queries from intake metadata alone.',
  outputFiles,
})

const comparePaths = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })

const main = async () => {
  const args = parseArgs(process.argv)
  const manifestPath = resolvePath(args.manifest)
  if (!manifestPath) {
    throw new Error('Missing required --manifest path.')
  }
  const manifest = await readJson(manifestPath)
  const manifestDir = path.dirname(manifestPath)
  const sourceRoot = args['source-root']
    ? resolvePath(args['source-root'], repoRoot)
    : resolvePath(manifest.sourceRoot ?? 'source', manifestDir)
  const outputDir = args['output-dir']
    ? resolvePath(args['output-dir'], repoRoot)
    : manifest.outputDestination?.inventoryJsonPath
      ? path.dirname(resolvePath(manifest.outputDestination.inventoryJsonPath, repoRoot))
      : path.join(repoRoot, 'data', 'work', 'intake', manifest.familyId)
  const writePaths = {
    inventoryJsonPath: path.join(outputDir, 'intake-inventory.json'),
    inventoryMarkdownPath: path.join(outputDir, 'intake-inventory.md'),
    handoffJsonPath: path.join(outputDir, 'intake-handoff.json'),
    sourceIndexInputPath: path.join(outputDir, 'source-index-input.json'),
    repositoryManifestHandoffPath: path.join(outputDir, 'repository-manifest-handoff.json'),
    retrievalTestHandoffPath: path.join(outputDir, 'retrieval-test-handoff.json'),
  }

  if (!(await exists(sourceRoot))) {
    throw new Error(`Missing source root: ${sourceRoot}`)
  }

  const manifestEntries = Array.isArray(manifest.documentInventory) ? manifest.documentInventory : []
  const manifestBySourcePath = new Map()
  const manifestByFilename = new Map()
  for (const entry of manifestEntries) {
    const key = normalizeRelativePath(String(entry.sourcePath ?? entry.filename ?? '').replace(/^\.\/+/, ''))
    if (key) manifestBySourcePath.set(key.toLowerCase(), entry)
    if (entry.filename) manifestByFilename.set(entry.filename.toLowerCase(), entry)
  }

  const discoveredFiles = []
  const walk = async (folder) => {
    const entries = await fs.readdir(folder, { withFileTypes: true })
    entries.sort((left, right) => comparePaths(left.name, right.name))
    for (const entry of entries) {
      const absolutePath = path.join(folder, entry.name)
      if (entry.isDirectory()) {
        await walk(absolutePath)
        continue
      }
      if (!entry.isFile()) continue
      discoveredFiles.push(absolutePath)
    }
  }
  await walk(sourceRoot)
  discoveredFiles.sort((left, right) => comparePaths(path.relative(sourceRoot, left), path.relative(sourceRoot, right)))

  const inventory = []
  const missingManifestEntries = []
  const matchedManifestIds = new Set()

  for (const filePath of discoveredFiles) {
    const relativePath = normalizeRelativePath(path.relative(sourceRoot, filePath))
    const filename = path.basename(filePath)
    const manifestEntry =
      manifestBySourcePath.get(relativePath.toLowerCase()) ??
      manifestByFilename.get(filename.toLowerCase()) ??
      null

    if (manifestEntry) {
      matchedManifestIds.add(manifestEntry.documentId)
    }

    const fileStat = await fs.stat(filePath)
    const hash = await sha256(filePath)
    const sourceItem = manifestEntry ?? {}
    const documentId = sourceItem.documentId ?? slugify(relativePath)
    const expectedProfile = sourceItem.expectedProfile ?? manifest.defaultProfile
    const overrides = (Array.isArray(manifest.perDocumentOverrides) ? manifest.perDocumentOverrides : []).find(
      (item) => item.documentId === documentId,
    )
    const selectedProfile = overrides?.overrides?.selectedProfile ?? expectedProfile
    const classification = buildClassification(manifest, { ...sourceItem, overrides: overrides?.overrides ?? {}, expectedProfile, documentType: sourceItem.documentType }, manifest.defaultProfile)

    inventory.push({
      documentId,
      filename,
      sourcePath: relativePath,
      fileExtension: path.extname(filename).toLowerCase(),
      fileSizeBytes: fileStat.size,
      lastModifiedTime: fileStat.mtime.toISOString(),
      sourceFamilyId: manifest.familyId,
      familyName: manifest.familyName,
      documentType: sourceItem.documentType ?? 'unknown',
      title: sourceItem.title ?? titleFromFilename(filename),
      organization: sourceItem.organization ?? manifest.familyName,
      jurisdiction: sourceItem.jurisdiction ?? manifest.defaultJurisdiction ?? null,
      confidentiality: sourceItem.confidentiality ?? manifest.confidentialityDefaults?.classification ?? 'internal',
      version: sourceItem.version ?? null,
      effectiveDate: sourceItem.effectiveDate ?? null,
      draftFinalStatus: sourceItem.draftFinalStatus ?? 'final',
      approvalStatus: sourceItem.approvalStatus ?? 'reviewed',
      sourceStatus: sourceItem.sourceStatus ?? null,
      pageCount: sourceItem.pageCount ?? null,
      expectedProfile,
      selectedProfile,
      classification,
      processingNotes: sourceItem.processingNotes ?? '',
      notes: sourceItem.notes ?? '',
      fileHash: hash,
      matchedManifestEntry: Boolean(manifestEntry),
      overrideApplied: Boolean(overrides),
      reviewOnly: true,
      learnerFacingAllowed: false,
      appReadyAllowed: false,
      ragReadyAllowed: false,
    })
  }

  for (const entry of manifestEntries) {
    if (!matchedManifestIds.has(entry.documentId)) {
      missingManifestEntries.push(entry.documentId)
    }
  }

  const unexpectedFiles = inventory.filter((item) => !item.matchedManifestEntry).map((item) => item.sourcePath)
  const selectedProfiles = Array.from(new Set(inventory.map((item) => item.selectedProfile))).sort(comparePaths)
  const documentTypes = Array.from(new Set(inventory.map((item) => item.documentType))).sort(comparePaths)
  const validation = {
    status: missingManifestEntries.length === 0 && unexpectedFiles.length === 0 ? 'passed' : 'needs_review',
    missingManifestEntries,
    unexpectedFiles,
    notes:
      missingManifestEntries.length === 0 && unexpectedFiles.length === 0
        ? 'Manifest and source root stayed in sync.'
        : 'Manifest/source mismatches should be reviewed before promotion.',
  }

  const classificationSummary = {
    selectedProfileCounts: selectedProfiles.reduce((accumulator, profile) => {
      accumulator[profile] = inventory.filter((item) => item.selectedProfile === profile).length
      return accumulator
    }, {}),
    documentTypeCounts: documentTypes.reduce((accumulator, documentType) => {
      accumulator[documentType] = inventory.filter((item) => item.documentType === documentType).length
      return accumulator
    }, {}),
  }

  const handoff = buildHandoff(
    manifest,
    inventory,
    validation,
    {
      inventoryJsonPath: path.relative(repoRoot, writePaths.inventoryJsonPath),
      inventoryMarkdownPath: path.relative(repoRoot, writePaths.inventoryMarkdownPath),
      handoffJsonPath: path.relative(repoRoot, writePaths.handoffJsonPath),
      sourceIndexConfigPath: path.relative(repoRoot, writePaths.sourceIndexInputPath),
      repositoryManifestPath: path.relative(repoRoot, writePaths.repositoryManifestHandoffPath),
      retrievalTestHandoffPath: path.relative(repoRoot, writePaths.retrievalTestHandoffPath),
    },
  )

  const outputFiles = {
    inventoryJsonPath: path.relative(repoRoot, writePaths.inventoryJsonPath),
    inventoryMarkdownPath: path.relative(repoRoot, writePaths.inventoryMarkdownPath),
    handoffJsonPath: path.relative(repoRoot, writePaths.handoffJsonPath),
    sourceIndexInputPath: path.relative(repoRoot, writePaths.sourceIndexInputPath),
    repositoryManifestHandoffPath: path.relative(repoRoot, writePaths.repositoryManifestHandoffPath),
    retrievalTestHandoffPath: path.relative(repoRoot, writePaths.retrievalTestHandoffPath),
  }

  const inventoryDocument = {
    schemaVersion: manifest.schemaVersion ?? '1.0',
    generatedAt: new Date().toISOString(),
    familyId: manifest.familyId,
    familyName: manifest.familyName,
    familyDescription: manifest.familyDescription,
    intakeRoot: manifest.intakeRoot ?? null,
    sourceRoot: normalizeRelativePath(path.relative(repoRoot, sourceRoot)),
    metadataRoot: manifest.metadataRoot ?? null,
    overridesRoot: manifest.overridesRoot ?? null,
    defaultProfile: manifest.defaultProfile,
    selectedDomainProfile: manifest.defaultProfile,
    defaultJurisdiction: manifest.defaultJurisdiction ?? null,
    documentCount: inventory.length,
    documentInventory: inventory,
    selectedProfiles,
    documentTypes,
    classificationSummary,
    relationshipHints: manifest.relationshipHints ?? [],
    validation,
    notes: 'Deterministic intake inventory generated from the family intake manifest.',
  }

  await fs.mkdir(outputDir, { recursive: true })
  await writeJson(writePaths.inventoryJsonPath, inventoryDocument)
  await writeText(writePaths.inventoryMarkdownPath, buildMarkdown(manifest, inventory))
  await writeJson(writePaths.handoffJsonPath, handoff)
  await writeJson(writePaths.sourceIndexInputPath, buildSourceIndexInput(manifest, inventory, outputFiles))
  await writeJson(writePaths.repositoryManifestHandoffPath, buildRepositoryManifestHandoff(manifest, inventory, outputFiles))
  await writeJson(writePaths.retrievalTestHandoffPath, buildRetrievalTestHandoff(manifest, inventory, outputFiles))

  console.log(`Scanned document family intake: ${manifest.familyId}`)
  console.log(`Source root: ${sourceRoot}`)
  console.log(`Document count: ${inventory.length}`)
  console.log(`Inventory JSON: ${path.relative(repoRoot, writePaths.inventoryJsonPath)}`)
  console.log(`Inventory Markdown: ${path.relative(repoRoot, writePaths.inventoryMarkdownPath)}`)
  console.log(`Handoff JSON: ${path.relative(repoRoot, writePaths.handoffJsonPath)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
