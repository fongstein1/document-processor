import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const registryPath = path.join(repoRoot, 'config', 'byte-hashed-text-artifacts.json')

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const git = async (args) => (await execFileAsync('git', args, { cwd: repoRoot, windowsHide: true })).stdout.trim()

const main = async () => {
  const registry = JSON.parse(await fs.readFile(registryPath, 'utf8'))
  assert(registry.schemaVersion === '1.0' && Array.isArray(registry.artifacts), 'Byte-hashed text-artifact registry has an invalid shape.')

  const artifacts = registry.artifacts
  const normalized = artifacts.map((artifact) => artifact.replaceAll('\\', '/'))
  assert(normalized.every((artifact) => artifact && artifact === artifact.trim() && !path.posix.isAbsolute(artifact) && !artifact.split('/').includes('..')), 'Byte-hashed text-artifact registry contains an invalid relative path.')
  assert(new Set(normalized).size === normalized.length, 'Byte-hashed text-artifact registry contains duplicate entries.')

  for (const artifact of normalized) {
    const artifactPath = path.join(repoRoot, ...artifact.split('/'))
    await fs.access(artifactPath)
    await git(['ls-files', '--error-unmatch', '--', artifact])
    const attributes = await git(['check-attr', 'text', 'eol', '--', artifact])
    const lines = attributes.split(/\r?\n/)
    assert(lines.some((line) => line.endsWith(': text: set')), `Byte-hashed text artifact is not protected as text: ${artifact}.`)
    assert(lines.some((line) => line.endsWith(': eol: lf')), `Byte-hashed text artifact is not protected with eol=lf: ${artifact}.`)
  }

  console.log(`Validated ${normalized.length} tracked byte-hashed text artifacts with text/eol=lf protection.`)
}

main().catch((error) => {
  console.error(error.stack ?? error)
  process.exitCode = 1
})
