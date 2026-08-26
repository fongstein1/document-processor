# Corpus Completeness Report

As of 2026-08-25T00:00:00.000Z, the repository contains a substantial review-only regulatory evidence base but is not production-complete and is not Copilot-export ready.

## Counts

- Source documents inventoried: **105**
- Documents with declared external raw source: **71**
- Documents reviewed / review artifacts matched: **97 review indexes**
- Canonical source packages: **18**
- Canonical chunks: **55**
- Sources awaiting canonicalization: **97**
- Sources awaiting human review: **1**
- Review-artifact-only sources: **34**
- Candidate relationships: **23**
- Promoted relationships: **0**

## Interpretation

- “Canonical” means a review-only package exists in the tracked source-index POC, not that it is approved for downstream use.
- “Reviewed” means a tracked review index or self-review exists; it does not prove that all source text was canonicalized.
- “Missing” in a target assessment means no supporting batch, canonical package, or tracked review evidence was found in the current repository snapshot.
- Source-text fidelity is explicit at package/chunk level; summary-only or review-derived material must not be labeled verbatim source text.

## Copilot handoff posture

- Export eligibility is false for every inventory record.
- Approved export version and exclusion reason are reserved for a later explicit promotion decision.
- Copilot should consume a generated export from the canonical corpus, never become the canonical source.

