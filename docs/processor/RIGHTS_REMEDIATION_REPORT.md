# Rights and distribution remediation report

Status: `RIGHTS_REVIEW_REQUIRED`

This is a storage-control finding, not a legal conclusion. Human/legal review
is required before any distribution or promotion decision.

## A. CURRENT TREE ENFORCEMENT STATUS

The current scaled-wave replay tree is sanitized and compliant with the
storage-control model. All twelve replay source records carry
`RIGHTS_REVIEW_REQUIRED`; substantive extraction, chunk text, source-index
text, and retrieval queries are generated under the external private root
recorded in `external-artifact-manifest.json`. The Git review package is built
from explicit allowlisted projections and retains only source identity, hashes,
counts, structural coordinates, exception/review outcomes, bounded validation
evidence, and external artifact paths/hashes. The rights validator now checks
the allowlisted schema, rejects leaked nested source-content fields (including
`duplicateLabelValues` and `titleCandidates`), and verifies every required
external artifact's SHA-256, byte count, and raw-source lineage. This status
does not clear rights or make a legal determination.

External root for this run:
`C:\Dev\Document Processor Sources\_processed-private\processing-scaled-wave-01-replay-2026-09`

Manifest:
`data/processed/review_packages/scaled-wave-01-replay-2026-09/external-artifact-manifest.json`

## B. HISTORICAL GIT EXPOSURE STATUS

Historical exposure remains unresolved. The starting commit
`fe13c8f89b5a66d17c2688f38d1518f26e08bd40` and earlier commits contain
substantive evidence projections, including the previously identified A3 text
and the nested workbook fields corrected in the current tree. This report does
not rewrite history, delete branches, change repository visibility, or decide
whether historical remediation is legally or operationally required. The
current-tree correction therefore does not imply historical removal.

### Historical material public-branch artifacts

The following committed artifacts contain substantial A3 source text. Each was
first added in commit `1edba701c74189a16e0ac166fef1acaa30c3023d`:

| Path | Type | Approximate A3 content | Safe-remediation concern |
| --- | --- | ---: | --- |
| `data/processed/review_packages/acquisition-pilot-2026-09-02/extraction-output.json` | extraction evidence | 6,297,285 text characters; 6,462,267 serialized bytes | externalize or replace with non-content evidence |
| `data/processed/review_packages/acquisition-pilot-2026-09-02/chunk-manifest.json` | source chunks | 6,291,549 excerpt characters; 22,714,281 serialized bytes | externalize or replace with structural coordinates and hashes |
| `data/processed/review_packages/acquisition-pilot-2026-09-02/source-index-candidates.json` | review-only index candidates | 6,291,549 excerpt characters; 22,202,468 serialized bytes | externalize or replace with non-content index evidence |

The same artifact classes contained substantive text for the other six pilot
sources before current-tree enforcement. Their rights status is not adjudicated
by this report; the generic default remains `RIGHTS_REVIEW_REQUIRED` until
source-specific review.

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

## Remediation boundary

No canonical, learner-facing, app-ready, or RAG-ready use is authorized. The
existing 20-source proposal remains selection-only. A1 is resolved by a
separate metadata-only record and is not processed in this task.
