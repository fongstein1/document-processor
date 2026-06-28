# AG 40 Review Index

## Overall AG 40 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 41 remains out of scope

AG 40 is Actuarial Guideline XL. It was processed as two review-only batches
against the active `pp. 1-4` guideline `AG 40 - Guideline For Valuation Rate
of Interest for Funding Agreements and Guaranteed Interest Contracts (GICs)
with Bailout Provisions.pdf`. The wave stayed source-bound, used page
locators, and relied on the page-image wording backstop because line
references were not available.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-135` | `pp. 1-2` | Background, risk, and bailout-provision setup | Capture the opening purpose/background/risk material as one narrow slice before reserve application; keep AG 41 out of scope. | `regulatory_requirement`; `definition_or_terminology`; `background_content`; `asset_modeling_judgment`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; reserve/context boundary; AG 41 boundary. | passed | n/a |
| `batch-136` | `pp. 3-4` | Reserve, valuation-interest, and control slice | Capture the reserve application and control language after the background slice without widening into AG 41. | `regulatory_requirement`; `reserve_method_structure`; `calculation_structure`; `formula_context`; `governance_or_control_expectation`; `background_content`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; reserve/context boundary; AG 41 boundary. | passed | n/a |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is noisy
  / encoded.
- Line references were not available, so page locators remain the primary
  review anchor.
- The AG 41 boundary stays outside the AG 40 wave.
- The bailout-provision discussion should stay review-only until a human
  confirms the wording against the page image.
- The reserve application slice includes valuation-interest limits, Plan Type
  C, and review/control language that should not be overread into later
  material.
- The contract-form, risk, novation, put-provision, and
  over-collateralization language should be kept separate from any later
  guideline.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are reserve terms separated from background context?
- Are cross-references to AG 39 and AG 41 mapped but not over-interpreted?
- Are the bailout-provision and valuation-interest passages still review-only?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

- Batch-135 first, because it establishes the background and risk setup.
- Batch-136 second, because it completes the reserve / valuation-interest /
  control slice.
- Then confirm whether any later AG 41 material needs a separate plan.

## Relationship to Other Review Indexes

- AG 39 review index: `docs/review/ag39_review_index.md`
- AG 40 self-review note: `docs/review/ag40_self_review.md`
- POC status summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 40 should be read as a continuation of the review-only
  valuation-regulation handoff set, not as promoted content.

## Review Notes

- The AG 40 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave
  because line references were not available.
- The source remains active and the AG 41 boundary remains out of scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and
  `not promoted` all remain intact.
