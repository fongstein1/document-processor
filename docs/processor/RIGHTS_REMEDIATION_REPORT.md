# Rights and distribution remediation report

Status: `RIGHTS_REVIEW_REQUIRED`

This is a storage-control finding, not a legal conclusion. The repository is
public, and the current processing branch contains substantive extracted text
from the A3 2026 AP&P Manual. Human/legal review is required before any
continued public distribution or promotion decision.

## Material public-branch artifacts

The following committed artifacts contain substantial A3 source text. Each was
first added in commit `1edba701c74189a16e0ac166fef1acaa30c3023d`:

| Path | Type | Approximate A3 content | Safe-remediation concern |
| --- | --- | ---: | --- |
| `data/processed/review_packages/acquisition-pilot-2026-09-02/extraction-output.json` | extraction evidence | 6,297,285 text characters; 6,462,267 serialized bytes | externalize or replace with non-content evidence |
| `data/processed/review_packages/acquisition-pilot-2026-09-02/chunk-manifest.json` | source chunks | 6,291,549 excerpt characters; 22,714,281 serialized bytes | externalize or replace with structural coordinates and hashes |
| `data/processed/review_packages/acquisition-pilot-2026-09-02/source-index-candidates.json` | review-only index candidates | 6,291,549 excerpt characters; 22,202,468 serialized bytes | externalize or replace with non-content index evidence |

The same artifact classes can contain substantive text for the other six pilot
sources. Their rights status is not adjudicated by this report; the generic
default remains `RIGHTS_REVIEW_REQUIRED` until source-specific review.

## Safe options requiring a separate human decision

1. Retain the history unchanged and restrict the repository or affected
   artifacts after rights review.
2. Replace public processing artifacts with non-content-bearing evidence in a
   new controlled commit, retaining private/external generated artifacts by
   SHA and acquisition provenance.
3. If governance approves it, perform a separately authorized history-removal
   and branch/visibility remediation. No history rewrite, branch deletion, or
   visibility change is performed here.

Raw sources and substantive extracted/chunk text must remain under the
authoritative external source root or another approved private store for
`RIGHTS_REVIEW_REQUIRED` and `RIGHTS_EXTERNAL_STORAGE_ONLY`. Git may retain
only source identity, SHA, URL, issuer, counts, structural coordinates,
validation/exception/review evidence, and hashes of external artifacts.

## Current boundary

No canonical, learner-facing, app-ready, or RAG-ready use is authorized. The
existing 20-source proposal remains selection-only. A1 is resolved by a
separate metadata-only record and is not processed in this task.
