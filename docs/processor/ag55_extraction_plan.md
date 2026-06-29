# AG 55 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 55-Reinsurance AAT as adopted by LATF-20250610.docx`
- source folder: `Actuarial Guidelines`
- source title: `Application of the Valuation Manual for Testing the Adequacy of Reserves Related to Certain Life Reinsurance Treaties`
- source reference: Actuarial Guideline LV
- source status: active
- source status note: LATF-adopted draft guidance, pending committee adoption
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed paragraph range: `paragraphs 1-268`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- paragraph locators and line references should be preserved because this is a text-based Word source.

Observed section windows:

- `ag55-opening-effective-date`, paragraphs 1-18: disclaimer, background, and effective-date guidance.
- `ag55-scope-applicability`, paragraphs 19-38: scope and applicability refinement before definitions begin.
- `ag55-definitions-core-terms`, paragraphs 39-75: definitions for reserve and reinsurance terms.
- `ag55-risk-identification-analysis-documentation`, paragraphs 76-114: risk identification and documentation expectations.
- `ag55-cash-flow-testing-details`, paragraphs 115-161: starting asset amount rules, modeling expectations, and related documentation.
- `ag55-attribution-aggregation`, paragraphs 162-188: attribution analysis and aggregation considerations.
- `ag55-reporting-documentation-assumptions`, paragraphs 190-224: reporting, treaty information, and assumption documentation.
- `ag55-results-attribution-risk-identification`, paragraphs 225-255: cash-flow results, attribution, risk identification, and templates.
- `ag55-appendix-new-york-7-scenarios`, paragraphs 258-268: appendix interest-rate scenarios and closing boundary.

Boundaries:

- Keep AG 55 focused on the LATF-adopted draft reinsurance adequacy guidance only and keep AG 54 out of scope for this wave.
- Treat the opening disclaimer as a review-only caveat because the document is LATF-adopted but not yet committee-adopted.
- Preserve paragraph locators and line references where available because this is a text-based Word source.
- Keep the appendix separate from the main body so the closing boundary stays reviewable.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No AG 54 files in the same wave.

## Topic Map

### Opening disclaimer, background, and effective date

- paragraphs `1-18`
- review complexity: high
- expected issue types: `regulatory_requirement`, `background_content`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `VM-30`, `asset adequacy analysis`, `committee adoption status`
- boundary note: keep the disclaimer, background, and effective-date guidance together as one narrow review-only slice.

### Scope and applicability refinement

- paragraphs `19-38`
- review complexity: high
- expected issue types: `regulatory_requirement`, `definition_or_terminology`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `scope threshold`, `applying treaty`, `cedent / assuming company`, `exempted business`, `significant risk`
- boundary note: keep the scope and applicability material together and stop before the definitions section begins.

### Definitions and core terms

- paragraphs `39-75`
- review complexity: high
- expected issue types: `definition_or_terminology`, `reinsurance`, `reserve_method_structure`, `calculation_structure`, `formula_context`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `Alternative Run`, `Asset Intensive Reinsurance Transactions`, `Attribution Analysis`, `Deficient Block`, `Excess Capital`, `Guideline Excluded Assets`, `Pre-reinsurance Reserve`, `Post-reinsurance Reserve`, `Reserve Decrease`, `Similar Memorandum`, `Starting Asset Amount`, `Sufficient Block`
- boundary note: keep the definitions together as one review-only slice and stop before the risk-identification section begins.

### Risk identification and analysis/documentation expectations

- paragraphs `76-114`
- review complexity: high
- expected issue types: `regulatory_requirement`, `reinsurance`, `documentation_expectation`, `governance_or_control_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `collectability risk`, `reinsurer rating`, `trusts and funds withheld`, `risk mitigants`, `domestic regulator discretion`
- boundary note: keep the risk-identification language separate from the later cash-flow testing details.

### Cash-flow testing details

- paragraphs `115-161`
- review complexity: high
- expected issue types: `regulatory_requirement`, `calculation_structure`, `formula_context`, `prescribed_assumption`, `company_or_prudent_estimate_assumption`, `asset_modeling_judgment`, `reinsurance`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `Starting Asset Amount`, `Post-reinsurance Reserve`, `Alternative Run`, `Excess Capital`, `New York 7`, `VM-30`, `AG 53`
- boundary note: keep the starting-asset and projection guidance together, but do not absorb the attribution and aggregation sections.

### Attribution analysis and aggregation

- paragraphs `162-188`
- review complexity: high
- expected issue types: `reporting_requirement`, `documentation_expectation`, `calculation_structure`, `formula_context`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `reserve decrease`, `pre-reinsurance reserve`, `post-reinsurance reserve`, `aggregation by counterparty`, `deficient block`, `sufficient block`
- boundary note: keep the attribution and aggregation language together as a single review window and stop before the reporting section begins.

### Reporting, treaty documentation, and assumption information

- paragraphs `190-224`
- review complexity: high
- expected issue types: `reporting_requirement`, `documentation_expectation`, `governance_or_control_expectation`, `reinsurance`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `VM-30 actuarial memorandum`, `Schedule S`, `reserve credit`, `trust amount`, `funds withheld`, `net asset yield`, `mortality assumption`, `lapse assumption`, `benefit utilization`
- boundary note: keep the reporting and treaty documentation material together and stop before the cash-flow results and template worksheets material becomes the focus.

### Cash-flow results, attribution, risk identification, and templates

- paragraphs `225-255`
- review complexity: high
- expected issue types: `reporting_requirement`, `documentation_expectation`, `calculation_structure`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `ending surplus`, `New York 7 scenarios`, `sensitivity tests`, `interim negative results`, `attribution analysis template`, `Guideline Excluded Assets`, `risk mitigants`, `template worksheets`
- boundary note: keep the results, attribution, risk-identification, and template material together, but do not absorb the appendix scenario excerpt.

### Appendix 1 and closing boundary

- paragraphs `258-268`
- review complexity: medium
- expected issue types: `regulatory_requirement`, `formula_context`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `New York 7`, `interest rate scenarios`, `Regulation 126`
- boundary note: keep the appendix separate from the main body so the closing boundary remains explicit.

## Proposed Batch Sequence

### batch-171

- topic ids: `ag55-opening-effective-date`
- title: AG 55 opening disclaimer, background, and effective-date slice
- paragraph target: `1-18`
- rationale: capture the LATF-adopted-draft disclaimer, background, and effective-date guidance as one narrow review-only slice.
- review complexity: high
- expected issue types: `regulatory_requirement`, `background_content`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-172

- topic ids: `ag55-scope-applicability`
- title: AG 55 scope and applicability slice
- paragraph target: `19-38`
- rationale: capture the scope and applicability refinement before definitions begin.
- review complexity: high
- expected issue types: `regulatory_requirement`, `definition_or_terminology`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-173

- topic ids: `ag55-definitions-core-terms`
- title: AG 55 definitions and core terms slice
- paragraph target: `39-75`
- rationale: capture the reserve and reinsurance terminology as one narrow review-only slice.
- review complexity: high
- expected issue types: `definition_or_terminology`, `reinsurance`, `reserve_method_structure`, `calculation_structure`, `formula_context`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-174

- topic ids: `ag55-risk-identification-analysis-documentation`
- title: AG 55 risk identification and analysis/documentation expectations slice
- paragraph target: `76-114`
- rationale: capture the risk-identification language and the analysis/documentation expectations before the cash-flow testing details begin.
- review complexity: high
- expected issue types: `regulatory_requirement`, `reinsurance`, `documentation_expectation`, `governance_or_control_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-175

- topic ids: `ag55-cash-flow-testing-details`
- title: AG 55 cash-flow testing details slice
- paragraph target: `115-161`
- rationale: capture the starting-asset rules, alternative-run guidance, projection expectations, and asset-modeling caveats as one review-only slice.
- review complexity: high
- expected issue types: `regulatory_requirement`, `calculation_structure`, `formula_context`, `prescribed_assumption`, `company_or_prudent_estimate_assumption`, `asset_modeling_judgment`, `reinsurance`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-176

- topic ids: `ag55-attribution-aggregation`
- title: AG 55 attribution analysis and aggregation slice
- paragraph target: `162-188`
- rationale: capture the reserve-decrease attribution and the aggregation conditions together before the reporting section begins.
- review complexity: high
- expected issue types: `reporting_requirement`, `documentation_expectation`, `calculation_structure`, `formula_context`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-177

- topic ids: `ag55-reporting-documentation-assumptions`
- title: AG 55 reporting, treaty documentation, and assumption information slice
- paragraph target: `190-224`
- rationale: capture the VM-30 memorandum linkage, treaty documentation, and assumption-information requirements in one review-only slice.
- review complexity: high
- expected issue types: `reporting_requirement`, `documentation_expectation`, `governance_or_control_expectation`, `reinsurance`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-178

- topic ids: `ag55-results-attribution-risk-identification`
- title: AG 55 results, attribution, risk identification, and templates slice
- paragraph target: `225-255`
- rationale: capture the numerical results, attribution analysis, risk identification, and sample template material as one review-only slice.
- review complexity: high
- expected issue types: `reporting_requirement`, `documentation_expectation`, `calculation_structure`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-179

- topic ids: `ag55-appendix-new-york-7-scenarios`
- title: AG 55 appendix New York 7 scenarios and closing boundary
- paragraph target: `258-268`
- rationale: capture the appendix scenario excerpt and keep the closing boundary explicit.
- review complexity: medium
- expected issue types: `regulatory_requirement`, `formula_context`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatoryRequirement`: treat the authority, scope, conditions, and effective-date instructions as regulatory text when they direct what the company must do.
- `definitionOrTerminology`: treat reinsurance, reserve, block, and scenario labels as terminology when the text explains rather than directs.
- `reserveMethodStructure`: treat the starting-asset and cash-flow-test framing as structure only when the source operationalizes it; otherwise keep it as cross-reference context.
- `calculationStructure`: treat the cash-flow testing and attribution material as review-only context unless the guideline explicitly prescribes a computation step.
- `formulaContext`: treat formulas and scenario descriptions as context when they support the review slice but do not promote them into learner-facing content.
- `prescribedAssumption`: treat prescribed assumptions as review-only source text when the guideline explicitly directs a company assumption.
- `companyOrPrudentEstimateAssumption`: treat company or prudent-estimate assumptions as review-only when the source distinguishes company judgment from prescribed rules.
- `scenarioOrStochasticRequirement`: treat scenario or stochastic requirements as review-only context when the guideline references them.
- `assetModelingJudgment`: treat asset, collateral, and funds-withheld modeling judgments as a separate review-only category when the text requires a human judgment call.
- `hedgingOrRiskMitigation`: treat trusts, collateral, and other risk mitigants as review-only context when the source discusses them.
- `reinsurance`: treat treaty mechanics, collectability, and reserve-credit references as reinsurance content when they appear.
- `reportingRequirement`: treat memorandum, review, and template instructions as reporting requirements if they appear.
- `documentationExpectation`: treat supporting-text instructions as documentation expectations if they appear.
- `governanceOrControlExpectation`: treat committee references, regulator notifications, and control language as governance or control expectations if they appear.
- `crossReferenceMapping`: treat references to VM-30, VM-53, ASOPs, Model 820, Model 126, and related tables as cross-reference context unless operationalized.
- `backgroundContent`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each paragraph window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the draft-guidance disclaimer, dense reinsurance wording, and any complex valuation language as requiring human review unless the source text is explicit.

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
- The AG 55 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active, with the pending committee-adoption caveat visible.
- Each planned batch must have a matching batch definition.
- The AG 55 batch definition file must stay synchronized with the plan.
- Paragraph locators and line references should remain visible in the review packet.

### future checks suggested

- Keep the plan portable if the AG 55 appendix or closing boundary needs to be split further.
- Keep the review-only guardrails visible until the review index and self-review note are created.

## Operating Note

- This is a text-based Word source, so paragraph locators are the primary anchor and line references are expected.
- The pending committee-adoption disclaimer should remain visible as a review-only caveat rather than a repeal or replacement signal.
- Keep the appendix separate from the main body, and keep AG 54 out of this wave.
