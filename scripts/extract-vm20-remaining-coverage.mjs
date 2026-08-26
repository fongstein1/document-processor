import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceIndexConfig = JSON.parse(await fs.readFile(path.join(repoRoot, 'config', 'source-index-poc.json'), 'utf8'))
const configuredSource = sourceIndexConfig.sources.find((source) => source.sourceId === 'vm20-canonical-coverage')
if (!configuredSource) throw new Error('The existing VM-20 canonical source configuration is missing.')
const pdfPath = configuredSource.filePath
const pythonPath = process.env.VM20_EXTRACTION_PYTHON ?? 'python'
const pageCount = configuredSource.pageCount

const pageRanges = [
  [66, 68],
  [94, 140],
]

const extractionCode = `
import json
import sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1], strict=False)
requested = json.loads(sys.argv[2])
pages = []
for start, end in requested:
    for number in range(start, end + 1):
        text = (reader.pages[number - 1].extract_text() or '').replace('\\r', '')
        pages.append({'pageNumber': number, 'text': text})
print(json.dumps({'pageCount': len(reader.pages), 'pages': pages}, ensure_ascii=False))
`

const extraction = spawnSync(
  pythonPath,
  ['-c', extractionCode, pdfPath, JSON.stringify(pageRanges)],
  { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } },
)
if (extraction.status !== 0) {
  throw new Error(extraction.stderr || extraction.stdout || 'PDF extraction failed')
}

const pdf = JSON.parse(extraction.stdout)
if (pdf.pageCount !== pageCount) {
  throw new Error(`Expected ${pageCount} PDF pages, found ${pdf.pageCount}`)
}

const pagesByNumber = new Map(pdf.pages.map((page) => [page.pageNumber, page]))
const pageText = (start, end) => Array.from({ length: end - start + 1 }, (_, offset) => {
  const number = start + offset
  const page = pagesByNumber.get(number)
  return `[p. ${number}] ${(page?.text ?? '').trim()}`
}).join('\n\n')

const normalize = (value) => value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const pageRangeFromText = (value, fallbackStart, fallbackEnd) => {
  const numbers = [...value.matchAll(/\[p\. (\d+)\]/g)].map((match) => Number(match[1]))
  return {
    start: numbers.length ? Math.min(...numbers) : fallbackStart,
    end: numbers.length ? Math.max(...numbers) : fallbackEnd,
  }
}

const splitAtHeadings = (value, headingPattern, fallbackStart) => {
  const matches = [...value.matchAll(headingPattern)]
  if (!matches.length) throw new Error(`No structural headings found in source slice: ${headingPattern}`)
  const pageAt = (offset) => {
    const markers = [...value.slice(0, offset).matchAll(/\[p\. (\d+)\]/g)].map((match) => Number(match[1]))
    return markers.at(-1) ?? fallbackStart
  }
  return matches.map((match, index) => ({
    heading: match[1].trim(),
    text: value.slice(match.index, matches[index + 1]?.index ?? value.length).trim(),
    pageRange: {
      start: pageAt(match.index),
      end: pageAt(matches[index + 1]?.index ?? value.length),
    },
  }))
}

const section45Text = pageText(66, 68)
const section4Start = section45Text.indexOf('Section 4: Deterministic Reserve')
const section5Start = section45Text.indexOf('Section 5: Stochastic Reserve')
if (section4Start < 0 || section5Start < 0 || section5Start <= section4Start) {
  throw new Error('Could not locate Section 4 / Section 5 headings in pages 66-68')
}

const section9FullText = pageText(94, 130)
const section9Start = section9FullText.indexOf('Section 9: Assumptions')
if (section9Start < 0) throw new Error('Could not locate Section 9 heading in pages 94-130')

const appendix1FullText = pageText(131, 134)
const appendix1Start = appendix1FullText.indexOf('Appendix 1: Additional Description of Economic Scenarios')
const appendix2StartInAppendix1 = appendix1FullText.indexOf('Appendix 2: Tables for Calculating Asset Default Costs and Asset Spreads, Including Basis of Tables')
if (appendix1Start < 0 || appendix2StartInAppendix1 < 0) throw new Error('Could not locate Appendix 1 / Appendix 2 headings')

const appendix2Text = `${appendix1FullText.slice(appendix2StartInAppendix1).trim()}\n\n${pageText(135, 140)}`.trim()

const sourceMeta = {
  filename: path.basename(pdfPath),
  filePath: pdfPath,
  sourceFamilyId: 'valuation_manual_pdfs',
  domainId: 'naic_regulatory',
  documentType: 'valuation_manual_section',
  sourceTitle: '2026 NAIC Valuation Manual VM-20',
  sourceReference: '2026 NAIC Valuation Manual',
  sourcePath: pdfPath,
  pageCount,
  confidence: 'high',
  reviewFlags: ['review_only', 'requires_human_interpretation'],
  reviewStatus: 'pending_independent_review',
}

const makeItem = ({ sourceId, batchId, text, pageStart, pageEnd, sectionReference, summary, keywords }) => ({
  stableId: sourceId,
  extractedItemId: `item-${sourceId}`,
  itemKind: 'chunk',
  sourceId,
  ...sourceMeta,
  pageReference: `pp. ${pageStart}-${pageEnd}`,
  sectionReference,
  lineReference: null,
  chunkText: text.trim().startsWith(`[p. ${pageStart}]`) ? text.trim() : `[p. ${pageStart}] ${text.trim()}`,
  normalizedText: normalize(text),
  summary,
  keywords,
  citations: [{
    citationText: sectionReference,
    pageReference: `pp. ${pageStart}-${pageEnd}`,
    sectionReference,
    sourceReference: sourceMeta.sourceReference,
    pageStart,
    pageEnd,
  }],
  confidence: sourceMeta.confidence,
  reviewFlags: sourceMeta.reviewFlags,
  reviewStatus: sourceMeta.reviewStatus,
  learnerFacingEligible: false,
  appReadyEligible: false,
  nonLearnerFacingNotes: 'Current-manual source text retained for review-only canonicalization; independent actuarial review remains pending.',
  notes: `Extracted from ${sourceMeta.filename} in ${batchId}; source text is distinct from generated summaries and review commentary.`,
})

const section9Parts = splitAtHeadings(
  section9FullText.slice(section9Start),
  /(?:^|\n)([A-G]\.\s+[A-Za-z][^\n]*)/g,
  94,
)
const appendix1Parts = splitAtHeadings(
  appendix1FullText.slice(appendix1Start, appendix2StartInAppendix1),
  /(?:^|\n)([A-G]\.\s+[A-Za-z][^\n]*)/g,
  131,
)
const appendix2Parts = splitAtHeadings(
  appendix2Text,
  /(?:^|\n)([A-H]\.\s+[A-Za-z][^\n]*)/g,
  134,
)

const items = [
  makeItem({
    sourceId: 'vm20-section4-complete',
    batchId: 'batch-231',
    text: section45Text.slice(section4Start, section5Start).trim(),
    pageStart: 66,
    pageEnd: 67,
    sectionReference: 'Section 4: Deterministic Reserve',
    summary: 'Complete extracted Section 4 deterministic-reserve requirements, including the two calculation methods, projected cash-flow requirements, policy-loan and reinsurance cash flows, exclusion-related limits, and reserving-category attribution.',
    keywords: ['VM-20', 'Section 4', 'deterministic reserve', 'DR', 'PIMR', 'economic scenario 12', 'reserving category'],
  }),
  makeItem({
    sourceId: 'vm20-section5-complete',
    batchId: 'batch-231',
    text: section45Text.slice(section5Start).trim(),
    pageStart: 67,
    pageEnd: 68,
    sectionReference: 'Section 5: Stochastic Reserve',
    summary: 'Complete extracted Section 5 stochastic-reserve requirements, including subgroup aggregation, scenario reserve calculation, ranking, CTE 70, additional material risk, PIMR, and reserving-category stand-alone calculation.',
    keywords: ['VM-20', 'Section 5', 'stochastic reserve', 'SR', 'scenario reserve', 'CTE 70', 'aggregation'],
  }),
  ...section9Parts.map((part, index) => {
    const range = part.pageRange
    return makeItem({
      sourceId: `vm20-section9-${String.fromCharCode(97 + index)}-${slugify(part.heading.slice(3))}`,
      batchId: 'batch-232',
      text: part.text,
      pageStart: range.start,
      pageEnd: range.end,
      sectionReference: `Section 9 ${part.heading}`,
      summary: `Extracted authoritative VM-20 Section 9 subsection ${part.heading}; requirements, assumptions, conditions, exceptions, and cross-references remain source-bound for review.`,
      keywords: ['VM-20', 'Section 9', part.heading],
    })
  }),
  ...appendix1Parts.map((part, index) => {
    const range = part.pageRange
    return makeItem({
      sourceId: `vm20-appendix1-${String.fromCharCode(97 + index)}-${slugify(part.heading.slice(3))}`,
      batchId: 'batch-233',
      text: part.text,
      pageStart: range.start,
      pageEnd: range.end,
      sectionReference: `Appendix 1 ${part.heading}`,
      summary: `Extracted authoritative VM-20 Appendix 1 subsection ${part.heading}; scenario descriptions and economic-scenario context remain source-bound and are not generalized beyond the text.`,
      keywords: ['VM-20', 'Appendix 1', 'economic scenarios', part.heading],
    })
  }),
  ...appendix2Parts.map((part, index) => {
    const range = part.pageRange
    return makeItem({
      sourceId: `vm20-appendix2-${String.fromCharCode(97 + index)}-${slugify(part.heading.slice(3))}`,
      batchId: 'batch-234',
      text: part.text,
      pageStart: range.start,
      pageEnd: range.end,
      sectionReference: `Appendix 2 ${part.heading}`,
      summary: `Extracted authoritative VM-20 Appendix 2 subsection ${part.heading}; the prose basis and table references are retained while generalized structured table ingestion remains deferred.`,
      keywords: ['VM-20', 'Appendix 2', 'asset default costs', 'asset spreads', part.heading],
    })
  }),
]

const byBatch = new Map([
  ['batch-231', items.filter((item) => item.sourceId === 'vm20-section4-complete' || item.sourceId === 'vm20-section5-complete')],
  ['batch-232', items.filter((item) => item.sourceId.startsWith('vm20-section9-'))],
  ['batch-233', items.filter((item) => item.sourceId.startsWith('vm20-appendix1-'))],
  ['batch-234', items.filter((item) => item.sourceId.startsWith('vm20-appendix2-'))],
])

const sourceHash = crypto.createHash('sha256').update(await fs.readFile(pdfPath)).digest('hex')
for (const [batchId, batchItems] of byBatch) {
  const batchRoot = path.join(repoRoot, 'data', 'work', 'batches', batchId)
  const output = {
    schemaVersion: '1.0',
    extractionRunId: `extract-${batchId}-vm20-remaining-coverage`,
    batchId,
    generatedAt: '2026-08-26T00:00:00.000Z',
    processingStatus: 'completed_review_only',
    extractionMethod: 'pypdf_text_layer_with_page_labels_and_structural_heading_splits',
    sourceGroups: [{
      sourceId: batchItems[0]?.sourceId ?? batchId,
      filename: sourceMeta.filename,
      filePath: sourceMeta.filePath,
      sourceFamilyId: sourceMeta.sourceFamilyId,
      domainId: sourceMeta.domainId,
      documentType: sourceMeta.documentType,
      sourceTitle: sourceMeta.sourceTitle,
      sourceReference: sourceMeta.sourceReference,
      versionDate: null,
      pageCount,
      processingStatus: 'extracted_review_only',
      extractedItems: batchItems,
    }],
    summary: `Authoritative VM-20 source extraction for ${batchId}; exact text is retained for the remaining prose and appendix coverage wave.`,
    notes: [
      `Source SHA-256: ${sourceHash}`,
      'Raw PDF remains outside the repository; only derived ignored batch outputs are generated.',
      'Review-only by default; no learner-facing, app-ready, RAG-ready, or promoted content is produced.',
      'Appendix 2 table rows are not ingested as structured data in this milestone.',
    ],
    extensions: { sourceSha256: sourceHash, sourcePageRanges: batchItems.map((item) => item.pageReference) },
  }
  await fs.mkdir(batchRoot, { recursive: true })
  await fs.writeFile(path.join(batchRoot, 'extraction-output.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8')
}

console.log(JSON.stringify({
  source: pdfPath,
  sourceSha256: sourceHash,
  pageCount,
  batchCounts: Object.fromEntries([...byBatch].map(([batchId, batchItems]) => [batchId, batchItems.length])),
  itemIds: items.map((item) => item.sourceId),
}, null, 2))
