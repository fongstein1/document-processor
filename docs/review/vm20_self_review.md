# VM-20 Remaining Prose and Appendix Self-Review

Overall classification: `reasonable_with_minor_cautions`

The remaining VM-20 wave uses the authoritative current-manual PDF and the
existing hierarchical parent/child source-index path. The source text remains
exactly extracted for review, while summaries, keywords, citations, and review
flags remain generated interpretation metadata. No content was promoted.

## Coverage

- `batch-231`: complete extracted Sections 4 and 5, split at explicit section
  headings.
- `batch-232`: Section 9.A-G, split at explicit subsection headings.
- `batch-233`: Appendix 1.A-G, including economic-scenario descriptions and
  governance text.
- `batch-234`: Appendix 2.A-H prose and table-basis material. Current table
  rows and version metadata remain deferred.

## Quality checks

- Page labels and section locators are retained in the extracted text.
- Parent/child chunking keeps conditions, exceptions, qualifications, formula
  context, and directly associated guidance together where possible.
- The large Section 9.C mortality parent is intentionally retained as one
  structural parent with semantic children; it is a review focus, not a reason
  for global rechunking.
- Appendix scenario descriptions and numerical examples are not generalized
  into unsupported rules.
- Cross-references remain review-only candidates with no inferred legal effect.
- All new material remains review-only, not learner-facing, not app-ready, not
  RAG-ready, and not promoted.

## Open review items

- Confirm exact current wording and page citations against the approved PDF.
- Confirm Section 4/5 formula and aggregation boundaries and Section 9
  assumption interpretation.
- Confirm Appendix 1 scenario labels and external technical-document links.
- Review Appendix 2 prose against the separate current Tables A-K milestone.
- Decide APPROVE, APPROVE WITH FIXES, REPROCESS, or REJECT independently.
