# VM-20 Canonical Coverage Review Package

- Status: canonical promoted (current-manual prose scope only)
- Final disposition: APPROVE
- Prior provisional disposition retained: APPROVE WITH FIXES
- Learner-facing: no
- App-ready: no
- RAG-ready: no
- Promoted: yes
- Promotion decision: `data/manual-input/promotion-decisions/vm20-2026-prose-promotion.json`

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
- Automated promotion: no; the final independent-review decision is recorded.

## Human review

Independent review approved the source-bound current-manual prose scope after the targeted blockers were closed. Structured tables, downstream export, historical companion guidance, and review-only relationship candidates remain outside the decision.

- Preserve the approved current-manual source text, hierarchy, citations, and retrieval behavior.
- Keep Appendix 2 structured values review-only until their own independent table review and promotion decision.
- Keep the 2020 practice note non-binding, historical, review-only, and excluded from canonical authority.
- Keep relationship candidates pending and do not infer legal effect or supersession.
- Require a separate decision before learner-facing, app, RAG, or Copilot export use.

## Governance boundary

Promotion applies only to the six reviewed current-manual prose packages. It does not promote structured tables, the 2020 practice note, relationship candidates, or any learner-facing, application, RAG, or Copilot export use.
