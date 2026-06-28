# AG 32 Extraction Plan

## Source Scope

- Primary source file: `AG 32 - Reserve for Immediate Payment of Claims.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXXII`
- Source status: `active`
- Confirmed page range: pages 1-2
- Domain: `naic_regulatory`
- Raw source root: `D:\\Work\\AI Projects\\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 31 is the immediately preceding short guideline and should stay separate.
  - AG 33 remains out of scope; page 3 begins AG 33 modifications for non-elective incidence rates.
  - This guideline clarifies reserve treatment for immediate payment of claims.
  - Keep this wave review-only, source-bound, and portable across future source families.

Observed page windows:

- Page 1: background material, reserve rationale, annual statement references, and immediate-payment context.
- page 2: reserve percentage adjustments and the closing boundary note.

Boundaries and exclusions:

- Keep AG 32 as a single source unit and do not widen into page 3 or AG 33.
- Keep the page-image wording backstop visible because the text layer is encoded/noisy.
- Keep the immediate-payment reserve context explicit in every batch artifact.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag32-immediate-payment-of-claims-reserve-guidance`
   - Pages 1-2
   - Immediate payment of claims reserve guidance, curtate reserve adjustments, and the closing boundary note.

## Proposed Batch Sequence

- `batch-114`
  - Page target: pages 1-2
  - Rationale: capture the full two-page guideline as one review-only slice because the immediate-payment reserve context and percentage adjustment language belong together.
  - Expected review complexity: medium
  - Expected unresolved issue types: regulatory_requirement, caveat_or_companion_guidance, definition_or_terminology, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat reserve-language as regulatory text when the guideline directs how immediate-payment claims reserves should be understood.
- `caveat_or_companion_guidance`: treat the immediate-payment reserve guidance as review-only guidance that should stay separate from any endorsement or product-approval claim.
- `definition_or_terminology`: treat immediate payment of claims, curtate reserves, continuous or semi-continuous functions, annual statement, policy year, and proof of death references as terminology or context when the text explains rather than directs.
- `cross_reference_mapping`: treat references to Section 5 reserve valuation, annual statement instructions, death-claim timing, and AG 33 modifications as cross-reference context unless the text operationalizes them.
- `background_content`: treat the title, scene-setting paragraph, and percentage-table introduction as background unless they impose a requirement.
- `boundary_control_window`: treat the page 1-2 window as a review-only slice and do not split it unless a later cleanup pass explicitly needs that split.
- `requires_human_interpretation`: treat the encoded page, reserve-adjustment examples, and boundary note as requiring human review unless the source text is explicit.

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
- The AG 32 plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The AG 32 batch definition file must stay synchronized with the plan.
- Future checks should keep the page-image wording backstop visible and watch for immediate-payment, annual-statement, and AG 33 boundary leakage.

## Operating Note

AG 32 is a review-only active guideline. The page image remains the wording backstop because the text layer is noisy. The plan intentionally keeps the two-page file as a single review-only batch so the immediate-payment reserve context stays together and page 3 can remain reserved for AG 33.
