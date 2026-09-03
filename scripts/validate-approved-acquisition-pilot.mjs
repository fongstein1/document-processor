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

const exceptionChain = ({ extraction, chunks, review, report }) => {
  const code = 'XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW'
  const a2 = extraction.sourceGroups.find((group) => group.sourceId === 'naic-pbr-vm-20-vm-31-vm-51-vmv-rates-2026')
  const sheet = a2?.sheets?.find((item) => item.name === 'LEGAL DISCLAIMER')
  const chunk = chunks.chunks.find((item) => item.sourceId === a2?.sourceId && item.reviewFlags?.includes(code))
  const item = review.extractedItems.find((candidate) => candidate.sourceId === a2?.sourceId)
  const flag = review.exceptionsAndFlags.find((candidate) => candidate.sourceId === a2?.sourceId && candidate.flagType === code.toLowerCase())
  const issue = review.unresolvedIssues.find((candidate) => candidate.sourceId === a2?.sourceId && candidate.exceptionCode === code && candidate.outcome === 'HUMAN_REVIEW_REQUIRED')
  return Boolean(sheet?.contentInventory?.exceptionCode === code && sheet.contentInventory.substantiveNonCellContentMayExist && chunk && item?.outcome === 'HUMAN_REVIEW_REQUIRED' && item.exceptionCode === code && item.reviewFlags?.includes(code) && flag && issue && report.summary.humanReviewRequired === review.extractedItems.filter((candidate) => candidate.outcome === 'HUMAN_REVIEW_REQUIRED').length && review.exceptionReviewSample?.sourceIds?.includes(a2.sourceId) && !review.cleanReviewSample?.sourceIds?.includes(a2.sourceId))
}

export const recomputePilotChecks = async ({ acquisition, authorization, inventory, extraction, chunks, indexes, smoke, review, report, manifestPath = defaultManifest }) => {
  const records = acquisition.acquisitions.filter((record) => record.acquisitionOutcome === 'ADMIT_TO_PROCESSING_QUEUE')
  const approvedById = new Map(authorization.selectedRecords.map((record) => [record.candidateId, record]))
  const ids = records.map((record) => record.candidateId)
  const indexIds = indexes.sourceIndexes.map((index) => index.source.sourceId)
  const extractedIds = extraction.sourceGroups.map((group) => group.sourceId)
  const chunkIds = chunks.chunks.map((chunk) => chunk.chunkId)
  const structured = indexes.sourceIndexes.flatMap((index) => index.extensions?.structuredEvidence || [])
  const structuredIds = structured.map((item) => item.structuredEvidenceId)
  const allTests = smoke.tests.flatMap((source) => source.tests)
  const positives = allTests.filter((test) => test.expectedMatch)
  const confusion = allTests.filter((test) => test.testKind === 'wrong_source_topic_negative')
  const exceptionSources = extraction.sourceGroups.filter((group) => group.sheets?.some((sheet) => sheet.contentInventory?.exceptionCode))
  const checks = {
    rawShaLineage: inventory.items.length === records.length && (await Promise.all(inventory.items.map(async (item) => Boolean(await exists(item.filePath) && item.fileHash && item.fileHash === await sha256(item.filePath))))).every(Boolean),
    sourceIdentityBinding: new Set(ids).size === ids.length && ids.every((id) => indexIds.includes(id) && extractedIds.includes(id) && inventory.items.some((item) => item.sourceId === id)),
    extractionCompleteness: extractedIds.length === records.length && extractedIds.every((id) => chunks.chunks.some((chunk) => chunk.sourceId === id)),
    structuralSegmentation: chunks.chunks.length > 0 && chunks.chunks.every((chunk) => chunk.sectionReference && Array.isArray(chunk.citations) && chunk.citations.length > 0 && ['actual_extracted_source_text', 'placeholder_pending_source_text', 'external_artifact'].includes(chunk.sourceTextType)),
    deterministicIds: chunkIds.length > 0 && new Set(chunkIds).size === chunkIds.length,
    metadataCompleteness: inventory.items.every((item) => item.sourceId && item.filename && item.fileHash && item.sourceReference && item.documentType && item.rightsStatus),
    authoritySupportPreserved: indexes.sourceIndexes.every((index) => { const record = approvedById.get(index.source.sourceId); return Boolean(record && index.source.authorityLevel === (record.disposition.startsWith('CURRENT AUTHORITY') ? 'current_authority' : 'current_support') && index.extensions?.authoritySupportRole === record.disposition && index.extensions?.rightsStatus === index.source.rightsStatus && index.chunks.every((chunk) => chunk.extensions?.authoritySupportRole === record.disposition && chunk.extensions?.sourceSha256 === index.source.sourceSha256)) }),
    structuredEvidenceIdentity: new Set(structuredIds).size === structuredIds.length && structured.every((item) => item.reviewOnly === true && item.promotionStatus === 'not_promoted'),
    retrievalSmokeTests: smoke.tests.length === records.length && smoke.tests.every((source) => source.tests.length >= 6 && source.tests.every((test) => test.pass && test.citationResolves && test.supportRolePreserved && (!test.expectedMatch || (test.shaMatches && test.lineageMatches)))),
    retrievalShaAssertions: positives.length > 0 && positives.every((test) => test.expectedSourceSha256 && test.selectedSourceSha256 === test.expectedSourceSha256 && test.selectedChunkSourceSha256 === test.expectedSourceSha256 && test.shaMatches && test.lineageMatches),
    retrievalRoleAssertions: positives.length > 0 && positives.every((test) => test.expectedAuthorityRole && test.selectedAuthorityRole === test.expectedAuthorityRole && test.roleMatches && test.supportRolePreserved),
    a2NumericAssertions: (() => { const test = allTests.find((candidate) => candidate.testKind === 'numeric_or_form' && candidate.expectedWorkbookEvidence); const evidence = test?.expectedWorkbookEvidence; return Boolean(test && evidence && evidence.sheetName && evidence.worksheetPath && evidence.cellRef && Object.prototype.hasOwnProperty.call(evidence, 'expectedStoredValue') && Object.prototype.hasOwnProperty.call(evidence, 'expectedFormula') && evidence.selectedStoredValue === evidence.expectedStoredValue && evidence.selectedFormula === evidence.expectedFormula && evidence.sourceSha256 === test.expectedSourceSha256 && evidence.expectedAuthoritySupportRole === test.expectedAuthorityRole && test.workbookEvidenceMatch && test.pass) })(),
    confusionSetNegatives: confusion.length >= 7 && confusion.every((test) => test.pass && test.wrongSourceExcluded && test.expectedCandidateId && test.negativeAgainstCandidateId),
    reviewOnlyGuardrails: review.learnerFacingStatus?.ready === false && review.ragReadiness?.ready === false && review.appExportReadiness?.ready === false && review.promotionRecommendation?.status === 'not_recommended' && indexes.sourceIndexes.every((index) => index.processing?.reviewOnly === true && index.processing?.promotionStatus === 'not_promoted' && index.processing?.ragReadyAllowed === false && index.chunks.every((chunk) => chunk.promotionEligible === false)),
    sourceExceptionAggregation: exceptionSources.length > 0 && exceptionSources.every((group) => exceptionChain({ extraction, chunks, review, report })),
  }
  return { ...checks, systemicFailures: Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name), manifestPath, authorizationRecordCount: authorization.selectedRecords.length, report }
}

export const validatePilotDirectory = async () => {
  const required = ['batch-manifest.json', 'source-inventory.json', 'extraction-output.json', 'chunk-manifest.json', 'source-index-candidates.json', 'retrieval-smoke-tests.json', 'external-artifact-manifest.json', 'review-packet.json', 'review-packet.md', 'validation-report.json', 'unresolved-issues-summary.md', 'a1-quarantine-evidence.md']
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
  if (batch.batchId !== 'acquisition-pilot-2026-09-02' || batch.extensions?.a1Excluded !== true || batch.boundaries?.substantiveArtifactsExternal !== true) fail('Invalid pilot identity, A1 exclusion, or external artifact boundary.')
  if (batch.extensions?.authorizedProcessingScope !== 'ADMIT_TO_PROCESSING_QUEUE only') fail('Processing scope is not admitted-only.')
  if (inventory.items.length !== 7 || indexes.sourceIndexes.length !== 7 || smoke.tests.length !== 7 || review.sourceFilesProcessed.length !== 7) fail('Output does not contain exactly seven admitted sources.')
  if (inventory.items.some((item) => item.sourceId.includes('pbr-plenary-amendments-current'))) fail('A1 leakage detected.')
  const checks = await recomputePilotChecks({ acquisition, authorization, inventory, extraction, chunks, indexes, smoke, review, report, manifestPath: batch.extensions.acquisitionManifestPath })
  const checkNames = ['rawShaLineage', 'sourceIdentityBinding', 'extractionCompleteness', 'structuralSegmentation', 'deterministicIds', 'metadataCompleteness', 'authoritySupportPreserved', 'structuredEvidenceIdentity', 'retrievalSmokeTests', 'retrievalShaAssertions', 'retrievalRoleAssertions', 'a2NumericAssertions', 'confusionSetNegatives', 'reviewOnlyGuardrails', 'sourceExceptionAggregation']
  for (const name of checkNames) if (checks[name] !== true) fail('Independently recomputed control failed: ' + name)
  if (report.status !== 'pass' || report.summary.systemicFailures !== 0 || checkNames.some((name) => report.checks[name] !== checks[name])) fail('Validation report does not match independently recomputed controls.')
  const workbook = extraction.sourceGroups.find((group) => group.sourceId === 'naic-pbr-vm-20-vm-31-vm-51-vmv-rates-2026')
  const disclaimer = workbook?.sheets?.find((sheet) => sheet.name === 'LEGAL DISCLAIMER')
  if (!disclaimer?.contentInventory?.substantiveNonCellContentMayExist || disclaimer.contentInventory.exceptionCode !== 'XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW') fail('A2 native non-cell content exception is missing.')
  if (!review.exceptionsAndFlags.some((flag) => flag.sourceId === workbook.sourceId && flag.flagType === 'xlsx_non_cell_content_requires_review')) fail('A2 source-level exception was not propagated to review packet.')
  if (!Array.isArray(report.exceptionTaxonomy) || !report.exceptionTaxonomy.includes('XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW') || !report.exceptionTaxonomy.includes('EMPTY_PAGE_BENIGN')) fail('Exception taxonomy is incomplete.')
  console.log('Independently validated low-touch acquisition pilot: 7 sources, ' + chunks.chunks.length + ' non-content chunk records, executable SHA/role/numeric retrieval controls passed, A2 non-cell content held for review, rights artifacts verified, no promotion.')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) validatePilotDirectory().catch((error) => { console.error(error.message); process.exitCode = 1 })
