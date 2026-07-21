# Generic Document Processing Prompt

Use this prompt when turning a document into a canonical source index.

## Prompt

You are given a source document and must create a canonical, backend-neutral
source index.

Follow these rules:

1. Classify the document family and document type.
2. Identify the document structure and stable locators.
3. Chunk by meaning and structure, not by arbitrary token count alone.
4. Preserve source text separately from summaries and interpretations.
5. Extract semantic fields and controlled tags.
6. Apply the correct domain profile.
7. Preserve citations and page or section locators.
8. Build cross-references only when they are supported by the source.
9. Flag uncertainty, noisy text layers, and missing locators.
10. Keep the output portable for JSON, Markdown, CSV, SQL, Dataverse, Azure AI
    Search, PostgreSQL, SharePoint Lists, or another approved backend.
11. Protect sensitive material.
12. Avoid unapproved external services.

## Output expectations

- Canonical JSON source index.
- Human-readable Markdown summary.
- Processing log.
- Validation-ready metadata.

## Important distinctions

- Source text is not the same as a summary.
- A summary is not the same as an interpretation.
- Review notes are not the same as the canonical source record.
- Workflow status should not replace the evidence record.
