# Next Actions

## Next immediate task

Run batch-009 on the Section 6 exclusion-test slice, then continue through the
remaining re-bound VM-20 batches in order.

## Build tasks

- Keep batch 001 and batch 002 review-only unless a human reviewer explicitly
  approves promotion.
- Keep batch 003 review-only until the boundary decision is made.
- Keep batch 004 review-only until the mechanics-start decision is made.
- Keep batch 005 review-only until the Section 3.C boundary decision is made.
- Keep batches 006, 007, and 008 review-only until their respective boundary
  decisions are made.
- Treat `docs/processor/vm20_extraction_plan.md` and
  `config/vm20-batch-plan.json` as the source of truth for the remaining
  controlled VM-20 batches.
- Use `npm run vm20:batch-009` through `npm run vm20:batch-012` for reruns or
  review refreshes when the remaining controlled Section 6 to Section 9
  slices need to be regenerated.
- Keep `scripts/batch-definitions.mjs` synchronized with the planned batch
  IDs and actual source order.
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
- Keep role-map completion separate from detailed mechanics so batch numbering
  stays easy to reason about.
- Keep the NPR setup slice and formula slice together in a narrow review-only
  entry batch, but stop before Section 3.C assumptions.
- Keep the Section 3.C assumption slice separate from the Section 4 and
  Section 5 entry points, then split Section 7 into structure and asset
  mechanics batches before the final reinsurance boundary batch.
- Keep the Section 6 exclusion tests separate from the Section 7 cash-flow
  model slices, and keep the Section 8 reinsurance boundary distinct from the
  Section 9 assumptions cleanup.
- Keep the PDF extraction runner UTF-8-safe because formula pages can include
  Unicode minus signs and other non-ASCII glyphs.
- Commit only lightweight, auditable artifacts.
