# Reg-213 Amendment No. 1 FAQ Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/Reg-213-11-NYCRR-S103-Amendment-1-FAQ.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York State Department of Financial Services Life Bureau Guidance Note on Amendment No. 1 to Insurance Regulation 213`
- Source status: companion-only FAQ guidance
- Guidance date: July 21, 2020
- Page range: pages 1-3
- Text layer: readable but wrapped FAQ formatting means the page-image wording backstop should remain visible for exact wording
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `5426916` (`Add Regulation 213 Amendment No. 1 FAQ planning layer`)

Overall wave summary:
- The FAQ was processed as a small, review-only companion-guidance wave with three narrow batches.
- The wave stayed source-bound and kept the FAQ separate from the core Regulation 213 regulation file.
- The opening caveat, middle methodology answers, and closing adoption / hedging questions were preserved separately.

Batch table:

| Batch ID | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Review concerns | Self-review | Validation | Planning commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-245` | page 1 | Opening guidance note, disclaimer language, and early implementation questions | Keep the opening guidance and caveat language together and stop before the methodology page begins | `caveat_or_companion_guidance`, `jurisdiction_specific_requirement`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Companion-guidance caveat; page-image wording backstop; page locators primary; no stable line refs | `reasonable_with_minor_cautions` | Passed | `5426916` |
| `batch-246` | page 2 | Grading methodology and reporting / reserve-structure questions | Keep the grading-methodology and reserve-structure guidance together and stop before the final page begins | `caveat_or_companion_guidance`, `regulatory_requirement`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `state_regulation`, `boundary_control_window`, `requires_human_interpretation` | Companion-guidance caveat; page-image wording backstop; page locators primary; cross-reference mapping; no stable line refs | `reasonable_with_minor_cautions` | Passed | `5426916` |
| `batch-247` | page 3 | Later adoption, phase-in reporting, and closeout | Keep the closing questions together and end the source at the final page | `caveat_or_companion_guidance`, `regulatory_requirement`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Companion-guidance caveat; page-image wording backstop; page locators primary; no stable line refs | `reasonable_with_minor_cautions` | Passed | `5426916` |

Higher-caution areas:
- The FAQ is companion-only guidance, not binding regulation, so the answer layer should stay clearly separated from Regulation 213 itself.
- The opening page explicitly says the responses are limited to the questions presented and do not pre-determine compliance.
- The middle page crosses VM-20, VM-21, Regulation 126, and deficiency-reserve references, so the cross-reference map must stay careful and non-interpretive.
- The closing page discusses later adoption, phase-in reporting, and hedging, which should stay in FAQ-context form rather than becoming standalone requirements.
- The page-image wording backstop should remain visible for exact question / answer wording.

Human review checklist:
- Are the FAQ answers kept separate from the binding Regulation 213 text?
- Are the page locators sufficient for review even though the text wraps across Q&A formatting?
- Is the page-image wording backstop visible anywhere the phrasing could be overread?
- Are opening, middle, and closing windows kept separate as planned?
- Are VM-20, VM-21, Regulation 126, and related references mapped without over-interpreting them?
- Are all items still review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted?
- Are any items candidates for future human promotion review only, not automatic promotion?

Promotion decision area:
- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

Recommended review order:
1. Opening guidance and caveat page.
2. Grading methodology / reporting page.
3. Closing adoption / phase-in / hedging page.

Relationship to other review indexes:
- Review this FAQ alongside `docs/review/reg213_review_index.md` and the broader repository handoff summary in `docs/review/valuation_regulation_repository_poc_status.md`.
- The FAQ is companion guidance for the already-completed Regulation 213 wave and should not be treated as a replacement for the core regulation index.

Reviewer note:
- This source remains review-only. Nothing in the batch outputs should be treated as learner-facing, app-ready, RAG-ready, or promoted without a separate human decision.

