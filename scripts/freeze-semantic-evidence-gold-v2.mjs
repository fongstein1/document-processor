import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export const runId = 'semantic-evidence-unit-correction-2026-09'
const repoRoot = path.resolve(import.meta.dirname, '..')
const publicRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', runId)
const externalRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', runId)
const v1PublicPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'parent-child-retrieval-hardening-2026-09', 'evaluation-freeze.json')
const v1PrivateRoot = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', 'parent-child-retrieval-hardening-2026-09')
const frozenAt = '2026-09-08T00:00:00.000Z'

const readJson = async (file) => JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, ''))
const writeJson = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8') }
const sha256 = (value) => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')

const decisions = {
  'pc-eval-01': ['INVALID_TARGET_EXCLUDED', false, 'The recorded target is front matter, not a uniquely identified recognition requirement.'],
  'pc-eval-02': ['INVALID_TARGET_EXCLUDED', false, 'The recorded target is a table-of-contents page rather than scope guidance.'],
  'pc-eval-03': ['INVALID_TARGET_EXCLUDED', false, 'The recorded target is a table-of-contents page and the defined term is unspecified.'],
  'pc-eval-04': ['AMBIGUOUS_EXCLUDED', false, 'The query does not identify an accounting topic or SSAP and has many equally plausible sections.'],
  'pc-eval-05': ['INVALID_TARGET_EXCLUDED', false, 'The recorded target is title/front matter rather than a required reporting field.'],
  'pc-eval-06': ['INVALID_TARGET_EXCLUDED', false, 'The recorded target is a table of contents rather than a cross-page instruction.'],
  'pc-eval-07': ['INVALID_TARGET_EXCLUDED', false, 'The recorded target is a table of contents and does not bind prose to a schedule.'],
  'pc-eval-08': ['AMBIGUOUS_EXCLUDED', false, 'Assets appears in multiple form sections and the query does not identify a unique schedule or page.'],
  'pc-eval-09': ['INVALID_TARGET_EXCLUDED', false, 'The recorded target is a table of contents and the instruction is not uniquely specified.'],
  'pc-eval-10': ['UNIQUE_TARGET', true, 'The GENERAL instruction on pages 8-9 directly states the governing scope.'],
  'pc-eval-11': ['UNIQUE_TARGET', true, 'The GENERAL instruction on pages 8-9 contains the relevant qualification.'],
  'pc-eval-12': ['AMBIGUOUS_EXCLUDED', false, 'The query names no schedule and the recorded target is a table of contents.'],
  'pc-eval-13': ['MULTI_UNIT_REQUIRED', true, 'Table F data rows require their bounded Table F header context.'],
  'pc-eval-14': ['MULTI_UNIT_REQUIRED', true, 'The association requires both Table F labels and bounded data rows.'],
  'pc-eval-15': ['UNIQUE_TARGET', true, 'The Table F header identifies the table containing current spread values.'],
  'pc-eval-16': ['AMBIGUOUS_EXCLUDED', false, 'This is a source-role question and does not identify a unique workbook evidence child.'],
  'pc-eval-17': ['AMBIGUOUS_EXCLUDED', false, 'The query does not name a particular VM-31 template and the recorded target is a confidentiality notice.'],
  'pc-eval-18': ['UNIQUE_TARGET', true, 'The confidentiality notice defines the workbook template scope.'],
  'pc-eval-19': ['AMBIGUOUS_EXCLUDED', false, 'Application to VM-31 documentation is source-wide and not a unique child-level question.'],
  'pc-eval-20': ['AMBIGUOUS_EXCLUDED', false, 'Distinguishing the workbook from VM-20 is source identity, not one unique template child.'],
  'pc-eval-21': ['AMBIGUOUS_EXCLUDED', false, 'The question asks what the entire study reports and the recorded target is one mortality table.'],
  'pc-eval-22': ['INVALID_TARGET_EXCLUDED', false, 'The recorded target is a worksheet index rather than an explanatory factor table.'],
  'pc-eval-23': ['AMBIGUOUS_EXCLUDED', false, 'Historical-support status is source-level and has multiple equally valid evidence units.'],
  'pc-eval-24': ['AMBIGUOUS_EXCLUDED', false, 'Authority/support status is source-level and has multiple equally valid evidence units.'],
  'pc-holdout-01': ['AMBIGUOUS_EXCLUDED', false, 'The front matter lists many SSAPs and appendices; no governing topic is specified.'],
  'pc-holdout-02': ['UNIQUE_TARGET', true, 'The maintenance-process page directly answers the applicability/maintenance question.'],
  'pc-holdout-03': ['INVALID_TARGET_EXCLUDED', false, 'The recorded target is a table of contents and no defined concept is named.'],
  'pc-holdout-04': ['UNIQUE_TARGET', true, 'The title/front matter uniquely identifies the annual statement reporting form.'],
  'pc-holdout-05': ['AMBIGUOUS_EXCLUDED', false, 'The question does not identify which schedule-oriented context is requested.'],
  'pc-holdout-06': ['UNIQUE_TARGET', true, 'The GENERAL instruction on pages 8-9 states the governing quarterly context.'],
  'pc-holdout-07': ['AMBIGUOUS_EXCLUDED', false, 'The question does not name a schedule and the recorded target is a table of contents.'],
  'pc-holdout-08': ['UNIQUE_TARGET', true, 'The GENERAL instruction contains the specific qualification about absent quarterly instructions.'],
  'pc-holdout-09': ['UNIQUE_TARGET', true, 'The bounded Table F header identifies current benchmark spreads.'],
  'pc-holdout-10': ['MULTI_UNIT_REQUIRED', true, 'The answer requires bounded Table F header labels and its data range.'],
  'pc-holdout-11': ['UNIQUE_TARGET', true, 'The General Instructions worksheet rows 1-2 directly answer the question.'],
  'pc-holdout-12': ['UNIQUE_TARGET', true, 'The Confidentiality worksheet row 1 states the disclosure boundary.'],
  'pc-holdout-13': ['UNIQUE_TARGET', true, 'Documentation row 5 states the experience-model development method.'],
  'pc-holdout-14': ['UNIQUE_TARGET', true, 'Documentation row 7 states the mortality-improvement adjustment.'],
  'pc-holdout-15': ['UNIQUE_TARGET', true, 'Documentation row 8 identifies the major segment material.']
}

const coordinateOverride = {
  'pc-eval-13': { sheetName: 'August 2026', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 3, rowEnd: 35, colStart: 'A', colEnd: 'K', targetRole: 'TABLE_OR_SCHEDULE', requiredContextRoles: ['HEADER_CONTEXT'] },
  'pc-eval-14': { sheetName: 'August 2026', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 3, rowEnd: 35, colStart: 'A', colEnd: 'K', targetRole: 'TABLE_OR_SCHEDULE', requiredContextRoles: ['HEADER_CONTEXT'] },
  'pc-eval-15': { sheetName: 'August 2026', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 1, rowEnd: 2, colStart: 'A', colEnd: 'K', targetRole: 'HEADER_CONTEXT', requiredContextRoles: [] },
  'pc-holdout-09': { sheetName: 'August 2026', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 1, rowEnd: 2, colStart: 'A', colEnd: 'K', targetRole: 'HEADER_CONTEXT', requiredContextRoles: [] },
  'pc-holdout-10': { sheetName: 'August 2026', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 3, rowEnd: 35, colStart: 'A', colEnd: 'K', targetRole: 'TABLE_OR_SCHEDULE', requiredContextRoles: ['HEADER_CONTEXT'] },
  'pc-holdout-11': { sheetName: 'General Instructions', worksheetPath: 'xl/worksheets/sheet2.xml', rowStart: 1, rowEnd: 2, targetRole: 'REPORTING_INSTRUCTION', requiredContextRoles: ['HEADER_CONTEXT'] },
  'pc-holdout-12': { sheetName: 'Confidentiality', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 1, rowEnd: 1, targetRole: 'SCOPE_OR_APPLICABILITY', requiredContextRoles: [] },
  'pc-holdout-13': { sheetName: 'Documentation', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 5, rowEnd: 5, targetRole: 'OTHER', requiredContextRoles: [] },
  'pc-holdout-14': { sheetName: 'Documentation', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 7, rowEnd: 7, targetRole: 'OTHER', requiredContextRoles: [] },
  'pc-holdout-15': { sheetName: 'Documentation', worksheetPath: 'xl/worksheets/sheet1.xml', rowStart: 8, rowEnd: 8, targetRole: 'TABLE_OR_SCHEDULE', requiredContextRoles: [] }
}

const roleOverride = {
  'pc-eval-10': ['SCOPE_OR_APPLICABILITY'],
  'pc-eval-11': ['EXCEPTION_OR_QUALIFICATION'],
  'pc-eval-18': ['SCOPE_OR_APPLICABILITY'],
  'pc-holdout-02': ['SCOPE_OR_APPLICABILITY'],
  'pc-holdout-04': ['OTHER'],
  'pc-holdout-06': ['SCOPE_OR_APPLICABILITY'],
  'pc-holdout-08': ['EXCEPTION_OR_QUALIFICATION']
}

const v1Private = await readJson(path.join(v1PrivateRoot, 'evaluation-details.json'))
const sourceCache = new Map()
const loadSource = async (sourceId) => {
  if (!sourceCache.has(sourceId)) sourceCache.set(sourceId, await readJson(path.join(v1PrivateRoot, sourceId, 'parent-child-retrieval-substantive.json')))
  return sourceCache.get(sourceId)
}

const adjudications = []
for (const item of v1Private.cases) {
  const decision = decisions[item.caseId]
  if (!decision) throw new Error(`Missing V2 adjudication decision: ${item.caseId}`)
  const [adjudicationStatus, included, rationale] = decision
  const source = await loadSource(item.expectedSourceId)
  const child = source.children.find((candidate) => candidate.childId === item.expectedChildId)
  const override = coordinateOverride[item.caseId] || {}
  const targetCoordinate = included ? {
    sourceChunkId: child?.sourceChunkId || item.expectedBaselineChunkId,
    pageStart: child?.pageStart ?? null,
    pageEnd: child?.pageEnd ?? null,
    sheetName: override.sheetName ?? child?.sheetName ?? null,
    worksheetPath: override.worksheetPath ?? child?.worksheetPath ?? null,
    rowStart: override.rowStart ?? child?.rowStart ?? null,
    rowEnd: override.rowEnd ?? child?.rowEnd ?? null,
    colStart: override.colStart ?? null,
    colEnd: override.colEnd ?? null,
    targetRole: override.targetRole ?? roleOverride[item.caseId]?.[0] ?? child?.semanticRole ?? 'OTHER'
  } : null
  const goldUnitId = targetCoordinate ? `gold-v2-${sha256([item.expectedSourceId, source.sourceSha256, targetCoordinate]).slice(0, 24)}` : null
  adjudications.push({
    caseId: item.caseId,
    split: item.caseId.startsWith('pc-holdout-') ? 'holdout' : 'development',
    category: item.category,
    query: item.query,
    queryHash: sha256(item.query),
    sourceId: item.expectedSourceId,
    sourceSha256: source.sourceSha256,
    authoritySupportRole: item.expectedRole,
    candidateEvidenceIds: [item.expectedChildId].filter(Boolean),
    chosenGoldEvidence: goldUnitId ? [{ goldUnitId, ...targetCoordinate, evidenceContentHash: child?.contentHash || sha256(child?.sourceTextExcerpt || '') }] : [],
    chosenParentIdV1: item.expectedParentId,
    acceptedTargetChildIdsV1: included ? [item.expectedChildId].filter(Boolean) : [],
    requiredSupportingEvidence: (override.requiredContextRoles || roleOverride[item.caseId] || []).map((role) => ({ role, within: 'same_parent_or_immediate_ancestor' })),
    rationale,
    ambiguityStatus: adjudicationStatus,
    included,
    reviewerStatus: 'INDEPENDENTLY_AUDITED_FROM_PRIVATE_SOURCE_EVIDENCE'
  })
}

const safeCases = adjudications.map((item) => ({
  caseId: item.caseId,
  split: item.split,
  category: item.category,
  queryHash: item.queryHash,
  sourceId: item.sourceId,
  sourceSha256: item.sourceSha256,
  authoritySupportRole: item.authoritySupportRole,
  goldUnitIds: item.chosenGoldEvidence.map((evidence) => evidence.goldUnitId),
  evidenceContentHashes: item.chosenGoldEvidence.map((evidence) => evidence.evidenceContentHash),
  acceptedSourceChunkIds: item.chosenGoldEvidence.map((evidence) => evidence.sourceChunkId),
  targetCoordinates: item.chosenGoldEvidence.map(({ goldUnitId, evidenceContentHash, ...coordinate }) => coordinate),
  requiredContextRoles: item.requiredSupportingEvidence.map((evidence) => evidence.role),
  adjudicationStatus: item.ambiguityStatus,
  included: item.included,
  reviewerStatus: item.reviewerStatus,
  queryExternal: true,
  rationaleExternal: true
}))

const v1Bytes = await fs.readFile(v1PublicPath)
const privateValue = {
  schemaVersion: '2.0',
  evaluationVersion: 'EVALUATION_V2',
  runId,
  createdBecause: 'Independent review found broad first-match regex gold ambiguity in EVALUATION_V1.',
  sourceEvaluationVersion: 'EVALUATION_V1',
  sourceEvaluationSha256: sha256(v1Bytes),
  adjudications,
  reviewOnly: true,
  promotionStatus: 'not_promoted',
  ragReadyAllowed: false
}
const privatePath = path.join(externalRoot, 'gold-v2-adjudication.json')
await writeJson(privatePath, privateValue)
const privateBytes = await fs.readFile(privatePath)

const publicValue = {
  schemaVersion: '2.0',
  evaluationVersion: 'EVALUATION_V2',
  runId,
  frozenAt,
  createdBecauseCode: 'INDEPENDENT_REVIEW_GOLD_TARGET_AMBIGUITY',
  sourceEvaluationVersion: 'EVALUATION_V1',
  sourceEvaluationPath: path.relative(repoRoot, v1PublicPath).replace(/\\/g, '/'),
  sourceEvaluationSha256: sha256(v1Bytes),
  originalCaseCount: safeCases.length,
  uniqueTargetCaseCount: safeCases.filter((item) => item.included && item.adjudicationStatus === 'UNIQUE_TARGET').length,
  multiAcceptedTargetCaseCount: safeCases.filter((item) => item.included && item.adjudicationStatus === 'MULTI_ACCEPTED_TARGETS').length,
  multiUnitRequiredCaseCount: safeCases.filter((item) => item.included && item.adjudicationStatus === 'MULTI_UNIT_REQUIRED').length,
  ambiguousExcludedCaseCount: safeCases.filter((item) => !item.included && item.adjudicationStatus === 'AMBIGUOUS_EXCLUDED').length,
  invalidExcludedCaseCount: safeCases.filter((item) => !item.included && item.adjudicationStatus === 'INVALID_TARGET_EXCLUDED').length,
  developmentCaseCount: safeCases.filter((item) => item.included && item.split === 'development').length,
  holdoutCaseCount: safeCases.filter((item) => item.included && item.split === 'holdout').length,
  cases: safeCases,
  privateAdjudicationPath: privatePath,
  privateAdjudicationSha256: sha256(privateBytes),
  privateAdjudicationByteCount: privateBytes.length,
  finalGoldSelectionUsesRegex: false,
  rankingInputExcludesExpectations: true,
  reviewOnly: true,
  promotionStatus: 'not_promoted',
  ragReadyAllowed: false
}

await writeJson(path.join(publicRoot, 'evaluation-v2-freeze.json'), publicValue)
await writeJson(path.join(publicRoot, 'evaluation-history.json'), {
  schemaVersion: '1.0',
  runId,
  evaluations: [
    { evaluationVersion: 'EVALUATION_V1', path: publicValue.sourceEvaluationPath, sha256: publicValue.sourceEvaluationSha256, preserved: true },
    { evaluationVersion: 'EVALUATION_V2', path: `data/processed/review_packages/${runId}/evaluation-v2-freeze.json`, frozenAt, reasonCode: publicValue.createdBecauseCode }
  ],
  reviewOnly: true,
  promotionStatus: 'not_promoted',
  ragReadyAllowed: false
})

console.log(JSON.stringify({ runId, originalCases: safeCases.length, included: safeCases.filter((item) => item.included).length, development: publicValue.developmentCaseCount, holdout: publicValue.holdoutCaseCount, unique: publicValue.uniqueTargetCaseCount, multiUnit: publicValue.multiUnitRequiredCaseCount, excluded: publicValue.ambiguousExcludedCaseCount + publicValue.invalidExcludedCaseCount, privatePath }, null, 2))
