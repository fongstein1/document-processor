# Controlled AG 16 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not
RAG-ready, and not promoted. The batch is not RAG-ready by default.

## Why This Exists

AG 16 is a one-page CRVM guideline on select mortality and/or split interest.
The page is compact enough to process as a single review-only batch, but the
wording is old enough and the text layer is noisy enough that the extraction
should stay source-bound until a later human review confirms the indexing
choice.

## Source Scope

- Primary source file: `AG 16 - Guideline for Calculation of Commissioners' Reserve Valuation Method on Select Mortality andor Split Interest.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XVI`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1
- page 1 carries the full CRVM guideline, including the select-mortality and split-interest explanation.
- Source posture: historical guideline / caveat-first CRVM interpretation; no withdrawn notice observed in the scanned copy

### Boundaries

- Keep planning focused on this single AG 16 PDF.
- Do not widen into AG 17 or later guideline files.
- Keep the historical guideline posture explicit in every batch artifact.
- Treat the guideline as caveat-first historical guidance, not learner-facing
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
| `ag16-crvm-select-mortality-split-interest` | CRVM select mortality and split-interest interpretation | 1 | Medium | regulatory_requirement, definition_or_terminology, formula_context, cross_reference_mapping, background_content, requires_human_interpretation, boundary_control_window, historical_guidance | 19P[x]+1, 1980 CSO Table, select mortality factors, split interest rates, full preliminary term basis, Standard Valuation Law, Section 4 |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-094` | AG 16 CRVM select mortality / split-interest guideline | 1 | Capture the full one-page guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty, permitted treatment, or required CRVM calculation language in
  the select-mortality and split-interest context.

### What counts as terminology or interpretation

- 19P[x]+1, select mortality factors, split interest, renewal net level premium,
  1980 CSO tables, and full preliminary term phrasing when they are explanation
  context rather than active instruction.

### What counts as caveat-first historical guidance

- The guideline framing and any language that explains why the CRVM approach is
  logical without being mistaken for broader actuarial policy text.

### What counts as cross-reference mapping

- References to the 1980 CSO Table, the Standard Valuation Law, Section 4, or
  related CRVM terminology when they appear as mapping clues.

### What requires human actuarial interpretation

- Whether AG 16 should stay indexed as historical caveat-first guidance or be
  linked only as a select-mortality / split-interest note.
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

- Add lightweight validation for `config/ag16-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag16-batch-definitions.mjs`
  synchronized with the planned `batch-094` slice.
- Add future checks for historical-guidance, caveat-first, and no-promotion
  guardrails.
- Keep the plan separate from AG 15, later guideline files,
  `docs/review/ag15_review_index.md`, `docs/review/ag14_review_index.md`,
  `docs/review/ag13_review_index.md`, `docs/review/vm20_review_index.md`,
  `docs/review/supporting_vm_review_index.md`, `docs/review/vm21_review_index.md`,
  `docs/review/vm22_review_index.md`, `docs/review/valuation_regulation_repository_poc_status.md`,
  VM-20, VM-21, VM-22, the practice note wave, and the supporting VM chapter wave
  so the processor stays portable across source families.

## Operating Note

This is a small, self-contained historical guideline unit. It should stay
review-only unless a later human review explicitly changes the indexing
choice.
