import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseQuestionJsonl, validateQuestionRecords } from './lib/natural-question-input.mjs'

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(await fs.readFile(path.join(repo, 'config/natural-question-gold-v1.json'), 'utf8'))
const override = process.argv.indexOf('--input')
const input = override >= 0 ? path.resolve(process.argv[override + 1]) : path.resolve(config.questionInputPath)
let text = null
try { text = await fs.readFile(input, 'utf8') } catch (error) {
  if (error.code !== 'ENOENT') throw error
}

if (text === null) {
  console.log(JSON.stringify({
    evaluationVersion: config.evaluationVersion,
    questionInputExists: false,
    phaseAGatePassed: false,
    questionCount: 0,
    humanQuestionCount: 0,
    questionShortfall: config.targetQuestionInputCount,
    minimumQuestionShortfall: config.minimumQuestionInputCount,
    humanQuestionShortfall: config.minimumHumanQuestionCount,
    stopReason: 'INSUFFICIENT_NATURAL_QUESTIONS',
    modelSelectionAllowed: false,
    modelImplementationAllowed: false,
    modelEvaluationAllowed: false
  }, null, 2))
  process.exitCode = 2
} else {
  const parsed = parseQuestionJsonl(text)
  const result = validateQuestionRecords(parsed.records, config)
  const errors = [...parsed.errors, ...result.errors]
  console.log(JSON.stringify({
    evaluationVersion: config.evaluationVersion,
    questionInputExists: true,
    phaseAGatePassed: parsed.errors.length === 0 && result.phaseAGatePassed,
    ...result.counts,
    ...result.deficits,
    questionIdsSha256: result.questionIdsSha256,
    normalizedQuestionHashesSha256: result.normalizedQuestionHashesSha256,
    validationErrorCount: errors.length,
    validationErrors: errors,
    stopReason: parsed.errors.length === 0 && result.phaseAGatePassed ? null : 'INSUFFICIENT_NATURAL_QUESTIONS',
    modelSelectionAllowed: false,
    modelImplementationAllowed: false,
    modelEvaluationAllowed: false
  }, null, 2))
  if (parsed.errors.length || !result.phaseAGatePassed) process.exitCode = 2
}
