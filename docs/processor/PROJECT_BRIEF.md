# Project Brief

This repository is the document-processing factory for the NAIC valuation
manual / eLearning regulatory knowledge project and the reusable actuarial
document-structurizer proof of concept.

The learner-facing app is owned by the separate app/product thread. This repo
owns source inventory, text extraction, chunking, metadata, summaries, review
packets, app-ready exports, and validation. New document families enter
through a document-family intake manifest and scanner before they flow into
the canonical source-index layer.

## Mission

Build repeatable document processing, not a second app.

The pipeline should support:

- NAIC regulation documents
- pricing documents
- liability modeling documents
- future actuarial governance and process documents
- synthetic corpora used to prove profile portability

## Non-negotiables

- Keep raw source documents in the external raw folder, not in Git.
- Do not modify the reference app repo unless explicitly asked.
- Treat every generated output as source-bound and auditable.
- Promote content only when it satisfies citation, clarity, confidence, and
  review gates.
- Minimize manual review by surfacing exceptions and promotion candidates only.
- Keep raw material separate from Git; store only scripts, schemas, docs,
  templates, lightweight manifests, and sanitized exports here.

## Formal contract layer

The first stable processor contracts live in `data/schemas/` and
`data/templates/`.

Contract files:

- `data/schemas/batch-manifest.schema.json`
- `data/schemas/source-inventory.schema.json`
- `data/schemas/extraction-output.schema.json`
- `data/schemas/review-packet.schema.json`
- `data/schemas/document-classification.schema.json`
- `data/schemas/document-family-intake.schema.json`
- `data/schemas/document-family-reviewed-source-pack.schema.json`
- `data/schemas/document-family-relationship-registry.schema.json`
- `data/templates/batch-manifest.template.json`
- `data/templates/review-packet.template.json`
- `data/templates/review-packet.template.md`
- `data/templates/document-family-intake.template.json`
- `data/templates/document-family-reviewed-source-pack.template.json`
- `data/templates/document-family-relationship-registry.template.json`
- `data/samples/contract-demo/`
- `data/samples/contract-demo/document-family-intake.example.json`
- `data/intake/README.md`
- `docs/processor/document_family_source_index_adapter.md`
- `scripts/build-document-family-relationship-registry.mjs`

These contracts are intentionally generic. NAIC-specific assumptions stay in
`config/source-families.json`, while the schemas remain portable enough for
pricing, liability modeling, experience studies, internal model documents,
and synthetic corpus validation.

Raw source root:

`D:\Work\AI Projects\NAIC Valuation Manual Course`

Reference app repo:

`C:\Users\David\Documents\Codex\2026-06-23\please-build-a-self-hosted-elearning`

## Additional skills to enforce

### 1. Source-Bound Extraction Skill

All outputs must be traceable to source documents and chunk IDs. Do not create
unsupported regulatory, actuarial, pricing, or modeling claims. Where the
source support is unclear, label the item `needs_human_review` rather than
promoting it.

### 2. Learner-Facing Promotion Gate Skill

Treat processing outputs as draft candidates by default. A chunk, summary,
glossary item, quiz item, or lesson point becomes learner-facing only when all
of the following are true:

- source citation exists
- source support is clear
- wording is not misleading
- confidence is high
- no unresolved review flags exist

Otherwise, keep it in review output only.

### 3. RAG-Readiness Skill

Structure processed outputs for future retrieval-augmented generation. Each
chunk or export should include:

- stable ID
- domain
- module/topic label
- source document title
- source path or source reference
- page/section reference where available
- chunk text
- summary
- keywords
- confidence/review flags
- learner-facing eligibility status

Future research assistants should answer from approved indexed material, cite
that material, and say when the indexed material does not support an answer.

### 4. Exception-First Review Skill

Minimize manual review by creating concise review packets focused only on:

- extraction failures
- missing citations
- low-confidence labels
- ambiguous source language
- possible contradictions
- proposed learner-facing promotions
- material that may require actuarial judgment

The reviewer should inspect exceptions and promotion candidates, not every
chunk.

### 5. Cross-Domain Portability Skill

Design the processor so the same framework can support:

- NAIC regulation documents
- pricing documents
- liability modeling documents
- future actuarial governance and process documents

Avoid hard-coding NAIC-specific assumptions unless they are isolated in domain
config.

### 6. Privacy and Data Hygiene Skill

Do not commit raw internal documents, proprietary pricing files, liability
model documentation, videos, large PDFs, or sensitive data. Use manifests,
metadata, sanitized summaries, and lightweight app exports. Flag any file that
appears sensitive before processing or exporting.

### 7. App Export Contract Skill

The processor should produce clean app-ready exports without changing the app
UI. App exports should be stable, lightweight, versioned, and easy for the
app/product thread to import.

## Project goals

1. Build a document factory, not a second app.
2. Start with one small source batch and prove the full pipeline before scaling.
3. Make the process auditable from source to export.
4. Reduce manual review burden with automated extraction, chunking, labeling,
   summarization, and citation mapping.
5. Prepare for a future research assistant that can answer from approved,
   indexed material with citations.
6. Keep raw material separate from Git.
7. Preserve a clean handoff to downstream consumers with inventory, manifest,
   classification, review packet, retrieval evaluation, validation report,
   and unresolved issues.

## Proposed folder structure

```text
.
├── config/
├── data/
│   ├── templates/
│   ├── manifests/
│   ├── review/
│   ├── exports/
│   └── work/                # ignored
├── docs/
│   ├── codex/skills/
│   ├── processor/
│   └── project-state/
├── scripts/
└── tests/                   # added when validation needs executable checks
```

## Processing workflow

1. Inventory the selected raw source folder or batch.
2. Record file metadata, sensitivity flags, intake overrides, and extraction
   feasibility.
3. Use the family intake manifest and scanner to select the profile and build a
   deterministic inventory.
4. Extract text and preserve page or section locators.
5. Chunk by source structure, not arbitrary token size.
6. Label chunks with summary, keywords, confidence, and review flags.
7. Build concise review packets that only show exceptions and promotions.
8. Promote approved items into sanitized exports.
9. Produce app-ready exports without changing the app UI.
10. Validate IDs, citations, learner-facing eligibility, and unresolved
    issues.
11. Update project-state docs and hand off the batch.

## Output contract

Every batch should end with:

- intake inventory, when a family-intake manifest is in play
- reviewed source-bound package, when the family source-index adapter is in
  play
- source inventory
- chunk manifest
- classification record, when a profile-aware classifier is in use
- review packet
- approved/promoted content export
- backend-neutral export
- validation report
- unresolved-issues summary

These outputs should remain lightweight, versioned, and easy to import.
Review-only pilot batches may stop after the review packet, validation report,
and unresolved-issues summary until a promotion candidate is explicitly
approved.
