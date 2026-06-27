const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 17 stays review-only. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg17Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 17 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag17_nonlevel_death_benefits',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 17 historical-guidance batch: capture the one-page CRVM non-level death-benefit guideline and keep the formula language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 17 is retained as historical CRVM guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This historical one-page AG 17 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 17 historical-guidance batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'historical_guidance',
        message:
          'AG 17 is historical CRVM guidance and should stay review-only unless a later human review changes the indexing choice.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-text-layer`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'encoded_text_layer',
        message:
          'The text layer is noisy, so the page image should be used to confirm the CRVM wording.',
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
          'Treat AG 17 as caveat-first historical guidance unless a later human review changes the indexing choice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 17 remain indexed as historical caveat-first guidance, or should it be linked only as a non-level death-benefit note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-image-check`,
        decisionType: 'citation_check',
        question:
          'Does the page image confirm the CRVM wording used in the review packet?',
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
          'The AG 17 page image should be checked because the text layer is encoded/noisy and the exact wording matters for a later indexing choice.',
        recommendedAction:
          'Confirm the page-image wording before any later promotion or cross-linking decision.',
        evidence:
          'The rendered page shows CRVM non-level death-benefit guidance, but the text layer is noisy.',
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
        checkId: 'ag17-one-page-coverage',
        status: 'passed',
        details: 'The selected page captures the full one-page AG 17 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 17 slice carries a source reference and a page locator.',
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
        reviewPacketNotes: 'Historical CRVM slice remains review-only.',
        reviewPacketIssueCount: 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 17 slice retained as historical caveat guidance until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag17BatchSpecs = [
  {
    plannedBatchId: 'batch-095',
    batchSlug: 'ag17-095-nonlevel-death-benefits',
    sourceId: 'ag17-crvm-nonlevel-death-benefits',
    filename:
      "AG 17 - Guideline for Calculation of Commissioners' Reserve Valuation Method When Death Benefits are Not Level.pdf",
    sourceTitle:
      "AG 17 - Guideline for Calculation of Commissioners' Reserve Valuation Method When Death Benefits are Not Level",
    sourceReference: 'Actuarial Guideline XVII',
    batchTitle: 'non-level death-benefit guideline',
    pageWindow: [1, 1],
    sectionReference:
      'AG 17: Guideline for Calculation of Commissioners\' Reserve Valuation Method When Death Benefits are Not Level (historical CRVM guidance)',
    citationText:
      'In the definition of the Commissioners\' Reserve Valuation Method, the Standard Valuation Law (Section 4) refers to the "net level annual premium on the nineteen-year premium whole life plan for insurance of the same amount...."',
    summary:
      'AG 17 is a historical CRVM guideline about non-level death benefits and the renewal net level annual premium interpretation.',
    keywords: [
      'AG 17',
      'Actuarial Guideline XVII',
      'non-level death benefits',
      'equivalent level renewal amount',
      'average amount of insurance',
      'Standard Valuation Law',
      'Section 5-c',
    ],
    notes:
      'One-page historical guideline; keep review-only and stop at the page boundary.',
    sourceNotes:
      'Historical CRVM guidance; the page-image wording should be checked because the text layer is noisy.',
    summaryLead:
      'AG 17 is a one-page historical guideline on CRVM non-level death-benefit calculations.',
    reviewFlags: ['historical_guidance', 'formula_context', 'encoded_text_layer'],
    nextStep:
      'Confirm the page-image wording and decide whether AG 17 should stay indexed as historical caveat-first guidance in the next review pass.',
  },
]

export const ag17BatchDefinitions = Object.fromEntries(
  ag17BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg17Batch(spec)]),
)
