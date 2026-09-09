import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')
const config = JSON.parse(await fs.readFile(path.join(repoRoot, 'config', 'retrieval-gold-v3-evaluation.json'), 'utf8'))
const publicRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', config.runId)
const privateFile = path.join(config.privateRoot, 'gold-v3-adjudication.json')
const semanticRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', 'semantic-evidence-unit-correction-2026-09')
const shaBytes = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = async (file) => JSON.parse(await fs.readFile(file, 'utf8'))
const countBy = (rows, key) => Object.fromEntries([...rows.reduce((m,row)=>m.set(row[key] ?? 'null',(m.get(row[key] ?? 'null')||0)+1),new Map()).entries()].sort())
const rankingKeys = new Set(['rank','score','similarity','margin','top1','top3','top5','top10','mrr','selectedChildId','retrievalScore'])
const scanRankingLeakage = (value, location='root') => {
  if (Array.isArray(value)) return value.flatMap((item,index)=>scanRankingLeakage(item,`${location}[${index}]`))
  if (!value || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([key,item]) => rankingKeys.has(key) ? [`${location}.${key}`] : scanRankingLeakage(item,`${location}.${key}`))
}

export const buildGoldV3Freeze = async () => {
  const frozenConfigBytes = await fs.readFile(path.join(repoRoot, config.frozenRetrievalConfigPath))
  assert.equal(shaBytes(frozenConfigBytes), config.frozenRetrievalConfigSha256, 'Frozen retrieval configuration changed')
  const privateBytes = await fs.readFile(privateFile)
  const gold = JSON.parse(privateBytes)
  assert.equal(gold.startingSha, config.startingSha)
  assert.deepEqual(scanRankingLeakage(gold), [], 'Gold contains ranking leakage')
  assert.equal(new Set(gold.adjudications.map(c=>c.caseId)).size, gold.adjudications.length, 'Duplicate case IDs')
  assert.equal(new Set(gold.adjudications.map(c=>c.queryHash)).size, gold.adjudications.length, 'Duplicate query hashes')
  for (const item of gold.adjudications) assert.equal(shaBytes(Buffer.from(item.query,'utf8')), item.queryHash, `Query hash mismatch ${item.caseId}`)

  const children = new Map()
  const parents = new Map()
  const sourceShas = new Map()
  for (const sourceId of gold.sourceIds) {
    const doc = await read(path.join(semanticRoot, sourceId, 'semantic-evidence-substantive.json'))
    sourceShas.set(sourceId, doc.source.sourceSha256)
    for (const child of doc.children) children.set(child.childId, child)
    for (const parent of doc.parents) parents.set(parent.parentId, parent)
  }
  const supported = gold.adjudications.filter(c=>c.included)
  const unsupported = gold.adjudications.filter(c=>c.adjudicationStatus==='UNSUPPORTED')
  assert.equal(supported.length, config.supportedCaseCount)
  assert.equal(unsupported.length, config.unsupportedCaseCount)
  assert.equal(supported.filter(c=>c.split==='development').length, config.developmentCaseCount)
  assert.equal(supported.filter(c=>c.split==='holdout').length, config.holdoutCaseCount)
  assert.ok(supported.every(c=>c.adjudicationStatus!=='UNSUPPORTED' && c.split!=='unsupported' && c.sourceId && c.acceptedTargetChildIds.length))
  assert.ok(unsupported.every(c=>!c.included && c.split==='unsupported' && c.sourceId===null && c.acceptedTargetChildIds.length===0 && c.acceptedParentIds.length===0))
  assert.equal(new Set(supported.filter(c=>c.split==='development').map(c=>c.caseId)).size + new Set(supported.filter(c=>c.split==='holdout').map(c=>c.caseId)).size, supported.length)
  for (const item of supported) {
    assert.equal(sourceShas.get(item.sourceId), item.sourceSha256, `Source SHA mismatch ${item.caseId}`)
    for (const id of item.acceptedTargetChildIds) {
      const child=children.get(id); assert.ok(child, `Missing target ${id}`); assert.equal(child.sourceId,item.sourceId); assert.ok(item.acceptedParentIds.includes(child.parentId), `Parent lineage mismatch ${id}`)
    }
    for (const req of item.requiredSupportingEvidence) {
      const child=children.get(req.evidenceId); assert.ok(child,`Missing support ${req.evidenceId}`); assert.equal(child.sourceId,item.sourceId); assert.equal(child.parentId,req.parentId); assert.ok(parents.has(req.parentId))
    }
  }
  const publicCases = gold.adjudications.map(item => ({
    caseId:item.caseId, split:item.split, category:item.category, modality:item.modality,
    queryHash:item.queryHash, sourceId:item.sourceId, sourceSha256:item.sourceSha256,
    authoritySupportRole:item.authoritySupportRole, acceptedTargetIds:item.acceptedTargetChildIds,
    acceptedParentIds:item.acceptedParentIds, requiredEvidenceIds:item.requiredSupportingEvidence.map(r=>r.evidenceId),
    requiredRoles:item.requiredSupportingEvidence.map(r=>r.role), targetCoordinates:item.citationCoordinates,
    adjudicationStatus:item.adjudicationStatus, included:item.included, reviewerStatus:item.reviewerStatus,
    queryExternal:true, rationaleExternal:true
  }))
  const freeze = {
    schemaVersion:'3.0', evaluationVersion:'GOLD_V3', runId:config.runId, startingSha:config.startingSha,
    frozenAt:'2026-09-08T00:00:00.000Z', sourceIds:gold.sourceIds,
    supportedCaseCount:supported.length, unsupportedCaseCount:unsupported.length,
    developmentCaseCount:supported.filter(c=>c.split==='development').length,
    holdoutCaseCount:supported.filter(c=>c.split==='holdout').length,
    sourceCounts:countBy(supported,'sourceId'), categoryCounts:countBy(supported,'category'),
    modalityCounts:countBy(supported,'modality'), adjudicationCounts:countBy(gold.adjudications,'adjudicationStatus'),
    privateAdjudicationPath:privateFile, privateAdjudicationSha256:shaBytes(privateBytes), privateAdjudicationByteCount:privateBytes.length,
    frozenRetrievalConfigSha256:config.frozenRetrievalConfigSha256, finalGoldSelectionUsesRegex:false,
    rankingInputExcludesGold:true, noHoldoutTuning:true, retrievalConfigurationUnchanged:true,
    cases:publicCases, reviewOnly:true, promotionStatus:'not_promoted', ragReadyAllowed:false
  }
  validateGitSafeArtifact({artifactType:'gold-v3-freeze',value:freeze})
  await fs.mkdir(publicRoot,{recursive:true})
  await fs.writeFile(path.join(publicRoot,'evaluation-v3-freeze.json'),JSON.stringify(freeze,null,2)+'\n','utf8')
  console.log(JSON.stringify({publicFile:path.join(publicRoot,'evaluation-v3-freeze.json'),supported:supported.length,unsupported:unsupported.length,development:freeze.developmentCaseCount,holdout:freeze.holdoutCaseCount,privateSha256:freeze.privateAdjudicationSha256},null,2))
  return freeze
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) await buildGoldV3Freeze()
