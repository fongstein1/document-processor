const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 13 stays review-only. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg13Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 13 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag13_historical_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 13 historical-guidance batch: capture the two-page CARVM contingent surrender-charge interpretation and keep the bail-out-rate language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 13 is retained as historical CARVM guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This historical two-page AG 13 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 13 historical-guidance batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'historical_guidance',
        message:
          'AG 13 is historical CARVM guidance and should stay review-only unless a later human review changes the indexing choice.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-text-layer`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'encoded_text_layer',
        message:
          'The text layer is noisy, so the page image should be used to confirm the contingent surrender-charge wording.',
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
          'The PDF text layer renders as encoded glyph noise on both pages, so the exact wording should be confirmed against the page images before any later indexing choice.',
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
          'Treat AG 13 as caveat-first historical guidance unless a later human review changes the indexing choice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 13 remain indexed as historical caveat-first guidance, or should it be linked only as a background CARVM interpretation note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-image-check`,
        decisionType: 'citation_check',
        question:
          'Does the page image confirm the contingent surrender-charge and bail-out-rate wording used in the review packet?',
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
          'The AG 13 page image should be checked because the text layer is encoded/noisy and the exact wording matters for a later indexing choice.',
        recommendedAction:
          'Confirm the page-image wording before any later promotion or cross-linking decision.',
        evidence:
          'The rendered pages show historical CARVM guidance on contingent surrender charges and bail-out rates, but the text layer is encoded.',
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
        checkId: 'ag13-two-page-coverage',
        status: 'passed',
        details: 'The selected pages capture the full two-page AG 13 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 13 slice carries a source reference and a page locator.',
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
        reviewPacketNotes: 'Historical CARVM slice remains review-only.',
        reviewPacketIssueCount: 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 13 slice retained as historical caveat guidance until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag13BatchSpecs = [
  {
    plannedBatchId: 'batch-091',
    batchSlug: 'ag13-091-historical-carvm-guidance',
    sourceId: 'ag13-historical-carvm-guidance',
    filename:
      "AG 13 - Guideline Concerning the Commissioners' Annuity Reserve Valuation Method.pdf",
    sourceTitle:
      "AG 13 - Guideline Concerning the Commissioners' Annuity Reserve Valuation Method",
    sourceReference: 'Actuarial Guideline XIII',
    batchTitle: 'historical CARVM guidance',
    pageWindow: [1, 2],
    sectionReference:
      'AG 13: Guideline Concerning the Commissioners\' Annuity Reserve Valuation Method (historical CARVM guidance)',
    citationText:
      'The value of future guaranteed benefits under CARVM may not be reduced by contingent surrender charges which may not be available upon cash surrender.',
    summary:
      'AG 13 is a historical guideline on CARVM that explains when contingent surrender charges and bail-out rates may be treated as available and when they may not.',
    keywords: [
      'AG 13',
      'CARVM',
      'contingent surrender charges',
      'bail-out rates',
      'historical guidance',
      'cash surrender values',
    ],
    notes:
      'Two-page historical guideline; keep review-only and stop at the page boundary.',
    sourceNotes:
      'Historical CARVM guidance; the page-image wording should be checked because the text layer is noisy.',
    summaryLead:
      'AG 13 is a two-page historical guideline on CARVM contingent surrender charges.',
    flagMessage:
      'AG 13 is historical CARVM guidance and should stay review-only unless a later human review changes the indexing choice.',
    textLayerMessage:
      'The text layer is noisy, so the page image should be used to confirm the contingent surrender-charge wording.',
    citationIssueDetails:
      'The PDF text layer renders as encoded glyph noise on both pages, so the exact wording should be confirmed against the page images before any later indexing choice.',
    historicalDispositionDetails:
      'The source appears historical rather than withdrawn, but the indexing disposition should be confirmed before promotion or cross-linking.',
    decisionQuestion:
      'Should AG 13 remain indexed as historical caveat-first guidance, or should it be linked only as a background CARVM interpretation note?',
    decisionWhy:
      'The indexing choice affects future review and promotion decisions.',
    pageImageQuestion:
      'Does the page image confirm the contingent surrender-charge and bail-out-rate wording used in the review packet?',
    pageImageWhy:
      'The text layer is noisy and exact wording matters for later review.',
    issueMessage:
      'The AG 13 page image should be checked because the text layer is encoded/noisy and the exact wording matters for a later indexing choice.',
    issueAction:
      'Confirm the page-image wording before any later promotion or cross-linking decision.',
    evidence:
      'The rendered pages show historical CARVM guidance on contingent surrender charges and bail-out rates, but the text layer is encoded.',
    historicalIssueMessage:
      'The source appears historical rather than withdrawn, but the review packet should not overstate the indexing choice without human confirmation.',
    historicalIssueAction:
      'Keep the unit review-only and confirm whether it should remain caveat-first historical guidance.',
    reviewPacketReason:
      'This historical two-page AG 13 guideline is intentionally limited to the historical CARVM guidance and is retained for review-only analysis.',
    nextStep:
      'Confirm the page-image wording and decide whether AG 13 should stay indexed as historical caveat-first guidance in the next review pass.',
    reviewFlags: [
      'historical_guidance',
      'contingent_surrender_charge_judgment',
      'encoded_text_layer',
    ],
  },
]

export const ag13BatchDefinitions = Object.fromEntries(
  ag13BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg13Batch(spec)]),
)
