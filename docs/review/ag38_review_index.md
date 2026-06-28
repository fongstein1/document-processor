# AG 38 Review Index

## Overall AG 38 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source title: Actuarial Guideline XXXVIII
- source status: active
- AG 39 remains out of scope
- line references were not available
- page-image wording backstop remains visible because the text layer is noisy

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation Status | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-130 | pp. 1-3 | Background and application | Keep the opening background and application framing together before reserve mechanics begin. | regulatory_requirement; definition_or_terminology; background_content; cross_reference_mapping; boundary_control_window; requires_human_interpretation | reasonable_with_minor_cautions | No line references were available; page-image backstop required; AG 39 remains out of scope. | passed | 03f30fe |
| batch-131 | pp. 4-6 | Example mechanics | Keep reserve-construction examples together as one narrow review-only slice. | regulatory_requirement; definition_or_terminology; reserve_method_structure; calculation_structure; formula_context; prescribed_assumption; company_or_prudent_estimate_assumption; cross_reference_mapping; boundary_control_window; requires_human_interpretation | reasonable_with_minor_cautions | No line references were available; page-image backstop required; reserve-example wording should stay review-only; AG 39 remains out of scope. | passed | 03f30fe |
| batch-132 | pp. 7-10 | Deterministic reserve and step boundaries | Keep the step-based reserve mechanics together and stop before the opinion / representation material begins. | regulatory_requirement; reserve_method_structure; calculation_structure; formula_context; prescribed_assumption; company_or_prudent_estimate_assumption; reporting_requirement; documentation_expectation; cross_reference_mapping; boundary_control_window; requires_human_interpretation | reasonable_with_minor_cautions | No line references were available; page-image backstop required; deterministic step wording should stay review-only; AG 39 remains out of scope. | passed | 03f30fe |
| batch-133 | pp. 11-13 | Opinion, representation, and closeout | Keep the opinion / company-representation material together as the closing review window. | regulatory_requirement; reporting_requirement; documentation_expectation; governance_or_control_expectation; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | reasonable_with_minor_cautions | No line references were available; page-image backstop required; opinion / closeout wording should stay review-only; AG 39 remains out of scope. | passed | 03f30fe |

## Higher-Caution Section

- The PDF text layer is noisy / encoded, so the page image remains the
  wording backstop.
- line references were not available, so page locators are the primary review
  anchor.
- Batch-130 is a background and application slice, not a mechanics slice.
- Batch-131 reaches the reserve-example boundary and should not be overread
  as the full reserve mechanics set.
- Batch-132 is a deterministic step-boundary window only; it should remain
  review-only.
- Batch-133 is an opinion / representation / closeout window only; it should
  remain review-only.
- AG 39 remains out of scope and should not be blended into AG 38 review
  packets.
- The companion 2021 Law Manual reprint remains excluded as companion-only
  material.

## Human Review Checklist

- Are the extracted statements source-bound to the AG 38 PDF?
- Are the page references sufficient for review when line references are
  unavailable?
- Are the requirement / explanation / background distinctions correct?
- Are the reserve-example and deterministic-step boundaries being kept
  narrow?
- Are the opinion / representation / closeout statements still review-only?
- Are AG 39 references mapped but not over-interpreted?
- Are the page-image and text-layer cautions clearly visible?
- Are any items becoming candidates for learner-facing promotion?
- Are any items becoming candidates for RAG or app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. batch-130: background and application first
2. batch-131: example mechanics second
3. batch-132: deterministic reserve and step boundaries third
4. batch-133: opinion, representation, and closeout last

## Relationship to Other Review Indexes

- Review this AG 38 index alongside `docs/review/ag37_review_index.md`,
  `docs/review/ag38_self_review.md`, `docs/review/vm20_review_index.md`,
  `docs/review/supporting_vm_review_index.md`, `docs/review/vm21_review_index.md`,
  `docs/review/vm22_review_index.md`, and
  `docs/review/valuation_regulation_repository_poc_status.md`.
- The immediately neighboring AG source is AG 37; AG 39 remains out of scope
  for this wave.
- The companion 2021 Law Manual reprint remains excluded as companion-only
  material.

## Review Notes

- No line references were available, so the page-image backstop remains the
  primary wording anchor.
- All four batches remained review-only, not learner-facing, not app-ready,
  not RAG-ready, and not promoted.
