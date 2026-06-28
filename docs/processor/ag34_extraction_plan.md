# AG 34 Extraction Plan

## Source Scope

- Primary source file: `AG 34 - Variable Annuity Minimum Guaranteed Death Benefit Reserves.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXXIV`
- Source status: `active`
- Confirmed page range: pages 1-11
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 33 is the immediately preceding elective-benefit CARVM guideline and should stay separate.
  - AG 35 remains out of scope for this wave.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page windows:

- pages 1-3: background, scope, definitions, and reserve-method foundation
- pages 4-6: mortality basis, asset adequacy analysis requirement, effective date, and the immediate-drop / gross-assumed-returns table
- pages 7-11: mortality tables and Appendix II asset-class descriptions

Boundaries and exclusions:

- Keep AG 34 as a three-batch review-only wave and do not widen into AG 35.
- Keep the page-image wording backstop visible because the text layer is encoding-noisy.
- Keep every output review-only by default.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- Do not create eLearning scripts, slides, quizzes, or app exports.
- Do not commit raw source files.

## Topic Map

1. `ag34-foundation-and-methodology`
   - pages 1-3
   - Background, purpose, scope, definitions, and reserve-method structure.

2. `ag34-mortality-basis-and-asset-adequacy`
   - pages 4-6
   - Mortality basis, asset adequacy analysis requirement, effective date, and the immediate-drop / gross-assumed-returns table.

3. `ag34-mortality-tables-and-appendix`
   - pages 7-11
   - Mortality tables and Appendix II asset-class descriptions.

## Proposed Batch Sequence

- `batch-117`
  - Page target: pages 1-3
  - Rationale: keep the title, purpose, scope, definitions, and reserve-method foundation together before the mortality and appendix material begins.
  - Expected review complexity: medium-high
  - Expected unresolved issue types: regulatory_requirement, definition_or_terminology, reserve_method_structure, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

- `batch-118`
  - Page target: pages 4-6
  - Rationale: keep the mortality basis, asset adequacy analysis requirement, effective date, and immediate-drop / gross-assumed-returns table together as one review-only mechanics slice.
  - Expected review complexity: high
  - Expected unresolved issue types: regulatory_requirement, definition_or_terminology, reserve_method_structure, calculation_structure, formula_context, prescribed_assumption, company_or_prudent_estimate_assumption, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

- `batch-119`
  - Page target: pages 7-11
  - Rationale: keep the mortality tables and Appendix II asset-class descriptions together so the table-driven material stays reviewable as one unit.
  - Expected review complexity: high
  - Expected unresolved issue types: prescribed_assumption, definition_or_terminology, formula_context, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat the reserve rules and asset-adequacy direction as regulatory text when the guideline directs how reserves should be determined or tested.
- `definition_or_terminology`: treat MGDB, separate reserve, integrated reserve, calculation period, and asset-class labels as terminology or context when the text explains rather than directs.
- `reserve_method_structure`: treat the reserve methodology, separate/integrated reserve split, and method framing as reserve-method structure when the text is describing the method rather than the numeric outcome.
- `calculation_structure`: treat the examples, table lookups, and reserve-setting sequences as calculation structure when they specify how the method is applied.
- `formula_context`: treat references to present value, discounting, immediate drops, gross assumed returns, and mortality factors as formula context unless the text gives an explicit computational rule.
- `prescribed_assumption`: treat mortality tables and specified input rates as prescribed assumptions when they are stated as fixed or table-driven requirements.
- `company_or_prudent_estimate_assumption`: treat company or experience-sensitive language as company/prudent-estimate context when the text expressly allows or recommends it.
- `cross_reference_mapping`: treat references to the Standard Valuation Law, the Model Actuarial Opinion and Memorandum Regulation, Appendix II, and the AG 35 boundary as cross-reference context unless the text operationalizes them.
- `background_content`: treat the title, introduction, examples, and appendix labels as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-3, page 4-6, and page 7-11 windows as review-only slices and do not split them unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoded text layer, table-heavy pages, and example-driven judgment calls as requiring human review unless the source text is explicit.

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
- The AG 34 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 34 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for AG 35 boundary leakage.

## Operating Note

AG 34 is a review-only active guideline. The page image remains the wording backstop because the text layer is noisy, and the three planned batches keep the narrative foundation separate from the mortality tables and appendix material while AG 35 stays out of scope.
