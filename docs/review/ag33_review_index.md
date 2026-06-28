# AG 33 Review Index

## Overall AG 33 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXXIII
- AG 34 remains out of scope for this wave
- batch outputs remain ignored in `data/work/batches/batch-115/` and `data/work/batches/batch-116/`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Unresolved Issues / Review Concerns | Validation | Self-Review | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-115 | pp. 1-3; background information, elective / non-elective benefit classification, integrated benefit stream foundation, and valuation-interest-rate framing | benefit-classification and integrated-stream foundation slice | Keep the three-page foundation window together and stop before the mechanics and closeout window begins on page 4. | regulatory_requirement; definition_or_terminology; reserve_method_structure; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; elective-benefit boundary remains review-only; AG 34 boundary remains out of scope | passed | reasonable_with_minor_cautions | `2015aec` |
| batch-116 | pp. 4-6; integrated benefit stream examples, valuation-interest-rate mechanics, guarantee duration, plan type, change in fund basis, purchase rates, practical considerations, and effective date | mechanics and closeout slice | Keep the three-page mechanics window together and leave AG 34 for a later plan. | regulatory_requirement; definition_or_terminology; reserve_method_structure; calculation_structure; formula_context; prescribed_assumption; company_or_prudent_estimate_assumption; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; elective-benefit boundary remains review-only; AG 34 boundary remains out of scope | passed | reasonable_with_minor_cautions | `2015aec` |

## Higher-Caution Section

- The page image remains the wording backstop because the text layer is encoding-noisy.
- The elective-benefit CARVM guidance should not be over-read as a full mechanics set; the two batches together still remain review-only.
- The integrated benefit stream, valuation-interest-rate, guarantee-duration, and plan-type language should stay review-only until a human confirms the wording.
- The AG 34 guidance follows immediately after the AG 33 slice and must remain out of scope for this wave.
- line references were not available in the encoded text layer, so page references remain the primary locator for human review.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page and section references sufficient for review?
- Are requirement and explanation separated correctly?
- Are elective and non-elective benefits separated from interpretation?
- Are integrated benefit streams and valuation-interest-rate references separated from cross-reference context?
- Are guarantee duration, plan type, and change in fund basis separated from calculation context?
- Is the page-image backstop still visible for the encoding-noisy pages?
- Is AG 34 still clearly out of scope?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [x] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Benefit-classification and integrated-stream foundation first.
2. Mechanics and closeout second.
3. Page-image wording confirmation and AG 34 boundary last.

## Relationship to Other Review Indexes

- AG 33 should be reviewed alongside `docs/review/ag32_review_index.md`.
- AG 33 should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md`.
- The VM review indexes remain the broader valuation-manual context:
  - `docs/review/vm20_review_index.md`
  - `docs/review/supporting_vm_review_index.md`
  - `docs/review/vm21_review_index.md`
  - `docs/review/vm22_review_index.md`

## Review Notes

- This index summarizes the ignored batch review packets without promoting any extracted content.
- The page-image wording backstop stays visible for both batches because the page images remain the wording backstop for the noisy text layer.
- Reviewers should start from the batch table and the higher-caution section, then move to the self-review note at `docs/review/ag33_self_review.md`.
