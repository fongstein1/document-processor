# Natural Question Benchmark v1 — baseline summary

## Boundary

This is an unadjudicated retrieval baseline, not a correctness evaluation. No expected answers, sources, chunks, or Gold labels were supplied or created. Retrieval logic and corpus records were not changed after observing the questions.

## Architecture exercised

The run reused the repository's deterministic `keyword_overlap_baseline` implementation in `scripts/evaluate-source-index-retrieval.mjs`. It performs weighted token overlap over source-index text and structured metadata, applies its existing phrase/definition/authority signals, excludes records with `retrievalEligible=false`, and applies the existing exact-text and parent/child collision deduplication. Top 10 was captured for review; this changes output depth only, not candidate scores or ordering.

The repository does not contain a production answer-generation layer. Every indexed package remains `ragReadyAllowed=false`; these results are review evidence, not RAG-ready output.

## Corpus searched

- Repository baseline SHA: `5afedfc5ade397179560880508a13821347f0545`
- Manifest: `data/processed/source_indexes/repository-manifest.json`
- Chunk export: `data/processed/source_indexes/exports/source_chunks.jsonl`
- Source packages: 25
- Exported chunks: 749
- Retrieval-eligible chunks searched: 679
- Promoted packages: 10
- Not-promoted packages: 15

The corpus is a mixed-governance canonical source-index POC: it includes promoted current-manual slices, review-only companion/regulatory material, and a small synthetic pricing set. Canonical serialization does not confer downstream RAG eligibility.

## Execution

- Frozen questions: 65
- Executed successfully: 65
- Failures: 0
- Empty result sets: 0
- Top-N depth: 10
- Top score (minimum / median / maximum): 0.3 / 11.75 / 27
- Questions with top score below the evaluator's diagnostic threshold (3): 2

## Provisional diagnostic counts

Retrieval-quality labels (mutually exclusive, total 65):

- Apparently strong retrieval: 4
- Mixed / partially relevant retrieval: 29
- Apparently weak retrieval: 24
- No plausible relevant evidence: 8
- Not yet reviewed: 0

Scope diagnostics (mutually exclusive, total 65):

- General regulatory/actuarial: 24
- Likely corpus gap: 6
- Likely company-specific: 22
- Context-dependent: 13
- Not yet reviewed: 0

## Headline patterns

- Only questions 49, 50, 51, and 62 received an apparently strong provisional retrieval assessment. These align closely with represented mortality, expense-assumption, and model-governance terminology.
- Twenty-nine questions had mixed evidence, while 24 were apparently weak and eight had no plausible retrieved evidence. High lexical scores often reflected shared reserve terminology rather than direct support.
- The corpus appears to lack the specialized half-cx, AAT/PVMVS, LTC-rider morbidity, and New York-specific material requested in questions 29, 31, 32, 35, 39, and 64.
- Twenty-two questions appear company-specific: they ask about observed block results, bulk calculations, reconciliations, treaty terms, portfolio mix, or reporting-system conflicts that this regulatory corpus cannot settle by itself.
- The source-index contains review-only companion and synthetic pricing material alongside promoted manual slices. Synthetic results outrank regulatory material for some natural questions, notably 41, 44, 52, and 54.
- Broad parent/section metadata creates ties and weak child discrimination. Questions 49 and 50, for example, return many Section 9.C children at identical scores.
- The evaluator always returns a ranked list. Question 23 has a top score below the configured diagnostic threshold, demonstrating that a non-empty result set is not evidence of answerability.

## Interpretation and next evaluation step

The provisional labels are human-review aids only. Strong-looking lexical retrieval can still be substantively wrong, and weak-looking retrieval may omit relevant material deeper in the corpus. The next evaluation step should be independent human adjudication of expected evidence and corpus-answerability, followed by a frozen Gold layer. Retrieval tuning must wait until that boundary exists.

## Reproduction

Run `npm run benchmark:natural-question:v1`. The runner consumes the frozen benchmark verbatim, invokes the existing evaluator, and writes only this non-canonical review package.
