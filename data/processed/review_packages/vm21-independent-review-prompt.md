# Independent review prompt: current 2026 VM-21 canonical candidate

Please independently review the substantially complete current 2026 VM-21 canonical candidate in the Document Processor repository. VM-30 is already canonically promoted; do not reopen VM-30 unless this VM-21 work caused a regression.

## Primary files

- Canonical source package: `data/processed/source_indexes/sources/vm21-current-manual.json`
- Review package: `data/processed/review_packages/vm21-canonical-coverage-review-package.json`
- Source QA: `data/processed/review_packages/vm21-source-qa.json`
- Focused retrieval evaluation: `data/processed/review_packages/vm21-focused-retrieval-evaluation.json`
- Support-gate regression: `data/processed/review_packages/vm21-support-gate-regression.json`
- Relationship registry: `data/processed/relationship_registries/vm21-current-manual-relationship-candidates.json`
- Structured evidence inventory: `data/processed/review_packages/vm21-structured-evidence-inventory.json`
- Processor-readiness findings: `data/processed/review_packages/vm21-processor-readiness-findings.json`
- Validation report: `data/processed/review_packages/vm21-validation-report.json`

## Review scope

1. Confirm page 141 is VM-20 printed page 20-97 intentionally blank, page 142 is an unnumbered separator, VM-21 spans PDF pages 143-225, page 225 is printed VM-21 page 21-83 intentionally blank, page 226 is excluded, and page 227 begins VM-22.
2. Confirm 15 parents, 63 children, and 78 total chunks provide substantially complete Sections 1-13 coverage, including nested lists, guidance notes, tables, formulas, cross-page provisions, and adjacency.
3. Confirm batches 022-037 were reused without source re-extraction; overlapping PDF pages 151 and 218 are exact matches and are represented once.
4. Confirm source excerpts, page locators, source-text SHA values, and source-defined terms are source-faithful; generated metadata remains subordinate.
5. Review the structured-evidence inventory, particularly Sections 6 and 7 factor tables/formulas, Section 8 scenario generators, Section 9 hedge calculations, and Section 13 allocation. Do not require numeric recomputation unless an actual transcription defect is found.
6. Confirm relationship candidates are explicit-reference-only, source-bound, pending, review-only, and do not infer legal hierarchy or supersession.
7. Inspect all 30 retrieval cases. Confirm supported strict top-3 behavior, undefined/wrong-manual/version abstention, ambiguity handling, and preference for current VM-21 authority.
8. Confirm all 4 support-gate cases exercise the generic evidence-sufficiency gate: other-manual evidence is insufficient, rank-4 correct evidence is outside the production window, top-3 relevant VM-21 evidence may support, and wrong-topic VM-21 evidence cannot support an invented claim.
9. Assess the AMBER processor-readiness conclusion and classify any finding as architecture improvement, source-specific quality observation, human-review requirement, or no change needed.
10. Confirm VM-21 remains review_only / not_promoted and blocked from learner, app, RAG, vector, and Copilot use.
11. Answer explicitly: Did VM-21 reveal any genuinely new generic processor failure mode that would prevent moving toward exception-based review?

Report findings with severity, exact chunk/query/relationship IDs, and source pages. End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE

Do not request broad re-extraction unless authoritative source evidence is actually missing or inconsistent.
