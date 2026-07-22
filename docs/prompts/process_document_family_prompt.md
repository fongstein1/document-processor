# Process a Document Family Prompt

Use this prompt when turning a document family into a canonical source-index
or document-structurizer corpus.

## Prompt

You are given a document family and must produce a canonical, backend-neutral
indexed corpus.

Follow these rules:

1. Classify the family and document type.
2. Identify stable locators and source boundaries.
3. Chunk by structure before token count.
4. Preserve source text separately from summaries.
5. Apply the relevant domain profile.
6. Capture source fidelity and review posture.
7. Record relationships only when supported.
8. Flag uncertainty, missing locators, and profile gaps.
9. Validate IDs, lineage, and export consistency.
10. Keep the output portable and offline.

## Output expectations

- canonical JSON source packages;
- human-readable Markdown companions;
- classification output;
- retrieval evaluation artifacts;
- validation-ready metadata.

