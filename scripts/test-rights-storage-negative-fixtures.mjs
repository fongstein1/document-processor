import { validateRightsState } from './rights-storage.mjs'

const policy = { statuses: ['RIGHTS_CLEARED_FOR_REPOSITORY', 'RIGHTS_EXTERNAL_STORAGE_ONLY', 'RIGHTS_REVIEW_REQUIRED'], defaultStatus: 'RIGHTS_REVIEW_REQUIRED' }
const source = { sourceId: 'fixture-source', fileHash: 'a'.repeat(64), rightsStatus: 'RIGHTS_REVIEW_REQUIRED' }
const makeBase = () => {
  const externalArtifacts = ['extraction', 'chunk-manifest', 'source-index', 'retrieval-smoke-tests'].map((artifactType) => ({ sourceId: source.sourceId, artifactType, externalPath: 'C:\\Dev\\Document Processor Sources\\_processed-private\\fixture\\' + artifactType + '.json', sha256: 'x', byteCount: 1, sourceRawSha256: source.fileHash, rightsStorageStatus: source.rightsStatus, reviewOnly: true }))
  const externalFiles = new Map(externalArtifacts.map((item) => [item.externalPath, 'x']))
  for (const item of externalArtifacts) { item.sha256 = '2d711642b726b04401627ca9fbac32f5c8530fb190b2c3f6f0b5a2f9c9b8c18'; item.byteCount = 1 }
  return { policy, repoRoot: 'C:\\Dev\\Document Processor', batch: { sourceFiles: [source] }, repoArtifacts: { extraction: { sourceId: source.sourceId }, chunks: { sourceId: source.sourceId }, index: { sourceId: source.sourceId }, retrieval: { sourceId: source.sourceId } }, externalArtifacts, externalFiles }
}
const expectFailure = (name, mutate) => { const fixture = makeBase(); mutate(fixture); try { validateRightsState(fixture); throw new Error('Fixture did not fail: ' + name) } catch (error) { if (error.message === 'Fixture did not fail: ' + name) throw error } }
expectFailure('substantive extraction text in Git', (x) => { x.repoArtifacts.extraction.text = 'restricted source text' })
expectFailure('substantive chunk text in Git', (x) => { x.repoArtifacts.chunks.sourceTextExcerpt = 'restricted source text' })
expectFailure('substantive source-index text in Git', (x) => { x.repoArtifacts.index.sourceTextExcerpt = 'restricted source text' })
expectFailure('missing external artifact', (x) => { x.externalArtifacts.pop() })
expectFailure('external artifact hash mismatch', (x) => { x.externalArtifacts[0].sha256 = '0'.repeat(64) })
expectFailure('rights status omitted', (x) => { delete x.batch.sourceFiles[0].rightsStatus })
console.log('Passed rights-storage negative fixtures: Git text leakage, missing external artifact, bad external hash, and omitted rights status.')
