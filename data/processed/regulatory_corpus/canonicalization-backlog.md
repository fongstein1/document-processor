# Regulatory Canonicalization Backlog

All items remain review-only until independent human review and explicit promotion. The sequence favors reviewed high-value material, then partial core packages, then genuinely absent P0 sources, then tables and supporting sources.

| Order | Priority | Target | Current state | Safe next step |
| ---: | --- | --- | --- | --- |
| 1 | P0 | Current prescribed valuation, mortality, spread, and default tables | reviewed_not_canonical | Create a table-specific profile with row/column citations and version metadata; do not prose-chunk tables. |
| 2 | P0 | Complete current 2026 Valuation Manual representation | canonical_partial | Canonicalize the complete manual by chapter with source-bound hierarchy and a separate table profile. |
| 3 | P0 | VM-01 Definitions | reviewed_not_canonical | Canonicalize definitions first because downstream VM answers depend on stable terms. |
| 4 | P0 | VM-20 Requirements for Principle-Based Reserves for Life Products | canonical_partial | Expand the existing reviewed VM-20 slices into a hierarchical chapter package. |
| 5 | P0 | VM-21 Requirements for Principle-Based Reserves for Variable Annuities | canonical_partial | Canonicalize the reviewed VM-21 wave with parent-child structure and table separation. |
| 6 | P0 | VM-22 Requirements for Principle-Based Reserves for Non-Variable Annuities | reviewed_not_canonical | Canonicalize reviewed VM-22 sections after table and hedging boundaries are confirmed. |
| 7 | P0 | VM-30 Actuarial Opinion and Memorandum Requirements | reviewed_not_canonical | Canonicalize the reporting requirements and preserve cross-references to VM-31. |
| 8 | P0 | VM-31 PBR Actuarial Report Requirements | reviewed_not_canonical | Canonicalize the report requirements with reporting-obligation chunk types. |
| 9 | P0 | VM-C current Actuarial Guidelines appendix and AG mapping | reviewed_not_canonical | Obtain/confirm the authorized appendix and map individually processed AGs without inferring legal effect. |
| 10 | P0 | VM-G Corporate Governance Requirements for PBR | canonical_partial | Confirm the authorized 2026 source and process it as a governance-specific chapter. |
| 11 | P1 | Annual statement, actuarial opinion, and PBR reporting instructions | reviewed_not_canonical | Add only authorized reporting instructions that materially affect valuation answers. |
| 12 | P1 | Standard Valuation Law / Model #820 | reviewed_not_canonical | Add the authorized model-law source for interpretation and applicability context. |
| 13 | P1 | Current Valuation Manual amendments and change material | review_artifact_only | Inventory authorized current amendments and preserve version/effective-date relationships. |
| 14 | P1 | Valuation Manual Maintenance Agenda and amendment proposals | missing | Keep proposed material separate and explicitly non-controlling. |
| 15 | P1 | VM-02 Nonforfeiture Requirements | reviewed_not_canonical | Canonicalize after the P0 manual chapters. |
| 16 | P1 | VM-50 PBR Experience Reporting | missing | Confirm current source and add as reporting support. |
| 17 | P1 | VM-51 PBR Experience Reporting Tables | missing | Treat as structured reporting/table material. |
| 18 | P1 | VM-A Actuarial Opinion and Memorandum appendix | reviewed_not_canonical | Confirm current appendix scope and canonicalize with VM-30 cross-references. |
| 19 | P1 | VM-M valuation manual material | missing | Confirm whether this is in near-term life/annuity scope before intake. |
| 20 | P1 | VM-V valuation manual material | missing | Confirm whether this is in near-term life/annuity scope before intake. |
| 21 | P2 | Actuarial practice notes and educational notes | canonical_partial | Canonicalize selectively when it answers likely implementation questions without replacing authority. |
| 22 | P2 | Targeted historical Valuation Manual editions | review_artifact_only | Add only where version-aware retrieval requires historical comparison. |
| 23 | P2 | Implementation FAQs | review_artifact_only | Keep FAQ material companion-only and source-bound. |
| 24 | P2 | Jurisdiction-specific deviations from model requirements | reviewed_not_canonical | Add documentary deviations with jurisdiction and effective-date evidence. |
| 25 | P2 | Law Manual reprints | canonical_partial | Track as reprints/companions only after human disposition. |
| 26 | P2 | New York valuation regulations and amendments | reviewed_not_canonical | Prioritize jurisdictional deviations after P0 current NAIC chapters. |
| 27 | P2 | Relevant statutory accounting guidance | missing | Add targeted guidance only where it directly changes a valuation or reporting answer. |
| 28 | P3 | Health-specific Valuation Manual material | reviewed_not_canonical | Defer unless scope expands. |

## Chunking acceptance criteria

- Use document → chapter → section → subsection → paragraph/requirement hierarchy.
- Use parent chunks for coherent structural units and child chunks for precise retrieval; preserve `parentChunkId`, `precedingChunkId`, `followingChunkId`, `headingPath`, and a structural locator.
- Keep requirement, exception, qualification, condition, definition, and table headings together when they are directly associated.
- Use token splitting only as a fallback within an unusually large structural unit.
- Keep tables in a structured-table profile, separate from prose chunking.
- Retrieval should support child retrieval, reranking, parent/adjacent expansion, and an evidence package.

