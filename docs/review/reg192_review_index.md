# Regulation 192 Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

## Overall Regulation 192 Extraction Status

- The controlled Regulation 192 sequence is complete.
- The batch remains review-only by default.
- No extracted item is learner-facing.
- No extracted item is app-ready.
- No extracted item is RAG-ready.
- No extracted item is promoted.
- Source family: `ny_regulations`
- Source title: `Minimum Standards for Determining Reserve Liabilities and Non-Forfeiture Values for Preneed Life Insurance`
- Source reference: `New York Regulation 192 / 11 CRR-NY Part 102`
- Source status: active
- Source status note: current through March 15, 2020; page-image wording backstop remains required because the text layer is noisy / OCR-like.
- Planning-layer commit: `7eb502d` (`Fix Regulation 192 planning layer`)

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-266` | pages 1-3; opening title, purpose, applicability, definitions, and transition-rule window | Opening title, purpose, applicability, definitions, and transition rules | Keep the three-page regulation together as one bounded slice and stop at the page 3 boundary. | `state_regulation`, `jurisdiction_specific_requirement`, `regulatory_requirement`, `definition_or_terminology`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Noisy OCR-like text layer; page-image wording backstop; page locators primary; transition-rule wording needs confirmation; cross references to Regulation 179 and Regulation 126 remain review-only | Passed | `7eb502d` |

## Higher-Caution Areas

- The page-image wording backstop remains visible because the text layer is noisy / OCR-like.
- Page locators remain the primary anchor; stable line references are not expected to be reliable.
- The opening title, purpose, applicability, and definitions should remain separate from any later cleanup pass.
- The transition-rule window should stay in the same review-only slice unless a later human review explicitly asks for a split.
- The Regulation 179 and Regulation 126 references should remain mapped as cross-reference context rather than being over-read as the main duty text.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page locators sufficient for review and future re-checking?
- Are requirement, definition, and cross-reference distinctions correct?
- Are the transition-rule and opening sections kept together only because the slice is intentionally narrow?
- Are the Regulation 179 and Regulation 126 references treated as cross-reference context, not substantive guidance?
- Is the page-image backstop still visible?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for future RAG or app export?

## Promotion Decision Area

- Keep review-only: [x]
- Revise extraction: [ ]
- Promote selected items to learner-facing draft: [ ]
- Prepare RAG-ready candidate set: [ ]
- Prepare app-export candidate set: [ ]

## Recommended Review Order

1. Opening title, purpose, applicability, and definitions
2. Transition-rule language
3. Cross-reference confirmation against Regulation 179 and Regulation 126
4. Page-image wording confirmation against the raw PDF

## Relationship to Other Review Artifacts

- This wave sits alongside the completed NY regulation waves for Regulation 141, Regulation 210, and Regulation 213, but it remains its own NY-regulation source-family wave.
- It should be reviewed alongside `docs/review/reg210_review_index.md` and `docs/review/valuation_regulation_repository_poc_status.md` for consistent no-promotion posture.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.
