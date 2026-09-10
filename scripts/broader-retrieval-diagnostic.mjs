import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { buildRetrievalDocs, loadInputs } from './hybrid-vector-retrieval-experiment.mjs'
import { exactCosineRank, reciprocalRankFusion, stableJson } from './lib/hybrid-vector-retrieval.mjs'
import { makeFieldedBm25Index, rankBm25, regulatoryTokens } from './lib/semantic-evidence-units.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')
const configPath = path.join(repoRoot, 'config', 'broader-retrieval-diagnostic.json')
const cfg = JSON.parse(await fs.readFile(configPath, 'utf8'))
const publicRoot = path.join(repoRoot, 'data', 'processed', 'review_packages', cfg.runId)
const privateRoot = path.resolve(cfg.privateRoot)
const fields = ['body', 'section', 'identifier', 'parentHeading', 'sourceTitle', 'header']
const gov = { diagnosticOnly: true, consumedHoldoutsDescriptiveOnly: true, retrievalConfigurationUnchanged: true, reviewOnly: true, promotionStatus: 'not_promoted', ragReadyAllowed: false }
const sha = (value) => crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : String(value)).digest('hex')
const read = async (file) => JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, ''))
const rows = async (file) => (await fs.readFile(file, 'utf8')).trim().split(/\r?\n/).filter(Boolean).map(JSON.parse)
const floats = async (file) => { const b = await fs.readFile(file); assert.equal(b.length % 4, 0); return new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)) }
const write = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n') }
const round = (value, digits = 6) => value === null || value === undefined ? null : Number(value.toFixed(digits))
const average = (values) => values.length ? values.reduce((n, x) => n + x, 0) / values.length : null
const median = (values) => { if (!values.length) return null; const a = [...values].sort((x, y) => x - y), m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2 }
const quantile = (values, q) => { if (!values.length) return null; const a = [...values].sort((x, y) => x - y), p = (a.length - 1) * q, lo = Math.floor(p), hi = Math.ceil(p); return a[lo] + (a[hi] - a[lo]) * (p - lo) }
const distribution = (values) => ({ count: values.length, minimum: values.length ? round(Math.min(...values)) : null, p25: round(quantile(values, .25)), median: round(median(values)), p75: round(quantile(values, .75)), maximum: values.length ? round(Math.max(...values)) : null, mean: round(average(values)) })
const countBy = (values, key) => Object.fromEntries([...values.reduce((m, x) => m.set(typeof key === 'function' ? key(x) : x[key], (m.get(typeof key === 'function' ? key(x) : x[key]) || 0) + 1), new Map()).entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0]))))
const set = (value) => new Set(regulatoryTokens(value))
const jaccard = (left, right) => { const a = left instanceof Set ? left : set(left), b = right instanceof Set ? right : set(right); if (!a.size || !b.size) return 0; let hit = 0; for (const x of a) if (b.has(x)) hit++; return hit / new Set([...a, ...b]).size }
const overlapRecall = (query, text) => { const q = set(query), d = set(text); if (!q.size) return 0; let hit = 0; for (const x of q) if (d.has(x)) hit++; return hit / q.size }
const identifiers = (value) => [...new Set(String(value || '').match(/\b(?:SSAP\s*(?:NO\.?\s*)?\d+[A-Z]?|VM[- ]?\d+(?:\.\d+)?|[A-Z]{1,3}\d{1,4}|(?:TABLE|APPENDIX|SECTION|PARAGRAPH)\s+[A-Z0-9.-]+|[A-Z]{1,3}\d{1,3}:[A-Z]{1,3}\d{1,3})\b/gi) || [])].map(x => x.toUpperCase().replace(/\s+/g, ' ')).sort()
const queryFlags = (query) => ({ comparison: /\b(compare|comparison|versus|vs\.?|differ|difference|both)\b/i.test(query), scope: /\b(scope|apply|applies|applicable|covered|which entities|which contracts)\b/i.test(query), exception: /\b(exception|except|unless|however|provided that|qualification)\b/i.test(query), definition: /\b(define|definition|meaning|means)\b/i.test(query), multiPart: /\b(and|both|each|respectively|together|plus)\b/i.test(query) || /[;:]/.test(query) })
const firstRank = (ranking, accepted) => ranking.find(x => accepted.has(x.childId))?.rank || null
const uniqueParentRank = (ranking, acceptedParents) => { const seen = new Set(); let rank = 0; for (const x of ranking) if (!seen.has(x.parentId)) { seen.add(x.parentId); rank++; if (acceptedParents.has(x.parentId)) return rank } return null }
const sourceRank = (ranking, sourceId) => { const seen = new Set(); let rank = 0; for (const x of ranking) if (!seen.has(x.sourceId)) { seen.add(x.sourceId); rank++; if (x.sourceId === sourceId) return rank } return null }
const conditionalTargetRank = (ranking, accepted, predicate) => { let rank = 0; for (const x of ranking) if (predicate(x)) { rank++; if (accepted.has(x.childId)) return rank } return null }
const scoreForAccepted = (ranking, accepted) => ranking.find(x => accepted.has(x.childId))?.score ?? null
const rankValue = (value) => value || Number.POSITIVE_INFINITY
const safeRate = (n, d) => d ? round(n / d) : null
const acceptedIdsForMulti = (g) => [...new Set((g.acceptedEvidenceSets || []).flatMap(x => x.evidenceIds))]
const roleFamily = (role) => String(role || 'OTHER').toUpperCase()

function serializeRanking(ranked) {
  return ranked.slice(0, cfg.descriptiveThresholds.meaningfulRankLimit).map(x => ({ childId: x.doc.childId, parentId: x.doc.parentId, sourceId: x.doc.sourceId, role: x.doc.semanticRole || 'OTHER', rank: x.rank, score: x.finalScore }))
}

export function classifyPrimaryStage({ hybrid, sourceId, acceptedParents, acceptedIds }) {
  const top = hybrid[0]
  if (!top) return 'OTHER'
  if (acceptedIds.has(top.childId)) return 'SUCCESS'
  if (top.sourceId !== sourceId) return 'SOURCE_MISS'
  if (!acceptedParents.has(top.parentId)) return 'RIGHT_SOURCE_WRONG_PARENT'
  return 'RIGHT_PARENT_WRONG_CHILD'
}

export function reachability(ranks, cutoffs = cfg.reachabilityCutoffs) {
  const out = Object.fromEntries(cutoffs.map(k => [`top${k}`, safeRate(ranks.filter(x => x && x <= k).length, ranks.length)]))
  out.notMeaningfullyRetrieved = safeRate(ranks.filter(x => !x || x > cfg.descriptiveThresholds.meaningfulRankLimit).length, ranks.length)
  return out
}

async function assertRepoInputsUnchanged() {
  const protectedPaths = [
    cfg.frozenRetrievalConfigPath,
    cfg.goldV3FreezePath,
    cfg.multiUnitGoldFreezePath,
    'scripts/lib/hybrid-vector-retrieval.mjs',
    'scripts/lib/semantic-evidence-units.mjs',
    'scripts/lib/hierarchical-retrieval.mjs',
    'scripts/hybrid-vector-retrieval-experiment.mjs',
    'scripts/retrieval-gold-v3-evaluation.mjs',
    'scripts/multi-unit-gold-v1-evaluation.mjs',
    'scripts/lib/multi-unit-sidecar.mjs',
    'scripts/multi-unit-sidecar-experiment.mjs'
  ]
  for (const rel of protectedPaths) {
    const now = await fs.readFile(path.join(repoRoot, rel))
    const atStart = execFileSync('git', ['show', `${cfg.startingSha}:${rel}`], { cwd: repoRoot })
    assert.equal(sha(now), sha(atStart), `Protected input changed: ${rel}`)
  }
  return protectedPaths.map(p => ({ path: p, sha256: sha(execFileSync('git', ['show', `${cfg.startingSha}:${p}`], { cwd: repoRoot })) }))
}

async function loadEvidence() {
  const inputs = await loadInputs(), built = buildRetrievalDocs(inputs)
  return { ...built, docById: new Map(built.docs.map(x => [x.childId, x])), parentById: new Map(built.parentDocs.map(x => [x.parentId, x])) }
}

async function loadGoldV3Cases() {
  const gold = await read(path.join(cfg.goldV3PrivateRoot, 'gold-v3-adjudication.json'))
  const details = await read(path.join(cfg.goldV3PrivateRoot, 'ranking-details-v3.json'))
  const byRank = new Map(details.cases.map(x => [x.caseId, x.rankings]))
  return gold.adjudications.filter(x => x.included).map(g => ({
    population: g.split === 'development' ? 'GOLD_V3_DEVELOPMENT' : 'GOLD_V3_HOLDOUT',
    caseId: g.caseId, split: g.split, classification: g.adjudicationStatus, category: g.category, modality: g.modality,
    query: g.query, sourceId: g.sourceId, acceptedIds: g.acceptedTargetChildIds, acceptedParents: g.acceptedParentIds,
    requiredRoles: (g.requiredSupportingEvidence || []).map(x => x.role), acceptedSets: [g.acceptedTargetChildIds], authoritySupportRole: g.authoritySupportRole,
    rankings: byRank.get(g.caseId)
  }))
}

async function loadMultiCases(evidence) {
  const gold = await read(path.join(cfg.multiUnitPrivateRoot, 'multi-unit-gold-v1-adjudication.json'))
  const queries = gold.adjudications
  const queryRows = await rows(path.join(cfg.multiUnitPrivateRoot, 'queries.jsonl'))
  const vectorIndex = await read(path.join(cfg.vectorRoot, 'document-embedding-index.json'))
  assert.deepEqual(vectorIndex.childIds, evidence.docs.map(x => x.childId))
  const retrieval = await read(path.join(repoRoot, cfg.frozenRetrievalConfigPath))
  const bmIndex = makeFieldedBm25Index(evidence.docs, fields, retrieval.bm25)
  const documentVectors = await floats(path.join(cfg.vectorRoot, 'document-embeddings.f32'))
  const queryVectors = await floats(path.join(cfg.multiUnitPrivateRoot, 'query-embeddings.f32'))
  const dimension = 768
  assert.equal(queryVectors.length, queryRows.length * dimension)
  const goldById = new Map(queries.map(x => [x.caseId, x])), result = []
  for (let i = 0; i < queryRows.length; i++) {
    const q = queryRows[i], g = goldById.get(q.id), text = q.text.slice(retrieval.embedding.queryPrefix.length)
    assert.equal(sha(text), q.queryHash)
    const bm25 = rankBm25(text, evidence.docs, bmIndex)
    const vector = exactCosineRank({ queryVector: queryVectors.subarray(i * dimension, (i + 1) * dimension), documentVectors, documents: evidence.docs, dimension })
    const hybrid = reciprocalRankFusion({ rankings: { bm25, vector }, weights: { bm25: retrieval.fusion.bm25Weight, vector: retrieval.fusion.vectorWeight }, k: retrieval.fusion.rrfK })
    const isControl = g.included && g.classification !== 'MULTI_UNIT_REQUIRED'
    const population = g.included ? (isControl ? 'MULTI_UNIT_SINGLE_UNIT_CONTROLS' : g.split === 'development' ? 'MULTI_UNIT_DEVELOPMENT' : 'MULTI_UNIT_HOLDOUT') : g.classification === 'PARTIALLY_UNSUPPORTED' ? 'PARTIALLY_UNSUPPORTED_DIAGNOSTICS' : 'UNSUPPORTED_DIAGNOSTICS'
    result.push({ population, caseId: g.caseId, split: g.split, classification: g.classification, category: g.category, modality: g.modality, query: g.query, sourceId: g.sourceId,
      acceptedIds: acceptedIdsForMulti(g), acceptedParents: g.acceptedParentIds || [], requiredRoles: g.requiredEvidenceRoles || [], acceptedSets: (g.acceptedEvidenceSets || []).map(x => x.evidenceIds), authoritySupportRole: g.authoritySupportRole,
      rankings: { bm25: serializeRanking(bm25), vector: serializeRanking(vector), hybrid: serializeRanking(hybrid) } })
  }
  return result
}

function parentDepth(parent, parentById) {
  let depth = 0, current = parent, seen = new Set()
  while (current?.parentParentId && !seen.has(current.parentId)) { seen.add(current.parentId); depth++; current = parentById.get(current.parentParentId) }
  return depth
}

function analyzeCase(c, evidence) {
  const accepted = new Set(c.acceptedIds), acceptedParents = new Set(c.acceptedParents), acceptedDocs = c.acceptedIds.map(x => evidence.docById.get(x)).filter(Boolean), acceptedParentDocs = c.acceptedParents.map(x => evidence.parentById.get(x)).filter(Boolean)
  const queryTokens = regulatoryTokens(c.query), queryIds = identifiers(c.query), acceptedText = acceptedDocs.map(x => x.body).join(' '), acceptedHeading = acceptedParentDocs.map(x => `${x.identifier || ''} ${x.parentHeading || x.section || ''}`).join(' ')
  const flags = queryFlags(c.query), acceptedRoles = [...new Set(acceptedDocs.map(x => roleFamily(x.semanticRole)))].sort(), hybrid = c.rankings.hybrid
  const ranks = {}, parentRanks = {}, sourceRanks = {}, conditionalSourceRanks = {}, conditionalParentRanks = {}, acceptedScores = {}, acceptedScorePercentilesWithinSource = {}, topWrongMargins = {}, completeSetRanks = {}
  for (const [system, ranking] of Object.entries(c.rankings)) {
    ranks[system] = firstRank(ranking, accepted)
    parentRanks[system] = uniqueParentRank(ranking, acceptedParents)
    sourceRanks[system] = sourceRank(ranking, c.sourceId)
    conditionalSourceRanks[system] = conditionalTargetRank(ranking, accepted, x => x.sourceId === c.sourceId)
    conditionalParentRanks[system] = conditionalTargetRank(ranking, accepted, x => acceptedParents.has(x.parentId))
    acceptedScores[system] = scoreForAccepted(ranking, accepted)
    const sameSourceScores = ranking.filter(x => x.sourceId === c.sourceId).map(x => x.score), acceptedScore = acceptedScores[system]
    acceptedScorePercentilesWithinSource[system] = acceptedScore === null || !sameSourceScores.length ? null : sameSourceScores.filter(x => x <= acceptedScore).length / sameSourceScores.length
    completeSetRanks[system] = c.classification !== 'MULTI_UNIT_REQUIRED' ? null : Math.min(...c.acceptedSets.map(ids => ids.every(id => ranking.some(x => x.childId === id)) ? Math.max(...ids.map(id => ranking.find(x => x.childId === id).rank)) : Number.POSITIVE_INFINITY))
    if (!Number.isFinite(completeSetRanks[system])) completeSetRanks[system] = null
    const wrong = ranking.find(x => !accepted.has(x.childId))
    topWrongMargins[system] = acceptedScores[system] === null || !wrong ? null : acceptedScores[system] - wrong.score
  }
  const top = hybrid[0], wrongDoc = top && !accepted.has(top.childId) ? evidence.docById.get(top.childId) : null, acceptedParent = acceptedParentDocs[0], wrongParent = wrongDoc ? evidence.parentById.get(wrongDoc.parentId) : null
  const primaryFailureStage = classifyPrimaryStage({ hybrid, sourceId: c.sourceId, acceptedParents, acceptedIds: accepted })
  const diagnosticFlags = []
  if (!ranks.hybrid || ranks.hybrid > 10) diagnosticFlags.push('ACCEPTED_TARGET_OUTSIDE_TOP_10')
  if (!ranks.hybrid || ranks.hybrid > 50) diagnosticFlags.push('ACCEPTED_TARGET_OUTSIDE_TOP_50')
  const lexicalOverlap = jaccard(c.query, acceptedText), queryEvidenceRecall = overlapRecall(c.query, acceptedText), headingOverlap = overlapRecall(c.query, acceptedHeading)
  if (lexicalOverlap < cfg.descriptiveThresholds.lexicalWeakJaccard && rankValue(ranks.bm25) > 10) diagnosticFlags.push('LEXICAL_SIGNAL_WEAK')
  if (rankValue(ranks.vector) > 10) diagnosticFlags.push('VECTOR_SIGNAL_WEAK')
  if (rankValue(ranks.hybrid) > Math.min(rankValue(ranks.bm25), rankValue(ranks.vector))) diagnosticFlags.push('FUSION_DEGRADES_TARGET')
  const acceptedIdentifiers = identifiers(`${acceptedText} ${acceptedHeading}`)
  if (queryIds.some(x => acceptedIdentifiers.includes(x)) && rankValue(ranks.hybrid) > 5) diagnosticFlags.push('IDENTIFIER_SIGNAL_MISSED')
  if (wrongDoc && wrongDoc.sourceId === c.sourceId && jaccard(acceptedText, wrongDoc.body) >= cfg.descriptiveThresholds.nearDuplicateJaccard) diagnosticFlags.push('SEMANTIC_NEAR_DUPLICATE')
  if (c.modality === 'XLSX' && primaryFailureStage !== 'SUCCESS') diagnosticFlags.push('TABLE_OR_HEADER_CONFUSION')
  if (c.classification === 'MULTI_UNIT_REQUIRED') diagnosticFlags.push('MULTI_UNIT_TARGET_REPRESENTATION_ISSUE')
  const granularity = []
  if (acceptedDocs.some(x => (x.body || '').length >= cfg.descriptiveThresholds.broadChildCharacters || (x.paragraphCount || 0) >= 3)) granularity.push('OVERLY_BROAD_CHILD')
  if (acceptedDocs.some(x => (x.body || '').length < cfg.descriptiveThresholds.narrowChildCharacters)) granularity.push('OVERLY_NARROW_CHILD')
  if (acceptedDocs.some(x => x.processingRepresentation === 'STRUCTURAL_PAGE_WINDOW')) granularity.push('PAGE_WINDOW_FALLBACK')
  if (c.acceptedSets.some(x => x.length > 1)) granularity.push('REQUIREMENT_OR_QUALIFIER_SPLIT')
  if (c.modality === 'XLSX' && acceptedRoles.some(x => x.includes('HEADER')) && acceptedRoles.some(x => !x.includes('HEADER'))) granularity.push('TABLE_HEADER_ROW_SPLIT')
  if (acceptedRoles.some(x => x.includes('DEFINITION')) && acceptedRoles.some(x => x.includes('REQUIREMENT'))) granularity.push('DEFINITION_REQUIREMENT_SPLIT')
  if (headingOverlap >= .15 && queryEvidenceRecall < .05) granularity.push('HEADING_BODY_DISCONNECT')
  if (wrongDoc && jaccard(acceptedText, wrongDoc.body) >= .5) granularity.push('REPEATED_OR_NEAR_DUPLICATE_LANGUAGE')
  if (granularity.length) diagnosticFlags.push('EVIDENCE_UNIT_GRANULARITY_MISMATCH')
  const wrongSectionCauses = []
  if (primaryFailureStage === 'RIGHT_SOURCE_WRONG_PARENT') {
    const wrongHeadingOverlap = overlapRecall(c.query, `${wrongParent?.identifier || ''} ${wrongParent?.parentHeading || wrongParent?.section || ''}`)
    const parentSimilarity = jaccard(acceptedHeading, `${wrongParent?.identifier || ''} ${wrongParent?.parentHeading || wrongParent?.section || ''}`)
    if (!queryIds.length) wrongSectionCauses.push('EXPLICIT_IDENTIFIER_ABSENT')
    if (queryIds.length && acceptedIdentifiers.some(x => queryIds.includes(x))) wrongSectionCauses.push('STRUCTURAL_IDENTIFIER_AVAILABLE_BUT_MISSED')
    if (parentSimilarity >= cfg.descriptiveThresholds.nearDuplicateJaccard || (wrongDoc && jaccard(acceptedText, wrongDoc.body) >= cfg.descriptiveThresholds.nearDuplicateJaccard)) wrongSectionCauses.push('SEMANTIC_NEAR_DUPLICATE_SECTION')
    if (wrongDoc && acceptedRoles.includes(roleFamily(wrongDoc.semanticRole))) wrongSectionCauses.push('SAME_ROLE_SIBLING')
    if (wrongHeadingOverlap - headingOverlap >= cfg.descriptiveThresholds.headingAdvantageMinimum) wrongSectionCauses.push('WRONG_HEADING_LEXICAL_ADVANTAGE')
    if (flags.scope || flags.exception || flags.multiPart) wrongSectionCauses.push('QUALIFIER_OR_MULTIPART_CONTEXT')
    if (c.modality === 'XLSX') wrongSectionCauses.push('TABLE_HEADER_OR_ROW_AMBIGUITY')
    const bmTopWrongParent = c.rankings.bm25[0]?.parentId === wrongDoc?.parentId, vecTopWrongParent = c.rankings.vector[0]?.parentId === wrongDoc?.parentId
    if (bmTopWrongParent && vecTopWrongParent) wrongSectionCauses.push('BOTH_COMPONENTS_PREFER_WRONG_SECTION')
    else if (bmTopWrongParent) wrongSectionCauses.push('BM25_PREFERENCE')
    else if (vecTopWrongParent) wrongSectionCauses.push('VECTOR_PREFERENCE')
    else wrongSectionCauses.push('FUSION_INTERACTION')
  }
  const siblingOutrankingCount = hybrid.filter(x => x.sourceId === c.sourceId && !acceptedParents.has(x.parentId) && x.rank < rankValue(ranks.hybrid)).length
  const acceptedParentSiblingCount = acceptedParent ? evidence.parentDocs.filter(x => x.sourceId === c.sourceId && x.parentId !== acceptedParent.parentId && jaccard(`${x.identifier || ''} ${x.parentHeading || x.section || ''}`, acceptedHeading) >= cfg.descriptiveThresholds.nearDuplicateJaccard).length : 0
  return {
    population: c.population, caseId: c.caseId, split: c.split, classification: c.classification, category: c.category, modality: c.modality, sourceId: c.sourceId, queryHash: sha(c.query), queryCharacters: c.query.length, queryTokenCount: queryTokens.length,
    acceptedEvidenceCount: c.acceptedIds.length, acceptedSetCount: c.acceptedSets.length, acceptedEvidenceCharacters: acceptedDocs.reduce((n, x) => n + (x.body || '').length, 0), acceptedRoles, requiredRoleCount: c.requiredRoles.length,
    queryIdentifierCount: queryIds.length, sectionIdentifierPresent: queryIds.some(x => /SSAP|VM|SECTION|PARAGRAPH|TABLE|APPENDIX/.test(x)), lexicalJaccard: round(lexicalOverlap), queryEvidenceTokenRecall: round(queryEvidenceRecall), queryParentHeadingTokenRecall: round(headingOverlap), queryStyle: queryIds.length || lexicalOverlap >= .18 ? 'DIRECT_OR_STRUCTURAL' : 'PARAPHRASED_OR_ABSTRACT', queryFlags: flags,
    parentDepth: acceptedParentDocs.length ? Math.max(...acceptedParentDocs.map(x => parentDepth(x, evidence.parentById))) : null, similarSiblingSectionCount: acceptedParentSiblingCount, acceptedAlternativeSet: c.acceptedSets.length > 1 || (c.classification === 'MULTIPLE_ACCEPTED_TARGETS' && c.acceptedIds.length > 1),
    ranks, completeSetRanks, sourceRanks, parentRanks, conditionalSourceRanks, conditionalParentRanks, acceptedScores, acceptedScorePercentilesWithinSource: Object.fromEntries(Object.entries(acceptedScorePercentilesWithinSource).map(([k, v]) => [k, round(v)])), acceptedMinusTopWrongScore: Object.fromEntries(Object.entries(topWrongMargins).map(([k, v]) => [k, round(v)])), siblingOutrankingCount,
    primaryFailureStage, diagnosticFlags: [...new Set(diagnosticFlags)].sort(), wrongSectionCauses: [...new Set(wrongSectionCauses)].sort(), granularity: [...new Set(granularity)].sort(),
    topHybridSourceId: top?.sourceId || null, topHybridParentId: top?.parentId || null, topHybridRole: top?.role || null
  }
}

function aggregatePopulation(name, values) {
  const systems = [['BM25', 'bm25'], ['VECTOR', 'vector'], ['HYBRID_RRF', 'hybrid']], supported = values.filter(x => x.acceptedEvidenceCount > 0), systemMetrics = {}
  for (const [systemId, s] of systems) {
    systemMetrics[systemId] = {
      acceptedTargetReachability: reachability(supported.map(x => x.ranks[s])),
      sourceReachability: { top1: safeRate(supported.filter(x => x.sourceRanks[s] === 1).length, supported.length), top3: safeRate(supported.filter(x => x.sourceRanks[s] && x.sourceRanks[s] <= 3).length, supported.length), top5: safeRate(supported.filter(x => x.sourceRanks[s] && x.sourceRanks[s] <= 5).length, supported.length) },
      parentReachability: Object.fromEntries([1, 3, 5, 10].map(k => [`top${k}`, safeRate(supported.filter(x => x.parentRanks[s] && x.parentRanks[s] <= k).length, supported.length)])),
      acceptedTargetRank: distribution(supported.map(x => x.ranks[s]).filter(Boolean)),
      conditionalCorrectSourceTargetRank: distribution(supported.map(x => x.conditionalSourceRanks[s]).filter(Boolean)),
      conditionalAcceptedParentTargetRank: distribution(supported.map(x => x.conditionalParentRanks[s]).filter(Boolean)),
      conditionalAcceptedParentTargetReachability: reachability(supported.map(x => x.conditionalParentRanks[s])),
      completeAcceptedSetReachability: reachability(supported.filter(x => x.classification === 'MULTI_UNIT_REQUIRED').map(x => x.completeSetRanks[s])),
      acceptedScorePercentileWithinSource: distribution(supported.map(x => x.acceptedScorePercentilesWithinSource[s]).filter(x => x !== null)),
      acceptedMinusTopWrongScore: distribution(supported.map(x => x.acceptedMinusTopWrongScore[s]).filter(x => x !== null))
    }
  }
  const fusionHelp = supported.filter(x => rankValue(x.ranks.hybrid) < Math.min(rankValue(x.ranks.bm25), rankValue(x.ranks.vector))).length
  const fusionHarm = supported.filter(x => rankValue(x.ranks.hybrid) > Math.min(rankValue(x.ranks.bm25), rankValue(x.ranks.vector))).length
  const strongerTie = supported.length - fusionHelp - fusionHarm
  const sourceFusionComparison = {
    hybridRescuesBothComponents: supported.filter(x => x.sourceRanks.hybrid === 1 && x.sourceRanks.bm25 !== 1 && x.sourceRanks.vector !== 1).length,
    hybridLosesCorrectComponent: supported.filter(x => x.sourceRanks.hybrid !== 1 && (x.sourceRanks.bm25 === 1 || x.sourceRanks.vector === 1)).length,
    componentTop1Disagreement: supported.filter(x => (x.sourceRanks.bm25 === 1) !== (x.sourceRanks.vector === 1)).length
  }
  const parentFusionComparison = {
    hybridRescuesBothComponents: supported.filter(x => x.parentRanks.hybrid === 1 && x.parentRanks.bm25 !== 1 && x.parentRanks.vector !== 1).length,
    hybridLosesCorrectComponent: supported.filter(x => x.parentRanks.hybrid !== 1 && (x.parentRanks.bm25 === 1 || x.parentRanks.vector === 1)).length,
    componentTop1Disagreement: supported.filter(x => (x.parentRanks.bm25 === 1) !== (x.parentRanks.vector === 1)).length
  }
  const componentLeaderCounts = countBy(supported, x => {
    const ranks = [['BM25', x.ranks.bm25], ['VECTOR', x.ranks.vector], ['HYBRID_RRF', x.ranks.hybrid]].filter(([, rank]) => rank)
    if (!ranks.length) return 'NOT_IN_TOP_100'
    const best = Math.min(...ranks.map(([, rank]) => rank))
    return ranks.filter(([, rank]) => rank === best).map(([systemId]) => systemId).join('+')
  })
  return {
    population: name, caseCount: values.length, supportedCaseCount: supported.length, sourceCounts: countBy(values, 'sourceId'), modalityCounts: countBy(values, 'modality'), categoryCounts: countBy(values, 'category'), classificationCounts: countBy(values, 'classification'), queryStyleCounts: countBy(values, 'queryStyle'),
    queryCharacters: distribution(values.map(x => x.queryCharacters)), queryTokenCount: distribution(values.map(x => x.queryTokenCount)), acceptedEvidenceCharacters: distribution(supported.map(x => x.acceptedEvidenceCharacters)), acceptedEvidenceCount: distribution(supported.map(x => x.acceptedEvidenceCount)), requiredRoleCount: distribution(supported.map(x => x.requiredRoleCount)), queryIdentifierCount: distribution(values.map(x => x.queryIdentifierCount)),
    lexicalJaccard: distribution(supported.map(x => x.lexicalJaccard)), queryEvidenceTokenRecall: distribution(supported.map(x => x.queryEvidenceTokenRecall)), queryParentHeadingTokenRecall: distribution(supported.map(x => x.queryParentHeadingTokenRecall)), similarSiblingSectionCount: distribution(supported.map(x => x.similarSiblingSectionCount)), parentDepth: distribution(supported.map(x => x.parentDepth).filter(x => x !== null)),
    queryFlagRates: Object.fromEntries(Object.keys(queryFlags('')).map(k => [k, safeRate(values.filter(x => x.queryFlags[k]).length, values.length)])), acceptedRoleCounts: countBy(supported.flatMap(x => x.acceptedRoles), x => x), acceptedAlternativeSetRate: safeRate(supported.filter(x => x.acceptedAlternativeSet).length, supported.length),
    primaryFailureStages: countBy(supported, 'primaryFailureStage'), diagnosticFlags: countBy(supported.flatMap(x => x.diagnosticFlags), x => x), granularityFindings: countBy(supported.flatMap(x => x.granularity), x => x), wrongSectionCauses: countBy(supported.flatMap(x => x.wrongSectionCauses), x => x),
    hybridWrongSectionRate: safeRate(supported.filter(x => x.primaryFailureStage === 'RIGHT_SOURCE_WRONG_PARENT').length, supported.length), hybridCorrectParentWrongChildRate: safeRate(supported.filter(x => x.primaryFailureStage === 'RIGHT_PARENT_WRONG_CHILD').length, supported.length), averageSiblingSectionsOutrankingAccepted: round(average(supported.map(x => x.siblingOutrankingCount))),
    correctParentRetrievedButAcceptedChildMissedTop10: supported.filter(x => x.parentRanks.hybrid && x.parentRanks.hybrid <= 10 && (!x.ranks.hybrid || x.ranks.hybrid > 10)).length,
    fusionComparison: { improvesOverBothComponents: fusionHelp, worsensStrongerComponent: fusionHarm, tiesStrongerComponent: strongerTie }, sourceFusionComparison, parentFusionComparison, componentLeaderCounts, systems: systemMetrics
  }
}

function sliceAggregate(values, predicate) {
  const selected = values.filter(predicate)
  return selected.length ? aggregatePopulation('SLICE', selected) : null
}

async function buildManifest(files) {
  const artifacts = []
  for (const [artifactType, file] of files) { const b = await fs.readFile(file); artifacts.push({ artifactType, externalPath: path.resolve(file), sha256: sha(b), byteCount: b.length, rightsStorageStatus: 'RIGHTS_EXTERNAL_STORAGE_ONLY', reviewOnly: true }) }
  return { schemaVersion: '1.0', runId: cfg.runId, externalProcessingRoot: privateRoot, artifactCount: artifacts.length, totalByteCount: artifacts.reduce((n, x) => n + x.byteCount, 0), aggregateSha256: sha(stableJson(artifacts.map(x => ({ artifactType: x.artifactType, sha256: x.sha256, byteCount: x.byteCount })))), artifacts, ...gov }
}

export async function runDiagnostic() {
  const protectedInputs = await assertRepoInputsUnchanged(), evidence = await loadEvidence(), cases = [...await loadGoldV3Cases(), ...await loadMultiCases(evidence)]
  const analyzed = cases.map(x => analyzeCase(x, evidence)), supported = analyzed.filter(x => x.acceptedEvidenceCount > 0), populationNames = [...new Set(analyzed.map(x => x.population))]
  const populations = populationNames.map(name => aggregatePopulation(name, analyzed.filter(x => x.population === name)))
  const a3 = aggregatePopulation('A3_ALL_SUPPORTED', supported.filter(x => x.sourceId.includes('accounting-publications-appm')))
  const xlsx = aggregatePopulation('XLSX_ALL_SUPPORTED', supported.filter(x => x.modality === 'XLSX'))
  const a3Conditions = {
    explicitIdentifier: sliceAggregate(supported.filter(x => x.sourceId.includes('accounting-publications-appm')), x => x.sectionIdentifierPresent),
    noExplicitIdentifier: sliceAggregate(supported.filter(x => x.sourceId.includes('accounting-publications-appm')), x => !x.sectionIdentifierPresent),
    directOrStructural: sliceAggregate(supported.filter(x => x.sourceId.includes('accounting-publications-appm')), x => x.queryStyle === 'DIRECT_OR_STRUCTURAL'),
    paraphrasedOrAbstract: sliceAggregate(supported.filter(x => x.sourceId.includes('accounting-publications-appm')), x => x.queryStyle === 'PARAPHRASED_OR_ABSTRACT'),
    byEvidenceRole: [...new Set(supported.filter(x => x.sourceId.includes('accounting-publications-appm')).flatMap(x => x.acceptedRoles))].sort().map(role => ({ role, metrics: sliceAggregate(supported.filter(x => x.sourceId.includes('accounting-publications-appm')), x => x.acceptedRoles.includes(role)) }))
  }
  const goldV3 = supported.filter(x => x.population.startsWith('GOLD_V3_')), multi = supported.filter(x => x.population.startsWith('MULTI_UNIT_') && x.population !== 'MULTI_UNIT_SINGLE_UNIT_CONTROLS'), controls = supported.filter(x => x.population === 'MULTI_UNIT_SINGLE_UNIT_CONTROLS')
  const matchedControls = controls.map(c => {
    const pool = goldV3.filter(x => x.sourceId === c.sourceId && x.modality === c.modality)
    const match = [...pool].sort((a, b) => Math.abs(a.lexicalJaccard - c.lexicalJaccard) - Math.abs(b.lexicalJaccard - c.lexicalJaccard) || a.caseId.localeCompare(b.caseId))[0]
    return { controlCaseId: c.caseId, matchedGoldV3CaseId: match?.caseId || null, sourceMatched: Boolean(match), controlHybridRank: c.ranks.hybrid, matchedHybridRank: match?.ranks.hybrid || null, controlFailureStage: c.primaryFailureStage, matchedFailureStage: match?.primaryFailureStage || null }
  })
  const matchedAvailable = matchedControls.filter(x => x.controlHybridRank && x.matchedHybridRank)
  const controlMatchedComparison = {
    controlCount: controls.length,
    sourceAndModalityMatchedCount: matchedControls.filter(x => x.sourceMatched).length,
    bothRanksAvailableCount: matchedAvailable.length,
    controlBetterRankCount: matchedAvailable.filter(x => x.controlHybridRank < x.matchedHybridRank).length,
    controlWorseRankCount: matchedAvailable.filter(x => x.controlHybridRank > x.matchedHybridRank).length,
    equalRankCount: matchedAvailable.filter(x => x.controlHybridRank === x.matchedHybridRank).length,
    controlTargetAbsentTop100Count: matchedControls.filter(x => !x.controlHybridRank).length,
    matchedGoldTargetAbsentTop100Count: matchedControls.filter(x => !x.matchedHybridRank).length
  }
  const diagnosticFocus = [...multi, ...controls]
  const wrongParent = diagnosticFocus.filter(x => x.primaryFailureStage === 'RIGHT_SOURCE_WRONG_PARENT').length
  const sourceMiss = diagnosticFocus.filter(x => x.primaryFailureStage === 'SOURCE_MISS').length
  const rightParentWrongChild = diagnosticFocus.filter(x => x.primaryFailureStage === 'RIGHT_PARENT_WRONG_CHILD').length
  const reachableTop50 = diagnosticFocus.filter(x => x.ranks.hybrid && x.ranks.hybrid <= 50).length
  const evidenceScores = {
    F_QUERY_ROUTING_STRUCTURAL_METADATA_FIX: wrongParent * 3 + sourceMiss * 2,
    A_EXISTING_RETRIEVER_WITH_SECTION_RERANKING: wrongParent * 2 + reachableTop50,
    E_EVIDENCE_UNIT_REPRESENTATION_FIX: rightParentWrongChild * 3 + diagnosticFocus.filter(x => x.granularity.length).length,
    D_CROSS_ENCODER_RERANKER: reachableTop50,
    B_LATE_INTERACTION_RETRIEVER: diagnosticFocus.filter(x => !x.ranks.vector || x.ranks.vector > 50).length,
    C_LEARNED_SPARSE_RETRIEVER: diagnosticFocus.filter(x => !x.ranks.bm25 || x.ranks.bm25 > 50).length,
    G_MORE_CORPUS_MORE_GOLD_BEFORE_MODEL_WORK: 0
  }
  const futureDirections = Object.entries(evidenceScores).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([direction, evidenceScore], index) => ({ rank: index + 1, direction, evidenceScore, evidenceCode: direction.startsWith('F_') ? 'SOURCE_AND_SECTION_ROUTING_FAILURES' : direction.startsWith('A_') ? 'DEEP_CANDIDATE_REACHABILITY' : direction.startsWith('E_') ? 'RIGHT_PARENT_CHILD_AND_GRANULARITY_FAILURES' : 'DEFERRED_MODEL_FAMILY' }))
  const privateFile = path.join(privateRoot, 'case-diagnostics.json'), rankFile = path.join(privateRoot, 'component-rankings.json'), inputFile = path.join(privateRoot, 'input-hashes.json')
  await write(rankFile, { schemaVersion: '1.0', runId: cfg.runId, cases: cases.map(x => ({ population: x.population, caseId: x.caseId, query: x.query, rankings: x.rankings })), ...gov })
  await write(privateFile, { schemaVersion: '1.0', runId: cfg.runId, cases: analyzed, matchedControls, ...gov })
  await write(inputFile, { schemaVersion: '1.0', runId: cfg.runId, protectedInputs, goldV3PrivateHash: sha(await fs.readFile(path.join(cfg.goldV3PrivateRoot, 'gold-v3-adjudication.json'))), multiUnitPrivateHash: sha(await fs.readFile(path.join(cfg.multiUnitPrivateRoot, 'multi-unit-gold-v1-adjudication.json'))), documentVectorHash: sha(await fs.readFile(path.join(cfg.vectorRoot, 'document-embeddings.f32'))), ...gov })
  const summary = { schemaVersion: '1.0', runId: cfg.runId, populations, a3, a3ByPopulation: populationNames.map(name => aggregatePopulation(name, supported.filter(x => x.population === name && x.sourceId.includes('accounting-publications-appm')))).filter(x => x.caseCount), xlsx, a3Conditions, controlMatchedComparison, futureDirections, freshEvaluationRequirement: { required: true, reasonCode: 'GOLD_V3_AND_MULTI_UNIT_GOLD_V1_HOLDOUTS_CONSUMED', minimumDesign: 'NEW_SHA_BOUND_SOURCE_BALANCED_SECTION_CHALLENGE_SET_WITH_UNTOUCHED_HOLDOUT_AND_SINGLE_UNIT_CONTROLS' }, evaluatorOnlyOracleMetrics: true, rankingInputExcludesGold: true, noParameterOptimization: true, ...gov }
  validateGitSafeArtifact({ artifactType: 'broader-retrieval-diagnostic-summary', value: summary })
  await write(path.join(publicRoot, 'diagnostic-summary.json'), summary)
  const manifest = await buildManifest([['private-component-rankings', rankFile], ['private-case-diagnostics', privateFile], ['private-input-hashes', inputFile]])
  validateGitSafeArtifact({ artifactType: 'broader-retrieval-diagnostic-manifest', value: manifest })
  await write(path.join(publicRoot, 'external-artifact-manifest.json'), manifest)
  console.log(JSON.stringify({ cases: analyzed.length, supported: supported.length, populations: populations.map(x => ({ population: x.population, cases: x.caseCount, stages: x.primaryFailureStages })) }, null, 2))
  return summary
}

export async function verifyDeterminism() {
  const files = [path.join(privateRoot, 'component-rankings.json'), path.join(privateRoot, 'case-diagnostics.json'), path.join(privateRoot, 'input-hashes.json'), path.join(publicRoot, 'diagnostic-summary.json'), path.join(publicRoot, 'external-artifact-manifest.json')]
  const before = Object.fromEntries(await Promise.all(files.map(async f => [path.basename(f), sha(await fs.readFile(f))])))
  await runDiagnostic()
  const after = Object.fromEntries(await Promise.all(files.map(async f => [path.basename(f), sha(await fs.readFile(f))])))
  const result = { schemaVersion: '1.0', runId: cfg.runId, artifacts: Object.keys(before).map(name => ({ name, initialSha256: before[name], rerunSha256: after[name], pass: before[name] === after[name] })), determinismPassed: Object.keys(before).every(k => before[k] === after[k]), ...gov }
  assert.equal(result.determinismPassed, true)
  validateGitSafeArtifact({ artifactType: 'broader-retrieval-diagnostic-determinism', value: result })
  await write(path.join(publicRoot, 'determinism.json'), result)
  return result
}

const command = process.argv[2] || 'run'
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (command === 'run') await runDiagnostic()
  else if (command === 'determinism') await verifyDeterminism()
  else throw new Error(`Unknown command: ${command}`)
}
