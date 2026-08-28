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
  if (inventory.summary.canonicalSourcePackages !== 24 || inventory.summary.canonicalChunks !== 592) fail('Inventory snapshot does not include the complete current VM-30 review package; regenerate intentionally.')
  if (inventory.summary.promotedCanonicalPackages !== 8 || inventory.summary.promotedCanonicalChunks !== 331) fail('Inventory does not reflect the scope-specific VM-01, VM-20, and VM-31 promotions.')
  if (inventory.summary.vm01Definitions !== 98 || inventory.summary.vm01RetrievalUnits !== 98 || inventory.summary.vm01PromotionStatus !== 'promoted' || inventory.summary.vm01RelationshipCandidates !== 29) fail('Inventory does not reflect the promoted VM-01 definition scope and separately governed relationships.')
  const vm01Target = inventory.corpusTargets.find((target) => target.targetId === 'vm-01')
  if (vm01Target?.assessment !== 'canonical_complete' || !vm01Target.evidenceSourceIds.includes('vm01-definitions')) fail('VM-01 target does not record its promoted canonical package.')
  if (inventory.summary.vm30StructuralParents !== 8 || inventory.summary.vm30ChildUnits !== 43 || inventory.summary.vm30PromotionStatus !== 'not_promoted' || inventory.summary.vm30RelationshipCandidates !== 16) fail('Inventory does not reflect the review-only VM-30 hierarchy and separately governed relationship registry.')
  const vm30Target = inventory.corpusTargets.find((target) => target.targetId === 'vm-30')
  if (vm30Target?.assessment !== 'canonical_review_candidate' || !vm30Target.evidenceSourceIds.includes('vm30-current-manual')) fail('VM-30 target does not record its canonical review candidate.')
  if (inventory.summary.vm31StructuralParents !== 9 || inventory.summary.vm31ChildUnits !== 75 || inventory.summary.vm31PromotionStatus !== 'promoted' || inventory.summary.vm31RelationshipCandidates !== 92) fail('Inventory does not reflect the promoted VM-31 hierarchy and separately governed relationship registry.')
  const vm31Target = inventory.corpusTargets.find((target) => target.targetId === 'vm-31')
  if (vm31Target?.assessment !== 'canonical_complete' || !vm31Target.evidenceSourceIds.includes('vm31-current-manual')) fail('VM-31 target does not record its promoted canonical package.')
  const vm20Target = inventory.corpusTargets.find((target) => target.targetId === 'vm-20')
  if (vm20Target?.assessment !== 'canonical_promoted_prose_and_tables') fail('VM-20 target does not record the separately promoted prose and structured-table scopes.')
  const tableTarget = inventory.corpusTargets.find((target) => target.targetId === 'current-regulatory-tables')
  if (tableTarget?.assessment !== 'canonical_promoted_partial_vm20_appendix2' || tableTarget.evidenceSourceIds.length !== 7) fail('Current regulatory-table target does not reflect the promoted available VM-20 Appendix 2 scope.')
  if (inventory.summary.structuredTableLogicalTables !== 7 || inventory.summary.structuredTableVersions !== 29 || inventory.summary.structuredTableRows !== 891 || inventory.summary.structuredTableValues !== 7022 || inventory.summary.structuredTablePromotionStatus !== 'promoted' || inventory.summary.promotedStructuredTableLogicalTables !== 7 || inventory.summary.structuredTablePromotionDecisionPath !== 'data/manual-input/promotion-decisions/vm20-appendix2-structured-table-promotion.json') fail('Structured-table promotion inventory summary is inconsistent.')
  const vm20ManualRecord = inventory.sources.find((source) => source.filename === 'pbr_data_valuation_manual_2026.pdf')
  if (!vm20ManualRecord?.review?.promotionRecordPaths?.includes('data/manual-input/promotion-decisions/vm20-2026-prose-promotion.json') || !vm20ManualRecord.review.promotionRecordPaths.includes('data/manual-input/promotion-decisions/vm01-2026-definitions-promotion.json') || !vm20ManualRecord.review.promotionRecordPaths.includes('data/manual-input/promotion-decisions/vm31-2026-current-manual-promotion.json') || vm20ManualRecord.review.copilotExportEligible !== false) fail('Valuation Manual inventory promotion records or export boundary are missing.')
  if (inventory.summary.candidateRelationships !== 160 || inventory.summary.promotedRelationships !== 0) fail('Relationship governance counts are inconsistent with the review-only Reg-213, VM-01, VM-30, and VM-31 registries.')
  for (const file of ['master-regulatory-corpus-inventory.md', 'regulatory-gap-assessment.md', 'canonicalization-backlog.md', 'corpus-completeness-report.md']) {
    try { await fs.access(path.join(path.dirname(inventoryPath), file)) } catch { fail(`Missing corpus report: ${file}.`) }
  }
  console.log(`Validated regulatory corpus inventory for ${inventory.sources.length} sources and ${inventory.corpusTargets.length} targets.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
