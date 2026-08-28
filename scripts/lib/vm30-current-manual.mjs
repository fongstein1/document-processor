import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export const VM30_SOURCE_SHA256 = '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9'
export const VM30_PAGE_RANGE = { start: 325, end: 339 }
export const VM30_PARENT_COUNT = 8
export const VM30_CHILD_COUNT = 43
export const VM30_CHUNK_COUNT = VM30_PARENT_COUNT + VM30_CHILD_COUNT

const parentSpecs = [
  {
    id: 'section-1-a-general',
    title: 'Section 1.A: Scope - General',
    anchor: 'Section 1 Scope',
    occurrence: 2,
    children: [
      ['1-aom-requirement-scope', '1. AOM requirement scope and actuarial opinion meaning', '1 The following provisions contain the requirements'],
      ['2-annual-statement-applicability', '2. Annual statement applicability and exclusions', '2 Actuarial opinion and supporting actuarial memoranda requirements'],
      ['3-professional-judgment-and-commissioner-authority', '3. Professional judgment, commissioner authority, and applicable guidelines', '3 The AOM requirements shall be applied'],
      ['4-annual-requirement-and-operative-date', '4. Annual requirement and operative-date applicability', '4 These AOM requirements are applicable'],
      ['5-company-level-opinion', '5. Company-level opinion requirement', '5 The requirements for an opinion apply'],
    ],
  },
  {
    id: 'section-1-b-definitions',
    title: 'Section 1.B: Definitions',
    anchor: 'B Definitions',
    children: [
      ['1-adverse-opinion', '1. Adverse opinion', '1 The term adverse opinion means'],
      ['2-qualified-opinion', '2. Qualified opinion', '2 The term qualified opinion means'],
      ['3-inconclusive-opinion', '3. Inconclusive opinion', '3 The term inconclusive opinion means'],
    ],
  },
  {
    id: 'section-2-a-general',
    title: 'Section 2.A: General submission requirements',
    anchor: 'Section 2 General Requirements for Submission of Statement of a Life Actuarial Opinion',
    occurrence: 2,
    children: [
      ['1-opinion-in-annual-statement', '1. Statement of Actuarial Opinion in annual statement', '1 The statement of an appointed actuary'],
      ['2-appointed-actuary-notice', '2. Appointed-actuary notice within five business days', '2 Within five business days of the appointment'],
      ['3-replacement-and-disagreement-notices', '3. Replacement and disagreement notices', '3 If an actuary who was the appointed actuary'],
    ],
  },
  {
    id: 'section-2-b-asset-adequacy-standards',
    title: 'Section 2.B: Standards for Asset Adequacy Analysis',
    anchor: 'B Standards for Asset Adequacy Analysis',
    children: [
      ['1-standards-of-practice', '1. Standards of Practice basis', '1 The asset adequacy analysis must conform'],
      ['2-methods-of-analysis', '2. Appropriate methods of analysis', '2 The asset adequacy analysis must be based'],
    ],
  },
  {
    id: 'section-2-c-liabilities-covered',
    title: 'Section 2.C: Liabilities to Be Covered',
    anchor: 'C Liabilities to Be Covered',
    children: [
      ['1-all-in-force-business', '1. All in-force business', '1 The statement of actuarial opinion must apply'],
      ['2-additional-reserve', '2. Additional reserve determined by asset adequacy analysis', '2 If the appointed actuary determines'],
      ['3-release-and-disclosure', '3. Release and disclosure of additional reserves', '3 Additional reserves established'],
    ],
  },
  {
    id: 'section-3-a-statement-of-actuarial-opinion',
    title: 'Section 3.A: Statement of Actuarial Opinion Based on an Asset Adequacy Analysis',
    anchor: 'Section 3 Requirements Specific to Life Actuarial Opinions',
    occurrence: 2,
    children: [
      ['1-required-opinion-sections', '1. Required opinion sections', '1 The statement of actuarial opinion shall consist'],
      ['2-prescribed-wording-changes', '2. Prescribed wording and changes', '2 Each section must be clearly designated'],
      ['3-table-of-key-indicators', '3. Table of key indicators', '3 The table of key indicators'],
      ['4-identification-section', '4. Identification section and qualifications', '4 The identification section should specifically indicate'],
      ['5-scope-section-and-reserve-table', '5. Scope section and asset-adequacy-tested reserve table', '5 The scope section should contain only'],
      ['6-reliance-section', '6. Reliance section', '6 The reliance section should contain only'],
      ['7-opinion-section', '7. Opinion section', '7 The opinion section should include only'],
      ['8-relevant-comments', '8. Relevant comments section', '8 The opinion may include a relevant comments section'],
      ['9-signature-and-date', '9. Signature and date', '9 The opinion should conclude with the signature'],
      ['10-category-of-opinion', '10. Category of opinion', '10 If the appointed actuary is able to form an opinion'],
      ['11-new-issues-and-liabilities', '11. New issues, claims, and liabilities', '11 The adoption for new issues or new claims'],
      ['12-reliance-on-experts', '12. Reliance on experts and certification', '12 If the appointed actuary relies on other experts'],
    ],
  },
  {
    id: 'section-3-b-actuarial-memorandum',
    title: 'Section 3.B: Actuarial Memorandum, Asset Adequacy Analysis, and Regulatory Asset Adequacy Issues Summary',
    anchor: 'B Description of the Actuarial Memorandum Including an Asset Adequacy Analysis and Regulatory Asset Adequacy Issues Summary',
    children: [
      ['1-memorandum-availability', '1. Memorandum preparation and commissioner examination', '1 The appointed actuary shall prepare a memorandum'],
      ['2-reliance-on-other-actuaries', '2. Reliance on memoranda of other actuaries', '2 In preparing the memorandum'],
      ['3-commissioner-engaged-actuary', '3. Commissioner-engaged actuary, records, and confidentiality', '3 Any actuary engaged by the insurance commissioner'],
      ['4-required-standards-statement', '4. Required standards statement', '4 The memorandum shall include the following statement'],
      ['5-imr-and-avr-assets', '5. IMR and AVR assets in asset adequacy analysis', '5 An appropriate allocation of assets'],
      ['6-avr-disclosure', '6. AVR asset disclosure and selection method', '6 The amount of the assets used for the AVR'],
      ['7-equity-return-volatility', '7. Equity-return volatility under moderately adverse conditions', '7 When the form of asset'],
      ['8-seven-year-retention', '8. Seven-year documentation retention', '8 The appointed actuary shall retain on file'],
      ['9-analysis-standards-demonstration', '9. Demonstration of asset adequacy analysis standards', '9 When an actuarial opinion is provided the memorandum shall demonstrate'],
      ['10-reserve-information', '10. Reserve information', '10 When an actuarial opinion is provided the memorandum shall specify for reserves'],
      ['11-asset-information', '11. Asset information', '11 When an actuarial opinion is provided the memorandum shall specify for assets'],
      ['12-analysis-basis', '12. Analysis basis', '12 When an actuarial opinion is provided the memorandum shall specify for the analysis basis'],
      ['13-results-and-conclusions', '13. Results and conclusions', '13 When an actuarial opinion is provided the memorandum shall contain'],
      ['14-regulatory-asset-adequacy-issues-summary', '14. Regulatory Asset Adequacy Issues Summary', '14 The appointed actuary shall prepare a regulatory asset adequacy issues summary'],
    ],
  },
  {
    id: 'closing-boundary',
    title: 'VM-30 closing boundary before the unnumbered separator and VM-31',
    boundaryPage: 339,
    anchor: 'This page intentionally left blank',
    children: [['intentional-blank-page', 'Intentional blank page 30-15', 'This page intentionally left blank']],
  },
]

for (const parent of parentSpecs) parent.children = parent.children.map((child) => ({ id: child[0], title: child[1], anchor: child[2] }))

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const anchorRegex = (anchor) => {
  const tokens = String(anchor).match(/[A-Za-z0-9]+/g) ?? []
  if (tokens.length === 0) throw new Error(`VM-30 anchor has no searchable tokens: ${anchor}`)
  return new RegExp(tokens.map(escapeRegex).join('[^A-Za-z0-9]+'), 'gi')
}
const findAnchor = (text, anchor, from = 0, occurrence = 1, limit = text.length) => {
  const regex = anchorRegex(anchor)
  regex.lastIndex = from
  let match = null
  for (let index = 0; index < occurrence; index += 1) {
    match = regex.exec(text)
    if (!match || match.index >= limit) throw new Error(`VM-30 anchor not found in structural order: ${anchor}`)
  }
  return { index: match.index, end: match.index + match[0].length }
}
const markerIndexForPage = (text, page) => {
  const marker = `[p. ${page}]`
  const index = text.indexOf(marker)
  if (index < 0) throw new Error(`VM-30 extraction is missing page marker ${marker}.`)
  return index
}
const pageAt = (text, index) => {
  const atIndex = text.slice(index).match(/^\[p\.\s*(\d+)\]/)
  if (atIndex) return Number(atIndex[1])
  const matches = [...text.slice(0, index).matchAll(/\[p\.\s*(\d+)\]/g)]
  if (matches.length === 0) throw new Error(`VM-30 source segment at offset ${index} has no preceding page marker.`)
  return Number(matches.at(-1)[1])
}
const pageRangeFor = (text, start, end) => ({ start: pageAt(text, start), end: pageAt(text, Math.max(start, end - 1)) })
const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const sha256 = (value) => crypto.createHash('sha256').update(value, 'utf8').digest('hex')
const unique = (values) => [...new Set(values.filter(Boolean))]

const crossReferencePatterns = [
  ['VM-01', /VM\s*-\s*01\b/i],
  ['Model #820', /Model\s*#\s*820\b/i],
  ['AG 48', /AG\s*48\b/i],
  ['AG 51', /AG\s*51\b/i],
  ['AP&P Manual', /AP\s*&\s*P\s+Manual\b/i],
  ['ASOPs', /ASOP\s*s?\b/i],
  ['ASB', /\bASB\b/i],
  ['Actuarial Standards Board', /Actuarial\s+Standards\s+Board\b/i],
  ['Actuarial Opinion and Memorandum Regulation', /Actuarial\s+Opinion\s+and\s+Memorandum\s+Regulation\b/i],
  ['Standard Valuation Law', /Standard\s+Valuation\s+Law\b/i],
  ['annual statement instructions', /annual\s+statement\s+instructions\b/i],
  ['Academy qualification standards', /Academy\s+qualification\s+standards\b/i],
]

export const deriveVm30CrossReferences = (text) => {
  const labels = crossReferencePatterns.filter(([, pattern]) => pattern.test(text)).map(([label]) => label)
  if (labels.includes('ASB') && labels.includes('Actuarial Standards Board')) labels.splice(labels.indexOf('Actuarial Standards Board'), 1)
  return labels
}

const targetedProvisionTypes = new Map([
  ['section-1-a-general/1-aom-requirement-scope', ['scope_or_applicability', 'actuarial_opinion_requirement', 'actuarial_memorandum_requirement', 'cross_reference']],
  ['section-1-a-general/5-company-level-opinion', ['scope_or_applicability', 'actuarial_opinion_requirement']],
  ['section-1-b-definitions/1-adverse-opinion', ['definition_or_terminology', 'exception_or_exemption']],
  ['section-1-b-definitions/2-qualified-opinion', ['definition_or_terminology', 'exception_or_exemption', 'required_statement_or_disclosure']],
  ['section-1-b-definitions/3-inconclusive-opinion', ['definition_or_terminology', 'required_statement_or_disclosure']],
])

const deriveProvisionTypes = (text, title, parentId, childId = null) => {
  const targetedTypes = targetedProvisionTypes.get(`${parentId}/${childId}`)
  if (targetedTypes) return [...targetedTypes]
  const value = `${title} ${normalize(text)}`
  const types = []
  if (parentId === 'section-1-b-definitions') types.push('definition_or_terminology')
  if (parentId === 'section-2-b-asset-adequacy-standards' || parentId === 'section-2-c-liabilities-covered') types.push('asset_adequacy_analysis_requirement')
  if (parentId === 'section-3-a-statement-of-actuarial-opinion') types.push('actuarial_opinion_requirement')
  if (parentId === 'section-3-b-actuarial-memorandum') types.push('actuarial_memorandum_requirement')
  if (/applicable|scope|subject to|not subject|unless|each company|all in-force|each year|operative date/i.test(value)) types.push('scope_or_applicability')
  if (/actuarial opinion|opinion section|table of key indicators|identification section|scope section|reliance section|relevant comments/i.test(value)) types.push('actuarial_opinion_requirement')
  if (/memorandum/i.test(value)) types.push('actuarial_memorandum_requirement')
  if (/asset adequacy|cash-flow testing|moderately adverse|scenario|sensitivity testing/i.test(value)) types.push('asset_adequacy_analysis_requirement')
  if (/appointed actuary|actuary shall|actuary should|actuary may|actuary determines/i.test(value)) types.push('appointed_actuary_responsibility')
  if (/qualification|qualified actuary|member of the Academy/i.test(value)) types.push('qualification_requirement')
  if (/commissioner|insurance department|examiner/i.test(value)) types.push('commissioner_authority_or_process')
  if (/certif|signed and dated|signature/i.test(value)) types.push('certification')
  if (/document|memorandum|work papers|description|rationale|explanation|table|summary|statement|disclos/i.test(value)) types.push('documentation_requirement')
  if (/within five business days|within 10 business days|April 1|each year|annually|at least seven years|submitted|filed|annual statement/i.test(value)) types.push('submission_or_timing_requirement')
  if (/retain|retention|seven years|kept confidential/i.test(value)) types.push('retention_requirement')
  if (/unless|except|may be omitted|not required|not subject|if the response|qualified|adverse|inconclusive/i.test(value)) types.push('exception_or_exemption')
  if (/Guidance Note/i.test(value)) types.push('guidance_note_present')
  if (/shall include|should contain|must be included|required each year|shall provide|shall disclose|specify|prescribed wording/i.test(value)) types.push('required_statement_or_disclosure')
  if (/exhibit|supporting|attached statements|table of reserves|regulatory asset adequacy issues summary/i.test(value)) types.push('supporting_exhibit_or_material')
  if (deriveVm30CrossReferences(text).length > 0) types.push('cross_reference')
  return unique(types.length > 0 ? types : ['contextual_source_provision'])
}

const extractAcronyms = (text) => unique((String(text).match(/\b(?:AOM|A&H|P\/C|ASOPs?|ASB|AG\s*48|AG\s*51|AP&P|IMR|AVR|CTE\s*70)\b/gi) ?? []).map((value) => normalize(value).toUpperCase()))
const titleKeywords = (title) => unique(String(title).replace(/\d+|[A-C]\./g, ' ').split(/[^A-Za-z0-9]+/).filter((token) => token.length > 2))
const pageCitation = (pages) => `PDF pp. ${pages.start}-${pages.end}; printed VM-30 pp. 30-${pages.start - 324} to 30-${pages.end - 324}`
const sourceDefinedTermsByChildId = new Map([
  ['1-adverse-opinion', ['adverse opinion']],
  ['2-qualified-opinion', ['qualified opinion']],
  ['3-inconclusive-opinion', ['inconclusive opinion']],
])

export const loadVm30Chapter = async (repoRoot, input) => {
  const texts = []
  const sourceRecords = []
  for (const entry of input.extractions) {
    const [manifest, extraction] = await Promise.all([
      fs.readFile(path.resolve(repoRoot, entry.batchManifestPath), 'utf8').then(JSON.parse),
      fs.readFile(path.resolve(repoRoot, entry.extractionPath), 'utf8').then(JSON.parse),
    ])
    const sourceRecord = manifest.sourceFiles.find((source) => source.sourceId === entry.sourceId)
    const group = extraction.sourceGroups.find((candidate) => candidate.sourceId === entry.sourceId)
    const item = group?.extractedItems?.find((candidate) => candidate.chunkText)
    if (!sourceRecord || !group || !item) throw new Error(`VM-30 extraction input is incomplete for ${entry.sourceId}.`)
    if (sourceRecord.fileHash !== VM30_SOURCE_SHA256) throw new Error(`VM-30 source hash mismatch for ${entry.sourceId}.`)
    texts.push(String(item.chunkText).trim())
    sourceRecords.push(sourceRecord)
  }
  const chapterText = texts.join('\n\n')
  for (let page = VM30_PAGE_RANGE.start; page <= VM30_PAGE_RANGE.end; page += 1) markerIndexForPage(chapterText, page)
  if (/\[p\.\s*340\]|VM\s*-\s*31/i.test(chapterText)) throw new Error('VM-30 extraction unexpectedly crosses the chapter boundary.')
  return { chapterText, sourceRecords, aggregateExtractionSha256: sha256(chapterText) }
}

export const segmentVm30Chapter = (chapterText) => {
  const parentStarts = parentSpecs.map((spec) => spec.boundaryPage ? markerIndexForPage(chapterText, spec.boundaryPage) : findAnchor(chapterText, spec.anchor, 0, spec.occurrence ?? 1).index)
  for (let index = 1; index < parentStarts.length; index += 1) if (parentStarts[index] <= parentStarts[index - 1]) throw new Error(`VM-30 parent anchors are out of order at ${parentSpecs[index].id}.`)
  const parents = parentSpecs.map((spec, parentIndex) => {
    const start = parentStarts[parentIndex]
    const end = parentStarts[parentIndex + 1] ?? chapterText.length
    const children = []
    let childSearchFrom = start
    for (let childIndex = 0; childIndex < spec.children.length; childIndex += 1) {
      const childSpec = spec.children[childIndex]
      const childStart = spec.boundaryPage ? start : findAnchor(chapterText, childSpec.anchor, childSearchFrom, 1, end).index
      const nextChild = spec.children[childIndex + 1]
      const childEnd = nextChild ? findAnchor(chapterText, nextChild.anchor, childStart + 1, 1, end).index : end
      if (childEnd <= childStart) throw new Error(`Invalid VM-30 child boundary: ${spec.id}/${childSpec.id}.`)
      const text = chapterText.slice(childStart, childEnd).trim()
      children.push({ ...childSpec, start: childStart, end: childEnd, text, pages: pageRangeFor(chapterText, childStart, childEnd), sourceTextSha256: sha256(text) })
      childSearchFrom = childEnd
    }
    const text = chapterText.slice(start, end).trim()
    return { ...spec, start, end, text, pages: pageRangeFor(chapterText, start, end), sourceTextSha256: sha256(text), children }
  })
  if (parents.length !== VM30_PARENT_COUNT || parents.reduce((sum, parent) => sum + parent.children.length, 0) !== VM30_CHILD_COUNT) throw new Error('VM-30 structural count mismatch.')
  for (let index = 1; index < parents.length; index += 1) if (parents[index - 1].end !== parents[index].start) throw new Error(`VM-30 parent coverage gap before ${parents[index].id}.`)
  return parents
}

export const buildVm30Chunks = async (repoRoot, source) => {
  const { chapterText } = await loadVm30Chapter(repoRoot, source.vm30Input)
  const parents = segmentVm30Chapter(chapterText)
  const ids = parents.flatMap((parent) => [`vm30-${parent.id}`, ...parent.children.map((child) => `vm30-${parent.id}-${child.id}`)])
  const chunks = []
  let ordinal = 1
  for (const parent of parents) {
    const parentId = `vm30-${parent.id}`
    const parentIdIndex = ids.indexOf(parentId)
    const childIds = parent.children.map((child) => `vm30-${parent.id}-${child.id}`)
    const boundaryOnly = parent.id === 'closing-boundary'
    const parentTypes = boundaryOnly ? ['boundary_control'] : unique(parent.children.flatMap((child) => deriveProvisionTypes(child.text, child.title, parent.id, child.id)))
    const parentReferences = deriveVm30CrossReferences(parent.text)
    chunks.push({
      chunkId: parentId, chunkOrdinal: ordinal++, chunkKind: boundaryOnly ? 'boundary_slice' : 'source_excerpt', sourceTextType: 'actual_extracted_source_text', pageStart: parent.pages.start, pageEnd: parent.pages.end, sectionReference: parent.title, sourceTextExcerpt: parent.text, normalizedTextExcerpt: normalize(parent.text).toLowerCase(),
      summary: boundaryOnly ? 'VM-30 ends on printed page 30-15 before an unnumbered blank separator and the VM-31 opener.' : `Structural context for ${parent.title}; generated metadata remains subordinate to the retained VM-30 source text.`,
      topic: parent.title, headingPath: `VM-30 > ${parent.title}`, keyPoints: [boundaryOnly ? 'Boundary control only; this is not an actuarial opinion or memorandum requirement.' : `Context parent for ${parent.children.length} complete source provision${parent.children.length === 1 ? '' : 's'}.`], concepts: parentTypes, definedTerms: [], preserveEmptyDefinedTerms: true, acronyms: extractAcronyms(parent.text), requirements: boundaryOnly ? [] : parentTypes,
      controlledTags: unique(['vm30_current_manual', 'hierarchical_parent', 'review_only', ...parentTypes]), keywords: unique(['VM-30', parent.title, ...parentReferences, ...titleKeywords(parent.title)]), citations: [{ citationText: parent.title, pageReference: pageCitation(parent.pages), sectionReference: parent.title, sourceReference: source.sourceReference, lineReference: null }], fidelity: 'exact', confidence: 'high', reviewFlags: ['review_only', 'hierarchical_parent', 'requires_independent_review'], qualityNotes: ['Parent follows an explicit VM-30 subsection or closing boundary.', 'Numbered children retain complete nested lists, prescribed wording, guidance notes, and tables.'], evidenceNotes: `Exact source segment from reviewed batches 017-018; source-text SHA-256 ${parent.sourceTextSha256}.`,
      chunkLevel: 'parent', parentChunkId: null, childChunkIds: childIds, precedingChunkId: ids[parentIdIndex - 1] ?? null, followingChunkId: ids[parentIdIndex + 1] ?? null, structuralLocator: `VM-30 / ${parent.title}`, chunkingMethod: 'hierarchical_structure', localTopics: titleKeywords(parent.title), provisionTypes: parentTypes, provisionTypeBasis: 'source_text_pattern_only', structuralBreadcrumb: `VM-30 > ${parent.title}`, boundaryQuality: { status: 'source_structural_parent', startsAtBoundary: true, note: 'Parent begins at an explicit source subsection or intentional closing-boundary page.' }, crossReferenceCandidates: parentReferences, metadataDerivation: 'generated_from_source_text_without_source_text_rewrite', retrievalEligible: false, retrievalRole: 'context_only_parent', promotionEligible: false,
    })
    for (const child of parent.children) {
      const childId = `vm30-${parent.id}-${child.id}`
      const childIdIndex = ids.indexOf(childId)
      const types = boundaryOnly ? ['boundary_control'] : deriveProvisionTypes(child.text, child.title, parent.id, child.id)
      const references = deriveVm30CrossReferences(child.text)
      chunks.push({
        chunkId: childId, chunkOrdinal: ordinal++, chunkKind: boundaryOnly ? 'boundary_slice' : 'source_excerpt', sourceTextType: 'actual_extracted_source_text', pageStart: child.pages.start, pageEnd: child.pages.end, sectionReference: child.title, sourceTextExcerpt: child.text, normalizedTextExcerpt: normalize(child.text).toLowerCase(),
        summary: boundaryOnly ? 'Intentional VM-30 blank page retained as chapter-boundary evidence.' : `VM-30 source provision for ${child.title}; the exact retained excerpt controls over generated classifications.`, topic: `${parent.title} > ${child.title}`, headingPath: `VM-30 > ${parent.title} > ${child.title}`, keyPoints: [boundaryOnly ? 'Boundary control only; no substantive requirement is inferred.' : `Complete numbered source unit for ${child.title}.`], concepts: types, definedTerms: sourceDefinedTermsByChildId.get(child.id) ?? [], preserveEmptyDefinedTerms: true, acronyms: extractAcronyms(child.text), requirements: boundaryOnly || types.includes('definition_or_terminology') ? [] : types,
        controlledTags: unique(['vm30_current_manual', 'hierarchical_child', 'review_only', ...types]), keywords: unique(['VM-30', parent.title, child.title, ...references, ...titleKeywords(child.title)]), citations: [{ citationText: child.title, pageReference: pageCitation(child.pages), sectionReference: child.title, sourceReference: source.sourceReference, lineReference: null }], fidelity: 'exact', confidence: 'high', reviewFlags: unique(['review_only', 'hierarchical_child', 'requires_independent_review', ...(types.includes('guidance_note_present') ? ['guidance_note_present'] : [])]), qualityNotes: ['Child retains one complete numbered VM-30 provision, including nested items, prescribed wording, associated guidance notes, and tables.', 'Generated semantic classifications remain subordinate to exact source evidence.'], evidenceNotes: `Exact source segment from reviewed batches 017-018; source-text SHA-256 ${child.sourceTextSha256}.`,
        chunkLevel: 'child', parentChunkId: parentId, childChunkIds: [], precedingChunkId: ids[childIdIndex - 1] ?? null, followingChunkId: ids[childIdIndex + 1] ?? null, structuralLocator: `VM-30 / ${parent.title} / ${child.title}`, chunkingMethod: 'semantic_boundary', localTopics: titleKeywords(child.title), provisionTypes: types, provisionTypeBasis: 'source_text_pattern_only', structuralBreadcrumb: `VM-30 > ${parent.title} > ${child.title}`, boundaryQuality: { status: boundaryOnly ? 'intentional_blank_boundary' : 'numbered_boundary', startsAtBoundary: true, note: 'Child is a complete source-numbered provision or explicit boundary-control unit.' }, crossReferenceCandidates: references, metadataDerivation: 'generated_from_source_text_without_source_text_rewrite', retrievalEligible: !boundaryOnly, retrievalRole: boundaryOnly ? 'context_only_boundary' : 'first_stage_retrieval', promotionEligible: false,
      })
    }
  }
  if (chunks.length !== VM30_CHUNK_COUNT) throw new Error(`Expected ${VM30_CHUNK_COUNT} VM-30 chunks; found ${chunks.length}.`)
  return chunks
}

export const getVm30StructureSpecs = () => structuredClone(parentSpecs)
export const hashVm30SourceText = sha256
