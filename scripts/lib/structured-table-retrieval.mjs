const dimensionValue = (row, dimensionId) => row.dimensions.find((item) => item.dimensionId === dimensionId)?.value

const selectVersion = (table, requestedAsOf) => {
  if (!requestedAsOf || requestedAsOf === 'current') {
    return { version: table.versions.find((version) => version.currentness === 'current_as_of_retrieval') ?? null, reasonCode: 'table_version_not_found' }
  }

  const exact = table.versions.find((version) => version.asOfDate === requestedAsOf)
  if (exact) {
    if (exact.effectiveDate && requestedAsOf < exact.effectiveDate) return { version: null, reasonCode: 'table_version_not_yet_effective', effectiveDate: exact.effectiveDate }
    return { version: exact, reasonCode: 'table_version_not_found' }
  }

  const undatedCurrent = table.versions.find((version) => version.asOfDate === null && version.currentness === 'current_as_of_retrieval')
  if (undatedCurrent) {
    if (undatedCurrent.effectiveDate && requestedAsOf < undatedCurrent.effectiveDate) return { version: null, reasonCode: 'table_version_not_yet_effective', effectiveDate: undatedCurrent.effectiveDate }
    return { version: undatedCurrent, reasonCode: 'table_version_not_found' }
  }
  return { version: null, reasonCode: 'table_version_not_found' }
}

const baseResult = (dataset, request) => ({
  queryId: request.queryId,
  queryText: request.queryText,
  intent: request.intent,
  datasetPromotionStatus: dataset.governance.promotionStatus,
  productionAnswerEligible: dataset.governance.promotionStatus === 'promoted' && dataset.governance.ragReadyAllowed === true,
  supportState: 'unsupported',
  reasonCode: 'unresolved_request',
  evidenceClass: null,
  tableId: null,
  versionId: null,
  rowId: null,
  rowRole: null,
  regulatoryValueEligible: null,
  columnId: request.columnId ?? null,
  displayValue: null,
  citation: null,
  noteId: null,
  applicableNoteIds: [],
  regulatoryMeasureId: null,
  workbookTableAssociation: null,
  manualTableIdentity: null,
  authorityDisclosure: null,
})

const authorityFields = (column) => ({
  regulatoryMeasureId: column?.regulatoryMeasureId ?? null,
  workbookTableAssociation: column?.workbookTableAssociation ?? null,
  manualTableIdentity: column?.manualTableIdentity ?? null,
  authorityDisclosure: column?.authorityDisclosure ?? null,
})

const supportedState = (dataset) => dataset.governance.promotionStatus === 'promoted' ? 'supported_canonical' : 'supported_review_only'

const noteAppliesToCell = (note, versionId, row, columnId) => {
  const appliesTo = note.appliesTo
  if (!appliesTo) return false
  if (appliesTo.versionIds && !appliesTo.versionIds.includes(versionId)) return false
  if (appliesTo.columnIds && !appliesTo.columnIds.includes(columnId)) return false
  if (appliesTo.dimensionValues) {
    const rowValues = row.dimensions.map((item) => String(item.value).toLowerCase())
    if (!appliesTo.dimensionValues.some((value) => rowValues.includes(String(value).toLowerCase()))) return false
  }
  return true
}

const candidateColumns = (table) => table.columnDefinitions.map((column) => ({
  columnId: column.columnId,
  columnLabel: column.label,
  ...authorityFields(column),
}))

export const resolveStructuredTableRequest = (dataset, request) => {
  const result = baseResult(dataset, request)
  const inventoryItem = dataset.tableInventory.find((item) => item.tableLabel === request.tableLabel)
  if (request.tableLabel && inventoryItem?.status === 'unavailable_on_current_official_page') {
    return { ...result, reasonCode: 'current_table_not_available', corpusGap: inventoryItem.reason }
  }

  let table = request.tableLabel ? dataset.tables.find((item) => item.tableLabel === request.tableLabel) : null
  if (request.intent === 'applicability' && !table) {
    const terms = (request.titleTerms ?? []).map((term) => term.toLowerCase())
    const ranked = dataset.tables.map((candidate) => ({ candidate, score: terms.filter((term) => `${candidate.title} ${candidate.description}`.toLowerCase().includes(term)).length })).sort((a, b) => b.score - a.score)
    if (!ranked[0] || ranked[0].score === 0 || ranked[0].score === ranked[1]?.score) return { ...result, supportState: 'ambiguous', reasonCode: 'table_identity_ambiguous' }
    table = ranked[0].candidate
  }
  if (!table) return { ...result, reasonCode: 'table_not_found' }
  result.tableId = table.tableId

  if (request.intent === 'methodology') {
    return { ...result, supportState: supportedState(dataset), reasonCode: 'methodology_routed_to_manual_prose', evidenceClass: 'methodology_prose', citation: table.methodologyCitation }
  }
  if (request.intent === 'footnote') {
    const note = table.notes.find((item) => !request.noteId || item.noteId === request.noteId)
    if (!note) return { ...result, reasonCode: 'footnote_not_found' }
    return { ...result, supportState: supportedState(dataset), reasonCode: 'table_note_found', evidenceClass: 'structured_table_note', noteId: note.noteId, note, citation: table.methodologyCitation }
  }
  if (request.intent === 'applicability') {
    return { ...result, supportState: supportedState(dataset), reasonCode: 'table_identity_matched', evidenceClass: 'structured_table_identity', tableId: table.tableId, tableTitle: table.title, citation: table.methodologyCitation }
  }

  const selection = selectVersion(table, request.asOfDate ?? 'current')
  if (!selection.version) return { ...result, reasonCode: selection.reasonCode, effectiveDate: selection.effectiveDate ?? null }
  const tableVersion = selection.version
  result.versionId = tableVersion.versionId
  result.citation = tableVersion.citation

  if (request.intent === 'table_identity') {
    return { ...result, supportState: supportedState(dataset), reasonCode: 'table_version_found', evidenceClass: 'structured_table_identity', asOfDate: tableVersion.asOfDate, effectiveDate: tableVersion.effectiveDate, currentness: tableVersion.currentness }
  }
  if (request.intent === 'column_interpretation') {
    const column = table.columnDefinitions.find((item) => item.columnId === request.columnId)
    if (!column) return { ...result, reasonCode: 'column_not_found' }
    return { ...result, supportState: supportedState(dataset), reasonCode: 'column_definition_found', evidenceClass: 'structured_table_column', columnId: column.columnId, columnLabel: column.label, ...authorityFields(column) }
  }
  if (request.intent === 'mapping_lookup') {
    if (!request.columnId || request.lookupValue === undefined) return { ...result, supportState: 'ambiguous', reasonCode: 'mapping_filter_missing' }
    const matches = tableVersion.rows.filter((row) => row.regulatoryValueEligible && row.values.some((value) => value.columnId === request.columnId && String(value.displayValue).toLowerCase() === String(request.lookupValue).toLowerCase()))
    if (matches.length !== 1) return { ...result, supportState: matches.length > 1 ? 'ambiguous' : 'unsupported', reasonCode: matches.length > 1 ? 'mapping_not_unique' : 'mapping_value_not_found' }
    const row = matches[0]
    return { ...result, supportState: supportedState(dataset), reasonCode: 'mapping_row_found', evidenceClass: 'structured_table_row', rowId: row.rowId, rowRole: row.rowRole, regulatoryValueEligible: row.regulatoryValueEligible, mappedDimensions: row.dimensions }
  }
  if (!['row_value', 'source_summary'].includes(request.intent)) return { ...result, reasonCode: 'unsupported_intent' }

  const requiredDimensions = table.dimensionDefinitions.filter((definition) => definition.lookupRequired !== false).map((definition) => definition.dimensionId)
  const filters = request.dimensions ?? {}
  const missing = requiredDimensions.filter((dimensionId) => filters[dimensionId] === undefined)
  if (missing.length > 0) return { ...result, supportState: 'ambiguous', reasonCode: 'required_dimension_missing', missingDimensions: missing }
  const dimensionMatches = tableVersion.rows.filter((row) => requiredDimensions.every((dimensionId) => String(dimensionValue(row, dimensionId)).toLowerCase() === String(filters[dimensionId]).toLowerCase()))
  let rows = dimensionMatches
  if (request.intent === 'source_summary') rows = rows.filter((row) => row.rowRole === 'source_summary_statistic' && row.regulatoryValueEligible === false)
  else rows = rows.filter((row) => row.regulatoryValueEligible === true)

  if (rows.length === 0 && request.intent === 'row_value' && dimensionMatches.some((row) => row.rowRole === 'source_summary_statistic')) {
    const summaryRow = dimensionMatches.find((row) => row.rowRole === 'source_summary_statistic')
    return {
      ...result,
      reasonCode: 'source_summary_not_regulatory_dimension',
      rowId: summaryRow.rowId,
      rowRole: summaryRow.rowRole,
      regulatoryValueEligible: false,
      disclosure: 'The matching workbook row is a source summary statistic, not a prescribed regulatory dimension. Request the source workbook summary explicitly to retrieve it.',
    }
  }
  if (rows.length === 0) return { ...result, reasonCode: request.intent === 'source_summary' ? 'source_summary_not_found' : 'dimension_value_outside_table' }
  if (rows.length > 1) return { ...result, supportState: 'ambiguous', reasonCode: 'row_not_unique' }
  const row = rows[0]
  result.rowId = row.rowId
  result.rowRole = row.rowRole
  result.regulatoryValueEligible = row.regulatoryValueEligible
  if (!request.columnId) {
    const measureColumns = table.columnDefinitions.filter((column) => column.regulatoryMeasureId)
    return { ...result, supportState: 'ambiguous', reasonCode: measureColumns.length > 1 ? 'ambiguous_requires_more_context' : 'value_column_missing', candidateColumns: candidateColumns(table) }
  }
  const column = table.columnDefinitions.find((item) => item.columnId === request.columnId)
  const value = row.values.find((item) => item.columnId === request.columnId)
  if (!value || !column) return { ...result, reasonCode: 'column_value_not_found' }
  const applicableNoteIds = table.notes.filter((note) => noteAppliesToCell(note, tableVersion.versionId, row, column.columnId)).map((note) => note.noteId)
  const sourceSummary = request.intent === 'source_summary'
  return {
    ...result,
    supportState: supportedState(dataset),
    reasonCode: sourceSummary ? 'source_summary_statistic_found' : value.valueType === 'null' ? 'explicit_source_null' : 'exact_structured_value_found',
    evidenceClass: sourceSummary ? 'structured_table_source_summary' : 'structured_table_cell',
    displayValue: value.displayValue,
    valueType: value.valueType,
    unit: value.unit ?? table.units,
    sourceCell: value.sourceCell,
    applicableNoteIds,
    disclosure: sourceSummary ? 'This value is the Average row shown in the source workbook. It is a source summary statistic and is not a prescribed regulatory dimension.' : null,
    ...authorityFields(column),
  }
}
