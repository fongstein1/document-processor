# Regulation 210 Review Index

## Overall Status

- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted
- Source family: `ny_regulations`
- Source title: `Life Insurance and Annuity Non-Guaranteed Elements`
- Source reference: `11 NYCRR Part 48 (Insurance Regulation 210)`
- Source status: active
- Source status note: official adoption text effective March 19, 2018; page 10 is a blank trailing boundary page and should remain boundary context only.
- Planning-layer commit: `7380042`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-186 | pages 1-3; opening title, purpose, scope, and definitions | Opening title, purpose, scope, and definitions slice | Keep the title page and opening definitions together, then stop before the qualification criteria begin. | regulatory_requirement, definition_or_terminology, background_content, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Page locators remain primary; line references should stay visible; blank trailing page is boundary context only. | passed | 7380042 |
| batch-187 | pages 4-6; qualified actuary, board-approved criteria, and non-guaranteed elements | Qualified actuary, criteria, and non-guaranteed elements slice | Keep the qualification criteria together, then stop before filing and records begins. | regulatory_requirement, governance_or_control_expectation, company_or_prudent_estimate_assumption, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Page locators remain primary; line references should stay visible; criteria window should not absorb filing and records. | passed | 7380042 |
| batch-188 | pages 7-9; filing and records closeout | Filing and records closeout slice | Keep the filing and records requirements together and stop before the blank trailing page. | reporting_requirement, documentation_expectation, regulatory_requirement, governance_or_control_expectation, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Page locators remain primary; line references should stay visible; closing boundary should remain explicit. | passed | 7380042 |

## Higher-Caution Areas

- Page locators remain the primary citation anchor for this PDF source.
- The review packets note that line references should be preserved, so exact wording should not be overstated from the summary layer alone.
- The opening title, purpose, scope, and definitions window should stay separate from the qualified actuary and criteria material.
- Qualified actuary and board-approved criteria language should stay separate from the filing and records closeout.
- The closing filing and records slice should remain distinct from the blank trailing page.
- The active regulation text should remain review-only until a later human review explicitly promotes something.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page locators sufficient for review and future re-checking?
- Are requirement, definition, and reporting distinctions correct?
- Are qualified-actuary and board-approved-criteria references treated as governance or control text?
- Are anticipated experience factors and reasonableness references treated as assumption-layer material rather than operationalized guidance?
- Are cross-references to Insurance Regulation 152 and related statutory material mapped without over-interpretation?
- Are the unresolved issues specific enough to help a reviewer decide the next step?
- Are all items still review-only and not promoted?
- Does the blank trailing page remain a boundary note rather than substantive content?
- Does any wording need confirmation against the page image before being treated as exact?

## Promotion Decision Area

- Keep review-only: selected by default
- Revise extraction: placeholder
- Promote selected items to learner-facing draft: placeholder
- Prepare RAG-ready candidate set: placeholder
- Prepare app-export candidate set: placeholder

## Recommended Review Order

1. Opening title, purpose, scope, and definitions
2. Qualified actuary, board-approved criteria, and non-guaranteed elements
3. Filing and records closeout

## Relationship to Other Review Artifacts

- This wave follows the VM-20, supporting VM, VM-21, VM-22, AG, practice-note, and Regulation 141 review-only sequences but remains its own NY-regulation source-family wave.
- It should be reviewed alongside `docs/review/reg141_review_index.md` and `docs/review/valuation_regulation_repository_poc_status.md` for consistent no-promotion posture.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.
