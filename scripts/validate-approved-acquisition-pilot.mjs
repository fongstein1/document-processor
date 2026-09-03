import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'acquisition-pilot-2026-09-02')
const defaultManifest = 'C:\\Dev\\Document Processor Sources\\2026-09-02 Intake\\_acquisition-manifests\\approved-pilot-20260902\\final-20260902\\acquisition-manifest.json'
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const exists = async (filePath) => fs.access(filePath).then(() => true).catch(() => false)
const sha256 = async (filePath) => crypto.createHash('sha256').update(await fs.readFile(filePath)).digest('hex')
const fail = (message) => { throw new Error(message) }

// Recompute from primary artifacts. validation-report.json is compared evidence, never trusted.
export const recomputePilotChecks = async ({ acquisition, authorization, inventory, extraction, chunks, indexes, smoke, review, report, manifestPath = defaultManifest }) => {
  const records = acquisition.acquisitions.filter((record) => record.acquisitionOutcome === 'ADMIT_TO_PROCESSING_QUEUE')
  const approvedById = new Map(authorization.selectedRecords.map((record) => [record.candidateId, record]))
  const ids = records.map((record) => record.candidateId)
  const indexIds = indexes.sourceIndexes.map((index) => index.source.sourceId)
  const extractedIds = extraction.sourceGroups.map((group) => group.sourceId)
  const chunkIds = chunks.chunks.map((chunk) => chunk.chunkId)
  const structured = indexes.sourceIndexes.flatMap((index) => index.extensions?.structuredEvidence || [])
  const structuredIds = structured.map((item) => item.structuredEvidenceId)
  const exceptionSources = extraction.sourceGroups.filter((group) => group.sheets?.some((sheet) => sheet.contentInventory?.exceptionCode))
  const checks = {
    rawShaLineage: inventory.items.length === records.length && (await Promise.all(inventory.items.map(async (item) => (await exists(item.filePath)) && item.fileHash === item.fileHash && item.fileHash === await sha256(item.filePath)))).every(Boolean),
    sourceIdentityBinding: new Set(ids).size === ids.length && ids.every((id) => indexIds.includes(id) && extractedIds.includes(id) && inventory.items.some((item) => item.sourceId === id)),
    extractionCompleteness: extractedIds.length === records.length && extractedIds.every((id) => chunks.chunks.some((chunk) => chunk.sourceId === id)),
    structuralSegmentation: chunks.chunks.length > 0 && chunks.chunks.every((chunk) => chunk.sectionReference && Array.isArray(chunk.citations) && chunk.citations.length > 0 && (chunk.sourceTextType === 'actual_extracted_source_text' || chunk.sourceTextType === 'placeholder_pending_source_text')),
    deterministicIds: chunkIds.length > 0 && new Set(chunkIds).size === chunkIds.length,
    metadataCompleteness: inventory.items.every((item) => item.sourceId && item.filename && item.fileHash && item.sourceReference && item.documentType),
    authoritySupportPreserved: indexes.sourceIndexes.every((index) => { const record = approvedById.get(index.source.sourceId); return Boolean(record && index.source.authorityLevel === (record.disposition.startsWith('CURRENT AUTHORITY') ? 'current_authority' : 'current_support') && index.extensions?.authoritySupportRole === record.disposition) }),
    structuredEvidenceIdentity: new Set(structuredIds).size === structuredIds.length && structured.every((item) => item.reviewOnly === true && item.promotionStatus === 'not_promoted'),
    retrievalSmokeTests: smoke.tests.length === records.length && smoke.tests.every((source) => source.tests.length >= 6 && source.tests.every((test) => test.pass && test.citationResolves && test.supportRolePreserved)),
    reviewOnlyGuardrails: review.learnerFacingStatus?.ready === false && review.ragReadiness?.ready === false && review.appExportReadiness?.ready === false && review.promotionRecommendation?.status === 'not_recommended' && indexes.sourceIndexes.every((index) => index.processing?.reviewOnly === true && index.processing?.promotionStatus === 'not_promoted' && index.processing?.ragReadyAllowed === false && index.chunks.every((chunk) => chunk.promotionEligible === false)),
    sourceExceptionAggregation: exceptionSources.every((group) => review.extractedItems.some((item) => item.sourceId === group.sourceId && item.outcome === 'HUMAN_REVIEW_REQUIRED' && item.exceptionCode === 'XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW' && item.reviewFlags.includes('XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW'))) && review.batchSummary.exceptionCount === review.exceptionsAndFlags.length,
  }
  return { ...checks, systemicFailures: Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name), manifestPath, authorizationRecordCount: authorization.selectedRecords.length, report }
}

const main = async () => {
  const required = ['batch-manifest.json', 'source-inventory.json', 'extraction-output.json', 'chunk-manifest.json', 'source-index-candidates.json', 'retrieval-smoke-tests.json', 'review-packet.json', 'review-packet.md', 'validation-report.json', 'unresolved-issues-summary.md', 'a1-quarantine-evidence.md']
  for (const file of required) if (!(await exists(path.join(outputRoot, file)))) fail('Missing acquisition pilot artifact: ' + file)
  const batch = await readJson(path.join(outputRoot, 'batch-manifest.json'))
  const inventory = await readJson(path.join(outputRoot, 'source-inventory.json'))
  const extraction = await readJson(path.join(outputRoot, 'extraction-output.json'))
  const chunks = await readJson(path.join(outputRoot, 'chunk-manifest.json'))
  const indexes = await readJson(path.join(outputRoot, 'source-index-candidates.json'))
  const smoke = await readJson(path.join(outputRoot, 'retrieval-smoke-tests.json'))
  const review = await readJson(path.join(outputRoot, 'review-packet.json'))
  const report = await readJson(path.join(outputRoot, 'validation-report.json'))
  const acquisition = await readJson(batch.extensions.acquisitionManifestPath || defaultManifest)
  const authorization = await readJson(path.resolve(acquisition.authorizationManifestPath))
  if (batch.batchId !== 'acquisition-pilot-2026-09-02' || batch.extensions?.a1Excluded !== true) fail('Invalid pilot identity or A1 exclusion.')
  if (batch.extensions?.authorizedProcessingScope !== 'ADMIT_TO_PROCESSING_QUEUE only') fail('Processing scope is not admitted-only.')
  if (inventory.items.length !== 7 || indexes.sourceIndexes.length !== 7 || smoke.tests.length !== 7 || review.sourceFilesProcessed.length !== 7) fail('Output does not contain exactly seven admitted sources.')
  if (inventory.items.some((item) => item.sourceId.includes('pbr-plenary-amendments-current'))) fail('A1 leakage detected.')
  const checks = await recomputePilotChecks({ acquisition, authorization, inventory, extraction, chunks, indexes, smoke, review, report, manifestPath: batch.extensions.acquisitionManifestPath })
  const checkNames = ['rawShaLineage', 'sourceIdentityBinding', 'extractionCompleteness', 'structuralSegmentation', 'deterministicIds', 'metadataCompleteness', 'authoritySupportPreserved', 'structuredEvidenceIdentity', 'retrievalSmokeTests', 'reviewOnlyGuardrails', 'sourceExceptionAggregation']
  for (const name of checkNames) if (checks[name] !== true) fail('Independently recomputed control failed: ' + name)
  if (report.status !== 'pass' || report.summary.systemicFailures !== 0 || checkNames.some((name) => report.checks[name] !== checks[name])) fail('Validation report does not match independently recomputed controls.')
  const workbook = extraction.sourceGroups.find((group) => group.sourceId === 'naic-pbr-vm-20-vm-31-vm-51-vmv-rates-2026')
  const disclaimer = workbook?.sheets?.find((sheet) => sheet.name === 'LEGAL DISCLAIMER')
  if (!disclaimer?.contentInventory?.substantiveNonCellContentMayExist || disclaimer.contentInventory.exceptionCode !== 'XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW') fail('A2 native non-cell content exception is missing.')
  if (!review.exceptionsAndFlags.some((flag) => flag.sourceId === workbook.sourceId && flag.flagType === 'xlsx_non_cell_content_requires_review')) fail('A2 source-level exception was not propagated to review packet.')
  if (!Array.isArray(report.exceptionTaxonomy) || !report.exceptionTaxonomy.includes('XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW') || !report.exceptionTaxonomy.includes('EMPTY_PAGE_BENIGN')) fail('Exception taxonomy is incomplete.')
  console.log('Independently validated low-touch acquisition pilot: 7 sources, ' + chunks.chunks.length + ' chunks, corpus retrieval controls passed, A2 non-cell content held for review, no promotion.')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error) => { console.error(error.message); process.exitCode = 1 })
