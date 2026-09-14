# Natural Question Expansion Batch 01 intake boundary

## Purpose

This review-only scaffold collects additional authentic human-authored natural questions before any retriever model comparison. The intake is separate from frozen Natural Question Gold V1. It does not run retrieval, create Gold, adjudicate answerability, or alter prior questions.

## Current state

The batch is `OPEN_INTAKE` with 41 human-approved, authentic, verbatim question or query-like records. The intake also binds three authentic non-question utterances to a private quarantine and excludes nine candidates for which verbatim human source wording was not recovered. No questions were generated, mined from source text, paraphrased, or recycled from Natural Question Gold V1.

## Private intake contract

Question text stays in `C:\Dev\Document Processor Sources\_processed-private\natural-question-expansion-batch-01-2026-09\intake.json`. Each future record must preserve the exact human wording and attest `modelGenerated: false` and `paraphrased: false`. `provenanceType` must be one of `USER_WORK_CHAT`, `TEAM_OR_COLLEAGUE`, `INTERNAL_MEETING_OR_NOTES`, `USER_DIRECT_ENTRY`, or `OTHER_HUMAN_AUTHORED`.

Before freeze, records have no question ID or stored query hash. At intake freeze, records receive an ordinal/hash-derived deterministic ID and exact-text SHA-256. The builder rejects duplicate exact-text hashes within the batch and against Natural Question Gold V1.

## Public boundary

Git stores only batch status, counts, provenance counts, duplicate-screen counts, control flags, frozen IDs/hashes when available, and external private artifact hashes and byte counts. It never stores question text, quarantined utterance text, answers, expected sources, evidence, rationale, or retrieval output. Because the batch remains open, the public projection contains no frozen question records.

## Next action

Human-review the deterministic lexical/mechanical near-duplicate candidates and continue collecting authentic human-authored questions before deciding whether to freeze. Do not run retrieval or adjudication during open intake.
