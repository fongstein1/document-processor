import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { config,publicRoot,root } from './multi-unit-gold-v1-freeze.mjs'
const H=b=>crypto.createHash('sha256').update(b).digest('hex'),read=async f=>JSON.parse(await fs.readFile(f,'utf8'))
const freeze=await read(path.join(publicRoot,'gold-freeze.json'));assert.equal(freeze.runId,config.runId);assert.deepEqual(freeze.counts,{multiUnit:35,singleUnitControls:10,unsupported:5,partiallyUnsupported:5,development:27,holdout:18});for(const a of freeze.retrieverArtifacts)assert.equal(H(await fs.readFile(path.join(root,a.path))),a.sha256)
const resultFile=path.join(publicRoot,'baseline-results.json')
try{const results=await read(resultFile);assert.equal(results.primaryRankingIdentical,true);assert.equal(results.noHoldoutTuning,true);assert.equal(results.summaries.length,4);const manifest=await read(path.join(publicRoot,'external-artifact-manifest.json'));for(const a of manifest.artifacts){const b=await fs.readFile(a.externalPath);assert.equal(b.length,a.byteCount);assert.equal(H(b),a.sha256)}}catch(e){if(e.code!=='ENOENT')throw e}
console.log('multi-unit gold v1 validation: PASS')
