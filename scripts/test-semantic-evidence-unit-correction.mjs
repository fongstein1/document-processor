import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {
  classifyEvidenceRole,
  expandRoleAwareContext,
  makeFieldedBm25Index,
  meaningfulQueryPhrases,
  phraseMatchCount,
  rankBm25,
  regulatoryTokens,
  splitPdfSemanticUnits,
  subdivideWorkbookBlock
} from './lib/semantic-evidence-units.mjs'
import { buildSemanticEvidenceCorrection, externalRoot } from './semantic-evidence-unit-correction.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const config = { k1: 1.2, b: 0.75, fieldWeights: { body: 1, section: 2.5, identifier: 4, parentHeading: 1.5, sourceTitle: 0.35, header: 1.5 } }
const fields = Object.keys(config.fieldWeights)
const docs = (items) => items.map((item) => ({ section: '', identifier: '', parentHeading: '', sourceTitle: '', header: '', ...item }))
const rank = (query, items) => { const prepared = docs(items); return rankBm25(query, prepared, makeFieldedBm25Index(prepared, fields, config)) }

assert.equal(rank('zymurgy', [{ childId: 'common', body: 'report statement requirement' }, { childId: 'rare', body: 'zymurgy requirement' }])[0].doc.childId, 'rare', 'rare term IDF fixture')
assert.equal(rank('mortality', [{ childId: 'once', body: 'mortality factor' }, { childId: 'repeat', body: 'mortality mortality mortality factor' }])[0].doc.childId, 'repeat', 'term frequency fixture')
assert.equal(rank('scope', [{ childId: 'long', body: `scope ${'ordinary '.repeat(100)}` }, { childId: 'short', body: 'scope rule' }])[0].doc.childId, 'short', 'length normalization fixture')
assert.deepEqual(regulatoryTokens('VM20 SSAP No. 51R Table F Schedule S'), ['vm-20', 'ssap-51r', 'table f', 'schedule s'], 'regulatory identifier fixture')
assert(meaningfulQueryPhrases('Which current benchmark spreads appear in Table F?').includes('table f')); assert(phraseMatchCount('Which current benchmark spreads appear in Table F?', 'Table F contains current benchmark spreads.') >= 2, 'meaningful phrase fixture')
assert.deepEqual(rank('requirement', [{ childId: 'b', body: 'requirement' }, { childId: 'a', body: 'requirement' }]).map((item) => item.doc.childId), ['a', 'b'], 'deterministic tie fixture')

const parentDocs = docs([{ parentId: 'p1', body: 'ordinary section', identifier: 'ordinary' }, { parentId: 'p2', body: 'rare governing section', identifier: 'rare' }]); const parentIndex = makeFieldedBm25Index(parentDocs, fields, config)
const childDocs = docs([{ childId: 'a', parentId: 'p1', body: 'requirement' }, { childId: 'b', parentId: 'p2', body: 'requirement' }]); const childIndex = makeFieldedBm25Index(childDocs, fields, config); const parentMap = new Map(parentDocs.map((item) => [item.parentId, item]))
assert.equal(rankBm25('requirement rare governing', childDocs, childIndex)[0].doc.childId, 'a'); assert.equal(rankBm25('requirement rare governing', childDocs, childIndex, { parentIndex, parentById: parentMap, parentWeight: 0.55 })[0].doc.childId, 'b', 'parent rerank fixture')

const pdfFixture = '[p. 1] SECTION 1\nSCOPE\n1. This section applies to synthetic contracts issued in the stated jurisdiction and establishes the governing conditions for every covered record.\n2. An entity shall retain the complete record, its stable identifier, its effective date, and the source evidence supporting the reported amount.\n(a) The record includes its identifier and all associated source coordinates needed for review.\nEXCEPTION\n3. Unless approved by the designated reviewer, the exception does not apply and the ordinary retention requirement continues without modification.\n[p. 2] SECTION 2\nSCOPE\n1. This section applies to another transaction and supplies a separate governing boundary for the second synthetic example.\n2. An entity shall use a different requirement for that separately identified transaction.'
const pdfUnits = splitPdfSemanticUnits(pdfFixture, { minChars: 80, maxChars: 260 }); assert(pdfUnits.length >= 3); assert(pdfUnits.some((unit) => unit.role.role === 'SCOPE_OR_APPLICABILITY')); assert(pdfUnits.some((unit) => unit.role.role === 'EXCEPTION_OR_QUALIFICATION')); assert(pdfUnits.every((unit) => unit.text.length > 20))

const cells = ['A1: Category', 'B1: Factor']; for (let row = 2; row <= 25; row += 1) { cells.push(`A${row}: ${row <= 10 ? 'A' : 'B'}`); cells.push(`B${row}: ${row / 100}`) }
const workbook = subdivideWorkbookBlock({ sourceId: 'fixture', sourceSha256: 'f'.repeat(64), sourceFamilyId: 'fixture', documentType: 'spreadsheet', authoritySupportRole: 'current_support', rightsStatus: 'RIGHTS_REVIEW_REQUIRED', sourceChunkId: 'fixture-block', sourceChunkOrdinal: 0, sheetName: 'Factors', worksheetPath: 'xl/worksheets/sheet1.xml', worksheetOrder: 1, sheetState: 'visible', text: cells.join(' '), blockOrdinal: 1, rowWindow: 8 })
assert(workbook.children.length > 1); assert.equal(workbook.headerContexts.length, 1); assert.equal(workbook.headerContexts[0].rowStart, 1); assert.equal(workbook.headerContexts[0].rowEnd, 1)
for (const child of workbook.children) { assert(child.cellRefs.every((ref) => { const row = Number(ref.match(/\d+/)[0]); return row >= child.rowStart && row <= child.rowEnd })); if (child.rowEnd < 25) assert(!child.sourceTextExcerpt.includes('B25:'), 'bounded text must not retain out-of-range cells') }
const covered = new Set([...workbook.children.flatMap((child) => child.cellRefs), ...workbook.headerContexts.flatMap((header) => header.cellRefs)]); assert.equal(covered.size, 50, 'bounded child/header union fixture')

const contextChildren = [{ childId: 'scope', parentId: 'p', semanticRole: 'SCOPE_OR_APPLICABILITY' }, { childId: 'filler1', parentId: 'p', semanticRole: 'OTHER' }, { childId: 'target', parentId: 'p', semanticRole: 'REQUIREMENT', category: 'DO_NOT_USE' }, { childId: 'filler2', parentId: 'p', semanticRole: 'OTHER' }]
const contextArgs = { query: 'What scope governs this requirement?', selected: contextChildren[2], childrenByParent: new Map([['p', contextChildren]]), parentById: new Map([['p', { parentId: 'p' }]]), headerById: new Map() }
const expanded = expandRoleAwareContext(contextArgs); assert(expanded.contextEvidenceIds.includes('scope')); assert.equal(expanded.contextEvidenceIds.length, 2); const withoutCategory = expandRoleAwareContext({ ...contextArgs, selected: { ...contextChildren[2], category: undefined } }); assert.deepEqual(expanded, withoutCategory, 'evaluation category cannot affect expansion')
assert.equal(classifyEvidenceRole('Unless approved, this requirement does not apply.').role, 'EXCEPTION_OR_QUALIFICATION')

validateGitSafeArtifact({ artifactType: 'positive semantic evidence', value: { childId: 'c', parentId: 'p', sourceSha256: 'a'.repeat(64), rowStart: 1, rowEnd: 2, colStart: 'A', colEnd: 'B', cellRefs: ['A1', 'B2'], semanticRole: 'HEADER_CONTEXT', contentHash: 'b'.repeat(64), reviewOnly: true } })
assert.throws(() => validateGitSafeArtifact({ artifactType: 'negative parent context', value: { parentId: 'p', contextText: 'substantive source text' } }))

const a3 = JSON.parse(await fs.readFile(path.join(externalRoot, 'naic-accounting-publications-appm-2026', 'semantic-evidence-substantive.json'), 'utf8')); const ssaps = a3.parents.filter((parent) => parent.parentType === 'ssap')
assert(ssaps.length >= 10, 'A3 should expose multiple explicit SSAP parents'); assert.notEqual(ssaps[0].parentId, ssaps[1].parentId); assert(ssaps.every((parent) => parent.parentParentId)); assert(a3.children.filter((child) => child.parentId === ssaps[0].parentId || a3.parents.find((parent) => parent.parentId === child.parentId)?.parentParentId === ssaps[0].parentId).every((child) => child.pageStart >= ssaps[0].pageStart && child.pageEnd <= ssaps[0].pageEnd), 'A3 SSAP page provenance fixture')

const hashTree = async (root) => { const result = {}; const walk = async (directory) => { for (const entry of await fs.readdir(directory, { withFileTypes: true })) { const absolute = path.join(directory, entry.name); if (entry.isDirectory()) await walk(absolute); else { const relative = path.relative(root, absolute).replace(/\\/g, '/'); result[relative] = crypto.createHash('sha256').update(await fs.readFile(absolute)).digest('hex') } } }; await walk(root); return result }
let deterministicRerun = 'NOT_RUN'
if (process.argv.includes('--determinism')) {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'semantic-evidence-determinism-')); const output = path.join(temporary, 'public'); const external = path.join(temporary, 'external')
  try { await buildSemanticEvidenceCorrection({ output, external }); const first = { public: await hashTree(output), external: await hashTree(external) }; await buildSemanticEvidenceCorrection({ output, external }); const second = { public: await hashTree(output), external: await hashTree(external) }; assert.deepEqual(second, first); deterministicRerun = 'PASS' } finally { await fs.rm(temporary, { recursive: true, force: true }) }
}

console.log(JSON.stringify({ tests: 'semantic-evidence-unit-correction', result: 'PASS', fixtures: { rareTermIdf: 'PASS', repeatedTermTf: 'PASS', lengthNormalization: 'PASS', regulatoryIdentifiers: 'PASS', meaningfulPhrases: 'PASS', deterministicTies: 'PASS', parentRerankChangesRanking: 'PASS', pdfSemanticBoundaries: 'PASS', xlsxBoundedRanges: 'PASS', xlsxHeaderContext: 'PASS', roleAwareContext: 'PASS', expectationLeakage: 'PASS', rightsProjection: 'PASS', a3Hierarchy: 'PASS' }, deterministicRerun }, null, 2))
