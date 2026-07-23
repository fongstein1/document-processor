# Document Family Intake

This directory defines the folder contract for a new actuarial document family
before the family is converted into the canonical source-index layer.

## Intended layout

```text
data/intake/<family_id>/
├─ source/
├─ metadata/
├─ overrides/
└─ README.md
```

## What belongs here

- `source/`: the family's source files, kept out of Git and processed only by
  the local intake scanner or an approved external workspace.
- `metadata/`: the family intake manifest, the deterministic inventory output,
  the handoff summary, and any profile-selection notes.
- `overrides/`: optional document-specific metadata overrides.
- `README.md`: a short, human-readable description of the family.

## Required manifest

Each family should define a `document-family-intake.schema.json`-compatible
manifest that captures:

- family identity and description;
- the default domain profile;
- the document inventory;
- per-document overrides;
- confidentiality defaults;
- relationship hints;
- expected validation rules;
- output destinations;
- processing status.

## Workflow

1. Receive or create the family intake manifest.
2. Scan the `source/` folder deterministically.
3. Produce the inventory, source-index input, repository-manifest preparation,
   and retrieval-test handoff artifacts in `data/work/`.
4. Feed the selected profile and validation results into the existing
   source-index build and retrieval handoff workflow.
5. After reviewed chunks exist, run the family source-index adapter to create
   review-only canonical POC packages.

## Guardrails

- Keep raw source files out of Git.
- Keep intake output review-only until a later promotion decision exists.
- Treat repository-manifest and retrieval-test handoffs as preparation records;
  they do not mean those downstream artifacts have been built or approved.
- Use the intake manifest to reduce custom code when onboarding a new family.
- Treat synthetic corpora as synthetic and non-sensitive in the manifest.
