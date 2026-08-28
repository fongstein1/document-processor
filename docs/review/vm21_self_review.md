# VM-21 Canonical Candidate Self-Review

Status: review-only, not promoted, and not eligible for downstream use.

The current 2026 VM-21 candidate reuses batches 022-037 without source
re-extraction. Deterministic reconciliation covers PDF pages 143-225, verifies
the two overlap pages exactly, excludes page 226, and preserves the intentional
printed blank page 21-83. The canonical package contains 15 parents, 63
children, and 78 exact-text chunks with source-text SHA-256 values and complete
hierarchy and adjacency.

Automated self-review passes source-boundary, source-hash, hierarchy,
source-explicit-term, derivative-metadata, relationship-governance,
structured-evidence, retrieval, evidence-sufficiency, and review-only
governance checks. Focused retrieval is 18/22 top-1 and 22/22 strict top-3;
all six unsupported and both ambiguous cases behave safely.

The remaining human-review focus is narrow but material: dense Section 6 and
Section 7 tables and formulas, Section 8 scenario-generator references,
Section 9 hedge calculations, Section 13 allocation, and the conservatism of
generated actuarial classifications. Exact source text controls over every
generated label or summary.

No promotion decision is recorded by this self-review.
