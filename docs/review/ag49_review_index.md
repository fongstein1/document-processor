# AG 49 Review Index

## Overall AG 49 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 50 remains out of scope for this wave

AG 49 is Actuarial Guideline XLIX. It was processed as a three-batch review-only wave against the active 4-page `AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest.pdf` guideline. The wave stayed source-bound, used page locators, and relied on the page-image wording backstop because the text layer is encoding-noisy and stable line references were not available.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-157` | `pages 1` | Background, applicability, and opening definitions | Keep the opening guidance, effective dates, scope, and opening definitions together as one narrow review-only slice and stop cleanly before the benchmark-account and scale language. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; opening scope boundary; AG 50 boundary remains outside the wave. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-158` | `pages 2-3` | Benchmark account, disciplined current scale, and policy loans | Keep the benchmark-index account rules, disciplined current scale, policy loans, and opening additional standards together as one narrow review-only slice and stop before the closing alternate-scale page. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `hedging_or_risk_mitigation`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; benchmark-scale boundary; AG 50 boundary remains outside the wave. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-159` | `pages 4` | Alternate scale, disclosure tables, and closing boundary | Keep the alternate-scale ledger, disclosure tables, and closing boundary together as one narrow review-only slice and stop at the AG 50 boundary. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `hedging_or_risk_mitigation`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; closing disclosure boundary; AG 50 boundary remains outside the wave. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is noisy / encoded.
- Line references were not available, so page locators remain the primary review anchor.
- The opening guidance, effective dates, scope, and opening definitions should stay review-only until a human confirms the wording against the page image.
- The benchmark-index account, disciplined current scale, policy-loan, and opening additional-standards material should stay separate from the opening guidance and the closing alternate-scale page.
- The alternate-scale ledger and disclosure-table material should stay separate from the earlier benchmark-account and current-scale material.
- AG 50 remains out of scope for this wave and should stay outside the review packet boundary.
- Cross references to Model 582, benchmark index accounts, fixed accounts, and the illustrated scale should be mapped but not over-interpreted.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are the opening guidance and definitions separated from the benchmark-account and alternate-scale pages?
- Are the benchmark-account and policy-loan passages separated from the alternate-scale disclosure passages?
- Are the disclosure-table passages mapped but not over-interpreted?
- Is the AG 50 boundary kept outside this wave?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-157 first because it establishes the opening authority, scope, and definitions.
2. Review batch-158 second because it contains the benchmark-account, disciplined current scale, and policy-loan material.
3. Review batch-159 last because it closes the alternate-scale and disclosure boundary.

## Relationship to Other Review Indexes

- AG 48 review index: `docs/review/ag48_review_index.md`
- AG 48 self-review note: `docs/review/ag48_self_review.md`
- AG 47 review index: `docs/review/ag47_review_index.md`
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 49 self-review note: `docs/review/ag49_self_review.md`

## Review Notes

- The AG 49 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave because line references were not expected.
- The source remains active and AG 50 stayed out of scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and `not promoted` all remain intact.
