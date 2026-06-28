const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 22 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg22Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 22 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag22_indeterminate_premiums',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 22 review-only batch: capture the one-page indeterminate-premium guideline and keep the OCR-noisy wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 22 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This one-page AG 22 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 22 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 22 is OCR-noisy, so the title and nonforfeiture wording should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'Page 1 should remain backed by the page image because the text layer is noisy and encoded.',
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
          'The page-image wording should be confirmed before anyone treats AG 22 as an indexing candidate.',
        recommendedAction:
          'Keep the full page 1 window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-indexing-choice`,
        sourceId,
        itemId,
        issueType: 'indexing_choice_confirmation',
        details:
          'The nonforfeiture language should remain review-only until a later human review decides whether the note should remain a standalone index item or a context note.',
        recommendedAction:
          'Treat AG 22 as review-only nonforfeiture guidance unless a later human review changes the indexing choice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 22 remain indexed as review-only nonforfeiture guidance, or should it be linked only as a context note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-image-note`,
        decisionType: 'citation_check',
        question:
          'Should the page-image wording confirmation be called out explicitly in the review index, or can it remain implicit inside the batch boundary?',
        whyItMatters:
          'The page image is the best backstop for exact wording on this noisy OCR page.',
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
          'The AG 22 text layer is noisy, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the full page 1 window together and preserve the page-image backstop note.',
        evidence:
          'The OCR text layer is encoded/noisy and the guideline title / nonforfeiture wording should be checked against the page image.',
      },
      {
        issueId: `issue-${sourceId}-indexing-choice`,
        severity: 'medium',
        issueType: 'indexing_choice_confirmation',
        sourceId,
        itemId,
        message:
          'The nonforfeiture language should stay review-only until a human review confirms the indexing choice.',
        recommendedAction:
          'Keep AG 22 as review-only nonforfeiture guidance unless a later human review changes the indexing choice.',
        evidence:
          'The guideline addresses nonforfeiture values for policies with indeterminate premiums and compares gross-premium schedules.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag22-one-page-coverage',
        status: 'passed',
        details: 'The selected page window captures the full one-page AG 22 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 22 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the OCR/page-image caveat.',
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
        reviewPacketNotes: 'One-page nonforfeiture slice remains review-only.',
        reviewPacketIssueCount: 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 22 slice retained as review-only guidance until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag22BatchSpecs = [
  {
    plannedBatchId: 'batch-100',
    batchSlug: 'ag22-100-indeterminate-premiums',
    sourceId: 'ag22-indeterminate-premiums',
    filename:
      'AG 22 - Interpretation Regarding Non-Forfeiture Values for Policies With Indeterminate Premiums.pdf',
    sourceTitle:
      'AG 22 - Interpretation Regarding Non-Forfeiture Values for Policies With Indeterminate Premiums',
    sourceReference: 'Actuarial Guideline XXII',
    batchTitle: 'one-page indeterminate-premium guideline',
    pageWindow: [1, 1],
    sectionReference:
      'AG 22: nonforfeiture values for policies with indeterminate premiums and the greater-of premium comparison',
    citationText:
      'Indeterminate premium policies provide that premiums after issue will be determined by the insurer.',
    summary:
      'AG 22 is a guideline on nonforfeiture values for policies with indeterminate premiums and on the use of gross-premium schedules.',
    keywords: [
      'AG 22',
      'Actuarial Guideline XXII',
      'indeterminate premiums',
      'nonforfeiture values',
      'gross premiums',
      'maximum gross premiums',
      'Standard Nonforfeiture Law',
      'Section 5',
      'Section 5-c',
      'Section 6',
    ],
    notes: 'One-page guideline; the text layer is noisy, so the page image should remain the wording backstop.',
    sourceNotes:
      'Current guideline; page 1 stays together as a single review-only slice and the OCR noise should not widen the batch.',
    summaryLead:
      'AG 22 is a one-page guideline on nonforfeiture values for policies with indeterminate premiums.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop'],
    nextStep:
      'Confirm whether AG 22 should remain indexed as review-only nonforfeiture guidance and whether the page-image wording should be called out explicitly in the review index.',
  },
]

export const ag22BatchDefinitions = Object.fromEntries(
  ag22BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg22Batch(spec)]),
)
