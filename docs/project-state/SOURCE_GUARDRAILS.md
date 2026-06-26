# Source Guardrails

Use these rules for every document-processing, review, and export update.

## Core rules

- Keep exact source text separate from paraphrase, summaries, and examples.
- Do not invent regulatory, actuarial, pricing, or modeling requirements.
- Primary source support outranks practice notes, company practice, and
  generated summaries.
- Professional standards are separate from regulatory requirements.
- User-uploaded documents are not approved sources unless promoted through
  review.
- If source support cannot be found, flag it instead of promoting it.
- Conflicting sources should be surfaced clearly for human review.

## Promotion rules

- Treat every output as a draft candidate by default.
- Use `needs_human_review` when support is ambiguous or incomplete.
- Keep learner-facing content blocked until citation, wording, confidence, and
  review flags are all acceptable.
- Do not let illustrative material masquerade as binding source support.

## Privacy rules

- Do not commit raw internal documents, proprietary pricing files, liability
  model documentation, videos, large PDFs, or sensitive data.
- Flag sensitive files before processing or exporting.
- Use manifests, metadata, sanitized summaries, and lightweight exports.

## Portability rules

- Keep domain-specific assumptions isolated in config.
- The same processor should work for NAIC regulatory documents, pricing
  documents, liability modeling documents, and future governance/process
  material.

## Export rules

- App-ready exports must be lightweight, versioned, and easy to import.
- Exports should preserve source IDs, source references, chunk IDs, and review
  status.
- The app/product thread owns learner-facing UI and presentation.
