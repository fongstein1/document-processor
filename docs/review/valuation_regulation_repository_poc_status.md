# Valuation Regulation Repository Proof-of-Concept Status

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This summary is a tracked proof-of-concept handoff for the valuation
regulation repository. It consolidates the completed review-only extraction
waves without changing the status of the underlying batch outputs or review
indexes.

This summary is review-only, not learner-facing, not app-ready, not RAG-ready,
and not promoted.

The detailed evidence remains in the batch review packets and the chapter
review indexes:

- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/vm20_practice_note_review_index.md`
- `docs/review/ag03_review_index.md`
- `docs/review/ag03_self_review.md`

## Executive Status

The processor now supports a source-bound, review-first document-processing
factory for NAIC valuation-manual material and related actuarial source
families.

What has been built:

- formal JSON-schema contracts for batch manifests, source inventories,
  extraction outputs, and review packets
- reusable templates and demo fixtures for the same contracts
- controlled batch definitions and chapter plans for VM-20, supporting VM
  chapters, VM-21, VM-22, and the VM-20 companion practice note
- review-packet and unresolved-issues workflows that keep exception-first
  review visible
- tracked end-of-sequence review indexes for the completed waves
- tracked AG 03 review index and self-review note for the one-page guideline
  unit in `docs/review/ag03_self_review.md`
- project-state docs that preserve the handoff history

What source families / chapters have been processed:

- VM-20, batches `batch-003` through `batch-012`
- supporting VM chapters:
  - VM-01, `batch-013`
  - VM-02, `batch-014`
  - VM-25, `batch-015`
  - VM-26, `batch-016`
  - VM-30, `batch-017` through `batch-018`
  - VM-31, `batch-019` through `batch-021`
- VM-21, batches `batch-022` through `batch-037`
- VM-22, batches `batch-038` through `batch-054`
- VM-20 companion practice note, batches `batch-055` through `batch-075`
- AG 03 single-page guideline, `batch-076`

What remains review-only:

- every completed batch and every tracked review index
- the ignored working storage under `data/work/batches/`
- every extracted item that has not been explicitly promoted by the separate
  app/product thread

What has not been promoted:

- no learner-facing content
- no app-ready export
- no RAG-ready export
- no promoted content set

What is explicitly out of scope:

- raw source files in Git
- unapproved learner-facing or app-ready promotion
- unapproved RAG-ready export
- future pricing and liability-modeling repository work until separately
  planned
- the other Practice Notes files and unplanned Actuarial Guideline or NY
  regulation files until separately planned
- any unplanned Valuation Manual chapter families outside the completed
  controlled waves

## Coverage Table

| VM chapter | Page range | Batch IDs | Review index | Status | Key caution areas |
| --- | --- | --- | --- | --- | --- |
| VM-20 | `pp. 45-95` | `batch-003` through `batch-012` | `docs/review/vm20_review_index.md` | Complete; review-only | Framework overview, NPR mechanics, Section 3.C assumptions, DR / SR openers, exclusion tests, model structure, asset mechanics, and reinsurance / boundary cleanup |
| VM-01 | `pp. 25-39` | `batch-013` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | Definitions and cross-reference alignment only |
| VM-02 | `pp. 41-44` | `batch-014` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | Minimum nonforfeiture reserve-method structure and later coordination points |
| VM-25 | `pp. 319-320` | `batch-015` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | A&H reserve applicability and appendix / guideline cross-references |
| VM-26 | `pp. 321-324` | `batch-016` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | Contract reserve versus claim reserve language and Model #820 references |
| VM-30 | `pp. 325-339` | `batch-017` through `batch-018` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | Opinion / memorandum reporting, governance, reliance, and actuarial judgment |
| VM-31 | `pp. 341-386` | `batch-019` through `batch-021` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | PBR Actuarial Report requirements, controls, and the closing boundary before VM-50 |
| VM-21 | `pp. 143-225` | `batch-022` through `batch-037` | `docs/review/vm21_review_index.md` | Complete; review-only | Scope, reserve methodology, SR projection, asset mechanics, hedging, assumptions, and closing allocation |
| VM-22 | `pp. 227-318` | `batch-038` through `batch-054` | `docs/review/vm22_review_index.md` | Complete; review-only | Background / scope, reserve methodology, projection and asset mechanics, stochastic exclusions, scenario generation, hedging, assumptions, and page-318 closure before VM-25 |
| VM-20 companion practice note | `pp. 1-115` | `batch-055` through `batch-075` | `docs/review/vm20_practice_note_review_index.md` | Complete; review-only | Non-binding disclaimer, calculation overview, reserve overviews, assumptions, reinsurance, hedging, and implementation-guidance boundaries |
| AG 03 single-page guideline | `p. 1` | `batch-076` | `docs/review/ag03_review_index.md` | Complete; review-only | Maturity-value interpretation, cash surrender treatment, and encoded-text caveat |

## Completed Assets

The repository now includes the core processor asset set:

- schemas in `data/schemas/`
- templates in `data/templates/`
- contract demo fixtures in `data/samples/contract-demo/`
- batch manifests, source inventories, chunk manifests, extraction outputs,
  review packets, validation reports, and unresolved-issues summaries for the
  controlled batches under `data/work/batches/`
- tracked review indexes in `docs/review/`
- the tracked VM-20 practice-note review index and self-review note in
  `docs/review/`
- the tracked AG 03 review index and self-review note in `docs/review/`
- VM chapter planning artifacts in `docs/processor/` and `config/`
- project-state docs in `docs/project-state/`
- runner / validator scripts in `scripts/`

These assets are intentionally lightweight and auditable. The raw source
documents remain external to Git.

## Validation Posture

- `npm run check` passes
- the scaffold reports 76 batches validated
- the validator now checks the tracked VM-20, supporting, VM-21, VM-22,
  practice-note, AG 03, and POC status summary handoff files
- review-only and no-promotion guardrails are enforced in the batch manifests
  and review packets
- ignored working outputs stay under `data/work/`
- `git diff --check` currently reports only the known CRLF normalization
  warnings in the working tree

## Human Review Posture

- Reviewers should start from the six review indexes listed above.
- The review packets remain the detailed evidence layer behind those
  summaries.
- All batch content remains source-bound and review-only unless a separate
  promotion workflow explicitly changes the status.
- No learner-facing status should be inferred from the presence of a batch or
  a review index alone.
- The review indexes are handoff aids, not promoted artifacts.

## Promotion Gates

The next gated choices are still the same:

- keep review-only
- revise extraction
- create selected learner-facing draft candidates
- create selected RAG-ready candidates
- create selected app-export candidates

Any promotion should happen in the separate app/product thread after explicit
human review of the source-bound evidence.

## Remaining Work

The proof-of-concept pipeline is complete for the controlled waves in this
workspace, but future work may still include:

- any additional Valuation Manual chapters that are approved later
- any additional Practice Notes, Actuarial Guidelines, or NY regulations that
  are approved later
- future pricing repository work
- future liability-modeling repository work
- a framework layer that can align liability, valuation-regulation, and
  pricing repositories
- later Copilot Studio portability considerations

## Recommended Next Step

Review the proof-of-concept package first. If the stakeholder decision is to
expand rather than pause, the next gated step should be to select the next
small Actuarial Guideline or NY regulation source unit and continue the same
review-only workflow. If the broader roadmap needs to split by domain, the
clean follow-on is to start a pricing repository or a liability-modeling
repository as a separate family.
