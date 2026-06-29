# Regulation 210 Extraction Plan

## Source Scope

- source family: `ny_regulations`
- primary source file: `NY Regulations/Reg-210-11-NYCRR-S048.pdf`
- source folder: `NY Regulations`
- source title: `Life Insurance and Annuity Non-Guaranteed Elements`
- source reference: `11 NYCRR Part 48 (Insurance Regulation 210)`
- source status: `active`
- source status note: official adoption text effective March 19, 2018; page 10 is a blank trailing page and should remain boundary context only.
- domain: `naic_regulatory`
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-10`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators and line references should be preserved where available because this is a text-based PDF source.

Observed section windows:

- `reg210-opening-purpose-scope-definitions`, pages 1-3: title page, purpose, scope, and initial definitions.
- `reg210-criteria-non-guaranteed-elements`, pages 4-6: qualified actuary, board-approved criteria, and non-guaranteed elements.
- `reg210-filing-records-closeout`, pages 7-9: filing and records requirements.

Boundaries:

- Keep Regulation 210 focused on the non-guaranteed-elements rule only.
- Keep AG files and practice notes out of this wave.
- Preserve page locators and line references where available because this is a text-based PDF source.
- Treat page 10 as blank trailing boundary context and do not treat it as substantive content.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No AG files or practice notes in the same wave.

## Topic Map

### Opening title, purpose, scope, and definitions

- pages `1-3`
- review complexity: `medium`
- expected issue types: `regulatory_requirement`, `definition_or_terminology`, `background_content`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `life insurance`, `annuity contracts`, `non-guaranteed elements`, `current scale`, `index account parameter`
- boundary note: keep the title page and the opening purpose/scope/definition material together and stop before the qualification criteria begin.

### Qualified actuary, board-approved criteria, and non-guaranteed elements

- pages `4-6`
- review complexity: `high`
- expected issue types: `regulatory_requirement`, `governance_or_control_expectation`, `company_or_prudent_estimate_assumption`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `qualified actuary`, `anticipated experience factors`, `board-approved criteria`, `pricing cells`, `unfairly discriminate`
- boundary note: keep the qualification criteria and non-guaranteed-elements rules together and stop before filing and records begin.

### Filing and records requirements

- pages `7-9`
- review complexity: `high`
- expected issue types: `reporting_requirement`, `documentation_expectation`, `regulatory_requirement`, `governance_or_control_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `actuarial memorandum`, `May 1`, `Superintendent`, `records`, `Insurance Regulation 152`
- boundary note: keep the filing and records material together and stop before the blank trailing page.

## Proposed Batch Sequence

### batch-186

- topic ids: `reg210-opening-purpose-scope-definitions`
- title: `Regulation 210 opening title, purpose, scope, and definitions slice`
- page target: `1-3`
- rationale: capture the title page, purpose, scope, and opening definitions as one narrow review-only slice.
- review complexity: `medium`
- expected issue types: `regulatory_requirement`, `definition_or_terminology`, `background_content`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: `true`
- same stop conditions as VM-20: `true`
- automation fit: `same-stop-conditions`

### batch-187

- topic ids: `reg210-criteria-non-guaranteed-elements`
- title: `Regulation 210 qualified actuary, board-approved criteria, and non-guaranteed elements slice`
- page target: `4-6`
- rationale: capture the qualification criteria and non-guaranteed-elements rules before the filing and records section begins.
- review complexity: `high`
- expected issue types: `regulatory_requirement`, `governance_or_control_expectation`, `company_or_prudent_estimate_assumption`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: `true`
- same stop conditions as VM-20: `true`
- automation fit: `same-stop-conditions`

### batch-188

- topic ids: `reg210-filing-records-closeout`
- title: `Regulation 210 filing and records closeout slice`
- page target: `7-9`
- rationale: capture the filing and records requirements as the final narrow review-only slice and keep the closing boundary explicit.
- review complexity: `high`
- expected issue types: `reporting_requirement`, `documentation_expectation`, `regulatory_requirement`, `governance_or_control_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: `true`
- same stop conditions as VM-20: `true`
- automation fit: `same-stop-conditions`

## Review Standards

- `regulatoryRequirement`: treat the purpose, scope, requirements, and filing instructions as regulatory text when they direct what the company must do.
- `definitionOrTerminology`: treat non-guaranteed elements, qualified actuary, pricing cell, and related terms as terminology when the text explains rather than directs.
- `companyOrPrudentEstimateAssumption`: treat anticipated experience factors and reasonableness language as assumption-layer material when they appear.
- `governanceOrControlExpectation`: treat board-approved criteria, qualified actuary requirements, and superintendent review language as governance or control expectations when they appear.
- `reportingRequirement`: treat filing and annual submission instructions as reporting requirements if they appear.
- `documentationExpectation`: treat actuarial memorandum and records retention instructions as documentation expectations if they appear.
- `crossReferenceMapping`: treat references to Insurance Regulation 152, business law, policy form review, and other statutory provisions as cross-reference context unless operationalized.
- `backgroundContent`: treat the title page and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the non-guaranteed-elements justification language and any dense regulatory text as requiring human review unless the source text is explicit.

## Promotion Gates

- default state: `review_only`
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
- The Regulation 210 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active, with the blank trailing page noted as boundary context.
- Each planned batch must have a matching batch definition.
- The Regulation 210 batch definition file must stay synchronized with the plan.
- Page locators and line references should remain visible in the review packet where available.

### future checks suggested

- Keep the plan portable if later NY-regulation amendments need to be split into a companion wave.
- Keep the review-only guardrails visible until the review index and self-review note are created.

## Operating Note

- This is a text-based PDF source, so page locators are the primary anchor and line references should be preserved where available.
- The active regulation text should remain visible as a review-only caveat rather than a promotion signal.
- Keep the filing and records closeout separate so the source ends at a visible boundary.
