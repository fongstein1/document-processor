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
  const [vm30Package, vm31Package] = await Promise.all([
    readJson(path.join(sourceRoot, 'vm30-current-manual.json')),
    readJson(path.join(sourceRoot, 'vm31-current-manual.json')),
  ])
  const flatten = (sourcePackage) => sourcePackage.chunks.map((chunk) => ({
    ...chunk,
    sourceId: sourcePackage.source.sourceId,
    sourceTitle: sourcePackage.source.sourceTitle,
    sourceFamilyId: sourcePackage.source.sourceFamilyId,
    authorityLevel: sourcePackage.source.authorityLevel,
  }))
  const vm30Chunks = flatten(vm30Package)
  const vm31Chunks = flatten(vm31Package)
  const formalVm30Chunk = vm30Chunks.find((chunk) => chunk.chunkId === 'vm30-section-2-a-general-2-appointed-actuary-notice')
  const wrongTopicVm30Chunk = vm30Chunks.find((chunk) => chunk.chunkId === 'vm30-section-1-b-definitions-1-adverse-opinion')
  const vm31ReportChunk = vm31Chunks.find((chunk) => chunk.retrievalEligible)
  assert(formalVm30Chunk && wrongTopicVm30Chunk && vm31ReportChunk, 'VM-30 support-gate fixtures are missing.')
  const chunkRecords = [formalVm30Chunk, wrongTopicVm30Chunk, vm31ReportChunk]
  const sourcePackages = [vm30Package.source, vm31Package.source]
  const query = {
    queryId: 'vm30-support-gate-source-boundary',
    query: 'What does VM-30 require for notice of the appointed actuary?',
    supportRequirements: {
      informationTypes: ['formal_requirement'],
      requiredSourceIds: ['vm30-current-manual'],
    },
  }
  const match = (chunk, score) => ({ chunkId: chunk.chunkId, sourceId: chunk.sourceId, sourceFamilyId: chunk.sourceFamilyId, authorityLevel: chunk.authorityLevel, score })
  const cases = [
    {
      caseId: 'vm31-reporting-alone-cannot-support-vm30-requirement',
      decision: assessFormalRequirementEvidenceSufficiency({ query, topMatches: [match(vm31ReportChunk, 20)], chunkRecords, sourcePackages }),
      expectedState: 'unsupported',
      expectedReason: 'missing_requested_formal_requirement_source',
    },
    {
      caseId: 'vm30-evidence-at-rank-four-is-outside-production-window',
      decision: assessFormalRequirementEvidenceSufficiency({ query, topMatches: [match(vm31ReportChunk, 20), match(vm31ReportChunk, 19), match(vm31ReportChunk, 18), match(formalVm30Chunk, 17)], chunkRecords, sourcePackages }),
      expectedState: 'unsupported',
      expectedReason: 'missing_requested_formal_requirement_source',
    },
    {
      caseId: 'vm30-source-evidence-inside-top-three-supports-request',
      decision: assessFormalRequirementEvidenceSufficiency({ query, topMatches: [match(vm31ReportChunk, 20), match(formalVm30Chunk, 19)], chunkRecords, sourcePackages }),
      expectedState: 'supported',
      expectedReason: 'retrieved_evidence_matches_requested_information_type',
    },
    {
      caseId: 'vm30-source-without-requested-topic-does-not-support-claim',
      decision: assessFormalRequirementEvidenceSufficiency({
        query: { ...query, supportRequirements: { ...query.supportRequirements, requiredEvidenceTerms: ['quarterly update'] } },
        topMatches: [match(wrongTopicVm30Chunk, 20)],
        chunkRecords,
        sourcePackages,
      }),
      expectedState: 'unsupported',
      expectedReason: 'missing_required_requirement_terms',
    },
  ]
  for (const testCase of cases) {
    assert(testCase.decision.supportState === testCase.expectedState, `${testCase.caseId}: expected ${testCase.expectedState}, found ${testCase.decision.supportState}.`)
    assert(testCase.decision.reasonCode === testCase.expectedReason, `${testCase.caseId}: expected ${testCase.expectedReason}, found ${testCase.decision.reasonCode}.`)
  }
  const artifact = {
    schemaVersion: '1.0',
    artifactType: 'formal_requirement_support_gate_regression',
    status: 'pass',
    productionEvidenceWindow: 3,
    genericBoundary: 'A formal VM-30 requirement request requires actual VM-30 source text inside ranks 1-3; VM-31 reporting or other related material is insufficient.',
    cases,
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false },
  }
  await fs.writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8')
  await fs.writeFile(outputPath.replace(/\.json$/, '.md'), `${[
    '# VM-30 formal-requirement support-gate regression', '',
    '- Result: **PASS**',
    '- Production evidence window: ranks 1-3',
    '- Boundary: VM-31 reporting or other related material cannot substitute for actual VM-30 requirement evidence.',
    `- Cases: ${cases.length}/${cases.length} passed`, '',
    ...cases.map((testCase) => `- \`${testCase.caseId}\`: ${testCase.decision.supportState} / ${testCase.decision.reasonCode}`), '',
    'This artifact is generated QA evidence, not authoritative regulatory source text.',
  ].join('\n')}\n`, 'utf8')
  console.log(`Passed ${cases.length} VM-30 formal-requirement support-gate regressions.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
