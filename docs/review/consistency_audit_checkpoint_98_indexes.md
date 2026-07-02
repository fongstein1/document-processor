# Consistency Audit Checkpoint - 98 Review Indexes

## Executive Summary

This checkpoint audited the review-only valuation-regulation proof of concept after the AG 36 and AG 38 Law Manual reprint handoffs. No new source documents were processed, no learner-facing or app-ready material was created, and no promotion decision was made.

The repository is consistent enough to resume first-pass inventory burn-down after this audit. The main operational risk is now relationship management, not extraction mechanics: Regulation 213 addenda, NY-regulation slices, practice-note companions, educational-note companions, active Actuarial Guidelines, and Law Manual reprints are all present as separate review-only artifacts, but their overlaps are mostly tracked through prose rather than a structured relationship layer.

## Current Review-Index Count

- Authoritative handoff count: 98 review indexes.
- Count source: `docs/review/valuation_regulation_repository_poc_status.md` and the scaffold validator's POC summary check.
- Raw file signal: `docs/review` currently contains 96 `*_review_index.md` files and 92 `*_self_review.md` files. This is not a blocking mismatch because some conceptual handoff indexes are represented through grouped historical review-index files rather than a one-file-per-count model.
- Current latest source unit: AG 38 Law Manual reprint, batch-280.

## Latest Processed Source Families

- AG 37 Law Manual reprint: batch-277, companion-only duplicate / reprint check against active AG 37.
- AG 48 Law Manual reprint: batch-278, companion-only duplicate / reprint check against active AG 48.
- AG 36 Law Manual reprint: batch-279, companion-only duplicate / reprint check against active AG 36.
- AG 38 Law Manual reprint: batch-280, companion-only duplicate / reprint check against active AG 38.
- Recent NY-regulation slices: Regulations 192, 102, 128, 127, 179, 136, 143, 56, 126, 147, and 151.
- Recent Regulation 213 family materials: core Regulation 213, Amendment No. 1 FAQ, First Amendment text, Second Amendment, Third Amendment, Fourth Amendment, Fifth Amendment, and proposed Sixth Amendment.
- Recent companion guidance: C3 Phase 2 practice notes, CIA educational notes, actuarial memorandum practice note, life reinsurance practice note, LTCI practice note, model-governance practice note, and Model Regulation XXX practice note.

## Consistency Findings

- The POC summary has current addenda through AG 38 Law Manual reprint and correctly states that the handoff spans 98 review indexes.
- Recent project-state docs also state that AG 38 Law Manual reprint completed batch-280 and brought the handoff to 98 review indexes.
- The remaining inventory assessment correctly marks AG 36 and AG 38 Law Manual reprints as processed and calls for a consistency checkpoint before further source selection.
- The repository remains review-only in the audited surfaces. I did not find promotion, learner-facing, app-ready, or RAG-ready language introduced by the latest waves.
- `docs/project-state/NEXT_ACTIONS.md` and `docs/project-state/CURRENT_STATE.md` are append-heavy and contain older historical next-candidate statements. They are understandable as history, but they are increasingly noisy as an operational entry point.

## Naming Findings

- Recent Law Manual reprint naming is consistent:
  - `ag36_law_manual_reprint_review_index.md`
  - `ag36_law_manual_reprint_self_review.md`
  - `ag37_law_manual_reprint_review_index.md`
  - `ag37_law_manual_reprint_self_review.md`
  - `ag38_law_manual_reprint_review_index.md`
  - `ag38_law_manual_reprint_self_review.md`
  - `ag48_law_manual_reprint_review_index.md`
  - `ag48_law_manual_reprint_self_review.md`
- Recent NY-regulation naming is consistent enough for review handoff use. `reg056` is the only zero-padded regulation stem among the recent NY-regulation files, and it appears to follow the source-file naming rather than creating a new convention.
- Regulation 213 addendum names clearly distinguish FAQ, amendment text, and numbered amendments.
- Some older files use pending or historical commit markers inside tables. This is not a source-bound correctness issue for the 98-index checkpoint, but it is a sign that a future metadata pass should normalize handoff provenance.

## Caveat And Source-Status Findings

- Law Manual reprints are consistently caveated as companion-only reprints and duplicate-source checks, not replacements for active AG review artifacts.
- Practice notes and educational notes are consistently caveated as non-binding companion guidance.
- Regulation 213 Amendment No. 1 FAQ is caveated as companion-only guidance, while certified or final-adoption amendment texts are separated from the FAQ and core Regulation 213.
- Regulation 213 proposed Sixth Amendment is explicitly caveated as proposed text and should not be treated as final binding rule text without later confirmation.
- Recent NY-regulation slices keep active-regulation and page-image wording-backstop caveats visible, especially where text layers are noisy or OCR-like.

## Validator And Registry Findings

- The scaffold validator has explicit coverage for the recent Law Manual reprint batch plans, scripts, review indexes, self-reviews, and POC count.
- The shared batch registry includes recent batch definitions through batch-280.
- `config` contains 95 batch-plan JSON files and `docs/processor` contains 95 extraction-plan markdown files, which aligns with the current planned-source-unit surface rather than the conceptual 98-index count.
- The validator is now doing a large amount of source-family accounting in code. That works for the current checkpoint, but it is becoming harder to reason about than a small structured relationship registry would be.

## Duplicate Or Overlap Risks

- Active AG 36, AG 37, AG 38, and AG 48 review artifacts overlap with their Law Manual reprints. These should stay separated until a human confirms whether the reprints are exact duplicates, partial updates, or useful companion context.
- Regulation 213 core text, FAQ, certified amendment texts, final-adoption text, and proposed amendment text overlap by design. The current separation is appropriate, but downstream users will need structured relationship flags before relying on a later repository layer.
- C3 Phase 2 practice-note materials overlap with AG 43 and earlier practice-note material. The March 2011 practice-note decision already records a coherent source-bound boundary, but a relationship registry would make that relationship easier to audit.
- Life & Health Law Manual opening material and other manual-style sources can overlap with active AG, VM, or model-law content. Broad manual sources should stay deferred unless a narrow page window and relationship status are explicit.

## Source-Family Relationship Opportunities

- Create explicit relationship entries for active-source versus companion-reprint pairs.
- Group Regulation 213 family materials under one relationship cluster while preserving each source's status: core regulation, companion FAQ, certified amendment, final adoption, or proposed amendment.
- Group NY Regulations as a source family with jurisdiction, regulation number, status, page-window, and source-text quality fields.
- Group practice notes and educational notes as companion guidance, with fields for related binding sources and stale/superseded warnings.
- Track duplicate-source disposition separately from extraction quality so reviewers can accept the extraction while leaving legal or actuarial interpretation unresolved.

## Document Relationship Registry Recommendation

A relationship-aware registry is now justified before the project moves far beyond this checkpoint. The registry should be tracked, review-only, and source-bound. It should not promote content or decide regulatory meaning.

Recommended fields:

- `source_id`
- `source_family`
- `canonical_or_related_source_id`
- `relationship_type`
- `status`
- `binding_posture`
- `jurisdiction_or_authority`
- `page_window`
- `batch_ids`
- `review_index`
- `self_review`
- `duplicate_disposition`
- `human_decision_required`
- `notes`

Recommended relationship types include `active_source`, `law_manual_reprint`, `companion_faq`, `certified_amendment`, `final_adoption`, `proposed_amendment`, `practice_note`, `educational_note`, `manual_excerpt`, `duplicate_candidate`, and `superseded_or_stale_context`.

## Issues That Should Be Fixed Now

- No substantive extraction content should be changed as part of this checkpoint.
- No validator failure, forbidden staged file, or source-bound caveat failure was found before creating this audit.
- The only low-risk tracked updates made here are this checkpoint artifact and the session-log entry recording the audit.

## Issues That Can Wait

- Normalize older project-state docs so historical next-candidate statements are easier to distinguish from current instructions.
- Convert relationship and duplicate caveats from prose-only tracking into a structured document relationship registry.
- Consider a metadata-normalization pass for older review tables that still contain pending or historical commit markers.
- Consider making the review-index count data-driven instead of a long conditional ladder in the scaffold validator.

## Next Recommended Source-Processing Approach

Do not select another source solely from memory. After this checkpoint, the next safest step is to create a small review-only document relationship registry covering the highest-overlap families already processed: Regulation 213, AG 36/37/38/48 active-versus-reprint pairs, recent NY-regulation slices, and companion practice-note families.

If the burn-down resumes before that registry exists, select only one clearly bounded source unit by fresh inspection of the received inventory, verify that it is not a duplicate of an already processed source, and keep the batch small enough to preserve page-window reviewability.

## Safe To Continue

It is safe to resume the burn-down after this audit if validation passes and the working tree is clean. The recommended next step is a relationship-registry checkpoint, not another source extraction, because the project has reached the point where duplicate and companion-source relationships are the main risk to later repository readiness.
