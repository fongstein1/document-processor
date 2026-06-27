# Controlled AG 07 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Why This Exists

AG 07 is a short two-page actuarial guideline about calculation of equivalent level amounts. It is small enough to process as one review-only unit, but it still contains pure-endowment and expense-allowance interpretation that should stay review-only until a human confirms how it should be indexed.

## Source Scope

- Primary source file: `AG 07 - Calculation of Equivalent Level Amounts.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline VII`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 and page 2 only
- Source posture: two-page guideline / interpretation; page-level locator only

### Boundaries

- Keep planning focused on this single AG 07 PDF.
- Do not widen into other Actuarial Guidelines files in the same folder.
- Keep the equivalent-level-amount and pure-endowment language review-only until a human confirms the indexing decision.
- Keep any PDF text-extraction noise visible as a caveat, not a promotion signal.
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
| `ag07-equivalent-level-amounts` | Interpretation regarding calculation of equivalent level amounts | Medium | regulatory_requirement, formula_context, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | pure endowments, equivalent level amounts, expense allowances, valuation law, nonforfeiture law, reserves, weighted average death benefits |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-082` | Two-page AG 07 interpretation | 1-2 | Capture the full two-page guideline as a single review-only slice and stop at the page boundary | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Equivalent-level-amount or expense-allowance language that directly changes the treatment of the covered calculations.

### What counts as terminology or interpretation

- `equivalent level amounts`, `pure endowments`, `expense allowances`, and the supporting actuarial-language framing.
- The page text that explains how the model laws apply to equivalent-level amount calculations.

### What counts as cross-reference mapping

- References to the Standard Valuation Law, the Standard Nonforfeiture Law, reserves, or nonforfeiture values when they appear as context for the interpretation note.
- Any mention of the underlying premium calculations when they are used only to explain the equivalent-level-amount choice.

### What requires human actuarial interpretation

- Whether this guideline should remain a standalone interpretive item or be cross-linked to the underlying equivalent-level-amount guidance in a later cleanup step.
- Whether the OCR / encoded text layer needs manual confirmation against the page images before any later promotion decision.

### How to handle source-quality caveats

- Treat text-layer noise or PDF encoding issues as review-only and preserve the page locator.
- Do not widen the batch just because the text layer is noisy.

## Promotion Gates

Everything in this plan remains review-only by default.

### Learner-facing

An extracted item can only become learner-facing when all of the following are true:

- source citation exists
- source support is clear
- wording is not misleading
- confidence is high
- no unresolved review flags exist

### App-ready

An extracted item can only become app-ready when it is already eligible for learner-facing use and the export is sanitized, stable, and versioned for the app thread.

### RAG-ready

An extracted item can only become RAG-ready when it is approved, source-bound, and indexed with a stable ID, citation, locator, and review status that no longer requires human disposition.

## Validation Implications

- Add lightweight validation for `config/ag07-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan exists and stays well formed.
- When the real batch starts, keep `scripts/ag07-batch-definitions.mjs` synchronized with the planned `batch-082` slice.
- Add future checks for two-page guideline handling, pure-endowment tagging, and no-promotion guardrails.
- Keep the plan separate from AG 01, AG 02, AG 03, AG 04, AG 05, AG 06, VM-20, VM-21, VM-22, the practice note wave, and other guideline files so the processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only unless a later human review explicitly changes the indexing choice.
