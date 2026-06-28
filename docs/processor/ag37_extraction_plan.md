# AG 37 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 37 - Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits.pdf`
- companion-only excluded source file: `AG 37 - CRVM for VUL-from 2021 Law Manual.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 37 - Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits`
- source reference: Actuarial Guideline XXXVII
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-6`

Observed section windows:

- `ag37-background-and-scope`, pages 1-3: background, purpose, scope, and early definitions for GMDB reserves.
- `ag37-definitions-and-reserve-entry`, pages 4-5: remaining definitions, GMDB revenue, term cost, 1/3-Asset Drop, and the AALR reserve entry point.
- `ag37-effective-date-and-closeout`, page `6`: effective date, retroactive application, and closeout boundary language.

Boundaries:

- Keep planning focused on the active AG 37 PDF only.
- Treat the 2021 Law Manual reprint as companion-only and out of scope.
- Do not widen into AG 38 or later guideline files.
- Keep the page-image wording backstop visible because the text layer is encoding-noisy.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.
- AG 38 remains out of scope.

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

### 1. Background and Scope

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
  - Standard Valuation Law
  - Variable Life Insurance Model Regulation
  - Universal Life Insurance Model Regulation
  - AG 38
- boundary note: keep the background and scope material together and do not widen into AG 38.

### 2. Definitions and Reserve Entry

- pages `4-5`
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
  - GMDB Revenue
  - Term cost
  - 1/3-Asset Drop
  - Attained Age Level Reserves
  - 1983 Group Annuity Mortality Basic Table
  - AG 38
- boundary note: keep the definition layer and the reserve-entry language together as one narrow review-only slice.

### 3. Effective Date and Closeout

- pages `6-6`
- review complexity: medium-high
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
  - effective date
  - retroactive application
  - grade in period
  - residue
  - AG 38
- boundary note: keep the effective-date material as a separate closing window and leave AG 38 out of scope.

## Proposed Batch Sequence

### batch-127

- topic ids: `ag37-background-and-scope`
- title: AG 37 background and scope slice
- page target: `1-3`
- rationale: capture the background, purpose, scope, and opening projection-assumption framing before the reserve-entry definitions begin.
- review complexity: medium-high
- expected issue types:
  - page_image_confirmation
  - scope_boundary
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-128

- topic ids: `ag37-definitions-and-reserve-entry`
- title: AG 37 definitions and reserve-entry slice
- page target: `4-5`
- rationale: keep the remaining definitions, GMDB revenue, term cost, 1/3-Asset Drop, and AALR reserve entry point together as one narrow review-only slice.
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

### batch-129

- topic ids: `ag37-effective-date-and-closeout`
- title: AG 37 effective-date closeout slice
- page target: `6-6`
- rationale: keep the effective-date and retroactive-application language separate as the closing review window.
- review complexity: medium-high
- expected issue types:
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

- `regulatory_requirement`: treat reserve, scope, and effective-date language as regulatory text when the guideline directs how GMDB reserves or filings should be handled.
- `definition_or_terminology`: treat GMDB Revenue, Term cost, 1/3-Asset Drop, AALR, and related model references as terminology or context when the text explains rather than directs.
- `reserve_method_structure`: treat the GMDB reserve framework, projection assumptions, and reserve-entry structure as method structure when the text is describing how the reserve works.
- `calculation_structure`: treat the reserve steps, reserve components, and effective-date setup as calculation structure when the text specifies how the method is applied.
- `formula_context`: treat projected policy values, reserve components, and valuation-rate references as formula context unless the text gives an explicit computational rule.
- `prescribed_assumption`: treat table-driven or fixed inputs as prescribed assumptions when they are stated as requirements.
- `company_or_prudent_estimate_assumption`: treat experience-sensitive or judgment-sensitive language as company / prudent-estimate context when the text expressly allows or recommends it.
- `reporting_requirement`: treat effective-date, filing, and implementation direction as reporting requirement material when the text says what must be filed or disclosed.
- `documentation_expectation`: treat explanatory implementation language as documentation expectation material when the text tells the user what must accompany the filing.
- `cross_reference_mapping`: treat references to the Standard Valuation Law, model regulations, and AG 38 as cross-reference context unless the text operationalizes them.
- `background_content`: treat the title, introduction, examples, and section labels as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-3, page 4-5, and page 6 windows as review-only slices and do not split them unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoding-noisy text layer, table-heavy passages, and reserve judgment calls as requiring human review unless the source text is explicit.

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
- The AG 37 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 37 batch definition file must stay synchronized with the plan.

### future checks suggested

- Page-image wording backstop checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- AG 38 boundary checks.
- Companion reprint leakage checks.

### script implications

- `scripts/ag37-batch-definitions.mjs` should stay synchronized with the planned batch-127, batch-128, and batch-129 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 37 definition file so the shared runner can find batch-127, batch-128, and batch-129.
- `scripts/validate-scaffold.mjs` should verify that the AG 37 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.

## Operating Note

Controlled AG 37 planning artifact. Planned batches 127, 128, and 129 remain review-only by default and are not extraction runs.
