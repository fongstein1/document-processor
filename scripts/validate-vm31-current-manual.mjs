import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildVm31Chunks, loadVm31Chapter, segmentVm31Chapter, VM31_CHILD_COUNT, VM31_CHUNK_COUNT, VM31_PAGE_RANGE, VM31_PARENT_COUNT, VM31_SOURCE_SHA256 } from './lib/vm31-current-manual.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')
const sourceRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources')
const sourcePackagePath = path.join(sourceRoot, 'vm31-current-manual.json')
const reviewRoot = path.join(repoRoot, 'data', 'processed', 'review_packages')
const sourceQaPath = path.join(reviewRoot, 'vm31-source-qa.json')
const retrievalPath = path.join(reviewRoot, 'vm31-focused-retrieval-evaluation.json')
const supportGatePath = path.join(reviewRoot, 'vm31-support-gate-regression.json')
const reviewPackagePath = path.join(reviewRoot, 'vm31-canonical-coverage-review-package.json')
const relationshipPath = path.join(repoRoot, 'data', 'processed', 'relationship_registries', 'vm31-current-manual-relationship-candidates.json')
const validationPath = path.join(reviewRoot, 'vm31-validation-report.json')
const repositoryManifestPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'repository-manifest.json')
const structuredTablesPath = path.join(repoRoot, 'data', 'processed', 'structured_tables', 'vm20-appendix2-tables.json')

const VM01_SOURCE_TEXT_AGGREGATE_SHA256 = '04fecfc622ee792dca2f994f3d7eb6ebf510bd533bd7be9798b4604a70b8ef98'
const VM20_PROMOTED_SOURCE_TEXT_AGGREGATE_SHA256 = 'c32c9a1e976a0635707af9b82e3847152b4611257147d12f14f29c4a5b1274c6'
const VM20_STRUCTURED_TABLE_FILE_SHA256 = '2b86d0929da8f8dfc85f9d3a123311166d136283ed33afeca5ded4c32f0d0f3f'
const vm20PromotedSourceIds = ['vm20-section3c-hierarchical', 'vm20-framework-overview', 'vm20-framework-boundary', 'vm20-assumptions-section-3c', 'vm20-canonical-coverage', 'vm20-remaining-prose-appendix-coverage']

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const hashFile = async (filePath) => sha256(await fs.readFile(filePath))
const assert = (condition, message) => { if (!condition) throw new Error(message) }

const sourceTextAggregate = (sourcePackage) => sha256(sourcePackage.chunks.map((chunk) => chunk.sourceTextExcerpt).join('\n\n'))

const main = async () => {
  const [config, sourcePackage, sourceQa, retrieval, supportGate, reviewPackage, relationships, repositoryManifest] = await Promise.all([
    readJson(configPath), readJson(sourcePackagePath), readJson(sourceQaPath), readJson(retrievalPath), readJson(supportGatePath), readJson(reviewPackagePath), readJson(relationshipPath), readJson(repositoryManifestPath),
  ])
  const sourceConfig = config.sources.find((source) => source.sourceId === 'vm31-current-manual')
  assert(sourceConfig, 'VM-31 source configuration is missing.')
  const { chapterText, aggregateExtractionSha256 } = await loadVm31Chapter(repoRoot, sourceConfig.vm31Input)
  const structure = segmentVm31Chapter(chapterText)
  const expectedChunks = await buildVm31Chunks(repoRoot, sourceConfig)

  assert(sourcePackage.source.sourceSha256 === VM31_SOURCE_SHA256 && sourcePackage.source.sourceEditionId === 'NAIC-VALUATION-MANUAL-2026' && sourcePackage.source.sourceVersionIdentifier === '2026 NAIC Valuation Manual', 'VM-31 authoritative source identity mismatch.')
  assert(sourcePackage.source.pageRange.start === VM31_PAGE_RANGE.start && sourcePackage.source.pageRange.end === VM31_PAGE_RANGE.end, 'VM-31 source page boundary mismatch.')
  const actualPdfHash = await hashFile(sourcePackage.source.filePath)
  assert(actualPdfHash === VM31_SOURCE_SHA256, 'VM-31 local authoritative PDF hash mismatch.')
  assert(sourcePackage.processing.canonicality === 'canonical' && sourcePackage.processing.reviewOnly === true && sourcePackage.processing.promotionStatus === 'not_promoted', 'VM-31 must remain a canonical review candidate and not promoted.')
  assert(sourcePackage.processing.learnerFacingAllowed === false && sourcePackage.processing.appReadyAllowed === false && sourcePackage.processing.ragReadyAllowed === false && sourcePackage.exportHints.vectorEligible === false, 'VM-31 downstream eligibility boundary is not closed.')

  assert(sourcePackage.chunks.length === VM31_CHUNK_COUNT && expectedChunks.length === VM31_CHUNK_COUNT, 'VM-31 total chunk count mismatch.')
  const parents = sourcePackage.chunks.filter((chunk) => chunk.chunkLevel === 'parent')
  const children = sourcePackage.chunks.filter((chunk) => chunk.chunkLevel === 'child')
  assert(parents.length === VM31_PARENT_COUNT && children.length === VM31_CHILD_COUNT, 'VM-31 parent/child count mismatch.')
  assert(sourcePackage.chunks.filter((chunk) => chunk.retrievalEligible).length === VM31_CHILD_COUNT - 1, 'VM-31 first-stage retrieval-unit count mismatch.')
  assert(sourcePackage.chunks.every((chunk) => chunk.sourceTextType === 'actual_extracted_source_text' && chunk.fidelity === 'exact' && chunk.promotionEligible === false), 'VM-31 source fidelity or promotion boundary mismatch.')
  assert(sourcePackage.chunks.every((chunk) => chunk.definedTerms.length === 0), 'VM-31 must not create formal defined-term claims.')
  assert(sourcePackage.chunks.some((chunk) => chunk.pageEnd === 386 && chunk.chunkKind === 'boundary_slice' && /intentionally left blank/i.test(chunk.sourceTextExcerpt)), 'VM-31 closing blank-page boundary is missing.')
  assert(!sourcePackage.chunks.some((chunk) => /VM\s*-\s*50|Experience Reporting Requirements/i.test(chunk.sourceTextExcerpt)), 'VM-31 package crosses into the VM-50 opener.')

  for (let index = 0; index < expectedChunks.length; index += 1) {
    const expected = expectedChunks[index]
    const actual = sourcePackage.chunks[index]
    assert(actual.chunkId === expected.chunkId && actual.chunkOrdinal === expected.chunkOrdinal, `VM-31 chunk identity/order mismatch at ordinal ${index + 1}.`)
    assert(actual.sourceTextExcerpt === expected.sourceTextExcerpt && actual.pageStart === expected.pageStart && actual.pageEnd === expected.pageEnd, `VM-31 authoritative source segment mismatch: ${actual.chunkId}.`)
    assert(actual.parentChunkId === expected.parentChunkId && JSON.stringify(actual.childChunkIds) === JSON.stringify(expected.childChunkIds), `VM-31 hierarchy mismatch: ${actual.chunkId}.`)
    assert(actual.precedingChunkId === expected.precedingChunkId && actual.followingChunkId === expected.followingChunkId, `VM-31 adjacency mismatch: ${actual.chunkId}.`)
  }
  const ids = new Set(sourcePackage.chunks.map((chunk) => chunk.chunkId))
  assert(ids.size === VM31_CHUNK_COUNT, 'VM-31 chunk IDs are not unique.')
  for (const parent of parents) {
    assert(parent.childChunkIds.length > 0 && parent.childChunkIds.every((childId) => ids.has(childId)), `VM-31 parent has missing children: ${parent.chunkId}.`)
  }
  for (const child of children) assert(ids.has(child.parentChunkId), `VM-31 child is orphaned: ${child.chunkId}.`)

  assert(sourceQa.status === 'pass' && sourceQa.authoritativeSource.sourceSha256 === VM31_SOURCE_SHA256 && sourceQa.extraction.aggregateExtractionSha256 === aggregateExtractionSha256, 'VM-31 source QA identity or extraction hash mismatch.')
  assert(sourceQa.hierarchy.parentCount === VM31_PARENT_COUNT && sourceQa.hierarchy.childCount === VM31_CHILD_COUNT && sourceQa.sourceFidelity.exactChunkCount === VM31_CHUNK_COUNT && sourceQa.sourceFidelity.sourceTextRewriteCount === 0, 'VM-31 source QA hierarchy or fidelity mismatch.')
  assert(sourceQa.extraction.visualReview.pagesRenderedAndReviewed === '341-387' && sourceQa.extraction.visualReview.intentionalBlankPage === 386 && sourceQa.extraction.visualReview.followingChapter === 'VM-50', 'VM-31 visual boundary QA is incomplete.')
  assert(sourceQa.sectionCoverage.length === VM31_PARENT_COUNT && sourceQa.contentAreaAudit.length === 17 && sourceQa.contentAreaAudit.every((area) => area.status === 'covered' && ids.has(area.representativeChunkId)), 'VM-31 section/content-area coverage audit is incomplete.')
  assert(children.filter((chunk) => chunk.provisionTypes.includes('guidance_note_present')).length === 6, 'VM-31 guidance-note retention inventory changed unexpectedly.')

  assert(relationships.relationshipCount === 92 && relationships.candidates.length === 92 && relationships.relationTypes.length === 1 && relationships.relationTypes[0] === 'references', 'VM-31 relationship-candidate count or vocabulary mismatch.')
  assert(JSON.stringify(relationships.targetCounts) === JSON.stringify({ 'VM-20': 27, 'VM-21': 28, 'VM-22': 30, 'VM-G': 5, 'Actuarial Guideline XLIII': 2 }), 'VM-31 relationship target distribution mismatch.')
  const relationshipIds = new Set()
  const chunkById = new Map(sourcePackage.chunks.map((chunk) => [chunk.chunkId, chunk]))
  for (const candidate of relationships.candidates) {
    assert(!relationshipIds.has(candidate.relationshipId), `Duplicate VM-31 relationship ID: ${candidate.relationshipId}.`)
    relationshipIds.add(candidate.relationshipId)
    const sourceChunk = chunkById.get(candidate.sourceChunkId)
    assert(sourceChunk && (sourceChunk.crossReferenceCandidates ?? []).includes(candidate.targetLabel), `VM-31 relationship is not supported by explicit source-reference metadata: ${candidate.relationshipId}.`)
    assert(candidate.evidence.sourceSha256 === VM31_SOURCE_SHA256 && candidate.evidence.sourceTextSha256 === sha256(sourceChunk.sourceTextExcerpt), `VM-31 relationship evidence hash mismatch: ${candidate.relationshipId}.`)
    assert(candidate.reviewDecision === 'pending' && candidate.promotionStatus === 'not_promoted' && candidate.promotionEligible === false, `VM-31 relationship governance mismatch: ${candidate.relationshipId}.`)
  }

  assert(retrieval.queryCount === 21 && retrieval.supportedQueryCount === 18 && retrieval.supportedTop1Count === 15 && retrieval.supportedTop3Count === 18, 'VM-31 focused supported retrieval metrics changed unexpectedly.')
  assert(retrieval.unsupportedCorrectCount === 2 && retrieval.unsupportedQueryCount === 2 && retrieval.ambiguitySafeCount === 1 && retrieval.ambiguityQueryCount === 1 && retrieval.currentAuthoritativeVm31Top1Count === 18 && retrieval.allCasesPassed === true, 'VM-31 unsupported, ambiguity, or authority metrics failed.')
  for (const testCase of retrieval.queries) {
    assert(testCase.actualTop3.length <= 3 && (testCase.actualTop1?.chunkId ?? null) === (testCase.actualTop3[0]?.chunkId ?? null), `VM-31 case top-one/top-three projection mismatch: ${testCase.queryId}.`)
    if (testCase.intendedSupportState === 'supported') {
      const expectedIds = new Set(testCase.expectedChunkIds)
      assert(testCase.top1Hit === expectedIds.has(testCase.actualTop1?.chunkId), `VM-31 top1Hit mismatch: ${testCase.queryId}.`)
      assert(testCase.top3Hit === testCase.actualTop3.some((match) => expectedIds.has(match.chunkId)), `VM-31 strict top3Hit mismatch: ${testCase.queryId}.`)
      assert(testCase.supportDecision.supportState === 'supported' && testCase.authorityResult.currentAuthoritativeVm31Top1 === true, `VM-31 supported case lacks current authoritative evidence: ${testCase.queryId}.`)
    } else if (testCase.intendedSupportState === 'unsupported') {
      assert(testCase.supportDecision.supportState === 'unsupported' && testCase.supportDecision.evidenceSufficient === false, `VM-31 unsupported case did not abstain: ${testCase.queryId}.`)
    } else {
      assert(testCase.supportDecision.supportState === 'ambiguous_requires_more_context' && testCase.ambiguityResult.safelyAbstained === true, `VM-31 ambiguous case was not handled safely: ${testCase.queryId}.`)
    }
    assert(testCase.passed && testCase.failureReason === null, `VM-31 focused case failed: ${testCase.queryId}.`)
  }
  assert(supportGate.status === 'pass' && supportGate.productionEvidenceWindow === 3 && supportGate.cases.length === 4 && supportGate.cases.every((testCase) => testCase.decision.supportState === testCase.expectedState && testCase.decision.reasonCode === testCase.expectedReason), 'VM-31 formal-requirement support-gate regression failed.')

  assert(reviewPackage.status === 'canonical_review_candidate' && reviewPackage.promoted === false && reviewPackage.coverage.parentCount === VM31_PARENT_COUNT && reviewPackage.coverage.childCount === VM31_CHILD_COUNT, 'VM-31 review package scope mismatch.')
  assert(reviewPackage.promotionReadiness.independentReviewRequired === true && reviewPackage.promotionReadiness.promotionStatus === 'not_promoted' && reviewPackage.promotionReadiness.promotionEligible === false && reviewPackage.promotionReadiness.copilotExportEligible === false, 'VM-31 review package governance mismatch.')
  assert(reviewPackage.relationships.candidateCount === 92 && reviewPackage.retrievalEvaluation.allCasesPassed === true, 'VM-31 review package relationship or retrieval summary mismatch.')
  for (const [artifactName, artifactPath] of Object.entries(reviewPackage.artifacts)) {
    if (artifactName === 'validationReport') continue
    await fs.access(path.join(repoRoot, ...artifactPath.split('/')))
  }

  const vm01Package = await readJson(path.join(sourceRoot, 'vm01-definitions.json'))
  assert(sourceTextAggregate(vm01Package) === VM01_SOURCE_TEXT_AGGREGATE_SHA256 && vm01Package.processing.promotionStatus === 'promoted', 'VM-01 source evidence or promotion regressed during VM-31 work.')
  const vm20Hashes = []
  for (const sourceId of vm20PromotedSourceIds) {
    const source = await readJson(path.join(sourceRoot, `${sourceId}.json`))
    vm20Hashes.push(`${sourceId}:${sourceTextAggregate(source)}`)
    assert(source.processing.promotionStatus === 'promoted', `VM-20 source promotion regressed: ${sourceId}.`)
  }
  assert(sha256(vm20Hashes.join('\n')) === VM20_PROMOTED_SOURCE_TEXT_AGGREGATE_SHA256, 'VM-20 promoted prose source evidence changed during VM-31 work.')
  assert(await hashFile(structuredTablesPath) === VM20_STRUCTURED_TABLE_FILE_SHA256, 'VM-20 structured-table corpus changed during VM-31 work.')
  assert(repositoryManifest.sourcePackageCount === 23 && repositoryManifest.chunkCount === 541 && repositoryManifest.extensions.promotedSourcePackageCount === 7 && repositoryManifest.extensions.promotedChunkCount === 247, 'Repository manifest counts or promotion boundary mismatch after VM-31 addition.')

  const report = {
    schemaVersion: '1.0',
    reportId: 'vm31-current-manual-validation-2026',
    status: 'pass',
    sourceIdentity: { sourceSha256: VM31_SOURCE_SHA256, locallyVerifiedSha256: actualPdfHash, sourceEditionId: sourcePackage.source.sourceEditionId, pageRange: VM31_PAGE_RANGE, aggregateExtractionSha256 },
    checks: { packageCount: 1, parents: VM31_PARENT_COUNT, children: VM31_CHILD_COUNT, totalChunks: VM31_CHUNK_COUNT, firstStageRetrievalUnits: VM31_CHILD_COUNT - 1, exactSourceChunks: VM31_CHUNK_COUNT, sourceTextRewrites: 0, guidanceNoteChildren: 6, contentAreasCovered: 17, relationshipCandidates: relationships.relationshipCount, focusedQueries: retrieval.queryCount, supportedQueries: retrieval.supportedQueryCount, supportedTop1: retrieval.supportedTop1Count, supportedStrictTop3: retrieval.supportedTop3Count, unsupportedCorrect: retrieval.unsupportedCorrectCount, ambiguitySafe: retrieval.ambiguitySafeCount, currentAuthorityTop1: retrieval.currentAuthoritativeVm31Top1Count, supportGateRegressions: supportGate.cases.length },
    regressionIntegrity: { vm01SourceTextAggregateSha256: VM01_SOURCE_TEXT_AGGREGATE_SHA256, vm20PromotedSourceTextAggregateSha256: VM20_PROMOTED_SOURCE_TEXT_AGGREGATE_SHA256, vm20StructuredTableFileSha256: VM20_STRUCTURED_TABLE_FILE_SHA256, status: 'unchanged' },
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
  }
  await fs.writeFile(validationPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  await fs.writeFile(validationPath.replace(/\.json$/, '.md'), `${[
    '# VM-31 validation report', '', '- Result: **PASS**',
    `- Source SHA-256: \`${VM31_SOURCE_SHA256}\``,
    '- Boundary: pages 341-385 content; page 386 intentional blank; page 387 VM-50',
    `- Parents / children / chunks: ${VM31_PARENT_COUNT} / ${VM31_CHILD_COUNT} / ${VM31_CHUNK_COUNT}`,
    `- Exact source chunks / rewrites: ${VM31_CHUNK_COUNT} / 0`,
    `- Relationship candidates: ${relationships.relationshipCount}; all pending and unpromoted`,
    `- Supported top-1 / strict top-3: ${retrieval.supportedTop1Count}/${retrieval.supportedQueryCount} / ${retrieval.supportedTop3Count}/${retrieval.supportedQueryCount}`,
    `- Unsupported / ambiguity: ${retrieval.unsupportedCorrectCount}/${retrieval.unsupportedQueryCount} / ${retrieval.ambiguitySafeCount}/${retrieval.ambiguityQueryCount}`,
    `- Current authoritative VM-31 top-1: ${retrieval.currentAuthoritativeVm31Top1Count}/${retrieval.supportedQueryCount}`,
    '- VM-01, VM-20 promoted prose, and VM-20 structured tables: unchanged',
    '- Governance: review-only / not promoted / downstream export blocked',
  ].join('\n')}\n`, 'utf8')
  console.log(`Validated VM-31: ${VM31_PARENT_COUNT} parents, ${VM31_CHILD_COUNT} children, ${relationships.relationshipCount} relationships, and ${retrieval.queryCount} retrieval cases.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
