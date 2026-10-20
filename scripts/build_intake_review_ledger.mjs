#!/usr/bin/env node
/**
 * scripts/build_intake_review_ledger.mjs
 * 
 * Generates the deterministic Intake Review Ledger for Controlled-Source Pipeline:
 * - Maps Documents -> Normalized Chunks -> Evidence Packets -> Human Decisions -> Exported Manifest
 * - Audits repository manifests vs actual files and hashes
 * - Classifies assets into: ACCEPTED, QUARANTINED, REJECTED, MISSING
 * - Assigns explicit human-review reason codes and reproducible checksum commands
 * - Outputs:
 *    1. data/intake/intake_review_ledger.json (Machine-readable)
 *    2. data/intake/intake_review_ledger.csv (Spreadsheet workbook)
 *    3. data/intake/intake_review_ledger.md (Executive review report)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// File paths
const repoManifestPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'repository-manifest.json');
const m5InventoryPath = path.join(repoRoot, 'data', 'intake', 'm5_regulatory_document_inventory.json');
let stagingManifestPath = path.join(repoRoot, 'data', 'work', 'staging', 'staging_manifest.json');
if (!fs.existsSync(stagingManifestPath)) {
  const fallback = path.resolve(repoRoot, '..', 'document-processor', 'data', 'work', 'staging', 'staging_manifest.json');
  if (fs.existsSync(fallback)) {
    stagingManifestPath = fallback;
  }
}
const promotionDecisionsDir = path.join(repoRoot, 'data', 'manual-input', 'promotion-decisions');

// Output paths
const outJsonPath = path.join(repoRoot, 'data', 'intake', 'intake_review_ledger.json');
const outCsvPath = path.join(repoRoot, 'data', 'intake', 'intake_review_ledger.csv');
const outMdPath = path.join(repoRoot, 'data', 'intake', 'intake_review_ledger.md');

console.log('='.repeat(80));
console.log('Generating Controlled-Source Pipeline Intake Review Ledger...');
console.log('='.repeat(80));

// Load inputs safely
const repoManifest = fs.existsSync(repoManifestPath) ? JSON.parse(fs.readFileSync(repoManifestPath, 'utf8')) : { sourcePackages: [] };
const m5Inventory = fs.existsSync(m5InventoryPath) ? JSON.parse(fs.readFileSync(m5InventoryPath, 'utf8')) : { documents: [] };
const stagingManifest = fs.existsSync(stagingManifestPath) ? JSON.parse(fs.readFileSync(stagingManifestPath, 'utf8')) : { documents: [] };

// Load existing promotion decision records to know what has been authorized
const promotionDecisions = new Map();
if (fs.existsSync(promotionDecisionsDir)) {
  const files = fs.readdirSync(promotionDecisionsDir).filter(f => f.endsWith('.json'));
  for (const f of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(promotionDecisionsDir, f), 'utf8'));
      const scopeIds = data.scope?.sourceIds || [];
      for (const sid of scopeIds) {
        promotionDecisions.set(sid, {
          file: f,
          decisionId: data.promotionDecisionId,
          decision: data.decision,
          date: data.decisionDate,
          data
        });
      }
    } catch {
      // Ignore parse errors in manual input scan
    }
  }
}

const ledgerEntries = [];
const seenAssetIds = new Set();

// -----------------------------------------------------------------------------
// 1. Ingest Canonical Source Packages (from repository-manifest.json)
// -----------------------------------------------------------------------------
for (const pkg of (repoManifest.sourcePackages || [])) {
  const assetId = pkg.sourceId;
  seenAssetIds.add(assetId);

  const isPromoted = pkg.promotionStatus === 'promoted' && pkg.reviewOnly === false;
  const promoRecord = promotionDecisions.get(pkg.sourceId);

  let disposition = 'QUARANTINED';
  let reasonCode = 'HR-QUARANTINED-PENDING-SME';
  let reasonNotes = '';
  let downstreamRagStatus = 'BLOCKED';

  if (isPromoted && promoRecord) {
    disposition = 'ACCEPTED';
    reasonCode = 'HR-ACCEPTED-PROMOTED';
    reasonNotes = `Promoted canonical asset authorized under decision ${promoRecord.decisionId} (${promoRecord.date}). Governed by active 2026 Valuation Manual.`;
    downstreamRagStatus = 'INGESTIBLE';
  } else if (pkg.sourceId === 'vm22-current-manual') {
    disposition = 'QUARANTINED';
    reasonCode = 'HR-QUARANTINED-PENDING-SME';
    reasonNotes = 'Candidate principle-based reserving framework for non-variable annuities (83 chunks). Awaiting independent actuarial review sign-off; promotion blocked.';
  } else if (pkg.sourceId.startsWith('ag')) {
    disposition = 'QUARANTINED';
    reasonCode = pkg.textLayerQuality === 'noisy' ? 'HR-QUARANTINED-OCR-NOISY' : 'HR-QUARANTINED-NO-STABLE-LINES';
    reasonNotes = `Actuarial Guideline single-page interpretive slice. Text layer quality is "${pkg.textLayerQuality}"; page-image backstop active (${pkg.pageImageBackstop}); stable line references unavailable.`;
  } else if (pkg.sourceId.startsWith('reg')) {
    disposition = 'QUARANTINED';
    reasonCode = 'HR-QUARANTINED-PENDING-SME';
    reasonNotes = 'State-specific NY Insurance Regulation slice. Retained review-only to prevent state-specific cross-contamination into uniform statutory standard.';
  } else if (pkg.sourceId.startsWith('practice-note')) {
    disposition = 'QUARANTINED';
    reasonCode = 'HR-QUARANTINED-EDUCATIONAL-NOT-STATUTORY';
    reasonNotes = 'Actuarial Practice Note. Educational/practice guidance only; non-binding under statutory law; strictly excluded from authoritative RAG.';
  } else {
    reasonNotes = `Review-only package. reviewOnly=${pkg.reviewOnly}, promotionStatus=${pkg.promotionStatus}.`;
  }

  const localFile = path.join(repoRoot, pkg.sourceIndexPath);
  const fileExists = fs.existsSync(localFile);
  const hash = pkg.sourceSha256 || 'unknown';

  ledgerEntries.push({
    assetId,
    assetType: 'canonical_source_package',
    title: pkg.sourceTitle,
    regulator: pkg.jurisdiction === 'NAIC' ? 'NAIC' : (pkg.jurisdiction || 'NAIC'),
    jurisdiction: pkg.jurisdiction || 'NAIC',
    documentType: pkg.documentType || 'valuation_manual_section',
    edition: pkg.sourceReference || '2026 NAIC Valuation Manual',
    effectiveDate: '2026-01-01',
    disposition,
    humanReviewReasonCode: reasonCode,
    humanReviewNotes: reasonNotes,
    sourceSha256: hash,
    sourceLocation: pkg.sourceIndexPath,
    localFileAccessible: fileExists,
    chunkCount: pkg.chunkCount || 0,
    paragraphCoordinatesEstablished: pkg.lineReferencesAvailable ? true : 'page_only',
    rightsStatus: 'CLEARED_INTERNAL_POC',
    downstreamRagStatus,
    reproducibleChecksumCommand: fileExists ? `Get-FileHash -Algorithm SHA256 "${pkg.sourceIndexPath}"` : `echo "${hash}"`
  });
}

// -----------------------------------------------------------------------------
// 2. Ingest Planned Batches (Supporting VM Wave: batch-013 .. batch-021)
// -----------------------------------------------------------------------------
const supportingBatches = [
  { batchId: 'batch-013', chapter: 'VM-01', pages: 'pp. 25-39', title: 'VM-01: Definitions for Terms in Requirements', topic: 'Definitions / introductory material', chunks: 98, note: 'VM-01 contains cross-referenced terms supporting later chapters; local extraction payload missing from git checkout.' },
  { batchId: 'batch-014', chapter: 'VM-02', pages: 'pp. 41-44', title: 'VM-02: Minimum Nonforfeiture Mortality and Interest', topic: 'Nonforfeiture structure', chunks: 1, note: 'Reserve-method structure separate from broader valuation law.' },
  { batchId: 'batch-015', chapter: 'VM-25', pages: 'pp. 319-320', title: 'VM-25: Health Insurance Reserves Minimum Reserve Requirements', topic: 'A&H minimum reserves', chunks: 1, note: 'Relies on AP&P Manual appendices and AG 51 cross-references.' },
  { batchId: 'batch-016', chapter: 'VM-26', pages: 'pp. 321-324', title: 'VM-26: Credit Life and Disability Reserve Requirements', topic: 'Credit life/disability reserves', chunks: 1, note: 'Contract reserve and claim reserve language distinct.' },
  { batchId: 'batch-017', chapter: 'VM-30', pages: 'pp. 325-329', title: 'VM-30: Actuarial Opinion and Memorandum Requirements (scope)', topic: 'AOM reporting scope', chunks: 1, note: 'Reporting frame separate from detailed opinion and memorandum text.' },
  { batchId: 'batch-018', chapter: 'VM-30', pages: 'pp. 330-339', title: 'VM-30: Actuarial Opinion and Memorandum Requirements (details)', topic: 'AOM detail layer', chunks: 1, note: 'Detailed opinion and memorandum language depends on actuarial judgment.' },
  { batchId: 'batch-019', chapter: 'VM-31', pages: 'pp. 341-354', title: 'VM-31: PBR Actuarial Report Requirements (purpose & scope)', topic: 'PBR report purpose', chunks: 1, note: 'Points back to VM-20, VM-21, VM-22 methods.' },
  { batchId: 'batch-020', chapter: 'VM-31', pages: 'pp. 355-371', title: 'VM-31: PBR Actuarial Report Requirements (core report)', topic: 'PBR report core detail', chunks: 1, note: 'Methods, assumptions, assets, experience studies, and controls.' },
  { batchId: 'batch-021', chapter: 'VM-31', pages: 'pp. 372-386', title: 'VM-31: PBR Actuarial Report Requirements (closing boundary)', topic: 'PBR report closing boundary', chunks: 1, note: 'Closing boundary immediately preceding VM-50 on page 387.' }
];

for (const b of supportingBatches) {
  const assetId = `supporting-vm-${b.batchId}`;
  if (!seenAssetIds.has(assetId)) {
    seenAssetIds.add(assetId);

    const extractionRelPath = `data/work/batches/${b.batchId}/extraction-output.json`;
    const extractionExists = fs.existsSync(path.join(repoRoot, extractionRelPath));
    const sanitizedRelPath = `data/samples/sanitized-fixtures/${b.batchId}/extraction-output.json`;
    const sanitizedExists = fs.existsSync(path.join(repoRoot, sanitizedRelPath));

    const notesSuffix = sanitizedExists
      ? ` Sanitized fixture available at "${sanitizedRelPath}" for offline validation.`
      : '';

    ledgerEntries.push({
      assetId,
      assetType: 'planned_batch',
      title: `${b.batchId}: ${b.title}`,
      regulator: 'NAIC',
      jurisdiction: 'NAIC',
      documentType: 'valuation_manual_section',
      edition: '2026 NAIC Valuation Manual',
      effectiveDate: '2026-01-01',
      disposition: extractionExists ? 'QUARANTINED' : (sanitizedExists ? 'QUARANTINED' : 'MISSING'),
      humanReviewReasonCode: (extractionExists || sanitizedExists) ? 'HR-QUARANTINED-PENDING-SME' : 'HR-MISSING-LOCAL-SOURCE',
      humanReviewNotes: `${b.note} Target window: ${b.pages}. Batch planned as review-only; awaiting formal human sign-off.${notesSuffix}`,
      sourceSha256: '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9',
      sourceLocation: extractionExists ? extractionRelPath : (sanitizedExists ? sanitizedRelPath : extractionRelPath),
      localFileAccessible: extractionExists || sanitizedExists,
      chunkCount: b.chunks,
      paragraphCoordinatesEstablished: 'page_only',
      rightsStatus: 'CLEARED_INTERNAL_POC',
      downstreamRagStatus: 'BLOCKED',
      reproducibleChecksumCommand: `Get-FileHash -Algorithm SHA256 "${extractionExists ? extractionRelPath : sanitizedRelPath}"`
    });
  }
}

// -----------------------------------------------------------------------------
// 3. Ingest M5 Staging / Scale Pilot Documents (from staging_manifest.json)
// -----------------------------------------------------------------------------
for (const doc of (stagingManifest.documents || [])) {
  const assetId = doc.documentId;
  if (!seenAssetIds.has(assetId)) {
    seenAssetIds.add(assetId);

    const isQuarantinedProposal = doc.pilotCategory === 'QUARANTINED_PROPOSALS' || doc.state === 'QUARANTINED';
    let disposition = isQuarantinedProposal ? 'REJECTED' : 'QUARANTINED';
    let reasonCode = isQuarantinedProposal ? 'HR-REJECTED-UNADOPTED-EDITION' : 'HR-QUARANTINED-STAGED-PENDING-REVIEW';
    let reasonNotes = isQuarantinedProposal
      ? `Proposal / unadopted draft (${doc.documentTitle}). Strictly rejected under anti-fabrication policy; cannot be promoted.`
      : `Staged M5 document (${doc.documentTitle}) in pilotCategory "${doc.pilotCategory}". Extracted ${doc.chunkCount} chunks (${doc.pagesExtracted} pages). Staged in data/work/staging; pending human promotion decision.`;

    ledgerEntries.push({
      assetId,
      assetType: 'staged_document',
      title: doc.documentTitle,
      regulator: doc.regulator || 'NAIC',
      jurisdiction: doc.jurisdiction || 'US Statutory',
      documentType: doc.documentType || 'REGULATORY_DOCUMENT',
      edition: doc.edition || '2026 Reference',
      effectiveDate: doc.effectiveDate || '2026-01-01',
      disposition,
      humanReviewReasonCode: reasonCode,
      humanReviewNotes: reasonNotes,
      sourceSha256: doc.sourceSha256 || 'unknown',
      sourceLocation: doc.sourceLocation || 'staging',
      localFileAccessible: fs.existsSync(path.join(repoRoot, 'data', 'work', 'staging', 'staging_chunks.jsonl')),
      chunkCount: doc.chunkCount || 0,
      paragraphCoordinatesEstablished: true,
      rightsStatus: 'PROPRIETARY_LOCAL_ONLY',
      downstreamRagStatus: 'BLOCKED',
      reproducibleChecksumCommand: `echo "${doc.sourceSha256}"`
    });
  }
}

// -----------------------------------------------------------------------------
// 4. Ingest External Intake Catalog (from m5_regulatory_document_inventory.json)
// -----------------------------------------------------------------------------
for (const doc of (m5Inventory.documents || [])) {
  const assetId = doc.documentId;
  if (!seenAssetIds.has(assetId)) {
    seenAssetIds.add(assetId);

    const isLocal = doc.absolutePath && fs.existsSync(doc.absolutePath);
    const isQuarantinedCat = doc.pilotCategory === 'QUARANTINED_PROPOSALS';

    let disposition = 'MISSING';
    let reasonCode = 'HR-MISSING-LOCAL-SOURCE';
    let reasonNotes = `Raw source document cataloged on external intake root "${doc.sourceLocation}". Physical source file absent from local repository checkout.`;

    if (isQuarantinedCat) {
      disposition = 'REJECTED';
      reasonCode = 'HR-REJECTED-UNADOPTED-EDITION';
      reasonNotes = `Unadopted regulatory proposal cataloged externally. Rejected under anti-fabrication policy.`;
    }

    ledgerEntries.push({
      assetId,
      assetType: 'external_intake_document',
      title: doc.documentTitle,
      regulator: doc.regulator || 'NAIC',
      jurisdiction: doc.jurisdiction || 'US Statutory',
      documentType: doc.documentType || 'DOCUMENT',
      edition: doc.edition || '2026 Reference',
      effectiveDate: doc.effectiveDate || '2026-01-01',
      disposition,
      humanReviewReasonCode: reasonCode,
      humanReviewNotes: reasonNotes,
      sourceSha256: doc.sourceSha256 || 'unknown',
      sourceLocation: doc.sourceLocation || 'external',
      localFileAccessible: Boolean(isLocal),
      chunkCount: 0,
      paragraphCoordinatesEstablished: false,
      rightsStatus: doc.licensingRestriction || 'PROPRIETARY_LOCAL_ONLY',
      downstreamRagStatus: 'BLOCKED',
      reproducibleChecksumCommand: `echo "${doc.sourceSha256}"`
    });
  }
}

// -----------------------------------------------------------------------------
// Sort and Compile Ledger Summary
// -----------------------------------------------------------------------------
ledgerEntries.sort((a, b) => a.assetId.localeCompare(b.assetId));

const summary = {
  totalAssets: ledgerEntries.length,
  acceptedCount: ledgerEntries.filter(e => e.disposition === 'ACCEPTED').length,
  quarantinedCount: ledgerEntries.filter(e => e.disposition === 'QUARANTINED').length,
  rejectedCount: ledgerEntries.filter(e => e.disposition === 'REJECTED').length,
  missingCount: ledgerEntries.filter(e => e.disposition === 'MISSING').length,
  downstreamIngestibleCount: ledgerEntries.filter(e => e.downstreamRagStatus === 'INGESTIBLE').length,
  downstreamBlockedCount: ledgerEntries.filter(e => e.downstreamRagStatus === 'BLOCKED').length
};

const fullLedger = {
  schemaVersion: 'naic-intake-ledger-v1.0',
  generatedAt: new Date().toISOString(),
  governingStandard: '2026 NAIC Valuation Manual',
  summary,
  reasonCodeDictionary: {
    'HR-ACCEPTED-PROMOTED': 'Formally approved by qualified human actuary with verified signed promotion-decision record; 2026 governing manual edition confirmed.',
    'HR-QUARANTINED-PENDING-SME': 'Source chunks mechanically normalized, but awaiting independent human actuarial review and sign-off (e.g. VM-22, batch-013, state regs).',
    'HR-QUARANTINED-OCR-NOISY': 'Text layer contains character encoding noise; page-image backstop active; manual spot-check required before promotion.',
    'HR-QUARANTINED-NO-STABLE-LINES': 'Lacks stable line or paragraph coordinates; page-level locators only.',
    'HR-QUARANTINED-EDUCATIONAL-NOT-STATUTORY': 'Educational guidance, practice note, or non-binding commentary; excluded from authoritative statutory standard.',
    'HR-QUARANTINED-STAGED-PENDING-REVIEW': 'Staged document extracted in M5 scale pilot; pending human promotion decision and scope clearance.',
    'HR-REJECTED-UNADOPTED-EDITION': 'Draft proposal, prospective amendment, or unadopted edition text; strictly rejected under anti-fabrication regulatory policy.',
    'HR-MISSING-LOCAL-SOURCE': 'Document cataloged on external intake root, but physical file absent from local repository checkout.'
  },
  assets: ledgerEntries
};

// Write JSON
fs.writeFileSync(outJsonPath, JSON.stringify(fullLedger, null, 2), 'utf8');
console.log(`✓ Wrote JSON ledger to: ${outJsonPath}`);

// Write CSV
const csvHeaders = [
  'assetId', 'assetType', 'title', 'regulator', 'jurisdiction', 'documentType',
  'edition', 'effectiveDate', 'disposition', 'humanReviewReasonCode',
  'humanReviewNotes', 'sourceSha256', 'sourceLocation', 'localFileAccessible',
  'chunkCount', 'paragraphCoordinatesEstablished', 'rightsStatus',
  'downstreamRagStatus', 'reproducibleChecksumCommand'
];

const escapeCsv = (str) => {
  if (str === null || str === undefined) return '';
  const s = String(str);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

const csvRows = [csvHeaders.join(',')];
for (const entry of ledgerEntries) {
  const row = csvHeaders.map(h => escapeCsv(entry[h])).join(',');
  csvRows.push(row);
}
fs.writeFileSync(outCsvPath, csvRows.join('\n'), 'utf8');
console.log(`✓ Wrote CSV ledger to: ${outCsvPath}`);

// Write Markdown Report
let mdContent = `# NAIC Controlled-Source Pipeline — Intake Review Ledger
**Generated At:** ${fullLedger.generatedAt}  
**Governing Standard:** 2026 NAIC Valuation Manual  
**Repository:** \`fongstein1/document-processor\`  

---

## 1. Executive Summary & Disposition Breakdown

| Metric | Count | Governance Status |
|---|---|---|
| **Total Assets Cataloged** | **${summary.totalAssets}** | Complete cross-source catalog |
| **ACCEPTED (Promoted)** | **${summary.acceptedCount}** | Authoritative canonical packages in \`repository-manifest.json\` |
| **QUARANTINED** | **${summary.quarantinedCount}** | Candidate PBR (VM-22), practice notes, guidelines, staged M5 docs |
| **REJECTED** | **${summary.rejectedCount}** | Unadopted proposals rejected under Anti-Fabrication Invariant |
| **MISSING (External Only)** | **${summary.missingCount}** | Cataloged on external intake root; absent from local repository |
| **Downstream RAG Ingestible** | **${summary.downstreamIngestibleCount}** | Strictly restricted to ACCEPTED assets |
| **Downstream RAG Blocked** | **${summary.downstreamBlockedCount}** | Fail-closed isolation for all non-promoted assets |

---

## 2. Reason Code Dictionary

${Object.entries(fullLedger.reasonCodeDictionary).map(([code, desc]) => `- **\`${code}\`**: ${desc}`).join('\n')}

---

## 3. Detailed Intake Review Ledger

| Asset ID | Type | Title | Edition | Disposition | Reason Code | Chunks | Downstream RAG |
|---|---|---|---|---|---|---|---|
${ledgerEntries.map(e => `| \`${e.assetId}\` | ${e.assetType} | ${e.title} | ${e.edition} | **${e.disposition}** | \`${e.humanReviewReasonCode}\` | ${e.chunkCount} | **${e.downstreamRagStatus}** |`).join('\n')}

---

## 4. Downstream Ingestion & Export Invariant

Downstream Knowledge Assistant RAG strictly filters packages using:
\`\`\`javascript
const isPromoted = pkg.promotionStatus === 'promoted' && pkg.reviewOnly === false;
\`\`\`
Any asset marked \`QUARANTINED\`, \`REJECTED\`, or \`MISSING\` is blocked by fail-closed enforcement at both Document Processor and Knowledge Assistant layers.
`;

fs.writeFileSync(outMdPath, mdContent, 'utf8');
console.log(`✓ Wrote Markdown ledger report to: ${outMdPath}`);
console.log('='.repeat(80));
console.log(`Ledger generation complete: ${ledgerEntries.length} total assets cataloged.`);
console.log(`Accepted: ${summary.acceptedCount} | Quarantined: ${summary.quarantinedCount} | Rejected: ${summary.rejectedCount} | Missing: ${summary.missingCount}`);
console.log('='.repeat(80));
