# AG 53 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 53-AAT as adopted by LATF-20220616.pdf`
- source folder: `Actuarial Guidelines`
- source title: `Application of the Valuation Manual for Testing the Adequacy of Life Insurer Reserves`
- source reference: Actuarial Guideline AAT
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-7`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- pages 1-7 are the full confirmed scope.

Observed section windows:

- `ag53-background-scope-definitions`, pages 1-2: background, purpose, scope thresholds, and projected high net yield asset definitions.
- `ag53-asset-adequacy-considerations`, pages 3-5: asset adequacy considerations, modeling expectations, fair value, reinsurance modeling, borrowing, and sensitivity-test entry points.
- `ag53-reporting-review-appendix`, pages 6-7: reporting, review, templates, and appendix benchmark material.

Boundaries:

- Keep AG 53 focused on the active life-insurer reserve adequacy testing guidance only.
- Do not widen into AG 54 or AG 55 or later guideline files.
- Keep page locators rather than line locators; line references are not expected for this PDF runner path.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No AG 54 or AG 55 files in the same wave.

## Topic Map

### Background, scope, and projected-high-net-yield-asset definitions

- pages `1-2`
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
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - VM-30
  - projected high net yield assets
  - complex assets
  - asset adequacy analysis
  - future valuation year
- boundary note: keep the opening guidance, scope thresholds, and projected-high-net-yield-asset definitions together as one narrow review-only slice.

### Asset adequacy considerations and modeling expectations

- pages `3-5`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - scenario_or_stochastic_requirement
  - asset_modeling_judgment
  - reinsurance
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - complex assets
  - fair value
  - reinsurance modeling
  - borrowing
  - simplifications
  - sensitivity tests
- boundary note: keep the complex-asset modeling expectations, reinsurance modeling, borrowing, and the sensitivity-test entry points together as one narrow review-only slice.

### Reporting, review, templates, and appendix benchmark

- pages `6-7`
- review complexity: high
- expected issue types:
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - VAWG
  - VM-30 memorandum
  - Appendix I benchmark
  - guideline excess spread
- boundary note: keep the reporting, review, and template guidance together with the appendix benchmark as one narrow review-only slice.

## Proposed Batch Sequence

### batch-165

- topic ids: `ag53-background-scope-definitions`
- title: AG 53 background, scope, and definitions slice
- page target: `1-2`
- rationale: capture the opening guidance, scope thresholds, and projected-high-net-yield-asset definitions as one narrow review-only slice.
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
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-166

- topic ids: `ag53-asset-adequacy-considerations`
- title: AG 53 asset adequacy considerations and modeling slice
- page target: `3-5`
- rationale: capture the asset adequacy considerations, modeling expectations, fair value, reinsurance modeling, borrowing, and sensitivity-test entry points as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - scenario_or_stochastic_requirement
  - asset_modeling_judgment
  - reinsurance
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-167

- topic ids: `ag53-reporting-review-appendix`
- title: AG 53 reporting, review, templates, and appendix benchmark slice
- page target: `6-7`
- rationale: capture the reporting, review, and template guidance together with the appendix benchmark as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatoryRequirement`: treat the authority, scope, analysis, and documentation instructions as regulatory text when they direct what the company must do.
- `definitionOrTerminology`: treat projected high net yield assets, fair value, guideline excess spread, and similar labels as terminology when the text explains rather than directs.
- `reserveMethodStructure`: treat the asset-adequacy-analysis framing as structure only when the source operationalizes it; otherwise keep it as cross-reference context.
- `calculationStructure`: treat calculation structure as review-only context unless the guideline explicitly prescribes a computation step.
- `formulaContext`: treat formulas as context when they support the review slice but do not promote them into learner-facing content.
- `prescribedAssumption`: treat prescribed assumptions as review-only source text when the guideline explicitly directs a company assumption.
- `companyOrPrudentEstimateAssumption`: treat company or prudent-estimate assumptions as review-only when the source distinguishes company judgment from prescribed rules.
- `scenarioOrStochasticRequirement`: treat scenario or stochastic requirements as review-only context when the guideline references them.
- `assetModelingJudgment`: treat asset-modeling judgment as a separate review-only category when the text requires a human judgment call.
- `hedgingOrRiskMitigation`: treat hedging references as review-only context if they appear, but do not force hedging into the batch unless the text explicitly addresses it.
- `reinsurance`: treat reinsurance references as review-only context if they appear, but do not force reinsurance into the batch unless the text explicitly addresses it.
- `reportingRequirement`: treat certification or reporting instructions as reporting requirements if they appear.
- `documentationExpectation`: treat supporting-text instructions as documentation expectations if they appear.
- `governanceOrControlExpectation`: treat commissioner approval, determinations, and control language as governance or control expectations if they appear.
- `crossReferenceMapping`: treat references to VM-30, ASOPs, VAWG, or related tables as cross-reference context unless operationalized.
- `backgroundContent`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the future implementation note and any dense asset-adequacy wording as requiring human review unless the source text is explicit.

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
- The AG 53 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 53 batch definition file must stay synchronized with the plan.
- Page locators remain the primary review anchor, and line references are not expected from the PDF runner.

### future checks suggested

- Cross-reference mapping checks against VM-30 and the appendix benchmark.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Documentation-slice boundary checks against AG 54 and AG 55.

### script implications

- `scripts/ag53-batch-definitions.mjs` should stay synchronized with the planned batch-165 through batch-167 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 53 definition file so the shared runner can find batches 165-167.
- `scripts/validate-scaffold.mjs` should verify that the AG 53 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- Page locators should remain visible in the review packet because the PDF runner does not emit stable line references for this source.

## Operating Note

Controlled AG 53 planning artifact. Planned batches 165, 166, and 167 remain review-only by default and are not extraction runs.
