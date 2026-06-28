const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 21 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg21Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 21 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag21_crvm_reserves_when_b_greater_than_a',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 21 review-only batch: capture the one-page CRVM-reserve guideline and keep the OCR-noisy wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 21 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This one-page AG 21 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 21 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 21 is OCR-noisy, so the title and reserve-comparison wording should stay review-only until the page image is confirmed.',
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
          'The page-image wording should be confirmed before anyone treats AG 21 as an indexing candidate.',
        recommendedAction:
          'Keep the full page 1 window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-indexing-choice`,
        sourceId,
        itemId,
        issueType: 'indexing_choice_confirmation',
        details:
          'The reserve-comparison language should remain review-only until a later human review decides whether the note should remain a standalone index item or a context note.',
        recommendedAction:
          'Treat AG 21 as review-only reserve guidance unless a later human review changes the indexing choice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 21 remain indexed as review-only CRVM-reserve guidance, or should it be linked only as a context note?',
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
          'The AG 21 text layer is noisy, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the full page 1 window together and preserve the page-image backstop note.',
        evidence:
          'The OCR text layer is encoded/noisy and the guideline title / reserve-comparison wording should be checked against the page image.',
      },
      {
        issueId: `issue-${sourceId}-indexing-choice`,
        severity: 'medium',
        issueType: 'indexing_choice_confirmation',
        sourceId,
        itemId,
        message:
          'The reserve-comparison language should stay review-only until a human review confirms the indexing choice.',
        recommendedAction:
          'Keep AG 21 as review-only reserve guidance unless a later human review changes the indexing choice.',
        evidence:
          'The guideline addresses CRVM reserves when (b) is greater than (a) and the determination of (a).',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag21-one-page-coverage',
        status: 'passed',
        details: 'The selected page window captures the full one-page AG 21 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 21 slice carries a source reference and a page locator.',
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
        reviewPacketNotes: 'One-page CRVM reserve-comparison slice remains review-only.',
        reviewPacketIssueCount: 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 21 slice retained as review-only guidance until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag21BatchSpecs = [
  {
    plannedBatchId: 'batch-099',
    batchSlug: 'ag21-099-crvm-reserves-b-greater-than-a',
    sourceId: 'ag21-crvm-reserves-b-greater-than-a',
    filename: 'AG 21 - Guideline for Calculation of CRVM Reserves When (b) is Greater Than (a).pdf',
    sourceTitle: 'AG 21 - Guideline for Calculation of CRVM Reserves When (b) is Greater Than (a)',
    sourceReference: 'Actuarial Guideline XXI',
    batchTitle: 'one-page CRVM reserve-comparison guideline',
    pageWindow: [1, 1],
    sectionReference:
      'AG 21: Calculation of CRVM reserves when (b) is greater than (a) and rules for determination of (a)',
    citationText:
      'The Standard Valuation Law used the "excess of (a) over (b)" in the definition of the modified net premiums in Sec. 4. If the excess of (a) over (b) is negative, and the policy is issued on or after Jan. 1, 1987 the excess is to be taken as zero.',
    summary:
      'AG 21 is a guideline on CRVM reserves when (b) is greater than (a) and on the rules for determining (a).',
    keywords: [
      'AG 21',
      'Actuarial Guideline XXI',
      'CRVM reserves',
      '(b) greater than (a)',
      'modified net premiums',
      'Standard Valuation Law',
      '1980 CSO Tables',
      'net level premium',
      'full preliminary term method',
    ],
    notes: 'One-page guideline; the text layer is noisy, so the page image should remain the wording backstop.',
    sourceNotes:
      'Current guideline; page 1 stays together as a single review-only slice and the OCR noise should not widen the batch.',
    summaryLead:
      'AG 21 is a one-page guideline on CRVM reserves when (b) is greater than (a).',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop'],
    nextStep:
      'Confirm whether AG 21 should remain indexed as review-only reserve guidance and whether the page-image wording should be called out explicitly in the review index.',
  },
]

export const ag21BatchDefinitions = Object.fromEntries(
  ag21BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg21Batch(spec)]),
)
