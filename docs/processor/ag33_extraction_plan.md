# AG 33 Extraction Plan

## Source Scope

- Primary source file: `AG 33 - Determining Minimum CARVM Reserves for Individual Annuity Contracts.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXXIII`
- Source status: `active`
- Confirmed page range: pages 1-6
- Domain: `naic_regulatory`
- Raw source root: `D:\\Work\\AI Projects\\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 32 is the immediately preceding immediate-payment guideline and should stay separate.
  - AG 34 remains out of scope for this wave.
  - The exact guideline title centers on Annuity Contracts With Elective Benefits.
  - This guideline clarifies CARVM reserve treatment for annuity contracts with elective benefits and integrated benefit streams.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page windows:

- page 1: background information, introduction, and purpose
- page 2: elective / non-elective benefits and incidence-rate framing
- page 3: integrated benefit stream foundation and valuation interest-rate framing
- page 4: examples of integrated benefit streams and the transition into the mechanics layer
- page 5: guarantee duration, plan type, change in fund basis, and purchase rates
- page 6: practical considerations and effective date

Boundaries and exclusions:

- Keep AG 33 as a two-batch review-only wave and do not widen into AG 34.
- Keep the page-image wording backstop visible because the text layer is encoded/noisy.
- Keep the elective-benefit / integrated-benefit-stream context explicit in every batch artifact.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag33-benefit-classification-and-stream-foundation`
   - pages 1-3
   - Background, purpose, benefit classification, and integrated benefit stream foundation.

2. `ag33-mechanics-and-closeout`
   - pages 4-6
   - Integrated benefit stream examples, valuation-interest-rate mechanics, guarantee duration, plan type, change in fund basis, purchase rates, practical considerations, and effective date.

## Proposed Batch Sequence

- `batch-115`
  - Page target: pages 1-3
  - Rationale: keep the title, purpose, benefit-classification, and integrated-benefit-stream foundation together before the mechanics window begins.
  - Expected review complexity: medium-high
  - Expected unresolved issue types: regulatory_requirement, definition_or_terminology, reserve_method_structure, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

- `batch-116`
  - Page target: pages 4-6
  - Rationale: keep the examples, valuation-interest-rate mechanics, guarantee duration, purchase-rate guidance, practical considerations, and effective-date closeout together as one review-only mechanics slice.
  - Expected review complexity: high
  - Expected unresolved issue types: regulatory_requirement, definition_or_terminology, reserve_method_structure, calculation_structure, formula_context, prescribed_assumption, company_or_prudent_estimate_assumption, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat the CARVM reserve rules as regulatory text when the guideline directs how reserves should be determined.
- `definition_or_terminology`: treat elective benefits, non-elective benefits, integrated benefit streams, plan type, guarantee duration, and change in fund basis as terminology or context when the text explains rather than directs.
- `reserve_method_structure`: treat the integrated-benefit-stream framework, plan-type logic, and reserve formulation as reserve-method structure when the text is describing the method rather than the specific numeric outcome.
- `calculation_structure`: treat the examples, purchase-rate guidance, and reserve-setting sequences as calculation structure when they specify how the method is applied.
- `formula_context`: treat references to greatest present value, discounting, accumulation funds, and valuation-interest-rate bands as formula context unless the text gives an explicit computational rule.
- `prescribed_assumption`: treat SVL-prescribed mortality, incidence, and interest-related inputs as prescribed assumptions when they are stated as fixed or table-driven requirements.
- `company_or_prudent_estimate_assumption`: treat company or industry experience language as company/prudent-estimate context when the text expressly allows or recommends it.
- `cross_reference_mapping`: treat references to the Standard Valuation Law, the 1980 amendments, specific sections, and the AG 34 boundary as cross-reference context unless the text operationalizes them.
- `background_content`: treat the title, introduction, examples, and practical-considerations paragraphs as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-3 and page 4-6 windows as review-only slices and do not split them unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoded page, elective/non-elective classification edge cases, and example-driven judgment calls as requiring human review unless the source text is explicit.

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
- The AG 33 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 33 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for elective-benefit, integrated-stream, valuation-interest-rate, and AG 34 boundary leakage.

## Operating Note

AG 33 is a review-only active guideline. The page image remains the wording backstop because the text layer is noisy. The plan intentionally keeps the six-page file as a two-batch review-only wave so the elective-benefit classification stays together and page 6 can remain a review-only closeout window before AG 34.
