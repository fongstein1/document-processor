# Next Actions

## Next immediate task

Review the batch-002 VM-20 and VM-31 boundary questions, then decide whether
the next tiny batch should split the reserve-mechanics slice more cleanly or
capture later VM-31 reporting pages before any expansion.

## Build tasks

- Keep batch 001 and batch 002 review-only unless a human reviewer explicitly
  approves promotion.
- Keep using `scripts/batch-definitions.mjs` as the source of truth for tiny
  pilot selection and review metadata.
- Expand validation only if a later batch reveals a genuine schema or workflow
  gap.
- Keep app-ready export work deferred until a real promotion candidate exists.

## Source-family tasks

- Keep the NAIC valuation-manual core family isolated from future pricing and
  liability-modeling families.
- Expand the config only after the core VM course workflow proves stable.

## Hygiene tasks

- Keep raw source material out of Git.
- Keep generated heavy outputs in ignored working folders.
- Keep pilot batches tiny and review-first until the citation pattern is
  confirmed.
- Keep source-reference, unresolved-issues, and no-promotion coverage visible
  in pilot review packets.
- Commit only lightweight, auditable artifacts.
