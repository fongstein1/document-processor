# Current Project State

## Repo path

`C:\Users\David\OneDrive\Documents\Document Processor`

## Current branch

`main`

## Latest known commit before this batch

`a43b412`

## Validation status

The scaffold, the tiny real-source pilot batches, the VM-20 planning layer,
and the re-bound remaining VM-20 batch plan validate cleanly.

- `npm run pilot:course-core`: passed; created the core VM course pilot batch
  outputs in `data/work/batches/batch-002/`
- `npm run vm20:batch-003`: passed; created the first controlled VM-20
  overview batch in `data/work/batches/batch-003/`
- `npm run vm20:batch-004`: passed; created the controlled VM-20 role-map
  completion batch in `data/work/batches/batch-004/`
- `npm run vm20:batch-005`: passed; created the controlled NPR mechanics
  entry batch in `data/work/batches/batch-005/`
- `npm run check`: passed; confirmed the schemas, templates, demo fixtures,
  review-packet contracts, the VM-20 plan artifacts, the no-promotion
  guardrails, and the synchronized batch definitions for batches 003-012

The control-plan refresh commit re-bound batches 006-012 to the actual PDF
section order and added runner shortcuts for the remaining controlled slices.
The remaining VM-20 batches are now re-bound to the actual section order in
the PDF. Batch-006 is ready to start the Section 3.C assumption slice, and
the remaining windows follow the deterministic reserve, stochastic reserve,
exclusion-test, cash-flow model, and reinsurance / Section 9 boundary order.

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

Run batch-006 on the Section 3.C assumption slice, then continue through the
re-bound remaining VM-20 batches in order.
