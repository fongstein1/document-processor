const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const sourceTitle = 'Minimum Standards for Determining Reserve Liabilities and Non-Forfeiture Values for Preneed Life Insurance'
const sourceReference = 'New York Regulation 192 / 11 CRR-NY Part 102'
const defaultNonLearnerNotes =
  'Regulation 192 stays review-only. Keep page locators primary, preserve the page-image wording backstop, and do not promote any item.'

const makeReg192Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 192 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_192_preneed_life_insurance',
    processingIntentText:
      spec.processingIntentText ??
      'Small NY Regulation 192 review-only batch: capture the opening title, purpose, applicability, definitions, and transition-rule window and keep the noisy text layer caveat visible.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. Regulation 192 is retained as review-only regulatory text and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This Regulation 192 slice is intentionally limited to ${spec.batchTitle} and keeps the later sections outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small NY Regulation 192 batch. Keep the work review-first, preserve page locators and the page-image backstop, and do not promote any item.',
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
        issueType: spec.citationIssueType ?? 'cross_reference_mapping',
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
        details: 'Controlled manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: spec.validationCheckId,
        status: 'passed',
        details: spec.validationCheckDetails,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The selected page carries a source reference and a page locator.',
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
        relativePath: `${rawSourceFolder}/${spec.filename}`,
        sourceFamilyId,
        documentType: 'ny_regulation',
        sourceTitle,
        sourceReference,
        versionDate: '2020-03-15',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: 'high',
        reviewFlags: ['state_regulation', ...spec.reviewFlags],
        reviewStatus: spec.reviewStatus ?? 'needs_human_review',
        itemKind: spec.itemKind ?? 'review_note',
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
          'Regulation 192 slice retained as review-only regulatory text until the wording and boundary are confirmed.',
      },
    ],
  }
}

const reg192BatchSpecs = [
  {
    plannedBatchId: 'batch-266',
    batchSlug: 'reg192-266-preneed-life-insurance',
    sourceId: 'reg192-preneed-life-insurance',
    filename: '2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-192-11-NYCRR-S102.pdf',
    batchTitle:
      'Regulation 192 opening title, purpose, applicability, definitions, and transition-rule window',
    processingIntentText:
      'Capture the opening title, purpose, applicability, definitions, and transition-rule window for Regulation 192 while keeping the noisy OCR-like text layer caveat visible.',
    processingIntentNotes:
      'This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText:
      'Batch 266 remains review-only. Regulation 192 is retained as active NY regulation text and is not approved for promotion.',
    reviewPacketReason:
      'The three-page Regulation 192 slice is intentionally limited to the opening sections and transition-rule window so later sections stay outside the batch.',
    nextStep:
      'Confirm the page-image wording for the opening title page and the transition-rule boundary before any later reuse.',
    flagType: 'page_image_backstop_required',
    flagMessage:
      'Regulation 192 should stay page-image anchored because the text layer is noisy / OCR-like and the exact wording matters.',
    citationIssueType: 'cross_reference_mapping',
    citationDetails:
      'The opening sections reference Regulation 179 and Regulation 126, so the cross-reference map should stay review-only and non-interpretive.',
    citationAction:
      'Keep the references mapped as cross-reference context rather than treating them as the main regulatory duty.',
    decisionType: 'indexing_choice',
    decisionQuestion:
      'Should Regulation 192 remain indexed as active review-only regulatory text, or should later cleanup split the transition-rule wording into a separate note?',
    decisionWhy:
      'The indexing choice affects how much of the noisy three-page window stays together in future review passes.',
    issueType: 'requires_human_interpretation',
    issueMessage:
      'The opening page and transition-rule wording need page-image confirmation because the text layer is noisy / OCR-like.',
    issueAction:
      'Keep the page-image backstop visible and avoid overclaiming exact wording from the OCR-like layer.',
    issueEvidence:
      'The extracted text is garbled while the page image identifies the NY Regulation 192 / Part 102 title page clearly.',
    validationCheckId: 'reg192-three-page-coverage',
    validationCheckDetails: 'The selected page window captures the full three-page Regulation 192 slice.',
    sectionReference: 'Opening sections through transition rules',
    citationText: 'New York Regulation 192 / 11 CRR-NY Part 102, pages 1-3',
    reviewFlags: [
      'jurisdiction_specific_requirement',
      'regulatory_requirement',
      'definition_or_terminology',
      'cross_reference_mapping',
      'background_content',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    reviewStatus: 'needs_human_review',
    itemKind: 'review_note',
    notes:
      'Regulation 192 is a three-page NY regulation slice. Keep the opening sections and transition rules together, and preserve the page-image backstop.',
    summary:
      'Regulation 192 opens with purpose, applicability, and definitions, then continues into transition-rule language that should remain review-only.',
    keywords: [
      'New York Regulation 192',
      '11 CRR-NY Part 102',
      'preneed life insurance',
      'reserve liabilities',
      'non-forfeiture values',
      'transition rules',
    ],
    sourceNotes:
      'The PDF metadata identifies a 2021 VLM Report draft compilation, but the page image identifies New York Regulation 192 / 11 CRR-NY Part 102 and the text layer is noisy.',
    reviewPacketNotes:
      'Keep the page-image wording backstop visible and preserve the transition-rule boundary as part of the single three-page slice.',
  },
]

export const reg192BatchDefinitions = Object.fromEntries(
  reg192BatchSpecs.map((spec) => [spec.plannedBatchId, makeReg192Batch(spec)]),
)
