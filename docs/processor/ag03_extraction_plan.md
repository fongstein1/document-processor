# Controlled AG 03 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why This Exists

AG 03 is a single-page actuarial guideline / interpretation about maturity
value and cash surrender treatment under the Standard Nonforfeiture Law. It is
small enough to process as one review-only unit, but it still contains
definition and cross-reference language that should stay review-only until a
human confirms how it should be indexed.

## Source Scope

- Primary source file: `Actuarial Guidelines/AG 03 - Definition of the Term
  Maturity Value in the Standard Nonforfeiture Law of Individual Deferred
  Annuities.pdf`
- Source family: `actuarial_guidelines`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 only
- Source posture: single-page guideline / interpretation; page-level locator
  only

### Boundaries

- Keep planning focused on this single PDF.
- Do not widen into other Actuarial Guidelines files in the same folder.
- Keep the maturity-value and cash-surrender-value language review-only until
  a human confirms the indexing decision.
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
| `ag03-maturity-value-interpretation` | Single-page maturity-value / cash-surrender interpretation | Medium | regulatory_requirement, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | Standard Nonforfeiture Law, Section 4, maturity value, cash surrender value |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-076` | Single-page AG 03 interpretation | 1-1 | Capture the whole one-page guideline as a single review-only slice and stop at the page boundary | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- A cash-surrender or maturity-value rule that directly changes valuation
  treatment.

### What counts as terminology or interpretation

- `maturity value`, `cash surrender value`, and related nonforfeiture terms.
- The note's interpretation of how the term should be used before maturity.

### What counts as cross-reference mapping

- References to the Standard Nonforfeiture Law or Section 4 without expanding
  beyond the page.
- Any mention of the contract-rate / interest-rate rule when it is used only as
  context for the interpretation.

### What requires human actuarial interpretation

- Whether this note should be indexed as a standalone interpretive item or
  cross-linked to the underlying nonforfeiture-law text.
- Whether the OCR / encoded text layer needs manual confirmation against the
  page image before any later promotion decision.

### How to handle source-quality caveats

- Treat text-layer noise or PDF encoding issues as review-only and preserve the
  page locator.
- Do not widen the batch just because the text layer is noisy.

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

- Add lightweight validation for `config/ag03-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag03-batch-definitions.mjs`
  synchronized with the planned `batch-076` slice.
- Add future checks for one-page guideline handling, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20, VM-21, VM-22, the practice note wave, and
  other guideline files so the processor stays portable across source families.

## Operating Note

This is a tiny, self-contained guideline unit. It should stay review-only
unless a later human review explicitly changes the indexing choice.
