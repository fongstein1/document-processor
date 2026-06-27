# Controlled AG 09 Family Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Why This Exists

The AG 09 family is a compact set of related guideline files that all stay in
the actuarial-guideline lane. The files are short enough to process as a
small family wave, but they still carry classification, mortality-table, and
standard-valuation-law language that should stay review-only until a human
confirms how each piece should be indexed.

## Source Scope

- Primary source folder: `Actuarial Guidelines`
- Source family: `actuarial_guidelines`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Family members in scope:
  - `AG 09 - Form Classification of Individual Single Premium Annuities for Application of the Valuation and Nonforfeiture Laws.pdf`
  - `AG 09-A - Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Structured Settlements.pdf`
  - `AG 09-B - Clarification of methods for immediate and deferred annuities and structured sttlement contracts.pdf`
  - `AG 09-C - Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Individual Single Premium Immediate Annuities.pdf`
- Source references: Actuarial Guideline IX, Actuarial Guideline IX-A,
  Actuarial Guideline IX-B, Actuarial Guideline IX-C.

### Confirmed Page Ranges

- AG 09: page 1 only
- AG 09-A: pages 1-2
- AG 09-B: pages 1-4
- AG 09-C: pages 1-3
- AG 09-B ends on page 4.

### Boundaries

- Keep planning focused on this AG 09 family only.
- Do not widen into AG 10 or later guideline files.
- Keep the AG 09 main title / OCR mismatch visible as a review-only caveat:
  the file name says single premium annuities, while the page text refers to
  immediate annuities.
- Keep substandard annuity mortality tables visible as a review-only phrase in
  AG 09-A and AG 09-C.
- Keep each companion file review-only until a human confirms the indexing
  choice.
- Keep the family source-bound and review-only.

### Exclusions

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No later guideline files in the same wave.

## Topic Map

| Topic ID | Section / topic family | Page range | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- | --- |
| `ag09-form-classification` | Form classification of individual single premium annuities | 1 | Low | definition_or_terminology, regulatory_requirement, cross_reference_mapping, boundary_control_window, requires_human_interpretation | immediate vs deferred annuities, valuation and nonforfeiture laws, OCR/title mismatch |
| `ag09-substandard-structured-settlements` | Substandard annuity mortality tables under structured settlements | 1-2 | Medium | prescribed_assumption, cross_reference_mapping, boundary_control_window, requires_human_interpretation | structured settlements, impaired lives, substandard mortality tables |
| `ag09-clarification-of-methods` | Clarification of methods under Standard Valuation Law | 1-4 | Medium | regulatory_requirement, formula_context, definition_or_terminology, cross_reference_mapping, boundary_control_window, requires_human_interpretation | immediate annuities, deferred payments, structured settlement contracts, Standard Valuation Law |
| `ag09-substandard-immediate-annuities` | Substandard annuity mortality tables under immediate annuities | 1-3 | Medium | prescribed_assumption, cross_reference_mapping, boundary_control_window, requires_human_interpretation | immediate annuities, impaired lives, substandard mortality tables |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-084` | AG 09 form classification | 1 | Capture the one-page form-classification note as a single review-only slice and keep the OCR/title mismatch visible. | Low |
| `batch-085` | AG 09-A structured-settlement mortality tables | 1-2 | Capture the short structured-settlement companion guidance as its own narrow review slice. | Medium |
| `batch-086` | AG 09-B clarification of methods | 1-4 | Capture the four-page clarification note as a single review-only slice because the methods text is tightly related. | Medium |
| `batch-087` | AG 09-C immediate-annuity mortality tables | 1-3 | Capture the immediate-annuity mortality-table guidance as a separate narrow review slice. | Medium |

## Review Standards

### What counts as a regulatory requirement

- Express duty or permitted/required treatment.
- Valuation or nonforfeiture language that directly changes the treatment of
  the covered annuity classification or mortality-table use.

### What counts as terminology or interpretation

- Immediate annuities, deferred annuities, structured settlements, impaired
  lives, substandard mortality tables, and the supporting actuarial-language
  framing.

### What counts as cross-reference mapping

- References to the Standard Valuation Law, nonforfeiture laws, structured
  settlements, deferred payments, or reserve treatment when they appear as
  context for the interpretation note.

### What requires human actuarial interpretation

- Whether AG 09 should stay indexed as a standalone interpretive note or be
  cross-linked to the underlying annuity reserve guidance in a later cleanup
  step.
- Whether the OCR / encoded text layer needs manual confirmation against the
  page images before any later promotion decision.
- Whether the AG 09 companion pieces should stay as separate review units or
  be revisited later as a tighter family cross-reference set.

### How to handle source-quality caveats

- Treat text-layer noise or title/OCR mismatch as review-only and preserve the
  page locators.
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

- Add lightweight validation for `config/ag09-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well formed.
- When the real batches start, keep `scripts/ag09-batch-definitions.mjs`
  synchronized with the planned `batch-084` through `batch-087` slices.
- Add future checks for OCR/title mismatch handling, mortality-table tagging,
  and no-promotion guardrails.
- Keep the plan separate from AG 08, AG 10, VM-20, VM-21, VM-22, the
  practice note wave, and the supporting VM chapter wave so the processor
  stays portable across source families.

## Operating Note

This is a small, self-contained guideline family. It should stay review-only
unless a later human review explicitly changes the indexing choice.
