# Retrieval evaluation

- Method: `keyword_overlap_baseline`
- Supported queries: 14
- Unsupported queries: 2
- Top-1 accuracy: 86%
- Top-3 accuracy: 100%
- Top-5 accuracy: 100%
- Mean reciprocal rank: 0.929
- Source-family accuracy: 100%
- Authority-level accuracy: 93%
- Citation availability: 0%
- Multi-chunk evidence recall: 100%
- Unsupported-query precision: 100%

| Query | Category | Expected outcome | Top ranked chunk(s) | Result |
| --- | --- | --- | --- | --- |
| How does AG 01 treat policies when net premium exceeds gross premium? | exact_title | supported | chunk-ag01-net-premium-interpretation-001 (7)<br>chunk-ag36-eiul-crvm-guidance-001 (2)<br>chunk-ag36-eiul-crvm-guidance-002 (2)<br>chunk-ag36-eiul-crvm-guidance-003 (2)<br>chunk-ag36-eiul-crvm-guidance-004 (2) | supported_top1 |
| What does AG 03 say maturity value means for cash surrender benefit interpretation? | exact_title | supported | chunk-ag03-maturity-value-interpretation-001 (7)<br>chunk-ag01-net-premium-interpretation-001 (2)<br>chunk-ag36-eiul-crvm-law-manual-reprint-001 (2)<br>chunk-vm21-sr-projection-entry-002 (2)<br>chunk-actuarial-memorandum-practice-note-003 (1) | supported_top1 |
| What does VM-20 say about the minimum reserve valuation standard and the start of reserve mechanics? | framework_overview | supported | chunk-vm20-framework-boundary-001 (6)<br>chunk-vm20-framework-overview-001 (6)<br>chunk-vm20-assumptions-section-3c-001 (4)<br>chunk-vm20-assumptions-section-3c-002 (4)<br>chunk-vm20-assumptions-section-3c-003 (4) | supported_top3 |
| Where does VM-20 transition from the framework overview into reserve-category mechanics? | mechanics_boundary | supported | chunk-vm20-framework-boundary-001 (10)<br>chunk-vm20-assumptions-section-3c-004 (5)<br>chunk-vm20-framework-overview-001 (5)<br>chunk-vm20-assumptions-section-3c-001 (4)<br>chunk-vm20-assumptions-section-3c-002 (4) | supported_top1 |
| How does VM-20 Section 3.C progress from mortality and interest assumptions through the Section 4 boundary? | multi_chunk | supported | chunk-vm20-assumptions-section-3c-001 (11)<br>chunk-vm20-assumptions-section-3c-004 (8)<br>chunk-vm20-assumptions-section-3c-002 (7)<br>chunk-vm20-assumptions-section-3c-003 (7)<br>chunk-vm20-framework-boundary-001 (5) | supported_top1 |
| How does VM-21 progress from the stochastic reserve projection setup through the closeout boundary? | multi_chunk | supported | chunk-vm21-sr-projection-entry-004 (9)<br>chunk-vm21-sr-projection-entry-001 (8)<br>chunk-vm21-sr-projection-entry-002 (5)<br>chunk-vm21-sr-projection-entry-003 (5)<br>chunk-ag36-eiul-crvm-law-manual-reprint-001 (4) | supported_top1 |
| How does active AG 36 move from the CRVM overview through attachments, hedged-as-required guidance, and certification closeout? | multi_chunk | supported | chunk-ag36-eiul-crvm-law-manual-reprint-001 (9)<br>chunk-ag36-eiul-crvm-guidance-003 (5)<br>chunk-ag36-eiul-crvm-guidance-004 (5)<br>chunk-ag36-eiul-crvm-guidance-001 (4)<br>chunk-ag36-eiul-crvm-guidance-002 (4) | supported_top3 |
| Which source is the companion reprint for AG 36 and how should it be treated? | relationship | supported | chunk-ag36-eiul-crvm-law-manual-reprint-001 (4.5)<br>chunk-ag36-eiul-crvm-guidance-001 (3)<br>chunk-ag36-eiul-crvm-guidance-002 (3)<br>chunk-ag36-eiul-crvm-guidance-003 (3)<br>chunk-ag36-eiul-crvm-guidance-004 (3) | supported_top1 |
| How does the model governance practice note separate opening guidance, governance and validation, and documentation closeout? | multi_chunk | supported | chunk-model-governance-practice-note-002 (12.5)<br>chunk-model-governance-practice-note-003 (7.5)<br>chunk-model-governance-practice-note-001 (6.5)<br>chunk-actuarial-memorandum-practice-note-001 (4.5)<br>chunk-cia-2022-capital-fct-educational-note-001 (4.5) | supported_top1 |
| How does the actuarial memorandum practice note move from background guidance through drafting, judgment, and appendices? | multi_chunk | supported | chunk-actuarial-memorandum-practice-note-004 (11.5)<br>chunk-actuarial-memorandum-practice-note-001 (10.5)<br>chunk-actuarial-memorandum-practice-note-002 (9.5)<br>chunk-actuarial-memorandum-practice-note-003 (9.5)<br>chunk-cia-2022-capital-fct-educational-note-001 (4.5) | supported_top1 |
| What are the opening title, purpose, scope, and definitions in Regulation 210? | exact_title | supported | chunk-reg210-non-guaranteed-elements-001 (13.5)<br>chunk-reg210-non-guaranteed-elements-002 (2.5)<br>chunk-reg210-non-guaranteed-elements-003 (2.5)<br>chunk-actuarial-memorandum-practice-note-001 (1)<br>chunk-cia-2022-capital-fct-educational-note-001 (1) | supported_top1 |
| What does Regulation 210 require of the qualified actuary and board-approved criteria? | exact_title | supported | chunk-reg210-non-guaranteed-elements-002 (7.5)<br>chunk-reg210-non-guaranteed-elements-001 (2.5)<br>chunk-reg210-non-guaranteed-elements-003 (2.5)<br>chunk-ag36-eiul-crvm-guidance-003 (1)<br>chunk-ag36-eiul-crvm-law-manual-reprint-001 (1) | supported_top1 |
| What filing and records requirements appear in Regulation 210? | exact_title | supported | chunk-reg210-non-guaranteed-elements-003 (5.5)<br>chunk-reg210-non-guaranteed-elements-001 (2.5)<br>chunk-reg210-non-guaranteed-elements-002 (2.5)<br>chunk-vm20-framework-overview-001 (1)<br>chunk-actuarial-memorandum-practice-note-001 (0) | supported_top1 |
| How does the CIA educational note move from opening guidance through the capital and FCT overview, additional guidance, and appendices? | multi_chunk | supported | chunk-cia-2022-capital-fct-educational-note-003 (13.5)<br>chunk-cia-2022-capital-fct-educational-note-002 (12.5)<br>chunk-cia-2022-capital-fct-educational-note-001 (7.5)<br>chunk-cia-2022-capital-fct-educational-note-004 (7.5)<br>chunk-actuarial-memorandum-practice-note-001 (3) | supported_top1 |
| What does this corpus say about pricing support? | unsupported | unsupported | chunk-actuarial-memorandum-practice-note-001 (0)<br>chunk-actuarial-memorandum-practice-note-002 (0)<br>chunk-actuarial-memorandum-practice-note-003 (0)<br>chunk-actuarial-memorandum-practice-note-004 (0)<br>chunk-ag01-net-premium-interpretation-001 (0) | unsupported |
| What does this corpus say about liability modeling support? | unsupported | unsupported | chunk-cia-2022-capital-fct-educational-note-003 (1)<br>chunk-actuarial-memorandum-practice-note-001 (0)<br>chunk-actuarial-memorandum-practice-note-002 (0)<br>chunk-actuarial-memorandum-practice-note-003 (0)<br>chunk-actuarial-memorandum-practice-note-004 (0) | unsupported |

## Notes

Unsupported queries should return an explicit insufficient-support result instead of weakly matched evidence.
The ranking baseline is intentionally lightweight and deterministic.
