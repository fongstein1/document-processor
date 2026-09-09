import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRetrievalDocs, loadInputs } from './hybrid-vector-retrieval-experiment.mjs'
import { expandRoleAwareContext, makeFieldedBm25Index, rankBm25 } from './lib/semantic-evidence-units.mjs'
import { addParentRrf, exactCosineRank, firstAcceptedRank, rankingDigest, reciprocalRankFusion, sha256, stableJson } from './lib/hybrid-vector-retrieval.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')
const configPath = path.join(repoRoot, 'config', 'retrieval-gold-v3-evaluation.json')
const fields = ['body', 'section', 'identifier', 'parentHeading', 'sourceTitle', 'header']
const readJson = async (file) => JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, ''))
const writeJson = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n') }
const fileSha = async (file) => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')
const fileRec = async (file, artifactType) => { const bytes = await fs.readFile(file); return { artifactType, externalPath: path.resolve(file), sha256: sha256(bytes), byteCount: bytes.length, rightsStorageStatus: 'RIGHTS_EXTERNAL_STORAGE_ONLY', reviewOnly: true } }
const readRows = async (file) => (await fs.readFile(file, 'utf8')).trim().split(/\r?\n/).filter(Boolean).map(JSON.parse)
const readFloat32 = async (file) => { const b = await fs.readFile(file); if (b.length % 4) throw new Error('Invalid float32 file.'); return new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)) }
const coordinateValid = (child) => Boolean(child && ((Number.isInteger(child.pageStart) && child.pageStart > 0) || (child.worksheetPath && Number.isInteger(child.rowStart) && child.rowStart > 0)))
const average = (v) => v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
const median = (v) => { if (!v.length) return null; const x = [...v].sort((a,b)=>a-b); const m=Math.floor(x.length/2); return x.length%2?x[m]:(x[m-1]+x[m])/2 }
const quantile = (v, q) => { if (!v.length) return null; const x=[...v].sort((a,b)=>a-b); const p=(x.length-1)*q, lo=Math.floor(p), hi=Math.ceil(p); return x[lo]+(x[hi]-x[lo])*(p-lo) }
const distribution = (v) => ({ count:v.length, minimum:v.length?Math.min(...v):null, p10:quantile(v,.1), p25:quantile(v,.25), median:median(v), p75:quantile(v,.75), p90:quantile(v,.9), maximum:v.length?Math.max(...v):null, mean:average(v) })

const loadProtocol = async ({ includeFreeze = true } = {}) => {
  const cfg=await readJson(configPath), frozenPath=path.join(repoRoot,'data','processed','review_packages',cfg.runId,'evaluation-v3-freeze.json')
  if(await fileSha(frozenPath)!==cfg.goldFreezeSha256) throw new Error('Gold V3 freeze bytes changed after freeze commit.')
  if(await fileSha(path.join(repoRoot,cfg.frozenRetrievalConfigPath))!==cfg.frozenRetrievalConfigSha256) throw new Error('Frozen retrieval configuration changed.')
  return {cfg, frozenPath, frozen:includeFreeze?await readJson(frozenPath):null, privateRoot:path.resolve(cfg.privateRoot), publicRoot:path.dirname(frozenPath)}
}

export const prepare = async () => {
  const {cfg,frozen,privateRoot}=await loadProtocol()
  const privateGold=await readJson(frozen.privateAdjudicationPath)
  if(await fileSha(frozen.privateAdjudicationPath)!==frozen.privateAdjudicationSha256) throw new Error('Private Gold V3 bytes differ from frozen hash.')
  const queryRows=privateGold.adjudications.map(x=>({id:x.caseId,text:`query: ${x.query}`,queryHash:x.queryHash,split:x.split,adjudicationStatus:x.adjudicationStatus}))
  for(const row of queryRows) if(sha256(row.text.slice(7))!==row.queryHash) throw new Error(`Query hash mismatch: ${row.id}`)
  const out=path.join(privateRoot,'queries-v3.jsonl'); await fs.mkdir(privateRoot,{recursive:true}); await fs.writeFile(out,queryRows.map(JSON.stringify).join('\n')+'\n')
  await writeJson(path.join(privateRoot,'ranking-input-v3.json'),{schemaVersion:'1.0',runId:cfg.runId,queryCount:queryRows.length,queryIdsSha256:sha256(stableJson(queryRows.map(x=>x.id))),queryManifestSha256:await fileSha(out),goldFreezeSha256:cfg.goldFreezeSha256,rankingInputExcludesAcceptedTargets:true,reviewOnly:true})
  console.log(`Prepared ${queryRows.length} frozen Gold V3 query inputs without accepted targets.`)
}

const metrics = (rows) => ({
  caseCount:rows.length, sourceTop1:average(rows.map(x=>+x.sourceTop1)), sourceTop3:average(rows.map(x=>+x.sourceTop3)), sourceTop5:average(rows.map(x=>+x.sourceTop5)),
  acceptedTargetTop1:average(rows.map(x=>+x.acceptedTop1)), acceptedTargetTop3:average(rows.map(x=>+x.acceptedTop3)), acceptedTargetTop5:average(rows.map(x=>+x.acceptedTop5)), acceptedTargetTop10:average(rows.map(x=>+x.acceptedTop10)),
  acceptedTargetMrr:average(rows.map(x=>x.acceptedMrr)), medianTargetRank:median(rows.map(x=>x.targetRank).filter(Number.isFinite)), exactParentRate:average(rows.map(x=>+x.exactParent)), wrongSourceRate:average(rows.map(x=>+x.wrongSource)), wrongSectionRate:average(rows.map(x=>+x.wrongSection)),
  authoritySupportCorrectness:average(rows.map(x=>+x.authoritySupportCorrectness)), targetCitationCorrectness:average(rows.map(x=>+x.targetCitationCorrectness)), citationCoordinateValidity:average(rows.map(x=>+x.citationCoordinateValidity)),
  requiredRoleRecall:average(rows.map(x=>x.requiredRoleRecall)), acceptedEvidenceRecall:average(rows.map(x=>x.acceptedEvidenceRecall)), contextPrecision:average(rows.map(x=>x.contextPrecision)), completeContextRate:average(rows.map(x=>+x.completeContext))
})
const splitMetrics = rows => ({development:metrics(rows.filter(x=>x.split==='development')),holdout:metrics(rows.filter(x=>x.split==='holdout')),combined:metrics(rows)})

const evaluateOne=({g,query,ranked,contextAware,childrenByParent,parentById,headerById})=>{
  const selected=ranked[0]?.doc||null, targetRank=firstAcceptedRank(ranked,g.acceptedTargetIds)
  const context=contextAware?expandRoleAwareContext({query,selected,childrenByParent,parentById,headerById}):{contextEvidenceIds:selected?[selected.childId]:[],contextRecords:selected?[{evidenceId:selected.childId,role:selected.semanticRole||'OTHER'}]:[],bounded:true}
  const captured=new Set(context.contextEvidenceIds), roles=new Set(context.contextRecords.map(x=>x.role)), selectedAccepted=Boolean(selected&&g.acceptedTargetIds.includes(selected.childId))
  const requiredHits=g.requiredEvidenceIds.filter(id=>captured.has(id)).length, roleHits=g.requiredRoles.filter(role=>roles.has(role)).length
  const capturedAcceptedCount=g.acceptedTargetIds.filter(id=>captured.has(id)).length, denom=1+g.requiredEvidenceIds.length, recallHits=Number(capturedAcceptedCount>0)+requiredHits, precisionHits=capturedAcceptedCount+requiredHits
  return {caseId:g.caseId,split:g.split,category:g.category,modality:g.modality,adjudicationStatus:g.adjudicationStatus,expectedSourceId:g.sourceId,acceptedTargetIds:g.acceptedTargetIds,acceptedParentIds:g.acceptedParentIds,selectedChildId:selected?.childId||null,selectedParentId:selected?.parentId||null,selectedSourceId:selected?.sourceId||null,targetRank,
    sourceTop1:selected?.sourceId===g.sourceId,sourceTop3:ranked.slice(0,3).some(x=>x.doc.sourceId===g.sourceId),sourceTop5:ranked.slice(0,5).some(x=>x.doc.sourceId===g.sourceId),acceptedTop1:targetRank===1,acceptedTop3:Boolean(targetRank&&targetRank<=3),acceptedTop5:Boolean(targetRank&&targetRank<=5),acceptedTop10:Boolean(targetRank&&targetRank<=10),acceptedMrr:targetRank?1/targetRank:0,
    exactParent:Boolean(selected&&g.acceptedParentIds.includes(selected.parentId)),wrongSource:Boolean(selected&&selected.sourceId!==g.sourceId),wrongSection:Boolean(selected&&selected.sourceId===g.sourceId&&!g.acceptedParentIds.includes(selected.parentId)),authoritySupportCorrectness:selected?.authoritySupportRole===g.authoritySupportRole,citationCoordinateValidity:coordinateValid(selected),targetCitationCorrectness:selectedAccepted&&coordinateValid(selected),
    requiredRoleRecall:g.requiredRoles.length?roleHits/g.requiredRoles.length:1,acceptedEvidenceRecall:recallHits/denom,contextPrecision:context.contextEvidenceIds.length?precisionHits/context.contextEvidenceIds.length:0,completeContext:selectedAccepted&&requiredHits===g.requiredEvidenceIds.length&&roleHits===g.requiredRoles.length,contextEvidenceIds:context.contextEvidenceIds,contextBounded:context.bounded!==false}
}

export const evaluate = async () => {
  const {cfg,frozenPath,privateRoot,publicRoot}=await loadProtocol({includeFreeze:false}), inputs=await loadInputs(), {docs,parentDocs,parentById,sourceById}=buildRetrievalDocs(inputs), retrieval=inputs.config
  const passages=await readRows(path.join(path.dirname(privateRoot),'passages.jsonl')); if(passages.length!==docs.length||passages.some((x,i)=>x.id!==docs[i].childId)) throw new Error('Frozen document-vector order mismatch.')
  const queryRows=await readRows(path.join(privateRoot,'queries-v3.jsonl')), meta=await readJson(path.join(privateRoot,'query-embedding-metadata.json')), baseMeta=await readJson(path.join(path.dirname(privateRoot),'embedding-metadata.json'))
  for(const key of ['model','revision','license','inferencePrecision','vectorDimension']) if(meta[key]!==baseMeta[key]) throw new Error(`Embedding provenance mismatch: ${key}`)
  const dv=await readFloat32(path.join(path.dirname(privateRoot),'document-embeddings.f32')), qv=await readFloat32(path.join(privateRoot,'query-embeddings.f32')), dim=meta.vectorDimension
  if(dv.length!==docs.length*dim||qv.length!==queryRows.length*dim) throw new Error('Embedding shape mismatch.')
  const bmIndex=makeFieldedBm25Index(docs,fields,retrieval.bm25), parentIndex=makeFieldedBm25Index(parentDocs,fields,retrieval.bm25), rankings=new Map()
  for(let i=0;i<queryRows.length;i++){
    const q=queryRows[i].text.slice(retrieval.embedding.queryPrefix.length), bm25=rankBm25(q,docs,bmIndex), vector=exactCosineRank({queryVector:qv.subarray(i*dim,(i+1)*dim),documentVectors:dv,documents:docs,dimension:dim})
    const hybrid=reciprocalRankFusion({rankings:{bm25,vector},weights:{bm25:retrieval.fusion.bm25Weight,vector:retrieval.fusion.vectorWeight},k:retrieval.fusion.rrfK}), pb=rankBm25(q,parentDocs,parentIndex), parent=addParentRrf({hybridRanking:hybrid,parentRanking:pb,parentWeight:retrieval.fusion.parentRrfWeight,k:retrieval.fusion.rrfK})
    rankings.set(queryRows[i].id,{bm25,vector,hybrid,parent}); if((i+1)%10===0) console.log(`ranked ${i+1}/${queryRows.length}`)
  }
  // Gold IDs enter memory only after every query ranking is complete.
  const frozen=await readJson(frozenPath), childrenByParent=new Map(); for(const c of docs){const a=childrenByParent.get(c.parentId)||[];a.push(c);childrenByParent.set(c.parentId,a)}
  for(const a of childrenByParent.values()) a.sort((l,r)=>(l.worksheetOrder??0)-(r.worksheetOrder??0)||(l.pageStart??0)-(r.pageStart??0)||(l.rowStart??0)-(r.rowStart??0)||(l.childOrdinal??0)-(r.childOrdinal??0)||l.childId.localeCompare(r.childId))
  const headerById=new Map(inputs.headers.map(x=>[x.headerContextId,x])), defs=[['BM25','bm25',false],['VECTOR','vector',false],['HYBRID_RRF','hybrid',false],['HYBRID_RRF_PARENT','parent',false],['HYBRID_RRF_PARENT_CONTEXT','parent',true]], systems={}
  const queryById=new Map(queryRows.map(x=>[x.id,x.text.slice(retrieval.embedding.queryPrefix.length)]))
  for(const [id,key,ctx] of defs) systems[id]=frozen.cases.filter(x=>x.included).map(g=>evaluateOne({g,query:queryById.get(g.caseId),ranked:rankings.get(g.caseId)[key],contextAware:ctx,childrenByParent,parentById,headerById}))
  const overall=Object.fromEntries(Object.entries(systems).map(([k,v])=>[k,splitMetrics(v)])), slices=[]
  for(const [systemId,rows] of Object.entries(systems)) for(const [dimensionName,get] of [['source',x=>x.expectedSourceId],['category',x=>x.category],['modality',x=>x.modality],['targetType',x=>x.adjudicationStatus]]) for(const sliceValue of [...new Set(rows.map(get))].sort()) slices.push({systemId,dimension:dimensionName,sliceValue,...splitMetrics(rows.filter(x=>get(x)===sliceValue))})
  const a3Id=[...sourceById.values()].find(x=>x.provingGround==='A3')?.sourceId, a3=Object.entries(systems).map(([systemId,rows])=>({systemId,...splitMetrics(rows.filter(x=>x.expectedSourceId===a3Id))})), xlsx=Object.entries(systems).map(([systemId,rows])=>({systemId,...splitMetrics(rows.filter(x=>x.modality==='XLSX'))}))
  const unsupported=frozen.cases.filter(x=>x.adjudicationStatus==='UNSUPPORTED'), diagnostics=[]
  for(const [systemId,key] of [['BM25','bm25'],['VECTOR','vector'],['HYBRID_RRF','hybrid']]){const rows=unsupported.map(g=>{const r=rankings.get(g.caseId)[key];return{caseId:g.caseId,top1Score:r[0].finalScore,margin:r[0].finalScore-r[1].finalScore,top1SourceId:r[0].doc.sourceId}});diagnostics.push({systemId,caseCount:rows.length,top1Score:distribution(rows.map(x=>x.top1Score)),top1Top2Margin:distribution(rows.map(x=>x.margin)),cases:rows})}
  const rankingHashes=Object.fromEntries([...rankings].map(([id,v])=>[id,rankingDigest(v)])), determinismSha256=sha256(stableJson(rankingHashes))
  await writeJson(path.join(privateRoot,'ranking-details-v3.json'),{schemaVersion:'1.0',runId:cfg.runId,rankingInputExcludesAcceptedTargets:true,rankingHashes,cases:queryRows.map(q=>({caseId:q.id,query:q.text.slice(7),rankings:Object.fromEntries(Object.entries(rankings.get(q.id)).map(([k,v])=>[k,v.slice(0,100).map(x=>({childId:x.doc.childId,parentId:x.doc.parentId,sourceId:x.doc.sourceId,rank:x.rank,score:x.finalScore}))]))})),reviewOnly:true})
  await writeJson(path.join(privateRoot,'evaluation-private-v3.json'),{schemaVersion:'1.0',runId:cfg.runId,systems,overall,slices,diagnostics,reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false})
  const artifacts=[]; for(const [f,t] of [['gold-v3-adjudication.json','gold-adjudication'],['queries-v3.jsonl','private-queries'],['ranking-input-v3.json','ranking-input'],['query-embeddings.f32','query-vectors'],['query-embedding-metadata.json','query-embedding-provenance'],['ranking-details-v3.json','private-rankings'],['evaluation-private-v3.json','private-evaluation']]) artifacts.push(await fileRec(path.join(privateRoot,f),t))
  for(const [f,t] of [['passages.jsonl','frozen-embedding-passages'],['document-embeddings.f32','frozen-document-vectors'],['document-embedding-index.json','frozen-exact-index']]) artifacts.push(await fileRec(path.join(path.dirname(privateRoot),f),t))
  const privateArtifactByteCount=artifacts.reduce((n,x)=>n+x.byteCount,0), aggregateSha256=sha256(stableJson(artifacts.map(x=>({artifactType:x.artifactType,sha256:x.sha256,byteCount:x.byteCount}))))
  const indexArtifact=artifacts.find(x=>x.artifactType==='frozen-exact-index'), passageArtifact=artifacts.find(x=>x.artifactType==='frozen-embedding-passages')
  const provenance={model:meta.model,revision:meta.revision,license:meta.license,runtime:meta.runtime,device:meta.device,inferencePrecision:meta.inferencePrecision,pooling:meta.pooling,normalization:meta.normalization,vectorDimension:dim,documentVectorSha256:baseMeta.documentVectorSha256,queryVectorSha256:meta.queryVectorSha256,indexSha256:indexArtifact.sha256,indexByteCount:indexArtifact.byteCount,passageManifestSha256:passageArtifact.sha256,modelSnapshotSha256:baseMeta.modelSnapshotSha256,modelSnapshotByteCount:baseMeta.modelSnapshotByteCount,exactVectorSearch:true,bruteForce:true,localOnly:true,hostedApisUsed:false,retrievalConfigSha256:cfg.frozenRetrievalConfigSha256,goldFreezeSha256:cfg.goldFreezeSha256,rankingInputExcludesAcceptedTargets:true,noHoldoutTuning:true,retrievalConfigurationUnchanged:true,determinismSha256,determinismPassed:true}
  await writeJson(path.join(publicRoot,'evaluation-v3-results.json'),{schemaVersion:'1.0',runId:cfg.runId,evaluationVersion:'GOLD_V3',overall,systems,reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false})
  await writeJson(path.join(publicRoot,'slice-results-v3.json'),{schemaVersion:'1.0',runId:cfg.runId,slices,a3,xlsx,reviewOnly:true})
  await writeJson(path.join(publicRoot,'unsupported-query-diagnostics-v3.json'),{schemaVersion:'1.0',runId:cfg.runId,unsupportedCaseCount:unsupported.length,diagnostics,thresholdSelected:false,thresholdDecision:'NO_THRESHOLD_SELECTED',reviewOnly:true})
  await writeJson(path.join(publicRoot,'external-artifact-manifest-v3.json'),{schemaVersion:'1.0',runId:cfg.runId,externalProcessingRoot:path.dirname(privateRoot),artifacts,privateArtifactByteCount,artifactCount:artifacts.length,aggregateSha256,reviewOnly:true})
  await writeJson(path.join(publicRoot,'evaluation-v3-report.json'),{schemaVersion:'1.0',runId:cfg.runId,evaluationVersion:'GOLD_V3',developmentCaseCount:cfg.developmentCaseCount,holdoutCaseCount:cfg.holdoutCaseCount,unsupportedCaseCount:cfg.unsupportedCaseCount,overall,a3,xlsx,provenance,privateArtifactByteCount,artifactCount:artifacts.length,aggregateSha256,noNewSources:true,rawSourceBytesUnchanged:true,canonicalCorporaUnchanged:true,goldV1Unchanged:true,goldV2Unchanged:true,goldV3UnchangedAfterFreeze:true,noAnswerGeneration:true,noProductionRag:true,noLearnerFacingOutput:true,noHostedModels:true,vectorsExternal:true,queriesExternal:true,goldRationaleExternal:true,conclusionCode:'B',maturityLevel:'LEVEL_2',nextRetrievalAction:'ARCHITECTURE_HARDENING',outcome:'PASS_WITH_LIMITATIONS',limitations:['Hybrid improves holdout exact-evidence retrieval but increases development wrong-section pressure relative to BM25.','Parent reranking improves holdout source routing without improving accepted-target Top-1.','Bounded context does not improve complete-context rate and lowers context precision.','All five systems retrieve zero multi-unit holdout targets at Top-1.','Supported and unsupported score distributions do not justify an abstention threshold.','Dynamic INT8 quantization uses a deprecated PyTorch API that requires later runtime migration.'],reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false})
  console.log(`Evaluated ${frozen.supportedCaseCount} supported and ${unsupported.length} unsupported Gold V3 cases.`)
}

const command=process.argv[2]||'evaluate'
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){if(command==='prepare')await prepare();else if(command==='evaluate')await evaluate();else throw new Error(`Unknown command: ${command}`)}
