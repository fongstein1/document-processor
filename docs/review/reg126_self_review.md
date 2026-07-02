# Regulation 126 Self Review

## Overall Assessment

- Classification: `reasonable_with_minor_cautions`
- Source family: `ny_regulations`
- Source title: `Regulations Governing an Actuarial Opinion and Memorandum`
- Source reference: `New York Regulation 126 / 11 CRR-NY Part 95`
- Source status: active
- Planning-layer commit: `504bee2`

## Batch Review

| Batch ID | Selected Pages / Sections | Self-Review Classification | Main Cautions | Validation |
| --- | --- | --- | --- | --- |
| `batch-274` | pages 1-30; title page, purpose, authority, scope, actuarial opinion and memorandum requirements, and repealed closeout | `reasonable_with_minor_cautions` | Page-image wording backstop remains required; the text layer is noisy / OCR-like; page locators are primary; cross references should stay non-interpretive; memorandum-heavy pages need human interpretation | Passed |

## Self-Review Notes

- The selected page window matched the planned 30-page boundary.
- The extraction stayed source-bound and review-only.
- The title page, purpose / authority / scope language, actuarial opinion and memorandum requirements, and repealed closeout remain in one bounded slice by design.
- Page locators are the primary anchor, with the page image as the wording backstop because the text layer is noisy.
- The unresolved issue is specific and useful rather than generic filler.
- No item was marked learner-facing, app-ready, RAG-ready, or promoted.
- Stable line references are not expected to be reliable for this PDF.

## Human Review Summary

- Confirm the page-image wording for the title page, memorandum-heavy middle pages, and repealed closeout before any later reuse.
- Confirm that Insurance Law and memorandum-support references stay mapped as cross-reference context and are not over-read.
- Confirm that the 30-page regulation remains one review-only unit unless a later human review explicitly asks for a split.
