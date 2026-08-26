import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  VM01_EXPECTED_DEFINITION_COUNT,
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
const globalRetrievalPath = path.join(processedRoot, 'source_indexes', 'evaluation', 'retrieval_results.json')
const configPath = path.join(repoRoot, 'config', 'source-index-poc.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const hashFile = async (filePath) => crypto.createHash('sha256').update(await fs.readFile(filePath)).digest('hex')

const main = async () => {
  const [config, sourcePackage, definitionIndex, relationships, retrieval, sourceQa, reviewPackage, globalRetrieval] = await Promise.all([
    readJson(configPath), readJson(sourcePackagePath), readJson(definitionIndexPath), readJson(relationshipPath), readJson(retrievalPath), readJson(sourceQaPath), readJson(reviewPackagePath), readJson(globalRetrievalPath), fs.access(promptPath),
  ])
  const sourceConfig = config.sources.find((source) => source.sourceId === 'vm01-definitions')
  assert(sourceConfig, 'VM-01 source configuration is missing.')
  const parsed = await loadVm01Extraction(repoRoot, sourceConfig.definitionInput)

  assert(parsed.sourceRecord.fileHash === VM01_SOURCE_SHA256, 'VM-01 batch-manifest source hash mismatch.')
  assert(await hashFile(parsed.sourceRecord.filePath) === VM01_SOURCE_SHA256, 'Authoritative VM-01 PDF hash mismatch.')
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
  }

  const aggregateHash = sha256(definitionIndex.definitions.map((entry) => entry.formalDefinitionSourceText).join('\n\n'))
  assert(sourceQa.status === 'pass' && sourceQa.checks.definitionsWithSourceEvidence === 98 && sourceQa.checks.definitionsWithValidCitations === 98, 'VM-01 source QA did not pass all evidence/citation checks.')
  assert(sourceQa.checks.uniqueDefinitionIds === 98 && sourceQa.checks.uniqueNormalizedTerms === 98 && sourceQa.checks.sourceEvidenceAggregateSha256 === aggregateHash, 'VM-01 source QA uniqueness or aggregate hash mismatch.')
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

  assert(retrieval.queryCount === 16 && retrieval.supportedQueryCount === 13 && retrieval.unsupportedQueryCount === 3, 'VM-01 focused retrieval battery size changed unexpectedly.')
  assert(retrieval.top1HitCount >= 12 && retrieval.top3HitCount === 13 && retrieval.currentAuthorityTop1Count === 13, 'VM-01 focused retrieval did not preserve authoritative top-ranked evidence.')
  assert(retrieval.unsupportedCorrectCount === 3 && retrieval.unsupportedQueryPrecision === 1, 'VM-01 unsupported formal-definition behavior did not abstain safely.')
  for (const query of retrieval.queries.filter((query) => query.expectedOutcome === 'unsupported')) {
    assert(query.supportDecision.supportState === 'unsupported' && ['term_not_defined_in_vm01', 'missing_requested_source_version'].includes(query.supportDecision.reasonCode), `VM-01 unsupported query did not use the generic support gate: ${query.queryId}.`)
  }
  const globalVm01Queries = globalRetrieval.queries.filter((query) => query.queryId.startsWith('q-vm01-'))
  assert(globalVm01Queries.length === 6, 'Global source-index retrieval is missing VM-01 regression queries.')
  assert(globalVm01Queries.filter((query) => query.expectedOutcome !== 'unsupported').every((query) => query.resultLabel === 'supported_top1' && query.rankedMatches[0]?.sourceId === 'vm01-definitions'), 'Global source-index retrieval does not rank current VM-01 definitions first.')
  assert(globalVm01Queries.filter((query) => query.expectedOutcome === 'unsupported').every((query) => query.resultLabel === 'unsupported' && query.supportDecision.supportState === 'unsupported'), 'Global source-index unsupported VM-01 queries did not abstain.')

  assert(reviewPackage.status === 'review_ready_not_promoted' && reviewPackage.promoted === false, 'VM-01 review package promotion status mismatch.')
  assert(reviewPackage.promotionReadiness.independentReviewRequired === true && reviewPackage.promotionReadiness.automatedPromotion === false && reviewPackage.promotionReadiness.copilotExportEligible === false, 'VM-01 review package governance gate mismatch.')

  const report = {
    schemaVersion: '1.0', reportId: 'vm01-definitions-validation-2026', status: 'pass',
    sourceIdentity: { sourceSha256: VM01_SOURCE_SHA256, sourceEditionId: sourcePackage.source.sourceEditionId, pageRange: sourcePackage.source.pageRange },
    checks: { definitions: 98, retrievalUnits: 98, uniqueDefinitionIds: 98, uniqueNormalizedTerms: 98, validSourceEvidence: 98, validCitations: 98, termExtractionCorrections: 11, relationshipCandidates: 29, focusedRetrievalQueries: 16, focusedSupportedTop1: retrieval.top1HitCount, focusedSupportedTop3: retrieval.top3HitCount, unsupportedQueriesSafelyAbstained: retrieval.unsupportedCorrectCount, globalVm01RegressionQueries: 6, globalSupportedTop1: globalVm01Queries.filter((query) => query.expectedOutcome !== 'unsupported' && query.resultLabel === 'supported_top1').length, globalUnsupportedAbstained: globalVm01Queries.filter((query) => query.expectedOutcome === 'unsupported' && query.resultLabel === 'unsupported').length },
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, vectorEligible: false, copilotExportEligible: false },
  }
  await fs.writeFile(validationPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  await fs.writeFile(validationPath.replace(/\.json$/, '.md'), [
    '# VM-01 definitions validation report', '', '- Result: **PASS**', `- Source SHA-256: \`${VM01_SOURCE_SHA256}\``, '- Definitions / retrieval units: 98 / 98', '- Unique IDs / normalized terms: 98 / 98', '- Valid exact evidence / citations: 98 / 98', `- Focused supported top-1 / top-3: ${retrieval.top1HitCount}/13 / ${retrieval.top3HitCount}/13`, '- Unsupported formal-definition abstentions: 3 / 3', '- Relationship candidates: 29; all pending and not promoted', '- Governance: canonical review candidate; review-only / not promoted / downstream export blocked', '',
  ].join('\n'), 'utf8')
  console.log('Validated 98 VM-01 definitions, 29 relationship candidates, and 16 focused retrieval queries.')
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
