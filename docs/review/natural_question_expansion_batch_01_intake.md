# Natural Question Expansion Batch 01 intake boundary

## Purpose

This review-only scaffold collects additional authentic human-authored natural questions before any retriever model comparison. The intake is separate from frozen Natural Question Gold V1. It does not run retrieval, create Gold, adjudicate answerability, or alter prior questions.

## Current state

The approved private workspace was inspected for a separate expansion intake. No authentic, unused human-authored question collection was present. The batch therefore starts `OPEN_EMPTY` with zero questions. No questions were generated, mined from source text, paraphrased, or recycled from Natural Question Gold V1.

## Private intake contract

Question text stays in `C:\Dev\Document Processor Sources\_processed-private\natural-question-expansion-batch-01-2026-09\intake.json`. Each future record must preserve the exact human wording and attest `modelGenerated: false` and `paraphrased: false`. `provenanceType` must be one of `USER_WORK_CHAT`, `TEAM_OR_COLLEAGUE`, `INTERNAL_MEETING_OR_NOTES`, `USER_DIRECT_ENTRY`, or `OTHER_HUMAN_AUTHORED`.

Before freeze, records have no question ID or stored query hash. At intake freeze, records receive an ordinal/hash-derived deterministic ID and exact-text SHA-256. The builder rejects duplicate exact-text hashes within the batch and against Natural Question Gold V1.

## Public boundary

Git stores only batch status, counts, provenance counts, control flags, frozen IDs/hashes when available, and the external private artifact hash and byte count. It never stores question text, answers, expected sources, evidence, rationale, or retrieval output. The current public projection contains zero question records.

## Next action

Collect additional authentic human-authored questions. Do not run retrieval or adjudication until a later approved milestone freezes a sufficiently large intake.
