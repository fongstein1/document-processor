# Retrieval readiness report

## Corpus summary

- Source packages: 21
- Canonical chunks: 359
- Retrieval questions: 44
- Supported questions: 41
- Unsupported questions: 3

## Metrics

- Top-1 accuracy: 85%
- Top-3 accuracy: 100%
- Top-5 accuracy: 100%
- Mean reciprocal rank: 0.908
- Source-family accuracy: 93%
- Authority-level accuracy: 90%
- Citation availability: 0%
- Multi-chunk evidence recall: 36%
- Unsupported-query precision: 0%

## Category breakdown

| Category | Count | Top-1 | Top-3 | Top-5 | MRR | Unsupported precision |
| --- | --- | --- | --- | --- | --- | --- |
| exact_title | 5 | 100% | 100% | 100% | 1.000 | 0% |
| framework_overview | 1 | 100% | 100% | 100% | 1.000 | 0% |
| mechanics_boundary | 1 | 100% | 100% | 100% | 1.000 | 0% |
| multi_chunk | 6 | 83% | 100% | 100% | 0.917 | 0% |
| hierarchical_parent_child | 1 | 0% | 100% | 100% | 0.200 | 0% |
| vm20_npr | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_dr | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_sr | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_exclusions | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_cash_flow_models | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_assets | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_reinsurance | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_assumptions_comparison | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_companion_expense | 1 | 0% | 100% | 100% | 0.500 | 0% |
| vm20_companion_assumptions | 1 | 0% | 100% | 100% | 0.500 | 0% |
| vm20_companion_margins | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_section4_direct | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_section5_methodology | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_cross_section_comparison | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_section9_applicability | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_parent_context | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_section9_exceptions | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_cross_section | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_appendix1_direct | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_appendix2_methodology | 1 | 0% | 100% | 100% | 0.200 | 0% |
| unsupported | 3 | 0% | 0% | 0% | 0.000 | 0% |
| vm20_cross_document | 1 | 100% | 100% | 100% | 1.000 | 0% |
| relationship | 1 | 100% | 100% | 100% | 1.000 | 0% |
| pricing_domain | 5 | 80% | 100% | 100% | 0.867 | 0% |

## Strong signals

- Exact-title questions for AG 01, AG 03, VM-20, and the companion/regulation sources are expected to rank cleanly.
- Relationship-aware questions should distinguish the AG 36 active source from the 2021 Law Manual reprint.
- Companion guidance and non-binding educational material should remain visible as lower-authority evidence.

## Weak spots and failure analysis

- unsupported: What are the exact current 2026 VM-20 Appendix 2 prescribed asset-default table rows and version metadata? -> false_positive; top result vm20-remaining-prose-appendix-coverage-vm20-appendix2-c-recovery-rate-used-in-baseline-annual-default-cost-factors (43.04999999999999)
- unsupported: What does this corpus say about pricing support? -> false_positive; top result chunk-synthetic-pricing-product-specification-001 (9.6)
- unsupported: What does this corpus say about liability modeling support? -> false_positive; top result vm20-practice-note-companion-vm20-pn-starting-assets (10.4)

## Next improvement opportunities

- Add more ambiguous cross-source queries if the current corpus becomes too easy.
- Increase the share of relationship-heavy questions if reprint and companion-source handling needs more pressure.
- Add a small synthetic pricing or liability-modeling sample later only if the generic profiles need an empirical corpus test.
