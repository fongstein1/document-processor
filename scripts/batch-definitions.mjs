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
}
