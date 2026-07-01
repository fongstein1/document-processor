# Reg-213 Sixth Amendment Extraction Plan

## Source Scope

- Source family: `ny_regulations`
- Jurisdiction: New York
- Primary source file: `NY Regulations/Reg-213-amend6_text.pdf`
- Source reference: `New York State Department of Financial Services proposed Sixth Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Working source title: `Regulation 213 Sixth Amendment`
- Source status: proposed
- Source status note: the file is a proposed amendment text, not final adopted rule text. Keep it review-only and separate from the core Regulation 213 wave and the Amendment No. 1 FAQ addendum.
- Confirmed page range: `pp. 1-1`
- Boundary note: keep the proposed amendment separate from the core Regulation 213 wave, the FAQ addendum, and the other amendment-history PDFs in the same folder unless a later amendment-history plan explicitly opens them.
- Relationship to prior waves: follows `docs/review/reg213_review_index.md` as a Regulation 213 addendum and stays separate from the AG, practice-note, and VM waves.

## Topic Map

The source is a single page, so the topic map stays page-based and review-only.

1. Proposed Sixth Amendment text and footnote revision
   - Page range: `p. 1`
   - Goal: capture the proposed amendment title, the adoption framing, and the footnote revision that incorporates the 2024 Valuation Manual without widening into any other amendment-history file.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`

## Proposed Batch Sequence

- `batch-248`
  - Pages: `1`
  - Topic: proposed Sixth Amendment text and footnote revision
  - Boundary rationale: keep the proposed amendment title, the adoption framing, and the footnote revision together and stop at the end of the page.
  - Review complexity: medium
  - Expected unresolved issues: proposed-amendment status, page-image wording backstop, and final boundary control at the end of the source
  - Automation fit: same stop conditions as the earlier review-only waves

## Review Standards

- `proposedAmendment`: treat the source as proposed regulatory text and do not promote it as adopted rule text without later confirmation.
- `stateRegulation`: treat the source as New York regulatory material tied to Regulation 213.
- `regulatoryRequirement`: treat direct references to regulatory duties as mapped regulatory context, but do not promote the proposed amendment into binding text.
- `documentationExpectation`: keep incorporated-manual and footnote language distinct from explanatory framing.
- `crossReferenceMapping`: keep references to the Valuation Manual and the amended footnote mapped but not over-interpreted.
- `boundaryControlWindow`: keep the page window narrow and review-only.
- `requiresHumanInterpretation`: flag dense or ambiguous amendment wording for human review rather than overclaiming precision.

## Promotion Gates

- Keep every extraction review-only by default.
- Do not mark any item learner-facing unless source citation, source support, wording clarity, confidence, and unresolved-review-flag checks all pass.
- Do not mark any item app-ready until the review-only gate is cleared and a sanitized export is explicitly requested later.
- Do not mark any item RAG-ready until approved indexed material exists and the review disposition no longer needs human review.
- Keep the proposed-amendment status explicit in the plan, the batch outputs, and the review handoff.

## Validation Implications

- The plan JSON must exist and parse cleanly.
- The plan markdown must exist and include the expected headings and batch IDs.
- The dedicated batch-definition file must exist and stay synchronized with the plan.
- The planned batch must stay review-only by default.
- The source posture must stay explicitly proposed and not promoted.
- The source should remain page-image-backed for exact wording where needed, even though the text layer is readable.
- The source must stay separate from the core Regulation 213 wave, the FAQ addendum, and the other amendment-history PDFs in the folder.

## Operating Note

- Review-only: `true`
- Source type: proposed regulatory amendment text with one page
- Citation guidance: page locators are the primary anchor; line references are not expected to be stable for this source
- Boundary guidance: keep the amendment separate from the core Regulation 213 wave and from the rest of the amendment-history folder
- Appendix guidance: no separate appendix was identified; the one-page amendment text is the source structure
- Page-image wording backstop: keep it visible for exact title and footnote wording if later review needs it
