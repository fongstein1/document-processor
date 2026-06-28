# AG 54 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 54-Indexed Linked Variable Annuities (ILVA) Nonforfeiture as adopted by LATF-20221211.docx`
- source folder: `Actuarial Guidelines`
- source title: `Nonforfeiture Requirements for Index-Linked Variable Annuity Products`
- source reference: Actuarial Guideline LIV
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed paragraph range: `paragraphs 1-56`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- paragraph locators and line references should be preserved because this is a text-based Word source.

Observed section windows:

- `ag54-background-scope-definitions`, paragraphs 1-18: disclaimer, purpose, background, scope, principles, and core definitions.
- `ag54-methodology-consistency`, paragraphs 19-40: interim values, hypothetical portfolio methodology, market-value adjustment context, and consistency testing.
- `ag54-filing-certification-effective-date`, paragraphs 41-56: actuarial memorandum and certification requirements, descriptions, and effective date.

Boundaries:

- Keep AG 54 focused on the active LATF-adopted draft ILVA nonforfeiture guidance only and keep AG 53 and AG 55 out of scope for this wave.
- Treat the not-yet-committee-adopted disclaimer as a review-only caveat rather than a repeal or supersession signal.
- Preserve paragraph locators and line references where available because this is a text-based source.
- Keep the batch source-bound and review-only.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No AG 53 or AG 55 files in the same wave.

## Topic Map

### Background, scope, principles, and definitions

- paragraphs `1-18`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - background_content
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - Model 805
  - Model 250
  - variable annuity
  - separate account
  - ILVA / RILA terminology
- boundary note: keep the disclaimer, background, scope, principles, and core definitions together as one narrow review-only slice.

### Methodology and consistency slice

- paragraphs `19-40`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - asset_modeling_judgment
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - Hypothetical Portfolio
  - Index Strategy Base
  - Index Strategy Term
  - Interim Value
  - Trading Cost
  - fair value
  - market value adjustment
- boundary note: keep the methodology, interim-value, and consistency-testing material together as one narrow review-only slice.

### Filing, certification, descriptions, and effective date

- paragraphs `41-56`
- review complexity: high
- expected issue types:
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - regulatory_requirement
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - actuarial memorandum
  - actuarial certification
  - Model 250 Section 7
  - modeling technique disclosure
  - effective date
- boundary note: keep the filing, certification, description, and effective-date guidance together as one narrow review-only slice.

## Proposed Batch Sequence

### batch-168

- topic ids: `ag54-background-scope-definitions`
- title: AG 54 background, scope, principles, and definitions slice
- paragraph target: `1-18`
- rationale: capture the disclaimer, background, scope, principles, and core definitions as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - background_content
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-169

- topic ids: `ag54-methodology-consistency`
- title: AG 54 methodology and consistency slice
- paragraph target: `19-40`
- rationale: capture the interim-value, hypothetical-portfolio, market-value-adjustment, and consistency-testing material as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - asset_modeling_judgment
  - cross_reference_mapping
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-170

- topic ids: `ag54-filing-certification-effective-date`
- title: AG 54 filing, certification, descriptions, and effective date slice
- paragraph target: `41-56`
- rationale: capture the memorandum, certification, description, and effective-date guidance as one narrow review-only slice.
- review complexity: high
- expected issue types:
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - regulatory_requirement
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatoryRequirement`: treat the authority, scope, conditions, and effective-date instructions as regulatory text when they direct what the company must do.
- `definitionOrTerminology`: treat ILVA, Hypothetical Portfolio, Interim Value, Index Strategy, and related labels as terminology when the text explains rather than directs.
- `reserveMethodStructure`: treat the hypothetical-portfolio framing as structure only when the source operationalizes it; otherwise keep it as cross-reference context.
- `calculationStructure`: treat the interim-value and market-value-adjustment formulas as review-only context unless the guideline explicitly prescribes a computation step.
- `formulaContext`: treat formulas as context when they support the review slice but do not promote them into learner-facing content.
- `prescribedAssumption`: treat prescribed assumptions as review-only source text when the guideline explicitly directs a company assumption.
- `companyOrPrudentEstimateAssumption`: treat company or prudent-estimate assumptions as review-only when the source distinguishes company judgment from prescribed rules.
- `assetModelingJudgment`: treat fair-value, market-value-adjustment, and derivative-proxy judgments as a separate review-only category when the text requires a human judgment call.
- `scenarioOrStochasticRequirement`: treat scenario or stochastic requirements as review-only context when the guideline references them.
- `reportingRequirement`: treat actuarial memorandum and certification instructions as reporting requirements if they appear.
- `documentationExpectation`: treat supporting-text instructions as documentation expectations if they appear.
- `governanceOrControlExpectation`: treat committee references, compliance statements, and control language as governance or control expectations if they appear.
- `crossReferenceMapping`: treat references to Model 805, Model 250, fair value, and related tables as cross-reference context unless operationalized.
- `backgroundContent`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each paragraph window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the drafting note, consistency test language, and any dense valuation wording as requiring human review unless the source text is explicit.

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
- The AG 54 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 54 batch definition file must stay synchronized with the plan.
- Paragraph locators and line references should remain visible in the review packet.

### future checks suggested

- Cross-reference mapping checks against Model 805 and Model 250.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- Committee-adoption caveat checks.

### script implications

- `scripts/ag54-batch-definitions.mjs` should stay synchronized with the planned batch-168 through batch-170 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 54 definition file so the shared runner can find batches 168-170.
- `scripts/validate-scaffold.mjs` should verify that the AG 54 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- Paragraph locators and line references should remain visible in the review packet because this source is text-based.

## Operating Note

Controlled AG 54 planning artifact. Planned batches 168, 169, and 170 remain review-only by default and are not extraction runs.
