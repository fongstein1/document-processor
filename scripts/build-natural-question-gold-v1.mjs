import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const benchmarkRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-benchmark-v1')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', 'natural-question-gold-v1')
const approvedSourceRoot = path.resolve(process.env.DOCUMENT_PROCESSOR_SOURCE_ROOT || 'C:\\Dev\\Document Processor Sources')
const privateRoot = path.join(approvedSourceRoot, '_processed-private', 'natural-question-gold-v1-2026-09')
const privatePath = path.join(privateRoot, 'private_adjudication.json')
const questionArraySha256 = 'ebf779edc4caa38954a4ba8ca7d190807c3240b86b548d452791a0714cec9055'
const splitSeed = 'natural-question-gold-v1-split-2026-09'

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`
const tally = (values) => Object.fromEntries([...new Set(values)].sort().map((key) => [key, values.filter((value) => value === key).length]))

assert.ok(path.isAbsolute(approvedSourceRoot))
assert.ok(privateRoot.startsWith(approvedSourceRoot + path.sep))
assert.ok(!privateRoot.startsWith(repoRoot + path.sep))
assert.ok(privateRoot.split(path.sep).includes('_processed-private'))

const benchmark = JSON.parse(await fs.readFile(path.join(benchmarkRoot, 'natural_question_benchmark_v1.json'), 'utf8'))
const privateBytes = await fs.readFile(privatePath)
const adjudication = JSON.parse(privateBytes.toString('utf8'))
const benchmarkBytes = await fs.readFile(path.join(benchmarkRoot, 'natural_question_benchmark_v1.json'))
const baselineBytes = await fs.readFile(path.join(benchmarkRoot, 'natural_question_benchmark_v1_baseline_results.json'))
const provisionalBytes = await fs.readFile(path.join(benchmarkRoot, 'natural_question_benchmark_v1_provisional_assessments.json'))
assert.equal(sha256(JSON.stringify(benchmark.questions)), questionArraySha256)
assert.equal(adjudication.questionArraySha256, questionArraySha256)
assert.equal(adjudication.cases.length, 65)

const splitFor = (item) => {
  if (!['FULLY_SUPPORTED', 'PARTIALLY_SUPPORTED'].includes(item.primarySupportStatus)) return 'diagnostic'
  const basis = [item.primarySupportStatus, item.sourceFamily, item.modality, item.category, item.identifierPresence, item.supportStructure, item.questionId].join('|')
  const bucket = Number.parseInt(sha256(`${splitSeed}|${basis}`).slice(0, 8), 16) % 10
  return bucket < 6 ? 'development' : 'holdout'
}

const publicCases = adjudication.cases.map((item) => ({
  questionId: item.questionId,
  querySha256: item.querySha256,
  primarySupportStatus: item.primarySupportStatus,
  supportStructure: item.supportStructure,
  category: item.category,
  identifierPresence: item.identifierPresence,
  sourceFamily: item.sourceFamily,
  modality: item.modality,
  governingSourceAvailable: item.governingSourceAvailable,
  companionOnly: item.companionOnly,
  humanReviewState: item.humanReviewState,
  humanDisposition: item.humanDisposition ?? null,
  pendingSmeReview: item.pendingSmeReview ?? false,
  pass2Outcome: item.pass2.outcome,
  needsSme: item.needsSme,
  split: splitFor(item),
  acceptedEvidenceSets: item.acceptedEvidenceSets.map((set) => ({
    setId: set.setId,
    setHash: sha256(JSON.stringify(set.evidence.map((evidence) => ({
      sourceId: evidence.sourceId,
      parentChunkId: evidence.parentChunkId,
      chunkId: evidence.chunkId,
      citation: evidence.citation,
      role: evidence.role,
    })))),
    sufficiency: set.sufficiency,
    evidence: set.evidence.map((evidence) => ({
      sourceId: evidence.sourceId,
      sourceSha256: evidence.sourceSha256,
      sourceIndexSha256: evidence.sourceIndexSha256,
      parentChunkId: evidence.parentChunkId,
      chunkId: evidence.chunkId,
      citation: evidence.citation,
      role: evidence.role,
      authorityLevel: evidence.authorityLevel,
      promotionStatus: evidence.promotionStatus,
    })),
  })),
}))

const publicProjection = {
  schemaVersion: '1.0',
  goldId: 'natural-question-gold-v1',
  status: adjudication.status,
  evaluationLayer: 'review_only_non_canonical',
  startingRepositorySha: '547f72e94a0c40cf52890eff03e38d90498e0c52',
  benchmarkId: benchmark.benchmarkId,
  questionArraySha256,
  questionCount: publicCases.length,
  inputBindings: {
    benchmarkFileSha256: sha256(benchmarkBytes),
    baselineResultsSha256: sha256(baselineBytes),
    provisionalAssessmentsSha256: sha256(provisionalBytes),
  },
  reviewMethod: {
    pass1: 'MODEL_ADJUDICATED',
    pass2: 'INDEPENDENT_MODEL_REVIEWED',
    retrievalOutputsUsedForAdjudication: false,
    humanApprovalGranted: adjudication.status === 'FROZEN_HUMAN_APPROVED',
    humanReviewDispositionSource: adjudication.humanReview?.dispositionSource ?? null,
    humanReviewDispositionDate: adjudication.humanReview?.dispositionDate ?? null,
  },
  splitProtocol: {
    seed: splitSeed,
    algorithm: 'sha256_gold_attributes_modulo_10',
    developmentBuckets: [0, 1, 2, 3, 4, 5],
    holdoutBuckets: [6, 7, 8, 9],
    diagnosticRule: 'all statuses other than FULLY_SUPPORTED and PARTIALLY_SUPPORTED',
    forbiddenInputs: ['baseline rank', 'baseline score', 'provisional assessment', 'retrieval success', 'retrieval failure'],
  },
  privateArtifact: {
    relativeExternalLocation: '_processed-private/natural-question-gold-v1-2026-09/private_adjudication.json',
    sha256: sha256(privateBytes),
    byteCount: privateBytes.byteLength,
  },
  cases: publicCases,
}

const supported = publicCases.filter((item) => ['FULLY_SUPPORTED', 'PARTIALLY_SUPPORTED'].includes(item.primarySupportStatus))
const evidence = supported.flatMap((item) => item.acceptedEvidenceSets.flatMap((set) => set.evidence))
const summary = {
  schemaVersion: '1.0',
  goldId: publicProjection.goldId,
  status: publicProjection.status,
  questionCount: publicCases.length,
  supportStatusCounts: tally(publicCases.map((item) => item.primarySupportStatus)),
  supportStructureCounts: tally(publicCases.map((item) => item.supportStructure)),
  acceptedAlternativeSetCaseCount: supported.filter((item) => item.acceptedEvidenceSets.length > 1).length,
  governingSourceAvailableCount: publicCases.filter((item) => item.governingSourceAvailable).length,
  companionOnlyCount: publicCases.filter((item) => item.companionOnly).length,
  pass2OutcomeCounts: tally(publicCases.map((item) => item.pass2Outcome)),
  smeRequiredCount: publicCases.filter((item) => item.needsSme).length,
  pendingSmeReviewCount: publicCases.filter((item) => item.pendingSmeReview).length,
  humanApprovedCount: publicCases.filter((item) => item.humanReviewState === 'HUMAN_APPROVED').length,
  humanApprovedAmbiguousCount: publicCases.filter((item) => item.humanReviewState === 'HUMAN_APPROVED' && item.primarySupportStatus === 'AMBIGUOUS_REQUIRES_SME').length,
  sourceFamilyCounts: tally(publicCases.map((item) => item.sourceFamily)),
  modalityCounts: tally(publicCases.map((item) => item.modality)),
  splitCounts: tally(publicCases.map((item) => item.split)),
  modelComparisonReadiness: 'NOT_READY',
  readinessReasons: ['only 24 supported or partially supported questions', 'only 9 supported or partially supported holdout questions'],
  promotionStatusEvidenceCounts: tally(evidence.map((item) => item.promotionStatus)),
  authorityRoleEvidenceCounts: tally(evidence.map((item) => item.role)),
  privateArtifact: publicProjection.privateArtifact,
}

const reviewedCaseIds = adjudication.humanReview?.caseIds ?? []
assert.equal(adjudication.humanReview?.status, 'COMPLETE')
assert.equal(adjudication.humanReview?.unresolvedCaseCount, 0)
assert.equal(reviewedCaseIds.length, 21)
const agreementPool = publicCases.filter((item) => item.pass2Outcome === 'AGREE' && !item.needsSme)
const agreementQcCandidates = []
for (const key of [...new Set(agreementPool.map((item) => item.primarySupportStatus))].sort()) {
  agreementQcCandidates.push(agreementPool.find((item) => item.primarySupportStatus === key).questionId)
}
for (const key of ['SINGLE_UNIT', 'MULTI_UNIT_REQUIRED']) {
  const match = agreementPool.find((item) => item.supportStructure === key)
  if (match) agreementQcCandidates.push(match.questionId)
}
const agreementQc = [...new Set(agreementQcCandidates)]
const multiAuthorityQc = supported
  .filter((item) => item.primarySupportStatus === 'FULLY_SUPPORTED' && (item.acceptedEvidenceSets.length > 1 || item.acceptedEvidenceSets.some((set) => new Set(set.evidence.map((e) => e.authorityLevel)).size > 1)))
  .map((item) => item.questionId)
const smeProjection = {
  schemaVersion: '1.0',
  status: 'human_review_complete',
  caseIds: [...reviewedCaseIds].sort((a, b) => Number(a) - Number(b)),
  needsSmeCaseIds: publicCases.filter((item) => item.needsSme).map((item) => item.questionId),
  pendingSmeReviewCaseIds: publicCases.filter((item) => item.pendingSmeReview).map((item) => item.questionId),
  humanApprovedAmbiguousCaseIds: publicCases.filter((item) => item.humanReviewState === 'HUMAN_APPROVED' && item.primarySupportStatus === 'AMBIGUOUS_REQUIRES_SME').map((item) => item.questionId),
  disagreementCaseIds: publicCases.filter((item) => !['AGREE', 'NEEDS_SME'].includes(item.pass2Outcome)).map((item) => item.questionId),
  agreementQcCaseIds: agreementQc,
  highImpactMultipleAuthorityCaseIds: multiAuthorityQc,
  detailedPacketLocation: '_processed-private/natural-question-gold-v1-2026-09/sme_review_packet.json',
}

const privatePacket = {
  schemaVersion: '1.0',
  status: 'human_review_complete',
  generatedFromPrivateAdjudicationSha256: sha256(privateBytes),
  cases: adjudication.cases
    .filter((item) => smeProjection.caseIds.includes(item.questionId))
    .map((item) => ({
      questionId: item.questionId,
      query: item.query,
      primarySupportStatus: item.primarySupportStatus,
      humanReviewState: item.humanReviewState,
      humanDisposition: item.humanDisposition,
      pendingSmeReview: item.pendingSmeReview,
      pass1: item.pass1,
      pass2: item.pass2,
      resolution: item.resolution,
      rationale: item.rationale,
      acceptedEvidenceSets: item.acceptedEvidenceSets,
    })),
}
const privatePacketBytes = Buffer.from(stableJson(privatePacket))
await fs.writeFile(path.join(privateRoot, 'sme_review_packet.json'), privatePacketBytes)
const privateArtifacts = [
  publicProjection.privateArtifact,
  {
    relativeExternalLocation: '_processed-private/natural-question-gold-v1-2026-09/sme_review_packet.json',
    sha256: sha256(privatePacketBytes),
    byteCount: privatePacketBytes.byteLength,
  },
]
publicProjection.privateArtifacts = privateArtifacts
summary.privateArtifactCount = privateArtifacts.length
summary.privateArtifactByteCount = privateArtifacts.reduce((sum, item) => sum + item.byteCount, 0)
summary.privateArtifacts = privateArtifacts

await fs.mkdir(outputRoot, { recursive: true })
await fs.writeFile(path.join(outputRoot, 'natural_question_gold_v1.json'), stableJson(publicProjection))
await fs.writeFile(path.join(outputRoot, 'natural_question_gold_v1_summary.json'), stableJson(summary))
await fs.writeFile(path.join(outputRoot, 'natural_question_gold_v1_sme_projection.json'), stableJson(smeProjection))

const manifest = {
  schemaVersion: '1.0',
  goldId: publicProjection.goldId,
  files: [],
}
for (const name of ['natural_question_gold_v1.json', 'natural_question_gold_v1_summary.json', 'natural_question_gold_v1_sme_projection.json']) {
  const bytes = await fs.readFile(path.join(outputRoot, name))
  manifest.files.push({ path: name, sha256: sha256(bytes), byteCount: bytes.byteLength })
}
await fs.writeFile(path.join(outputRoot, 'manifest.json'), stableJson(manifest))

console.log(JSON.stringify({ outputRoot, privateRoot, summary }, null, 2))
