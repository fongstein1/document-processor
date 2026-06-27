# Next Actions

## Next immediate task

AG 06 is complete in ignored working storage and its review index plus
self-review note now form the current handoff set. AG 07 is complete in
ignored working storage and its review index plus self-review note now form
the current handoff set. AG 08 is complete in ignored working storage and
its review index plus self-review note now form the current handoff set. AG
09 is the next short guideline candidate after a limited inspection, and its
planning layer is now validated so `batch-084` can run next in review-only
mode. AG 05 is already captured in the tracked review handoff set, and AG
03, AG 01, AG 02, and AG 04 remain captured as well. AG 52 is already
captured in the mixed pilot batch and should not be reprocessed.

## Build tasks

- Keep batches 001 through 012 review-only unless a human reviewer explicitly
  approves promotion.
- Keep batches 013 through 021 review-only unless a human reviewer explicitly
  approves promotion.
- Treat `docs/processor/vm20_extraction_plan.md`,
  `config/vm20-batch-plan.json`, and `docs/review/vm20_review_index.md` as
  the current controlled VM-20 handoff set.
- Treat `docs/review/supporting_vm_review_index.md` as the current
  supporting-wave handoff summary.
- Treat `docs/review/vm21_review_index.md` as the current VM-21 handoff
  summary.
- Treat `docs/processor/vm22_extraction_plan.md` and
  `config/vm22-batch-plan.json` as the current VM-22 planning set.
- Treat `docs/review/vm22_review_index.md` as the current VM-22 handoff
  summary.
- Treat `docs/review/vm20_practice_note_review_index.md` and
  `docs/review/vm20_practice_note_self_review.md` as the current practice-note
  handoff set.
- Treat `docs/processor/ag03_extraction_plan.md` and
  `config/ag03-batch-plan.json` as the current AG 03 planning set.
- Treat `docs/review/ag03_review_index.md` and
  `docs/review/ag03_self_review.md` as the current AG 03 handoff set.
- Treat `docs/processor/ag01_extraction_plan.md` and
  `config/ag01-batch-plan.json` as the current AG 01 planning set.
- Treat `docs/review/ag01_review_index.md` and
  `docs/review/ag01_self_review.md` as the current AG 01 handoff set.
- Treat `docs/processor/ag02_extraction_plan.md` and
  `config/ag02-batch-plan.json` as the current AG 02 planning set.
- Treat `docs/review/ag02_review_index.md` and
  `docs/review/ag02_self_review.md` as the current AG 02 handoff set.
- Treat `docs/processor/ag04_extraction_plan.md` and
  `config/ag04-batch-plan.json` as the current AG 04 planning set, and treat
  `docs/review/ag04_review_index.md` and `docs/review/ag04_self_review.md`
  as the current AG 04 handoff set.
- Treat `docs/processor/ag05_extraction_plan.md` and
  `config/ag05-batch-plan.json` as the current AG 05 planning set, and
  treat `docs/review/ag05_review_index.md` and
  `docs/review/ag05_self_review.md` as the current AG 05 handoff set.
- Treat `docs/processor/ag06_extraction_plan.md` and
  `config/ag06-batch-plan.json` as the current AG 06 planning set.
- Treat `docs/review/ag06_review_index.md` and `docs/review/ag06_self_review.md`
  as the current AG 06 handoff set.
- Treat `docs/processor/ag07_extraction_plan.md` and
  `config/ag07-batch-plan.json` as the current AG 07 planning set, and treat
  `docs/review/ag07_review_index.md` and `docs/review/ag07_self_review.md`
  as the current AG 07 handoff set.
- Treat `scripts/ag04-batch-definitions.mjs` as synchronized with the AG 04
  planning and handoff set.
- Treat `scripts/ag05-batch-definitions.mjs` as synchronized with the AG 05
  planning set.
- Treat `scripts/ag06-batch-definitions.mjs` as synchronized with the AG 06
  planning and handoff set.
- Treat `scripts/ag07-batch-definitions.mjs` as synchronized with the AG 07
  planning and handoff set.
- Use `npm run ag04:batch` only if the AG 04 review packet needs to be
  regenerated.
- Use `npm run ag05:batch` only if the AG 05 review packet needs to be
  regenerated.
- Use `npm run ag06:batch` only if the AG 06 review packet needs to be
  regenerated.
- Keep `docs/review/ag06_review_index.md` and `docs/review/ag06_self_review.md`
  synchronized with the ignored AG 06 review packet if the wave is ever
  regenerated.
- Use `npm run ag07:batch` only if the AG 07 review packet needs to be
  regenerated.
- Keep `docs/review/ag07_review_index.md` and `docs/review/ag07_self_review.md`
  synchronized with the ignored AG 07 review packet if the wave is ever
  regenerated.
- Keep the AG 04 batch review-only unless a later human review explicitly
  approves promotion.
- Keep the AG 05 batch review-only unless a later human review explicitly
  approves promotion.
- Keep the AG 05 review index and self-review note synchronized with the
  ignored AG 05 review packet if the wave is ever regenerated.
- Keep the AG 06 batch review-only unless a later human review explicitly
  approves promotion.
- Keep the AG 07 batch review-only unless a later human review explicitly
  approves promotion.
- Treat `docs/review/valuation_regulation_repository_poc_status.md` as the
  current repository-level proof-of-concept summary.
- Treat `docs/processor/vm20_practice_note_extraction_plan.md` and
  `config/vm20-practice-note-batch-plan.json` as the current practice-note
  planning set.
- Treat batches 038-054 as completed in ignored working storage.
- Treat `docs/processor/supporting_vm_chapters_extraction_plan.md` and
  `config/supporting-vm-batch-plan.json` as the current supporting-chapter
  planning set.
- Treat `docs/processor/vm21_extraction_plan.md` and
  `config/vm21-batch-plan.json` as the current VM-21 planning set.
- Use `node scripts/run-pilot-batch.mjs --batch batch-038` through
  `node scripts/run-pilot-batch.mjs --batch batch-054` only if a VM-22
  review packet needs to be regenerated.
- Use `node scripts/run-pilot-batch.mjs --batch batch-048` through
  `node scripts/run-pilot-batch.mjs --batch batch-054` only if a VM-22 review
  packet needs to be regenerated.
- Use `npm run vm20:batch-003` through `npm run vm20:batch-012` only if a
  review packet needs to be regenerated.
- Use `npm run pilot -- --batch batch-013` through `npm run pilot -- --batch
  batch-021` only if a supporting review packet needs to be regenerated.
- Use `npm run vm21:batch -- --batch batch-022` through
  `npm run vm21:batch -- --batch batch-037` only if a VM-21 review packet
  needs to be regenerated.
- Keep the completed VM-21 batches review-only unless a later human review
  explicitly approves promotion.
- Keep `docs/review/vm21_review_index.md` aligned with the ignored VM-21
  review packets so it remains a summary aid rather than a promoted artifact.
- Keep `docs/review/valuation_regulation_repository_poc_status.md` aligned
  with the four chapter review indexes so it remains a summary aid rather
  than a promoted artifact.
- Keep VM-25 and later chapters out of the VM-22 wave except for the closing
  boundary confirmation on page 318.
- Keep the completed VM-22 wave review-only unless a later human review
  explicitly approves promotion.
- Keep the completed VM-22 Section 6 block review-only unless a later human
  review explicitly approves promotion.
- Keep the completed VM-22 early block review-only unless a later human review
  explicitly approves promotion.
- Keep `scripts/batch-definitions.mjs` synchronized with the planned VM-20
  batch IDs, the supporting batch IDs, the VM-21 batch IDs, the actual
  source order, and the tracked review indexes.
- Keep the dedicated `scripts/vm21-batch-definitions.mjs` file synchronized
  with `config/vm21-batch-plan.json`.
- Keep the dedicated `scripts/vm22-batch-definitions.mjs` file synchronized
  with `config/vm22-batch-plan.json`.
- Keep the new VM-20 practice-note plan synchronized with the shared runner
  and validator before its first batch executes.
- Keep the practice-note review index and self-review note synchronized with
  the ignored practice-note review packets if the wave is ever regenerated.
- Keep the one-page AG 03 guideline as a single review-only batch with a
  stable page locator and no promotion until the indexing choice is
  confirmed.
- Keep the one-page AG 01 guideline as a single review-only batch with a
  stable page locator and no promotion until the indexing choice is
  confirmed.
- Keep the two-page AG 02 guideline as a single review-only batch with a
  stable page locator and no promotion until the indexing choice is
  confirmed.
- Keep the two-page AG 04 guideline as a single review-only batch with a
  stable page locator and no promotion until the indexing choice is
  confirmed.
- Keep the two-page AG 05 guideline as a single review-only batch with a
  stable page locator and no promotion until the indexing choice is
  confirmed.
- Keep the two-page AG 06 guideline as a single review-only batch with a
  stable page locator and no promotion until the indexing choice is
  confirmed.
- Keep the two-page AG 07 guideline as a single review-only batch with a
  stable page locator and no promotion until the indexing choice is
  confirmed.
- Leave VM-21 and VM-22 out of the supporting wave unless a separate plan is
  approved.
- Leave the other Practice Notes files out of the current wave unless a
  separate plan is approved.
- Keep VM-22 out of the VM-21 wave unless a future plan explicitly opens it.
- Expand validation only if the plan or a later batch reveals a genuine schema
  or workflow gap.
- Keep app-ready export work deferred until a real promotion candidate exists.
- Keep the repository-level proof-of-concept summary review-only until a
  later stakeholder decision changes the handoff model.

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
- Keep the tracked supporting review index aligned with the ignored
  supporting review packets so it remains a summary aid rather than a
  promoted artifact.
- Keep the supporting-chapter plan aligned with the observed page windows for
  VM-01, VM-02, VM-25, VM-26, VM-30, and VM-31, and keep VM-21 and VM-22 out
  of that wave.
- Keep the VM-21 plan aligned with the confirmed page range 143-225, the
  batch-022 through batch-037 sequence, and the VM-22 exclusion.
- Keep the supporting-wave batch registry keyed by full `batch-###` IDs so the
  runner and validator stay synchronized.
- Keep the VM-21 batch registry keyed by full `batch-###` IDs so the runner
  and validator stay synchronized.
- Keep all completed VM-20 slices review-only until a deliberate promotion
  decision is made in the separate app/product thread.
- Keep the completed VM-21 slices review-only until a deliberate promotion
  decision is made in the separate app/product thread.
- Keep the controlled VM-22 slices review-only until a deliberate promotion
  decision is made in the separate app/product thread.
- Keep the PDF extraction runner UTF-8-safe because formula pages can include
  Unicode minus signs and other non-ASCII glyphs.
- Commit only lightweight, auditable artifacts.
