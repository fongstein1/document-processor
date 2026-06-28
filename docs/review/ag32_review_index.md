# AG 32 Review Index

## Overall AG 32 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXXII
- AG 33 remains out of scope for this wave
- batch outputs remain ignored in `data/work/batches/batch-114/`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Unresolved Issues / Review Concerns | Validation | Self-Review | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-114 | pp. 1-2; immediate-payment reserve guidance and the closing boundary note | immediate-payment reserve guidance slice | Keep the two-page guideline together, preserve the page-image backstop, and stop before AG 33 begins on page 3. | regulatory_requirement; caveat_or_companion_guidance; definition_or_terminology; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; immediate-payment reserve boundary remains review-only; AG 33 boundary remains out of scope | passed | reasonable_with_minor_cautions | `19d22a0` |

## Higher-Caution Section

- The page image remains the wording backstop because the text layer is encoding-noisy.
- The immediate-payment reserve guidance should not be over-read as a full mechanics set; it remains a review-only caveat slice.
- The reserve-adjustment language and the continuous / semi-continuous references should stay review-only until a human confirms the wording.
- The AG 33 modification page follows immediately after the AG 32 slice and must remain out of scope for this batch.
- line references were not available in the encoded text layer, so page references remain the primary locator for human review.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page and section references sufficient for review?
- Are requirement and explanation separated correctly?
- Are reserve and immediate-payment references separated from interpretation?
- Are cross-references mapped without over-interpreting them?
- Is the page-image backstop still visible for the encoding-noisy pages?
- Is AG 33 still clearly out of scope?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [x] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Immediate-payment reserve guidance first.
2. Reserve-adjustment language second.
3. Page-image wording confirmation and AG 33 boundary last.

## Relationship to Other Review Indexes

- AG 32 should be reviewed alongside `docs/review/ag31_review_index.md`.
- AG 32 should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md`.
- The VM review indexes remain the broader valuation-manual context:
  - `docs/review/vm20_review_index.md`
  - `docs/review/supporting_vm_review_index.md`
  - `docs/review/vm21_review_index.md`
  - `docs/review/vm22_review_index.md`

## Review Notes

- This index summarizes the ignored batch review packet without promoting any extracted content.
- The page-image wording backstop stays visible for the batch because the page contains encoding noise.
- Reviewers should start from the batch table and the higher-caution section, then move to the self-review note at `docs/review/ag32_self_review.md`.
