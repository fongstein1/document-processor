# AG 35 Review Index

## Overall AG 35 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXXV
- AG 36 remains out of scope for this wave
- batch outputs remain ignored in `data/work/batches/batch-120/`, `data/work/batches/batch-121/`, and `data/work/batches/batch-122/`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Unresolved Issues / Review Concerns | Validation | Self-Review | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-120 | pp. 1-3; background information, purpose, scope, definitions, CARVM framing, and the Type 1 / Type 2 overview | foundation and method-overview slice | Keep the three-page foundation window together and stop before the attachment-driven mechanics begin. | regulatory_requirement; definition_or_terminology; reserve_method_structure; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; method-overview boundary remains review-only; AG 36 boundary remains out of scope; line references were not available | passed | reasonable_with_minor_cautions | `707515b` |
| batch-121 | pp. 4-6; Attachment 1 computational-method descriptions and Attachment 2 Hedged as Required criteria | attachments and hedging-criteria slice | Keep the computational-method descriptions and the hedging-criteria material together as one narrow review-only mechanics slice. | regulatory_requirement; definition_or_terminology; reserve_method_structure; calculation_structure; formula_context; hedging_or_risk_mitigation; reporting_requirement; governance_or_control_expectation; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; hedging-criteria boundary remains review-only; AG 36 boundary remains out of scope; line references were not available | passed | reasonable_with_minor_cautions | `707515b` |
| batch-122 | pp. 7-9; quarterly notification threshold, reasonableness certification, consistency certification, and closeout material | certification and closeout slice | Keep the quarterly notification threshold and the reasonableness / consistency certifications together as the closing review window. | regulatory_requirement; reporting_requirement; documentation_expectation; governance_or_control_expectation; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; certification boundary remains review-only; AG 36 boundary remains out of scope; line references were not available | passed | reasonable_with_minor_cautions | `707515b` |

## Higher-Caution Section

- The page image remains the wording backstop because the text layer is encoding-noisy.
- line references were not available, so page locators remain the primary anchor for human review.
- The foundation slice explains the CARVM / Type 1 / Type 2 framing, but it should not be over-read as the full mechanics set.
- The attachment-driven hedging criteria and the computational-method descriptions should stay review-only until a human confirms the wording.
- The certification and closeout material should stay review-only until a human confirms the wording.
- The AG 36 guidance follows immediately after the AG 35 slice and must remain out of scope for this wave.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page and section references sufficient for review?
- Are requirement and explanation separated correctly?
- Are the method overview, attachment-driven mechanics, and certification sections kept distinct?
- Are hedging-criteria, filing, and certification references separated from interpretation?
- Is the page-image backstop still visible for the encoding-noisy pages?
- Is AG 36 still clearly out of scope?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [x] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Foundation and method-overview slice first.
2. Attachments and hedging-criteria slice second.
3. Certification and closeout slice third.
4. Page-image wording confirmation and AG 36 boundary last.

## Relationship to Other Review Indexes

- AG 35 should be reviewed alongside `docs/review/ag34_review_index.md`.
- AG 35 should be reviewed alongside `docs/review/ag35_self_review.md`.
- AG 35 should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md`.
- The VM review indexes remain the broader valuation-manual context:
  - `docs/review/vm20_review_index.md`
  - `docs/review/supporting_vm_review_index.md`
  - `docs/review/vm21_review_index.md`
  - `docs/review/vm22_review_index.md`

## Review Notes

- This index summarizes the ignored batch review packets without promoting any extracted content.
- The page-image wording backstop stays visible for all three batches because the page images remain the wording backstop for the noisy text layer.
- Reviewers should start from the batch table and the higher-caution section, then move to the self-review note at `docs/review/ag35_self_review.md`.
