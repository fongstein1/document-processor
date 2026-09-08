import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'hybrid-vector-retrieval-experiment.json'), 'utf8'))
const externalRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', config.runId)
const outputIndex = process.argv.indexOf('--output-dir')
const outputDir = outputIndex >= 0 ? path.resolve(process.argv[outputIndex + 1]) : externalRoot
const python = process.env.LOCAL_E5_PYTHON || path.join(externalRoot, '.runtime-venv', 'Scripts', 'python.exe')
const modelDir = process.env.LOCAL_E5_MODEL_DIR || path.join(externalRoot, 'model', 'intfloat--e5-base-v2')
for (const required of [python, modelDir, path.join(externalRoot, 'passages.jsonl'), path.join(externalRoot, 'queries.jsonl')]) if (!fs.existsSync(required)) throw new Error(`Required local embedding input is missing: ${required}`)

const result = spawnSync(python, [
  path.join(repoRoot, 'scripts', 'embed-local-e5.py'),
  '--passages', path.join(externalRoot, 'passages.jsonl'),
  '--queries', path.join(externalRoot, 'queries.jsonl'),
  '--model-dir', modelDir,
  '--output-dir', outputDir,
  '--model-id', config.embedding.model,
  '--revision', config.embedding.revision,
  '--license', config.embedding.license,
  '--inference-precision', config.embedding.inferencePrecision,
  '--batch-size', process.env.LOCAL_E5_BATCH_SIZE || '64',
  '--max-length', String(config.embedding.maxSequenceLength)
], { cwd: repoRoot, stdio: 'inherit', env: { ...process.env, HF_HUB_OFFLINE: '1', TRANSFORMERS_OFFLINE: '1' } })
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
