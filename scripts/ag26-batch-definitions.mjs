const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 26 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg26Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 26 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag26_election_of_operative_dates',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 26 review-only batch: capture the election-of-operative-dates guideline slice and keep the OCR-noisy wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 26 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 26 guideline slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 26 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 26 is OCR-noisy, so the text layer should stay review-only until the page image is confirmed.',
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
          'The page-image wording should be confirmed before anyone treats AG 26 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 26 remain indexed as review-only operative-dates guidance, or should it be linked only as a context note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full one-page file remain a single review window, or should a later cleanup split the operative-date text from the background material?',
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
          'The AG 26 text layer is noisy, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR text layer is encoded/noisy and the guideline title / operative-date wording should be checked against the page image.',
      },
      {
        issueId: `issue-${sourceId}-cross-reference`,
        severity: 'low',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The Standard Valuation Law and Standard Non-Forfeiture Law references are cross-reference context and should not be over-interpreted.',
        recommendedAction:
          'Keep the cross references visible and do not widen the batch just because the text is dense.',
        evidence:
          'The guideline mentions operative-date election, dynamic interest-rate language, and reserve / nonforfeiture context.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag26-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 26 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 26 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the OCR/page-image caveat.',
      },
      {
        checkId: 'cross-reference-tracked',
        status: 'passed',
        details: 'The review packet keeps the operative-date and rate-boundary language as review-only context.',
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
          'AG 26 slice retained as review-only guidance until the page-image wording and operative-date boundaries are confirmed.',
      },
    ],
  }
}

const ag26BatchSpecs = [
  {
    plannedBatchId: 'batch-106',
    batchSlug: 'ag26-106-operative-dates',
    sourceId: 'ag26-election-of-operative-dates',
    filename:
      'AG 26 - Guideline for Election of Operative Dates under Standard Valuation Law and Standard Non-Forfeiture Law.pdf',
    sourceTitle:
      'AG 26 - Guideline for Election of Operative Dates under Standard Valuation Law and Standard Non-Forfeiture Law',
    sourceReference: 'Actuarial Guideline XXVI',
    batchTitle: 'operative-dates slice',
    pageWindow: [1, 1],
    sectionReference:
      'AG 26 page 1: operative-date election rule, dynamic interest-rate language, and background closing boundary',
    citationText:
      'Under no circumstances can an insurance company elect an operative date for the purpose of Section 5-C of the Standard Nonforfeiture Law for Life Insurance, if such operative date would be in a calendar year prior to the calendar year in which that company furnished written notice of election of an operative date under that law.',
    summary:
      'AG 26 frames the election of operative dates under the Standard Valuation Law and Standard Non-Forfeiture Law, including the operative-date limitation and the interest-rate boundary language.',
    keywords: [
      'AG 26',
      'Actuarial Guideline XXVI',
      'operative date',
      'Standard Valuation Law',
      'Standard Nonforfeiture Law',
      'dynamic interest rate',
      'reserve rate',
      'nonforfeiture rate',
    ],
    notes:
      'Single-page guideline; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Current guideline; page 1 stays together as a review-only slice and the OCR noise should not widen the batch.',
    summaryLead:
      'AG 26 opens with the operative-date election rule and the reserve / nonforfeiture interest-rate boundary.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'cross_reference_mapping'],
    reviewPacketNotes: 'Opening AG 26 slice remains review-only.',
    reviewPacketIssueCount: 2,
    nextStep:
      'Confirm the operative-date limitation and the page-1 closure before any later cleanup pass.',
  },
]

export const ag26BatchDefinitions = Object.fromEntries(
  ag26BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg26Batch(spec)]),
)
