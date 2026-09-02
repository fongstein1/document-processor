import { assignStructuredEvidenceIds, deduplicateStructuredEvidenceCandidates, validateStructuredEvidenceIdentity } from './lib/structured-evidence-identity.mjs'

const assert = (condition, message) => { if (!condition) throw new Error(message) }
const base = { sourceChunkId: 'chunk-a', sourceSection: 'Section A', pageStart: 1, pageEnd: 2, evidenceType: 'table_or_formula', label: 'Mortality Table' }

const equivalent = deduplicateStructuredEvidenceCandidates([base, { ...base, label: 'mortality-table' }])
assert(equivalent.length === 1, 'Equivalent normalized labels were not deduplicated.')
const distinct = assignStructuredEvidenceIds([base, { ...base, pageStart: 3, pageEnd: 4 }])
assert(distinct.length === 2 && new Set(distinct.map((record) => record.structuredEvidenceId)).size === 2, 'Distinct source locators did not receive distinct stable IDs.')
const duplicateCheck = validateStructuredEvidenceIdentity([{ ...base, structuredEvidenceId: 'same-id' }, { ...base, label: 'mortality-table', structuredEvidenceId: 'same-id' }])
assert(duplicateCheck.status === 'fail' && duplicateCheck.errors.some((error) => /not unique/.test(error)), 'Duplicate evidence identity was silently accepted.')
const semanticDuplicateCheck = validateStructuredEvidenceIdentity([{ ...base, structuredEvidenceId: 'id-one' }, { ...base, label: 'mortality-table', structuredEvidenceId: 'id-two' }])
assert(semanticDuplicateCheck.status === 'fail' && semanticDuplicateCheck.errors.some((error) => /semantic identities/.test(error)), 'Duplicate semantic evidence was hidden behind distinct generated IDs.')
console.log('Structured-evidence identity regression passed: normalized equivalents deduplicate, distinct locators separate, and collisions fail closed.')
