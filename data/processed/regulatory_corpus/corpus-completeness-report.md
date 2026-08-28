# Corpus Completeness Report

As of 2026-08-28T00:00:00.000Z, the repository contains substantial regulatory evidence with separately recorded VM-01 definitions, VM-20 prose, VM-20 structured-table, VM-30, and VM-31 canonical promotions, but it is not production-complete and is not Copilot-export ready.

## Counts

- Source documents inventoried: **105**
- Documents with declared external raw source: **71**
- Documents reviewed / review artifacts matched: **97 review indexes**
- Canonical source packages: **24**
- Canonical chunks: **592**
- Promoted canonical prose packages / chunks: **9 / 382**
- Promoted structured logical tables / versions: **7 / 29**
- Structured rows / values: **891 / 7022**
- Sources awaiting canonicalization: **96**
- Sources awaiting human review: **1**
- Review-artifact-only sources: **34**
- Candidate relationships: **160**
- Promoted relationships: **0**

## VM-20 coverage checkpoint

- Current-manual VM-20 coverage: 149 exact-text chunks; all 149 chunks in the six listed current-manual prose packages are canonically promoted.
- VM-20 companion coverage: 175 exact-text chunks from the reviewed 2020 practice-note wave remain separately labeled non-binding, historical, review-only, and unpromoted.
- Appendix 2 structured tables: 7 logical tables, 29 versions, 891 rows, and 7022 exact source-cell values; status promoted.
- Prose promotion decision: `data/manual-input/promotion-decisions/vm20-2026-prose-promotion.json`.
- Structured-table promotion decision: `data/manual-input/promotion-decisions/vm20-appendix2-structured-table-promotion.json`.
- Structured-table review package: `data/processed/review_packages/vm20-appendix2-structured-table-review-package.md`.
- Remaining VM-20 table gap: current Tables B, C, D, E1, and E2 were not available on the official current-data page and were not inferred.

## VM-01 terminology checkpoint

- Current VM-01 definitions / retrieval units: 98 / 98.
- VM-01 promotion status: promoted; decision `data/manual-input/promotion-decisions/vm01-2026-definitions-promotion.json`.
- VM-01 explicit-reference candidates: 29; all remain pending and not promoted.
- Formal-definition requests for undefined or ambiguous terms abstain rather than substituting related evidence.
- Canonical `definedTerms` now contains only 98 formal terms plus 27 source-explicit aliases; 17 generated lookup variants remain confined to non-authoritative retrieval metadata.
- The focused case-level retrieval artifact contains 21 inspectable queries, including DR, SR, NPR, GIC, IUL, cross-page, ambiguous, undefined-term, and unavailable-version cases.

## VM-30 coverage checkpoint

- Current 2026 VM-30 structural parents / child units: 8 / 43; status promoted.
- VM-30 promotion decision: `data/manual-input/promotion-decisions/vm30-2026-current-manual-promotion.json`.
- VM-30 explicit-reference candidates: 16; all remain pending, review-only, and not promoted.
- Focused VM-30 retrieval contains 21 inspectable cases: 16 supported, four unsupported, and one ambiguous submission-context request, all evaluated within a strict top-three production evidence window.
- VM-30 source QA records the complete PDF-page 325-339 chapter boundary, page 340 separator, page 341 VM-31 opener, exact retained source text, and zero source-text rewrites.
- VM-30 remains blocked from learner, app, RAG, vector, and Copilot use pending separate downstream governance decisions.

## VM-31 coverage checkpoint

- Current 2026 VM-31 structural parents / child units: 9 / 75; status promoted.
- VM-31 promotion decision: `data/manual-input/promotion-decisions/vm31-2026-current-manual-promotion.json`.
- VM-31 explicit-reference candidates: 92; all remain pending, review-only, and not promoted.
- Focused VM-31 retrieval contains 21 inspectable cases covering report obligations, timing, retention, applicability, certifications, exhibits, exceptions, cross-references, unsupported substitutions, ambiguity, and current-authority preference.
- VM-31 remains blocked from learner, app, RAG, vector, and Copilot use pending separate downstream governance decisions.

## Interpretation

- “Canonical promoted” applies only where an explicit promotion decision names the source package or structured-table scope.
- Structured table data remains separate from prose even after its own canonical promotion.
- “Reviewed” means a tracked review artifact exists; it does not prove that all source text was canonicalized.
- Source fidelity remains explicit; summary-only or review-derived material must not be labeled source evidence.

## Copilot handoff posture

- Export eligibility is false for every inventory record, including both promoted VM-20 scopes.
- Canonical promotion does not itself authorize learner, app, RAG, or Copilot use.
- Copilot should consume a separately approved generated export from the canonical corpus, never become the canonical source.

