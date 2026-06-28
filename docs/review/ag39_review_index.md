# AG 39 Review Index

## Overall AG 39 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source title: Actuarial Guideline XXXIX
- source status: active
- AG 40 remains out of scope
- line references were not available
- page-image wording backstop remains visible because the text layer is noisy / encoded

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation Status | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-134 | pp. 1-2 | Background and reserve requirement | Keep the 2-page VAGLB guideline together, preserve the page-image wording backstop, and stop before AG 40. | regulatory_requirement; definition_or_terminology; reserve_method_structure; calculation_structure; formula_context; prescribed_assumption; company_or_prudent_estimate_assumption; reinsurance; reporting_requirement; documentation_expectation; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | reasonable_with_minor_cautions | page-image confirmation, line references unavailable, reserve-boundary caution, AG 40 boundary control | passed | 5041937 |

## Higher-Caution Section

- The page-image wording backstop remains visible because the text layer is
  encoding-noisy and line references were not available.
- Batch-134 is a one-batch, two-page review-only slice only; it should not be
  overread as the full AG 39 mechanics set.
- The reserve language, reinsurance language, and asset-adequacy analysis
  language should stay review-only until a human confirms the exact wording
  against the page image.
- AG 40 remains out of scope and should not be blended into this batch.
- Review flags for the batch stay visible as `ocr_text_layer`,
  `page_image_backstop`, and `vaglb_scope_caveat`.
- The VAGLBs reserve language should be reviewed with the AG 39 self-review
  note at `docs/review/ag39_self_review.md` before anyone treats it as an
  indexing candidate.

## Human Review Checklist

- Are the extracted statements source-bound to the AG 39 PDF?
- Are the page references sufficient for review when line references are
  unavailable?
- Are requirement / explanation / background distinctions correct?
- Are the reserve-requirement, reinsurance, and asset-adequacy statements
  still review-only?
- Are AG 40 references mapped but not over-interpreted?
- Is the page-image wording backstop clearly visible for the noisy text layer?
- Are any items becoming candidates for learner-facing promotion?
- Are any items becoming candidates for RAG or app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review the background and reserve-requirement slice first.
2. Confirm the page-image wording backstop and line-reference caveat next.
3. Recheck the AG 40 boundary last.

## Relationship to Other Review Indexes

- Review this AG 39 index alongside `docs/review/ag38_review_index.md`,
  `docs/review/vm20_review_index.md`, `docs/review/supporting_vm_review_index.md`,
  `docs/review/vm21_review_index.md`, `docs/review/vm22_review_index.md`, and
  `docs/review/valuation_regulation_repository_poc_status.md`.
- The immediately neighboring AG source is AG 38; AG 40 remains out of scope
  for this wave.

## Review Notes

- No learner-facing or app-ready promotion was produced.
- The batch remained source-bound and review-only.
- The companion self-review note lives at `docs/review/ag39_self_review.md`
  and keeps the VAGLBs wording on the same review-only footing.
- The batch output remains ignored under `data/work/batches/batch-134/`.
