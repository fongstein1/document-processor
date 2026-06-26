# Session Log

- 2026-06-26: Inspected the empty workspace, the reference app docs and seed
  files, and the raw source folder structure. Initialized a new Git repository
  and added the first processor scaffold: project brief, source-family config,
  batch template, project-state docs, and starter scripts.
- 2026-06-26: Bootstrapped the first batch workspace, created the working
  batch manifest, and validated the scaffold successfully with `npm run check`.
- 2026-06-26: Added the first formal processor contract layer: JSON schemas for
  batch manifests, source inventories, extraction outputs, and review packets,
  plus reusable review-packet templates and demo fixtures. Validation now
  checks the schemas, templates, sample fixtures, and refreshed working batch
  manifest.
- 2026-06-26: Ran the first tiny real-source pilot batch using a narrow VM
  guideline, a VM-20 practice note, and a superseded AG 52 text note. Created
  the pilot batch manifest, source inventory, chunk manifest, extraction
  output, review packet, validation report, and unresolved-issues summary in
  ignored working storage, then validated the scaffold and pilot outputs
  successfully.
- 2026-06-26: Hardened the pilot review layer after the first real batch by
  adding line-level locator support to the extraction/review contracts,
  requiring source references in the chunk manifest, expanding the pilot
  validation checks, and clarifying the review-only output contract. The tiny
  pilot batch was regenerated and the scaffold validation passed again.
- 2026-06-26: Ran a second tiny pilot batch focused on the core Valuation
  Manual course family. Selected three narrow slices from
  `pbr_data_valuation_manual_2026.pdf` covering VM-20 reserve mechanics and
  VM-31 reporting/definition boundaries, created batch-002 outputs in ignored
  working storage, and validated the batch successfully.
- 2026-06-26: Hardened the pilot workflow so batch selection lives in
  `scripts/batch-definitions.mjs`, the runner accepts a batch ID, the check
  script scans working batches dynamically, and a dedicated
  `npm run pilot:course-core` entry runs the core VM pilot.
