const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 10 stays review-only. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg10Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 10 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag10_single_page_guideline',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 10 pilot: capture the one-page nonforfeiture interpretation and keep the cash-surrender language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. The AG 10 interpretation is retained for exception-first review, but it is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This single-page AG 10 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 10 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'formula_context',
        message:
          'The nonforfeiture wording affects cash-surrender treatment and should stay review-only.',
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
          'Should AG 10 stay indexed as a standalone interpretive note, or should it be cross-linked to later nonforfeiture guidance in a cleanup step?',
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
          'The AG 10 text layer is encoded/noisy and should be confirmed against the page image.',
        recommendedAction:
          'Keep the one-page slice review-only and confirm wording before any later promotion decision.',
        evidence: 'Page 1 shows encoded text for the nonforfeiture interpretation.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag10-single-page-coverage',
        status: 'passed',
        details: 'The selected page captures the full AG 10 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 10 slice carries a source reference and a page locator.',
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
        reviewPacketNotes: 'Interpretive slice remains review-only.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 10 slice retained as review-only until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag10BatchSpecs = [
  {
    plannedBatchId: 'batch-088',
    batchSlug: 'ag10-088-standard-nonforfeiture-law-interpretation',
    sourceId: 'ag10-standard-nonforfeiture-law-interpretation',
    filename:
      'AG 10 - Guideline for Interpretation of NAIC Standard Nonforfeiture Law for Individual Deferred Annuities.pdf',
    sourceTitle:
      'AG 10 - Guideline for Interpretation of NAIC Standard Nonforfeiture Law for Individual Deferred Annuities',
    sourceReference: 'Actuarial Guideline X',
    batchTitle: 'nonforfeiture-law interpretation',
    pageWindow: [1, 1],
    sectionReference:
      'AG 10: Guideline for Interpretation of NAIC Standard Nonforfeiture Law for Individual Deferred Annuities',
    citationText:
      'For contracts which provide cash surrender benefits, the NAIC Model Law prescribes a basis for determination of minimum cash surrender benefits. That law does not require that a company grant additional amounts in excess of the amounts guaranteed in the contract, either in the form of excess interest credits or otherwise.',
    summary:
      'AG 10 explains how the NAIC Standard Nonforfeiture Law applies to cash surrender benefits, additional amounts credited, and maturity values for deferred annuities while preserving the review-only boundary on the single page.',
    keywords: [
      'AG 10',
      'cash surrender benefits',
      'additional amounts',
      'maturity values',
      'deferred annuities',
      'NAIC Model Law',
    ],
    notes:
      'One-page interpretive slice; keep review-only and stop at the page boundary.',
    sourceNotes: 'One page only; keep the review-only boundary visible.',
    summaryLead:
      'AG 10 explains how the Standard Nonforfeiture Law treats cash surrender benefits and additional amounts.',
    flagMessage:
      'The nonforfeiture wording affects cash-surrender treatment and should stay review-only.',
    citationIssueDetails:
      'The single-page PDF text layer is noisy enough that the wording should be confirmed against the page image before any later promotion decision.',
    decisionQuestion:
      'Should AG 10 stay indexed as a standalone interpretive note, or should it be cross-linked to later nonforfeiture guidance in a cleanup step?',
    decisionWhy:
      'The indexing choice affects future review and promotion decisions.',
    issueMessage:
      'The AG 10 text layer is encoded/noisy and should be confirmed against the page image.',
    issueAction:
      'Keep the one-page slice review-only and confirm wording before any later promotion decision.',
    evidence: 'Page 1 shows encoded text for the nonforfeiture interpretation.',
    pageCoverageDetails:
      'The selected page captures the full AG 10 guideline.',
    reviewPacketReason:
      'This single-page AG 10 guideline is intentionally limited to the nonforfeiture-law interpretation and is retained for review-only analysis.',
    nextStep:
      'Confirm whether AG 10 should stay as a standalone nonforfeiture-law note or be cross-linked to the underlying annuity guidance.',
    reviewFlags: [
      'guidance',
      'formula_context',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
  },
]

export const ag10BatchDefinitions = Object.fromEntries(
  ag10BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg10Batch(spec)]),
)
