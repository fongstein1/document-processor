# AG 39 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 39 - Reserves For Variable Annuities With Guaranteed Living Benefits (VAGLBs).pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 39 - Reserves For Variable Annuities With Guaranteed Living Benefits (VAGLBs)`
- source reference: Actuarial Guideline XXXIX
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-2`

Observed section window:

- `ag39-background-and-reserve-requirement`, pages 1-2: background, temporary
  interpretation, reserve-language overview, reinsurance, and asset
  adequacy analysis requirement.

Boundaries:

- Keep planning focused on the active AG 39 PDF only.
- Do not widen into AG 40 or later guideline files.
- Keep the page-image wording backstop because the text layer is
  encoding-noisy and stable line references are not expected.
- Use page locators rather than line locators when the text layer does not
  support stable line mapping.
- Treat the guideline as review-only regulatory guidance, not learner-facing
  policy text.
- Keep the batch source-bound and review-only.
- AG 40 remains out of scope.

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

### Background and reserve requirement

- pages `1-2`
- review complexity: medium-high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - reinsurance
  - reporting_requirement
  - documentation_expectation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - VAGLBs
  - Model Standard Valuation Law
  - AG 38
  - AG 40
  - asset adequacy analysis
  - general account
- boundary note: keep the background, temporary interpretation, reserve
  language, reinsurance, and asset-adequacy requirement together as a single
  review-only slice.

## Proposed Batch Sequence

### batch-134

- topic ids: `ag39-background-and-reserve-requirement`
- title: AG 39 background and reserve-requirement slice
- page target: `1-2`
- rationale: capture the short VAGLB guideline in one narrow review-only
  batch rather than splitting a two-page file.
- review complexity: medium-high
- expected issue types:
  - page_image_confirmation
  - reserve_method_structure
  - formula_context
  - reinsurance
  - asset_modeling_judgment
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatory_requirement`: treat background, reserve, reinsurance, and
  asset-adequacy language as regulatory text when the guideline directs how
  VAGLB reserves should be handled.
- `definition_or_terminology`: treat VAGLB terms, reserve labels, and
  example labels as terminology or context when the text explains rather than
  directs.
- `reserve_method_structure`: treat the reserve framework and example
  mechanics as method structure when the text is describing how the reserve
  works.
- `calculation_structure`: treat the reserve steps, reserve components, and
  valuation-date application as calculation structure when the text specifies
  how the method is applied.
- `formula_context`: treat reserve components and valuation-rate references as
  formula context unless the text gives an explicit computational rule.
- `prescribed_assumption`: treat table-driven or fixed inputs as prescribed
  assumptions when they are stated as requirements.
- `company_or_prudent_estimate_assumption`: treat experience-sensitive or
  judgment-sensitive language as company / prudent-estimate context when the
  text expressly allows or recommends it.
- `reinsurance`: treat reserve-credit and treaty language as reinsurance
  context when the text addresses ceded or assumed VAGLB exposure.
- `reporting_requirement`: treat asset adequacy, opinion, and filing-direction
  language as reporting requirement material when the text says what must be
  filed or disclosed.
- `documentation_expectation`: treat explanatory implementation language as
  documentation expectation material when the text tells the reviewer what
  must accompany the filing.
- `cross_reference_mapping`: treat references to VAGLBs, the Standard
  Valuation Law, AG 38, and AG 40 as cross-reference context unless the text
  operationalizes them.
- `background_content`: treat the title, introduction, and section labels as
  background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-2 window as a review-only slice
  and do not split it unless a later cleanup pass explicitly needs that
  split.
- `requires_human_interpretation`: treat the encoding-noisy text layer and
  reserve / asset-adequacy judgment calls as requiring human review unless
  the source text is explicit.

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
- The AG 39 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 39 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for
  the noisy text layer.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- AG 40 boundary checks.
- Reinsurance and asset-adequacy boundary checks.

### script implications

- `scripts/ag39-batch-definitions.mjs` should stay synchronized with the
  planned batch-134 slice when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 39 definition file so
  the shared runner can find batch-134.
- `scripts/validate-scaffold.mjs` should verify that the AG 39 plan file
  exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used
  for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet
  because the AG 39 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 39 planning artifact. Planned batch 134 remains review-only by
default and is not an extraction run.
