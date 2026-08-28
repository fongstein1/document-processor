# Narrow independent review prompt: VM-31 promotion-blocker corrections

Please independently review only the two targeted metadata corrections applied to the current 2026 VM-31 canonical review candidate in the Document Processor repository. Do not modify or promote the corpus, and do not repeat the accepted 84-chunk source audit unless authoritative source evidence changed.

## Primary files

- Canonical source package: `data/processed/source_indexes/sources/vm31-current-manual.json`
- Review package: `data/processed/review_packages/vm31-canonical-coverage-review-package.json`
- Focused retrieval evaluation: `data/processed/review_packages/vm31-focused-retrieval-evaluation.json`
- Source QA: `data/processed/review_packages/vm31-source-qa.json`
- Relationship registry: `data/processed/relationship_registries/vm31-current-manual-relationship-candidates.json`
- Support-gate regression: `data/processed/review_packages/vm31-support-gate-regression.json`
- Validation report: `data/processed/review_packages/vm31-validation-report.json`

## Review scope

1. Inspect `vm31-section-1-purpose` and `vm31-section-1-purpose-purpose`. Confirm both are classified as purpose/scope/reporting-framework context, retain legitimate VM-20/VM-21/VM-22 cross-references, and no longer claim to be documentation requirements, operative reporting requirements, or applicability exceptions.
2. Inspect `vm31-section-3-b-executive-summary-5-high-level-results-references-ag-43` and `vm31-section-3-f-annuity-report-16-additional-information-references-ag-43`. Confirm `targetLabel` preserves the explicit source wording `AG 43`, `targetId` remains `ag-43`, and `canonicalTargetLabel` separately records `Actuarial Guideline XLIII`.
3. Confirm the relationship validator checks all 92 explicit-source labels against retained source text using only transparent case/punctuation/spacing normalization.
4. Confirm source evidence is unchanged: 9 parents, 75 children, 84 total chunks, identical source excerpts/hashes/pages/IDs/hierarchy/order, and zero source-text rewrites.
5. Confirm retrieval remains 15/18 supported top-1, 18/18 strict top-3, 2/2 unsupported abstentions, 1/1 ambiguity safety, and 18/18 current-authority top-1, with the VM-20 substitution gate still passing.
6. Confirm VM-31 remains review-only, not promoted, promotion-ineligible, and blocked from learner, app, RAG, vector, and Copilot use.
7. Decide whether these two metadata blockers are closed and VM-31 is ready for a separately recorded canonical-promotion decision.

Report findings with severity, exact chunk/query/relationship IDs, and source-page references. End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE

Do not repeat the completed VM-01, VM-20, or full VM-31 source audits unless this correction pass changed authoritative source evidence.
