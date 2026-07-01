# C3 Phase 2 / AG 43 March 2011 Practice Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why This Exists

`Practice Notes/AAA - C3 Phase 2 and AG 43 - March 2011.pdf` is a
non-binding practice note and companion-guidance source. It is an integrated
March 2011 update of the July 2009 C-3 Phase II / AG 43 practice note plus
the December 2009 addendum. The note remains useful only as review-only
implementation guidance for C-3 Phase II / AG 43, with the non-binding caveat
visible at every layer.

## Source Scope

- Primary source file: `Practice Notes/AAA - C3 Phase 2 and AG 43 - March 2011.pdf`
- Relative path from received inventory: `Practice Notes/AAA - C3 Phase 2 and AG 43 - March 2011.pdf`
- Full local path: `C:\Dev\NAIC Valuation Manual Course\NAIC Valuation Regulation\Practice Notes\AAA - C3 Phase 2 and AG 43 - March 2011.pdf`
- Source family: `practice_notes`
- Domain: `naic_regulatory`
- Issuing body: American Academy of Actuaries
- Source reference: American Academy of Actuaries practice note, March 2011
- Source status: non-binding practice note
- Source status note: companion guidance / implementation note; not authoritative regulatory text
- Raw source root: `C:\Dev\NAIC Valuation Manual Course\NAIC Valuation Regulation`
- Confirmed page range: pages 1-122
- Source identity: March 2011 integrated update of the July 2009 C-3 Phase II / AG 43 practice note plus the December 2009 addendum
- Companion note posture: review-only guidance for C-3 Phase II / AG 43 implementation

### Source Structure

- TOC runs through revenue sharing.
- Checklist-style peer-review material appears near the end.
- No separate appendix section was identified.
- Section 15 is the closing revenue-sharing section, not a separate appendix.

### Boundaries

- Keep planning focused on this single practice note file.
- Do not widen into the other Practice Notes files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-30, VM-31, AG files, and NY regulation files
  review-only unless a batch intentionally includes the referenced operational
  text.
- Keep the disclaimer and the non-binding status visible as companion-guidance
  context, not as authoritative regulatory text.
- Use page locators as the primary citation anchor; line references are not
  expected for this PDF slice.
- Keep a page-image wording backstop visible because the text layer is noisy in
  dense Q&A passages and near the end-of-source checklist material.

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
| `c3-2011-opening-guidance` | Front matter, disclaimer, introduction, products covered, and common practice guidance | Medium | background_content, non_binding_practice_note, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | VA RBC scope, AG 43 scope, ASOP 7, ASOP 11, ASOP 21, ASOP 23, ASOP 41 |
| `c3-2011-model-differences` | C-3 Phase I / C-3 Phase II / AG 43 similarities and differences | High | regulatory_requirement, calculation_structure, formula_context, cross_reference_mapping, requires_human_interpretation | C-3 Phase I instructions, AG 43 instructions, TAR, CTE, AVR, IMR |
| `c3-2011-model-types-starting-assets` | Types of models / granularity and starting-assets discussion | High | calculation_structure, asset_modeling_judgment, formula_context, cross_reference_mapping | integrated vs non-integrated models, starting assets, asset adequacy analysis |
| `c3-2011-scenarios-economics` | Scenario generators, calibration, fund modeling, and economic assumptions | High | scenario_or_stochastic_requirement, asset_modeling_judgment, formula_context, cross_reference_mapping, requires_human_interpretation | calibration points, S&P 500 references, stochastic paths, fund returns |
| `c3-2011-assumption-framework` | Actuarial/modeling assumptions opening slice | High | prescribed_assumption, company_or_prudent_estimate_assumption, calculation_structure, cross_reference_mapping, requires_human_interpretation | mortality, lapse, withdrawal, annuitization, expenses, tax, discount rates |
| `c3-2011-assumption-closeout` | Actuarial/modeling assumptions closeout, revenue sharing bridge, and interpolation details | High | calculation_structure, formula_context, boundary_control_window, cross_reference_mapping, requires_human_interpretation | revenue sharing, interpolation, informed projection, valuation-date bridge |
| `c3-2011-alternative-methodology` | Alternative Method / Methodology opener | High | reserve_method_structure, calculation_structure, definition_or_terminology, boundary_control_window, requires_human_interpretation | Alternative Method, Standard Scenario relationship, GC / CA / AAR |
| `c3-2011-standard-scenario` | Standard Scenario mechanics and risk-control closeout | High | scenario_or_stochastic_requirement, calculation_structure, formula_context, cross_reference_mapping, requires_human_interpretation | standard scenario, approved hedges, hedge credit, reinsurance boundary |
| `c3-2011-reinsurance` | Treatment of reinsurance | High | reinsurance, calculation_structure, cross_reference_mapping, requires_human_interpretation | net vs gross reserve treatment, treaty limitations, AG 43 Appendix 2 |
| `c3-2011-hedging` | Treatment of hedging | High | hedging_or_risk_mitigation, scenario_or_stochastic_requirement, calculation_structure, cross_reference_mapping | hedge effectiveness, risk-neutral scenarios, clearly defined hedging strategy |
| `c3-2011-certification-documentation` | Certification and required documentation | Medium-High | reporting_requirement, documentation_expectation, governance_or_control_expectation, cross_reference_mapping, requires_human_interpretation | qualified actuary, certification, model validation, disclosure requirements |
| `c3-2011-allocation` | Allocation of aggregate reserves to the contract level | Medium-High | calculation_structure, formula_context, cross_reference_mapping, requires_human_interpretation | SSR, SSA, CTEA, allocation mechanics, Appendix 6 logic |
| `c3-2011-peer-review` | Peer review and working with a peer reviewer | Medium-High | governance_or_control_expectation, documentation_expectation, background_content, cross_reference_mapping, requires_human_interpretation | checklist review, model validation, internal controls, external review |
| `c3-2011-revenue-sharing` | Revenue sharing closeout | High | calculation_structure, formula_context, prescribed_assumption, company_or_prudent_estimate_assumption, cross_reference_mapping, requires_human_interpretation | contractually guaranteed income, margin, control, applicable expenses |

## Proposed Batch Sequence

The next planned batch IDs continue after the current validated batch frontier.
Each batch remains review-only by default.

| Batch ID | Pages / section | Boundary rationale | Expected complexity | Expected unresolved issues | Auto-process safe? |
| --- | --- | --- | --- | --- | --- |
| `batch-231` | pp. 1-12 | Keep the front matter, disclaimer, products covered, and common practice guidance together before the comparison section begins. | Medium | non-binding caveat, product-scope mapping, early ASOP cross-references | Yes, if the opening remains narrow |
| `batch-232` | pp. 13-21 | Keep the C-3 Phase I / C-3 Phase II / AG 43 comparison material together while the scope and tax-basis differences are in view. | High | model-difference interpretation, AVR / IMR treatment, standalone-basis questions | Yes, if the comparison stays source-bound |
| `batch-233` | pp. 22-29 | Keep model-type and starting-asset language together while the granularity discussion is still in view. | High | model granularity, starting-assets allocation, cross-reference mapping | Yes, if the section boundary stays clear |
| `batch-234` | pp. 30-39 | Keep the scenario-generation, calibration, and fund-modeling slice together as the first stochastic-modeling block. | High | calibration points, fund-return modeling, scenario-generation judgment | Yes, if the stochastic language stays review-only |
| `batch-235` | pp. 40-47 | Keep the opening actuarial/modeling assumptions slice together before the revenue-sharing bridge begins. | High | prudent-best-estimate wording, margin selection, assumption hierarchy | Yes, with a page-image backstop |
| `batch-236` | pp. 48-55 | Keep the assumption closeout, revenue-sharing bridge, and interpolation material contiguous. | High | valuation-date bridge, interpolation, informed projection, formula context | Yes, if the bridge stays narrow |
| `batch-237` | pp. 56-59 | Keep the Alternative Method opener together before the Standard Scenario section starts. | Medium-High | method comparison, boundary control, terminology alignment | Yes, if the AM opener stays separate |
| `batch-238` | pp. 60-80 | Keep the Standard Scenario mechanics and tail-risk closeout together before the reinsurance section begins. | High | standard-scenario mechanics, hedge credit, approved hedge wording | Yes, but watch for dense Q&A language |
| `batch-239` | pp. 81-87 | Keep the reinsurance treatment slice together while the net-vs-gross reserve discussion remains in view. | High | treaty limitations, gross reserve cross-checks, appendix references | Yes, if reinsurance stays contiguous |
| `batch-240` | pp. 88-98 | Keep the hedging treatment slice together while hedge effectiveness and risk-neutral language are in view. | High | hedging assumptions, risk-neutral scenario use, hedge-effectiveness judgment | Yes, with formula-context caution |
| `batch-241` | pp. 99-104 | Keep certification and required documentation together before the allocation discussion begins. | Medium-High | qualified-actuary certification, required disclosures, model validation | Yes, if documentation remains review-only |
| `batch-242` | pp. 105-106 | Keep the aggregate-reserve allocation slice together as a narrow contract-level mechanics pass. | Medium-High | allocation logic, SSR / SSA / CTEA terminology, formula context | Yes, if the example math stays source-bound |
| `batch-243` | pp. 107-112 | Keep the peer-review checklist material together while the controls and review role remain in view. | Medium-High | checklist interpretation, internal controls, reviewer responsibilities | Yes, but do not overread the checklist as binding law |
| `batch-244` | pp. 113-122 | Keep the revenue-sharing closeout together at the end of the source. | High | contractually guaranteed income, margin, controlled income, applicable expenses | Yes, but treat the end section carefully |

## Review Standards

Expected extraction categories for this source include:

- `non_binding_practice_note`
- `caveat_or_companion_guidance`
- `regulatory_requirement`
- `definition_or_terminology`
- `reserve_method_structure`
- `calculation_structure`
- `formula_context`
- `prescribed_assumption`
- `company_or_prudent_estimate_assumption`
- `scenario_or_stochastic_requirement`
- `asset_modeling_judgment`
- `hedging_or_risk_mitigation`
- `reinsurance`
- `reporting_requirement`
- `documentation_expectation`
- `governance_or_control_expectation`
- `cross_reference_mapping`
- `background_content`
- `boundary_control_window`
- `requires_human_interpretation`

## Risk Notes

- The opening caveat must remain explicit so the source is not misread as
  binding guidance.
- The comparison section can blur practice-note commentary and instruction,
  especially where AG 43 and C-3 Phase II differ on tax treatment, AVR / IMR,
  and standalone handling.
- Scenario-generation and calibration language should remain source-bound and
  not be generalized into a universal modeling prescription.
- The assumption sections contain dense formula context and terminology that
  should not be normalized beyond the page text.
- Revenue-sharing and interpolation passages need boundary control because the
  same words sometimes serve both explanatory and calculation purposes.
- Reinsurance and hedging should stay contiguous so the risk-control boundary
  does not drift.
- The certification / documentation / peer-review chain should remain
  companion guidance, not a promotion candidate.
- The closing revenue-sharing pages should not pull the source into a new
  source family.

## Formula / Table Handling

- Treat formulas as calculation context unless the page text itself clearly
  states a standalone requirement.
- Do not rebuild formulas from memory when a line break, table row, or symbol is
  unclear.
- Keep tables such as the TOC, comparison tables, allocation examples, and
  checklist-style material source-bound and page-located.
- Use the page-image backstop if table rows, ordered steps, or footnotes become
  ambiguous in the text layer.

## Cross-Reference Handling

- Preserve the distinction between AG 43 requirements, C-3 Phase II RBC
  requirements, and practice-note commentary.
- Keep CTE, TAR, SSR, SSA, CTEA, AVR, IMR, and Standard Scenario language
  separate from surrounding implementation commentary.
- Map ASOP references as background guidance only unless the source explicitly
  points to a required disclosure or certification statement.
- Treat references to prior C3 Phase 2 work, AG 43 artifacts, and VM-21 / VM-22
  material as cross-reference context, not as a reason to widen this source.

## Unresolved Issues

- Whether the source text in a given question is explanatory commentary or a
  practical instruction that should be tagged as requirement-like.
- Whether revenue-sharing language is strictly AG 43 specific in some places or
  also intended as C-3 Phase II comparison context.
- How much of the peer-review checklist should be treated as descriptive versus
  recommendation-like background.
- Whether allocation examples should be retained as formula context only or
  broken out more granularly in later passes.
- Where the line should sit between a model-structure explanation and a
  modeling-judgment recommendation in the scenario and assumption sections.

## Promotion Gates

- Keep every extraction review-only by default.
- Do not treat practice-note text as authoritative regulatory text unless a
  later human review explicitly pairs it with binding-source support.
- Before anything can be considered learner-facing, the extracted items must
  have a separate approval path, exact source support, and no unresolved review
  flags.
- Before anything can be considered app-ready or RAG-ready, the reviewed
  source-bound items must be explicitly promoted in a later human-controlled
  step.

## Validation Implications

- Add validation coverage for this practice-note plan file and batch registry
  before extraction begins.
- Add lightweight validation for the resulting review index and self-review
  note once the wave completes.
- Keep the plan separate from VM-20, VM-21, VM-22, and the supporting VM
  chapters so the processor remains portable across source families.

## Operating Note

This source is companion guidance, not authoritative regulatory text. The wave
should remain review-only until a later human decision explicitly changes the
status.
