# Independent review prompt: 2026 VM-01 Definitions

Please independently review the VM-01 canonicalization in the Document Processor repository. Do not rely on prior chat conclusions. Treat the authoritative 2026 Valuation Manual PDF as the source of truth and the review package as non-authoritative metadata.

## Files

- Canonical VM-01 package: `data/processed/source_indexes/sources/vm01-definitions.json`
- Definition lookup index: `data/processed/source_indexes/definitions/vm01-definition-index.json`
- Review package: `data/processed/review_packages/vm01-canonical-definitions-review-package.json`
- Source QA: `data/processed/review_packages/vm01-definitions-source-qa.json`
- Retrieval evaluation: `data/processed/review_packages/vm01-definition-retrieval-evaluation.json`
- Relationship candidates: `data/processed/relationship_registries/vm01-definition-relationship-candidates.json`
- Reviewed extraction: `data/work/batches/batch-013/extraction-output.json`
- Source manifest: `data/work/batches/batch-013/batch-manifest.json`

## Required review

1. Verify source identity, 2026 edition, SHA-256, VM-01 chapter pages 25-39, definition-bearing pages 25-37, and the absence of additional definitions on pages 38-39.
2. Verify that all 98 definitions are present exactly once and that each formal source excerpt is faithful to the PDF.
3. Verify each exact term boundary, including cross-page entries, attached guidance notes, enumerated conditions, exceptions, and the complete VM-20 reserving-category definition.
4. Verify that aliases and acronym expansions are included only when the source explicitly provides them; reject inferred colloquial or related forms.
5. Review the eleven recorded text-layer term-spacing corrections against the visible PDF and confirm that only lookup metadata is corrected while exact source evidence is unchanged.
6. Check similar but distinct terms, especially claim reserve versus contract reserve, policyholder behavior versus policyholder efficiency, deterministic reserve versus stochastic reserve, and guaranteed investment contract versus synthetic guaranteed investment contract.
7. Review every relationship candidate. Confirm that each has explicit source evidence and that no candidate asserts hierarchy, supersession, legal effect, or applicability beyond that evidence.
8. Re-run or inspect the focused retrieval evaluation. Confirm exact-term, acronym, plain-language, condition/exception, incorporated-term, cross-reference, cross-document, ambiguous, unavailable-version, and undefined-term behavior.
9. Confirm that a request for a term not formally defined in VM-01 abstains even when semantically related prose exists elsewhere. Related evidence may be shown only as related evidence, not as a formal definition.
10. Confirm that current authoritative VM-01 evidence outranks secondary explanatory material for formal-definition questions.
11. Confirm governance remains review-only / not promoted and that learner-facing, app, RAG, vector, and Copilot export permissions remain blocked.

## Output

Report findings with severity, exact file/chunk/definition IDs, page citations, and proposed corrections. End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE

Do not modify the corpus or promote it during the review.
