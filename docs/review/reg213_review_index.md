# Reg-213 Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-213-11-NYCRR-S103.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `11 NYCRR Part 103 (Insurance Regulation 213)`
- Source status: active regulation
- Page range: pages 1-27
- Text layer: noisy OCR; page-image wording backstop remains required
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `f04d6d7` (`Add Reg-213 planning layer`)

Overall wave summary:
- Regulation 213 was processed as a small, review-only wave with three narrow batches.
- The wave stayed source-bound and kept amendment / FAQ files out of scope.
- The opening, middle, and closing windows were preserved separately so the review packets can stay exception-first.

Batch table:

| Batch ID | Selected pages / sections | Topic | Boundary rationale | Extraction categories | Review concerns | Self-review | Validation | Planning commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-189` | pages 1-9 | Opening title, scope, applicability, early definitions | Keep the opening frame together and stop before the core requirements begin | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `definition_or_terminology`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | Noisy OCR; page-image wording backstop; page locators primary; no stable line refs | `reasonable_with_minor_cautions` | Passed | `f04d6d7` |
| `batch-190` | pages 10-18 | Core requirements and control language | Keep the middle requirements separate from the opening and closing sections | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | Noisy OCR; page-image wording backstop; page locators primary; no stable line refs | `reasonable_with_minor_cautions` | Passed | `f04d6d7` |
| `batch-191` | pages 19-27 | Closing requirements and end-of-source boundary | Keep the closing window separate from any amendment-history or FAQ material in the same folder | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | Noisy OCR; page-image wording backstop; page locators primary; no stable line refs | `reasonable_with_minor_cautions` | Passed | `f04d6d7` |

Higher-caution areas:
- The OCR layer is noisy, so the page image remains the wording backstop for the whole source.
- Page locators are the primary review anchor; stable line references were not available.
- The opening pages carry the title, scope, applicability, and early definitions.
- The middle pages carry the core regulatory requirements and control language.
- The closing pages carry the end-of-source boundary and should stay separate from amendment / FAQ material.
- The source is active New York regulation, so jurisdiction-specific labeling must stay explicit.

Human review checklist:
- Are extracted requirements source-bound and clearly tied to pages 1-27?
- Are page locators sufficient for review, given the noisy OCR layer?
- Is the page-image wording backstop visible anywhere exact wording might be misread?
- Are opening, middle, and closing windows kept separate as planned?
- Are regulatory requirements separated from background language?
- Are cross-references mapped without over-interpreting them?
- Are jurisdiction and active-regulation status explicit?
- Are all items still review-only, not learner-facing, not app-ready, and not promoted?
- Are any items candidates for later human promotion review only, not automatic promotion?

Promotion decision area:
- [ ] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

Recommended review order:
1. Opening scope and definitions first.
2. Core requirements and control language second.
3. Closing boundary and amendment / FAQ separation last.

Relationship to neighboring review indexes:
- Review this wave alongside `docs/review/reg210_review_index.md` and the broader repository handoff summary in `docs/review/valuation_regulation_repository_poc_status.md`.
- The source-family context also remains aligned with the existing VM, AG, practice-note, and other regulation review indexes already in the repository.

Reviewer note:
- This source remains review-only. Nothing in the batch outputs should be treated as learner-facing, app-ready, RAG-ready, or promoted without a separate human decision.
