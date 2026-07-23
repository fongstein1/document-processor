import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const parseArgs = (argv) => {
  const args = {}
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const value = argv[index + 1]
    if (value && !value.startsWith('--')) {
      args[key] = value
      index += 1
    } else {
      args[key] = true
    }
  }
  return args
}

const resolvePath = (value) => path.isAbsolute(value) ? value : path.resolve(repoRoot, value)
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
const writeText = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${value}\n`, 'utf8')
}

const main = async () => {
  const args = parseArgs(process.argv)
  const familyPath = resolvePath(args.family ?? 'config/reg213-relationship-family.json')
  const outputPath = resolvePath(args.output ?? 'data/processed/relationship_registries/reg213-family-inventory.json')
  const family = await readJson(familyPath)
  const inventory = {
    schemaVersion: '1.0',
    inventoryId: 'reg213-family-inventory',
    familyId: family.familyId,
    generatedAt: family.generatedAt,
    jurisdiction: family.jurisdiction,
    issuingBody: family.issuingBody,
    reviewOnly: true,
    learnerFacingAllowed: false,
    appReadyAllowed: false,
    ragReadyAllowed: false,
    promotionStatus: 'not_promoted',
    inventoryInput: family.sourceInventoryInput,
    sourceCount: family.sources.length,
    artifactCount: family.reviewArtifacts.length,
    sources: family.sources,
    reviewArtifacts: family.reviewArtifacts,
    notes: 'Relative source paths only. The received inventory remains a local, ignored selection input and is not copied into this tracked artifact.'
  }
  await writeJson(outputPath, inventory)
  const lines = [
    '# Regulation 213 Family Inventory',
    '',
    '- Review-only: Yes',
    '- Promoted: No',
    `- Source documents: ${inventory.sourceCount}`,
    `- Review artifacts: ${inventory.artifactCount}`,
    '- Local received inventory committed: No',
    '',
    '## Source documents',
    '',
    '| Source ID | Document ID | Version | Type | Amendment | Status | Pages | Source path | Review index | Self-review |',
    '| --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- |',
    ...inventory.sources.map((source) => `| ${source.sourceId} | ${source.documentId} | ${source.versionId} | ${source.documentType} | ${source.amendmentNumber ?? '-'} | ${source.sourceStatus} | ${source.pageRange.join('-')} | ${source.sourcePath} | ${source.reviewIndexPath} | ${source.selfReviewPath} |`),
    '',
    '## Review artifacts',
    '',
    '| Artifact ID | Type | Source document | Path |',
    '| --- | --- | --- | --- |',
    ...inventory.reviewArtifacts.map((artifact) => `| ${artifact.artifactId} | ${artifact.artifactType} | ${artifact.sourceDocumentId} | ${artifact.sourcePath} |`),
    '',
    '## Classification notes',
    '',
    '- The base regulation is kept separate from amendment text.',
    '- The Amendment No. 1 FAQ is companion-only guidance, not a stand-alone regulation.',
    '- Review indexes and self-reviews are review artifacts, not controlling sources.',
    '- No reprint or duplicate relationship is asserted without explicit documentary evidence.',
    '- The proposed Sixth Amendment remains separate from final adopted text.'
  ]
  await writeText(path.join(path.dirname(outputPath), 'reg213-family-inventory.md'), lines.join('\n'))
  console.log(`Built Regulation 213 family inventory for ${inventory.sourceCount} sources and ${inventory.artifactCount} review artifacts.`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
