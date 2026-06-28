# AG 43 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 43 - CARVM for Variable Annuities.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 43 - CARVM for Variable Annuities`
- source reference: Actuarial Guideline XLIII
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-71`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- pages 1-71 are the full confirmed scope.

Observed section windows:

- `ag43-background-scope-definitions`, pages 1-5: background, scope, definitions, and the opening reserve-methodology principles.
- `ag43-reserve-methodology-core`, pages 6-9: reserve methodology continuation and effective-date language.
- `ag43-cte-reinsurance-reporting`, pages 10-19: Appendix 1 CTE guidance and Appendix 2 reinsurance / statutory reporting issues.
- `ag43-standard-scenario`, pages 20-28: Appendix 3 standard scenario requirements.
- `ag43-alternative-methodology-and-calibration`, pages 29-43: Appendix 4 alternative methodology and Appendix 5 scenario calibration criteria.
- `ag43-allocation-and-aggregation`, pages 44-50: Appendix 6 allocation of aggregate reserves to the contract level.
- `ag43-hedges-and-certification`, pages 51-58: Appendix 7 modeling of hedges and Appendix 8 certification requirements.
- `ag43-behavior-and-mortality`, pages 59-67: Appendix 9 contractholder behavior and Appendix 10 prudent-estimate mortality guidance opener.
- `ag43-mortality-table-and-closing-boundary`, pages 68-71: Appendix 10 continuation, mortality table material, and the closing boundary.

Boundaries:

- Keep planning focused on the active AG 43 PDF only.
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
- AG 44 remains out of scope for this wave.

## Topic Map

### Background, scope, definitions, and opening principles

- pages `1-5`
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
- boundary note: keep the opening guidance and the first reserve-methodology principles together as a narrow review-only slice.

### Reserve methodology continuation and effective date

- pages `6-9`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the reserve-methodology follow-through and effective-date language together as a second narrow slice.

### Appendix 1 CTE guidance and Appendix 2 reinsurance / reporting issues

- pages `10-19`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - calculation_structure
  - formula_context
  - reinsurance
  - reporting_requirement
  - documentation_expectation
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the CTE and reinsurance/reporting material together, but do not pull Appendix 3 into the same batch.

### Appendix 3 standard scenario requirements

- pages `20-28`
- review complexity: high
- expected issue types:
  - scenario_or_stochastic_requirement
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the standard-scenario requirements narrow and separate from the later alternative-methodology material.

### Appendix 4 alternative methodology and Appendix 5 scenario calibration

- pages `29-43`
- review complexity: high
- expected issue types:
  - scenario_or_stochastic_requirement
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - governance_or_control_expectation
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the alternative-methodology and calibration language together, but do not absorb the aggregate-reserve allocation appendix.

### Appendix 6 allocation of aggregate reserves to the contract level

- pages `44-50`
- review complexity: high
- expected issue types:
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - governance_or_control_expectation
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the allocation language separate from the hedge and certification appendices.

### Appendix 7 modeling of hedges and Appendix 8 certification requirements

- pages `51-58`
- review complexity: high
- expected issue types:
  - hedging_or_risk_mitigation
  - regulatory_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the hedge-modeling and certification material together, but do not pull contractholder-behavior guidance into the same batch.

### Appendix 9 contractholder behavior and Appendix 10 prudent-estimate mortality opener

- pages `59-67`
- review complexity: high
- expected issue types:
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - documentation_expectation
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the contractholder-behavior and mortality-assumption opening material together as the mortality-focused tail slice.

### Appendix 10 continuation, mortality table material, and closing boundary

- pages `68-71`
- review complexity: high
- expected issue types:
  - definition_or_terminology
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the mortality table material and the closing boundary together, then stop before AG 44.

## Proposed Batch Sequence

### batch-140

- topic ids: `ag43-background-scope-definitions`
- title: AG 43 background, scope, definitions, and opening principles slice
- page target: `1-5`
- rationale: capture the opening guidance, scope, definitions, and the first reserve-methodology principles as one narrow review-only batch.
- review complexity: high
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

### batch-141

- topic ids: `ag43-reserve-methodology-core`
- title: AG 43 reserve methodology continuation and effective-date slice
- page target: `6-9`
- rationale: capture the remainder of the opening reserve-methodology guidance and the effective-date language without widening into Appendix 1.
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

### batch-142

- topic ids: `ag43-cte-reinsurance-reporting`
- title: AG 43 CTE, reinsurance, and statutory reporting slice
- page target: `10-19`
- rationale: keep Appendix 1 and Appendix 2 together so the CTE framework and the reinsurance/reporting caveats stay review-only and do not spill into Appendix 3.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - calculation_structure
  - reinsurance
  - reporting_requirement
  - documentation_expectation
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-143

- topic ids: `ag43-standard-scenario`
- title: AG 43 standard scenario requirements slice
- page target: `20-28`
- rationale: capture the standard-scenario requirements as a narrow stochastic-mechanics batch before the alternative-methodology material begins.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - scenario_or_stochastic_requirement
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-144

- topic ids: `ag43-alternative-methodology-and-calibration`
- title: AG 43 alternative methodology and calibration slice
- page target: `29-43`
- rationale: keep the alternative-methodology and scenario-calibration guidance together so the calibration-heavy material stays in one review-only slice.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - scenario_or_stochastic_requirement
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - governance_or_control_expectation
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-145

- topic ids: `ag43-allocation-and-aggregation`
- title: AG 43 allocation of aggregate reserves to the contract level slice
- page target: `44-50`
- rationale: isolate the aggregate-reserve allocation mechanics so they do not absorb the hedge or certification material.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - governance_or_control_expectation
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-146

- topic ids: `ag43-hedges-and-certification`
- title: AG 43 hedge modeling and certification slice
- page target: `51-58`
- rationale: keep the hedge-modeling guidance and certification requirements together while leaving the behavior and mortality assumptions for the next batch.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - hedging_or_risk_mitigation
  - regulatory_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-147

- topic ids: `ag43-behavior-and-mortality`
- title: AG 43 contractholder behavior and mortality guidance slice
- page target: `59-67`
- rationale: keep the contractholder-behavior and prudent-estimate mortality guidance together so the behavioral and assumption material stays review-only and source-bound.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - documentation_expectation
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-148

- topic ids: `ag43-mortality-table-and-closing-boundary`
- title: AG 43 mortality table and closing boundary slice
- page target: `68-71`
- rationale: close out the mortality-table guidance and stop cleanly at the AG 44 boundary.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - definition_or_terminology
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatory_requirement`: treat the background, scope, reserve, appendix, certification, and disclosure language as regulatory text when it directs what the appointed actuary must do.
- `definition_or_terminology`: treat mortality-table labels, contractholder-behavior terms, scenario labels, and reserve-method labels as terminology when the text explains rather than directs.
- `reserve_method_structure`: treat the CARVM framework, aggregate-reserve allocation, and reserve-mechanics sections as reserve structure.
- `calculation_structure`: treat the CTE, scenario, calibration, and mortality-selection logic as calculation structure.
- `formula_context`: treat the CTE references, stochastic-model references, and mortality-adjustment references as formula context unless explicit computational rules are given.
- `prescribed_assumption`: treat any requirement that fixes a mortality, lapse, behavior, or scenario assumption as prescribed assumption.
- `company_or_prudent_estimate_assumption`: treat assumptions that rely on company experience or prudent-estimate judgment as company / prudent-estimate assumptions.
- `scenario_or_stochastic_requirement`: treat scenario design, stochastic modeling, and scenario calibration as stochastic requirements.
- `asset_modeling_judgment`: treat any hedge or asset-modeling choice that requires actuarial judgment as asset-modeling judgment.
- `hedging_or_risk_mitigation`: treat hedge-modeling language as hedging / risk mitigation.
- `reinsurance`: treat Appendix 2 and any reinsurance-related caveats as reinsurance context.
- `reporting_requirement`: treat certification, report, and statutory-reporting instructions as reporting requirements.
- `documentation_expectation`: treat documentation, support, and memo language as documentation expectations.
- `governance_or_control_expectation`: treat certification, controls, and approval requirements as governance or control expectations.
- `cross_reference_mapping`: treat references to VM chapters, the Standard Valuation Law, the Model Regulation, and appendices as cross-reference context unless operationalized.
- `background_content`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundary_control_window`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requires_human_interpretation`: treat the encoded text layer, long appendix tables, and judgment-heavy assumption boundaries as requiring human review unless the source text is explicit.

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
- The AG 43 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 43 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for the noisy text layer.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Appendix boundary checks.
- Hedging, mortality, and scenario-boundary checks.

### script implications

- `scripts/ag43-batch-definitions.mjs` should stay synchronized with the planned batch-140 through batch-148 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 43 definition file so the shared runner can find batch-140 through batch-148.
- `scripts/validate-scaffold.mjs` should verify that the AG 43 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet because the AG 43 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 43 planning artifact. Planned batches 140 through 148 remain review-only by default and are not extraction runs.
