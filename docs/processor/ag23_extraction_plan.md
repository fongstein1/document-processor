# Controlled AG 23 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why This Exists

AG 23 is a compact one-page guideline on variable life insurance separate
account investments. The page is OCR-noisy and includes a placeholder
statutory reference, so the page image should remain the backstop for exact
wording. The unit is small enough to process as a single review-only batch
while keeping the active guidance posture explicit.

## Source Scope

- Primary source file: `AG 23 - Guideline Concerning Variable Life Insurance
  Separate Account Investments.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XXIII`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 only
- Observed section windows:
  - page 1: title, sufficiency standard, definition of readily marketable
    assets, and the 15% / 10% demonstration thresholds
- Source posture: active guideline / regulatory guidance

### Boundaries

- Keep planning focused on this single AG 23 PDF.
- Do not widen into AG 24 or later guideline files.
- Keep the active guideline posture explicit in every batch artifact.
- Keep the page image as the backstop for exact wording because the text layer
  is noisy / encoded and includes a placeholder statutory reference.
- Treat the guideline as review-only regulatory guidance, not learner-facing
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
| `ag23-separate-account-investments` | Variable life insurance separate account investments | 1 | Medium | regulatory_requirement, definition_or_terminology, calculation_structure, formula_context, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | state statutory reference placeholder, readily marketable assets, net investment income, market value, anticipated death benefits, surrenders, withdrawals, 15%, 10%, separate series, portfolios, investment subdivisions |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-101` | AG 23 separate-account investments guideline | page 1 | Capture the full one-page guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty, permitted treatment, or required separate-account-investment
  language in the variable-life context.

### What counts as terminology or interpretation

- Readily marketable assets, net investment income, market value, and the 15%
  / 10% demonstration thresholds when the text explains rather than directs.

### What counts as calculation structure

- The way the guideline frames the sufficiency demonstration and the 15% / 10%
  thresholds until the text clearly instructs a separate duty.

### What counts as formula context

- The asset / obligation comparison and demonstration language when they frame
  the calculation rather than impose a separate duty.

### What counts as cross-reference mapping

- References to state statutory provisions, separate series/portfolio language,
  or investment subdivisions when they appear as mapping clues.

### What counts as background content

- The title line and explanatory framing sentence unless they impose a duty.

### What requires human actuarial interpretation

- Whether the wording should remain a standalone indexing note or a context
  note.
- Whether the page-image wording and placeholder statutory reference should be
  called out explicitly in the review packet.

### How to handle source-quality caveats

- Treat the noisy text layer and placeholder statutory reference as review-only
  caveats and do not widen the batch because OCR looks uncertain.

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

- Add lightweight validation for `config/ag23-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag23-batch-definitions.mjs`
  synchronized with the planned `batch-101` slice.
- Add future checks for the page-image backstop, noisy OCR caveats,
  placeholder statutory references, and no-promotion guardrails.
- Keep the plan separate from AG 22, AG 24, `docs/review/ag22_review_index.md`,
  `docs/review/ag21_review_index.md`, `docs/review/valuation_regulation_repository_poc_status.md`,
  VM-20, VM-21, VM-22, the practice note wave, and the supporting VM chapter
  wave so the processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only
unless a later human review explicitly changes the indexing choice.
