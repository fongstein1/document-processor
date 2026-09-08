# Parent–child context architecture

This branch adds a review-only architecture evaluation on top of the verified
Level-3 processor. It does not change canonical corpora, acquire sources, or
make output learner-facing, promoted, or RAG-ready.

## Model

A parent is a source-defined context container: a deterministic PDF section,
SSAP, appendix, schedule, or other detected marker; or an XLSX worksheet/table
block. A child is the primary retrieval unit. Children retain source lineage,
role, structural coordinates, citation coordinates, review flags, and a stable
ID derived from the source and structural coordinates. A child is never
created for every workbook cell.

The current PDF page-window artifacts remain the baseline and fallback. They
are not called parent-child chunks. When deterministic structure is not
reliably detected, the representation is explicitly
`STRUCTURE_FALLBACK_PAGE_WINDOWS`. Structure-aware output is explicitly
`STRUCTURE_AWARE_PARENT_CHILD`; the initial detector is conservative and does
not claim complete semantic hierarchy.

## Structure detection

PDF detection uses source text markers such as SSAP, Appendix, Section, Part,
and Schedule. It creates a bounded parent context and maps subsequent source
chunks to semantic retrieval children until the next detected boundary. This
is page-aware and marker-aware, not an LLM-generated authoritative heading
model. A3 is evaluated as a long-manual proving ground, with coverage and
fallback counts reported in the generated manifest.

Workbook processing is parallel rather than PDF-shaped:

`workbook → worksheet/table block parent → row/range child`

It uses existing sheet, block, row, range, formula, and citation coordinates.
Native non-cell content remains subject to the existing exception-first
review controls.

## Retrieval and context

Retrieval is corpus-wide over children. Transparent deterministic scoring uses
lexical overlap, section-reference overlap, citation quality, and a bounded
structure-confidence tie-breaker. Evaluation expectations are stored in the
evaluation layer and are excluded from ranking inputs. The selected child is
reranked before context expansion; the entire parent is never dumped by
default.

Expansion is bounded to the containing parent and at most two adjacent
children. It is used for continuation, scope, definitions, exceptions, and
table-header relationships. The evidence-package layer records the selected
child, parent identity, adjacent child IDs, structural citation, scores,
expansion reason, and review flags. Substantive context text is external.

## Rights storage

All proving-ground sources use unresolved rights status in this architecture
evaluation. Substantive parent, child, baseline, and expanded-context content
is written beneath the external/private processing root:

`C:\Dev\Document Processor Sources\_processed-private\parent-child-context-architecture-2026-09`

The repository contains only explicit allowlisted structural and validation
evidence plus SHA-bound external artifact manifests. The rights scanner is a
second fail-closed layer. New parent, child, context, and evidence-package
projections must remain non-content-bearing in Git.

## Determinism and integrity

Parent and child IDs are stable hashes of source identity and structural
coordinates. Validation checks duplicate IDs, orphan children, parent child
lists, source/SHA lineage, bounded context size, external artifact hashes,
rights status, and review-only guardrails. A second build compares all public
and external artifact hashes.

## Evaluation

The generated baseline comparison covers local requirements, scope plus
requirement, requirement plus exception, definition plus application,
cross-page requirements, table plus prose, long-document section selection,
wrong-section negatives, wrong-source negatives, and authority/support
confusion. It compares the existing page-window baseline with child retrieval
and bounded context expansion using top-1, top-3, MRR where available,
parent/context correctness, wrong-source rate, authority/support correctness,
citation correctness, context size, and unrelated-context rate.

This is a focused review-only architecture evaluation, not production RAG
readiness. The current detector is intentionally conservative, some source
text remains available only externally, and a future mature implementation
still needs stronger semantic hierarchy and source-family-specific structural
adapters before canonical promotion or production retrieval use.
