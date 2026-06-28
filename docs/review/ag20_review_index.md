# AG 20 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 20
batch `batch-098`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 20 batch, `606416b`, not to the
ignored working files themselves.

## Overall AG 20 Extraction Status

- The controlled AG 20 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is the joint-life table context, the page 3 blank
  separator, and the table-continuity caveat, not active guidance approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-098` | Actuarial Guideline XX / `AG 20 - Guideline Concerning Joint Life Functions for 1980 Commissioners' Standard Ordinary Mortality Table.pdf` | `pp. 1-7` | 1980 CSO joint-life-functions guideline and Appendix 5 lookup tables | This seven-page guideline is intentionally limited to the full joint-life-function note and keeps the page 3 blank separator visible. | regulatory_requirement, definition_or_terminology, calculation_structure, formula_context, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | The blank separator page should remain visible and the indexing choice should stay review-only until a human reviewer confirms the disposition. | passed | `606416b` |

## Higher-Caution Section

- AG 20 is an active guideline note for indexing purposes, but it stays
  review-only.
- The page 3 blank separator remains the main boundary marker because the
  A5-1, A5-6, and A5-7 table family continues across the full seven-page
  window.
- The 1980 CSO / joint life functions / uniform seniority / equivalent equal
  ages language should stay review-only and not be over-read as a promotion
  candidate.
- References to `1980 CSO`, `Uniform Seniority`, `Ultimate 1xx Tables`,
  `Appendix 5`, `A5-1`, `A5-6`, `A5-7`, and `equivalent equal ages` remain
  review-only context.
- The source should not be treated as active guidance for promotion unless a
  later human review changes the indexing choice.
- Compare AG 20 with `docs/review/ag19_review_index.md` and the VM chapter
  review indexes only if a reviewer wants the broader repository context for a
  joint-life table note.

## Human Review Checklist

- Are extracted items source-bound and tied to the page 1-7 locator?
- Is the page reference sufficient even with the joint-life-table posture?
- Is the interpretation versus background boundary preserved?
- Is the active guideline status visible enough that no one mistakes it for a
  learner-facing rule?
- Are the 1980 CSO table, uniform seniority, equivalent equal ages, and
  Appendix 5 items mapped but not over-interpreted?
- Is the blank page 3 separator explicitly visible so table continuity can be
  checked later?
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

1. AG 20 page 1 as the title / acceptability-language page.
2. AG 20 page 2 as the A5-1 deduction / equivalent equal-ages table page.
3. AG 20 page 3 as the blank separator confirmation.
4. AG 20 pages 4-7 as the A5-6 and A5-7 lookup-table family and closing
   boundary.

## Relationship to Other Review Indexes

- `docs/review/ag19_review_index.md`
- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 20 index should be reviewed alongside the AG 19 index, the VM
chapter review indexes, and the repository proof-of-concept summary whenever
a cross-reference or joint-life-table note points back to source text.

## Self-Review Note

A separate self-review note at `docs/review/ag20_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
