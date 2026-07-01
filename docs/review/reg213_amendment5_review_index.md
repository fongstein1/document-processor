# Reg-213 Fifth Amendment Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/Reg-213-amend5_text.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York State Department of Financial Services Fifth Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Source status: certified amendment text
- Amendment framing: the source carries the Fifth Amendment footnote revision on page 1 and a separate certification page on page 2
- Page range: pages 1-2
- Text layer: readable, but the page-image wording backstop should remain visible for exact wording
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `a80f7a2` (`Add Regulation 213 Fifth Amendment planning layer`)

Overall wave summary:
- The Fifth Amendment was processed as a two-batch, review-only certified-amendment wave.
- The wave stayed source-bound and kept the amendment text separate from the certification page.
- The valuation-manual footnote update and the certification / publication notice were preserved as distinct review slices.

Batch table:

| Batch ID | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Review concerns | Self-review | Validation | Planning commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-249` | page 1 | Footnote revision and amendment text | Keep the amendment title and footnote revision together and stop before the certification page begins | `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; exact valuation-manual wording | `reasonable_with_minor_cautions` | Passed | `a80f7a2` |
| `batch-250` | page 2 | Certification and publication notice | Keep the certification language together and stop at the end of the source | `state_regulation`, `documentation_expectation`, `boundary_control_window`, `requires_human_interpretation` | Certified-amendment status; page-image wording backstop; page locators primary; publication-notice wording | `reasonable_with_minor_cautions` | Passed | `a80f7a2` |

Higher-caution areas:
- The source is certified regulatory text, not a companion note, so the amendment text and certification should stay separated from interpretive handoff language.
- The footnote revision references the 2023 Valuation Manual, so the cross-reference map should stay careful and non-interpretive.
- The certification page should remain visible as its own boundary instead of being absorbed into the amendment text.
- The page-image wording backstop should remain visible for exact title, footnote, and certification wording.

Human review checklist:
- Is the certified amendment kept separate from the binding Regulation 213 core text?
- Is the page locator sufficient for review even though the source is a two-page regulatory PDF?
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
1. Amendment text and footnote revision.
2. Certification and publication notice.

Relationship to other review indexes:
- Review this amendment alongside `docs/review/reg213_review_index.md` and the broader repository handoff summary in `docs/review/valuation_regulation_repository_poc_status.md`.
- The amendment is a stand-alone certified-text addendum to Regulation 213 and should not be treated as a replacement for the core regulation index or the FAQ and Sixth Amendment addenda.

Reviewer note:
- This source remains review-only. Nothing in the batch outputs should be treated as learner-facing, app-ready, RAG-ready, or promoted without a separate human decision.
