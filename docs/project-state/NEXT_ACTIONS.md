# Next Actions

## Next immediate task

Choose the first small source batch and decide which family will be used for
the pilot. The `batch-001` scaffold is ready.

## Build tasks

- Create inventory extraction logic for the selected batch.
- Add chunk manifest generation with stable IDs and source references.
- Add review-packet generation focused on exceptions and promotion candidates.
- Add a sanitized app-ready export shape that does not change the app UI.
- Add validation checks for source references, chunk IDs, and learner-facing
  eligibility.
- Use the external raw source root and keep every raw file out of Git.

## Source-family tasks

- Keep the NAIC valuation-manual family isolated from future pricing and
  liability-modeling families.
- Expand the config only after the first pilot proves the workflow.

## Hygiene tasks

- Keep raw source material out of Git.
- Keep generated heavy outputs in ignored working folders.
- Commit only lightweight, auditable artifacts.
