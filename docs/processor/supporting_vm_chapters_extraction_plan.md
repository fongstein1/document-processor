# Supporting VM Chapters Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

## Why this exists

The controlled VM-20 sequence proved that the processor can handle narrow,
review-only batches. This supporting-wave plan extends that same boundary
control to the lighter supporting VM chapters so the pipeline can stay
portable across definitions, nonforfeiture rules, reserve requirements, and
reporting / governance material.

This wave is intentionally separate from VM-20 and explicitly excludes VM-21
and VM-22 for now.

This plan is not learner-facing, not app-ready, not RAG-ready, and not promoted.

## Source Scope

- Primary source file: `pbr_data_valuation_manual_2026.pdf`
- Source family: `valuation_manual_pdfs`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`

### Observed chapter windows

| Chapter | Physical pages | Printed pages | Notes |
| --- | --- | --- | --- |
| `VM-01` | `pp. 25-39` | `01-1` through `01-15` | Definitions and introductory material. |
| `VM-02` | `pp. 41-44` | `02-1` through `02-4` | Minimum nonforfeiture mortality and interest. |
| `VM-25` | `pp. 319-320` | `25-1` through `25-2` | Health insurance reserves minimum reserve requirements. |
| `VM-26` | `pp. 321-324` | `26-1` through `26-4` | Credit life and disability reserve requirements. |
| `VM-30` | `pp. 325-339` | `30-1` through `30-15` | Actuarial opinion and memorandum requirements. |
| `VM-31` | `pp. 341-386` | `31-1` through `31-46` | PBR actuarial report requirements. Stops before VM-50 starts on page 387. |

### Boundaries

- Keep planning focused on the lighter supporting VM chapters listed above.
- Do not widen into VM-20.
- Keep VM-21 and VM-22 out of scope for this wave unless separately approved.
- Keep cross-references review-only unless the same batch also captures the
  referenced operational section.
- Keep stale, superseded, repealed, companion, or implementation guidance as
  notes only.

### Exclusions

- No full-document processing.
- No learner-facing content.
- No app-ready exports.
- No RAG-ready exports.
- No approved/promoted exports.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.

## Chapter / Topic Map

| Chapter | Topic | Review complexity | Expected issue types | Cross-reference watchlist | Boundary note |
| --- | --- | --- | --- | --- | --- |
| `VM-01` | Definitions / introductory material | Medium | `definition_scope`, `terminology_alignment`, `cross_reference_mapping` | `AP&P Manual`, `VM-20`, `VM-30`, `VM-31` | Keep definitions review-only when they are only explanatory or cross-referenced. |
| `VM-02` | Minimum nonforfeiture mortality and interest | Medium | `reserve_method_structure`, `nonforfeiture_boundary`, `cross_reference_mapping` | `Model #820`, `VM-01` | Keep the reserve-method structure separate from broader valuation-law discussion. |
| `VM-25` | Health insurance reserves minimum reserve requirements | Low to medium | `applicability_boundary`, `requirement_vs_guidance`, `cross_reference_mapping` | `AP&P Manual`, `Appendix A`, `Appendix C` | Keep the A&H reserve requirements narrow and source-bound. |
| `VM-26` | Credit life and disability reserve requirements | Medium | `contract_reserve_boundary`, `claim_reserve_boundary`, `documentation_scope`, `cross_reference_mapping` | `Model #820`, `VM-01`, `VM-30` | Keep contract reserve and claim reserve language distinct. |
| `VM-30` | Actuarial opinion and memorandum requirements | High | `reporting_requirement`, `documentation_expectation`, `governance_control`, `actuarial_judgment` | `VM-01`, `VM-20`, `VM-31` | Keep the reporting frame separate from detailed opinion / memorandum text. |
| `VM-31` | PBR actuarial report requirements | High | `reporting_requirement`, `documentation_expectation`, `governance_control`, `cross_reference_mapping`, `vm20_boundary` | `VM-20`, `VM-21`, `VM-22`, `VM-30` | Keep VM-21 and VM-22 references review-only and stop before the VM-50 opener. |

## Proposed Batch Sequence

| Planned batch | Chapter(s) | Page target | Rationale | Review complexity | Expected unresolved issue types | VM-20 stop-condition fit |
| --- | --- | --- | --- | --- | --- | --- |
| `batch-013` | `VM-01` | `pp. 25-39` | Close the definitions / introductory chapter before any reporting or reserve-focused supporting chapter. | Medium | definition scope, terminology alignment, cross-reference mapping | Yes |
| `batch-014` | `VM-02` | `pp. 41-44` | Capture the nonforfeiture mortality / interest structure as a separate reserve-method slice. | Medium | reserve method structure, nonforfeiture boundary, cross-reference mapping | Yes |
| `batch-015` | `VM-25` | `pp. 319-320` | Capture the small A&H reserve-requirement chapter on its own so applicability and requirement language stay clear. | Low to medium | applicability boundary, requirement vs guidance, cross-reference mapping | Yes |
| `batch-016` | `VM-26` | `pp. 321-324` | Keep credit life and disability reserve requirements separate from VM-25 and VM-30 reporting text. | Medium | contract reserve boundary, claim reserve boundary, documentation scope, cross-reference mapping | Yes |
| `batch-017` | `VM-30` | `pp. 325-329` | Capture the scope and general requirements layer before the more detailed opinion / memorandum language. | High | reporting requirement, documentation expectation, governance control, cross-reference mapping | Yes, with boundary caution |
| `batch-018` | `VM-30` | `pp. 330-339` | Capture the detailed opinion, memorandum, and retention language after the reporting frame is established. | High | reporting requirement, documentation expectation, actuarial judgment, retention boundary | Yes, with boundary caution |
| `batch-019` | `VM-31` | `pp. 341-354` | Capture the purpose, general requirements, and early report structure before the dense detail block begins. | High | reporting requirement, documentation expectation, governance control, cross-reference mapping | Yes, with boundary caution |
| `batch-020` | `VM-31` | `pp. 355-371` | Capture the core report-detail block covering methods, assumptions, assets, experience studies, and model controls. | High | documentation expectation, cross-reference mapping, model or assumption boundary | Yes, with boundary caution |
| `batch-021` | `VM-31` | `pp. 372-386` | Finish the remaining report detail and stop cleanly before VM-50 starts on page 387. | High | boundary cleanup, cross-reference mapping, valuation-date disclosure | Yes, with boundary caution |

The page windows above are conservative starting points taken from a limited
inspection of the primary PDF. They should still be refined at the batch level
if a narrower boundary is needed before extraction starts.

## Review Standards

| Classification | What belongs here |
| --- | --- |
| Regulatory requirement | Explicit must, shall, or required language that imposes an obligation. |
| Definition or terminology | Terms, glossary material, and term-boundary clarification. |
| Reporting requirement | Filing, submission, or report-content requirements. |
| Documentation expectation | Retention, support-file, narrative, exhibit, or evidence expectations. |
| Governance or control expectation | Oversight, review, assignment, approval, or control language. |
| Cross-reference mapping | References to other chapters, manuals, or documents that do not by themselves establish the full rule. |
| Explanatory or background content | Introductory prose, examples, context, or navigation language. |
| Stale / superseded / repealed / companion / implementation guidance | Non-authoritative or outdated support material that should stay review-only. |
| Requires human actuarial interpretation | Assumptions, margins, model selection, reserve judgment, or boundary cases. |

## Promotion Gates

Everything in this plan remains review-only by default.

### Learner-facing

An extracted item can only become learner-facing when all of the following are
true:

- source citation exists
- source support is clear
- wording is not misleading
- confidence is high
- no unresolved review flags exist
- no cross-reference ambiguity remains

### App-ready

An extracted item can only become app-ready when it is already learner-facing
eligible and the export is sanitized, stable, and versioned for the app thread.

### RAG-ready

An extracted item can only become RAG-ready when it is approved, source-bound,
and indexed with a stable ID, citation, locator, and review status that no
longer requires human disposition.

## Validation Implications

- Add lightweight scaffold validation for `config/supporting-vm-batch-plan.json`
  and `docs/processor/supporting_vm_chapters_extraction_plan.md`.
- Keep the supporting-wave checks aware of the explicit VM-21 / VM-22
  exclusion.
- When extraction starts, extend `scripts/batch-definitions.mjs` with
  `batch-013` onward or generate the batch definitions from this plan config.
- Keep the batch definitions synchronized with the plan so the processor stays
  portable across source families.
- Preserve the same stop conditions used for VM-20 unless a later review finds
  a real schema or workflow gap.

## Operating Note

This plan is a boundary-control artifact, not an extraction run. It exists to
keep the supporting chapter wave review-only until the pipeline is explicitly
authorized to process it.
