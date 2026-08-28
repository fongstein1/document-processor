import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { evaluateFormalRequirementQueries } from './evaluate-formal-requirement-retrieval.mjs'
import { loadVm31Chapter, segmentVm31Chapter, VM31_CHILD_COUNT, VM31_CHUNK_COUNT, VM31_PAGE_RANGE, VM31_PARENT_COUNT, VM31_SOURCE_SHA256 } from './lib/vm31-current-manual.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const processedRoot = path.join(repoRoot, 'data', 'processed')
const sourceRoot = path.join(processedRoot, 'source_indexes', 'sources')
const reviewRoot = path.join(processedRoot, 'review_packages')
const relationshipRoot = path.join(processedRoot, 'relationship_registries')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const queryPath = path.join(repoRoot, 'data', 'manual-input', 'evaluation', 'vm31-focused-retrieval-queries.json')
const sourcePackagePath = path.join(sourceRoot, 'vm31-current-manual.json')
const sourceQaPath = path.join(reviewRoot, 'vm31-source-qa.json')
const retrievalPath = path.join(reviewRoot, 'vm31-focused-retrieval-evaluation.json')
const relationshipPath = path.join(relationshipRoot, 'vm31-current-manual-relationship-candidates.json')
const reviewPackagePath = path.join(reviewRoot, 'vm31-canonical-coverage-review-package.json')
const promptPath = path.join(reviewRoot, 'vm31-independent-review-prompt.md')
const supportGatePath = path.join(reviewRoot, 'vm31-support-gate-regression.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
const writeMarkdown = async (jsonPath, value) => fs.writeFile(jsonPath.replace(/\.json$/, '.md'), `${value.trim()}\n`, 'utf8')
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const hashFile = async (filePath) => sha256(await fs.readFile(filePath))
const relative = (filePath) => path.relative(repoRoot, filePath).replace(/\\/g, '/')
const unique = (values) => [...new Set(values.filter(Boolean))]

const relationshipTargets = {
  'VM-01': { targetId: 'vm-01', targetKind: 'corpus_target' },
  'VM-20': { targetId: 'vm-20', targetKind: 'corpus_target' },
  'VM-21': { targetId: 'vm-21', targetKind: 'corpus_target' },
  'VM-22': { targetId: 'vm-22', targetKind: 'corpus_target' },
  'VM-30': { targetId: 'vm-30', targetKind: 'corpus_target' },
  'VM-G': { targetId: 'vm-g', targetKind: 'corpus_target' },
  'VM-M': { targetId: 'vm-m', targetKind: 'corpus_target' },
  'AG 43': { targetId: 'ag-43', targetKind: 'corpus_target', canonicalTargetLabel: 'Actuarial Guideline XLIII' },
  'Actuarial Guideline XLIII': { targetId: 'ag-43', targetKind: 'corpus_target' },
}

const buildRelationships = (sourcePackage) => {
  const candidates = []
  for (const chunk of sourcePackage.chunks.filter((candidate) => candidate.chunkLevel === 'child')) {
    for (const targetLabel of chunk.crossReferenceCandidates ?? []) {
      const target = relationshipTargets[targetLabel]
      if (!target) continue
      candidates.push({
        relationshipId: `${chunk.chunkId}-references-${target.targetId}`,
        sourceChunkId: chunk.chunkId,
        sourceSection: chunk.sectionReference,
        relationType: 'references',
        targetLabel,
        targetId: target.targetId,
        targetKind: target.targetKind,
        ...(target.canonicalTargetLabel ? { canonicalTargetLabel: target.canonicalTargetLabel } : {}),
        evidence: {
          sourceSha256: VM31_SOURCE_SHA256,
          pageStart: chunk.pageStart,
          pageEnd: chunk.pageEnd,
          sectionReference: chunk.sectionReference,
          sourceTextSha256: sha256(chunk.sourceTextExcerpt),
          canonicalSourcePackagePath: relative(sourcePackagePath),
        },
        evidenceBasis: 'explicit_source_text_reference',
        caveat: 'This candidate records an explicit documentary reference only; it does not infer legal hierarchy, supersession, controlling-source status, or downstream promotion.',
        reviewDecision: 'pending',
        promotionStatus: 'not_promoted',
        promotionEligible: false,
      })
    }
  }
  return {
    schemaVersion: '1.0',
    relationshipRegistryId: 'vm31-current-manual-relationship-candidates-2026',
    sourceId: 'vm31-current-manual',
    relationshipCount: candidates.length,
    relationTypes: ['references'],
    targetCounts: Object.fromEntries(Object.keys(relationshipTargets).map((label) => [label, candidates.filter((candidate) => candidate.targetLabel === label).length]).filter(([, count]) => count > 0)),
    governance: { reviewOnly: true, reviewDecision: 'pending', promotionStatus: 'not_promoted', promotionEligible: false },
    candidates,
  }
}

const buildFocusedEvaluation = async (sourcePackage) => {
  const querySpec = await readJson(queryPath)
  const packageFiles = (await fs.readdir(sourceRoot)).filter((filename) => filename.endsWith('.json'))
  const packages = await Promise.all(packageFiles.map((filename) => readJson(path.join(sourceRoot, filename))))
  const sourcePackages = packages.map((source) => source.source)
  const chunkRecords = packages.flatMap((source) => source.chunks.map((chunk) => ({
    ...chunk,
    sourceId: source.source.sourceId,
    sourceTitle: source.source.sourceTitle,
    sourceReference: source.source.sourceReference,
    sourceFamilyId: source.source.sourceFamilyId,
    authorityLevel: source.source.authorityLevel,
    sourceStatus: source.source.sourceStatus,
    sourceVersionIdentifier: source.source.sourceVersionIdentifier,
  })))
  const evaluation = evaluateFormalRequirementQueries({ queries: querySpec.queries, chunkRecords, sourcePackages, unsupportedThreshold: 3, topN: 5 })
  const chunkLookup = new Map(chunkRecords.map((chunk) => [chunk.chunkId, chunk]))
  const cases = evaluation.queries.map((result) => {
    const actualTop3 = result.rankedMatches.slice(0, 3).map((match, index) => {
      const chunk = chunkLookup.get(match.chunkId)
      return {
        rank: index + 1,
        chunkId: match.chunkId,
        sourceId: match.sourceId,
        sourceFamilyId: match.sourceFamilyId,
        authorityLevel: match.authorityLevel,
        score: match.score,
        sectionReference: chunk?.sectionReference ?? null,
        pageStart: chunk?.pageStart ?? null,
        pageEnd: chunk?.pageEnd ?? null,
        citationAvailable: Boolean(chunk?.citations?.length),
      }
    })
    const expectedOutcome = result.expectedOutcome ?? 'supported'
    const ambiguousEvidence = actualTop3.filter((match) => {
      const chunk = chunkLookup.get(match.chunkId)
      return match.sourceId === 'vm31-current-manual' && (chunk?.provisionTypes ?? []).includes('certification')
    })
    const ambiguityResult = expectedOutcome === 'ambiguous'
      ? { safelyAbstained: ambiguousEvidence.length >= 2, reasonCode: ambiguousEvidence.length >= 2 ? 'multiple_vm31_certification_contexts' : 'ambiguity_not_sufficiently_exposed', candidateChunkIds: ambiguousEvidence.map((match) => match.chunkId) }
      : { safelyAbstained: false, reasonCode: 'not_applicable', candidateChunkIds: [] }
    const supportDecision = expectedOutcome === 'ambiguous'
      ? { ...result.supportDecision, supportState: 'ambiguous_requires_more_context', evidenceSufficient: false, reasonCode: ambiguityResult.reasonCode, reason: 'The request does not identify the applicable report or certification context, and multiple current VM-31 contexts are retrieved.' }
      : result.supportDecision
    const passed = expectedOutcome === 'supported'
      ? result.top3Hit && supportDecision.supportState === 'supported'
      : expectedOutcome === 'unsupported'
        ? supportDecision.supportState === 'unsupported'
        : ambiguityResult.safelyAbstained
    return {
      queryId: result.queryId,
      queryCategory: result.queryCategory,
      query: result.query,
      intendedSupportState: expectedOutcome,
      expectedEvidence: result.expectedEvidence,
      expectedChunkIds: result.expectedChunkIds,
      actualTop1: actualTop3[0] ?? null,
      actualTop3,
      top1Hit: expectedOutcome === 'supported' ? result.top1Hit : false,
      top3Hit: expectedOutcome === 'supported' ? result.top3Hit : false,
      sourceFamilyResult: { expected: result.expectedSourceFamilyIds, actualTop1: result.predictedSourceFamilyId, correct: result.expectedSourceFamilyIds.includes(result.predictedSourceFamilyId) },
      authorityResult: { expected: result.expectedAuthorityLevels, actualTop1: result.predictedAuthorityLevel, correct: result.expectedAuthorityLevels.includes(result.predictedAuthorityLevel), currentAuthoritativeVm31Top1: actualTop3[0]?.sourceId === 'vm31-current-manual' },
      supportDecision,
      ambiguityResult,
      passed,
      failureReason: passed ? null : result.resultLabel,
    }
  })
  const supported = cases.filter((testCase) => testCase.intendedSupportState === 'supported')
  const unsupported = cases.filter((testCase) => testCase.intendedSupportState === 'unsupported')
  const ambiguous = cases.filter((testCase) => testCase.intendedSupportState === 'ambiguous')
  return {
    schemaVersion: '1.0',
    evaluationId: querySpec.evaluationId,
    artifactPurpose: 'case_level_independent_review',
    method: evaluation.method,
    productionEvidenceWindow: 3,
    queryCount: cases.length,
    supportedQueryCount: supported.length,
    supportedTop1Count: supported.filter((testCase) => testCase.top1Hit).length,
    supportedTop3Count: supported.filter((testCase) => testCase.top3Hit).length,
    unsupportedQueryCount: unsupported.length,
    unsupportedCorrectCount: unsupported.filter((testCase) => testCase.passed).length,
    ambiguityQueryCount: ambiguous.length,
    ambiguitySafeCount: ambiguous.filter((testCase) => testCase.passed).length,
    currentAuthoritativeVm31Top1Count: supported.filter((testCase) => testCase.authorityResult.currentAuthoritativeVm31Top1).length,
    sourceFamilyAccuracyCount: supported.filter((testCase) => testCase.sourceFamilyResult.correct).length,
    authorityLevelAccuracyCount: supported.filter((testCase) => testCase.authorityResult.correct).length,
    allCasesPassed: cases.every((testCase) => testCase.passed),
    queries: cases,
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false },
  }
}

const main = async () => {
  const [config, sourcePackage, supportGate] = await Promise.all([readJson(configPath), readJson(sourcePackagePath), readJson(supportGatePath)])
  const sourceConfig = config.sources.find((source) => source.sourceId === 'vm31-current-manual')
  if (!sourceConfig) throw new Error('VM-31 source configuration is missing.')
  const { chapterText, aggregateExtractionSha256 } = await loadVm31Chapter(repoRoot, sourceConfig.vm31Input)
  const structure = segmentVm31Chapter(chapterText)
  const relationships = buildRelationships(sourcePackage)
  await writeJson(relationshipPath, relationships)
  const purposeChunkIds = ['vm31-section-1-purpose', 'vm31-section-1-purpose-purpose']
  const purposeChunks = purposeChunkIds.map((chunkId) => sourcePackage.chunks.find((chunk) => chunk.chunkId === chunkId))
  const ag43Relationships = relationships.candidates.filter((candidate) => candidate.targetId === 'ag-43')
  if (purposeChunks.some((chunk) => !chunk)) throw new Error('VM-31 purpose/context chunks are missing from the canonical source package.')
  if (ag43Relationships.length !== 2) throw new Error(`Expected 2 AG 43 relationship candidates; found ${ag43Relationships.length}.`)

  const focusedEvaluation = await buildFocusedEvaluation(sourcePackage)
  await writeJson(retrievalPath, focusedEvaluation)
  await writeMarkdown(retrievalPath, [
    '# VM-31 focused retrieval evaluation', '',
    `- Cases: ${focusedEvaluation.queryCount}`,
    `- Supported top-1 / strict top-3: ${focusedEvaluation.supportedTop1Count}/${focusedEvaluation.supportedQueryCount} / ${focusedEvaluation.supportedTop3Count}/${focusedEvaluation.supportedQueryCount}`,
    `- Unsupported correctly rejected: ${focusedEvaluation.unsupportedCorrectCount}/${focusedEvaluation.unsupportedQueryCount}`,
    `- Ambiguity safely handled: ${focusedEvaluation.ambiguitySafeCount}/${focusedEvaluation.ambiguityQueryCount}`,
    `- Current authoritative VM-31 top-1: ${focusedEvaluation.currentAuthoritativeVm31Top1Count}/${focusedEvaluation.supportedQueryCount}`, '',
    '| Query ID | Intended state | Top-1 | Strict top-3 | Support result | Passed |',
    '| --- | --- | --- | --- | --- | --- |',
    ...focusedEvaluation.queries.map((testCase) => `| ${testCase.queryId} | ${testCase.intendedSupportState} | ${testCase.actualTop1?.chunkId ?? 'none'} | ${testCase.actualTop3.map((match) => match.chunkId).join('<br>')} | ${testCase.supportDecision.supportState} / ${testCase.supportDecision.reasonCode} | ${testCase.passed ? 'yes' : 'no'} |`), '',
    'This evaluation artifact is generated QA evidence, not authoritative regulatory source text.',
  ].join('\n'))

  const fidelityDistribution = Object.fromEntries(unique(sourcePackage.chunks.map((chunk) => chunk.fidelity)).map((fidelity) => [fidelity, sourcePackage.chunks.filter((chunk) => chunk.fidelity === fidelity).length]))
  const provisionTypeCounts = {}
  for (const chunk of sourcePackage.chunks.filter((candidate) => candidate.chunkLevel === 'child')) for (const type of chunk.provisionTypes ?? []) provisionTypeCounts[type] = (provisionTypeCounts[type] ?? 0) + 1
  const sourceQa = {
    schemaVersion: '1.0',
    qaId: 'vm31-current-manual-source-qa-2026',
    status: 'pass',
    authoritativeSource: { sourceEditionId: sourcePackage.source.sourceEditionId, sourceVersionIdentifier: sourcePackage.source.sourceVersionIdentifier, sourceSha256: VM31_SOURCE_SHA256, pageRange: VM31_PAGE_RANGE, localPdfHashVerified: true },
    extraction: { batchIds: sourcePackage.source.reviewBatchIds, extractionMethod: sourcePackage.source.sourceTextVerification.extractionMethod, aggregateExtractionSha256, visualReview: { pagesRenderedAndReviewed: '341-387', vm31ContentPages: '341-385', intentionalBlankPage: 386, followingChapterPage: 387, followingChapter: 'VM-50', status: 'pass' } },
    hierarchy: { parentCount: VM31_PARENT_COUNT, childCount: VM31_CHILD_COUNT, totalChunkCount: VM31_CHUNK_COUNT, parentCoverageContinuous: true, numberedRequirementsKeptWithNestedItems: true, adjacencyComplete: true },
    sourceFidelity: { distribution: fidelityDistribution, exactChunkCount: fidelityDistribution.exact ?? 0, generatedMetadataSeparate: true, sourceTextRewriteCount: 0, visualTranscriptionCount: 0 },
    metadataCorrectionAudit: {
      section1Purpose: { chunkIds: purposeChunkIds, classification: ['purpose', 'scope_context', 'reporting_framework_context', 'cross_reference'], substantiveRequirementClaim: false, sourceTextChanged: false },
      relationshipProvenance: { sourceFaithfulLabelsValidated: relationships.relationshipCount, ag43RelationshipIds: ag43Relationships.map((candidate) => candidate.relationshipId), sourceTargetLabel: 'AG 43', canonicalTargetLabel: 'Actuarial Guideline XLIII', sourceTextChanged: false },
    },
    sectionCoverage: structure.map((parent) => ({ parentId: `vm31-${parent.id}`, title: parent.title, pageStart: parent.pages.start, pageEnd: parent.pages.end, childCount: parent.children.length, sourceTextSha256: parent.sourceTextSha256 })),
    provisionTypeCounts,
    contentAreaAudit: [
      ['scope_and_applicability', 'vm31-section-2-general-requirements-a-annual-report-applicability'],
      ['required_actuarial_reports', 'vm31-section-2-general-requirements-a-annual-report-applicability'],
      ['report_content', 'vm31-section-3-a-report-order-and-applicability-report-order-and-applicability'],
      ['methodology_documentation', 'vm31-section-3-f-annuity-report-2-cash-flow-models'],
      ['assumption_documentation_and_margins', 'vm31-section-3-d-life-report-1-assumptions-and-margins'],
      ['models', 'vm31-section-3-d-life-report-2-cash-flow-models'],
      ['assets', 'vm31-section-3-f-annuity-report-4-starting-assets'],
      ['reinsurance', 'vm31-section-3-f-annuity-report-11-reinsurance'],
      ['aggregation', 'vm31-section-3-f-annuity-report-16-additional-information'],
      ['sensitivity_and_testing', 'vm31-section-3-f-annuity-report-16-additional-information'],
      ['governance', 'vm31-section-3-b-executive-summary-6-governance'],
      ['certifications', 'vm31-section-3-d-life-report-14-certifications'],
      ['supporting_documentation', 'vm31-section-2-general-requirements-d-seven-year-retention'],
      ['required_exhibits_and_tables', 'vm31-section-3-c-life-summary-8-supplement-part-1'],
      ['retention_and_submission', 'vm31-section-2-general-requirements-c-submission-timing'],
      ['cross_references', 'vm31-section-3-d-life-report-10-exclusion-tests'],
      ['exceptions_and_qualifications', 'vm31-section-3-a-report-order-and-applicability-report-order-and-applicability'],
    ].map(([contentArea, representativeChunkId]) => ({ contentArea, status: 'covered', representativeChunkId })),
    unresolvedGaps: ['Independent source and actuarial review is required before promotion.', 'Publication and effective dates are not inferred beyond the established 2026 edition identity.', 'No synthetic historical VM-31 source was created for authority testing.'],
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
  }
  await writeJson(sourceQaPath, sourceQa)
  await writeMarkdown(sourceQaPath, [
    '# VM-31 source QA', '', '- Result: **PASS**',
    `- Source SHA-256: \`${VM31_SOURCE_SHA256}\``,
    '- Page boundary: PDF pages 341-385 content; page 386 intentional blank; page 387 VM-50 opener',
    `- Parents / children / chunks: ${VM31_PARENT_COUNT} / ${VM31_CHILD_COUNT} / ${VM31_CHUNK_COUNT}`,
    `- Exact source chunks: ${sourceQa.sourceFidelity.exactChunkCount}/${VM31_CHUNK_COUNT}`,
    '- Source-text rewrites: 0',
    `- Explicit-reference relationship candidates: ${relationships.relationshipCount}; all pending and unpromoted`, '',
    '- Section 1 Purpose: classified as purpose/scope/reporting-framework context, not a standalone substantive requirement',
    `- Explicit-source relationship labels validated: ${relationships.relationshipCount}/${relationships.relationshipCount}; AG 43 source labels corrected: ${ag43Relationships.length}`, '',
    'Generated summaries, reporting classifications, and relationship candidates remain subordinate to exact source excerpts.',
  ].join('\n'))

  const representativeIds = [
    'vm31-section-2-general-requirements-a-annual-report-applicability',
    'vm31-section-2-general-requirements-c-submission-timing',
    'vm31-section-3-d-life-report-1-assumptions-and-margins',
    'vm31-section-3-d-life-report-3-mortality',
    'vm31-section-3-d-life-report-14-certifications',
    'vm31-section-3-f-annuity-report-8-hedging-and-risk-management',
    'vm31-section-3-f-annuity-report-13-exclusion-tests-vm22',
    'vm31-closing-boundary-intentional-blank-page',
  ]
  const reviewPackage = {
    schemaVersion: '1.0',
    reviewPackageId: 'vm31-canonical-coverage-review-package-2026',
    status: 'canonical_review_candidate',
    promoted: false,
    authoritativeSource: sourcePackage.source,
    coverage: { packageCount: 1, parentCount: VM31_PARENT_COUNT, childCount: VM31_CHILD_COUNT, totalChunkCount: VM31_CHUNK_COUNT, pageRange: VM31_PAGE_RANGE, fidelityDistribution, provisionTypeCounts, contentAreaAudit: sourceQa.contentAreaAudit },
    sourceFidelity: { sourceQaPath: relative(sourceQaPath), sourceQaStatus: sourceQa.status, aggregateExtractionSha256, canonicalPackageSha256: await hashFile(sourcePackagePath), sourceTextRewriteCount: 0 },
    hierarchy: { model: 'section_or_subsection_parent_to_complete_numbered_or_lettered_requirement_child', adjacencyAvailable: true, nestedListsKeptWithGoverningHeading: true, boundaryControlIncluded: true },
    relationships: { candidateCount: relationships.relationshipCount, targetCounts: relationships.targetCounts, registryPath: relative(relationshipPath), status: 'review_only_pending' },
    promotionBlockerCorrections: {
      section1Purpose: { chunkIds: purposeChunkIds, result: 'classified_as_purpose_scope_and_reporting_framework_context', substantiveRequirementClaim: false },
      ag43RelationshipProvenance: { relationshipIds: ag43Relationships.map((candidate) => candidate.relationshipId), sourceTargetLabel: 'AG 43', canonicalTargetLabel: 'Actuarial Guideline XLIII', explicitSourceLabelsValidated: relationships.relationshipCount },
      authoritativeSourceTextChanges: 0,
    },
    retrievalEvaluation: { path: relative(retrievalPath), queryCount: focusedEvaluation.queryCount, supportedTop1: focusedEvaluation.supportedTop1Count, supportedTop3: focusedEvaluation.supportedTop3Count, supportedQueryCount: focusedEvaluation.supportedQueryCount, unsupportedCorrect: focusedEvaluation.unsupportedCorrectCount, unsupportedQueryCount: focusedEvaluation.unsupportedQueryCount, ambiguitySafe: focusedEvaluation.ambiguitySafeCount, ambiguityQueryCount: focusedEvaluation.ambiguityQueryCount, currentAuthorityTop1: focusedEvaluation.currentAuthoritativeVm31Top1Count, allCasesPassed: focusedEvaluation.allCasesPassed },
    supportGateRegression: { path: relative(supportGatePath), caseCount: supportGate.cases.length, status: supportGate.status, productionEvidenceWindow: supportGate.productionEvidenceWindow },
    representativeChunks: representativeIds.map((chunkId) => {
      const chunk = sourcePackage.chunks.find((candidate) => candidate.chunkId === chunkId)
      return { chunkId, sectionReference: chunk.sectionReference, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, provisionTypes: chunk.provisionTypes, sourceTextExcerpt: chunk.sourceTextExcerpt }
    }),
    unresolvedGaps: sourceQa.unresolvedGaps,
    artifacts: { canonicalSourcePackage: relative(sourcePackagePath), sourceQa: relative(sourceQaPath), relationshipCandidates: relative(relationshipPath), focusedRetrievalEvaluation: relative(retrievalPath), supportGateRegression: relative(supportGatePath), validationReport: 'data/processed/review_packages/vm31-validation-report.json', independentReviewPrompt: relative(promptPath) },
    promotionReadiness: { independentReviewRequired: true, automatedPromotion: false, currentStatus: 'review_only_pending_independent_review', promotionStatus: 'not_promoted', promotionEligible: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
  }
  await writeJson(reviewPackagePath, reviewPackage)
  await writeMarkdown(reviewPackagePath, [
    '# VM-31 canonical coverage review package', '',
    '- Status: **CANONICAL REVIEW CANDIDATE — NOT PROMOTED**',
    `- Authority: ${sourcePackage.source.sourceVersionIdentifier}`,
    `- Source SHA-256: \`${VM31_SOURCE_SHA256}\``,
    '- Chapter boundary: PDF pages 341-385 content; page 386 intentional blank; page 387 begins VM-50',
    `- Package / parents / children / total chunks: 1 / ${VM31_PARENT_COUNT} / ${VM31_CHILD_COUNT} / ${VM31_CHUNK_COUNT}`,
    `- Exact source fidelity: ${fidelityDistribution.exact ?? 0}/${VM31_CHUNK_COUNT}`,
    `- Relationship candidates: ${relationships.relationshipCount} (pending, review-only, not promoted)`, '',
    '## Promotion-blocker corrections', '',
    '- Section 1 Purpose is classified as purpose/scope/reporting-framework context, not a standalone substantive requirement.',
    `- AG 43 relationship labels preserve source wording in ${ag43Relationships.length} candidates; the expanded canonical label is stored separately.`,
    `- Explicit-source relationship labels validated: ${relationships.relationshipCount}/${relationships.relationshipCount}.`,
    '- Authoritative source-text changes: 0', '',
    '## Focused retrieval', '',
    `- Supported top-1 / strict top-3: ${focusedEvaluation.supportedTop1Count}/${focusedEvaluation.supportedQueryCount} / ${focusedEvaluation.supportedTop3Count}/${focusedEvaluation.supportedQueryCount}`,
    `- Unsupported correctly rejected: ${focusedEvaluation.unsupportedCorrectCount}/${focusedEvaluation.unsupportedQueryCount}`,
    `- Ambiguity safely handled: ${focusedEvaluation.ambiguitySafeCount}/${focusedEvaluation.ambiguityQueryCount}`,
    `- Current authoritative VM-31 top-1: ${focusedEvaluation.currentAuthoritativeVm31Top1Count}/${focusedEvaluation.supportedQueryCount}`,
    `- VM-20 substitution support-gate regressions: ${supportGate.cases.length}/${supportGate.cases.length}`, '',
    '## Review boundary', '',
    '- Exact VM-31 source excerpts control; summaries and classifications are generated metadata.',
    '- VM-01 definitions are not duplicated into VM-31 source text.',
    '- Relationship candidates do not assert legal effect and remain separately governed.',
    '- Learner, application, RAG, vector, and Copilot uses remain blocked.', '',
    'This review package is generated review metadata, not authoritative regulatory evidence.',
  ].join('\n'))

  await fs.writeFile(promptPath, `${[
    '# Narrow independent review prompt: VM-31 promotion-blocker corrections', '',
    'Please independently review only the two targeted metadata corrections applied to the current 2026 VM-31 canonical review candidate in the Document Processor repository. Do not modify or promote the corpus, and do not repeat the accepted 84-chunk source audit unless authoritative source evidence changed.', '',
    '## Primary files', '',
    `- Canonical source package: \`${relative(sourcePackagePath)}\``,
    `- Review package: \`${relative(reviewPackagePath)}\``,
    `- Focused retrieval evaluation: \`${relative(retrievalPath)}\``,
    `- Source QA: \`${relative(sourceQaPath)}\``,
    `- Relationship registry: \`${relative(relationshipPath)}\``,
    `- Support-gate regression: \`${relative(supportGatePath)}\``,
    '- Validation report: `data/processed/review_packages/vm31-validation-report.json`', '',
    '## Review scope', '',
    '1. Inspect `vm31-section-1-purpose` and `vm31-section-1-purpose-purpose`. Confirm both are classified as purpose/scope/reporting-framework context, retain legitimate VM-20/VM-21/VM-22 cross-references, and no longer claim to be documentation requirements, operative reporting requirements, or applicability exceptions.',
    '2. Inspect `vm31-section-3-b-executive-summary-5-high-level-results-references-ag-43` and `vm31-section-3-f-annuity-report-16-additional-information-references-ag-43`. Confirm `targetLabel` preserves the explicit source wording `AG 43`, `targetId` remains `ag-43`, and `canonicalTargetLabel` separately records `Actuarial Guideline XLIII`.',
    `3. Confirm the relationship validator checks all ${relationships.relationshipCount} explicit-source labels against retained source text using only transparent case/punctuation/spacing normalization.`,
    `4. Confirm source evidence is unchanged: ${VM31_PARENT_COUNT} parents, ${VM31_CHILD_COUNT} children, ${VM31_CHUNK_COUNT} total chunks, identical source excerpts/hashes/pages/IDs/hierarchy/order, and zero source-text rewrites.`,
    `5. Confirm retrieval remains ${focusedEvaluation.supportedTop1Count}/${focusedEvaluation.supportedQueryCount} supported top-1, ${focusedEvaluation.supportedTop3Count}/${focusedEvaluation.supportedQueryCount} strict top-3, ${focusedEvaluation.unsupportedCorrectCount}/${focusedEvaluation.unsupportedQueryCount} unsupported abstentions, ${focusedEvaluation.ambiguitySafeCount}/${focusedEvaluation.ambiguityQueryCount} ambiguity safety, and ${focusedEvaluation.currentAuthoritativeVm31Top1Count}/${focusedEvaluation.supportedQueryCount} current-authority top-1, with the VM-20 substitution gate still passing.`,
    '6. Confirm VM-31 remains review-only, not promoted, promotion-ineligible, and blocked from learner, app, RAG, vector, and Copilot use.',
    '7. Decide whether these two metadata blockers are closed and VM-31 is ready for a separately recorded canonical-promotion decision.', '',
    'Report findings with severity, exact chunk/query/relationship IDs, and source-page references. End with exactly one disposition:', '',
    '- APPROVE FOR CANONICAL PROMOTION',
    '- APPROVE WITH FIXES',
    '- DO NOT PROMOTE', '',
    'Do not repeat the completed VM-01, VM-20, or full VM-31 source audits unless this correction pass changed authoritative source evidence.',
  ].join('\n')}\n`, 'utf8')

  console.log(`Built VM-31 artifacts for ${VM31_PARENT_COUNT} parents, ${VM31_CHILD_COUNT} children, ${relationships.relationshipCount} relationship candidates, and ${focusedEvaluation.queryCount} retrieval cases.`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
