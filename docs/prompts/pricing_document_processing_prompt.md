# Pricing Document Processing Prompt

Use this prompt for internal pricing documents that are not public and may
contain confidential company information.

## Prompt

Turn the document into a canonical source index while preserving source text,
citations, and a portable metadata model.

Pay attention to:

- pricing methodology;
- product specification;
- assumption memo;
- model documentation;
- profitability study;
- approval memo;
- pricing standard;
- sensitivity analysis;
- governance and control material.

## Required behavior

1. Classify the document and choose the pricing profile when appropriate.
2. Preserve the original source text separately from summaries.
3. Extract the key pricing concepts, assumptions, inputs, outputs, and
   decisions.
4. Preserve references to pages, sections, tables, and appendices.
5. Keep the output portable for JSON, Markdown, CSV, SQL, Dataverse, Azure AI
   Search, PostgreSQL, SharePoint Lists, or another approved backend.
6. Flag uncertainties, missing locators, and model limitations.
7. Preserve confidentiality metadata.
8. Avoid unapproved external processing.

## Do not do

- Do not turn summaries into source text.
- Do not claim promotion or app readiness unless explicitly approved.
- Do not overfit the structure to one company or one model.
