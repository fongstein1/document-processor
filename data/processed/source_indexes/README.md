# Canonical source-index POC

This directory contains the backend-neutral canonical source-index proof of concept.

- `sources/` contains one JSON + Markdown pair per source.
- `exports/` contains the canonical JSONL and CSV exports plus the export manifest.
- `evaluation/` contains the retrieval questions and evaluation results.
- `retrieval/` contains a legacy compatibility summary for earlier handoff notes.
- `repository-manifest.json` ties the package together.

Packages retain per-source governance. Explicitly promoted VM-20 packages remain promoted; VM-01 and other unpromoted packages remain review-only. No package replaces the underlying review evidence or grants downstream export eligibility.

