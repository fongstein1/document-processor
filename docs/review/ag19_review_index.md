# AG 19 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 19
batch `batch-097`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 19 batch, `4489778`, not to the
ignored working files themselves.

## Overall AG 19 Extraction Status

- The controlled AG 19 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is the mortality-table context and page-image
  confirmation caveat, not active guidance approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-097` | Actuarial Guideline XIX / `AG 19 - Guideline Concerning 1980 Commissioners' Standard Ordinary Mortality Table With 10-Year Select Mortality Factors.pdf` | page 1; 1980 CSO mortality-table guideline | 1980 CSO mortality table with ten-year select mortality factors interpretation | This one-page guideline is intentionally limited to the full mortality-table note and keeps the page-image confirmation caveat visible. | regulatory_requirement, definition_or_terminology, cross_reference_mapping, formula_context, background_content, requires_human_interpretation, boundary_control_window | reasonable_with_minor_cautions | Page-image confirmation is still needed because the text layer is encoded/noisy, and the select-factor interpretation should stay review-only for human confirmation. | passed | `4489778` |

## Higher-Caution Section

- AG 19 is a one-page current mortality-table guideline, not learner-facing
  active guidance.
- The page-image wording remains the best backstop because the text layer is
  encoded/noisy on the page.
- The 1980 CSO / Ten-Year Select Mortality Factors interpretation should stay
  review-only and not be over-read as a promotion candidate.
- References to `1980 Commissioners' Standard Ordinary Mortality Table`,
  `Ten-Year Select Mortality Factors`, `Standard Valuation Law`,
  `Standard Nonforfeiture Law`, `Society of Actuaries Special Committee`, and
  the alternative select-factor language remain review-only context.
- The source should not be treated as active guidance for promotion unless a
  later human review changes the indexing choice.
- Compare AG 19 with `docs/review/ag18_review_index.md` only if a reviewer
  wants a calculation-context contrast with the current CRVM continuous-basis
  note.

## Human Review Checklist

- Are extracted items source-bound and tied to the page 1 locator?
- Is the page reference sufficient even with the mortality-table posture?
- Is the interpretation versus background boundary preserved?
- Is the active guideline status visible enough that no one mistakes it for a
  learner-facing rule?
- Are the 1980 CSO table, select-factor, and Standard Valuation Law /
  Standard Nonforfeiture Law items mapped but not over-interpreted?
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

1. AG 19 page 1 as a single mortality-table note.
2. Confirm the page-image wording for the 1980 CSO and select-factor
   language.
3. Resolve the indexing disposition if a later cleanup step wants a broader
   1980 CSO link.

## Relationship to Other Review Indexes

- `docs/review/ag18_review_index.md`
- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 19 index should be reviewed alongside the AG 18 index, the VM
chapter review indexes, and the repository proof-of-concept summary whenever
a cross-reference or mortality-table note points back to source text.

## Self-Review Note

A separate self-review note at `docs/review/ag19_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
