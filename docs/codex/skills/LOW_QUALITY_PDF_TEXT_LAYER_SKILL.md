# Low-Quality PDF Text Layer Skill

Use this skill when a PDF text layer is noisy, encoded, partially missing, or
otherwise unreliable for exact wording.

## Core rules

- Prefer page locators over line references when the text layer does not
  support stable line mapping.
- Keep the page image as the wording backstop when OCR is noisy.
- State explicitly when line references are not available so reviewers do not
  infer a precision level that the text layer cannot support.
- Use the phrase "page-image wording backstop" in review notes when the page
  image is the authority for exact wording.
- Do not overclaim exact wording from an uncertain text layer.
- Keep review packets and unresolved-issues notes explicit about the text-layer
  caveat.
- If the source is still usable but imperfect, classify the batch as
  `reasonable_with_minor_cautions` or an equivalent cautious review state.
- If the text layer is too weak to support source-bound extraction, stop and
  mark the batch `stop_for_human_review`.

## Review posture

- Keep the batch review-only.
- Do not promote learner-facing, app-ready, or RAG-ready content from a noisy
  text layer unless the page image and the source support are confirmed.
- Preserve source references, page ranges, and boundary notes even when the OCR
  is imperfect.

## When to use

- scanned or encoded regulatory PDFs
- guideline PDFs with broken OCR
- table-heavy pages where the text extraction is incomplete
- batch packets that need a page-image wording backstop
- repeated noisy-text guideline slices where the same caution pattern is likely
  to recur in future batches

## When not to use

- clean text sources with stable line references
- structured plain-text sources
- cases where a different source-bound or promotion-gating skill is the primary
  control
