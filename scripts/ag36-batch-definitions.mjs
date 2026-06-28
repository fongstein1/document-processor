const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 36 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg36Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 36 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag36_eiul_carvm_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 36 review-only batch: capture equity-indexed-life-insurance CARVM guidance and keep the AG 37 boundary separate.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 36 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 36 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the AG 37 boundary outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 36 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 36 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
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
        flagId: `flag-${sourceId}-method-mechanics`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'method_mechanics_caveat',
        message:
          'The method mechanics and certification material should remain visible as review-only context.',
        notes: 'Keep the mechanics-driven boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 36 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-method-mechanics-boundary`,
        sourceId,
        itemId,
        issueType: 'reserve_method_structure',
        details:
          'The method mechanics and certification requirements should stay review-only until a human confirms how the guideline interpretation should be applied.',
        recommendedAction:
          'Keep the method-overview / mechanics wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-ag37-boundary`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The AG 37 guidance follows after the AG 36 slice and should stay out of scope for this batch.',
        recommendedAction:
          'Keep the AG 37 boundary outside the AG 36 batch and leave the later guideline for a separate plan.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 36 remain indexed as review-only EIUL/CARVM guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full eleven-page file remain a four-window review pass, or should a later cleanup split the method overview from the attachment-driven mechanics and certification material?',
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
          'The AG 36 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-method-mechanics-boundary`,
        severity: 'medium',
        issueType: 'reserve_method_structure',
        sourceId,
        itemId,
        message:
          'The method mechanics and certification guidance stay at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the method-overview / mechanics wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses implied guaranteed rate, option values, Hedged as Required criteria, and certification material.',
      },
      {
        issueId: `issue-${sourceId}-ag37-boundary`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The AG 37 guidance follows after the AG 36 slice and should remain out of scope.',
        recommendedAction:
          'Keep the AG 37 boundary outside the AG 36 batch and leave the later guideline for a separate plan.',
        evidence:
          'AG 37 is the next guideline in the folder listing and is not part of this batch.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag36-page-window-coverage',
        status: 'passed',
        details: 'The selected page windows capture the planned AG 36 slices.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 36 slices carry a source reference and page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'method-mechanics-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the method mechanics and attachment material as review-only context.',
      },
      {
        checkId: 'certification-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the certification material as review-only context.',
      },
      {
        checkId: 'ag37-boundary-tracked',
        status: 'passed',
        details: 'The review packet keeps AG 37 outside the AG 36 batch.',
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
          'AG 36 slices retained as review-only guidance until the wording and AG 37 boundary are confirmed.',
      },
    ],
  }
}

const ag36BatchSpecs = [
  {
    plannedBatchId: 'batch-123',
    batchSlug: 'ag36-123-foundation-overview',
    sourceId: 'ag36-eiul-carvm',
    filename: 'AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies.pdf',
    sourceTitle: 'AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies',
    sourceReference: 'Actuarial Guideline XXXVI',
    batchTitle: 'foundation and method-overview slice',
    pageWindow: [1, 3],
    sectionReference:
      'AG 36 pages 1-3: background information, purpose, scope, definitions, CARVM framing, and the Type 1 / Type 2 overview.',
    citationText:
      'The purpose of this Actuarial Guideline is to clarify statutory and regulatory requirements for the valuation of reserves for equity indexed universal life insurance policies.',
    summary:
      'AG 36 explains how CARVM applies to equity indexed life insurance, including the future value / projected index overview and the Type 1 and Type 2 framing.',
    keywords: [
      'AG 36',
      'Actuarial Guideline XXXVI',
      'equity indexed life insurance',
      'CARVM',
      'MVRM',
      'Type 1',
      'Type 2',
      'definitions',
    ],
    notes:
      'Three-page foundation window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the foundation window stays together and AG 37 remains out of scope.',
    summaryLead: 'AG 36 defines CARVM guidance for equity indexed life insurance.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'method_overview_caveat'],
    reviewPacketNotes: 'Foundation slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 37 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-124',
    batchSlug: 'ag36-124-method-mechanics',
    sourceId: 'ag36-eiul-carvm',
    filename: 'AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies.pdf',
    sourceTitle: 'AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies',
    sourceReference: 'Actuarial Guideline XXXVI',
    batchTitle: 'attachments and method-mechanics slice',
    pageWindow: [4, 6],
    sectionReference:
      'AG 36 pages 4-6: Attachment 1 computational-method descriptions and the implied-guaranteed-rate / option-based mechanics.',
    citationText:
      'A Type 1 computational method is deemed to be consistent with CRVM if an insurer using the method complies with the Hedged as Required Criteria and provides a certification as to compliance with the criteria.',
    summary:
      'AG 36 adds Attachment 1 computational-method descriptions and the implied-guaranteed-rate / option-based mechanics for the Type 1 method.',
    keywords: [
      'AG 36',
      'Actuarial Guideline XXXVI',
      'Attachment 1',
      'computational methods',
      'implied guaranteed rate',
      'option values',
      'Type 1',
      'Type 2',
    ],
    notes:
      'Three-page mechanics window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the mechanics window stays together and AG 37 remains out of scope.',
    summaryLead: 'AG 36 adds the computational-method and rate-mechanics framework.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'method_mechanics_caveat'],
    reviewPacketNotes: 'Mechanics slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 37 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-125',
    batchSlug: 'ag36-125-hedged-notification',
    sourceId: 'ag36-eiul-carvm',
    filename: 'AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies.pdf',
    sourceTitle: 'AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies',
    sourceReference: 'Actuarial Guideline XXXVI',
    batchTitle: 'hedged-as-required and notification slice',
    pageWindow: [7, 8],
    sectionReference:
      'AG 36 pages 7-8: Attachment 2 Hedged as Required criteria and the notification threshold material.',
    citationText:
      'The company must notify the Commissioner in each state in which the insurer is licensed.',
    summary:
      'AG 36 closes the mechanics window with Hedged as Required criteria and the notification threshold.',
    keywords: [
      'AG 36',
      'Actuarial Guideline XXXVI',
      'Attachment 2',
      'hedged as required',
      'notification threshold',
      'quarterly',
      'option replication',
    ],
    notes:
      'Two-page hedging window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the hedging window stays together and AG 37 remains out of scope.',
    summaryLead: 'AG 36 adds the hedged-as-required and notification framework.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'hedged_as_required_caveat'],
    reviewPacketNotes: 'Hedging slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 37 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-126',
    batchSlug: 'ag36-126-certification-closeout',
    sourceId: 'ag36-eiul-carvm',
    filename: 'AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies.pdf',
    sourceTitle: 'AG 36 - The Application of the Commissioners’ Reserve Valuation Method to Equity Indexed Life Insurance Policies',
    sourceReference: 'Actuarial Guideline XXXVI',
    batchTitle: 'certification and closeout slice',
    pageWindow: [9, 11],
    sectionReference:
      'AG 36 pages 9-11: reasonableness certification and updated market-value certification material.',
    citationText:
      'The following certification must be filed in conjunction with each quarterly and annual statutory financial statement filed with the appropriate regulatory official in each state in which the insurer does business.',
    summary:
      'AG 36 closes with the reasonableness and consistency certifications that support the filing requirement.',
    keywords: [
      'AG 36',
      'Actuarial Guideline XXXVI',
      'reasonableness certification',
      'consistency certification',
      'updated market value',
      'quarterly',
      'annual statutory financial statement',
    ],
    notes:
      'Three-page closeout window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the certification window stays together and AG 37 remains out of scope.',
    summaryLead: 'AG 36 closes with filing and certification requirements.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'certification_caveat'],
    reviewPacketNotes: 'Certification slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 37 boundary before any later indexing choice.',
  },
]

export const ag36BatchDefinitions = Object.fromEntries(
  ag36BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg36Batch(spec)]),
)
