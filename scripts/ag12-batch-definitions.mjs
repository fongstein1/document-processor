const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 12 stays review-only. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg12Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 12 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag12_withdrawn_historical_note',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 12 caveat-only batch: capture the withdrawn one-page historical note and keep the valuation / nonforfeiture interest-rate language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 12 is retained as a withdrawn historical caveat and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This withdrawn single-page AG 12 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 12 caveat-only batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'stale_or_repealed_source',
        message:
          'AG 12 is withdrawn and should stay review-only as historical guidance.',
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}`,
        sourceId,
        itemId,
        issueType: 'withdrawn_source',
        details:
          'The single-page PDF states that Actuarial Guideline XII was withdrawn on March 7, 1993, so the wording should be treated as historical caveat text before any indexing decision.',
        recommendedAction:
          'Keep the page locator, mark the unit as withdrawn, and do not promote it as active guidance.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 12 stay indexed only as withdrawn historical guidance, or should it be cross-linked to another caution note in a later cleanup step?',
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
        issueType: 'withdrawn_source',
        sourceId,
        itemId,
        message:
          'The AG 12 page shows that the guideline was withdrawn and should be confirmed against the page image for exact historical wording.',
        recommendedAction:
          'Keep the one-page slice review-only and confirm wording before any later promotion decision.',
        evidence: 'Page 1 states that Actuarial Guideline XII was withdrawn on March 7, 1993.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag12-single-page-coverage',
        status: 'passed',
        details: 'The selected page captures the full AG 12 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 12 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'withdrawn-status-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the withdrawn status.',
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
        authorityLevel: 'historical',
        reviewPacketNotes: 'Withdrawn historical slice remains review-only.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 12 slice retained as withdrawn historical caveat until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag12BatchSpecs = [
  {
    plannedBatchId: 'batch-090',
    batchSlug: 'ag12-090-withdrawn-interest-rates',
    sourceId: 'ag12-withdrawn-interest-rates',
    filename:
      'AG 12 - Interpretation Regarding Valuation and Non-Forfeiture Interest Rates.pdf',
    sourceTitle:
      'AG 12 - Interpretation Regarding Valuation and Non-Forfeiture Interest Rates',
    sourceReference: 'Actuarial Guideline XII',
    batchTitle: 'withdrawn historical note',
    pageWindow: [1, 1],
    sectionReference:
      'AG 12: Interpretation Regarding Valuation and Non-Forfeiture Interest Rates (withdrawn historical note)',
    citationText:
      'Actuarial Guideline XII was withdrawn on March 7, 1993.',
    summary:
      'AG 12 is a withdrawn historical note about valuation and nonforfeiture interest rates; retain it only as a caveat and do not treat it as active guidance.',
    keywords: [
      'AG 12',
      'withdrawn',
      'valuation',
      'nonforfeiture',
      'interest rates',
      'historical',
      'caveat',
    ],
    notes:
      'One-page withdrawn note; keep review-only and stop at the page boundary.',
    sourceNotes: 'Withdrawn on March 7, 1993; keep as historical caveat only.',
    summaryLead:
      'AG 12 is a withdrawn historical note on valuation and nonforfeiture interest rates.',
    flagMessage:
      'AG 12 is withdrawn and should stay review-only as historical guidance.',
    citationIssueDetails:
      'The single-page PDF states that Actuarial Guideline XII was withdrawn on March 7, 1993, so the wording should be treated as historical caveat text before any indexing decision.',
    decisionQuestion:
      'Should AG 12 stay indexed only as withdrawn historical guidance, or should it be cross-linked to another caution note in a later cleanup step?',
    decisionWhy:
      'The index choice affects future review and promotion decisions.',
    issueMessage:
      'The AG 12 page shows that the guideline was withdrawn and should be confirmed against the page image for exact historical wording.',
    issueAction:
      'Keep the one-page slice review-only and confirm wording before any later promotion decision.',
    evidence: 'Page 1 states that Actuarial Guideline XII was withdrawn on March 7, 1993.',
    pageCoverageDetails:
      'The selected page captures the full AG 12 guideline.',
    reviewPacketReason:
      'This withdrawn single-page AG 12 guideline is intentionally limited to the withdrawn historical note and is retained for review-only analysis.',
    nextStep:
      'Confirm whether AG 12 should stay as a withdrawn historical note or be cross-linked to a later caution index entry.',
    reviewFlags: [
      'stale_or_repealed_source',
      'caveat_or_companion_guidance',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
  },
]

export const ag12BatchDefinitions = Object.fromEntries(
  ag12BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg12Batch(spec)]),
)
