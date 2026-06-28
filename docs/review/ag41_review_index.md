# AG 41 Review Index

## Overall AG 41 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 42 remains out of scope

AG 41 is Actuarial Guideline XLI. It was processed as one review-only batch
against the active `pp. 1-2` guideline `AG 41 - Projection of Guaranteed
Nonforfeiture Benefits Under CARVM.pdf`. The wave stayed source-bound, used
page locators, and relied on the page-image wording backstop because line
references were not available.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-137` | `pp. 1-2` | Background, scope, and projected nonforfeiture-benefit slice | Keep the tiny 2-page guideline as one narrow review-only slice; avoid widening into later guideline files; preserve the page-image backstop. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; projection boundary; AG 42 boundary. | `reasonable_with_minor_cautions` | passed | n/a |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is
  noisy / encoded.
- Line references were not available, so page locators remain the primary
  review anchor.
- The projected nonforfeiture-benefit discussion and valuation-date
  assumptions should stay review-only until a human confirms the wording
  against the page image.
- The AG 42 boundary stays outside the AG 41 wave.
- Cross references to CARVM, the Standard Valuation Law, the Standard
  Nonforfeiture Law for Individual Deferred Annuities, and AG 40 should be
  mapped but not over-interpreted.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are projection terms separated from background context?
- Are cross-references to CARVM, the Standard Valuation Law, SNLIDA, and AG 40
  mapped but not over-interpreted?
- Are projected nonforfeiture-benefit and valuation-date-assumption passages
  still review-only?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

- Batch-137 first because it is the only batch and establishes the background /
  scope / projection slice.
- Then confirm whether any later AG 42 material needs a separate plan.

## Relationship to Other Review Indexes

- AG 40 review index: `docs/review/ag40_review_index.md`
- AG 41 self-review note: `docs/review/ag41_self_review.md`
- POC status summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 41 should be read as the next review-only valuation-regulation handoff
  after AG 40, not as promoted content.

## Review Notes

- The AG 41 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave
  because line references were not available.
- The source remains active and the AG 42 boundary remains out of scope.
- later guideline files remain out of scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and
  `not promoted` all remain intact.
