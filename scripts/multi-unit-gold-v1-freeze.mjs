import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateGitSafeArtifact } from './rights-storage.mjs'

export const root=path.resolve(import.meta.dirname,'..')
export const config=JSON.parse(await fs.readFile(path.join(root,'config/multi-unit-gold-v1.json'),'utf8'))
export const publicRoot=path.join(root,'data/processed/review_packages',config.runId)
const semanticRoot='C:/Dev/Document Processor Sources/_processed-private/semantic-evidence-unit-correction-2026-09'
const H=b=>crypto.createHash('sha256').update(b).digest('hex')
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'))
const count=(a,k)=>Object.fromEntries([...a.reduce((m,x)=>m.set(x[k]??'null',(m.get(x[k]??'null')||0)+1),new Map()).entries()].sort())
const codePaths=['config/hybrid-vector-retrieval-experiment.json','scripts/lib/hybrid-vector-retrieval.mjs','scripts/lib/semantic-evidence-units.mjs','scripts/lib/hierarchical-retrieval.mjs','scripts/hybrid-vector-retrieval-experiment.mjs','scripts/embed-local-e5-queries.py']

export async function buildFreeze(){
 const bytes=await fs.readFile(path.join(config.privateRoot,'multi-unit-gold-v1-adjudication.json')),gold=JSON.parse(bytes)
 assert.equal(gold.startingSha,config.startingSha);assert.equal(gold.createdWithoutRetrievalResults,true)
 assert.equal(new Set(gold.adjudications.map(x=>x.caseId)).size,gold.adjudications.length)
 assert.equal(new Set(gold.adjudications.map(x=>x.queryHash)).size,gold.adjudications.length)
 const children=new Map(),parents=new Map(),sourceShas=new Map()
 for(const sourceId of gold.sourceIds){const d=await read(path.join(semanticRoot,sourceId,'semantic-evidence-substantive.json'));sourceShas.set(sourceId,d.source.sourceSha256);for(const x of d.children)children.set(x.childId,x);for(const x of d.parents)parents.set(x.parentId,x)}
 for(const x of gold.adjudications){assert.equal(H(x.query),x.queryHash);assert.ok(!('rank' in x)&&!('score' in x)&&!('similarity' in x));if(x.included){assert.equal(sourceShas.get(x.sourceId),x.sourceSha256);assert.ok(x.acceptedEvidenceSets.length);for(const set of x.acceptedEvidenceSets){assert.equal(H([...set.evidenceIds].sort().join('\n')),set.evidenceSetHash);assert.ok(set.evidenceIds.length);for(const id of set.evidenceIds){const ch=children.get(id);assert.ok(ch,`missing ${id}`);assert.equal(ch.sourceId,x.sourceId);assert.ok(x.acceptedParentIds.includes(ch.parentId));assert.ok(parents.has(ch.parentId))}}}else{assert.equal(x.acceptedEvidenceSets.length,0);assert.ok(['UNSUPPORTED','PARTIALLY_UNSUPPORTED'].includes(x.classification))}}
 const included=gold.adjudications.filter(x=>x.included),multi=included.filter(x=>x.classification==='MULTI_UNIT_REQUIRED'),controls=included.filter(x=>x.classification!=='MULTI_UNIT_REQUIRED'),unsupported=gold.adjudications.filter(x=>x.classification==='UNSUPPORTED'),partial=gold.adjudications.filter(x=>x.classification==='PARTIALLY_UNSUPPORTED')
 assert.deepEqual([multi.length,controls.length,unsupported.length,partial.length,included.filter(x=>x.split==='development').length,included.filter(x=>x.split==='holdout').length],[config.multiUnitCount,config.singleUnitControlCount,config.unsupportedCount,config.partiallyUnsupportedCount,config.developmentCount,config.holdoutCount])
 const cases=gold.adjudications.map(x=>({caseId:x.caseId,queryHash:x.queryHash,split:x.split,classification:x.classification,category:x.category,modality:x.modality,sourceId:x.sourceId,sourceSha256:x.sourceSha256,authoritySupportRole:x.authoritySupportRole,acceptedEvidenceSets:x.acceptedEvidenceSets,acceptedEvidenceSetHashes:x.acceptedEvidenceSetHashes,acceptedParentIds:x.acceptedParentIds,requiredEvidenceRoles:x.requiredEvidenceRoles,citationCoordinates:x.citationCoordinates,partiallySupportedEvidenceIds:x.partiallySupportedEvidenceIds,partiallySupportedCoordinates:x.partiallySupportedCoordinates,reviewerStatus:x.reviewerStatus,included:x.included,queryExternal:true,rationaleExternal:true}))
 const codeArtifacts=[];for(const p of codePaths)codeArtifacts.push({path:p,sha256:H(await fs.readFile(path.join(root,p)))})
 assert.equal(codeArtifacts[0].sha256,config.flatHybridConfigSha256)
 const freeze={schemaVersion:'1.0',evaluationVersion:config.evaluationVersion,runId:config.runId,startingSha:config.startingSha,frozenAt:'2026-09-09T00:00:00.000Z',counts:{multiUnit:multi.length,singleUnitControls:controls.length,unsupported:unsupported.length,partiallyUnsupported:partial.length,development:config.developmentCount,holdout:config.holdoutCount},categoryCounts:count(multi,'category'),sourceCounts:count(included,'sourceId'),modalityCounts:count(included,'modality'),classificationCounts:count(gold.adjudications,'classification'),privateAdjudicationPath:path.join(config.privateRoot,'multi-unit-gold-v1-adjudication.json'),privateAdjudicationSha256:H(bytes),privateAdjudicationByteCount:bytes.length,retrieverArtifacts:codeArtifacts,sidecarProtocol:config.sidecarProtocol,rankingInputExcludesGold:true,noHoldoutTuning:true,retrievalConfigurationUnchanged:true,cases,reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false}
 validateGitSafeArtifact({artifactType:'multi-unit-gold-v1-freeze',value:freeze});await fs.mkdir(publicRoot,{recursive:true});await fs.writeFile(path.join(publicRoot,'gold-freeze.json'),JSON.stringify(freeze,null,2)+'\n');console.log(JSON.stringify(freeze.counts));return freeze
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildFreeze()
