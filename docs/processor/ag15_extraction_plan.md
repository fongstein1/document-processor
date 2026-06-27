# Controlled AG 15 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready,
and not promoted.

## Why This Exists

AG 15 is a one-page illustration guideline for variable life insurance model
regulation. The page contains a compact list of illustration requirements and
cross-reference language, so it is small enough to process as a single
review-only batch. The page is encoded/noisy enough that the wording should
stay source-bound and review-only until human review confirms the indexing
choice.

## Source Scope

- Primary source file: `AG 15 - Illustration Guideline for Variable Life Insurance Model Regulation.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XV`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1
- page 1 carries the full illustration guideline, including the numbered items.
- Source posture: historical guideline / illustration rules; no withdrawn notice observed in the scanned copy

### Boundaries

- Keep planning focused on this single AG 15 PDF.
- Do not widen into AG 16 or later guideline files.
- Keep the historical guideline posture explicit in every batch artifact.
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
| `ag15-variable-life-illustration-guideline` | Illustration rules for variable life insurance model regulation | 1 | Medium | regulatory_requirement, reporting_requirement, documentation_expectation, governance_or_control_expectation, caveat_or_companion_guidance, cross_reference_mapping, requires_human_interpretation, boundary_control_window | hypothetical interest rates, accumulated policy values, mortality charges, administrative charges, transaction charges, Article VII, Variable Life Insurance Model Regulation, prospectus |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-093` | AG 15 illustration guideline | 1 | Capture the full one-page guideline as a single review-only slice and stop at the page boundary. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty, permitted treatment, or required disclosure in the sales illustration context.

### What counts as terminology or interpretation

- Hypothetical interest rates, accumulated policy values, asset charges, transaction charges, and fixed-versus-variable funding language when they are guidance context rather than active instruction.

### What counts as caveat-first historical guidance

- The guideline framing and any language that explains how illustrations should be presented, disclosed, or cross-referenced without being mistaken for actual investment results.

### What counts as cross-reference mapping

- References to Article VII, the Variable Life Insurance Model Regulation, prospectus illustrations, fixed and variable funding options, or additional illustrations when they appear as mapping clues.

### What requires human actuarial interpretation

- Whether AG 15 should stay indexed as historical caveat-first guidance or be linked only as a variable-life illustration note.
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

- Add lightweight validation for `config/ag15-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag15-batch-definitions.mjs`
  synchronized with the planned `batch-093` slice.
- Add future checks for historical-guidance, caveat-first, and no-promotion
  guardrails.
- Keep the plan separate from AG 14, later guideline files,
  `docs/review/ag14_review_index.md`, `docs/review/ag13_review_index.md`,
  `docs/review/vm20_review_index.md`, `docs/review/supporting_vm_review_index.md`,
  `docs/review/vm21_review_index.md`, `docs/review/vm22_review_index.md`,
  `docs/review/valuation_regulation_repository_poc_status.md`, VM-20, VM-21,
  VM-22, the practice note wave, and the supporting VM chapter wave so the
  processor stays portable across source families.

## Operating Note

This is a small, self-contained historical guideline unit. It should stay
review-only unless a later human review explicitly changes the indexing
choice.
