import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { batchDefinitions } from './batch-definitions.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const workBatchesRoot = path.join(repoRoot, 'data', 'work', 'batches')

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
  vm20BatchPlanJson: path.join(repoRoot, 'config', 'vm20-batch-plan.json'),
  vm20ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'vm20_extraction_plan.md'),
  vm20ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'vm20_review_index.md'),
  supportingVmReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'supporting_vm_review_index.md',
  ),
  vm21ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'vm21_review_index.md'),
  vm22ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'vm22_review_index.md'),
  pocStatusSummaryMd: path.join(
    repoRoot,
    'docs',
    'review',
    'valuation_regulation_repository_poc_status.md',
  ),
  supportingVmBatchPlanJson: path.join(repoRoot, 'config', 'supporting-vm-batch-plan.json'),
  supportingVmExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'supporting_vm_chapters_extraction_plan.md',
  ),
  vm21BatchPlanJson: path.join(repoRoot, 'config', 'vm21-batch-plan.json'),
  vm21ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'vm21_extraction_plan.md'),
  vm22BatchPlanJson: path.join(repoRoot, 'config', 'vm22-batch-plan.json'),
  vm22ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'vm22_extraction_plan.md'),
  ag01BatchPlanJson: path.join(repoRoot, 'config', 'ag01-batch-plan.json'),
  ag01ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag01_extraction_plan.md'),
  practiceNoteReviewIndexMd: path.join(
    repoRoot,
    'docs',
    'review',
    'vm20_practice_note_review_index.md',
  ),
  practiceNoteSelfReviewMd: path.join(
    repoRoot,
    'docs',
    'review',
    'vm20_practice_note_self_review.md',
  ),
  ag03ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag03_review_index.md'),
  ag03SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag03_self_review.md'),
  ag01ReviewIndexMd: path.join(repoRoot, 'docs', 'review', 'ag01_review_index.md'),
  ag01SelfReviewMd: path.join(repoRoot, 'docs', 'review', 'ag01_self_review.md'),
  ag02BatchPlanJson: path.join(repoRoot, 'config', 'ag02-batch-plan.json'),
  ag02ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag02_extraction_plan.md'),
  practiceNoteBatchPlanJson: path.join(
    repoRoot,
    'config',
    'vm20-practice-note-batch-plan.json',
  ),
  practiceNoteExtractionPlanMd: path.join(
    repoRoot,
    'docs',
    'processor',
    'vm20_practice_note_extraction_plan.md',
  ),
  ag03BatchPlanJson: path.join(repoRoot, 'config', 'ag03-batch-plan.json'),
  ag03ExtractionPlanMd: path.join(repoRoot, 'docs', 'processor', 'ag03_extraction_plan.md'),
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
  'docs/processor/supporting_vm_chapters_extraction_plan.md',
  'docs/processor/vm21_extraction_plan.md',
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
  'docs/processor/vm20_extraction_plan.md',
  'docs/processor/vm20_practice_note_extraction_plan.md',
  'docs/processor/ag03_extraction_plan.md',
  'docs/processor/ag01_extraction_plan.md',
  'docs/processor/vm22_extraction_plan.md',
  'docs/review/vm20_review_index.md',
  'docs/review/supporting_vm_review_index.md',
  'docs/review/vm21_review_index.md',
  'docs/review/vm22_review_index.md',
  'docs/review/vm20_practice_note_review_index.md',
  'docs/review/vm20_practice_note_self_review.md',
  'docs/review/ag03_review_index.md',
  'docs/review/ag03_self_review.md',
  'docs/review/ag01_review_index.md',
  'docs/review/ag01_self_review.md',
  'docs/processor/ag02_extraction_plan.md',
  'docs/review/valuation_regulation_repository_poc_status.md',
  'config/supporting-vm-batch-plan.json',
  'config/vm21-batch-plan.json',
  'config/vm20-batch-plan.json',
  'config/vm20-practice-note-batch-plan.json',
  'config/ag03-batch-plan.json',
  'config/ag01-batch-plan.json',
  'config/ag02-batch-plan.json',
  'config/vm22-batch-plan.json',
  'scripts/vm21-batch-definitions.mjs',
  'scripts/vm22-batch-definitions.mjs',
  'scripts/vm20-practice-note-batch-definitions.mjs',
  'scripts/ag03-batch-definitions.mjs',
  'scripts/ag01-batch-definitions.mjs',
  'scripts/ag02-batch-definitions.mjs',
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
  '## Unresolved Issues',
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

const getBatchPaths = (batchId) => {
  const batchRoot = path.join(workBatchesRoot, batchId)
  const reviewRoot = path.join(batchRoot, 'review')
  return {
    batchRoot,
    reviewRoot,
    batchManifest: path.join(batchRoot, 'batch-manifest.json'),
    sourceInventory: path.join(batchRoot, 'source-inventory.json'),
    chunkManifest: path.join(batchRoot, 'chunk-manifest.json'),
    extractionOutput: path.join(batchRoot, 'extraction-output.json'),
    reviewPacketJson: path.join(reviewRoot, 'review-packet.json'),
    reviewPacketMd: path.join(reviewRoot, 'review-packet.md'),
    validationReport: path.join(batchRoot, 'validation-report.json'),
    unresolvedIssuesSummary: path.join(batchRoot, 'unresolved-issues-summary.md'),
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
  if (isPilot && !sourceFiles.every((sourceFile) => hasString(sourceFile.sourceReference))) {
    problems.push(`${label}.sourceFiles: pilot source files must include sourceReference values`)
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
    if (!hasString(item.sourceReference)) {
      problems.push(`${itemLabel}: missing sourceReference`)
    }
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
      'sourceReference',
      'sourcePath',
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
    if (!hasString(chunk.pageReference) && !hasString(chunk.sectionReference) && !hasString(chunk.lineReference)) {
      problems.push(`${chunkLabel}: missing pageReference, sectionReference, or lineReference`)
    }
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
    ;['sourceId', 'filename', 'filePath', 'sourceFamilyId', 'domainId', 'documentType', 'processingStatus', 'sourceReference', 'notes'].forEach(
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
    ;['sourceId', 'filename', 'filePath', 'sourceFamilyId', 'domainId', 'documentType', 'processingStatus', 'sourceReference'].forEach(
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
        'sourceReference',
        'sourcePath',
        'chunkText',
        'summary',
        'nonLearnerFacingNotes',
      ].forEach((field) => {
        if (!hasString(item[field])) {
          problems.push(`${itemLabel}: missing ${field}`)
        }
      })
      if (!hasString(item.pageReference) && !hasString(item.sectionReference) && !hasString(item.lineReference)) {
        problems.push(`${itemLabel}: missing pageReference, sectionReference, or lineReference`)
      }
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
  if (!expectArray(packet.unresolvedIssues, `${label}.unresolvedIssues`)) return
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
    ;['sourceId', 'filename', 'sourceReference', 'sourceFamilyId', 'documentType', 'processingStatus', 'notes'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
  })

  packet.extractedItems.forEach((item, index) => {
    const itemLabel = `${label}.extractedItems[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['stableId', 'sourceId', 'sourceFamilyId', 'documentType', 'sourceReference', 'sourcePath', 'summary', 'notes'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
    if (!expectArray(item.reviewFlags, `${itemLabel}.reviewFlags`, false)) return
    if (!hasString(item.pageReference) && !hasString(item.sectionReference) && !hasString(item.lineReference)) {
      problems.push(`${itemLabel}: missing pageReference, sectionReference, or lineReference`)
    }
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

  packet.unresolvedIssues.forEach((item, index) => {
    const itemLabel = `${label}.unresolvedIssues[${index}]`
    if (!expectObject(item, itemLabel)) return
    ;['issueId', 'severity', 'issueType', 'message', 'recommendedAction'].forEach((field) => {
      if (!hasString(item[field])) {
        problems.push(`${itemLabel}: missing ${field}`)
      }
    })
    if (['high', 'critical'].includes(item.severity) && !hasString(item.sourceId) && !hasString(item.itemId)) {
      problems.push(`${itemLabel}: high-severity unresolved issues should identify a source or item`)
    }
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
  if (!expectArray(report.checks, `${label}.checks`, false)) return
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
  report.checks.forEach((check, index) => {
    const checkLabel = `${label}.checks[${index}]`
    if (!expectObject(check, checkLabel)) return
    ;['checkId', 'status', 'details'].forEach((field) => {
      if (!hasString(check[field])) {
        problems.push(`${checkLabel}: missing ${field}`)
      }
    })
    if (!['passed', 'needs_review', 'failed'].includes(check.status)) {
      problems.push(`${checkLabel}: invalid status`)
    }
  })
}

const validateUnresolvedIssuesSummary = async (filePath, label, unresolvedIssues = []) => {
  const text = await readText(filePath)
  if (!text.trim()) {
    problems.push(`${label}: must not be empty`)
  }
  if (!text.includes('review-only')) {
    problems.push(`${label}: must mention review-only handling`)
  }
  if (!text.includes('No app-ready export')) {
    problems.push(`${label}: must mention the app-ready export status`)
  }
  for (const issue of unresolvedIssues) {
    if (issue?.issueId && !text.includes(issue.issueId)) {
      problems.push(`${label}: must mention unresolved issue ${issue.issueId}`)
    }
  }
}

const validateVm20PlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (!hasString(plan.planId)) {
    problems.push(`${label}: missing planId`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (!hasString(plan.sourceScope.primarySourceFile)) {
    problems.push(`${label}.sourceScope: missing primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceFamilyId)) {
    problems.push(`${label}.sourceScope: missing sourceFamilyId`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectObject(plan.sourceScope.knownObservedWindow, `${label}.sourceScope.knownObservedWindow`)) return
  if (!expectArray(plan.sourceScope.knownObservedWindow.pageRange, `${label}.sourceScope.knownObservedWindow.pageRange`, false)) return
  if (plan.sourceScope.knownObservedWindow.pageRange.length !== 2) {
    problems.push(`${label}.sourceScope.knownObservedWindow.pageRange must contain exactly two page bounds`)
  }
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
  })

  if (!hasString(plan.reviewStandards.regulatoryRequirement)) {
    problems.push(`${label}.reviewStandards: missing regulatoryRequirement`)
  }
  if (!hasString(plan.reviewStandards.backgroundContent)) {
    problems.push(`${label}.reviewStandards: missing backgroundContent`)
  }
  if (!hasString(plan.reviewStandards.actuarialJudgment)) {
    problems.push(`${label}.reviewStandards: missing actuarialJudgment`)
  }
  if (!hasString(plan.reviewStandards.crossReferenceHandling)) {
    problems.push(`${label}.reviewStandards: missing crossReferenceHandling`)
  }
  if (!hasString(plan.reviewStandards.staleOrCompanionGuidance)) {
    problems.push(`${label}.reviewStandards: missing staleOrCompanionGuidance`)
  }

  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validateVm20PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Batch-002 Lesson',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  if (!text.includes('review-only')) {
    problems.push(`${label}: must mention review-only handling`)
  }
  if (!text.includes('pages 45-51')) {
    problems.push(`${label}: must mention the observed batch-002 window`)
  }
  if (!text.includes('pbr_data_valuation_manual_2026.pdf')) {
    problems.push(`${label}: must mention the primary source file`)
  }
}

const validateVm20ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall VM-20 Extraction Status',
    '## Batch Table',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Known Caution Areas',
    '## Recommended Review Order',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
  ;[
    'batch-003',
    'batch-004',
    'batch-005',
    'batch-006',
    'batch-007',
    'batch-008',
    'batch-009',
    'batch-010',
    'batch-011',
    'batch-012',
  ].forEach((batchId) => {
    if (!text.includes(batchId)) {
      problems.push(`${label}: must reference ${batchId}`)
    }
  })
}

const validateSupportingVmPlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (!hasString(plan.planId)) {
    problems.push(`${label}: missing planId`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (!hasString(plan.sourceScope.primarySourceFile)) {
    problems.push(`${label}.sourceScope: missing primarySourceFile`)
  }
  if (plan.sourceScope.primarySourceFile !== 'pbr_data_valuation_manual_2026.pdf') {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceFamilyId)) {
    problems.push(`${label}.sourceScope: missing sourceFamilyId`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.observedChapterWindows, `${label}.sourceScope.observedChapterWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (!plan.sourceScope.boundaries.some((entry) => typeof entry === 'string' && entry.includes('VM-21') && entry.includes('VM-22'))) {
    problems.push(`${label}.sourceScope.boundaries: must mention VM-21 and VM-22 out-of-scope handling`)
  }
  if (!plan.sourceScope.exclusions.some((entry) => typeof entry === 'string' && entry.includes('learner-facing'))) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.chapterMap, `${label}.chapterMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const chapterIds = new Set()
  plan.chapterMap.forEach((chapter, index) => {
    const chapterLabel = `${label}.chapterMap[${index}]`
    if (!expectObject(chapter, chapterLabel)) return
    ;['chapterId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(chapter[field])) {
        problems.push(`${chapterLabel}: missing ${field}`)
      }
    })
    if (!expectArray(chapter.pageRange, `${chapterLabel}.pageRange`, false)) return
    if (chapter.pageRange.length !== 2) {
      problems.push(`${chapterLabel}.pageRange must contain exactly two page bounds`)
    }
    if (!expectArray(chapter.expectedIssueTypes, `${chapterLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(chapter.crossReferenceWatchlist, `${chapterLabel}.crossReferenceWatchlist`, false)) return
    chapterIds.add(chapter.chapterId)
  })

  const observedChapterIds = new Set()
  plan.sourceScope.observedChapterWindows.forEach((window, index) => {
    const windowLabel = `${label}.sourceScope.observedChapterWindows[${index}]`
    if (!expectObject(window, windowLabel)) return
    ;['chapterId', 'note'].forEach((field) => {
      if (!hasString(window[field])) {
        problems.push(`${windowLabel}: missing ${field}`)
      }
    })
    if (!expectArray(window.pageRange, `${windowLabel}.pageRange`, false)) return
    if (window.pageRange.length !== 2) {
      problems.push(`${windowLabel}.pageRange must contain exactly two page bounds`)
    }
    observedChapterIds.add(window.chapterId)
    if (!chapterIds.has(window.chapterId)) {
      problems.push(`${windowLabel}: unknown chapterId ${window.chapterId}`)
    }
  })

  chapterIds.forEach((chapterId) => {
    if (!observedChapterIds.has(chapterId)) {
      problems.push(`${label}.sourceScope.observedChapterWindows: missing chapterId ${chapterId}`)
    }
  })

  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.chapterIds, `${batchLabel}.chapterIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.chapterIds.forEach((chapterId) => {
      if (!chapterIds.has(chapterId)) {
        problems.push(`${batchLabel}: unknown chapterId ${chapterId}`)
      }
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reportingRequirement',
    'documentationExpectation',
    'governanceControlExpectation',
    'crossReferenceMapping',
    'explanatoryBackground',
    'staleSupersededCompanionGuidance',
    'requiresHumanInterpretation',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validateSupportingVmPlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Chapter / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-21',
    'VM-22',
    'VM-01',
    'VM-02',
    'VM-25',
    'VM-26',
    'VM-30',
    'VM-31',
    'batch-013',
    'batch-014',
    'batch-015',
    'batch-016',
    'batch-017',
    'batch-018',
    'batch-019',
    'batch-020',
    'batch-021',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateVm21PlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (!hasString(plan.planId)) {
    problems.push(`${label}: missing planId`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.primarySourceFile !== 'pbr_data_valuation_manual_2026.pdf') {
    problems.push(`${label}.sourceScope: unexpected primarySourceFile`)
  }
  if (!hasString(plan.sourceScope.sourceFamilyId)) {
    problems.push(`${label}.sourceScope: missing sourceFamilyId`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (
    plan.sourceScope.confirmedPageRange[0] !== 143 ||
    plan.sourceScope.confirmedPageRange[1] !== 225
  ) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [143, 225]`)
  }
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) =>
        typeof entry === 'string' && entry.includes('VM-22') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention VM-22 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('learner-facing'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (topic.pageRange.length !== 2) {
      problems.push(`${topicLabel}.pageRange must contain exactly two page bounds`)
    }
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 143 || batch.pageTarget.knownWindow[1] > 225) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed VM-21 page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
    'staleSupersededCompanionGuidance',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validateVm21PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Chapter / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-21',
    'VM-22',
    'batch-022',
    'batch-023',
    'batch-024',
    'batch-025',
    'batch-026',
    'batch-027',
    'batch-028',
    'batch-029',
    'batch-030',
    'batch-031',
    'batch-032',
    'batch-033',
    'batch-034',
    'batch-035',
    'batch-036',
    'batch-037',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateVm22PlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'vm22-control-plan') {
    problems.push(`${label}: planId must be vm22-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'valuation_manual_pdfs') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be valuation_manual_pdfs`)
  }
  if (plan.sourceScope.primarySourceFile !== 'pbr_data_valuation_manual_2026.pdf') {
    problems.push(`${label}.sourceScope: primarySourceFile must be pbr_data_valuation_manual_2026.pdf`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 227 || plan.sourceScope.confirmedPageRange[1] !== 318) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [227, 318]`)
  }
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('VM-20') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention VM-20 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('VM-21') && entry.includes('out of scope'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention VM-21 out-of-scope handling`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('VM-25') && entry.includes('page 319'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the VM-25 boundary on page 319`)
  }
  ;['VM-30', 'VM-31', 'VM-G', 'VM-C', 'VM-M'].forEach((chapterId) => {
    if (
      !plan.sourceScope.boundaries.some(
        (entry) => typeof entry === 'string' && entry.includes(chapterId) && entry.includes('review-only'),
      )
    ) {
      problems.push(`${label}.sourceScope.boundaries: must mention ${chapterId} review-only handling`)
    }
  })
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('learner-facing'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (topic.pageRange.length !== 2) {
      problems.push(`${topicLabel}.pageRange must contain exactly two page bounds`)
    }
    if (topic.pageRange[0] < 227 || topic.pageRange[1] > 318) {
      problems.push(`${topicLabel}.pageRange must stay within the confirmed VM-22 page range`)
    }
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 227 || batch.pageTarget.knownWindow[1] > 318) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed VM-22 page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reinsurance',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
    'staleSupersededCompanionGuidance',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validatePracticeNotePlanLike = (plan, label) => {
  if (!expectObject(plan, label)) return

  if (plan.planId !== 'vm20-practice-note-control-plan') {
    problems.push(`${label}: planId must be vm20-practice-note-control-plan`)
  }
  if (plan.planVersion !== '1.0') {
    problems.push(`${label}: planVersion must be 1.0`)
  }
  if (plan.status !== 'planned') {
    problems.push(`${label}: status must be planned`)
  }
  if (!expectObject(plan.sourceScope, `${label}.sourceScope`)) return
  if (plan.sourceScope.sourceFamilyId !== 'practice_notes') {
    problems.push(`${label}.sourceScope: sourceFamilyId must be practice_notes`)
  }
  if (plan.sourceScope.primarySourceFile !== 'AAA - VM-20_PN_2020_Version.pdf') {
    problems.push(
      `${label}.sourceScope: primarySourceFile must be AAA - VM-20_PN_2020_Version.pdf`,
    )
  }
  if (!hasString(plan.sourceScope.sourceFolder)) {
    problems.push(`${label}.sourceScope: missing sourceFolder`)
  }
  if (!hasString(plan.sourceScope.sourceTitle)) {
    problems.push(`${label}.sourceScope: missing sourceTitle`)
  }
  if (!hasString(plan.sourceScope.sourceReference)) {
    problems.push(`${label}.sourceScope: missing sourceReference`)
  }
  if (!hasString(plan.sourceScope.domainId)) {
    problems.push(`${label}.sourceScope: missing domainId`)
  }
  if (!hasString(plan.sourceScope.rawSourceRoot)) {
    problems.push(`${label}.sourceScope: missing rawSourceRoot`)
  }
  if (!expectArray(plan.sourceScope.confirmedPageRange, `${label}.sourceScope.confirmedPageRange`, false)) return
  if (plan.sourceScope.confirmedPageRange.length !== 2) {
    problems.push(`${label}.sourceScope.confirmedPageRange must contain exactly two page bounds`)
  }
  if (plan.sourceScope.confirmedPageRange[0] !== 1 || plan.sourceScope.confirmedPageRange[1] !== 115) {
    problems.push(`${label}.sourceScope.confirmedPageRange must be [1, 115]`)
  }
  if (!expectArray(plan.sourceScope.observedSectionWindows, `${label}.sourceScope.observedSectionWindows`, false)) return
  if (!expectArray(plan.sourceScope.boundaries, `${label}.sourceScope.boundaries`, false)) return
  if (!expectArray(plan.sourceScope.exclusions, `${label}.sourceScope.exclusions`, false)) return
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('single practice note file'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the single practice-note file`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('other Practice Notes files'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention the other Practice Notes files`)
  }
  if (
    !plan.sourceScope.boundaries.some(
      (entry) => typeof entry === 'string' && entry.includes('non-binding') && entry.includes('companion-guidance'),
    )
  ) {
    problems.push(`${label}.sourceScope.boundaries: must mention non-binding companion-guidance posture`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('learner-facing'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention learner-facing exclusion`)
  }
  if (
    !plan.sourceScope.exclusions.some(
      (entry) => typeof entry === 'string' && entry.includes('other Practice Notes files'),
    )
  ) {
    problems.push(`${label}.sourceScope.exclusions: must mention other Practice Notes file exclusion`)
  }

  if (!expectArray(plan.topicMap, `${label}.topicMap`, false)) return
  if (!expectArray(plan.proposedBatches, `${label}.proposedBatches`, false)) return
  if (!expectObject(plan.reviewStandards, `${label}.reviewStandards`)) return
  if (!expectObject(plan.promotionGates, `${label}.promotionGates`)) return
  if (!expectObject(plan.validationImplications, `${label}.validationImplications`)) return

  const topicIds = new Set()
  plan.topicMap.forEach((topic, index) => {
    const topicLabel = `${label}.topicMap[${index}]`
    if (!expectObject(topic, topicLabel)) return
    ;['topicId', 'label', 'reviewComplexity', 'boundaryNote'].forEach((field) => {
      if (!hasString(topic[field])) {
        problems.push(`${topicLabel}: missing ${field}`)
      }
    })
    if (!expectArray(topic.pageRange, `${topicLabel}.pageRange`, false)) return
    if (topic.pageRange.length !== 2) {
      problems.push(`${topicLabel}.pageRange must contain exactly two page bounds`)
    }
    if (topic.pageRange[0] < 1 || topic.pageRange[1] > 115) {
      problems.push(`${topicLabel}.pageRange must stay within the confirmed practice-note page range`)
    }
    if (!expectArray(topic.expectedIssueTypes, `${topicLabel}.expectedIssueTypes`, false)) return
    if (!expectArray(topic.crossReferenceWatchlist, `${topicLabel}.crossReferenceWatchlist`, false)) return
    topicIds.add(topic.topicId)
  })

  const observedTopicIds = new Set()
  plan.proposedBatches.forEach((batch, index) => {
    const batchLabel = `${label}.proposedBatches[${index}]`
    if (!expectObject(batch, batchLabel)) return
    ;['plannedBatchId', 'title', 'reviewComplexity', 'rationale', 'automationFit'].forEach((field) => {
      if (!hasString(batch[field])) {
        problems.push(`${batchLabel}: missing ${field}`)
      }
    })
    if (!expectArray(batch.topicIds, `${batchLabel}.topicIds`, false)) return
    if (!expectArray(batch.expectedIssueTypes, `${batchLabel}.expectedIssueTypes`, false)) return
    if (!expectObject(batch.pageTarget, `${batchLabel}.pageTarget`)) return
    if (batch.reviewOnlyByDefault !== true) {
      problems.push(`${batchLabel}: reviewOnlyByDefault must be true`)
    }
    if (batch.sameStopConditionsAsVm20 !== true) {
      problems.push(`${batchLabel}: sameStopConditionsAsVm20 must be true`)
    }
    batch.topicIds.forEach((topicId) => {
      if (!topicIds.has(topicId)) {
        problems.push(`${batchLabel}: unknown topicId ${topicId}`)
      }
      observedTopicIds.add(topicId)
    })
    if (!expectArray(batch.pageTarget.knownWindow, `${batchLabel}.pageTarget.knownWindow`, false)) return
    if (batch.pageTarget.knownWindow.length !== 2) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must contain exactly two page bounds`)
    }
    if (batch.pageTarget.knownWindow[0] < 1 || batch.pageTarget.knownWindow[1] > 115) {
      problems.push(`${batchLabel}.pageTarget.knownWindow must stay within the confirmed practice-note page range`)
    }
  })

  topicIds.forEach((topicId) => {
    if (!observedTopicIds.has(topicId)) {
      problems.push(`${label}.proposedBatches: missing batch coverage for topicId ${topicId}`)
    }
  })

  ;[
    'regulatoryRequirement',
    'implementationGuidance',
    'companionGuidance',
    'nonBindingGuidance',
    'definitionOrTerminology',
    'reserveMethodStructure',
    'calculationStructure',
    'formulaContext',
    'prescribedAssumption',
    'companyOrPrudentEstimateAssumption',
    'scenarioOrStochasticRequirement',
    'assetModelingJudgment',
    'hedgingOrRiskMitigation',
    'reinsurance',
    'reportingRequirement',
    'documentationExpectation',
    'crossReferenceMapping',
    'backgroundContent',
    'boundaryControlWindow',
    'requiresHumanInterpretation',
    'staleSupersededCompanionGuidance',
  ].forEach((field) => {
    if (!hasString(plan.reviewStandards[field])) {
      problems.push(`${label}.reviewStandards: missing ${field}`)
    }
  })

  if (plan.promotionGates.defaultState !== 'review_only') {
    problems.push(`${label}.promotionGates.defaultState must be review_only`)
  }
  if (!expectArray(plan.promotionGates.learnerFacing, `${label}.promotionGates.learnerFacing`, false)) return
  if (!expectArray(plan.promotionGates.appReady, `${label}.promotionGates.appReady`, false)) return
  if (!expectArray(plan.promotionGates.ragReady, `${label}.promotionGates.ragReady`, false)) return
  if (!expectArray(plan.validationImplications.currentChecksNeeded, `${label}.validationImplications.currentChecksNeeded`, false)) return
  if (!expectArray(plan.validationImplications.futureChecksSuggested, `${label}.validationImplications.futureChecksSuggested`, false)) return
  if (!expectArray(plan.validationImplications.scriptImplications, `${label}.validationImplications.scriptImplications`, false)) return
}

const validatePracticeNotePlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Section / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AAA - VM-20_PN_2020_Version.pdf',
    'Practice Notes',
    'non-binding',
    'companion guidance',
    'VM-20',
    'VM-21',
    'VM-22',
    'VM-A',
    'VM-C',
    'VM-G',
    'VM-M',
    'VM-30',
    'VM-31',
    'pages 1-115',
    'batch-055',
    'batch-056',
    'batch-057',
    'batch-058',
    'batch-059',
    'batch-060',
    'batch-061',
    'batch-062',
    'batch-063',
    'batch-064',
    'batch-065',
    'batch-066',
    'batch-067',
    'batch-068',
    'batch-069',
    'batch-070',
    'batch-071',
    'batch-072',
    'batch-073',
    'batch-074',
    'batch-075',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg03PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 03',
    'Standard Nonforfeiture Law',
    'maturity value',
    'cash surrender value',
    'page 1',
    'batch-076',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg01PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 01',
    'batch-077',
    'Actuarial Guideline I',
    'page 1 only',
    'Standard Valuation Law',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateVm22PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Chapter / Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-22',
    'VM-20',
    'VM-21',
    'VM-30',
    'VM-31',
    'VM-G',
    'VM-C',
    'VM-M',
    'VM-25',
    'page 318',
    'page 319',
    'batch-038',
    'batch-039',
    'batch-040',
    'batch-041',
    'batch-042',
    'batch-043',
    'batch-044',
    'batch-045',
    'batch-046',
    'batch-047',
    'batch-048',
    'batch-049',
    'batch-050',
    'batch-051',
    'batch-052',
    'batch-053',
    'batch-054',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
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
const vm20BatchPlan = await readJson(paths.vm20BatchPlanJson)
const supportingVmBatchPlan = await readJson(paths.supportingVmBatchPlanJson)
const vm21BatchPlan = await readJson(paths.vm21BatchPlanJson)
const vm22BatchPlan = await readJson(paths.vm22BatchPlanJson)
const practiceNoteBatchPlan = await readJson(paths.practiceNoteBatchPlanJson)
const ag03BatchPlan = await readJson(paths.ag03BatchPlanJson)
const ag01BatchPlan = await readJson(paths.ag01BatchPlanJson)
const ag02BatchPlan = await readJson(paths.ag02BatchPlanJson)

validateSchemaEnvelope(batchManifestSchema, 'batch-manifest.schema.json')
validateSchemaEnvelope(sourceInventorySchema, 'source-inventory.schema.json')
validateSchemaEnvelope(extractionOutputSchema, 'extraction-output.schema.json')
validateSchemaEnvelope(reviewPacketSchema, 'review-packet.schema.json')

validateBatchManifestLike(batchManifestTemplate, 'batch-manifest.template.json')
validateBatchManifestLike(sampleBatchManifest, 'batch-manifest.sample.json')

validateSourceInventoryLike(sampleSourceInventory, 'source-inventory.sample.json')
validateExtractionOutputLike(sampleExtractionOutput, 'extraction-output.sample.json')
validateReviewPacketLike(reviewPacketTemplateJson, 'review-packet.template.json')
validateReviewPacketLike(sampleReviewPacketJson, 'review-packet.sample.json')
validateVm20PlanLike(vm20BatchPlan, 'config/vm20-batch-plan.json')
validateSupportingVmPlanLike(supportingVmBatchPlan, 'config/supporting-vm-batch-plan.json')
validateVm21PlanLike(vm21BatchPlan, 'config/vm21-batch-plan.json')
validateVm22PlanLike(vm22BatchPlan, 'config/vm22-batch-plan.json')
validatePracticeNotePlanLike(practiceNoteBatchPlan, 'config/vm20-practice-note-batch-plan.json')
await validateAg01PlanMarkdown(paths.ag01ExtractionPlanMd, 'docs/processor/ag01_extraction_plan.md')
if (!Array.isArray(ag03BatchPlan.proposedBatches) || ag03BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag03-batch-plan.json: expected exactly one proposed batch')
}
if (ag01BatchPlan.status !== 'planned') {
  problems.push('config/ag01-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag01BatchPlan.proposedBatches) || ag01BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag01-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag01BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag01BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag01-batch-plan.json: confirmedPageRange must be [1, 1]')
}

const plannedAg01BatchIds = Array.isArray(ag01BatchPlan.proposedBatches)
  ? ag01BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg01BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg01BatchIds.includes('batch-077')) {
  problems.push('config/ag01-batch-plan.json: expected batch-077 to be planned')
}

if (ag02BatchPlan.status !== 'planned') {
  problems.push('config/ag02-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag02BatchPlan.proposedBatches) || ag02BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag02-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag02BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag02BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 2
) {
  problems.push('config/ag02-batch-plan.json: confirmedPageRange must be [1, 2]')
}

const plannedAg02BatchIds = Array.isArray(ag02BatchPlan.proposedBatches)
  ? ag02BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg02BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg02BatchIds.includes('batch-078')) {
  problems.push('config/ag02-batch-plan.json: expected batch-078 to be planned')
}

const plannedVm20BatchIds = Array.isArray(vm20BatchPlan.proposedBatches)
  ? vm20BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedVm20BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}

const validateSupportingVmReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall Supporting-Wave Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to VM-20',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-21',
    'VM-22',
    'VM-01',
    'VM-02',
    'VM-25',
    'VM-26',
    'VM-30',
    'VM-31',
    'batch-013',
    'batch-014',
    'batch-015',
    'batch-016',
    'batch-017',
    'batch-018',
    'batch-019',
    'batch-020',
    'batch-021',
    'docs/review/vm20_review_index.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateVm21ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall VM-21 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-21',
    'VM-22',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
  ;[
    'batch-022',
    'batch-023',
    'batch-024',
    'batch-025',
    'batch-026',
    'batch-027',
    'batch-028',
    'batch-029',
    'batch-030',
    'batch-031',
    'batch-032',
    'batch-033',
    'batch-034',
    'batch-035',
    'batch-036',
    'batch-037',
  ].forEach((batchId) => {
    if (!text.includes(batchId)) {
      problems.push(`${label}: must reference ${batchId}`)
    }
  })
}

const validateVm22ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall VM-22 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-22',
    'VM-20',
    'VM-21',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'batch-038',
    'batch-039',
    'batch-040',
    'batch-041',
    'batch-042',
    'batch-043',
    'batch-044',
    'batch-045',
    'batch-046',
    'batch-047',
    'batch-048',
    'batch-049',
    'batch-050',
    'batch-051',
    'batch-052',
    'batch-053',
    'batch-054',
    'VM-25',
    'page 319',
    'page 318',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validatePracticeNoteReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall Practice-Note Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'Non-binding companion guidance',
    'VM-20',
    'AAA - VM-20_PN_2020_Version.pdf',
    'Practice Notes',
    'batch-055',
    'batch-056',
    'batch-057',
    'batch-058',
    'batch-059',
    'batch-060',
    'batch-061',
    'batch-062',
    'batch-063',
    'batch-064',
    'batch-065',
    'batch-066',
    'batch-067',
    'batch-068',
    'batch-069',
    'batch-070',
    'batch-071',
    'batch-072',
    'batch-073',
    'batch-074',
    'batch-075',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validatePracticeNoteSelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-055',
    'batch-075',
    'companion-guidance',
    'no tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg03ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 03 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 03',
    'batch-076',
    'single-page',
    'maturity value',
    'cash surrender value',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag03_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg03SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-076',
    'encoded text layer',
    'No tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg01ReviewIndexMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Overall AG 01 Extraction Status',
    '## Batch Table',
    '## Higher-Caution Section',
    '## Human Review Checklist',
    '## Promotion Decision Area',
    '## Recommended Review Order',
    '## Relationship to Other Review Indexes',
    '## Self-Review Note',
    '## Review Notes',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 01',
    'batch-077',
    'page 1',
    'valuation net premium',
    'gross premium',
    'Actuarial Guideline I',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag01_self_review.md',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg01SelfReviewMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Batch Classifications',
    '## Recurring Observations',
    '## Skill-Hardening Note',
    '## Review Outcome',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'reasonable_with_minor_cautions',
    'batch-077',
    'encoded text layer',
    'No tracked skill file update was necessary',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validateAg02PlanMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Source Scope',
    '## Topic Map',
    '## Proposed Batch Sequence',
    '## Review Standards',
    '## Promotion Gates',
    '## Validation Implications',
    '## Operating Note',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'AG 02',
    'batch-078',
    'Actuarial Guideline II',
    'page 1',
    'page 2',
    'group annuity contracts',
    'Standard Valuation Law',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const validatePocStatusSummaryMarkdown = async (filePath, label) => {
  const text = await readText(filePath)
  const requiredHeadings = [
    '## Executive Status',
    '## Coverage Table',
    '## Completed Assets',
    '## Validation Posture',
    '## Human Review Posture',
    '## Promotion Gates',
    '## Remaining Work',
    '## Recommended Next Step',
  ]
  requiredHeadings.forEach((heading) => {
    if (!text.includes(heading)) {
      problems.push(`${label}: missing heading ${heading}`)
    }
  })
  ;[
    'review-only',
    'not learner-facing',
    'not app-ready',
    'not RAG-ready',
    'not promoted',
    'VM-20',
    'VM-01',
    'VM-02',
    'VM-25',
    'VM-26',
    'VM-30',
    'VM-31',
    'VM-21',
    'VM-22',
    'docs/review/vm20_review_index.md',
    'docs/review/supporting_vm_review_index.md',
    'docs/review/vm21_review_index.md',
    'docs/review/vm22_review_index.md',
    'docs/review/vm20_practice_note_review_index.md',
    'docs/review/ag03_review_index.md',
    'docs/review/ag03_self_review.md',
    'docs/review/ag01_review_index.md',
    'docs/review/ag01_self_review.md',
    'npm run check',
    'git diff --check',
    '77 batches validated',
    'ignored working storage',
    'future pricing',
    'future liability-modeling',
    'AG 01',
  ].forEach((phrase) => {
    if (!text.includes(phrase)) {
      problems.push(`${label}: must mention ${phrase}`)
    }
  })
}

const plannedSupportingBatchIds = Array.isArray(supportingVmBatchPlan.proposedBatches)
  ? supportingVmBatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedSupportingBatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}

const plannedVm21BatchIds = Array.isArray(vm21BatchPlan.proposedBatches)
  ? vm21BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedVm21BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}

const plannedPracticeNoteBatchIds = Array.isArray(practiceNoteBatchPlan.proposedBatches)
  ? practiceNoteBatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedPracticeNoteBatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}

if (ag03BatchPlan.status !== 'planned') {
  problems.push('config/ag03-batch-plan.json: status must be planned')
}
if (!Array.isArray(ag03BatchPlan.proposedBatches) || ag03BatchPlan.proposedBatches.length !== 1) {
  problems.push('config/ag03-batch-plan.json: expected exactly one proposed batch')
}
if (
  ag03BatchPlan.sourceScope?.confirmedPageRange?.[0] !== 1 ||
  ag03BatchPlan.sourceScope?.confirmedPageRange?.[1] !== 1
) {
  problems.push('config/ag03-batch-plan.json: confirmedPageRange must be [1, 1]')
}

const plannedAg03BatchIds = Array.isArray(ag03BatchPlan.proposedBatches)
  ? ag03BatchPlan.proposedBatches
      .map((batch) => batch?.plannedBatchId)
      .filter((batchId) => typeof batchId === 'string' && batchId.length > 0)
  : []
for (const plannedBatchId of plannedAg03BatchIds) {
  if (!batchDefinitions[plannedBatchId]) {
    problems.push(`scripts/batch-definitions.mjs: missing batch definition for ${plannedBatchId}`)
  }
}
if (!plannedAg03BatchIds.includes('batch-076')) {
  problems.push('config/ag03-batch-plan.json: expected batch-076 to be planned')
}

await validateReviewMarkdown(paths.reviewPacketTemplateMd, 'review-packet.template.md')
await validateReviewMarkdown(paths.sampleReviewPacketMd, 'review-packet.sample.md')
await validateVm20PlanMarkdown(paths.vm20ExtractionPlanMd, 'docs/processor/vm20_extraction_plan.md')
await validatePracticeNotePlanMarkdown(
  paths.practiceNoteExtractionPlanMd,
  'docs/processor/vm20_practice_note_extraction_plan.md',
)
await validateAg03PlanMarkdown(paths.ag03ExtractionPlanMd, 'docs/processor/ag03_extraction_plan.md')
await validateVm20ReviewIndexMarkdown(paths.vm20ReviewIndexMd, 'docs/review/vm20_review_index.md')
await validateSupportingVmReviewIndexMarkdown(
  paths.supportingVmReviewIndexMd,
  'docs/review/supporting_vm_review_index.md',
)
await validateVm21ReviewIndexMarkdown(paths.vm21ReviewIndexMd, 'docs/review/vm21_review_index.md')
await validateVm22ReviewIndexMarkdown(paths.vm22ReviewIndexMd, 'docs/review/vm22_review_index.md')
await validatePracticeNoteReviewIndexMarkdown(
  paths.practiceNoteReviewIndexMd,
  'docs/review/vm20_practice_note_review_index.md',
)
await validatePracticeNoteSelfReviewMarkdown(
  paths.practiceNoteSelfReviewMd,
  'docs/review/vm20_practice_note_self_review.md',
)
await validateAg03ReviewIndexMarkdown(paths.ag03ReviewIndexMd, 'docs/review/ag03_review_index.md')
await validateAg03SelfReviewMarkdown(paths.ag03SelfReviewMd, 'docs/review/ag03_self_review.md')
await validateAg01ReviewIndexMarkdown(paths.ag01ReviewIndexMd, 'docs/review/ag01_review_index.md')
await validateAg01SelfReviewMarkdown(paths.ag01SelfReviewMd, 'docs/review/ag01_self_review.md')
await validateAg02PlanMarkdown(paths.ag02ExtractionPlanMd, 'docs/processor/ag02_extraction_plan.md')
await validatePocStatusSummaryMarkdown(
  paths.pocStatusSummaryMd,
  'docs/review/valuation_regulation_repository_poc_status.md',
)
await validateSupportingVmPlanMarkdown(
  paths.supportingVmExtractionPlanMd,
  'docs/processor/supporting_vm_chapters_extraction_plan.md',
)
await validateVm21PlanMarkdown(paths.vm21ExtractionPlanMd, 'docs/processor/vm21_extraction_plan.md')
await validateVm22PlanMarkdown(paths.vm22ExtractionPlanMd, 'docs/processor/vm22_extraction_plan.md')

if (!config.project?.name) {
  problems.push('config/source-families.json: missing project.name')
}
if (!config.project?.rawSourceRoot) {
  problems.push('config/source-families.json: missing project.rawSourceRoot')
}
if (!Array.isArray(config.domains) || config.domains.length < 3) {
  problems.push('config/source-families.json: expected portability domains to be present')
}

const batchDirs = (await fs.readdir(workBatchesRoot, { withFileTypes: true })).filter((dirent) =>
  dirent.isDirectory(),
)
let validatedPilotBatchCount = 0
for (const dirent of batchDirs) {
  const batchId = dirent.name
  const batchPaths = getBatchPaths(batchId)
  if (!(await exists(batchPaths.batchManifest))) {
    continue
  }

  const batchDefinition = batchDefinitions[batchId]
  if (!batchDefinition) {
    warnings.push(`No batch definition found for ${batchId}; validating only the generic scaffold rules.`)
  }

  const batchManifest = await readJson(batchPaths.batchManifest)
  const isPilotBatch = batchManifest.boundaries?.noRealProcessing === false
  validateBatchManifestLike(batchManifest, `${batchId}/batch-manifest.json`, {
    mode: isPilotBatch ? 'pilot' : 'scaffold',
  })

  if (!isPilotBatch) {
    continue
  }

  validatedPilotBatchCount += 1

  const pilotRequiredFiles = [
    batchPaths.sourceInventory,
    batchPaths.chunkManifest,
    batchPaths.extractionOutput,
    batchPaths.reviewPacketJson,
    batchPaths.reviewPacketMd,
    batchPaths.validationReport,
    batchPaths.unresolvedIssuesSummary,
  ]

  for (const filePath of pilotRequiredFiles) {
    if (!(await exists(filePath))) {
      problems.push(`${path.relative(repoRoot, filePath)}: missing pilot output file`)
    }
  }

  const pilotSourceInventory = await readJson(batchPaths.sourceInventory)
  const pilotChunkManifest = await readJson(batchPaths.chunkManifest)
  const pilotExtractionOutput = await readJson(batchPaths.extractionOutput)
  const pilotReviewPacketJson = await readJson(batchPaths.reviewPacketJson)
  const pilotValidationReport = await readJson(batchPaths.validationReport)

  validateSourceInventoryLike(pilotSourceInventory, `${batchId}/source-inventory.json`)
  validateChunkManifestLike(pilotChunkManifest, `${batchId}/chunk-manifest.json`)
  validateExtractionOutputLike(pilotExtractionOutput, `${batchId}/extraction-output.json`)
  validateReviewPacketLike(pilotReviewPacketJson, `${batchId}/review/review-packet.json`)
  validateValidationReportLike(pilotValidationReport, `${batchId}/validation-report.json`)

  if (pilotReviewPacketJson.promotionRecommendation?.status !== 'not_recommended') {
    problems.push(`${batchId}/review/review-packet.json: pilot review packet must remain not_recommended`)
  }
  if (pilotReviewPacketJson.learnerFacingStatus?.ready !== false) {
    problems.push(`${batchId}/review/review-packet.json: learner-facing status must stay false`)
  }
  if (pilotReviewPacketJson.appExportReadiness?.ready !== false) {
    problems.push(`${batchId}/review/review-packet.json: app export readiness must stay false`)
  }
  if (pilotReviewPacketJson.ragReadiness?.ready !== false) {
    problems.push(`${batchId}/review/review-packet.json: RAG readiness must stay false`)
  }
  if (!Array.isArray(pilotReviewPacketJson.unresolvedIssues) || pilotReviewPacketJson.unresolvedIssues.length === 0) {
    problems.push(`${batchId}/review/review-packet.json: pilot review packet must include unresolved issues`)
  }

  const expectedCheckIds = batchDefinition?.validationChecks?.map((check) => check.checkId) ?? []
  const pilotCheckIds = new Map(
    Array.isArray(pilotValidationReport.checks)
      ? pilotValidationReport.checks.map((check) => [check.checkId, check])
      : [],
  )
  for (const checkId of expectedCheckIds) {
    const check = pilotCheckIds.get(checkId)
    if (!check) {
      problems.push(`${batchId}/validation-report.json: missing pilot check ${checkId}`)
      continue
    }
    if (check.status !== 'passed') {
      problems.push(`${batchId}/validation-report.json: pilot check ${checkId} must be passed`)
    }
  }

  await validateReviewMarkdown(batchPaths.reviewPacketMd, `${batchId}/review/review-packet.md`)
  await validateUnresolvedIssuesSummary(
    batchPaths.unresolvedIssuesSummary,
    `${batchId}/unresolved-issues-summary.md`,
    pilotReviewPacketJson.unresolvedIssues,
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
  console.log(`- Supporting chapter windows verified: ${supportingVmBatchPlan.sourceScope.observedChapterWindows.length}`)
  console.log(`- Supporting batches validated: ${supportingVmBatchPlan.proposedBatches.length}`)
  console.log(`- Supporting review index verified: 9 batches`)
  console.log(`- VM-21 batches validated: ${vm21BatchPlan.proposedBatches.length}`)
  console.log(`- VM-21 review index verified: 16 batches`)
  console.log(`- VM-22 plan verified: ${vm22BatchPlan.proposedBatches.length} batches`)
  console.log(`- VM-22 review index verified: 17 batches`)
  console.log(`- Practice-note plan verified: ${practiceNoteBatchPlan.proposedBatches.length} batches`)
  console.log(`- Practice-note review index verified: 21 batches`)
  console.log(`- AG 03 plan verified: ${ag03BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 01 plan verified: ${ag01BatchPlan.proposedBatches.length} batches`)
  console.log(`- AG 02 plan verified: ${ag02BatchPlan.proposedBatches.length} batches`)
  console.log(`- POC status summary verified: 7 review indexes`)
  if (validatedPilotBatchCount > 0) {
    console.log(`- Pilot batches validated: ${validatedPilotBatchCount}`)
  }
}

for (const warning of warnings) {
  console.warn(`- ${warning}`)
}
