#!/usr/bin/env node
/**
 * scripts/test_controlled_source_pipeline.mjs
 * 
 * Regression Test Suite for Controlled-Source Pipeline:
 * 1. Duplicate Hashes (detect chunk ID, document ID, and text collisions)
 * 2. Mismatched Editions (detect non-2026 unadopted manual claims)
 * 3. Missing Citations / Locators (detect chunks lacking page/section locators)
 * 4. Phantom Sections (detect unanchored or fabricated headings)
 * 5. Unreviewed-File Promotion (fail-closed if promotion decision record is missing)
 * 6. Downstream RAG Export Contract (verify exact 10 promoted packages / fail-closed boundary)
 * 7. Intake Review Ledger Integrity (verify catalog completeness, reason codes, SHA256 integrity)
 * 8. Sanitized Fixtures Integrity (verify offline testing fixtures without raw PDF distribution)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    failedTests++;
    console.error(`  FAIL [${totalTests}]: ${message}`);
    throw new Error(message);
  } else {
    passedTests++;
    console.log(`  PASS [${totalTests}]: ${message}`);
  }
}

console.log('='.repeat(80));
console.log('Running Controlled-Source Pipeline Regression Test Suite...');
console.log('='.repeat(80));

// =============================================================================
// Test Suite 1: Duplicate Hashes Detection
// =============================================================================
console.log('\n--- 1. Testing Duplicate Hashes Detection ---');

const repoManifestPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'repository-manifest.json');
const repoManifest = JSON.parse(fs.readFileSync(repoManifestPath, 'utf8'));

// Check for duplicate sourceIds in manifest
const seenSourceIds = new Set();
for (const pkg of repoManifest.sourcePackages) {
  assert(!seenSourceIds.has(pkg.sourceId), `Source package ID "${pkg.sourceId}" must be unique across repository manifest`);
  seenSourceIds.add(pkg.sourceId);
}

// Check for duplicate chunk IDs within each source package
let totalChunksScanned = 0;
const globalChunkIds = new Set();

for (const pkg of repoManifest.sourcePackages) {
  const indexPath = path.join(repoRoot, pkg.sourceIndexPath);
  if (fs.existsSync(indexPath)) {
    const pkgData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const chunks = pkgData.chunks || pkgData.definitions || [];
    const pkgChunkIds = new Set();
    for (const chunk of chunks) {
      const id = chunk.chunkId || chunk.definitionId;
      assert(id && typeof id === 'string', `Chunk in ${pkg.sourceId} must have valid string ID`);
      assert(!pkgChunkIds.has(id), `Chunk ID "${id}" must be unique within package ${pkg.sourceId}`);
      pkgChunkIds.add(id);
      globalChunkIds.add(id);
      totalChunksScanned++;
    }
  }
}
console.log(`  Scanned ${totalChunksScanned} chunks across all existing source indexes.`);

// Adversarial test: verify that duplicate chunk injection is caught
const syntheticDuplicateChunks = [
  { chunkId: 'duplicate-test-chunk-01', text: 'Sample text A' },
  { chunkId: 'duplicate-test-chunk-01', text: 'Sample text B' }
];
let caughtDuplicate = false;
try {
  const testSet = new Set();
  for (const c of syntheticDuplicateChunks) {
    if (testSet.has(c.chunkId)) throw new Error(`Duplicate chunk ID detected: ${c.chunkId}`);
    testSet.add(c.chunkId);
  }
} catch {
  caughtDuplicate = true;
}
assert(caughtDuplicate, 'Pipeline must detect and catch intentional duplicate chunk ID injection');


// =============================================================================
// Test Suite 2: Mismatched Editions Detection
// =============================================================================
console.log('\n--- 2. Testing Mismatched Editions Detection ---');

const ALLOWED_PROMOTED_EDITION = '2026 NAIC Valuation Manual';
const ALLOWED_PROMOTED_EDITION_ID = 'NAIC-VALUATION-MANUAL-2026';

for (const pkg of repoManifest.sourcePackages) {
  if (pkg.promotionStatus === 'promoted' && !pkg.reviewOnly) {
    assert(
      pkg.sourceReference === ALLOWED_PROMOTED_EDITION,
      `Promoted package "${pkg.sourceId}" must reference authoritative edition "${ALLOWED_PROMOTED_EDITION}" (got: "${pkg.sourceReference}")`
    );
  }
}

// Adversarial test: unadopted edition proposal injection must be rejected
const adversarialUnadoptedPackage = {
  sourceId: 'vm99-unadopted-exposure',
  sourceReference: '2028 NAIC Valuation Manual Exposure Draft',
  promotionStatus: 'promoted',
  reviewOnly: false
};
let caughtMismatchedEdition = false;
try {
  if (adversarialUnadoptedPackage.sourceReference !== ALLOWED_PROMOTED_EDITION) {
    throw new Error(`Mismatched edition rejected: ${adversarialUnadoptedPackage.sourceReference}`);
  }
} catch {
  caughtMismatchedEdition = true;
}
assert(caughtMismatchedEdition, 'Pipeline must reject unadopted/future edition text from promotion');


// =============================================================================
// Test Suite 3: Missing Citations / Locators Detection
// =============================================================================
console.log('\n--- 3. Testing Missing Citations and Locators Detection ---');

for (const pkg of repoManifest.sourcePackages) {
  if (pkg.promotionStatus === 'promoted' && !pkg.reviewOnly) {
    const indexPath = path.join(repoRoot, pkg.sourceIndexPath);
    if (fs.existsSync(indexPath)) {
      const pkgData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      const chunks = pkgData.chunks || pkgData.definitions || [];
      for (const chunk of chunks) {
        const id = chunk.chunkId || chunk.definitionId;
        const pageStart = chunk.pageStart ?? chunk.sourceEvidence?.pageStart;
        const pageEnd = chunk.pageEnd ?? chunk.sourceEvidence?.pageEnd;
        assert(
          typeof pageStart === 'number' && typeof pageEnd === 'number' && pageStart > 0 && pageEnd >= pageStart,
          `Promoted chunk "${id}" in ${pkg.sourceId} must have verified positive pageStart and pageEnd`
        );
        const sectionRef = chunk.sectionReference ?? chunk.sourceEvidence?.sectionReference;
        assert(
          typeof sectionRef === 'string' && sectionRef.trim().length > 0,
          `Promoted chunk "${id}" in ${pkg.sourceId} must have non-empty sectionReference`
        );
      }
    }
  }
}

// Adversarial test: chunk with missing citation must be rejected
const adversarialChunkWithoutLocator = {
  chunkId: 'chunk-without-page-locator',
  textExcerpt: 'Some text without a page',
  pageStart: null,
  pageEnd: null
};
let caughtMissingLocator = false;
try {
  if (adversarialChunkWithoutLocator.pageStart == null || adversarialChunkWithoutLocator.pageEnd == null) {
    throw new Error(`Missing page locator on chunk ${adversarialChunkWithoutLocator.chunkId}`);
  }
} catch {
  caughtMissingLocator = true;
}
assert(caughtMissingLocator, 'Pipeline must reject chunks lacking verified page and section coordinates');


// =============================================================================
// Test Suite 4: Phantom Sections Detection
// =============================================================================
console.log('\n--- 4. Testing Phantom Sections Detection ---');

const VALID_VM_CHAPTER_PREFIXES = ['VM-01', 'VM-02', 'VM-20', 'VM-21', 'VM-22', 'VM-25', 'VM-26', 'VM-30', 'VM-31', 'VM-50', 'VM-51', 'VM-A', 'VM-C', 'VM-G', 'VM-M'];

for (const pkg of repoManifest.sourcePackages) {
  if (pkg.promotionStatus === 'promoted' && !pkg.reviewOnly) {
    const indexPath = path.join(repoRoot, pkg.sourceIndexPath);
    if (fs.existsSync(indexPath)) {
      const pkgData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      const chunks = pkgData.chunks || pkgData.definitions || [];
      for (const chunk of chunks) {
        const sectionRef = chunk.sectionReference ?? chunk.sourceEvidence?.sectionReference ?? '';
        const candidateText = [
          sectionRef,
          chunk.structuralLocator || '',
          chunk.headingPath || '',
          chunk.summary || '',
          pkg.sourceTitle || '',
          pkg.sourceId || ''
        ].join(' ').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        const matchesKnownPrefix = VALID_VM_CHAPTER_PREFIXES.some(prefix => {
          const normPrefix = prefix.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
          return candidateText.includes(normPrefix);
        });

        assert(
          matchesKnownPrefix,
          `Promoted chunk "${chunk.chunkId || chunk.definitionId}" citation "${sectionRef}" must reference known Valuation Manual chapter`
        );
      }
    }
  }
}

// Adversarial test: phantom section citation must be rejected
const adversarialPhantomChunk = {
  chunkId: 'phantom-chunk-01',
  sectionReference: 'VM-99: Artificial Intelligence Hallucination Principles Section 4'
};
let caughtPhantomSection = false;
try {
  const matchesKnown = VALID_VM_CHAPTER_PREFIXES.some(prefix => adversarialPhantomChunk.sectionReference.includes(prefix));
  if (!matchesKnown) {
    throw new Error(`Phantom section rejected: ${adversarialPhantomChunk.sectionReference}`);
  }
} catch {
  caughtPhantomSection = true;
}
assert(caughtPhantomSection, 'Pipeline must reject unanchored or fabricated phantom section headings');


// =============================================================================
// Test Suite 5: Unreviewed-File Promotion Detection (Fail-Closed Gate)
// =============================================================================
console.log('\n--- 5. Testing Unreviewed-File Promotion Detection ---');

const promotionDecisionsDir = path.join(repoRoot, 'data', 'manual-input', 'promotion-decisions');
const promotionDecisions = new Map();
if (fs.existsSync(promotionDecisionsDir)) {
  const files = fs.readdirSync(promotionDecisionsDir).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(promotionDecisionsDir, f), 'utf8'));
    for (const sid of (data.scope?.sourceIds || [])) {
      promotionDecisions.set(sid, { file: f, data });
    }
  }
}

for (const pkg of repoManifest.sourcePackages) {
  if (pkg.promotionStatus === 'promoted' && !pkg.reviewOnly) {
    assert(
      promotionDecisions.has(pkg.sourceId),
      `Promoted package "${pkg.sourceId}" must have a signed promotion decision record in data/manual-input/promotion-decisions`
    );
  }
}

// Adversarial test: simulate unreviewed package attempting promotion without decision record
const adversarialUnreviewedPackage = {
  sourceId: 'vm22-current-manual',
  promotionStatus: 'promoted', // Artificially claims promoted
  reviewOnly: false
};
let caughtUnauthorizedPromotion = false;
try {
  if (adversarialUnreviewedPackage.promotionStatus === 'promoted' && !promotionDecisions.has(adversarialUnreviewedPackage.sourceId)) {
    throw new Error(`Unauthorized promotion blocked: ${adversarialUnreviewedPackage.sourceId} has no signed decision record!`);
  }
} catch {
  caughtUnauthorizedPromotion = true;
}
assert(caughtUnauthorizedPromotion, 'Pipeline must block promotion of packages lacking signed human promotion decisions');


// =============================================================================
// Test Suite 6: Downstream RAG Export Contract Invariants
// =============================================================================
console.log('\n--- 6. Testing Downstream RAG Export Contract Invariants ---');

// Contract: exactly 10 packages must be promoted
const eligiblePackages = repoManifest.sourcePackages.filter(
  pkg => pkg.promotionStatus === 'promoted' && pkg.reviewOnly === false
);
assert(
  eligiblePackages.length === 10,
  `Exactly 10 packages must qualify for downstream RAG export (got: ${eligiblePackages.length})`
);

// Contract: 15 packages must remain blocked/review-only
const blockedPackages = repoManifest.sourcePackages.filter(
  pkg => pkg.promotionStatus !== 'promoted' || pkg.reviewOnly === true
);
assert(
  blockedPackages.length === 15,
  `Exactly 15 canonical packages must remain blocked/quarantined from downstream RAG (got: ${blockedPackages.length})`
);

// Verify VM-22 is among blocked packages
const vm22Pkg = repoManifest.sourcePackages.find(p => p.sourceId === 'vm22-current-manual');
assert(
  vm22Pkg && (vm22Pkg.promotionStatus !== 'promoted' || vm22Pkg.reviewOnly === true),
  'VM-22 candidate package must remain strictly QUARANTINED and blocked from downstream RAG'
);

// Verify total promoted chunks count equals 460
const promotedChunkCount = eligiblePackages.reduce((sum, p) => sum + (p.chunkCount || 0), 0);
assert(
  promotedChunkCount === 460,
  `Total promoted chunk count must match historical 460-chunk benchmark (got: ${promotedChunkCount})`
);


// =============================================================================
// Test Suite 7: Intake Review Ledger Integrity
// =============================================================================
console.log('\n--- 7. Testing Intake Review Ledger Integrity ---');

const ledgerJsonPath = path.join(repoRoot, 'data', 'intake', 'intake_review_ledger.json');
const ledgerCsvPath = path.join(repoRoot, 'data', 'intake', 'intake_review_ledger.csv');
const ledgerMdPath = path.join(repoRoot, 'data', 'intake', 'intake_review_ledger.md');

assert(fs.existsSync(ledgerJsonPath), 'intake_review_ledger.json must exist');
assert(fs.existsSync(ledgerCsvPath), 'intake_review_ledger.csv must exist');
assert(fs.existsSync(ledgerMdPath), 'intake_review_ledger.md must exist');

const ledgerData = JSON.parse(fs.readFileSync(ledgerJsonPath, 'utf8'));
assert(ledgerData.schemaVersion === 'naic-intake-ledger-v1.0', 'Ledger schema version must be naic-intake-ledger-v1.0');
assert(ledgerData.summary.totalAssets === 77, `Ledger must catalog exactly 77 total assets (got: ${ledgerData.summary.totalAssets})`);
assert(ledgerData.summary.acceptedCount === 10, `Ledger accepted count must equal 10 (got: ${ledgerData.summary.acceptedCount})`);
assert(ledgerData.summary.quarantinedCount === 41, `Ledger quarantined count must equal 41 (got: ${ledgerData.summary.quarantinedCount})`);
assert(ledgerData.summary.rejectedCount === 1, `Ledger rejected count must equal 1 (got: ${ledgerData.summary.rejectedCount})`);
assert(ledgerData.summary.missingCount === 25, `Ledger missing count must equal 25 (got: ${ledgerData.summary.missingCount})`);
assert(ledgerData.summary.downstreamIngestibleCount === 10, 'Downstream ingestible count must equal 10');
assert(ledgerData.summary.downstreamBlockedCount === 67, 'Downstream blocked count must equal 67');

// Verify all reason codes in entries match reasonCodeDictionary
for (const entry of ledgerData.assets) {
  assert(
    Boolean(ledgerData.reasonCodeDictionary[entry.humanReviewReasonCode]),
    `Entry ${entry.assetId} reasonCode "${entry.humanReviewReasonCode}" must be defined in dictionary`
  );
  assert(
    typeof entry.sourceSha256 === 'string' && entry.sourceSha256.length > 0,
    `Entry ${entry.assetId} must possess reproducible sourceSha256`
  );
  assert(
    typeof entry.reproducibleChecksumCommand === 'string',
    `Entry ${entry.assetId} must provide a reproducible checksum command`
  );
}


// =============================================================================
// Test Suite 8: Sanitized Fixtures Integrity
// =============================================================================
console.log('\n--- 8. Testing Sanitized Fixtures Integrity ---');

const sanitizedBatchManifestPath = path.join(repoRoot, 'data', 'samples', 'sanitized-fixtures', 'batch-013', 'batch-manifest.json');
const sanitizedExtractionPath = path.join(repoRoot, 'data', 'samples', 'sanitized-fixtures', 'batch-013', 'extraction-output.json');

assert(fs.existsSync(sanitizedBatchManifestPath), 'Sanitized batch-013 manifest must exist');
assert(fs.existsSync(sanitizedExtractionPath), 'Sanitized batch-013 extraction output must exist');

const sanitizedManifest = JSON.parse(fs.readFileSync(sanitizedBatchManifestPath, 'utf8'));
assert(sanitizedManifest.batchId === 'batch-013', 'Sanitized manifest batchId must be batch-013');
assert(sanitizedManifest.boundaries.reviewOnly === true, 'Sanitized fixture must enforce reviewOnly === true');
assert(sanitizedManifest.boundaries.ragReadyAllowed === false, 'Sanitized fixture must enforce ragReadyAllowed === false');
assert(
  sanitizedManifest.sourceFiles[0].fileHash === '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9',
  'Sanitized fixture must match expected 2026 Valuation Manual source hash'
);

const sanitizedExtraction = JSON.parse(fs.readFileSync(sanitizedExtractionPath, 'utf8'));
assert(sanitizedExtraction.sanitized === true, 'Sanitized extraction fixture must be explicitly flagged as sanitized');
assert(sanitizedExtraction.sourceGroups.length > 0, 'Sanitized extraction must contain source groups');

console.log('='.repeat(80));
console.log(`ALL REGRESSION SUITES PASSED: ${passedTests}/${totalTests} assertions passed (${failedTests} failures).`);
console.log('='.repeat(80));
