# AG 37 Law Manual Reprint Review Index

Status:
- Review-only
- Not learner-facing
- Not app-ready
- Not RAG-ready
- Not promoted

Source summary:
- Source file: `Actuarial Guidelines/AG 37 - CRVM for VUL-from 2021 Law Manual.pdf`
- Relative path from received inventory: `Actuarial Guidelines/AG 37 - CRVM for VUL-from 2021 Law Manual.pdf`
- Full local path: `C:\Dev\NAIC Valuation Manual Course\NAIC Valuation Regulation\Actuarial Guidelines\AG 37 - CRVM for VUL-from 2021 Law Manual.pdf`
- Source family: actuarial guidelines
- Source reference: `Actuarial Guideline XXXVII / 2021 Law Manual reprint`
- Source title: `Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits`
- Source status: companion reprint
- Source status note: the active AG 37 source already has tracked review artifacts; this 2021 Law Manual reprint stays separate as companion-only evidence until a human reviewer confirms duplicate-source disposition.
- Page range: pages 1-10
- Page reference: `pp. 1-10`
- Line references: not expected to be stable; page locators and page images are the primary anchors
- Planning commit: `8dcdb89` (`Add AG 37 Law Manual reprint planning layer`)

Overall wave summary:
- The AG 37 Law Manual reprint wave is complete as one 10-page, review-only companion slice.
- The full reprint was kept together so the background, GMDB reserve method discussion, other issues, and effective-date closeout stayed in one bounded source unit.
- The duplicate / reprint caveat remains required because active AG 37 was already processed as batches 127-129.

Batch table:

| Batch ID | Selected Pages / Sections | Topic | Boundary Rationale | Extraction Categories | Self-Review | Unresolved Issues / Review Concerns | Validation | Planning Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `batch-277` | pages 1-10; background through effective date | AG 37 Law Manual reprint background, GMDB reserve method discussion, other issues, and effective-date closeout | Keep the full 10-page Law Manual reprint together as one companion-only slice and stop at the page 10 boundary. | `actuarial_guideline`, `companion_reprint`, `duplicate_source_check`, `regulatory_requirement`, `reserve_method_structure`, `calculation_structure`, `definition_or_terminology`, `cross_reference_mapping`, `background_content`, `boundary_control_window`, `requires_human_interpretation` | `reasonable_with_minor_cautions` | Duplicate / reprint relationship needs human confirmation; page-image wording backstop remains required; do not merge with active AG 37 automatically | Passed | `8dcdb89` |

Higher-caution areas:
- The active AG 37 PDF already has tracked review artifacts in `docs/review/ag37_review_index.md` and `docs/review/ag37_self_review.md`.
- This Law Manual reprint should remain a separate companion index unless a later human reviewer explicitly reconciles it with the active AG 37 source.
- Page locators and page images remain the wording backstop for any exact comparison against the active AG 37 PDF.
- The GMDB reserve-method discussion and effective-date material should not be reused without human confirmation of wording differences, if any.
- No item in this reprint batch is approved for learner-facing, app-ready, RAG-ready, or promoted use.

Human review checklist:
- Is the extracted item source-bound to the 10-page Law Manual reprint?
- Is the duplicate / reprint relationship to active AG 37 visible enough for later review?
- Are the page-image and page-locator backstops clear for exact wording comparisons?
- Should this remain a separate companion index, or should a later reviewer reconcile it with active AG 37?
- Are any items candidates for future learner-facing, app-ready, or RAG-ready promotion?

Promotion decision area:
- Keep review-only: [x]
- Revise extraction: [ ]
- Promote selected items to learner-facing draft: [ ]
- Prepare RAG-ready candidate set: [ ]
- Prepare app-export candidate set: [ ]

Recommended review order:
1. Confirm the Law Manual reprint identity and page 1 title.
2. Compare the background and GMDB reserve-method material against active AG 37 only if a human reviewer asks for reconciliation.
3. Confirm the effective-date closeout and page 10 boundary.
4. Decide whether the reprint remains separate companion evidence.

Relationship to other review artifacts:
- Review this reprint index alongside `docs/review/ag37_review_index.md`, `docs/review/ag37_self_review.md`, and `docs/review/valuation_regulation_repository_poc_status.md`.
- The reprint was intentionally excluded from the active AG 37 wave and is now captured as its own companion-only handoff.
- The wave remains review-only and should not be mistaken for a promotion candidate or learner-facing export.
