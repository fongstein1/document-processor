# AG 27 Extraction Plan

## Source Scope

- Primary source file: `AG 27 - Actuarial Guideline for Accelerated Benefits.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXVII`
- Source status: `active`
- Confirmed page range: pages 1-5
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 26 is the immediately preceding operative-dates guideline and should stay separate.
  - AG 28 is the next guideline file and remains out of scope for this batch.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page windows:

- Pages 1-2: overview, non-discounted acceleration, and the opening actuarially discounted acceleration reserve discussion.
- Page 3: interest accrual approach to financing acceleration of benefits.
- Pages 4-5: benefit payment liens and the closing boundary material.

Boundaries and exclusions:

- Keep AG 27 as a single source unit and do not widen into AG 28.
- Keep the page-image wording backstop visible because the text layer is noisy / encoded.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag27-nondiscounted-and-discounted-overview`
   - Pages 1-2
   - Non-discounted acceleration, actuarially discounted acceleration, and the opening reserve framing.
2. `ag27-interest-accrual-approach`
   - Page 3
   - Interest accrual approach to financing acceleration of benefits, interest-rate method disclosure, and reserve treatment.
3. `ag27-benefit-payment-liens`
   - Pages 4-5
   - Benefit payment liens, policy-loan interactions, termination conditions, and the closing boundary.

## Proposed Batch Sequence

- `batch-107`
  - Page target: pages 1-2
  - Rationale: capture the overview and the first reserve framing together so the non-discounted and discounted approaches stay in one reviewable slice.
  - Expected review complexity: high
  - Expected unresolved issue types: page-image wording confirmation, reserve-method structure, formula context, cross-reference mapping, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches
- `batch-108`
  - Page target: page 3
  - Rationale: keep the interest accrual approach and the rate-disclosure language separate from the lien mechanics.
  - Expected review complexity: medium
  - Expected unresolved issue types: page-image wording confirmation, documentation expectation, formula context, cross-reference mapping, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches
- `batch-109`
  - Page target: pages 4-5
  - Rationale: capture the benefit-payment-lien mechanics and the closing boundary together so the lien rules do not spill into a broader pass.
  - Expected review complexity: high
  - Expected unresolved issue types: page-image wording confirmation, calculation structure, cross-reference mapping, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat express duty, allowance, cap, or required disclosure language as regulatory text when the guideline says it must be followed.
- `definition_or_terminology`: treat acceleration feature, lien, ETI, RPU, and related terms as terminology when the text explains rather than directs.
- `reserve_method_structure`: treat the reserve discussion and aggregate-reserve framing as structure until the text clearly states a separate duty.
- `calculation_structure`: treat the benefit reduction, lien handling, and accelerated-payment mechanics as calculation structure until a duty is explicit.
- `formula_context`: treat formula labels, interest accrual, and reserve comparisons as context until interpretation is explicit.
- `documentation_expectation`: treat contractual / actuarial memorandum disclosure language as documentation expectation when the guideline says the method should be specified.
- `cross_reference_mapping`: treat references to Standard Valuation Law, CRVM, policy provisions, and actuarial memorandums as cross-reference context unless the text operationalizes them.
- `background_content`: treat title, framing, and explanatory notes as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-5 window as a review-only slice and do not split it unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the OCR noise, lien mechanics, interest-accrual language, and termination conditions as requiring human review unless the source text is explicit.

## Promotion Gates

- Default state: `review_only`
- Learner-facing criteria:
  - source citation exists
  - source support is clear
  - wording is not misleading
  - confidence is high
  - no unresolved review flags exist
- App-ready criteria:
  - learner-facing criteria are already satisfied
  - export is sanitized, stable, and versioned
  - no unresolved review issues remain
- RAG-ready criteria:
  - approved indexed material only
  - stable ID
  - source reference and locator
  - review status no longer requires human disposition

## Validation Implications

- The plan file must exist and parse as JSON.
- The AG 27 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 27 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for lien / accrual boundary leakage.

## Operating Note

AG 27 is a review-only active guideline. The text layer is noisy / encoded, so
the page image remains the wording backstop. The plan intentionally keeps the
five-page file as a three-batch review-only wave so the reserve framing,
interest accrual, and lien mechanics stay separate.
