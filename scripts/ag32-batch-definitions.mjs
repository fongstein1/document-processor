const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 32 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg32Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 32 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag32_immediate_payment_of_claims_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 32 review-only batch: capture immediate payment of claims reserve guidance and keep the AG 33 boundary separate.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 32 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 32 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the AG 33 boundary outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 32 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 32 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the guideline text is encoding-noisy.',
        notes: 'Keep the image backstop visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-immediate-payment`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'immediate_payment_reserve_caveat',
        message:
          'The immediate-payment reserve guidance should remain visible as review-only context.',
        notes: 'Keep the reserve boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 32 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-reserve-boundary`,
        sourceId,
        itemId,
        issueType: 'reserve_adjustment_caveat',
        details:
          'The immediate-payment reserve guidance should stay review-only until a human confirms how the reserve adjustment should be interpreted.',
        recommendedAction:
          'Keep the immediate-payment / reserve wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-ag33-boundary`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The AG 33 modification page follows immediately after the AG 32 slice and should stay out of scope for this batch.',
        recommendedAction:
          'Keep the AG 33 boundary outside the AG 32 batch and leave page 3 for a later plan.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 32 remain indexed as review-only immediate-payment guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full two-page file remain a single review window, or should a later cleanup split the reserve guidance from the background explanation?',
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
          'The AG 32 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-reserve-boundary`,
        severity: 'medium',
        issueType: 'reserve_adjustment_caveat',
        sourceId,
        itemId,
        message:
          'The immediate-payment reserve guidance stays at the context level and should not be treated as a full mechanics set.',
        recommendedAction:
          'Keep the immediate-payment / reserve wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses additional reserves for immediate payment of claims and percentage adjustments for curtate reserve treatment.',
      },
      {
        issueId: `issue-${sourceId}-ag33-boundary`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The AG 33 modification page follows immediately after the AG 32 slice and should remain out of scope.',
        recommendedAction:
          'Keep the AG 33 boundary outside the AG 32 batch and leave page 3 for a later plan.',
        evidence:
          'Page 3 is an amendment proposal for AG 33 modifications for non-elective incidence rates.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag32-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 32 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 32 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'immediate-payment-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the immediate-payment and reserve adjustment language as review-only context.',
      },
      {
        checkId: 'ag33-boundary-tracked',
        status: 'passed',
        details: 'The review packet keeps page 3 and AG 33 outside the AG 32 batch.',
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
          'AG 32 slice retained as review-only guidance until the wording and AG 33 boundary are confirmed.',
      },
    ],
  }
}

const ag32BatchSpecs = [
  {
    plannedBatchId: 'batch-114',
    batchSlug: 'ag32-114-immediate-payment-claims',
    sourceId: 'ag32-immediate-payment-claims',
    filename: 'AG 32 - Reserve for Immediate Payment of Claims.pdf',
    sourceTitle: 'AG 32 - Reserve for Immediate Payment of Claims',
    sourceReference: 'Actuarial Guideline XXXII',
    batchTitle: 'immediate-payment-of-claims reserve guidance slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 32 pages 1-2: background material, reserve guidance for immediate payment of claims, and the closing boundary note.',
    citationText:
      'Many insurers have held a reserve for immediate payment of claims either by an adjustment to curtate reserves or by including provision therefore in the basic reserves calculated on a continuous payment of claims basis.',
    summary:
      'AG 32 explains how reserves for immediate payment of claims should be handled when continuous or semi-continuous functions are used, and how curtate reserves are adjusted when death claims are paid immediately.',
    keywords: [
      'AG 32',
      'Actuarial Guideline XXXII',
      'immediate payment of claims',
      'curtate reserves',
      'continuous payment',
      'annual statement',
      'policy year',
      'reserve adjustment',
    ],
    notes:
      'Two-page guideline; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; pages 1-2 stay together and page 3 begins AG 33 modifications for non-elective incidence rates.',
    summaryLead: 'AG 32 clarifies immediate-payment-of-claims reserve treatment.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'immediate_payment_reserve_caveat'],
    reviewPacketNotes: 'Immediate-payment-of-claims slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 33 boundary before any later indexing choice.',
  },
]

export const ag32BatchDefinitions = Object.fromEntries(
  ag32BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg32Batch(spec)]),
)
