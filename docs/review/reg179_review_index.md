# Regulation 179 Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-179-11-NYCRR-S100.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York Regulation 179 / 11 CRR-NY Part 100`
- Source title: `Recognition of the 2001 CSO Mortality Table and the 2017 CSO Mortality Table for Use in Determining Minimum Reserve Liabilities and Nonforfeiture Benefits and Recognition and Application of Preferred Mortality Tables for Use in Determining Minimum Reserve Liabilities`
- Source status: active
- Source status note: current through March 15, 2020; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- Page range: pages 1-22
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `aa88d7a` (`Add Regulation 179 planning layer`)

Overall wave summary:
- The Regulation 179 wave is complete as a single 22-page, review-only slice.
- The batch stayed source-bound and kept the title page, mortality-table recognition language, adjusted `q_x` table, and severability material together.
- The table-heavy middle pages remain part of the same review-only unit rather than a separate promotion target.

Batch table:

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Planning Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-270` | pages 1-22; title page, purposes, mortality-table recognition and application, adjusted `q_x` table, and severability | Regulation 179 purpose, mortality table recognition and application, adjusted qx table, and severability | Keep the full 22-page regulation together as one bounded slice and stop at the page 22 boundary. | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `reporting_requirement`, `documentation_expectation`, `governance_or_control_expectation`, `calculation_structure`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Noisy OCR-like text layer; page-image wording backstop; page locators primary; cross-reference mapping should remain non-interpretive | Passed | `aa88d7a` |

Higher-caution areas:
- The page-image wording backstop remains visible because the text layer is noisy / OCR-like.
- Page locators remain the primary anchor; stable line references are not expected to be reliable.
- The title page, mortality-table language, and severability closeout should remain separate from any later cleanup pass.
- The table-heavy mortality-table pages should remain visible as part of the same review-only slice instead of being widened into a separate wave.
- Cross references to Insurance Law and mortality-table concepts should remain review-only context rather than being over-read as the main duty text.

Human review checklist:
- Is the extracted text still source-bound and review-only?
- Are the title page, the mortality-table recognition language, and the severability closeout kept together only because the slice is intentionally narrow?
- Are the Insurance Law and mortality-table references treated as cross-reference context, not substantive guidance?
- Is the page-image backstop visible for the title page, the table-heavy middle pages, and the severability closeout?
- Are any items candidates for future learner-facing, app-ready, or RAG-ready promotion?

Promotion decision area:
- Keep review-only: [x]
- Revise extraction: [ ]
- Promote selected items to learner-facing draft: [ ]
- Prepare RAG-ready candidate set: [ ]
- Prepare app-export candidate set: [ ]

Recommended review order:
1. Title page and purposes.
2. Mortality-table recognition and application language.
3. Adjusted `q_x` table and table-heavy middle pages.
4. Severability closeout and page-image wording confirmation.

Relationship to other review artifacts:
- This wave sits alongside the completed NY regulation waves for Regulations 102, 127, 128, 141, 192, 210, and 213, but it remains its own NY-regulation source-family wave.
- It should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md` for the repository-level no-promotion posture.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.
