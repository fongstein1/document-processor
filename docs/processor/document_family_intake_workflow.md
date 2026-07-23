# Document Family Intake Workflow

## Purpose

This workflow defines how a new actuarial document family enters the reusable
document-structurizer pipeline with minimal custom code.

The intake stage sits before the canonical source-index build. It is a
deterministic, offline, review-only step that inventories a folder, applies a
selected domain profile, and prepares a handoff package for the existing
source-index and retrieval-evaluation layers.

## Intake contract

The intake folder should follow this structure:

```text
data/intake/<family_id>/
├─ source/
├─ metadata/
├─ overrides/
└─ README.md
```

The manifest schema is `data/schemas/document-family-intake.schema.json`.

The canonical manifest fields are:

- family identity and description;
- default domain profile;
- document inventory;
- per-document overrides;
- confidentiality defaults;
- relationship hints;
- expected validation rules;
- output destinations;
- processing status.

## Deterministic intake scan

Use `scripts/scan-document-family-intake.mjs` to scan a family folder or an
explicit source-root override.

The scanner should:

- list documents in a deterministic order;
- capture file metadata;
- merge manifest metadata with discovered file metadata;
- apply the selected profile or a per-document override;
- emit a review-only inventory JSON file;
- emit a short Markdown handoff summary;
- emit a source-index input handoff for the next canonical build;
- emit a repository-manifest preparation handoff without claiming a manifest
  has been built;
- emit a retrieval-test handoff with an empty query set until reviewed source
  packages exist.

The scanner is intentionally offline and does not depend on a network
service. It should stay portable across actuarial source families.

## Relationship to the canonical source-index layer

The intake workflow is not a replacement for the canonical source-index POC.
Instead, it feeds the existing source-index build, classification, export, and
retrieval-evaluation artifacts with a clearer family-level contract.

The source-index layer still owns:

- stable source and chunk identifiers;
- source-bound extraction;
- canonical chunk packages;
- relationship candidates;
- relationship registry candidates for companion, reprint, amendment,
  supersession, and cross-reference edges;
- repository-manifest updates;
- retrieval evaluation;
- review-only / learner-facing / app-ready / RAG-ready governance.

The intake scanner emits these preparation artifacts under `data/work/`:

- `intake-inventory.json` and `intake-inventory.md` for deterministic intake
  evidence;
- `intake-handoff.json` for the family-level handoff;
- `source-index-input.json` for the next canonical source-index build;
- `repository-manifest-handoff.json` with `repositoryManifestStatus` set to
  `not_built`;
- `retrieval-test-handoff.json` with `retrievalTestStatus` set to
  `pending_canonical_source_index_build`.

These are preparation artifacts, not canonical source-index packages. They
must remain review-only and must not be interpreted as learner-facing,
app-ready, or RAG-ready outputs.

After reviewed source-bound chunks exist, use
`scripts/build-family-source-index-poc.mjs` to convert the intake
`source-index-input.json` plus a reviewed source pack into canonical source
package POC artifacts. The adapter is intentionally a separate step so intake
metadata cannot be mistaken for extracted evidence.

Use `scripts/build-document-family-relationship-registry.mjs` alongside the
adapter to normalize manifest hints and reviewed-package relationship edges.
The registry keeps every edge as `candidate` or `needs_review` with
`reviewRequired: true`; it does not confirm companion, duplicate, amendment,
supersession, or cross-reference semantics.

## What not to do

- Do not commit raw source documents.
- Do not promote intake artifacts into learner-facing content.
- Do not confuse the intake inventory with the canonical source-index record.
- Do not infer missing files or profiles from memory when a manifest is
  available.

## Companion workflow

If the raw source root cannot be inventoried safely, use the separate
`docs/processor/remaining_source_inventory_workflow.md` intake fallback for a
human-supplied remaining-source list.
