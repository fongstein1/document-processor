# Asset Adequacy Analysis Practice Note Review Index

## Overall Status

- `review-only`
- `not learner-facing`
- `not app-ready`
- `not RAG-ready`
- `not promoted`
- `non-binding practice note / companion guidance`

## Source Summary

- Source file: `Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf`
- Source family: `practice_notes`
- Source status: `active`
- Page range: `pp. 1-91`
- Boundary note: keep the disclaimer, companion-guidance caveat, and closing
  boundary visible; use page locators as the primary anchor because stable line
  references are not expected.

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-216` | `pp. 1-11` | Front matter, disclaimer, introduction, and Section A background | Keep the disclaimer, introduction, and Section A background together before the appointed-actuary procedures begin | `background_content`, `caveat_or_companion_guidance`, `cross_reference_mapping`, `boundary_control_window` | `reasonable_with_minor_cautions` | Companion-guidance caveat must remain visible; page locators are primary; keep the opening slice separate from later procedural content | passed | `pending` |
| `batch-217` | `pp. 12-25` | Appointed-actuary procedures and Section C opener | Keep appointed-actuary procedures and early general considerations together before the deeper modeling sections begin | `governance_or_control_expectation`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping` | `reasonable_with_minor_cautions` | Procedural language should not be overread as a compliance checklist; keep the Section C opener visible | passed | `pending` |
| `batch-218` | `pp. 26-40` | General modeling considerations and IMR / AVR treatment | Keep the general modeling discussion together, including IMR / AVR and related modeling considerations | `calculation_structure`, `formula_context`, `asset_modeling_judgment`, `cross_reference_mapping` | `reasonable_with_minor_cautions` | Modeling detail should stay review-only; cross-reference material must not be over-interpreted | passed | `pending` |
| `batch-219` | `pp. 41-57` | Asset modeling specifics, fixed income, and mortgages | Keep the asset modeling detail together so fixed-income and mortgage topics do not spill into later sections | `asset_modeling_judgment`, `calculation_structure`, `formula_context`, `cross_reference_mapping` | `reasonable_with_minor_cautions` | Asset modeling relies on actuarial and investment judgment; keep the slice review-only | passed | `pending` |
| `batch-220` | `pp. 58-76` | Policy cash flow risk, expenses, reliance, and results | Keep policy cash flow risk, expenses, reliance, and analysis of results together as one risk-and-results slice | `scenario_or_stochastic_requirement`, `reporting_requirement`, `documentation_expectation`, `governance_or_control_expectation`, `cross_reference_mapping` | `reasonable_with_minor_cautions` | Sensitivity / reliance language should remain review-only; keep the results discussion separate from promotion decisions | passed | `pending` |
| `batch-221` | `pp. 77-91` | Opinion, memorandum, AG43 / VM-21 impacts, and appendix closeout | Keep opinion / memorandum preparation and AG43 / VM-21 impact material together with the appendix closeout | `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Opinion / memorandum material remains review-only; AG43 / VM-21 references stay cross-reference only unless operational text is captured | passed | `pending` |

## Higher-Caution Areas

- Companion-guidance caveat must stay visible at every layer.
- Page locators are the primary anchor; stable line references are not
  expected.
- Appointed-actuary procedures should not be overread as a generic checklist.
- IMR / AVR and asset-modeling discussions need human actuarial judgment.
- Policy cash flow risk, sensitivity testing, and reliance on other parties
  should remain review-only.
- Opinion / memorandum closeout material and AG43 / VM-21 references should be
  kept separate from authoritative regulation.

## Human Review Checklist

- Are extracted requirements source-bound?
- Are page locators sufficient for the intended citation use?
- Are requirement vs explanation distinctions correct?
- Are calculation, asset-modeling, and reliance issues properly flagged?
- Are cross-references mapped but not over-interpreted?
- Are AG43 / VM-21 references kept review-only unless operational text was
  captured with them?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG/app export later?

## Promotion Decision Area

- keep review-only
- revise extraction
- promote selected items to learner-facing draft
- prepare RAG-ready candidate set
- prepare app-export candidate set

## Relationship to Other Review Indexes

- Review this source alongside
  `docs/review/life_reinsurance_reserve_credit_practice_note_review_index.md`
  for reinsurance-credit context.
- Review it alongside
  `docs/review/model_regulation_xxx_review_index.md` for Model Regulation XXX
  practice-note comparison points.
- Review it alongside
  `docs/review/actuarial_memorandum_practice_note_review_index.md` for
  reporting / memorandum parallels.
- Review it alongside
  `docs/review/cia_2023_financial_condition_testing_educational_note_review_index.md`
  for practice-note workflow comparisons.
- Review it alongside `docs/review/valuation_regulation_repository_poc_status.md`
  for the broader repository proof-of-concept posture.
