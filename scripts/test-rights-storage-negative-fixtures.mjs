import { validateRightsState } from './rights-storage.mjs'

const policy = { statuses: ['RIGHTS_CLEARED_FOR_REPOSITORY', 'RIGHTS_EXTERNAL_STORAGE_ONLY', 'RIGHTS_REVIEW_REQUIRED'], defaultStatus: 'RIGHTS_REVIEW_REQUIRED' }
const source = { sourceId: 'fixture-source', fileHash: 'a'.repeat(64), rightsStatus: 'RIGHTS_REVIEW_REQUIRED' }
const makeBase = () => {
  const batchSource = { ...source }
  const externalArtifacts = ['extraction', 'chunk-manifest', 'source-index', 'retrieval-smoke-tests'].map((artifactType) => ({ sourceId: batchSource.sourceId, artifactType, externalPath: 'C:\\Dev\\Document Processor Sources\\_processed-private\\fixture\\' + artifactType + '.json', sha256: 'x', byteCount: 1, sourceRawSha256: batchSource.fileHash, rightsStorageStatus: batchSource.rightsStatus, reviewOnly: true }))
  const externalFiles = new Map(externalArtifacts.map((item) => [item.externalPath, 'x']))
  for (const item of externalArtifacts) { item.sha256 = '2d711642b726b04401627ca9fbac32f5c8530fb1903cc4db02258717921a4881'; item.byteCount = 1 }
  return { policy, repoRoot: 'C:\\Dev\\Document Processor', batch: { sourceFiles: [batchSource] }, repoArtifacts: { extraction: { sourceId: batchSource.sourceId }, chunks: { sourceId: batchSource.sourceId }, index: { sourceId: batchSource.sourceId }, retrieval: { sourceId: batchSource.sourceId } }, externalArtifacts, externalFiles }
}
const expectFailure = (name, mutate) => { const fixture = makeBase(); mutate(fixture); try { validateRightsState(fixture); throw new Error('Fixture did not fail: ' + name) } catch (error) { if (error.message === 'Fixture did not fail: ' + name) throw error } }
expectFailure('substantive extraction text in Git', (x) => { x.repoArtifacts.extraction.text = 'restricted source text' })
expectFailure('substantive chunk text in Git', (x) => { x.repoArtifacts.chunks.sourceTextExcerpt = 'restricted source text' })
expectFailure('substantive source-index text in Git', (x) => { x.repoArtifacts.index.sourceTextExcerpt = 'restricted source text' })
expectFailure('duplicateLabelValues in chunk-manifest projection', (x) => { x.repoArtifacts.chunks.extensions = { duplicateLabelValues: ['Age', 'Mortality Improvement Factor', '0.9975', 'Preferred Nonsmoker'] } })
expectFailure('titleCandidates in chunk-manifest projection', (x) => { x.repoArtifacts.chunks.extensions = { tableBlock: { titleCandidates: ['Instructions for application of mortality improvement factors'] } } })
expectFailure('duplicateLabelValues in source-index nested chunk projection', (x) => { x.repoArtifacts.index.chunks = [{ extensions: { duplicateLabelValues: ['Age', '0.9975'] } }] })
expectFailure('titleCandidates in source-index nested chunk projection', (x) => { x.repoArtifacts.index.chunks = [{ extensions: { tableBlock: { titleCandidates: ['Amendments adopted for the 2026 Valuation Manual'] } } }] })
expectFailure('unexpected nested source-derived content', (x) => { x.repoArtifacts.chunks.extensions = { unexpectedContent: { values: ['unlisted source-derived prose'] } } })
expectFailure('missing external artifact', (x) => { x.externalArtifacts.pop() })
expectFailure('external artifact hash mismatch', (x) => { x.externalArtifacts[0].sha256 = '0'.repeat(64) })
expectFailure('rights status omitted', (x) => { delete x.batch.sourceFiles[0].rightsStatus })
const positive = makeBase()
positive.repoArtifacts = {
  extraction: { sourceId: source.sourceId, sourceSha256: source.fileHash, pages: [{ pageNumber: 1, classification: 'EMPTY_PAGE_BENIGN' }], sheets: [{ name: '2026 Jumbo Rates', worksheetPath: 'xl/worksheets/sheet1.xml', cellContentCount: 3, formulaCount: 1, mergedRanges: [], tableBlocks: [{ blockOrdinal: 1, startRow: 4, endRow: 4, cellRefs: ['A4'], nonEmptyCellCount: 1 }], contentInventory: { substantiveNonCellContentMayExist: false, exceptionCode: null } }] },
  chunks: { sourceId: source.sourceId, chunks: [{ chunkId: 'fixture-chunk', sourceId: source.sourceId, sourceSha256: source.fileHash, pageStart: 1, pageEnd: 1, reviewFlags: [], citations: [{ pageReference: 'p. 1', sourceReference: 'https://example.test/source.pdf' }], extensions: { authoritySupportRole: 'CURRENT SUPPORT — DOWNLOAD', sourceSha256: source.fileHash, tableBlock: { blockOrdinal: 1, startRow: 4, endRow: 4, cellRefs: ['A4'], nonEmptyCellCount: 1 } } }] },
  index: { sourceId: source.sourceId, source: { sourceId: source.sourceId, sourceSha256: source.fileHash, rightsStatus: source.rightsStatus }, chunks: [{ chunkId: 'fixture-chunk', sourceId: source.sourceId, extensions: { authoritySupportRole: 'CURRENT SUPPORT — DOWNLOAD', sourceSha256: source.fileHash } }] },
  retrieval: { candidateId: source.sourceId, tests: [{ testId: 'fixture-test', expectedSourceSha256: source.fileHash, selectedSourceSha256: source.fileHash, expectedAuthorityRole: 'CURRENT SUPPORT — DOWNLOAD', selectedAuthorityRole: 'CURRENT SUPPORT — DOWNLOAD', expectedWorkbookEvidence: { sheetName: '2026 Jumbo Rates', worksheetPath: 'xl/worksheets/sheet1.xml', cellRef: 'A4', expectedStoredValue: 46023, expectedFormula: "'[1]Jumbo Bus Date to PDD'!H5", selectedStoredValue: 46023, selectedFormula: "'[1]Jumbo Bus Date to PDD'!H5", sourceSha256: source.fileHash, expectedAuthoritySupportRole: 'CURRENT SUPPORT — DOWNLOAD', citationCoordinate: 'Worksheet 2026 Jumbo Rates, cell A4' } }] }
}
validateRightsState(positive)
console.log('Passed rights-storage fixtures: allowlisted evidence positive; duplicateLabelValues/titleCandidates and unexpected nested content negatives; Git text leakage, missing external artifact, bad external hash, and omitted rights status.')
