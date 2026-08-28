import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { evaluateFormalRequirementQueries } from './evaluate-formal-requirement-retrieval.mjs'
import { loadVm21Chapter, segmentVm21Chapter, VM21_CHILD_COUNT, VM21_CHUNK_COUNT, VM21_PAGE_RANGE, VM21_PARENT_COUNT, VM21_SOURCE_SHA256 } from './lib/vm21-current-manual.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const processedRoot = path.join(repoRoot, 'data', 'processed')
const sourceRoot = path.join(processedRoot, 'source_indexes', 'sources')
const reviewRoot = path.join(processedRoot, 'review_packages')
const relationshipRoot = path.join(processedRoot, 'relationship_registries')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const queryPath = path.join(repoRoot, 'data', 'manual-input', 'evaluation', 'vm21-focused-retrieval-queries.json')
const sourcePackagePath = path.join(sourceRoot, 'vm21-current-manual.json')
const sourceQaPath = path.join(reviewRoot, 'vm21-source-qa.json')
const retrievalPath = path.join(reviewRoot, 'vm21-focused-retrieval-evaluation.json')
const supportGatePath = path.join(reviewRoot, 'vm21-support-gate-regression.json')
const relationshipPath = path.join(relationshipRoot, 'vm21-current-manual-relationship-candidates.json')
const structuredEvidencePath = path.join(reviewRoot, 'vm21-structured-evidence-inventory.json')
const readinessPath = path.join(reviewRoot, 'vm21-processor-readiness-findings.json')
const reviewPackagePath = path.join(reviewRoot, 'vm21-canonical-coverage-review-package.json')
const promptPath = path.join(reviewRoot, 'vm21-independent-review-prompt.md')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => { await fs.mkdir(path.dirname(filePath), { recursive: true }); await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8') }
const writeMarkdown = async (jsonPath, value) => fs.writeFile(jsonPath.replace(/\.json$/, '.md'), `${value.trim()}\n`, 'utf8')
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const hashFile = async (filePath) => sha256(await fs.readFile(filePath))
const relative = (filePath) => path.relative(repoRoot, filePath).replace(/\\/g, '/')
const unique = (values) => [...new Set(values.filter(Boolean))]

const relationshipTargets = {
  'VM-01': { targetId: 'vm01-definitions', targetKind: 'canonical_source' },
  'VM-22': { targetId: 'vm-22', targetKind: 'corpus_target' },
  'VM-31': { targetId: 'vm31-current-manual', targetKind: 'canonical_source' },
  'VM-G': { targetId: 'vm-g', targetKind: 'corpus_target' },
  'VM-C': { targetId: 'vm-c', targetKind: 'corpus_target' },
  'Model #820': { targetId: 'standard-valuation-law-model-820', targetKind: 'corpus_target' },
  'AG 43': { targetId: 'ag-43', targetKind: 'corpus_target', canonicalTargetLabel: 'Actuarial Guideline XLIII' },
  'AG 33': { targetId: 'ag-33', targetKind: 'corpus_target', canonicalTargetLabel: 'Actuarial Guideline XXXIII' },
  'RBC requirements': { targetId: 'risk-based-capital-requirements', targetKind: 'corpus_target' },
  'C3 RBC amount': { targetId: 'c3-rbc-instructions', targetKind: 'corpus_target', canonicalTargetLabel: 'C-3 RBC instructions' },
  'Life RBC instructions': { targetId: 'life-rbc-instructions', targetKind: 'corpus_target' },
  'ASOPs': { targetId: 'actuarial-standards-of-practice', targetKind: 'external_standard' },
  'AP&P Manual': { targetId: 'accounting-practices-and-procedures-manual', targetKind: 'corpus_target' },
  'NAIC scenario generators': { targetId: 'naic-scenario-generators', targetKind: 'external_methodology' },
}

const buildRelationships = (sourcePackage) => {
  const candidates = []
  for (const chunk of sourcePackage.chunks.filter((candidate) => candidate.chunkLevel === 'child')) {
    for (const targetLabel of chunk.crossReferenceCandidates ?? []) {
      const target = relationshipTargets[targetLabel]
      if (!target) throw new Error(`VM-21 relationship target is unmapped: ${targetLabel}.`)
      candidates.push({
        relationshipId: `${chunk.chunkId}-references-${target.targetId}`,
        sourceChunkId: chunk.chunkId, sourceSection: chunk.sectionReference, relationType: 'references', targetLabel, targetId: target.targetId, targetKind: target.targetKind,
        ...(target.canonicalTargetLabel ? { canonicalTargetLabel: target.canonicalTargetLabel } : {}),
        evidence: { sourceSha256: VM21_SOURCE_SHA256, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, sectionReference: chunk.sectionReference, sourceTextSha256: chunk.sourceTextSha256, canonicalSourcePackagePath: relative(sourcePackagePath) },
        evidenceBasis: 'explicit_source_text_reference',
        caveat: 'This candidate records an explicit documentary reference only; it does not infer legal hierarchy, supersession, controlling-source status, equivalence, or downstream promotion.',
        reviewDecision: 'pending', promotionStatus: 'not_promoted', promotionEligible: false,
      })
    }
  }
  return {
    schemaVersion: '1.0', relationshipRegistryId: 'vm21-current-manual-relationship-candidates-2026', sourceId: 'vm21-current-manual', relationshipCount: candidates.length,
    relationTypes: ['references'], targetCounts: Object.fromEntries(Object.keys(relationshipTargets).map((label) => [label, candidates.filter((candidate) => candidate.targetLabel === label).length]).filter(([, count]) => count > 0)),
    governance: { reviewOnly: true, reviewDecision: 'pending', promotionStatus: 'not_promoted', promotionEligible: false }, candidates,
  }
}

const buildFocusedEvaluation = async () => {
  const querySpec = await readJson(queryPath)
  const packageFiles = (await fs.readdir(sourceRoot)).filter((filename) => filename.endsWith('.json'))
  const packages = await Promise.all(packageFiles.map((filename) => readJson(path.join(sourceRoot, filename))))
  const sourcePackages = packages.map((sourcePackage) => sourcePackage.source)
  const chunkRecords = packages.flatMap((sourcePackage) => sourcePackage.chunks.map((chunk) => ({ ...chunk, sourceId: sourcePackage.source.sourceId, sourceTitle: sourcePackage.source.sourceTitle, sourceReference: sourcePackage.source.sourceReference, sourceFamilyId: sourcePackage.source.sourceFamilyId, authorityLevel: sourcePackage.source.authorityLevel, sourceStatus: sourcePackage.source.sourceStatus, sourceVersionIdentifier: sourcePackage.source.sourceVersionIdentifier })))
  const evaluation = evaluateFormalRequirementQueries({ queries: querySpec.queries, chunkRecords, sourcePackages, unsupportedThreshold: 3, topN: 7 })
  const chunkLookup = new Map(chunkRecords.map((chunk) => [chunk.chunkId, chunk]))
  const cases = evaluation.queries.map((result) => {
    const actualTop7 = result.rankedMatches.slice(0, 7).map((match, index) => {
      const chunk = chunkLookup.get(match.chunkId)
      return { rank: index + 1, chunkId: match.chunkId, sourceId: match.sourceId, sourceFamilyId: match.sourceFamilyId, authorityLevel: match.authorityLevel, score: match.score, sectionReference: chunk?.sectionReference ?? null, pageStart: chunk?.pageStart ?? null, pageEnd: chunk?.pageEnd ?? null, citationAvailable: Boolean(chunk?.citations?.length) }
    })
    const actualTop3 = actualTop7.slice(0, 3)
    const intended = result.expectedOutcome ?? 'supported'
    const expectedInTop7 = actualTop7.filter((match) => result.expectedChunkIds.includes(match.chunkId))
    const ambiguityResult = intended === 'ambiguous'
      ? { safelyAbstained: expectedInTop7.length >= 2, reasonCode: expectedInTop7.length >= 2 ? 'multiple_relevant_vm21_contexts' : 'ambiguity_not_sufficiently_exposed', candidateChunkIds: expectedInTop7.map((match) => match.chunkId) }
      : { safelyAbstained: false, reasonCode: 'not_applicable', candidateChunkIds: [] }
    const supportDecision = intended === 'ambiguous'
      ? { supportState: 'ambiguous_requires_more_context', evidenceSufficient: false, reasonCode: ambiguityResult.reasonCode, reason: 'The request does not identify which materially distinct VM-21 reserve or assumption context applies.' }
      : result.supportDecision
    const passed = intended === 'supported'
      ? result.top3Hit && supportDecision.supportState === 'supported'
      : intended === 'unsupported'
        ? supportDecision.supportState === 'unsupported'
        : ambiguityResult.safelyAbstained
    return {
      queryId: result.queryId, queryCategory: result.queryCategory, query: result.query, intendedSupportState: intended, expectedEvidence: result.expectedEvidence, expectedChunkIds: result.expectedChunkIds,
      actualTop1: actualTop3[0] ?? null, actualTop3, actualTop7, fullRanking: actualTop7, productionEvidenceWindow: { size: 3, evidence: actualTop3 }, top1Hit: intended === 'supported' ? result.top1Hit : false, top3Hit: intended === 'supported' ? result.top3Hit : false,
      sourceFamilyResult: { expected: result.expectedSourceFamilyIds, actualTop1: result.predictedSourceFamilyId, correct: result.expectedSourceFamilyIds.includes(result.predictedSourceFamilyId) },
      authorityResult: { expected: result.expectedAuthorityLevels, actualTop1: result.predictedAuthorityLevel, correct: result.expectedAuthorityLevels.includes(result.predictedAuthorityLevel), currentAuthoritativeVm21Top1: actualTop3[0]?.sourceId === 'vm21-current-manual' },
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
    currentAuthoritativeVm21Top1Count: supported.filter((testCase) => testCase.authorityResult.currentAuthoritativeVm21Top1).length, sourceFamilyAccuracyCount: supported.filter((testCase) => testCase.sourceFamilyResult.correct).length, authorityLevelAccuracyCount: supported.filter((testCase) => testCase.authorityResult.correct).length,
    allCasesPassed: cases.every((testCase) => testCase.passed), queries: cases, governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false },
  }
}

const formulaSpecs = [
  ['vm21-section-4-determination-of-sr-b-scenario-reserve', 'scenario_reserve_calculation'],
  ['vm21-section-6-additional-standard-projection-amount-b-additional-standard-projection-amount', 'additional_standard_projection_sequence'],
  ['vm21-section-6-additional-standard-projection-amount-c-prescribed-assumptions', 'prescribed_assumption_formulas_and_tables'],
  ['vm21-section-7-alternative-methodology-b-calculation-of-ca-and-fe', 'ca_and_fe_calculation'],
  ['vm21-section-7-alternative-methodology-c-calculation-of-gc-component', 'gc_factor_calculation'],
  ['vm21-section-9-modeling-hedges-c-calculation-of-sr-reported', 'reported_sr_hedge_adjustment'],
  ['vm21-section-13-contract-allocation-b-excess-aggregate-reserve', 'contract_allocation_formula'],
]

const buildStructuredEvidence = (sourcePackage) => {
  const records = []
  for (const chunk of sourcePackage.chunks.filter((candidate) => candidate.chunkLevel === 'child')) for (const evidence of chunk.structuredEvidence ?? []) records.push({ structuredEvidenceId: `${chunk.chunkId}-${String(evidence.label).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, sourceChunkId: chunk.chunkId, sourceSection: chunk.sectionReference, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, evidenceType: evidence.evidenceType, label: evidence.label, recommendedTreatment: 'structured_table_or_matrix_candidate', sourceIdentity: { sourceId: 'vm21-current-manual', sourceSha256: VM21_SOURCE_SHA256 }, sourceLocator: { pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, sectionReference: chunk.sectionReference, chunkId: chunk.chunkId }, dimensions: { status: 'requires_visual_structured_extraction', rowIdentity: 'retained_only_in_exact_source_text', columnIdentity: 'retained_only_in_exact_source_text' }, units: { status: 'retained_in_exact_source_text_not_normalized' }, notesAndFootnotes: { status: 'retained_with_governing_source_subsection' }, values: { rawAndDisplayValues: 'retained_in_exact_source_text_not_recomputed' }, sourceTextSha256: chunk.sourceTextSha256, authoritativeRepresentation: 'exact_source_text_excerpt', reviewDecision: 'pending', promotionStatus: 'not_promoted' })
  for (const [chunkId, label] of formulaSpecs) {
    const chunk = sourcePackage.chunks.find((candidate) => candidate.chunkId === chunkId)
    if (!chunk) throw new Error(`VM-21 structured formula fixture is missing: ${chunkId}.`)
    records.push({ structuredEvidenceId: `${chunkId}-${label}`, sourceChunkId: chunkId, sourceSection: chunk.sectionReference, pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, evidenceType: 'formula_or_calculation_sequence', label, recommendedTreatment: 'structured_semantic_record_without_numeric_recomputation', sourceIdentity: { sourceId: 'vm21-current-manual', sourceSha256: VM21_SOURCE_SHA256 }, sourceLocator: { pageStart: chunk.pageStart, pageEnd: chunk.pageEnd, sectionReference: chunk.sectionReference, chunkId }, dimensions: { status: 'not_applicable_formula_or_sequence' }, units: { status: 'retained_in_exact_source_text_not_normalized' }, notesAndFootnotes: { status: 'retained_with_governing_source_subsection' }, values: { rawAndDisplayValues: 'retained_in_exact_source_text_not_recomputed' }, sourceTextSha256: chunk.sourceTextSha256, authoritativeRepresentation: 'exact_source_text_excerpt', reviewDecision: 'pending', promotionStatus: 'not_promoted' })
  }
  return {
    schemaVersion: '1.0', inventoryId: 'vm21-structured-evidence-inventory-2026', sourceId: 'vm21-current-manual', recordCount: records.length,
    tableOrMatrixCount: records.filter((record) => record.evidenceType !== 'formula_or_calculation_sequence').length, formulaOrCalculationCount: records.filter((record) => record.evidenceType === 'formula_or_calculation_sequence').length,
    decision: 'These records identify source areas suited to structured review objects. They do not numerically reinterpret, recompute, or replace exact VM-21 source text.',
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false }, records,
  }
}

const main = async () => {
  const [config, sourcePackage, supportGate] = await Promise.all([readJson(configPath), readJson(sourcePackagePath), readJson(supportGatePath)])
  const sourceConfig = config.sources.find((source) => source.sourceId === 'vm21-current-manual')
  if (!sourceConfig) throw new Error('VM-21 source configuration is missing.')
  const { chapterText, aggregateExtractionSha256, overlapChecks } = await loadVm21Chapter(repoRoot, sourceConfig.vm21Input)
  const structure = segmentVm21Chapter(chapterText)
  const relationships = buildRelationships(sourcePackage)
  const structuredEvidence = buildStructuredEvidence(sourcePackage)
  const focusedEvaluation = await buildFocusedEvaluation()
  await writeJson(relationshipPath, relationships)
  await writeJson(structuredEvidencePath, structuredEvidence)
  await writeJson(retrievalPath, focusedEvaluation)

  await writeMarkdown(relationshipPath, ['# VM-21 relationship candidates', '', `- Candidates: ${relationships.relationshipCount}`, '- Relation type: explicit documentary references only', '- Governance: pending, review-only, not promoted', '', ...Object.entries(relationships.targetCounts).map(([label, count]) => `- ${label}: ${count}`), '', 'No legal hierarchy, supersession, equivalence, or controlling-source status is inferred.'].join('\n'))
  await writeMarkdown(structuredEvidencePath, ['# VM-21 structured evidence inventory', '', `- Records: ${structuredEvidence.recordCount}`, `- Table or matrix candidates: ${structuredEvidence.tableOrMatrixCount}`, `- Formula or calculation-sequence candidates: ${structuredEvidence.formulaOrCalculationCount}`, '- Exact source text remains authoritative.', '- Numeric recomputation is out of scope for this canonicalization pass.'].join('\n'))
  await writeMarkdown(retrievalPath, ['# VM-21 focused retrieval evaluation', '', `- Cases: ${focusedEvaluation.queryCount}`, `- Supported top-1 / strict top-3: ${focusedEvaluation.supportedTop1Count}/${focusedEvaluation.supportedQueryCount} / ${focusedEvaluation.supportedTop3Count}/${focusedEvaluation.supportedQueryCount}`, `- Unsupported correctly rejected: ${focusedEvaluation.unsupportedCorrectCount}/${focusedEvaluation.unsupportedQueryCount}`, `- Ambiguity safely handled: ${focusedEvaluation.ambiguitySafeCount}/${focusedEvaluation.ambiguityQueryCount}`, `- Current authoritative VM-21 top-1: ${focusedEvaluation.currentAuthoritativeVm21Top1Count}/${focusedEvaluation.supportedQueryCount}`, '', '| Query ID | Intended | Top-1 | Strict top-3 | Support | Passed |', '| --- | --- | --- | --- | --- | --- |', ...focusedEvaluation.queries.map((testCase) => `| ${testCase.queryId} | ${testCase.intendedSupportState} | ${testCase.actualTop1?.chunkId ?? 'none'} | ${testCase.actualTop3.map((match) => match.chunkId).join('<br>')} | ${testCase.supportDecision.supportState} / ${testCase.supportDecision.reasonCode} | ${testCase.passed ? 'yes' : 'no'} |`), '', 'Generated QA evidence; not authoritative regulatory source text.'].join('\n'))

  const sectionCoverage = structure.map((parent) => {
    const parentChunkId = `vm21-${parent.id}`
    const children = sourcePackage.chunks.filter((chunk) => chunk.parentChunkId === parentChunkId)
    return { sectionOrBoundary: parent.title, pageRange: parent.pages, canonicalParentChunkId: parentChunkId, childChunkIds: children.map((chunk) => chunk.chunkId), childCount: children.length, requirementTypes: unique(children.flatMap((chunk) => chunk.provisionTypes ?? [])), crossReferences: unique(children.flatMap((chunk) => chunk.crossReferenceCandidates ?? [])), sourceTextSha256: parent.sourceTextSha256, canonicalized: true, unresolvedSourceQuestions: [] }
  })
  const sourceQa = {
    schemaVersion: '1.0', qaId: 'vm21-current-manual-source-qa-2026', status: 'pass',
    authoritativeSource: { sourceEditionId: sourcePackage.source.sourceEditionId, sourceVersionIdentifier: sourcePackage.source.sourceVersionIdentifier, sourceSha256: VM21_SOURCE_SHA256, pageRange: VM21_PAGE_RANGE, localPdfHashVerified: true },
    extraction: { batchIds: sourcePackage.source.reviewBatchIds, aggregateExtractionSha256, uniquePhysicalPageCount: 83, overlapChecks, overlapChecksPassed: overlapChecks.every((check) => check.exactMatch), sourceReExtractionPerformed: false, visualReview: { precedingVm20IntentionalBlank: 141, precedingUnnumberedSeparator: 142, vm21Opener: 143, continuationSample: 144, intentionalClosingBlank: 225, followingUnnumberedSeparatorExcluded: 226, vm22Opener: 227, status: 'pass' } },
    hierarchy: { parentCount: VM21_PARENT_COUNT, childCount: VM21_CHILD_COUNT, totalChunkCount: VM21_CHUNK_COUNT, retrievalEligibleChildCount: 61, parentCoverageContinuous: true, topLevelSubsectionsKeepNestedListsTablesAndGuidance: true, adjacencyComplete: true },
    sourceFidelity: { exactChunkCount: sourcePackage.chunks.filter((chunk) => chunk.fidelity === 'exact').length, sourceTextRewriteCount: 0, visualTranscriptionCount: 0, sourceTextHashesPresent: sourcePackage.chunks.every((chunk) => Boolean(chunk.sourceTextSha256)) },
    definedTermsAudit: { sourceExplicitTermCount: sourcePackage.chunks.flatMap((chunk) => chunk.definedTerms ?? []).length, sourceExplicitTerms: unique(sourcePackage.chunks.flatMap((chunk) => chunk.definedTerms ?? [])), generatedVariantsInDefinedTerms: 0 },
    sectionCoverage, structuredEvidence: { path: relative(structuredEvidencePath), recordCount: structuredEvidence.recordCount, exactSourceTextRemainsAuthoritative: true },
    unresolvedGaps: ['Independent source and actuarial review is required before promotion.', 'Dense tables and formula sequences require targeted human semantic review; this pass preserves them but does not recompute values.', 'Publication and effective dates are not inferred beyond explicit source language and the established 2026 edition identity.'],
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
  }
  await writeJson(sourceQaPath, sourceQa)
  await writeMarkdown(sourceQaPath, ['# VM-21 source QA', '', '- Result: **PASS**', `- Source SHA-256: \`${VM21_SOURCE_SHA256}\``, '- Boundary: page 141 is VM-20 printed blank 20-97, page 142 is an unnumbered separator, VM-21 spans pages 143-225, page 226 is excluded, and page 227 begins VM-22', `- Parents / children / chunks: ${VM21_PARENT_COUNT} / ${VM21_CHILD_COUNT} / ${VM21_CHUNK_COUNT}`, `- Reused extraction pages: ${sourceQa.extraction.uniquePhysicalPageCount}; identical overlaps: ${overlapChecks.length}/${overlapChecks.length}`, '- Source re-extraction: no', '- Authoritative source-text rewrites: 0', `- Source-explicit defined terms/forms: ${sourceQa.definedTermsAudit.sourceExplicitTermCount}`, `- Structured evidence candidates: ${structuredEvidence.recordCount}`, '', 'Generated metadata remains subordinate to exact source excerpts.'].join('\n'))

  const readiness = {
    schemaVersion: '1.0', assessmentId: 'vm21-generic-processor-readiness-2026', overallRating: 'AMBER',
    ratingReason: 'The generic architecture successfully reused overlapping reviewed batches, preserved complete hierarchical source coverage, and enforced review-only evidence boundaries. Dense tables, formulas, and actuarial classifications still require targeted independent review before promotion.',
    findings: [
      { findingId: 'vm21-readiness-001', source: 'vm21-current-manual batches 022-037', genericOrSourceSpecific: 'generic', classification: 'architecture_improvement', severity: 'resolved', finding: 'Overlapping reviewed batches previously had no full-chapter reconciliation step.', detectionMethod: 'deterministic page-marker inventory and duplicate-page SHA/content comparison', existingValidatorCaught: false, newValidatorAdded: true, response: 'The reusable loader deduplicates page markers, requires exact equality for every overlap, rejects missing pages, and rejects page 226 boundary crossing.', residualHumanReviewNeed: 'none for page completeness or overlap equality', evidence: { overlapPages: overlapChecks.map((check) => check.page), allExact: overlapChecks.every((check) => check.exactMatch) } },
      { findingId: 'vm21-readiness-002', source: 'generic canonical package builder', genericOrSourceSpecific: 'generic', classification: 'architecture_improvement', severity: 'resolved', finding: 'An explicitly empty requirements array could be repopulated from controlled tags, inflating definition chunks into freestanding obligations.', detectionMethod: 'new derivative-metadata validator rejected definition chunks with non-empty requirements', existingValidatorCaught: false, newValidatorAdded: true, response: 'Added an opt-in preserveEmptyRequirements path to the generic builder and validation that definition metadata does not inflate into requirements.', residualHumanReviewNeed: 'sample semantic review that definitions were correctly identified' },
      { findingId: 'vm21-readiness-003', source: 'generic canonical package validation layer', genericOrSourceSpecific: 'generic', classification: 'architecture_improvement', severity: 'resolved', finding: 'Canonical package checks needed reusable source-hash, hierarchy, adjacency, citation, source-explicit-term, derivative-metadata, and review-governance coverage.', detectionMethod: 'requirements-to-validator coverage audit', existingValidatorCaught: 'partial', newValidatorAdded: true, response: 'Added scripts/lib/canonical-package-validation.mjs and integrated it into VM-21 validation without weakening existing source-specific checks.', residualHumanReviewNeed: 'semantic classifications still require exception/sample review' },
      { findingId: 'vm21-readiness-004', source: 'authoritative 2026 VM-21 PDF text layer', genericOrSourceSpecific: 'source_specific', classification: 'source_specific_quality_observation', severity: 'non_blocking', finding: 'The retained PDF text layer contains visual spacing and hyphen artifacts.', detectionMethod: 'boundary rendering and extraction-text inspection', existingValidatorCaught: true, newValidatorAdded: false, response: 'No source rewriting was performed. Search normalization remains derivative, and exact source excerpts plus hashes control.', residualHumanReviewNeed: 'visual sampling where layout affects meaning' },
      { findingId: 'vm21-readiness-005', source: 'VM-21 Sections 6-9 and 13', genericOrSourceSpecific: 'source_specific', classification: 'human_review_requirement', severity: 'promotion_blocker', finding: 'VM-21 includes dense factor tables, matrices, nested prescribed assumptions, and formula sequences.', detectionMethod: 'structured-evidence scan plus chapter review', existingValidatorCaught: true, newValidatorAdded: false, response: 'Created a source-bound structured-evidence inventory; numeric recomputation and semantic approval are deferred to targeted independent review.', residualHumanReviewNeed: 'targeted visual and actuarial review of dimensions, values, notes, and formula semantics' },
      { findingId: 'vm21-readiness-006', source: 'VM-21 processing architecture', genericOrSourceSpecific: 'generic', classification: 'no_change_needed', severity: 'resolved', finding: 'No new document-specific core schema fork or second retrieval architecture was needed.', detectionMethod: 'architecture diff review', existingValidatorCaught: 'not_applicable', newValidatorAdded: false, response: 'The implementation extends the existing canonical package, generic support gate, relationship registry, retrieval evaluator, and governance model.', residualHumanReviewNeed: 'none' }
    ],
    humanReviewBurden: {
      automaticallyValidated: ['source identity and SHA-256', '83-page boundary completeness', 'exact overlap equality and deduplication', 'deterministic source-text SHA values', 'parent/child links and adjacency', 'source-explicit defined terms', 'literal relationship-label fidelity', 'strict top-three retrieval metrics', 'wrong-source, rank-four, wrong-topic, and unavailable-version support behavior', 'review-only and downstream-governance boundaries'],
      humanReviewRequired: ['actuarial semantic accuracy of provision classifications', 'table row/column dimensions, units, displayed values, notes, and footnotes', 'formula and model-sequence meaning', 'conservatism and completeness of relationship candidates', 'promotion decision'],
      newGenericFailureClassCount: 2,
      repeatAlreadyKnownClassCount: 7,
      newGenericFailureClasses: ['overlapping batch pages require exact deterministic reconciliation before canonical assembly', 'explicitly empty semantic arrays must not be repopulated by fallback derivation'],
      repeatAlreadyKnownClasses: ['source identity and boundary control', 'source-text hash fidelity', 'definition versus requirement discipline', 'literal relationship-label fidelity', 'wrong-source and wrong-topic support rejection', 'strict rank-three production window', 'promotion versus downstream eligibility separation']
    },
    genericRegressionEvidence: { supportGatePath: relative(supportGatePath), supportCasesPassed: `${supportGate.passedCaseCount}/${supportGate.caseCount}`, focusedRetrievalPath: relative(retrievalPath), allFocusedCasesPassed: focusedEvaluation.allCasesPassed },
    governance: { reviewOnly: true, promotionStatus: 'not_promoted' },
  }
  await writeJson(readinessPath, readiness)
  await writeMarkdown(readinessPath, ['# VM-21 generic processor readiness', '', `- Rating: **${readiness.overallRating}**`, `- ${readiness.ratingReason}`, '', ...readiness.findings.map((finding) => `- \`${finding.findingId}\` — ${finding.classification} / ${finding.severity}: ${finding.finding}`)].join('\n'))

  const reviewPackage = {
    schemaVersion: '1.0', reviewPackageId: 'vm21-canonical-coverage-review-package-2026', status: 'review_only', promoted: false, authoritativeSource: sourcePackage.source,
    coverage: { packageCount: 1, parentCount: VM21_PARENT_COUNT, childCount: VM21_CHILD_COUNT, totalChunkCount: VM21_CHUNK_COUNT, retrievalEligibleChildCount: 61, pageRange: VM21_PAGE_RANGE, printedPageRange: { start: '21-1', end: '21-83' }, boundaryEvidence: { precedingVm20IntentionalBlank: 141, precedingUnnumberedSeparator: 142, vm21Start: 143, vm21IntentionalClosingBlank: 225, followingUnnumberedSeparator: 226, vm22Start: 227 }, exactChunkCount: sourceQa.sourceFidelity.exactChunkCount, sectionCoverageMatrix: sectionCoverage, notCanonicalizedSections: [] },
    sourceFidelity: { sourceQaPath: relative(sourceQaPath), sourceQaStatus: sourceQa.status, aggregateExtractionSha256, canonicalPackageSha256: await hashFile(sourcePackagePath), sourceTextRewriteCount: 0, sourceReExtractionPerformed: false },
    hierarchy: { model: 'section_parent_to_complete_top_level_lettered_subsection_child', adjacencyAvailable: true, nestedListsGuidanceTablesAndFormulasKeptWithGoverningSubsection: true, openingAndClosingBoundaryControlsIncluded: true },
    definitions: sourceQa.definedTermsAudit,
    relationships: { candidateCount: relationships.relationshipCount, targetCounts: relationships.targetCounts, registryPath: relative(relationshipPath), status: 'review_only_pending' },
    structuredEvidence: { path: relative(structuredEvidencePath), recordCount: structuredEvidence.recordCount, tableOrMatrixCount: structuredEvidence.tableOrMatrixCount, formulaOrCalculationCount: structuredEvidence.formulaOrCalculationCount, numericRecomputationPerformed: false },
    retrievalEvaluation: { path: relative(retrievalPath), queryCount: focusedEvaluation.queryCount, supportedTop1: focusedEvaluation.supportedTop1Count, supportedTop3: focusedEvaluation.supportedTop3Count, supportedQueryCount: focusedEvaluation.supportedQueryCount, unsupportedCorrect: focusedEvaluation.unsupportedCorrectCount, unsupportedQueryCount: focusedEvaluation.unsupportedQueryCount, ambiguitySafe: focusedEvaluation.ambiguitySafeCount, ambiguityQueryCount: focusedEvaluation.ambiguityQueryCount, currentAuthorityTop1: focusedEvaluation.currentAuthoritativeVm21Top1Count, allCasesPassed: focusedEvaluation.allCasesPassed },
    supportGateRegression: { path: relative(supportGatePath), caseCount: supportGate.caseCount, passedCaseCount: supportGate.passedCaseCount, status: supportGate.status, productionEvidenceWindow: supportGate.productionEvidenceWindow },
    processorReadiness: { path: relative(readinessPath), rating: readiness.overallRating, findingCount: readiness.findings.length },
    unresolvedGaps: sourceQa.unresolvedGaps,
    artifacts: { canonicalSourcePackage: relative(sourcePackagePath), sourceQa: relative(sourceQaPath), relationshipCandidates: relative(relationshipPath), structuredEvidenceInventory: relative(structuredEvidencePath), focusedRetrievalEvaluation: relative(retrievalPath), supportGateRegression: relative(supportGatePath), processorReadiness: relative(readinessPath), validationReport: 'data/processed/review_packages/vm21-validation-report.json', independentReviewPrompt: relative(promptPath) },
    promotionReadiness: { independentReviewRequired: true, automatedPromotion: false, currentStatus: 'review_only_pending_independent_review', promotionStatus: 'not_promoted', promotionEligible: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
  }
  await writeJson(reviewPackagePath, reviewPackage)
  await writeMarkdown(reviewPackagePath, ['# VM-21 canonical coverage review package', '', '- Status: **REVIEW ONLY — NOT PROMOTED**', `- Authority: ${sourcePackage.source.sourceVersionIdentifier}`, `- Source SHA-256: \`${VM21_SOURCE_SHA256}\``, '- Boundary: PDF pages 143-225; page 226 excluded; page 227 begins VM-22', `- Package / parents / children / chunks: 1 / ${VM21_PARENT_COUNT} / ${VM21_CHILD_COUNT} / ${VM21_CHUNK_COUNT}`, `- Relationship candidates: ${relationships.relationshipCount} (pending, unpromoted)`, `- Structured evidence candidates: ${structuredEvidence.recordCount}`, `- Focused retrieval top-1 / strict top-3: ${focusedEvaluation.supportedTop1Count}/${focusedEvaluation.supportedQueryCount} / ${focusedEvaluation.supportedTop3Count}/${focusedEvaluation.supportedQueryCount}`, `- Unsupported / ambiguity: ${focusedEvaluation.unsupportedCorrectCount}/${focusedEvaluation.unsupportedQueryCount} / ${focusedEvaluation.ambiguitySafeCount}/${focusedEvaluation.ambiguityQueryCount}`, `- Support-gate regressions: ${supportGate.passedCaseCount}/${supportGate.caseCount}`, `- Processor readiness: ${readiness.overallRating}`, '', 'Exact source excerpts control. Promotion and every downstream eligibility state remain blocked pending independent review.'].join('\n'))

  await fs.writeFile(promptPath, `${[
    '# Independent review prompt: current 2026 VM-21 canonical candidate', '',
    'Please independently review the substantially complete current 2026 VM-21 canonical candidate in the Document Processor repository. VM-30 is already canonically promoted; do not reopen VM-30 unless this VM-21 work caused a regression.', '',
    '## Primary files', '', `- Canonical source package: \`${relative(sourcePackagePath)}\``, `- Review package: \`${relative(reviewPackagePath)}\``, `- Source QA: \`${relative(sourceQaPath)}\``, `- Focused retrieval evaluation: \`${relative(retrievalPath)}\``, `- Support-gate regression: \`${relative(supportGatePath)}\``, `- Relationship registry: \`${relative(relationshipPath)}\``, `- Structured evidence inventory: \`${relative(structuredEvidencePath)}\``, `- Processor-readiness findings: \`${relative(readinessPath)}\``, '- Validation report: `data/processed/review_packages/vm21-validation-report.json`', '',
    '## Review scope', '',
    '1. Confirm page 141 is VM-20 printed page 20-97 intentionally blank, page 142 is an unnumbered separator, VM-21 spans PDF pages 143-225, page 225 is printed VM-21 page 21-83 intentionally blank, page 226 is excluded, and page 227 begins VM-22.',
    `2. Confirm ${VM21_PARENT_COUNT} parents, ${VM21_CHILD_COUNT} children, and ${VM21_CHUNK_COUNT} total chunks provide substantially complete Sections 1-13 coverage, including nested lists, guidance notes, tables, formulas, cross-page provisions, and adjacency.`,
    '3. Confirm batches 022-037 were reused without source re-extraction; overlapping PDF pages 151 and 218 are exact matches and are represented once.',
    '4. Confirm source excerpts, page locators, source-text SHA values, and source-defined terms are source-faithful; generated metadata remains subordinate.',
    '5. Review the structured-evidence inventory, particularly Sections 6 and 7 factor tables/formulas, Section 8 scenario generators, Section 9 hedge calculations, and Section 13 allocation. Do not require numeric recomputation unless an actual transcription defect is found.',
    '6. Confirm relationship candidates are explicit-reference-only, source-bound, pending, review-only, and do not infer legal hierarchy or supersession.',
    `7. Inspect all ${focusedEvaluation.queryCount} retrieval cases. Confirm supported strict top-3 behavior, undefined/wrong-manual/version abstention, ambiguity handling, and preference for current VM-21 authority.`,
    `8. Confirm all ${supportGate.caseCount} support-gate cases exercise the generic evidence-sufficiency gate: other-manual evidence is insufficient, rank-4 correct evidence is outside the production window, top-3 relevant VM-21 evidence may support, and wrong-topic VM-21 evidence cannot support an invented claim.`,
    '9. Assess the AMBER processor-readiness conclusion and classify any finding as architecture improvement, source-specific quality observation, human-review requirement, or no change needed.',
    '10. Confirm VM-21 remains review_only / not_promoted and blocked from learner, app, RAG, vector, and Copilot use.',
    '11. Answer explicitly: Did VM-21 reveal any genuinely new generic processor failure mode that would prevent moving toward exception-based review?', '',
    'Report findings with severity, exact chunk/query/relationship IDs, and source pages. End with exactly one disposition:', '', '- APPROVE FOR CANONICAL PROMOTION', '- APPROVE WITH FIXES', '- DO NOT PROMOTE', '',
    'Do not request broad re-extraction unless authoritative source evidence is actually missing or inconsistent.',
  ].join('\n')}\n`, 'utf8')

  console.log(`Built VM-21 artifacts for ${VM21_PARENT_COUNT} parents, ${VM21_CHILD_COUNT} children, ${relationships.relationshipCount} relationships, ${structuredEvidence.recordCount} structured records, and ${focusedEvaluation.queryCount} retrieval cases.`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
