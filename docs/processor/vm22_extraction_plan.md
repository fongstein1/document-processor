# Controlled VM-22 Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

VM-22 is the next controlled chapter sequence after VM-20, the supporting
chapter wave, and VM-21. The chapter is mechanically involved enough that the
work should stay review-only, narrow, and source-bound before any batch is
executed.

## Source Scope

- Primary source file: `pbr_data_valuation_manual_2026.pdf`
- Source family: `valuation_manual_pdfs`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed VM-22 page range: pages 227-318
- VM-25 begins later and remains out of scope except for the closing boundary
  confirmation on page 318

### Boundaries

- Keep planning focused on VM-22 only.
- Keep VM-20 out of scope during this wave.
- Keep VM-21 out of scope during this wave.
- Keep VM-25 and later chapters out of scope; page 318 is only the closing
  boundary before VM-25 begins on page 319.
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
- No VM-25 or later chapter processing except the closing boundary
  confirmation on page 318.

## Chapter / Topic Map

The topic map below keeps the VM-22 wave split into narrow reviewable slices.
Each topic family stays review-only until a later promotion decision is made.

| Topic ID | Topic family | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `vm22-background-scope` | Background, risks, and applicability | Medium | background content, regulatory requirement, cross-reference mapping, boundary control window | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-reserve-methodology` | Reserve methodology and aggregate reserve structure | Medium | reserve method structure, calculation structure, cross-reference mapping, boundary control window | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-projection-entry` | Section 4 projection entry | High | calculation structure, formula context, cross-reference mapping, requires human interpretation | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-asset-projection` | Section 4 asset projection and NAER | High | asset modeling judgment, formula context, requires human interpretation, cross-reference mapping | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-reinsurance` | Reinsurance | High | reinsurance, cross-reference mapping, requires human interpretation | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-standard-projection-overview` | Standard projection amount overview | High | calculation structure, formula context, cross-reference mapping | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-standard-projection-contract-mechanics` | Standard projection contract mechanics | High | prescribed assumption, company or prudent estimate assumption, reinsurance, requires human interpretation | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-standard-projection-lapse-rates` | Standard projection lapse and rate factors | High | prescribed assumption, formula context, boundary control window | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-standard-projection-mortality-tables-1` | Standard projection mortality tables I | High | prescribed assumption, formula context, cross-reference mapping | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-standard-projection-mortality-tables-2` | Standard projection mortality tables II and closing boundary | High | prescribed assumption, formula context, boundary control window, requires human interpretation | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-stochastic-exclusion` | Stochastic exclusion and single scenario testing | High | scenario or stochastic requirement, formula context, cross-reference mapping, requires human interpretation | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-scenario-generation` | Scenario generation | High | scenario or stochastic requirement, formula context, cross-reference mapping | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-hedging-strategy` | Hedging under a future non-index credit hedging strategy | High | hedging or risk mitigation, documentation expectation, requires human interpretation | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-behavior-assumptions` | Contract holder behavior assumptions | Medium | company or prudent estimate assumption, requires human interpretation, cross-reference mapping | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-mortality-assumptions` | Mortality assumptions | High | prescribed assumption, company or prudent estimate assumption, requires human interpretation | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-other-assumptions` | Other assumptions | Medium | company or prudent estimate assumption, documentation expectation, requires human interpretation | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |
| `vm22-allocation` | Allocation of aggregate reserves and closing boundary | Medium | regulatory requirement, cross-reference mapping, boundary control window | VM-20, VM-21, VM-30, VM-31, VM-G, VM-C, VM-M |

## Proposed Batch Sequence

| Planned batch | Purpose | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-038` | VM-22 background, risks, and scope | 227-231 | Anchor the chapter frame and applicability before reserve methodology begins | Medium |
| `batch-039` | VM-22 reserve methodology | 232-237 | Keep the reserve-method frame separate from the later projection mechanics | Medium |
| `batch-040` | VM-22 Section 4 projection entry | 238-242 | Start Section 4 with the projection layer and keep the asset context separate | High |
| `batch-041` | VM-22 Section 4 asset projection and NAER | 243-247 | Separate the asset and iteration logic from the initial projection layer | High |
| `batch-042` | VM-22 reinsurance | 248-250 | Keep the reinsurance treatment separate from the standard projection amount section | High |
| `batch-043` | VM-22 standard projection amount overview | 251-253 | Open Section 6 without absorbing the detailed contract mechanics too early | High |
| `batch-044` | VM-22 standard projection contract mechanics | 254-257 | Keep the Section 6 contract mechanics narrow and review-only | High |
| `batch-045` | VM-22 standard projection lapse and rate factors | 258-261 | Separate lapse and rate-factor rules from the mortality table blocks | High |
| `batch-046` | VM-22 standard projection mortality tables I | 262-267 | Keep the first mortality-table set narrow before the remaining table-heavy pages | High |
| `batch-047` | VM-22 standard projection mortality tables II and closing boundary | 268-279 | Finish Section 6 cleanly and stop before stochastic exclusion tests begin | High |
| `batch-048` | VM-22 stochastic exclusion tests | 280-286 | Keep the stochastic exclusion rules separate from scenario generation | High |
| `batch-049` | VM-22 scenario generation | 287-290 | Separate scenario-generation rules from the hedging strategy section | High |
| `batch-050` | VM-22 hedging under a future non-index credit hedging strategy | 291-297 | Keep hedging and risk-mitigation material review-only and distinct from behavior assumptions | High |
| `batch-051` | VM-22 contract holder behavior assumptions | 298-304 | Keep behavior assumptions separate from mortality and the later assumption guidance | Medium |
| `batch-052` | VM-22 mortality assumptions | 305-308 | Keep mortality credibility and adjustment language separate from the remaining assumption guidance | High |
| `batch-053` | VM-22 other assumptions | 309-313 | Finish the assumption guidance without absorbing the final allocation boundary | Medium |
| `batch-054` | VM-22 allocation of aggregate reserves and closing boundary | 314-318 | Close the chapter cleanly and keep VM-25 and later chapters out of the wave | Medium |

The confirmed page range for VM-22 is pages 227-318, and the sequence above
tracks the source order from the background language through the closing
allocation boundary. The batch windows stay narrow enough that Section 3,
Section 4, Section 5, Section 6, Section 7, scenario generation, hedging,
behavior assumptions, mortality assumptions, and the final allocation layer
remain separate review windows. Page 318 is the last VM-22 page and the next
chapter begins at page 319 with VM-25, which remains out of scope for this
wave.

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

- Tag references to VM-20, VM-21, VM-C, VM-G, VM-30, VM-31, or VM-M as
  cross-reference issues when the referenced section is not part of the same
  batch.
- Keep those references in review output only.
- Do not promote a cross-reference into learner-facing content unless the
  operational section is also captured and clearly supports the claim.

### How to handle stale or companion guidance

- Tag repealed, superseded, or companion guidance as review-only support.
- Do not treat companion guidance as the authoritative VM-22 text.
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

- Add lightweight validation for `config/vm22-batch-plan.json`.
- Keep `npm run check` aware of the VM-22 plan file so the scaffold proves the
  plan exists and stays well-formed.
- When real VM-22 batches start, keep `scripts/vm22-batch-definitions.mjs`
  synchronized with the planned batch IDs and section-order splits.
- Add future checks for one-topic-per-batch behavior, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20, VM-21, and the supporting VM chapters so
  the processor stays portable across source families.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact
that should reduce review burden before any controlled VM-22 extraction run
begins.
