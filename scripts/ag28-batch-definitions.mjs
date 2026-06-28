const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 28 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg28Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 28 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag28_survivor_income_benefit_reserves',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 28 review-only batch: capture the survivor-income-benefit reserve slice and keep the OCR-noisy wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 28 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 28 guideline slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 28 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 28 has a noisy / encoded text layer, so the text should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the text layer is noisy / encoded.',
        notes: 'Keep the image backstop visible as a review note.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 28 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-reserve-approximation`,
        sourceId,
        itemId,
        issueType: 'reserve_method_structure',
        details:
          'The reserve approximation language should stay review-only until a human confirms the wording and the approximation boundary.',
        recommendedAction:
          'Keep the reserve-approximation text as a summary-only boundary slice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 28 remain indexed as review-only survivor-income-benefit guidance, or should it be linked only as a context note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full one-page file remain a single review window, or should a later cleanup split the reserve approximation text from the background material?',
        whyItMatters:
          'The page window controls how much formula context is exposed in each review packet.',
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
          'The AG 28 text layer is noisy, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR text layer is encoded/noisy and the guideline title / survivor-income-benefit wording should be checked against the page image.',
      },
      {
        issueId: `issue-${sourceId}-reserve-approximation`,
        severity: 'medium',
        issueType: 'reserve_method_structure',
        sourceId,
        itemId,
        message:
          'The reserve approximation language stays at the structure level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the reserve approximation review-only until a human confirms the wording.',
        evidence:
          'The page describes survivor income benefit reserve framing, a basic-disability reserve approximation, and a tested example.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag28-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 28 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 28 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the OCR/page-image caveat.',
      },
      {
        checkId: 'reserve-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the reserve framing as review-only context.',
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
        reviewPacketIssueCount: spec.reviewPacketIssueCount ?? 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 28 slice retained as review-only guidance until the page-image wording and reserve approximation boundaries are confirmed.',
      },
    ],
  }
}

const ag28BatchSpecs = [
  {
    plannedBatchId: 'batch-110',
    batchSlug: 'ag28-110-survivor-income-benefit-reserve-slice',
    sourceId: 'ag28-survivor-income-benefit-reserves',
    filename:
      'AG 28 - Statutory Reserves for Group Long-Term Disability Contracts Within A Survivor Income Benefit Provision.pdf',
    sourceTitle:
      'AG 28 - Statutory Reserves for Group Long-Term Disability Contracts Within A Survivor Income Benefit Provision',
    sourceReference: 'Actuarial Guideline XXVIII',
    batchTitle: 'survivor income benefit reserve slice',
    pageWindow: [1, 1],
    sectionReference:
      'AG 28 page 1: survivor income benefit background, reserve approximation guidance, and the closing boundary note',
    citationText:
      'Claim reserves for survivor income benefits contained in group long-term disability contracts must be established based on the design of the survivor income benefit.',
    summary:
      'AG 28 frames statutory claim reserves for survivor income benefit provisions in group long-term disability contracts, gives an approximation approach for combining the basic disability reserve with the survivor benefit reserve, and closes with a tested example plus wording caveat.',
    keywords: [
      'AG 28',
      'Actuarial Guideline XXVIII',
      'survivor income benefit',
      'group long-term disability',
      'statutory claim reserves',
      'reserve approximation',
      'basic disability reserve',
      'valuation interest rate',
    ],
    notes:
      'Single-page guideline; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Current guideline; page 1 stays together as a review-only slice and the OCR noise should not widen the batch.',
    summaryLead:
      'AG 28 opens with survivor-income-benefit reserve framing and an approximation approach for group long-term disability contracts.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'reserve_method_structure'],
    reviewPacketNotes: 'Opening AG 28 slice remains review-only.',
    reviewPacketIssueCount: 2,
    nextStep:
      'Confirm the page-image wording and the reserve-approximation boundary before any later indexing choice.',
  },
]

export const ag28BatchDefinitions = Object.fromEntries(
  ag28BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg28Batch(spec)]),
)
