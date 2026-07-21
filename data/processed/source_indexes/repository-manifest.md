# Document Processor canonical source-index POC

- Repository purpose: Canonical source-index proof of concept for backend-neutral retrieval
- Manifest ID: `source-index-poc-2026-07-21`
- Canonical layer: source-index
- Model version: 1.0
- Generated at: 2026-07-21T04:05:02.094Z
- Source package count: 4
- Chunk count: 4

## Export files

- JSONL: `data/processed/source_indexes/exports/source-indexes.jsonl`
- CSV: `data/processed/source_indexes/exports/source-indexes.csv`
- Repository manifest: `data/processed/source_indexes/repository-manifest.json`
- Retrieval evaluation: `data/processed/source_indexes/retrieval/retrieval-evaluation.json`

## Source packages

| Source | Pages | Source index | Review posture |
| --- | --- | --- | --- |
| Valuation of Policies in Which the Net Premium Exceeds the Gross Premium | pp. 1-1 | `data/processed/source_indexes/sources/ag01-net-premium-interpretation.json` | review-only |
| Definition of the Term Maturity Value in the Standard Nonforfeiture Law of Individual Deferred Annuities | pp. 1-1 | `data/processed/source_indexes/sources/ag03-maturity-value-interpretation.json` | review-only |
| Valuation Manual | pp. 45-46 | `data/processed/source_indexes/sources/vm20-framework-overview.json` | review-only |
| Valuation Manual | pp. 47-47 | `data/processed/source_indexes/sources/vm20-framework-boundary.json` | review-only |

## Retrieval summary

- Queries evaluated: 3
- Top-1 hits: 3
- Top-3 coverage: 100%
- Method: keyword_overlap_baseline
