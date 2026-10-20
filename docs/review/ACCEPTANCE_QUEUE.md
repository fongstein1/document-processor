# NAIC Controlled-Source Pipeline — Acceptance Queue

> [!IMPORTANT]
> **GOVERNANCE & NON-APPROVAL NOTICE**  
> All items in this queue remain strictly **QUARANTINED** pending explicit human review and signed authorization by a qualified actuary / maintainer. **NO AUTOMATED OR AGENT APPROVAL IS PERMITTED.** Downstream Knowledge Assistant RAG is fail-closed and strictly blocks any package not backed by an approved, signed decision record in `data/manual-input/promotion-decisions/`.

---

## 1. Executive Summary & Queue State

As of October 20, 2026, the NAIC Controlled-Source Pipeline distinguishes 77 cataloged assets across four disposition categories:
- **ACCEPTED (Promoted):** 10 canonical source packages (460 chunks), verified against the 2026 NAIC Valuation Manual and backed by signed human promotion records.
- **QUARANTINED (Pending Review):** 41 assets (including VM-22, supporting batches, staged M5 pilot documents, Actuarial Guidelines, state regulations, and practice notes).
- **REJECTED:** 1 asset (unadopted regulatory amendment proposal rejected under the Anti-Fabrication Invariant).
- **MISSING (External Intake Only):** 25 cataloged assets whose physical source files are not present in the local repository checkout.

---

## 2. Prioritized Acceptance Queue

### Queue Priority 1: Candidate Statutory Standard — VM-22 (Non-Variable Annuities)
- **Asset ID:** `vm22-current-manual`
- **Source Index:** `data/processed/source_indexes/sources/vm22-current-manual.json`
- **Volume:** 83 chunks across 17 batches (VM-22 Sections 1 through 6, Requirements, Assumptions, Governance)
- **Governing Standard:** 2026 NAIC Valuation Manual (candidate principle-based reserving framework for non-variable annuities)
- **Current Disposition:** `QUARANTINED`
- **Reason Code:** `HR-QUARANTINED-PENDING-SME`
- **Reviewer Action Items:**
  1. Verify section boundaries and sub-paragraph numbering across Sections 1 to 6.
  2. Confirm precision of dynamic formula expressions and actuarial notation.
  3. Validate that aggregation assumptions for fixed indexed vs. deferred annuities align with statutory definitions.
  4. Author signed decision record `data/manual-input/promotion-decisions/vm22-2026-promotion.json`.

### Queue Priority 2: Supporting Valuation Manual Wave (Batches 013–021)
- **Asset IDs:** `supporting-vm-batch-013` through `supporting-vm-batch-021`
- **Scope:**
  - `batch-013` (VM-01, pp. 25–39): Definitions of Terms in Requirements (98 definitions, canonical index present; sanitized fixture available).
  - `batch-014` (VM-02, pp. 41–44): Minimum Nonforfeiture Mortality and Interest.
  - `batch-015` (VM-25, pp. 319–320): Health Insurance Reserves Minimum Requirements.
  - `batch-016` (VM-26, pp. 321–324): Credit Life and Disability Reserve Requirements.
  - `batch-017` & `batch-018` (VM-30, pp. 325–339): Actuarial Opinion and Memorandum (AOM) Reporting Scope & Detail.
  - `batch-019`, `batch-020`, `batch-021` (VM-31, pp. 341–386): PBR Actuarial Report Requirements (Purpose, Core Detail, Closing Boundary).
- **Current Disposition:** `QUARANTINED` / `MISSING` (offline extraction dependent)
- **Reason Code:** `HR-QUARANTINED-PENDING-SME`
- **Reviewer Action Items:**
  1. Acquire physical source files for offline extraction or verify against sanitized fixtures.
  2. For VM-01: review and ratify 11 spacing-only text-layer extraction normalizations.
  3. For VM-30/31: confirm boundaries to prevent overlapping chunk citations before promotion.

### Queue Priority 3: M5 Scale Pilot Staged Documents (25 Assets)
- **Asset Scope:** 25 staged documents in `data/work/staging/staging_manifest.json` (7,508 chunks total).
- **Representative Documents:**
  - `DOC-NAIC-APP-MANUAL-2026`: Accounting Practices & Procedures Manual Overview (322 chunks).
  - `DOC-NAIC-ASB-XREF-LIFE`: ASB Standards of Practice Cross-Reference (472 chunks).
  - `DOC-NAIC-MODEL-820-SVL`: Standard Valuation Law Model #820 (148 chunks).
  - `DOC-NAIC-MODEL-REG-XXX`: Valuation of Life Insurance Policies Model Reg #830 (212 chunks).
  - `DOC-NAIC-AG-049-ILLUS`: Actuarial Guideline XLIX Life Illustrations (184 chunks).
- **Current Disposition:** `QUARANTINED`
- **Reason Code:** `HR-QUARANTINED-STAGED-PENDING-REVIEW`
- **Reviewer Action Items:**
  1. Determine whether each document is binding statutory law, model guidance, or supplementary reference.
  2. Perform sampling spot-checks on paragraph coordinates and section headings.
  3. Verify licensing rights for internal POC vs. wider dissemination.

### Queue Priority 4: Actuarial Guidelines (AG Single-Page Interpretive Slices)
- **Asset Scope:** 8 canonical packages (`ag01`, `ag03`, `ag36`, `ag37`, `ag38`, `ag43`, `ag48`, `ag49`).
- **Current Disposition:** `QUARANTINED`
- **Reason Codes:** `HR-QUARANTINED-OCR-NOISY` (noisy character encoding) / `HR-QUARANTINED-NO-STABLE-LINES`
- **Reviewer Action Items:**
  1. Review page-image backstops against extracted OCR text.
  2. Flag character encoding dropouts (e.g. ligature splitting, superscripts, table column alignment).
  3. Promote only after verifying OCR fidelity exceeds 99.5% token accuracy.

### Queue Priority 5: State-Specific Insurance Regulations
- **Asset Scope:** NY Regulation 126 (`reg126`), Regulation 147 (`reg147`), Regulation 213 (`reg213`).
- **Current Disposition:** `QUARANTINED`
- **Reason Code:** `HR-QUARANTINED-PENDING-SME`
- **Reviewer Action Items:**
  1. Ensure clear jurisdiction tags (`jurisdiction: "NY"`) so state law does not cross-contaminate uniform NAIC model law.
  2. Review relationship registry links between NY Reg 213 and VM-20 / AG 43.

### Queue Priority 6: Non-Binding Educational Guidance & Practice Notes
- **Asset Scope:** `actuarial-memorandum-practice-note`, `cia-2022-capital-fct-educational-note`, `cia-2023-fct-educational-note`.
- **Current Disposition:** `QUARANTINED`
- **Reason Code:** `HR-QUARANTINED-EDUCATIONAL-NOT-STATUTORY`
- **Reviewer Action Items:**
  1. Confirm strict `reviewOnly: true` status.
  2. Ensure downstream RAG queries for binding legal requirements do NOT return practice note text as statutory authority.

---

## 3. Rejected Assets (Permanent Quarantine)

### Unadopted Proposals / Future Amendments
- **Asset ID:** `doc-ap-vm22-2024` (and any future unadopted exposure drafts)
- **Title:** NAIC LATF VM-22 Principle-Based Reserving Framework Exposure Draft (2024 Proposal)
- **Current Disposition:** **`REJECTED`**
- **Reason Code:** **`HR-REJECTED-UNADOPTED-EDITION`**
- **Enforcement:** Strictly barred from promotion and downstream RAG under the **Anti-Fabrication Invariant**. Prospective rules cannot be cited as governing law.

---

## 4. SME Reviewer Checklist

For each candidate asset under review, the human SME must verify and sign off on all five criteria:

1. [ ] **Edition Verification:** Confirm the asset text matches the active governing standard (`2026 NAIC Valuation Manual` or explicitly designated historical/state edition). Reject draft or unadopted texts.
2. [ ] **Locators & Boundaries:** Confirm starting and ending page numbers, section headers, and paragraph coordinates. Verify that no chunks bleed into adjacent chapters.
3. [ ] **Text Quality & Fidelity:** Confirm OCR quality is clean. Spot-check formulas, mathematical symbols, footnotes, and tabular structures against original PDF images.
4. [ ] **Statutory Authority Classification:** Designate whether the asset is `STATUTORY_BINDING` (e.g. VM-20, VM-21), `INTERPRETIVE_GUIDELINE` (e.g. AGs), `STATE_REGULATION` (e.g. NY Reg 213), or `NON_BINDING_EDUCATIONAL` (e.g. Practice Notes).
5. [ ] **Promotion Decision Record:** Execute a signed JSON promotion decision in `data/manual-input/promotion-decisions/`.

---

## 5. Promotion Sign-off Protocol

To promote an asset from `QUARANTINED` to `ACCEPTED`, the SME must:
1. Create a JSON record: `data/manual-input/promotion-decisions/<sourceId>-promotion.json`
2. Follow this mandatory structure:
```json
{
  "schemaVersion": "1.0",
  "promotionDecisionId": "vm22-2026-promotion",
  "decisionDate": "2026-10-XX",
  "decision": "promote",
  "reviewer": "Reviewer Name, FSA, MAAA",
  "reviewerRole": "Qualified Actuary / NAIC SME",
  "scope": {
    "sourceIds": ["vm22-current-manual"],
    "edition": "2026 NAIC Valuation Manual",
    "verifiedPageRange": { "start": 245, "end": 318 }
  },
  "qaVerification": {
    "ocrFidelityVerified": true,
    "paragraphCoordinatesVerified": true,
    "formulaIntegrityVerified": true,
    "bindingClassification": "STATUTORY_BINDING"
  },
  "rationale": "Full actuarial review completed. Chunk boundaries verified against 2026 NAIC Valuation Manual publication."
}
```
3. Update `repository-manifest.json` setting `promotionStatus: "promoted"` and `reviewOnly: false`.
4. Re-run `node scripts/build_intake_review_ledger.mjs` to update the authoritative ledger.
