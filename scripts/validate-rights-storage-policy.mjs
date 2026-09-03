import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const policy = JSON.parse(await fs.readFile(path.join(root, 'config', 'rights-storage-policy.json'), 'utf8'))
const required = ['RIGHTS_CLEARED_FOR_REPOSITORY', 'RIGHTS_EXTERNAL_STORAGE_ONLY', 'RIGHTS_REVIEW_REQUIRED']
if (!required.every((status) => policy.statuses.includes(status)) || policy.defaultStatus !== 'RIGHTS_REVIEW_REQUIRED') throw new Error('Rights/storage policy statuses are incomplete.')
if (!policy.rules.substantiveExtractedText || !policy.rules.permittedGitEvidence?.length || !policy.rules.legalConclusion) throw new Error('Rights/storage policy controls are incomplete.')
console.log('Validated generic rights/storage policy: unresolved or external-only source text remains outside public Git by policy.')
