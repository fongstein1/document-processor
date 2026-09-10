import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { buildRetrievalDocs, loadInputs } from './hybrid-vector-retrieval-experiment.mjs'
import { exactCosineRank, reciprocalRankFusion, stableJson } from './lib/hybrid-vector-retrieval.mjs'
import { makeFieldedBm25Index, rankBm25 } from './lib/semantic-evidence-units.mjs'
import { buildDeepUnion, rerankDeepUnion } from './lib/soft-structural-reranker.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')
const cfgPath = path.join(repoRoot, 'config/section-challenge-v1.json')
const cfg = JSON.parse(await fs.readFile(cfgPath, 'utf8'))
const retrieval = JSON.parse(await fs.readFile(path.join(repoRoot, cfg.frozenRetrievalConfigPath), 'utf8'))
const publicRoot = path.join(repoRoot, 'data/processed/review_packages', cfg.runId)
const privateRoot = path.resolve(cfg.privateRoot)
const goldFile = path.join(privateRoot, 'section-challenge-v1-adjudication.json')
const fields = ['body','section','identifier','parentHeading','sourceTitle','header']
const sha = value => crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : String(value)).digest('hex')
const read = async file => JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, ''))
const write = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n') }
const writeRows = async (file, rows) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, rows.map(x=>JSON.stringify(x)).join('\n') + '\n') }
const rows = async file => (await fs.readFile(file,'utf8')).trim().split(/\r?\n/).filter(Boolean).map(JSON.parse)
const floats = async file => { const b=await fs.readFile(file); assert.equal(b.length%4,0); const c=Buffer.from(b); return new Float32Array(c.buffer,c.byteOffset,c.byteLength/4) }
const round = (value, digits=6) => value === null || value === undefined ? null : Number(value.toFixed(digits))
const rate = (n,d) => d ? round(n/d) : null
const average = values => values.length ? values.reduce((a,b)=>a+b,0)/values.length : null
const countBy = (items, fn) => Object.fromEntries([...items.reduce((m,x)=>m.set(fn(x),(m.get(fn(x))||0)+1),new Map()).entries()].sort((a,b)=>String(a[0]).localeCompare(String(b[0]))))
const fileRecord = async (file, artifactType) => { const b=await fs.readFile(file); return { artifactType, externalPath:path.resolve(file), sha256:sha(b), byteCount:b.length, rightsStorageStatus:'EXTERNAL_PRIVATE' } }

async function assertProtected() {
  const paths=['config/hybrid-vector-retrieval-experiment.json','scripts/lib/hybrid-vector-retrieval.mjs','scripts/lib/semantic-evidence-units.mjs','scripts/hybrid-vector-retrieval-experiment.mjs','data/processed/review_packages/retrieval-gold-v3-expansion-2026-09/evaluation-v3-freeze.json','data/processed/review_packages/multi-unit-gold-v1-2026-09/gold-freeze.json']
  for(const rel of paths){const expected=execFileSync('git',['show',`${cfg.startingSha}:${rel}`],{cwd:repoRoot});assert.equal(sha(await fs.readFile(path.join(repoRoot,rel))),sha(expected),`Protected file changed: ${rel}`)}
}

async function prepare() {
  await assertProtected()
  const gold=await read(goldFile)
  const byMode={development:[],holdout:[],diagnostic:[]}
  for(const item of gold.cases){const mode=item.split;byMode[mode].push({id:item.caseId,text:retrieval.embedding.queryPrefix+item.query,queryHash:item.queryHash})}
  for(const [mode,items] of Object.entries(byMode)){assert.equal(new Set(items.map(x=>x.id)).size,items.length);await writeRows(path.join(privateRoot,mode,'queries.jsonl'),items)}
  const manifest={schemaVersion:'1.0',runId:cfg.runId,queryFiles:Object.fromEntries(await Promise.all(Object.keys(byMode).map(async mode=>{const f=path.join(privateRoot,mode,'queries.jsonl'),b=await fs.readFile(f);return [mode,{queryCount:byMode[mode].length,queryIdsSha256:sha(stableJson(byMode[mode].map(x=>x.id))),queryManifestSha256:sha(b),externalPath:f}]}))),rankingInputExcludesGold:true,runtimeFields:['id','text','queryHash'],reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false}
  await write(path.join(privateRoot,'ranking-input-manifest.json'),manifest)
  console.log(JSON.stringify({prepared:Object.fromEntries(Object.entries(byMode).map(([k,v])=>[k,v.length]))},null,2))
}

async function loadRuntime(mode) {
  assert.ok(['development','holdout','diagnostic'].includes(mode))
  if(mode==='holdout'){
    const freeze=await read(path.join(publicRoot,'architecture-freeze.json'))
    assert.equal(freeze.holdoutAccessedBeforeFreeze,false)
    for(const item of freeze.implementationArtifacts) assert.equal(sha(await fs.readFile(path.join(repoRoot,item.path))),item.sha256,`Architecture changed after freeze: ${item.path}`)
  }
  const inputs=await loadInputs(), built=buildRetrievalDocs(inputs)
  const queryRows=await rows(path.join(privateRoot,mode,'queries.jsonl'))
  assert.ok(queryRows.every(x=>Object.keys(x).sort().join(',')==='id,queryHash,text'))
  const queryVectors=await floats(path.join(privateRoot,mode,'query-embeddings.f32'))
  const documentVectors=await floats(path.join(cfg.vectorRoot,'document-embeddings.f32'))
  const vectorIndex=await read(path.join(cfg.vectorRoot,'document-embedding-index.json'))
  assert.deepEqual(vectorIndex.childIds,built.docs.map(x=>x.childId))
  assert.equal(queryVectors.length,queryRows.length*768)
  const bmIndex=makeFieldedBm25Index(built.docs,fields,retrieval.bm25)
  return {built,queryRows,queryVectors,documentVectors,bmIndex}
}

const serialize = ranked => ranked.slice(0,100).map(x=>({childId:x.doc.childId,parentId:x.doc.parentId,sourceId:x.doc.sourceId,semanticRole:x.doc.semanticRole,rank:x.rank,score:x.finalScore}))
const serializeStructural = ranked => ranked.map(x=>({childId:x.doc.childId,parentId:x.doc.parentId,sourceId:x.doc.sourceId,semanticRole:x.doc.semanticRole,rank:x.rank,finalScore:x.finalScore,baseSignal:x.baseSignal,componentRanks:x.ranks,origins:x.origins,confidence:x.structural.confidence,structuralBonus:x.structural.bonus,structuralPenalty:x.structural.penalty,structuralAdjustment:x.structural.adjustment,features:x.structural.features}))

async function computeRankings(mode) {
  const {built,queryRows,queryVectors,documentVectors,bmIndex}=await loadRuntime(mode)
  const cases=[]
  for(let i=0;i<queryRows.length;i++){
    const q=queryRows[i], query=q.text.slice(retrieval.embedding.queryPrefix.length)
    assert.equal(sha(query),q.queryHash)
    const bm25=rankBm25(query,built.docs,bmIndex)
    const vector=exactCosineRank({queryVector:queryVectors.subarray(i*768,(i+1)*768),documentVectors,documents:built.docs,dimension:768})
    const hybrid=reciprocalRankFusion({rankings:{bm25,vector},weights:{bm25:retrieval.fusion.bm25Weight,vector:retrieval.fusion.vectorWeight},k:retrieval.fusion.rrfK})
    const union=buildDeepUnion({bm25,vector,hybrid,cutoffs:cfg.candidateCutoffs})
    const structural=rerankDeepUnion({query,union,parentById:built.parentById,bounds:cfg.structuralScoreBounds})
    cases.push({caseId:q.id,queryHash:q.queryHash,query,queryPlan:structural.plan,unionSize:union.length,rankings:{bm25:serialize(bm25),vector:serialize(vector),hybrid:serialize(hybrid),structural:serializeStructural(structural.ranked)}})
  }
  return {schemaVersion:'1.0',runId:cfg.runId,mode,cases,rankingInputFields:['id','text','queryHash'],rankingInputExcludesGold:true,acceptedTargetsReceivedByRuntime:false,acceptedParentsReceivedByRuntime:false,expectedSourceReceivedByRuntime:false,goldClassificationReceivedByRuntime:false,splitLabelReceivedByRuntime:false,evaluatorOracleReceivedByRuntime:false,reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false}
}

async function rank(mode) {
  const artifact=await computeRankings(mode), file=path.join(privateRoot,mode,'rankings.json')
  await write(file,artifact)
  console.log(JSON.stringify({mode,caseCount:artifact.cases.length,rankingSha256:sha(await fs.readFile(file))},null,2))
}

const firstRank=(ranking,accepted)=>ranking.find(x=>accepted.has(x.childId))?.rank||null
const uniqueRank=(ranking,key,accepted)=>{const seen=new Set();let rank=0;for(const x of ranking){if(seen.has(x[key]))continue;seen.add(x[key]);rank++;if(accepted.has(x[key]))return rank}return null}
const stage=(ranking,gold)=>{const top=ranking[0];if(!top)return'OTHER';if(gold.acceptedTargetIds.includes(top.childId))return'SUCCESS';if(top.sourceId!==gold.sourceId)return'SOURCE_MISS';if(!gold.acceptedParentIds.includes(top.parentId))return'RIGHT_SOURCE_WRONG_PARENT';return'RIGHT_PARENT_WRONG_CHILD'}
const metrics=(cases,system)=>{const rows=cases.map(x=>x.systems[system]);return{caseCount:rows.length,targetReachability:Object.fromEntries(cfg.reachabilityCutoffs.map(k=>[`top${k}`,rate(rows.filter(x=>x.targetRank&&x.targetRank<=k).length,rows.length)])),sourceTop1:rate(rows.filter(x=>x.sourceRank===1).length,rows.length),sourceTop3:rate(rows.filter(x=>x.sourceRank&&x.sourceRank<=3).length,rows.length),parentTop1:rate(rows.filter(x=>x.parentRank===1).length,rows.length),parentTop3:rate(rows.filter(x=>x.parentRank&&x.parentRank<=3).length,rows.length),parentTop10:rate(rows.filter(x=>x.parentRank&&x.parentRank<=10).length,rows.length),failureStages:countBy(rows,x=>x.failureStage)}}
const slice = (cases,fn) => ({A_BM25:metrics(cases,'bm25'),B_VECTOR:metrics(cases,'vector'),C_HYBRID:metrics(cases,'hybrid'),D_STRUCTURAL:metrics(cases,'structural'),caseCount:cases.length,sliceValue:fn})

const assessThresholds = ({ summaries, slices, effects }) => {
  const hybrid = summaries.C_HYBRID
  const structural = summaries.D_STRUCTURAL
  const identifierAbsentHybrid = slices.identifierAbsent.C_HYBRID
  const identifierAbsentStructural = slices.identifierAbsent.D_STRUCTURAL
  const identifierPresentHybrid = slices.identifierPresent.C_HYBRID
  const identifierPresentStructural = slices.identifierPresent.D_STRUCTURAL
  const baselineCorrect = effects.previouslyCorrectTop1Count
  const lostRate = baselineCorrect ? effects.previouslyCorrectTop1DamagedCount / baselineCorrect : 0
  const netWrongSectionRescues = effects.wrongSectionRescueCount - effects.parentCorrectToWrongCount
  const success = {
    identifierAbsentTargetTop1AbsoluteImprovement: round(identifierAbsentStructural.targetReachability.top1 - identifierAbsentHybrid.targetReachability.top1),
    parentTop1AbsoluteImprovement: round(structural.parentTop1 - hybrid.parentTop1),
    wrongSectionRescues: effects.wrongSectionRescueCount,
    netWrongSectionRescues
  }
  const damage = {
    previouslyCorrectTop1LostCount: effects.previouslyCorrectTop1DamagedCount,
    previouslyCorrectTop1LostRate: round(lostRate),
    sourceTop1AbsoluteRegression: round(Math.max(0, hybrid.sourceTop1 - structural.sourceTop1)),
    sourceCorrectToWrongCount: effects.sourceCorrectToWrongCount,
    identifierPresentTop1AbsoluteRegression: round(Math.max(0, identifierPresentHybrid.targetReachability.top1 - identifierPresentStructural.targetReachability.top1)),
    identifierPresentDamagedCount: effects.identifierPresentDamagedCount,
    parentCorrectToWrongCount: effects.parentCorrectToWrongCount
  }
  const successChecks = {
    identifierAbsentImprovementMet: success.identifierAbsentTargetTop1AbsoluteImprovement >= cfg.successThresholds.identifierAbsentTargetTop1AbsoluteImprovementMinimum,
    parentImprovementMet: success.parentTop1AbsoluteImprovement >= cfg.successThresholds.parentTop1AbsoluteImprovementMinimum,
    wrongSectionRescuesMet: success.wrongSectionRescues >= cfg.successThresholds.wrongSectionRescuesMinimum,
    netWrongSectionRescuesMet: success.netWrongSectionRescues >= cfg.successThresholds.netWrongSectionRescuesMinimum
  }
  const damageChecks = {
    correctTop1LostCountWithinBudget: damage.previouslyCorrectTop1LostCount <= cfg.damageBudget.previouslyCorrectTop1LostMaximumCount,
    correctTop1LostRateWithinBudget: damage.previouslyCorrectTop1LostRate <= cfg.damageBudget.previouslyCorrectTop1LostMaximumRate,
    sourceTop1RegressionWithinBudget: damage.sourceTop1AbsoluteRegression <= cfg.damageBudget.sourceTop1AbsoluteRegressionMaximum,
    sourceCorrectToWrongWithinBudget: damage.sourceCorrectToWrongCount <= cfg.damageBudget.sourceCorrectToWrongMaximumCount,
    identifierPresentRegressionWithinBudget: damage.identifierPresentTop1AbsoluteRegression <= cfg.damageBudget.identifierPresentTop1AbsoluteRegressionMaximum,
    identifierPresentDamageWithinBudget: damage.identifierPresentDamagedCount <= cfg.damageBudget.identifierPresentDamagedMaximumCount,
    parentCorrectToWrongWithinBudget: damage.parentCorrectToWrongCount <= cfg.damageBudget.parentCorrectToWrongMaximumCount
  }
  return {
    successThresholds: cfg.successThresholds,
    damageBudget: cfg.damageBudget,
    observedSuccess: success,
    observedDamage: damage,
    successChecks,
    damageChecks,
    successThresholdsPassed: Object.values(successChecks).every(Boolean),
    damageBudgetPassed: Object.values(damageChecks).every(Boolean)
  }
}

async function score(mode) {
  const rankArtifact=await read(path.join(privateRoot,mode,'rankings.json'))
  assert.equal(rankArtifact.rankingInputExcludesGold,true)
  const gold=await read(goldFile), goldById=new Map(gold.cases.map(x=>[x.caseId,x]))
  const scored=[]
  for(const item of rankArtifact.cases){const g=goldById.get(item.caseId);assert.ok(g);if(!g.included)continue;const accepted=new Set(g.acceptedTargetIds),parents=new Set(g.acceptedParentIds);const systems={};for(const name of ['bm25','vector','hybrid','structural']){const ranking=item.rankings[name];systems[name]={targetRank:firstRank(ranking,accepted),sourceRank:uniqueRank(ranking,'sourceId',new Set([g.sourceId])),parentRank:uniqueRank(ranking,'parentId',parents),failureStage:stage(ranking,g),topChildId:ranking[0]?.childId||null,topSourceId:ranking[0]?.sourceId||null,topParentId:ranking[0]?.parentId||null}}
    const h=systems.hybrid,s=systems.structural
    const rerankEffect=!h.targetRank&&!s.targetRank?'UNCHANGED_ABSENT':!h.targetRank?'IMPROVED':!s.targetRank?'WORSENED':s.targetRank<h.targetRank?'IMPROVED':s.targetRank>h.targetRank?'WORSENED':'UNCHANGED'
    const unionTarget=item.rankings.structural.find(x=>accepted.has(x.childId))
    scored.push({caseId:g.caseId,matchedPairId:g.matchedPairId,split:g.split,sourceId:g.sourceId,modality:g.modality,structuralClassifications:g.structuralClassifications,systems,unionSize:item.unionSize,unionTargetReachable:Boolean(unionTarget),unionTargetOrigins:unionTarget?.origins||[],rerankEffect,sourceChanged:h.topSourceId!==s.topSourceId,parentChanged:h.topParentId!==s.topParentId,wrongSectionRescued:h.failureStage==='RIGHT_SOURCE_WRONG_PARENT'&&s.failureStage==='SUCCESS',previouslyCorrectTop1Damaged:h.failureStage==='SUCCESS'&&s.failureStage!=='SUCCESS',sourceCorrectToWrong:h.sourceRank===1&&s.sourceRank!==1,parentCorrectToWrong:h.parentRank===1&&s.parentRank!==1,childRankingResidual:s.parentRank&&s.parentRank<=10&&(!s.targetRank||s.targetRank>10),top100Absent:!unionTarget})}
  const summaries={A_BM25:metrics(scored,'bm25'),B_VECTOR:metrics(scored,'vector'),C_HYBRID:metrics(scored,'hybrid'),D_STRUCTURAL:metrics(scored,'structural')}
  const slices={identifierPresent:slice(scored.filter(x=>x.structuralClassifications.identifierPresence==='PRESENT'),'IDENTIFIER_PRESENT'),identifierAbsent:slice(scored.filter(x=>x.structuralClassifications.identifierPresence==='ABSENT'),'IDENTIFIER_ABSENT'),direct:slice(scored.filter(x=>x.structuralClassifications.phrasing==='DIRECT'),'DIRECT'),paraphrased:slice(scored.filter(x=>x.structuralClassifications.phrasing==='PARAPHRASED'),'PARAPHRASED'),shortUnanchored:slice(scored.filter(x=>x.structuralClassifications.shortUnanchored),'SHORT_UNANCHORED'),multipart:slice(scored.filter(x=>x.structuralClassifications.multipart),'MULTIPART'),siblingPressure:slice(scored.filter(x=>x.structuralClassifications.siblingPressure),'SIBLING_PRESSURE'),a3:slice(scored.filter(x=>x.sourceId==='naic-accounting-publications-appm-2026'),'A3'),pdf:slice(scored.filter(x=>x.modality==='PDF'),'PDF'),xlsx:slice(scored.filter(x=>x.modality==='XLSX'),'XLSX'),seedDeepReachable:slice(scored.filter(x=>x.structuralClassifications.seedReachabilityClass==='DEEP_REACHABLE_11_100'),'SEED_DEEP_REACHABLE'),seedTop100Absent:slice(scored.filter(x=>x.structuralClassifications.seedReachabilityClass==='TOP100_ABSENT'),'SEED_TOP100_ABSENT')}
  const baselineCorrect=scored.filter(x=>x.systems.hybrid.failureStage==='SUCCESS'), damaged=scored.filter(x=>x.previouslyCorrectTop1Damaged), wrongRescues=scored.filter(x=>x.wrongSectionRescued), sourceRegressions=scored.filter(x=>x.sourceCorrectToWrong),parentRegressions=scored.filter(x=>x.parentCorrectToWrong),anchoredDamaged=scored.filter(x=>x.structuralClassifications.identifierPresence==='PRESENT'&&x.previouslyCorrectTop1Damaged)
  const effects={improvedRankCount:scored.filter(x=>x.rerankEffect==='IMPROVED').length,worsenedRankCount:scored.filter(x=>x.rerankEffect==='WORSENED').length,unchangedRankCount:scored.filter(x=>x.rerankEffect.startsWith('UNCHANGED')).length,sourceChangedCount:scored.filter(x=>x.sourceChanged).length,parentChangedCount:scored.filter(x=>x.parentChanged).length,wrongSectionRescueCount:wrongRescues.length,previouslyCorrectTop1Count:baselineCorrect.length,previouslyCorrectTop1RetainedCount:baselineCorrect.length-damaged.length,previouslyCorrectTop1DamagedCount:damaged.length,sourceCorrectToWrongCount:sourceRegressions.length,parentCorrectToWrongCount:parentRegressions.length,identifierPresentDamagedCount:anchoredDamaged.length,childRankingResidualCount:scored.filter(x=>x.childRankingResidual).length,top100AbsentCount:scored.filter(x=>x.top100Absent).length}
  const union={averageUnionSize:round(average(scored.map(x=>x.unionSize))),maximumUnionSize:Math.max(...scored.map(x=>x.unionSize)),unionReachability:rate(scored.filter(x=>x.unionTargetReachable).length,scored.length),bm25OnlyRescueCount:scored.filter(x=>x.unionTargetOrigins.length===1&&x.unionTargetOrigins[0]==='bm25').length,vectorOnlyRescueCount:scored.filter(x=>x.unionTargetOrigins.length===1&&x.unionTargetOrigins[0]==='vector').length,hybridOnlyRescueCount:scored.filter(x=>x.unionTargetOrigins.length===1&&x.unionTargetOrigins[0]==='hybrid').length}
  const publicCases=scored.map(x=>({caseId:x.caseId,matchedPairId:x.matchedPairId,sourceId:x.sourceId,modality:x.modality,structuralClassifications:x.structuralClassifications,systems:{A_BM25:x.systems.bm25,B_VECTOR:x.systems.vector,C_HYBRID:x.systems.hybrid,D_STRUCTURAL:x.systems.structural},unionSize:x.unionSize,unionTargetReachable:x.unionTargetReachable,unionTargetOrigins:x.unionTargetOrigins,rerankEffect:x.rerankEffect,sourceChanged:x.sourceChanged,parentChanged:x.parentChanged,wrongSectionRescued:x.wrongSectionRescued,previouslyCorrectTop1Damaged:x.previouslyCorrectTop1Damaged,sourceCorrectToWrong:x.sourceCorrectToWrong,parentCorrectToWrong:x.parentCorrectToWrong,childRankingResidual:x.childRankingResidual,top100Absent:x.top100Absent}))
  const thresholdAssessment=assessThresholds({summaries,slices,effects})
  const artifact={schemaVersion:'1.0',runId:cfg.runId,evaluationVersion:cfg.evaluationVersion,mode,caseCount:scored.length,summaries,slices,rerankEffects:effects,unionCandidateDiagnostics:union,thresholdAssessment,cases:publicCases,evaluatorOnlyGoldScoring:true,runtimeRankingInputExcludesGold:true,noHoldoutTuning:mode==='holdout',reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false}
  validateGitSafeArtifact({artifactType:`section-challenge-${mode}`,value:artifact})
  await write(path.join(publicRoot,`${mode}-results.json`),artifact)
  await write(path.join(privateRoot,mode,'scored-details.json'),scored)
  console.log(JSON.stringify({mode,summaries,effects,union},null,2))
}

async function freezeArchitecture() {
  const devFile=path.join(publicRoot,'development-results.json');await fs.access(devFile)
  const implementationPaths=['scripts/lib/soft-structural-reranker.mjs','scripts/section-structural-reranker-experiment.mjs','config/section-challenge-v1.json']
  const implementationArtifacts=await Promise.all(implementationPaths.map(async rel=>({path:rel,sha256:sha(await fs.readFile(path.join(repoRoot,rel)))})))
  const embeddingArtifacts=[]
  for(const mode of ['development','holdout','diagnostic'])for(const name of ['queries.jsonl','query-embeddings.f32','query-embedding-metadata.json'])embeddingArtifacts.push(await fileRecord(path.join(privateRoot,mode,name),`${mode}-${name}`))
  const freeze={schemaVersion:'1.0',runId:cfg.runId,evaluationVersion:cfg.evaluationVersion,architectureFrozenAt:'2026-09-10T12:00:00.000Z',implementationArtifacts,embeddingArtifacts:embeddingArtifacts.map(x=>({artifactType:x.artifactType,sha256:x.sha256,byteCount:x.byteCount})),candidateCutoffs:{bm25Cutoff:cfg.candidateCutoffs.bm25,vectorCutoff:cfg.candidateCutoffs.vector,hybridCutoff:cfg.candidateCutoffs.hybrid},normalization:{method:cfg.normalization.method,formulaCode:'0.15 * (1 / hybridRank) / sum(1 / hybridRank)',tieBreak:cfg.normalization.tieBreak},structuralScoringRules:{identifierLocalBonus:0.09,identifierAncestorBonus:0.05,conceptCoverageMaximum:0.09,headingCoverageMaximum:0.04,sourceTitleCoverageMaximum:0.01,orderedBigramCoverageMaximum:0.03,compatibleRoleBonus:0.02,modalityCompatibilityBonus:0.01,strongComponentRescueBonus:0.06,componentRescueMaximumComponentRank:3,componentRescueMinimumConceptCoverage:0.55,componentRescueMinimumClauseCoverage:0.5,identifierConflictPenalty:0.10,multipartCoveragePenaltyMaximum:0.045,modalityConflictPenalty:0.02,baselineTopPreservationMargin:0.02},confidenceRules:{HIGH:'explicit bounded structural identifier',MEDIUM:'structural phrase or at least four content concepts',LOW_OR_UNKNOWN:'all other queries'},structuralScoreBounds:cfg.structuralScoreBounds,successThresholds:cfg.successThresholds,damageBudget:cfg.damageBudget,developmentResultsSha256:sha(await fs.readFile(devFile)),holdoutAccessedBeforeFreeze:false,rankingInputExcludesGold:true,reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false}
  validateGitSafeArtifact({artifactType:'section-architecture-freeze',value:freeze});await write(path.join(publicRoot,'architecture-freeze.json'),freeze);console.log(JSON.stringify(freeze,null,2))
}

async function verify(mode) {const expected=await fs.readFile(path.join(privateRoot,mode,'rankings.json')), actual=Buffer.from(JSON.stringify(await computeRankings(mode),null,2)+'\n');assert.equal(sha(actual),sha(expected),`${mode} ranking determinism failed`);console.log(`${mode} rankings are byte-identical.`)}

async function manifest() {const artifacts=[];for(const mode of ['development','holdout','diagnostic'])for(const name of ['queries.jsonl','query-embeddings.f32','query-embedding-metadata.json','rankings.json','scored-details.json']){const file=path.join(privateRoot,mode,name);try{artifacts.push(await fileRecord(file,`${mode}-${name}`))}catch{}}const m={schemaVersion:'1.0',runId:cfg.runId,artifactCount:artifacts.length,totalByteCount:artifacts.reduce((n,x)=>n+x.byteCount,0),aggregateSha256:sha(stableJson(artifacts.map(x=>({artifactType:x.artifactType,sha256:x.sha256,byteCount:x.byteCount})))),artifacts,reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false};await write(path.join(privateRoot,'external-artifact-manifest-full.json'),m);const pub={...m,artifacts:m.artifacts.map(x=>({artifactType:x.artifactType,externalPath:x.externalPath,sha256:x.sha256,byteCount:x.byteCount,rightsStorageStatus:x.rightsStorageStatus}))};validateGitSafeArtifact({artifactType:'section-external-manifest',value:pub});await write(path.join(publicRoot,'external-artifact-manifest.json'),pub);console.log(JSON.stringify({artifactCount:m.artifactCount,totalByteCount:m.totalByteCount,aggregateSha256:m.aggregateSha256},null,2))}

const [command,mode]=process.argv.slice(2)
if(command==='prepare')await prepare();else if(command==='rank')await rank(mode);else if(command==='score')await score(mode);else if(command==='freeze')await freezeArchitecture();else if(command==='verify')await verify(mode);else if(command==='manifest')await manifest();else throw new Error('Usage: prepare | rank <mode> | score <mode> | freeze | verify <mode> | manifest')
