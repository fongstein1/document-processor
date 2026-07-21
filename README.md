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

The expanded POC corpus now covers 12 source packages and 31 canonical chunks.
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
- the CIA 2022 capital/FCT educational note.

The canonical layer stays review-only, not learner-facing, not app-ready, and
not RAG-ready by default. The repository also includes a retrieval readiness
report and a compact evaluation harness for the expanded corpus.

## What lives here

- scripts for inventory, extraction, chunking, labeling, review, export, and
  validation
- durable project-state docs for handoff and auditability
- source-family config and batch templates
- formal JSON schemas for batch manifests, inventories, extraction outputs,
  and review packets
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
4. Select a small source batch and build the inventory, chunk, review, and
   export artifacts.

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
