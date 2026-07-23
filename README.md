# Document Processor

Dedicated workspace for a repeatable, auditable document-processing pipeline for
NAIC valuation, regulatory, pricing, liability-modeling, and governance source
material.

## Canonical source-index POC

The repository now includes a small backend-neutral canonical source-index
proof of concept under `data/processed/source_indexes/`. It demonstrates how
review-only batch outputs can be converted into reusable JSON, Markdown, JSONL,
CSV, and retrieval-evaluation artifacts without replacing the underlying
review packets or handoff notes.

The expanded POC corpus now covers 17 source packages and 41 canonical chunks.
It includes:

- AG 01 net-premium interpretation;
- AG 03 maturity-value interpretation;
- a narrow VM-20 framework overview and mechanics-boundary slice;
- a VM-20 Section 3.C assumptions slice;
- a VM-21 stochastic reserve projection entry;
- AG 36 active guideline material;
- the AG 36 2021 Law Manual reprint as companion-only evidence;
- model governance practice-note material;
- actuarial memorandum practice-note material;
- Regulation 210;
- the CIA 2022 capital/FCT educational note;
- a synthetic pricing corpus that proves the canonical layer can extend
  beyond the regulatory family without hard-coding NAIC-only assumptions.

The canonical layer stays review-only, not learner-facing, not app-ready, and
not RAG-ready by default. The repository also includes a retrieval readiness
report, a deterministic classification layer, and a compact evaluation
harness for the expanded corpus. New document families can now enter through a
document-family intake manifest and scanner before they are turned into the
canonical source-index layer.

## What lives here

- scripts for inventory, extraction, chunking, labeling, review, export, and
  validation
- intake contracts and a deterministic family-intake scanner for new document
  families
- durable project-state docs for handoff and auditability
- source-family config and batch templates
- formal JSON schemas for batch manifests, inventories, extraction outputs,
  and review packets
- formal JSON schemas for family intake manifests and document classification
- a reviewed-source-pack contract and intake-to-source-index adapter for
  canonical POC package generation
- a candidate relationship registry for companion, reprint, amendment,
  supersession, and cross-reference edges
- canonical source-index schemas and repository-manifest schemas
- lightweight contract fixtures under `data/samples/contract-demo/`
- lightweight manifests, sanitized exports, and review packets

## What stays out

- raw source PDFs, DOCX files, videos, and large proprietary documents
- the reference app repo UI and routes
- generated heavy outputs or working caches

Raw source material is stored externally at:

`D:\Work\AI Projects\NAIC Valuation Manual Course`

The reference app repo is read-only context only:

`C:\Users\David\Documents\Codex\2026-06-23\please-build-a-self-hosted-elearning`

## Quick start

1. Inspect the current state docs in `docs/project-state/`.
2. Run `npm run check` to validate the scaffold.
3. Run `npm run bootstrap` to create the first batch workspace.
4. For a new document family, create or review the intake manifest and run the
   family-intake scanner first.
5. Select a small source batch and build the inventory, chunk, review, and
   export artifacts. When reviewed source-bound chunks exist, run the family
   source-index adapter to prepare canonical POC packages.

## Output contract

Each batch should produce:

- source inventory
- chunk manifest
- review packet
- approved/promoted content export, when a promotion candidate has been
  explicitly approved
- app-ready export, when approved content is ready for the app thread
- validation report
- unresolved-issues summary

Review-only pilot batches may stop after the review packet, validation report,
and unresolved-issues summary. The approved and app-ready exports stay out of
the batch until a human promotion decision is made.

See `docs/processor/PROJECT_BRIEF.md` for the operating rules and folder
layout.
