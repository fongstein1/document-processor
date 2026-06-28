# AG 44 Review Index

## Overall AG 44 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 45 remains out of scope

AG 44 is Actuarial Guideline XLIV. It was processed as a two-batch
review-only wave against the active 7-page
`AG 44 - Group Term Life Waiver of Premium Disabled Lives Reserves.pdf`
guideline. The wave stayed source-bound, used page locators, and relied on
the page-image wording backstop because the text layer is encoding-noisy
and stable line references were not available.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-149` | `pp. 1-3` | Background, scope, definitions, company experience, and reserve opener | Keep the opening guidance narrow; preserve the page-image backstop; do not widen into the attachment tables. | `regulatory_requirement`; `definition_or_terminology`; `reserve_method_structure`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; opening company-experience boundary; AG 45 remains out of scope. | `reasonable_with_minor_cautions` | passed | `9843fba` |
| `batch-150` | `pp. 4-7` | Attachment A-D mortality and recovery tables plus the closing boundary | Keep the attachment tables narrow; preserve the page-image backstop; stop cleanly at the AG 45 boundary. | `definition_or_terminology`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `formula_context`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; table-heavy attachment boundary; AG 45 remains out of scope. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is
  noisy / encoded.
- Line references were not available, so page locators remain the primary
  review anchor.
- The opening guidance, company-experience narrative, and attachment tables
  should stay review-only until a human confirms the wording against the
  page image.
- The attachment tables should not be over-interpreted as a broader policy
  layer than the source text provides.
- AG 45 remains out of scope and should not be blended into this wave.
- Cross references to the Standard Valuation Law, the group-term-life
  waiver-of-premium reserve context, and the attachment-table material
  should be mapped but not over-interpreted.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not
  available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are the opening guidance and company-experience material separated from
  the attachment-table material?
- Are the attachment tables mapped but not over-interpreted?
- Is the AG 45 boundary kept outside this wave?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-149 first because it establishes the opening guidance,
   scope, definitions, and company-experience slice.
2. Then batch-150 because it carries the attachment tables and the closing
   boundary.

## Relationship to Other Review Indexes

- AG 43 review index: `docs/review/ag43_review_index.md`
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 44 self-review note: `docs/review/ag44_self_review.md`

## Review Notes

- The AG 44 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave
  because line references were not expected.
- The source remains active and AG 45 remains out of scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`,
  and `not promoted` all remain intact.
