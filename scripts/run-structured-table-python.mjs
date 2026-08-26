import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const scriptName = process.argv[2]
if (!scriptName || path.basename(scriptName) !== scriptName || !scriptName.endsWith('.py')) {
  throw new Error('Usage: node scripts/run-structured-table-python.mjs <script-name.py>')
}
const scriptPath = path.join(repoRoot, 'scripts', scriptName)
const candidates = [
  process.env.PYTHON,
  process.env.CODEX_PYTHON,
  process.env.USERPROFILE ? path.join(process.env.USERPROFILE, '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'python', 'python.exe') : null,
  'python',
].filter(Boolean)
const failures = []
for (const candidate of [...new Set(candidates)]) {
  const result = spawnSync(candidate, [scriptPath], { cwd: repoRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (!result.error && result.status === 0) {
    process.stdout.write(result.stdout)
    process.stderr.write(result.stderr)
    process.exit(0)
  }
  failures.push(`${candidate}: ${result.error?.message ?? (result.stderr || result.stdout).trim()}`)
}
throw new Error(`Unable to run ${scriptName}. Attempts: ${failures.join(' | ')}`)
