# AG 50 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table`
- source reference: Actuarial Guideline L
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-4`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- pages 1-4 are the full confirmed scope.

Observed section windows:

- `ag50-background-purpose`, page 1: background and purpose for the 2013 IDI Valuation Table guidance.
- `ag50-credibility-ae-lag`, pages 2-3: credibility weighting, A/E ratio, lag period, monthly indemnity, and company experience rules.
- `ag50-company-definition-exemption`, page 4: company definition, own-experience measurement exemption, and closing boundary.

Boundaries:

- Keep AG 50 planning focused on the active AG 50 PDF only.
- Do not widen into later guideline files.
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

## Topic Map

### Background and purpose

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
- boundary note: keep the opening guidance and purpose together as one narrow review-only slice.

### Credibility, A/E ratio, lag period, and monthly indemnity

- pages `2-3`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the credibility, A/E, lag-period, and monthly-indemnity guidance together as one narrow review-only slice.

### Company definition, own-experience exemption, and closing boundary

- page `4`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the company-definition and exemption material together as one narrow review-only slice.

## Proposed Batch Sequence

### batch-160

- topic ids: `ag50-background-purpose`
- title: AG 50 background and purpose slice
- page target: `1`
- rationale: capture the opening guidance and purpose as one narrow review-only slice while keeping the later mechanics and exemption language out of the batch.
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

### batch-161

- topic ids: `ag50-credibility-ae-lag`
- title: AG 50 credibility, A/E ratio, lag period, and monthly indemnity slice
- page target: `2-3`
- rationale: capture the credibility weighting, A/E ratio, lag period, and monthly-indemnity guidance as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - regulatory_requirement
  - definition_or_terminology
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

### batch-162

- topic ids: `ag50-company-definition-exemption`
- title: AG 50 company definition, own-experience exemption, and closing boundary slice
- page target: `4`
- rationale: capture the company-definition and own-experience exemption as one narrow review-only slice and stop at the closing boundary.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - regulatory_requirement
  - definition_or_terminology
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

## Review Standards

- `regulatoryRequirement`: treat the authority, scope, credibility rules, A/E rules, and exemption instructions as regulatory text when they direct what the company must do.
- `definitionOrTerminology`: treat company, claim termination rate, A/E ratio, credibility weighting factor, lag period, and similar labels as terminology when the text explains rather than directs.
- `reserveMethodStructure`: treat any method framing as structure only when the source operationalizes it; otherwise keep it as cross-reference context.
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
- `crossReferenceMapping`: treat references to the 2013 IDI Valuation Table, Health Insurance Reserves Model Regulation, or related tables as cross-reference context unless operationalized.
- `backgroundContent`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the encoded text layer and the exemption boundary as requiring human review unless the source text is explicit.

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
- The AG 50 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 50 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for the noisy text layer.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Credibility-weighting and A/E scope checks.
- Lag-period and monthly-indemnity context checks.
- Closing-boundary checks against the next guideline file.

### script implications

- `scripts/ag50-batch-definitions.mjs` should stay synchronized with the planned batch-160 through batch-162 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 50 definition file so the shared runner can find batches 160-162.
- `scripts/validate-scaffold.mjs` should verify that the AG 50 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet because the AG 50 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 50 planning artifact. Planned batches 160 through 162 remain review-only by default and are not extraction runs.
