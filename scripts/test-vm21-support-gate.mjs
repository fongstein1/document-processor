import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { assessFormalRequirementEvidenceSufficiency } from './formal-requirement-evidence-sufficiency.mjs'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const sourceRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources')
const outputPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm21-support-gate-regression.json')
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }

const main = async () => {
  const [vm21Package, vm20Package, vm30Package] = await Promise.all([
    readJson(path.join(sourceRoot, 'vm21-current-manual.json')),
    readJson(path.join(sourceRoot, 'vm20-canonical-coverage.json')),
    readJson(path.join(sourceRoot, 'vm30-current-manual.json')),
  ])
  const flatten = (sourcePackage) => sourcePackage.chunks.map((chunk) => ({ ...chunk, sourceId: sourcePackage.source.sourceId, sourceTitle: sourcePackage.source.sourceTitle, sourceFamilyId: sourcePackage.source.sourceFamilyId, authorityLevel: sourcePackage.source.authorityLevel }))
  const vm21Chunks = flatten(vm21Package)
  const vm20Chunks = flatten(vm20Package)
  const vm30Chunks = flatten(vm30Package)
  const correctVm21 = vm21Chunks.find((chunk) => chunk.chunkId === 'vm21-section-8-scenario-generation-b-interest-rate-generator')
  const wrongTopicVm21 = vm21Chunks.find((chunk) => chunk.chunkId === 'vm21-section-1-background-d-definitions')
  const vm20Method = vm20Chunks.find((chunk) => chunk.chunkId === 'vm20-canonical-coverage-vm20-section4-entry-child-001')
  const vm30Opinion = vm30Chunks.find((chunk) => chunk.chunkId === 'vm30-section-2-a-general-2-appointed-actuary-notice')
  const vm20Stochastic = vm20Chunks.find((chunk) => chunk.chunkId === 'vm20-canonical-coverage-vm20-section5-entry-child-001')
  assert(correctVm21 && wrongTopicVm21 && vm20Method && vm30Opinion && vm20Stochastic, 'VM-21 support-gate fixtures are missing.')
  const chunkRecords = [correctVm21, wrongTopicVm21, vm20Method, vm30Opinion, vm20Stochastic]
  const chunkLookup = new Map(chunkRecords.map((chunk) => [chunk.chunkId, chunk]))
  const sourcePackages = [vm21Package.source, vm20Package.source, vm30Package.source]
  const formalQuery = {
    queryId: 'vm21-support-gate-prescribed-generator',
    query: 'What prescribed interest rate scenario generator does VM-21 require?',
    supportRequirements: { informationTypes: ['formal_requirement'], requiredSourceIds: ['vm21-current-manual'], requiredEvidenceTerms: ['prescribed interest rate scenario generator'] },
  }
  const wrongTopicQuery = {
    queryId: 'vm21-support-gate-quarterly-filing',
    query: 'What quarterly reserve filing does VM-21 require?',
    supportRequirements: { informationTypes: ['formal_requirement'], requiredSourceIds: ['vm21-current-manual'], requiredEvidenceTerms: ['quarterly reserve filing'] },
  }
  const match = (chunk, score) => ({ chunkId: chunk.chunkId, sourceId: chunk.sourceId, sourceFamilyId: chunk.sourceFamilyId, authorityLevel: chunk.authorityLevel, score })
  const rankedEvidence = (matches) => matches.map((item, index) => {
    const chunk = chunkLookup.get(item.chunkId)
    return { rank: index + 1, ...item, sectionReference: chunk?.sectionReference ?? null, pageStart: chunk?.pageStart ?? null, pageEnd: chunk?.pageEnd ?? null, sourceTextType: chunk?.sourceTextType ?? null, sourceTextExcerpt: chunk?.sourceTextExcerpt ?? null }
  })
  const caseSpecs = [
    {
      testId: 'other-manual-methodology-cannot-support-vm21-requirement',
      description: 'Actual VM-20 methodology and VM-30 reporting evidence cannot substitute for requested formal VM-21 authority.',
      query: formalQuery,
      matches: [match(vm20Method, 20), match(vm20Stochastic, 19), match(vm30Opinion, 18)],
      expectedState: 'unsupported', expectedReason: 'missing_requested_formal_requirement_source',
    },
    {
      testId: 'vm21-evidence-at-rank-four-is-outside-production-window',
      description: 'Correct VM-21 evidence at rank 4 remains outside the production evidence window.',
      query: formalQuery,
      matches: [match(vm20Method, 20), match(vm20Stochastic, 19), match(vm30Opinion, 18), match(correctVm21, 17)],
      expectedState: 'unsupported', expectedReason: 'missing_requested_formal_requirement_source',
    },
    {
      testId: 'vm21-evidence-inside-top-three-supports-request',
      description: 'Correct relevant VM-21 evidence inside ranks 1-3 supports the request.',
      query: formalQuery,
      matches: [match(vm20Method, 20), match(correctVm21, 19)],
      expectedState: 'supported', expectedReason: 'retrieved_evidence_matches_requested_information_type',
    },
    {
      testId: 'wrong-topic-vm21-evidence-does-not-support-claim',
      description: 'VM-21 definition evidence cannot support an unrelated invented quarterly filing.',
      query: wrongTopicQuery,
      matches: [match(wrongTopicVm21, 20)],
      expectedState: 'unsupported', expectedReason: 'missing_required_requirement_terms',
    },
  ]
  const cases = caseSpecs.map((spec) => {
    const decision = assessFormalRequirementEvidenceSufficiency({ query: spec.query, topMatches: spec.matches, chunkRecords, sourcePackages })
    const passed = decision.supportState === spec.expectedState && decision.reasonCode === spec.expectedReason
    const fullRanking = rankedEvidence(spec.matches)
    return {
      testId: spec.testId, description: spec.description, query: spec.query.query,
      requestedSourceAuthority: { sourceIds: spec.query.supportRequirements.requiredSourceIds, informationTypes: spec.query.supportRequirements.informationTypes, authorityLevel: 'manual_section' },
      requiredEvidenceTerms: spec.query.supportRequirements.requiredEvidenceTerms ?? [], productionEvidenceWindowSize: 3, fullRanking, productionWindowEvidence: fullRanking.slice(0, 3),
      supportState: decision.supportState, evidenceSufficient: decision.evidenceSufficient, reasonCode: decision.reasonCode,
      expectedSupportState: spec.expectedState, expectedReasonCode: spec.expectedReason, passed,
      assertionFailureMessage: passed ? null : `${spec.testId}: expected ${spec.expectedState}/${spec.expectedReason}, found ${decision.supportState}/${decision.reasonCode}.`, decision,
    }
  })
  const artifact = {
    schemaVersion: '1.0', artifactType: 'formal_requirement_support_gate_regression', status: cases.every((testCase) => testCase.passed) ? 'pass' : 'fail', productionEvidenceWindow: 3,
    genericBoundary: 'A formal VM-21 requirement request requires relevant actual VM-21 source text inside ranks 1-3; other-manual methodology, rank-4 VM-21 evidence, or wrong-topic VM-21 text is insufficient.',
    fixtureSources: [vm21Package.source, vm20Package.source, vm30Package.source].map((source) => ({ sourceId: source.sourceId, sourceFamilyId: source.sourceFamilyId, authorityLevel: source.authorityLevel })),
    caseCount: cases.length, passedCaseCount: cases.filter((testCase) => testCase.passed).length, cases,
    governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false },
  }
  await fs.writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8')
  await fs.writeFile(outputPath.replace(/\.json$/, '.md'), `${['# VM-21 formal-requirement support-gate regression', '', `- Result: **${artifact.status.toUpperCase()}**`, '- Production evidence window: ranks 1-3', `- Cases: ${artifact.passedCaseCount}/${artifact.caseCount} passed`, '', ...cases.map((testCase) => `- \`${testCase.testId}\`: ${testCase.supportState} / ${testCase.reasonCode}; passed ${testCase.passed}`), '', 'This artifact is generated QA evidence, not authoritative regulatory source text.'].join('\n')}\n`, 'utf8')
  for (const testCase of cases) assert(testCase.passed, testCase.assertionFailureMessage)
  console.log(`Passed ${artifact.passedCaseCount}/${artifact.caseCount} VM-21 formal-requirement support-gate regressions.`)
}

main().catch((error) => { console.error(error.message ?? error); process.exitCode = 1 })
