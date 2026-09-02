import crypto from 'node:crypto'

const sha256 = (value) => crypto.createHash('sha256').update(String(value), 'utf8').digest('hex')
const searchNormalize = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '')
const unique = (values) => [...new Set(values)]

export const validateCanonicalPackageStructure = ({ sourcePackage, expectedSourceId, expectedParentCount, expectedChildCount, expectedChunkCount, pageRange }) => {
  const errors = []
  const chunks = sourcePackage?.chunks ?? []
  const ids = chunks.map((chunk) => chunk.chunkId)
  const idSet = new Set(ids)
  const parents = chunks.filter((chunk) => chunk.chunkLevel === 'parent')
  const children = chunks.filter((chunk) => chunk.chunkLevel === 'child')
  if (sourcePackage?.source?.sourceId !== expectedSourceId) errors.push(`Expected sourceId ${expectedSourceId}.`)
  if (chunks.length !== expectedChunkCount) errors.push(`Expected ${expectedChunkCount} chunks; found ${chunks.length}.`)
  if (parents.length !== expectedParentCount) errors.push(`Expected ${expectedParentCount} parents; found ${parents.length}.`)
  if (children.length !== expectedChildCount) errors.push(`Expected ${expectedChildCount} children; found ${children.length}.`)
  if (idSet.size !== ids.length) errors.push('Chunk IDs are not unique.')
  for (const chunk of chunks) {
    if (!chunk.chunkId) errors.push('A chunk is missing chunkId.')
    if (!chunk.sourceTextExcerpt) errors.push(`${chunk.chunkId}: sourceTextExcerpt is empty.`)
    if (chunk.sourceTextSha256 !== sha256(chunk.sourceTextExcerpt)) errors.push(`${chunk.chunkId}: sourceTextSha256 mismatch.`)
    if (chunk.pageStart < pageRange.start || chunk.pageEnd > pageRange.end || chunk.pageStart > chunk.pageEnd) errors.push(`${chunk.chunkId}: invalid page range ${chunk.pageStart}-${chunk.pageEnd}.`)
    if (!Array.isArray(chunk.citations) || chunk.citations.length === 0) errors.push(`${chunk.chunkId}: citation is missing.`)
    for (const citation of chunk.citations ?? []) {
      if (!citation.pageReference || !citation.sectionReference || !citation.sourceReference) errors.push(`${chunk.chunkId}: citation locator is incomplete.`)
    }
    if (chunk.parentChunkId && !idSet.has(chunk.parentChunkId)) errors.push(`${chunk.chunkId}: missing parent ${chunk.parentChunkId}.`)
    for (const childId of chunk.childChunkIds ?? []) if (!idSet.has(childId)) errors.push(`${chunk.chunkId}: missing child ${childId}.`)
    if (chunk.precedingChunkId && !idSet.has(chunk.precedingChunkId)) errors.push(`${chunk.chunkId}: missing preceding chunk ${chunk.precedingChunkId}.`)
    if (chunk.followingChunkId && !idSet.has(chunk.followingChunkId)) errors.push(`${chunk.chunkId}: missing following chunk ${chunk.followingChunkId}.`)
  }
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index]
    if (chunk.precedingChunkId !== (chunks[index - 1]?.chunkId ?? null)) errors.push(`${chunk.chunkId}: preceding adjacency mismatch.`)
    if (chunk.followingChunkId !== (chunks[index + 1]?.chunkId ?? null)) errors.push(`${chunk.chunkId}: following adjacency mismatch.`)
  }
  for (const parent of parents) {
    if (parent.retrievalEligible !== false) errors.push(`${parent.chunkId}: structural parent must not participate in first-stage retrieval.`)
    const actualChildren = children.filter((child) => child.parentChunkId === parent.chunkId)
    if (actualChildren.length !== (parent.childChunkIds ?? []).length) errors.push(`${parent.chunkId}: parent/child count mismatch.`)
    for (const child of actualChildren) if (!searchNormalize(parent.sourceTextExcerpt).includes(searchNormalize(child.sourceTextExcerpt))) errors.push(`${child.chunkId}: child text is not contained in parent text.`)
  }
  return { checkId: 'canonical_package_structure', status: errors.length === 0 ? 'pass' : 'fail', errors, metrics: { chunkCount: chunks.length, parentCount: parents.length, childCount: children.length, uniqueChunkIdCount: idSet.size } }
}

export const validateSourceExplicitDefinedTerms = (sourcePackage) => {
  const errors = []
  let termCount = 0
  for (const chunk of sourcePackage?.chunks ?? []) {
    const source = searchNormalize(chunk.sourceTextExcerpt)
    for (const term of chunk.definedTerms ?? []) {
      termCount += 1
      if (!source.includes(searchNormalize(term))) errors.push(`${chunk.chunkId}: defined term is not source-explicit: ${term}.`)
    }
  }
  return { checkId: 'source_explicit_defined_terms', status: errors.length === 0 ? 'pass' : 'fail', errors, metrics: { termCount } }
}

export const validateDerivativeMetadataEvidence = (sourcePackage) => {
  const errors = []
  const checks = [
    ['timing_or_effective_date', /effective\s+date|valuation\s+date|within\s+\d+|annually|time\s+horizon/i],
    ['documentation_or_reporting_obligation', /document|report|record|retain/i],
    ['structured_table_evidence', /\btable(?:s)?\b|\bmatrix\b|\bfactor\s+grid\b|\blookup\b|\brow(?:s)?\b|\bcolumn(?:s)?\b|\bformula(?:s)?\b|\bcalculation(?:s)?\b/i],
    ['definition_or_terminology', /\bmeans\b|\bdefined\b|\bdefinition/i],
  ]
  let classifiedChunkCount = 0
  for (const chunk of sourcePackage?.chunks?.filter((candidate) => candidate.chunkLevel === 'child') ?? []) {
    const types = chunk.provisionTypes ?? []
    if (types.length > 0) classifiedChunkCount += 1
    for (const [type, pattern] of checks) if (types.includes(type) && !pattern.test(chunk.sourceTextExcerpt)) errors.push(`${chunk.chunkId}: ${type} lacks lexical source support.`)
    if (types.includes('definition_or_terminology') && (chunk.requirements ?? []).length > 0) errors.push(`${chunk.chunkId}: definition metadata inflates into freestanding requirements.`)
    for (const evidence of chunk.structuredEvidence ?? []) if (!searchNormalize(chunk.sourceTextExcerpt).includes(searchNormalize(evidence.label))) errors.push(`${chunk.chunkId}: structured evidence label is not source-bound: ${evidence.label}.`)
  }
  return { checkId: 'derivative_metadata_evidence', status: errors.length === 0 ? 'pass' : 'fail', errors: unique(errors), metrics: { classifiedChunkCount } }
}

export const validateReviewOnlyGovernance = (sourcePackage, { allowPromoted = false } = {}) => {
  const processing = sourcePackage?.processing ?? {}
  const errors = []
  if (allowPromoted) {
    if (processing.reviewOnly !== false) errors.push('Promoted processing.reviewOnly must be false.')
    if (processing.promotionStatus !== 'promoted') errors.push('Promoted processing.promotionStatus must be promoted.')
  } else {
    if (processing.reviewOnly !== true) errors.push('processing.reviewOnly must be true.')
    if (processing.promotionStatus !== 'not_promoted') errors.push('processing.promotionStatus must be not_promoted.')
  }
  if (processing.learnerFacingAllowed || processing.appReadyAllowed || processing.ragReadyAllowed) errors.push('Downstream eligibility must remain false.')
  if (allowPromoted) {
    if ((sourcePackage?.chunks ?? []).some((chunk) => chunk.promotionEligible !== true)) errors.push('Every promoted chunk must be promotion-eligible for canonical indexing.')
  } else if ((sourcePackage?.chunks ?? []).some((chunk) => chunk.promotionEligible !== false)) errors.push('Every chunk must remain promotion-ineligible.')
  return { checkId: 'review_only_governance', status: errors.length === 0 ? 'pass' : 'fail', errors }
}

export const validateCanonicalPackage = (options) => {
  const checks = [
    validateCanonicalPackageStructure(options),
    validateSourceExplicitDefinedTerms(options.sourcePackage),
    validateDerivativeMetadataEvidence(options.sourcePackage),
    validateReviewOnlyGovernance(options.sourcePackage, options),
  ]
  return { status: checks.every((check) => check.status === 'pass') ? 'pass' : 'fail', checks, errors: checks.flatMap((check) => check.errors) }
}
