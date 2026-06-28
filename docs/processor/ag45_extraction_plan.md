# AG 45 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 45 - The Application of the Standard Nonforfeiture Law for Life Insurance to Certain Policies Having Intermediate Cash Benefits.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 45 - The Application of the Standard Nonforfeiture Law for Life Insurance to Certain Policies Having Intermediate Cash Benefits`
- source reference: Actuarial Guideline XLV
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-3`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- pages 1-3 are the full confirmed scope.

Observed section windows:

- `ag45-scope-background-mechanics`, pages 1-2: scope, background, formula context, and reserve-mechanics framing.
- `ag45-applicability-boundary`, page 3: applicability language and the closing boundary before AG 46.

Boundaries:

- Keep planning focused on the active AG 45 PDF only.
- Do not widen into later guideline files.
- Keep the page-image wording backstop because the text layer is encoding-noisy and stable line references are not expected.
- Use page locators rather than line locators when the text layer does not support stable line mapping.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.
- Keep AG 46 out of scope for this wave.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No later guideline files in the same wave.
- AG 46 remains out of scope for this wave.

## Topic Map

### Scope, background, formula context, and reserve-mechanics framing

- pages `1-2`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the opening guidance and formula context together as one narrow review-only slice.

### Applicability language and the closing boundary before AG 46

- page `3`
- review complexity: medium
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the applicability language together and stop cleanly at the AG 46 boundary.

## Proposed Batch Sequence

### batch-151

- topic ids: `ag45-scope-background-mechanics`, `ag45-applicability-boundary`
- title: AG 45 scope, formulas, and applicability slice
- page target: `1-3`
- rationale: capture the entire 3-page guideline as one narrow review-only slice and keep AG 46 outside the batch.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatoryRequirement`: treat the scope, formula, and applicability language as regulatory text when it directs what the company must do.
- `definitionOrTerminology`: treat table labels, nonforfeiture terms, and cash-benefit references as terminology when the text explains rather than directs.
- `reserveMethodStructure`: treat the opening formula guidance and the applicability framework as structural guidance for the guideline's calculation method.
- `calculationStructure`: treat the adjusted-premium and nonforfeiture-net-level-premium text as calculation structure.
- `formulaContext`: treat the formula passages and premium references as formula context unless explicit computational rules are given.
- `prescribedAssumption`: treat any requirement that fixes a premium basis or benefit basis as a prescribed assumption when the source explicitly does so.
- `companyOrPrudentEstimateAssumption`: treat company-estimate language as company / prudent-estimate assumptions only when the source explicitly makes such a choice.
- `scenarioOrStochasticRequirement`: treat scenario language, if any appears, as stochastic requirement language only when the source explicitly uses it.
- `assetModelingJudgment`: treat any asset-modeling choice as asset-modeling judgment only when the source explicitly makes such a choice.
- `hedgingOrRiskMitigation`: treat hedge language as hedging / risk mitigation only if it appears in the source.
- `reportingRequirement`: treat any certification, report, or statutory-reporting instruction as a reporting requirement if it appears in the source.
- `documentationExpectation`: treat support, memo, or review instructions as documentation expectations if they appear in the source.
- `governanceOrControlExpectation`: treat commissioner approval, review, and control language as governance or control expectations.
- `crossReferenceMapping`: treat references to the Standard Nonforfeiture Law and related guidance as cross-reference context unless operationalized.
- `backgroundContent`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the encoded text layer, the formula-heavy wording, and the applicability boundary as requiring human review unless the source text is explicit.

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
- The AG 45 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 45 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for the noisy text layer.
- AG 46 must remain out of scope for this wave.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Applicability boundary checks.
- Formula / nonforfeiture-context checks.

### script implications

- `scripts/ag45-batch-definitions.mjs` should stay synchronized with the planned batch-151 slice when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 45 definition file so the shared runner can find batch-151.
- `scripts/validate-scaffold.mjs` should verify that the AG 45 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet because the AG 45 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 45 planning artifact. Planned batch 151 remains review-only by default and is not an extraction run.
