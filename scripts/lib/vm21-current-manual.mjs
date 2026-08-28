import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export const VM21_SOURCE_SHA256 = '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9'
export const VM21_PAGE_RANGE = { start: 143, end: 225 }
export const VM21_PARENT_COUNT = 15
export const VM21_CHILD_COUNT = 63
export const VM21_CHUNK_COUNT = VM21_PARENT_COUNT + VM21_CHILD_COUNT

const parentSpecs = [
  {
    id: 'chapter-opening',
    title: 'VM-21 chapter opening and table of contents',
    opening: true,
    children: [['table-of-contents', 'Chapter title, table of contents, and Section 1 opener', null]],
  },
  {
    id: 'section-1-background',
    title: 'Section 1: Background',
    anchor: 'Section 1: Background',
    occurrence: 2,
    children: [
      ['a-purpose', 'A. Purpose', 'A. Purpose'],
      ['b-principles', 'B. Principles', 'B. Principles'],
      ['c-risks-reflected-and-not-reflected', 'C. Risks Reflected and Risks Not Reflected', 'C. Risks Reflected and Risks Not Reflected'],
      ['d-definitions', 'D. Definitions', 'D. Definitions'],
      ['e-materiality', 'E. Materiality', 'E. Materiality'],
    ],
  },
  {
    id: 'section-2-scope-effective-date',
    title: 'Section 2: Scope and Effective Date',
    anchor: 'Section 2: Scope and Effective Date',
    occurrence: 2,
    children: [
      ['a-scope', 'A. Scope', 'A. Scope'],
      ['b-effective-date-and-phase-in', 'B. Effective Date and Phase-In', 'B. Effective Date and Phase-In'],
      ['c-economic-scenario-generator-phase-in', 'C. Economic Scenario Generator Phase-In', 'C. Economic Scenario Generator Phase-In'],
    ],
  },
  {
    id: 'section-3-reserve-methodology',
    title: 'Section 3: Reserve Methodology',
    anchor: 'Section 3: Reserve Methodology',
    occurrence: 2,
    children: [
      ['a-aggregate-reserve', 'A. Aggregate Reserve', 'A. Aggregate Reserve'],
      ['b-impact-of-reinsurance-ceded', 'B. Impact of Reinsurance Ceded', 'B. Impact of Reinsurance Ceded'],
      ['c-additional-standard-projection-amount', 'C. The Additional Standard Projection Amount', 'C. The Additional Standard Projection Amount'],
      ['d-sr', 'D. The SR', 'D. The SR'],
      ['e-alternative-methodology', 'E. Alternative Methodology', 'E. Alternative Methodology'],
      ['f-contract-allocation', 'F. Allocation of the Aggregate Reserve to Contracts', 'F. Allocation of the Aggregate Reserve to Contracts'],
      ['g-general-account-reserve', 'G. Reserve to Be Held in the General Account', 'G. Reserve to Be Held in the General Account'],
      ['h-simplifications', 'H. Simplifications, approximations, and modeling efficiencies', 'H. A company may use simplifications'],
      ['i-calculation-date', 'I. Calculation date before the valuation date', 'I. The company may calculate the SR'],
    ],
  },
  {
    id: 'section-4-determination-of-sr',
    title: 'Section 4: Determination of the SR',
    anchor: 'Section 4: Determination of the SR',
    occurrence: 2,
    children: [
      ['a-projection-of-accumulated-deficiencies', 'A. Projection of Accumulated Deficiencies', 'A. Projection of Accumulated Deficiencies'],
      ['b-scenario-reserve', 'B. Determination of Scenario Reserve', 'B. Determination of Scenario Reserve'],
      ['c-projection-scenarios', 'C. Projection Scenarios', 'C. Projection Scenarios'],
      ['d-projection-of-assets', 'D. Projection of Assets', 'D. Projection of Assets'],
      ['e-annuitization-benefits', 'E. Projection of Annuitization Benefits', 'E. Projection of Annuitization Benefits'],
      ['f-projection-frequency-and-horizon', 'F. Frequency of Projection and Time Horizon', 'F. Frequency of Projection and Time Horizon'],
      ['g-asop-compliance', 'G. Compliance with ASOPs', 'G. Compliance with ASOPs'],
    ],
  },
  {
    id: 'section-5-reinsurance-ceded',
    title: 'Section 5: Reinsurance Ceded',
    anchor: 'Section 5: Reinsurance Ceded',
    occurrence: 2,
    children: [['a-treatment-in-aggregate-reserve', 'A. Treatment of Reinsurance Ceded in the Aggregate Reserve', 'A. Treatment of Reinsurance Ceded in the Aggregate Reserve']],
  },
  {
    id: 'section-6-additional-standard-projection-amount',
    title: 'Section 6: Requirements for the Additional Standard Projection Amount',
    anchor: 'Section 6: Requirements for the Additional Standard Projection Amount',
    occurrence: 2,
    children: [
      ['a-overview', 'A. Overview', 'A. Overview'],
      ['b-additional-standard-projection-amount', 'B. Additional Standard Projection Amount', 'B. Additional Standard Projection Amount'],
      ['c-prescribed-assumptions', 'C. Prescribed Assumptions', 'C. Prescribed Assumptions'],
    ],
  },
  {
    id: 'section-7-alternative-methodology',
    title: 'Section 7: Alternative Methodology',
    anchor: 'Section 7: Alternative Methodology',
    occurrence: 2,
    children: [
      ['a-general-methodology', 'A. General Methodology', 'A. General Methodology'],
      ['b-calculation-of-ca-and-fe', 'B. Calculation of CA and FE', 'B. Calculation of CA and FE'],
      ['c-calculation-of-gc-component', 'C. Calculation of the GC Component', 'C. Calculation of the GC Component'],
      ['d-fund-categorization', 'D. Fund Categorization', 'D. Fund Categorization'],
      ['e-tables', 'E. Tables', 'E. Tables'],
    ],
  },
  {
    id: 'section-8-scenario-generation',
    title: 'Section 8: Scenario Generation',
    anchor: 'Section 8: Scenario Generation',
    occurrence: 2,
    children: [
      ['a-general', 'A. General', 'A. General'],
      ['b-interest-rate-generator', 'B. Prescribed Interest Rate Scenario Generator', 'B. Prescribed Interest Rate Scenario Generator'],
      ['c-investment-return-generator', 'C. Prescribed Total Investment Return Scenario Generator', 'C. Prescribed Total Investment Return Scenario Generator'],
      ['d-implied-volatility', 'D. Implied Volatility Scenarios', 'D. Implied Volatility Scenarios'],
      ['e-non-prescribed-generators', 'E. Use of Non-Prescribed Scenario Generators', 'E. Use of Non-Prescribed Scenario Generators'],
      ['f-number-of-scenarios', 'F. Number of Scenarios', 'F. Number of Scenarios'],
    ],
  },
  {
    id: 'section-9-modeling-hedges',
    title: 'Section 9: Modeling of Hedges under a Future Non-Index Credit Hedging Strategy',
    anchor: 'Section 9: Modeling of Hedges under a Future Non-Index Credit Hedging Strategy',
    children: [
      ['a-initial-considerations', 'A. Initial Considerations', 'A. Initial Considerations'],
      ['b-modeling-approaches', 'B. Modeling Approaches', 'B. Modeling Approaches'],
      ['c-calculation-of-sr-reported', 'C. Calculation of SR (Reported)', 'C. Calculation of SR (Reported'],
      ['d-cte70-best-efforts', 'D. Additional Considerations for CTE 70 (best efforts)', 'D. Additional Considerations for CTE 70'],
      ['e-specific-requirements', 'E. Specific Considerations and Requirements', 'E. Specific Considerations and Requirements'],
    ],
  },
  {
    id: 'section-10-contract-holder-behavior',
    title: 'Section 10: Contract Holder Behavior Assumptions',
    anchor: 'Section 10: Contract Holder Behavior Assumptions',
    children: [
      ['a-general', 'A. General', 'A. General'],
      ['b-aggregate-vs-individual-margins', 'B. Aggregate vs. Individual Margins', 'B. Aggregate vs. Individual Margins'],
      ['c-sensitivity-testing', 'C. Sensitivity Testing', 'C. Sensitivity Testing'],
      ['d-specific-requirements', 'D. Specific Considerations and Requirements', 'D. Specific Considerations and Requirements'],
      ['e-dynamic-assumptions', 'E. Dynamic Assumptions', 'E. Dynamic Assumptions'],
      ['f-consistency-with-cte', 'F. Consistency with the CTE Level', 'F. Consistency with the CTE Level'],
      ['g-guaranteed-benefit-considerations', 'G. Additional Considerations and Requirements for Assumptions Applicable to Guaranteed Benefits', 'G. Additional Considerations and Requirements for Assumptions Applicable to Guaranteed'],
    ],
  },
  {
    id: 'section-11-mortality-assumptions',
    title: 'Section 11: Guidance and Requirements for Setting Prudent Estimate Mortality Assumptions',
    anchor: 'Section 11: Guidance and Requirements for Setting Prudent Estimate Mortality Assumptions',
    occurrence: 2,
    children: [
      ['a-overview', 'A. Overview', 'A. Overview'],
      ['b-expected-mortality-curves', 'B. Determination of Expected Mortality Curves', 'B. Determination of Expected Mortality Curves'],
      ['c-credibility-adjustment', 'C. Adjustment for Credibility to Determine Prudent Estimate Mortality', 'C. Adjustment for Credibility to Determine Prudent Estimate Mortality'],
      ['d-future-mortality-improvement', 'D. Future Mortality Improvement', 'D. Future Mortality Improvement'],
    ],
  },
  {
    id: 'section-12-other-assumptions',
    title: 'Section 12: Other Guidance and Requirements for Assumptions',
    anchor: 'Section 12: Other Guidance and Requirements for Assumptions',
    occurrence: 2,
    children: [
      ['a-overview', 'A. Overview', 'A. Overview'],
      ['b-general-requirements', 'B. General Assumption Requirements', 'B. General Assumption Requirements'],
      ['c-assumption-margins', 'C. Assumption Margins', 'C. Assumption Margins'],
      ['d-expense-assumptions', 'D. Expense Assumptions', 'D. Expense Assumptions'],
    ],
  },
  {
    id: 'section-13-contract-allocation',
    title: 'Section 13: Allocation of the Aggregate Reserve to the Contract Level',
    anchor: 'Section 13: Allocation of the Aggregate Reserve to the Contract Level',
    children: [
      ['a-cash-surrender-value', 'A. Contract cash surrender value', 'A. The contract’s cash surrender value'],
      ['b-excess-aggregate-reserve', 'B. Allocated excess aggregate reserve', 'B. An allocated portion of the excess of the aggregate reserve'],
    ],
  },
  {
    id: 'closing-boundary',
    title: 'VM-21 closing boundary before the unnumbered separator and VM-22',
    boundaryPage: 225,
    children: [['intentional-blank-page', 'Intentional blank page 21-83', null]],
  },
]

for (const parent of parentSpecs) parent.children = parent.children.map(([id, title, anchor]) => ({ id, title, anchor }))

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const anchorRegex = (anchor) => {
  const tokens = String(anchor).match(/[A-Za-z0-9]+/g) ?? []
  if (tokens.length === 0) throw new Error(`VM-21 anchor has no searchable tokens: ${anchor}`)
  return new RegExp(tokens.map(escapeRegex).join('[^A-Za-z0-9]+'), 'gi')
}
const findAnchor = (text, anchor, from = 0, occurrence = 1, limit = text.length) => {
  const regex = anchorRegex(anchor)
  regex.lastIndex = from
  let match = null
  for (let index = 0; index < occurrence; index += 1) {
    match = regex.exec(text)
    if (!match || match.index >= limit) throw new Error(`VM-21 anchor not found in structural order: ${anchor}`)
  }
  return { index: match.index, end: match.index + match[0].length }
}
const markerIndexForPage = (text, page) => {
  const marker = `[p. ${page}]`
  const index = text.indexOf(marker)
  if (index < 0) throw new Error(`VM-21 extraction is missing page marker ${marker}.`)
  return index
}
const pageAt = (text, index) => {
  const atIndex = text.slice(index).match(/^\[p\.\s*(\d+)\]/)
  if (atIndex) return Number(atIndex[1])
  const matches = [...text.slice(0, index).matchAll(/\[p\.\s*(\d+)\]/g)]
  if (matches.length === 0) throw new Error(`VM-21 source segment at offset ${index} has no preceding page marker.`)
  return Number(matches.at(-1)[1])
}
const pageRangeFor = (text, start, end) => ({ start: pageAt(text, start), end: pageAt(text, Math.max(start, end - 1)) })
const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const sha256 = (value) => crypto.createHash('sha256').update(value, 'utf8').digest('hex')
const unique = (values) => [...new Set(values.filter(Boolean))]

const crossReferencePatterns = [
  ['VM-01', /VM\s*-\s*01\b/i],
  ['VM-G', /VM\s*-\s*G\b/i],
  ['VM-C', /VM\s*-\s*C\b/i],
  ['VM-31', /VM\s*-\s*31\b/i],
  ['VM-22', /VM\s*-\s*22\b/i],
  ['Model #820', /Model\s*#\s*820\b/i],
  ['AG 43', /AG\s*43\b|Actuarial\s+Guideline\s+XLIII/i],
  ['AG 33', /AG\s*33\b/i],
  ['RBC requirements', /\bRBC\s+requirements?\b/i],
  ['C3 RBC amount', /\bC\s*-?\s*3\s+RBC\s+amount\b/i],
  ['Life RBC instructions', /\bLife\s+RBC\s+instructions\b/i],
  ['ASOPs', /\bASOPs?\b/i],
  ['AP&P Manual', /AP\s*&\s*P\s+Manual/i],
  ['NAIC scenario generators', /NAIC\s+scenario\s+generators?/i],
]

export const deriveVm21CrossReferences = (text) => crossReferencePatterns.filter(([, pattern]) => pattern.test(text)).map(([label]) => label)

const definitionsByChild = new Map([
  ['section-1-background/d-definitions', ['cash surrender value', 'guaranteed minimum death benefit', 'GMDB', 'total asset requirement', 'TAR']],
  ['section-7-alternative-methodology/a-general-methodology', [
    'Annualized Account Charge Differential', 'Asset Exposure', 'Benchmark', 'Deterministic Calculations', 'Foreign Securities',
    'Grouped Fund Holdings', 'Guaranteed Value', 'High-Yield Bonds', 'Investment Grade Fixed Income Securities', 'Liquid Securities',
    'Margin Offset', 'Multi-Point Linear Interpolation', 'Model Office', 'Quota-Share Reinsurance', 'Resets', 'Risk Mitigation Strategy',
    'Risk Profile', 'Risk Transfer Arrangements', 'Roll-Up', 'Volatility',
  ]],
])

const deriveProvisionTypes = (text, parentId, childId = null) => {
  const value = normalize(text)
  const types = []
  if (parentId.includes('scope-effective-date')) types.push('scope_or_applicability')
  if (parentId.includes('reserve-methodology') || parentId.includes('determination-of-sr')) types.push('reserve_methodology_requirement')
  if (parentId.includes('reinsurance')) types.push('reinsurance_requirement')
  if (parentId.includes('additional-standard')) types.push('additional_standard_projection_requirement')
  if (parentId.includes('alternative-methodology')) types.push('alternative_methodology')
  if (parentId.includes('scenario-generation')) types.push('scenario_generation_requirement')
  if (parentId.includes('modeling-hedges')) types.push('hedging_or_risk_mitigation')
  if (parentId.includes('behavior') || parentId.includes('mortality') || parentId.includes('other-assumptions')) types.push('assumption_requirement')
  if (parentId.includes('contract-allocation')) types.push('contract_allocation_requirement')
  if (definitionsByChild.has(`${parentId}/${childId}`)) types.push('definition_or_terminology')
  if (/\bshall\b|\bmust\b|\brequired\b/i.test(value)) types.push('regulatory_requirement')
  if (/\bmay\b|\bpermitted\b|\belect(?:ion|ive)?\b/i.test(value)) types.push('permission_or_election')
  if (/\bunless\b|\bexcept\b|\bprovided that\b|\bif\b/i.test(value)) types.push('exception_or_condition')
  if (/Guidance\s+Note/i.test(value)) types.push('guidance_note_present')
  if (/\bTable\s+(?:\d|[A-Z]-)|\bcorrelation matrix\b/i.test(value)) types.push('structured_table_evidence')
  if (/\bformula\b|\bcalculate\b|\bcalculation\b|\bCTE\s*\d|\bGAPV\b|\bNAER\b/i.test(value)) types.push('calculation_or_formula')
  if (/\bdocument(?:ation|ed)?\b|\breport(?:ing)?\b|\brecords?\b|\bretain\b/i.test(value)) types.push('documentation_or_reporting_obligation')
  if (/\beffective date\b|\bvaluation date\b|\bwithin \d+\b|\bannually\b|\btime horizon\b/i.test(value)) types.push('timing_or_effective_date')
  if (deriveVm21CrossReferences(text).length > 0) types.push('cross_reference')
  return unique(types.length > 0 ? types : ['contextual_source_provision'])
}

const extractAcronyms = (text) => unique((String(text).match(/\b(?:VM\s*-\s*21|VA|SR|TAR|GMDB|GMIB|GMWB|GMAB|VAGLB|GAPV|NAER|CTE\s*\d+|RBC|CARVM|CDHS|ASOPs?|PIMR|CA|FE|GC)\b/gi) ?? []).map((value) => normalize(value).toUpperCase()))
const titleKeywords = (title) => unique(String(title).replace(/\d+|[A-Z]\./g, ' ').split(/[^A-Za-z0-9]+/).filter((token) => token.length > 2))
const pageCitation = (pages) => `PDF pp. ${pages.start}-${pages.end}; printed VM-21 pp. 21-${pages.start - 142} to 21-${pages.end - 142}`

const deriveStructuredEvidence = (text) => {
  const labels = unique([
    ...(String(text).match(/\bTable\s+(?:\d+(?:\.\d+)?|[A-Z]-?\d+)\b/gi) ?? []),
    ...(String(text).match(/\b(?:correlation matrix|factor grid|lookup table)\b/gi) ?? []),
  ].map(normalize))
  return labels.map((label) => ({ evidenceType: /matrix/i.test(label) ? 'matrix' : 'table_or_grid', label, sourceBound: true, extractionTreatment: 'retained_in_exact_source_text', promotionStatus: 'not_promoted' }))
}

export const loadVm21Chapter = async (repoRoot, input) => {
  const pageMap = new Map()
  const sourceRecords = []
  const overlapChecks = []
  for (const entry of input.extractions) {
    const [manifest, extraction] = await Promise.all([
      fs.readFile(path.resolve(repoRoot, entry.batchManifestPath), 'utf8').then(JSON.parse),
      fs.readFile(path.resolve(repoRoot, entry.extractionPath), 'utf8').then(JSON.parse),
    ])
    const group = extraction.sourceGroups?.find((candidate) => candidate.extractedItems?.some((item) => item.chunkText))
    const item = group?.extractedItems?.find((candidate) => candidate.chunkText)
    const sourceRecord = manifest.sourceFiles?.find((candidate) => candidate.sourceId === group?.sourceId)
    if (!sourceRecord || !item) throw new Error(`VM-21 extraction input is incomplete for ${entry.extractionPath}.`)
    if (sourceRecord.fileHash !== VM21_SOURCE_SHA256) throw new Error(`VM-21 source hash mismatch for ${group.sourceId}.`)
    sourceRecords.push(sourceRecord)
    const rawText = String(item.chunkText)
    const markers = [...rawText.matchAll(/^\[p\.\s*(\d+)\]\s*/gm)]
    if (markers.length === 0) throw new Error(`VM-21 extraction has no page markers: ${entry.extractionPath}.`)
    for (let markerIndex = 0; markerIndex < markers.length; markerIndex += 1) {
      const marker = markers[markerIndex]
      const page = Number(marker[1])
      const content = rawText.slice(marker.index + marker[0].length, markers[markerIndex + 1]?.index ?? rawText.length).trimEnd()
      if (page < VM21_PAGE_RANGE.start || page > VM21_PAGE_RANGE.end) throw new Error(`VM-21 extraction crosses the approved chapter boundary at PDF page ${page}.`)
      if (pageMap.has(page)) {
        const equal = pageMap.get(page).content === content
        overlapChecks.push({ page, firstBatch: pageMap.get(page).batchId, duplicateBatch: manifest.batchId, exactMatch: equal })
        if (!equal) throw new Error(`VM-21 overlapping extraction disagrees on PDF page ${page}.`)
      } else {
        pageMap.set(page, { content, batchId: manifest.batchId })
      }
    }
  }
  const missingPages = []
  for (let page = VM21_PAGE_RANGE.start; page <= VM21_PAGE_RANGE.end; page += 1) if (!pageMap.has(page)) missingPages.push(page)
  if (missingPages.length > 0) throw new Error(`VM-21 extraction is missing PDF pages: ${missingPages.join(', ')}.`)
  const chapterText = [...pageMap.entries()].sort(([a], [b]) => a - b).map(([page, record]) => `[p. ${page}] ${record.content}`).join('\n\n')
  if (/\[p\.\s*226\]/i.test(chapterText)) throw new Error('VM-21 extraction unexpectedly crosses into the unnumbered separator page.')
  return { chapterText, sourceRecords, overlapChecks, aggregateExtractionSha256: sha256(chapterText) }
}

export const segmentVm21Chapter = (chapterText) => {
  const parentStarts = parentSpecs.map((spec) => spec.opening ? 0 : spec.boundaryPage ? markerIndexForPage(chapterText, spec.boundaryPage) : findAnchor(chapterText, spec.anchor, 0, spec.occurrence ?? 1).index)
  for (let index = 1; index < parentStarts.length; index += 1) if (parentStarts[index] <= parentStarts[index - 1]) throw new Error(`VM-21 parent anchors are out of order at ${parentSpecs[index].id}.`)
  const parents = parentSpecs.map((spec, parentIndex) => {
    const start = parentStarts[parentIndex]
    const end = parentStarts[parentIndex + 1] ?? chapterText.length
    const children = []
    for (let childIndex = 0; childIndex < spec.children.length; childIndex += 1) {
      const childSpec = spec.children[childIndex]
      const childStart = childSpec.anchor ? findAnchor(chapterText, childSpec.anchor, start, 1, end).index : start
      const nextChild = spec.children[childIndex + 1]
      const childEnd = nextChild?.anchor ? findAnchor(chapterText, nextChild.anchor, childStart + 1, 1, end).index : end
      if (childEnd <= childStart) throw new Error(`Invalid VM-21 child boundary: ${spec.id}/${childSpec.id}.`)
      const text = chapterText.slice(childStart, childEnd).trim()
      children.push({ ...childSpec, start: childStart, end: childEnd, text, pages: pageRangeFor(chapterText, childStart, childEnd), sourceTextSha256: sha256(text) })
    }
    const text = chapterText.slice(start, end).trim()
    return { ...spec, start, end, text, pages: pageRangeFor(chapterText, start, end), sourceTextSha256: sha256(text), children }
  })
  if (parents.length !== VM21_PARENT_COUNT || parents.reduce((sum, parent) => sum + parent.children.length, 0) !== VM21_CHILD_COUNT) throw new Error('VM-21 structural count mismatch.')
  for (let index = 1; index < parents.length; index += 1) if (parents[index - 1].end !== parents[index].start) throw new Error(`VM-21 parent coverage gap before ${parents[index].id}.`)
  return parents
}

export const buildVm21Chunks = async (repoRoot, source) => {
  const { chapterText } = await loadVm21Chapter(repoRoot, source.vm21Input)
  const parents = segmentVm21Chapter(chapterText)
  const ids = parents.flatMap((parent) => [`vm21-${parent.id}`, ...parent.children.map((child) => `vm21-${parent.id}-${child.id}`)])
  const chunks = []
  let ordinal = 1
  for (const parent of parents) {
    const parentId = `vm21-${parent.id}`
    const parentIndex = ids.indexOf(parentId)
    const boundaryOnly = parent.id === 'chapter-opening' || parent.id === 'closing-boundary'
    const childIds = parent.children.map((child) => `vm21-${parent.id}-${child.id}`)
    const parentTypes = boundaryOnly ? ['boundary_control'] : unique(parent.children.flatMap((child) => deriveProvisionTypes(child.text, parent.id, child.id)))
    const parentReferences = deriveVm21CrossReferences(parent.text)
    chunks.push({
      chunkId: parentId, chunkOrdinal: ordinal++, chunkKind: boundaryOnly ? 'boundary_slice' : 'source_excerpt', sourceTextType: 'actual_extracted_source_text', pageStart: parent.pages.start, pageEnd: parent.pages.end,
      sectionReference: parent.title, sourceTextExcerpt: parent.text, normalizedTextExcerpt: normalize(parent.text).toLowerCase(), summary: boundaryOnly ? `VM-21 ${parent.id === 'chapter-opening' ? 'opening' : 'closing'} boundary evidence.` : `Structural context for ${parent.title}; generated metadata remains subordinate to the exact retained VM-21 source text.`,
      sourceTextSha256: parent.sourceTextSha256,
      topic: parent.title, headingPath: `VM-21 > ${parent.title}`, keyPoints: [`Context parent for ${parent.children.length} complete source unit${parent.children.length === 1 ? '' : 's'}.`], concepts: parentTypes, definedTerms: [], preserveEmptyDefinedTerms: true, acronyms: extractAcronyms(parent.text), requirements: [], preserveEmptyRequirements: true,
      controlledTags: unique(['vm21_current_manual', 'hierarchical_parent', 'review_only', ...parentTypes]), keywords: unique(['VM-21', parent.title, ...parentReferences, ...titleKeywords(parent.title)]), citations: [{ citationText: parent.title, pageReference: pageCitation(parent.pages), sectionReference: parent.title, sourceReference: source.sourceReference, lineReference: null }],
      fidelity: 'exact', confidence: 'high', reviewFlags: ['review_only', 'hierarchical_parent', 'requires_independent_review'], qualityNotes: ['Parent follows an explicit VM-21 section or chapter boundary.', 'Children retain complete top-level lettered provisions, nested lists, guidance notes, formulas, and table text.'], evidenceNotes: `Exact source segment from reviewed batches 022-037; source-text SHA-256 ${parent.sourceTextSha256}.`,
      chunkLevel: 'parent', parentChunkId: null, childChunkIds: childIds, precedingChunkId: ids[parentIndex - 1] ?? null, followingChunkId: ids[parentIndex + 1] ?? null, structuralLocator: `VM-21 / ${parent.title}`, chunkingMethod: 'hierarchical_structure', localTopics: titleKeywords(parent.title), provisionTypes: parentTypes, provisionTypeBasis: 'source_text_pattern_only', structuralBreadcrumb: `VM-21 > ${parent.title}`, boundaryQuality: { status: 'source_structural_parent', startsAtBoundary: true, note: 'Parent begins at an explicit chapter or source-section boundary.' }, crossReferenceCandidates: parentReferences, metadataDerivation: 'generated_from_source_text_without_source_text_rewrite', retrievalEligible: false, retrievalRole: 'context_only_parent', promotionEligible: false,
      structuredEvidence: deriveStructuredEvidence(parent.text),
    })
    for (const child of parent.children) {
      const childId = `vm21-${parent.id}-${child.id}`
      const childIndex = ids.indexOf(childId)
      const types = boundaryOnly ? ['boundary_control'] : deriveProvisionTypes(child.text, parent.id, child.id)
      const references = deriveVm21CrossReferences(child.text)
      const definedTerms = definitionsByChild.get(`${parent.id}/${child.id}`) ?? []
      chunks.push({
        chunkId: childId, chunkOrdinal: ordinal++, chunkKind: boundaryOnly ? 'boundary_slice' : 'source_excerpt', sourceTextType: 'actual_extracted_source_text', pageStart: child.pages.start, pageEnd: child.pages.end,
        sectionReference: child.title, sourceTextExcerpt: child.text, normalizedTextExcerpt: normalize(child.text).toLowerCase(), summary: boundaryOnly ? `VM-21 ${child.title.toLowerCase()} retained as boundary evidence.` : `Complete VM-21 source unit for ${child.title}; exact source evidence controls over generated classifications.`, topic: `${parent.title} > ${child.title}`, headingPath: `VM-21 > ${parent.title} > ${child.title}`,
        sourceTextSha256: child.sourceTextSha256,
        keyPoints: [`Complete top-level VM-21 source unit for ${child.title}.`], concepts: types, definedTerms, preserveEmptyDefinedTerms: true, acronyms: extractAcronyms(child.text), requirements: boundaryOnly || types.includes('definition_or_terminology') ? [] : types, preserveEmptyRequirements: true,
        controlledTags: unique(['vm21_current_manual', 'hierarchical_child', 'review_only', ...types]), keywords: unique(['VM-21', parent.title, child.title, ...definedTerms, ...references, ...titleKeywords(child.title)]), citations: [{ citationText: child.title, pageReference: pageCitation(child.pages), sectionReference: child.title, sourceReference: source.sourceReference, lineReference: null }],
        fidelity: 'exact', confidence: 'high', reviewFlags: unique(['review_only', 'hierarchical_child', 'requires_independent_review', ...(types.includes('guidance_note_present') ? ['guidance_note_present'] : [])]), qualityNotes: ['Child retains one complete top-level lettered VM-21 unit with all nested source text.', 'Generated classifications are retrieval aids and do not replace the source evidence.'], evidenceNotes: `Exact source segment from reviewed batches 022-037; source-text SHA-256 ${child.sourceTextSha256}.`,
        chunkLevel: 'child', parentChunkId: parentId, childChunkIds: [], precedingChunkId: ids[childIndex - 1] ?? null, followingChunkId: ids[childIndex + 1] ?? null, structuralLocator: `VM-21 / ${parent.title} / ${child.title}`, chunkingMethod: 'semantic_boundary', localTopics: titleKeywords(child.title), provisionTypes: types, provisionTypeBasis: 'source_text_pattern_only', structuralBreadcrumb: `VM-21 > ${parent.title} > ${child.title}`, boundaryQuality: { status: boundaryOnly ? 'chapter_boundary' : 'lettered_boundary', startsAtBoundary: true, note: 'Child begins at an explicit source letter or chapter-boundary unit.' }, crossReferenceCandidates: references, metadataDerivation: 'generated_from_source_text_without_source_text_rewrite', retrievalEligible: !boundaryOnly, retrievalRole: boundaryOnly ? 'context_only_boundary' : 'first_stage_retrieval', promotionEligible: false,
        structuredEvidence: deriveStructuredEvidence(child.text),
      })
    }
  }
  if (chunks.length !== VM21_CHUNK_COUNT) throw new Error(`Expected ${VM21_CHUNK_COUNT} VM-21 chunks; found ${chunks.length}.`)
  return chunks
}

export const getVm21StructureSpecs = () => structuredClone(parentSpecs)
export const hashVm21SourceText = sha256
