# AG 38 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model).pdf`
- companion-only excluded source file: `AG 38 - CRVM for UL-from 2021 Law Manual.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model)`
- source reference: Actuarial Guideline XXXVIII
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-13`

Observed section windows:

- `ag38-background-and-application`, pages 1-3: introduction, application framing, and early examples for the revised Model 830 guidance.
- `ag38-example-mechanics`, pages 4-6: reserve-construction examples, premium derivation, and catch-up / deficiency-reserve mechanics.
- `ag38-deterministic-reserve-and-step-boundaries`, pages 7-10: deterministic-reserve language, Step 2 / Step 8 / Step 9 style mechanics, and the valuation-date application window.
- `ag38-opinion-representation-and-closeout`, pages 11-13: assumptions, actuarial opinion / company representation, and scope closeout language.

Boundaries:

- Keep planning focused on the active AG 38 PDF only.
- Treat the 2021 Law Manual reprint as companion-only and out of scope.
- Do not widen into AG 39 or later guideline files.
- Keep the page-image wording backstop visible because the text layer is encoding-noisy.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.
- AG 39 remains out of scope.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No other guideline files in the same wave.
- not app-ready, not RAG-ready, and not promoted.

## Topic Map

### 1. Background and Application

- pages `1-3`
- review complexity: medium-high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - background_content
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - Model 830
  - Standard Valuation Law
  - AG 37
  - AG 39
- boundary note: keep the introduction and application framing together and do not widen into AG 39.

### 2. Example Mechanics

- pages `4-6`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - minimum gross premium
  - catch-up amount
  - basic reserve
  - deficiency reserve
  - guarantee requirements
  - Model 830 examples
- boundary note: keep the reserve-construction examples together as one narrow review-only slice.

### 3. Deterministic Reserve and Step Boundaries

- pages `7-10`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - reporting_requirement
  - documentation_expectation
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - Section 8A
  - Section 8B
  - Section 8C
  - Section 8D
  - deterministic reserve
  - specified premiums
  - premium load allowance
- boundary note: keep the step-based mechanics narrow and do not widen into later opinion text.

### 4. Opinion, Representation, and Closeout

- pages `11-13`
- review complexity: medium-high
- expected issue types:
  - regulatory_requirement
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - actuarial opinion
  - company representation
  - assumptions
  - Model 830 scope
  - AG 39
- boundary note: keep the opinion / representation material as a closing window and leave AG 39 out of scope.

## Proposed Batch Sequence

### batch-130

- topic ids: `ag38-background-and-application`
- title: AG 38 background and application slice
- page target: `1-3`
- rationale: capture the introductory application framing and early examples before the reserve mechanics begin.
- review complexity: medium-high
- expected issue types:
  - page_image_confirmation
  - scope_boundary
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-131

- topic ids: `ag38-example-mechanics`
- title: AG 38 example mechanics slice
- page target: `4-6`
- rationale: keep the reserve-construction examples together as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-132

- topic ids: `ag38-deterministic-reserve-and-step-boundaries`
- title: AG 38 deterministic reserve and step-boundary slice
- page target: `7-10`
- rationale: keep the step-based reserve mechanics together and stop before the opinion / representation material begins.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - reporting_requirement
  - documentation_expectation
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-133

- topic ids: `ag38-opinion-representation-and-closeout`
- title: AG 38 opinion, representation, and closeout slice
- page target: `11-13`
- rationale: keep the opinion / company-representation material together as the closing review window.
- review complexity: medium-high
- expected issue types:
  - page_image_confirmation
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatory_requirement`: treat application, reserve, and closeout language as regulatory text when the guideline directs how Model 830 should be handled.
- `definition_or_terminology`: treat Model 830 terms, reserve labels, and example labels as terminology or context when the text explains rather than directs.
- `reserve_method_structure`: treat the reserve framework, step structure, and example mechanics as method structure when the text is describing how the reserve works.
- `calculation_structure`: treat the reserve steps, reserve components, and boundary setup as calculation structure when the text specifies how the method is applied.
- `formula_context`: treat premium derivation, reserve components, and valuation-rate references as formula context unless the text gives an explicit computational rule.
- `prescribed_assumption`: treat table-driven or fixed inputs as prescribed assumptions when they are stated as requirements.
- `company_or_prudent_estimate_assumption`: treat experience-sensitive or judgment-sensitive language as company / prudent-estimate context when the text expressly allows or recommends it.
- `reporting_requirement`: treat opinion, representation, and filing-direction language as reporting requirement material when the text says what must be filed or disclosed.
- `documentation_expectation`: treat explanatory implementation language as documentation expectation material when the text tells the reviewer what must accompany the filing.
- `cross_reference_mapping`: treat references to Model 830, the Standard Valuation Law, AG 37, and AG 39 as cross-reference context unless the text operationalizes them.
- `background_content`: treat the title, introduction, examples, and section labels as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-3, page 4-6, page 7-10, and page 11-13 windows as review-only slices and do not split them unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoding-noisy text layer, table-heavy passages, and reserve judgment calls as requiring human review unless the source text is explicit.

## Promotion Gates

- default state: review_only
- learner-facing:
  - source citation exists
  - source support is clear
  - wording is not misleading
  - confidence is high
  - no unresolved review flags exist
- app-ready:
  - learner-facing criteria are already satisfied
  - export is sanitized, stable, and versioned
  - no unresolved review issues remain
- rag-ready:
  - approved indexed material only
  - stable ID
  - source reference and locator
  - review status no longer requires human disposition

## Validation Implications

### current checks needed

- Plan file exists and parses as JSON.
- The AG 38 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 38 batch definition file must stay synchronized with the plan.

### future checks suggested

- Page-image wording backstop checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- AG 39 boundary checks.
- Companion reprint leakage checks.

### script implications

- `scripts/ag38-batch-definitions.mjs` should stay synchronized with the planned batch-130, batch-131, batch-132, and batch-133 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 38 definition file so the shared runner can find batch-130, batch-131, batch-132, and batch-133.
- `scripts/validate-scaffold.mjs` should verify that the AG 38 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.

## Operating Note

Controlled AG 38 planning artifact. Planned batches 130, 131, 132, and 133 remain review-only by default and are not extraction runs.
