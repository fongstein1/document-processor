import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'acquisition-pilot-2026-09-02')
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const exists = async (filePath) => fs.access(filePath).then(() => true).catch(() => false)
const sha256 = async (filePath) => crypto.createHash('sha256').update(await fs.readFile(filePath)).digest('hex')
const fail = (message) => { throw new Error(message) }

const main = async () => {
  const required = ['batch-manifest.json', 'source-inventory.json', 'extraction-output.json', 'chunk-manifest.json', 'source-index-candidates.json', 'retrieval-smoke-tests.json', 'review-packet.json', 'review-packet.md', 'validation-report.json', 'unresolved-issues-summary.md', 'a1-quarantine-evidence.md']
  for (const file of required) if (!(await exists(path.join(outputRoot, file)))) fail('Missing acquisition pilot artifact: ' + file)
  const batch = await readJson(path.join(outputRoot, 'batch-manifest.json'))
  const inventory = await readJson(path.join(outputRoot, 'source-inventory.json'))
  const chunks = await readJson(path.join(outputRoot, 'chunk-manifest.json'))
  const indexes = await readJson(path.join(outputRoot, 'source-index-candidates.json'))
  const smoke = await readJson(path.join(outputRoot, 'retrieval-smoke-tests.json'))
  const review = await readJson(path.join(outputRoot, 'review-packet.json'))
  const report = await readJson(path.join(outputRoot, 'validation-report.json'))
  if (batch.batchId !== 'acquisition-pilot-2026-09-02' || batch.extensions?.a1Excluded !== true) fail('Invalid pilot identity or A1 exclusion.')
  if (batch.extensions?.authorizedProcessingScope !== 'ADMIT_TO_PROCESSING_QUEUE only') fail('Processing scope is not admitted-only.')
  if (inventory.items.length !== 7 || indexes.sourceIndexes.length !== 7 || smoke.tests.length !== 7 || review.sourceFilesProcessed.length !== 7) fail('Output does not contain exactly seven admitted sources.')
  const ids = inventory.items.map((item) => item.sourceId)
  if (new Set(ids).size !== ids.length || ids.some((id) => id.includes('pbr-plenary-amendments-current'))) fail('Duplicate source IDs or A1 leakage detected.')
  const chunkIds = chunks.chunks.map((chunk) => chunk.chunkId)
  if (!chunkIds.length || new Set(chunkIds).size !== chunkIds.length) fail('Chunk IDs are missing or duplicated.')
  if (smoke.tests.some((test) => !test.allPassed || test.tests.some((item) => !item.pass || !item.citationResolves || !item.supportRolePreserved))) fail('Retrieval smoke-test regression failed.')
  if (review.learnerFacingStatus.ready || review.ragReadiness.ready || review.appExportReadiness.ready || review.promotionRecommendation.status !== 'not_recommended') fail('Downstream eligibility or promotion guardrail was opened.')
  if (report.status !== 'pass' || report.checks.rawShaLineage !== true || report.checks.reviewOnlyGuardrails !== true) fail('Processing validation report is not passing.')
  for (const item of inventory.items) {
    if (!(await exists(item.filePath))) fail('Raw source is missing: ' + item.sourceId)
    if (await sha256(item.filePath) !== item.fileHash) fail('Raw source SHA mismatch: ' + item.sourceId)
  }
  const workbook = indexes.sourceIndexes.find((index) => index.source.sourceId === 'naic-pbr-vm-20-vm-31-vm-51-vmv-rates-2026')
  if (!workbook || (workbook.extensions?.structuredEvidence?.length ?? 0) !== 5) fail('A2 workbook structured evidence is incomplete.')
  if (indexes.sourceIndexes.some((index) => index.processing?.reviewOnly !== true || index.processing?.promotionStatus !== 'not_promoted' || index.chunks.some((chunk) => chunk.promotionEligible !== false))) fail('A source-index candidate is not review-only/not-promoted.')
  console.log('Validated low-touch acquisition processing pilot: 7 sources, ' + chunks.chunks.length + ' chunks, 7/7 smoke-test sources passed, no promotion.')
}
main().catch((error) => { console.error(error.message); process.exitCode = 1 })
