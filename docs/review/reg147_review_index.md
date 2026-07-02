# Regulation 147 Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-147-11-NYCRR-S098.pdf`
- Relative path from received inventory: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-147-11-NYCRR-S098.pdf`
- Full local path: `C:\Dev\NAIC Valuation Manual Course\NAIC Valuation Regulation\NY Regulations\2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-147-11-NYCRR-S098.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York Regulation 147 / 11 CRR-NY Part 98`
- Source title: `Valuation of Life Insurance Reserves`
- Source status: active
- Source status note: current through March 15, 2020; section 98.0 is repealed and should remain boundary context only; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- Page range: pages 1-40
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `b0a132c` (`Add Regulation 147 planning layer`)

Overall wave summary:
- The Regulation 147 wave is complete as a single 40-page, review-only slice.
- The full regulation was kept together so the title page, purpose / applicability / definitions language, reserve standards, mortality / interest / method provisions, and severability closeout stayed in one bounded unit.
- The page-image wording backstop remains required because the OCR-like text layer is noisy, especially for exact regulatory wording.

Batch table:

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Planning Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-275` | pages 1-40; title page, purpose, applicability, definitions, reserve standards, mortality / interest / method provisions, and severability | Regulation 147 purpose, applicability, definitions, reserve standards, mortality / interest / method provisions, and severability | Keep the full 40-page regulation together as one bounded slice and stop at the page 40 boundary. | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `reporting_requirement`, `calculation_structure`, `documentation_expectation`, `definition_or_terminology`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Noisy OCR-like text layer; page-image wording backstop; page locators primary; reserve-standards middle pages require human interpretation | Passed | `b0a132c` |

Higher-caution areas:
- The page-image wording backstop remains visible because the text layer is noisy / OCR-like.
- Page locators remain the primary anchor; stable line references are not expected to be reliable.
- The title page, purpose / applicability / definitions language, reserve standards, mortality / interest / method provisions, and severability closeout should remain together because the slice is intentionally bounded.
- The cross references to Insurance Law, Financial Services Law, mortality-table standards, and reserve-method material should stay review-only context rather than being over-read as the main duty text.
- The repealed 98.0 material should remain boundary context only and not be reinterpreted as live text.

Human review checklist:
- Is the extracted text still source-bound and review-only?
- Are the title page, reserve-standards middle pages, and severability closeout kept together only because the slice is intentionally bounded?
- Are the Insurance Law, Financial Services Law, mortality-table, and reserve-method references treated as cross-reference context, not substantive guidance?
- Is the page-image backstop visible for the title page, reserve-standards pages, and severability closeout?
- Are any items candidates for future learner-facing, app-ready, or RAG-ready promotion?

Promotion decision area:
- Keep review-only: [x]
- Revise extraction: [ ]
- Promote selected items to learner-facing draft: [ ]
- Prepare RAG-ready candidate set: [ ]
- Prepare app-export candidate set: [ ]

Recommended review order:
1. Title page and purpose / applicability language.
2. Definitions and reserve standards.
3. Mortality / interest / method provisions.
4. Severability closeout and page-image wording confirmation.

Relationship to other review artifacts:
- This wave sits alongside the completed NY regulation waves for Regulations 56, 102, 126, 127, 128, 136, 141, 143, 179, 192, 210, and 213, but it remains its own NY-regulation source-family wave.
- It should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md` for the repository-level no-promotion posture.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.
