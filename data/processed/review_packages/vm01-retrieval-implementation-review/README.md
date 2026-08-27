# VM-01 retrieval implementation review snapshot

This directory contains byte-exact snapshots of the current production and regression code needed for the final narrow independent review.

- Manifest: `data/processed/review_packages/vm01-retrieval-implementation-review/manifest.json`
- `data/processed/review_packages/vm01-retrieval-implementation-review/evaluate-source-index-retrieval.mjs` — production_retrieval_ranking_and_top_k_metrics; SHA-256 `9080419e9e8b43970c9ec6497adf623f7ffcaacaff298d08c55531ae5e3454b3`
- `data/processed/review_packages/vm01-retrieval-implementation-review/evidence-sufficiency.mjs` — production_evidence_sufficiency_gate; SHA-256 `71d279cdfd826fae9c64f8d4ae74b095c9f1a61ccc950747879cfcf71c06a1f1`
- `data/processed/review_packages/vm01-retrieval-implementation-review/test-vm20-support-gate.mjs` — generic_support_window_regression_test; SHA-256 `9b168b6f524f97bf88953654ec8018bab8093e0483c744333e9603c2560cd9b5`
- `data/processed/review_packages/vm01-retrieval-implementation-review/validate-vm01-definitions.mjs` — vm01_case_and_aggregate_consistency_validator; SHA-256 `e6a02a21a32a5142429fe1399e44a44109c58ee5713b694f5df561bf178896a9`

Each snapshot hash must match both the corresponding live repository file and the manifest. These files are review evidence, not a second production implementation.
