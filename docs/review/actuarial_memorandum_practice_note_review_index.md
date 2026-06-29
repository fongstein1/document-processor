# Actuarial Memorandum Practice Note Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source status:
- Non-binding practice note
- Companion guidance / exposure draft
- Page locators are the primary citation anchor; line references were not expected for this PDF slice

Source file:
- Practice Notes/Actuarial Memorandum Practice Note 01142020.pdf
- Source reference: American Academy of Actuaries exposure draft, January 2020
- Confirmed page range: pages 1-37

Higher-caution areas:
- Companion-guidance framing must stay visible because the note is not authoritative regulatory text.
- Front matter and background guidance stay separate from drafting guidance.
- Drafting guidance stays separate from the judgment-heavy reserve-item section.
- Appendix ASOP / SAP / checklist material stays separate from any later source family.
- No stable line references were available, so page locators remain the review anchor.

## Batch Table

| Batch ID | Pages / section | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-202 | pp. 1-8 | Opening and background guidance slice | Keep the exposure-draft framing and background guidance together before drafting begins | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | reasonable_with_minor_cautions | Companion-guidance caveat stays visible; opening guidance stays separate from drafting material; page locators are the primary anchor | passed | pending |
| batch-203 | pp. 9-18 | Drafting and content considerations slice | Keep the drafting guidance together as one narrow review-only slice | reporting_requirement, documentation_expectation, definition_or_terminology, cross_reference_mapping, requires_human_interpretation | reasonable_with_minor_cautions | Drafting guidance stays separate from the reserve-item section; page locators are the primary anchor | passed | pending |
| batch-204 | pp. 19-27 | Judgment and reserve-items slice | Keep the judgment-heavy content together while preserving the reporting boundary | calculation_structure, formula_context, reporting_requirement, documentation_expectation, cross_reference_mapping, requires_human_interpretation | reasonable_with_minor_cautions | Judgment-heavy content stays separate from the appendix material; page locators are the primary anchor | passed | pending |
| batch-205 | pp. 28-37 | Appendices and checklist slice | Close the note with the appendix material while keeping the end boundary explicit | cross_reference_mapping, background_content, caveat_or_companion_guidance, boundary_control_window | reasonable_with_minor_cautions | Appendix and checklist material stays separate from any later practice note or source family; page locators are the primary anchor | passed | pending |

## Human Review Checklist

- Are the extracted items clearly source-bound to the practice note and not treated as binding regulatory text?
- Are page locators sufficient for review, given that stable line references were not available?
- Does each batch keep the companion-guidance caveat visible?
- Are drafting guidance and judgment-heavy reserve-item material kept in separate review windows?
- Are ASOP, SAP, and annual-statement references treated as cross-reference material unless the operational text is captured in the same batch?
- Are unresolved issues specific and useful rather than generic?
- Are all learner-facing, app-ready, and RAG-ready statuses still blocked?

## Promotion Decision Area

- Keep review-only
- Revise extraction
- Promote selected items to learner-facing draft
- Prepare RAG-ready candidate set
- Prepare app-export candidate set

## Relationship to Existing Review Indexes

- docs/review/model_governance_practice_note_review_index.md
- docs/review/life_reinsurance_reserve_credit_practice_note_review_index.md
- docs/review/valuation_regulation_repository_poc_status.md

This source should be reviewed alongside other companion-guidance waves, but it remains distinct from the regulatory guideline and VM chapter indexes.
