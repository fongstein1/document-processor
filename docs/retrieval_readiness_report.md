# Retrieval readiness report

## Corpus summary

- Source packages: 17
- Canonical chunks: 41
- Retrieval questions: 21
- Supported questions: 19
- Unsupported questions: 2

## Metrics

- Top-1 accuracy: 74%
- Top-3 accuracy: 100%
- Top-5 accuracy: 100%
- Mean reciprocal rank: 0.821
- Source-family accuracy: 100%
- Authority-level accuracy: 95%
- Citation availability: 0%
- Multi-chunk evidence recall: 100%
- Unsupported-query precision: 50%

## Category breakdown

| Category | Count | Top-1 | Top-3 | Top-5 | MRR | Unsupported precision |
| --- | --- | --- | --- | --- | --- | --- |
| exact_title | 5 | 100% | 100% | 100% | 1.000 | 0% |
| framework_overview | 1 | 0% | 100% | 100% | 0.500 | 0% |
| mechanics_boundary | 1 | 100% | 100% | 100% | 1.000 | 0% |
| multi_chunk | 6 | 83% | 100% | 100% | 0.917 | 0% |
| relationship | 1 | 100% | 100% | 100% | 1.000 | 0% |
| pricing_domain | 5 | 40% | 100% | 100% | 0.520 | 0% |
| unsupported | 2 | 0% | 0% | 0% | 0.000 | 50% |

## Strong signals

- Exact-title questions for AG 01, AG 03, VM-20, and the companion/regulation sources are expected to rank cleanly.
- Relationship-aware questions should distinguish the AG 36 active source from the 2021 Law Manual reprint.
- Companion guidance and non-binding educational material should remain visible as lower-authority evidence.

## Weak spots and failure analysis

- unsupported: What does this corpus say about pricing support? -> false_positive; top result chunk-synthetic-pricing-assumption-memo-002 (3)

## Next improvement opportunities

- Add more ambiguous cross-source queries if the current corpus becomes too easy.
- Increase the share of relationship-heavy questions if reprint and companion-source handling needs more pressure.
- Add a small synthetic pricing or liability-modeling sample later only if the generic profiles need an empirical corpus test.
