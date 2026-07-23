import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const resolvePath = (value) => path.isAbsolute(value) ? value : path.resolve(repoRoot, value)
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const fail = (message) => { throw new Error(message) }
const assert = (condition, message) => { if (!condition) fail(message) }
const relationshipKey = (relationship) => `${relationship.sourceId}|${relationship.targetId}|${relationship.relationType}`

const main = async () => {
  const family = await readJson(resolvePath('config/reg213-relationship-family.json'))
  const inventory = await readJson(resolvePath('data/processed/relationship_registries/reg213-family-inventory.json'))
  const registry = await readJson(resolvePath('data/processed/relationship_registries/reg213-candidate-relationship-registry.json'))
  const evaluation = await readJson(resolvePath('docs/review/reg213_relationship_registry_evaluation.json'))
  const sourceIds = new Set(family.sources.map((source) => source.sourceId))
  const artifactIds = new Set(family.reviewArtifacts.map((artifact) => artifact.artifactId))
  const allIds = new Set([...sourceIds, ...artifactIds])
  assert(inventory.sourceCount === family.sources.length, 'Family inventory source count is stale.')
  assert(inventory.artifactCount === family.reviewArtifacts.length, 'Family inventory artifact count is stale.')
  assert(registry.reviewOnly === true && registry.learnerFacingAllowed === false && registry.appReadyAllowed === false && registry.ragReadyAllowed === false && registry.promotionStatus === 'not_promoted', 'Registry promotion guardrails are not intact.')
  assert(registry.relationshipCount === registry.relationships.length, 'Registry relationshipCount does not match relationships length.')
  const keys = new Set()
  const legalSensitiveTypes = new Set(['amends', 'supersedes', 'reprints', 'clarifies', 'companion_to', 'duplicate_of'])
  for (const relationship of registry.relationships) {
    assert(allIds.has(relationship.sourceId), `Unknown relationship source: ${relationship.sourceId}`)
    assert(allIds.has(relationship.targetId), `Unknown relationship target: ${relationship.targetId}`)
    assert(relationship.sourceId !== relationship.targetId || relationship.relationType === 'same_source', `Unexpected self relationship: ${relationship.relationshipId}`)
    assert(relationship.direction === 'source_to_target', `Invalid direction: ${relationship.relationshipId}`)
    assert(!keys.has(relationshipKey(relationship)), `Duplicate relationship: ${relationshipKey(relationship)}`)
    keys.add(relationshipKey(relationship))
    assert(Number.isFinite(relationship.confidence) && relationship.confidence >= 0 && relationship.confidence <= 1, `Invalid confidence: ${relationship.relationshipId}`)
    assert(typeof relationship.generationRule === 'string' && relationship.generationRule.length > 0, `Missing generation rule: ${relationship.relationshipId}`)
    assert(typeof relationship.caveat === 'string' && relationship.caveat.length > 0, `Missing caveat: ${relationship.relationshipId}`)
    assert(Array.isArray(relationship.evidence) && relationship.evidence.length > 0, `Missing evidence: ${relationship.relationshipId}`)
    assert(relationship.reviewRequired === true && relationship.reviewDecision === 'pending', `Review state is not pending: ${relationship.relationshipId}`)
    assert(relationship.promotionStatus === 'not_promoted' && relationship.promotionEligible === false, `Promotion guardrail drift: ${relationship.relationshipId}`)
    if (legalSensitiveTypes.has(relationship.relationType)) assert(/legal|authority|controlling|effective|documentary|non-binding/i.test(relationship.caveat), `Legal-effect caveat is too weak: ${relationship.relationshipId}`)
    for (const evidence of relationship.evidence) assert(typeof evidence.sourcePath === 'string' && evidence.sourcePath.length > 0, `Evidence source path missing: ${relationship.relationshipId}`)
  }
  for (const source of family.sources) {
    assert(source.reviewIndexPath && source.selfReviewPath, `Review links missing for ${source.sourceId}`)
    await fs.access(resolvePath(source.reviewIndexPath))
    await fs.access(resolvePath(source.selfReviewPath))
    if (source.documentType === 'amendment_text') {
      const relation = registry.relationships.find((item) => item.sourceId === source.sourceId && item.targetId === 'reg213-base' && item.relationType === 'amends')
      assert(relation, `Amendment relationship missing for ${source.sourceId}`)
      assert(relation.sourceId.includes(`amendment-${source.amendmentNumber}`), `Amendment numbering mismatch for ${source.sourceId}`)
    }
  }
  for (const artifact of family.reviewArtifacts) await fs.access(resolvePath(artifact.sourcePath))
  assert(evaluation.qualityChecks.reviewOnlyStatusPreserved === true, 'Evaluation does not preserve review-only status.')
  assert(evaluation.qualityChecks.missingEvidence === 0, 'Evaluation reports missing evidence.')
  assert(evaluation.qualityChecks.unresolvedTarget === 0, 'Evaluation reports unresolved targets.')
  console.log(`Validated Reg-213 family inventory (${family.sources.length} sources, ${family.reviewArtifacts.length} artifacts).`)
  console.log(`Validated ${registry.relationshipCount} candidate relationships with evidence, caveats, and pending review status.`)
  console.log(`Validated evaluation and legal-effect safeguards.`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
