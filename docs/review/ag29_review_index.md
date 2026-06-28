# AG 29 Review Index

## Overall AG 29 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXIX
- AG 30 explicitly remains out of scope for this wave
- batch outputs remain ignored in `data/work/batches/batch-111/`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Unresolved Issues / Review Concerns | Validation | Self-Review | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-111 | pages 1-2; rehabilitation background, reserve interpretation, issue-date context, expense-allowance context, and closing boundary note | rehabilitation reserve guidance slice | Keep the two-page guideline together, preserve the page-image backstop, and stop before any later guideline file. | regulatory_requirement; definition_or_terminology; cross_reference_mapping; caveat_or_companion_guidance; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; rehabilitation-context boundary remains review-only; issue-date / expense-allowance context remains review-only | passed | reasonable_with_minor_cautions | `d51b93d` |

## Higher-Caution Section

- The page image remains the wording backstop because the text layer is encoded.
- The two-page slice frames reserve interpretation for contracts restructured under court-ordered rehabilitation and should stay review-only until the wording is confirmed.
- The issue-date and expense-allowance language remains contextual and should not be read as a separate mechanics set.
- The rehabilitation-specific reserve interpretation is summary-only, not a promotion candidate.
- The closing boundary stays on page 2, and AG 30 remains out of scope.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page and section references sufficient for review?
- Are requirement and explanation separated correctly?
- Are rehabilitation, issue-date, and expense-allowance references separated from interpretation?
- Are cross-references mapped without over-interpreting them?
- Are the page-image backstop and encoded-text caveats still visible?
- Are the rehabilitation and court-ordered restructuring references properly flagged?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [x] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Rehabilitation reserve interpretation first.
2. Issue-date and expense-allowance context second.
3. Page-image wording confirmation last.

## Relationship to Other Review Indexes

- AG 29 is its own short-guideline wave and should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md`.
- The VM review indexes remain the broader valuation-manual context:
  - `docs/review/vm20_review_index.md`
  - `docs/review/supporting_vm_review_index.md`
  - `docs/review/vm21_review_index.md`
  - `docs/review/vm22_review_index.md`
- `docs/review/ag28_review_index.md` remains the immediately preceding short-guideline handoff and is useful context for the page-image backstop pattern.

## Review Notes

- This index summarizes the ignored batch review packet without promoting any extracted content.
- The page-image wording backstop stays visible for the batch because the PDF text layer is encoded.
- Reviewers should start from the batch table and the higher-caution section, then move to the self-review note at `docs/review/ag29_self_review.md`.
