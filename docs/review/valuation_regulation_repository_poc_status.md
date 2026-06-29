# Valuation Regulation Repository Proof-of-Concept Status

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

This summary is a tracked proof-of-concept handoff for the valuation
regulation repository. It consolidates the completed review-only extraction
waves without changing the status of the underlying batch outputs or review
indexes.

The handoff now spans 60 review indexes, up from 57 review indexes. The
earlier 51 review indexes checkpoint remains part of the handoff history, the
earlier 50 review indexes checkpoint remains part of the handoff history, the
earlier 49 review indexes checkpoint remains part of the handoff history, the
earlier 48 review indexes checkpoint remains part of the handoff history, the
earlier 47 review indexes checkpoint remains part of the handoff history, and
the earlier 45 review indexes checkpoint remains part of the handoff history.

This summary is review-only, not learner-facing, not app-ready, not RAG-ready,
and not promoted.

The detailed evidence remains in the batch review packets and the chapter
review indexes:

- `docs/review/vm20_review_index.md`
- `docs/review/supporting_vm_review_index.md`
- `docs/review/vm21_review_index.md`
- `docs/review/vm22_review_index.md`
- `docs/review/ag30_review_index.md`
- `docs/review/ag30_self_review.md`
- `docs/review/ag31_review_index.md`
- `docs/review/ag31_self_review.md`
- `docs/review/ag32_review_index.md`
- `docs/review/ag32_self_review.md`
- `docs/review/ag33_review_index.md`
- `docs/review/ag33_self_review.md`
- `docs/review/ag34_review_index.md`
- `docs/review/ag34_self_review.md`
- `docs/review/ag35_review_index.md`
- `docs/review/ag35_self_review.md`
- `docs/review/vm20_practice_note_review_index.md`
- `docs/review/ag38_review_index.md`
- `docs/review/ag38_self_review.md`
- `docs/review/ag39_review_index.md`
- `docs/review/ag39_self_review.md`
- `docs/review/ag40_review_index.md`
- `docs/review/ag40_self_review.md`
- `docs/review/ag41_review_index.md`
- `docs/review/ag41_self_review.md`
- `docs/review/ag42_review_index.md`
- `docs/review/ag42_self_review.md`
- `docs/review/ag43_review_index.md`
- `docs/review/ag43_self_review.md`
- `docs/review/ag44_review_index.md`
- `docs/review/ag44_self_review.md`
- `docs/review/ag45_review_index.md`
- `docs/review/ag45_self_review.md`
- `docs/review/ag46_review_index.md`
- `docs/review/ag46_self_review.md`
- `docs/review/ag03_review_index.md`
- `docs/review/ag03_self_review.md`
- `docs/review/ag01_review_index.md`
- `docs/review/ag01_self_review.md`
- `docs/review/ag02_review_index.md`
- `docs/review/ag02_self_review.md`
- `docs/review/ag04_review_index.md`
- `docs/review/ag04_self_review.md`
- `docs/review/ag05_review_index.md`
- `docs/review/ag05_self_review.md`
- `docs/review/ag06_review_index.md`
- `docs/review/ag06_self_review.md`
- `docs/review/ag07_review_index.md`
- `docs/review/ag07_self_review.md`
- `docs/review/ag08_review_index.md`
- `docs/review/ag08_self_review.md`
- `docs/review/ag09_review_index.md`
- `docs/review/ag09_self_review.md`
- `docs/review/ag10_review_index.md`
- `docs/review/ag10_self_review.md`
- `docs/review/ag11_review_index.md`
- `docs/review/ag11_self_review.md`
- `docs/review/ag12_review_index.md`
- `docs/review/ag12_self_review.md`
- `docs/review/ag13_review_index.md`
- `docs/review/ag13_self_review.md`
- `docs/review/ag14_review_index.md`
- `docs/review/ag14_self_review.md`
- `docs/review/ag15_review_index.md`
- `docs/review/ag15_self_review.md`
- `docs/review/ag16_review_index.md`
- `docs/review/ag16_self_review.md`
- `docs/review/ag17_review_index.md`
- `docs/review/ag17_self_review.md`
- `docs/review/ag18_review_index.md`
- `docs/review/ag18_self_review.md`
- `docs/review/ag19_review_index.md`
- `docs/review/ag19_self_review.md`
- `docs/review/ag20_review_index.md`
- `docs/review/ag20_self_review.md`
- `docs/review/ag22_review_index.md`
- `docs/review/ag22_self_review.md`
- `docs/review/ag21_review_index.md`
- `docs/review/ag21_self_review.md`
- `docs/review/ag23_review_index.md`
- `docs/review/ag23_self_review.md`
- `docs/review/ag24_review_index.md`
- `docs/review/ag24_self_review.md`
- `docs/review/ag25_review_index.md`
- `docs/review/ag25_self_review.md`
- `docs/review/ag26_review_index.md`
- `docs/review/ag26_self_review.md`
- `docs/review/ag28_review_index.md`
- `docs/review/ag28_self_review.md`
- `docs/review/ag29_review_index.md`
- `docs/review/ag29_self_review.md`

## Executive Status

The processor now supports a source-bound, review-first document-processing
factory for NAIC valuation-manual material and related actuarial source
families.

What has been built:

- formal JSON-schema contracts for batch manifests, source inventories,
  extraction outputs, and review packets
- reusable templates and demo fixtures for the same contracts
- controlled batch definitions and chapter plans for VM-20, supporting VM
  chapters, VM-21, VM-22, and the VM-20 companion practice note
- review-packet and unresolved-issues workflows that keep exception-first
  review visible
- tracked end-of-sequence review indexes for the completed waves
- tracked AG 03 review index and self-review note for the one-page guideline
  unit in `docs/review/ag03_self_review.md`
- tracked AG 01 review index and self-review note for the one-page guideline
  unit in `docs/review/ag01_self_review.md`
- tracked AG 02 review index and self-review note for the two-page guideline
  unit in `docs/review/ag02_self_review.md`
- tracked AG 04 review index and self-review note for the two-page guideline
  unit in `docs/review/ag04_self_review.md`
- tracked AG 05 review index and self-review note for the two-page guideline
  unit in `docs/review/ag05_self_review.md`
- tracked AG 06 review index and self-review note for the two-page guideline
  unit in `docs/review/ag06_self_review.md`
- tracked AG 08 review index and self-review note for the one-page guideline
  unit in `docs/review/ag08_self_review.md`
- tracked AG 09 review index and self-review note for the short guideline
  family in `docs/review/ag09_self_review.md`
- tracked AG 10 review index and self-review note for the one-page guideline
  unit in `docs/review/ag10_self_review.md`
- tracked AG 11 review index and self-review note for the one-page guideline
  unit in `docs/review/ag11_self_review.md`
- tracked AG 12 review index and self-review note for the withdrawn one-page
  guideline unit in `docs/review/ag12_self_review.md`
- tracked AG 13 review index and self-review note for the historical CARVM
  guideline unit in `docs/review/ag13_self_review.md`
- tracked AG 14 review index and self-review note for the historical
  surveillance-procedure unit in `docs/review/ag14_self_review.md`
- tracked AG 15 review index and self-review note for the historical
  illustration guideline unit in `docs/review/ag15_self_review.md`
- tracked AG 16 review index and self-review note for the historical CRVM
  guideline unit in `docs/review/ag16_self_review.md`
- tracked AG 17 review index and self-review note for the historical CRVM
  non-level death-benefit unit in `docs/review/ag17_self_review.md`
- tracked AG 18 review index and self-review note for the current CRVM
  continuous-basis guideline unit in `docs/review/ag18_self_review.md`
- project-state docs that preserve the handoff history
- tracked AG 20 review index and self-review note for the seven-page
  joint-life-functions guideline unit in `docs/review/ag20_self_review.md`

What source families / chapters have been processed:

- VM-20, batches `batch-003` through `batch-012`
- supporting VM chapters:
  - VM-01, `batch-013`
  - VM-02, `batch-014`
  - VM-25, `batch-015`
  - VM-26, `batch-016`
  - VM-30, `batch-017` through `batch-018`
  - VM-31, `batch-019` through `batch-021`
- VM-21, batches `batch-022` through `batch-037`
- VM-22, batches `batch-038` through `batch-054`
- VM-20 companion practice note, batches `batch-055` through `batch-075`
- AG 03 single-page guideline, `batch-076`
- AG 01 single-page guideline, `batch-077`
- AG 02 two-page guideline, `batch-078`
- AG 04 two-page guideline, `batch-079`
- AG 05 two-page guideline, `batch-080`
- AG 06 two-page guideline, `batch-081`
- AG 07 two-page guideline, `batch-082`
- AG 08 single-page guideline, `batch-083`
- AG 09 family, batches `batch-084` through `batch-087`
- AG 10 single-page guideline, `batch-088`
- AG 11 single-page guideline, `batch-089`
- AG 12 single-page guideline, `batch-090`
- AG 13 two-page historical guideline, `batch-091`
- AG 14 two-page historical guideline, `batch-092`
- AG 15 one-page historical guideline, `batch-093`
- AG 16 one-page historical guideline, `batch-094`
- AG 17 one-page historical guideline, `batch-095`
- AG 18 one-page current CRVM guideline, `batch-096`
- AG 19 one-page mortality-table guideline, `batch-097`
- AG 20 seven-page joint-life-functions guideline, `batch-098`
- AG 21 one-page CRVM reserve-comparison guideline, `batch-099`
- AG 22 one-page indeterminate premiums guideline, `batch-100`
- AG 23 one-page separate account investments guideline, `batch-101`
- AG 24 six-page variable life nonforfeiture values guideline,
  `batch-102` through `batch-104`
- AG 25 three-page indexed increasing death-benefits guideline, `batch-105`
- AG 26 one-page operative-dates guideline, `batch-106`
- AG 27 five-page accelerated-benefits guideline, `batch-107` through
  `batch-109`
- AG 28 one-page survivor-income-benefit guideline, `batch-110`
- AG 29 two-page rehabilitation guideline, `batch-111`
- AG 30 two-page plan type and GIC guidance guideline, `batch-112`
- AG 31 one-page policy form approval caveat guideline, `batch-113`
- AG 32 two-page immediate-payment-of-claims reserve guidance guideline,
  `batch-114`
- AG 33 six-page elective-benefit CARVM guideline, `batch-115` through
  `batch-116`
- AG 34 11-page MGDB reserve guidance guideline, `batch-117`, `batch-118`,
  and `batch-119`
- AG 35 9-page EIA/CARVM guideline, `batch-120`, `batch-121`, and
  `batch-122`
- AG 36 11-page EIUL/CARVM guideline, `batch-123`, `batch-124`,
  `batch-125`, and `batch-126`
- AG 37 6-page GMDB guidance guideline, `batch-127`, `batch-128`, and
  `batch-129`
- AG 38 13-page Model 830 application guideline, `batch-130`, `batch-131`,
  `batch-132`, and `batch-133`
- AG 39 2-page VAGLB guideline, `batch-134`
- AG 40 4-page bailout-provision guideline, `batch-135`, and `batch-136`
- AG 41 2-page nonforfeiture-projection guideline, `batch-137`
- AG 42 4-page preferred-mortality guideline, `batch-138` and `batch-139`
- AG 43 71-page CARVM variable-annuity guideline, `batch-140` through
  `batch-148`

What remains review-only:

- every completed batch and every tracked review index
- the ignored working storage under `data/work/batches/`
- every extracted item that has not been explicitly promoted by the separate
  app/product thread

What has not been promoted:

- no learner-facing content
- no app-ready export
- no RAG-ready export
- no promoted content set

What is explicitly out of scope:

- raw source files in Git
- unapproved learner-facing or app-ready promotion
- unapproved RAG-ready export
- future pricing and liability-modeling repository work until separately
  planned
- the other Practice Notes files and unplanned Actuarial Guideline or NY
  regulation files until separately planned
- any unplanned Valuation Manual chapter families outside the completed
  controlled waves

## Coverage Table

| VM chapter | Page range | Batch IDs | Review index | Status | Key caution areas |
| --- | --- | --- | --- | --- | --- |
| VM-20 | `pp. 45-95` | `batch-003` through `batch-012` | `docs/review/vm20_review_index.md` | Complete; review-only | Framework overview, NPR mechanics, Section 3.C assumptions, DR / SR openers, exclusion tests, model structure, asset mechanics, and reinsurance / boundary cleanup |
| VM-01 | `pp. 25-39` | `batch-013` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | Definitions and cross-reference alignment only |
| VM-02 | `pp. 41-44` | `batch-014` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | Minimum nonforfeiture reserve-method structure and later coordination points |
| VM-25 | `pp. 319-320` | `batch-015` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | A&H reserve applicability and appendix / guideline cross-references |
| VM-26 | `pp. 321-324` | `batch-016` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | Contract reserve versus claim reserve language and Model #820 references |
| VM-30 | `pp. 325-339` | `batch-017` through `batch-018` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | Opinion / memorandum reporting, governance, reliance, and actuarial judgment |
| VM-31 | `pp. 341-386` | `batch-019` through `batch-021` | `docs/review/supporting_vm_review_index.md` | Complete; review-only | PBR Actuarial Report requirements, controls, and the closing boundary before VM-50 |
| VM-21 | `pp. 143-225` | `batch-022` through `batch-037` | `docs/review/vm21_review_index.md` | Complete; review-only | Scope, reserve methodology, SR projection, asset mechanics, hedging, assumptions, and closing allocation |
| VM-22 | `pp. 227-318` | `batch-038` through `batch-054` | `docs/review/vm22_review_index.md` | Complete; review-only | Background / scope, reserve methodology, projection and asset mechanics, stochastic exclusions, scenario generation, hedging, assumptions, and page-318 closure before VM-25 |
| VM-20 companion practice note | `pp. 1-115` | `batch-055` through `batch-075` | `docs/review/vm20_practice_note_review_index.md` | Complete; review-only | Non-binding disclaimer, calculation overview, reserve overviews, assumptions, reinsurance, hedging, and implementation-guidance boundaries |
| AG 03 single-page guideline | `p. 1` | `batch-076` | `docs/review/ag03_review_index.md` | Complete; review-only | Maturity-value interpretation, cash surrender treatment, and encoded-text caveat |
| AG 01 single-page guideline | `p. 1` | `batch-077` | `docs/review/ag01_review_index.md` | Complete; review-only | Valuation net premium / gross premium interpretation and encoded-text caveat |
| AG 02 two-page guideline | `pp. 1-2` | `batch-078` | `docs/review/ag02_review_index.md` | Complete; review-only | Active life funds / group annuity contract interest-rate guidance, table of values, and encoded-text caveat |
| AG 04 two-page guideline | `pp. 1-2` | `batch-079` | `docs/review/ag04_review_index.md` | Complete; review-only | Term-life reserve interpretation, encoded-text caveat, and duplicate regulatory-flag cleanup |
| AG 05 two-page guideline | `pp. 1-2` | `batch-080` | `docs/review/ag05_review_index.md` | Complete; review-only | Continuous-functions approximation guidance, formula-context caution, and encoded-text caveat |
| AG 06 two-page guideline | `pp. 1-2` | `batch-081` | `docs/review/ag06_review_index.md` | Complete; review-only | Single-life / joint-life mortality-table interpretation, expense allowances, and encoded-text caveat |
| AG 07 two-page guideline | `pp. 1-2` | `batch-082` | `docs/review/ag07_review_index.md` | Complete; review-only | Equivalent-level-amount interpretation, pure-endowment caveat, and encoded-text caveat |
| AG 08 single-page guideline | `p. 1` | `batch-083` | `docs/review/ag08_review_index.md` | Complete; review-only | Single-page deferred-annuity interpretation, discounted values, cash surrender values, and encoded-text caveat |
| AG 09 family | `p. 1; pp. 1-2; pp. 1-4; pp. 1-3` | `batch-084` through `batch-087` | `docs/review/ag09_review_index.md` | Complete; review-only | Form classification title/OCR mismatch, structured-settlement mortality tables, methods clarification, immediate-annuity mortality tables, and noisy text-layer caveats |
| AG 10 single-page guideline | `p. 1` | `batch-088` | `docs/review/ag10_review_index.md` | Complete; review-only | Nonforfeiture interpretation, cash surrender benefits, additional amounts, maturity values, and noisy text-layer caveat |
| AG 19 single-page mortality-table guideline | `p. 1` | `batch-097` | `docs/review/ag19_review_index.md` | Complete; review-only | 1980 CSO mortality-table context, select-factor interpretation, and page-image caveat |
| AG 20 seven-page joint-life-functions guideline | `pp. 1-7` | `batch-098` | `docs/review/ag20_review_index.md` | Complete; review-only | Joint-life-functions context, blank separator page, table continuity, and page-boundary review note |
| AG 21 one-page CRVM reserve-comparison guideline | `p. 1` | `batch-099` | `docs/review/ag21_review_index.md` | Complete; review-only | CRVM reserve-comparison context, noisy OCR, page-image backstop, and page-boundary review note |
| AG 22 one-page indeterminate premiums guideline | `p. 1` | `batch-100` | `docs/review/ag22_review_index.md` | Complete; review-only | Indeterminate premiums context, noisy OCR, page-image backstop, and page-boundary review note |
| AG 23 one-page separate account investments guideline | `p. 1` | `batch-101` | `docs/review/ag23_review_index.md` | Complete; review-only | Separate account investments context, noisy OCR, page-image backstop, placeholder statutory reference, readily marketable assets, net investment income, `15%`, and `10%` |
| AG 24 six-page variable life nonforfeiture values guideline | `pp. 1-6` | `batch-102` through `batch-104` | `docs/review/ag24_review_index.md` | Complete; review-only | Variable life nonforfeiture values, retrospective and prospective method framing, surrender-charge caps, paid-up benefits, noisy OCR, and formula-context caution |
| AG 25 three-page indexed increasing death-benefits guideline | `pp. 1-3` | `batch-105` | `docs/review/ag25_review_index.md` | Complete; review-only | Indexed increasing death benefits, CPI-based annual increase assumptions, threshold amount language, low-amount exception, noisy OCR, and page-image backstop |
| AG 26 one-page operative-dates guideline | `p. 1` | `batch-106` | `docs/review/ag26_review_index.md` | Complete; review-only | Operative-date election rule, dynamic interest-rate boundary, noisy OCR, page-image backstop, and Standard Valuation Law / Standard Non-Forfeiture Law cross references |
| AG 27 five-page accelerated-benefits guideline | `pp. 1-5` | `batch-107` through `batch-109` | `docs/review/ag27_review_index.md` | Complete; review-only | Accelerated-benefits overview, reserve framing, interest-accrual disclosure, lien mechanics, noisy OCR, page-image backstop, and AG 28 closing boundary |
| AG 28 one-page survivor-income-benefit guideline | `p. 1` | `batch-110` | `docs/review/ag28_review_index.md` | Complete; review-only | Survivor-income-benefit reserve framing, reserve approximation, noisy OCR, page-image backstop, and closing boundary note |
| AG 29 two-page rehabilitation guideline | `pp. 1-2` | `batch-111` | `docs/review/ag29_review_index.md` | Complete; review-only | Rehabilitation reserve interpretation, court-ordered restructuring context, issue-date / expense-allowance context, noisy OCR, page-image backstop, and closing boundary note |
| AG 30 two-page plan type and GIC guidance guideline | `pp. 1-2` | `batch-112` | `docs/review/ag30_review_index.md` | Complete; review-only | Plan type and policyholder treatment, C-3 risk reduction, insurer administration, periodic review, noisy OCR, page-image backstop, and closing boundary note |
| AG 31 one-page policy form approval caveat guideline | `p. 1` | `batch-113` | `docs/review/ag31_review_index.md` | Complete; review-only | Policy form approval caveat, annual statement reserve context, noisy OCR, page-image backstop, and closing boundary note |
| AG 32 two-page immediate-payment-of-claims reserve guidance guideline | `pp. 1-2` | `batch-114` | `docs/review/ag32_review_index.md` | Complete; review-only | Immediate-payment reserve guidance, reserve-adjustment context, noisy OCR, page-image backstop, and closing boundary note |
| AG 33 six-page elective-benefit CARVM guideline | `pp. 1-6` | `batch-115` and `batch-116` | `docs/review/ag33_review_index.md` | Complete; review-only | Elective-benefit CARVM foundation and mechanics, integrated benefit streams, guarantee duration, plan type, change in fund basis, noisy OCR, page-image backstop, and AG 34 closing boundary |
| AG 34 11-page MGDB reserve guidance guideline | `pp. 1-11` | `batch-117` through `batch-119` | `docs/review/ag34_review_index.md` | Complete; review-only | MGDB reserve foundation, mortality-basis mechanics, mortality tables, page-image backstop, line-reference gap, and AG 35 closing boundary |
| AG 35 9-page EIA/CARVM guideline | `pp. 1-9` | `batch-120` through `batch-122` | `docs/review/ag35_review_index.md` | Complete; review-only | CARVM overview, hedged-as-required criteria, quarterly notification and certification requirements, page-image backstop, line-reference gap, and AG 36 closing boundary |
| AG 36 11-page EIUL/CARVM guideline | `pp. 1-11` | `batch-123` through `batch-126` | `docs/review/ag36_review_index.md` | Complete; review-only | CARVM foundation, attachment mechanics, Hedged as Required / notification, certification closeout, page-image backstop, line-reference gap, and AG 37 closing boundary |

## Completed Assets

The repository now includes the core processor asset set:

- schemas in `data/schemas/`
- templates in `data/templates/`
- contract demo fixtures in `data/samples/contract-demo/`
- batch manifests, source inventories, chunk manifests, extraction outputs,
  review packets, validation reports, and unresolved-issues summaries for the
  controlled batches under `data/work/batches/`
- tracked review indexes in `docs/review/`
- the tracked VM-20 practice-note review index and self-review note in
  `docs/review/`
- the tracked AG 03 review index and self-review note in `docs/review/`
- the tracked AG 01 review index and self-review note in `docs/review/`
- the tracked AG 02 review index and self-review note in `docs/review/`
- the tracked AG 04 review index and self-review note in `docs/review/`
- the tracked AG 05 review index and self-review note in `docs/review/`
- the tracked AG 06 review index and self-review note in `docs/review/`
- the tracked AG 07 review index and self-review note in `docs/review/`
- the tracked AG 08 review index and self-review note in `docs/review/`
- the tracked AG 09 review index and self-review note in `docs/review/`
- the tracked AG 10 review index and self-review note in `docs/review/`
- the tracked AG 11 review index and self-review note in `docs/review/`
- the tracked AG 12 review index and self-review note in `docs/review/`
- the tracked AG 13 review index and self-review note in `docs/review/`
- the tracked AG 14 review index and self-review note in `docs/review/`
- the tracked AG 15 review index and self-review note in `docs/review/`
- the tracked AG 16 review index and self-review note in `docs/review/`
- the tracked AG 17 review index and self-review note in `docs/review/`
- the tracked AG 18 review index and self-review note in `docs/review/`
- the tracked AG 19 review index and self-review note in `docs/review/`
- the tracked AG 20 review index and self-review note in `docs/review/`
- the tracked AG 21 review index and self-review note in `docs/review/`
- the tracked AG 22 review index and self-review note in `docs/review/`
- the tracked AG 23 review index and self-review note in `docs/review/`
- the tracked AG 24 review index and self-review note in `docs/review/`
- the tracked AG 25 review index and self-review note in `docs/review/`
- the tracked AG 26 review index and self-review note in `docs/review/`
- the tracked AG 27 review index at `docs/review/ag27_review_index.md` and
  self-review note at `docs/review/ag27_self_review.md`
- the tracked AG 28 review index at `docs/review/ag28_review_index.md` and
  self-review note at `docs/review/ag28_self_review.md`
- the tracked AG 29 review index at `docs/review/ag29_review_index.md` and
  self-review note at `docs/review/ag29_self_review.md`
- the tracked AG 30 review index at `docs/review/ag30_review_index.md` and
  self-review note at `docs/review/ag30_self_review.md`
- the tracked AG 31 review index at `docs/review/ag31_review_index.md` and
  self-review note at `docs/review/ag31_self_review.md`
- the tracked AG 34 review index at `docs/review/ag34_review_index.md` and
  self-review note at `docs/review/ag34_self_review.md`
- the tracked AG 35 review index at `docs/review/ag35_review_index.md` and
  self-review note at `docs/review/ag35_self_review.md`
- the tracked AG 36 review index at `docs/review/ag36_review_index.md` and
  self-review note at `docs/review/ag36_self_review.md`
- the tracked AG 37 review index at `docs/review/ag37_review_index.md` and
  self-review note at `docs/review/ag37_self_review.md`
- the tracked AG 38 review index at `docs/review/ag38_review_index.md` and
  self-review note at `docs/review/ag38_self_review.md`
- the tracked AG 39 review index at `docs/review/ag39_review_index.md` and
  self-review note at `docs/review/ag39_self_review.md`
- the tracked AG 40 review index at `docs/review/ag40_review_index.md` and
  self-review note at `docs/review/ag40_self_review.md`
- the tracked AG 41 review index at `docs/review/ag41_review_index.md` and
  self-review note at `docs/review/ag41_self_review.md`
- VM chapter planning artifacts in `docs/processor/` and `config/`
- project-state docs in `docs/project-state/`
- runner / validator scripts in `scripts/`

These assets are intentionally lightweight and auditable. The raw source
documents remain external to Git.

## Validation Posture

- `npm run check` passes
- the scaffold previously reported 152 batches validated; the current run
  reports 162 batches validated
- the validator now checks the tracked VM-20, supporting, VM-21, VM-22,
  practice-note, AG 03, AG 01, AG 02, AG 04, AG 05, AG 06, AG 07, AG 08,
  AG 09, AG 10, AG 11, AG 12, AG 13, AG 14, AG 15, AG 16, AG 17, AG 18,
  AG 19, AG 20, AG 21, AG 22, AG 23, AG 24, AG 25, AG 26, AG 27, AG 28,
  AG 29, AG 30, AG 31, AG 32, AG 33, AG 34, AG 35, AG 36, AG 37, AG 38,
  AG 39, AG 40, AG 41, AG 42, AG 43, AG 44, AG 47, AG 48, and POC status
  summary handoff files
- review-only and no-promotion guardrails are enforced in the batch manifests
  and review packets
- ignored working outputs stay under `data/work/`
- `git diff --check` currently reports only the known CRLF normalization
  warnings in the working tree

## Human Review Posture

- Reviewers should start from the sixty review indexes listed above.
- The review packets remain the detailed evidence layer behind those
  summaries.
- All batch content remains source-bound and review-only unless a separate
  promotion workflow explicitly changes the status.
- No learner-facing status should be inferred from the presence of a batch or
  a review index alone.
- The review indexes are handoff aids, not promoted artifacts.

## AG 13 Note

AG 13 was added after the original POC package was first assembled. Its
tracked review index and self-review note are now part of the same review-only
hand-off set as the other completed waves.

## AG 14 Note

AG 14 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the historical surveillance procedure as a review-only note.

## AG 15 Note

AG 15 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the historical illustration guideline as a review-only note.

## AG 16 Note

AG 16 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the historical CRVM guideline as a review-only note.

## AG 17 Note

AG 17 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the historical CRVM non-level death-benefit guideline as a review-only note.

## AG 18 Note

AG 18 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the current CRVM continuous-basis guideline as a review-only note.

## AG 19 Note

AG 19 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the 1980 CSO mortality-table guideline as a review-only note.

## AG 20 Note

AG 20 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the seven-page joint-life-functions guideline as a review-only note. The blank page 3 separator remains a visible boundary marker, and the Actuarial Guideline XX Appendix 5 tables, including A5-1, A5-6, A5-7, and the equivalent equal ages language, remain review-only context.

## AG 21 Note

AG 21 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the one-page CRVM reserve-comparison guideline as a review-only note. The page-image backstop remains visible, and the Standard Valuation Law / modified net premiums / 1980 CSO Tables / full preliminary term method language remains review-only context.

## AG 22 Note

AG 22 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the one-page indeterminate premiums guideline as a review-only note. The page-image backstop remains visible, and the Standard Nonforfeiture Law / adjusted premiums / gross-premium schedules / maximum gross premiums language remains review-only context.

## AG 23 Note

AG 23 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the one-page separate account investments guideline as a review-only note. The page-image backstop remains visible, and the placeholder statutory reference, readily marketable assets, net investment income, `15%`, and `10%` language remains review-only context.

## AG 24 Note

AG 24 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the six-page variable life nonforfeiture values guideline as a review-only note. The page-image backstop remains visible, and the retrospective method, prospective method, surrender-charge caps, paid-up nonforfeiture benefits, and formula context remain review-only context.

AG 24 is now complete as batches `batch-102`, `batch-103`, and `batch-104`.
Its tracked review index and self-review note summarize the six-page guideline
without promoting any extracted content.

## AG 25 Note

AG 25 was added after the original POC package was first assembled. Its tracked review index and self-review note are now part of the same review-only hand-off set as the other completed waves, and they preserve the three-page indexed increasing death-benefits guideline as a review-only note. The page-image backstop remains visible, and the CPI-based annual increase assumptions, threshold amount language, low-amount exception, and formula context remain review-only context.

AG 25 is now complete as batch-105.
Its tracked review index and self-review note summarize the three-page guideline
without promoting any extracted content.

## AG 26 Note

AG 26 was added after the original POC package was first assembled. Its
tracked review index and self-review note are now part of the same
review-only hand-off set as the other completed waves, and they preserve the
one-page operative-dates guideline as a review-only note. The page-image
backstop remains visible, and the operative-date limitation, the dynamic
interest-rate boundary, and the Standard Valuation Law / Standard
Non-Forfeiture Law cross references remain review-only context.

AG 26 is now complete as batch-106.
Its tracked review index and self-review note summarize the one-page
guideline without promoting any extracted content.

## AG 27 Note

AG 27 was added after the original POC package was first assembled. Its
tracked review index and self-review note are now part of the same
review-only hand-off set as the other completed waves, and they preserve the
five-page accelerated-benefits guideline as a review-only note. The
page-image backstop remains visible, and the accelerated-benefits overview,
interest-accrual disclosure, lien mechanics, and AG 28 closing boundary
remain review-only context.

AG 27 is now complete as batches `batch-107`, `batch-108`, and `batch-109`.
Its tracked review index and self-review note summarize the five-page
guideline without promoting any extracted content.

## AG 28 Note

AG 28 was added after the AG 27 handoff was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves, and they preserve the survivor
income benefit reserve guideline as a review-only note. The page-image
backstop remains visible, and the reserve approximation, survivor income
benefit framing, and closing boundary remain review-only context.

AG 28 is now complete as batch `batch-110`. Its tracked review index and
self-review note summarize the one-page guideline without promoting any
extracted content.

## AG 29 Note

AG 29 was added after the AG 28 package was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, and the rehabilitation / court-order wording stays review-only
context until a human reviewer confirms the wording against the page image.

## AG 30 Note

AG 30 was added after the AG 29 package was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, and the plan type / C-3-risk wording stays review-only context until
a human reviewer confirms the wording against the page image.

## AG 31 Note

AG 31 was added after the AG 30 package was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, and the policy form approval caveat and annual statement reserve
context stay review-only until a human reviewer confirms the wording against
the page image.

## AG 32 Note

AG 32 was added after the AG 31 package was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, and the immediate-payment reserve guidance and AG 33 boundary stay
review-only until a human reviewer confirms the wording against the page
image.

## AG 33 Note

AG 33 was added after the AG 32 package was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, and the elective-benefit CARVM foundation, mechanics, and AG 34
boundary stay review-only until a human reviewer confirms the wording
against the page image.

## AG 34 Note

AG 34 was added after the AG 33 package was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, and the MGDB reserve foundation, mortality-basis slice, mortality
tables, and AG 35 boundary stay review-only until a human reviewer confirms
the wording against the page image.

## AG 35 Note

AG 35 was added after the AG 34 package was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, and the CARVM foundation, hedged-as-required slice, certification
slice, and AG 36 boundary stay review-only until a human reviewer confirms
the wording against the page image.

## AG 36 Note

AG 36 was added after the AG 35 package was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, and the foundation, mechanics, hedged-as-required, certification,
and AG 37 boundary slices stay review-only until a human reviewer confirms
the wording against the page image.

## AG 37 Note

AG 37 was added after the AG 36 handoff was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, the line references were not available, and the background,
reserve-entry, and effective-date slices stay review-only until a human
reviewer confirms the wording against the page image.

## AG 38 Note

AG 38 was added after the AG 37 handoff was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, the line references were not available, and the background,
example-mechanics, deterministic-step, and opinion / closeout slices stay
review-only until a human reviewer confirms the wording against the page
image.

## AG 39 Note

AG 39 was added after the AG 38 handoff was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image backstop remains
visible, the line references were not available, and the background,
reserve-language, reinsurance, and asset-adequacy slice stays review-only
until a human reviewer confirms the wording against the page image. AG 40
remains the next likely candidate if the continuation pass keeps going.

## AG 40 Note

AG 40 was added after the AG 39 handoff was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image wording backstop
remains visible, line references were not available, and the bailout-
provision background, reserve / valuation-interest control slice, and AG 41
boundary stay review-only until a human reviewer confirms the wording
against the page image. AG 40 is complete as batches `batch-135` and
`batch-136`, and the tracked review index and self-review note are
`docs/review/ag40_review_index.md` and `docs/review/ag40_self_review.md`.

## AG 41 Note

AG 41 was added after the AG 40 handoff was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image wording backstop
remains visible, line references were not available, and the
background/scope/projection slice stays review-only until a human reviewer
confirms the wording against the page image. AG 41 is complete as batch
`batch-137`, and the tracked review index and self-review note are
`docs/review/ag41_review_index.md` and `docs/review/ag41_self_review.md`.

## AG 42 Note

AG 42 was added after the AG 41 handoff was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image wording backstop
remains visible, line references were not available, and the
background/scope/assessment slice stays review-only until a human reviewer
confirms the wording against the page image. AG 42 is complete as batches
`batch-138` and `batch-139`, and the tracked review index and self-review
note are `docs/review/ag42_review_index.md` and `docs/review/ag42_self_review.md`.

## AG 43 Note

AG 43 was added after the AG 42 handoff was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image wording backstop
remains visible, line references were not available, and the
background/scope/CTE/calibration/hedging/mortality slices stay review-only
until a human reviewer confirms the wording against the page image. AG 43 is
complete as batches `batch-140`, `batch-141`, `batch-142`, `batch-143`,
`batch-144`, `batch-145`, `batch-146`, `batch-147`, and `batch-148`, and the
tracked review index and self-review note are
`docs/review/ag43_review_index.md` and `docs/review/ag43_self_review.md`.

## AG 44 Note

AG 44 was added after the AG 43 handoff was already in place. Its tracked
review index and self-review note are now part of the same review-only
hand-off set as the other completed waves. The page-image wording backstop
remains visible, line references were not available, and the
opening-guidance, attachment-table, and AG 45 boundary slices stay review-
only until a human reviewer confirms the wording against the page image.
AG 44 is complete as batches `batch-149` and `batch-150`, and the tracked
review index and self-review note are `docs/review/ag44_review_index.md`
and `docs/review/ag44_self_review.md`.

## AG 45 Note

AG 45 is complete as batch-151 in ignored working storage. Its tracked
review index and self-review note are now part of the handoff set. The page-
image wording backstop remains visible because the text layer is encoding-
noisy, line references were not available, and AG 46 is the next likely
candidate if the continuation pass keeps going.

## AG 46 Note

AG 46 is complete as batch-152 in ignored working storage. Its tracked
review index and self-review note are now part of the handoff set. The page-
image wording backstop remains visible because the text layer is encoding-
noisy, line references were not available. AG 47 is complete as batch-153 in
ignored working storage, and its tracked review index and self-review note are
now part of the handoff set. AG 48 is complete as batches `batch-154`,
`batch-155`, and `batch-156` in ignored working storage, and its tracked
review index and self-review note are now part of the handoff set. AG 49 is
complete as batches `batch-157`, `batch-158`, and `batch-159` in ignored
working storage, and its tracked review index and self-review note are now
part of the handoff set: `docs/review/ag49_review_index.md` and
`docs/review/ag49_self_review.md`.

## AG 47 Note

AG 47 is complete as batch-153 in ignored working storage. Its tracked
review index and self-review note are now part of the handoff set:
`docs/review/ag47_review_index.md` and `docs/review/ag47_self_review.md`.
The page-image wording backstop remains visible because the text layer is
encoding-noisy, line references were not available. AG 48 is complete as
batches `batch-154`, `batch-155`, and `batch-156` in ignored working storage,
and its tracked review index and self-review note are now part of the handoff
set: `docs/review/ag48_review_index.md` and `docs/review/ag48_self_review.md`.
The page-image wording backstop remains visible because the text layer is
encoding-noisy, line references were not available, the 2021 Law Manual
reprint stayed out of scope, and AG 49 is now complete as batches
`batch-157`, `batch-158`, and `batch-159` in ignored working storage. Its
tracked review index and self-review note are now part of the handoff set:
`docs/review/ag49_review_index.md` and `docs/review/ag49_self_review.md`.

## AG 48 Note

AG 48 is complete as batches `batch-154`, `batch-155`, and `batch-156` in
ignored working storage. Its tracked review index and self-review note are
now part of the handoff set: `docs/review/ag48_review_index.md` and
`docs/review/ag48_self_review.md`. The page-image wording backstop remains
visible because the text layer is encoding-noisy, line references were not
available, the 2021 Law Manual reprint stayed out of scope, and AG 49 is now
complete as batches `batch-157`, `batch-158`, and `batch-159` in ignored
working storage. Its tracked review index and self-review note are now part
of the handoff set: `docs/review/ag49_review_index.md` and
`docs/review/ag49_self_review.md`.

## AG 49 Note

AG 49 is complete as batches `batch-157`, `batch-158`, and `batch-159` in
ignored working storage. Its tracked review index and self-review note are
now part of the handoff set: `docs/review/ag49_review_index.md` and
`docs/review/ag49_self_review.md`. The page-image wording backstop remains
visible because the text layer is encoding-noisy, line references were not
available, the 2021 Law Manual reprint stayed out of scope, and AG 50 is the
next likely candidate if the continuation pass keeps going.

## AG 50 Note

AG 50 is complete as batches `batch-160`, `batch-161`, and `batch-162` in
ignored working storage. Its tracked review index and self-review note are
now part of the handoff set: `docs/review/ag50_review_index.md` and
`docs/review/ag50_self_review.md`. The page-image wording backstop remains
visible because the text layer is encoding-noisy, line references were not
available, the 2013 IDI Valuation Table reprint stayed out of scope, and AG
51 is complete as batches `batch-163` and `batch-164` in ignored working
storage. Its tracked review index and self-review note are now part of the
handoff set: `docs/review/ag51_review_index.md` and
`docs/review/ag51_self_review.md`. The page-locator backstop remained
visible because stable line references were not available, the page-image
wording backstop remained visible, and AG 53 is complete as batches
`batch-165`, `batch-166`, and `batch-167` in ignored working storage.

## AG 53 Note

AG 53 is complete as batches `batch-165`, `batch-166`, and `batch-167` in
ignored working storage. Its tracked review index and self-review note are
now part of the handoff set: `docs/review/ag53_review_index.md` and
`docs/review/ag53_self_review.md`. The page-locator backstop remained
visible because stable line references were not available, the page-image
wording backstop remained visible, and AG 54 is now complete as batches
`batch-168`, `batch-169`, and `batch-170` in ignored working storage.

## AG 54 Note

AG 54 is complete as batches `batch-168`, `batch-169`, and `batch-170` in
ignored working storage. Its tracked review index and self-review note are
now part of the handoff set: `docs/review/ag54_review_index.md` and
`docs/review/ag54_self_review.md`. The paragraph-locator backstop remained
visible because line references were preserved, and AG 55 is now the next
likely candidate if the continuation pass keeps going.

## AG 51 Note

AG 51 is complete as batches `batch-163` and `batch-164` in ignored working
storage. Its tracked review index and self-review note are now part of the
handoff set: `docs/review/ag51_review_index.md` and
`docs/review/ag51_self_review.md`. The page-locator backstop remained
visible because stable line references were not available, the future VM-30
incorporation note stayed review-only context, and AG 53 is the next likely
candidate if the continuation pass keeps going.

## Promotion Gates

The next gated choices are still the same:

- keep review-only
- revise extraction
- create selected learner-facing draft candidates
- create selected RAG-ready candidates
- create selected app-export candidates

Any promotion should happen in the separate app/product thread after explicit
human review of the source-bound evidence.

## Remaining Work

The proof-of-concept pipeline is complete for the controlled waves in this
workspace, but future work may still include:

- any additional Valuation Manual chapters that are approved later
- any additional Practice Notes, Actuarial Guidelines, or NY regulations that
  are approved later
- future pricing repository work
- future liability-modeling repository work
- a framework layer that can align liability, valuation-regulation, and
  pricing repositories
- later Copilot Studio portability considerations

## Recommended Next Step

Review the proof-of-concept package first. If the stakeholder decision is to
expand rather than pause, the next gated step should be to select the next
small Actuarial Guideline or NY regulation source unit and continue the same
review-only workflow. If the broader roadmap needs to split by domain, the
clean follow-on is to start a pricing repository or a liability-modeling
repository as a separate family.
