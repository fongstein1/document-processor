# VM-20 Appendix 2 Structured Table Review Package

- Status: review-only
- Promoted: no
- Independent review: APPROVE WITH FIXES; corrections applied; narrow final review pending
- Learner/app/RAG/Copilot eligible: no

## Promotion blocker corrections

- **Closed - source-average-row-regulatory-eligibility:** All 27 source Average rows are labeled source_summary_statistic, regulatoryValueEligible false, and explicit_source_summary_only in retrieval units.
- **Closed - table-j-manual-workbook-authority-boundary:** Table J columns now carry separate regulatory measure, official workbook association, Manual table identity, and authority disclosure metadata.

- Remaining blockers from the independent review: 0
- Ready for narrow final review: yes
- Promotion decision included: no

## Scope

Official workbooks currently linked by the NAIC for VM-20 Tables A, F, G, H, I, J, and K, including all dated sheets carried by those workbooks.

Excluded: Tables B, C, D, E1, and E2 values; other VM tables; prose redesign; embeddings; databases; Copilot implementation; and any table promotion.

## Dataset counts

- Logical tables ingested: 7
- Table versions: 29 (7 current-as-of-retrieval; 22 historical)
- Rows: 891 (864 prescribed-dimension; 27 source-summary)
- Values / retrieval units: 7022 / 891

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
- Exact workbook cells checked in the accepted independent review and deterministic QA: 7022
- Formula-backed structured values: 0
- Legal-disclaimer sheets retained: 5
- Values retain workbook URL, sheet, range, source cell, raw typed value, display value, number format, unit, and exact-source fidelity.
- Manual methodology and table identity remain distinct from official-workbook values, column labels, and workbook associations.

## Retrieval evaluation

- Status: passed
- Cases passed: 31/31
- Supported review-only / unsupported / ambiguous: 21 / 8 / 2
- Production-answer eligible: 0
- Focused regression: `data/processed/review_packages/vm20-appendix2-promotion-blocker-regression.md`

## Known limitations

- Currentness is bounded to the NAIC current-data page and workbooks retrieved on 2026-08-26; later publications may supersede these versions.
- Table K is undated; it is labeled current-as-of-retrieval based on the official page rather than an inferred workbook date.
- Table A has no invented as-of or publication date; it retains its explicit June 30, 2026 effective date and current-as-of-retrieval status.
- Dedicated legal-disclaimer sheets do not expose disclaimer text as ordinary cells; preservation is by source workbook, hash, and sheet locator.
- Tables B, C, D, E1, and E2 are described in the Manual but were not available as current workbooks on the official page and are not reconstructed.

## Narrow final review

Use `data/processed/review_packages/vm20-appendix2-independent-review-prompt.md`. The prior full audit is accepted; repeat the 7,022-cell comparison only if a source hash or recorded value changed.

The narrow review does not itself promote the dataset. Promotion remains a separate recorded decision.
