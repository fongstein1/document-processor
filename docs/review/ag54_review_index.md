# AG 54 Review Index

## Overall AG 54 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 55 remains out of scope for this wave

AG 54 is Actuarial Guideline LIV. It was processed as a three-batch review-only wave against the active 56-paragraph `AG 54-Indexed Linked Variable Annuities (ILVA) Nonforfeiture as adopted by LATF-20221211.docx` guidance. The wave stayed source-bound, used paragraph locators as the primary anchor, and preserved line references because this was a text-based Word source. The opening background / scope / definitions slice on paragraphs 1-18, the methodology slice on paragraphs 19-40, and the filing / closeout slice on paragraphs 41-56 stayed separate as three narrow review windows.

## Batch Table

| Batch ID | Selected paragraphs/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-168` | `paragraphs 1-18` | Background, scope, principles, and definitions | Keep the disclaimer, background, scope, principles, and core definitions together as one narrow review-only slice and stop before the methodology section begins. | `regulatory_requirement`; `definition_or_terminology`; `background_content`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Paragraph locators are primary because line references were preserved; the opening scope guidance should not absorb the later methodology section. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-169` | `paragraphs 19-40` | Methodology and consistency | Keep the interim-value, hypothetical-portfolio, market-value-adjustment, and consistency-testing material together as one narrow review-only slice. | `regulatory_requirement`; `definition_or_terminology`; `calculation_structure`; `formula_context`; `prescribed_assumption`; `company_or_prudent_estimate_assumption`; `asset_modeling_judgment`; `cross_reference_mapping`; `boundary_control_window`; `requires_human_interpretation` | Paragraph locators are primary because line references were preserved; the methodology slice should not absorb the filing and certification material. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-170` | `paragraphs 41-56` | Filing, certification, descriptions, and effective date | Keep the memorandum, certification, description, and effective-date guidance together as one narrow review-only slice and stop at the AG 54 closeout boundary. | `reporting_requirement`; `documentation_expectation`; `governance_or_control_expectation`; `regulatory_requirement`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Paragraph locators are primary because line references were preserved; the filing slice should not absorb the earlier methodology material. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |

## Higher-Caution Section

- The paragraph-locator anchor stays primary because line references were preserved for this text source.
- The opening disclaimer states that the guideline has not yet been adopted by the NAIC committees, so that wording must remain a review-only caveat.
- The opening background / scope / definitions slice should remain separate from the methodology slice.
- The methodology slice should remain separate from the filing / closeout slice.
- AG 53 remains the prior wave context, and AG 55 remains out of scope for this wave.
- The guidance is specific enough for review, but it should remain review-only until a human confirms the wording against the source text if exact phrasing matters.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are paragraph locators sufficient because line references were preserved?
- Is the not-yet-committee-adopted disclaimer clearly treated as a review-only caveat?
- Are the opening guidance paragraphs separated from the methodology paragraphs?
- Are the methodology paragraphs separated from the filing / closeout paragraphs?
- Are requirement vs explanation distinctions correct?
- Are documentation and reporting expectations separated from background context?
- Is AG 55 still kept out of scope for this wave?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-168 first because it establishes the ILVA scope, principles, and definitions.
2. Review batch-169 second because it captures the Hypothetical Portfolio methodology and consistency rules.
3. Review batch-170 third because it closes the filing, certification, and effective-date material.

## Relationship to Other Review Indexes

- AG 53 review index: `docs/review/ag53_review_index.md`
- AG 53 self-review note: `docs/review/ag53_self_review.md`
- AG 54 self-review note: `docs/review/ag54_self_review.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`

## Review Notes

- The AG 54 review packet is intentionally narrow and review-only.
- The paragraph-locator backstop stays visible because line references were preserved.
- line references are preserved for this text source.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and `not promoted` all remain intact.
