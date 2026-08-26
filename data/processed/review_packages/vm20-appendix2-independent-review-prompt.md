# Narrow Final Promotion Gate: VM-20 Appendix 2 Structured Tables

The prior independent review returned **APPROVE WITH FIXES** after verifying all five workbook hashes and 7,022 / 7,022 source cells. The two requested corrections have been applied. Perform only this narrow final gate:

1. Confirm Tables F, G, H, I, and J Average rows are preserved as `source_summary_statistic`, excluded from prescribed-value retrieval, and available only through explicit source-summary requests with disclosure.
2. Confirm Table J distinguishes official-workbook association from Manual table identity: the current column is `current_benchmark_swap_spread` with no Manual table-letter assignment, while the long-term column is `long_term_benchmark_swap_spread` with Manual identity Table J. Confirm the January 3M/6M current-SOFR note does not attach to the long-term column, other maturities, or later versions.
3. Run the focused blocker regression report and confirm ambiguous Table J measure queries require more context and Table A is unavailable before its 2026-06-30 effective date.
4. Confirm the source workbook hashes and 7,022-value count are unchanged. Do not repeat the full 7,022-cell audit unless a workbook hash or recorded source value changed.
5. Decide whether the corrected review-only dataset is ready for a separate promotion decision. Do not promote it during this review.

Primary artifacts:

- `data/processed/review_packages/vm20-appendix2-structured-table-review-package.md`
- `data/processed/structured_tables/vm20-appendix2-tables.json`
- `data/processed/review_packages/vm20-appendix2-promotion-blocker-regression.md`
- `data/processed/structured_tables/vm20-appendix2-retrieval-evaluation.json`
- `data/processed/review_packages/vm20-appendix2-structured-table-source-qa.json`

Return APPROVE, APPROVE WITH FIXES, REPROCESS, or REJECT, limited to these five checks.
