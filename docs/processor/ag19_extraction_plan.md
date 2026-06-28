# Controlled AG 19 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not
RAG-ready, and not promoted. The batch is not RAG-ready by default.

## Why This Exists

AG 19 is a one-page mortality-table guideline concerning the 1980
Commissioners' Standard Ordinary Mortality Table with Ten-Year Select
Mortality Factors. The page is compact enough to process as a single
review-only batch, but the table-context language and text-layer encoding
noise should stay source-bound until later human review confirms the
indexing choice.

## Source Scope

- Primary source file: `AG 19 - Guideline Concerning 1980 Commissioners' Standard Ordinary Mortality Table With 10-Year Select Mortality Factors.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XIX`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1
- page 1 carries the mortality-table guideline, including the Standard
  Valuation Law and Standard Nonforfeiture Law references and the select
  mortality factor context.
- Source posture: active guideline / interpretive mortality-table guidance;
  no withdrawn notice observed in the scanned copy

### Boundaries

- Keep planning focused on this single AG 19 PDF.
- Do not widen into AG 20 or later guideline files.
- Keep the active guideline posture explicit in every batch artifact.
- Treat the guideline as review-only mortality-table guidance, not
  learner-facing policy text.
- Keep any PDF text-extraction noise visible as a caveat, not a promotion
  signal.
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
| `ag19-1980-cso-select-mortality-factors` | 1980 CSO mortality table with ten-year select mortality factors interpretation | 1 | Medium | regulatory_requirement, definition_or_terminology, cross_reference_mapping, formula_context, background_content, requires_human_interpretation, boundary_control_window | 1980 Commissioners' Standard Ordinary Mortality Table, Ten-Year Select Mortality Factors, Standard Valuation Law, Standard Nonforfeiture Law, Society of Actuaries Special Committee, alternative select factors |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-097` | AG 19 mortality-table guideline | 1 | Capture the full one-page guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty, permitted treatment, or required mortality-table language in
  the select-factor context.

### What counts as terminology or interpretation

- 1980 CSO mortality table, Ten-Year Select Mortality Factors, and
  alternative select-factor phrasing when they explain rather than direct.

### What counts as calculation structure

- The way the table and select factors are described when the guideline is
  framing how the mortality basis is applied.

### What counts as formula context

- Table-factor references and the Standard Valuation Law / Standard
  Nonforfeiture Law mapping language when they frame the table selection
  rather than impose a separate duty.

### What counts as cross-reference mapping

- References to the Standard Valuation Law, Standard Nonforfeiture Law,
  Society of Actuaries materials, or the 1980 CSO table when they appear as
  mapping clues.

### What counts as background content

- The title line and explanatory framing sentence unless they impose a duty.

### What requires human actuarial interpretation

- Whether the select-factor explanation should be read as operational
  guidance versus explanatory context.
- Whether the page-image wording should be confirmed before any later
  indexing choice because the text layer is noisy.

### How to handle source-quality caveats

- Treat text-layer noise as review-only and preserve the page locator.
- Do not widen the batch because of OCR or encoding noise.

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

- Add lightweight validation for `config/ag19-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag19-batch-definitions.mjs`
  synchronized with the planned `batch-097` slice.
- Add future checks for mortality-table context, cross-reference mapping, and
  no-promotion guardrails.
- Keep the plan separate from AG 18, AG 20, AG 21, `docs/review/ag18_review_index.md`,
  `docs/review/vm20_review_index.md`, `docs/review/supporting_vm_review_index.md`,
  `docs/review/vm21_review_index.md`, `docs/review/vm22_review_index.md`,
  `docs/review/valuation_regulation_repository_poc_status.md`, VM-20, VM-21,
  VM-22, the practice note wave, and the supporting VM chapter wave so the
  processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only
unless a later human review explicitly changes the indexing choice.
