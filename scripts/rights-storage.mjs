import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export const unresolvedRightsStatuses = new Set(['RIGHTS_REVIEW_REQUIRED', 'RIGHTS_EXTERNAL_STORAGE_ONLY'])
export const substantiveArtifactTypes = ['extraction', 'chunk-manifest', 'source-index', 'retrieval-smoke-tests']
const prohibitedKeys = new Set(['sourceTextExcerpt', 'normalizedTextExcerpt', 'normalizedSearchText', 'sourceText', 'text', 'value', 'values', 'formula', 'query', 'queryText', 'goldRationale', 'parentContextText', 'headerText', 'contextPackageText', 'bm25Vocabulary', 'keywords', 'keyPoints', 'concepts', 'definedTerms', 'requirements', 'duplicateLabelValues', 'titleCandidates', 'headingCandidates', 'sectionBoundaryCandidates', 'tableRows', 'tableValues', 'reconstructedTable', 'sourceDerivedText', 'sourceTextArray', 'normalizedTextArray', 'unexpectedContent', 'passage', 'passages', 'embedding', 'embeddings', 'vector', 'vectors', 'queryEmbedding', 'passageEmbedding'])
const safeStringArrayKeys = new Set(['reviewFlags', 'controlledTags', 'mergedRanges', 'cellRefs', 'expectedCellRefs', 'sourceIds', 'top3SourceIds', 'childIds', 'adjacentChildIds', 'requiredEvidenceIds', 'capturedEvidenceIds', 'extraEvidenceIds', 'reviewBatchIds', 'externalArtifactTypes', 'rightsStorageStatuses', 'packageRelevantParts', 'drawingRelationships', 'imageRelationships', 'textBoxShapeIndicators', 'commentNoteIndicators', 'externalLinkIndicators', 'packageExternalLinkIndicators', 'ssapIdentifiers', 'materiallyImproved', 'parentChildImproves', 'baselineImproves', 'ties', 'noDifference', 'performedWorse', 'limitations'])
const safeKeys = new Set([
  'schemaVersion', 'processingRunId', 'extractionRunId', 'batchId', 'runId', 'generatedAt', 'generatedTimestamp', 'processingStatus', 'processingMode', 'processingRepresentation', 'extractionMethod', 'sourceGroups', 'sourceIndexes', 'sourceGroupCount', 'extractedItemCount', 'reviewOnlyItemCount', 'substantiveTextExternal',
  'sourceId', 'candidateId', 'provingGround', 'filename', 'filePath', 'sourcePath', 'sourceFamilyId', 'domainId', 'documentType', 'sourceTitle', 'sourceReference', 'sourceStatus', 'versionDate', 'sourceSha256', 'sourceRawSha256', 'fileHash', 'pageCount', 'reviewBatchIds', 'reviewIndexPath', 'selfReviewPath', 'pageImageBackstop', 'lineReferencesAvailable', 'textLayerQuality', 'rightsStatus', 'authorityLevel', 'authoritySupportRole', 'externalArtifactManifestPath', 'externalArtifactTypes', 'externalArtifactPath', 'externalArtifactSha256', 'externalArtifactByteCount', 'structureDetectionCoverage', 'sourceCount', 'pdfSourceCount', 'xlsxSourceCount', 'structureAwareSourceCount', 'fallbackSourceCount', 'parentCount', 'childCount', 'fallbackUnitCount',
  'pages', 'pageNumber', 'classification', 'contentStreamBytes', 'imageXObjects', 'formXObjects', 'annotationCount', 'acroFormFieldCount', 'vectorOperatorCount', 'embeddedObjectCount', 'renderedOccupancy', 'emptyPageDetails', 'structureSignals', 'headingCandidateCount', 'ssapIdentifiers', 'sectionBoundaryCount', 'semanticHierarchyDetected', 'parentChildGrouping',
  'sheets', 'name', 'worksheetPath', 'state', 'hiddenState', 'cellContentCount', 'formulaCount', 'mergedRanges', 'tableBlocks', 'blankSpacerRows', 'packageRelevantParts', 'contentInventory', 'drawingRelationships', 'imageRelationships', 'textBoxShapeIndicators', 'commentNoteIndicators', 'externalLinkIndicators', 'packageExternalLinkIndicators', 'otherRelationships', 'id', 'type', 'target', 'targetMode', 'substantiveNonCellContentMayExist', 'exceptionCode',
  'chunkManifestId', 'chunks', 'chunkCount', 'reviewOnlyChunkCount', 'chunkOrdinal', 'chunkId', 'childId', 'childIds', 'childOrdinal', 'goldEvidenceHash', 'evidenceContentHash', 'expectedOriginalChildId', 'requiredMode', 'chunkKind', 'sourceTextType', 'pageStart', 'pageEnd', 'sectionReference', 'lineReference', 'fidelity', 'confidence', 'reviewFlags', 'controlledTags', 'citations', 'citation', 'citationText', 'pageReference', 'sectionReference', 'canonicalSourceIndexPath', 'retrievalEligible', 'promotionEligible', 'extensions', 'worksheet', 'sheetState', 'tableBlock', 'blockOrdinal', 'startRow', 'endRow', 'rowCount', 'cellRefs', 'nonEmptyCellCount', 'authoritySupportRole', 'parentId', 'parentType', 'hierarchyLevel', 'structuralType', 'structuralLabel', 'structuralIdentifier', 'sheetName', 'worksheetOrder', 'semanticRole', 'roleConfidence', 'roleDetectionMethod', 'processingRepresentation', 'contentHash', 'headerContextExternal', 'selectedSourceSha256', 'expectedSourceSha256', 'selectedRoleMatches', 'childBm25', 'parentBm25', 'rerankComponents', 'finalScore', 'queryNeed', 'sourceOrder', 'childOnlySufficient', 'parentExpansionRequired', 'adjacentExpansionRequired', 'parentContext', 'precedingChild', 'followingChild', 'sourceChunkOrdinal', 'confidence', 'detectionMethod', 'sourceChunkId', 'sourceTextExternal', 'externalArtifactPath', 'externalArtifactSha256', 'externalArtifactByteCount',
  'sourceIndexId', 'repositoryManifestId', 'sourceVersionId', 'source', 'sources', 'processing', 'createdAt', 'createdBy', 'canonicality', 'reviewOnly', 'learnerFacingAllowed', 'appReadyAllowed', 'ragReadyAllowed', 'promotionStatus', 'quality', 'citationCompleteness', 'exportHints', 'jsonlEligible', 'csvEligible', 'vectorEligible', 'acquisitionCandidateId', 'rawSourcePath', 'rawSourceSha256', 'issuer', 'sourceUrl', 'acquisitionManifestPath', 'structuredEvidence', 'structuredEvidenceId', 'manifestId', 'artifacts', 'artifactType', 'packages', 'packageId', 'externalPath', 'byteCount', 'sha256', 'rightsStorageStatus', 'rightsStorageStatuses', 'externalProcessingRoot', 'evaluationFreeze', 'developmentCaseCount', 'holdoutCaseCount', 'goldCorrections', 'frozenAt', 'goldEvidenceHash', 'rankingInputExcludesExpectations', 'development', 'holdout', 'systems', 'passes', 'name',
  'tests', 'allPassed', 'testId', 'testKind', 'expectedCandidateId', 'negativeAgainstCandidateId', 'expectedMatch', 'expectedRankThreshold', 'expectedStructuralRegion', 'expectedSheet', 'expectedCellRefs', 'expectedSourceSha256', 'expectedAuthorityRole', 'expectedWorkbookEvidence', 'sheetName', 'cellRef', 'expectedStoredValue', 'expectedFormula', 'selectedStoredValue', 'selectedFormula', 'sourceSha256', 'expectedAuthoritySupportRole', 'citationCoordinate', 'topRank', 'topChunkId', 'topSourceId', 'topScore', 'selectedSourceSha256', 'selectedChunkSourceSha256', 'selectedAuthorityRole', 'citationTarget', 'citationResolves', 'shaMatches', 'lineageMatches', 'supportRolePreserved', 'roleMatches', 'structuralMatch', 'workbookEvidenceMatch', 'wrongSourceExcluded', 'pass', 'summary', 'sourceCount', 'passedSourceCount', 'testCount', 'sourceIds', 'parents', 'children', 'parentId', 'contexts', 'contextId', 'evaluationCaseId', 'selectedChildId', 'parentContextId', 'precedingChildId', 'followingChildId', 'expansionReason', 'contextTextExternal', 'contextSize', 'requiredEvidenceIds', 'capturedEvidenceIds', 'extraEvidenceIds', 'requiredEvidenceCaptured', 'irrelevantEvidenceCount', 'contextPrecision', 'contextRecall', 'parentContextExternal', 'boundedContextExternal', 'retrievalScore', 'rerankScore', 'childLexicalScore', 'rerankAdjustment', 'finalRerankScore', 'childTargetRank', 'baselineLexicalScore', 'baselineTargetRank', 'targetMrrContribution', 'sourceTop1Correct', 'sourceTop3Correct', 'targetTop1Correct', 'targetTop3Correct', 'correctSource', 'correctChild', 'correctParent', 'childTop3Correct', 'architecture', 'pdfParentCount', 'xlsxParentCount', 'pdfChildCount', 'xlsxChildCount', 'maximumContextSize', 'contextCount', 'boundedContextMaximum', 'evaluationMode', 'rankingInputExcludesTestExpectations', 'cases', 'caseId', 'category', 'expectedSourceId', 'expectedRole', 'expectedBaselineChunkId', 'expectedChildId', 'expectedParentId', 'baseline', 'parentChild', 'top1SourceId', 'top1ChunkId', 'top3SourceIds', 'top1Correct', 'top3Correct', 'rank', 'selectedChildId', 'selectedSourceId', 'selectedRole', 'selectedParentId', 'retrievalScore', 'rerankScore', 'correctParentRate', 'requiredContextRate', 'wrongSourceRate', 'authoritySupportCorrectness', 'citationCorrectness', 'averageContextSize', 'unrelatedContextRate', 'requiredContextRecall', 'contextPrecision', 'wrongSectionRate', 'targetTop1', 'targetTop3', 'targetMrr', 'sourceTop1', 'sourceTop3', 'irrelevantEvidenceCount', 'metrics', 'examples', 'materiallyImproved', 'baselineImproves', 'parentChildImproves', 'ties', 'noDifference', 'performedWorse', 'improvements', 'limitations', 'reviewOnly', 'promotionStatus', 'ragReadyAllowed', 'sourceRecords', 'sourceIds'
])

for (const key of ['childParentIds', 'sourceChunkIds', 'goldUnitIds', 'evidenceContentHashes', 'acceptedSourceChunkIds', 'requiredContextRoles', 'acceptedTargetIds', 'acceptedParentIds', 'requiredRoles', 'contextEvidenceIds', 'mergedRangeIntersections']) safeStringArrayKeys.add(key)
for (const key of ['requiredEvidenceIds']) safeStringArrayKeys.add(key)
for (const key of [
  'evaluationVersion', 'createdBecauseCode', 'sourceEvaluationVersion', 'sourceEvaluationPath', 'sourceEvaluationSha256', 'originalCaseCount', 'uniqueTargetCaseCount', 'multiAcceptedTargetCaseCount', 'multiUnitRequiredCaseCount', 'ambiguousExcludedCaseCount', 'invalidExcludedCaseCount', 'privateAdjudicationPath', 'privateAdjudicationSha256', 'privateAdjudicationByteCount', 'finalGoldSelectionUsesRegex', 'split', 'queryHash', 'goldUnitIds', 'evidenceContentHashes', 'acceptedSourceChunkIds', 'targetCoordinates', 'targetRole', 'requiredContextRoles', 'adjudicationStatus', 'included', 'reviewerStatus', 'queryExternal', 'rationaleExternal', 'evaluations', 'path', 'preserved', 'reasonCode',
  'supportedCaseCount', 'unsupportedCaseCount', 'sourceCounts', 'categoryCounts', 'modalityCounts', 'adjudicationCounts', 'modality', 'frozenRetrievalConfigPath', 'frozenRetrievalConfigSha256', 'retrievalConfigurationUnchanged',
  'goldFreezeCommit', 'rankingInputExcludesAcceptedTargets', 'retrievalConfigSha256', 'indexByteCount', 'medianTargetRank', 'dimension', 'sliceValue', 'targetType', 'slices', 'minimum', 'p10', 'p25', 'p75', 'p90', 'mean', 'margin', 'top1Top2Margin', 'thresholdSelected', 'thresholdDecision', 'NO_THRESHOLD_SELECTED', 'goldV1Unchanged', 'goldV3UnchangedAfterFreeze', 'conclusionCode', 'nextRetrievalAction', 'ARCHITECTURE_HARDENING',
  'parentParentId', 'childParentIds', 'colStart', 'colEnd', 'mergedRangeIntersections', 'formulaCellCount', 'valueCellCount', 'headerContextId', 'parentContextId', 'parentContextRole', 'sourceChunkIds', 'paragraphCount', 'textExternal', 'headerContexts', 'headerContextCount', 'nestedParentCount', 'parentsByHierarchyLevel', 'childRepresentations', 'semanticChildCount', 'structuralPageWindowChildCount', 'role', 'bounded', 'pdfChildTokenSize', 'average', 'median', 'maximum', 'xlsxTableParentCount', 'xlsxSingleChildParentCount', 'xlsxMultiChildParentCount', 'xlsxAverageChildrenPerParent', 'xlsxMedianChildrenPerParent', 'xlsxMaximumChildrenPerParent', 'xlsxNonEmptyCellCount', 'xlsxFormulaCellCount', 'xlsxValueCellCount',
  'expectedSourceId', 'acceptedTargetIds', 'acceptedParentIds', 'selectedRankScore', 'targetRank', 'sourceTop5', 'acceptedTop1', 'acceptedTop3', 'acceptedTop5', 'acceptedTop10', 'acceptedMrr', 'exactChildEligible', 'exactChildTop1', 'exactParent', 'wrongSource', 'wrongSection', 'citationCoordinateValidity', 'targetCitationCorrectness', 'requiredRoles', 'requiredRoleRecall', 'acceptedEvidenceRecall', 'completeContext', 'contextEvidenceIds', 'queryIntent', 'contextBounded', 'combined', 'acceptedTargetTop1', 'acceptedTargetTop3', 'acceptedTargetTop5', 'acceptedTargetTop10', 'acceptedTargetMrr', 'exactParentRate', 'completeContextRate', 'bm25ParametersUnchanged', 'k1', 'b', 'excludedCaseCount', 'noAcquisition', 'noVectorRetrieval', 'systemId', 'A_OLD_PAGE_WINDOW_BM25', 'B_OLD_SEMANTIC_44D96FF_BM25', 'C_CORRECTED_SEMANTIC_BM25', 'D_CORRECTED_PARENT_RERANK', 'E_ROLE_AWARE_CONTEXT',
  'startingSha', 'sourceBranch', 'protocolFrozenAt', 'protocolCommit', 'configuration', 'embeddingModel', 'embeddingRevision', 'embeddingLicense', 'embeddingSourceUrl', 'modelSnapshotSha256', 'modelSnapshotByteCount', 'runtime', 'pythonVersion', 'torchVersion', 'transformersVersion', 'numpyVersion', 'platform', 'deterministicAlgorithms', 'device', 'inferencePrecision', 'pooling', 'prefixes', 'passagePrefix', 'queryPrefix', 'maxSequenceLength', 'normalization', 'vectorDimension', 'vectorCount', 'queryVectorCount', 'vectorDtype', 'exactVectorSearch', 'bruteForce', 'localOnly', 'hostedApisUsed', 'bm25', 'fieldWeights', 'body', 'section', 'identifier', 'parentHeading', 'sourceTitle', 'header', 'fusion', 'method', 'rrfK', 'bm25Weight', 'vectorWeight', 'parentRrfWeight', 'candidateDepth', 'tieBreak', 'context', 'maximumAddedEvidence', 'sameParentOnly', 'goldFreezeSha256', 'goldUnchanged', 'noHoldoutTuning', 'developmentCaseCount', 'holdoutCaseCount', 'rankingInputExcludesGold', 'rankingInputManifestSha256', 'passageManifestSha256', 'queryManifestSha256', 'documentVectorSha256', 'queryVectorSha256', 'indexSha256', 'determinismSha256', 'determinismPassed', 'normMaximumDeviation', 'privateArtifactByteCount', 'privateSubstantiveArtifactByteCount', 'runtimeEnvironmentByteCount', 'modelByteCount', 'artifactCount', 'aggregateSha256', 'provenance', 'evaluation', 'sourceSlices', 'unsupportedDiagnostics', 'diagnostics', 'diagnosticStatus', 'diagnosticCaseCount', 'ambiguousCaseCount', 'invalidTargetCaseCount', 'scoreMaximum', 'scoreMean', 'top1Top2MarginMean', 'top1Top2MarginMinimum', 'a3', 'xlsx', 'includedCaseCount', 'diagnosticOnlyCaseCount', 'evaluable', 'reason', 'regressions', 'commitCount', 'cleanWorkingTree', 'remoteAligned', 'maturityLevel', 'nextStep', 'outcome', 'limitations', 'noNewSources', 'canonicalCorporaUnchanged', 'rawSourceBytesUnchanged', 'goldV2Unchanged', 'noAnswerGeneration', 'noProductionRag', 'noLearnerFacingOutput', 'noHostedModels', 'embeddingInputsExternal', 'vectorsExternal', 'queriesExternal', 'goldRationaleExternal', 'license', 'revision', 'model', 'hashes', 'byteCounts', 'generatedFrom', 'EVALUATION_V2', 'BM25', 'VECTOR', 'HYBRID_RRF', 'HYBRID_RRF_PARENT', 'HYBRID_RRF_PARENT_CONTEXT'
]) safeKeys.add(key)

export const sha256Bytes = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const containsNonEmptyString = (value) => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.some(containsNonEmptyString)
  if (value && typeof value === 'object') return Object.values(value).some(containsNonEmptyString)
  return false
}
const containsAnyContent = (value) => {
  if (value === null || value === undefined || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}
const scanGitSafeValue = (value, key, location, errors) => {
  if (prohibitedKeys.has(key) && containsAnyContent(value)) errors.push(location + ' uses prohibited content-bearing key ' + key)
  if (Array.isArray(value)) {
    if (value.some((item) => typeof item === 'string' && item.trim()) && !safeStringArrayKeys.has(key)) errors.push(location + ' contains an unbounded source-derived string array')
    value.forEach((item, index) => scanGitSafeValue(item, key, location + '[' + index + ']', errors))
    return
  }
  if (value && typeof value === 'object') {
    for (const [childKey, childValue] of Object.entries(value)) {
      if (!safeKeys.has(childKey) && containsNonEmptyString(childValue)) errors.push(location + '.' + childKey + ' is an unexpected content-bearing field')
      scanGitSafeValue(childValue, childKey, location + '.' + childKey, errors)
    }
  }
}
export const validateGitSafeArtifact = ({ artifactType, value }) => {
  const errors = []
  scanGitSafeValue(value, '', artifactType || 'artifact', errors)
  if (errors.length) throw new Error('Git-safe evidence schema violation: ' + errors[0])
  return true
}
export const hasSubstantiveContent = (value, key = '') => {
  try { validateGitSafeArtifact({ artifactType: key || 'artifact', value }); return false } catch { return true }
}

export const validateRightsState = ({ policy, repoRoot, batch, repoArtifacts, externalArtifacts, externalFiles }) => {
  const statuses = new Set(policy.statuses)
  if (!statuses.has(policy.defaultStatus)) throw new Error('Rights policy default status is invalid.')
  if ((batch.sourceFiles || []).some((source) => !source.rightsStatus || !statuses.has(source.rightsStatus))) throw new Error('Rights status omitted or invalid for a batch source.')
  const requiredSources = (batch.sourceFiles || []).filter((source) => unresolvedRightsStatuses.has(source.rightsStatus))
  if (!requiredSources.length) throw new Error('No rights-controlled sources were supplied.')
  const repoArtifactValues = repoArtifacts || {}
  for (const [artifactType, document] of Object.entries(repoArtifactValues)) {
    validateGitSafeArtifact({ artifactType, value: document })
  }
  const records = externalArtifacts || []
  for (const source of requiredSources) {
    if (!unresolvedRightsStatuses.has(source.rightsStatus)) throw new Error('Rights status omitted for ' + source.sourceId)
    for (const artifactType of substantiveArtifactTypes) {
      const record = records.find((item) => item.sourceId === source.sourceId && item.artifactType === artifactType)
      if (!record) throw new Error('Missing external artifact manifest record: ' + source.sourceId + '/' + artifactType)
      if (record.rightsStorageStatus !== source.rightsStatus || record.reviewOnly !== true) throw new Error('External artifact rights metadata is invalid: ' + source.sourceId + '/' + artifactType)
      const absolute = path.resolve(record.externalPath)
      const relativeToRepo = path.relative(path.resolve(repoRoot), absolute)
      if (!relativeToRepo || (!relativeToRepo.startsWith('..' + path.sep) && relativeToRepo !== '..' && !path.isAbsolute(relativeToRepo))) throw new Error('External artifact is inside the Git repository: ' + record.externalPath)
      const bytes = externalFiles?.get(record.externalPath) ?? externalFiles?.get(absolute)
      if (bytes === undefined) throw new Error('External artifact is missing: ' + record.externalPath)
      const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(String(bytes), 'utf8')
      if (record.sha256 !== sha256Bytes(buffer) || record.byteCount !== buffer.length) throw new Error('External artifact hash/byte count mismatch: ' + record.externalPath)
      if (record.sourceRawSha256 !== source.fileHash) throw new Error('External artifact raw-source lineage mismatch: ' + record.externalPath)
    }
  }
  return { controlledSourceCount: requiredSources.length, externalArtifactCount: records.length, prohibitedGitContent: false }
}

export const validateRightsFilesystem = async ({ policy, repoRoot, outputRoot }) => {
  const readJson = async (name) => JSON.parse(await fs.readFile(path.join(outputRoot, name), 'utf8'))
  const batch = await readJson('batch-manifest.json')
  const manifest = await readJson('external-artifact-manifest.json')
  const repoArtifacts = {}
  for (const name of ['extraction-output.json', 'chunk-manifest.json', 'source-index-candidates.json', 'retrieval-smoke-tests.json']) repoArtifacts[name] = await readJson(name)
  const externalFiles = new Map()
  for (const item of manifest.artifacts || []) externalFiles.set(item.externalPath, await fs.readFile(item.externalPath))
  return validateRightsState({ policy, repoRoot, batch, repoArtifacts, externalArtifacts: manifest.artifacts, externalFiles })
}

export const validateParentChildRightsState = ({ repoRoot, publicArtifacts, externalArtifacts, externalFiles, sourceRecords }) => {
  for (const [artifactType, document] of Object.entries(publicArtifacts || {})) {
    validateGitSafeArtifact({ artifactType, value: document })
  }
  const records = externalArtifacts || []
  const sources = sourceRecords || []
  if (!sources.length) throw new Error('No parent-child source records were supplied.')
  for (const record of records) {
    if (!record.externalPath || !record.sha256 || !Number.isInteger(record.byteCount) || record.reviewOnly !== true) throw new Error('Parent-child external artifact manifest record is incomplete.')
    const absolute = path.resolve(record.externalPath)
    const relativeToRepo = path.relative(path.resolve(repoRoot), absolute)
    if (!relativeToRepo || (!relativeToRepo.startsWith('..' + path.sep) && relativeToRepo !== '..' && !path.isAbsolute(relativeToRepo))) throw new Error('Parent-child external artifact is inside the Git repository: ' + record.externalPath)
    const bytes = externalFiles?.get(record.externalPath) ?? externalFiles?.get(absolute)
    if (bytes === undefined) throw new Error('Parent-child external artifact is missing: ' + record.externalPath)
    const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(String(bytes), 'utf8')
    if (record.sha256 !== sha256Bytes(buffer) || record.byteCount !== buffer.length) throw new Error('Parent-child external artifact hash/byte count mismatch: ' + record.externalPath)
  }
  for (const source of sources) {
    if (!unresolvedRightsStatuses.has(source.rightsStatus)) throw new Error('Parent-child rights status is not unresolved: ' + source.sourceId)
    const record = records.find((item) => item.sourceId === source.sourceId && item.artifactType === 'parent-child-substantive')
    if (!record) throw new Error('Missing parent-child external artifact manifest record: ' + source.sourceId)
    if (record.rightsStorageStatus !== source.rightsStatus || record.reviewOnly !== true) throw new Error('Parent-child external artifact rights metadata is invalid: ' + source.sourceId)
    if (record.sourceRawSha256 !== source.sourceSha256) throw new Error('Parent-child raw-source lineage mismatch: ' + record.externalPath)
  }
  return { controlledSourceCount: sources.length, externalArtifactCount: records.length, prohibitedGitContent: false }
}
