# Low-touch acquisition processing pilot review packet

- Batch: scaled-wave-01-replay-2026-09
- Status: REVIEW_ONLY / NOT_PROMOTED
- Source of truth: C:\Dev\Document Processor Sources\2026-09-02 Intake\_acquisition-manifests\approved-pilot-20260902\run-20260907-180645-779\acquisition-manifest.json

| Document | Source family | Format | Raw SHA-256 | Processing outcome | Parent/chunk or equivalent counts | Structured evidence count | Retrieval smoke-test | Exception code | Human review required? | Reason |
| --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
| W01 VM Maintenance Agenda, 2026-04-28 | NAIC PBR / VM-20 / VM-31 / VM-51 | XLSX | b96b7dd1025aa3b1590f617162480d4ade27f4f8ccfbfbf90b61556a0df02443 | HUMAN_REVIEW_REQUIRED | 15 | 15 | PASS | XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW | YES | 2 worksheet(s) contain native non-cell structures not represented by cell extraction and require human review: Active Listing, Disposition Listing. |
| W02 VM-20 Table F/G current spreads, 2026 | NAIC PBR / VM-20 / VM-31 / VM-51 | XLSX | bcdeb352a66771c18f8d47efd5b1b97a8facd51fa672b0a8c8585be768d31753 | HUMAN_REVIEW_REQUIRED | 9 | 9 | PASS | XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW | YES | 1 worksheet(s) contain native non-cell structures not represented by cell extraction and require human review: LEGAL DISCLAIMER. |
| W03 VM-20 Table H/I long-term spreads, 2026 | NAIC PBR / VM-20 / VM-31 / VM-51 | XLSX | 5e2a1946b9d381b2e2c93f1e773e205a412093c4eb3cdfcbbafebc4ba63c1597 | HUMAN_REVIEW_REQUIRED | 4 | 4 | PASS | XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW | YES | 1 worksheet(s) contain native non-cell structures not represented by cell extraction and require human review: LEGAL DISCLAIMER. |
| W04 VM-20 Table J swaps, 2026 | NAIC PBR / VM-20 / VM-31 / VM-51 | XLSX | 8329ad290f2ddeb3055729019fcbedf513b09d6c99a2817d274b14d01c2ea493 | HUMAN_REVIEW_REQUIRED | 11 | 11 | PASS | XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW | YES | 2 worksheet(s) contain native non-cell structures not represented by cell extraction and require human review: LIBOR to SOFR Disclosure, LEGAL DISCLAIMER. |
| W05 VM-20 Table K conversion | NAIC PBR / VM-20 / VM-31 / VM-51 | XLSX | 19a8628714606410c29c6573a8f8aba7139d88bea1ba883e64bcf13c60653758 | HUMAN_REVIEW_REQUIRED | 3 | 3 | PASS | XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW | YES | 1 worksheet(s) contain native non-cell structures not represented by cell extraction and require human review: LEGAL DISCLAIMER. |
| W06 VM-31 actuarial reports templates | NAIC PBR / VM-20 / VM-31 / VM-51 | XLSX | 932c9164967363ac06db624fb6f8711c29a31ba4f767201361e4bfa6027a5dcd | CLEAN_REVIEW_CANDIDATE | 60 | 60 | PASS | NONE | NO | Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed. |
| W07 2025 Annual Statement Blank, Life/Fraternal | NAIC Life / Fraternal Reporting | PDF | 6819aeff68578d789fc5a0e09ba5b60e15edc89305ae9d42fd3b66048147cae1 | CLEAN_REVIEW_CANDIDATE | 197 | 0 | PASS | NONE | NO | Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed. |
| W08 2026 Quarterly Statement Instructions, Life/Fraternal | NAIC Life / Fraternal Reporting | PDF | fa507228461252f92cbe8d0e728b0cc5dfdd93f6c93a4cf9a6380063dec44f31 | CLEAN_REVIEW_CANDIDATE | 222 | 0 | PASS | NONE | NO | Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed. |
| W09 2015 VBT preferred wearoff factors | Society of Actuaries Experience Studies | XLSX | d6040cf8bf880fa6b37529dffe7327b9c2a007a67a7c560709d58cda9b612d23 | CLEAN_REVIEW_CANDIDATE | 2 | 2 | PASS | NONE | NO | Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed. |
| W10 2015 VBT mortality improvement factors | Society of Actuaries Experience Studies | XLSX | 847ddfd96ed51f47435d5ce99b9dac4f32363186d80336d0d14a1afd1d1e513d | HUMAN_REVIEW_REQUIRED | 20 | 20 | PASS | XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW | YES | 1 worksheet(s) contain native non-cell structures not represented by cell extraction and require human review: Documentation. |
| W11 2015 VBT unismoke ALB/ANB tables | Society of Actuaries Experience Studies | XLSX | c7036b837750a184cdddaf2bdb2fb643450803fdf63565edc8b9f4356c44f801 | CLEAN_REVIEW_CANDIDATE | 4 | 4 | PASS | NONE | NO | Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed. |
| W12 2015 VBT smoker-distinct ALB/ANB tables | Society of Actuaries Experience Studies | XLSX | 906db20c567de15ce5c754204ec5f8b467afa96fbc93389db667ea5a88a67dd8 | CLEAN_REVIEW_CANDIDATE | 8 | 8 | PASS | NONE | NO | Automated source binding, extraction, deterministic page-window grouping, citation, SHA, and retrieval checks passed. |

## Summary

- TOTAL_ADMITTED: 12
- PROCESSED_SUCCESSFULLY: 12
- CLEAN_REVIEW_CANDIDATES: 6
- HUMAN_REVIEW_REQUIRED: 6
- PROCESSING_BLOCKED: 0
- SYSTEMIC_FAILURES: 0

## Stratified clean sample

- naic-pbr-vm-20-vm-31-vm-51-vm31-templates-reports: clean review candidate; structural/text evidence is stored externally under the rights boundary.
- naic-life-fraternal-reporting-asb-life-2025: clean review candidate; structural/text evidence is stored externally under the rights boundary.
- naic-life-fraternal-reporting-qsi-life-2026: clean review candidate; structural/text evidence is stored externally under the rights boundary.
- society-of-actuaries-experience-studies-soa-2015-vbt-preferred-wearoff: clean review candidate; structural/text evidence is stored externally under the rights boundary.
- society-of-actuaries-experience-studies-soa-2015-vbt-unismoke: clean review candidate; structural/text evidence is stored externally under the rights boundary.
- society-of-actuaries-experience-studies-soa-2015-vbt-smoker-distinct: clean review candidate; structural/text evidence is stored externally under the rights boundary.

## Exception review sample

- naic-pbr-vm-20-vm-31-vm-51-vm-maintenance-agenda-2026-04-28: workbook/page exception sample (XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW).
- naic-pbr-vm-20-vm-31-vm-51-vm20-tables-2026-f-g: workbook/page exception sample (XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW).
- naic-pbr-vm-20-vm-31-vm-51-vm20-tables-2026-h-i: workbook/page exception sample (XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW).
- naic-pbr-vm-20-vm-31-vm-51-vm20-tables-2026-j: workbook/page exception sample (XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW).
- naic-pbr-vm-20-vm-31-vm-51-vm20-tables-2026-k: workbook/page exception sample (XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW).
- society-of-actuaries-experience-studies-soa-2015-vbt-improvement: workbook/page exception sample (XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW).

All outputs are review-only; no canonical promotion, learner-facing use, RAG eligibility, or authority expansion occurred.
