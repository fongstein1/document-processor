# Controlled Actuarial Memorandum Practice Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

`Actuarial Memorandum Practice Note 01142020.pdf` is companion guidance, not
binding regulatory text. It is useful for implementation review because it
describes content considerations, narrative and technical memorandum
sections, valuation documentation, and appendix references for health actuarial
memoranda. The note must stay review-only and keep the non-binding
companion-guidance caveat visible at every layer.

## Source Scope

- Primary source file: `Practice Notes/Actuarial Memorandum Practice Note 01142020.pdf`
- Source family: `practice_notes`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-37
- Source status: companion-only
- Source status note: exposure draft / non-binding practice note; not authoritative regulatory text
- Companion note posture: implementation guidance for health actuarial memoranda and related reporting

### Boundaries

- Keep planning focused on this single practice note file.
- Do not widen into the other Practice Notes files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-30, VM-31, ASOP 5, ASOP 41, ASOP 45,
  health reserve guidance, and statutory accounting references review-only
  unless the same batch intentionally includes the referenced operational text.
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
| `am-opening-guidance` | Front matter, introduction, and background / scope guidance | Medium | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | ASOP 5, ASOP 41, health memorandum instructions, statutory accounting guidance |
| `am-drafting-content-considerations` | Drafting the memorandum, narrative and technical content considerations, and sample content | High | reporting_requirement, documentation_expectation, definition_or_terminology, cross_reference_mapping, requires_human_interpretation | Annual Statement Instructions, valuation guidance, health reserve guidance |
| `am-judgment-and-reserve-items` | Actuarial judgment, reserve item discussions, unpaid claims / liability line items, and risk-sharing references | High | calculation_structure, formula_context, reporting_requirement, documentation_expectation, cross_reference_mapping, requires_human_interpretation | reinsurance, risk adjustment, ASOP 5, ASOP 23, annual statement detail |
| `am-appendices-and-checklist` | Appendix I ASOP references, Appendix II practice notes / SAPs, and Appendix III checklist | Medium | cross_reference_mapping, background_content, caveat_or_companion_guidance, boundary_control_window | ASOP 5, ASOP 23, ASOP 41, ASOP 45, SSAPs, annual statement instructions |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-202` | Front matter, introduction, and background / scope guidance | 1-8 | Keep the exposure-draft framing and background guidance together before drafting content begins | Medium |
| `batch-203` | Drafting the memorandum, narrative and technical content considerations, and sample content | 9-18 | Keep the drafting guidance together as one narrow review-only slice | High |
| `batch-204` | Actuarial judgment, reserve items, unpaid claims / liability line items, and risk-sharing references | 19-27 | Keep the judgment-heavy content together while preserving the operational reporting boundary | High |
| `batch-205` | Appendix I ASOP references, Appendix II practice notes / SAPs, and Appendix III checklist | 28-37 | Close the note with the appendix material while keeping the end boundary explicit | Medium |

## Review Standards

### What counts as companion-guidance content

- Explanatory practice-note language that describes how actuaries commonly
  approach health actuarial memoranda.
- Commentary that is useful for review but is explicitly not binding.
- Notes that point to ASOPs, statutory accounting principles, or annual
  statement instructions without trying to restate the operational text in
  full.

### What counts as terminology or structure

- Terms, chapter navigation, and boundary-setting language.
- Narrative and technical memorandum structure.
- Cross-references that point elsewhere without repeating the operational
  text.

### What requires human actuarial interpretation

- Narrative sufficiency and disclosure judgments.
- Reserve item interpretation and PDR / claims-liability context.
- Risk-sharing, reinsurance, and risk-adjustment discussion.
- Any language that appears to be a requirement but is not fully operational
  in the excerpt.

### How to flag cross-references

- Tag references to ASOP 5, ASOP 23, ASOP 41, ASOP 45, annual statement
  instructions, health reserve guidance, and statutory accounting principles as
  cross-reference issues when the referenced text is not part of the same
  batch.
- Keep those references in review output only.
- Do not promote a cross-reference into learner-facing content unless the
  operational section is also captured and clearly supports the claim.

### How to handle stale or companion guidance

- Tag repealed, superseded, or companion guidance as review-only support.
- Do not treat companion guidance as the authoritative memorandum text.
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

- Add lightweight validation for `config/actuarial-memorandum-practice-note-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well-formed.
- When real batches start, keep
  `scripts/actuarial-memorandum-practice-note-batch-definitions.mjs`
  synchronized with the planned batch IDs and section-order splits.
- Add future checks for one-topic-per-batch behavior, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20, VM-21, VM-22, and the other Practice
  Notes files so the processor stays portable across source families.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact
that should reduce review burden before any controlled actuarial memorandum
practice-note extraction run begins.
