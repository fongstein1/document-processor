# AG 28 Review Index

## Overall AG 28 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXVIII
- AG 29 explicitly remains out of scope for this wave
- batch outputs remain ignored in `data/work/batches/batch-110/`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Unresolved Issues / Review Concerns | Validation | Self-Review | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-110 | page 1; survivor income benefit background, reserve approximation guidance, and closing boundary note | survivor income benefit reserve slice | Keep the one-page guideline together, preserve the page-image backstop, and stop before any later guideline file. | regulatory_requirement; definition_or_terminology; reserve_method_structure; calculation_structure; formula_context; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; reserve-approximation boundary remains review-only | passed | reasonable_with_minor_cautions | `1482608` |

## Higher-Caution Section

- The page image remains the wording backstop because the text layer is noisy / encoded.
- The one-page slice frames survivor income benefit reserves for group long-term disability contracts and should stay review-only until the wording is confirmed.
- The reserve approximation language remains summary-only and should not be read as the full mechanics set.
- The tested example is useful for review, but it does not change the no-promotion posture.
- The closing boundary stays on page 1, and AG 29 remains out of scope.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page and section references sufficient for review?
- Are requirement and explanation separated correctly?
- Are reserve framing and approximation language separated from interpretation?
- Are cross-references mapped without over-interpreting them?
- Are the page-image backstop and OCR caveats still visible?
- Are the survivor income benefit and group long-term disability references properly flagged?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [x] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Survivor-income-benefit reserve framing first.
2. Reserve approximation and boundary caveat second.
3. Page-image wording confirmation last.

## Relationship to Other Review Indexes

- AG 28 is its own short-guideline wave and should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md`.
- The VM review indexes remain the broader valuation-manual context:
  - `docs/review/vm20_review_index.md`
  - `docs/review/supporting_vm_review_index.md`
  - `docs/review/vm21_review_index.md`
  - `docs/review/vm22_review_index.md`
- `docs/review/ag27_review_index.md` remains the immediately preceding short-guideline handoff and is useful context for the page-image backstop pattern.

## Review Notes

- This index summarizes the ignored batch review packet without promoting any extracted content.
- The page-image wording backstop stays visible for the batch because the PDF text layer is noisy / encoded.
- Reviewers should start from the batch table and the higher-caution section, then move to the self-review note at `docs/review/ag28_self_review.md`.
