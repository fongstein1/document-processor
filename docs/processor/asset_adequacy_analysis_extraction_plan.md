# Asset Adequacy Analysis Practice Note Extraction Plan

Status: planning only. No extraction run is authorized by this artifact.

This plan remains review-only, not learner-facing, not app-ready,
not RAG-ready, and not promoted.

## Why this exists

`Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf` is a non-binding
practice note. It is companion guidance for appointed actuaries performing
asset adequacy analysis, so the companion caveat must remain visible at every
layer. The source is useful for review because it covers introduction,
appointed-actuary procedures, general modeling considerations, asset modeling
detail, policy cash flow risk, reliance on others, analysis of results, and
the opinion / memorandum closeout.

## Source Scope

- Primary source file: `Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf`
- Relative path from received inventory: `Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf`
- Source family: `practice_notes`
- Domain: `naic_regulatory`
- Issuing body: American Academy of Actuaries
- Source reference: American Academy of Actuaries practice note, September 2017
- Source status: active
- Source status note: non-binding practice note / companion guidance; not authoritative regulatory text
- Raw source root: `D:\\Work\\AI Projects\\NAIC Valuation Manual Course`
- Confirmed page range: pages 1-91
- Companion note posture: implementation guidance for asset adequacy analysis

### Boundaries

- Keep planning focused on this single practice note file.
- Do not widen into the other Practice Notes files in the same folder.
- Keep VM-20, VM-21, VM-22, VM-30, VM-31, AG, and regulation references
  review-only unless a batch intentionally includes the referenced operational
  text.
- Keep the disclaimer and the non-binding status visible as companion-guidance
  context, not as authoritative regulatory text.
- Use page locators as the primary citation anchor; stable line references are
  not expected for this PDF slice.

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

The topic map below keeps the practice note split into narrow reviewable slices.
Each topic family stays review-only until a later promotion decision is made.

| Topic ID | Section / topic family | Review complexity | Expected issue types | Cross-reference watchlist |
| --- | --- | --- | --- | --- |
| `aaa-aaa-introduction` | Front matter, disclaimer, introduction, and Section A background | Medium | background_content, caveat_or_companion_guidance, cross_reference_mapping, boundary_control_window | AOMR, current-practice framing, ASOP 7, ASOP 11, ASOP 22, ASOP 23, ASOP 41 |
| `aaa-appointed-actuary-procedures` | Section B on accepting / resigning the appointed actuary and Section C opener | Medium | governance_or_control_expectation, reporting_requirement, documentation_expectation, cross_reference_mapping | board / management notifications, personal qualification documentation |
| `aaa-general-modeling` | Section C general considerations and Section D opener | High | calculation_structure, formula_context, cross_reference_mapping, requires_human_interpretation | cash flow testing, gross premium valuation, moderate adverse conditions |
| `aaa-asset-modeling` | Section D continuation and Section E / F asset modeling detail | High | asset_modeling_judgment, calculation_structure, formula_context, cross_reference_mapping | IMR, AVR, discounted cash flows, fixed income, mortgages, derivatives |
| `aaa-policy-cash-flow-risk` | Sections G / H / I / J on policy cash flow risk, expenses, reliance, and results | High | scenario_or_stochastic_requirement, reporting_requirement, documentation_expectation, governance_or_control_expectation, cross_reference_mapping | sensitivity testing, reliance on third parties, reserve adequacy, additional reserves |
| `aaa-opinion-and-impacts` | Sections K / L and Appendix A on opinion, memorandum, AG43 / VM-21 impacts, and appendix | High | reporting_requirement, documentation_expectation, cross_reference_mapping, requires_human_interpretation | opinion formats, memorandum detail, AG43 / VM-21, AG38, appendix acronyms |

## Proposed Batch Sequence

| Planned Batch ID | Page Window | Boundary Rationale | Expected Review Complexity | Expected Unresolved Issue Types | Auto-Process Safe? |
| --- | --- | --- | --- | --- | --- |
| `batch-216` | pages 1-11 | Keep the disclaimer, introduction, and Section A background together before the appointed-actuary procedures begin | Medium | companion-guidance caveat, page-image wording backstop, cross-reference mapping | Yes, if the page boundary stays narrow |
| `batch-217` | pages 12-25 | Keep appointed-actuary procedures and early general considerations together before the deeper modeling sections begin | Medium | governance/control expectations, documentation expectations, cross-reference mapping | Yes, if the Section C opener stays visible |
| `batch-218` | pages 26-40 | Keep the general modeling discussion together, including IMR / AVR and related modeling considerations | High | calculation structure, formula context, asset-modeling judgment, cross-reference mapping | Yes, if it stays review-only |
| `batch-219` | pages 41-57 | Keep the asset modeling detail together so fixed-income and mortgage topics do not spill into later sections | High | asset-modeling judgment, scenario / sensitivity interpretation, cross-reference mapping | Yes, with human-review backstop |
| `batch-220` | pages 58-76 | Keep policy cash flow risk, expenses, reliance, and analysis of results together as one risk-and-results slice | High | scenario / stochastic interpretation, reporting requirements, reliance on other parties, cross-reference mapping | Yes, if it remains source-bound |
| `batch-221` | pages 77-91 | Keep opinion / memorandum preparation and AG43 / VM-21 impact material together with the appendix closeout | High | reporting requirements, documentation expectations, AG43 / VM-21 cross-reference mapping, appendix boundaries | Yes, but review carefully before closing the wave |

## Review Standards

Expected extraction categories for this source include:

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
- `caveat_or_companion_guidance`
- `non_binding_practice_note`
- `boundary_control_window`
- `requires_human_interpretation`

Cross-reference terms to keep visible include AOMR, ASOP 7, ASOP 11, ASOP 22,
ASOP 23, ASOP 41, IMR, AVR, AG43 / VM-21, AG38, and reinsurance.

## Promotion Gates

- Keep every extraction review-only by default.
- Do not infer learner-facing approval from review-only source slices.
- Do not promote any extracted content to app-ready or RAG-ready status.
- Keep the non-binding practice-note caveat visible in every batch and review packet.
- Require explicit human review before any future promotion decision.

## Validation Implications

- Add lightweight checks for the new plan file, batch-definition module, and
  batch-plan JSON before running the source wave.
- Keep the validator portable so later practice notes, AGs, and regulations can
  reuse the same review-only guardrails.
- Continue using page locators as the primary anchor; line references are not
  expected to be stable in this source.
- Add review-index and self-review checks after the wave is complete.

## Operating Note

This source is companion guidance, not authoritative regulatory text. The wave
should remain review-only until a later human decision explicitly changes the
status.
