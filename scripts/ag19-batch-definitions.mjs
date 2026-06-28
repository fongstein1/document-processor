const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 19 stays review-only. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg19Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 19 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag19_mortality_table_guideline',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 19 review-only batch: capture the one-page 1980 CSO mortality-table guideline and keep the mortality-factor language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 19 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This one-page AG 19 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 19 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'mortality_table_context',
        message:
          'AG 19 is a mortality-table guidance note, so the table-selection language should stay review-only until the reviewer confirms the wording.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-text-layer`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'encoded_text_layer',
        message:
          'The text layer is noisy, so the page image should be used to confirm the AG 19 wording.',
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
        issueId: `citation-${sourceId}-mortality-table-context`,
        sourceId,
        itemId,
        issueType: 'mortality_table_context_confirmation',
        details:
          'The select-factor and mortality-table language should be kept in context review mode until human review confirms the interpretation.',
        recommendedAction:
          'Treat AG 19 as review-only mortality-table guidance unless a later human review changes the indexing choice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 19 remain indexed as review-only mortality-table guidance, or should it be linked only as a context note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-image-check`,
        decisionType: 'citation_check',
        question:
          'Does the page image confirm the AG 19 wording used in the review packet?',
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
          'The AG 19 page image should be checked because the text layer is encoded/noisy and the exact wording matters for a later indexing choice.',
        recommendedAction:
          'Confirm the page-image wording before any later promotion or cross-linking decision.',
        evidence:
          'The rendered page shows 1980 CSO mortality table guidance, but the text layer is noisy.',
      },
      {
        issueId: `issue-${sourceId}-mortality-table-context`,
        severity: 'medium',
        issueType: 'mortality_table_context_confirmation',
        sourceId,
        itemId,
        message:
          'The AG 19 select-factor and mortality-table language should stay in context review mode until human review confirms the interpretation.',
        recommendedAction:
          'Keep the unit review-only and confirm whether it should remain caveat-first mortality-table guidance.',
        evidence: 'The guideline is written as mortality-table guidance rather than a narrative note.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag19-one-page-coverage',
        status: 'passed',
        details: 'The selected page captures the full one-page AG 19 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 19 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'mortality-table-context-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the mortality-table caveat.',
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
        reviewPacketNotes: 'One-page mortality-table slice remains review-only.',
        reviewPacketIssueCount: 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 19 slice retained as review-only guidance until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag19BatchSpecs = [
  {
    plannedBatchId: 'batch-097',
    batchSlug: 'ag19-097-select-mortality-factors',
    sourceId: 'ag19-1980-cso-select-mortality-factors',
    filename:
      "AG 19 - Guideline Concerning 1980 Commissioners' Standard Ordinary Mortality Table With 10-Year Select Mortality Factors.pdf",
    sourceTitle:
      "AG 19 - Guideline Concerning 1980 Commissioners' Standard Ordinary Mortality Table With 10-Year Select Mortality Factors",
    sourceReference: 'Actuarial Guideline XIX',
    batchTitle: '1980 CSO ten-year select mortality factors guideline',
    pageWindow: [1, 1],
    sectionReference:
      "AG 19: 1980 Commissioners' Standard Ordinary Mortality Table With Ten-Year Select Mortality Factors",
    citationText:
      "The Standard Valuation Law and the Standard Nonforfeiture Law for Life Insurance make reference to the 1980 Commissioners' Standard Ordinary Mortality Table with Ten-Year Select Mortality Factors.",
    summary:
      'AG 19 is a guideline about the 1980 Commissioners\' Standard Ordinary Mortality Table with Ten-Year Select Mortality Factors.',
    keywords: [
      'AG 19',
      'Actuarial Guideline XIX',
      '1980 CSO',
      'ten-year select mortality factors',
      'mortality table',
      'Standard Valuation Law',
      'Standard Nonforfeiture Law',
    ],
    notes: 'One-page guideline; keep review-only and stop at the page boundary.',
    sourceNotes:
      'Current guideline; the page-image wording should be checked because the text layer is noisy.',
    summaryLead:
      'AG 19 is a one-page guideline on the 1980 CSO mortality table with ten-year select mortality factors.',
    reviewFlags: ['mortality_table_context', 'encoded_text_layer'],
    nextStep:
      'Confirm the page-image wording and decide whether AG 19 should stay indexed as review-only mortality-table guidance in the next review pass.',
  },
]

export const ag19BatchDefinitions = Object.fromEntries(
  ag19BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg19Batch(spec)]),
)
