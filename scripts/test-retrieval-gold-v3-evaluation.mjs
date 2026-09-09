import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { addParentRrf, exactCosineRank, rankingDigest, reciprocalRankFusion } from './lib/hybrid-vector-retrieval.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'), cfg=JSON.parse(await fs.readFile(path.join(root,'config','retrieval-gold-v3-evaluation.json'))), frozenCfg=JSON.parse(await fs.readFile(path.join(root,cfg.frozenRetrievalConfigPath)))
assert.equal(frozenCfg.embedding.model,'intfloat/e5-base-v2'); assert.equal(frozenCfg.embedding.revision,'f52bf8ec8c7124536f0efb74aca902b2995e5bcd'); assert.equal(frozenCfg.fusion.rrfK,60); assert.equal(frozenCfg.fusion.parentRrfWeight,.5)
assert.equal(cfg.noHoldoutTuning,true); assert.equal(cfg.rankingInputExcludesGold,true); assert.equal(cfg.retrievalConfigurationUnchanged,true)
const docs=[{childId:'a',parentId:'p1'},{childId:'b',parentId:'p2'},{childId:'c',parentId:'p3'}], vectors=new Float32Array([1,0,0,1,Math.SQRT1_2,Math.SQRT1_2])
const vr=exactCosineRank({queryVector:new Float32Array([1,0]),documentVectors:vectors,documents:docs,dimension:2}); assert.deepEqual(vr.map(x=>x.doc.childId),['a','c','b'])
const b=[{doc:docs[0],rank:1},{doc:docs[1],rank:2}],v=[{doc:docs[1],rank:1},{doc:docs[0],rank:2}],h=reciprocalRankFusion({rankings:{bm25:b,vector:v},weights:{bm25:1,vector:1},k:60})
assert.deepEqual(h.map(x=>x.doc.childId),['a','b']); const p=addParentRrf({hybridRanking:h,parentRanking:[{doc:{parentId:'p2'},rank:1},{doc:{parentId:'p1'},rank:2}],parentWeight:.5,k:60}); assert.equal(p[0].doc.childId,'b')
const digest=rankingDigest({h,p}), gold={acceptedTargetIds:['a']}; gold.acceptedTargetIds=['b']; assert.equal(rankingDigest({h,p}),digest)
for(const unsafe of [{query:'private'},{vector:[1,2]},{goldRationale:'private'},{passage:'private'}]) assert.throws(()=>validateGitSafeArtifact({artifactType:'negative',value:unsafe}),/Git-safe evidence schema violation/)
console.log('Gold V3 synthetic vector, hybrid-fusion, rights-boundary, gold-leakage, and determinism tests passed.')
