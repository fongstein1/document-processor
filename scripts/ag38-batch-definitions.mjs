const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 38 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg38Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 38 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag38_model_830_application',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 38 review-only batch: capture Model 830 application guidance and keep the AG 39 boundary separate.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 38 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 38 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the AG 39 boundary outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 38 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 38 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
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
        flagId: `flag-${sourceId}-model-830`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'model_830_caveat',
        message:
          'The Model 830 examples and closeout material should remain visible as review-only context.',
        notes: 'Keep the application boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 38 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page windows together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-reserve-boundary`,
        sourceId,
        itemId,
        issueType: 'reserve_method_structure',
        details:
          'The Model 830 reserve guidance should stay review-only until a human confirms how the guideline interpretation should be applied.',
        recommendedAction:
          'Keep the reserve-entry wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-ag39-boundary`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The AG 39 guidance follows after the AG 38 slice and should stay out of scope for this batch.',
        recommendedAction:
          'Keep the AG 39 boundary outside the AG 38 batch and leave the later guideline for a separate plan.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 38 remain indexed as review-only Model 830 guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full 13-page file remain a four-window review pass, or should a later cleanup split the examples from the deterministic-reserve and opinion material?',
        whyItMatters: 'The page windows control how much context is exposed in each review packet.',
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
          'The AG 38 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-reserve-boundary`,
        severity: 'medium',
        issueType: 'reserve_method_structure',
        sourceId,
        itemId,
        message:
          'The Model 830 reserve guidance stays at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the reserve-entry wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses Model 830 examples, minimum gross premiums, deficiency reserves, and closeout language.',
      },
      {
        issueId: `issue-${sourceId}-ag39-boundary`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The AG 39 guidance follows after the AG 38 slice and should remain out of scope.',
        recommendedAction:
          'Keep the AG 39 boundary outside the AG 38 batch and leave the later guideline for a separate plan.',
        evidence: 'AG 39 is the next guideline in the folder listing and is not part of this batch.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag38-page-window-coverage',
        status: 'passed',
        details: 'The selected page windows capture the planned AG 38 slices.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 38 slices carry a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'reserve-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the Model 830 reserve material as review-only context.',
      },
      {
        checkId: 'ag39-boundary-tracked',
        status: 'passed',
        details: 'The review packet keeps AG 39 outside the AG 38 batch.',
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
          'AG 38 slices retained as review-only guidance until the wording and AG 39 boundary are confirmed.',
      },
    ],
  }
}

const ag38BatchSpecs = [
  {
    plannedBatchId: 'batch-130',
    batchSlug: 'ag38-130-background-application',
    sourceId: 'ag38-model-regulation',
    filename: 'AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model).pdf',
    sourceTitle: 'AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model)',
    sourceReference: 'Actuarial Guideline XXXVIII',
    batchTitle: 'background and application slice',
    pageWindow: [1, 3],
    sectionReference:
      'AG 38 pages 1-3: introduction, application framing, and early examples for the revised Model 830 guidance.',
    citationText:
      'The revised version of Model 830 was adopted by the NAIC in March 1999.',
    summary:
      'AG 38 introduces the Model 830 application guidance, explains the regulatory framing, and keeps the opening application and background material separate from the reserve mechanics.',
    keywords: [
      'AG 38',
      'Actuarial Guideline XXXVIII',
      'Model 830',
      'application',
      'background',
      'examples',
    ],
    notes:
      'Three-page background window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the background window stays together and AG 39 remains out of scope.',
    summaryLead: 'AG 38 introduces Model 830 application guidance.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'background_scope_caveat'],
    reviewPacketNotes: 'Background and application slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 39 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-131',
    batchSlug: 'ag38-131-example-mechanics',
    sourceId: 'ag38-model-regulation',
    filename: 'AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model).pdf',
    sourceTitle: 'AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model)',
    sourceReference: 'Actuarial Guideline XXXVIII',
    batchTitle: 'example mechanics slice',
    pageWindow: [4, 6],
    sectionReference:
      'AG 38 pages 4-6: reserve-construction examples, premium derivation, and catch-up / deficiency-reserve mechanics.',
    citationText:
      'First, the minimum gross premiums (determined at issue) that will satisfy the secondary guarantee requirement must be derived.',
    summary:
      'AG 38 walks through reserve-construction examples and the related premium derivation and catch-up mechanics that lead into the reserve step structure.',
    keywords: [
      'AG 38',
      'Actuarial Guideline XXXVIII',
      'Model 830',
      'minimum gross premium',
      'catch-up amount',
      'deficiency reserve',
      'examples',
    ],
    notes:
      'Three-page example-mechanics window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the example window stays together and AG 39 remains out of scope.',
    summaryLead: 'AG 38 example mechanics cover reserve-construction and premium derivation.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'model_830_caveat'],
    reviewPacketNotes: 'Example mechanics slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 39 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-132',
    batchSlug: 'ag38-132-deterministic-step-boundaries',
    sourceId: 'ag38-model-regulation',
    filename: 'AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model).pdf',
    sourceTitle: 'AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model)',
    sourceReference: 'Actuarial Guideline XXXVIII',
    batchTitle: 'deterministic reserve and step-boundary slice',
    pageWindow: [7, 10],
    sectionReference:
      'AG 38 pages 7-10: deterministic reserve language, Step 2 / Step 8 / Step 9 style mechanics, and the valuation-date application window.',
    citationText:
      'Step 9: An increased basic reserve shall be computed by subtracting the reduced deficiency reserve in Step 7 from the reserve computed in Step 8.',
    summary:
      'AG 38 continues through the deterministic reserve language and the step-based mechanics that apply the Model 830 reserve requirements.',
    keywords: [
      'AG 38',
      'Actuarial Guideline XXXVIII',
      'Model 830',
      'deterministic reserve',
      'step 8',
      'step 9',
      'valuation date',
    ],
    notes:
      'Four-page deterministic-reserve window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the step-based mechanics stay together and AG 39 remains out of scope.',
    summaryLead: 'AG 38 deterministic reserve mechanics continue the step-based reserve application.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'deterministic_reserve_caveat'],
    reviewPacketNotes: 'Deterministic reserve and step-boundary slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 39 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-133',
    batchSlug: 'ag38-133-opinion-closeout',
    sourceId: 'ag38-model-regulation',
    filename: 'AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model).pdf',
    sourceTitle: 'AG 38 - Application of the Valuation of Life Insurance Policies Model Regulation (Model)',
    sourceReference: 'Actuarial Guideline XXXVIII',
    batchTitle: 'opinion, representation, and closeout slice',
    pageWindow: [11, 13],
    sectionReference:
      'AG 38 pages 11-13: assumptions, actuarial opinion / company representation, and scope closeout language.',
    citationText:
      'With the exception of Steps 3 through 9 of Section 8A and all of Sections 8B, 8C, 8D and 8E, the scope of this guideline shall be inclusive of policies issued on and after the earlier of a state\'s adoption of the revised Model 830 ...',
    summary:
      'AG 38 closes with assumptions, the actuarial opinion / company-representation material, and the final scope boundary for the guideline.',
    keywords: [
      'AG 38',
      'Actuarial Guideline XXXVIII',
      'Model 830',
      'actuarial opinion',
      'company representation',
      'scope closeout',
    ],
    notes:
      'Three-page closeout window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the closeout window stays together and AG 39 remains out of scope.',
    summaryLead: 'AG 38 closes with opinion, representation, and scope language.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'closeout_caveat'],
    reviewPacketNotes: 'Opinion, representation, and closeout slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 39 boundary before any later indexing choice.',
  },
]

export const ag38BatchDefinitions = Object.fromEntries(
  ag38BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg38Batch(spec)]),
)

