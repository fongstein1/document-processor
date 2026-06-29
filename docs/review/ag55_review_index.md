# AG 55 Review Index

## Overall AG 55 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

AG 55 is Actuarial Guideline LV. It was processed as a nine-batch review-only wave against the active 268-paragraph `AG 55-Reinsurance AAT as adopted by LATF-20250610.docx` guidance. The wave stayed source-bound, used paragraph locators as the primary anchor, and preserved line references because this is a text-based Word source. The opening disclaimer states that the guideline has not yet been adopted by the NAIC committees, so that wording must remain a review-only caveat rather than a repeal signal.

## Batch Table

| Batch ID | Selected paragraphs/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-171` | `paragraphs 1-18` | Opening disclaimer, background, and effective date | Keep the disclaimer, background, and effective-date guidance together as one narrow review-only slice and stop before scope begins. | `regulatory_requirement`; `background_content`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | The pending committee-adoption disclaimer should remain visible as a review-only caveat. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-172` | `paragraphs 19-38` | Scope and applicability refinement | Keep the scope and applicability material together and stop before definitions begin. | `regulatory_requirement`; `definition_or_terminology`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Scope and applicability should remain separate from the definitions section. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-173` | `paragraphs 39-75` | Definitions and core terms | Keep the definitions together as one review-only slice and stop before risk identification begins. | `definition_or_terminology`; `reinsurance`; `reserve_method_structure`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Definitions and core terms should remain separate from later modeling guidance. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-174` | `paragraphs 76-114` | Risk identification and analysis/documentation expectations | Keep the risk-identification language separate from the later cash-flow testing details. | `regulatory_requirement`; `reinsurance`; `documentation_expectation`; `governance_or_control_expectation`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Risk identification and documentation expectations should remain separate from cash-flow testing details. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-175` | `paragraphs 115-161` | Cash-flow testing details | Keep the starting-asset and projection guidance together, but do not absorb attribution and aggregation. | `regulatory_requirement`; `calculation_structure`; `formula_context`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `asset_modeling_judgment`; `reinsurance`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Cash-flow testing details should remain separate from attribution and aggregation. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-176` | `paragraphs 162-188` | Attribution analysis and aggregation | Keep the attribution and aggregation language together as a single review window and stop before reporting begins. | `reporting_requirement`; `documentation_expectation`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Attribution analysis and aggregation should remain separate from the reporting section. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-177` | `paragraphs 190-224` | Reporting, treaty documentation, and assumption information | Keep the reporting and treaty documentation material together and stop before the results/template material becomes the focus. | `reporting_requirement`; `documentation_expectation`; `governance_or_control_expectation`; `reinsurance`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Reporting, treaty documentation, and assumption information should remain separate from the results window. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-178` | `paragraphs 225-255` | Cash-flow results, attribution, risk identification, and templates | Keep the results, attribution, risk-identification, and template material together, but do not absorb the appendix scenario excerpt. | `reporting_requirement`; `documentation_expectation`; `calculation_structure`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Results and template material should remain separate from the appendix scenario excerpt. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-179` | `paragraphs 258-268` | Appendix 1 and closing boundary | Keep the appendix separate from the main body so the closing boundary remains explicit. | `regulatory_requirement`; `formula_context`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | The appendix and closing boundary should remain review-only and end the AG 55 wave. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |

## Higher-Caution Section

- The pending committee adoption disclaimer should stay visible and should not be interpreted as a repeal signal.
- The scope and applicability slice should remain separate from the definitions section.
- The definitions slice should remain separate from the risk-identification and modeling sections.
- The risk-identification and documentation window should stay separate from the cash-flow testing details.
- The cash-flow testing details should stay separate from attribution and aggregation.
- The reporting / treaty documentation / assumption window should stay separate from the results and templates window.
- The results and template window should stay separate from the appendix scenario excerpt.
- The appendix should remain a closing boundary rather than a new review window.
- Paragraph locators remain the primary anchor because line references were preserved for this text-based source.
- AG 54 remains the neighboring source wave and should be reviewed alongside this AG 55 handoff.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are paragraph locators sufficient because line references were preserved?
- Is the pending committee-adoption disclaimer clearly treated as a review-only caveat?
- Are requirement vs explanation distinctions correct?
- Are definitions kept separate from risk-identification and modeling guidance?
- Are cash-flow testing details kept separate from attribution and aggregation?
- Are reporting requirements separated from documentation expectations?
- Are appendix materials kept separate from the main body?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-171 first because it establishes the disclaimer, background, and effective date.
2. Review batch-172 second because it locks the scope and applicability boundary.
3. Review batch-173 third because it captures the guideline’s core definitions.
4. Review batch-174 and batch-175 next because they carry the modeling and documentation mechanics.
5. Review batch-176 through batch-178 after that because they cover attribution, reporting, and results.
6. Review batch-179 last because it closes the source with the appendix boundary.

## Relationship to Other Review Indexes

- AG 54 review index: `docs/review/ag54_review_index.md`
- AG 54 self-review note: `docs/review/ag54_self_review.md`
- AG 55 self-review note: `docs/review/ag55_self_review.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`

## Review Notes

- The AG 55 review packet is intentionally narrow and review-only.
- The paragraph-locator backstop stays visible because line references were preserved.
- line references are preserved for this text source.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and `not promoted` all remain intact.
- AG 55 ended at the appendix boundary, and no later AG source was selected in this wave.
