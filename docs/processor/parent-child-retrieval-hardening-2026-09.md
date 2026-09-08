# Parent-child retrieval hardening (review-only)

This branch adds a deterministic retrieval evaluation layer on top of the
verified parent-child architecture. It does not acquire, promote, index, or
publish regulatory content. The prior architecture checkpoint remains under
`parent-child-context-architecture-2026-09`; this run is a separate evidence
set.

## Frozen evaluation

The development set contains 24 cases and the independently selected holdout
contains 15 cases across A3, W07, W08, VM-20 F/G, VM-31 templates, and SOA
VBT. Gold IDs and hashes are in `evaluation-freeze.json`; queries and
substantive gold evidence remain in the external/private run root. The freeze
commit is `19a4576` (`test: freeze parent-child retrieval evaluation`). No
gold target is used by ranking.

## Retrieval

The local scorer is BM25-style with `k1=1.2` and `b=0.75`. It uses corpus
document frequency, term frequency, document-length normalization, regulatory
token normalization (including VM-20, VM-31, SSAP identifiers, tables, and
schedules), and transparent fields: body, section, identifier, parent
heading, source title, and bounded workbook header identity. Parent retrieval
is separate from child retrieval. Candidate scores expose child BM25, parent
BM25, identifier, phrase, structural, title, coverage, length, and final
components. Test expectations are not retrieval inputs.

The ablation report compares page-window raw lexical, page-window BM25,
child BM25, parent-aware reranking, and context expansion. The corrected
page-window baseline uses the same normalized substantive retrieval text as
the child path; target MRR is computed from the expected target rank.

## Structure and context

PDF children are conservatively labeled either
`SEMANTIC_PARAGRAPH_GROUP_CHILD` or
`STRUCTURAL_PARENT_PAGE_WINDOW_CHILD`; no page window is called semantic when
no reliable paragraph grouping exists. Workbook blocks are subdivided into
header-aware row/range children only when large enough to warrant it; small
blocks remain one child. Siblings are ordered by source coordinates, not hash
IDs. Query-only context needs distinguish local, scope, definition,
exception, table-header, continuation, and section context. Parent context,
preceding child, and following child are recorded separately and bounded.

## Rights and reproducibility

Substantive parent, child, query, context, and evaluation text is written only
to `C:\Dev\Document Processor Sources\_processed-private\parent-child-retrieval-hardening-2026-09`.
The Git projection is allowlisted evidence with IDs, hashes, coordinates,
roles, counts, flags, metrics, and external artifact references. The existing
rights scanner remains defense in depth, including rejection of arbitrary
source-derived strings and content-bearing nested fields. External manifests
bind each private artifact to a SHA-256 and byte count.

This is an architecture/evaluation artifact only: `reviewOnly=true`,
`promotionStatus=not_promoted`, and `ragReadyAllowed=false`.

## Current limitations

The frozen evaluation shows a real BM25 baseline recovery and modest source
retrieval improvement, but target-child and parent precision remain low on
the long-document corpus. That is an honest limitation, not a reason to tune
against the gold set. The system is not production RAG-ready. Further source
scale and canonical promotion remain blocked pending independent review and
future improvements to semantic subdivision and retrieval quality.
