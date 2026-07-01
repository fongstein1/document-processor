# Regulation 136 Self Review

## Overall Assessment

- Classification: `reasonable_with_minor_cautions`
- Source family: `ny_regulations`
- Source title: `Individual Life Insurance Market-Value Adjustment`
- Source reference: `New York Regulation 136 / 11 CRR-NY Part 43`
- Source status: active
- Planning-layer commit: `8e45bf5`

## Batch Review

| Batch ID | Selected Pages / Sections | Self-Review Classification | Main Cautions | Validation |
| --- | --- | --- | --- | --- |
| `batch-271` | pages 1-23; title page, market-value adjustment formula, noncompliance, and severability | `reasonable_with_minor_cautions` | Page-image wording backstop remains required; the text layer is noisy / OCR-like; page locators are primary; cross references should stay non-interpretive | Passed |

## Self-Review Notes

- The selected page window matched the planned 23-page boundary.
- The extraction stayed source-bound and review-only.
- The title page, market-value-adjustment formula language, and severability closeout remain in one bounded slice by design.
- Page locators are the primary anchor, with the page image as the wording backstop because the text layer is noisy.
- The unresolved issue is specific and useful rather than generic filler.
- No item was marked learner-facing, app-ready, RAG-ready, or promoted.
- Stable line references are not expected to be reliable for this PDF.

## Human Review Summary

- Confirm the page-image wording for the title page and the severability closeout before any later reuse.
- Confirm that Insurance Law and market-value-adjustment references stay mapped as cross-reference context and are not over-read.
- Confirm that the formula-heavy middle pages remain one review-only unit unless a later human review explicitly asks for a split.
