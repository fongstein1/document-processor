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
