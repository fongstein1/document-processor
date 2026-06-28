# AG 26 Extraction Plan

## Source Scope

- Primary source file: `AG 26 - Guideline for Election of Operative Dates under Standard Valuation Law and Standard Non-Forfeiture Law.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXVI`
- Source status: `active`
- Confirmed page range: page 1
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 25 is the immediately preceding indexed-death-benefits guideline and should stay separate.
  - AG 27 is the next guideline file and remains out of scope for this batch.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page window:

- page 1: the entire election-of-operative-dates guideline, including the operative-date election rule, the dynamic interest-rate language, and the background material closing boundary.

Boundaries and exclusions:

- Keep AG 26 as a single source unit and do not widen into AG 27.
- Keep the page-image wording backstop visible because the text layer is noisy / encoded.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag26-operative-dates-guideline`
   - page 1
   - Election of operative dates under Standard Valuation Law and Standard Non-Forfeiture Law, the early-operative-date limitation, and the dynamic interest-rate / reserve-rate boundary.
   - This is the full review-only slice of the guideline.

## Proposed Batch Sequence

- `batch-106`
  - Page target: page 1
  - Rationale: capture the entire one-page guideline as one review-only slice so the operative-date rule, the dynamic-interest language, and the closing background material stay together.
  - Expected review complexity: medium
  - Expected unresolved issue types: page-image wording confirmation, cross-reference mapping, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat the operative-date limitation and required election language as regulatory text when the guideline says it must be followed.
- `definition_or_terminology`: treat operative date, dynamic interest rate, and reserve / nonforfeiture references as terminology when the text explains rather than directs.
- `calculation_structure`: treat the reserve-rate and nonforfeiture-rate references as calculation structure until the text clearly states a separate duty.
- `formula_context`: treat interest-rate comparisons and reserve / nonforfeiture rate language as context until interpretation is explicit.
- `prescribed_assumption`: treat stated operative-date limits and mandatory-date language as prescribed when the guideline says they are fixed.
- `cross_reference_mapping`: treat references to Standard Valuation Law and Standard Non-Forfeiture Law as cross-reference context unless the text operationalizes them.
- `background_content`: treat title, framing, and explanatory notes as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1 window as a review-only slice and do not split it unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the OCR noise, operative-date election language, and interest-rate boundary language as requiring human review unless the source text is explicit.

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
- The AG 26 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 26 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for operative-date / interest-rate boundary leakage.

## Operating Note

AG 26 is a review-only active guideline. The text layer is noisy / encoded, so
the page image remains the wording backstop. The plan intentionally keeps the
single-page file as one review-only slice so the operative-date rule and the
interest-rate boundary stay together.
