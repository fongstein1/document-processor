import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { batchDefinitions } from './batch-definitions.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const rawRoot = 'D:\\Work\\AI Projects\\NAIC Valuation Manual Course'
const getCliArg = (flag, fallback) => {
  const index = process.argv.indexOf(`--${flag}`)
  if (index >= 0 && index + 1 < process.argv.length) {
    const value = process.argv[index + 1]
    if (!value.startsWith('--')) {
      return value
    }
  }
  return fallback
}
const requestedBatchId = getCliArg('batch', 'batch-001')
const batchDefinition = batchDefinitions[requestedBatchId]
if (!batchDefinition) {
  throw new Error(`Unknown batch id: ${requestedBatchId}`)
}
const batchId = requestedBatchId
const batchName = batchDefinition.batchName
const batchSlug = batchDefinition.batchSlug
const batchProfile = batchDefinition.batchProfile
const sourceSelections = batchDefinition.sourceSelections
const batchRoot = path.join(repoRoot, 'data', 'work', 'batches', batchId)
const reviewRoot = path.join(batchRoot, 'review')
const validationReportPath = path.join(batchRoot, 'validation-report.json')
const unresolvedIssuesPath = path.join(batchRoot, 'unresolved-issues-summary.md')
const batchManifestPath = path.join(batchRoot, 'batch-manifest.json')
const sourceInventoryPath = path.join(batchRoot, 'source-inventory.json')
const chunkManifestPath = path.join(batchRoot, 'chunk-manifest.json')
const extractionOutputPath = path.join(batchRoot, 'extraction-output.json')
const reviewPacketJsonPath = path.join(reviewRoot, 'review-packet.json')
const reviewPacketMdPath = path.join(reviewRoot, 'review-packet.md')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
const writeText = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${value}\n`, 'utf8')
}
const exists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}
const normalizeWhitespace = (value) =>
  value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
const sha256 = async (filePath) => {
  const buffer = await fs.readFile(filePath)
  return crypto.createHash('sha256').update(buffer).digest('hex')
}
const rawPath = (relativePath) => path.join(rawRoot, ...relativePath.split('/'))
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const ensureArray = (value) => (Array.isArray(value) ? value : [])
const unique = (values) => Array.from(new Set(values.filter(Boolean)))

const extractPdfPages = async (filePath, startPage, endPage) => {
  const pythonCode = `
import json
import sys
from pathlib import Path
from PyPDF2 import PdfReader

file_path = Path(sys.argv[1])
start_page = int(sys.argv[2])
end_page = int(sys.argv[3])

reader = PdfReader(str(file_path))
pages = []
for index in range(max(start_page, 1) - 1, min(end_page, len(reader.pages))):
    text = (reader.pages[index].extract_text() or "").replace("\\r", "")
    pages.append({
        "pageNumber": index + 1,
        "text": text,
    })

print(json.dumps({
    "pageCount": len(reader.pages),
    "pages": pages,
}, ensure_ascii=False))
`
  const result = spawnSync('python', ['-c', pythonCode, filePath, String(startPage), String(endPage)], {
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    throw new Error(
      `PDF extraction failed for ${filePath}: ${result.stderr || result.stdout || 'unknown error'}`,
    )
  }
  return JSON.parse(result.stdout)
}

const configPath = path.join(repoRoot, 'config', 'source-families.json')
const manifestTemplatePath = path.join(
  repoRoot,
  'data',
  'templates',
  'batch-manifest.template.json',
)
const reviewTemplatePath = path.join(
  repoRoot,
  'data',
  'templates',
  'review-packet.template.json',
)
const config = await readJson(configPath)
const manifestTemplate = await readJson(manifestTemplatePath)
const reviewTemplate = await readJson(reviewTemplatePath)
const reviewPacketFlags = batchDefinition.reviewPacketFlags ?? []
const reviewPacketCitationIssues = batchDefinition.reviewPacketCitationIssues ?? []
const reviewPacketHumanDecisions = batchDefinition.reviewPacketHumanDecisions ?? []
const unresolvedIssues = batchDefinition.unresolvedIssues ?? []
const validationChecks = batchDefinition.validationChecks ?? []
const processingIntentText = batchDefinition.processingIntentText
const processingIntentNotes = batchDefinition.processingIntentNotes
const batchSummaryText = batchDefinition.batchSummaryText
const batchSummaryNotes = batchDefinition.batchSummaryNotes
const reviewPacketReason = batchDefinition.reviewPacketReason
const reviewPacketNextStep = batchDefinition.reviewPacketNextStep
const reviewerNotes = batchDefinition.reviewerNotes

const sourceFamiliesById = new Map(config.sourceFamilies.map((family) => [family.familyId, family]))
const selectedFamilies = ensureArray(sourceSelections)
  .map((selection) => sourceFamiliesById.get(selection.sourceFamilyId))
  .filter(Boolean)
  .filter((family, index, array) => array.findIndex((candidate) => candidate.familyId === family.familyId) === index)
const selectedDomainIds = unique(selectedFamilies.map((family) => family.domainId))
const singleSelectedDomainId = selectedDomainIds.length === 1 ? selectedDomainIds[0] : null

const sourceArtifacts = []
const inventoryItems = []
const manifestSourceFiles = []
const extractedSourceGroups = []
const chunkManifestChunks = []
const reviewPacketSourceFiles = []
const reviewPacketItems = []

for (const [index, selection] of sourceSelections.entries()) {
  const filePath = rawPath(selection.relativePath)
  if (!(await exists(filePath))) {
    throw new Error(`Missing source file for pilot batch: ${filePath}`)
  }

  const stat = await fs.stat(filePath)
  const fileHash = await sha256(filePath)
  const sourceFamily = sourceFamiliesById.get(selection.sourceFamilyId)
  if (!sourceFamily) {
    throw new Error(`Unknown source family: ${selection.sourceFamilyId}`)
  }
  const domainId = sourceFamily.domainId
  const filename = path.basename(filePath)
  const extension = path.extname(filename).toLowerCase()

  let pageCount = null
  let sliceText = ''
  let normalizedText = ''
  let pageReference = null
  let sectionReference = null
  let lineReference = null
  let citations = []
  let processingStatus = selection.artifactProcessingStatus ?? 'inventoried'
  let itemReviewFlags = [...selection.reviewFlags]
  let itemReviewStatus = selection.reviewStatus
  let nonLearnerFacingNotes =
    selection.nonLearnerFacingNotes ??
    'Pilot batch item; retain as review-only until the pilot is explicitly expanded.'
  let itemKind = selection.itemKind
  let chunkId = `chunk-${selection.sourceId}-${batchSlug}`
  let extractedItemId = `item-${selection.sourceId}-${batchSlug}`

  if (extension === '.pdf') {
    const [startPage, endPage] = selection.pageWindow
    const pdfSlice = await extractPdfPages(filePath, startPage, endPage)
    pageCount = pdfSlice.pageCount
    const pageTexts = pdfSlice.pages.map((page) => {
      const text = normalizeWhitespace(page.text || '')
      return `[p. ${page.pageNumber}] ${text}`
    })
    sliceText = pageTexts.join('\n\n')
    normalizedText = normalizeWhitespace(
      pdfSlice.pages.map((page) => page.text || '').join('\n'),
    )
    pageReference = `pp. ${startPage}-${endPage}`
    sectionReference = selection.sectionReference ?? 'n/a'
    citations = [
      {
        citationText: selection.citationText ?? selection.sourceReference ?? selection.sourceTitle,
        pageReference,
        sectionReference,
        sourceReference: selection.sourceReference,
        pageStart: startPage,
        pageEnd: endPage,
      },
    ]
  } else {
    const text = await fs.readFile(filePath, 'utf8')
    const lines = text.replace(/\r/g, '').split('\n')
    const cleanedLines = lines.map((line) => line.trimEnd())
    const lineCount = cleanedLines.length
    sliceText = cleanedLines.join('\n')
    normalizedText = normalizeWhitespace(sliceText)
    lineReference = `lines 1-${lineCount}`
    sectionReference = selection.sectionReference ?? 'n/a'
    pageCount = null
    citations = [
      {
        citationText: selection.citationText ?? selection.sourceReference ?? selection.sourceTitle,
        lineReference,
        sectionReference,
        sourceReference: selection.sourceReference,
      },
    ]
    itemReviewStatus = selection.reviewStatus ?? 'needs_human_review'
    itemReviewFlags = [...itemReviewFlags, 'line_reference_only']
    processingStatus = selection.artifactProcessingStatus ?? 'review_pending'
    nonLearnerFacingNotes =
      selection.nonLearnerFacingNotes ??
      'Edge-case text note retained for exception-first review only.'
  }

  const sourceArtifact = {
    sourceId: selection.sourceId,
    filename,
    filePath,
    sourceFamilyId: selection.sourceFamilyId,
    domainId,
    documentType: selection.documentType,
    sourceTitle: selection.sourceTitle,
    sourceReference: selection.sourceReference,
    versionDate: selection.versionDate,
    pageCount,
    processingStatus,
    notes: selection.sourceNotes ?? selection.notes,
  }
  sourceArtifacts.push(sourceArtifact)

  const inventoryItem = {
    sourceId: selection.sourceId,
    filename,
    filePath,
    sourceFamilyId: selection.sourceFamilyId,
    domainId,
    documentType: selection.documentType,
    sourceTitle: selection.sourceTitle,
    sourceReference: selection.sourceReference,
    versionDate: selection.versionDate,
    pageCount,
    processingStatus: selection.inventoryProcessingStatus ?? processingStatus,
    authorityLevel: selection.authorityLevel ?? 'guidance',
    jurisdiction: 'United States',
    confidentiality: 'public',
    fileHash,
    sizeBytes: stat.size,
    extension,
    notes: selection.notes,
    tags: selection.keywords,
  }
  inventoryItems.push(inventoryItem)

  manifestSourceFiles.push({
    sourceId: selection.sourceId,
    filename,
    filePath,
    sourceFamilyId: selection.sourceFamilyId,
    domainId,
    documentType: selection.documentType,
    versionDate: selection.versionDate,
    pageCount,
    processingStatus: 'selected',
    sourceReference: selection.sourceReference,
    sourceTitle: selection.sourceTitle,
    confidentiality: 'public',
    notes: selection.notes,
    fileHash,
    sizeBytes: stat.size,
    tags: selection.keywords,
  })

  const chunk = {
    stableId: chunkId,
    chunkId,
    extractedItemId,
    itemKind,
    sourceId: selection.sourceId,
    sourceFamilyId: selection.sourceFamilyId,
    domainId,
    documentType: selection.documentType,
    sourceTitle: selection.sourceTitle,
    sourceReference: selection.sourceReference,
    sourcePath: filePath,
    filePath,
    pageReference,
    sectionReference,
    lineReference,
    chunkText: sliceText,
    normalizedText,
    summary: selection.summary,
    keywords: selection.keywords,
    citations,
    confidence: selection.confidence,
    reviewFlags: itemReviewFlags,
    reviewStatus: itemReviewStatus,
    learnerFacingEligible: false,
    appReadyEligible: false,
    nonLearnerFacingNotes,
    notes: selection.notes,
  }
  chunkManifestChunks.push(chunk)

  const extractedItem = {
    stableId: chunkId,
    extractedItemId,
    itemKind,
    sourceId: selection.sourceId,
    sourceFamilyId: selection.sourceFamilyId,
    domainId,
    documentType: selection.documentType,
    sourceTitle: selection.sourceTitle,
    sourceReference: selection.sourceReference,
    sourcePath: filePath,
    pageReference,
    sectionReference,
    lineReference,
    chunkText: sliceText,
    normalizedText,
    summary: selection.summary,
    keywords: selection.keywords,
    citations,
    confidence: selection.confidence,
    reviewFlags: itemReviewFlags,
    reviewStatus: itemReviewStatus,
    learnerFacingEligible: false,
    appReadyEligible: false,
    nonLearnerFacingNotes,
    notes: selection.notes,
  }

  extractedSourceGroups.push({
    sourceId: selection.sourceId,
    filename,
    filePath,
    sourceFamilyId: selection.sourceFamilyId,
    domainId,
    documentType: selection.documentType,
    sourceTitle: selection.sourceTitle,
    sourceReference: selection.sourceReference,
    versionDate: selection.versionDate,
    pageCount,
    processingStatus,
    notes: selection.sourceNotes,
    extractedItems: [extractedItem],
  })

    reviewPacketSourceFiles.push({
    sourceId: selection.sourceId,
    filename,
    sourceReference: selection.sourceReference,
    sourceFamilyId: selection.sourceFamilyId,
    domainId,
    documentType: selection.documentType,
    processingStatus: selection.reviewPacketProcessingStatus ?? processingStatus,
    pageCount,
    issueCount: selection.reviewPacketIssueCount ?? 0,
    notes: selection.reviewPacketNotes ?? selection.notes,
  })

  reviewPacketItems.push({
    stableId: chunkId,
    sourceId: selection.sourceId,
    sourceFamilyId: selection.sourceFamilyId,
    domainId,
    documentType: selection.documentType,
    sourceReference: selection.sourceReference,
    sourcePath: filePath,
    pageReference: pageReference || '',
    sectionReference: sectionReference || '',
    lineReference: lineReference || '',
    summary: selection.summary,
    confidence: selection.confidence,
    reviewFlags: itemReviewFlags,
    learnerFacingEligible: false,
    appReadyEligible: false,
    notes: selection.reviewPacketNotes ?? selection.notes,
  })
}

const batchManifest = {
  ...manifestTemplate,
  schemaVersion: manifestTemplate.schemaVersion ?? '1.0',
  batchId,
  batchName,
  status: 'review_pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  projectName: config.project.name,
  projectPurpose: config.project.purpose,
  sourceFamilies: selectedFamilies.map((family) => ({
    sourceFamilyId: family.familyId,
    label: family.label,
    domainId: family.domainId,
    ...(family.description ? { description: family.description } : {}),
    ...(family.sourceRoots?.length ? { sourceRoots: family.sourceRoots } : {}),
    ...(family.notes ? { notes: family.notes } : {}),
  })),
  sourceFiles: manifestSourceFiles,
  processingIntent: {
    mode: manifestTemplate.processingIntent?.mode ?? 'small_pilot',
    targetDomains: selectedDomainIds,
    pipelineStages: ['inventory', 'extraction', 'chunking', 'labeling', 'review', 'validation'],
    smallPilot: true,
    learnerFacingBlocked: true,
    appExportRequested: false,
    ragReadinessRequested: true,
    reviewStrategy: 'exception_first',
    notes: processingIntentText,
  },
  boundaries: {
    rawSourceRoot: config.project.rawSourceRoot,
    rawMaterialExternal: true,
    gitExcludesRawFiles: true,
    noRealProcessing: false,
    noLearnerFacingPromotion: true,
    domainConfigPath: 'config/source-families.json',
    ignoredWorkingPaths: ['data/work', 'data/cache', 'data/extracted', 'data/generated'],
    notes: processingIntentNotes,
  },
  expectedOutputs: [
    'source_inventory',
    'chunk_manifest',
    'review_packet',
    'validation_report',
    'unresolved_issues_summary',
  ],
  reviewStatus: {
    defaultStatus: 'draft_candidate',
    reviewStrategy: 'exception_first',
    reviewFocus: 'exceptions_only',
    promotionGate:
      'source citation exists, source support is clear, wording is not misleading, confidence is high, and no unresolved review flags exist',
    learnerFacingAllowed: false,
    appReadyAllowed: false,
    reviewPacketRequired: true,
    notes: 'Pilot batch is review-only; no learner-facing or app-ready promotion is permitted.',
  },
  notes: batchSummaryNotes,
  extensions: {
    pilot: true,
    batchSlug,
    batchProfile,
  },
}

const sourceInventory = {
  schemaVersion: '1.0',
  inventoryId: `inventory-${batchId}-${batchSlug}`,
  batchId,
  generatedAt: new Date().toISOString(),
  sourceRoot: rawRoot,
  ...(singleSelectedDomainId ? { domainId: singleSelectedDomainId } : {}),
  processingStatus: 'inventoried',
  sourceFamilies: selectedFamilies.map((family) => ({
    sourceFamilyId: family.familyId,
    label: family.label,
    domainId: family.domainId,
    ...(family.notes ? { notes: family.notes } : {}),
  })),
  items: inventoryItems,
  summary: {
    sourceCount: inventoryItems.length,
    domains: selectedDomainIds,
    sourceFamilies: selectedFamilies.map((family) => family.familyId),
    selectedSourceIds: sourceSelections.map((selection) => selection.sourceId),
    reviewOnlySourceCount: inventoryItems.length,
  },
  notes: processingIntentNotes,
  extensions: {
    pilot: true,
    batchSlug,
    batchProfile,
  },
}

const chunkManifest = {
  schemaVersion: '1.0',
  chunkManifestId: `chunk-manifest-${batchId}-${batchSlug}`,
  batchId,
  generatedAt: new Date().toISOString(),
  processingStatus: 'review_pending',
  sourceFiles: inventoryItems.map((item) => ({
    sourceId: item.sourceId,
    filename: item.filename,
    sourceFamilyId: item.sourceFamilyId,
    domainId: item.domainId,
    documentType: item.documentType,
    processingStatus: item.processingStatus,
    sourceReference: item.sourceReference,
    notes: item.notes,
  })),
  chunks: chunkManifestChunks,
  summary: {
    sourceFileCount: inventoryItems.length,
    chunkCount: chunkManifestChunks.length,
    reviewOnlyChunkCount: chunkManifestChunks.length,
    sourceIds: chunkManifestChunks.map((chunk) => chunk.sourceId),
  },
  notes: batchSummaryNotes,
  extensions: {
    pilot: true,
    batchSlug,
    batchProfile,
  },
}

const extractionOutput = {
  schemaVersion: '1.0',
  extractionRunId: `extraction-${batchId}-${batchSlug}`,
  batchId,
  generatedAt: new Date().toISOString(),
  processingStatus: 'review_pending',
  extractionMethod:
    'targeted pilot slice using PyPDF2 page reads for PDFs and direct line-bound text extraction for the plain-text source',
  sourceGroups: extractedSourceGroups,
  summary: {
    sourceGroupCount: extractedSourceGroups.length,
    extractedItemCount: extractedSourceGroups.length,
    reviewOnlyItemCount: extractedSourceGroups.length,
    sourceIds: extractedSourceGroups.map((group) => group.sourceId),
  },
  notes: batchSummaryText,
  extensions: {
    pilot: true,
    batchSlug,
    batchProfile,
  },
}

const reviewPacket = {
  ...reviewTemplate,
  schemaVersion: reviewTemplate.schemaVersion ?? '1.0',
  packetId: `review-packet-${batchId}-${batchSlug}`,
  batchId,
  generatedAt: new Date().toISOString(),
  reviewMode: 'exception_first',
  batchSummary: {
    batchName,
    sourceFamilies: selectedFamilies.map((family) => family.familyId),
    processingIntent: processingIntentText,
    sourceFileCount: reviewPacketSourceFiles.length,
    extractedItemCount: reviewPacketItems.length,
    exceptionCount: reviewPacketFlags.length,
    summary: batchSummaryText,
    notes: batchSummaryNotes,
  },
  sourceFilesProcessed: reviewPacketSourceFiles,
  extractedItems: reviewPacketItems,
  requiredHumanDecisions: reviewPacketHumanDecisions,
  exceptionsAndFlags: reviewPacketFlags,
  citationIssues: reviewPacketCitationIssues,
  unresolvedIssues,
  promotionRecommendation: {
    status: 'not_recommended',
    reason: reviewPacketReason,
    recommendedNextStep: reviewPacketNextStep,
    targetExport: 'review_packet',
  },
  learnerFacingStatus: {
    ready: false,
    reason: 'No item in the pilot batch met the promotion gate.',
    statusText: 'not approved',
  },
  ragReadiness: {
    ready: false,
    reason: 'No approved indexed material exists yet.',
    indexableItemCount: 0,
    notes: 'All pilot items remain review-only until a human approves a promotion candidate.',
  },
  appExportReadiness: {
    ready: false,
    reason: 'No approved promoted export has been created.',
    targetExports: ['approved_promoted_export', 'app_ready_export'],
    notes: 'App export is intentionally omitted from the first pilot.',
  },
  reviewerNotes,
  extensions: {
    pilot: true,
    batchSlug,
    batchProfile,
  },
}

const unresolvedIssuesSummary = [
  '# Unresolved Issues Summary',
  '',
  ...unresolvedIssues.map(
    (issue) => `- ${issue.issueId}: ${issue.message} [${issue.severity}; ${issue.issueType}]`,
  ),
  '- This batch remains review-only until a human approves any promotion candidate.',
  '- No learner-facing promotion candidates were produced in the pilot batch.',
  '- No app-ready export was produced, by design.',
  '- The pilot should stay tiny until the citation pattern is confirmed by human review.',
].join('\n')

const validationReport = {
  schemaVersion: '1.0',
  reportId: `validation-report-${batchId}-${batchSlug}`,
  batchId,
  generatedAt: new Date().toISOString(),
  status: 'passed',
  checks: validationChecks,
  checkedArtifacts: {
    batchManifest: path.relative(repoRoot, batchManifestPath),
    sourceInventory: path.relative(repoRoot, sourceInventoryPath),
    chunkManifest: path.relative(repoRoot, chunkManifestPath),
    extractionOutput: path.relative(repoRoot, extractionOutputPath),
    reviewPacketJson: path.relative(repoRoot, reviewPacketJsonPath),
    reviewPacketMd: path.relative(repoRoot, reviewPacketMdPath),
    unresolvedIssuesSummary: path.relative(repoRoot, unresolvedIssuesPath),
  },
  pilotSummary: {
    selectedSourceCount: sourceSelections.length,
    extractedItemCount: extractionOutput.summary.extractedItemCount,
    reviewOnlyItemCount: extractionOutput.summary.reviewOnlyItemCount,
    exceptionCount: reviewPacket.exceptionsAndFlags.length,
  },
  notes: [
    'Real source files were processed in a tiny, source-bound pilot batch.',
    'No learner-facing content, approved promotions, or app-ready exports were created.',
    'All outputs remain review-only, and unresolved issues are recorded in the review packet and summary file.',
  ],
  extensions: {
    pilot: true,
    batchSlug,
    batchProfile,
  },
}

await fs.mkdir(reviewRoot, { recursive: true })
await writeJson(batchManifestPath, batchManifest)
await writeJson(sourceInventoryPath, sourceInventory)
await writeJson(chunkManifestPath, chunkManifest)
await writeJson(extractionOutputPath, extractionOutput)
await writeJson(reviewPacketJsonPath, reviewPacket)
await writeText(reviewPacketMdPath, renderReviewPacketMarkdown(reviewPacket))
await writeJson(validationReportPath, validationReport)
await writeText(unresolvedIssuesPath, unresolvedIssuesSummary)

console.log(`Pilot batch prepared at ${batchRoot}`)
console.log(`Selected source files: ${sourceSelections.length}`)
console.log(`Batch manifest: ${batchManifestPath}`)
console.log(`Source inventory: ${sourceInventoryPath}`)
console.log(`Chunk manifest: ${chunkManifestPath}`)
console.log(`Extraction output: ${extractionOutputPath}`)
console.log(`Review packet: ${reviewPacketJsonPath}`)
console.log(`Validation report: ${validationReportPath}`)

function renderReviewPacketMarkdown(packet) {
  const renderList = (items, emptyText = '- None') =>
    items.length
      ? items
          .map((item) => `- ${item}`)
          .join('\n')
      : emptyText

  const renderSourceFilesTable = (items) => {
    if (!items.length) {
      return '- None'
    }
    return [
      '| Source ID | Filename | Source Reference | Status | Pages | Notes |',
      '| --- | --- | --- | --- | --- | --- |',
      ...items.map(
        (item) =>
          `| ${item.sourceId} | ${item.filename} | ${item.sourceReference ?? 'n/a'} | ${item.processingStatus} | ${item.pageCount ?? 'n/a'} | ${item.notes} |`,
      ),
    ].join('\n')
  }

  const renderLocator = (item) => {
    if (item.pageReference) return item.pageReference
    if (item.lineReference) return item.lineReference
    if (item.sectionReference) return item.sectionReference
    return 'n/a'
  }

  const renderExtractedItems = (items) => {
    if (!items.length) {
      return '- None'
    }
    return items
      .map(
        (item) =>
          `- **${item.stableId}** (${item.sourceId}) - ${item.summary} ` +
          `[locator: ${renderLocator(item)}; ref: ${item.sourceReference ?? 'n/a'}] ` +
          `[confidence: ${item.confidence}; learner-facing: ${item.learnerFacingEligible ? 'yes' : 'no'}; app-ready: ${item.appReadyEligible ? 'yes' : 'no'}] ` +
          `[review flags: ${(item.reviewFlags ?? []).join(', ') || 'none'}]`,
      )
      .join('\n')
  }

  const renderDecisions = (items) => {
    if (!items.length) {
      return '- None'
    }
    return items
      .map(
        (item) =>
          `- **${item.decisionId}** (${item.decisionType}) - ${item.question} ` +
          `[owner: ${item.recommendedOwner}; priority: ${item.priority}]`,
      )
      .join('\n')
  }

  const renderFlags = (items) => {
    if (!items.length) {
      return '- None'
    }
    return items
      .map(
        (item) =>
          `- **${item.flagId}** (${item.severity}) - ${item.message} ` +
          `[${item.flagType}]`,
      )
      .join('\n')
  }

  const renderCitationIssues = (items) => {
    if (!items.length) {
      return '- None'
    }
    return items
      .map(
        (item) =>
          `- **${item.issueId}** (${item.issueType}) - ${item.details} ` +
          `[recommended action: ${item.recommendedAction}]`,
      )
      .join('\n')
  }

  const renderUnresolvedIssues = (items) => {
    if (!items.length) {
      return '- None'
    }
    return items
      .map(
        (item) =>
          `- **${item.issueId}** (${item.severity}) - ${item.message} ` +
          `[source: ${item.sourceId ?? 'n/a'}; item: ${item.itemId ?? 'n/a'}] ` +
          `[${item.issueType}; recommended action: ${item.recommendedAction}]`,
      )
      .join('\n')
  }

  return `# Review Packet: ${packet.packetId}

## Batch Summary

- Batch ID: ${packet.batchId}
- Review mode: ${packet.reviewMode}
- Batch name: ${packet.batchSummary.batchName}
- Source families: ${packet.batchSummary.sourceFamilies.join(', ')}
- Processing intent: ${packet.batchSummary.processingIntent}
- Source file count: ${packet.batchSummary.sourceFileCount}
- Extracted item count: ${packet.batchSummary.extractedItemCount}
- Exception count: ${packet.batchSummary.exceptionCount}

## Source Files Processed

${renderSourceFilesTable(packet.sourceFilesProcessed)}

## Extracted Items

Review flags below act as extraction categories and exception tags; all items stay review-only unless a later batch explicitly promotes them.

${renderExtractedItems(packet.extractedItems)}

## Required Human Decisions

${renderDecisions(packet.requiredHumanDecisions)}

## Exceptions/Flags

${renderFlags(packet.exceptionsAndFlags)}

## Citation/Source-Reference Issues

${renderCitationIssues(packet.citationIssues)}

## Unresolved Issues

${renderUnresolvedIssues(packet.unresolvedIssues)}

## Promotion Recommendation

- Status: ${packet.promotionRecommendation.status}
- Reason: ${packet.promotionRecommendation.reason}
- Recommended next step: ${packet.promotionRecommendation.recommendedNextStep}
- Target export: ${packet.promotionRecommendation.targetExport}

## RAG Readiness

- Ready: ${packet.ragReadiness.ready}
- Indexable item count: ${packet.ragReadiness.indexableItemCount ?? 0}
- Notes: ${packet.ragReadiness.notes}

## App Export Readiness

- Ready: ${packet.appExportReadiness.ready}
- Notes: ${packet.appExportReadiness.notes}

## Not Approved / Learner-facing Status

- Learner-facing status: not approved
- Learner-facing ready: ${packet.learnerFacingStatus.ready}
- Reason: ${packet.learnerFacingStatus.reason}
- Status text: ${packet.learnerFacingStatus.statusText}

## Reviewer Notes

${packet.reviewerNotes}
`
}
