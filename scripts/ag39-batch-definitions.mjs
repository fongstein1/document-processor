const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 39 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg39Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 39 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag39_vaglb_reserves',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 39 review-only batch: capture VAGLB reserve guidance and keep the AG 40 boundary separate.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 39 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 39 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the AG 40 boundary outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 39 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 39 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the guideline text is encoding-noisy and line references are not expected.',
        notes: 'Keep the image backstop visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-vaglb`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'vaglb_caveat',
        message:
          'The VAGLB reserve guidance and asset-adequacy language should remain visible as review-only context.',
        notes: 'Keep the VAGLB boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 39 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 39 text layer, so page locators should remain the primary anchor.',
        recommendedAction:
          'Keep the page locator and page-image wording backstop visible instead of overclaiming exact line wording.',
      },
      {
        issueId: `citation-${sourceId}-reserve-boundary`,
        sourceId,
        itemId,
        issueType: 'reserve_method_structure',
        details:
          'The VAGLB reserve guidance should stay review-only until a human confirms how the guideline interpretation should be applied.',
        recommendedAction:
          'Keep the reserve-language wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-ag40-boundary`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The AG 40 guidance follows after the AG 39 slice and should stay out of scope for this batch.',
        recommendedAction:
          'Keep the AG 40 boundary outside the AG 39 batch and leave the later guideline for a separate plan.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 39 remain indexed as review-only VAGLB guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full 2-page file remain a single review pass, or should a later cleanup split the background from the asset-adequacy material?',
        whyItMatters: 'The page window controls how much context is exposed in the review packet.',
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
          'The AG 39 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-line-reference-unavailable`,
        severity: 'low',
        issueType: 'line_reference_unavailable',
        sourceId,
        itemId,
        message:
          'Stable line references are not expected, so page locators should remain the primary review anchor.',
        recommendedAction:
          'Keep the page locator and page-image wording backstop visible instead of overclaiming exact line wording.',
        evidence:
          'The source is an encoded 2-page PDF and the text layer does not support stable line mapping.',
      },
      {
        issueId: `issue-${sourceId}-reserve-boundary`,
        severity: 'medium',
        issueType: 'reserve_method_structure',
        sourceId,
        itemId,
        message:
          'The VAGLB reserve guidance stays at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the reserve-language wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses background interpretation, reserve standards, reinsurance, and asset adequacy analysis.',
      },
      {
        issueId: `issue-${sourceId}-ag40-boundary`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The AG 40 guidance follows after the AG 39 slice and should remain out of scope.',
        recommendedAction:
          'Keep the AG 40 boundary outside the AG 39 batch and leave the later guideline for a separate plan.',
        evidence: 'AG 40 is the next guideline in the folder listing and is not part of this batch.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag39-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 39 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 39 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'line-reference-unavailable',
        status: 'passed',
        details: 'The review packet keeps page locators primary because line references are not expected.',
      },
      {
        checkId: 'reserve-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the VAGLB reserve material as review-only context.',
      },
      {
        checkId: 'ag40-boundary-tracked',
        status: 'passed',
        details: 'The review packet keeps AG 40 outside the AG 39 batch.',
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
          'AG 39 slices retained as review-only guidance until the wording and AG 40 boundary are confirmed.',
      },
    ],
  }
}

const ag39BatchSpecs = [
  {
    plannedBatchId: 'batch-134',
    batchSlug: 'ag39-134-background-reserve-requirement',
    sourceId: 'ag39-vaglb-reserves',
    filename: 'AG 39 - Reserves For Variable Annuities With Guaranteed Living Benefits (VAGLBs).pdf',
    sourceTitle: 'AG 39 - Reserves For Variable Annuities With Guaranteed Living Benefits (VAGLBs)',
    sourceReference: 'Actuarial Guideline XXXIX',
    batchTitle: 'background and reserve-requirement slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 39 pages 1-2: background, temporary interpretation, reserve-language overview, reinsurance, and asset adequacy analysis requirement.',
    citationText:
      'The purpose of this Actuarial Guideline is to interpret the standards for the valuation of reserves for guaranteed living benefits.',
    summary:
      'AG 39 interprets reserve standards for VAGLBs, keeps the temporary background and asset-adequacy language review-only, and avoids widening into AG 40.',
    keywords: [
      'AG 39',
      'Actuarial Guideline XXXIX',
      'VAGLBs',
      'temporary',
      'asset adequacy analysis',
      'reinsurance',
      'general account',
      'reserve',
    ],
    notes:
      'Two-page background and reserve-requirement window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; AG 40 remains out of scope.',
    summaryLead: 'AG 39 interprets reserve standards for VAGLBs.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'vaglb_scope_caveat'],
    reviewPacketNotes: 'Background and reserve-requirement slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 40 boundary before any later indexing choice.',
  },
]

export const ag39BatchDefinitions = Object.fromEntries(
  ag39BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg39Batch(spec)]),
)
