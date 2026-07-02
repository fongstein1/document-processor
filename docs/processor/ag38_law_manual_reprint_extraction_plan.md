# Controlled AG 38 Law Manual Reprint Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `actuarial_guidelines`
- primary source file: `AG 38 - CRVM for UL-from 2021 Law Manual.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 38 - CRVM for UL from 2021 Law Manual`
- source reference: `Actuarial Guideline XXXVIII / 2021 Law Manual reprint`
- source status: `active companion reprint`
- source status note: companion-only Law Manual reprint of AG 38 material; the active AG 38 source was already processed separately; this wave is a duplicate/reprint cross-check and must remain review-only.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-23`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this PDF source.

Observed section windows:

- `ag38-law-manual-reprint-background-examples-deterministic-reserve-and-closeout`, pages 1-23: Law Manual reprint header, Model 830 application background, guarantee examples, deterministic reserve mechanics, opinion / company-representation material, and closeout.

Boundaries:

- Keep planning focused on this single 2021 Law Manual reprint PDF.
- Do not merge this companion reprint into the already-completed active AG 38 wave.
- Do not widen into AG 39 or other Law Manual reprint files.
- Keep the duplicate/reprint caveat visible because the active AG 38 PDF already has tracked review handoff artifacts.
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
| `ag38-law-manual-reprint-background-examples-deterministic-reserve-and-closeout` | Model 830 application background, guarantee examples, deterministic reserve mechanics, opinion / company-representation material, and closeout | Medium-high | actuarial_guideline, companion_reprint, duplicate_source_check, regulatory_requirement, reserve_method_structure, calculation_structure, formula_context, prescribed_assumption, company_or_prudent_estimate_assumption, reporting_requirement, documentation_expectation, governance_or_control_expectation, definition_or_terminology, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Existing AG 38 review index; Model 830; Standard Valuation Law; universal life product design; AG 39 boundary |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-280` | AG 38 Law Manual reprint background, examples, deterministic reserve mechanics, opinion / representation material, and closeout | 1-23 | Capture the complete 23-page Law Manual reprint as a single companion review-only slice and stop at the page 23 boundary. | Medium-high |

## Review Standards

### What counts as a regulatory requirement

- Express guideline language that describes Model 830 application, guarantee treatment, deterministic reserve method treatment, actuarial opinion / representation expectations, or filing/reporting expectations.
- Reprint language that matches or varies from the already-indexed active AG 38 source.

### What counts as terminology or interpretation

- `Model 830`, guarantee examples, premium-pattern language, deterministic reserve method language, appointed-actuary reporting, and related universal-life reserve terms.
- The note's explanation that this is a companion reprint, not a new promoted source.

### What counts as cross-reference mapping

- References to Model 830, the Standard Valuation Law, AG 39, or the existing active AG 38 review handoff without expanding beyond the page window.

### What requires human actuarial interpretation

- Any difference between the Law Manual reprint and the active AG 38 PDF.
- The example mechanics, deterministic reserve method, actuarial opinion / representation material, and cross-reference implications.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, no unresolved review flags exist, and a human decides how to treat the duplicate/reprint relationship
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-280` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-23 and should not absorb other AG or Law Manual reprint files.
- The duplicate/reprint caveat should stay visible in both the plan and the review packet.

## Operating Note

- AG 38 Law Manual reprint processing is a companion-source inventory burn-down step.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later comparison against the active AG 38 source is needed, it should be a separate human review task.
