# CIA 2022 Capital and FCT Educational Note Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source status:
- Non-binding practice note
- Educational note / companion guidance
- Jurisdiction: Canada
- Page locators are the primary citation anchor; line references were not expected for this PDF slice

Source file:
- `Practice Notes/222030e.pdf`
- Source reference: Canadian Institute of Actuaries educational note, February 2022
- Confirmed page range: pages 1-20

Higher-caution areas:
- Companion-guidance framing must stay visible because the note is not authoritative regulatory text.
- Opening guidance stays separate from the capital/FCT overview.
- The capital/FCT overview stays separate from the additional guidance.
- Climate, COVID-19, ORSA, reinsurance, and model-use references remain review-only and should not be over-interpreted.
- Appendix material stays separate from any later source family.
- No stable line references were available, so page locators remain the review anchor.

## Batch Table

| Batch ID | Pages / section | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-206 | pp. 1-6 | Opening and background guidance slice | Keep the opening educational-note framing together before the main guidance begins | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | reasonable_with_minor_cautions | Companion-guidance caveat stays visible; opening guidance stays separate from the capital/FCT overview; page locators are the primary anchor | passed | 55b918e |
| batch-207 | pp. 7-11 | Capital and FCT overview slice | Keep the core capital and FCT overview together as one review-only slice | regulatory_requirement, reporting_requirement, documentation_expectation, cross_reference_mapping | reasonable_with_minor_cautions | Capital/FCT overview stays separate from the additional guidance section; page locators are the primary anchor | passed | 55b918e |
| batch-208 | pp. 12-16 | Additional guidance slice | Keep the caution-heavy guidance together while preserving the regulatory and modeling boundary | scenario_or_stochastic_requirement, reinsurance, asset_modeling_judgment, cross_reference_mapping, requires_human_interpretation | reasonable_with_minor_cautions | Climate, COVID-19, ORSA, reinsurance, and model-use references stay review-only; page locators are the primary anchor | passed | 55b918e |
| batch-209 | pp. 17-20 | Appendices and closeout slice | Close the note with the appendix material while keeping the end boundary explicit | cross_reference_mapping, background_content, caveat_or_companion_guidance, boundary_control_window | reasonable_with_minor_cautions | Appendix material stays separate from any later source family; page locators are the primary anchor | passed | 55b918e |

## Human Review Checklist

- Are the extracted items clearly source-bound to the educational note and not treated as binding regulatory text?
- Are page locators sufficient for review, given that stable line references were not available?
- Does each batch keep the companion-guidance caveat visible?
- Are the opening guidance, capital/FCT overview, additional guidance, and appendix material kept in separate review windows?
- Are OSFI, AMF, IFRS 17, and CIA references treated as cross-reference material unless the operational text is captured in the same batch?
- Are unresolved issues specific and useful rather than generic?
- Are all learner-facing, app-ready, and RAG-ready statuses still blocked?

## Promotion Decision Area

- Keep review-only
- Revise extraction
- Promote selected items to learner-facing draft
- Prepare RAG-ready candidate set
- Prepare app-export candidate set

## Relationship to Existing Review Indexes

- `docs/review/model_governance_practice_note_review_index.md`
- `docs/review/life_reinsurance_reserve_credit_practice_note_review_index.md`
- `docs/review/actuarial_memorandum_practice_note_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This source should be reviewed alongside other companion-guidance waves, but it remains distinct from the regulatory guideline and VM chapter indexes.
