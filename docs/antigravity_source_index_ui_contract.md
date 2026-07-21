# Antigravity Source-Index UI Contract

## Purpose

This document defines how the Antigravity UI can consume the canonical
source-index layer without needing to understand the review-only batch
workflow that produced it.

The UI contract is backend-neutral and assumes the source-index package is the
primary machine-readable layer.

## Stable inputs

The UI should treat these as the stable contracts:

- `data/processed/source_indexes/repository-manifest.json`
- `data/processed/source_indexes/sources/*.json`
- `data/processed/source_indexes/sources/*.md`
- `data/processed/source_indexes/exports/source_chunks.jsonl`
- `data/processed/source_indexes/exports/source_chunks.csv`
- `data/processed/source_indexes/exports/export_manifest.json`
- `data/processed/source_indexes/evaluation/retrieval_questions.json`
- `data/processed/source_indexes/evaluation/retrieval_results.json`
- `data/processed/source_indexes/retrieval/retrieval-evaluation.json`
- `data/processed/source_indexes/retrieval/retrieval-evaluation.md`
- `docs/retrieval_poc_corpus_plan.md`
- `docs/retrieval_readiness_report.md`

## Recommended views

### 1. Source library

Show one row per source package with:

- source title;
- source ID;
- source version ID;
- source family;
- authority level;
- jurisdiction;
- source status;
- page range;
- chunk count;
- review posture;
- source-text fidelity.

### 2. Source detail

Show the source record, the Markdown companion, and the related review
artifacts together.

This view should make clear:

- what the source is;
- what the source is not;
- whether the package is review-derived, curated, or exact;
- whether a page-image or page-locator backstop is needed.

### 3. Chunk explorer

Show each chunk with:

- chunk ID;
- heading path;
- section reference;
- page range;
- topic;
- source text excerpt;
- normalized search text;
- summary;
- key points;
- concepts;
- defined terms;
- acronyms;
- requirements or key points;
- citation display;
- source-text fidelity;
- relationship IDs.

### 4. Chunk detail

Show the selected chunk plus its immediate neighbors and related chunks.

The UI should make it easy to answer:

- what the chunk says;
- why it is separate;
- what it depends on;
- what it links to;
- whether it is authoritative, review-derived, or companion-only.

### 5. Source-fidelity indicator

Use a visible indicator for:

- actual extracted source text;
- manually curated source text;
- review-artifact-derived text;
- summary-only or placeholder text.

### 6. Relationship viewer

Show directional relationships with stable IDs and relation types such as:

- references;
- implements;
- interprets;
- amends;
- supersedes;
- reprints;
- companion guidance;
- duplicate or reprint;
- jurisdictional modification;
- related methodology;
- same source;
- boundary or support links.

### 7. Retrieval-result viewer

Show:

- query text;
- query category;
- expected support level;
- top-ranked chunks;
- score breakdown;
- insufficient-support outcome, when appropriate;
- citation availability;
- source-family and authority-level signals.

### 8. Selected evidence package

Allow the user to build a citation bundle from the selected chunks and source
records.

The bundle should carry:

- source title;
- source ID;
- source version ID;
- source family;
- authority level;
- page references;
- section references;
- chunk IDs;
- relationship IDs;
- fidelity status;
- review posture.

## Stable UI fields

Treat these fields as stable and reusable:

- `repositoryManifestId`
- `sourceIndexId`
- `sourceId`
- `sourceVersionId`
- `sourceTitle`
- `sourceFamilyId`
- `documentType`
- `authorityLevel`
- `sourceStatus`
- `jurisdiction`
- `pageRange`
- `chunkId`
- `chunkOrdinal`
- `chunkKind`
- `headingPath`
- `sectionReference`
- `pageReference`
- `topic`
- `sourceTextExcerpt`
- `normalizedSearchText`
- `summary`
- `keyPoints`
- `concepts`
- `definedTerms`
- `acronyms`
- `requirements`
- `citationDisplay`
- `fidelity`
- `confidence`
- `relationshipIds`
- `reviewIndexPath`
- `selfReviewPath`
- `pageImageBackstop`
- `lineReferencesAvailable`

## UI cautions

- Do not present review-derived text as if it were verified verbatim source
  text.
- Do not imply learner-facing or app-ready promotion from the presence of a
  source index alone.
- Do not collapse companion guidance into binding regulatory text.
- Do not suppress insufficient-support retrieval outcomes.

## Handoff note

The UI should treat the repository manifest and source-index JSON as the
canonical layer and use the Markdown, logs, and retrieval results as
supporting views only.
