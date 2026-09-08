import crypto from 'node:crypto'

export const sha256 = (value) => crypto.createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex')
export const stableId = (...parts) => `seu-${sha256(parts.map((part) => String(part ?? '')).join('|')).slice(0, 24)}`
export const normalize = (value) => String(value ?? '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim()
export const unique = (values) => [...new Set(values)]

const cleanLine = (line) => normalize(line).replace(/^\[p\.\s*\d+\]\s*/i, '').trim()
const pageMarker = /^\[p\.\s*(\d+)\]/i
const tocLike = (text) => /table of contents/i.test(String(text).slice(0, 500))
const summaryIndexLike = (text) => /summary of changes/i.test(String(text).slice(0, 500))
const upperHeading = (line) => {
  const value = cleanLine(line)
  const letters = value.replace(/[^A-Za-z]/g, '')
  return value.length >= 4 && value.length <= 120 && letters.length >= 4 && letters === letters.toUpperCase() && !/[.;]$/.test(value) && !/^©|copyright|national association/i.test(value)
}

export const detectMajorPdfMarker = (text) => {
  if (tocLike(text) || summaryIndexLike(text)) return null
  const lines = String(text).split(/\n/).map(cleanLine).filter(Boolean).slice(0, 10)
  for (const line of lines) {
    let match = line.match(/^SSAP\s+(?:NO\.?\s*)?(\d+[A-Z]?)(?:\s*[—–:-]\s*|\s+STATEMENT\b|\s*$)/i)
    if (match) return { parentType: 'ssap', structuralIdentifier: `SSAP ${match[1].toUpperCase()}`, structuralLabel: line.slice(0, 160), detectionMethod: 'explicit_ssap_heading', confidence: 'high' }
    match = line.match(/^APPENDIX\s+([A-Z0-9]+)(?:\s*[—–:-]\s*(.*))?$/i)
    if (match && !/^(TO|OF)$/i.test(match[1])) return { parentType: 'appendix', structuralIdentifier: `APPENDIX ${match[1].toUpperCase()}`, structuralLabel: line.slice(0, 160), detectionMethod: 'explicit_appendix_heading', confidence: 'high' }
    match = line.match(/^SCHEDULE\s+([A-Z]{1,3}(?:\s*[-–—]\s*[A-Z0-9]+)?)(?:\s|$)/i)
    if (match && !/^(DETAILS?|INSTRUCTIONS?)$/i.test(match[1])) return { parentType: 'schedule', structuralIdentifier: `SCHEDULE ${match[1].toUpperCase().replace(/[–—]/g, '-')}`, structuralLabel: line.slice(0, 160), detectionMethod: 'explicit_schedule_heading', confidence: 'high' }
    match = line.match(/^SECTION\s+(\d+(?:\.\d+)*)(?:\s|$)/i)
    if (match) return { parentType: 'section', structuralIdentifier: `SECTION ${match[1]}`, structuralLabel: line.slice(0, 160), detectionMethod: 'explicit_section_heading', confidence: 'high' }
  }
  return null
}

export const detectPdfSubsection = (text, majorIdentifier = '') => {
  if (tocLike(text)) return null
  const lines = String(text).split(/\n/).map(cleanLine).filter(Boolean).slice(0, 50)
  for (const line of lines) {
    if (line.toUpperCase() === String(majorIdentifier).toUpperCase()) continue
    if (/^(SCOPE|SUMMARY CONCLUSION|DEFINITIONS?|DISCLOSURES?|RELEVANT LITERATURE|EFFECTIVE DATE|PURPOSE|GENERAL|INSTRUCTIONS?|REQUIREMENTS?)$/i.test(line) || upperHeading(line)) {
      return { parentType: 'subsection', structuralIdentifier: line.toUpperCase().slice(0, 100), structuralLabel: line.slice(0, 160), detectionMethod: 'bounded_heading_transition', confidence: 'medium' }
    }
  }
  return null
}

const numberedBoundary = (line) => /^\s*(?:\d+\.|\([a-z0-9ivx]+\)|[a-z]\.)\s+\S/i.test(line)
const definitionBoundary = (line) => /^\s*[“"]?[A-Z][^:\n]{1,80}[”"]?\s+(?:means|is defined as|shall mean)\b/i.test(line)
const bulletBoundary = (line) => /^\s*(?:[-•▪◦]|\([a-z0-9ivx]+\))\s+\S/i.test(line)
const tableLike = (text) => {
  const lines = String(text).split(/\n/).map(cleanLine).filter(Boolean)
  if (lines.some((line) => /(?:\.{5,}|_{5,})/.test(line))) return true
  const numeric = lines.filter((line) => (line.match(/\b\d+(?:\.\d+)?\b/g) || []).length >= 3).length
  return lines.length >= 3 && numeric / lines.length >= 0.45
}

export const classifyEvidenceRole = (text, { header = false } = {}) => {
  const value = normalize(text)
  if (header) return { role: 'HEADER_CONTEXT', confidence: 'high', detectionMethod: 'bounded_header_range' }
  if (/\b(except|unless|provided that|however|notwithstanding|qualification)\b/i.test(value)) return { role: 'EXCEPTION_OR_QUALIFICATION', confidence: 'medium', detectionMethod: 'deterministic_exception_cue' }
  if (/\b(scope|applicab|purpose|in general|govern)\b/i.test(value)) return { role: 'SCOPE_OR_APPLICABILITY', confidence: 'medium', detectionMethod: 'deterministic_scope_cue' }
  if (/\b(defined as|shall mean|means the|definition)\b/i.test(value) || definitionBoundary(value)) return { role: 'DEFINITION', confidence: 'medium', detectionMethod: 'deterministic_definition_cue' }
  if (/\b(table|schedule|worksheet|column|row|range)\b/i.test(value) || tableLike(value)) return { role: 'TABLE_OR_SCHEDULE', confidence: 'medium', detectionMethod: 'deterministic_table_cue' }
  if (/\b(reporting instruction|instructions? for|shall report|must report|reported on)\b/i.test(value)) return { role: 'REPORTING_INSTRUCTION', confidence: 'medium', detectionMethod: 'deterministic_reporting_cue' }
  if (/\b(shall|must|required|requirement)\b/i.test(value)) return { role: 'REQUIREMENT', confidence: 'medium', detectionMethod: 'deterministic_requirement_cue' }
  if (/\b(continued|continuation|carried forward|following page)\b/i.test(value)) return { role: 'CONTINUATION', confidence: 'low', detectionMethod: 'deterministic_continuation_cue' }
  return { role: 'OTHER', confidence: 'low', detectionMethod: 'deterministic_default' }
}

const semanticBoundary = (line) => numberedBoundary(line) || bulletBoundary(line) || definitionBoundary(line) || upperHeading(line)
const splitOversized = (text, maxChars) => {
  if (text.length <= maxChars) return [text]
  const sentences = text.split(/(?<=[.;:])\s+(?=[A-Z0-9(])/).filter(Boolean)
  const result = []; let current = ''
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence
    if (current && candidate.length > maxChars) { result.push(current); current = sentence } else current = candidate
  }
  if (current) result.push(current)
  return result
}

export const splitPdfSemanticUnits = (text, { minChars = 180, maxChars = 2200 } = {}) => {
  const rawLines = String(text).replace(/\r/g, '').split(/\n/)
  const lines = rawLines.map((line) => ({ raw: line, clean: cleanLine(line) })).filter((line) => line.clean && !pageMarker.test(line.clean))
  if (!lines.length) return []
  const preliminary = []; let current = []; let boundarySignals = 0
  for (const line of lines) {
    const boundary = semanticBoundary(line.clean)
    const currentLength = current.reduce((sum, item) => sum + item.clean.length + 1, 0)
    if (current.length && ((boundary && currentLength >= minChars) || currentLength + line.clean.length > maxChars)) {
      preliminary.push({ lines: current, structuralBoundary: boundary }); current = []
      if (boundary) boundarySignals += 1
    }
    current.push(line)
  }
  if (current.length) preliminary.push({ lines: current, structuralBoundary: false })
  const expanded = preliminary.flatMap((unit) => splitOversized(unit.lines.map((line) => line.clean).join('\n'), maxChars).map((part) => ({ text: normalize(part), structuralBoundary: unit.structuralBoundary }))).filter((unit) => unit.text)
  const merged = []
  for (const unit of expanded) {
    const role = classifyEvidenceRole(unit.text)
    const strong = role.role !== 'OTHER' || semanticBoundary(unit.text.split(/\n/)[0] || '')
    if (unit.text.length < minChars && !strong && merged.length) merged[merged.length - 1].text = normalize(`${merged[merged.length - 1].text}\n${unit.text}`)
    else merged.push({ ...unit, strong })
  }
  const compact = []; let pending = ''
  for (const unit of merged) {
    if (unit.text.length < Math.max(120, Math.floor(minChars * 0.66))) { pending = normalize(pending ? `${pending}\n${unit.text}` : unit.text); continue }
    const textWithLead = pending ? normalize(`${pending}\n${unit.text}`) : unit.text; pending = ''
    compact.push({ ...unit, text: textWithLead, strong: unit.strong || Boolean(textWithLead !== unit.text) })
  }
  if (pending) {
    if (compact.length && compact.at(-1).text.length + pending.length + 1 <= maxChars) compact.at(-1).text = normalize(`${compact.at(-1).text}\n${pending}`)
    else compact.push({ text: pending, structuralBoundary: false, strong: false })
  }
  return compact.map((unit) => {
    const role = classifyEvidenceRole(unit.text)
    let representation = 'STRUCTURAL_PARENT_PAGE_WINDOW_CHILD'
    if (role.role === 'DEFINITION') representation = 'SEMANTIC_DEFINITION_CHILD'
    else if (role.role === 'REQUIREMENT' && numberedBoundary(unit.text)) representation = 'SEMANTIC_NUMBERED_REQUIREMENT_CHILD'
    else if (role.role === 'TABLE_OR_SCHEDULE' && tableLike(unit.text)) representation = 'SEMANTIC_TABLE_CHILD'
    else if (role.role === 'REPORTING_INSTRUCTION') representation = 'SEMANTIC_INSTRUCTION_CHILD'
    else if (unit.strong) representation = 'SEMANTIC_PARAGRAPH_GROUP_CHILD'
    return { text: unit.text, role, representation, paragraphCount: Math.max(1, unit.text.split(/\n+/).filter(Boolean).length), detectionMethod: representation.startsWith('SEMANTIC_') ? 'multi_signal_structural_boundary' : 'source_page_window_fallback', confidence: representation.startsWith('SEMANTIC_') ? 'medium' : 'low' }
  })
}

export const parseCellRef = (ref) => {
  const match = String(ref).toUpperCase().match(/^([A-Z]{1,3})(\d+)$/)
  if (!match) return null
  let col = 0
  for (const char of match[1]) col = col * 26 + char.charCodeAt(0) - 64
  return { ref: `${match[1]}${Number(match[2])}`, col, colName: match[1], row: Number(match[2]) }
}
export const colName = (index) => { let n = index; let result = ''; while (n > 0) { n -= 1; result = String.fromCharCode(65 + n % 26) + result; n = Math.floor(n / 26) } return result }
export const parseWorkbookCells = (text) => {
  const pattern = /(?:^|\s)([A-Z]{1,3}\d+):\s*(.*?)(?=(?:\s+[A-Z]{1,3}\d+:)|$)/gs
  return [...String(text).matchAll(pattern)].map((match) => {
    const coordinate = parseCellRef(match[1]); const payload = match[2].trim()
    const formulaMatch = payload.match(/^formula=(.*?);\s*(.*)$/s)
    return { ...coordinate, formula: formulaMatch ? formulaMatch[1].trim() : null, value: (formulaMatch ? formulaMatch[2] : payload).trim(), raw: payload }
  }).filter((cell) => cell.ref)
}
export const serializeCells = (cells) => cells.map((cell) => `${cell.ref}: ${cell.formula ? `formula=${cell.formula}; ` : ''}${cell.value}`).join(' ')

const columnGroups = (cells) => {
  const columns = unique(cells.map((cell) => cell.col)).sort((a, b) => a - b)
  const groups = []; let current = []
  for (const column of columns) {
    if (current.length && column - current.at(-1) > 1) { groups.push(current); current = [] }
    current.push(column)
  }
  if (current.length) groups.push(current)
  return groups
}
const rowSignature = (cells) => ({ formula: cells.some((cell) => cell.formula), text: cells.some((cell) => cell.value && !Number.isFinite(Number(cell.value))), numeric: cells.some((cell) => Number.isFinite(Number(cell.value))) })
const determineHeaderRows = (cells, startRow, endRow) => {
  const result = []
  for (let row = startRow; row <= Math.min(endRow, startRow + 2); row += 1) {
    const rowCells = cells.filter((cell) => cell.row === row)
    if (!rowCells.length) continue
    const textCount = rowCells.filter((cell) => cell.value && !Number.isFinite(Number(cell.value))).length
    const numericCount = rowCells.filter((cell) => Number.isFinite(Number(cell.value))).length
    if (row === startRow || (numericCount === 0 && textCount > 0) || textCount >= Math.max(2, numericCount * 2)) result.push(row)
    else break
  }
  return result
}
const rangeIntersects = (range, bounds) => {
  const [left, right] = String(range).split(':').map(parseCellRef)
  if (!left || !right) return false
  return left.row <= bounds.rowEnd && right.row >= bounds.rowStart && left.col <= bounds.colEnd && right.col >= bounds.colStart
}

export const subdivideWorkbookBlock = ({ sourceId, sourceSha256, sourceFamilyId, documentType, authoritySupportRole, rightsStatus, oldParentId, sourceChunkId, sourceChunkOrdinal, sheetName, worksheetPath, worksheetOrder, sheetState, mergedRanges = [], reviewFlags = [], text, blockOrdinal = 1, rowWindow = 12 }) => {
  const cells = parseWorkbookCells(text)
  const groups = columnGroups(cells)
  const parents = []; const children = []; const headerContexts = []
  for (let groupOrdinal = 0; groupOrdinal < groups.length; groupOrdinal += 1) {
    const columns = groups[groupOrdinal]; const groupCells = cells.filter((cell) => columns.includes(cell.col))
    if (!groupCells.length) continue
    const rowStart = Math.min(...groupCells.map((cell) => cell.row)); const rowEnd = Math.max(...groupCells.map((cell) => cell.row)); const colStart = Math.min(...columns); const colEnd = Math.max(...columns)
    const parentId = stableId(sourceId, 'xlsx-parent', worksheetPath, blockOrdinal, groupOrdinal, rowStart, rowEnd, colStart, colEnd)
    const headerRows = determineHeaderRows(groupCells, rowStart, rowEnd)
    const headerCells = groupCells.filter((cell) => headerRows.includes(cell.row))
    const headerContextId = headerCells.length ? stableId(sourceId, 'xlsx-header', worksheetPath, blockOrdinal, groupOrdinal, headerRows.join(','), sha256(serializeCells(headerCells))) : null
    if (headerContextId) headerContexts.push({ headerContextId, parentId, sourceId, sourceSha256, sheetName, worksheetPath, worksheetOrder, rowStart: Math.min(...headerRows), rowEnd: Math.max(...headerRows), colStart: colName(colStart), colEnd: colName(colEnd), cellRefs: headerCells.map((cell) => cell.ref), contentHash: sha256(serializeCells(headerCells)), text: serializeCells(headerCells), role: 'HEADER_CONTEXT', confidence: 'high', detectionMethod: 'bounded_header_range', rightsStatus })
    const dataRows = unique(groupCells.filter((cell) => !headerRows.includes(cell.row)).map((cell) => cell.row)).sort((a, b) => a - b)
    const rowGroups = []
    if (!dataRows.length || rowEnd - rowStart + 1 <= 10) rowGroups.push(unique(groupCells.map((cell) => cell.row)).sort((a, b) => a - b))
    else {
      let current = []; let priorSignature = null
      for (const row of dataRows) {
        const rowCells = groupCells.filter((cell) => cell.row === row); const signature = rowSignature(rowCells)
        const patternChanged = priorSignature && signature.formula !== priorSignature.formula && current.length >= 3
        const separated = current.length && row > current.at(-1) + 1
        if (current.length && (current.length >= rowWindow || patternChanged || separated)) { rowGroups.push(current); current = [] }
        current.push(row); priorSignature = signature
      }
      if (current.length) rowGroups.push(current)
    }
    const childIds = []
    for (let childOrdinal = 0; childOrdinal < rowGroups.length; childOrdinal += 1) {
      const rows = rowGroups[childOrdinal]; const boundedCells = groupCells.filter((cell) => rows.includes(cell.row)); if (!boundedCells.length) continue
      const childRowStart = Math.min(...rows); const childRowEnd = Math.max(...rows); const body = serializeCells(boundedCells); const role = classifyEvidenceRole(body)
      const childId = stableId(sourceId, 'xlsx-child', parentId, childRowStart, childRowEnd, sha256(body)); childIds.push(childId)
      children.push({ childId, parentId, sourceId, sourceSha256, sourceFamilyId, documentType, authoritySupportRole, structuralType: rowGroups.length > 1 ? 'XLSX_BOUNDED_ROW_RANGE_CHILD' : 'XLSX_SMALL_BLOCK_SINGLE_CHILD', processingRepresentation: rowGroups.length > 1 ? 'XLSX_BOUNDED_ROW_RANGE_CHILD' : 'XLSX_SMALL_BLOCK_SINGLE_CHILD', sheetName, worksheetPath, worksheetOrder, sheetState, rowStart: childRowStart, rowEnd: childRowEnd, colStart: colName(colStart), colEnd: colName(colEnd), cellRefs: boundedCells.map((cell) => cell.ref), mergedRangeIntersections: mergedRanges.filter((range) => rangeIntersects(range, { rowStart: childRowStart, rowEnd: childRowEnd, colStart, colEnd })), nonEmptyCellCount: boundedCells.filter((cell) => cell.value || cell.formula).length, formulaCellCount: boundedCells.filter((cell) => cell.formula).length, valueCellCount: boundedCells.filter((cell) => cell.value).length, headerContextId, sourceChunkIds: [sourceChunkId], sourceChunkOrdinal, childOrdinal, semanticRole: role.role, roleConfidence: role.confidence, roleDetectionMethod: role.detectionMethod, reviewFlags, confidence: 'high', detectionMethod: rowGroups.length > 1 ? 'bounded_source_cells_with_row_pattern' : 'bounded_small_block', rightsStatus, contentHash: sha256(body), searchText: body, sourceTextExcerpt: body, headerText: headerCells.length ? serializeCells(headerCells) : '', citation: { worksheetPath, sheetName, rowStart: childRowStart, rowEnd: childRowEnd, colStart: colName(colStart), colEnd: colName(colEnd) }, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
    }
    parents.push({ parentId, parentParentId: null, sourceId, sourceSha256, sourceFamilyId, documentType, authoritySupportRole, hierarchyLevel: 1, parentType: 'workbook_table_block', structuralIdentifier: `${worksheetPath}|${blockOrdinal}|${groupOrdinal + 1}`, structuralLabel: sheetName || worksheetPath, sheetName, worksheetPath, worksheetOrder, sheetState, rowStart, rowEnd, colStart: colName(colStart), colEnd: colName(colEnd), cellRefs: groupCells.map((cell) => cell.ref), childIds, headerContextId, reviewFlags, confidence: 'high', detectionMethod: 'contiguous_column_group_and_table_block', rightsStatus, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false })
  }
  return { parents, children, headerContexts, parsedCellCount: cells.length }
}

const normalizeToken = (raw) => {
  const value = String(raw).toLowerCase().replace(/[–—]/g, '-')
  if (/^vm\s*-?\s*\d+[a-z]?$/.test(value)) return value.replace(/\s+/g, '').replace(/^vm(\d)/, 'vm-$1')
  if (/^ssap\s*-?\s*\d+[a-z]?$/.test(value)) return value.replace(/\s+/g, '').replace(/^ssap(\d)/, 'ssap-$1')
  return value.replace(/\s+/g, ' ')
}
export const regulatoryTokens = (value) => {
  const text = normalize(value).toLowerCase().replace(/vm\s*(\d+[a-z]?)/g, 'vm-$1').replace(/ssap\s*(?:no\.?\s*)?(\d+[a-z]?)/g, 'ssap-$1').replace(/table\s*([a-z])/g, 'table $1').replace(/schedule\s*([a-z]{1,3})/g, 'schedule $1')
  return (text.match(/vm-\d+[a-z]?|ssap-\d+[a-z]?|table [a-z]|schedule [a-z]{1,3}|\d+(?:\.\d+)+|\b(?:npr|dr|sr|pbr|vbt)\b|[a-z]{2,}|\d{4}\b/g) || []).map(normalizeToken)
}
export const meaningfulQueryPhrases = (query) => {
  const tokens = regulatoryTokens(query)
  const identifiers = tokens.filter((token) => /^(vm-|ssap-|table |schedule |\d+(?:\.\d+)+|npr$|dr$|sr$|pbr$|vbt$|\d{4}$)/.test(token))
  const pairs = tokens.slice(0, -1).map((token, index) => `${token} ${tokens[index + 1]}`).filter((phrase) => phrase.length >= 8)
  return unique([...identifiers, ...pairs])
}
export const phraseMatchCount = (query, document) => {
  const haystackTokens = regulatoryTokens(document); const haystack = ` ${haystackTokens.join(' ')} `
  return meaningfulQueryPhrases(query).filter((phrase) => haystack.includes(` ${phrase} `)).length
}

const fieldLength = (tokens) => tokens.length
export const makeFieldedBm25Index = (docs, fields, config) => {
  const prepared = docs.map((doc) => ({ doc, fieldTokens: Object.fromEntries(fields.map((field) => [field, regulatoryTokens(doc[field] || '')])) }))
  const df = new Map()
  for (const item of prepared) for (const token of unique(Object.values(item.fieldTokens).flat())) df.set(token, (df.get(token) || 0) + 1)
  const averageFieldLengths = Object.fromEntries(fields.map((field) => [field, prepared.reduce((sum, item) => sum + fieldLength(item.fieldTokens[field]), 0) / Math.max(prepared.length, 1)]))
  return { prepared, df, averageFieldLengths, fields, config }
}
export const scoreFieldedBm25 = (query, item, index) => {
  const queryTokens = unique(regulatoryTokens(query)); let score = 0; const components = {}
  for (const field of index.fields) {
    const tokens = item.fieldTokens[field]; const counts = new Map(); for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1)
    let fieldScore = 0
    for (const token of queryTokens) {
      const tf = counts.get(token) || 0; if (!tf) continue
      const observed = index.df.get(token) || 0
      const idf = Math.log(1 + (index.prepared.length - observed + 0.5) / (observed + 0.5))
      const norm = tf * (index.config.k1 + 1) / (tf + index.config.k1 * (1 - index.config.b + index.config.b * Math.max(tokens.length, 1) / Math.max(index.averageFieldLengths[field], 1)))
      fieldScore += idf * norm * (index.config.fieldWeights[field] ?? 1)
    }
    components[field] = fieldScore; score += fieldScore
  }
  return { score, components }
}
export const rankBm25 = (query, docs, index, { parentIndex = null, parentById = new Map(), parentWeight = 0, phraseWeight = 0 } = {}) => docs.map((doc, indexPosition) => {
  const child = scoreFieldedBm25(query, index.prepared[indexPosition], index)
  const parent = parentById.get(doc.parentId); const parentPrepared = parent && parentIndex ? parentIndex.prepared.find((item) => item.doc.parentId === parent.parentId) : null
  const parentScore = parentPrepared ? scoreFieldedBm25(query, parentPrepared, parentIndex).score : 0
  const phraseCount = phraseMatchCount(query, doc.body || doc.searchText || doc.sourceTextExcerpt || '')
  const finalScore = child.score + parentScore * parentWeight + phraseCount * phraseWeight
  return { doc, childBm25: child.score, fieldScores: child.components, parentBm25: parentScore, phraseMatchCount: phraseCount, finalScore }
}).filter((item) => item.finalScore > 0).sort((left, right) => right.finalScore - left.finalScore || String(left.doc.childId || left.doc.chunkId).localeCompare(String(right.doc.childId || right.doc.chunkId))).map((item, index) => ({ ...item, rank: index + 1 }))

export const classifyQueryIntent = (query) => {
  const value = normalize(query).toLowerCase()
  if (/\b(scope|applicab|purpose|govern)\b/.test(value)) return 'SCOPE'
  if (/\b(defin|means|defined term)\b/.test(value)) return 'DEFINITION'
  if (/\b(exception|except|unless|qualification)\b/.test(value)) return 'EXCEPTION'
  if (/\b(table|spread|range|cell|worksheet|schedule|header|column)\b/.test(value)) return 'TABLE'
  if (/\b(continu|following|above|below|across page)\b/.test(value)) return 'CONTINUATION'
  if (/\b(section|ssap|appendix|part)\b/.test(value)) return 'SECTION'
  return 'LOCAL'
}
const roleForIntent = { SCOPE: 'SCOPE_OR_APPLICABILITY', DEFINITION: 'DEFINITION', EXCEPTION: 'EXCEPTION_OR_QUALIFICATION', TABLE: 'HEADER_CONTEXT', CONTINUATION: 'CONTINUATION' }
export const expandRoleAwareContext = ({ query, selected, childrenByParent, parentById, headerById }) => {
  if (!selected) return { queryIntent: classifyQueryIntent(query), selectedChildId: null, contextEvidenceIds: [], contextRecords: [], bounded: true }
  const intent = classifyQueryIntent(query); const siblings = childrenByParent.get(selected.parentId) || []; const selectedIndex = siblings.findIndex((child) => child.childId === selected.childId); const desiredRole = roleForIntent[intent]
  const records = [{ evidenceId: selected.childId, role: selected.semanticRole, distance: 0, structuralRelationship: 'selected_child', reason: 'retrieval_selection' }]
  const parent = parentById.get(selected.parentId)
  if (desiredRole && parent?.parentContextId && parent.parentContextRole === desiredRole && selected.semanticRole !== desiredRole) records.push({ evidenceId: parent.parentContextId, role: desiredRole, distance: 0, structuralRelationship: 'bounded_parent_context', reason: `query_intent_${intent.toLowerCase()}` })
  if (intent === 'TABLE' && selected.headerContextId && headerById.has(selected.headerContextId)) records.push({ evidenceId: selected.headerContextId, role: 'HEADER_CONTEXT', distance: 0, structuralRelationship: 'same_parent_header', reason: 'query_intent_table' })
  else if (intent === 'CONTINUATION') {
    const neighbor = siblings[selectedIndex + 1] || siblings[selectedIndex - 1]
    if (neighbor) records.push({ evidenceId: neighbor.childId, role: neighbor.semanticRole, distance: 1, structuralRelationship: 'source_order_sibling', reason: 'query_intent_continuation' })
  } else if (desiredRole && desiredRole !== selected.semanticRole) {
    const candidates = siblings.map((child, index) => ({ child, distance: Math.abs(index - selectedIndex) })).filter((item) => item.child.semanticRole === desiredRole && item.distance <= 4).sort((a, b) => a.distance - b.distance || a.child.childId.localeCompare(b.child.childId))
    if (candidates[0]) records.push({ evidenceId: candidates[0].child.childId, role: desiredRole, distance: candidates[0].distance, structuralRelationship: 'same_parent_role_match', reason: `query_intent_${intent.toLowerCase()}` })
  }
  return { queryIntent: intent, selectedChildId: selected.childId, parentContextId: parent?.parentContextId || parent?.headerContextId || null, contextEvidenceIds: records.map((record) => record.evidenceId), contextRecords: records, bounded: records.length <= 3 }
}

export const reciprocalRank = (rank) => rank ? 1 / rank : 0
export const firstAcceptedRank = (ranked, acceptedIds) => ranked.find((item) => acceptedIds.includes(item.doc.childId || item.doc.chunkId))?.rank || null
export const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
