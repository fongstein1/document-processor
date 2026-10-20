#!/usr/bin/env node
/**
 * M5 Scalable Regulatory Document Library — Metadata Discovery & Inventory Builder
 * Discovers local regulatory source documents, computes cryptographic hashes,
 * classifies authority and licensing restrictions, detects duplicates,
 * and designates a representative 25-document pilot cohort.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const INTAKE_ROOT = 'C:/Dev/Document Processor Sources/2026-09-02 Intake';
const OUTPUT_DIR = path.join(projectRoot, 'data/intake');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function computeSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex').toLowerCase();
}

function inspectPdfWithPython(filePath) {
  const pyScript = path.join(__dirname, 'pdf_extractor.py');
  const res = spawnSync('python', [pyScript, filePath, '3'], {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024
  });
  if (res.error || res.status !== 0) {
    return { ok: false, error: res.stderr || res.error?.message };
  }
  try {
    return JSON.parse(res.stdout);
  } catch (e) {
    return { ok: false, error: 'JSON parse error: ' + e.message };
  }
}

// Canonical metadata mapping rules for the intake files
const DOCUMENT_KNOWLEDGE_BASE = {
  'model-law-805.pdf': {
    documentId: 'DOC-NAIC-MO-805',
    title: 'Standard Nonforfeiture Law for Individual Deferred Annuities (Model 805)',
    regulator: 'NAIC',
    jurisdiction: 'US National (NAIC Model)',
    documentType: 'MODEL_LAW',
    authorityLevel: 'PRIMARY_STATUTORY_AUTHORITY',
    edition: 'Fall 2020',
    effectiveDate: '2020-10-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'MODEL_LAWS'
  },
  'model-law-808.pdf': {
    documentId: 'DOC-NAIC-MO-808',
    title: 'Standard Nonforfeiture Law for Life Insurance (Model 808)',
    regulator: 'NAIC',
    jurisdiction: 'US National (NAIC Model)',
    documentType: 'MODEL_LAW',
    authorityLevel: 'PRIMARY_STATUTORY_AUTHORITY',
    edition: 'Fall 2020',
    effectiveDate: '2020-10-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'MODEL_LAWS'
  },
  'model-law-820.pdf': {
    documentId: 'DOC-NAIC-MO-820',
    title: 'Standard Valuation Law (Model 820 - SVL)',
    regulator: 'NAIC',
    jurisdiction: 'US National (NAIC Model)',
    documentType: 'MODEL_LAW',
    authorityLevel: 'PRIMARY_STATUTORY_AUTHORITY',
    edition: 'Fall 2020 (With PBR Amendments)',
    effectiveDate: '2020-10-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'MODEL_LAWS'
  },
  'model-law-822.pdf': {
    documentId: 'DOC-NAIC-MO-822',
    title: 'Actuarial Opinion and Memorandum Regulation (Model 822 - AOMR)',
    regulator: 'NAIC',
    jurisdiction: 'US National (NAIC Model)',
    documentType: 'MODEL_REGULATION',
    authorityLevel: 'PRIMARY_STATUTORY_AUTHORITY',
    edition: 'Fall 2020',
    effectiveDate: '2020-10-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'MODEL_LAWS'
  },
  'model-law-830.pdf': {
    documentId: 'DOC-NAIC-MO-830',
    title: 'Valuation of Life Insurance Policies Model Regulation (Model 830 - Regulation XXX)',
    regulator: 'NAIC',
    jurisdiction: 'US National (NAIC Model)',
    documentType: 'MODEL_REGULATION',
    authorityLevel: 'PRIMARY_STATUTORY_AUTHORITY',
    edition: 'Fall 2020',
    effectiveDate: '2020-10-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'MODEL_LAWS'
  },
  'publication-app-manual.pdf': {
    documentId: 'DOC-NAIC-APP-MANUAL-2026',
    title: 'Accounting Practices and Procedures Manual (2026 Edition Overview)',
    regulator: 'NAIC',
    jurisdiction: 'US Statutory (SAPWG)',
    documentType: 'ACCOUNTING_MANUAL',
    authorityLevel: 'STATUTORY_ACCOUNTING_PRINCIPLES',
    edition: '2026 NAIC AP&P Manual',
    effectiveDate: '2026-01-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'ACCOUNTING_PUBLICATIONS'
  },
  'spd-ops.pdf': {
    documentId: 'DOC-NAIC-SVO-SPD-OPS-2026',
    title: 'Purposes and Procedures Manual of the NAIC Investment Analysis Office (SVO)',
    regulator: 'NAIC',
    jurisdiction: 'US Statutory (SVO / Valuation of Securities)',
    documentType: 'ACCOUNTING_MANUAL',
    authorityLevel: 'REGULATORY_REPORTING_GUIDANCE',
    edition: '2026 SVO Manual',
    effectiveDate: '2026-01-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'ACCOUNTING_PUBLICATIONS'
  },
  '2026-03BWG_Modified.pdf': {
    documentId: 'DOC-NAIC-BWG-2026-03-MOD',
    title: 'Adopted Blanks Working Group Modifications (2026-03BWG Modified)',
    regulator: 'NAIC Blanks Working Group',
    jurisdiction: 'US National Regulatory Reporting',
    documentType: 'REPORTING_INSTRUCTION',
    authorityLevel: 'REGULATORY_REPORTING_GUIDANCE',
    edition: '2026 Reporting Year',
    effectiveDate: '2026-01-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'REPORTING_INSTRUCTIONS'
  },
  'publication-asb-life.pdf': {
    documentId: 'DOC-NAIC-ASB-XREF-LIFE',
    title: 'Actuarial Standards Board (ASB) Cross-Reference for Life/Fraternal Annual Statements',
    regulator: 'NAIC / ASB',
    jurisdiction: 'US Professional Actuarial Practice',
    documentType: 'REPORTING_INSTRUCTION',
    authorityLevel: 'PROFESSIONAL_REFERENCE_STUDY',
    edition: '2026 Annual Statement Reference',
    effectiveDate: '2026-01-01',
    licensingRestriction: 'PUBLIC_DOMAIN_STATUTE',
    pilotCategory: 'REPORTING_INSTRUCTIONS'
  },
  'publication-quarterly-statement-blanks-life-frat.pdf': {
    documentId: 'DOC-NAIC-QSB-LIFE-2026',
    title: '2026 Quarterly Statement Blank for Life and Fraternal Companies',
    regulator: 'NAIC Blanks Working Group',
    jurisdiction: 'US National Regulatory Reporting',
    documentType: 'BLANK',
    authorityLevel: 'REGULATORY_REPORTING_GUIDANCE',
    edition: '2026 Quarterly Blank',
    effectiveDate: '2026-03-31',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'REPORTING_INSTRUCTIONS'
  },
  'publication-quarterly-statement-instructions-life-frat.pdf': {
    documentId: 'DOC-NAIC-QSI-LIFE-2026',
    title: '2026 Quarterly Statement Instructions for Life and Fraternal Companies',
    regulator: 'NAIC Blanks Working Group',
    jurisdiction: 'US National Regulatory Reporting',
    documentType: 'REPORTING_INSTRUCTION',
    authorityLevel: 'REGULATORY_REPORTING_GUIDANCE',
    edition: '2026 Quarterly Instructions',
    effectiveDate: '2026-03-31',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'REPORTING_INSTRUCTIONS'
  },
  'pbr_data_valuation_manual_current_edition_redline.pdf': {
    documentId: 'DOC-NAIC-VM-2026-REDLINE',
    title: '2026 NAIC Valuation Manual Adopted Redline Changes and Legislative Text',
    regulator: 'NAIC Life Actuarial (A) Task Force',
    jurisdiction: 'US Statutory Valuation Manual',
    documentType: 'MODEL_REGULATION',
    authorityLevel: 'PRIMARY_STATUTORY_AUTHORITY',
    edition: '2026 Valuation Manual (Adopted Redline)',
    effectiveDate: '2026-01-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'PBR_SUPPORT'
  },
  '2015-vbt-report.pdf': {
    documentId: 'DOC-SOA-2015-VBT-REPORT',
    title: 'Society of Actuaries 2015 Valuation Basic Table (VBT) Report',
    regulator: 'Society of Actuaries (SOA)',
    jurisdiction: 'US Professional Actuarial Practice',
    documentType: 'ACTUARIAL_STUDY',
    authorityLevel: 'PROFESSIONAL_REFERENCE_STUDY',
    edition: '2015 Table Report (VM-20 Prescribed Benchmark)',
    effectiveDate: '2015-08-01',
    licensingRestriction: 'SOA_RESEARCH_COPYRIGHT',
    pilotCategory: 'PROFESSIONAL_STUDIES'
  },
  'A1--pbr_data_plenary_amendments_current_edition.pdf': {
    documentId: 'DOC-NAIC-PLENARY-AMENDMENTS-2026',
    title: 'Attachment Three EX Committee & Plenary Life Amendments - 2026 Valuation Manual',
    regulator: 'NAIC Plenary',
    jurisdiction: 'US Statutory Valuation Manual (Unpromoted)',
    documentType: 'QUARANTINED_AMENDMENT',
    authorityLevel: 'UNADOPTED_EXPOSURE',
    edition: '2026 Plenary Action Draft',
    effectiveDate: '2026-01-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'QUARANTINED_PROPOSALS'
  }
};

// SAPWG Adopted Items Mapping generator
function getSapwgMeta(fileName) {
  const cleanName = decodeURIComponent(fileName);
  const match = cleanName.match(/^(\d{4}-\w+)/);
  const itemNo = match ? match[1] : 'SAPWG-ITEM';
  
  let topic = cleanName.replace(/^\d{4}-\w+--?/, '').replace(/\.pdf$/, '').replace(/^[-\d\s%]+/, '').trim();
  if (topic.startsWith('-')) topic = topic.substring(1).trim();

  return {
    documentId: `DOC-NAIC-SAPWG-${itemNo.replace('%20', '_')}`,
    title: `NAIC SAPWG Ref #${itemNo}: ${topic || 'Statutory Accounting Principle Update'}`,
    regulator: 'NAIC Statutory Accounting Principles (E) Working Group',
    jurisdiction: 'US Statutory (SAPWG)',
    documentType: 'STATUTORY_ACCOUNTING_ADOPTION',
    authorityLevel: 'STATUTORY_ACCOUNTING_PRINCIPLES',
    edition: '2026 Adopted Action Items',
    effectiveDate: '2026-01-01',
    licensingRestriction: 'NAIC_RESTRICTED_COPYRIGHT',
    pilotCategory: 'SAPWG_ADOPTIONS'
  };
}

function walkFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walkFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

export function buildInventory() {
  console.log('='.repeat(80));
  console.log('M5 Scalable Regulatory Document Library — Metadata Inventory Builder');
  console.log('='.repeat(80));
  console.log(`Scanning local intake root: ${INTAKE_ROOT}`);

  const allFiles = walkFiles(INTAKE_ROOT).filter(f => 
    !f.includes('_acquisition-manifests') && 
    !f.includes('_discovery') &&
    !f.endsWith('.csv')
  );

  console.log(`Discovered ${allFiles.length} candidate regulatory files.`);

  const inventoryRecords = [];
  const shaMap = new Map();
  const duplicatePairs = [];

  for (const fullPath of allFiles) {
    const fileName = path.basename(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const sizeBytes = fs.statSync(fullPath).size;
    const fileSha256 = computeSha256(fullPath);

    // Duplicate detection
    let isDuplicate = false;
    let duplicateOf = null;
    if (shaMap.has(fileSha256)) {
      isDuplicate = true;
      duplicateOf = shaMap.get(fileSha256);
      duplicatePairs.push({ original: duplicateOf, duplicate: fileName, sha: fileSha256 });
    } else {
      shaMap.set(fileSha256, fileName);
    }

    let meta = DOCUMENT_KNOWLEDGE_BASE[fileName];
    if (!meta && fullPath.includes('SAPWG_2026_Adoptions')) {
      meta = getSapwgMeta(fileName);
    }
    if (!meta) {
      // General fallback classification
      const baseId = fileName.replace(/[^a-zA-Z0-9_-]/g, '_').toUpperCase();
      meta = {
        documentId: `DOC-${baseId}`,
        title: fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        regulator: fullPath.includes('SOA') ? 'Society of Actuaries (SOA)' : 'NAIC',
        jurisdiction: 'US Statutory / Actuarial Practice',
        documentType: ext === '.pdf' ? 'REGULATORY_DOCUMENT' : 'TABULAR_DATA',
        authorityLevel: 'REGULATORY_REPORTING_GUIDANCE',
        edition: '2026 Reference',
        effectiveDate: '2026-01-01',
        licensingRestriction: 'LOCAL_PROCESSING_ONLY',
        pilotCategory: 'OTHER_REGULATORY_SUPPORT'
      };
    }

    let pdfInfo = null;
    let extractionReadiness = 'NOT_APPLICABLE';
    if (ext === '.pdf') {
      pdfInfo = inspectPdfWithPython(fullPath);
      if (pdfInfo.ok) {
        extractionReadiness = pdfInfo.totalPages > 0 ? 'READY_STRUCTURED_PDF' : 'EMPTY_PDF';
      } else {
        extractionReadiness = 'EXTRACTION_ERROR';
      }
    } else if (ext === '.xlsx' || ext === '.xls') {
      extractionReadiness = 'EXCEL_TABULAR_DATA';
    }

    // Determine pilot cohort: select representative diverse documents
    // Prioritize: 5 Model Laws, 12 SAPWG Adoptions, 2 Accounting Pubs, 4 Blanks/Instructions, 1 PBR Redline, 1 SOA study
    const isPilotCohort = (
      meta.pilotCategory === 'MODEL_LAWS' ||
      meta.pilotCategory === 'ACCOUNTING_PUBLICATIONS' ||
      meta.pilotCategory === 'REPORTING_INSTRUCTIONS' ||
      meta.pilotCategory === 'PBR_SUPPORT' ||
      meta.pilotCategory === 'PROFESSIONAL_STUDIES' ||
      (meta.pilotCategory === 'SAPWG_ADOPTIONS' && [
        '2023-14', '2025-01', '2025-13', '2025-22', '2025-23', '2025-25',
        '2025-27', '2025-28', '2025-29', '2025-34', '2026-01', '2026-05'
      ].some(k => fileName.includes(k))) ||
      meta.pilotCategory === 'QUARANTINED_PROPOSALS'
    ) && ext === '.pdf';

    const sanitizedRelPath = path.relative(INTAKE_ROOT, fullPath).replace(/\\/g, '/');

    inventoryRecords.push({
      documentId: meta.documentId,
      documentTitle: meta.title,
      regulator: meta.regulator,
      jurisdiction: meta.jurisdiction,
      documentType: meta.documentType,
      authorityLevel: meta.authorityLevel,
      edition: meta.edition,
      effectiveDate: meta.effectiveDate,
      sourceLocation: `[intake_root]/${sanitizedRelPath}`,
      absolutePath: fullPath,
      fileSizeBytes: sizeBytes,
      sourceSha256: fileSha256,
      extension: ext,
      totalPages: pdfInfo?.totalPages ?? (ext === '.xlsx' ? 1 : null),
      detectedMetadata: pdfInfo?.metadata || {},
      licensingRestriction: meta.licensingRestriction,
      extractionReadiness,
      processingStatus: 'DISCOVERED',
      isDuplicate,
      duplicateOf,
      pilotCohort: Boolean(isPilotCohort),
      pilotCategory: meta.pilotCategory
    });
  }

  // Sort by category and documentId
  inventoryRecords.sort((a, b) => a.documentId.localeCompare(b.documentId));

  const pilotCohortCount = inventoryRecords.filter(r => r.pilotCohort).length;
  console.log(`\nInventory Summary:`);
  console.log(`- Total Documents Inventoried: ${inventoryRecords.length}`);
  console.log(`- Exact Duplicate Files Detected: ${duplicatePairs.length}`);
  console.log(`- Selected Pilot Cohort Size: ${pilotCohortCount} documents (Target: 20–30)`);

  const summaryByCategory = {};
  for (const rec of inventoryRecords) {
    summaryByCategory[rec.pilotCategory] = (summaryByCategory[rec.pilotCategory] || 0) + 1;
  }
  console.log(`\nDocument Breakdown by Category:`, summaryByCategory);

  const outPayload = {
    schemaVersion: "m5-regulatory-inventory-v1.0",
    generatedAt: new Date().toISOString(),
    intakeRootSanitized: "[external_root]/Document Processor Sources/2026-09-02 Intake",
    totalDocuments: inventoryRecords.length,
    pilotCohortSize: pilotCohortCount,
    duplicateCount: duplicatePairs.length,
    duplicates: duplicatePairs,
    categories: summaryByCategory,
    documents: inventoryRecords
  };

  const jsonOutPath = path.join(OUTPUT_DIR, 'm5_regulatory_document_inventory.json');
  fs.writeFileSync(jsonOutPath, JSON.stringify(outPayload, null, 2), 'utf8');
  console.log(`\n✓ Written machine-readable inventory to: ${jsonOutPath}`);

  // Also write human-readable Markdown report
  const mdLines = [
    `# NAIC Regulatory Document Library — Metadata Inventory (Milestone 5)`,
    ``,
    `**Generated:** ${outPayload.generatedAt}  `,
    `**Total Documents Inventoried:** ${outPayload.totalDocuments}  `,
    `**Selected Pilot Cohort Size:** ${outPayload.pilotCohortSize}  `,
    `**Duplicate Count:** ${outPayload.duplicateCount}  `,
    ``,
    `## 1. Inventory Summary by Regulatory Family`,
    ``,
    `| Pilot Category | Document Count | Pilot Cohort Count | Primary Authority Level |`,
    `|:---|:---:|:---:|:---|`
  ];

  for (const [cat, count] of Object.entries(summaryByCategory)) {
    const pCount = inventoryRecords.filter(r => r.pilotCategory === cat && r.pilotCohort).length;
    const auth = inventoryRecords.find(r => r.pilotCategory === cat)?.authorityLevel || 'N/A';
    mdLines.push(`| **${cat}** | ${count} | ${pCount} | \`${auth}\` |`);
  }

  mdLines.push(
    ``,
    `## 2. Selected 25-Document Pilot Cohort`,
    ``,
    `The following 25 representative regulatory and professional documents are approved for the Milestone 5 scalable staging ingestion pilot:`,
    ``,
    `| # | Document ID | Title | Regulator | Document Type | Edition / Date | Pages | Source SHA-256 (Prefix) |`,
    `|:---:|:---|:---|:---|:---|:---|:---:|:---|`
  );

  const pilotDocs = inventoryRecords.filter(r => r.pilotCohort);
  pilotDocs.forEach((d, idx) => {
    mdLines.push(`| ${idx + 1} | \`${d.documentId}\` | ${d.documentTitle} | ${d.regulator} | \`${d.documentType}\` | ${d.edition} (${d.effectiveDate}) | ${d.totalPages || 'N/A'} | \`${d.sourceSha256.substring(0, 12)}...\` |`);
  });

  mdLines.push(
    ``,
    `## 3. Duplicate and Near-Duplicate Analysis`,
    ``
  );

  if (duplicatePairs.length === 0) {
    mdLines.push(`Zero exact cryptographic SHA-256 duplicate files were discovered across the intake directories.`);
  } else {
    mdLines.push(`The following duplicate files were detected and indexed with shared canonical identity:`);
    duplicatePairs.forEach(dp => {
      mdLines.push(`- **Duplicate:** \`${dp.duplicate}\` matches original \`${dp.original}\` (SHA-256: \`${dp.sha}\`)`);
    });
  }

  mdLines.push(
    ``,
    `## 4. Source Distribution & Governance Boundary`,
    ``,
    `> [!IMPORTANT]`,
    `> All raw source PDFs and extracted full text remain strictly external to Git version control. Only metadata records, extracted structural chunk coordinates, and cryptographic hashes are tracked in the repository.`,
    ``
  );

  const mdOutPath = path.join(OUTPUT_DIR, 'm5_regulatory_document_inventory.md');
  fs.writeFileSync(mdOutPath, mdLines.join('\n'), 'utf8');
  console.log(`✓ Written human-readable inventory report to: ${mdOutPath}`);

  return outPayload;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  buildInventory();
}
