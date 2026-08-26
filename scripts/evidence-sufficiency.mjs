const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
const normalizeTerm = (value) => normalize(value).replace(/[^a-z0-9]+/g, ' ').trim()

const unique = (values) => [...new Set(values.filter(Boolean))]

const extractRequestedJurisdiction = (query) => {
  const value = String(query ?? '').toLowerCase()
  const knownJurisdictions = ['new york', 'california', 'texas', 'florida', 'illinois', 'ontario', 'canada', 'united states', 'naic']
  return knownJurisdictions.find((jurisdiction) => value.includes(jurisdiction)) ?? null
}

const inferInformationTypes = (query) => {
  const value = String(query?.query ?? query ?? '').toLowerCase()
  const explicit = query?.supportRequirements?.informationTypes ?? query?.requestedInformationTypes
  if (Array.isArray(explicit) && explicit.length > 0) return explicit
  const types = []
  if (/\b(table|tables|rows|row values|exact values|numerical values|numeric values|thresholds|percentages)\b/.test(value)) types.push('structured_table_rows')
  if (/\b(current version|version metadata|edition|effective date|publication date|as of)\b/.test(value)) types.push('current_version_metadata')
  if (/\b(jurisdiction|state-specific|state specific|provincial|jurisdiction-specific|jurisdiction specific)\b/.test(value)) types.push('jurisdiction_specific_requirement')
  if (/\b(product-specific|product specific|product type|policy form|indexed universal|variable annuity|product assumption)\b/.test(value)) types.push('product_specific_detail')
  if (/\b(vm\s*-?\s*01|formal)\b.*\b(defin(?:e|es|ed|ition))\b|\b(defin(?:e|es|ed|ition))\b.*\bvm\s*-?\s*01\b/.test(value)) types.push('formal_definition')
  return types.length > 0 ? types : ['general_prose']
}

const hasStructuredEvidence = (chunks, sourcePackages) => {
  if (chunks.some((chunk) => ['structured_table', 'table_row', 'structured_data'].includes(chunk.chunkKind))) return true
  return sourcePackages.some((source) => source.coverageDeclarations?.structuredDataAvailable === true)
}

const packageGapText = (sourcePackages) => sourcePackages.flatMap((source) => [
  ...(source.coverageDeclarations?.knownGaps ?? []),
  ...(source.coverageDeclarations?.deferredInformationTypes ?? []),
  source.notes,
]).filter(Boolean).join(' ')

const requestedJurisdictionSupported = (requestedJurisdiction, sourcePackages) => {
  if (!requestedJurisdiction) return true
  return sourcePackages.some((source) => normalize(source.jurisdiction) === requestedJurisdiction)
}

const currentVersionSupported = (sourcePackages) => sourcePackages.some((source) =>
  source.sourceStatus === 'active' && Boolean(source.sourceEditionId || source.sourceVersionIdentifier || source.versionDate),
)

const productDetailSupported = (sourcePackages, chunks) => sourcePackages.some((source) =>
  Array.isArray(source.coverageDeclarations?.productScopes) && source.coverageDeclarations.productScopes.length > 0,
) || chunks.some((chunk) => Array.isArray(chunk.productScopes) && chunk.productScopes.length > 0)

const evidenceAlignment = (query, topMatches, chunkLookup) => {
  const queryTokens = new Set(normalize(query.query ?? query).replace(/[^a-z0-9]+/g, ' ').split(/\s+/).filter(Boolean))
  const alignments = topMatches.map((match) => {
    const chunk = chunkLookup.get(match.chunkId)
    const evidenceTokens = new Set(normalize([chunk?.topic, chunk?.sectionReference, chunk?.summary, chunk?.sourceTextExcerpt].join(' ')).replace(/[^a-z0-9]+/g, ' ').split(/\s+/).filter(Boolean))
    const overlap = [...queryTokens].filter((token) => evidenceTokens.has(token)).length
    return { chunkId: match.chunkId, score: match.score, tokenOverlap: overlap }
  })
  return { topScore: topMatches[0]?.score ?? 0, matches: alignments }
}

export const assessEvidenceSufficiency = ({ query, topMatches, chunkRecords, sourcePackages, unsupportedThreshold = 3 }) => {
  const chunkLookup = new Map(chunkRecords.map((chunk) => [chunk.chunkId, chunk]))
  const retrievedChunks = topMatches.map((match) => chunkLookup.get(match.chunkId)).filter(Boolean)
  const retrievedSourceIds = unique(retrievedChunks.map((chunk) => chunk.sourceId))
  const retrievedPackages = sourcePackages.filter((source) => retrievedSourceIds.includes(source.sourceId))
  const informationTypes = inferInformationTypes(query)
  const requestedJurisdiction = query.supportRequirements?.jurisdiction ?? query.requestedJurisdiction ?? extractRequestedJurisdiction(query.query)
  const gapText = packageGapText(retrievedPackages)
  const alignment = evidenceAlignment(query, topMatches, chunkLookup)
  const relatedEvidence = topMatches.slice(0, 3).map((match) => ({
    chunkId: match.chunkId,
    sourceId: match.sourceId,
    score: match.score,
    authorityLevel: match.authorityLevel,
  }))
  const structuredEvidence = hasStructuredEvidence(retrievedChunks, retrievedPackages)
  const requestedDefinedTerm = query.supportRequirements?.definedTerm ?? query.requestedDefinedTerm ?? null
  const requestedSourceVersion = query.supportRequirements?.sourceVersionIdentifier ?? null
  const normalizedRequestedTerm = normalizeTerm(requestedDefinedTerm)
  const formalDefinitionEvidence = normalizedRequestedTerm
    ? retrievedChunks.find((chunk) => chunk.sourceId === 'vm01-definitions' && (chunk.definedTerms ?? []).some((term) => normalizeTerm(term) === normalizedRequestedTerm))
    : retrievedChunks.find((chunk) => chunk.sourceId === 'vm01-definitions' && chunk.chunkKind === 'definition')
  const reasons = []

  if (informationTypes.includes('structured_table_rows') && !structuredEvidence) {
    reasons.push({ code: 'missing_structured_data', text: 'The retrieved evidence is prose or methodology text, not structured table rows or equivalent structured data.' })
  }
  if (informationTypes.includes('current_version_metadata') && !currentVersionSupported(retrievedPackages)) {
    reasons.push({ code: 'missing_current_version_metadata', text: 'The retrieved source package does not provide an active source edition/version record sufficient for the requested current metadata.' })
  }
  if (informationTypes.includes('jurisdiction_specific_requirement') && !requestedJurisdictionSupported(requestedJurisdiction, retrievedPackages)) {
    reasons.push({ code: 'missing_requested_jurisdiction', text: `The requested jurisdiction (${requestedJurisdiction ?? 'unspecified'}) is not represented by the retrieved source packages.` })
  }
  if (informationTypes.includes('product_specific_detail') && !productDetailSupported(retrievedPackages, retrievedChunks)) {
    reasons.push({ code: 'missing_product_specific_scope', text: 'The retrieved evidence is general guidance and does not declare coverage for the requested product-specific detail.' })
  }
  if (informationTypes.includes('formal_definition') && !formalDefinitionEvidence) {
    reasons.push({ code: 'term_not_defined_in_vm01', text: `VM-01 does not contain an exact formal definition for the requested term${requestedDefinedTerm ? ` (${requestedDefinedTerm})` : ''} in the retrieved current definition corpus.` })
  }
  if (requestedSourceVersion && !retrievedPackages.some((source) => normalize(source.sourceVersionIdentifier) === normalize(requestedSourceVersion))) {
    reasons.push({ code: 'missing_requested_source_version', text: `The requested source version (${requestedSourceVersion}) is not represented by the retrieved source packages.` })
  }

  const explicitGap = informationTypes.some((type) => {
    if (type === 'structured_table_rows') return /structured|table|row|version metadata|current prescribed/i.test(gapText)
    if (type === 'current_version_metadata') return /version metadata|version|edition|current/i.test(gapText)
    if (type === 'jurisdiction_specific_requirement') return /jurisdiction|state|provincial/i.test(gapText)
    if (type === 'product_specific_detail') return /product|scope|general guidance/i.test(gapText)
    if (type === 'formal_definition') return /definition|defined|section-local/i.test(gapText)
    return false
  })

  if (reasons.length > 0 && (explicitGap || informationTypes.some((type) => type !== 'general_prose'))) {
    const reasonText = reasons.map((reason) => reason.text).join(' ')
    return {
      supportState: 'unsupported',
      evidenceSufficient: false,
      reasonCode: reasons[0].code,
      reason: reasonText,
      requestedInformationTypes: informationTypes,
      relatedEvidence,
      corpusGap: gapText || reasonText,
      structuredEvidenceAvailable: structuredEvidence,
      semanticAlignment: alignment,
      lowScore: alignment.topScore < unsupportedThreshold,
    }
  }

  if (topMatches.length === 0 || alignment.topScore < unsupportedThreshold) {
    return {
      supportState: 'ambiguous_requires_more_context',
      evidenceSufficient: false,
      reasonCode: 'weak_or_missing_retrieval_evidence',
      reason: 'The available ranked evidence is too weak to support a reliable answer.',
      requestedInformationTypes: informationTypes,
      relatedEvidence,
      corpusGap: gapText || 'No sufficiently aligned evidence was retrieved.',
      structuredEvidenceAvailable: structuredEvidence,
      semanticAlignment: alignment,
      lowScore: true,
    }
  }

  return {
    supportState: 'supported',
    evidenceSufficient: true,
    reasonCode: 'retrieved_evidence_matches_requested_information_type',
    reason: 'Retrieved evidence is sufficiently aligned for the requested information type under the current corpus declarations.',
    requestedInformationTypes: informationTypes,
    relatedEvidence,
    corpusGap: null,
    structuredEvidenceAvailable: structuredEvidence,
    semanticAlignment: alignment,
    lowScore: false,
  }
}

export const inferSupportInformationTypes = inferInformationTypes
