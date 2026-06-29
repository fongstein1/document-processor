# Regulation 141 Extraction Plan

## Source Scope

- source family: ny_regulations
- primary source file: `NY Regulations/Reg-141-11-NYCRR-S128-Reinsurance.pdf`
- source folder: `NY Regulations`
- source title: `Commutation of Reinsurance Agreements`
- source reference: `11 NYCRR Part 128 (Regulation 141)`
- source status: active
- source status note: official compilation snapshot current with amendments included in the source file; live amendment status should be treated as review-only unless separately confirmed.
- domain: naic_regulatory
- raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- confirmed page range: `pages 1-11`
- status: review-only, not learner-facing, not app-ready, not RAG-ready, not promoted
- page locators and line references should be preserved because this is a text-based PDF source.

Observed section windows:

- `reg141-opening-purpose-applicability`, pages 1-3: title page, purpose, and applicability.
- `reg141-definitions-general-provisions-requirements`, pages 4-8: definitions, general provisions, and requirements.
- `reg141-procedures-reporting-boundary`, pages 9-11: procedures, reporting requirements, and closing boundary.

Boundaries:

- Keep Regulation 141 focused on the commutation-of-reinsurance-agreements regulation only.
- Keep AG 55 and the other actuarial-guideline files out of this wave.
- Preserve page locators and line references where available because this is a text-based PDF source.
- Keep the closing reporting window separate so the end of the source remains reviewable.

Exclusions:

- No learner-facing content.
- No app-ready export.
- No RAG-ready export.
- No approved/promoted export.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No AG files in the same wave.

## Topic Map

### Opening title, purpose, and applicability

- pages `1-3`
- review complexity: medium
- expected issue types: `regulatory_requirement`, `background_content`, `reinsurance`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `Insurance Law section 1321`, `impaired insurer`, `insolvent insurer`, `United States branch`, `commutation`
- boundary note: keep the official-compilation header and the purpose/applicability text together and stop before definitions begin.

### Definitions, general provisions, and requirements

- pages `4-8`
- review complexity: high
- expected issue types: `regulatory_requirement`, `definition_or_terminology`, `reinsurance`, `governance_or_control_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `commutation`, `superintendent`, `plan`, `claims`, `obligations`, `article 7`, `Insurance Law section 1321`
- boundary note: keep the definitions and general provisions together as a narrow review-only slice and stop before procedures begins.

### Procedures and reporting closeout

- pages `9-11`
- review complexity: high
- expected issue types: `reporting_requirement`, `documentation_expectation`, `governance_or_control_expectation`, `reinsurance`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- cross-reference watchlist: `submission period`, `superintendent objections`, `loss development schedules`, `financial statements`, `future reporting`
- boundary note: keep the procedures and reporting material together and stop at the end of the source.

## Proposed Batch Sequence

### batch-180

- topic ids: `reg141-opening-purpose-applicability`
- title: Regulation 141 opening title, purpose, and applicability slice
- page target: `1-3`
- rationale: capture the title page, purpose, and applicability guidance as one narrow review-only slice.
- review complexity: medium
- expected issue types: `regulatory_requirement`, `background_content`, `reinsurance`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-181

- topic ids: `reg141-definitions-general-provisions-requirements`
- title: Regulation 141 definitions, general provisions, and requirements slice
- page target: `4-8`
- rationale: capture the definitions, general provisions, and requirement language before the procedures section begins.
- review complexity: high
- expected issue types: `regulatory_requirement`, `definition_or_terminology`, `reinsurance`, `governance_or_control_expectation`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

### batch-182

- topic ids: `reg141-procedures-reporting-boundary`
- title: Regulation 141 procedures and reporting closeout slice
- page target: `9-11`
- rationale: capture the procedures and reporting requirements as the final narrow review-only slice and keep the closing boundary explicit.
- review complexity: high
- expected issue types: `reporting_requirement`, `documentation_expectation`, `governance_or_control_expectation`, `reinsurance`, `cross_reference_mapping`, `boundary_control_window`, `requires_human_interpretation`
- review-only by default: true
- same stop conditions as VM-20: true
- automation fit: same-stop-conditions

## Review Standards

- `regulatoryRequirement`: treat the purpose, applicability, requirements, and reporting instructions as regulatory text when they direct what the company must do.
- `definitionOrTerminology`: treat commutation, insurer, obligations, and plan terms as terminology when the text explains rather than directs.
- `reinsurance`: treat commutation-of-reinsurance-agreements references as reinsurance content when they appear.
- `reportingRequirement`: treat submission and reporting instructions as reporting requirements if they appear.
- `documentationExpectation`: treat supporting-text instructions as documentation expectations if they appear.
- `governanceOrControlExpectation`: treat superintendent-approval and objection language as governance or control expectations if they appear.
- `crossReferenceMapping`: treat references to Insurance Law, article 7, impairment, insolvency, and other statutory provisions as cross-reference context unless operationalized.
- `backgroundContent`: treat the title page and section labels as background unless they impose a requirement.
- `boundaryControlWindow`: treat each page window as review-only and do not widen it unless later cleanup explicitly needs that split.
- `requiresHumanInterpretation`: treat the commutation approval process and any dense legal language as requiring human review unless the source text is explicit.

## Promotion Gates

- default state: review_only
- learner-facing:
  - source citation exists
  - source support is clear
  - wording is not misleading
  - confidence is high
  - no unresolved review flags exist
- app-ready:
  - learner-facing criteria are already satisfied
  - export is sanitized, stable, and versioned
  - no unresolved review issues remain
- rag-ready:
  - approved indexed material only
  - stable ID
  - source reference and locator
  - review status no longer requires human disposition

## Validation Implications

### current checks needed

- Plan file exists and parses as JSON.
- The Regulation 141 plan markdown must exist and carry the expected headings.
- Every planned batch must remain review-only by default.
- The source posture must stay explicitly active, with the official-compilation snapshot noted.
- Each planned batch must have a matching batch definition.
- The Regulation 141 batch definition file must stay synchronized with the plan.
- Page locators and line references should remain visible in the review packet.

### future checks suggested

- Keep the plan portable if later NY-regulation amendments need to be split into a companion wave.
- Keep the review-only guardrails visible until the review index and self-review note are created.

## Operating Note

- This is a text-based PDF source, so page locators are the primary anchor and line references are expected.
- The official-compilation snapshot should remain visible as a review-only caveat rather than a promotion signal.
- Keep the procedures and reporting closeout separate so the source ends at a visible boundary.
