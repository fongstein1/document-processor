# Hybrid / local vector retrieval experiment — 2026-09

## Status and boundary

This controlled review-only experiment starts from
`e1727d05ed5f4d5c41fadd833f45079280c7ef35` on
`processing/semantic-evidence-unit-correction-2026-09`. It compares five
retrieval systems against the same corrected semantic evidence units and
frozen Gold V2. It does not acquire sources, alter source bytes or canonical
corpora, change authority classifications, revise Gold V2, generate answers,
promote content, or enable production RAG.

All passages, queries, query embeddings, document embeddings, detailed
rankings, gold rationale, and substantive derivatives are private under:

`C:\Dev\Document Processor Sources\_processed-private\hybrid-vector-retrieval-experiment-2026-09`

The Git projection contains only allowlisted identifiers, coordinates,
metrics, provenance, hashes, byte counts, and governance evidence. It remains
`reviewOnly=true`, `promotionStatus=not_promoted`, and
`ragReadyAllowed=false`.

## Frozen protocol

The protocol was committed before holdout scoring. It uses:

- the 14,103 corrected V2 evidence children and unchanged 6-development / 11-holdout Gold V2 split;
- `intfloat/e5-base-v2` at revision
  `f52bf8ec8c7124536f0efb74aca902b2995e5bcd`, MIT license;
- local CPU inference with deterministic dynamic INT8 linear layers,
  attention-mask mean pooling, L2 normalization, E5 `query:` / `passage:`
  prefixes, maximum sequence length 512, and float32 little-endian storage;
- exact brute-force cosine ranking over all 768-dimensional vectors;
- unchanged fielded BM25 (`k1=1.2`, `b=0.75`);
- primary reciprocal-rank fusion with `k=60`, BM25 weight 1.0, vector weight
  1.0, all candidates, and child-ID tie breaking;
- parent-aware reranking as a transparent additional
  `0.5 / (60 + parent_rank)` contribution;
- the existing bounded role-aware context expansion, adding at most three
  evidence records.

Ranking is computed from document fields, embeddings, and query text before
Gold target IDs or rationale are loaded into metric calculation. The 22
excluded Gold V2 cases are not scored as relevance cases; their score and
margin distributions are diagnostics only.

## Development results (6 cases)

| System | Source @1 | @3 | @5 | Target @1 | @3 | @5 | @10 | MRR |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BM25 | 16.7% | 33.3% | 33.3% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0042 |
| Vector | 33.3% | 33.3% | 33.3% | 0.0% | 16.7% | 16.7% | 33.3% | 0.1088 |
| Hybrid RRF | 50.0% | 50.0% | 66.7% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0313 |
| Hybrid + parent | 50.0% | 66.7% | 66.7% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0218 |
| Hybrid + parent + context | 50.0% | 66.7% | 66.7% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0218 |

| System | Exact parent | Wrong source | Wrong section | Authority / support | Coordinate valid | Target citation | Role recall | Evidence recall | Context precision | Complete context |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BM25 | 0.0% | 83.3% | 16.7% | 16.7% | 100.0% | 0.0% | 50.0% | 0.0% | 33.3% | 0.0% |
| Vector | 0.0% | 66.7% | 33.3% | 33.3% | 100.0% | 0.0% | 33.3% | 0.0% | 16.7% | 0.0% |
| Hybrid RRF | 0.0% | 50.0% | 50.0% | 50.0% | 100.0% | 0.0% | 16.7% | 0.0% | 0.0% | 0.0% |
| Hybrid + parent | 0.0% | 50.0% | 50.0% | 66.7% | 100.0% | 0.0% | 16.7% | 0.0% | 0.0% | 0.0% |
| Hybrid + parent + context | 0.0% | 50.0% | 50.0% | 66.7% | 100.0% | 0.0% | 16.7% | 0.0% | 0.0% | 0.0% |

## Holdout results (11 cases)

| System | Source @1 | @3 | @5 | Target @1 | @3 | @5 | @10 | MRR |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BM25 | 45.5% | 54.5% | 63.6% | 18.2% | 27.3% | 27.3% | 36.4% | 0.2487 |
| Vector | 45.5% | 54.5% | 63.6% | 27.3% | 27.3% | 36.4% | 45.5% | 0.3175 |
| Hybrid RRF | 63.6% | 72.7% | 72.7% | 18.2% | 27.3% | 36.4% | 45.5% | 0.2743 |
| Hybrid + parent | 72.7% | 72.7% | 72.7% | 18.2% | 27.3% | 36.4% | 54.5% | 0.2799 |
| Hybrid + parent + context | 72.7% | 72.7% | 72.7% | 18.2% | 27.3% | 36.4% | 54.5% | 0.2799 |

| System | Exact parent | Wrong source | Wrong section | Authority / support | Coordinate valid | Target citation | Role recall | Evidence recall | Context precision | Complete context |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BM25 | 18.2% | 54.5% | 27.3% | 45.5% | 100.0% | 18.2% | 45.5% | 9.1% | 18.2% | 0.0% |
| Vector | 27.3% | 54.5% | 18.2% | 45.5% | 100.0% | 27.3% | 63.6% | 18.2% | 45.5% | 9.1% |
| Hybrid RRF | 18.2% | 36.4% | 45.5% | 63.6% | 100.0% | 18.2% | 54.5% | 9.1% | 27.3% | 0.0% |
| Hybrid + parent | 18.2% | 27.3% | 54.5% | 72.7% | 100.0% | 18.2% | 54.5% | 9.1% | 27.3% | 0.0% |
| Hybrid + parent + context | 18.2% | 27.3% | 54.5% | 72.7% | 100.0% | 18.2% | 54.5% | 9.1% | 22.7% | 0.0% |

Vector retrieval has the strongest holdout accepted-target Top-1 and MRR.
Hybrid RRF materially improves source selection but not accepted-target Top-1.
The parent contribution further improves source Top-1 and Top-10 target recall,
while also increasing same-source wrong-section selection. Context expansion
does not improve role recall or complete-context capture and lowers holdout
context precision from 27.3% to 22.7% relative to the selected-child-only
parent-aware result.

## A3 and XLSX observations

A3 has no included development cases and only one included holdout case. BM25,
hybrid, and both parent-aware variants retrieve the accepted target at rank 1;
vector retrieves the correct source but the accepted target at rank 7. This
single case is not enough to generalize about long-manual performance.

Across 11 included XLSX cases (4 development / 7 holdout), vector has the best
combined accepted-target Top-1 (18.2%) and MRR (0.2046). Parent-aware hybrid
has the best combined source Top-1 (54.5%) but only 9.1% accepted-target Top-1
and 0.1610 MRR. XLSX complete-context capture is 0% for the parent/context
system. Detailed per-workbook and split metrics are in
`source-slice-results.json`.

## Unsupported and excluded-query diagnostics

Gold V2 contains nine `INVALID_TARGET_EXCLUDED` and thirteen
`AMBIGUOUS_EXCLUDED` queries. They are not valid unsupported-retrieval gold and
therefore are not assigned correctness metrics. Their top-score distributions
remain high and their top-1/top-2 margins can be very small (hybrid minimum
margin `0.0000047`). No abstention threshold is established. A future
unsupported-query evaluation needs independent labels frozen before any
threshold selection.

## Provenance, hashes, and storage

- Model snapshot: 439,911,685 bytes;
  SHA-256 `e6fdce81a04d484c3ce5d667c6c70bf3b791e3e5bd1f7086397edbe88b5b4d2b`.
- Runtime: Python 3.11.9, PyTorch 2.14.0+cpu, Transformers 5.16.1,
  NumPy 2.4.6, Windows CPU.
- Document vectors: 43,324,416 bytes;
  SHA-256 `a64d5193a3dba7b36fa2247524aec6754b428cb3b6608752716e8591bbd3c481`.
- Query vectors: 119,808 bytes;
  SHA-256 `a597d2ec5e239994af3cbd735ddd1d7699567af77882af1cdaccd6a33545f56c`.
- Exact index: SHA-256
  `5b5295a6b918afd5273762e0cd16326e34d6a895a9704a9b69987940710015dc`.
- Private experiment artifacts: 13 files, 109,394,257 bytes, aggregate
  manifest SHA-256
  `0ceb876b921b3bb261d576e9b3629f240f420363359a5585b6c5f17f41fc8d38`.
- Full independent document/query embedding rerun: byte-for-byte PASS; maximum
  L2 norm deviation `1.7881393432617188e-7`.

The PyTorch dynamic quantization API used by this pinned runtime emits a
deprecation warning. That does not invalidate these frozen hashes, but future
reuse should migrate the local runtime and be treated as a new, separately
frozen experiment.

## Validation and regressions

The experiment validator and synthetic vector, RRF, parent-rerank,
rights-boundary, Gold-leakage, and determinism tests pass. The complete
repository check passes, as do parent-child architecture validation and
determinism, retrieval-hardening validation/tests/rights negatives, Gold V2
validation, and semantic-evidence validation/tests/full determinism. Protected
processed artifacts outside this experiment are unchanged from the starting
SHA.

## Maturity and next step

`LEVEL_1` means the local experiment is auditable, rights-safe, deterministic,
and useful for controlled comparison, but not retrieval- or context-mature.
`LEVEL_2` would require stronger independently frozen evaluation coverage and
materially better target/context results. `LEVEL_3` would require separate
authorization and evidence for production governance; it is not in scope.

Recommended `NEXT_STEP: A`: independently adjudicate and freeze a larger,
balanced Gold V3 and a true unsupported-query set, especially for A3,
wrong-section pressure, and XLSX header/row evidence. Other choices are B:
run a newly frozen local-model/runtime comparison; C: review only the current
error packets without changing gold; D: pursue production/learner-facing RAG,
which remains blocked.

HYBRID_RETRIEVAL_MATURITY: LEVEL_1

NEXT_STEP: A

HYBRID_VECTOR_RETRIEVAL_EXPERIMENT: PASS_WITH_LIMITATIONS
