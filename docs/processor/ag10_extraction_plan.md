# Controlled AG 10 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not
not RAG-ready, and not promoted.

## Why This Exists

AG 10 is a compact one-page guideline about the interpretation of the NAIC
Standard Nonforfeiture Law for individual deferred annuities. It is small
enough to process as a single review-only unit, but it still contains cash
surrender, maturity-value, and additional-amount language that should stay
review-only until a human confirms how it should be indexed.

## Source Scope

- Primary source file: `AG 10 - Guideline for Interpretation of NAIC Standard Nonforfeiture Law for Individual Deferred Annuities.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline X`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 only
- Source posture: single-page guideline / interpretation; page-level locator only

### Boundaries

- Keep planning focused on this single AG 10 PDF.
- Do not widen into AG 11 or later guideline files.
- Keep the cash surrender benefit / additional-amount language review-only
  until a human confirms the indexing decision.
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
| `ag10-standard-nonforfeiture-law-interpretation` | Interpretation of the NAIC Standard Nonforfeiture Law for individual deferred annuities | 1 | Medium | regulatory_requirement, formula_context, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | cash surrender benefits, additional amounts credited, maturity values, deferred annuities, Model Law |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-088` | AG 10 one-page interpretation | 1 | Capture the full one-page guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Nonforfeiture language that directly changes the treatment of the covered
  annuity reserve or cash-surrender calculation.

### What counts as terminology or interpretation

- Cash surrender benefits, additional amounts credited, maturity values, and
  the supporting actuarial-language framing.

### What counts as cross-reference mapping

- References to the NAIC Model Law, cash surrender values, maturity values,
  or nonforfeiture benefits when they appear as context for the interpretation
  note.

### What requires human actuarial interpretation

- Whether AG 10 should stay indexed as a standalone interpretive note or be
  cross-linked to later annuity reserve guidance in a cleanup step.
- Whether the OCR / encoded text layer needs manual confirmation against the
  page image before any later promotion decision.

### How to handle source-quality caveats

- Treat text-layer noise as review-only and preserve the page locator.
- Do not widen the batch because of OCR noise.

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

- Add lightweight validation for `config/ag10-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag10-batch-definitions.mjs`
  synchronized with the planned `batch-088` slice.
- Add future checks for cash-surrender benefit tagging, maturity-value
  mapping, and no-promotion guardrails.
- Keep the plan separate from AG 09, AG 11, VM-20, VM-21, VM-22, the
  practice note wave, and the supporting VM chapter wave so the processor
  stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only
unless a later human review explicitly changes the indexing choice.
