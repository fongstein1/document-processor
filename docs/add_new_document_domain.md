# Add a New Document Domain

Use this workflow when introducing a new actuarial document family into the
canonical document-structurizer layer.

## Required steps

1. Define the domain profile.
2. Define the document types and their optional metadata.
3. Define the preferred chunking strategy.
4. Define the semantic extraction priorities.
5. Define the relationship vocabulary that matters most for the domain.
6. Define validation rules and unsupported cases.
7. Add a small sample corpus or synthetic corpus.
8. Add retrieval questions that exercise the profile.
9. Validate the corpus and refresh the retrieval readiness report.

## Profile checklist

Before indexing a new domain, capture:

- domain ID;
- profile name;
- intended document types;
- authority or sensitivity assumptions;
- required versus optional metadata;
- recommended chunk boundaries;
- relationship types;
- profile-specific validation checks;
- example retrieval questions.

## Good practice

- Keep the generic core stable.
- Put domain-specific meaning in optional profile metadata.
- Do not make one domain's fields globally mandatory.
- Keep source text distinct from summaries and interpretations.
- Treat synthetic corpora as synthetic in the metadata and docs.

