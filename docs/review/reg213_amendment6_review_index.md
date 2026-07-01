# Reg-213 Sixth Amendment Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/Reg-213-amend6_text.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York State Department of Financial Services proposed Sixth Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Source status: proposed amendment text
- Proposed date / framing: the text frames a proposed Sixth Amendment that would update the valuation-manual footnote
- Page range: page 1 only
- Text layer: readable, but the page-image wording backstop should remain visible for exact wording
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `74a6c2d` (`Add Regulation 213 Sixth Amendment planning layer`)

Overall wave summary:
- The Sixth Amendment was processed as a single-page, review-only proposed-amendment wave with one batch.
- The wave stayed source-bound and kept the proposed amendment separate from the core Regulation 213 regulation file and the Amendment No. 1 FAQ addendum.
- The title, adoption framing, and footnote revision were preserved together.

Batch table:

| Batch ID | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Review concerns | Self-review | Validation | Planning commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-248` | page 1 | Proposed Sixth Amendment text and footnote revision | Keep the proposed amendment title, adoption framing, and footnote revision together and stop at the end of the page | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Proposed-amendment status; page-image wording backstop; page locators primary; no stable line refs; boundary to core Reg 213 / FAQ addendum | `reasonable_with_minor_cautions` | Passed | `74a6c2d` |

Higher-caution areas:
- The source is proposed regulatory text, not final adopted rule text, so it should not be treated as binding without later confirmation.
- The footnote revision refers to the 2024 Valuation Manual, so the cross-reference map should stay careful and non-interpretive.
- The page-image wording backstop should remain visible for exact title and footnote wording.

Human review checklist:
- Is the proposed amendment kept separate from the binding Regulation 213 core text?
- Is the page locator sufficient for review even though the source is a one-page regulatory PDF?
- Is the page-image wording backstop visible anywhere the phrasing could be overread?
- Is the proposed-amendment status explicit in the batch outputs?
- Are all items still review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted?

Promotion decision area:
- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

Recommended review order:
1. Proposed title and adoption framing.
2. Footnote revision that incorporates the 2024 Valuation Manual.

Relationship to other review indexes:
- Review this amendment alongside `docs/review/reg213_review_index.md` and the broader repository handoff summary in `docs/review/valuation_regulation_repository_poc_status.md`.
- The amendment is a stand-alone proposed-text addendum to Regulation 213 and should not be treated as a replacement for the core regulation index or the FAQ addendum.

Reviewer note:
- This source remains review-only. Nothing in the batch outputs should be treated as learner-facing, app-ready, RAG-ready, or promoted without a separate human decision.
