# Reg-213 Amendment No. 1 FAQ Extraction Plan

## Source Scope

- Source family: `ny_regulations`
- Jurisdiction: New York
- Primary source file: `NY Regulations/Reg-213-11-NYCRR-S103-Amendment-1-FAQ.pdf`
- Source reference: `New York State Department of Financial Services Life Bureau Guidance Note on Amendment No. 1 to Insurance Regulation 213`
- Working source title: `Regulation 213 Amendment No. 1 FAQ`
- Source status: companion-only
- Source status note: guidance date is July 21, 2020; the FAQ responses are limited to the questions presented and do not represent a pre-determination of compliance. Keep the source separate from the core Regulation 213 wave.
- Confirmed page range: `pp. 1-3`
- Boundary note: keep the FAQ separate from the core Regulation 213 wave and from the other amendment-history PDFs in the same folder unless a later amendment-history plan explicitly opens them.
- Relationship to prior waves: follows `docs/review/reg213_review_index.md` as a companion-guidance addendum to Regulation 213 and stays separate from the AG, practice-note, and VM waves.

## Topic Map

The FAQ is compact but dense, so the topic map stays page-based and review-only.

1. Opening guidance note, disclaimer language, and early implementation questions
   - Page range: `p. 1`
   - Goal: capture the life bureau guidance note opening, the non-binding caveat, the small company exemption question, the phase-in question, the delay request question, and the timing question without widening into later pages.
   - Expected issue types: `caveat_or_companion_guidance`, `jurisdiction_specific_requirement`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`

2. Grading methodology and reporting / reserve-structure questions
   - Page range: `p. 2`
   - Goal: capture the grading-methodology answer, valuation-interest-rate publication guidance, VM-20 supplement blanks, the AOMR question, Regulation 126 context, and deficiency reserve confirmation.
   - Expected issue types: `caveat_or_companion_guidance`, `regulatory_requirement`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `state_regulation`, `boundary_control_window`, `requires_human_interpretation`

3. Later adoption, phase-in reporting, and hedging closeout
   - Page range: `p. 3`
   - Goal: capture the later-adoption question, the phase-in reporting question, the hedging question, and the end-of-source boundary without widening into any other amendment-history material.
   - Expected issue types: `caveat_or_companion_guidance`, `regulatory_requirement`, `reporting_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`

## Proposed Batch Sequence

- `batch-245`
  - Pages: `1`
  - Topic: opening guidance note, disclaimer language, and early implementation questions
  - Boundary rationale: keep the opening guidance and caveat language together and stop before the grading-methodology page begins.
  - Review complexity: medium
  - Expected unresolved issues: companion-guidance caveat, page-image wording backstop, and the need to keep the opening implementation questions separate from the later methodology questions
  - Automation fit: same stop conditions as the earlier review-only waves

- `batch-246`
  - Pages: `2`
  - Topic: grading methodology and reporting / reserve-structure questions
  - Boundary rationale: keep the grading-methodology and reserve-structure guidance together and stop before the final page begins.
  - Review complexity: high
  - Expected unresolved issues: companion-guidance caveat, page-image wording backstop, cross-reference mapping, and the need to keep the VM-20 / Regulation 126 answers distinct from the later adoption questions
  - Automation fit: same stop conditions as the earlier review-only waves

- `batch-247`
  - Pages: `3`
  - Topic: later adoption, phase-in reporting, and hedging closeout
  - Boundary rationale: keep the closing questions together and end the source at the final page without absorbing any other amendment-history file.
  - Review complexity: medium
  - Expected unresolved issues: companion-guidance caveat, page-image wording backstop, and final boundary control at the end of the source
  - Automation fit: same stop conditions as the earlier review-only waves

## Review Standards

- `caveat_or_companion_guidance`: treat the FAQ as non-binding guidance that helps explain Regulation 213, not as a stand-alone regulation.
- `state_regulation`: treat the source as New York regulatory guidance tied to Regulation 213.
- `jurisdiction_specific_requirement`: flag New York-specific filing, reporting, or implementation language when it appears.
- `regulatory_requirement`: treat direct references to regulatory duties as mapped regulatory context, but do not promote the FAQ itself into binding text.
- `reporting_requirement`: keep filing, reporting, and submission language distinct from background or explanation.
- `documentation_expectation`: keep memorandum, supplement, certification, and recordkeeping language distinct from the explanatory framing.
- `cross_reference_mapping`: keep references to VM-20, VM-21, Regulation 126, and the Valuation Manual mapped but not over-interpreted.
- `background_content`: keep the title and introductory text separate from the answer layer unless the text imposes a duty.
- `boundary_control_window`: keep each page window narrow and review-only.
- `requires_human_interpretation`: flag dense or ambiguous FAQ wording for human review rather than overclaiming precision.

## Promotion Gates

- Keep every extraction review-only by default.
- Do not mark any item learner-facing unless source citation, source support, wording clarity, confidence, and unresolved-review-flag checks all pass.
- Do not mark any item app-ready until the review-only gate is cleared and a sanitized export is explicitly requested later.
- Do not mark any item RAG-ready until approved indexed material exists and the review disposition no longer needs human review.
- Keep the companion-guidance caveat explicit in the plan, the batch outputs, and the review handoff.

## Validation Implications

- The plan JSON must exist and parse cleanly.
- The plan markdown must exist and include the expected headings and batch IDs.
- The dedicated batch-definition file must exist and stay synchronized with the plan.
- Every planned batch must stay review-only by default.
- The source posture must stay explicitly companion-only, not promoted.
- The FAQ should remain page-image-backed for exact wording where needed, even though the text layer is readable.
- The FAQ must stay separate from the core Regulation 213 wave and from the other amendment-history PDFs in the folder.

## Operating Note

- Review-only: `true`
- Source type: text-based PDF guidance note with short Q&A entries
- Citation guidance: page locators are the primary anchor; line references are not expected to be stable for this FAQ
- Boundary guidance: keep the FAQ separate from the core Regulation 213 wave and from the rest of the amendment-history folder
- Appendix guidance: no separate appendix was identified; the FAQ format is the source structure
- Page-image wording backstop: keep it visible for exact question and answer wording if later review needs it

