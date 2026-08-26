# VM-01 definition retrieval evaluation

- Queries: 16 (13 supported, 3 unsupported)
- Supported top-1 / top-3: 12/13 / 13/13
- Unsupported correctly abstained: 3/3
- Current VM-01 authority ranked first: 13/13

| Query | Category | Result | Support | Top evidence |
| --- | --- | --- | --- | --- |
| vm01-exact-accumulated-deficiency | exact_defined_term | supported_top1 | supported | vm01-definition-002-accumulated-deficiency |
| vm01-acronym-cte | acronym_lookup | supported_top1 | supported | vm01-definition-016-conditional-tail-expectation |
| vm01-plain-language-tail-measure | plain_language_lookup | supported_top3 | supported | vm01-definition-061-pension-risk-transfer |
| vm01-similar-claim-reserve | similar_terms | supported_top1 | supported | vm01-definition-012-claim-reserve |
| vm01-similar-contract-reserve | similar_terms | supported_top1 | supported | vm01-definition-017-contract-reserve |
| vm01-condition-future-hedging | condition_or_exception | supported_top1 | supported | vm01-definition-029-future-hedging-strategy |
| vm01-incorporated-margin | incorporated_defined_term | supported_top1 | supported | vm01-definition-073-prudent-estimate-assumption |
| vm01-cross-reference-npr | manual_cross_reference | supported_top1 | supported | vm01-definition-056-net-premium-reserve |
| vm01-cross-document-prudent-estimate | cross_document_terminology | supported_top1 | supported | vm01-definition-073-prudent-estimate-assumption |
| vm01-acronym-iul | acronym_lookup | supported_top1 | supported | vm01-definition-042-indexed-universal-life-iul-insurance-policy |
| vm01-long-category | complex_definition | supported_top1 | supported | vm01-definition-098-vm-20-reserving-category |
| vm01-gi-exclusions | condition_or_exception | supported_top1 | supported | vm01-definition-031-guaranteed-issue-gi-life-insurance-policy |
| vm01-explicit-alternate-term | explicit_alias | supported_top1 | supported | vm01-definition-062-policyholder-behavior |
| vm01-undefined-deterministic-exclusion-test | unsupported_term | unsupported | unsupported | vm01-definition-086-stochastic-exclusion-test |
| vm01-ambiguous-reserve | ambiguous_term | unsupported | unsupported | vm01-definition-056-net-premium-reserve |
| vm01-proposed-2027-version | historical_or_proposed_version | unsupported | unsupported | vm01-definition-002-accumulated-deficiency |
