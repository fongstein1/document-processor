# Current Project State

## Repo path

`C:\Users\David\OneDrive\Documents\Document Processor`

## Current branch

`main`

## Latest known commit before this batch

`16d7ea8aef162ae3468ad774e2e7a4766809b01f`

## Validation status

The scaffold, the tiny real-source pilot batches, the VM-20 planning layer,
and the first three controlled VM-20 extraction batches validate cleanly.

- `npm run pilot:course-core`: passed; created the core VM course pilot batch
  outputs in `data/work/batches/batch-002/`
- `npm run vm20:batch-003`: passed; created the first controlled VM-20
  overview batch in `data/work/batches/batch-003/`
- `npm run vm20:batch-004`: passed; created the controlled VM-20 role-map
  completion batch in `data/work/batches/batch-004/`
- `npm run vm20:batch-005`: passed; created the controlled NPR mechanics
  entry batch in `data/work/batches/batch-005/`
- `npm run check`: passed; confirmed the schemas, templates, demo fixtures,
  review-packet contracts, the VM-20 plan artifacts, and the no-promotion
  guardrails across all five ignored batches

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
- The batch-003 and batch-004 review packets both surface review flags as
  extraction categories, keep boundary slices separate from overview slices,
  and preserve the no-promotion status in both JSON and markdown.
- The batch-005 review packet keeps the setup and formula slices separated
  just enough for exception-first review while preserving the formula
  context.
- The VM-20 plan now captures the section-by-section boundary strategy and
  the role-map completion step before any larger extraction run begins.
- The PDF extraction runner now forces UTF-8 output so formula-heavy pages
  with Unicode minus characters can be processed reliably.
- No learner-facing or app-ready promotion has been produced.
- The real pilot outputs remain ignored under `data/work/`.
- The repository will be clean on `main` once this state refresh is committed,
  aside from ignored working files.

## Current focus

Review the batch-005 NPR mechanics entry output, then decide whether the next
batch should begin with Section 3.C assumptions or whether another NPR branch
needs to be isolated first.
