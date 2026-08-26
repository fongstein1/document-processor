import fs from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const resultsPath = path.join(repoRoot, 'data', 'processed', 'source_indexes', 'evaluation', 'retrieval_results.json')
const jsonPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-retrieval-qa-report.json')
const markdownPath = path.join(repoRoot, 'data', 'processed', 'review_packages', 'vm20-retrieval-qa-report.md')
const baselineCommit = 'd8c7523'

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'))
const readBaseline = () => {
  const result = spawnSync('git', ['show', `${baselineCommit}:data/processed/source_indexes/evaluation/retrieval_results.json`], { cwd: repoRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (result.status !== 0) throw new Error(`Unable to read baseline retrieval results at ${baselineCommit}: ${(result.stderr || result.stdout).trim()}`)
  return JSON.parse(result.stdout)
}
const compactMatches = (query) => (query.rankedMatches ?? []).slice(0, 3).map((match) => ({ chunkId: match.chunkId, score: match.score }))
const normalizeExcerpt = (value) => String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
const countStructuralCollisions = (query, chunkLookup, topN = 5) => {
  const topMatches = (query.rankedMatches ?? []).slice(0, topN)
  const ids = new Set(topMatches.map((match) => match.chunkId))
  let collisionCount = 0
  for (const match of topMatches) {
    const child = chunkLookup.get(match.chunkId)
    if (!child?.parentChunkId || !ids.has(child.parentChunkId)) continue
    const parent = chunkLookup.get(child.parentChunkId)
    const parentText = normalizeExcerpt(parent?.sourceTextExcerpt)
    const childText = normalizeExcerpt(child.sourceTextExcerpt)
    if (parentText && childText && (parentText.includes(childText) || childText.includes(parentText))) collisionCount += 1
  }
  return collisionCount
}
const reciprocalMean = (queries) => {
  const supported = queries.filter((query) => query.expectedOutcome !== 'unsupported')
  return supported.length === 0 ? 0 : supported.reduce((sum, query) => sum + (query.reciprocalRank ?? 0), 0) / supported.length
}

const priorMissCauses = {
  'q-vm20-hierarchical-section-3c': 'broad Section 3.C source outranked the more precise hierarchical children; the prior metadata surface did not distinguish the child concepts strongly enough.',
  'q-vm20-practice-note-expense-guidance': 'Current Section 9.E source overlapped the practice-note query terms and outranked the expected historical companion evidence.',
  'q-vm20-practice-note-mortality-behavior': 'Current Section 9.D policyholder-behavior source overlapped the mixed mortality/behavior query and outranked the expected companion children.',
  'q-vm20-appendix2-prose-basis': 'Adjacent Appendix 2 subsection terms were too similar, so subsection B outranked the expected subsection A evidence.',
}

const main = async () => {
  const after = await readJson(resultsPath)
  const before = readBaseline()
  const chunks = (await fs.readFile(path.join(repoRoot, 'data', 'processed', 'source_indexes', 'exports', 'source_chunks.jsonl'), 'utf8')).trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
  const chunkLookup = new Map(chunks.map((chunk) => [chunk.chunkId, chunk]))
  const beforeById = new Map(before.queries.filter((query) => query.queryId.startsWith('q-vm20')).map((query) => [query.queryId, query]))
  const vm20Queries = after.queries.filter((query) => query.queryId.startsWith('q-vm20'))
  const supported = vm20Queries.filter((query) => query.expectedOutcome !== 'unsupported')
  const unsupported = vm20Queries.filter((query) => query.expectedOutcome === 'unsupported')
  const afterRawCollisionCount = vm20Queries.reduce((sum, query) => sum + (query.deduplication?.rawTopKCollisionGroups?.length ?? 0), 0)
  const afterPostDeduplicationCollisionCount = vm20Queries.reduce((sum, query) => sum + (query.deduplication?.postDeduplicationCollisionCount ?? 0), 0)
  const reportQueries = supported.map((query) => {
    const prior = beforeById.get(query.queryId)
    const priorMiss = prior && !prior.top1Hit
    return {
      queryId: query.queryId,
      category: query.queryCategory,
      query: query.query,
      expectedEvidence: query.expectedChunkIds,
      before: prior ? { top1: prior.rankedMatches?.[0] ?? null, top3: compactMatches(prior), top1Hit: prior.top1Hit, top3Hit: prior.top3Hit, structuralCollisionCount: countStructuralCollisions(prior, chunkLookup) } : null,
      after: { top1: query.rankedMatches?.[0] ?? null, top3: compactMatches(query), top1Hit: query.top1Hit, top3Hit: query.top3Hit, structuralCollisionCount: query.deduplication?.postDeduplicationCollisionCount ?? 0 },
      priorTop1MissCause: priorMiss ? (priorMissCauses[query.queryId] ?? 'Prior top-1 miss caused by generic source or hierarchy term overlap; no question-specific rule was added.') : null,
    }
  })
  const report = {
    schemaVersion: '1.0',
    reportId: 'vm20-retrieval-qa-report-2026-08-26',
    baselineCommit,
    evaluationMethod: after.method,
    queryCount: vm20Queries.length,
    supportedQueryCount: supported.length,
    unsupportedQueryCount: unsupported.length,
    before: {
      supportedTop1: supported.filter((query) => beforeById.get(query.queryId)?.top1Hit).length,
      supportedTop3: supported.filter((query) => beforeById.get(query.queryId)?.top3Hit).length,
      unsupportedDetected: unsupported.filter((query) => beforeById.get(query.queryId)?.resultLabel === 'unsupported').length,
      meanReciprocalRank: reciprocalMean(supported.map((query) => beforeById.get(query.queryId)).filter(Boolean)),
      rawStructuralCollisionCount: vm20Queries.reduce((sum, query) => sum + countStructuralCollisions(beforeById.get(query.queryId) ?? {}, chunkLookup), 0),
    },
    after: {
      supportedTop1: supported.filter((query) => query.top1Hit).length,
      supportedTop3: supported.filter((query) => query.top3Hit).length,
      unsupportedDetected: unsupported.filter((query) => query.supportDecision?.supportState === 'unsupported').length,
      meanReciprocalRank: reciprocalMean(vm20Queries),
      rawStructuralCollisionCount: afterRawCollisionCount,
      postDeduplicationCollisionCount: afterPostDeduplicationCollisionCount,
    },
    priorTop1Misses: reportQueries.filter((query) => query.priorTop1MissCause),
    supportedQueries: reportQueries,
    unsupportedQueries: unsupported.map((query) => ({ queryId: query.queryId, query: query.query, expectedEvidence: [], top1: query.rankedMatches?.[0] ?? null, top3: compactMatches(query), resultLabel: query.resultLabel, supportDecision: query.supportDecision })),
    duplicateParentChildTopKCollisions: {
      beforeRawCollisionCount: vm20Queries.reduce((sum, query) => sum + countStructuralCollisions(beforeById.get(query.queryId) ?? {}, chunkLookup), 0),
      afterRawCollisionCount,
      afterPostDeduplicationCollisionCount,
    },
    notes: 'This report records all VM-20 query results. Retrieval changes are generic metadata, source-text deduplication, and context-only parent eligibility; no query-specific tuning rules were added.',
  }
  await fs.writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  const lines = [
    '# VM-20 Retrieval QA Report', '',
    `- Baseline commit: \`${baselineCommit}\``,
    `- Queries: ${report.queryCount} (${report.supportedQueryCount} supported, ${report.unsupportedQueryCount} unsupported)`,
    `- Before: supported top-1 ${report.before.supportedTop1}/${report.supportedQueryCount}; supported top-3 ${report.before.supportedTop3}/${report.supportedQueryCount}; MRR ${report.before.meanReciprocalRank.toFixed(3)}; unsupported detected ${report.before.unsupportedDetected}/${report.unsupportedQueryCount}`,
    `- After: supported top-1 ${report.after.supportedTop1}/${report.supportedQueryCount}; supported top-3 ${report.after.supportedTop3}/${report.supportedQueryCount}; MRR ${report.after.meanReciprocalRank.toFixed(3)}; unsupported detected ${report.after.unsupportedDetected}/${report.unsupportedQueryCount}`,
    `- Equivalent parent-child top-k collisions: before ${report.duplicateParentChildTopKCollisions.beforeRawCollisionCount}; after raw ${report.duplicateParentChildTopKCollisions.afterRawCollisionCount}, post-deduplication ${report.duplicateParentChildTopKCollisions.afterPostDeduplicationCollisionCount}`,
    '', '## Prior top-1 misses', '',
    ...report.priorTop1Misses.map((query) => `- \`${query.queryId}\`: ${query.priorTop1MissCause}`),
    '', '## Supported query evidence', '',
    '| Query | Expected evidence | Before top-1 | After top-1 | After top-3 |',
    '| --- | --- | --- | --- | --- |',
    ...report.supportedQueries.map((query) => `| \`${query.queryId}\` | ${query.expectedEvidence.map((id) => `\`${id}\``).join('<br>')} | ${query.before?.top1?.chunkId ?? 'n/a'} | ${query.after.top1?.chunkId ?? 'n/a'} | ${query.after.top3.map((match) => match.chunkId).map((id) => `\`${id}\``).join('<br>')} |`),
    '', '## Unsupported query', '',
    ...report.unsupportedQueries.map((query) => `- \`${query.queryId}\`: ${query.resultLabel}; support state \`${query.supportDecision?.supportState ?? 'n/a'}\`; reason \`${query.supportDecision?.reasonCode ?? 'n/a'}\`; related evidence: ${query.supportDecision?.relatedEvidence ?? 'n/a'}; corpus gap: ${query.supportDecision?.corpusGap ?? 'n/a'}.`),
    '', report.notes, '',
  ]
  await fs.writeFile(markdownPath, `${lines.join('\n')}\n`, 'utf8')
  console.log(`Built VM-20 QA report for ${report.queryCount} queries.`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
