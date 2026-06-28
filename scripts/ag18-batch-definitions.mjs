const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 18 stays review-only. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg18Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 18 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag18_continuous_basis',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 18 review-only batch: capture the one-page CRVM semi-continuous / fully continuous / discounted continuous basis guideline and keep the calculation language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 18 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This one-page AG 18 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 18 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'formula_context',
        message:
          'AG 18 is a calculation guideline, so the basis-choice language should stay review-only until the reviewer confirms the wording.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-text-layer`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'encoded_text_layer',
        message:
          'The text layer is noisy, so the page image should be used to confirm the AG 18 wording.',
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
        issueId: `citation-${sourceId}-formula-context`,
        sourceId,
        itemId,
        issueType: 'formula_context_confirmation',
        details:
          'The basis-choice and expense-allowance language should be kept in formula-context review mode until human review confirms the interpretation.',
        recommendedAction:
          'Treat AG 18 as review-only calculation guidance unless a later human review changes the indexing choice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 18 remain indexed as review-only semi-continuous basis guidance, or should it be linked only as a formula-context note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-image-check`,
        decisionType: 'citation_check',
        question:
          'Does the page image confirm the AG 18 wording used in the review packet?',
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
          'The AG 18 page image should be checked because the text layer is encoded/noisy and the exact wording matters for a later indexing choice.',
        recommendedAction:
          'Confirm the page-image wording before any later promotion or cross-linking decision.',
        evidence:
          'The rendered page shows semi-continuous / fully continuous / discounted continuous CRVM guidance, but the text layer is noisy.',
      },
      {
        issueId: `issue-${sourceId}-formula-context`,
        severity: 'medium',
        issueType: 'formula_context_confirmation',
        sourceId,
        itemId,
        message:
          'The AG 18 basis-choice and expense-allowance language should stay in formula-context review mode until human review confirms the interpretation.',
        recommendedAction:
          'Keep the unit review-only and confirm whether it should remain caveat-first calculation guidance.',
        evidence: 'The guideline is written as calculation guidance rather than a narrative note.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag18-one-page-coverage',
        status: 'passed',
        details: 'The selected page captures the full one-page AG 18 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 18 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'formula-context-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the formula-context caveat.',
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
        authorityLevel: 'active',
        reviewPacketNotes: 'One-page CRVM slice remains review-only.',
        reviewPacketIssueCount: 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 18 slice retained as review-only guidance until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag18BatchSpecs = [
  {
    plannedBatchId: 'batch-096',
    batchSlug: 'ag18-096-continuous-basis',
    sourceId: 'ag18-crvm-continuous-basis',
    filename:
      "AG 18 - Guideline for Calculation of Commissioners' Reserve Valuation Method on Semi-Continuous, Fully Continuous, or Discounted Continuous Basis.pdf",
    sourceTitle:
      "AG 18 - Guideline for Calculation of Commissioners' Reserve Valuation Method on Semi-Continuous, Fully Continuous, or Discounted Continuous Basis",
    sourceReference: 'Actuarial Guideline XVIII',
    batchTitle: 'semi-continuous / fully continuous / discounted continuous basis guideline',
    pageWindow: [1, 1],
    sectionReference:
      "AG 18: Guideline for Calculation of Commissioners' Reserve Valuation Method on Semi-Continuous, Fully Continuous, or Discounted Continuous Basis",
    citationText:
      'The Standard Valuation Law uses the excess of (a) over (b) in the definition of the modified net premiums in Section 4.',
    summary:
      'AG 18 is a guideline about CRVM reserves on a semi-continuous, fully continuous, or discounted continuous basis.',
    keywords: [
      'AG 18',
      'Actuarial Guideline XVIII',
      'semi-continuous',
      'fully continuous',
      'discounted continuous',
      'modified net premiums',
      'initial expense allowance',
      'curtate functions',
    ],
    notes: 'One-page guideline; keep review-only and stop at the page boundary.',
    sourceNotes:
      'Current guideline; the page-image wording should be checked because the text layer is noisy.',
    summaryLead:
      'AG 18 is a one-page guideline on CRVM reserves on a semi-continuous, fully continuous, or discounted continuous basis.',
    reviewFlags: ['formula_context', 'encoded_text_layer'],
    nextStep:
      'Confirm the page-image wording and decide whether AG 18 should stay indexed as review-only calculation guidance in the next review pass.',
  },
]

export const ag18BatchDefinitions = Object.fromEntries(
  ag18BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg18Batch(spec)]),
)
