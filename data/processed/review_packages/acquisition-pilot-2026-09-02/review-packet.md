# Low-touch acquisition processing pilot review packet

- Batch: acquisition-pilot-2026-09-02
- Status: REVIEW_ONLY / NOT_PROMOTED
- Source of truth: C:\Dev\Document Processor Sources\2026-09-02 Intake\_acquisition-manifests\approved-pilot-20260902\final-20260902\acquisition-manifest.json

| Document | Source family | Format | Raw SHA-256 | Processing outcome | Parent/chunk or equivalent counts | Structured evidence count | Retrieval smoke-test | Exception code | Human review required? | Reason |
| --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
| A2 VM-V nonjumbo and jumbo valuation rates, 2026 | NAIC PBR / VM-20 / VM-31 / VM-51 | XLSX | 85f7aa611f268d29d2e114efef91a41ddd049d86af70f8149b48ca1210b36dd5 | CLEAN_REVIEW_CANDIDATE | 5 | 5 | PASS | NONE | NO | Automated source binding, extraction, structure, chunking, citation, SHA, and retrieval checks passed. |
| A3 2026 Accounting Practices and Procedures Manual | NAIC Accounting Publications | PDF | 572b86e1e45582656f23d218d4695ba5a102e5f13f00c4cb34ae68e54d3830a0 | CLEAN_REVIEW_CANDIDATE | 2117 | 0 | PASS | NONE | NO | Automated source binding, extraction, structure, chunking, citation, SHA, and retrieval checks passed. |
| A4 2026-03BWG Modified Blanks | NAIC Life / Fraternal Reporting | PDF | b7eb1248ab98bb401c3627d788ff9593219ce100a18d3eb77c3557a52ab971de | CLEAN_REVIEW_CANDIDATE | 22 | 0 | PASS | NONE | NO | Automated source binding, extraction, structure, chunking, citation, SHA, and retrieval checks passed. |
| S1 Current PBR Valuation Manual, redline edition | NAIC PBR / VM-20 / VM-31 / VM-51 | PDF | 9f963e3e447bf225c2e8c2dedea3d5d227c6235809558bbcdd60e475088e3bbc | HUMAN_REVIEW_REQUIRED | 482 | 0 | PASS | EMPTY_PAGE_TEXT_LAYER | YES | 6 PDF page(s) have no extractable text; retain page-image backstop. |
| S2 2026 States Prescribed Differences | NAIC Accounting Publications | PDF | 9638eda15c22ab3c53a0c5c3c2135082bad2c3a73ba1fcaa3dda4b5146ba471e | CLEAN_REVIEW_CANDIDATE | 37 | 0 | PASS | NONE | NO | Automated source binding, extraction, structure, chunking, citation, SHA, and retrieval checks passed. |
| S3 2026 Quarterly Statement Blank, Life/Fraternal | NAIC Life / Fraternal Reporting | PDF | 1bc3be9b8db1489ee2366bcd2c6c088e733fe1eb10e8cec1f12b031ee93322af | CLEAN_REVIEW_CANDIDATE | 51 | 0 | PASS | NONE | NO | Automated source binding, extraction, structure, chunking, citation, SHA, and retrieval checks passed. |
| S4 2015 Valuation Basic Table Report | Society of Actuaries Experience Studies | PDF | 66b13374cbf60b3a493ad761cd01e2e93e701e57146f187b416321479f94fe51 | CLEAN_REVIEW_CANDIDATE | 94 | 0 | PASS | NONE | NO | Automated source binding, extraction, structure, chunking, citation, SHA, and retrieval checks passed. |

## Summary

- TOTAL_ADMITTED: 7
- PROCESSED_SUCCESSFULLY: 7
- CLEAN_REVIEW_CANDIDATES: 6
- HUMAN_REVIEW_REQUIRED: 1
- PROCESSING_BLOCKED: 0
- SYSTEMIC_FAILURES: 0

## Stratified clean sample

- A2: native XLSX workbook with sheet/cell/formula preservation.
- S4: empirical actuarial-study PDF with page-aware extraction and citation evidence.

All outputs are review-only; no canonical promotion, learner-facing use, RAG eligibility, or authority expansion occurred.
