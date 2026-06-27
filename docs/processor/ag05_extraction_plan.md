# Controlled AG 05 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Why This Exists

AG 05 is a short two-page actuarial guideline about acceptable approximations
for continuous functions. It is small enough to process as one review-only
unit, but it still contains reserve/value approximation language, formula
context, and source-quality caveats that should stay review-only until a
human confirms how it should be indexed.

## Source Scope

- Primary source file: `AG 05 - Acceptable Approximations for Continuous Functions.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline V`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 and page 2 only
- Source posture: two-page guideline / interpretation; page-level locator only

### Boundaries

- Keep planning focused on this single AG 05 PDF.
- Do not widen into other Actuarial Guidelines files in the same folder.
- Keep the continuous-function approximation language review-only until a
  human confirms the indexing decision.
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

| Topic ID | Section / topic family | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `ag05-continuous-functions-guideline` | Acceptable approximations for continuous functions | Medium | regulatory_requirement, formula_context, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | reserves, values, continuous functions, death benefits, gross premiums, mortality, interest rate |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-080` | Two-page AG 05 interpretation | 1-2 | Capture the full two-page guideline as a single review-only slice and stop at the page boundary | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Approximation language that directly changes the treatment of reserves or
  values for the covered continuous-function calculations.

### What counts as formula context or terminology

- `continuous functions`, reserve/value approximations, and the supporting
  actuarial-function language.
- The page text that explains the alternate assumptions for death benefits and
  gross premiums.

### What counts as cross-reference mapping

- References to reserves, nonforfeiture values, mortality, or interest-rate
  language when they appear as context for the approximation note.
- Any mention of the underlying integrals or actuarial functions when they are
  used only to explain the approximation choice.

### What requires human actuarial interpretation

- Whether this guideline should remain a standalone interpretive item or be
  cross-linked to the underlying approximation formulas in a later cleanup
  step.
- Whether the OCR / encoded text layer needs manual confirmation against the
  page images before any later promotion decision.

### How to handle source-quality caveats

- Treat text-layer noise or PDF encoding issues as review-only and preserve
  the page locator.
- Do not widen the batch just because the text layer is noisy or formula
  heavy.

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

- Add lightweight validation for `config/ag05-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag05-batch-definitions.mjs`
  synchronized with the planned `batch-080` slice.
- Add future checks for two-page guideline handling, formula-context tagging,
  and no-promotion guardrails.
- Keep the plan separate from AG 01, AG 02, AG 03, AG 04, VM-20, VM-21,
  VM-22, the practice note wave, and other guideline files so the processor
  stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only
unless a later human review explicitly changes the indexing choice.
