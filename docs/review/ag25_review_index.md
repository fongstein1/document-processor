# AG 25 Review Index

## Overall AG 25 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

Source status: active.
Actuarial Guideline XXV remains active.
Confirmed page range: pages 1-3.
page 1 is the opening boundary.
page 3 is the closing boundary.
AG 26 remains out of scope for this wave.

## Batch Table

| Batch ID | Selected Pages/Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation Status | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-105 | pages 1-3 | Indexed increasing death benefits | Keep the noisy three-page guideline together; do not widen into AG 26; keep the page image as the wording backstop. | regulatory_requirement; definition_or_terminology; calculation_structure; formula_context; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | reasonable_with_minor_cautions | OCR/page-image confirmation; formula context; low-amount exception boundary; AG 26 exclusion | passed | 11996d7 (planning baseline) |

## Higher-Caution Section

- OCR noise and the page-image wording backstop remain the main caution.
- Consumer Price Index language and formula context should stay review-only until the wording is confirmed.
- The threshold amount language and low-amount exception are dense enough to warrant human confirmation.
- The cash value accumulation test reference and IRS Section 7702 context should stay mapped as cross references, not over-interpreted.
- Page 3 is the closing boundary and should stay separate from any later cleanup pass.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page references sufficient for review?
- Are requirement and explanation separated correctly?
- Are formula labels separated from formula interpretation?
- Are cross references mapped but not over-interpreted?
- Are the threshold amount and low-amount exception treated as review-only caution areas?
- Is the page-image backstop still visible?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for future RAG or app export?

## Promotion Decision Area

- Keep review-only: [x]
- Revise extraction: [ ]
- Promote selected items to learner-facing draft: [ ]
- Prepare RAG-ready candidate set: [ ]
- Prepare app-export candidate set: [ ]

## Recommended Review Order

1. Page 1 indexed increasing death-benefits framework
2. Page 2 threshold and nonforfeiture text
3. Page 3 background and closing boundary
4. Page-image confirmation against the raw PDF

## Relationship to Other Review Indexes

- Review AG 25 alongside `docs/review/ag24_review_index.md`.
- Review AG 25 alongside `docs/review/valuation_regulation_repository_poc_status.md`.

## Self-Review Note

- See `docs/review/ag25_self_review.md` for the batch classification and the
  recurring OCR / page-image caution note.

## Review Notes

- The three-page AG 25 guideline remains review-only.
- Keep the page-image backstop visible before any indexing or promotion
  decision.
- The low-amount exception is a likely boundary for any later cleanup pass.
