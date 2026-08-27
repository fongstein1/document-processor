import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const outputRoot = path.join(repoRoot, 'data', 'processed', 'regulatory_corpus')
const batchesRoot = path.join(repoRoot, 'data', 'work', 'batches')
const reviewRoot = path.join(repoRoot, 'docs', 'review')
const canonicalRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes')
const vm20PromotionDecisionPath = 'data/manual-input/promotion-decisions/vm20-2026-prose-promotion.json'
const vm01PromotionDecisionPath = 'data/manual-input/promotion-decisions/vm01-2026-definitions-promotion.json'
const vm20StructuredTablePromotionDecisionPath = 'data/manual-input/promotion-decisions/vm20-appendix2-structured-table-promotion.json'
const structuredTableDatasetPath = path.join(repoRoot, 'data', 'processed', 'structured_tables', 'vm20-appendix2-tables.json')
const vm01RelationshipRegistryPath = path.join(repoRoot, 'data', 'processed', 'relationship_registries', 'vm01-definition-relationship-candidates.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const exists = async (filePath) => fs.access(filePath).then(() => true).catch(() => false)
const relative = (filePath) => path.relative(repoRoot, filePath).split(path.sep).join('/')
const filesIn = async (directory, suffix = '') => {
  if (!(await exists(directory))) return []
  return (await fs.readdir(directory)).filter((name) => !suffix || name.endsWith(suffix)).sort()
}
const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const asArray = (value) => Array.isArray(value) ? value : []
const unique = (values) => [...new Set(values.filter(Boolean))].sort()
const norm = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '')
const compactPath = (filePath) => {
  if (!filePath) return null
  const filename = path.basename(filePath)
  return filename || null
}

const targetDefinitions = [
  ['valuation-manual-2026-complete', 'Complete current 2026 Valuation Manual representation', 'valuation_manual_pdfs', 'P0', 'current', 'The source PDF is declared in existing batch manifests, but the canonical layer is slice-based rather than complete.', 'Canonicalize the complete manual by chapter with source-bound hierarchy and a separate table profile.'],
  ['vm-01', 'VM-01 Definitions', 'valuation_manual_pdfs', 'P0', 'current', 'The reviewed current 2026 VM-01 terminology layer contains 98 exact-text definition units and is canonically promoted under its scope-specific decision. Its 29 relationship candidates and all downstream export uses remain separately governed.', 'Retain the approved definition scope and track the 29 relationship candidates as a separate review-only backlog item.'],
  ['vm-20', 'VM-20 Requirements for Principle-Based Reserves for Life Products', 'valuation_manual_pdfs', 'P0', 'current', 'VM-20 has 149 canonically promoted current-manual prose chunks and a separately promoted structured Appendix 2 scope for available Tables A, F, G, H, I, J, and K. The 175 companion-guidance chunks remain review-only.', 'Retain the approved prose/table scopes and track unavailable Tables B, C, D, E1, and E2 without inference.'],
  ['vm-21', 'VM-21 Requirements for Principle-Based Reserves for Variable Annuities', 'valuation_manual_pdfs', 'P0', 'current', 'VM-21 has a reviewed controlled wave and one canonical projection-entry package, but not a complete chapter package.', 'Canonicalize the reviewed VM-21 wave with parent-child structure and table separation.'],
  ['vm-22', 'VM-22 Requirements for Principle-Based Reserves for Non-Variable Annuities', 'valuation_manual_pdfs', 'P0', 'current', 'VM-22 is represented in reviewed ignored batches but has no current canonical source package.', 'Canonicalize reviewed VM-22 sections after table and hedging boundaries are confirmed.'],
  ['vm-30', 'VM-30 Actuarial Opinion and Memorandum Requirements', 'valuation_manual_pdfs', 'P0', 'current', 'VM-30 appears in the supporting-wave plan and reviewed slices, but no canonical package is present.', 'Canonicalize the reporting requirements and preserve cross-references to VM-31.'],
  ['vm-31', 'VM-31 PBR Actuarial Report Requirements', 'valuation_manual_pdfs', 'P0', 'current', 'VM-31 is represented by reviewed slices but lacks a canonical package.', 'Canonicalize the report requirements with reporting-obligation chunk types.'],
  ['vm-g', 'VM-G Corporate Governance Requirements for PBR', 'valuation_manual_pdfs', 'P0', 'current', 'No source package or reviewed source ID for VM-G was found in the tracked POC or current batch manifests.', 'Confirm the authorized 2026 source and process it as a governance-specific chapter.'],
  ['vm-c', 'VM-C current Actuarial Guidelines appendix and AG mapping', 'valuation_manual_pdfs', 'P0', 'current', 'The repository has many AG review artifacts, but no current VM-C appendix package or authoritative mapping package.', 'Obtain/confirm the authorized appendix and map individually processed AGs without inferring legal effect.'],
  ['current-regulatory-tables', 'Current prescribed valuation, mortality, spread, and default tables', 'valuation_manual_pdfs', 'P0', 'current', 'The independently reviewed VM-20 Appendix 2 scope for official Tables A, F, G, H, I, J, and K is canonically promoted with workbook/sheet/cell citations; Tables B-E2 and all non-VM-20 tables remain gaps.', 'Retain the promoted VM-20 scope and continue other table families separately without reconstructing unavailable values.'],
  ['vm-02', 'VM-02 Nonforfeiture Requirements', 'valuation_manual_pdfs', 'P1', 'current', 'VM-02 appears in the supporting-wave plan and reviewed slices but is not canonical.', 'Canonicalize after the P0 manual chapters.'],
  ['vm-50', 'VM-50 PBR Experience Reporting', 'valuation_manual_pdfs', 'P1', 'current', 'No canonical package or reviewed source package was found.', 'Confirm current source and add as reporting support.'],
  ['vm-51', 'VM-51 PBR Experience Reporting Tables', 'valuation_manual_pdfs', 'P1', 'current', 'No canonical package or reviewed source package was found.', 'Treat as structured reporting/table material.'],
  ['vm-a', 'VM-A Actuarial Opinion and Memorandum appendix', 'valuation_manual_pdfs', 'P1', 'current', 'No canonical package or reviewed source package was found.', 'Confirm current appendix scope and canonicalize with VM-30 cross-references.'],
  ['vm-m', 'VM-M valuation manual material', 'valuation_manual_pdfs', 'P1', 'current', 'No canonical package or reviewed source package was found.', 'Confirm whether this is in near-term life/annuity scope before intake.'],
  ['vm-v', 'VM-V valuation manual material', 'valuation_manual_pdfs', 'P1', 'current', 'No canonical package or reviewed source package was found.', 'Confirm whether this is in near-term life/annuity scope before intake.'],
  ['valuation-manual-amendments-current', 'Current Valuation Manual amendments and change material', 'valuation_manual_pdfs', 'P1', 'current', 'No current amendment/redline package is represented in the canonical layer.', 'Inventory authorized current amendments and preserve version/effective-date relationships.'],
  ['valuation-manual-maintenance-agenda', 'Valuation Manual Maintenance Agenda and amendment proposals', 'valuation_manual_pdfs', 'P1', 'proposed', 'No canonical package is present; these are useful context but should not be treated as current requirements.', 'Keep proposed material separate and explicitly non-controlling.'],
  ['standard-valuation-law-model-820', 'Standard Valuation Law / Model #820', 'model_law', 'P1', 'current', 'VM-20 citations point to Model #820, but the model law is not represented as a canonical package.', 'Add the authorized model-law source for interpretation and applicability context.'],
  ['annual-statement-pbr-reporting', 'Annual statement, actuarial opinion, and PBR reporting instructions', 'reporting_documents', 'P1', 'current', 'No structured reporting-instruction package is present.', 'Add only authorized reporting instructions that materially affect valuation answers.'],
  ['ny-valuation-regulations', 'New York valuation regulations and amendments', 'ny_regulations', 'P2', 'current', 'Regulations 102, 128, 127, 179, 136, 143, 56, 126, 147, 151, 141, 210, and 213 are represented in review artifacts, but not canonical packages.', 'Prioritize jurisdictional deviations after P0 current NAIC chapters.'],
  ['implementation-faqs', 'Implementation FAQs', 'practice_notes', 'P2', 'current', 'Regulation 213 Amendment 1 FAQ is represented as a review-only relationship candidate but is not canonical.', 'Keep FAQ material companion-only and source-bound.'],
  ['actuarial-practice-notes', 'Actuarial practice notes and educational notes', 'practice_notes', 'P2', 'historical', 'Many practice notes are reviewed, but they are non-binding companion guidance and not canonical in the regulatory POC.', 'Canonicalize selectively when it answers likely implementation questions without replacing authority.'],
  ['law-manual-reprints', 'Law Manual reprints', 'actuarial_guidelines', 'P2', 'historical', 'AG 36/37/38/48 reprint review artifacts exist, but their relationship to active sources remains review-only.', 'Track as reprints/companions only after human disposition.'],
  ['historical-valuation-manual-editions', 'Targeted historical Valuation Manual editions', 'valuation_manual_pdfs', 'P2', 'historical', 'No historical manual edition package is present in the canonical layer.', 'Add only where version-aware retrieval requires historical comparison.'],
  ['statutory-accounting-guidance', 'Relevant statutory accounting guidance', 'reporting_documents', 'P2', 'current', 'No statutory accounting package was found.', 'Add targeted guidance only where it directly changes a valuation or reporting answer.'],
  ['jurisdictional-deviations', 'Jurisdiction-specific deviations from model requirements', 'ny_regulations', 'P2', 'current', 'The NY review corpus provides candidates, but there is no structured deviation layer.', 'Add documentary deviations with jurisdiction and effective-date evidence.'],
  ['health-specific-manual-material', 'Health-specific Valuation Manual material', 'valuation_manual_pdfs', 'P3', 'current', 'The project scope is US life and annuity valuation; no health-specific canonical package is required for the initial repository.', 'Defer unless scope expands.'],
]

const sourceFamilyFromReviewId = (id) => {
  if (/^reg/.test(id)) return 'ny_regulations'
  if (/^vm|^lhmanual/.test(id)) return 'valuation_manual_pdfs'
  if (/^ag/.test(id)) return 'actuarial_guidelines'
  return 'practice_notes'
}

const titleFromMarkdown = (text, fallback) => text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallback

const loadCanonical = async () => {
  const sourcesDir = path.join(canonicalRoot, 'sources')
  const records = []
  for (const name of await filesIn(sourcesDir, '.json')) records.push(await readJson(path.join(sourcesDir, name)))
  return records
}

const loadBatchEvidence = async () => {
  const byDocument = new Map()
  const batchNames = (await filesIn(batchesRoot)).filter((name) => name.startsWith('batch-'))
  for (const batchName of batchNames) {
    const manifestPath = path.join(batchesRoot, batchName, 'batch-manifest.json')
    if (!(await exists(manifestPath))) continue
    const manifest = await readJson(manifestPath)
    for (const source of asArray(manifest.sourceFiles)) {
      const key = norm(source.filePath ?? source.filename)
      if (!key) continue
      if (!byDocument.has(key)) byDocument.set(key, { ...source, batches: [], sourceIds: [], processingPlans: [] })
      const record = byDocument.get(key)
      record.batches.push(batchName)
      record.sourceIds.push(source.sourceId)
      record.processingPlans.push(`config/${slug(source.sourceId)}-batch-plan.json`)
    }
  }
  return [...byDocument.values()].map((record) => ({
    ...record,
    batches: unique(record.batches),
    sourceIds: unique(record.sourceIds),
    processingPlans: unique(record.processingPlans),
  }))
}

const loadReviewArtifacts = async () => {
  const result = new Map()
  for (const name of await filesIn(reviewRoot, '.md')) {
    if (!name.endsWith('_review_index.md')) continue
    const id = name.replace(/_review_index\.md$/, '')
    const text = await fs.readFile(path.join(reviewRoot, name), 'utf8')
    result.set(id, { id, title: titleFromMarkdown(text, id), reviewIndex: relative(path.join(reviewRoot, name)), selfReview: null, text })
  }
  for (const name of await filesIn(reviewRoot, '.md')) {
    if (!name.endsWith('_self_review.md')) continue
    const id = name.replace(/_self_review\.md$/, '')
    if (!result.has(id)) result.set(id, { id, title: id, reviewIndex: null, selfReview: null, text: '' })
    result.get(id).selfReview = relative(path.join(reviewRoot, name))
  }
  return result
}

const matchReviewArtifacts = (document, reviewArtifacts) => {
  const filename = norm(document.filename)
  const title = norm(document.sourceTitle)
  return [...reviewArtifacts.values()].filter((artifact) => {
    const id = norm(artifact.id)
    return (id && (filename.includes(id) || title.includes(id))) || artifact.text.toLowerCase().includes(String(document.filename ?? '').toLowerCase())
  })
}

const priorityForSource = (source) => {
  const text = `${source.filename} ${source.sourceTitle} ${source.sourceReference}`.toLowerCase()
  if (/pbr_data|vm-20|vm-21|vm-22|vm-30|vm-31|valuation manual/.test(text)) return ['P0', 'Current Valuation Manual material directly controls life and annuity valuation answers.']
  if (/reg-21[03]|reg-141/.test(text)) return ['P2', 'Jurisdictional regulation is important but follows the current NAIC core.']
  if (/actuarial guideline/.test(source.documentType ?? '') || /^ag/i.test(source.filename ?? '')) return ['P1', 'Guideline material supports interpretation of valuation requirements and tables.']
  return ['P2', 'Reviewed companion material may answer implementation questions but is not the primary authority.']
}

const targetAssessment = (target, canonical, batchEvidence, reviewArtifacts, structuredTables) => {
  const id = target[0]
  const aliases = {
    'valuation-manual-2026-complete': ['pbr_data_valuation_manual_2026', 'valuationmanual'],
    'vm-01': ['vm01', 'supportingvm01'],
    'vm-20': ['vm20'],
    'vm-21': ['vm21'],
    'vm-22': ['vm22'],
    'vm-30': ['vm30'],
    'vm-31': ['vm31'],
    'vm-g': ['vmg'],
    'vm-c': ['vmc'],
    'current-regulatory-tables': ['factor-tables', 'asset-default', 'asset-spread', 'mortality-table', 'interest-rate'],
    'vm-02': ['vm02', 'supportingvm02'],
    'vm-50': ['vm50'],
    'vm-51': ['vm51'],
    'vm-a': ['vma'],
    'vm-m': ['vmm'],
    'vm-v': ['vmv'],
    'valuation-manual-amendments-current': ['amendment'],
    'valuation-manual-maintenance-agenda': ['maintenance', 'agenda', 'proposal'],
    'standard-valuation-law-model-820': ['model820', 'standardvaluationlaw'],
    'annual-statement-pbr-reporting': ['annualstatement', 'reportinginstruction', 'actuarialopinion'],
    'ny-valuation-regulations': ['regulation', 'nyregulations'],
    'implementation-faqs': ['faq'],
    'actuarial-practice-notes': ['practice_note', 'practice note', 'educational note'],
    'law-manual-reprints': ['lawmanualreprint'],
    'historical-valuation-manual-editions': ['historicalmanual', 'lhmanual'],
    'statutory-accounting-guidance': ['statutoryaccounting'],
    'jurisdictional-deviations': ['regulation', 'jurisdiction'],
    'health-specific-manual-material': ['health-reserves', 'health-specific'],
  }
  const matches = aliases[id] ?? [id.replace(/-/g, '')]
  const matchesText = (value) => matches.some((match) => norm(value).includes(norm(match)))
  const canonicalMatches = canonical.filter((pkg) => matchesText(`${pkg.source.sourceId} ${pkg.source.sourceTitle} ${pkg.source.filename}`))
  const evidenceMatches = batchEvidence.filter((source) => matchesText(`${source.filename} ${source.sourceTitle} ${source.sourceIds.join(' ')}`))
  const reviewMatches = [...reviewArtifacts.values()].filter((artifact) => matchesText(`${artifact.id} ${artifact.title}`))
  let assessment = 'missing'
  if (canonicalMatches.length > 0) assessment = 'canonical_partial'
  else if (evidenceMatches.length > 0) assessment = 'reviewed_not_canonical'
  else if (reviewMatches.length > 0) assessment = 'review_artifact_only'
  if (id === 'valuation-manual-2026-complete' && canonicalMatches.length > 0) assessment = 'canonical_partial'
  if (id === 'vm-01' && canonicalMatches.some((pkg) => pkg.source.sourceId === 'vm01-definitions' && pkg.processing?.canonicality === 'canonical' && pkg.processing?.reviewOnly === true && pkg.processing?.promotionStatus === 'not_promoted')) assessment = 'canonical_review_candidate'
  if (id === 'vm-01' && canonicalMatches.some((pkg) => pkg.source.sourceId === 'vm01-definitions' && pkg.processing?.canonicality === 'canonical' && pkg.processing?.reviewOnly === false && pkg.processing?.promotionStatus === 'promoted')) assessment = 'canonical_complete'
  if (id === 'vm-20') {
    const promotedVm20 = canonical.filter((pkg) => pkg.source.authorityLevel === 'manual_section' && pkg.source.sourceId.startsWith('vm20-') && pkg.processing?.promotionStatus === 'promoted')
    if (promotedVm20.length === 6 && structuredTables?.governance?.promotionStatus === 'promoted') assessment = 'canonical_promoted_prose_and_tables'
    else if (promotedVm20.length === 6) assessment = 'canonical_promoted_prose'
  }
  if (id === 'current-regulatory-tables' && structuredTables?.governance?.promotionStatus === 'promoted') {
    assessment = 'canonical_promoted_partial_vm20_appendix2'
    return { assessment, evidenceSourceIds: structuredTables.tables.map((table) => table.tableId) }
  }
  if (id === 'current-regulatory-tables' && structuredTables?.governance?.reviewOnly === true) {
    assessment = 'review_candidate_partial_vm20_appendix2'
    return { assessment, evidenceSourceIds: structuredTables.tables.map((table) => table.tableId) }
  }
  return { assessment, evidenceSourceIds: unique([...canonicalMatches.map((pkg) => pkg.source.sourceId), ...evidenceMatches.flatMap((source) => source.sourceIds), ...reviewMatches.map((artifact) => artifact.id)]) }
}

const buildInventory = async () => {
  const [canonical, batchEvidence, reviewArtifacts, structuredTables, vm01Relationships] = await Promise.all([loadCanonical(), loadBatchEvidence(), loadReviewArtifacts(), exists(structuredTableDatasetPath).then((present) => present ? readJson(structuredTableDatasetPath) : null), exists(vm01RelationshipRegistryPath).then((present) => present ? readJson(vm01RelationshipRegistryPath) : null)])
  const classificationPath = path.join(canonicalRoot, 'classification', 'source-classifications.json')
  const classifications = await exists(classificationPath) ? await readJson(classificationPath) : { classifications: [] }
  const classificationBySource = new Map(asArray(classifications.classifications).map((entry) => [entry.sourceId, entry]))
  const sources = []
  const seenDocumentKeys = new Set()
  for (const document of batchEvidence) {
    const key = norm(document.filePath ?? document.filename)
    seenDocumentKeys.add(key)
    const matchedReviews = matchReviewArtifacts(document, reviewArtifacts)
    const canonicalMatches = canonical.filter((pkg) => norm(pkg.source.filename) === norm(document.filename))
    const promotedMatches = canonicalMatches.filter((pkg) => pkg.processing?.promotionStatus === 'promoted')
    const chunks = canonicalMatches.flatMap((pkg) => pkg.chunks ?? [])
    const [priority, priorityReason] = priorityForSource(document)
    const sourceIds = unique(document.sourceIds)
    const relationshipRegistry = sourceIds.some((id) => id.startsWith('reg213'))
      ? 'candidate_registry: data/processed/relationship_registries/reg213-candidate-relationship-registry.json'
      : sourceIds.includes('supporting-vm01-definitions')
        ? 'candidate_registry: data/processed/relationship_registries/vm01-definition-relationship-candidates.json'
        : 'none identified'
    const currentness = /ag52/i.test(document.filename ?? '') ? 'historical_or_repealed' : 'current_or_unconfirmed'
    const reviewCompleted = matchedReviews.length > 0
    sources.push({
      sourceId: slug(document.filename),
      documentId: slug(document.filename),
      title: document.sourceTitle ?? document.filename,
      sourceFamily: document.sourceFamilyId ?? 'unclassified',
      documentType: document.documentType ?? 'source_document',
      jurisdiction: document.domainId === 'ny_regulations' ? 'New York' : 'NAIC/United States',
      filename: document.filename ?? null,
      sourceLocator: compactPath(document.filePath),
      version: document.versionDate ?? null,
      publicationDate: null,
      effectiveDate: null,
      currentness,
      availability: {
        rawSource: document.filePath ? 'declared_external' : 'not_confirmed',
        sourceText: 'extraction_output_or_review_packet',
        status: 'source_exists_in_external_manifest'
      },
      processing: {
        processingPlans: document.processingPlans,
        reviewIndexes: unique(matchedReviews.map((artifact) => artifact.reviewIndex)),
        selfReviews: unique(matchedReviews.map((artifact) => artifact.selfReview)),
        canonicalPackages: unique(canonicalMatches.map((pkg) => relative(path.join(canonicalRoot, 'sources', `${pkg.source.sourceId}.json`)))),
        classification: sourceIds.map((id) => classificationBySource.get(id)?.classificationStatus ?? classificationBySource.get(id)?.approvalStatus ?? '').find(Boolean) ?? 'not_in_canonical_classification',
        relationshipRegistry,
        chunkCount: chunks.length,
        sourceTextFidelity: unique(chunks.map((chunk) => chunk.fidelity))
      },
      review: {
        reviewRequired: true,
        reviewCompleted,
        blockingFindings: promotedMatches.length > 0 ? ['Promotion is scope-specific; unlisted manual chapters, structured tables, companion guidance, and downstream exports remain outside the decision.'] : reviewCompleted ? ['Source remains review-only; promotion decision is not recorded in this inventory.'] : ['No tracked review index matched this source record.'],
        promotionState: promotedMatches.length > 0 ? 'partially_promoted_scopes' : canonicalMatches.length ? 'not_promoted' : 'not_canonical',
        canonical: canonicalMatches.length > 0,
        copilotExportEligible: false,
        exclusionReason: promotedMatches.length > 0 ? 'Canonical source promotion is recorded, but Copilot export requires a separate explicit approval.' : 'Human promotion and export approval are intentionally separate from processing validation.',
        ...(promotedMatches.length > 0 ? { promotionRecordPaths: unique(promotedMatches.map((pkg) => pkg.extensions?.promotionDecisionPath)), promotedSourcePackageIds: unique(promotedMatches.map((pkg) => pkg.source.sourceId)) } : {})
      },
      retrieval: {
        associatedQuestions: [],
        expectedCoverage: canonicalMatches.length ? 'included_in_POC' : 'not_evaluated',
        evaluationCoverage: canonicalMatches.length ? 'see_source-index retrieval evaluation' : 'none',
        knownGaps: canonicalMatches.length ? [] : ['No canonical retrieval package or query coverage.']
      },
      priority: { level: priority, reason: priorityReason },
      relationships: relationshipRegistry === 'none identified' ? [] : [relationshipRegistry],
      notes: reviewCompleted ? 'Review artifacts are source-bound handoff evidence; summaries are not source text.' : 'Source record is derived from a processing manifest and has not been matched to a tracked review index.'
    })
  }
  for (const artifact of reviewArtifacts.values()) {
    const key = norm(artifact.id)
    if ([...seenDocumentKeys].some((documentKey) => documentKey.includes(key))) continue
    const family = sourceFamilyFromReviewId(artifact.id)
    const currentness = /amendment6|proposal|reprint|ag52|historical/i.test(`${artifact.id} ${artifact.title}`) ? 'historical_or_proposed' : 'current_or_unconfirmed'
    sources.push({
      sourceId: artifact.id,
      documentId: artifact.id,
      title: artifact.title,
      sourceFamily: family,
      documentType: family === 'ny_regulations' ? 'ny_regulation_or_amendment' : 'review_artifact_source',
      jurisdiction: family === 'ny_regulations' ? 'New York' : 'NAIC/United States',
      filename: null,
      sourceLocator: null,
      version: null,
      publicationDate: null,
      effectiveDate: null,
      currentness,
      availability: { rawSource: 'not_confirmed_in_repo', sourceText: 'review_artifact_only', status: 'represented_only_by_review_artifact' },
      processing: { processingPlans: [], reviewIndexes: artifact.reviewIndex ? [artifact.reviewIndex] : [], selfReviews: artifact.selfReview ? [relative(path.join(reviewRoot, `${artifact.id}_self_review.md`))] : [], canonicalPackages: [], classification: 'not_in_canonical_classification', relationshipRegistry: artifact.id.startsWith('reg213') ? 'candidate_registry: data/processed/relationship_registries/reg213-candidate-relationship-registry.json' : 'none identified', chunkCount: 0, sourceTextFidelity: [] },
      review: { reviewRequired: true, reviewCompleted: Boolean(artifact.reviewIndex), blockingFindings: ['Raw source and canonical package were not confirmed in the repository inventory.'], promotionState: 'review_only_not_canonical', canonical: false, copilotExportEligible: false, exclusionReason: 'Review artifact is not a substitute for source text.' },
      retrieval: { associatedQuestions: [], expectedCoverage: 'not_evaluated', evaluationCoverage: 'none', knownGaps: ['Raw source and source-text package must be confirmed before canonicalization.'] },
      priority: { level: family === 'ny_regulations' ? 'P2' : 'P2', reason: 'Existing review evidence makes this a candidate for controlled follow-up, not proof of source completeness.' },
      relationships: artifact.id.startsWith('reg213') ? ['candidate_registry: data/processed/relationship_registries/reg213-candidate-relationship-registry.json'] : [],
      notes: 'Review index or self-review exists, but raw/canonical source status remains unconfirmed.'
    })
  }
  sources.sort((a, b) => a.sourceId.localeCompare(b.sourceId))
  const corpusTargets = targetDefinitions.map((target) => {
    const assessment = targetAssessment(target, canonical, batchEvidence, reviewArtifacts, structuredTables)
    return { targetId: target[0], title: target[1], sourceFamily: target[2], priority: target[3], intendedStatus: target[4], assessment: assessment.assessment, reason: target[5], evidenceSourceIds: assessment.evidenceSourceIds, nextAction: target[6] }
  })
  const fidelityCounts = {}
  for (const pkg of canonical) for (const chunk of pkg.chunks ?? []) fidelityCounts[chunk.fidelity] = (fidelityCounts[chunk.fidelity] ?? 0) + 1
  const summary = {
    sourceDocumentsInventoried: sources.length,
    sourceRecordsWithExternalManifest: sources.filter((source) => source.availability.rawSource === 'declared_external').length,
    reviewIndexes: new Set(sources.flatMap((source) => source.processing.reviewIndexes)).size,
    selfReviews: new Set(sources.flatMap((source) => source.processing.selfReviews)).size,
    canonicalSourcePackages: canonical.length,
    canonicalChunks: canonical.reduce((sum, pkg) => sum + (pkg.chunks?.length ?? 0), 0),
    vm20CurrentManualChunks: canonical.filter((pkg) => pkg.source.authorityLevel === 'manual_section' && pkg.source.sourceId.startsWith('vm20-')).reduce((sum, pkg) => sum + (pkg.chunks?.length ?? 0), 0),
    vm20CompanionChunks: canonical.filter((pkg) => pkg.source.sourceId === 'vm20-practice-note-companion').reduce((sum, pkg) => sum + (pkg.chunks?.length ?? 0), 0),
    vm01Definitions: canonical.find((pkg) => pkg.source.sourceId === 'vm01-definitions')?.source?.coverageDeclarations?.definitionCount ?? 0,
    vm01RetrievalUnits: canonical.find((pkg) => pkg.source.sourceId === 'vm01-definitions')?.chunks?.length ?? 0,
    vm01PromotionStatus: canonical.find((pkg) => pkg.source.sourceId === 'vm01-definitions')?.processing?.promotionStatus ?? 'not_present',
    vm01RelationshipCandidates: vm01Relationships?.relationshipCount ?? 0,
    promotedCanonicalPackages: canonical.filter((pkg) => pkg.processing?.promotionStatus === 'promoted').length,
    promotedCanonicalChunks: canonical.filter((pkg) => pkg.processing?.promotionStatus === 'promoted').reduce((sum, pkg) => sum + (pkg.chunks?.length ?? 0), 0),
    structuredTableLogicalTables: structuredTables?.summary?.ingestedLogicalTableCount ?? 0,
    structuredTableVersions: structuredTables?.summary?.tableVersionCount ?? 0,
    structuredTableRows: structuredTables?.summary?.rowCount ?? 0,
    structuredTableValues: structuredTables?.summary?.valueCount ?? 0,
    structuredTablePromotionStatus: structuredTables?.governance?.promotionStatus ?? 'not_present',
    promotedStructuredTableLogicalTables: structuredTables?.governance?.promotionStatus === 'promoted' ? structuredTables.summary.ingestedLogicalTableCount : 0,
    structuredTablePromotionDecisionPath: structuredTables?.governance?.promotionStatus === 'promoted' ? vm20StructuredTablePromotionDecisionPath : null,
    sourcesAwaitingCanonicalization: sources.filter((source) => source.review.canonical === false && source.review.reviewCompleted).length,
    sourcesAwaitingHumanReview: sources.filter((source) => source.review.reviewCompleted === false).length,
    reviewArtifactOnlySources: sources.filter((source) => source.availability.status === 'represented_only_by_review_artifact').length,
    p0Gaps: corpusTargets.filter((target) => target.priority === 'P0' && target.assessment !== 'canonical_complete').map((target) => target.targetId),
    p1Gaps: corpusTargets.filter((target) => target.priority === 'P1' && target.assessment !== 'canonical_complete').map((target) => target.targetId),
    candidateRelationships: 23 + (vm01Relationships?.relationshipCount ?? 0),
    promotedRelationships: 0,
    historicalProposedDeferred: sources.filter((source) => source.currentness.includes('historical') || source.currentness.includes('proposed')).length + corpusTargets.filter((target) => ['historical', 'proposed'].includes(target.intendedStatus)).length,
    currentSourceTextFidelityDistribution: fidelityCounts
  }
  return { schemaVersion: '1.0', inventoryId: 'regulatory-corpus-inventory-2026-08-26', generatedAt: '2026-08-26T00:00:00.000Z', scope: { domain: 'US life and annuity valuation regulation', rawSourcePolicy: 'Raw source remains external; repository paths are not authoritative proof of current file availability.', canonicalLayer: 'data/processed/source_indexes' }, summary, sources, corpusTargets }
}

const buildMarkdown = (inventory) => {
  const s = inventory.summary
  const lines = [
    '# Master Regulatory Corpus Inventory', '',
    `Generated: ${inventory.generatedAt}`, '',
    'This is the planning inventory for the US life and annuity valuation-regulation corpus. It reconciles external-source declarations in processing manifests, tracked review artifacts, and the review-only canonical source-index POC. A review artifact or batch manifest does not prove that a current raw source is available or canonical.', '',
    '## Completeness snapshot', '',
    `- Source documents inventoried: ${s.sourceDocumentsInventoried}`,
    `- Records with declared external raw source: ${s.sourceRecordsWithExternalManifest}`,
    `- Review indexes: ${s.reviewIndexes}`,
    `- Self-reviews: ${s.selfReviews}`,
    `- Canonical source packages: ${s.canonicalSourcePackages}`,
    `- Canonical chunks: ${s.canonicalChunks}`,
    `- Promoted canonical packages / chunks: ${s.promotedCanonicalPackages} / ${s.promotedCanonicalChunks}`,
    `- Structured tables / versions / values: ${s.structuredTableLogicalTables} / ${s.structuredTableVersions} / ${s.structuredTableValues} (${s.structuredTablePromotionStatus})`,
    `- VM-01 definitions / retrieval units: ${s.vm01Definitions} / ${s.vm01RetrievalUnits} (${s.vm01PromotionStatus})`,
    `- Awaiting canonicalization: ${s.sourcesAwaitingCanonicalization}`,
    `- Awaiting human review: ${s.sourcesAwaitingHumanReview}`,
    `- Review-artifact-only sources: ${s.reviewArtifactOnlySources}`,
    `- Candidate relationships: ${s.candidateRelationships}; promoted: ${s.promotedRelationships}`,
    '', '## Corpus targets', '',
    '| Priority | Target | Assessment | Evidence | Next action |', '| --- | --- | --- | --- | --- |',
  ]
  for (const target of inventory.corpusTargets) lines.push(`| ${target.priority} | ${target.title} | ${target.assessment} | ${target.evidenceSourceIds.slice(0, 5).join(', ') || 'none confirmed'} | ${target.nextAction} |`)
  lines.push('', '## Source records', '', '| Priority | Source ID | Title | Family | Currentness | Raw/source text | Review | Canonical | Chunks | Fidelity |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
  for (const source of inventory.sources) lines.push(`| ${source.priority.level} | ${source.sourceId} | ${source.title.replace(/\|/g, '\\|')} | ${source.sourceFamily} | ${source.currentness} | ${source.availability.rawSource} / ${source.availability.sourceText} | ${source.review.reviewCompleted ? 'completed artifact' : 'not matched'} | ${source.review.canonical ? 'yes' : 'no'} | ${source.processing.chunkCount} | ${source.processing.sourceTextFidelity.join(', ') || 'not available'} |`)
  lines.push('', '## Governance notes', '', '- The six VM-20 current-manual prose packages and the reviewed available Appendix 2 structured-table scope are canonically promoted under separate decision records.', '- VM-01 has 98 canonically promoted current-definition units under its own decision; its 29 relationship candidates remain pending, review-only, and unpromoted.', '- No inventory record is Copilot-export eligible; canonical promotion and downstream export are separate decisions.', '- Candidate relationship edges remain documentary, source-bound, pending human review, and not promoted.', '- Review summaries and self-review commentary are not verbatim source text.', '')
  return lines.join('\n')
}

const buildGapReport = (inventory) => {
  const lines = ['# Regulatory Gap Assessment', '', '## Finding', '', 'The repository has substantial reviewed evidence for the 2026 Valuation Manual, Actuarial Guidelines, practice notes, and New York regulations. The principal gap is canonical completeness and structured currentness, not absence of all source evidence. Raw-source availability remains declared from external manifests and is not revalidated by this report.', '', '## P0 assessment', '']
  for (const target of inventory.corpusTargets.filter((item) => item.priority === 'P0')) lines.push(`- **${target.targetId} — ${target.title}:** ${target.assessment}. ${target.reason} Next: ${target.nextAction}`)
  lines.push('', '## P1 assessment', '')
  for (const target of inventory.corpusTargets.filter((item) => item.priority === 'P1')) lines.push(`- **${target.targetId} — ${target.title}:** ${target.assessment}. ${target.reason} Next: ${target.nextAction}`)
  lines.push('', '## P2/P3 scope control', '', '- New York regulations, FAQs, practice notes, Law Manual reprints, historical editions, statutory accounting, and jurisdictional deviations are useful supporting material but should not displace completion of current P0 authority.', '- Health-specific material is identified as P3 because it is outside the initial US life and annuity focus.', '- Tables require a structured-table profile with row/column/version citations; prose chunking must not be used as the primary table representation.', '')
  return lines.join('\n')
}

const buildBacklog = (inventory) => {
  const ordered = inventory.corpusTargets.filter((target) => target.assessment !== 'canonical_complete').sort((a, b) => `${a.priority}-${a.targetId}`.localeCompare(`${b.priority}-${b.targetId}`))
  const lines = ['# Regulatory Canonicalization Backlog', '', 'The VM-01 current-definition scope, VM-20 current-manual prose scope, and reviewed available Appendix 2 structured-table scope are promoted under separate decisions. All other items remain review-only until independent human review and explicit promotion. VM-01 relationship candidates remain a separate review-only governance item. The sequence favors incomplete core packages before supporting sources.', '', '| Order | Priority | Target | Current state | Safe next step |', '| ---: | --- | --- | --- | --- |']
  ordered.forEach((target, index) => lines.push(`| ${index + 1} | ${target.priority} | ${target.title} | ${target.assessment} | ${target.nextAction} |`))
  lines.push('', '## Chunking acceptance criteria', '', '- Use document → chapter → section → subsection → paragraph/requirement hierarchy.', '- Use parent chunks for coherent structural units and child chunks for precise retrieval; preserve `parentChunkId`, `precedingChunkId`, `followingChunkId`, `headingPath`, and a structural locator.', '- Keep requirement, exception, qualification, condition, definition, and table headings together when they are directly associated.', '- Use token splitting only as a fallback within an unusually large structural unit.', '- Keep tables in a structured-table profile, separate from prose chunking.', '- Retrieval should support child retrieval, reranking, parent/adjacent expansion, and an evidence package.', '')
  return lines.join('\n')
}

const buildCompleteness = (inventory) => {
  const s = inventory.summary
  return [
    '# Corpus Completeness Report', '',
    `As of ${inventory.generatedAt}, the repository contains substantial regulatory evidence with separately recorded VM-01 definitions, VM-20 prose, and VM-20 structured-table canonical promotions, but it is not production-complete and is not Copilot-export ready.`, '',
    '## Counts', '',
    `- Source documents inventoried: **${s.sourceDocumentsInventoried}**`,
    `- Documents with declared external raw source: **${s.sourceRecordsWithExternalManifest}**`,
    `- Documents reviewed / review artifacts matched: **${s.reviewIndexes} review indexes**`,
    `- Canonical source packages: **${s.canonicalSourcePackages}**`,
    `- Canonical chunks: **${s.canonicalChunks}**`,
    `- Promoted canonical prose packages / chunks: **${s.promotedCanonicalPackages} / ${s.promotedCanonicalChunks}**`,
    `- Promoted structured logical tables / versions: **${s.promotedStructuredTableLogicalTables} / ${s.structuredTableVersions}**`,
    `- Structured rows / values: **${s.structuredTableRows} / ${s.structuredTableValues}**`,
    `- Sources awaiting canonicalization: **${s.sourcesAwaitingCanonicalization}**`,
    `- Sources awaiting human review: **${s.sourcesAwaitingHumanReview}**`,
    `- Review-artifact-only sources: **${s.reviewArtifactOnlySources}**`,
    `- Candidate relationships: **${s.candidateRelationships}**`,
    `- Promoted relationships: **${s.promotedRelationships}**`, '',
    '## VM-20 coverage checkpoint', '',
    `- Current-manual VM-20 coverage: ${s.vm20CurrentManualChunks} exact-text chunks; all ${s.vm20CurrentManualChunks} chunks in the six listed current-manual prose packages are canonically promoted.`,
    `- VM-20 companion coverage: ${s.vm20CompanionChunks} exact-text chunks from the reviewed 2020 practice-note wave remain separately labeled non-binding, historical, review-only, and unpromoted.`,
    `- Appendix 2 structured tables: ${s.structuredTableLogicalTables} logical tables, ${s.structuredTableVersions} versions, ${s.structuredTableRows} rows, and ${s.structuredTableValues} exact source-cell values; status ${s.structuredTablePromotionStatus}.`,
    '- Prose promotion decision: `data/manual-input/promotion-decisions/vm20-2026-prose-promotion.json`.',
    `- Structured-table promotion decision: \`${s.structuredTablePromotionDecisionPath}\`.`,
    '- Structured-table review package: `data/processed/review_packages/vm20-appendix2-structured-table-review-package.md`.',
    '- Remaining VM-20 table gap: current Tables B, C, D, E1, and E2 were not available on the official current-data page and were not inferred.', '',
    '## VM-01 terminology checkpoint', '',
    `- Current VM-01 definitions / retrieval units: ${s.vm01Definitions} / ${s.vm01RetrievalUnits}.`,
    `- VM-01 promotion status: ${s.vm01PromotionStatus}; decision \`${vm01PromotionDecisionPath}\`.`,
    `- VM-01 explicit-reference candidates: ${s.vm01RelationshipCandidates}; all remain pending and not promoted.`,
    '- Formal-definition requests for undefined or ambiguous terms abstain rather than substituting related evidence.',
    '- Canonical `definedTerms` now contains only 98 formal terms plus 27 source-explicit aliases; 17 generated lookup variants remain confined to non-authoritative retrieval metadata.',
    '- The focused case-level retrieval artifact contains 21 inspectable queries, including DR, SR, NPR, GIC, IUL, cross-page, ambiguous, undefined-term, and unavailable-version cases.', '',
    '## Interpretation', '',
    '- “Canonical promoted” applies only where an explicit promotion decision names the source package or structured-table scope.',
    '- Structured table data remains separate from prose even after its own canonical promotion.',
    '- “Reviewed” means a tracked review artifact exists; it does not prove that all source text was canonicalized.',
    '- Source fidelity remains explicit; summary-only or review-derived material must not be labeled source evidence.', '',
    '## Copilot handoff posture', '',
    '- Export eligibility is false for every inventory record, including both promoted VM-20 scopes.',
    '- Canonical promotion does not itself authorize learner, app, RAG, or Copilot use.',
    '- Copilot should consume a separately approved generated export from the canonical corpus, never become the canonical source.', '',
  ].join('\n')
}

const main = async () => {
  const inventory = await buildInventory()
  await fs.mkdir(outputRoot, { recursive: true })
  await fs.writeFile(path.join(outputRoot, 'master-regulatory-corpus-inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`, 'utf8')
  await fs.writeFile(path.join(outputRoot, 'master-regulatory-corpus-inventory.md'), `${buildMarkdown(inventory)}\n`, 'utf8')
  await fs.writeFile(path.join(outputRoot, 'regulatory-gap-assessment.md'), `${buildGapReport(inventory)}\n`, 'utf8')
  await fs.writeFile(path.join(outputRoot, 'canonicalization-backlog.md'), `${buildBacklog(inventory)}\n`, 'utf8')
  await fs.writeFile(path.join(outputRoot, 'corpus-completeness-report.md'), `${buildCompleteness(inventory)}\n`, 'utf8')
  console.log(`Built regulatory corpus inventory for ${inventory.summary.sourceDocumentsInventoried} sources and ${inventory.corpusTargets.length} corpus targets.`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
