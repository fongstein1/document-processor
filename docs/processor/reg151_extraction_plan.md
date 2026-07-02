# Controlled Regulation 151 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `ny_regulations`
- primary source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-151-11-NYCRR-S099.pdf`
- source folder: `NY Regulations`
- source title: `Valuation of Annuity, Single Premium Life Insurance, Guaranteed Interest Contract and Other Deposit Reserves`
- source reference: `New York Regulation 151 / 11 CRR-NY Part 99`
- source status: `active`
- source status note: current through March 15, 2020; the page-image wording backstop remains required because the text layer is noisy / OCR-like and the source contains table-heavy reserve material.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-52`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this noisy PDF source.

Observed section windows:

- `reg151-purpose-applicability-annuity-deposit-reserve-standards-and-severability`, pages 1-52: title page, purpose, applicability, annuity / single-premium life / guaranteed-interest-contract / deposit-reserve provisions, table-heavy reserve factors, and severability closeout.

Boundaries:

- Keep planning focused on this single Regulation 151 PDF.
- Do not widen into AG files, practice notes, or other NY regulation files in the same wave.
- Keep the purpose / applicability / annuity / single-premium life / guaranteed-interest-contract / deposit-reserve / table material review-only until a human confirms the indexing decision.
- Keep the page-image wording backstop visible because the text layer is noisy / OCR-like and table-heavy.
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
| `reg151-purpose-applicability-annuity-deposit-reserve-standards-and-severability` | Purpose, applicability, annuity / single-premium life / guaranteed-interest-contract / deposit-reserve provisions, table-heavy reserve factors, and severability | High | state_regulation, jurisdiction_specific_requirement, regulatory_requirement, reporting_requirement, calculation_structure, table_or_factor_mapping, documentation_expectation, definition_or_terminology, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Insurance Law sections 201, 301, 1304, 4217, 4240, 4517; Financial Services Law sections 202 and 302; statutory reserve formulae; annuity and deposit reserve table material |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-276` | Regulation 151 purpose, applicability, annuity / deposit reserve standards, table-heavy factors, and severability | 1-52 | Capture the full 52-page regulation as a single review-only slice and stop at the page 52 boundary. | High |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Reserve valuation text that directly changes insurer treatment.

### What counts as terminology or interpretation

- `annuity`, `single premium life insurance`, `guaranteed interest contract`, `deposit reserves`, `statutory reserve formulae`, and related terms.
- The note's explanation of how the table-heavy reserve factors should be indexed for review.

### What counts as cross-reference mapping

- References to Insurance Law, Financial Services Law, statutory reserve formulae, or reserve-factor tables without expanding beyond the page window.
- Any mention of reserve standards when used only as context for the regulation.

### What requires human actuarial interpretation

- The table-heavy reserve factors and valuation provisions.
- The page-image backstop because the text layer is noisy / OCR-like.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, and no unresolved review flags exist
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-276` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-52 and should not absorb other NY regulation files.
- The page-image wording backstop should stay visible in both the plan and the review packet.

## Operating Note

- Regulation 151 is a bounded, review-only NY regulation wave.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later cleanup pass is needed for the table-heavy material, it should be a separate review decision rather than a widened batch.
