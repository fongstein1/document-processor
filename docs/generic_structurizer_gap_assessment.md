# Generic Structurizer Gap Assessment

## Purpose

This note separates the current source-index fields into a reusable generic
core and domain-specific profile layers so the processor can support
regulatory, pricing, liability-modeling, governance, reporting, and product
documents without hard-coding NAIC terminology into every record.

## Summary

The current source-index POC already has a strong generic spine:

- stable source IDs and version IDs;
- page ranges and structural chunking;
- source text separate from summaries;
- relationship links;
- review posture metadata;
- export and retrieval artifacts.

The main gap is that a few concepts are still framed as if the corpus were
regulatory-first. Those fields should stay available, but only through
optional profile data or domain-specific documentation.

## Field classification

| Current field or concept | Classification | Notes |
| --- | --- | --- |
| `repositoryManifestId`, `sourceIndexId`, `sourceId`, `sourceVersionId` | Generic core | Stable identifiers should remain corpus-wide. |
| `filename`, `filePath`, `sourcePath`, `sourceHash` | Generic core | Source identity and provenance. |
| `documentType`, `domainId`, `subdomain`, `organization` | Generic core | These should be profile-aware, not NAIC-only. |
| `confidentiality`, `publicationDate`, `effectiveDate`, `version`, `approvalStatus`, `language` | Generic core | Required or optional by profile. |
| `chunkId`, `parentChunkId`, `precedingChunkId`, `followingChunkId`, `sequence`, `hierarchyLevel` | Generic core | Structural relationships. |
| `headingPath`, `sectionLabel`, `pageRange`, `locator`, `citationDisplay`, `chunkingStrategy` | Generic core | Retrieval and navigation metadata. |
| `sourceText`, `normalizedSearchText`, `sourceTextFidelity`, `sourceTextNotes`, `contentHash`, `tokenCount`, `characterCount` | Generic core | Evidence and fidelity fields. |
| `summary`, `keyPoints`, `concepts`, `definedTerms`, `acronyms`, `entities`, `assumptions`, `methods`, `inputs`, `outputs`, `requirements`, `decisions`, `risks`, `controls`, `exceptions`, `limitations`, `implementationImplications`, `openQuestions`, `crossReferences`, `relatedChunks` | Generic core | Semantic fields should stay optional. |
| `authorityLevel`, `sourceStatus`, `jurisdiction`, `reviewPosture`, `pageImageBackstop`, `lineReferencesAvailable` | Generic core with profile-specific semantics | Valid for multiple domains, but values should be interpreted through profiles. |
| `requirement_type`, `regulatory_framework`, `filing_or_reporting_requirement`, `compliance_implication` | Regulatory profile | Keep these out of the generic core unless present in a regulated source profile. |
| `product_family`, `pricing_stage`, `pricing_method`, `pricing_assumption_type`, `assumption_basis`, `profitability_metric`, `target_metric`, `sensitivity_driver`, `approval_body`, `decision_status`, `pricing_risk`, `implementation_dependency` | Pricing profile | Useful for product, profitability, and pricing support sources. |
| `reserve_framework`, `model_platform`, `projection_component`, `prescribed_vs_company_assumption`, `model_input`, `model_output`, `validation_control`, `model_limitation` | Liability-modeling profile | Reserve and projection systems need these as optional extensions. |
| `process_owner`, `control`, `evidence`, `review_frequency`, `approval`, `exception`, `issue`, `remediation` | Governance profile | Use for control and evidence material. |
| `reporting_period`, `report_owner`, `source_system`, `reconciliation`, `exhibit`, `deadline`, `reviewer`, `downstream_use` | Reporting profile | Use for reporting, filing, and production-control material. |
| `benefit`, `rider`, `guarantee`, `charge`, `eligibility`, `premium_rule`, `policyholder_option`, `system_requirement` | Product profile | Use for product-specification and policy feature documents. |

## Candidate removals or deprecations

The following should not be required globally:

- NAIC-only authority language;
- regulatory filing labels;
- valuation-manual-specific terminology;
- any assumption or control concept that belongs to a profile.

## Refactor recommendation

1. Keep the canonical source-index core stable and backend-neutral.
2. Move domain-specific meaning into optional profile metadata.
3. Add a deterministic classifier that assigns the profile and chunking
   strategy before indexing.
4. Validate the core separately from the profile extensions.
5. Preserve the current regulatory corpus while adding a synthetic pricing
   corpus to prove portability.

