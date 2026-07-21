# Generic Document Processing Standard

## Purpose

This standard describes how to turn source documents into a canonical,
retrieval-friendly, human-readable document index while keeping review and
governance metadata separate from the canonical evidence layer.

## Required workflow

1. Classify the document family and document type.
2. Identify the source structure and stable locators.
3. Choose a structure-aware chunking strategy.
4. Preserve source text as faithfully as possible.
5. Generate summaries separately from source text.
6. Extract semantic fields and controlled vocabulary tags.
7. Apply the appropriate domain profile.
8. Build cross-references and relationship links.
9. Preserve citations and source locators.
10. Flag ambiguity, noisy text layers, or source-quality problems.
11. Validate coverage and ID consistency.
12. Export canonical JSON and human-readable Markdown.
13. Protect confidential material and approved-environment boundaries.
14. Avoid unapproved external services.

## Canonical output principle

The canonical output is the source index JSON. Markdown is a companion view.
Workflow logs and review notes support human governance, but they are not a
replacement for the canonical chunk record.

## Source fidelity rule

Every chunk must say what kind of text it contains:

- actual extracted source text;
- manually curated source text;
- review-artifact-derived text;
- placeholder pending source text;
- or another explicit value supported by the schema.

Do not present a summary or interpretation as verbatim source text.

## Generic chunk guidance

Chunks should be:

- large enough to preserve context;
- small enough to retrieve efficiently;
- anchored to headings, clauses, tables, or clear page windows when possible;
- stable enough to survive backend migration.

Chunks may include:

- text;
- normalized search text;
- plain-English summary;
- key points;
- concepts;
- defined terms;
- acronyms;
- entities;
- methods;
- assumptions;
- requirements;
- decisions;
- risks;
- controls;
- exceptions;
- limitations;
- implementation implications;
- open questions;
- cross-references.

## Domain profile rule

The generic core must stay stable. Domain-specific fields belong in optional
profiles such as:

- regulatory;
- pricing;
- liability modeling;
- governance.

Profiles should add meaning without forcing the generic core to become a
domain-specific taxonomy.

## Validation rule

Validation should be deterministic and offline whenever possible. It should
confirm:

- required IDs exist;
- page ranges are valid;
- chunk references resolve;
- fidelity values are explicit;
- exports are internally consistent;
- the human-readable summaries match the canonical records.

## Output posture

The canonical source-index layer is the long-term retrieval artifact. Review
indexes, self-reviews, and promotion states remain useful for governance, but
they should not be the primary machine-readable output.
