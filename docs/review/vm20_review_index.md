# VM-20 End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This tracked index summarizes the ignored review packets for controlled
VM-20 batches `batch-003` through `batch-012` and the remaining prose/appendix
extraction outputs in `batch-231` through `batch-234`. It is a handoff summary only.
The underlying batch outputs remain in `data/work/batches/` and are not
promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not promoted.

Note on commit hashes: the hashes below refer to the tracked commit that
recorded the batch sequence or its adjacent state refresh, not to the ignored
working files themselves.

## Overall VM-20 Extraction Status

- The controlled VM-20 sequence is complete.
- Every completed batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is boundary control, not content approval.

## Batch Table

| Batch | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-003` | `pp. 45-46` and `pp. 47-47`; Section 1 purpose and Section 2 overview boundary | Framework overview | Keeps the chapter orientation separate from the page-47 mechanics boundary slice | `background_content`, `boundary_control_window`, `core_vm_course`, `cross_reference_mapping`, `formula_context`, `framework_overview`, `mechanics_boundary`, `regulatory_requirement`, `requires_human_interpretation` | Page-47 boundary and overview/orientation coverage remain review-only | Passed | `5e9c9c13b239cadf40d6c6cfc008884380fa6753` |
| `batch-004` | `pp. 48-48` and `pp. 50-51`; Section 2 role-map statement and Section 3 opener | NPR / DR / SR role-map completion | Closes the high-level role map before detailed mechanics start | `core_vm_course`, `cross_reference_mapping`, `definition_or_terminology`, `framework_overview`, `mechanics_boundary`, `regulatory_requirement`, `requires_human_interpretation`, `reserve_role_statement` | Role-map boundary and Section 3 opener stay review-only until mechanics batches follow | Passed | `16d7ea8aef162ae3468ad774e2e7a4766809b01f` |
| `batch-005` | `pp. 52-55` and `pp. 56-57`; NPR setup and initial formula block | NPR mechanics entry point | Keeps setup terms and the first formula block together while stopping before Section 3.C assumptions | `calculation_structure`, `core_vm_course`, `cross_reference_mapping`, `definition_or_terminology`, `formula_context`, `mechanics_boundary`, `npr_mechanics`, `regulatory_requirement`, `requires_human_interpretation` | NPR setup boundary and assumptions boundary remain review-only | Passed | `78a77ef93c9963934aa51cc701bf8bc086d270a5` |
| `batch-006` | `pp. 58-65`; Section 3.C assumptions | Section 3.C assumptions | Keeps mortality, interest, and lapse assumptions separate from the Section 4 opener | `assumption_layer`, `core_vm_course`, `cross_reference_mapping`, `regulatory_requirement`, `requires_human_interpretation` | Mortality handling and the Section 4 boundary remain review-only | Passed | `05b9489465be163bb0df5e5940168f3829cc9f1f` |
| `batch-007` | `pp. 66-66`; Section 4 deterministic reserve opener | Deterministic reserve opener | Keeps the DR entry point separate from the later SR opener | `core_vm_course`, `deterministic_reserve`, `mechanics_boundary`, `regulatory_requirement`, `requires_human_interpretation` | DR opener remains a boundary slice, not the full Section 4 treatment | Passed | `05b9489465be163bb0df5e5940168f3829cc9f1f` |
| `batch-008` | `pp. 67-68`; Section 5 stochastic reserve opener | Stochastic reserve opener | Keeps the SR entry point separate from exclusion tests | `core_vm_course`, `mechanics_boundary`, `regulatory_requirement`, `requires_human_interpretation`, `stochastic_reserve` | SR opener remains a boundary slice, not the full Section 5 treatment | Passed | `05b9489465be163bb0df5e5940168f3829cc9f1f` |
| `batch-009` | `pp. 69-74`; Section 6 exclusion tests | Exclusion tests | Keeps SET, SERT, and DET language separate from Section 7 cash-flow mechanics | `core_vm_course`, `cross_reference_mapping`, `exclusion_tests`, `mechanics_boundary`, `regulatory_requirement` | Exclusion-test boundary remains review-only and should not absorb Section 7 mechanics | Passed | `5d4b44d2caa02ca6244e0d95f535e364fd1f45f9` |
| `batch-010` | `pp. 75-79`; Section 7 model structure and starting assets | Cash-flow model structure | Keeps model structure, NGE, starting assets, and PIMR context separate from later asset mechanics | `asset_allocation`, `cash_flow_models`, `core_vm_course`, `regulatory_requirement`, `requires_human_interpretation` | PIMR and starting-asset boundary remain review-only | Passed | `5d4b44d2caa02ca6244e0d95f535e364fd1f45f9` |
| `batch-011` | `pp. 80-87`; Section 7 asset mechanics | Cash-flow model asset mechanics | Keeps asset returns, proxy-fund mapping, scenario language, and derivative mechanics separate from Section 8 | `asset_modeling_judgment`, `boundary_spillover`, `cash_flow_models`, `core_vm_course`, `proxy_mapping`, `requires_human_interpretation` | Asset mechanics require human judgment and should not absorb the Section 8 opener | Passed | `5d4b44d2caa02ca6244e0d95f535e364fd1f45f9` |
| `batch-012` | `pp. 88-95`; Section 8 reinsurance and Section 9 boundary | Reinsurance / cleanup boundary | Closes the sequence at the reinsurance treatment and leaves the Section 9 opening as review-only cleanup | `core_vm_course`, `cross_reference_mapping`, `regulatory_requirement`, `reinsurance`, `requires_human_interpretation` | Reinsurance assumptions and the Section 9 boundary remain review-only cleanup material | Passed | `5d4b44d2caa02ca6244e0d95f535e364fd1f45f9` |

## Remaining Prose and Appendix Coverage Wave

The following source-bound extraction outputs were generated directly from the
authoritative current manual PDF. They remain ignored working-batch evidence;
the tracked canonical source-index package is the review-only derived layer.

| Batch | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-231` | `pp. 66-68`; complete Sections 4 and 5 | Deterministic and stochastic reserve mechanics | Splits at the explicit Section 4 and Section 5 headings while retaining boundary-page context | `calculation_structure`, `core_vm_course`, `deterministic_reserve`, `stochastic_reserve`, `cross_reference_mapping`, `requires_human_interpretation` | Confirm formulas, PIMR treatment, scenario references, aggregation, and category attribution against the raw PDF | Passed | current milestone |
| `batch-232` | `pp. 94-130`; Section 9.A-G | Assumptions chapter | Splits at explicit subsection headings and keeps conditions, exceptions, guidance notes, and cross-references within each subsection | `assumption_layer`, `mortality`, `policyholder_behavior`, `expense`, `asset_assumptions`, `revenue_sharing`, `requires_human_interpretation` | Review large Section 9.C parent/child boundaries and actuarial judgment; line references are unavailable | Passed | current milestone |
| `batch-233` | `pp. 131-134`; Appendix 1.A-G | Economic scenarios and governance | Splits at explicit Appendix 1 subsections; scenario descriptions remain examples/context, not generalized rules | `economic_scenarios`, `scenario_generator`, `governance`, `appendix_content`, `requires_human_interpretation` | Confirm scenario labels and external technical-document links against the approved raw source | Passed | current milestone |
| `batch-234` | `pp. 134-140`; Appendix 2.A-H | Asset default, recovery, spread, swap-spread, and table basis prose | Splits at explicit Appendix 2 subsections and retains table references without introducing structured table rows | `asset_default_costs`, `asset_spreads`, `appendix_content`, `structured_table_deferred`, `requires_human_interpretation` | Current table rows/version metadata remain a separate milestone; page-image backstop is pending | Passed | current milestone |

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page or line references sufficient for each item?
- Are requirement versus explanation distinctions correct?
- Are actuarial-judgment items properly flagged?
- Are section-boundary issues acceptable for a review-only batch?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for later RAG or app export use?

## Promotion Decision Area

- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

None of the boxes above are selected by default. Any promotion decision belongs
in a later human review step, not in the completed review-only batches.

## Known Caution Areas

- Section 3.C assumptions require careful interpretation and should stay
  separate from later mechanics.
- The new deterministic and stochastic reserve package is a complete extracted
  prose slice for Sections 4 and 5; independent actuarial confirmation remains
  pending.
- Exclusion tests should not absorb cash-flow model mechanics.
- Asset mechanics and proxy mapping require human actuarial judgment.
- Section 9.A-G is now represented, but mortality, policyholder behavior,
  margins, asset, expense, and revenue-sharing assumptions require focused
  actuarial review.
- Appendix 1 scenario descriptions and Appendix 2 prose are first-class
  review content; Appendix 2 structured current tables remain out of scope for
  this milestone.

## Recommended Review Order

1. Framework map first.
2. NPR mechanics and Section 3.C assumptions.
3. Complete Sections 4 and 5 mechanics.
4. Section 9.A-G assumptions and actuarial judgment.
5. Appendix 1 scenario descriptions and governance.
6. Appendix 2 prose basis, then the separate structured-table milestone.

## Review Notes

- The underlying batch review packets remain the source record for flags,
  unresolved issues, and validation outcomes.
- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
