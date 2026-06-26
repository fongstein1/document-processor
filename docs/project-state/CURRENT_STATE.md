# Current Project State

## Repo path

`C:\Users\David\OneDrive\Documents\Document Processor`

## Current branch

`main`

## Latest known commit before this batch

`5e9c9c13b239cadf40d6c6cfc008884380fa6753`

## Validation status

The scaffold, both tiny real-source pilot batches, the VM-20 planning layer,
and the first two controlled VM-20 extraction batches validate cleanly.

- `npm run pilot:course-core`: passed; created the core VM course pilot batch
  outputs in `data/work/batches/batch-002/`
- `npm run vm20:batch-003`: passed; created the first controlled VM-20
  overview batch in `data/work/batches/batch-003/`
- `npm run vm20:batch-004`: passed; created the controlled VM-20 role-map
  completion batch in `data/work/batches/batch-004/`
- `npm run check`: passed; confirmed the schemas, templates, demo fixtures,
  review-packet contracts, the VM-20 plan artifacts, and the no-promotion
  guardrails across all four ignored batches

## Working posture

- Raw source material stays external at
  `D:\Work\AI Projects\NAIC Valuation Manual Course`.
- The reference app repo is read-only context only.
- This repo now contains the processor scaffold, config, schemas, templates,
  demo fixtures, state docs, the VM-20 extraction plan, and four tiny
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
- The batch-003 and batch-004 review packets both surface review flags as
  extraction categories, keep boundary slices separate from overview slices,
  and preserve the no-promotion status in both JSON and markdown.
- The VM-20 plan now captures the section-by-section boundary strategy and
  the role-map completion step before any larger extraction run begins.
- No learner-facing or app-ready promotion has been produced.
- The real pilot outputs remain ignored under `data/work/`.
- The repository will be clean on `main` once this state refresh is committed,
  aside from ignored working files.

## Current focus

Review the batch-004 VM-20 role-map output, then decide whether the next
batch should start at the detailed Section 3 calculation terms or whether one
more boundary slice is needed first.
