# AG 51 Review Index

## Overall AG 51 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- AG 52 remains out of scope for this wave

AG 51 is Actuarial Guideline LI. It was processed as a two-batch review-only wave against the active 5-page `AG 51-AAT for LTC from 2021 Valuation Law Manual.pdf` guideline. The wave stayed source-bound, used page locators as the primary anchor, and kept the future VM-30 incorporation note visible as review-only context. Stable line references were not expected for this PDF runner path, so pages 1-3 and pages 4-5 remained the review anchors.

## Batch Table

| Batch ID | Selected pages/sections | Topic | Boundary rationale | Extraction categories | Unresolved issues / review concerns | Self-review classification | Validation status | Commit hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-163` | `pp. 1-3` | Background, effective date, authority, scope, definitions, exclusions, and the closing asset-adequacy framing | Keep the opening LTC asset-adequacy guidance together as one narrow review-only slice and stop before the documentation requirements section begins. | `regulatory_requirement`; `definition_or_terminology`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Page locators are primary because stable line references were not available; the future VM-30 incorporation note should remain visible but not be read as a current repeal; the opening slice should not absorb the documentation section. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |
| `batch-164` | `pp. 4-5` | Memorandum documentation requirements, rate-increase documentation, and closeout | Keep the documentation / memorandum requirements as a separate closing slice and stop before any future boundary cleanup or later guideline context. | `regulatory_requirement`; `reporting_requirement`; `documentation_expectation`; `governance_or_control_expectation`; `cross_reference_mapping`; `background_content`; `boundary_control_window`; `requires_human_interpretation` | Page locators are primary because stable line references were not available; the future VM-30 incorporation note should remain visible but not be read as a current repeal; the documentation section should stay separate from the opening background / scope material. | `reasonable_with_minor_cautions` | passed | `not separately recorded` |

## Higher-Caution Section

- The page-locator anchor stays primary because the PDF runner did not emit stable line references.
- The future VM-30 incorporation note must stay visible as review-only context and must not be misread as a current repeal or replacement.
- The opening background / scope / definitions slice should remain separate from the documentation closeout slice.
- AG 52 already lives in the mixed pilot batch and should not be reprocessed in this wave.
- The documentation requirements are specific enough for review, but they should remain review-only until a human confirms the wording against the page image if exact phrasing matters.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient even though stable line references were not available?
- Is the future VM-30 incorporation note clearly treated as review-only context rather than a repeal or replacement signal?
- Are the opening guidance pages separated from the documentation closeout pages?
- Are requirement vs explanation distinctions correct?
- Are documentation and reporting expectations separated from background context?
- Is AG 52 still kept out of scope for this wave?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Recommended Review Order

1. Review batch-163 first because it establishes the active LTC asset-adequacy guidance, scope, and definitions.
2. Review batch-164 second because it closes the memorandum documentation requirements and the rate-increase reporting rules.
3. Revisit the future VM-30 incorporation note only if a later reviewer needs to reconcile AG 51 with VM-30 replacement text.

## Relationship to Other Review Indexes

- AG 50 review index: `docs/review/ag50_review_index.md`
- AG 50 self-review note: `docs/review/ag50_self_review.md`
- AG 51 self-review note: `docs/review/ag51_self_review.md`
- AG 52 mixed pilot note: already captured in the mixed pilot batch and not reprocessed
- VM-20 review index: `docs/review/vm20_review_index.md`
- Supporting VM review index: `docs/review/supporting_vm_review_index.md`
- VM-21 review index: `docs/review/vm21_review_index.md`
- VM-22 review index: `docs/review/vm22_review_index.md`
- Repository POC summary: `docs/review/valuation_regulation_repository_poc_status.md`

## Review Notes

- The AG 51 review packet is intentionally narrow and review-only.
- The page-locator backstop stays visible because stable line references were not available.
- line references are not expected for this PDF runner path.
- The future VM-30 incorporation note stays visible as review-only context.
- `review-only`, `not learner-facing`, `not app-ready`, `not RAG-ready`, and `not promoted` all remain intact.
