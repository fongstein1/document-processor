# CIA 2022 Capital and FCT Educational Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

`Practice Notes/222030e.pdf` is a non-binding educational note. It is useful
for review because it describes capital and financial condition testing
guidance for life, P&C, and mortgage insurers, while still staying companion
guidance rather than authoritative regulatory text. The note must stay
review-only and keep the non-binding caveat visible at every layer.

## Source Scope

- Primary source file: `Practice Notes/222030e.pdf`
- Source family: `practice_notes`
- Domain: `canadian_guidance`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-20
- Source status: non-binding practice note
- Source status note: educational note / companion guidance; not authoritative regulatory text
- Companion note posture: implementation guidance for 2022 reporting on capital and financial condition testing

### Boundaries

- Keep planning focused on this single educational note file.
- Do not widen into other educational notes or broader practice-note files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-30, VM-31, AG, and regulation references review-only unless the same batch intentionally includes the referenced operational text.
- Keep the educational-note caveat visible as companion-guidance context, not as authoritative regulatory text.
- Use page locators as the primary citation anchor; line references are not expected for this PDF slice.

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
slices. Each topic family stays review-only until a later promotion decision
is made.

| Topic ID | Section / topic family | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `cia-opening-guidance` | Front matter, introduction, and background guidance | Medium | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | CIA due-process guidance, standards-of-practice references |
| `cia-capital-and-fct-overview` | Capital requirements and FCT overview for 2022 | Medium | regulatory_requirement, reporting_requirement, documentation_expectation, cross_reference_mapping | OSFI, AMF, IFRS 17, capital guideline references |
| `cia-additional-guidance` | Additional guidance, climate, COVID-19, ORSA, reinsurance, and model-use references | High | scenario_or_stochastic_requirement, reinsurance, asset_modeling_judgment, cross_reference_mapping, requires_human_interpretation | OSFI, AMF, ORSA, climate, management actions |
| `cia-appendices-and-closeout` | Appendices A-C and closeout material | Medium | cross_reference_mapping, background_content, caveat_or_companion_guidance, boundary_control_window | OSFI documentation, AMF documentation, CIA guidance |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-206` | Front matter, introduction, and background guidance | 1-6 | Keep the opening educational-note framing together before the main guidance sections begin | Medium |
| `batch-207` | Capital requirements and FCT overview for 2022 | 7-11 | Keep the core capital and FCT overview together as a narrow review-only slice | Medium |
| `batch-208` | Additional guidance, climate, COVID-19, ORSA, reinsurance, and model-use references | 12-16 | Keep the caution-heavy guidance together while preserving the regulatory and modeling boundary | High |
| `batch-209` | Appendices A-C and closeout material | 17-20 | Close the note with the appendix material while keeping the end boundary explicit | Medium |

## Review Standards

### What counts as companion-guidance content

- Explanatory educational-note language that describes how actuaries commonly
  approach capital and financial condition testing.
- Commentary that is useful for review but is explicitly not binding.
- Notes that point to OSFI, AMF, IFRS 17, or CIA material without trying to
  restate the operational text in full.

### What counts as terminology or structure

- Terms, chapter navigation, and boundary-setting language.
- FCT / capital-reporting structure.
- Cross-references that point elsewhere without repeating the operational
  text.

### What requires human actuarial interpretation

- Scenario and model-use judgments.
- Reinsurance, ORSA, climate-risk, and management-action discussion.
- Any language that appears to be a requirement but is not fully operational
  in the excerpt.

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
- no unresolved review flags exist
- no cross-reference ambiguity remains

### App-ready

An extracted item can only become app-ready when it is already eligible for
learner-facing use and the export is sanitized, stable, and versioned for the
app thread.

### RAG-ready

An extracted item can only become RAG-ready when it is approved, source-bound,
and indexed with a stable ID, citation, locator, and review status that no
longer requires human disposition.

## Validation Implications

- Add lightweight validation for `config/cia-2022-capital-fct-educational-note-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well-formed.
- When real batches start, keep
  `scripts/cia-2022-capital-fct-educational-note-batch-definitions.mjs`
  synchronized with the planned batch IDs and section-order splits.
- Add future checks for one-topic-per-batch behavior, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20, VM-21, VM-22, and the other practice-note
  files so the processor stays portable across source families.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact
that should reduce review burden before any controlled educational-note
extraction run begins.
