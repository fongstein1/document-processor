# Controlled AG 06 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Why This Exists

AG 06 is a short two-page actuarial guideline about interpretation regarding use of single or joint life mortality tables. It is small enough to process as one review-only unit, but it still contains mortality-table selection, expense allowance, and source-quality caveats that should stay review-only until a human confirms how it should be indexed.

## Source Scope

- Primary source file: `AG 06 - Interpretation Regarding Use of Single or Joint Life Mortality Tables.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline VI`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 and page 2 only
- Source posture: two-page guideline / interpretation; page-level locator only

### Boundaries

- Keep planning focused on this single AG 06 PDF.
- Do not widen into other Actuarial Guidelines files in the same folder.
- Keep the single-life / joint-life mortality table language review-only until a human confirms the indexing decision.
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
| `ag06-single-joint-life-tables` | Interpretation regarding use of single or joint life mortality tables | Medium | regulatory_requirement, formula_context, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | single life, joint life, mortality tables, expense allowances, modified net premium, adjusted premium, reserves, nonforfeiture values |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-081` | Two-page AG 06 interpretation | 1-2 | Capture the full two-page guideline as a single review-only slice and stop at the page boundary | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Mortality-table or expense-allowance language that directly changes the treatment of the covered single-life or joint-life calculations.

### What counts as terminology or interpretation

- `single life`, `joint life`, mortality tables, and the supporting actuarial-language framing.
- The page text that explains how the model laws apply to policies with single-life or joint-life benefits.

### What counts as cross-reference mapping

- References to the Standard Valuation Law, the Standard Nonforfeiture Law, reserves, or nonforfeiture values when they appear as context for the interpretation note.
- Any mention of the underlying premium calculations when they are used only to explain the table-selection choice.

### What requires human actuarial interpretation

- Whether this guideline should remain a standalone interpretive item or be cross-linked to the underlying single-life / joint-life calculation guidance in a later cleanup step.
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

- Add lightweight validation for `config/ag06-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan exists and stays well formed.
- When the real batch starts, keep `scripts/ag06-batch-definitions.mjs` synchronized with the planned `batch-081` slice.
- Add future checks for two-page guideline handling, mortality-table tagging, and no-promotion guardrails.
- Keep the plan separate from AG 01, AG 02, AG 03, AG 04, AG 05, VM-20, VM-21, VM-22, the practice note wave, and other guideline files so the processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only unless a later human review explicitly changes the indexing choice.
