import { supportingBatchDefinitions } from './supporting-batch-definitions.mjs'
import { vm20PracticeNoteBatchDefinitions } from './vm20-practice-note-batch-definitions.mjs'
import { vm21BatchDefinitions } from './vm21-batch-definitions.mjs'
import { vm22BatchDefinitions } from './vm22-batch-definitions.mjs'

export const batchDefinitions = {
  'batch-001': {
    batchName: 'Pilot batch 001 - narrow VM sources',
    batchSlug: 'pilot-001',
    batchProfile: 'supporting_vm_pilot',
    processingIntentText:
      'Tiny real-source pilot: one narrow VM-related guideline, one companion practice note, and one superseded text edge case.',
    processingIntentNotes:
      'First real pilot batch. It is intentionally tiny, source-bound, review-only, and not learner-facing.',
    batchSummaryText:
      'Pilot batch remains review-only. The main guideline and practice note are draft candidates, and the text edge case is retained for human review because it is superseded.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This pilot is intentionally review-only and includes a superseded text edge case that should not be promoted.',
    reviewPacketNextStep:
      'Resolve the AG 52 disposition and confirm the citation pattern before widening the batch.',
    reviewerNotes:
      'Small pilot batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-ag52-superseded',
        severity: 'high',
        sourceId: 'ag52-early-adoption-text',
        itemId: 'item-ag52-early-adoption-text-pilot-001',
        flagType: 'superseded_source',
        message: 'Source text explicitly states AG 52 is no longer applicable as of 2020.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: 'flag-vm20-supporting',
        severity: 'low',
        sourceId: 'vm20-practice-note-2020',
        itemId: 'item-vm20-practice-note-2020-pilot-001',
        flagType: 'supporting_material',
        message:
          'Practice note is explicitly non-binding and should remain a support source rather than learner-facing content.',
        notes: 'Suitable for review-only support, not promotion.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-ag52-line-locator',
        sourceId: 'ag52-early-adoption-text',
        itemId: 'item-ag52-early-adoption-text-pilot-001',
        issueType: 'page_reference_missing',
        details: 'Plain-text source has line locators only; no page-based locator is available.',
        recommendedAction: 'Keep the line-level locator and do not force a page citation onto the text note.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-ag52-disposition',
        decisionType: 'ambiguity_resolution',
        question:
          'Should the AG 52 text note stay in the working corpus as a review-only edge case, or should it be excluded from future pilot batches?',
        whyItMatters:
          'Superseded source material should not leak into learner-facing or approved indexes.',
        recommendedOwner: 'source reviewer',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-citation-slice',
        decisionType: 'citation_check',
        question:
          'Is the current page-range citation for the VM-20 practice note sufficient for the first pilot, or should a later slice be added before expansion?',
        whyItMatters:
          'The pilot needs a stable citation pattern before the corpus grows beyond the first tiny batch.',
        recommendedOwner: 'processor owner',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-ag52-disposition',
        severity: 'high',
        issueType: 'superseded_source_disposition',
        sourceId: 'ag52-early-adoption-text',
        itemId: 'item-ag52-early-adoption-text-pilot-001',
        message:
          'The AG 52 text note explicitly says it is no longer applicable as of 2020 and should remain review-only until the disposition is confirmed.',
        recommendedAction:
          'Confirm whether AG 52 should remain excluded from future pilot batches and approved indexes.',
        evidence: 'As of 2020, AG 52 is no longer applicable.',
      },
      {
        issueId: 'issue-vm20-citation-slice',
        severity: 'medium',
        issueType: 'citation_scope_confirmation',
        sourceId: 'vm20-practice-note-2020',
        itemId: 'chunk-vm20-practice-note-2020-pilot-001',
        message:
          'The VM-20 practice note slice is enough for a pilot, but the exact citation window should be confirmed before the batch grows.',
        recommendedAction:
          'Confirm whether the current page-range citation is sufficient or whether a later slice should be added before expansion.',
        evidence: 'First three pages only; title, disclaimer, and table of contents slice.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'Each pilot item carries a source reference and a locator appropriate to the file type.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the pilot.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'ag53-aat-2022',
        relativePath: 'Actuarial Guidelines/AG 53-AAT as adopted by LATF-20220616.pdf',
        sourceFamilyId: 'actuarial_guidelines',
        documentType: 'actuarial_guideline',
        sourceTitle: 'Actuarial Guideline AAT',
        sourceReference: 'Adopted by the Life Actuarial (A) Task Force June 16, 2022',
        versionDate: '2022-06-16',
        pageWindow: [1, 2],
        sectionReference: 'Background / applicability / definitions',
        citationText: 'Adopted by the Life Actuarial (A) Task Force June 16, 2022',
        confidence: 'high',
        reviewFlags: ['pilot_slice'],
        reviewStatus: 'draft_candidate',
        itemKind: 'chunk',
        notes: 'Primary narrow VM-related source for the first pilot batch.',
        summary:
          'Adopted AAT guideline explains why VM-30 asset adequacy analysis needs uniform support for assumptions and defines applicability thresholds and asset types.',
        keywords: ['VM-30', 'asset adequacy analysis', 'complex assets', 'reserves', 'definitions'],
        sourceNotes: 'First two pages only; enough to exercise source-bound extraction.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'guidance',
        reviewPacketNotes: 'Primary source slice remains draft-candidate only.',
        reviewPacketIssueCount: 0,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: 'Pilot batch item; retain as review-only until the pilot is explicitly expanded.',
      },
      {
        sourceId: 'vm20-practice-note-2020',
        relativePath: 'Practice Notes/AAA - VM-20_PN_2020_Version.pdf',
        sourceFamilyId: 'practice_notes',
        documentType: 'practice_note',
        sourceTitle: 'Life Principle-Based Reserves (PBR) Under VM-20',
        sourceReference: 'American Academy of Actuaries practice note, April 2020',
        versionDate: null,
        pageWindow: [1, 3],
        sectionReference: 'Introduction / disclaimer / table of contents',
        citationText: 'A PUBLIC POLICY PRACTICE NOTE',
        confidence: 'high',
        reviewFlags: ['non_binding_guidance'],
        reviewStatus: 'draft_candidate',
        itemKind: 'chunk',
        notes: 'Companion source for the pilot batch; serves as a supporting practice note.',
        summary:
          "Practice note identifies itself as non-binding guidance for VM-20 PBR, warns later events may make it obsolete, and lists the note's update work group.",
        keywords: ['VM-20', 'practice note', 'PBR', 'non-binding', 'guidance'],
        sourceNotes: 'First three pages only; title, disclaimer, and table of contents slice.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'supporting_guidance',
        reviewPacketNotes: 'Supporting practice note remains non-binding and review-only.',
        reviewPacketIssueCount: 0,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: 'Pilot batch item; retain as review-only until the pilot is explicitly expanded.',
      },
      {
        sourceId: 'ag52-early-adoption-text',
        relativePath:
          'Actuarial Guidelines/AG 52-Early Adoption of VM-21 for VA in 2019-repealed-as of 2020.txt',
        sourceFamilyId: 'actuarial_guidelines',
        documentType: 'actuarial_guideline_text',
        sourceTitle: 'Variable Annuity Early Adoption',
        sourceReference: 'Plain text guideline note',
        versionDate: null,
        pageWindow: null,
        sectionReference: 'Closing note',
        citationText: 'As of 2020, AG 52 is no longer applicable.',
        confidence: 'high',
        reviewFlags: ['superseded_or_repealed'],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes: 'Edge-case text file; retained to test exception-first handling of superseded guidance.',
        summary:
          'Text note says a company may elect early adoption of VM-21 for the December 31, 2019 valuation, requires related AG XLIII, RBC, and VM-31 treatment, and states AG 52 is no longer applicable as of 2020.',
        keywords: ['VM-21', 'early adoption', 'repealed', 'superseded', 'text note'],
        sourceNotes: 'Plain text source; no page numbers are available, so line references are used.',
        artifactProcessingStatus: 'review_pending',
        inventoryProcessingStatus: 'needs_human_review',
        authorityLevel: 'edge_case_note',
        reviewPacketNotes: 'Edge-case text retained for exception-first review.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'review_pending',
        nonLearnerFacingNotes:
          'Edge-case text note retained for exception-first review only; the source itself says AG 52 is no longer applicable as of 2020.',
      },
    ],
  },
  'batch-002': {
    batchName: 'Pilot batch 002 - core VM course slices',
    batchSlug: 'pilot-002',
    batchProfile: 'core_vm_course',
    processingIntentText:
      'Tiny course-core pilot: one VM-20 reserve-mechanics slice and two VM-31 reporting/definition slices from the core Valuation Manual; use this batch to test how the processor separates requirements, definitions, and documentation language.',
    processingIntentNotes:
      'Core VM course pilot only. It remains review-only, source-bound, and not learner-facing.',
    batchSummaryText:
      'Course-core batch remains review-only. The VM-20 slice is a draft candidate, while the VM-31 cross-reference and definition slices are retained for human review because they stop short of the operational reporting instructions.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This course-core pilot is intentionally narrow and includes one reserve mechanics slice plus two VM-31 reporting/definition slices; none are approved for promotion.',
    reviewPacketNextStep:
      'Confirm whether the VM-31 slices should be expanded with later reporting pages and whether the VM-20 excerpt should be split further before the next batch.',
    reviewerNotes:
      'Small core VM batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-core-mechanics',
        severity: 'medium',
        sourceId: 'vm20-core-reserve-mechanics',
        itemId: 'item-vm20-core-reserve-mechanics-pilot-002',
        flagType: 'core_mechanics_slice',
        message:
          'The VM-20 excerpt is intentionally narrow and should remain review-only until later reserve sections are added.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: 'flag-vm31-crossref',
        severity: 'medium',
        sourceId: 'vm31-reporting-crossref',
        itemId: 'item-vm31-reporting-crossref-pilot-002',
        flagType: 'cross_reference_slice',
        message:
          'The VM-31 cross-reference stops at the reporting boundary and should not be treated as the full reporting instruction set.',
        notes: 'Suitable for review-only support, not promotion.',
      },
      {
        flagId: 'flag-vm31-definition',
        severity: 'low',
        sourceId: 'vm31-reporting-definition',
        itemId: 'item-vm31-reporting-definition-pilot-002',
        flagType: 'definition_slice',
        message:
          'The PBR Actuarial Report definition is useful for review, but it is not the operational VM-31 instruction text.',
        notes: 'Definition slice remains review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm31-boundary',
        sourceId: 'vm31-reporting-crossref',
        itemId: 'item-vm31-reporting-crossref-pilot-002',
        issueType: 'approximate_citation',
        details:
          'The VM-31 excerpts are exact page citations but are intentionally narrow and do not yet include the operational reporting instructions.',
        recommendedAction:
          'Use these excerpts only for review; add a later VM-31 slice before any promotion.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-boundary',
        decisionType: 'citation_check',
        question:
          'Should the VM-20 excerpt stay as one reserve-mechanics slice, or should the next batch split out additional exclusion-test or assumption pages?',
        whyItMatters:
          'The course-core batch needs a stable slice pattern before expanding the manual coverage.',
        recommendedOwner: 'source reviewer',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm31-slice',
        decisionType: 'ambiguity_resolution',
        question:
          'Should the VM-31 material be expanded with later reporting instructions before promotion, or is the current cross-reference plus definition slice enough for the next pilot?',
        whyItMatters:
          'VM-31 should distinguish documentation expectations from the supporting definition and not be overread from a narrow excerpt.',
        recommendedOwner: 'processor owner',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-slice-boundary',
        severity: 'medium',
        issueType: 'excerpt_scope_confirmation',
        sourceId: 'vm20-core-reserve-mechanics',
        itemId: 'item-vm20-core-reserve-mechanics-pilot-002',
        message:
          'The VM-20 slice mixes the section heading with reserve mechanics and exclusion-test transition language, so the next batch may need a cleaner split.',
        recommendedAction:
          'Confirm whether the next batch should split the VM-20 material into reserve-mechanics and exclusion-test slices.',
        evidence: 'Pages 45-51 include the VM-20 heading, Section 3-6 table of contents, and the reserve mechanics text.',
      },
      {
        issueId: 'issue-vm31-reporting-boundary',
        severity: 'medium',
        issueType: 'reporting_scope_confirmation',
        sourceId: 'vm31-reporting-crossref',
        itemId: 'item-vm31-reporting-crossref-pilot-002',
        message:
          'The VM-31 material currently stops at the Actuarial Opinion/Report cross-reference and the PBR Actuarial Report definition rather than the operational reporting instructions.',
        recommendedAction:
          'Confirm whether a later batch should capture the actual VM-31 reporting instructions before promotion.',
        evidence: 'Page 22 cross-reference and page 34 definition.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'core-family-only',
        status: 'passed',
        details: 'All selected excerpts come from the valuation manual core family and stay within a single domain.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'Each pilot item carries a source reference and a locator appropriate to the file type.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the pilot.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-core-reserve-mechanics',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [45, 51],
        sectionReference:
          'VM-20 Sections 3-6: Net Premium Reserve, Deterministic Reserve, Stochastic Reserve, and Exclusion Tests',
        citationText: 'VM-20: Requirements for Principle-Based Reserves for Life Products',
        confidence: 'high',
        reviewFlags: ['core_vm_course', 'reserve_mechanics', 'exclusion_test_boundary'],
        reviewStatus: 'draft_candidate',
        itemKind: 'chunk',
        notes: 'Core VM-20 slice selected to test reserve mechanics and exclusion-test distinctions.',
        summary:
          'VM-20 defines the reserve structure, tying the minimum reserve to NPR, DR, SR, and exclusion-test language.',
        keywords: ['VM-20', 'NPR', 'DR', 'SR', 'exclusion tests', 'reserve structure'],
        sourceNotes: 'Pages 45-51 only; narrow slice from the core valuation manual.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'core_manual_section',
        reviewPacketNotes: 'Draft-candidate reserve mechanics slice; keep review-only until later VM-20 sections are added.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'Course-core slice retained as review-only until the pilot is explicitly expanded.',
      },
      {
        sourceId: 'vm31-reporting-crossref',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [22, 22],
        sectionReference: 'Actuarial Opinion and Report Requirements',
        citationText: 'PBR Actuarial Report requirements',
        confidence: 'high',
        reviewFlags: ['core_vm_course', 'reporting_cross_reference'],
        reviewStatus: 'needs_human_review',
        itemKind: 'chunk',
        notes: 'Single-page excerpt to test reporting cross-references and the boundary between VM-30 and VM-31.',
        summary:
          'The manual says VM-30 handles actuarial opinion and memorandum requirements and VM-31 provides PBR Actuarial Report requirements for PBR products.',
        keywords: ['VM-30', 'VM-31', 'PBR Actuarial Report', 'reporting requirements', 'cross-reference'],
        sourceNotes: 'Page 22 only; cross-reference slice from the core valuation manual.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'core_reporting_reference',
        reviewPacketNotes:
          'Cross-reference slice only; keep it review-only until a fuller VM-31 reporting section is added.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'Course-core slice retained as review-only until the pilot is explicitly expanded.',
      },
      {
        sourceId: 'vm31-reporting-definition',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [34, 34],
        sectionReference: 'Definitions for Terms in Requirements VM-01',
        citationText: 'Principle-Based Reserve Actuarial Report',
        confidence: 'high',
        reviewFlags: ['core_vm_course', 'definition_slice'],
        reviewStatus: 'needs_human_review',
        itemKind: 'chunk',
        notes: 'Single-page excerpt to test the distinction between a definition and an operational reporting requirement.',
        summary:
          'The manual defines PBR Actuarial Report as the supporting information prepared by the company as required by VM-31.',
        keywords: ['VM-31', 'PBR Actuarial Report', 'definition', 'supporting information', 'documentation'],
        sourceNotes: 'Page 34 only; definition slice from the core valuation manual.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'core_definition_reference',
        reviewPacketNotes:
          'Definition slice only; keep it review-only until the operational VM-31 instructions are added.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'Course-core slice retained as review-only until the pilot is explicitly expanded.',
      },
    ],
  },
  'batch-003': {
    batchName: 'Controlled VM-20 batch 003 - framework overview',
    batchSlug: 'vm20-fw-003',
    batchProfile: 'vm20_framework_overview',
    processingIntentText:
      'First controlled VM-20 batch: keep the overview slice narrow, preserve the NPR floor / minimum reserve orientation, and separate the page-47 mechanics boundary for review-only handling.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. The batch uses two tiny excerpt windows from the same Valuation Manual PDF so the overview language and the mechanics boundary stay review-only.',
    batchSummaryText:
      'Batch 003 remains review-only. The overview excerpt clarifies the VM-20 framework at a high level, while the page-47 boundary slice is retained only to test how the processor separates orientation language from the start of formula mechanics.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally tiny and split into an overview slice plus a mechanics-boundary slice; neither excerpt is approved for promotion.',
    reviewPacketNextStep:
      'Confirm whether page 47 should stay in the framework batch or move into the next NPR / DR / SR mechanics batch.',
    reviewerNotes:
      'Tiny VM-20 control batch only. Keep the excerpt windows source-bound, review-first, and non-promotable.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-overview',
        severity: 'medium',
        sourceId: 'vm20-framework-overview',
        itemId: 'item-vm20-framework-overview-vm20-fw-003',
        flagType: 'framework_overview_slice',
        message:
          'The overview slice is useful for framework orientation, but it remains review-only and is not learner-facing.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: 'flag-vm20-boundary',
        severity: 'medium',
        sourceId: 'vm20-framework-boundary',
        itemId: 'item-vm20-framework-boundary-vm20-fw-003',
        flagType: 'mechanics_boundary_slice',
        message:
          'The page-47 slice is a boundary-control excerpt that starts to move toward reserve mechanics and should not be promoted.',
        notes: 'Suitable for review-only support, not promotion.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-framework-span',
        sourceId: 'vm20-framework-overview',
        itemId: 'item-vm20-framework-overview-vm20-fw-003',
        issueType: 'excerpt_window',
        details:
          'The overview slice spans pages 45-46 so the page boundary stays explicit and the later mechanics slice can remain separate.',
        recommendedAction:
          'Keep the page window visible in review and do not merge the overview with the mechanics boundary slice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-page47-boundary',
        decisionType: 'scope_split',
        question:
          'Should page 47 remain in the controlled overview batch, or should it be moved into the next NPR / DR / SR mechanics batch?',
        whyItMatters:
          'The batch should keep the orientation slice separate from the formulas that begin on the later page.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-orientation-coverage',
        decisionType: 'coverage_check',
        question:
          'Do we want a later batch to add the explicit Section 3 / Section 4 / Section 5 role statements, or is the current overview enough for the first control run?',
        whyItMatters:
          'The first controlled batch should decide how explicit the NPR / DR / SR orientation needs to be before the mechanics batches begin.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-page47-boundary',
        severity: 'medium',
        issueType: 'mechanics_boundary_confirmation',
        sourceId: 'vm20-framework-boundary',
        itemId: 'item-vm20-framework-boundary-vm20-fw-003',
        message:
          'Page 47 begins to move from orientation into reserve-category mechanics, so it should stay review-only until the next batch isolates the formula language more cleanly.',
        recommendedAction:
          'Keep page 47 out of learner-facing outputs and use it only as a boundary-control slice.',
        evidence: 'Page 47 continues Section 2 minimum reserve language into the first category calculations.',
      },
      {
        issueId: 'issue-vm20-orientation-coverage',
        severity: 'low',
        issueType: 'orientation_coverage_check',
        sourceId: 'vm20-framework-overview',
        itemId: 'item-vm20-framework-overview-vm20-fw-003',
        message:
          'The overview slice gives the high-level VM-20 framework map, but it does not yet capture the later Section 3 / Section 4 / Section 5 role statements.',
        recommendedAction:
          'Decide whether a later controlled batch should add those explicit role statements before mechanics extraction begins.',
        evidence: 'Pages 45-46 provide the purpose and early minimum reserve structure only.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'framework-overview-coverage',
        status: 'passed',
        details:
          'The selected pages keep the overview slice narrow and keep the page-47 mechanics boundary review-only.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'Each pilot item carries a source reference and a locator appropriate to the file type.',
      },
      {
        checkId: 'review-flag-categories',
        status: 'passed',
        details: 'Review flags distinguish the overview slice from the mechanics-boundary slice.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the pilot.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-framework-overview',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [45, 46],
        sectionReference: 'Section 1: Purpose; Section 2: Minimum Reserve (overview)',
        citationText: 'VM-20: Requirements for Principle-Based Reserves for Life Products',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'framework_overview',
          'regulatory_requirement',
          'background_content',
          'cross_reference_mapping',
        ],
        reviewStatus: 'draft_candidate',
        itemKind: 'chunk',
        notes:
          'Orientation slice for the first controlled VM-20 batch; keep review-only and do not promote.',
        summary:
          'VM-20 establishes the minimum reserve valuation standard, notes the NPR floor, and sets up the reserving structure and exclusion-test pathway at a high level.',
        keywords: ['VM-20', 'minimum reserve', 'NPR floor', 'Section 2', 'exclusion tests', 'framework overview'],
        sourceNotes: 'Pages 45-46 only; overview slice for the controlled framework batch.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'core_manual_section',
        reviewPacketNotes: 'Framework overview slice; review-only until the later mechanics batches are added.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: 'Review-only orientation slice for the VM-20 framework batch.',
      },
      {
        sourceId: 'vm20-framework-boundary',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [47, 47],
        sectionReference: 'Section 2: Minimum Reserve (category continuation)',
        citationText: 'the group of policies and riders for which the company computes all three reserve calculations',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'mechanics_boundary',
          'requires_human_interpretation',
          'formula_context',
          'boundary_control_window',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'Boundary slice showing the transition from overview language into reserve-category mechanics; keep review-only.',
        summary:
          'This page continues the minimum reserve category language and starts to move toward formula mechanics, so it is useful as a boundary-control slice but not as learner-facing content.',
        keywords: ['VM-20', 'reserve categories', 'boundary control', 'mechanics', 'review-only'],
        sourceNotes: 'Page 47 only; boundary slice that stays in review-only mode.',
        artifactProcessingStatus: 'review_pending',
        inventoryProcessingStatus: 'needs_human_review',
        authorityLevel: 'core_manual_section',
        reviewPacketNotes:
          'Boundary slice only; keep review-only until the mechanics batches separate NPR/DR/SR treatment more cleanly.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'review_pending',
        nonLearnerFacingNotes: 'Review-only boundary slice; not sufficient to teach mechanics.',
      },
    ],
  },
  'batch-004': {
    batchName: 'Controlled VM-20 batch 004 - role map completion',
    batchSlug: 'vm20-rolemap-004',
    batchProfile: 'vm20_role_map_completion',
    processingIntentText:
      'Complete the high-level VM-20 role map by capturing the explicit Section 3 / Section 4 / Section 5 responsibilities and a narrow Section 3 opener, then stop before detailed mechanics.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. This batch stays review-only and uses tiny excerpt windows to keep the role-map layer separate from the mechanics batches.',
    batchSummaryText:
      'Batch 004 remains review-only. The role-map statement and the Section 3 opener complete the high-level NPR / DR / SR framework map, while the calculation terms remain deferred to later batches.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally limited to the role-map layer and a small Section 3 boundary slice; neither excerpt is approved for promotion.',
    reviewPacketNextStep:
      'Confirm whether batch-005 should start at the first detailed Section 3 calculation terms or whether any additional role-map context is still needed.',
    reviewerNotes:
      'Tiny role-map completion batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-role-map',
        severity: 'medium',
        sourceId: 'vm20-role-map-sections-3-4-5',
        itemId: 'item-vm20-role-map-sections-3-4-5-vm20-rolemap-004',
        flagType: 'role_map_completion',
        message:
          'The explicit Section 3 / Section 4 / Section 5 role statement is useful for framework orientation, but it remains review-only.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: 'flag-vm20-section3-opener',
        severity: 'medium',
        sourceId: 'vm20-section3-opener',
        itemId: 'item-vm20-section3-opener-vm20-rolemap-004',
        flagType: 'section3_boundary_slice',
        message:
          'The Section 3 opener confirms the NPR role but stops short of the detailed calculation mechanics that belong in a later batch.',
        notes: 'Suitable for review-only support, not promotion.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-role-map-crossref',
        sourceId: 'vm20-role-map-sections-3-4-5',
        itemId: 'item-vm20-role-map-sections-3-4-5-vm20-rolemap-004',
        issueType: 'cross_reference_boundary',
        details:
          'The role-map statement sits inside Section 2 text and points forward to Sections 3, 4, and 5; keep it as review-only framework context.',
        recommendedAction:
          'Keep the explicit role statement visible in review output and do not collapse it into mechanics content.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-rolemap-split',
        decisionType: 'scope_split',
        question:
          'Should pages 50-51 stay with the role-map completion batch, or should they move into the first detailed mechanics batch?',
        whyItMatters:
          'The batch should close the framework map without drifting into mechanics too early.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-batch005-start',
        decisionType: 'coverage_check',
        question:
          'Should batch-005 begin at the first detailed Section 3 calculation terms, or is one more boundary slice needed first?',
        whyItMatters:
          'The next batch should start cleanly at mechanics rather than reopening the framework map.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-role-map-boundary',
        severity: 'medium',
        issueType: 'role_map_completion',
        sourceId: 'vm20-role-map-sections-3-4-5',
        itemId: 'item-vm20-role-map-sections-3-4-5-vm20-rolemap-004',
        message:
          'The role map is explicit but embedded in Section 2 text, so it should stay review-only and not be treated as mechanics.',
        recommendedAction:
          'Keep the role-map slice visible for review and do not promote it ahead of the mechanics batches.',
        evidence: 'Section 2 text explicitly maps Section 3 to NPR, Section 4 to DR, and Section 5 to SR.',
      },
      {
        issueId: 'issue-vm20-section3-boundary',
        severity: 'medium',
        issueType: 'mechanics_boundary_confirmation',
        sourceId: 'vm20-section3-opener',
        itemId: 'item-vm20-section3-opener-vm20-rolemap-004',
        message:
          'Section 3 applicability confirms the NPR role, but calculation terms begin immediately afterward and should be left for later mechanics batches.',
        recommendedAction:
          'Keep the Section 3 opener review-only and start detailed NPR mechanics in the next batch.',
        evidence: 'Pages 50-51 open Section 3 and begin the term definitions.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'role-map-coverage',
        status: 'passed',
        details:
          'The selected pages complete the high-level Section 3 / Section 4 / Section 5 role map before mechanics begin.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'Each pilot item carries a source reference and a locator appropriate to the file type.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the pilot.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-role-map-sections-3-4-5',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [48, 48],
        sectionReference: 'Section 2: Minimum Reserve (role map statement)',
        citationText:
          'Section 3 defines the requirements for the policy NPR. Section 4 defines the requirements for the DR, and Section 4.C defines how that reserve is attributed to a VM-20 reserving category. Section 5 defines the requirements for the SR, and Section 5.G defines how that reserve is determined for each VM-20 reserving category.',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'reserve_role_statement',
          'framework_overview',
          'cross_reference_mapping',
          'regulatory_requirement',
        ],
        reviewStatus: 'draft_candidate',
        itemKind: 'chunk',
        notes:
          'Explicit role-map sentence that closes the framework map before the mechanics batches begin.',
        summary:
          'VM-20 explicitly assigns Section 3 to NPR, Section 4 to DR, and Section 5 to SR, while pointing to Section 4.C and Section 5.G for reserving-category attribution and determination.',
        keywords: ['VM-20', 'NPR', 'DR', 'SR', 'role map', 'cross-reference'],
        sourceNotes: 'Single-page role-map slice from the core valuation manual.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'core_manual_section',
        reviewPacketNotes: 'Role-map slice remains review-only until the later mechanics batches are added.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: 'Review-only framework map slice for the controlled VM-20 batch.',
      },
      {
        sourceId: 'vm20-section3-opener',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [50, 51],
        sectionReference: 'Section 3: Net Premium Reserve (applicability and opener)',
        citationText: 'The NPR for each policy must be determined on a seriatim basis pursuant to Section 3.',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'reserve_role_statement',
          'regulatory_requirement',
          'definition_or_terminology',
          'mechanics_boundary',
          'requires_human_interpretation',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'Section 3 opener confirms the NPR role but immediately approaches calculation terms; keep review-only.',
        summary:
          'Section 3 opens by confirming NPR applies on a seriatim basis to each policy, and the excerpt stays just before the detailed Section 3 calculation terms that will drive the next mechanics batch.',
        keywords: ['VM-20', 'NPR', 'Section 3', 'seriatim', 'applicability', 'review-only'],
        sourceNotes: 'Pages 50-51 only; opener and boundary slice for Section 3.',
        artifactProcessingStatus: 'review_pending',
        inventoryProcessingStatus: 'needs_human_review',
        authorityLevel: 'core_manual_section',
        reviewPacketNotes: 'Section 3 opener remains review-only until the detailed mechanics batch begins.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'review_pending',
        nonLearnerFacingNotes: 'Review-only boundary slice; not sufficient to teach mechanics.',
      },
    ],
  },
  'batch-005': {
    batchName: 'Controlled VM-20 batch 005 - NPR mechanics entry point',
    batchSlug: 'vm20-npr-entry-005',
    batchProfile: 'vm20_npr_mechanics_entry',
    processingIntentText:
      'Capture the first NPR mechanics block immediately after the Section 3 applicability opener, including the definition/setup layer and the initial formula block, then stop before Section 3.C assumptions.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. This batch stays review-only and uses narrow excerpt windows so the NPR entry layer remains separate from later assumptions and margins.',
    batchSummaryText:
      'Batch 005 remains review-only. The NPR setup slice and the initial formula slice capture the calculation entry point while the Section 3.C assumptions remain deferred to later batches.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally limited to the NPR mechanics entry point and the initial formula block; neither excerpt is approved for promotion.',
    reviewPacketNextStep:
      'Confirm whether batch-006 should begin with the Section 3.C assumption block or whether any additional NPR branch needs to be isolated first.',
    reviewerNotes:
      'Tiny NPR entry batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-npr-setup',
        severity: 'medium',
        sourceId: 'vm20-npr-entry-setup',
        itemId: 'item-vm20-npr-entry-setup-vm20-npr-005',
        flagType: 'npr_setup_slice',
        message:
          'The initial Section 3.B terms and terminal NPR setup are useful for mechanics orientation, but they remain review-only.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: 'flag-vm20-npr-formula',
        severity: 'medium',
        sourceId: 'vm20-npr-entry-formula',
        itemId: 'item-vm20-npr-entry-formula-vm20-npr-005',
        flagType: 'npr_formula_boundary',
        message:
          'The initial formula block captures NPR mechanics but stops before Section 3.C assumptions and later review scope.',
        notes: 'Suitable for review-only support, not promotion.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-npr-setup-scope',
        sourceId: 'vm20-npr-entry-setup',
        itemId: 'item-vm20-npr-entry-setup-vm20-npr-005',
        issueType: 'excerpt_window',
        details:
          'The setup slice spans pages 52-55 and keeps the actual formula block separate for review clarity.',
        recommendedAction:
          'Keep the setup slice review-only and use it to orient the calculation structure, not as the full NPR rule.',
      },
      {
        issueId: 'citation-vm20-npr-assumptions-boundary',
        sourceId: 'vm20-npr-entry-formula',
        itemId: 'item-vm20-npr-entry-formula-vm20-npr-005',
        issueType: 'assumptions_boundary',
        details:
          'The formula slice ends before Section 3.C on page 58, so mortality, lapse, and interest assumptions remain outside this batch.',
        recommendedAction:
          'Keep assumptions for a later batch and do not promote the formula slice as a full NPR treatment.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-npr-setup-vs-formula',
        decisionType: 'scope_split',
        question:
          'Should the NPR setup slice stay grouped with the formula block, or should the next batch split off assumptions first?',
        whyItMatters:
          'The entry-point batch should stay narrow enough to preserve the formula context without absorbing the Section 3.C assumption block.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-npr-batch006-start',
        decisionType: 'coverage_check',
        question:
          'Should batch-006 begin with the Section 3.C assumption block, or is there another NPR branch that needs to be isolated first?',
        whyItMatters:
          'The next batch should start cleanly at the assumption boundary rather than reopening the mechanics entry layer.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-npr-setup-boundary',
        severity: 'medium',
        issueType: 'definition_boundary',
        sourceId: 'vm20-npr-entry-setup',
        itemId: 'item-vm20-npr-entry-setup-vm20-npr-005',
        message:
          'The setup slice introduces the calculation terms but does not by itself complete the NPR mechanics, so it should remain review-only.',
        recommendedAction:
          'Use this slice only as mechanics orientation until the formula block is also reviewed.',
        evidence: 'Pages 52-55 define the key secondary guarantee terms and the terminal NPR setup.',
      },
      {
        issueId: 'issue-vm20-npr-assumptions-boundary',
        severity: 'medium',
        issueType: 'mechanics_boundary_confirmation',
        sourceId: 'vm20-npr-entry-formula',
        itemId: 'item-vm20-npr-entry-formula-vm20-npr-005',
        message:
          'The formula slice reaches the edge of Section 3.C assumptions on page 58, so the next batch should keep mortality, lapse, and interest assumptions separate.',
        recommendedAction:
          'Start assumptions in the next batch only if the boundary remains clean.',
        evidence: 'Page 57 references Section 3.C below.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'npr-entry-coverage',
        status: 'passed',
        details:
          'The selected pages capture the NPR setup and the initial formula block without crossing into Section 3.C assumptions.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'Each pilot item carries a source reference and a locator appropriate to the file type.',
      },
      {
        checkId: 'formula-context-preserved',
        status: 'passed',
        details: 'The setup slice and formula slice stay readable as a small mechanics-entry sequence.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the pilot.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-npr-entry-setup',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [52, 55],
        sectionReference: 'Section 3.B.1-3.B.5.c.i.3 (definitions and NPR setup)',
        citationText:
          'Section 3.B.4 and Section 3.B.5 provide the calculation of a terminal NPR under the assumption of an annual mode gross premium.',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'npr_mechanics',
          'definition_or_terminology',
          'regulatory_requirement',
          'calculation_structure',
          'cross_reference_mapping',
        ],
        reviewStatus: 'draft_candidate',
        itemKind: 'chunk',
        notes:
          'NPR setup slice for the mechanics entry point; keep review-only and do not promote.',
        summary:
          'Section 3.B introduces the term definitions for NPR mechanics, including secondary guarantees, fully funded, actual, and level guarantee concepts, plus the terminal NPR setup for term and ULSG categories before the formula block begins.',
        keywords: ['VM-20', 'NPR', 'secondary guarantee', 'terminal NPR', 'definitions', 'calculation setup'],
        sourceNotes: 'Pages 52-55 only; setup slice for the NPR mechanics entry point.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'core_manual_section',
        reviewPacketNotes: 'Setup slice remains review-only until the formula block and later assumptions are reviewed.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: 'Review-only setup slice for the NPR entry batch.',
      },
      {
        sourceId: 'vm20-npr-entry-formula',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [56, 57],
        sectionReference: 'Section 3.B.5.c.i.4 through Section 3.B.5.d (NPR formula and ULSG branch)',
        citationText: 'The NPR for an insured age x at issue at time t shall be according to the formula below.',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'npr_mechanics',
          'formula_context',
          'calculation_structure',
          'mechanics_boundary',
          'requires_human_interpretation',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'Formula slice and boundary to Section 3.C assumptions; keep review-only.',
        summary:
          'Section 3.B.5.c.i.4 introduces the NPR formula using ASG, FFSG, NSP, and expense allowance terms, and Section 3.B.5.d begins the no-secondary-guarantee branch that remains just before Section 3.C assumptions.',
        keywords: ['VM-20', 'NPR formula', 'ASG', 'FFSG', 'NSP', 'expense allowance', 'ULSG'],
        sourceNotes: 'Pages 56-57 only; formula and reserve branch slice for the NPR mechanics entry point.',
        artifactProcessingStatus: 'review_pending',
        inventoryProcessingStatus: 'needs_human_review',
        authorityLevel: 'core_manual_section',
        reviewPacketNotes: 'Formula slice remains review-only until the assumptions block is captured in a later batch.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'review_pending',
        nonLearnerFacingNotes: 'Review-only formula slice; not sufficient to teach the full NPR mechanics.',
      },
    ],
  },
  'batch-007': {
    batchName: 'Controlled VM-20 batch 007 - deterministic reserve entry point',
    batchSlug: 'vm20-dr-entry-007',
    batchProfile: 'vm20_dr_entry',
    processingIntentText:
      'Capture the Section 4 deterministic reserve entry point and stop before the Section 5 stochastic reserve opener.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. This batch stays review-only and keeps the DR opener separate from SR mechanics.',
    batchSummaryText:
      'Batch 007 remains review-only. The Section 4 slice captures the deterministic reserve entry language while leaving the Section 5 stochastic reserve opener for the next batch.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally limited to the deterministic reserve entry point; the DR opener is not promoted.',
    reviewPacketNextStep:
      'Confirm whether batch-008 should begin at the Section 5 opener or whether any additional boundary context is needed first.',
    reviewerNotes:
      'Tiny DR entry batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-section4-entry',
        severity: 'medium',
        sourceId: 'vm20-section4-entry',
        itemId: 'item-vm20-section4-entry-vm20-dr-entry-007',
        flagType: 'section4_boundary_slice',
        message:
          'The Section 4 opener is a narrow deterministic reserve boundary slice and should stay review-only.',
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-section4-boundary',
        sourceId: 'vm20-section4-entry',
        itemId: 'item-vm20-section4-entry-vm20-dr-entry-007',
        issueType: 'boundary_confirmation',
        details:
          'The Section 4 opener is concise and leads quickly toward the Section 5 stochastic reserve opener.',
        recommendedAction:
          'Keep the DR opener separate from the SR opener and do not merge the two reserve families.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-dr-openersplit',
        decisionType: 'scope_split',
        question:
          'Should the deterministic reserve opener remain a one-page boundary slice, or should it be expanded with one more page for context?',
        whyItMatters:
          'The DR entry point should stay narrow enough to preserve the handoff into the SR opener.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-sr-start',
        decisionType: 'coverage_check',
        question:
          'Should batch-008 begin immediately at the Section 5 opener, or is a shared boundary page still needed?',
        whyItMatters:
          'The next batch should start cleanly at the stochastic reserve entry point.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-section4-rule',
        severity: 'medium',
        issueType: 'reserve_boundary',
        sourceId: 'vm20-section4-entry',
        itemId: 'item-vm20-section4-entry-vm20-dr-entry-007',
        message:
          'The Section 4 language is an opener rather than the full deterministic reserve treatment, so it should remain review-only.',
        recommendedAction:
          'Use this slice only as the DR entry point and keep later DR mechanics for subsequent batches.',
        evidence: 'Page 66 introduces the Section 4 deterministic reserve boundary.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'section4-entry-coverage',
        status: 'passed',
        details: 'The selected page captures the deterministic reserve entry point only.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The DR opener carries a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the batch.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-section4-entry',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [66, 66],
        sectionReference: 'Section 4: Deterministic Reserve (entry point)',
        citationText:
          'For a universal life policy, the NPR shall not be less than the greater of:',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'deterministic_reserve',
          'regulatory_requirement',
          'mechanics_boundary',
          'requires_human_interpretation',
        ],
        reviewStatus: 'draft_candidate',
        itemKind: 'chunk',
        notes:
          'Section 4 opener; keep review-only and stop before the stochastic reserve opener.',
        summary:
          'Section 4 opens the deterministic reserve floor by tying the NPR to the policy cash surrender value and related cost-of-insurance floor language before the broader DR mechanics continue.',
        keywords: ['VM-20', 'Section 4', 'deterministic reserve', 'NPR floor', 'entry point'],
      },
    ],
  },
  'batch-008': {
    batchName: 'Controlled VM-20 batch 008 - stochastic reserve entry point',
    batchSlug: 'vm20-sr-entry-008',
    batchProfile: 'vm20_sr_entry',
    processingIntentText:
      'Capture the Section 5 stochastic reserve opener and the first aggregation language, then stop before Section 6 exclusion tests.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. This batch stays review-only and keeps the SR opener separate from the exclusion-test section.',
    batchSummaryText:
      'Batch 008 remains review-only. The Section 5 slice captures the SR opener and early aggregation language while leaving the Section 6 exclusion tests for the next batch.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally limited to the stochastic reserve entry point; the SR opener is not promoted.',
    reviewPacketNextStep:
      'Confirm whether batch-009 should begin at the SET opener or whether any SR boundary context needs to remain with this slice.',
    reviewerNotes:
      'Tiny SR entry batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-section5-entry',
        severity: 'medium',
        sourceId: 'vm20-section5-entry',
        itemId: 'item-vm20-section5-entry-vm20-sr-entry-008',
        flagType: 'section5_boundary_slice',
        message:
          'The Section 5 opener is a narrow stochastic reserve boundary slice and should stay review-only.',
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-section5-boundary',
        sourceId: 'vm20-section5-entry',
        itemId: 'item-vm20-section5-entry-vm20-sr-entry-008',
        issueType: 'boundary_confirmation',
        details:
          'The Section 5 opener quickly leads into aggregation language that is only a small part of the later SR mechanics.',
        recommendedAction:
          'Keep the SR opener separate from the Section 6 exclusion-test language and do not treat it as the full SR treatment.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-sr-openersplit',
        decisionType: 'scope_split',
        question:
          'Should the Section 5 opener remain a narrow entry slice, or should one more page of aggregation context be carried with it?',
        whyItMatters:
          'The SR entry point should stay narrow enough to preserve the exclusion-test boundary.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-exclusion-start',
        decisionType: 'coverage_check',
        question:
          'Should batch-009 begin immediately at the Section 6 opener, or is a shared boundary page still needed?',
        whyItMatters:
          'The next batch should start cleanly at the exclusion-test section.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-section5-rule',
        severity: 'medium',
        issueType: 'reserve_boundary',
        sourceId: 'vm20-section5-entry',
        itemId: 'item-vm20-section5-entry-vm20-sr-entry-008',
        message:
          'The Section 5 language is an opener rather than the full stochastic reserve treatment, so it should remain review-only.',
        recommendedAction:
          'Use this slice only as the SR entry point and keep later SR mechanics for subsequent batches.',
        evidence: 'Pages 67-68 introduce the Section 5 stochastic reserve boundary and aggregation language.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'section5-entry-coverage',
        status: 'passed',
        details: 'The selected pages capture the stochastic reserve entry point only.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The SR opener carries a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the batch.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-section5-entry',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [67, 68],
        sectionReference: 'Section 5: Stochastic Reserve (entry point and aggregation)',
        citationText:
          'In determining the SR, the company shall determine the number and composition of subgroups for aggregation purposes.',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'stochastic_reserve',
          'regulatory_requirement',
          'mechanics_boundary',
          'requires_human_interpretation',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'Section 5 opener; keep review-only and stop before Section 6 exclusion tests.',
        summary:
          'Section 5 opens the stochastic reserve framework and begins the subgroup aggregation language before the exclusion tests take over in Section 6.',
        keywords: ['VM-20', 'Section 5', 'stochastic reserve', 'aggregation', 'entry point'],
      },
    ],
  },
  'batch-009': {
    batchName: 'Controlled VM-20 batch 009 - exclusion tests',
    batchSlug: 'vm20-exclusion-009',
    batchProfile: 'vm20_exclusion_tests',
    processingIntentText:
      'Capture the Section 6 stochastic and deterministic exclusion tests, then stop before Section 7 cash-flow models.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. This batch stays review-only and keeps exclusion-test language separate from the cash-flow model section.',
    batchSummaryText:
      'Batch 009 remains review-only. The Section 6 slice captures the exclusion-test framework, including SET, SERT, and DET boundaries, while leaving Section 7 for later batches.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally limited to the exclusion-test section; the test language is not promoted.',
    reviewPacketNextStep:
      'Confirm whether batch-010 should begin at the Section 7 model-structure opener or whether a shared boundary page is still needed.',
    reviewerNotes:
      'Tiny exclusion-test batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-section6-tests',
        severity: 'medium',
        sourceId: 'vm20-section6-exclusion-tests',
        itemId: 'item-vm20-section6-exclusion-tests-vm20-exclusion-009',
        flagType: 'exclusion_test_slice',
        message:
          'Section 6 contains both stochastic and deterministic exclusion tests and should remain review-only until the boundary is clear.',
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-section6-boundary',
        sourceId: 'vm20-section6-exclusion-tests',
        itemId: 'item-vm20-section6-exclusion-tests-vm20-exclusion-009',
        issueType: 'boundary_split',
        details:
          'The SET, SERT, and DET language spans multiple pages and leads into the cash-flow model section.',
        recommendedAction:
          'Keep the exclusion tests separate from Section 7 and do not fold the boundary text into model mechanics.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-section6-split',
        decisionType: 'scope_split',
        question:
          'Should the SET/SERT language stay grouped with the DET boundary, or should those tests be split into separate later review slices?',
        whyItMatters:
          'The exclusion-test batch should stay narrow enough that the Section 7 handoff remains clean.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-section7-start',
        decisionType: 'coverage_check',
        question:
          'Should batch-010 begin at the Section 7 model-structure opener, or is one more transition slice needed first?',
        whyItMatters:
          'The next batch should start cleanly at the cash-flow model section.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-section6-set',
        severity: 'medium',
        issueType: 'eligibility_threshold',
        sourceId: 'vm20-section6-exclusion-tests',
        itemId: 'item-vm20-section6-exclusion-tests-vm20-exclusion-009',
        message:
          'The SET and SERT requirements are explicit eligibility thresholds, but the later DET material remains adjacent and review-only.',
        recommendedAction:
          'Keep the exclusion-test thresholds as review-only until the cash-flow model boundary is handled separately.',
        evidence: 'Pages 69-72 cover the SET and SERT framework.',
      },
      {
        issueId: 'issue-vm20-section6-det-boundary',
        severity: 'medium',
        issueType: 'boundary_confirmation',
        sourceId: 'vm20-section6-exclusion-tests',
        itemId: 'item-vm20-section6-exclusion-tests-vm20-exclusion-009',
        message:
          'The DET material reaches the Section 7 boundary, so later batches should not absorb cash-flow-model language into this slice.',
        recommendedAction:
          'Keep Section 7 for the next batch and treat the DET language as a boundary slice only.',
        evidence: 'Pages 73-74 transition out of Section 6 and toward Section 7.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'section6-coverage',
        status: 'passed',
        details: 'The selected pages capture the Section 6 exclusion-test framework and stop before Section 7.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The exclusion-test slice carries a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the batch.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-section6-exclusion-tests',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [69, 74],
        sectionReference: 'Section 6: Stochastic and Deterministic Exclusion Tests',
        citationText:
          'Groups of policies pass the SET if one of the following is met:',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'exclusion_tests',
          'regulatory_requirement',
          'cross_reference_mapping',
          'mechanics_boundary',
        ],
        reviewStatus: 'draft_candidate',
        itemKind: 'chunk',
        notes:
          'Section 6 exclusion-test slice; keep review-only and stop before Section 7.',
        summary:
          'Section 6 lays out the stochastic and deterministic exclusion tests, including SET, SERT, and DET language that determines whether the reserve mechanics continue into Section 7.',
        keywords: ['VM-20', 'Section 6', 'SET', 'SERT', 'DET', 'exclusion tests'],
      },
    ],
  },
  'batch-010': {
    batchName: 'Controlled VM-20 batch 010 - cash-flow model structure',
    batchSlug: 'vm20-cfm-structure-010',
    batchProfile: 'vm20_cash_flow_model_structure',
    processingIntentText:
      'Capture the Section 7 cash-flow model structure, NGE, starting assets, and PIMR boundary, then stop before the deeper asset mechanics.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. This batch stays review-only and keeps the Section 7 entry layer separate from the later asset mechanics.',
    batchSummaryText:
      'Batch 010 remains review-only. The Section 7 structure slice captures model structure, NGE, starting assets, and PIMR context while leaving the later asset mechanics for the next batch.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally limited to the Section 7 structure slice; the model-entry language is not promoted.',
    reviewPacketNextStep:
      'Confirm whether batch-011 should begin with the asset-return and proxy mechanics or whether a shorter boundary slice is needed first.',
    reviewerNotes:
      'Tiny Section 7 structure batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-section7-structure',
        severity: 'medium',
        sourceId: 'vm20-section7-model-structure',
        itemId: 'item-vm20-section7-model-structure-vm20-cfm-structure-010',
        flagType: 'cash_flow_model_structure',
        message:
          'The Section 7 model structure slice is a narrow entry point and should stay review-only.',
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-section7-boundary',
        sourceId: 'vm20-section7-model-structure',
        itemId: 'item-vm20-section7-model-structure-vm20-cfm-structure-010',
        issueType: 'boundary_split',
        details:
          'The Section 7 entry language leads directly into starting-asset and PIMR treatment, which will need later review slices.',
        recommendedAction:
          'Keep the Section 7 structure slice separate from the later asset mechanics and avoid absorbing the proxy-fund language.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-section7-structure-split',
        decisionType: 'scope_split',
        question:
          'Should the Section 7 structure batch stay limited to the model-structure opener, or should it also absorb one more starting-asset page?',
        whyItMatters:
          'The Section 7 entry layer needs to remain narrow enough that the asset-mechanics batch can start cleanly.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-section7-asset-start',
        decisionType: 'coverage_check',
        question:
          'Should batch-011 begin at the asset-mechanics boundary, or does the current slice already include enough starting-asset context?',
        whyItMatters:
          'The next batch should start cleanly at the asset mechanics.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-section7-structure',
        severity: 'medium',
        issueType: 'model_structure',
        sourceId: 'vm20-section7-model-structure',
        itemId: 'item-vm20-section7-model-structure-vm20-cfm-structure-010',
        message:
          'The model-structure language is explicit but still only an entry point into the cash-flow model section.',
        recommendedAction:
          'Keep the structure slice review-only and leave later asset-return and proxy mechanics for the next batch.',
        evidence: 'Pages 75-79 cover model structure, NGE, starting assets, and PIMR context.',
      },
      {
        issueId: 'issue-vm20-section7-pimr-boundary',
        severity: 'medium',
        issueType: 'boundary_confirmation',
        sourceId: 'vm20-section7-model-structure',
        itemId: 'item-vm20-section7-model-structure-vm20-cfm-structure-010',
        message:
          'The PIMR language is a boundary issue because it is tied to the starting-assets discussion that continues in the next batch.',
        recommendedAction:
          'Keep PIMR in this structure slice only as review context and do not promote it.',
        evidence: 'Page 79 ties PIMR treatment to the Section 7 model-structure discussion.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'section7-structure-coverage',
        status: 'passed',
        details: 'The selected pages capture the Section 7 model-structure entry layer and stop before the deeper asset mechanics.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The Section 7 structure slice carries a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the batch.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-section7-model-structure',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [75, 79],
        sectionReference: 'Section 7: Cash-Flow Models (model structure and starting assets)',
        citationText:
          'The company shall design and use a cash-flow model that:',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'cash_flow_models',
          'regulatory_requirement',
          'asset_allocation',
          'requires_human_interpretation',
        ],
        reviewStatus: 'draft_candidate',
        itemKind: 'chunk',
        notes:
          'Section 7 model-structure slice; keep review-only and stop before the deeper asset mechanics.',
        summary:
          'Section 7 requires a cash-flow model that follows ASOPs, uses asset-segmentation-consistent model segments, and ties starting assets to the later PIMR and reserve calculations.',
        keywords: ['VM-20', 'Section 7', 'cash-flow model', 'NGE', 'starting assets', 'PIMR'],
      },
    ],
  },
  'batch-011': {
    batchName: 'Controlled VM-20 batch 011 - cash-flow model asset mechanics',
    batchSlug: 'vm20-cfm-assets-011',
    batchProfile: 'vm20_cash_flow_model_asset_mechanics',
    processingIntentText:
      'Capture the Section 7 asset-return, proxy-fund, scenario, and derivative-program mechanics, then stop before Section 8 reinsurance.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. This batch stays review-only and keeps the Section 7 asset mechanics separate from reinsurance.',
    batchSummaryText:
      'Batch 011 remains review-only. The Section 7 asset-mechanics slice captures asset returns, proxy funds, scenario language, and derivative-program context while leaving Section 8 for the final batch.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally limited to the asset-mechanics slice; the scenario and proxy language is not promoted.',
    reviewPacketNextStep:
      'Confirm whether batch-012 should begin at the Section 8 reinsurance opener or whether one more Section 7 cleanup slice is needed first.',
    reviewerNotes:
      'Tiny Section 7 asset-mechanics batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-section7-assets',
        severity: 'medium',
        sourceId: 'vm20-section7-asset-mechanics',
        itemId: 'item-vm20-section7-asset-mechanics-vm20-cfm-assets-011',
        flagType: 'asset_mechanics_slice',
        message:
          'The Section 7 asset-mechanics slice is intentionally narrow and should remain review-only.',
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-section7-assets-boundary',
        sourceId: 'vm20-section7-asset-mechanics',
        itemId: 'item-vm20-section7-asset-mechanics-vm20-cfm-assets-011',
        issueType: 'boundary_split',
        details:
          'The asset-mechanics language spans proxy funds, scenario returns, and derivative-program mechanics and ends at the Section 8 boundary.',
        recommendedAction:
          'Keep the Section 7 asset mechanics separate from reinsurance and do not merge the Section 8 opener into this slice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-section7-assets-split',
        decisionType: 'scope_split',
        question:
          'Should the Section 7 asset batch stay as one slice, or should proxy-fund language be separated from the derivative-program language?',
        whyItMatters:
          'The asset-mechanics batch needs to remain reviewable without becoming too bulky.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-section8-start',
        decisionType: 'coverage_check',
        question:
          'Should batch-012 begin at the Section 8 reinsurance opener, or is one more boundary slice needed from Section 7 first?',
        whyItMatters:
          'The last batch should start cleanly at the reinsurance section.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-section7-assets',
        severity: 'medium',
        issueType: 'asset_modeling_judgment',
        sourceId: 'vm20-section7-asset-mechanics',
        itemId: 'item-vm20-section7-asset-mechanics-vm20-cfm-assets-011',
        message:
          'The asset-return, proxy-fund, and derivative-program language requires judgment and should stay review-only.',
        recommendedAction:
          'Keep the Section 7 asset mechanics out of learner-facing output until the boundary is confirmed.',
        evidence: 'Pages 80-87 cover asset returns, proxy funds, scenario language, and derivative programs.',
      },
      {
        issueId: 'issue-vm20-section7-boundary',
        severity: 'medium',
        issueType: 'mechanics_boundary_confirmation',
        sourceId: 'vm20-section7-asset-mechanics',
        itemId: 'item-vm20-section7-asset-mechanics-vm20-cfm-assets-011',
        message:
          'The asset-mechanics text ends at the Section 8 boundary and should not absorb the reinsurance material.',
        recommendedAction:
          'Leave Section 8 for the final batch and keep this slice review-only.',
        evidence: 'Page 87 leads directly into the derivative-program boundary and the next section.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'section7-asset-coverage',
        status: 'passed',
        details: 'The selected pages capture the Section 7 asset mechanics and stop before Section 8.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The Section 7 asset slice carries a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the batch.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-section7-asset-mechanics',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [80, 87],
        sectionReference: 'Section 7: Cash-Flow Models (asset mechanics)',
        citationText:
          'The company shall map each of the proxy funds defined in Section 7.I and Section 7.J to the prescribed fund returns defined in Section 7.G.2.a.',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'cash_flow_models',
          'asset_modeling_judgment',
          'proxy_mapping',
          'boundary_spillover',
          'requires_human_interpretation',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'Section 7 asset-mechanics slice; keep review-only and stop before Section 8.',
        summary:
          'Section 7 continues through asset returns, borrowing assumptions, reinvestment assets, proxy-fund mapping, scenario counts, and derivative-program mechanics before the reinsurance section begins.',
        keywords: ['VM-20', 'Section 7', 'asset mechanics', 'proxy funds', 'scenario returns', 'derivatives'],
      },
    ],
  },
  'batch-012': {
    batchName: 'Controlled VM-20 batch 012 - reinsurance and Section 9 boundary',
    batchSlug: 'vm20-reinsurance-012',
    batchProfile: 'vm20_reinsurance_boundary',
    processingIntentText:
      'Capture the Section 8 reinsurance treatment and the Section 9 assumptions boundary, then end the controlled sequence.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. This batch stays review-only and keeps the reinsurance treatment separate from the later assumptions section.',
    batchSummaryText:
      'Batch 012 remains review-only. The Section 8 slice captures reinsurance credit, ceded cash flows, and the pre-reinsurance reserve boundary while leaving the Section 9 assumptions opening for review-only cleanup.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally limited to the reinsurance and Section 9 boundary slice; the material is not promoted.',
    reviewPacketNextStep:
      'Review the unresolved issues and decide whether Section 9 assumptions need a later cleanup batch before any larger expansion.',
    reviewerNotes:
      'Tiny reinsurance boundary batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-section8-reinsurance',
        severity: 'medium',
        sourceId: 'vm20-section8-reinsurance',
        itemId: 'item-vm20-section8-reinsurance-vm20-reinsurance-012',
        flagType: 'reinsurance_slice',
        message:
          'The Section 8 reinsurance treatment is intentionally isolated and should remain review-only.',
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-section8-boundary',
        sourceId: 'vm20-section8-reinsurance',
        itemId: 'item-vm20-section8-reinsurance-vm20-reinsurance-012',
        issueType: 'boundary_split',
        details:
          'The reinsurance language leads directly into the Section 9 assumptions opening, so the boundary must stay visible.',
        recommendedAction:
          'Keep the Section 8 material review-only and do not merge the Section 9 assumptions into learner-facing output.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-section8-split',
        decisionType: 'scope_split',
        question:
          'Should the Section 8 reinsurance batch stay as one slice, or should the pre-reinsurance reserve boundary be separated from the ceded-cash-flow language?',
        whyItMatters:
          'The reinsurance batch needs to remain reviewable without becoming too bulky.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-section9-followup',
        decisionType: 'coverage_check',
        question:
          'Should Section 9 assumptions be left as review-only cleanup in this batch, or should a later batch isolate them further?',
        whyItMatters:
          'The controlled VM-20 sequence ends here, so any Section 9 cleanup needs a clear reviewer decision.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-section8-reinsurance',
        severity: 'medium',
        issueType: 'ceded_reserve_treatment',
        sourceId: 'vm20-section8-reinsurance',
        itemId: 'item-vm20-section8-reinsurance-vm20-reinsurance-012',
        message:
          'The reinsurance credit and cash-flow language depends on assumptions and should stay review-only until a human confirms the treatment.',
        recommendedAction:
          'Keep the Section 8 reinsurance language out of learner-facing output until the boundary is confirmed.',
        evidence: 'Pages 88-93 cover the reinsurance credit and ceded cash-flow requirements.',
      },
      {
        issueId: 'issue-vm20-section9-boundary',
        severity: 'medium',
        issueType: 'boundary_confirmation',
        sourceId: 'vm20-section8-reinsurance',
        itemId: 'item-vm20-section8-reinsurance-vm20-reinsurance-012',
        message:
          'The Section 9 assumptions opening appears immediately after the reinsurance boundary and should remain review-only cleanup.',
        recommendedAction:
          'Leave Section 9 assumptions for later cleanup if the reviewer wants a separate slice.',
        evidence: 'Pages 94-95 transition from Section 8 into Section 9 assumptions language.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'section8-boundary-coverage',
        status: 'passed',
        details: 'The selected pages capture the reinsurance treatment and the Section 9 boundary.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The reinsurance slice carries a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the batch.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-section8-reinsurance',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [88, 95],
        sectionReference: 'Section 8: Reinsurance and Section 9 assumptions boundary',
        citationText:
          'The credit taken under a coinsurance arrangement shall be calculated using the same methodology and assumptions used in determining its NPR, but only for the percentage of the risk that was reinsured.',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'reinsurance',
          'regulatory_requirement',
          'cross_reference_mapping',
          'requires_human_interpretation',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'Section 8 reinsurance slice; keep review-only and stop at the Section 9 boundary.',
        summary:
          'Section 8 explains the credit to NPR for ceded reinsurance, projected ceded cash flows, and the pre-reinsurance-ceded minimum reserve boundary while Section 9 assumptions begin at the end of the slice.',
        keywords: ['VM-20', 'Section 8', 'reinsurance', 'ceded cash flows', 'Section 9', 'boundary'],
      },
    ],
  },
  'batch-006': {
    batchName: 'Controlled VM-20 batch 006 - Section 3.C assumptions',
    batchSlug: 'vm20-section3c-006',
    batchProfile: 'vm20_section3c_assumptions',
    processingIntentText:
      'Capture the Section 3.C assumption block for mortality, interest, and lapse, then stop before the Section 4 deterministic reserve entry point.',
    processingIntentNotes:
      'Controlled VM-20 workflow proof only. This batch stays review-only and keeps Section 3.C separate from the deterministic reserve entry point.',
    batchSummaryText:
      'Batch 006 remains review-only. The Section 3.C assumptions slice captures the mortality, interest, and lapse framework while leaving the Section 4 deterministic reserve entry point for later.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This controlled VM-20 batch is intentionally limited to Section 3.C assumptions; the assumptions layer is not promoted.',
    reviewPacketNextStep:
      'Confirm whether batch-007 should begin at the Section 4 opener or whether any additional floor-language context needs to stay with the assumption slice.',
    reviewerNotes:
      'Tiny assumptions batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: 'flag-vm20-section3c-assumptions',
        severity: 'medium',
        sourceId: 'vm20-section3c-assumptions',
        itemId: 'item-vm20-section3c-assumptions-vm20-section3c-006',
        flagType: 'assumption_slice',
        message:
          'The Section 3.C assumption block is intentionally isolated so later DR and SR mechanics do not absorb it.',
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-vm20-section3c-scope',
        sourceId: 'vm20-section3c-assumptions',
        itemId: 'item-vm20-section3c-assumptions-vm20-section3c-006',
        issueType: 'assumptions_scope_confirmation',
        details:
          'The Section 3.C slice includes mortality, interest, and lapse assumptions but stops before the Section 4 deterministic reserve entry.',
        recommendedAction:
          'Keep Section 3.C as a review-only assumption slice and do not collapse it into later reserve mechanics.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-vm20-section3c-split',
        decisionType: 'scope_split',
        question:
          'Should mortality stay grouped with the interest and lapse assumptions, or should any of those assumptions be split into a later boundary batch?',
        whyItMatters:
          'The assumptions slice needs to stay narrow enough that later DR and SR mechanics remain separate.',
        recommendedOwner: 'source reviewer',
        priority: 'high',
      },
      {
        decisionId: 'decision-vm20-section4-start',
        decisionType: 'coverage_check',
        question:
          'Should batch-007 begin at the Section 4 opener, or is one more floor-language slice needed before the deterministic reserve entry point?',
        whyItMatters:
          'The next batch should start cleanly at Section 4 rather than reopening the assumption layer.',
        recommendedOwner: 'processor owner',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-vm20-section3c-mortality',
        severity: 'medium',
        issueType: 'assumption_control',
        sourceId: 'vm20-section3c-assumptions',
        itemId: 'item-vm20-section3c-assumptions-vm20-section3c-006',
        message:
          'Mortality table substitutions, improvement factors, and non-US table adjustments are all assumption-layer material and should stay review-only.',
        recommendedAction:
          'Keep the mortality material as a boundary slice until the later mechanics batches are reviewed.',
        evidence: 'Pages 58-62 cover mortality tables, preferred structure tables, and non-US valuation mortality guidance.',
      },
      {
        issueId: 'issue-vm20-section3c-boundary',
        severity: 'medium',
        issueType: 'mechanics_boundary_confirmation',
        sourceId: 'vm20-section3c-assumptions',
        itemId: 'item-vm20-section3c-assumptions-vm20-section3c-006',
        message:
          'The interest and lapse lines reach the edge of the Section 4 boundary, so later batches should not backfill the deterministic reserve opener into this slice.',
        recommendedAction:
          'Keep the Section 4 opener separate and start the next batch at the DR entry point.',
        evidence: 'Pages 63-65 end at the start of the Section 4 boundary language.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'section3c-coverage',
        status: 'passed',
        details: 'The selected pages capture the Section 3.C assumption block and stop before Section 4.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The assumption slice carries a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
      },
      {
        checkId: 'no-promotion-output',
        status: 'passed',
        details: 'No approved-promoted or app-ready export was produced for the batch.',
      },
      {
        checkId: 'review-only-guardrails',
        status: 'passed',
        details: 'Review packet stays not approved and unresolved issues remain visible for human review.',
      },
    ],
    sourceSelections: [
      {
        sourceId: 'vm20-section3c-assumptions',
        relativePath: 'pbr_data_valuation_manual_2026.pdf',
        sourceFamilyId: 'valuation_manual_pdfs',
        documentType: 'valuation_manual_section',
        sourceTitle: 'Valuation Manual',
        sourceReference: '2026 NAIC Valuation Manual',
        versionDate: null,
        pageWindow: [58, 65],
        sectionReference: 'Section 3.C assumptions (mortality, interest, lapse)',
        citationText:
          'The mortality tables to be used are those defined in Section 3.C.1 and in VM-M Section 1.H.',
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'assumption_layer',
          'regulatory_requirement',
          'cross_reference_mapping',
          'requires_human_interpretation',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'Section 3.C assumption block; keep review-only and stop before Section 4.',
        summary:
          'Section 3.C establishes the mortality table framework, interest-rate rounding, and lapse-rate rules that feed the NPR before the Section 4 deterministic reserve entry point begins.',
        keywords: ['VM-20', 'Section 3.C', 'mortality', 'interest', 'lapse', 'assumptions'],
      },
    ],
  },
  ...vm20PracticeNoteBatchDefinitions,
  ...supportingBatchDefinitions,
  ...vm21BatchDefinitions,
  ...vm22BatchDefinitions,
}
