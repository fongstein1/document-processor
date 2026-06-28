# AG 35 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 35 - The Application of the Commissioners' Annuity Reserve Method to Equity Indexed Annuities.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 35 - The Application of the Commissioners' Annuity Reserve Method to Equity Indexed Annuities`
- source reference: Actuarial Guideline XXXV
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-9`

Observed section windows:

- `ag35-foundation-and-method-overview`, pages `1-3`: background information, purpose, scope, definitions, CARVM framing, and the Type 1 / Type 2 overview.
- `ag35-attachments-and-hedging-criteria`, pages `4-6`: Attachment 1 computational-method descriptions and Attachment 2 Hedged as Required criteria.
- `ag35-certification-and-closeout`, pages `7-9`: quarterly notification threshold, reasonableness / consistency certifications, and closeout material.

Boundaries:

- Keep planning focused on this single AG 35 PDF.
- Do not widen into AG 36 or later guideline files.
- Keep the page image as the backstop for exact wording because the text layer is encoding-noisy.
- Keep the page-image backstop visible.
- AG 36 remains out of scope.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep it not app-ready, not RAG-ready, and not promoted.
- Keep the batch source-bound and review-only.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No other guideline files in the same wave.

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
  - EDIM
  - Type 1
  - Type 2
  - AG 36
- boundary note: keep the three-page foundation window together and do not widen into AG 36.

### 2. Attachments and Hedging Criteria

- pages `4-6`
- review complexity: high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - hedging_or_risk_mitigation
  - reporting_requirement
  - governance_or_control_expectation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - Attachment 1
  - Attachment 2
  - computational methods
  - Hedged as Required
  - quarterly certification
  - option replication
  - Type 1
  - Type 2
- boundary note: keep the computational-method descriptions and the hedging-criteria material together as one narrow review-only mechanics slice.

### 3. Certification and Closeout

- pages `7-9`
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
  - quarterly notification
  - reasonableness certification
  - consistency certification
  - market value of options
  - reserve hedging
  - AG 36
- boundary note: keep the certification and closeout pages together and leave AG 36 for a later plan.

## Proposed Batch Sequence

### batch-120

- topic ids: `ag35-foundation-and-method-overview`
- title: AG 35 foundation and method-overview slice
- page target: `1-3`
- rationale: capture the title, purpose, scope, Type 1 / Type 2 framing, and the core CARVM overview before the attachment-driven mechanics begin.
- review complexity: medium-high
- expected unresolved issue types:
  - page_image_confirmation
  - method_overview_boundary
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-121

- topic ids: `ag35-attachments-and-hedging-criteria`
- title: AG 35 attachments and hedging-criteria slice
- page target: `4-6`
- rationale: keep Attachment 1 computational-method descriptions and Attachment 2 Hedged as Required criteria together as one review-only mechanics slice.
- review complexity: high
- expected unresolved issue types:
  - page_image_confirmation
  - hedging_or_risk_mitigation
  - reporting_requirement
  - governance_or_control_expectation
  - formula_context
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-122

- topic ids: `ag35-certification-and-closeout`
- title: AG 35 certification and closeout slice
- page target: `7-9`
- rationale: keep the quarterly notification threshold and the reasonableness / consistency certifications together as the closing review window.
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
- `definition_or_terminology`: treat CARVM, MVRM, EDIM, Type 1, Type 2, and hedged-as-required language as terminology or context when the text explains rather than directs.
- `reserve_method_structure`: treat the computational-method framework, Type 1 / Type 2 split, and reserve-method framing as structure when the text is describing the method rather than the numeric result.
- `calculation_structure`: treat the examples, attachment-driven method steps, and reserve-setting sequences as calculation structure when they specify how the method is applied.
- `formula_context`: treat references to future value, projected index, market value, and option replication as formula context unless the text gives an explicit computational rule.
- `prescribed_assumption`: treat table-driven or fixed input assumptions as prescribed assumptions when they are stated as requirements.
- `company_or_prudent_estimate_assumption`: treat experience-sensitive or judgment-sensitive language as company / prudent-estimate context when the text expressly allows or recommends it.
- `hedging_or_risk_mitigation`: treat hedged-as-required criteria, option replication, and related certifications as hedging or risk-mitigation material when the text operationalizes those controls.
- `reporting_requirement`: treat notification, certification, and filing direction as reporting requirement material when the text says what must be filed or disclosed.
- `documentation_expectation`: treat signed certifications and explanatory filing language as documentation expectation material when the text tells the user what must accompany the filing.
- `cross_reference_mapping`: treat references to the Standard Valuation Law, Actuarial Guideline 33, Attachments 1-2, and AG 36 as cross-reference context unless the text operationalizes them.
- `background_content`: treat the title, introduction, examples, and attachment labels as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-3, page 4-6, and page 7-9 windows as review-only slices and do not split them unless a later cleanup pass explicitly needs that split.
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
- The AG 35 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 35 batch definition file must stay synchronized with the plan.

### future checks suggested

- Page-image wording backstop checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- AG 36 boundary checks.

### script implications

- `scripts/ag35-batch-definitions.mjs` should stay synchronized with the planned batch-120, batch-121, and batch-122 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 35 definition file so the shared runner can find batch-120, batch-121, and batch-122.
- `scripts/validate-scaffold.mjs` should verify that the AG 35 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.

## Operating Note

Controlled AG 35 planning artifact. Planned batches 120, 121, and 122 remain review-only by default and are not extraction runs.
