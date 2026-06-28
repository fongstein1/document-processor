# AG 26 Review Index

## Overall AG 26 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

Source status: active.
Actuarial Guideline XXVI remains active.
Confirmed page range: page 1.
page 1 is the opening and closing boundary for this tiny slice.
AG 27 remains out of scope for this wave.

## Batch Table

| Batch ID | Selected Pages/Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation Status | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-106 | page 1 | Election of operative dates | Keep the one-page guideline together; do not widen into AG 27; keep the page image as the wording backstop. | regulatory_requirement; definition_or_terminology; calculation_structure; formula_context; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | reasonable_with_minor_cautions | OCR/page-image confirmation; cross-reference mapping; operative-date / interest-rate boundary; AG 27 exclusion | passed | e71b257 (planning baseline) |

## Higher-Caution Section

- OCR noise and the page-image wording backstop remain the main caution.
- The operative-date limitation and the early-operative-date condition should stay review-only until the wording is confirmed.
- The Standard Valuation Law and Standard Non-Forfeiture Law references should stay mapped as cross references, not over-interpreted.
- The dynamic interest-rate boundary should stay review-only until the wording is confirmed.
- The dynamic interest-rate and reserve / nonforfeiture-rate boundary is dense enough to warrant human confirmation.
- Page 1 is the closing boundary and should stay separate from any later cleanup pass.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page references sufficient for review?
- Are requirement and explanation separated correctly?
- Are formula labels separated from formula interpretation?
- Are cross references mapped but not over-interpreted?
- Are the operative-date and interest-rate boundary treated as review-only caution areas?
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

1. Page 1 operative-date limitation
2. Dynamic interest-rate and reserve / nonforfeiture boundary
3. Background material and closing boundary
4. Page-image confirmation against the raw PDF

## Relationship to Other Review Indexes

- Review AG 26 alongside `docs/review/ag25_review_index.md`.
- Review AG 26 alongside `docs/review/valuation_regulation_repository_poc_status.md`.

## Self-Review Note

- See `docs/review/ag26_self_review.md` for the batch classification and the
  recurring noisy OCR / page-image caution note.

## Review Notes

- The one-page AG 26 guideline remains review-only.
- Keep the page-image backstop visible before any indexing or promotion
  decision.
- The operative-date limitation and the interest-rate boundary are likely
  candidates for any later cleanup pass.
