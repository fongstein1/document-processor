# AG 12 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 12
batch `batch-090`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 12 batch, `82de8f7`, not to the
ignored working files themselves.

## Overall AG 12 Extraction Status

- The controlled AG 12 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is the withdrawn / historical posture itself, not
  active guidance approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-090` | Actuarial Guideline XII / AG 12 - Interpretation Regarding Valuation and Non-Forfeiture Interest Rates.pdf | page 1; withdrawn historical note | Withdrawn interpretation regarding valuation and nonforfeiture interest rates | This one-page guideline is intentionally limited to the full page and keeps the withdrawn / historical posture visible. | stale_or_repealed_source, caveat_or_companion_guidance, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | reasonable_with_minor_cautions | The page text confirms the guideline was withdrawn, so the wording should be confirmed against the page image before any later indexing choice. | passed | `82de8f7` |

## Higher-Caution Section

- AG 12 page 1 is a single-page historical note.
- The page text layer is noisy enough that the page image is the best backstop
  for exact wording.
- The source is withdrawn, so it should not be read as active guidance.
- Interest-rate language should stay caveat-only and not be over-read beyond
  the withdrawn note.

## Human Review Checklist

- Are extracted items source-bound and tied to the page 1 locator?
- Is the page reference sufficient even with the withdrawn/historical posture?
- Is the interpretation versus background boundary preserved?
- Is the withdrawn status visible enough that no one mistakes it for active
  guidance?
- Are interest-rate references mapped but not over-interpreted?
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

1. AG 12 page 1 withdrawn historical note.
2. The indexing / cross-linking question if human review needs it.

## Relationship to Other Review Indexes

- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/ag10_review_index.md`
- `docs/review/ag11_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 12 index should be reviewed alongside the VM chapter review indexes,
the AG 10 and AG 11 indexes, and the repository proof-of-concept summary
whenever a cross-reference or historical note points back to source text.

## Self-Review Note

A separate self-review note at `docs/review/ag12_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
