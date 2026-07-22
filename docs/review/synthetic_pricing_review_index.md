# Synthetic Pricing Corpus Review Index

## Status

The synthetic pricing corpus is review-only, not learner-facing, not
app-ready, not RAG-ready, and not promoted.

The corpus is intentionally synthetic and non-sensitive. It is included only
to demonstrate generic document-structurizer portability beyond the
regulatory corpus.

## Source packages

| Package | Topic | Status | Notes |
| --- | --- | --- | --- |
| `synthetic-pricing-product-specification` | Product specification | Synthetic | Fictional product and feature set. |
| `synthetic-pricing-assumption-memo` | Assumption memo | Synthetic | Fictional pricing assumptions and bases. |
| `synthetic-pricing-pricing-methodology` | Pricing methodology | Synthetic | Fictional pricing model and method. |
| `synthetic-pricing-profitability-study` | Profitability study | Synthetic | Fictional profitability and sensitivity results. |
| `synthetic-pricing-approval-memo` | Approval memo | Synthetic | Fictional approval and change control. |

## Review concerns

- Confirm synthetic labeling is preserved in the generated packages.
- Confirm pricing/profile fields stay optional and do not leak into the
  generic core as mandatory fields.
- Confirm the evaluation set includes pricing-domain retrieval questions.
- Note that one unsupported prompt currently returns a false positive in the
  retrieval baseline; keep that visible as an evaluation caution.
