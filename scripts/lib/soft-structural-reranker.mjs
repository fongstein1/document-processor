import { regulatoryTokens } from './semantic-evidence-units.mjs'

const generic = new Set(['what','which','where','when','how','who','does','must','should','under','within','into','from','with','without','that','this','these','those','their','there','have','has','been','being','are','was','were','for','and','the','of','to','in','on','by','or','an','a','is','as','be','it','its','than','through','applies','apply','reported','recorded','contains','contain','value','values'])
const norm = value => String(value || '').toLowerCase().replace(/[–—]/g, '-').replace(/no\.?\s*/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
const tokens = value => [...new Set(regulatoryTokens(value).map(norm).filter(x => x.length > 1 && !generic.has(x)))]
const sequenceTokens = value => regulatoryTokens(value).map(norm).filter(x => x.length > 1 && !generic.has(x))

const identifierFamily = identifier => identifier.match(/^(ssap|vm|schedule|template|table|worksheet|section|paragraph|note|line|part)/)?.[1] || null
const normalizeIdentifier = value => {
  const normalized = norm(value)
  return /^(?:instructions?\s+)?template\s+[a-z0-9]+\s+worksheet$/.test(normalized)
    ? normalized.replace(/\s+worksheet$/, '')
    : normalized
}

export const extractStructuralIdentifiers = query => [...new Set([
  ...(String(query).match(/\bSSAP\s*(?:No\.?\s*)?\d+[A-Z]?\b/gi) || []),
  ...(String(query).match(/\bVM[- ]?\d+(?:\.\d+)?\b/gi) || []),
  ...(String(query).match(/\b(?:Instructions?\s+)?Template\s+[A-Z0-9]+(?:\s+worksheet)?\b/gi) || []),
  ...(String(query).match(/\bSchedule\s+[A-Z]{1,3}(?:\s*[-–—]\s*(?:Part|Section)\s*\d+[A-Z]?)?/gi) || []),
  ...(String(query).match(/\bTable\s+[A-Z0-9]+\b/gi) || []),
  ...(String(query).match(/\b(?:Section|Paragraph|Note|Line|Part)\s+[A-Z0-9]+(?:\.[A-Z0-9]+)*\b/gi) || [])
].map(normalizeIdentifier).filter(Boolean))].sort()

export function inferQueryStructure(query) {
  const value = String(query)
  const identifiers = extractStructuralIdentifiers(value)
  const intentRoles = []
  if (/\bdefine|defined|definition|meaning|characteristics make\b/i.test(value)) intentRoles.push('DEFINITION')
  if (/\bexcept|exclude|unless|despite|departure|qualification\b/i.test(value)) intentRoles.push('EXCEPTION_OR_QUALIFICATION')
  if (/\b(?:schedules?|tables?|worksheets?|templates?|rows?|columns?|lines?|fields?|forms?)\b/i.test(value)) intentRoles.push('TABLE_OR_FORM')
  if (/\b(?:report|reporting|filing|instruction|instructions)\b/i.test(value)) intentRoles.push('REPORTING_INSTRUCTION')
  if (/\bmust|required|requirement|treated|treatment|considered\b/i.test(value)) intentRoles.push('REQUIREMENT')
  const multipart = /\b(and|both|respectively|through)\b/i.test(value) || (value.match(/,/g) || []).length >= 2
  const conceptTokens = tokens(value)
  const structuralPhrasePresent = /\b(ssap|vm[- ]?\d+|schedule|template|table|worksheet|section|paragraph|note|line|part|quarterly|annual statement)\b/i.test(value)
  const confidence = identifiers.length ? 'HIGH' : structuralPhrasePresent || conceptTokens.length >= 4 ? 'MEDIUM' : 'LOW_OR_UNKNOWN'
  const clauses = value.split(/\b(?:and|versus|vs\.?|respectively)\b|[;,]/i).map(tokens).filter(x => x.length >= 2)
  return { identifiers, intentRoles: [...new Set(intentRoles)].sort(), multipart, conceptTokens, structuralPhrasePresent, clauses, confidence, query: value }
}

const ancestorMetadata = (doc, parentById) => {
  const localParts = [doc.section, doc.identifier, doc.parentHeading, doc.header, doc.sheetName]
  let parent = parentById.get(doc.parentId)
  if (parent) localParts.push(parent.structuralIdentifier, parent.structuralLabel, parent.sheetName)
  parent = parent?.parentParentId ? parentById.get(parent.parentParentId) : null
  const ancestorParts = []
  const ids = []
  let depth = 0
  while (parent && depth < 8) {
    ancestorParts.push(parent.structuralIdentifier, parent.structuralLabel, parent.sheetName)
    if (parent.structuralIdentifier) ids.push(norm(parent.structuralIdentifier))
    parent = parent.parentParentId ? parentById.get(parent.parentParentId) : null
    depth++
  }
  return {
    localText: localParts.filter(Boolean).join(' '),
    ancestorText: ancestorParts.filter(Boolean).join(' '),
    text: [...localParts, ...ancestorParts].filter(Boolean).join(' '),
    identifiers: ids.filter(Boolean),
    depth
  }
}

const recall = (needles, haystack) => needles.length ? needles.filter(x => haystack.has(x)).length / needles.length : 0
const roleCompatible = (intentRoles, role) => {
  const r = String(role || '').toUpperCase()
  return intentRoles.some(intent => intent === r ||
    intent === 'TABLE_OR_FORM' && /TABLE|SCHEDULE|HEADER/.test(r) ||
    intent === 'REPORTING_INSTRUCTION' && /REPORTING_INSTRUCTION|INSTRUCTION/.test(r) ||
    intent === 'REQUIREMENT' && /REQUIREMENT|EXCEPTION/.test(r))
}

const orderedBigramCoverage = (query, candidate) => {
  const queryTokens = sequenceTokens(query)
  if (queryTokens.length < 2) return 0
  const candidateText = sequenceTokens(candidate).join(' ')
  let matches = 0
  for (let index = 0; index < queryTokens.length - 1; index++) {
    if (candidateText.includes(`${queryTokens[index]} ${queryTokens[index + 1]}`)) matches++
  }
  return matches / (queryTokens.length - 1)
}

export function scoreStructuralCompatibility({ plan, doc, ranks, parentById, bounds }) {
  const ancestry = ancestorMetadata(doc, parentById)
  const localMetadata = norm(ancestry.localText)
  const ancestorMetadataText = norm(ancestry.ancestorText)
  const candidateMetadata = norm(`${ancestry.text} ${doc.sourceTitle || ''}`)
  const candidateAll = new Set(tokens(`${candidateMetadata} ${doc.body || ''}`))
  const candidateHeading = new Set(tokens(ancestry.localText))
  const localIdentifierMatches = plan.identifiers.filter(id => localMetadata.includes(id)).length
  const ancestorIdentifierMatches = plan.identifiers.filter(id => !localMetadata.includes(id) && ancestorMetadataText.includes(id)).length
  const exactIdentifierMatches = localIdentifierMatches + ancestorIdentifierMatches
  const queryFamilies = plan.identifiers.map(identifierFamily).filter(Boolean)
  const conflictingIdentifier = plan.identifiers.length > 0 && queryFamilies.some(family => new RegExp(`\\b${family}\\b`).test(localMetadata)) && localIdentifierMatches === 0 && ancestorIdentifierMatches === 0
  const conceptCoverage = recall(plan.conceptTokens, candidateAll)
  const headingCoverage = recall(plan.conceptTokens, candidateHeading)
  const sourceCoverage = recall(plan.conceptTokens, new Set(tokens(doc.sourceTitle || '')))
  const clauseCoverage = plan.clauses.length ? plan.clauses.filter(clause => recall(clause, candidateAll) >= 0.35).length / plan.clauses.length : 1
  const phraseCoverage = orderedBigramCoverage(plan.query, doc.body || '')
  const roleMatch = roleCompatible(plan.intentRoles, doc.semanticRole)
  const wantsTable = plan.intentRoles.includes('TABLE_OR_FORM')
  const isTable = doc.documentType === 'workbook' || doc.sheetName || /TABLE|SCHEDULE|HEADER/.test(String(doc.semanticRole || ''))
  const componentRescue = Math.min(ranks.bm25 || 9999, ranks.vector || 9999) <= 3 &&
    (ranks.hybrid || 9999) > 10 && conceptCoverage >= 0.55 && clauseCoverage >= 0.5
  let bonus = 0
  let penalty = 0
  if (localIdentifierMatches) bonus += 0.09
  else if (ancestorIdentifierMatches) bonus += 0.05
  bonus += Math.min(0.09, conceptCoverage * 0.09)
  bonus += Math.min(0.04, headingCoverage * 0.04)
  bonus += Math.min(0.01, sourceCoverage * 0.01)
  bonus += Math.min(0.03, phraseCoverage * 0.03)
  if (roleMatch) bonus += 0.02
  if (wantsTable === Boolean(isTable)) bonus += 0.01
  if (componentRescue) bonus += 0.06
  if (conflictingIdentifier) penalty += 0.10
  if (plan.multipart && plan.clauses.length > 1 && clauseCoverage < 0.75) penalty += (0.75 - clauseCoverage) * 0.06
  if (wantsTable !== Boolean(isTable) && plan.confidence !== 'LOW_OR_UNKNOWN') penalty += 0.02
  const scale = bounds[plan.confidence === 'HIGH' ? 'highConfidenceScale' : plan.confidence === 'MEDIUM' ? 'mediumConfidenceScale' : 'lowConfidenceScale']
  bonus = Math.min(bounds.maximumBonus, bonus * scale)
  penalty = Math.min(bounds.maximumConflictPenalty, penalty * scale)
  return {
    bonus,
    penalty,
    adjustment: bonus - penalty,
    features: {
      exactIdentifierMatches,
      localIdentifierMatches,
      ancestorIdentifierMatches,
      conflictingIdentifier,
      conceptCoverage,
      headingCoverage,
      sourceCoverage,
      phraseCoverage,
      clauseCoverage,
      roleMatch,
      wantsTable,
      isTable: Boolean(isTable),
      componentRescue,
      hierarchyDepth: ancestry.depth
    },
    confidence: plan.confidence
  }
}

export function buildDeepUnion({ bm25, vector, hybrid, cutoffs }) {
  const map = new Map()
  for (const [name, ranking, cutoff] of [['bm25',bm25,cutoffs.bm25],['vector',vector,cutoffs.vector],['hybrid',hybrid,cutoffs.hybrid]]) {
    for (const item of ranking.slice(0, cutoff)) {
      const id = item.doc.childId
      const record = map.get(id) || { doc: item.doc, ranks: { bm25: null, vector: null, hybrid: null }, scores: { bm25: null, vector: null, hybrid: null }, origins: [] }
      record.ranks[name] = item.rank
      record.scores[name] = item.finalScore
      record.origins.push(name)
      map.set(id, record)
    }
  }
  const fullRanks = { bm25: new Map(bm25.map(x=>[x.doc.childId,x.rank])), vector: new Map(vector.map(x=>[x.doc.childId,x.rank])), hybrid: new Map(hybrid.map(x=>[x.doc.childId,x.rank])) }
  return [...map.values()].map(item => ({ ...item, ranks: { bm25: fullRanks.bm25.get(item.doc.childId), vector: fullRanks.vector.get(item.doc.childId), hybrid: fullRanks.hybrid.get(item.doc.childId) }, origins: [...new Set(item.origins)].sort() }))
}

const forbiddenRuntimeKeys = new Set([
  'acceptedTargetIds', 'acceptedParentIds', 'expectedSource', 'expectedSourceId',
  'expectedParent', 'expectedParentId', 'goldClassifications', 'classification',
  'split', 'splitLabel', 'oracle', 'oracleResults', 'evaluatorOnlyOracleResults'
])

export function assertNoEvaluationLeakage(value) {
  const scan = item => {
    if (!item || typeof item !== 'object') return
    for (const [key, nested] of Object.entries(item)) {
      if (forbiddenRuntimeKeys.has(key)) throw new Error(`Gold leakage into reranker: ${key}`)
      scan(nested)
    }
  }
  scan(value)
  return true
}

export function rerankDeepUnion({ query, union, parentById, bounds }) {
  assertNoEvaluationLeakage({ query, union })
  const plan = inferQueryStructure(query)
  const reciprocal = union.map(x => 1 / x.ranks.hybrid)
  const denominator = reciprocal.reduce((a,b)=>a+b,0) || 1
  const candidates = union.map((item, index) => {
    const baseSignal = 0.15 * reciprocal[index] / denominator
    const structural = scoreStructuralCompatibility({ plan, doc: item.doc, ranks: item.ranks, parentById, bounds })
    return { ...item, baseSignal, structural, finalScore: baseSignal + structural.adjustment }
  }).sort((a,b) => b.finalScore - a.finalScore || a.doc.childId.localeCompare(b.doc.childId))
  const baselineTop = candidates.find(x => x.ranks.hybrid === 1)
  if (baselineTop && candidates[0] !== baselineTop && candidates[0].structural.adjustment - baselineTop.structural.adjustment < 0.02) {
    candidates.splice(candidates.indexOf(baselineTop), 1)
    candidates.unshift(baselineTop)
  }
  const ranked = candidates.map((x,i)=>({...x,rank:i+1}))
  return { plan, ranked }
}
