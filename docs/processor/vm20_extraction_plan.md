# Controlled VM-20 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

## Why this exists

Batch-002 proved that the VM-20 area of the 2026 Valuation Manual can be read
in a controlled way, but it also showed a boundary problem: pages 45-51 mix
reserve mechanics with exclusion-test transition language. This plan turns that
lesson into a section-by-section map so later VM-20 batches stay small,
reviewable, and source-bound.

## Source Scope

- Primary source file: `pbr_data_valuation_manual_2026.pdf`
- Source family: `valuation_manual_pdfs`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed VM-20 observation window so far: pages 45-51 from batch-002
- Planning rule: treat pages 45-51 as a boundary-control window, not as a
  final split of the whole chapter

### Boundaries

- Keep planning focused on VM-20 only.
- Do not widen into other source families.
- Do not turn cross-references into promoted content.
- Keep VM-01, VM-30, VM-31, and VM-G references review-only unless the same
  batch intentionally includes the referenced section.
- Keep stale, superseded, repealed, or companion guidance as notes only.

### Exclusions

- No full-document processing.
- No learner-facing content.
- No app-ready exports.
- No approved/promoted exports.
- No raw source files in Git.

## Batch-002 Lesson

The core pilot worked, but the narrow VM-20 slice proved two things:

1. The VM-20 chapter can be processed in a source-bound way.
2. The first slice should be split more carefully because the observed window
   mixes reserve mechanics and exclusion-test transition language.

This plan therefore starts with a boundary-confirmation batch, then a role-map
completion batch that locks the NPR / DR / SR responsibilities, and only then
moves topic by topic into mechanics.

## Section / Topic Map

The topic map below is deliberately one topic family per batch. The point is to
avoid mixing unrelated reserve concepts in one run.

| Topic ID | Topic family | Review complexity | Expected unresolved issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `vm20-framework-overview` | NPR / DR / SR framework overview | Medium | boundary confirmation, terminology alignment, cross-reference mapping | VM-01, VM-30, VM-31, VM-G |
| `vm20-npr-mechanics` | Net premium reserve mechanics | High | formula boundary, margin interpretation, assumption spillover | VM-01, VM-30, VM-31 |
| `vm20-dr-mechanics` | Deterministic reserve mechanics | High | reserve mechanics boundary, actuarial judgment, citation precision | VM-01, VM-30, VM-31 |
| `vm20-sr-mechanics` | Stochastic reserve mechanics | High | model assumption review, calibration, actuarial judgment | VM-01, VM-30, VM-31 |
| `vm20-exclusion-tests` | Exclusion tests | Medium | eligibility thresholds, boundary splits, cross-reference mapping | VM-01, VM-30, VM-31 |
| `vm20-assumptions-margins` | Assumptions and margins | High | assumption control, margin interpretation, stale or companion guidance | VM-01, VM-30, VM-31 |
| `vm20-asset-assumptions` | Asset assumptions | High | asset modeling judgment, supporting guidance, boundary spillover | VM-30, VM-31 |
| `vm20-reinsurance` | Reinsurance | High | ceded reserve treatment, supporting guidance, cross-reference mapping | VM-30, VM-31, VM-G |
| `vm20-doc-report-refs` | Documentation and reporting cross-references | Medium | cross-reference cleanup, definition-only content, citation precision | VM-30, VM-31, VM-G |
| `vm20-definitions-crossrefs` | Definitions and cross-references handled elsewhere | Low to medium | lookup-only items, scope cleanup, non-promotable references | VM-01, VM-31 |

## Proposed Batch Sequence

| Planned batch | Purpose | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-003` | VM-20 framework overview | Confirm within pages 45-51 | Pin the chapter boundary and terminology before mechanics | Medium |
| `batch-004` | NPR / DR / SR role map completion | Confirm within pages 45-51 | Complete the high-level role map before detailed NPR mechanics begin | Medium |
| `batch-005` | NPR mechanics entry point | Pages 52-57 | Capture the first NPR calculation structure after the applicability opener and stop before Section 3.C assumptions | High |
| `batch-006` | Stochastic reserve mechanics | Confirm within pages 45-51 | Separate stochastic reserve modeling from deterministic and net premium language | High |
| `batch-007` | Exclusion tests | Confirm within pages 45-51 | Split eligibility and exclusion language away from reserve mechanics | Medium |
| `batch-008` | Assumptions and margins | Confirm within pages 45-51 | Keep assumption and margin language isolated because it usually needs actuarial judgment | High |
| `batch-009` | Asset assumptions | Confirm within pages 45-51 | Separate asset-related assumptions from reserve formula mechanics | High |
| `batch-010` | Reinsurance | Confirm within pages 45-51 | Keep reinsurance treatment isolated because it often cross-references other sections | High |
| `batch-011` | Documentation and reporting cross-references | Confirm within pages 45-51 | Capture reporting references without folding in the full reporting instructions | Medium |
| `batch-012` | Definitions and cross-references handled elsewhere | Confirm within pages 45-51 | Clean up lookup-only and cross-reference-only material after the main mechanics are isolated | Low to medium |

The exact page splits are still to be confirmed. The only confirmed range is
the batch-002 observation window on pages 45-51. Batch-004 intentionally uses
the explicit Section 3 / Section 4 / Section 5 role statement on page 48 and
the Section 3 applicability opener on pages 50-51 to close the framework map
before the detailed mechanics batches begin. Batch-005 then starts the NPR
mechanics entry point on pages 52-57, keeping the setup and formula context
together while leaving Section 3.C assumptions for later review.

## Review Standards

### What counts as an extracted regulatory requirement

- A statement that imposes a clear duty, prohibition, or required action.
- A reserve rule or test that directly changes calculation or eligibility.
- A reporting or documentation requirement when the text is explicit and not
  merely descriptive.

### What counts as explanatory or background content

- Chapter navigation, introductory prose, examples, and explanatory context.
- Definitions that clarify terms but do not by themselves impose a new rule.
- Cross-references that point elsewhere without repeating the operational text.

### What requires human actuarial interpretation

- Assumption selection or assumption layering.
- Margin treatment and reserve judgment.
- Asset assumption interpretation.
- Reinsurance treatment that depends on actuarial context.
- Any language that appears to be a requirement but is not fully operational in
  the excerpt.

### How to flag cross-references

- Tag references to VM-01, VM-30, VM-31, or VM-G as cross-reference issues when
  the referenced section is not part of the same batch.
- Keep those references in review output only.
- Do not promote a cross-reference into learner-facing content unless the
  operational section is also captured and clearly supports the claim.

### How to handle stale or companion guidance

- Tag repealed, superseded, or companion guidance as review-only support.
- Do not treat companion guidance as the authoritative VM-20 text.
- If guidance looks stale or ambiguous, create a review note rather than a
  learner-facing item.

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
- no cross-reference ambiguity remains

### App-ready

An extracted item can only become app-ready when it is already eligible for
learner-facing use and the export is sanitized, stable, and versioned for the
app thread.

### RAG-ready

An extracted item can only become RAG-ready when it is approved, source-bound,
and indexed with a stable ID, citation, locator, and review status that no
longer requires human disposition.

## Validation Implications

- Add lightweight validation for `config/vm20-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well-formed.
- When real VM-20 batches start, extend `scripts/batch-definitions.mjs` with
  the planned batch IDs or generate them from the plan config.
- Add future batch checks for one-topic-per-batch behavior, cross-reference
  tagging, and no-promotion guardrails.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact that
should reduce review burden before any larger VM-20 extraction run begins.
