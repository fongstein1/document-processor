#!/usr/bin/env node
/**
 * NAIC Regulatory Document Library — Scalable Staging Ingestion Pipeline (Milestone 5)
 *
 * Implements:
 * 1. Resumable batch extraction of regulatory documents with page coordinates and SHA-256 hashes.
 * 2. Strict promotion state machine: DISCOVERED -> EXTRACTED -> VALIDATED -> REVIEW_READY / QUARANTINED.
 * 3. Authority-level classification (Primary Statutory vs SAP vs Reporting vs Reference vs Unadopted).
 * 4. Content-addressed chunk store (staging_chunks.jsonl in data/work/staging - gitignored).
 * 5. Metadata-only manifest and chunk index (staging_manifest.json, staging_chunk_index.json).
 * 6. Cross-reference indexing linking documents to VM Chapters, Model Laws, SSAPs, and Actuarial Guidelines.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

// Paths
const intakeInventoryPath = path.resolve(repoRoot, 'data/intake/m5_regulatory_document_inventory.json');
const stagingDir = path.resolve(repoRoot, 'data/work/staging');
const manifestJsonPath = path.join(stagingDir, 'staging_manifest.json');
const manifestMdPath = path.join(stagingDir, 'staging_manifest.md');
const chunkIndexJsonPath = path.join(stagingDir, 'staging_chunk_index.json');
const chunksJsonlPath = path.join(stagingDir, 'staging_chunks.jsonl');
const crossRefJsonPath = path.join(stagingDir, 'staging_cross_references.json');
const extractorScriptPath = path.resolve(__dirname, 'pdf_extractor.py');

// Parse CLI flags
const args = process.argv.slice(2);
const forceReingest = args.includes('--force');
const allDocs = args.includes('--all');
const dryRun = args.includes('--dry-run');
const fullPages = args.includes('--full');
const maxPagesIdx = args.indexOf('--max-pages');
const defaultMaxPages = fullPages ? null : (maxPagesIdx !== -1 ? parseInt(args[maxPagesIdx + 1], 10) : 200);

console.log("================================================================================");
console.log("M5 Scalable Regulatory Document Library — Staging Ingestion Pipeline");
console.log("================================================================================");
console.log(`Repository Root:   ${repoRoot}`);
console.log(`Staging Dir:       ${stagingDir}`);
console.log(`Options:           force=${forceReingest}, allDocs=${allDocs}, dryRun=${dryRun}, maxPages=${defaultMaxPages || 'UNLIMITED'}\n`);

// Ensure staging directory exists
if (!fs.existsSync(stagingDir)) {
  fs.mkdirSync(stagingDir, { recursive: true });
}

// Ensure inventory exists
if (!fs.existsSync(intakeInventoryPath)) {
  console.error(`Error: Inventory not found at ${intakeInventoryPath}`);
  console.error("Please run: node scripts/m5/inventory_regulatory_documents.mjs first.");
  process.exit(1);
}

const inventory = JSON.parse(fs.readFileSync(intakeInventoryPath, 'utf8'));
const candidateDocs = allDocs
  ? inventory.documents
  : inventory.documents.filter(d => d.pilotCohort === true);

console.log(`Discovered ${inventory.documents.length} inventoried documents.`);
console.log(`Selected ${candidateDocs.length} documents for ingestion processing.`);

// Load existing staging manifest if present (for resumability)
let existingManifest = { documents: [] };
if (fs.existsSync(manifestJsonPath) && !forceReingest) {
  try {
    existingManifest = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf8'));
    console.log(`Loaded existing staging manifest with ${existingManifest.documents.length} recorded documents.`);
  } catch (e) {
    console.warn(`Could not parse existing manifest (${e.message}); starting fresh.`);
  }
}

const existingDocMap = new Map((existingManifest.documents || []).map(d => [d.documentId, d]));

// Load existing chunks by document ID if available (for seamless incremental updates)
const existingChunksByDoc = new Map();
if (fs.existsSync(chunksJsonlPath) && !forceReingest) {
  try {
    const rawLines = fs.readFileSync(chunksJsonlPath, 'utf8').split('\n');
    for (const line of rawLines) {
      if (!line.trim()) continue;
      const parsedChunk = JSON.parse(line);
      if (!existingChunksByDoc.has(parsedChunk.documentId)) {
        existingChunksByDoc.set(parsedChunk.documentId, []);
      }
      existingChunksByDoc.get(parsedChunk.documentId).push(parsedChunk);
    }
    console.log(`Indexed existing chunk store with ${existingChunksByDoc.size} documents.`);
  } catch (e) {
    console.warn(`Could not index existing chunk store: ${e.message}`);
  }
}

/**
 * Execute Python PDF extractor subprocess
 */
function extractPdfViaSubprocess(pdfPath, maxPages = null) {
  return new Promise((resolve, reject) => {
    const cmdArgs = [extractorScriptPath, pdfPath];
    if (maxPages) {
      cmdArgs.push(String(maxPages));
    }

    const proc = spawn('python', cmdArgs, {
      maxBuffer: 256 * 1024 * 1024 // 256 MB buffer
    });

    let stdoutData = '';
    let stderrData = '';

    proc.stdout.on('data', chunk => {
      stdoutData += chunk.toString();
    });

    proc.stderr.on('data', chunk => {
      stderrData += chunk.toString();
    });

    proc.on('close', code => {
      if (code !== 0) {
        return reject(new Error(`PDF extractor exited with code ${code}: ${stderrData}`));
      }
      try {
        const result = JSON.parse(stdoutData);
        if (!result.ok) {
          return reject(new Error(result.error || 'Unknown extraction error'));
        }
        resolve(result);
      } catch (err) {
        reject(new Error(`Failed to parse extractor JSON output: ${err.message}. Output preview: ${stdoutData.slice(0, 300)}`));
      }
    });

    proc.on('error', err => {
      reject(new Error(`Failed to spawn extractor process: ${err.message}`));
    });
  });
}

/**
 * Cross-reference scanner
 */
function scanCrossReferences(text) {
  const refs = new Set();
  
  // Valuation Manual Chapters
  const vmMatches = text.match(/\bVM-(01|20|21|22|30|31|50|51|[GM])\b/gi);
  if (vmMatches) vmMatches.forEach(m => refs.add(m.toUpperCase()));

  // Model Laws
  const modelMatches = text.match(/\b(Model\s+(805|808|820|822|830)|MO-(805|808|820|822|830)|Standard\s+Valuation\s+Law|Standard\s+Nonforfeiture\s+Law|AOMR|Regulation\s+XXX)\b/gi);
  if (modelMatches) {
    modelMatches.forEach(m => {
      const upper = m.toUpperCase();
      if (upper.includes('805')) refs.add('MO-805');
      else if (upper.includes('808')) refs.add('MO-808');
      else if (upper.includes('820') || upper.includes('STANDARD VALUATION LAW')) refs.add('MO-820');
      else if (upper.includes('822') || upper.includes('AOMR')) refs.add('MO-822');
      else if (upper.includes('830') || upper.includes('REGULATION XXX')) refs.add('MO-830');
    });
  }

  // SSAPs
  const ssapMatches = text.match(/\bSSAP\s+(?:No\.\s+)?(\d+[A-Z]?)\b/gi);
  if (ssapMatches) {
    ssapMatches.forEach(m => {
      const numMatch = m.match(/\d+[A-Z]?/i);
      if (numMatch) refs.add(`SSAP No. ${numMatch[0].toUpperCase()}`);
    });
  }

  // Actuarial Guidelines
  const agMatches = text.match(/\b(?:Actuarial\s+Guideline|AG)\s+(\d+[A-Z]?)\b/gi);
  if (agMatches) {
    agMatches.forEach(m => {
      const num = m.match(/\d+[A-Z]?/i);
      if (num) refs.add(`AG ${num[0].toUpperCase()}`);
    });
  }

  // ASOPs
  const asopMatches = text.match(/\bASOP\s+(?:No\.\s+)?(\d+)\b/gi);
  if (asopMatches) {
    asopMatches.forEach(m => {
      const num = m.match(/\d+/);
      if (num) refs.add(`ASOP ${num[0]}`);
    });
  }

  // Experience Tables
  if (/\b2015\s+VBT\b/i.test(text) || /\bValuation\s+Basic\s+Table\b/i.test(text)) refs.add('2015 VBT');
  if (/\b2001\s+CSO\b/i.test(text) || /\b2017\s+CSO\b/i.test(text)) refs.add('CSO Mortality Tables');
  if (/\bCARVM\b/i.test(text)) refs.add('CARVM');
  if (/\bCRVM\b/i.test(text)) refs.add('CRVM');
  if (/\bNegative\s+IMR\b/i.test(text)) refs.add('Negative IMR');

  return Array.from(refs).sort();
}

/**
 * Split page text into natural paragraph chunks
 */
function chunkPageText(docRecord, pageObj) {
  const { pageNumber, text, detectedHeadings } = pageObj;
  if (!text || text.trim().length === 0) return [];

  const chunks = [];
  const primaryHeading = detectedHeadings && detectedHeadings.length > 0
    ? detectedHeadings[0]
    : `Page ${pageNumber}`;

  // If page text is under 1800 characters, keep as single page chunk
  if (text.length <= 1800) {
    const chunkText = text.trim();
    const chunkId = `doc-chunk-${docRecord.documentId}-p${pageNumber}-c1`;
    chunks.push({
      chunkId,
      documentId: docRecord.documentId,
      documentTitle: docRecord.documentTitle,
      authorityLevel: docRecord.authorityLevel,
      documentType: docRecord.documentType,
      regulatoryFamily: docRecord.pilotCategory,
      pageStart: pageNumber,
      pageEnd: pageNumber,
      heading: primaryHeading,
      sectionId: detectedHeadings && detectedHeadings.length > 0 ? detectedHeadings[0] : null,
      charCount: chunkText.length,
      wordCount: chunkText.split(/\s+/).filter(Boolean).length,
      hasTables: pageObj.hasTables,
      hasFootnotes: pageObj.hasFootnotes,
      textSha256: crypto.createHash('sha256').update(chunkText, 'utf8').digest('hex'),
      crossReferences: scanCrossReferences(chunkText),
      text: chunkText
    });
    return chunks;
  }

  // Otherwise split on double line breaks (paragraphs)
  const paragraphs = text.split(/\n\s*\n/);
  let currentChunkText = '';
  let chunkIdx = 1;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (currentChunkText.length + trimmed.length > 1500 && currentChunkText.length > 300) {
      const cText = currentChunkText.trim();
      const chunkId = `doc-chunk-${docRecord.documentId}-p${pageNumber}-c${chunkIdx}`;
      chunks.push({
        chunkId,
        documentId: docRecord.documentId,
        documentTitle: docRecord.documentTitle,
        authorityLevel: docRecord.authorityLevel,
        documentType: docRecord.documentType,
        regulatoryFamily: docRecord.pilotCategory,
        pageStart: pageNumber,
        pageEnd: pageNumber,
        heading: primaryHeading,
        sectionId: detectedHeadings && detectedHeadings.length > 0 ? detectedHeadings[0] : null,
        charCount: cText.length,
        wordCount: cText.split(/\s+/).filter(Boolean).length,
        hasTables: pageObj.hasTables,
        hasFootnotes: pageObj.hasFootnotes,
        textSha256: crypto.createHash('sha256').update(cText, 'utf8').digest('hex'),
        crossReferences: scanCrossReferences(cText),
        text: cText
      });
      chunkIdx++;
      currentChunkText = trimmed;
    } else {
      currentChunkText = currentChunkText ? `${currentChunkText}\n\n${trimmed}` : trimmed;
    }
  }

  if (currentChunkText.trim().length > 0) {
    const cText = currentChunkText.trim();
    const chunkId = `doc-chunk-${docRecord.documentId}-p${pageNumber}-c${chunkIdx}`;
    chunks.push({
      chunkId,
      documentId: docRecord.documentId,
      documentTitle: docRecord.documentTitle,
      authorityLevel: docRecord.authorityLevel,
      documentType: docRecord.documentType,
      regulatoryFamily: docRecord.pilotCategory,
      pageStart: pageNumber,
      pageEnd: pageNumber,
      heading: primaryHeading,
      sectionId: detectedHeadings && detectedHeadings.length > 0 ? detectedHeadings[0] : null,
      charCount: cText.length,
      wordCount: cText.split(/\s+/).filter(Boolean).length,
      hasTables: pageObj.hasTables,
      hasFootnotes: pageObj.hasFootnotes,
      textSha256: crypto.createHash('sha256').update(cText, 'utf8').digest('hex'),
      crossReferences: scanCrossReferences(cText),
      text: cText
    });
  }

  return chunks;
}

/**
 * Determine promotion state for newly ingested document
 */
function determinePromotionState(docRecord) {
  // 1. Quarantined documents: Plenary exposure drafts or unadopted amendments
  if (docRecord.documentId === 'DOC-NAIC-PLENARY-AMENDMENTS-2026' || docRecord.documentType === 'QUARANTINED_AMENDMENT') {
    return {
      state: 'QUARANTINED',
      quarantineReason: 'Unadopted EX Committee & Plenary draft amendment; pending formal statutory enactment.'
    };
  }

  // 2. Unadopted VM-22 material
  if (docRecord.documentId.includes('VM-22') || docRecord.documentTitle.toLowerCase().includes('vm-22') || docRecord.documentTitle.toLowerCase().includes('vm 22')) {
    // If it's a SAPWG adoption discussing VM-22, stage as REVIEW_READY for SAPWG references but quarantined for VM-22 statutory promotion
    if (docRecord.documentType === 'STATUTORY_ACCOUNTING_ADOPTION') {
      return {
        state: 'REVIEW_READY',
        quarantineReason: null,
        promotionRestriction: 'Governing statutory reserve promotion blocked; unadopted non-variable annuity framework.'
      };
    }
    return {
      state: 'QUARANTINED',
      quarantineReason: 'VM-22 non-variable annuity PBR framework remains unadopted in 2026 Valuation Manual.'
    };
  }

  // 3. All other verified documents enter REVIEW_READY (NEVER PROMOTED automatically)
  return {
    state: 'REVIEW_READY',
    quarantineReason: null
  };
}

/**
 * Main ingestion routine
 */
async function runStagingIngestion() {
  const startTime = Date.now();
  const processedDocs = [];
  const allStagingChunks = [];
  const crossRefRegistry = {
    generatedAt: new Date().toISOString(),
    entityMap: {}
  };

  let totalPagesExtracted = 0;
  let totalCharsExtracted = 0;
  let skippedCount = 0;
  let errorCount = 0;

  console.log(`Starting staging extraction sequence (${candidateDocs.length} target documents)...\n`);

  for (let i = 0; i < candidateDocs.length; i++) {
    const doc = candidateDocs[i];
    const docIdxStr = `[${i + 1}/${candidateDocs.length}]`;
    const docStartTime = Date.now();

    // Check resumability: can we reuse existing extraction?
    const existing = existingDocMap.get(doc.documentId);
    if (!forceReingest && existing && existing.sourceSha256 === doc.sourceSha256 && existing.state && existing.chunkCount > 0) {
      console.log(`${docIdxStr} SKIP (Resumed): ${doc.documentId} (SHA: ${doc.sourceSha256.slice(0, 10)}... | State: ${existing.state})`);
      processedDocs.push(existing);
      skippedCount++;
      totalPagesExtracted += (existing.pagesExtracted || existing.totalPages || 0);
      totalCharsExtracted += (existing.totalCharacters || 0);
      if (existingChunksByDoc.has(doc.documentId)) {
        const cachedChunks = existingChunksByDoc.get(doc.documentId);
        allStagingChunks.push(...cachedChunks);
        for (const chunk of cachedChunks) {
          for (const ref of (chunk.crossReferences || [])) {
            if (!crossRefRegistry.entityMap[ref]) {
              crossRefRegistry.entityMap[ref] = {
                entity: ref,
                referencingDocs: new Set(),
                chunkCount: 0
              };
            }
            crossRefRegistry.entityMap[ref].referencingDocs.add(doc.documentId);
            crossRefRegistry.entityMap[ref].chunkCount++;
          }
        }
      }
      continue;
    }

    if (dryRun) {
      console.log(`${docIdxStr} DRY-RUN: Would extract ${doc.documentId} (${doc.totalPages} pages)`);
      continue;
    }

    console.log(`${docIdxStr} EXTRACTING: ${doc.documentId}`);
    console.log(`    File:   ${doc.absolutePath}`);
    console.log(`    Type:   ${doc.documentType} | Authority: ${doc.authorityLevel}`);

    // Determine page limit for extraction
    let pagesToExtract = defaultMaxPages;
    if (doc.totalPages && doc.totalPages <= defaultMaxPages) {
      pagesToExtract = null; // Extract all pages
    }

    try {
      // Transition: DISCOVERED -> EXTRACTED
      const extractionResult = await extractPdfViaSubprocess(doc.absolutePath, pagesToExtract);
      const elapsedMs = Date.now() - docStartTime;
      const extractionSpeedPagesPerSec = (extractionResult.pagesExtracted / (elapsedMs / 1000)).toFixed(1);

      console.log(`    ✓ Extracted ${extractionResult.pagesExtracted} pages (${(extractionResult.totalCharacters / 1024).toFixed(1)} KB) in ${(elapsedMs / 1000).toFixed(2)}s (${extractionSpeedPagesPerSec} pages/s)`);

      // Chunk pages
      const docChunks = [];
      for (const pageObj of extractionResult.pages) {
        const pageChunks = chunkPageText(doc, pageObj);
        docChunks.push(...pageChunks);
      }

      // Transition: EXTRACTED -> VALIDATED
      const validationIssues = [];
      if (docChunks.length === 0) {
        validationIssues.push("No chunks generated; document may be scanned image without OCR.");
      }
      if (!extractionResult.extractedTextSha256) {
        validationIssues.push("Missing extractedTextSha256.");
      }
      if (extractionResult.pagesExtracted === 0) {
        validationIssues.push("Zero pages extracted.");
      }

      const isValid = validationIssues.length === 0;

      // Transition: VALIDATED -> REVIEW_READY or QUARANTINED
      const { state, quarantineReason, promotionRestriction } = determinePromotionState(doc);

      const finalDocRecord = {
        documentId: doc.documentId,
        documentTitle: doc.documentTitle,
        regulator: doc.regulator,
        jurisdiction: doc.jurisdiction,
        documentType: doc.documentType,
        authorityLevel: doc.authorityLevel,
        pilotCategory: doc.pilotCategory,
        edition: doc.edition,
        effectiveDate: doc.effectiveDate,
        sourceLocation: doc.sourceLocation,
        sourceSha256: doc.sourceSha256,
        extractedTextSha256: extractionResult.extractedTextSha256,
        fileSizeBytes: doc.fileSizeBytes,
        totalPages: doc.totalPages,
        pagesExtracted: extractionResult.pagesExtracted,
        chunkCount: docChunks.length,
        totalCharacters: extractionResult.totalCharacters,
        state: isValid ? state : 'EXTRACTION_ERROR',
        quarantineReason: quarantineReason || null,
        promotionRestriction: promotionRestriction || null,
        validationIssues,
        extractionTimeMs: elapsedMs,
        extractedAt: new Date().toISOString(),
        validatedAt: new Date().toISOString(),
        crossReferences: Array.from(new Set(docChunks.flatMap(c => c.crossReferences))).sort()
      };

      processedDocs.push(finalDocRecord);
      allStagingChunks.push(...docChunks);

      totalPagesExtracted += extractionResult.pagesExtracted;
      totalCharsExtracted += extractionResult.totalCharacters;

      // Aggregate cross references
      for (const chunk of docChunks) {
        for (const ref of chunk.crossReferences) {
          if (!crossRefRegistry.entityMap[ref]) {
            crossRefRegistry.entityMap[ref] = {
              entity: ref,
              referencingDocs: new Set(),
              chunkCount: 0
            };
          }
          crossRefRegistry.entityMap[ref].referencingDocs.add(doc.documentId);
          crossRefRegistry.entityMap[ref].chunkCount++;
        }
      }

      console.log(`    ✓ State: ${finalDocRecord.state} | Chunks: ${docChunks.length} | Cross-Refs: ${finalDocRecord.crossReferences.length}\n`);
    } catch (err) {
      errorCount++;
      console.error(`    ❌ Extraction failed for ${doc.documentId}: ${err.message}\n`);
      processedDocs.push({
        documentId: doc.documentId,
        documentTitle: doc.documentTitle,
        documentType: doc.documentType,
        authorityLevel: doc.authorityLevel,
        sourceSha256: doc.sourceSha256,
        state: 'EXTRACTION_ERROR',
        validationIssues: [err.message],
        failedAt: new Date().toISOString()
      });
    }
  }

  if (dryRun) {
    console.log("Dry-run complete. No files written.");
    return;
  }

  // Finalize Cross-Reference Registry serialization
  const serializedCrossRefs = {
    generatedAt: crossRefRegistry.generatedAt,
    totalEntities: Object.keys(crossRefRegistry.entityMap).length,
    entities: Object.entries(crossRefRegistry.entityMap).map(([entity, info]) => ({
      entity,
      referencingDocumentCount: info.referencingDocs.size,
      referencingDocuments: Array.from(info.referencingDocs).sort(),
      totalChunks: info.chunkCount
    })).sort((a, b) => b.totalChunks - a.totalChunks)
  };

  // Build staging manifest
  const manifestData = {
    schemaVersion: 'm5-staging-manifest-v1.0',
    generatedAt: new Date().toISOString(),
    totalDocuments: processedDocs.length,
    activeStagingDocs: processedDocs.filter(d => d.state === 'REVIEW_READY').length,
    quarantinedDocs: processedDocs.filter(d => d.state === 'QUARANTINED').length,
    errorDocs: processedDocs.filter(d => d.state === 'EXTRACTION_ERROR').length,
    totalPagesExtracted,
    totalCharactersExtracted: totalCharsExtracted,
    totalChunksGenerated: allStagingChunks.length,
    pipelineExecutionMs: Date.now() - startTime,
    documents: processedDocs
  };

  // Build lightweight chunk index (metadata only, NO full text)
  const chunkIndexData = {
    schemaVersion: 'm5-chunk-index-v1.0',
    generatedAt: new Date().toISOString(),
    totalChunks: allStagingChunks.length,
    chunks: allStagingChunks.map(c => ({
      chunkId: c.chunkId,
      documentId: c.documentId,
      authorityLevel: c.authorityLevel,
      documentType: c.documentType,
      regulatoryFamily: c.regulatoryFamily,
      pageStart: c.pageStart,
      pageEnd: c.pageEnd,
      heading: c.heading,
      sectionId: c.sectionId,
      charCount: c.charCount,
      wordCount: c.wordCount,
      textSha256: c.textSha256,
      crossReferences: c.crossReferences
    }))
  };

  // Write staging_manifest.json
  fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestData, null, 2), 'utf8');
  console.log(`✓ Staging Manifest written to: ${manifestJsonPath}`);

  // Write staging_chunk_index.json (metadata only)
  fs.writeFileSync(chunkIndexJsonPath, JSON.stringify(chunkIndexData, null, 2), 'utf8');
  console.log(`✓ Staging Chunk Index written to: ${chunkIndexJsonPath}`);

  // Write staging_cross_references.json
  fs.writeFileSync(crossRefJsonPath, JSON.stringify(serializedCrossRefs, null, 2), 'utf8');
  console.log(`✓ Cross-Reference Registry written to: ${crossRefJsonPath}`);

  // Write staging_chunks.jsonl (content-addressed chunk store, gitignored)
  if (allStagingChunks.length > 0) {
    const jsonlLines = allStagingChunks.map(c => JSON.stringify(c)).join('\n') + '\n';
    fs.writeFileSync(chunksJsonlPath, jsonlLines, 'utf8');
    console.log(`✓ Staging Chunk Store written to: ${chunksJsonlPath} (${(Buffer.byteLength(jsonlLines) / 1024 / 1024).toFixed(2)} MB)`);
  }

  // Write staging_manifest.md (Human-readable summary report)
  const manifestMd = [
    '# NAIC Scalable Regulatory Document Library — Staging Manifest (M5)',
    '',
    `**Generated:** ${manifestData.generatedAt}  `,
    `**Total Documents:** ${manifestData.totalDocuments}  `,
    `**State Breakdown:** \`REVIEW_READY\`: ${manifestData.activeStagingDocs} | \`QUARANTINED\`: ${manifestData.quarantinedDocs} | \`ERROR\`: ${manifestData.errorDocs}  `,
    `**Total Pages Extracted:** ${manifestData.totalPagesExtracted}  `,
    `**Total Staging Chunks:** ${manifestData.totalChunksGenerated}  `,
    `**Execution Time:** ${(manifestData.pipelineExecutionMs / 1000).toFixed(2)}s  `,
    '',
    '## 1. Document Lifecycle & Staging Status',
    '',
    '| # | Document ID | Title | Authority Level | State | Pages | Chunks | Quarantine / Note |',
    '|:---:|:---|:---|:---|:---:|:---:|:---:|:---|',
    ...processedDocs.map((d, idx) => {
      const qNote = d.quarantineReason || d.promotionRestriction || 'None';
      return `| ${idx + 1} | \`${d.documentId}\` | ${d.documentTitle} | \`${d.authorityLevel}\` | **\`${d.state}\`** | ${d.pagesExtracted || d.totalPages} | ${d.chunkCount || 0} | ${qNote} |`;
    }),
    '',
    '## 2. Top Cross-Referenced Regulatory Entities',
    '',
    '| Entity | Referencing Documents | Total Chunk References |',
    '|:---|:---:|:---:|',
    ...serializedCrossRefs.entities.slice(0, 15).map(e => `| **${e.entity}** | ${e.referencingDocumentCount} | ${e.totalChunks} |`),
    '',
    '## 3. Promotion Governance Notice',
    '',
    '> [!IMPORTANT]',
    '> All newly ingested documents remain in `REVIEW_READY` or `QUARANTINED` status in staging storage.',
    '> Zero documents are automatically promoted into the authoritative Valuation Manual corpus.',
    '> Extracted source text is strictly preserved in local gitignored work staging and never committed to version control.',
    ''
  ].join('\n');

  fs.writeFileSync(manifestMdPath, manifestMd, 'utf8');
  console.log(`✓ Staging Manifest Markdown written to: ${manifestMdPath}`);

  const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("\n================================================================================");
  console.log(`Ingestion Complete in ${totalTimeSec}s!`);
  console.log(`- Documents Processed: ${processedDocs.length} (Skipped: ${skippedCount}, Errors: ${errorCount})`);
  console.log(`- Active Review-Ready: ${manifestData.activeStagingDocs}`);
  console.log(`- Quarantined:         ${manifestData.quarantinedDocs}`);
  console.log(`- Total Pages:         ${totalPagesExtracted}`);
  console.log(`- Total Chunks:        ${allStagingChunks.length}`);
  console.log("================================================================================\n");
}

runStagingIngestion().catch(err => {
  console.error("Fatal error during staging ingestion:", err);
  process.exit(1);
});
