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

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const writeJson = async (filePath, value) => fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
const writeMarkdown = async (jsonPath, content) => fs.writeFile(jsonPath.replace(/\.json$/, '.md'), `${content.trim()}\n`, 'utf8')
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
      'Independent source review should confirm all 98 term openings, attached guidance notes, and cross-page boundaries before promotion.',
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
    `- Transparent text-layer term-spacing corrections: ${correctionEntries.length}`,
    `- Representative PDF pages visually inspected: ${sourceQa.representativeVisualQa.pagesInspected.join(', ')}`, '',
    'Exact retained definition evidence is unchanged. Lookup-term spacing corrections are separately recorded and do not alter formal source excerpts.',
  ].join('\n'))

  const chunkRecords = (await fs.readFile(chunkExportPath, 'utf8')).trim().split(/\r?\n/).filter(Boolean).map(JSON.parse)
  const evaluation = evaluateQueries({ queries: focusedQueries, chunkRecords, sourcePackages: repositoryManifest.sourcePackages, unsupportedThreshold: config.retrievalSettings.unsupportedThreshold, topN: config.retrievalSettings.topN })
  const focusedResults = {
    schemaVersion: '1.0', evaluationId: 'vm01-definition-retrieval-evaluation-2026', method: evaluation.method, queryCount: focusedQueries.length, supportedQueryCount: evaluation.supportedQueryCount, unsupportedQueryCount: evaluation.unsupportedQueryCount, top1HitCount: evaluation.top1HitCount, top3HitCount: evaluation.top3HitCount, top1Accuracy: evaluation.top1Accuracy, top3Accuracy: evaluation.top3Accuracy, meanReciprocalRank: evaluation.meanReciprocalRank, unsupportedCorrectCount: evaluation.queries.filter((query) => query.expectedOutcome === 'unsupported' && query.supportDecision.supportState === 'unsupported').length, unsupportedQueryPrecision: evaluation.unsupportedQueryPrecision, currentAuthorityTop1Count: evaluation.queries.filter((query) => query.expectedOutcome !== 'unsupported' && query.rankedMatches[0]?.sourceId === 'vm01-definitions').length, deduplication: evaluation.deduplication, queries: evaluation.queries, governance: { reviewOnly: true, promotionStatus: 'not_promoted' },
  }
  await writeJson(retrievalPath, focusedResults)
  await writeMarkdown(retrievalPath, [
    '# VM-01 definition retrieval evaluation', '',
    `- Queries: ${focusedResults.queryCount} (${focusedResults.supportedQueryCount} supported, ${focusedResults.unsupportedQueryCount} unsupported)`,
    `- Supported top-1 / top-3: ${focusedResults.top1HitCount}/${focusedResults.supportedQueryCount} / ${focusedResults.top3HitCount}/${focusedResults.supportedQueryCount}`,
    `- Unsupported correctly abstained: ${focusedResults.unsupportedCorrectCount}/${focusedResults.unsupportedQueryCount}`,
    `- Current VM-01 authority ranked first: ${focusedResults.currentAuthorityTop1Count}/${focusedResults.supportedQueryCount}`, '',
    '| Query | Category | Result | Support | Top evidence |', '| --- | --- | --- | --- | --- |',
    ...focusedResults.queries.map((query) => `| ${query.queryId} | ${query.queryCategory} | ${query.resultLabel} | ${query.supportDecision.supportState} | ${query.rankedMatches[0]?.chunkId ?? 'none'} |`),
  ].join('\n'))

  const reviewPackage = {
    schemaVersion: '1.0', reviewPackageId: 'vm01-canonical-definitions-review-package-2026', status: 'review_ready_not_promoted', promoted: false,
    authoritativeSource: definitionIndex.source,
    coverage: { totalDefinitions: entries.length, totalRetrievalUnits: sourcePackage.chunks.length, exactSourceTextDefinitions: entries.filter((entry) => entry.sourceFidelity === 'exact_extracted_source_text').length, complexDefinitionCount: complexEntries.length, definitionsWithCrossReferences: entries.filter((entry) => entry.explicitReferences.length > 0).length, explicitAliasCount: sourceQa.checks.explicitAliasCount, explicitAcronymExpansionCount: sourceQa.checks.explicitAcronymExpansionCount },
    sourceFidelity: { mode: 'exact_extracted_source_text', generatedMetadataSeparate: true, generatedMetadataAuthority: 'non_authoritative', sourceQaPath: relative(sourceQaPath), sourceQaStatus: sourceQa.status, aggregateSourceEvidenceSha256: sourceQa.checks.sourceEvidenceAggregateSha256 },
    complexDefinitions: complexEntries.map((entry) => ({ definitionId: entry.definitionId, exactDefinedTerm: entry.exactDefinedTerm, pages: [entry.sourceEvidence.pageStart, entry.sourceEvidence.pageEnd], reasons: entry.complexStructureReasons })),
    crossReferences: { candidateCount: candidates.length, definitionsWithCandidates: new Set(candidates.map((candidate) => candidate.sourceDefinitionId)).size, registryPath: relative(relationshipPath), status: 'review_only_pending' },
    similarTermReviewPairs: [
      ['claim reserve', 'contract reserve'], ['policyholder behavior', 'policyholder efficiency'], ['deterministic reserve', 'stochastic reserve'], ['guaranteed investment contract (GIC)', 'synthetic guaranteed investment contract'], ['commissioner', 'domiciliary commissioner'],
    ],
    representativeExamples: entries.filter((entry) => ['accumulated deficiency', 'claim reserve', 'clearly defined hedging strategy', 'prudent estimate assumption', 'VM-20 reserving category'].includes(entry.exactDefinedTerm)).map((entry) => ({ definitionId: entry.definitionId, exactDefinedTerm: entry.exactDefinedTerm, pages: [entry.sourceEvidence.pageStart, entry.sourceEvidence.pageEnd], aliases: entry.aliases, complexStructureReasons: entry.complexStructureReasons, explicitReferences: entry.explicitReferences })),
    retrievalEvaluation: { path: relative(retrievalPath), queryCount: focusedResults.queryCount, supportedTop1: focusedResults.top1HitCount, supportedQueryCount: focusedResults.supportedQueryCount, unsupportedCorrect: focusedResults.unsupportedCorrectCount, unsupportedQueryCount: focusedResults.unsupportedQueryCount, currentAuthorityTop1: focusedResults.currentAuthorityTop1Count },
    unresolvedSourceQuestions: sourceQa.unresolvedSourceQuestions,
    artifacts: { canonicalSourcePackage: relative(sourcePackagePath), definitionLookupIndex: relative(definitionIndexPath), sourceQa: relative(sourceQaPath), relationshipCandidates: relative(relationshipPath), retrievalEvaluation: relative(retrievalPath), independentReviewPrompt: relative(promptPath) },
    promotionReadiness: { independentReviewRequired: true, automatedPromotion: false, currentStatus: 'review_only', promotionStatus: 'not_promoted', blockersClosed: false, learnerFacingAllowed: false, appReadyAllowed: false, ragReadyAllowed: false, copilotExportEligible: false, decisionOptions: ['APPROVE FOR CANONICAL PROMOTION', 'APPROVE WITH FIXES', 'DO NOT PROMOTE'] },
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
    `- Complex definitions flagged: ${complexEntries.length}`,
    `- Definitions with explicit cross-references: ${reviewPackage.coverage.definitionsWithCrossReferences}`,
    `- Relationship candidates: ${candidates.length} (review-only, pending)`, '',
    '## Retrieval', '',
    `- Focused queries: ${focusedResults.queryCount}`,
    `- Supported top-1: ${focusedResults.top1HitCount}/${focusedResults.supportedQueryCount}`,
    `- Unsupported formal-definition queries abstained: ${focusedResults.unsupportedCorrectCount}/${focusedResults.unsupportedQueryCount}`,
    `- Current VM-01 authority ranked first: ${focusedResults.currentAuthorityTop1Count}/${focusedResults.supportedQueryCount}`, '',
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

  const prompt = `# Independent review prompt: 2026 VM-01 Definitions\n\nPlease independently review the VM-01 canonicalization in the Document Processor repository. Do not rely on prior chat conclusions. Treat the authoritative 2026 Valuation Manual PDF as the source of truth and the review package as non-authoritative metadata.\n\n## Files\n\n- Canonical VM-01 package: \`${relative(sourcePackagePath)}\`\n- Definition lookup index: \`${relative(definitionIndexPath)}\`\n- Review package: \`${relative(reviewPackagePath)}\`\n- Source QA: \`${relative(sourceQaPath)}\`\n- Retrieval evaluation: \`${relative(retrievalPath)}\`\n- Relationship candidates: \`${relative(relationshipPath)}\`\n- Reviewed extraction: \`data/work/batches/batch-013/extraction-output.json\`\n- Source manifest: \`data/work/batches/batch-013/batch-manifest.json\`\n\n## Required review\n\n1. Verify source identity, 2026 edition, SHA-256, VM-01 chapter pages 25-39, definition-bearing pages 25-37, and the absence of additional definitions on pages 38-39.\n2. Verify that all 98 definitions are present exactly once and that each formal source excerpt is faithful to the PDF.\n3. Verify each exact term boundary, including cross-page entries, attached guidance notes, enumerated conditions, exceptions, and the complete VM-20 reserving-category definition.\n4. Verify that aliases and acronym expansions are included only when the source explicitly provides them; reject inferred colloquial or related forms.\n5. Review the eleven recorded text-layer term-spacing corrections against the visible PDF and confirm that only lookup metadata is corrected while exact source evidence is unchanged.\n6. Check similar but distinct terms, especially claim reserve versus contract reserve, policyholder behavior versus policyholder efficiency, deterministic reserve versus stochastic reserve, and guaranteed investment contract versus synthetic guaranteed investment contract.\n7. Review every relationship candidate. Confirm that each has explicit source evidence and that no candidate asserts hierarchy, supersession, legal effect, or applicability beyond that evidence.\n8. Re-run or inspect the focused retrieval evaluation. Confirm exact-term, acronym, plain-language, condition/exception, incorporated-term, cross-reference, cross-document, ambiguous, unavailable-version, and undefined-term behavior.\n9. Confirm that a request for a term not formally defined in VM-01 abstains even when semantically related prose exists elsewhere. Related evidence may be shown only as related evidence, not as a formal definition.\n10. Confirm that current authoritative VM-01 evidence outranks secondary explanatory material for formal-definition questions.\n11. Confirm governance remains review-only / not promoted and that learner-facing, app, RAG, vector, and Copilot export permissions remain blocked.\n\n## Output\n\nReport findings with severity, exact file/chunk/definition IDs, page citations, and proposed corrections. End with exactly one disposition:\n\n- APPROVE FOR CANONICAL PROMOTION\n- APPROVE WITH FIXES\n- DO NOT PROMOTE\n\nDo not modify the corpus or promote it during the review.`
  await fs.writeFile(promptPath, `${prompt}\n`, 'utf8')

  console.log(`Built VM-01 definition artifacts for ${entries.length} definitions, ${candidates.length} relationship candidates, and ${focusedResults.queryCount} retrieval queries.`)
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
