# Document Processor canonical source-index POC

- Repository purpose: Canonical source-index proof of concept for backend-neutral retrieval
- Manifest ID: `source-index-poc-2026-07-21`
- Canonical layer: source-index
- Model version: 1.0
- Generated at: 2026-07-22T22:52:46.811Z
- Source package count: 17
- Chunk count: 41

## Export files

- Export manifest: `data/processed/source_indexes/exports/export_manifest.json`
- JSONL: `data/processed/source_indexes/exports/source_chunks.jsonl`
- CSV: `data/processed/source_indexes/exports/source_chunks.csv`
- Retrieval questions: `data/processed/source_indexes/evaluation/retrieval_questions.json`
- Retrieval results: `data/processed/source_indexes/evaluation/retrieval_results.json`
- Repository manifest: `data/processed/source_indexes/repository-manifest.json`

## Source packages

| Source | Pages | Source index | Review posture |
| --- | --- | --- | --- |
| Valuation of Policies in Which the Net Premium Exceeds the Gross Premium | pp. 1-1 | `data/processed/source_indexes/sources/ag01-net-premium-interpretation.json` | review-only |
| Definition of the Term Maturity Value in the Standard Nonforfeiture Law of Individual Deferred Annuities | pp. 1-1 | `data/processed/source_indexes/sources/ag03-maturity-value-interpretation.json` | review-only |
| Valuation Manual | pp. 45-46 | `data/processed/source_indexes/sources/vm20-framework-overview.json` | review-only |
| Valuation Manual | pp. 47-47 | `data/processed/source_indexes/sources/vm20-framework-boundary.json` | review-only |
| VM-20 Section 3.C Assumptions | pp. 58-65 | `data/processed/source_indexes/sources/vm20-assumptions-section-3c.json` | review-only |
| VM-21 Stochastic Reserve Projection Entry | pp. 153-159 | `data/processed/source_indexes/sources/vm21-sr-projection-entry.json` | review-only |
| The Application of the Commissioners Reserve Valuation Method to Equity Indexed Life Insurance Policies | pp. 1-11 | `data/processed/source_indexes/sources/ag36-eiul-crvm-guidance.json` | review-only |
| The Application of the Commissioners Reserve Valuation Method to Equity Indexed Life Insurance Policies | pp. 1-18 | `data/processed/source_indexes/sources/ag36-eiul-crvm-law-manual-reprint.json` | review-only |
| Model Governance: Some Considerations for Practicing Life Actuaries | pp. 1-18 | `data/processed/source_indexes/sources/model-governance-practice-note.json` | review-only |
| Actuarial Memorandum Practice Note | pp. 1-37 | `data/processed/source_indexes/sources/actuarial-memorandum-practice-note.json` | review-only |
| Life Insurance and Annuity Non-Guaranteed Elements | pp. 1-9 | `data/processed/source_indexes/sources/reg210-non-guaranteed-elements.json` | review-only |
| CIA 2022 Capital and FCT Educational Note | pp. 1-20 | `data/processed/source_indexes/sources/cia-2022-capital-fct-educational-note.json` | review-only |
| Orion Term Accumulator Product Specification | pp. 1-2 | `data/processed/source_indexes/sources/synthetic-pricing-product-specification.json` | review-only |
| Orion Term Accumulator Assumption Memo | pp. 1-2 | `data/processed/source_indexes/sources/synthetic-pricing-assumption-memo.json` | review-only |
| Orion Term Accumulator Pricing Methodology | pp. 1-2 | `data/processed/source_indexes/sources/synthetic-pricing-pricing-methodology.json` | review-only |
| Orion Term Accumulator Profitability Study | pp. 1-2 | `data/processed/source_indexes/sources/synthetic-pricing-profitability-study.json` | review-only |
| Orion Term Accumulator Approval Memo | pp. 1-2 | `data/processed/source_indexes/sources/synthetic-pricing-approval-memo.json` | review-only |

## Retrieval summary

- Queries evaluated: 21
- Supported queries: 19
- Unsupported queries: 2
- Top-1 accuracy: 74%
- Top-3 accuracy: 100%
- Top-5 accuracy: 100%
- Mean reciprocal rank: 0.821
- Method: keyword_overlap_baseline
