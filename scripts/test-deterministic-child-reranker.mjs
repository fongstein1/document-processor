import assert from'node:assert/strict';import{assertNoChildGoldLeakage,rerankChildrenPreservingParentSlots}from'./lib/deterministic-child-reranker.mjs'
const doc=(id,parent,body,role='REQUIREMENT')=>({childId:id,parentId:parent,sourceId:'s',body,semanticRole:role})
const union=[
 {doc:doc('a','p1','ordinary repeated requirement'),ranks:{bm25:1,vector:2,hybrid:1},origins:['bm25','vector','hybrid']},
 {doc:doc('b','p2','other source section'),ranks:{bm25:2,vector:1,hybrid:2},origins:['bm25','vector','hybrid']},
 {doc:doc('c','p1','specific reserve qualification requirement'),ranks:{bm25:3,vector:3,hybrid:3},origins:['bm25','vector','hybrid']},
 {doc:doc('d','p2','another section child'),ranks:{bm25:4,vector:4,hybrid:4},origins:['bm25','vector','hybrid']}
],config={baseFormula:'max(0,1-.01*(rank-1))',baseRange:[0,1],maximumBonus:.035,maximumPenalty:.02,confidenceScales:{HIGH:1,MEDIUM:.7,LOW_OR_UNKNOWN:.35},maximumLocalRankDisplacement:5,parentSlotSequencePreserved:true}
const out=rerankChildrenPreservingParentSlots({query:'Which specific reserve qualification is required?',union,config})
assert.deepEqual(out.ranked.map(x=>x.doc.parentId),['p1','p2','p1','p2']);assert.ok(out.ranked.every(x=>x.childScore.bonus<=.035&&x.childScore.penalty<=.02&&x.childScore.base>=0&&x.childScore.base<=1))
assert.throws(()=>assertNoChildGoldLeakage({acceptedTargetIds:['c']}),/Gold leakage/);assert.deepEqual(rerankChildrenPreservingParentSlots({query:'Which specific reserve qualification is required?',union,config}).ranked.map(x=>x.doc.childId),out.ranked.map(x=>x.doc.childId));console.log('Deterministic child reranker tests passed: bounds, parent slots, leakage, determinism.')
