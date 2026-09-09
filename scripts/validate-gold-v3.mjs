import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot=path.resolve(import.meta.dirname,'..')
const config=JSON.parse(await fs.readFile(path.join(repoRoot,'config','retrieval-gold-v3-evaluation.json'),'utf8'))
const freezeFile=path.join(repoRoot,'data','processed','review_packages',config.runId,'evaluation-v3-freeze.json')
const freeze=JSON.parse(await fs.readFile(freezeFile,'utf8'))
const privateBytes=await fs.readFile(path.join(config.privateRoot,'gold-v3-adjudication.json'))
const sha=b=>crypto.createHash('sha256').update(b).digest('hex')

assert.equal(freeze.evaluationVersion,'GOLD_V3')
assert.equal(freeze.startingSha,config.startingSha)
assert.equal(freeze.supportedCaseCount,60)
assert.equal(freeze.unsupportedCaseCount,15)
assert.equal(freeze.developmentCaseCount,36)
assert.equal(freeze.holdoutCaseCount,24)
assert.equal(freeze.privateAdjudicationSha256,sha(privateBytes))
assert.equal(freeze.privateAdjudicationByteCount,privateBytes.length)
assert.equal(freeze.finalGoldSelectionUsesRegex,false)
assert.equal(freeze.rankingInputExcludesGold,true)
assert.equal(freeze.retrievalConfigurationUnchanged,true)
assert.equal(new Set(freeze.cases.map(c=>c.caseId)).size,75)
assert.equal(new Set(freeze.cases.map(c=>c.queryHash)).size,75)
assert.equal(freeze.cases.filter(c=>c.included).length,60)
assert.equal(freeze.cases.filter(c=>c.adjudicationStatus==='UNSUPPORTED').length,15)
assert.equal(freeze.cases.filter(c=>c.sourceId==='naic-accounting-publications-appm-2026'&&c.included).length,20)
for(const sourceId of freeze.sourceIds) assert.ok(freeze.cases.filter(c=>c.sourceId===sourceId&&c.included).length>=8)
assert.ok(freeze.cases.some(c=>c.adjudicationStatus==='MULTIPLE_ACCEPTED_TARGETS'))
assert.ok(freeze.cases.filter(c=>c.adjudicationStatus==='MULTI_UNIT_REQUIRED').length>=10)
assert.ok(!JSON.stringify(freeze).includes('adjudicationRationale'))
assert.ok(freeze.cases.every(c=>!Object.hasOwn(c,'query')))
validateGitSafeArtifact({artifactType:'gold-v3-freeze',value:freeze})
console.log(`Gold V3 validation passed: ${freeze.supportedCaseCount} supported, ${freeze.unsupportedCaseCount} unsupported, ${freeze.developmentCaseCount}/${freeze.holdoutCaseCount} development/holdout.`)
