import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { assessFormalRequirementEvidenceSufficiency } from './formal-requirement-evidence-sufficiency.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'sources')
const outputPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm22-support-gate-regression.json')
const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(message) }

const main = async () => {
  const [vm22, vm20, vm30] = await Promise.all(['vm22-current-manual.json', 'vm20-canonical-coverage.json', 'vm30-current-manual.json'].map((file) => readJson(path.join(sourceRoot, file))))
  const flatten = (pkg) => pkg.chunks.map((chunk) => ({ ...chunk, sourceId: pkg.source.sourceId, sourceTitle: pkg.source.sourceTitle, sourceFamilyId: pkg.source.sourceFamilyId, authorityLevel: pkg.source.authorityLevel }))
  const vm22Chunks = flatten(vm22); const vm20Chunks = flatten(vm20); const vm30Chunks = flatten(vm30)
  const correct = vm22Chunks.find((chunk) => chunk.chunkId === 'vm22-section-8-scenario-generation-b-interest-rate-generator')
  const wrongTopic = vm22Chunks.find((chunk) => chunk.chunkId === 'vm22-section-1-background-a-purpose')
  const vm20Evidence = vm20Chunks.find((chunk) => chunk.chunkLevel === 'child' && chunk.retrievalEligible)
  const otherVm20Evidence = vm20Chunks.find((chunk) => chunk.chunkLevel === 'child' && chunk.retrievalEligible && chunk.chunkId !== vm20Evidence?.chunkId)
  const vm30Evidence = vm30Chunks.find((chunk) => chunk.chunkLevel === 'child' && chunk.retrievalEligible)
  assert(correct && wrongTopic && vm20Evidence && otherVm20Evidence && vm30Evidence, 'VM-22 support-gate fixtures are missing.')
  const chunkRecords = [correct, wrongTopic, vm20Evidence, otherVm20Evidence, vm30Evidence]
  const chunkLookup = new Map(chunkRecords.map((chunk) => [chunk.chunkId, chunk]))
  const sourcePackages = [vm22.source, vm20.source, vm30.source]
  const formalQuery = { queryId: 'vm22-support-gate-interest-rate-generator', query: 'What prescribed interest rate scenario generator does VM-22 require?', supportRequirements: { informationTypes: ['formal_requirement'], requiredSourceIds: ['vm22-current-manual'], requiredEvidenceTerms: ['interest rate scenario generator'] } }
  const wrongTopicQuery = { queryId: 'vm22-support-gate-invented-quarterly-filing', query: 'What quarterly reserve filing does VM-22 require?', supportRequirements: { informationTypes: ['formal_requirement'], requiredSourceIds: ['vm22-current-manual'], requiredEvidenceTerms: ['quarterly reserve filing'] } }
  const match = (chunk, score) => ({ chunkId: chunk.chunkId, sourceId: chunk.sourceId, sourceFamilyId: chunk.sourceFamilyId, authorityLevel: chunk.authorityLevel, score })
  const specs = [
    { testId: 'other-manual-methodology-cannot-support-vm22-requirement', description: 'VM-20 and VM-30 evidence cannot substitute for requested formal VM-22 authority.', query: formalQuery, matches: [match(vm20Evidence, 20), match(vm30Evidence, 19)], expectedState: 'unsupported', expectedReason: 'missing_requested_formal_requirement_source' },
    { testId: 'vm22-evidence-at-rank-four-is-outside-production-window', description: 'Correct VM-22 evidence at rank 4 remains outside the production evidence window.', query: formalQuery, matches: [match(vm20Evidence, 20), match(vm30Evidence, 19), match(otherVm20Evidence, 18), match(correct, 17)], expectedState: 'unsupported', expectedReason: 'missing_requested_formal_requirement_source' },
    { testId: 'vm22-evidence-inside-top-three-supports-request', description: 'Correct relevant VM-22 evidence inside ranks 1-3 supports the request.', query: formalQuery, matches: [match(vm20Evidence, 20), match(correct, 19)], expectedState: 'supported', expectedReason: 'retrieved_evidence_matches_requested_information_type' },
    { testId: 'wrong-topic-vm22-evidence-does-not-support-claim', description: 'VM-22 source text on an unrelated topic cannot support an invented formal requirement.', query: wrongTopicQuery, matches: [match(wrongTopic, 20)], expectedState: 'unsupported', expectedReason: 'missing_required_requirement_terms' },
  ]
  const cases = specs.map((spec) => {
    const decision = assessFormalRequirementEvidenceSufficiency({ query: spec.query, topMatches: spec.matches, chunkRecords, sourcePackages })
    const fullRanking = spec.matches.map((item, index) => { const chunk = chunkLookup.get(item.chunkId); return { rank: index + 1, ...item, sectionReference: chunk?.sectionReference ?? null, pageStart: chunk?.pageStart ?? null, pageEnd: chunk?.pageEnd ?? null, sourceTextType: chunk?.sourceTextType ?? null, sourceTextExcerpt: chunk?.sourceTextExcerpt ?? null } })
    const passed = decision.supportState === spec.expectedState && decision.reasonCode === spec.expectedReason
    return { testId: spec.testId, description: spec.description, query: spec.query.query, requestedSourceAuthority: { sourceIds: spec.query.supportRequirements.requiredSourceIds, informationTypes: spec.query.supportRequirements.informationTypes }, requiredEvidenceTerms: spec.query.supportRequirements.requiredEvidenceTerms, productionEvidenceWindowSize: 3, fullRanking, productionWindowEvidence: fullRanking.slice(0, 3), supportState: decision.supportState, evidenceSufficient: decision.evidenceSufficient, reasonCode: decision.reasonCode, expectedSupportState: spec.expectedState, expectedReasonCode: spec.expectedReason, passed, decision }
  })
  const artifact = { schemaVersion: '1.0', artifactType: 'formal_requirement_support_gate_regression', status: cases.every((item) => item.passed) ? 'pass' : 'fail', productionEvidenceWindow: 3, genericBoundary: 'Formal VM-22 requirement support requires relevant actual VM-22 source text inside ranks 1-3; other-manual evidence, rank-4 correct evidence, and wrong-topic VM-22 text are insufficient.', fixtureSources: sourcePackages.map((source) => ({ sourceId: source.sourceId, sourceFamilyId: source.sourceFamilyId, authorityLevel: source.authorityLevel })), caseCount: cases.length, passedCaseCount: cases.filter((item) => item.passed).length, cases, governance: { reviewOnly: true, promotionStatus: 'not_promoted', promotionEligible: false } }
  await fs.mkdir(path.dirname(outputPath), { recursive: true }); await fs.writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8'); await fs.writeFile(outputPath.replace(/\.json$/, '.md'), `${['# VM-22 formal-requirement support-gate regression', '', `- Result: **${artifact.status.toUpperCase()}**`, '- Production evidence window: ranks 1-3', `- Cases: ${artifact.passedCaseCount}/${artifact.caseCount} passed`, '', ...cases.map((item) => `- ${item.testId}: ${item.supportState} / ${item.reasonCode}; passed ${item.passed}`)].join('\n')}\n`, 'utf8')
  for (const item of cases) assert(item.passed, `${item.testId} failed: ${item.supportState}/${item.reasonCode}`)
  console.log(`Passed ${artifact.passedCaseCount}/${artifact.caseCount} VM-22 formal-requirement support-gate regressions.`)
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1 })
