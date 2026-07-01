# Reg-213 Fifth Amendment Extraction Plan

## Source Scope

- Source family: `ny_regulations`
- Jurisdiction: New York
- Primary source file: `NY Regulations/Reg-213-amend5_text.pdf`
- Source reference: `New York State Department of Financial Services Fifth Amendment to 11 NYCRR 103 (Insurance Regulation 213)`
- Working source title: `Regulation 213 Fifth Amendment`
- Source status: certified
- Source status note: the file contains the Fifth Amendment text and a certification page. Keep the amendment text and certification separate, and keep the source review-only.
- Confirmed page range: `pp. 1-2`
- Boundary note: keep the Fifth Amendment separate from the core Regulation 213 wave, the Amendment No. 1 FAQ addendum, the Sixth Amendment addendum, and the other amendment-history PDFs in the same folder unless a later amendment-history plan explicitly opens them.
- Relationship to prior waves: follows `docs/review/reg213_review_index.md` as a Regulation 213 addendum and stays separate from the AG, practice-note, and VM waves.

## Topic Map

The source is compact, but the certification page should stay separate from the amendment text.

1. Footnote revision and amendment text
   - Page range: `p. 1`
   - Goal: capture the Fifth Amendment title, the adoption framing, and the footnote revision that updates the Valuation Manual reference without widening into the certification page.
   - Expected issue types: `state_regulation`, `regulatory_requirement`, `documentation_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`

2. Certification and publication notice
   - Page range: `p. 2`
   - Goal: capture the certification language and publication notice without widening back into the amendment text.
   - Expected issue types: `state_regulation`, `documentation_expectation`, `boundary_control_window`, `requires_human_interpretation`

## Proposed Batch Sequence

- `batch-249`
  - Pages: `1`
  - Topic: footnote revision and amendment text
  - Boundary rationale: keep the amendment title and footnote revision together and stop before the certification page begins.
  - Review complexity: medium
  - Expected unresolved issues: page-image wording backstop, page locators primary, and exact valuation-manual wording
  - Automation fit: same stop conditions as the earlier review-only waves

- `batch-250`
  - Pages: `2`
  - Topic: certification and publication notice
  - Boundary rationale: keep the certification language together and stop at the end of the source.
  - Review complexity: low
  - Expected unresolved issues: certification wording, page-image wording backstop, and final boundary control at the end of the source
  - Automation fit: same stop conditions as the earlier review-only waves

## Review Standards

- `certifiedAmendmentText`: treat the source as certified regulatory text and do not collapse the certification page into the amendment text.
- `stateRegulation`: treat the source as New York regulatory material tied to Regulation 213.
- `regulatoryRequirement`: treat direct references to regulatory duties as mapped regulatory context, but do not promote the amendment into learner-facing or app-ready material.
- `documentationExpectation`: keep incorporated-manual and certification language distinct from explanatory framing.
- `crossReferenceMapping`: keep references to the Valuation Manual and the amended footnote mapped but not over-interpreted.
- `boundaryControlWindow`: keep each page window narrow and review-only.
- `requiresHumanInterpretation`: flag dense or ambiguous amendment wording for human review rather than overclaiming precision.

## Promotion Gates

- Keep every extraction review-only by default.
- Do not mark any item learner-facing unless source citation, source support, wording clarity, confidence, and unresolved-review-flag checks all pass.
- Do not mark any item app-ready until the review-only gate is cleared and a sanitized export is explicitly requested later.
- Do not mark any item RAG-ready until approved indexed material exists and the review disposition no longer needs human review.
- Keep the certified-regulatory-text status explicit in the plan, the batch outputs, and the review handoff.

## Validation Implications

- The plan JSON must exist and parse cleanly.
- The plan markdown must exist and include the expected headings and batch IDs.
- The dedicated batch-definition file must exist and stay synchronized with the plan.
- The planned batches must stay review-only by default.
- The source posture must stay explicitly certified and not promoted.
- The source should remain page-image-backed for exact wording where needed, even though the text layer is readable.
- The source must stay separate from the core Regulation 213 wave, the FAQ addendum, the Sixth Amendment addendum, and the other amendment-history PDFs in the folder.

## Operating Note

- Review-only: `true`
- Source type: certified regulatory amendment text with a separate certification page
- Citation guidance: page locators are the primary anchor; line references are not expected to be stable for this source
- Boundary guidance: keep the amendment text separate from the certification page and from the rest of the amendment-history folder
- Appendix guidance: no separate appendix was identified; the two-page amendment text and certification are the source structure
- Page-image wording backstop: keep it visible for exact title, footnote, and certification wording if later review needs it
