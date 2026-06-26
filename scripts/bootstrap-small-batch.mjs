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
const unique = (values) => Array.from(new Set(values.filter(Boolean)))

const [config, template] = await Promise.all([
  readJson(configPath),
  readJson(templatePath),
])

const sourceFamilies = config.sourceFamilies.map((family) => ({
  sourceFamilyId: family.familyId,
  label: family.label,
  domainId: family.domainId,
  ...(family.description ? { description: family.description } : {}),
  ...(family.sourceRoots?.length ? { sourceRoots: family.sourceRoots } : {}),
  ...(family.notes ? { notes: family.notes } : {}),
}))

const targetDomains = unique(
  config.domains.flatMap((domain) => {
    return domain.sourceFamilyIds?.length ? [domain.domainId] : []
  }),
)

const batchManifest = {
  ...template,
  schemaVersion: template.schemaVersion ?? '1.0',
  batchId: 'batch-001',
  batchName: 'Initial contract scaffold',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  projectName: config.project.name,
  projectPurpose: config.project.purpose,
  sourceFamilies,
  sourceFiles: [],
  processingIntent: {
    mode: 'small_pilot',
    targetDomains,
    pipelineStages: [
      'inventory',
      'extraction',
      'chunking',
      'labeling',
      'review',
      'export',
      'validation',
    ],
    smallPilot: true,
    learnerFacingBlocked: true,
    appExportRequested: true,
    ragReadinessRequested: true,
    reviewStrategy: 'exception_first',
    notes: 'Populate sourceFiles with a small representative batch before real processing.',
  },
  boundaries: {
    rawSourceRoot: config.project.rawSourceRoot,
    rawMaterialExternal: true,
    gitExcludesRawFiles: true,
    noRealProcessing: true,
    noLearnerFacingPromotion: true,
    domainConfigPath: 'config/source-families.json',
    ignoredWorkingPaths: ['data/work', 'data/cache', 'data/extracted', 'data/generated'],
    notes: 'Populate sourceFiles with a small representative batch before real processing.',
  },
  expectedOutputs: template.expectedOutputs ?? config.outputContracts,
  reviewStatus: {
    defaultStatus: 'draft_candidate',
    reviewStrategy: 'exception_first',
    reviewFocus: 'exceptions_only',
    promotionGate:
      'source citation exists, source support is clear, wording is not misleading, confidence is high, and no unresolved review flags exist',
    learnerFacingAllowed: false,
    appReadyAllowed: false,
    reviewPacketRequired: true,
    notes: 'Populate sourceFiles with a small representative batch before real processing.',
  },
  notes: 'Populate sourceFiles with a small representative batch before real processing.',
  extensions: template.extensions ?? {},
}

await Promise.all([
  ensureDir(workRoot),
  ensureDir(batchRoot),
  ensureDir(reviewRoot),
  ensureDir(exportsRoot),
])

await writeJson(manifestPath, batchManifest)

console.log(`Prepared batch scaffold at ${batchRoot}`)
console.log(`Manifest: ${manifestPath}`)
