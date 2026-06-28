# AG 28 Extraction Plan

## Source Scope

- Primary source file: `AG 28 - Statutory Reserves for Group Long-Term Disability Contracts Within A Survivor Income Benefit Provision.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXVIII`
- Source status: `active`
- Confirmed page range: page 1
- Domain: `naic_regulatory`
- Raw source root: `D:\\Work\\AI Projects\\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 27 is the immediately preceding accelerated-benefits guideline and should stay separate.
  - AG 29 remains out of scope for this batch.
  - This guideline addresses survivor income benefit reserves in group long-term disability contracts.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page window:

- Page 1: survivor income benefit background, reserve approximation, and the closing boundary note.

Boundaries and exclusions:

- Keep AG 28 as a single source unit and do not widen into AG 29.
- Keep the page-image wording backstop visible because the text layer is noisy / encoded.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag28-survivor-income-benefit-reserves`
   - Page 1
   - Survivor income benefit background, reserve approximation guidance, and the numeric test example.

## Proposed Batch Sequence

- `batch-110`
  - Page target: page 1
  - Rationale: capture the full one-page guideline as one review-only slice because the survivor-income-benefit reserve rule and the tested approximation belong together.
  - Expected review complexity: medium
  - Expected unresolved issue types: page-image wording confirmation, reserve-method structure, formula context, cross-reference mapping, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat the reserve requirement and mandatory reserve design language as regulatory text when the guideline says it must be followed.
- `definition_or_terminology`: treat survivor income benefit, disability period, and reserve terms as terminology when the text explains rather than directs.
- `reserve_method_structure`: treat the reserve approximation and combined-reserve framing as structure until the text clearly states a separate duty.
- `calculation_structure`: treat the numeric example and reserve approximation test as calculation structure until a duty is explicit.
- `formula_context`: treat the interest-rate comparison and approximation language as context until interpretation is explicit.
- `cross_reference_mapping`: treat references to long-term disability contracts, disability periods, and valuation interest rates as cross-reference context unless the text operationalizes them.
- `background_content`: treat title, framing, and explanatory notes as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1 window as a review-only slice and do not split it unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the OCR noise, reserve approximation, and numeric example as requiring human review unless the source text is explicit.

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
- The AG 28 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 28 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for reserve-approximation leakage.

## Operating Note

AG 28 is a review-only active guideline. The text layer is noisy / encoded, so
the page image remains the wording backstop. The plan intentionally keeps the
one-page file as a single review-only batch so the survivor-income-benefit
reserve framing, approximation example, and closing boundary stay together.
