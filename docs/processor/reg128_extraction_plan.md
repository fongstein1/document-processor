# Controlled Regulation 128 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `ny_regulations`
- primary source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-128-11-NYCRR-S097.pdf`
- source folder: `NY Regulations`
- source title: `Market Value Separate Accounts Funding Guaranteed Benefits; Separate Accounts Operations and Reserve Requirements`
- source reference: `New York Regulation 128 / 11 CRR-NY Part 97`
- source status: `active`
- source status note: current through March 15, 2020; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-19`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this noisy PDF source.

Observed section windows:

- `reg128-purpose-plan-of-operations-asset-maintenance-reserve-valuation-severability`, pages 1-19: title page, purpose, legislative background, plan of operations, asset maintenance requirements, reserve valuation, and severability.

Boundaries:

- Keep planning focused on this single Regulation 128 PDF.
- Do not widen into AG files, practice notes, or other NY regulation files in the same wave.
- Keep the purpose / plan of operations / asset-maintenance / reserve-valuation / severability language review-only until a human confirms the indexing decision.
- Keep the page-image wording backstop visible because the text layer is noisy / OCR-like.
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

| Topic ID | Section / topic family | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `reg128-purpose-plan-of-operations-asset-maintenance-reserve-valuation-severability` | Purpose, legislative background, plan of operations, asset maintenance requirements, reserve valuation, and severability | High | state_regulation, jurisdiction_specific_requirement, regulatory_requirement, reporting_requirement, documentation_expectation, governance_or_control_expectation, asset_modeling_judgment, calculation_structure, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Insurance Law sections 1405, 4217, 4223, 4240; separate account asset classes; valuation and asset-maintenance percentages; severability |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-268` | Regulation 128 purpose, plan of operations, asset maintenance requirements, reserve valuation, and severability | 1-19 | Capture the full 19-page regulation as a single review-only slice and stop at the page 19 boundary. | High |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Separate-account and reserve-valuation text that directly changes insurer treatment.

### What counts as terminology or interpretation

- `separate account`, `market value`, `guaranteed benefits`, `asset maintenance`, `reserve valuation`, and related terms.
- The note's explanation of how the opening sections should be indexed for review.

### What counts as cross-reference mapping

- References to Insurance Law sections, asset classes, or related title-level material without expanding beyond the page window.
- Any mention of reserve or asset treatment when it is used only as context for the regulation.

### What requires human actuarial interpretation

- The table-based asset deduction percentages on the middle pages.
- The page-image backstop because the text layer is noisy / OCR-like.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, and no unresolved review flags exist
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-268` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-19 and should not absorb other NY regulation files.
- The page-image wording backstop should stay visible in both the plan and the review packet.

## Operating Note

- Regulation 128 is a narrow, review-only NY regulation wave.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later cleanup pass is needed, it should be a separate review decision rather than a widened batch.
