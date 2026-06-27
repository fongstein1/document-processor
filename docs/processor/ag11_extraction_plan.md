# Controlled AG 11 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready,
and not promoted.

## Why This Exists

AG 11 is a compact one-page guideline about the effect of an early election
by an insurance company of an operative date under Section 5-C of the
Standard Nonforfeiture Law for Life Insurance. It is small enough to process
as a single review-only unit, but it still contains sales-discontinuation,
like-plans, generic-form, and commissioner-satisfaction language that should
stay review-only until a human confirms how it should be indexed.

## Source Scope

- Primary source file: `AG 11 - Effect of an Early Election by an Insurance Company of an Operative Date under.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XI`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 only
- Source posture: single-page guideline / interpretation; page-level locator only

### Boundaries

- Keep planning focused on this single AG 11 PDF.
- Do not widen into later guideline files.
- Keep the operative-date, like-plan, and generic-form language review-only
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
| `ag11-operative-date-election` | Effect of an early election of an operative date under Section 5-C of the Standard Nonforfeiture Law for Life Insurance | 1 | Medium | regulatory_requirement, definition_or_terminology, governance_or_control_expectation, cross_reference_mapping, requires_human_interpretation, boundary_control_window | Section 5-C, operative date, like plans, generic form, cash values, Commissioner satisfaction |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-089` | AG 11 one-page interpretation | 1 | Capture the full one-page guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Nonforfeiture language that directly changes the treatment of the covered
  operative date or plan-discontinuation conditions.

### What counts as terminology or interpretation

- Operative date, like plans, generic form, cash values, and the supporting
  actuarial-language framing.

### What counts as cross-reference mapping

- References to Section 5-C, the Standard Nonforfeiture Law for Life
  Insurance, like plans, or generic form language when they appear as context
  for the interpretation note.

### What requires human actuarial interpretation

- Whether AG 11 should stay indexed as a standalone interpretive note or be
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

- Add lightweight validation for `config/ag11-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag11-batch-definitions.mjs`
  synchronized with the planned `batch-089` slice.
- Add future checks for operative-date, like-plan, generic-form, and no-
  promotion guardrails.
- Keep the plan separate from AG 10, later guideline files, VM-20, VM-21,
  VM-22, the practice note wave, and the supporting VM chapter wave so the
  processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only
unless a later human review explicitly changes the indexing choice.
