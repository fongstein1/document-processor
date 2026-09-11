import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { parseQuestionJsonl, validateQuestionRecords } from './lib/natural-question-input.mjs'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const config = JSON.parse(await fs.readFile(path.resolve('config/natural-question-gold-v1.json'), 'utf8'))
const make = (index, source = 'HUMAN_BENCHMARK') => ({
  questionId: `nqv1-test-${String(index).padStart(3, '0')}`,
  questionText: `How should a reviewer interpret regulatory reporting scenario number ${index}?`,
  authoringSource: source,
  primaryEligible: source !== 'TARGET_BLIND_SECONDARY',
  taskCategory: 'REPORTING_INSTRUCTION',
  sourceFamilyHint: 'UNKNOWN',
  createdAt: '2026-09-11T00:00:00Z',
  batchId: 'synthetic-validator-fixture',
  targetIndependence: {
    authoredBeforeAdjudication: true,
    authoredWithoutTargetEvidenceAccess: true,
    notDerivedFromTargetText: true,
    attestationMethod: 'PROCESS_SEPARATION'
  }
})

const valid = Array.from({ length: 65 }, (_, index) => make(index + 1, index < 45 ? 'HUMAN_BENCHMARK' : 'TARGET_BLIND_SECONDARY'))
assert.equal(validateQuestionRecords(valid, config).phaseAGatePassed, true)
const insufficient = validateQuestionRecords(valid.slice(0, 20), config)
assert.equal(insufficient.phaseAGatePassed, false)
assert.deepEqual(insufficient.deficits, { questionShortfall: 45, minimumQuestionShortfall: 40, humanQuestionShortfall: 20 })
const leaked = structuredClone(valid)
leaked[0].acceptedTargetIds = ['forbidden-child-id']
assert.match(validateQuestionRecords(leaked, config).errors.join('\n'), /acceptedTargetIds is prohibited/)
const secondaryPrimary = structuredClone(valid)
secondaryPrimary[50].primaryEligible = true
assert.match(validateQuestionRecords(secondaryPrimary, config).errors.join('\n'), /primaryEligible/)
const duplicate = structuredClone(valid)
duplicate[1].questionText = duplicate[0].questionText
assert.match(validateQuestionRecords(duplicate, config).errors.join('\n'), /duplicates another normalized question/)
assert.equal(parseQuestionJsonl('{bad json}').errors.length, 1)
const gate = JSON.parse(await fs.readFile(path.resolve('data/processed/review_packages/natural-question-gold-v1-2026-09/intake-gate.json'), 'utf8'))
assert.equal(validateGitSafeArtifact({ artifactType: 'natural-question-intake-gate', value: gate }), true)
assert.throws(
  () => validateGitSafeArtifact({ artifactType: 'natural-question-negative-fixture', value: { questionText: 'private question must not enter Git artifacts' } }),
  /questionText/
)
console.log('Natural-question intake tests passed: schema, sufficiency, target independence, leakage, provenance, and duplicate guards.')
