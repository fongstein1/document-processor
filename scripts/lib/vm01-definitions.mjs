import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export const VM01_SOURCE_ID = 'vm01-definitions'
export const VM01_BATCH_SOURCE_ID = 'supporting-vm01-definitions'
export const VM01_SOURCE_SHA256 = '496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9'
export const VM01_EXPECTED_DEFINITION_COUNT = 98
export const VM01_PAGE_RANGE = { start: 25, end: 39 }

const normalizeWhitespace = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

const termTextCorrections = new Map([
  ['asset -associated derivative', 'asset-associated derivative'],
  ['deposit -type contract', 'deposit-type contract'],
  ['equity -like instruments', 'equity-like instruments'],
  ['index -linked variable annuity', 'index-linked variable annuity'],
  ['i ndustrial life insurance', 'industrial life insurance'],
  ['non -guaranteed elements', 'non-guaranteed elements'],
  ['non -material secondary guarantee', 'non-material secondary guarantee'],
  ['o rdinary life insurance', 'ordinary life insurance'],
  ['Principle -Based Reserve Actuarial Report', 'Principle-Based Reserve Actuarial Report'],
  ['principle -based valuation', 'principle-based valuation'],
  ['VM -20 reserving category', 'VM-20 reserving category'],
])

const correctDefinedTermExtraction = (value) => {
  const extracted = normalizeWhitespace(value)
  return termTextCorrections.get(extracted) ?? extracted
}

export const normalizeLookupTerm = (value) => normalizeWhitespace(value)
  .replace(/[‐‑‒–—−]/g, '-')
  .replace(/\s*-\s*/g, '-')
  .replace(/\s+\(([A-Z][A-Z0-9&.-]{1,14})\)$/u, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

export const sha256 = (value) => crypto.createHash('sha256').update(String(value), 'utf8').digest('hex')

const pageAtOffset = (text, offset, fallback = VM01_PAGE_RANGE.start) => {
  let page = fallback
  for (const match of text.matchAll(/\[p\.\s*(\d+)\]/g)) {
    if (match.index > offset) break
    page = Number(match[1])
  }
  return page
}

const parseOpening = (sourceText) => {
  const text = String(sourceText).trim()
  const appointed = text.match(/^•\s+An appointed actuary\s+(means)\b/i)
  if (appointed) {
    return {
      exactDefinedTerm: 'appointed actuary',
      extractedDefinedTerm: 'appointed actuary',
      alternateTerm: null,
      parentheticalAlias: null,
      verb: appointed[1],
      definitionBodySourceText: text.slice(appointed[0].length).trim(),
    }
  }

  const match = text.match(/^•\s+The term\s+[“‘"]([^”’"]+)[”’"](?:\s+or\s+[“‘"]([^”’"]+)[”’"])?(?:\s+\(([^)]+)\))?\s+(mean\s*s|is|are)\b/i)
  if (!match) throw new Error(`Unable to parse VM-01 definition opening: ${normalizeWhitespace(text).slice(0, 180)}`)
  const extractedDefinedTerm = normalizeWhitespace(match[1])
  return {
    exactDefinedTerm: correctDefinedTermExtraction(extractedDefinedTerm),
    extractedDefinedTerm,
    alternateTerm: match[2] ? normalizeWhitespace(match[2]) : null,
    parentheticalAlias: match[3] ? normalizeWhitespace(match[3]) : null,
    verb: match[4].replace(/\s+/g, ''),
    definitionBodySourceText: text.slice(match[0].length).trim(),
  }
}

const acronymFromTerm = (term) => normalizeWhitespace(term).match(/\(([A-Z][A-Z0-9&.-]{1,14})\)/u)?.[1] ?? null
const baseTerm = (term) => normalizeWhitespace(term).replace(/\s*\(([A-Z][A-Z0-9&.-]{1,14})\)\s*/u, ' ').replace(/\s+/g, ' ').trim()
const isAcronym = (value) => /^[A-Z][A-Z0-9&.-]{1,14}$/u.test(String(value ?? ''))

export const parseDefinitionMetadata = (sourceText) => {
  const opening = parseOpening(sourceText)
  const aliases = []
  const acronymExpansions = []
  const embeddedAcronym = acronymFromTerm(opening.exactDefinedTerm)
  const normalizedBaseTerm = baseTerm(opening.exactDefinedTerm)

  if (opening.alternateTerm) aliases.push(opening.alternateTerm)
  if (opening.parentheticalAlias) aliases.push(opening.parentheticalAlias)
  if (embeddedAcronym) aliases.push(embeddedAcronym)

  if (embeddedAcronym) acronymExpansions.push({ acronym: embeddedAcronym, expansion: normalizedBaseTerm })
  if (isAcronym(opening.parentheticalAlias)) acronymExpansions.push({ acronym: opening.parentheticalAlias, expansion: normalizedBaseTerm })

  if (opening.exactDefinedTerm === 'NAIC') {
    const expansion = opening.definitionBodySourceText.match(/^the\s+(.+?)(?:\.|\s+\()/i)?.[1]
    if (expansion) acronymExpansions.push({ acronym: 'NAIC', expansion: normalizeWhitespace(expansion) })
  }

  return {
    ...opening,
    normalizedLookupTerm: normalizeLookupTerm(normalizedBaseTerm),
    termExtractionNormalization: opening.extractedDefinedTerm === opening.exactDefinedTerm ? null : {
      extractedTerm: opening.extractedDefinedTerm,
      normalizedTerm: opening.exactDefinedTerm,
      basis: 'spacing-only PDF text-layer extraction correction verified against source typography',
    },
    aliases: [...new Set(aliases)],
    acronymExpansions: acronymExpansions.filter((entry, index, all) => all.findIndex((candidate) => candidate.acronym === entry.acronym && candidate.expansion === entry.expansion) === index),
  }
}

const referencePatterns = [
  ['Model #820', /Model\s+#?820/gi],
  ['Model #787', /Model\s+#?787/gi],
  ['AP&P Manual', /AP&P\s+Manual/gi],
  ['VM-20', /VM\s*-\s*20/gi],
  ['VM-21', /VM\s*-\s*21/gi],
  ['VM-22', /VM\s*-\s*22/gi],
  ['VM-30', /VM\s*-\s*30/gi],
  ['VM-31', /VM\s*-\s*31/gi],
  ['VM-A', /VM\s*-\s*A\b/gi],
  ['VM-C', /VM\s*-\s*C\b/gi],
  ['VM-M', /VM\s*-\s*M\b/gi],
  ['Section II', /Section\s+II\b/gi],
  ['ASOP No. 25', /ASOP\s+No\.\s*25\b/gi],
  ['ASOP No. 52', /ASOP\s+No\.\s*52\b/gi],
  ['SSAP No. 86', /SSAP\s+No\.\s*86\b/gi],
]

export const deriveExplicitReferences = (sourceText) => referencePatterns
  .filter(([, pattern]) => {
    pattern.lastIndex = 0
    return pattern.test(sourceText)
  })
  .map(([target]) => ({
    relationType: 'references',
    target,
    reviewDecision: 'pending',
    promotionStatus: 'not_promoted',
    promotionEligible: false,
    evidenceBasis: 'explicit_source_text_reference',
  }))

export const parseVm01Definitions = (chapterText) => {
  const text = String(chapterText ?? '').replace(/\r\n/g, '\n')
  // One bullet follows the page footer on the same extracted line. Match the
  // source bullet glyph itself rather than assuming every bullet is line-led.
  const starts = [...text.matchAll(/•\s+/g)].map((match) => match.index)
  if (starts.length !== VM01_EXPECTED_DEFINITION_COUNT) {
    throw new Error(`Expected ${VM01_EXPECTED_DEFINITION_COUNT} VM-01 definition bullets, found ${starts.length}.`)
  }
  const introSourceText = text.slice(0, starts[0]).trim()
  const definitions = starts.map((start, index) => {
    const end = starts[index + 1] ?? text.length
    const sourceText = text.slice(start, end)
      .replace(/\n*\[p\.\s*38\][\s\S]*$/u, '')
      .trim()
    const metadata = parseDefinitionMetadata(sourceText)
    const pageStart = pageAtOffset(text, start)
    const sourcePages = [...sourceText.matchAll(/\[p\.\s*(\d+)\]/g)].map((match) => Number(match[1]))
    const pageEnd = sourcePages.at(-1) ?? pageStart
    const wordCount = normalizeWhitespace(sourceText).split(/\s+/).filter(Boolean).length
    const references = deriveExplicitReferences(sourceText)
    const complexStructureReasons = [
      wordCount > 250 ? 'long_definition' : null,
      /\n\s*(?:[a-z]\.|[ivx]+\.|\([a-z]\)|o\s|−\s)/im.test(sourceText) ? 'enumerated_subparts' : null,
      /Guidance Note:/i.test(sourceText) ? 'guidance_note_attached' : null,
      /\b(?:except|unless|does not|do not|neither|excluding|only if|provided that)\b/i.test(sourceText) ? 'condition_or_exception' : null,
    ].filter(Boolean)
    return {
      definitionOrdinal: index + 1,
      definitionId: `vm01-definition-${String(index + 1).padStart(3, '0')}-${normalizeLookupTerm(metadata.exactDefinedTerm).replace(/\s+/g, '-')}`,
      ...metadata,
      pageStart,
      pageEnd,
      sourceText,
      sourceTextSha256: sha256(sourceText),
      wordCount,
      complexStructureReasons,
      explicitReferences: references,
    }
  })
  return { introSourceText, definitions }
}

export const loadVm01Extraction = async (repoRoot, input) => {
  const extractionPath = path.resolve(repoRoot, input.extractionPath)
  const manifestPath = path.resolve(repoRoot, input.batchManifestPath)
  const [extraction, manifest] = await Promise.all([
    fs.readFile(extractionPath, 'utf8').then(JSON.parse),
    fs.readFile(manifestPath, 'utf8').then(JSON.parse),
  ])
  const sourceRecord = (manifest.sourceFiles ?? []).find((candidate) => candidate.sourceId === input.sourceId)
  if (!sourceRecord) throw new Error(`VM-01 source is missing from ${input.batchManifestPath}.`)
  if (sourceRecord.fileHash !== VM01_SOURCE_SHA256 || sourceRecord.fileHash !== input.expectedSourceSha256) {
    throw new Error(`VM-01 source hash mismatch: ${sourceRecord.fileHash ?? 'missing'}.`)
  }
  const group = (extraction.sourceGroups ?? []).find((candidate) => candidate.sourceId === input.sourceId)
  const item = group?.extractedItems?.find((candidate) => candidate.itemKind === 'chunk' && candidate.chunkText)
  if (!item) throw new Error(`VM-01 extraction has no retained source chunk for ${input.sourceId}.`)
  const parsed = parseVm01Definitions(item.chunkText)
  return { extraction, manifest, sourceRecord, item, ...parsed }
}

export const buildVm01DefinitionChunks = async (repoRoot, source) => {
  const loaded = await loadVm01Extraction(repoRoot, source.definitionInput)
  return loaded.definitions.map((definition) => {
    const aliasTerms = definition.aliases
    const acronymTerms = definition.acronymExpansions.map((entry) => `${entry.acronym} = ${entry.expansion}`)
    const references = definition.explicitReferences.map((candidate) => candidate.target)
    return {
      chunkId: definition.definitionId,
      chunkOrdinal: definition.definitionOrdinal,
      chunkKind: 'definition',
      sourceTextType: 'actual_extracted_source_text',
      pageStart: definition.pageStart,
      pageEnd: definition.pageEnd,
      sectionReference: `VM-01 definition: ${definition.exactDefinedTerm}`,
      sourceTextExcerpt: definition.sourceText,
      normalizedTextExcerpt: normalizeWhitespace(definition.sourceText).toLowerCase(),
      summary: `Generated retrieval metadata for the VM-01 definition of ${definition.exactDefinedTerm}; the exact source evidence controls.`,
      topic: definition.exactDefinedTerm,
      headingPath: `VM-01 > Definitions for Terms in Requirements > ${definition.exactDefinedTerm}`,
      controlledTags: ['core_vm_course', 'definition_or_terminology', 'exact_source_evidence', 'review_only'],
      keywords: [...new Set(['VM-01', definition.exactDefinedTerm, definition.normalizedLookupTerm, ...aliasTerms, ...references])],
      keyPoints: [`Formal VM-01 definition of ${definition.exactDefinedTerm}; do not substitute generated metadata for the source text.`],
      concepts: ['definition_or_terminology', ...references],
      definedTerms: [...new Set([definition.exactDefinedTerm, ...aliasTerms])],
      acronyms: acronymTerms,
      requirements: [],
      citations: [{
        citationText: `VM-01: Definitions for Terms in Requirements — ${definition.exactDefinedTerm}`,
        pageReference: definition.pageStart === definition.pageEnd ? `p. ${definition.pageStart}` : `pp. ${definition.pageStart}-${definition.pageEnd}`,
        sectionReference: 'VM-01: Definitions for Terms in Requirements',
        sourceReference: source.sourceReference,
        lineReference: null,
      }],
      relationships: [],
      fidelity: 'exact',
      confidence: 'high',
      reviewFlags: ['review_only', ...(definition.complexStructureReasons.length > 0 ? ['complex_definition_review'] : [])],
      qualityNotes: [
        'One coherent VM-01 definition is retained as one retrieval unit.',
        'Aliases and acronym forms are included only when explicit in the source opening.',
        'Generated lookup normalization is non-authoritative retrieval metadata in keywords and normalizedSearchText, not a source-defined term.',
        ...(definition.complexStructureReasons.length > 0 ? [`Complexity flags: ${definition.complexStructureReasons.join(', ')}.`] : []),
      ],
      evidenceNotes: `Exact retained source evidence from ${source.definitionInput.extractionPath}; SHA-256 ${definition.sourceTextSha256}.`,
      retrievalEligible: true,
      promotionEligible: false,
    }
  })
}
