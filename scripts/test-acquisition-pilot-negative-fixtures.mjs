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
    ['source-exception-aggregation', (x) => { const item = x.review.extractedItems.find((i) => i.sourceId === 'naic-pbr-vm-20-vm-31-vm-51-vmv-rates-2026'); const old = { outcome: item.outcome, exceptionCode: item.exceptionCode, reviewFlags: item.reviewFlags }; item.outcome = 'CLEAN_REVIEW_CANDIDATE'; item.exceptionCode = 'NONE'; item.reviewFlags = []; return () => { Object.assign(item, old) } }, 'sourceExceptionAggregation'],
  ]
  for (const [name, mutate, failedControl] of fixtures) {
    const restore = mutate(base)
    const result = await recomputePilotChecks(base)
    restore()
    if (result[failedControl] !== false) throw new Error('Negative fixture did not fail ' + failedControl + ': ' + name)
  }
  console.log('Passed negative acquisition-pilot fixtures: SHA lineage, source identity, duplicate chunk ID, structured-evidence uniqueness, review-only boundary, and source exception aggregation.')
}
const readExternalManifest = async () => JSON.parse(await fs.readFile('C:\\Dev\\Document Processor Sources\\2026-09-02 Intake\\_acquisition-manifests\\approved-pilot-20260902\\final-20260902\\acquisition-manifest.json', 'utf8'))
const readExternalAuthorization = async () => { const a = await readExternalManifest(); return JSON.parse(await fs.readFile(path.resolve(a.authorizationManifestPath), 'utf8')) }
main().catch((error) => { console.error(error.message); process.exitCode = 1 })
