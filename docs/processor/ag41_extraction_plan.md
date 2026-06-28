# AG 41 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 41 - Projection of Guaranteed Nonforfeiture Benefits Under CARVM.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 41 - Projection of Guaranteed Nonforfeiture Benefits Under CARVM`
- source reference: Actuarial Guideline XLI
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-2`

Observed section window:

- `ag41-background-scope-text-applicability`, pages 1-2: background, scope, text, applicability, and valuation-date assumption context.

Boundaries:

- Keep planning focused on the active AG 41 PDF only.
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

### Background, scope, text, and applicability

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
  - Standard Valuation Law
  - Standard Nonforfeiture Law
  - CARVM
  - SNLIDA
  - valuation date
  - future nonforfeiture benefits
  - AG 40
- boundary note: keep the projected nonforfeiture-benefit discussion and the valuation-date assumptions together as a single review-only slice.

## Proposed Batch Sequence

### batch-137

- topic ids: `ag41-background-scope-text-applicability`
- title: AG 41 background, scope, and projected nonforfeiture-benefit slice
- page target: `1-2`
- rationale: capture the short guideline as one narrow review-only batch.
- review complexity: medium
- expected issue types:
  - page_image_confirmation
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatory_requirement`: treat the projection and applicability language as regulatory text when it directs how nonforfeiture benefits are projected under CARVM.
- `definition_or_terminology`: treat nonforfeiture-benefit, CARVM, SNLIDA, and valuation-date labels as terminology when the text explains rather than directs.
- `calculation_structure`: treat the projection steps and valuation-date assumptions as calculation structure.
- `formula_context`: treat NI, VI, and the rate-projection rule as formula context unless explicit computational rules are given.
- `cross_reference_mapping`: treat references to CARVM, Standard Valuation Law, and Standard Nonforfeiture Law as cross-reference context unless operationalized.
- `background_content`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-2 window as review-only and do not split it unless later cleanup explicitly needs that split.
- `requires_human_interpretation`: treat the encoding-noisy text layer and projection-rule judgment calls as requiring human review unless the source text is explicit.

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
- The AG 41 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 41 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for the noisy text layer.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Later guideline file boundary checks.
- Projection and nonforfeiture boundary checks.

### script implications

- `scripts/ag41-batch-definitions.mjs` should stay synchronized with the planned batch-137 slice when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 41 definition file so the shared runner can find batch-137.
- `scripts/validate-scaffold.mjs` should verify that the AG 41 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet because the AG 41 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 41 planning artifact. Planned batch 137 remains review-only by default and is not an extraction run.
