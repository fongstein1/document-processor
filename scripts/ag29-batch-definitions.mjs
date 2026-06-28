const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 29 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg29Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 29 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag29_rehabilitation_reserve_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 29 review-only batch: capture the rehabilitation-reserve guidance and keep the encoded wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 29 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 29 guideline slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 29 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 29 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the text layer is encoded.',
        notes: 'Keep the image backstop visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-rehabilitation`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'rehabilitation_context',
        message:
          'The rehabilitation context should remain visible because the guideline addresses court-ordered restructuring.',
        notes: 'Keep the rehabilitation context explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 29 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-rehabilitation-context`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The reserve guidance should stay review-only until a human confirms how the rehabilitation context applies.',
        recommendedAction:
          'Keep the rehabilitation-specific reserve interpretation as a review-only context note.',
      },
      {
        issueId: `citation-${sourceId}-issue-date-allowance`,
        sourceId,
        itemId,
        issueType: 'background_content',
        details:
          'The issue-date and expense-allowance wording should remain a review-only context note unless later guidance operationalizes it.',
        recommendedAction:
          'Keep the issue-date / expense-allowance wording inside the same narrow review window.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 29 remain indexed as review-only rehabilitation guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full two-page file remain a single review window, or should a later cleanup split the explanatory and issue-date material?',
        whyItMatters: 'The page window controls how much context is exposed in each review packet.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-page-image-confirmation`,
        severity: 'medium',
        issueType: 'page_image_confirmation',
        sourceId,
        itemId,
        message:
          'The AG 29 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoded and the rehabilitation wording should be checked against the page image.',
      },
      {
        issueId: `issue-${sourceId}-rehabilitation-context`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The reserve interpretation stays at the caveat/context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the rehabilitation-specific reserve interpretation review-only until a human confirms the wording.',
        evidence:
          'The guideline discusses court-ordered restructuring, reserve interpretation, and related surrender / expense allowance context.',
      },
      {
        issueId: `issue-${sourceId}-issue-date-allowance`,
        severity: 'medium',
        issueType: 'background_content',
        sourceId,
        itemId,
        message:
          'The issue-date and expense-allowance language remains contextual and should not be promoted.',
        recommendedAction:
          'Keep the issue-date / expense-allowance wording within the same narrow review window.',
        evidence:
          'The guideline discusses how issue date and expense allowance depend on the rehabilitation context and restructuring terms.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag29-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 29 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 29 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'rehabilitation-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the rehabilitation framing as review-only context.',
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
        documentType: 'actuarial_guideline',
        sourceTitle: spec.sourceTitle,
        sourceReference: spec.sourceReference,
        versionDate: null,
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
        authorityLevel: 'guidance',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: spec.reviewPacketIssueCount ?? 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 29 slice retained as review-only guidance until the wording and rehabilitation-context boundary are confirmed.',
      },
    ],
  }
}

const ag29BatchSpecs = [
  {
    plannedBatchId: 'batch-111',
    batchSlug: 'ag29-111-rehabilitation-reserve-guidance',
    sourceId: 'ag29-rehabilitation-reserve-guidance',
    filename: 'AG 29 - Guideline Concerning Reserves of Companies in Rehabilitation.pdf',
    sourceTitle: 'AG 29 - Guideline Concerning Reserves of Companies in Rehabilitation',
    sourceReference: 'Actuarial Guideline XXIX',
    batchTitle: 'rehabilitation reserve guidance slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 29 pages 1-2: rehabilitation background, reserve interpretation, issue-date context, expense-allowance context, and the closing boundary note',
    citationText:
      'The minimum reserve requirements should be interpreted in the context of court-ordered contract restructuring to result in the most appropriate reserves under the particular circumstances.',
    summary:
      'AG 29 explains how reserve requirements should be interpreted when life insurance or annuity contracts are restructured under court-ordered rehabilitation, including surrender restrictions, issue-date treatment, and CRVM expense allowances.',
    keywords: [
      'AG 29',
      'Actuarial Guideline XXIX',
      'rehabilitation',
      'court ordered restructuring',
      'minimum reserve requirements',
      'CRVM',
      'CARVM',
      'issue date',
      'expense allowance',
      'surrender restrictions',
    ],
    notes:
      'Two-page guideline; the text layer is encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active rehabilitation guidance; pages 1-2 stay together as a review-only slice and the encoded text should not widen the batch.',
    summaryLead:
      'AG 29 frames reserve interpretation for contracts restructured under court-ordered rehabilitation.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'rehabilitation_context'],
    reviewPacketNotes: 'Opening AG 29 slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the rehabilitation-context boundary before any later indexing choice.',
  },
]

export const ag29BatchDefinitions = Object.fromEntries(
  ag29BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg29Batch(spec)]),
)
