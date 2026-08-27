# Independent review prompt: VM-01 implementation evidence handoff

Please perform only the remaining narrow code-level review for VM-01 in the Document Processor repository. Do not modify or promote the corpus.

The preceding review passed all case-level retrieval metrics, the corrected CTE top-three result, unsupported and ambiguity behavior, authoritative source evidence, source-explicit terms, relationships, and governance. Do not repeat those accepted checks unless the supplied code contradicts them.

## Files

- Implementation manifest: `data/processed/review_packages/vm01-retrieval-implementation-review/manifest.json`
- production_retrieval_ranking_and_top_k_metrics: `data/processed/review_packages/vm01-retrieval-implementation-review/evaluate-source-index-retrieval.mjs`
- production_evidence_sufficiency_gate: `data/processed/review_packages/vm01-retrieval-implementation-review/evidence-sufficiency.mjs`
- generic_support_window_regression_test: `data/processed/review_packages/vm01-retrieval-implementation-review/test-vm20-support-gate.mjs`
- vm01_case_and_aggregate_consistency_validator: `data/processed/review_packages/vm01-retrieval-implementation-review/validate-vm01-definitions.mjs`
- Focused retrieval evaluation: `data/processed/review_packages/vm01-definition-retrieval-evaluation.json`
- Validation report: `data/processed/review_packages/vm01-definitions-validation-report.json`

## Verification scope

1. Recompute every supplied snapshot SHA-256 and verify it matches both the source and snapshot hashes recorded in the manifest; confirm the validator performs the live-source byte comparison.
2. Verify production evidence sufficiency evaluates only the first three ranked matches, so exact formal-definition evidence first appearing at rank 4 cannot make the request support-sufficient.
3. Verify `top3Hit` is calculated strictly from the first three deduplicated ranked matches and aggregate metrics derive from those case-level booleans.
4. Verify definition-intent ranking is generic and source-evidence-aware, with no query-ID, expected-chunk-ID, or term-specific special case.
5. Verify the rank-4 regression test and VM-01 case/aggregate consistency assertions exercise those production boundaries.
6. Confirm VM-01 remains review-only and not promoted pending this decision.

Report only code-level findings in this scope, with severity and exact snapshot/source line references. End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE
