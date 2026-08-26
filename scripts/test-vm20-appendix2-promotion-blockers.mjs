import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const datasetPath = path.join(repoRoot, 'data', 'processed', 'structured_tables', 'vm20-appendix2-tables.json')
const evaluationPath = path.join(repoRoot, 'data', 'processed', 'structured_tables', 'vm20-appendix2-retrieval-evaluation.json')
const sourceQaPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-structured-table-source-qa.json')
const reportPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-promotion-blocker-regression.json')
const reportMarkdownPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-promotion-blocker-regression.md')

const acceptedValueProjectionSha256 = '683c77ce7ddc4b6d8add9e836fe592a2abd02dd7313e2fabac48d3c5ca1f6794'
const acceptedSourceHashes = {
  'table-a-workbook': 'd7364b3d08824cda3b5e285db9daebd2f175c0587752c82d92044e4f995cd847',
  'table-f-g-workbook': 'e1cf4ab5e98777390865559bd0df6d22f6b35d9dcc25ee24e738859218f8fdd7',
  'table-h-i-workbook': '5e2a1946b9d381b2e2c93f1e773e205a412093c4eb3cdfcbbafebc4ba63c1597',
  'table-j-workbook': 'fd51a9397ed8369a96ade1ffd32ae523683a1cdcc1ba38e02c948e4d2685bb3d',
  'table-k-workbook': '19a8628714606410c29c6573a8f8aba7139d88bea1ba883e64bcf13c60653758',
}

const requiredQueryIds = [
  ...['f', 'g', 'h', 'i', 'j'].flatMap((label) => [`table-${label}-average-regulatory-exclusion`, `table-${label}-average-explicit-source-summary`]),
  'table-j-current-short-tenor',
  'table-j-long-term-short-tenor',
  'table-j-ambiguous-measure',
  'table-j-january-current-note-scope',
  'table-j-january-long-term-note-exclusion',
  'table-j-january-unrelated-maturity-note-exclusion',
  'table-j-later-version-note-exclusion',
  'table-a-pre-effective-date',
]

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }

const valueProjection = (dataset) => {
  const records = []
  for (const table of dataset.tables) for (const version of table.versions) for (const row of version.rows) for (const value of row.values) {
    records.push([table.tableId, version.versionId, row.rowId, value.columnId, value.valueType, value.displayValue, value.sourceCell, value.numberFormat, value.fidelity, value.unit ?? null, value.numericValue ?? null, value.textValue ?? null, value.nullReason ?? null])
  }
  return { count: records.length, sha256: crypto.createHash('sha256').update(JSON.stringify(records)).digest('hex') }
}

const main = async () => {
  const [dataset, evaluation, sourceQa] = await Promise.all([readJson(datasetPath), readJson(evaluationPath), readJson(sourceQaPath)])
  const selectedResults = requiredQueryIds.map((queryId) => {
    const result = evaluation.results.find((item) => item.queryId === queryId)
    assert(result, `Missing focused regression query: ${queryId}`)
    assert(result.passed, `Focused regression query failed: ${queryId}`)
    return result
  })

  const allRows = dataset.tables.flatMap((table) => table.versions.flatMap((version) => version.rows))
  const summaryRows = allRows.filter((row) => row.rowRole === 'source_summary_statistic')
  const eligibleRows = allRows.filter((row) => row.regulatoryValueEligible)
  assert(allRows.length === 891, 'Row count changed from the independently reviewed baseline.')
  assert(summaryRows.length === 27 && summaryRows.every((row) => row.regulatoryValueEligible === false), 'Expected 27 ineligible source summary rows.')
  assert(eligibleRows.length === 864 && eligibleRows.every((row) => row.rowRole === 'prescribed_dimension_row'), 'Expected 864 prescribed-dimension rows.')
  assert(dataset.retrievalUnits.filter((unit) => unit.retrievalMode === 'explicit_source_summary_only').length === 27, 'Summary retrieval-unit mode count mismatch.')

  const tableJ = dataset.tables.find((table) => table.tableLabel === 'J')
  const currentColumn = tableJ.columnDefinitions.find((column) => column.columnId === 'current-swap-spread')
  const longTermColumn = tableJ.columnDefinitions.find((column) => column.columnId === 'long-term-swap-spread')
  assert(currentColumn.regulatoryMeasureId === 'current_benchmark_swap_spread' && currentColumn.workbookTableAssociation === 'Table J' && currentColumn.manualTableIdentity === null, 'Table J current-column authority boundary failed.')
  assert(longTermColumn.regulatoryMeasureId === 'long_term_benchmark_swap_spread' && longTermColumn.workbookTableAssociation === 'Table J' && longTermColumn.manualTableIdentity === 'Table J', 'Table J long-term-column authority boundary failed.')
  const shortTenorNote = tableJ.notes.find((note) => note.noteId === 'short-tenor-current-sofr-source')
  assert(JSON.stringify(shortTenorNote.appliesTo) === JSON.stringify({ versionIds: ['vm20-table-j-2026-01-30'], columnIds: ['current-swap-spread'], dimensionValues: ['3M', '6M'] }), 'Table J short-tenor note scope changed.')

  const projection = valueProjection(dataset)
  assert(projection.count === 7022 && projection.sha256 === acceptedValueProjectionSha256, 'One or more source-bound value records changed from the accepted independent-review baseline.')
  assert(dataset.sourceArtifacts.every((artifact) => acceptedSourceHashes[artifact.sourceArtifactId] === artifact.sha256), 'A source workbook hash changed from the accepted independent-review baseline.')
  assert(sourceQa.status === 'passed' && sourceQa.valueCellsChecked === 7022 && sourceQa.formulaValueCellCount === 0, 'Deterministic source-cell QA is not fully passing.')
  assert(dataset.governance.reviewOnly === false && dataset.governance.promotionStatus === 'promoted' && dataset.governance.learnerFacingAllowed === false && dataset.governance.appReadyAllowed === false && dataset.governance.ragReadyAllowed === false && dataset.governance.copilotExportEligible === false && evaluation.productionAnswerEligibleCount === 0, 'Canonical promotion or downstream eligibility boundary is incorrect.')

  const report = {
    schemaVersion: '1.0',
    reportId: 'vm20-appendix2-promotion-blocker-regression-2026-08-26',
    status: 'passed',
    datasetId: dataset.datasetId,
    focusedQueryCount: selectedResults.length,
    passedQueryCount: selectedResults.length,
    summaryRowSemantics: { totalRows: allRows.length, regulatoryEligibleRows: eligibleRows.length, sourceSummaryRows: summaryRows.length, explicitSummaryOnlyRetrievalUnits: 27 },
    tableJAuthorityBoundary: { currentColumn: { regulatoryMeasureId: currentColumn.regulatoryMeasureId, workbookTableAssociation: currentColumn.workbookTableAssociation, manualTableIdentity: currentColumn.manualTableIdentity }, longTermColumn: { regulatoryMeasureId: longTermColumn.regulatoryMeasureId, workbookTableAssociation: longTermColumn.workbookTableAssociation, manualTableIdentity: longTermColumn.manualTableIdentity }, shortTenorCurrentNoteScope: shortTenorNote.appliesTo },
    sourceFidelity: { valueRecordCount: projection.count, acceptedValueProjectionSha256, currentValueProjectionSha256: projection.sha256, sourceValueChangeCount: 0, sourceArtifactHashChangeCount: 0, formulaValueCellCount: sourceQa.formulaValueCellCount },
    governance: { reviewOnly: dataset.governance.reviewOnly, promotionStatus: dataset.governance.promotionStatus, productionAnswerEligibleCount: evaluation.productionAnswerEligibleCount },
    results: selectedResults.map(({ expected, ...result }) => result),
  }
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  const lines = [
    '# VM-20 Appendix 2 Promotion-Blocker Regression', '',
    '- Status: passed', `- Focused retrieval cases: ${report.passedQueryCount}/${report.focusedQueryCount}`,
    `- Prescribed-dimension rows / source-summary rows: ${eligibleRows.length} / ${summaryRows.length}`,
    `- Source-value changes: ${report.sourceFidelity.sourceValueChangeCount}`,
    `- Source workbook hashes changed: ${report.sourceFidelity.sourceArtifactHashChangeCount}`,
    `- Production-answer eligible results: ${report.governance.productionAnswerEligibleCount}`, '',
    '## Focused cases', '', '| Query ID | Result | Reason |', '| --- | --- | --- |',
    ...selectedResults.map((result) => `| \`${result.queryId}\` | ${result.supportState} | \`${result.reasonCode}\` |`), '',
    '## Gate conclusion', '',
    'Average rows are source-summary-only, Table J authority and January-note scope are explicit, Table A is blocked before its effective date, all source-value fingerprints and workbook hashes match the accepted baseline, and canonical promotion remains separate from downstream production eligibility.', '',
  ]
  await fs.writeFile(reportMarkdownPath, lines.join('\n'), 'utf8')
  console.log(`Passed ${selectedResults.length} focused VM-20 Appendix 2 promotion-blocker regressions.`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
