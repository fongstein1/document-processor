# Corpus Completeness Report

As of 2026-08-26T00:00:00.000Z, the repository contains substantial regulatory evidence with separately recorded VM-20 prose and structured-table canonical promotions, but it is not production-complete and is not Copilot-export ready.

## Counts

- Source documents inventoried: **105**
- Documents with declared external raw source: **71**
- Documents reviewed / review artifacts matched: **97 review indexes**
- Canonical source packages: **21**
- Canonical chunks: **359**
- Promoted canonical prose packages / chunks: **6 / 149**
- Promoted structured logical tables / versions: **7 / 29**
- Structured rows / values: **891 / 7022**
- Sources awaiting canonicalization: **96**
- Sources awaiting human review: **1**
- Review-artifact-only sources: **34**
- Candidate relationships: **23**
- Promoted relationships: **0**

## VM-20 coverage checkpoint

- Current-manual VM-20 coverage: 149 exact-text chunks; all 149 chunks in the six listed current-manual prose packages are canonically promoted.
- VM-20 companion coverage: 175 exact-text chunks from the reviewed 2020 practice-note wave remain separately labeled non-binding, historical, review-only, and unpromoted.
- Appendix 2 structured tables: 7 logical tables, 29 versions, 891 rows, and 7022 exact source-cell values; status promoted.
- Prose promotion decision: `data/manual-input/promotion-decisions/vm20-2026-prose-promotion.json`.
- Structured-table promotion decision: `data/manual-input/promotion-decisions/vm20-appendix2-structured-table-promotion.json`.
- Structured-table review package: `data/processed/review_packages/vm20-appendix2-structured-table-review-package.md`.
- Remaining VM-20 table gap: current Tables B, C, D, E1, and E2 were not available on the official current-data page and were not inferred.

## Interpretation

- “Canonical promoted” applies only where an explicit promotion decision names the source package or structured-table scope.
- Structured table data remains separate from prose even after its own canonical promotion.
- “Reviewed” means a tracked review artifact exists; it does not prove that all source text was canonicalized.
- Source fidelity remains explicit; summary-only or review-derived material must not be labeled source evidence.

## Copilot handoff posture

- Export eligibility is false for every inventory record, including both promoted VM-20 scopes.
- Canonical promotion does not itself authorize learner, app, RAG, or Copilot use.
- Copilot should consume a separately approved generated export from the canonical corpus, never become the canonical source.

