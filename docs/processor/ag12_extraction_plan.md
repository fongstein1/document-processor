# Controlled AG 12 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready,
and not promoted.

## Why This Exists

AG 12 is a one-page guideline about valuation and nonforfeiture interest rates,
but the PDF itself states that Actuarial Guideline XII was withdrawn on
March 7, 1993. That makes it a caveat-only historical source, not active
guidance. It is small enough to process as a single review-only unit, but the
withdrawn status should stay visible so it cannot be mistaken for current
authority.

## Source Scope

- Primary source file: `AG 12 - Interpretation Regarding Valuation and Non-Forfeiture Interest Rates.pdf`
- Source family: `actuarial_guidelines`
- Source reference: `Actuarial Guideline XII`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: page 1 only
- Source posture: single-page guideline / interpretation; withdrawn historical note

### Boundaries

- Keep planning focused on this single AG 12 PDF.
- Do not widen into AG 13 or later guideline files.
- Keep the withdrawn / historical posture explicit in every batch artifact.
- Treat the guideline as caveat-only historical material, not active guidance.
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
| `ag12-withdrawn-interest-rates-caveat` | Withdrawn interpretation regarding valuation and nonforfeiture interest rates | 1 | Low | stale_or_repealed_source, caveat_or_companion_guidance, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | valuation and nonforfeiture interest rates, withdrawn status, historical guidance, page 1 note |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-090` | AG 12 withdrawn one-page note | 1 | Capture the full one-page historical note as a single review-only slice and stop at the page boundary. | Low |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment, if any appears on the page.

### What counts as terminology or interpretation

- Valuation and nonforfeiture interest-rate language when it is historical
  context rather than active instruction.

### What counts as a caveat-only historical note

- The withdrawn-status notice and any historical framing around the guideline.

### What counts as cross-reference mapping

- References to valuation or nonforfeiture interest rates, the withdrawn note,
  or any historical cross-link context when they appear as indexing clues.

### What requires human actuarial interpretation

- Whether AG 12 should stay indexed only as withdrawn historical guidance or be
  cross-linked to another caution note in a later cleanup step.
- Whether the OCR / encoded text layer needs manual confirmation against the
  page image before any later promotion decision.

### How to handle source-quality caveats

- Treat text-layer noise as review-only and preserve the page locator.
- Do not widen the batch because of OCR noise.

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

- Add lightweight validation for `config/ag12-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batch starts, keep `scripts/ag12-batch-definitions.mjs`
  synchronized with the planned `batch-090` slice.
- Add future checks for withdrawn-source, stale/repealed, and no-promotion
  guardrails.
- Keep the plan separate from AG 10, AG 11, later guideline files, VM-20,
  VM-21, VM-22, the practice note wave, and the supporting VM chapter wave so
  the processor stays portable across source families.

## Operating Note

This is a small, self-contained historical guideline unit. It should stay
review-only unless a later human review explicitly changes the indexing choice.
