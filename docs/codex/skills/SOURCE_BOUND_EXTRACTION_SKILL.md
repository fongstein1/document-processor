# Source-Bound Extraction Skill

## Purpose

Keep extraction outputs traceable to source documents and chunk IDs.

## Rules

- Every output must resolve back to a source document and a stable chunk ID.
- Do not invent regulatory, actuarial, pricing, or modeling claims.
- Keep exact source text separate from paraphrase and summaries.
- When source support is unclear, label the item `needs_human_review`.
- Preserve page, section, or other locator references when they exist.
- When the PDF text layer is noisy or encoded, treat the page image as the
  backstop for exact wording and do not widen the batch because OCR looks
  uncertain.
