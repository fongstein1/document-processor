# AG 42 Review Index

## Overall AG 42 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- later guideline files remain out of scope

AG 42 is Actuarial Guideline XLII. It was processed as a two-batch review-only
wave against the active `pp. 1-4` guideline `AG 42 - The Application of the
Model Regulation Permitting the Recognition of Preferred Mortality Tables for
Use in Determining Minimum Reserve Liabil.pdf`. The wave stayed source-bound,
used page locators, and relied on the page-image wording backstop because line
references were not available.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-138` | `pp. 1-2` | Background, scope, definitions, and selection-criteria slice | Keep the opening guidance narrow; preserve the page-image backstop; do not widen into later guideline files. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; preferred-mortality selection boundary; later guideline files remain out of scope. | `reasonable_with_minor_cautions` | passed | n/a |
| `batch-139` | `pp. 3-4` | Periodic assessment and disclosure slice | Keep the periodic-assessment and disclosure material together; preserve the page-image backstop; do not widen into later guideline files. | `regulatory_requirement`; `reporting_requirement`; `documentation_expectation`; `governance_or_control_expectation`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Encoded OCR layer; page-image wording backstop; line references were not available; annual assessment / disclosure boundary; later guideline files remain out of scope. | `reasonable_with_minor_cautions` | passed | n/a |

## Higher-Caution Section

- The page-image wording backstop stays visible because the text layer is
  noisy / encoded.
- Line references were not available, so page locators remain the primary
  review anchor.
- The preferred-mortality selection, certification, assessment, and disclosure
  language should stay review-only until a human confirms the wording against
  the page image.
- The later guideline boundary stayed separate.
- Cross references to the Model Regulation, the Standard Valuation Law, the
  Actuarial Opinion and Memorandum Regulation, annual certification, and
  annual reporting should be mapped but not over-interpreted.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though line references were not available?
- Is the page-image wording backstop clearly stated?
- Are requirement vs explanation distinctions correct?
- Are selection, certification, assessment, and disclosure terms separated from
  background context?
- Are cross references mapped but not over-interpreted?
- Are preferred-mortality and periodic-assessment passages still review-only?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

- Batch-138 first because it establishes the background, scope, definitions,
  and selection-criteria slice.
- Then Batch-139 because it covers the periodic assessment and disclosure
  slice.

## Relationship to Other Review Indexes

- AG 41 review index: `docs/review/ag41_review_index.md`
- AG 42 self-review note: `docs/review/ag42_self_review.md`
- POC status summary: `docs/review/valuation_regulation_repository_poc_status.md`
- AG 42 should be read alongside AG 41 and the repository POC summary as a
  summary-only handoff, not as promoted content.

## Review Notes

- The AG 42 review packet is intentionally narrow and review-only.
- The page-image wording backstop is the wording authority for this wave
  because line references were not available.
- The source remains active and later guideline files remain out of scope.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and
  `not promoted` all remain intact.
