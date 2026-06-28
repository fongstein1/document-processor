# AG 42 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 42 - The Application of the Model Regulation Permitting the Recognition of Preferred Mortality Tables for Use in Determining Minimum Reserve Liabil.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 42 - The Application of the Model Regulation Permitting the Recognition of Preferred Mortality Tables for Use in Determining Minimum Reserve Liabilities`
- source reference: Actuarial Guideline XLII
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-4`

Observed section windows:

- `ag42-background-scope-definitions`, pages 1-2: purpose, effective date, scope, definitions, and initial preferred-mortality selection / certification criteria.
- `ag42-periodic-assessment-communications`, pages 3-4: periodic assessment of anticipated mortality and annual communications / disclosures.

Boundaries:

- Keep planning focused on the active AG 42 PDF only.
- Do not widen into later guideline files.
- Keep the page-image wording backstop because the text layer is encoding-noisy and stable line references are not expected.
- Use page locators rather than line locators when the text layer does not support stable line mapping.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No later guideline files in the same wave.
- not app-ready, not RAG-ready, and not promoted.

## Topic Map

### Background, scope, definitions, and selection criteria

- pages `1-2`
- review complexity: medium
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - 2001 CSO Preferred Class Structure Mortality Table
  - Model Regulation Permitting the Recognition of Preferred Mortality Tables
  - Actuarial Opinion and Memorandum Regulation
  - Standard Valuation Law
  - valuation date
  - anticipated mortality
  - underwriting-based justification
- boundary note: keep the purpose, scope, and initial certification language together as a narrow review-only slice.

### Periodic assessment and communications / disclosures

- pages `3-4`
- review complexity: medium
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
  - annual certification
  - annual report
  - credibility methodology
  - underwriting-based justification
  - valuation basic table
  - 2001 CSO Preferred Class Structure Mortality Table
- boundary note: keep the periodic-assessment and reporting/disclosure material together as the second review-only slice.

## Proposed Batch Sequence

### batch-138

- topic ids: `ag42-background-scope-definitions`
- title: AG 42 background, scope, definitions, and selection-criteria slice
- page target: `1-2`
- rationale: capture the opening guidance and the initial preferred-mortality selection framework as one narrow review-only batch.
- review complexity: medium
- expected issue types:
  - page_image_confirmation
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-139

- topic ids: `ag42-periodic-assessment-communications`
- title: AG 42 periodic assessment and disclosure slice
- page target: `3-4`
- rationale: capture the ongoing assessment and reporting/disclosure obligations as a narrow review-only batch.
- review complexity: medium
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

- `regulatory_requirement`: treat the purpose, scope, selection, assessment, certification, and disclosure language as regulatory text when it directs what the appointed actuary must do.
- `definition_or_terminology`: treat mortality-table labels, anticipated mortality, class, credibility, and valuation-basic-table labels as terminology when the text explains rather than directs.
- `calculation_structure`: treat the certification tests and anticipated-mortality derivation logic as calculation structure.
- `formula_context`: treat the mortality comparisons and credibility methodology references as formula context unless explicit computational rules are given.
- `cross_reference_mapping`: treat references to the Model Regulation, Actuarial Opinion and Memorandum Regulation, and Standard Valuation Law as cross-reference context unless operationalized.
- `background_content`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-4 window as review-only and do not split it unless later cleanup explicitly needs that split.
- `requires_human_interpretation`: treat the encoding-noisy text layer and mortality-selection judgment calls as requiring human review unless the source text is explicit.

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
- The AG 42 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 42 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for the noisy text layer.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Later guideline file boundary checks.
- Preferred-mortality and certification boundary checks.

### script implications

- `scripts/ag42-batch-definitions.mjs` should stay synchronized with the planned batch-138 and batch-139 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 42 definition file so the shared runner can find batch-138 and batch-139.
- `scripts/validate-scaffold.mjs` should verify that the AG 42 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet because the AG 42 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 42 planning artifact. Planned batches 138 and 139 remain review-only by default and are not extraction runs.
