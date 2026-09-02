# Retrieval readiness report

## Corpus summary

- Source packages: 25
- Canonical chunks: 749
- Retrieval questions: 50
- Supported questions: 45
- Unsupported questions: 5

## Metrics

- Top-1 accuracy: 82%
- Top-3 accuracy: 100%
- Top-5 accuracy: 100%
- Mean reciprocal rank: 0.900
- Source-family accuracy: 96%
- Authority-level accuracy: 93%
- Citation availability: 0%
- Multi-chunk evidence recall: 14%
- Unsupported-query precision: 60%

## Category breakdown

| Category | Count | Top-1 | Top-3 | Top-5 | MRR | Unsupported precision |
| --- | --- | --- | --- | --- | --- | --- |
| exact_title | 5 | 100% | 100% | 100% | 1.000 | 0% |
| framework_overview | 1 | 100% | 100% | 100% | 1.000 | 0% |
| mechanics_boundary | 1 | 100% | 100% | 100% | 1.000 | 0% |
| multi_chunk | 6 | 83% | 100% | 100% | 0.917 | 0% |
| hierarchical_parent_child | 1 | 0% | 100% | 100% | 0.333 | 0% |
| vm20_npr | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_dr | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_sr | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_exclusions | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_cash_flow_models | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_assets | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_reinsurance | 1 | 0% | 100% | 100% | 0.500 | 0% |
| vm20_assumptions_comparison | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_companion_expense | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_companion_assumptions | 1 | 0% | 100% | 100% | 0.500 | 0% |
| vm20_companion_margins | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_section4_direct | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_section5_methodology | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_cross_section_comparison | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_section9_applicability | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_parent_context | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_section9_exceptions | 1 | 0% | 100% | 100% | 0.500 | 0% |
| vm20_cross_section | 1 | 0% | 100% | 100% | 0.500 | 0% |
| vm20_appendix1_direct | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm20_appendix2_methodology | 1 | 0% | 100% | 100% | 0.333 | 0% |
| unsupported | 3 | 0% | 0% | 0% | 0.000 | 33% |
| vm20_cross_document | 1 | 100% | 100% | 100% | 1.000 | 0% |
| relationship | 1 | 100% | 100% | 100% | 1.000 | 0% |
| pricing_domain | 5 | 80% | 100% | 100% | 0.867 | 0% |
| vm01_exact_definition | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm01_acronym_definition | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm01_similar_terms | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm01_cross_document_terminology | 1 | 100% | 100% | 100% | 1.000 | 0% |
| vm01_unsupported_definition | 1 | 0% | 0% | 0% | 0.000 | 100% |
| vm01_ambiguous_term | 1 | 0% | 0% | 0% | 0.000 | 100% |

## Strong signals

- Exact-title questions for AG 01, AG 03, VM-20, and the companion/regulation sources are expected to rank cleanly.
- Relationship-aware questions should distinguish the AG 36 active source from the 2021 Law Manual reprint.
- Companion guidance and non-binding educational material should remain visible as lower-authority evidence.

## Weak spots and failure analysis

- unsupported: What does this corpus say about pricing support? -> false_positive; top result chunk-synthetic-pricing-product-specification-001 (9.6)
- unsupported: What does this corpus say about liability modeling support? -> false_positive; top result vm20-practice-note-companion-vm20-pn-starting-assets-child-021 (10.4)

## Next improvement opportunities

- Add more ambiguous cross-source queries if the current corpus becomes too easy.
- Increase the share of relationship-heavy questions if reprint and companion-source handling needs more pressure.
- Add a small synthetic pricing or liability-modeling sample later only if the generic profiles need an empirical corpus test.
