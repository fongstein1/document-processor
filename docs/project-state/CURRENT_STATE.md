# Current Project State

## Repo path

`C:\Users\David\OneDrive\Documents\Document Processor`

## Current branch

`main`

## Latest known commit before this batch

`5009a0d1d22723de373fe2a1597db4fec3010636`

## Validation status

The scaffold, both tiny real-source pilot batches, the VM-20 planning layer,
and the first controlled VM-20 extraction batch validate cleanly.

- `npm run pilot:course-core`: passed; created the core VM course pilot batch
  outputs in `data/work/batches/batch-002/`
- `npm run vm20:batch-003`: passed; created the first controlled VM-20
  overview batch in `data/work/batches/batch-003/`
- `npm run check`: passed; confirmed the schemas, templates, demo fixtures,
  review-packet contracts, the VM-20 plan artifacts, and the no-promotion
  guardrails across all three ignored pilot batches

## Working posture

- Raw source material stays external at
  `D:\Work\AI Projects\NAIC Valuation Manual Course`.
- The reference app repo is read-only context only.
- This repo now contains the processor scaffold, config, schemas, templates,
  demo fixtures, state docs, the VM-20 extraction plan, and three tiny
  real-source pilot batches in ignored working storage.
- Batch 001 remains the mixed-source pilot, and batch 002 now proves a tiny
  core Valuation Manual course slice with VM-20 reserve mechanics plus VM-31
  reporting and definition boundaries.
- Batch 003 adds the first controlled VM-20 framework batch with a pages
  45-46 overview slice and a page-47 boundary slice so the overview and the
  mechanics transition stay review-only.
- The batch-003 review packet now surfaces review flags as extraction
  categories, keeps the boundary slice separate from the overview slice, and
  preserves the no-promotion status in both JSON and markdown.
- The VM-20 plan still captures the section-by-section boundary strategy
  before any larger extraction run begins.
- No learner-facing or app-ready promotion has been produced.
- The real pilot outputs remain ignored under `data/work/`.
- The repository will be clean on `main` once this state refresh is committed,
  aside from ignored working files.

## Current focus

Review the batch-003 VM-20 overview output, then decide whether page 47 stays
in the controlled overview batch or moves into the next NPR / DR / SR
mechanics batch.
