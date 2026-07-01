# Regulation 128 Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-128-11-NYCRR-S097.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York Regulation 128 / 11 CRR-NY Part 97`
- Source title: `Market Value Separate Accounts Funding Guaranteed Benefits; Separate Accounts Operations and Reserve Requirements`
- Source status: active
- Source status note: current through March 15, 2020; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- Page range: pages 1-19
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `dcfde3d` (`Fix Regulation 128 planning layer`)

Overall wave summary:
- The Regulation 128 wave is complete as a single 19-page, review-only slice.
- The batch stayed source-bound and kept the purpose, plan of operations, asset-maintenance, reserve-valuation, and severability material together.
- The table-heavy middle pages remain part of the same review-only unit rather than a separate promotion target.

Batch table:

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Planning Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-268` | pages 1-19; purpose, plan of operations, asset maintenance requirements, reserve valuation, and severability | Regulation 128 purpose, plan of operations, asset maintenance requirements, reserve valuation, and severability | Keep the full 19-page regulation together as one bounded slice and stop at the page 19 boundary. | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `reporting_requirement`, `documentation_expectation`, `governance_or_control_expectation`, `asset_modeling_judgment`, `calculation_structure`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Noisy OCR-like text layer; page-image wording backstop; page locators primary; table-heavy middle pages; cross-reference mapping should remain non-interpretive | Passed | `dcfde3d` |

Higher-caution areas:
- The page-image wording backstop remains visible because the text layer is noisy / OCR-like.
- Page locators remain the primary anchor; stable line references are not expected to be reliable.
- The purpose, plan of operations, asset-maintenance, and reserve-valuation text should remain separate from any later cleanup pass.
- The table-heavy middle pages should remain visible as part of the same review-only slice instead of being widened into a separate wave.
- Cross references to Insurance Law and separate-account asset classes should remain review-only context rather than being over-read as the main duty text.

Human review checklist:
- Is the extracted text still source-bound and review-only?
- Are the opening title page, the table-heavy middle pages, and the severability closeout kept together only because the slice is intentionally narrow?
- Are the Insurance Law and separate-account references treated as cross-reference context, not substantive guidance?
- Is the page-image backstop visible for the title page, the table pages, and the severability closeout?
- Are any items candidates for future learner-facing, app-ready, or RAG-ready promotion?

Promotion decision area:
- Keep review-only: [x]
- Revise extraction: [ ]
- Promote selected items to learner-facing draft: [ ]
- Prepare RAG-ready candidate set: [ ]
- Prepare app-export candidate set: [ ]

Recommended review order:
1. Title page and purpose / legislative background.
2. Plan of operations and asset maintenance requirements.
3. Reserve valuation and table-based asset deductions.
4. Severability closeout and page-image wording confirmation.

Relationship to other review artifacts:
- This wave sits alongside the completed NY regulation waves for Regulations 102, 141, 192, 210, and 213, but it remains its own NY-regulation source-family wave.
- It should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md` for the repository-level no-promotion posture.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.
