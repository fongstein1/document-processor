# AG 24 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packets for controlled AG 24
batches `batch-102` through `batch-104`. It is a handoff summary only. The
underlying batch outputs remain in `data/work/batches/` and are not promoted by
this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 24 batches, `bd7608e`, not to the
ignored working files themselves.

## Overall AG 24 Extraction Status

- The controlled AG 24 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is the page-image backstop, the noisy OCR layer,
  the formula context, and the charge / paid-up-benefit boundary, not active
  guidance approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-102` | Actuarial Guideline XXIV / `AG 24 - Guideline for Variable Life Non-Forfeiture Values.pdf` | `pp. 1-2` | Variable life nonforfeiture overview and retrospective method | This opening slice is intentionally limited to the retrospective-method pages so the page-image backstop stays visible and the later formulas do not widen the batch. | regulatory_requirement, definition_or_terminology, calculation_structure, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | The page-image wording should remain visible and the formula context should stay review-only until a human reviewer confirms the disposition. | passed | `bd7608e` |
| `batch-103` | Actuarial Guideline XXIV / `AG 24 - Guideline for Variable Life Non-Forfeiture Values.pdf` | `pp. 3-4` | Variable life prospective method and charge framework | This middle slice is intentionally limited to the prospective-method pages so the charge framing stays separate from the closing paid-up-benefit language. | regulatory_requirement, definition_or_terminology, reserve_method_structure, calculation_structure, formula_context, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | The page-image wording should remain visible and the formula context should stay review-only until a human reviewer confirms the disposition. | passed | `bd7608e` |
| `batch-104` | Actuarial Guideline XXIV / `AG 24 - Guideline for Variable Life Non-Forfeiture Values.pdf` | `pp. 5-6` | Surrender-charge caps and paid-up nonforfeiture benefits | This closing slice keeps the surrender-charge caps and paid-up-benefit language together so the closing boundary stays review-only. | regulatory_requirement, definition_or_terminology, calculation_structure, formula_context, prescribed_assumption, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | The page-image wording backstop and the charge / paid-up-benefit context should stay visible so the final slice does not get over-interpreted. | passed | `bd7608e` |

## Higher-Caution Section

- AG 24 is an active guideline for indexing purposes, but it stays review-only.
- The page image remains the wording backstop because the text layer is noisy
  or encoded on the opening and closing pages.
- The prospective-method and surrender-charge language are formula-heavy and
  should not be over-read as promotion candidates.
- The charge caps, deferred acquisition charges, and paid-up nonforfeiture
  benefits should stay review-only until a human reviewer confirms the wording.
- The variable life nonforfeiture values guideline remains review-only.
- The maximum allowable surrender charge language remains review-only in the
  closing batch.
- The page 6 closing boundary should remain review-only.
- The page windows are intentionally narrow and should not be merged into a
  broader AG 24 pass.
- Compare AG 24 with `docs/review/ag23_review_index.md` and
  `docs/review/valuation_regulation_repository_poc_status.md` whenever a
  reviewer wants the broader repository context.

## Human Review Checklist

- Are the extracted items source-bound and tied to the page-window locators?
- Is the page-image backstop visible for all three batches?
- Are the regulatory requirements separated from explanation and background?
- Are the formula labels and formula context kept separate from interpretation?
- Are the charge caps and paid-up-benefit terms mapped but not over-interpreted?
- Are cross-references to the Standard Nonforfeiture Law and CPI adjustments
  captured without widening the batch?
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

1. AG 24 page 1-2 as the retrospective-method and opening-definition slice.
2. AG 24 page 3-4 as the prospective-method and charge-framework slice.
3. AG 24 page 5-6 as the surrender-charge and paid-up-benefit slice.

## Relationship to Other Review Indexes

- `docs/review/ag23_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This AG 24 index should be reviewed alongside the AG 23 index and the
repository proof-of-concept summary whenever a cross-reference or charge
boundary points back to source text.

## Self-Review Note

A separate self-review note at `docs/review/ag24_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packets remain the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
