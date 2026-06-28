# AG 31 Review Index

## Overall AG 31 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXXI
- AG 32 explicitly remains out of scope for this wave
- batch outputs remain ignored in `data/work/batches/batch-113/`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Unresolved Issues / Review Concerns | Validation | Self-Review | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-113 | page 1; policy form approval caveat, annual statement reserve context, and the closing boundary note | policy form approval caveat slice | Keep the one-page guideline together, preserve the page-image backstop, and stop before any later guideline file. | regulatory_requirement; caveat_or_companion_guidance; definition_or_terminology; cross_reference_mapping; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; policy form boundary remains review-only; annual statement reserve context remains review-only | passed | reasonable_with_minor_cautions | `72214bc` |

## Higher-Caution Section

- The page image remains the wording backstop because the page contains encoding noise.
- The policy form approval language should not be over-read as a full mechanics set; it remains a review-only caveat slice.
- The annual statement and reserve language should stay review-only until a human confirms the guideline interpretation.
- The approval caveat is context, not a promotion candidate.
- The closing boundary stays on page 1, and AG 32 remains out of scope.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page and section references sufficient for review?
- Are requirement and explanation separated correctly?
- Are policy form and benefit references separated from interpretation?
- Are annual statement and reserve references separated from cross-reference context?
- Are cross-references mapped without over-interpreting them?
- Is the page-image backstop still visible for the encoding-noisy page?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [x] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Policy-form approval caveat first.
2. Annual-statement and reserve context second.
3. Page-image wording confirmation last.

## Relationship to Other Review Indexes

- AG 31 is its own one-page guideline wave and should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md`.
- The VM review indexes remain the broader valuation-manual context:
  - `docs/review/vm20_review_index.md`
  - `docs/review/supporting_vm_review_index.md`
  - `docs/review/vm21_review_index.md`
  - `docs/review/vm22_review_index.md`
- `docs/review/ag30_review_index.md` remains the immediately preceding short-guideline handoff and is useful context for the page-image backstop pattern.

## Review Notes

- This index summarizes the ignored batch review packet without promoting any extracted content.
- The page-image wording backstop stays visible for the batch because the page contains encoding noise.
- Reviewers should start from the batch table and the higher-caution section, then move to the self-review note at `docs/review/ag31_self_review.md`.
