import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'config/section-challenge-v1.json')))
const frozen = JSON.parse(fs.readFileSync(path.join(root, cfg.frozenRetrievalConfigPath)))
const base = cfg.vectorRoot
const python = process.env.LOCAL_E5_PYTHON || path.join(base, '.runtime-venv/Scripts/python.exe')
const model = process.env.LOCAL_E5_MODEL_DIR || path.join(base, 'model/intfloat--e5-base-v2')
const modes = process.argv.slice(2).length ? process.argv.slice(2) : ['development','holdout','diagnostic']
for (const mode of modes) {
  const outputDir = path.join(cfg.privateRoot, mode)
  const result = spawnSync(python, [path.join(root, 'scripts/embed-local-e5-queries.py'), '--queries', path.join(outputDir, 'queries.jsonl'), '--model-dir', model, '--output-dir', outputDir, '--model-id', frozen.embedding.model, '--revision', frozen.embedding.revision, '--license', frozen.embedding.license, '--max-length', String(frozen.embedding.maxSequenceLength), '--inference-precision', frozen.embedding.inferencePrecision], { stdio: 'inherit', env: { ...process.env, HF_HUB_OFFLINE: '1', TRANSFORMERS_OFFLINE: '1' } })
  if (result.status !== 0) process.exit(result.status || 1)
}
