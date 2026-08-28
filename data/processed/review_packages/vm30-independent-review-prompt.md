# Independent review prompt: 2026 VM-30 canonical review candidate

Please independently review the current 2026 VM-30 canonical review candidate in the Document Processor repository. Do not modify or promote the corpus. VM-31 is already canonically promoted; do not reopen its accepted source audit unless this VM-30 pass changed VM-31 evidence.

## Primary files

- Canonical source package: `data/processed/source_indexes/sources/vm30-current-manual.json`
- Review package: `data/processed/review_packages/vm30-canonical-coverage-review-package.json`
- Focused retrieval evaluation: `data/processed/review_packages/vm30-focused-retrieval-evaluation.json`
- Source QA: `data/processed/review_packages/vm30-source-qa.json`
- Relationship registry: `data/processed/relationship_registries/vm30-current-manual-relationship-candidates.json`
- Support-gate regression: `data/processed/review_packages/vm30-support-gate-regression.json`
- Validation report: `data/processed/review_packages/vm30-validation-report.json`

## Review scope

1. Confirm the authoritative chapter boundary: PDF page 324 ends VM-26, pages 325-339 comprise VM-30 (including printed blank page 30-15), page 340 is an unnumbered separator, and page 341 begins VM-31.
2. Confirm 8 parents, 43 children, 51 chunks, continuous hierarchy/adjacency, exact source fidelity, and zero source-text rewrites. Pay particular attention to the page-spanning key-indicators and reserve tables.
3. Confirm only adverse opinion, qualified opinion, and inconclusive opinion are represented as source-defined VM-30 terms; VM-01 terminology is not duplicated.
4. Review all 16 explicit-reference candidates. Confirm source-facing target labels occur in retained source text, canonical labels are separate metadata, and every candidate remains pending, unpromoted, and non-eligible.
5. Inspect all 21 focused retrieval cases. Confirm strict top-three metrics, unsupported VM-31/invented/future-version abstentions, ambiguous submission handling, and current-authority preference.
6. Confirm all 4 generic support-gate regressions pass and actual VM-30 source evidence is required inside ranks 1-3.
7. Confirm VM-30 remains review-only, not promoted, promotion-ineligible, and blocked from learner, app, RAG, vector, and Copilot use.

Report findings with severity, exact chunk/query/relationship IDs, and source-page references. End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE

Do not start VM-G or VM-C, and do not repeat the completed VM-01, VM-20, or VM-31 source audits unless this pass changed their authoritative evidence.
