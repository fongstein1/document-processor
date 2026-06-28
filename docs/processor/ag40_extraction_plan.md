# AG 40 Extraction Plan

## Source Scope

- source family: actuarial_guidelines
- primary source file: `AG 40 - Guideline For Valuation Rate of Interest for Funding Agreements and Guaranteed Interest Contracts (GICs) with Bailout Provisions.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 40 - Guideline For Valuation Rate of Interest for Funding Agreements and Guaranteed Interest Contracts (GICs) with Bailout Provisions`
- source reference: Actuarial Guideline XL
- source status: active
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `1-4`

Observed section windows:

- `ag40-background-risk-and-bailout-provision-setup`, pages 1-2: purpose, background, contract forms, risks, novation or assignment, and put provision.
- `ag40-reserve-application-and-controls`, pages 3-4: wrapping, reserves, valuation-interest application, Plan Type C, and periodic risk-management review.

Boundaries:

- Keep planning focused on the active AG 40 PDF only.
- Do not widen into AG 41 or later guideline files.
- Keep the page-image wording backstop because the text layer is encoding-noisy and stable line references are not expected.
- Use page locators rather than line locators when the text layer does not support stable line mapping.
- Treat the guideline as review-only regulatory guidance, not learner-facing policy text.
- Keep the batch source-bound and review-only.
- AG 41 remains out of scope.

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

### Background, risk, and bailout-provision setup

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
  - asset_modeling_judgment
  - governance_or_control_expectation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - Standard Valuation Law
  - Plan Type C
  - novation or assignment
  - put provision
  - funding agreements
  - GICs
  - AG 39
  - AG 41
- boundary note: keep the purpose, background, risks, novation or assignment, and put provision together as a single review-only slice.

### Reserve, valuation-interest, and control slice

- pages `3-4`
- review complexity: medium-high
- expected issue types:
  - regulatory_requirement
  - definition_or_terminology
  - reserve_method_structure
  - calculation_structure
  - formula_context
  - prescribed_assumption
  - company_or_prudent_estimate_assumption
  - asset_modeling_judgment
  - governance_or_control_expectation
  - cross_reference_mapping
  - background_content
  - boundary_control_window
  - requires_human_interpretation
- cross-reference watchlist:
  - Standard Valuation Law
  - Plan Type C
  - valuation interest rate
  - over-collateralization
  - higher credit quality assets
  - periodic review
  - AG 39
  - AG 41
- boundary note: keep the reserve application, valuation-interest rules, and periodic risk-management review together as a single review-only slice.

## Proposed Batch Sequence

### batch-135

- topic ids: `ag40-background-risk-and-bailout-provision-setup`
- title: AG 40 background, risk, and bailout-provision setup slice
- page target: `1-2`
- rationale: capture the short guideline start in one narrow review-only batch before the reserve-application pages.
- review complexity: medium-high
- expected issue types:
  - page_image_confirmation
  - reserve_method_structure
  - formula_context
  - asset_modeling_judgment
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-136

- topic ids: `ag40-reserve-application-and-controls`
- title: AG 40 reserve, valuation-interest, and control slice
- page target: `3-4`
- rationale: capture the reserve application and control language after the background/risk setup without widening into AG 41.
- review complexity: medium-high
- expected issue types:
  - page_image_confirmation
  - reserve_method_structure
  - formula_context
  - governance_or_control_expectation
  - cross_reference_mapping
  - requires_human_interpretation
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatory_requirement`: treat background, reserve, bailout-provision, and valuation-interest language as regulatory text when the guideline directs how AG 40 provisions should be handled.
- `definition_or_terminology`: treat funding-agreement, GIC, Plan Type C, novation, and put-provision labels as terminology or context when the text explains rather than directs.
- `reserve_method_structure`: treat the reserve framework and example mechanics as method structure when the text is describing how the reserve works.
- `calculation_structure`: treat the reserve steps, reserve components, and valuation-date application as calculation structure when the text specifies how the method is applied.
- `formula_context`: treat reserve components and valuation-rate references as formula context unless the text gives an explicit computational rule.
- `prescribed_assumption`: treat table-driven or fixed inputs as prescribed assumptions when they are stated as requirements.
- `company_or_prudent_estimate_assumption`: treat experience-sensitive or judgment-sensitive language as company / prudent-estimate context when the text expressly allows or recommends it.
- `asset_modeling_judgment`: treat liquidity, collateral, and asset-sale commentary as asset-modeling judgment when the text discusses balance-sheet effects and risk mitigation.
- `governance_or_control_expectation`: treat periodic review, risk-management measures, and management-satisfaction language as governance / control material when the text directs how the valuation actuary should monitor the provision.
- `cross_reference_mapping`: treat references to the Standard Valuation Law, Plan Type C, AG 39, and AG 41 as cross-reference context unless the text operationalizes them.
- `background_content`: treat the title, introduction, and section labels as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-2 and page 3-4 windows as review-only slices and do not split them unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoding-noisy text layer and reserve / interest-rate judgment calls as requiring human review unless the source text is explicit.

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
- The AG 40 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 40 batch definition file must stay synchronized with the plan.
- The page-image backstop and page-locator-only posture must stay visible for the noisy text layer.

### future checks suggested

- Page-image wording backstop checks.
- Line-reference availability checks.
- Unexpected source-family leakage checks.
- No learner-facing, app-ready, or RAG-ready promotion checks.
- AG 41 boundary checks.
- Reserve and control-balance boundary checks.

### script implications

- `scripts/ag40-batch-definitions.mjs` should stay synchronized with the planned batch-135 and batch-136 slices when extraction is authorized.
- `scripts/batch-definitions.mjs` should import the AG 40 definition file so the shared runner can find batch-135 and batch-136.
- `scripts/validate-scaffold.mjs` should verify that the AG 40 plan file exists, parses cleanly, and preserves the review-only posture.
- The shared runner should continue to honor the same stop conditions used for the earlier guideline batches.
- The page-image wording backstop should remain visible in the review packet because the AG 40 text layer is noisy and line references are not expected.

## Operating Note

Controlled AG 40 planning artifact. Planned batches 135 and 136 remain review-only by default and are not extraction runs.
