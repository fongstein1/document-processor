const rawSourceFile = 'pbr_data_valuation_manual_2026.pdf'
const sourceFamilyId = 'valuation_manual_pdfs'
const sourceTitle = 'Valuation Manual'
const sourceReference = '2026 NAIC Valuation Manual'
const defaultNonLearnerNotes =
  'Supporting chapter slice retained as review-only until the wave is explicitly expanded.'

const makeSupportingBatch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `Supporting VM batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'supporting_vm_chapter',
    processingIntentText:
      spec.processingIntentText ??
      `Capture the ${spec.batchTitle} as a review-only support slice so the chapter boundary stays narrow and reviewable.`,
    processingIntentNotes:
      'Supporting VM workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This supporting chapter batch is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small supporting chapter batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: spec.flagSeverity ?? 'medium',
        sourceId,
        itemId,
        flagType: spec.flagType,
        message: spec.flagMessage,
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}`,
        sourceId,
        itemId,
        issueType: spec.citationIssueType ?? 'boundary_control_window',
        details: spec.citationDetails,
        recommendedAction: spec.citationAction,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: spec.decisionType,
        question: spec.decisionQuestion,
        whyItMatters: spec.decisionWhy,
        recommendedOwner: spec.recommendedOwner ?? 'source reviewer',
        priority: spec.decisionPriority ?? 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}`,
        severity: spec.issueSeverity ?? 'medium',
        issueType: spec.issueType,
        sourceId,
        itemId,
        message: spec.issueMessage,
        recommendedAction: spec.issueAction,
        evidence: spec.issueEvidence,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Supporting manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: spec.validationCheckId,
        status: 'passed',
        details: spec.validationCheckDetails,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The selected pages carry a source reference and a page locator.',
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
        sourceId,
        relativePath: rawSourceFile,
        sourceFamilyId,
        documentType: 'valuation_manual_section',
        sourceTitle,
        sourceReference,
        versionDate: null,
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: 'high',
        reviewFlags: ['core_vm_course', 'supporting_vm_chapter', ...spec.reviewFlags],
        reviewStatus: spec.reviewStatus ?? 'needs_human_review',
        itemKind: 'chunk',
        notes: spec.notes,
        summary: spec.summary,
        keywords: spec.keywords,
        sourceNotes: spec.sourceNotes,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: spec.authorityLevel ?? 'core_manual_section',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: spec.nonLearnerFacingNotes ?? defaultNonLearnerNotes,
      },
    ],
  }
}

const supportingBatchSpecs = [
  {
    plannedBatchId: 'batch-013',
    batchSlug: 'supporting-vm-013',
    sourceId: 'supporting-vm01-definitions',
    batchTitle: 'VM-01 definitions and introduction',
    summaryLead: 'VM-01 defines terms and introductory material needed for later chapters',
    pageWindow: [25, 39],
    sectionReference: 'VM-01: Definitions for Terms in Requirements',
    citationText: 'VM-01: Definitions for Terms in Requirements',
    summary:
      'VM-01 defines terms used throughout the Valuation Manual and notes that some terms are defined in specific sections instead of the chapter-wide glossary.',
    keywords: ['VM-01', 'definitions', 'terminology', 'cross-references', 'supporting chapter'],
    notes: 'VM-01 chapter retained as a review-only supporting batch.',
    sourceNotes: 'Pages 25-39 only; chapter opener plus definitions slice.',
    reviewFlags: ['definition_or_terminology', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'definition_slice',
    flagMessage:
      'The VM-01 slice is a definitions chapter and should remain review-only until the terms are mapped to later operational chapters.',
    citationDetails:
      'The VM-01 chapter spans pages 25-39 and is largely definition-driven, so the boundary should stay visible in review.',
    citationAction: 'Keep VM-01 review-only and do not merge its definitions into operational chapter text.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should VM-01 stay as one definitions batch, or should certain cross-reference terms be split into later chapter-specific batches?',
    decisionWhy: 'The supporting wave should keep definitions separate from later operational requirements.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'VM-01 contains cross-referenced terms that support later chapters but should not be treated as operational instructions on their own.',
    issueAction:
      'Keep VM-01 in review-only status until later chapter batches confirm the operational context for the terms.',
    issueEvidence: 'Pages 25-39 define terms used elsewhere in the Valuation Manual.',
    validationCheckId: 'vm01-coverage',
    validationCheckDetails: 'The selected pages capture the VM-01 definitions and introductory material.',
    nextStep:
      'Confirm whether later supporting batches should split out any VM-01 cross-reference terms before broader extraction starts.',
  },
  {
    plannedBatchId: 'batch-014',
    batchSlug: 'supporting-vm-014',
    sourceId: 'supporting-vm02-nonforfeiture',
    batchTitle: 'VM-02 nonforfeiture mortality and interest',
    summaryLead: 'VM-02 sets the nonforfeiture mortality and interest framework for later review',
    pageWindow: [41, 44],
    sectionReference: 'VM-02: Minimum Nonforfeiture Mortality and Interest',
    citationText: 'VM-02: Minimum Nonforfeiture Mortality and Interest',
    summary:
      'VM-02 sets the minimum nonforfeiture mortality and interest framework and notes how the chapter coordinates with other valuation requirements.',
    keywords: ['VM-02', 'nonforfeiture', 'mortality', 'interest', 'supporting chapter'],
    notes: 'VM-02 chapter retained as a review-only supporting batch.',
    sourceNotes: 'Pages 41-44 only; chapter opener plus requirements slice.',
    reviewFlags: ['reserve_method_structure', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'reserve_method_structure',
    flagMessage:
      'The VM-02 slice explains the minimum nonforfeiture framework and should remain review-only until later use is confirmed.',
    citationDetails:
      'The VM-02 chapter is short and structurally focused, but the boundary still needs to remain visible in review.',
    citationAction: 'Keep VM-02 review-only and do not merge it into later chapter requirements.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should VM-02 stay as a single nonforfeiture chapter batch, or should interest and mortality be separated later?',
    decisionWhy: 'The supporting wave should keep the reserve-method structure simple and reviewable.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'VM-02 references the Valuation Manual structure and later coordination points, so the chapter should stay review-only until the context is fully mapped.',
    issueAction:
      'Keep VM-02 as supporting material and do not overread it as a standalone operational instruction set.',
    issueEvidence: 'Pages 41-44 define purpose, applicability, interest, and mortality.',
    validationCheckId: 'vm02-coverage',
    validationCheckDetails: 'The selected pages capture the VM-02 nonforfeiture mortality and interest chapter.',
    nextStep: 'Confirm whether later supporting batches need a further split between the interest and mortality parts of VM-02.',
  },
  {
    plannedBatchId: 'batch-015',
    batchSlug: 'supporting-vm-015',
    sourceId: 'supporting-vm25-health-reserves',
    batchTitle: 'VM-25 health insurance reserves',
    summaryLead: 'VM-25 is a small A&H reserve chapter that stays review-only',
    pageWindow: [319, 320],
    sectionReference: 'VM-25: Health Insurance Reserves Minimum Reserve Requirements',
    citationText: 'VM-25: Health Insurance Reserves Minimum Reserve Requirements',
    summary:
      'VM-25 states the minimum reserve requirements for individual and group A&H insurance and points to AP&P Manual appendices for the detailed requirements.',
    keywords: ['VM-25', 'A&H reserves', 'minimum reserve requirements', 'Appendix A', 'Appendix C'],
    notes: 'VM-25 chapter retained as a review-only supporting batch.',
    sourceNotes: 'Pages 319-320 only; chapter opener and short continuation slice.',
    reviewFlags: ['regulatory_requirement', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'applicability_boundary',
    flagMessage:
      'VM-25 applies the AP&P Manual requirements to A&H reserve requirements and should remain review-only until the boundary is confirmed.',
    citationDetails:
      'The VM-25 chapter is short but still needs a visible boundary because it relies on AP&P Manual and appendix cross-references.',
    citationAction: 'Keep VM-25 review-only and do not merge its reserve requirements into later chapters.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should VM-25 stay as one health-insurance reserve chapter batch, or should later A&H references be split out separately?',
    decisionWhy: 'The supporting wave should keep applicability and requirement language simple and reviewable.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'VM-25 relies on AP&P Manual appendices and related actuarial guidelines, so the chapter should stay review-only until those cross-references are handled deliberately.',
    issueAction:
      'Keep VM-25 as supporting material and preserve the cross-reference notes in review packets.',
    issueEvidence: 'Page 319 cites Appendix A and Appendix C material for A&H reserve requirements.',
    validationCheckId: 'vm25-coverage',
    validationCheckDetails: 'The selected pages capture the VM-25 health insurance reserves chapter.',
    nextStep: 'Confirm whether VM-25 should remain a standalone chapter slice or be paired with a later A&H support batch.',
  },
  {
    plannedBatchId: 'batch-016',
    batchSlug: 'supporting-vm-016',
    sourceId: 'supporting-vm26-credit-disability',
    batchTitle: 'VM-26 credit life and disability reserves',
    summaryLead: 'VM-26 covers credit life and disability reserve requirements and stays unpromoted',
    pageWindow: [321, 324],
    sectionReference: 'VM-26: Credit Life and Disability Reserve Requirements',
    citationText: 'VM-26: Credit Life and Disability Reserve Requirements',
    summary:
      'VM-26 defines the minimum valuation standards for credit life and credit disability insurance, including reserve methods, mortality, interest, and additional reserve rules.',
    keywords: ['VM-26', 'credit life', 'credit disability', 'reserve requirements', 'supporting chapter'],
    notes: 'VM-26 chapter retained as a review-only supporting batch.',
    sourceNotes: 'Pages 321-324 only; chapter opener and requirement slice.',
    reviewFlags: ['reporting_requirement', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'contract_reserve_boundary',
    flagMessage:
      'VM-26 mixes contract reserve and claim reserve language and should remain review-only until those distinctions are confirmed.',
    citationDetails:
      'The VM-26 chapter is short but includes both credit life and disability requirements, so the boundary should remain explicit.',
    citationAction: 'Keep VM-26 review-only and do not merge it into later reporting or governance chapters.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should VM-26 stay as one chapter batch, or should the credit life and disability portions be split later?',
    decisionWhy: 'The supporting wave should keep contract-reserve and claim-reserve material easy to review.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'VM-26 references Model #820 and other valuation rules, so the chapter should stay review-only until the later context is fully mapped.',
    issueAction:
      'Keep VM-26 as supporting material and preserve the cross-reference notes in review packets.',
    issueEvidence: 'Pages 321-324 define credit life, credit disability, and additional reserve requirements.',
    validationCheckId: 'vm26-coverage',
    validationCheckDetails: 'The selected pages capture the VM-26 credit life and disability reserve chapter.',
    nextStep:
      'Confirm whether the contract-reserve and claim-reserve language should stay together or be split into later supporting slices.',
  },
  {
    plannedBatchId: 'batch-017',
    batchSlug: 'supporting-vm-017',
    sourceId: 'supporting-vm30-scope',
    batchTitle: 'VM-30 scope and general requirements',
    summaryLead: 'VM-30 sets the actuarial opinion and memorandum framework and stays unpromoted',
    pageWindow: [325, 329],
    sectionReference: 'VM-30: Actuarial Opinion and Memorandum Requirements (scope and general requirements)',
    citationText: 'VM-30: Actuarial Opinion and Memorandum Requirements',
    summary:
      'VM-30 establishes actuarial opinion and memorandum requirements, defines the scope of the AOM requirements, and sets up the general requirements for life actuarial opinions.',
    keywords: ['VM-30', 'AOM', 'actuarial opinion', 'memorandum', 'reporting requirements'],
    notes: 'VM-30 scope slice retained as a review-only supporting batch.',
    sourceNotes: 'Pages 325-329 only; chapter opener and general requirements slice.',
    reviewFlags: ['reporting_requirement', 'governance_or_control_expectation', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'reporting_requirement',
    flagMessage:
      'VM-30 establishes reporting requirements for actuarial opinion and memoranda and should remain review-only until the boundary is confirmed.',
    citationDetails:
      'The VM-30 chapter is more detailed than the earlier support chapters, so the scope and general requirements layer should remain visibly separated.',
    citationAction: 'Keep VM-30 review-only and do not merge the scope text into the opinion detail batch.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the VM-30 scope and general requirements stay separate from the detailed opinion/memorandum text in the next batch?',
    decisionWhy: 'The supporting wave should keep reporting requirements and details easy to review.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'VM-30 points into other VM sections, including VM-01 and VM-31, so the supporting slice should remain review-only until the cross-references are mapped.',
    issueAction: 'Keep VM-30 as supporting material and preserve the cross-reference notes in review packets.',
    issueEvidence: 'Page 325 introduces the AOM requirements and references Model #820 structure.',
    validationCheckId: 'vm30-scope-coverage',
    validationCheckDetails: 'The selected pages capture the VM-30 scope and general requirements layer.',
    nextStep:
      'Confirm whether the next VM-30 batch should begin at the detailed opinion language or whether one more boundary slice is needed.',
  },
  {
    plannedBatchId: 'batch-018',
    batchSlug: 'supporting-vm-018',
    sourceId: 'supporting-vm30-detail',
    batchTitle: 'VM-30 opinion and memorandum details',
    summaryLead: 'VM-30 contains detailed actuarial opinion and memorandum requirements and stays unpromoted',
    pageWindow: [330, 339],
    sectionReference: 'VM-30: Actuarial Opinion and Memorandum Requirements (detail layer)',
    citationText: 'VM-30: Actuarial Opinion and Memorandum Requirements',
    summary:
      'VM-30 adds prescribed opinion wording, memorandum expectations, asset adequacy testing disclosures, and documentation / retention requirements.',
    keywords: ['VM-30', 'opinion wording', 'memorandum', 'documentation', 'retention'],
    notes: 'VM-30 detail slice retained as a review-only supporting batch.',
    sourceNotes: 'Pages 330-339 only; detailed opinion and memorandum slice.',
    reviewFlags: ['actuarial_opinion', 'actuarial_memorandum', 'documentation_expectation', 'requires_human_interpretation'],
    flagType: 'documentation_expectation',
    flagMessage:
      'VM-30 detailed provisions are documentation-heavy and should remain review-only until the reporting context is confirmed.',
    citationDetails:
      'The detailed VM-30 provisions span multiple opinion and memorandum responsibilities, so the boundary needs to stay visible in review.',
    citationAction: 'Keep VM-30 review-only and do not merge the detail slice into the scope slice.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the detailed VM-30 opinion and memorandum language remain one batch, or should retention and reliance items be split later?',
    decisionWhy: 'The supporting wave should keep reporting, documentation, and control language easy to review.',
    issueType: 'actuarial_judgment',
    issueMessage:
      'VM-30 contains opinion, memorandum, and reliance language that depends on actuarial judgment and should stay review-only until the reviewer confirms the context.',
    issueAction: 'Keep VM-30 as supporting material and preserve the review flags for the detailed provisions.',
    issueEvidence:
      'Pages 330-339 cover opinion wording, memorandum documentation, retention, and reliance language.',
    validationCheckId: 'vm30-detail-coverage',
    validationCheckDetails: 'The selected pages capture the VM-30 opinion and memorandum details.',
    nextStep:
      'Confirm whether any of the detailed VM-30 retention or reliance provisions should be split into a later cleanup batch.',
  },
  {
    plannedBatchId: 'batch-019',
    batchSlug: 'supporting-vm-019',
    sourceId: 'supporting-vm31-purpose',
    batchTitle: 'VM-31 purpose and general requirements',
    summaryLead: 'VM-31 establishes the PBR Actuarial Report requirements and stays unpromoted',
    pageWindow: [341, 354],
    sectionReference:
      'VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation (purpose and general requirements)',
    citationText: 'VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation',
    summary:
      'VM-31 sets the minimum PBR Actuarial Report reporting requirements, including retention and submission format expectations, for principle-based valuation products.',
    keywords: ['VM-31', 'PBR Actuarial Report', 'reporting requirements', 'documentation', 'supporting chapter'],
    notes: 'VM-31 purpose slice retained as a review-only supporting batch.',
    sourceNotes: 'Pages 341-354 only; purpose and early requirement slice.',
    reviewFlags: ['pbr_actuarial_report', 'reporting_requirement', 'documentation_expectation', 'cross_reference_mapping'],
    flagType: 'pbr_actuarial_report',
    flagMessage:
      'VM-31 establishes PBR Actuarial Report requirements and should remain review-only until the structural boundary is confirmed.',
    citationDetails:
      'The VM-31 chapter begins the PBR Actuarial Report material and should remain clearly separated from later detailed reporting instructions.',
    citationAction: 'Keep VM-31 review-only and do not merge the purpose slice into the detail block.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the VM-31 purpose and general requirements stay separate from the detailed report requirements in the next batch?',
    decisionWhy: 'The supporting wave should keep the reporting structure easy to review.',
    issueType: 'cross_reference_mapping',
    issueMessage:
      'VM-31 points back to VM-20, VM-21, and VM-22 methods and should remain review-only until the cross-references are mapped deliberately.',
    issueAction: 'Keep VM-31 as supporting material and preserve the cross-reference notes in review packets.',
    issueEvidence:
      'Pages 341-354 begin the PBR Actuarial Report requirements and their general documentation controls.',
    validationCheckId: 'vm31-purpose-coverage',
    validationCheckDetails: 'The selected pages capture the VM-31 purpose and general requirements layer.',
    nextStep:
      'Confirm whether the next VM-31 batch should begin at the report detail block or whether one more boundary slice is needed.',
  },
  {
    plannedBatchId: 'batch-020',
    batchSlug: 'supporting-vm-020',
    sourceId: 'supporting-vm31-detail',
    batchTitle: 'VM-31 core report detail block',
    summaryLead: 'VM-31 contains detailed PBR Actuarial Report instructions and stays unpromoted',
    pageWindow: [355, 371],
    sectionReference:
      'VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation (core report detail block)',
    citationText: 'VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation',
    summary:
      'VM-31 spells out the core PBR Actuarial Report detail block, including reporting of revenue-sharing assumptions, assets, experience studies, and model-related controls.',
    keywords: ['VM-31', 'PBR Actuarial Report', 'assets', 'experience studies', 'controls', 'supporting chapter'],
    notes: 'VM-31 detail slice retained as a review-only supporting batch.',
    sourceNotes: 'Pages 355-371 only; detail block slice.',
    reviewFlags: ['pbr_actuarial_report', 'documentation_expectation', 'governance_or_control_expectation', 'requires_human_interpretation'],
    flagType: 'documentation_expectation',
    flagMessage:
      'VM-31 detail provisions are documentation-heavy and should remain review-only until the report boundaries are confirmed.',
    citationDetails:
      'The VM-31 detail block spans many reporting topics, so the boundary must remain visible in review.',
    citationAction: 'Keep VM-31 review-only and do not merge the detail block into the late-boundary batch.',
    decisionType: 'scope_split',
    decisionQuestion:
      'Should the VM-31 detail block remain one batch, or should some methods / assumptions items be split later?',
    decisionWhy:
      'The supporting wave should keep the detailed reporting instructions reviewable without becoming too broad.',
    issueType: 'requires_human_interpretation',
    issueMessage:
      'VM-31 detail topics include methods, assumptions, assets, experience studies, and controls that depend on human review for proper interpretation.',
    issueAction: 'Keep VM-31 as supporting material and preserve the review flags for the detailed provisions.',
    issueEvidence:
      'Pages 355-371 cover revenue-sharing assumptions, asset descriptions, and other detailed report items.',
    validationCheckId: 'vm31-detail-coverage',
    validationCheckDetails: 'The selected pages capture the VM-31 core report-detail block.',
    nextStep:
      'Confirm whether the next VM-31 batch should start at the late detail block or whether any model-control items need a separate cleanup slice.',
  },
  {
    plannedBatchId: 'batch-021',
    batchSlug: 'supporting-vm-021',
    sourceId: 'supporting-vm31-boundary',
    batchTitle: 'VM-31 late detail block and closing boundary',
    summaryLead: 'VM-31 closes with late report-detail material and the boundary before VM-50',
    pageWindow: [372, 386],
    sectionReference:
      'VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation (late detail block and closing boundary)',
    citationText: 'VM-31: PBR Actuarial Report Requirements for Business Subject to a Principle-Based Valuation',
    summary:
      'VM-31 closes with late report-detail items and then ends cleanly before VM-50 begins on the next page.',
    keywords: ['VM-31', 'boundary', 'VM-50', 'closing boundary', 'supporting chapter'],
    notes: 'VM-31 late detail slice retained as a review-only supporting batch.',
    sourceNotes: 'Pages 372-386 only; late detail and closing boundary slice.',
    reviewFlags: ['pbr_actuarial_report', 'boundary_control_window', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'boundary_control_window',
    flagMessage:
      'VM-31 ends right before VM-50 starts and should remain review-only so the boundary is visible.',
    citationDetails:
      'The final VM-31 pages immediately precede VM-50, so the closing boundary must remain explicit in review.',
    citationAction: 'Keep VM-31 review-only and do not merge it with the VM-50 chapter that follows.',
    decisionType: 'boundary_confirmation',
    decisionQuestion:
      'Should the late VM-31 material stay in one closing batch, or should the VM-50 opener be kept entirely separate for later planning?',
    decisionWhy: 'The supporting wave should end cleanly before the next chapter starts.',
    issueType: 'boundary_confirmation',
    issueMessage:
      'VM-31 ends at page 386 and VM-50 begins immediately afterward, so the closing boundary should remain review-only.',
    issueAction: 'Keep the VM-31 ending separate from VM-50 and preserve the boundary note in the review packet.',
    issueEvidence: 'Page 386 is a blank page and page 387 begins VM-50.',
    validationCheckId: 'vm31-boundary-coverage',
    validationCheckDetails: 'The selected pages capture the VM-31 closing boundary before VM-50 begins.',
    nextStep:
      'Confirm whether any of the late VM-31 items should be revisited as a separate cleanup batch before VM-50 planning starts.',
  },
]

export const supportingBatchDefinitions = Object.fromEntries(
  supportingBatchSpecs.map((spec) => [spec.plannedBatchId, makeSupportingBatch(spec)]),
)
