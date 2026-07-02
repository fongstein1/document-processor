# Regulation 147 Self Review

## Overall Assessment

- Classification: `reasonable_with_minor_cautions`
- Source family: `ny_regulations`
- Source title: `Valuation of Life Insurance Reserves`
- Source reference: `New York Regulation 147 / 11 CRR-NY Part 98`
- Source status: active
- Planning-layer commit: `b0a132c`

## Batch Review

| Batch ID | Selected Pages / Sections | Self-Review Classification | Main Cautions | Validation |
| --- | --- | --- | --- | --- |
| `batch-275` | pages 1-40; title page, purpose, applicability, definitions, reserve standards, mortality / interest / method provisions, and severability | `reasonable_with_minor_cautions` | Page-image wording backstop remains required; the text layer is noisy / OCR-like; page locators are primary; cross references should stay non-interpretive; reserve-standards pages need human interpretation | Passed |

## Self-Review Notes

- The selected page window matched the planned 40-page boundary.
- The extraction stayed source-bound and review-only.
- The title page, purpose / applicability / definitions language, reserve standards, mortality / interest / method provisions, and severability closeout remain in one bounded slice by design.
- Page locators are the primary anchor, with the page image as the wording backstop because the text layer is noisy.
- The unresolved issue is specific and useful rather than generic filler.
- No item was marked learner-facing, app-ready, RAG-ready, or promoted.
- Stable line references are not expected to be reliable for this PDF.

## Human Review Summary

- Confirm the page-image wording for the title page, reserve-standards middle pages, and severability closeout before any later reuse.
- Confirm that Insurance Law, Financial Services Law, mortality-table, and reserve-method references stay mapped as cross-reference context and are not over-read.
- Confirm that the 40-page regulation remains one review-only unit unless a later human review explicitly asks for a split.
