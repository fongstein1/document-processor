import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(await fs.readFile(path.join(repoRoot, 'config', 'hybrid-vector-retrieval-experiment.json'), 'utf8'))
const root = path.join('C:\\Dev\\Document Processor Sources', '_processed-private', config.runId)
const rerun = path.join(root, 'determinism-rerun')
const hash = async (file) => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')
const primaryMetadata = JSON.parse(await fs.readFile(path.join(root, 'embedding-metadata.json'), 'utf8'))
const rerunMetadata = JSON.parse(await fs.readFile(path.join(rerun, 'embedding-metadata.json'), 'utf8'))
const comparisons = [
  ['documentVectorSha256', path.join(root, 'document-embeddings.f32'), path.join(rerun, 'document-embeddings.f32')],
  ['queryVectorSha256', path.join(root, 'query-embeddings.f32'), path.join(rerun, 'query-embeddings.f32')]
].map(([name, primaryPath, rerunPath]) => ({ name, primaryPath, rerunPath }))
for (const item of comparisons) { item.primarySha256 = await hash(item.primaryPath); item.rerunSha256 = await hash(item.rerunPath); item.pass = item.primarySha256 === item.rerunSha256 }
const metadataMatch = ['model', 'revision', 'license', 'vectorDimension', 'vectorCount', 'queryVectorCount', 'passageInputSha256', 'queryInputSha256', 'modelSnapshotSha256'].every((key) => primaryMetadata[key] === rerunMetadata[key])
const evidence = { schemaVersion: '1.0', runId: config.runId, comparisons, metadataMatch, deterministicAlgorithms: primaryMetadata.deterministicAlgorithms === true && rerunMetadata.deterministicAlgorithms === true, allPassed: metadataMatch && comparisons.every((item) => item.pass), reviewOnly: true }
await fs.writeFile(path.join(root, 'determinism-evidence.json'), JSON.stringify(evidence, null, 2) + '\n', 'utf8')
if (!evidence.allPassed) throw new Error('Local embedding determinism check failed.')
console.log('Local E5 document/query vector determinism passed.')
