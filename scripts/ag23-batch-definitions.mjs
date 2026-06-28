const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 23 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg23Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 23 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag23_separate_account_investments',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 23 review-only batch: capture the one-page separate-account-investments guideline and keep the OCR-noisy wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 23 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This one-page AG 23 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 23 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 23 is OCR-noisy, so the title and separate-account wording should stay review-only until the page image is confirmed.',
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
      {
        flagId: `flag-${sourceId}-statutory-placeholder`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'placeholder_statutory_reference',
        message:
          'AG 23 contains a placeholder statutory reference that should be mapped carefully before any later promotion attempt.',
        notes: 'Keep the placeholder visible as a review note.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 23 as an indexing candidate.',
        recommendedAction:
          'Keep the full page 1 window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-statutory-placeholder`,
        sourceId,
        itemId,
        issueType: 'placeholder_statutory_reference',
        details:
          'The placeholder statutory reference should remain visible until a human reviewer maps it to the state law wording used in the source folder.',
        recommendedAction:
          'Treat AG 23 as review-only guidance unless a later human review resolves the placeholder reference.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 23 remain indexed as review-only separate-account guidance, or should it be linked only as a context note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-statutory-placeholder`,
        decisionType: 'citation_check',
        question:
          'Should the placeholder statutory reference be called out explicitly in the review index, or can it remain implicit inside the batch boundary?',
        whyItMatters:
          'The statutory placeholder needs a clear human decision before any future promotion attempt.',
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
          'The AG 23 text layer is noisy, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the full page 1 window together and preserve the page-image backstop note.',
        evidence:
          'The OCR text layer is encoded/noisy and the guideline title / separate-account wording should be checked against the page image.',
      },
      {
        issueId: `issue-${sourceId}-statutory-placeholder`,
        severity: 'medium',
        issueType: 'placeholder_statutory_reference',
        sourceId,
        itemId,
        message:
          'The placeholder statutory reference should stay review-only until a human review confirms the state-law mapping.',
        recommendedAction:
          'Keep AG 23 as review-only separate-account guidance unless a later human review resolves the placeholder reference.',
        evidence:
          'The guideline addresses variable life insurance separate account investments and includes a placeholder state statutory reference.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag23-one-page-coverage',
        status: 'passed',
        details: 'The selected page window captures the full one-page AG 23 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 23 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the OCR/page-image caveat.',
      },
      {
        checkId: 'placeholder-statutory-reference-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the statutory-reference placeholder caveat.',
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
        reviewPacketNotes: 'One-page separate-account slice remains review-only.',
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 23 slice retained as review-only guidance until the indexing choice and statutory placeholder are confirmed.',
      },
    ],
  }
}

const ag23BatchSpecs = [
  {
    plannedBatchId: 'batch-101',
    batchSlug: 'ag23-101-separate-account-investments',
    sourceId: 'ag23-separate-account-investments',
    filename: 'AG 23 - Guideline Concerning Variable Life Insurance Separate Account Investments.pdf',
    sourceTitle: 'AG 23 - Guideline Concerning Variable Life Insurance Separate Account Investments',
    sourceReference: 'Actuarial Guideline XXIII',
    batchTitle: 'one-page separate-account investments guideline',
    pageWindow: [1, 1],
    sectionReference:
      'AG 23: variable life separate account investment sufficiency standard and readily marketable assets definition',
    citationText:
      'A variable life insurance separate account shall be deemed to have sufficient net investment income and readily marketable assets to meet anticipated obligations.',
    summary:
      'AG 23 is a guideline on variable life insurance separate account investments, including the sufficiency demonstration, readily marketable assets, and the 15% / 10% thresholds.',
    keywords: [
      'AG 23',
      'Actuarial Guideline XXIII',
      'variable life insurance',
      'separate account investments',
      'readily marketable assets',
      'net investment income',
      '15%',
      '10%',
      'market value',
      'separate series',
    ],
    notes:
      'One-page guideline; the text layer is noisy and includes a placeholder statutory reference, so the page image should remain the wording backstop.',
    sourceNotes:
      'Current guideline; page 1 stays together as a single review-only slice and the OCR noise should not widen the batch.',
    summaryLead:
      'AG 23 is a one-page guideline on variable life insurance separate account investments.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'placeholder_statutory_reference'],
    nextStep:
      'Confirm whether AG 23 should remain indexed as review-only separate-account guidance and whether the page-image wording and statutory placeholder should be called out explicitly in the review index.',
  },
]

export const ag23BatchDefinitions = Object.fromEntries(
  ag23BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg23Batch(spec)]),
)
