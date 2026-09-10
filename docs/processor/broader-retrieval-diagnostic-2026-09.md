# Broader Retrieval Diagnostic (2026-09)

## Decision

The sharp performance difference is real and is mostly explained by evaluation-population shift plus source/section routing, not by a single broken retriever component. Gold V3 is substantially more direct, identifier-rich, lexically aligned, and balanced across sources/modalities. Multi-Unit Gold V1 is PDF/A3-heavy, nearly entirely paraphrased or abstract, structurally multi-part, and sparse in explicit identifiers. The controls are shorter still, have the lowest lexical alignment, and fail primarily at source routing.

The strongest evaluator-only result is conditional rank collapse. Hybrid median accepted-target rank changes from 6.5 globally to 2.5 in the correct source and 1 in the accepted parent for Multi-Unit development; from 6 to 6 to 1 for Multi-Unit holdout; and from 21 to 5 to 2 for controls. This indicates that accepted children are usually competitive once the correct section is supplied. A soft structural-routing/section-discrimination investigation is therefore more strongly supported than blanket rechunking or a new model family. This is a diagnostic conclusion, not authorization to use Gold-informed routing.

Gold V3 and Multi-Unit Gold V1 holdouts remain consumed and descriptive only. Any future experiment requires a newly frozen boundary.

## Frozen protocol and inputs

The diagnostic protocol was frozen in commit `f260650` before aggregate results were inspected. It binds the starting SHA `e80a6172dd38ea02bf7170b3079de158e789e30c`, rank cutoffs, descriptive feature thresholds, failure taxonomy, immutable-input checks, evaluator-only oracle boundary, and external-private storage root.

The diagnostic reuses complete frozen Gold V3 BM25/vector/hybrid Top-100 rankings. It recomputes the same three Multi-Unit rankings from the already frozen queries, document/query vectors, BM25 code/configuration, and RRF code/configuration. Gold targets enter only during post-ranking analysis. Protected Gold, retriever, corpus, and sidecar files are byte-equal to the starting commit.

## Population shift

`DIRECT_OR_STRUCTURAL` is a deterministic descriptive label: the query contains a detected structural identifier or has query/evidence lexical Jaccard at least 0.18. It is not an adjudicated difficulty label. Lexical and identifier measurements remain private at case level; only aggregates are committed.

| Population | n | PDF | A3 | Direct/structural | Mean query chars | Mean lexical Jaccard | Mean query/evidence token recall | Mean heading token recall | Mean identifiers |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Gold V3 development | 36 | 58.3% | 33.3% | 77.8% | 105.4 | 0.154 | 0.458 | 0.082 | 0.694 |
| Gold V3 holdout | 24 | 62.5% | 33.3% | 70.8% | 114.3 | 0.139 | 0.474 | 0.100 | 0.458 |
| Multi-Unit development | 21 | 85.7% | 66.7% | 14.3% | 103.7 | 0.082 | 0.451 | 0.050 | 0.095 |
| Multi-Unit holdout | 14 | 71.4% | 57.1% | 7.1% | 99.9 | 0.078 | 0.454 | 0.063 | 0.143 |
| Single-unit controls | 10 | 70.0% | 40.0% | 10.0% | 58.1 | 0.062 | 0.337 | 0.048 | 0.100 |

The multi-unit queries do not have dramatically lower query-token recall than Gold V3. Their lower Jaccard instead reflects more concepts and two or three accepted evidence units, while the large loss in explicit identifiers and parent-heading alignment is more discriminating. The controls combine short phrasing with both the lowest token recall and almost no identifiers.

Gold V3 is 60% PDF and one-third A3. Multi-Unit Gold is 80% PDF and 62.9% A3. This increases long-document sibling-section pressure. Multi-Unit cases require a mean 2.06 accepted units and 1.66 roles; Gold V3 is primarily single-target. These are measured distribution differences, not merely a claim that the later questions are harder.

## Primary flat-hybrid failure stages

The primary stage is mutually exclusive and based on the hybrid Top-1 result. Deep reachability and signal diagnoses are separate flags.

| Population | Success | Source miss | Right source, wrong parent | Right parent, wrong child |
|---|---:|---:|---:|---:|
| Gold V3 development | 14/36 (38.9%) | 5 (13.9%) | 10 (27.8%) | 7 (19.4%) |
| Gold V3 holdout | 13/24 (54.2%) | 2 (8.3%) | 5 (20.8%) | 4 (16.7%) |
| Multi-Unit development | 3/21 (14.3%) | 9 (42.9%) | 5 (23.8%) | 4 (19.0%) |
| Multi-Unit holdout | 3/14 (21.4%) | 2 (14.3%) | 7 (50.0%) | 2 (14.3%) |
| Single-unit controls | 0/10 | 6 (60.0%) | 3 (30.0%) | 1 (10.0%) |

Multi-Unit development and controls expose a source-routing weakness that is largely absent from Gold V3. The Multi-Unit holdout instead exposes same-source wrong-section behavior. These are different manifestations of low structural specificity and must not be collapsed into one accuracy number.

## Target reachability by system

| Population / system | Top-1 | Top-3 | Top-5 | Top-10 | Top-20 | Top-50 | Top-100 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Gold V3 dev / BM25 | 41.7% | 50.0% | 52.8% | 52.8% | 72.2% | 86.1% | 97.2% |
| Gold V3 dev / vector | 38.9% | 52.8% | 52.8% | 61.1% | 66.7% | 72.2% | 83.3% |
| Gold V3 dev / hybrid | 38.9% | 52.8% | 58.3% | 63.9% | 66.7% | 91.7% | 97.2% |
| Gold V3 holdout / BM25 | 41.7% | 70.8% | 70.8% | 75.0% | 75.0% | 83.3% | 95.8% |
| Gold V3 holdout / vector | 41.7% | 62.5% | 62.5% | 75.0% | 79.2% | 83.3% | 87.5% |
| Gold V3 holdout / hybrid | 54.2% | 62.5% | 70.8% | 79.2% | 83.3% | 91.7% | 95.8% |
| Multi-Unit dev / BM25 | 9.5% | 14.3% | 14.3% | 23.8% | 33.3% | 47.6% | 71.4% |
| Multi-Unit dev / vector | 14.3% | 28.6% | 38.1% | 47.6% | 52.4% | 57.1% | 76.2% |
| Multi-Unit dev / hybrid | 14.3% | 23.8% | 33.3% | 52.4% | 57.1% | 76.2% | 76.2% |
| Multi-Unit holdout / BM25 | 7.1% | 21.4% | 21.4% | 35.7% | 50.0% | 71.4% | 78.6% |
| Multi-Unit holdout / vector | 14.3% | 21.4% | 28.6% | 28.6% | 50.0% | 64.3% | 92.9% |
| Multi-Unit holdout / hybrid | 21.4% | 35.7% | 42.9% | 50.0% | 57.1% | 85.7% | 92.9% |
| Controls / BM25 | 0.0% | 0.0% | 20.0% | 20.0% | 20.0% | 50.0% | 60.0% |
| Controls / vector | 0.0% | 10.0% | 20.0% | 20.0% | 20.0% | 50.0% | 60.0% |
| Controls / hybrid | 0.0% | 20.0% | 20.0% | 30.0% | 30.0% | 60.0% | 70.0% |

Hybrid improves on both components in 2/36 and 2/24 Gold V3 cases, 5/21 and 5/14 Multi-Unit cases, and 5/10 controls. It worsens the stronger component's target rank in 17/36, 8/24, 8/21, 6/14, and 2/10 respectively. The difficult sets therefore benefit from fusion in some cases, but RRF is not consistently target-preserving.

Source fusion is especially unstable on Multi-Unit development: hybrid rescued a source missed by both components once, but lost a correct Top-1 source supplied by at least one component in nine cases. Multi-Unit holdout had two rescues and two losses. This post-hoc fact does not justify tuning RRF on either consumed split.

For complete multi-unit sets, hybrid places every member of at least one accepted set within Top-100 for 52.4% of development and 78.6% of holdout; Top-50 rates are 42.9% and 57.1%. Complete packages are therefore often theoretically recoverable from deep candidates, but not consistently enough to assume that reranking alone solves assembly.

## Source, parent, child, and evaluator-only oracle diagnostics

The following filters use the Gold source or parent after ranking. They are evaluator-only counterfactuals and are forbidden production inputs.

| Population | Hybrid source Top-1 | Parent Top-1 / Top-3 / Top-10 | Global target median | Correct-source median | Accepted-parent median |
|---|---:|---:|---:|---:|---:|
| Gold V3 development | 86.1% | 58.3% / 80.6% / 91.7% | 2 | 2 | 1 |
| Gold V3 holdout | 91.7% | 70.8% / 87.5% / 95.8% | 1 | 1 | 1 |
| Multi-Unit development | 57.1% | 33.3% / 52.4% / 76.2% | 6.5 | 2.5 | 1 |
| Multi-Unit holdout | 85.7% | 35.7% / 50.0% / 78.6% | 6 | 6 | 1 |
| Controls | 40.0% | 10.0% / 50.0% / 60.0% | 21 | 5 | 2 |

Among retrieved correct-source candidates, the accepted hybrid score is at the median 94th percentile for both Multi-Unit development and holdout and the 86th percentile for controls. This percentile is computed only within the stored Top-100 and is therefore descriptive and upward-biased. Together with the accepted-parent median ranks, it nonetheless shows that parent/section discrimination is the largest rescue opportunity.

The correct parent appears in the hybrid Top-10 while the accepted child remains outside global Top-10 in 5/21 Multi-Unit development, 5/14 Multi-Unit holdout, and 1/10 controls. This is a narrower child-ranking problem after section reachability, distinct from cases where the correct parent is absent.

## Wrong-section taxonomy

Wrong-section causes are multi-label descriptive diagnoses. For the five Multi-Unit development wrong-parent cases, all lacked an explicit identifier and all selected a same-role sibling; four had a wrong-heading lexical advantage and four arose from fusion interaction. For the seven holdout cases, all lacked an explicit identifier and contained qualifier/multi-part context, six selected a same-role sibling, four had a wrong-heading lexical advantage, three reflected vector preference, three fusion interaction, and two met the near-duplicate threshold.

Thus the dominant pattern is not merely duplicated wording. It is a paraphrased, multi-concept query without a structural anchor competing against many same-role sections whose headings or passages match one portion of the question. Exact identifier boosting cannot help when no identifier is present; structural evidence must be inferred without becoming a hard parent gate.

## A3 / SSAP diagnostic

| A3 population | n | Target Top-1 / Top-10 / Top-50 | Source Top-1 | Parent Top-1 / Top-10 | Median target within accepted parent | Mean wrong siblings above target |
|---|---:|---:|---:|---:|---:|---:|
| Gold V3 development | 12 | 50.0% / 66.7% / 83.3% | 100% | 58.3% / 83.3% | 1 | 19.3 |
| Gold V3 holdout | 8 | 62.5% / 87.5% / 100% | 100% | 75.0% / 100% | 1 | 3.0 |
| Multi-Unit development | 14 | 7.1% / 42.9% / 64.3% | 64.3% | 28.6% / 78.6% | 1 | 39.1 |
| Multi-Unit holdout | 8 | 37.5% / 37.5% / 87.5% | 87.5% | 37.5% / 62.5% | 1 | 25.3 |
| Controls | 4 | 0.0% / 50.0% / 75.0% | 50.0% | 0.0% / 75.0% | 1 | 26.8 |

Across all 46 supported A3 cases, explicit-identifier cases achieved hybrid source Top-1 100%, parent Top-1 63.2%, and target Top-1 52.6%. Without an explicit identifier these fell to 70.4%, 29.6%, and 18.5%. The current direct/structural heuristic selects the same A3 cohort as identifier presence, so these data do not independently separate wording directness from identifier effect.

Once the accepted SSAP/section is supplied, the median accepted child rank is 1 in every A3 population. The principal A3 problem is therefore SSAP/section routing under unanchored paraphrase and same-role sibling pressure, not general within-SSAP child construction. Some outliers remain absent from Top-100 and need targeted evidence-unit review.

## Single-unit controls

The controls are not secretly multi-unit: all have one accepted unit, no multi-part query flag, and only one has a scope flag. Their failures are six source misses, three wrong parents, and one wrong child. Nine of ten lack a detected structural identifier; mean lexical Jaccard is 0.062; six meet the lexical-weak diagnostic and eight have vector rank beyond Top-10.

Seven controls are found by hybrid within Top-100, but only six within Top-50. Correct-source filtering improves the median available rank from 21 to 5; accepted-parent filtering improves it to 2. Three targets remain absent from every hybrid Top-100 candidate. This shows both a dominant routing problem and a smaller deep-retrieval/representation tail.

All controls could be matched descriptively to Gold V3 cases with the same source and modality. Only six pairs had both targets in Top-100: the control ranked worse in four and better in two. Three controls versus two matched Gold cases were absent from Top-100. The set is too small and matching is not one-to-one, so this supports—but does not alone quantify—a broader distribution weakness.

## Evidence-unit granularity

The predeclared broad-child heuristic fires for 31/35 Multi-Unit cases, 7/10 controls, and 41/60 Gold V3 cases. Broad units are therefore more prevalent in Multi-Unit Gold but are not unique to the weak populations. Multi-Unit holdout accepted evidence has median aggregate length 1,156 characters and a 74,960-character maximum; controls have median 625 and a 54,347-character maximum. These heavy tails can dilute both BM25 and pooled embeddings in specific workbook or long-block cases.

All 35 multi-unit cases necessarily split required evidence across units; six include definition/requirement or table-header/row splits. The accepted-parent oracle median of 1 argues against blanket rechunking as the first response. A later evidence-unit fix should target the extreme broad/narrow and disconnected-header cases, not reopen the corrected corpus wholesale.

## Future technology ranking

The evidence-ranked directions are:

1. `F_QUERY_ROUTING_STRUCTURAL_METADATA_FIX` — addresses both source misses and wrong-section selection, especially A3 queries without explicit identifiers.
2. `A_EXISTING_RETRIEVER_WITH_SECTION_RERANKING` — deep hybrid reachability and accepted-parent rank collapse make a soft, non-gating section stage plausible.
3. `E_EVIDENCE_UNIT_REPRESENTATION_FIX` — justified for heavy-tail and within-parent outliers, but not as the dominant aggregate correction.
4. `D_CROSS_ENCODER_RERANKER` — potentially useful only after candidate and structural routing are isolated on a fresh set; no hosted or LLM reranking is authorized.
5. `C_LEARNED_SPARSE_RETRIEVER`.
6. `B_LATE_INTERACTION_RETRIEVER`.
7. `G_MORE_CORPUS_MORE_GOLD_BEFORE_MODEL_WORK` — no corpus expansion is needed to explain the present failure, though fresh Gold is required for any experiment.

The recommended next milestone is `STRUCTURAL_ROUTING_HARDENING`, meaning a soft, review-only source/section discriminator evaluated against a fresh boundary. It must not repeat the failed strict parent-first gate or alter the frozen flat hybrid ranking.

## Fresh evaluation boundary

Before any structural-routing, section-reranker, evidence-unit, or retriever-model experiment, freeze a new SHA-bound, source-balanced section-challenge set. It should include an untouched holdout, explicit-identifier and identifier-absent pairs, direct and paraphrased pairs, A3 SSAP siblings, PDF and XLSX controls, same-role near siblings, and deep-target cases. Gold V3 and Multi-Unit Gold V1 holdouts may be used only as historical descriptive evidence.

## Rights, determinism, and governance

Private query text, component rankings, score traces, accepted/wrong evidence details, and case taxonomies remain under `C:\Dev\Document Processor Sources\_processed-private\broader-retrieval-diagnostic-2026-09`. The private manifest contains three artifacts totaling 11,929,848 bytes with aggregate SHA-256 `e3ba3ab564ea81994d982dc6403b4b7c6d9959dd2b65619686693f75542fb8de`. Public artifacts contain aggregate metrics and non-substantive metadata only and pass the Git-safe validator.

Private component rankings, case diagnostics, input hashes, public summary, and public manifest were byte-identical on rerun. The diagnostic is `reviewOnly`, `not_promoted`, and `ragReadyAllowed=false`.

The repository-wide processor, acquisition, scaled-wave, rights, and hybrid/vector suite passed. Parent-child, retrieval-hardening, semantic-evidence validation and determinism, Gold V2, Gold V3 integrity/evaluation, hierarchy integrity/determinism, Multi-Unit Gold V1, sidecar-hardening, and new diagnostic suites also passed. Historical hybrid and hierarchy validators were extended only to recognize this new approved successor review-package path; their protected historical-artifact checks remain fail-closed.

No Gold, query, split, retrieval parameter, embedding, vector, parent/child corpus, evidence text, source byte, sidecar, or historical result was changed. No source was acquired; no canonical content was promoted; no answer generation, production RAG, hosted API, history rewrite, visibility change, or OneDrive work occurred.

## Limitations

- All causal labels are deterministic post-hoc heuristics, not new human adjudications.
- Gold V3 and Multi-Unit holdouts are consumed; no finding may be tuned against them.
- Gold V3 component rankings are stored only to Top-100, which bounds absence and percentile conclusions.
- The controls contain ten cases and matched comparison is small and non-unique.
- Directness and identifier presence are confounded in the current A3 slice.
- No alternative complete evidence packages appear in Multi-Unit Gold V1 despite schema support.

## Decision

`BROADER_RETRIEVAL_DIAGNOSTIC_MATURITY: LEVEL_2`

`NEXT_STEP: STRUCTURAL_ROUTING_HARDENING`

`BROADER_RETRIEVAL_DIAGNOSTIC: PASS_WITH_LIMITATIONS`
