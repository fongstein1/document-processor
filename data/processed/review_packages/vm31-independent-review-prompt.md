# Independent review prompt: current 2026 VM-31 canonical coverage

Please independently review the current 2026 VM-31 canonical review candidate in the Document Processor repository. Do not modify or promote the corpus.

## Primary files

- Canonical source package: `data/processed/source_indexes/sources/vm31-current-manual.json`
- Review package: `data/processed/review_packages/vm31-canonical-coverage-review-package.json`
- Focused retrieval evaluation: `data/processed/review_packages/vm31-focused-retrieval-evaluation.json`
- Source QA: `data/processed/review_packages/vm31-source-qa.json`
- Relationship registry: `data/processed/relationship_registries/vm31-current-manual-relationship-candidates.json`
- Support-gate regression: `data/processed/review_packages/vm31-support-gate-regression.json`
- Validation report: `data/processed/review_packages/vm31-validation-report.json`

## Review scope

1. Verify the authoritative source identity, SHA-256, and boundary: PDF pages 341-385 contain VM-31, page 386 is intentionally blank, and page 387 begins VM-50.
2. Verify all 9 parents and 75 children are structurally faithful, complete, adjacent, and keep list headings with their nested requirements, qualifications, exceptions, guidance notes, and certifications.
3. Compare representative and risk-focused source excerpts against the PDF, especially Sections 2.A-2.E, 3.D.1, 3.D.3, 3.D.10, 3.D.14, 3.F.2, 3.F.8, 3.F.13, 3.F.16, and 3.F.19.
4. Confirm generated reporting classifications remain derivative and do not turn explanatory or guidance text into new requirements.
5. Confirm VM-20 reserve methodology remains distinct from VM-31 reporting/documentation authority, and the support gate rejects related VM-20 evidence when actual VM-31 requirement evidence is absent from ranks 1-3.
6. Confirm VM-01 terminology is referenced through the common terminology layer rather than duplicated into VM-31 source text.
7. Review every relationship candidate for explicit source support and confirm no legal hierarchy, supersession, or promotion is inferred.
8. Recompute supported top-1 and strict top-3 metrics from case-level evidence; inspect unsupported and ambiguous cases and current-authority ranking.
9. Confirm VM-31 remains review-only, not promoted, and downstream-ineligible pending this decision.

Report findings with severity, exact chunk/query/relationship IDs, and source-page references. End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE

Do not repeat the completed VM-01 or VM-20 source audits unless a VM-31 finding directly demonstrates a regression in those packages.
