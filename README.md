# Document Processor

Dedicated workspace for a repeatable, auditable document-processing pipeline for
NAIC valuation, regulatory, pricing, liability-modeling, and governance source
material.

## What lives here

- scripts for inventory, extraction, chunking, labeling, review, export, and
  validation
- durable project-state docs for handoff and auditability
- source-family config and batch templates
- formal JSON schemas for batch manifests, inventories, extraction outputs,
  and review packets
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
- approved/promoted content export
- app-ready export
- validation report
- unresolved-issues summary

See `docs/processor/PROJECT_BRIEF.md` for the operating rules and folder
layout.
