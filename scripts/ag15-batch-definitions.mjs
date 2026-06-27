const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 15 stays review-only. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg15Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 15 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag15_variable_life_illustration',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 15 historical-guidance batch: capture the one-page illustration guideline for variable life insurance model regulation and keep the disclosure language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 15 is retained as historical illustration guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This historical one-page AG 15 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 15 historical-guidance batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'historical_guidance',
        message:
          'AG 15 is historical illustration guidance and should stay review-only unless a later human review changes the indexing choice.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-text-layer`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'encoded_text_layer',
        message:
          'The text layer is noisy, so the page image should be used to confirm the illustration-guideline wording.',
        notes: 'Confirm wording against the page image before any later indexing choice.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The PDF text layer is noisy on the page, so the exact wording should be confirmed against the page image before any later indexing choice.',
        recommendedAction:
          'Keep the page locator, confirm the page image wording, and do not promote it as active guidance.',
      },
      {
        issueId: `citation-${sourceId}-historical-disposition`,
        sourceId,
        itemId,
        issueType: 'historical_status_confirmation',
        details:
          'The source appears historical rather than withdrawn, but the indexing disposition should be confirmed before promotion or cross-linking.',
        recommendedAction:
          'Treat AG 15 as caveat-first historical guidance unless a later human review changes the indexing choice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 15 remain indexed as historical caveat-first guidance, or should it be linked only as a variable-life illustration note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-image-check`,
        decisionType: 'citation_check',
        question:
          'Does the page image confirm the illustration-guideline wording used in the review packet?',
        whyItMatters:
          'The text layer is noisy and exact wording matters for later review.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-page-image`,
        severity: 'high',
        issueType: 'page_image_confirmation',
        sourceId,
        itemId,
        message:
          'The AG 15 page image should be checked because the text layer is encoded/noisy and the exact wording matters for a later indexing choice.',
        recommendedAction:
          'Confirm the page-image wording before any later promotion or cross-linking decision.',
        evidence:
          'The rendered page shows historical illustration guidance for variable life insurance, but the text layer is noisy.',
      },
      {
        issueId: `issue-${sourceId}-historical-disposition`,
        severity: 'medium',
        issueType: 'historical_status_confirmation',
        sourceId,
        itemId,
        message:
          'The source appears historical rather than withdrawn, but the review packet should not overstate the indexing choice without human confirmation.',
        recommendedAction:
          'Keep the unit review-only and confirm whether it should remain caveat-first historical guidance.',
        evidence: 'The scanned copy does not show a withdrawn notice.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag15-one-page-coverage',
        status: 'passed',
        details: 'The selected page captures the full one-page AG 15 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 15 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'historical-status-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the historical status caveat.',
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
        reviewPacketNotes: 'Historical illustration slice remains review-only.',
        reviewPacketIssueCount: 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 15 slice retained as historical caveat guidance until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag15BatchSpecs = [
  {
    plannedBatchId: 'batch-093',
    batchSlug: 'ag15-093-variable-life-illustration-guideline',
    sourceId: 'ag15-variable-life-illustration-guideline',
    filename:
      'AG 15 - Illustration Guideline for Variable Life Insurance Model Regulation.pdf',
    sourceTitle:
      'AG 15 - Illustration Guideline for Variable Life Insurance Model Regulation',
    sourceReference: 'Actuarial Guideline XV',
    batchTitle: 'illustration guideline',
        pageWindow: [1, 1],
    sectionReference:
      'AG 15: Illustration Guideline for Variable Life Insurance Model Regulation (historical illustration guidance)',
    citationText:
      'Any sales illustration shown or furnished in connection with the sale of variable life insurance must conform with the following requirements except that these requirements only apply to the variable portion of contracts with fixed and variable funding options.',
    summary:
      'AG 15 is a historical illustration guideline for variable life insurance model regulation that explains how sales illustrations should be disclosed and cross-referenced.',
    keywords: [
      'AG 15',
      'Actuarial Guideline XV',
      'illustration guideline',
      'variable life insurance',
      'hypothetical interest rates',
      'disclosure',
      'Article VII',
    ],
    notes:
      'One-page historical guideline; keep review-only and stop at the page boundary.',
    sourceNotes:
      'Historical illustration guidance; the page-image wording should be checked because the text layer is noisy.',
    summaryLead:
      'AG 15 is a one-page historical guideline on variable-life insurance illustrations.',
    flagMessage:
      'AG 15 is historical illustration guidance and should stay review-only unless a later human review changes the indexing choice.',
    textLayerMessage:
      'The text layer is noisy, so the page image should be used to confirm the illustration-guideline wording.',
    citationIssueDetails:
      'The PDF text layer renders with noise, so the exact wording should be confirmed against the page image before any later indexing choice.',
    historicalDispositionDetails:
      'The source appears historical rather than withdrawn, but the indexing disposition should be confirmed before promotion or cross-linking.',
    decisionQuestion:
      'Should AG 15 remain indexed as historical caveat-first guidance, or should it be linked only as a variable-life illustration note?',
    decisionWhy:
      'The indexing choice affects future review and promotion decisions.',
    pageImageQuestion:
      'Does the page image confirm the illustration-guideline wording used in the review packet?',
    pageImageWhy:
      'The text layer is noisy and exact wording matters for later review.',
    issueMessage:
      'The AG 15 page image should be checked because the text layer is encoded/noisy and the exact wording matters for a later indexing choice.',
    issueAction:
      'Confirm the page-image wording before any later promotion or cross-linking decision.',
    evidence:
      'The rendered page shows historical illustration guidance for variable life insurance, but the text layer is noisy.',
    historicalIssueMessage:
      'The source appears historical rather than withdrawn, but the review packet should not overstate the indexing choice without human confirmation.',
    historicalIssueAction:
      'Keep the unit review-only and confirm whether it should remain caveat-first historical guidance.',
    reviewPacketReason:
      'This historical one-page AG 15 guideline is intentionally limited to the illustration guideline and is retained for review-only analysis.',
    nextStep:
      'Confirm the page-image wording and decide whether AG 15 should stay indexed as historical caveat-first guidance in the next review pass.',
    reviewFlags: [
      'historical_guidance',
      'variable_life_illustration_judgment',
      'encoded_text_layer',
    ],
  },
]

export const ag15BatchDefinitions = Object.fromEntries(
  ag15BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg15Batch(spec)]),
)
