# Multi-Unit Gold V1 freeze protocol

`MULTI_UNIT_GOLD_V1` is an independent, review-only evaluation layer bound to starting SHA `049af0f3587fede9a2ec7643a33d1b6862bef949`. Gold V1, V2, and V3 are historical and unchanged; the Gold V3 holdout is considered consumed for architecture development.

The evaluation contains 35 multi-unit supported cases, 10 single-unit controls, five unsupported diagnostics, and five partially unsupported diagnostics. The supported set was split before scoring into 27 development and 18 holdout cases. Each required multi-unit category has five cases. Multi-unit coverage is 27 PDF and eight XLSX cases; the full supported layer is 35 PDF and 10 XLSX cases.

Queries, rationales, detailed adjudication, and later vectors/rankings remain under the approved external private root. The public freeze contains only identifiers, hashes, coordinates, classifications, counts, and governance metadata.

The primary ranking is the unchanged flat BM25/E5 reciprocal-rank fusion implementation and frozen configuration. System B uses that identical ranking plus the already-existing `assembleEvidence` sidecar. Its fixed non-Gold parent scope is the first three distinct parents in flat-rank order; package caps remain six evidence records and 16,000 characters. Gold fields are scoring-only and never cross the ranking or assembly interface.

No retrieval scoring or query embedding is permitted until `gold-freeze.json`, its validators, and this protocol have been committed. After the freeze, neither queries, labels, accepted evidence sets, source bindings, roles, nor split assignments may change based on results.
