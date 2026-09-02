# Regulatory Gap Assessment

## Finding

The repository has substantial reviewed evidence for the 2026 Valuation Manual, Actuarial Guidelines, practice notes, and New York regulations. The principal gap is canonical completeness and structured currentness, not absence of all source evidence. Raw-source availability remains declared from external manifests and is not revalidated by this report.

## P0 assessment

- **valuation-manual-2026-complete — Complete current 2026 Valuation Manual representation:** canonical_partial. The source PDF is declared in existing batch manifests, but the canonical layer is slice-based rather than complete. Next: Canonicalize the complete manual by chapter with source-bound hierarchy and a separate table profile.
- **vm-01 — VM-01 Definitions:** canonical_complete. The reviewed current 2026 VM-01 terminology layer contains 98 exact-text definition units and is canonically promoted under its scope-specific decision. Its 29 relationship candidates and all downstream export uses remain separately governed. Next: Retain the approved definition scope and track the 29 relationship candidates as a separate review-only backlog item.
- **vm-20 — VM-20 Requirements for Principle-Based Reserves for Life Products:** canonical_promoted_prose_and_tables. VM-20 has 149 canonically promoted current-manual prose chunks and a separately promoted structured Appendix 2 scope for available Tables A, F, G, H, I, J, and K. The 175 companion-guidance chunks remain review-only. Next: Retain the approved prose/table scopes and track unavailable Tables B, C, D, E1, and E2 without inference.
- **vm-21 — VM-21 Requirements for Principle-Based Reserves for Variable Annuities:** canonical_complete. Current 2026 VM-21 has one substantially complete review-only canonical candidate with 15 structural parents, 63 exact-text child units, 20 explicit-reference candidates, and a separate structured-evidence inventory. Next: Complete targeted independent review and record a promotion decision; keep relationships and downstream uses separately governed.
- **vm-22 — VM-22 Requirements for Principle-Based Reserves for Non-Variable Annuities:** canonical_review_candidate. VM-22 has a retained-batch canonical candidate with 15 parents, 68 children, and 83 exact-text chunks; independent review remains open. Next: Complete the narrow independent review and record a promotion decision only if the candidate passes.
- **vm-30 — VM-30 Actuarial Opinion and Memorandum Requirements:** canonical_complete. The reviewed current 2026 VM-30 package contains 8 structural parents and 43 exact-text child units and is canonically promoted under its scope-specific decision. Its 16 relationship candidates and all downstream export uses remain separately governed. Next: Retain the approved current-manual scope and track the 16 relationship candidates as a separate review-only backlog item.
- **vm-31 — VM-31 PBR Actuarial Report Requirements:** canonical_complete. The reviewed current 2026 VM-31 package contains 9 structural parents and 75 exact-text child units and is canonically promoted under its scope-specific decision. Its 92 relationship candidates and all downstream export uses remain separately governed. Next: Retain the approved current-manual scope and track the 92 relationship candidates as a separate review-only backlog item.
- **vm-g — VM-G Corporate Governance Requirements for PBR:** canonical_partial. No source package or reviewed source ID for VM-G was found in the tracked POC or current batch manifests. Next: Confirm the authorized 2026 source and process it as a governance-specific chapter.
- **vm-c — VM-C current Actuarial Guidelines appendix and AG mapping:** reviewed_not_canonical. The repository has many AG review artifacts, but no current VM-C appendix package or authoritative mapping package. Next: Obtain/confirm the authorized appendix and map individually processed AGs without inferring legal effect.
- **current-regulatory-tables — Current prescribed valuation, mortality, spread, and default tables:** canonical_promoted_partial_vm20_appendix2. The independently reviewed VM-20 Appendix 2 scope for official Tables A, F, G, H, I, J, and K is canonically promoted with workbook/sheet/cell citations; Tables B-E2 and all non-VM-20 tables remain gaps. Next: Retain the promoted VM-20 scope and continue other table families separately without reconstructing unavailable values.

## P1 assessment

- **vm-02 — VM-02 Nonforfeiture Requirements:** reviewed_not_canonical. VM-02 appears in the supporting-wave plan and reviewed slices but is not canonical. Next: Canonicalize after the P0 manual chapters.
- **vm-50 — VM-50 PBR Experience Reporting:** missing. No canonical package or reviewed source package was found. Next: Confirm current source and add as reporting support.
- **vm-51 — VM-51 PBR Experience Reporting Tables:** missing. No canonical package or reviewed source package was found. Next: Treat as structured reporting/table material.
- **vm-a — VM-A Actuarial Opinion and Memorandum appendix:** reviewed_not_canonical. No canonical package or reviewed source package was found. Next: Confirm current appendix scope and canonicalize with VM-30 cross-references.
- **vm-m — VM-M valuation manual material:** missing. No canonical package or reviewed source package was found. Next: Confirm whether this is in near-term life/annuity scope before intake.
- **vm-v — VM-V valuation manual material:** missing. No canonical package or reviewed source package was found. Next: Confirm whether this is in near-term life/annuity scope before intake.
- **valuation-manual-amendments-current — Current Valuation Manual amendments and change material:** review_artifact_only. No current amendment/redline package is represented in the canonical layer. Next: Inventory authorized current amendments and preserve version/effective-date relationships.
- **valuation-manual-maintenance-agenda — Valuation Manual Maintenance Agenda and amendment proposals:** missing. No canonical package is present; these are useful context but should not be treated as current requirements. Next: Keep proposed material separate and explicitly non-controlling.
- **standard-valuation-law-model-820 — Standard Valuation Law / Model #820:** reviewed_not_canonical. VM-20 citations point to Model #820, but the model law is not represented as a canonical package. Next: Add the authorized model-law source for interpretation and applicability context.
- **annual-statement-pbr-reporting — Annual statement, actuarial opinion, and PBR reporting instructions:** canonical_partial. No structured reporting-instruction package is present. Next: Add only authorized reporting instructions that materially affect valuation answers.

## P2/P3 scope control

- New York regulations, FAQs, practice notes, Law Manual reprints, historical editions, statutory accounting, and jurisdictional deviations are useful supporting material but should not displace completion of current P0 authority.
- Health-specific material is identified as P3 because it is outside the initial US life and annuity focus.
- Tables require a structured-table profile with row/column/version citations; prose chunking must not be used as the primary table representation.

