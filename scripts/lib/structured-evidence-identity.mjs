import crypto from 'node:crypto'

const hash = (value) => crypto.createHash('sha256').update(String(value), 'utf8').digest('hex')

// Identity normalization only; display labels and source excerpts remain exact.
export const normalizeStructuredEvidenceIdentity = (value) => String(value ?? '')
  .normalize('NFKC')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ')

const locatorPart = (record) => {
  const locator = record.sourceLocator ?? {}
  return [
    record.sourceChunkId ?? locator.chunkId,
    record.sourceSection ?? locator.sectionReference,
    record.pageStart ?? locator.pageStart,
    record.pageEnd ?? locator.pageEnd,
  ].map(normalizeStructuredEvidenceIdentity).join('|')
}

export const structuredEvidenceSemanticKey = (record) => [
  locatorPart(record),
  normalizeStructuredEvidenceIdentity(record.label),
  normalizeStructuredEvidenceIdentity(record.evidenceType),
].join('|')

export const deduplicateStructuredEvidenceCandidates = (candidates) => {
  const seen = new Set()
  return candidates.filter((candidate) => {
    const key = structuredEvidenceSemanticKey(candidate)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const slug = (value) => normalizeStructuredEvidenceIdentity(value).replace(/\s+/g, '-')

// Readable IDs cover the common case. A deterministic semantic-key hash
// separates genuinely distinct same-label structures instead of colliding.
export const assignStructuredEvidenceIds = (candidates) => {
  const deduplicated = deduplicateStructuredEvidenceCandidates(candidates)
  const groups = new Map()
  for (const candidate of deduplicated) {
    const base = `${slug(candidate.sourceChunkId ?? candidate.sourceLocator?.chunkId)}-${slug(candidate.label)}`
    const group = groups.get(base) ?? []
    group.push(candidate)
    groups.set(base, group)
  }
  return deduplicated.map((candidate) => {
    const base = `${slug(candidate.sourceChunkId ?? candidate.sourceLocator?.chunkId)}-${slug(candidate.label)}`
    const group = groups.get(base)
    const suffix = group.length > 1 ? `-${hash(structuredEvidenceSemanticKey(candidate)).slice(0, 10)}` : ''
    const { structuredEvidenceId: _previousId, ...record } = candidate
    return { structuredEvidenceId: `${base}${suffix}`, ...record }
  })
}

export const validateStructuredEvidenceIdentity = (records) => {
  const errors = []
  const ids = records.map((record) => record.structuredEvidenceId)
  const idSet = new Set(ids)
  if (ids.some((id) => !id)) errors.push('A structured-evidence record is missing structuredEvidenceId.')
  if (idSet.size !== ids.length) errors.push('structuredEvidenceId values are not unique.')
  const keys = records.map(structuredEvidenceSemanticKey)
  const keySet = new Set(keys)
  if (keySet.size !== keys.length) errors.push('Normalized structured-evidence semantic identities are not unique.')
  return {
    checkId: 'structured_evidence_identity',
    status: errors.length === 0 ? 'pass' : 'fail',
    errors,
    metrics: { recordCount: records.length, uniqueIdCount: idSet.size, uniqueSemanticIdentityCount: keySet.size },
  }
}
