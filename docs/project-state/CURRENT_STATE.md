# Current Project State

## Repo path

`C:\Users\David\OneDrive\Documents\Document Processor`

## Current branch

`main`

## Latest known commit before this pilot commit

`471e71cf`

## Validation status

The scaffold and both tiny real-source pilot batches validate cleanly.

- `npm run pilot:course-core`: passed; created the core VM course pilot batch
  outputs in `data/work/batches/batch-002/`
- `npm run check`: passed; confirmed the schemas, templates, demo fixtures,
  review-packet contracts, and no-promotion guardrails across both ignored
  pilot batches

## Working posture

- Raw source material stays external at
  `D:\Work\AI Projects\NAIC Valuation Manual Course`.
- The reference app repo is read-only context only.
- This repo now contains the processor scaffold, config, schemas, templates,
  demo fixtures, state docs, and two tiny real-source pilot batches in ignored
  working storage.
- Batch 001 remains the mixed-source pilot, and batch 002 now proves a tiny
  core Valuation Manual course slice with VM-20 reserve mechanics plus VM-31
  reporting and definition boundaries.
- The batch-002 review packet explicitly separates extracted facts, human
  decisions, unresolved issues, exception flags, promotion status, and
  learner-facing/app-ready status.
- No learner-facing or app-ready promotion has been produced.
- The real pilot outputs remain ignored under `data/work/`.
- The repository will be clean on `main` once this state refresh is committed,
  aside from ignored working files.

## Current focus

Keep the course-core pilot review-only, resolve the VM-20 and VM-31 boundary
questions, and use the batch-002 result as the baseline before any broader
expansion.
