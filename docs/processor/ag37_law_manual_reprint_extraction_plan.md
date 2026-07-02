# Controlled AG 37 Law Manual Reprint Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `actuarial_guidelines`
- primary source file: `AG 37 - CRVM for VUL-from 2021 Law Manual.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 37 - CRVM for VUL from 2021 Law Manual`
- source reference: `Actuarial Guideline XXXVII / 2021 Law Manual reprint`
- source status: `active companion reprint`
- source status note: companion-only Law Manual reprint of AG 37 material; the active AG 37 source was already processed separately; this wave is a duplicate/reprint cross-check and must remain review-only.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-10`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this PDF source.

Observed section windows:

- `ag37-law-manual-reprint-background-scope-reserve-method-and-effective-date`, pages 1-10: Law Manual reprint header, background, GMDB reserve discussion, other-issues material, and effective-date closeout.

Boundaries:

- Keep planning focused on this single 2021 Law Manual reprint PDF.
- Do not merge this companion reprint into the already-completed active AG 37 wave.
- Do not widen into AG 36, AG 38, or other Law Manual reprint files.
- Keep the duplicate/reprint caveat visible because the active AG 37 PDF already has tracked review handoff artifacts.
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
| `ag37-law-manual-reprint-background-scope-reserve-method-and-effective-date` | Background, GMDB reserve method discussion, other-issues material, and effective-date closeout | Medium-high | actuarial_guideline, companion_reprint, duplicate_source_check, regulatory_requirement, reserve_method_structure, calculation_structure, definition_or_terminology, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Existing AG 37 review index; Standard Valuation Law; Variable Life Insurance Model Regulation; Universal Life Insurance Model Regulation; Valuation of Life Insurance Policies Model Regulation; AG 38 boundary |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-277` | AG 37 Law Manual reprint background, GMDB reserve method discussion, other issues, and effective-date closeout | 1-10 | Capture the complete 10-page Law Manual reprint as a single companion review-only slice and stop at the page 10 boundary. | Medium-high |

## Review Standards

### What counts as a regulatory requirement

- Express guideline language that describes reserve treatment, effective date, or required/allowed treatment.
- Reprint language that matches or varies from the already-indexed active AG 37 source.

### What counts as terminology or interpretation

- `GMDB`, `AALR`, `Asset Drop`, `GMDB Revenue`, `Term Cost`, and related variable-life reserve terms.
- The note's explanation that this is a companion reprint, not a new promoted source.

### What counts as cross-reference mapping

- References to model laws, AG 38, or the existing active AG 37 review handoff without expanding beyond the page window.

### What requires human actuarial interpretation

- Any difference between the Law Manual reprint and the active AG 37 PDF.
- The GMDB reserve methodology, effective-date treatment, and cross-reference implications.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, no unresolved review flags exist, and a human decides how to treat the duplicate/reprint relationship
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-277` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-10 and should not absorb other AG or Law Manual reprint files.
- The duplicate/reprint caveat should stay visible in both the plan and the review packet.

## Operating Note

- AG 37 Law Manual reprint processing is a companion-source inventory burn-down step.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later comparison against the active AG 37 source is needed, it should be a separate human review task.
