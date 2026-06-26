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
}
