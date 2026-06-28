# Controlled AG 20 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why This Exists

AG 20 is a compact seven-page guideline on joint life functions for the 1980
CSO mortality table. It combines one title / guidance page, one deduction-table
page, one blank separator page, and a run of lookup-table pages that reproduce
Appendix 5 material. The unit is small enough to process as a single
review-only batch while keeping the tables source-bound and the page boundary
visible.

## Source Scope

- Primary source file: `AG 20 - Guideline Concerning Joint Life Functions for
  1980 Commissioners' Standard Ordinary Mortality Table.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XX`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-7
- Observed page windows:
  - page 1: title, acceptability language, and exact joint-life-function note
  - page 2: table A5-1 deduction / equivalent equal ages
  - page 3: blank separator page
  - pages 4-7: ultimate 1xx tables A5-6 and A5-7 with ANB / ALB values, and
    page 7 closes the table family
- Source posture: active guideline / interpretive table guidance

### Boundaries

- Keep planning focused on this single AG 20 PDF.
- Do not widen into AG 21 or later guideline files.
- Keep the active guideline posture explicit in every batch artifact.
- Keep the page 3 blank separator visible as a boundary marker, not a cue to
  split the batch wider.
- Treat the guideline as review-only table guidance, not learner-facing policy
  text.
- Keep the batch source-bound and review-only.

### Exclusions

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No other guideline files in the same wave.

## Topic Map

| Topic ID | Section / topic family | Page range | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- | --- |
| `ag20-joint-life-functions-1980-cso` | Joint life functions and equivalent equal-age tables for the 1980 CSO basis | 1-7 | Medium | regulatory_requirement, definition_or_terminology, calculation_structure, formula_context, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | 1980 CSO mortality table, uniform seniority, Ultimate 1xx Tables, Appendix 5 of the Society of Actuaries Committee on Specifications for Monetary Values, A5-1, A5-6, A5-7, equivalent equal ages, joint life policies |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-098` | AG 20 joint-life-functions guideline | pages 1-7 | Capture the full guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty, permitted treatment, or required table-use language in the
  joint-life-function context.

### What counts as terminology or interpretation

- 1980 CSO mortality table, uniform seniority, Ultimate 1xx Tables, A5-1,
  A5-6, A5-7, and equivalent equal ages when the text explains rather than
  directs.

### What counts as calculation structure

- The way the deduction table and lookup tables are framed when the guideline
  shows how joint-life functions are assembled for the 1980 CSO basis.

### What counts as formula context

- Table references and joint-life-function wording when they frame the table
  selection rather than impose a separate duty.

### What counts as cross-reference mapping

- References to the Society of Actuaries Committee on Specifications for
  Monetary Values, Appendix 5, the 1980 CSO table, or the named table labels
  when they appear as mapping clues.

### What counts as background content

- The title line and explanatory framing sentence unless they impose a duty.

### What requires human actuarial interpretation

- Whether the acceptability language should be read as operational guidance or
  explanatory context.
- Whether the page 3 blank separator should be called out explicitly in the
  review packet or left as a boundary marker.

### How to handle source-quality caveats

- Treat the blank separator page as a review-only boundary marker.
- Do not widen the batch because the interior page is blank.

## Promotion Gates

Everything in this plan remains review-only by default.

### Learner-facing

An extracted item can only become learner-facing when all of the following are
true:

- source citation exists
- source support is clear
- wording is not misleading
- confidence is high
- no unresolved review flags exist

### App-ready

An extracted item can only become app-ready when it is already eligible for
learner-facing use and the export is sanitized, stable, and versioned for the
app thread.

### RAG-ready

An extracted item can only become RAG-ready when it is approved, source-bound,
and indexed with a stable ID, citation, locator, and review status that no
longer requires human disposition.

## Validation Implications

- Add lightweight validation for `config/ag20-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag20-batch-definitions.mjs`
  synchronized with the planned `batch-098` slice.
- Add future checks for table continuity, the page 3 separator, and no-
  promotion guardrails.
- Keep the plan separate from AG 19, AG 21, `docs/review/ag19_review_index.md`,
  `docs/review/vm20_review_index.md`, `docs/review/supporting_vm_review_index.md`,
  `docs/review/vm21_review_index.md`, `docs/review/vm22_review_index.md`,
  `docs/review/valuation_regulation_repository_poc_status.md`, VM-20, VM-21,
  VM-22, the practice note wave, and the supporting VM chapter wave so the
  processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only
unless a later human review explicitly changes the indexing choice.
