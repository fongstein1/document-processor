# Handoff Process

Use this checklist before ending each Codex session.

## Start of session

1. Read `docs/project-state/CURRENT_STATE.md`.
2. Read `docs/project-state/SOURCE_GUARDRAILS.md`.
3. Read this file.
4. Run `git status --short --branch`.
5. Inspect the relevant config, scripts, and docs before editing.
6. Confirm the raw source roots and the intended batch scope.

## Closeout checklist

1. Run `npm run check`.
2. Run `npm run bootstrap` when the batch workspace needs to be prepared.
3. Summarize the implemented changes.
4. Update `docs/project-state/CURRENT_STATE.md`.
5. Append `docs/project-state/SESSION_LOG.md`.
6. Update `docs/project-state/NEXT_ACTIONS.md`.
7. Confirm source-bound guardrails remain intact.
8. Inspect the diff with `git diff --stat` and `git diff`.
9. Commit the logical update when ready.

## Commit guidance

- Do not commit raw source documents or large generated outputs.
- Commit scripts, schemas, docs, templates, and lightweight sanitized exports.
- Preserve source-bound guardrails in every update.
