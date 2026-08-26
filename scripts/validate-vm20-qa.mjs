import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const sourceId = 'vm20-remaining-prose-appendix-coverage'
const packagePath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources', `${sourceId}.json`)
const outputPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-qa-source-spotcheck.json')
const outputMarkdownPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-qa-source-spotcheck.md')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const normalizeForPdf = (value) => String(value ?? '')
  .replace(/\[p\.\s*\d+\]/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase()

const extractPages = (pdfPath) => {
  const code = [
    'import json, sys',
    'from pypdf import PdfReader',
    'reader = PdfReader(sys.argv[1])',
    'print(json.dumps([page.extract_text() or "" for page in reader.pages]))',
  ].join('; ')
  const pythonCandidates = [
    process.env.PYTHON,
    process.env.CODEX_PYTHON,
    process.env.USERPROFILE ? path.join(process.env.USERPROFILE, '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'python', 'python.exe') : null,
    'python',
  ].filter(Boolean)
  const failures = []
  for (const python of [...new Set(pythonCandidates)]) {
    const result = spawnSync(python, ['-c', code, pdfPath], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    if (!result.error && result.status === 0) return JSON.parse(result.stdout)
    failures.push(`${python}: ${result.error?.message ?? (result.stderr || result.stdout).trim()}`)
  }
  throw new Error(`Unable to run Python PDF extraction. Attempts: ${failures.join(' | ')}`)
}

const selectedChunkIds = [
  `${sourceId}-vm20-section4-complete`,
  `${sourceId}-vm20-section5-complete`,
  `${sourceId}-vm20-section9-c-mortality-assumptions`,
  `${sourceId}-vm20-appendix1-f-this-section-describes-the-set-of-16-scenarios-for-the-sert-in-vm-20-starting-with-the-yield-curve`,
  `${sourceId}-vm20-appendix2-a-baseline-annual-default-cost-factors`,
]

const main = async () => {
  const config = await readJson(configPath)
  const sourceConfig = config.sources.find((source) => source.sourceId === sourceId)
  if (!sourceConfig) throw new Error(`Missing QA source configuration for ${sourceId}.`)
  const sourceIndex = await readJson(packagePath)
  const rawPdfPath = sourceConfig.filePath
  const pdfBytes = await fs.readFile(rawPdfPath)
  const actualSha256 = crypto.createHash('sha256').update(pdfBytes).digest('hex')
  if (actualSha256 !== sourceConfig.sourceSha256) throw new Error(`Raw PDF SHA-256 mismatch. Expected ${sourceConfig.sourceSha256}, found ${actualSha256}.`)
  const pages = extractPages(rawPdfPath)
  const chunkById = new Map(sourceIndex.chunks.map((chunk) => [chunk.chunkId, chunk]))
  const expectedSectionReferences = new Map([
    [selectedChunkIds[0], 'Section 4: Deterministic Reserve'],
    [selectedChunkIds[1], 'Section 5: Stochastic Reserve'],
    [selectedChunkIds[2], 'Section 9 C. Mortality Assumptions'],
    [selectedChunkIds[3], 'Appendix 1 F. SERT scenario set'],
    [selectedChunkIds[4], 'Appendix 2 A. Baseline Annual Default Cost Factors'],
  ])
  const checks = selectedChunkIds.map((chunkId) => {
    const chunk = chunkById.get(chunkId)
    if (!chunk) throw new Error(`QA target chunk is missing: ${chunkId}`)
    const pageText = pages.slice(Math.max(0, chunk.pageStart - 1), chunk.pageEnd).join('\n')
    const sourceText = normalizeForPdf(chunk.sourceTextExcerpt)
    const anchors = [sourceText.slice(0, 180), sourceText.slice(-180)].filter((anchor) => anchor.length >= 40)
    const anchorMatches = anchors.map((anchor) => normalizeForPdf(pageText).includes(anchor))
    const pageRangeValid = chunk.pageStart >= 1 && chunk.pageEnd >= chunk.pageStart && chunk.pageEnd <= pages.length
    const exactSourceType = chunk.sourceTextType === 'actual_extracted_source_text' && chunk.fidelity === 'exact'
    const headingValid = chunk.sectionReference === expectedSectionReferences.get(chunkId)
    if (!pageRangeValid || !exactSourceType || !headingValid || anchorMatches.some((matched) => !matched)) {
      throw new Error(`Raw PDF spot-check failed for ${chunkId}: ${JSON.stringify({ pageRangeValid, exactSourceType, headingValid, anchorMatches })}`)
    }
    return { chunkId, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, sectionReference: chunk.sectionReference, exactSourceType, anchorMatches, representation: 'raw_pdf_pypdf_page_text' }
  })
  const result = {
    schemaVersion: '1.0',
    qaId: 'vm20-qa-source-spotcheck-2026-08-26',
    status: 'passed',
    sourceId,
    sourceEditionId: sourceConfig.sourceEditionId,
    sourceVersionIdentifier: sourceConfig.sourceVersionIdentifier,
    sourceSha256: actualSha256,
    rawPdfPath,
    pageCount: pages.length,
    sourceTextMode: sourceConfig.sourceTextVerification?.sourceTextMode,
    visualTranscription: sourceConfig.sourceTextVerification?.visualTranscription,
    pageImageBackstop: sourceConfig.pageImageBackstop,
    validationMode: 'targeted_validation_only; no corpus reprocessing',
    checks,
    notes: 'Selected canonical parent excerpts were checked against the corresponding raw PDF page representation. Exact extracted source text was not rewritten; page-image backstop remains false.',
  }
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  const markdown = [
    '# VM-20 Raw PDF QA Spot Check', '',
    `- Status: ${result.status}`,
    `- Source edition: ${result.sourceEditionId}`,
    `- Source SHA-256: \`${result.sourceSha256}\``,
    `- Representation checked: ${result.checks[0].representation}`,
    `- Source-text mode: ${result.sourceTextMode}`,
    `- Visual transcription: ${result.visualTranscription}`,
    `- Page-image backstop: ${result.pageImageBackstop ? 'Yes' : 'No'}`,
    '', '## Targeted checks', '',
    '| Chunk | Pages | Section reference | Exact source type | Anchors matched |',
    '| --- | --- | --- | --- | --- |',
    ...result.checks.map((check) => `| \`${check.chunkId}\` | pp. ${check.pageStart}-${check.pageEnd} | ${check.sectionReference} | ${check.exactSourceType ? 'Yes' : 'No'} | ${check.anchorMatches.every(Boolean) ? 'Yes' : 'No'} |`),
    '', 'This QA step validates representative canonical excerpts against the raw PDF page representation. It does not reprocess the corpus and does not replace independent human review of wording, tables, or visual fidelity.', '',
  ].join('\n')
  await fs.writeFile(outputMarkdownPath, `${markdown}\n`, 'utf8')
  console.log(`Passed targeted VM-20 raw PDF QA for ${checks.length} representative parents.`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
