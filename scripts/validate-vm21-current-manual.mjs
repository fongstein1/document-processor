import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateCanonicalPackage } from './lib/canonical-package-validation.mjs'
import { loadVm21Chapter, segmentVm21Chapter, VM21_CHILD_COUNT, VM21_CHUNK_COUNT, VM21_PAGE_RANGE, VM21_PARENT_COUNT, VM21_SOURCE_SHA256 } from './lib/vm21-current-manual.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const sourcePath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources', 'vm21-current-manual.json')
const reviewRoot = path.join(repoRoot, 'data', 'processed', 'review_packages')
const relationshipPath = path.join(repoRoot, 'data', 'processed', 'relationship_registries', 'vm21-current-manual-relationship-candidates.json')
const reportPath = path.join(reviewRoot, 'vm21-validation-report.json')
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }

const main = async () => {
  const [config, sourcePackage, sourceQa, retrieval, supportGate, relationships, structuredEvidence, readiness, reviewPackage, promotionDecision] = await Promise.all([
    readJson(path.join(repoRoot, 'config', 'source-index-poc.json')),
    readJson(sourcePath),
    readJson(path.join(reviewRoot, 'vm21-source-qa.json')),
    readJson(path.join(reviewRoot, 'vm21-focused-retrieval-evaluation.json')),
    readJson(path.join(reviewRoot, 'vm21-support-gate-regression.json')),
    readJson(relationshipPath),
    readJson(path.join(reviewRoot, 'vm21-structured-evidence-inventory.json')),
    readJson(path.join(reviewRoot, 'vm21-processor-readiness-findings.json')),
    readJson(path.join(reviewRoot, 'vm21-canonical-coverage-review-package.json')),
    readJson(path.join(repoRoot, 'data', 'manual-input', 'promotion-decisions', 'vm21-2026-current-manual-promotion.json')),
  ])
  const sourceConfig = config.sources.find((source) => source.sourceId === 'vm21-current-manual')
  assert(sourceConfig, 'VM-21 source config is missing.')
  assert(!config.sources.some((source) => source.sourceId === 'vm21-sr-projection-entry'), 'Legacy VM-21 placeholder source remains configured.')
  const loaded = await loadVm21Chapter(repoRoot, sourceConfig.vm21Input)
  const structure = segmentVm21Chapter(loaded.chapterText)

  const genericValidation = validateCanonicalPackage({ sourcePackage, expectedSourceId: 'vm21-current-manual', expectedParentCount: VM21_PARENT_COUNT, expectedChildCount: VM21_CHILD_COUNT, expectedChunkCount: VM21_CHUNK_COUNT, pageRange: VM21_PAGE_RANGE, allowPromoted: true })
  assert(genericValidation.status === 'pass', `Generic canonical-package validation failed:\n${genericValidation.errors.join('\n')}`)
  assert(sourcePackage.source.sourceSha256 === VM21_SOURCE_SHA256, 'VM-21 source SHA-256 mismatch.')
  assert(sourcePackage.source.pageRange.start === 143 && sourcePackage.source.pageRange.end === 225, 'VM-21 package boundary mismatch.')
  assert(!loaded.chapterText.includes('[p. 226]'), 'VM-21 source crosses into PDF page 226.')
  assert(loaded.overlapChecks.length === 2 && loaded.overlapChecks.every((check) => check.exactMatch), 'VM-21 overlap reconciliation failed.')

  const chunkMap = new Map(sourcePackage.chunks.map((chunk) => [chunk.chunkId, chunk]))
  let sourceTextMismatchCount = 0
  for (const parent of structure) {
    const parentChunk = chunkMap.get(`vm21-${parent.id}`)
    if (parentChunk?.sourceTextExcerpt !== parent.text || parentChunk?.sourceTextSha256 !== parent.sourceTextSha256) sourceTextMismatchCount += 1
    for (const child of parent.children) {
      const childChunk = chunkMap.get(`vm21-${parent.id}-${child.id}`)
      if (childChunk?.sourceTextExcerpt !== child.text || childChunk?.sourceTextSha256 !== child.sourceTextSha256) sourceTextMismatchCount += 1
    }
  }
  assert(sourceTextMismatchCount === 0, `${sourceTextMismatchCount} VM-21 chunks differ from deterministic segmentation.`)
  assert(sourceQa.status === 'pass' && sourceQa.sourceFidelity.sourceTextRewriteCount === 0 && sourceQa.extraction.sourceReExtractionPerformed === false, 'VM-21 source QA failed.')
  assert(retrieval.allCasesPassed && retrieval.supportedTop3Count === retrieval.supportedQueryCount && retrieval.unsupportedCorrectCount === retrieval.unsupportedQueryCount && retrieval.ambiguitySafeCount === retrieval.ambiguityQueryCount, 'VM-21 focused retrieval regression failed.')
  assert(retrieval.currentAuthoritativeVm21Top1Count === retrieval.supportedQueryCount, 'Current VM-21 authority is not top-1 for every supported case.')
  assert(supportGate.status === 'pass' && supportGate.caseCount === 4 && supportGate.passedCaseCount === 4 && supportGate.cases.every((testCase) => testCase.passed), 'VM-21 support-gate regression failed.')
  const transparentNormalize = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '')
  const relationshipLabelsSourceFaithful = relationships.candidates.every((candidate) => transparentNormalize(chunkMap.get(candidate.sourceChunkId)?.sourceTextExcerpt).includes(transparentNormalize(candidate.targetLabel)))
  assert(relationships.relationshipCount === relationships.candidates.length && relationshipLabelsSourceFaithful && relationships.candidates.every((candidate) => candidate.relationType === 'references' && candidate.evidenceBasis === 'explicit_source_text_reference' && candidate.reviewDecision === 'pending' && candidate.promotionStatus === 'not_promoted' && candidate.promotionEligible === false), 'VM-21 relationship registry source-label fidelity or governance failed.')
  assert(structuredEvidence.recordCount === structuredEvidence.records.length && structuredEvidence.records.every((record) => record.sourceIdentity?.sourceId === 'vm21-current-manual' && record.sourceIdentity?.sourceSha256 === VM21_SOURCE_SHA256 && record.sourceLocator?.chunkId === record.sourceChunkId && record.values?.rawAndDisplayValues === 'retained_in_exact_source_text_not_recomputed' && record.authoritativeRepresentation === 'exact_source_text_excerpt' && record.reviewDecision === 'pending' && record.promotionStatus === 'not_promoted'), 'VM-21 structured-evidence provenance or governance failed.')
  assert(readiness.overallRating === 'AMBER' && readiness.findings.some((finding) => finding.classification === 'architecture_improvement') && readiness.findings.some((finding) => finding.classification === 'human_review_requirement'), 'VM-21 processor-readiness assessment is incomplete.')
  assert(reviewPackage.promoted === false && reviewPackage.promotionReadiness.currentStatus === 'review_only_pending_independent_review' && reviewPackage.promotionReadiness.promotionStatus === 'not_promoted' && reviewPackage.promotionReadiness.promotionEligible === false, 'VM-21 review package governance failed.')
  assert(sourcePackage.processing.reviewOnly === false && sourcePackage.processing.promotionStatus === 'promoted', 'VM-21 canonical promotion state is incomplete.')
  assert(promotionDecision.decision === 'approved_for_canonical_promotion' && promotionDecision.reviewEvidence?.blockersClosed === true && promotionDecision.scope?.sourceIds?.includes('vm21-current-manual'), 'VM-21 promotion decision is missing or out of scope.')

  const checks = [
    ...genericValidation.checks,
    { checkId: 'deterministic_batch_reuse', status: 'pass', details: `83 unique pages; ${loaded.overlapChecks.length} exact overlap checks; no source re-extraction.` },
    { checkId: 'deterministic_segmentation_fidelity', status: 'pass', details: `${VM21_CHUNK_COUNT}/${VM21_CHUNK_COUNT} chunks match deterministic source segments and SHA-256 values.` },
    { checkId: 'focused_retrieval', status: 'pass', details: `${retrieval.supportedTop1Count}/${retrieval.supportedQueryCount} top-1; ${retrieval.supportedTop3Count}/${retrieval.supportedQueryCount} strict top-3; ${retrieval.unsupportedCorrectCount}/${retrieval.unsupportedQueryCount} unsupported; ${retrieval.ambiguitySafeCount}/${retrieval.ambiguityQueryCount} ambiguity.` },
    { checkId: 'formal_requirement_support_gate', status: 'pass', details: `${supportGate.passedCaseCount}/${supportGate.caseCount} case-level regressions passed.` },
    { checkId: 'relationship_governance', status: 'pass', details: `${relationships.relationshipCount} explicit-reference candidates remain pending and unpromoted.` },
    { checkId: 'structured_evidence_governance', status: 'pass', details: `${structuredEvidence.recordCount} source-bound review records remain pending and unpromoted.` },
    { checkId: 'processor_readiness', status: 'pass', details: `Rating ${readiness.overallRating}; generic improvements and human-review limits explicitly classified.` },
  ]
  const report = {
    schemaVersion: '1.0', validationReportId: 'vm21-current-manual-validation-2026', status: 'pass', sourceId: 'vm21-current-manual', sourceSha256: VM21_SOURCE_SHA256,
    metrics: { pageCount: 83, overlapPageCount: loaded.overlapChecks.length, parentCount: VM21_PARENT_COUNT, childCount: VM21_CHILD_COUNT, totalChunkCount: VM21_CHUNK_COUNT, exactSourceChunkCount: VM21_CHUNK_COUNT, sourceTextRewriteCount: 0, sourceReExtractionCount: 0, sourceExplicitDefinedTermCount: sourcePackage.chunks.flatMap((chunk) => chunk.definedTerms ?? []).length, relationshipCandidateCount: relationships.relationshipCount, structuredEvidenceRecordCount: structuredEvidence.recordCount, supportedTop1: retrieval.supportedTop1Count, supportedTop3: retrieval.supportedTop3Count, supportedQueryCount: retrieval.supportedQueryCount, unsupportedCorrect: retrieval.unsupportedCorrectCount, unsupportedQueryCount: retrieval.unsupportedQueryCount, ambiguitySafe: retrieval.ambiguitySafeCount, ambiguityQueryCount: retrieval.ambiguityQueryCount, supportGatePassed: supportGate.passedCaseCount, supportGateCaseCount: supportGate.caseCount },
    checks, unresolvedHumanReview: sourceQa.unresolvedGaps,
    governance: { reviewOnly: false, promotionStatus: 'promoted', promotionEligible: true, independentReviewRequired: false, downstreamEligibilitySeparatelyGoverned: true },
  }
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  await fs.writeFile(reportPath.replace(/\.json$/, '.md'), `${['# VM-21 validation report', '', '- Result: **PASS**', `- Pages / parents / children / chunks: 83 / ${VM21_PARENT_COUNT} / ${VM21_CHILD_COUNT} / ${VM21_CHUNK_COUNT}`, '- Source re-extractions / source-text rewrites: 0 / 0', `- Focused retrieval top-1 / strict top-3: ${retrieval.supportedTop1Count}/${retrieval.supportedQueryCount} / ${retrieval.supportedTop3Count}/${retrieval.supportedQueryCount}`, `- Unsupported / ambiguity: ${retrieval.unsupportedCorrectCount}/${retrieval.unsupportedQueryCount} / ${retrieval.ambiguitySafeCount}/${retrieval.ambiguityQueryCount}`, `- Support gate: ${supportGate.passedCaseCount}/${supportGate.caseCount}`, '- Governance: canonical promoted; learner/app/RAG/vector/Copilot export remains separately blocked', '', 'The canonical source package is promoted under the recorded independent-review decision; this validation report remains QA evidence.'].join('\n')}\n`, 'utf8')
  console.log(`Validated VM-21: ${VM21_PARENT_COUNT} parents, ${VM21_CHILD_COUNT} children, ${VM21_CHUNK_COUNT} chunks, ${relationships.relationshipCount} relationships, ${structuredEvidence.recordCount} structured records.`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
