# Controlled LTCI Practice Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

`AAA-LTCI_Practice_Note_5.21.pdf` is companion guidance, not binding
regulatory text. It is useful for implementation review because it discusses
long-term care experience studies, assumption setting, persistency, valuation,
and financial reporting. The note must stay review-only and keep the
non-binding companion-guidance caveat visible at every layer.

## Source Scope

- Primary source file: `Practice Notes/AAA-LTCI_Practice_Note_5.21.pdf`
- Source family: `practice_notes`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-31
- Source status: active
- Source status note: non-binding practice note / companion guidance; not authoritative regulatory text
- Companion note posture: implementation guidance for long-term care insurance

### Boundaries

- Keep planning focused on this single practice note file.
- Do not widen into the other Practice Notes files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-30, VM-31, ASOP 5, ASOP 18, ASOP 23, and
  FASB ASC 944-40 references review-only unless the same batch intentionally
  includes the referenced operational text.
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
| `ltci-experience-assumptions` | Front matter, introduction, experience studies, morbidity, and assumption-setting opener | Medium | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | ASOP 5, ASOP 18, ASOP 23, valuation guidance |
| `ltci-persistency-mortality-investment` | Persistency, mortality, lapse, benefit exhaustion, anti-selection, and investment-return / discounting methods | High | definition_or_terminology, calculation_structure, formula_context, prescribed_assumption, company_or_prudent_estimate_assumption, requires_human_interpretation | ASOP 18, ASOP 23, statutory reserving guidance |
| `ltci-financial-reporting-valuation` | Financial reporting, valuation, reserve calculations, incurred claim reserve discussion, and first-principles / conversion closeout | High | reporting_requirement, documentation_expectation, cross_reference_mapping, background_content, boundary_control_window, requires_human_interpretation | ASOP 5, ASOP 18, FASB ASC 944-40, statutory reserving guidance |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-195` | Front matter, introduction, experience studies, morbidity, and assumption-setting opener | 1-10 | Keep the disclaimer, introduction, morbidity, and early experience-study material together before persistency begins | Medium |
| `batch-196` | Persistency, mortality, lapse, benefit exhaustion, anti-selection, and investment-return / discounting methods | 11-20 | Keep the core assumption-setting and persistency material together as one narrow review-only slice | High |
| `batch-197` | Financial reporting, valuation, reserve calculations, incurred claim reserve discussion, and first-principles / conversion closeout | 21-31 | Close the note with the financial reporting and valuation material while keeping the end boundary explicit | High |

## Review Standards

### What counts as companion-guidance content

- Explanatory practice-note language that describes how actuaries commonly
  approach LTCI experience studies, assumptions, valuation, or reporting.
- Commentary that is useful for review but is explicitly not binding.
- Notes that point to ASOP 5, ASOP 18, ASOP 23, or FASB ASC 944-40 without
  trying to restate the operational text in full.

### What counts as terminology or structure

- Terms, chapter navigation, and boundary-setting language.
- Morbidity, persistency, mortality, lapse, benefit exhaustion, and reserve
  structure.
- Cross-references that point elsewhere without repeating the operational
  text.

### What requires human actuarial interpretation

- Assumption selection and assumption credibility judgments.
- Persistency, mortality, lapse, and anti-selection modeling choices.
- Investment return / discounting judgment.
- Reserve and financial reporting interpretation choices.
- Any language that appears to be a requirement but is not fully operational
  in the excerpt.

### How to flag cross-references

- Tag references to VM-20, VM-21, VM-22, VM-30, VM-31, ASOP 5, ASOP 18,
  ASOP 23, and FASB ASC 944-40 as cross-reference issues when the referenced
  text is not part of the same batch.
- Keep those references in review output only.
- Do not promote a cross-reference into learner-facing content unless the
  operational section is also captured and clearly supports the claim.

### How to handle stale or companion guidance

- Tag repealed, superseded, or companion guidance as review-only support.
- Do not treat companion guidance as the authoritative LTCI text.
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

- Add lightweight validation for `config/ltci-practice-note-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well-formed.
- When real batches start, keep
  `scripts/ltci-practice-note-batch-definitions.mjs`
  synchronized with the planned batch IDs and section-order splits.
- Add future checks for one-topic-per-batch behavior, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20, VM-21, VM-22, and the other Practice
  Notes files so the processor stays portable across source families.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact
that should reduce review burden before any controlled LTCI practice-note
extraction run begins.
