# Corpus Completeness Report

As of 2026-08-25T00:00:00.000Z, the repository contains a substantial review-only regulatory evidence base but is not production-complete and is not Copilot-export ready.

## Counts

- Source documents inventoried: **105**
- Documents with declared external raw source: **71**
- Documents reviewed / review artifacts matched: **97 review indexes**
- Canonical source packages: **20**
- Canonical chunks: **282**
- Sources awaiting canonicalization: **96**
- Sources awaiting human review: **1**
- Review-artifact-only sources: **34**
- Candidate relationships: **23**
- Promoted relationships: **0**

## VM-20 coverage checkpoint

- Current-manual VM-20 coverage: 72 chunks across the existing framework/Section 3.C packages and the expanded reviewed batches 004, 005, and 007-012.
- VM-20 companion coverage: 175 exact-text chunks from the reviewed 2020 practice-note wave, separately labeled non-binding and historical.
- Dedicated review package: `data/processed/review_packages/vm20-canonical-coverage-review-package.json` and `.md`.
- Remaining VM-20 gaps: complete authoritative Sections 4, 5, and 9; Appendices 1-2; and structured current prescribed tables.

## Interpretation

- “Canonical” means a review-only package exists in the tracked source-index POC, not that it is approved for downstream use.
- “Reviewed” means a tracked review index or self-review exists; it does not prove that all source text was canonicalized.
- “Missing” in a target assessment means no supporting batch, canonical package, or tracked review evidence was found in the current repository snapshot.
- Source-text fidelity is explicit at package/chunk level; summary-only or review-derived material must not be labeled verbatim source text.

## Copilot handoff posture

- Export eligibility is false for every inventory record.
- Approved export version and exclusion reason are reserved for a later explicit promotion decision.
- Copilot should consume a generated export from the canonical corpus, never become the canonical source.

