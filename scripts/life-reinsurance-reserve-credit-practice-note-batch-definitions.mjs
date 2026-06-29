const rawSourceFile = 'Practice Notes/AAA - Life_Reinsurance_Reserve_Credit_Practice_Note_Feb_2018.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle = 'Credit for Life Reinsurance practice note'
const sourceReference = 'American Academy of Actuaries practice note, February 2018'
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
    batchProfile: 'practice_note_life_reinsurance_reserve_credit',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only companion-guidance slice so the life reinsurance boundary stays narrow and reviewable.`,
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
        versionDate: '2018-02',
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

const lifeReinsuranceReserveCreditPracticeNoteBatchSpecs = [
  {
    plannedBatchId: 'batch-198',
    batchSlug: 'lrrc-198-opening-general-issues',
    sourceId: 'lrrc-opening-general-issues',
    batchTitle: 'opening and general issues slice',
    summaryLead:
      'Front matter, disclaimer, introduction, and general issues opener frame the note as companion guidance for life reinsurance credit review',
    pageWindow: [1, 16],
    sectionReference: 'Front matter, disclaimer, introduction, and Section A general issues',
    citationText:
      'This practice note is not a promulgation of the Actuarial Standards Board, is not binding on any actuary, and is not an interpretation of the NAIC Valuation Manual.',
    keywords: ['life reinsurance', 'practice note', 'non-binding', 'general issues', 'companion guidance'],
    notes:
      'Front matter, introduction, and early general issues retained as review-only companion guidance.',
    sourceNotes:
      'Pages 1-16 only; title pages, disclaimer, introduction, table of contents, and Section A general issues.',
    reviewFlags: [
      'background_content',
      'caveat_or_companion_guidance',
      'cross_reference_mapping',
      'boundary_control_window',
    ],
    flagType: 'companion_guidance',
    flagMessage:
      'The front matter and general issues are non-binding companion guidance and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'life-reinsurance-opening-coverage',
    validationCheckDetails:
      'The selected pages capture the disclaimer, introduction, and general issues opener.',
    nextStep:
      'Move to valuation and asset-adequacy issues at pages 17-21.',
    issueType: 'opening_boundary',
    issueMessage:
      'The opening and general issues material should stay separate from valuation and asset-adequacy material.',
    issueAction: 'Preserve the opening window and stop before valuation begins.',
    issueEvidence:
      'Pages 1-16 cover the title pages, disclaimer, introduction, table of contents, and Section A general issues.',
    reviewPacketNotes:
      'Keep the opening companion-guidance text separate from the later valuation and reinsurance sections.',
  },
  {
    plannedBatchId: 'batch-199',
    batchSlug: 'lrrc-199-valuation-asset-adequacy',
    sourceId: 'lrrc-valuation-asset-adequacy',
    batchTitle: 'valuation and asset-adequacy slice',
    summaryLead:
      'Valuation and asset-adequacy issues explain how reinsurance credit affects statutory and actuarial treatment',
    pageWindow: [17, 21],
    sectionReference: 'Section B valuation issues and Section C asset adequacy analysis',
    citationText: 'Section B: Credit for Reinsurance Issues Relating to the Valuation of Life Insurance Companies',
    keywords: ['life reinsurance', 'valuation', 'asset adequacy', 'reinsurance credit', 'statutory reporting'],
    notes:
      'Valuation and asset-adequacy guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 17-21 only; valuation and asset-adequacy discussion, including reserve and reporting context.',
    reviewFlags: [
      'reporting_requirement',
      'documentation_expectation',
      'calculation_structure',
      'formula_context',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'valuation_boundary',
    flagMessage:
      'The valuation and asset-adequacy discussion contains important actuarial judgment and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'life-reinsurance-valuation-coverage',
    validationCheckDetails:
      'The selected pages capture the valuation and asset-adequacy material without leaving the source boundary.',
    nextStep:
      'Move to certified reinsurers and Dodd-Frank / covered-agreement issues at pages 22-31.',
    issueType: 'selection_boundary',
    issueMessage:
      'The valuation and asset-adequacy material should stay separate from certified-reinsurer and Dodd-Frank material.',
    issueAction: 'Keep the valuation / asset-adequacy window narrow and stop before the certified-reinsurer sections begin.',
    issueEvidence:
      'Pages 17-21 cover valuation issues and the asset-adequacy discussion.',
    reviewPacketNotes:
      'Keep the valuation and asset-adequacy guidance review-only and do not let it absorb the later certified-reinsurer material.',
  },
  {
    plannedBatchId: 'batch-200',
    batchSlug: 'lrrc-200-certified-reinsurers-dodd-frank',
    sourceId: 'lrrc-certified-reinsurers-dodd-frank',
    batchTitle: 'certified reinsurers and Dodd-Frank slice',
    summaryLead:
      'Certified reinsurers, Dodd-Frank / covered-agreement issues, and implementation questions explain the jurisdictional and supervisory boundaries',
    pageWindow: [22, 31],
    sectionReference: 'Section D certified reinsurers and Section E Dodd-Frank / covered agreement issues',
    citationText: 'Section D: Credit for Reinsurance Issues Related to Certified Reinsurers',
    keywords: ['certified reinsurer', 'Dodd-Frank', 'covered agreement', 'reinsurance', 'jurisdiction'],
    notes:
      'Certified reinsurer and Dodd-Frank guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 22-31 only; certified reinsurer, Dodd-Frank / covered-agreement issues, and implementation questions.',
    reviewFlags: [
      'jurisdiction_specific_requirement',
      'regulatory_requirement',
      'cross_reference_mapping',
      'background_content',
      'requires_human_interpretation',
    ],
    flagType: 'jurisdictional_boundary',
    flagMessage:
      'The certified-reinsurer and Dodd-Frank discussion contains jurisdiction-specific issues and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'life-reinsurance-certified-reinsurer-coverage',
    validationCheckDetails:
      'The selected pages capture the certified-reinsurer and Dodd-Frank material without leaving the source boundary.',
    nextStep:
      'Move to principle-based reserving, AG 48 issues, and closing questions at pages 32-41.',
    issueType: 'selection_boundary',
    issueMessage:
      'The certified-reinsurer and Dodd-Frank material should stay separate from PBR and AG 48 closeout.',
    issueAction: 'Keep the certified-reinsurer / Dodd-Frank window narrow and stop before the PBR section begins.',
    issueEvidence:
      'Pages 22-31 cover certified reinsurer and Dodd-Frank / covered-agreement discussion.',
    reviewPacketNotes:
      'Keep the certified-reinsurer and Dodd-Frank guidance review-only and do not let it absorb the later PBR material.',
  },
  {
    plannedBatchId: 'batch-201',
    batchSlug: 'lrrc-201-pbr-ag48-closeout',
    sourceId: 'lrrc-pbr-ag48-closeout',
    batchTitle: 'PBR and AG 48 closeout slice',
    summaryLead:
      'Principle-based reserving, AG 48 issues, and the closing questions finish the note while preserving the end boundary',
    pageWindow: [32, 41],
    sectionReference: 'Section F PBR issues and Section G AG 48 questions through closeout',
    citationText: 'Section F: Credit for Reinsurance Issues Related to Principle-Based Reserving',
    keywords: ['life reinsurance', 'PBR', 'AG 48', 'reserve credit', 'closeout', 'reinsurance'],
    notes:
      'PBR and AG 48 closeout material retained as review-only companion guidance.',
    sourceNotes:
      'Pages 32-41 only; PBR issues, AG 48 questions, and closing material.',
    reviewFlags: [
      'reinsurance',
      'calculation_structure',
      'formula_context',
      'cross_reference_mapping',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    flagType: 'pbr_boundary',
    flagMessage:
      'The PBR and AG 48 discussion should remain review-only and stop cleanly at the note close.',
    decisionType: 'scope_split',
    validationCheckId: 'life-reinsurance-pbr-coverage',
    validationCheckDetails:
      'The selected pages capture the PBR and AG 48 material while keeping the end boundary explicit.',
    nextStep:
      'After this source is complete, move to the next safe source unit in the remaining inventory.',
    issueType: 'closing_boundary',
    issueMessage:
      'The PBR and AG 48 closeout should stay separate from any later practice note or source family.',
    issueAction: 'Keep the closing boundary explicit and do not merge it into a later source unit.',
    issueEvidence:
      'Pages 32-41 cover the PBR and AG 48 questions, followed by closing material.',
    reviewPacketNotes:
      'Keep the closing material review-only and do not merge it into any later practice note.',
  },
]

export const lifeReinsuranceReserveCreditPracticeNoteBatchDefinitions = Object.fromEntries(
  lifeReinsuranceReserveCreditPracticeNoteBatchSpecs.map((spec) => [
    spec.plannedBatchId,
    makeBatch(spec),
  ]),
)
