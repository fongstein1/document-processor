# Controlled AG 21 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why This Exists

AG 21 is a compact one-page guideline on CRVM reserves when (b) is greater than (a) and on the rules for determining (a). The page is OCR-noisy, so
the page image should remain the backstop for exact wording. The unit is small
enough to process as a single review-only batch while keeping the active
guidance posture explicit.

## Source Scope

- Primary source file: `AG 21 - Guideline for Calculation of CRVM Reserves
  When (b) is Greater Than (a).pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XXI`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 only
- Observed section windows:
  - page 1: title, rule text, and background information on the `(a)` / `(b)`
    reserve comparison
- Source posture: active guideline / interpretive reserve guidance

### Boundaries

- Keep planning focused on this single AG 21 PDF.
- Do not widen into AG 22 or later guideline files.
- Keep the active guideline posture explicit in every batch artifact.
- Keep the page image as the backstop for exact wording because the text layer
  is noisy / encoded.
- Treat the guideline as review-only reserve guidance, not learner-facing
  policy text.
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
| `ag21-crvm-reserves-b-greater-than-a` | CRVM reserves when `(b)` is greater than `(a)` and rules for determining `(a)` | 1 | Medium | regulatory_requirement, definition_or_terminology, reserve_method_structure, calculation_structure, formula_context, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | Standard Valuation Law, 1980 CSO Tables, modified net premiums, net level premium, full preliminary term method, `(a)`, `(b)` notation |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-099` | AG 21 reserve-comparison guideline | page 1 | Capture the full one-page guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty, permitted treatment, or required reserve-calculation language
  in the `(a)` / `(b)` comparison context.

### What counts as terminology or interpretation

- Standard Valuation Law, 1980 CSO Tables, modified net premiums, net level
  premium, and full preliminary term method when the text explains rather than
  directs.

### What counts as calculation structure

- The way the guideline frames the `(a)` / `(b)` comparison and the zeroing of
  a negative excess as reserve structure until the text clearly instructs a
  separate duty.

### What counts as formula context

- The `(a)` / `(b)` notation and the modified-net-premium language when they
  frame the calculation rather than impose a separate duty.

### What counts as cross-reference mapping

- References to the Standard Valuation Law, Appendix-style mortality tables,
  or the full preliminary term method when they appear as mapping clues.

### What counts as background content

- The title line and explanatory framing sentence unless they impose a duty.

### What requires human actuarial interpretation

- Whether the wording should remain a standalone indexing note or a context
  note.
- Whether the page-image wording should be confirmed before anyone treats the
  page as an indexing candidate.

### How to handle source-quality caveats

- Treat the noisy text layer as a review-only caveat and do not widen the
  batch because OCR looks uncertain.

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

- Add lightweight validation for `config/ag21-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag21-batch-definitions.mjs`
  synchronized with the planned `batch-099` slice.
- Add future checks for the page-image backstop, noisy OCR caveats, and
  no-promotion guardrails.
- Keep the plan separate from AG 20, AG 22, `docs/review/ag19_review_index.md`,
  `docs/review/ag20_review_index.md`, `docs/review/vm20_review_index.md`,
  `docs/review/supporting_vm_review_index.md`, `docs/review/vm21_review_index.md`,
  `docs/review/vm22_review_index.md`, `docs/review/valuation_regulation_repository_poc_status.md`,
  VM-20, VM-21, VM-22, the practice note wave, and the supporting VM chapter
  wave so the processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only
unless a later human review explicitly changes the indexing choice.
