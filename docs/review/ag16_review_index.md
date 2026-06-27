# AG 16 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 16
batch `batch-094`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 16 batch, `abe4edc`, not to the
ignored working files themselves.

## Overall AG 16 Extraction Status

- The controlled AG 16 sequence is complete.
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
| `batch-094` | Actuarial Guideline XVI / AG 16 - Guideline for Calculation of Commissioners' Reserve Valuation Method on Select Mortality andor Split Interest.pdf | page 1; historical CRVM guideline | Historical CRVM guideline on select mortality and split interest | This one-page guideline is intentionally limited to the full historical note and keeps the page-image confirmation caveat visible. | regulatory_requirement, definition_or_terminology, formula_context, cross_reference_mapping, background_content, requires_human_interpretation, boundary_control_window, historical_guidance | reasonable_with_minor_cautions | Page-image confirmation is still needed because the text layer is encoded/noisy, and the historical disposition should stay caveat-first for CRVM guidance. | passed | `abe4edc` |

## Higher-Caution Section

- AG 16 is a one-page historical CRVM guideline, not a withdrawn guideline.
- The page-image wording remains the best backstop because the text layer is
  encoded/noisy on the page.
- The select-mortality and split-interest guidance should stay caveat-first
  and not be over-read as learner-facing policy text.
- The examples around `19P[x]+1`, the 1980 CSO Table, split interest rates,
  and Section 4 cross-references should remain review-only context.
- The source should not be treated as active guidance unless a later human
  review changes the indexing choice.

## Human Review Checklist

- Are extracted items source-bound and tied to the page 1 locator?
- Is the page reference sufficient even with the historical posture?
- Is the interpretation versus background boundary preserved?
- Is the historical status visible enough that no one mistakes it for active
  guidance?
- Are select-mortality, split-interest, and formula-context items mapped but
  not over-interpreted?
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

1. AG 16 page 1 as a single historical note.
2. Confirm the page-image wording for the select-mortality, split-interest,
   and formula-context language.
3. Resolve the historical indexing disposition if a later cleanup step wants a
   broader CRVM link.

## Relationship to Other Review Indexes

- `docs/review/ag15_review_index.md`
- `docs/review/ag14_review_index.md`
- `docs/review/ag13_review_index.md`
- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 16 index should be reviewed alongside the AG 15 and AG 14 indexes,
the VM chapter review indexes, and the repository proof-of-concept summary
whenever a cross-reference or historical note points back to source text.

## Self-Review Note

A separate self-review note at `docs/review/ag16_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
