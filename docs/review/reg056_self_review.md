# Regulation 56 Self Review

## Overall Assessment

- Classification: `reasonable_with_minor_cautions`
- Source family: `ny_regulations`
- Source title: `Valuation of Individual and Group Accident and Health Insurance Reserves`
- Source reference: `New York Regulation 56 / 11 CRR-NY Part 94`
- Source status: active
- Planning-layer commit: `78c669c`

## Batch Review

| Batch ID | Selected Pages / Sections | Self-Review Classification | Main Cautions | Validation |
| --- | --- | --- | --- | --- |
| `batch-273` | pages 1-27; title page, purpose, applicability, reserve guidance, incorporated material, and repealed closeout | `reasonable_with_minor_cautions` | Page-image wording backstop remains required; the text layer is noisy / OCR-like; page locators are primary; cross references should stay non-interpretive; table-heavy pages need human interpretation | Passed |

## Self-Review Notes

- The selected page window matched the planned 27-page boundary.
- The extraction stayed source-bound and review-only.
- The title page, reserve guidance, incorporated material, and repealed closeout remain in one bounded slice by design.
- Page locators are the primary anchor, with the page image as the wording backstop because the text layer is noisy.
- The unresolved issue is specific and useful rather than generic filler.
- No item was marked learner-facing, app-ready, RAG-ready, or promoted.
- Stable line references are not expected to be reliable for this PDF.

## Human Review Summary

- Confirm the page-image wording for the title page and the repealed closeout before any later reuse.
- Confirm that Insurance Law and incorporated valuation-table references stay mapped as cross-reference context and are not over-read.
- Confirm that the table-heavy reserve-guidance pages remain one review-only unit unless a later human review explicitly asks for a split.
