# Multi-Unit Sidecar Architecture Hardening (2026-09)

## Decision

The hardened sidecar is a review-only experiment and is not suitable for promotion. It improved the 21-case development split materially, but the improvement did not generalize to the untouched 14-case holdout. The unchanged flat hybrid RRF remains the primary retriever. The sidecar remains conditional, review-only, `not_promoted`, and `ragReadyAllowed=false`.

The architecture was frozen in commit `4af7b05` before holdout access. No architecture, threshold, query plan, ranking parameter, embedding, or Gold record was changed after that freeze.

## Frozen architecture

The deterministic pipeline is:

`query -> query-derived evidence plan -> independent BM25/E5/RRF retrieval per slot -> soft source and parent-coherence assembly -> bounded evidence package -> status`

It supports `REQUIREMENT_PLUS_SCOPE`, `REQUIREMENT_PLUS_EXCEPTION`, `TABLE_HEADER_PLUS_DATA`, `DEFINITION_PLUS_REQUIREMENT`, `MULTIPLE_REQUIREMENTS`, `COMPARISON`, and `OTHER_MULTI_UNIT`. It uses no Gold input, expected source, expected parent, expected child, required Gold role, split label, LLM planner, hosted API, new model, or strict parent gate during ranking. Packages prefer 2-4 evidence units and are hard-capped at 6 units and 16,000 characters.

Statuses are `COMPLETE_CANDIDATE`, `PARTIAL_CANDIDATE`, `INSUFFICIENT_EVIDENCE`, and `CONFLICTING_OR_AMBIGUOUS`. A complete candidate requires every query-derived slot to be filled and the selected evidence to form a single-parent package; this is a candidate status, not a correctness claim.

## Aggregate results

System A is unchanged flat hybrid. System B is the unchanged historical conditional sidecar. System C is the frozen hardened sidecar. Flat Target Top-k/MRR and primary source/parent/section metrics are identical for A, B, and C because neither sidecar changes the primary ranking.

| Split | System | Complete | Evidence recall | Role recall | Precision | Partial | Irrelevant | Avg/max size |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Development (21) | A | 0/21 (0.0%) | 6.3% | 9.5% | 14.3% | 14.3% | 18 | 1.00 / 1 |
| Development (21) | B | 0/21 (0.0%) | 12.7% | 16.7% | 15.9% | 23.8% | 33 | 1.86 / 3 |
| Development (21) | C | 5/21 (23.8%) | 33.3% | 35.7% | 33.3% | 19.0% | 27 | 2.00 / 3 |
| Holdout (14) | A | 0/14 (0.0%) | 10.7% | 14.3% | 21.4% | 21.4% | 11 | 1.00 / 1 |
| Holdout (14) | B | 0/14 (0.0%) | 20.2% | 28.6% | 33.3% | 42.9% | 13 | 1.36 / 3 |
| Holdout (14) | C | 1/14 (7.1%) | 17.9% | 21.4% | 21.4% | 21.4% | 20 | 1.79 / 2 |

No system emitted duplicate evidence IDs. The hardened package routing was correct-source in 85.7% development and 78.6% holdout cases, exact-parent in 47.6% development and 28.6% holdout cases, and wrong-section in 38.1% development and 50.0% holdout cases. The flat holdout remained correct-source 85.7%, exact-parent 35.7%, wrong-source 14.3%, wrong-section 50.0%, Target Top-1/3/5 21.4%/35.7%/42.9%, and MRR 0.321.

## Category results for the hardened sidecar

All slices are descriptive because each contains fewer than five cases.

| Category | Dev n | Dev complete / recall / precision | Holdout n | Holdout complete / recall / precision |
|---|---:|---:|---:|---:|
| REQUIREMENT_PLUS_SCOPE | 4 | 2 / 50.0% / 50.0% | 1 | 1 / 100.0% / 100.0% |
| REQUIREMENT_PLUS_EXCEPTION | 4 | 1 / 50.0% / 50.0% | 1 | 0 / 0.0% / 0.0% |
| TABLE_HEADER_PLUS_DATA | 3 | 1 / 50.0% / 50.0% | 2 | 0 / 25.0% / 50.0% |
| DEFINITION_PLUS_REQUIREMENT | 3 | 0 / 0.0% / 0.0% | 2 | 0 / 25.0% / 25.0% |
| MULTIPLE_REQUIREMENTS | 3 | 0 / 16.7% / 16.7% | 2 | 0 / 25.0% / 25.0% |
| COMPARISON | 2 | 0 / 0.0% / 0.0% | 3 | 0 / 0.0% / 0.0% |
| OTHER_MULTI_UNIT | 2 | 1 / 50.0% / 50.0% | 3 | 0 / 0.0% / 0.0% |

Comparison failed completely in both splits. The only holdout complete package was the single requirement-plus-scope case. The result does not establish broad category generalization.

## Modality and A3

For PDF cases, C achieved 3/18 complete with 25.0% recall and precision in development, and 1/10 complete with 20.0% recall and precision in holdout. For XLSX, it achieved 2/3 complete with 83.3% recall and precision in development, but 0/4 complete with 12.5% recall and 25.0% precision in holdout. The development XLSX gain did not generalize.

For A3, C achieved 3/14 complete, 32.1% recall, 35.7% role recall, and 32.1% precision in development. Holdout was 1/8 complete, 25.0% recall, 31.3% role recall, and 25.0% precision. A3 package source was correct for all eight holdout cases, but package wrong-section was 62.5%; correct source still did not imply correct SSAP/section.

Other source slices contain only one to three cases and are descriptive. The complete public source and modality slices are in `development-results.json` and `holdout-results.json`.

## Single-unit controls

Across all ten controls, the flat ranking is byte-identical to the frozen baseline. Its Target Top-1/3/5 was 0.0%/20.0%/20.0%, MRR 0.108, exact parent 10.0%, wrong source 60.0%, and wrong section 30.0%. Seven controls were classified by the query-only planner as single-evidence and therefore bypassed assembly. Three activated a multi-slot plan; C emitted one two-unit complete candidate, one conflicting candidate, and one insufficient result. This does not alter the primary ranking, but it demonstrates imperfect activation specificity.

## Unsupported and partially unsupported diagnostics

The diagnostic set contains five unsupported and five partially unsupported cases. System B emitted 3/10 apparently complete packages, returned 15 unrelated units, and preserved uncertainty in 0/10. System C emitted 1/10 false-complete package, returned 10 unrelated units, and preserved uncertainty in 9/10. Neither B nor C retrieved a known supported subset in any partially unsupported case. C is safer about package status, but incomplete-support handling remains inadequate.

## Integrity, rights, and determinism

The committed architecture freeze binds the configuration, planner/assembler, evaluation runner, embedding runner, synthetic/leakage tests, development results, development private artifacts, Multi-Unit Gold V1 freeze SHA, and unchanged historical ranking SHA. The Gold is scoring-only. The ranking path is tested to exclude accepted evidence IDs, expected source/parent, Gold roles, classifications, split labels, and accepted evidence sets.

All query text, plans containing query derivatives, query vectors, candidate audits, rankings, and scored case detail remain under `C:\Dev\Document Processor Sources\_processed-private\multi-unit-sidecar-hardening-2026-09`. The private run contains 24 files, 112,563,543 bytes, with aggregate manifest SHA-256 `75fd3dbc7ebd25ce85c8f9ab2ad38f3bc2cbace365c41b01ddf1c2affdc3c0c5`. Git-safe artifacts contain IDs, hashes, counts, metrics, classifications, and governance metadata only.

Development query-set, plan, query-vector, ranking, package, and scoring reruns were byte-identical. Holdout, control, and diagnostic query-vector, ranking/package, and scoring reruns were also byte-identical. The frozen E5 provenance remains `intfloat/e5-base-v2`, revision `f52bf8ec8c7124536f0efb74aca902b2995e5bcd`, MIT license, CPU dynamic-int8 linear inference, normalized 768-dimensional float32 vectors, local-only with no hosted API.

The repository-wide check and the processor, acquisition, scaled-wave, rights, parent-child, retrieval-hardening, semantic-evidence, Gold V2, hybrid-vector, Gold V3, hierarchy, Multi-Unit Gold V1, and new sidecar validation suites all passed. `git diff --check` passed. Final Git integrity and remote-alignment checks are recorded at handoff.

Gold V1/V2/V3 and Multi-Unit Gold V1 are unchanged. There was no retrieval tuning after freeze, embedding/model change, source acquisition, raw-byte modification, canonical promotion, learner-facing output, answer generation, production RAG, hosted model/API, authority broadening, history rewrite, visibility change, or OneDrive use.

## Conclusion

Independent per-slot retrieval plus soft relational assembly is directionally credible on development and produced one genuine holdout complete package, but the aggregate holdout regression and category failures mean the architecture is not hardened enough for promotion. Same-source wrong-section retrieval remains the central failure. The defensible next step is independent review of this frozen negative/mixed result, followed—if approved—by another narrow development-only architecture investigation using a fresh evaluation boundary rather than further reuse of this holdout.
