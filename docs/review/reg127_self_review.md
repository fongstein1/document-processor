# Regulation 127 Self Review

## Overall Assessment

- Classification: `reasonable_with_minor_cautions`
- Source family: `ny_regulations`
- Source title: `Market-Value Adjustments; Withdrawal Charges, Availability of Cash Values`
- Source reference: `New York Regulation 127 / 11 CRR-NY Part 44`
- Source status: active
- Planning-layer commit: `6c642c4`

## Batch Review

| Batch ID | Selected Pages / Sections | Self-Review Classification | Main Cautions | Validation |
| --- | --- | --- | --- | --- |
| `batch-269` | pages 1-20; purpose, legislative background, plan of operations, asset maintenance, noncompliance, and severability | `reasonable_with_minor_cautions` | Page-image wording backstop remains required; the text layer is noisy / OCR-like; page locators are primary; cross references should stay non-interpretive | Passed |

## Self-Review Notes

- The selected page window matched the planned 20-page boundary.
- The extraction stayed source-bound and review-only.
- The title page, market-value-adjustment mechanics, and severability closeout remain in one bounded slice by design.
- Page locators are the primary anchor, with the page image as the wording backstop because the text layer is noisy.
- The unresolved issue is specific and useful rather than generic filler.
- No item was marked learner-facing, app-ready, RAG-ready, or promoted.
- Stable line references are not expected to be reliable for this PDF.

## Human Review Summary

- Confirm the page-image wording for the title page and the severability closeout before any later reuse.
- Confirm that Insurance Law and market-value-adjustment references stay mapped as cross-reference context and are not over-read.
- Confirm that the market-value-adjustment mechanics pages remain one review-only unit unless a later human review explicitly asks for a split.
