const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const defaultNonLearnerNotes =
  'Regulation 141 stays review-only. Keep page locators and line references primary, and do not promote any item.'

const makeReg141Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 141 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_141_commutation',
    processingIntentText:
      spec.processingIntentText ??
      'Small NY Regulation 141 review-only batch: capture the commutation guidance and keep later sections outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. Regulation 141 is retained as review-only regulatory text and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This Regulation 141 slice is intentionally limited to ${spec.batchTitle} and keeps the next section outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small NY Regulation 141 batch. Keep the work review-first, preserve page locators and line references, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'paragraph_locator_primary',
        message:
          'Regulation 141 should stay page-locator anchored because the runner is expected to preserve line references for this text source.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-line-reference`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'line_references_expected',
        message:
          'Line references should be preserved for this PDF path; page locators remain the primary anchor.',
        notes: 'Keep the page-locator anchor visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-topic`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: spec.flagType,
        message: spec.flagMessage,
        notes: 'Keep the topic boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-paragraph-locator-primary`,
        sourceId,
        itemId,
        issueType: 'paragraph_locator_primary',
        details:
          'Page locators should remain the primary anchor for Regulation 141 because the source is a PDF and the runner should preserve line references.',
        recommendedAction:
          'Keep the planned page window together and preserve the locator in the review packet.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-gap`,
        sourceId,
        itemId,
        issueType: 'line_references_expected',
        details:
          'Line references should be preserved for this PDF source, so page locators remain the practical review anchor.',
        recommendedAction:
          'Keep the page locator visible and avoid overclaiming exact line wording.',
      },
      {
        issueId: `citation-${sourceId}-topic-boundary`,
        sourceId,
        itemId,
        issueType: spec.topicIssueType,
        details: spec.topicIssueDetails,
        recommendedAction: spec.topicRecommendedAction,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should Regulation 141 remain indexed as active review-only regulatory guidance, or should it later be linked only as a context note if later amendments supersede it?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-paragraph-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page-window split remain the canonical regeneration boundary, or should later cleanup rebalance the reporting and closeout sections?',
        whyItMatters: 'The page window controls how much context is exposed in the review packet.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-paragraph-locator-primary`,
        severity: 'medium',
        issueType: 'paragraph_locator_primary',
        sourceId,
        itemId,
        message:
          'The Regulation 141 slice should remain anchored by page locators because the runner is expected to preserve line references.',
        recommendedAction:
          'Keep the page locator visible instead of overclaiming exact line wording.',
        evidence:
          'The source is a PDF and the controlled runner should preserve line-level references for this source family.',
      },
      {
        issueId: `issue-${sourceId}-line-reference-gap`,
        severity: 'medium',
        issueType: 'line_references_expected',
        sourceId,
        itemId,
        message:
          'Line references should be preserved for this PDF source, so the page locator should remain the review anchor.',
        recommendedAction:
          'Keep the page locator visible and avoid overclaiming exact line wording.',
        evidence:
          'Regulation 141 is a text-based PDF source and the controlled runner should preserve line-level references for this source family.',
      },
      {
        issueId: `issue-${sourceId}-topic-boundary`,
        severity: 'medium',
        issueType: spec.topicIssueType,
        sourceId,
        itemId,
        message: spec.topicIssueMessage,
        recommendedAction: spec.topicRecommendedAction,
        evidence: spec.topicIssueEvidence,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'reg141-page-window-coverage',
        status: 'passed',
        details: `The selected page window captures the planned Regulation 141 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The Regulation 141 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'line-reference-gap-tracked',
        status: 'passed',
        details: 'The review packet keeps page locators primary because line references should be preserved.',
      },
      {
        checkId: 'topic-context-tracked',
        status: 'passed',
        details: spec.topicValidationDetails,
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
        relativePath: `${rawSourceFolder}/${spec.filename}`,
        sourceFamilyId,
        documentType: 'ny_regulation',
        sourceTitle: spec.sourceTitle,
        sourceReference: spec.sourceReference,
        versionDate: '2006-11-01',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: 'high',
        reviewFlags: spec.reviewFlags,
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes: spec.notes,
        summary: spec.summary,
        keywords: spec.keywords,
        sourceNotes: spec.sourceNotes,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'regulation',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'Regulation 141 slice retained as review-only regulatory text until the wording and boundary are confirmed.',
      },
    ],
  }
}

const reg141BatchSpecs = [
  {
    plannedBatchId: 'batch-180',
    batchSlug: 'reg141-180-opening-purpose-applicability',
    sourceId: 'reg141-opening-purpose-applicability',
    filename: 'Reg-141-11-NYCRR-S128-Reinsurance.pdf',
    sourceTitle: 'Commutation of Reinsurance Agreements',
    sourceReference: '11 NYCRR Part 128 (Regulation 141)',
    batchTitle: 'opening title, purpose, and applicability slice',
    pageWindow: [1, 3],
    sectionReference: 'Part 128 (Regulation 141): title, purpose, and applicability',
    citationText: 'Section 128.0 Purpose.',
    summary:
      'Regulation 141 opens with the title, purpose, and applicability instructions for commutation of reinsurance agreements involving impaired or insolvent insurers.',
    keywords: ['Reg 141', 'commutation', 'reinsurance agreements', 'purpose', 'applicability'],
    notes: 'Opening title, purpose, and applicability slice; keep the official-compilation header visible.',
    sourceNotes: 'Pages 1-3 only; title page plus purpose/applicability window.',
    reviewPacketNotes: 'Keep the opening regulatory text separate from definitions and procedures.',
    nextStep:
      'Move to definitions, general provisions, and requirements at pages 4-8 while keeping the opening window narrow.',
    flagType: 'opening_boundary',
    flagMessage: 'The opening title, purpose, and applicability slice should remain review-only.',
    topicIssueType: 'opening_boundary',
    topicIssueDetails:
      'The opening material should stay separate from the later definitions and procedures sections.',
    topicRecommendedAction: 'Preserve the opening window and stop before definitions begin.',
    topicIssueMessage:
      'The opening title, purpose, and applicability slice should remain separate from the definitions section.',
    topicIssueEvidence:
      'Pages 1-3 contain the official-compilation header, title, purpose, and applicability material.',
    topicValidationDetails: 'The opening window stayed confined to the planned page range.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'regulatory_requirement', 'background_content'],
  },
  {
    plannedBatchId: 'batch-181',
    batchSlug: 'reg141-181-definitions-general-provisions-requirements',
    sourceId: 'reg141-definitions-general-provisions-requirements',
    filename: 'Reg-141-11-NYCRR-S128-Reinsurance.pdf',
    sourceTitle: 'Commutation of Reinsurance Agreements',
    sourceReference: '11 NYCRR Part 128 (Regulation 141)',
    batchTitle: 'definitions, general provisions, and requirements slice',
    pageWindow: [4, 8],
    sectionReference: 'Part 128 (Regulation 141): definitions, general provisions, and requirements',
    citationText: 'Section 128.2 Definitions.',
    summary:
      'Definitions and general provisions define commutation and set the conditions and plan content for seeking superintendent approval.',
    keywords: ['Reg 141', 'definitions', 'general provisions', 'requirements', 'commutation', 'reinsurance'],
    notes: 'Definitions / general provisions / requirements slice; keep procedures for a later batch.',
    sourceNotes: 'Pages 4-8 only; definitions and requirements window.',
    reviewPacketNotes: 'Definitions should not absorb the procedures and reporting section.',
    nextStep:
      'Move to procedures and reporting at pages 9-11 while keeping the definitions window tight.',
    flagType: 'definitions_boundary',
    flagMessage:
      'Definitions and general provisions should remain review-only and stop before procedures begins.',
    topicIssueType: 'definitions_boundary',
    topicIssueDetails:
      'The definitions slice should stay separate from the later procedures and reporting material.',
    topicRecommendedAction: 'Preserve the definitions window and keep the procedures section out of this batch.',
    topicIssueMessage:
      'The definitions, general provisions, and requirements slice should remain separate from the procedures section.',
    topicIssueEvidence: 'Pages 4-8 contain the definitions, general provisions, and requirement material.',
    topicValidationDetails:
      'The definitions window stayed confined to the planned page range and did not absorb procedures.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'definition_or_terminology', 'regulatory_requirement'],
  },
  {
    plannedBatchId: 'batch-182',
    batchSlug: 'reg141-182-procedures-reporting-boundary',
    sourceId: 'reg141-procedures-reporting-boundary',
    filename: 'Reg-141-11-NYCRR-S128-Reinsurance.pdf',
    sourceTitle: 'Commutation of Reinsurance Agreements',
    sourceReference: '11 NYCRR Part 128 (Regulation 141)',
    batchTitle: 'procedures and reporting closeout slice',
    pageWindow: [9, 11],
    sectionReference: 'Part 128 (Regulation 141): procedures and reporting requirements',
    citationText: 'Section 128.5 Procedures.',
    summary:
      'Procedures and reporting requirements govern submission timing, superintendent objections, and the reporting of commutation impacts in future financial statements.',
    keywords: ['Reg 141', 'procedures', 'reporting requirements', 'loss development schedules', 'reinsurance commutation'],
    notes: 'Procedures/reporting closeout; keep the closing boundary explicit.',
    sourceNotes: 'Pages 9-11 only; procedures, reporting, and closing boundary slice.',
    reviewPacketNotes: 'Procedures and reporting should stay separate from any later NY regulation files.',
    nextStep: 'Confirm that the source ends cleanly here and decide whether any later NY regulation file should be planned next.',
    flagType: 'procedures_reporting_boundary',
    flagMessage:
      'The procedures and reporting slice should remain review-only and end the source cleanly.',
    topicIssueType: 'procedures_reporting_boundary',
    topicIssueDetails:
      'The procedures and reporting closeout should remain separate from any future NY regulation source.',
    topicRecommendedAction: 'Preserve the closing boundary and stop at the end of the source.',
    topicIssueMessage:
      'The procedures and reporting closeout should remain separate from any later NY regulation file.',
    topicIssueEvidence: 'Pages 9-11 contain the procedures and reporting requirements.',
    topicValidationDetails:
      'The procedures window stayed confined to the planned page range and remained separate from the source boundary.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'reporting_requirement', 'documentation_expectation'],
  },
]

export const reg141BatchDefinitions = Object.fromEntries(
  reg141BatchSpecs.map((spec) => {
    const batch = makeReg141Batch(spec)
    return [spec.plannedBatchId, batch]
  }),
)
