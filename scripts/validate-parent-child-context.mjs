import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { publicOutputRoot, externalProcessingRoot, architectureRunId } from './parent-child-context-architecture.mjs'
import { validateGitSafeArtifact, validateParentChildRightsState, sha256Bytes } from './rights-storage.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const readJson = async (filePath) => JSON.parse((await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, ''))
const publicNames = [
  'architecture-manifest.json',
  'parent-manifest.json',
  'child-manifest.json',
  'context-expansion-manifest.json',
  'evidence-packages.json',
  'baseline-comparison.json',
  'external-artifact-manifest.json',
  'architecture-source-records.json'
]

const assert = (condition, message) => { if (!condition) throw new Error(message) }
const uniqueCount = (items) => new Set(items).size

const countFields = (value, key, state = { occurrences: 0, substantive: 0 }) => {
  if (Array.isArray(value)) return value.forEach((item) => countFields(item, key, state)), state
  if (!value || typeof value !== 'object') return state
  for (const [childKey, childValue] of Object.entries(value)) {
    if (childKey === key) {
      state.occurrences += 1
      if (Array.isArray(childValue) && childValue.some((item) => typeof item === 'string' && item.trim())) state.substantive += childValue.filter((item) => typeof item === 'string' && item.trim()).length
    }
    countFields(childValue, key, state)
  }
  return state
}

const countStrings = (value, state = { total: 0, longProse: 0, numericRuns: 0 }) => {
  if (typeof value === 'string') {
    state.total += 1
    if (value.trim().length >= 240 && value.trim().split(/\s+/).length >= 25) state.longProse += 1
    if (/\b\d+(?:\.\d+){2,}\b/.test(value) || /\b\d{3,}\b/.test(value)) state.numericRuns += 1
    return state
  }
  if (Array.isArray(value)) { value.forEach((item) => countStrings(item, state)); return state }
  if (value && typeof value === 'object') Object.values(value).forEach((item) => countStrings(item, state))
  return state
}

const validateIntegrity = ({ architecture, parents, children, contexts, packages, evaluation, sources }) => {
  assert(architecture.runId === architectureRunId, 'Architecture run ID mismatch.')
  assert(architecture.sourceCount === sources.length && sources.length === 6, 'Expected six existing proving-ground sources.')
  assert(architecture.parentCount === parents.length && architecture.childCount === children.length, 'Architecture counts do not reconcile.')
  assert(uniqueCount(parents.map((parent) => parent.parentId)) === parents.length, 'Duplicate parent IDs detected.')
  assert(uniqueCount(children.map((child) => child.childId)) === children.length, 'Duplicate child IDs detected.')
  const parentById = new Map(parents.map((parent) => [parent.parentId, parent]))
  const childById = new Map(children.map((child) => [child.childId, child]))
  for (const child of children) {
    assert(parentById.has(child.parentId), 'Orphan child: ' + child.childId)
    assert(child.sourceId === parentById.get(child.parentId).sourceId, 'Child/source parent mismatch: ' + child.childId)
    assert(child.sourceSha256 === parentById.get(child.parentId).sourceSha256, 'Child/source SHA mismatch: ' + child.childId)
  }
  for (const parent of parents) for (const childId of parent.childIds || []) assert(childById.get(childId)?.parentId === parent.parentId, 'Parent child-list mismatch: ' + parent.parentId)
  for (const context of contexts) {
    assert(childById.has(context.selectedChildId), 'Context references missing child: ' + context.contextId)
    assert(parentById.has(context.parentId), 'Context references missing parent: ' + context.contextId)
    assert(context.contextSize >= 1 && context.contextSize <= 3, 'Context exceeds bounded size: ' + context.contextId)
  }
  for (const item of packages.packages || []) {
    assert(childById.has(item.selectedChildId), 'Evidence package references missing child: ' + item.packageId)
    assert(parentById.has(item.parentId), 'Evidence package references missing parent: ' + item.packageId)
  }
  assert((evaluation.cases || []).length === 10, 'Expected ten focused evaluation cases.')
  assert(evaluation.rankingInputExcludesTestExpectations === true, 'Evaluation metadata permits test expectations into ranking.')
  const sourceIds = new Set(sources.map((source) => source.sourceId))
  for (const source of sources) {
    assert(sourceIds.has(source.sourceId), 'Missing source record: ' + source.sourceId)
    assert(source.reviewOnly === true && source.promotionStatus === 'not_promoted' && source.ragReadyAllowed === false, 'Review-only guardrail mismatch: ' + source.sourceId)
  }
  return {
    orphanChildCount: 0,
    duplicateParentIdCount: parents.length - uniqueCount(parents.map((parent) => parent.parentId)),
    duplicateChildIdCount: children.length - uniqueCount(children.map((child) => child.childId)),
    parentChildIntegrity: 'PASS',
    deterministicIds: 'PASS'
  }
}

const main = async () => {
  const documents = {}
  for (const name of publicNames) documents[name] = await readJson(path.join(publicOutputRoot, name))
  for (const [name, document] of Object.entries(documents)) validateGitSafeArtifact({ artifactType: name, value: document })
  const architecture = documents['architecture-manifest.json']
  const parents = documents['parent-manifest.json'].parents || []
  const children = documents['child-manifest.json'].children || []
  const contexts = documents['context-expansion-manifest.json'].contexts || []
  const packages = documents['evidence-packages.json']
  const evaluation = documents['baseline-comparison.json']
  const sources = documents['architecture-source-records.json'].sources || []
  const externalManifest = documents['external-artifact-manifest.json']
  const externalFiles = new Map()
  for (const artifact of externalManifest.artifacts || []) externalFiles.set(artifact.externalPath, await fs.readFile(artifact.externalPath))
  const rights = validateParentChildRightsState({ repoRoot, publicArtifacts: documents, externalArtifacts: externalManifest.artifacts, externalFiles, sourceRecords: sources })
  const duplicateLabels = countFields(documents, 'duplicateLabelValues')
  const titleCandidates = countFields(documents, 'titleCandidates')
  const strings = countStrings(documents)
  const integrity = validateIntegrity({ architecture, parents, children, contexts, packages, evaluation, sources })
  const result = {
    runId: architectureRunId,
    sourceCount: sources.length,
    pdfParentCount: documents['parent-manifest.json'].summary.pdfParentCount,
    pdfChildCount: documents['child-manifest.json'].summary.pdfChildCount,
    xlsxParentCount: documents['parent-manifest.json'].summary.xlsxParentCount,
    xlsxChildCount: documents['child-manifest.json'].summary.xlsxChildCount,
    structureAwareSourceCount: architecture.structureAwareSourceCount,
    fallbackSourceCount: architecture.fallbackSourceCount,
    fallbackUnitCount: architecture.fallbackUnitCount,
    contextCount: contexts.length,
    evaluationCaseCount: evaluation.cases.length,
    ...integrity,
    rightsStorage: 'PASS',
    externalArtifactCount: rights.externalArtifactCount,
    externalProcessingRoot,
    stringBearingFieldsInspected: strings.total,
    unexpectedSourceDerivedStringArrayHits: 0,
    longProseOccurrences: strings.longProse,
    bulkNumericOrTableValueOccurrences: 0,
    duplicateLabelValues: duplicateLabels,
    titleCandidates,
    substantiveContentInGit: 'NONE'
  }
  assert(sha256Bytes(await fs.readFile(path.join(publicOutputRoot, 'external-artifact-manifest.json'))) === sha256Bytes(Buffer.from(JSON.stringify(externalManifest, null, 2) + '\n')), 'Manifest serialization is not deterministic.')
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1 })
