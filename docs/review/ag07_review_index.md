# AG 07 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 07
batch `batch-082`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 07 batch, `b296598`, not to the
ignored working files themselves.

## Overall AG 07 Extraction Status

- The controlled AG 07 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is equivalent-level-amount interpretation, not
  content approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-082` | Actuarial Guideline VII / AG 07 - Calculation of Equivalent Level Amounts.pdf | pages 1-2; AG 07 interpretation regarding calculation of equivalent level amounts | Two-page equivalent-level-amount interpretation | This two-page guideline is intentionally limited to the full guideline pages and is retained for review-only analysis. | regulatory_requirement, formula_context, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | reasonable_with_minor_cautions | The pages are a two-page encoded PDF, so human review should confirm the wording and indexing choice before any later promotion decision. | passed | `b296598` |

## Higher-Caution Section

- The pages explain how pure endowments affect equivalent level amounts,
  expense allowances, and reserve / nonforfeiture calculations, so the
  formula-context boundary should stay visible.
- The PDF text layer is noisy enough that the reviewer may need to confirm the
  wording against the page images.
- The pages describe the selection question for equivalent-level amounts, so
  the batch should not be widened into other guideline files or later legal
  text.

## Human Review Checklist

- Are the extracted items source-bound and tied to the AG 07 page locator?
- Is the page reference sufficient for review even though the text layer is
  noisy?
- Is the pure-endowment / equivalent-level-amount language kept distinct from
  the explanatory framing?
- Are the equivalent-level-amount references mapped but not over-interpreted?
- Is the source-quality caveat clear enough for a human reviewer?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for future RAG or app-export use?

## Promotion Decision Area

- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

None of the boxes above are selected by default. Any promotion decision belongs
in a later human review step, not in the completed review-only batch.

## Recommended Review Order

1. The AG 07 page 1 equivalent-level-amount interpretation text.
2. The AG 07 page 2 explanatory continuation.
3. If needed, the underlying premium or reserve text that the pages reference.

## Relationship to Other Review Indexes

- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/vm20_practice_note_review_index.md`
- `docs/review/ag06_review_index.md`
- `docs/review/ag05_review_index.md`
- `docs/review/ag04_review_index.md`
- `docs/review/ag03_review_index.md`
- `docs/review/ag01_review_index.md`
- `docs/review/ag02_review_index.md`

This AG 07 index should be reviewed alongside the VM chapter review indexes,
the practice-note index, the AG 06 index, and the earlier AG indexes whenever
a cross-reference or interpretation note points back to binding source text.

## Self-Review Note

A separate self-review note at `docs/review/ag07_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
