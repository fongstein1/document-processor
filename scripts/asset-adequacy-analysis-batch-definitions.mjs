const rawSourceFile = 'Practice Notes/2017-Sep-AAA_Asset_Adequacy_Analysis.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle = 'Asset Adequacy Analysis practice note'
const sourceReference = 'American Academy of Actuaries practice note, September 2017'
const defaultNonLearnerNotes =
  'Practice-note slice retained as review-only companion guidance until the wave is explicitly expanded.'

const makeBatch = (spec) => {
  const pageStart = spec.pageWindow[0]
  const pageEnd = spec.pageWindow[1]
  const titleLower = spec.batchTitle.toLowerCase()
  const itemId = `item-${spec.sourceId}-${spec.batchSlug}`

  return {
    batchName: `Practice-note batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'practice_note_asset_adequacy_analysis',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only companion-guidance slice so the asset adequacy analysis boundary stays narrow and reviewable.`,
    processingIntentNotes:
      'Practice-note workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This companion-guidance batch is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep:
      spec.nextStep ?? 'Proceed to the next section boundary in the practice note.',
    reviewerNotes:
      'Small practice-note batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${spec.sourceId}`,
        severity: spec.flagSeverity ?? 'medium',
        sourceId: spec.sourceId,
        itemId,
        flagType: spec.flagType,
        message: spec.flagMessage,
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${spec.sourceId}`,
        sourceId: spec.sourceId,
        itemId,
        issueType: spec.citationIssueType ?? 'boundary_control_window',
        details:
          spec.citationDetails ??
          `The ${titleLower} slice spans pages ${pageStart}-${pageEnd} and should remain visible in review.`,
        recommendedAction:
          spec.citationAction ?? `Keep ${titleLower} review-only and do not merge it forward.`,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${spec.sourceId}`,
        decisionType: spec.decisionType ?? 'scope_split',
        question:
          spec.decisionQuestion ??
          `Should ${titleLower} stay as one batch, or should the next batch split the boundary further?`,
        whyItMatters:
          spec.decisionWhy ?? 'The practice-note wave should stay narrow and reviewable.',
        recommendedOwner: spec.recommendedOwner ?? 'source reviewer',
        priority: spec.decisionPriority ?? 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${spec.sourceId}`,
        severity: spec.issueSeverity ?? 'medium',
        issueType: spec.issueType ?? 'implementation_guidance',
        sourceId: spec.sourceId,
        itemId,
        message:
          spec.issueMessage ??
          `The ${titleLower} slice is intentionally narrow and should stay review-only.`,
        recommendedAction:
          spec.issueAction ?? `Keep the ${titleLower} out of learner-facing output.`,
        evidence: spec.issueEvidence ?? `Pages ${pageStart}-${pageEnd} cover ${titleLower}.`,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Practice-note manifest blocks learner-facing promotion and app-ready export.',
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
        sourceId: spec.sourceId,
        relativePath: rawSourceFile,
        sourceFamilyId,
        documentType: 'practice_note',
        sourceTitle,
        sourceReference,
        versionDate: '2017-09',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: spec.confidence ?? 'high',
        reviewFlags: spec.reviewFlags,
        reviewStatus: spec.reviewStatus ?? 'draft_candidate',
        itemKind: 'chunk',
        notes: spec.sourceNotes ?? defaultNonLearnerNotes,
        summary: spec.summaryLead,
        keywords: spec.keywords,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: spec.authorityLevel ?? 'supporting_guidance',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: spec.nonLearnerFacingNotes ?? defaultNonLearnerNotes,
      },
    ],
  }
}

const batchSpecs = [
  {
    sourceId: 'asset-adequacy-analysis-216',
    plannedBatchId: 'batch-216',
    batchSlug: 'asset-adequacy-analysis-216',
    batchTitle: 'Front matter, disclaimer, introduction, and Section A background',
    pageWindow: [1, 11],
    sectionReference: 'Front matter, disclaimer, introduction, and Section A background',
    citationText: 'This practice note is not binding upon any actuary.',
    summaryLead:
      'Front matter, disclaimer, introduction, and Section A background remain review-only companion guidance.',
    nextStep: 'Move into appointed-actuary procedures and general considerations.',
    validationCheckId: 'aaa-opening-background',
    validationCheckDetails:
      'The opening slice captures the non-binding caveat, introduction, and Section A background before Section B begins.',
    issueType: 'companion_guidance',
    issueMessage:
      'The opening companion-guidance slice should stay review-only and not be treated as authoritative regulatory text.',
    issueAction: 'Keep the opening slice out of learner-facing output.',
    reviewFlags: [
      'practice_note',
      'non_binding_practice_note',
      'background_content',
      'caveat_or_companion_guidance',
      'boundary_control_window',
    ],
    reviewStatus: 'draft_candidate',
    keywords: ['asset adequacy analysis', 'introduction', 'background', 'practice note'],
    reviewPacketNotes: 'Page locators are the primary anchor; line references are not expected.',
  },
  {
    sourceId: 'asset-adequacy-analysis-217',
    plannedBatchId: 'batch-217',
    batchSlug: 'asset-adequacy-analysis-217',
    batchTitle: 'Appointed-actuary procedures and Section C opener',
    pageWindow: [12, 25],
    sectionReference:
      'Section B procedures for accepting/resigning the appointed actuary and Section C opener',
    citationText: 'What information may the appointed actuary wish to obtain from the previous appointed actuary?',
    summaryLead:
      'Section B appointed-actuary procedures and Section C general considerations stay together as a review-only slice.',
    nextStep: 'Continue into general modeling considerations and IMR / AVR treatment.',
    validationCheckId: 'aaa-appointed-actuary-procedures',
    validationCheckDetails:
      'The slice keeps Section B procedures and the Section C opener together without overextending into the modeling detail.',
    issueType: 'governance_or_control_expectation',
    issueMessage:
      'Procedural and governance language should remain review-only and not be overread as a compliance checklist.',
    issueAction: 'Keep the procedural slice out of learner-facing output.',
    reviewFlags: [
      'practice_note',
      'non_binding_practice_note',
      'governance_or_control_expectation',
      'documentation_expectation',
      'boundary_control_window',
    ],
    reviewStatus: 'draft_candidate',
    keywords: ['appointed actuary', 'procedures', 'section b', 'section c'],
    reviewPacketNotes: 'Page locators are the primary anchor; line references are not expected.',
  },
  {
    sourceId: 'asset-adequacy-analysis-218',
    plannedBatchId: 'batch-218',
    batchSlug: 'asset-adequacy-analysis-218',
    batchTitle: 'General modeling considerations and IMR / AVR treatment',
    pageWindow: [26, 40],
    sectionReference: 'Section D / E general modeling considerations and asset reserve treatment',
    citationText: 'How is the asset valuation reserve treated in cash flow testing?',
    summaryLead:
      'General modeling considerations, IMR / AVR treatment, and the Section E opener remain review-only.',
    nextStep: 'Move into asset modeling specifics and fixed-income modeling.',
    validationCheckId: 'aaa-general-modeling',
    validationCheckDetails:
      'The slice keeps the general modeling discussion and IMR / AVR treatment in one narrow review-only block.',
    issueType: 'calculation_structure',
    issueMessage:
      'General modeling and reserve-treatment language should remain review-only and not be promoted into instructions.',
    issueAction: 'Keep the modeling slice out of learner-facing output.',
    reviewFlags: [
      'practice_note',
      'non_binding_practice_note',
      'calculation_structure',
      'formula_context',
      'asset_modeling_judgment',
      'boundary_control_window',
    ],
    reviewStatus: 'draft_candidate',
    keywords: ['modeling', 'IMR', 'AVR', 'general considerations', 'cash flow testing'],
    reviewPacketNotes: 'Page locators are the primary anchor; line references are not expected.',
  },
  {
    sourceId: 'asset-adequacy-analysis-219',
    plannedBatchId: 'batch-219',
    batchSlug: 'asset-adequacy-analysis-219',
    batchTitle: 'Asset modeling specifics, fixed income, and mortgages',
    pageWindow: [41, 57],
    sectionReference: 'Section F asset modeling detail',
    citationText: 'What software platforms are used by appointed actuaries to model assets?',
    summaryLead:
      'Asset modeling specifics, fixed-income discussion, and mortgage modeling remain review-only.',
    nextStep: 'Continue into policy cash flow risk, expenses, and reliance on others.',
    validationCheckId: 'aaa-asset-modeling',
    validationCheckDetails:
      'The slice keeps the asset modeling detail together so fixed-income and mortgage topics do not spill into later sections.',
    issueType: 'asset_modeling_judgment',
    issueMessage:
      'Asset modeling detail should stay review-only because it relies heavily on actuarial and investment judgment.',
    issueAction: 'Keep the asset-modeling slice out of learner-facing output.',
    reviewFlags: [
      'practice_note',
      'non_binding_practice_note',
      'asset_modeling_judgment',
      'calculation_structure',
      'boundary_control_window',
    ],
    reviewStatus: 'draft_candidate',
    keywords: ['assets', 'mortgages', 'CMO', 'MBS', 'derivatives'],
    reviewPacketNotes: 'Page locators are the primary anchor; line references are not expected.',
  },
  {
    sourceId: 'asset-adequacy-analysis-220',
    plannedBatchId: 'batch-220',
    batchSlug: 'asset-adequacy-analysis-220',
    batchTitle: 'Policy cash flow risk, expenses, reliance, and results',
    pageWindow: [58, 76],
    sectionReference: 'Sections G / H / I / J on policy cash flow risk, expenses, reliance, and results',
    citationText: 'What is policy cash flow risk?',
    summaryLead:
      'Policy cash flow risk, expenses, reliance, and analysis of results stay together as one risk-and-results slice.',
    nextStep: 'Move into opinion and memorandum preparation plus AG43 / VM-21 impacts.',
    validationCheckId: 'aaa-policy-cash-flow-risk',
    validationCheckDetails:
      'The slice keeps policy cash flow risk, expenses, reliance, and analysis of results together as one review block.',
    issueType: 'scenario_or_stochastic_requirement',
    issueMessage:
      'Scenario, sensitivity, and reliance language should remain review-only and not be converted into generic instructions.',
    issueAction: 'Keep the risk-and-results slice out of learner-facing output.',
    reviewFlags: [
      'practice_note',
      'non_binding_practice_note',
      'scenario_or_stochastic_requirement',
      'reporting_requirement',
      'governance_or_control_expectation',
      'boundary_control_window',
    ],
    reviewStatus: 'draft_candidate',
    keywords: ['policy cash flow risk', 'expenses', 'reliance', 'results'],
    reviewPacketNotes: 'Page locators are the primary anchor; line references are not expected.',
  },
  {
    sourceId: 'asset-adequacy-analysis-221',
    plannedBatchId: 'batch-221',
    batchSlug: 'asset-adequacy-analysis-221',
    batchTitle: 'Opinion, memorandum, AG43 / VM-21 impacts, and appendix closeout',
    pageWindow: [77, 91],
    sectionReference: 'Sections K / L and Appendix A',
    citationText: 'What types of actuarial reports do actuaries prepare in connection with asset adequacy analysis?',
    summaryLead:
      'Opinion, memorandum, AG43 / VM-21 impacts, and Appendix A close out the practice note in review-only form.',
    nextStep: 'Close out the wave and prepare the review index.',
    validationCheckId: 'aaa-opinion-impacts-appendix',
    validationCheckDetails:
      'The slice keeps opinion / memorandum material together with the AG43 / VM-21 impact discussion and appendix closeout.',
    issueType: 'documentation_expectation',
    issueMessage:
      'Opinion, memorandum, and appendix closeout language should remain review-only and not be promoted into instructions.',
    issueAction: 'Keep the closeout slice out of learner-facing output.',
    reviewFlags: [
      'practice_note',
      'non_binding_practice_note',
      'reporting_requirement',
      'documentation_expectation',
      'cross_reference_mapping',
      'boundary_control_window',
    ],
    reviewStatus: 'draft_candidate',
    keywords: ['opinion', 'memorandum', 'AG43', 'VM-21', 'appendix'],
    reviewPacketNotes: 'Page locators are the primary anchor; line references are not expected.',
  },
]

export const assetAdequacyAnalysisPracticeNoteBatchDefinitions = Object.fromEntries(
  batchSpecs.map((spec) => [spec.plannedBatchId, makeBatch(spec)]),
)
