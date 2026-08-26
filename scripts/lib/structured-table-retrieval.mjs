const dimensionValue = (row, dimensionId) => row.dimensions.find((item) => item.dimensionId === dimensionId)?.value

const selectVersion = (table, requestedAsOf) => {
  if (requestedAsOf && requestedAsOf !== 'current') return table.versions.find((version) => version.asOfDate === requestedAsOf) ?? null
  return table.versions.find((version) => version.currentness === 'current_as_of_retrieval') ?? null
}

const baseResult = (dataset, request) => ({
  queryId: request.queryId,
  queryText: request.queryText,
  intent: request.intent,
  datasetPromotionStatus: dataset.governance.promotionStatus,
  productionAnswerEligible: dataset.governance.promotionStatus === 'promoted',
  supportState: 'unsupported',
  reasonCode: 'unresolved_request',
  evidenceClass: null,
  tableId: null,
  versionId: null,
  rowId: null,
  columnId: request.columnId ?? null,
  displayValue: null,
  citation: null,
  noteId: null,
})

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
    return { ...result, supportState: 'supported_review_only', reasonCode: 'methodology_routed_to_manual_prose', evidenceClass: 'methodology_prose', citation: table.methodologyCitation }
  }
  if (request.intent === 'footnote') {
    const note = table.notes.find((item) => !request.noteId || item.noteId === request.noteId)
    if (!note) return { ...result, reasonCode: 'footnote_not_found' }
    return { ...result, supportState: 'supported_review_only', reasonCode: 'table_note_found', evidenceClass: 'structured_table_note', noteId: note.noteId, note, citation: table.methodologyCitation }
  }
  if (request.intent === 'applicability') {
    return { ...result, supportState: 'supported_review_only', reasonCode: 'table_identity_matched', evidenceClass: 'structured_table_identity', tableId: table.tableId, tableTitle: table.title, citation: table.methodologyCitation }
  }

  const tableVersion = selectVersion(table, request.asOfDate ?? 'current')
  if (!tableVersion) return { ...result, reasonCode: 'table_version_not_found' }
  result.versionId = tableVersion.versionId
  result.citation = tableVersion.citation

  if (request.intent === 'table_identity') {
    return { ...result, supportState: 'supported_review_only', reasonCode: 'table_version_found', evidenceClass: 'structured_table_identity', asOfDate: tableVersion.asOfDate, currentness: tableVersion.currentness }
  }
  if (request.intent === 'column_interpretation') {
    const column = table.columnDefinitions.find((item) => item.columnId === request.columnId)
    if (!column) return { ...result, reasonCode: 'column_not_found' }
    return { ...result, supportState: 'supported_review_only', reasonCode: 'column_definition_found', evidenceClass: 'structured_table_column', columnId: column.columnId, columnLabel: column.label }
  }
  if (request.intent === 'mapping_lookup') {
    if (!request.columnId || request.lookupValue === undefined) return { ...result, supportState: 'ambiguous', reasonCode: 'mapping_filter_missing' }
    const matches = tableVersion.rows.filter((row) => row.values.some((value) => value.columnId === request.columnId && String(value.displayValue).toLowerCase() === String(request.lookupValue).toLowerCase()))
    if (matches.length !== 1) return { ...result, supportState: matches.length > 1 ? 'ambiguous' : 'unsupported', reasonCode: matches.length > 1 ? 'mapping_not_unique' : 'mapping_value_not_found' }
    const row = matches[0]
    return { ...result, supportState: 'supported_review_only', reasonCode: 'mapping_row_found', evidenceClass: 'structured_table_row', rowId: row.rowId, mappedDimensions: row.dimensions }
  }
  if (request.intent !== 'row_value') return { ...result, reasonCode: 'unsupported_intent' }

  const requiredDimensions = table.dimensionDefinitions.filter((definition) => definition.lookupRequired !== false).map((definition) => definition.dimensionId)
  const filters = request.dimensions ?? {}
  const missing = requiredDimensions.filter((dimensionId) => filters[dimensionId] === undefined)
  if (missing.length > 0) return { ...result, supportState: 'ambiguous', reasonCode: 'required_dimension_missing', missingDimensions: missing }
  const rows = tableVersion.rows.filter((row) => requiredDimensions.every((dimensionId) => String(dimensionValue(row, dimensionId)).toLowerCase() === String(filters[dimensionId]).toLowerCase()))
  if (rows.length === 0) return { ...result, reasonCode: 'dimension_value_outside_table' }
  if (rows.length > 1) return { ...result, supportState: 'ambiguous', reasonCode: 'row_not_unique' }
  const row = rows[0]
  result.rowId = row.rowId
  if (!request.columnId) return { ...result, supportState: 'ambiguous', reasonCode: 'value_column_missing', candidateColumnIds: table.columnDefinitions.map((item) => item.columnId) }
  const value = row.values.find((item) => item.columnId === request.columnId)
  if (!value) return { ...result, reasonCode: 'column_value_not_found' }
  return {
    ...result,
    supportState: 'supported_review_only',
    reasonCode: value.valueType === 'null' ? 'explicit_source_null' : 'exact_structured_value_found',
    evidenceClass: 'structured_table_cell',
    displayValue: value.displayValue,
    valueType: value.valueType,
    unit: value.unit ?? table.units,
    sourceCell: value.sourceCell,
  }
}
