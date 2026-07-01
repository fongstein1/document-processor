# Current Project State

## Repo path

`C:\Dev\Document Processor`

## Current branch

`main`

## Latest known commit before this batch

`37bfeaa`

## Current focus

The laptop portability and project-context handoff package has now been added
as `docs/project-state/LAPTOP_PORTABILITY_HANDOFF.md`. The repo is clean on
`main`, the received inventory remains local and ignored, and the project is
ready to be reopened on another laptop without guessing source units.

The Model Regulation XXX practice note
(`Practice Notes/AAA - Model Regulation XXX - Dec 2006.pdf`) is now complete as
batches 192-194 in ignored working storage. Its review index and self-review
note are in place, and the wave remains review-only, non-binding, and
companion-guidance aware. The LTCI practice note
(`Practice Notes/AAA-LTCI_Practice_Note_5.21.pdf`) is now complete as
batches 195-197 in ignored working storage, and its review index and
self-review note have been added locally so the companion-guidance wave stays
review-only.
The Asset Adequacy Analysis practice note
(`Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf`) is now complete as
batches 216-221 in ignored working storage. Its planning layer, review index,
and self-review note are in place, and the wave remains review-only,
non-binding, and companion-guidance aware.
The Regulation 213 Fifth Amendment wave
(`NY Regulations/Reg-213-amend5_text.pdf`) is now complete as batches 249-250
in ignored working storage. Its tracked review index and self-review note are
in place, and the wave remains review-only, certified-text aware, and separate
from the FAQ and Sixth Amendment addenda.
The Life & Health Valuation Law Manual opening wave (`lhmanual26.pdf`) is now
complete as batches 251-253 in ignored working storage. Its tracked review
index and self-review note are in place, and the wave remains review-only,
reference-manual aware, and separate from the larger sectioned manual that
follows on page 31.
The Regulation 213 Third Amendment wave (`NY Regulations/Reg-213-amend3_txt.pdf`) is now complete as batch-254 in ignored working storage. Its tracked review index and self-review note are in place, and the wave remains review-only, final-adoption aware, and separate from the FAQ and other amendment-history addenda.
The Regulation 213 Fourth Amendment wave (`NY Regulations/Reg-213-amend4_text.pdf`) is now complete as batches 255-256 in ignored working storage. Its tracked review index and self-review note are in place, and the wave remains review-only, certified-amendment aware, and separate from the FAQ, Fifth Amendment, Sixth Amendment, and other amendment-history addenda.
The Regulation 213 Second Amendment wave (`NY Regulations/Reg-213-11-NYCRR-S103-Amendment-2-nstext-reg213.pdf`) is now complete as batches 257-259 in ignored working storage. Its tracked review index and self-review note are in place, and the wave remains review-only, certified-amendment aware, and separate from the FAQ and other amendment-history addenda.
The Regulation 213 First Amendment text wave (`NY Regulations/Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf`) is now complete as batches 260-265 in ignored working storage. Its tracked review index and self-review note are in place, and the wave remains review-only, certified-amendment aware, and separate from the FAQ and later amendment addenda.

## Inventory intake gate

The human-supplied remaining-source inventory has been received at
`data/manual-input/remaining-source-inventory.received.json`. It should be
compared against the tracked review indexes before any new source unit is
started.

## Validation status

The portability handoff document is tracked, the repo state is clean, and the
recommended resume path is documented for the next laptop. The normal
validation command remains `npm run check`, with the persistent Node runner as
the fallback when the Windows shell wrappers cannot spawn cleanly.

The scaffold, the tiny real-source pilot batches, the VM-20 planning layer,
the re-bound remaining VM-20 batch plan, the tracked VM-20 review index, the
tracked supporting review index, the tracked VM-21 review index, the tracked
VM-22 review index, the new supporting-chapter planning artifacts, the
VM-21 / VM-22 planning and execution artifacts, the AG 06 planning /
review-handoff artifacts, the AG 08 planning / review-handoff artifacts,
the AG 09 planning / review-handoff artifacts, the AG 10 planning /
review-handoff artifacts, the AG 11 planning and review-handoff artifacts,
the AG 12 planning and review-handoff artifacts, the AG 13 planning,
execution, and review-handoff artifacts, the AG 14 planning and
review-handoff artifacts, the AG 15 planning and review-handoff
artifacts, the AG 16 planning, execution, and review-handoff artifacts, and
the AG 17 planning, execution, and review-handoff artifacts, the AG 18
planning, execution, and review-handoff artifacts, and the AG 19 planning
and review-handoff artifacts validate cleanly. The AG 20 review-only
batch-098 handoff now stays in ignored working storage, and the tracked review
index plus self-review note summarize the seven-page guideline. The AG 21
review-only batch-099 handoff now stays in ignored working storage, and the
tracked review index plus self-review note summarize the one-page guideline.
AG 22 is now complete as batch-100. Its tracked review index and self-review
note summarize the one-page indeterminate-premiums guideline without
promoting any extracted content.

The model-governance practice-note wave is now complete as batches 183-185,
and its tracked review index plus self-review note are part of the handoff
set.

The Actuarial Memorandum practice-note wave is now complete as batches
202-205 in ignored working storage. Its tracked review index and self-review
note are in place, and the wave remains review-only, non-binding, and
companion-guidance aware.

The CIA 2022 capital/FCT educational-note wave is complete as batches
206-209 in ignored working storage. Its tracked review index and self-review
note are in place, and the wave remains review-only, non-binding, and
companion-guidance aware. The next safe source unit should be selected from
the remaining inventory after the current handoff is reviewed and confirmed.

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
- `npm run pilot -- --batch batch-013` through `npm run pilot -- --batch
  batch-021`: passed; created the supporting VM wave outputs in
  `data/work/batches/batch-013/` through `data/work/batches/batch-021/`, all
  review-only in ignored working storage
- `npm run check`: passed after each supporting batch; confirmed the schemas,
  templates, demo fixtures, review-packet contracts, the VM-20 plan
  artifacts, the tracked review index, the supporting-chapter plan artifacts,
  the supporting review index, the no-promotion guardrails, and the
  synchronized batch definitions for batches 013-021
- `npm run check`: passed after the VM-21 planning refresh; confirmed the
  schemas, templates, demo fixtures, review-packet contracts, the VM-20 plan
  artifacts, the tracked review indexes, the supporting-chapter plan
  artifacts, the VM-21 plan artifacts, the no-promotion guardrails, and the
  synchronized batch definitions for batches 022-037
- `npm run vm21:batch -- --batch batch-030` through `npm run vm21:batch -- --batch batch-037`: passed; created the remaining controlled VM-21 wave outputs in `data/work/batches/batch-030/` through `data/work/batches/batch-037/`, all review-only in ignored working storage
- `npm run check`: passed after each of the final VM-21 batches; confirmed the schemas, templates, demo fixtures, review-packet contracts, the VM-20 plan artifacts, the tracked review indexes, the supporting-chapter plan artifacts, the VM-21 plan artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 022-037
- `npm run check`: passed after the VM-21 review-index refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the VM-20 plan artifacts, the tracked review indexes, the supporting-chapter plan artifacts, the VM-21 plan artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 022-037
- `npm run check`: passed after the VM-22 planning-layer refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the VM-20 plan artifacts, the tracked review indexes, the supporting-chapter plan artifacts, the VM-21 plan artifacts, the new VM-22 plan artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 038-054
- `npm run check`: passed after batches 043-047 of the VM-22 wave; confirmed the schemas, templates, demo fixtures, review-packet contracts, the VM-20 plan artifacts, the tracked review indexes, the supporting-chapter plan artifacts, the VM-21 plan artifacts, the new VM-22 plan artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 038-054
- `npm run check`: passed after batches 048-054 of the VM-22 wave; confirmed the schemas, templates, demo fixtures, review-packet contracts, the VM-20 plan artifacts, the tracked review indexes, the supporting-chapter plan artifacts, the VM-21 plan artifacts, the new VM-22 plan artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 038-054
- `npm run check`: passed after the VM-22 review-index refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the VM-20 plan artifacts, the tracked review indexes, the supporting-chapter plan artifacts, the VM-21 plan artifacts, the new VM-22 plan artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 038-054
- `npm run check`: passed after the repository POC status summary refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the four tracked review indexes, the new POC status summary, the no-promotion guardrails, and the synchronized batch definitions for batches 038-054
- `npm run check`: passed after the practice-note review-index refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the five tracked review indexes, the new POC status summary, the no-promotion guardrails, and the synchronized batch definitions for batches 055-075
- `npm run check`: passed after the AG 04 review-index refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the nine tracked review indexes, the updated POC status summary, the no-promotion guardrails, and the synchronized batch definitions for batches 055-079
- `npm run check`: passed after the AG 05 planning refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the nine tracked review indexes, the new AG 05 plan artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-079
- `npm run check`: passed after the AG 05 review-index refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the ten tracked review indexes, the updated POC status summary, the no-promotion guardrails, and the synchronized batch definitions for batches 055-080
- `npm run check`: passed after the AG 06 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the eleven tracked review indexes, the new AG 06 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-081
- `npm run check`: passed after the AG 07 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 review-handoff artifacts, the AG 07 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-082
- `npm run check`: passed after the AG 08 planning refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 review-handoff artifacts, the AG 07 review-handoff artifacts, the new AG 08 planning layer, the no-promotion guardrails, and the synchronized batch definitions for batches 055-083
- `npm run ag08:batch`: passed; created the AG 08 review-only batch outputs in `data/work/batches/batch-083/`
- `npm run check`: passed after the AG 08 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-083
- `npm run check`: passed after the AG 09 planning refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 review-handoff artifacts, the new AG 09 planning layer, the no-promotion guardrails, and the synchronized batch definitions for batches 055-087
- `npm run ag09:batch -- --batch batch-084` through `npm run ag09:batch -- --batch batch-087`: passed; created the AG 09 review-only batch outputs in `data/work/batches/batch-084/` through `data/work/batches/batch-087/`
- `npm run check`: passed after the AG 09 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-087
- `npm run ag10:batch`: passed; created the AG 10 review-only batch outputs in `data/work/batches/batch-088/`
- `npm run check`: passed after the AG 10 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-088
- `npm run check`: passed after the AG 11 planning refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 review-handoff artifacts, the new AG 11 planning artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-089
- `npm run check`: passed after the AG 11 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 / AG 11 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-089
- `npm run check`: passed after the AG 12 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 / AG 11 / AG 12 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-090
- `npm run check`: passed after the AG 13 planning refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 / AG 11 / AG 12 review-handoff artifacts, the new AG 13 planning artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-091
- `npm run ag13:batch`: passed; created the AG 13 review-only batch outputs in `data/work/batches/batch-091/`
- `npm run check`: passed after the AG 13 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 / AG 11 / AG 12 / AG 13 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-091
- `npm run check`: passed after the AG 18 planning refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 / AG 11 / AG 12 / AG 13 / AG 14 / AG 15 / AG 16 / AG 17 review-handoff artifacts, the new AG 18 planning artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-096
- `npm run check`: passed after the AG 18 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 / AG 11 / AG 12 / AG 13 / AG 14 / AG 15 / AG 16 / AG 17 / AG 18 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-096
- `npm run check`: passed after the AG 19 planning refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 / AG 11 / AG 12 / AG 13 / AG 14 / AG 15 / AG 16 / AG 17 / AG 18 review-handoff artifacts, the new AG 19 planning artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-097
- `npm run ag20:batch`: passed; created the AG 20 review-only batch outputs in `data/work/batches/batch-098/`
- `npm run check`: passed after the AG 20 review-handoff refresh; confirmed the schemas, templates, demo fixtures, review-packet contracts, the AG 06 / AG 07 / AG 08 / AG 09 / AG 10 / AG 11 / AG 12 / AG 13 / AG 14 / AG 15 / AG 16 / AG 17 / AG 18 / AG 19 review-handoff artifacts, the new AG 20 review-handoff artifacts, the no-promotion guardrails, and the synchronized batch definitions for batches 055-098

The control-plan refresh commit re-bound batches 006-012 to the actual PDF
section order and added runner shortcuts for the remaining controlled slices.
The full re-bound VM-20 sequence is now complete. All controlled batches 006
through 012 stayed review-only, and the remaining windows ended at the
reinsurance / Section 9 boundary without producing learner-facing, app-
ready, or RAG-ready output.

The new tracked VM-20 review index summarizes the ignored batch review
packets without promoting any extracted content.

The new tracked supporting review index does the same for the supporting
chapter wave and should be reviewed alongside the VM-20 index.

A new supporting-chapter control plan now covers VM-01, VM-02, VM-25, VM-26,
VM-30, and VM-31. VM-21 and VM-22 are explicitly out of scope for that wave
until a separate plan is approved.

The supporting VM wave is now complete as a second review-only sequence.
Batches 013 through 021 stayed narrow, source-bound, and unpromoted while
covering VM-01, VM-02, VM-25, VM-26, VM-30, and VM-31 in the planned order.
The ignored working outputs for that wave remain in `data/work/batches/` and
do not change the learner-facing or app-ready posture.

AG 13 is now complete as a review-only historical guideline unit. Its tracked
review index and self-review note summarize the ignored batch outputs without
promoting any extracted content.

AG 14 is now complete as a review-only historical surveillance procedure
unit. Its tracked review index and self-review note summarize the ignored
batch outputs without promoting any extracted content.

AG 23 is now complete as batch-101. Its tracked review index and self-review
note summarize the one-page separate-account-investments guideline without
promoting any extracted content, and the page-image backstop remains visible
because the text layer includes a placeholder statutory reference.
AG 24 is now complete as batches 102-104. Its tracked review index and
self-review note summarize the six-page variable-life nonforfeiture values
guideline without promoting any extracted content, and the page-image
backstop remains visible because the text layer is noisy / encoded. AG 25 is
now complete as batch-105. Its tracked review index and self-review note
summarize the three-page indexed increasing death-benefits guideline
without promoting any extracted content, and the page-image backstop remains
visible because the text layer is noisy / encoded.

The AG 15 review-only step is now complete as batch-093. Its tracked review
index and self-review note summarize the historical illustration guideline
without promoting any extracted content.

The AG 16 review-only step is now complete as batch-094. Its tracked review
index and self-review note summarize the historical CRVM select-mortality /
split-interest guideline without promoting any extracted content.

The AG 17 review-only step is now complete as batch-095. Its tracked review
index and self-review note summarize the historical CRVM non-level
death-benefit guideline without promoting any extracted content.

The AG 18 review-only step is now complete as batch-096. Its tracked review
index and self-review note summarize the current CRVM continuous-basis
guideline without promoting any extracted content, and the page-image
wording backstop remains visible as a review-only caveat. The AG 19 review-
only step is now complete as batch-097. Its tracked review index and
self-review note summarize the 1980 CSO mortality-table guideline without
promoting any extracted content, and AG 20 is the next candidate if the
continuation pass keeps going.

## Working posture

- Raw source material stays external at
  `D:\Work\AI Projects\NAIC Valuation Manual Course`.
- The reference app repo is read-only context only.
- This repo now contains the processor scaffold, config, schemas, templates,
  demo fixtures, state docs, the VM-20 extraction plan, and the tiny real-
  source pilot and supporting-wave batches in ignored working storage.
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
- The tracked supporting review index now gives the reviewer a single summary
  view of the ignored supporting batch packets without changing their
  review-only status.
- The new supporting-chapter control plan records the lighter VM chapter
  windows separately from VM-20 so the next extraction wave can stay portable
  and review-only by default.
- The NY Regulation 141 control plan now covers the commutation-of-
  reinsurance-agreements source as its own source-family wave with three
  review-only batches, keeping the Actuarial Guideline runs and the VM waves
  separate.
- The NY Regulation 141 wave is now complete as batches 180-182, and its
  tracked review index plus self-review note now form part of the handoff set.
- The supporting-wave batch registry now uses the same full `batch-###` IDs
  as the runner and validator, so the planned sequence stays synchronized
  across scripts and checks.
- A new VM-21 control plan now confirms pages 143-225 for the chapter span
  and maps a controlled batch sequence from batch-022 through batch-037.
  That plan keeps VM-21 review-only by default, keeps VM-22 out of scope,
  and isolates VM-30, VM-31, VM-G, VM-C, and VM-M references as review-only
  unless the same batch also captures the operational text.
- The VM-21 batch registry now lives in a dedicated
  `scripts/vm21-batch-definitions.mjs` file, and the shared runner has a
  generic `npm run vm21:batch` shortcut for controlled reruns.
- `npm run check` now validates the VM-21 planning artifacts alongside the
  existing VM-20 and supporting-wave plans, templates, and review indexes.
- Batches 022 through 025 have completed as the first controlled VM-21
  group. They remain review-only in ignored working storage and cover the
  background, scope, reserve-methodology, and SR projection entry slices.
- Batches 026 through 029 have completed as the second controlled VM-21
  group. They remain review-only in ignored working storage and cover the SR
  asset and iteration mechanics, the reinsurance / Section 6 entry, the
  Section 6 assumptions, and the Section 6 factor tables.
- Batches 030 through 037 have completed as the final controlled VM-21
  group. They remain review-only in ignored working storage and cover the
  alternative-methodology general layer, the factor tables, scenario
  generation, hedging, behavior assumptions, mortality assumptions, the
  remaining assumption guidance, and the closing allocation boundary.
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
- The real pilot and supporting-wave outputs remain ignored under
  `data/work/`.
- The tracked VM-20 and supporting review indexes are summary-only handoff
  artifacts and do not replace the underlying batch outputs.
- The tracked VM-20 practice-note review index and self-review note are now
  summary-only handoff artifacts for the companion-guidance wave and do not
  replace the underlying batch outputs.
- The VM-21 plan is now committed as a tracked planning artifact, the
  controlled VM-21 extraction batches have now completed in ignored working
  storage, and the tracked VM-21 review index now summarizes the batch review
  packets without promoting any extracted content.
- A new VM-22 control plan now confirms pages 227-318 for the non-variable
  annuity chapter and maps a controlled batch sequence from batch-038 through
  batch-054. The wave remains review-only by default, keeps VM-20 and VM-21
  out of scope, and stops at the page-318 boundary before VM-25 begins.
- The VM-22 planning layer has already been validated successfully, so the
  next step is to commit the plan and then run the controlled batch sequence
  in ignored working storage.
- Batches 038-042 are now complete in ignored working storage. They cover the
  background / scope slice, the reserve-methodology slice, the Section 4
  projection-entry slice, the Section 4 asset-projection slice, and the
  reinsurance slice.
- Batches 043-047 are now complete in ignored working storage. They cover the
  Section 6 overview, the Section 6 contract mechanics, the lapse / rate
  factor slice, the first mortality-table slice, and the remaining mortality
  tables plus the Section 7 boundary slice.
- Batches 048-054 are now complete in ignored working storage. They cover the
  stochastic exclusion tests, scenario generation, hedging, behavior
  assumptions, mortality assumptions, other assumptions, and the closing
  allocation boundary.
- The tracked VM-22 review index now gives the reviewer a single summary view
  of the ignored batch packets without changing their review-only status.
- The tracked valuation-regulation repository POC summary now consolidates the
  twenty-five review indexes into a single proof-of-concept handoff view.
- The repository will be clean on `main` once this state refresh is committed,
  aside from ignored working files.

## Current focus

The controlled VM-21 sequence is complete. The controlled VM-22 sequence is
complete: batches 038-054 are done, the tracked VM-22 review index now
summarizes the ignored batch packets, and the resulting ignored working
outputs remain review-only. The tracked valuation-regulation repository POC
summary now consolidates the fifty-six review indexes into a single handoff
view. AG 40 is now complete as batches 135-136 in ignored working storage,
and the tracked review index plus self-review note are now part of the
handoff set. AG 41 is now complete as batch-137 in ignored working storage,
and the tracked review index plus self-review note are now part of the
handoff set. AG 42 is complete as batches 138-139, and its tracked review
index and self-review note are now part of the handoff set. AG 44 is
complete as batches 149-150, and its tracked review index and self-review
note are now part of the handoff set. AG 48 is the next likely candidate if
the continuation pass keeps going. AG 47 is now complete as batch-153 in
ignored working storage. Its tracked review index and self-review note are
now part of the handoff set, and the page-image wording backstop remains
visible because the text layer is encoding-noisy, line references were not
available, and AG 48 is the next likely candidate if the continuation pass
keeps going. The model-governance practice note is now complete as batches
183-185 in ignored working storage. Its tracked review index and self-review
note now form part of the handoff set, and the companion-guidance caveat
remains visible because the note is non-binding. AG 51 is now complete as batches 163-164 in ignored working
storage. Its tracked review index and self-review note are now part of the
handoff set, the page-locator backstop remained visible because stable line
references were not available, the future VM-30 incorporation note stayed
review-only context, and AG 53 is the next likely candidate if the
continuation pass keeps going.
AG 20 is now complete as batch-098. Its tracked review index and self-review
note summarize the seven-page joint-life-functions guideline without
promoting any extracted content. AG 21 is now complete as batch-099. Its
tracked review index and self-review note summarize the one-page CRVM
reserve-comparison guideline without promoting any extracted content. AG 05
is complete in ignored working storage and its tracked review index plus
self-review note now summarize that wave. Keep VM-25 and later chapters out
of scope unless a future plan explicitly opens them.
AG 22 is complete as batch-100; keep it review-only by default and do not
widen beyond the one-page indeterminate-premiums note.
AG 23 is now complete as batch-101. Its tracked review index and self-review
note summarize the one-page separate-account-investments guideline without
promoting any extracted content, and the page-image backstop remains visible
because the text layer includes a placeholder statutory reference.
AG 24 is now complete as batches 102-104. Its tracked review index and
self-review note summarize the six-page variable-life nonforfeiture values
guideline without promoting any extracted content, and the page-image
backstop remains visible because the text layer is noisy / encoded. AG 26 is
now complete as batch-106, and its tracked review index plus self-review note
are being added to the handoff set. AG 27 is now complete as batches
107-109, and its tracked review index plus self-review note are being added
to the handoff set. AG 28 is now complete as batch-110, and its tracked
review index plus self-review note are being added to the handoff set. AG 29
is now complete as batch-111, and its tracked review index plus self-review
note are being added to the handoff set. AG 30 is the next likely candidate
if the continuation pass keeps going.

AG 30 is now complete as batch-112. Its tracked review index and self-review
note are being added to the handoff set, and the opening page kept the
page-image wording backstop visible. AG 31 is the next likely candidate if
the continuation pass keeps going.

AG 31 is now complete as batch-113. Its tracked review index and self-review
note are being added to the handoff set, and the page-image wording backstop
remained visible. AG 32 is now complete as batch-114, and its tracked review
index and self-review note are now part of the handoff set. The page-image
backstop stayed visible, and AG 33 is now complete as batches 115 and 116.
Its tracked review index and self-review note are now part of the handoff
set. The page-image backstop stayed visible, and AG 34 is now the next
likely candidate if the continuation pass keeps going; its planning layer is
being added as a three-window review-only wave with AG 35 out of scope.

The VM-20 companion practice-note wave is complete: batches `batch-055`
through `batch-075` were processed review-only, and the tracked practice-note
review index plus self-review note now summarize that wave without promoting
any extracted content.

The AG 04 batch is now complete in ignored working storage, and the tracked
AG 04 review index plus self-review note are the current handoff artifacts.
The slice stays review-only and source-bound so the short-guideline pattern
remains consistent with the earlier AG units.

The AG 05 extraction batch is complete in ignored working storage, and the
tracked AG 05 review index plus self-review note are the current handoff
artifacts. The AG 05 planning layer remains the canonical batch map for
future regeneration.

The AG 06 extraction batch is complete in ignored working storage, and the
tracked AG 06 review index plus self-review note are the current handoff
artifacts. The AG 06 planning layer remains the canonical batch map for
future regeneration.

The AG 07 extraction batch is complete in ignored working storage, and the
tracked AG 07 review index plus self-review note are the current handoff
artifacts. The AG 07 planning layer remains the canonical batch map for
future regeneration.

The AG 08 extraction batch is complete in ignored working storage, and the
tracked AG 08 review index plus self-review note are the current handoff
artifacts. The AG 08 planning layer remains the canonical batch map for
future regeneration.

The AG 09 extraction family is complete in ignored working storage, and the
tracked AG 09 review index plus self-review note are the current handoff
artifacts. The AG 09 planning layer remains the canonical batch map for
future regeneration. The AG 10 extraction batch is complete in ignored
working storage, and the tracked AG 10 review index plus self-review note are
the current handoff artifacts. The AG 10 planning layer remains the canonical
batch map for future regeneration. The AG 11 planning layer has now been executed and the tracked AG 11 review index plus self-review note are the current handoff artifacts for batch-089. The AG 12 planning layer has now been executed and the tracked AG 12 review index plus self-review note are the current handoff artifacts for batch-090. The withdrawn one-page guideline stays review-only as a caveat-first historical note. AG 13 is now complete as a historical CARVM review-only unit, and the tracked AG 13 review index plus self-review note are the current handoff artifacts for batch-091.

The controlled AG 03 one-page guideline batch is complete in ignored working
storage, and the tracked AG 03 review index plus self-review note are the
current handoff artifacts. The controlled AG 01 one-page guideline batch is
complete in ignored working storage, and the tracked AG 01 review index plus
self-review note are committed handoff artifacts. The controlled AG 02
two-page guideline batch is complete in ignored working storage, and the
tracked AG 02 review index plus self-review note are the next handoff
artifacts. The AG 52 text note already lives in the mixed pilot batch and is
not being reprocessed; it is now formally indexed in
`docs/review/ag52_review_index.md` and `docs/review/ag52_self_review.md`.
The remaining Practice Notes files and other
Actuarial Guideline / NY regulation files stay out of scope until separately
planned.

AG 34 is now complete as batches 117-119. Its tracked review index and
self-review note are the current handoff artifacts for the active MGDB
reserve guideline. The page-image wording backstop remains visible because
the text layer is noisy / encoded, and the AG 35 boundary stayed out of
scope for this wave.

AG 35 is now complete as batches 120-122. Its tracked review index and
self-review note are the current handoff artifacts for the active EIA/CARVM
guideline. The page-image wording backstop remains visible because the text
layer is noisy / encoded, and the AG 36 boundary stayed out of scope for
this wave.

AG 37 is now complete as batches 127-129. Its tracked review index and
self-review note are now part of the handoff set, the 2021 Law Manual
reprint stayed excluded as companion material, and AG 38 is now complete as
batches 130-133. Its tracked review index and self-review note are now part
of the handoff set, the page-image wording backstop remained visible because
line references were unavailable, and AG 42 is complete as batches 138-139.
Its tracked review index and self-review note are now part of the handoff
set. AG 44 is complete as batches 149-150, and its tracked review index and
self-review note are now part of the handoff set. The page-image wording
backstop remains visible because the text layer is noisy, and AG 45 is the
next likely candidate if the continuation pass keeps going.

AG 44 is now complete as batches 149-150 in ignored working storage. Its
tracked review index and self-review note are now part of the handoff set,
the page-image wording backstop remained visible because the text layer is
noisy, and AG 45 looks like the next short follow-on candidate if the
continuation pass stays clean. AG 46 remains a later candidate only if the
continuation pass keeps going.

AG 45 is now complete as batch-151 in ignored working storage. Its tracked
review index and self-review note are now part of the handoff set. AG 46 is
complete as batch-152 in ignored working storage, and its tracked review
index and self-review note are now part of the handoff set. The page-image
wording backstop remains visible, and AG 48 is the next likely candidate if
the continuation pass keeps going. AG 47 is complete as batch-153 in
ignored working storage, and its tracked review index and self-review note
are now part of the handoff set. AG 48 is the next likely candidate if the
continuation pass keeps going.

AG 48 is complete as batches 154-156 in ignored working storage. Its tracked
review index and self-review note are now part of the handoff set, the
page-image wording backstop remained visible because the text layer is
encoding-noisy and line references were not available, the 2021 Law Manual
reprint stayed out of scope for this wave, and AG 49 is now complete as
batches 157-159 in ignored working storage. Its tracked review index and
self-review note are now part of the handoff set, and AG 50 is the next
likely candidate if the continuation pass keeps going.
The AG 50 planning layer has now been executed as batches 160-162, and its
tracked review index and self-review note are now part of the handoff set.
AG 51 is now complete as batches 163-164 in ignored working storage. Its
tracked review index and self-review note now form part of the handoff set,
the page-locator backstop remained visible because stable line references
were not available, the future VM-30 incorporation note stayed review-only
context, and AG 53 is now complete as batches 165-167 in ignored working
storage. Its tracked review index and self-review note now form part of the
handoff set, the page-locator backstop remained visible because stable line
references were not available, the page-image wording backstop remained
visible, and AG 54 is now complete as batches 168-170 in ignored working
storage. Its tracked review index and self-review note now form part of the
handoff set, the paragraph-locator backstop remained visible because line
references were preserved, and AG 55 is now complete as batches 171-179 in
ignored working storage. Its tracked review index and self-review note now
form part of the handoff set, the paragraph-locator backstop remained visible
because line references were preserved, and Reg-141 is now the next likely
candidate if the continuation pass keeps going. The model-governance
practice-note wave is now planned as batches 183-185, and the next immediate
step is to commit that planning layer and run the three review-only
companion-guidance slices.

AG 39 batch-134 has completed in ignored working storage, and the tracked
AG 39 review index and self-review note are now part of the handoff set. The
page-image wording backstop stays visible, treats line references as not
expected, and keeps the batch review-only by default. AG 42 is the next
likely candidate if the continuation pass keeps going.

Batch-123 is now complete in ignored working storage. The foundation and
method-overview slice stayed review-only, the page-image backstop remained
visible, and batch-124 is the next AG 36 slice to run.

Batch-124 is now complete in ignored working storage. The attachments and
method-mechanics slice stayed review-only, the page-image backstop remained
visible, and batch-125 is the next AG 36 slice to run.

Batch-125 is now complete in ignored working storage. The hedged-as-required
and notification slice stayed review-only, the page-image backstop remained
visible, and batch-126 is the next AG 36 slice to run.

Batch-126 is now complete in ignored working storage. The certification and
closeout slice stayed review-only, the page-image backstop remained visible,
the tracked AG 36 review index and self-review note are now part of the
handoff set, and AG 38 is now the next likely candidate if the continuation
pass keeps going.

Reg-210 is now complete as batches 186-188 in ignored working storage. The
active `NY Regulations/Reg-210-11-NYCRR-S048.pdf` file was inspected, its
three review windows were mapped, page 10 remains blank trailing boundary
context only, and the tracked review index plus self-review note now form
part of the handoff set. Reg-213 is now complete and indexed. The active
`NY Regulations/2021 VLM Report_DRAFT-(1-27-2020) with academy Updates
V1-Reg-213-11-NYCRR-S103.pdf` file was inspected, its 27-page span was
mapped across batches 189-191, and the amendment / FAQ files in the same
folder remain deferred for a later wave.
## LTCI handoff addendum

The LTCI practice note wave is now complete as batches 195-197 in ignored
working storage. The tracked review index and self-review note have been
added locally, and the next safe source unit should be selected from the
remaining practice-note inventory after validation is refreshed.

Shell process creation is currently failing in this workspace, so the next
source unit has not been started yet.

## Life Reinsurance practice note addendum

The next safe source unit has now been selected from the received inventory:
`Practice Notes/AAA - Life_Reinsurance_Reserve_Credit_Practice_Note_Feb_2018.pdf`.
The planning layer is in place for pages 1-41, the batch map runs from
batch-198 through batch-201, and the source remains review-only,
non-binding companion guidance until the wave is executed and indexed.

The life reinsurance practice note wave is now complete as batches 198-201 in
ignored working storage. The tracked review index and self-review note are in
place at `docs/review/life_reinsurance_reserve_credit_practice_note_review_index.md`
and `docs/review/life_reinsurance_reserve_credit_practice_note_self_review.md`,
the wave stayed review-only, and the next safe continuation step is to inspect
the remaining inventory again before selecting another source unit.


## CIA 2023 Educational Note addendum

The CIA 2023 financial-condition-testing educational-note wave is complete as batches 210-215 in ignored working storage. Its tracked review index and self-review note are in place, and the next safe source unit should be selected from the remaining inventory after inspection.

## C3 Phase 2 practice note addendum

The C3 Phase 2 practice note wave is now complete as batches 222-230 in ignored working storage. The tracked review index and self-review note are in place, the source stays review-only and non-binding, and the page-image wording backstop remains visible because the text layer is noisy in places. The next safe continuation step is to inspect the remaining inventory again before selecting another source unit.

## C3 Phase 2 / AG 43 March 2011 practice note addendum

The March 2011 C3 Phase II / AG 43 practice-note wave is now complete as
batches 231-244 in ignored working storage. The tracked review index and
self-review note are `docs/review/c3_phase_2_ag43_2011_practice_note_review_index.md`
and `docs/review/c3_phase_2_ag43_2011_practice_note_self_review.md`, the
source stays review-only and non-binding, and the companion-guidance caveat
remains explicit. The broader proof-of-concept handoff now spans 76 review
indexes.

## Reg 213 Amendment No. 1 FAQ addendum

The Regulation 213 Amendment No. 1 FAQ wave is now complete as batches
245-247 in ignored working storage. The tracked review index and self-review
note are in place, the source stays review-only and companion-only, and the
page-image wording backstop remains visible because exact wording should not
be overclaimed from the wrapped FAQ text. The next safe continuation step is
to inspect the remaining inventory again before selecting another source
unit.

## Reg 213 Sixth Amendment addendum

The Regulation 213 Sixth Amendment wave is now complete as batch-248 in
ignored working storage. The tracked review index and self-review note are in
place, the source stays review-only and proposed, and the page-image wording
backstop remains visible because exact wording should not be overclaimed from
the one-page regulatory text. The next safe continuation step is to inspect
the remaining inventory again before selecting another source unit.

## Reg 192 addendum

Regulation 192 is now complete as batch-266 in ignored working storage. The
tracked review index and self-review note are in place, the source stays
review-only and active, and the page-image wording backstop remains visible
because the text layer is noisy / OCR-like. The next safe continuation step
is to inspect the remaining inventory again before selecting another source
unit.
