# Source Index Architecture Audit

## Executive Summary

The repository already has a strong review-first processing workflow:

- source planning artifacts;
- batch manifests;
- extraction outputs;
- review packets;
- self-review notes;
- review indexes;
- project-state handoff documents;
- validation that checks the current batch/review contracts.

What it does not yet have is a durable, backend-neutral canonical source-index
layer that can act as the main machine-readable artifact for retrieval and
reuse across actuarial domains.

This audit concludes that the repository is structurally ready for a POC
source-index layer, but not yet centered on one.

## Current Strengths

- Source-bound batch control already exists.
- Review-only governance is explicit.
- Review indexes provide usable human handoff summaries.
- Self-review files surface boundary and quality cautions.
- Planning documents preserve provenance and source scope.
- The batch registry and validation scripts are already deterministic.
- The workflow is portable across valuation, guideline, regulatory, and
  practice-note source families.
- No-promotion and no-learner-facing guardrails already exist.

## Current Weaknesses

- There is no canonical source-index schema yet.
- There is no repository-level manifest for source-index packages.
- There is no durable JSON/Markdown source-index package format.
- There is no chunk-level export layer for downstream search backends.
- Stable chunk IDs are not yet a first-class contract.
- Retrieval-friendly metadata fields are not yet standardized.
- There is no retrieval-readiness evaluation harness.
- Review output still carries more workflow governance than reusable evidence
  structure.
- The repository does not yet have a reusable generic document model for
  pricing, liability modeling, and governance documents.

## Retrieval Readiness Assessment

### Ready now

- Source planning and batch governance.
- Human-readable review indexes.
- Exception-first review notes.
- Source-bound citation habits.
- Manual review of a small corpus.

### Adequate for a POC

- Human-readable summaries of sources.
- Canonical JSON packages for a small representative corpus.
- A lightweight JSONL and CSV export layer.
- A keyword-style retrieval baseline.

### Missing for scalable RAG

- Stable source-index records with consistent IDs.
- Stable chunk IDs independent of batch IDs.
- Explicit source/version lineage.
- Controlled vocabularies for chunk type and fidelity.
- Corpus-wide export manifests.
- Retrieval-quality measurement beyond structural validation.
- Better support for version, jurisdiction, domain, and authority filtering.

### Should wait for enterprise implementation

- External search services.
- Embeddings or vector pipelines that depend on external platforms.
- Full production reranking services.
- Operational governance for a live database backend.

## Design Recommendation

The repository should keep the existing review workflow, but add a parallel
canonical source-index layer:

raw source
→ extraction/review workflow
→ canonical source index
→ backend-neutral export
→ retrieval
→ evidence package
→ LLM answer with citations

That structure allows the same repo to support valuation, regulatory,
pricing, liability-modeling, and governance document families.

## Specific Architecture Findings

### 1. Source fidelity

The current batch outputs can preserve source text, but they do not yet carry a
canonical fidelity contract that makes the difference between:

- actual extracted source text;
- manually curated source text;
- review-artifact-derived text;
- AI-generated summary;
- inferred interpretation;
- placeholder text.

That distinction needs to be explicit in the source-index model.

### 2. Chunk quality

The review workflow already preserves useful document windows, but the current
artifacts do not yet define a stable chunk hierarchy for retrieval.

The source-index model should support:

- parent / child relationships;
- preceding / following chunk references;
- heading paths;
- section labels;
- page ranges;
- table or appendix support;
- source locators.

### 3. Retrieval indexing

The current repository does not yet standardize enough metadata for:

- keyword search;
- semantic search;
- hybrid search;
- metadata filtering;
- authority ranking;
- jurisdiction filtering;
- version filtering;
- source-family scoping;
- citation reconstruction.

The POC should add a compact but useful set of fields instead of trying to
anticipate every future backend.

### 4. Source hierarchy and relationships

The current relationship registry is useful, but the source-index layer should
make relationship IDs and reciprocal links easier to preserve.

The POC should support:

- supersedes;
- amends;
- restates;
- reprints;
- interprets;
- implements;
- references;
- companion guidance;
- duplication and lineage.

### 5. Human usability

The current review indexes are good for handoff, but they should not be the
only human-facing layer in the long term.

A human should be able to browse:

- source metadata;
- source summaries;
- evidence chunks;
- citations;
- workflow logs;
- relationship links.

### 6. Generic applicability

The repository is still shaped by NAIC material and review workflows.

It should introduce a generic core so that future pricing and liability-modeling
documents can reuse the same model without forcing NAIC-specific assumptions
into every record.

### 7. Validation depth

Current validation proves the review scaffold is well-formed, but it does not
yet test retrieval usefulness.

The POC needs checks for:

- stable IDs;
- page ranges;
- text fidelity;
- chunk coverage;
- export consistency;
- source/version lineage;
- duplicate detection;
- retrieval baseline behavior.

## Recommended POC Implementation

The best next step is a small but complete source-index POC for:

1. AG 01;
2. AG 03;
3. a small VM-20 excerpt.

That POC should include:

- canonical source-index JSON;
- human-readable Markdown summaries;
- processing logs;
- repository manifest;
- JSONL and CSV exports;
- retrieval questions and results;
- validation for schema and export consistency.

## Conclusion

The repository is ready to evolve from review-first processing into a
canonical-index-first architecture. The new layer should remain portable,
source-bound, and backend-neutral while keeping the existing governance and
review artifacts intact.

## POC Implementation Result

The expanded POC package is now tracked under `data/processed/source_indexes/`
and covers 12 representative source packages / 31 canonical chunks:

- AG 01 and AG 03 as single-page interpretive guideline slices;
- VM-20 overview, boundary, and assumption windows;
- VM-21 stochastic reserve projection entry;
- AG 36 active guideline material and the 2021 Law Manual reprint;
- model governance practice-note material;
- actuarial memorandum practice-note material;
- Regulation 210;
- the CIA 2022 capital/FCT educational note.

The generated package includes:

- canonical source-index JSON records;
- Markdown companions for each source;
- a repository manifest;
- JSONL and CSV exports;
- an export manifest;
- retrieval questions and results;
- a retrieval readiness report;
- a lightweight retrieval evaluation.

## Output-Quality Review

The POC demonstrates the following quality decisions:

- source text remains separated from summaries and normalized excerpts;
- noisy guideline and companion text uses review-artifact-derived or curated
  source-text types instead of pretending to be exact verbatim text;
- VM-20 and VM-21 preserve actual extracted source-text types for the manual
  slices;
- AG 36 keeps the active source separate from the Law Manual reprint via
  explicit relationship metadata;
- practice-note and educational-note material stays clearly labeled as
  companion guidance;
- page locators remain visible even when line references are unavailable;
- review-only and promotion states stay metadata, not the primary evidence
  layer;
- the Markdown companions remain human-readable rather than authoritative.

The POC retrieval baseline is intentionally lightweight. It proves that the
canonical layer can support a simple keyword-overlap retrieval check across
supported and unsupported queries while remaining backend-neutral for later
SQL, Dataverse, SharePoint Lists, Azure AI Search, or PostgreSQL
implementations.
