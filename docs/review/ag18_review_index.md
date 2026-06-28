# AG 18 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 18
batch `batch-096`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 18 batch, `5b769e4`, not to the
ignored working files themselves.

## Overall AG 18 Extraction Status

- The controlled AG 18 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is the calculation-context and page-image
  confirmation caveat, not active guidance approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-096` | Actuarial Guideline XVIII / `AG 18 - Guideline for Calculation of Commissioners' Reserve Valuation Method on Semi-Continuous, Fully Continuous, or Discounted Continuous Basis.pdf` | page 1; CRVM basis guideline | CRVM semi-continuous / fully continuous / discounted continuous basis interpretation | This one-page guideline is intentionally limited to the full calculation note and keeps the page-image confirmation caveat visible. | regulatory_requirement, definition_or_terminology, calculation_structure, formula_context, cross_reference_mapping, background_content, requires_human_interpretation, boundary_control_window | reasonable_with_minor_cautions | Page-image confirmation is still needed because the text layer is encoded/noisy, and the basis-choice interpretation should stay review-only for human confirmation. | passed | `5b769e4` |

## Higher-Caution Section

- AG 18 is a one-page current CRVM guideline, not learner-facing active
  guidance.
- The page-image wording remains the best backstop because the text layer is
  encoded/noisy on the page.
- The semi-continuous / fully continuous / discounted continuous basis
  interpretation should stay review-only and not be over-read as a promotion
  candidate.
- References to `modified net premiums`, `Section 4`, `initial expense
  allowance`, `curtate functions`, and the basis-choice language remain
  review-only context. The `initial expense allowance` phrase is kept as a
  review-only citation anchor.
- The source should not be treated as active guidance for promotion unless a
  later human review changes the indexing choice.
- Compare AG 18 with `docs/review/ag17_review_index.md` only if a reviewer
  wants a calculation-context contrast with the historical non-level
  death-benefit note.

## Human Review Checklist

- Are extracted items source-bound and tied to the page 1 locator?
- Is the page reference sufficient even with the calculation-context posture?
- Is the interpretation versus background boundary preserved?
- Is the active guideline status visible enough that no one mistakes it for a
  learner-facing rule?
- Are the basis-choice, modified-net-premium, and expense-allowance items
  mapped but not over-interpreted?
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

1. AG 18 page 1 as a single calculation-context note.
2. Confirm the page-image wording for the modified net premium, expense
   allowance, and basis-choice language.
3. Resolve the indexing disposition if a later cleanup step wants a broader
   CRVM link.

## Relationship to Other Review Indexes

- `docs/review/ag17_review_index.md`
- `docs/review/ag16_review_index.md`
- `docs/review/ag15_review_index.md`
- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 18 index should be reviewed alongside the AG 17 and AG 16 indexes,
the VM chapter review indexes, and the repository proof-of-concept summary
whenever a cross-reference or calculation-context note points back to source
text.

## Self-Review Note

A separate self-review note at `docs/review/ag18_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
