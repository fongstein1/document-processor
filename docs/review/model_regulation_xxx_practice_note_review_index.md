# Model Regulation XXX Practice-Note Review Index

## Overall Model Regulation XXX Practice-Note Extraction Status

- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted
- Source family: `practice_notes`
- Source title: `Model Regulation XXX practice note`
- Source reference: `American Academy of Actuaries practice note, December 2006`
- Source file: `Practice Notes/AAA - Model Regulation XXX - Dec 2006.pdf`
- Source status: active
- Source status note: non-binding practice note / companion guidance; not authoritative regulatory text

This summary is review-only, not learner-facing, not app-ready, not RAG-ready,
and not promoted.

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-192 | pages 1-7; front matter, introduction, purpose/scope, early regulatory requirements, and first group-life boundary questions | Opening companion-guidance slice | Keep the disclaimer and early scope guidance together, then stop before X-factor selection begins. | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | reasonable_with_minor_cautions | Page locators are the primary anchor; the opening companion-guidance text should stay separate from X-factor, reinsurance, and AG XXXVIII material. | passed | pending |
| batch-193 | pages 8-12; X-factor selection, classing, credibility, and mortality-distribution / approximation methods | X-factor selection and approximation slice | Keep the X-factor selection logic and approximation methods together, then stop before reinsurance begins. | regulatory_requirement, definition_or_terminology, calculation_structure, formula_context, requires_human_interpretation | reasonable_with_minor_cautions | Page locators are the primary anchor; the X-factor selection material should stay separate from reinsurance and secondary-guarantee material. | passed | pending |
| batch-194 | pages 13-18; reinsurance, mean reserve / tax reserve handling, substandard policy discussion, and AG XXXVIII / secondary-guarantee questions | Closing companion-guidance slice | Close the source with the later reinsurance and secondary-guarantee material while keeping the end boundary explicit. | reinsurance, calculation_structure, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Page locators are the primary anchor; the closing material should stay separate from any later practice-note file or later source family. | passed | pending |

## Higher-Caution Areas

- The note is companion guidance, not binding regulatory text, so the non-binding
  posture must stay visible in every review layer.
- Page locators are the primary citation anchor for this source; line references
  were not surfaced in the generated batch output.
- The opening front matter and early scope guidance should stay separate from the
  X-factor selection material.
- X-factor selection, classing, and approximation should stay separate from the
  later reinsurance and AG XXXVIII material.
- Reinsurance, mean reserve / tax reserve handling, substandard policy discussion,
  and secondary-guarantee questions should remain review-only and should not be
  merged into a later source unit.
- If the wording is later rechecked against the source image, keep the page-image
  backstop visible because the PDF text layer is not the review anchor of record.

## Human Review Checklist

- Are the extracted guidance items source-bound?
- Are page locators sufficient for human review and future re-checking?
- Are companion-guidance statements clearly separated from binding regulatory text?
- Are X-factor selection and approximation items separated from reinsurance and
  AG XXXVIII material?
- Are reinsurance and secondary-guarantee references mapped without
  over-interpretation?
- Are unresolved issues specific enough to help a reviewer decide the next step?
- Are all items still review-only and not promoted?
- Does any wording need confirmation against the page image before being treated
  as exact?

## Promotion Decision Area

- Keep review-only: selected by default
- Revise extraction: placeholder
- Promote selected items to learner-facing draft: placeholder
- Prepare RAG-ready candidate set: placeholder
- Prepare app-export candidate set: placeholder

## Recommended Review Order

1. Front matter and early scope
2. X-factor selection and approximation
3. Reinsurance and AG XXXVIII / secondary-guarantee closeout

## Relationship to Other Review Artifacts

- This companion-guidance wave should be reviewed alongside
  `docs/review/vm20_review_index.md` and `docs/review/supporting_vm_review_index.md`
  for the broader valuation-regulation context.
- It should also be reviewed alongside `docs/review/vm21_review_index.md`,
  `docs/review/vm22_review_index.md`, and
  `docs/review/valuation_regulation_repository_poc_status.md` so the review-only
  posture stays consistent across the repository handoff set.
- The wave remains review-only and should not be mistaken for a promotion
  candidate or learner-facing export.

## Self-Review Note

- See `docs/review/model_regulation_xxx_practice_note_self_review.md`.

## Review Reminder

This source is companion guidance. Treat it as implementation support only and
keep the non-binding posture visible whenever it is referenced.
