import { spawn } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import path from 'node:path'
import { root,runId,privateRoot,publicRoot,write } from './hierarchical-retrieval-experiment.mjs'

const suites=[
  ['repository-check','npm',['run','check']],
  ['parent-child-validation','node',['scripts/validate-parent-child-context.mjs']],
  ['parent-child-tests','node',['scripts/test-parent-child-context.mjs']],
  ['hardening-validation','node',['scripts/validate-parent-child-retrieval-hardening.mjs']],
  ['hardening-tests','node',['scripts/test-parent-child-retrieval-hardening.mjs']],
  ['semantic-validation','node',['--max-old-space-size=8192','scripts/validate-semantic-evidence-unit-correction.mjs']],
  ['semantic-determinism','node',['--max-old-space-size=8192','scripts/test-semantic-evidence-unit-correction.mjs','--determinism']],
  ['gold-v2','node',['scripts/validate-gold-v2.mjs']],
  ['gold-v3','node',['scripts/validate-gold-v3.mjs']],
  ['gold-v3-integrity','node',['scripts/test-gold-v3-integrity.mjs']],
  ['gold-v3-evaluation','node',['scripts/validate-retrieval-gold-v3-evaluation.mjs']],
  ['gold-v3-synthetic','node',['scripts/test-retrieval-gold-v3-evaluation.mjs']],
  ['legacy-vector-determinism','node',['scripts/verify-hybrid-vector-determinism.mjs']],
  ['hierarchical-synthetic','node',['scripts/test-hierarchical-retrieval.mjs']]
]
const results=[];let next=0
async function worker(){while(next<suites.length){const [testId,command,args]=suites[next++],log=createWriteStream(path.join(privateRoot,`${testId}.log`));const status=await new Promise((resolve,reject)=>{const p=command==='npm'?spawn('cmd.exe',['/d','/s','/c','npm run check'],{cwd:root,windowsHide:true}):spawn(process.execPath,args,{cwd:root,windowsHide:true});p.stdout.pipe(log,{end:false});p.stderr.pipe(log,{end:false});p.on('error',reject);p.on('close',code=>{log.end();resolve(code)})});results.push({testId,pass:status===0});console.log(`${testId}: ${status===0?'PASS':'FAIL'}`)}}
await Promise.all([worker(),worker()])
results.sort((a,b)=>a.testId.localeCompare(b.testId))
const allPassed=results.every(x=>x.pass)
await write(path.join(publicRoot,'regression-report.json'),{schemaVersion:'1.0',runId,tests:results,allPassed,reviewOnly:true,promotionStatus:'not_promoted',ragReadyAllowed:false},true)
if(!allPassed)process.exitCode=1
