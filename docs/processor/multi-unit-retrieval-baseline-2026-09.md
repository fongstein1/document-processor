# Multi-Unit Gold V1 retrieval baseline

## Outcome

The unchanged flat hybrid retriever and unchanged conditional evidence assembler were evaluated only after the independent Gold freeze commit. The new evidence shows that the current assembler does not generalize to complete packages beyond the earlier narrow XLSX signal: complete-package rate is 0% on both the 21-case multi-unit development split and the 14-case multi-unit holdout split. The sidecar nevertheless produces a limited partial signal, improving holdout accepted-evidence recall from 10.7% to 20.2%, required-role recall from 14.3% to 28.6%, package precision from 21.4% to 33.3%, and partial-package rate from 21.4% to 42.9%.

This is a baseline result, not a tuning result. It supports development-split sidecar hardening as the next retrieval milestone while the 14-case holdout remains untouched for future confirmation.

## Frozen evaluation population

- 35 `MULTI_UNIT_REQUIRED` cases and 10 single-unit controls.
- Five `UNSUPPORTED` and five `PARTIALLY_UNSUPPORTED` diagnostics.
- Supported split: 27 development / 18 holdout; multi-unit split: 21 / 14.
- Every required multi-unit category has five cases.
- Multi-unit modality: 28 PDF / seven XLSX.
- Multi-unit source counts: A3 22, W07 2, W08 4, VM-20 2, VM-31 2, SOA VBT 3.
- All 55 query hashes are unique and all supported targets are bound to the frozen source SHA and accepted parent lineage.

## Aggregate multi-unit results

| Split | System | Complete | Evidence recall | Role recall | Precision | Partial | Irrelevant | Avg / max package |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Development (21) | A flat hybrid | 0/21 | 6.3% | 9.5% | 14.3% | 14.3% | 18 | 1.00 / 1 |
| Development (21) | B + sidecar | 0/21 | 12.7% | 16.7% | 15.9% | 23.8% | 33 | 1.86 / 3 |
| Holdout (14) | A flat hybrid | 0/14 | 10.7% | 14.3% | 21.4% | 21.4% | 11 | 1.00 / 1 |
| Holdout (14) | B + sidecar | 0/14 | 20.2% | 28.6% | 33.3% | 42.9% | 13 | 1.36 / 3 |

Flat primary ranking metrics are identical for A and B. On multi-unit holdout, accepted-target Top-1/3/5 is 21.4% / 35.7% / 42.9%, MRR is 0.321, correct source is 85.7%, correct parent is 35.7%, wrong source is 14.3%, and wrong section is 50.0%. On multi-unit development, Top-1/3/5 is 14.3% / 23.8% / 33.3%, MRR is 0.249, correct source is 57.1%, correct parent is 33.3%, wrong source is 42.9%, and wrong section is 23.8%.

## Category results

No category produced a complete package. Holdout sidecar recall / precision was: comparison 0% / 0%; definition plus requirement 25% / 50%; multiple requirements 25% / 50%; other multi-unit 27.8% / 44.4%; requirement plus exception 0% / 0%; requirement plus scope 50% / 33.3%; and table header plus data 25% / 50%. These slices contain one to three holdout cases each and are descriptive only.

Development sidecar recall / precision was: comparison 0% / 0%; definition plus requirement 0% / 0%; multiple requirements 16.7% / 33.3%; other multi-unit 33.3% / 33.3%; requirement plus exception 12.5% / 8.3%; requirement plus scope 0% / 0%; and table header plus data 33.3% / 44.4%.

## Modality and proving-ground results

On PDF multi-unit holdout (10 cases), the sidecar reached 20.0% recall, 26.7% precision, and 0% complete packages; flat wrong-section rate was 60.0%. On XLSX multi-unit holdout (four cases), it reached 20.8% recall, 50.0% precision, and 0% complete packages. Development sidecar recall / precision was 5.6% / 7.4% for PDF (18 cases) and 55.6% / 66.7% for XLSX (three cases), again with no complete packages.

A3 multi-unit holdout (eight cases) reached 18.8% recall and 29.2% precision with the sidecar, zero complete packages, and a 50.0% wrong-section rate. All non-A3 source slices are small and descriptive; the public results retain each source split separately.

## Single-unit controls

The sidecar did not alter flat-hybrid rank order. Consequently Top-1/3/5, MRR, correct-source, wrong-source, wrong-section, and target-citation results are byte-identical across A and B. The small controls were intentionally difficult: development Top-1/3/5 was 0% / 33.3% / 33.3% with MRR 0.148; holdout Top-1/3/5 was 0% / 0% / 0% with MRR 0.048. Sidecar package expansion added irrelevant companions in some controls, but did not mutate the primary ranking.

## Unsupported and partial diagnostics

Neither system has an uncertainty or abstention mechanism. System B produced three apparently complete-looking packages across the 10 diagnostics, returned none of the five adjudicated supported subsets, and added 15 unrelated evidence records; System A returned one unrelated top record for each diagnostic. No threshold was selected.

## Provenance, rights, and determinism

The experiment reused `intfloat/e5-base-v2` revision `f52bf8ec8c7124536f0efb74aca902b2995e5bcd` under MIT license, CPU dynamic-int8 inference, 768 dimensions, attention-mask mean pooling, and L2 normalization. Frozen document-vector SHA-256 is `a64d5193a3dba7b36fa2247524aec6754b428cb3b6608752716e8591bbd3c481`; exact-index SHA-256 is `5b5295a6b918afd5273762e0cd16326e34d6a895a9704a9b69987940710015dc`; new private query-vector SHA-256 is `8736b28cdab3a6d5b8a891422919367f4fb988b96094752abcdc00d62a1065f6`.

Six new private artifacts total 108,636,914 bytes. Their public manifest contains only paths, hashes, byte counts, and types. Query text, rationales, detailed packages, rankings, and vectors remain external. Query-vector and ranking reruns matched byte-for-byte, and scoring reproduced byte-for-byte. Rights validation rejects query/source text in Git and explicitly allowlists only the new review-package directory in historical processed-data guards.

All processor, acquisition, scaled-wave, rights, parent-child, retrieval-hardening, semantic-evidence, vector/hybrid, Gold V2, Gold V3, and hierarchy validations pass. Gold V3 and its split are unchanged. There was no retrieval tuning, embedding/model change, source acquisition, raw-byte modification, canonical promotion, learner-facing output, answer generation, hosted model/API use, authority broadening, history rewrite, visibility change, or OneDrive use.

## Decision

`MULTI_UNIT_EVALUATION_MATURITY: LEVEL_2`

`NEXT_STEP: SIDECAR_ARCHITECTURE_HARDENING`

`MULTI_UNIT_GOLD_V1: PASS_WITH_LIMITATIONS`
