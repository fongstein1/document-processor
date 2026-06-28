# AG 25 Extraction Plan

## Source Scope

- Primary source file: `AG 25 - Guideline for Calculation of Minimum Reserves and Minimum Non-Forfeiture Values for Policies with Guaranteed Increasing Death Benefits Based o.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXV`
- Source status: `active`
- Confirmed page range: pages 1-3
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 24 is the immediately preceding variable-life nonforfeiture guideline and should stay separate.
  - AG 26 is the next guideline file and remains out of scope for this batch.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page windows:

- Pages 1-3: the entire indexed increasing death-benefits guideline, including the valuation text, CPI-based annual increase assumptions, and the low-amount policy exception.
- page 1 is the opening anchor and page 3 is the closing anchor.

Boundaries and exclusions:

- Keep AG 25 as a single source unit and do not widen into AG 26.
- Keep the page-image wording backstop visible because the text layer is noisy / encoded.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag25-indexed-increasing-death-benefits`
   - Pages 1-3
   - Indexed increasing death-benefits framework, CPI-based annual increase assumptions, threshold / low-amount exception language, and the closing boundary.
   - This is the full review-only slice of the guideline.

## Proposed Batch Sequence

- `batch-105`
  - Page target: pages 1-3
  - Rationale: capture the entire three-page guideline as one review-only slice so the OCR-noisy language and the low-amount exception stay together.
  - Expected review complexity: high
  - Expected unresolved issue types: page-image wording confirmation, formula context, cross-reference mapping, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat express duties, allowances, caps, and required nonforfeiture language as regulatory text.
- `definition_or_terminology`: treat valuation rate, death-benefit increase terms, threshold amount, and related terms as terminology when the text explains rather than directs.
- `reserve_method_structure`: treat the indexed-death-benefit reserve framing as structure until the text clearly states a separate duty.
- `calculation_structure`: treat the death-benefit adjustments, present-value adjustments, and low-amount exceptions as calculation structure until a duty is explicit.
- `formula_context`: treat formula labels, annual-increase percentages, and policy-value comparisons as context until interpretation is explicit.
- `prescribed_assumption`: treat stated valuation assumptions, CPI-based limits, and table-based assumptions as prescribed when the guideline says they are fixed.
- `company_or_prudent_estimate_assumption`: use this label only when the guideline leaves a choice to the insurer or references company-determined treatment.
- `cross_reference_mapping`: treat references to the Consumer Price Index, IRS Section 7702, and the cash value accumulation test as cross-reference context unless the text operationalizes them.
- `background_content`: treat title, framing, and explanatory notes as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-3 window as a review-only slice and do not split it unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the OCR noise, formula-heavy prose, and threshold / exception choices as requiring human review unless the source text is explicit.

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
- The AG 25 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 25 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for threshold / exception leakage.

## Operating Note

AG 25 is a review-only active guideline. The text layer is noisy / encoded, so
the page image remains the wording backstop. The plan intentionally keeps the
three-page file as one review-only slice so the indexed death-benefit framework
and the low-amount exception stay together.
