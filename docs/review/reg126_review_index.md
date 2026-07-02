# Regulation 126 Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-126-11-NYCRR-S095.pdf`
- Relative path from received inventory: `NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-126-11-NYCRR-S095.pdf`
- Full local path: `C:\Dev\NAIC Valuation Manual Course\NAIC Valuation Regulation\NY Regulations\2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-126-11-NYCRR-S095.pdf`
- Source family: NY regulations
- Jurisdiction: New York
- Source reference: `New York Regulation 126 / 11 CRR-NY Part 95`
- Source title: `Regulations Governing an Actuarial Opinion and Memorandum`
- Source status: active
- Source status note: current through March 15, 2020; section 95.0 and sections 95.13 to 95.19 are repealed and should remain boundary context only; the page-image wording backstop remains required because the text layer is noisy / OCR-like.
- Page range: pages 1-30
- Line references: not expected to be stable; page locators are the primary anchor
- Planning commit: `504bee2` (`Add Regulation 126 planning layer`)

Overall wave summary:
- The Regulation 126 wave is complete as a single 30-page, review-only slice.
- The full regulation was kept together so the title page, purpose / authority / scope language, actuarial opinion and memorandum requirements, and repealed closeout stayed in one bounded unit.
- The page-image wording backstop remains required because the OCR-like text layer is noisy, especially for exact regulatory wording.

Batch table:

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Planning Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-274` | pages 1-30; title page, purpose, authority, scope, actuarial opinion and memorandum requirements, and repealed closeout | Regulation 126 purpose, authority, scope, actuarial opinion and memorandum requirements, and repealed closeout | Keep the full 30-page regulation together as one bounded slice and stop at the page 30 boundary. | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `reporting_requirement`, `documentation_expectation`, `governance_or_control_expectation`, `definition_or_terminology`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Noisy OCR-like text layer; page-image wording backstop; page locators primary; memorandum-heavy middle pages require human interpretation | Passed | `504bee2` |

Higher-caution areas:
- The page-image wording backstop remains visible because the text layer is noisy / OCR-like.
- Page locators remain the primary anchor; stable line references are not expected to be reliable.
- The title page, purpose / authority / scope language, actuarial opinion and memorandum requirements, and repealed closeout should remain together because the slice is intentionally narrow.
- The cross references to Insurance Law sections and memorandum-support material should stay review-only context rather than being over-read as the main duty text.
- The repealed closeout should remain boundary context only and not be reinterpreted as live text.

Human review checklist:
- Is the extracted text still source-bound and review-only?
- Are the title page, opinion/memorandum requirements, and repealed closeout kept together only because the slice is intentionally narrow?
- Are the Insurance Law and memorandum-support references treated as cross-reference context, not substantive guidance?
- Is the page-image backstop visible for the title page, the memorandum-heavy middle pages, and the repealed closeout?
- Are any items candidates for future learner-facing, app-ready, or RAG-ready promotion?

Promotion decision area:
- Keep review-only: [x]
- Revise extraction: [ ]
- Promote selected items to learner-facing draft: [ ]
- Prepare RAG-ready candidate set: [ ]
- Prepare app-export candidate set: [ ]

Recommended review order:
1. Title page and purpose / authority / scope language.
2. Actuarial opinion and memorandum requirements.
3. Repealed closeout and page-image wording confirmation.

Relationship to other review artifacts:
- This wave sits alongside the completed NY regulation waves for Regulations 56, 102, 127, 128, 136, 141, 143, 179, 192, 210, and 213, but it remains its own NY-regulation source-family wave.
- It should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md` for the repository-level no-promotion posture.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.
