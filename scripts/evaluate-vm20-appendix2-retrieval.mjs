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

const averageCaseDefinitions = [
  { tableLabel: 'F', dimensionId: 'weighted_average_life_years', columnId: 'pbr-rating-1' },
  { tableLabel: 'G', dimensionId: 'weighted_average_life_years', columnId: 'pbr-rating-11' },
  { tableLabel: 'H', dimensionId: 'weighted_average_life_years', columnId: 'pbr-rating-1' },
  { tableLabel: 'I', dimensionId: 'weighted_average_life_years', columnId: 'pbr-rating-11' },
  { tableLabel: 'J', dimensionId: 'weighted_average_life_or_tenor', columnId: 'current-swap-spread' },
]

const averageCases = averageCaseDefinitions.flatMap(({ tableLabel, dimensionId, columnId }) => [
  {
    queryId: `table-${tableLabel.toLowerCase()}-average-regulatory-exclusion`,
    queryText: `What is the prescribed Table ${tableLabel} value at Average?`,
    intent: 'row_value', tableLabel, asOfDate: 'current', dimensions: { [dimensionId]: 'Average' }, columnId,
    expected: { supportState: 'unsupported', reasonCode: 'source_summary_not_regulatory_dimension', rowRole: 'source_summary_statistic', regulatoryValueEligible: false, displayValue: null },
  },
  {
    queryId: `table-${tableLabel.toLowerCase()}-average-explicit-source-summary`,
    queryText: `What is the Average row shown in the source workbook for Table ${tableLabel}?`,
    intent: 'source_summary', tableLabel, asOfDate: 'current', dimensions: { [dimensionId]: 'Average' }, columnId,
    expected: { supportState: 'supported_canonical', reasonCode: 'source_summary_statistic_found', evidenceClass: 'structured_table_source_summary', rowRole: 'source_summary_statistic', regulatoryValueEligible: false },
  },
])

const cases = [
  { queryId: 'table-a-exact-value', queryText: 'What is current Table A for PBR numeric rating 1 at WAL 1?', intent: 'row_value', tableLabel: 'A', asOfDate: 'current', dimensions: { pbr_numeric_rating: 1 }, columnId: 'wal-1', expected: { supportState: 'supported_canonical', reasonCode: 'exact_structured_value_found', displayValue: '0.02', sourceCell: 'C6' } },
  { queryId: 'table-a-pre-effective-date', queryText: 'What Table A value applied on June 29, 2026?', intent: 'row_value', tableLabel: 'A', asOfDate: '2026-06-29', dimensions: { pbr_numeric_rating: 1 }, columnId: 'wal-1', expected: { supportState: 'unsupported', reasonCode: 'table_version_not_yet_effective', effectiveDate: '2026-06-30', displayValue: null } },
  { queryId: 'table-f-current-exact-value', queryText: 'What is the current Table F spread for PBR rating 1 at WAL 1?', intent: 'row_value', tableLabel: 'F', asOfDate: 'current', dimensions: { weighted_average_life_years: 1 }, columnId: 'pbr-rating-1', expected: { supportState: 'supported_canonical', versionId: 'vm20-table-f-2026-07-31', displayValue: '2.90', sourceCell: 'B5' } },
  { queryId: 'table-f-historical-version', queryText: 'What was Table F for PBR rating 1 at WAL 1 on May 29, 2026?', intent: 'row_value', tableLabel: 'F', asOfDate: '2026-05-29', dimensions: { weighted_average_life_years: 1 }, columnId: 'pbr-rating-1', expected: { supportState: 'supported_canonical', versionId: 'vm20-table-f-2026-05-29', displayValue: '13.93' } },
  { queryId: 'table-j-current-short-tenor', queryText: 'What is the current 3-month swap spread in the official Table J workbook?', intent: 'row_value', tableLabel: 'J', asOfDate: 'current', dimensions: { weighted_average_life_or_tenor: '3M' }, columnId: 'current-swap-spread', expected: { supportState: 'supported_canonical', versionId: 'vm20-table-j-2026-07-31', displayValue: '-0.63', sourceCell: 'B4', regulatoryMeasureId: 'current_benchmark_swap_spread', workbookTableAssociation: 'Table J', manualTableIdentity: null } },
  { queryId: 'table-j-long-term-short-tenor', queryText: 'What is the VM-20 Table J long-term 3-month benchmark swap spread?', intent: 'row_value', tableLabel: 'J', asOfDate: 'current', dimensions: { weighted_average_life_or_tenor: '3M' }, columnId: 'long-term-swap-spread', expected: { supportState: 'supported_canonical', versionId: 'vm20-table-j-2026-07-31', displayValue: '-8.17', sourceCell: 'C4', regulatoryMeasureId: 'long_term_benchmark_swap_spread', workbookTableAssociation: 'Table J', manualTableIdentity: 'Table J' } },
  { queryId: 'table-j-ambiguous-measure', queryText: 'What is Table J 3-month spread?', intent: 'row_value', tableLabel: 'J', asOfDate: 'current', dimensions: { weighted_average_life_or_tenor: '3M' }, expected: { supportState: 'ambiguous', reasonCode: 'ambiguous_requires_more_context' } },
  { queryId: 'table-j-january-current-note-scope', queryText: 'What is January Table J current 3-month spread and its applicable source note?', intent: 'row_value', tableLabel: 'J', asOfDate: '2026-01-30', dimensions: { weighted_average_life_or_tenor: '3M' }, columnId: 'current-swap-spread', expected: { supportState: 'supported_canonical', applicableNoteIds: ['libor-to-sofr-disclosure-reference', 'short-tenor-current-sofr-source'] } },
  { queryId: 'table-j-january-long-term-note-exclusion', queryText: 'Does the January current-SOFR note apply to long-term 3-month Table J?', intent: 'row_value', tableLabel: 'J', asOfDate: '2026-01-30', dimensions: { weighted_average_life_or_tenor: '3M' }, columnId: 'long-term-swap-spread', expected: { supportState: 'supported_canonical', applicableNoteIds: ['libor-to-sofr-disclosure-reference'] } },
  { queryId: 'table-j-january-unrelated-maturity-note-exclusion', queryText: 'Does the January current-SOFR note apply to current 1-year Table J?', intent: 'row_value', tableLabel: 'J', asOfDate: '2026-01-30', dimensions: { weighted_average_life_or_tenor: 1 }, columnId: 'current-swap-spread', expected: { supportState: 'supported_canonical', applicableNoteIds: ['libor-to-sofr-disclosure-reference'] } },
  { queryId: 'table-j-later-version-note-exclusion', queryText: 'Does the January current-SOFR source note apply to July current 3-month Table J?', intent: 'row_value', tableLabel: 'J', asOfDate: 'current', dimensions: { weighted_average_life_or_tenor: '3M' }, columnId: 'current-swap-spread', expected: { supportState: 'supported_canonical', applicableNoteIds: [] } },
  { queryId: 'table-k-rating-mapping', queryText: "What PBR numeric rating maps to Moody's Baa2?", intent: 'mapping_lookup', tableLabel: 'K', asOfDate: 'current', columnId: 'moodys-rating', lookupValue: 'Baa2', expected: { supportState: 'supported_canonical', reasonCode: 'mapping_row_found', rowId: 'vm20-table-k-rating-9' } },
  { queryId: 'table-g-column-meaning', queryText: 'What does the PBR rating 11 column mean in current Table G?', intent: 'column_interpretation', tableLabel: 'G', asOfDate: 'current', columnId: 'pbr-rating-11', expected: { supportState: 'supported_canonical', columnLabel: 'PBR Rating 11 (Ba1/BB+)' } },
  { queryId: 'table-h-currentness', queryText: 'Which Table H version is current in this retrieved corpus?', intent: 'table_identity', tableLabel: 'H', asOfDate: 'current', expected: { supportState: 'supported_canonical', versionId: 'vm20-table-h-2026-06-30', asOfDate: '2026-06-30', currentness: 'current_as_of_retrieval' } },
  { queryId: 'table-applicability-below-investment-grade-current', queryText: 'Which table applies to below-investment-grade current benchmark bond spreads?', intent: 'applicability', titleTerms: ['below investment grade', 'current benchmark'], expected: { supportState: 'supported_canonical', tableId: 'vm20-table-g' } },
  { queryId: 'table-j-footnote', queryText: 'What source note applies to January current 3M and 6M Table J values?', intent: 'footnote', tableLabel: 'J', noteId: 'short-tenor-current-sofr-source', expected: { supportState: 'supported_canonical', noteId: 'short-tenor-current-sofr-source', evidenceClass: 'structured_table_note' } },
  { queryId: 'table-f-methodology-routing', queryText: 'How is Table F methodology developed?', intent: 'methodology', tableLabel: 'F', expected: { supportState: 'supported_canonical', reasonCode: 'methodology_routed_to_manual_prose', evidenceClass: 'methodology_prose' } },
  { queryId: 'table-b-current-value-unavailable', queryText: 'What is the current Table B value?', intent: 'row_value', tableLabel: 'B', asOfDate: 'current', expected: { supportState: 'unsupported', reasonCode: 'current_table_not_available' } },
  { queryId: 'table-f-missing-rating', queryText: 'What is the current Table F spread at WAL 10?', intent: 'row_value', tableLabel: 'F', asOfDate: 'current', dimensions: { weighted_average_life_years: 10 }, expected: { supportState: 'ambiguous', reasonCode: 'value_column_missing' } },
  { queryId: 'table-f-wal-out-of-range', queryText: 'What is current Table F for PBR rating 1 at WAL 31?', intent: 'row_value', tableLabel: 'F', asOfDate: 'current', dimensions: { weighted_average_life_years: 31 }, columnId: 'pbr-rating-1', expected: { supportState: 'unsupported', reasonCode: 'dimension_value_outside_table' } },
  { queryId: 'table-k-explicit-null', queryText: 'What NAIC commercial mortgage designation is shown for PBR numeric rating 4?', intent: 'row_value', tableLabel: 'K', asOfDate: 'current', dimensions: { pbr_numeric_rating: 4 }, columnId: 'naic-commercial-mortgage-designation', expected: { supportState: 'supported_canonical', reasonCode: 'explicit_source_null', displayValue: null, valueType: 'null' } },
  ...averageCases,
]

const matchesExpected = (result, expected) => Object.entries(expected).every(([key, value]) => JSON.stringify(result[key]) === JSON.stringify(value))

const main = async () => {
  const dataset = await readJson(datasetPath)
  const sourceQa = await readJson(sourceQaPath)
  const results = cases.map((request) => {
    const result = resolveStructuredTableRequest(dataset, request)
    return { ...result, expected: request.expected, passed: matchesExpected(result, request.expected) }
  })
  const evaluation = {
    schemaVersion: '1.1',
    evaluationId: 'vm20-appendix2-structured-table-retrieval-2026-08-26',
    datasetId: dataset.datasetId,
    method: 'typed_structured_table_request_with_generic_row_role_dimension_version_authority_and_governance_resolution',
    queryCount: results.length,
    passedQueryCount: results.filter((result) => result.passed).length,
    failedQueryCount: results.filter((result) => !result.passed).length,
    supportedCanonicalCount: results.filter((result) => result.supportState === 'supported_canonical').length,
    unsupportedCount: results.filter((result) => result.supportState === 'unsupported').length,
    ambiguousCount: results.filter((result) => result.supportState === 'ambiguous').length,
    productionAnswerEligibleCount: results.filter((result) => result.productionAnswerEligible).length,
    status: results.every((result) => result.passed) ? 'passed' : 'failed',
    results,
    governanceNote: 'The reviewed table evidence is canonically promoted, but production-answer eligibility remains false because learner, application, RAG, and Copilot approval are separate governance decisions.',
  }
  await fs.writeFile(evaluationPath, `${JSON.stringify(evaluation, null, 2)}\n`, 'utf8')
  if (evaluation.status !== 'passed') throw new Error(`Structured table retrieval evaluation failed ${evaluation.failedQueryCount} query cases.`)

  const currentVersions = dataset.tables.map((table) => {
    const version = table.versions.find((item) => item.currentness === 'current_as_of_retrieval')
    return { tableLabel: table.tableLabel, tableId: table.tableId, versionId: version.versionId, asOfDate: version.asOfDate, effectiveDate: version.effectiveDate, currentnessBasis: version.currentnessBasis }
  })
  const unavailable = dataset.tableInventory.filter((item) => item.status === 'unavailable_on_current_official_page')
  const blockers = [
    { blockerId: 'source-average-row-regulatory-eligibility', status: 'closed', correction: 'All 27 source Average rows are labeled source_summary_statistic, regulatoryValueEligible false, and explicit_source_summary_only in retrieval units.' },
    { blockerId: 'table-j-manual-workbook-authority-boundary', status: 'closed', correction: 'Table J columns now carry separate regulatory measure, official workbook association, Manual table identity, and authority disclosure metadata.' },
  ]
  const reviewPackage = {
    schemaVersion: '1.1',
    reviewPackageId: 'vm20-appendix2-structured-table-review-package-2026-08-26',
    status: 'canonical_promoted', promoted: true, learnerFacing: false, appReady: false, ragReady: false, copilotExportEligible: false,
    promotionDecisionPath: 'data/manual-input/promotion-decisions/vm20-appendix2-structured-table-promotion.json',
    datasetPath: 'data/processed/structured_tables/vm20-appendix2-tables.json',
    schemaPath: 'data/schemas/structured-regulatory-table.schema.json',
    sourceQaPath: 'data/processed/review_packages/vm20-appendix2-structured-table-source-qa.json',
    retrievalEvaluationPath: 'data/processed/structured_tables/vm20-appendix2-retrieval-evaluation.json',
    blockerRegressionPath: 'data/processed/review_packages/vm20-appendix2-promotion-blocker-regression.json',
    blockerRegressionMarkdownPath: 'data/processed/review_packages/vm20-appendix2-promotion-blocker-regression.md',
    independentReviewPromptPath: 'data/processed/review_packages/vm20-appendix2-independent-review-prompt.md',
    scope: {
      included: 'Official workbooks currently linked by the NAIC for VM-20 Tables A, F, G, H, I, J, and K, including all dated sheets carried by those workbooks.',
      excluded: 'Tables B, C, D, E1, and E2 values; other VM tables; prose redesign; embeddings; databases; Copilot implementation; and downstream publication/export approval.',
      authorityBoundary: dataset.manualAuthority.authorityBoundary,
    },
    summary: dataset.summary,
    sourceArtifacts: dataset.sourceArtifacts,
    currentVersions,
    unavailableTables: unavailable,
    independentReviewHistory: [
      { decision: 'APPROVE WITH FIXES', reviewScope: 'Full source identity, 7,022-cell fidelity, version, retrieval, and governance review', acceptedFindings: 'Five workbook hashes matched; 7,022 / 7,022 values matched; two narrow semantic blockers identified.' },
      { decision: 'APPROVE FOR CANONICAL PROMOTION', reviewScope: 'Narrow final gate after the two semantic corrections', acceptedFindings: 'All prior fidelity findings remain valid; Average-row, Table J authority, note-scope, availability, and retrieval regressions passed with no further correction required.' },
    ],
    correctionsApplied: blockers,
    promotionReadiness: { blockersClosed: blockers.every((item) => item.status === 'closed'), remainingBlockerCount: 0, finalIndependentReviewComplete: true, approvedForCanonicalPromotion: true, promotionDecisionIncluded: true },
    fidelity: {
      sourceQaStatus: sourceQa.status,
      sourceWorkbooksHashMatched: sourceQa.sourceChecks.every((item) => item.hashMatched),
      exactValueCellsChecked: sourceQa.valueCellsChecked,
      formulaValueCellCount: sourceQa.formulaValueCellCount,
      legalDisclaimerSheetsRetained: sourceQa.legalDisclaimerSheetsRetained,
      citationGranularity: 'workbook + sheet + cell for values; printed and physical manual page ranges for methodology',
    },
    retrievalEvaluation: {
      status: evaluation.status, queryCount: evaluation.queryCount, passedQueryCount: evaluation.passedQueryCount,
      supportedCanonicalCount: evaluation.supportedCanonicalCount, unsupportedCount: evaluation.unsupportedCount,
      ambiguousCount: evaluation.ambiguousCount, productionAnswerEligibleCount: evaluation.productionAnswerEligibleCount,
      coveredBehaviors: ['exact row/value retrieval', 'historical and effective-date version selection', 'source-summary exclusion and explicit retrieval', 'Table J Manual/workbook authority', 'Table J note scope', 'column interpretation', 'table identity/currentness', 'applicability', 'methodology-versus-value routing', 'unavailable table handling', 'ambiguous measure handling', 'out-of-range dimensions', 'explicit source nulls'],
    },
    knownLimitations: [
      'Currentness is bounded to the NAIC current-data page and workbooks retrieved on 2026-08-26; later publications may supersede these versions.',
      'Table K is undated; it is labeled current-as-of-retrieval based on the official page rather than an inferred workbook date.',
      'Table A has no invented as-of or publication date; it retains its explicit June 30, 2026 effective date and current-as-of-retrieval status.',
      'Dedicated legal-disclaimer sheets do not expose disclaimer text as ordinary cells; preservation is by source workbook, hash, and sheet locator.',
      'Tables B, C, D, E1, and E2 are described in the Manual but were not available as current workbooks on the official page and are not reconstructed.',
    ],
    humanReview: {
      required: false,
      decisionOptions: ['APPROVE', 'APPROVE WITH FIXES', 'REPROCESS', 'REJECT'],
      finalDisposition: 'APPROVE FOR CANONICAL PROMOTION',
      promotionDecisionIncluded: true,
      reReviewTrigger: 'A source workbook hash, source value, row semantic, Table J authority boundary, source-note scope, or currentness/effective-date change.',
    },
  }
  await fs.writeFile(reviewJsonPath, `${JSON.stringify(reviewPackage, null, 2)}\n`, 'utf8')
  const lines = [
    '# VM-20 Appendix 2 Structured Table Review Package', '',
    '- Status: canonical promoted', '- Promoted: yes', '- Independent review: APPROVE FOR CANONICAL PROMOTION', '- Learner/app/RAG/Copilot eligible: no', '',
    '## Promotion blocker corrections', '', ...blockers.map((item) => `- **Closed - ${item.blockerId}:** ${item.correction}`), '',
    `- Remaining blockers from the independent review: ${reviewPackage.promotionReadiness.remainingBlockerCount}`,
    '- Final independent review complete: yes', '- Promotion decision included: yes', `- Promotion record: \`${reviewPackage.promotionDecisionPath}\``, '',
    '## Scope', '', reviewPackage.scope.included, '', `Excluded: ${reviewPackage.scope.excluded}`, '',
    '## Dataset counts', '',
    `- Logical tables ingested: ${dataset.summary.ingestedLogicalTableCount}`,
    `- Table versions: ${dataset.summary.tableVersionCount} (${dataset.summary.currentVersionCount} current-as-of-retrieval; ${dataset.summary.historicalSnapshotCount} historical)`,
    `- Rows: ${dataset.summary.rowCount} (${dataset.summary.regulatoryEligibleRowCount} prescribed-dimension; ${dataset.summary.sourceSummaryRowCount} source-summary)`,
    `- Values / retrieval units: ${dataset.summary.valueCount} / ${dataset.summary.retrievalUnitCount}`, '',
    '## Current-as-of-retrieval versions', '', '| Table | Version | As-of date | Effective date |', '| --- | --- | --- | --- |',
    ...currentVersions.map((item) => `| ${item.tableLabel} | \`${item.versionId}\` | ${item.asOfDate ?? 'undated'} | ${item.effectiveDate ?? 'n/a'} |`), '',
    '## Explicit unavailable-table boundary', '', ...unavailable.map((item) => `- Table ${item.tableLabel}: ${item.reason}`), '',
    '## Fidelity and citations', '',
    `- Source workbooks verified by SHA-256: ${sourceQa.sourceArtifactCount}/${sourceQa.sourceArtifactCount}`,
    `- Exact workbook cells checked in the accepted independent review and deterministic QA: ${sourceQa.valueCellsChecked}`,
    `- Formula-backed structured values: ${sourceQa.formulaValueCellCount}`,
    `- Legal-disclaimer sheets retained: ${sourceQa.legalDisclaimerSheetsRetained}`,
    '- Values retain workbook URL, sheet, range, source cell, raw typed value, display value, number format, unit, and exact-source fidelity.',
    '- Manual methodology and table identity remain distinct from official-workbook values, column labels, and workbook associations.', '',
    '## Retrieval evaluation', '',
    `- Status: ${evaluation.status}`, `- Cases passed: ${evaluation.passedQueryCount}/${evaluation.queryCount}`,
    `- Supported canonical / unsupported / ambiguous: ${evaluation.supportedCanonicalCount} / ${evaluation.unsupportedCount} / ${evaluation.ambiguousCount}`,
    `- Production-answer eligible: ${evaluation.productionAnswerEligibleCount}`,
    `- Focused regression: \`${reviewPackage.blockerRegressionMarkdownPath}\``, '',
    '## Known limitations', '', ...reviewPackage.knownLimitations.map((item) => `- ${item}`), '',
    '## Promotion record', '',
    `The final independent review approved this scope for canonical promotion. The decision is recorded at \`${reviewPackage.promotionDecisionPath}\`. The prior narrow-gate prompt remains at \`${reviewPackage.independentReviewPromptPath}\` as review history.`, '',
    'Canonical promotion does not authorize learner-facing, application, RAG, or Copilot use.', '',
  ]
  await fs.writeFile(reviewMdPath, lines.join('\n'), 'utf8')
  console.log(`Passed ${evaluation.passedQueryCount}/${evaluation.queryCount} structured-table retrieval cases.`)
  console.log('Built promoted VM-20 Appendix 2 structured-table review package.')
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
