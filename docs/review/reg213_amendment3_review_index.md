# Reg-213 Third Amendment Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/Reg-213-amend3_txt.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York State Department of Financial Services final adoption of the Third Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Source status: final adoption text
- Final-adoption framing: the text frames the Third Amendment as the final adoption text that updates the valuation-manual footnote
- Page range: pages 1-2
- Text layer: readable, but the page-image wording backstop should remain visible for exact wording
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `b031f6b` (`Add Regulation 213 Third Amendment planning layer`)

Overall wave summary:
- The Third Amendment was processed as a two-page, review-only final-adoption wave with one batch.
- The wave stayed source-bound and kept the amendment separate from the core Regulation 213 regulation file and the Amendment No. 1 FAQ addendum.
- The title, footnote revision, and certification were preserved together.

Batch table:

| Batch ID | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Review concerns | Self-review | Validation | Planning commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-254` | pages 1-2 | Final adoption text, footnote revision, and certification | Keep the amendment title, footnote revision, and certification together and stop at the end of page 2 | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Final-adoption status; page-image wording backstop; page locators primary; no stable line refs; boundary to core Reg 213 / FAQ addendum | `reasonable_with_minor_cautions` | Passed | `UNCOMMITTED` |

Higher-caution areas:
- The source is final adoption text, not companion guidance, so it should be treated as regulatory text rather than a note or FAQ.
- The footnote revision refers to the 2021 Valuation Manual, so the cross-reference map should stay careful and non-interpretive.
- The page-image wording backstop should remain visible for exact title, footnote, and certification wording.

Human review checklist:
- Is the final adoption text kept separate from the binding Regulation 213 core text?
- Is the page locator sufficient for review even though the source is a two-page regulatory PDF?
- Is the page-image wording backstop visible anywhere the phrasing could be overread?
- Is the final-adoption status explicit in the batch outputs?
- Are all items still review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted?

Promotion decision area:
- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

Recommended review order:
1. Third Amendment title and adoption framing.
2. Footnote revision that incorporates the 2021 Valuation Manual.
3. Certification on page 2.

Relationship to other review indexes:
- Review this amendment alongside `docs/review/reg213_review_index.md` and the broader repository handoff summary in `docs/review/valuation_regulation_repository_poc_status.md`.
- The amendment is a stand-alone final-adoption addendum to Regulation 213 and should not be treated as a replacement for the core regulation index or the FAQ addendum.

Reviewer note:
- This source remains review-only. Nothing in the batch outputs should be treated as learner-facing, app-ready, RAG-ready, or promoted without a separate human decision.
