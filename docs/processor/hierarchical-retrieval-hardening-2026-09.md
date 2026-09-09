# Review-only hierarchical retrieval hardening

Starting revision: `ffb651669d17e7334117a9c664d1290e0aeda36c`.

## Protocol frozen after development

The four systems use the unchanged corrected evidence units and existing local E5 document/query vectors. Model: `intfloat/e5-base-v2`, revision `f52bf8ec8c7124536f0efb74aca902b2995e5bcd`, MIT, local CPU dynamic INT8. No embedding or passage changes were made. Gold V3 is unchanged.

- A: existing flat BM25/vector RRF, k=60, equal weights. Every baseline selected child and accepted-target rank is checked against the published Gold V3 results.
- B: parent BM25 fused with parent semantic rank (maximum cosine similarity among direct children), k=60, equal weights. Keep at most two sources and three direct structural parents. Recompute child RRF ranks within those candidates, using the unchanged corpus-wide BM25 statistics. There is no unrestricted fallback child list.
- C: B with exact query identifier routing before the parent cap. SSAP identifiers match structural ancestry, including numeric token boundaries; worksheet names and schedule/template markers match structural metadata. Unmatched markers fall back to B. No expected source, parent, child, category, or accepted evidence enters these functions.
- D: C plus query-derived evidence needs: REQUIREMENT_PLUS_SCOPE, REQUIREMENT_PLUS_EXCEPTION, TABLE_HEADER_PLUS_DATA, DEFINITION_PLUS_REQUIREMENT, MULTIPLE_REQUIREMENTS, COMPARISON. The planner can emit multiple needs. Assembly starts with C's selected child, adds its linked table header when needed, considers two ranked/numeric-range table units, fills missing roles from the selected parents, and considers up to three ranked children for comparison/multiple requirements. All evidence must belong to the three selected parents. The package is capped at six distinct evidence IDs and 16,000 characters. Ranking is identical for C and D.

Parent semantics is a late-interaction aggregate over existing child vectors, not newly embedded parent passages. Root or worksheet parents without direct children are excluded from the candidate list; ancestor identifiers remain available for exact routing. Candidate pruning can lose a correct target permanently; this cost is measured rather than hidden with a flat fallback.

The source stage uses the two highest-ranked distinct sources represented in the parent ranking. It is not a separately trained source classifier, and has no authority promotion semantics.

Development used 36 supported cases; holdout has 24. The architecture-freeze artifact binds implementation/configuration hashes and the development-results hash. Holdout ranking refuses to run until the freeze exists in Git and all bound files match. Queries are filtered by the orchestration split, then only text and vectors enter ranking. Gold accepted IDs are loaded by a separate scoring command after rankings and packages have been persisted.

## Metrics

Target Top-k and exact-parent use C/D's first ranked child, not source success. Wrong-section means first child has the expected source but a parent outside the accepted set. Accepted-evidence recall credits any one alternative accepted target plus each exact required supporting ID, divided by one plus the number of required supporting IDs. Package precision is the fraction of returned distinct IDs in the accepted-or-required set. Complete package requires an accepted target anywhere in the package and all exact required IDs. Merely matching a role never counts as complete evidence. This package metric is reported separately from first-child accuracy; it differs from older context metrics that required the selected child itself to be accepted.

The public JSON includes counts and rates, source/category/modality/target-type slices, and case IDs. Private ranking/package artifacts are under the existing approved root, in `hierarchical-retrieval-hardening-2026-09`. Public artifacts contain only IDs, hashes, classifications, counts, and metrics.

## Development findings before freeze

| System | Target Top-1 | Top-3 | Exact parent | Wrong section | Complete package | Evidence recall | Package precision |
|---|---:|---:|---:|---:|---:|---:|---:|
| A | 14/36 | 19/36 | 21/36 | 10/36 | 14/36 | 47.2% | 55.6% |
| B | 14/36 | 20/36 | 23/36 | 9/36 | 13/36 | 47.2% | 58.3% |
| C | 16/36 | 24/36 | 25/36 | 7/36 | 15/36 | 54.2% | 66.7% |
| D | 16/36 | 24/36 | 25/36 | 7/36 | 22/36 | 65.3% | 52.4% |

One architecture configuration was implemented and evaluated in development. No parameter search was performed. These gains justify evaluating the fixed design on holdout, while the package precision tradeoff warrants continued review.

## Holdout results after freeze

Freeze commit: `bbc4487`. No architecture/configuration changes followed holdout access.

| System | Target Top-1 | Top-3 | Exact parent | Wrong section | Complete package | Evidence recall | Package precision |
|---|---:|---:|---:|---:|---:|---:|---:|
| A | 13/24 (54.2%) | 15/24 (62.5%) | 17/24 (70.8%) | 5/24 (20.8%) | 13/24 (54.2%) | 60.4% | 66.7% |
| B | 12/24 (50.0%) | 15/24 (62.5%) | 16/24 (66.7%) | 6/24 (25.0%) | 12/24 (50.0%) | 56.3% | 62.5% |
| C | 12/24 (50.0%) | 15/24 (62.5%) | 17/24 (70.8%) | 5/24 (20.8%) | 12/24 (50.0%) | 58.3% | 66.7% |
| D | 12/24 (50.0%) | 15/24 (62.5%) | 17/24 (70.8%) | 5/24 (20.8%) | 14/24 (58.3%) | 62.5% | 48.6% |

All four systems have source Top-1 22/24 and wrong-source 2/24. The previously published flat hybrid-plus-parent comparator remains stronger at source Top-1 23/24 and exact-parent 18/24; it is historical context, not system A. A is the requested flat hybrid RRF baseline. Its selected children and target ranks reproduced the published Gold V3 values exactly.

Holdout MRR: A 0.6115, B 0.5878, C/D 0.5931. Target Top-5: A 17/24, B 18/24, C/D 19/24. Top-10: A 19/24, B/C/D 20/24. Authority/support correctness is 23/24 for each system; citation coordinates are valid for all selected children. Target-citation correctness tracks target Top-1, so valid coordinates alone do not imply a correct citation target.

## Unique and multi-unit cases

| Split/type | System | Target Top-1 | Top-3 | Exact parent | Wrong section | Complete package | Evidence recall | Package precision |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Development unique (27) | A | 14/27 | 18/27 | 15/27 | 8/27 | 14/27 | 51.9% | 51.9% |
| Development unique (27) | B | 13/27 | 19/27 | 15/27 | 8/27 | 13/27 | 48.1% | 48.1% |
| Development unique (27) | C | 15/27 | 19/27 | 16/27 | 7/27 | 15/27 | 55.6% | 55.6% |
| Development unique (27) | D | 15/27 | 19/27 | 16/27 | 7/27 | 16/27 | 59.3% | 49.5% |
| Development multi-unit (9) | A | 0/9 | 1/9 | 6/9 | 2/9 | 0/9 | 33.3% | 66.7% |
| Development multi-unit (9) | B | 1/9 | 1/9 | 8/9 | 1/9 | 0/9 | 44.4% | 88.9% |
| Development multi-unit (9) | C | 1/9 | 5/9 | 9/9 | 0/9 | 0/9 | 50.0% | 100.0% |
| Development multi-unit (9) | D | 1/9 | 5/9 | 9/9 | 0/9 | 6/9 | 83.3% | 61.1% |
| Holdout unique (18) | A | 12/18 | 14/18 | 13/18 | 4/18 | 12/18 | 66.7% | 66.7% |
| Holdout unique (18) | B | 11/18 | 13/18 | 12/18 | 5/18 | 11/18 | 61.1% | 61.1% |
| Holdout unique (18) | C | 11/18 | 13/18 | 12/18 | 5/18 | 11/18 | 61.1% | 61.1% |
| Holdout unique (18) | D | 11/18 | 13/18 | 12/18 | 5/18 | 11/18 | 61.1% | 48.1% |
| Holdout multi-unit (5) | A | 0/5 | 0/5 | 3/5 | 1/5 | 0/5 | 30.0% | 60.0% |
| Holdout multi-unit (5) | B | 0/5 | 1/5 | 3/5 | 1/5 | 0/5 | 30.0% | 60.0% |
| Holdout multi-unit (5) | C | 0/5 | 1/5 | 4/5 | 0/5 | 0/5 | 40.0% | 80.0% |
| Holdout multi-unit (5) | D | 0/5 | 1/5 | 4/5 | 0/5 | 2/5 | 60.0% | 40.0% |

The one holdout case with multiple equivalent targets succeeds under all four systems. It is reported separately from the 18 unique cases and five multi-unit cases. All Gold V3 multi-unit cases are XLSX header/data cases; gains here do not establish effectiveness on requirement/exception or comparison packages. The six planner types have synthetic coverage, but several lack real multi-unit Gold coverage.

A3 holdout (8): every system has target Top-1 5/8, Top-3 5/8, exact parent 6/8, and wrong section 2/8. The development routing gain did not improve A3 holdout section accuracy. XLSX holdout (9): all systems have target Top-1 3/9; C/D improve exact parent to 7/9 from A's 6/9, and D improves complete package to 5/9 from 3/9. PDF holdout (15): B/C/D lose one Top-1 target versus A (9/15 versus 10/15).

Candidate pruning removes every accepted target for 5/36 development cases under B and 6/36 under C/D; holdout loses 4/24 under B/C/D. Flat A ranks the full corpus and loses none from its candidate list. This is a concrete limitation of the three-parent gate. Package D averages 1.92 evidence IDs in development and 1.83 in holdout; package precision nevertheless falls, showing that even small additions need better evidence selection.

## Decision and limitations

Keep flat hybrid RRF as the primary baseline. The tested hierarchy does not justify replacing it: holdout target Top-1 and MRR regress, wrong-section rate does not improve, and source routing does not match the historical hybrid-plus-parent result. The bounded assembly experiment provides a useful but limited result: complete multi-unit capture rises from 0/5 to 2/5, with only 40% multi-unit package precision. No parameters were adjusted after observing these results.

The next review should examine the four parent-gate misses and evidence selection within correctly retrieved parents. A broader architecture claim requires more independently adjudicated multi-unit cases across the remaining planner types. Gold V3 remains frozen; this milestone creates no new gold labels, unsupported threshold, answer-generation layer, hosted model dependency, raw-source change, canonical promotion, or authority change.

Detailed machine-readable results are in `data/processed/review_packages/hierarchical-retrieval-hardening-2026-09/`. Regression evidence, byte-determinism evidence, and the external-artifact manifest accompany the development and holdout results.

## Validation and reproducibility

Architecture freeze commit: `bbc4487bc0d784203c423c0b02c2ab641900e68d`. All 14 regression suites passed, including the repository processor/acquisition/rights/vector checks, parent-child and retrieval-hardening tests, semantic-evidence determinism, Gold V2 validation, Gold V3 integrity/evaluation checks, legacy vector determinism verification, and new hierarchy synthetic tests. The hierarchy integrity validator separately checks the committed freeze, historical artifact preservation, candidate/package bounds and lineage, exact evidence scoring, public rights safety, and byte-identical development/holdout ranking reruns.

The existing E5 model/revision, local CPU dynamic INT8 provenance, passages, and document/query embeddings were reused unchanged; this milestone performed no model download or embedding generation. Legacy vector determinism verification checks the existing original/rerun artifacts, while hierarchy determinism was freshly rerun for both splits.

| Artifact | SHA-256 | Private bytes |
|---|---|---:|
| Development rankings | `79ccfc3702bae8625b533bc5e06dcace7fe3247a4b3b40d07961cd1dc0934c6d` | 81,658,270 |
| Holdout rankings | `93f77f0f48c1f664ad779c3588b65070b150e2da33c6e1c0f9d2938ce0db2618` | 54,543,568 |
| Reused document vectors | `a64d5193a3dba7b36fa2247524aec6754b428cb3b6608752716e8591bbd3c481` | 43,324,416 |
| Reused query vectors | `8f1c8b538757cd1dc9c542ba58c92a6131be615ce0cb813c7a595424d3dcedef` | 230,400 |
| Reused exact index | `5b5295a6b918afd5273762e0cd16326e34d6a895a9704a9b69987940710015dc` | 508,062 |

The seven-artifact manifest totals 180,384,908 bytes, including reused private queries/adjudication. This is the enumerated evaluation dependency total, not the entire source/model directory size; private diagnostic logs are additional. New ranking artifacts total 136,201,838 bytes. No private artifact is committed to Git.

Reproduce checks with `npm run hierarchical:validate`, `npm run hierarchical:determinism`, and `npm run hierarchical:regressions`. Development/holdout commands reproduce the frozen experiment; they do not authorize tuning. The freeze command intentionally refuses to overwrite the existing freeze.

Final pre-commit hygiene: `git diff --check` passed. `git fsck --full` exited 0; its 2,326 diagnostic lines were dangling-object notices only, with no reported corruption. Historical processed artifacts have no changes relative to the starting revision. No cleanup or history rewrite was performed.
