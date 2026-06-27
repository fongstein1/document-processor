# Controlled AG 04 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Why This Exists

AG 04 is a short two-page actuarial guideline about minimum reserves for certain forms of term life insurance. It is small enough to process as one review-only unit, but it still contains reserve-method language, mortality references, and reinsured-business language that should stay review-only until a human confirms how it should be indexed.

## Source Scope

- Primary source file: `AG 04 - Minimum Reserves for Certain Forms of Term Insurance.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline IV`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 and page 2 only
- Source posture: two-page guideline / interpretation; page-level locator only

### Boundaries

- Keep planning focused on this single PDF.
- Do not widen into other Actuarial Guidelines files in the same folder.
- Keep the term-life-insurance reserve language review-only until a human confirms the indexing decision.
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
| `ag04-term-life-reserve-guideline` | Minimum reserves for certain forms of term life insurance | Medium | regulatory_requirement, reserve_method_structure, prescribed_assumption, formula_context, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | Standard Valuation Law, 1958 CSO mortality table, reinsured business, term renewal / expiry language |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-079` | Two-page AG 04 interpretation | 1-2 | Capture the full two-page guideline as a single review-only slice and stop at the page boundary | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Reserve treatment that directly changes the minimum standard for the covered term insurance forms.

### What counts as terminology or interpretation

- `term life insurance`, `minimum reserves`, and the reserve language around the covered policy forms.
- The note's interpretation of how the reserve method applies to the covered term plans and reinsured business.

### What counts as cross-reference mapping

- References to the Standard Valuation Law without expanding beyond the two-page slice.
- Any mention of the 1958 CSO mortality table or later reserve standards when they are used as context for the interpretation.

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

- Add lightweight validation for `config/ag04-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan exists and stays well formed.
- When the real batch starts, keep `scripts/ag04-batch-definitions.mjs` synchronized with the planned `batch-079` slice.
- Add future checks for two-page guideline handling, cross-reference tagging, and no-promotion guardrails.
- Keep the plan separate from AG 01, AG 02, AG 03, VM-20, VM-21, VM-22, the practice note wave, and other guideline files so the processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only unless a later human review explicitly changes the indexing choice.
