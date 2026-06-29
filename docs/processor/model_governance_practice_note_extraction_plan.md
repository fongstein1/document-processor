# Controlled Model Governance Practice Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

`AAA - Model_Governance_PN_042017.pdf` is companion guidance, not binding
regulatory text. It is useful for implementation review because it discusses
model governance, model risk, controls, validation, and documentation for
practicing life actuaries implementing and overseeing PBR. The full title
`Model Governance: Some Considerations for Practicing Life Actuaries` is
kept visible here because the note is explicitly non-binding, so the
extraction work must stay review-only and keep the companion-guidance caveat
visible.

## Source Scope

- Primary source file: `Practice Notes/AAA - Model_Governance_PN_042017.pdf`
- Source family: `practice_notes`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-18
- Source status: active
- Source status note: companion guidance / implementation guidance; non-binding and not authoritative regulatory text
- Companion note posture: implementation guidance for model governance and PBR

### Boundaries

- Keep planning focused on this single practice note file.
- Do not widen into the other Practice Notes files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-A, VM-C, VM-G, VM-M, VM-30, and VM-31
  references review-only unless the same batch intentionally includes the
  referenced operational text.
- Keep ASOP references review-only unless the same batch captures the quoted
  operational language.
- Keep the disclaimer and the non-binding status visible as companion-guidance
  context, not as authoritative regulatory text.

### Exclusions

- No full-document processing outside this source file.
- No learner-facing content.
- No app-ready exports.
- No RAG-ready exports.
- No approved/promoted exports.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No other Practice Notes files in the same wave.

## Section / Topic Map

The topic map below keeps the practice note split into narrow reviewable
slices. Each topic family stays review-only until a later promotion decision
is made.

| Topic ID | Section / topic family | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `mg-front-matter-intro` | Front matter, introduction, model, and model development opener | Medium | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | ASOP 41, ASOP 7, ASOP 11, VM-20, VM-30, VM-31 |
| `mg-governance-controls` | Model governance policy and standards, model risk, model governance, processes, controls, and validation | High | governance_or_control_expectation, documentation_expectation, cross_reference_mapping, requires_human_interpretation | ASOP 41, ASOP 7, ASOP 21, VM-20, VM-30, VM-31 |
| `mg-validation-documentation` | Validation-governance relationship, documentation, references, and definitions | Medium | documentation_expectation, definition_or_terminology, cross_reference_mapping, boundary_control_window, requires_human_interpretation | ASOP 41, ASOP 7, VM-20, VM-30, VM-31 |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-183` | Front matter and introduction / model-development opener | 1-7 | Keep the disclaimer, introduction, model definition, and early model-development material together before the governance sections begin | Medium |
| `batch-184` | Model governance policy, model risk, governance, controls, and validation | 8-14 | Keep the governance and control guidance together as one narrow companion-guidance slice | High |
| `batch-185` | Validation-governance relationship, documentation, references, and definitions | 15-18 | Close the source with the documentation and definitions material while keeping the end boundary explicit | Medium |

## Review Standards

### What counts as companion-guidance content

- Explanatory practice-note language that describes how actuaries commonly
  implement model governance.
- Commentary that is useful for review but is explicitly not binding.
- Notes about how the practice note may become obsolete as practice evolves.

### What counts as terminology or structure

- Terms, chapter navigation, and boundary-setting language.
- Governance structure, control structure, validation structure, and
  documentation structure.
- Cross-references that point elsewhere without repeating the operational
  text.

### What requires human actuarial interpretation

- Governance control selection and role assignment.
- Model risk ranking and classification.
- Validation frequency, testing approach, and documentation audience choice.
- Any language that appears to be a requirement but is not fully operational
  in the excerpt.

### How to flag cross-references

- Tag references to VM-20, VM-A, VM-C, VM-G, VM-M, VM-30, VM-31, and the
  ASOP references as cross-reference issues when the referenced text is not
  part of the same batch.
- Keep those references in review output only.
- Do not promote a cross-reference into learner-facing content unless the
  operational section is also captured and clearly supports the claim.

### How to handle stale or companion guidance

- Tag repealed, superseded, or companion guidance as review-only support.
- Do not treat companion guidance as the authoritative VM-20 text.
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

- Add lightweight validation for `config/model-governance-practice-note-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well-formed.
- When real batches start, keep
  `scripts/model-governance-practice-note-batch-definitions.mjs`
  synchronized with the planned batch IDs and section-order splits.
- Add future checks for one-topic-per-batch behavior, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20, VM-21, VM-22, and the other Practice
  Notes files so the processor stays portable across source families.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact
that should reduce review burden before any controlled practice-note
extraction run begins.
