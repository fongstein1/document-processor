# Next Actions

## Next immediate task

Review the VM-20 extraction plan and decide whether the first planned
sub-batch should become the next tiny extraction run or stay on hold until the
boundary map is approved.

## Build tasks

- Keep batch 001 and batch 002 review-only unless a human reviewer explicitly
  approves promotion.
- Treat `docs/processor/vm20_extraction_plan.md` and
  `config/vm20-batch-plan.json` as the source of truth for the next VM-20
  planning step.
- Extend `scripts/batch-definitions.mjs` later, only when actual VM-20
  extraction batches are authorized.
- Expand validation only if the plan or a later batch reveals a genuine schema
  or workflow gap.
- Keep app-ready export work deferred until a real promotion candidate exists.

## Source-family tasks

- Keep the NAIC valuation-manual core family isolated from future pricing and
  liability-modeling families.
- Keep VM-20 planning review-only until the batch map is explicitly accepted.

## Hygiene tasks

- Keep raw source material out of Git.
- Keep generated heavy outputs in ignored working folders.
- Keep planned batches as lightweight docs/config only until extraction is
  authorized.
- Keep pilot batches tiny and review-first until the citation pattern is
  confirmed.
- Keep source-reference, unresolved-issues, and no-promotion coverage visible
  in pilot review packets.
- Commit only lightweight, auditable artifacts.
