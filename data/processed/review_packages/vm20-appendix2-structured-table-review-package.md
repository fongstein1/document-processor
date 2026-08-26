# VM-20 Appendix 2 Structured Table Review Package

- Status: review-only
- Promoted: no
- Independent review: pending
- Learner/app/RAG/Copilot eligible: no

## Scope

Official workbooks currently linked by the NAIC for VM-20 Tables A, F, G, H, I, J, and K, including all dated sheets carried by those workbooks.

Excluded: Tables B, C, D, E1, and E2 values; other VM tables; prose redesign; embeddings; databases; Copilot implementation; and any table promotion.

## Dataset counts

- Logical tables ingested: 7
- Table versions: 29 (7 current-as-of-retrieval; 22 historical)
- Rows / values / retrieval units: 891 / 7022 / 891

## Current-as-of-retrieval versions

| Table | Version | As-of date | Effective date |
| --- | --- | --- | --- |
| A | `vm20-table-a-effective-2026-06-30` | undated | 2026-06-30 |
| F | `vm20-table-f-2026-07-31` | 2026-07-31 | n/a |
| G | `vm20-table-g-2026-07-31` | 2026-07-31 | n/a |
| H | `vm20-table-h-2026-06-30` | 2026-06-30 | n/a |
| I | `vm20-table-i-2026-06-30` | 2026-06-30 | n/a |
| J | `vm20-table-j-2026-07-31` | 2026-07-31 | n/a |
| K | `vm20-table-k-current-undated` | undated | n/a |

## Explicit unavailable-table boundary

- Table B: The 2026 Valuation Manual describes this table, but the NAIC current-data page did not link a current workbook on the retrieval date; no values were inferred from methodology prose or historical files.
- Table C: The 2026 Valuation Manual describes this table, but the NAIC current-data page did not link a current workbook on the retrieval date; no values were inferred from methodology prose or historical files.
- Table D: The 2026 Valuation Manual describes this table, but the NAIC current-data page did not link a current workbook on the retrieval date; no values were inferred from methodology prose or historical files.
- Table E1: The 2026 Valuation Manual describes this table, but the NAIC current-data page did not link a current workbook on the retrieval date; no values were inferred from methodology prose or historical files.
- Table E2: The 2026 Valuation Manual describes this table, but the NAIC current-data page did not link a current workbook on the retrieval date; no values were inferred from methodology prose or historical files.

## Fidelity and citations

- Source workbooks verified by SHA-256: 5/5
- Exact workbook cells checked: 7022
- Formula-backed structured values: 0
- Legal-disclaimer sheets retained: 5
- Value citations retain workbook URL, sheet, range, row/column source cells, raw value, display value, and number format.
- Methodology citations retain 2026 Manual printed and physical PDF page ranges.

## Retrieval evaluation

- Status: passed
- Cases passed: 15/15
- Supported review-only / unsupported / ambiguous: 11 / 2 / 2
- Production-answer eligible: 0
- The generic resolver uses table identity, version, dimensions, columns, notes, and governance; it does not treat review-only evidence as promoted production evidence.

## Known limitations

- Currentness is bounded to the NAIC current-data page and workbooks retrieved on 2026-08-26; later publications may supersede these versions.
- Table K is undated; it is labeled current-as-of-retrieval based on the official page rather than an inferred workbook date.
- Table A is a workbook labeled with December 2025 data and an explicit June 30, 2026 effective date; currentness is based on the official current-data page plus that effective-date note.
- The official Table J workbook contains both current and long-term swap-spread columns, while Appendix 2 Subsection H describes Table J as long-term; the proof of concept preserves the workbook columns and flags the identity boundary for reviewer confirmation.
- Dedicated legal-disclaimer sheets do not expose disclaimer text as ordinary cells; preservation is by source workbook, hash, and sheet locator.
- Tables B, C, D, E1, and E2 are described in the manual but were not available as current workbooks on the official page and are not reconstructed.
- Table J disclosure applicability beyond the explicit workbook note locations requires independent reviewer confirmation.

## Independent review

Use `data/processed/review_packages/vm20-appendix2-independent-review-prompt.md`.

A reviewer must return APPROVE, APPROVE WITH FIXES, REPROCESS, or REJECT with source-cell evidence. Approval of this review package does not itself promote the dataset; promotion requires a separate recorded decision.
