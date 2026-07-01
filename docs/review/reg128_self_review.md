# Regulation 128 Self Review

## Overall Assessment

- Classification: `reasonable_with_minor_cautions`
- Source family: `ny_regulations`
- Source title: `Market Value Separate Accounts Funding Guaranteed Benefits; Separate Accounts Operations and Reserve Requirements`
- Source reference: `New York Regulation 128 / 11 CRR-NY Part 97`
- Source status: active
- Planning-layer commit: `dcfde3d`

## Batch Review

| Batch ID | Selected Pages / Sections | Self-Review Classification | Main Cautions | Validation |
| --- | --- | --- | --- | --- |
| `batch-268` | pages 1-19; purpose, plan of operations, asset maintenance requirements, reserve valuation, and severability | `reasonable_with_minor_cautions` | Page-image wording backstop remains required; the text layer is noisy / OCR-like; page locators are primary; table-heavy middle pages need care; cross references should stay non-interpretive | Passed |

## Self-Review Notes

- The selected page window matched the planned 19-page boundary.
- The extraction stayed source-bound and review-only.
- The opening title page, table-heavy middle pages, and severability closeout remain in one bounded slice by design.
- Page locators are the primary anchor, with the page image as the wording backstop because the text layer is noisy.
- The unresolved issue is specific and useful rather than generic filler.
- No item was marked learner-facing, app-ready, RAG-ready, or promoted.
- Stable line references are not expected to be reliable for this PDF.

## Human Review Summary

- Confirm the page-image wording for the title page and the severability closeout before any later reuse.
- Confirm that Insurance Law and separate-account references stay mapped as cross-reference context and are not over-read.
- Confirm that the table-heavy asset-maintenance pages remain one review-only unit unless a later human review explicitly asks for a split.
