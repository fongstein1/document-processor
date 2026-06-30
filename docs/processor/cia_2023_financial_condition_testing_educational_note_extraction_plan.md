# CIA 2023 Financial Condition Testing Educational Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

`Practice Notes/223010e.pdf` is a non-binding educational note. It provides
guidance and support for actuaries performing financial condition testing
(FCT) analyses for life and property and casualty insurers. The note is
companion guidance, not authoritative regulatory text, so the companion caveat
must remain visible at every layer.

## Source Scope

- Primary source file: `Practice Notes/223010e.pdf`
- Relative path from received inventory: `Practice Notes/223010e.pdf`
- Source family: `practice_notes`
- Domain: `canadian_guidance`
- Issuing body: Canadian Institute of Actuaries
- Source reference: Canadian Institute of Actuaries educational note, January 2023
- Source status: educational note / non-binding practice note
- Source status note: educational note / companion guidance; not authoritative regulatory text
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-59
- Companion note posture: implementation guidance for financial condition testing

### Boundaries

- Keep planning focused on this single educational note file.
- Do not widen into other practice notes or companion sources in the same folder.
- Keep VM-20, VM-21, VM-22, VM-30, VM-31, AG, and regulation references
  review-only unless a batch intentionally includes the referenced operational
  text.
- Keep the educational-note caveat visible as companion-guidance context, not
  as authoritative regulatory text.
- Use page locators as the primary citation anchor; stable line references are
  not expected for this PDF slice.

### Exclusions

- No full-document processing outside this source file.
- No learner-facing content.
- No app-ready exports.
- No RAG-ready exports.
- No approved/promoted exports.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No other educational note files in the same wave.

## Section / Topic Map

The topic map below keeps the educational note split into narrow reviewable
slices. Each topic family stays review-only until a later promotion decision is
made.

| Topic ID | Section / topic family | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `cia-opening-guidance` | Front matter, introduction, and method overview | Medium | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | CIA due-process guidance, standards-of-practice references |
| `cia-forecast-and-scenarios` | Forecast period, scenarios, and management actions | High | scenario_or_stochastic_requirement, company_or_prudent_estimate_assumption, cross_reference_mapping, requires_human_interpretation | SOP paragraph 2520.15 / 2520.26, reverse stress testing, management actions |
| `cia-modelling-considerations` | Modelling considerations, basic requirements, and enterprise assumptions | Medium | definition_or_terminology, calculation_structure, formula_context, asset_modeling_judgment, cross_reference_mapping | capital ratios, IFRS 17, notes to the financial statements |
| `cia-reporting-and-results` | Reporting guidance, introduction, results, and ORSA coordination | Medium | reporting_requirement, documentation_expectation, governance_or_control_expectation, cross_reference_mapping | OSFI filing directions, ORSA, transfers, consolidated reporting |
| `cia-life-appendix` | Appendix A - life insurers | High | scenario_or_stochastic_requirement, reinsurance, asset_modeling_judgment, cross_reference_mapping, requires_human_interpretation | mortality, morbidity, management actions, climate, technology |
| `cia-pc-appendices-and-closeout` | Appendix B/C - property and casualty insurers and closeout | High | scenario_or_stochastic_requirement, reinsurance, asset_modeling_judgment, cross_reference_mapping, boundary_control_window, requires_human_interpretation | claim frequency and severity, post-event inflation, business volume, reinsurance, solvency standards |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-210` | Front matter, introduction, and method overview | 1-8 | Keep the opening educational-note framing and method overview together before the scenario work begins | Medium |
| `batch-211` | Forecast period, scenarios, and management actions | 9-17 | Keep the forecast horizon, reverse stress testing, going concern framing, and management actions together as one review-only slice | High |
| `batch-212` | Modelling considerations, basic requirements, and enterprise assumptions | 18-23 | Keep the model-design and assumption framework together without widening into reporting or appendices | Medium |
| `batch-213` | Reporting guidance, introduction, results, and ORSA coordination | 24-31 | Keep the reporting and results material together and stop cleanly before the appendix deep dive | Medium |
| `batch-214` | Appendix A - life insurers | 32-45 | Keep the life-insurer risk-category appendix together as the main life-focused caution slice | High |
| `batch-215` | Appendix B/C - property and casualty insurers and closeout | 46-59 | Keep the P&C appendix material and closeout together while preserving the end boundary | High |

## Review Standards

### What counts as companion-guidance content

- Explanatory educational-note language that describes how actuaries commonly
  approach FCT analyses.
- Commentary that is useful for review but is explicitly not binding.
- Notes that point to OSFI, AMF, IFRS 17, or CIA material without trying to
  restate the operational text in full.

### What counts as terminology or structure

- Terms, chapter navigation, and boundary-setting language.
- FCT / reporting structure.
- Cross-references that point elsewhere without repeating the operational text.

### What requires human actuarial interpretation

- Scenario and model-use judgments.
- Reinsurance, ORSA, climate-risk, and management-action discussion.
- Any language that appears to be a requirement but is not fully operational in
  the excerpt.

### How to flag cross-references

- Tag references to OSFI, AMF, IFRS 17, CIA guidance, and reporting
  requirements as cross-reference issues when the referenced text is not part
  of the same batch.
- Keep those references in review output only.
- Do not promote a cross-reference into learner-facing content unless the
  operational section is also captured and clearly supports the claim.

### How to handle stale or companion guidance

- Tag repealed, superseded, or companion guidance as review-only support.
- Do not treat companion guidance as the authoritative reporting text.
- If guidance looks stale or ambiguous, create a review note rather than a
  learner-facing item.

## Promotion Gates

Everything in this plan remains review-only by default.

### Learner-facing

An extracted item can only become learner-facing when all of the following are
true:

- source citation exists
- source support is clear
- wording is not misleading
- confidence is high
- no unresolved review flags remain

### App-ready

An extracted item can only become app-ready when all of the following are true:

- learner-facing gating has already passed
- the wording is stable and concise
- the item can be imported without extra cleanup
- no open source-reference questions remain

### RAG-ready

An extracted item can only become RAG-ready when all of the following are true:

- source citation exists
- source support is clear
- no unresolved review flags remain
- the item is suitable for retrieval with citations

## Validation Implications

- Add lightweight validator checks for the new plan, review index, and
  self-review note.
- Keep the plan portable across future educational-note or companion-guidance
  sources.
- Keep the validation scope aligned with the existing batch registry and
  no-promotion guardrails.
- Continue using page locators as the primary anchor because stable line
  references are not expected for this PDF slice.

## Operating Note

This plan is an intermediate contract only. It does not authorize promotion
and it does not replace the batch review packets. The wave remains review-only
until the tracked handoff artifacts are committed.
