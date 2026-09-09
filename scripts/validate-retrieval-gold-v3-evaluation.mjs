import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),cfg=JSON.parse(await fs.readFile(path.join(root,'config','retrieval-gold-v3-evaluation.json'))),pub=path.join(root,'data','processed','review_packages',cfg.runId),read=async n=>JSON.parse(await fs.readFile(path.join(pub,n))),hash=b=>crypto.createHash('sha256').update(b).digest('hex')
const names=['evaluation-v3-freeze.json','evaluation-v3-results.json','slice-results-v3.json','unsupported-query-diagnostics-v3.json','external-artifact-manifest-v3.json','evaluation-v3-report.json'], values={}
for(const n of names){values[n]=await read(n);validateGitSafeArtifact({artifactType:n,value:values[n]})}
const freeze=values['evaluation-v3-freeze.json'],result=values['evaluation-v3-results.json'],report=values['evaluation-v3-report.json'],manifest=values['external-artifact-manifest-v3.json'],unsupported=values['unsupported-query-diagnostics-v3.json']
assert.equal(freeze.supportedCaseCount,60);assert.equal(freeze.unsupportedCaseCount,15);assert.equal(freeze.developmentCaseCount,36);assert.equal(freeze.holdoutCaseCount,24)
assert.deepEqual(Object.keys(result.systems),['BM25','VECTOR','HYBRID_RRF','HYBRID_RRF_PARENT','HYBRID_RRF_PARENT_CONTEXT'])
for(const [id,m] of Object.entries(result.overall)){assert.equal(m.development.caseCount,36,`${id} dev`);assert.equal(m.holdout.caseCount,24,`${id} holdout`);for(const split of ['development','holdout','combined'])for(const [k,v] of Object.entries(m[split]))if(v!==null&&!['caseCount','medianTargetRank'].includes(k))assert(v>=0&&v<=1,`${id}/${split}/${k}`)}
assert.equal(unsupported.unsupportedCaseCount,15);assert.equal(unsupported.thresholdSelected,false);assert.equal(unsupported.diagnostics.length,3)
assert.equal(report.provenance.model,'intfloat/e5-base-v2');assert.equal(report.provenance.revision,'f52bf8ec8c7124536f0efb74aca902b2995e5bcd');assert.equal(report.provenance.localOnly,true);assert.equal(report.provenance.hostedApisUsed,false);assert.equal(report.provenance.retrievalConfigurationUnchanged,true);assert.equal(report.goldV3UnchangedAfterFreeze,true)
let total=0;const boundary=path.resolve(manifest.externalProcessingRoot);for(const a of manifest.artifacts){const absolute=path.resolve(a.externalPath),rel=path.relative(boundary,absolute);assert(!rel.startsWith('..')&&!path.isAbsolute(rel),`outside private boundary ${absolute}`);const b=await fs.readFile(absolute);assert.equal(b.length,a.byteCount);assert.equal(hash(b),a.sha256);total+=b.length}assert.equal(total,manifest.privateArtifactByteCount)
const validation={schemaVersion:'1.0',runId:cfg.runId,tests:[{testId:'GOLD_V3_COUNTS',pass:true},{testId:'FROZEN_SYSTEMS_UNCHANGED',pass:true},{testId:'RIGHTS_SAFE_PUBLIC_PROJECTION',pass:true},{testId:'EXTERNAL_ARTIFACT_HASHES',pass:true},{testId:'NO_THRESHOLD_SELECTION',pass:true}],allPassed:true,reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false};validateGitSafeArtifact({artifactType:'validation-report-v3.json',value:validation});await fs.writeFile(path.join(pub,'validation-report-v3.json'),JSON.stringify(validation,null,2)+'\n')
console.log(`Validated Gold V3 evaluation: ${freeze.supportedCaseCount} supported, ${freeze.unsupportedCaseCount} unsupported, ${manifest.artifacts.length} private artifacts.`)
