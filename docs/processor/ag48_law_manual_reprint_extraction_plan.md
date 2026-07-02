# Controlled AG 48 Law Manual Reprint Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- source family: `actuarial_guidelines`
- primary source file: `AG 48 - AOMR for Reinsurers-from 2021 Law Manual.pdf`
- source folder: `Actuarial Guidelines`
- source title: `AG 48 - AOMR for Reinsurers from 2021 Law Manual`
- source reference: `Actuarial Guideline XLVIII / 2021 Law Manual reprint`
- source status: `active companion reprint`
- source status note: companion-only Law Manual reprint of AG 48 material; the active AG 48 source was already processed separately; this wave is a duplicate/reprint cross-check and must remain review-only.
- domain: `naic_regulatory`
- raw source root: `C:\\Dev\\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-16`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators are the primary anchor; line references are not expected to be stable for this PDF source.

Observed section windows:

- `ag48-law-manual-reprint-background-scope-method-opinion-and-sunset`, pages 1-16: Law Manual reprint header, background, authority and scope, exempt policy treatment, primary security, actuarial method, opinion / memorandum material, effective date, and sunset provision.

Boundaries:

- Keep planning focused on this single 2021 Law Manual reprint PDF.
- Do not merge this companion reprint into the already-completed active AG 48 wave.
- Do not widen into AG 36, AG 37, AG 38, or other Law Manual reprint files.
- Keep the duplicate/reprint caveat visible because the active AG 48 PDF already has tracked review handoff artifacts.
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
| `ag48-law-manual-reprint-background-scope-method-opinion-and-sunset` | Background, authority and scope, exempt policy treatment, primary security, actuarial method, opinion / memorandum material, effective date, and sunset provision | Medium-high | actuarial_guideline, companion_reprint, duplicate_source_check, regulatory_requirement, reserve_method_structure, reinsurance, calculation_structure, definition_or_terminology, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Existing AG 48 review index; Model 830; Model 785; Model 787; VM-20; VM-21; VM-22; VM-30; AG 38 |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-278` | AG 48 Law Manual reprint background, authority/scope, reinsurance/security method, opinion/memorandum material, effective date, and sunset provision | 1-16 | Capture the complete 16-page Law Manual reprint as a single companion review-only slice and stop at the page 16 boundary. | Medium-high |

## Review Standards

### What counts as a regulatory requirement

- Express guideline language that describes covered policies, exempt policies, primary security, actuarial method, actuarial opinion / memorandum expectations, effective date, or sunset treatment.
- Reprint language that matches or varies from the already-indexed active AG 48 source.

### What counts as terminology or interpretation

- `Covered Policies`, `Primary Security`, `Other Security`, `Required Level of Primary Security`, `Actuarial Method`, and related AG 48 reinsurance reserve-financing terms.
- The note's explanation that this is a companion reprint, not a new promoted source.

### What counts as cross-reference mapping

- References to Model 830, Model 785, Model 787, VM-20, VM-21, VM-22, VM-30, AG 38, or the existing active AG 48 review handoff without expanding beyond the page window.

### What requires human actuarial interpretation

- Any difference between the Law Manual reprint and the active AG 48 PDF.
- The reinsurance reserve-financing framework, primary-security method, opinion/memorandum expectations, effective-date language, sunset provision, and cross-reference implications.

## Promotion Gates

- default state: `review_only`
- learner-facing: source citation exists, source support is clear, wording is not misleading, confidence is high, no unresolved review flags exist, and a human decides how to treat the duplicate/reprint relationship
- app-ready: learner-facing criteria are already satisfied, export is sanitized and stable, and no unresolved review issues remain
- RAG-ready: approved indexed material only, with stable source support and no unresolved review flags
- approved/promoted export: explicit human approval only
- no raw source files in Git

## Validation Implications

- `batch-278` should remain the only planned batch for this source.
- The plan should stay locked to pages 1-16 and should not absorb other AG or Law Manual reprint files.
- The duplicate/reprint caveat should stay visible in both the plan and the review packet.

## Operating Note

- AG 48 Law Manual reprint processing is a companion-source inventory burn-down step.
- The slice should stay source-bound, page-bounded, and review-first.
- If a later comparison against the active AG 48 source is needed, it should be a separate human review task.
