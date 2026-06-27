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
- 2026-06-26: Added a controlled VM-20 extraction plan and batch map in
  `docs/processor/vm20_extraction_plan.md` and `config/vm20-batch-plan.json`
  so future VM-20 extraction can stay section-by-section, review-only by
  default, and boundary-aware.
- 2026-06-26: Extended scaffold validation to require the VM-20 planning
  artifacts and confirm the plan stays well-formed and review-only by default.
- 2026-06-26: Ran the first controlled VM-20 extraction batch using two narrow
  excerpt windows from `pbr_data_valuation_manual_2026.pdf` (pages 45-46 for
  the framework overview and page 47 for the mechanics boundary), added a
  dedicated `npm run vm20:batch-003` entry, surfaced review flags as
  extraction categories in the review packet markdown, and passed
  `npm run check` across three ignored pilot batches.
- 2026-06-26: Refined the VM-20 plan so batch-004 closes the high-level
  NPR/DR/SR role map before detailed mechanics begin, then ran batch-004 with
  a page-48 role-map slice and a narrow Section 3 opener on pages 50-51.
  Added `npm run vm20:batch-004`, updated the role-map boundary notes in the
  plan/config, and passed `npm run check` across four ignored batches.
- 2026-06-26: Rebound batch-005 to the NPR mechanics entry point, with a setup
  slice on pages 52-55 and a formula slice on pages 56-57, then hardened the
  PDF extraction runner for UTF-8 output so formula-heavy pages with Unicode
  minus signs would not fail. Ran `npm run vm20:batch-005` and
  `npm run check` successfully across five ignored batches.
- 2026-06-26: Re-bound the remaining VM-20 plan to the actual PDF section
  order by inspecting pages 58-95, added runner shortcuts for batches 006-012,
  synchronized the scaffold validation with the planned batch IDs, and updated
  the project-state docs to reflect the Section 3.C through Section 9 batch
  sequence. `npm run check` passed after the rebind, and batch-006 is ready to
  start next.
- 2026-06-26: Committed the control-plan refresh as `a43b412`, then refreshed
  the current project state so the next batch starts from the new baseline.
- 2026-06-26: Completed the first three re-bound VM-20 batches. Batch-006
  captured the Section 3.C assumption slice, batch-007 captured the Section 4
  deterministic reserve opener, and batch-008 captured the Section 5
  stochastic reserve opener. Each batch stayed review-only in ignored working
  storage, and `npm run check` passed across eight validated pilot batches.
- 2026-06-26: Completed the remaining re-bound VM-20 batches. Batch-009
  captured the Section 6 exclusion tests, batch-010 captured the Section 7
  model structure, batch-011 captured the Section 7 asset mechanics, and
  batch-012 captured the reinsurance / Section 9 boundary. All slices stayed
  review-only in ignored working storage, and `npm run check` passed across
  twelve validated pilot batches.
- 2026-06-26: Created the tracked VM-20 end-of-sequence review index at
  `docs/review/vm20_review_index.md`, added a lightweight validation check so
  `npm run check` confirms the index exists and references batches 003-012,
  and refreshed the project-state docs to treat the index as a summary-only
  handoff artifact.
