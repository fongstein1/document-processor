import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { assessFormalRequirementEvidenceSufficiency } from './formal-requirement-evidence-sufficiency.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const sourceRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources')
const outputPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm31-support-gate-regression.json')

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }

const main = async () => {
  const [vm31Package, vm20Package] = await Promise.all([
    readJson(path.join(sourceRoot, 'vm31-current-manual.json')),
    readJson(path.join(sourceRoot, 'vm20-canonical-coverage.json')),
  ])
  const flatten = (sourcePackage) => sourcePackage.chunks.map((chunk) => ({
    ...chunk,
    sourceId: sourcePackage.source.sourceId,
    sourceTitle: sourcePackage.source.sourceTitle,
    sourceFamilyId: sourcePackage.source.sourceFamilyId,
    authorityLevel: sourcePackage.source.authorityLevel,
  }))
  const vm31Chunks = flatten(vm31Package)
  const vm20Chunks = flatten(vm20Package)
  const formalVm31Chunk = vm31Chunks.find((chunk) => chunk.chunkId === 'vm31-section-2-general-requirements-c-submission-timing')
  const vm20MethodChunk = vm20Chunks.find((chunk) => chunk.retrievalEligible)
  assert(formalVm31Chunk && vm20MethodChunk, 'Support-gate fixtures are missing.')
  const chunkRecords = [formalVm31Chunk, vm20MethodChunk]
  const sourcePackages = [vm31Package.source, vm20Package.source]
  const query = {
    queryId: 'vm31-support-gate-vm20-substitution',
    query: 'What does VM-31 require for submitting the PBR Actuarial Report?',
    supportRequirements: {
      informationTypes: ['formal_requirement'],
      requiredSourceIds: ['vm31-current-manual'],
    },
  }
  const match = (chunk, score) => ({ chunkId: chunk.chunkId, sourceId: chunk.sourceId, sourceFamilyId: chunk.sourceFamilyId, authorityLevel: chunk.authorityLevel, score })
  const cases = [
    {
      caseId: 'vm20-methodology-alone-cannot-support-vm31-requirement',
      decision: assessFormalRequirementEvidenceSufficiency({ query, topMatches: [match(vm20MethodChunk, 20)], chunkRecords, sourcePackages }),
      expectedState: 'unsupported',
      expectedReason: 'missing_requested_formal_requirement_source',
    },
    {
      caseId: 'vm31-evidence-at-rank-four-is-outside-production-window',
      decision: assessFormalRequirementEvidenceSufficiency({ query, topMatches: [match(vm20MethodChunk, 20), match(vm20MethodChunk, 19), match(vm20MethodChunk, 18), match(formalVm31Chunk, 17)], chunkRecords, sourcePackages }),
      expectedState: 'unsupported',
      expectedReason: 'missing_requested_formal_requirement_source',
    },
    {
      caseId: 'vm31-source-evidence-inside-top-three-supports-request',
      decision: assessFormalRequirementEvidenceSufficiency({ query, topMatches: [match(vm20MethodChunk, 20), match(formalVm31Chunk, 19)], chunkRecords, sourcePackages }),
      expectedState: 'supported',
      expectedReason: 'retrieved_evidence_matches_requested_information_type',
    },
    {
      caseId: 'formal-source-without-requested-topic-does-not-support-claim',
      decision: assessFormalRequirementEvidenceSufficiency({
        query: { ...query, supportRequirements: { ...query.supportRequirements, requiredEvidenceTerms: ['cryptoasset'] } },
        topMatches: [match(formalVm31Chunk, 20)],
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
    genericBoundary: 'A formal requirement request requires actual source text from the requested source inside ranks 1-3; related methodology or companion material is insufficient.',
    cases,
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false },
  }
  await fs.writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8')
  await fs.writeFile(outputPath.replace(/\.json$/, '.md'), `${[
    '# VM-31 formal-requirement support-gate regression', '',
    '- Result: **PASS**',
    '- Production evidence window: ranks 1-3',
    '- Boundary: related VM-20 methodology cannot substitute for actual VM-31 requirement evidence.',
    `- Cases: ${cases.length}/${cases.length} passed`, '',
    ...cases.map((testCase) => `- \`${testCase.caseId}\`: ${testCase.decision.supportState} / ${testCase.decision.reasonCode}`), '',
    'This artifact is generated QA evidence, not authoritative regulatory source text.',
  ].join('\n')}\n`, 'utf8')
  console.log(`Passed ${cases.length} VM-31 formal-requirement support-gate regressions.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
