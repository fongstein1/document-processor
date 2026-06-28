# AG 43 Review Index

## Overall AG 43 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 44 remains out of scope

AG 43 is Actuarial Guideline XLIII. It was processed as a nine-batch
review-only wave against the active 71-page `AG 43 - CARVM for Variable
Annuities.pdf` guideline. The wave stayed source-bound, used page locators,
and relied on the page-image wording backstop because the text layer is
encoding-noisy and line references were not expected.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-140` | `pp. 1-5` | Background, scope, definitions, and opening principles | Keep the opening guidance narrow; preserve the page-image backstop; do not widen into Appendix 1. | `regulatory_requirement`; `definition_or_terminology`; `reserve_method_structure`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; opening CARVM / scope boundary; AG 44 remains out of scope. | `reasonable_with_minor_cautions` | passed | `dd61736` |
| `batch-141` | `pp. 6-9` | Reserve methodology continuation and effective-date slice | Keep the reserve-methodology follow-through narrow; preserve the page-image backstop; do not widen into Appendix 1. | `regulatory_requirement`; `reserve_method_structure`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; reserve-methodology / effective-date boundary; AG 44 remains out of scope. | `reasonable_with_minor_cautions` | passed | `dd61736` |
| `batch-142` | `pp. 10-19` | Appendix 1 CTE guidance and Appendix 2 reinsurance / reporting issues | Keep the CTE and reinsurance/reporting material together; preserve the page-image backstop; do not widen into Appendix 3. | `regulatory_requirement`; `calculation_structure`; `formula_context`; `reinsurance`; `reporting_requirement`; `documentation_expectation`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; CTE projection boundary; reinsurance/reporting caveat boundary; AG 44 remains out of scope. | `reasonable_with_minor_cautions` | passed | `dd61736` |
| `batch-143` | `pp. 20-28` | Appendix 3 standard scenario requirements | Keep the standard-scenario requirements narrow; preserve the page-image backstop; do not widen into Appendix 4. | `scenario_or_stochastic_requirement`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; standard-scenario boundary; AG 44 remains out of scope. | `reasonable_with_minor_cautions` | passed | `dd61736` |
| `batch-144` | `pp. 29-43` | Appendix 4 alternative methodology and Appendix 5 scenario calibration | Keep the calibration-heavy material together; preserve the page-image backstop; do not widen into Appendix 6. | `scenario_or_stochastic_requirement`; `calculation_structure`; `formula_context`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `governance_or_control_expectation`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; calibration-heavy boundary; AG 44 remains out of scope. | `reasonable_with_minor_cautions` | passed | `dd61736` |
| `batch-145` | `pp. 44-50` | Appendix 6 allocation of aggregate reserves to the contract level | Keep the allocation mechanics separate; preserve the page-image backstop; do not widen into Appendix 7. | `reserve_method_structure`; `calculation_structure`; `formula_context`; `governance_or_control_expectation`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; aggregate-reserve allocation boundary; AG 44 remains out of scope. | `reasonable_with_minor_cautions` | passed | `dd61736` |
| `batch-146` | `pp. 51-58` | Appendix 7 modeling of hedges and Appendix 8 certification requirements | Keep the hedge-modeling and certification material together; preserve the page-image backstop; do not widen into Appendix 9. | `hedging_or_risk_mitigation`; `regulatory_requirement`; `documentation_expectation`; `governance_or_control_expectation`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; hedging / certification boundary; AG 44 remains out of scope. | `reasonable_with_minor_cautions` | passed | `dd61736` |
| `batch-147` | `pp. 59-67` | Appendix 9 contractholder behavior and Appendix 10 prudent-estimate mortality opener | Keep the behavior and mortality guidance together; preserve the page-image backstop; do not widen into the mortality tables. | `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `documentation_expectation`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; behavior / mortality-assumption boundary; AG 44 remains out of scope. | `reasonable_with_minor_cautions` | passed | `dd61736` |
| `batch-148` | `pp. 68-71` | Appendix 10 continuation, mortality table material, and closing boundary | Keep the mortality-table tail and closing boundary together; preserve the page-image backstop; stop cleanly at AG 44. | `definition_or_terminology`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; mortality-table tail and AG 44 closing boundary; AG 44 remains out of scope. | `reasonable_with_minor_cautions` | passed | `dd61736` |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is
  noisy / encoded.
- Line references were not available, so page locators remain the primary
  review anchor.
- The opening guidance, reserve-methodology continuation, CTE projection, and
  reinsurance/reporting language should stay review-only until a human
  confirms the wording against the page image.
- The standard-scenario, calibration-heavy, hedge-modeling, and mortality
  tail slices should remain separate from each other.
- AG 44 remains out of scope and should not be blended into this wave.
- Cross references to CARVM, CTE, Appendix 1 through Appendix 11, and the
  mortality table material should be mapped but not over-interpreted.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are reserve mechanics separated from background content?
- Are CTE, reinsurance, reporting, calibration, hedge, and mortality passages
  separated from one another?
- Are cross references mapped but not over-interpreted?
- Is the AG 44 boundary kept outside this wave?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-140 first because it establishes the opening guidance,
   scope, definitions, and principles.
2. Then batch-141 because it finishes the reserve-methodology opener and
   effective-date language.
3. Then batch-142 because it carries the CTE, reinsurance, and reporting
   caveats.
4. Then batch-143 because it isolates the standard-scenario requirements.
5. Then batch-144 because it is the calibration-heavy appendix pair.
6. Then batch-145 because it handles aggregate-reserve allocation.
7. Then batch-146 because it covers hedging and certification.
8. Then batch-147 because it covers behavior and the mortality opener.
9. Finally batch-148 because it closes the mortality-table tail and the AG 44
   boundary.

## Relationship to Other Review Indexes

- AG 42 review index: `docs/review/ag42_review_index.md`
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 43 should be read alongside AG 42 and the repository POC summary as a
  summary-only handoff, not as promoted content.
- AG 43 self-review note: `docs/review/ag43_self_review.md`

## Review Notes

- The AG 43 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave
  because line references were not expected.
- The source remains active and AG 44 remains out of scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and
  `not promoted` all remain intact.
