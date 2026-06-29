# Controlled Life Reinsurance Reserve Credit Practice Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

`AAA - Life_Reinsurance_Reserve_Credit_Practice_Note_Feb_2018.pdf` is
companion guidance, not binding regulatory text. It is useful for
implementation review because it discusses credit for life reinsurance in
U.S. statutory financial statements, valuation impacts, asset adequacy,
certified reinsurers, Dodd-Frank related topics, principle-based reserving,
and AG 48 follow-on questions. The note must stay review-only and keep the
non-binding companion-guidance caveat visible at every layer.

## Source Scope

- Primary source file: `Practice Notes/AAA - Life_Reinsurance_Reserve_Credit_Practice_Note_Feb_2018.pdf`
- Source family: `practice_notes`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-41
- Source status: active
- Source status note: non-binding practice note / companion guidance; not authoritative regulatory text
- Companion note posture: implementation guidance for life reinsurance credit and related reserve treatment

### Boundaries

- Keep planning focused on this single practice note file.
- Do not widen into the other Practice Notes files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-30, VM-31, AG 48, and reinsurance model law / regulation references review-only unless the same batch intentionally includes the referenced operational text.
- Keep the disclaimer and the non-binding status visible as companion-guidance context, not as authoritative regulatory text.
- Use page locators as the primary citation anchor; line references are not expected for this PDF slice.

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
| `lrrc-opening-general-issues` | Front matter, disclaimer, introduction, and general issues opener | Medium | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | credit for reinsurance models, statutory reporting, AG 48, valuation guidance |
| `lrrc-valuation-asset-adequacy` | Valuation, asset adequacy, and related reinsurance-credit issues | High | reporting_requirement, documentation_expectation, calculation_structure, formula_context, cross_reference_mapping, requires_human_interpretation | statutory valuation guidance, asset adequacy analysis, reinsurance model law / regulation |
| `lrrc-certified-reinsurers-dodd-frank` | Certified reinsurers, Dodd-Frank / covered-agreement issues, and related implementation questions | High | jurisdiction_specific_requirement, regulatory_requirement, cross_reference_mapping, background_content, requires_human_interpretation | reinsurance law / regulation, state adoption variants, statutory reporting |
| `lrrc-pbr-ag48-closeout` | Principle-based reserving, AG 48 issues, and closing questions | High | reinsurance, calculation_structure, formula_context, cross_reference_mapping, boundary_control_window, requires_human_interpretation | VM-20, VM-21, VM-22, AG 48, reinsurance model law / regulation |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-198` | Front matter, disclaimer, introduction, and general issues opener | 1-16 | Keep the disclaimer, introduction, and general issues together before the valuation / asset-adequacy material begins | Medium |
| `batch-199` | Valuation and asset adequacy issues | 17-21 | Keep the valuation and asset-adequacy discussion together as one review-only slice | High |
| `batch-200` | Certified reinsurers and Dodd-Frank / covered-agreement issues | 22-31 | Keep the certified-reinsurer and covered-agreement material together before the AG 48 follow-on questions begin | High |
| `batch-201` | Principle-based reserving, AG 48 issues, and closing questions | 32-41 | Close the note with the PBR / AG 48 material while keeping the end boundary explicit | High |

## Review Standards

### What counts as companion-guidance content

- Explanatory practice-note language that describes how actuaries commonly
  approach reinsurance credit, valuation, asset adequacy, or related reporting.
- Commentary that is useful for review but is explicitly not binding.
- Notes that point to AG 48, reinsurance model laws / regulations, or
  valuation guidance without trying to restate the operational text in full.

### What counts as terminology or structure

- Terms, chapter navigation, and boundary-setting language.
- Reinsurance-credit framing, valuation language, asset-adequacy framing, and
  PBR / AG 48 structure.
- Cross-references that point elsewhere without repeating the operational
  text.

### What requires human actuarial interpretation

- Reinsurance-credit treatment and valuation / reserve interpretation choices.
- Certified-reinsurer and Dodd-Frank / covered-agreement judgments.
- PBR and AG 48 follow-on interpretation choices.
- Any language that appears to be a requirement but is not fully operational
  in the excerpt.

### How to flag cross-references

- Tag references to VM-20, VM-21, VM-22, VM-30, VM-31, AG 48, and
  reinsurance model law / regulation material as cross-reference issues when
  the referenced text is not part of the same batch.
- Keep those references in review output only.
- Do not promote a cross-reference into learner-facing content unless the
  operational section is also captured and clearly supports the claim.

### How to handle stale or companion guidance

- Tag repealed, superseded, or companion guidance as review-only support.
- Do not treat companion guidance as the authoritative reinsurance text.
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

- Add lightweight validation for `config/life-reinsurance-reserve-credit-practice-note-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well-formed.
- When real batches start, keep
  `scripts/life-reinsurance-reserve-credit-practice-note-batch-definitions.mjs`
  synchronized with the planned batch IDs and section-order splits.
- Add future checks for one-topic-per-batch behavior, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20, VM-21, VM-22, and the other Practice
  Notes files so the processor stays portable across source families.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact
that should reduce review burden before any controlled life-reinsurance
practice-note extraction run begins.
