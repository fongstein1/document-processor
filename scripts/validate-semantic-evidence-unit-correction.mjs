import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { parseCellRef } from './lib/semantic-evidence-units.mjs'
import { externalRoot, publicRoot, repoRoot, runId } from './semantic-evidence-unit-correction.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const read = async (file) => JSON.parse(await fs.readFile(file, 'utf8'))
const publicFiles = ['evaluation-v2-freeze.json', 'evaluation-history.json', 'architecture-v2-manifest.json', 'architecture-v2-source-records.json', 'parent-v2-manifest.json', 'child-v2-manifest.json', 'header-context-v2-manifest.json', 'evaluation-v2-results.json', 'structure-ablation-v2.json', 'context-v2-results.json', 'external-artifact-v2-manifest.json', 'semantic-evidence-correction-report.json']
for (const file of publicFiles) validateGitSafeArtifact({ artifactType: file, value: await read(path.join(publicRoot, file)) })

const freeze = await read(path.join(publicRoot, 'evaluation-v2-freeze.json')); const architecture = await read(path.join(publicRoot, 'architecture-v2-manifest.json')); const sourceRecords = await read(path.join(publicRoot, 'architecture-v2-source-records.json')); const parentManifest = await read(path.join(publicRoot, 'parent-v2-manifest.json')); const childManifest = await read(path.join(publicRoot, 'child-v2-manifest.json')); const evaluation = await read(path.join(publicRoot, 'evaluation-v2-results.json')); const manifest = await read(path.join(publicRoot, 'external-artifact-v2-manifest.json'))
assert.equal(freeze.evaluationVersion, 'EVALUATION_V2'); assert.equal(freeze.originalCaseCount, 39); assert.equal(freeze.finalGoldSelectionUsesRegex, false); assert.equal(freeze.developmentCaseCount, 6); assert.equal(freeze.holdoutCaseCount, 11); assert.equal(freeze.cases.filter((item) => item.included).length, 17)
const privateFreezeBytes = await fs.readFile(freeze.privateAdjudicationPath); assert.equal(crypto.createHash('sha256').update(privateFreezeBytes).digest('hex'), freeze.privateAdjudicationSha256); assert.equal(privateFreezeBytes.length, freeze.privateAdjudicationByteCount)

const parents = parentManifest.parents; const children = childManifest.children; const parentIds = new Set(parents.map((parent) => parent.parentId)); const childIds = new Set(children.map((child) => child.childId)); const sourceMap = new Map(sourceRecords.sources.map((source) => [source.sourceId, source]))
assert.equal(parentIds.size, parents.length, 'duplicate parent IDs'); assert.equal(childIds.size, children.length, 'duplicate child IDs')
let orphanChildren = 0; let childSourceMismatches = 0; let shaMismatches = 0; let pdfBoundaryViolations = 0; let xlsxBoundaryViolations = 0; let outOfRangeCellRefs = 0
for (const child of children) {
  const parent = parents.find((candidate) => candidate.parentId === child.parentId); if (!parent) { orphanChildren += 1; continue }
  if (parent.sourceId !== child.sourceId) childSourceMismatches += 1
  if (sourceMap.get(child.sourceId)?.sourceSha256 !== child.sourceSha256) shaMismatches += 1
  if (child.pageStart !== null && parent.pageStart !== null && (child.pageStart < parent.pageStart || child.pageEnd > parent.pageEnd)) pdfBoundaryViolations += 1
  if (child.worksheetPath && (child.worksheetPath !== parent.worksheetPath || child.rowStart < parent.rowStart || child.rowEnd > parent.rowEnd || parseCellRef(`${child.colStart}1`).col < parseCellRef(`${parent.colStart}1`).col || parseCellRef(`${child.colEnd}1`).col > parseCellRef(`${parent.colEnd}1`).col)) xlsxBoundaryViolations += 1
  for (const ref of child.cellRefs || []) { const cell = parseCellRef(ref); if (!cell || cell.row < child.rowStart || cell.row > child.rowEnd || cell.col < parseCellRef(`${child.colStart}1`).col || cell.col > parseCellRef(`${child.colEnd}1`).col) outOfRangeCellRefs += 1 }
}
assert.equal(orphanChildren, 0); assert.equal(childSourceMismatches, 0); assert.equal(shaMismatches, 0); assert.equal(pdfBoundaryViolations, 0); assert.equal(xlsxBoundaryViolations, 0); assert.equal(outOfRangeCellRefs, 0)

let cycles = 0
for (const parent of parents) { const visited = new Set([parent.parentId]); let next = parent.parentParentId; while (next) { if (visited.has(next)) { cycles += 1; break } visited.add(next); const ancestor = parents.find((candidate) => candidate.parentId === next); assert(ancestor, `orphan parent: ${parent.parentId}/${next}`); assert.equal(ancestor.sourceId, parent.sourceId); next = ancestor.parentParentId } for (const id of parent.childIds || []) assert(childIds.has(id), `unresolved child list entry: ${id}`); for (const id of parent.childParentIds || []) assert(parentIds.has(id), `unresolved child-parent list entry: ${id}`) }
assert.equal(cycles, 0)

let xlsxUnionMismatches = 0
for (const parent of parents.filter((item) => item.parentType === 'workbook_table_block')) {
  const expected = new Set(parent.cellRefs || []); const actual = new Set(children.filter((child) => child.parentId === parent.parentId).flatMap((child) => child.cellRefs || []))
  if (expected.size !== actual.size || [...expected].some((ref) => !actual.has(ref))) xlsxUnionMismatches += 1
}
assert.equal(xlsxUnionMismatches, 0, 'XLSX child union mismatch')

let nonCellExceptions = 0; let preservedNonCellExceptions = 0
for (const source of sourceRecords.sources.filter((item) => /spreadsheet/i.test(item.documentType || ''))) {
  const old = await read(path.join('C:\\Dev\\Document Processor Sources', '_processed-private', 'parent-child-context-architecture-2026-09', source.sourceId, 'parent-child-substantive.json'))
  const current = await read(path.join(externalRoot, source.sourceId, 'semantic-evidence-substantive.json'))
  for (const chunk of old.baselineChunks) { const code = chunk.extensions?.exceptionCode || chunk.extensions?.contentInventory?.exceptionCode; if (!code) continue; nonCellExceptions += 1; if (current.children.some((child) => child.sourceChunkIds.includes(chunk.chunkId) && child.reviewFlags.includes(code))) preservedNonCellExceptions += 1 }
}
assert.equal(preservedNonCellExceptions, nonCellExceptions)

for (const artifact of manifest.artifacts) { const absolute = path.resolve(artifact.externalPath); const relative = path.relative(repoRoot, absolute); assert(relative.startsWith('..' + path.sep) || path.isAbsolute(relative)); const bytes = await fs.readFile(absolute); assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), artifact.sha256); assert.equal(bytes.length, artifact.byteCount) }
for (const metrics of Object.values(evaluation.metrics)) for (const split of ['development', 'holdout', 'combined']) for (const [key, value] of Object.entries(metrics[split])) if (key !== 'caseCount' && key !== 'irrelevantContextCount') assert(value >= 0 && value <= 1, `${key} outside [0,1]`)
assert.equal(evaluation.rankingInputExcludesTestExpectations, true); assert.equal(architecture.sourceCount, 6); assert.equal(evaluation.systems.E_ROLE_AWARE_CONTEXT.length, 17)

console.log(JSON.stringify({ validator: 'semantic-evidence-unit-correction', result: 'PASS', runId, sourceCount: architecture.sourceCount, parentCount: parents.length, childCount: children.length, orphanChildren, duplicateParentIds: parents.length - parentIds.size, duplicateChildIds: children.length - childIds.size, invalidParentCycles: cycles, childSourceMismatches, shaLineageMismatches: shaMismatches, pdfBoundaryViolations, xlsxBoundaryViolations, outOfRangeCellRefs, xlsxUnionMismatches, nonCellExceptions, preservedNonCellExceptions, externalArtifacts: manifest.artifacts.length, rightsSafePublicEvidence: true }, null, 2))
