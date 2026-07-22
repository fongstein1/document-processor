# New Domain Profile Prompt

Use this prompt when defining a new actuarial document domain for the
canonical source-index layer.

## Prompt

You are designing a domain profile for the canonical document-structurizer.

Provide:

1. domain ID;
2. profile name;
3. supported document types;
4. source-family guidance;
5. optional metadata fields;
6. preferred chunking strategy;
7. semantic extraction priorities;
8. relationship vocabulary;
9. validation rules;
10. example retrieval questions;
11. confidentiality or sensitivity notes;
12. synthetic sample guidance if the domain has no real corpus yet.

## Guardrails

- Keep the generic core stable.
- Do not make domain-specific fields globally mandatory.
- Do not collapse summaries into source text.
- Do not imply production readiness.
- Keep the profile portable across backends.

