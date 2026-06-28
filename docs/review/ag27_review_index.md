# AG 27 Review Index

## Overall AG 27 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXVII
- AG 28 explicitly remains out of scope for this wave
- batch outputs remain ignored in `data/work/batches/batch-107/` through `data/work/batches/batch-109/`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Unresolved Issues / Review Concerns | Validation | Self-Review | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-107 | pages 1-2; opening accelerated-benefits overview and reserve framing | overview and reserve framing | Keep the three accelerated-benefit categories and reserve framing together, then stop before page 3. | regulatory_requirement; definition_or_terminology; reserve_method_structure; formula_context; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; reserve framing should not be treated as the full mechanics set | passed | reasonable_with_minor_cautions | `9072d6f` |
| batch-108 | page 3; interest accrual approach | interest accrual | Keep the rate-method disclosure separate from the lien mechanics on pages 4-5. | regulatory_requirement; definition_or_terminology; formula_context; documentation_expectation; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | rate-method disclosure still needs human confirmation; formula-context caution remains meaningful | passed | reasonable_with_minor_cautions | `9072d6f` |
| batch-109 | pages 4-5; benefit payment liens and closing boundary | lien mechanics and closing boundary | Keep the lien mechanics, loan interactions, and closing boundary together, then stop at the end of AG 27. | regulatory_requirement; definition_or_terminology; calculation_structure; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | lien-option language needs human confirmation; AG 28 boundary must stay visible; page-image wording remains the backstop | passed | reasonable_with_minor_cautions | `9072d6f` |

## Higher-Caution Section

- The page-image wording backstop stays important because the text layer is noisy / encoded.
- The opening pages distinguish non-discounted acceleration from actuarially discounted acceleration, so the reserve framing should stay summary-only.
- The interest-accrual page requires the rate method to be specified clearly in the contract or actuarial memorandum.
- The lien pages include multiple methods, loan interactions, RPU and ETI treatment, termination behavior, and reinstatement language that should remain review-only until a human confirms the interpretation.
- The closing boundary on pages 4-5 must stop before AG 28.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page and section references sufficient for review?
- Are requirement and explanation separated correctly?
- Are formulas, interest accrual, and lien mechanics clearly separated from interpretation?
- Are cross-references mapped without over-interpreting them?
- Are the page-image backstop and OCR caveats still visible?
- Are the RPU, ETI, loan, and termination items properly flagged for human review?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [x] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Overview and reserve framing first.
2. Interest accrual and rate-method disclosure second.
3. Lien mechanics and closing boundary last.

## Relationship to Other Review Indexes

- AG 27 is its own short-guideline wave and should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md`.
- The VM review indexes remain the broader valuation-manual context:
  - `docs/review/vm20_review_index.md`
  - `docs/review/supporting_vm_review_index.md`
  - `docs/review/vm21_review_index.md`
  - `docs/review/vm22_review_index.md`
- `docs/review/ag26_review_index.md` remains the immediately preceding short-guideline handoff and is useful context for the noisy-text page-image backstop pattern.

## Review Notes

- This index summarizes the ignored batch review packets without promoting any extracted content.
- The page-image wording backstop stays visible for every batch because the PDF text layer is noisy / encoded.
- Reviewers should start from the batch table and the higher-caution section, then move to the self-review note at `docs/review/ag27_self_review.md`.
