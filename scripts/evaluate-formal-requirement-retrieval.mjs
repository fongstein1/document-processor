import { normalizeText, scoreChunk, tokenize } from './evaluate-source-index-retrieval.mjs'
import { assessFormalRequirementEvidenceSufficiency } from './formal-requirement-evidence-sufficiency.mjs'

const compactPhraseTokens = (value) => normalizeText(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .split(/\s+/)
  .filter(Boolean)
  .map((token) => token.length > 4 && token.endsWith('s') && !token.endsWith('ss') ? token.slice(0, -1) : token)

const phraseOverlapBoost = (query, candidate, weight = 1) => {
  const queryTokens = compactPhraseTokens(query)
  const candidateTokens = compactPhraseTokens(candidate)
  if (queryTokens.length < 2 || candidateTokens.length < 2) return 0
  const candidateBigrams = new Set(candidateTokens.slice(0, -1).map((token, index) => `${token} ${candidateTokens[index + 1]}`))
  const candidateTrigrams = new Set(candidateTokens.slice(0, -2).map((token, index) => `${token} ${candidateTokens[index + 1]} ${candidateTokens[index + 2]}`))
  const queryBigrams = new Set(queryTokens.slice(0, -1).map((token, index) => `${token} ${queryTokens[index + 1]}`))
  const queryTrigrams = new Set(queryTokens.slice(0, -2).map((token, index) => `${token} ${queryTokens[index + 1]} ${queryTokens[index + 2]}`))
  const bigramMatches = [...queryBigrams].filter((phrase) => candidateBigrams.has(phrase)).length
  const trigramMatches = [...queryTrigrams].filter((phrase) => candidateTrigrams.has(phrase)).length
  return weight * (bigramMatches + trigramMatches * 2)
}

const tokenOverlap = (query, candidate) => {
  const queryTokens = new Set(tokenize(query))
  const candidateTokens = new Set(tokenize(candidate))
  return [...queryTokens].filter((token) => candidateTokens.has(token)).length
}

const formalRequirementScore = (query, chunk) => {
  const requirements = query.supportRequirements ?? {}
  const requiredSourceIds = requirements.requiredSourceIds ?? []
  let score = scoreChunk(query.query, chunk, requirements)
  if ((requirements.informationTypes ?? []).includes('formal_requirement')) {
    if (requiredSourceIds.length > 0) score += requiredSourceIds.includes(chunk.sourceId) ? 24 : -10
    score += tokenOverlap(query.query, chunk.sourceTextExcerpt) * 1.85
    score += phraseOverlapBoost(query.query, chunk.sectionReference, 2)
    score += phraseOverlapBoost(query.query, chunk.topic, 1.5)
    score += phraseOverlapBoost(query.query, chunk.sourceTextExcerpt, 1.5)
  }
  return score
}

export const evaluateFormalRequirementQueries = ({ queries, chunkRecords, sourcePackages, unsupportedThreshold = 3, topN = 5 }) => {
  const sourceLookup = new Map(sourcePackages.map((source) => [source.sourceId, source]))
  const chunks = chunkRecords.filter((chunk) => chunk.retrievalEligible !== false)
  const results = queries.map((query) => {
    const rankedMatches = chunks.map((chunk) => ({
      chunkId: chunk.chunkId,
      sourceId: chunk.sourceId,
      sourceFamilyId: chunk.sourceFamilyId,
      authorityLevel: chunk.authorityLevel,
      score: formalRequirementScore(query, chunk),
      citationCount: Array.isArray(chunk.citations) ? chunk.citations.length : 0,
    })).sort((left, right) => right.score - left.score || left.chunkId.localeCompare(right.chunkId)).slice(0, topN)
    const expectedChunkIds = query.expectedChunkIds ?? []
    const expectedSourceIds = query.expectedSourceIds ?? []
    const expectedPackages = expectedSourceIds.map((sourceId) => sourceLookup.get(sourceId)).filter(Boolean)
    const expectedSourceFamilyIds = [...new Set(expectedPackages.map((source) => source.sourceFamilyId).filter(Boolean))]
    const expectedAuthorityLevels = [...new Set(expectedPackages.map((source) => source.authorityLevel).filter(Boolean))]
    const top1Hit = Boolean(rankedMatches[0] && expectedChunkIds.includes(rankedMatches[0].chunkId))
    const top3Hit = rankedMatches.slice(0, 3).some((match) => expectedChunkIds.includes(match.chunkId))
    const top5Hit = rankedMatches.some((match) => expectedChunkIds.includes(match.chunkId))
    const supportDecision = assessFormalRequirementEvidenceSufficiency({ query, topMatches: rankedMatches, chunkRecords, sourcePackages, unsupportedThreshold })
    const expectedOutcome = query.expectedOutcome ?? 'supported'
    const resultLabel = expectedOutcome === 'unsupported'
      ? supportDecision.supportState === 'unsupported' ? 'unsupported' : 'false_positive'
      : top1Hit ? 'supported_top1' : top3Hit ? 'supported_top3' : top5Hit ? 'supported_top5' : 'miss'
    return {
      ...query,
      expectedSourceFamilyIds,
      expectedAuthorityLevels,
      rankedMatches,
      top1Hit,
      top3Hit,
      top5Hit,
      predictedSourceFamilyId: rankedMatches[0]?.sourceFamilyId ?? null,
      predictedAuthorityLevel: rankedMatches[0]?.authorityLevel ?? null,
      supportDecision,
      resultLabel,
    }
  })
  return { method: 'generic_formal_requirement_keyword_overlap', queries: results }
}
