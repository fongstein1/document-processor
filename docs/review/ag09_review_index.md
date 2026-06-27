# AG 09 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packets for controlled AG 09
batch `batch-084` through `batch-087`. It is a handoff summary only. The
underlying batch outputs remain in `data/work/batches/` and are not promoted
by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hash below refers to the tracked planning baseline
commit that immediately preceded the AG 09 family batches, `ae056c4`, not to
the ignored working files themselves.

## Overall AG 09 Extraction Status

- The controlled AG 09 sequence is complete.
- The family remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is OCR/title mismatch handling and short
  annuity-classification / mortality-table interpretation, not content
  approval.

## Batch Table

| Batch | Source / chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-084` | Actuarial Guideline IX / AG 09 - Form Classification of Individual Single Premium Annuities for Application of the Valuation and Nonforfeiture Laws.pdf | page 1; AG 09 form-classification note | Form classification of individual single premium annuities | This one-page guideline is intentionally limited to the full page and keeps the OCR/title mismatch visible. | definition_or_terminology, regulatory_requirement, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | The page text refers to immediate annuities while the filename references single premium annuities, so the wording should be confirmed against the page image before any later promotion decision. | passed | `ae056c4` |
| `batch-085` | Actuarial Guideline IX-A / AG 09-A - Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Structured Settlements.pdf | pages 1-2; AG 09-A structured-settlement note | Substandard annuity mortality tables under structured settlements | This two-page companion guidance is intentionally limited to the full note and remains review-only. | prescribed_assumption, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | The text layer is noisy enough that the wording should be confirmed against the page images before any later promotion decision. | passed | `ae056c4` |
| `batch-086` | Actuarial Guideline IX-B / AG 09-B - Clarification of methods for immediate and deferred annuities and structured sttlement contracts.pdf | pages 1-4; AG 09-B clarification note | Clarification of methods under Standard Valuation Law | This four-page clarification note is intentionally limited to the full note and remains review-only. | regulatory_requirement, formula_context, definition_or_terminology, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | The text layer is noisy enough that the wording should be confirmed against the page images before any later promotion decision. | passed | `ae056c4` |
| `batch-087` | Actuarial Guideline IX-C / AG 09-C - Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Individual Single Premium Immediate Annuities.pdf | pages 1-3; AG 09-C immediate-annuity note | Substandard annuity mortality tables under immediate annuities | This three-page companion guidance is intentionally limited to the full note and remains review-only. | prescribed_assumption, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | The text layer is noisy enough that the wording should be confirmed against the page images before any later promotion decision. | passed | `ae056c4` |

## Higher-Caution Section

- AG 09 page 1 has a title / OCR mismatch: the filename says single premium
  annuities, while the page text refers to immediate annuities.
- AG 09-A and AG 09-C both turn on substandard annuity mortality tables, so
  the assumption boundary should stay visible.
- AG 09-B is the broadest slice in the family and should not be widened past
  its four-page boundary; page 4 is the final page in that note.
- All four batches have noisy text layers, so the page images remain the best
  backstop for exact wording.

## Human Review Checklist

- Are the extracted items source-bound and tied to the AG 09 page locators?
- Is the page reference sufficient for review even though the text layers are
  noisy?
- Is the immediate/deferred classification language kept distinct from the
  explanatory framing?
- Are the mortality-table references mapped but not over-interpreted?
- Is the OCR/title mismatch on AG 09 clear enough for a human reviewer?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for future RAG or app-export use?

## Promotion Decision Area

- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

None of the boxes above are selected by default. Any promotion decision belongs
in a later human review step, not in the completed review-only batches.

## Recommended Review Order

1. AG 09 page 1 form-classification note.
2. AG 09-B clarification of methods.
3. AG 09-A structured-settlement mortality-table note.
4. AG 09-C immediate-annuity mortality-table note.

## Relationship to Other Review Indexes

- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/vm20_practice_note_review_index.md`
- `docs/review/ag08_review_index.md`
- `docs/review/ag07_review_index.md`
- `docs/review/ag06_review_index.md`
- `docs/review/ag05_review_index.md`
- `docs/review/ag04_review_index.md`
- `docs/review/ag03_review_index.md`
- `docs/review/ag02_review_index.md`
- `docs/review/ag01_review_index.md`

This AG 09 index should be reviewed alongside the VM chapter review indexes,
the practice-note index, the AG 08 index, and the earlier AG indexes whenever
a cross-reference or interpretation note points back to binding source text.

## Self-Review Note

A separate self-review note at `docs/review/ag09_self_review.md` records the
batch-level reasonableness pass and the recurring caution areas.

## Review Notes

- The underlying batch review packet remains the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
