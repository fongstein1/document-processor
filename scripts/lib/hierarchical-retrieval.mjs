import { reciprocalRankFusion } from './hybrid-vector-retrieval.mjs'
import { parseWorkbookCells } from './semantic-evidence-units.mjs'

const normalized = text => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const numbered = rows => rows.map((item, i) => ({ ...item, rank: i + 1 }))
export function evidenceNeeds(query) {
  const q = normalized(query), needs = []
  if (/\b(scope|applicab|applies|who must|which entities)\w*\b/.test(q)) needs.push('REQUIREMENT_PLUS_SCOPE')
  if (/\b(exception|except|unless|exempt|even when|when no)\b/.test(q)) needs.push('REQUIREMENT_PLUS_EXCEPTION')
  if (/\b(table|spread|rates|rows?|columns?|cells?|durations?|weighted average lives)\b/.test(q)) needs.push('TABLE_HEADER_PLUS_DATA')
  if (/\b(defin\w*|meaning)\b/.test(q) && /\b(require\w*|must|shall|report\w*)\b/.test(q)) needs.push('DEFINITION_PLUS_REQUIREMENT')
  if (/\b(requirements|both|which three|and what|and where)\b/.test(q)) needs.push('MULTIPLE_REQUIREMENTS')
  if (/\b(compar\w*|versus|vs|difference|between)\b/.test(q)) needs.push('COMPARISON')
  return needs
}

const ssaps = text => [...String(text).matchAll(/\bSSAP\s*(?:No\.?\s*)?(\d+)([A-Z])?\b/gi)].map(m => `${Number(m[1])}${(m[2] || '').toUpperCase()}`)
export function structuralMatches(query, parents, parentById) {
  const ids = ssaps(query), q = ` ${normalized(query)} `
  return new Set(parents.filter(p => {
    const lineage = []; let current = p
    const seen = new Set()
    while (current && !seen.has(current.parentId)) { seen.add(current.parentId); lineage.push(current); current = parentById.get(current.parentParentId) }
    if (ids.length) return lineage.some(a => ssaps(a.structuralIdentifier).some(id => ids.includes(id)))
    const sheet = normalized(p.sheetName)
    if (sheet && sheet.split(' ').length >= 2 && q.includes(` ${sheet} `)) return true
    const markers = [...query.matchAll(/\b(?:schedule|template)\s+[A-Z0-9]+(?:\s+part\s+\d+[A-Z]?)?/gi)].map(m => normalized(m[0]))
    return markers.length > 0 && lineage.some(a => markers.some(marker => (` ${normalized(a.structuralLabel)} `).includes(` ${marker} `)))
  }).map(p => p.parentId))
}

export function hierarchicalRank({ query, parentBm25, vector, bm25, parentById, config, exactRouting = false }) {
  const directParents = new Set(vector.map(x => x.doc.parentId))
  const seen = new Set(), semanticParents = []
  for (const x of vector) if (!seen.has(x.doc.parentId)) {
    seen.add(x.doc.parentId)
    semanticParents.push({ doc: parentById.get(x.doc.parentId), finalScore: x.finalScore })
  }
  const lexicalParents = numbered(parentBm25.filter(x => directParents.has(x.doc.parentId)))
  let parents = reciprocalRankFusion({ rankings: { lexical: lexicalParents, semantic: numbered(semanticParents) }, weights: { lexical: 1, semantic: 1 }, k: config.rrfK })
  const matched = exactRouting ? structuralMatches(query, parents.map(x => x.doc), parentById) : new Set()
  if (matched.size) parents = parents.filter(x => matched.has(x.doc.parentId))
  const sources = [...new Set(parents.map(x => x.doc.sourceId))].slice(0, config.topSources)
  parents = parents.filter(x => sources.includes(x.doc.sourceId)).slice(0, config.topParents)
  const parentIds = new Set(parents.map(x => x.doc.parentId))
  const ranked = reciprocalRankFusion({ rankings: { bm25: numbered(bm25.filter(x => parentIds.has(x.doc.parentId))), vector: numbered(vector.filter(x => parentIds.has(x.doc.parentId))) }, weights: { bm25: 1, vector: 1 }, k: config.rrfK })
  return { ranked, parentIds: [...parentIds], sourceIds: sources, exactRoutingApplied: matched.size > 0, needs: evidenceNeeds(query) }
}

const desiredRoles = {
  REQUIREMENT_PLUS_SCOPE: ['REQUIREMENT', 'SCOPE_OR_APPLICABILITY'],
  REQUIREMENT_PLUS_EXCEPTION: ['REQUIREMENT', 'EXCEPTION_OR_QUALIFICATION'],
  DEFINITION_PLUS_REQUIREMENT: ['DEFINITION', 'REQUIREMENT'],
  MULTIPLE_REQUIREMENTS: ['REQUIREMENT'], COMPARISON: [], TABLE_HEADER_PLUS_DATA: ['HEADER_CONTEXT']
}
export function assembleEvidence({ query, retrieval, headerById, parentById, contextById, config }) {
  const records = [], seen = new Set(); let characters = 0
  const parentIds = new Set(retrieval.parentIds), needs = evidenceNeeds(query)
  const add = (item, id, role, text) => {
    if (!item || !id || seen.has(id) || !parentIds.has(item.parentId) || records.length >= config.maximumPackageEvidence) return
    const size = String(text || '').length
    if (characters + size > config.maximumPackageCharacters) return
    seen.add(id); characters += size
    records.push({ evidenceId: id, parentId: item.parentId, sourceId: item.sourceId, role, characterCount: size })
  }
  const child = c => {
    add(c, c?.childId, c?.semanticRole, c?.body)
    if (needs.includes('TABLE_HEADER_PLUS_DATA') && seen.has(c?.childId)) {
      const h = headerById.get(c.headerContextId)
      add(h, h?.headerContextId, 'HEADER_CONTEXT', h?.text)
    }
  }
  child(retrieval.ranked[0]?.doc)
  if (needs.includes('TABLE_HEADER_PLUS_DATA')) {
    const range = query.match(/\b(?:lives|ages|rows|durations)\s+(\d+)\s+(?:through|to|-)\s*(\d+)/i)
    const candidates = retrieval.ranked.filter(x => x.doc.worksheetPath)
    const numeric = range ? candidates.map(x => {
      const cells = parseWorkbookCells(x.doc.body)
      const firstCol = x.doc.colStart
      const values = cells.filter(c => c.col === firstCol || c.ref?.replace(/\d/g, '') === firstCol).map(c => Number(c.value)).filter(Number.isFinite)
      return { ...x, hits: values.filter(v => v >= Number(range[1]) && v <= Number(range[2])).length }
    }).sort((a,b) => b.hits-a.hits || a.rank-b.rank) : candidates
    for (const x of numeric.slice(0, 2)) child(x.doc)
  }
  for (const role of [...new Set(needs.flatMap(n => desiredRoles[n]))]) {
    if (records.some(x => x.role === role)) continue
    const c = retrieval.ranked.find(x => x.doc.semanticRole === role)?.doc
    if (c) child(c)
    else for (const parentId of retrieval.parentIds) {
      const p = parentById.get(parentId), context = contextById.get(p?.parentContextId)
      if (p?.parentContextRole === role) { add(context, p.parentContextId, role, context?.contextText); break }
    }
  }
  if (needs.includes('MULTIPLE_REQUIREMENTS') || needs.includes('COMPARISON')) for (const x of retrieval.ranked.slice(0, 3)) child(x.doc)
  return { records, needs, characterCount: characters }
}
