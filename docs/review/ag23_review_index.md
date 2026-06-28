# AG 23 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packet for controlled AG 23
batch `batch-101`. It is a handoff summary only. The underlying batch outputs
remain in `data/work/batches/` and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 23 batch, `e0c5903`, not to the
ignored working files themselves.

## Overall AG 23 Extraction Status

- The controlled AG 23 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is the separate-account wording, the noisy OCR
  layer, the page-image confirmation caveat, and the placeholder statutory
  reference, not active guidance approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-101` | Actuarial Guideline XXIII / `AG 23 - Guideline Concerning Variable Life Insurance Separate Account Investments.pdf` | `p. 1` | Variable life insurance separate account investments and the sufficiency demonstration | This one-page guideline is intentionally limited to the full separate-account note and keeps the page-image backstop visible. | regulatory_requirement, definition_or_terminology, calculation_structure, formula_context, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | The page-image wording should remain visible and the indexing choice plus placeholder statutory reference should stay review-only until a human reviewer confirms the disposition. | passed | `e0c5903` |

## Higher-Caution Section

- AG 23 is an active guideline note for indexing purposes, but it stays
  review-only.
- The page image remains the best backstop because the text layer is
  noisy/encoded on page 1.
- The separate-account sufficiency wording should stay review-only and not be
  over-read as a promotion candidate.
- References to the placeholder statutory reference, readily marketable
  assets, net investment income, `15%`, `10%`, and the separate series /
  portfolios / investment subdivisions language remain review-only context.
- The source should not be treated as active guidance for promotion unless a
  later human review changes the indexing choice.
- Compare AG 23 with `docs/review/ag22_review_index.md` and
  `docs/review/valuation_regulation_repository_poc_status.md` whenever a
  reviewer wants the broader repository context for the separate-account note.

## Human Review Checklist

- Are extracted items source-bound and tied to the page 1 locator?
- Is the page reference sufficient even with the OCR / image-backstop posture?
- Is the interpretation versus background boundary preserved?
- Is the active guideline status visible enough that no one mistakes it for a
  learner-facing rule?
- Are the placeholder statutory reference, readily marketable assets,
  net investment income, `15%`, `10%`, and separate-series references mapped
  but not over-interpreted?
- Is the page-image backstop explicitly visible so wording can be confirmed
  later?
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

1. AG 23 page 1 as the title / sufficiency-standard page.
2. Confirm the page-image wording for the separate-account investment
   sufficiency language.
3. Resolve the indexing disposition if a later cleanup step wants a broader
   separate-account link.

## Relationship to Other Review Indexes

- `docs/review/ag22_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 23 index should be reviewed alongside the AG 22 index and the
repository proof-of-concept summary whenever a cross-reference or separate-
account note points back to source text.

## Self-Review Note

A separate self-review note at `docs/review/ag23_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
