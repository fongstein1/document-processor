# Natural Question Gold V1 human-approved freeze

## Boundary

This review-only layer independently adjudicates the 65 frozen Natural Question Benchmark V1 questions against the complete frozen source-index corpus. It does not use the keyword-overlap baseline, provisional assessments, ranks, scores, or retrieval success as adjudication inputs. The question array remains bound to SHA-256 `ebf779edc4caa38954a4ba8ca7d190807c3240b86b548d452791a0714cec9055`.

The result is frozen, human-approved Gold. The explicit human review disposition covers 21 cases and leaves no review decision unresolved. No retrieval accuracy is reported from this layer.

## Adjudication result

| Status | Count |
|---|---:|
| `FULLY_SUPPORTED` | 11 |
| `PARTIALLY_SUPPORTED` | 13 |
| `UNSUPPORTED_CORPUS_GAP` | 14 |
| `UNSUPPORTED_COMPANY_SPECIFIC` | 24 |
| `UNSUPPORTED_OUT_OF_SCOPE` | 1 |
| `AMBIGUOUS_REQUIRES_SME` | 2 |

Of 24 supported or partially supported questions, six are single-unit and 18 require multiple evidence units. Two cases retain multiple acceptable evidence sets. Twenty cases have governing source material available; three cases are supported only partially by companion material.

Pass 2 agreed with 52 decisions. It recorded two support-status disagreements, one evidence-set disagreement, two authority-role disagreements, and eight direct SME outcomes. The subsequent explicit human disposition reviewed 21 cases: nine were approved as proposed and 12 were approved with changes. All 21 are marked `HUMAN_APPROVED`; the other 44 retain `INDEPENDENT_MODEL_REVIEWED`. Questions 2 and 3 remain classified `AMBIGUOUS_REQUIRES_SME`, but that label describes their approved answerability classification rather than unfinished review. The pending-SME count is zero.

## Source and authority result

Accepted evidence contains 45 promoted units and four not-promoted companion units. Evidence roles comprise 16 `PRIMARY_GOVERNING`, 24 `PRIMARY_OPERATIVE`, one `DEFINITIONAL`, four `INTERPRETIVE_COMPANION`, two `CORROBORATING`, and two `CONTEXT_ONLY` assignments.

Every accepted evidence unit is checked against the frozen source-chunk export, its parent lineage, and citation pages. Every source is bound to an exact source-index SHA-256; the raw source SHA-256 is also retained where the repository manifest exposes it. A missing raw-source hash is represented as null and is not fabricated.

## Frozen split and readiness

The deterministic split uses only support status, source family, modality, category, identifier presence, support structure, and question ID. It assigns 15 supported/partial cases to development, nine to holdout, and 41 non-supported or ambiguous cases to diagnostics. It explicitly excludes baseline ranks, scores, provisional labels, and retrieval outcomes.

The 24 supported/partial cases, including only nine holdout cases, remain too few for a meaningful retriever model comparison. Human approval is complete; the next action is to collect additional authentic, human-authored natural questions under a new intake boundary before any model comparison.

## Rights and governance

Substantive queries, excerpts, rationales, disagreement notes, and the detailed SME packet remain under the approved external private root. Git stores only IDs, hashes, classifications, evidence lineage, citation coordinates, roles, counts, and other non-substantive metadata. The layer remains `review_only_non_canonical`; it does not change source promotion or `ragReadyAllowed` posture.

No retrieval code, baseline result, provisional assessment, source byte, canonical evidence unit, prior Gold layer, or challenge set was changed. No source was acquired, no model comparison was run, and no answer layer was built.
