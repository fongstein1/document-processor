# Regulation 151 Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-151-11-NYCRR-S099.pdf`
- Relative path from received inventory: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-151-11-NYCRR-S099.pdf`
- Full local path: `C:\Dev\NAIC Valuation Manual Course\NAIC Valuation Regulation\NY Regulations\2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-151-11-NYCRR-S099.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York Regulation 151 / 11 CRR-NY Part 99`
- Source title: `Valuation of Annuity, Single Premium Life Insurance, Guaranteed Interest Contract and Other Deposit Reserves`
- Source status: active
- Source status note: current through March 15, 2020; the page-image wording backstop remains required because the text layer is noisy / OCR-like and the source contains table-heavy reserve material.
- Page range: pages 1-52
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `2841bb4` (`Add Regulation 151 planning layer`)

Overall wave summary:
- The Regulation 151 wave is complete as a single 52-page, review-only slice.
- The full regulation was kept together so the title page, purpose / applicability language, annuity / deposit reserve standards, table-heavy reserve factors, and severability closeout stayed in one bounded unit.
- The page-image wording backstop remains required because the OCR-like text layer is noisy and the reserve-factor tables require exact human review.

Batch table:

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Planning Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-276` | pages 1-52; title page, purpose, applicability, annuity / deposit reserve standards, table-heavy factors, and severability | Regulation 151 purpose, applicability, annuity / deposit reserve standards, table-heavy factors, and severability | Keep the full 52-page regulation together as one bounded slice and stop at the page 52 boundary. | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `reporting_requirement`, `calculation_structure`, `table_or_factor_mapping`, `documentation_expectation`, `definition_or_terminology`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Noisy OCR-like text layer; page-image wording backstop; page locators primary; table-heavy reserve-factor pages require human interpretation | Passed | `2841bb4` |

Higher-caution areas:
- The page-image wording backstop remains visible because the text layer is noisy / OCR-like.
- Page locators remain the primary anchor; stable line references are not expected to be reliable.
- The title page, annuity / deposit reserve standards, table-heavy reserve factors, and severability closeout should remain together because the slice is intentionally bounded.
- The cross references to Insurance Law, Financial Services Law, statutory reserve formulae, and reserve-factor table material should stay review-only context rather than being over-read as the main duty text.
- Table-heavy reserve factors should not be reused without human confirmation against the page images.

Human review checklist:
- Is the extracted text still source-bound and review-only?
- Are the title page, table-heavy reserve middle pages, and severability closeout kept together only because the slice is intentionally bounded?
- Are the Insurance Law, Financial Services Law, statutory-reserve-formula, and reserve-factor references treated as cross-reference context, not substantive guidance?
- Is the page-image backstop visible for the title page, table-heavy reserve pages, and severability closeout?
- Are any items candidates for future learner-facing, app-ready, or RAG-ready promotion?

Promotion decision area:
- Keep review-only: [x]
- Revise extraction: [ ]
- Promote selected items to learner-facing draft: [ ]
- Prepare RAG-ready candidate set: [ ]
- Prepare app-export candidate set: [ ]

Recommended review order:
1. Title page and purpose / applicability language.
2. Annuity / deposit reserve standards.
3. Table-heavy reserve-factor pages.
4. Severability closeout and page-image wording confirmation.

Relationship to other review artifacts:
- This wave sits alongside the completed NY regulation waves for Regulations 56, 102, 126, 127, 128, 136, 141, 143, 147, 179, 192, 210, and 213, but it remains its own NY-regulation source-family wave.
- It should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md` for the repository-level no-promotion posture.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.
