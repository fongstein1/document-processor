# Narrow independent review prompt: remaining 2026 VM-30 promotion blockers

Please perform a narrow independent review of the corrected current 2026 VM-30 canonical candidate in the Document Processor repository. Compare the correction with baseline commit `b36a1c7`. Do not repeat the accepted source, hierarchy, table, definition-identity, relationship, or boundary audits unless authoritative evidence changed.

## Primary files

- Canonical source package: `data/processed/source_indexes/sources/vm30-current-manual.json`
- Review package: `data/processed/review_packages/vm30-canonical-coverage-review-package.json`
- Focused retrieval evaluation: `data/processed/review_packages/vm30-focused-retrieval-evaluation.json`
- Source QA: `data/processed/review_packages/vm30-source-qa.json`
- Relationship registry: `data/processed/relationship_registries/vm30-current-manual-relationship-candidates.json`
- Support-gate regression: `data/processed/review_packages/vm30-support-gate-regression.json`
- Validation report: `data/processed/review_packages/vm30-validation-report.json`

## Review scope

1. Confirm the correction is actually present relative to `b36a1c7`.
2. Confirm `vm30-section-1-a-general-1-aom-requirement-scope` no longer carries documentation, timing/submission, or supporting-exhibit classifications and retains only supported scope, AOM framework, and cross-reference metadata.
3. Confirm `vm30-section-1-a-general-5-company-level-opinion` represents company scope plus the single-company actuarial-opinion requirement, without generic documentation or timing metadata.
4. Confirm the adverse, qualified, and inconclusive opinion chunks remain formal definitions with empty `requirements` arrays and narrow definition-oriented classifications; directly stated consequences may remain conservative metadata.
5. Confirm all 51 source excerpts, source-text SHA values, pages, citations, IDs, hierarchy, adjacency, tables, definition terms, and the authoritative PDF identity are unchanged; expected authoritative source-text changes: 0.
6. Confirm the first support-gate fixture uses actual `vm20-canonical-coverage` evidence and no VM-31 substitute fixture.
7. Confirm the rank-four case visibly includes the correct VM-30 evidence at rank 4 in `fullRanking`, while `productionWindowEvidence` contains only ranks 1-3.
8. Confirm all 4 support cases expose explicit expected and actual decisions, evidence sufficiency, reason codes, failure messages, and per-case `passed: true`; confirm the implementation exercises the generic support gate rather than query-ID hard-coding.
9. Confirm focused retrieval remains 15/16 top-1, 16/16 strict top-3, 4/4 unsupported, 1/1 ambiguity-safe, and 16/16 current-authority top-1.
10. Confirm VM-30 remains review-only, not promoted, promotion-ineligible, and blocked from learner, app, RAG, vector, and Copilot use pending this decision.

Report findings with severity, exact chunk/query/relationship IDs, and source-page references. End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE

Do not ask for another broad VM-30 audit and do not repeat the completed VM-01, VM-20, or VM-31 source audits unless this correction changed their authoritative evidence.
