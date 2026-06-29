const rawSourceFile = 'Practice Notes/AAA-LTCI_Practice_Note_5.21.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle = 'Long-Term Care Insurance practice note'
const sourceReference = 'American Academy of Actuaries practice note, May 2021'
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
    batchProfile: 'practice_note_ltci',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only companion-guidance slice so the LTCI boundary stays narrow and reviewable.`,
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
        versionDate: '2021-05',
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

const ltciPracticeNoteBatchSpecs = [
  {
    plannedBatchId: 'batch-195',
    batchSlug: 'ltci-195-experience-assumptions',
    sourceId: 'ltci-experience-assumptions',
    batchTitle: 'front matter and experience-assumption slice',
    summaryLead:
      'Front matter, introduction, experience studies, morbidity, and assumption-setting opener frame the practice note as companion guidance for LTCI practitioners',
    pageWindow: [1, 10],
    sectionReference: 'Introduction and Section A experience studies / assumption setting',
    citationText: 'This practice note is not a definitive statement as to what constitutes generally accepted practice.',
    keywords: ['LTCI', 'practice note', 'non-binding', 'experience studies', 'morbidity'],
    notes:
      'Front matter, introduction, morbidity, and early experience-study guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 1-10 only; title pages, disclaimer, introduction, morbidity, and early experience-study material.',
    reviewFlags: ['background_content', 'caveat_or_companion_guidance', 'cross_reference_mapping', 'boundary_control_window'],
    flagType: 'companion_guidance',
    flagMessage:
      'The front matter and introduction are non-binding companion guidance and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'ltci-front-matter-coverage',
    validationCheckDetails:
      'The selected pages capture the disclaimer, introduction, morbidity, and early assumption-setting guidance.',
    nextStep:
      'Move to persistency, mortality, lapse, benefit exhaustion, anti-selection, and investment-return material at pages 11-20.',
    issueType: 'opening_boundary',
    issueMessage:
      'The opening and Section A material should stay separate from persistency and valuation sections.',
    issueAction: 'Preserve the opening window and stop before persistency begins.',
    issueEvidence:
      'Pages 1-10 cover the title pages, disclaimer, introduction, morbidity, and early experience-study guidance.',
    reviewPacketNotes:
      'Keep the opening companion-guidance text separate from the later persistency and valuation sections.',
  },
  {
    plannedBatchId: 'batch-196',
    batchSlug: 'ltci-196-persistency-mortality-investment',
    sourceId: 'ltci-persistency-mortality-investment',
    batchTitle: 'persistency, mortality, and investment slice',
    summaryLead:
      'Persistency, mortality, lapse, benefit exhaustion, anti-selection, and investment-return / discounting methods explain how actuaries shape core LTCI assumptions',
    pageWindow: [11, 20],
    sectionReference: 'Section A persistency, mortality, lapse, benefit exhaustion, anti-selection, and investment-return / discounting',
    citationText: 'Persistency assumptions must be set and applied to produce estimated total terminations',
    keywords: ['LTCI', 'persistency', 'mortality', 'lapse', 'investment', 'assumptions'],
    notes:
      'Persistency, mortality, lapse, and investment-return guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 11-20 only; persistency, mortality, lapse, benefit exhaustion, anti-selection, and investment-return material.',
    reviewFlags: ['definition_or_terminology', 'calculation_structure', 'formula_context', 'prescribed_assumption', 'company_or_prudent_estimate_assumption', 'requires_human_interpretation'],
    flagType: 'assumption_setting',
    flagMessage:
      'The persistency and investment-return discussion contains important actuarial judgment and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'ltci-persistency-coverage',
    validationCheckDetails:
      'The selected pages capture the persistency, mortality, lapse, benefit exhaustion, anti-selection, and investment-return material.',
    nextStep:
      'Move to financial reporting, valuation, reserve calculations, incurred claim reserve discussion, and first-principles / conversion material at pages 21-31.',
    issueType: 'selection_boundary',
    issueMessage:
      'The persistency and investment material should stay separate from financial reporting and valuation closeout.',
    issueAction: 'Keep the persistency / investment window narrow and stop before Section B begins.',
    issueEvidence:
      'Pages 11-20 cover persistency, mortality, lapse, benefit exhaustion, anti-selection, and investment-return discussion.',
    reviewPacketNotes:
      'Keep the persistency and investment guidance review-only and do not let it absorb the later valuation closeout.',
  },
  {
    plannedBatchId: 'batch-197',
    batchSlug: 'ltci-197-financial-reporting-valuation',
    sourceId: 'ltci-financial-reporting-valuation',
    batchTitle: 'financial reporting and valuation slice',
    summaryLead:
      'Financial reporting, valuation, reserve calculations, incurred claim reserve discussion, and first-principles / conversion closeout complete the note',
    pageWindow: [21, 31],
    sectionReference: 'Section B financial reporting and valuation through the closing first-principles / conversion discussion',
    citationText: 'Section B: Financial Reporting and Valuation',
    keywords: ['LTCI', 'valuation', 'financial reporting', 'reserve', 'incurred claim reserve', 'FASB'],
    notes:
      'Financial reporting and valuation material retained as review-only companion guidance.',
    sourceNotes:
      'Pages 21-31 only; financial reporting, valuation, reserve calculations, incurred claim reserve discussion, and closeout.',
    reviewFlags: ['reporting_requirement', 'documentation_expectation', 'cross_reference_mapping', 'background_content', 'boundary_control_window', 'requires_human_interpretation'],
    flagType: 'valuation_closeout',
    flagMessage:
      'The financial reporting and valuation discussion should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'ltci-financial-reporting-coverage',
    validationCheckDetails:
      'The selected pages capture the financial reporting, valuation, reserve, and first-principles / conversion material without leaving the source boundary.',
    nextStep:
      'After this source is complete, move to the next safe source unit in the remaining practice-note inventory.',
    issueType: 'closing_boundary',
    issueMessage:
      'The closing material should stay separate from any later practice note or source family.',
    issueAction: 'Keep the closing boundary explicit and do not merge it into a later source unit.',
    issueEvidence:
      'Pages 21-31 cover financial reporting, valuation, reserve calculations, and the closing first-principles material.',
    reviewPacketNotes:
      'Keep the closing material review-only and do not merge it into any later practice note.',
  },
]

export const ltciPracticeNoteBatchDefinitions = Object.fromEntries(
  ltciPracticeNoteBatchSpecs.map((spec) => [
    spec.plannedBatchId,
    makeBatch(spec),
  ]),
)
