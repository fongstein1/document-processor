# Regulation 143 Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-143-11-NYCRR-S041.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York Regulation 143 / 11 CRR-NY Part 41`
- Source title: `Accelerated Payment of the Death Benefit Under a Life Insurance Policy`
- Source status: active
- Source status note: current through March 15, 2020; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- Page range: pages 1-27
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `597e00c` (`Add Regulation 143 planning layer`)

Overall wave summary:
- The Regulation 143 wave is complete as a single 27-page, review-only slice.
- The batch stayed source-bound and kept the title page, definitions, accelerated death benefit provisions, and severability material together.
- The benefit-eligibility pages remain part of the same review-only unit rather than a separate promotion target.

Batch table:

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Planning Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-272` | pages 1-27; title page, purpose, definitions, accelerated death benefit provisions, and severability | Regulation 143 purpose, definitions, accelerated death benefit provisions, and severability | Keep the full 27-page regulation together as one bounded slice and stop at the page 27 boundary. | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `reporting_requirement`, `documentation_expectation`, `governance_or_control_expectation`, `definition_or_terminology`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Noisy OCR-like text layer; page-image wording backstop; page locators primary; cross-reference mapping should remain non-interpretive | Passed | `597e00c` |

Higher-caution areas:
- The page-image wording backstop remains visible because the text layer is noisy / OCR-like.
- Page locators remain the primary anchor; stable line references are not expected to be reliable.
- The title page, definitions, accelerated-death-benefit text, and severability closeout should remain separate from any later cleanup pass.
- The benefit-eligibility pages should remain visible as part of the same review-only slice instead of being widened into a separate wave.
- Cross references to Insurance Law and Federal tax qualification concepts should remain review-only context rather than being over-read as the main duty text.

Human review checklist:
- Is the extracted text still source-bound and review-only?
- Are the title page, the definitions, the accelerated-death-benefit provisions, and the severability closeout kept together only because the slice is intentionally narrow?
- Are the Insurance Law and Federal tax qualification references treated as cross-reference context, not substantive guidance?
- Is the page-image backstop visible for the title page, the benefit-eligibility pages, and the severability closeout?
- Are any items candidates for future learner-facing, app-ready, or RAG-ready promotion?

Promotion decision area:
- Keep review-only: [x]
- Revise extraction: [ ]
- Promote selected items to learner-facing draft: [ ]
- Prepare RAG-ready candidate set: [ ]
- Prepare app-export candidate set: [ ]

Recommended review order:
1. Title page and purpose.
2. Definitions and accelerated death benefit provisions.
3. Benefit-eligibility pages.
4. Severability closeout and page-image wording confirmation.

Relationship to other review artifacts:
- This wave sits alongside the completed NY regulation waves for Regulations 102, 127, 128, 136, 141, 179, 192, 210, and 213, but it remains its own NY-regulation source-family wave.
- It should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md` for the repository-level no-promotion posture.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.
