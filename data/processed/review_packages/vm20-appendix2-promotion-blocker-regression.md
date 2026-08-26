# VM-20 Appendix 2 Promotion-Blocker Regression

- Status: passed
- Focused retrieval cases: 18/18
- Prescribed-dimension rows / source-summary rows: 864 / 27
- Source-value changes: 0
- Source workbook hashes changed: 0
- Production-answer eligible results: 0

## Focused cases

| Query ID | Result | Reason |
| --- | --- | --- |
| `table-f-average-regulatory-exclusion` | unsupported | `source_summary_not_regulatory_dimension` |
| `table-f-average-explicit-source-summary` | supported_canonical | `source_summary_statistic_found` |
| `table-g-average-regulatory-exclusion` | unsupported | `source_summary_not_regulatory_dimension` |
| `table-g-average-explicit-source-summary` | supported_canonical | `source_summary_statistic_found` |
| `table-h-average-regulatory-exclusion` | unsupported | `source_summary_not_regulatory_dimension` |
| `table-h-average-explicit-source-summary` | supported_canonical | `source_summary_statistic_found` |
| `table-i-average-regulatory-exclusion` | unsupported | `source_summary_not_regulatory_dimension` |
| `table-i-average-explicit-source-summary` | supported_canonical | `source_summary_statistic_found` |
| `table-j-average-regulatory-exclusion` | unsupported | `source_summary_not_regulatory_dimension` |
| `table-j-average-explicit-source-summary` | supported_canonical | `source_summary_statistic_found` |
| `table-j-current-short-tenor` | supported_canonical | `exact_structured_value_found` |
| `table-j-long-term-short-tenor` | supported_canonical | `exact_structured_value_found` |
| `table-j-ambiguous-measure` | ambiguous | `ambiguous_requires_more_context` |
| `table-j-january-current-note-scope` | supported_canonical | `exact_structured_value_found` |
| `table-j-january-long-term-note-exclusion` | supported_canonical | `exact_structured_value_found` |
| `table-j-january-unrelated-maturity-note-exclusion` | supported_canonical | `exact_structured_value_found` |
| `table-j-later-version-note-exclusion` | supported_canonical | `exact_structured_value_found` |
| `table-a-pre-effective-date` | unsupported | `table_version_not_yet_effective` |

## Gate conclusion

Average rows are source-summary-only, Table J authority and January-note scope are explicit, Table A is blocked before its effective date, all source-value fingerprints and workbook hashes match the accepted baseline, and canonical promotion remains separate from downstream production eligibility.
