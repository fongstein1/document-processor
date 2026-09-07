# Low-touch acquisition processing pilot review packet

- Batch: scaled-wave-01-2026-09
- Status: REVIEW_ONLY / NOT_PROMOTED
- Source of truth: C:\Dev\Document Processor Sources\2026-09-02 Intake\_acquisition-manifests\approved-pilot-20260902\run-20260907-172504-571\acquisition-manifest.json

| Document | Source family | Format | Raw SHA-256 | Processing outcome | Parent/chunk or equivalent counts | Structured evidence count | Retrieval smoke-test | Exception code | Human review required? | Reason |
| --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
| W09 2015 VBT preferred wearoff factors | Society of Actuaries Experience Studies | XLSX | d6040cf8bf880fa6b37529dffe7327b9c2a007a67a7c560709d58cda9b612d23 | CLEAN_REVIEW_CANDIDATE | 2 | 2 | PASS | NONE | NO | Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed. |
| W10 2015 VBT mortality improvement factors | Society of Actuaries Experience Studies | XLSX | 847ddfd96ed51f47435d5ce99b9dac4f32363186d80336d0d14a1afd1d1e513d | HUMAN_REVIEW_REQUIRED | 20 | 20 | PASS | XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW | YES | 1 worksheet(s) contain native non-cell structures not represented by cell extraction and require human review: Documentation. |
| W11 2015 VBT unismoke ALB/ANB tables | Society of Actuaries Experience Studies | XLSX | c7036b837750a184cdddaf2bdb2fb643450803fdf63565edc8b9f4356c44f801 | CLEAN_REVIEW_CANDIDATE | 4 | 4 | PASS | NONE | NO | Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed. |
| W12 2015 VBT smoker-distinct ALB/ANB tables | Society of Actuaries Experience Studies | XLSX | 906db20c567de15ce5c754204ec5f8b467afa96fbc93389db667ea5a88a67dd8 | CLEAN_REVIEW_CANDIDATE | 8 | 8 | PASS | NONE | NO | Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed. |

## Summary

- TOTAL_ADMITTED: 4
- PROCESSED_SUCCESSFULLY: 4
- CLEAN_REVIEW_CANDIDATES: 3
- HUMAN_REVIEW_REQUIRED: 1
- PROCESSING_BLOCKED: 0
- SYSTEMIC_FAILURES: 0

## Stratified clean sample

- society-of-actuaries-experience-studies-soa-2015-vbt-preferred-wearoff: clean review candidate; structural/text evidence is stored externally under the rights boundary.
- society-of-actuaries-experience-studies-soa-2015-vbt-unismoke: clean review candidate; structural/text evidence is stored externally under the rights boundary.
- society-of-actuaries-experience-studies-soa-2015-vbt-smoker-distinct: clean review candidate; structural/text evidence is stored externally under the rights boundary.

## Exception review sample

- society-of-actuaries-experience-studies-soa-2015-vbt-improvement: workbook/page exception sample (XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW).

All outputs are review-only; no canonical promotion, learner-facing use, RAG eligibility, or authority expansion occurred.
