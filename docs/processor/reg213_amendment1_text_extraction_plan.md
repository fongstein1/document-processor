# Reg-213 First Amendment Text Extraction Plan

## Source Scope

- Source family: `ny_regulations`
- Jurisdiction: New York
- Primary source file: `NY Regulations/Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf`
- Source reference: `New York State Department of Financial Services First Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Working source title: `Regulation 213 First Amendment`
- Source status: certified
- Source status note: the file contains the First Amendment text across pages 1-23, and page 24 is the scanned certification and publication page; keep them separate and review-only.
- Confirmed page range: `pp. 1-24`
- Boundary note: keep the certified First Amendment separate from the core Regulation 213 wave, the Amendment No. 1 FAQ, the Second Amendment, the Third Amendment, the Fourth Amendment, the Fifth Amendment, the Sixth Amendment, and the other amendment-history PDFs in the same folder unless a later amendment-history plan explicitly opens them.
- Relationship to prior waves: follows `docs/review/reg213_review_index.md` as a Regulation 213 addendum and stays separate from the AG, practice-note, and VM waves.

## Topic Map

The source is a 24-page amendment with a scanned certification page at the end, so the topic map stays page-based and review-only.

1. Opening text and early section updates
   - Page range: `pp. 1-5`
   - Goal: capture the First Amendment title, authority text, and the early section 103.1 through 103.5 updates without widening into the reserve-method pages.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
2. Section 103.6 reserve-method updates
   - Page range: `pp. 6-11`
   - Goal: capture the reserve-method updates, phase-in changes, and related cross-references without widening into the assumption-mechanics pages.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
3. Section 103.6 account-value and assumption mechanics
   - Page range: `pp. 12-16`
   - Goal: capture the account-value mechanics, assumption mechanics, and related projection rules without widening into the withdrawal mechanics.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
4. Section 103.6 withdrawal and option-value mechanics
   - Page range: `pp. 17-19`
   - Goal: capture the withdrawal mechanics, index assumptions, and option-value floor without widening into the closeout pages.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
5. Factor tables and sections 103.7 / 103.8 closeout
   - Page range: `pp. 20-23`
   - Goal: capture the factor tables and the closeout text for sections 103.7 and 103.8 without widening into the certification page.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
6. Certification and publication notice
   - Page range: `p. 24`
   - Goal: capture the scanned certification and publication notice together without widening back into the closeout text.
   - Expected issue types: `state_regulation`, `documentation_expectation`, `boundary_control_window`, `requires_human_interpretation`

## Proposed Batch Sequence

- `batch-260`
  - Pages: `1-5`
  - Topic: opening text and early section updates
  - Boundary rationale: keep the title, authority text, and early section 103.1 through 103.5 updates together and stop before the reserve-method pages begin.
  - Review complexity: medium
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the boundary before the reserve-method pages
  - Automation fit: same stop conditions as the earlier review-only waves
- `batch-261`
  - Pages: `6-11`
  - Topic: section 103.6 reserve-method updates
  - Boundary rationale: keep the reserve-method updates, phase-in changes, and related cross-references together and stop before the assumption-mechanics pages begin.
  - Review complexity: medium
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the boundary before the account-value mechanics
  - Automation fit: same stop conditions as the earlier review-only waves
- `batch-262`
  - Pages: `12-16`
  - Topic: section 103.6 account-value and assumption mechanics
  - Boundary rationale: keep the account-value mechanics and assumption mechanics together and stop before the withdrawal mechanics begin.
  - Review complexity: high
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the boundary before the withdrawal mechanics
  - Automation fit: same stop conditions as the earlier review-only waves
- `batch-263`
  - Pages: `17-19`
  - Topic: section 103.6 withdrawal and option-value mechanics
  - Boundary rationale: keep the withdrawal mechanics, index assumptions, and option-value floor together and stop before the factor tables and closeout begin.
  - Review complexity: high
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the boundary before the closeout pages
  - Automation fit: same stop conditions as the earlier review-only waves
- `batch-264`
  - Pages: `20-23`
  - Topic: factor tables and sections 103.7 / 103.8 closeout
  - Boundary rationale: keep the factor tables and the closing sections together and stop before the certification page begins.
  - Review complexity: medium
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the boundary before page 24
  - Automation fit: same stop conditions as the earlier review-only waves
- `batch-265`
  - Pages: `24`
  - Topic: certification and publication notice
  - Boundary rationale: keep the scanned certification and publication notice together and end the source at the final page.
  - Review complexity: low
  - Expected unresolved issues: certified-amendment status, page-image wording backstop, and the scanned certification-page boundary
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
- The source must stay separate from the core Regulation 213 wave and from the rest of the amendment-history PDFs in the folder.
- The scanned certification page on page 24 must remain separate from the closeout pages.

## Operating Note

- Review-only: `true`
- Source type: certified amendment text with a scanned certification page on page 24
- Citation guidance: page locators are the primary anchor; line references are not expected to be stable for this source
- Boundary guidance: keep the First Amendment separate from the core Regulation 213 wave and from the rest of the amendment-history folder
- Appendix guidance: no separate appendix was identified; the 24-page amendment text is the source structure
- Page-image wording backstop: keep it visible for exact title, section, phase-in, factor-table, certification, and publication wording if later review needs it
