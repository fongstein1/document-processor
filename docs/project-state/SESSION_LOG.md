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
- 2026-06-26: Performed a limited chapter-boundary scan of
  `pbr_data_valuation_manual_2026.pdf` to locate the lighter supporting VM
  windows, confirmed VM-01, VM-02, VM-25, VM-26, VM-30, and VM-31 page
  ranges, confirmed the VM-50 boundary at page 387, and drafted a separate
  supporting-chapter plan/config that keeps VM-21 and VM-22 out of scope for
  this wave.
- 2026-06-26: Wired the supporting-wave batch registry into the shared batch
  definitions, synchronized the validator with the planned batch-013 through
  batch-021 IDs, and then ran the full supporting VM wave sequentially.
  Batches 013-021 all stayed review-only in ignored working storage, and
  `npm run check` passed after each batch with 21 total pilot/supporting
  batches validated.
- 2026-06-26: Created the tracked supporting VM end-of-sequence review index
  at `docs/review/supporting_vm_review_index.md`, added a lightweight
  validation check so `npm run check` confirms the index exists and
  references batches 013-021, and refreshed the project-state docs so the
  supporting index is treated as a summary-only handoff artifact.
- 2026-06-27: Confirmed the VM-21 chapter span by limited PDF inspection,
  verified the chapter runs from pages 143-225 and that VM-22 begins later,
  and drafted a dedicated VM-21 control plan that keeps the extraction wave
  review-only by default.
- 2026-06-27: Added a dedicated VM-21 batch registry and plan/config pair,
  wired the shared validator to require the new VM-21 artifacts, added a
  generic `npm run vm21:batch` shortcut, and passed `npm run check` with the
  new VM-21 planning layer validated.
- 2026-06-27: Ran the first controlled VM-21 batch group sequentially
  (batch-022 through batch-025), regenerating the ignored working outputs for
  the background, scope, reserve-methodology, and SR projection-entry slices
  while `npm run check` passed after each batch.
- 2026-06-27: Ran the second controlled VM-21 batch group sequentially
  (batch-026 through batch-029), regenerating the ignored working outputs for
  the SR asset mechanics, reinsurance / Section 6 entry, Section 6
  assumptions, and Section 6 factor-table slices while `npm run check`
  passed after each batch.
- 2026-06-27: Ran the final controlled VM-21 batch group sequentially
  (batch-030 through batch-037), regenerating the ignored working outputs for
  the alternative-methodology general layer, the factor tables, scenario
  generation, hedging, behavior assumptions, mortality assumptions, the
  remaining assumption guidance, and the closing allocation boundary while
  `npm run check` passed after each batch.
- 2026-06-27: Created the tracked VM-21 end-of-sequence review index at
  `docs/review/vm21_review_index.md`, added a lightweight validation check so
  `npm run check` confirms the index exists and references batches 022-037,
  and refreshed the project-state docs so the VM-21 handoff now includes the
  summary-only index alongside the ignored batch review packets.
- 2026-06-27: Confirmed the VM-22 chapter span by limited PDF inspection,
  verified the chapter runs from pages 227-318 and that VM-25 begins later,
  and drafted a dedicated VM-22 control plan plus batch registry that keeps
  the extraction wave review-only by default.
- 2026-06-27: Validated the VM-22 planning layer successfully with
  `npm run check`, confirming the new plan/config pair, the VM-22 batch
  registry, and the control-plan boundary before any extraction batches run.
- 2026-06-27: Completed the first VM-22 batch block (batches 038-042) in
  ignored working storage. The block covers background/scope, reserve
  methodology, Section 4 projection entry, Section 4 asset projection, and
  reinsurance, and each batch passed `npm run check` and `git diff --check`.
- 2026-06-27: Completed the Section 6 VM-22 batch block (batches 043-047) in
  ignored working storage. The block covers the Section 6 overview,
  contract mechanics, lapse / rate factors, the first mortality-table block,
  and the remaining mortality tables plus the Section 7 boundary, and each
  batch passed `npm run check` and `git diff --check`.
- 2026-06-27: Completed the final VM-22 batch block (batches 048-054) in
  ignored working storage. The block covers stochastic exclusion tests,
  scenario generation, hedging, behavior assumptions, mortality
  assumptions, other assumptions, and the closing allocation boundary, and
  each batch passed `npm run check` and `git diff --check`.
- 2026-06-27: Created the tracked VM-22 end-of-sequence review index at
  `docs/review/vm22_review_index.md`, added a lightweight validation check so
  `npm run check` confirms the index exists and references batches 038-054,
  and refreshed the project-state docs so the VM-22 handoff is now summary-
  only alongside the ignored batch review packets.
- 2026-06-27: Created the tracked valuation-regulation repository proof-of-
  concept status summary at
  `docs/review/valuation_regulation_repository_poc_status.md`, added a
  lightweight validation check so `npm run check` confirms the summary exists
  and references the four review indexes, and refreshed the project-state
  docs so the repository-level handoff stays summary-only.
- 2026-06-27: Inspected the VM-20 companion practice note
  `Practice Notes/AAA - VM-20_PN_2020_Version.pdf`, confirmed its
  non-binding disclaimer and 21-section structure, and drafted a dedicated
  review-only practice-note plan/config pair that keeps the source separate
  from the other Practice Notes files until a separate plan is approved.
- 2026-06-27: Ran the VM-20 companion practice-note wave sequentially
  (batch-055 through batch-075), kept every batch review-only in ignored
  working storage, validated the wave after each batch, and created the
  tracked practice-note review index plus self-review note alongside the
  refreshed repository POC summary.
- 2026-06-27: Inspected the repealed AG 52 early-adoption note and marked it
  as the leading candidate for the next caveat-focused source unit, pending a
  separate plan.
- 2026-06-27: Confirmed that AG 52 already lives in the mixed pilot batch and
  selected the one-page AG 03 guideline as the next unprocessed source unit,
  keeping it as a single review-only batch with a stable page locator.
- 2026-06-27: Recorded a durable decision that self-contained one-page
  guideline or interpretation PDFs may be processed as single review-only
  batches when the page locator is stable and the content stays source-bound.
- 2026-06-27: Ran the AG 03 single-page guideline batch (`batch-076`) in
  ignored working storage, kept it review-only, and wrote the tracked AG 03
  review index plus self-review note as the new handoff artifacts.
- 2026-06-27: Re-entered the Actuarial Guidelines folder, confirmed AG 01 as
  the next single-page guideline candidate, and drafted the AG 01 planning
  layer so the next batch can be validated before extraction.
- 2026-06-27: Ran the AG 01 single-page guideline batch (`batch-077`) in
  ignored working storage, kept it review-only, and preserved the encoded
  page as a review-only interpretive slice with a one-item unresolved issue
  set.
- 2026-06-27: Created the tracked AG 01 review index and self-review note as
  the new handoff artifacts for the one-page guideline unit.
- 2026-06-27: Confirmed AG 02 as the next small Actuarial Guideline unit and
  drafted the AG 02 planning layer so the next batch can be validated before
  extraction.
- 2026-06-27: Ran the AG 02 two-page guideline batch (`batch-078`) in
  ignored working storage, kept it review-only, and preserved the encoded
  pages as a review-only interpretive slice with a one-item unresolved issue
  set.
- 2026-06-27: Created the tracked AG 02 review index and self-review note as
  the new handoff artifacts for the two-page guideline unit.
- 2026-06-27: Ran the AG 04 two-page term-life reserve batch (`batch-079`),
  kept the outputs review-only in ignored working storage, cleaned up a
  duplicated regulatory flag in the batch definition, and created the tracked
  AG 04 review index plus self-review note as the new handoff artifacts for
  the short guideline unit.
- 2026-06-27: Drafted the AG 05 planning layer for the two-page
  continuous-functions interpretation, wired `batch-080` into the shared
  runner and validator, and kept the short-guideline pattern review-only and
  source-bound for the next batch.
- 2026-06-27: Ran the AG 05 two-page continuous-functions batch (`batch-080`)
  in ignored working storage, kept it review-only, created the tracked AG 05
  review index plus self-review note, and refreshed the repository POC
  summary and scaffold validator so the tenth review index and 80 validated
  batches are now visible in the handoff layer.
- 2026-06-27: Selected AG 06 as the next short guideline unit, confirmed the
  two-page span for the interpretation regarding use of single or joint life
  mortality tables, and drafted the AG 06 planning layer so batch-081 can be
  validated before extraction starts.
- 2026-06-27: Ran the AG 06 two-page mortality-table batch (`batch-081`) in
  ignored working storage, kept it review-only, created the tracked AG 06
  review index plus self-review note as the new handoff artifacts, and
  refreshed the repository POC summary so the eleventh review index and 81
  validated batches are now visible in the handoff layer.
- 2026-06-27: Selected AG 07 as the next short guideline unit, confirmed the
  two-page span for the calculation of equivalent level amounts, and drafted
  the AG 07 planning layer so batch-082 can be validated before extraction
  starts. `npm run check` passed for the AG 07 planning refresh.
- 2026-06-27: Ran the AG 07 two-page equivalent-level-amount batch
  (`batch-082`) in ignored working storage, kept it review-only, created the
  tracked AG 07 review index plus self-review note as the new handoff
  artifacts, and refreshed the repository POC summary so the twelfth review
  index and 82 validated batches are now visible in the handoff layer.
- 2026-06-27: Selected AG 08 as the next short guideline unit, confirmed the
  single-page span for the valuation of individual single premium deferred
  annuities, drafted the AG 08 planning layer, and validated the planning
  artifact so batch-083 can run next in review-only mode.
- 2026-06-27: Ran the AG 08 single-page guideline batch (`batch-083`) in
  ignored working storage, kept it review-only, created the tracked AG 08
  review index plus self-review note as the new handoff artifacts, and
  refreshed the repository POC summary so the thirteenth review index and 83
  validated batches are now visible in the handoff layer.
- 2026-06-27: Selected the AG 09 family as the next short guideline wave,
  confirmed the page windows for AG 09, AG 09-A, AG 09-B, and AG 09-C,
  drafted the AG 09 planning layer, and validated the planning artifact so
  batch-084 can run next in review-only mode.
- 2026-06-27: Ran the AG 09 family wave sequentially (batch-084 through
  batch-087) in ignored working storage, kept every batch review-only,
  created the tracked AG 09 review index plus self-review note as the new
  handoff artifacts, and refreshed the repository POC summary so the
  fourteenth review index and 87 validated batches are now visible in the
  handoff layer.
- 2026-06-27: Confirmed AG 10 as the next short guideline unit, verified its
  one-page page range, and drafted the AG 10 planning layer so batch-088 can
  be validated before extraction starts.
- 2026-06-27: Ran the AG 10 single-page guideline batch (`batch-088`) in
  ignored working storage, kept it review-only, created the tracked AG 10
  review index plus self-review note as the new handoff artifacts, and
  refreshed the repository POC summary so the fifteenth review index and 88
  validated batches are now visible in the handoff layer.
