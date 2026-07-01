# Reg-213 Fourth Amendment Extraction Plan

## Source Scope

- Source family: `ny_regulations`
- Jurisdiction: New York
- Primary source file: `NY Regulations/Reg-213-amend4_text.pdf`
- Source reference: `New York State Department of Financial Services Fourth Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Working source title: `Regulation 213 Fourth Amendment`
- Source status: certified
- Source status note: the file is the certified Fourth Amendment text with a separate certification page. Keep it review-only and separate from the core Regulation 213 wave and the other amendment addenda.
- Confirmed page range: `pp. 1-3`
- Boundary note: keep the certified amendment text separate from the core Regulation 213 wave, the FAQ addendum, the Fifth Amendment addendum, the Sixth Amendment addendum, and the other amendment-history PDFs in the same folder unless a later amendment-history plan explicitly opens them.
- Relationship to prior waves: follows `docs/review/reg213_review_index.md` as a Regulation 213 addendum and stays separate from the AG, practice-note, and VM waves.

## Topic Map

The source is a three-page amendment, so the topic map stays page-based and review-only.

1. Fourth Amendment text and section updates
   - Page range: `pp. 1-2`
   - Goal: capture the amendment title, the footnote revision, and the section updates together without widening into the certification page or any other amendment-history file.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
2. Certification and publication notice
   - Page range: `p. 3`
   - Goal: capture the certification language together without widening back into the amendment text.
   - Expected issue types: `state_regulation`, `documentation_expectation`, `boundary_control_window`, `requires_human_interpretation`

## Proposed Batch Sequence

- `batch-255`
  - Pages: `1-2`
  - Topic: Fourth Amendment text and section updates
  - Boundary rationale: keep the amendment title, the footnote revision, and the section updates together and stop before the certification page begins.
  - Review complexity: medium
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the boundary before page 3
  - Automation fit: same stop conditions as the earlier review-only waves
- `batch-256`
  - Pages: `3`
  - Topic: Certification and publication notice
  - Boundary rationale: keep the certification language together and stop at the end of the page.
  - Review complexity: low
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the page-3 boundary
  - Automation fit: same stop conditions as the earlier review-only waves

## Review Standards

- `certifiedAmendmentText`: treat the source as certified regulatory text and do not promote it into a separate approved export without later confirmation.
- `stateRegulation`: treat the source as New York regulatory material tied to Regulation 213.
- `regulatoryRequirement`: treat direct obligations, prohibitions, filing rules, and control requirements as regulatory text.
- `documentationExpectation`: keep incorporated-manual and certification language distinct from explanatory framing.
- `crossReferenceMapping`: keep references to the Valuation Manual and the amended footnote mapped but not over-interpreted.
- `boundaryControlWindow`: keep the page windows narrow and review-only.
- `requiresHumanInterpretation`: flag dense or ambiguous amendment wording for human review rather than overclaiming precision.

## Promotion Gates

- Keep every extraction review-only by default.
- Do not mark any item learner-facing unless source citation, source support, wording clarity, confidence, and unresolved-review-flag checks all pass.
- Do not mark any item app-ready until the review-only gate is cleared and a sanitized export is explicitly requested later.
- Do not mark any item RAG-ready until approved indexed material exists and the review disposition no longer needs human review.
- Keep the certified-amendment status explicit in the plan, the batch outputs, and the review handoff.

## Validation Implications

- The plan JSON must exist and parse cleanly.
- The plan markdown must exist and include the expected headings and batch IDs.
- The dedicated batch-definition file must exist and stay synchronized with the plan.
- The planned batches must stay review-only by default.
- The source posture must stay explicitly certified and not promoted.
- The source should remain page-image-backed for exact wording where needed, even though the text layer is readable.
- The source must stay separate from the core Regulation 213 wave, the FAQ addendum, and the other amendment-history PDFs in the folder.

## Operating Note

- Review-only: `true`
- Source type: certified amendment text with a separate certification page
- Citation guidance: page locators are the primary anchor; line references are not expected to be stable for this source
- Boundary guidance: keep the amendment separate from the core Regulation 213 wave and from the rest of the amendment-history folder
- Appendix guidance: no separate appendix was identified; the three-page amendment text is the source structure
- Page-image wording backstop: keep it visible for exact title, footnote, section-update, and certification wording if later review needs it
