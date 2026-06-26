# Decisions

## Standalone processor workspace

This repo is a dedicated document-processing workspace. It should not become a
second learner-facing app.

## Raw source separation

Raw source documents remain in the external raw folder and out of Git. The repo
stores only scripts, docs, templates, configs, and lightweight sanitized
artifacts.

## Reference app stays read-only

The existing app repo is reference material and export target context only. It
should not be modified unless explicitly requested.

## Small pilot first

The first run should be a small representative batch that proves the full
pipeline before any broader source-family expansion.

## Source-bound and review-first

Every output must trace back to source documents and chunk IDs, and learner-
facing promotion requires exact citation, clear support, high confidence, and
no unresolved review flags.

## Domain config isolates assumptions

NAIC-specific assumptions should live in config rather than hard-coded logic so
the same processor can support pricing and liability-modeling material later.

## Review packets stay exception-first

Human review should focus on extraction failures, missing citations, ambiguous
language, contradictions, and promotion candidates.

## Formal contract layer first

Batch manifests, source inventories, extraction outputs, and review packets are
now treated as formal JSON-schema contracts with committed demo fixtures. Real
source processing should not start until those contracts validate cleanly.

## Demo fixtures remain non-source

The committed contract demo fixtures are mock-only examples. They exist to
prove the contract layer and must not be confused with raw source content or
learner-facing exports.
