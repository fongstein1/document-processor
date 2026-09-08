import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { publicRoot } from './semantic-evidence-unit-correction.mjs'

const freeze = JSON.parse(await fs.readFile(path.join(publicRoot, 'evaluation-v2-freeze.json'), 'utf8'))
const privateBytes = await fs.readFile(freeze.privateAdjudicationPath); const privateValue = JSON.parse(privateBytes)
assert.equal(freeze.originalCaseCount, 39); assert.equal(privateValue.adjudications.length, 39); assert.equal(freeze.finalGoldSelectionUsesRegex, false); assert.equal(freeze.rankingInputExcludesExpectations, true)
assert.equal(new Set(freeze.cases.map((item) => item.caseId)).size, 39)
assert.equal(crypto.createHash('sha256').update(privateBytes).digest('hex'), freeze.privateAdjudicationSha256)
for (const item of privateValue.adjudications) { assert(item.reviewerStatus === 'INDEPENDENTLY_AUDITED_FROM_PRIVATE_SOURCE_EVIDENCE'); assert(item.rationale); assert(item.query); if (item.included) { assert(item.chosenGoldEvidence.length); assert(item.chosenGoldEvidence.every((evidence) => evidence.goldUnitId && evidence.sourceChunkId && evidence.evidenceContentHash)) } }
console.log(JSON.stringify({ validator: 'gold-v2', result: 'PASS', originalCases: 39, includedCases: privateValue.adjudications.filter((item) => item.included).length, uniqueTargets: freeze.uniqueTargetCaseCount, multiUnitRequired: freeze.multiUnitRequiredCaseCount, excluded: freeze.ambiguousExcludedCaseCount + freeze.invalidExcludedCaseCount, development: freeze.developmentCaseCount, holdout: freeze.holdoutCaseCount, freezeUsesRegex: false }, null, 2))
