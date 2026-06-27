# AG 01 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 01
batch `batch-077`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 01 batch, `e67769f`, not to the
ignored working files themselves.

## Overall AG 01 Extraction Status

- The controlled AG 01 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is valuation net premium / gross premium
  interpretation plus source-quality caution, not content approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-077` | Actuarial Guideline I / AG 01 - Valuation of Policies in Which the Net Premium Exceeds the Gross Premium.pdf | page 1; AG 01 valuation net premium / gross premium interpretation | Single-page valuation-net-premium interpretation | This one-page guideline is intentionally limited to the full page and is retained for review-only analysis. | regulatory_requirement, definition_or_terminology, cross_reference_mapping, requires_human_interpretation, boundary_control_window | reasonable_with_minor_cautions | The page is a one-page encoded PDF, so human review should confirm the wording and indexing choice before any later promotion decision. | passed | `e67769f` |

## Higher-Caution Section

- The page clarifies the Standard Valuation Law treatment for policies whose
  valuation net premiums exceed the actual gross premium collected, so the
  interpretive boundary should stay visible.
- The PDF text layer is noisy enough that the reviewer may need to confirm the
  wording against the page image.
- The batch is a single-page review window, so it should not be widened into
  other guideline files or later legal text.

## Human Review Checklist

- Are the extracted items source-bound and tied to the AG 01 page locator?
- Is the page reference sufficient for review even though the text layer is
  noisy?
- Is the valuation-net-premium language kept distinct from the explanatory
  framing?
- Are the Standard Valuation Law references mapped but not over-interpreted?
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

1. The single AG 01 page.
2. If needed, the underlying Standard Valuation Law text that the page
   references.

## Relationship to Other Review Indexes

- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/vm20_practice_note_review_index.md`
- `docs/review/ag03_review_index.md`

This AG 01 index should be reviewed alongside the VM chapter review indexes,
the practice-note index, and the AG 03 index whenever a cross-reference or
interpretation note points back to binding source text.

## Self-Review Note

A separate self-review note at `docs/review/ag01_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
