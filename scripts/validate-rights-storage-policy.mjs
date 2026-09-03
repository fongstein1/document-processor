import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateRightsFilesystem, validateRightsState } from './rights-storage.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(root, 'data', 'processed', 'review_packages', 'acquisition-pilot-2026-09-02')
const policy = JSON.parse(await fs.readFile(path.join(root, 'config', 'rights-storage-policy.json'), 'utf8'))
const required = ['RIGHTS_CLEARED_FOR_REPOSITORY', 'RIGHTS_EXTERNAL_STORAGE_ONLY', 'RIGHTS_REVIEW_REQUIRED']
if (!required.every((status) => policy.statuses.includes(status)) || policy.defaultStatus !== 'RIGHTS_REVIEW_REQUIRED') throw new Error('Rights/storage policy statuses are incomplete.')
if (!policy.rules.substantiveExtractedText || !policy.rules.permittedGitEvidence?.length || !policy.rules.legalConclusion) throw new Error('Rights/storage policy controls are incomplete.')
const result = await validateRightsFilesystem({ policy, repoRoot: root, outputRoot })
console.log('Validated rights/storage boundary: ' + result.controlledSourceCount + ' unresolved-rights sources have no substantive text in tracked review artifacts and ' + result.externalArtifactCount + ' external artifact hashes/paths/byte counts verify.')
export { validateRightsState }
