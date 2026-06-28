# AG 29 Extraction Plan

## Source Scope

- Primary source file: `AG 29 - Guideline Concerning Reserves of Companies in Rehabilitation.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXIX`
- Source status: `active`
- Confirmed page range: pages 1-2
- Domain: `naic_regulatory`
- Raw source root: `D:\\Work\\AI Projects\\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 28 is the immediately preceding short guideline and should stay separate.
  - AG 30 remains out of scope for this batch.
  - This guideline addresses reserve interpretation in the rehabilitation context.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page window:

- Pages 1-2: rehabilitation background, reserve interpretation, court-ordered restructuring context, issue-date context, expense-allowance context, and the closing boundary note.

Boundaries and exclusions:

- Keep AG 29 as a single source unit and do not widen into AG 30.
- Keep the page-image wording backstop visible because the text layer is encoded.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag29-rehabilitation-reserve-guidance`
   - Pages 1-2
   - Rehabilitation background, reserve interpretation, issue-date context, expense-allowance context, and the closing boundary note.

## Proposed Batch Sequence

- `batch-111`
  - Page target: pages 1-2
  - Rationale: capture the full two-page guideline as one review-only slice because the rehabilitation caveat, issue-date context, and expense-allowance language belong together.
  - Expected review complexity: medium
  - Expected unresolved issue types: page-image wording confirmation, reserve-method interpretation, cross-reference mapping, caveat-oriented context, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat the reserve-interpreting language as regulatory text when the guideline directs how reserves should be interpreted in rehabilitation.
- `definition_or_terminology`: treat rehabilitation, issue date, surrender restrictions, CRVM, and CARVM references as terminology or context when the text explains rather than directs.
- `cross_reference_mapping`: treat references to the Standard Valuation Law, CRVM, CARVM, and surrender values as cross-reference context unless the text operationalizes them.
- `caveat_or_companion_guidance`: treat the rehabilitation-specific caveats, court-order framing, and issue-date examples as review-only caveat guidance.
- `background_content`: treat the title, scene-setting paragraphs, and explanatory transition language as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-2 window as a review-only slice and do not split it unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoded text layer, rehabilitation-specific reserve interpretation, and issue-date / expense-allowance examples as requiring human review unless the source text is explicit.

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
- The AG 29 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 29 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for rehabilitation-context leakage.

## Operating Note

AG 29 is a review-only active guideline. The text layer is encoded enough that the page image remains the wording backstop. The plan intentionally keeps the two-page file as a single review-only batch so the rehabilitation framing, issue-date discussion, and expense-allowance context stay together.
