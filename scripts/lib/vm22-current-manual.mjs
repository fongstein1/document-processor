import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { deduplicateStructuredEvidenceCandidates } from './structured-evidence-identity.mjs'

export const VM22_SOURCE_SHA256 = '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9'
export const VM22_PAGE_RANGE = { start: 227, end: 318 }
export const VM22_PARENT_COUNT = 15
export const VM22_CHILD_COUNT = 68
export const VM22_CHUNK_COUNT = VM22_PARENT_COUNT + VM22_CHILD_COUNT

const parentSpecs = [
  { id: 'chapter-opening', title: 'VM-22 chapter opening and table of contents', opening: true, children: [['table-of-contents', 'Chapter title, table of contents, and Section 1 opener', null]] },
  { id: 'section-1-background', title: 'Section 1: Background', anchor: 'Section 1 Background', children: [['a-purpose', 'A. Purpose', 'A. Purpose'], ['b-principles', 'B. Principles', 'B. Principles'], ['c-risks-reflected-and-not-reflected', 'C. Risks Reflected and Risks Not Reflected', 'C. Risks Reflected and Risks Not Reflected'], ['d-materiality', 'D. Materiality', 'D. Materiality']] },
  { id: 'section-2-scope-effective-date', title: 'Section 2: Scope and Effective Date', anchor: 'Section 2 Scope and Effective Date', children: [['a-scope', 'A. Scope', 'A. Scope'], ['b-effective-date-transition', 'B. Effective Date & Transition', 'B. Effective Date & Transition']] },
  { id: 'section-3-reserve-methodology', title: 'Section 3: Reserve Methodology', anchor: 'Section 3 Reserve Methodology', children: [['a-aggregate-reserve', 'A. Aggregate Reserve', 'A. Aggregate Reserve'], ['b-impact-of-reinsurance-ceded', 'B. Impact of Reinsurance Ceded', 'B. Impact of Reinsurance Ceded'], ['c-additional-standard-projection-amount', 'C. The Additional Standard Projection Amount', 'C. The Additional Standard Projection Amount'], ['d-sr', 'D. The SR', 'D. The SR'], ['e-dr', 'E. The DR', 'E. The DR'], ['f-aggregation-of-contracts', 'F. Aggregation of Contracts for the DR and SR', 'F. Aggregation of Contracts for the DR and SR'], ['g-stochastic-exclusion-test', 'G. Stochastic Exclusion Test', 'G. Stochastic Exclusion Test'], ['h-allocation-of-aggregate-reserve', 'H. Allocation of the Aggregate Reserve to Contracts', 'H. Allocation of the Aggregate Reserve to Contracts'], ['i-prudent-estimate-assumptions', 'I. Prudent Estimate Assumptions', 'I. Prudent Estimate Assumptions'], ['j-approximations-simplifications', 'J. Approximations, Simplifications, and Modeling Efficiency Techniques', 'J. Approximations, Simplifications, and Modeling Efficiency Techniques'], ['k-prior-valuation-date', 'K. Prior Valuation Date', 'K. Prior Valuation Date']] },
  { id: 'section-4-determination-dr-sr', title: 'Section 4: Determination of the DR and SR', anchor: 'Section 4 Determination of the DR and SR', children: [['a-projection-accumulated-deficiencies', 'A. Projection of Accumulated Deficiencies', 'A. Projection of Accumulated Deficiencies'], ['b-determination-scenario-reserve', 'B. Determination of Scenario Reserve', 'B. Determination of Scenario Reserve'], ['c-projection-scenarios', 'C. Projection Scenarios', 'C. Projection Scenarios'], ['d-projection-assets', 'D. Projection of Assets', 'D. Projection of Assets'], ['e-annuitization-benefits', 'E. Projection of Annuitization Benefits', 'E. Projection of Annuitization Benefits'], ['f-frequency-projection', 'F. Frequency of Projection', 'F. Frequency of Projection'], ['g-compliance-asops', 'G. Compliance with ASOPs', 'G. Compliance with ASOPs']] },
  { id: 'section-5-reinsurance', title: 'Section 5: Reinsurance', anchor: 'Section 5 Reinsurance', children: [['a-treatment-reinsurance-aggregate-reserve', 'A. Treatment of Reinsurance in the Aggregate Reserve', 'A. Treatment of Reinsurance in the Aggregate Reserve']] },
  { id: 'section-6-standard-projection-amount', title: 'Section 6: Requirements for the Standard Projection Amount', anchor: 'Section 6 Requirements for the Standard Projection Amount', children: [['a-overview', 'A. Overview', 'A. Overview'], ['b-standard-projection-amount', 'B. Additional Standard Projection Amount', 'B. Additional Standard Projection Amount'], ['c-prescribed-assumptions', 'C. Prescribed Assumptions', 'C. Prescribed Assumptions']] },
  { id: 'section-7-stochastic-exclusion', title: 'Section 7: Stochastic Exclusion and Single Scenario Testing', anchor: 'Section 7 Stochastic Exclusion and Single Scenario Testing', children: [['a-requirement-overview', 'A. Stochastic Exclusion Test Requirement Overview', 'A. Stochastic Exclusion Test Requirement Overview'], ['b-requirements-to-pass-tests', 'B. Requirements to Pass the Stochastic Exclusion Tests', 'B. Requirements to Pass the Stochastic Exclusion Tests'], ['c-stochastic-exclusion-ratio-test', 'C. Stochastic Exclusion Ratio Test', 'C. Stochastic Exclusion Ratio Test'], ['d-stochastic-exclusion-demonstration-test', 'D. Stochastic Exclusion Demonstration Test', 'D. Stochastic Exclusion Demonstration Test'], ['e-single-scenario-test', 'E. Single Scenario Test', 'E. Single Scenario Test']] },
  { id: 'section-8-scenario-generation', title: 'Section 8: Scenario Generation', anchor: 'Section 8 Scenario Generation', children: [['a-general', 'A. General', 'A. General'], ['b-interest-rate-generator', 'B. Prescribed Interest Rate Scenario Generator', 'B. Prescribed Interest Rate Scenario Generator'], ['c-total-investment-return-generator', 'C. Prescribed Total Investment Return Scenario Generator for Equity Assets and Separate Account', 'C. Prescribed Total Investment Return Scenario Generator for Equity Assets and Separate Account'], ['d-implied-volatility', 'D. Implied Volatility Scenarios', 'D. Implied Volatility Scenarios'], ['e-non-prescribed-generators', 'E. Use of Non-Prescribed Scenario Generators', 'E. Use of Non-Prescribed Scenario Generators'], ['f-number-of-scenarios', 'F. Number of Scenarios', 'F. Number of Scenarios']] },
  { id: 'section-9-hedges', title: 'Section 9: Modeling Hedges under a Future Non-Index Credit Hedging Strategy', anchor: 'Section 9 Modeling Hedges under a Future Non Index Credit Hedging Strategy', children: [['a-initial-considerations', 'A. Initial Considerations', 'A. Initial Considerations'], ['b-modeling-approaches', 'B. Modeling Approaches', 'B. Modeling Approaches'], ['c-calculation-sr-reported', 'C. Calculation of SR (Reported)', 'C. Calculation of SR (Reported)'], ['d-cte70-best-efforts', 'D. Additional Considerations for CTE70', 'D. Additional Considerations for CTE70'], ['e-specific-considerations-requirements', 'E. Specific Considerations and Requirements', 'E. Specific Considerations and Requirements']] },
  { id: 'section-10-contract-holder-behavior', title: 'Section 10: Guidance and Requirements for Setting Contract Holder Behavior Prudent Estimate Assumptions', anchor: 'Section 10 Guidance and Requirements for Setting Contract Holder Behavior Prudent Estimate Assumptions', children: [['a-general', 'A. General', 'A. General'], ['b-aggregate-individual-margins', 'B. Aggregate vs. Individual Margins', 'B. Aggregate vs. Individual Margins'], ['c-sensitivity-testing', 'C. Sensitivity Testing', 'C. Sensitivity Testing'], ['d-specific-considerations-requirements', 'D. Specific Considerations and Requirements', 'D. Specific Considerations and Requirements'], ['e-dynamic-assumptions', 'E. Dynamic Assumptions', 'E. Dynamic Assumptions'], ['f-consistency-scenarios', 'F. Consistency with the CTE Level', 'F. Consistency with the CTE Level'], ['g-guaranteed-benefits', 'G. Additional Considerations and Requirements for Assumptions Applicable to Guaranteed Benefits', 'G. Additional Considerations and Requirements for Assumptions Applicable to Guaranteed'], ['h-policy-loans', 'H. Policy Loans', 'H. Policy Loans'], ['i-non-guaranteed-elements', 'I. Non-Guaranteed Elements', 'I. Non-Guaranteed Elements']] },
  { id: 'section-11-mortality', title: 'Section 11: Guidance and Requirements for Setting Prudent Estimate Mortality Assumptions', anchor: 'Section 11 Guidance and Requirements for Setting Prudent Estimate Mortality Assumptions', children: [['a-overview', 'A. Overview', 'A. Overview'], ['b-expected-mortality-curves', 'B. Determination of Expected Mortality Curves', 'B. Determination of Expected Mortality Curves'], ['c-credibility-adjustment', 'C. Adjustment for Credibility to Determine Prudent Estimate Mortality', 'C. Adjustment for Credibility to Determine Prudent Estimate Mortality'], ['d-future-mortality-improvement', 'D. Future Mortality Improvement', 'D. Future Mortality Improvement']] },
  { id: 'section-12-other-assumptions', title: 'Section 12: Other Guidance and Requirements for Assumptions', anchor: 'Section 12 Other Guidance and Requirements for Assumptions', children: [['a-overview', 'A. Overview', 'A. Overview'], ['b-general-assumption-requirements', 'B. General Assumption Requirements', 'B. General Assumption Requirements'], ['c-assumption-margins', 'C. Assumption Margins', 'C. Assumption Margins'], ['d-expense-assumptions', 'D. Expense Assumptions', 'D. Expense Assumptions']] },
  { id: 'section-13-contract-allocation', title: 'Section 13: Allocation of Aggregate Reserves to the Contract Level', anchor: 'Section 13 Allocation of Aggregate Reserves to the Contract Level', children: [['a-contract-level-reserve', 'A. Contract-level reserve', 'A. Contract -level reserve'], ['b-scenario-apv', 'B. Scenario actuarial present value (APV)', 'B. Scenario actuarial present value'], ['c-minimum-allocation-value', 'C. Minimum allocation value (MAV)', 'C. Minimum allocation value'], ['d-allocated-excess-reserve', 'D. Allocated excess reserve (AER)', 'D. Allocated excess reserve'], ['e-example', 'E. Example', 'E. Example']] },
  { id: 'closing-boundary', title: 'VM-22 closing boundary before VM-25', boundaryPage: 318, children: [['intentional-blank-page', 'Intentional blank page 22-92', null]] },
]

for (const parent of parentSpecs) parent.children = parent.children.map(([id, title, anchor]) => ({ id, title, anchor }))
const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const sha256 = (value) => crypto.createHash('sha256').update(value, 'utf8').digest('hex')
const unique = (values) => [...new Set(values.filter(Boolean))]
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const anchorRegex = (anchor) => new RegExp((String(anchor).match(/[A-Za-z0-9]+/g) ?? []).map(escapeRegex).join('[^A-Za-z0-9]+'), 'gi')
const findAnchor = (text, anchor, from = 0, occurrence = 1, limit = text.length) => {
  const regex = anchorRegex(anchor); regex.lastIndex = from; let match = null
  for (let index = 0; index < occurrence; index += 1) { match = regex.exec(text); if (!match || match.index >= limit) throw new Error(`VM-22 anchor not found: ${anchor}`) }
  return { index: match.index, end: match.index + match[0].length }
}
const findSectionAnchor = (text, anchor) => {
  try { return findAnchor(text, anchor, 0, 2).index } catch { return findAnchor(text, anchor, 0, 1).index }
}
const markerIndexForPage = (text, page) => { const index = text.indexOf(`[p. ${page}]`); if (index < 0) throw new Error(`VM-22 extraction is missing page marker ${page}.`); return index }
const pageAt = (text, index) => { const direct = text.slice(index).match(/^\[p\.\s*(\d+)\]/); if (direct) return Number(direct[1]); const matches = [...text.slice(0, index).matchAll(/\[p\.\s*(\d+)\]/g)]; if (!matches.length) throw new Error(`VM-22 segment has no page marker at ${index}.`); return Number(matches.at(-1)[1]) }
const pageRangeFor = (text, start, end) => ({ start: pageAt(text, start), end: pageAt(text, Math.max(start, end - 1)) })
const pageCitation = (pages) => `PDF pp. ${pages.start}-${pages.end}; printed VM-22 pp. 22-${pages.start - 226} to 22-${pages.end - 226}`

const crossReferencePatterns = [
  ['VM-01', /VM\s*-\s*01\b/i], ['VM-20', /VM\s*-\s*20\b/i], ['VM-21', /VM\s*-\s*21\b/i], ['VM-22', /VM\s*-\s*22\b/i], ['VM-31', /VM\s*-\s*31\b/i],
  ['VM-A', /VM\s*-\s*A\b/i], ['VM-C', /VM\s*-\s*C\b/i], ['VM-M', /VM\s*-\s*M\b/i], ['VM-V', /VM\s*-\s*V\b/i], ['Model #820', /Model\s*#\s*820\b/i],
  ['ASOPs', /\bASOPs?\b/i], ['AP&P Manual', /AP\s*&\s*P\s+Manual|Accounting Practices and Procedures/i], ['NAIC scenario generators', /NAIC\s+scenario\s+generators?/i],
]
export const deriveVm22CrossReferences = (text) => crossReferencePatterns.filter(([, pattern]) => pattern.test(text)).map(([label]) => label)
const extractAcronyms = (text) => unique((String(text).match(/\b(?:VM\s*-\s*22|DR|SR|NAER|CTE\s*\d+|SERT|SST|MAV|AER|APV|GAPV|NGE|ASOPs?|RBC)\b/gi) ?? []).map((value) => normalize(value).toUpperCase()))
const titleKeywords = (title) => unique(String(title).replace(/\d+|[A-Z]\./g, ' ').split(/[^A-Za-z0-9]+/).filter((token) => token.length > 2))
const deriveProvisionTypes = (text, parentId) => {
  const value = normalize(text); const types = []
  if (parentId === 'section-1-background') types.push('background_context')
  if (parentId.includes('scope-effective-date')) types.push('scope_or_applicability')
  if (parentId.includes('reserve-methodology') || parentId.includes('determination-dr-sr')) types.push('reserve_methodology_requirement')
  if (parentId.includes('reinsurance')) types.push('reinsurance_requirement')
  if (parentId.includes('standard-projection')) types.push('standard_projection_requirement')
  if (parentId.includes('stochastic-exclusion')) types.push('stochastic_exclusion_requirement')
  if (parentId.includes('scenario-generation')) types.push('scenario_generation_requirement')
  if (parentId.includes('hedges')) types.push('hedging_or_risk_mitigation')
  if (parentId.includes('behavior') || parentId.includes('mortality') || parentId.includes('other-assumptions')) types.push('assumption_requirement')
  if (parentId.includes('contract-allocation')) types.push('contract_allocation_requirement')
  if (/\bshall\b|\bmust\b|\brequired\b/i.test(value)) types.push('regulatory_requirement')
  if (/\bmay\b|\bpermitted\b|\belect(?:ion|ive)?\b/i.test(value)) types.push('permission_or_election')
  if (/\bunless\b|\bexcept\b|\bprovided that\b|\bif\b/i.test(value)) types.push('exception_or_condition')
  if (/Guidance\s+Note/i.test(value)) types.push('guidance_note_present')
  if (/\bTable\s+(?:\d|[A-Z]-)|\bmatrix\b|\b(?:lookup|mortality|factor)\s+table\b/i.test(value)) types.push('structured_table_evidence')
  if (/\bformula\b|\bcalculate\b|\bcalculation\b|\bCTE\s*\d|\bGAPV\b|\bNAER\b|\bAPV\b|\bMAV\b|\bAER\b/i.test(value)) types.push('calculation_or_formula')
  if (/\bdocument(?:ation|ed)?\b|\breport(?:ing)?\b|\brecords?\b|\bretain\b/i.test(value)) types.push('documentation_or_reporting_obligation')
  if (/\beffective date\b|\bvaluation date\b|\bwithin \d+\b|\bannually\b|\btime horizon\b/i.test(value)) types.push('timing_or_effective_date')
  if (deriveVm22CrossReferences(text).length > 0) types.push('cross_reference')
  return unique(types.length ? types : ['contextual_source_provision'])
}
const deriveStructuredEvidence = (text, sourceChunkId = '') => {
  const labels = [
    ...(String(text).match(/\bTable\s+(?:\d+(?:\.\d+)?|[A-Z]-?\d+)\b/gi) ?? []),
    ...(String(text).match(/\b(?:correlation matrix|factor grid|lookup table|mortality table|factor table)\b/gi) ?? []),
  ]
  const candidates = labels.map((label) => ({ sourceChunkId, evidenceType: /matrix|grid/i.test(label) ? 'matrix_or_grid' : 'table_or_formula', label: normalize(label), sourceBound: true, extractionTreatment: 'retained_in_exact_source_text', promotionStatus: 'not_promoted' }))
  return deduplicateStructuredEvidenceCandidates(candidates).map(({ sourceChunkId: _sourceChunkId, ...evidence }) => evidence)
}

export const loadVm22Chapter = async (repoRoot, input) => {
  const pageMap = new Map(); const sourceRecords = []; const overlapChecks = []
  for (const entry of input.extractions) {
    const [manifest, extraction] = await Promise.all([fs.readFile(path.resolve(repoRoot, entry.batchManifestPath), 'utf8').then(JSON.parse), fs.readFile(path.resolve(repoRoot, entry.extractionPath), 'utf8').then(JSON.parse)])
    const group = extraction.sourceGroups?.find((candidate) => candidate.extractedItems?.some((item) => item.chunkText)); const item = group?.extractedItems?.find((candidate) => candidate.chunkText); const sourceRecord = manifest.sourceFiles?.find((candidate) => candidate.sourceId === group?.sourceId)
    if (!sourceRecord || !item) throw new Error(`VM-22 extraction input is incomplete: ${entry.extractionPath}`)
    if (sourceRecord.fileHash !== VM22_SOURCE_SHA256) throw new Error(`VM-22 source hash mismatch for ${group.sourceId}.`)
    sourceRecords.push(sourceRecord); const rawText = String(item.chunkText); const markers = [...rawText.matchAll(/^\[p\.\s*(\d+)\]\s*/gm)]
    if (!markers.length) throw new Error(`VM-22 extraction has no page markers: ${entry.extractionPath}`)
    for (let index = 0; index < markers.length; index += 1) { const marker = markers[index]; const page = Number(marker[1]); const content = rawText.slice(marker.index + marker[0].length, markers[index + 1]?.index ?? rawText.length).trimEnd(); if (page < VM22_PAGE_RANGE.start || page > VM22_PAGE_RANGE.end) throw new Error(`VM-22 extraction crosses boundary at PDF page ${page}.`); if (pageMap.has(page)) { const exactMatch = pageMap.get(page).content === content; overlapChecks.push({ page, firstBatch: pageMap.get(page).batchId, duplicateBatch: manifest.batchId, exactMatch }); if (!exactMatch) throw new Error(`VM-22 overlapping extraction disagrees on PDF page ${page}.`) } else pageMap.set(page, { content, batchId: manifest.batchId }) }
  }
  const missingPages = []; for (let page = VM22_PAGE_RANGE.start; page <= VM22_PAGE_RANGE.end; page += 1) if (!pageMap.has(page)) missingPages.push(page); if (missingPages.length) throw new Error(`VM-22 extraction is missing PDF pages: ${missingPages.join(', ')}`)
  const chapterText = [...pageMap.entries()].sort(([a], [b]) => a - b).map(([page, record]) => `[p. ${page}] ${record.content}`).join('\n\n')
  return { chapterText, sourceRecords, overlapChecks, aggregateExtractionSha256: sha256(chapterText) }
}

export const segmentVm22Chapter = (chapterText) => {
  const parentStarts = parentSpecs.map((spec) => spec.opening ? 0 : spec.boundaryPage ? markerIndexForPage(chapterText, spec.boundaryPage) : findSectionAnchor(chapterText, spec.anchor))
  for (let index = 1; index < parentStarts.length; index += 1) if (parentStarts[index] <= parentStarts[index - 1]) throw new Error(`VM-22 parent anchors are out of order at ${parentSpecs[index].id}.`)
  const parents = parentSpecs.map((spec, parentIndex) => {
    const start = parentStarts[parentIndex]
    const end = parentStarts[parentIndex + 1] ?? chapterText.length
    const children = spec.children.map((childSpec, childIndex) => {
      const childStart = childSpec.anchor ? findAnchor(chapterText, childSpec.anchor, start, 1, end).index : start
      const next = spec.children[childIndex + 1]
      const childEnd = next?.anchor ? findAnchor(chapterText, next.anchor, childStart + 1, 1, end).index : end
      if (childEnd <= childStart) throw new Error(`Invalid VM-22 child boundary: ${spec.id}/${childSpec.id}.`)
      const text = chapterText.slice(childStart, childEnd).trim()
      return { ...childSpec, start: childStart, end: childEnd, text, pages: pageRangeFor(chapterText, childStart, childEnd), sourceTextSha256: sha256(text) }
    })
    const text = chapterText.slice(start, end).trim()
    return { ...spec, start, end, text, pages: pageRangeFor(chapterText, start, end), sourceTextSha256: sha256(text), children }
  })
  if (parents.length !== VM22_PARENT_COUNT || parents.reduce((sum, parent) => sum + parent.children.length, 0) !== VM22_CHILD_COUNT) throw new Error('VM-22 structural count mismatch.')
  for (let index = 1; index < parents.length; index += 1) if (parents[index - 1].end !== parents[index].start) throw new Error(`VM-22 parent coverage gap before ${parents[index].id}.`)
  return parents
}

export const buildVm22Chunks = async (repoRoot, source) => {
  const { chapterText } = await loadVm22Chapter(repoRoot, source.vm22Input); const parents = segmentVm22Chapter(chapterText); const ids = parents.flatMap((parent) => [`vm22-${parent.id}`, ...parent.children.map((child) => `vm22-${parent.id}-${child.id}`)]); const chunks = []; let ordinal = 1
  for (const parent of parents) {
    const parentId = `vm22-${parent.id}`; const boundaryOnly = parent.id === 'chapter-opening' || parent.id === 'closing-boundary'; const childIds = parent.children.map((child) => `vm22-${parent.id}-${child.id}`); const parentTypes = boundaryOnly ? ['boundary_control'] : unique(parent.children.flatMap((child) => deriveProvisionTypes(child.text, parent.id))); const parentRefs = deriveVm22CrossReferences(parent.text)
    chunks.push({ chunkId: parentId, chunkOrdinal: ordinal++, chunkKind: boundaryOnly ? 'boundary_slice' : 'source_excerpt', sourceTextType: 'actual_extracted_source_text', pageStart: parent.pages.start, pageEnd: parent.pages.end, sectionReference: parent.title, sourceTextExcerpt: parent.text, normalizedTextExcerpt: normalize(parent.text).toLowerCase(), summary: boundaryOnly ? `VM-22 ${parent.id === 'chapter-opening' ? 'opening' : 'closing'} boundary evidence.` : `Structural context for ${parent.title}; exact retained VM-22 source text controls.`, sourceTextSha256: parent.sourceTextSha256, topic: parent.title, headingPath: `VM-22 > ${parent.title}`, keyPoints: [`Context parent for ${parent.children.length} complete source unit${parent.children.length === 1 ? '' : 's'}.`], concepts: parentTypes, definedTerms: [], preserveEmptyDefinedTerms: true, acronyms: extractAcronyms(parent.text), requirements: [], preserveEmptyRequirements: true, controlledTags: unique(['vm22_current_manual', 'hierarchical_parent', 'review_only', ...parentTypes]), keywords: unique(['VM-22', parent.title, ...parentRefs, ...titleKeywords(parent.title)]), citations: [{ citationText: parent.title, pageReference: pageCitation(parent.pages), sectionReference: parent.title, sourceReference: source.sourceReference, lineReference: null }], fidelity: 'exact', confidence: 'high', reviewFlags: ['review_only', 'hierarchical_parent', 'requires_independent_review'], qualityNotes: ['Parent follows an explicit VM-22 chapter or section boundary.', 'Children retain complete source lettered provisions, nested content, formulas, qualifications, and tables.'], evidenceNotes: `Exact source segment from reviewed batches 038-054; source-text SHA-256 ${parent.sourceTextSha256}.`, chunkLevel: 'parent', parentChunkId: null, childChunkIds: childIds, precedingChunkId: ids[ids.indexOf(parentId) - 1] ?? null, followingChunkId: ids[ids.indexOf(parentId) + 1] ?? null, structuralLocator: `VM-22 / ${parent.title}`, chunkingMethod: 'hierarchical_structure', localTopics: titleKeywords(parent.title), provisionTypes: parentTypes, provisionTypeBasis: 'source_text_pattern_only', structuralBreadcrumb: `VM-22 > ${parent.title}`, boundaryQuality: { status: 'source_structural_parent', startsAtBoundary: true, note: 'Parent begins at an explicit chapter or source-section boundary.' }, crossReferenceCandidates: parentRefs, metadataDerivation: 'generated_from_source_text_without_source_text_rewrite', retrievalEligible: false, retrievalRole: 'context_only_parent', promotionEligible: false, structuredEvidence: deriveStructuredEvidence(parent.text) })
    for (const child of parent.children) { const childId = `vm22-${parent.id}-${child.id}`; const childIndex = ids.indexOf(childId); const types = boundaryOnly ? ['boundary_control'] : deriveProvisionTypes(child.text, parent.id); const refs = deriveVm22CrossReferences(child.text); chunks.push({ chunkId: childId, chunkOrdinal: ordinal++, chunkKind: boundaryOnly ? 'boundary_slice' : 'source_excerpt', sourceTextType: 'actual_extracted_source_text', pageStart: child.pages.start, pageEnd: child.pages.end, sectionReference: child.title, sourceTextExcerpt: child.text, normalizedTextExcerpt: normalize(child.text).toLowerCase(), summary: boundaryOnly ? `VM-22 ${child.title.toLowerCase()} retained as boundary evidence.` : `Complete VM-22 source unit for ${child.title}; exact source evidence controls over generated classifications.`, topic: `${parent.title} > ${child.title}`, headingPath: `VM-22 > ${parent.title} > ${child.title}`, sourceTextSha256: child.sourceTextSha256, keyPoints: [`Complete top-level VM-22 source unit for ${child.title}.`], concepts: types, definedTerms: [], preserveEmptyDefinedTerms: true, acronyms: extractAcronyms(child.text), requirements: [], preserveEmptyRequirements: true, controlledTags: unique(['vm22_current_manual', 'hierarchical_child', 'review_only', ...types]), keywords: unique(['VM-22', parent.title, child.title, ...refs, ...titleKeywords(child.title)]), citations: [{ citationText: child.title, pageReference: pageCitation(child.pages), sectionReference: child.title, sourceReference: source.sourceReference, lineReference: null }], fidelity: 'exact', confidence: 'high', reviewFlags: unique(['review_only', 'hierarchical_child', 'requires_independent_review', ...(types.includes('guidance_note_present') ? ['guidance_note_present'] : [])]), qualityNotes: ['Child retains one complete top-level VM-22 source unit with nested qualifications, guidance notes, formulas, and table text.', 'Generated classifications are retrieval aids and do not replace source evidence.'], evidenceNotes: `Exact source segment from reviewed batches 038-054; source-text SHA-256 ${child.sourceTextSha256}.`, chunkLevel: 'child', parentChunkId: parentId, childChunkIds: [], precedingChunkId: ids[childIndex - 1] ?? null, followingChunkId: ids[childIndex + 1] ?? null, structuralLocator: `VM-22 / ${parent.title} / ${child.title}`, chunkingMethod: 'semantic_boundary', localTopics: titleKeywords(child.title), provisionTypes: types, provisionTypeBasis: 'source_text_pattern_only', structuralBreadcrumb: `VM-22 > ${parent.title} > ${child.title}`, boundaryQuality: { status: boundaryOnly ? 'chapter_boundary' : 'lettered_boundary', startsAtBoundary: true, note: 'Child begins at an explicit source letter or chapter-boundary unit.' }, crossReferenceCandidates: refs, metadataDerivation: 'generated_from_source_text_without_source_text_rewrite', retrievalEligible: !boundaryOnly, retrievalRole: boundaryOnly ? 'context_only_boundary' : 'first_stage_retrieval', promotionEligible: false, structuredEvidence: deriveStructuredEvidence(child.text) }) }
  }
  if (chunks.length !== VM22_CHUNK_COUNT) throw new Error(`Expected ${VM22_CHUNK_COUNT} VM-22 chunks; found ${chunks.length}.`)
  return chunks
}

export const getVm22StructureSpecs = () => structuredClone(parentSpecs)
export const hashVm22SourceText = sha256
