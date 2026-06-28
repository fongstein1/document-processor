# AG 30 Review Index

## Overall AG 30 Extraction Status

- review-only
- not learner-facing
- not app-ready
- not RAG-ready
- not promoted
- source status: active
- source reference: Actuarial Guideline XXX
- AG 31 explicitly remains out of scope for this wave
- batch outputs remain ignored in `data/work/batches/batch-112/`

## Batch Table

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Unresolved Issues / Review Concerns | Validation | Self-Review | Commit Hash |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| batch-112 | pages 1-2; plan-type background, benefit-responsive GIC payment provisions, C-3 risk reduction, insurer administration, periodic review, and closing boundary note | plan type and GIC guidance slice | Keep the two-page guideline together, preserve the page-image backstop, and stop before any later guideline file. | regulatory_requirement; definition_or_terminology; cross_reference_mapping; governance_or_control_expectation; company_or_prudent_estimate_assumption; background_content; boundary_control_window; requires_human_interpretation | page-image wording confirmation; plan-type boundary remains review-only; insurer administration / certificate-of-intent context remains review-only | passed | reasonable_with_minor_cautions | `8acc376` |

## Higher-Caution Section

- The page image remains the wording backstop because the opening page contains encoding noise.
- The plan-type language should not be over-read as a full mechanics set; it remains a review-only context slice.
- The C-3-risk and insurer-administration language should stay review-only until a human confirms the guideline interpretation.
- The certificate-of-intent language is control context, not a promotion candidate.
- The closing boundary stays on page 2, and AG 31 remains out of scope.

## Human Review Checklist

- Are the extracted requirements source-bound?
- Are page and section references sufficient for review?
- Are requirement and explanation separated correctly?
- Are plan-type and policyholder references separated from interpretation?
- Are C-3-risk and insurer-administration references separated from control evidence?
- Are cross-references mapped without over-interpreting them?
- Is the page-image backstop still visible for the encoding-noisy opening page?
- Are any items candidates for future learner-facing promotion?
- Are any items candidates for RAG or app export later?

## Promotion Decision Area

- [x] Keep review-only
- [ ] Revise extraction
- [ ] Promote selected items to learner-facing draft
- [ ] Prepare RAG-ready candidate set
- [ ] Prepare app-export candidate set

## Recommended Review Order

1. Plan-type and withdrawal-treatment language first.
2. C-3-risk and insurer-administration context second.
3. Page-image wording confirmation last.

## Relationship to Other Review Indexes

- AG 30 is its own short-guideline wave and should be reviewed alongside `docs/review/valuation_regulation_repository_poc_status.md`.
- The VM review indexes remain the broader valuation-manual context:
  - `docs/review/vm20_review_index.md`
  - `docs/review/supporting_vm_review_index.md`
  - `docs/review/vm21_review_index.md`
  - `docs/review/vm22_review_index.md`
- `docs/review/ag29_review_index.md` remains the immediately preceding short-guideline handoff and is useful context for the page-image backstop pattern.

## Review Notes

- This index summarizes the ignored batch review packet without promoting any extracted content.
- The page-image wording backstop stays visible for the batch because the opening page contains encoding noise.
- Reviewers should start from the batch table and the higher-caution section, then move to the self-review note at `docs/review/ag30_self_review.md`.
