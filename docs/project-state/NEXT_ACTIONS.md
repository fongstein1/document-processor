# Next Actions

## Next immediate task

Review the batch-003 VM-20 overview output and decide whether page 47 stays in
the controlled overview batch or becomes the first mechanics slice for the
next VM-20 batch.

## Build tasks

- Keep batch 001 and batch 002 review-only unless a human reviewer explicitly
  approves promotion.
- Keep batch 003 review-only until the boundary decision is made.
- Treat `docs/processor/vm20_extraction_plan.md` and
  `config/vm20-batch-plan.json` as the source of truth for the next VM-20
  planning step.
- Use the new `npm run vm20:batch-003` entry for reruns or review refreshes
  when the controlled overview batch needs to be regenerated.
- Extend `scripts/batch-definitions.mjs` later, only when the next VM-20
  mechanics batch is authorized.
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
- Keep overview and mechanics-boundary excerpt windows distinct when a single
  source file needs to be split across controlled VM-20 batches.
- Commit only lightweight, auditable artifacts.
