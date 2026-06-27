# AG 13 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 13
batch `batch-091`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 13 batch, `e078afa`, not to the
ignored working files themselves.

## Overall AG 13 Extraction Status

- The controlled AG 13 sequence is complete.
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
| `batch-091` | Actuarial Guideline XIII / AG 13 - Guideline Concerning the Commissioners' Annuity Reserve Valuation Method.pdf | pages 1-2; historical CARVM guidance | Historical CARVM guidance on contingent surrender charges and bail-out rates | This two-page guideline is intentionally limited to the full historical note and keeps the page-image confirmation caveat visible. | regulatory_requirement, definition_or_terminology, caveat_or_companion_guidance, cross_reference_mapping, requires_human_interpretation, boundary_control_window, historical_guidance | reasonable_with_minor_cautions | Page-image confirmation is still needed because the text layer is encoded/noisy, and the historical disposition should stay caveat-first. | passed | `e078afa` |

## Higher-Caution Section

- AG 13 is a two-page historical CARVM interpretation note, not a withdrawn
  guideline.
- The page-image wording remains the best backstop because the text layer is
  encoded/noisy on both pages.
- Contingent surrender charges and bail-out rates should stay caveat-first and
  not be over-read as active learner-facing policy.
- The examples around external-index-based bail-out rates and severe hardship
  should remain review-only context.
- The source should not be treated as active guidance unless a later human
  review changes the indexing choice.

## Human Review Checklist

- Are extracted items source-bound and tied to the page 1-2 locator?
- Is the page reference sufficient even with the historical posture?
- Is the interpretation versus background boundary preserved?
- Is the historical status visible enough that no one mistakes it for active
  guidance?
- Are contingent surrender-charge and bail-out-rate references mapped but not
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

1. AG 13 pages 1-2 as a single historical note.
2. Confirm the page-image wording for the contingent surrender-charge and
   bail-out-rate language.
3. Resolve the historical indexing disposition if a later cleanup step wants a
   broader CARVM link.

## Relationship to Other Review Indexes

- `docs/review/ag12_review_index.md`
- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 13 index should be reviewed alongside the AG 12 index, the VM chapter
review indexes, and the repository proof-of-concept summary whenever a
cross-reference or historical note points back to source text.

## Self-Review Note

A separate self-review note at `docs/review/ag13_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
