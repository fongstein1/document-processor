# Semantic Evidence Unit Correction — 2026-09

## Status and boundary

This review-only milestone starts from retrieval-hardening commit `44d96ff8f9212d2d67709c428909223022b2d76f`. It corrects the evidence-unit and evaluation architecture before any hybrid or vector experiment. It does not acquire sources, modify raw source bytes, promote content, create learner-facing output, or enable production RAG.

The prior 24-development/15-holdout evaluation remains preserved as `EVALUATION_V1`. `EVALUATION_V2` was frozen in commit `da8276d` before semantic subdivision or retrieval behavior changed. Its final gold records are explicit IDs and hashes; no regular expression is rerun to select gold during evaluation.

## Gold V2

All 39 V1 cases were audited against private source evidence. V2 includes 17 cases: 14 have one accepted evidence unit and 3 require multiple units. Thirteen ambiguous cases and nine cases invalid under an independently defensible evidence boundary were excluded. The included cases were frozen as six development and eleven holdout cases. Natural-language queries, source excerpts, and adjudication rationale remain private; Git retains only IDs, hashes, coordinates, counts, status, and lineage.

The exclusions are an important limitation rather than a score-management device. V2 is smaller but more trustworthy. Any future expansion must use the same independent adjudication process and must be frozen before retrieval changes.

## Corrected evidence architecture

PDF processing now creates document roots, major structural parents, bounded subsection/logical-block parents where reliable, and retrieval children whose labels describe the actual evidence used to set their boundaries. Deterministic signals include explicit identifiers, headings, numbered paragraphs, bullets, definitions, tables/forms, instructions, and bounded paragraph grouping. A page window is retained explicitly as `STRUCTURAL_PARENT_PAGE_WINDOW_CHILD`; it is not labeled semantic.

The current PDF result is 1,041 parents and 13,830 children. Child representations are:

- 515 definition children
- 88 instruction children
- 2,459 numbered-requirement children
- 6,266 paragraph-group children
- 3,737 table children
- 765 structural page-window fallback children

PDF retrieval children average 70.49 tokens, with a median of 48 and a maximum of 358. Source page spans are retained conservatively when more precise paragraph-level page attribution is unavailable.

Workbook processing now reconstructs children from only cells inside their declared row and column bounds. It separates bounded header evidence, groups coherent data rows without making every cell a child, and records exact cell references, counts, merged-range intersections, source SHA, and deterministic hashes. Across the three proving-ground workbooks there are 99 table/block parents and 273 children: 66 single-child parents, 33 multi-child parents, 2.76 average children per table parent, median 1, and maximum 11. The bounded evidence accounts for 53,141 non-empty/value cells and 32,633 formula cells. There are 99 private header contexts represented in Git by coordinates, IDs, and hashes only.

The existing `XLSX_NON_CELL_CONTENT_REQUIRES_REVIEW` behavior is preserved. Semantic subdivision cannot clear a native-package exception.

## Context and retrieval

Evidence roles are deterministic retrieval signals, not legal conclusions: scope/applicability, definition, requirement, exception/qualification, table/schedule, reporting instruction, header context, continuation, and other. Query intent is inferred only from the query. Evaluation category and expected IDs are not passed to ranking or context expansion.

Context expansion is bounded to the selected child, same-parent role candidates, a justified ancestor relationship, real workbook header context, or source-order continuation. It records the selected context ID, role, distance, relationship, and reason. Substantive parent, child, header, and context text remains external/private.

BM25 uses the existing `k1=1.2` and `b=0.75` configuration for the first corrected-unit evaluation. Field-length normalization is per field. Phrase matching uses meaningful query and identifier phrases rather than requiring the full natural-language query verbatim. Tests cover IDF, repeated-term TF, length normalization, regulatory identifiers, phrase behavior, deterministic ties, and a case where parent score changes ranking.

## Structure ablation

The frozen V2 cases compare five systems without changing BM25 parameters first:

| System | Representation |
| --- | --- |
| A | old page windows + current BM25 |
| B | old semantic representation from `44d96ff` + current BM25 |
| C | corrected semantic evidence units + current BM25 |
| D | corrected units + parent-aware rerank |
| E | corrected units + parent-aware rerank + role-aware context |

### Development (6 cases)

| Metric | A | B | C | D | E |
| --- | ---: | ---: | ---: | ---: | ---: |
| Source Top-1 | 0.500 | 0.167 | 0.167 | 0.167 | 0.167 |
| Source Top-3 | 0.500 | 0.333 | 0.333 | 0.333 | 0.333 |
| Source Top-5 | 0.500 | 0.500 | 0.333 | 0.333 | 0.333 |
| Accepted target Top-1 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| Accepted target Top-3 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| Accepted target Top-5 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| Accepted target Top-10 | 0.000 | 0.167 | 0.000 | 0.000 | 0.000 |
| Accepted target MRR | 0.0205 | 0.0235 | 0.0042 | 0.0046 | 0.0046 |
| Exact parent rate | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| Wrong-source rate | 0.500 | 0.833 | 0.833 | 0.833 | 0.833 |
| Target citation correctness | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| Citation-coordinate validity | 0.667 | 1.000 | 1.000 | 1.000 | 1.000 |

### Holdout (11 cases)

| Metric | A | B | C | D | E |
| --- | ---: | ---: | ---: | ---: | ---: |
| Source Top-1 | 0.364 | 0.364 | 0.455 | 0.545 | 0.545 |
| Source Top-3 | 0.818 | 0.545 | 0.545 | 0.545 | 0.545 |
| Source Top-5 | 0.909 | 0.818 | 0.636 | 0.636 | 0.636 |
| Accepted target Top-1 | 0.091 | 0.091 | 0.182 | 0.182 | 0.182 |
| Accepted target Top-3 | 0.364 | 0.273 | 0.273 | 0.273 | 0.273 |
| Accepted target Top-5 | 0.364 | 0.273 | 0.273 | 0.273 | 0.273 |
| Accepted target Top-10 | 0.545 | 0.364 | 0.364 | 0.364 | 0.364 |
| Accepted target MRR | 0.2629 | 0.1929 | 0.2487 | 0.2558 | 0.2558 |
| Exact parent rate | 0.000 | 0.000 | 0.182 | 0.182 | 0.182 |
| Wrong-source rate | 0.636 | 0.636 | 0.545 | 0.455 | 0.455 |
| Wrong-section rate | 0.000 | 0.273 | 0.273 | 0.364 | 0.364 |
| Target citation correctness | 0.000 | 0.091 | 0.182 | 0.182 | 0.182 |
| Citation-coordinate validity | 0.818 | 1.000 | 1.000 | 1.000 | 1.000 |

The corrected units improve holdout accepted-target Top-1 and exact-parent selection over both historical representations, and parent reranking improves holdout source Top-1. They regress development retrieval and holdout Top-3/5/10 against page windows. Role-aware context raises holdout required-role recall from 0.455 to 0.545 and context precision from 0.182 to 0.227, but complete-context capture remains 0. This is not production-retrieval evidence.

## Source-specific observations

- **A3:** multiple deterministic SSAP/section parents are represented without allowing children to cross parent page bounds. Coverage remains heuristic; 716 page-window fallback children remain alongside semantic children.
- **W07:** schedule/form structure is mostly represented as bounded table/form children. Five page-window fallbacks remain.
- **W08:** instruction and section signals support semantic units, with 44 page-window fallbacks retained where evidence is insufficient.
- **VM-20 workbook:** 16 bounded header contexts and 48 bounded row-range children provide coherent table evidence.
- **VM-31 workbook:** many small template blocks legitimately remain single-child parents; two larger blocks are subdivided and all 63 block headers are bounded.
- **SOA workbook:** 15 bounded header children and 123 bounded row-range children preserve support-only role lineage.

## Integrity and rights

Validation requires zero duplicate IDs, orphan children, parent cycles, source or SHA mismatches, PDF parent-boundary crossings, workbook sheet/block crossings, out-of-range cell references, and unexplained workbook-cell union differences. Public artifacts are allowlisted non-content evidence. Private artifacts are SHA- and byte-bound under `C:\Dev\Document Processor Sources\_processed-private\semantic-evidence-unit-correction-2026-09`.

The architecture remains `REVIEW_ONLY`, `not_promoted`, and not RAG-ready. Its trusted outcome is evidence-boundary and evaluation integrity, not high retrieval quality.

