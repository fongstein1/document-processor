import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot=path.resolve(import.meta.dirname,'..')
const config=JSON.parse(await fs.readFile(path.join(repoRoot,'config','retrieval-gold-v3-evaluation.json'),'utf8'))
const freeze=JSON.parse(await fs.readFile(path.join(repoRoot,'data','processed','review_packages',config.runId,'evaluation-v3-freeze.json'),'utf8'))
const development=new Set(freeze.cases.filter(c=>c.split==='development').map(c=>c.caseId))
const holdout=new Set(freeze.cases.filter(c=>c.split==='holdout').map(c=>c.caseId))
assert.ok([...development].every(id=>!holdout.has(id)),'Development/holdout leakage')
assert.equal(development.size,36)
assert.equal(holdout.size,24)
assert.equal(new Set(freeze.cases.map(c=>c.queryHash)).size,freeze.cases.length,'Duplicate query hash')
assert.ok(freeze.cases.filter(c=>c.adjudicationStatus==='UNSUPPORTED').every(c=>c.acceptedTargetIds.length===0&&c.acceptedParentIds.length===0&&c.sourceId===null))
for(const c of freeze.cases.filter(c=>c.included)){assert.ok(c.acceptedTargetIds.length);assert.ok(c.acceptedParentIds.length);assert.equal(c.queryExternal,true);assert.equal(c.rationaleExternal,true)}
for(const forbidden of ['rank','score','similarity','margin','mrr']) assert.ok(freeze.cases.every(c=>!Object.hasOwn(c,forbidden)),`Ranking leakage: ${forbidden}`)
assert.throws(()=>validateGitSafeArtifact({artifactType:'synthetic-gold-leak',value:{query:'private query'}}),/prohibited|allowlisted|unexpected content-bearing/i)
assert.throws(()=>validateGitSafeArtifact({artifactType:'synthetic-rights-leak',value:{sourceText:'private source'}}),/prohibited|allowlisted|unexpected content-bearing/i)
console.log('Gold V3 synthetic integrity, rights-boundary, duplicate, split-isolation, and ranking-leakage tests passed.')
