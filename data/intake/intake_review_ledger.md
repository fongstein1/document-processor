# NAIC Controlled-Source Pipeline — Intake Review Ledger
**Generated At:** 2026-10-20T14:48:55.210Z  
**Governing Standard:** 2026 NAIC Valuation Manual  
**Repository:** `fongstein1/document-processor`  

---

## 1. Executive Summary & Disposition Breakdown

| Metric | Count | Governance Status |
|---|---|---|
| **Total Assets Cataloged** | **77** | Complete cross-source catalog |
| **ACCEPTED (Promoted)** | **10** | Authoritative canonical packages in `repository-manifest.json` |
| **QUARANTINED** | **41** | Candidate PBR (VM-22), practice notes, guidelines, staged M5 docs |
| **REJECTED** | **1** | Unadopted proposals rejected under Anti-Fabrication Invariant |
| **MISSING (External Only)** | **25** | Cataloged on external intake root; absent from local repository |
| **Downstream RAG Ingestible** | **10** | Strictly restricted to ACCEPTED assets |
| **Downstream RAG Blocked** | **67** | Fail-closed isolation for all non-promoted assets |

---

## 2. Reason Code Dictionary

- **`HR-ACCEPTED-PROMOTED`**: Formally approved by qualified human actuary with verified signed promotion-decision record; 2026 governing manual edition confirmed.
- **`HR-QUARANTINED-PENDING-SME`**: Source chunks mechanically normalized, but awaiting independent human actuarial review and sign-off (e.g. VM-22, batch-013, state regs).
- **`HR-QUARANTINED-OCR-NOISY`**: Text layer contains character encoding noise; page-image backstop active; manual spot-check required before promotion.
- **`HR-QUARANTINED-NO-STABLE-LINES`**: Lacks stable line or paragraph coordinates; page-level locators only.
- **`HR-QUARANTINED-EDUCATIONAL-NOT-STATUTORY`**: Educational guidance, practice note, or non-binding commentary; excluded from authoritative statutory standard.
- **`HR-QUARANTINED-STAGED-PENDING-REVIEW`**: Staged document extracted in M5 scale pilot; pending human promotion decision and scope clearance.
- **`HR-REJECTED-UNADOPTED-EDITION`**: Draft proposal, prospective amendment, or unadopted edition text; strictly rejected under anti-fabrication regulatory policy.
- **`HR-MISSING-LOCAL-SOURCE`**: Document cataloged on external intake root, but physical file absent from local repository checkout.

---

## 3. Detailed Intake Review Ledger

| Asset ID | Type | Title | Edition | Disposition | Reason Code | Chunks | Downstream RAG |
|---|---|---|---|---|---|---|---|
| `actuarial-memorandum-practice-note` | canonical_source_package | Actuarial Memorandum Practice Note | American Academy of Actuaries exposure draft, January 2020 | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 4 | **BLOCKED** |
| `ag01-net-premium-interpretation` | canonical_source_package | Valuation of Policies in Which the Net Premium Exceeds the Gross Premium | Actuarial Guideline I | **QUARANTINED** | `HR-QUARANTINED-OCR-NOISY` | 1 | **BLOCKED** |
| `ag03-maturity-value-interpretation` | canonical_source_package | Definition of the Term Maturity Value in the Standard Nonforfeiture Law of Individual Deferred Annuities | Actuarial Guideline III | **QUARANTINED** | `HR-QUARANTINED-OCR-NOISY` | 1 | **BLOCKED** |
| `ag36-eiul-crvm-guidance` | canonical_source_package | The Application of the Commissioners Reserve Valuation Method to Equity Indexed Life Insurance Policies | Actuarial Guideline XXXVI | **QUARANTINED** | `HR-QUARANTINED-OCR-NOISY` | 4 | **BLOCKED** |
| `ag36-eiul-crvm-law-manual-reprint` | canonical_source_package | The Application of the Commissioners Reserve Valuation Method to Equity Indexed Life Insurance Policies | Actuarial Guideline XXXVI / 2021 Law Manual reprint | **QUARANTINED** | `HR-QUARANTINED-OCR-NOISY` | 1 | **BLOCKED** |
| `cia-2022-capital-fct-educational-note` | canonical_source_package | CIA 2022 Capital and FCT Educational Note | Canadian Institute of Actuaries educational note, February 2022 | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 4 | **BLOCKED** |
| `DOC-2015-VBT-IMPROVEMENT-FACTORS_XLSX` | external_intake_document | 2015 vbt improvement factors | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-2015-VBT-PREFERRED-WEAROFF-FACTORS_XLSX` | external_intake_document | 2015 vbt preferred wearoff factors | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-2015-VBT-SMOKER-DISTINCT-ALB-ANB_XLSX` | external_intake_document | 2015 vbt smoker distinct alb anb | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-2015-VBT-UNISMOKE-ALB-ANB_XLSX` | external_intake_document | 2015 vbt unismoke alb anb | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-NAIC-APP-MANUAL-2026` | staged_document | Accounting Practices and Procedures Manual (2026 Edition Overview) | 2026 NAIC AP&P Manual | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 322 | **BLOCKED** |
| `DOC-NAIC-ASB-XREF-LIFE` | staged_document | Actuarial Standards Board (ASB) Cross-Reference for Life/Fraternal Annual Statements | 2026 Annual Statement Reference | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 472 | **BLOCKED** |
| `DOC-NAIC-BWG-2026-03-MOD` | staged_document | Adopted Blanks Working Group Modifications (2026-03BWG Modified) | 2026 Reporting Year | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 50 | **BLOCKED** |
| `DOC-NAIC-MO-805` | staged_document | Standard Nonforfeiture Law for Individual Deferred Annuities (Model 805) | Fall 2020 | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 15 | **BLOCKED** |
| `DOC-NAIC-MO-808` | staged_document | Standard Nonforfeiture Law for Life Insurance (Model 808) | Fall 2020 | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 38 | **BLOCKED** |
| `DOC-NAIC-MO-820` | staged_document | Standard Valuation Law (Model 820 - SVL) | Fall 2020 (With PBR Amendments) | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 71 | **BLOCKED** |
| `DOC-NAIC-MO-822` | staged_document | Actuarial Opinion and Memorandum Regulation (Model 822 - AOMR) | Fall 2020 | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 32 | **BLOCKED** |
| `DOC-NAIC-MO-830` | staged_document | Valuation of Life Insurance Policies Model Regulation (Model 830 - Regulation XXX) | Fall 2020 | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 58 | **BLOCKED** |
| `DOC-NAIC-PLENARY-AMENDMENTS-2026` | staged_document | Attachment Three EX Committee & Plenary Life Amendments - 2026 Valuation Manual | 2026 Plenary Action Draft | **REJECTED** | `HR-REJECTED-UNADOPTED-EDITION` | 369 | **BLOCKED** |
| `DOC-NAIC-QSB-LIFE-2026` | staged_document | 2026 Quarterly Statement Blank for Life and Fraternal Companies | 2026 Quarterly Blank | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 118 | **BLOCKED** |
| `DOC-NAIC-QSI-LIFE-2026` | staged_document | 2026 Quarterly Statement Instructions for Life and Fraternal Companies | 2026 Quarterly Instructions | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 402 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2023-14` | staged_document | NAIC SAPWG Ref #2023-14: imr-avr | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 16 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-01` | staged_document | NAIC SAPWG Ref #2025-01: Lease Clarification | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 23 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-13` | staged_document | NAIC SAPWG Ref #2025-13: Statutory Trusts_0 | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 77 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-22` | staged_document | NAIC SAPWG Ref #2025-22: reins-collateral | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 25 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-23` | staged_document | NAIC SAPWG Ref #2025-23: IMR Proof of Reinvestment | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 21 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-25` | staged_document | NAIC SAPWG Ref #2025-25: SA Nonadmit | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 15 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-27` | staged_document | NAIC SAPWG Ref #2025-27: SSAP 1 ModcoFWH | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 13 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-28` | staged_document | NAIC SAPWG Ref #2025-28: Repo Nonadmittance | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 23 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-29` | staged_document | NAIC SAPWG Ref #2025-29: Reporting Clarifications | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 19 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-30` | external_intake_document | NAIC SAPWG Ref #2025-30: ASC disclosure clarification | 2026 Adopted Action Items | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-31` | external_intake_document | NAIC SAPWG Ref #2025-31: a - Update Coverage Gap Reference | 2026 Adopted Action Items | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-32` | external_intake_document | NAIC SAPWG Ref #2025-32: Shaded text | 2026 Adopted Action Items | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-33` | external_intake_document | NAIC SAPWG Ref #2025-33: Expense Category Update_0 | 2026 Adopted Action Items | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2025-34` | staged_document | NAIC SAPWG Ref #2025-34: VM 22 goes updates | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 18 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2026-01` | staged_document | NAIC SAPWG Ref #2026-01: FABN Disclosure | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 26 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2026-03EP` | external_intake_document | NAIC SAPWG Ref #2026-03EP: EP Spring 2026 | 2026 Adopted Action Items | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2026-05` | staged_document | NAIC SAPWG Ref #2026-05: sec-lending-restricted-asset | 2026 Adopted Action Items | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 27 | **BLOCKED** |
| `DOC-NAIC-SAPWG-2026-07` | external_intake_document | NAIC SAPWG Ref #2026-07: avr-referral-on-sca | 2026 Adopted Action Items | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-NAIC-SVO-SPD-OPS-2026` | staged_document | Purposes and Procedures Manual of the NAIC Investment Analysis Office (SVO) | 2026 SVO Manual | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 60 | **BLOCKED** |
| `DOC-NAIC-VM-2026-REDLINE` | staged_document | 2026 NAIC Valuation Manual Adopted Redline Changes and Legislative Text | 2026 Valuation Manual (Adopted Redline) | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 321 | **BLOCKED** |
| `DOC-PBR_DATA_ACTUARIAL_REPORTS_TEMPLATES_0_XLSX` | external_intake_document | pbr data actuarial reports templates 0 | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-PBR_DATA_TABLE_K_CONVERSION_XLSX` | external_intake_document | pbr data table k conversion | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-PBR-2026-VM20-TABLE-F-G-CURRENT-SPREADS_XLSX` | external_intake_document | pbr 2026 vm20 table f g current spreads | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-PBR-2026-VM20-TABLE-H-I-LONG-TERM-SPREADS_XLSX` | external_intake_document | pbr 2026 vm20 table h i long term spreads | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-PBR-2026-VM20-TABLE-J-SWAPS_XLSX` | external_intake_document | pbr 2026 vm20 table j swaps | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-PBR-2026-VMV-NONJUMBO-JUMBO-VALUATION-RATES_XLSX` | external_intake_document | pbr 2026 vmv nonjumbo jumbo valuation rates | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `DOC-SOA-2015-VBT-REPORT` | staged_document | Society of Actuaries 2015 Valuation Basic Table (VBT) Report | 2015 Table Report (VM-20 Prescribed Benchmark) | **QUARANTINED** | `HR-QUARANTINED-STAGED-PENDING-REVIEW` | 113 | **BLOCKED** |
| `DOC-VM_MAINTENANCE_AGENDA_042826__1__XLSX` | external_intake_document | VM Maintenance Agenda 042826 (1) | 2026 Reference | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 0 | **BLOCKED** |
| `model-governance-practice-note` | canonical_source_package | Model Governance: Some Considerations for Practicing Life Actuaries | American Academy of Actuaries practice note, April 2017 | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 3 | **BLOCKED** |
| `reg210-non-guaranteed-elements` | canonical_source_package | Life Insurance and Annuity Non-Guaranteed Elements | 11 NYCRR Part 48 (Insurance Regulation 210) | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 3 | **BLOCKED** |
| `supporting-vm-batch-013` | planned_batch | batch-013: VM-01: Definitions for Terms in Requirements | 2026 NAIC Valuation Manual | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 98 | **BLOCKED** |
| `supporting-vm-batch-014` | planned_batch | batch-014: VM-02: Minimum Nonforfeiture Mortality and Interest | 2026 NAIC Valuation Manual | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 1 | **BLOCKED** |
| `supporting-vm-batch-015` | planned_batch | batch-015: VM-25: Health Insurance Reserves Minimum Reserve Requirements | 2026 NAIC Valuation Manual | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 1 | **BLOCKED** |
| `supporting-vm-batch-016` | planned_batch | batch-016: VM-26: Credit Life and Disability Reserve Requirements | 2026 NAIC Valuation Manual | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 1 | **BLOCKED** |
| `supporting-vm-batch-017` | planned_batch | batch-017: VM-30: Actuarial Opinion and Memorandum Requirements (scope) | 2026 NAIC Valuation Manual | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 1 | **BLOCKED** |
| `supporting-vm-batch-018` | planned_batch | batch-018: VM-30: Actuarial Opinion and Memorandum Requirements (details) | 2026 NAIC Valuation Manual | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 1 | **BLOCKED** |
| `supporting-vm-batch-019` | planned_batch | batch-019: VM-31: PBR Actuarial Report Requirements (purpose & scope) | 2026 NAIC Valuation Manual | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 1 | **BLOCKED** |
| `supporting-vm-batch-020` | planned_batch | batch-020: VM-31: PBR Actuarial Report Requirements (core report) | 2026 NAIC Valuation Manual | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 1 | **BLOCKED** |
| `supporting-vm-batch-021` | planned_batch | batch-021: VM-31: PBR Actuarial Report Requirements (closing boundary) | 2026 NAIC Valuation Manual | **MISSING** | `HR-MISSING-LOCAL-SOURCE` | 1 | **BLOCKED** |
| `synthetic-pricing-approval-memo` | canonical_source_package | Orion Term Accumulator Approval Memo | Synthetic Pricing Corpus | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 2 | **BLOCKED** |
| `synthetic-pricing-assumption-memo` | canonical_source_package | Orion Term Accumulator Assumption Memo | Synthetic Pricing Corpus | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 2 | **BLOCKED** |
| `synthetic-pricing-pricing-methodology` | canonical_source_package | Orion Term Accumulator Pricing Methodology | Synthetic Pricing Corpus | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 2 | **BLOCKED** |
| `synthetic-pricing-product-specification` | canonical_source_package | Orion Term Accumulator Product Specification | Synthetic Pricing Corpus | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 2 | **BLOCKED** |
| `synthetic-pricing-profitability-study` | canonical_source_package | Orion Term Accumulator Profitability Study | Synthetic Pricing Corpus | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 2 | **BLOCKED** |
| `vm01-definitions` | canonical_source_package | VM-01: Definitions for Terms in Requirements | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 98 | **INGESTIBLE** |
| `vm20-assumptions-section-3c` | canonical_source_package | VM-20 Section 3.C Assumptions | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 4 | **INGESTIBLE** |
| `vm20-canonical-coverage` | canonical_source_package | VM-20 Current Manual Canonical Coverage (Reviewed Wave) | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 52 | **INGESTIBLE** |
| `vm20-framework-boundary` | canonical_source_package | Valuation Manual | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 1 | **INGESTIBLE** |
| `vm20-framework-overview` | canonical_source_package | Valuation Manual | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 1 | **INGESTIBLE** |
| `vm20-practice-note-companion` | canonical_source_package | VM-20 Practice Note Companion Coverage | American Academy of Actuaries practice note, April 2020 | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 175 | **BLOCKED** |
| `vm20-remaining-prose-appendix-coverage` | canonical_source_package | VM-20 Remaining Prose and Appendix Coverage | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 77 | **INGESTIBLE** |
| `vm20-section3c-hierarchical` | canonical_source_package | VM-20 Section 3.C Assumptions (Hierarchical Canonical Slice) | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 14 | **INGESTIBLE** |
| `vm21-current-manual` | canonical_source_package | VM-21: Requirements for Principle-Based Reserves for Variable Annuities | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 78 | **INGESTIBLE** |
| `vm22-current-manual` | canonical_source_package | VM-22: Requirements for Principle-Based Reserves for Non-Variable Annuities | 2026 NAIC Valuation Manual | **QUARANTINED** | `HR-QUARANTINED-PENDING-SME` | 83 | **BLOCKED** |
| `vm30-current-manual` | canonical_source_package | VM-30: Actuarial Opinion and Memorandum Requirements | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 51 | **INGESTIBLE** |
| `vm31-current-manual` | canonical_source_package | VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation | 2026 NAIC Valuation Manual | **ACCEPTED** | `HR-ACCEPTED-PROMOTED` | 84 | **INGESTIBLE** |

---

## 4. Downstream Ingestion & Export Invariant

Downstream Knowledge Assistant RAG strictly filters packages using:
```javascript
const isPromoted = pkg.promotionStatus === 'promoted' && pkg.reviewOnly === false;
```
Any asset marked `QUARANTINED`, `REJECTED`, or `MISSING` is blocked by fail-closed enforcement at both Document Processor and Knowledge Assistant layers.
