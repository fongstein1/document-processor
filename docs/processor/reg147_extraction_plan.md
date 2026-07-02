# Controlled Regulation 147 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `ny_regulations`
- primary source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-147-11-NYCRR-S098.pdf`
- source folder: `NY Regulations`
- source title: `Valuation of Life Insurance Reserves`
- source reference: `New York Regulation 147 / 11 CRR-NY Part 98`
- source status: `active`
- source status note: current through March 15, 2020; section 98.0 is repealed and should remain boundary context only; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-40`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this noisy PDF source.

Observed section windows:

- `reg147-purpose-applicability-definitions-reserve-standards-and-severability`, pages 1-40: title page, purpose, applicability, definitions, life-insurance reserve valuation provisions, mortality / interest / method standards, and severability closeout.

Boundaries:

- Keep planning focused on this single Regulation 147 PDF.
- Do not widen into AG files, practice notes, or other NY regulation files in the same wave.
- Keep the purpose / applicability / definitions / reserve-standards / mortality / interest / method language review-only until a human confirms the indexing decision.
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
| `reg147-purpose-applicability-definitions-reserve-standards-and-severability` | Purpose, applicability, definitions, reserve valuation provisions, mortality / interest / method standards, and severability | High | state_regulation, jurisdiction_specific_requirement, regulatory_requirement, reporting_requirement, calculation_structure, documentation_expectation, definition_or_terminology, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Insurance Law sections 107, 201, 301, 1301, 1303, 1304, 1308, 4217, 4218, 4221, 4224, 4232, 4240, 4517; Financial Services Law sections 202 and 302; mortality-table and reserve-valuation standards; repealed 98.0 material |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-275` | Regulation 147 purpose, applicability, definitions, reserve standards, mortality / interest / method provisions, and severability | 1-40 | Capture the full 40-page regulation as a single review-only slice and stop at the page 40 boundary. | High |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Reserve valuation text that directly changes insurer treatment.

### What counts as terminology or interpretation

- `valuation of life insurance reserves`, `applicability`, `definitions`, `mortality standard`, `interest rate`, `commissioners reserve valuation method`, and related terms.
- The note's explanation of how the reserve-standard sections should be indexed for review.

### What counts as cross-reference mapping

- References to Insurance Law, Financial Services Law, mortality tables, or reserve-method language without expanding beyond the page window.
- Any mention of reserve standards when used only as context for the regulation.

### What requires human actuarial interpretation

- The mortality / interest / method standards and other reserve-valuation provisions.
- The page-image backstop because the text layer is noisy / OCR-like.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, and no unresolved review flags exist
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-275` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-40 and should not absorb other NY regulation files.
- The page-image wording backstop should stay visible in both the plan and the review packet.

## Operating Note

- Regulation 147 is a bounded, review-only NY regulation wave.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later cleanup pass is needed, it should be a separate review decision rather than a widened batch.
