import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const paths = {
  config: path.join(repoRoot, 'config', 'source-families.json'),
  batchManifestSchema: path.join(
    repoRoot,
    'data',
    'schemas',
    'batch-manifest.schema.json',
  ),
  sourceInventorySchema: path.join(
    repoRoot,
    'data',
    'schemas',
    'source-inventory.schema.json',
  ),
  extractionOutputSchema: path.join(
    repoRoot,
    'data',
    'schemas',
    'extraction-output.schema.json',
  ),
  reviewPacketSchema: path.join(
    repoRoot,
    'data',
    'schemas',
    'review-packet.schema.json',
  ),
  batchManifestTemplate: path.join(
    repoRoot,
    'data',
    'templates',
    'batch-manifest.template.json',
  ),
  reviewPacketTemplateJson: path.join(
    repoRoot,
    'data',
    'templates',
    'review-packet.template.json',
  ),
  reviewPacketTemplateMd: path.join(
    repoRoot,
    'data',
    'templates',
    'review-packet.template.md',
  ),
  sampleRoot: path.join(repoRoot, 'data', 'samples', 'contract-demo'),
  sampleBatchManifest: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'batch-manifest.sample.json',
  ),
  sampleSourceInventory: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'source-inventory.sample.json',
  ),
  sampleExtractionOutput: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'extraction-output.sample.json',
  ),
  sampleReviewPacketJson: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'review-packet.sample.json',
  ),
  sampleReviewPacketMd: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'review-packet.sample.md',
  ),
  sampleReadme: path.join(
    repoRoot,
    'data',
    'samples',
    'contract-demo',
    'README.md',
  ),
  workingBatchManifest: path.join(
    repoRoot,
    'data',
    'work',
    'batches',
    'batch-001',
    'batch-manifest.json',
  ),
  pilotChunkManifest: path.join(
    repoRoot,
    'data',
    'work',
    'batches',
    'batch-001',
    'chunk-manifest.json',
  ),
  pilotSourceInventory: path.join(
    repoRoot,
    'data',
    'work',
    'batches',
    'batch-001',
    'source-inventory.json',
  ),
  pilotExtractionOutput: path.join(
    repoRoot,
    'data',
    'work',
    'batches',
    'batch-001',
    'extraction-output.json',
  ),
  pilotReviewPacketJson: path.join(
    repoRoot,
    'data',
    'work',
    'batches',
    'batch-001',
    'review',
    'review-packet.json',
  ),
  pilotReviewPacketMd: path.join(
    repoRoot,
    'data',
    'work',
    'batches',
    'batch-001',
    'review',
    'review-packet.md',
  ),
  pilotValidationReport: path.join(
    repoRoot,
    'data',
    'work',
    'batches',
    'batch-001',
    'validation-report.json',
  ),
  pilotUnresolvedIssuesSummary: path.join(
    repoRoot,
    'data',
    'work',
    'batches',
    'batch-001',
    'unresolved-issues-summary.md',
  ),
}

const requiredFiles = [
  'README.md',
  'package.json',
  'config/source-families.json',
  'data/README.md',
  'data/templates/batch-manifest.template.json',
  'data/templates/review-packet.template.json',
  'data/templates/review-packet.template.md',
  'data/schemas/batch-manifest.schema.json',
  'data/schemas/source-inventory.schema.json',
  'data/schemas/extraction-output.schema.json',
  'data/schemas/review-packet.schema.json',
  'data/samples/contract-demo/README.md',
  'data/samples/contract-demo/batch-manifest.sample.json',
  'data/samples/contract-demo/source-inventory.sample.json',
  'data/samples/contract-demo/extraction-output.sample.json',
  'data/samples/contract-demo/review-packet.sample.json',
  'data/samples/contract-demo/review-packet.sample.md',
  'docs/processor/PROJECT_BRIEF.md',
  'docs/codex/skills/README.md',
  'docs/codex/skills/SOURCE_BOUND_EXTRACTION_SKILL.md',
  'docs/codex/skills/LEARNER_FACING_PROMOTION_GATE_SKILL.md',
  'docs/codex/skills/RAG_READINESS_SKILL.md',
  'docs/codex/skills/EXCEPTION_FIRST_REVIEW_SKILL.md',
  'docs/codex/skills/CROSS_DOMAIN_PORTABILITY_SKILL.md',
  'docs/codex/skills/PRIVACY_AND_DATA_HYGIENE_SKILL.md',
  'docs/codex/skills/APP_EXPORT_CONTRACT_SKILL.md',
  'docs/codex/skills/SESSION_HANDOFF_SKILL.md',
  'docs/project-state/CURRENT_STATE.md',
  'docs/project-state/HANDOFF_PROCESS.md',
  'docs/project-state/SOURCE_GUARDRAILS.md',
  'docs/project-state/DECISIONS.md',
  'docs/project-state/NEXT_ACTIONS.md',
  'docs/project-state/SESSION_LOG.md',
  'scripts/bootstrap-small-batch.mjs',
  'scripts/validate-scaffold.mjs',
  'scripts/run-pilot-batch.mjs',
]

const requiredReviewHeadings = [
  '## Batch Summary',
  '## Source Files Processed',
  '## Extracted Items',
  '## Required Human Decisions',
  '## Exceptions/Flags',
  '## Citation/Source-Reference Issues',
  '## Promotion Recommendation',
  '## RAG Readiness',
  '## App Export Readiness',
  '## Not Approved / Learner-facing Status',
  '## Reviewer Notes',
]

const problems = []
const warnings = []

const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const hasString = (value) => typeof value === 'string' && value.trim().length > 0
const isBoolean = (value) => typeof value === 'boolean'
const isIntegerOrNull = (value) =>
  value === null || Number.isInteger(value)

const readText = async (filePath) => fs.readFile(filePath, 'utf8')
const readJson = async (filePath) => JSON.parse(await readText(filePath))

const exists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const requireFile = async (relativePath) => {
  const fullPath = path.join(repoRoot, relativePath)
  if (!(await exists(fullPath))) {
    problems.push(`Missing required file: ${relativePath}`)
  }
}

const expectArray = (value, label, allowEmpty = true) => {
  if (!Array.isArray(value)) {
    problems.push(`${label} must be an array`)
    return false
  }
  if (!allowEmpty && value.length === 0) {
    problems.push(`${label} must not be empty`)
    return false
  }
  return true
}

const expectObject = (value, label) => {
  if (!isObject(value)) {
    problems.push(`${label} must be an object`)
    return false
  }
  return true
}

const validateSchemaEnvelope = (schema, label) => {
  expectObject(schema, label)
  if (!schema) return
  if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
    problems.push(`${label}: unexpected $schema`)
  }
  if (!hasString(schema.$id)) {
    problems.push(`${label}: missing $id`)
  }
  if (!hasString(schema.title)) {
    problems.push(`${label}: missing title`)
  }
  if (schema.type !== 'object') {
    problems.push(`${label}: top-level type must be object`)
  }
  if (!isObject(schema.properties)) {
    problems.push(`${label}: missing properties object`)
  }
  if (!Array.isArray(schema.required)) {
    problems.push(`${label}: missing required array`)
  }
  if (schema.properties?.schemaVersion?.const !== '1.0') {
    problems.push(`${label}: schemaVersion const must be 1.0`)
  }
}

const expectedBatchOutputs = [
  'source_inventory',
  'chunk_manifest',
  'review_packet',
  'approved_promoted_export',
  'app_ready_export',
  'validation_report',
  'unresolved_issues_summary',
]

const pilotExpectedOutputs = [
  'source_inventory',
  'chunk_manifest',
  'review_packet',
  'validation_report',
  'unresolved_issues_summary',
]

const validateBatchManifestLike = (manifest, label, options = {}) => {
  const { mode = 'template' } = options
  const isPilot = mode === 'pilot'
  const isScaffold = mode === 'scaffold'

  if (!expectObject(manifest, label)) return

  const sourceFamilies = manifest.sourceFamilies
  const sourceFiles = manifest.sourceFiles
  const processingIntent = manifest.processingIntent
  const boundaries = manifest.boundaries
  const reviewStatus = manifest.reviewStatus

  if (manifest.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  if (!hasString(manifest.batchId)) {
    problems.push(`${label}: missing batchId`)
  }
  if (!hasString(manifest.projectName)) {
    problems.push(`${label}: missing projectName`)
  }
  if (!hasString(manifest.projectPurpose)) {
    problems.push(`${label}: missing projectPurpose`)
  }
  if (
    !['draft', 'queued', 'processing', 'review_pending', 'complete', 'blocked'].includes(
      manifest.status,
    )
  ) {
    problems.push(`${label}: invalid status`)
  }
  if (!expectArray(sourceFamilies, `${label}.sourceFamilies`, false)) return
  if (!expectArray(sourceFiles, `${label}.sourceFiles`)) return
  if (!expectObject(processingIntent, `${label}.processingIntent`)) return
  if (!expectObject(boundaries, `${label}.boundaries`)) return
  if (!expectObject(reviewStatus, `${label}.reviewStatus`)) return

  if (isPilot && sourceFiles.length === 0) {
    problems.push(`${label}: pilot batch must include at least one source file`)
  }
  if (isPilot && manifest.status !== 'review_pending' && manifest.status !== 'complete') {
    problems.push(`${label}: pilot batch status must be review_pending or complete`)
  }
  if (isPilot && boundaries.noRealProcessing !== false) {
    problems.push(`${label}.boundaries: noRealProcessing must be false for a real pilot batch`)
  }
  if (isScaffold && boundaries.noRealProcessing !== true) {
    problems.push(`${label}.boundaries: noRealProcessing must be true for scaffold validation`)
  }
  if (isPilot && processingIntent.appExportRequested !== false) {
    problems.push(`${label}.processingIntent: appExportRequested must be false for the pilot batch`)
  }
  if (!isPilot && processingIntent.appExportRequested !== true) {
    problems.push(`${label}.processingIntent: appExportRequested must be true for scaffold validation`)
  }
  if (isPilot && !sourceFiles.every((sourceFile) => sourceFile.processingStatus === 'selected')) {
    problems.push(`${label}.sourceFiles: pilot source files must be marked selected`)
  }

  sourceFamilies.forEach((family, index) => {
    const familyLabel = `${label}.sourceFamilies[${index}]`
    if (!expectObject(family, familyLabel)) return
    if (!hasString(family.sourceFamilyId)) {
      problems.push(`${familyLabel}: missing sourceFamilyId`)
    }
    if (!hasString(family.label)) {
      problems.push(`${familyLabel}: missing label`)
    }
    if (!hasString(family.domainId)) {
      problems.push(`${familyLabel}: missing domainId`)
    }
  })

  sourceFiles.forEach((sourceFile, index) => {
    const sourceLabel = `${label}.sourceFiles[${index}]`
    if (!expectObject(sourceFile, sourceLabel)) return
    ;['sourceId', 'filename', 'sourceFamilyId', 'documentType', 'processingStatus'].forEach(
      (field) => {
        if (!hasString(sourceFile[field])) {
          problems.push(`${sourceLabel}: missing ${field}`)
        }
      },
    )
    if (sourceFile.versionDate !== undefined && sourceFile.versionDate !== null && !hasString(sourceFile.versionDate)) {
      problems.push(`${sourceLabel}: versionDate must be a date string or null`)
    }
    if (!isIntegerOrNull(sourceFile.pageCount)) {
      problems.push(`${sourceLabel}: pageCount must be an integer or null`)
    }
  })

  if (!hasString(processingIntent.mode)) {
    problems.push(`${label}.processingIntent: missing mode`)
  }
  if (!expectArray(processingIntent.targetDomains, `${label}.processingIntent.targetDomains`, false)) {
    return
  }
  if (!expectArray(processingIntent.pipelineStages, `${label}.processingIntent.pipelineStages`, false)) {
    return
  }
  if (!isBoolean(processingIntent.smallPilot)) {
    problems.push(`${label}.processingIntent: smallPilot must be boolean`)
  }
  if (processingIntent.learnerFacingBlocked !== true) {
    problems.push(`${label}.processingIntent: learnerFacingBlocked must be true`)
  }
  if (processingIntent.ragReadinessRequested !== true) {
    problems.push(`${label}.processingIntent: ragReadinessRequested must be true`)
  }
  if (processingIntent.reviewStrategy !== 'exception_first') {
    problems.push(`${label}.processingIntent: reviewStrategy must be exception_first`)
  }
  if (isPilot) {
    ;['inventory', 'extraction', 'chunking', 'labeling', 'review', 'validation'].forEach((stage) => {
      if (!processingIntent.pipelineStages.includes(stage)) {
        problems.push(`${label}.processingIntent: pilot batch must include pipeline stage ${stage}`)
      }
    })
    if (processingIntent.pipelineStages.includes('promotion')) {
      problems.push(`${label}.processingIntent: pilot batch must not include promotion stage`)
    }
    if (processingIntent.pipelineStages.includes('export')) {
      problems.push(`${label}.processingIntent: pilot batch must not include export stage`)
    }
  }

  if (boundaries.rawMaterialExternal !== true) {
    problems.push(`${label}.boundaries: rawMaterialExternal must be true`)
  }
  if (boundaries.gitExcludesRawFiles !== true) {
    problems.push(`${label}.boundaries: gitExcludesRawFiles must be true`)
  }
  if (boundaries.noLearnerFacingPromotion !== true) {
    problems.push(`${label}.boundaries: noLearnerFacingPromotion must be true`)
  }
  if (!hasString(boundaries.rawSourceRoot)) {
    problems.push(`${label}.boundaries: missing rawSourceRoot`)
  }
  if (!hasString(boundaries.domainConfigPath)) {
    problems.push(`${label}.boundaries: missing domainConfigPath`)
  }

  if (!Array.isArray(manifest.expectedOutputs)) {
    problems.push(`${label}: expectedOutputs must be an array`)
  } else {
    const requiredOutputs = isPilot ? pilotExpectedOutputs : expectedBatchOutputs
    requiredOutputs.forEach((output) => {
      if (!manifest.expectedOutputs.includes(output)) {
        problems.push(`${label}: expectedOutputs missing ${output}`)
      }
    })
    if (isPilot) {
      ['approved_promoted_export', 'app_ready_export'].forEach((output) => {
        if (manifest.expectedOutputs.includes(output)) {
          problems.push(`${label}: pilot batch must not expect ${output}`)
        }
      })
    }
  }

  if (reviewStatus.defaultStatus !== 'draft_candidate') {
    problems.push(`${label}.reviewStatus: defaultStatus must be draft_candidate`)
  }
  if (reviewStatus.reviewStrategy !== 'exception_first') {
    problems.push(`${label}.reviewStatus: reviewStrategy must be exception_first`)
  }
  if (reviewStatus.reviewFocus !== 'exceptions_only') {
    problems.push(`${label}.reviewStatus: reviewFocus must be exceptions_only`)
  }
  if (reviewStatus.learnerFacingAllowed !== false) {
    problems.push(`${label}.reviewStatus: learnerFacingAllowed must be false`)
  }
  if (reviewStatus.appReadyAllowed !== false) {
    problems.push(`${label}.reviewStatus: appReadyAllowed must be false`)
  }
  if (reviewStatus.reviewPacketRequired !== true) {
    problems.push(`${label}.reviewStatus: reviewPacketRequired must be true`)
  }
}

const validateChunkManifestLike = (chunkManifest, label) => {
  if (!expectObject(chunkManifest, label)) return
  if (chunkManifest.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['chunkManifestId', 'batchId', 'generatedAt', 'processingStatus'].forEach((field) => {
    if (!hasString(chunkManifest[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (!expectArray(chunkManifest.sourceFiles, `${label}.sourceFiles`, false)) return
  if (!expectArray(chunkManifest.chunks, `${label}.chunks`, false)) return
  chunkManifest.sourceFiles.forEach((item, index) => {
    const itemLabel = `${label}.sourceFiles[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['sourceId', 'filename', 'sourceFamilyId', 'domainId', 'documentType', 'processingStatus', 'notes'].forEach(
      (field) => {
        if (!hasString(item[field])) {
          problems.push(`${itemLabel}: missing ${field}`)
        }
      },
    )
  })
  chunkManifest.chunks.forEach((chunk, index) => {
    const chunkLabel = `${label}.chunks[${index}]`
    if (!expectObject(chunk, chunkLabel)) return
    ;[
      'stableId',
      'chunkId',
      'sourceId',
      'sourceFamilyId',
      'domainId',
      'documentType',
      'chunkText',
      'summary',
      'confidence',
      'reviewStatus',
      'nonLearnerFacingNotes',
    ].forEach((field) => {
      if (!hasString(chunk[field])) {
        problems.push(`${chunkLabel}: missing ${field}`)
      }
    })
    if (!expectArray(chunk.keywords, `${chunkLabel}.keywords`, false)) return
    if (!expectArray(chunk.citations, `${chunkLabel}.citations`, false)) return
    if (!expectArray(chunk.reviewFlags, `${chunkLabel}.reviewFlags`, false)) return
    if (chunk.learnerFacingEligible !== false) {
      problems.push(`${chunkLabel}: learnerFacingEligible must be false`)
    }
    if (chunk.appReadyEligible !== false) {
      problems.push(`${chunkLabel}: appReadyEligible must be false`)
    }
  })
}

const validateSourceInventoryLike = (inventory, label) => {
  if (!expectObject(inventory, label)) return
  if (inventory.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['inventoryId', 'batchId', 'generatedAt', 'sourceRoot'].forEach((field) => {
    if (!hasString(inventory[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (!expectArray(inventory.sourceFamilies, `${label}.sourceFamilies`, false)) return
  if (!expectArray(inventory.items, `${label}.items`)) return

  inventory.sourceFamilies.forEach((family, index) => {
    const familyLabel = `${label}.sourceFamilies[${index}]`
    if (!expectObject(family, familyLabel)) return
    if (!hasString(family.sourceFamilyId)) {
      problems.push(`${familyLabel}: missing sourceFamilyId`)
    }
    if (!hasString(family.label)) {
      problems.push(`${familyLabel}: missing label`)
    }
    if (!hasString(family.domainId)) {
      problems.push(`${familyLabel}: missing domainId`)
    }
  })

  inventory.items.forEach((item, index) => {
    const itemLabel = `${label}.items[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['sourceId', 'filename', 'filePath', 'sourceFamilyId', 'domainId', 'documentType', 'processingStatus', 'notes'].forEach(
      (field) => {
        if (!hasString(item[field])) {
          problems.push(`${itemLabel}: missing ${field}`)
        }
      },
    )
    if (
      ![
        'discovered',
        'inventoried',
        'selected',
        'excluded',
        'queued_for_processing',
        'needs_human_review',
        'processed',
        'error',
      ].includes(item.processingStatus)
    ) {
      problems.push(`${itemLabel}: invalid processingStatus`)
    }
    if (item.pageCount !== undefined && !isIntegerOrNull(item.pageCount)) {
      problems.push(`${itemLabel}: pageCount must be an integer or null`)
    }
    if (item.versionDate !== undefined && item.versionDate !== null && !hasString(item.versionDate)) {
      problems.push(`${itemLabel}: versionDate must be a date string or null`)
    }
  })
}

const validateExtractionOutputLike = (output, label) => {
  if (!expectObject(output, label)) return
  if (output.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['extractionRunId', 'batchId', 'generatedAt', 'extractionMethod'].forEach((field) => {
    if (!hasString(output[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (output.processingStatus !== 'extracted' && output.processingStatus !== 'review_pending' && output.processingStatus !== 'draft') {
    problems.push(`${label}: invalid processingStatus`)
  }
  if (!expectArray(output.sourceGroups, `${label}.sourceGroups`, false)) return

  output.sourceGroups.forEach((group, groupIndex) => {
    const groupLabel = `${label}.sourceGroups[${groupIndex}]`
    if (!expectObject(group, groupLabel)) return
    ;['sourceId', 'filename', 'filePath', 'sourceFamilyId', 'domainId', 'documentType', 'processingStatus'].forEach(
      (field) => {
        if (!hasString(group[field])) {
          problems.push(`${groupLabel}: missing ${field}`)
        }
      },
    )
    if (!expectArray(group.extractedItems, `${groupLabel}.extractedItems`, false)) return

    group.extractedItems.forEach((item, itemIndex) => {
      const itemLabel = `${groupLabel}.extractedItems[${itemIndex}]`
      if (!expectObject(item, itemLabel)) return
      ;[
        'stableId',
        'extractedItemId',
        'itemKind',
        'sourceId',
        'sourceFamilyId',
        'domainId',
        'documentType',
        'chunkText',
        'summary',
        'nonLearnerFacingNotes',
      ].forEach((field) => {
        if (!hasString(item[field])) {
          problems.push(`${itemLabel}: missing ${field}`)
        }
      })
      if (!expectArray(item.keywords, `${itemLabel}.keywords`, false)) return
      if (!expectArray(item.citations, `${itemLabel}.citations`, false)) return
      if (!expectArray(item.reviewFlags, `${itemLabel}.reviewFlags`, false)) return
      if (item.confidence !== 'low' && item.confidence !== 'medium' && item.confidence !== 'high') {
        problems.push(`${itemLabel}: invalid confidence`)
      }
      if (item.reviewStatus === undefined || item.reviewStatus === null) {
        problems.push(`${itemLabel}: missing reviewStatus`)
      }
      if (item.learnerFacingEligible !== false) {
        problems.push(`${itemLabel}: learnerFacingEligible must be false`)
      }
      if (item.appReadyEligible !== false) {
        problems.push(`${itemLabel}: appReadyEligible must be false`)
      }
      if (item.citations.length === 0) {
        problems.push(`${itemLabel}: citations must not be empty`)
      }
      item.citations.forEach((citation, citationIndex) => {
        const citationLabel = `${itemLabel}.citations[${citationIndex}]`
        if (!expectObject(citation, citationLabel)) return
        if (!hasString(citation.citationText)) {
          problems.push(`${citationLabel}: missing citationText`)
        }
      })
    })
  })
}

const validateReviewPacketLike = (packet, label) => {
  if (!expectObject(packet, label)) return
  if (packet.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['packetId', 'batchId', 'generatedAt'].forEach((field) => {
    if (!hasString(packet[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (packet.reviewMode !== 'exception_first') {
    problems.push(`${label}: reviewMode must be exception_first`)
  }
  if (!expectObject(packet.batchSummary, `${label}.batchSummary`)) return
  if (!expectArray(packet.sourceFilesProcessed, `${label}.sourceFilesProcessed`)) return
  if (!expectArray(packet.extractedItems, `${label}.extractedItems`)) return
  if (!expectArray(packet.requiredHumanDecisions, `${label}.requiredHumanDecisions`)) return
  if (!expectArray(packet.exceptionsAndFlags, `${label}.exceptionsAndFlags`)) return
  if (!expectArray(packet.citationIssues, `${label}.citationIssues`)) return
  if (!expectObject(packet.promotionRecommendation, `${label}.promotionRecommendation`)) return
  if (!expectObject(packet.learnerFacingStatus, `${label}.learnerFacingStatus`)) return
  if (!expectObject(packet.ragReadiness, `${label}.ragReadiness`)) return
  if (!expectObject(packet.appExportReadiness, `${label}.appExportReadiness`)) return

  if (!hasString(packet.batchSummary.batchName)) {
    problems.push(`${label}.batchSummary: missing batchName`)
  }
  if (!expectArray(packet.batchSummary.sourceFamilies, `${label}.batchSummary.sourceFamilies`)) return
  if (!hasString(packet.batchSummary.processingIntent)) {
    problems.push(`${label}.batchSummary: missing processingIntent`)
  }
  if (!Number.isInteger(packet.batchSummary.sourceFileCount)) {
    problems.push(`${label}.batchSummary: sourceFileCount must be an integer`)
  }
  if (!Number.isInteger(packet.batchSummary.extractedItemCount)) {
    problems.push(`${label}.batchSummary: extractedItemCount must be an integer`)
  }
  if (!hasString(packet.batchSummary.summary)) {
    problems.push(`${label}.batchSummary: missing summary`)
  }

  if (!['not_recommended', 'review_candidate', 'approved_for_promotion', 'blocked'].includes(packet.promotionRecommendation.status)) {
    problems.push(`${label}.promotionRecommendation: invalid status`)
  }
  if (packet.learnerFacingStatus.ready !== false) {
    problems.push(`${label}.learnerFacingStatus: ready must be false`)
  }
  if (!hasString(packet.learnerFacingStatus.reason)) {
    problems.push(`${label}.learnerFacingStatus: missing reason`)
  }
  if (packet.appExportReadiness.ready !== false) {
    problems.push(`${label}.appExportReadiness: ready must be false`)
  }
  if (!hasString(packet.appExportReadiness.reason)) {
    problems.push(`${label}.appExportReadiness: missing reason`)
  }
  if (packet.ragReadiness.ready !== false) {
    problems.push(`${label}.ragReadiness: ready must be false`)
  }
  if (!hasString(packet.ragReadiness.reason)) {
    problems.push(`${label}.ragReadiness: missing reason`)
  }

  if (packet.sourceFilesProcessed.length !== packet.batchSummary.sourceFileCount) {
    problems.push(`${label}: sourceFileCount does not match sourceFilesProcessed length`)
  }
  if (packet.extractedItems.length !== packet.batchSummary.extractedItemCount) {
    problems.push(`${label}: extractedItemCount does not match extractedItems length`)
  }
  if (packet.exceptionsAndFlags.length !== packet.batchSummary.exceptionCount) {
    problems.push(`${label}: exceptionCount does not match exceptionsAndFlags length`)
  }

  packet.sourceFilesProcessed.forEach((item, index) => {
    const itemLabel = `${label}.sourceFilesProcessed[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['sourceId', 'filename', 'sourceFamilyId', 'documentType', 'processingStatus', 'notes'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
  })

  packet.extractedItems.forEach((item, index) => {
    const itemLabel = `${label}.extractedItems[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['stableId', 'sourceId', 'sourceFamilyId', 'documentType', 'summary', 'notes'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
    if (!expectArray(item.reviewFlags, `${itemLabel}.reviewFlags`, false)) return
    if (item.learnerFacingEligible !== false) {
      problems.push(`${itemLabel}: learnerFacingEligible must be false`)
    }
    if (item.appReadyEligible !== false) {
      problems.push(`${itemLabel}: appReadyEligible must be false`)
    }
  })

  packet.requiredHumanDecisions.forEach((item, index) => {
    const itemLabel = `${label}.requiredHumanDecisions[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['decisionId', 'decisionType', 'question', 'whyItMatters', 'recommendedOwner'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
  })

  packet.exceptionsAndFlags.forEach((item, index) => {
    const itemLabel = `${label}.exceptionsAndFlags[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['flagId', 'severity', 'flagType', 'message'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
  })

  packet.citationIssues.forEach((item, index) => {
    const itemLabel = `${label}.citationIssues[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['issueId', 'issueType', 'details', 'recommendedAction'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
  })
}

const validateReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  requiredReviewHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  if (!text.includes('not approved')) {
    problems.push(`${label}: must state not approved`)
  }
}

const validateValidationReportLike = (report, label) => {
  if (!expectObject(report, label)) return
  if (report.schemaVersion !== '1.0') {
    problems.push(`${label}: schemaVersion must be 1.0`)
  }
  ;['reportId', 'batchId', 'generatedAt', 'status'].forEach((field) => {
    if (!hasString(report[field])) {
      problems.push(`${label}: missing ${field}`)
    }
  })
  if (report.status !== 'passed') {
    problems.push(`${label}: status must be passed`)
  }
  if (!expectObject(report.checkedArtifacts, `${label}.checkedArtifacts`)) return
  if (!expectObject(report.pilotSummary, `${label}.pilotSummary`)) return
  if (!Array.isArray(report.notes) || report.notes.length === 0) {
    problems.push(`${label}: notes must be a non-empty array`)
  }
  ;['batchManifest', 'sourceInventory', 'chunkManifest', 'extractionOutput', 'reviewPacketJson', 'reviewPacketMd', 'unresolvedIssuesSummary'].forEach(
    (field) => {
      if (!hasString(report.checkedArtifacts[field])) {
        problems.push(`${label}.checkedArtifacts: missing ${field}`)
      }
    },
  )
  ;['selectedSourceCount', 'extractedItemCount', 'reviewOnlyItemCount', 'exceptionCount'].forEach((field) => {
    if (!Number.isInteger(report.pilotSummary[field])) {
      problems.push(`${label}.pilotSummary: ${field} must be an integer`)
    }
  })
}

const validateUnresolvedIssuesSummary = async (filePath, label) => {
  const text = await readText(filePath)
  if (!text.trim()) {
    problems.push(`${label}: must not be empty`)
  }
  if (!text.includes('AG 52')) {
    problems.push(`${label}: must mention AG 52`)
  }
  if (!text.includes('review-only')) {
    problems.push(`${label}: must mention review-only handling`)
  }
}

for (const relativePath of requiredFiles) {
  await requireFile(relativePath)
}

const config = await readJson(paths.config)
const batchManifestSchema = await readJson(paths.batchManifestSchema)
const sourceInventorySchema = await readJson(paths.sourceInventorySchema)
const extractionOutputSchema = await readJson(paths.extractionOutputSchema)
const reviewPacketSchema = await readJson(paths.reviewPacketSchema)
const batchManifestTemplate = await readJson(paths.batchManifestTemplate)
const reviewPacketTemplateJson = await readJson(paths.reviewPacketTemplateJson)
const sampleBatchManifest = await readJson(paths.sampleBatchManifest)
const sampleSourceInventory = await readJson(paths.sampleSourceInventory)
const sampleExtractionOutput = await readJson(paths.sampleExtractionOutput)
const sampleReviewPacketJson = await readJson(paths.sampleReviewPacketJson)
const workingBatchManifest = await readJson(paths.workingBatchManifest)

validateSchemaEnvelope(batchManifestSchema, 'batch-manifest.schema.json')
validateSchemaEnvelope(sourceInventorySchema, 'source-inventory.schema.json')
validateSchemaEnvelope(extractionOutputSchema, 'extraction-output.schema.json')
validateSchemaEnvelope(reviewPacketSchema, 'review-packet.schema.json')

validateBatchManifestLike(batchManifestTemplate, 'batch-manifest.template.json')
validateBatchManifestLike(sampleBatchManifest, 'batch-manifest.sample.json')
const workingBatchIsPilot =
  Array.isArray(workingBatchManifest.sourceFiles) && workingBatchManifest.sourceFiles.length > 0

validateBatchManifestLike(workingBatchManifest, 'data/work/batches/batch-001/batch-manifest.json', {
  mode: workingBatchIsPilot ? 'pilot' : 'scaffold',
})

validateSourceInventoryLike(sampleSourceInventory, 'source-inventory.sample.json')
validateExtractionOutputLike(sampleExtractionOutput, 'extraction-output.sample.json')
validateReviewPacketLike(reviewPacketTemplateJson, 'review-packet.template.json')
validateReviewPacketLike(sampleReviewPacketJson, 'review-packet.sample.json')

await validateReviewMarkdown(paths.reviewPacketTemplateMd, 'review-packet.template.md')
await validateReviewMarkdown(paths.sampleReviewPacketMd, 'review-packet.sample.md')

if (!config.project?.name) {
  problems.push('config/source-families.json: missing project.name')
}
if (!config.project?.rawSourceRoot) {
  problems.push('config/source-families.json: missing project.rawSourceRoot')
}
if (!Array.isArray(config.domains) || config.domains.length < 3) {
  problems.push('config/source-families.json: expected portability domains to be present')
}

if (workingBatchIsPilot) {
  const pilotRequiredFiles = [
    'data/work/batches/batch-001/source-inventory.json',
    'data/work/batches/batch-001/chunk-manifest.json',
    'data/work/batches/batch-001/extraction-output.json',
    'data/work/batches/batch-001/review/review-packet.json',
    'data/work/batches/batch-001/review/review-packet.md',
    'data/work/batches/batch-001/validation-report.json',
    'data/work/batches/batch-001/unresolved-issues-summary.md',
  ]

  for (const relativePath of pilotRequiredFiles) {
    await requireFile(relativePath)
  }

  const pilotSourceInventory = await readJson(paths.pilotSourceInventory)
  const pilotChunkManifest = await readJson(paths.pilotChunkManifest)
  const pilotExtractionOutput = await readJson(paths.pilotExtractionOutput)
  const pilotReviewPacketJson = await readJson(paths.pilotReviewPacketJson)
  const pilotValidationReport = await readJson(paths.pilotValidationReport)

  validateSourceInventoryLike(pilotSourceInventory, 'data/work/batches/batch-001/source-inventory.json')
  validateChunkManifestLike(pilotChunkManifest, 'data/work/batches/batch-001/chunk-manifest.json')
  validateExtractionOutputLike(pilotExtractionOutput, 'data/work/batches/batch-001/extraction-output.json')
  validateReviewPacketLike(pilotReviewPacketJson, 'data/work/batches/batch-001/review/review-packet.json')
  validateValidationReportLike(pilotValidationReport, 'data/work/batches/batch-001/validation-report.json')
  await validateReviewMarkdown(paths.pilotReviewPacketMd, 'data/work/batches/batch-001/review/review-packet.md')
  await validateUnresolvedIssuesSummary(
    paths.pilotUnresolvedIssuesSummary,
    'data/work/batches/batch-001/unresolved-issues-summary.md',
  )
}

if (problems.length > 0) {
  console.error('Scaffold validation failed.')
  for (const problem of problems) {
    console.error(`- ${problem}`)
  }
  process.exitCode = 1
} else {
  console.log('Scaffold validation passed.')
  console.log(`- Configured source families: ${config.sourceFamilies.length}`)
  console.log(`- Batch manifest source families: ${batchManifestTemplate.sourceFamilies.length}`)
  console.log(`- Demo sources in inventory sample: ${sampleSourceInventory.items.length}`)
  console.log(`- Demo source groups in extraction sample: ${sampleExtractionOutput.sourceGroups.length}`)
  console.log(`- Review packet headings verified: ${requiredReviewHeadings.length}`)
  if (workingBatchIsPilot) {
    console.log(`- Pilot source files: ${workingBatchManifest.sourceFiles.length}`)
    console.log(`- Pilot extracted items: ${workingBatchManifest.sourceFiles.length}`)
    console.log(`- Pilot review packet: validated`)
  }
}

for (const warning of warnings) {
  console.warn(`- ${warning}`)
}
