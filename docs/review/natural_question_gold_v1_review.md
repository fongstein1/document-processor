# Natural Question Gold V1 candidate review

## Boundary

This review-only layer independently adjudicates the 65 frozen Natural Question Benchmark V1 questions against the complete frozen source-index corpus. It does not use the keyword-overlap baseline, provisional assessments, ranks, scores, or retrieval success as adjudication inputs. The question array remains bound to SHA-256 `ebf779edc4caa38954a4ba8ca7d190807c3240b86b548d452791a0714cec9055`.

The result is a Gold candidate, not human-approved Gold. No retrieval accuracy is reported from this layer.

## Adjudication result

| Status | Count |
|---|---:|
| `FULLY_SUPPORTED` | 11 |
| `PARTIALLY_SUPPORTED` | 11 |
| `UNSUPPORTED_CORPUS_GAP` | 10 |
| `UNSUPPORTED_COMPANY_SPECIFIC` | 23 |
| `UNSUPPORTED_OUT_OF_SCOPE` | 1 |
| `AMBIGUOUS_REQUIRES_SME` | 9 |

Of 22 supported or partially supported questions, 7 are single-unit and 15 require multiple evidence units. Two cases retain multiple acceptable evidence sets. Eighteen cases have promoted governing or operative evidence available; three cases are supported only partially by companion material.

Pass 2 agreed with 52 decisions. It recorded two support-status disagreements, one evidence-set disagreement, two authority-role disagreements, and eight direct SME outcomes. All were resolved explicitly in the private adjudication record; nine final cases require SME review. No case is marked `HUMAN_APPROVED`.

## Source and authority result

Accepted evidence contains 40 promoted units and four not-promoted companion units. Evidence roles comprise 13 `PRIMARY_GOVERNING`, 22 `PRIMARY_OPERATIVE`, one `DEFINITIONAL`, four `INTERPRETIVE_COMPANION`, two `CORROBORATING`, and two `CONTEXT_ONLY` assignments.

Every accepted evidence unit is checked against the frozen source-chunk export, its parent lineage, and citation pages. Every source is bound to an exact source-index SHA-256; the raw source SHA-256 is also retained where the repository manifest exposes it. A missing raw-source hash is represented as null and is not fabricated.

## Candidate split and readiness

The deterministic candidate split uses only support status, source family, modality, category, identifier presence, support structure, and question ID. It assigns 13 supported/partial cases to development, nine to holdout, and 43 non-supported or ambiguous cases to diagnostics. It explicitly excludes baseline ranks, scores, provisional labels, and retrieval outcomes.

The 22 supported/partial cases are too few for a meaningful retriever model comparison, and nine SME decisions remain open. The next action is compact SME review; more natural questions will likely be needed before model comparison even after approval.

## Rights and governance

Substantive queries, excerpts, rationales, disagreement notes, and the detailed SME packet remain under the approved external private root. Git stores only IDs, hashes, classifications, evidence lineage, citation coordinates, roles, counts, and other non-substantive metadata. The layer remains `review_only_non_canonical`; it does not change source promotion or `ragReadyAllowed` posture.

No retrieval code, baseline result, provisional assessment, source byte, canonical evidence unit, prior Gold layer, or challenge set was changed. No source was acquired, no model comparison was run, and no answer layer was built.
