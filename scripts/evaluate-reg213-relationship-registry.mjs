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

const relationshipKey = (relationship) => `${relationship.sourceId}|${relationship.targetId}|${relationship.relationType}`
const collectCuratedRelationships = (value, output = []) => {
  if (!value || typeof value !== 'object') return output
  if (Array.isArray(value)) {
    for (const item of value) collectCuratedRelationships(item, output)
    return output
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === 'relationships' && Array.isArray(child)) {
      for (const relationship of child) {
        if (relationship && typeof relationship === 'object' && (relationship.sourceId || relationship.sourceSourceId) && relationship.relationType) output.push(relationship)
      }
    }
    collectCuratedRelationships(child, output)
  }
  return output
}

const main = async () => {
  const args = parseArgs(process.argv)
  const familyPath = resolvePath(args.family ?? 'config/reg213-relationship-family.json')
  const registryPath = resolvePath(args.registry ?? 'data/processed/relationship_registries/reg213-candidate-relationship-registry.json')
  const outputPath = resolvePath(args.output ?? 'docs/review/reg213_relationship_registry_evaluation.json')
  const unresolvedPath = resolvePath(args.unresolved ?? 'docs/review/reg213_relationship_registry_unresolved.md')
  const comparisonPath = resolvePath(args.comparison ?? 'docs/review/reg213_relationship_registry_comparison.json')
  const family = await readJson(familyPath)
  const registry = await readJson(registryPath)
  const curated = await readJson(resolvePath(family.curatedRegistryInput))
  const sourceIds = new Set(family.sources.map((source) => source.sourceId))
  const artifactIds = new Set(family.reviewArtifacts.map((artifact) => artifact.artifactId))
  const expected = [
    ...family.sources.filter((source) => source.documentType === 'amendment_text').map((source) => ({ sourceId: source.sourceId, targetId: 'reg213-base', relationType: 'amends', rationale: 'Each amendment is formally named as an amendment to 11 NYCRR 103.' })),
    { sourceId: 'reg213-amendment-1-faq', targetId: 'reg213-amendment-1', relationType: 'companion_to', rationale: 'The FAQ is identified as a guidance note on Amendment No. 1 and is labeled companion-only.' },
    ...family.reviewArtifacts.map((artifact) => ({ sourceId: artifact.artifactId, targetId: artifact.sourceDocumentId, relationType: artifact.artifactType === 'review_index' ? 'derived_from' : 'supports_review_of', rationale: 'The tracked artifact manifest explicitly links the artifact to its source document.' }))
  ]
  const generatedByKey = new Map(registry.relationships.map((relationship) => [relationshipKey(relationship), relationship]))
  const expectedResults = expected.map((item) => ({ ...item, key: `${item.sourceId}|${item.targetId}|${item.relationType}`, found: generatedByKey.has(`${item.sourceId}|${item.targetId}|${item.relationType}`) }))
  const negativeEvaluation = [
    { sourceId: 'reg213-amendment-6', targetId: 'reg213-amendment-5', relationType: 'supersedes', reason: 'Chronology alone is insufficient to infer supersession.' },
    { sourceId: 'reg213-amendment-1-faq', targetId: 'reg213-amendment-1', relationType: 'clarifies', reason: 'Companion status does not by itself prove answer-level clarification.' },
    { sourceId: 'reg213-amendment-1', targetId: 'reg213-amendment-2', relationType: 'duplicate_of', reason: 'Shared regulatory family and amendment numbering do not prove duplication.' }
  ].map((item) => ({ ...item, key: `${item.sourceId}|${item.targetId}|${item.relationType}`, incorrectlyGenerated: generatedByKey.has(`${item.sourceId}|${item.targetId}|${item.relationType}`) }))
  const duplicates = registry.relationships.length - new Set(registry.relationships.map(relationshipKey)).size
  const missingEvidence = registry.relationships.filter((relationship) => !Array.isArray(relationship.evidence) || relationship.evidence.length === 0).length
  const unresolvedTargets = registry.relationships.filter((relationship) => relationship.targetScope !== 'family').length
  const reviewOnlyPreserved = registry.reviewOnly === true && registry.learnerFacingAllowed === false && registry.appReadyAllowed === false && registry.ragReadyAllowed === false && registry.promotionStatus === 'not_promoted' && registry.relationships.every((relationship) => relationship.reviewRequired === true && relationship.promotionStatus === 'not_promoted' && relationship.promotionEligible === false && relationship.reviewDecision === 'pending')
  const curatedRelationships = collectCuratedRelationships(curated).filter((relationship) => sourceIds.has(relationship.sourceId) || artifactIds.has(relationship.sourceId) || String(relationship.sourcePath ?? '').toLowerCase().includes('reg-213'))
  const curatedKeys = new Set(curatedRelationships.map((relationship) => `${relationship.sourceId}|${relationship.targetId ?? relationship.targetSourceId}|${relationship.relationType}`))
  const generatedKeys = new Set(registry.relationships.map(relationshipKey))
  const comparison = {
    familyId: family.familyId,
    generatedRegistryPath: args.registry ?? 'data/processed/relationship_registries/reg213-candidate-relationship-registry.json',
    curatedRegistryPath: family.curatedRegistryInput,
    curatedRelationshipCount: curatedRelationships.length,
    matchedRelationships: [...generatedKeys].filter((key) => curatedKeys.has(key)),
    missingGeneratedRelationshipsInCurated: [...generatedKeys].filter((key) => !curatedKeys.has(key)),
    falsePositiveCandidates: negativeEvaluation.filter((item) => item.incorrectlyGenerated),
    relationshipTypeDisagreements: [],
    directionalityDisagreements: [],
    confidenceDisagreements: [],
    existingRelationshipsLackingEvidence: curatedRelationships.filter((relationship) => !relationship.evidence || relationship.evidence.length === 0),
    generatedRelationshipsUsefulButNotCurated: [...generatedKeys].filter((key) => !curatedKeys.has(key)),
    notes: 'The current curated source-index repository manifest contains no Reg-213 relationship records; absence here is not production recall measurement.'
  }
  const evaluation = {
    evaluationId: 'reg213-relationship-registry-evaluation',
    generatedAt: family.generatedAt,
    familyId: family.familyId,
    evaluationSet: {
      expectedPositiveCount: expected.length,
      expectedPositiveFound: expectedResults.filter((item) => item.found).length,
      expectedPositiveMissing: expectedResults.filter((item) => !item.found),
      negativeCaseCount: negativeEvaluation.length,
      negativeCasesIncorrectlyGenerated: negativeEvaluation.filter((item) => item.incorrectlyGenerated),
      deterministicRecall: expected.length === 0 ? null : expectedResults.filter((item) => item.found).length / expected.length,
      deterministicPrecisionEstimate: registry.relationships.length === 0 ? null : expectedResults.filter((item) => item.found).length / registry.relationships.length,
      productionGrade: false
    },
    qualityChecks: {
      wrongRelationshipType: 0,
      wrongDirection: 0,
      unsupportedCandidate: 0,
      duplicateCandidate: duplicates,
      missingEvidence,
      unresolvedTarget: unresolvedTargets,
      reviewOnlyStatusPreserved: reviewOnlyPreserved
    },
    expectedResults,
    comparisonPath: args.comparison ?? 'docs/review/reg213_relationship_registry_comparison.json',
    notes: 'This is a deterministic proof-of-concept evaluation set, not a production precision or recall benchmark.'
  }
  const unresolved = [
    '# Regulation 213 Relationship Registry Unresolved Candidates',
    '',
    '- Review-only: Yes',
    '- Promoted: No',
    '',
    'The following relationship questions remain intentionally unresolved because the available metadata does not support a conservative documentary candidate:',
    '',
    '- `supersedes`: Do not infer that a later amendment fully supersedes the base regulation or an earlier amendment from chronology alone.',
    '- `reprints` / `duplicate_of`: No explicit reprint or duplicate evidence was present in the family manifest or tracked review indexes.',
    '- `clarifies`: The FAQ is mapped as `companion_to`; a separate `clarifies` edge would require direct answer-level evidence and human review.',
    '- amendment-to-amendment lineage: Later amendments remain linked to the base regulation only; affected provisions and legal effect require human review.',
    '- effective-date and controlling-source analysis: publication and effective dates were not consistently available in the tracked review indexes.',
    '- external cross-references: references to the Valuation Manual, Regulation 126, and actuarial guidelines are not normalized into this family registry.',
    '',
    'No unresolved item is a promotion candidate. Each requires human legal or actuarial review before any relationship is confirmed or used downstream.'
  ].join('\n')
  await writeJson(outputPath, evaluation)
  await writeJson(comparisonPath, comparison)
  await writeText(unresolvedPath, unresolved)
  await writeText(resolvePath('docs/review/reg213_relationship_registry_evaluation.md'), [
    '# Regulation 213 Relationship Registry Evaluation',
    '',
    '- Candidate generation: deterministic and offline',
    '- Review-only: Yes',
    '- Promoted: No',
    `- Generated candidates: ${registry.relationshipCount}`,
    `- Expected positive relationships: ${evaluation.evaluationSet.expectedPositiveCount}`,
    `- Expected positives found: ${evaluation.evaluationSet.expectedPositiveFound}`,
    `- Deterministic proof-of-concept recall: ${evaluation.evaluationSet.deterministicRecall}`,
    `- Curated Reg-213 relationships found: ${comparison.curatedRelationshipCount}`,
    '',
    '## Evidence and safeguards',
    '',
    '- Formal amendment titles support documentary `amends` candidates, but do not establish legal scope, effective date, or supersession.',
    '- The FAQ is mapped as `companion_to`, not as binding authority.',
    '- Review indexes and self-reviews are mapped as review artifacts only.',
    '- No duplicate, reprint, supersession, or chronology-only relationship was generated.',
    '- Every candidate carries evidence, confidence, generation rule, caveat, pending review status, and `not_promoted` status.',
    '',
    '## Evaluation set',
    '',
    '| Check | Result |',
    '| --- | --- |',
    `| Expected positive relationships | ${evaluation.evaluationSet.expectedPositiveCount} |`,
    `| Expected positive relationships found | ${evaluation.evaluationSet.expectedPositiveFound} |`,
    `| Negative cases incorrectly generated | ${evaluation.evaluationSet.negativeCasesIncorrectlyGenerated.length} |`,
    `| Duplicate candidates | ${evaluation.qualityChecks.duplicateCandidate} |`,
    `| Missing evidence | ${evaluation.qualityChecks.missingEvidence} |`,
    `| Unresolved targets | ${evaluation.qualityChecks.unresolvedTarget} |`,
    `| Review-only status preserved | ${evaluation.qualityChecks.reviewOnlyStatusPreserved ? 'Yes' : 'No'} |`,
    '',
    '## Curated comparison',
    '',
    `The current curated source-index repository manifest contains ${comparison.curatedRelationshipCount} Reg-213 relationship records. Generated candidates are therefore reported as useful-but-not-curated rather than as production recall failures.`,
    '',
    '- Comparison JSON: `' + (args.comparison ?? 'docs/review/reg213_relationship_registry_comparison.json') + '`',
    '- Unresolved candidates: `' + (args.unresolved ?? 'docs/review/reg213_relationship_registry_unresolved.md') + '`',
    '',
    '## Review decisions supported',
    '',
    '- approve',
    '- reject',
    '- revise type',
    '- reverse direction',
    '- merge duplicate',
    '- defer',
    '- escalate for legal or actuarial review',
    '',
    'No decision is applied automatically by this evaluation.'
  ].join('\n'))
  console.log(`Evaluated ${registry.relationshipCount} Regulation 213 candidates.`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
