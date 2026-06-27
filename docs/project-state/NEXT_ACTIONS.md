# Next Actions

## Next immediate task

Review the completed supporting-wave review packets and decide whether any
later refinement or promotion discussion is needed.

## Build tasks

- Keep batches 001 through 012 review-only unless a human reviewer explicitly
  approves promotion.
- Keep batches 013 through 021 review-only unless a human reviewer explicitly
  approves promotion.
- Treat `docs/processor/vm20_extraction_plan.md`,
  `config/vm20-batch-plan.json`, and `docs/review/vm20_review_index.md` as
  the current controlled VM-20 handoff set.
- Treat `docs/processor/supporting_vm_chapters_extraction_plan.md` and
  `config/supporting-vm-batch-plan.json` as the current supporting-chapter
  planning set.
- Use `npm run vm20:batch-003` through `npm run vm20:batch-012` only if a
  review packet needs to be regenerated.
- Use `npm run pilot -- --batch batch-013` through `npm run pilot -- --batch
  batch-021` only if a supporting review packet needs to be regenerated.
- Keep `scripts/batch-definitions.mjs` synchronized with the planned VM-20
  batch IDs, the supporting batch IDs, the actual source order, and the
  tracked review index.
- Leave VM-21 and VM-22 out of the supporting wave unless a separate plan is
  approved.
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
- Keep the tracked review index aligned with the ignored review packets so it
  remains a summary aid rather than a promoted artifact.
- Keep the supporting-chapter plan aligned with the observed page windows for
  VM-01, VM-02, VM-25, VM-26, VM-30, and VM-31, and keep VM-21 and VM-22 out
  of that wave.
- Keep the supporting-wave batch registry keyed by full `batch-###` IDs so the
  runner and validator stay synchronized.
- Keep all completed VM-20 slices review-only until a deliberate promotion
  decision is made in the separate app/product thread.
- Keep the PDF extraction runner UTF-8-safe because formula pages can include
  Unicode minus signs and other non-ASCII glyphs.
- Commit only lightweight, auditable artifacts.
