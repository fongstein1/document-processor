import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
const root=path.resolve(import.meta.dirname,'..'),c=JSON.parse(fs.readFileSync(path.join(root,'config/multi-unit-gold-v1.json'))),frozen=JSON.parse(fs.readFileSync(path.join(root,c.flatHybridConfigPath)))
const base='C:/Dev/Document Processor Sources/_processed-private/hybrid-vector-retrieval-experiment-2026-09'
const python=process.env.LOCAL_E5_PYTHON||path.join(base,'.runtime-venv/Scripts/python.exe'),model=process.env.LOCAL_E5_MODEL_DIR||path.join(base,'model/intfloat--e5-base-v2')
const r=spawnSync(python,[path.join(root,'scripts/embed-local-e5-queries.py'),'--queries',path.join(c.privateRoot,'queries.jsonl'),'--model-dir',model,'--output-dir',c.privateRoot,'--model-id',frozen.embedding.model,'--revision',frozen.embedding.revision,'--license',frozen.embedding.license,'--max-length',String(frozen.embedding.maxSequenceLength),'--inference-precision',frozen.embedding.inferencePrecision],{stdio:'inherit',env:{...process.env,HF_HUB_OFFLINE:'1',TRANSFORMERS_OFFLINE:'1'}});if(r.status!==0)process.exit(r.status||1)
