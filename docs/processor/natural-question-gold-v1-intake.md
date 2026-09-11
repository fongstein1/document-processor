# Natural Question Gold V1 intake gate

The required private natural-question input was not present under the approved external source root. Phase A therefore stopped before adjudication, Gold freezing, baseline evaluation, model selection, model download, or reranker implementation.

## Required private input

Create:

`C:\Dev\Document Processor Sources\_processed-private\natural-question-gold-v1-2026-09\question-input.jsonl`

Use one JSON object per line following `schemas/natural-question-input.schema.json`. The repository template is illustrative only and must not be submitted unchanged.

Each question must be authored before adjudication and without access to accepted evidence, target IDs, target headings, target-derived keywords, or baseline outcomes. `HUMAN_REAL_WORLD` and `HUMAN_BENCHMARK` records are primary-eligible. `TARGET_BLIND_SECONDARY` records must set `primaryEligible` to `false`.

Do not include accepted targets, parents, evidence excerpts, adjudication results, split labels, expected sources, or retrieval ranks. Question text remains external/private.

## Current shortfall

- Available questions: 0
- Target intake: 65; 65 still needed
- Minimum acceptable intake: 60; 60 still needed
- Minimum human-authored questions: 40; 40 still needed

The 65-question intake target is intended to support eventual adjudication toward approximately 50–70 supported cases and 10–15 unsupported or insufficient-evidence diagnostics. Adjudication may reveal that additional authored questions are needed.

## Authoring guidance

- Collect realistic questions from actual actuarial/regulatory work or a target-blind benchmark-authoring exercise.
- Cover all six proving-ground source families and both PDF and XLSX tasks.
- Include definitions, requirements, scope, exceptions, reporting instructions, tables, comparisons, and multi-concept questions.
- Include naturally short and detailed questions, with and without identifiers.
- Do not manufacture paired paraphrases or write questions from source headings or accepted evidence.
- Record only a naturally known source-family hint; use `UNKNOWN` otherwise.
- Preserve provenance and target-independence attestations for every record.

After intake validation passes, freeze the question hashes before beginning two-pass adjudication. Only after Gold and frozen BM25/E5/hybrid baselines are committed may model-selection and cross-encoder work begin.

Validate with:

`npm run natural-question:intake:validate`

The command is fail-closed and exits nonzero while the input is missing, invalid, insufficient, or contains prohibited Gold/retrieval fields. It never prints question text.

## Validation and disposition

The intake schema and its synthetic positive/negative fixtures pass. The live intake validator exits with code 2 because the required external file is absent; this is the expected fail-closed result.

The existing processor `npm run check` chain passed. Separate parent-child, retrieval-hardening, semantic-evidence, Gold V2/V3, hierarchy, Multi-Unit Gold V1, sidecar, broader-diagnostic, Section Challenge, and Child Challenge validation/test commands also passed. No Natural Question baseline ranking or model inference was run.

The milestone is intentionally stopped at the Phase A intake boundary:

- `NATURAL_QUESTION_GOLD_V1_MATURITY: LEVEL_1`
- `CROSS_ENCODER_RERANKER_MATURITY: LEVEL_1`
- `RETRIEVER_MODEL_COMPARISON: NOT_RUN_INSUFFICIENT_NATURAL_QUESTIONS`
- `NEXT_STEP: RETURN_TO_CORPUS_PROCESSING`

Collection and delivery of the required private question input is an external prerequisite before this branch may proceed to adjudication or model work.
