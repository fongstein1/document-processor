# AG 50 Review Index

## Overall AG 50 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 51 remains out of scope for this wave

AG 50 is Actuarial Guideline L. It was processed as a three-batch review-only wave against the active 4-page `AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table.pdf` guideline. The wave stayed source-bound, used page locators, and relied on the page-image wording backstop because the text layer is encoding-noisy and stable line references were not available.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-160` | `pages 1` | Background and purpose | Keep the opening guidance and purpose together as one narrow review-only slice and stop cleanly before the credibility and A/E mechanics. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; opening scope boundary; AG 51 boundary remains outside the wave. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-161` | `pages 2-3` | Credibility, A/E ratio, lag period, and monthly indemnity | Keep the credibility-weighting, A/E, lag-period, and monthly-indemnity guidance together as one narrow review-only slice and stop before the closing exemption page. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; experience-measurement boundary; AG 51 boundary remains outside the wave. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-162` | `pages 4` | Company definition and own-experience exemption | Keep the company-definition and own-experience exemption together as one narrow review-only slice and stop at the closing AG 51 boundary. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; closing exemption boundary; AG 51 boundary remains outside the wave. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is noisy / encoded.
- Line references were not available, so page locators remain the primary review anchor.
- The opening guidance and purpose should stay review-only until a human confirms the wording against the page image.
- The credibility-weighting, A/E ratio, lag-period, and monthly-indemnity material should stay separate from the opening guidance and the closing exemption page.
- The company-definition and own-experience exemption material should stay separate from the earlier credibility and lag-period material.
- AG 51 remains out of scope for this wave and should stay outside the review packet boundary.
- Cross references to the 2013 IDI Valuation Table, the Health Insurance Reserves Model Regulation, and related tables should be mapped but not over-interpreted.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are the opening guidance and purpose separated from the credibility and A/E pages?
- Are the credibility and lag-period passages separated from the closing exemption passage?
- Are the exemption passages mapped but not over-interpreted?
- Is the AG 51 boundary kept outside this wave?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-160 first because it establishes the opening authority and purpose.
2. Review batch-161 second because it contains the credibility, A/E ratio, lag period, and monthly-indemnity material.
3. Review batch-162 last because it closes the company-definition and exemption boundary.

## Relationship to Other Review Indexes

- AG 49 review index: `docs/review/ag49_review_index.md`
- AG 49 self-review note: `docs/review/ag49_self_review.md`
- AG 48 review index: `docs/review/ag48_review_index.md`
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 50 self-review note: `docs/review/ag50_self_review.md`

## Review Notes

- The AG 50 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave because line references were not expected.
- The source remains active and AG 51 stayed out of scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and `not promoted` all remain intact.
