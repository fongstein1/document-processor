# VM-22 Current-Manual Canonicalization Execution Spec

Status: ready for local execution
Source family: 2026 NAIC Valuation Manual
Target source ID: `vm22-current-manual`
Governance target: `review_only / not_promoted`

## Purpose

Canonicalize the already reviewed 2026 VM-22 extraction wave into the generic current-manual parent/child architecture. VM-22 is the final high-touch proving source before a controlled 20–50 document batch pilot. Do not re-extract authoritative text unless the retained batches fail deterministic source-fidelity checks.

## Authoritative source boundary

Use the established authoritative 2026 Valuation Manual source:

- filename: `pbr_data_valuation_manual_2026.pdf`
- SHA-256: `496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9`
- VM-22 physical PDF pages: **227–318 inclusive**
- printed VM-22 pages: **22-1 through 22-92**
- physical page 318 / printed 22-92 is intentionally blank
- physical page 319 begins VM-25 and must remain out of scope

The existing tracked review index `docs/review/vm22_review_index.md` records complete review-only extraction coverage in batches `batch-038` through `batch-054`.

## Existing batch coverage

Reuse the retained batch extraction outputs and manifests:

- 038: pp. 227–231 — Background and Scope
- 039: pp. 232–237 — Reserve Methodology
- 040: pp. 238–242 — DR/SR projection entry
- 041: pp. 243–247 — asset projection and NAER
- 042: pp. 248–250 — Reinsurance
- 043: pp. 251–253 — Standard Projection Amount overview
- 044: pp. 254–257 — SPA contract mechanics
- 045: pp. 258–261 — SPA lapse and rate factors
- 046: pp. 262–267 — SPA mortality tables I
- 047: pp. 268–279 — SPA mortality tables II and Section 7 boundary
- 048: pp. 280–286 — stochastic exclusion and single-scenario testing
- 049: pp. 287–290 — scenario generation
- 050: pp. 291–297 — future non-index-credit hedging strategy
- 051: pp. 298–304 — contract-holder behavior assumptions
- 052: pp. 305–308 — mortality assumptions
- 053: pp. 309–313 — other assumptions
- 054: pp. 314–318 — contract allocation and closing boundary

Reconcile overlaps deterministically, exactly as the VM-21 generic loader now does. Duplicate page content must be exactly equal or validation must stop.

## Structural target

Use hierarchical structure-aware chunking. Prefer complete source subsections over fixed token windows.

Expected parent layer:

1. chapter opening / table of contents
2. Section 1 — Background
3. Section 2 — Scope and Effective Date
4. Section 3 — Reserve Methodology
5. Section 4 — Determination of the DR and SR
6. Section 5 — Reinsurance
7. Section 6 — Requirements for the Standard Projection Amount
8. Section 7 — Stochastic Exclusion and Single Scenario Testing
9. Section 8 — Scenario Generation
10. Section 9 — Modeling Hedges under a Future Non-Index Credit Hedging Strategy
11. Section 10 — Guidance and Requirements for Setting Contract Holder Behavior Prudent Estimate Assumptions
12. Section 11 — Guidance and Requirement(s) for Setting Prudent Estimate Mortality Assumptions
13. Section 12 — Other Guidance and Requirements for Assumptions
14. Section 13 — Allocation of Aggregate Reserves to the Contract Level
15. closing boundary / intentional blank 22-92

At the child layer, retain complete lettered provisions and all nested numbered/lettered content, Guidance Notes, formulas, qualifications, exceptions, and governing table text. Do not split a requirement from its exception or qualification simply to hit a token target.

Known major child boundaries include:

- Section 1: A Purpose; B Principles; C Risks Reflected and Risks Not Reflected; D Materiality
- Section 2: A Scope; B Effective Date & Transition
- Section 3: A Aggregate Reserve; B Impact of Reinsurance Ceded; C Additional Standard Projection Amount; D SR; E DR; F Aggregation of Contracts for DR and SR; G Stochastic Exclusion Test; H Allocation of Aggregate Reserve to Contracts; I Prudent Estimate Assumptions; J Approximations/Simplifications/Modeling Efficiency; K Prior Valuation Date
- Section 4: A Projection of Accumulated Deficiencies; B Determination of Scenario Reserve; C Projection Scenarios; D Projection of Assets; E Projection of Annuitization Benefits; F Frequency of Projection; G Compliance with ASOPs
- Section 5: A Treatment of Reinsurance in the Aggregate Reserve
- Section 6: A Overview; B Additional Standard Projection Amount; C Prescribed Assumptions
- Section 7: A Stochastic Exclusion Test Requirement Overview; B Requirements to Pass the Stochastic Exclusion Tests; C Stochastic Exclusion Ratio Test; D Stochastic Exclusion Demonstration Test; E Single Scenario Test
- Section 8: A General; B Prescribed Interest Rate Scenario Generator; C Prescribed Total Investment Return Scenario Generator; D Implied Volatility Scenarios; E Use of Non-Prescribed Scenario Generators; F Number of Scenarios
- Section 9: A Initial Considerations; B Modeling Approaches; C Calculation of SR (Reported); D Additional Considerations for CTE 70 / best efforts as source-labeled; E Specific Considerations and Requirements
- Sections 10–12: preserve the explicit source lettered boundaries; use the VM-21 analog only as a structural aid, not as source authority
- Section 13: preserve at minimum A contract reserve/allocation framing; B Scenario APV/NAER; C Minimum Allocation Value (MAV); D Allocated Excess Reserve (AER), using the exact source headings actually present in the retained extraction

If any listed heading differs from retained source text, the retained source controls. Do not rewrite source headings to match this planning document.

## High-risk semantic controls

### 1. Current versus future/referral language

Section 3.C contains a Guidance Note quoting an April 3, 2025 LATF referral concerning enhanced Standard Projection Amount disclosures intended for a later effective cycle. The source itself distinguishes those later changes from the Valuation Manual effective 1/1/2026.

The processor must:

- retain that source text exactly;
- classify it as guidance/referral/future-context as appropriate;
- NOT convert referral directives or intended later changes into current 2026 operative VM-22 requirements;
- ensure current-law retrieval does not use future/referral language as the sole support for a current formal requirement.

Add a generic regression if the existing current/future authority controls do not already prove this boundary.

### 2. Definitions

Do not recreate VM-01 definitions merely because VM-22 uses defined terms. Only populate VM-22 `definedTerms` where VM-22 itself expressly defines a term. Generated normalization belongs in retrieval metadata, not authoritative defined-term arrays.

### 3. Requirement inflation

Apply the generic `preserveEmptyRequirements` behavior and canonical-package semantic validator. Purpose, background, definition, or guidance text must not acquire freestanding requirements merely because obligation terminology appears inside quoted/contextual material.

### 4. Structured evidence

Sections 6, 7, 8, 9, 10–12, and 13 contain tables, factors, matrices, formulas, or calculation sequences. Create source-bound structured-evidence review records where useful, but do not numerically reinterpret or promote normalized structured values in this milestone unless they can be independently verified.

Exact source text remains authoritative for this candidate.

### 5. Cross-source authority

A request for a formal VM-22 requirement requires relevant actual VM-22 evidence. VM-20, VM-21, VM-31, VM-A, VM-C, VM-M, VM-V, Model #820, Accounting Practices and Procedures Manual material, and other related sources may be cross-references but cannot substitute for requested VM-22 authority.

## Relationship candidates

Create only conservative explicit-source-reference candidates. Preserve literal source-facing labels separately from canonical target IDs/labels. Keep every candidate `pending / review_only / not_promoted` and do not infer hierarchy, supersession, equivalence, or legal effect.

Likely targets include VM-01, VM-31, VM-A, VM-C, VM-M, VM-V, Model #820, Appendix 1 of VM-20, ASOPs/ASB, the Accounting Practices and Procedures Manual / Appendix A-791, and current NAIC scenario-generator references where literally present.

## Focused retrieval evaluation

Build a case-level evaluation using actual VM-22 content. Include at least:

- scope and transition/effective date
- aggregate reserve structure
- SR versus DR path
- reserving-category aggregation
- longevity-reinsurance reserve floor
- pre/post reinsurance treatment
- Standard Projection Amount / CTEPA
- stochastic exclusion overview
- SERT
- demonstration/certification path
- Single Scenario Test
- scenario generation
- non-prescribed scenario generator
- hedging/future hedging strategy
- contract-holder behavior prudent-estimate assumptions
- mortality/credibility
- other assumptions/margins/expenses
- contract-level allocation / MAV / AER / Scenario APV
- structured/table or formula evidence
- current-versus-future/referral question
- wrong-manual unsupported request
- unavailable/future-version request
- ambiguous request

Do not tune retrieval merely to obtain perfect top-1. Strict top-3 evidence safety is the important threshold.

## Generic support-gate regression

Create four inspectable cases that exercise `assessFormalRequirementEvidenceSufficiency` or the current generic equivalent:

1. related other-manual evidence cannot support a requested VM-22 formal requirement;
2. correct VM-22 evidence at rank 4 is outside the production evidence window;
3. correct VM-22 evidence in ranks 1–3 can support the request;
4. correct-source but wrong-topic VM-22 evidence cannot support an invented requirement.

Expose the full ranking, production top-three window, expected state, actual state, reason code, and explicit per-case pass/fail in the generated JSON.

## Processor-readiness decision

Record all findings as:

- generic architecture improvement;
- source-specific quality observation;
- human-review requirement; or
- no change needed.

Explicitly answer:

> Did VM-22 reveal any unresolved genuinely new generic processor failure mode that prevents exception-based review?

Processor rating rule:

- RED — fundamental generic architecture issue remains
- AMBER — architecture is sound but recurring issues still require broad full-document review
- GREEN — no unresolved new generic failure class; known risks are deterministically detected and future documents may move to exception/sample-based review

If VM-22 reaches GREEN, the next milestone is a controlled heterogeneous 20–50 document pilot.

## Required artifacts

Create/update using existing naming conventions:

- `data/processed/source_indexes/sources/vm22-current-manual.json`
- `data/processed/review_packages/vm22-source-qa.json`
- `data/processed/review_packages/vm22-canonical-coverage-review-package.json`
- `data/processed/review_packages/vm22-focused-retrieval-evaluation.json`
- `data/processed/review_packages/vm22-support-gate-regression.json`
- `data/processed/relationship_registries/vm22-current-manual-relationship-candidates.json`
- `data/processed/review_packages/vm22-structured-evidence-inventory.json`
- `data/processed/review_packages/vm22-processor-readiness-findings.json`
- `data/processed/review_packages/vm22-validation-report.json`
- `data/processed/review_packages/vm22-independent-review-prompt.md`

Also update source-index/corpus inventory/completeness/project-state outputs using the repository’s normal deterministic generators.

## Governance

Until independent review is complete, VM-22 must remain:

- `review_only: true`
- `promotionStatus: not_promoted`
- `promotionEligible: false`
- learner-facing false
- app-ready false
- RAG-ready false
- vector/Copilot export ineligible

Relationships and structured review objects remain separately governed.

## Validation

Run all normal checks, including:

- `npm run check`
- `npm run source-index:validate`
- `npm run corpus:validate`
- VM-22 source/canonical validator
- VM-22 focused retrieval evaluation
- VM-22 support-gate regression
- relationship-label fidelity
- structured-evidence governance
- `git diff --check`

Confirm no regression to promoted VM-01, VM-20, VM-30, or VM-31, and no unintended change to the reviewed VM-21 exact source package.

## Completion state

VM-22 is ready for independent review only when exact source fidelity, hierarchy, focused retrieval, support-gate behavior, relationship governance, structured-evidence governance, and processor-readiness artifacts are all reproducible from the retained source/batch evidence.

Do not promote VM-22 automatically.
