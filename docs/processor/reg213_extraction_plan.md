# Reg-213 Extraction Plan

## Source Scope

- Source family: `ny_regulations`
- Jurisdiction: New York
- Primary source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-213-11-NYCRR-S103.pdf`
- Source reference: `11 NYCRR Part 103 (Insurance Regulation 213)`
- Working source title: `Regulation 213`
- Source status: active
- Source status note: the PDF metadata title reads `2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1.0 changes accepted+rr`; the OCR text layer is noisy, so page-image wording backstops should remain visible.
- Confirmed page range: `pp. 1-27`
- Boundary note: keep the core regulation in scope and keep the amendment / FAQ PDFs in the same folder out of this wave unless a later amendment-history plan explicitly opens them.
- Relationship to prior waves: follows Reg-141 and Reg-210 as a separate NY-regulation wave; stays separate from the AG waves, the practice-note waves, and the VM chapter waves.

## Topic Map

The OCR layer is noisy, so the topic map is deliberately page-window based and should be kept narrow during extraction.

1. Opening title, scope, applicability, and early definitions
   - Page range: `pp. 1-9`
   - Goal: capture the opening regulatory frame and keep it separate from the later core requirements.
   - Expected issue types: `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `definition_or_terminology`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`

2. Core regulation requirements and control language
   - Page range: `pp. 10-18`
   - Goal: capture the substantive regulatory directives, control language, and any filing or governance language that sits in the middle of the file.
   - Expected issue types: `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `governance_or_control_expectation`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`

3. Closing requirements and end-of-source boundary
   - Page range: `pp. 19-27`
   - Goal: capture the remaining closing requirements and keep the end-of-source boundary explicit without widening into the amendment-history files.
   - Expected issue types: `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`

## Proposed Batch Sequence

- `batch-189`
  - Pages: `1-9`
  - Topic: opening title, scope, applicability, and early definitions
  - Boundary rationale: keep the opening regulatory frame together and stop before the middle requirements begin.
  - Review complexity: medium
  - Expected unresolved issues: noisy OCR, page-image wording backstop, and the need to keep the opening window separate from the middle requirements
  - Automation fit: same stop conditions as the earlier review-only waves

- `batch-190`
  - Pages: `10-18`
  - Topic: core regulation requirements and control language
  - Boundary rationale: keep the core requirements together and stop before the closing requirements begin.
  - Review complexity: high
  - Expected unresolved issues: noisy OCR, page-image wording backstop, jurisdiction-specific requirement handling, and cross-reference mapping
  - Automation fit: same stop conditions as the earlier review-only waves

- `batch-191`
  - Pages: `19-27`
  - Topic: closing requirements and end-of-source boundary
  - Boundary rationale: keep the closing requirements together and end the source at page 27 without absorbing any amendment-history files.
  - Review complexity: high
  - Expected unresolved issues: noisy OCR, page-image wording backstop, and final boundary control at the end of the source
  - Automation fit: same stop conditions as the earlier review-only waves

## Review Standards

- `state_regulation`: treat the text as jurisdiction-specific regulatory material, not generic commentary.
- `jurisdiction_specific_requirement`: flag requirements that apply because the source is a New York regulation.
- `regulatory_requirement`: treat direct obligations, prohibitions, filing rules, and control requirements as regulatory text.
- `definition_or_terminology`: keep defined terms and regulatory labels separate from obligations.
- `governance_or_control_expectation`: keep control language, approvals, and oversight language distinct from operational detail.
- `reporting_requirement`: keep filing or submission language distinct from background or explanation.
- `documentation_expectation`: keep retention or memorandum language distinct from substantive requirements.
- `cross_reference_mapping`: keep references to other statutes, regulations, or actuarial material mapped but not over-interpreted.
- `background_content`: keep title, heading, and explanatory background material out of the requirement layer unless the text imposes a duty.
- `boundary_control_window`: keep each page window narrow and review-only.
- `requires_human_interpretation`: flag dense or unclear wording for human review rather than overclaiming precision.

## Promotion Gates

- Keep every extraction review-only by default.
- Do not mark any item learner-facing unless source citation, source support, wording clarity, confidence, and unresolved-review-flag checks all pass.
- Do not mark any item app-ready until the review-only gate is cleared and a sanitized export is explicitly requested later.
- Do not mark any item RAG-ready until approved indexed material exists and the review disposition no longer needs human review.
- Keep the amendment / FAQ files out of this wave unless a separate amendment-history plan is approved later.

## Validation Implications

- The plan JSON must exist and parse cleanly.
- The plan markdown must exist and include the expected headings and batch IDs.
- The dedicated batch-definition file must exist and stay synchronized with the plan.
- Every planned batch must stay review-only by default.
- The OCR noise must keep the page-image wording backstop visible.
- The source status must stay explicitly active.
- The final boundary must stay at page 27 unless later cleanup proves a better split is needed.

## Operating Note

- Review-only: `true`
- Source type: text-based PDF source with noisy OCR
- Citation guidance: page locators are the primary anchor; line references are not expected to be stable for this wave
- Boundary guidance: keep the opening, middle, and closing page windows separate and do not widen into amendment-history files
- Appendix guidance: the amendment / FAQ PDFs in the same folder are out of scope for this wave
