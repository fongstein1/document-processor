import assert from 'node:assert/strict'
import { hierarchicalRank, structuralMatches, evidenceNeeds, assembleEvidence } from './lib/hierarchical-retrieval.mjs'
import { scoreCase } from './hierarchical-retrieval-experiment.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'
const config={topParents:2,topSources:2,rrfK:60,maximumPackageEvidence:4,maximumPackageCharacters:1000}
const parents=[{parentId:'p1',sourceId:'s1',structuralIdentifier:'SSAP No. 4'},{parentId:'p2',sourceId:'s1',structuralIdentifier:'SSAP No. 40'},{parentId:'p3',sourceId:'s2',structuralIdentifier:'SSAP No. 5'}]
const parentById=new Map(parents.map(p=>[p.parentId,p]))
const children=parents.map((p,i)=>({childId:`c${i}`,parentId:p.parentId,sourceId:p.sourceId,semanticRole:'REQUIREMENT',body:'Synthetic requirement',pageStart:i+1}))
const rows=children.map((doc,i)=>({doc,rank:i+1,finalScore:3-i})),pb=parents.map((doc,i)=>({doc,rank:i+1,finalScore:3-i}))
assert.deepEqual([...structuralMatches('Under SSAP No. 4, what is required?',parents,parentById)],['p1'])
assert.equal(structuralMatches('Under SSAP No. 400?',parents,parentById).size,0)
const base={parentBm25:pb,vector:rows,bm25:rows,parentById,config}
const b=hierarchicalRank({...base,query:'general question'})
assert.equal(b.parentIds.length,2);assert(b.ranked.every(x=>b.parentIds.includes(x.doc.parentId)))
const c=hierarchicalRank({...base,query:'SSAP No. 5 requirement',exactRouting:true})
assert.deepEqual(c.ranked.map(x=>x.doc.childId),['c2'])
const forbidden=new Proxy({},{get(){throw new Error('Gold was read')}})
assert.deepEqual(hierarchicalRank({...base,query:'general question',gold:forbidden}),b)
assert.deepEqual(hierarchicalRank({...base,query:'general question'}),b)
for(const [query,need] of [['Who must comply with this requirement?','REQUIREMENT_PLUS_SCOPE'],['State the rule and exception','REQUIREMENT_PLUS_EXCEPTION'],['Show table rows 1 through 4','TABLE_HEADER_PLUS_DATA'],['Define the term and report requirements','DEFINITION_PLUS_REQUIREMENT'],['Which requirements both apply?','MULTIPLE_REQUIREMENTS'],['Compare the two rules','COMPARISON']])assert(evidenceNeeds(query).includes(need),need)
const data={...children[0],headerContextId:'h',worksheetPath:'sheet1',colStart:'A',body:'A2: 1 B2: 10 A3: 2 B3: 20'}
const header={headerContextId:'h',parentId:'p1',sourceId:'s1',text:'A1: synthetic age B1: synthetic rate'}
const packageArgs={query:'Table rows 1 through 2',retrieval:{ranked:[{doc:data,rank:1}],parentIds:['p1']},headerById:new Map([['h',header]]),parentById,contextById:new Map(),config}
const pkg=assembleEvidence(packageArgs)
assert.deepEqual(pkg.records.map(x=>x.evidenceId),['c0','h'])
assert.equal(assembleEvidence({...packageArgs,headerById:new Map([['h',{...header,parentId:'p2'}]])}).records.length,1,'Wrong-parent header must be rejected')
assert.equal(assembleEvidence({...packageArgs,config:{...config,maximumPackageEvidence:1}}).records.length,1)
assert.equal(assembleEvidence({...packageArgs,config:{...config,maximumPackageCharacters:1}}).records.length,0)
const gold={caseId:'g',sourceId:'s1',acceptedTargetIds:['c0','equivalent'],acceptedParentIds:['p1'],requiredEvidenceIds:['h'],requiredRoles:['HEADER_CONTEXT']}
const scored=scoreCase(gold,{systemId:'D',ranking:[{childId:'c0',rank:1}],records:pkg.records},new Map([['c0',data]]))
assert.equal(scored.completeContext,true);assert.equal(scored.acceptedEvidenceRecall,1);assert.equal(scored.contextPrecision,1)
const wrongHeader=scoreCase(gold,{systemId:'D',ranking:[{childId:'c0',rank:1}],records:[pkg.records[0],{evidenceId:'wrong',role:'HEADER_CONTEXT'}]},new Map([['c0',data]]))
assert.equal(wrongHeader.completeContext,false,'Matching role alone is insufficient')
for(const value of [{query:'private'},{passage:'private'},{vectors:[1]},{nested:{unexpectedContent:'private'}}])assert.throws(()=>validateGitSafeArtifact({artifactType:'negative',value}),/Git-safe/)
console.log('Hierarchical routing, no-gold interface, planner, bounds, lineage, exact evidence, rights and determinism fixtures PASS')
