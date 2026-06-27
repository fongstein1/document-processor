# Controlled VM-20 Practice Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

The `AAA - VM-20_PN_2020_Version.pdf` practice note is companion guidance,
not binding regulatory text. It is useful for implementation review, but it
explicitly says it is not a promulgation, not an actuarial standard of
practice, and not a definitive statement of generally accepted practice.
That makes it a good next source-bound unit, but only if we keep the work
review-only and preserve the caveat that the note may become obsolete as
practice evolves.

## Source Scope

- Primary source file: `Practice Notes/AAA - VM-20_PN_2020_Version.pdf`
- Source family: `practice_notes`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-115
- Companion note posture: non-binding implementation guidance for VM-20

### Boundaries

- Keep planning focused on this single practice note file.
- Do not widen into the other Practice Notes files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-A, VM-C, VM-G, VM-M, VM-30, and VM-31
  references review-only unless the same batch intentionally includes the
  referenced operational text.
- Keep the practice note disclaimer and obsolescence warning visible as
  companion-guidance context, not as authoritative regulatory text.
- Keep stale, superseded, companion, or implementation guidance as notes
  only.

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
| `vm20-pn-front-matter` | Front matter and Section 1 opener | Medium | background content, non-binding guidance, cross-reference mapping, boundary control window | VM-20, VM-21, VM-22, VM-01, VM-A, VM-C |
| `vm20-pn-common-practice` | Section 2 available information on common practice | Medium | implementation guidance, background content, cross-reference mapping | VM-20, VM-30, VM-31, VM-A, VM-C |
| `vm20-pn-calculation-overview` | Section 3 VM-20 calculation overview | High | calculation structure, formula context, cross-reference mapping | VM-20, VM-30, VM-31, VM-A, VM-C |
| `vm20-pn-npr-overview` | Section 4 NPR overview | High | reserve method structure, formula context, cross-reference mapping | VM-20, VM-30, VM-31, VM-A, VM-C |
| `vm20-pn-dr-overview` | Section 5 deterministic reserve overview | High | reserve method structure, formula context, cross-reference mapping | VM-20, VM-30, VM-31, VM-A, VM-C |
| `vm20-pn-sr-overview` | Section 6 stochastic reserve overview | High | reserve method structure, formula context, cross-reference mapping | VM-20, VM-30, VM-31, VM-G, VM-C |
| `vm20-pn-stochastic-exclusion` | Section 7 stochastic exclusion test | Medium | scenario or stochastic requirement, boundary control window, cross-reference mapping | VM-20, VM-30, VM-31, VM-G, VM-C |
| `vm20-pn-deterministic-exclusion` | Section 8 deterministic exclusion test | Medium | reserve method structure, cross-reference mapping, boundary control window | VM-20, VM-30, VM-31, VM-G, VM-C |
| `vm20-pn-scenario-reserve` | Section 9 difference from cash flow testing - scenario reserve calculation | High | calculation structure, formula context, requires human interpretation | VM-20, VM-30, VM-31, VM-G, VM-C |
| `vm20-pn-valuation-date` | Section 10 other-than-valuation-date considerations | Medium | background content, boundary control window, cross-reference mapping | VM-20, VM-30, VM-31, VM-G |
| `vm20-pn-starting-assets` | Section 11 starting assets and asset modeling | High | asset modeling judgment, formula context, requires human interpretation | VM-20, VM-30, VM-31, VM-G, VM-C |
| `vm20-pn-scenarios-econ` | Section 12 scenarios / scenario generators / economic assumptions | High | scenario or stochastic requirement, formula context, cross-reference mapping | VM-20, VM-30, VM-31, VM-G, VM-C |
| `vm20-pn-prudent-estimate` | Section 13 prudent estimate and anticipated experience assumptions | High | company or prudent estimate assumption, requires human interpretation | VM-20, VM-30, VM-31, VM-G, VM-M |
| `vm20-pn-margins` | Section 14 margins | Medium | company or prudent estimate assumption, requires human interpretation | VM-20, VM-30, VM-31, VM-G, VM-M |
| `vm20-pn-mortality` | Section 15 mortality assumptions | High | prescribed assumption, company or prudent estimate assumption, requires human interpretation | VM-20, VM-30, VM-31, VM-G, VM-M |
| `vm20-pn-premium` | Section 16 premium assumptions | Medium | prescribed assumption, cross-reference mapping, requires human interpretation | VM-20, VM-30, VM-31, VM-G, VM-M |
| `vm20-pn-behavior` | Section 17 policyholder behavior assumptions other than premiums | Medium | company or prudent estimate assumption, requires human interpretation, cross-reference mapping | VM-20, VM-30, VM-31, VM-G, VM-M |
| `vm20-pn-expense` | Section 18 expense assumptions | Medium | company or prudent estimate assumption, documentation expectation, requires human interpretation | VM-20, VM-30, VM-31, VM-G |
| `vm20-pn-nge` | Section 19 non-guaranteed element assumptions | Medium | company or prudent estimate assumption, documentation expectation, cross-reference mapping | VM-20, VM-30, VM-31, VM-G |
| `vm20-pn-reinsurance` | Section 20 treatment of reinsurance | High | reinsurance, cross-reference mapping, requires human interpretation | VM-20, VM-21, VM-22, VM-30, VM-31, VM-G |
| `vm20-pn-hedging` | Section 21 treatment of hedging / derivative programs | High | hedging or risk mitigation, documentation expectation, requires human interpretation | VM-20, VM-21, VM-22, VM-30, VM-31, VM-G |

## Proposed Batch Sequence

| Planned batch | Section / topic | Page target | Rationale | Review complexity |
| --- | --- | --- | --- | --- |
| `batch-055` | Front matter and Section 1 opener | 1-9 | Keep the disclaimer, schematic, and product-coverage opener together before the practice-note implementation sections begin | Medium |
| `batch-056` | Section 2 available information on common practice | 10-10 | Keep the common-practice discussion separate from the calculation overview | Medium |
| `batch-057` | Section 3 VM-20 calculation overview | 11-17 | Capture the calculation overview before the reserve-specific overviews begin | High |
| `batch-058` | Section 4 NPR overview | 18-27 | Keep the NPR overview separate from deterministic and stochastic reserve detail | High |
| `batch-059` | Section 5 deterministic reserve overview | 28-32 | Keep the DR overview separate from the later SR and test sections | High |
| `batch-060` | Section 6 stochastic reserve overview | 33-35 | Keep the SR overview separate from the exclusion tests | High |
| `batch-061` | Section 7 stochastic exclusion test | 36-42 | Keep stochastic exclusion and test language separate from deterministic exclusion | Medium |
| `batch-062` | Section 8 deterministic exclusion test | 43-45 | Keep the deterministic exclusion test separate from the scenario reserve discussion | Medium |
| `batch-063` | Section 9 scenario reserve calculation | 46-48 | Capture the scenario reserve calculation without absorbing the valuation-date timing language | High |
| `batch-064` | Section 10 other-than-valuation-date considerations | 49-50 | Keep the timing / valuation-date discussion separate from starting assets | Medium |
| `batch-065` | Section 11 starting assets and asset modeling | 51-67 | Keep the asset setup and asset-modeling guidance together while stopping before scenario assumptions begin | High |
| `batch-066` | Section 12 scenarios / generators / economic assumptions | 68-72 | Keep the scenario-generation and economic-assumption guidance together as a review-only slice | High |
| `batch-067` | Section 13 prudent estimate and anticipated experience assumptions | 73-76 | Keep the prudent-estimate guidance narrow before the margins section | High |
| `batch-068` | Section 14 margins | 77-81 | Keep the margin discussion separate from the mortality assumptions | Medium |
| `batch-069` | Section 15 mortality assumptions | 82-92 | Keep mortality credibility, tables, and guidance together while stopping before premium assumptions begin | High |
| `batch-070` | Section 16 premium assumptions | 93-94 | Keep the premium-assumption discussion narrow and review-only | Medium |
| `batch-071` | Section 17 policyholder behavior assumptions other than premiums | 95-98 | Keep behavior assumptions and sensitivity language together while stopping before expense assumptions | Medium |
| `batch-072` | Section 18 expense assumptions | 99-100 | Keep expense assumptions separate from the non-guaranteed element discussion | Medium |
| `batch-073` | Section 19 non-guaranteed element assumptions | 101-103 | Keep the NGE assumptions separate from the reinsurance section | Medium |
| `batch-074` | Section 20 treatment of reinsurance | 104-108 | Keep the reinsurance treatment separate from hedging / derivative programs | High |
| `batch-075` | Section 21 treatment of hedging / derivative programs | 109-115 | Close the practice note with the hedge / derivative guidance and stop at the end of the source file | High |

## Review Standards

### What counts as an extracted regulatory requirement

- A statement that imposes a clear duty, prohibition, or required action.
- A reserve rule, test, or control that directly changes calculation or
  eligibility.
- A reporting or documentation requirement when the text is explicit and not
  merely descriptive.

### What counts as implementation or companion guidance

- Explanatory practice-note language that describes how actuaries commonly
  implement VM-20.
- Commentary that is useful for review but is explicitly not binding.
- Notes about how the practice note may become obsolete as practice evolves.

### What counts as terminology or structure

- Terms, chapter navigation, and boundary-setting language.
- Reserve-method structure, calculation structure, and formula context.
- Cross-references that point elsewhere without repeating the operational
  text.

### What requires human actuarial interpretation

- Assumption selection or assumption layering.
- Margin treatment, scenario generation, or hedge treatment.
- Asset assumption interpretation or proxy mapping.
- Reinsurance treatment that depends on actuarial context.
- Any language that appears to be a requirement but is not fully operational
  in the excerpt.

### How to flag cross-references

- Tag references to VM-20, VM-A, VM-C, VM-G, VM-M, VM-21, VM-22, VM-30, and
  VM-31 as cross-reference issues when the referenced section is not part of
  the same batch.
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

- Add lightweight validation for `config/vm20-practice-note-batch-plan.json`.
- Keep `npm run check` aware of the plan file so the scaffold proves the plan
  exists and stays well-formed.
- When real practice-note batches start, keep
  `scripts/vm20-practice-note-batch-definitions.mjs` synchronized with the
  planned batch IDs and section-order splits.
- Add future checks for one-topic-per-batch behavior, cross-reference tagging,
  and no-promotion guardrails.
- Keep the plan separate from VM-20, VM-21, VM-22, and the other Practice
  Notes files so the processor stays portable across source families.

## Operating Note

This plan is intentionally conservative. It is a boundary-control artifact
that should reduce review burden before any controlled practice-note
extraction run begins.
