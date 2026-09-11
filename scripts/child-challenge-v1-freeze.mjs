import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repo=path.resolve(import.meta.dirname,'..')
const cfg=JSON.parse(await fs.readFile(path.join(repo,'config/child-challenge-v1.json')))
const privateFile=path.join(cfg.privateRoot,'child-challenge-v1-adjudication.json')
const out=path.join(repo,'data/processed/review_packages',cfg.runId)
const sha=x=>crypto.createHash('sha256').update(x).digest('hex')
const stable=x=>JSON.stringify(x,(_k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v)
const count=(xs,fn)=>Object.fromEntries([...xs.reduce((m,x)=>m.set(fn(x),(m.get(fn(x))||0)+1),new Map)].sort((a,b)=>String(a[0]).localeCompare(String(b[0]))))
const bytes=await fs.readFile(privateFile), gold=JSON.parse(bytes)
assert.equal(gold.createdBeforeChildRerankerImplementation,true)
assert.equal(gold.createdWithoutChildChallengeRankings,true)
assert.equal(new Set(gold.cases.map(x=>x.caseId)).size,gold.cases.length)
assert.equal(new Set(gold.cases.map(x=>x.queryHash)).size,gold.cases.length)
const supported=gold.cases.filter(x=>x.included),controls=gold.cases.filter(x=>x.split==='control')
assert.deepEqual([supported.length,supported.filter(x=>x.split==='development').length,supported.filter(x=>x.split==='holdout').length,controls.length],[48,28,20,12])
const children=new Map(),parents=new Map(),sourceShas=new Map()
for(const sid of gold.sourceIds){const doc=JSON.parse(await fs.readFile(path.join(cfg.semanticRoot,sid,'semantic-evidence-substantive.json')));sourceShas.set(sid,doc.source.sourceSha256);for(const x of doc.children)children.set(x.childId,x);for(const x of doc.parents)parents.set(x.parentId,x)}
for(const x of gold.cases){assert.equal(sha(x.query),x.queryHash);assert.equal(sourceShas.get(x.sourceId),x.sourceSha256);for(const id of x.acceptedTargetIds){const child=children.get(id);assert.ok(child);assert.equal(child.sourceId,x.sourceId);assert.ok(x.acceptedParentIds.includes(child.parentId))};for(const id of x.acceptedParentIds)assert.ok(parents.has(id))}
const protectedPaths=['config/hybrid-vector-retrieval-experiment.json','config/section-challenge-v1.json','scripts/lib/hybrid-vector-retrieval.mjs','scripts/lib/semantic-evidence-units.mjs','scripts/lib/soft-structural-reranker.mjs','data/processed/review_packages/section-challenge-v1-structural-rerank-2026-09/evaluation-freeze.json','data/processed/review_packages/section-challenge-v1-structural-rerank-2026-09/holdout-results.json']
const protectedArtifacts=protectedPaths.map(rel=>({path:rel,sha256:sha(execFileSync('git',['show',`${cfg.startingSha}:${rel}`],{cwd:repo}))}))
for(const x of protectedArtifacts)assert.equal(sha(await fs.readFile(path.join(repo,x.path))),x.sha256)
const projectionCases=gold.cases.map(x=>({caseId:x.caseId,matchedPairId:x.matchedPairId,split:x.split,classification:x.classification,controlClass:x.controlClass,queryHash:x.queryHash,sourceId:x.sourceId,sourceSha256:x.sourceSha256,acceptedTargetIds:x.acceptedTargetIds,acceptedParentIds:x.acceptedParentIds,acceptedAlternativeTargetSets:x.acceptedAlternatives,citationCoordinates:x.citationCoordinates,authoritySupportRole:x.authoritySupportRole,modality:x.modality,caseType:x.caseType,structuralClassifications:x.structuralClassifications,reviewerStatus:x.reviewerStatus,included:x.included,queryExternal:true,rationaleExternal:true}))
const base={schemaVersion:'1.0',evaluationVersion:cfg.evaluationVersion,runId:cfg.runId,startingSha:cfg.startingSha,sourceBranch:cfg.sourceBranch,protocolFrozenAt:'2026-09-11T00:00:00.000Z',counts:{supported:supported.length,development:supported.filter(x=>x.split==='development').length,holdout:supported.filter(x=>x.split==='holdout').length,control:controls.length,matchedPairs:new Set(supported.map(x=>x.matchedPairId)).size},sourceCounts:count(supported,x=>x.sourceId),modalityCounts:count(supported,x=>x.modality),splitCounts:count(supported,x=>x.split),controlCounts:count(controls,x=>x.controlClass),caseTypeCounts:count(supported,x=>x.caseType),candidateCutoffs:{bm25Cutoff:100,vectorCutoff:100,hybridCutoff:100},candidateParentHorizon:cfg.candidateParentHorizon,parentReachabilityDefinition:cfg.parentReachabilityDefinition,childResidualDefinition:cfg.childResidualDefinition,reachabilityCutoffs:cfg.reachabilityCutoffs,successThresholds:cfg.successThresholds,damageBudget:cfg.damageBudget,protectedArtifacts,privateAdjudicationPath:privateFile,privateAdjudicationSha256:sha(bytes),privateAdjudicationByteCount:bytes.length,createdBeforeChildRerankerImplementation:true,createdWithoutChildChallengeRankings:true,rankingInputExcludesGold:true,holdoutAccessProhibitedUntilArchitectureFreeze:true,cases:projectionCases,reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false}
base.rightsSafeProjectionSha256=sha(stable(base.cases))
validateGitSafeArtifact({artifactType:'child-challenge-v1-freeze',value:base})
await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'evaluation-freeze.json'),JSON.stringify(base,null,2)+'\n')
const manifest={schemaVersion:'1.0',runId:cfg.runId,artifactCount:1,totalByteCount:bytes.length,aggregateSha256:sha(stable([{artifactType:'private-child-challenge-adjudication',sha256:sha(bytes),byteCount:bytes.length}])),artifacts:[{artifactType:'private-child-challenge-adjudication',externalPath:privateFile,sha256:sha(bytes),byteCount:bytes.length,rightsStorageStatus:'EXTERNAL_PRIVATE'}],reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false}
validateGitSafeArtifact({artifactType:'child-challenge-v1-manifest',value:manifest});await fs.writeFile(path.join(out,'external-artifact-manifest.json'),JSON.stringify(manifest,null,2)+'\n')
console.log(JSON.stringify({counts:base.counts,sourceCounts:base.sourceCounts,modalityCounts:base.modalityCounts,caseTypeCounts:base.caseTypeCounts,privateSha256:base.privateAdjudicationSha256,projectionSha256:base.rightsSafeProjectionSha256},null,2))
