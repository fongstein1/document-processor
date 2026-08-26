# Corpus Completeness Report

As of 2026-08-26T00:00:00.000Z, the repository contains a substantial regulatory evidence base with one scope-specific canonical promotion, but it is not production-complete and is not Copilot-export ready.

## Counts

- Source documents inventoried: **105**
- Documents with declared external raw source: **71**
- Documents reviewed / review artifacts matched: **97 review indexes**
- Canonical source packages: **21**
- Canonical chunks: **359**
- Promoted canonical packages: **6**
- Promoted canonical chunks: **149**
- Review-only structured logical tables / versions: **7 / 29**
- Structured rows / values: **891 / 7022**
- Sources awaiting canonicalization: **96**
- Sources awaiting human review: **1**
- Review-artifact-only sources: **34**
- Candidate relationships: **23**
- Promoted relationships: **0**

## VM-20 coverage checkpoint

- Current-manual VM-20 coverage: 149 exact-text chunks; all 149 chunks in the six listed current-manual prose packages are canonically promoted.
- VM-20 companion coverage: 175 exact-text chunks from the reviewed 2020 practice-note wave remain separately labeled non-binding, historical, review-only, and unpromoted.
- Appendix 2 structured-table proof of concept: 7 logical tables, 29 versions, 891 rows, and 7022 exact source-cell values; status not_promoted.
- Prose promotion decision: `data/manual-input/promotion-decisions/vm20-2026-prose-promotion.json`.
- Structured-table review package: `data/processed/review_packages/vm20-appendix2-structured-table-review-package.md`.
- Remaining VM-20 table gap: current Tables B, C, D, E1, and E2 were not available on the official current-data page and were not inferred.

## Interpretation

- “Canonical promoted” applies only where an explicit promotion decision names the source package.
- Structured table data remains separate from prose and review-only until its own promotion decision.
- A canonical package can still be review-only when it is outside an approved promotion scope.
- “Reviewed” means a tracked review index or self-review exists; it does not prove that all source text was canonicalized.
- Source-text fidelity is explicit at package/chunk level; summary-only or review-derived material must not be labeled verbatim source text.

## Copilot handoff posture

- Export eligibility is false for every inventory record, including the promoted VM-20 prose scope and the table proof of concept.
- Canonical promotion does not itself authorize learner, app, RAG, or Copilot use.
- Copilot should consume a separately approved generated export from the canonical corpus, never become the canonical source.

