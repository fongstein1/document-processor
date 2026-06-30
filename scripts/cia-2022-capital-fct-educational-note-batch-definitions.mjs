const rawSourceFile = 'Practice Notes/222030e.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle =
  'Educational Note: Guidance for the 2022 Reporting on Capital and Financial Condition Testing for Life, P&C, and Mortgage Insurers'
const sourceReference = 'Canadian Institute of Actuaries educational note, February 2022'
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
    batchProfile: 'cia_2022_capital_fct_educational_note',
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
        versionDate: '2022-02',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: spec.confidence ?? 'high',
        reviewFlags: spec.reviewFlags,
        reviewStatus: spec.reviewStatus ?? 'draft_candidate',
        itemKind: 'chunk',
        notes: spec.notes,
        summary: spec.summaryLead,
        keywords: spec.keywords,
        sourceNotes: spec.sourceNotes,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: spec.authorityLevel ?? 'supporting_guidance',
        reviewPacketNotes: spec.reviewPacketNotes ?? spec.notes,
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: spec.nonLearnerFacingNotes ?? defaultNonLearnerNotes,
      },
    ],
  }
}

const cia2022CapitalFCTEducationalNoteBatchSpecs = [
  {
    plannedBatchId: 'batch-206',
    batchSlug: 'cia-206-opening-guidance',
    sourceId: 'cia-opening-guidance',
    batchTitle: 'opening and background guidance slice',
    summaryLead:
      'Front matter, introduction, and background guidance frame the educational note as companion guidance for capital and financial condition testing',
    pageWindow: [1, 6],
    sectionReference: 'Front matter, memorandum, and introduction',
    citationText: 'Educational Note: Guidance for the 2022 Reporting on Capital and Financial Condition Testing',
    keywords: ['educational note', 'capital', 'financial condition testing', 'background', 'companion guidance'],
    notes:
      'Front matter, introduction, and background guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 1-6 only; title pages, memorandum, introduction, and background guidance.',
    reviewFlags: [
      'background_content',
      'caveat_or_companion_guidance',
      'cross_reference_mapping',
      'boundary_control_window',
    ],
    flagType: 'companion_guidance',
    flagMessage:
      'The opening and background guidance are non-binding companion guidance and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-opening-coverage',
    validationCheckDetails:
      'The selected pages capture the opening framing and background guidance.',
    nextStep:
      'Move to the capital requirements and FCT overview at pages 7-11.',
    issueType: 'opening_boundary',
    issueMessage:
      'The opening and background guidance should stay separate from the capital and FCT overview.',
    issueAction: 'Preserve the opening window and stop before the overview begins.',
    issueEvidence:
      'Pages 1-6 cover the title pages, memorandum, introduction, and background guidance.',
    reviewPacketNotes:
      'Keep the opening companion-guidance text separate from the later capital and FCT overview sections.',
  },
  {
    plannedBatchId: 'batch-207',
    batchSlug: 'cia-207-capital-fct-overview',
    sourceId: 'cia-capital-and-fct-overview',
    batchTitle: 'capital and FCT overview slice',
    summaryLead:
      'Capital requirements and the 2022 FCT overview explain the main reporting context for the educational note',
    pageWindow: [7, 11],
    sectionReference: 'Life regulatory capital requirements for 2022 and FCT overview',
    citationText: 'Life regulatory capital requirements for 2022',
    keywords: ['capital', 'financial condition testing', 'reporting', 'OSFI', 'AMF', 'IFRS 17'],
    notes:
      'Capital and FCT overview retained as review-only companion guidance.',
    sourceNotes:
      'Pages 7-11 only; the main capital and FCT overview.',
    reviewFlags: [
      'regulatory_requirement',
      'reporting_requirement',
      'documentation_expectation',
      'cross_reference_mapping',
    ],
    flagType: 'reporting_guidance',
    flagMessage:
      'The capital and FCT overview contains reporting guidance and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-capital-overview-coverage',
    validationCheckDetails:
      'The selected pages capture the capital and FCT overview without leaving the source boundary.',
    nextStep:
      'Move to the additional guidance, climate, COVID-19, ORSA, reinsurance, and model-use references at pages 12-16.',
    issueType: 'selection_boundary',
    issueMessage:
      'The capital and FCT overview should stay separate from the additional guidance section.',
    issueAction: 'Keep the capital / FCT overview window narrow and stop before the additional guidance begins.',
    issueEvidence:
      'Pages 7-11 cover the main capital and FCT overview.',
    reviewPacketNotes:
      'Keep the overview review-only and do not let it absorb the caution-heavy guidance section.',
  },
  {
    plannedBatchId: 'batch-208',
    batchSlug: 'cia-208-additional-guidance',
    sourceId: 'cia-additional-guidance',
    batchTitle: 'additional guidance slice',
    summaryLead:
      'Additional guidance, climate, COVID-19, ORSA, reinsurance, and model-use references explain caution-heavy follow-on material',
    pageWindow: [12, 16],
    sectionReference: 'Additional guidance, climate, COVID-19, ORSA, reinsurance, and model-use references',
    citationText: 'Additional guidance on the 2022 FCT',
    keywords: ['climate', 'covid-19', 'orsa', 'reinsurance', 'modeling', 'guidance'],
    notes:
      'Caution-heavy guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 12-16 only; additional guidance, climate, COVID-19, ORSA, reinsurance, and model-use references.',
    reviewFlags: [
      'scenario_or_stochastic_requirement',
      'reinsurance',
      'asset_modeling_judgment',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'judgment_guidance',
    flagMessage:
      'The additional guidance contains model and judgment caveats and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-additional-guidance-coverage',
    validationCheckDetails:
      'The selected pages capture the caution-heavy guidance without leaving the source boundary.',
    nextStep:
      'Move to the appendices and closeout material at pages 17-20.',
    issueType: 'selection_boundary',
    issueMessage:
      'The additional guidance should stay separate from the appendix material.',
    issueAction: 'Keep the additional guidance window narrow and stop before the appendices begin.',
    issueEvidence:
      'Pages 12-16 cover the climate, COVID-19, ORSA, reinsurance, and model-use references.',
    reviewPacketNotes:
      'Keep the caution-heavy guidance review-only and do not let it absorb the appendix material.',
  },
  {
    plannedBatchId: 'batch-209',
    batchSlug: 'cia-209-appendices-closeout',
    sourceId: 'cia-appendices-and-closeout',
    batchTitle: 'appendices and closeout slice',
    summaryLead:
      'Appendices A-C and closeout material end the educational note while preserving the closing boundary',
    pageWindow: [17, 20],
    sectionReference: 'Appendices A-C and closeout material',
    citationText: 'Appendix A: OSFI documentation',
    keywords: ['appendix', 'OSFI', 'AMF', 'CIA', 'documentation', 'closeout'],
    notes:
      'Appendix and closeout material retained as review-only companion guidance.',
    sourceNotes:
      'Pages 17-20 only; appendices and closeout material.',
    reviewFlags: [
      'cross_reference_mapping',
      'background_content',
      'caveat_or_companion_guidance',
      'boundary_control_window',
    ],
    flagType: 'appendix_guidance',
    flagMessage:
      'The appendix and closeout material should remain review-only and stop cleanly at the note close.',
    decisionType: 'scope_split',
    validationCheckId: 'cia-educational-note-appendices-coverage',
    validationCheckDetails:
      'The selected pages capture the appendices and closeout material while keeping the end boundary explicit.',
    nextStep:
      'After this source is complete, move to the next safe source unit in the remaining inventory.',
    issueType: 'closing_boundary',
    issueMessage:
      'The appendices and closeout should stay separate from any later source family.',
    issueAction: 'Keep the closing boundary explicit and do not merge it into a later source unit.',
    issueEvidence:
      'Pages 17-20 cover the appendix material and closeout.',
    reviewPacketNotes:
      'Keep the closing material review-only and do not merge it into any later source.',
  },
]

export const cia2022CapitalFCTEducationalNoteBatchDefinitions = Object.fromEntries(
  cia2022CapitalFCTEducationalNoteBatchSpecs.map((spec) => [
    spec.plannedBatchId,
    makeBatch(spec),
  ]),
)
