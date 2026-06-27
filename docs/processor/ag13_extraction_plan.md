# Controlled AG 13 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready,
and not promoted.

## Why This Exists

AG 13 is a two-page guideline about the Commissioners' Annuity Reserve
Valuation Method and contingent surrender charges. The scanned copy does not
show a withdrawn notice, but the guideline is clearly historical guidance and
should stay caveat-first unless a later human review decides otherwise. The
unit is small enough to process as a single review-only batch, but the
historical CARVM judgment language should stay visible so it cannot be mistaken
for learner-facing policy text.

## Source Scope

- Primary source file: `AG 13 - Guideline Concerning the Commissioners' Annuity Reserve Valuation Method.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XIII`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-2
- page 1 carries the preamble and the opening CARVM interpretation.
- page 2 continues the contingent surrender-charge and bail-out-rate
  judgment language.
- Source posture: historical guideline / interpretation; no withdrawn notice observed in the scanned copy

### Boundaries

- Keep planning focused on this single AG 13 PDF.
- Do not widen into AG 14 or later guideline files.
- Keep the historical CARVM posture explicit in every batch artifact.
- Treat the guideline as caveat-first historical guidance, not learner-facing policy text.
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

| Topic ID | Section / topic family | Page range | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- | --- |
| `ag13-historical-carvm-contingent-surrender-charges` | Historical CARVM guidance on contingent surrender charges and bail-out rates | 1-2 | Medium | regulatory_requirement, definition_or_terminology, caveat_or_companion_guidance, cross_reference_mapping, requires_human_interpretation, boundary_control_window | CARVM, contingent surrender charges, bail-out rates, external index, guaranteed duration, severe hardship |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-091` | AG 13 historical CARVM guidance | 1-2 | Capture the full two-page historical guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment, if any appears on the pages.

### What counts as terminology or interpretation

- CARVM, contingent surrender charge, bail-out rate, and guarantee language when it is historical context rather than active instruction.

### What counts as caveat-first historical guidance

- The historical framing around contingent surrender charges and any judgment language that explains when a surrender charge may or may not be treated as available.

### What counts as cross-reference mapping

- References to CARVM, guaranteed duration, external index values, cash surrender values, or severe hardship when they appear as indexing clues.

### What requires human actuarial interpretation

- Whether AG 13 should stay indexed as historical caveat-first guidance or be cross-linked to a broader CARVM note.
- Whether the page-image wording should be confirmed before any later indexing choice because the text layer is noisy.

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

- Add lightweight validation for `config/ag13-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag13-batch-definitions.mjs`
  synchronized with the planned `batch-091` slice.
- Add future checks for historical-guidance, caveat-first, and no-promotion
  guardrails.
- Keep the plan separate from AG 10, AG 11, AG 12, later guideline files,
  `docs/review/ag12_review_index.md`, `docs/review/vm20_review_index.md`,
  `docs/review/supporting_vm_review_index.md`, `docs/review/vm21_review_index.md`,
  `docs/review/vm22_review_index.md`, `docs/review/valuation_regulation_repository_poc_status.md`,
  VM-20, VM-21, VM-22, the practice note wave, and the supporting VM chapter
  wave so the processor stays portable across source families.

## Operating Note

This is a small, self-contained historical guideline unit. It should stay
review-only unless a later human review explicitly changes the indexing
choice.
