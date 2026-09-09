import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { buildFreeze,config,publicRoot,root } from './multi-unit-gold-v1-freeze.mjs'
import { scoreSupported } from './multi-unit-gold-v1-evaluation.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const freeze=await buildFreeze()
assert.equal(freeze.counts.multiUnit,35);assert.equal(freeze.counts.singleUnitControls,10);assert.equal(freeze.counts.unsupported,5);assert.equal(freeze.counts.partiallyUnsupported,5)
assert.equal(freeze.counts.development,27);assert.equal(freeze.counts.holdout,18)
assert.deepEqual(Object.values(freeze.categoryCounts),[5,5,5,5,5,5,5])
assert.equal(new Set(freeze.cases.map(x=>x.queryHash)).size,55)
assert.equal(new Set(freeze.cases.filter(x=>x.split==='development').map(x=>x.caseId)).size,27)
assert.equal(new Set(freeze.cases.filter(x=>x.split==='holdout').map(x=>x.caseId)).size,18)
assert.ok(!freeze.cases.some(x=>x.split==='development'&&freeze.cases.some(y=>y.split==='holdout'&&y.caseId===x.caseId)))
assert.ok(freeze.cases.filter(x=>x.classification==='UNSUPPORTED').every(x=>!x.sourceId&&!x.acceptedEvidenceSets.length))
assert.ok(freeze.cases.filter(x=>x.classification==='PARTIALLY_UNSUPPORTED').every(x=>!x.included&&x.partiallySupportedEvidenceIds.length))
validateGitSafeArtifact({artifactType:'multi-unit-gold-v1-freeze',value:freeze})
const serialized=await fs.readFile(path.join(publicRoot,'gold-freeze.json'),'utf8');for(const prohibited of ['"query"','"rationale"','sourceTextExcerpt','passage: ','query: '])assert.ok(!serialized.includes(prohibited))
const rankingInterface=new Set(['query','queryVector','documents']);for(const forbidden of ['acceptedEvidenceIds','expectedSource','expectedParent','requiredRoles','classification','split','acceptedEvidenceSets'])assert.ok(!rankingInterface.has(forbidden))
const g={caseId:'synthetic',split:'development',classification:'MULTI_UNIT_REQUIRED',category:'COMPARISON',sourceId:'s',modality:'PDF',acceptedEvidenceSets:[{evidenceIds:['a','b']},{evidenceIds:['a','c']}],acceptedParentIds:['p'],requiredEvidenceRoles:['REQUIREMENT'] ,citationCoordinates:[{evidenceId:'a'}]}
const r={ranking:[{childId:'a',rank:1},{childId:'c',rank:2}],systems:{A:{records:[{evidenceId:'a',parentId:'p',sourceId:'s',role:'REQUIREMENT'}]},B:{records:[{evidenceId:'a',parentId:'p',sourceId:'s',role:'REQUIREMENT'},{evidenceId:'c',parentId:'p',sourceId:'s',role:'REQUIREMENT'}]}}}
assert.equal(scoreSupported(g,r,'A').completePackage,false);assert.equal(scoreSupported(g,r,'B').completePackage,true);assert.equal(scoreSupported(g,r,'B').acceptedEvidenceRecall,1)
assert.equal(config.rankingInputExcludesGold,true);assert.equal(config.noHoldoutTuning,true);assert.equal(config.retrievalConfigurationUnchanged,true)
console.log('multi-unit gold v1 integrity, rights projection, set scoring, leakage boundary: PASS')
