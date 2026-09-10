import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')
const cfg = JSON.parse(await fs.readFile(path.join(repoRoot, 'config/section-challenge-v1.json'), 'utf8'))
const publicRoot = path.join(repoRoot, 'data/processed/review_packages', cfg.runId)
const privateRoot = path.resolve(cfg.privateRoot)
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'))
const sha = value => crypto.createHash('sha256').update(value).digest('hex')
const write = async (file, value) => fs.writeFile(file, JSON.stringify(value, null, 2) + '\n')

const development = await read(path.join(publicRoot, 'development-results.json'))
const holdout = await read(path.join(publicRoot, 'holdout-results.json'))
const evaluation = await read(path.join(publicRoot, 'evaluation-freeze.json'))
const architecture = await read(path.join(publicRoot, 'architecture-freeze.json'))
const gold = await read(path.join(privateRoot, 'section-challenge-v1-adjudication.json'))
const diagnosticRankings = await read(path.join(privateRoot, 'diagnostic', 'rankings.json'))
const goldById = new Map(gold.cases.map(item => [item.caseId, item]))

const classifyAbsent = item => {
  const systems = Object.values(item.systems)
  if (systems.every(system => !system.sourceRank || system.sourceRank > 3)) return 'SOURCE_RETRIEVAL_FAILURE'
  if (item.modality === 'XLSX') return 'TABLE_REPRESENTATION'
  if (systems.some(system => system.parentRank && system.parentRank <= 10)) return 'EVIDENCE_UNIT_STRUCTURE'
  if (item.structuralClassifications.identifierPresence === 'ABSENT') return 'LEXICAL_WEAKNESS_OR_VECTOR_REPRESENTATION_MISMATCH'
  return 'METADATA_DEFICIT_OR_UNRESOLVED'
}

const residuals = result => ({
  childRankingResidual: result.cases.filter(item => item.childRankingResidual).map(item => ({ caseId: item.caseId, sourceId: item.sourceId, modality: item.modality, structuralClassifications: item.structuralClassifications })),
  top100Absent: result.cases.filter(item => item.top100Absent).map(item => ({ caseId: item.caseId, sourceId: item.sourceId, modality: item.modality, structuralClassifications: item.structuralClassifications, likelyCause: classifyAbsent(item) }))
})

const diagnostic = {
  schemaVersion: '1.0',
  runId: cfg.runId,
  evaluationVersion: cfg.evaluationVersion,
  mode: 'diagnostic',
  caseCount: diagnosticRankings.cases.length,
  cases: diagnosticRankings.cases.map(item => ({
    caseId: item.caseId,
    queryHash: item.queryHash,
    diagnosticClassification: goldById.get(item.caseId)?.classification,
    A_BM25: { topChildId: item.rankings.bm25[0]?.childId || null, topSourceId: item.rankings.bm25[0]?.sourceId || null },
    B_VECTOR: { topChildId: item.rankings.vector[0]?.childId || null, topSourceId: item.rankings.vector[0]?.sourceId || null },
    C_HYBRID: { topChildId: item.rankings.hybrid[0]?.childId || null, topSourceId: item.rankings.hybrid[0]?.sourceId || null },
    D_STRUCTURAL: { topChildId: item.rankings.structural[0]?.childId || null, topSourceId: item.rankings.structural[0]?.sourceId || null },
    supportedGoldAvailable: false
  })),
  evaluatorOnlyGoldScoring: false,
  reviewOnly: true,
  promotionStatus: 'not_promoted',
  ragReadyAllowed: false
}

const report = {
  schemaVersion: '1.0',
  runId: cfg.runId,
  evaluationVersion: cfg.evaluationVersion,
  startingSha: cfg.startingSha,
  evaluationFreezeSha256: sha(await fs.readFile(path.join(publicRoot, 'evaluation-freeze.json'))),
  architectureFreezeSha256: sha(await fs.readFile(path.join(publicRoot, 'architecture-freeze.json'))),
  counts: {
    totalCaseCount: evaluation.counts.supported + evaluation.counts.diagnostic,
    supportedCaseCount: evaluation.counts.supported,
    developmentCaseCount: development.caseCount,
    holdoutCaseCount: holdout.caseCount,
    diagnosticCaseCount: diagnostic.caseCount,
    matchedPairCount: evaluation.counts.matchedPairs,
    pdfCaseCount: evaluation.modalityCounts.PDF,
    xlsxCaseCount: evaluation.modalityCounts.XLSX
  },
  structuralFeatureInventory: evaluation.featureInventory,
  candidateUnion: {
    cutoffs: architecture.candidateCutoffs,
    development: development.unionCandidateDiagnostics,
    holdout: holdout.unionCandidateDiagnostics
  },
  structuralScoring: {
    normalization: architecture.normalization,
    rules: architecture.structuralScoringRules,
    confidenceRules: architecture.confidenceRules,
    bounds: architecture.structuralScoreBounds
  },
  development: {
    summaries: development.summaries,
    identifierPresent: development.slices.identifierPresent,
    identifierAbsent: development.slices.identifierAbsent,
    direct: development.slices.direct,
    paraphrased: development.slices.paraphrased,
    a3: development.slices.a3,
    rerankEffects: development.rerankEffects,
    thresholdAssessment: development.thresholdAssessment,
    residuals: residuals(development)
  },
  holdout: {
    summaries: holdout.summaries,
    identifierPresent: holdout.slices.identifierPresent,
    identifierAbsent: holdout.slices.identifierAbsent,
    direct: holdout.slices.direct,
    paraphrased: holdout.slices.paraphrased,
    a3: holdout.slices.a3,
    rerankEffects: holdout.rerankEffects,
    thresholdAssessment: holdout.thresholdAssessment,
    residuals: residuals(holdout)
  },
  decisions: {
    sectionChallengeEvaluationMaturity: 'LEVEL_3',
    structuralRerankerMaturity: 'LEVEL_2',
    structuralRoutingHardening: 'PASS_WITH_LIMITATIONS',
    nextStep: 'SECTION_RERANKER_HARDENING'
  },
  limitations: [
    'Holdout wrong-section rescues were 1 versus the prefrozen minimum of 2.',
    'Holdout target Top-1 remained 0.05 and parent Top-1 remained 0.30.',
    'Eight holdout cases remained child-ranking residuals and four accepted targets remained absent from the deep union.',
    'The deterministic rules are an auditable review-only experiment, not a production router or answer layer.'
  ],
  reviewOnly: true,
  promotionStatus: 'not_promoted',
  ragReadyAllowed: false
}

validateGitSafeArtifact({ artifactType: 'section-challenge-diagnostic', value: diagnostic })
validateGitSafeArtifact({ artifactType: 'section-challenge-final-report', value: report })
await write(path.join(publicRoot, 'diagnostic-results.json'), diagnostic)
await write(path.join(publicRoot, 'final-report.json'), report)
console.log(JSON.stringify({ decisions: report.decisions, holdoutThresholdAssessment: holdout.thresholdAssessment, diagnosticCaseCount: diagnostic.caseCount }, null, 2))
