const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
const normalizeTerm = (value) => normalize(value).replace(/[^a-z0-9]+/g, ' ').trim()
const unique = (values) => [...new Set(values.filter(Boolean))]

const inferRequestedSourceIds = (query, sourcePackages) => {
  const explicit = query.supportRequirements?.requiredSourceIds ?? []
  if (explicit.length > 0) return explicit
  const sectionMatch = String(query.query ?? '').match(/\bVM\s*-?\s*(\d{1,2}|[GMC])\b/i)
  if (!sectionMatch) return []
  const sectionKey = `vm${sectionMatch[1].toLowerCase()}`
  return sourcePackages
    .filter((source) => normalizeTerm([source.sourceId, source.sourceTitle].join(' ')).includes(sectionKey))
    .map((source) => source.sourceId)
}

export const assessFormalRequirementEvidenceSufficiency = ({ query, topMatches, chunkRecords, sourcePackages, unsupportedThreshold = 3 }) => {
  const chunkLookup = new Map(chunkRecords.map((chunk) => [chunk.chunkId, chunk]))
  const evidenceMatches = topMatches.slice(0, 3)
  const evidenceChunks = evidenceMatches.map((match) => chunkLookup.get(match.chunkId)).filter(Boolean)
  const requiredSourceIds = inferRequestedSourceIds(query, sourcePackages)
  const requiredEvidenceTerms = query.supportRequirements?.requiredEvidenceTerms ?? []
  const requestedSourceVersion = query.supportRequirements?.sourceVersionIdentifier ?? null
  const formalEvidence = evidenceChunks.filter((chunk) =>
    chunk.sourceTextType === 'actual_extracted_source_text' &&
    (requiredSourceIds.length === 0 || requiredSourceIds.includes(chunk.sourceId)),
  )
  const formalEvidenceText = normalizeTerm(formalEvidence.map((chunk) => [
    chunk.sourceTextExcerpt,
    chunk.sectionReference,
    chunk.headingPath,
    chunk.topic,
  ].join(' ')).join(' '))
  const missingTerms = requiredEvidenceTerms.filter((term) => !formalEvidenceText.includes(normalizeTerm(term)))
  const retrievedSourceIds = unique(formalEvidence.map((chunk) => chunk.sourceId))
  const retrievedPackages = sourcePackages.filter((source) => retrievedSourceIds.includes(source.sourceId))
  const relatedEvidence = evidenceMatches.map((match) => ({
    chunkId: match.chunkId,
    sourceId: match.sourceId,
    score: match.score,
    authorityLevel: match.authorityLevel,
  }))
  const semanticAlignment = {
    topScore: evidenceMatches[0]?.score ?? 0,
    matches: evidenceMatches.map((match) => ({ chunkId: match.chunkId, score: match.score })),
  }

  let reasonCode = null
  let reason = null
  if (formalEvidence.length === 0) {
    reasonCode = 'missing_requested_formal_requirement_source'
    reason = `The production evidence window does not contain actual source text from the requested formal requirement source${requiredSourceIds.length ? ` (${requiredSourceIds.join(', ')})` : ''}. Related methodology or companion evidence cannot substitute for it.`
  } else if (missingTerms.length > 0) {
    reasonCode = 'missing_required_requirement_terms'
    reason = `The retrieved formal-source evidence does not contain the required topic term(s): ${missingTerms.join(', ')}.`
  } else if (requestedSourceVersion && !retrievedPackages.some((source) => normalize(source.sourceVersionIdentifier) === normalize(requestedSourceVersion))) {
    reasonCode = 'missing_requested_source_version'
    reason = `The requested source version (${requestedSourceVersion}) is not represented by the retrieved formal-source evidence.`
  }

  if (reasonCode) return {
    supportState: 'unsupported',
    evidenceSufficient: false,
    reasonCode,
    reason,
    requestedInformationTypes: ['formal_requirement'],
    relatedEvidence,
    corpusGap: reason,
    structuredEvidenceAvailable: false,
    semanticAlignment,
    lowScore: semanticAlignment.topScore < unsupportedThreshold,
  }

  if (evidenceMatches.length === 0 || semanticAlignment.topScore < unsupportedThreshold) return {
    supportState: 'ambiguous_requires_more_context',
    evidenceSufficient: false,
    reasonCode: 'weak_or_missing_retrieval_evidence',
    reason: 'The available ranked evidence is too weak to support a reliable formal-requirement answer.',
    requestedInformationTypes: ['formal_requirement'],
    relatedEvidence,
    corpusGap: 'No sufficiently aligned formal-source evidence was retrieved.',
    structuredEvidenceAvailable: false,
    semanticAlignment,
    lowScore: true,
  }

  return {
    supportState: 'supported',
    evidenceSufficient: true,
    reasonCode: 'retrieved_evidence_matches_requested_information_type',
    reason: 'Actual source text from the requested formal requirement source is present inside the production evidence window.',
    requestedInformationTypes: ['formal_requirement'],
    relatedEvidence,
    corpusGap: null,
    structuredEvidenceAvailable: false,
    semanticAlignment,
    lowScore: false,
  }
}
