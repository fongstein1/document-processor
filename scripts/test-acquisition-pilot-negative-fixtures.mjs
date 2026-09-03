import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { recomputePilotChecks } from './validate-approved-acquisition-pilot.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'data', 'processed', 'review_packages', 'acquisition-pilot-2026-09-02')
const read = async (name) => JSON.parse(await fs.readFile(path.join(out, name), 'utf8'))
const main = async () => {
  const base = { acquisition: await readExternalManifest(), authorization: await readExternalAuthorization(), inventory: await read('source-inventory.json'), extraction: await read('extraction-output.json'), chunks: await read('chunk-manifest.json'), indexes: await read('source-index-candidates.json'), smoke: await read('retrieval-smoke-tests.json'), review: await read('review-packet.json'), report: await read('validation-report.json') }
  const fixtures = [
    ['sha-lineage', (x) => { const old = x.inventory.items[0].fileHash; x.inventory.items[0].fileHash = '0'.repeat(64); return () => { x.inventory.items[0].fileHash = old } }, 'rawShaLineage'],
    ['source-identity-binding', (x) => { const old = x.inventory.items[0].sourceId; x.inventory.items[0].sourceId = 'wrong-source'; return () => { x.inventory.items[0].sourceId = old } }, 'sourceIdentityBinding'],
    ['duplicate-chunk-id', (x) => { const old = x.chunks.chunks[1].chunkId; x.chunks.chunks[1].chunkId = x.chunks.chunks[0].chunkId; return () => { x.chunks.chunks[1].chunkId = old } }, 'deterministicIds'],
    ['structured-evidence-id-uniqueness', (x) => { const all = x.indexes.sourceIndexes.flatMap((i) => i.extensions?.structuredEvidence || []); const old = all[1].structuredEvidenceId; all[1].structuredEvidenceId = all[0].structuredEvidenceId; return () => { all[1].structuredEvidenceId = old } }, 'structuredEvidenceIdentity'],
    ['review-only-promotion-boundary', (x) => { const old = x.review.ragReadiness.ready; x.review.ragReadiness.ready = true; return () => { x.review.ragReadiness.ready = old } }, 'reviewOnlyGuardrails'],
    ['retrieval-sha-assertion', (x) => { const test = x.smoke.tests.flatMap((s) => s.tests).find((t) => t.expectedMatch); const old = test.selectedSourceSha256; test.selectedSourceSha256 = '0'.repeat(64); return () => { test.selectedSourceSha256 = old } }, 'retrievalShaAssertions'],
    ['retrieval-role-assertion', (x) => { const test = x.smoke.tests.flatMap((s) => s.tests).find((t) => t.expectedMatch); const old = test.selectedAuthorityRole; test.selectedAuthorityRole = 'INCORRECT_ROLE'; return () => { test.selectedAuthorityRole = old } }, 'retrievalRoleAssertions'],
    ['a2-wrong-numeric-value', (x) => { const test = x.smoke.tests.flatMap((s) => s.tests).find((t) => t.testKind === 'numeric_or_form'); const old = test.expectedWorkbookEvidence.expectedStoredValue; test.expectedWorkbookEvidence.expectedStoredValue = '__wrong_numeric_value__'; return () => { test.expectedWorkbookEvidence.expectedStoredValue = old } }, 'a2NumericAssertions'],
    ['source-exception-aggregation', (x) => { const item = x.review.extractedItems.find((i) => i.sourceId === 'naic-pbr-vm-20-vm-31-vm-51-vmv-rates-2026'); const old = { outcome: item.outcome, exceptionCode: item.exceptionCode, reviewFlags: item.reviewFlags }; item.outcome = 'CLEAN_REVIEW_CANDIDATE'; item.exceptionCode = 'NONE'; item.reviewFlags = []; return () => { Object.assign(item, old) } }, 'sourceExceptionAggregation'],
  ]
  for (const [name, mutate, failedControl] of fixtures) {
    const restore = mutate(base)
    const result = await recomputePilotChecks(base)
    restore()
    if (result[failedControl] !== false) throw new Error('Negative fixture did not fail ' + failedControl + ': ' + name)
  }
  const chainMutations = [
    ['chain-worksheet-exception', (x) => { const s = x.extraction.sourceGroups.find((g) => g.sourceId.includes('vmv-rates-2026')).sheets.find((s) => s.name === 'LEGAL DISCLAIMER'); s.contentInventory.exceptionCode = null; return () => { s.contentInventory.exceptionCode = 'XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW' } }],
    ['chain-chunk-flag', (x) => { const all = x.chunks.chunks.filter((c) => c.sourceId.includes('vmv-rates-2026')); const old = all.map((c) => c.reviewFlags); all.forEach((c) => { c.reviewFlags = [] }); return () => { all.forEach((c, i) => { c.reviewFlags = old[i] }) } }],
    ['chain-review-outcome', (x) => { const i = x.review.extractedItems.find((i) => i.sourceId.includes('vmv-rates-2026')); const old = i.outcome; i.outcome = 'CLEAN_REVIEW_CANDIDATE'; return () => { i.outcome = old } }],
    ['chain-packet-flag', (x) => { const old = x.review.exceptionsAndFlags; x.review.exceptionsAndFlags = old.filter((f) => !f.sourceId.includes('vmv-rates-2026')); return () => { x.review.exceptionsAndFlags = old } }],
    ['chain-unresolved-issue', (x) => { const old = x.review.unresolvedIssues; x.review.unresolvedIssues = old.filter((f) => !f.sourceId.includes('vmv-rates-2026')); return () => { x.review.unresolvedIssues = old } }],
    ['chain-summary-count', (x) => { const old = x.report.summary.humanReviewRequired; x.report.summary.humanReviewRequired = old - 1; return () => { x.report.summary.humanReviewRequired = old } }],
  ]
  for (const [name, mutate] of chainMutations) { const restore = mutate(base); const result = await recomputePilotChecks(base); restore(); if (result.sourceExceptionAggregation !== false) throw new Error('Propagation-chain fixture did not fail: ' + name) }
  console.log('Passed negative acquisition-pilot fixtures: SHA lineage, source identity, duplicate chunk ID, structured-evidence uniqueness, retrieval SHA/role/numeric assertions, review-only boundary, and six A2 propagation-chain breaks.')
}
const readExternalManifest = async () => JSON.parse(await fs.readFile('C:\\Dev\\Document Processor Sources\\2026-09-02 Intake\\_acquisition-manifests\\approved-pilot-20260902\\final-20260902\\acquisition-manifest.json', 'utf8'))
const readExternalAuthorization = async () => { const a = await readExternalManifest(); return JSON.parse(await fs.readFile(path.resolve(a.authorizationManifestPath), 'utf8')) }
main().catch((error) => { console.error(error.message); process.exitCode = 1 })
