import { regulatoryTokens } from './semantic-evidence-units.mjs'
import { inferQueryStructure } from './soft-structural-reranker.mjs'
const stop=new Set(['what','which','where','when','how','does','the','and','for','from','with','that','this','under','within','into','about'])
const toks=x=>[...new Set(regulatoryTokens(String(x||'')).map(x=>x.toLowerCase()).filter(x=>x.length>1&&!stop.has(x)))]
const recall=(q,c)=>q.length?q.filter(x=>c.has(x)).length/q.length:0
const roleOk=(roles,role)=>!roles.length||roles.some(x=>x==='DEFINITION'&&role==='DEFINITION'||x==='EXCEPTION_OR_QUALIFICATION'&&role==='EXCEPTION_OR_QUALIFICATION'||x==='REPORTING_INSTRUCTION'&&role==='REPORTING_INSTRUCTION'||x==='REQUIREMENT'&&/REQUIREMENT|EXCEPTION/.test(role)||x==='TABLE_OR_FORM'&&/HEADER|TABLE|SCHEDULE/.test(role))
const forbidden=new Set(['acceptedTargetIds','acceptedParentIds','expectedSource','expectedSourceId','expectedParentId','classification','split','splitLabel','acceptedEvidenceText','evaluatorOnlyAcceptedParentMetrics','priorHoldoutOutcomes','oracleResults'])
export function assertNoChildGoldLeakage(value){const scan=x=>{if(!x||typeof x!=='object')return;for(const [k,v]of Object.entries(x)){if(forbidden.has(k))throw new Error(`Gold leakage into child reranker: ${k}`);scan(v)}};scan(value);return true}
const phrase=(q,text)=>{const qt=toks(q),s=String(text||'').toLowerCase();if(qt.length<2)return 0;let n=0;for(let i=0;i<qt.length-1;i++)if(s.includes(`${qt[i]} ${qt[i+1]}`))n++;return n/(qt.length-1)}
export function scoreChild({query,plan,item,siblings,localRank,config}){
  const child=item.doc,queryTokens=plan.conceptTokens||toks(query),body=new Set(toks(child.body)),meta=new Set(toks(`${child.section||''} ${child.identifier||''} ${child.parentHeading||''} ${child.header||''} ${child.sheetName||''}`))
  const siblingCounts=new Map();for(const s of siblings)for(const t of toks(s.doc.body))siblingCounts.set(t,(siblingCounts.get(t)||0)+1)
  const matched=queryTokens.filter(t=>body.has(t)),distinct=matched.filter(t=>(siblingCounts.get(t)||0)<=1)
  const coverage=recall(queryTokens,new Set([...body,...meta])),localCoverage=recall(queryTokens,body),distinctiveness=queryTokens.length?distinct.length/queryTokens.length:0,phraseCoverage=phrase(query,child.body),roleMatch=roleOk(plan.intentRoles||[],String(child.semanticRole||'')),roleConflict=(plan.intentRoles||[]).length>0&&!roleMatch
  const ids=plan.identifiers||[],localId=ids.some(id=>String(`${child.section||''} ${child.identifier||''} ${child.header||''}`).toLowerCase().includes(id)),clauses=plan.clauses||[],clauseCoverage=clauses.length?clauses.filter(q=>recall(q,body)>=.35).length/clauses.length:1,consensus=[item.ranks.bm25,item.ranks.vector,item.ranks.hybrid].filter(x=>x&&x<=20).length>=2,strongBm25=item.ranks.bm25<=3,strongVector=item.ranks.vector<=3
  let bonus=(localId ? .012 : 0)+Math.min(.012,coverage*.012)+Math.min(.008,phraseCoverage*.008)+(roleMatch ? .008 : 0)+Math.min(.01,distinctiveness*.01)+(consensus ? .005 : 0)+(strongBm25 ? .015 : 0)+(strongVector ? .01 : 0)
  let penalty=(roleConflict ? .008 : 0)+(plan.multipart&&clauseCoverage<.75?Math.min(.015,(.75-clauseCoverage)*.02):0)
  const scale=config.confidenceScales[plan.confidence]??config.confidenceScales.LOW_OR_UNKNOWN
  bonus=Math.min(config.maximumBonus,bonus*scale);penalty=Math.min(config.maximumPenalty,penalty*scale)
  const base=Math.max(0,1-.01*(localRank-1));return{base,bonus,penalty,adjustment:bonus-penalty,finalScore:base+bonus-penalty,features:{coverage,localCoverage,phraseCoverage,distinctiveness,roleMatch,roleConflict,localIdentifierMatch:localId,clauseCoverage,consensus,strongBm25,strongVector},confidence:plan.confidence}
}
export function rerankChildrenPreservingParentSlots({query,union,config}){
  assertNoChildGoldLeakage({query,union,config});const plan=inferQueryStructure(query),byParent=new Map(),slots=new Map()
  const ordered=[...union].sort((a,b)=>a.ranks.hybrid-b.ranks.hybrid||a.doc.childId.localeCompare(b.doc.childId))
  ordered.forEach((x,i)=>{const p=x.doc.parentId||`NO_PARENT:${x.doc.childId}`;(byParent.get(p)||byParent.set(p,[]).get(p)).push(x);(slots.get(p)||slots.set(p,[]).get(p)).push(i)})
  const output=[...ordered],details=new Map()
  for(const [parent,items]of byParent){const scored=items.map((x,i)=>({item:x,score:scoreChild({query,plan,item:x,siblings:items,localRank:i+1,config})})).sort((a,b)=>b.score.finalScore-a.score.finalScore||a.item.doc.childId.localeCompare(b.item.doc.childId));slots.get(parent).forEach((slot,i)=>{output[slot]=scored[i].item;details.set(scored[i].item.doc.childId,scored[i].score)})}
  return{plan,ranked:output.map((x,i)=>({...x,rank:i+1,childScore:details.get(x.doc.childId)})),parentSlotSequencePreserved:true}
}
