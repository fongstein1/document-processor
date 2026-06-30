# Controlled C3 Phase 2 Practice Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

`Practice Notes/AAA - C3 Phase 2 - Sep 2006 - life_c3.8.pdf` is a
non-binding practice note / companion-guidance source. It is useful as a
review-only implementation note for VA RBC and VACARVM modeling because it
walks through products covered, model granularity, starting assets,
scenarios, assumptions, alternative methodology, standard scenario,
reinsurance, hedging, certification, peer review, glossary terms, and the
appendix Q&A closeout. The note must stay review-only and keep the
non-binding caveat visible at every layer.

## Source Scope

- Primary source file: `Practice Notes/AAA - C3 Phase 2 - Sep 2006 - life_c3.8.pdf`
- Source family: `practice_notes`
- Domain: `naic_regulatory`
- Raw source root: `D:\Work\AI Projects\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-93
- Source status: non-binding practice note
- Source status note: companion guidance / implementation note; not authoritative regulatory text
- Issuing body: American Academy of Actuaries
- Companion note posture: review-only guidance for VA RBC / VACARVM implementation

### Boundaries

- Keep planning focused on this single practice note file.
- Do not widen into the other Practice Notes files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-30, VM-31, AG files, and NY regulation files
  review-only unless the same batch intentionally includes the referenced
  operational text.
- Keep the disclaimer and the non-binding status visible as companion-guidance
  context, not as authoritative regulatory text.
- Use page locators as the primary citation anchor; line references are not
  expected for this PDF slice.
- Keep a page-image wording backstop visible because the text layer is noisy in
  places and should not be overclaimed.

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
| `c3-opening-guidance` | Front matter, introduction, products covered, and common practice guidance | Medium | background_content, non_binding_practice_note, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | VA RBC scope, VACARVM scope, ASOP 7, ASOP 21, ASOP 41 |
| `c3-model-differences` | VA RBC vs VACARVM consistency / differences, model types, and starting assets | High | regulatory_requirement, calculation_structure, formula_context, cross_reference_mapping, requires_human_interpretation | VA RBC instructions, VACARVM, AVR / IMR treatment, model granularity |
| `c3-scenarios-and-economics` | Scenario generation, calibration, fund modeling, and economic assumptions | High | scenario_or_stochastic_requirement, asset_modeling_judgment, formula_context, cross_reference_mapping, requires_human_interpretation | S&P 500 calibration, CAPM / factor models, risk-neutral scenarios, hedging |
| `c3-assumption-framework` | Prudent best estimate, discount rate, and core assumption setting | High | prescribed_assumption, company_or_prudent_estimate_assumption, calculation_structure, cross_reference_mapping, requires_human_interpretation | tax adjustment, revenue sharing, lapse / mortality, dynamic assumptions |
| `c3-assumption-closeout` | Revenue-sharing closeout, interpolation, and informed projection details | High | calculation_structure, formula_context, boundary_control_window, cross_reference_mapping, requires_human_interpretation | valuation-date adjustment, interpolation, informed projection, standard scenario bridge |
| `c3-alternative-methodology-standard-scenario` | Alternative Methodology and Standard Scenario opener | High | reserve_method_structure, calculation_structure, definition_or_terminology, boundary_control_window, requires_human_interpretation | GC / CA / AAR, standard scenario, ITM logic, aggregation |
| `c3-standard-scenario-risk-controls` | Standard Scenario tail, reinsurance, and hedging entry point | High | reinsurance, hedging_or_risk_mitigation, scenario_or_stochastic_requirement, calculation_structure, cross_reference_mapping | approved hedges, risk-neutral scenarios, C-3 Phase I, fixed options |
| `c3-certification-documentation` | Certification, documentation, and peer review interfaces | Medium-High | reporting_requirement, documentation_expectation, governance_or_control_expectation, cross_reference_mapping, requires_human_interpretation | certification, reliance, peer review, model validation |
| `c3-glossary-appendix-closeout` | Peer review, glossary terms, appendix Q&A, and closing boundary | Medium | background_content, caveat_or_companion_guidance, boundary_control_window, cross_reference_mapping, non_binding_practice_note | peer review, glossary, appendix Q&A, closing boundary |

## Proposed Batch Sequence

The next planned batch IDs continue after the current validated batch frontier.
Each batch remains review-only by default.

| Batch ID | Pages / section | Rationale | Expected complexity | Expected unresolved issues | Automatic stop conditions likely? |
| --- | --- | --- | --- | --- | --- |
| `batch-222` | pp. 1-12 | Keep the front matter, products covered, and common practice guidance together before the section-3 comparison work begins. | Medium | Companion-guidance caveat, product-scope mapping, and early ASOP cross-references. | Yes, if the text layer becomes too noisy or the note starts reading like an authoritative rule set. |
| `batch-223` | pp. 13-25 | Keep VA RBC vs VACARVM differences, model granularity, and starting-assets language together while the comparison layer is still in view. | High | Model-difference interpretation, AVR / IMR treatment, and starting-asset boundary questions. | Yes, if the comparison section stops being source-bound. |
| `batch-224` | pp. 26-33 | Keep the scenario-generation and calibration guidance together as the first stochastic-modeling slice. | High | Scenario calibration, fund mapping, and external reference list handling. | Yes, if the calibration guidance becomes too broad. |
| `batch-225` | pp. 34-40 | Keep the prudent-best-estimate framework and core assumption-setting slice narrow before the revenue-sharing discussion. | High | Margin selection, discount-rate basis, and assumption hierarchy. | Yes, if assumption-setting becomes too abstract or over-interpreted. |
| `batch-226` | pp. 41-50 | Keep the revenue-sharing, negative-assets, interpolation, and informed-projection closeout together while staying before Section 8. | High | Tax adjustment, revenue-sharing controls, interpolation formula context, and valuation-date bridge mechanics. | Yes, if the formula steps need a wider mechanics split. |
| `batch-227` | pp. 51-60 | Keep the Alternative Methodology and Standard Scenario opener together so the GC / CA / AAR relationship stays readable. | High | Method comparison, ITM logic, contract charging, and standard-scenario setup. | Yes, if the AM / Standard Scenario comparison becomes too dense. |
| `batch-228` | pp. 61-70 | Keep the Standard Scenario tail, reinsurance, and hedging entry point together so the risk-control material stays contiguous. | High | Reinsurance treatment, hedge-credit logic, risk-neutral scenario use, and boundary control. | Yes, if hedge/reinsurance mechanics require a second split. |
| `batch-229` | pp. 71-80 | Keep the C-3 Phase I consistency discussion, certification, and documentation requirements together as the reporting/control layer. | High | C-3 Phase I integration, certification wording, reliance language, and documentation controls. | Yes, if certification and peer-review boundaries need separating. |
| `batch-230` | pp. 81-93 | Close the source with peer review, glossary terms, appendix Q&A, and the final boundary. | Medium | Peer review framing, glossary cross-references, appendix implementation caveats, and closing boundary control. | Yes, if the appendix Q&A turns into a new source family. |

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

