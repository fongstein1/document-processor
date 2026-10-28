#!/usr/bin/env node
/**
 * scripts/validate_export_contract.mjs
 * 
 * Validates repository-manifest.json and source_chunks.jsonl against
 * docs/contracts/DOWNSTREAM_RAG_EXPORT_CONTRACT.md (v1.0 Locked).
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const sha256 = (str) => crypto.createHash('sha256').update(str, 'utf8').digest('hex');

const AUTHORIZED_LICENSING_STATUSES = new Set([
  'CLEARED_INTERNAL_POC',
  'FAIR_USE_RESEARCH_ONLY',
  'PUBLIC_DOMAIN_STATUTORY',
  'PROPRIETARY_NAIC_RESTRICTED',
  'AUTHORIZED_EXPRESS_CONSENT'
]);

const ALLOWED_PROMOTED_EDITIONS = new Set([
  '2026 NAIC Valuation Manual',
  'NAIC-VALUATION-MANUAL-2026',
  '2026 Valuation Manual'
]);

console.log('='.repeat(80));
console.log('Validating Downstream RAG Export Contract Conformance (v1.0 Locked)...');
console.log('='.repeat(80));

// 1. Validate repository manifest
const manifestPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'repository-manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error(`FATAL: Missing manifest at ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (!manifest.schemaVersion || !manifest.sourcePackages) {
  console.error('FATAL: Invalid manifest structure.');
  process.exit(1);
}

const promotedPackages = manifest.sourcePackages.filter(p => p.promotionStatus === 'promoted' && !p.reviewOnly);
const blockedPackages = manifest.sourcePackages.filter(p => p.promotionStatus !== 'promoted' || p.reviewOnly);

console.log(`Manifest packages: ${manifest.sourcePackages.length} total (${promotedPackages.length} promoted, ${blockedPackages.length} blocked)`);

if (promotedPackages.length !== 10) {
  console.error(`Contract violation: Expected exactly 10 promoted packages, got ${promotedPackages.length}`);
  process.exit(1);
}

if (blockedPackages.length !== 15) {
  console.error(`Contract violation: Expected exactly 15 blocked packages, got ${blockedPackages.length}`);
  process.exit(1);
}

const vm22 = manifest.sourcePackages.find(p => p.sourceId === 'vm22-current-manual');
if (!vm22 || (vm22.promotionStatus === 'promoted' && !vm22.reviewOnly)) {
  console.error('Contract violation: VM-22 must remain quarantined/blocked!');
  process.exit(1);
}

// 2. Validate source_chunks.jsonl
const jsonlPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'exports', 'source_chunks.jsonl');
if (!fs.existsSync(jsonlPath)) {
  console.error(`FATAL: Missing export JSONL at ${jsonlPath}`);
  process.exit(1);
}

const lines = fs.readFileSync(jsonlPath, 'utf8').split(/\r?\n/).filter(line => line.trim().length > 0);
console.log(`Exported JSONL chunks: ${lines.length}`);

if (lines.length !== 749) {
  console.error(`Contract violation: Expected exactly 749 exported chunks in source_chunks.jsonl, got ${lines.length}`);
  process.exit(1);
}

const mandatoryFields = [
  'chunkId',
  'documentId',
  'edition',
  'sectionLocator',
  'textExcerpt',
  'textHash',
  'licensingStatus'
];

const seenChunkIds = new Set();
const promotedPackageIds = new Set(promotedPackages.map(p => p.sourceId));
const allPackageIds = new Set(manifest.sourcePackages.map(p => p.sourceId));

let promotedChunksCount = 0;
let excludedChunksCount = 0;

for (let i = 0; i < lines.length; i++) {
  const lineNum = i + 1;
  let chunk;
  try {
    chunk = JSON.parse(lines[i]);
  } catch (err) {
    console.error(`Line ${lineNum}: Invalid JSON: ${err.message}`);
    process.exit(1);
  }

  for (const field of mandatoryFields) {
    if (chunk[field] == null || (typeof chunk[field] === 'string' && chunk[field].trim() === '')) {
      console.error(`Line ${lineNum} (${chunk.chunkId || 'unknown'}): Missing mandatory field "${field}"`);
      process.exit(1);
    }
  }

  if (seenChunkIds.has(chunk.chunkId)) {
    console.error(`Line ${lineNum}: Duplicate chunkId "${chunk.chunkId}"`);
    process.exit(1);
  }
  seenChunkIds.add(chunk.chunkId);

  if (!allPackageIds.has(chunk.documentId)) {
    console.error(`Line ${lineNum}: documentId "${chunk.documentId}" is not in manifest`);
    process.exit(1);
  }

  const isPromoted = promotedPackageIds.has(chunk.documentId);
  if (isPromoted) {
    promotedChunksCount++;
    if (!ALLOWED_PROMOTED_EDITIONS.has(chunk.edition)) {
      console.error(`Line ${lineNum} (${chunk.chunkId}): Promoted chunk has unauthorized edition "${chunk.edition}"`);
      process.exit(1);
    }
  } else {
    excludedChunksCount++;
  }

  const computedHash = sha256(chunk.textExcerpt);
  if (computedHash !== chunk.textHash) {
    console.error(`Line ${lineNum} (${chunk.chunkId}): textHash mismatch! Computed ${computedHash}, declared ${chunk.textHash}`);
    process.exit(1);
  }

  if (!AUTHORIZED_LICENSING_STATUSES.has(chunk.licensingStatus)) {
    console.error(`Line ${lineNum} (${chunk.chunkId}): Unauthorized licensingStatus "${chunk.licensingStatus}"`);
    process.exit(1);
  }
}

if (promotedChunksCount !== 460) {
  console.error(`Contract violation: Expected exactly 460 promoted chunks, got ${promotedChunksCount}`);
  process.exit(1);
}

if (excludedChunksCount !== 289) {
  console.error(`Contract violation: Expected exactly 289 excluded chunks, got ${excludedChunksCount}`);
  process.exit(1);
}

console.log(`✓ 460 promoted chunks and 289 quarantined chunks verified across 7 mandatory fields.`);

// 3. Scan for untracked/forbidden artifacts
console.log('\n--- 3. Verifying Source Licensing & File Hygiene ---');
const forbiddenExts = ['.pdf', '.exe', '.zip', '.tar', '.gz'];
const checkDir = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.name === '.git' || ent.name === 'node_modules') continue;
    if (ent.isDirectory()) {
      checkDir(full);
    } else {
      const ext = path.extname(ent.name).toLowerCase();
      if (forbiddenExts.includes(ext)) {
        console.error(`Forbidden file type found in repository: ${full}`);
        process.exit(1);
      }
    }
  }
};
checkDir(repoRoot);
console.log('✓ No forbidden binary artifacts or raw copyrighted PDFs found in repository.');

console.log('\n================================================================================');
console.log(`✓ EXPORT CONTRACT CONFORMANCE VALIDATED: All ${lines.length} chunks conform to v1.0 Locked.`);
console.log('================================================================================');
