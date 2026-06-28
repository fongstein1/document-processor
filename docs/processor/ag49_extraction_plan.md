# AG 49 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest`
- source reference: Actuarial Guideline XLIX
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-4`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- pages 1-4 are the full confirmed scope.

Observed section windows:

- `ag49-background-applicability`, page 1: background, effective dates, scope, and opening definitions.
- `ag49-benchmark-account-current-scale`, pages 2-3: benchmark/index account rules, disciplined current scale, policy loans, and opening additional standards.
- `ag49-alternate-scale-disclosures`, page 4: alternate scale, disclosure tables, and closing boundary.

Boundaries:

- Keep planning focused on the active AG 49 PDF only.
- Do not widen into AG 50.
- Keep the page-image wording backstop because the text layer is encoding-noisy and stable line references are not expected.
- Use page locators rather than line locators when the text layer does not support stable line mapping.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.
- Keep later guideline files out of scope for this wave.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No later guideline files in the same wave.
- AG 50 remains out of scope for this wave.

## Topic Map

### Background, applicability, and opening benchmark setup

- page `1`
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
- boundary note: keep the background, applicability, and opening guidance together as one narrow review-only slice.

### Benchmark index account rules and disciplined current scale

- pages `2-3`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - hedging_or_risk_mitigation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the benchmark-index account rules, disciplined current scale, and hedging-program language together as one narrow review-only slice.

### Alternate scale, disclosure tables, and closing boundary

- page `4`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - hedging_or_risk_mitigation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the alternate scale, illustration tables, and closing boundary together as one narrow review-only slice.

## Proposed Batch Sequence

### batch-157

- topic ids: `ag49-background-applicability`
- title: AG 49 background, applicability, and opening definitions slice
- page target: `1`
- rationale: capture the opening guidance, effective dates, scope, and opening definitions as one narrow review-only slice while keeping the later benchmark-account and disclosure language out of the batch.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-158

- topic ids: `ag49-benchmark-account-current-scale`
- title: AG 49 benchmark account, disciplined current scale, and policy-loan slice
- page target: `2-3`
- rationale: capture the benchmark-index account rules, disciplined current scale, policy loans, and opening additional standards as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - hedging_or_risk_mitigation
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-159

- topic ids: `ag49-alternate-scale-disclosures`
- title: AG 49 alternate scale, disclosure tables, and closing boundary slice
- page target: `4`
- rationale: capture the alternate scale, disclosure tables, and closing boundary as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - hedging_or_risk_mitigation
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatoryRequirement`: treat the authority, scope, hedging-program limits, alternate-scale instructions, and disclosure requirements as regulatory text when they direct what the company must do.
- `definitionOrTerminology`: treat benchmark index account, fixed account, disciplined current scale, and similar labels as terminology when the text explains rather than directs.
- `reserveMethodStructure`: treat any method framing as structure only when the source operationalizes it; otherwise keep it as cross-reference context.
- `calculationStructure`: treat calculation structure as review-only context unless the guideline explicitly prescribes a computation step.
- `formulaContext`: treat formulas as context when they support the review slice but do not promote them into learner-facing content.
- `prescribedAssumption`: treat prescribed assumptions as review-only source text when the guideline explicitly directs a company assumption.
- `companyOrPrudentEstimateAssumption`: treat company or prudent-estimate assumptions as review-only when the source distinguishes company judgment from prescribed rules.
- `scenarioOrStochasticRequirement`: treat scenario or stochastic requirements as review-only context when the guideline references them.
- `assetModelingJudgment`: treat asset-modeling judgment as a separate review-only category when the text requires a human judgment call.
- `hedgingOrRiskMitigation`: treat hedging-program and index-credit references as review-only context when the source mentions them.
- `reinsurance`: treat reinsurance references as review-only context if they appear, but do not force reinsurance into the batch unless the text explicitly addresses it.
- `reportingRequirement`: treat illustration-disclosure and certification instructions as reporting requirements.
- `documentationExpectation`: treat disclosure and supporting-text instructions as documentation expectations.
- `governanceOrControlExpectation`: treat commissioner approval, determinations, and control language as governance or control expectations.
- `crossReferenceMapping`: treat references to Model 582, benchmark index accounts, fixed accounts, VM-30, VM-21, VM-22, and AG 48 as cross-reference context unless operationalized.
- `backgroundContent`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the encoded text layer, the hedging-program language, and the closing disclosure boundary as requiring human review unless the source text is explicit.

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
- The AG 49 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 49 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for the noisy text layer.
- AG 50 must remain out of scope for this wave.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Benchmark-index-account and hedging-program scope checks.
- Alternate-scale and disclosure-table context checks.
- Closing boundary checks against AG 50.

### script implications

- `scripts/ag49-batch-definitions.mjs` should stay synchronized with the planned batch-157 through batch-159 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 49 definition file so the shared runner can find batches 157-159.
- `scripts/validate-scaffold.mjs` should verify that the AG 49 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet because the AG 49 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 49 planning artifact. Planned batches 157 through 159 remain review-only by default and are not extraction runs.
