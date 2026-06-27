const rawSourceFile =
  'Actuarial Guidelines/AG 07 - Calculation of Equivalent Level Amounts.pdf'
const sourceFamilyId = 'actuarial_guidelines'
const sourceTitle = 'AG 07 - Calculation of Equivalent Level Amounts'
const sourceReference = 'Actuarial Guideline VII'
const defaultNonLearnerNotes =
  'AG 07 is a short review-only guideline about equivalent level amounts. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg07Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 07 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag07_two_page_guideline',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 07 pilot: capture the two-page equivalent-level-amount interpretation and keep the pure-endowment language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. The AG 07 interpretation is retained as a draft candidate for exception-first review, but it is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This two-page AG 07 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 07 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'formula_context',
        message:
          'The equivalent-level-amount wording affects expense allowance and reserve treatment, so it should stay review-only.',
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
          'The two-page PDF text layer is noisy enough that the wording should be confirmed against the page images before any later promotion decision.',
        recommendedAction:
          'Keep the page locator and do not widen the batch because of text-layer noise.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 07 stay indexed as a standalone interpretive note, or should it be cross-linked to later equivalent-level-amount guidance in a cleanup step?',
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
          'The AG 07 text layer is encoded/noisy and should be confirmed against the page images.',
        recommendedAction:
          'Keep the two-page slice review-only and confirm wording before any later promotion decision.',
        evidence:
          'Pages 1-2 show encoded text for the equivalent-level-amount interpretation.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag07-two-page-coverage',
        status: 'passed',
        details: 'The selected pages capture the full AG 07 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 07 slice carries a source reference and a page locator.',
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
        pageWindow: [1, 2],
        sectionReference:
          'AG 07: Interpretation regarding calculation of equivalent level amounts',
        citationText:
          'Pure endowments will not be considered in the determination of equivalent level amounts for valuation and nonforfeiture purposes.',
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
          'AG 07 two-page interpretive slice; keep review-only and stop at the page boundary.',
        summary:
          'AG 07 explains how pure endowments affect equivalent level amount calculations, expense allowances, and reserve/nonforfeiture treatment, while preserving the review-only boundary across both pages.',
        keywords: [
          'AG 07',
          'equivalent level amounts',
          'pure endowments',
          'expense allowances',
          'valuation',
          'nonforfeiture',
        ],
        sourceNotes: 'Two pages only; keep the review-only boundary visible.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'guidance',
        reviewPacketNotes: 'Interpretive slice remains review-only.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 07 slice retained as review-only until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag07BatchSpecs = [
  {
    plannedBatchId: 'batch-082',
    batchSlug: 'ag07-082-equivalent-level-amounts',
    sourceId: 'ag07-equivalent-level-amounts',
    batchTitle: 'interpretation regarding calculation of equivalent level amounts',
    summaryLead:
      'AG 07 explains how pure endowments affect equivalent level amounts and keeps the interpretation review-only.',
    pageWindow: [1, 2],
    sectionReference:
      'AG 07: Interpretation regarding calculation of equivalent level amounts',
    citationText:
      'Pure endowments will not be considered in the determination of equivalent level amounts for valuation and nonforfeiture purposes.',
    summary:
      'AG 07 explains how pure endowments affect equivalent level amount calculations, expense allowances, and reserve/nonforfeiture treatment, while preserving the review-only boundary across both pages.',
    keywords: [
      'AG 07',
      'equivalent level amounts',
      'pure endowments',
      'expense allowances',
      'valuation',
      'nonforfeiture',
    ],
    reviewPacketReason:
      'This two-page AG 07 guideline is intentionally limited to the interpretation regarding calculation of equivalent level amounts and is retained for review-only analysis.',
    reviewPacketNextStep:
      'Confirm whether AG 07 should stay indexed as a standalone interpretive note or be cross-linked to the underlying equivalent-level-amount guidance in a later cleanup step.',
    reviewerNotes:
      'Small AG 07 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
    flagMessage:
      'The equivalent-level-amount wording affects expense allowance and reserve treatment, so it should stay review-only.',
    citationIssueDetails:
      'The two-page PDF text layer is noisy enough that the wording should be confirmed against the page images before any later promotion decision.',
    decisionQuestion:
      'Should AG 07 stay indexed as a standalone interpretive note, or should it be cross-linked to later equivalent-level-amount guidance in a cleanup step?',
    decisionWhy:
      'The index choice affects future review and promotion decisions.',
    issueMessage:
      'The AG 07 text layer is encoded/noisy and should be confirmed against the page images.',
    evidence:
      'Pages 1-2 show encoded text for the equivalent-level-amount interpretation.',
    validationCheckId: 'ag07-two-page-coverage',
    validationCheckDetails: 'The selected pages capture the full AG 07 guideline.',
    nextStep:
      'Confirm whether AG 07 should stay as a standalone caveat note or be cross-linked to the underlying equivalent-level-amount guidance.',
  },
]

export const ag07BatchDefinitions = Object.fromEntries(
  ag07BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg07Batch(spec)]),
)
