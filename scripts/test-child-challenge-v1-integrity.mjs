import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { validateGitSafeArtifact } from './rights-storage.mjs'
const root=path.resolve(import.meta.dirname,'..'),cfg=JSON.parse(await fs.readFile(path.join(root,'config/child-challenge-v1.json'))),freeze=JSON.parse(await fs.readFile(path.join(root,'data/processed/review_packages',cfg.runId,'evaluation-freeze.json')))
assert.deepEqual([freeze.counts.supported,freeze.counts.development,freeze.counts.holdout,freeze.counts.control],[48,28,20,12])
assert.equal(new Set(freeze.cases.map(x=>x.caseId)).size,60);assert.equal(new Set(freeze.cases.map(x=>x.queryHash)).size,60)
assert.ok(freeze.cases.every(x=>x.queryExternal&&x.rationaleExternal&&x.acceptedTargetIds.length&&x.acceptedParentIds.length))
assert.equal(freeze.createdBeforeChildRerankerImplementation,true);assert.equal(freeze.holdoutAccessProhibitedUntilArchitectureFreeze,true);assert.equal(freeze.rankingInputExcludesGold,true)
assert.deepEqual(Object.keys(freeze.controlCounts).sort(),['EASY_ALREADY_CORRECT','PARENT_NOT_REACHABLE','TARGET_NOT_IN_DEEP_UNION'])
validateGitSafeArtifact({artifactType:'child-challenge-v1-integrity',value:freeze});console.log('Child Challenge V1 integrity tests passed.')
