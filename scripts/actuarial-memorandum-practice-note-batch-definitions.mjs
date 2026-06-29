const rawSourceFile = 'Practice Notes/Actuarial Memorandum Practice Note 01142020.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle = 'Actuarial Memorandum practice note'
const sourceReference = 'American Academy of Actuaries exposure draft, January 2020'
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
    batchProfile: 'practice_note_actuarial_memorandum',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only companion-guidance slice so the actuarial memorandum boundary stays narrow and reviewable.`,
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
        versionDate: '2020-01',
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

const actuarialMemorandumPracticeNoteBatchSpecs = [
  {
    plannedBatchId: 'batch-202',
    batchSlug: 'am-202-opening-guidance',
    sourceId: 'am-opening-guidance',
    batchTitle: 'opening and background guidance slice',
    summaryLead:
      'Front matter, introduction, and background guidance frame the note as companion guidance for health actuarial memoranda',
    pageWindow: [1, 8],
    sectionReference: 'Front matter and Introduction and Background',
    citationText: 'A PUBLIC POLICY PRACTICE NOTE Exposure Draft Actuarial Memorandum Practice Note January 2020',
    keywords: ['actuarial memorandum', 'practice note', 'exposure draft', 'background', 'companion guidance'],
    notes:
      'Front matter, introduction, and background guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 1-8 only; title pages, disclaimer, introduction, and background guidance.',
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
    validationCheckId: 'actuarial-memorandum-opening-coverage',
    validationCheckDetails:
      'The selected pages capture the exposure-draft framing and background guidance.',
    nextStep:
      'Move to drafting the memorandum, content considerations, and sample content at pages 9-18.',
    issueType: 'opening_boundary',
    issueMessage:
      'The opening and background guidance should stay separate from the memorandum drafting material.',
    issueAction: 'Preserve the opening window and stop before drafting begins.',
    issueEvidence:
      'Pages 1-8 cover the title pages, disclaimer, introduction, and background guidance.',
    reviewPacketNotes:
      'Keep the opening companion-guidance text separate from the later memorandum drafting sections.',
  },
  {
    plannedBatchId: 'batch-203',
    batchSlug: 'am-203-drafting-considerations',
    sourceId: 'am-drafting-content-considerations',
    batchTitle: 'drafting and content considerations slice',
    summaryLead:
      'Drafting the memorandum, narrative and technical content considerations, and sample content explain how actuaries structure the memorandum',
    pageWindow: [9, 18],
    sectionReference: 'Drafting the Memorandum - Content Considerations and Sample Content',
    citationText: 'Drafting the Memorandum: Content Considerations and Sample Content',
    keywords: ['memorandum', 'drafting', 'narrative', 'technical', 'sample content', 'documentation'],
    notes:
      'Drafting guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 9-18 only; drafting the memorandum, narrative and technical content considerations, and sample content.',
    reviewFlags: [
      'reporting_requirement',
      'documentation_expectation',
      'definition_or_terminology',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'drafting_guidance',
    flagMessage:
      'The drafting and sample-content discussion contains important documentation judgment and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'actuarial-memorandum-drafting-coverage',
    validationCheckDetails:
      'The selected pages capture the drafting guidance and sample content without leaving the source boundary.',
    nextStep:
      'Move to actuarial judgment, reserve items, unpaid claims / liability line items, and risk-sharing references at pages 19-27.',
    issueType: 'selection_boundary',
    issueMessage:
      'The drafting and content-considerations material should stay separate from the judgment-heavy reserve-item section.',
    issueAction: 'Keep the drafting / content-considerations window narrow and stop before the reserve-item section begins.',
    issueEvidence:
      'Pages 9-18 cover drafting the memorandum and the sample content guidance.',
    reviewPacketNotes:
      'Keep the drafting guidance review-only and do not let it absorb the later judgment and reserve-item material.',
  },
  {
    plannedBatchId: 'batch-204',
    batchSlug: 'am-204-judgment-reserve-items',
    sourceId: 'am-judgment-and-reserve-items',
    batchTitle: 'judgment and reserve-items slice',
    summaryLead:
      'Actuarial judgment, reserve items, unpaid claims / liability line items, and risk-sharing references explain the content that must be documented carefully',
    pageWindow: [19, 27],
    sectionReference: 'Actuarial judgment, reserve items, unpaid claims / liability line items, and related references',
    citationText: 'The PDR calculation involves significant actuarial judgment',
    keywords: ['judgment', 'reserve items', 'unpaid claims', 'liability', 'risk-sharing', 'documentation'],
    notes:
      'Judgment-heavy memorandum content retained as review-only companion guidance.',
    sourceNotes:
      'Pages 19-27 only; actuarial judgment, reserve items, unpaid claims / liability line items, and risk-sharing references.',
    reviewFlags: [
      'calculation_structure',
      'formula_context',
      'reporting_requirement',
      'documentation_expectation',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'judgment_guidance',
    flagMessage:
      'The judgment-heavy reserve-item discussion should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'actuarial-memorandum-judgment-coverage',
    validationCheckDetails:
      'The selected pages capture the actuarial judgment and reserve-item material without leaving the source boundary.',
    nextStep:
      'Move to Appendix I ASOP references, Appendix II practice notes / SAPs, and Appendix III checklist at pages 28-37.',
    issueType: 'selection_boundary',
    issueMessage:
      'The judgment-heavy material should stay separate from the appendix and checklist material.',
    issueAction: 'Keep the judgment / reserve-item window narrow and stop before the appendices begin.',
    issueEvidence:
      'Pages 19-27 cover actuarial judgment, reserve items, and supporting references.',
    reviewPacketNotes:
      'Keep the judgment-heavy guidance review-only and do not let it absorb the appendix material.',
  },
  {
    plannedBatchId: 'batch-205',
    batchSlug: 'am-205-appendices-checklist',
    sourceId: 'am-appendices-and-checklist',
    batchTitle: 'appendices and checklist slice',
    summaryLead:
      'Appendix I ASOP references, Appendix II practice notes / SAPs, and Appendix III checklist close the note while preserving the end boundary',
    pageWindow: [28, 37],
    sectionReference: 'Appendix I, Appendix II, and Appendix III checklist through closeout',
    citationText: 'Appendix I Actuarial Standards of Practice Relevant to Health Actuarial Memoranda',
    keywords: ['appendix', 'ASOP', 'SAP', 'checklist', 'reference', 'closeout'],
    notes:
      'Appendix and checklist material retained as review-only companion guidance.',
    sourceNotes:
      'Pages 28-37 only; appendices and checklist material.',
    reviewFlags: [
      'cross_reference_mapping',
      'background_content',
      'caveat_or_companion_guidance',
      'boundary_control_window',
    ],
    flagType: 'appendix_guidance',
    flagMessage:
      'The appendix and checklist material should remain review-only and stop cleanly at the note close.',
    decisionType: 'scope_split',
    validationCheckId: 'actuarial-memorandum-appendices-coverage',
    validationCheckDetails:
      'The selected pages capture the appendices and checklist material while keeping the end boundary explicit.',
    nextStep:
      'After this source is complete, move to the next safe source unit in the remaining inventory.',
    issueType: 'closing_boundary',
    issueMessage:
      'The appendices and checklist should stay separate from any later practice note or source family.',
    issueAction: 'Keep the closing boundary explicit and do not merge it into a later source unit.',
    issueEvidence:
      'Pages 28-37 cover the appendix material and checklist.',
    reviewPacketNotes:
      'Keep the closing material review-only and do not merge it into any later practice note.',
  },
]

export const actuarialMemorandumPracticeNoteBatchDefinitions = Object.fromEntries(
  actuarialMemorandumPracticeNoteBatchSpecs.map((spec) => [
    spec.plannedBatchId,
    makeBatch(spec),
  ]),
)
