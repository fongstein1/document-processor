# VM-21 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- not promoted
- VM-22 explicitly excluded

This tracked index summarizes the ignored review packets for controlled
VM-21 batches `batch-022` through `batch-037`. It is a handoff summary only.
The underlying batch outputs remain in `data/work/batches/` and are not
promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hashes below refer to the tracked commit that
recorded the batch group or completion refresh, not to the ignored working
files themselves.

## Overall VM-21 Extraction Status

- The controlled VM-21 sequence is complete.
- Every completed batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is boundary control, not content approval.

## Batch Table

| Batch | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-022` | `pp. 143-147`; `VM-21: Background` | Background and principles | Keeps the chapter frame review-only until the operational sections arrive | `core_vm_course`, `background_content`, `cross_reference_mapping`, `requires_human_interpretation` | The background slice points into later SR, hedging, and assumption sections, so it should stay review-only until the operational text is captured. | Passed | `0c6c68f` |
| `batch-023` | `pp. 148-151`; `VM-21: Scope and Effective Date` | Scope and effective date | Keeps applicability and phase-in language separate from mechanics | `core_vm_course`, `regulatory_requirement`, `boundary_control_window`, `cross_reference_mapping` | The scope pages contain both applicability and phase-in language, which should remain review-only until the mechanics batches are built. | Passed | `0c6c68f` |
| `batch-024` | `pp. 151-152`; `VM-21: Reserve Methodology` | Reserve methodology | Keeps the aggregate-reserve rule and the alternative-method boundary separate from later SR mechanics | `core_vm_course`, `reserve_method_structure`, `calculation_structure`, `cross_reference_mapping` | The reserve methodology slice contains the chapter-level aggregate reserve rule and the alternative-method boundary, which should stay review-only. | Passed | `0c6c68f` |
| `batch-025` | `pp. 153-159`; `VM-21: Determination of the SR (projection entry)` | SR projection entry | Starts SR mechanics with the projection layer and starting-asset context | `core_vm_course`, `calculation_structure`, `formula_context`, `cross_reference_mapping`, `requires_human_interpretation` | The SR projection entry contains the first mechanics layer and depends on later asset and hedge treatment, so it should stay review-only. | Passed | `0c6c68f` |
| `batch-026` | `pp. 160-165`; `VM-21: Determination of the SR (NAER, direct iteration, annuitization, ASOPs)` | SR asset and iteration mechanics | Separates SR asset mechanics and iteration logic from the earlier projection layer | `core_vm_course`, `asset_modeling_judgment`, `formula_context`, `requires_human_interpretation`, `cross_reference_mapping` | The SR mechanics at this point include asset and annuitization judgments that require human review before any promotion can be considered. | Passed | `7ba609e` |
| `batch-027` | `pp. 166-170`; `VM-21: Reinsurance Ceded and Section 6 opener` | Reinsurance ceded and Section 6 entry | Keeps the reinsurance opener separate from the prescribed projection details | `core_vm_course`, `reinsurance`, `cross_reference_mapping`, `reporting_requirement`, `requires_human_interpretation` | This slice relies on Section 6 for the actual prescribed projection treatment, so it should remain review-only until that section is added. | Passed | `7ba609e` |
| `batch-028` | `pp. 171-175`; `VM-21: Section 6 assumptions and withdrawal/annuitization cohorts` | Section 6 assumptions and cohort mechanics | Keeps the prescribed-assumption layer narrow and reviewable | `core_vm_course`, `prescribed_assumption`, `company_or_prudent_estimate_assumption`, `formula_context`, `requires_human_interpretation` | The Section 6 assumptions involve prescribed values and cohort simplification rules that should remain review-only. | Passed | `7ba609e` |
| `batch-029` | `pp. 176-181`; `VM-21: Section 6 ITM tables and look-ups` | Section 6 ITM tables and look-ups | Keeps the tables on the Section 7 boundary instead of blending them forward | `core_vm_course`, `formula_context`, `calculation_structure`, `boundary_control_window`, `requires_human_interpretation` | The Section 6 tables sit directly on the Section 7 boundary, so the slice should remain review-only. | Passed | `7ba609e` |
| `batch-030` | `pp. 182-188`; `VM-21: Alternative Methodology (general and contract-by-contract application)` | Alternative methodology general layer | Opens Section 7 without pulling in the factor tables too early | `core_vm_course`, `calculation_structure`, `definition_or_terminology`, `cross_reference_mapping`, `requires_human_interpretation` | The alternative-methodology opener depends on VM-C cross-references and should stay review-only until the factor tables are added. | Passed | `8e1b144` |
| `batch-031` | `pp. 189-198`; `VM-21: Alternative Methodology factor tables and product characteristics` | Alternative methodology tables and product characteristics | Keeps the calibration-heavy tables separate from the scenario-generation chapter | `core_vm_course`, `formula_context`, `asset_modeling_judgment`, `requires_human_interpretation`, `cross_reference_mapping` | The factor tables rely on calibration and model judgments that should stay review-only until the surrounding section context is reviewed. | Passed | `8e1b144` |
| `batch-032` | `pp. 199-201`; `VM-21: Scenario Generation` | Scenario generation | Separates stochastic model setup from the later hedging section | `core_vm_course`, `scenario_or_stochastic_requirement`, `formula_context`, `cross_reference_mapping`, `requires_human_interpretation` | The scenario-generation slice is the chapter entry point for stochastic modeling and should remain review-only. | Passed | `8e1b144` |
| `batch-033` | `pp. 202-208`; `VM-21: Modeling of Hedges Under a Future Non-Index Credit Hedging Strategy` | Hedging / risk mitigation | Keeps hedging strategy and documentation language review-only | `core_vm_course`, `hedging_or_risk_mitigation`, `documentation_expectation`, `requires_human_interpretation`, `cross_reference_mapping` | The hedging section contains risk-mitigation judgment and documentation expectations that should remain review-only. | Passed | `8e1b144` |
| `batch-034` | `pp. 209-212`; `VM-21: Contract Holder Behavior Assumptions` | Contract holder behavior assumptions | Keeps behavior assumptions and prudent-estimate thinking narrow | `core_vm_course`, `company_or_prudent_estimate_assumption`, `requires_human_interpretation`, `cross_reference_mapping` | The behavior assumptions depend on prudent-estimate judgment and sensitivity analysis and should stay review-only. | Passed | `8e1b144` |
| `batch-035` | `pp. 213-218`; `VM-21: Guidance and Requirements for Setting Prudent Estimate Mortality Assumptions` | Mortality assumptions | Keeps mortality credibility, improvement, and margin treatment together but review-only | `core_vm_course`, `prescribed_assumption`, `company_or_prudent_estimate_assumption`, `requires_human_interpretation` | The mortality section relies on credibility and prescribed assumption judgments that should stay review-only. | Passed | `8e1b144` |
| `batch-036` | `pp. 218-221`; `VM-21: Other Guidance and Requirements for Assumptions` | Remaining assumption guidance | Keeps margin, sensitivity, and expense treatment together without pulling in the allocation boundary | `core_vm_course`, `company_or_prudent_estimate_assumption`, `documentation_expectation`, `requires_human_interpretation` | The remaining assumption guidance mixes margin, sensitivity, and expense treatment, so it should stay review-only. | Passed | `8e1b144` |
| `batch-037` | `pp. 222-225`; `VM-21: Allocation of the Aggregate Reserves to the Contract Level` | Allocation and closing boundary | Closes the chapter before VM-22 begins | `core_vm_course`, `regulatory_requirement`, `cross_reference_mapping`, `boundary_control_window` | The chapter ends immediately after the allocation language, so the closing boundary should stay review-only. | Passed | `8e1b144` |

## Higher-Caution Section

- Scope, effective date, and applicability language must stay separate from
  mechanics.
- Reserve methodology and aggregate reserve framing are chapter-level
  structure, not a license to merge forward into later mechanics.
- SR projection mechanics are the first high-risk calculation layer and need
  careful boundary control.
- Asset and iteration mechanics introduce human actuarial judgment and should
  stay review-only.
- Reinsurance treatment depends on downstream prescribed projection context
  and should not be overread.
- Prescribed assumptions and prudent-estimate assumptions should remain
  distinct in review output.
- ITM tables and lookups sit on the Section 7 boundary and should not be
  merged forward.
- Alternative methodology tables are calibration-heavy and carry model
  judgment risk.
- Scenario generation is the stochastic entry point and should remain
  review-only.
- Hedging and risk-mitigation documentation carries interpretation risk and
  should stay review-only.
- Contract holder behavior assumptions are prudent-estimate material and need
  human review.
- Mortality, credibility, improvement, and margins are high-caution
  assumptions and should stay review-only.
- Allocation of aggregate reserves closes the chapter and must stop before
  VM-22.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page or line references sufficient for each item?
- Are requirement versus explanation distinctions correct?
- Are formula labels separated from formula interpretation?
- Are prescribed assumptions separated from company or prudent-estimate
  assumptions?
- Are stochastic or scenario requirements separated from asset-modeling
  judgment?
- Are hedging and risk-mitigation items properly flagged?
- Are cross-references mapped but not over-interpreted?
- Are VM-20 / VM-30 / VM-31 / VM-G / VM-C / VM-M references review-only
  unless captured with operational text?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

None of the boxes above are selected by default. Any promotion decision
belongs in a later human review step, not in the completed review-only
batches.

## Recommended Review Order

1. Scope and reserve methodology first.
2. SR projection and asset mechanics.
3. Assumptions and ITM tables.
4. Alternative methodology and scenario generation.
5. Hedging and behavior assumptions.
6. Mortality and remaining assumption guidance.
7. Allocation and closing boundary.

## Relationship to Other Review Indexes

- VM-20 has a separate review index at
  `docs/review/vm20_review_index.md`.
- The supporting-wave review index lives at
  `docs/review/supporting_vm_review_index.md`.
- VM-21 should be reviewed alongside both of those handoff summaries so the
  chapter-specific boundaries stay aligned.

## Review Notes

- The underlying batch review packets remain the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
