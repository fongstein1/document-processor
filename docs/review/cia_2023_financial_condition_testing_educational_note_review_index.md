# CIA 2023 Financial Condition Testing Educational Note Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source status:
- Educational note
- Non-binding practice note
- Educational-note / companion guidance
- Jurisdiction: Canada
- Page locators are the primary citation anchor; stable line references were not expected for this PDF slice

Source file:
- `Practice Notes/223010e.pdf`
- Source reference: Canadian Institute of Actuaries educational note, January 2023
- Confirmed page range: pages 1-59

Higher-caution areas:
- Companion-guidance framing must stay visible because the note is not authoritative regulatory text.
- Opening guidance stays separate from the forecast/scenario work.
- Forecast period, reverse stress testing, going concern framing, and management actions remain review-only and should not be over-interpreted as binding text.
- Modelling considerations and enterprise assumptions remain separate from reporting guidance.
- Reporting and results material stays separate from the appendices.
- Appendix A life-insurer risk categories stay separate from Appendix B/C property-and-casualty material.
- No stable line references were available, so page locators remain the review anchor.

## Batch Table

| Batch ID | Pages / section | Topic | Boundary rationale | Extraction categories | Self-review | Unresolved issues / review concerns | Validation | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-210 | pp. 1-8 | Opening and method overview slice | Keep the front matter, introduction, and method overview together before the scenario work begins | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | reasonable_with_minor_cautions | Companion-guidance caveat stays visible; opening guidance stays separate from the forecast and scenario sections; page locators are the primary anchor | passed | pending |
| batch-211 | pp. 9-17 | Forecast period, scenarios, and management actions slice | Keep the forecast horizon, reverse stress testing, going concern framing, and management actions together as one review-only slice | scenario_or_stochastic_requirement, company_or_prudent_estimate_assumption, cross_reference_mapping, requires_human_interpretation | reasonable_with_minor_cautions | Forecast and scenario guidance remains review-only; page locators are the primary anchor; management-actions discussion should not widen into modelling or reporting | passed | pending |
| batch-212 | pp. 18-23 | Modelling considerations and assumptions slice | Keep the model-design and assumption framework together without widening into reporting or appendices | definition_or_terminology, calculation_structure, formula_context, asset_modeling_judgment, cross_reference_mapping | reasonable_with_minor_cautions | Model-design guidance stays separate from reporting; page locators are the primary anchor | passed | pending |
| batch-213 | pp. 24-31 | Reporting and results slice | Keep the reporting and results material together and stop cleanly before the appendix deep dive | reporting_requirement, documentation_expectation, governance_or_control_expectation, cross_reference_mapping | reasonable_with_minor_cautions | Reporting and results material stays separate from the appendix risk-category material; page locators are the primary anchor | passed | pending |
| batch-214 | pp. 32-45 | Appendix A - life insurers slice | Keep the life-insurer risk-category appendix together as the main life-focused caution slice | scenario_or_stochastic_requirement, reinsurance, asset_modeling_judgment, cross_reference_mapping, requires_human_interpretation | reasonable_with_minor_cautions | Appendix A stays review-only; page locators are the primary anchor; do not merge life-insurer risk categories into the P&C appendix | passed | pending |
| batch-215 | pp. 46-59 | Appendix B/C and closeout slice | Keep the P&C appendix material and closeout together while preserving the end boundary | scenario_or_stochastic_requirement, reinsurance, asset_modeling_judgment, cross_reference_mapping, boundary_control_window, requires_human_interpretation | reasonable_with_minor_cautions | Appendix B/C stays separate from any later source family; page locators are the primary anchor; closeout stays explicit | passed | pending |

## Human Review Checklist

- Are the extracted items clearly source-bound to the educational note and not treated as binding regulatory text?
- Are page locators sufficient for review, given that stable line references were not available?
- Does each batch keep the companion-guidance caveat visible?
- Are the opening guidance, forecast/scenario work, modelling considerations, reporting material, and appendix material kept in separate review windows?
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
- `docs/review/cia_2022_capital_fct_educational_note_review_index.md`
- `docs/review/valuation_regulation_repository_poc_status.md`

This source should be reviewed alongside other companion-guidance waves, but it remains distinct from the regulatory guideline and VM chapter indexes.
