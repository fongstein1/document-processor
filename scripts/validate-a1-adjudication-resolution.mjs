import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const record = JSON.parse(await fs.readFile(path.join(root, 'data', 'processed', 'review_packages', 'acquisition-pilot-2026-09-02', 'a1-adjudication-resolution.json'), 'utf8'))
if (record.payloadSha256 !== '3029ee3b55a1d51bd31d92c0aa3913020a47c2bed7e780c403822a1727111c8c' || record.correctedDisposition !== 'ADMIT_TO_PROCESSING_QUEUE' || record.processingDisposition !== 'NOT_PROCESSED_IN_THIS_TASK' || record.historicalQuarantineEvidencePreserved !== true) throw new Error('A1 resolution record is incomplete or processing boundary changed.')
if (!record.observedPayloadTitle || !record.adoptionEvidence?.length || record.limitations?.length !== 2) throw new Error('A1 observed identity/adoption/limitation metadata is incomplete.')
console.log('Validated A1 metadata-only adjudication resolution; A1 processing remains disabled in this task.')
