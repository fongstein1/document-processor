# LTCI Practice Note Review Index

## Overall Status

- `review-only`
- `not learner-facing`
- `not app-ready`
- `not RAG-ready`
- `not promoted`
- `non-binding practice note / companion guidance`

## Source Summary

- Source file: `Practice Notes/AAA-LTCI_Practice_Note_5.21.pdf`
- Source family: `practice_notes`
- Source status: `non-binding practice note`
- Page range: `1-31`
- Boundary note: keep the disclaimer, practice-note caveat, and closing boundary visible; use page locators as the primary anchor because stable line references are not expected.

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-195` | `pp. 1-10` | Front matter, introduction, experience studies, morbidity, assumption-setting opener | Keep the disclaimer and opening companion-guidance slice together before persistency begins | `background_content`, `caveat_or_companion_guidance`, `cross_reference_mapping`, `boundary_control_window` | `reasonable_with_minor_cautions` | Non-binding caveat must remain visible; page locators are primary; keep ASOP / valuation cross-references review-only | passed | `n/a` |
| `batch-196` | `pp. 11-20` | Persistency, mortality, lapse, benefit exhaustion, anti-selection, investment-return / discounting methods | Keep the core assumption-setting and persistency material together as one narrow slice | `definition_or_terminology`, `calculation_structure`, `formula_context`, `prescribed_assumption`, `company_or_prudent_estimate_assumption`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Assumption-setting and interpretive material should remain review-only; page locators are primary | passed | `n/a` |
| `batch-197` | `pp. 21-31` | Financial reporting, valuation, reserve calculations, incurred claim reserve discussion, first-principles / conversion closeout | Close the note with the financial reporting and valuation material while keeping the end boundary explicit | `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Reporting / valuation language should not be overread as authoritative operational text; closing boundary must remain explicit | passed | `n/a` |

## Higher-Caution Areas

- Non-binding companion-guidance caveat must stay visible throughout the wave.
- Page locators are the primary anchor; stable line references are not expected.
- Experience-study and morbidity discussion should remain separate from later persistency / mortality mechanics.
- Persistency, mortality, lapse, and investment-return language should remain review-only and not be promoted.
- Financial-reporting and valuation material should stay distinct from the companion-note framing and closing boundary.

## Human Review Checklist

- Are extracted items source-bound and tied to page locators?
- Is the non-binding practice-note caveat explicit?
- Are assumption-setting items separated from later mechanics?
- Are calculation and formula-context items kept review-only?
- Are reporting and valuation references separated from companion guidance?
- Are unresolved issues meaningful and not generic placeholders?
- Is the closing boundary easy to spot?
- Are no-promotion, not learner-facing, not app-ready, and not RAG-ready statuses intact?

## Promotion Decision Area

- Keep review-only
- Revise extraction
- Promote selected items to learner-facing draft
- Prepare RAG-ready candidate set
- Prepare app-export candidate set

## Relationship to Other Review Indexes

Review this wave alongside:

- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/model_regulation_xxx_practice_note_review_index.md`

## Notes

The ignored batch outputs for this source remain in `data/work/batches/batch-195/`, `data/work/batches/batch-196/`, and `data/work/batches/batch-197/`. This index is a summary aid only and does not promote any extracted content.
