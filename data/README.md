# Data Layout

This repository keeps raw source material outside Git.

External source roots live under:

`D:\Work\AI Projects\NAIC Valuation Manual Course`

Tracked data in this repo should stay lightweight and auditable:

- `data/schemas/` for formal JSON Schema contracts
- `data/templates/` for reusable batch and review packet templates
- `data/samples/contract-demo/` for tiny mock fixtures that validate the
  contract layer
- `data/review/` for concise review packets
- `data/exports/` for sanitized app-ready outputs
- `data/manifests/` for small source inventories and batch manifests when
  intentionally committed

Working directories are ignored by design:

- `data/work/`
- `data/extracted/`
- `data/generated/`
- `data/cache/`

Run `npm run bootstrap` to create the first batch workspace skeleton.
