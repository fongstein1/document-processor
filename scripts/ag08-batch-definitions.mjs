const rawSourceFile =
  'Actuarial Guidelines/AG 08 - The Valuation of Individual Single Premium Deferred Annuities.pdf'
const sourceFamilyId = 'actuarial_guidelines'
const sourceTitle = 'AG 08 - The Valuation of Individual Single Premium Deferred Annuities'
const sourceReference = 'Actuarial Guideline VIII'
const defaultNonLearnerNotes =
  'AG 08 is a short review-only guideline about individual single premium deferred annuity valuation. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg08Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 08 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag08_single_page_guideline',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 08 pilot: capture the one-page annuity valuation interpretation and keep the discounted-value language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. The AG 08 interpretation is retained as a draft candidate for exception-first review, but it is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This single-page AG 08 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 08 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'formula_context',
        message:
          'The annuity reserve wording affects discounted values and reserve treatment, so it should stay review-only.',
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}`,
        sourceId,
        itemId,
        issueType: 'encoded_text_layer',
        details:
          'The single-page PDF text layer is noisy enough that the wording should be confirmed against the page image before any later promotion decision.',
        recommendedAction:
          'Keep the page locator and do not widen the batch because of text-layer noise.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 08 stay indexed as a standalone interpretive note, or should it be cross-linked to later annuity reserve guidance in a cleanup step?',
        whyItMatters:
          'The index choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}`,
        severity: 'medium',
        issueType: 'text_layer_noise',
        sourceId,
        itemId,
        message:
          'The AG 08 text layer is encoded/noisy and should be confirmed against the page image.',
        recommendedAction:
          'Keep the one-page slice review-only and confirm wording before any later promotion decision.',
        evidence: 'Page 1 shows encoded text for the annuity valuation interpretation.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag08-single-page-coverage',
        status: 'passed',
        details: 'The selected page captures the full AG 08 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 08 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
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
        relativePath: rawSourceFile,
        sourceFamilyId,
        documentType: 'actuarial_guideline',
        sourceTitle,
        sourceReference,
        versionDate: null,
        pageWindow: [1, 1],
        sectionReference:
          'AG 08: The valuation of individual single premium deferred annuities',
        citationText:
          'With respect to those states which have enacted the 176 amendments to the Standard Valuation Law, individual single premium deferred annuity reserves shall at least equal the greatest of any of the discounted values of all guaranteed future benefits, including cash surrender values available after the date of valuation.',
        confidence: 'high',
        reviewFlags: [
          'guidance',
          'formula_context',
          'cross_reference_mapping',
          'requires_human_interpretation',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'AG 08 one-page interpretive slice; keep review-only and stop at the page boundary.',
        summary:
          'AG 08 explains how the discounted reserve value for individual single premium deferred annuities is tied to guaranteed future benefits and cash surrender values, while preserving the review-only boundary on the single page.',
        keywords: [
          'AG 08',
          'single premium deferred annuities',
          'discounted values',
          'cash surrender values',
          'Standard Valuation Law',
          'nonforfeiture',
        ],
        sourceNotes: 'One page only; keep the review-only boundary visible.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'guidance',
        reviewPacketNotes: 'Interpretive slice remains review-only.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 08 slice retained as review-only until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag08BatchSpecs = [
  {
    plannedBatchId: 'batch-083',
    batchSlug: 'ag08-083-single-page-deferred-annuity-valuation',
    sourceId: 'ag08-single-premium-deferred-annuities',
    batchTitle: 'valuation of individual single premium deferred annuities',
    summaryLead:
      'AG 08 explains how discounted reserve values apply to individual single premium deferred annuities and keeps the interpretation review-only.',
    pageWindow: [1, 1],
    sectionReference:
      'AG 08: The valuation of individual single premium deferred annuities',
    citationText:
      'With respect to those states which have enacted the 176 amendments to the Standard Valuation Law, individual single premium deferred annuity reserves shall at least equal the greatest of any of the discounted values of all guaranteed future benefits, including cash surrender values available after the date of valuation.',
    summary:
      'AG 08 explains how the discounted reserve value for individual single premium deferred annuities is tied to guaranteed future benefits and cash surrender values, while preserving the review-only boundary on the single page.',
    keywords: [
      'AG 08',
      'single premium deferred annuities',
      'discounted values',
      'cash surrender values',
      'Standard Valuation Law',
      'nonforfeiture',
    ],
    reviewPacketReason:
      'This single-page AG 08 guideline is intentionally limited to the valuation of individual single premium deferred annuities and is retained for review-only analysis.',
    reviewPacketNextStep:
      'Confirm whether AG 08 should stay indexed as a standalone caveat note or be cross-linked to the underlying annuity reserve guidance in a later cleanup step.',
    reviewerNotes:
      'Small AG 08 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
    flagMessage:
      'The annuity reserve wording affects discounted values and reserve treatment, so it should stay review-only.',
    citationIssueDetails:
      'The single-page PDF text layer is noisy enough that the wording should be confirmed against the page image before any later promotion decision.',
    decisionQuestion:
      'Should AG 08 stay indexed as a standalone interpretive note, or should it be cross-linked to later annuity reserve guidance in a cleanup step?',
    decisionWhy:
      'The index choice affects future review and promotion decisions.',
    issueMessage:
      'The AG 08 text layer is encoded/noisy and should be confirmed against the page image.',
    evidence: 'Page 1 shows encoded text for the annuity valuation interpretation.',
    validationCheckId: 'ag08-single-page-coverage',
    validationCheckDetails: 'The selected page captures the full AG 08 guideline.',
    nextStep:
      'Confirm whether AG 08 should stay as a standalone caveat note or be cross-linked to the underlying annuity reserve guidance.',
  },
]

export const ag08BatchDefinitions = Object.fromEntries(
  ag08BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg08Batch(spec)]),
)
