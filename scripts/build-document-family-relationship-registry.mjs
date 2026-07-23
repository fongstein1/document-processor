import crypto from 'node:crypto'
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

const resolvePath = (value, baseDir = repoRoot) => {
  if (!value) return null
  return path.isAbsolute(value) ? value : path.resolve(baseDir, value)
}

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
const writeText = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${value}\n`, 'utf8')
}

const fail = (message) => {
  throw new Error(message)
}

const hashId = (value) => `relationship-${crypto.createHash('sha256').update(value).digest('hex').slice(0, 16)}`

const ensureReviewOnly = (value, label) => {
  if (value?.reviewOnly !== true || value?.learnerFacingAllowed !== false || value?.appReadyAllowed !== false || value?.ragReadyAllowed !== false) {
    fail(`${label} must remain review-only and block downstream promotion.`)
  }
}

const buildMarkdown = (registry) => {
  const lines = [
    `# ${registry.registryId}`,
    '',
    `- Family ID: ${registry.familyId}`,
    `- Relationship count: ${registry.relationshipCount}`,
    `- Status: candidate relationships requiring human review`,
    `- Review-only: Yes`,
    '',
    '## Relationships',
    '',
    '| Relationship | Source | Relation | Target | Scope | Status | Origin |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ]
  for (const relationship of registry.relationships) {
    lines.push(`| \`${relationship.relationshipId}\` | ${relationship.sourceId} | ${relationship.relationType} | ${relationship.targetId} | ${relationship.targetScope} | ${relationship.relationshipStatus} | ${relationship.origin} |`)
  }
  lines.push('', '## Review posture', '', '- Relationship edges are candidates, not confirmed facts.', '- Confirm companion, duplicate, amendment, supersession, and cross-reference semantics before promotion.', '')
  return lines.join('\n')
}

const main = async () => {
  const args = parseArgs(process.argv)
  const intakePath = resolvePath(args.intake)
  const reviewedPackPath = args['reviewed-packages'] ? resolvePath(args['reviewed-packages']) : null
  const outputPath = resolvePath(args.output)
  if (!intakePath || !outputPath) {
    throw new Error('Required arguments: --intake and --output. Optional: --reviewed-packages.')
  }

  const intake = await readJson(intakePath)
  ensureReviewOnly(intake, 'Intake source-index input')
  if (!Array.isArray(intake.sourceRecords) || intake.sourceRecords.length === 0) {
    fail('Intake source-index input must contain sourceRecords.')
  }
  const reviewedPack = reviewedPackPath ? await readJson(reviewedPackPath) : null
  if (reviewedPack) ensureReviewOnly(reviewedPack, 'Reviewed source pack')

  const recordsByReference = new Map()
  for (const record of intake.sourceRecords) {
    recordsByReference.set(record.sourceId, record.sourceId)
    recordsByReference.set(record.documentId, record.sourceId)
  }

  const resolveReference = (reference) => {
    if (!reference) return { id: 'external:unspecified', documentId: null, scope: 'unknown', known: false }
    if (recordsByReference.has(reference)) return { id: recordsByReference.get(reference), documentId: reference, scope: 'family', known: true }
    return { id: reference, documentId: reference, scope: 'external', known: false }
  }

  const entries = []
  const addEntry = ({ sourceDocumentId, targetDocumentId, relationType, notes, origin, evidence = [] }) => {
    const source = resolveReference(sourceDocumentId)
    const target = resolveReference(targetDocumentId)
    const relationshipStatus = source.known && target.known ? 'candidate' : 'needs_review'
    const relationshipKey = [source.id, target.id, relationType].join('|')
    if (entries.some((entry) => entry.relationshipKey === relationshipKey)) return
    entries.push({
      relationshipKey,
      relationshipId: hashId(relationshipKey),
      sourceId: source.id,
      targetId: target.id,
      sourceDocumentId: sourceDocumentId ?? source.id,
      targetDocumentId: target.documentId,
      targetScope: target.scope,
      relationType,
      relationshipStatus,
      origin,
      reviewRequired: true,
      notes: notes ?? '',
      evidence,
    })
  }

  for (const hint of intake.relationshipHints ?? []) {
    addEntry({
      sourceDocumentId: hint.sourceDocumentId,
      targetDocumentId: hint.targetDocumentId,
      relationType: hint.relationType,
      notes: hint.notes,
      origin: 'intake_manifest',
    })
  }

  for (const sourcePackage of reviewedPack?.sourcePackages ?? []) {
    for (const relationship of sourcePackage.relationships ?? []) {
      addEntry({
        sourceDocumentId: sourcePackage.sourceId,
        targetDocumentId: relationship.targetSourceId ?? relationship.targetDocumentId ?? relationship.targetId,
        relationType: relationship.relationType,
        notes: relationship.notes,
        origin: 'reviewed_source_pack',
        evidence: relationship.evidence ?? [],
      })
    }
  }

  const registry = {
    schemaVersion: '1.0',
    registryId: `${intake.familyId}-relationship-registry`,
    familyId: intake.familyId,
    generatedAt: new Date().toISOString(),
    reviewOnly: true,
    learnerFacingAllowed: false,
    appReadyAllowed: false,
    ragReadyAllowed: false,
    promotionStatus: 'not_promoted',
    relationshipCount: entries.length,
    relationships: entries.map(({ relationshipKey, ...entry }) => entry),
    notes: 'Deterministic candidate relationship registry. Confirm edges during human review before promotion or retrieval use.',
  }

  await writeJson(outputPath, registry)
  await writeText(path.join(path.dirname(outputPath), `${path.basename(outputPath, path.extname(outputPath))}.md`), buildMarkdown(registry))
  console.log(`Built ${registry.relationshipCount} review-only relationship candidates.`)
  console.log(`Relationship registry: ${outputPath.replace(`${repoRoot}${path.sep}`, '').split(path.sep).join('/')}`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
