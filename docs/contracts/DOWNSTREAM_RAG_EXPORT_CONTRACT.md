# Downstream RAG Export Contract
**Producer:** `fongstein1/document-processor`  
**Consumer:** `fongstein1/valuation-manual-knowledge-assistant`  
**Standard:** 2026 NAIC Valuation Manual Controlled-Source Interface  
**Version:** 1.0 (Locked)

---

## 1. Architectural Scope & Invariant Principles

The Document Processor acts as the upstream authoritative intake, OCR normalization, segmentation, and evidence verification engine for the NAIC Valuation Manual Knowledge Assistant.

To protect against hallucinations, source contamination, and unauthorized publication of copyrighted regulatory texts, the interface adheres to three inviolable architectural principles:

1. **Fail-Closed Promotion Invariant:** Downstream RAG services must **NEVER** ingest or index any package or chunk that has not been explicitly promoted via a signed human decision record. Review-only, candidate, staged, educational, and unadopted materials are blocked by default.
2. **Immutable Traceability:** Every chunk delivered to downstream RAG must link back to an immutable source document hash (`sourceSha256`), verifiable page/section coordinates, and a chunk content SHA-256 (`textHash`).
3. **No Unadopted Standard Ingestion (Anti-Fabrication):** Only adopted, binding regulatory instruments for the active governing year (2026) are eligible for promotion into the authoritative answer bank. Unadopted exposure drafts and prospective amendments are marked `REJECTED`.

---

## 2. Authoritative Manifest Contract

Downstream consumers read the primary catalog from:
`data/processed/source_indexes/repository-manifest.json`

### Manifest JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DocumentProcessorRepositoryManifest",
  "type": "object",
  "required": ["schemaVersion", "generatedAt", "sourcePackages"],
  "properties": {
    "schemaVersion": { "type": "string" },
    "generatedAt": { "type": "string", "format": "date-time" },
    "sourcePackages": {
      "type": "array",
      "items": { "$ref": "#/definitions/SourcePackage" }
    }
  },
  "definitions": {
    "SourcePackage": {
      "type": "object",
      "required": [
        "sourceId",
        "sourceTitle",
        "sourceReference",
        "sourceIndexPath",
        "sourceSha256",
        "chunkCount",
        "promotionStatus",
        "reviewOnly"
      ],
      "properties": {
        "sourceId": { "type": "string" },
        "sourceTitle": { "type": "string" },
        "sourceReference": { "type": "string" },
        "jurisdiction": { "type": "string" },
        "documentType": { "type": "string" },
        "sourceIndexPath": { "type": "string" },
        "sourceSha256": { "type": "string" },
        "chunkCount": { "type": "integer", "minimum": 0 },
        "promotionStatus": { "type": "string", "enum": ["promoted", "not_promoted", "quarantined", "rejected"] },
        "reviewOnly": { "type": "boolean" },
        "lineReferencesAvailable": { "type": "boolean" },
        "textLayerQuality": { "type": "string", "enum": ["clean", "noisy", "unverified"] },
        "pageImageBackstop": { "type": "boolean" }
      }
    }
  }
}
```

### Downstream Ingestion Filter (Mandatory Consumer Implementation)
The Knowledge Assistant loader (`valuation-manual-knowledge-assistant/scripts/load_sources.js`) must strictly enforce:
```javascript
function isPackageEligibleForDownstreamRag(pkg) {
  return (
    pkg.promotionStatus === 'promoted' &&
    pkg.reviewOnly === false &&
    pkg.chunkCount > 0 &&
    typeof pkg.sourceSha256 === 'string' &&
    pkg.sourceSha256.length === 64
  );
}
```
Any package evaluating to `false` is completely omitted from embedding pipelines, vector databases, and user-facing proposition generation.

---

## 3. Normalized Chunk Export Contract

Normalized source chunks are delivered either via package-specific source index files (e.g. `data/processed/source_indexes/sources/*.json`) or the consolidated export stream:
`data/processed/source_indexes/exports/source_chunks.jsonl`

### The 7 Mandatory Chunk Fields
Each exported chunk line in `source_chunks.jsonl` must contain all 7 mandatory fields:

| Field Name | Type | Example | Description |
|---|---|---|---|
| `chunkId` | `string` | `"vm20-sec3-c-1-npr-calc"` | Deterministic, unique slug identifier for the chunk. |
| `documentId` | `string` | `"vm20-canonical-coverage"` | Parent package / source identifier. |
| `edition` | `string` | `"2026 NAIC Valuation Manual"` | Governing regulatory edition. |
| `sectionLocator` | `string` | `"VM-20 Section 3.C.1 (pp. 67-68)"` | Human-verifiable hierarchical citation and page location. |
| `textExcerpt` | `string` | `"The net premium reserve shall be..."` | Normalized source text extracted from governing document. |
| `textHash` | `string` | `"a1b2c3d4e5f6..."` (SHA-256 hex) | Cryptographic hash of the `textExcerpt` string. |
| `licensingStatus` | `string` | `"CLEARED_INTERNAL_POC"` | Legal usage clearance classification. |

### Chunk JSONL Schema (Draft-07)
```json
{
  "type": "object",
  "required": [
    "chunkId",
    "documentId",
    "edition",
    "sectionLocator",
    "textExcerpt",
    "textHash",
    "licensingStatus"
  ],
  "properties": {
    "chunkId": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "documentId": { "type": "string" },
    "edition": { "type": "string" },
    "sectionLocator": { "type": "string" },
    "pageStart": { "type": "integer" },
    "pageEnd": { "type": "integer" },
    "textExcerpt": { "type": "string", "minLength": 1 },
    "textHash": { "type": "string", "pattern": "^[a-f0-9]{64}$" },
    "licensingStatus": { "type": "string" },
    "tags": { "type": "array", "items": { "type": "string" } }
  }
}
```

---

## 4. Current Baseline Promotion State

In the current canonical catalog:
- **Eligible Promoted Packages:** Exactly **10** packages (representing 460 chunks).
  1. `vm01-definitions` (98 chunks)
  2. `vm20-canonical-coverage` (18 chunks)
  3. `vm20-section3c-hierarchical` (18 chunks)
  4. `vm20-assumptions-section-3c` (18 chunks)
  5. `vm20-remaining-prose-appendix-coverage` (18 chunks)
  6. `vm20-framework-overview` (18 chunks)
  7. `vm20-framework-boundary` (18 chunks)
  8. `vm21-current-manual` (118 chunks)
  9. `vm30-current-manual` (58 chunks)
  10. `vm31-current-manual` (86 chunks)
- **Quarantined / Review-Only Packages:** Exactly **15** packages in `repository-manifest.json` (including `vm22-current-manual` with 83 chunks, 8 Actuarial Guidelines, 3 NY State Regulations, 3 Practice Notes). All are blocked from downstream RAG.

---

## 5. Verification Commands

### Manifest & Hash Verification
```powershell
# Verify SHA-256 of the repository manifest
Get-FileHash -Algorithm SHA256 "data/processed/source_indexes/repository-manifest.json"

# Validate that only promoted packages are ingested
node -e "
const m = require('./data/processed/source_indexes/repository-manifest.json');
const promoted = m.sourcePackages.filter(p => p.promotionStatus === 'promoted' && !p.reviewOnly);
console.log('Promoted count:', promoted.length);
if (promoted.length !== 10) process.exit(1);
"
```
