# AG 45 Review Index

## Overall AG 45 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 46 remains out of scope

AG 45 is Actuarial Guideline XLV. It was processed as a single-batch
review-only wave against the active 3-page
`AG 45 - The Application of the Standard Nonforfeiture Law for Life Insurance to Certain Policies Having Intermediate Cash Benefits.pdf`
guideline. The wave stayed source-bound, used page locators, and relied on
the page-image wording backstop because the text layer is encoding-noisy and
stable line references were not available.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-151` | `pages 1-3` | Scope, formula context, and applicability | Keep the opening guidance and formula context together as one narrow review-only slice and stop cleanly at the AG 46 boundary. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; applicability boundary; AG 46 remains out of scope. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is
  noisy / encoded.
- Line references were not available, so page locators remain the primary
  review anchor.
- The opening guidance, formula language, and applicability language should
  stay review-only until a human confirms the wording against the page
  image.
- The formula-heavy passages should not be over-interpreted as broader policy
  language than the source text provides.
- AG 46 remains out of scope and should not be blended into this wave.
- Cross references to the Standard Nonforfeiture Law, intermediate cash
  benefits, adjusted premiums, and the applicability boundary should be mapped
  but not over-interpreted.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not
  available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are the opening guidance and formula passages separated from the
  applicability boundary?
- Are the formula passages mapped but not over-interpreted?
- Is the AG 46 boundary kept outside this wave?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-151 first because it establishes the opening guidance,
   formula context, and applicability slice.

## Relationship to Other Review Indexes

- AG 44 review index: `docs/review/ag44_review_index.md`
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 45 self-review note: `docs/review/ag45_self_review.md`

## Review Notes

- The AG 45 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave
  because line references were not expected.
- The source remains active and AG 46 remains out of scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`,
  and `not promoted` all remain intact.
