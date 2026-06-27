# Controlled AG 02 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Why This Exists

AG 02 is a short two-page actuarial guideline about reserve requirements with respect to interest-rate guidelines on active life funds held relative to group annuity contracts. It is small enough to process as one review-only unit, but it still contains reserve-method language, a values table, and cross-reference material that should stay review-only until a human confirms how it should be indexed.

## Source Scope

- Primary source file: `AG 02 - Valuation of Active Life Funds Held Relative to Group Annuity Contracts.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline II`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 and page 2 only
- Source posture: two-page guideline / interpretation; page-level locator only

### Boundaries

- Keep planning focused on this single PDF.
- Do not widen into other Actuarial Guidelines files in the same folder.
- Keep the active-life-funds and group-annuity-contract language review-only until a human confirms the indexing decision.
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
| `ag02-active-life-funds-guideline` | Interest-rate guideline for active life funds held relative to group annuity contracts | Medium | regulatory_requirement, reserve_method_structure, prescribed_assumption, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | Standard Valuation Law, group annuity contracts, active life funds, interest-rate guidelines |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-078` | Two-page AG 02 interpretation | 1-2 | Capture the full two-page guideline as a single review-only slice and stop at the page boundary | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Reserve or valuation treatment that directly changes the minimum standard for active life funds held relative to group annuity contracts.

### What counts as terminology or interpretation

- `active life funds`, `group annuity contracts`, and the reserve language around interest-rate guidelines.
- The guideline's interpretation of how the valuation procedure applies to active life funds and related group annuity liabilities.

### What counts as cross-reference mapping

- References to the Standard Valuation Law without expanding beyond the two-page slice.
- Any mention of the 1980 amendments or later NAIC amendments when they are used as context for the guideline.

### What requires human actuarial interpretation

- Whether this guideline should remain a standalone interpretive item or be cross-linked to the underlying Standard Valuation Law text in a later cleanup step.
- Whether the OCR / encoded text layer needs manual confirmation against the page image before any later promotion decision.

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

- Add lightweight validation for `config/ag02-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan exists and stays well formed.
- When the real batch starts, keep `scripts/ag02-batch-definitions.mjs` synchronized with the planned `batch-078` slice.
- Add future checks for two-page guideline handling, cross-reference tagging, and no-promotion guardrails.
- Keep the plan separate from AG 01, AG 03, VM-20, VM-21, VM-22, the practice note wave, and other guideline files so the processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only unless a later human review explicitly changes the indexing choice.
