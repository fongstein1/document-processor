# Controlled Model Regulation XXX Practice Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

`AAA - Model Regulation XXX - Dec 2006.pdf` is companion guidance, not binding
regulatory text. It is useful for implementation review because it discusses
Model Regulation XXX, ASOP 40, X factors, reinsurance, mean reserve handling,
and later questions that reach into AG XXXVIII. The note must stay review-only
and keep the non-binding companion-guidance caveat visible at every layer.

## Source Scope

- Primary source file: `Practice Notes/AAA - Model Regulation XXX - Dec 2006.pdf`
- Source family: `practice_notes`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-18
- Source status: active
- Source status note: non-binding practice note / companion guidance; not authoritative regulatory text
- Companion note posture: implementation guidance for Model Regulation XXX and related practice

### Boundaries

- Keep planning focused on this single practice note file.
- Do not widen into the other Practice Notes files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-A, VM-C, VM-G, VM-M, VM-30, and VM-31
  references review-only unless the same batch intentionally includes the
  referenced operational text.
- Keep ASOP 40 and AG XXXVIII references review-only unless the same batch
  captures the quoted operational language.
- Keep the disclaimer and the non-binding status visible as companion-guidance
  context, not as authoritative regulatory text.
- Use page locators as the primary citation anchor; line references are not
  expected for this PDF slice.

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
| `mrx-front-matter-scope` | Front matter, introduction, purpose/scope, early regulatory requirements, and the first group-life boundary questions | Medium | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | ASOP 40, Model Regulation XXX, VM-20, VM-30, VM-31 |
| `mrx-x-factor-selection` | X-factor selection, classing, credibility, and mortality-distribution / approximation methods | High | regulatory_requirement, definition_or_terminology, calculation_structure, formula_context, requires_human_interpretation | ASOP 40, Model Regulation XXX, VM-20, VM-30, VM-31 |
| `mrx-reinsurance-secondary-guarantee` | Reinsurance, mean reserve / tax reserve handling, substandard policy discussion, and AG XXXVIII / secondary-guarantee questions | High | reinsurance, calculation_structure, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | ASOP 40, AG XXXVIII, VM-20, VM-30, VM-31 |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-192` | Front matter, introduction, purpose/scope, early regulatory requirements, and the first group-life boundary questions | 1-7 | Keep the disclaimer, introduction, early scope guidance, and the first regulatory questions together before the X-factor material begins | Medium |
| `batch-193` | X-factor selection, classing, credibility, and mortality-distribution / approximation methods | 8-12 | Keep the X-factor selection logic and approximation methods together as one narrow review-only slice | High |
| `batch-194` | Reinsurance, mean reserve / tax reserve handling, substandard policy discussion, and AG XXXVIII / secondary-guarantee questions | 13-18 | Close the note with the later reinsurance, reserve, and secondary-guarantee material while keeping the end boundary explicit | High |

## Review Standards

### What counts as companion-guidance content

- Explanatory practice-note language that describes how actuaries commonly
  approach Model Regulation XXX topics.
- Commentary that is useful for review but is explicitly not binding.
- Notes that point to ASOP 40, AG XXXVIII, or other material without trying to
  restate the operational text in full.

### What counts as terminology or structure

- Terms, chapter navigation, and boundary-setting language.
- X-factor classing, credibility, mortality-distribution, and reserve-logic
  structure.
- Cross-references that point elsewhere without repeating the operational
  text.

### What requires human actuarial interpretation

- X-factor selection and class assignment.
- Credibility, approximation, and mortality-distribution judgments.
- Reinsurance distinctions between ceding and assuming company treatment.
- Mean reserve, tax reserve, and secondary-guarantee interpretation choices.
- Any language that appears to be a requirement but is not fully operational
  in the excerpt.

### How to flag cross-references

- Tag references to VM-20, VM-A, VM-C, VM-G, VM-M, VM-30, VM-31, ASOP 40, and
  AG XXXVIII as cross-reference issues when the referenced text is not part of
  the same batch.
- Keep those references in review output only.
- Do not promote a cross-reference into learner-facing content unless the
  operational section is also captured and clearly supports the claim.

### How to handle stale or companion guidance

- Tag repealed, superseded, or companion guidance as review-only support.
- Do not treat companion guidance as the authoritative Model Regulation XXX
  text.
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

- Add lightweight validation for `config/model-regulation-xxx-practice-note-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well-formed.
- When real batches start, keep
  `scripts/model-regulation-xxx-practice-note-batch-definitions.mjs`
  synchronized with the planned batch IDs and section-order splits.
- Add future checks for one-topic-per-batch behavior, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20, VM-21, VM-22, and the other Practice
  Notes files so the processor stays portable across source families.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact
that should reduce review burden before any controlled practice-note
extraction run begins.
