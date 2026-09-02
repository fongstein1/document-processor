# Regulatory Canonicalization Backlog

The VM-01 current-definition scope, VM-20 current-manual prose scope, reviewed available Appendix 2 structured-table scope, and current VM-21, VM-30, and VM-31 scopes are promoted under separate decisions. VM-22 is a substantially complete review-only canonical candidate pending independent review. VM-01, VM-21, VM-22, VM-30, and VM-31 relationship candidates remain separate review-only governance items.

| Order | Priority | Target | Current state | Safe next step |
| ---: | --- | --- | --- | --- |
| 1 | P0 | Current prescribed valuation, mortality, spread, and default tables | canonical_promoted_partial_vm20_appendix2 | Retain the promoted VM-20 scope and continue other table families separately without reconstructing unavailable values. |
| 2 | P0 | Complete current 2026 Valuation Manual representation | canonical_partial | Canonicalize the complete manual by chapter with source-bound hierarchy and a separate table profile. |
| 3 | P0 | VM-20 Requirements for Principle-Based Reserves for Life Products | canonical_promoted_prose_and_tables | Retain the approved prose/table scopes and track unavailable Tables B, C, D, E1, and E2 without inference. |
| 4 | P0 | VM-22 Requirements for Principle-Based Reserves for Non-Variable Annuities | canonical_review_candidate | Complete the narrow independent review and record a promotion decision only if the candidate passes. |
| 5 | P0 | VM-C current Actuarial Guidelines appendix and AG mapping | reviewed_not_canonical | Obtain/confirm the authorized appendix and map individually processed AGs without inferring legal effect. |
| 6 | P0 | VM-G Corporate Governance Requirements for PBR | canonical_partial | Confirm the authorized 2026 source and process it as a governance-specific chapter. |
| 7 | P1 | Annual statement, actuarial opinion, and PBR reporting instructions | canonical_partial | Add only authorized reporting instructions that materially affect valuation answers. |
| 8 | P1 | Standard Valuation Law / Model #820 | reviewed_not_canonical | Add the authorized model-law source for interpretation and applicability context. |
| 9 | P1 | Current Valuation Manual amendments and change material | review_artifact_only | Inventory authorized current amendments and preserve version/effective-date relationships. |
| 10 | P1 | Valuation Manual Maintenance Agenda and amendment proposals | missing | Keep proposed material separate and explicitly non-controlling. |
| 11 | P1 | VM-02 Nonforfeiture Requirements | reviewed_not_canonical | Canonicalize after the P0 manual chapters. |
| 12 | P1 | VM-50 PBR Experience Reporting | missing | Confirm current source and add as reporting support. |
| 13 | P1 | VM-51 PBR Experience Reporting Tables | missing | Treat as structured reporting/table material. |
| 14 | P1 | VM-A Actuarial Opinion and Memorandum appendix | reviewed_not_canonical | Confirm current appendix scope and canonicalize with VM-30 cross-references. |
| 15 | P1 | VM-M valuation manual material | missing | Confirm whether this is in near-term life/annuity scope before intake. |
| 16 | P1 | VM-V valuation manual material | missing | Confirm whether this is in near-term life/annuity scope before intake. |
| 17 | P2 | Actuarial practice notes and educational notes | canonical_partial | Canonicalize selectively when it answers likely implementation questions without replacing authority. |
| 18 | P2 | Targeted historical Valuation Manual editions | review_artifact_only | Add only where version-aware retrieval requires historical comparison. |
| 19 | P2 | Implementation FAQs | review_artifact_only | Keep FAQ material companion-only and source-bound. |
| 20 | P2 | Jurisdiction-specific deviations from model requirements | reviewed_not_canonical | Add documentary deviations with jurisdiction and effective-date evidence. |
| 21 | P2 | Law Manual reprints | canonical_partial | Track as reprints/companions only after human disposition. |
| 22 | P2 | New York valuation regulations and amendments | reviewed_not_canonical | Prioritize jurisdictional deviations after P0 current NAIC chapters. |
| 23 | P2 | Relevant statutory accounting guidance | missing | Add targeted guidance only where it directly changes a valuation or reporting answer. |
| 24 | P3 | Health-specific Valuation Manual material | reviewed_not_canonical | Defer unless scope expands. |

## Chunking acceptance criteria

- Use document → chapter → section → subsection → paragraph/requirement hierarchy.
- Use parent chunks for coherent structural units and child chunks for precise retrieval; preserve `parentChunkId`, `precedingChunkId`, `followingChunkId`, `headingPath`, and a structural locator.
- Keep requirement, exception, qualification, condition, definition, and table headings together when they are directly associated.
- Use token splitting only as a fallback within an unusually large structural unit.
- Keep tables in a structured-table profile, separate from prose chunking.
- Retrieval should support child retrieval, reranking, parent/adjacent expansion, and an evidence package.

