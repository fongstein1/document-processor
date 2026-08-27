# VM-01 definition retrieval evaluation

- Queries: 21 (18 supported, 3 unsupported)
- Supported top-1 / top-3: 17/18 / 18/18
- Unsupported correctly abstained: 3/3
- Current VM-01 authority ranked first: 18/18

- Case-level JSON SHA-256: `e77e3d78199323de9e11a68638c3eda6f5e5073cead0a73b6140461a00c50f43`

| Query | Category | Intended support | Actual support | Top-1 | Top-3 | Review note |
| --- | --- | --- | --- | --- | --- | --- |
| vm01-exact-accumulated-deficiency | exact_defined_term | supported | supported | vm01-definition-002-accumulated-deficiency | vm01-definition-002-accumulated-deficiency, vm01-definition-098-vm-20-reserving-category, vm01-definition-058-non-material-secondary-guarantee | none |
| vm01-acronym-cte | acronym_lookup | supported | supported | vm01-definition-016-conditional-tail-expectation | vm01-definition-016-conditional-tail-expectation, vm01-definition-098-vm-20-reserving-category, vm01-definition-058-non-material-secondary-guarantee | none |
| vm01-plain-language-tail-measure | plain_language_lookup | supported | supported | vm01-definition-061-pension-risk-transfer | vm01-definition-061-pension-risk-transfer, vm01-definition-077-risk-factor, vm01-definition-090-tail-risk | expected evidence ranked below top 1 but remained in top 3 |
| vm01-similar-claim-reserve | similar_terms | supported | supported | vm01-definition-012-claim-reserve | vm01-definition-012-claim-reserve, vm01-definition-017-contract-reserve, vm01-definition-030-guaranteed-investment-contract | none |
| vm01-similar-contract-reserve | similar_terms | supported | supported | vm01-definition-017-contract-reserve | vm01-definition-017-contract-reserve, vm01-definition-012-claim-reserve, vm01-definition-030-guaranteed-investment-contract | none |
| vm01-condition-future-hedging | condition_or_exception | supported | supported | vm01-definition-029-future-hedging-strategy | vm01-definition-029-future-hedging-strategy, vm01-definition-013-clearly-defined-hedging-strategy, vm01-definition-049-modeled-company-investment-strategy | none |
| vm01-incorporated-margin | incorporated_defined_term | supported | supported | vm01-definition-073-prudent-estimate-assumption | vm01-definition-073-prudent-estimate-assumption, vm01-definition-048-margin, vm01-definition-039-index-credit-hedge-margin | none |
| vm01-cross-reference-npr | manual_cross_reference | supported | supported | vm01-definition-056-net-premium-reserve | vm01-definition-056-net-premium-reserve, vm01-definition-055-net-premium-refund-liability, vm01-definition-092-unearned-premium-reserve | none |
| vm01-cross-document-prudent-estimate | cross_document_terminology | supported | supported | vm01-definition-073-prudent-estimate-assumption | vm01-definition-073-prudent-estimate-assumption, vm01-definition-098-vm-20-reserving-category, vm01-definition-005-anticipated-experience-assumption | none |
| vm01-acronym-iul | acronym_lookup | supported | supported | vm01-definition-042-indexed-universal-life-iul-insurance-policy | vm01-definition-042-indexed-universal-life-iul-insurance-policy, vm01-definition-098-vm-20-reserving-category, vm01-definition-058-non-material-secondary-guarantee | none |
| vm01-acronym-dr | acronym_lookup | supported | supported | vm01-definition-022-deterministic-reserve | vm01-definition-022-deterministic-reserve, vm01-definition-087-stochastic-reserve, vm01-definition-098-vm-20-reserving-category | none |
| vm01-acronym-sr | acronym_lookup | supported | supported | vm01-definition-087-stochastic-reserve | vm01-definition-087-stochastic-reserve, vm01-definition-022-deterministic-reserve, vm01-definition-098-vm-20-reserving-category | none |
| vm01-acronym-npr | acronym_lookup | supported | supported | vm01-definition-056-net-premium-reserve | vm01-definition-056-net-premium-reserve, vm01-definition-098-vm-20-reserving-category, vm01-definition-058-non-material-secondary-guarantee | none |
| vm01-acronym-gic | acronym_lookup | supported | supported | vm01-definition-030-guaranteed-investment-contract | vm01-definition-030-guaranteed-investment-contract, vm01-definition-089-synthetic-guaranteed-investment-contract, vm01-definition-098-vm-20-reserving-category | none |
| vm01-cross-page-cdhs | cross_page_definition | supported | supported | vm01-definition-013-clearly-defined-hedging-strategy | vm01-definition-013-clearly-defined-hedging-strategy, vm01-definition-029-future-hedging-strategy, vm01-definition-037-hedging-transaction | none |
| vm01-long-category | complex_definition | supported | supported | vm01-definition-098-vm-20-reserving-category | vm01-definition-098-vm-20-reserving-category, vm01-definition-058-non-material-secondary-guarantee, vm01-definition-074-qualified-actuary | none |
| vm01-gi-exclusions | condition_or_exception | supported | supported | vm01-definition-031-guaranteed-issue-gi-life-insurance-policy | vm01-definition-031-guaranteed-issue-gi-life-insurance-policy, vm01-definition-042-indexed-universal-life-iul-insurance-policy, vm01-definition-093-universal-life-insurance-policy | none |
| vm01-explicit-alternate-term | explicit_alias | supported | supported | vm01-definition-062-policyholder-behavior | vm01-definition-062-policyholder-behavior, vm01-definition-030-guaranteed-investment-contract, vm01-definition-089-synthetic-guaranteed-investment-contract | none |
| vm01-undefined-deterministic-exclusion-test | unsupported_term | unsupported | unsupported | vm01-definition-086-stochastic-exclusion-test | vm01-definition-086-stochastic-exclusion-test, vm01-definition-022-deterministic-reserve, vm20-practice-note-companion-vm20-pn-deterministic-exclusion-child-002 | none |
| vm01-ambiguous-reserve | ambiguous_term | unsupported | unsupported | vm01-definition-056-net-premium-reserve | vm01-definition-056-net-premium-reserve, vm01-definition-022-deterministic-reserve, vm01-definition-066-pretax-interest-maintenance-reserve | none |
| vm01-proposed-2027-version | historical_or_proposed_version | unsupported | unsupported | vm01-definition-002-accumulated-deficiency | vm01-definition-002-accumulated-deficiency, vm01-definition-098-vm-20-reserving-category, vm01-definition-058-non-material-secondary-guarantee | none |
