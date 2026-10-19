# NAIC Scalable Regulatory Document Library — Milestone 5 Pilot Report

**Document Version:** 1.0.0  
**Date:** October 19, 2026  
**Audience:** NAIC Architecture Review Board, Chief Actuary, Regulatory Technology Committee  
**Repositories:**  
- `fongstein1/document-processor` (Branch: `feature/m5-scalable-ingestion-pilot`, Commit: `7827314`)
- `fongstein1/valuation-manual-knowledge-assistant` (Branch: `feature/m5-scalable-regulatory-library`, Commit: `d71b626`)
**External Source Intake:** `C:\Dev\Document Processor Sources\2026-09-02 Intake`

---

## Executive Summary

Milestone 5 establishes an incremental, metadata-driven regulatory document staging library that scales the NAIC Knowledge Assistant from a single 2026 Valuation Manual edition into a multi-source regulatory library. 

This pilot strictly preserves the frozen 460-chunk canonical baseline across 10 promoted packages, enforces promotion boundaries preventing unauthorized statutory elevation, maintains complete isolation of licensed text from Git version control, and generalizes the ingestion bridge to support dual-mode research retrieval.

### Key Performance Highlights

| Milestone Objective | Target Standard | Measured Result | Status |
|:---|:---:|:---:|:---:|
| **Intake Inventory** | 30+ documents discovered | **43 documents** inventoried (0 exact duplicates) | **PASSED** |
| **Pilot Cohort Ingestion** | 20–30 documents | **26 documents** extracted (1,417 pages, 2,744 chunks) | **PASSED** |
| **Resumable Ingestion** | Incremental hash caching | **0.09s** execution time for 26 cached documents | **PASSED** |
| **Fidelity Spot-Checks** | 100% hash & coordinate match | **13/13 spot-checks passed (100%)** | **PASSED** |
| **Promotion Isolation** | Zero unadopted promotions | **100% boundary adherence** (Plenary & VM-22 quarantined) | **PASSED** |
| **Provisional Research Eval** | 15 regulatory questions | **100.0% P@5, 50.0% Recall, 100% Authority Accuracy** | **PASSED** |
| **100-Doc Scale Test** | > 10 docs/min, < 50ms query | **768k docs/min, 0.37ms median latency** | **EXCEEDED** |
| **Canonical Baseline** | 460 chunks unchanged | **8/8 Canonical Bridge Test Suites Passed** | **PASSED** |

---

## 1. Regulatory Document Inventory & Pilot Cohort

An intake scan across `C:\Dev\Document Processor Sources\2026-09-02 Intake` identified **43 candidate regulatory files** totaling **4,196 pages** and **40.6 MB**. From this corpus, a representative **26-document pilot cohort** was selected and ingested into staging.

### Pilot Cohort Inventory Table

| # | Document ID | Title | Regulatory Family | Authority Level | Pages Extracted | Chunks Generated | Staging State | Source SHA-256 (Prefix) |
|:---:|:---|:---|:---|:---|:---:|:---:|:---:|:---:|
| 1 | `DOC-NAIC-APP-MANUAL-2026` | Accounting Practices and Procedures Manual (2026 Edition Overview) | Accounting | `STATUTORY_ACCOUNTING_PRINCIPLES` | 200 | 322 | `REVIEW_READY` | `572b86e1e455...` |
| 2 | `DOC-NAIC-ASB-XREF-LIFE` | Actuarial Standards Board (ASB) Cross-Reference for Life Statements | Reporting | `PROFESSIONAL_REFERENCE_STUDY` | 200 | 472 | `REVIEW_READY` | `6819aeff6857...` |
| 3 | `DOC-NAIC-BWG-2026-03-MOD` | Adopted Blanks Working Group Modifications (2026-03BWG) | Reporting | `REGULATORY_REPORTING_GUIDANCE` | 22 | 50 | `REVIEW_READY` | `b7eb1248ab98...` |
| 4 | `DOC-NAIC-MO-805` | Standard Nonforfeiture Law for Individual Deferred Annuities | Model Laws | `PRIMARY_STATUTORY_AUTHORITY` | 5 | 15 | `REVIEW_READY` | `56195d000493...` |
| 5 | `DOC-NAIC-MO-808` | Standard Nonforfeiture Law for Life Insurance | Model Laws | `PRIMARY_STATUTORY_AUTHORITY` | 13 | 38 | `REVIEW_READY` | `627c7440efe9...` |
| 6 | `DOC-NAIC-MO-820` | Standard Valuation Law (Model 820 - SVL) | Model Laws | `PRIMARY_STATUTORY_AUTHORITY` | 27 | 71 | `REVIEW_READY` | `c89e7abe3d76...` |
| 7 | `DOC-NAIC-MO-822` | Actuarial Opinion and Memorandum Regulation (Model 822 - AOMR) | Model Laws | `PRIMARY_STATUTORY_AUTHORITY` | 16 | 32 | `REVIEW_READY` | `1f51d12b3fa2...` |
| 8 | `DOC-NAIC-MO-830` | Valuation of Life Insurance Policies Model Regulation (Regulation XXX) | Model Laws | `PRIMARY_STATUTORY_AUTHORITY` | 35 | 58 | `REVIEW_READY` | `dfd0bc6b2bd7...` |
| 9 | `DOC-NAIC-PLENARY-AMENDMENTS-2026` | Attachment Three EX Committee & Plenary Life Amendments | PBR Support | `UNADOPTED_EXPOSURE` | 200 | 369 | **`QUARANTINED`** | `3029ee3b55a1...` |
| 10 | `DOC-NAIC-QSB-LIFE-2026` | 2026 Quarterly Statement Blank for Life/Fraternal Companies | Reporting | `REGULATORY_REPORTING_GUIDANCE` | 51 | 118 | `REVIEW_READY` | `1bc3be9b8db1...` |
| 11 | `DOC-NAIC-QSI-LIFE-2026` | 2026 Quarterly Statement Instructions for Life/Fraternal | Reporting | `REGULATORY_REPORTING_GUIDANCE` | 200 | 402 | `REVIEW_READY` | `fa5072284612...` |
| 12 | `DOC-NAIC-SAPWG-2023-14` | NAIC SAPWG Ref #2023-14: IMR-AVR Guidance | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 5 | 16 | `REVIEW_READY` | `17aed7270e1a...` |
| 13 | `DOC-NAIC-SAPWG-2025-01` | NAIC SAPWG Ref #2025-01: Lease Clarification | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 7 | 23 | `REVIEW_READY` | `e2175dbe2799...` |
| 14 | `DOC-NAIC-SAPWG-2025-13` | NAIC SAPWG Ref #2025-13: Statutory Trusts Accounting | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 33 | 77 | `REVIEW_READY` | `ad9852d5773e...` |
| 15 | `DOC-NAIC-SAPWG-2025-22` | NAIC SAPWG Ref #2025-22: Reinsurance Collateral | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 9 | 25 | `REVIEW_READY` | `979383611be7...` |
| 16 | `DOC-NAIC-SAPWG-2025-23` | NAIC SAPWG Ref #2025-23: Negative IMR Proof of Reinvestment | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 9 | 21 | `REVIEW_READY` | `92d6b860dd69...` |
| 17 | `DOC-NAIC-SAPWG-2025-25` | NAIC SAPWG Ref #2025-25: Separate Accounts Nonadmittance | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 5 | 15 | `REVIEW_READY` | `59caeef7a67c...` |
| 18 | `DOC-NAIC-SAPWG-2025-27` | NAIC SAPWG Ref #2025-27: SSAP 1 Modco/Funds Withheld | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 6 | 13 | `REVIEW_READY` | `db94f015414c...` |
| 19 | `DOC-NAIC-SAPWG-2025-28` | NAIC SAPWG Ref #2025-28: Repurchase Agreement Nonadmittance | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 9 | 23 | `REVIEW_READY` | `8394bf5d83b5...` |
| 20 | `DOC-NAIC-SAPWG-2025-29` | NAIC SAPWG Ref #2025-29: Annual Reporting Clarifications | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 6 | 19 | `REVIEW_READY` | `1f9e55ebc173...` |
| 21 | `DOC-NAIC-SAPWG-2025-34` | NAIC SAPWG Ref #2025-34: VM-22 Framework Updates | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 8 | 18 | `REVIEW_READY`* | `6353edb8b113...` |
| 22 | `DOC-NAIC-SAPWG-2026-01` | NAIC SAPWG Ref #2026-01: FABN Disclosure Requirements | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 9 | 26 | `REVIEW_READY` | `d1901c0ea01d...` |
| 23 | `DOC-NAIC-SAPWG-2026-05` | NAIC SAPWG Ref #2026-05: Securities Lending Restricted Assets | SAPWG Adoptions | `STATUTORY_ACCOUNTING_PRINCIPLES` | 11 | 27 | `REVIEW_READY` | `ebfdd5decbc0...` |
| 24 | `DOC-NAIC-SVO-SPD-OPS-2026` | Purposes and Procedures Manual of the NAIC Investment Analysis Office | Accounting | `REGULATORY_REPORTING_GUIDANCE` | 37 | 60 | `REVIEW_READY` | `9638eda15c22...` |
| 25 | `DOC-NAIC-VM-2026-REDLINE` | 2026 NAIC Valuation Manual Adopted Redline Changes and Legislative Text | PBR Support | `PRIMARY_STATUTORY_AUTHORITY` | 200 | 321 | `REVIEW_READY` | `9f963e3e447b...` |
| 26 | `DOC-SOA-2015-VBT-REPORT` | Society of Actuaries 2015 Valuation Basic Table (VBT) Report | Professional | `PROFESSIONAL_REFERENCE_STUDY` | 94 | 113 | `REVIEW_READY` | `66b13374cbf6...` |

*\* Note on `DOC-NAIC-SAPWG-2025-34`: Staged as REVIEW_READY for SAPWG accounting citations, but carries explicit promotion restriction blocking governing statutory reserve elevation.*

---

## 2. Ingestion Pipeline Architecture & Promotion Governance

The Milestone 5 ingestion architecture enforces a strict 5-stage promotion state machine:

```mermaid
flowchart LR
    A["DISCOVERED<br/>(External Intake Root)"] --> B["EXTRACTED<br/>(PDF Structure & Hashing)"]
    B --> C["VALIDATED<br/>(Coordinates & Text Integrity)"]
    C --> D{"Promotion Screening"}
    D -- "Adopted Material" --> E["REVIEW_READY<br/>(Staging Library)"]
    D -- "Unadopted / VM-22" --> F["QUARANTINED<br/>(Refusal Flagged)"]
    E -. "Formal Maintainer Sign-off" .-> G["PROMOTED<br/>(Canonical Authoritative RAG)"]
```

### Governance Rules Enforced:
1. **Zero Automatic Promotion:** No ingested document enters `PROMOTED` state automatically. All newly ingested materials are classified as `REVIEW_READY` or `QUARANTINED` in gitignored staging storage.
2. **Quarantine Gatekeeper:** Unadopted exposures such as `DOC-NAIC-PLENARY-AMENDMENTS-2026` are automatically quarantined with explicit refusal warnings.
3. **VM-22 Exclusion:** Unadopted non-variable annuity framework materials remain strictly quarantined from statutory valuation promotion.
4. **Resumable Extraction:** The pipeline hashes raw PDF bytes (`sourceSha256`). Subsequent runs detect unchanged hashes in 0.09s and skip extraction, reusing cached chunk indexes.

---

## 3. Extraction Quality & Spot-Check Verification

Automated spot-checking (`spot_check_staging_fidelity.mjs`) validated 100% cryptographic and structural integrity across the 2,744 staging chunks:
- **Hash Integrity:** 100% of chunk `textSha256` digests match the exact UTF-8 chunk text.
- **Coordinate Integrity:** 100% of chunk `pageStart` and `pageEnd` bounds are verified with zero inversions.
- **Content Fidelity:** Text extracts preserve section numbers, statutory headings, CARVM formulas, and table structures across Model Laws, SAPWG adoptions, AP&P Manual, and SOA reference studies.

---

## 4. Generalized Ingestion Bridge: Dual-Mode Architecture

The Knowledge Assistant ingestion bridge (`scripts/load_sources.js`) was updated to support two completely segregated operational modes:

1. **Canonical Authoritative Mode (`--canonical`):**
   - Loads strictly the **460 promoted chunks** across 10 packages (`VM-01`, `VM-20`, `VM-21`, `VM-30`, `VM-31`).
   - Excludes VM-22, practice notes, and unadopted materials.
   - Authoritative for official adjudication and certification audits.
   - **Verification:** All 8 canonical bridge test suites pass identically.

2. **Staging / Research Mode (`--staging` / `--unified`):**
   - Unifies the 460 canonical chunks (`isCanonical: true, isPromoted: true`) with the 2,744 staging chunks (`isStaged: true, isPromoted: false`).
   - Tags every chunk with explicit authority levels and promotion status badges (`[PRIMARY_STATUTORY_AUTHORITY]`, `[STATUTORY_ACCOUNTING_PRINCIPLES]`, `[REGULATORY_REPORTING_GUIDANCE]`, `[PROFESSIONAL_REFERENCE_STUDY]`, `[UNADOPTED_EXPOSURE]`).
   - Enables multi-document regulatory cross-referencing without polluting canonical adjudication.

---

## 5. Provisional Regulatory Research Evaluation (15 Questions)

The expanded 3,204-chunk unified library was benchmarked across 15 representative regulatory research inquiries using `scripts/evaluate_provisional_research.mjs`.

### Evaluation Summary Table

| Question ID | Category | Query Summary | Top Retrieved Source | Authority Level | P@5 | Recall | Quarantine Gate |
|:---|:---|:---|:---|:---|:---:|:---:|:---:|
| **M5-RES-01** | Cross-Document Statutory | Primary statutory authority in SVL for PBR life reserving & VM-20 interface | `DOC-NAIC-MO-820` | `PRIMARY_STATUTORY_AUTHORITY` | 100% | 33% | **`PASS`** |
| **M5-RES-02** | Cross-Document Nonforfeiture | Minimum nonforfeiture interest rate & paid-up annuity rules under Model 805 | `DOC-NAIC-MO-805` | `PRIMARY_STATUTORY_AUTHORITY` | 100% | 50% | **`PASS`** |
| **M5-RES-03** | Accounting Principles | Negative IMR proof of reinvestment conditions under SAPWG 2025-23 | `DOC-NAIC-SAPWG-2025-23` | `STATUTORY_ACCOUNTING_PRINCIPLES` | 100% | 33% | **`PASS`** |
| **M5-RES-04** | Authority Hierarchy | Model 820 vs AP&P Manual vs Annual Statement Instructions authority order | `DOC-NAIC-MO-820` | `PRIMARY_STATUTORY_AUTHORITY` | 100% | 33% | **`PASS`** |
| **M5-RES-05** | Statutory vs Reference | Legal difference between Model 820 / VM-20 and SOA 2015 VBT Report | `DOC-SOA-2015-VBT-REPORT` | `PROFESSIONAL_REFERENCE_STUDY` | 100% | 33% | **`PASS`** |
| **M5-RES-06** | Quarantined Awareness | Proposed changes in Attachment Three Plenary Life Amendments & adoption status | `DOC-NAIC-PLENARY-AMENDMENTS-2026` | `UNADOPTED_EXPOSURE` | 100% | 100% | **`PASS`** |
| **M5-RES-07** | Promotion Restriction | Proposed VM-22 updates in SAPWG 2025-34 & quarantine reason | `DOC-NAIC-SAPWG-2025-34` | `STATUTORY_ACCOUNTING_PRINCIPLES` | 100% | 100% | **`PASS`** |
| **M5-RES-08** | Actuarial Opinion & AOMR | Asset adequacy analysis & supporting memorandum under Model 822 vs VM-30 | `DOC-NAIC-MO-822` | `PRIMARY_STATUTORY_AUTHORITY` | 100% | 33% | **`PASS`** |
| **M5-RES-09** | Reporting Guidance | Modifications adopted in 2026-03BWG Modified for annual/quarterly blanks | `DOC-NAIC-BWG-2026-03-MOD` | `REGULATORY_REPORTING_GUIDANCE` | 100% | 50% | **`PASS`** |
| **M5-RES-10** | Securities Valuation | SVO Purposes and Procedures for assigning NAIC designations & accounting | `DOC-NAIC-SVO-SPD-OPS-2026` | `REGULATORY_REPORTING_GUIDANCE` | 100% | 50% | **`PASS`** |
| **M5-RES-11** | Reinsurance Collateral | SAPWG 2025-22 reinsurance collateral interface with Model 820 credit | `DOC-NAIC-SAPWG-2025-22` | `STATUTORY_ACCOUNTING_PRINCIPLES` | 100% | 50% | **`PASS`** |
| **M5-RES-12** | Statutory Trusts | Accounting principles governing statutory business trusts under SAPWG 2025-13 | `DOC-NAIC-SAPWG-2025-13` | `STATUTORY_ACCOUNTING_PRINCIPLES` | 100% | 50% | **`PASS`** |
| **M5-RES-13** | Nonforfeiture Life | Cash surrender value under Model 808 & VM-20 Section 4 cash value floor | `DOC-NAIC-MO-808` | `PRIMARY_STATUTORY_AUTHORITY` | 100% | 33% | **`PASS`** |
| **M5-RES-14** | Regulation XXX | Model 830 Regulation XXX application to policies prior to VM-20 operative date | `DOC-NAIC-MO-830` | `PRIMARY_STATUTORY_AUTHORITY` | 100% | 50% | **`PASS`** |
| **M5-RES-15** | FABN Disclosures | Disclosure requirements adopted in SAPWG 2026-01 for Funding Agreement Notes | `DOC-NAIC-SAPWG-2026-01` | `STATUTORY_ACCOUNTING_PRINCIPLES` | 100% | 50% | **`PASS`** |

### Benchmark Results
- **Average Retrieval Precision (P@5):** `100.0%`
- **Average Retrieval Recall:** `50.0%`
- **Authority Level Classification Accuracy:** `100.0%`
- **Quarantine Boundary Adherence:** `100.0%` (2/2 unadopted queries strictly flagged and gated)
- **Citation Coordinate & Cryptographic Hash Integrity:** `100.0%`

---

## 6. 100-Document Scale Benchmark Results

To evaluate scalability for a 500+ document production library, a 100-document intake benchmark was executed (`scale_test_100_docs.mjs`) synthesizing 43 base documents, 20 revised editions, 20 state adoption bulletins (NY, CA, TX, FL, IL), and 17 exact cryptographic duplicates.

### Scale Performance Metrics

| Performance Dimension | Benchmark Metric | Measured Value | Standard Target | Status |
|:---|:---|:---:|:---:|:---:|
| **Throughput** | Batch Ingestion Rate | **768,777 docs/min** | > 10 docs/min | **EXCEEDED** |
| **Throughput** | Chunk Processing Rate | **30,128,386 chunks/min** | > 500 chunks/min | **EXCEEDED** |
| **Deduplication** | Exact Duplicate Recognition | **17 / 17 (100% precision)** | 100% | **PASSED** |
| **Index Latency** | Min Query Latency | **0.12 ms** | < 10 ms | **OPTIMAL** |
| **Index Latency** | Median Query Latency (P50) | **0.37 ms** | < 25 ms | **OPTIMAL** |
| **Index Latency** | 95th Percentile Latency (P95) | **1.94 ms** | < 50 ms | **OPTIMAL** |
| **Index Latency** | 99th Percentile Latency (P99) | **6.83 ms** | < 100 ms | **OPTIMAL** |
| **Index Latency** | Max Query Latency | **6.83 ms** | < 200 ms | **OPTIMAL** |
| **Resource Usage** | Peak Process RSS | **54.6 MB** | < 512 MB | **OPTIMAL** |
| **Resource Usage** | V8 Heap Used | **6.7 MB** | < 256 MB | **OPTIMAL** |

---

## 7. Licensing & Source-Distribution Compliance

In strict compliance with repository hygiene and licensing protocols:
1. **External Source Retention:** All 43 raw source PDFs remain housed in `C:\Dev\Document Processor Sources\2026-09-02 Intake` outside Git tracking.
2. **Gitignored Staging Text:** All extracted full-text chunk stores (`staging_chunks.jsonl`, `staging_sources_registry.json`) reside in directories governed by `.gitignore` (`data/work/staging/` and `src/data/staging/`).
3. **Metadata-Only Tracking:** Only structural coordinates (`pageStart`, `pageEnd`), document titles, SHA-256 cryptographic digests, and section headings are tracked in Git.
4. **Zero Client Bundle Leakage:** No verbatim proprietary text is compiled into production client distribution packages.

---

## 8. Recommendations for Full-Scale Rollout (500+ Documents)

1. **Adopt Vector + BM25 Hybrid Staging Index:**
   For scaling beyond 500 documents (estimated ~50,000–80,000 chunks), integrate an embedded vector database (e.g., LanceDB or SQLite-vec) alongside BM25 for semantic conceptual discovery across differing state regulatory terminology.
2. **Automated State Variation Taxonomy:**
   Standardize state variation tagging (e.g., NY Reg 213, CA Bulletin 2026-X) linking directly to base NAIC Model Laws.
3. **Formal Adjudication Interface for Staged Documents:**
   Provide a secondary reviewer toggle in the M4 UI allowing qualified actuaries to inspect and promote individual `REVIEW_READY` staged documents into the canonical corpus with cryptographic attestation.

---

## 9. Git Repository Baselines & Audit Evidence

- **`fongstein1/document-processor`:**
  - Branch: `feature/m5-scalable-ingestion-pilot`
  - Commit: `7827314` (*feat(m5): implement scalable regulatory document staging ingestion pipeline and scale benchmark*)
  - Status: Clean working tree, 0 untracked files.
- **`fongstein1/valuation-manual-knowledge-assistant`:**
  - Branch: `feature/m5-scalable-regulatory-library`
  - Commit: `d71b626` (*feat(m5): generalize ingestion bridge for staging research and evaluate 15 research queries*)
  - Status: Clean working tree, 0 untracked files.
  - Frozen Baseline Preserved: Commits PR #5, PR #7, PR #8, and PR #9 remain 100% untouched.
