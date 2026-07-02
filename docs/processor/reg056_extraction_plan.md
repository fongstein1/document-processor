# Controlled Regulation 56 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `ny_regulations`
- primary source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-056-11-NYCRR-S094.pdf`
- source folder: `NY Regulations`
- source title: `Valuation of Individual and Group Accident and Health Insurance Reserves`
- source reference: `New York Regulation 56 / 11 CRR-NY Part 94`
- source status: `active`
- source status note: current through March 15, 2020; section 94.12 is repealed and should remain boundary context only; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-27`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this noisy PDF source.

Observed section windows:

- `reg056-opening-purpose-application-reserve-guidance-and-repealed-closeout`, pages 1-27: title page, purposes, applicability, reserve guidance, tables / incorporated material, and severability with a repealed subsection closeout.

Boundaries:

- Keep planning focused on this single Regulation 56 PDF.
- Do not widen into AG files, practice notes, or other NY regulation files in the same wave.
- Keep the purpose / applicability / reserve-guidance / repealed-closeout language review-only until a human confirms the indexing decision.
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
| `reg056-opening-purpose-application-reserve-guidance-and-repealed-closeout` | Purpose, applicability, reserve guidance, tables / incorporated material, and severability with a repealed subsection closeout | High | state_regulation, jurisdiction_specific_requirement, regulatory_requirement, reporting_requirement, documentation_expectation, governance_or_control_expectation, calculation_structure, definition_or_terminology, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Insurance Law sections 201, 301, 1303, 1304, 1305, 1308, 4117, 4217, 4310, 4517; accident and health reserve methods; incorporated valuation tables; repealed subsection 94.12 |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-273` | Regulation 56 purpose, applicability, reserve guidance, tables / incorporated material, and repealed closeout | 1-27 | Capture the full 27-page regulation as a single review-only slice and stop at the page 27 boundary. | High |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Accident and health reserve text that directly changes insurer treatment.

### What counts as terminology or interpretation

- `accident and health reserves`, `incorporated by reference`, `grading to higher reserves`, and related terms.
- The note's explanation of how the opening sections should be indexed for review.

### What counts as cross-reference mapping

- References to Insurance Law sections or incorporated table material without expanding beyond the page window.
- Any mention of reserve treatment when it is used only as context for the regulation.

### What requires human actuarial interpretation

- The incorporated tables and table-heavy middle pages.
- The page-image backstop because the text layer is noisy / OCR-like.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, and no unresolved review flags exist
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-273` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-27 and should not absorb other NY regulation files.
- The page-image wording backstop should stay visible in both the plan and the review packet.

## Operating Note

- Regulation 56 is a narrow, review-only NY regulation wave.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later cleanup pass is needed, it should be a separate review decision rather than a widened batch.
