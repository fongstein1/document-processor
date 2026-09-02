import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateStructuredEvidenceIdentity } from './lib/structured-evidence-identity.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const reviewRoot = path.join(repoRoot, 'data', 'processed', 'review_packages')

const main = async () => {
  const inventories = (await fs.readdir(reviewRoot))
    .filter((file) => file.endsWith('-structured-evidence-inventory.json'))
    .sort()
  const results = []
  for (const file of inventories) {
    const inventory = JSON.parse(await fs.readFile(path.join(reviewRoot, file), 'utf8'))
    if (inventory.recordCount !== inventory.records.length) throw new Error(`${file}: recordCount does not match records length.`)
    const result = validateStructuredEvidenceIdentity(inventory.records)
    results.push({ file, ...result })
    if (result.status !== 'pass') throw new Error(`${file}:\n${result.errors.join('\n')}`)
  }
  console.log(`Validated structured-evidence identity for ${results.length} inventory file(s): ${results.map((result) => `${result.file} (${result.metrics.recordCount}/${result.metrics.uniqueIdCount})`).join(', ')}`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
