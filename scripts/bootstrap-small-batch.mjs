import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const configPath = path.join(repoRoot, 'config', 'source-families.json')
const templatePath = path.join(
  repoRoot,
  'data',
  'templates',
  'batch-manifest.template.json',
)
const workRoot = path.join(repoRoot, 'data', 'work')
const batchRoot = path.join(workRoot, 'batches', 'batch-001')
const reviewRoot = path.join(batchRoot, 'review')
const exportsRoot = path.join(batchRoot, 'exports')
const manifestPath = path.join(batchRoot, 'batch-manifest.json')

const ensureDir = async (dir) => fs.mkdir(dir, { recursive: true })
const readJson = async (filePath) =>
  JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => {
  await ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
const exists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}
const unique = (values) => Array.from(new Set(values.filter(Boolean)))

const [config, template] = await Promise.all([
  readJson(configPath),
  readJson(templatePath),
])

const sourceFamilyIds = config.sourceFamilies.map((family) => family.familyId)
const sourceFamilyLabels = config.sourceFamilies.map((family) => family.label)
const candidateSourceRoots = unique(
  config.sourceFamilies.flatMap((family) => family.sourceRoots ?? []),
)

const batchManifest = {
  ...template,
  batchId: 'batch-001',
  status: 'draft',
  createdAt: new Date().toISOString(),
  projectName: config.project.name,
  projectPurpose: config.project.purpose,
  rawSourceRoot: config.project.rawSourceRoot,
  referenceAppRepo: config.project.referenceAppRepo,
  sourceFamilyIds,
  sourceFamilyLabels,
  candidateSourceRoots,
  selectedSourceFiles: [],
  requiredDeliverables: config.outputContracts,
  reviewPolicy: config.reviewPolicy,
  privacyPolicy: config.privacyPolicy,
  skillGuardrails: template.skillGuardrails,
  notes:
    'Select a small representative source batch before running real processing.',
}

await Promise.all([
  ensureDir(workRoot),
  ensureDir(batchRoot),
  ensureDir(reviewRoot),
  ensureDir(exportsRoot),
])

if (!(await exists(manifestPath))) {
  await writeJson(manifestPath, batchManifest)
}

console.log(`Prepared batch scaffold at ${batchRoot}`)
console.log(`Manifest: ${manifestPath}`)
