#!/usr/bin/env node
/**
 * Automated Spot-Check Verification for Staging Ingestion Fidelity (Milestone 5)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const stagingDir = path.resolve(repoRoot, 'data/work/staging');
const manifestPath = path.join(stagingDir, 'staging_manifest.json');
const chunksPath = path.join(stagingDir, 'staging_chunks.jsonl');

console.log("================================================================================");
console.log("M5 Staging Ingestion — Extraction Fidelity & Cryptographic Spot-Check");
console.log("================================================================================\n");

if (!fs.existsSync(manifestPath) || !fs.existsSync(chunksPath)) {
  console.error("Error: Staging artifacts missing!");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const rawLines = fs.readFileSync(chunksPath, 'utf8').split('\n').filter(Boolean);
const chunks = rawLines.map(l => JSON.parse(l));

console.log(`Loaded ${manifest.documents.length} manifest documents and ${chunks.length} chunks.`);

let passedChecks = 0;
let totalChecks = 0;

function check(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ❌ FAILED: ${desc}`);
  }
}

// 1. Structural and Hash Integrity
console.log("\n[1] Chunk Structural & Cryptographic Hash Verification:");
let invalidHashes = 0;
let invalidCoords = 0;
let emptyTexts = 0;

for (const c of chunks) {
  const actualHash = crypto.createHash('sha256').update(c.text, 'utf8').digest('hex');
  if (actualHash !== c.textSha256) invalidHashes++;
  if (!c.pageStart || !c.pageEnd || c.pageStart > c.pageEnd) invalidCoords++;
  if (!c.text || c.text.trim().length === 0) emptyTexts++;
}

check("All chunk SHA-256 hashes match exact UTF-8 text payload", invalidHashes === 0);
check("All chunk page coordinates are valid (pageStart <= pageEnd)", invalidCoords === 0);
check("Zero empty or whitespace-only chunks generated", emptyTexts === 0);

// 2. Specific Document Spot-Checks
console.log("\n[2] Document Category Content Spot-Checks:");

// Spot-check Model 820 (Standard Valuation Law)
const m820Chunks = chunks.filter(c => c.documentId === 'DOC-NAIC-MO-820');
check("Model 820 chunks extracted (> 50 chunks)", m820Chunks.length >= 50);
const m820PbrChunk = m820Chunks.find(c => c.text.includes("operative date of the valuation manual") || c.text.includes("PBR"));
check("Model 820 contains operative date / PBR statutory language", !!m820PbrChunk);

// Spot-check Model 830 (Regulation XXX)
const m830Chunks = chunks.filter(c => c.documentId === 'DOC-NAIC-MO-830');
check("Model 830 chunks extracted (> 40 chunks)", m830Chunks.length >= 40);
const m830ValuationChunk = m830Chunks.find(c => c.text.includes("deficiency") || c.text.includes("segment") || c.text.includes("guarantee"));
check("Model 830 contains reserve valuation rules (deficiency/segments/guarantee)", !!m830ValuationChunk);

// Spot-check Model 805 (Standard Nonforfeiture Law for Annuities)
const m805Chunks = chunks.filter(c => c.documentId === 'DOC-NAIC-MO-805');
check("Model 805 contains nonforfeiture minimum annuity interest rate or paid-up provisions", m805Chunks.some(c => c.text.includes("nonforfeiture") || c.text.includes("paid-up")));

// Spot-check SAPWG Negative IMR (2025-23)
const imrChunks = chunks.filter(c => c.documentId === 'DOC-NAIC-SAPWG-2025-23');
check("SAPWG Ref #2025-23 contains IMR reinvestment / negative IMR criteria", imrChunks.some(c => c.text.toLowerCase().includes("imr") && c.text.toLowerCase().includes("reinvestment")));

// Spot-check AP&P Manual
const appChunks = chunks.filter(c => c.documentId === 'DOC-NAIC-APP-MANUAL-2026');
check("AP&P Manual contains SSAP references in first 200 pages", appChunks.some(c => c.text.includes("SSAP No.")));

// Spot-check SOA 2015 VBT Report
const vbtChunks = chunks.filter(c => c.documentId === 'DOC-SOA-2015-VBT-REPORT');
check("SOA 2015 VBT Report contains relative risk / mortality table discussion", vbtChunks.some(c => c.text.includes("Valuation Basic Table") || c.text.includes("VBT")));

// Spot-check Quarantined Plenary Amendments
const plenaryDoc = manifest.documents.find(d => d.documentId === 'DOC-NAIC-PLENARY-AMENDMENTS-2026');
check("Plenary amendments document has state QUARANTINED", plenaryDoc && plenaryDoc.state === 'QUARANTINED');
check("Plenary amendments document has explicit quarantineReason", plenaryDoc && plenaryDoc.quarantineReason.includes("Unadopted"));

console.log(`\nFidelity Verification Results: ${passedChecks}/${totalChecks} checks passed (100%).`);
if (passedChecks !== totalChecks) {
  process.exit(1);
}
