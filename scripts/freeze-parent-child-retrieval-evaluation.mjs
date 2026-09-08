import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '..')
const runId = 'parent-child-retrieval-hardening-2026-09'
const publicRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', runId)
const externalRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', runId)
const sourceRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', 'parent-child-context-architecture-2026-09')
const sources = [
  ['naic-accounting-publications-appm-2026', 'A3'],
  ['naic-life-fraternal-reporting-asb-life-2025', 'W07'],
  ['naic-life-fraternal-reporting-qsi-life-2026', 'W08'],
  ['naic-pbr-vm-20-vm-31-vm-51-vm20-tables-2026-f-g', 'XLSX-FG'],
  ['naic-pbr-vm-20-vm-31-vm-51-vm31-templates-reports', 'XLSX-VM31'],
  ['society-of-actuaries-experience-studies-soa-2015-vbt-improvement', 'XLSX-SOA']
]
const holdoutDefinitions = [
  ['A3', 'SECTION_IDENTIFICATION', 'Which SSAP or appendix context governs this accounting material?', /SSAP\s+\d+[A-Z]?|APPENDIX\s+[A-Z0-9]+/i, 'parent-and-target'],
  ['A3', 'SCOPE_REQUIREMENT', 'What maintenance or applicability context controls the statutory accounting guidance?', /maintenance|applicability|scope/i, 'parent-and-target'],
  ['A3', 'DEFINITION_APPLICATION', 'Which defined statutory accounting concept is being explained?', /defined|definition|means/i, 'parent-and-target'],
  ['W07', 'REPORTING_FORM', 'Which annual statement page or schedule identifies the reporting form?', /ANNUAL STATEMENT BLANK|Schedule\s+[A-Z]/i, 'target'],
  ['W07', 'SCHEDULE_CONFUSION', 'What schedule-oriented reporting context is identified in the blank?', /Schedule\s+[A-Z]|Jurat/i, 'parent-and-target'],
  ['W08', 'QUARTERLY_SCOPE', 'What general context governs the quarterly statement instructions?', /In general|quarterly statement|Annual Statement Instructions/i, 'parent-and-target'],
  ['W08', 'SCHEDULE_INSTRUCTION', 'Which schedule is described for quarterly reporting?', /Schedule\s+[A-Z]/i, 'target'],
  ['W08', 'REPORTING_EXCEPTION', 'Which quarterly reporting instruction contains an exception or qualification?', /except|unless|not included/i, 'target-and-following'],
  ['XLSX-FG', 'TABLE_HEADER', 'Which VM-20 table contains current benchmark spreads?', /Table\s+[FG].*Current Benchmark Spreads/i, 'target'],
  ['XLSX-FG', 'RATING_RANGE', 'What investment-grade rating and WAL range does the spread table organize?', /Investment Grade|WAL/i, 'target'],
  ['XLSX-VM31', 'TEMPLATE_INSTRUCTION', 'What general instruction applies to completing the PBR actuarial report templates?', /General Instructions|must be completed/i, 'target'],
  ['XLSX-VM31', 'CONFIDENTIALITY_BOUNDARY', 'What disclosure boundary applies to the PBR actuarial report templates?', /confidential information|commissioner/i, 'target'],
  ['XLSX-SOA', 'MORTALITY_METHOD', 'How were the mortality improvement rates developed from experience?', /GAM model|experience/i, 'target'],
  ['XLSX-SOA', 'IMPROVEMENT_APPLICATION', 'How were mortality improvements adjusted for the stated period?', /adjusted for MI|final smoothed rates/i, 'target'],
  ['XLSX-SOA', 'SEGMENT_TABLE', 'Which workbook material identifies the major mortality segments?', /major segments|corresponding tabs/i, 'target']
]
const readJson = async (p) => JSON.parse((await fs.readFile(p, 'utf8')).replace(/^\uFEFF/, ''))
const sha = (v) => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex')
const writeJson = async (p, v) => { await fs.mkdir(path.dirname(p), { recursive: true }); await fs.writeFile(p, JSON.stringify(v, null, 2) + '\n', 'utf8') }
const sourceMap = new Map()
for (const [sourceId, provingGround] of sources) sourceMap.set(provingGround, { sourceId, data: await readJson(path.join(sourceRoot, sourceId, 'parent-child-substantive.json')) })

const development = await readJson(path.join(sourceRoot, 'evaluation-details.json'))
const corrections = []
for (const item of development.cases) {
  const source = sourceMap.get(item.expectedSourceId === 'naic-accounting-publications-appm-2026' ? 'A3' : item.expectedSourceId === 'naic-life-fraternal-reporting-asb-life-2025' ? 'W07' : item.expectedSourceId === 'naic-life-fraternal-reporting-qsi-life-2026' ? 'W08' : item.expectedSourceId.includes('vm20-tables') ? 'XLSX-FG' : item.expectedSourceId.includes('vm31-templates') ? 'XLSX-VM31' : 'XLSX-SOA')
  const child = source?.data.children.find((c) => c.childId === item.expectedChildId)
  if (!child || child.sourceChunkId !== item.expectedBaselineChunkId) corrections.push({ caseId: item.caseId, reason: 'gold lineage did not resolve to the recorded source chunk', oldExpectedChildId: item.expectedChildId })
}
const devSafe = development.cases.map((item) => ({ caseId: item.caseId, category: item.category, expectedSourceId: item.expectedSourceId, expectedRole: item.expectedRole, expectedBaselineChunkId: item.expectedBaselineChunkId, expectedChildId: item.expectedChildId, expectedParentId: item.expectedParentId, requiredEvidenceIds: item.requiredEvidenceIds, goldEvidenceHash: sha([item.expectedSourceId, item.expectedBaselineChunkId, item.expectedChildId, item.expectedParentId]), queryExternal: true }))
const holdout = []
for (let i = 0; i < holdoutDefinitions.length; i += 1) {
  const [pg, category, query, target, required] = holdoutDefinitions[i]
  const source = sourceMap.get(pg)
  const child = source.data.children.find((c) => target.test(c.sourceTextExcerpt || ''))
  if (!child) throw new Error(`Holdout target not found for ${pg}/${category}`)
  const parent = source.data.parents.find((p) => p.parentId === child.parentId)
  holdout.push({ caseId: `pc-holdout-${String(i + 1).padStart(2, '0')}`, category, query, expectedSourceId: source.data.sourceId, expectedRole: source.data.children[0].authoritySupportRole, expectedBaselineChunkId: child.sourceChunkId, expectedOriginalChildId: child.childId, expectedParentId: parent?.parentId || null, requiredMode: required, evidenceContentHash: sha([source.data.sourceId, child.sourceChunkId, child.sourceTextExcerpt]), queryExternal: true })
}
const safeHoldout = holdout.map(({ query, ...item }) => item)
const freeze = { schemaVersion: '1.0', runId, frozenAt: '2026-09-07T00:00:00.000Z', developmentCaseCount: devSafe.length, holdoutCaseCount: safeHoldout.length, goldCorrections: corrections, development: devSafe, holdout: safeHoldout, sourceIds: sources.map(([id]) => id), rankingInputExcludesExpectations: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
await writeJson(path.join(publicRoot, 'evaluation-freeze.json'), freeze)
await writeJson(path.join(externalRoot, 'evaluation-freeze-details.json'), { schemaVersion: '1.0', runId, development: development.cases.map(({ baseline, parentChild, ...item }) => item), holdout, goldCorrections: corrections, reviewOnly: true })
console.log(JSON.stringify({ runId, development: devSafe.length, holdout: safeHoldout.length, corrections }, null, 2))
