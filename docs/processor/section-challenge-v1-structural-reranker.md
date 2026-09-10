# Section Challenge V1 and soft structural reranking

## Status

This is a review-only retrieval experiment. It does not alter BM25, the local E5 model or vectors, reciprocal-rank fusion weights, semantic evidence units, source bytes, authority classifications, canonical content, or production posture.

The prospective `SECTION_CHALLENGE_V1` evaluation was frozen before the reranker existed. It contains 48 supported cases (28 development and 20 untouched holdout), arranged as 24 identifier-present/direct versus identifier-absent/paraphrased matched pairs, plus six unsupported diagnostics. Substantive queries, rationales, ranking traces, and protected vectors remain external/private.

## Candidate generation

For each query, the candidate pool is the deterministic union of unchanged BM25 Top-100, vector Top-100, and hybrid Top-100 rankings. Candidates are deduplicated by evidence ID while retaining every component rank and score. No candidate is removed because a structural inference conflicts or is uncertain.

## Soft structural score

The base signal is `0.15 * (1 / hybridRank) / sum(1 / hybridRank)` over the union. Bounded bonuses consider local and ancestor identifiers, concept and ordered-bigram coverage, local heading coverage, source-title coverage, role compatibility, table/form compatibility, and a narrowly defined strong-component rescue. Bounded penalties cover explicit local identifier conflict, incomplete multipart coverage, and modality conflict. High, medium, and low/unknown confidence scale the structural adjustment; uncertain inference preserves a flatter ordering.

Local structural identity is stronger than inherited ancestor identity. Ordinary reporting language is distinguished from an explicit table/form request. Component rescue is limited to candidates ranked at most third by BM25 or vector, absent from hybrid Top-10, and meeting minimum concept and clause coverage.

Runtime ranking receives only the query and corpus candidate evidence. Accepted targets, accepted parents, expected sources, Gold classifications, split labels, and evaluator oracle outputs are rejected by the leakage guard.

## Results and limitation

Development cleared all prefrozen success and damage controls. The sealed holdout improved identifier-absent target Top-1 by 0.10 and parent Top-1 by 0.15, with no previously correct Top-1 loss, no source-correct-to-wrong regression, and no parent-correct-to-wrong regression. It achieved one wrong-section rescue, below the prefrozen minimum of two. Holdout target Top-1 was 0.05, parent Top-1 was 0.30, eight cases remained child-ranking residuals, and four accepted targets remained outside the deep union.

Accordingly, the experiment demonstrates useful deterministic structural signal without establishing a mature structural router. The next recommended step is another independently reviewed section-reranker hardening milestone; this task does not begin it.

Exact rights-safe metrics and lineage are in `data/processed/review_packages/section-challenge-v1-structural-rerank-2026-09/`. Private artifacts remain under `C:\Dev\Document Processor Sources\_processed-private\section-challenge-v1-structural-rerank-2026-09`.
