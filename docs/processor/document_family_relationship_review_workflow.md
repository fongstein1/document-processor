# Document-Family Relationship Review Workflow

The relationship registry is a documentary candidate layer. It is not a legal
authority model and it does not replace the canonical source index.

## Candidate fields

Every generated relationship should preserve:

- source and target IDs;
- source-to-target direction;
- relationship type;
- confidence and evidence strength;
- generation rule;
- source locator evidence where practical;
- a caveat about legal or actuarial interpretation;
- pending review status;
- `promotionStatus: not_promoted` and `promotionEligible: false`.

## Evidence hierarchy

Use stronger evidence before weaker evidence:

1. explicit textual statement;
2. formal title, amendment numbering, or official version metadata;
3. exact cross-reference;
4. tracked review-artifact link;
5. source-inventory metadata;
6. filename inference;
7. semantic similarity.

Filename inference and semantic similarity must not create a confirmed edge.

## Legal-effect safeguards

The processor must not automatically conclude that:

- an amendment fully supersedes the base regulation;
- an FAQ has binding authority;
- a Law Manual reprint is the controlling source;
- a later document invalidates an earlier document;
- a duplicate or reprint has independent legal force.

Use documentary wording such as `amends` or `companion_to` only as a
review-required candidate and retain a caveat. Effective-date, controlling-
source, supersession, and authority questions require human review.

## Human decisions

Reviewers may record one of:

- `approve`;
- `reject`;
- `revise_type`;
- `reverse_direction`;
- `merge_duplicate`;
- `defer`;
- `escalate`.

Record the reviewer, review date, rationale, final relationship type, final
confidence, and promotion eligibility. Approval does not automatically
promote a relationship to learner-facing, app-ready, or RAG-ready status.

## Regulation 213 proof of concept

The Reg-213 registry uses formal amendment titles to suggest documentary
`amends` edges to the base regulation, maps the FAQ as `companion_to`, and
maps review indexes and self-reviews as review artifacts. It deliberately does
not infer `supersedes`, `reprints`, `duplicate_of`, or answer-level `clarifies`
edges without stronger evidence.
