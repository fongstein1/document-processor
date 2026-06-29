# Regulation 141 Review Index

## Overall Status

- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted
- Source family: `ny_regulations`
- Source title: `Commutation of Reinsurance Agreements`
- Source reference: `11 NYCRR Part 128 (Regulation 141)`
- Source status: active
- Source status note: official compilation snapshot current with amendments included in the source file; live amendment status remains review-only unless separately confirmed

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-180 | pages 1-3; opening title, purpose, applicability | Opening title, purpose, and applicability slice | Keep the official-compilation header and purpose/applicability text together, then stop before definitions begin. | regulatory_requirement, background_content, reinsurance, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Page locators remain primary; line references should stay visible; opening boundary should remain separate from later sections. | passed | 7a0dc2e |
| batch-181 | pages 4-8; definitions, general provisions, requirements | Definitions, general provisions, and requirements slice | Keep the definitions and general provisions together, then stop before procedures begins. | regulatory_requirement, definition_or_terminology, reinsurance, governance_or_control_expectation, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Page locators remain primary; line references should stay visible; definitions window should not absorb procedures. | passed | 7a0dc2e |
| batch-182 | pages 9-11; procedures and reporting closeout | Procedures and reporting closeout slice | Keep the procedures and reporting material together and stop at the end of the source. | reporting_requirement, documentation_expectation, governance_or_control_expectation, reinsurance, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Page locators remain primary; line references should stay visible; closing boundary should remain explicit. | passed | 7a0dc2e |

## Higher-Caution Areas

- Page locators remain the primary citation anchor for this PDF source.
- The review packets note that line references should be preserved, so exact wording should not be overstated from the summary layer alone.
- The opening title/purpose/applicability window should stay separate from the definitions and procedures material.
- Definitions, general provisions, and requirements should stay separate from the procedures and reporting closeout.
- The closing boundary should remain explicit so later NY regulation files are not absorbed into this source.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page locators sufficient for review and future re-checking?
- Are requirement, definition, and reporting distinctions correct?
- Are superintendent-approval and objection references treated as governance or control text?
- Are cross-references to insurance law or related statutory provisions mapped without over-interpretation?
- Are the unresolved issues specific enough to help a reviewer decide the next step?
- Are all items still review-only and not promoted?
- Does any wording need confirmation against the page image before being treated as exact?

## Promotion Decision Area

- Keep review-only: selected by default
- Revise extraction: placeholder
- Promote selected items to learner-facing draft: placeholder
- Prepare RAG-ready candidate set: placeholder
- Prepare app-export candidate set: placeholder

## Recommended Review Order

1. Opening title, purpose, and applicability
2. Definitions, general provisions, and requirements
3. Procedures and reporting closeout

## Relationship to Other Review Artifacts

- This wave follows the VM-20, supporting VM, VM-21, and VM-22 review-only sequences but is kept separate as its own NY regulation source family.
- It should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md` and the broader review handoff set for consistent no-promotion posture.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.

