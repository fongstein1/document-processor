# Review Packet: review-packet-demo-001

## Batch Summary

- Batch ID: sample-batch-001
- Review mode: exception_first
- Batch name: Contract demo batch
- Source families: valuation_manual_pdfs, pricing_ratebooks_demo
- Processing intent: Small pilot contract fixture with mixed-domain demo sources.
- Source file count: 2
- Extracted item count: 2
- Exception count: 2

## Source Files Processed

| sourceId | filename | source family | document type | status | notes |
| --- | --- | --- | --- | --- | --- |
| vm26-manual | pbr_data_valuation_manual_2026.pdf | valuation_manual_pdfs | valuation_manual | extracted | One citation issue flagged for human review. |
| pricing-ratebook-demo | sample_ratebook_2026.xlsx | pricing_ratebooks_demo | pricing_ratebook | extracted | Future-domain portability fixture. |

## Extracted Items

- chunk-vm26-0001: Mock summary for validation only. Review flags: needs_human_review.
- chunk-ratebook-0001: Mock pricing summary for validation only. Review flags: needs_human_review, citation_pending.

## Required Human Decisions

- decision-001: Should the NAIC item keep its current page and section reference format?
- decision-002: Should the pricing fixture stay review-only until real pricing sources are added?

## Exceptions/Flags

- flag-001: Placeholder citation should be replaced with source-verified locator before promotion.
- flag-002: Pricing example is intentionally synthetic and should remain review-only.

## Citation/Source-Reference Issues

- citation-001: Placeholder page and section reference need source verification.
- citation-002: Synthetic pricing fixture does not have a real source reference.

## Unresolved Issues

- issue-001: The NAIC demo item still uses a placeholder page-range citation.
- issue-002: The pricing fixture is synthetic and not tied to a real source workbook.

## Promotion Recommendation

- Status: review_candidate
- Reason: The demo illustrates the review workflow but contains no approved learner-facing material.
- Recommended next step: Confirm citation handling and then move on to a real pilot batch.
- Target export: review_packet

## RAG Readiness

- Ready: false
- Indexable item count: 0
- Notes: Stable IDs and review flags are present, but approval is intentionally blocked.

## App Export Readiness

- Ready: false
- Notes: App export remains blocked until real source review is completed.

## Not Approved / Learner-facing Status

- Learner-facing status: not approved
- Learner-facing ready: false
- Reason: Not approved for learner-facing use.
- Status text: not approved

## Reviewer Notes

Mock review packet for contract validation only.
