const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 33 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg33Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 33 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag33_carvm_elective_benefits_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 33 review-only batch: capture elective-benefit CARVM guidance and keep the AG 34 boundary separate.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ?? 'Batch remains review-only. AG 33 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 33 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the AG 34 boundary outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 33 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 33 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
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
        flagId: `flag-${sourceId}-elective-benefit`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'elective_benefit_caveat',
        message:
          'The elective-benefit CARVM guidance should remain visible as review-only context.',
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
          'The page-image wording should be confirmed before anyone treats AG 33 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-elective-benefit-boundary`,
        sourceId,
        itemId,
        issueType: 'reserve_method_structure',
        details:
          'The elective-benefit CARVM guidance should stay review-only until a human confirms how the benefit-stream classifications should be interpreted.',
        recommendedAction:
          'Keep the elective-benefit / integrated-stream wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-ag34-boundary`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The AG 34 guidance follows after the AG 33 slice and should stay out of scope for this batch.',
        recommendedAction:
          'Keep the AG 34 boundary outside the AG 33 batch and leave page 7 for a later plan.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 33 remain indexed as review-only elective-benefit guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full six-page file remain a two-window review pass, or should a later cleanup split the foundation from the mechanics and closeout sections?',
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
          'The AG 33 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-elective-benefit-boundary`,
        severity: 'medium',
        issueType: 'reserve_method_structure',
        sourceId,
        itemId,
        message:
          'The elective-benefit CARVM guidance stays at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the elective-benefit / integrated-stream wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses multiple benefit streams, greatest-present-value logic, plan type, and guarantee duration.',
      },
      {
        issueId: `issue-${sourceId}-ag34-boundary`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The AG 34 guidance follows after the AG 33 slice and should remain out of scope.',
        recommendedAction:
          'Keep the AG 34 boundary outside the AG 33 batch and leave page 7 for a later plan.',
        evidence:
          'AG 34 is the next guideline in the folder listing and is not part of this batch.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag33-page-window-coverage',
        status: 'passed',
        details: 'The selected page windows capture the planned AG 33 slices.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 33 slices carry a source reference and page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'elective-benefit-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the elective-benefit and integrated-stream language as review-only context.',
      },
      {
        checkId: 'ag34-boundary-tracked',
        status: 'passed',
        details: 'The review packet keeps AG 34 outside the AG 33 batch.',
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
          'AG 33 slices retained as review-only guidance until the wording and AG 34 boundary are confirmed.',
      },
    ],
  }
}

const ag33BatchSpecs = [
  {
    plannedBatchId: 'batch-115',
    batchSlug: 'ag33-115-benefit-classification-foundation',
    sourceId: 'ag33-elective-benefits',
    filename: 'AG 33 - Determining Minimum CARVM Reserves for Individual Annuity Contracts.pdf',
    sourceTitle: 'AG 33 - Determining Minimum CARVM Reserves for Individual Annuity Contracts with Elective Benefits',
    sourceReference: 'Actuarial Guideline XXXIII',
    batchTitle: 'benefit-classification and integrated-stream foundation slice',
    pageWindow: [1, 3],
    sectionReference:
      'AG 33 pages 1-3: background information, elective / non-elective benefit classification, integrated benefit stream foundation, and valuation-interest-rate framing.',
    citationText:
      'The major purpose of this Actuarial Guideline is to provide clarification and consistency in applying CARVM to annuities with multiple benefit streams.',
    summary:
      'AG 33 explains how CARVM is applied to annuity contracts with elective benefits, including how elective and non-elective benefits are classified and how integrated benefit streams are considered.',
    keywords: [
      'AG 33',
      'Actuarial Guideline XXXIII',
      'CARVM',
      'elective benefits',
      'non-elective benefits',
      'integrated benefit stream',
      'greatest present value',
      'valuation interest rate',
    ],
    notes:
      'Three-page foundation window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the foundation window stays together and AG 34 remains out of scope.',
    summaryLead: 'AG 33 clarifies CARVM for elective-benefit annuities.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'integrated_benefit_stream_caveat'],
    reviewPacketNotes: 'Elective-benefit foundation slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 34 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-116',
    batchSlug: 'ag33-116-mechanics-closeout',
    sourceId: 'ag33-elective-benefits',
    filename: 'AG 33 - Determining Minimum CARVM Reserves for Individual Annuity Contracts.pdf',
    sourceTitle: 'AG 33 - Determining Minimum CARVM Reserves for Individual Annuity Contracts with Elective Benefits',
    sourceReference: 'Actuarial Guideline XXXIII',
    batchTitle: 'mechanics and closeout slice',
    pageWindow: [4, 6],
    sectionReference:
      'AG 33 pages 4-6: integrated benefit stream examples, valuation-interest-rate mechanics, guarantee duration and plan-type logic, change in fund basis, purchase rates, practical considerations, and effective date.',
    citationText:
      'If use of future unknown rates are guaranteed, the company shall establish reserves not less than the contract\'s accumulation fund value, on the valuation date, reduced by an expense allowance not to exceed 7% of such fund.',
    summary:
      'AG 33 provides the mechanics and closeout guidance for determining minimum CARVM reserves for annuity contracts with elective benefits, including guarantee duration, plan type, change in fund basis, purchase rates, practical considerations, and the effective date.',
    keywords: [
      'AG 33',
      'Actuarial Guideline XXXIII',
      'guarantee duration',
      'plan type',
      'change in fund basis',
      'purchase rates',
      'practical considerations',
      'effective date',
    ],
    notes:
      'Three-page mechanics window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the mechanics window stays together and AG 34 remains out of scope.',
    summaryLead: 'AG 33 closes out the CARVM elective-benefit guidance.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'elective_benefit_caveat'],
    reviewPacketNotes: 'Elective-benefit mechanics slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 34 boundary before any later indexing choice.',
  },
]

export const ag33BatchDefinitions = Object.fromEntries(
  ag33BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg33Batch(spec)]),
)
