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
  ['vm-01', 'VM-01 Definitions', 'valuation_manual_pdfs', 'P0', 'current', 'The 2026 manual is present and VM-01 is named in the supporting-wave plan, but no canonical VM-01 package is present.', 'Canonicalize definitions first because downstream VM answers depend on stable terms.'],
  ['vm-20', 'VM-20 Requirements for Principle-Based Reserves for Life Products', 'valuation_manual_pdfs', 'P0', 'current', 'VM-20 has extensive reviewed slices and four canonical POC packages, but not a complete chapter package.', 'Expand the existing reviewed VM-20 slices into a hierarchical chapter package.'],
  ['vm-21', 'VM-21 Requirements for Principle-Based Reserves for Variable Annuities', 'valuation_manual_pdfs', 'P0', 'current', 'VM-21 has a reviewed controlled wave and one canonical projection-entry package, but not a complete chapter package.', 'Canonicalize the reviewed VM-21 wave with parent-child structure and table separation.'],
  ['vm-22', 'VM-22 Requirements for Principle-Based Reserves for Non-Variable Annuities', 'valuation_manual_pdfs', 'P0', 'current', 'VM-22 is represented in reviewed ignored batches but has no current canonical source package.', 'Canonicalize reviewed VM-22 sections after table and hedging boundaries are confirmed.'],
  ['vm-30', 'VM-30 Actuarial Opinion and Memorandum Requirements', 'valuation_manual_pdfs', 'P0', 'current', 'VM-30 appears in the supporting-wave plan and reviewed slices, but no canonical package is present.', 'Canonicalize the reporting requirements and preserve cross-references to VM-31.'],
  ['vm-31', 'VM-31 PBR Actuarial Report Requirements', 'valuation_manual_pdfs', 'P0', 'current', 'VM-31 is represented by reviewed slices but lacks a canonical package.', 'Canonicalize the report requirements with reporting-obligation chunk types.'],
  ['vm-g', 'VM-G Corporate Governance Requirements for PBR', 'valuation_manual_pdfs', 'P0', 'current', 'No source package or reviewed source ID for VM-G was found in the tracked POC or current batch manifests.', 'Confirm the authorized 2026 source and process it as a governance-specific chapter.'],
  ['vm-c', 'VM-C current Actuarial Guidelines appendix and AG mapping', 'valuation_manual_pdfs', 'P0', 'current', 'The repository has many AG review artifacts, but no current VM-C appendix package or authoritative mapping package.', 'Obtain/confirm the authorized appendix and map individually processed AGs without inferring legal effect.'],
  ['current-regulatory-tables', 'Current prescribed valuation, mortality, spread, and default tables', 'valuation_manual_pdfs', 'P0', 'current', 'VM-20/21/22 reviewed material references tables, but no structured table corpus is present in the canonical layer.', 'Create a table-specific profile with row/column citations and version metadata; do not prose-chunk tables.'],
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

const targetAssessment = (target, canonical, batchEvidence, reviewArtifacts) => {
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
  return { assessment, evidenceSourceIds: unique([...canonicalMatches.map((pkg) => pkg.source.sourceId), ...evidenceMatches.flatMap((source) => source.sourceIds), ...reviewMatches.map((artifact) => artifact.id)]) }
}

const buildInventory = async () => {
  const [canonical, batchEvidence, reviewArtifacts] = await Promise.all([loadCanonical(), loadBatchEvidence(), loadReviewArtifacts()])
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
    const chunks = canonicalMatches.flatMap((pkg) => pkg.chunks ?? [])
    const [priority, priorityReason] = priorityForSource(document)
    const sourceIds = unique(document.sourceIds)
    const relationshipRegistry = sourceIds.some((id) => id.startsWith('reg213')) ? 'candidate_registry: data/processed/relationship_registries/reg213-candidate-relationship-registry.json' : 'none identified'
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
        blockingFindings: reviewCompleted ? ['Source remains review-only; promotion decision is not recorded in this inventory.'] : ['No tracked review index matched this source record.'],
        promotionState: canonicalMatches.length ? 'not_promoted' : 'not_canonical',
        canonical: canonicalMatches.length > 0,
        copilotExportEligible: false,
        exclusionReason: 'Human promotion and export approval are intentionally separate from processing validation.'
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
    const assessment = targetAssessment(target, canonical, batchEvidence, reviewArtifacts)
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
    sourcesAwaitingCanonicalization: sources.filter((source) => source.review.canonical === false && source.review.reviewCompleted).length,
    sourcesAwaitingHumanReview: sources.filter((source) => source.review.reviewCompleted === false).length,
    reviewArtifactOnlySources: sources.filter((source) => source.availability.status === 'represented_only_by_review_artifact').length,
    p0Gaps: corpusTargets.filter((target) => target.priority === 'P0' && target.assessment !== 'canonical_complete').map((target) => target.targetId),
    p1Gaps: corpusTargets.filter((target) => target.priority === 'P1' && target.assessment !== 'canonical_complete').map((target) => target.targetId),
    candidateRelationships: 23,
    promotedRelationships: 0,
    historicalProposedDeferred: sources.filter((source) => source.currentness.includes('historical') || source.currentness.includes('proposed')).length + corpusTargets.filter((target) => ['historical', 'proposed'].includes(target.intendedStatus)).length,
    currentSourceTextFidelityDistribution: fidelityCounts
  }
  return { schemaVersion: '1.0', inventoryId: 'regulatory-corpus-inventory-2026-08-25', generatedAt: '2026-08-25T00:00:00.000Z', scope: { domain: 'US life and annuity valuation regulation', rawSourcePolicy: 'Raw source remains external; repository paths are not authoritative proof of current file availability.', canonicalLayer: 'data/processed/source_indexes' }, summary, sources, corpusTargets }
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
  lines.push('', '## Governance notes', '', '- All records remain review-only and not Copilot-export eligible.', '- Canonical package status means a package exists in the source-index POC; it does not mean the source is promoted or production-complete.', '- Candidate relationship edges remain documentary, source-bound, pending human review, and not promoted.', '- Review summaries and self-review commentary are not verbatim source text.', '')
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
  const lines = ['# Regulatory Canonicalization Backlog', '', 'All items remain review-only until independent human review and explicit promotion. The sequence favors reviewed high-value material, then partial core packages, then genuinely absent P0 sources, then tables and supporting sources.', '', '| Order | Priority | Target | Current state | Safe next step |', '| ---: | --- | --- | --- | --- |']
  ordered.forEach((target, index) => lines.push(`| ${index + 1} | ${target.priority} | ${target.title} | ${target.assessment} | ${target.nextAction} |`))
  lines.push('', '## Chunking acceptance criteria', '', '- Use document → chapter → section → subsection → paragraph/requirement hierarchy.', '- Use parent chunks for coherent structural units and child chunks for precise retrieval; preserve `parentChunkId`, `precedingChunkId`, `followingChunkId`, `headingPath`, and a structural locator.', '- Keep requirement, exception, qualification, condition, definition, and table headings together when they are directly associated.', '- Use token splitting only as a fallback within an unusually large structural unit.', '- Keep tables in a structured-table profile, separate from prose chunking.', '- Retrieval should support child retrieval, reranking, parent/adjacent expansion, and an evidence package.', '')
  return lines.join('\n')
}

const buildCompleteness = (inventory) => {
  const s = inventory.summary
  return [`# Corpus Completeness Report`, '', `As of ${inventory.generatedAt}, the repository contains a substantial review-only regulatory evidence base but is not production-complete and is not Copilot-export ready.`, '', '## Counts', '', `- Source documents inventoried: **${s.sourceDocumentsInventoried}**`, `- Documents with declared external raw source: **${s.sourceRecordsWithExternalManifest}**`, `- Documents reviewed / review artifacts matched: **${s.reviewIndexes} review indexes**`, `- Canonical source packages: **${s.canonicalSourcePackages}**`, `- Canonical chunks: **${s.canonicalChunks}**`, `- Sources awaiting canonicalization: **${s.sourcesAwaitingCanonicalization}**`, `- Sources awaiting human review: **${s.sourcesAwaitingHumanReview}**`, `- Review-artifact-only sources: **${s.reviewArtifactOnlySources}**`, `- Candidate relationships: **${s.candidateRelationships}**`, `- Promoted relationships: **${s.promotedRelationships}**`, '', '## Interpretation', '', '- “Canonical” means a review-only package exists in the tracked source-index POC, not that it is approved for downstream use.', '- “Reviewed” means a tracked review index or self-review exists; it does not prove that all source text was canonicalized.', '- “Missing” in a target assessment means no supporting batch, canonical package, or tracked review evidence was found in the current repository snapshot.', '- Source-text fidelity is explicit at package/chunk level; summary-only or review-derived material must not be labeled verbatim source text.', '', '## Copilot handoff posture', '', '- Export eligibility is false for every inventory record.', '- Approved export version and exclusion reason are reserved for a later explicit promotion decision.', '- Copilot should consume a generated export from the canonical corpus, never become the canonical source.', ''].join('\n')
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
