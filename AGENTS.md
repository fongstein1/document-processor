# Document Processor Agent Guide

This repository is a durable document-processing workspace for actuarial,
regulatory, and related governance material.

## Core rules

- Keep JSON as the canonical machine-readable contract.
- Keep Markdown as the human-readable companion layer.
- Keep workflow logs, review packets, and handoff notes separate from the
  canonical source-index layer.
- Keep source text, summaries, interpretations, and review commentary clearly
  distinguishable.
- Keep generic core metadata separate from domain-specific extensions.
- Treat review-only, learner-facing, promoted, app-ready, and RAG-ready states
  as governance metadata, not as the primary canonical source record.
- Protect sensitive documents and only use approved local or enterprise
  environments.
- Avoid new external network dependencies unless explicitly approved.

## Validation and hygiene

- Run the repository validation before committing meaningful changes.
- Keep generated outputs deterministic and reproducible where practical.
- Do not commit raw source files or ignored working-batch outputs.
- Keep the working tree clean before starting a new source unit or new phase.

## Architecture intent

- Preserve a source-bound trail from source document to canonical chunk.
- Keep the machine-readable layer backend-neutral so it can later feed SQL,
  Dataverse, Azure AI Search, PostgreSQL, SharePoint Lists, or a similar
  approved retrieval backend.
- Keep review artifacts available, but do not let review metadata replace the
  canonical source index.
