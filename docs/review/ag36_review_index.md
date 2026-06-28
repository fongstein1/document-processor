# AG 36 Review Index

## Overall AG 36 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXXVI
- page-image wording backstop required because the text layer is encoding-noisy
- line references were not available; page locators remain the primary review anchor

## Batch Table

| Batch ID | Selected Pages/Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review Classification | Unresolved Issues / Review Concerns | Validation Status | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-123 | pp. 1-3 | Foundation and method overview | Keep the title, purpose, scope, CARVM framing, and Type 1 / Type 2 overview together before the attachment-driven mechanics begin. | regulatory_requirement, definition_or_terminology, reserve_method_structure, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Encoded text layer; page-image backstop; AG 37 boundary. | passed | `f885b65` |
| batch-124 | pp. 4-6 | Attachments and method mechanics | Keep the computational-method descriptions and the rate-mechanics material together as one review-only mechanics slice. | regulatory_requirement, definition_or_terminology, reserve_method_structure, calculation_structure, formula_context, prescribed_assumption, company_or_prudent_estimate_assumption, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Encoded text layer; page-image backstop; AG 37 boundary. | passed | `7999ae8` |
| batch-125 | pp. 7-8 | Hedged as Required and notification | Keep the hedged-as-required criteria and the notification threshold together as one review-only slice. | regulatory_requirement, hedging_or_risk_mitigation, reporting_requirement, governance_or_control_expectation, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Encoded text layer; page-image backstop; AG 37 boundary. | passed | `a1a74ba` |
| batch-126 | pp. 9-11 | Certification and closeout | Keep the reasonableness and consistency certifications together as the closing review window. | regulatory_requirement, reporting_requirement, documentation_expectation, governance_or_control_expectation, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Encoded text layer; page-image backstop; AG 37 boundary. | passed | pending final review-index commit |

## Higher-Caution Section

- The AG 36 file is active guidance, but the text layer is noisy enough that the page-image wording remains the backstop for exact phrasing.
- The foundation window on pages 1-3 should stay separate from the attachment-driven mechanics on pages 4-6.
- The hedged-as-required and notification pages on 7-8 are a boundary slice, not a promotion candidate.
- The certification / closeout pages on 9-11 remain review-only and should not absorb later AG 37 content.
- AG 37 is explicitly out of scope for this wave and should stay outside the review-only boundary.
- AG 37 remains out of scope.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page references sufficient for review, given that line references were unavailable?
- Are requirement vs explanation distinctions correct?
- Are formula labels and method context separated from formula interpretation?
- Are hedging and notification items properly flagged as review-only?
- Are certification requirements separated from background material?
- Are cross-references mapped but not over-interpreted?
- Are AG 37 references treated as boundary notes only?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Foundation and method overview first.
2. Attachments and method mechanics second.
3. Hedged as Required and notification third.
4. Certification and closeout last.

## Relationship to Other Review Indexes

- Review AG 36 alongside `docs/review/ag35_review_index.md`.
- Use `docs/review/ag36_self_review.md` as the detailed batch-by-batch reasonableness note.
- Keep `docs/review/valuation_regulation_repository_poc_status.md` in view as the repository-level summary handoff.
- The broader VM review indexes remain the frame of reference for the overall processor posture, but AG 36 should stay in its own wave.

## Review Notes

- AG 36 stayed review-only across batches 123-126.
- No learner-facing approval was granted.
- No app-ready or RAG-ready export was created.
- No promoted content was produced.
- The page-image wording backstop remained visible throughout the wave.
- The self-review note records the same caution pattern as the batch review packets.
