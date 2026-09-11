import crypto from 'node:crypto'

const allowedKeys = new Set([
  'questionId', 'questionText', 'authoringSource', 'primaryEligible',
  'taskCategory', 'sourceFamilyHint', 'createdAt', 'batchId', 'targetIndependence'
])
const allowedAttestationKeys = new Set([
  'authoredBeforeAdjudication', 'authoredWithoutTargetEvidenceAccess',
  'notDerivedFromTargetText', 'attestationMethod'
])
const prohibitedKeys = new Set([
  'acceptedTargetId', 'acceptedTargetIds', 'acceptedParentId', 'acceptedParentIds',
  'acceptedEvidenceIds', 'acceptedEvidenceSets', 'evidenceText', 'sourceExcerpt',
  'targetDerivedKeywords', 'targetDerivedKeywordList', 'forcedAnswerSection',
  'adjudicationResult', 'adjudicationRationale', 'expectedSource', 'split',
  'retrievalRank', 'baselineRank', 'goldCategory'
])
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex')
const normalizeQuestion = value => String(value).normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase()

const scanProhibited = (value, at, errors) => {
  if (!value || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    if (prohibitedKeys.has(key)) errors.push(`${at}.${key} is prohibited in pre-adjudication input`)
    scanProhibited(child, `${at}.${key}`, errors)
  }
}

export function parseQuestionJsonl(text) {
  const records = []
  const errors = []
  for (const [index, line] of String(text).split(/\r?\n/).entries()) {
    if (!line.trim()) continue
    try { records.push(JSON.parse(line)) }
    catch { errors.push(`line ${index + 1} is not valid JSON`) }
  }
  return { records, errors }
}

export function validateQuestionRecords(records, config) {
  const errors = []
  const ids = new Set()
  const normalizedHashes = new Set()
  const allowedSources = new Set(config.allowedAuthoringSources)
  const allowedCategories = new Set(config.allowedTaskCategories)
  const allowedHints = new Set(config.allowedSourceFamilyHints)
  const attestationMethods = new Set(['AUTHOR_ATTESTATION', 'PROCESS_SEPARATION', 'PROVENANCE_RECORD'])
  let humanQuestionCount = 0
  let targetBlindSecondaryCount = 0

  records.forEach((record, index) => {
    const at = `record[${index}]`
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      errors.push(`${at} must be an object`)
      return
    }
    scanProhibited(record, at, errors)
    for (const key of Object.keys(record)) if (!allowedKeys.has(key)) errors.push(`${at}.${key} is not allowed`)
    if (!/^nqv1-[a-z0-9][a-z0-9-]{2,63}$/.test(record.questionId || '')) errors.push(`${at}.questionId is invalid`)
    else if (ids.has(record.questionId)) errors.push(`${at}.questionId is duplicated`)
    else ids.add(record.questionId)
    const question = typeof record.questionText === 'string' ? record.questionText.trim() : ''
    if (question.length < config.minimumQuestionCharacters || question.length > config.maximumQuestionCharacters) errors.push(`${at}.questionText length is invalid`)
    if (question.includes('<') || question.includes('>')) errors.push(`${at}.questionText still contains template markers`)
    if (question) {
      const hash = sha256(normalizeQuestion(question))
      if (normalizedHashes.has(hash)) errors.push(`${at}.questionText duplicates another normalized question`)
      normalizedHashes.add(hash)
    }
    if (!allowedSources.has(record.authoringSource)) errors.push(`${at}.authoringSource is invalid`)
    const human = record.authoringSource === 'HUMAN_REAL_WORLD' || record.authoringSource === 'HUMAN_BENCHMARK'
    if (human) humanQuestionCount++
    if (record.authoringSource === 'TARGET_BLIND_SECONDARY') targetBlindSecondaryCount++
    if (record.primaryEligible !== human) errors.push(`${at}.primaryEligible must be true only for human-authored records`)
    if (record.taskCategory !== undefined && !allowedCategories.has(record.taskCategory)) errors.push(`${at}.taskCategory is invalid`)
    if (record.sourceFamilyHint !== undefined && !allowedHints.has(record.sourceFamilyHint)) errors.push(`${at}.sourceFamilyHint is invalid`)
    if (!record.createdAt || Number.isNaN(Date.parse(record.createdAt))) errors.push(`${at}.createdAt must be an ISO date-time`)
    if (record.batchId !== undefined && !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/.test(record.batchId)) errors.push(`${at}.batchId is invalid`)
    const att = record.targetIndependence
    if (!att || typeof att !== 'object' || Array.isArray(att)) errors.push(`${at}.targetIndependence is required`)
    else {
      for (const key of Object.keys(att)) if (!allowedAttestationKeys.has(key)) errors.push(`${at}.targetIndependence.${key} is not allowed`)
      for (const key of ['authoredBeforeAdjudication', 'authoredWithoutTargetEvidenceAccess', 'notDerivedFromTargetText']) if (att[key] !== true) errors.push(`${at}.targetIndependence.${key} must be true`)
      if (!attestationMethods.has(att.attestationMethod)) errors.push(`${at}.targetIndependence.attestationMethod is invalid`)
    }
  })

  const questionCount = records.length
  const questionShortfall = Math.max(0, config.targetQuestionInputCount - questionCount)
  const minimumQuestionShortfall = Math.max(0, config.minimumQuestionInputCount - questionCount)
  const humanQuestionShortfall = Math.max(0, config.minimumHumanQuestionCount - humanQuestionCount)
  const phaseAGatePassed = errors.length === 0 && minimumQuestionShortfall === 0 && humanQuestionShortfall === 0
  return {
    valid: errors.length === 0,
    phaseAGatePassed,
    counts: { questionCount, humanQuestionCount, targetBlindSecondaryCount },
    deficits: { questionShortfall, minimumQuestionShortfall, humanQuestionShortfall },
    questionIdsSha256: sha256(JSON.stringify([...ids].sort())),
    normalizedQuestionHashesSha256: sha256(JSON.stringify([...normalizedHashes].sort())),
    errors
  }
}
