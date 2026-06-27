# Current Project State

## Repo path

`C:\Users\David\OneDrive\Documents\Document Processor`

## Current branch

`main`

## Latest known commit before this batch

`1115b98`

## Validation status

The scaffold, the tiny real-source pilot batches, the VM-20 planning layer,
the re-bound remaining VM-20 batch plan, the tracked VM-20 review index, and
the new supporting-chapter planning artifacts validate cleanly.

- `npm run pilot:course-core`: passed; created the core VM course pilot batch
  outputs in `data/work/batches/batch-002/`
- `npm run vm20:batch-003`: passed; created the first controlled VM-20
  overview batch in `data/work/batches/batch-003/`
- `npm run vm20:batch-004`: passed; created the controlled VM-20 role-map
  completion batch in `data/work/batches/batch-004/`
- `npm run vm20:batch-005`: passed; created the controlled NPR mechanics
  entry batch in `data/work/batches/batch-005/`
- `npm run vm20:batch-006`: passed; created the Section 3.C assumption batch
  in `data/work/batches/batch-006/`
- `npm run vm20:batch-007`: passed; created the deterministic reserve entry
  batch in `data/work/batches/batch-007/`
- `npm run vm20:batch-008`: passed; created the stochastic reserve entry
  batch in `data/work/batches/batch-008/`
- `npm run vm20:batch-009`: passed; created the exclusion-test batch in
  `data/work/batches/batch-009/`
- `npm run vm20:batch-010`: passed; created the Section 7 model-structure
  batch in `data/work/batches/batch-010/`
- `npm run vm20:batch-011`: passed; created the Section 7 asset-mechanics
  batch in `data/work/batches/batch-011/`
- `npm run vm20:batch-012`: passed; created the reinsurance and Section 9
  boundary batch in `data/work/batches/batch-012/`
- `npm run check`: passed; confirmed the schemas, templates, demo fixtures,
  review-packet contracts, the VM-20 plan artifacts, the tracked review
  index, the supporting-chapter plan artifacts, the no-promotion guardrails,
  and the synchronized batch definitions for batches 003-012

The control-plan refresh commit re-bound batches 006-012 to the actual PDF
section order and added runner shortcuts for the remaining controlled slices.
The full re-bound VM-20 sequence is now complete. All controlled batches 006
through 012 stayed review-only, and the remaining windows ended at the
reinsurance / Section 9 boundary without producing learner-facing, app-
ready, or RAG-ready output.

The new tracked VM-20 review index summarizes the ignored batch review
packets without promoting any extracted content.

A new supporting-chapter control plan now covers VM-01, VM-02, VM-25, VM-26,
VM-30, and VM-31. VM-21 and VM-22 are explicitly out of scope for that wave
until a separate plan is approved.

## Working posture

- Raw source material stays external at
  `D:\Work\AI Projects\NAIC Valuation Manual Course`.
- The reference app repo is read-only context only.
- This repo now contains the processor scaffold, config, schemas, templates,
  demo fixtures, state docs, the VM-20 extraction plan, and five tiny
  real-source pilot batches in ignored working storage.
- Batch 001 remains the mixed-source pilot, and batch 002 now proves a tiny
  core Valuation Manual course slice with VM-20 reserve mechanics plus VM-31
  reporting and definition boundaries.
- Batch 003 adds the first controlled VM-20 framework batch with a pages
  45-46 overview slice and a page-47 boundary slice so the overview and the
  mechanics transition stay review-only.
- Batch 004 closes the high-level NPR / DR / SR role map with the explicit
  Section 3 / Section 4 / Section 5 responsibility statement and a narrow
  Section 3 opener, while keeping the detailed mechanics for later batches.
- Batch 005 starts the NPR mechanics entry point with a setup slice on pages
  52-55 and a formula slice on pages 56-57, while keeping the Section 3.C
  assumptions for a later batch.
- The remaining VM-20 batches have been re-bound to the actual PDF section
  order: Section 3.C assumptions, Section 4, Section 5, Section 6, Section 7
  split into structure and asset-mechanics slices, and the final Section 8 /
  Section 9 boundary batch.
- Batches 006-012 now complete the Section 3.C assumption slice, the Section
  4 deterministic reserve opener, the Section 5 stochastic reserve opener,
  the Section 6 exclusion tests, the split Section 7 model batches, and the
  final reinsurance / Section 9 boundary batch.
- The tracked VM-20 review index now gives the reviewer a single summary view
  of the ignored batch packets without changing their review-only status.
- The new supporting-chapter control plan records the lighter VM chapter
  windows separately from VM-20 so the next extraction wave can stay portable
  and review-only by default.
- The batch-003 and batch-004 review packets both surface review flags as
  extraction categories, keep boundary slices separate from overview slices,
  and preserve the no-promotion status in both JSON and markdown.
- The batch-005 review packet keeps the setup and formula slices separated
  just enough for exception-first review while preserving the formula
  context.
- The VM-20 plan now captures the section-by-section boundary strategy and
  the role-map completion step before any larger extraction run begins, then
  continues through the actual Section 3.C to Section 9 source order.
- The PDF extraction runner now forces UTF-8 output so formula-heavy pages
  with Unicode minus characters can be processed reliably.
- No learner-facing or app-ready promotion has been produced.
- The real pilot outputs remain ignored under `data/work/`.
- The repository will be clean on `main` once this state refresh is committed,
  aside from ignored working files.

## Current focus

Review the tracked VM-20 review index and the new supporting-chapter plan, and
decide whether any future batch item is a candidate for revision or later
promotion work.
