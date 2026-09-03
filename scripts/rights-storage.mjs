import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export const unresolvedRightsStatuses = new Set(['RIGHTS_REVIEW_REQUIRED', 'RIGHTS_EXTERNAL_STORAGE_ONLY'])
export const substantiveArtifactTypes = ['extraction', 'chunk-manifest', 'source-index', 'retrieval-smoke-tests']
const prohibitedKeys = new Set(['sourceTextExcerpt', 'normalizedTextExcerpt', 'normalizedSearchText', 'text', 'value', 'formula', 'query', 'keywords', 'keyPoints', 'concepts', 'definedTerms', 'requirements'])

export const sha256Bytes = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
export const hasSubstantiveContent = (value, key = '') => {
  if (prohibitedKeys.has(key) && typeof value === 'string' && value.trim()) return true
  if (Array.isArray(value)) return value.some((item) => hasSubstantiveContent(item, key))
  if (value && typeof value === 'object') return Object.entries(value).some(([childKey, childValue]) => hasSubstantiveContent(childValue, childKey))
  return false
}

export const validateRightsState = ({ policy, repoRoot, batch, repoArtifacts, externalArtifacts, externalFiles }) => {
  const statuses = new Set(policy.statuses)
  if (!statuses.has(policy.defaultStatus)) throw new Error('Rights policy default status is invalid.')
  if ((batch.sourceFiles || []).some((source) => !source.rightsStatus || !statuses.has(source.rightsStatus))) throw new Error('Rights status omitted or invalid for a batch source.')
  const requiredSources = (batch.sourceFiles || []).filter((source) => unresolvedRightsStatuses.has(source.rightsStatus))
  if (!requiredSources.length) throw new Error('No rights-controlled sources were supplied.')
  const repoArtifactValues = repoArtifacts || {}
  for (const [artifactType, document] of Object.entries(repoArtifactValues)) {
    if (hasSubstantiveContent(document)) throw new Error('Prohibited substantive content present in Git artifact: ' + artifactType)
  }
  const records = externalArtifacts || []
  for (const source of requiredSources) {
    if (!unresolvedRightsStatuses.has(source.rightsStatus)) throw new Error('Rights status omitted for ' + source.sourceId)
    for (const artifactType of substantiveArtifactTypes) {
      const record = records.find((item) => item.sourceId === source.sourceId && item.artifactType === artifactType)
      if (!record) throw new Error('Missing external artifact manifest record: ' + source.sourceId + '/' + artifactType)
      if (record.rightsStorageStatus !== source.rightsStatus || record.reviewOnly !== true) throw new Error('External artifact rights metadata is invalid: ' + source.sourceId + '/' + artifactType)
      const absolute = path.resolve(record.externalPath)
      const relativeToRepo = path.relative(path.resolve(repoRoot), absolute)
      if (!relativeToRepo || (!relativeToRepo.startsWith('..' + path.sep) && relativeToRepo !== '..' && !path.isAbsolute(relativeToRepo))) throw new Error('External artifact is inside the Git repository: ' + record.externalPath)
      const bytes = externalFiles?.get(record.externalPath) ?? externalFiles?.get(absolute)
      if (bytes === undefined) throw new Error('External artifact is missing: ' + record.externalPath)
      const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(String(bytes), 'utf8')
      if (record.sha256 !== sha256Bytes(buffer) || record.byteCount !== buffer.length) throw new Error('External artifact hash/byte count mismatch: ' + record.externalPath)
      if (record.sourceRawSha256 !== source.fileHash) throw new Error('External artifact raw-source lineage mismatch: ' + record.externalPath)
    }
  }
  return { controlledSourceCount: requiredSources.length, externalArtifactCount: records.length, prohibitedGitContent: false }
}

export const validateRightsFilesystem = async ({ policy, repoRoot, outputRoot }) => {
  const readJson = async (name) => JSON.parse(await fs.readFile(path.join(outputRoot, name), 'utf8'))
  const batch = await readJson('batch-manifest.json')
  const manifest = await readJson('external-artifact-manifest.json')
  const repoArtifacts = {}
  for (const name of ['extraction-output.json', 'chunk-manifest.json', 'source-index-candidates.json', 'retrieval-smoke-tests.json']) repoArtifacts[name] = await readJson(name)
  const externalFiles = new Map()
  for (const item of manifest.artifacts || []) externalFiles.set(item.externalPath, await fs.readFile(item.externalPath))
  return validateRightsState({ policy, repoRoot, batch, repoArtifacts, externalArtifacts: manifest.artifacts, externalFiles })
}
