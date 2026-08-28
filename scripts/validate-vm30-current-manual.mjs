import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildVm30Chunks, loadVm30Chapter, segmentVm30Chapter, VM30_CHILD_COUNT, VM30_CHUNK_COUNT, VM30_PAGE_RANGE, VM30_PARENT_COUNT, VM30_SOURCE_SHA256 } from './lib/vm30-current-manual.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const sourceRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources')
const sourcePackagePath = path.join(sourceRoot, 'vm30-current-manual.json')
const reviewRoot = path.join(repoRoot, 'data', 'processed', 'review_packages')
const sourceQaPath = path.join(reviewRoot, 'vm30-source-qa.json')
const retrievalPath = path.join(reviewRoot, 'vm30-focused-retrieval-evaluation.json')
const supportGatePath = path.join(reviewRoot, 'vm30-support-gate-regression.json')
const reviewPackagePath = path.join(reviewRoot, 'vm30-canonical-coverage-review-package.json')
const relationshipPath = path.join(repoRoot, 'data', 'processed', 'relationship_registries', 'vm30-current-manual-relationship-candidates.json')
const validationPath = path.join(reviewRoot, 'vm30-validation-report.json')
const repositoryManifestPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'repository-manifest.json')
const structuredTablesPath = path.join(repoRoot, 'data', 'processed', 'structured_tables', 'vm20-appendix2-tables.json')

const VM30_SOURCE_TEXT_AGGREGATE_SHA256 = '27c7cc7eaa7c47152329e25dc65faff043a6a5ea4748cb04044ece440e007da1'
const VM31_SOURCE_TEXT_AGGREGATE_SHA256 = 'f87b9b995e3c7065365e3f7e035ba20e2779d377d08b79d9d00ccfa7bdc6f5fc'
const VM01_SOURCE_TEXT_AGGREGATE_SHA256 = '04fecfc622ee792dca2f994f3d7eb6ebf510bd533bd7be9798b4604a70b8ef98'
const VM20_PROMOTED_SOURCE_TEXT_AGGREGATE_SHA256 = 'c32c9a1e976a0635707af9b82e3847152b4611257147d12f14f29c4a5b1274c6'
const VM20_STRUCTURED_TABLE_FILE_SHA256 = '2b86d0929da8f8dfc85f9d3a123311166d136283ed33afeca5ded4c32f0d0f3f'
const vm20PromotedSourceIds = ['vm20-section3c-hierarchical', 'vm20-framework-overview', 'vm20-framework-boundary', 'vm20-assumptions-section-3c', 'vm20-canonical-coverage', 'vm20-remaining-prose-appendix-coverage']

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const hashFile = async (filePath) => sha256(await fs.readFile(filePath))
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const normalizeSourceLabel = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '')
const sourceTextAggregate = (sourcePackage) => sha256(sourcePackage.chunks.map((chunk) => chunk.sourceTextExcerpt).join('\n\n'))

const main = async () => {
  const [config, sourcePackage, sourceQa, retrieval, supportGate, reviewPackage, relationships, repositoryManifest] = await Promise.all([
    readJson(configPath), readJson(sourcePackagePath), readJson(sourceQaPath), readJson(retrievalPath), readJson(supportGatePath), readJson(reviewPackagePath), readJson(relationshipPath), readJson(repositoryManifestPath),
  ])
  const sourceConfig = config.sources.find((source) => source.sourceId === 'vm30-current-manual')
  assert(sourceConfig, 'VM-30 source configuration is missing.')
  const { chapterText, aggregateExtractionSha256 } = await loadVm30Chapter(repoRoot, sourceConfig.vm30Input)
  const structure = segmentVm30Chapter(chapterText)
  const expectedChunks = await buildVm30Chunks(repoRoot, sourceConfig)

  assert(sourcePackage.source.sourceSha256 === VM30_SOURCE_SHA256 && sourcePackage.source.sourceEditionId === 'NAIC-VALUATION-MANUAL-2026' && sourcePackage.source.sourceVersionIdentifier === '2026 NAIC Valuation Manual', 'VM-30 authoritative source identity mismatch.')
  assert(sourcePackage.source.pageRange.start === VM30_PAGE_RANGE.start && sourcePackage.source.pageRange.end === VM30_PAGE_RANGE.end, 'VM-30 source page boundary mismatch.')
  const actualPdfHash = await hashFile(sourcePackage.source.filePath)
  assert(actualPdfHash === VM30_SOURCE_SHA256, 'VM-30 local authoritative PDF hash mismatch.')
  assert(sourcePackage.processing.canonicality === 'canonical' && sourcePackage.processing.reviewOnly === true && sourcePackage.processing.promotionStatus === 'not_promoted', 'VM-30 must remain a review-only canonical candidate.')
  assert(sourcePackage.processing.learnerFacingAllowed === false && sourcePackage.processing.appReadyAllowed === false && sourcePackage.processing.ragReadyAllowed === false && sourcePackage.exportHints.vectorEligible === false, 'VM-30 downstream eligibility boundary is not closed.')

  assert(sourcePackage.chunks.length === VM30_CHUNK_COUNT && expectedChunks.length === VM30_CHUNK_COUNT, 'VM-30 total chunk count mismatch.')
  const parents = sourcePackage.chunks.filter((chunk) => chunk.chunkLevel === 'parent')
  const children = sourcePackage.chunks.filter((chunk) => chunk.chunkLevel === 'child')
  assert(parents.length === VM30_PARENT_COUNT && children.length === VM30_CHILD_COUNT, 'VM-30 parent/child count mismatch.')
  assert(sourcePackage.chunks.filter((chunk) => chunk.retrievalEligible).length === 42, 'VM-30 first-stage retrieval-unit count mismatch.')
  assert(sourcePackage.chunks.every((chunk) => chunk.sourceTextType === 'actual_extracted_source_text' && chunk.fidelity === 'exact' && chunk.promotionEligible === false), 'VM-30 source fidelity or promotion boundary mismatch.')
  assert(sourceTextAggregate(sourcePackage) === VM30_SOURCE_TEXT_AGGREGATE_SHA256, 'VM-30 authoritative source-text aggregate changed.')
  assert(sourcePackage.chunks.some((chunk) => chunk.pageStart === 339 && chunk.chunkKind === 'boundary_slice' && /intentionally left blank/i.test(chunk.sourceTextExcerpt)), 'VM-30 printed closing blank page is missing.')
  assert(!sourcePackage.chunks.some((chunk) => /\[p\.\s*340\]|VM\s*-\s*31|PBR Actuarial Report Requirements/i.test(chunk.sourceTextExcerpt)), 'VM-30 package crosses the established chapter boundary.')

  for (let index = 0; index < expectedChunks.length; index += 1) {
    const expected = expectedChunks[index]
    const actual = sourcePackage.chunks[index]
    assert(actual.chunkId === expected.chunkId && actual.chunkOrdinal === expected.chunkOrdinal, `VM-30 chunk identity/order mismatch at ordinal ${index + 1}.`)
    assert(actual.sourceTextExcerpt === expected.sourceTextExcerpt && actual.pageStart === expected.pageStart && actual.pageEnd === expected.pageEnd, `VM-30 authoritative source segment mismatch: ${actual.chunkId}.`)
    assert(actual.parentChunkId === expected.parentChunkId && JSON.stringify(actual.childChunkIds) === JSON.stringify(expected.childChunkIds), `VM-30 hierarchy mismatch: ${actual.chunkId}.`)
    assert(actual.precedingChunkId === expected.precedingChunkId && actual.followingChunkId === expected.followingChunkId, `VM-30 adjacency mismatch: ${actual.chunkId}.`)
    assert(JSON.stringify(actual.definedTerms) === JSON.stringify(expected.definedTerms), `VM-30 source-defined term metadata mismatch: ${actual.chunkId}.`)
    assert(actual.citations.length === 1 && actual.citations[0].sourceReference === '2026 NAIC Valuation Manual' && actual.citations[0].sectionReference === actual.sectionReference && actual.citations[0].pageReference.includes(`PDF pp. ${actual.pageStart}-${actual.pageEnd}`) && actual.citations[0].pageReference.includes(`printed VM-30 pp. 30-${actual.pageStart - 324} to 30-${actual.pageEnd - 324}`), `VM-30 physical/printed page citation mismatch: ${actual.chunkId}.`)
  }
  const ids = new Set(sourcePackage.chunks.map((chunk) => chunk.chunkId))
  assert(ids.size === VM30_CHUNK_COUNT, 'VM-30 chunk IDs are not unique.')
  for (const parent of parents) assert(parent.childChunkIds.length > 0 && parent.childChunkIds.every((childId) => ids.has(childId)), `VM-30 parent has missing children: ${parent.chunkId}.`)
  for (const child of children) assert(ids.has(child.parentChunkId), `VM-30 child is orphaned: ${child.chunkId}.`)

  const definedTermEntries = children.flatMap((chunk) => chunk.definedTerms.map((term) => ({ chunkId: chunk.chunkId, term })))
  assert(JSON.stringify(definedTermEntries.map((entry) => entry.term)) === JSON.stringify(['adverse opinion', 'qualified opinion', 'inconclusive opinion']), 'VM-30 must expose only its three source-explicit opinion definitions.')
  assert(definedTermEntries.every((entry) => normalizeSourceLabel(sourcePackage.chunks.find((chunk) => chunk.chunkId === entry.chunkId).sourceTextExcerpt).includes(normalizeSourceLabel(`term ${entry.term} means`))), 'A VM-30 defined term is not explicit in its retained source provision.')
  assert(!sourcePackage.chunks.some((chunk) => chunk.definedTerms.some((term) => normalizeSourceLabel(term) === 'appointedactuary')), 'VM-01 appointed-actuary terminology must not be duplicated as a VM-30 definition.')
  const targetedMetadata = new Map([
    ['vm30-section-1-a-general-1-aom-requirement-scope', ['scope_or_applicability', 'actuarial_opinion_requirement', 'actuarial_memorandum_requirement', 'cross_reference']],
    ['vm30-section-1-a-general-5-company-level-opinion', ['scope_or_applicability', 'actuarial_opinion_requirement']],
    ['vm30-section-1-b-definitions-1-adverse-opinion', ['definition_or_terminology', 'exception_or_exemption']],
    ['vm30-section-1-b-definitions-2-qualified-opinion', ['definition_or_terminology', 'exception_or_exemption', 'required_statement_or_disclosure']],
    ['vm30-section-1-b-definitions-3-inconclusive-opinion', ['definition_or_terminology', 'required_statement_or_disclosure']],
  ])
  for (const [chunkId, expectedTypes] of targetedMetadata) {
    const chunk = sourcePackage.chunks.find((candidate) => candidate.chunkId === chunkId)
    assert(chunk && JSON.stringify(chunk.provisionTypes) === JSON.stringify(expectedTypes), `VM-30 targeted provision classifications regressed: ${chunkId}.`)
    assert(JSON.stringify(chunk.concepts) === JSON.stringify(expectedTypes), `VM-30 targeted concepts do not mirror the narrow classifications: ${chunkId}.`)
    assert(JSON.stringify(chunk.controlledTags.slice(3)) === JSON.stringify(expectedTypes), `VM-30 targeted controlled tags do not mirror the narrow classifications: ${chunkId}.`)
    const expectedRequirements = chunkId.includes('section-1-b-definitions') ? [] : expectedTypes
    assert(JSON.stringify(chunk.requirements) === JSON.stringify(expectedRequirements), `VM-30 targeted requirements are over- or under-classified: ${chunkId}.`)
  }
  assert(children.filter((chunk) => chunk.provisionTypes.includes('actuarial_opinion_requirement')).length >= 17, 'VM-30 actuarial-opinion classification coverage is unexpectedly low.')
  assert(children.filter((chunk) => chunk.provisionTypes.includes('actuarial_memorandum_requirement')).length >= 14, 'VM-30 actuarial-memorandum classification coverage is unexpectedly low.')

  assert(sourceQa.status === 'pass' && sourceQa.authoritativeSource.sourceSha256 === VM30_SOURCE_SHA256 && sourceQa.extraction.aggregateExtractionSha256 === aggregateExtractionSha256, 'VM-30 source QA identity or extraction hash mismatch.')
  assert(sourceQa.hierarchy.parentCount === VM30_PARENT_COUNT && sourceQa.hierarchy.childCount === VM30_CHILD_COUNT && sourceQa.sourceFidelity.exactChunkCount === VM30_CHUNK_COUNT && sourceQa.sourceFidelity.sourceTextRewriteCount === 0, 'VM-30 source QA hierarchy or fidelity mismatch.')
  assert(sourceQa.extraction.visualReview.pagesRenderedAndReviewed === '324-341' && sourceQa.extraction.visualReview.unnumberedBlankSeparator === 340 && sourceQa.extraction.visualReview.followingChapter === 'VM-31', 'VM-30 visual boundary QA is incomplete.')
  assert(sourceQa.sectionCoverage.length === VM30_PARENT_COUNT && sourceQa.sectionCoverage.every((section) => section.canonicalized === true && section.childCount === section.childChunkIds.length && section.childChunkIds.every((chunkId) => ids.has(chunkId)) && Array.isArray(section.requirementTypes) && Array.isArray(section.crossReferences) && section.unresolvedSourceQuestions.length === 0), 'VM-30 section coverage matrix is incomplete.')
  assert(sourceQa.contentAreaAudit.length === 14 && sourceQa.contentAreaAudit.every((area) => area.status === 'covered' && ids.has(area.representativeChunkId)), 'VM-30 content-area audit is incomplete.')
  assert(structure.length === VM30_PARENT_COUNT && sourceQa.definedTermsAudit.sourceExplicitTermCount === 3 && sourceQa.definedTermsAudit.duplicatedVm01Terms === 0, 'VM-30 structural or definition QA mismatch.')

  assert(relationships.relationshipCount === 16 && relationships.candidates.length === 16 && JSON.stringify(relationships.relationTypes) === JSON.stringify(['references']), 'VM-30 relationship-candidate count or vocabulary mismatch.')
  const relationshipIds = new Set()
  const chunkById = new Map(sourcePackage.chunks.map((chunk) => [chunk.chunkId, chunk]))
  for (const candidate of relationships.candidates) {
    assert(!relationshipIds.has(candidate.relationshipId), `Duplicate VM-30 relationship ID: ${candidate.relationshipId}.`)
    relationshipIds.add(candidate.relationshipId)
    const sourceChunk = chunkById.get(candidate.sourceChunkId)
    assert(sourceChunk && (sourceChunk.crossReferenceCandidates ?? []).includes(candidate.targetLabel), `VM-30 relationship lacks explicit source-reference metadata: ${candidate.relationshipId}.`)
    assert(normalizeSourceLabel(sourceChunk.sourceTextExcerpt).includes(normalizeSourceLabel(candidate.targetLabel)), `VM-30 relationship label is not present in retained source text: ${candidate.relationshipId}.`)
    assert(candidate.evidence.sourceSha256 === VM30_SOURCE_SHA256 && candidate.evidence.sourceTextSha256 === sha256(sourceChunk.sourceTextExcerpt), `VM-30 relationship evidence hash mismatch: ${candidate.relationshipId}.`)
    assert(candidate.reviewDecision === 'pending' && candidate.promotionStatus === 'not_promoted' && candidate.promotionEligible === false, `VM-30 relationship governance mismatch: ${candidate.relationshipId}.`)
  }

  assert(retrieval.queryCount === 21 && retrieval.supportedQueryCount === 16 && retrieval.supportedTop1Count === 15 && retrieval.supportedTop3Count === 16, 'VM-30 focused supported retrieval metrics changed unexpectedly.')
  assert(retrieval.unsupportedCorrectCount === 4 && retrieval.unsupportedQueryCount === 4 && retrieval.ambiguitySafeCount === 1 && retrieval.ambiguityQueryCount === 1 && retrieval.currentAuthoritativeVm30Top1Count === 16 && retrieval.sourceFamilyAccuracyCount === 16 && retrieval.authorityLevelAccuracyCount === 16 && retrieval.allCasesPassed === true, 'VM-30 unsupported, ambiguity, or authority metrics failed.')
  for (const testCase of retrieval.queries) {
    assert(testCase.actualTop3.length <= 3 && (testCase.actualTop1?.chunkId ?? null) === (testCase.actualTop3[0]?.chunkId ?? null), `VM-30 top-one/top-three projection mismatch: ${testCase.queryId}.`)
    if (testCase.intendedSupportState === 'supported') {
      const expectedIds = new Set(testCase.expectedChunkIds)
      assert(testCase.top1Hit === expectedIds.has(testCase.actualTop1?.chunkId), `VM-30 top1Hit mismatch: ${testCase.queryId}.`)
      assert(testCase.top3Hit === testCase.actualTop3.some((match) => expectedIds.has(match.chunkId)), `VM-30 strict top3Hit mismatch: ${testCase.queryId}.`)
      assert(testCase.supportDecision.supportState === 'supported' && testCase.authorityResult.currentAuthoritativeVm30Top1 === true, `VM-30 supported case lacks current authoritative evidence: ${testCase.queryId}.`)
    } else if (testCase.intendedSupportState === 'unsupported') {
      assert(testCase.supportDecision.supportState === 'unsupported' && testCase.supportDecision.evidenceSufficient === false, `VM-30 unsupported case did not abstain: ${testCase.queryId}.`)
    } else assert(testCase.supportDecision.supportState === 'ambiguous_requires_more_context' && testCase.ambiguityResult.safelyAbstained === true, `VM-30 ambiguous case was not handled safely: ${testCase.queryId}.`)
    assert(testCase.passed && testCase.failureReason === null, `VM-30 focused case failed: ${testCase.queryId}.`)
  }
  assert(supportGate.status === 'pass' && supportGate.productionEvidenceWindow === 3 && supportGate.caseCount === 4 && supportGate.passedCaseCount === 4 && supportGate.cases.length === 4, 'VM-30 formal-requirement support-gate regression summary failed.')
  assert(supportGate.fixtureSources.some((fixture) => fixture.sourceId === 'vm20-canonical-coverage') && !supportGate.fixtureSources.some((fixture) => fixture.sourceId === 'vm31-current-manual'), 'VM-30 support-gate fixture must use actual VM-20 evidence and must not substitute VM-31.')
  for (const testCase of supportGate.cases) {
    assert(testCase.productionEvidenceWindowSize === 3 && Array.isArray(testCase.fullRanking) && Array.isArray(testCase.productionWindowEvidence), `VM-30 support-gate ranking evidence is not inspectable: ${testCase.testId}.`)
    assert(testCase.fullRanking.every((evidence, index) => evidence.rank === index + 1 && evidence.chunkId && evidence.sourceId && evidence.sourceFamilyId && evidence.authorityLevel && evidence.sourceTextType && evidence.sourceTextExcerpt), `VM-30 support-gate ranked evidence is incomplete: ${testCase.testId}.`)
    assert(JSON.stringify(testCase.productionWindowEvidence) === JSON.stringify(testCase.fullRanking.slice(0, 3)), `VM-30 production evidence projection is not ranks 1-3: ${testCase.testId}.`)
    assert(testCase.supportState === testCase.expectedSupportState && testCase.reasonCode === testCase.expectedReasonCode && testCase.decision.supportState === testCase.supportState && testCase.decision.reasonCode === testCase.reasonCode, `VM-30 support-gate result differs from its inspectable expectation: ${testCase.testId}.`)
    assert(testCase.evidenceSufficient === testCase.decision.evidenceSufficient && testCase.passed === true && testCase.assertionFailureMessage === null, `VM-30 support-gate case did not pass cleanly: ${testCase.testId}.`)
  }
  const supportCases = new Map(supportGate.cases.map((testCase) => [testCase.testId, testCase]))
  const vm20SubstitutionCase = supportCases.get('vm20-methodology-alone-cannot-support-vm30-requirement')
  assert(vm20SubstitutionCase?.fullRanking.length === 3 && vm20SubstitutionCase.fullRanking.every((evidence) => evidence.sourceId === 'vm20-canonical-coverage') && vm20SubstitutionCase.supportState === 'unsupported', 'Actual VM-20 methodology evidence did not fail the requested VM-30 authority boundary.')
  const rankFourCase = supportCases.get('vm30-evidence-at-rank-four-is-outside-production-window')
  assert(rankFourCase?.fullRanking.length === 4 && rankFourCase.fullRanking[3].rank === 4 && rankFourCase.fullRanking[3].sourceId === 'vm30-current-manual' && rankFourCase.fullRanking[3].chunkId === 'vm30-section-2-a-general-2-appointed-actuary-notice' && rankFourCase.productionWindowEvidence.every((evidence) => evidence.sourceId !== 'vm30-current-manual') && rankFourCase.supportState === 'unsupported', 'Correct VM-30 rank-four evidence is not visibly excluded from the production window.')
  const inWindowCase = supportCases.get('vm30-source-evidence-inside-top-three-supports-request')
  assert(inWindowCase?.productionWindowEvidence.some((evidence) => evidence.sourceId === 'vm30-current-manual') && inWindowCase.supportState === 'supported', 'In-window VM-30 support regression failed.')
  const wrongTopicCase = supportCases.get('vm30-source-without-requested-topic-does-not-support-claim')
  assert(wrongTopicCase?.fullRanking.every((evidence) => evidence.sourceId === 'vm30-current-manual') && wrongTopicCase.supportState === 'unsupported' && wrongTopicCase.reasonCode === 'missing_required_requirement_terms', 'Wrong-topic VM-30 evidence was not rejected.')
  assert(reviewPackage.status === 'review_candidate' && reviewPackage.promoted === false && reviewPackage.coverage.totalChunkCount === VM30_CHUNK_COUNT && reviewPackage.relationships.candidateCount === 16 && reviewPackage.retrievalEvaluation.allCasesPassed === true, 'VM-30 review package scope or evidence summary mismatch.')
  assert(reviewPackage.promotionReadiness.independentReviewRequired === true && reviewPackage.promotionReadiness.promotionStatus === 'not_promoted' && reviewPackage.promotionReadiness.promotionEligible === false && reviewPackage.promotionReadiness.copilotExportEligible === false, 'VM-30 review package governance mismatch.')
  for (const [artifactName, artifactPath] of Object.entries(reviewPackage.artifacts)) if (artifactName !== 'validationReport') await fs.access(path.join(repoRoot, ...artifactPath.split('/')))

  const [vm01Package, vm31Package] = await Promise.all([readJson(path.join(sourceRoot, 'vm01-definitions.json')), readJson(path.join(sourceRoot, 'vm31-current-manual.json'))])
  assert(sourceTextAggregate(vm01Package) === VM01_SOURCE_TEXT_AGGREGATE_SHA256 && vm01Package.processing.promotionStatus === 'promoted', 'VM-01 source evidence or promotion regressed during VM-30 work.')
  assert(sourceTextAggregate(vm31Package) === VM31_SOURCE_TEXT_AGGREGATE_SHA256 && vm31Package.processing.promotionStatus === 'promoted', 'VM-31 source evidence or promotion regressed during VM-30 work.')
  const vm20Hashes = []
  for (const sourceId of vm20PromotedSourceIds) { const source = await readJson(path.join(sourceRoot, `${sourceId}.json`)); vm20Hashes.push(`${sourceId}:${sourceTextAggregate(source)}`); assert(source.processing.promotionStatus === 'promoted', `VM-20 source promotion regressed: ${sourceId}.`) }
  assert(sha256(vm20Hashes.join('\n')) === VM20_PROMOTED_SOURCE_TEXT_AGGREGATE_SHA256, 'VM-20 promoted prose source evidence changed during VM-30 work.')
  assert(await hashFile(structuredTablesPath) === VM20_STRUCTURED_TABLE_FILE_SHA256, 'VM-20 structured-table corpus changed during VM-30 work.')
  assert(repositoryManifest.sourcePackageCount === 24 && repositoryManifest.chunkCount === 592 && repositoryManifest.extensions.promotedSourcePackageCount === 8 && repositoryManifest.extensions.promotedChunkCount === 331, 'Repository manifest counts or promotion boundary mismatch after VM-30 canonicalization.')

  const report = {
    schemaVersion: '1.0', reportId: 'vm30-current-manual-validation-2026', status: 'pass',
    sourceIdentity: { sourceSha256: VM30_SOURCE_SHA256, locallyVerifiedSha256: actualPdfHash, sourceEditionId: sourcePackage.source.sourceEditionId, pageRange: VM30_PAGE_RANGE, aggregateExtractionSha256 },
    checks: { packageCount: 1, parents: VM30_PARENT_COUNT, children: VM30_CHILD_COUNT, totalChunks: VM30_CHUNK_COUNT, firstStageRetrievalUnits: 42, exactSourceChunks: VM30_CHUNK_COUNT, sourceTextRewrites: 0, targetedMetadataCorrections: targetedMetadata.size, sourceExplicitDefinedTerms: 3, contentAreasCovered: sourceQa.contentAreaAudit.length, relationshipCandidates: relationships.relationshipCount, sourceFaithfulRelationshipLabels: relationships.relationshipCount, focusedQueries: retrieval.queryCount, supportedQueries: retrieval.supportedQueryCount, supportedTop1: retrieval.supportedTop1Count, supportedStrictTop3: retrieval.supportedTop3Count, unsupportedCorrect: retrieval.unsupportedCorrectCount, ambiguitySafe: retrieval.ambiguitySafeCount, currentAuthorityTop1: retrieval.currentAuthoritativeVm30Top1Count, supportGateRegressions: supportGate.cases.length, supportGateRegressionsPassed: supportGate.passedCaseCount },
    promotionBlockerEvidence: { baselineCommit: 'b36a1c7', correctedChunkIds: [...targetedMetadata.keys()], actualVm20SupportFixture: true, vm20FixtureSourceId: 'vm20-canonical-coverage', rankFourEvidenceInspectable: true, perCasePassed: Object.fromEntries(supportGate.cases.map((testCase) => [testCase.testId, testCase.passed])) },
    regressionIntegrity: { vm01SourceTextAggregateSha256: VM01_SOURCE_TEXT_AGGREGATE_SHA256, vm20PromotedSourceTextAggregateSha256: VM20_PROMOTED_SOURCE_TEXT_AGGREGATE_SHA256, vm20StructuredTableFileSha256: VM20_STRUCTURED_TABLE_FILE_SHA256, vm31SourceTextAggregateSha256: VM31_SOURCE_TEXT_AGGREGATE_SHA256, authoritativeSourceTextChangeCount: 0 },
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
    artifacts: reviewPackage.artifacts,
  }
  await fs.writeFile(validationPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  await fs.writeFile(validationPath.replace(/\.json$/, '.md'), `${[
    '# VM-30 validation report', '', '- Result: **PASS**', `- Source SHA-256: \`${VM30_SOURCE_SHA256}\``, `- Parents / children / chunks: ${VM30_PARENT_COUNT} / ${VM30_CHILD_COUNT} / ${VM30_CHUNK_COUNT}`,
    '- Authoritative source-text changes: 0', `- Narrow metadata corrections: ${targetedMetadata.size}`, '- Source-explicit defined terms: 3', `- Relationship candidates: ${relationships.relationshipCount}; all pending and unpromoted`,
    `- Supported top-1 / strict top-3: ${retrieval.supportedTop1Count}/${retrieval.supportedQueryCount} / ${retrieval.supportedTop3Count}/${retrieval.supportedQueryCount}`,
    `- Unsupported / ambiguity: ${retrieval.unsupportedCorrectCount}/${retrieval.unsupportedQueryCount} / ${retrieval.ambiguitySafeCount}/${retrieval.ambiguityQueryCount}`,
    `- Current authoritative VM-30 top-1: ${retrieval.currentAuthoritativeVm30Top1Count}/${retrieval.supportedQueryCount}`, `- Support-gate regressions: ${supportGate.passedCaseCount}/${supportGate.caseCount}; actual VM-20 fixture and inspectable rank-four evidence confirmed`,
    '- VM-01, VM-20, and promoted VM-31 source evidence: unchanged', '- Governance: review-only, not promoted, and blocked from downstream learner/app/RAG/vector/Copilot use',
  ].join('\n')}\n`, 'utf8')
  console.log(`Validated VM-30: ${VM30_PARENT_COUNT} parents, ${VM30_CHILD_COUNT} children, ${relationships.relationshipCount} relationships, and ${retrieval.queryCount} retrieval cases.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
