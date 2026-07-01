# Reg-213 Second Amendment Extraction Plan

## Source Scope

- Source family: `ny_regulations`
- Jurisdiction: New York
- Primary source file: `NY Regulations/Reg-213-11-NYCRR-S103-Amendment-2-nstext-reg213.pdf`
- Source reference: `New York State Department of Financial Services Second Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Working source title: `Regulation 213 Second Amendment`
- Source status: certified
- Source status note: the file is the certified Second Amendment text across pages 1-5 with a separate certification page on page 6. Keep it review-only and separate from the core Regulation 213 wave and the later amendment addenda.
- Confirmed page range: `pp. 1-6`
- Boundary note: keep the certified amendment separate from the core Regulation 213 wave, the Amendment No. 1 FAQ addendum, the Third Amendment, the Fourth Amendment, the Fifth Amendment, the Sixth Amendment, and the other amendment-history PDFs in the same folder unless a later amendment-history plan explicitly opens them.
- Relationship to prior waves: follows `docs/review/reg213_review_index.md` as a Regulation 213 addendum and stays separate from the AG, practice-note, and VM waves.

## Topic Map

The source is a six-page amendment, so the topic map stays page-based and review-only.

1. Second Amendment opening text and section updates
   - Page range: `pp. 1-2`
   - Goal: capture the amendment title, authority text, section 103.3 changes, and the opening 103.5 / 103.6 amendments together without widening into the deeper reserve-method changes.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
2. Section 103.6 reserve-method updates
   - Page range: `pp. 3-5`
   - Goal: capture the reserve-method updates, phase-in changes, and linked actuarial-guideline references together without widening into the certification page.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
3. Certification and publication notice
   - Page range: `p. 6`
   - Goal: capture the certification language together without widening back into the amendment text.
   - Expected issue types: `state_regulation`, `documentation_expectation`, `boundary_control_window`, `requires_human_interpretation`

## Proposed Batch Sequence

- `batch-257`
  - Pages: `1-2`
  - Topic: Second Amendment opening text and section updates
  - Boundary rationale: keep the amendment title, authority text, section 103.3 changes, and the opening 103.5 / 103.6 amendments together and stop before the deeper reserve-method changes begin.
  - Review complexity: medium
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the boundary before the reserve-method updates
  - Automation fit: same stop conditions as the earlier review-only waves
- `batch-258`
  - Pages: `3-5`
  - Topic: Section 103.6 reserve-method updates
  - Boundary rationale: keep the reserve-method updates, phase-in changes, and linked actuarial-guideline references together and stop before the certification page begins.
  - Review complexity: medium
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the boundary before page 6
  - Automation fit: same stop conditions as the earlier review-only waves
- `batch-259`
  - Pages: `6`
  - Topic: Certification and publication notice
  - Boundary rationale: keep the certification language together and stop at the end of the page.
  - Review complexity: low
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the page-6 boundary
  - Automation fit: same stop conditions as the earlier review-only waves

## Review Standards

- `certifiedAmendmentText`: treat the source as certified regulatory text and do not promote it into a separate approved export without later confirmation.
- `stateRegulation`: treat the source as New York regulatory material tied to Regulation 213.
- `regulatoryRequirement`: treat direct obligations, prohibitions, filing rules, and control requirements as regulatory text.
- `documentationExpectation`: keep incorporated-manual and certification language distinct from explanatory framing.
- `crossReferenceMapping`: keep references to the Valuation Manual and the amended sections mapped but not over-interpreted.
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
- The source must stay separate from the core Regulation 213 wave, the FAQ addendum, and the later amendment-history PDFs in the folder.

## Operating Note

- Review-only: `true`
- Source type: certified amendment text with a separate certification page
- Citation guidance: page locators are the primary anchor; line references are not expected to be stable for this source
- Boundary guidance: keep the amendment separate from the core Regulation 213 wave and from the rest of the amendment-history folder
- Appendix guidance: no separate appendix was identified; the six-page amendment text is the source structure
- Page-image wording backstop: keep it visible for exact title, section, phase-in, certification, and publication wording if later review needs it
