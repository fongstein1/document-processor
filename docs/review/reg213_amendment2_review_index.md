# Reg-213 Second Amendment Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/Reg-213-11-NYCRR-S103-Amendment-2-nstext-reg213.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York State Department of Financial Services Second Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Source status: certified amendment text
- Amendment framing: the source contains the Second Amendment text on pages 1-5 and a separate certification / publication page on page 6
- Page range: pages 1-6
- Text layer: readable, but the page-image wording backstop should remain visible for exact wording
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `d46189a` (`Add Regulation 213 Second Amendment planning layer`)

Overall wave summary:
- The Second Amendment was processed as a six-page, review-only certified-amendment wave with three batches.
- The wave stayed source-bound and kept the opening text, reserve-method updates, and certification page separate.
- The section 103.3, section 103.5, section 103.6, phase-in, and certification changes were preserved as distinct review slices.

Batch table:

| Batch ID | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Review concerns | Self-review | Validation | Planning commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-257` | pages 1-2 | Second Amendment opening text and section updates | Keep the amendment title, authority text, section 103.3 changes, and the opening 103.5 / 103.6 amendments together and stop before the deeper reserve-method changes begin | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; opening wording; boundary to the reserve-method pages | `reasonable_with_minor_cautions` | Passed | `d46189a` |
| `batch-258` | pages 3-5 | Section 103.6 reserve-method updates | Keep the reserve-method updates, phase-in changes, and linked actuarial-guideline references together and stop before the certification page begins | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; phase-in wording; 2017 AG XLIII / Part 99 / AG XXXV references | `reasonable_with_minor_cautions` | Passed | `d46189a` |
| `batch-259` | page 6 | Certification and publication notice | Keep the certification language together and stop at the end of the page | `state_regulation`, `documentation_expectation`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; publication-notice wording | `reasonable_with_minor_cautions` | Passed | `d46189a` |

Higher-caution areas:
- The source is certified regulatory text, not companion guidance, so the amendment text and certification should stay separated from interpretive handoff language.
- The footnote and reserve-method revisions reference the 2020 Valuation Manual, the 2017 Actuarial Guideline XLIII, Part 99, and Actuarial Guideline XXXV, so the cross-reference map should stay careful and non-interpretive.
- The certification page should remain visible as its own boundary instead of being absorbed into the amendment text.
- The page-image wording backstop should remain visible for exact title, section, phase-in, certification, and publication wording.

Human review checklist:
- Is the certified amendment kept separate from the binding Regulation 213 core text?
- Is the page locator sufficient for review even though the source is a six-page regulatory PDF?
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
1. Second Amendment opening text and section updates.
2. Section 103.6 reserve-method updates.
3. Certification and publication notice.

Relationship to other review indexes:
- Review this amendment alongside `docs/review/reg213_review_index.md` and the broader repository handoff summary in `docs/review/valuation_regulation_repository_poc_status.md`.
- The amendment is a stand-alone certified-text addendum to Regulation 213 and should not be treated as a replacement for the core regulation index or the later amendment addenda.

Reviewer note:
- This source remains review-only. Nothing in the batch outputs should be treated as learner-facing, app-ready, RAG-ready, or promoted without a separate human decision.
