# Controlled AG 14 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready,
and not promoted.

## Why This Exists

AG 14 is a two-page interim surveillance procedure for review of the
Actuarial Opinion for life and health insurers. The source reads like an
historical oversight procedure rather than learner-facing policy text, so the
batch should stay caveat-first, source-bound, and review-only. The text layer
is noisy enough that the page image should remain the wording backstop.

## Source Scope

- Primary source file: `AG 14 - Surveillance Procedure Regarding the Actuarial Opinion for Life and Health Insurers.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XIV`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-2
- page 1 carries the preamble and items 1-10 of the surveillance procedure.
- page 2 continues with items 11-12 and the copyright line.
- Source posture: historical / interim procedure; no withdrawn notice observed in the scanned copy

### Boundaries

- Keep planning focused on this single AG 14 PDF.
- Do not widen into AG 15 or later guideline files.
- Keep the historical / interim procedure posture explicit in every batch artifact.
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
| `ag14-surveillance-procedure-actuarial-opinion` | Interim surveillance procedure for review of the Actuarial Opinion for life and health insurers | 1-2 | Medium | regulatory_requirement, reporting_requirement, documentation_expectation, governance_or_control_expectation, caveat_or_companion_guidance, cross_reference_mapping, requires_human_interpretation, boundary_control_window | actuarial opinion, actuarial report, qualified actuaries, documentation, confidentiality, IRIS ratios, model legislation, regulations |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-092` | AG 14 surveillance procedure | 1-2 | Capture the full two-page interim procedure as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty, acceptance standard, review expectation, or required follow-up for the regulator or company.

### What counts as terminology or interpretation

- Actuarial Opinion, actuarial report, qualified actuary, IRIS ratios, and confidentiality language when it is historical context rather than active instruction.

### What counts as caveat-first historical guidance

- The interim procedure framing and any language that explains how the regulator should review or request support documents before model legislation or regulations are fully in effect.

### What counts as cross-reference mapping

- References to actuarial opinion instructions, actuarial reports, IRIS ratios, model legislation, regulations, confidentiality rules, or follow-up review steps when they appear as mapping clues.

### What requires human actuarial interpretation

- Whether AG 14 should stay indexed as historical caveat-first guidance or be linked only as a surveillance-procedure note for actuarial-opinion review.
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

- Add lightweight validation for `config/ag14-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag14-batch-definitions.mjs`
  synchronized with the planned `batch-092` slice.
- Add future checks for historical-guidance, caveat-first, and no-promotion
  guardrails.
- Keep the plan separate from AG 13, later guideline files,
  `docs/review/ag13_review_index.md`, `docs/review/vm20_review_index.md`,
  `docs/review/supporting_vm_review_index.md`, `docs/review/vm21_review_index.md`,
  `docs/review/vm22_review_index.md`, `docs/review/valuation_regulation_repository_poc_status.md`,
  VM-20, VM-21, VM-22, the practice note wave, and the supporting VM chapter
  wave so the processor stays portable across source families.

## Operating Note

This is a small, self-contained historical guideline unit. It should stay
review-only unless a later human review explicitly changes the indexing
choice.
