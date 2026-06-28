# AG 51 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 51-AAT for LTC from 2021 Valuation Law Manual.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 51-AAT for LTC from 2021 Valuation Law Manual`
- source reference: Actuarial Guideline LI
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-5`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- pages 1-5 are the full confirmed scope.

Observed section windows:

- `ag51-background-scope-definitions`, pages 1-3: background, effective date, authority, scope, projected high net yield asset definitions, exclusions, and the closing part of the asset-adequacy framing.
- `ag51-documentation-closeout`, pages 4-5: documentation requirements, memorandum instructions, and the closing LTC asset-adequacy guidance.

Boundaries:

- Keep AG 51 focused on the active LTC asset-adequacy-testing guideline only.
- Do not widen into AG 52 or later guideline files.
- Keep the future VM-30 incorporation note visible as review-only context.
- Use page locators rather than line locators; line references are not expected for this PDF runner path.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No AG 52 text note or later guideline files in the same wave.

## Topic Map

### Background, scope, and projected-high-net-yield-asset definitions

- pages `1-3`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - reinsurance
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the LTC asset-adequacy framing, the projected-high-net-yield-asset definitions, and the exclusions together as one narrow review-only slice.

### Documentation requirements and memorandum closeout

- pages `4-5`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the memorandum documentation requirements together as one narrow review-only slice and stop at the closing AG 51 boundary.

## Proposed Batch Sequence

### batch-163

- topic ids: `ag51-background-scope-definitions`
- title: AG 51 background, scope, and definitions slice
- page target: `1-3`
- rationale: capture the opening guidance, effective date, authority, scope, projected-high-net-yield-asset definitions, and exclusions as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - reinsurance
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-164

- topic ids: `ag51-documentation-closeout`
- title: AG 51 documentation requirements and closeout slice
- page target: `4-5`
- rationale: capture the documentation requirements, memorandum instructions, and closing LTC asset-adequacy guidance as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatoryRequirement`: treat the authority, scope, analysis, and documentation instructions as regulatory text when they direct what the company must do.
- `definitionOrTerminology`: treat LTC, projected high net yield assets, fair value, guideline excess spread, and similar labels as terminology when the text explains rather than directs.
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
- `crossReferenceMapping`: treat references to VM-25, VM-30, ASOP 22, or related tables as cross-reference context unless operationalized.
- `backgroundContent`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the future VM-30 incorporation note and any dense LTC-asset-adequacy wording as requiring human review unless the source text is explicit.

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
- The AG 51 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 51 batch definition file must stay synchronized with the plan.
- Page locators remain the primary review anchor, and line references are not expected from the PDF runner.

### future checks suggested

- Cross-reference mapping checks against VM-25 and VM-30.
- Future-incorporation-note checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Documentation-slice boundary checks against any later guideline file.

### script implications

- `scripts/ag51-batch-definitions.mjs` should stay synchronized with the planned batch-163 through batch-164 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 51 definition file so the shared runner can find batches 163-164.
- `scripts/validate-scaffold.mjs` should verify that the AG 51 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- Page locators should remain visible in the review packet because the PDF runner does not emit stable line references for this source.

## Operating Note

Controlled AG 51 planning artifact. Planned batches 163 and 164 remain review-only by default and are not extraction runs.
