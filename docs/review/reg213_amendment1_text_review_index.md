# Reg-213 First Amendment Text Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York State Department of Financial Services First Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Source status: certified amendment text
- Amendment framing: the source contains the First Amendment text on pages 1-23 and a scanned certification / publication page on page 24
- Page range: pages 1-24
- Text layer: readable, but the page-image wording backstop should remain visible for exact wording
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `dfcc922` (`Add Regulation 213 First Amendment planning layer`)

Overall wave summary:
- The First Amendment text was processed as a 24-page, review-only certified-amendment wave with six batches.
- The wave stayed source-bound and kept the opening text, reserve-method updates, assumption mechanics, withdrawal mechanics, factor-table closeout, and scanned certification page separate.
- The section 103.1, section 103.4, section 103.5, section 103.6, section 103.7, section 103.8, and certification changes were preserved as distinct review slices.

Batch table:

| Batch ID | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Review concerns | Self-review | Validation | Planning commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-260` | pages 1-5 | First Amendment opening text and early section updates | Keep the title, authority text, and early section 103.1 through 103.5 updates together and stop before the reserve-method pages begin | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; opening wording; boundary to the reserve-method pages | `reasonable_with_minor_cautions` | Passed | `dfcc922` |
| `batch-261` | pages 6-11 | Section 103.6 reserve-method updates | Keep the reserve-method updates, phase-in changes, and related cross-references together and stop before the assumption-mechanics pages begin | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; phase-in wording; reserve-method cross-references | `reasonable_with_minor_cautions` | Passed | `dfcc922` |
| `batch-262` | pages 12-16 | Section 103.6 account-value and assumption mechanics | Keep the account-value mechanics and assumption mechanics together and stop before the withdrawal mechanics begin | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; assumption wording; projection-rule boundary | `reasonable_with_minor_cautions` | Passed | `dfcc922` |
| `batch-263` | pages 17-19 | Section 103.6 withdrawal and option-value mechanics | Keep the withdrawal mechanics, index assumptions, and option-value floor together and stop before the factor tables and closeout begin | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; withdrawal wording; option-value floor boundary | `reasonable_with_minor_cautions` | Passed | `dfcc922` |
| `batch-264` | pages 20-23 | Factor tables and sections 103.7 / 103.8 closeout | Keep the factor tables and the closing sections together and stop before the certification page begins | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; factor-table wording; closeout boundary | `reasonable_with_minor_cautions` | Passed | `dfcc922` |
| `batch-265` | page 24 | Certification and publication notice | Keep the scanned certification and publication notice together and end the source at the final page | `state_regulation`, `documentation_expectation`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; scanned certification-page boundary | `reasonable_with_minor_cautions` | Passed | `dfcc922` |

Higher-caution areas:
- The source is certified regulatory text, not companion guidance, so the amendment text and certification page should stay separated from interpretive handoff language.
- The reserve-method, assumption, withdrawal, and closeout sections reference the Valuation Manual and related regulatory context, so the cross-reference map should stay careful and non-interpretive.
- The scanned certification page should remain visible as its own boundary instead of being absorbed into the closeout text.
- The page-image wording backstop should remain visible for exact title, section, phase-in, factor-table, certification, and publication wording.

Human review checklist:
- Is the certified amendment kept separate from the binding Regulation 213 core text?
- Is the page locator sufficient for review even though the source includes a scanned certification page?
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
1. First Amendment opening text and early section updates.
2. Section 103.6 reserve-method updates.
3. Section 103.6 account-value and assumption mechanics.
4. Section 103.6 withdrawal and option-value mechanics.
5. Factor tables and sections 103.7 / 103.8 closeout.
6. Certification and publication notice.

Relationship to other review indexes:
- Review this amendment alongside `docs/review/reg213_review_index.md` and the broader repository handoff summary in `docs/review/valuation_regulation_repository_poc_status.md`.
- The amendment is a stand-alone certified-text addendum to Regulation 213 and should not be treated as a replacement for the core regulation index, the Amendment No. 1 FAQ index, or the later amendment addenda.

Reviewer note:
- This source remains review-only. Nothing in the batch outputs should be treated as learner-facing, app-ready, RAG-ready, or promoted without a separate human decision.
