# AG 46 Review Index

## Overall AG 46 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 47 remains out of scope

AG 46 is Actuarial Guideline XLVI. It was processed as a single-batch
review-only wave against the active 2-page
`AG 46 - Interpretation of the Calculation of the Segment Length with Respect to the Life Insurance Policies Model Regulation Upon a Change in the Valu.pdf`
guideline. The wave stayed source-bound, used page locators, and relied on
the page-image wording backstop because the text layer is encoding-noisy and
stable line references were not available.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-152` | `pages 1-2` | Scope, background, calculation context, and segment-length framing | Keep the opening guidance and calculation context together as one narrow review-only slice and stop cleanly at the AG 47 boundary. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; recalculation boundary; AG 47 remains out of scope. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is
  noisy / encoded.
- Line references were not available, so page locators remain the primary
  review anchor.
- The opening guidance, mortality-rate change language, and recalculation
  wording should stay review-only until a human confirms the wording against
  the page image.
- The recalculation passage should not be over-interpreted as broader policy
  language than the source text provides.
- AG 47 remains out of scope and should not be blended into this wave.
- Cross references to the Valuation of Life Insurance Policies Model
  Regulation, valuation mortality rates, segment length, and post-issue
  recalculation should be mapped but not over-interpreted.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not
  available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are the opening guidance and recalculation passages separated from any
  later boundary material?
- Are the recalculation passages mapped but not over-interpreted?
- Is the AG 47 boundary kept outside this wave?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-152 first because it establishes the opening guidance,
   calculation context, and recalculation slice.

## Relationship to Other Review Indexes

- AG 45 review index: `docs/review/ag45_review_index.md`
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 46 self-review note: `docs/review/ag46_self_review.md`

## Review Notes

- The AG 46 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave
  because line references were not expected.
- The source remains active and AG 47 remains out of scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`,
  and `not promoted` all remain intact.
