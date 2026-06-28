# Decisions

## Standalone processor workspace

This repo is a dedicated document-processing workspace. It should not become a
second learner-facing app.

## Raw source separation

Raw source documents remain in the external raw folder and out of Git. The repo
stores only scripts, docs, templates, configs, and lightweight sanitized
artifacts.

## Reference app stays read-only

The existing app repo is reference material and export target context only. It
should not be modified unless explicitly requested.

## Small pilot first

The first run should be a small representative batch that proves the full
pipeline before any broader source-family expansion.

## Source-bound and review-first

Every output must trace back to source documents and chunk IDs, and learner-
facing promotion requires exact citation, clear support, high confidence, and
no unresolved review flags.

## Domain config isolates assumptions

NAIC-specific assumptions should live in config rather than hard-coded logic so
the same processor can support pricing and liability-modeling material later.

## Review packets stay exception-first

Human review should focus on extraction failures, missing citations, ambiguous
language, contradictions, and promotion candidates.

## Formal contract layer first

Batch manifests, source inventories, extraction outputs, and review packets are
now treated as formal JSON-schema contracts with committed demo fixtures. Real
source processing should not start until those contracts validate cleanly.

## Demo fixtures remain non-source

The committed contract demo fixtures are mock-only examples. They exist to
prove the contract layer and must not be confused with raw source content or
learner-facing exports.

## Review-only pilots can omit promotion outputs

Tiny pilot batches are allowed to stay review-only and do not need to produce
approved-promoted or app-ready exports until a human explicitly approves a
promotion candidate. The pilot should still produce auditable inventory,
extraction, chunk, review, validation, and unresolved-issues artifacts.

## Line-level locators are first-class

Plain-text and other non-page sources may use `lineReference` in extraction and
review contracts when page numbers are unavailable. The review packet and
validation checks should keep those line locators visible instead of forcing a
page citation that does not exist.

## Review-only pilots must surface exceptions

Pilot review packets should make unresolved issues and no-promotion guardrails
explicit so the reviewer can focus on exceptions, citation gaps, and approval
gates without guessing at hidden status.

## Batch definitions drive pilot runs

Tiny pilot batches should be declared in `scripts/batch-definitions.mjs`, and
the runner should read that definition instead of hard-coding batch-specific
logic. The check script should scan whatever working batches exist and apply
the same guardrails to each one.

## Core VM slices stay narrow until expanded

Reserve-mechanics, reporting cross-references, and definition slices from the
core Valuation Manual may stay review-only when they are intentionally narrow.
Human review should decide when to split them further or add later reporting
pages before any promotion is considered.

## VM-20 planning comes before extraction

The VM-20 chapter should be driven by a tracked section-by-section plan before
any larger extraction run begins. Planned batches should remain review-only by
default, and the plan config should serve as the source of truth until actual
VM-20 extraction is authorized.

## Controlled excerpt windows are allowed

When a single VM-20 source file needs to be split for review, controlled
batches may use multiple narrow excerpt windows from that file so the overview
language stays separate from mechanics boundary slices. Those excerpt windows
must remain review-only and clearly labeled in the batch outputs.

## Role map before mechanics

For VM-20, the high-level NPR / DR / SR role map should be closed out before
detailed reserve mechanics begin. If a narrow Section 3 opener is needed to
confirm the NPR role, it may remain review-only as a boundary slice rather than
being promoted into mechanics content.

## NPR entry slice boundary

The first NPR mechanics batch should use a narrow entry slice that keeps the
setup terms and the initial formula block together, then stop before the
Section 3.C assumptions begin on the following page range. That boundary keeps
the mechanics entry point review-only while leaving the assumptions work for a
later batch.

## UTF-8 PDF extraction

The PDF extraction runner should force UTF-8 output when reading formula-heavy
pages, because the VM-20 manual includes Unicode minus signs and other
non-ASCII glyphs that can break the default Windows console encoding.

## Low-quality PDF text layers stay page-image-backed

When a source PDF has a noisy, encoded, or partially unreliable text layer,
the processor should prefer page locators over line references, keep a
page-image wording backstop visible, and classify the batch cautiously unless
the page image confirms the wording. If the text layer is too weak to support
source-bound extraction, the batch should stop for human review instead of
overclaiming exact wording or promotion readiness.

The review notes should say explicitly when line references are not available
and should name the page-image wording backstop so the reviewer does not infer
precision that the text layer cannot support.

## Remaining VM-20 order

The remaining controlled VM-20 batches should follow the actual PDF section
order rather than the earlier placeholder page windows: Section 3.C
assumptions, the Section 4 deterministic reserve opener, the Section 5
stochastic reserve opener, the Section 6 exclusion tests, Section 7 split into
structure and asset-mechanics slices, and the final Section 8 reinsurance /
Section 9 boundary batch. The plan config and batch definitions should stay
synchronized with that order.

## Tracked review index

When a controlled VM-20 sequence is complete, create a tracked review index
under `docs/review/` that summarizes the ignored batch review packets without
promoting extracted content. The index should remain a summary-only handoff
artifact and should not replace the underlying review packets or batch
manifests.

## Supporting chapter wave

The lighter supporting VM chapter wave should be planned separately from
VM-20, should remain review-only by default, and should cover VM-01, VM-02,
VM-25, VM-26, VM-30, and VM-31 only. VM-21 and VM-22 remain out of scope
until a separate plan is approved. The supporting-wave plan should record the
observed page windows before extraction starts and should preserve the same
stop conditions used for VM-20.

## Supporting batch registry

The supporting-wave batch definitions should use the same full `batch-###`
keys as the runner and validator. That keeps the planned sequence, the batch
registry, and the scaffold checks synchronized without hard-coding extra
support-wave logic into the extraction runner.

## Supporting review index

When the supporting VM wave is complete, create a tracked review index under
`docs/review/` that summarizes the ignored supporting batch packets without
promoting extracted content. The index should remain a summary-only handoff
artifact and should not replace the underlying review packets or batch
manifests.

## VM-21 planning and registry

The VM-21 chapter gets its own dedicated control plan and batch-definition
file rather than sharing the VM-20 or supporting-wave registry. The confirmed
VM-21 page span is pages 143-225, VM-22 remains out of scope for this wave,
and the planned VM-21 batches run from batch-022 through batch-037 in
review-only mode by default.

## VM-21 execution state tracking

The VM-21 plan file remains the canonical batch map even after the controlled
execution run completes. Execution status is tracked in the project-state
documents and ignored working outputs, while the plan and validator keep the
batch sequence synchronized for future regeneration.

## VM-21 review index

The tracked VM-21 review index is a summary-only handoff artifact. It should
stay aligned with the ignored batch review packets and must not be treated as
promoted content, learner-facing content, app-ready output, or RAG-ready
material.

## VM-22 planning and registry

The VM-22 chapter gets its own dedicated control plan and batch-definition
file rather than sharing the VM-20, supporting-wave, or VM-21 registries. The
confirmed VM-22 page span is pages 227-318, VM-20 and VM-21 remain out of
scope for this wave, VM-25 stays out of scope except for the closing boundary
confirmation, and the planned VM-22 batches run from batch-038 through
batch-054 in review-only mode by default.

## VM-22 execution state tracking

The VM-22 plan file remains the canonical batch map after the controlled
execution run completes. Execution status is tracked in the project-state
documents and ignored working outputs, while the plan and validator keep the
batch sequence synchronized for future regeneration.

## VM-22 review index

The tracked VM-22 review index is a summary-only handoff artifact. It should
stay aligned with the ignored batch review packets and must not be treated as
promoted content, learner-facing content, app-ready output, or RAG-ready
material.

## Practice note companion guidance

Practice notes are handled as companion / implementation guidance. They may be
processed for review-only analysis, but they are not authoritative regulatory
text and should not be promoted unless a later human review explicitly pairs
them with binding source support.

## Repealed or obsolete guidance

Sources that explicitly say they are repealed, obsolete, or no longer
applicable may be processed as caveat-only review units. They should stay
review-only and non-authoritative unless later binding-source support changes
the status.

## Short guideline units

Self-contained one- or two-page guideline or interpretation PDFs may be
processed as a single review-only batch when the page locator is stable and
the content stays source-bound. Keep OCR or encoding caveats visible in the
review packet rather than widening the batch.

## Page-image backstop for noisy text layers

When a PDF text layer is noisy, encoded, or otherwise unreliable, the page
image becomes the backstop for exact wording. Review-only batches should keep
the page locator stable, flag the wording caveat explicitly, and avoid
widening the batch just because OCR is uncertain.

## Multi-page guideline windows

When a guideline spans multiple pages and the text layer is noisy or
formula-heavy, split it into narrow review-only page windows at page
boundaries instead of extracting the whole file in one broad pass. Keep the
page image as the wording backstop and do not widen the batch just because a
later page is difficult to read.

## Repository proof-of-concept summary

The tracked valuation-regulation repository proof-of-concept summary is a
summary-only handoff artifact. It should stay aligned with the thirty-eight
review indexes and must not be treated as promoted content, learner-facing
content, app-ready output, or RAG-ready material.

## AG 36 companion reprint exclusion

For AG 36, the active 11-page EIUL/CARVM PDF is the canonical source for the
wave. The 2021 Law Manual reprint remains companion-only and out of scope for
this wave unless a later plan explicitly approves it.

## AG 43 noisy text layer handled by existing skill

The AG 43 planning layer reuses the existing low-quality PDF text-layer skill
instead of adding a new AG-specific skill. The current skill already covers
page-image wording backstops, line-reference gaps, and review-only handling
for noisy OCR sources.

## AG 44 noisy text layer handled by existing skill

AG 44 follows the same pattern as AG 43: the existing low-quality PDF
text-layer skill is still sufficient for the noisy OCR and page-image
backstop pattern, so no AG 44-specific skill file was added. The review-only
wave stayed page-locator anchored, line references were not available, and
the attachment tables remained separate from the opening guidance.
