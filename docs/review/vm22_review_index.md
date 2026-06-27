# VM-22 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted
- not promoted

This tracked index summarizes the ignored review packets for controlled
VM-22 batches `batch-038` through `batch-054`. It is a handoff summary only.
The underlying batch outputs remain in `data/work/batches/` and are not
promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hashes below refer to the tracked commit that
recorded the batch block or the final VM-22 state refresh, not to the ignored
working files themselves.

## Overall VM-22 Extraction Status

- The controlled VM-22 sequence is complete.
- Every completed batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is boundary control, not content approval.

## Batch Table

| Batch | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-038` | `pp. 227-231`; `VM-22: Background and Scope` | Background and scope | Keeps the chapter frame and early applicability rules separate from the later mechanics | `background_content`, `boundary_control_window`, `core_vm_course`, `cross_reference_mapping`, `regulatory_requirement` | The background slice points into later reserve, hedging, and assumption sections, so it should stay review-only until the operational text is captured. | Passed | `94f1b61` |
| `batch-039` | `pp. 232-237`; `VM-22: Reserve Methodology` | Reserve methodology | Keeps the aggregate reserve structure and timing limit separate from the later mechanics | `boundary_control_window`, `calculation_structure`, `core_vm_course`, `cross_reference_mapping`, `reserve_method_structure` | The reserve-method slice establishes the aggregate reserve structure and should remain review-only until the later projection mechanics are added. | Passed | `94f1b61` |
| `batch-040` | `pp. 238-242`; `VM-22: Determination of the DR and SR (projection entry)` | Projection entry | Keeps the projection layer and initial cash-flow setup separate from later asset work | `calculation_structure`, `core_vm_course`, `cross_reference_mapping`, `formula_context`, `requires_human_interpretation` | The initial projection layer depends on later asset and hedging treatment, so it should stay review-only. | Passed | `94f1b61` |
| `batch-041` | `pp. 243-247`; `VM-22: Determination of the DR and SR (asset projection and NAER)` | Asset projection and NAER | Keeps asset projection and iteration context separate from the prior projection entry | `asset_modeling_judgment`, `core_vm_course`, `cross_reference_mapping`, `formula_context`, `requires_human_interpretation` | The asset-projection slice introduces NAER, borrowing, and annuitization context that require human review before any promotion. | Passed | `94f1b61` |
| `batch-042` | `pp. 248-250`; `VM-22: Reinsurance` | Reinsurance | Keeps ceded / pre-ceded reserve treatment separate from Section 6 mechanics | `core_vm_course`, `cross_reference_mapping`, `reinsurance`, `requires_human_interpretation` | The reinsurance slice defines ceded and pre-ceded reserve treatment and should stay review-only until later mechanics are in view. | Passed | `94f1b61` |
| `batch-043` | `pp. 251-253`; `VM-22: Requirements for the Standard Projection Amount (overview)` | Standard projection overview | Keeps the CTEPA overview and aggregation framing separate from the detailed tables | `calculation_structure`, `core_vm_course`, `cross_reference_mapping`, `formula_context` | The overview introduces the standard projection amount structure without completing the later detail blocks. | Passed | `974c091` |
| `batch-044` | `pp. 254-257`; `VM-22: Requirements for the Standard Projection Amount (contract mechanics)` | Contract mechanics | Keeps GAPV, partial withdrawals, and contract-type mechanics narrow | `company_or_prudent_estimate_assumption`, `core_vm_course`, `prescribed_assumption`, `reinsurance`, `requires_human_interpretation` | Contract-type mechanics, including GAPV and partial withdrawals, need human review before any promotion can be considered. | Passed | `974c091` |
| `batch-045` | `pp. 258-261`; `VM-22: Requirements for the Standard Projection Amount (lapse and rate factors)` | Lapse and rate factors | Keeps the lapse rules and factor tables separate from the mortality-table block | `boundary_control_window`, `core_vm_course`, `formula_context`, `prescribed_assumption` | The lapse and rate-factor tables sit on a boundary that should remain review-only. | Passed | `974c091` |
| `batch-046` | `pp. 262-267`; `VM-22: Requirements for the Standard Projection Amount (mortality tables I)` | Mortality tables I | Keeps the first mortality-table block narrow and reviewable | `core_vm_course`, `cross_reference_mapping`, `formula_context`, `prescribed_assumption` | The first mortality-table block is formula-heavy and should remain review-only until the surrounding context is reviewed. | Passed | `974c091` |
| `batch-047` | `pp. 268-279`; `VM-22: Requirements for the Standard Projection Amount (mortality tables II and boundary)` | Mortality tables II and closing boundary | Finishes the mortality tables and stops at the Section 7 boundary | `boundary_control_window`, `core_vm_course`, `formula_context`, `prescribed_assumption`, `requires_human_interpretation` | The mortality tables and group-annuity guidance end at the Section 7 boundary and should stay review-only. | Passed | `974c091` |
| `batch-048` | `pp. 280-286`; `VM-22: Stochastic Exclusion and Single Scenario Testing` | Stochastic exclusion tests | Keeps the stochastic exclusion and single-scenario framework separate from scenario generation | `core_vm_course`, `cross_reference_mapping`, `formula_context`, `requires_human_interpretation`, `scenario_or_stochastic_requirement` | The stochastic-exclusion framework is the chapter entry point for Section 7 testing and should remain review-only. | Passed | `7fe8549` |
| `batch-049` | `pp. 287-290`; `VM-22: Scenario Generation` | Scenario generation | Keeps the prescribed generators and non-prescribed option separate from hedging | `core_vm_course`, `cross_reference_mapping`, `formula_context`, `scenario_or_stochastic_requirement` | The scenario-generation slice contains both prescribed and non-prescribed generator language and should stay review-only. | Passed | `7fe8549` |
| `batch-050` | `pp. 291-297`; `VM-22: Modeling Hedges under a Future Non-Index Credit Hedging Strategy` | Hedging / risk mitigation | Keeps hedging strategy and documentation language review-only | `core_vm_course`, `documentation_expectation`, `hedging_or_risk_mitigation`, `requires_human_interpretation` | The hedging slice introduces a future non-index credit hedging strategy and related documentation expectations that require review. | Passed | `7fe8549` |
| `batch-051` | `pp. 298-304`; `VM-22: Guidance and Requirements for Setting Contract Holder Behavior Prudent Estimate Assumptions` | Behavior assumptions | Keeps behavior assumptions and eligibility / termination logic narrow | `company_or_prudent_estimate_assumption`, `core_vm_course`, `cross_reference_mapping`, `requires_human_interpretation` | The behavior-assumption framework depends on prudent-estimate judgment and should stay review-only. | Passed | `7fe8549` |
| `batch-052` | `pp. 305-308`; `VM-22: Guidance and Requirement for Setting Prudent Estimate Mortality Assumptions` | Mortality assumptions | Keeps the mortality-prudent-estimate section narrow and reviewable | `company_or_prudent_estimate_assumption`, `core_vm_course`, `prescribed_assumption`, `requires_human_interpretation` | The mortality section includes credibility and prescribed-assumption judgments that should remain review-only. | Passed | `7fe8549` |
| `batch-053` | `pp. 309-313`; `VM-22: Other Guidance and Requirements for Assumptions` | Other assumptions | Keeps margin, sensitivity, and expense guidance together without blending the final boundary | `company_or_prudent_estimate_assumption`, `core_vm_course`, `documentation_expectation`, `requires_human_interpretation` | The remaining assumption guidance mixes margins, sensitivity, and expense treatment and should stay review-only. | Passed | `7fe8549` |
| `batch-054` | `pp. 314-318`; `VM-22: Allocation of Aggregate Reserves to the Contract Level` | Allocation and closing boundary | Closes the chapter before VM-25 begins on page 319 | `boundary_control_window`, `core_vm_course`, `cross_reference_mapping`, `regulatory_requirement` | The chapter ends immediately after the allocation language, so the boundary at page 318 must remain explicit and VM-25 must stay out of scope. | Passed | `7fe8549` |

## Higher-Caution Section

- Scope and applicability boundaries are concentrated in batch-038 and should
  not be treated as operational mechanics.
- Reserve-methodology boundaries and the timing limit in batch-039 are chapter
  structure, not a license to merge later mechanics forward.
- Deterministic / formula-heavy mechanics begin in batch-040 and continue
  through batch-047, including projection setup, asset projection, NAER, and
  the standard projection amount tables.
- Asset and investment projection material in batch-041 includes judgment-heavy
  NAER and annuitization context.
- Reinsurance treatment in batch-042 should stay separate from the later
  projection and assumption blocks.
- Stochastic exclusion and scenario mechanics in batches 048-049 are the
  stochastic entry point and should stay review-only.
- Assumption and margin topics in batches 044, 051, 052, and 053 require
  careful interpretation because they blend prescribed rules with prudent-
  estimate judgment.
- Hedging and risk-mitigation documentation in batch-050 carries product-
  specific caveats and should not be overread as operational instruction.
- The closing boundary in batch-054 must remain explicit at page 318 so VM-25
  stays out of the controlled VM-22 wave.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page or line references sufficient for each item?
- Are requirement versus explanation distinctions correct?
- Are formula labels separated from formula interpretation?
- Are prescribed assumptions separated from company or prudent-estimate
  assumptions?
- Are stochastic / scenario requirements separated from asset-modeling
  judgment?
- Are cross-references mapped but not over-interpreted?
- Are product-specific caveats properly flagged?
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

1. Batch-038 and batch-039 first, because they establish the chapter frame and
   reserve-methodology boundary.
2. Batch-040 and batch-041 next, because they open the projection mechanics
   and asset projection / NAER context.
3. Batch-042 next, because reinsurance should stay separate from the later
   mechanics.
4. Batch-043 through batch-047, because the standard projection amount block
   carries the deterministic mechanics and the Section 7 boundary.
5. Batch-048 and batch-049, because stochastic exclusion and scenario
   generation are the stochastic entry point.
6. Batch-050 and batch-051, because hedging and behavior assumptions carry
   product-specific judgment.
7. Batch-052 and batch-053, because mortality and remaining assumption
   guidance are high-caution material.
8. Batch-054 last, because it closes the chapter before VM-25 begins.

## Relationship to Other Review Indexes

- VM-20 has a separate review index at
  `docs/review/vm20_review_index.md`.
- The supporting-wave review index lives at
  `docs/review/supporting_vm_review_index.md`.
- VM-21 has a separate review index at `docs/review/vm21_review_index.md`.
- VM-22 should be reviewed alongside those handoff summaries so the chapter-
  specific boundaries stay aligned.

## Review Notes

- The underlying batch review packets remain the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
