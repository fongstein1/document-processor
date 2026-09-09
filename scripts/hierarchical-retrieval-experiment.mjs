import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { buildRetrievalDocs } from './hybrid-vector-retrieval-experiment.mjs'
import { makeFieldedBm25Index, rankBm25 } from './lib/semantic-evidence-units.mjs'
import { exactCosineRank, reciprocalRankFusion, sha256, stableJson } from './lib/hybrid-vector-retrieval.mjs'
import { hierarchicalRank, assembleEvidence } from './lib/hierarchical-retrieval.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

export const root = path.resolve(import.meta.dirname, '..')
export const runId = 'hierarchical-retrieval-hardening-2026-09'
export const publicRoot = path.join(root, 'data/processed/review_packages', runId)
export const privateBase = 'C:/Dev/Document Processor Sources/_processed-private/hybrid-vector-retrieval-experiment-2026-09'
export const privateRoot = path.join(privateBase, runId)
const semanticRoot = 'C:/Dev/Document Processor Sources/_processed-private/semantic-evidence-unit-correction-2026-09'
const semanticPublic = path.join(root, 'data/processed/review_packages/semantic-evidence-unit-correction-2026-09')
const goldPublic = path.join(root, 'data/processed/review_packages/retrieval-gold-v3-expansion-2026-09')
const fields = ['body','section','identifier','parentHeading','sourceTitle','header']
export const read = async file => JSON.parse(await fs.readFile(file, 'utf8'))
export const hash = async file => sha256(await fs.readFile(file))
export const write = async (file, value, isPublic = false) => {
  const allowed = path.resolve(isPublic ? publicRoot : privateRoot)
  const relative = path.relative(allowed, path.resolve(file))
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Output outside approved run root')
  if (isPublic) validateGitSafeArtifact({ artifactType: path.basename(file), value })
  await fs.mkdir(path.dirname(file), { recursive: true })
  const realRelative = path.relative(await fs.realpath(allowed), await fs.realpath(path.dirname(file)))
  assert(!realRelative.startsWith('..') && !path.isAbsolute(realRelative), 'Output traverses an external link')
  assert.equal(path.resolve(await fs.realpath(allowed)), allowed, 'Run root must not be a symlink or junction')
  await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n')
}
const governance = { reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
const codeFiles = ['config/hierarchical-retrieval-hardening.json','scripts/lib/hierarchical-retrieval.mjs','scripts/hierarchical-retrieval-experiment.mjs','scripts/lib/hybrid-vector-retrieval.mjs','scripts/lib/semantic-evidence-units.mjs','scripts/hybrid-vector-retrieval-experiment.mjs','config/hybrid-vector-retrieval-experiment.json','scripts/test-hierarchical-retrieval.mjs']
const codeHashes = async () => Promise.all(codeFiles.map(async p => ({ path:p, sha256:sha256((await fs.readFile(path.join(root,p),'utf8')).replace(/\r\n/g,'\n')) })))
const floats = async file => { const b = await fs.readFile(file); assert.equal(b.length%4,0); return new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)) }
export async function loadCorpus() {
  const sources = (await read(path.join(semanticPublic,'architecture-v2-source-records.json'))).sources, substantive=[]
  for (const source of sources) {
    const file=path.join(semanticRoot,source.sourceId,'semantic-evidence-substantive.json')
    assert.equal(await hash(file),source.externalArtifactSha256)
    const p=await read(file); assert.equal(p.reviewOnly,true); assert.equal(p.promotionStatus,'not_promoted'); assert.equal(p.ragReadyAllowed,false); substantive.push(p)
  }
  return { sources, substantive, children:substantive.flatMap(x=>x.children), parents:substantive.flatMap(x=>x.parents), headers:substantive.flatMap(x=>x.headerContexts), parentContexts:substantive.flatMap(x=>x.parentContexts) }
}
async function checkedInputs() {
  const config=await read(path.join(root,'config/hierarchical-retrieval-hardening.json'))
  const oldConfig=await read(path.join(root,'config/retrieval-gold-v3-evaluation.json'))
  assert.equal(await hash(path.join(goldPublic,'evaluation-v3-freeze.json')),oldConfig.goldFreezeSha256)
  assert.equal(await hash(path.join(root,oldConfig.frozenRetrievalConfigPath)),oldConfig.frozenRetrievalConfigSha256)
  const manifest=await read(path.join(goldPublic,'external-artifact-manifest-v3.json'))
  for(const a of manifest.artifacts.filter(a=>['frozen-document-vectors','query-vectors','private-queries','frozen-exact-index','gold-adjudication'].includes(a.artifactType))) assert.equal(await hash(a.externalPath),a.sha256)
  const corpus=await loadCorpus(), built=buildRetrievalDocs(corpus)
  const index=await read(path.join(privateBase,'document-embedding-index.json'))
  assert.deepEqual(index.childIds,built.docs.map(x=>x.childId))
  return {config,oldConfig,corpus,...built,retrieval:await read(path.join(root,oldConfig.frozenRetrievalConfigPath))}
}
export async function rankSplit(split) {
  assert(['development','holdout'].includes(split))
  if(split==='holdout') await verifyFreeze()
  const input=await checkedInputs(), {config,corpus,docs,parentDocs,parentById,retrieval}=input
  const queries=(await fs.readFile(path.join(privateBase,'gold-v3/queries-v3.jsonl'),'utf8')).trim().split(/\r?\n/).map(JSON.parse)
  const dv=await floats(path.join(privateBase,'document-embeddings.f32')),qv=await floats(path.join(privateBase,'gold-v3/query-embeddings.f32'))
  const dim=768;assert.equal(dv.length,docs.length*dim);assert.equal(qv.length,queries.length*dim)
  const bi=makeFieldedBm25Index(docs,fields,retrieval.bm25),pi=makeFieldedBm25Index(parentDocs,fields,retrieval.bm25)
  const headerById=new Map(corpus.headers.map(x=>[x.headerContextId,x])),contextById=new Map(corpus.parentContexts.map(x=>[x.parentContextId,x])),cases=[]
  for(let i=0;i<queries.length;i++) {
    const envelope=queries[i];if(envelope.split!==split)continue
    // Only the query string and matching vector cross the ranking interface.
    const query=envelope.text.slice(retrieval.embedding.queryPrefix.length); assert.equal(sha256(query),envelope.queryHash)
    const bm25=rankBm25(query,docs,bi),vector=exactCosineRank({queryVector:qv.subarray(i*dim,(i+1)*dim),documentVectors:dv,documents:docs,dimension:dim})
    const flat=reciprocalRankFusion({rankings:{bm25,vector},weights:{bm25:1,vector:1},k:60})
    const parentBm25=rankBm25(query,parentDocs,pi)
    const b=hierarchicalRank({query,parentBm25,vector,bm25,parentById,config}),c=hierarchicalRank({query,parentBm25,vector,bm25,parentById,config,exactRouting:true})
    const packageD=assembleEvidence({query,retrieval:c,headerById,parentById,contextById,config})
    const pack=ranking=>ranking.length?[{evidenceId:ranking[0].doc.childId,parentId:ranking[0].doc.parentId,sourceId:ranking[0].doc.sourceId,role:ranking[0].doc.semanticRole,characterCount:ranking[0].doc.body.length}]:[]
    const serialize=(systemId,r,records,parentIds=[])=>({systemId,ranking:r.map(x=>({childId:x.doc.childId,rank:x.rank,score:x.finalScore})),records,parentIds})
    cases.push({caseId:envelope.id,queryHash:envelope.queryHash,needs:c.needs,exactRoutingApplied:c.exactRoutingApplied,systems:[serialize('A',flat,pack(flat)),serialize('B',b.ranked,pack(b.ranked),b.parentIds),serialize('C',c.ranked,pack(c.ranked),c.parentIds),serialize('D',c.ranked,packageD.records,c.parentIds)]})
    console.log(`ranked ${split} ${cases.length}`)
  }
  await write(path.join(privateRoot,`${split}-rankings.json`),{schemaVersion:'1.0',runId,split,cases,...governance})
  return cases
}

const rateKeys=['sourceTop1','acceptedTop1','acceptedTop3','acceptedTop5','acceptedTop10','exactParent','wrongSource','wrongSection','authoritySupportCorrectness','targetCitationCorrectness','citationCoordinateValidity','completeContext']
export function summarize(rows) {
  const result={caseCount:rows.length}
  for(const key of rateKeys) {result[key]=rows.length?rows.filter(r=>r[key]).length/rows.length:null;result[`${key}Count`]=rows.filter(r=>r[key]).length}
  for(const key of ['acceptedMrr','acceptedEvidenceRecall','contextPrecision','requiredRoleRecall']) result[key]=rows.length?rows.reduce((n,r)=>n+r[key],0)/rows.length:null
  return result
}
export function scoreCase(g,s,childById) {
  const selected=childById.get(s.ranking[0]?.childId),ids=new Set(s.records.map(x=>x.evidenceId)),roles=new Set(s.records.map(x=>x.role))
  const rank=s.ranking.find(x=>g.acceptedTargetIds.includes(x.childId))?.rank||null
  const accepted=g.acceptedTargetIds.filter(id=>ids.has(id)).length,required=g.requiredEvidenceIds.filter(id=>ids.has(id)).length
  const valid=!!selected&&(Number.isInteger(selected.pageStart)||!!selected.worksheetPath&&Number.isInteger(selected.rowStart))
  const relevant=new Set([...g.acceptedTargetIds,...g.requiredEvidenceIds])
  return {caseId:g.caseId,systemId:s.systemId,split:g.split,category:g.category,modality:g.modality,adjudicationStatus:g.adjudicationStatus,expectedSourceId:g.sourceId,selectedChildId:selected?.childId||null,selectedParentId:selected?.parentId||null,contextEvidenceIds:[...ids],targetRank:rank,
    sourceTop1:selected?.sourceId===g.sourceId,acceptedTop1:rank===1,acceptedTop3:!!rank&&rank<=3,acceptedTop5:!!rank&&rank<=5,acceptedTop10:!!rank&&rank<=10,acceptedMrr:rank?1/rank:0,exactParent:!!selected&&g.acceptedParentIds.includes(selected.parentId),wrongSource:!!selected&&selected.sourceId!==g.sourceId,wrongSection:!!selected&&selected.sourceId===g.sourceId&&!g.acceptedParentIds.includes(selected.parentId),authoritySupportCorrectness:selected?.authoritySupportRole===g.authoritySupportRole,citationCoordinateValidity:valid,targetCitationCorrectness:rank===1&&valid,
    completeContext:accepted>0&&required===g.requiredEvidenceIds.length,acceptedEvidenceRecall:(Number(accepted>0)+required)/(1+g.requiredEvidenceIds.length),contextPrecision:ids.size?[...ids].filter(id=>relevant.has(id)).length/ids.size:0,requiredRoleRecall:g.requiredRoles.length?g.requiredRoles.filter(r=>roles.has(r)).length/g.requiredRoles.length:1}
}
export async function scoreSplit(split) {
  if(split==='holdout') await verifyFreeze()
  const ranked=await read(path.join(privateRoot,`${split}-rankings.json`))
  const gold=(await read(path.join(goldPublic,'evaluation-v3-freeze.json'))).cases.filter(x=>x.split===split&&x.included)
  const corpus=await loadCorpus(),childById=new Map(corpus.children.map(x=>[x.childId,x])),rows=[]
  for(const g of gold){const r=ranked.cases.find(x=>x.caseId===g.caseId);assert(r);assert.equal(g.queryHash,r.queryHash);for(const s of r.systems)rows.push(scoreCase(g,s,childById))}
  const baseline=(await read(path.join(goldPublic,'evaluation-v3-results.json'))).systems.HYBRID_RRF.filter(x=>x.split===split)
  for(const b of baseline){const r=rows.find(x=>x.systemId==='A'&&x.caseId===b.caseId);assert.equal(r.targetRank,b.targetRank,'Flat baseline rank changed');assert.equal(r.selectedChildId,b.selectedChildId,'Flat baseline selection changed')}
  const systems=['A','B','C','D'].map(systemId=>({systemId,metrics:summarize(rows.filter(x=>x.systemId===systemId))}))
  const sourceSlices=[]
  for(const systemId of ['A','B','C','D']) for(const dimension of ['adjudicationStatus','expectedSourceId','category','modality']) for(const sliceValue of [...new Set(rows.map(x=>x[dimension]))].sort())sourceSlices.push({systemId,dimension,sliceValue,metrics:summarize(rows.filter(x=>x.systemId===systemId&&x[dimension]===sliceValue))})
  const report={schemaVersion:'1.0',runId,split,systems,sourceSlices,cases:rows,rankingInputExcludesGold:true,noHoldoutTuning:true,...governance}
  await write(path.join(publicRoot,`${split}-results.json`),report,true)
  console.log(JSON.stringify(systems))
  return report
}
export async function freezeProtocol() {
  const dev=await read(path.join(publicRoot,'development-results.json'));assert.equal(dev.systems[0].metrics.caseCount,36)
  await assert.rejects(fs.access(path.join(publicRoot,'architecture-freeze.json')))
  await write(path.join(publicRoot,'architecture-freeze.json'),{schemaVersion:'1.0',runId,startingSha:'ffb651669d17e7334117a9c664d1290e0aeda36c',artifacts:await codeHashes(),goldFreezeSha256:await hash(path.join(goldPublic,'evaluation-v3-freeze.json')),sha256:await hash(path.join(publicRoot,'development-results.json')),noHoldoutTuning:true,...governance},true)
}
export async function verifyFreeze() {
  const file=path.join(publicRoot,'architecture-freeze.json'),freeze=await read(file)
  assert.deepEqual(await codeHashes(),freeze.artifacts,'Architecture changed after freeze')
  const rel=path.relative(root,file).replaceAll('\\','/')
  const committed=execFileSync('git',['show',`HEAD:${rel}`],{cwd:root,encoding:'utf8'})
  assert.deepEqual(JSON.parse(committed),freeze,'Freeze must be committed before holdout')
  assert.equal(await hash(path.join(goldPublic,'evaluation-v3-freeze.json')),freeze.goldFreezeSha256)
  assert.equal(await hash(path.join(publicRoot,'development-results.json')),freeze.sha256,'Development evidence changed after freeze')
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [command,split]=process.argv.slice(2)
  if(command==='rank')await rankSplit(split)
  else if(command==='score')await scoreSplit(split)
  else if(command==='freeze')await freezeProtocol()
  else throw new Error('Use rank/score development/holdout, or freeze')
}
