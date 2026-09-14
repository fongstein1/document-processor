import crypto from 'node:crypto'

export const provenanceTypes = ['USER_WORK_CHAT', 'TEAM_OR_COLLEAGUE', 'INTERNAL_MEETING_OR_NOTES', 'USER_DIRECT_ENTRY', 'OTHER_HUMAN_AUTHORED']
export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
export const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`

const stopWords = new Set(['a', 'all', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'do', 'does', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'of', 'on', 'or', 'our', 'so', 'that', 'the', 'then', 'this', 'to', 'we', 'what', 'when', 'why', 'with', 'you'])
const normalize = (text) => text.normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ')
const tokens = (text) => normalize(text).split(' ').filter((token) => token && !stopWords.has(token))
const trigrams = (text) => {
  const normalized = `  ${normalize(text)}  `
  return new Set(Array.from({ length: Math.max(0, normalized.length - 2) }, (_, index) => normalized.slice(index, index + 3)))
}
const intersectionSize = (left, right) => [...left].filter((value) => right.has(value)).length

export const mechanicalScore = (leftText, rightText) => {
  const leftTokens = new Set(tokens(leftText))
  const rightTokens = new Set(tokens(rightText))
  const sharedTokens = intersectionSize(leftTokens, rightTokens)
  const tokenUnion = new Set([...leftTokens, ...rightTokens]).size
  const smallerTokenSet = Math.min(leftTokens.size, rightTokens.size)
  const leftTrigrams = trigrams(leftText)
  const rightTrigrams = trigrams(rightText)
  const sharedTrigrams = intersectionSize(leftTrigrams, rightTrigrams)
  return {
    tokenJaccard: tokenUnion ? sharedTokens / tokenUnion : 0,
    smallerSetContainment: smallerTokenSet ? sharedTokens / smallerTokenSet : 0,
    characterTrigramDice: leftTrigrams.size + rightTrigrams.size ? (2 * sharedTrigrams) / (leftTrigrams.size + rightTrigrams.size) : 0,
    sharedContentTokens: sharedTokens,
  }
}

const roundedScore = (score) => Object.fromEntries(Object.entries(score).map(([key, value]) => [key, typeof value === 'number' && !Number.isInteger(value) ? Number(value.toFixed(6)) : value]))
const isAutomaticCandidate = (score) => score.tokenJaccard >= 0.45 || score.characterTrigramDice >= 0.58 || (score.sharedContentTokens >= 3 && score.smallerSetContainment >= 0.6)
const has = (text, pattern) => pattern.test(normalize(text))
const topicMatchers = {
  GROSS_NEGATIVE_DR_PRICING_FACTORS: (text) => (has(text, /\bdr\b/) && has(text, /\bnegative\b/)) || (has(text, /\bpricing\b/) && has(text, /\bfactors?\b/)),
  PRE_PBR_RESERVE_RELEASE: (text) => has(text, /\bpre pbr\b/) && has(text, /\breserves?\b/) && has(text, /\brelease\b/),
  CURRENT_ASSUMPTIONS_PRE_PBR_LTCR: (text) => (has(text, /\bcurrent assumptions\b/) && (has(text, /\bpre pbr\b/) || has(text, /\bpre vm20\b/) || has(text, /\bltcr\b/))) || has(text, /\bltcr\b/),
  DOMINANT_RESERVE: (text) => has(text, /\bdominant\b/),
}

export const buildNearDuplicateReview = (questions, goldCases) => {
  const withinBatch = []
  for (let left = 0; left < questions.length; left += 1) for (let right = left + 1; right < questions.length; right += 1) {
    const score = mechanicalScore(questions[left].questionTextExact, questions[right].questionTextExact)
    if (isAutomaticCandidate(score)) withinBatch.push({ leftOrdinal: left + 1, rightOrdinal: right + 1, leftTextExact: questions[left].questionTextExact, rightTextExact: questions[right].questionTextExact, metrics: roundedScore(score) })
  }
  const batchVersusGold = []
  for (const [batchIndex, question] of questions.entries()) for (const goldCase of goldCases) {
    const score = mechanicalScore(question.questionTextExact, goldCase.question)
    if (isAutomaticCandidate(score)) batchVersusGold.push({ batchOrdinal: batchIndex + 1, goldQuestionId: goldCase.questionId, batchTextExact: question.questionTextExact, goldTextExact: goldCase.question, metrics: roundedScore(score) })
  }
  const requestedTopicReview = Object.fromEntries(Object.entries(topicMatchers).map(([topic, matcher]) => [topic, {
    batch: questions.flatMap((item, index) => matcher(item.questionTextExact) ? [{ batchOrdinal: index + 1, questionTextExact: item.questionTextExact }] : []),
    gold: goldCases.flatMap((item) => matcher(item.question) ? [{ goldQuestionId: item.questionId, questionTextExact: item.question }] : []),
  }]))
  return { schemaVersion: '1.0', intakeId: 'natural-question-expansion-batch-01', status: 'REVIEW_ONLY_NO_AUTOMATIC_REMOVAL', method: { type: 'DETERMINISTIC_LEXICAL_MECHANICAL_ONLY', normalization: 'Unicode NFKC; lowercase; non-alphanumeric characters replaced by spaces; whitespace collapsed', metrics: ['content-token Jaccard', 'smaller-set token containment', 'character-trigram Dice'], automaticFlagRule: 'tokenJaccard >= 0.45 OR characterTrigramDice >= 0.58 OR (sharedContentTokens >= 3 AND smallerSetContainment >= 0.60)', embeddingsUsed: false, retrievalUsed: false, sourceDocumentsInspected: false, llmParaphraseJudgmentUsed: false, automaticRemovalAllowed: false }, automaticCandidates: { withinBatch, batchVersusGold }, requestedTopicReview }
}
