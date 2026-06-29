# AG 52 Review Index

## Overall AG 52 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 52 was already captured in the mixed pilot batch-001; this index formalizes the caveat-only disposition without rerunning extraction

AG 52 is the plain-text `AG 52-Early Adoption of VM-21 for VA in 2019-repealed-as of 2020.txt` note from the Actuarial Guidelines family. The mixed pilot batch already captured the note as a review-only edge case, so this summary stays aligned with that evidence layer rather than creating a new extraction wave. The source itself says AG 52 is no longer applicable as of 2020, so the note stays historical and non-authoritative.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-001` (mixed pilot item) | `lines 1-15` | Early adoption of VM-21 for a December 31, 2019 valuation, related AG XLIII / RBC / VM-31 instructions, and the no-longer-applicable note | Keep the AG 52 note as a caveat-only edge case already captured in the mixed pilot batch. Do not widen this into a fresh extraction wave. | `stale_or_repealed_source`; `caveat_or_companion_guidance`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | line locators are the primary anchor because no page references are available; line references are the primary anchor for this plain-text note; the note itself says it is no longer applicable as of 2020; cross references to AG XLIII, RBC, and VM-31 remain review-only context; the mixed pilot batch stays the underlying evidence layer. | `reasonable_with_minor_cautions` | Passed in historical pilot validation; no new extraction batch was run for this handoff | `not separately recorded` |

## Higher-Caution Section

- The note itself says AG 52 is no longer applicable as of 2020.
- Line locators are the primary anchor; page references are not available for this plain-text note.
- The AG XLIII, RBC, and VM-31 references are contextual instructions inside a no-longer-applicable note and should not be over-read as current authoritative guidance.
- AG 52 already lives in the mixed pilot batch-001 and should not be reprocessed as a new source wave.
- This index is review-only handoff material and must not be treated as learner-facing, app-ready, or RAG-ready content.

## Human Review Checklist

- Are the no-longer-applicable / historical caveat and the line-only locator pattern clear?
- Are the AG XLIII, RBC, and VM-31 references treated as context rather than current authority?
- Is the mixed pilot batch-001 evidence layer still visible to the reviewer?
- Are extracted items source-bound and kept review-only?
- Are no-promotion, not learner-facing, not app-ready, and not RAG-ready statuses intact?
- Is AG 52 kept out of any future dedicated extraction wave unless a later decision explicitly says otherwise?

## Promotion Decision Area

- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Confirm the no-longer-applicable disposition first.
2. Confirm the line-only locator pattern and the batch-001 mixed-pilot evidence layer.
3. Confirm the AG XLIII, RBC, and VM-31 references remain review-only context.
4. Leave the note excluded from any learner-facing path unless a later decision changes the disposition.

## Relationship to Other Review Indexes

- `docs/review/ag51_review_index.md`
- `docs/review/ag52_self_review.md`
- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

## Review Notes

- This is a summary-only handoff artifact for a source already captured in the mixed pilot batch.
- The underlying batch evidence remains the authoritative review layer.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and `not promoted` all remain intact.
