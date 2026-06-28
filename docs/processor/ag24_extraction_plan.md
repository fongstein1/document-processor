# AG 24 Extraction Plan

## Source Scope

- Primary source file: `AG 24 - Guideline for Variable Life Non-Forfeiture Values.pdf`
- Source folder: `Actuarial Guidelines`
- Source reference: `Actuarial Guideline XXIV`
- Source status: `active`
- Confirmed page range: pages 1-6
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Relationship to nearby sources:
  - AG 23 is the immediately preceding review-only guideline in the folder.
  - AG 23 separate account investments remains adjacent but out of scope.
  - AG 24 should stay separate from AG 25 and later guideline files.
  - Keep the wave review-only, source-bound, and portable across future source families.

Observed page windows:

- Pages 1-2: title, definitions, retrospective method, and early nonforfeiture / charge framing.
- Pages 3-4: prospective method and the main policy-value / charge structure.
- Pages 5-6: surrender-charge caps, deferred acquisition charges, paid-up nonforfeiture benefits, and the closing boundary.
- page 1 is the opening anchor and page 6 is the closing anchor.

Boundaries and exclusions:

- Keep AG 24 as a single source unit and do not widen into AG 25.
- Keep the page-image wording backstop visible because the text layer is noisy / encoded.
- Keep every output review-only by default.
- Do not produce learner-facing, app-ready, or RAG-ready output.
- Do not promote extracted items without later human review.
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted

## Topic Map

1. `ag24-overview-retrospective`
  - Pages 1-2
  - Title, definitions, valuation rate, net cash surrender value, retrospective method, and the opening charge language.
  - This is the opening slice of the variable life nonforfeiture values guideline.
2. `ag24-prospective-charge-framework`
  - Pages 3-4
  - Prospective method structure, policy-value framing, and the service / administrative / acquisition charge language.
  - Keep the maximum allowable surrender charge wording for the final slice.
3. `ag24-charge-caps-paid-up-benefits`
  - Pages 5-6
  - Maximum allowable surrender charge formulas, deferred acquisition charges, paid-up nonforfeiture benefits, and the closing boundary.
  - The maximum allowable surrender charge and paid-up nonforfeiture benefit language stays review-only.

## Proposed Batch Sequence

- `batch-102`
  - Page target: pages 1-2
  - Rationale: capture the opening definitions and retrospective-method slice before the prospective formulas and charge caps widen the scope.
  - Expected review complexity: medium
  - Expected unresolved issue types: wording confirmation, cross-reference mapping, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches
- `batch-103`
  - Page target: pages 3-4
  - Rationale: capture the prospective method and charge-framework slice while keeping the more formula-heavy charge caps for the final batch.
  - Expected review complexity: high
  - Expected unresolved issue types: formula context, calculation structure, charge framing, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches
- `batch-104`
  - Page target: pages 5-6
  - Rationale: capture the surrender-charge caps, deferred acquisition charges, and paid-up benefits together so the closing boundary stays review-only.
  - Expected review complexity: high
  - Expected unresolved issue types: formula context, charge caps, paid-up-benefit interpretation, boundary control window, requires human interpretation
  - Automation fit: same stop conditions as the earlier review-only guideline batches

## Review Standards

- `regulatory_requirement`: treat express duties, allowances, caps, and required nonforfeiture language as regulatory text.
- `definition_or_terminology`: treat valuation rate, policy value, net cash surrender value, and paid-up nonforfeiture terms as terminology when the text explains rather than directs.
- `reserve_method_structure`: treat retrospective and prospective method framing as structure until the text clearly states a separate duty.
- `calculation_structure`: treat the charge formulas, cash-surrender formula, and paid-up-basis formula as calculation structure until a duty is explicit.
- `formula_context`: treat formula labels, charge caps, and policy-value comparisons as context until interpretation is explicit.
- `prescribed_assumption`: treat stated valuation assumptions, interest-rate references, and table-based assumptions as prescribed when the guideline says they are fixed.
- `company_or_prudent_estimate_assumption`: use this label only when the guideline leaves a choice to the insurer or references company-determined treatment.
- `cross_reference_mapping`: treat references to the Standard Nonforfeiture Law, Sections 5 / 5a / 5c, and the CPI adjustment language as cross-reference context unless the text operationalizes them.
- `background_content`: treat title, framing, and explanatory notes as background unless they impose a requirement.
- `boundary_control_window`: treat each page window as a review-only slice and do not merge the batches together.
- `requires_human_interpretation`: treat the OCR noise, formula-heavy prose, and charge/benefit boundary choices as requiring human review unless the source text is explicit.

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
- The plan markdown must exist and carry the expected headings.
- Every proposed batch must remain review-only by default.
- The source posture must stay explicitly active.
- Each planned batch must have a matching batch definition.
- The shared runner should stay synchronized with the AG 24 batch IDs.
- Future checks should keep the page-image wording backstop visible and watch for charge / benefit boundary leakage.

## Operating Note

AG 24 is a review-only active guideline. The text layer is noisy / encoded, so the page image remains the wording backstop. The plan intentionally keeps the three page windows narrow so the reviewer can inspect each method / charge boundary without widening into AG 25.
