import crypto from 'node:crypto'

export const stableJson = (value) => JSON.stringify(value, (_key, item) => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return item
  return Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
})

export const sha256 = (value) => crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : String(value)).digest('hex')

const itemId = (item) => String(item.doc?.childId || item.childId || item.doc?.parentId || item.parentId || '')

export const exactCosineRank = ({ queryVector, documentVectors, documents, dimension }) => {
  if (!(queryVector instanceof Float32Array) || !(documentVectors instanceof Float32Array)) throw new TypeError('Exact cosine retrieval requires Float32Array inputs.')
  if (!Number.isInteger(dimension) || dimension <= 0) throw new TypeError('Vector dimension must be a positive integer.')
  if (queryVector.length !== dimension) throw new Error(`Query vector dimension mismatch: ${queryVector.length}/${dimension}`)
  if (documentVectors.length !== documents.length * dimension) throw new Error(`Document vector size mismatch: ${documentVectors.length}/${documents.length * dimension}`)
  const ranked = documents.map((doc, documentIndex) => {
    let score = 0
    const offset = documentIndex * dimension
    for (let column = 0; column < dimension; column += 1) score += queryVector[column] * documentVectors[offset + column]
    return { doc, cosineScore: score, finalScore: score }
  })
  ranked.sort((left, right) => right.finalScore - left.finalScore || itemId(left).localeCompare(itemId(right)))
  return ranked.map((item, index) => ({ ...item, rank: index + 1 }))
}

export const reciprocalRankFusion = ({ rankings, weights, k = 60 }) => {
  if (!Number.isFinite(k) || k < 0) throw new TypeError('RRF k must be a non-negative number.')
  const fused = new Map()
  for (const [rankingName, ranked] of Object.entries(rankings)) {
    const weight = Number(weights[rankingName] ?? 0)
    if (!Number.isFinite(weight) || weight < 0) throw new TypeError(`Invalid RRF weight for ${rankingName}.`)
    for (const item of ranked) {
      const id = itemId(item)
      if (!id) throw new Error(`RRF ranking ${rankingName} contains an item without a stable ID.`)
      const record = fused.get(id) || { doc: item.doc || item, rrfComponents: {}, finalScore: 0 }
      const contribution = weight / (k + item.rank)
      record.rrfComponents[rankingName] = { rank: item.rank, weight, contribution }
      record.finalScore += contribution
      fused.set(id, record)
    }
  }
  return [...fused.values()]
    .sort((left, right) => right.finalScore - left.finalScore || itemId(left).localeCompare(itemId(right)))
    .map((item, index) => ({ ...item, rank: index + 1 }))
}

export const addParentRrf = ({ hybridRanking, parentRanking, parentWeight = 0.5, k = 60 }) => {
  const parentRanks = new Map(parentRanking.map((item) => [item.doc?.parentId || item.parentId, item.rank]))
  const reranked = hybridRanking.map((item) => {
    const parentRank = parentRanks.get(item.doc.parentId) || null
    const parentContribution = parentRank ? parentWeight / (k + parentRank) : 0
    return {
      ...item,
      hybridScore: item.finalScore,
      parentRank,
      parentContribution,
      finalScore: item.finalScore + parentContribution
    }
  })
  reranked.sort((left, right) => right.finalScore - left.finalScore || itemId(left).localeCompare(itemId(right)))
  return reranked.map((item, index) => ({ ...item, rank: index + 1 }))
}

export const firstAcceptedRank = (ranked, acceptedIds) => ranked.find((item) => acceptedIds.includes(item.doc.childId))?.rank || null

export const summarizeMetrics = (results) => {
  const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null
  return {
    caseCount: results.length,
    sourceTop1: average(results.map((item) => Number(item.sourceTop1))),
    sourceTop3: average(results.map((item) => Number(item.sourceTop3))),
    sourceTop5: average(results.map((item) => Number(item.sourceTop5))),
    acceptedTargetTop1: average(results.map((item) => Number(item.acceptedTop1))),
    acceptedTargetTop3: average(results.map((item) => Number(item.acceptedTop3))),
    acceptedTargetTop5: average(results.map((item) => Number(item.acceptedTop5))),
    acceptedTargetTop10: average(results.map((item) => Number(item.acceptedTop10))),
    acceptedTargetMrr: average(results.map((item) => item.acceptedMrr)),
    exactChildTop1: average(results.filter((item) => item.exactChildEligible).map((item) => Number(item.exactChildTop1))),
    exactParentRate: average(results.filter((item) => item.exactParent !== null).map((item) => Number(item.exactParent))),
    wrongSourceRate: average(results.map((item) => Number(item.wrongSource))),
    wrongSectionRate: average(results.map((item) => Number(item.wrongSection))),
    authoritySupportCorrectness: average(results.map((item) => Number(item.authoritySupportCorrectness))),
    citationCoordinateValidity: average(results.map((item) => Number(item.citationCoordinateValidity))),
    targetCitationCorrectness: average(results.map((item) => Number(item.targetCitationCorrectness))),
    requiredRoleRecall: average(results.map((item) => item.requiredRoleRecall)),
    acceptedEvidenceRecall: average(results.map((item) => item.acceptedEvidenceRecall)),
    contextPrecision: average(results.map((item) => item.contextPrecision)),
    completeContextRate: average(results.map((item) => Number(item.completeContext))),
    irrelevantContextCount: results.reduce((sum, item) => sum + item.irrelevantContextCount, 0)
  }
}

export const rankingDigest = (rankings) => sha256(stableJson(Object.fromEntries(Object.entries(rankings).map(([key, ranked]) => [key, ranked.map((item) => itemId(item))]))))
