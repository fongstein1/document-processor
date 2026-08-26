import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const datasetPath = path.join(repoRoot, 'data', 'processed', 'structured_tables', 'vm20-appendix2-tables.json')
const evaluationPath = path.join(repoRoot, 'data', 'processed', 'structured_tables', 'vm20-appendix2-retrieval-evaluation.json')
const sourceQaPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-structured-table-source-qa.json')
const reviewJsonPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-structured-table-review-package.json')
const reviewMdPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-structured-table-review-package.md')
const promptPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-independent-review-prompt.md')
const regressionPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-promotion-blocker-regression.json')
const regressionMdPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-appendix2-promotion-blocker-regression.md')
const schemaPath = path.join(repoRoot, 'data', 'schemas', 'structured-regulatory-table.schema.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const unique = (values, label) => assert(new Set(values).size === values.length, `Duplicate ${label}.`)

const main = async () => {
  for (const requiredPath of [datasetPath, evaluationPath, sourceQaPath, reviewJsonPath, reviewMdPath, promptPath, regressionPath, regressionMdPath, schemaPath]) await fs.access(requiredPath)
  const [dataset, evaluation, sourceQa, reviewPackage, regression] = await Promise.all([readJson(datasetPath), readJson(evaluationPath), readJson(sourceQaPath), readJson(reviewJsonPath), readJson(regressionPath)])
  assert(dataset.schemaVersion === '1.1', 'Unexpected structured-table schema version.')
  assert(dataset.governance.reviewOnly === true && dataset.governance.promotionStatus === 'not_promoted' && dataset.governance.learnerFacingAllowed === false && dataset.governance.appReadyAllowed === false && dataset.governance.ragReadyAllowed === false && dataset.governance.copilotExportEligible === false && dataset.governance.separateFromProseCorpus === true, 'Structured-table governance boundary failed.')
  assert(dataset.manualAuthority.sha256 === '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9', 'Manual authority hash mismatch.')
  assert(dataset.sourceArtifacts.length === 5, 'Expected five official workbook artifacts.')
  unique(dataset.sourceArtifacts.map((item) => item.sourceArtifactId), 'source artifact IDs')
  const artifactIds = new Set(dataset.sourceArtifacts.map((item) => item.sourceArtifactId))
  for (const artifact of dataset.sourceArtifacts) {
    assert(/^[a-f0-9]{64}$/.test(artifact.sha256), `Invalid source hash: ${artifact.sourceArtifactId}`)
    assert(!path.isAbsolute(artifact.repositoryWorkPath), `Machine-specific path in canonical artifact: ${artifact.sourceArtifactId}`)
    assert(artifact.legalDisclaimer.sheetName === 'LEGAL DISCLAIMER' && artifact.legalDisclaimer.retention === 'retained_by_original_workbook_hash_and_sheet_locator' && artifact.legalDisclaimer.extractedText === null, `Disclaimer retention mismatch: ${artifact.sourceArtifactId}`)
  }

  assert(dataset.tableInventory.length === 12, 'Appendix 2 inventory must include A-K with E1/E2 separately.')
  unique(dataset.tableInventory.map((item) => item.tableLabel), 'table inventory labels')
  const expectedInventory = ['A', 'B', 'C', 'D', 'E1', 'E2', 'F', 'G', 'H', 'I', 'J', 'K']
  assert(expectedInventory.every((label) => dataset.tableInventory.some((item) => item.tableLabel === label)), 'Table inventory is incomplete.')
  for (const label of ['B', 'C', 'D', 'E1', 'E2']) {
    const item = dataset.tableInventory.find((candidate) => candidate.tableLabel === label)
    assert(item.status === 'unavailable_on_current_official_page' && item.tableId === null, `Unavailable table was inferred or misclassified: ${label}`)
  }

  assert(dataset.tables.length === 7, 'Expected seven ingested logical tables.')
  unique(dataset.tables.map((item) => item.tableId), 'logical table IDs')
  const tableIds = new Set(dataset.tables.map((item) => item.tableId))
  const versionIds = []
  const rowIds = []
  let versionCount = 0
  let rowCount = 0
  let regulatoryEligibleRowCount = 0
  let sourceSummaryRowCount = 0
  let valueCount = 0
  const rowSemantics = new Map()
  for (const table of dataset.tables) {
    assert(artifactIds.has(table.sourceArtifactId), `Table source artifact does not resolve: ${table.tableId}`)
    assert(table.methodologyCitation.manualSha256 === dataset.manualAuthority.sha256, `Methodology hash mismatch: ${table.tableId}`)
    unique(table.dimensionDefinitions.map((item) => item.dimensionId), `${table.tableId} dimension IDs`)
    unique(table.columnDefinitions.map((item) => item.columnId), `${table.tableId} column IDs`)
    const dimensions = new Set(table.dimensionDefinitions.map((item) => item.dimensionId))
    const columns = new Set(table.columnDefinitions.map((item) => item.columnId))
    const current = table.versions.filter((item) => item.currentness === 'current_as_of_retrieval')
    assert(current.length === 1, `Table must have exactly one current-as-of-retrieval version: ${table.tableId}`)
    const dated = table.versions.filter((item) => item.asOfDate).sort((a, b) => a.asOfDate.localeCompare(b.asOfDate))
    if (dated.length > 0 && table.tableLabel !== 'A') assert(current[0].asOfDate === dated.at(-1).asOfDate, `Current version is not latest dated sheet: ${table.tableId}`)
    for (const version of table.versions) {
      versionCount += 1
      versionIds.push(version.versionId)
      assert(version.rowCount === version.rows.length, `Row count mismatch: ${version.versionId}`)
      assert(version.citation.sourceArtifactId === table.sourceArtifactId && version.citation.sheetName === version.sheetName && version.citation.cellRange === version.sourceRange, `Version citation mismatch: ${version.versionId}`)
      const versionSourceCells = []
      for (const row of version.rows) {
        rowCount += 1
        rowIds.push(row.rowId)
        assert(['prescribed_dimension_row', 'source_summary_statistic'].includes(row.rowRole), `Invalid row role: ${row.rowId}`)
        assert(typeof row.regulatoryValueEligible === 'boolean', `Missing regulatory eligibility: ${row.rowId}`)
        if (row.rowRole === 'source_summary_statistic') {
          sourceSummaryRowCount += 1
          assert(row.regulatoryValueEligible === false, `Source summary is regulatory eligible: ${row.rowId}`)
          assert(row.dimensions.some((item) => String(item.value).toLowerCase() === 'average'), `Source summary does not preserve its Average source label: ${row.rowId}`)
        } else {
          regulatoryEligibleRowCount += 1
          assert(row.regulatoryValueEligible === true, `Prescribed-dimension row is not regulatory eligible: ${row.rowId}`)
        }
        rowSemantics.set(row.rowId, { rowRole: row.rowRole, regulatoryValueEligible: row.regulatoryValueEligible })
        unique(row.dimensions.map((item) => item.dimensionId), `${row.rowId} dimensions`)
        assert(row.dimensions.every((item) => dimensions.has(item.dimensionId) && /^[A-Z]+\d+$/.test(item.sourceCell)), `Invalid row dimension: ${row.rowId}`)
        assert(row.values.length > 0, `Row has no values: ${row.rowId}`)
        unique(row.values.map((item) => item.columnId), `${row.rowId} columns`)
        for (const value of row.values) {
          valueCount += 1
          versionSourceCells.push(value.sourceCell)
          assert(columns.has(value.columnId), `Value column does not resolve: ${row.rowId}/${value.columnId}`)
          assert(/^[A-Z]+\d+$/.test(value.sourceCell), `Invalid value source cell: ${row.rowId}/${value.sourceCell}`)
          assert(value.fidelity === 'exact_source_cell_value', `Value fidelity mismatch: ${row.rowId}/${value.sourceCell}`)
          if (value.valueType === 'number') assert(typeof value.numericValue === 'number' && value.displayValue !== null, `Invalid numeric value: ${row.rowId}/${value.sourceCell}`)
          if (value.valueType === 'string') assert(typeof value.textValue === 'string' && value.displayValue !== null, `Invalid text value: ${row.rowId}/${value.sourceCell}`)
          if (value.valueType === 'null') assert(value.displayValue === null && value.nullReason === 'not_provided_in_source_cell', `Unexplained source null: ${row.rowId}/${value.sourceCell}`)
        }
      }
      unique(versionSourceCells, `${version.versionId} value source cells`)
    }
  }
  unique(versionIds, 'table version IDs')
  unique(rowIds, 'row IDs')
  assert(dataset.summary.tableInventoryCount === 12 && dataset.summary.ingestedLogicalTableCount === 7 && dataset.summary.unavailableLogicalTableCount === 5, 'Logical table summary mismatch.')
  assert(versionCount === 29 && dataset.summary.tableVersionCount === versionCount && dataset.summary.currentVersionCount === 7 && dataset.summary.historicalSnapshotCount === 22, 'Version summary mismatch.')
  assert(rowCount === 891 && dataset.summary.rowCount === rowCount, 'Row summary mismatch.')
  assert(regulatoryEligibleRowCount === 864 && dataset.summary.regulatoryEligibleRowCount === regulatoryEligibleRowCount, 'Regulatory-eligible row summary mismatch.')
  assert(sourceSummaryRowCount === 27 && dataset.summary.sourceSummaryRowCount === sourceSummaryRowCount, 'Source-summary row count mismatch.')
  assert(valueCount === 7022 && dataset.summary.valueCount === valueCount, 'Value summary mismatch.')
  assert(dataset.retrievalUnits.length === rowCount && dataset.summary.retrievalUnitCount === rowCount, 'Retrieval-unit count mismatch.')
  unique(dataset.retrievalUnits.map((item) => item.retrievalUnitId), 'retrieval unit IDs')
  assert(dataset.retrievalUnits.every((unit) => {
    const semantics = rowSemantics.get(unit.rowId)
    const expectedMode = semantics?.regulatoryValueEligible ? 'normal_regulatory_value' : 'explicit_source_summary_only'
    return tableIds.has(unit.tableId) && versionIds.includes(unit.versionId) && semantics && unit.rowRole === semantics.rowRole && unit.regulatoryValueEligible === semantics.regulatoryValueEligible && unit.retrievalMode === expectedMode && unit.reviewOnly === true && unit.citation?.sourceArtifactId
  }), 'Retrieval unit does not preserve row semantics or resolve to table evidence.')

  const tableA = dataset.tables.find((item) => item.tableLabel === 'A')
  const tableJ = dataset.tables.find((item) => item.tableLabel === 'J')
  assert(tableA.notes.some((note) => note.sourceCell === 'A28'), 'Table A effective-date note missing.')
  assert(tableJ.notes.some((note) => note.sourceCell === 'A38') && tableJ.notes.some((note) => note.sourceCell === 'A39'), 'Table J disclosure/short-tenor notes missing.')
  const tableJCurrent = tableJ.columnDefinitions.find((column) => column.columnId === 'current-swap-spread')
  const tableJLongTerm = tableJ.columnDefinitions.find((column) => column.columnId === 'long-term-swap-spread')
  assert(tableJCurrent.regulatoryMeasureId === 'current_benchmark_swap_spread' && tableJCurrent.workbookTableAssociation === 'Table J' && tableJCurrent.manualTableIdentity === null && tableJCurrent.authorityDisclosure.includes('does not assign'), 'Table J current-column authority boundary failed.')
  assert(tableJLongTerm.regulatoryMeasureId === 'long_term_benchmark_swap_spread' && tableJLongTerm.workbookTableAssociation === 'Table J' && tableJLongTerm.manualTableIdentity === 'Table J' && tableJLongTerm.authorityDisclosure.includes('Manual identifies Table J'), 'Table J long-term-column authority boundary failed.')
  const shortTenorNote = tableJ.notes.find((note) => note.noteId === 'short-tenor-current-sofr-source')
  assert(JSON.stringify(shortTenorNote.appliesTo) === JSON.stringify({ versionIds: ['vm20-table-j-2026-01-30'], columnIds: ['current-swap-spread'], dimensionValues: ['3M', '6M'] }), 'Table J short-tenor note scope failed.')
  assert(sourceQa.status === 'passed' && sourceQa.valueCellsChecked === valueCount && sourceQa.formulaValueCellCount === 0 && sourceQa.sourceChecks.every((item) => item.hashMatched), 'Workbook source QA did not pass all values.')
  assert(evaluation.status === 'passed' && evaluation.passedQueryCount === evaluation.queryCount && evaluation.queryCount >= 31 && evaluation.productionAnswerEligibleCount === 0, 'Structured retrieval evaluation failed or bypassed governance.')
  assert(evaluation.results.some((item) => item.reasonCode === 'methodology_routed_to_manual_prose') && evaluation.results.some((item) => item.reasonCode === 'current_table_not_available') && evaluation.results.some((item) => item.reasonCode === 'ambiguous_requires_more_context') && evaluation.results.some((item) => item.reasonCode === 'explicit_source_null') && evaluation.results.some((item) => item.reasonCode === 'table_version_not_yet_effective'), 'Retrieval battery does not cover required boundary cases.')
  for (const label of ['f', 'g', 'h', 'i', 'j']) {
    assert(evaluation.results.some((item) => item.queryId === `table-${label}-average-regulatory-exclusion` && item.reasonCode === 'source_summary_not_regulatory_dimension' && item.displayValue === null), `Missing regulatory Average-row exclusion for Table ${label.toUpperCase()}.`)
    assert(evaluation.results.some((item) => item.queryId === `table-${label}-average-explicit-source-summary` && item.evidenceClass === 'structured_table_source_summary' && item.regulatoryValueEligible === false), `Missing explicit Average-row retrieval for Table ${label.toUpperCase()}.`)
  }
  assert(evaluation.results.some((item) => item.queryId === 'table-j-current-short-tenor' && item.manualTableIdentity === null && item.regulatoryMeasureId === 'current_benchmark_swap_spread'), 'Table J current retrieval authority regression missing.')
  assert(evaluation.results.some((item) => item.queryId === 'table-j-long-term-short-tenor' && item.manualTableIdentity === 'Table J' && item.regulatoryMeasureId === 'long_term_benchmark_swap_spread'), 'Table J long-term retrieval authority regression missing.')
  assert(evaluation.results.some((item) => item.queryId === 'table-j-january-long-term-note-exclusion' && !item.applicableNoteIds.includes('short-tenor-current-sofr-source')) && evaluation.results.some((item) => item.queryId === 'table-j-january-unrelated-maturity-note-exclusion' && !item.applicableNoteIds.includes('short-tenor-current-sofr-source')) && evaluation.results.some((item) => item.queryId === 'table-j-later-version-note-exclusion' && item.applicableNoteIds.length === 0), 'Table J short-tenor note scope regressions missing.')
  assert(regression.status === 'passed' && regression.focusedQueryCount === 18 && regression.sourceFidelity?.sourceValueChangeCount === 0 && regression.sourceFidelity?.sourceArtifactHashChangeCount === 0 && regression.governance?.productionAnswerEligibleCount === 0, 'Focused promotion-blocker regression report failed.')
  assert(reviewPackage.status === 'review_only' && reviewPackage.promoted === false && reviewPackage.humanReview?.required === true && reviewPackage.humanReview?.promotionDecisionIncluded === false, 'Review package promotion guardrail failed.')
  assert(reviewPackage.independentReviewHistory?.some((item) => item.decision === 'APPROVE WITH FIXES') && reviewPackage.correctionsApplied?.length === 2 && reviewPackage.correctionsApplied.every((item) => item.status === 'closed') && reviewPackage.promotionReadiness?.remainingBlockerCount === 0 && reviewPackage.promotionReadiness?.readyForNarrowFinalReview === true && reviewPackage.promotionReadiness?.promotionDecisionIncluded === false, 'Review package does not close the two blockers while retaining the promotion gate.')
  const markdown = await fs.readFile(reviewMdPath, 'utf8')
  const prompt = await fs.readFile(promptPath, 'utf8')
  assert(markdown.includes('Remaining blockers from the independent review: 0') && markdown.includes('narrow final review pending') && prompt.includes('APPROVE WITH FIXES') && prompt.includes('Do not repeat the full 7,022-cell audit') && prompt.includes('Do not promote it during this review'), 'Narrow final review handoff is incomplete.')
  console.log(`Validated ${dataset.tables.length} logical tables, ${versionCount} versions, ${rowCount} rows, ${valueCount} values, and ${evaluation.queryCount} retrieval cases.`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
