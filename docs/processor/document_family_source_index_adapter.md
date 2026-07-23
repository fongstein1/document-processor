# Document Family Source-Index Adapter

## Purpose

`scripts/build-family-source-index-poc.mjs` bridges a deterministic family
intake scan and the existing canonical source-index contract. It does not
invent source text from intake metadata. It requires a reviewed source pack
with source-bound chunks and citations.

## Inputs

- `source-index-input.json` from the family-intake scanner;
- a reviewed source pack compatible with
  `data/schemas/document-family-reviewed-source-pack.schema.json`;
- an ignored output directory under `data/work/`.

Example:

```text
node scripts/build-family-source-index-poc.mjs \
  --intake data/work/intake-validation/synthetic-pricing-intake-demo/source-index-input.json \
  --reviewed-packages data/samples/contract-demo/document-family-reviewed-source-pack.example.json \
  --output-dir data/work/intake-validation/synthetic-pricing-intake-demo/canonical
```

## Outputs

The adapter writes review-only canonical POC packages:

- `repository-manifest.json` and Markdown;
- one source-index JSON and Markdown pair per reviewed source;
- `source_chunks.jsonl` and `source_chunks.csv`;
- `export_manifest.json`;
- `adapter-report.json`.
- a separate relationship registry can be generated from the same intake and
  reviewed-pack inputs.

Every package blocks learner-facing, app-ready, RAG-ready, and promotion
states. Retrieval evaluation remains pending until a human-reviewed query set
exists. The adapter does not commit raw source files or ignored working data.

## Guardrails

- Intake metadata supplies identity and classification only.
- Reviewed packages must provide citations and page or section locators.
- Every chunk must have `promotionEligible: false`.
- The generated repository manifest is a review-only POC, not a promotion
  decision.
- The generated vector/RAG path remains disabled until separate review gates
  are satisfied.
- Relationship edges belong in
  `data/schemas/document-family-relationship-registry.schema.json` and stay
  candidate/needs-review until a human confirms them.
