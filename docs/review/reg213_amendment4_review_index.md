# Reg-213 Fourth Amendment Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/Reg-213-amend4_text.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York State Department of Financial Services Fourth Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Source status: certified amendment text
- Amendment framing: the source contains the Fourth Amendment text on pages 1-2 and a separate certification / publication page on page 3
- Page range: pages 1-3
- Text layer: readable, but the page-image wording backstop should remain visible for exact wording
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `bd5afb3` (`Add Regulation 213 Fourth Amendment planning layer`)

Overall wave summary:
- The Fourth Amendment was processed as a three-page, review-only certified-amendment wave with two batches.
- The wave stayed source-bound and kept the amendment text separate from the certification page.
- The valuation-manual footnote revision and the certification / publication notice were preserved as distinct review slices.

Batch table:

| Batch ID | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Review concerns | Self-review | Validation | Planning commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-255` | pages 1-2 | Fourth Amendment text, footnote revision, and section updates | Keep the amendment title, footnote revision, and section updates together and stop before the certification page begins | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; exact valuation-manual wording; boundary to page 3 | `reasonable_with_minor_cautions` | Passed | `bd5afb3` |
| `batch-256` | page 3 | Certification and publication notice | Keep the certification language together and stop at the end of the page | `state_regulation`, `documentation_expectation`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; publication-notice wording | `reasonable_with_minor_cautions` | Passed | `bd5afb3` |

Higher-caution areas:
- The source is certified regulatory text, not companion guidance, so the amendment text and certification should stay separated from interpretive handoff language.
- The footnote revision references the 2023 Valuation Manual, so the cross-reference map should stay careful and non-interpretive.
- The certification page should remain visible as its own boundary instead of being absorbed into the amendment text.
- The page-image wording backstop should remain visible for exact title, footnote, section-update, certification, and publication wording.

Human review checklist:
- Is the certified amendment kept separate from the binding Regulation 213 core text?
- Is the page locator sufficient for review even though the source is a three-page regulatory PDF?
- Is the page-image wording backstop visible anywhere the phrasing could be overread?
- Is the certification page kept separate from the amendment text?
- Are all items still review-only, not learner-facing, not app-ready, not RAG-ready, and not promoted?

Promotion decision area:
- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

Recommended review order:
1. Fourth Amendment title, footnote revision, and section updates.
2. Certification and publication notice.

Relationship to other review indexes:
- Review this amendment alongside `docs/review/reg213_review_index.md` and the broader repository handoff summary in `docs/review/valuation_regulation_repository_poc_status.md`.
- The amendment is a stand-alone certified-text addendum to Regulation 213 and should not be treated as a replacement for the core regulation index or the other amendment addenda.

Reviewer note:
- This source remains review-only. Nothing in the batch outputs should be treated as learner-facing, app-ready, RAG-ready, or promoted without a separate human decision.
