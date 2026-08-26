# Structured regulatory tables

This directory is the machine-readable table layer. It is separate from the
canonical prose source-index and preserves table identity, versions,
dimensions, source-cell values, display precision, notes, and citations.

The VM-20 Appendix 2 proof of concept is
`vm20-appendix2-tables.json`. Its corresponding schema is
`data/schemas/structured-regulatory-table.schema.json`, and its independent
review package is
`data/processed/review_packages/vm20-appendix2-structured-table-review-package.md`.

The dataset is review-only and not promoted. Raw workbooks remain ignored
under `data/work`; tracked artifacts retain repository-relative source
locators and SHA-256 hashes without embedding machine-specific source paths.
