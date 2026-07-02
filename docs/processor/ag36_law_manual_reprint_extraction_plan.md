# Controlled AG 36 Law Manual Reprint Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `actuarial_guidelines`
- primary source file: `AG 36 - CRVM for EIUL-from 2021 Law Manual.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 36 - CRVM for EIUL from 2021 Law Manual`
- source reference: `Actuarial Guideline XXXVI / 2021 Law Manual reprint`
- source status: `active companion reprint`
- source status note: companion-only Law Manual reprint of AG 36 material; the active AG 36 source was already processed separately; this wave is a duplicate/reprint cross-check and must remain review-only.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-18`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this PDF source.

Observed section windows:

- `ag36-law-manual-reprint-background-method-attachments-and-certification`, pages 1-18: Law Manual reprint header, background, EIUL/CRVM method discussion, attachment mechanics, hedged-as-required criteria, notification material, and certification closeout.

Boundaries:

- Keep planning focused on this single 2021 Law Manual reprint PDF.
- Do not merge this companion reprint into the already-completed active AG 36 wave.
- Do not widen into AG 37, AG 38, or other Law Manual reprint files.
- Keep the duplicate/reprint caveat visible because the active AG 36 PDF already has tracked review handoff artifacts.
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
| `ag36-law-manual-reprint-background-method-attachments-and-certification` | Background, EIUL/CRVM method discussion, attachment mechanics, hedged-as-required criteria, notification material, and certification closeout | Medium-high | actuarial_guideline, companion_reprint, duplicate_source_check, regulatory_requirement, reserve_method_structure, calculation_structure, formula_context, prescribed_assumption, hedging_or_risk_mitigation, reporting_requirement, documentation_expectation, definition_or_terminology, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Existing AG 36 review index; Standard Valuation Law; Universal Life Insurance Model Regulation; CARVM; MVRM; AG 33; AG 37 boundary |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-279` | AG 36 Law Manual reprint background, EIUL/CRVM method discussion, attachment mechanics, hedged-as-required criteria, notification material, and certification closeout | 1-18 | Capture the complete 18-page Law Manual reprint as a single companion review-only slice and stop at the page 18 boundary. | Medium-high |

## Review Standards

### What counts as a regulatory requirement

- Express guideline language that describes reserve treatment, computational-method expectations, hedging / notification treatment, certification, or filing requirements.
- Reprint language that matches or varies from the already-indexed active AG 36 source.

### What counts as terminology or interpretation

- `EIUL`, `CRVM`, `CARVM`, `MVRM`, `Type 1`, `Type 2`, `Hedged as Required`, option-value language, and related equity-indexed-life reserve terms.
- The note's explanation that this is a companion reprint, not a new promoted source.

### What counts as cross-reference mapping

- References to the Standard Valuation Law, Universal Life Insurance Model Regulation, AG 33, AG 37, or the existing active AG 36 review handoff without expanding beyond the page window.

### What requires human actuarial interpretation

- Any difference between the Law Manual reprint and the active AG 36 PDF.
- The computational-method framework, attachment mechanics, hedging / notification treatment, certification wording, and cross-reference implications.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, no unresolved review flags exist, and a human decides how to treat the duplicate/reprint relationship
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-279` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-18 and should not absorb other AG or Law Manual reprint files.
- The duplicate/reprint caveat should stay visible in both the plan and the review packet.

## Operating Note

- AG 36 Law Manual reprint processing is a companion-source inventory burn-down step.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later comparison against the active AG 36 source is needed, it should be a separate human review task.
