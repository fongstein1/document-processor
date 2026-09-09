import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
const repoRoot=path.resolve(import.meta.dirname,'..')
const c=JSON.parse(fs.readFileSync(path.join(repoRoot,'config','retrieval-gold-v3-evaluation.json'),'utf8'))
const frozen=JSON.parse(fs.readFileSync(path.join(repoRoot,c.frozenRetrievalConfigPath),'utf8'))
const base=path.join('C:\\Dev\\Document Processor Sources','_processed-private','hybrid-vector-retrieval-experiment-2026-09')
const outputIndex=process.argv.indexOf('--output-dir'); const out=outputIndex>=0?path.resolve(process.argv[outputIndex+1]):c.privateRoot
const python=process.env.LOCAL_E5_PYTHON||path.join(base,'.runtime-venv','Scripts','python.exe')
const model=process.env.LOCAL_E5_MODEL_DIR||path.join(base,'model','intfloat--e5-base-v2')
const result=spawnSync(python,[path.join(repoRoot,'scripts','embed-local-e5-queries.py'),'--queries',path.join(c.privateRoot,'queries-v3.jsonl'),'--model-dir',model,'--output-dir',out,'--model-id',frozen.embedding.model,'--revision',frozen.embedding.revision,'--license',frozen.embedding.license,'--max-length',String(frozen.embedding.maxSequenceLength),'--inference-precision',frozen.embedding.inferencePrecision],{stdio:'inherit',env:{...process.env,HF_HUB_OFFLINE:'1',TRANSFORMERS_OFFLINE:'1'}})
if(result.status!==0) process.exit(result.status||1)
