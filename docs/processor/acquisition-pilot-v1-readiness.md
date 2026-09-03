# Processor v1 batch-readiness assessment

Assessment date: 2026-09-03

Assessment scope: the seven already-acquired, already-admitted pilot payloads described by the external final acquisition manifest. This assessment is review-only. It does not authorize acquisition, canonicalization, promotion, learner-facing use, app export, or RAG indexing.

## Disposition

`PASS_WITH_LIMITATIONS`

The generic processor completed 7/7 admitted sources with 0 processing blocks, 0 unresolved empty-page exceptions, 2,232 deterministic chunks, 9 deterministic workbook table-block evidence records, and 42/42 retrieval smoke tests. A3 was processed as 2,117 PDF pages. The clean result is conditional on the policy and limitations below.

## Readiness gates

| Gate | Result | Evidence / limitation |
| --- | --- | --- |
| Admission and raw SHA lineage | PASS | Every processed record is joined to the approved acquisition record and its external raw SHA. |
| PDF extraction | PASS_WITH_LIMITATIONS | pypdf extracts every page; image-only substantive pages are classified for review, but OCR is not performed. |
| PDF page coverage | PASS | A3 covers 2,117 pages; PDF chunks retain covered page ranges and citations. |
| Empty-page handling | PASS | S1 pages 8, 26, 362, 422, 454, and 460 are zero-content, zero-image `EMPTY_PAGE_BENIGN` pages. |
| PDF structure | PASS_WITH_LIMITATIONS | Deterministic page windows are used where semantic hierarchy is unavailable; no headings are invented. |
| XLSX structure | PASS_WITH_LIMITATIONS | Sheets, visibility state, cells, formulas, displayed values, merged ranges, spacer rows, duplicate labels, and table blocks are retained; visual formatting is not interpreted as authority. |
| Structured evidence identities | PASS | IDs include candidate, sheet, and row range and are unique within the output. |
| Metadata and role preservation | PASS | Issuer, source URL, source family, authority/support role, version, raw path, and SHA are retained. |
| Citation and retrieval smoke tests | PASS | Six tests per source: identity, substantive, structure/table, numeric/form, authority-support boundary, and wrong-source negative. |
| Exception taxonomy | PASS | Required extraction, structure, table, identity, retrieval, lineage, role, metadata, and determinism classes are declared. |
| Determinism | PASS | Stable IDs and deterministic material output are required; reruns must be compared after excluding run metrics. |
| Large-PDF stress | PASS_WITH_LIMITATIONS | A3 completes at 2,117 pages; memory/runtime are environment-dependent and no corpus-scale benchmark is claimed. |
| Human review policy | PASS | All exceptions are reviewed; clean sampling is 20% with a minimum of 5 initially, then 10% with a minimum of 3 after two clean scaled batches. |
| Promotion boundary | PASS | Outputs remain `review_only` / `not_promoted`; no automatic downstream eligibility exists. |

## Configurable review policy

The default governance policy is:

- inspect 100% of automation exceptions and any source with a failed lineage, role, metadata, extraction, structure, table, identity, retrieval, or determinism check;
- inspect a clean stratified sample of 20% with a minimum of 5 sources for the first batches;
- after two clean scaled batches, inspect 10% with a minimum of 3 sources;
- stratify by source family, PDF/XLSX type, authority/support role, page-size band, and structural complexity;
- keep OCR, inferred legal effect, authority upgrades, canonical promotion, learner-facing export, app-ready export, and RAG indexing outside the automatic processor boundary.

## Known boundaries

`EMPTY_PAGE_BENIGN` means only that the page has no extracted text, no PDF content-stream bytes, and no image XObjects. It does not establish legal or substantive irrelevance. `IMAGE_ONLY_SUBSTANTIVE_CONTENT` and `EMPTY_PAGE_REQUIRES_REVIEW` remain human-review exceptions. XLSX table blocks are conservative row-contiguity units, not a claim that every visual table has been semantically understood. Source support roles remain support roles: S1 is redline/change-comparison support, S2 is support rather than law, S3 is a reporting blank rather than reserve authority, S4 is empirical support, A2 is VM-V rate authority within its stated scope, and A4 is a change instrument.

The next-batch proposal is selection-only catalog evidence. It contains no new candidate IDs and no acquisition or processing authorization.
