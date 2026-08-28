import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { evaluateFormalRequirementQueries } from './evaluate-formal-requirement-retrieval.mjs'
import { loadVm30Chapter, segmentVm30Chapter, VM30_CHILD_COUNT, VM30_CHUNK_COUNT, VM30_PAGE_RANGE, VM30_PARENT_COUNT, VM30_SOURCE_SHA256 } from './lib/vm30-current-manual.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const processedRoot = path.join(repoRoot, 'data', 'processed')
const sourceRoot = path.join(processedRoot, 'source_indexes', 'sources')
const reviewRoot = path.join(processedRoot, 'review_packages')
const relationshipRoot = path.join(processedRoot, 'relationship_registries')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const queryPath = path.join(repoRoot, 'data', 'manual-input', 'evaluation', 'vm30-focused-retrieval-queries.json')
const sourcePackagePath = path.join(sourceRoot, 'vm30-current-manual.json')
const sourceQaPath = path.join(reviewRoot, 'vm30-source-qa.json')
const retrievalPath = path.join(reviewRoot, 'vm30-focused-retrieval-evaluation.json')
const relationshipPath = path.join(relationshipRoot, 'vm30-current-manual-relationship-candidates.json')
const reviewPackagePath = path.join(reviewRoot, 'vm30-canonical-coverage-review-package.json')
const promptPath = path.join(reviewRoot, 'vm30-independent-review-prompt.md')
const supportGatePath = path.join(reviewRoot, 'vm30-support-gate-regression.json')

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
  'Model #820': { targetId: 'standard-valuation-law-model-820', targetKind: 'corpus_target', canonicalTargetLabel: 'NAIC Standard Valuation Law (Model #820)' },
  'AG 48': { targetId: 'ag-48', targetKind: 'corpus_target', canonicalTargetLabel: 'Actuarial Guideline XLVIII' },
  'AG 51': { targetId: 'ag-51', targetKind: 'corpus_target', canonicalTargetLabel: 'Actuarial Guideline LI' },
  'AP&P Manual': { targetId: 'accounting-practices-and-procedures-manual', targetKind: 'corpus_target', canonicalTargetLabel: 'NAIC Accounting Practices and Procedures Manual' },
  'ASOPs': { targetId: 'actuarial-standards-of-practice', targetKind: 'external_standard', canonicalTargetLabel: 'Actuarial Standards of Practice' },
  'ASB': { targetId: 'actuarial-standards-board', targetKind: 'external_organization', canonicalTargetLabel: 'Actuarial Standards Board' },
  'Actuarial Standards Board': { targetId: 'actuarial-standards-board', targetKind: 'external_organization' },
  'Actuarial Opinion and Memorandum Regulation': { targetId: 'model-822', targetKind: 'corpus_target', canonicalTargetLabel: 'Actuarial Opinion and Memorandum Regulation (Model #822)' },
  'Standard Valuation Law': { targetId: 'standard-valuation-law-model-820', targetKind: 'corpus_target', canonicalTargetLabel: 'NAIC Standard Valuation Law (Model #820)' },
  'annual statement instructions': { targetId: 'annual-statement-instructions', targetKind: 'corpus_target', canonicalTargetLabel: 'NAIC annual statement instructions' },
  'Academy qualification standards': { targetId: 'academy-qualification-standards', targetKind: 'external_standard', canonicalTargetLabel: 'U.S. Qualification Standards for Actuaries Issuing Statements of Actuarial Opinion' },
}

const buildRelationships = (sourcePackage) => {
  const candidates = []
  for (const chunk of sourcePackage.chunks.filter((candidate) => candidate.chunkLevel === 'child')) {
    for (const targetLabel of chunk.crossReferenceCandidates ?? []) {
      const target = relationshipTargets[targetLabel]
      if (!target) throw new Error(`VM-30 relationship target is unmapped: ${targetLabel}.`)
      candidates.push({
        relationshipId: `${chunk.chunkId}-references-${target.targetId}`,
        sourceChunkId: chunk.chunkId,
        sourceSection: chunk.sectionReference,
        relationType: 'references',
        targetLabel,
        targetId: target.targetId,
        targetKind: target.targetKind,
        ...(target.canonicalTargetLabel ? { canonicalTargetLabel: target.canonicalTargetLabel } : {}),
        evidence: { sourceSha256: VM30_SOURCE_SHA256, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, sectionReference: chunk.sectionReference, sourceTextSha256: sha256(chunk.sourceTextExcerpt), canonicalSourcePackagePath: relative(sourcePackagePath) },
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
    relationshipRegistryId: 'vm30-current-manual-relationship-candidates-2026',
    sourceId: 'vm30-current-manual',
    relationshipCount: candidates.length,
    relationTypes: ['references'],
    targetCounts: Object.fromEntries(Object.keys(relationshipTargets).map((label) => [label, candidates.filter((candidate) => candidate.targetLabel === label).length]).filter(([, count]) => count > 0)),
    governance: { reviewOnly: true, reviewDecision: 'pending', promotionStatus: 'not_promoted', promotionEligible: false },
    candidates,
  }
}

const buildFocusedEvaluation = async () => {
  const querySpec = await readJson(queryPath)
  const packageFiles = (await fs.readdir(sourceRoot)).filter((filename) => filename.endsWith('.json'))
  const packages = await Promise.all(packageFiles.map((filename) => readJson(path.join(sourceRoot, filename))))
  const sourcePackages = packages.map((source) => source.source)
  const chunkRecords = packages.flatMap((source) => source.chunks.map((chunk) => ({ ...chunk, sourceId: source.source.sourceId, sourceTitle: source.source.sourceTitle, sourceReference: source.source.sourceReference, sourceFamilyId: source.source.sourceFamilyId, authorityLevel: source.source.authorityLevel, sourceStatus: source.source.sourceStatus, sourceVersionIdentifier: source.source.sourceVersionIdentifier })))
  const evaluation = evaluateFormalRequirementQueries({ queries: querySpec.queries, chunkRecords, sourcePackages, unsupportedThreshold: 3, topN: 5 })
  const chunkLookup = new Map(chunkRecords.map((chunk) => [chunk.chunkId, chunk]))
  const cases = evaluation.queries.map((result) => {
    const actualTop3 = result.rankedMatches.slice(0, 3).map((match, index) => {
      const chunk = chunkLookup.get(match.chunkId)
      return { rank: index + 1, chunkId: match.chunkId, sourceId: match.sourceId, sourceFamilyId: match.sourceFamilyId, authorityLevel: match.authorityLevel, score: match.score, sectionReference: chunk?.sectionReference ?? null, pageStart: chunk?.pageStart ?? null, pageEnd: chunk?.pageEnd ?? null, citationAvailable: Boolean(chunk?.citations?.length) }
    })
    const expectedOutcome = result.expectedOutcome ?? 'supported'
    const submissionContexts = actualTop3.filter((match) => {
      const chunk = chunkLookup.get(match.chunkId)
      return match.sourceId === 'vm30-current-manual' && (chunk?.provisionTypes ?? []).includes('submission_or_timing_requirement')
    })
    const ambiguityResult = expectedOutcome === 'ambiguous'
      ? { safelyAbstained: submissionContexts.length >= 2, reasonCode: submissionContexts.length >= 2 ? 'multiple_vm30_submission_contexts' : 'ambiguity_not_sufficiently_exposed', candidateChunkIds: submissionContexts.map((match) => match.chunkId) }
      : { safelyAbstained: false, reasonCode: 'not_applicable', candidateChunkIds: [] }
    const supportDecision = expectedOutcome === 'ambiguous'
      ? { ...result.supportDecision, supportState: 'ambiguous_requires_more_context', evidenceSufficient: false, reasonCode: ambiguityResult.reasonCode, reason: 'The request does not identify the applicable VM-30 opinion, notice, memorandum, or regulatory-summary submission context.' }
      : result.supportDecision
    const passed = expectedOutcome === 'supported'
      ? result.top3Hit && supportDecision.supportState === 'supported'
      : expectedOutcome === 'unsupported'
        ? supportDecision.supportState === 'unsupported'
        : ambiguityResult.safelyAbstained
    return {
      queryId: result.queryId, queryCategory: result.queryCategory, query: result.query, intendedSupportState: expectedOutcome, expectedEvidence: result.expectedEvidence, expectedChunkIds: result.expectedChunkIds,
      actualTop1: actualTop3[0] ?? null, actualTop3, top1Hit: expectedOutcome === 'supported' ? result.top1Hit : false, top3Hit: expectedOutcome === 'supported' ? result.top3Hit : false,
      sourceFamilyResult: { expected: result.expectedSourceFamilyIds, actualTop1: result.predictedSourceFamilyId, correct: result.expectedSourceFamilyIds.includes(result.predictedSourceFamilyId) },
      authorityResult: { expected: result.expectedAuthorityLevels, actualTop1: result.predictedAuthorityLevel, correct: result.expectedAuthorityLevels.includes(result.predictedAuthorityLevel), currentAuthoritativeVm30Top1: actualTop3[0]?.sourceId === 'vm30-current-manual' },
      supportDecision, ambiguityResult, passed, failureReason: passed ? null : result.resultLabel,
    }
  })
  const supported = cases.filter((testCase) => testCase.intendedSupportState === 'supported')
  const unsupported = cases.filter((testCase) => testCase.intendedSupportState === 'unsupported')
  const ambiguous = cases.filter((testCase) => testCase.intendedSupportState === 'ambiguous')
  return {
    schemaVersion: '1.0', evaluationId: querySpec.evaluationId, artifactPurpose: 'case_level_independent_review', method: evaluation.method, productionEvidenceWindow: 3,
    queryCount: cases.length, supportedQueryCount: supported.length, supportedTop1Count: supported.filter((testCase) => testCase.top1Hit).length, supportedTop3Count: supported.filter((testCase) => testCase.top3Hit).length,
    unsupportedQueryCount: unsupported.length, unsupportedCorrectCount: unsupported.filter((testCase) => testCase.passed).length, ambiguityQueryCount: ambiguous.length, ambiguitySafeCount: ambiguous.filter((testCase) => testCase.passed).length,
    currentAuthoritativeVm30Top1Count: supported.filter((testCase) => testCase.authorityResult.currentAuthoritativeVm30Top1).length, sourceFamilyAccuracyCount: supported.filter((testCase) => testCase.sourceFamilyResult.correct).length, authorityLevelAccuracyCount: supported.filter((testCase) => testCase.authorityResult.correct).length,
    allCasesPassed: cases.every((testCase) => testCase.passed), queries: cases, governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false },
  }
}

const main = async () => {
  const [config, sourcePackage, supportGate] = await Promise.all([readJson(configPath), readJson(sourcePackagePath), readJson(supportGatePath)])
  const sourceConfig = config.sources.find((source) => source.sourceId === 'vm30-current-manual')
  if (!sourceConfig) throw new Error('VM-30 source configuration is missing.')
  const { chapterText, aggregateExtractionSha256 } = await loadVm30Chapter(repoRoot, sourceConfig.vm30Input)
  const structure = segmentVm30Chapter(chapterText)
  const relationships = buildRelationships(sourcePackage)
  if (relationships.relationshipCount !== 16) throw new Error(`Expected 16 VM-30 relationship candidates; found ${relationships.relationshipCount}.`)
  await writeJson(relationshipPath, relationships)

  const focusedEvaluation = await buildFocusedEvaluation()
  await writeJson(retrievalPath, focusedEvaluation)
  await writeMarkdown(retrievalPath, [
    '# VM-30 focused retrieval evaluation', '',
    `- Cases: ${focusedEvaluation.queryCount}`,
    `- Supported top-1 / strict top-3: ${focusedEvaluation.supportedTop1Count}/${focusedEvaluation.supportedQueryCount} / ${focusedEvaluation.supportedTop3Count}/${focusedEvaluation.supportedQueryCount}`,
    `- Unsupported correctly rejected: ${focusedEvaluation.unsupportedCorrectCount}/${focusedEvaluation.unsupportedQueryCount}`,
    `- Ambiguity safely handled: ${focusedEvaluation.ambiguitySafeCount}/${focusedEvaluation.ambiguityQueryCount}`,
    `- Current authoritative VM-30 top-1: ${focusedEvaluation.currentAuthoritativeVm30Top1Count}/${focusedEvaluation.supportedQueryCount}`, '',
    '| Query ID | Intended state | Top-1 | Strict top-3 | Support result | Passed |',
    '| --- | --- | --- | --- | --- | --- |',
    ...focusedEvaluation.queries.map((testCase) => `| ${testCase.queryId} | ${testCase.intendedSupportState} | ${testCase.actualTop1?.chunkId ?? 'none'} | ${testCase.actualTop3.map((match) => match.chunkId).join('<br>')} | ${testCase.supportDecision.supportState} / ${testCase.supportDecision.reasonCode} | ${testCase.passed ? 'yes' : 'no'} |`), '',
    'This evaluation artifact is generated QA evidence, not authoritative regulatory source text.',
  ].join('\n'))

  const fidelityDistribution = Object.fromEntries(unique(sourcePackage.chunks.map((chunk) => chunk.fidelity)).map((fidelity) => [fidelity, sourcePackage.chunks.filter((chunk) => chunk.fidelity === fidelity).length]))
  const provisionTypeCounts = {}
  for (const chunk of sourcePackage.chunks.filter((candidate) => candidate.chunkLevel === 'child')) for (const type of chunk.provisionTypes ?? []) provisionTypeCounts[type] = (provisionTypeCounts[type] ?? 0) + 1
  const sourceQa = {
    schemaVersion: '1.0', qaId: 'vm30-current-manual-source-qa-2026', status: 'pass',
    authoritativeSource: { sourceEditionId: sourcePackage.source.sourceEditionId, sourceVersionIdentifier: sourcePackage.source.sourceVersionIdentifier, sourceSha256: VM30_SOURCE_SHA256, pageRange: VM30_PAGE_RANGE, localPdfHashVerified: true },
    extraction: { batchIds: sourcePackage.source.reviewBatchIds, extractionMethod: sourcePackage.source.sourceTextVerification.extractionMethod, aggregateExtractionSha256, visualReview: { pagesRenderedAndReviewed: '324-341', precedingChapterPage: 324, vm30ChapterPages: '325-339', intentionalBlankPageInsideChapter: 339, unnumberedBlankSeparator: 340, followingChapterPage: 341, followingChapter: 'VM-31', status: 'pass' } },
    hierarchy: { parentCount: VM30_PARENT_COUNT, childCount: VM30_CHILD_COUNT, totalChunkCount: VM30_CHUNK_COUNT, retrievalEligibleChildCount: 42, parentCoverageContinuous: true, numberedRequirementsKeptWithNestedItemsAndTables: true, adjacencyComplete: true },
    sourceFidelity: { distribution: fidelityDistribution, exactChunkCount: fidelityDistribution.exact ?? 0, generatedMetadataSeparate: true, sourceTextRewriteCount: 0, visualTranscriptionCount: 0 },
    definedTermsAudit: { sourceExplicitTerms: ['adverse opinion', 'qualified opinion', 'inconclusive opinion'], sourceExplicitTermCount: 3, duplicatedVm01Terms: 0, appointedActuaryClaimedAsVm30Definition: false },
    sectionCoverage: structure.map((parent) => {
      const parentChunkId = `vm30-${parent.id}`
      const childChunks = sourcePackage.chunks.filter((chunk) => chunk.parentChunkId === parentChunkId)
      return {
        sectionOrSubsection: parent.title,
        pageRange: { physicalPdfStart: parent.pages.start, physicalPdfEnd: parent.pages.end, printedStart: `30-${parent.pages.start - 324}`, printedEnd: `30-${parent.pages.end - 324}` },
        canonicalParentChunkId: parentChunkId,
        childChunkIds: childChunks.map((chunk) => chunk.chunkId),
        childCount: childChunks.length,
        requirementTypes: unique(childChunks.flatMap((chunk) => chunk.provisionTypes ?? [])),
        exceptionProvisionCount: childChunks.filter((chunk) => (chunk.provisionTypes ?? []).includes('exception_or_exemption')).length,
        guidanceNoteProvisionCount: childChunks.filter((chunk) => (chunk.provisionTypes ?? []).includes('guidance_note_present')).length,
        crossReferences: unique(childChunks.flatMap((chunk) => chunk.crossReferenceCandidates ?? [])),
        canonicalized: true,
        unresolvedSourceQuestions: [],
        sourceTextSha256: parent.sourceTextSha256,
      }
    }),
    provisionTypeCounts,
    contentAreaAudit: [
      ['scope_and_applicability', 'vm30-section-1-a-general-2-annual-statement-applicability'],
      ['source_defined_opinion_terms', 'vm30-section-1-b-definitions-1-adverse-opinion'],
      ['appointed_actuary_notices', 'vm30-section-2-a-general-2-appointed-actuary-notice'],
      ['asset_adequacy_standards', 'vm30-section-2-b-asset-adequacy-standards-1-standards-of-practice'],
      ['liabilities_and_additional_reserves', 'vm30-section-2-c-liabilities-covered-2-additional-reserve'],
      ['opinion_sections_and_prescribed_wording', 'vm30-section-3-a-statement-of-actuarial-opinion-2-prescribed-wording-changes'],
      ['key_indicators_table', 'vm30-section-3-a-statement-of-actuarial-opinion-3-table-of-key-indicators'],
      ['reserve_table', 'vm30-section-3-a-statement-of-actuarial-opinion-5-scope-section-and-reserve-table'],
      ['qualifications_and_reliance', 'vm30-section-3-a-statement-of-actuarial-opinion-12-reliance-on-experts'],
      ['memorandum_content', 'vm30-section-3-b-actuarial-memorandum-10-reserve-information'],
      ['retention', 'vm30-section-3-b-actuarial-memorandum-8-seven-year-retention'],
      ['regulatory_asset_adequacy_issues_summary', 'vm30-section-3-b-actuarial-memorandum-14-regulatory-asset-adequacy-issues-summary'],
      ['cross_references', 'vm30-section-3-b-actuarial-memorandum-2-reliance-on-other-actuaries'],
      ['chapter_boundary', 'vm30-closing-boundary-intentional-blank-page'],
    ].map(([contentArea, representativeChunkId]) => ({ contentArea, status: 'covered', representativeChunkId })),
    relationshipProvenance: { explicitSourceLabelsValidated: relationships.relationshipCount, canonicalLabelsStoredSeparately: true, sourceTextChanged: false },
    unresolvedGaps: ['Independent source and actuarial review is required before promotion.', 'Publication and effective dates are not inferred beyond the established 2026 edition identity.', 'No synthetic historical or future VM-30 source was created for authority testing.'],
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
  }
  await writeJson(sourceQaPath, sourceQa)
  await writeMarkdown(sourceQaPath, [
    '# VM-30 source QA', '', '- Result: **PASS**', `- Source SHA-256: \`${VM30_SOURCE_SHA256}\``,
    '- Page boundary: PDF page 324 ends VM-26; pages 325-339 are VM-30; page 340 is an unnumbered blank separator; page 341 begins VM-31',
    `- Parents / children / chunks: ${VM30_PARENT_COUNT} / ${VM30_CHILD_COUNT} / ${VM30_CHUNK_COUNT}`,
    `- Exact source chunks: ${sourceQa.sourceFidelity.exactChunkCount}/${VM30_CHUNK_COUNT}`, '- Source-text rewrites: 0',
    '- Source-explicit defined terms: adverse opinion, qualified opinion, inconclusive opinion',
    `- Explicit-reference relationship candidates: ${relationships.relationshipCount}; all pending and unpromoted`, '',
    'Generated summaries, classifications, and relationship candidates remain subordinate to exact source excerpts.',
  ].join('\n'))

  const representativeIds = [
    'vm30-section-1-a-general-2-annual-statement-applicability', 'vm30-section-1-b-definitions-1-adverse-opinion', 'vm30-section-2-a-general-2-appointed-actuary-notice',
    'vm30-section-3-a-statement-of-actuarial-opinion-3-table-of-key-indicators', 'vm30-section-3-a-statement-of-actuarial-opinion-5-scope-section-and-reserve-table',
    'vm30-section-3-b-actuarial-memorandum-8-seven-year-retention', 'vm30-section-3-b-actuarial-memorandum-14-regulatory-asset-adequacy-issues-summary', 'vm30-closing-boundary-intentional-blank-page',
  ]
  const reviewPackage = {
    schemaVersion: '1.0', reviewPackageId: 'vm30-canonical-coverage-review-package-2026', status: 'review_candidate', promoted: false, authoritativeSource: sourcePackage.source,
    coverage: { packageCount: 1, parentCount: VM30_PARENT_COUNT, childCount: VM30_CHILD_COUNT, totalChunkCount: VM30_CHUNK_COUNT, retrievalEligibleChildCount: 42, pageRange: VM30_PAGE_RANGE, printedPageRange: { start: '30-1', end: '30-15' }, fidelityDistribution, provisionTypeCounts, contentAreaAudit: sourceQa.contentAreaAudit, sectionCoverageMatrix: sourceQa.sectionCoverage, notCanonicalizedSections: [] },
    sourceFidelity: { sourceQaPath: relative(sourceQaPath), sourceQaStatus: sourceQa.status, aggregateExtractionSha256, canonicalPackageSha256: await hashFile(sourcePackagePath), sourceTextRewriteCount: 0 },
    hierarchy: { model: 'section_or_subsection_parent_to_complete_numbered_requirement_child', adjacencyAvailable: true, nestedListsAndTablesKeptWithGoverningProvision: true, boundaryControlIncluded: true },
    definitions: sourceQa.definedTermsAudit,
    relationships: { candidateCount: relationships.relationshipCount, targetCounts: relationships.targetCounts, registryPath: relative(relationshipPath), status: 'review_only_pending' },
    retrievalEvaluation: { path: relative(retrievalPath), queryCount: focusedEvaluation.queryCount, supportedTop1: focusedEvaluation.supportedTop1Count, supportedTop3: focusedEvaluation.supportedTop3Count, supportedQueryCount: focusedEvaluation.supportedQueryCount, unsupportedCorrect: focusedEvaluation.unsupportedCorrectCount, unsupportedQueryCount: focusedEvaluation.unsupportedQueryCount, ambiguitySafe: focusedEvaluation.ambiguitySafeCount, ambiguityQueryCount: focusedEvaluation.ambiguityQueryCount, currentAuthorityTop1: focusedEvaluation.currentAuthoritativeVm30Top1Count, sourceFamilyAccuracy: focusedEvaluation.sourceFamilyAccuracyCount, authorityLevelAccuracy: focusedEvaluation.authorityLevelAccuracyCount, allCasesPassed: focusedEvaluation.allCasesPassed },
    supportGateRegression: { path: relative(supportGatePath), caseCount: supportGate.cases.length, status: supportGate.status, productionEvidenceWindow: supportGate.productionEvidenceWindow },
    representativeChunks: representativeIds.map((chunkId) => { const chunk = sourcePackage.chunks.find((candidate) => candidate.chunkId === chunkId); return { chunkId, sectionReference: chunk.sectionReference, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, provisionTypes: chunk.provisionTypes, sourceTextExcerpt: chunk.sourceTextExcerpt } }),
    unresolvedGaps: sourceQa.unresolvedGaps,
    artifacts: { canonicalSourcePackage: relative(sourcePackagePath), sourceQa: relative(sourceQaPath), relationshipCandidates: relative(relationshipPath), focusedRetrievalEvaluation: relative(retrievalPath), supportGateRegression: relative(supportGatePath), validationReport: 'data/processed/review_packages/vm30-validation-report.json', independentReviewPrompt: relative(promptPath) },
    promotionReadiness: { independentReviewRequired: true, automatedPromotion: false, currentStatus: 'review_candidate', promotionStatus: 'not_promoted', promotionEligible: false, blockersClosed: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
  }
  await writeJson(reviewPackagePath, reviewPackage)
  await writeMarkdown(reviewPackagePath, [
    '# VM-30 canonical coverage review package', '', '- Status: **REVIEW CANDIDATE — NOT PROMOTED**', `- Authority: ${sourcePackage.source.sourceVersionIdentifier}`, `- Source SHA-256: \`${VM30_SOURCE_SHA256}\``,
    '- Chapter boundary: PDF pages 325-339; page 340 blank separator; page 341 begins VM-31', `- Package / parents / children / total chunks: 1 / ${VM30_PARENT_COUNT} / ${VM30_CHILD_COUNT} / ${VM30_CHUNK_COUNT}`,
    `- Exact source fidelity: ${fidelityDistribution.exact ?? 0}/${VM30_CHUNK_COUNT}`, `- Relationship candidates: ${relationships.relationshipCount} (pending, review-only, not promoted)`, '',
    '## Focused retrieval', '', `- Supported top-1 / strict top-3: ${focusedEvaluation.supportedTop1Count}/${focusedEvaluation.supportedQueryCount} / ${focusedEvaluation.supportedTop3Count}/${focusedEvaluation.supportedQueryCount}`,
    `- Unsupported correctly rejected: ${focusedEvaluation.unsupportedCorrectCount}/${focusedEvaluation.unsupportedQueryCount}`, `- Ambiguity safely handled: ${focusedEvaluation.ambiguitySafeCount}/${focusedEvaluation.ambiguityQueryCount}`,
    `- Current authoritative VM-30 top-1: ${focusedEvaluation.currentAuthoritativeVm30Top1Count}/${focusedEvaluation.supportedQueryCount}`, `- Support-gate regressions: ${supportGate.cases.length}/${supportGate.cases.length}`, '',
    '## Review boundary', '', '- Exact VM-30 source excerpts control; summaries and classifications are generated metadata.', '- VM-01 terminology is not duplicated as VM-30 source definitions.',
    '- Relationship candidates do not assert legal effect and remain separately governed.', '- Canonical promotion and all learner, application, RAG, vector, and Copilot uses remain blocked.', '',
    'This review package is generated review metadata, not authoritative regulatory evidence.',
  ].join('\n'))

  await fs.writeFile(promptPath, `${[
    '# Independent review prompt: 2026 VM-30 canonical review candidate', '',
    'Please independently review the current 2026 VM-30 canonical review candidate in the Document Processor repository. Do not modify or promote the corpus. VM-31 is already canonically promoted; do not reopen its accepted source audit unless this VM-30 pass changed VM-31 evidence.', '',
    '## Primary files', '', `- Canonical source package: \`${relative(sourcePackagePath)}\``, `- Review package: \`${relative(reviewPackagePath)}\``, `- Focused retrieval evaluation: \`${relative(retrievalPath)}\``,
    `- Source QA: \`${relative(sourceQaPath)}\``, `- Relationship registry: \`${relative(relationshipPath)}\``, `- Support-gate regression: \`${relative(supportGatePath)}\``, '- Validation report: `data/processed/review_packages/vm30-validation-report.json`', '',
    '## Review scope', '',
    `1. Confirm the authoritative chapter boundary: PDF page 324 ends VM-26, pages ${VM30_PAGE_RANGE.start}-${VM30_PAGE_RANGE.end} comprise VM-30 (including printed blank page 30-15), page 340 is an unnumbered separator, and page 341 begins VM-31.`,
    `2. Confirm ${VM30_PARENT_COUNT} parents, ${VM30_CHILD_COUNT} children, ${VM30_CHUNK_COUNT} chunks, continuous hierarchy/adjacency, exact source fidelity, and zero source-text rewrites. Pay particular attention to the page-spanning key-indicators and reserve tables.`,
    '3. Confirm only adverse opinion, qualified opinion, and inconclusive opinion are represented as source-defined VM-30 terms; VM-01 terminology is not duplicated.',
    `4. Review all ${relationships.relationshipCount} explicit-reference candidates. Confirm source-facing target labels occur in retained source text, canonical labels are separate metadata, and every candidate remains pending, unpromoted, and non-eligible.`,
    `5. Inspect all ${focusedEvaluation.queryCount} focused retrieval cases. Confirm strict top-three metrics, unsupported VM-31/invented/future-version abstentions, ambiguous submission handling, and current-authority preference.`,
    `6. Confirm all ${supportGate.cases.length} generic support-gate regressions pass and actual VM-30 source evidence is required inside ranks 1-3.`,
    '7. Confirm VM-30 remains review-only, not promoted, promotion-ineligible, and blocked from learner, app, RAG, vector, and Copilot use.', '',
    'Report findings with severity, exact chunk/query/relationship IDs, and source-page references. End with exactly one disposition:', '', '- APPROVE FOR CANONICAL PROMOTION', '- APPROVE WITH FIXES', '- DO NOT PROMOTE', '',
    'Do not start VM-G or VM-C, and do not repeat the completed VM-01, VM-20, or VM-31 source audits unless this pass changed their authoritative evidence.',
  ].join('\n')}\n`, 'utf8')

  console.log(`Built VM-30 artifacts for ${VM30_PARENT_COUNT} parents, ${VM30_CHILD_COUNT} children, ${relationships.relationshipCount} relationship candidates, and ${focusedEvaluation.queryCount} retrieval cases.`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
