const rawSourceFile = 'Practice Notes/223010e.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle =
  'Educational Note: Financial Condition Testing'
const sourceReference = 'Canadian Institute of Actuaries educational note, January 2023'
const defaultNonLearnerNotes =
  'Educational-note slice retained as review-only companion guidance until the wave is explicitly expanded.'

const makeBatch = (spec) => {
  const pageStart = spec.pageWindow[0]
  const pageEnd = spec.pageWindow[1]
  const titleLower = spec.batchTitle.toLowerCase()
  const itemId = `item-${spec.sourceId}-${spec.batchSlug}`

  return {
    batchName: `Educational-note batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'cia_2023_financial_condition_testing_educational_note',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only companion-guidance slice so the educational-note boundary stays narrow and reviewable.`,
    processingIntentNotes:
      'Educational-note workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This companion-guidance batch is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep:
      spec.nextStep ?? 'Proceed to the next section boundary in the educational note.',
    reviewerNotes:
      'Small educational-note batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
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
          spec.decisionWhy ?? 'The educational-note wave should stay narrow and reviewable.',
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
          spec.issueMessage ?? `The ${titleLower} slice is intentionally narrow and should stay review-only.`,
        recommendedAction:
          spec.issueAction ?? `Keep the ${titleLower} out of learner-facing output.`,
        evidence: spec.issueEvidence ?? `Pages ${pageStart}-${pageEnd} cover ${titleLower}.`,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Educational-note manifest blocks learner-facing promotion and app-ready export.',
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
        documentType: 'educational_note',
        sourceTitle,
        sourceReference,
        sourceLabel: sourceTitle,
        versionDate: '2023-01',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        pageLocator: `pp. ${pageStart}-${pageEnd}`,
        lineReferences: [],
        citationText: spec.citationText,
        confidence: spec.confidence ?? 'high',
        reviewFlags: spec.reviewFlags,
        reviewStatus: spec.reviewStatus ?? 'draft_candidate',
        itemKind: 'chunk',
        summary: spec.summaryLead,
        keywords: spec.keywords,
        sourceStatus: 'educational note',
        sourceStatusNote:
          'Non-binding educational note / companion guidance; not authoritative regulatory text.',
        jurisdiction: 'Canada',
        notes: spec.sourceNotes,
        sourceKeywords: spec.keywords,
        sourceNotes: spec.sourceNotes,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: spec.authorityLevel ?? 'supporting_guidance',
        reviewPacketNotes: spec.reviewPacketNotes ?? spec.notes,
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerNotes: spec.notes ?? defaultNonLearnerNotes,
      },
    ],
    extractedItems: [
      {
        itemId,
        sourceId: spec.sourceId,
        itemType: 'review_note',
        title: spec.batchTitle,
        sourceText: spec.summaryLead,
        summary: spec.summaryLead,
        pageLocator: `pp. ${pageStart}-${pageEnd}`,
        lineReferences: [],
        sourceCitations: [spec.citationText],
        keywords: spec.keywords,
        confidence: 'medium',
        reviewFlags: spec.reviewFlags,
        learnerFacingEligible: false,
        learnerFacingStatus: 'not_eligible',
        appReadyEligible: false,
        appReadyStatus: 'not_eligible',
        ragReadyEligible: false,
        ragReadyStatus: 'not_eligible',
        promotionStatus: 'not_promoted',
        notes: spec.notes ?? defaultNonLearnerNotes,
      },
    ],
    reviewPacketSections: [
      {
        sectionId: 'batch-summary',
        heading: 'Batch Summary',
        text: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
      },
      {
        sectionId: 'source-files',
        heading: 'Source Files Processed',
        text: `${rawSourceFile} pages ${pageStart}-${pageEnd}.`,
      },
      {
        sectionId: 'extracted-items',
        heading: 'Extracted Items',
        text: `${spec.batchTitle}.`,
      },
      {
        sectionId: 'required-decisions',
        heading: 'Required Human Decisions',
        text: spec.decisionQuestion,
      },
      {
        sectionId: 'exceptions',
        heading: 'Exceptions and Flags',
        text: spec.flagMessage,
      },
      {
        sectionId: 'citation-issues',
        heading: 'Citation and Source-Reference Issues',
        text: spec.citationDetails,
      },
      {
        sectionId: 'promotion',
        heading: 'Promotion Recommendation',
        text: 'Keep review-only.',
      },
      {
        sectionId: 'status',
        heading: 'Not Approved / Learner-Facing Status',
        text: 'No item is learner-facing, app-ready, RAG-ready, or promoted.',
      },
    ],
    reviewPacketSummary: `Batch ${spec.plannedBatchId} remains review-only, companion-guidance aware, and not promoted.`,
    unresolvedIssuesSummary: [
      spec.issueMessage,
      spec.citationDetails,
      spec.flagMessage,
    ],
    metadata: {
      sourceFamilyId,
      sourceReference,
      sourceStatus: 'educational note',
      jurisdiction: 'Canada',
      companionCaveat: true,
      pageLocatorPrimary: true,
      lineReferencesExpected: false,
      noPromotion: true,
      notLearnerFacing: true,
      notAppReady: true,
      notRagReady: true,
      reviewOnly: true,
    },
  }
}

const cia2023FinancialConditionTestingEducationalNoteBatchSpecs = [
  {
    plannedBatchId: 'batch-210',
    batchSlug: 'cia-210-opening-guidance',
    sourceId: 'cia-opening-guidance',
    batchTitle: 'opening and method overview slice',
    summaryLead:
      'Front matter, introduction, and method overview frame the educational note as companion guidance for financial condition testing',
    pageWindow: [1, 8],
    sectionReference: 'Front matter, introduction, and method overview',
    citationText: 'Educational Note: Financial Condition Testing',
    keywords: ['educational note', 'financial condition testing', 'opening', 'method', 'companion guidance'],
    notes:
      'Front matter, introduction, and method overview retained as review-only companion guidance.',
    sourceNotes:
      'Pages 1-8 only; title pages, memorandum, introduction, and method overview.',
    reviewFlags: [
      'background_content',
      'caveat_or_companion_guidance',
      'cross_reference_mapping',
      'boundary_control_window',
    ],
    flagType: 'companion_guidance',
    flagMessage:
      'The opening and method-overview material is non-binding companion guidance and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-opening-coverage',
    validationCheckDetails:
      'The selected pages capture the opening framing and method overview.',
    nextStep:
      'Move to the forecast period, scenarios, and management actions at pages 9-17.',
    issueType: 'opening_boundary',
    issueMessage:
      'The opening and method-overview material should stay separate from the forecast and scenario guidance.',
    issueAction: 'Preserve the opening window and stop before the forecast and scenarios begin.',
    issueEvidence:
      'Pages 1-8 cover the title pages, memorandum, introduction, and method overview.',
    reviewPacketNotes:
      'Keep the opening companion-guidance text separate from the later forecast, scenario, and appendix sections.',
  },
  {
    plannedBatchId: 'batch-211',
    batchSlug: 'cia-211-forecast-scenarios',
    sourceId: 'cia-forecast-and-scenarios',
    batchTitle: 'forecast period, scenarios, and management actions slice',
    summaryLead:
      'Forecast period, scenario selection, reverse stress testing, going concern framing, and management actions explain the main scenario discipline for FCT',
    pageWindow: [9, 17],
    sectionReference: 'Forecast period, scenarios, reverse stress testing, and management actions',
    citationText: 'Forecast period and adverse scenarios',
    keywords: ['forecast period', 'scenarios', 'reverse stress testing', 'going concern', 'management actions'],
    notes:
      'Forecast, scenario, and management-action guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 9-17 only; forecast period, scenarios, reverse stress testing, going concern, and management actions.',
    reviewFlags: [
      'scenario_or_stochastic_requirement',
      'company_or_prudent_estimate_assumption',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'scenario_guidance',
    flagMessage:
      'The forecast and scenario guidance contains model and judgment caveats and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-scenario-coverage',
    validationCheckDetails:
      'The selected pages capture the forecast period, scenario work, and management-action guidance.',
    nextStep:
      'Move to the modelling considerations, basic requirements, and enterprise assumptions at pages 18-23.',
    issueType: 'selection_boundary',
    issueMessage:
      'The scenario and management-action guidance should stay separate from the modelling considerations section.',
    issueAction: 'Keep the forecast and scenario window narrow and stop before the modelling section begins.',
    issueEvidence:
      'Pages 9-17 cover the forecast period, scenarios, going concern framing, and management actions.',
    reviewPacketNotes:
      'Keep the scenario-heavy guidance review-only and do not let it absorb the modelling section.',
  },
  {
    plannedBatchId: 'batch-212',
    batchSlug: 'cia-212-modelling-considerations',
    sourceId: 'cia-modelling-considerations',
    batchTitle: 'modelling considerations and assumptions slice',
    summaryLead:
      'Modelling considerations, basic requirements, and enterprise assumptions explain the core model-design discipline for FCT',
    pageWindow: [18, 23],
    sectionReference: 'Modelling considerations, basic requirements, and enterprise assumptions',
    citationText: 'Modelling considerations',
    keywords: ['modelling', 'assumptions', 'IFRS 17', 'capital ratios', 'financial statements'],
    notes:
      'Model-design and assumption guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 18-23 only; modelling considerations, basic requirements, and enterprise assumptions.',
    reviewFlags: [
      'definition_or_terminology',
      'calculation_structure',
      'formula_context',
      'asset_modeling_judgment',
      'cross_reference_mapping',
    ],
    flagType: 'modeling_guidance',
    flagMessage:
      'The modelling considerations contain model-design and assumption caveats and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-modelling-coverage',
    validationCheckDetails:
      'The selected pages capture the model-design and enterprise-assumption framework.',
    nextStep:
      'Move to the reporting guidance, introduction, results, and ORSA coordination at pages 24-31.',
    issueType: 'selection_boundary',
    issueMessage:
      'The modelling considerations should stay separate from the reporting and results section.',
    issueAction: 'Keep the modelling window narrow and stop before the reporting section begins.',
    issueEvidence:
      'Pages 18-23 cover the modelling considerations, basic requirements, and enterprise assumptions.',
    reviewPacketNotes:
      'Keep the model-design guidance review-only and do not let it absorb reporting material.',
  },
  {
    plannedBatchId: 'batch-213',
    batchSlug: 'cia-213-reporting-results',
    sourceId: 'cia-reporting-and-results',
    batchTitle: 'reporting and results slice',
    summaryLead:
      'Reporting guidance, introduction, results, and ORSA coordination explain the reporting and closeout discipline for FCT',
    pageWindow: [24, 31],
    sectionReference: 'Reporting guidance, introduction, results, and ORSA coordination',
    citationText: 'Report submission and results',
    keywords: ['reporting', 'results', 'ORSA', 'transfers', 'consolidated report'],
    notes:
      'Reporting and results guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 24-31 only; reporting guidance, introduction, results, and ORSA coordination.',
    reviewFlags: [
      'reporting_requirement',
      'documentation_expectation',
      'governance_or_control_expectation',
      'cross_reference_mapping',
    ],
    flagType: 'reporting_guidance',
    flagMessage:
      'The reporting and results section contains documentation and governance caveats and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-reporting-coverage',
    validationCheckDetails:
      'The selected pages capture the reporting guidance and the results / ORSA coordination material.',
    nextStep:
      'Move to Appendix A - life insurers at pages 32-45.',
    issueType: 'selection_boundary',
    issueMessage:
      'The reporting and results material should stay separate from the appendix risk-category material.',
    issueAction: 'Keep the reporting window narrow and stop before Appendix A begins.',
    issueEvidence:
      'Pages 24-31 cover the reporting guidance, introduction, results, and ORSA coordination.',
    reviewPacketNotes:
      'Keep the reporting guidance review-only and do not let it absorb the appendix material.',
  },
  {
    plannedBatchId: 'batch-214',
    batchSlug: 'cia-214-life-appendix',
    sourceId: 'cia-life-appendix',
    batchTitle: 'appendix A - life insurers slice',
    summaryLead:
      'Appendix A discusses the major life-insurer risk categories and associated management actions for FCT',
    pageWindow: [32, 45],
    sectionReference: 'Appendix A - life insurers',
    citationText: 'Appendix A - Life insurers',
    keywords: ['appendix', 'life insurers', 'mortality', 'morbidity', 'management actions'],
    notes:
      'Life-insurer appendix material retained as review-only companion guidance.',
    sourceNotes:
      'Pages 32-45 only; Appendix A life insurer risk categories and management actions.',
    reviewFlags: [
      'scenario_or_stochastic_requirement',
      'reinsurance',
      'asset_modeling_judgment',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'appendix_guidance',
    flagMessage:
      'Appendix A contains detailed risk-category guidance and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-life-appendix-coverage',
    validationCheckDetails:
      'The selected pages capture Appendix A and the life-insurer risk categories.',
    nextStep:
      'Move to Appendix B/C - property and casualty insurers and closeout at pages 46-59.',
    issueType: 'appendix_boundary',
    issueMessage:
      'Appendix A should stay separate from the P&C appendix and the closeout boundary.',
    issueAction: 'Keep the life appendix window narrow and stop before Appendix B begins.',
    issueEvidence:
      'Pages 32-45 cover Appendix A and the life-insurer risk categories.',
    reviewPacketNotes:
      'Keep the life appendix review-only and do not merge it into the P&C appendix.',
  },
  {
    plannedBatchId: 'batch-215',
    batchSlug: 'cia-215-pc-appendices-closeout',
    sourceId: 'cia-pc-appendices-and-closeout',
    batchTitle: 'appendix B/C and closeout slice',
    summaryLead:
      'Appendix B/C discusses the property and casualty risk categories and closes the educational note with an explicit end boundary',
    pageWindow: [46, 59],
    sectionReference: 'Appendix B/C - property and casualty insurers and closeout',
    citationText: 'Appendix B - Property and casualty insurers',
    keywords: ['appendix', 'property and casualty', 'catastrophe', 'reinsurance', 'closeout'],
    notes:
      'P&C appendix material retained as review-only companion guidance.',
    sourceNotes:
      'Pages 46-59 only; Appendix B/C property and casualty risk categories and note closeout.',
    reviewFlags: [
      'scenario_or_stochastic_requirement',
      'reinsurance',
      'asset_modeling_judgment',
      'cross_reference_mapping',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    flagType: 'closing_guidance',
    flagMessage:
      'Appendix B/C and the closeout should remain review-only and stop cleanly at the note boundary.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-pc-appendix-coverage',
    validationCheckDetails:
      'The selected pages capture Appendix B/C and the closing boundary.',
    nextStep:
      'After this source is complete, move to the next safe source unit in the remaining inventory.',
    issueType: 'closing_boundary',
    issueMessage:
      'Appendix B/C should stay separate from any later source family.',
    issueAction: 'Keep the closing boundary explicit and do not merge it into a later source unit.',
    issueEvidence:
      'Pages 46-59 cover Appendix B/C and the closeout material.',
    reviewPacketNotes:
      'Keep the closing material review-only and do not merge it into any later source.',
  },
]

export const cia2023FinancialConditionTestingEducationalNoteBatchDefinitions = Object.fromEntries(
  cia2023FinancialConditionTestingEducationalNoteBatchSpecs.map((spec) => [
    spec.plannedBatchId,
    makeBatch(spec),
  ]),
)
