# AG 11 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 11
batch `batch-089`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 11 batch, `6c8fb44`, not to the
ignored working files themselves.

## Overall AG 11 Extraction Status

- The controlled AG 11 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is the operative-date interpretation itself and
  the noisy text layer, not content approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-089` | Actuarial Guideline XI / AG 11 - Effect of an Early Election by an Insurance Company of an Operative Date under.pdf | page 1; AG 11 operative-date election note | Effect of an early election of an operative date under Section 5-C | This one-page guideline is intentionally limited to the full page and keeps the encoded/noisy text layer visible. | regulatory_requirement, definition_or_terminology, governance_or_control_expectation, cross_reference_mapping, requires_human_interpretation, boundary_control_window | reasonable_with_minor_cautions | The page text is noisy/encoded, so the wording should be confirmed against the page image before any later promotion decision. | passed | `6c8fb44` |

## Higher-Caution Section

- AG 11 page 1 is a single-page interpretive note.
- The page text layer is noisy/encoded, so the page image is the best
  backstop for exact wording.
- The question of whether AG 11 should stay standalone or become a later
  cross-link remains review-only.
- Operative date, like plans, generic form, and cash values should not be
  over-read beyond the page text.

## Human Review Checklist

- Are extracted items source-bound and tied to the page 1 locator?
- Is the page reference sufficient even with the noisy text layer?
- Is the interpretation versus explanation boundary preserved?
- Are operative date, like plans, generic form, and cash values mapped but
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

1. AG 11 page 1 interpretive note.
2. The indexing / cross-linking question if human review needs it.

## Relationship to Other Review Indexes

- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/ag10_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 11 index should be reviewed alongside the VM chapter review indexes,
the AG 10 index, and the repository proof-of-concept summary whenever a
cross-reference or interpretation note points back to binding source text.

## Self-Review Note

A separate self-review note at `docs/review/ag11_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
