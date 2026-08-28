import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { assessFormalRequirementEvidenceSufficiency } from './formal-requirement-evidence-sufficiency.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const sourceRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources')
const outputPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm30-support-gate-regression.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }

const main = async () => {
  const [vm30Package, vm20Package] = await Promise.all([
    readJson(path.join(sourceRoot, 'vm30-current-manual.json')),
    readJson(path.join(sourceRoot, 'vm20-canonical-coverage.json')),
  ])
  const flatten = (sourcePackage) => sourcePackage.chunks.map((chunk) => ({
    ...chunk,
    sourceId: sourcePackage.source.sourceId,
    sourceTitle: sourcePackage.source.sourceTitle,
    sourceFamilyId: sourcePackage.source.sourceFamilyId,
    authorityLevel: sourcePackage.source.authorityLevel,
  }))
  const vm30Chunks = flatten(vm30Package)
  const vm20Chunks = flatten(vm20Package)
  const formalVm30Chunk = vm30Chunks.find((chunk) => chunk.chunkId === 'vm30-section-2-a-general-2-appointed-actuary-notice')
  const wrongTopicVm30Chunk = vm30Chunks.find((chunk) => chunk.chunkId === 'vm30-section-1-b-definitions-1-adverse-opinion')
  const vm20DeterministicChunk = vm20Chunks.find((chunk) => chunk.chunkId === 'vm20-canonical-coverage-vm20-section4-entry-child-001')
  const vm20StochasticChunk = vm20Chunks.find((chunk) => chunk.chunkId === 'vm20-canonical-coverage-vm20-section5-entry-child-001')
  const vm20ExclusionChunk = vm20Chunks.find((chunk) => chunk.chunkId === 'vm20-canonical-coverage-vm20-section6-exclusion-tests-child-002')
  assert(formalVm30Chunk && wrongTopicVm30Chunk && vm20DeterministicChunk && vm20StochasticChunk && vm20ExclusionChunk, 'VM-30 support-gate fixtures are missing.')
  const chunkRecords = [formalVm30Chunk, wrongTopicVm30Chunk, vm20DeterministicChunk, vm20StochasticChunk, vm20ExclusionChunk]
  const chunkLookup = new Map(chunkRecords.map((chunk) => [chunk.chunkId, chunk]))
  const sourcePackages = [vm30Package.source, vm20Package.source]
  const noticeQuery = {
    queryId: 'vm30-support-gate-appointed-actuary-notice',
    query: 'What does VM-30 require for notice of the appointed actuary?',
    supportRequirements: {
      informationTypes: ['formal_requirement'],
      requiredSourceIds: ['vm30-current-manual'],
    },
  }
  const vm20SubstitutionQuery = {
    queryId: 'vm30-support-gate-vm20-methodology-substitution',
    query: 'What does VM-30 require for the deterministic reserve methodology?',
    supportRequirements: {
      informationTypes: ['formal_requirement'],
      requiredSourceIds: ['vm30-current-manual'],
      requiredEvidenceTerms: ['deterministic reserve methodology'],
    },
  }
  const wrongTopicQuery = {
    ...noticeQuery,
    queryId: 'vm30-support-gate-wrong-topic',
    query: 'What quarterly update to the appointed-actuary notice does VM-30 require?',
    supportRequirements: { ...noticeQuery.supportRequirements, requiredEvidenceTerms: ['quarterly update'] },
  }
  const match = (chunk, score) => ({ chunkId: chunk.chunkId, sourceId: chunk.sourceId, sourceFamilyId: chunk.sourceFamilyId, authorityLevel: chunk.authorityLevel, score })
  const rankedEvidence = (matches) => matches.map((item, index) => {
    const chunk = chunkLookup.get(item.chunkId)
    return {
      rank: index + 1,
      chunkId: item.chunkId,
      sourceId: item.sourceId,
      sourceFamilyId: item.sourceFamilyId,
      authorityLevel: item.authorityLevel,
      score: item.score,
      sectionReference: chunk?.sectionReference ?? null,
      topic: chunk?.topic ?? null,
      pageStart: chunk?.pageStart ?? null,
      pageEnd: chunk?.pageEnd ?? null,
      sourceTextType: chunk?.sourceTextType ?? null,
      sourceTextExcerpt: chunk?.sourceTextExcerpt ?? null,
    }
  })
  const caseSpecs = [
    {
      testId: 'vm20-methodology-alone-cannot-support-vm30-requirement',
      description: 'Actual VM-20 reserve-methodology evidence cannot substitute for requested formal VM-30 authority.',
      intendedBoundary: 'Ranks 1-3 contain related VM-20 methodology and no VM-30 source evidence.',
      query: vm20SubstitutionQuery,
      matches: [match(vm20DeterministicChunk, 20), match(vm20StochasticChunk, 19), match(vm20ExclusionChunk, 18)],
      expectedState: 'unsupported',
      expectedReason: 'missing_requested_formal_requirement_source',
    },
    {
      testId: 'vm30-evidence-at-rank-four-is-outside-production-window',
      description: 'Correct requested VM-30 evidence at rank 4 remains outside the production evidence window.',
      intendedBoundary: 'Ranks 1-3 contain no VM-30 evidence; the correct VM-30 notice provision is visibly supplied at rank 4.',
      query: noticeQuery,
      matches: [match(vm20DeterministicChunk, 20), match(vm20StochasticChunk, 19), match(vm20ExclusionChunk, 18), match(formalVm30Chunk, 17)],
      expectedState: 'unsupported',
      expectedReason: 'missing_requested_formal_requirement_source',
    },
    {
      testId: 'vm30-source-evidence-inside-top-three-supports-request',
      description: 'Correct requested VM-30 evidence inside ranks 1-3 may support the formal-requirement request.',
      intendedBoundary: 'The correct VM-30 notice provision is supplied at rank 2 inside the production evidence window.',
      query: noticeQuery,
      matches: [match(vm20DeterministicChunk, 20), match(formalVm30Chunk, 19)],
      expectedState: 'supported',
      expectedReason: 'retrieved_evidence_matches_requested_information_type',
    },
    {
      testId: 'vm30-source-without-requested-topic-does-not-support-claim',
      description: 'VM-30 source evidence from the wrong topic cannot support an unrelated formal requirement.',
      intendedBoundary: 'The supplied VM-30 definition does not contain the requested quarterly-update topic.',
      query: wrongTopicQuery,
      matches: [match(wrongTopicVm30Chunk, 20)],
      expectedState: 'unsupported',
      expectedReason: 'missing_required_requirement_terms',
    },
  ]
  const cases = caseSpecs.map((spec) => {
    const decision = assessFormalRequirementEvidenceSufficiency({ query: spec.query, topMatches: spec.matches, chunkRecords, sourcePackages })
    const passed = decision.supportState === spec.expectedState && decision.reasonCode === spec.expectedReason
    const assertionFailureMessage = passed ? null : `${spec.testId}: expected ${spec.expectedState}/${spec.expectedReason}, found ${decision.supportState}/${decision.reasonCode}.`
    const fullRanking = rankedEvidence(spec.matches)
    return {
      testId: spec.testId,
      description: spec.description,
      intendedBoundary: spec.intendedBoundary,
      query: spec.query.query,
      requestedSourceAuthority: {
        sourceIds: spec.query.supportRequirements.requiredSourceIds,
        informationTypes: spec.query.supportRequirements.informationTypes,
        authorityLevel: 'manual_section',
      },
      requiredEvidenceTerms: spec.query.supportRequirements.requiredEvidenceTerms ?? [],
      productionEvidenceWindowSize: 3,
      fullRanking,
      productionWindowEvidence: fullRanking.slice(0, 3),
      supportState: decision.supportState,
      evidenceSufficient: decision.evidenceSufficient,
      reasonCode: decision.reasonCode,
      expectedSupportState: spec.expectedState,
      expectedReasonCode: spec.expectedReason,
      passed,
      assertionFailureMessage,
      decision,
    }
  })
  const allPassed = cases.every((testCase) => testCase.passed)
  const artifact = {
    schemaVersion: '1.0',
    artifactType: 'formal_requirement_support_gate_regression',
    status: allPassed ? 'pass' : 'fail',
    productionEvidenceWindow: 3,
    genericBoundary: 'A formal VM-30 requirement request requires relevant actual VM-30 source text inside ranks 1-3; related VM-20 methodology, rank-4 VM-30 evidence, or wrong-topic VM-30 text is insufficient.',
    fixtureSources: [
      { sourceId: vm30Package.source.sourceId, sourceFamilyId: vm30Package.source.sourceFamilyId, authorityLevel: vm30Package.source.authorityLevel },
      { sourceId: vm20Package.source.sourceId, sourceFamilyId: vm20Package.source.sourceFamilyId, authorityLevel: vm20Package.source.authorityLevel },
    ],
    caseCount: cases.length,
    passedCaseCount: cases.filter((testCase) => testCase.passed).length,
    cases,
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false },
  }
  await fs.writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8')
  await fs.writeFile(outputPath.replace(/\.json$/, '.md'), `${[
    '# VM-30 formal-requirement support-gate regression', '',
    `- Result: **${artifact.status.toUpperCase()}**`,
    '- Production evidence window: ranks 1-3',
    '- Boundary: VM-20 methodology cannot substitute for actual relevant VM-30 requirement evidence.',
    `- Cases: ${artifact.passedCaseCount}/${artifact.caseCount} passed`, '',
    ...cases.map((testCase) => `- \`${testCase.testId}\`: ${testCase.supportState} / ${testCase.reasonCode}; full ranking ${testCase.fullRanking.length}, passed ${testCase.passed}`), '',
    'This artifact is generated QA evidence, not authoritative regulatory source text.',
  ].join('\n')}\n`, 'utf8')
  for (const testCase of cases) assert(testCase.passed, testCase.assertionFailureMessage)
  console.log(`Passed ${artifact.passedCaseCount}/${artifact.caseCount} VM-30 formal-requirement support-gate regressions.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
