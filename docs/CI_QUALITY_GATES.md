# Document Processor — CI Quality Gates & Release Verification

**Version:** 1.0.0  
**Effective Date:** October 28, 2026  
**Scope:** `fongstein1/document-processor`  

---

## 1. Overview & Purpose

The Document Processor serves as the authoritative upstream intake, text extraction, OCR normalization, and segmentation pipeline for the NAIC Valuation Manual ecosystem.

To protect against source contamination, unadopted standard hallucinations, text tampering, and unauthorized distribution of copyrighted materials, all pull requests and pushes to `main` must satisfy the automated quality gates defined herein.

---

## 2. Automated Quality Gates Architecture

The GitHub Actions workflow (`.github/workflows/ci.yml`) executes across Node.js LTS 20.x and 22.x:

| Gate | Execution Command | Invariant Enforced | Release Criterion |
| :--- | :--- | :--- | :---: |
| **Pipeline Regression Suite** | `npm test` | 3,182 assertions across duplicate hashes, edition fences, page locators, phantom section detection, intake ledgers, and promotion decisions. | **Mandatory: 3,182 / 3,182 PASS** |
| **Export Contract Conformance** | `npm run test:contract` | Conformance with `DOWNSTREAM_RAG_EXPORT_CONTRACT.md` v1.0 Locked: 7 mandatory fields, cryptographic `textHash` verification, and valid licensing statuses. | **Mandatory: 100% Validated** |
| **Promotion Boundary Fence** | `scripts/validate_export_contract.mjs` | Exactly 10 promoted packages (460 chunks); exactly 15 quarantined packages (289 chunks); VM-22 strictly quarantined. | **Mandatory: Zero Unpromoted Leaks** |
| **Licensing & File Hygiene** | `scripts/validate_export_contract.mjs` | Verifies no binary artifacts or copyrighted raw PDFs (`*.pdf`) are tracked in git repository. | **Mandatory: Zero Untracked PDFs** |

---

## 3. How to Reproduce and Diagnose Failures Locally

The entire Document Processor test suite is pure native ESM Node.js with zero external npm dependencies. It runs completely offline in under 3 seconds.

### 3.1 Run Complete Pipeline Regression Tests
```bash
npm test
```
*Expected Output:*
```text
ALL REGRESSION SUITES PASSED: 3182/3182 assertions passed (0 failures).
```

### 3.2 Run Downstream Export Contract Validation
```bash
npm run test:contract
```
*Expected Output:*
```text
================================================================================
✓ EXPORT CONTRACT CONFORMANCE VALIDATED: All 749 chunks conform to v1.0 Locked.
================================================================================
```

### 3.3 Diagnostic Guidance
- **AssertionError in Duplicate Hashes:** Indicates a duplicate chunk ID or text hash collision in `data/processed/source_indexes/sources/*.json`. Ensure all chunk slugs are strictly unique within each package.
- **AssertionError in Promotion Decisions:** A package with `promotionStatus === "promoted"` lacks a corresponding signed decision record under `data/manual-input/promotion-decisions/`. All promotions require signed human review.
- **Contract Conformance Mismatch:** If chunk `textHash` does not match `sha256(textExcerpt)`, text was edited without recalculating the hash. Run `npm run source-index:build` to re-synchronize hashes.

---

## 4. GitHub Branch Protection Status

| Repository | Visibility | Account Tier | Branch Protection API Availability | Required Action |
| :--- | :---: | :---: | :---: | :--- |
| `fongstein1/document-processor` | Public | Free / Pro | **Available** | Configure branch protection rule on `main` requiring status check `Pipeline Integrity & Export Contract (Node 20.x)` before merge. |

---

## 5. Maintenance & Governance

- Do not alter chunk text or manifest hashes without updating intake ledgers and promotion decisions.
- Do not commit copyrighted source documents (PDFs) to this repository. All raw PDFs remain quarantined in local authorized intake workstations.
