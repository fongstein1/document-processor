# Controlled Regulation 126 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `ny_regulations`
- primary source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-126-11-NYCRR-S095.pdf`
- source folder: `NY Regulations`
- source title: `Regulations Governing an Actuarial Opinion and Memorandum`
- source reference: `New York Regulation 126 / 11 CRR-NY Part 95`
- source status: `active`
- source status note: current through March 15, 2020; section 95.0 and sections 95.13 to 95.19 are repealed and should remain boundary context only; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-30`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this noisy PDF source.

Observed section windows:

- `reg126-opening-purpose-authority-scope-actuarial-opinion-memorandum-and-repealed-closeout`, pages 1-30: title page, purpose, authority, scope, actuarial opinion and memorandum requirements, and severability with repealed closeout material.

Boundaries:

- Keep planning focused on this single Regulation 126 PDF.
- Do not widen into AG files, practice notes, or other NY regulation files in the same wave.
- Keep the purpose / authority / scope / actuarial-opinion / memorandum / repealed-closeout language review-only until a human confirms the indexing decision.
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
| `reg126-opening-purpose-authority-scope-actuarial-opinion-memorandum-and-repealed-closeout` | Purpose, authority, scope, actuarial opinion and memorandum requirements, and severability with repealed closeout material | High | state_regulation, jurisdiction_specific_requirement, regulatory_requirement, reporting_requirement, documentation_expectation, governance_or_control_expectation, definition_or_terminology, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Insurance Law sections 107, 201, 301, 308, 310, 1301, 1303, 1304, 4217, 4232, 4240; actuarial opinion and memorandum requirements; repealed 95.0 and 95.13 to 95.19 material |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-274` | Regulation 126 purpose, authority, scope, actuarial opinion and memorandum requirements, and repealed closeout | 1-30 | Capture the full 30-page regulation as a single review-only slice and stop at the page 30 boundary. | High |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Actuarial opinion and memorandum text that directly changes insurer treatment.

### What counts as terminology or interpretation

- `actuarial opinion`, `memorandum`, `scope`, `authority`, and related terms.
- The note's explanation of how the opening sections should be indexed for review.

### What counts as cross-reference mapping

- References to Insurance Law sections or memorandum-support material without expanding beyond the page window.
- Any mention of actuarial opinion text when it is used only as context for the regulation.

### What requires human actuarial interpretation

- The memorandum and opinion requirements on the middle pages.
- The page-image backstop because the text layer is noisy / OCR-like.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, and no unresolved review flags exist
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-274` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-30 and should not absorb other NY regulation files.
- The page-image wording backstop should stay visible in both the plan and the review packet.

## Operating Note

- Regulation 126 is a narrow, review-only NY regulation wave.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later cleanup pass is needed, it should be a separate review decision rather than a widened batch.
