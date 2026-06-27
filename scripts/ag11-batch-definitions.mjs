const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 11 stays review-only. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg11Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 11 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag11_single_page_guideline',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 11 pilot: capture the one-page operative-date election interpretation and keep the Section 5-C language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. The AG 11 interpretation is retained for exception-first review, but it is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This single-page AG 11 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 11 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'governance_or_control_expectation',
        message:
          'The operative-date election language affects plan-discontinuation conditions and should stay review-only.',
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
          'Should AG 11 stay indexed as a standalone interpretive note, or should it be cross-linked to later nonforfeiture guidance in a cleanup step?',
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
          'The AG 11 text layer is encoded/noisy and should be confirmed against the page image.',
        recommendedAction:
          'Keep the one-page slice review-only and confirm wording before any later promotion decision.',
        evidence: 'Page 1 shows encoded text for the operative-date election interpretation.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag11-single-page-coverage',
        status: 'passed',
        details: 'The selected page captures the full AG 11 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 11 slice carries a source reference and a page locator.',
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
          'AG 11 slice retained as review-only until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag11BatchSpecs = [
  {
    plannedBatchId: 'batch-089',
    batchSlug: 'ag11-089-operative-date-election',
    sourceId: 'ag11-operative-date-election',
    filename: 'AG 11 - Effect of an Early Election by an Insurance Company of an Operative Date under.pdf',
    sourceTitle: 'AG 11 - Effect of an Early Election by an Insurance Company of an Operative Date under',
    sourceReference: 'Actuarial Guideline XI',
    batchTitle: 'operative-date election',
    pageWindow: [1, 1],
    sectionReference:
      'AG 11: Effect of an Early Election by an Insurance Company of an Operative Date under Section 5-C of the Standard Nonforfeiture Law for Life Insurance',
    citationText:
      'Section 5-C of the Standard Nonforfeiture Law for Life Insurance may be made operational for one or more plans at a time provided that sales are discontinued in the relevant states and the Commissioner is satisfied.',
    summary:
      'AG 11 explains when the Section 5-C operative date can be elected early, the conditions for discontinuing sales by state, and the meaning of like plans and generic form while preserving the review-only boundary on the single page.',
    keywords: [
      'AG 11',
      'operative date',
      'Section 5-C',
      'Standard Nonforfeiture Law',
      'like plans',
      'generic form',
      'cash values',
    ],
    notes:
      'One-page interpretive slice; keep review-only and stop at the page boundary.',
    sourceNotes: 'One page only; keep the review-only boundary visible.',
    summaryLead:
      'AG 11 explains how an early operative-date election affects Section 5-C treatment.',
    flagMessage:
      'The operative-date language affects plan-discontinuation treatment and should stay review-only.',
    citationIssueDetails:
      'The single-page PDF text layer is noisy enough that the wording should be confirmed against the page image before any later promotion decision.',
    decisionQuestion:
      'Should AG 11 stay indexed as a standalone interpretive note, or should it be cross-linked to later nonforfeiture guidance in a cleanup step?',
    decisionWhy:
      'The indexing choice affects future review and promotion decisions.',
    issueMessage:
      'The AG 11 text layer is encoded/noisy and should be confirmed against the page image.',
    issueAction:
      'Keep the one-page slice review-only and confirm wording before any later promotion decision.',
    evidence: 'Page 1 shows encoded text for the operative-date election interpretation.',
    pageCoverageDetails:
      'The selected page captures the full AG 11 guideline.',
    reviewPacketReason:
      'This single-page AG 11 guideline is intentionally limited to the operative-date election and is retained for review-only analysis.',
    nextStep:
      'Confirm whether AG 11 should stay as a standalone operative-date note or be cross-linked to the underlying nonforfeiture guidance.',
    reviewFlags: [
      'guidance',
      'governance_or_control_expectation',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
  },
]

export const ag11BatchDefinitions = Object.fromEntries(
  ag11BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg11Batch(spec)]),
)
