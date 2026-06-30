# C3 Phase 2 Practice Note Review Index

Overall status: review-only, not learner-facing, not app-ready, not RAG-ready,
not promoted.

Source status: non-binding practice note / companion guidance.

Issuing body: American Academy of Actuaries.

Primary source:
`Practice Notes/AAA - C3 Phase 2 - Sep 2006 - life_c3.8.pdf`

Page range confirmed for this wave: pages 1-93.

This source is intentionally retained as review-only companion guidance. The
non-binding caveat stays visible, and page locators are the primary citation
anchor. Line references are not expected for this PDF slice. A page-image
wording backstop should stay visible because the text layer is noisy in places.

## Batch Table

| Batch ID | Pages / section | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-222 | pages 1-12 | Opening guidance and products-covered slice | Keep the title pages, disclaimer, products covered, and common practice guidance together before the model-comparison section begins. | non_binding_practice_note, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | Non-binding caveat stays explicit; page locators are the main anchor; keep the opening slice separate from model-comparison material. | reasonable_with_minor_cautions | Passed after rerun | pending |
| batch-223 | pages 13-25 | VA RBC vs VACARVM differences and model granularity | Keep the comparison and starting-asset language together while the model-difference discussion remains in view. | regulatory_requirement, calculation_structure, formula_context, cross_reference_mapping, requires_human_interpretation | Comparison layer stays source-bound; do not overread it as a binding rule; page-image wording backstop remains visible. | reasonable_with_minor_cautions | Passed after rerun | pending |
| batch-224 | pages 26-33 | Scenario generation, calibration, and fund modeling | Keep the scenario-generation and calibration slice narrow before the assumption section begins. | scenario_or_stochastic_requirement, asset_modeling_judgment, formula_context, cross_reference_mapping, requires_human_interpretation | Calibration and fund-modeling guidance stays review-only; page locators are primary; keep the section boundary clear. | reasonable_with_minor_cautions | Passed after rerun | pending |
| batch-225 | pages 34-40 | Prudent-best-estimate and assumption framework | Keep the prudent-best-estimate slice and the core assumption-setting framework together. | prescribed_assumption, company_or_prudent_estimate_assumption, calculation_structure, cross_reference_mapping, requires_human_interpretation | Assumption-setting language stays source-bound; do not generalize it into a universal rule; page-image backstop remains visible. | reasonable_with_minor_cautions | Passed after rerun | pending |
| batch-226 | pages 41-50 | Revenue-sharing and interpolation closeout | Keep the valuation-date bridge, revenue-sharing closeout, and interpolation mechanics contiguous. | calculation_structure, formula_context, boundary_control_window, cross_reference_mapping, requires_human_interpretation | Interpolation and informed-projection material stays review-only; do not recast it as a promotion candidate. | reasonable_with_minor_cautions | Passed after rerun | pending |
| batch-227 | pages 51-60 | Alternative Methodology and Standard Scenario opener | Keep the AM / Standard Scenario relationship readable before the hedge and reinsurance tail begins. | reserve_method_structure, calculation_structure, definition_or_terminology, boundary_control_window, requires_human_interpretation | The AM / Standard Scenario slice is intentionally narrow; do not widen into the hedge tail; page locators remain primary. | reasonable_with_minor_cautions | Passed after rerun | pending |
| batch-228 | pages 61-70 | Standard Scenario tail, reinsurance, and hedging entry | Keep the reinsurance and hedging mechanics contiguous and stop before the certification layer. | reinsurance, hedging_or_risk_mitigation, scenario_or_stochastic_requirement, calculation_structure, cross_reference_mapping | Reinsurance / hedge-credit treatment stays review-only; the boundary before certification remains explicit. | reasonable_with_minor_cautions | Passed after rerun | pending |
| batch-229 | pages 71-80 | Certification and documentation | Keep the C-3 Phase I consistency discussion, certification, and documentation controls together. | reporting_requirement, documentation_expectation, governance_or_control_expectation, cross_reference_mapping, requires_human_interpretation | Certification and documentation remain review-only; do not merge them into a promotional output. | reasonable_with_minor_cautions | Passed after rerun | pending |
| batch-230 | pages 81-93 | Peer review, glossary, appendix Q&A, and closeout | End the source cleanly at page 93 and keep the appendix closeout from widening the source family. | background_content, caveat_or_companion_guidance, boundary_control_window, cross_reference_mapping, non_binding_practice_note | Appendix and glossary material stay summary-only; the closing boundary remains explicit. | reasonable_with_minor_cautions | Passed after rerun | pending |

## Higher-Caution Areas

- Front matter and disclaimer language must stay visibly non-binding.
- VA RBC vs VACARVM comparison passages can blur guidance and implementation,
  so the comparison layer should remain source-bound.
- Scenario-generation and calibration language should not be over-interpreted
  as a universal modeling prescription.
- Prudent-best-estimate assumptions and revenue-sharing / interpolation bridges
  need to stay separate from the later alternative-methodology material.
- The AM / Standard Scenario boundary is narrow and should not pull in the
  hedging tail.
- Reinsurance and hedging material should remain contiguous and review-only.
- Certification and documentation language should stay separated from any
  learner-facing interpretation.
- The appendix, glossary, and Q&A closeout should remain summary-only.

## Human Review Checklist

- Are the extracted passages source-bound and page-located?
- Are requirement-like passages separated from background and caveat text?
- Are model comparisons kept distinct from binding instructions?
- Are scenario and calibration passages kept distinct from assumption-setting
  passages?
- Are interpolation and valuation-date bridge passages kept narrow?
- Are reinsurance and hedging passages kept together without widening into the
  certification layer?
- Are documentation and certification passages retained as review-only
  companion guidance?
- Are any passages candidates for later promotion clearly marked as not
  promoted yet?
- Are page-image wording backstops visible wherever the text layer is noisy?

## Promotion Decision Area

- Keep review-only.
- Revise extraction.
- Promote selected items to learner-facing draft.
- Prepare RAG-ready candidate set.
- Prepare app-export candidate set.

## Relationship to Existing Review Indexes

This practice note should be reviewed alongside:

- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/actuarial_memorandum_practice_note_review_index.md`
- `docs/review/model_governance_practice_note_review_index.md`
- `docs/review/life_reinsurance_reserve_credit_practice_note_review_index.md`
- `docs/review/asset_adequacy_analysis_practice_note_review_index.md`
- `docs/review/cia2022_capital_fct_educational_note_review_index.md`
- `docs/review/cia2023_financial_condition_testing_educational_note_review_index.md`

The source remains non-binding companion guidance, and the page-image wording
backstop should stay visible whenever a batch references the text layer.
