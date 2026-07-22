# Retrieval POC Corpus Plan

## Purpose

This plan defines the representative corpus used to expand the canonical
source-index proof of concept from a tiny starter set into a retrieval-quality
test corpus.

The goal is not broad document coverage. The goal is to surface retrieval
failures that matter:

- source-title confusion;
- similar terminology across sources;
- relationship-heavy evidence;
- companion guidance versus binding text;
- page-boundary and chunk-boundary pressure;
- unsupported-query behavior.

## Selected corpus

The current corpus targets 17 representative source packages and 41 canonical
chunks.

| Source package | Why it is included | Retrieval challenge | Authority level | Expected chunk count | Fidelity limitation | Full source or excerpt |
| --- | --- | --- | --- | --- | --- | --- |
| AG 01 net-premium interpretation | Compact one-page guideline interpretation with strong terminology overlap | Exact-title and defined-term retrieval | Guideline | 1 | Review-derived wording; page-image backstop remains visible | Excerpt |
| AG 03 maturity-value interpretation | Compact one-page guideline interpretation with a different nonforfeiture-law hook | Terminology retrieval with a cross-reference | Guideline | 1 | Review-derived wording; page-image backstop remains visible | Excerpt |
| VM-20 framework overview | Starts the VM-20 framework and minimum-reserve orientation | Framework retrieval versus later mechanics | Manual section | 1 | Actual source text exists in the review slice, but no line references were preserved | Excerpt |
| VM-20 framework boundary | Captures the mechanics boundary after the overview | Boundary-sensitive retrieval | Manual section | 1 | Actual source text exists in the review slice, but no line references were preserved | Excerpt |
| VM-20 Section 3.C assumptions | Adds an assumption-layer slice beyond the overview | Assumptions versus mechanics retrieval | Manual section | 4 | Review-derived wording used for the canonical package; no line references were preserved | Excerpt |
| VM-21 SR projection entry | Adds another VM chapter with reserve-methodology pressure | Similar reserve terminology under a different chapter | Manual section | 4 | Review-derived wording used for the canonical package; no line references were preserved | Excerpt |
| AG 36 active source | Relationship-heavy guideline with mechanics, hedging, and closeout | Retrieving the correct guideline when text is noisy | Guideline | 4 | Encoding-noisy text layer; page-image wording backstop required | Excerpt |
| AG 36 2021 Law Manual reprint | Companion-only reprint that should not collapse into the active source | Reprint versus active-source distinction | Companion reprint | 1 | Companion-only wording; page-image wording backstop required | Excerpt |
| Model governance practice note | Secondary guidance on controls and validation | Companion guidance versus binding text | Non-binding practice note | 3 | Review-derived wording; page locators are the primary anchor | Full source |
| Actuarial memorandum practice note | Secondary guidance with drafting and appendix pressure | Multi-section retrieval and judgment-heavy content | Non-binding practice note | 4 | Review-derived wording; page locators are the primary anchor | Full source |
| Reg 210 | Active NY regulation with jurisdiction-specific requirements | Regulation versus guidance and page-boundary handling | Regulation | 3 | Page locators are primary; line references were not preserved in the canonical package | Full source |
| CIA 2022 educational note | Companion/educational guidance with a different jurisdiction and authority posture | Educational note versus binding regulation | Educational note | 4 | Review-derived wording; page locators are the primary anchor | Full source |
| Synthetic pricing corpus | Synthetic product, assumptions, methodology, profitability, and approval materials | Portable pricing-profile retrieval and classification | Synthetic pricing documents | 5 | Synthetic source text with profile-aware metadata | Synthetic |

## Why these sources

The corpus is intentionally mixed:

- AG 01 and AG 03 keep the original one-page, noisy-guideline retrieval cases
  alive.
- VM-20 overview, boundary, and assumptions keep the reserve framework and
  mechanics transition in view.
- VM-21 adds a neighboring reserve chapter so the corpus has a same-family
  contrast case.
- AG 36 adds a longer guideline with mechanics, hedging, and closeout.
- The AG 36 Law Manual reprint adds a relationship-heavy duplicate/reprint
  case.
- Model governance and actuarial memorandum practice notes add companion
  guidance and control-heavy content.
- Reg 210 adds a current state regulation with jurisdiction-specific posture.
- The CIA 2022 educational note adds a non-NAIC companion source with a
  different jurisdiction and authority level.
- The synthetic pricing corpus adds a portable pricing-profile corpus and
  exercises classification without forcing pricing-specific assumptions into
  the generic core.

## Corpus design notes

- The canonical source-index layer remains backend-neutral.
- Review-only artifacts are still the primary provenance layer.
- Source relationships are represented where they are supported by tracked
  evidence.
- Review-derived text is labeled honestly when exact source text is not
  available in the POC inputs.
- The corpus is large enough to test ranking and ambiguity, but still small
  enough to inspect manually.

## Retrieval intent

The corpus is designed to support questions that test:

- exact title retrieval;
- defined-term retrieval;
- reserve-methodology retrieval;
- cross-source and relationship-aware retrieval;
- companion-guidance versus binding-text separation;
- jurisdiction-aware filtering;
- profile-aware classification;
- unsupported-query handling.

## Corpus boundaries

Out of scope for this POC:

- raw source reprocessing;
- confidential pricing material;
- liability-modeling production models;
- cloud retrieval services;
- embeddings or vector backends;
- promotion of any review-only source package.
