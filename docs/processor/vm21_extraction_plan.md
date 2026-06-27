# Controlled VM-21 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

VM-21 is the next controlled chapter sequence after VM-20 and the lighter
supporting-wave chapters. The chapter is more mechanically involved than the
supporting material, so this plan keeps the work review-only, narrow, and
source-bound before any batch is executed.

## Source Scope

- Primary source file: `pbr_data_valuation_manual_2026.pdf`
- Source family: `valuation_manual_pdfs`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed VM-21 page range: pages 143-225
- VM-22 begins later and remains out of scope for this wave

### Boundaries

- Keep planning focused on VM-21 only.
- Do not widen into VM-20 during this wave.
- Keep VM-22 out of scope unless separately approved.
- Keep VM-30, VM-31, VM-G, VM-C, and VM-M references review-only unless the
  same batch intentionally includes the referenced operational text.
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

The topic map below keeps the VM-21 wave split into narrow reviewable slices.
Each topic family stays review-only until a later promotion decision is made.

| Topic ID | Topic family | Review complexity | Expected unresolved issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `vm21-background-principles` | Background and principles | Medium | background content, cross-reference mapping, requires human interpretation | VM-20, VM-30, VM-31, VM-G |
| `vm21-scope-phase-in` | Scope and effective date | Medium | regulatory requirement, boundary control window, cross-reference mapping | VM-20, VM-30, VM-31, VM-G |
| `vm21-reserve-methodology` | Reserve methodology and aggregate reserve structure | Medium | reserve method structure, calculation structure, cross-reference mapping | VM-20, VM-30, VM-31, VM-C |
| `vm21-sr-projection-entry` | SR projection entry | High | calculation structure, formula boundary, cross-reference mapping | VM-20, VM-30, VM-31, VM-G |
| `vm21-sr-asset-iteration` | SR asset and iteration mechanics | High | asset modeling judgment, formula context, requires human interpretation | VM-20, VM-30, VM-31, VM-G |
| `vm21-reinsurance-section6-entry` | Reinsurance ceded and Section 6 entry | High | reinsurance, cross-reference mapping, reporting requirement | VM-20, VM-30, VM-31, VM-G |
| `vm21-section6-assumptions` | Section 6 assumptions and cohort mechanics | High | prescribed assumption, company or prudent estimate assumption, formula context | VM-20, VM-30, VM-31, VM-G |
| `vm21-section6-tables` | Section 6 ITM tables and look-ups | High | formula context, boundary control window, requires human interpretation | VM-20, VM-30, VM-31, VM-G |
| `vm21-alt-method-general` | Alternative methodology general layer | High | calculation structure, definition or terminology, cross-reference mapping | VM-C, VM-20, VM-30, VM-31 |
| `vm21-alt-method-tables` | Alternative methodology tables and product characteristics | High | formula context, asset modeling judgment, cross-reference mapping | VM-C, VM-20, VM-30, VM-31 |
| `vm21-scenario-generation` | Scenario generation | High | scenario or stochastic requirement, formula context, cross-reference mapping | VM-20, VM-G, VM-30, VM-31 |
| `vm21-hedging-cdhs` | Hedging under a future non-index credit hedging strategy | High | hedging or risk mitigation, documentation expectation, requires human interpretation | VM-20, VM-G, VM-30, VM-31 |
| `vm21-behavior-assumptions` | Contract holder behavior assumptions | Medium | company or prudent estimate assumption, requires human interpretation, cross-reference mapping | VM-20, VM-30, VM-31 |
| `vm21-mortality-assumptions` | Prudent estimate mortality assumptions | High | prescribed assumption, company or prudent estimate assumption, requires human interpretation | VM-M, VM-20, VM-30, VM-31 |
| `vm21-other-assumptions` | Other guidance and requirements for assumptions | Medium | company or prudent estimate assumption, documentation expectation, requires human interpretation | VM-20, VM-30, VM-31, VM-G |
| `vm21-allocation` | Allocation of aggregate reserves to the contract level | Medium | regulatory requirement, cross-reference mapping, boundary control window | VM-20, VM-30, VM-31 |

## Proposed Batch Sequence

| Planned batch | Purpose | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-022` | VM-21 background and principles | 143-147 | Anchor the chapter frame before scope and mechanics begin | Medium |
| `batch-023` | VM-21 scope and effective date | 148-151 | Lock applicability before reserve methodology begins | Medium |
| `batch-024` | VM-21 reserve methodology | 151-152 | Keep the reserve-method frame separate from later SR mechanics | Medium |
| `batch-025` | VM-21 SR projection entry | 153-159 | Start the SR mechanics with the projection layer and keep the asset context together | High |
| `batch-026` | VM-21 SR asset and iteration mechanics | 160-165 | Separate the SR asset mechanics and iteration logic from the earlier projection layer | High |
| `batch-027` | VM-21 reinsurance ceded and Section 6 entry | 166-170 | Keep reinsurance treatment separate from the downstream prescribed-projection details | High |
| `batch-028` | VM-21 Section 6 assumptions and cohort mechanics | 171-175 | Keep the Section 6 assumption layer narrow and reviewable | High |
| `batch-029` | VM-21 Section 6 ITM tables and look-ups | 176-181 | Finish Section 6 without absorbing the Section 7 opener | High |
| `batch-030` | VM-21 alternative methodology general layer | 182-188 | Open Section 7 without pulling in the factor tables too early | High |
| `batch-031` | VM-21 alternative methodology tables and product characteristics | 189-198 | Keep the calibration-heavy tables separate from Section 8 | High |
| `batch-032` | VM-21 scenario generation | 199-201 | Separate stochastic model setup from the later hedging section | High |
| `batch-033` | VM-21 hedging under a future non-index credit hedging strategy | 202-208 | Keep hedging and documentation expectations review-only | High |
| `batch-034` | VM-21 contract holder behavior assumptions | 209-212 | Keep behavior assumptions and sensitivity concepts narrow and review-only | Medium |
| `batch-035` | VM-21 mortality assumptions | 213-218 | Keep the mortality assumption layer narrow and reviewable before the remaining assumptions cleanup | High |
| `batch-036` | VM-21 other guidance and requirements for assumptions | 218-221 | Finish the assumption guidance without absorbing the final allocation boundary | Medium |
| `batch-037` | VM-21 allocation of aggregate reserves and closing boundary | 222-225 | Close the chapter cleanly and keep VM-22 out of the controlled wave | Medium |

The confirmed page range for VM-21 is pages 143-225, and the sequence above
tracks the source order from the background language through the closing
allocation boundary. The batch windows stay narrow enough that Section 6,
Section 7, scenario generation, hedging, behavior assumptions, mortality
assumptions, and the final allocation layer remain separate review windows.

## Review Standards

### What counts as an extracted regulatory requirement

- A statement that imposes a clear duty, prohibition, or required action.
- A reserve rule or test that directly changes calculation or eligibility.
- A reporting or documentation requirement when the text is explicit and not
  merely descriptive.

### What counts as terminology or structure

- Terms, chapter navigation, and boundary-setting language.
- Reserve-method structure, calculation structure, and formula context.
- Cross-references that point elsewhere without repeating the operational text.

### What requires human actuarial interpretation

- Assumption selection or assumption layering.
- Margin treatment, scenario generation, or hedge treatment.
- Asset assumption interpretation or proxy mapping.
- Reinsurance treatment that depends on actuarial context.
- Any language that appears to be a requirement but is not fully operational in
  the excerpt.

### How to flag cross-references

- Tag references to VM-20, VM-C, VM-G, VM-30, VM-31, or VM-M as
  cross-reference issues when the referenced section is not part of the same
  batch.
- Keep those references in review output only.
- Do not promote a cross-reference into learner-facing content unless the
  operational section is also captured and clearly supports the claim.

### How to handle stale or companion guidance

- Tag repealed, superseded, or companion guidance as review-only support.
- Do not treat companion guidance as the authoritative VM-21 text.
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

- Add lightweight validation for `config/vm21-batch-plan.json`.
- Keep `npm run check` aware of the VM-21 plan file so the scaffold proves the
  plan exists and stays well-formed.
- When real VM-21 batches start, keep `scripts/vm21-batch-definitions.mjs`
  synchronized with the planned batch IDs and section-order splits.
- Add future checks for one-topic-per-batch behavior, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20 and the supporting VM chapters so the
  processor stays portable across source families.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact
that should reduce review burden before any controlled VM-21 extraction run
begins.
