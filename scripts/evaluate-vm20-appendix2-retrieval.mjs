import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveStructuredTableRequest } from './lib/structured-table-retrieval.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const datasetPath = path.join(repoRoot, 'data', 'processed', 'structured_tables', 'vm20-appendix2-tables.json')
const evaluationPath = path.join(repoRoot, 'data', 'processed', 'structured_tables', 'vm20-appendix2-retrieval-evaluation.json')
const reviewJsonPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-structured-table-review-package.json')
const reviewMdPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-structured-table-review-package.md')
const promptPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-independent-review-prompt.md')
const sourceQaPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-structured-table-source-qa.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))

const cases = [
  { queryId: 'table-a-exact-value', queryText: 'What is current Table A for PBR numeric rating 1 at WAL 1?', intent: 'row_value', tableLabel: 'A', asOfDate: 'current', dimensions: { pbr_numeric_rating: 1 }, columnId: 'wal-1', expected: { supportState: 'supported_review_only', reasonCode: 'exact_structured_value_found', displayValue: '0.02', sourceCell: 'C6' } },
  { queryId: 'table-f-current-exact-value', queryText: 'What is the current Table F spread for PBR rating 1 at WAL 1?', intent: 'row_value', tableLabel: 'F', asOfDate: 'current', dimensions: { weighted_average_life_years: 1 }, columnId: 'pbr-rating-1', expected: { supportState: 'supported_review_only', versionId: 'vm20-table-f-2026-07-31', displayValue: '2.90', sourceCell: 'B5' } },
  { queryId: 'table-f-historical-version', queryText: 'What was Table F for PBR rating 1 at WAL 1 on May 29, 2026?', intent: 'row_value', tableLabel: 'F', asOfDate: '2026-05-29', dimensions: { weighted_average_life_years: 1 }, columnId: 'pbr-rating-1', expected: { supportState: 'supported_review_only', versionId: 'vm20-table-f-2026-05-29', displayValue: '13.93' } },
  { queryId: 'table-j-current-short-tenor', queryText: 'What is the current three-month Table J current swap spread?', intent: 'row_value', tableLabel: 'J', asOfDate: 'current', dimensions: { weighted_average_life_or_tenor: '3M' }, columnId: 'current-swap-spread', expected: { supportState: 'supported_review_only', versionId: 'vm20-table-j-2026-07-31', displayValue: '-0.63', sourceCell: 'B4' } },
  { queryId: 'table-k-rating-mapping', queryText: "What PBR numeric rating maps to Moody's Baa2?", intent: 'mapping_lookup', tableLabel: 'K', asOfDate: 'current', columnId: 'moodys-rating', lookupValue: 'Baa2', expected: { supportState: 'supported_review_only', reasonCode: 'mapping_row_found', rowId: 'vm20-table-k-rating-9' } },
  { queryId: 'table-g-column-meaning', queryText: 'What does the PBR rating 11 column mean in current Table G?', intent: 'column_interpretation', tableLabel: 'G', asOfDate: 'current', columnId: 'pbr-rating-11', expected: { supportState: 'supported_review_only', columnLabel: 'PBR Rating 11 (Ba1/BB+)' } },
  { queryId: 'table-h-currentness', queryText: 'Which Table H version is current in this retrieved corpus?', intent: 'table_identity', tableLabel: 'H', asOfDate: 'current', expected: { supportState: 'supported_review_only', versionId: 'vm20-table-h-2026-06-30', asOfDate: '2026-06-30', currentness: 'current_as_of_retrieval' } },
  { queryId: 'table-applicability-below-investment-grade-current', queryText: 'Which table applies to below-investment-grade current benchmark bond spreads?', intent: 'applicability', titleTerms: ['below investment grade', 'current benchmark'], expected: { supportState: 'supported_review_only', tableId: 'vm20-table-g' } },
  { queryId: 'table-j-footnote', queryText: 'What source note applies to current 3M and 6M Table J values?', intent: 'footnote', tableLabel: 'J', noteId: 'short-tenor-current-sofr-source', expected: { supportState: 'supported_review_only', noteId: 'short-tenor-current-sofr-source', evidenceClass: 'structured_table_note' } },
  { queryId: 'table-f-methodology-routing', queryText: 'How is Table F methodology developed?', intent: 'methodology', tableLabel: 'F', expected: { supportState: 'supported_review_only', reasonCode: 'methodology_routed_to_manual_prose', evidenceClass: 'methodology_prose' } },
  { queryId: 'table-b-current-value-unavailable', queryText: 'What is the current Table B value?', intent: 'row_value', tableLabel: 'B', asOfDate: 'current', expected: { supportState: 'unsupported', reasonCode: 'current_table_not_available' } },
  { queryId: 'table-f-missing-rating', queryText: 'What is the current Table F spread at WAL 10?', intent: 'row_value', tableLabel: 'F', asOfDate: 'current', dimensions: { weighted_average_life_years: 10 }, expected: { supportState: 'ambiguous', reasonCode: 'value_column_missing' } },
  { queryId: 'table-f-wal-out-of-range', queryText: 'What is current Table F for PBR rating 1 at WAL 31?', intent: 'row_value', tableLabel: 'F', asOfDate: 'current', dimensions: { weighted_average_life_years: 31 }, columnId: 'pbr-rating-1', expected: { supportState: 'unsupported', reasonCode: 'dimension_value_outside_table' } },
  { queryId: 'table-j-missing-measure', queryText: 'What is the current Table J value at 3M?', intent: 'row_value', tableLabel: 'J', asOfDate: 'current', dimensions: { weighted_average_life_or_tenor: '3M' }, expected: { supportState: 'ambiguous', reasonCode: 'value_column_missing' } },
  { queryId: 'table-k-explicit-null', queryText: 'What NAIC commercial mortgage designation is shown for PBR numeric rating 4?', intent: 'row_value', tableLabel: 'K', asOfDate: 'current', dimensions: { pbr_numeric_rating: 4 }, columnId: 'naic-commercial-mortgage-designation', expected: { supportState: 'supported_review_only', reasonCode: 'explicit_source_null', displayValue: null, valueType: 'null' } },
]

const matchesExpected = (result, expected) => Object.entries(expected).every(([key, value]) => JSON.stringify(result[key]) === JSON.stringify(value))

const reviewPrompt = `# Independent Review Prompt: VM-20 Appendix 2 Structured Tables

Please independently review the VM-20 Appendix 2 structured-table proof of concept in this repository.

Primary artifacts:

- \`data/processed/review_packages/vm20-appendix2-structured-table-review-package.md\`
- \`data/processed/structured_tables/vm20-appendix2-tables.json\`
- \`data/processed/review_packages/vm20-appendix2-structured-table-source-qa.json\`
- \`data/processed/structured_tables/vm20-appendix2-retrieval-evaluation.json\`

Compare the structured JSON with the five ignored source workbooks under \`data/work/structured-table-sources/vm20-appendix2-2026\` and with the 2026 Valuation Manual Appendix 2 methodology on printed pages 20-91 through 20-96 (physical PDF pages 135-140).

Review at least the following:

1. Confirm workbook identity, official URL, SHA-256, sheet inventory, table identity, and currentness/version treatment.
2. Confirm row and column dimensions, units, displayed precision, negative values, explicit nulls, and representative exact cell values for Tables A, F, G, H, I, J, and K.
3. Confirm that Tables B, C, D, E1, and E2 are marked unavailable rather than reconstructed from methodology prose or historical values.
4. Confirm workbook/sheet/cell citations and manual printed/physical page citations.
5. Confirm Table A's effective-date note and Table J's short-tenor/disclosure note scope without inferring unrecorded legal effect.
6. Confirm legal-disclaimer retention is source-workbook/hash based and that no invisible/non-cell disclaimer text was invented.
7. Run the structured-table build, source QA, retrieval evaluation, validation, and full repository checks.
8. Confirm the dataset remains separate from the promoted prose corpus, review-only, not promoted, and ineligible for learner/app/RAG/Copilot export.

Return one disposition: APPROVE, APPROVE WITH FIXES, REPROCESS, or REJECT. List every blocking and non-blocking finding with table/version/row/column/cell evidence. Do not promote the table dataset as part of the review; promotion requires a separate recorded decision.
`

const main = async () => {
  const dataset = await readJson(datasetPath)
  const sourceQa = await readJson(sourceQaPath)
  const results = cases.map((request) => {
    const result = resolveStructuredTableRequest(dataset, request)
    const passed = matchesExpected(result, request.expected)
    return { ...result, expected: request.expected, passed }
  })
  const evaluation = {
    schemaVersion: '1.0',
    evaluationId: 'vm20-appendix2-structured-table-retrieval-2026-08-26',
    datasetId: dataset.datasetId,
    method: 'typed_structured_table_request_with_generic_dimension_version_and_governance_resolution',
    queryCount: results.length,
    passedQueryCount: results.filter((result) => result.passed).length,
    failedQueryCount: results.filter((result) => !result.passed).length,
    supportedReviewOnlyCount: results.filter((result) => result.supportState === 'supported_review_only').length,
    unsupportedCount: results.filter((result) => result.supportState === 'unsupported').length,
    ambiguousCount: results.filter((result) => result.supportState === 'ambiguous').length,
    productionAnswerEligibleCount: results.filter((result) => result.productionAnswerEligible).length,
    status: results.every((result) => result.passed) ? 'passed' : 'failed',
    results,
    governanceNote: 'The resolver recognizes structured evidence and precise citations, but production-answer eligibility remains false until a separate table promotion changes dataset governance.',
  }
  await fs.writeFile(evaluationPath, `${JSON.stringify(evaluation, null, 2)}\n`, 'utf8')
  if (evaluation.status !== 'passed') throw new Error(`Structured table retrieval evaluation failed ${evaluation.failedQueryCount} query cases.`)

  const currentVersions = dataset.tables.map((table) => {
    const version = table.versions.find((item) => item.currentness === 'current_as_of_retrieval')
    return { tableLabel: table.tableLabel, tableId: table.tableId, versionId: version.versionId, asOfDate: version.asOfDate, effectiveDate: version.effectiveDate, currentnessBasis: version.currentnessBasis }
  })
  const unavailable = dataset.tableInventory.filter((item) => item.status === 'unavailable_on_current_official_page')
  const reviewPackage = {
    schemaVersion: '1.0',
    reviewPackageId: 'vm20-appendix2-structured-table-review-package-2026-08-26',
    status: 'review_only',
    promoted: false,
    learnerFacing: false,
    appReady: false,
    ragReady: false,
    copilotExportEligible: false,
    datasetPath: 'data/processed/structured_tables/vm20-appendix2-tables.json',
    schemaPath: 'data/schemas/structured-regulatory-table.schema.json',
    sourceQaPath: 'data/processed/review_packages/vm20-appendix2-structured-table-source-qa.json',
    retrievalEvaluationPath: 'data/processed/structured_tables/vm20-appendix2-retrieval-evaluation.json',
    independentReviewPromptPath: 'data/processed/review_packages/vm20-appendix2-independent-review-prompt.md',
    scope: {
      included: 'Official workbooks currently linked by the NAIC for VM-20 Tables A, F, G, H, I, J, and K, including all dated sheets carried by those workbooks.',
      excluded: 'Tables B, C, D, E1, and E2 values; other VM tables; prose redesign; embeddings; databases; Copilot implementation; and any table promotion.',
      authorityBoundary: dataset.manualAuthority.authorityBoundary,
    },
    summary: dataset.summary,
    sourceArtifacts: dataset.sourceArtifacts.map(({ repositoryWorkPath, ...artifact }) => ({ ...artifact, repositoryWorkPath })),
    currentVersions,
    unavailableTables: unavailable,
    fidelity: {
      sourceQaStatus: sourceQa.status,
      sourceWorkbooksHashMatched: sourceQa.sourceChecks.every((item) => item.hashMatched),
      exactValueCellsChecked: sourceQa.valueCellsChecked,
      formulaValueCellCount: sourceQa.formulaValueCellCount,
      legalDisclaimerSheetsRetained: sourceQa.legalDisclaimerSheetsRetained,
      citationGranularity: 'workbook + sheet + cell for values; printed and physical manual page ranges for methodology',
    },
    retrievalEvaluation: {
      status: evaluation.status,
      queryCount: evaluation.queryCount,
      passedQueryCount: evaluation.passedQueryCount,
      supportedReviewOnlyCount: evaluation.supportedReviewOnlyCount,
      unsupportedCount: evaluation.unsupportedCount,
      ambiguousCount: evaluation.ambiguousCount,
      productionAnswerEligibleCount: evaluation.productionAnswerEligibleCount,
      coveredBehaviors: ['exact row/value retrieval', 'historical version selection', 'column interpretation', 'table identity/currentness', 'applicability', 'footnote routing', 'methodology-versus-value routing', 'unavailable table handling', 'ambiguous missing dimensions', 'out-of-range dimensions', 'explicit source nulls'],
    },
    knownLimitations: [
      'Currentness is bounded to the NAIC current-data page and workbooks retrieved on 2026-08-26; later publications may supersede these versions.',
      'Table K is undated; it is labeled current-as-of-retrieval based on the official page rather than an inferred workbook date.',
      'Table A is a workbook labeled with December 2025 data and an explicit June 30, 2026 effective date; currentness is based on the official current-data page plus that effective-date note.',
      'The official Table J workbook contains both current and long-term swap-spread columns, while Appendix 2 Subsection H describes Table J as long-term; the proof of concept preserves the workbook columns and flags the identity boundary for reviewer confirmation.',
      'Dedicated legal-disclaimer sheets do not expose disclaimer text as ordinary cells; preservation is by source workbook, hash, and sheet locator.',
      'Tables B, C, D, E1, and E2 are described in the manual but were not available as current workbooks on the official page and are not reconstructed.',
      'Table J disclosure applicability beyond the explicit workbook note locations requires independent reviewer confirmation.',
    ],
    humanReview: {
      required: true,
      decisionOptions: ['APPROVE', 'APPROVE WITH FIXES', 'REPROCESS', 'REJECT'],
      provisionalDisposition: 'PENDING INDEPENDENT REVIEW',
      promotionDecisionIncluded: false,
      requiredChecks: ['source identity and currentness', 'table/column/row semantics', 'units and displayed precision', 'exact representative values and nulls', 'citation fidelity', 'footnote and disclaimer scope', 'retrieval behavior and governance boundary'],
    },
  }
  await fs.writeFile(reviewJsonPath, `${JSON.stringify(reviewPackage, null, 2)}\n`, 'utf8')
  await fs.writeFile(promptPath, reviewPrompt, 'utf8')

  const lines = [
    '# VM-20 Appendix 2 Structured Table Review Package', '',
    '- Status: review-only', '- Promoted: no', '- Independent review: pending', '- Learner/app/RAG/Copilot eligible: no', '',
    '## Scope', '', reviewPackage.scope.included, '', `Excluded: ${reviewPackage.scope.excluded}`, '',
    '## Dataset counts', '',
    `- Logical tables ingested: ${dataset.summary.ingestedLogicalTableCount}`, `- Table versions: ${dataset.summary.tableVersionCount} (${dataset.summary.currentVersionCount} current-as-of-retrieval; ${dataset.summary.historicalSnapshotCount} historical)`, `- Rows / values / retrieval units: ${dataset.summary.rowCount} / ${dataset.summary.valueCount} / ${dataset.summary.retrievalUnitCount}`, '',
    '## Current-as-of-retrieval versions', '', '| Table | Version | As-of date | Effective date |', '| --- | --- | --- | --- |',
    ...currentVersions.map((item) => `| ${item.tableLabel} | \`${item.versionId}\` | ${item.asOfDate ?? 'undated'} | ${item.effectiveDate ?? 'n/a'} |`), '',
    '## Explicit unavailable-table boundary', '', ...unavailable.map((item) => `- Table ${item.tableLabel}: ${item.reason}`), '',
    '## Fidelity and citations', '',
    `- Source workbooks verified by SHA-256: ${sourceQa.sourceArtifactCount}/${sourceQa.sourceArtifactCount}`, `- Exact workbook cells checked: ${sourceQa.valueCellsChecked}`, `- Formula-backed structured values: ${sourceQa.formulaValueCellCount}`, `- Legal-disclaimer sheets retained: ${sourceQa.legalDisclaimerSheetsRetained}`, '- Value citations retain workbook URL, sheet, range, row/column source cells, raw value, display value, and number format.', '- Methodology citations retain 2026 Manual printed and physical PDF page ranges.', '',
    '## Retrieval evaluation', '',
    `- Status: ${evaluation.status}`, `- Cases passed: ${evaluation.passedQueryCount}/${evaluation.queryCount}`, `- Supported review-only / unsupported / ambiguous: ${evaluation.supportedReviewOnlyCount} / ${evaluation.unsupportedCount} / ${evaluation.ambiguousCount}`, `- Production-answer eligible: ${evaluation.productionAnswerEligibleCount}`, '- The generic resolver uses table identity, version, dimensions, columns, notes, and governance; it does not treat review-only evidence as promoted production evidence.', '',
    '## Known limitations', '', ...reviewPackage.knownLimitations.map((item) => `- ${item}`), '',
    '## Independent review', '', `Use \`${reviewPackage.independentReviewPromptPath}\`.`, '', 'A reviewer must return APPROVE, APPROVE WITH FIXES, REPROCESS, or REJECT with source-cell evidence. Approval of this review package does not itself promote the dataset; promotion requires a separate recorded decision.', ''
  ]
  await fs.writeFile(reviewMdPath, lines.join('\n'), 'utf8')
  console.log(`Passed ${evaluation.passedQueryCount}/${evaluation.queryCount} structured-table retrieval cases.`)
  console.log('Built VM-20 Appendix 2 structured-table review package.')
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
