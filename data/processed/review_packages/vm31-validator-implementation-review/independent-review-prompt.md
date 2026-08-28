# Narrow code-review prompt: VM-31 validator implementation evidence

Please review only the VM-31 validator implementation-evidence package. Do not modify or promote the corpus and do not repeat the accepted source, retrieval, or metadata audits unless this evidence contradicts them.

## Files

- Manifest: `data/processed/review_packages/vm31-validator-implementation-review/manifest.json`
- Byte-exact snapshot: `data/processed/review_packages/vm31-validator-implementation-review/validate-vm31-current-manual.mjs`
- Focused regression artifact: `data/processed/review_packages/vm31-validator-implementation-review/relationship-label-normalization-regression.json`
- Focused regression source: `scripts/test-vm31-relationship-label-normalization.mjs`
- Evidence validator: `scripts/validate-vm31-validator-implementation-review.mjs`

## Review scope

1. Recalculate the live validator and snapshot byte lengths and SHA-256 values; confirm direct byte equality and manifest consistency.
2. Inspect `normalizeSourceLabel` and confirm it only lowercases and removes punctuation/spacing through non-alphanumeric removal.
3. Confirm the explicit-source assertion compares retained `sourceTextExcerpt` directly with source-facing `candidate.targetLabel`.
4. Confirm target IDs, canonical expanded labels, aliases, semantic similarity, fuzzy equivalence, acronym expansion, and curated synonyms cannot independently satisfy that assertion.
5. Confirm the generic regression passes `AG 43` against source `AG 43`, rejects `Actuarial Guideline XLIII` against source containing only `AG 43`, and permits a separate canonical label without using it as match evidence.
6. Confirm the current 92/92 relationship-label validation still passes and the evidence package changed zero VM-31 canonical artifacts.
7. Confirm VM-31 remains review-only and unpromoted.

End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE
