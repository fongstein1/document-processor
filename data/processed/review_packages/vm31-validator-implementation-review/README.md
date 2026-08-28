# VM-31 validator implementation review snapshot

This directory contains a byte-exact snapshot of the live VM-31 validator and focused evidence for the explicit-source relationship-label boundary.

- Live source: `scripts/validate-vm31-current-manual.mjs`
- Snapshot: `data/processed/review_packages/vm31-validator-implementation-review/validate-vm31-current-manual.mjs`
- SHA-256: `006a7c0368ab1d475d0c41da566ae3b9fd21dc1799a0a08fd67dcc8d2d0be555`
- Byte length: 20038
- Byte equality: **PASS**
- Focused regression: `data/processed/review_packages/vm31-validator-implementation-review/relationship-label-normalization-regression.json` (5/5 passed)

The snapshot is review evidence, not a second production implementation. Run `npm run vm31:validator-evidence:validate` to recalculate both hashes and lengths and compare the byte streams.
