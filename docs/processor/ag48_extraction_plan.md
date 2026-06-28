# AG 48 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuati.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuation of Life Insurance Policies Model Regulation (Model 830)`
- source reference: Actuarial Guideline XLVIII
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-12`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- pages 1-12 are the full confirmed scope.

Observed section windows:

- `ag48-background-authority-scope`, pages 1-4: background, authority, scope, and initial reinsurance framing.
- `ag48-security-and-method`, pages 5-8: reinsurance exemptions, definitions, primary security, and actuarial method.
- `ag48-opinion-memorandum-sunset`, pages 9-12: opinion and memorandum requirements, additional requirements, and sunset boundary.

Boundaries:

- Keep planning focused on the active AG 48 PDF only.
- Do not widen into the 2021 Law Manual reprint.
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
- The 2021 Law Manual reprint remains out of scope for this wave.

## Topic Map

### Background, authority, scope, and initial reinsurance framing

- pages `1-4`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reinsurance
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the background, authority, scope, and opening reinsurance framing together as one narrow review-only slice.

### Reinsurance exemptions, definitions, primary security, and actuarial method

- pages `5-8`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reinsurance
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the exemption, definition, primary-security, and actuarial-method material together as one narrow review-only slice.

### Opinion and memorandum requirements, additional requirements, and sunset boundary

- pages `9-12`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - reinsurance
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- boundary note: keep the opinion, memorandum, and sunset language together as one narrow review-only slice.

## Proposed Batch Sequence

### batch-154

- topic ids: `ag48-background-authority-scope`
- title: AG 48 background, authority, and scope slice
- page target: `1-4`
- rationale: capture the opening guidance and initial reinsurance framing as one narrow review-only slice while keeping the 2021 Law Manual reprint out of the batch.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - regulatory_requirement
  - definition_or_terminology
  - reinsurance
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-155

- topic ids: `ag48-security-and-method`
- title: AG 48 reinsurance exemptions, security, and method slice
- page target: `5-8`
- rationale: capture the reinsurance exemptions, primary-security definitions, and actuarial-method rules as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - regulatory_requirement
  - definition_or_terminology
  - reinsurance
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

### batch-156

- topic ids: `ag48-opinion-memorandum-sunset`
- title: AG 48 opinion, memorandum, and sunset slice
- page target: `9-12`
- rationale: capture the opinion and memorandum requirements plus the sunset boundary as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - page_image_confirmation
  - regulatory_requirement
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - reinsurance
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatoryRequirement`: treat the authority, scope, reinsurance applicability, opinion language, and memorandum requirements as regulatory text when they direct what the company must do.
- `definitionOrTerminology`: treat defined terms, primary security, covered policies, and similar labels as terminology when the text explains rather than directs.
- `reserveMethodStructure`: treat any method framing as structure only when the source operationalizes it; otherwise keep it as cross-reference context.
- `calculationStructure`: treat calculation structure as review-only context unless the guideline explicitly prescribes a computation step.
- `formulaContext`: treat formulas as context when they support the review slice but do not promote them into learner-facing content.
- `prescribedAssumption`: treat prescribed assumptions as review-only source text when the guideline explicitly directs a company assumption.
- `companyOrPrudentEstimateAssumption`: treat company or prudent-estimate assumptions as review-only when the source distinguishes company judgment from prescribed rules.
- `scenarioOrStochasticRequirement`: treat scenario or stochastic requirements as review-only context when the guideline references them.
- `assetModelingJudgment`: treat asset-modeling judgment as a separate review-only category when the text requires a human judgment call.
- `hedgingOrRiskMitigation`: treat hedging or risk-mitigation references as review-only context when the source mentions them.
- `reinsurance`: treat references to reinsurance treaties, ceded liabilities, and reinsurance arrangements as reinsurance content when the source explicitly addresses them.
- `reportingRequirement`: treat actuarial opinion, certification, and statutory filing instructions as reporting requirements.
- `documentationExpectation`: treat memorandum, support, and analysis instructions as documentation expectations.
- `governanceOrControlExpectation`: treat commissioner approval, determinations, and control language as governance or control expectations.
- `crossReferenceMapping`: treat references to Model 830, VM-30, VM-21, VM-22, Model 785, Model 787, and AG 38 as cross-reference context unless operationalized.
- `backgroundContent`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the encoded text layer, the reinsurance scope, and the sunset boundary as requiring human review unless the source text is explicit.

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
- The AG 48 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 48 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for the noisy text layer.
- The 2021 Law Manual reprint must remain out of scope for this wave.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Reinsurance scope checks.
- Primary-security and actuarial-method context checks.
- Opinion / memorandum / sunset boundary checks.

### script implications

- `scripts/ag48-batch-definitions.mjs` should stay synchronized with the planned batch-154 through batch-156 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 48 definition file so the shared runner can find batches 154-156.
- `scripts/validate-scaffold.mjs` should verify that the AG 48 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet because the AG 48 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 48 planning artifact. Planned batches 154 through 156 remain review-only by default and are not extraction runs.
