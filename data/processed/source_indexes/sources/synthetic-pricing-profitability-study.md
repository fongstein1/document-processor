# Orion Term Accumulator Profitability Study

- Source ID: `synthetic-pricing-profitability-study`
- Source version ID: `source-index-synthetic-pricing-profitability-study`
- Source reference: Synthetic Pricing Corpus
- Source family: synthetic_pricing_documents
- Domain: pricing_documents
- Status: active
- Authority: internal
- Jurisdiction: n/a
- Review batches: batch-synthetic-pricing
- Page range: pp. 1-2
- Text layer quality: clean
- Page-image backstop: No
- Line references available: No

## Classification

- Domain: pricing_documents
- Document type: profitability_study
- Purpose: Synthetic profitability evidence for portability testing
- Intended audience: Pricing reviewers and governance reviewers
- Authority/source type: synthetic
- Recommended profile: pricing
- Recommended chunking strategy: structure_first
- Confidence: high

## Profile Data

- productFamily: individual deferred annuity
- pricingStage: profitability analysis
- profitabilityMetric: target margin
- targetMetric: base case margin
- sensitivityDriver: lapse

## Processing

- Processing mode: canonical_index_poc
- Canonicality: poc
- Review only: Yes
- Learner facing allowed: No
- App ready allowed: No
- RAG ready allowed: No
- Promotion status: not_promoted

## Chunks

| Chunk | Pages | Topic | Kind | Fidelity | Summary |
| --- | --- | --- | --- | --- | --- |
| `chunk-synthetic-pricing-profitability-study-001` | pp. 1-1 | The study reports that the base scenario meets target margin and lapse is the most material sensitivity. | profitability_study | curated | The study reports that the base scenario meets target margin and lapse is the most material sensitivity. |
| `chunk-synthetic-pricing-profitability-study-002` | pp. 2-2 | The study shows that yield downside remains tolerable even though it reduces profitability. | profitability_study | curated | The study shows that yield downside remains tolerable even though it reduces profitability. |

## Quality Notes

- Citation completeness: partial
- Page-image backstop: No
- Line references available: No
- Notes: Synthetic non-sensitive profitability study used to exercise the generic pricing profile.
