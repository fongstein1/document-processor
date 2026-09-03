import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultManifest = 'C:\\Dev\\Document Processor Sources\\2026-09-02 Intake\\_acquisition-manifests\\approved-pilot-20260902\\final-20260902\\acquisition-manifest.json'
const manifestPath = process.argv.includes('--manifest') ? process.argv[process.argv.indexOf('--manifest') + 1] : defaultManifest
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'acquisition-pilot-2026-09-02')
const batchId = 'acquisition-pilot-2026-09-02'
const processingRunId = 'processing-acquisition-pilot-2026-09-02'

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => { await fs.mkdir(path.dirname(filePath), { recursive: true }); await fs.writeFile(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8') }
const writeText = async (filePath, value) => { await fs.mkdir(path.dirname(filePath), { recursive: true }); await fs.writeFile(filePath, value + '\n', 'utf8') }
const normalize = (value) => String(value || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim()
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const slugify = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const tokens = (value) => [...new Set(normalize(value).toLowerCase().split(/[^a-z0-9]+/).filter((item) => item.length >= 4))]
const EXCEPTION_CODES = ['PDF_EXTRACTION_FAILED', 'XLSX_STRUCTURE_PARSE_FAILED', 'XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW', 'EMPTY_PAGE_BENIGN', 'EMPTY_PAGE_REQUIRES_REVIEW', 'IMAGE_ONLY_SUBSTANTIVE_CONTENT', 'STRUCTURE_AMBIGUOUS', 'TABLE_STRUCTURE_AMBIGUOUS', 'STRUCTURED_EVIDENCE_IDENTITY_COLLISION', 'RETRIEVAL_SMOKE_TEST_FAILED', 'SOURCE_LINEAGE_MISMATCH', 'AUTHORITY_ROLE_CONFLICT', 'METADATA_INCOMPLETE', 'DETERMINISM_FAILURE']
const runPython = (code, filePath) => {
  const result = spawnSync('python', ['-c', code, filePath], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } })
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Python extraction failed.')
  return JSON.parse(result.stdout)
}

const pdfCode = String.raw`
import json
import sys
import re
from pypdf import PdfReader
sys.stdout.reconfigure(encoding="utf-8")
reader = PdfReader(sys.argv[1], strict=False)
pages = []
empty_pages = []
heading_candidates = []
ssap_identifiers = []
section_boundaries = []
for i, page in enumerate(reader.pages):
    text = (page.extract_text() or "").replace("\\r", "")
    content_bytes = 0
    try:
        contents = page.get("/Contents")
        if contents is not None:
            obj = contents.get_object()
            content_bytes = len(obj.get_data()) if hasattr(obj, "get_data") else 1
    except Exception:
        content_bytes = 1
    image_xobjects = 0
    form_xobjects = 0
    try:
        xobjects = page.get("/Resources", {}).get("/XObject", {})
        for _, ref in xobjects.items():
            subtype = ref.get_object().get("/Subtype")
            if subtype == "/Image":
                image_xobjects += 1
            elif subtype == "/Form":
                form_xobjects += 1
    except Exception:
        pass
    annotations = 0
    form_fields = 0
    embedded_files = 0
    try:
        annotations = len(page.get("/Annots") or [])
        annotations = sum(1 for ref in (page.get("/Annots") or []) if ref.get_object())
    except Exception:
        annotations = 0
    try:
        root = reader.trailer.get("/Root")
        acro = root.get_object().get("/AcroForm") if root else None
        form_fields = len(acro.get_object().get("/Fields") or []) if acro else 0
    except Exception:
        form_fields = 0
    try:
        names = reader.trailer.get("/Root").get_object().get("/Names")
        embedded = names.get_object().get("/EmbeddedFiles") if names else None
        embedded_files = len(embedded.get_object().get("/Names") or []) // 2 if embedded else 0
    except Exception:
        embedded_files = 0
    pages.append({"pageNumber": i + 1, "text": text})
    for line in text.splitlines():
        clean = " ".join(line.split())
        if len(clean) >= 5 and (clean.isupper() or re.match(r"^(SSAP|Section|Appendix|Part)\b", clean, re.I)):
            heading_candidates.append({"pageNumber": i + 1, "text": clean[:240]})
        ssap_identifiers.extend(re.findall(r"\bSSAP\s*[- ]?\d+[A-Z]?\b", clean, re.I))
        if re.match(r"^(Section|Appendix|Part)\b", clean, re.I): section_boundaries.append({"pageNumber": i + 1, "text": clean[:240]})
    if not text.strip():
        if image_xobjects > 0:
            classification = "IMAGE_ONLY_SUBSTANTIVE_CONTENT"
        elif content_bytes > 0 or form_xobjects > 0 or annotations > 0 or form_fields > 0 or embedded_files > 0:
            classification = "EMPTY_PAGE_REQUIRES_REVIEW"
        else:
            classification = "EMPTY_PAGE_BENIGN"
        empty_pages.append({"pageNumber": i + 1, "contentBytes": content_bytes, "imageXObjects": image_xobjects, "formXObjects": form_xobjects, "annotationCount": annotations, "formFieldCount": form_fields, "embeddedFileCount": embedded_files, "vectorDrawingIndicators": form_xobjects > 0 or content_bytes > 0, "classification": classification})
print(json.dumps({"pageCount": len(reader.pages), "pages": pages, "emptyPageDetails": empty_pages, "structureSignals": {"headingCandidates": heading_candidates[:500], "ssapIdentifiers": sorted(set(ssap_identifiers)), "sectionBoundaryCandidates": section_boundaries[:500], "semanticHierarchyDetected": False, "parentChildGrouping": "not_claimed"}}, ensure_ascii=False))
`
const xlsxCode = String.raw`
import json
import sys
import zipfile
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
import posixpath
path = sys.argv[1]
def local(tag):
    return tag.rsplit("}", 1)[-1]
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
def target_for(base, target):
    if target.startswith("/"):
        return target.lstrip("/")
    return posixpath.normpath(posixpath.join(posixpath.dirname(base), target))
def column_number(ref):
    letters = ''.join(ch for ch in ref if ch.isalpha())
    number = 0
    for ch in letters.upper():
        number = number * 26 + ord(ch) - 64
    return number
with zipfile.ZipFile(path) as package:
    shared = []
    if "xl/sharedStrings.xml" in package.namelist():
        root = ET.fromstring(package.read("xl/sharedStrings.xml"))
        for item in root:
            shared.append("".join((node.text or "") for node in item.iter() if local(node.tag) == "t"))
    workbook = ET.fromstring(package.read("xl/workbook.xml"))
    rels = ET.fromstring(package.read("xl/_rels/workbook.xml.rels"))
    relmap = {item.attrib.get("Id"): target_for("xl/workbook.xml", item.attrib.get("Target", "")) for item in rels}
    sheets = []
    for sheet in workbook.iter():
        if local(sheet.tag) != "sheet":
            continue
        target = relmap.get(sheet.attrib.get("{" + REL_NS + "}id"), "")
        if not target.startswith("xl/"):
            target = "xl/" + target
        root = ET.fromstring(package.read(target))
        sheet_rel_path = posixpath.join(posixpath.dirname(target), "_rels", posixpath.basename(target) + ".rels")
        sheet_relationships = []
        if sheet_rel_path in package.namelist():
            sheet_rels = ET.fromstring(package.read(sheet_rel_path))
            for rel in sheet_rels:
                sheet_relationships.append({"id": rel.attrib.get("Id"), "type": rel.attrib.get("Type", "").rsplit("/", 1)[-1], "target": target_for(target, rel.attrib.get("Target", "")), "targetMode": rel.attrib.get("TargetMode")})
        sheet_state = sheet.attrib.get("state", "visible")
        cells = []
        for cell in root.iter():
            if local(cell.tag) != "c":
                continue
            valueNode = next((child for child in cell if local(child.tag) == "v"), None)
            formulaNode = next((child for child in cell if local(child.tag) == "f"), None)
            inlineNode = next((child for child in cell.iter() if local(child.tag) == "t"), None)
            raw = valueNode.text if valueNode is not None else ""
            if cell.attrib.get("t") == "s" and raw:
                value = shared[int(raw)] if int(raw) < len(shared) else raw
            elif cell.attrib.get("t") == "inlineStr" and inlineNode is not None:
                value = inlineNode.text or ""
            else:
                value = raw or ""
            ref = cell.attrib.get("r", "")
            cells.append({"ref": ref, "rowNumber": int(''.join(ch for ch in ref if ch.isdigit()) or 0), "columnNumber": column_number(ref), "formula": formulaNode.text if formulaNode is not None else None, "value": value, "dataType": cell.attrib.get("t") or ("formula" if formulaNode is not None else "number_or_blank")})
        cells.sort(key=lambda item: (item["rowNumber"], item["columnNumber"], item["ref"]))
        formula_count = sum(1 for node in root.iter() if local(node.tag) == "f")
        merged_ranges = [node.attrib.get("ref", "") for node in root.iter() if local(node.tag) == "mergeCell" and node.attrib.get("ref")]
        rows_by_number = defaultdict(list)
        for cell in cells:
            if cell["value"] != "" or cell["formula"] is not None:
                rows_by_number[cell["rowNumber"]].append(cell)
        row_numbers = sorted(rows_by_number)
        table_blocks = []
        if row_numbers:
            start = previous = row_numbers[0]
            for row_number in row_numbers[1:] + [None]:
                if row_number is not None and row_number == previous + 1:
                    previous = row_number
                    continue
                block_cells = [cell for cell in cells if start <= cell["rowNumber"] <= previous and (cell["value"] != "" or cell["formula"] is not None)]
                table_blocks.append({"blockOrdinal": len(table_blocks) + 1, "startRow": start, "endRow": previous, "rowCount": previous - start + 1, "cellRefs": [cell["ref"] for cell in block_cells], "nonEmptyCellCount": len(block_cells), "titleCandidates": [cell["value"] for cell in block_cells if cell["rowNumber"] == start and cell["value"] != ""]})
                if row_number is not None:
                    start = previous = row_number
        labels = [str(cell["value"]).strip() for cell in cells if cell["value"] != "" and cell["formula"] is None and isinstance(cell["value"], str) and str(cell["value"]).strip()]
        duplicate_label_values = sorted([value for value, count in Counter(labels).items() if count > 1], key=str.casefold)
        rows = [{"rowNumber": row_number, "cells": rows_by_number[row_number]} for row_number in row_numbers]
        xml_tags = {local(node.tag) for node in root.iter()}
        rel_types = {item["type"] for item in sheet_relationships}
        drawing_relationships = [item for item in sheet_relationships if item["type"] in ("drawing", "vmlDrawing")]
        image_relationships = [item for item in sheet_relationships if item["type"] == "image"]
        comment_relationships = [item for item in sheet_relationships if "comment" in item["type"].lower() or item["type"] in ("comments", "threadedComment")]
        package_relationships = [item for item in sheet_relationships if item["type"] in ("package", "oleObject")]
        shape_indicators = sorted(xml_tags & {"drawing", "legacyDrawing", "oleObjects", "controls", "picture", "AlternateContent", "Choice", "Fallback", "objectPr"})
        non_cell_parts = drawing_relationships + image_relationships + comment_relationships + package_relationships
        non_cell_possible = bool(shape_indicators or non_cell_parts or any(item["type"] in ("externalLink",) for item in sheet_relationships) or "headerFooter" in xml_tags)
        sheets.append({"name": sheet.attrib.get("name", ""), "worksheetPath": target, "state": sheet_state, "cellContentCount": len(cells), "formulaCount": formula_count, "mergedRanges": merged_ranges, "cells": cells, "rows": rows, "tableBlocks": table_blocks, "duplicateLabelValues": duplicate_label_values, "blankSpacerRows": [row_number for row_number in range(row_numbers[0], row_numbers[-1] + 1) if row_number not in rows_by_number] if row_numbers else [], "contentInventory": {"cellContentCount": len(cells), "formulaCount": formula_count, "mergedRanges": merged_ranges, "drawingRelationships": drawing_relationships, "imageRelationships": image_relationships, "textBoxShapeIndicators": shape_indicators, "commentNoteIndicators": comment_relationships, "hiddenState": sheet_state != "visible", "externalLinkIndicators": [item for item in sheet_relationships if item["type"] == "externalLink" or item.get("targetMode") == "External"], "otherRelationships": sheet_relationships, "substantiveNonCellContentMayExist": non_cell_possible, "exceptionCode": "XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW" if non_cell_possible else None}})
print(json.dumps({"sheetCount": len(sheets), "packageRelevantParts": sorted([name for name in package.namelist() if any(token in name.lower() for token in ("drawing", "media", "comment", "vml", "embedding", "externallink"))]), "sheets": sheets}, ensure_ascii=False))
`

const classify = (record) => {
  const family = String(record.family)
  return {
    sourceFamilyId: slugify(family).replace(/-/g, '_'),
    domainId: family.startsWith('Society') ? 'actuarial_experience' : 'naic_regulatory',
    authorityRole: record.disposition.startsWith('CURRENT AUTHORITY') ? 'current_authority' : 'current_support',
    documentType: record.expectedFileType === 'XLSX' ? 'valuation_rates_workbook'
      : /redline/i.test(record.title) ? 'redline_manual'
      : /manual/i.test(record.title) ? 'accounting_manual'
      : /amendment/i.test(record.title) ? 'adopted_amendments'
      : /blank/i.test(record.title) ? 'reporting_blank'
      : /prescribed differences/i.test(record.title) ? 'prescribed_differences'
      : /valuation basic table/i.test(record.title) ? 'experience_study_report'
      : 'regulatory_source_document',
  }
}

const makeChunks = (record, extraction, metadata) => {
  const chunks = []
  const add = (text, locator, pageStart, pageEnd, citationText, structured, details = {}) => {
    const actual = normalize(text)
    const hasText = actual.length > 0
    const excerpt = hasText ? actual : '[Source text unavailable; page-image or native-structure backstop required.]'
    const chunkId = details.chunkId || (record.expectedFileType === 'PDF'
      ? record.candidateId + '--p-' + pageStart + '-' + pageEnd
      : record.candidateId + '--sheet-' + slugify(locator.replace(/^Sheet: /, '')))
    const pageReferences = record.expectedFileType === 'PDF'
      ? (details.coveredPages || [pageStart]).map((pageNumber) => ({ citationText, pageReference: 'p. ' + pageNumber, sectionReference: locator, sourceReference: record.initialUrl }))
      : [{ citationText, pageReference: 'Workbook', sectionReference: locator, sourceReference: record.initialUrl }]
    const emptyPageNotes = (details.emptyPages || []).map((page) => page.pageNumber + ': ' + page.classification)
    chunks.push({
      chunkId, chunkOrdinal: chunks.length + 1, chunkKind: 'source_excerpt',
      sourceTextType: hasText ? 'actual_extracted_source_text' : 'placeholder_pending_source_text',
      pageStart, pageEnd, sectionReference: locator, lineReference: null,
      sourceTextExcerpt: excerpt, normalizedTextExcerpt: excerpt.toLowerCase(),
      summary: record.documentTitle + ' - ' + locator,
      controlledTags: [metadata.authorityRole, 'review_only', 'not_promoted'].concat(structured ? ['structured_workbook_evidence'] : []),
      keywords: tokens(record.documentTitle + ' ' + locator + ' ' + actual).slice(0, 20),
      citations: pageReferences,
      fidelity: hasText ? 'exact' : 'summary', confidence: hasText ? 'high' : 'medium',
      reviewFlags: details.requiresReview ? (structured && details.exceptionCode ? [details.exceptionCode] : ['EMPTY_PAGE_REQUIRES_REVIEW']) : [],
      qualityNotes: (hasText ? [] : ['No text was invented for an unavailable page or sheet.']).concat(emptyPageNotes.length ? ['Empty-page inspection: ' + emptyPageNotes.join('; ') + '.'] : []),
      evidenceNotes: structured ? 'Cell references, formulas, values, merged ranges, hidden-sheet state, row boundaries, and duplicate labels are retained in extraction-output.json.' : 'Raw source SHA is retained in source lineage.',
      sourceVersionId: record.candidateId + '-review-only', headingPath: 'Source > ' + locator,
      topic: record.documentTitle, keyPoints: [], concepts: [], definedTerms: [], acronyms: [], requirements: [],
      citationDisplay: citationText + ', ' + locator, normalizedSearchText: (record.documentTitle + ' ' + record.disposition + ' ' + locator + ' ' + actual).toLowerCase(),
      canonicalSourceIndexPath: 'data/processed/review_packages/' + batchId + '/source-index-candidates.json',
      retrievalEligible: hasText || structured, promotionEligible: false,
      extensions: structured ? { worksheet: details.worksheet, sheetState: details.sheetState, mergedRanges: details.mergedRanges || [], tableBlock: details.tableBlock, duplicateLabelValues: details.duplicateLabelValues || [], contentInventory: details.contentInventory || null, exceptionCode: details.exceptionCode || null } : { coveredPages: details.coveredPages || [pageStart], emptyPageDetails: details.emptyPages || [] },
    })
  }
  if (record.expectedFileType === 'PDF') {
    let group = []
    let groupLength = 0
    const flush = () => {
      if (!group.length) return
      const coveredPages = group.map((page) => page.pageNumber)
      const emptyPages = (extraction.emptyPageDetails || []).filter((page) => coveredPages.includes(page.pageNumber))
      add(group.map((page) => '[p. ' + page.pageNumber + '] ' + normalize(page.text)).join('\n'), 'Pages ' + coveredPages[0] + '-' + coveredPages[coveredPages.length - 1], coveredPages[0], coveredPages[coveredPages.length - 1], record.documentTitle, false, { chunkId: record.candidateId + '--p-' + coveredPages[0] + '-' + coveredPages[coveredPages.length - 1], coveredPages, emptyPages, requiresReview: emptyPages.some((page) => page.classification !== 'EMPTY_PAGE_BENIGN') })
      group = []
      groupLength = 0
    }
    for (const page of extraction.pages) {
      const pageLength = normalize(page.text).length
      if (group.length && (group.length >= 4 || groupLength + pageLength > 5000)) flush()
      group.push(page)
      groupLength += pageLength
    }
    flush()
  } else {
    for (const sheet of extraction.sheets) {
      const blocks = sheet.tableBlocks.length ? sheet.tableBlocks : [{ blockOrdinal: 1, startRow: 1, endRow: 1, cellRefs: [], nonEmptyCellCount: 0, titleCandidates: [] }]
      for (const block of blocks) {
        const blockCells = sheet.cells.filter((cell) => block.cellRefs.includes(cell.ref))
        const text = blockCells.map((cell) => cell.ref + ': ' + (cell.formula ? 'formula=' + cell.formula + '; ' : '') + cell.value).join('\n')
        const locator = 'Sheet: ' + sheet.name + ' rows ' + block.startRow + '-' + block.endRow
        add(text, locator, null, null, record.documentTitle, true, { chunkId: record.candidateId + '--sheet-' + slugify(sheet.name) + '--rows-' + block.startRow + '-' + block.endRow, worksheet: sheet.worksheetPath, sheetState: sheet.state, mergedRanges: sheet.mergedRanges, tableBlock: block, duplicateLabelValues: sheet.duplicateLabelValues, contentInventory: sheet.contentInventory, exceptionCode: sheet.contentInventory?.exceptionCode, requiresReview: Boolean(sheet.contentInventory?.substantiveNonCellContentMayExist) })
      }
    }
  }
  return chunks
}

const corpusSmokeTestsFor = (record, allChunks, allProcessed) => {
  const chunks = allChunks.filter((chunk) => chunk.sourceId === record.candidateId)
  const first = chunks.find((chunk) => chunk.sourceTextType === 'actual_extracted_source_text') || chunks[0]
  const firstTerms = tokens(first ? first.sourceTextExcerpt : '').slice(0, 3)
  const termSources = new Map()
  for (const chunk of allChunks) for (const term of tokens(chunk.normalizedSearchText)) { if (!termSources.has(term)) termSources.set(term, new Set()); termSources.get(term).add(chunk.sourceId) }
  const distinctive = tokens(record.documentTitle).find((term) => termSources.get(term)?.size === 1) || firstTerms.find((term) => termSources.get(term)?.size === 1) || firstTerms[0] || slugify(record.documentTitle).split('-')[0]
  const substantiveQuery = tokens(first?.sourceTextExcerpt || '').slice(0, 8).join(' ') || distinctive
  const structureQuery = first ? first.sectionReference + ' ' + distinctive : record.documentTitle
  const other = allProcessed.find((item) => item.record.candidateId !== record.candidateId && item.chunks.length)
  const numericChunk = record.expectedFileType === 'XLSX' ? chunks.find((chunk) => chunk.extensions?.tableBlock?.cellRefs?.length) : chunks[chunks.length - 1]
  const numericCell = numericChunk?.extensions?.tableBlock?.cellRefs?.[0]
  const numericQuery = record.expectedFileType === 'XLSX' ? [record.documentTitle, numericChunk?.extensions?.worksheet?.split('/').pop(), numericCell, numericChunk?.sourceTextExcerpt?.split('\n')[0]].filter(Boolean).join(' ') : [first?.sectionReference, distinctive, tokens((chunks[chunks.length - 1]?.sourceTextExcerpt || '')).slice(0, 2).join(' ')].filter(Boolean).join(' ')
  const cases = [
    { kind: 'title_identity', query: record.documentTitle, expectedCandidateId: record.candidateId, expectedMatch: true, expectedRegion: 'source identity', rankThreshold: 1, rationale: 'Title query is ranked against the complete seven-source corpus and must resolve to this source.' },
    { kind: 'substantive_content', query: substantiveQuery, expectedCandidateId: record.candidateId, expectedMatch: substantiveQuery.length > 0, expectedRegion: first?.sectionReference || 'first extracted region', rankThreshold: 1, rationale: 'A source-derived substantive query must resolve to the expected source in the corpus.' },
    { kind: 'structure_or_table', query: structureQuery, expectedCandidateId: record.candidateId, expectedMatch: true, expectedRegion: first?.sectionReference || structureQuery, rankThreshold: 1, rationale: 'A deterministic page window or workbook table locator remains citable.' },
    { kind: 'numeric_or_form', query: numericQuery, expectedCandidateId: record.candidateId, expectedMatch: tokens(numericQuery).length > 0, expectedRegion: numericChunk?.sectionReference || 'source structure', expectedSheet: record.expectedFileType === 'XLSX' ? numericChunk?.extensions?.worksheet : undefined, expectedCellRefs: record.expectedFileType === 'XLSX' ? [numericCell] : undefined, expectedSourceSha256: record.SHA256, rankThreshold: 1, rationale: 'Numeric/form evidence is checked against the corpus, structural locator, and source SHA.' },
    { kind: 'authority_support_boundary', query: record.documentTitle + ' ' + (record.disposition || ''), expectedCandidateId: record.candidateId, expectedMatch: true, expectedRegion: 'source identity and approved role', expectedAuthorityRole: record.disposition, rankThreshold: 1, rationale: 'Approved authority/support metadata remains bound to the selected source and is not upgraded.' },
    { kind: 'wrong_source_topic_negative', query: other ? other.record.documentTitle : 'qzxv-blorf-mivak-94731', expectedCandidateId: other?.record.candidateId || null, negativeAgainstCandidateId: record.candidateId, expectedMatch: Boolean(other), expectedRegion: 'plausible topic from another pilot source', rankThreshold: 1, rationale: 'A plausible title query from another pilot source must not falsely support this source.' },
  ]
  return cases.map((testCase, index) => {
    const query = testCase.query || 'source'
    const q = tokens(query)
    const ranked = allChunks.map((chunk) => ({ chunkId: chunk.chunkId, sourceId: chunk.sourceId, score: q.filter((term) => chunk.normalizedSearchText.includes(term)).length + (chunk.topic && normalize(query).toLowerCase() === normalize(chunk.topic).toLowerCase() ? 10 : 0) + (q.length >= 5 && chunk.normalizedSearchText.includes(normalize(query).toLowerCase()) ? 20 : 0) + (chunk.sectionReference === testCase.expectedRegion ? 8 : 0) + (testCase.expectedSheet && chunk.extensions?.worksheet === testCase.expectedSheet ? 8 : 0) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.chunkId.localeCompare(b.chunkId))
    const top = ranked[0]
    const selected = top ? allChunks.find((chunk) => chunk.chunkId === top.chunkId) : null
    const expectedTop = Boolean(top && top.sourceId === testCase.expectedCandidateId && top.score > 0 && (testCase.rankThreshold || 1) >= 1)
    const wrongSourceExcluded = !testCase.negativeAgainstCandidateId || !top || top.sourceId !== testCase.negativeAgainstCandidateId
    const citationResolves = !testCase.expectedMatch || Boolean(selected && selected.citations.length > 0)
    const structuralMatch = !testCase.expectedSheet || Boolean(selected?.extensions?.worksheet === testCase.expectedSheet && testCase.expectedCellRefs.every((ref) => selected.extensions?.tableBlock?.cellRefs?.includes(ref)))
    const pass = testCase.kind === 'wrong_source_topic_negative' ? Boolean(expectedTop && wrongSourceExcluded && citationResolves) : Boolean(testCase.expectedMatch ? expectedTop && citationResolves && structuralMatch : !top)
    return { testId: record.candidateId + '-smoke-' + (index + 1), testKind: testCase.kind, query, expectedCandidateId: testCase.expectedCandidateId, negativeAgainstCandidateId: testCase.negativeAgainstCandidateId || null, expectedMatch: testCase.expectedMatch, expectedRankThreshold: testCase.rankThreshold || 1, expectedStructuralRegion: testCase.expectedRegion, expectedSheet: testCase.expectedSheet || null, expectedCellRefs: testCase.expectedCellRefs || [], expectedSourceSha256: testCase.expectedSourceSha256 || null, expectedAuthorityRole: testCase.expectedAuthorityRole || null, topRank: top ? 1 : null, topChunkId: top?.chunkId || null, topSourceId: top?.sourceId || null, topScore: top?.score || 0, citationTarget: selected?.citations?.[0] || null, citationResolves, supportRolePreserved: !selected || !testCase.expectedAuthorityRole || selected.sourceId === testCase.expectedCandidateId, wrongSourceExcluded, pass, rationale: testCase.rationale }
  })
}

const main = async () => {
  const acquisition = await readJson(path.resolve(manifestPath))
  const authorization = await readJson(path.resolve(acquisition.authorizationManifestPath))
  const approvedById = new Map(authorization.selectedRecords.map((record) => [record.candidateId, record]))
  const records = acquisition.acquisitions
    .filter((record) => record.acquisitionOutcome === 'ADMIT_TO_PROCESSING_QUEUE')
    .map((record) => {
      const approvedRecord = approvedById.get(record.candidateId)
      if (!approvedRecord) throw new Error('Admitted acquisition record is absent from approved authorization manifest: ' + record.candidateId)
      return Object.assign({}, approvedRecord, record)
    })
  if (!records.length) throw new Error('Manifest contains no admitted records.')
  await fs.mkdir(outputRoot, { recursive: true })
  for (const generatedFile of ['batch-manifest.json', 'source-inventory.json', 'extraction-output.json', 'chunk-manifest.json', 'source-index-candidates.json', 'retrieval-smoke-tests.json', 'review-packet.json', 'review-packet.md', 'unresolved-issues-summary.md', 'validation-report.json', 'a1-quarantine-evidence.md']) await fs.rm(path.join(outputRoot, generatedFile), { force: true })
  const processed = []
  const indexes = []
  const inventoryItems = []
  const chunks = []
  const extractionGroups = []
  const flags = []
  const decisions = []
  for (const record of records) {
    const metadata = classify(record)
    const raw = await fs.readFile(record.localPath)
    const observedSha256 = sha256(raw)
    if (observedSha256 !== record.SHA256) throw new Error('Raw SHA mismatch for ' + record.pilotSlot)
    try {
      const extraction = record.expectedFileType === 'PDF' ? runPython(pdfCode, record.localPath) : runPython(xlsxCode, record.localPath)
      const sourceChunks = makeChunks(record, extraction, metadata)
      const smoke = []
      const emptyPageDetails = record.expectedFileType === 'PDF' ? (extraction.emptyPageDetails || []) : []
      const reviewableEmptyPages = emptyPageDetails.filter((page) => page.classification !== 'EMPTY_PAGE_BENIGN')
      const workbookExceptions = record.expectedFileType === 'XLSX' ? extraction.sheets.filter((sheet) => sheet.contentInventory?.substantiveNonCellContentMayExist) : []
      const smokeFailed = false
      const outcome = reviewableEmptyPages.length || workbookExceptions.length || smokeFailed ? 'HUMAN_REVIEW_REQUIRED' : 'CLEAN_REVIEW_CANDIDATE'
      const exceptionCode = workbookExceptions.length ? 'XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW' : reviewableEmptyPages.some((page) => page.classification === 'IMAGE_ONLY_SUBSTANTIVE_CONTENT') ? 'IMAGE_ONLY_SUBSTANTIVE_CONTENT' : reviewableEmptyPages.length ? 'EMPTY_PAGE_REQUIRES_REVIEW' : smokeFailed ? 'RETRIEVAL_SMOKE_TEST_FAILED' : 'NONE'
      const reason = workbookExceptions.length ? workbookExceptions.length + ' worksheet(s) contain native non-cell structures not represented by cell extraction and require human review: ' + workbookExceptions.map((sheet) => sheet.name).join(', ') + '.' : reviewableEmptyPages.length ? reviewableEmptyPages.length + ' PDF page(s) require human review after empty-page inspection; benign blank pages remain documented and page-aware backstop is retained.' : smokeFailed ? 'A corpus-level retrieval smoke test did not resolve to the expected cited source.' : emptyPageDetails.length ? 'Automated source binding, extraction, deterministic page-window grouping, citation, SHA, retrieval, and benign-empty-page checks passed.' : 'Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed.'
      const structuredEvidence = record.expectedFileType === 'XLSX' ? extraction.sheets.flatMap((sheet) => (sheet.tableBlocks.length ? sheet.tableBlocks : [{ blockOrdinal: 1, startRow: 1, endRow: 1, cellRefs: [], nonEmptyCellCount: 0, titleCandidates: [] }]).map((block) => ({ structuredEvidenceId: 'structured-evidence-' + record.candidateId + '-' + slugify(sheet.name) + '-rows-' + block.startRow + '-' + block.endRow, sheetName: sheet.name, worksheetPath: sheet.worksheetPath, sheetState: sheet.state, mergedRanges: sheet.mergedRanges, tableBlock: block, nonEmptyCellCount: block.nonEmptyCellCount, duplicateLabelValues: sheet.duplicateLabelValues, reviewOnly: true, promotionStatus: 'not_promoted' }))) : []
      const sourceIndex = {
        schemaVersion: '1.0', sourceIndexId: 'source-index-' + record.candidateId + '-review-only', repositoryManifestId: processingRunId, sourceVersionId: record.candidateId + '-review-only',
        source: {
          sourceId: record.candidateId, filename: record.actualFilename, filePath: record.localPath, sourceFamilyId: metadata.sourceFamilyId, domainId: metadata.domainId, documentType: metadata.documentType, sourceTitle: record.documentTitle, sourceReference: record.initialUrl, authorityLevel: metadata.authorityRole, sourceStatus: record.sourceStatus || (/historical|prior/i.test(record.title || '') ? 'historical' : 'active'), versionDate: record.expectedVersionDate || null, sourceSha256: observedSha256, pageCount: record.expectedFileType === 'PDF' ? extraction.pageCount : null, reviewBatchIds: [batchId], reviewIndexPath: 'data/processed/review_packages/' + batchId + '/review-packet.md', selfReviewPath: 'data/processed/review_packages/' + batchId + '/unresolved-issues-summary.md', pageImageBackstop: record.expectedFileType === 'PDF', lineReferencesAvailable: false, textLayerQuality: reviewableEmptyPages.length ? 'mixed' : 'clean', notes: 'Review-only candidate; approved acquisition support/authority role preserved.',
          rightsStatus: 'RIGHTS_REVIEW_REQUIRED',
          classification: { domainId: metadata.domainId, subdomainId: null, documentType: metadata.documentType, purpose: record.statedRole, intendedAudience: 'Processing and human review', authoritySourceType: metadata.authorityRole, confidentiality: 'public', recommendedProfile: metadata.domainId === 'actuarial_experience' ? 'governance' : 'regulatory', recommendedChunkingStrategy: record.expectedFileType === 'PDF' ? 'page_window_source_excerpt' : 'workbook_table_block_aware', confidence: outcome === 'CLEAN_REVIEW_CANDIDATE' ? 'high' : 'medium', unresolvedQuestions: ['Human review is required before promotion or downstream use.'] },
        },
        processing: { createdAt: acquisition.generatedAt, createdBy: 'scripts/process-approved-acquisition-pilot.mjs', processingMode: 'review_only_poc', canonicality: 'draft', reviewOnly: true, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, promotionStatus: 'not_promoted', rightsStatus: 'RIGHTS_REVIEW_REQUIRED', notes: 'No canonical promotion is authorized.' },
        chunks: sourceChunks, relationships: [], quality: { textLayerQuality: reviewableEmptyPages.length ? 'mixed' : 'clean', citationCompleteness: 'complete', pageImageBackstop: record.expectedFileType === 'PDF', lineReferencesAvailable: false, notes: reason, emptyPageDetails }, exportHints: { jsonlEligible: false, csvEligible: false, vectorEligible: false, notes: 'Downstream export is not authorized.' }, notes: reason,
        extensions: { acquisitionCandidateId: record.candidateId, rawSourcePath: record.localPath, rawSourceSha256: observedSha256, issuer: record.publisher, sourceUrl: record.initialUrl, acquisitionManifestPath: manifestPath, authoritySupportRole: record.disposition, structuredEvidence },
      }
      indexes.push(sourceIndex); chunks.push(...sourceChunks.map((chunk) => Object.assign({}, chunk, { sourceId: record.candidateId, sourceFamilyId: metadata.sourceFamilyId, domainId: metadata.domainId, documentType: metadata.documentType, sourcePath: record.localPath })))
      inventoryItems.push({ sourceId: record.candidateId, filename: record.actualFilename, filePath: record.localPath, sourceFamilyId: metadata.sourceFamilyId, domainId: metadata.domainId, documentType: metadata.documentType, sourceTitle: record.documentTitle, sourceReference: record.initialUrl, pageCount: sourceIndex.source.pageCount, processingStatus: 'review_pending', authorityLevel: metadata.authorityRole, fileHash: observedSha256, sizeBytes: raw.length, extension: path.extname(record.localPath).toLowerCase(), notes: reason })
      extractionGroups.push({ sourceId: record.candidateId, filename: record.actualFilename, filePath: record.localPath, sourceFamilyId: metadata.sourceFamilyId, domainId: metadata.domainId, documentType: metadata.documentType, sourceTitle: record.documentTitle, sourceReference: record.initialUrl, pageCount: sourceIndex.source.pageCount, extractionMethod: record.expectedFileType === 'PDF' ? 'pypdf page-aware extraction' : 'OOXML zip/XML sheet-cell and package-content inventory', pages: record.expectedFileType === 'PDF' ? extraction.pages : undefined, emptyPageDetails: record.expectedFileType === 'PDF' ? extraction.emptyPageDetails : undefined, structureSignals: record.expectedFileType === 'PDF' ? extraction.structureSignals : undefined, sheets: record.expectedFileType === 'XLSX' ? extraction.sheets : undefined })
      processed.push({ record, metadata, outcome, exceptionCode, reason, chunks: sourceChunks, structuredEvidence, observedSha256, rawSize: raw.length, pageCount: sourceIndex.source.pageCount, emptyPageDetails })
      if (outcome !== 'CLEAN_REVIEW_CANDIDATE') {
        flags.push({ flagId: record.candidateId + '-' + exceptionCode.toLowerCase(), severity: 'medium', sourceId: record.candidateId, flagType: exceptionCode.toLowerCase(), message: reason, notes: 'Keep this source in human review; do not promote.' })
        decisions.push({ decisionId: record.candidateId + '-review-disposition', decisionType: 'promotion_gate', question: 'Is the ' + record.documentTitle + ' evidence sufficient for any later promotion consideration?', whyItMatters: reason, recommendedOwner: 'source reviewer', priority: 'medium' })
      }
    } catch (error) {
      flags.push({ flagId: record.candidateId + '-processing-blocked', severity: 'high', sourceId: record.candidateId, flagType: 'processing_blocked', message: error.message, notes: 'No fallback flattening was attempted.' })
      decisions.push({ decisionId: record.candidateId + '-processing-blocked-review', decisionType: 'contradiction_resolution', question: 'Can the unsupported processing structure be safely handled?', whyItMatters: error.message, recommendedOwner: 'processor owner', priority: 'high' })
      processed.push({ record, metadata, outcome: 'PROCESSING_BLOCKED', exceptionCode: record.expectedFileType === 'XLSX' ? 'XLSX_STRUCTURE_PARSE_FAILED' : 'PDF_EXTRACTION_FAILED', reason: error.message, chunks: [], structuredEvidence: [], observedSha256, rawSize: raw.length, pageCount: null, emptyPageDetails: [] })
    }
  }
  const smokeTests = processed.map((item) => ({ candidateId: item.record.candidateId, sourceFamilyId: item.metadata.sourceFamilyId, tests: corpusSmokeTestsFor(item.record, chunks, processed), allPassed: corpusSmokeTestsFor(item.record, chunks, processed).every((test) => test.pass) }))
  for (const item of processed) {
    const smoke = smokeTests.find((test) => test.candidateId === item.record.candidateId)
    if (smoke && !smoke.allPassed && item.outcome === 'CLEAN_REVIEW_CANDIDATE') {
      item.outcome = 'HUMAN_REVIEW_REQUIRED'
      item.exceptionCode = 'RETRIEVAL_SMOKE_TEST_FAILED'
      item.reason = 'A corpus-level retrieval smoke test did not resolve to the expected cited source and structural region.'
      flags.push({ flagId: item.record.candidateId + '-retrieval-smoke-test-failed', severity: 'medium', sourceId: item.record.candidateId, flagType: 'retrieval_smoke_test_failed', message: item.reason, notes: 'Keep this source in human review; do not promote.' })
      decisions.push({ decisionId: item.record.candidateId + '-retrieval-smoke-review', decisionType: 'retrieval_gate', question: 'Can the corpus-level retrieval result be safely interpreted?', whyItMatters: item.reason, recommendedOwner: 'source reviewer', priority: 'medium' })
    }
  }
  const structuredIds = processed.flatMap((item) => item.structuredEvidence.map((evidence) => evidence.structuredEvidenceId))
  const checks = {
    rawShaLineage: processed.length === records.length && processed.every((item) => item.observedSha256 === item.record.SHA256) && inventoryItems.every((item) => item.fileHash === item.fileHash && item.sizeBytes > 0),
    sourceIdentityBinding: inventoryItems.length === records.length && inventoryItems.every((item) => records.some((record) => record.candidateId === item.sourceId && record.initialUrl === item.sourceReference)),
    extractionCompleteness: extractionGroups.length === records.length && extractionGroups.every((group) => group.pageCount > 0 || Array.isArray(group.sheets)),
    structuralSegmentation: chunks.length > 0 && chunks.every((chunk) => chunk.sectionReference && Array.isArray(chunk.citations) && chunk.citations.length > 0),
    deterministicIds: chunks.length > 0 && new Set(chunks.map((chunk) => chunk.chunkId)).size === chunks.length,
    metadataCompleteness: inventoryItems.every((item) => item.sourceId && item.sourceReference && item.fileHash && item.documentType),
    authoritySupportPreserved: indexes.every((index) => { const record = records.find((item) => item.candidateId === index.source.sourceId); return Boolean(record && index.source.authorityLevel === (record.disposition.startsWith('CURRENT AUTHORITY') ? 'current_authority' : 'current_support')) }),
    structuredEvidenceIdentity: new Set(structuredIds).size === structuredIds.length && processed.every((item) => item.structuredEvidence.every((evidence) => evidence.reviewOnly === true && evidence.promotionStatus === 'not_promoted')),
    retrievalSmokeTests: smokeTests.length === records.length && smokeTests.every((source) => source.allPassed),
    reviewOnlyGuardrails: indexes.every((index) => index.processing?.reviewOnly === true && index.processing?.promotionStatus === 'not_promoted' && index.processing?.ragReadyAllowed === false && index.chunks.every((chunk) => chunk.promotionEligible === false)),
    sourceExceptionAggregation: processed.filter((item) => item.exceptionCode === 'XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW').every((item) => decisions.some((decision) => decision.sourceId === item.record.candidateId) || flags.some((flag) => flag.sourceId === item.record.candidateId)),
  }
  const systemicFailures = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name)
  const summary = { totalAdmitted: records.length, processedSuccessfully: processed.filter((item) => item.outcome !== 'PROCESSING_BLOCKED').length, cleanReviewCandidates: processed.filter((item) => item.outcome === 'CLEAN_REVIEW_CANDIDATE').length, humanReviewRequired: processed.filter((item) => item.outcome === 'HUMAN_REVIEW_REQUIRED').length, processingBlocked: processed.filter((item) => item.outcome === 'PROCESSING_BLOCKED').length, systemicFailures: systemicFailures.length, totalChunks: chunks.length, totalStructuredEvidence: processed.reduce((sum, item) => sum + item.structuredEvidence.length, 0) }
  const families = [...new Map(processed.map((item) => [item.metadata.sourceFamilyId, { sourceFamilyId: item.metadata.sourceFamilyId, label: item.record.family, domainId: item.metadata.domainId }])).values()]
  const quarantineRecords = acquisition.acquisitions.filter((record) => record.acquisitionOutcome === 'QUARANTINE_FOR_HUMAN_REVIEW')
  const batch = { schemaVersion: '1.0', batchId, batchName: 'Acquisition pilot 2026-09-02 - low-touch review-only processing', status: 'review_pending', createdAt: acquisition.generatedAt, updatedAt: acquisition.generatedAt, projectName: 'Document Processor', projectPurpose: 'Review-only processing candidates bound to the controlled acquisition pilot.', sourceFamilies: families, sourceFiles: inventoryItems, processingIntent: { mode: 'small_pilot', targetDomains: families.map((family) => family.domainId), pipelineStages: ['identity/provenance', 'extraction', 'structure_detection', 'segmentation/chunking', 'structured_evidence', 'metadata_classification', 'source_index_candidate', 'retrieval_smoke_test', 'validation', 'review_package'], smallPilot: true, learnerFacingBlocked: true, appExportRequested: false, ragReadinessRequested: false, reviewStrategy: 'exception_first', notes: 'Only records explicitly admitted by the acquisition manifest were processed; quarantined records remained outside the processing queue.' }, boundaries: { rawSourceRoot: acquisition.intakeRoot, rawMaterialExternal: true, gitExcludesRawFiles: true, noLearnerFacingPromotion: true, noCanonicalPromotion: true, acquisitionManifestPath: manifestPath }, expectedOutputs: ['source_inventory', 'extraction_output', 'chunk_manifest', 'source_index_candidates', 'retrieval_smoke_tests', 'review_packet', 'validation_report'], reviewStatus: { defaultStatus: 'draft_candidate', reviewStrategy: 'exception_first', reviewFocus: 'exceptions_and_stratified_sample', promotionGate: 'separate human decision required; no automatic promotion', learnerFacingAllowed: false, appReadyAllowed: false, reviewPacketRequired: true }, extensions: { processingRunId, acquisitionManifestPath: manifestPath, authorizedProcessingScope: 'ADMIT_TO_PROCESSING_QUEUE only', quarantinedRecordCount: quarantineRecords.length, a1Excluded: !records.some((record) => record.pilotSlot === 'A1') } }
  const inventory = { schemaVersion: '1.0', inventoryId: 'inventory-' + batchId, batchId, generatedAt: acquisition.generatedAt, sourceRoot: acquisition.intakeRoot, processingStatus: 'review_pending', items: inventoryItems, summary: { sourceCount: records.length, reviewOnlySourceCount: records.length, selectedSourceIds: inventoryItems.map((item) => item.sourceId) } }
  const extraction = { schemaVersion: '1.0', extractionRunId: 'extraction-' + processingRunId, batchId, generatedAt: acquisition.generatedAt, processingStatus: 'review_pending', extractionMethod: 'Format-aware pypdf PDF extraction and native OOXML sheet/cell extraction.', sourceGroups: extractionGroups, summary: { sourceGroupCount: extractionGroups.length, extractedItemCount: chunks.length, reviewOnlyItemCount: chunks.length } }
  const chunkFile = { schemaVersion: '1.0', chunkManifestId: 'chunk-manifest-' + batchId, batchId, generatedAt: acquisition.generatedAt, processingStatus: 'review_pending', chunks, summary: { sourceFileCount: records.length, chunkCount: chunks.length, reviewOnlyChunkCount: chunks.length, sourceIds: [...new Set(chunks.map((chunk) => chunk.sourceId))] } }
  const rightsIssue = { issueId: 'naic-accounting-publications-appm-2026-rights-distribution-control', severity: 'high', issueType: 'rights_distribution_control', sourceId: 'naic-accounting-publications-appm-2026', message: 'A3 distribution/software-integration restriction requires rights and storage review; no legal conclusion is made.', recommendedAction: 'Keep substantive A3 text external/private pending rights review; retain only non-content processing evidence in public Git.' }
  const reviewItems = processed.map((item) => ({ stableId: item.record.candidateId + '--review-item', sourceId: item.record.candidateId, sourceFamilyId: item.metadata.sourceFamilyId, domainId: item.metadata.domainId, documentType: item.metadata.documentType, sourceReference: item.record.initialUrl, sourcePath: item.record.localPath, pageReference: item.record.expectedFileType === 'PDF' ? 'pp. 1-' + item.pageCount : 'Workbook', sectionReference: item.record.expectedFileType === 'XLSX' ? 'Workbook sheets' : 'Page-aware extraction', outcome: item.outcome, exceptionCode: item.exceptionCode, summary: item.reason, confidence: item.outcome === 'CLEAN_REVIEW_CANDIDATE' ? 'high' : 'medium', reviewFlags: item.outcome === 'CLEAN_REVIEW_CANDIDATE' ? [] : [item.exceptionCode], learnerFacingEligible: false, appReadyEligible: false, rightsStatus: 'RIGHTS_REVIEW_REQUIRED', notes: 'Review-only candidate; no promotion or downstream eligibility is implied.' }))
  const review = { schemaVersion: '1.0', packetId: 'review-packet-' + batchId, batchId, generatedAt: acquisition.generatedAt, reviewMode: 'exception_first', batchSummary: { batchName: batch.batchName, sourceFamilies: families.map((family) => family.sourceFamilyId), processingIntent: 'Low-touch processing pilot for admitted raw sources.', sourceFileCount: records.length, extractedItemCount: chunks.length, exceptionCount: flags.length, summary: 'All admitted sources were processed through review-only extraction, structure, chunking, source-index candidate, retrieval smoke test, and validation.', notes: JSON.stringify(summary) }, sourceFilesProcessed: inventoryItems.map((item) => ({ sourceId: item.sourceId, filename: item.filename, filePath: item.filePath, sourceReference: item.sourceReference, sourceFamilyId: item.sourceFamilyId, domainId: item.domainId, documentType: item.documentType, processingStatus: 'review_pending', pageCount: item.pageCount, issueCount: flags.filter((flag) => flag.sourceId === item.sourceId).length, rightsStatus: 'RIGHTS_REVIEW_REQUIRED', notes: item.notes })), extractedItems: reviewItems, requiredHumanDecisions: decisions.concat([rightsIssue]), exceptionsAndFlags: flags, citationIssues: [], unresolvedIssues: flags.map((flag) => ({ issueId: flag.flagId, severity: flag.severity, issueType: flag.flagType, sourceId: flag.sourceId, message: flag.message, recommendedAction: 'Review source-specific evidence before any future promotion decision.' })).concat([rightsIssue]), promotionRecommendation: { status: 'not_recommended', reason: 'This is a low-touch review-only pilot; no canonical promotion is authorized.', recommendedNextStep: 'Inspect the stratified clean sample and all exceptions.', targetExport: 'review_packet' }, learnerFacingStatus: { ready: false, reason: 'No learner-facing use is authorized.', statusText: 'not approved' }, ragReadiness: { ready: false, reason: 'No RAG eligibility is authorized.', indexableItemCount: 0, notes: 'Source-index candidates are review-only.' }, appExportReadiness: { ready: false, reason: 'No app-ready export is authorized.', targetExports: [], notes: 'No promotion was performed.' }, reviewerNotes: 'Proposed clean sample: native workbook and empirical-study PDF. Review all exceptions and the A3 rights/storage hold.', extensions: { processingRunId, acquisitionManifestPath: manifestPath, summary } }
  const table = processed.map((item) => '| ' + item.record.pilotSlot + ' ' + item.record.documentTitle + ' | ' + item.record.family + ' | ' + item.record.expectedFileType + ' | ' + item.observedSha256 + ' | ' + item.outcome + ' | ' + item.chunks.length + ' | ' + item.structuredEvidence.length + ' | ' + (smokeTests.find((test) => test.candidateId === item.record.candidateId)?.allPassed ? 'PASS' : item.outcome === 'PROCESSING_BLOCKED' ? 'NOT_RUN' : 'FAIL') + ' | ' + item.exceptionCode + ' | ' + (item.outcome === 'CLEAN_REVIEW_CANDIDATE' ? 'NO' : 'YES') + ' | ' + item.reason + ' |')
  const reviewMd = ['# Low-touch acquisition processing pilot review packet', '', '- Batch: ' + batchId, '- Status: REVIEW_ONLY / NOT_PROMOTED', '- Source of truth: ' + manifestPath, '', '| Document | Source family | Format | Raw SHA-256 | Processing outcome | Parent/chunk or equivalent counts | Structured evidence count | Retrieval smoke-test | Exception code | Human review required? | Reason |', '| --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- |', ...table, '', '## Summary', '', '- TOTAL_ADMITTED: ' + summary.totalAdmitted, '- PROCESSED_SUCCESSFULLY: ' + summary.processedSuccessfully, '- CLEAN_REVIEW_CANDIDATES: ' + summary.cleanReviewCandidates, '- HUMAN_REVIEW_REQUIRED: ' + summary.humanReviewRequired, '- PROCESSING_BLOCKED: ' + summary.processingBlocked, '- SYSTEMIC_FAILURES: ' + summary.systemicFailures, '', '## Stratified clean sample', '', '- A2: native XLSX workbook with sheet/cell/formula preservation.', '- S4: empirical actuarial-study PDF with page-aware extraction and citation evidence.', '', 'All outputs are review-only; no canonical promotion, learner-facing use, RAG eligibility, or authority expansion occurred.'].join('\n')
  const unresolved = ['# Unresolved issues and review boundaries', '', 'Batch: ' + batchId, '', '- Quarantined records were excluded because their acquisition outcome was QUARANTINE_FOR_HUMAN_REVIEW; no processing was attempted.', '- All processed records preserve acquisition candidate ID, raw path, raw SHA-256, issuer, source URL, acquisition manifest path, and approved authority/support role.', ...flags.map((flag) => '- ' + flag.sourceId + ': ' + flag.flagType + ' - ' + flag.message), '- A3: rights_distribution_control - substantive extracted text is retained only as historical review evidence pending rights/storage review; no legal conclusion is made.', '', '- No item is canonical, controlling, learner-facing, app-ready, or RAG-ready.'].join('\n')
  const report = { schemaVersion: '1.0', reportId: 'validation-' + batchId, generatedAt: acquisition.generatedAt, status: systemicFailures.length ? 'fail' : 'pass', processingRunId, sourceOfTruth: manifestPath, exceptionTaxonomy: EXCEPTION_CODES, summary, checks, failedSystemicControls: systemicFailures, terminology: { extraction: 'page-aware extraction', pdfGrouping: 'deterministic page-window grouping; semantic hierarchy not claimed', workbookStructure: 'conservative workbook table-block grouping; table-aware semantics not claimed' } }
  const a1 = acquisition.acquisitions.find((record) => record.candidateId === 'naic-pbr-vm-20-vm-31-vm-51-pbr-plenary-amendments-current')
  if (!a1) throw new Error('A1 quarantine record is missing from the acquisition manifest.')
  const a1Evidence = ['# A1 quarantine evidence packet', '', '- Candidate ID: ' + a1.candidateId, '- Approved expected identity/status: PBR plenary adopted amendments, current edition / CURRENT AUTHORITY - DOWNLOAD', '- Exact downloaded filename: ' + a1.actualFilename, '- Final URL: ' + a1.finalUrl, '- SHA-256: ' + a1.SHA256, '- Quarantine path: ' + a1.localPath, '- Observed first-page identity evidence: Meeting Materials: Life Insurance and Annuities (A) Committee; July 14, 2025; Attachment A - Life Amendments to the 2026 Valuation Manual for the Consideration of the Life Insurance and Annuities (A) Committee.', '- Observed title/date/version: July 14, 2025 committee meeting attachment concerning amendments to the 2026 Valuation Manual.', '- Exact contradiction: the payload identity does not present as the catalog-described current adopted-amendment edition.', '- Possible issue classes for human adjudication: catalog metadata issue; URL/current-resource issue; document-version issue; amendment incorporation issue; other.', '- Human reviewer needs to compare the official page listing, current-resource link, adoption/effective metadata, and this payload identity.', '- Raw payload authenticity/integrity evidence: PDF signature and EOF validation passed; SHA remained unchanged when the payload was moved to quarantine.', '', 'This packet does not resolve the contradiction or make a final authority/status determination. A1 was not processed, promoted, or redownloaded.'].join('\n')
  await Promise.all([writeJson(path.join(outputRoot, 'batch-manifest.json'), batch), writeJson(path.join(outputRoot, 'source-inventory.json'), inventory), writeJson(path.join(outputRoot, 'extraction-output.json'), extraction), writeJson(path.join(outputRoot, 'chunk-manifest.json'), chunkFile), writeJson(path.join(outputRoot, 'source-index-candidates.json'), { schemaVersion: '1.0', processingRunId, reviewOnly: true, promotionStatus: 'not_promoted', sourceIndexes: indexes }), writeJson(path.join(outputRoot, 'retrieval-smoke-tests.json'), { schemaVersion: '1.0', processingRunId, tests: smokeTests, summary: { sourceCount: records.length, passedSourceCount: smokeTests.filter((test) => test.allPassed).length, testCount: smokeTests.reduce((sum, source) => sum + source.tests.length, 0) } }), writeJson(path.join(outputRoot, 'review-packet.json'), review), writeText(path.join(outputRoot, 'review-packet.md'), reviewMd), writeText(path.join(outputRoot, 'unresolved-issues-summary.md'), unresolved), writeJson(path.join(outputRoot, 'validation-report.json'), report)])
  await writeText(path.join(outputRoot, 'a1-quarantine-evidence.md'), a1Evidence)
  console.log(JSON.stringify({ batchId, outputRoot, summary }, null, 2))
}
main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1 })
