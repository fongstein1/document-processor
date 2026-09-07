import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hasSubstantiveContent, validateRightsFilesystem } from './rights-storage.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argValue = (name, fallback) => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback
const allowPartial = process.argv.includes('--allow-partial')
const outputRoot = path.resolve(argValue('--output-root', path.join(repoRoot, 'data', 'processed', 'review_packages', 'scaled-wave-01-2026-09')))
const readJson = async (filePath) => JSON.parse((await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, ''))
const exists = async (filePath) => fs.access(filePath).then(() => true).catch(() => false)
const sha256 = async (filePath) => crypto.createHash('sha256').update(await fs.readFile(filePath)).digest('hex')
const fail = (message) => { throw new Error(message) }

const validateExceptionChain = ({ extraction, chunks, review, report }) => {
  const requirements = []
  for (const group of extraction.sourceGroups || []) {
    for (const sheet of group.sheets || []) {
      if (sheet.contentInventory?.exceptionCode) requirements.push({ sourceId: group.sourceId, code: sheet.contentInventory.exceptionCode })
    }
    for (const page of group.emptyPageDetails || []) {
      if (page.classification === 'IMAGE_ONLY_SUBSTANTIVE_CONTENT') requirements.push({ sourceId: group.sourceId, code: 'IMAGE_ONLY_SUBSTANTIVE_CONTENT' })
      if (page.classification === 'EMPTY_PAGE_REQUIRES_REVIEW') requirements.push({ sourceId: group.sourceId, code: 'EMPTY_PAGE_REQUIRES_REVIEW' })
    }
  }
  const humanItems = review.extractedItems.filter((item) => item.outcome === 'HUMAN_REVIEW_REQUIRED')
  return requirements.every(({ sourceId, code }) => {
    const chunk = chunks.chunks.some((item) => item.sourceId === sourceId && item.reviewFlags?.includes(code))
    const item = humanItems.find((candidate) => candidate.sourceId === sourceId && candidate.exceptionCode === code && candidate.reviewFlags?.includes(code))
    const flag = review.exceptionsAndFlags.some((candidate) => candidate.sourceId === sourceId && candidate.flagType === code.toLowerCase())
    const issue = review.unresolvedIssues.some((candidate) => candidate.sourceId === sourceId && candidate.exceptionCode === code && candidate.outcome === 'HUMAN_REVIEW_REQUIRED')
    const inExceptionSample = review.exceptionReviewSample?.sourceIds?.includes(sourceId)
    const notCleanSample = !review.cleanReviewSample?.sourceIds?.includes(sourceId)
    return chunk && item && flag && issue && inExceptionSample && notCleanSample && report.summary.humanReviewRequired === humanItems.length
  })
}

const validateScaledWave = async () => {
  const names = ['batch-manifest.json', 'source-inventory.json', 'extraction-output.json', 'chunk-manifest.json', 'source-index-candidates.json', 'retrieval-smoke-tests.json', 'external-artifact-manifest.json', 'review-packet.json', 'review-packet.md', 'validation-report.json', 'unresolved-issues-summary.md']
  for (const name of names) if (!(await exists(path.join(outputRoot, name)))) fail('Missing scaled-wave artifact: ' + name)
  const batch = await readJson(path.join(outputRoot, 'batch-manifest.json'))
  const inventory = await readJson(path.join(outputRoot, 'source-inventory.json'))
  const extraction = await readJson(path.join(outputRoot, 'extraction-output.json'))
  const chunks = await readJson(path.join(outputRoot, 'chunk-manifest.json'))
  const indexes = await readJson(path.join(outputRoot, 'source-index-candidates.json'))
  const smoke = await readJson(path.join(outputRoot, 'retrieval-smoke-tests.json'))
  const review = await readJson(path.join(outputRoot, 'review-packet.json'))
  const report = await readJson(path.join(outputRoot, 'validation-report.json'))
  const acquisition = await readJson(batch.extensions.acquisitionManifestPath)
  const authorization = await readJson(acquisition.authorizationManifestPath)
  const admitted = acquisition.acquisitions.filter((record) => record.acquisitionOutcome === 'ADMIT_TO_PROCESSING_QUEUE')
  const ids = admitted.map((record) => record.candidateId)
  const byId = new Map(authorization.selectedRecords.map((record) => [record.candidateId, record]))
  if (batch.processingIntent.mode !== 'scaled_review_only' || batch.boundaries.substantiveArtifactsExternal !== true || batch.boundaries.noCanonicalPromotion !== true) fail('Scaled-wave governance boundary is invalid.')
  if ((ids.length < 8 || ids.length > 12 || new Set(ids).size !== ids.length) && !allowPartial) fail('Scaled wave does not contain 8-12 unique admitted candidates.')
  if (ids.length > 12 || new Set(ids).size !== ids.length) fail('Scaled wave contains too many or duplicate admitted candidates.')
  if (ids.some((id) => !byId.has(id) || id.includes('pbr-plenary-amendments-current'))) fail('Admitted source is missing authorization or A1 entered the scaled wave.')
  if (inventory.items.length !== ids.length || extraction.sourceGroups.length !== ids.length || indexes.sourceIndexes.length !== ids.length || smoke.tests.length !== ids.length || review.sourceFilesProcessed.length !== ids.length) fail('Scaled-wave artifacts do not reconcile to admitted-source count.')
  const rawShaLineage = inventory.items.every((item) => item.filePath && item.fileHash && exists(item.filePath) && item.fileHash === item.fileHash)
    && (await Promise.all(inventory.items.map(async (item) => item.fileHash === await sha256(item.filePath)))).every(Boolean)
  const sourceIdentityBinding = ids.every((id) => inventory.items.some((item) => item.sourceId === id) && extraction.sourceGroups.some((group) => group.sourceId === id) && indexes.sourceIndexes.some((index) => index.source.sourceId === id))
  const extractionCompleteness = extraction.sourceGroups.every((group) => group.pageCount > 0 || Array.isArray(group.sheets)) && ids.every((id) => chunks.chunks.some((chunk) => chunk.sourceId === id))
  const structuralSegmentation = chunks.chunks.length > 0 && chunks.chunks.every((chunk) => chunk.sectionReference && chunk.citations?.length > 0 && ['actual_extracted_source_text', 'placeholder_pending_source_text', 'external_artifact'].includes(chunk.sourceTextType))
  const deterministicIds = new Set(chunks.chunks.map((chunk) => chunk.chunkId)).size === chunks.chunks.length
  const metadataCompleteness = inventory.items.every((item) => item.sourceId && item.filename && item.fileHash && item.sourceReference && item.documentType && item.rightsStatus)
  const authoritySupportPreserved = indexes.sourceIndexes.every((index) => { const record = byId.get(index.source.sourceId); return record && index.source.authorityLevel === (record.disposition.startsWith('CURRENT AUTHORITY') ? 'current_authority' : 'current_support') && index.extensions?.authoritySupportRole === record.disposition && index.chunks.every((chunk) => chunk.extensions?.authoritySupportRole === record.disposition && chunk.extensions?.sourceSha256 === index.source.sourceSha256) })
  const structured = indexes.sourceIndexes.flatMap((index) => index.extensions?.structuredEvidence || [])
  const structuredEvidenceIdentity = new Set(structured.map((item) => item.structuredEvidenceId)).size === structured.length && structured.every((item) => item.reviewOnly === true && item.promotionStatus === 'not_promoted')
  const allTests = smoke.tests.flatMap((source) => source.tests)
  const positives = allTests.filter((test) => test.expectedMatch)
  const confusion = allTests.filter((test) => test.testKind === 'wrong_source_topic_negative')
  const retrievalSmokeTests = smoke.tests.every((source) => source.tests.length >= 6 && source.allPassed && source.tests.every((test) => test.pass && test.citationResolves && test.supportRolePreserved))
  const retrievalShaAssertions = positives.length > 0 && positives.every((test) => test.expectedSourceSha256 && test.selectedSourceSha256 === test.expectedSourceSha256 && test.selectedChunkSourceSha256 === test.expectedSourceSha256 && test.shaMatches && test.lineageMatches)
  const retrievalRoleAssertions = positives.length > 0 && positives.every((test) => test.expectedAuthorityRole && test.selectedAuthorityRole === test.expectedAuthorityRole && test.roleMatches && test.supportRolePreserved)
  const workbookTest = allTests.find((test) => test.testKind === 'numeric_or_form' && test.expectedWorkbookEvidence)
  const evidence = workbookTest?.expectedWorkbookEvidence
  const a2NumericAssertions = Boolean(workbookTest && evidence?.sheetName && evidence.worksheetPath && evidence.cellRef && Object.prototype.hasOwnProperty.call(evidence, 'expectedStoredValue') && Object.prototype.hasOwnProperty.call(evidence, 'expectedFormula') && evidence.selectedStoredValue === evidence.expectedStoredValue && evidence.selectedFormula === evidence.expectedFormula && evidence.sourceSha256 === workbookTest.expectedSourceSha256 && evidence.expectedAuthoritySupportRole === workbookTest.expectedAuthorityRole && workbookTest.workbookEvidenceMatch && workbookTest.pass)
  const confusionSetNegatives = confusion.length >= Math.min(7, ids.length) && confusion.every((test) => test.pass && test.wrongSourceExcluded && test.expectedCandidateId && test.negativeAgainstCandidateId)
  const reviewOnlyGuardrails = review.learnerFacingStatus?.ready === false && review.ragReadiness?.ready === false && review.appExportReadiness?.ready === false && review.promotionRecommendation?.status === 'not_recommended' && indexes.sourceIndexes.every((index) => index.processing?.reviewOnly === true && index.processing?.promotionStatus === 'not_promoted' && index.processing?.ragReadyAllowed === false && index.chunks.every((chunk) => chunk.promotionEligible === false))
  const sourceExceptionAggregation = validateExceptionChain({ extraction, chunks, review, report })
  const checks = { rawShaLineage, sourceIdentityBinding, extractionCompleteness, structuralSegmentation, deterministicIds, metadataCompleteness, authoritySupportPreserved, structuredEvidenceIdentity, retrievalSmokeTests, retrievalShaAssertions, retrievalRoleAssertions, a2NumericAssertions, confusionSetNegatives, reviewOnlyGuardrails, sourceExceptionAggregation }
  for (const [name, passed] of Object.entries(checks)) if (!passed) fail('Scaled-wave control failed: ' + name)
  const derivedSystemicFailures = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name)
  if (derivedSystemicFailures.length !== report.summary.systemicFailures || report.status !== 'pass') fail('Scaled-wave report systemic-failure summary is not derived/reconciled.')
  if (JSON.stringify(report.checks) !== JSON.stringify({ ...report.checks, ...checks })) fail('Scaled-wave report checks contain unexpected divergence from independent recomputation.')
  const clean = review.cleanReviewSample?.sourceIds || []
  if (clean.some((id) => !review.extractedItems.some((item) => item.sourceId === id && item.outcome === 'CLEAN_REVIEW_CANDIDATE')) || clean.length < Math.min(3, report.summary.cleanReviewCandidates)) fail('Scaled-wave clean sample is not a deterministic sample of clean records.')
  if (review.exceptionReviewSample?.sourceIds?.some((id) => !review.extractedItems.some((item) => item.sourceId === id && item.outcome === 'HUMAN_REVIEW_REQUIRED'))) fail('Scaled-wave exception sample is not restricted to human-review records.')
  const policy = await readJson(path.join(repoRoot, 'config', 'rights-storage-policy.json'))
  const rights = await validateRightsFilesystem({ policy, repoRoot, outputRoot })
  const repoArtifacts = {}
  for (const name of ['extraction-output.json', 'chunk-manifest.json', 'source-index-candidates.json', 'retrieval-smoke-tests.json']) repoArtifacts[name] = await readJson(path.join(outputRoot, name))
  if (Object.values(repoArtifacts).some((artifact) => hasSubstantiveContent(artifact))) fail('Substantive content is present in a tracked scaled-wave artifact.')
  console.log(JSON.stringify({ batchId: batch.batchId, waveSizeStatus: ids.length >= 8 && ids.length <= 12 ? 'PASS' : 'BLOCKED_BELOW_MINIMUM_ADMITTED_COUNT', admitted: ids.length, acquired: acquisition.summary.successfullyDownloaded, quarantined: acquisition.summary.quarantined, rejected: acquisition.summary.rejected, processed: report.summary.processedSuccessfully, clean: report.summary.cleanReviewCandidates, humanReview: report.summary.humanReviewRequired, blocked: report.summary.processingBlocked, systemicFailures: report.summary.systemicFailures, pdfCount: admitted.filter((record) => record.expectedFileType === 'PDF').length, xlsxCount: admitted.filter((record) => record.expectedFileType === 'XLSX').length, retrievalTests: allTests.length, retrievalPassed: allTests.filter((test) => test.pass).length, confusionSetNegatives: confusion.length, cleanSample: clean, externalArtifactCount: rights.externalArtifactCount, rightsControlledSources: rights.controlledSourceCount, checks }, null, 2))
}

validateScaledWave().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1 })
