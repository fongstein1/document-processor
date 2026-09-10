import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { validateGitSafeArtifact } from './rights-storage.mjs'

const root = path.resolve(import.meta.dirname, '..')
const cfg = JSON.parse(await fs.readFile(path.join(root, 'config/section-challenge-v1.json'), 'utf8'))
const freeze = JSON.parse(await fs.readFile(path.join(root, 'data/processed/review_packages', cfg.runId, 'evaluation-freeze.json'), 'utf8'))
assert.equal(freeze.counts.supported, 48)
assert.equal(freeze.counts.development, 28)
assert.equal(freeze.counts.holdout, 20)
assert.equal(freeze.counts.diagnostic, 6)
assert.equal(freeze.counts.matchedPairs, 24)
assert.equal(new Set(freeze.cases.map(x=>x.caseId)).size, freeze.cases.length)
assert.equal(new Set(freeze.cases.map(x=>x.queryHash)).size, freeze.cases.length)
assert.ok(freeze.cases.every(x => x.queryExternal && x.rationaleExternal))
assert.ok(freeze.cases.filter(x=>x.included).every(x => x.acceptedTargetIds.length && x.acceptedParentIds.length))
assert.ok(freeze.cases.filter(x=>!x.included).every(x => !x.acceptedTargetIds.length && x.classification === 'UNSUPPORTED_DIAGNOSTIC'))
assert.equal(freeze.rankingInputExcludesGold, true)
assert.equal(freeze.holdoutAccessProhibitedUntilArchitectureFreeze, true)
validateGitSafeArtifact({ artifactType: 'section-challenge-v1-test', value: freeze })
console.log('Section Challenge V1 integrity tests passed.')
