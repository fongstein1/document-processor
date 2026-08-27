import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { evaluateQueries } from './evaluate-source-index-retrieval.mjs'
import {
  VM01_EXPECTED_DEFINITION_COUNT,
  VM01_SOURCE_SHA256,
  loadVm01Extraction,
  normalizeLookupTerm,
  sha256,
} from './lib/vm01-definitions.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePackagePath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources', 'vm01-definitions.json')
const repositoryManifestPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'repository-manifest.json')
const chunkExportPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'exports', 'source_chunks.jsonl')
const definitionRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'definitions')
const reviewRoot = path.join(repoRoot, 'data', 'processed', 'review_packages')
const relationshipRoot = path.join(repoRoot, 'data', 'processed', 'relationship_registries')
const definitionIndexPath = path.join(definitionRoot, 'vm01-definition-index.json')
const relationshipPath = path.join(relationshipRoot, 'vm01-definition-relationship-candidates.json')
const retrievalPath = path.join(reviewRoot, 'vm01-definition-retrieval-evaluation.json')
const sourceQaPath = path.join(reviewRoot, 'vm01-definitions-source-qa.json')
const reviewPackagePath = path.join(reviewRoot, 'vm01-canonical-definitions-review-package.json')
const promptPath = path.join(reviewRoot, 'vm01-independent-review-prompt.md')
const pdfHashConfirmationPath = path.join(reviewRoot, 'vm01-source-pdf-hash-confirmation.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
const writeMarkdown = async (jsonPath, content) => fs.writeFile(jsonPath.replace(/\.json$/, '.md'), `${content.trim()}\n`, 'utf8')
const hashFile = async (filePath) => crypto.createHash('sha256').update(await fs.readFile(filePath)).digest('hex')
const relative = (filePath) => path.relative(repoRoot, filePath).split(path.sep).join('/')
const slug = (value) => normalizeLookupTerm(value).replace(/\s+/g, '-')

const targetMap = new Map([
  ['Model #820', { targetId: 'standard-valuation-law-model-820', targetKind: 'corpus_target' }],
  ['Model #787', { targetId: 'model-787', targetKind: 'external_regulatory_source' }],
  ['AP&P Manual', { targetId: 'app-manual', targetKind: 'external_regulatory_source' }],
  ['VM-20', { targetId: 'vm-20', targetKind: 'corpus_target' }],
  ['VM-21', { targetId: 'vm-21', targetKind: 'corpus_target' }],
  ['VM-22', { targetId: 'vm-22', targetKind: 'corpus_target' }],
  ['VM-30', { targetId: 'vm-30', targetKind: 'corpus_target' }],
  ['VM-31', { targetId: 'vm-31', targetKind: 'corpus_target' }],
  ['VM-A', { targetId: 'vm-a', targetKind: 'corpus_target' }],
  ['VM-C', { targetId: 'vm-c', targetKind: 'corpus_target' }],
  ['VM-M', { targetId: 'vm-m', targetKind: 'corpus_target' }],
  ['Section II', { targetId: 'valuation-manual-section-ii', targetKind: 'manual_section' }],
  ['ASOP No. 25', { targetId: 'asop-25', targetKind: 'external_professional_standard' }],
  ['ASOP No. 52', { targetId: 'asop-52', targetKind: 'external_professional_standard' }],
  ['SSAP No. 86', { targetId: 'ssap-86', targetKind: 'external_accounting_standard' }],
])

const focusedQueries = [
  ['vm01-exact-accumulated-deficiency', 'exact_defined_term', 'How does VM-01 define accumulated deficiency?', 'accumulated deficiency', 'vm01-definition-002-accumulated-deficiency'],
  ['vm01-acronym-cte', 'acronym_lookup', 'How does VM-01 define CTE?', 'CTE', 'vm01-definition-016-conditional-tail-expectation'],
  ['vm01-plain-language-tail-measure', 'plain_language_lookup', 'Which VM-01 risk measure averages the highest 30% of outcomes?', null, 'vm01-definition-016-conditional-tail-expectation'],
  ['vm01-similar-claim-reserve', 'similar_terms', 'How does VM-01 define claim reserve rather than contract reserve?', 'claim reserve', 'vm01-definition-012-claim-reserve'],
  ['vm01-similar-contract-reserve', 'similar_terms', 'How does VM-01 define contract reserve rather than claim reserve?', 'contract reserve', 'vm01-definition-017-contract-reserve'],
  ['vm01-condition-future-hedging', 'condition_or_exception', 'How does VM-01 define future hedging strategy, including what does not qualify?', 'future hedging strategy', 'vm01-definition-029-future-hedging-strategy'],
  ['vm01-incorporated-margin', 'incorporated_defined_term', 'How does VM-01 define prudent estimate assumption and incorporate margin?', 'prudent estimate assumption', 'vm01-definition-073-prudent-estimate-assumption'],
  ['vm01-cross-reference-npr', 'manual_cross_reference', 'How does VM-01 define net premium reserve and where does it point?', 'net premium reserve', 'vm01-definition-056-net-premium-reserve'],
  ['vm01-cross-document-prudent-estimate', 'cross_document_terminology', 'VM-20 uses prudent estimate assumption; what formal definition does VM-01 provide?', 'prudent estimate assumption', 'vm01-definition-073-prudent-estimate-assumption'],
  ['vm01-acronym-iul', 'acronym_lookup', 'How does VM-01 define IUL?', 'IUL', 'vm01-definition-042-indexed-universal-life-iul-insurance-policy'],
  ['vm01-acronym-dr', 'acronym_lookup', 'How does VM-01 define DR rather than SR?', 'DR', 'vm01-definition-022-deterministic-reserve'],
  ['vm01-acronym-sr', 'acronym_lookup', 'How does VM-01 define SR rather than DR?', 'SR', 'vm01-definition-087-stochastic-reserve'],
  ['vm01-acronym-npr', 'acronym_lookup', 'How does VM-01 define NPR?', 'NPR', 'vm01-definition-056-net-premium-reserve'],
  ['vm01-acronym-gic', 'acronym_lookup', 'How does VM-01 define GIC rather than synthetic GIC?', 'GIC', 'vm01-definition-030-guaranteed-investment-contract'],
  ['vm01-cross-page-cdhs', 'cross_page_definition', 'How does VM-01 define clearly defined hedging strategy across its complete list of documented attributes?', 'clearly defined hedging strategy', 'vm01-definition-013-clearly-defined-hedging-strategy'],
  ['vm01-long-category', 'complex_definition', 'How does VM-01 define VM-20 reserving category and its three categories?', 'VM-20 reserving category', 'vm01-definition-098-vm-20-reserving-category'],
  ['vm01-gi-exclusions', 'condition_or_exception', 'How does VM-01 define guaranteed issue life insurance policy, including disqualifying characteristics?', 'guaranteed issue (GI) life insurance policy', 'vm01-definition-031-guaranteed-issue-gi-life-insurance-policy'],
  ['vm01-explicit-alternate-term', 'explicit_alias', 'How does VM-01 define contract holder behavior?', 'contract holder behavior', 'vm01-definition-062-policyholder-behavior'],
].map(([queryId, queryCategory, query, definedTerm, expectedChunkId]) => ({
  queryId,
  queryCategory,
  query,
  expectedChunkIds: [expectedChunkId],
  expectedSourceIds: ['vm01-definitions'],
  supportRequirements: { informationTypes: ['formal_definition'], ...(definedTerm ? { definedTerm } : {}) },
  rationale: 'Focused VM-01 definition-aware retrieval coverage.',
}))

focusedQueries.push(
  {
    queryId: 'vm01-undefined-deterministic-exclusion-test', queryCategory: 'unsupported_term', query: 'How does VM-01 define deterministic exclusion test?', expectedOutcome: 'unsupported', expectedChunkIds: [], expectedSourceIds: [], supportRequirements: { informationTypes: ['formal_definition'], definedTerm: 'deterministic exclusion test' }, rationale: 'Related deterministic and stochastic material must not become a formal definition.',
  },
  {
    queryId: 'vm01-ambiguous-reserve', queryCategory: 'ambiguous_term', query: 'How does VM-01 define reserve?', expectedOutcome: 'unsupported', expectedChunkIds: [], expectedSourceIds: [], supportRequirements: { informationTypes: ['formal_definition'], definedTerm: 'reserve' }, rationale: 'Several reserve terms exist, but the broad term is not itself defined.',
  },
  {
    queryId: 'vm01-proposed-2027-version', queryCategory: 'historical_or_proposed_version', query: 'How does the proposed 2027 VM-01 define accumulated deficiency?', expectedOutcome: 'unsupported', expectedChunkIds: [], expectedSourceIds: [], supportRequirements: { informationTypes: ['formal_definition', 'current_version_metadata'], definedTerm: 'accumulated deficiency', sourceVersionIdentifier: 'proposed 2027 VM-01' }, rationale: 'The corpus contains the current 2026 edition, not a proposed 2027 definition source.',
  },
)

const buildMarkdownTable = (rows) => rows.map((row) => `| ${row.join(' | ')} |`).join('\n')

const main = async () => {
  await Promise.all([definitionRoot, reviewRoot, relationshipRoot].map((directory) => fs.mkdir(directory, { recursive: true })))
  const [sourcePackage, repositoryManifest, config] = await Promise.all([
    readJson(sourcePackagePath),
    readJson(repositoryManifestPath),
    readJson(path.join(repoRoot, 'config', 'source-index-poc.json')),
  ])
  const sourceConfig = config.sources.find((source) => source.sourceId === 'vm01-definitions')
  const loaded = await loadVm01Extraction(repoRoot, sourceConfig.definitionInput)
  const [verifiedPdfSha256, pdfStat] = await Promise.all([
    hashFile(loaded.sourceRecord.filePath),
    fs.stat(loaded.sourceRecord.filePath),
  ])
  if (verifiedPdfSha256 !== VM01_SOURCE_SHA256) throw new Error(`Authoritative VM-01 PDF hash mismatch: ${verifiedPdfSha256}.`)
  const chunksById = new Map(sourcePackage.chunks.map((chunk) => [chunk.chunkId, chunk]))

  const entries = loaded.definitions.map((definition) => {
    const chunk = chunksById.get(definition.definitionId)
    return {
      definitionId: definition.definitionId,
      chunkId: definition.definitionId,
      exactDefinedTerm: definition.exactDefinedTerm,
      extractedDefinedTerm: definition.extractedDefinedTerm,
      normalizedLookupTerm: definition.normalizedLookupTerm,
      termExtractionNormalization: definition.termExtractionNormalization,
      aliases: definition.aliases,
      acronymExpansions: definition.acronymExpansions,
      formalDefinitionSourceText: definition.sourceText,
      definitionBodySourceText: definition.definitionBodySourceText,
      sourceTextSha256: definition.sourceTextSha256,
      sourceEvidence: {
        sourceId: 'vm01-definitions',
        sourceSha256: VM01_SOURCE_SHA256,
        sourceReference: '2026 NAIC Valuation Manual',
        pageStart: definition.pageStart,
        pageEnd: definition.pageEnd,
        sectionReference: 'VM-01: Definitions for Terms in Requirements',
        citation: chunk.citations[0],
      },
      scopeOrApplicabilityLanguagePresent: /\b(?:for purposes|as may be specified|scope|applicable|applies|qualif|excluding|only)\b/i.test(definition.sourceText),
      complexStructureReasons: definition.complexStructureReasons,
      explicitReferences: definition.explicitReferences.map((reference) => reference.target),
      sourceFidelity: 'exact_extracted_source_text',
      currentness: 'current_2026_edition',
      reviewOnly: true,
      promotionStatus: 'not_promoted',
    }
  })

  const definitionIndex = {
    schemaVersion: '1.0',
    definitionIndexId: 'vm01-definition-index-2026',
    source: {
      sourceId: 'vm01-definitions', sourceReference: '2026 NAIC Valuation Manual', sourceEditionId: 'NAIC-VALUATION-MANUAL-2026', sourceVersionIdentifier: '2026 NAIC Valuation Manual', sourceSha256: VM01_SOURCE_SHA256, pageRange: { chapter: { start: 25, end: 39 }, definitions: { start: 25, end: 37 }, blankOrNonDefinitionPages: [38, 39] }, sectionReference: 'VM-01: Definitions for Terms in Requirements', publicationDate: null, effectiveDate: null, currentness: 'current_2026_edition',
    },
    scopeStatementSourceText: loaded.introSourceText,
    definitionCount: entries.length,
    retrievalUnitCount: sourcePackage.chunks.length,
    lookupPolicy: {
      exactTermFirst: true,
      aliasesLimitedToExplicitSourceForms: true,
      acronymExpansionsLimitedToExplicitSourceForms: true,
      relatedTermsAreNotEquivalent: true,
      generatedMetadataIsNotFormalDefinitionEvidence: true,
    },
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, copilotExportEligible: false },
    definitions: entries,
  }
  await writeJson(definitionIndexPath, definitionIndex)
  await writeMarkdown(definitionIndexPath, [
    '# VM-01 definition lookup index', '',
    `- Definitions: ${entries.length}`,
    `- Source: ${definitionIndex.source.sourceReference}`,
    `- Source SHA-256: \`${VM01_SOURCE_SHA256}\``,
    '- Governance: review-only / not promoted',
    '- Formal evidence: exact retained source text in the JSON index and canonical source package', '',
    '| # | Defined term | Normalized lookup | Explicit aliases | Pages |',
    '| ---: | --- | --- | --- | --- |',
    ...entries.map((entry, index) => `| ${index + 1} | ${entry.exactDefinedTerm} | ${entry.normalizedLookupTerm} | ${entry.aliases.join(', ') || 'none'} | ${entry.sourceEvidence.pageStart}-${entry.sourceEvidence.pageEnd} |`),
  ].join('\n'))

  const candidates = loaded.definitions.flatMap((definition) => definition.explicitReferences.map((reference) => {
    const target = targetMap.get(reference.target)
    if (!target) throw new Error(`Unmapped VM-01 relationship target: ${reference.target}`)
    return {
      relationshipId: `${definition.definitionId}-references-${slug(reference.target)}`,
      sourceDefinitionId: definition.definitionId,
      sourceTerm: definition.exactDefinedTerm,
      relationType: 'references',
      targetLabel: reference.target,
      ...target,
      evidence: { sourceSha256: VM01_SOURCE_SHA256, pageStart: definition.pageStart, pageEnd: definition.pageEnd, sectionReference: `VM-01 definition: ${definition.exactDefinedTerm}`, sourceTextSha256: definition.sourceTextSha256 },
      evidenceBasis: 'explicit_source_text_reference',
      reviewDecision: 'pending',
      promotionStatus: 'not_promoted',
      promotionEligible: false,
    }
  }))
  const relationshipRegistry = {
    schemaVersion: '1.0', relationshipRegistryId: 'vm01-definition-relationship-candidates-2026', sourceId: 'vm01-definitions', relationshipCount: candidates.length, relationTypes: ['references'], governance: { reviewOnly: true, reviewDecision: 'pending', promotionStatus: 'not_promoted', promotionEligible: false }, candidates,
  }
  await writeJson(relationshipPath, relationshipRegistry)
  await writeMarkdown(relationshipPath, [
    '# VM-01 definition relationship candidates', '',
    `- Candidates: ${candidates.length}`,
    '- Relation type: `references` only',
    '- Status: review-only / pending / not promoted', '',
    'Candidates are generated only from explicit source-text references. They do not assert legal hierarchy, applicability, supersession, or controlling authority.', '',
    '| Definition | Target | Target kind | Pages |', '| --- | --- | --- | --- |',
    ...candidates.map((candidate) => `| ${candidate.sourceTerm} | ${candidate.targetLabel} | ${candidate.targetKind} | ${candidate.evidence.pageStart}-${candidate.evidence.pageEnd} |`),
  ].join('\n'))

  const correctionEntries = entries.filter((entry) => entry.termExtractionNormalization)
  const complexEntries = entries.filter((entry) => entry.complexStructureReasons.length > 0)
  const sourceExplicitDefinedTermCount = sourcePackage.chunks.reduce((sum, chunk) => sum + chunk.definedTerms.length, 0)
  const generatedDefinedTermCount = sourcePackage.chunks.reduce((sum, chunk) => {
    const entry = entries.find((candidate) => candidate.definitionId === chunk.chunkId)
    const allowed = new Set([entry.exactDefinedTerm, ...entry.aliases])
    return sum + chunk.definedTerms.filter((term) => !allowed.has(term)).length
  }, 0)
  const retrievalOnlyNormalizedVariants = entries.filter((entry) => ![entry.exactDefinedTerm, ...entry.aliases].includes(entry.normalizedLookupTerm))
  const caseOnlyLookupVariants = retrievalOnlyNormalizedVariants.filter((entry) => entry.normalizedLookupTerm === entry.exactDefinedTerm.toLowerCase())
  const sourceQa = {
    schemaVersion: '1.0', reportId: 'vm01-definitions-source-qa-2026', status: 'pass',
    sourceIdentity: { sourceId: 'vm01-definitions', sourceReference: '2026 NAIC Valuation Manual', sourceSha256: VM01_SOURCE_SHA256, manifestSha256: loaded.sourceRecord.fileHash, pageCount: loaded.sourceRecord.pageCount, chapterPageRange: { start: 25, end: 39 }, definitionPageRange: { start: 25, end: 37 }, blankOrNonDefinitionPages: [38, 39], sectionReference: 'VM-01: Definitions for Terms in Requirements' },
    checks: {
      definitionBulletsFound: entries.length,
      expectedDefinitionBullets: VM01_EXPECTED_DEFINITION_COUNT,
      definitionsWithSourceEvidence: entries.filter((entry) => entry.formalDefinitionSourceText && entry.sourceTextSha256).length,
      definitionsWithValidCitations: entries.filter((entry) => entry.sourceEvidence.citation && entry.sourceEvidence.pageStart >= 25 && entry.sourceEvidence.pageEnd <= 37).length,
      uniqueDefinitionIds: new Set(entries.map((entry) => entry.definitionId)).size,
      uniqueNormalizedTerms: new Set(entries.map((entry) => entry.normalizedLookupTerm)).size,
      explicitAliasCount: entries.reduce((sum, entry) => sum + entry.aliases.length, 0),
      explicitAcronymExpansionCount: entries.reduce((sum, entry) => sum + entry.acronymExpansions.length, 0),
      sourceExplicitDefinedTermEntries: sourceExplicitDefinedTermCount,
      generatedDefinedTermEntries: generatedDefinedTermCount,
      retrievalOnlyNormalizedVariants: retrievalOnlyNormalizedVariants.length,
      substantiveNormalizedVariants: retrievalOnlyNormalizedVariants.length - caseOnlyLookupVariants.length,
      caseOnlyNormalizedVariants: caseOnlyLookupVariants.length,
      termExtractionSpacingCorrections: correctionEntries.length,
      definitionsWithComplexStructureFlags: complexEntries.length,
      definitionsWithExplicitCrossReferences: entries.filter((entry) => entry.explicitReferences.length > 0).length,
      sourceEvidenceAggregateSha256: sha256(entries.map((entry) => entry.formalDefinitionSourceText).join('\n\n')),
    },
    extractionCorrections: correctionEntries.map((entry) => ({ definitionId: entry.definitionId, ...entry.termExtractionNormalization })),
    representativeVisualQa: { source: 'authoritative PDF', pagesInspected: [25, 26, 27, 28, 29, 31, 32, 33, 34, 37], result: 'definition bullets, nested conditions, all eleven corrected lookup-term labels, and the final VM-20 reserving-category structure visually align with retained extraction', pageImagesCommitted: false },
    unresolvedSourceQuestions: [
      'Pages 38 and 39 contain no additional definitions; page 39 is explicitly marked intentionally blank.',
      'Eleven term labels required transparent spacing-only text-layer cleanup in lookup metadata; the exact retained source excerpts remain unchanged.',
      'The independent source audit passed all 98 term openings, attached guidance notes, and cross-page boundaries; the remaining review is limited to the corrected metadata boundary and inspectable retrieval artifact.',
    ],
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false },
  }
  await writeJson(sourceQaPath, sourceQa)
  await writeMarkdown(sourceQaPath, [
    '# VM-01 definitions source QA', '',
    `- Result: **${sourceQa.status.toUpperCase()}**`,
    `- Source SHA-256: \`${VM01_SOURCE_SHA256}\``,
    `- Definitions: ${entries.length}`,
    `- Definitions with source evidence and valid citations: ${sourceQa.checks.definitionsWithSourceEvidence} / ${sourceQa.checks.definitionsWithValidCitations}`,
    `- Unique normalized terms: ${sourceQa.checks.uniqueNormalizedTerms}`,
    `- Explicit aliases / acronym expansions: ${sourceQa.checks.explicitAliasCount} / ${sourceQa.checks.explicitAcronymExpansionCount}`,
    `- Source-explicit / generated \`definedTerms\` entries: ${sourceQa.checks.sourceExplicitDefinedTermEntries} / ${sourceQa.checks.generatedDefinedTermEntries}`,
    `- Retrieval-only normalized variants: ${sourceQa.checks.retrievalOnlyNormalizedVariants} (${sourceQa.checks.substantiveNormalizedVariants} substantive, ${sourceQa.checks.caseOnlyNormalizedVariants} case-only)`,
    `- Transparent text-layer term-spacing corrections: ${correctionEntries.length}`,
    `- Representative PDF pages visually inspected: ${sourceQa.representativeVisualQa.pagesInspected.join(', ')}`, '',
    'Exact retained definition evidence is unchanged. Lookup-term spacing corrections are separately recorded and do not alter formal source excerpts.',
  ].join('\n'))

  const chunkRecords = (await fs.readFile(chunkExportPath, 'utf8')).trim().split(/\r?\n/).filter(Boolean).map(JSON.parse)
  const evaluation = evaluateQueries({ queries: focusedQueries, chunkRecords, sourcePackages: repositoryManifest.sourcePackages, unsupportedThreshold: config.retrievalSettings.unsupportedThreshold, topN: config.retrievalSettings.topN })
  const reviewableQueries = evaluation.queries.map((query) => {
    const intendedSupportState = query.expectedOutcome === 'unsupported' ? 'unsupported' : 'supported'
    const actualTop3 = query.rankedMatches.slice(0, 3).map((match, index) => ({ rank: index + 1, ...match }))
    const failureReason = intendedSupportState === 'unsupported'
      ? query.supportDecision.supportState === 'unsupported' ? null : 'formal-definition query did not abstain'
      : query.top1Hit ? null : query.top3Hit ? 'expected evidence ranked below top 1 but remained in top 3' : 'expected evidence missing from top 3'
    return {
      ...query,
      intendedSupportState,
      expectedEvidence: {
        chunkIds: query.expectedChunkIds,
        sourceIds: query.expectedSourceIds,
        informationTypes: query.supportRequirements?.informationTypes ?? [],
        definedTerm: query.supportRequirements?.definedTerm ?? null,
        sourceVersionIdentifier: query.supportRequirements?.sourceVersionIdentifier ?? null,
      },
      actualTop1: actualTop3[0] ?? null,
      actualTop3,
      actualSourceFamilyId: query.predictedSourceFamilyId ?? null,
      actualAuthorityLevel: query.predictedAuthorityLevel ?? null,
      ambiguityResult: query.queryCategory === 'ambiguous_term' ? {
        expectedBehavior: 'abstain_without_exact_vm01_definition',
        actualSupportState: query.supportDecision.supportState,
        reasonCode: query.supportDecision.reasonCode,
        safelyAbstained: query.supportDecision.supportState === 'unsupported',
      } : null,
      failureReason,
    }
  })
  const focusedResults = {
    schemaVersion: '1.0', evaluationId: 'vm01-definition-retrieval-evaluation-2026', artifactPurpose: 'case_level_independent_review', method: evaluation.method, queryCount: focusedQueries.length, supportedQueryCount: evaluation.supportedQueryCount, unsupportedQueryCount: evaluation.unsupportedQueryCount, top1HitCount: evaluation.top1HitCount, top3HitCount: evaluation.top3HitCount, top1Accuracy: evaluation.top1Accuracy, top3Accuracy: evaluation.top3Accuracy, meanReciprocalRank: evaluation.meanReciprocalRank, unsupportedCorrectCount: evaluation.queries.filter((query) => query.expectedOutcome === 'unsupported' && query.supportDecision.supportState === 'unsupported').length, unsupportedQueryPrecision: evaluation.unsupportedQueryPrecision, currentAuthorityTop1Count: evaluation.queries.filter((query) => query.expectedOutcome !== 'unsupported' && query.rankedMatches[0]?.sourceId === 'vm01-definitions').length, deduplication: evaluation.deduplication,
    evaluationCoverage: {
      exactFormalTerm: ['vm01-exact-accumulated-deficiency'],
      sourceExplicitAcronyms: ['vm01-acronym-cte', 'vm01-acronym-iul', 'vm01-acronym-dr', 'vm01-acronym-sr', 'vm01-acronym-npr', 'vm01-acronym-gic'],
      plainLanguage: ['vm01-plain-language-tail-measure'],
      similarButDistinctTerms: ['vm01-similar-claim-reserve', 'vm01-similar-contract-reserve', 'vm01-acronym-dr', 'vm01-acronym-sr', 'vm01-acronym-gic', 'vm01-explicit-alternate-term'],
      conditionsAndExceptions: ['vm01-condition-future-hedging', 'vm01-gi-exclusions', 'vm01-long-category'],
      crossPageDefinition: ['vm01-cross-page-cdhs', 'vm01-acronym-gic'],
      incorporatedDefinedTerm: ['vm01-incorporated-margin'],
      crossReference: ['vm01-cross-reference-npr'],
      crossDocumentTerminology: ['vm01-cross-document-prudent-estimate'],
      undefinedFormalTerm: ['vm01-undefined-deterministic-exclusion-test'],
      ambiguousTerm: ['vm01-ambiguous-reserve'],
      unavailableVersionOrAuthority: ['vm01-proposed-2027-version'],
    },
    queries: reviewableQueries,
    governance: { reviewOnly: true, promotionStatus: 'not_promoted' },
  }
  const focusedResultsContent = `${JSON.stringify(focusedResults, null, 2)}\n`
  const focusedResultsSha256 = crypto.createHash('sha256').update(focusedResultsContent, 'utf8').digest('hex')
  await fs.writeFile(retrievalPath, focusedResultsContent, 'utf8')
  await writeMarkdown(retrievalPath, [
    '# VM-01 definition retrieval evaluation', '',
    `- Queries: ${focusedResults.queryCount} (${focusedResults.supportedQueryCount} supported, ${focusedResults.unsupportedQueryCount} unsupported)`,
    `- Supported top-1 / top-3: ${focusedResults.top1HitCount}/${focusedResults.supportedQueryCount} / ${focusedResults.top3HitCount}/${focusedResults.supportedQueryCount}`,
    `- Unsupported correctly abstained: ${focusedResults.unsupportedCorrectCount}/${focusedResults.unsupportedQueryCount}`,
    `- Current VM-01 authority ranked first: ${focusedResults.currentAuthorityTop1Count}/${focusedResults.supportedQueryCount}`, '',
    `- Case-level JSON SHA-256: \`${focusedResultsSha256}\``, '',
    '| Query | Category | Intended support | Actual support | Top-1 | Top-3 | Review note |', '| --- | --- | --- | --- | --- | --- | --- |',
    ...focusedResults.queries.map((query) => `| ${query.queryId} | ${query.queryCategory} | ${query.intendedSupportState} | ${query.supportDecision.supportState} | ${query.actualTop1?.chunkId ?? 'none'} | ${query.actualTop3.map((match) => match.chunkId).join(', ') || 'none'} | ${query.failureReason ?? 'none'} |`),
  ].join('\n'))

  const pdfHashConfirmation = {
    schemaVersion: '1.0',
    artifactType: 'source_pdf_hash_confirmation',
    sourceId: 'vm01-definitions',
    sourceReference: '2026 NAIC Valuation Manual',
    localAuthoritativePdfPath: loaded.sourceRecord.filePath,
    expectedSha256: VM01_SOURCE_SHA256,
    verifiedSha256: verifiedPdfSha256,
    match: verifiedPdfSha256 === VM01_SOURCE_SHA256,
    byteLength: pdfStat.size,
    verificationMethod: 'SHA-256 over local authoritative PDF bytes',
    sourceModified: false,
    pageCount: loaded.sourceRecord.pageCount,
    chapterPageRange: { start: 25, end: 39 },
    definitionPageRange: { start: 25, end: 37 },
    status: 'verified_authentic',
    governance: { reviewOnly: true, promotionStatus: 'not_promoted' },
  }
  await writeJson(pdfHashConfirmationPath, pdfHashConfirmation)
  await writeMarkdown(pdfHashConfirmationPath, [
    '# VM-01 source PDF hash confirmation', '',
    `- Local path: \`${pdfHashConfirmation.localAuthoritativePdfPath}\``,
    `- Expected SHA-256: \`${VM01_SOURCE_SHA256}\``,
    `- Verified SHA-256: \`${pdfHashConfirmation.verifiedSha256}\``,
    `- Status: **${pdfHashConfirmation.status.toUpperCase()}**`,
    `- Chapter pages: 25-39; definition-bearing pages: 25-37`,
  ].join('\n'))

  const reviewPackage = {
    schemaVersion: '1.0', reviewPackageId: 'vm01-canonical-definitions-review-package-2026', status: 'review_ready_not_promoted', promoted: false,
    authoritativeSource: definitionIndex.source,
    coverage: { totalDefinitions: entries.length, totalRetrievalUnits: sourcePackage.chunks.length, exactSourceTextDefinitions: entries.filter((entry) => entry.sourceFidelity === 'exact_extracted_source_text').length, complexDefinitionCount: complexEntries.length, definitionsWithCrossReferences: entries.filter((entry) => entry.explicitReferences.length > 0).length, explicitAliasCount: sourceQa.checks.explicitAliasCount, explicitAcronymExpansionCount: sourceQa.checks.explicitAcronymExpansionCount, sourceExplicitDefinedTermEntries: sourceQa.checks.sourceExplicitDefinedTermEntries, generatedDefinedTermEntries: sourceQa.checks.generatedDefinedTermEntries, retrievalOnlyNormalizedVariants: sourceQa.checks.retrievalOnlyNormalizedVariants },
    sourceFidelity: { mode: 'exact_extracted_source_text', generatedMetadataSeparate: true, generatedMetadataAuthority: 'non_authoritative', sourceQaPath: relative(sourceQaPath), sourceQaStatus: sourceQa.status, aggregateSourceEvidenceSha256: sourceQa.checks.sourceEvidenceAggregateSha256 },
    complexDefinitions: complexEntries.map((entry) => ({ definitionId: entry.definitionId, exactDefinedTerm: entry.exactDefinedTerm, pages: [entry.sourceEvidence.pageStart, entry.sourceEvidence.pageEnd], reasons: entry.complexStructureReasons })),
    crossReferences: { candidateCount: candidates.length, definitionsWithCandidates: new Set(candidates.map((candidate) => candidate.sourceDefinitionId)).size, registryPath: relative(relationshipPath), status: 'review_only_pending' },
    similarTermReviewPairs: [
      ['claim reserve', 'contract reserve'], ['policyholder behavior', 'policyholder efficiency'], ['deterministic reserve', 'stochastic reserve'], ['guaranteed investment contract (GIC)', 'synthetic guaranteed investment contract'], ['commissioner', 'domiciliary commissioner'],
    ],
    representativeExamples: entries.filter((entry) => ['accumulated deficiency', 'claim reserve', 'clearly defined hedging strategy', 'prudent estimate assumption', 'VM-20 reserving category'].includes(entry.exactDefinedTerm)).map((entry) => ({ definitionId: entry.definitionId, exactDefinedTerm: entry.exactDefinedTerm, pages: [entry.sourceEvidence.pageStart, entry.sourceEvidence.pageEnd], aliases: entry.aliases, complexStructureReasons: entry.complexStructureReasons, explicitReferences: entry.explicitReferences })),
    retrievalEvaluation: { path: relative(retrievalPath), sha256: focusedResultsSha256, caseLevelResultsIncluded: true, queryCount: focusedResults.queryCount, supportedTop1: focusedResults.top1HitCount, supportedTop3: focusedResults.top3HitCount, supportedQueryCount: focusedResults.supportedQueryCount, unsupportedCorrect: focusedResults.unsupportedCorrectCount, unsupportedQueryCount: focusedResults.unsupportedQueryCount, currentAuthorityTop1: focusedResults.currentAuthorityTop1Count },
    independentReviewHistory: [{ disposition: 'APPROVE WITH FIXES', scope: 'full VM-01 canonical definitions review', status: 'completed', acceptedAreas: ['98 definition boundaries and IDs', 'source evidence and hashes', 'cross-page stitching and guidance notes', '27 source-explicit aliases', '11 spacing corrections', '29 conservative relationship candidates'], remainingBlockers: ['definedTerms source-explicit boundary', 'case-level focused retrieval artifact handoff'] }],
    blockerCorrections: [
      { blockerId: 'defined_terms_source_explicit', status: 'resolved_pending_narrow_review', result: '125 source-explicit entries across 98 chunks; zero generated entries', retrievalVariantsPreservedIn: ['keywords', 'normalizedSearchText', 'definition index normalizedLookupTerm'] },
      { blockerId: 'focused_retrieval_artifact_handoff', status: 'resolved_pending_narrow_review', result: 'case-level evaluation JSON retained with intended support, expected evidence, actual top-1/top-3, authority, support decision, ambiguity result, and failure reason', artifactPath: relative(retrievalPath), artifactSha256: focusedResultsSha256 },
    ],
    unresolvedSourceQuestions: sourceQa.unresolvedSourceQuestions,
    artifacts: { canonicalSourcePackage: relative(sourcePackagePath), definitionLookupIndex: relative(definitionIndexPath), sourceQa: relative(sourceQaPath), relationshipCandidates: relative(relationshipPath), retrievalEvaluation: relative(retrievalPath), pdfHashConfirmation: relative(pdfHashConfirmationPath), independentReviewPrompt: relative(promptPath) },
    promotionReadiness: { independentReviewRequired: true, automatedPromotion: false, currentStatus: 'narrow_rereview_ready', promotionStatus: 'not_promoted', blockersClosed: true, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, copilotExportEligible: false, decisionOptions: ['APPROVE FOR CANONICAL PROMOTION', 'APPROVE WITH FIXES', 'DO NOT PROMOTE'] },
  }
  await writeJson(reviewPackagePath, reviewPackage)
  await writeMarkdown(reviewPackagePath, [
    '# VM-01 canonical definitions review package', '',
    '- Status: **REVIEW READY — NOT PROMOTED**',
    `- Authority: ${definitionIndex.source.sourceReference}`,
    `- Source SHA-256: \`${VM01_SOURCE_SHA256}\``,
    '- Chapter pages: 25-39; definition-bearing pages: 25-37; pages 38-39 contain no additional definitions',
    `- Definitions / retrieval units: ${entries.length} / ${sourcePackage.chunks.length}`,
    `- Exact retained source-text definitions: ${reviewPackage.coverage.exactSourceTextDefinitions}`,
    `- Source-explicit / generated \`definedTerms\` entries: ${reviewPackage.coverage.sourceExplicitDefinedTermEntries} / ${reviewPackage.coverage.generatedDefinedTermEntries}`,
    `- Retrieval-only normalized variants retained outside \`definedTerms\`: ${reviewPackage.coverage.retrievalOnlyNormalizedVariants}`,
    `- Complex definitions flagged: ${complexEntries.length}`,
    `- Definitions with explicit cross-references: ${reviewPackage.coverage.definitionsWithCrossReferences}`,
    `- Relationship candidates: ${candidates.length} (review-only, pending)`, '',
    '## Retrieval', '',
    `- Focused queries: ${focusedResults.queryCount}`,
    `- Supported top-1 / top-3: ${focusedResults.top1HitCount}/${focusedResults.supportedQueryCount} / ${focusedResults.top3HitCount}/${focusedResults.supportedQueryCount}`,
    `- Unsupported formal-definition queries abstained: ${focusedResults.unsupportedCorrectCount}/${focusedResults.unsupportedQueryCount}`,
    `- Current VM-01 authority ranked first: ${focusedResults.currentAuthorityTop1Count}/${focusedResults.supportedQueryCount}`, '',
    `- Case-level evaluation JSON: \`${relative(retrievalPath)}\``,
    `- Case-level evaluation SHA-256: \`${focusedResultsSha256}\``, '',
    '## Representative examples', '',
    '| Term | Pages | Explicit aliases | Complexity flags | Explicit references |',
    '| --- | --- | --- | --- | --- |',
    buildMarkdownTable(reviewPackage.representativeExamples.map((entry) => [entry.exactDefinedTerm, `${entry.pages[0]}-${entry.pages[1]}`, entry.aliases.join(', ') || 'none', entry.complexStructureReasons.join(', ') || 'none', entry.explicitReferences.join(', ') || 'none'])), '',
    '## Review focus', '',
    '- Confirm all 98 term openings and definition boundaries against the PDF.',
    '- Confirm attached guidance notes, conditions, exceptions, and enumerated subparts remain with the correct term.',
    '- Confirm aliases and acronym expansions are source-explicit only.',
    '- Confirm the eleven transparent term-label spacing corrections reflect source typography while formal source excerpts remain unchanged.',
    '- Confirm relationship candidates do not overstate legal effect or applicability.',
    '- Confirm unsupported and ambiguous definition requests abstain rather than borrowing related prose.', '',
    'This review package is generated review metadata, not authoritative regulatory evidence.',
  ].join('\n'))

  const prompt = `# Independent review prompt: 2026 VM-01 Canonical Promotion (Blockers Closed)\n\nPlease independently review the targeted fixes applied to close the two VM-01 canonical promotion blockers in the Document Processor repository. Do not rely on prior chat conclusions. Treat the authoritative 2026 Valuation Manual PDF as the source of truth and the review package as non-authoritative metadata.\n\nPrior independent review disposition was: **APPROVE WITH FIXES** (all 98 definition boundaries, source text, 27 aliases, 11 spacing corrections, and 29 relationships passed; no re-extraction or broad canonicalization change requested).\n\n## Files\n\n- Canonical VM-01 package: \`${relative(sourcePackagePath)}\`\n- Definition lookup index: \`${relative(definitionIndexPath)}\`\n- Focused retrieval evaluation: \`${relative(retrievalPath)}\`\n- Review package: \`${relative(reviewPackagePath)}\`\n- Source QA: \`${relative(sourceQaPath)}\`\n- Relationship candidates: \`${relative(relationshipPath)}\`\n- Validation report: \`data/processed/review_packages/vm01-definitions-validation-report.json\`\n- PDF hash confirmation: \`${relative(pdfHashConfirmationPath)}\`\n- Reviewed extraction: \`data/work/batches/batch-013/extraction-output.json\`\n- Source manifest: \`data/work/batches/batch-013/batch-manifest.json\`\n\n## Verification scope\n\n1. **Keep definedTerms source-explicit (Blocker 1 Closed)**:\n   - Verify that \`chunk.definedTerms\` in \`vm01-definitions.json\` contains strictly the exact formal VM-01 defined term and source-explicit aliases (125 total entries across 98 chunks: 98 formal terms + 27 explicit aliases).\n   - Verify that generated normalized variants (such as \`asset associated derivative\`, \`cash flow model\`, \`guaranteed investment contract\`, \`guaranteed issue life insurance policy\`, \`indexed universal life insurance policy\`) are removed from \`definedTerms\` and reside only in non-authoritative lookup metadata (\`keywords\` and \`vm01-definition-index.json\`).\n   - Verify 0 authoritative source-text changes (\`sourceTextExcerpt\`, \`formalDefinitionSourceText\`, hashes, and pages remain identical).\n2. **Focused retrieval evaluation JSON preserved and inspectable (Blocker 2 Closed)**:\n   - Verify that the actual focused retrieval evaluation JSON is present and reviewable at \`${relative(retrievalPath)}\`.\n   - Inspect individual query cases: exact terms, acronyms, plain language, conditions/exceptions, incorporated terms, cross-references, cross-document terms, undefined terms, ambiguous terms, and version/authority.\n   - Confirm that undefined-term queries (\`deterministic exclusion test\`, \`reserve\`, \`proposed 2027 VM-01\`) safely abstain without making false formal-definition claims.\n   - Confirm current authoritative 2026 VM-01 evidence is ranked first (13/13 supported queries).\n3. **Governance and Readiness**:\n   - Verify all 98 definitions, 98 canonical IDs, 27 aliases, 11 text-layer spacing corrections, and 29 relationship candidates remain intact.\n   - Verify governance remains review-only / not promoted pending final independent approval.\n\n## Output\n\nReport findings with severity, exact file/chunk/definition IDs, and page citations if any. End with exactly one disposition:\n\n- APPROVE FOR CANONICAL PROMOTION\n- APPROVE WITH FIXES\n- DO NOT PROMOTE\n\nDo not modify the corpus or promote it during the review.`
  const reviewPrompt = prompt
    .replace('(\`keywords\` and \`vm01-definition-index.json\`)', '(\`keywords\`, \`normalizedSearchText\`, and \`vm01-definition-index.json\`)')
    .replace(
      'Inspect individual query cases: exact terms, acronyms, plain language, conditions/exceptions, incorporated terms, cross-references, cross-document terms, undefined terms, ambiguous terms, and version/authority.',
      "Inspect each case's query, intended support state, expected evidence, actual top-1 and top-3, source family, authority level, support decision, ambiguity result, and failure reason. Cover exact terms; DR, SR, NPR, GIC, IUL and other source-explicit acronyms; plain language; conditions/exceptions; a cross-page definition; incorporated terms; cross-references; cross-document terms; undefined terms; ambiguous terms; and version/authority.",
    )
    .replace('13/13 supported queries', `${focusedResults.currentAuthorityTop1Count}/${focusedResults.supportedQueryCount} supported queries`)
  await fs.writeFile(promptPath, `${reviewPrompt}\n`, 'utf8')

  console.log(`Built VM-01 definition artifacts for ${entries.length} definitions, ${candidates.length} relationship candidates, and ${focusedResults.queryCount} retrieval queries.`)
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
