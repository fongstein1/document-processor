# Retrieval Gold V3 expansion and unchanged-system evaluation

## Decision

Gold V3 is a separate, independently adjudicated, SHA-bound review layer. It contains 60 supported cases and 15 genuinely unsupported queries. The supported split was frozen at 36 development and 24 holdout cases before retrieval scoring in commit `7fb65e83b25ca55db66aeb5d0d1217afdaacaaa8`.

The larger evaluation supports conclusion **B**: hybrid retrieval genuinely improves source routing, but same-source section precision remains an architecture problem. Unlike Gold V2, the Gold V3 holdout also shows a material hybrid accepted-target gain. Parent reranking adds source-routing value but no Top-1 target gain, and bounded context adds no complete-context gain.

`GOLD_V3_EVALUATION_MATURITY: LEVEL_2`

`NEXT_RETRIEVAL_ACTION: ARCHITECTURE_HARDENING`

`GOLD_V3_EXPANSION: PASS_WITH_LIMITATIONS`

## Frozen evaluation population

- Supported: 60; development: 36; holdout: 24; unsupported: 15.
- Source coverage: A3 20, W07 8, W08 8, VM-20 8, VM-31 8, SOA VBT 8.
- Modality: 36 PDF and 24 XLSX supported cases.
- Adjudication: 45 unique accepted target, 1 multiple accepted targets, and 14 multi-unit required.
- A3 covers multiple independent SSAPs/sections; source-only success does not count as accepted-target or exact-parent success.
- Gold V1 and Gold V2 remain unchanged. Gold V3 queries, rationales, and detailed evidence remain external; Git contains only the rights-safe frozen projection.

## Development results

Rates are shown as percentages. `MedR` is median accepted-target rank.

| System | Src@1 | Src@3 | Src@5 | Target@1 | Target@3 | Target@5 | Target@10 | MRR | MedR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| BM25 | 77.8 | 91.7 | 94.4 | 41.7 | 50.0 | 52.8 | 52.8 | 0.482 | 3 |
| Vector | 83.3 | 91.7 | 94.4 | 38.9 | 52.8 | 52.8 | 61.1 | 0.463 | 3 |
| Hybrid RRF | 86.1 | 94.4 | 97.2 | 38.9 | 52.8 | 58.3 | 63.9 | 0.492 | 2 |
| Hybrid + parent | 86.1 | 94.4 | 97.2 | 36.1 | 52.8 | 58.3 | 66.7 | 0.482 | 2 |
| Hybrid + parent + context | 86.1 | 94.4 | 97.2 | 36.1 | 52.8 | 58.3 | 66.7 | 0.482 | 2 |

| System | Exact parent | Wrong source | Wrong section | Authority/support | Target citation | Coordinate valid | Role recall | Evidence recall | Context precision | Complete context |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| BM25 | 58.3 | 22.2 | 19.4 | 86.1 | 41.7 | 100.0 | 91.7 | 50.0 | 58.3 | 41.7 |
| Vector | 52.8 | 16.7 | 30.6 | 88.9 | 38.9 | 100.0 | 91.7 | 41.7 | 47.2 | 36.1 |
| Hybrid RRF | 58.3 | 13.9 | 27.8 | 94.4 | 38.9 | 100.0 | 97.2 | 47.2 | 55.6 | 38.9 |
| Hybrid + parent | 61.1 | 13.9 | 25.0 | 94.4 | 36.1 | 100.0 | 97.2 | 47.2 | 58.3 | 36.1 |
| Hybrid + parent + context | 61.1 | 13.9 | 25.0 | 94.4 | 36.1 | 100.0 | 97.2 | 47.2 | 48.1 | 36.1 |

## Holdout results

| System | Src@1 | Src@3 | Src@5 | Target@1 | Target@3 | Target@5 | Target@10 | MRR | MedR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| BM25 | 83.3 | 100.0 | 100.0 | 41.7 | 70.8 | 70.8 | 75.0 | 0.559 | 2 |
| Vector | 79.2 | 95.8 | 95.8 | 41.7 | 62.5 | 62.5 | 75.0 | 0.536 | 2 |
| Hybrid RRF | 91.7 | 100.0 | 100.0 | 54.2 | 62.5 | 70.8 | 79.2 | 0.612 | 1 |
| Hybrid + parent | 95.8 | 100.0 | 100.0 | 54.2 | 58.3 | 70.8 | 83.3 | 0.602 | 1 |
| Hybrid + parent + context | 95.8 | 100.0 | 100.0 | 54.2 | 58.3 | 70.8 | 83.3 | 0.602 | 1 |

| System | Exact parent | Wrong source | Wrong section | Authority/support | Target citation | Coordinate valid | Role recall | Evidence recall | Context precision | Complete context |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| BM25 | 62.5 | 16.7 | 20.8 | 87.5 | 41.7 | 100.0 | 87.5 | 45.8 | 50.0 | 41.7 |
| Vector | 58.3 | 20.8 | 20.8 | 83.3 | 41.7 | 100.0 | 91.7 | 45.8 | 50.0 | 41.7 |
| Hybrid RRF | 70.8 | 8.3 | 20.8 | 95.8 | 54.2 | 100.0 | 95.8 | 60.4 | 66.7 | 54.2 |
| Hybrid + parent | 75.0 | 4.2 | 20.8 | 100.0 | 54.2 | 100.0 | 95.8 | 62.5 | 70.8 | 54.2 |
| Hybrid + parent + context | 75.0 | 4.2 | 20.8 | 100.0 | 54.2 | 100.0 | 95.8 | 62.5 | 61.8 | 54.2 |

## Stratified findings

The complete per-source, per-category, modality, A3, and adjudication-type tables are in `slice-results-v3.json`.

- A3 holdout (8 cases): BM25 accepted-target Top-1/MRR was 37.5%/0.582; vector, hybrid, and both parent variants were 62.5%/approximately 0.69. Every system had 25% wrong-section rate despite 100% source Top-1.
- XLSX holdout (9 cases): BM25, hybrid, and parent variants had 33.3% target Top-1; vector had 22.2%. Parent variants reached 100% source Top-1 but only 33.3% target Top-1.
- Multi-unit holdout (5 cases): every system had 0% target Top-1 and 0% complete context. Unique-target holdout Top-1 was 50.0% for BM25/vector and 66.7% for hybrid variants.
- The category and source slices are descriptive, not tuning inputs; several cells remain small despite the larger overall set.

## Unsupported-query diagnostics

The 15 unsupported queries were frozen before scoring. No abstention threshold was selected. BM25 top-score median was 31.083 with median margin 2.067; vector similarity median was 0.8037 with median margin 0.00570; hybrid score median was 0.02896 with median margin 0.000928. These values overlap supported behavior and do not establish a reliable separation boundary.

## Frozen retrieval and provenance

- Retrieval configuration SHA-256: `03fe8f7dd7c4b372e2c6219e9c67c89fa12c09fcad09b5bfaa8e8863fda88718`.
- Model: `intfloat/e5-base-v2`; revision `f52bf8ec8c7124536f0efb74aca902b2995e5bcd`; MIT license.
- Local CPU runtime: Python 3.11.9, PyTorch 2.14.0+cpu, Transformers 5.16.1, NumPy 2.4.6; dynamic INT8 linear inference; 768-dimensional L2-normalized mean-pooled embeddings; maximum sequence length 512.
- Model snapshot SHA-256: `e6fdce81a04d484c3ce5d667c6c70bf3b791e3e5bd1f7086397edbe88b5b4d2b` (439,911,685 bytes).
- Frozen document vectors SHA-256: `a64d5193a3dba7b36fa2247524aec6754b428cb3b6608752716e8591bbd3c481` (43,324,416 bytes).
- Gold V3 query vectors SHA-256: `8f1c8b538757cd1dc9c542ba58c92a6131be615ce0cb813c7a595424d3dcedef` (230,400 bytes).
- Exact index SHA-256: `5b5295a6b918afd5273762e0cd16326e34d6a895a9704a9b69987940710015dc` (508,062 bytes).
- Private Gold V3 SHA-256: `5e1a1f298eea6288ecad34c84f24761f6817a0540fa15cd898e0dd75ba2c311f` (98,758 bytes).
- Query-vector rerun was byte-identical. A full ranking rerun was also byte-identical (`bc9bd4af3bda2886f132e558ab2404b3937add2780defb84b879d11fccfff752`).
- The external manifest reports 70,529,109 bytes across 10 evaluation artifacts, including the unchanged shared passage/vector/index inputs.

The runtime still emits a PyTorch dynamic-quantization deprecation warning. This is a future runtime-hardening concern, not a reason to change the frozen model or inference configuration in this milestone.

## Governance and artifacts

All queries, rationales, source-derived passages, detailed evidence, and vectors remain under `C:\Dev\Document Processor Sources\_processed-private\hybrid-vector-retrieval-experiment-2026-09`. There was no source acquisition, corpus expansion, authority broadening, raw-byte change, canonical promotion, answer generation, learner-facing output, hosted embedding/reranking use, or production RAG work.

Public review artifacts:

- `evaluation-v3-freeze.json`: immutable rights-safe Gold V3 projection.
- `evaluation-v3-results.json`: full development/holdout case results and metrics.
- `slice-results-v3.json`: source, category, modality, A3, XLSX, and target-type slices.
- `unsupported-query-diagnostics-v3.json`: score/similarity/margin distributions with no selected threshold.
- `external-artifact-manifest-v3.json`: external paths, hashes, and byte counts.
- `validation-report-v3.json`: integrity and governance validation result.

## Limitations

Gold V3 is substantially larger and better stratified than V2, but it is still a six-source proving-ground evaluation with one independent adjudication pass. Multi-unit retrieval and complete-context capture remain unacceptable. Hybrid's holdout gain coexists with worse development wrong-section pressure than BM25. The appropriate next milestone is review-only architecture hardening; these results do not authorize retrieval tuning, production RAG, promotion, or learner-facing use.
