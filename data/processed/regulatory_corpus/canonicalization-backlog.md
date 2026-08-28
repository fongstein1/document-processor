# Regulatory Canonicalization Backlog

The VM-01 current-definition scope, VM-20 current-manual prose scope, reviewed available Appendix 2 structured-table scope, and current VM-31 scope are promoted under separate decisions. All other items remain review-only until independent human review and explicit promotion. VM-01 and VM-31 relationship candidates remain separate review-only governance items. The next P0 chapter is VM-30.

| Order | Priority | Target | Current state | Safe next step |
| ---: | --- | --- | --- | --- |
| 1 | P0 | Current prescribed valuation, mortality, spread, and default tables | canonical_promoted_partial_vm20_appendix2 | Retain the promoted VM-20 scope and continue other table families separately without reconstructing unavailable values. |
| 2 | P0 | Complete current 2026 Valuation Manual representation | canonical_partial | Canonicalize the complete manual by chapter with source-bound hierarchy and a separate table profile. |
| 3 | P0 | VM-20 Requirements for Principle-Based Reserves for Life Products | canonical_promoted_prose_and_tables | Retain the approved prose/table scopes and track unavailable Tables B, C, D, E1, and E2 without inference. |
| 4 | P0 | VM-21 Requirements for Principle-Based Reserves for Variable Annuities | canonical_partial | Canonicalize the reviewed VM-21 wave with parent-child structure and table separation. |
| 5 | P0 | VM-22 Requirements for Principle-Based Reserves for Non-Variable Annuities | reviewed_not_canonical | Canonicalize reviewed VM-22 sections after table and hedging boundaries are confirmed. |
| 6 | P0 | VM-30 Actuarial Opinion and Memorandum Requirements | reviewed_not_canonical | Canonicalize the reporting requirements and preserve cross-references to VM-31. |
| 7 | P0 | VM-C current Actuarial Guidelines appendix and AG mapping | reviewed_not_canonical | Obtain/confirm the authorized appendix and map individually processed AGs without inferring legal effect. |
| 8 | P0 | VM-G Corporate Governance Requirements for PBR | canonical_partial | Confirm the authorized 2026 source and process it as a governance-specific chapter. |
| 9 | P1 | Annual statement, actuarial opinion, and PBR reporting instructions | reviewed_not_canonical | Add only authorized reporting instructions that materially affect valuation answers. |
| 10 | P1 | Standard Valuation Law / Model #820 | reviewed_not_canonical | Add the authorized model-law source for interpretation and applicability context. |
| 11 | P1 | Current Valuation Manual amendments and change material | review_artifact_only | Inventory authorized current amendments and preserve version/effective-date relationships. |
| 12 | P1 | Valuation Manual Maintenance Agenda and amendment proposals | missing | Keep proposed material separate and explicitly non-controlling. |
| 13 | P1 | VM-02 Nonforfeiture Requirements | reviewed_not_canonical | Canonicalize after the P0 manual chapters. |
| 14 | P1 | VM-50 PBR Experience Reporting | missing | Confirm current source and add as reporting support. |
| 15 | P1 | VM-51 PBR Experience Reporting Tables | missing | Treat as structured reporting/table material. |
| 16 | P1 | VM-A Actuarial Opinion and Memorandum appendix | reviewed_not_canonical | Confirm current appendix scope and canonicalize with VM-30 cross-references. |
| 17 | P1 | VM-M valuation manual material | missing | Confirm whether this is in near-term life/annuity scope before intake. |
| 18 | P1 | VM-V valuation manual material | missing | Confirm whether this is in near-term life/annuity scope before intake. |
| 19 | P2 | Actuarial practice notes and educational notes | canonical_partial | Canonicalize selectively when it answers likely implementation questions without replacing authority. |
| 20 | P2 | Targeted historical Valuation Manual editions | review_artifact_only | Add only where version-aware retrieval requires historical comparison. |
| 21 | P2 | Implementation FAQs | review_artifact_only | Keep FAQ material companion-only and source-bound. |
| 22 | P2 | Jurisdiction-specific deviations from model requirements | reviewed_not_canonical | Add documentary deviations with jurisdiction and effective-date evidence. |
| 23 | P2 | Law Manual reprints | canonical_partial | Track as reprints/companions only after human disposition. |
| 24 | P2 | New York valuation regulations and amendments | reviewed_not_canonical | Prioritize jurisdictional deviations after P0 current NAIC chapters. |
| 25 | P2 | Relevant statutory accounting guidance | missing | Add targeted guidance only where it directly changes a valuation or reporting answer. |
| 26 | P3 | Health-specific Valuation Manual material | reviewed_not_canonical | Defer unless scope expands. |

## Chunking acceptance criteria

- Use document → chapter → section → subsection → paragraph/requirement hierarchy.
- Use parent chunks for coherent structural units and child chunks for precise retrieval; preserve `parentChunkId`, `precedingChunkId`, `followingChunkId`, `headingPath`, and a structural locator.
- Keep requirement, exception, qualification, condition, definition, and table headings together when they are directly associated.
- Use token splitting only as a fallback within an unusually large structural unit.
- Keep tables in a structured-table profile, separate from prose chunking.
- Retrieval should support child retrieval, reranking, parent/adjacent expansion, and an evidence package.

