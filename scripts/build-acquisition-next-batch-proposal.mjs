import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = 'C:\\Dev\\Document Processor Sources\\2026-09-02 Intake'
const catalogPath = path.join(sourceRoot, '_discovery', 'regulatory-source-discovery-candidates.json')
const inventoryPath = path.join(sourceRoot, '_discovery', 'regulatory-source-local-inventory.json')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'acquisition-pilot-2026-09-02')
const outputPath = path.join(outputRoot, 'next-batch-proposal.json')
const markdownPath = path.join(outputRoot, 'next-batch-proposal.md')
const readJson = async (filePath) => JSON.parse((await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, ''))
const writeJson = async (filePath, value) => { await fs.mkdir(path.dirname(filePath), { recursive: true }); await fs.writeFile(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8') }
const writeText = async (filePath, value) => { await fs.writeFile(filePath, value + '\n', 'utf8') }

const completedPilotIds = new Set([
  'naic-pbr-vm-20-vm-31-vm-51-vmv-rates-2026',
  'naic-accounting-publications-appm-2026',
  'naic-life-fraternal-reporting-2026-03bwg',
  'naic-pbr-vm-20-vm-31-vm-51-pbr-vm-current-redline',
  'naic-accounting-publications-spd-2026',
  'naic-life-fraternal-reporting-qsb-life-2026',
  'society-of-actuaries-experience-studies-soa-2015-vbt-report',
  'naic-pbr-vm-20-vm-31-vm-51-pbr-plenary-amendments-current',
])

const main = async () => {
  const catalog = await readJson(catalogPath)
  const inventory = await readJson(inventoryPath)
  const inventoryRecords = Array.isArray(inventory) ? inventory : inventory.records || inventory.items || []
  const inventoryNames = new Set(inventoryRecords.filter((record) => record.fileRole === 'source_document').map((record) => String(record.fileName || record.filename || '').toLowerCase()))
  const inventoryUrls = new Set(inventoryRecords.filter((record) => record.fileRole === 'source_document').map((record) => String(record.directDownloadUrl || record.url || '').toLowerCase()).filter(Boolean))
  const eligible = catalog.filter((record) => record.isAcquisitionEligible === true && record.payloadCount === 1 && ['PDF', 'XLSX'].includes(record.expectedFileType) && Boolean(record.directDownloadUrl) && ['CURRENT AUTHORITY — DOWNLOAD', 'CURRENT SUPPORT — DOWNLOAD'].includes(record.disposition))
    .filter((record) => !completedPilotIds.has(record.candidateId))
    .filter((record) => !inventoryNames.has(String(record.expectedFileName || '').toLowerCase()))
    .filter((record) => !inventoryUrls.has(String(record.directDownloadUrl || '').toLowerCase()))
    .filter((record) => !record.localMatchType)
  const quotas = new Map([
    ['NAIC PBR / VM-20 / VM-31 / VM-51', 6],
    ['NAIC Accounting Publications', 2],
    ['NAIC Life / Fraternal Reporting', 4],
    ['Society of Actuaries Experience Studies', 12],
  ])
  const byFamily = new Map()
  for (const record of eligible) if (!byFamily.has(record.family)) byFamily.set(record.family, [])
  for (const record of eligible) byFamily.get(record.family).push(record)
  const selected = []
  for (const [family, quota] of quotas) selected.push(...(byFamily.get(family) || []).slice(0, quota))
  if (selected.length < 20 || selected.length > 30) throw new Error('Selection-only proposal did not produce 20-30 eligible existing candidates; got ' + selected.length)
  const ids = selected.map((record) => record.candidateId)
  if (new Set(ids).size !== ids.length) throw new Error('Selection-only proposal contains duplicate candidate IDs.')
  const candidates = selected.map((record, index) => ({
    selectionOrdinal: index + 1,
    candidateId: record.candidateId,
    pilotSlot: null,
    title: record.title,
    disposition: record.disposition,
    family: record.family,
    expectedFileType: record.expectedFileType,
    expectedFileName: record.expectedFileName,
    directDownloadUrl: record.directDownloadUrl,
    discoveryPage: record.discoveryPage,
    publisher: record.publisher,
    versionDate: record.versionDate,
    payloadCount: record.payloadCount,
    proposedDestinationFolder: record.proposedDestinationFolder,
    existingInventoryComparison: 'No apparent inventory match in the current 23-source-PDF / 25-metadata baseline; byte-level uniqueness is unverified until acquisition.',
    duplicateSupersessionConcern: 'No concern recorded by the discovery catalog; official-page and version review remain required.',
    humanAdjudication: 'PENDING',
    downloadAuthorized: false,
    processingAuthorized: false,
    canonicalPromotionAuthorized: false,
    notes: 'Selection-only review evidence. This record is not an acquisition instruction.'
  }))
  const proposal = {
    schemaVersion: '1.0',
    proposalId: 'next-batch-selection-only-20260903',
    status: 'SELECTION_ONLY_REVIEW',
    sourceCatalogPath: catalogPath,
    sourceInventoryPath: inventoryPath,
    baselineInventory: { sourcePdfs: 23, metadataFiles: 25, duplicateSourcePdfShaGroups: 0 },
    selectionRules: ['Existing catalog candidate ID only', 'CURRENT AUTHORITY — DOWNLOAD or CURRENT SUPPORT — DOWNLOAD only', 'Exactly one payload, direct URL, and PDF/XLSX expected type', 'Exclude completed pilot IDs, apparent inventory matches, and records with local-match evidence', 'No byte-level uniqueness claim before acquisition'],
    humanAdjudication: 'PENDING',
    downloadAuthorized: false,
    processingAuthorized: false,
    canonicalPromotionAuthorized: false,
    candidateCount: candidates.length,
    familyCounts: Object.fromEntries([...new Set(candidates.map((candidate) => candidate.family))].map((family) => [family, candidates.filter((candidate) => candidate.family === family).length])),
    candidates,
    governance: { noNewCandidateIds: true, noAcquisitionManifest: true, noRawDocuments: true, reviewOnly: true, notPromoted: true }
  }
  await writeJson(outputPath, proposal)
  const rows = candidates.map((candidate) => '| ' + candidate.selectionOrdinal + ' | ' + candidate.candidateId + ' | ' + candidate.family + ' | ' + candidate.expectedFileType + ' | ' + candidate.title.replace(/\|/g, '\\|') + ' | ' + candidate.disposition + ' |')
  await writeText(markdownPath, ['# Next-batch selection-only proposal', '', '- Status: `SELECTION_ONLY_REVIEW`', '- Candidate count: ' + candidates.length, '- Human adjudication: `PENDING`', '- Download authorized: `false`', '- Processing authorized: `false`', '- Canonical promotion authorized: `false`', '- Baseline: 23 source PDFs, 25 metadata files, 0 duplicate source-PDF SHA groups', '', '| # | Candidate ID | Family | Type | Title | Disposition |', '| ---: | --- | --- | --- | --- | --- |', ...rows, '', 'This is review-only evidence derived from the existing discovery catalog. It does not create candidate IDs, authorize acquisition, authorize processing, or assert byte-level uniqueness for undownloaded candidates.'].join('\n'))
  console.log(JSON.stringify({ proposalPath: outputPath, candidateCount: candidates.length, familyCounts: proposal.familyCounts }, null, 2))
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1 })
