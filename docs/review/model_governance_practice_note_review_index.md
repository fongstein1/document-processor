# Model Governance Practice-Note Review Index

## Overall Model Governance Practice-Note Extraction Status

- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted
- Source family: `practice_notes`
- Source title: `Model Governance: Some Considerations for Practicing Life Actuaries`
- Source reference: `American Academy of Actuaries practice note, April 2017`
- Source file: `Practice Notes/AAA - Model_Governance_PN_042017.pdf`
- Source status: active
- Source status note: companion guidance / implementation guidance; non-binding and not authoritative regulatory text

This summary is review-only, not learner-facing, not app-ready, not RAG-ready,
and not promoted.

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-183 | pages 1-7; front matter, disclaimer, introduction, model, and model-development opener | Opening companion-guidance slice | Keep the disclaimer and introduction together, then stop before the governance sections begin. | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | reasonable_with_minor_cautions | Page locators are the primary anchor; the opening companion-guidance text should stay separate from governance and validation sections. | passed | 585fafe |
| batch-184 | pages 8-14; model governance policy, model risk, controls, and validation | Governance and validation slice | Keep the governance, controls, and validation guidance together, then stop before the documentation closeout begins. | governance_or_control_expectation, documentation_expectation, cross_reference_mapping, requires_human_interpretation | reasonable_with_minor_cautions | Page locators are the primary anchor; governance and validation should stay separate from documentation closeout. | passed | 585fafe |
| batch-185 | pages 15-18; validation-governance relationship, documentation, references, and definitions | Closing validation and documentation slice | Keep the closeout material together and stop at the end of the source. | documentation_expectation, definition_or_terminology, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Page locators are the primary anchor; the closing validation and documentation slice should stay separate from any later practice note file. | passed | 585fafe |

## Higher-Caution Areas

- The practice note is companion guidance, not binding regulatory text, so its status must stay visible in every review layer.
- Page locators are the primary citation anchor for this source; line references were not surfaced in the summary layer.
- The front matter and introduction should stay separate from the governance and validation sections.
- Governance, controls, and validation should stay separate from the documentation closeout.
- The validation, documentation, references, and definitions closeout should not be merged into any later practice-note file.
- VM and AG cross references remain review-only unless operational text is captured in the same batch.

## Human Review Checklist

- Are the extracted guidance items source-bound?
- Are page locators sufficient for human review and future re-checking?
- Are companion-guidance statements clearly separated from binding regulatory text?
- Are governance and control expectations separated from documentation expectations?
- Are cross-references to VM, AG, and ASOP material mapped without over-interpretation?
- Are unresolved issues specific enough to help a reviewer decide the next step?
- Are all items still review-only and not promoted?
- Does any wording need confirmation against the source page image before being treated as exact?

## Promotion Decision Area

- Keep review-only: selected by default
- Revise extraction: placeholder
- Promote selected items to learner-facing draft: placeholder
- Prepare RAG-ready candidate set: placeholder
- Prepare app-export candidate set: placeholder

## Recommended Review Order

1. Front matter and introduction
2. Governance, controls, and validation
3. Validation, documentation, references, and definitions

## Relationship to Other Review Artifacts

- This companion-guidance wave should be reviewed alongside `docs/review/vm20_review_index.md` and `docs/review/supporting_vm_review_index.md` for the broader model-governance context.
- It should also be reviewed alongside `docs/review/vm21_review_index.md`, `docs/review/vm22_review_index.md`, and `docs/review/valuation_regulation_repository_poc_status.md` so the review-only posture stays consistent across the repository handoff set.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.

## Self-Review Note

- See `docs/review/model_governance_practice_note_self_review.md`.

## Review Notes

- Keep the companion-guidance posture visible in the review packet and in any later summary use.
