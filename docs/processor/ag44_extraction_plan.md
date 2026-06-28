# AG 44 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 44 - Group Term Life Waiver of Premium Disabled Lives Reserves.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 44 - Group Term Life Waiver of Premium Disabled Lives Reserves`
- source reference: Actuarial Guideline XLIV
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-7`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- pages 1-7 are the full confirmed scope.

Observed section windows:

- `ag44-background-scope-experience`, pages 1-3: background, scope, definitions, company experience, and the reserve-calculation opener.
- `ag44-attachment-tables`, pages 4-7: Attachment A-D mortality and recovery tables plus the closing boundary.

Boundaries:

- Keep planning focused on the active AG 44 PDF only.
- Do not widen into later guideline files.
- Keep the page-image wording backstop because the text layer is encoding-noisy and stable line references are not expected.
- Use page locators rather than line locators when the text layer does not support stable line mapping.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.
- Keep AG 45 out of scope for this wave.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No later guideline files in the same wave.
- AG 45 remains out of scope for this wave.

## Topic Map

### Background, scope, definitions, company experience, and reserve-calculation opener

- pages `1-3`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the opening guidance and company-experience material together as one narrow review-only slice.

### Attachment tables and closing boundary

- pages `4-7`
- review complexity: high
- expected issue types:
  - definition_or_terminology
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - formula_context
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the attachment tables together and stop cleanly at the end of the file.

## Proposed Batch Sequence

### batch-149

- topic ids: `ag44-background-scope-experience`
- title: AG 44 background, scope, definitions, and reserve-calculation opener slice
- page target: `1-3`
- rationale: capture the opening guidance, scope, definitions, company-experience review, and reserve-calculation opener as one narrow review-only batch.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - definition_or_terminology
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-150

- topic ids: `ag44-attachment-tables`
- title: AG 44 attachment tables and closing boundary slice
- page target: `4-7`
- rationale: capture Attachment A-D mortality and recovery tables and stop cleanly at the AG 45 boundary.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - definition_or_terminology
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - formula_context
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatoryRequirement`: treat the background, scope, reserve-calculation, and attachment-table language as regulatory text when it directs what the appointed actuary must do.
- `definitionOrTerminology`: treat table labels, disabled-life reserve terms, and company-experience references as terminology when the text explains rather than directs.
- `reserveMethodStructure`: treat the opening reserve-calculation guidance and the attachment-table framework as reserve structure.
- `calculationStructure`: treat the reserve formulas, company-experience adjustments, and table-driven mechanics as calculation structure.
- `formulaContext`: treat the reserve calculation and table references as formula context unless explicit computational rules are given.
- `prescribedAssumption`: treat any requirement that fixes a mortality or recovery basis as a prescribed assumption.
- `companyOrPrudentEstimateAssumption`: treat company-experience review and credibility-style adjustments as company / prudent-estimate assumptions.
- `scenarioOrStochasticRequirement`: treat scenario language, if any appears, as stochastic requirement language only when the source explicitly uses it.
- `assetModelingJudgment`: treat any asset-modeling choice as asset-modeling judgment only when the source explicitly makes such a choice.
- `hedgingOrRiskMitigation`: treat hedge language as hedging / risk mitigation only if it appears in the source.
- `reportingRequirement`: treat any certification, report, or statutory-reporting instruction as a reporting requirement if it appears in the source.
- `documentationExpectation`: treat support, memo, or review instructions as documentation expectations if they appear in the source.
- `governanceOrControlExpectation`: treat commissioner approval, review, and control language as governance or control expectations.
- `crossReferenceMapping`: treat references to the Standard Valuation Law, the 2005 GTLW tables, and other appendix material as cross-reference context unless operationalized.
- `backgroundContent`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the encoded text layer, the attachment tables, and judgment-heavy company-experience boundaries as requiring human review unless the source text is explicit.

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
- The AG 44 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 44 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for the noisy text layer.
- AG 45 must remain out of scope for this wave.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Attachment-table boundary checks.
- Company-experience and table-boundary checks.

### script implications

- `scripts/ag44-batch-definitions.mjs` should stay synchronized with the planned batch-149 through batch-150 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 44 definition file so the shared runner can find batch-149 through batch-150.
- `scripts/validate-scaffold.mjs` should verify that the AG 44 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet because the AG 44 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 44 planning artifact. Planned batches 149 through 150 remain review-only by default and are not extraction runs.
