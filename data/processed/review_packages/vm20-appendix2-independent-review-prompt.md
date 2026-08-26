# Independent Review Prompt: VM-20 Appendix 2 Structured Tables

Please independently review the VM-20 Appendix 2 structured-table proof of concept in this repository.

Primary artifacts:

- `data/processed/review_packages/vm20-appendix2-structured-table-review-package.md`
- `data/processed/structured_tables/vm20-appendix2-tables.json`
- `data/processed/review_packages/vm20-appendix2-structured-table-source-qa.json`
- `data/processed/structured_tables/vm20-appendix2-retrieval-evaluation.json`

Compare the structured JSON with the five ignored source workbooks under `data/work/structured-table-sources/vm20-appendix2-2026` and with the 2026 Valuation Manual Appendix 2 methodology on printed pages 20-91 through 20-96 (physical PDF pages 135-140).

Review at least the following:

1. Confirm workbook identity, official URL, SHA-256, sheet inventory, table identity, and currentness/version treatment.
2. Confirm row and column dimensions, units, displayed precision, negative values, explicit nulls, and representative exact cell values for Tables A, F, G, H, I, J, and K.
3. Confirm that Tables B, C, D, E1, and E2 are marked unavailable rather than reconstructed from methodology prose or historical values.
4. Confirm workbook/sheet/cell citations and manual printed/physical page citations.
5. Confirm Table A's effective-date note and Table J's short-tenor/disclosure note scope without inferring unrecorded legal effect.
6. Confirm legal-disclaimer retention is source-workbook/hash based and that no invisible/non-cell disclaimer text was invented.
7. Run the structured-table build, source QA, retrieval evaluation, validation, and full repository checks.
8. Confirm the dataset remains separate from the promoted prose corpus, review-only, not promoted, and ineligible for learner/app/RAG/Copilot export.

Return one disposition: APPROVE, APPROVE WITH FIXES, REPROCESS, or REJECT. List every blocking and non-blocking finding with table/version/row/column/cell evidence. Do not promote the table dataset as part of the review; promotion requires a separate recorded decision.
