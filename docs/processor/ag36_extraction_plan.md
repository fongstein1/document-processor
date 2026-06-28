# AG 36 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies`
- source reference: Actuarial Guideline XXXVI
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-11`

Observed section windows:

- `ag36-foundation-and-method-overview`, pages `1-3`: background information, purpose, scope, definitions, CARVM framing, and the Type 1 / Type 2 overview.
- `ag36-attachments-and-method-mechanics`, pages `4-6`: Attachment 1 computational-method descriptions and the implied-guaranteed-rate / option-based mechanics.
- `ag36-hedged-as-required-and-notification`, pages `7-8`: Attachment 2 Hedged as Required criteria and the notification threshold material.
- `ag36-certification-and-closeout`, pages `9-11`: reasonableness certifications and the updated market-value certification material.

Boundaries:

- Keep planning focused on this single active AG 36 PDF.
- Do not widen into AG 37 or later guideline files.
- Do not widen into the 2021 Law Manual reprint file unless a separate companion-source plan is approved later.
- Keep the page-image wording backstop as the exact-wording reference because the text layer is encoding-noisy.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.
- AG 37 remains out of scope.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No other guideline files in the same wave.
- not app-ready, not RAG-ready, and not promoted.

## Topic Map

### 1. Foundation and Method Overview

- pages `1-3`
- review complexity: medium-high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reserve_method_structure
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - CARVM
  - MVRM
  - option values
  - Type 1
  - Type 2
  - AG 37
- boundary note: keep the three-page foundation window together and do not widen into AG 37.

### 2. Attachments and Method Mechanics

- pages `4-6`
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
  - Attachment 1
  - implied guaranteed rate method
  - option cost
  - historical moving average cost
  - Type 1
  - Type 2
- boundary note: keep the computational-method descriptions and the rate-mechanics material together as one narrow review-only mechanics slice.

### 3. Hedged as Required and Notification

- pages `7-8`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - hedging_or_risk_mitigation
  - reporting_requirement
  - governance_or_control_expectation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - Attachment 2
  - Hedged as Required
  - quarterly notification
  - option replication
  - reserve hedging
  - AG 37
- boundary note: keep the hedged-as-required criteria and the notification threshold together as one narrow review-only slice.

### 4. Certification and Closeout

- pages `9-11`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - reasonableness certification
  - consistency certification
  - updated market value
  - appointed actuary
  - AG 37
- boundary note: keep the certification pages together and leave AG 37 for a later plan.

## Proposed Batch Sequence

### batch-123

- topic ids: `ag36-foundation-and-method-overview`
- title: AG 36 foundation and method-overview slice
- page target: `1-3`
- rationale: capture the title, purpose, scope, CARVM framing, and the Type 1 / Type 2 overview before the attachment-driven mechanics begin.
- review complexity: medium-high
- expected unresolved issue types:
  - page_image_confirmation
  - method_overview_boundary
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-124

- topic ids: `ag36-attachments-and-method-mechanics`
- title: AG 36 attachments and method-mechanics slice
- page target: `4-6`
- rationale: keep the computational-method descriptions and the rate-mechanics material together as one review-only mechanics slice.
- review complexity: high
- expected unresolved issue types:
  - page_image_confirmation
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-125

- topic ids: `ag36-hedged-as-required-and-notification`
- title: AG 36 hedged-as-required and notification slice
- page target: `7-8`
- rationale: keep the hedged-as-required criteria and the notification threshold together as one review-only slice.
- review complexity: high
- expected unresolved issue types:
  - page_image_confirmation
  - hedging_or_risk_mitigation
  - reporting_requirement
  - governance_or_control_expectation
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-126

- topic ids: `ag36-certification-and-closeout`
- title: AG 36 certification and closeout slice
- page target: `9-11`
- rationale: keep the reasonableness and consistency certifications together as the closing review window.
- review complexity: high
- expected unresolved issue types:
  - page_image_confirmation
  - reporting_requirement
  - documentation_expectation
  - governance_or_control_expectation
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatory_requirement`: treat the reserve rules, notification rules, and certification rules as regulatory text when the guideline directs how reserves or filings should be handled.
- `definition_or_terminology`: treat CARVM, MVRM, implied guaranteed rate, option values, Type 1, Type 2, and hedged-as-required language as terminology or context when the text explains rather than directs.
- `reserve_method_structure`: treat the computational-method framework, Type 1 / Type 2 split, and reserve-method framing as structure when the text is describing the method rather than the numeric result.
- `calculation_structure`: treat the examples, attachment-driven method steps, and reserve-setting sequences as calculation structure when they specify how the method is applied.
- `formula_context`: treat references to future value, projected index, market value, option replication, and moving-average option cost as formula context unless the text gives an explicit computational rule.
- `prescribed_assumption`: treat table-driven or fixed input assumptions as prescribed assumptions when they are stated as requirements.
- `company_or_prudent_estimate_assumption`: treat experience-sensitive or judgment-sensitive language as company / prudent-estimate context when the text expressly allows or recommends it.
- `hedging_or_risk_mitigation`: treat hedged-as-required criteria, option replication, and related certifications as hedging or risk-mitigation material when the text operationalizes those controls.
- `reporting_requirement`: treat notification, certification, and filing direction as reporting requirement material when the text says what must be filed or disclosed.
- `documentation_expectation`: treat signed certifications and explanatory filing language as documentation expectation material when the text tells the user what must accompany the filing.
- `cross_reference_mapping`: treat references to the Standard Valuation Law, Actuarial Guideline 33, Attachments 1-2, and AG 37 as cross-reference context unless the text operationalizes them.
- `background_content`: treat the title, introduction, examples, and attachment labels as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-3, page 4-6, page 7-8, and page 9-11 windows as review-only slices and do not split them unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoding-noisy text layer, table-heavy pages, and certification judgment calls as requiring human review unless the source text is explicit.

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
- The AG 36 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 36 batch definition file must stay synchronized with the plan.

### future checks suggested

- Page-image wording backstop checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- AG 37 boundary checks.
- Companion reprint leakage checks.

### script implications

- `scripts/ag36-batch-definitions.mjs` should stay synchronized with the planned batch-123, batch-124, batch-125, and batch-126 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 36 definition file so the shared runner can find batch-123, batch-124, batch-125, and batch-126.
- `scripts/validate-scaffold.mjs` should verify that the AG 36 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.

## Operating Note

Controlled AG 36 planning artifact. Planned batches 123, 124, 125, and 126 remain review-only by default and are not extraction runs.
