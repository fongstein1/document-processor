# Current Project State

## Repo path

`C:\Users\David\OneDrive\Documents\Document Processor`

## Current branch

`main`

## Latest known commit before this planning commit

`db59d5f4`

## Validation status

The scaffold, both tiny real-source pilot batches, and the new VM-20 planning
layer validate cleanly.

- `npm run pilot:course-core`: passed; created the core VM course pilot batch
  outputs in `data/work/batches/batch-002/`
- `npm run check`: passed; confirmed the schemas, templates, demo fixtures,
  review-packet contracts, the new VM-20 plan artifacts, and the no-promotion
  guardrails across both ignored pilot batches

## Working posture

- Raw source material stays external at
  `D:\Work\AI Projects\NAIC Valuation Manual Course`.
- The reference app repo is read-only context only.
- This repo now contains the processor scaffold, config, schemas, templates,
  demo fixtures, state docs, the VM-20 extraction plan, and two tiny
  real-source pilot batches in ignored working storage.
- Batch 001 remains the mixed-source pilot, and batch 002 now proves a tiny
  core Valuation Manual course slice with VM-20 reserve mechanics plus VM-31
  reporting and definition boundaries.
- The batch-002 review packet explicitly separates extracted facts, human
  decisions, unresolved issues, exception flags, promotion status, and
  learner-facing/app-ready status.
- The new VM-20 plan captures the section-by-section boundary strategy before
  any larger extraction run begins.
- No learner-facing or app-ready promotion has been produced.
- The real pilot outputs remain ignored under `data/work/`.
- The repository will be clean on `main` once this state refresh is committed,
  aside from ignored working files.

## Current focus

Review and approve the VM-20 extraction plan, then use it to guide the next
tiny extraction batch only after the boundary map is accepted.
