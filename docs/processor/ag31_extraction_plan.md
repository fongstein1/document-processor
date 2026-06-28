# AG 31 Extraction Plan

## Source Scope

- Primary source file: `AG 31 - Valuation Issues vs Policy Form Approval.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXXI`
- Source status: `active`
- Confirmed page range: page 1
- Domain: `naic_regulatory`
- Raw source root: `D:\\Work\\AI Projects\\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 30 is the immediately preceding short guideline and should stay separate.
  - AG 32 remains out of scope for this batch.
  - This guideline clarifies that reserve guidance does not imply policy-form approval.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page window:

- Page 1: policy-form approval caveat, annual-statement reserve context, and the closing boundary note.

Boundaries and exclusions:

- Keep AG 31 as a single source unit and do not widen into AG 32.
- Keep the page-image wording backstop visible because the page contains encoding noise.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag31-policy-form-approval-caveat`
   - Page 1
   - Policy-form approval caveat, annual-statement reserve context, and the closing boundary note.

## Proposed Batch Sequence

- `batch-113`
  - Page target: page 1
  - Rationale: capture the full one-page guideline as one review-only slice because the approval caveat and annual-statement reserve context belong together.
  - Expected review complexity: low
  - Expected unresolved issue types: page-image wording confirmation, policy-form approval boundary, annual-statement context, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat the approval-caveat and reserve-language as regulatory text when the guideline directs how the reserve issue should be understood.
- `caveat_or_companion_guidance`: treat the policy-form approval caveat as review-only guidance that should stay separate from any endorsement claim.
- `definition_or_terminology`: treat policy form, benefit, reserve issue, annual statement, and endorsement references as terminology or context when the text explains rather than directs.
- `cross_reference_mapping`: treat references to annual statements, approval status, and appropriate reserves as cross-reference context unless the text operationalizes them.
- `background_content`: treat the title, scene-setting paragraph, and explanatory transition language as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1 window as a review-only slice and do not split it unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoded page, approval caveat, and annual-statement reserve examples as requiring human review unless the source text is explicit.

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
- The AG 31 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 31 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for policy-form approval, annual-statement, and reserve-context leakage.

## Operating Note

AG 31 is a review-only active guideline. The page is encoding-noisy enough that the page image remains the wording backstop. The plan intentionally keeps the one-page file as a single review-only batch so the approval caveat and annual-statement reserve context stay together.
