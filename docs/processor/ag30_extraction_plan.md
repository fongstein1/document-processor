# AG 30 Extraction Plan

## Source Scope

- Primary source file: `AG 30 - Guideline for the Application of Plan Type to Guaranteed Interest Contracts (GICs) With Benefit Responsive Payment Provisions Used to Fund Emp.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXX`
- Source status: `active`
- Confirmed page range: pages 1-2
- Domain: `naic_regulatory`
- Raw source root: `D:\\Work\\AI Projects\\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 29 is the immediately preceding short guideline and should stay separate.
  - AG 31 remains out of scope for this batch.
  - This guideline addresses plan type treatment for benefit-responsive GICs used to fund employee benefit plans.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page window:

- Pages 1-2: plan-type background, benefit-responsive GIC payment provisions, C-3 risk reduction, insurer administration, periodic review, and the closing boundary note.

Boundaries and exclusions:

- Keep AG 30 as a single source unit and do not widen into AG 31.
- Keep the page-image wording backstop visible because the first page contains encoding noise.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag30-plan-type-gic-guidance`
   - Pages 1-2
   - Plan-type background, benefit-responsive GIC payment provisions, C-3 risk reduction, insurer administration, periodic review, and the closing boundary note.

## Proposed Batch Sequence

- `batch-112`
  - Page target: pages 1-2
  - Rationale: capture the full two-page guideline as one review-only slice because the plan-type framing, C-3 risk discussion, and control language belong together.
  - Expected review complexity: medium
  - Expected unresolved issue types: page-image wording confirmation, plan-type assumption boundary, governance/control context, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat the withdrawal-treatment language as regulatory text when the guideline directs how benefit-responsive GIC withdrawals should be interpreted.
- `definition_or_terminology`: treat plan type, policyholder, benefit-responsive payment provisions, C-3 risk, and certificate-of-intent references as terminology or context when the text explains rather than directs.
- `cross_reference_mapping`: treat references to the Standard Valuation Law, C-3 risk, plan provisions, and insurer administration as cross-reference context unless the text operationalizes them.
- `governance_or_control_expectation`: treat the certificate-of-intent and administration language as governance or control expectation guidance that should remain review-only unless later confirmation makes it operational.
- `company_or_prudent_estimate_assumption`: treat the plan-type assumption and periodic experience review language as assumption-setting context that requires human review before promotion.
- `background_content`: treat the title, scene-setting paragraphs, and explanatory transition language as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-2 window as a review-only slice and do not split it unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoded first page, plan-type application, and C-3-risk administration examples as requiring human review unless the source text is explicit.

## Promotion Gates

- Default state: `review_only`
- Learner-facing criteria:
  - source citation exists
  - source support is clear
  - wording is not misleading
  - confidence is high
  - no unresolved review flags exist
- App-ready criteria:
  - learner-facing criteria are already satisfied
  - export is sanitized, stable, and versioned
  - no unresolved review issues remain
- RAG-ready criteria:
  - approved indexed material only
  - stable ID
  - source reference and locator
  - review status no longer requires human disposition

## Validation Implications

- The plan file must exist and parse as JSON.
- The AG 30 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 30 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for plan-type, policyholder, and control-boundary leakage.

## Operating Note

AG 30 is a review-only active guideline. The opening page is encoding-noisy enough that the page image remains the wording backstop. The plan intentionally keeps the two-page file as a single review-only batch so the plan-type framing, C-3 risk discussion, and insurer-administration context stay together.
