# AG 15 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 15
batch `batch-093`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 15 batch, `551f8c0`, not to the
ignored working files themselves.

## Overall AG 15 Extraction Status

- The controlled AG 15 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is the historical / page-image confirmation caveat,
  not active guidance approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-093` | Actuarial Guideline XV / AG 15 - Illustration Guideline for Variable Life Insurance Model Regulation.pdf | page 1; historical illustration guideline | Historical illustration guideline for variable life insurance sales illustrations | This one-page guideline is intentionally limited to the full historical note and keeps the page-image confirmation caveat visible. | regulatory_requirement, reporting_requirement, documentation_expectation, governance_or_control_expectation, caveat_or_companion_guidance, cross_reference_mapping, requires_human_interpretation, boundary_control_window, historical_guidance | reasonable_with_minor_cautions | Page-image confirmation is still needed because the text layer is encoded/noisy, and the historical disposition should stay caveat-first for variable life insurance guidance. | passed | `551f8c0` |

## Higher-Caution Section

- AG 15 is a one-page historical illustration guideline, not a withdrawn
  guideline.
- The page-image wording remains the best backstop because the text layer is
  encoded/noisy on the page.
- The illustration requirements for variable life insurance should stay
  caveat-first and not be over-read as learner-facing policy text.
- The examples around hypothetical interest rates, accumulated policy values,
  transaction charges, and Article VII cross-references should remain
  review-only context.
- The source should not be treated as active guidance unless a later human
  review changes the indexing choice.

## Human Review Checklist

- Are extracted items source-bound and tied to the page 1 locator?
- Is the page reference sufficient even with the historical posture?
- Is the interpretation versus background boundary preserved?
- Is the historical status visible enough that no one mistakes it for active
  guidance?
- Are illustration, disclosure, and cross-reference items mapped but not
  over-interpreted?
- Is the standalone indexing choice clear enough for later review?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for future RAG or app-export use?

## Promotion Decision Area

- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

None of the boxes above are selected by default. Any promotion decision
belongs in a later human review step, not in the completed review-only batch.

## Recommended Review Order

1. AG 15 page 1 as a single historical note.
2. Confirm the page-image wording for the illustration, disclosure, and
   cross-reference language.
3. Resolve the historical indexing disposition if a later cleanup step wants a
   broader variable-life illustration link.

## Relationship to Other Review Indexes

- `docs/review/ag14_review_index.md`
- `docs/review/ag13_review_index.md`
- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 15 index should be reviewed alongside the AG 14 and AG 13 indexes,
the VM chapter review indexes, and the repository proof-of-concept summary
whenever a cross-reference or historical note points back to source text.

## Self-Review Note

A separate self-review note at `docs/review/ag15_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
