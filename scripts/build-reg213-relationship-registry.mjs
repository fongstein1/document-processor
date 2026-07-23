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
const fail = (message) => { throw new Error(message) }
const hashId = (value) => `relationship-${crypto.createHash('sha256').update(value).digest('hex').slice(0, 16)}`

const main = async () => {
  const args = parseArgs(process.argv)
  const familyPath = resolvePath(args.family ?? 'config/reg213-relationship-family.json')
  const outputPath = resolvePath(args.output ?? 'data/processed/relationship_registries/reg213-candidate-relationship-registry.json')
  const family = await readJson(familyPath)
  if (family.reviewOnly !== true || family.learnerFacingAllowed !== false || family.appReadyAllowed !== false || family.ragReadyAllowed !== false || family.promotionStatus !== 'not_promoted') {
    fail('Regulation 213 relationship family must remain review-only and not promoted.')
  }

  const sourceById = new Map(family.sources.map((source) => [source.sourceId, source]))
  const artifactById = new Map(family.reviewArtifacts.map((artifact) => [artifact.artifactId, artifact]))
  const entries = []
  const add = ({ sourceId, targetId, relationType, confidence, evidenceStrength, generationRule, caveat, notes, evidence }) => {
    if (!sourceById.has(sourceId) && !artifactById.has(sourceId)) fail(`Unknown relationship source: ${sourceId}`)
    if (!sourceById.has(targetId) && !artifactById.has(targetId)) fail(`Unknown relationship target: ${targetId}`)
    if (sourceId === targetId && relationType !== 'same_source') fail(`Self relationship is not allowed: ${sourceId}`)
    const key = `${sourceId}|${targetId}|${relationType}`
    if (entries.some((entry) => entry.relationshipKey === key)) return
    entries.push({
      relationshipKey: key,
      relationshipId: hashId(key),
      sourceId,
      targetId,
      sourceDocumentId: sourceById.get(sourceId)?.documentId ?? artifactById.get(sourceId)?.documentId ?? sourceId,
      targetDocumentId: sourceById.get(targetId)?.documentId ?? artifactById.get(targetId)?.documentId ?? targetId,
      targetScope: 'family',
      relationType,
      direction: 'source_to_target',
      relationshipStatus: 'candidate',
      origin: 'manual_review',
      reviewRequired: true,
      promotionStatus: 'not_promoted',
      promotionEligible: false,
      reviewDecision: 'pending',
      reviewer: null,
      reviewDate: null,
      reviewRationale: '',
      finalRelationType: null,
      finalConfidence: null,
      confidence,
      evidenceStrength,
      generationRule,
      caveat,
      notes,
      evidence
    })
  }

  for (const source of family.sources.filter((item) => item.documentType === 'amendment_text')) {
    add({
      sourceId: source.sourceId,
      targetId: 'reg213-base',
      relationType: 'amends',
      confidence: 0.88,
      evidenceStrength: 'formal_title_or_amendment_numbering',
      generationRule: 'formal-amendment-title-to-base-regulation',
      caveat: 'Documentary amendment relationship only; legal scope, effective date, controlling version, and supersession are not determined.',
      notes: `Amendment No. ${source.amendmentNumber} is identified as an amendment to 11 NYCRR 103 in the tracked review metadata.`,
      evidence: [
        { sourcePath: source.sourcePath, sectionReference: 'title and amendment designation', notes: source.metadataEvidence },
        { sourcePath: sourceById.get('reg213-base').sourcePath, sectionReference: '11 NYCRR Part 103 / Regulation 213 identification', notes: 'Target is the tracked base-regulation record.' }
      ]
    })
  }

  add({
    sourceId: 'reg213-amendment-1-faq',
    targetId: 'reg213-amendment-1',
    relationType: 'companion_to',
    confidence: 0.94,
    evidenceStrength: 'formal_title_or_amendment_numbering',
    generationRule: 'faq-guidance-note-to-amendment-metadata',
    caveat: 'FAQ may be explanatory or non-binding; this candidate does not determine authority, compliance effect, or legal interpretation.',
    notes: 'The tracked review index identifies the FAQ as a Life Bureau guidance note on Amendment No. 1 and labels it companion-only.',
    evidence: [
      { sourcePath: 'NY Regulations/Reg-213-11-NYCRR-S103-Amendment-1-FAQ.pdf', pageReference: 'pages 1-3', notes: 'FAQ source title and guidance-note framing.' },
      { sourcePath: 'docs/review/reg213_amendment1_faq_review_index.md', sectionReference: 'Source status and source reference', notes: 'Tracked review metadata labels the FAQ companion-only.' }
    ]
  })

  for (const artifact of family.reviewArtifacts) {
    const relationType = artifact.artifactType === 'review_index' ? 'derived_from' : 'supports_review_of'
    add({
      sourceId: artifact.artifactId,
      targetId: artifact.sourceDocumentId,
      relationType,
      confidence: 0.99,
      evidenceStrength: 'review_artifact_link',
      generationRule: 'tracked-review-artifact-source-link',
      caveat: 'Review artifact supports review only and does not confer regulatory authority or controlling-source status.',
      notes: `${artifact.artifactType} is a tracked review artifact for the source document.`,
      evidence: [
        { sourcePath: artifact.sourcePath, sectionReference: artifact.artifactType, notes: 'Tracked artifact path and sourceDocumentId are explicit in the Reg-213 family manifest.' },
        { sourcePath: sourceById.get(artifact.sourceDocumentId).sourcePath, sectionReference: 'source record', notes: 'Target source is explicitly named in the family manifest.' }
      ]
    })
  }

  const registry = {
    schemaVersion: '1.0',
    registryId: 'reg213-candidate-relationship-registry',
    familyId: family.familyId,
    generatedAt: family.generatedAt,
    reviewOnly: true,
    learnerFacingAllowed: false,
    appReadyAllowed: false,
    ragReadyAllowed: false,
    promotionStatus: 'not_promoted',
    relationshipCount: entries.length,
    relationships: entries.map(({ relationshipKey, ...entry }) => entry),
    notes: 'Regulation 213 documentary relationship candidates. No legal effect, authority, supersession, or controlling-source conclusion is asserted.'
  }

  await writeJson(outputPath, registry)
  await writeText(path.join(path.dirname(outputPath), 'reg213-candidate-relationship-registry.md'), [
    '# Regulation 213 Candidate Relationship Registry',
    '',
    '- Candidate only: Yes',
    '- Review-only: Yes',
    '- Promoted: No',
    '- Legal effect determined: No',
    `- Relationship count: ${registry.relationshipCount}`,
    '',
    '## Candidate relationships',
    '',
    '| Relationship | Source | Relation | Target | Confidence | Evidence | Status |',
    '| --- | --- | --- | --- | ---: | --- | --- |',
    ...registry.relationships.map((relationship) => `| \`${relationship.relationshipId}\` | ${relationship.sourceId} | ${relationship.relationType} | ${relationship.targetId} | ${relationship.confidence.toFixed(2)} | ${relationship.evidenceStrength} | ${relationship.relationshipStatus} |`),
    '',
    '## Safeguards',
    '',
    '- Amendment edges are documentary candidates; legal scope and effective-date analysis remain open.',
    '- No supersession, reprint, duplicate, or controlling-source relationship is inferred from chronology or filename alone.',
    '- FAQ and review-artifact edges do not establish binding authority.',
    '- Every candidate is pending human review and blocked from promotion.'
  ].join('\n'))
  console.log(`Built ${registry.relationshipCount} Regulation 213 review-only relationship candidates.`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
