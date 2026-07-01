# Life & Health Valuation Law Manual Opening Sections Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why This Exists

`lhmanual26.pdf` is the 2026 Life & Health Valuation Law Manual compiled by
the American Academy of Actuaries. It is a large reference compilation that
reprints and organizes valuation-manual, regulatory, and guideline material.
This opening wave stays narrow and review-only so the manual can be handled as
reference material rather than as a promotion candidate.

## Source Scope

- Primary source file: `lhmanual26.pdf`
- Relative path from received inventory: `lhmanual26.pdf`
- Full local path: `C:\Dev\NAIC Valuation Manual Course\NAIC Valuation Regulation\lhmanual26.pdf`
- Source family: `valuation_manual_pdfs`
- Domain: `naic_regulatory`
- Issuing body: American Academy of Actuaries
- Source reference: American Academy of Actuaries Life & Health Valuation Law Manual, Thirty-second Edition 2026
- Source status: reference manual / non-binding compilation
- Source status note: compiled reference material; keep the copyright and permission language visible as context
- Raw source root: `C:\Dev\NAIC Valuation Manual Course\NAIC Valuation Regulation`
- Confirmed page range: pages 1-30
- Source identity: opening pages, preface, annual filings, and valuation-related letters before the Valuation Manual section begins
- Manual posture: review-only reference material for valuation-law orientation

### Source Structure

- Page 1 is the title and reprint permission page.
- Pages 2-3 are the table of contents.
- Section 1 covers the preface on pages 4-8.
- Section 2 covers annual filings on pages 9-30.
- Section 3 begins on page 31 and is out of scope for this wave.

### Boundaries

- Keep planning focused on this single manual file.
- Do not widen into Section 3 or the much larger downstream sections in this wave.
- Treat the manual as a reference compilation, not as binding regulatory text.
- Use page locators as the primary citation anchor; line references are not expected for this PDF slice.
- Keep a page-image wording backstop visible because the opening pages carry copyright and TOC wording that should not be overclaimed from the text layer.

### Exclusions

- No full-document processing outside pages 1-30.
- No learner-facing content.
- No app-ready exports.
- No RAG-ready exports.
- No approved/promoted exports.
- No eLearning scripts, slides, quizzes, or app exports.
- No raw source files in Git.
- No widening into Section 3 or later manual sections in this wave.

## Section / Topic Map

The topic map below keeps the opening pages split into narrow reviewable
slices. Each topic family stays review-only until a later promotion decision
is made.

| Topic ID | Section / topic family | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `lhmanual26-front-matter` | Title page, copyright notice, table of contents, and preface heading | Medium | background_content, documentation_expectation, boundary_control_window, cross_reference_mapping | Academy copyright notice, NAIC permission language, Section 1, Section 2 |
| `lhmanual26-preface` | Section 1 preface and copyright / permissions text | Medium | background_content, documentation_expectation, cross_reference_mapping, boundary_control_window, requires_human_interpretation | 1.1 Background, 1.2 NAIC Activities, 1.3 Authors and Peer Reviewers, 1.4 Disclaimer, 1.5 Copyrights and Permissions |
| `lhmanual26-annual-filings` | Section 2 annual filings and state contact information | Medium-High | documentation_expectation, jurisdiction_specific_requirement, cross_reference_mapping, boundary_control_window, requires_human_interpretation | RAAIS Filing Guide, state contact information, NAIC filing webpage |
| `lhmanual26-valuation-letters` | Section 2 valuation-related letters issued by various states | High | jurisdiction_specific_requirement, documentation_expectation, cross_reference_mapping, boundary_control_window, requires_human_interpretation | California letter, New York guidance, Rhode Island guidance, annual-filing notices |

## Proposed Batch Sequence

The next planned batch IDs continue after the current validated batch frontier.
Each batch remains review-only by default.

| Batch ID | Pages / section | Boundary rationale | Expected complexity | Expected unresolved issues | Auto-process safe? |
| --- | --- | --- | --- | --- | --- |
| `batch-251` | pp. 1-8 | Keep the title page, copyright notice, TOC, and preface heading together as the opening manual slice. | Medium | copyright / permission wording, manual-compilation status, section-map orientation | Yes, if the front matter stays narrow |
| `batch-252` | pp. 9-20 | Keep the annual-filings guidance and the first half of the state-contact list together before the list rolls over. | Medium-High | annual-filing references, state-contact mapping, guidance-vs-reference wording | Yes, if the annual-filings boundary stays narrow |
| `batch-253` | pp. 21-30 | Keep the remaining state-contact entries and valuation-related letters together before Section 3 begins. | High | state guidance references, cross-reference mapping, exact-letter wording | Yes, if the state-letter section stays narrow |

## Review Standards

Expected extraction categories for this source include:

- `background_content`
- `documentation_expectation`
- `jurisdiction_specific_requirement`
- `cross_reference_mapping`
- `boundary_control_window`
- `requires_human_interpretation`

## Risk Notes

- The manual is a large compiled reference, so page boundaries must stay
  explicit.
- The preface and copyright language should not be overread as substantive
  guidance.
- The annual-filings section contains practical reference information that
  should remain review-only.
- The state-letter section can change over time, so it should stay tied to the
  page locators and exact wording.
- Section 3 begins after page 30 and should stay out of this wave.

## Cross-Reference Handling

- Treat the manual as a reference compilation and not as a replacement for the
  tracked VM, AG, or NY-regulation review indexes.
- Keep the opening pages separate from later manual sections that duplicate or
  summarize other tracked source families.
- Preserve page-level citations because the opening pages are mostly front
  matter and reference material.

## Unresolved Issues

- Whether the annual-filings guidance should later be split from the state
  contact list if a narrower cleanup pass is needed.
- Whether the valuation-related letters should later be split by state if a
  reviewer wants a more granular handoff.
- Whether later sections of the manual should be handled by separate waves
  rather than folded into this opening plan.

## Promotion Gates

- Keep every extraction review-only by default.
- Do not treat manual text as authoritative regulatory text unless a later
  human review explicitly pairs it with binding-source support.
- Before anything can be considered learner-facing, the extracted items must
  have a separate approval path, exact source support, and no unresolved review
  flags.
- Before anything can be considered app-ready or RAG-ready, the reviewed
  source-bound items must be explicitly promoted in a later human-controlled
  step.

## Validation Implications

- Add validation coverage for this manual plan file and batch registry before
  extraction begins.
- Add lightweight validation for the resulting review index and self-review
  note once the wave completes.
- Keep the plan separate from the existing VM, AG, practice-note, and NY
  regulation waves so the processor remains portable across source families.

## Operating Note

This source is a compiled reference manual, not a binding regulatory source.
The wave should remain review-only until a later human decision explicitly
changes the status.
