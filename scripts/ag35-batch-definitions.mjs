const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 35 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg35Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 35 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag35_eia_carvm_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 35 review-only batch: capture equity-indexed-annuity CARVM guidance and keep the AG 36 boundary separate.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 35 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 35 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the AG 36 boundary outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 35 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 35 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
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
        flagId: `flag-${sourceId}-hedging-criteria`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'hedged_as_required_caveat',
        message:
          'The hedged-as-required criteria and certification material should remain visible as review-only context.',
        notes: 'Keep the criteria-driven boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 35 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-hedging-criteria-boundary`,
        sourceId,
        itemId,
        issueType: 'hedging_or_risk_mitigation',
        details:
          'The hedged-as-required criteria and the computational-method descriptions should stay review-only until a human confirms how the guideline interpretation should be applied.',
        recommendedAction:
          'Keep the method-overview / hedging-criteria wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-ag36-boundary`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The AG 36 guidance follows after the AG 35 slice and should stay out of scope for this batch.',
        recommendedAction:
          'Keep the AG 36 boundary outside the AG 35 batch and leave the later guideline for a separate plan.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 35 remain indexed as review-only EIA/CARVM guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full nine-page file remain a three-window review pass, or should a later cleanup split the method overview from the attachment-driven mechanics material?',
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
          'The AG 35 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-hedging-criteria-boundary`,
        severity: 'medium',
        issueType: 'hedging_or_risk_mitigation',
        sourceId,
        itemId,
        message:
          'The hedged-as-required criteria and computational-method guidance stay at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the method-overview / hedging-criteria wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses Type 1 and Type 2 methods, hedged-as-required criteria, and attachment-driven reserve inputs.',
      },
      {
        issueId: `issue-${sourceId}-ag36-boundary`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The AG 36 guidance follows after the AG 35 slice and should remain out of scope.',
        recommendedAction:
          'Keep the AG 36 boundary outside the AG 35 batch and leave the later guideline for a separate plan.',
        evidence:
          'AG 36 is the next guideline in the folder listing and is not part of this batch.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag35-page-window-coverage',
        status: 'passed',
        details: 'The selected page windows capture the planned AG 35 slices.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 35 slices carry a source reference and page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'hedging-criteria-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the hedging criteria and computational-method material as review-only context.',
      },
      {
        checkId: 'certification-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the certification and closeout material as review-only context.',
      },
      {
        checkId: 'ag36-boundary-tracked',
        status: 'passed',
        details: 'The review packet keeps AG 36 outside the AG 35 batch.',
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
          'AG 35 slices retained as review-only guidance until the wording and AG 36 boundary are confirmed.',
      },
    ],
  }
}

const ag35BatchSpecs = [
  {
    plannedBatchId: 'batch-120',
    batchSlug: 'ag35-120-foundation-overview',
    sourceId: 'ag35-eia-carvm',
    filename: "AG 35 - The Application of the Commissioners' Annuity Reserve Method to Equity Indexed Annuities.pdf",
    sourceTitle: "AG 35 - The Application of the Commissioners' Annuity Reserve Method to Equity Indexed Annuities",
    sourceReference: 'Actuarial Guideline XXXV',
    batchTitle: 'foundation and method-overview slice',
    pageWindow: [1, 3],
    sectionReference:
      'AG 35 pages 1-3: background information, purpose, scope, definitions, CARVM framing, and the Type 1 / Type 2 overview.',
    citationText:
      'The purpose of this Actuarial Guideline is to interpret the standards for the valuation of reserves for equity indexed annuities.',
    summary:
      'AG 35 explains how CARVM applies to equity indexed annuities, including the future value / projected index overview and the Type 1 and Type 2 computational method framing.',
    keywords: [
      'AG 35',
      'Actuarial Guideline XXXV',
      'equity indexed annuities',
      'CARVM',
      'MVRM',
      'EDIM',
      'Type 1',
      'Type 2',
      'definitions',
    ],
    notes:
      'Three-page foundation window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the foundation window stays together and AG 36 remains out of scope.',
    summaryLead: 'AG 35 defines CARVM guidance for equity indexed annuities.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'method_overview_caveat'],
    reviewPacketNotes: 'Foundation slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 36 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-121',
    batchSlug: 'ag35-121-attachments-hedging',
    sourceId: 'ag35-eia-carvm',
    filename: "AG 35 - The Application of the Commissioners' Annuity Reserve Method to Equity Indexed Annuities.pdf",
    sourceTitle: "AG 35 - The Application of the Commissioners' Annuity Reserve Method to Equity Indexed Annuities",
    sourceReference: 'Actuarial Guideline XXXV',
    batchTitle: 'attachments and hedging-criteria slice',
    pageWindow: [4, 6],
    sectionReference:
      'AG 35 pages 4-6: Attachment 1 computational-method descriptions and Attachment 2 Hedged as Required criteria.',
    citationText:
      'In order to use a Type 1 computational method, the appointed actuary needs to certify quarterly that it meets either the Basic or Option Replication criteria.',
    summary:
      'AG 35 adds Attachment 1 computational-method descriptions and Attachment 2 Hedged as Required criteria for the Type 1 method.',
    keywords: [
      'AG 35',
      'Actuarial Guideline XXXV',
      'Attachment 1',
      'Attachment 2',
      'computational methods',
      'hedged as required',
      'Type 1',
      'Type 2',
    ],
    notes:
      'Three-page mechanics window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the hedging-criteria window stays together and AG 36 remains out of scope.',
    summaryLead: 'AG 35 adds the computational-method and hedging-criteria framework.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'hedging_criteria_caveat'],
    reviewPacketNotes: 'Hedging-criteria slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 36 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-122',
    batchSlug: 'ag35-122-certification-closeout',
    sourceId: 'ag35-eia-carvm',
    filename: "AG 35 - The Application of the Commissioners' Annuity Reserve Method to Equity Indexed Annuities.pdf",
    sourceTitle: "AG 35 - The Application of the Commissioners' Annuity Reserve Method to Equity Indexed Annuities",
    sourceReference: 'Actuarial Guideline XXXV',
    batchTitle: 'certification and closeout slice',
    pageWindow: [7, 9],
    sectionReference:
      'AG 35 pages 7-9: quarterly notification threshold, reasonableness certification, consistency certification, and closeout material.',
    citationText:
      'The certification must be filed in conjunction with each quarterly and annual statutory financial statement filed with the appropriate regulatory official in each state in which the insurer does business.',
    summary:
      'AG 35 closes with the notification threshold and the reasonableness / consistency certifications that support the filing requirement.',
    keywords: [
      'AG 35',
      'Actuarial Guideline XXXV',
      'notification threshold',
      'reasonableness certification',
      'consistency certification',
      'quarterly',
      'annual statutory financial statement',
    ],
    notes:
      'Three-page closeout window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the certification window stays together and AG 36 remains out of scope.',
    summaryLead: 'AG 35 closes with notification and certification requirements.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'certification_caveat'],
    reviewPacketNotes: 'Certification slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 36 boundary before any later indexing choice.',
  },
]

export const ag35BatchDefinitions = Object.fromEntries(
  ag35BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg35Batch(spec)]),
)
