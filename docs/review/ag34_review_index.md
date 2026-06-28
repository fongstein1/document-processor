# AG 34 Review Index

## Overall AG 34 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXXIV
- AG 35 remains out of scope for this wave
- batch outputs remain ignored in `data/work/batches/batch-117/`, `data/work/batches/batch-118/`, and `data/work/batches/batch-119/`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Unresolved Issues / Review Concerns | Validation | Self-Review | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-117 | pp. 1-3; background information, purpose, scope, definitions, reserve-method foundation, and the opening MGDB reserve framing | foundation and reserve-methodology slice | Keep the three-page foundation window together and stop before the mortality-basis and appendix material begins. | regulatory_requirement; definition_or_terminology; reserve_method_structure; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; reserve-method boundary remains review-only; AG 35 boundary remains out of scope; line references were unavailable | passed | reasonable_with_minor_cautions | `a20051d` |
| batch-118 | pp. 4-6; mortality basis, asset adequacy analysis requirement, effective date, immediate-drop percentages, and gross-assumed-returns table | mortality basis and asset-adequacy slice | Keep the mortality-basis, asset-adequacy, effective-date, and table-driven return material together as one narrow review-only mechanics slice. | regulatory_requirement; definition_or_terminology; reserve_method_structure; calculation_structure; formula_context; prescribed_assumption; company_or_prudent_estimate_assumption; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; mortality-basis boundary remains review-only; AG 35 boundary remains out of scope; line references were unavailable | passed | reasonable_with_minor_cautions | `a20051d` |
| batch-119 | pp. 7-11; female and male mortality tables, age-last-birthday and age-nearest-birthday bases, and Appendix II asset-class descriptions | mortality tables and appendix slice | Keep the mortality tables and Appendix II asset-class descriptions together and leave AG 35 for a later plan. | prescribed_assumption; definition_or_terminology; formula_context; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; mortality-table boundary remains review-only; AG 35 boundary remains out of scope; line references were unavailable | passed | reasonable_with_minor_cautions | `a20051d` |

## Higher-Caution Section

- The page image remains the wording backstop because the text layer is encoding-noisy.
- line references were not available, so page locators remain the primary anchor for human review.
- The foundation slice explains the MGDB reserve framing, but it should not be over-read as the full mechanics set.
- The mortality basis, asset adequacy analysis requirement, immediate-drop percentages, and gross-assumed-returns table should stay review-only until a human confirms the wording.
- The mortality tables and Appendix II asset-class descriptions are table-driven and should stay review-only until the page image is confirmed.
- The AG 35 guidance follows immediately after the AG 34 slice and must remain out of scope for this wave.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page and section references sufficient for review?
- Are requirement and explanation separated correctly?
- Are the reserve-method framing and the later mechanics kept distinct?
- Are mortality basis, asset adequacy, and table-driven return references separated from interpretation?
- Are Appendix II asset-class descriptions kept as context rather than over-interpreted?
- Is the page-image backstop still visible for the encoding-noisy pages?
- Is AG 35 still clearly out of scope?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [x] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Foundation and reserve-methodology slice first.
2. Mortality basis and asset-adequacy slice second.
3. Mortality tables and Appendix II appendix slice third.
4. Page-image wording confirmation and AG 35 boundary last.

## Relationship to Other Review Indexes

- AG 34 should be reviewed alongside `docs/review/ag33_review_index.md`.
- AG 34 should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md`.
- The VM review indexes remain the broader valuation-manual context:
  - `docs/review/vm20_review_index.md`
  - `docs/review/supporting_vm_review_index.md`
  - `docs/review/vm21_review_index.md`
  - `docs/review/vm22_review_index.md`

## Review Notes

- This index summarizes the ignored batch review packets without promoting any extracted content.
- The page-image wording backstop stays visible for all three batches because the page images remain the wording backstop for the noisy text layer.
- Reviewers should start from the batch table and the higher-caution section, then move to the self-review note at `docs/review/ag34_self_review.md`.
