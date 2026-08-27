import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  VM01_EXPECTED_DEFINITION_COUNT,
  VM01_SOURCE_EVIDENCE_AGGREGATE_SHA256,
  VM01_SOURCE_SHA256,
  loadVm01Extraction,
  sha256,
} from './lib/vm01-definitions.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const processedRoot = path.join(repoRoot, 'data', 'processed')
const sourcePackagePath = path.join(processedRoot, 'source_indexes', 'sources', 'vm01-definitions.json')
const definitionIndexPath = path.join(processedRoot, 'source_indexes', 'definitions', 'vm01-definition-index.json')
const relationshipPath = path.join(processedRoot, 'relationship_registries', 'vm01-definition-relationship-candidates.json')
const retrievalPath = path.join(processedRoot, 'review_packages', 'vm01-definition-retrieval-evaluation.json')
const sourceQaPath = path.join(processedRoot, 'review_packages', 'vm01-definitions-source-qa.json')
const reviewPackagePath = path.join(processedRoot, 'review_packages', 'vm01-canonical-definitions-review-package.json')
const promptPath = path.join(processedRoot, 'review_packages', 'vm01-independent-review-prompt.md')
const validationPath = path.join(processedRoot, 'review_packages', 'vm01-definitions-validation-report.json')
const pdfHashConfirmationPath = path.join(processedRoot, 'review_packages', 'vm01-source-pdf-hash-confirmation.json')
const globalRetrievalPath = path.join(processedRoot, 'source_indexes', 'evaluation', 'retrieval_results.json')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const hashFile = async (filePath) => crypto.createHash('sha256').update(await fs.readFile(filePath)).digest('hex')

const main = async () => {
  const [config, sourcePackage, definitionIndex, relationships, retrieval, sourceQa, reviewPackage, globalRetrieval, pdfHashConfirmation] = await Promise.all([
    readJson(configPath), readJson(sourcePackagePath), readJson(definitionIndexPath), readJson(relationshipPath), readJson(retrievalPath), readJson(sourceQaPath), readJson(reviewPackagePath), readJson(globalRetrievalPath), readJson(pdfHashConfirmationPath), fs.access(promptPath),
  ])
  const sourceConfig = config.sources.find((source) => source.sourceId === 'vm01-definitions')
  assert(sourceConfig, 'VM-01 source configuration is missing.')
  const parsed = await loadVm01Extraction(repoRoot, sourceConfig.definitionInput)

  const actualSourcePdfSha256 = await hashFile(parsed.sourceRecord.filePath)
  assert(parsed.sourceRecord.fileHash === VM01_SOURCE_SHA256, 'VM-01 batch-manifest source hash mismatch.')
  assert(actualSourcePdfSha256 === VM01_SOURCE_SHA256, 'Authoritative VM-01 PDF hash mismatch.')
  assert(pdfHashConfirmation.expectedSha256 === VM01_SOURCE_SHA256 && pdfHashConfirmation.verifiedSha256 === actualSourcePdfSha256 && pdfHashConfirmation.match === true && pdfHashConfirmation.sourceModified === false, 'VM-01 local PDF hash confirmation is missing or inconsistent.')
  assert(sourcePackage.source.sourceSha256 === VM01_SOURCE_SHA256, 'Canonical VM-01 package source hash mismatch.')
  assert(sourcePackage.source.sourceEditionId === 'NAIC-VALUATION-MANUAL-2026' && sourcePackage.source.sourceVersionIdentifier === '2026 NAIC Valuation Manual', 'VM-01 current edition identity is missing.')
  assert(sourcePackage.source.pageRange.start === 25 && sourcePackage.source.pageRange.end === 39, 'VM-01 chapter page range mismatch.')
  assert(sourcePackage.processing.processingMode === 'canonical_index' && sourcePackage.processing.canonicality === 'canonical', 'VM-01 package is not represented as a canonical review candidate.')
  assert(sourcePackage.processing.reviewOnly === true && sourcePackage.processing.promotionStatus === 'not_promoted', 'VM-01 review/promotion guardrail is incorrect.')
  for (const field of ['learnerFacingAllowed', 'appReadyAllowed', 'ragReadyAllowed']) assert(sourcePackage.processing[field] === false, `VM-01 ${field} must remain false.`)
  assert(sourcePackage.exportHints.vectorEligible === false, 'VM-01 vector export must remain blocked before promotion.')

  assert(parsed.definitions.length === VM01_EXPECTED_DEFINITION_COUNT && sourcePackage.chunks.length === VM01_EXPECTED_DEFINITION_COUNT && definitionIndex.definitions.length === VM01_EXPECTED_DEFINITION_COUNT, 'VM-01 definition/retrieval-unit count mismatch.')
  const chunkIds = sourcePackage.chunks.map((chunk) => chunk.chunkId)
  assert(new Set(chunkIds).size === chunkIds.length, 'VM-01 chunk IDs are not unique.')
  const normalizedTerms = definitionIndex.definitions.map((entry) => entry.normalizedLookupTerm)
  assert(new Set(normalizedTerms).size === normalizedTerms.length, 'VM-01 normalized lookup terms are not unique.')

  const parsedById = new Map(parsed.definitions.map((definition) => [definition.definitionId, definition]))
  const indexById = new Map(definitionIndex.definitions.map((definition) => [definition.definitionId, definition]))
  for (const chunk of sourcePackage.chunks) {
    const definition = parsedById.get(chunk.chunkId)
    const indexEntry = indexById.get(chunk.chunkId)
    assert(definition && indexEntry, `VM-01 definition lookup missing for ${chunk.chunkId}.`)
    assert(chunk.chunkKind === 'definition' && chunk.sourceTextType === 'actual_extracted_source_text' && chunk.fidelity === 'exact', `VM-01 exact definition evidence metadata mismatch: ${chunk.chunkId}.`)
    assert(chunk.sourceTextExcerpt === definition.sourceText && indexEntry.formalDefinitionSourceText === definition.sourceText, `VM-01 source evidence changed or diverged: ${chunk.chunkId}.`)
    assert(indexEntry.sourceTextSha256 === sha256(chunk.sourceTextExcerpt), `VM-01 source evidence hash mismatch: ${chunk.chunkId}.`)
    assert(chunk.pageStart === definition.pageStart && chunk.pageEnd === definition.pageEnd && chunk.pageStart >= 25 && chunk.pageEnd <= 37, `VM-01 citation page range mismatch: ${chunk.chunkId}.`)
    assert(Array.isArray(chunk.citations) && chunk.citations.length === 1 && chunk.citations[0].sectionReference === 'VM-01: Definitions for Terms in Requirements', `VM-01 citation missing or invalid: ${chunk.chunkId}.`)
    assert(chunk.retrievalEligible === true && chunk.promotionEligible === false, `VM-01 retrieval/promotion boundary mismatch: ${chunk.chunkId}.`)
    assert(!chunk.chunkLevel && !chunk.parentChunkId && !chunk.childChunkIds, `VM-01 short-definition model unexpectedly introduced hierarchy: ${chunk.chunkId}.`)
    assert(indexEntry.exactDefinedTerm === definition.exactDefinedTerm && indexEntry.extractedDefinedTerm === definition.extractedDefinedTerm && indexEntry.normalizedLookupTerm === definition.normalizedLookupTerm, `VM-01 defined-term metadata mismatch: ${chunk.chunkId}.`)
    assert(JSON.stringify(indexEntry.aliases) === JSON.stringify(definition.aliases) && JSON.stringify(indexEntry.acronymExpansions) === JSON.stringify(definition.acronymExpansions), `VM-01 alias/acronym integrity mismatch: ${chunk.chunkId}.`)

    // Blocker 1 Regression: definedTerms must be strictly source-explicit
    const expectedDefinedTerms = [...new Set([definition.exactDefinedTerm, ...definition.aliases])]
    assert(
      JSON.stringify(chunk.definedTerms) === JSON.stringify(expectedDefinedTerms),
      `VM-01 definedTerms must contain only formal source term and source-explicit aliases: ${chunk.chunkId}. Found ${JSON.stringify(chunk.definedTerms)}, expected ${JSON.stringify(expectedDefinedTerms)}.`,
    )
    assert(chunk.definedTerms[0] === definition.exactDefinedTerm, `VM-01 chunk.definedTerms[0] must equal exactDefinedTerm: ${chunk.chunkId}.`)
    for (const term of chunk.definedTerms) {
      assert(term === definition.exactDefinedTerm || definition.aliases.includes(term), `Non-authoritative or generated term found in definedTerms: ${term} in ${chunk.chunkId}.`)
    }
    // Verify normalized lookup forms reside only in non-authoritative metadata (keywords / normalizedSearchText / index)
    assert(chunk.keywords.includes(definition.normalizedLookupTerm), `Normalized lookup term missing from non-authoritative keywords metadata: ${chunk.chunkId}.`)
    assert(chunk.normalizedSearchText.includes(definition.normalizedLookupTerm), `Normalized lookup term missing from non-authoritative normalizedSearchText metadata: ${chunk.chunkId}.`)
    if (definition.normalizedLookupTerm !== definition.exactDefinedTerm && !definition.aliases.includes(definition.normalizedLookupTerm)) {
      assert(!chunk.definedTerms.includes(definition.normalizedLookupTerm), `Generated normalizedLookupTerm leaked into definedTerms: ${definition.normalizedLookupTerm} in ${chunk.chunkId}.`)
    }
  }

  // Explicit regression checks for representative examples identified by review
  const representativeChecks = [
    { id: 'vm01-definition-008-asset-associated-derivative', exact: 'asset-associated derivative', forbidden: 'asset associated derivative' },
    { id: 'vm01-definition-010-cash-flow-model', exact: 'cash-flow model', forbidden: 'cash flow model' },
    { id: 'vm01-definition-019-deposit-type-contract', exact: 'deposit-type contract', forbidden: 'deposit type contract' },
    { id: 'vm01-definition-026-equity-like-instruments', exact: 'equity-like instruments', forbidden: 'equity like instruments' },
    { id: 'vm01-definition-030-guaranteed-investment-contract', exact: 'guaranteed investment contract (GIC)', aliases: ['GIC'], forbidden: 'guaranteed investment contract' },
    { id: 'vm01-definition-031-guaranteed-issue-gi-life-insurance-policy', exact: 'guaranteed issue (GI) life insurance policy', aliases: ['GI'], forbidden: 'guaranteed issue life insurance policy' },
    { id: 'vm01-definition-041-index-linked-variable-annuity', exact: 'index-linked variable annuity', aliases: ['ILVA'], forbidden: 'index linked variable annuity' },
    { id: 'vm01-definition-042-indexed-universal-life-iul-insurance-policy', exact: 'indexed universal life (IUL) insurance policy', aliases: ['IUL'], forbidden: 'indexed universal life insurance policy' },
    { id: 'vm01-definition-057-non-guaranteed-elements', exact: 'non-guaranteed elements', aliases: ['NGE'], forbidden: 'non guaranteed elements' },
    { id: 'vm01-definition-058-non-material-secondary-guarantee', exact: 'non-material secondary guarantee', forbidden: 'non material secondary guarantee' },
    { id: 'vm01-definition-067-principle-based-reserve-actuarial-report', exact: 'Principle-Based Reserve Actuarial Report', aliases: ['PBR Actuarial Report'], forbidden: 'principle based reserve actuarial report' },
    { id: 'vm01-definition-068-principle-based-valuation', exact: 'principle-based valuation', forbidden: 'principle based valuation' },
    { id: 'vm01-definition-098-vm-20-reserving-category', exact: 'VM-20 reserving category', forbidden: 'vm 20 reserving category' },
  ]
  for (const check of representativeChecks) {
    const chunk = sourcePackage.chunks.find((c) => c.chunkId === check.id)
    assert(chunk, `Representative check chunk not found: ${check.id}`)
    assert(chunk.definedTerms.includes(check.exact), `chunk.definedTerms missing exact term ${check.exact} for ${check.id}`)
    assert(!chunk.definedTerms.includes(check.forbidden), `chunk.definedTerms contains forbidden generated form ${check.forbidden} for ${check.id}`)
    if (check.aliases) {
      for (const alias of check.aliases) {
        assert(chunk.definedTerms.includes(alias), `chunk.definedTerms missing explicit alias ${alias} for ${check.id}`)
      }
    }
  }

  const totalDefinedTermsCount = sourcePackage.chunks.reduce((sum, chunk) => sum + chunk.definedTerms.length, 0)
  assert(totalDefinedTermsCount === 125, `Total definedTerms count across 98 chunks must be exactly 125 (98 formal exact terms + 27 explicit aliases). Found ${totalDefinedTermsCount}.`)
  assert(parsed.definitions.reduce((sum, definition) => sum + definition.aliases.length, 0) === 27, 'VM-01 source-explicit alias count changed unexpectedly.')

  const aggregateHash = sha256(definitionIndex.definitions.map((entry) => entry.formalDefinitionSourceText).join('\n\n'))
  assert(aggregateHash === VM01_SOURCE_EVIDENCE_AGGREGATE_SHA256, 'VM-01 authoritative definition aggregate hash changed from the independently reviewed baseline.')
  assert(sourceQa.status === 'pass' && sourceQa.checks.definitionsWithSourceEvidence === 98 && sourceQa.checks.definitionsWithValidCitations === 98, 'VM-01 source QA did not pass all evidence/citation checks.')
  assert(sourceQa.checks.uniqueDefinitionIds === 98 && sourceQa.checks.uniqueNormalizedTerms === 98 && sourceQa.checks.sourceEvidenceAggregateSha256 === aggregateHash, 'VM-01 source QA uniqueness or aggregate hash mismatch.')
  assert(sourceQa.checks.sourceExplicitDefinedTermEntries === 125 && sourceQa.checks.generatedDefinedTermEntries === 0, 'VM-01 source QA does not confirm a source-explicit definedTerms boundary.')
  assert(sourceQa.checks.retrievalOnlyNormalizedVariants === 17 && sourceQa.checks.substantiveNormalizedVariants === 13 && sourceQa.checks.caseOnlyNormalizedVariants === 4, 'VM-01 normalized lookup-variant inventory changed unexpectedly.')
  assert(sourceQa.checks.termExtractionSpacingCorrections === 11, 'VM-01 term extraction correction inventory changed unexpectedly.')

  assert(relationships.relationshipCount === relationships.candidates.length && relationships.relationshipCount === 29, 'VM-01 relationship candidate count mismatch.')
  const relationshipIds = relationships.candidates.map((candidate) => candidate.relationshipId)
  assert(new Set(relationshipIds).size === relationshipIds.length, 'VM-01 relationship IDs are not unique.')
  const definitionIds = new Set(definitionIndex.definitions.map((entry) => entry.definitionId))
  for (const candidate of relationships.candidates) {
    assert(definitionIds.has(candidate.sourceDefinitionId), `VM-01 relationship source target does not resolve: ${candidate.relationshipId}.`)
    assert(candidate.relationType === 'references' && candidate.evidenceBasis === 'explicit_source_text_reference', `VM-01 relationship exceeds the approved conservative vocabulary: ${candidate.relationshipId}.`)
    assert(candidate.reviewDecision === 'pending' && candidate.promotionStatus === 'not_promoted' && candidate.promotionEligible === false, `VM-01 relationship governance mismatch: ${candidate.relationshipId}.`)
    assert(candidate.evidence.sourceSha256 === VM01_SOURCE_SHA256 && candidate.evidence.sourceTextSha256 === indexById.get(candidate.sourceDefinitionId).sourceTextSha256, `VM-01 relationship evidence mismatch: ${candidate.relationshipId}.`)
  }

  assert(retrieval.artifactPurpose === 'case_level_independent_review', 'VM-01 focused retrieval artifact is not marked for case-level independent review.')
  assert(retrieval.queryCount === 21 && retrieval.supportedQueryCount === 18 && retrieval.unsupportedQueryCount === 3, 'VM-01 focused retrieval battery size changed unexpectedly.')
  assert(retrieval.top1HitCount >= 17 && retrieval.top3HitCount === 18 && retrieval.currentAuthorityTop1Count === 18, 'VM-01 focused retrieval did not preserve authoritative top-ranked evidence.')
  assert(retrieval.unsupportedCorrectCount === 3 && retrieval.unsupportedQueryPrecision === 1, 'VM-01 unsupported formal-definition behavior did not abstain safely.')
  const requiredFocusedQueryIds = ['vm01-acronym-dr', 'vm01-acronym-sr', 'vm01-acronym-npr', 'vm01-acronym-gic', 'vm01-acronym-iul', 'vm01-cross-page-cdhs', 'vm01-undefined-deterministic-exclusion-test', 'vm01-ambiguous-reserve', 'vm01-proposed-2027-version']
  assert(requiredFocusedQueryIds.every((queryId) => retrieval.queries.some((query) => query.queryId === queryId)), 'VM-01 focused retrieval artifact is missing required blocker-review cases.')
  for (const query of retrieval.queries) {
    assert(['supported', 'unsupported'].includes(query.intendedSupportState), `VM-01 focused query is missing intended support state: ${query.queryId}.`)
    assert(query.expectedEvidence && Array.isArray(query.expectedEvidence.informationTypes), `VM-01 focused query is missing inspectable expected evidence: ${query.queryId}.`)
    assert(Array.isArray(query.actualTop3) && query.actualTop3.length <= 3, `VM-01 focused query is missing inspectable actual top-3 evidence: ${query.queryId}.`)
    assert((query.actualTop1?.chunkId ?? null) === (query.actualTop3[0]?.chunkId ?? null), `VM-01 focused query top-1/top-3 projection is inconsistent: ${query.queryId}.`)
    assert(query.actualSourceFamilyId === (query.predictedSourceFamilyId ?? null) && query.actualAuthorityLevel === (query.predictedAuthorityLevel ?? null), `VM-01 focused query authority projection is inconsistent: ${query.queryId}.`)
    assert(query.failureReason === null || typeof query.failureReason === 'string', `VM-01 focused query failure reason is not inspectable: ${query.queryId}.`)
    const expectedChunkIds = new Set(query.expectedChunkIds ?? [])
    const recomputedTop1Hit = query.expectedOutcome !== 'unsupported' && Boolean(query.actualTop1 && expectedChunkIds.has(query.actualTop1.chunkId))
    const recomputedTop3Hit = query.expectedOutcome !== 'unsupported' && query.actualTop3.some((match) => expectedChunkIds.has(match.chunkId))
    assert(query.top1Hit === recomputedTop1Hit, `VM-01 focused query top1Hit is inconsistent with actualTop1: ${query.queryId}.`)
    assert(query.top3Hit === recomputedTop3Hit, `VM-01 focused query top3Hit is inconsistent with the strict actualTop3 window: ${query.queryId}.`)
  }
  const supportedFocusedQueries = retrieval.queries.filter((query) => query.expectedOutcome !== 'unsupported')
  assert(retrieval.top1HitCount === supportedFocusedQueries.filter((query) => query.top1Hit).length, 'VM-01 aggregate top1HitCount is inconsistent with case-level results.')
  assert(retrieval.top3HitCount === supportedFocusedQueries.filter((query) => query.top3Hit).length, 'VM-01 aggregate top3HitCount is inconsistent with strict case-level top-3 results.')
  const plainLanguageCase = retrieval.queries.find((query) => query.queryId === 'vm01-plain-language-tail-measure')
  assert(plainLanguageCase.top3Hit && plainLanguageCase.actualTop3.some((match) => match.chunkId === 'vm01-definition-016-conditional-tail-expectation'), 'VM-01 plain-language CTE evidence is not inside the strict top-3 evidence window.')
  assert(plainLanguageCase.supportDecision.evidenceSufficient === true && plainLanguageCase.supportDecision.relatedEvidence.some((match) => match.chunkId === 'vm01-definition-016-conditional-tail-expectation'), 'VM-01 plain-language CTE support decision is not grounded in the strict top-3 evidence window.')
  const crossPageCase = retrieval.queries.find((query) => query.queryId === 'vm01-cross-page-cdhs')
  const crossPageEntry = indexById.get(crossPageCase.expectedChunkIds[0])
  assert(crossPageEntry.sourceEvidence.pageStart < crossPageEntry.sourceEvidence.pageEnd && crossPageCase.top3Hit, 'VM-01 cross-page definition retrieval case did not preserve complete evidence.')
  const ambiguousCase = retrieval.queries.find((query) => query.queryId === 'vm01-ambiguous-reserve')
  assert(ambiguousCase.ambiguityResult?.safelyAbstained === true && ambiguousCase.ambiguityResult.reasonCode === 'term_not_defined_in_vm01', 'VM-01 ambiguous-term result is missing or unsafe.')
  for (const query of retrieval.queries.filter((query) => query.expectedOutcome === 'unsupported')) {
    assert(query.supportDecision.supportState === 'unsupported' && ['term_not_defined_in_vm01', 'missing_requested_source_version'].includes(query.supportDecision.reasonCode), `VM-01 unsupported query did not use the generic support gate: ${query.queryId}.`)
  }
  const globalVm01Queries = globalRetrieval.queries.filter((query) => query.queryId.startsWith('q-vm01-'))
  assert(globalVm01Queries.length === 6, 'Global source-index retrieval is missing VM-01 regression queries.')
  assert(globalVm01Queries.filter((query) => query.expectedOutcome !== 'unsupported').every((query) => query.resultLabel === 'supported_top1' && query.rankedMatches[0]?.sourceId === 'vm01-definitions'), 'Global source-index retrieval does not rank current VM-01 definitions first.')
  assert(globalVm01Queries.filter((query) => query.expectedOutcome === 'unsupported').every((query) => query.resultLabel === 'unsupported' && query.supportDecision.supportState === 'unsupported'), 'Global source-index unsupported VM-01 queries did not abstain.')

  assert(reviewPackage.status === 'review_ready_not_promoted' && reviewPackage.promoted === false, 'VM-01 review package promotion status mismatch.')
  assert(reviewPackage.promotionReadiness.independentReviewRequired === true && reviewPackage.promotionReadiness.automatedPromotion === false && reviewPackage.promotionReadiness.blockersClosed === true && reviewPackage.promotionReadiness.copilotExportEligible === false, 'VM-01 review package governance gate mismatch.')
  assert(reviewPackage.blockerCorrections?.length === 2 && reviewPackage.blockerCorrections.every((blocker) => blocker.status === 'resolved_pending_narrow_review'), 'VM-01 review package does not record both targeted blocker corrections.')
  assert(reviewPackage.artifacts.retrievalEvaluation === 'data/processed/review_packages/vm01-definition-retrieval-evaluation.json' && reviewPackage.retrievalEvaluation.caseLevelResultsIncluded === true, 'VM-01 focused retrieval artifact is not included in the review package.')
  assert(reviewPackage.retrievalEvaluation.sha256 === await hashFile(retrievalPath), 'VM-01 focused retrieval artifact hash does not match the review package.')

  const report = {
    schemaVersion: '1.0', reportId: 'vm01-definitions-validation-2026', status: 'pass',
    sourceIdentity: { sourceSha256: VM01_SOURCE_SHA256, locallyVerifiedSha256: actualSourcePdfSha256, hashConfirmationPath: 'data/processed/review_packages/vm01-source-pdf-hash-confirmation.json', sourceEditionId: sourcePackage.source.sourceEditionId, pageRange: sourcePackage.source.pageRange },
    authoritativeEvidenceChangeCounts: { sourceTextExcerpt: 0, formalDefinitionSourceText: 0, sourceTextSha256: 0, sourcePages: 0, aggregateSourceEvidenceSha256: aggregateHash },
    definedTermsBoundary: { beforeEntryCount: 142, afterEntryCount: totalDefinedTermsCount, generatedEntriesRemoved: 17, formalTermEntries: 98, sourceExplicitAliasEntries: 27, generatedEntriesRemaining: 0, retrievalOnlyNormalizedVariantsRetained: 17 },
    checks: { definitions: 98, retrievalUnits: 98, uniqueDefinitionIds: 98, uniqueNormalizedTerms: 98, validSourceEvidence: 98, validCitations: 98, termExtractionCorrections: 11, relationshipCandidates: 29, focusedRetrievalQueries: retrieval.queryCount, focusedSupportedQueries: retrieval.supportedQueryCount, focusedSupportedTop1: retrieval.top1HitCount, focusedSupportedTop3: retrieval.top3HitCount, unsupportedQueriesSafelyAbstained: retrieval.unsupportedCorrectCount, ambiguousQueriesSafelyAbstained: ambiguousCase.ambiguityResult.safelyAbstained ? 1 : 0, currentAuthorityTop1: retrieval.currentAuthorityTop1Count, caseLevelRetrievalArtifactSha256: await hashFile(retrievalPath), globalVm01RegressionQueries: 6, globalSupportedTop1: globalVm01Queries.filter((query) => query.expectedOutcome !== 'unsupported' && query.resultLabel === 'supported_top1').length, globalUnsupportedAbstained: globalVm01Queries.filter((query) => query.expectedOutcome === 'unsupported' && query.resultLabel === 'unsupported').length },
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
  }
  await fs.writeFile(validationPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  await fs.writeFile(validationPath.replace(/\.json$/, '.md'), [
    '# VM-01 definitions validation report', '', '- Result: **PASS**', `- Source SHA-256: \`${VM01_SOURCE_SHA256}\``, `- Authoritative source-evidence aggregate SHA-256: \`${aggregateHash}\``, '- Authoritative source-text changes: 0', '- Definitions / retrieval units: 98 / 98', '- Unique IDs / normalized terms: 98 / 98', '- Valid exact evidence / citations: 98 / 98', `- \`definedTerms\` entries before / after: 142 / ${totalDefinedTermsCount}; generated entries remaining: 0`, `- Focused supported top-1 / top-3: ${retrieval.top1HitCount}/${retrieval.supportedQueryCount} / ${retrieval.top3HitCount}/${retrieval.supportedQueryCount}`, `- Unsupported formal-definition abstentions: ${retrieval.unsupportedCorrectCount} / ${retrieval.unsupportedQueryCount}`, '- Ambiguous-term abstention: 1 / 1', `- Current VM-01 authority top-1: ${retrieval.currentAuthorityTop1Count} / ${retrieval.supportedQueryCount}`, '- Relationship candidates: 29; all pending and not promoted', '- Governance: canonical review candidate; review-only / not promoted / downstream export blocked', '',
  ].join('\n'), 'utf8')
  console.log(`Validated 98 VM-01 definitions, 29 relationship candidates, and ${retrieval.queryCount} focused retrieval queries.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
