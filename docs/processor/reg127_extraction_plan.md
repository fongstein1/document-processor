# Controlled Regulation 127 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `ny_regulations`
- primary source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-127-11-NYCRR-S044.pdf`
- source folder: `NY Regulations`
- source title: `Market-Value Adjustments; Withdrawal Charges, Availability of Cash Values`
- source reference: `New York Regulation 127 / 11 CRR-NY Part 44`
- source status: `active`
- source status note: current through March 15, 2020; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-20`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this noisy PDF source.

Observed section windows:

- `reg127-purpose-legislative-background-plan-of-operations-asset-maintenance-noncompliance-severability`, pages 1-20: title page, purpose, legislative background, plan of operations, asset maintenance, noncompliance, and severability.

Boundaries:

- Keep planning focused on this single Regulation 127 PDF.
- Do not widen into AG files, practice notes, or other NY regulation files in the same wave.
- Keep the purpose / plan of operations / asset-maintenance / noncompliance / severability language review-only until a human confirms the indexing decision.
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
| `reg127-purpose-legislative-background-plan-of-operations-asset-maintenance-noncompliance-severability` | Purpose, legislative background, plan of operations, asset maintenance, noncompliance, and severability | High | state_regulation, jurisdiction_specific_requirement, regulatory_requirement, reporting_requirement, documentation_expectation, governance_or_control_expectation, asset_modeling_judgment, calculation_structure, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Insurance Law sections 4217, 4223, 4240; market-value-adjustment formula; withdrawal charges; cash values; severability |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-269` | Regulation 127 purpose, legislative background, plan of operations, asset maintenance, noncompliance, and severability | 1-20 | Capture the full 20-page regulation as a single review-only slice and stop at the page 20 boundary. | High |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Market-value-adjustment and withdrawal-charge text that directly changes insurer treatment.

### What counts as terminology or interpretation

- `market-value adjustment`, `withdrawal charge`, `cash value`, `plan of operations`, and related terms.
- The note's explanation of how the opening sections should be indexed for review.

### What counts as cross-reference mapping

- References to Insurance Law sections, contract-value treatment, or related title-level material without expanding beyond the page window.
- Any mention of reserve or asset treatment when it is used only as context for the regulation.

### What requires human actuarial interpretation

- The noncompliance reserve / cash-value comparisons on the middle pages.
- The page-image backstop because the text layer is noisy / OCR-like.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, and no unresolved review flags exist
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-269` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-20 and should not absorb other NY regulation files.
- The page-image wording backstop should stay visible in both the plan and the review packet.

## Operating Note

- Regulation 127 is a narrow, review-only NY regulation wave.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later cleanup pass is needed, it should be a separate review decision rather than a widened batch.
