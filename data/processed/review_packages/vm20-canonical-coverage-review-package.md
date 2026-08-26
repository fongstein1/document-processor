# VM-20 Canonical Coverage Review Package

- Status: review-only
- Provisional disposition: APPROVE WITH FIXES
- Learner-facing: no
- App-ready: no
- RAG-ready: no
- Promoted: no

## Coverage summary

- Hierarchical parents: 59
- Hierarchical children: 259
- Current-manual parents / children: 38 / 105
- Companion parents / children: 21 / 154
- Chunks with page or citation display: 324/324
- Source-text fidelity: exact extracted source text for both packages; companion authority remains non-binding.

## Sections canonicalized

- Section 1 purpose and Section 2 minimum-reserve framework
- Section 3 Net Premium Reserve applicability, definitions, setup, formula entry, and Section 3.C assumptions
- Section 4 Deterministic Reserve complete extracted mechanics
- Section 5 Stochastic Reserve complete extracted mechanics
- Section 6 stochastic and deterministic exclusion tests
- Section 7 cash-flow model structure, starting assets, asset mechanics, scenarios, and proxy mapping
- Section 8 reinsurance credit and projected reinsurance cash-flow treatment
- Section 9 assumptions subsections A-G, including general assumptions, margins, mortality, policyholder behavior, expense, asset, and revenue-sharing assumptions
- Appendix 1 economic-scenario description, generator context, scenario set, and governance
- Appendix 2 prose basis for asset default costs, recovery rates, benchmark spreads, swap spreads, and table publication
- Practice-note Sections 1-21 as separately labeled companion guidance

## Sections and source packages still missing

- Appendix 2 current prescribed asset-default, asset-spread, and swap-spread table rows and version metadata remain deferred to the structured-table milestone
- Independent page-image backstop and line-reference confirmation remain pending human review

## Retrieval evaluation

- VM-20 queries: 26 (25 supported, 1 unsupported)
- Supported top-1: 20/25
- Supported top-3: 25/25
- Unsupported queries detected: 1/1
- Mean reciprocal rank: 0.887
- Raw equivalent parent-child top-k collision slots: 33; post-deduplication: 0
- Retrieval uses generic local-topic metadata, equivalent parent/child deduplication, and context-only handling for very large parents; no question-specific rule was added.
- Raw PDF spot-check: `data/processed/review_packages/vm20-qa-source-spotcheck.json`.
- Full 26-query report: `data/processed/review_packages/vm20-retrieval-qa-report.json`.

## Promotion readiness

- Blocking findings closed: Yes
- Automated promotion: no; human promotion decision remains required.

## Human review

The targeted current-manual prose and appendix wave is source-bound and hierarchically retrievable. Structured current tables, page-image backstop, line references, and historical companion guidance still require explicit reviewer disposition before promotion.

- Confirm current-manual wording and page citations against the approved raw source.
- Confirm parent/child boundaries and any child that crosses a requirement, exception, qualification, or table-heading boundary.
- Review cross-reference candidates without inferring legal effect or supersession.
- Confirm that Sections 4, 5, 9 and Appendices 1-2 are complete for the stated prose boundaries and that Appendix 2 tables remain deferred.
- Decide whether the companion practice-note package is useful as implementation context after currentness review.
- Keep all packages review-only unless a separate promotion decision is recorded.

## Governance boundary

This package is a review handoff. Validation demonstrates structural integrity only; it does not approve wording, establish legal effect, or promote content for learners, applications, RAG, or Copilot export.
