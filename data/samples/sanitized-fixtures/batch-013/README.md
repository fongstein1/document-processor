# Sanitized Fixture — Batch 013 (VM-01 Definitions)

## Purpose
This directory contains deterministic, sanitized test fixtures representing `batch-013` intake artifacts:
- `batch-manifest.json`: Structural manifest specifying source identity, hash expectation (`496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9`), page boundaries (pp. 25–39), and governance controls (`reviewOnly: true`).
- `extraction-output.json`: Sanitized sample chunk structure conforming to extraction output schemas, enabling automated schema and pipeline verification without distributing copyrighted proprietary full-text PDFs.

## Governance & Source Rights
Under the project's IP and Anti-Contamination rules:
- No raw proprietary NAIC PDFs or full-text copies are committed or published.
- The authoritative canonical index for VM-01 resides at `data/processed/source_indexes/definitions/vm01-definition-index.json`.
- This fixture satisfies testing and verification needs for offline or sandboxed environments where raw local PDF files are not present.
