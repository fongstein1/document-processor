# AG 48 Review Index

## Overall AG 48 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 49 remains out of scope for this wave

AG 48 is Actuarial Guideline XLVIII. It was processed as a three-batch
review-only wave against the active 12-page
`AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuation of Life Insurance Policies Model Regulation (Model 830)` PDF guideline. The wave stayed source-bound, used page locators, and relied on the page-image wording backstop because the text layer is encoding-noisy and stable line references were not available.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-154` | `pages 1-4` | Authority, scope, and reinsurance framing | Keep the opening guidance and initial reinsurance framing together as one narrow review-only slice and stop cleanly before the security/method section. | `regulatory_requirement`; `definition_or_terminology`; `reinsurance`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; opening authority/scope boundary; 2021 Law Manual reprint out of scope. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-155` | `pages 5-8` | Reinsurance exemptions, primary security, and actuarial method | Keep the exemption, definition, primary-security, and actuarial-method material together as one narrow review-only slice and stop before the opinion/memorandum section. | `regulatory_requirement`; `definition_or_terminology`; `reinsurance`; `calculation_structure`; `formula_context`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; security/method boundary; 2021 Law Manual reprint out of scope. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-156` | `pages 9-12` | Opinion, memorandum, and sunset boundary | Keep the opinion, memorandum, and sunset language together as one narrow review-only slice and stop at the closing boundary. | `regulatory_requirement`; `reporting_requirement`; `documentation_expectation`; `governance_or_control_expectation`; `reinsurance`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoding-noisy OCR layer; page-image wording backstop; line references were not available; opinion/memorandum/sunset boundary; AG 49 boundary remains the next likely check. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is
  noisy / encoded.
- Line references were not available, so page locators remain the primary
  review anchor.
- The opening authority, scope, and reinsurance framing should stay review-
  only until a human confirms the wording against the page image.
- The security, primary-security, and actuarial-method material should stay
  separate from the opening guidance and the opinion/memorandum section.
- The opinion, memorandum, and sunset boundary should stay separate from any
  later cleanup or follow-on guideline.
- The 2021 Law Manual reprint remains out of scope for this wave.
- AG 49 remains the next likely boundary check if the continuation pass keeps
  going.
- Cross references to Model 830, Model 785, Model 787, VM-21, VM-22, and
  VM-30 should be mapped but not over-interpreted.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not
  available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are the reinsurance exemptions and primary-security passages separated from
  the opinion/memorandum passages?
- Are the security/method passages separated from the authority/scope
  passages?
- Are the sunset and boundary passages mapped but not over-interpreted?
- Is the AG 49 boundary kept outside this wave?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-154 first because it establishes the opening authority,
   scope, and reinsurance framing.
2. Review batch-155 second because it contains the security, primary-security,
   and actuarial-method material.
3. Review batch-156 last because it closes the opinion, memorandum, and
   sunset boundary.

## Relationship to Other Review Indexes

- AG 47 review index: `docs/review/ag47_review_index.md`
- AG 46 review index: `docs/review/ag46_review_index.md`
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 48 self-review note: `docs/review/ag48_self_review.md`

## Review Notes

- The AG 48 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave
  because line references were not expected.
- The source remains active and the 2021 Law Manual reprint stayed out of
  scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`,
  and `not promoted` all remain intact.
