import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'acquisition-pilot-2026-09-02')
const fixturePath = path.join(repoRoot, 'data', 'samples', 'acquisition-pilot', 'xlsx-structure-hazards.example.json')
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const fail = (message) => { throw new Error(message) }

const main = async () => {
  const fixture = await readJson(fixturePath)
  if (fixture.sheets[0].mergedRanges.length !== 1 || fixture.sheets[1].state !== 'hidden') fail('Synthetic workbook fixture lost merged or hidden-sheet hazards.')
  const formulaCell = fixture.sheets[0].cells.find((cell) => cell.ref === 'B3')
  if (!formulaCell || formulaCell.formula === formulaCell.value) fail('Formula and displayed value are not distinct in fixture.')
  if (!fixture.sheets[0].duplicateLabelValues.includes('Amount') || fixture.sheets[0].blankSpacerRows.length !== 2) fail('Duplicate-label or spacer-row fixture contract is incomplete.')
  if (fixture.sheets[0].tableBlocks.length !== 3) fail('Fixture table-block boundary contract is incomplete.')

  const report = await readJson(path.join(outputRoot, 'validation-report.json'))
  const extraction = await readJson(path.join(outputRoot, 'extraction-output.json'))
  const chunks = await readJson(path.join(outputRoot, 'chunk-manifest.json'))
  const smoke = await readJson(path.join(outputRoot, 'retrieval-smoke-tests.json'))
  const indexes = await readJson(path.join(outputRoot, 'source-index-candidates.json'))
  const review = await readJson(path.join(outputRoot, 'review-packet.json'))
  const proposal = await readJson(path.join(outputRoot, 'next-batch-proposal.json'))
  const workbook = extraction.sourceGroups.find((group) => group.sourceId === 'naic-pbr-vm-20-vm-31-vm-51-vmv-rates-2026')
  if (!workbook || workbook.sheets.some((sheet) => !Array.isArray(sheet.mergedRanges) || !Array.isArray(sheet.tableBlocks) || !Array.isArray(sheet.duplicateLabelValues) || !sheet.state)) fail('Live workbook extraction is missing generic structure metadata.')
  if (report.summary.totalAdmitted !== 7 || report.summary.processedSuccessfully !== 7 || report.summary.humanReviewRequired !== 1 || report.summary.cleanReviewCandidates !== 6 || report.summary.processingBlocked !== 0) fail('Live acquisition pilot source reconciliation changed unexpectedly.')
  if (new Set(chunks.chunks.map((chunk) => chunk.chunkId)).size !== chunks.chunks.length) fail('Live chunk IDs are not deterministic and unique.')
  if (smoke.tests.some((source) => source.tests.length < 6 || !source.tests.find((test) => test.testKind === 'wrong_source_topic_negative' && test.pass) || source.tests.some((test) => !test.expectedRankThreshold))) fail('Corpus retrieval regression coverage is incomplete or the negative guard failed.')
  const a2Numeric = smoke.tests.flatMap((source) => source.tests).find((test) => test.testKind === 'numeric_or_form' && test.expectedWorkbookEvidence)
  if (!a2Numeric?.pass || a2Numeric.expectedWorkbookEvidence.sheetName !== '2026 Jumbo Rates' || a2Numeric.expectedWorkbookEvidence.cellRef !== 'A4' || a2Numeric.expectedWorkbookEvidence.selectedStoredValue !== a2Numeric.expectedWorkbookEvidence.expectedStoredValue || a2Numeric.expectedWorkbookEvidence.selectedFormula !== a2Numeric.expectedWorkbookEvidence.expectedFormula) fail('Executable A2 numeric/formula retrieval assertion regressed.')
  if ((smoke.tests.flatMap((source) => source.tests).filter((test) => test.testKind === 'wrong_source_topic_negative').length) < 9) fail('Confusion-set retrieval negative coverage regressed.')
  const disclaimer = workbook.sheets.find((sheet) => sheet.name === 'LEGAL DISCLAIMER')
  if (!disclaimer || disclaimer.cellContentCount !== 0 || disclaimer.contentInventory?.exceptionCode !== 'XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW') fail('A2 LEGAL DISCLAIMER non-cell-content exception regressed.')
  if (!report.checks.sourceExceptionAggregation || !report.checks.retrievalSmokeTests || report.summary.systemicFailures !== 0) fail('Derived validation controls or source-level exception aggregation regressed.')
  const s1 = extraction.sourceGroups.find((group) => group.sourceId === 'naic-pbr-vm-20-vm-31-vm-51-pbr-vm-current-redline')
  if (!s1 || s1.emptyPageDetails.length !== 6 || s1.emptyPageDetails.some((page) => page.classification !== 'EMPTY_PAGE_BENIGN' || page.contentBytes !== 0 || page.imageXObjects !== 0)) fail('S1 benign-empty-page classification regressed.')
  if (indexes.sourceIndexes.some((index) => index.processing.reviewOnly !== true || index.processing.promotionStatus !== 'not_promoted')) fail('Review-only guardrail regressed.')
  const a2Id = 'naic-pbr-vm-20-vm-31-vm-51-vmv-rates-2026'
  if (review.cleanReviewSample.sourceIds.includes(a2Id) || !review.exceptionReviewSample.sourceIds.includes(a2Id)) fail('A2 stale clean-sample labeling regressed.')
  if (proposal.candidateCount < 20 || proposal.candidateCount > 30 || proposal.humanAdjudication !== 'PENDING' || proposal.downloadAuthorized || proposal.processingAuthorized || proposal.canonicalPromotionAuthorized || proposal.candidates.some((candidate) => !candidate.candidateId || candidate.pilotSlot !== null)) fail('Selection-only next-batch proposal is outside its governance boundary.')
  console.log('Passed acquisition pilot regressions: workbook structure, benign S1 blanks, unique IDs, executable A2 numeric/formula evidence, 9 confusion-set negatives, clean-sample separation, and no-promotion guardrails.')
}

main().catch((error) => { console.error(error.message); process.exitCode = 1 })
