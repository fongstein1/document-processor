# AG 37 Review Index

## Overall AG 37 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source title: Actuarial Guideline XXXVII
- source status: active
- AG 38 remains out of scope
- page-image wording backstop remains visible because line references were not available

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation Status | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-127 | pp. 1-3 | Background and scope | Keep the opening background, purpose, scope, and early GMDB framing together before reserve mechanics begin. | regulatory_requirement; definition_or_terminology; background_content; cross_reference_mapping; boundary_control_window; requires_human_interpretation | reasonable_with_minor_cautions | No line references were available; page-image backstop required; AG 38 stays out of scope. | passed | eabbfb7 |
| batch-128 | pp. 4-5 | Definitions and reserve-entry slice | Keep the GMDB revenue, term cost, 1/3-Asset Drop, and attained-age-level reserve entry point together as one narrow review-only slice. | regulatory_requirement; definition_or_terminology; reserve_method_structure; calculation_structure; formula_context; boundary_control_window; cross_reference_mapping; requires_human_interpretation | reasonable_with_minor_cautions | No line references were available; page-image backstop required; reserve-entry wording should stay review-only; AG 38 stays out of scope. | passed | eabbfb7 |
| batch-129 | p. 6 | Effective-date closeout slice | Keep the effective-date, retroactive-application, grade-in-period, and residue closeout language separate as the closing review window. | regulatory_requirement; reporting_requirement; documentation_expectation; governance_or_control_expectation; cross_reference_mapping; boundary_control_window; requires_human_interpretation | reasonable_with_minor_cautions | No line references were available; page-image backstop required; effective-date wording should stay review-only; AG 38 stays out of scope. | passed | eabbfb7 |

## Higher-Caution Section

- The PDF text layer is noisy / encoded, so the page image remains the wording backstop.
- Line references were not available, so page locators are the primary review anchor.
- Batch-127 is a background and scope slice, not a mechanics slice.
- Batch-128 reaches the GMDB reserve-entry boundary and should not be overread as the full mechanics set.
- Batch-129 is a closeout window only; it should not absorb additional mechanics or later source material.
- AG 38 remains out of scope and should not be blended into AG 37 review packets.
- The companion 2021 Law Manual reprint remains excluded as companion-only material.

## Human Review Checklist

- Are the extracted statements source-bound to the AG 37 PDF?
- Are the page references sufficient for review when line references are unavailable?
- Are the requirement / explanation / background distinctions correct?
- Are the reserve-entry and effective-date boundaries being kept narrow?
- Are the page-image and text-layer cautions clearly visible?
- Are AG 38 references mapped but not over-interpreted?
- Are any items becoming candidates for learner-facing promotion?
- Are any items becoming candidates for RAG or app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. batch-127: background and scope first
2. batch-128: definitions and reserve-entry second
3. batch-129: effective-date closeout third

## Relationship to Other Review Indexes

- Review this AG 37 index alongside `docs/review/vm20_review_index.md`, `docs/review/supporting_vm_review_index.md`, `docs/review/vm21_review_index.md`, `docs/review/vm22_review_index.md`, `docs/review/ag36_review_index.md`, `docs/review/ag37_self_review.md`, and `docs/review/valuation_regulation_repository_poc_status.md`.
- The immediately neighboring AG source is AG 36; AG 38 remains out of scope for this wave.

## Review Notes

- AG 37 remains review-only GMDB reserve guidance.
- The page-image backstop should remain visible because line references were not available.
- No learner-facing, app-ready, RAG-ready, or promoted status should be inferred from these batches.
