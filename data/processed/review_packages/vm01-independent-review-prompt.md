# Independent review prompt: 2026 VM-01 Canonical Promotion (Blockers Closed)

Please independently review the targeted fixes applied to close the two VM-01 canonical promotion blockers in the Document Processor repository. Do not rely on prior chat conclusions. Treat the authoritative 2026 Valuation Manual PDF as the source of truth and the review package as non-authoritative metadata.

Prior independent review disposition was: **APPROVE WITH FIXES** (all 98 definition boundaries, source text, 27 aliases, 11 spacing corrections, and 29 relationships passed; no re-extraction or broad canonicalization change requested).

## Files

- Canonical VM-01 package: `data/processed/source_indexes/sources/vm01-definitions.json`
- Definition lookup index: `data/processed/source_indexes/definitions/vm01-definition-index.json`
- Focused retrieval evaluation: `data/processed/review_packages/vm01-definition-retrieval-evaluation.json`
- Review package: `data/processed/review_packages/vm01-canonical-definitions-review-package.json`
- Source QA: `data/processed/review_packages/vm01-definitions-source-qa.json`
- Relationship candidates: `data/processed/relationship_registries/vm01-definition-relationship-candidates.json`
- Validation report: `data/processed/review_packages/vm01-definitions-validation-report.json`
- PDF hash confirmation: `data/processed/review_packages/vm01-source-pdf-hash-confirmation.json`
- Reviewed extraction: `data/work/batches/batch-013/extraction-output.json`
- Source manifest: `data/work/batches/batch-013/batch-manifest.json`

## Verification scope

1. **Keep definedTerms source-explicit (Blocker 1 Closed)**:
   - Verify that `chunk.definedTerms` in `vm01-definitions.json` contains strictly the exact formal VM-01 defined term and source-explicit aliases (125 total entries across 98 chunks: 98 formal terms + 27 explicit aliases).
   - Verify that generated normalized variants (such as `asset associated derivative`, `cash flow model`, `guaranteed investment contract`, `guaranteed issue life insurance policy`, `indexed universal life insurance policy`) are removed from `definedTerms` and reside only in non-authoritative lookup metadata (`keywords` and `vm01-definition-index.json`).
   - Verify 0 authoritative source-text changes (`sourceTextExcerpt`, `formalDefinitionSourceText`, hashes, and pages remain identical).
2. **Focused retrieval evaluation JSON preserved and inspectable (Blocker 2 Closed)**:
   - Verify that the actual focused retrieval evaluation JSON is present and reviewable at `data/processed/review_packages/vm01-definition-retrieval-evaluation.json`.
   - Inspect individual query cases: exact terms, acronyms, plain language, conditions/exceptions, incorporated terms, cross-references, cross-document terms, undefined terms, ambiguous terms, and version/authority.
   - Confirm that undefined-term queries (`deterministic exclusion test`, `reserve`, `proposed 2027 VM-01`) safely abstain without making false formal-definition claims.
   - Confirm current authoritative 2026 VM-01 evidence is ranked first (13/13 supported queries).
3. **Governance and Readiness**:
   - Verify all 98 definitions, 98 canonical IDs, 27 aliases, 11 text-layer spacing corrections, and 29 relationship candidates remain intact.
   - Verify governance remains review-only / not promoted pending final independent approval.

## Output

Report findings with severity, exact file/chunk/definition IDs, and page citations if any. End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE

Do not modify the corpus or promote it during the review.
