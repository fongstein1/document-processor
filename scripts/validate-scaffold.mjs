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
const manifestPath = path.join(
  repoRoot,
  'data',
  'work',
  'batches',
  'batch-001',
  'batch-manifest.json',
)

const requiredFiles = [
  'README.md',
  'package.json',
  'config/source-families.json',
  'data/README.md',
  'data/templates/batch-manifest.template.json',
  'docs/processor/PROJECT_BRIEF.md',
  'docs/codex/skills/README.md',
  'docs/codex/skills/SOURCE_BOUND_EXTRACTION_SKILL.md',
  'docs/codex/skills/LEARNER_FACING_PROMOTION_GATE_SKILL.md',
  'docs/codex/skills/RAG_READINESS_SKILL.md',
  'docs/codex/skills/EXCEPTION_FIRST_REVIEW_SKILL.md',
  'docs/codex/skills/CROSS_DOMAIN_PORTABILITY_SKILL.md',
  'docs/codex/skills/PRIVACY_AND_DATA_HYGIENE_SKILL.md',
  'docs/codex/skills/APP_EXPORT_CONTRACT_SKILL.md',
  'docs/codex/skills/SESSION_HANDOFF_SKILL.md',
  'docs/project-state/CURRENT_STATE.md',
  'docs/project-state/HANDOFF_PROCESS.md',
  'docs/project-state/SOURCE_GUARDRAILS.md',
  'docs/project-state/DECISIONS.md',
  'docs/project-state/NEXT_ACTIONS.md',
  'docs/project-state/SESSION_LOG.md',
  'scripts/bootstrap-small-batch.mjs',
  'scripts/validate-scaffold.mjs',
]

const ensureExists = async (relativePath, problems) => {
  try {
    await fs.access(path.join(repoRoot, relativePath))
  } catch {
    problems.push(`Missing required file: ${relativePath}`)
  }
}

const readJson = async (filePath) =>
  JSON.parse(await fs.readFile(filePath, 'utf8'))

const exists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const problems = []
const warnings = []

for (const relativePath of requiredFiles) {
  await ensureExists(relativePath, problems)
}

const config = await readJson(configPath)
const template = await readJson(templatePath)

if (!config.project?.name) {
  problems.push('config/source-families.json is missing project.name')
}
if (!config.project?.rawSourceRoot) {
  problems.push('config/source-families.json is missing project.rawSourceRoot')
}
if (!Array.isArray(config.sourceFamilies) || config.sourceFamilies.length === 0) {
  problems.push('config/source-families.json has no sourceFamilies')
}
if (!Array.isArray(config.outputContracts) || config.outputContracts.length === 0) {
  problems.push('config/source-families.json has no outputContracts')
}

for (const family of config.sourceFamilies ?? []) {
  for (const sourceRoot of family.sourceRoots ?? []) {
    if (!(await exists(sourceRoot))) {
      problems.push(`Missing raw source root: ${sourceRoot}`)
    }
  }
}

for (const contract of config.outputContracts ?? []) {
  if (!template.requiredDeliverables?.includes(contract)) {
    problems.push(`Batch template does not include required deliverable: ${contract}`)
  }
}

if (await exists(manifestPath)) {
  const manifest = await readJson(manifestPath)
  if (manifest.batchId !== 'batch-001') {
    problems.push('Working batch manifest must use batchId batch-001')
  }
  if (!Array.isArray(manifest.selectedSourceFiles)) {
    problems.push('Working batch manifest is missing selectedSourceFiles')
  }
  if (!Array.isArray(manifest.requiredDeliverables)) {
    problems.push('Working batch manifest is missing requiredDeliverables')
  }
} else {
  warnings.push('Working batch manifest has not been created yet. Run npm run bootstrap.')
}

if (problems.length > 0) {
  console.error('Scaffold validation failed.')
  for (const problem of problems) {
    console.error(`- ${problem}`)
  }
  process.exitCode = 1
} else {
  console.log('Scaffold validation passed.')
  console.log(`- Source families: ${config.sourceFamilies.length}`)
  console.log(`- Required deliverables: ${config.outputContracts.length}`)
  console.log(`- Working batch manifest: ${await exists(manifestPath) ? 'present' : 'not created yet'}`)
}

for (const warning of warnings) {
  console.warn(`- ${warning}`)
}
