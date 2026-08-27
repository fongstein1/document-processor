# Independent review prompt: VM-01 strict top-three retrieval correction

Please perform a narrow final independent review of the last VM-01 promotion blocker correction in the Document Processor repository. Do not modify or promote the corpus.

The prior narrow review passed the source-explicit `definedTerms` boundary, retrieval-only normalization metadata, case-level evaluation handoff, undefined-term abstention, ambiguity handling, authority ranking, and unchanged authoritative source evidence. Do not repeat the full 98-definition source audit unless this correction changed authoritative source text.

## Files

- Focused retrieval evaluation: `data/processed/review_packages/vm01-definition-retrieval-evaluation.json`
- Review package: `data/processed/review_packages/vm01-canonical-definitions-review-package.json`
- Validation report: `data/processed/review_packages/vm01-definitions-validation-report.json`
- Canonical VM-01 package: `data/processed/source_indexes/sources/vm01-definitions.json`
- Definition lookup index: `data/processed/source_indexes/definitions/vm01-definition-index.json`
- Source QA: `data/processed/review_packages/vm01-definitions-source-qa.json`
- Relationship candidates: `data/processed/relationship_registries/vm01-definition-relationship-candidates.json`
- PDF hash confirmation: `data/processed/review_packages/vm01-source-pdf-hash-confirmation.json`

## Verification scope

1. Recompute each supported case's `top1Hit` from `actualTop1` and `top3Hit` strictly from the three entries in `actualTop3`; verify aggregate counts match the case-level values.
2. Inspect `vm01-plain-language-tail-measure` and verify `vm01-definition-016-conditional-tail-expectation` is inside `actualTop3`, the result label is consistent with its actual rank, and the support decision's `relatedEvidence` uses the same top-three window.
3. Confirm evidence below rank 3 cannot make a formal-definition query support-sufficient. Review the deterministic regression in `scripts/test-vm20-support-gate.mjs` and the consistency checks in `scripts/validate-vm01-definitions.mjs`.
4. Confirm the ranking change is generic and definition-evidence-aware, with no query-ID, expected-chunk, or term-specific production scoring rule.
5. Confirm all three unsupported cases still abstain, ambiguity and unavailable-version behavior remain safe, and current 2026 VM-01 remains the preferred authority.
6. Confirm 98 definitions, 125 source-explicit `definedTerms` entries (98 exact terms plus 27 source aliases), 29 conservative relationship candidates, source excerpts, formal definition text, pages, and hashes remain unchanged.
7. Confirm VM-01 remains review-only and not promoted pending this decision.

## Output

Report only findings within this narrow scope, with severity and exact file/query IDs. End with exactly one disposition:

- APPROVE FOR CANONICAL PROMOTION
- APPROVE WITH FIXES
- DO NOT PROMOTE
