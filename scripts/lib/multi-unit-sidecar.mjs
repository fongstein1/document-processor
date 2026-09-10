const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()
const slot=(slotId,slotType,query,desiredRoles=[])=>({slotId,slotType,query:query.trim(),desiredRoles})
const sides=query=>{
 const q=query.replace(/[?.]+$/,'')
 let m=q.match(/\bcompare\s+(.+?)\s+(?:with|versus|vs\.?|and)\s+(.+)$/i)
 if(!m)m=q.match(/^(.+?)\s+(?:versus|vs\.?)\s+(.+)$/i)
 if(!m)m=q.match(/^how do (.+?)\s+distinguish\s+(.+?)\s+from\s+(.+)$/i)
 if(m&&m.length===4)return[`${m[1]} ${m[2]}`,`${m[1]} ${m[3]}`]
 if(!m)m=q.match(/^how do (.+?\bfor\s+)(.+?)\s+and\s+(.+?)\s+(?:differ|compare)$/i)
 if(m&&m.length===4)return[`${m[1]}${m[2]}`,`${m[1]}${m[3]}`]
 return m?[m[1].trim(),m[2].trim()]:[]
}
const clauses=query=>query.replace(/[?.]+$/,'').split(/\s*,\s+(?:and\s+)?(?=(?:what|which|how|when|where)\b)|\s+and\s+(?=(?:what|which|how|when|where|the reconciliation|the separate)\b)|\s*;\s*/i).map(x=>x.trim()).filter(x=>x.length>=12)
const pick=(cs,re)=>cs.find(x=>re.test(norm(x)))
const focused=(query,part,cue)=>`${query} ${cue} ${part}`
export function planEvidenceSlots(query){
 const q=norm(query),cs=clauses(query),comparison=/\b(compare|comparison|versus|difference|differ|distinguish)\b/.test(q),table=/\b(table|worksheet|sheet|columns?|rows?|ranges?|rates?|values?|ages?|weighted average|asset page|dropdown|list|options)\b/.test(q),definition=/\b(defin\w*|meaning|mean|counts as|distinguished from|nonassets)\b/.test(q),exception=/\b(exception|except|excepted|exclude|unless|qualification|even when|not treated|prohibited)\b/.test(q),scope=/\b(scope|covered|applies to|applicable|fall under|which entities|what activity|which transactions|when does .+ apply)\b/.test(q)
 if(comparison){const s=sides(query);return{planType:'COMPARISON',slots:s.length===2?[slot('comparison-a','COMPARISON_SIDE',focused(query,s[0],'first comparison side')),slot('comparison-b','COMPARISON_SIDE',focused(query,s[1],'second comparison side'))]:[slot('comparison-a','COMPARISON_SIDE',query+' first comparison side'),slot('comparison-b','COMPARISON_SIDE',query+' second comparison side')]}}
 if(table){const distinctLists=/\bboth\b.+\band\b.+\b(separate|another)\b/i.test(query),parts=distinctLists?[query,cs[0]||query,cs.at(-1)||query]:cs.length>=2?[cs[0],cs.at(-1)]:[query,query];return{planType:'TABLE_HEADER_PLUS_DATA',slots:parts.map((x,i)=>slot(`table-${i+1}`,i?'TABLE_DATA':'TABLE_HEADER',focused(query,x,i?'exact bounded row range values':'table identity header columns'),i?['OTHER','TABLE_OR_SCHEDULE']:['HEADER_CONTEXT','TABLE_OR_SCHEDULE']))}}
 if(definition){const d=pick(cs,/defin|meaning|mean|counts as|distinguish|nonassets/)||cs[0]||query,r=cs.find(x=>x!==d)||query;return{planType:'DEFINITION_PLUS_REQUIREMENT',slots:[slot('definition','DEFINITION',focused(query,d,'definition meaning'),['DEFINITION']),slot('requirement','REQUIREMENT',focused(query,r,'operative requirement'),['REQUIREMENT','REPORTING_INSTRUCTION'])]}}
 if(exception){const e=pick(cs,/exception|except|exclude|unless|qualification|even when|not treated|prohibited/)||cs.at(-1)||query,r=cs.find(x=>x!==e)||query;return{planType:'REQUIREMENT_PLUS_EXCEPTION',slots:[slot('requirement','REQUIREMENT',focused(query,r,'operative requirement'),['REQUIREMENT','REPORTING_INSTRUCTION']),slot('exception','EXCEPTION',focused(query,e,'exception qualification'),['EXCEPTION_OR_QUALIFICATION'])]}}
 if(scope){const s=pick(cs,/scope|covered|appl|fall under|which entities|what activity|which transactions/)||cs[0]||query,r=cs.find(x=>x!==s)||query;return{planType:'REQUIREMENT_PLUS_SCOPE',slots:[slot('scope','SCOPE',focused(query,s,'scope applicability'),['SCOPE_OR_APPLICABILITY']),slot('requirement','REQUIREMENT',focused(query,r,'operative requirement'),['REQUIREMENT','REPORTING_INSTRUCTION'])]}}
 let pair=query.match(/\bwhat\s+(.+?)\s+and\s+(.+?)\s+(obligations|requirements)\b/i)
 if(pair)return{planType:'MULTIPLE_REQUIREMENTS',slots:[slot('requirement-1','REQUIREMENT',focused(query,pair[1],pair[3]),['REQUIREMENT','REPORTING_INSTRUCTION','TABLE_OR_SCHEDULE']),slot('requirement-2','REQUIREMENT',focused(query,pair[2],pair[3]),['REQUIREMENT','REPORTING_INSTRUCTION','TABLE_OR_SCHEDULE'])]}
 pair=query.match(/\bfor\s+(.+?)\s+and\s+(.+?)\s+(?:insurance-linked|risks?|items?)\b/i)
 if(pair)return{planType:'MULTIPLE_REQUIREMENTS',slots:[slot('requirement-1','REQUIREMENT',focused(query,pair[1],'first separate requirement'),['REQUIREMENT','REPORTING_INSTRUCTION']),slot('requirement-2','REQUIREMENT',focused(query,pair[2],'second separate requirement'),['REQUIREMENT','REPORTING_INSTRUCTION'])]}
 pair=query.replace(/[?.]+$/,'').match(/\bconnect\s+(.+?)\s+and\s+(.+?)\s+to\s+(.+)$/i)
 if(pair)return{planType:'MULTIPLE_REQUIREMENTS',slots:[slot('evidence-1','OTHER',focused(query,pair[1],pair[3]),['TABLE_OR_SCHEDULE','REPORTING_INSTRUCTION']),slot('evidence-2','OTHER',focused(query,pair[2],pair[3]),['TABLE_OR_SCHEDULE','REPORTING_INSTRUCTION'])]}
 if(cs.length>=2)return{planType:/\b(required|must|obligations|govern|instructions)\b/.test(q)?'MULTIPLE_REQUIREMENTS':'OTHER_MULTI_UNIT',slots:cs.slice(0,3).map((x,i)=>slot(`evidence-${i+1}`,'OTHER',focused(query,x,`independent evidence ${i+1}`),['REQUIREMENT','REPORTING_INSTRUCTION','TABLE_OR_SCHEDULE','OTHER']))}
 return{planType:'SINGLE_EVIDENCE',slots:[slot('evidence-1','OTHER',query)]}
}
const roleMatch=(doc,slot)=>!slot.desiredRoles.length||slot.desiredRoles.includes(doc.semanticRole)
const identifiers=text=>new Set([...String(text).matchAll(/\b(?:SSAP\s*(?:No\.?\s*)?\d+[A-Z]?|Schedule\s+[A-Z0-9]+(?:\s+Part\s+\d+[A-Z]?)?|Table\s+[A-Z])\b/gi)].map(x=>norm(x[0])))
const sharesIdentifier=(query,doc)=>{const ids=identifiers(query);if(!ids.size)return false;const d=norm(`${doc.identifier} ${doc.parentHeading} ${doc.header}`);return [...ids].some(x=>d.includes(x))}
export function assembleSlotPackage({query,plan,slotRankings,originalRanking,parentById,config}){
 const sourceScores=new Map()
 for(const s of plan.slots)for(const x of slotRankings[s.slotId].slice(0,config.sourceConsensusDepth))sourceScores.set(x.doc.sourceId,(sourceScores.get(x.doc.sourceId)||0)+1/(10+x.rank)+(roleMatch(x.doc,s)?0.02:0))
 for(const x of originalRanking.slice(0,config.originalSourceDepth))sourceScores.set(x.doc.sourceId,(sourceScores.get(x.doc.sourceId)||0)+config.originalSourceWeight/(10+x.rank))
 const sourceOrder=[...sourceScores].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(x=>x[0])
 const packages=sourceOrder.flatMap(sourceId=>{
  const anchors=[null,...new Set(plan.slots.flatMap(s=>slotRankings[s.slotId].slice(0,config.slotCandidateDepth).filter(x=>x.doc.sourceId===sourceId).map(x=>x.doc.parentId)))]
  return anchors.map(anchorParentId=>{
  const records=[],slotResults=[],used=new Set();let characters=0,totalScore=config.sourceConsensusBonus*(sourceScores.get(sourceId)||0)
  for(const s of plan.slots){
   const ranked=slotRankings[s.slotId].slice(0,config.slotCandidateDepth).filter(x=>x.doc.sourceId===sourceId&&!used.has(x.doc.childId)).map(x=>{const role=roleMatch(x.doc,s),sameParent=records.some(r=>r.parentId===x.doc.parentId),anchorMatch=anchorParentId&&x.doc.parentId===anchorParentId,structural=sharesIdentifier(query,x.doc);return{...x,roleMatch:role,relationalScore:x.finalScore+(role?config.roleBonus:0)+(sameParent?config.sameParentBonus:0)+(anchorMatch?config.parentCoherenceBonus:0)+(structural?config.structuralBonus:0)}}).sort((a,b)=>b.relationalScore-a.relationalScore||a.doc.childId.localeCompare(b.doc.childId))
   const candidate=ranked.find(x=>roleMatch(x.doc,s))||ranked[0],typed=s.desiredRoles.length>0
   const confident=!!candidate&&(!typed||candidate.roleMatch)&&(candidate.finalScore>=config.minimumRrfScore)&&(candidate.vectorSimilarity>=config.minimumVectorSimilarity||candidate.bm25Rank<=20)
   if(confident&&records.length<config.maximumPackageEvidence&&characters+candidate.doc.body.length<=config.maximumPackageCharacters){used.add(candidate.doc.childId);characters+=candidate.doc.body.length;totalScore+=candidate.relationalScore;records.push({evidenceId:candidate.doc.childId,parentId:candidate.doc.parentId,sourceId:candidate.doc.sourceId,role:candidate.doc.semanticRole,slotId:s.slotId,characterCount:candidate.doc.body.length});slotResults.push({slotId:s.slotId,filled:true,sourceId:candidate.doc.sourceId,parentId:candidate.doc.parentId,role:candidate.doc.semanticRole,roleMatch:candidate.roleMatch,score:candidate.relationalScore})}else slotResults.push({slotId:s.slotId,filled:false,sourceId:candidate?.doc.sourceId||null,parentId:candidate?.doc.parentId||null,role:candidate?.doc.semanticRole||null,roleMatch:candidate?.roleMatch||false,score:candidate?.relationalScore||null})
  }
  return{sourceId,anchorParentId,records,slotResults,characterCount:characters,totalScore,filled:slotResults.filter(x=>x.filled).length}
  })
 }).sort((a,b)=>b.filled-a.filled||b.totalScore-a.totalScore||a.sourceId.localeCompare(b.sourceId)||String(a.anchorParentId).localeCompare(String(b.anchorParentId)))
 const best=packages[0]||{sourceId:null,records:[],slotResults:[],characterCount:0,totalScore:0,filled:0},runner=packages[1],all=best.filled===plan.slots.length,oneParent=new Set(best.records.map(x=>x.parentId)).size===1,differentRunner=runner&&runner.records.map(x=>x.evidenceId).join('|')!==best.records.map(x=>x.evidenceId).join('|'),ambiguous=all&&differentRunner&&runner.filled===plan.slots.length&&best.totalScore-runner.totalScore<=config.sourceAmbiguityMargin
 const status=ambiguous||all&&!oneParent?'CONFLICTING_OR_AMBIGUOUS':all?'COMPLETE_CANDIDATE':best.filled?'PARTIAL_CANDIDATE':'INSUFFICIENT_EVIDENCE'
 return{planType:plan.planType,status,records:best.records,slotResults:best.slotResults,dominantSource:best.sourceId,sourceOrder:packages.slice(0,3).map(x=>x.sourceId),characterCount:best.characterCount}
}
