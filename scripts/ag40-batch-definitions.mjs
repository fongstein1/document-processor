const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 40 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg40Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 40 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag40_bailout_provisions',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 40 review-only batch: capture bailout-provision guidance and keep the AG 41 boundary separate.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 40 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 40 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the AG 41 boundary outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 40 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 40 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
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
        flagId: `flag-${sourceId}-bailout-provision`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'bailout_provision_caveat',
        message:
          'The bailout-provision reserve guidance and valuation-interest language should remain visible as review-only context.',
        notes: 'Keep the bailout-provision boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 40 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 40 text layer, so page locators should remain the primary anchor.',
        recommendedAction:
          'Keep the page locator and page-image wording backstop visible instead of overclaiming exact line wording.',
      },
      {
        issueId: `citation-${sourceId}-reserve-boundary`,
        sourceId,
        itemId,
        issueType: 'reserve_method_structure',
        details:
          'The bailout-provision guidance should stay review-only until a human confirms how the guideline interpretation should be applied.',
        recommendedAction:
          'Keep the reserve-language wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-ag41-boundary`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The AG 41 guidance follows after the AG 40 slice and should stay out of scope for this batch.',
        recommendedAction:
          'Keep the AG 41 boundary outside the AG 40 batch and leave the later guideline for a separate plan.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 40 remain indexed as review-only bailout-provision guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the 4-page file remain split into review-only slices, or should a later cleanup recombine the background/risk slice and reserve/application slice?',
        whyItMatters: 'The page windows control how much context is exposed in the review packet.',
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
          'The AG 40 text layer is encoded, and the page-image wording should remain a visible review note.',
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
          'The bailout-provision reserve guidance stays at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the reserve-language wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses background interpretation, reserve standards, reinsurance, and asset adequacy analysis.',
      },
      {
        issueId: `issue-${sourceId}-ag41-boundary`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The AG 41 guidance follows after the AG 40 slice and should remain out of scope.',
        recommendedAction:
          'Keep the AG 41 boundary outside the AG 40 batch and leave the later guideline for a separate plan.',
        evidence: 'AG 41 is the next guideline in the folder listing and is not part of this batch.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag40-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 40 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 40 slice carries a source reference and a page locator.',
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
        details: 'The review packet keeps the bailout-provision reserve material as review-only context.',
      },
      {
        checkId: 'ag41-boundary-tracked',
        status: 'passed',
        details: 'The review packet keeps AG 41 outside the AG 40 batch.',
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
          'AG 40 slices retained as review-only guidance until the wording and AG 41 boundary are confirmed.',
      },
    ],
  }
}

const ag40BatchSpecs = [
  {
    plannedBatchId: 'batch-135',
    batchSlug: 'ag40-135-background-risk-setup',
    sourceId: 'ag40-bailout-provisions',
    filename:
      'AG 40 - Guideline For Valuation Rate of Interest for Funding Agreements and Guaranteed Interest Contracts (GICs) with Bailout Provisions.pdf',
    sourceTitle:
      'AG 40 - Guideline For Valuation Rate of Interest for Funding Agreements and Guaranteed Interest Contracts (GICs) with Bailout Provisions',
    sourceReference: 'Actuarial Guideline XL',
    batchTitle: 'background, risk, and bailout-provision setup slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 40 pages 1-2: purpose, background, contract forms, risks, novation or assignment, and put provision.',
    citationText:
      'The purpose of this Guideline is to interpret the Standard Valuation Law for assignment of appropriate valuation interest rates to risks embedded in bail-out provisions under Funding Agreements and Guaranteed Interest Contracts.',
    summary:
      'AG 40 explains why bailout provisions in funding agreements and GICs can affect valuation interest rates, keeps the risk discussion review-only, and stops before the reserve/application pages.',
    keywords: [
      'AG 40',
      'Actuarial Guideline XL',
      'bailout-provisions',
      'funding agreements',
      'GICs',
      'novation',
      'put provision',
      'risk',
      'valuation interest rate',
    ],
    notes:
      'Two-page background and risk window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; AG 41 remains out of scope.',
    summaryLead: 'AG 40 explains bailout-provision interest-rate risk.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'bailout_provision_caveat'],
    reviewPacketNotes: 'Background and risk slice remains review-only.',
    reviewPacketIssueCount: 4,
    nextStep:
      'Confirm the page-image wording and the AG 41 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-136',
    batchSlug: 'ag40-136-reserve-application-controls',
    sourceId: 'ag40-bailout-provisions',
    filename:
      'AG 40 - Guideline For Valuation Rate of Interest for Funding Agreements and Guaranteed Interest Contracts (GICs) with Bailout Provisions.pdf',
    sourceTitle:
      'AG 40 - Guideline For Valuation Rate of Interest for Funding Agreements and Guaranteed Interest Contracts (GICs) with Bailout Provisions',
    sourceReference: 'Actuarial Guideline XL',
    batchTitle: 'reserve, valuation-interest, and control slice',
    pageWindow: [3, 4],
    sectionReference:
      'AG 40 pages 3-4: wrapping, reserves, valuation-interest application, Plan Type C, and periodic risk-management review.',
    citationText:
      'For the purpose of the application of the Standard Valuation Law to FAs and GICs, the annuities and GIC valuation interest rates are to be used.',
    summary:
      'AG 40 ties bailout-provision treatment to reserve application, Plan Type C, and valuation-interest limits while keeping the periodic review language review-only.',
    keywords: [
      'AG 40',
      'Actuarial Guideline XL',
      'bailout-provisions',
      'Plan Type C',
      'valuation interest rate',
      'over-collateralization',
      'higher credit quality assets',
      'periodic review',
      'risk management',
    ],
    notes:
      'Two-page reserve and control window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; AG 41 remains out of scope.',
    summaryLead: 'AG 40 ties bailout provisions to reserve application.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'bailout_provision_caveat'],
    reviewPacketNotes: 'Reserve application and control slice remains review-only.',
    reviewPacketIssueCount: 4,
    nextStep:
      'Confirm the page-image wording and the AG 41 boundary before any later indexing choice.',
  },
]

export const ag40BatchDefinitions = Object.fromEntries(
  ag40BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg40Batch(spec)]),
)
