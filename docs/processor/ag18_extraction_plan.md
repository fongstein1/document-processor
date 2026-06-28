# Controlled AG 18 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not
RAG-ready, and not promoted. The batch is not RAG-ready by default.

## Why This Exists

AG 18 is a one-page CRVM guideline on semi-continuous, fully continuous, or
discounted continuous basis calculations. The page is compact enough to
process as a single review-only batch, but the formula language and text-layer
encoding noise should stay source-bound until later human review confirms the
indexing choice.

## Source Scope

- Primary source file: `AG 18 - Guideline for Calculation of Commissioners' Reserve Valuation Method on Semi-Continuous, Fully Continuous, or Discounted Continuous Basis.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XVIII`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1
- page 1 carries the full CRVM guideline, including the explanation of the basis choice and the expense allowance context.
- Source posture: active guideline / interpretive calculation guidance; no withdrawn notice observed in the scanned copy

### Boundaries

- Keep planning focused on this single AG 18 PDF.
- Do not widen into AG 19 or later guideline files.
- Keep the active guideline posture explicit in every batch artifact.
- Treat the guideline as review-only calculation guidance, not learner-facing
  policy text.
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
| `ag18-crvm-continuous-basis` | CRVM semi-continuous / fully continuous / discounted continuous basis interpretation | 1 | Medium | regulatory_requirement, definition_or_terminology, calculation_structure, formula_context, cross_reference_mapping, background_content, requires_human_interpretation, boundary_control_window | modified net premiums, Section 4, initial expense allowance, curtate functions, semi-continuous functions, fully continuous functions, discounted continuous functions |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-096` | AG 18 continuous-basis guideline | 1 | Capture the full one-page guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty, permitted treatment, or required CRVM calculation language in
  the continuous-basis context.

### What counts as terminology or interpretation

- Semi-continuous, fully continuous, discounted continuous, curtate functions,
  modified net premiums, and initial expense allowance phrasing when they
  explain rather than direct.

### What counts as calculation structure

- The choice of basis and the way the expense allowance is applied when the
  guideline is describing the calculation flow.

### What counts as formula context

- Function-basis notation and the excess-of-(a)-over-(b) wording when they are
  used to frame the reserve calculation rather than to impose a separate duty.

### What counts as cross-reference mapping

- References to the Standard Valuation Law, Section 4, the modified net
  premium definition, or the initial expense allowance when they appear as
  mapping clues.

### What counts as background content

- The title line and explanatory framing sentence unless they impose a duty.

### What requires human actuarial interpretation

- Whether the basis choice should be read as operational guidance versus
  explanatory context.
- Whether the page-image wording should be confirmed before any later indexing
  choice because the text layer is noisy.

### How to handle source-quality caveats

- Treat text-layer noise as review-only and preserve the page locator.
- Do not widen the batch because of OCR or encoding noise.

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

- Add lightweight validation for `config/ag18-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag18-batch-definitions.mjs`
  synchronized with the planned `batch-096` slice.
- Add future checks for calculation-structure, formula-context, and no-
  promotion guardrails.
- Keep the plan separate from AG 17, AG 16, AG 15, AG 14, AG 13,
  `docs/review/ag17_review_index.md`, `docs/review/vm20_review_index.md`,
  `docs/review/supporting_vm_review_index.md`,
  `docs/review/vm21_review_index.md`, `docs/review/vm22_review_index.md`,
  `docs/review/valuation_regulation_repository_poc_status.md`, VM-20, VM-21,
  VM-22, the practice note wave, and the supporting VM chapter wave so the
  processor stays portable across source families.

## Operating Note

This is a small, self-contained guideline unit. It should stay review-only
unless a later human review explicitly changes the indexing choice.
