# VM-01 canonical definitions review package

- Status: **CANONICAL PROMOTED**
- Final independent disposition: **APPROVE FOR CANONICAL PROMOTION**
- Promotion decision: `data/manual-input/promotion-decisions/vm01-2026-definitions-promotion.json`
- Authority: 2026 NAIC Valuation Manual
- Source SHA-256: `496cab9f387c84971df69eab1528d93aea70f7e57c8429661f2765498b38d4e9`
- Chapter pages: 25-39; definition-bearing pages: 25-37; pages 38-39 contain no additional definitions
- Definitions / retrieval units: 98 / 98
- Exact retained source-text definitions: 98
- Source-explicit / generated `definedTerms` entries: 125 / 0
- Retrieval-only normalized variants retained outside `definedTerms`: 17
- Complex definitions flagged: 24
- Definitions with explicit cross-references: 22
- Relationship candidates: 29 (review-only, pending)

## Retrieval

- Focused queries: 21
- Supported top-1 / top-3: 17/18 / 18/18
- Unsupported formal-definition queries abstained: 3/3
- Current VM-01 authority ranked first: 18/18

- Case-level evaluation JSON: `data/processed/review_packages/vm01-definition-retrieval-evaluation.json`
- Case-level evaluation SHA-256: `ab46494dbda945999fc0dc7aa55ff90f2d456a816bd6e0c9041f35e7969c566a`

- Implementation review manifest: `data/processed/review_packages/vm01-retrieval-implementation-review/manifest.json`
- Byte-exact implementation snapshots: 4; manifest SHA-256 `e77de2e399fe44cc20b2546df6ffa608ec17847fc8519299f91d13324906e1da`

## Representative examples

| Term | Pages | Explicit aliases | Complexity flags | Explicit references |
| --- | --- | --- | --- | --- |
| accumulated deficiency | 25-25 | none | none | none |
| claim reserve | 26-26 | none | guidance_note_attached | AP&P Manual |
| clearly defined hedging strategy | 26-27 | CDHS | enumerated_subparts, guidance_note_attached | AP&P Manual, SSAP No. 86 |
| prudent estimate assumption | 34-34 | none | none | none |
| VM-20 reserving category | 37-37 | none | long_definition, enumerated_subparts, guidance_note_attached, condition_or_exception | VM-20, Section II |

## Promotion boundary

- Promotion applies only to the 98 reviewed current 2026 VM-01 definition chunks and their canonical lookup metadata.
- The 29 relationship candidates remain pending, review-only, not promoted, and not promotion-eligible.
- Learner, application, RAG, vector, and Copilot export remain blocked pending separate decisions.
- Historical review prompts and implementation snapshots remain review evidence, not promoted source evidence.

This review package is generated review metadata, not authoritative regulatory evidence.
