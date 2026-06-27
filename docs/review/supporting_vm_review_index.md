# Supporting VM End-of-Sequence Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted
- VM-21 and VM-22 explicitly excluded

This tracked index summarizes the ignored review packets for controlled
supporting VM batches `batch-013` through `batch-021`. It is a handoff
summary only. The underlying batch outputs remain in `data/work/batches/`
and are not promoted by this file.

This index is not learner-facing, not app-ready, not RAG-ready, and not
promoted.

Note on commit hashes: the hashes below refer to the supporting-wave run
commit `782843cb94b91d666fba6d252c0f3adf75eeb582`, not to the ignored
working files themselves.

## Overall Supporting-Wave Extraction Status

- The controlled supporting VM sequence is complete.
- Every completed batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- The recurring review work is boundary control, not content approval.

## Batch Table

| Batch | Chapter | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-013` | `VM-01` | `pp. 25-39`; `VM-01: Definitions for Terms in Requirements` | Definitions / introductory material | Keeps definitions review-only when they are explanatory or cross-referenced | `core_vm_course`, `supporting_vm_chapter`, `definition_or_terminology`, `cross_reference_mapping`, `requires_human_interpretation` | VM-01 contains cross-referenced terms that support later chapters but should not be treated as operational instructions on their own. | Passed | `782843cb94b91d666fba6d252c0f3adf75eeb582` |
| `batch-014` | `VM-02` | `pp. 41-44`; `VM-02: Minimum Nonforfeiture Mortality and Interest` | Minimum nonforfeiture mortality and interest | Keeps reserve-method structure separate from broader valuation-law discussion | `core_vm_course`, `supporting_vm_chapter`, `reserve_method_structure`, `cross_reference_mapping`, `requires_human_interpretation` | VM-02 references the Valuation Manual structure and later coordination points, so the chapter should stay review-only until the context is fully mapped. | Passed | `782843cb94b91d666fba6d252c0f3adf75eeb582` |
| `batch-015` | `VM-25` | `pp. 319-320`; `VM-25: Health Insurance Reserves Minimum Reserve Requirements` | Health insurance reserves minimum reserve requirements | Keeps A&H reserve requirements narrow and source-bound | `core_vm_course`, `supporting_vm_chapter`, `regulatory_requirement`, `cross_reference_mapping`, `requires_human_interpretation` | VM-25 relies on AP&P Manual appendices and related actuarial guidelines, so the chapter should stay review-only until those cross-references are handled deliberately. | Passed | `782843cb94b91d666fba6d252c0f3adf75eeb582` |
| `batch-016` | `VM-26` | `pp. 321-324`; `VM-26: Credit Life and Disability Reserve Requirements` | Credit life and disability reserve requirements | Keeps contract reserve and claim reserve language distinct | `core_vm_course`, `supporting_vm_chapter`, `reporting_requirement`, `cross_reference_mapping`, `requires_human_interpretation` | VM-26 references Model #820 and other valuation rules, so the chapter should stay review-only until the later context is fully mapped. | Passed | `782843cb94b91d666fba6d252c0f3adf75eeb582` |
| `batch-017` | `VM-30` | `pp. 325-329`; `VM-30: Actuarial Opinion and Memorandum Requirements (scope and general requirements)` | Actuarial opinion and memorandum requirements | Keeps the reporting frame separate from detailed opinion and memorandum text | `core_vm_course`, `supporting_vm_chapter`, `reporting_requirement`, `governance_or_control_expectation`, `cross_reference_mapping`, `requires_human_interpretation` | VM-30 points into other VM sections, including VM-01 and VM-31, so the supporting slice should remain review-only until the cross-references are mapped. | Passed | `782843cb94b91d666fba6d252c0f3adf75eeb582` |
| `batch-018` | `VM-30` | `pp. 330-339`; `VM-30: Actuarial Opinion and Memorandum Requirements (detail layer)` | VM-30 opinion and memorandum details | Keeps the detailed opinion / memorandum / retention language separate after the reporting frame is established | `core_vm_course`, `supporting_vm_chapter`, `actuarial_opinion`, `actuarial_memorandum`, `documentation_expectation`, `requires_human_interpretation` | VM-30 contains opinion, memorandum, and reliance language that depends on actuarial judgment and should stay review-only until the reviewer confirms the context. | Passed | `782843cb94b91d666fba6d252c0f3adf75eeb582` |
| `batch-019` | `VM-31` | `pp. 341-354`; `VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation (purpose and general requirements)` | VM-31 purpose and general requirements | Keeps the purpose, general requirements, and early report structure separate from the dense detail block | `core_vm_course`, `supporting_vm_chapter`, `pbr_actuarial_report`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping` | VM-31 points back to VM-20, VM-21, and VM-22 methods and should remain review-only until the cross-references are mapped deliberately. | Passed | `782843cb94b91d666fba6d252c0f3adf75eeb582` |
| `batch-020` | `VM-31` | `pp. 355-371`; `VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation (core report detail block)` | VM-31 core report detail block | Keeps methods, assumptions, assets, experience studies, and model controls separate from the closing boundary | `core_vm_course`, `supporting_vm_chapter`, `pbr_actuarial_report`, `documentation_expectation`, `governance_or_control_expectation`, `requires_human_interpretation` | VM-31 detail topics include methods, assumptions, assets, experience studies, and controls that depend on human review for proper interpretation. | Passed | `782843cb94b91d666fba6d252c0f3adf75eeb582` |
| `batch-021` | `VM-31` | `pp. 372-386`; `VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation (late detail block and closing boundary)` | VM-31 late detail block and closing boundary | Finishes the remaining report detail and stops cleanly before VM-50 starts on page 387 | `core_vm_course`, `supporting_vm_chapter`, `pbr_actuarial_report`, `boundary_control_window`, `cross_reference_mapping`, `requires_human_interpretation` | VM-31 ends at page 386 and VM-50 begins immediately afterward, so the closing boundary should remain review-only. | Passed | `782843cb94b91d666fba6d252c0f3adf75eeb582` |

## Higher-Caution Section

- VM-30 opinion and memorandum material is documentation-heavy and can drift
  into actuarial judgment, so it should stay review-only until the reporting
  context is confirmed.
- VM-31 PBR Actuarial Report requirements carry reporting, documentation, and
  governance language that should not be overread as operational instruction.
- VM-31 methods, assumptions, assets, and controls are interpretation-risk
  material and should remain review-only until a human confirms the context.
- VM-31 must stop cleanly before VM-50 begins on page 387.
- VM-01 terminology and cross-reference alignment should not be treated as
  operational instruction on its own.
- VM-02 reserve-method material is a boundary slice, not the full method.
- VM-25 and VM-26 contain applicability boundaries and cross-reference
  dependencies that should stay visible in review.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page or line references sufficient for each item?
- Are requirement versus explanation distinctions correct?
- Are reporting requirements separated from documentation expectations?
- Are governance or control expectations separated from actuarial judgment?
- Are VM-30 opinion / memorandum items separated from VM-31 PBR Actuarial
  Report items?
- Are cross-references mapped but not over-interpreted?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for later RAG or app export use?

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

1. VM-30 and VM-31 first, because they carry the highest boundary risk.
2. VM-01 terminology and cross-references.
3. VM-02 reserve-method structure.
4. VM-25 and VM-26 smaller applicability chapters.

## Relationship to VM-20

- VM-20 has a separate review index at
  `docs/review/vm20_review_index.md`.
- This supporting-wave index should be reviewed alongside that VM-20 index so
  the two handoff summaries stay aligned.
- The underlying batch packets remain the source record for flags,
  unresolved issues, and validation outcomes.

## Review Notes

- This index is intentionally compact so it can be used as a handoff aid
  without reclassifying any extracted item.
- The underlying batch outputs remain ignored in `data/work/batches/`.
