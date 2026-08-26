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
const schemaPath = path.join(repoRoot, 'data', 'schemas', 'structured-regulatory-table.schema.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const unique = (values, label) => assert(new Set(values).size === values.length, `Duplicate ${label}.`)

const main = async () => {
  for (const requiredPath of [datasetPath, evaluationPath, sourceQaPath, reviewJsonPath, reviewMdPath, promptPath, schemaPath]) await fs.access(requiredPath)
  const [dataset, evaluation, sourceQa, reviewPackage] = await Promise.all([readJson(datasetPath), readJson(evaluationPath), readJson(sourceQaPath), readJson(reviewJsonPath)])
  assert(dataset.schemaVersion === '1.0', 'Unexpected structured-table schema version.')
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
  let valueCount = 0
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
  assert(valueCount === 7022 && dataset.summary.valueCount === valueCount, 'Value summary mismatch.')
  assert(dataset.retrievalUnits.length === rowCount && dataset.summary.retrievalUnitCount === rowCount, 'Retrieval-unit count mismatch.')
  unique(dataset.retrievalUnits.map((item) => item.retrievalUnitId), 'retrieval unit IDs')
  assert(dataset.retrievalUnits.every((unit) => tableIds.has(unit.tableId) && versionIds.includes(unit.versionId) && rowIds.includes(unit.rowId) && unit.reviewOnly === true && unit.citation?.sourceArtifactId), 'Retrieval unit does not resolve to table evidence.')

  const tableA = dataset.tables.find((item) => item.tableLabel === 'A')
  const tableJ = dataset.tables.find((item) => item.tableLabel === 'J')
  assert(tableA.notes.some((note) => note.sourceCell === 'A28'), 'Table A effective-date note missing.')
  assert(tableJ.notes.some((note) => note.sourceCell === 'A38') && tableJ.notes.some((note) => note.sourceCell === 'A39'), 'Table J disclosure/short-tenor notes missing.')
  assert(sourceQa.status === 'passed' && sourceQa.valueCellsChecked === valueCount && sourceQa.formulaValueCellCount === 0 && sourceQa.sourceChecks.every((item) => item.hashMatched), 'Workbook source QA did not pass all values.')
  assert(evaluation.status === 'passed' && evaluation.passedQueryCount === evaluation.queryCount && evaluation.queryCount >= 12 && evaluation.productionAnswerEligibleCount === 0, 'Structured retrieval evaluation failed or bypassed governance.')
  assert(evaluation.results.some((item) => item.reasonCode === 'methodology_routed_to_manual_prose') && evaluation.results.some((item) => item.reasonCode === 'current_table_not_available') && evaluation.results.some((item) => item.supportState === 'ambiguous') && evaluation.results.some((item) => item.reasonCode === 'explicit_source_null'), 'Retrieval battery does not cover required boundary cases.')
  assert(reviewPackage.status === 'review_only' && reviewPackage.promoted === false && reviewPackage.humanReview?.required === true && reviewPackage.humanReview?.promotionDecisionIncluded === false, 'Review package promotion guardrail failed.')
  const markdown = await fs.readFile(reviewMdPath, 'utf8')
  const prompt = await fs.readFile(promptPath, 'utf8')
  assert(markdown.includes('Independent review: pending') && prompt.includes('APPROVE WITH FIXES') && prompt.includes('Do not promote'), 'Review handoff is incomplete.')
  console.log(`Validated ${dataset.tables.length} logical tables, ${versionCount} versions, ${rowCount} rows, ${valueCount} values, and ${evaluation.queryCount} retrieval cases.`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
