import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const inventoryPath = path.join(repoRoot, 'data', 'processed', 'regulatory_corpus', 'master-regulatory-corpus-inventory.json')
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const fail = (message) => { throw new Error(message) }

const main = async () => {
  const inventory = await readJson(inventoryPath)
  if (inventory.schemaVersion !== '1.0') fail('Unexpected regulatory corpus inventory schema version.')
  if (!Array.isArray(inventory.sources) || inventory.sources.length === 0) fail('Inventory must contain sources.')
  if (!Array.isArray(inventory.corpusTargets) || inventory.corpusTargets.length === 0) fail('Inventory must contain corpus targets.')
  const sourceIds = inventory.sources.map((source) => source.sourceId)
  if (new Set(sourceIds).size !== sourceIds.length) fail('Inventory source IDs must be unique.')
  for (const source of inventory.sources) {
    if (!['P0', 'P1', 'P2', 'P3'].includes(source.priority.level)) fail(`Invalid priority for ${source.sourceId}.`)
    if (source.review.copilotExportEligible !== false) fail(`Copilot export must remain ineligible for ${source.sourceId}.`)
    if (source.review.canonical && source.processing.canonicalPackages.length === 0) fail(`Canonical source ${source.sourceId} has no package path.`)
    if (source.processing.chunkCount < 0) fail(`Negative chunk count for ${source.sourceId}.`)
  }
  const targetIds = inventory.corpusTargets.map((target) => target.targetId)
  if (new Set(targetIds).size !== targetIds.length) fail('Corpus target IDs must be unique.')
  for (const priority of ['P0', 'P1', 'P2', 'P3']) {
    if (!inventory.corpusTargets.some((target) => target.priority === priority)) fail(`Inventory is missing ${priority} targets.`)
  }
  if (inventory.summary.canonicalSourcePackages < 20 || inventory.summary.canonicalChunks < 247) fail('Inventory snapshot does not include the expanded VM-20 canonical coverage packages; regenerate intentionally.')
  if (inventory.summary.promotedCanonicalPackages !== 6 || inventory.summary.promotedCanonicalChunks !== 149) fail('Inventory does not reflect the scope-specific VM-20 prose promotion.')
  const vm20Target = inventory.corpusTargets.find((target) => target.targetId === 'vm-20')
  if (vm20Target?.assessment !== 'canonical_promoted_prose') fail('VM-20 target does not record promoted prose with structured tables still separate.')
  const vm20ManualRecord = inventory.sources.find((source) => source.filename === 'pbr_data_valuation_manual_2026.pdf')
  if (!vm20ManualRecord?.review?.promotionRecordPaths?.includes('data/manual-input/promotion-decisions/vm20-2026-prose-promotion.json') || vm20ManualRecord.review.copilotExportEligible !== false) fail('VM-20 inventory promotion record or export boundary is missing.')
  if (inventory.summary.candidateRelationships !== 23 || inventory.summary.promotedRelationships !== 0) fail('Relationship governance counts are inconsistent with the review-only Reg-213 registry.')
  for (const file of ['master-regulatory-corpus-inventory.md', 'regulatory-gap-assessment.md', 'canonicalization-backlog.md', 'corpus-completeness-report.md']) {
    try { await fs.access(path.join(path.dirname(inventoryPath), file)) } catch { fail(`Missing corpus report: ${file}.`) }
  }
  console.log(`Validated regulatory corpus inventory for ${inventory.sources.length} sources and ${inventory.corpusTargets.length} targets.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
