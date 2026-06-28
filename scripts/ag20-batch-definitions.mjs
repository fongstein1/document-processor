const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 20 stays review-only. Keep the unit source-bound, preserve the page locator, and do not promote any item.'

const makeAg20Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 20 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag20_joint_life_functions_guideline',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 20 review-only batch: capture the seven-page joint-life-functions guideline and keep the table-context language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 20 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This seven-page AG 20 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 20 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'joint_life_table_context',
        message:
          'AG 20 is a joint-life table guidance note, so the acceptability language and lookup tables should stay review-only until the reviewer confirms the indexing choice.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-blank-page`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'blank_separator_page',
        message:
          'Page 3 is blank, so the page boundary should stay visible instead of being treated as a missing content page.',
        notes: 'Keep the separator visible as a boundary marker.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-table-boundary`,
        sourceId,
        itemId,
        issueType: 'table_continuity_confirmation',
        details:
          'The blank separator page should not cause the A5-1 / A5-6 / A5-7 table family to be treated as separate source units.',
        recommendedAction:
          'Keep the full pages 1-7 window together and preserve the blank page as a boundary note.',
      },
      {
        issueId: `citation-${sourceId}-indexing-choice`,
        sourceId,
        itemId,
        issueType: 'indexing_choice_confirmation',
        details:
          'The joint-life-function acceptability language should remain review-only until a later human review decides whether the note should remain a standalone index item or a context note.',
        recommendedAction:
          'Treat AG 20 as review-only table guidance unless a later human review changes the indexing choice.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 20 remain indexed as review-only joint-life-function guidance, or should it be linked only as a context note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-blank-page-note`,
        decisionType: 'citation_check',
        question:
          'Should the blank page 3 separator be called out explicitly in the review index, or can it remain implicit inside the batch boundary?',
        whyItMatters:
          'The separator page is part of the source layout and should stay visible if a reviewer needs to confirm the table continuity.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-table-boundary`,
        severity: 'medium',
        issueType: 'table_continuity_confirmation',
        sourceId,
        itemId,
        message:
          'The AG 20 tables continue across pages 4-7, and the blank page 3 should remain a visible boundary marker without splitting the batch.',
        recommendedAction:
          'Keep the full pages 1-7 window together and preserve the blank page as a boundary note.',
        evidence: 'Page 3 is blank and the Ultimate 1xx tables continue immediately afterward.',
      },
      {
        issueId: `issue-${sourceId}-indexing-choice`,
        severity: 'medium',
        issueType: 'indexing_choice_confirmation',
        sourceId,
        itemId,
        message:
          'The joint-life-function acceptability language should stay review-only until a human review confirms the indexing choice.',
        recommendedAction:
          'Keep AG 20 as review-only table guidance unless a later human review changes the indexing choice.',
        evidence:
          'The guideline says the tables are acceptable for use in calculating reserves or nonforfeiture values for joint life policies on the 1980 CSO basis.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag20-seven-page-coverage',
        status: 'passed',
        details: 'The selected page window captures the full seven-page AG 20 guideline.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 20 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'table-context-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the joint-life table caveat.',
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
        reviewPacketNotes: 'Seven-page joint-life table slice remains review-only.',
        reviewPacketIssueCount: 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 20 slice retained as review-only guidance until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag20BatchSpecs = [
  {
    plannedBatchId: 'batch-098',
    batchSlug: 'ag20-098-joint-life-functions',
    sourceId: 'ag20-joint-life-functions-1980-cso',
    filename:
      "AG 20 - Guideline Concerning Joint Life Functions for 1980 Commissioners' Standard Ordinary Mortality Table.pdf",
    sourceTitle:
      "AG 20 - Guideline Concerning Joint Life Functions for 1980 Commissioners' Standard Ordinary Mortality Table",
    sourceReference: 'Actuarial Guideline XX',
    batchTitle: '1980 CSO joint-life-functions guideline',
    pageWindow: [1, 7],
    sectionReference:
      "AG 20: Joint life functions for the 1980 Commissioners' Standard Ordinary Mortality Table",
    citationText:
      'The tables of uniform seniority and the “Ultimate 1xx Tables” in Appendix 5 of the Report of the Society of Actuaries Committee on Specifications for Monetary Values - 1980 CSO Tables are acceptable for use in calculating reserves or nonforfeiture values for joint life policies on the 1980 CSO basis.',
    summary:
      'AG 20 is a guideline about joint life functions for the 1980 CSO mortality table and reproduces Appendix 5 lookup tables.',
    keywords: [
      'AG 20',
      'Actuarial Guideline XX',
      'joint life functions',
      '1980 CSO',
      'uniform seniority',
      'Ultimate 1xx Tables',
      'equivalent equal ages',
      'A5-1',
      'A5-6',
      'A5-7',
      'nonforfeiture values',
    ],
    notes: 'Seven-page guideline; page 3 is a blank separator and the page boundary stays review-only.',
    sourceNotes:
      'Current guideline; pages 1-7 stay together as a single review-only slice so the lookup-table continuity remains visible.',
    summaryLead:
      'AG 20 is a seven-page guideline on joint life functions for the 1980 CSO mortality table.',
    reviewFlags: ['joint_life_table_context', 'blank_separator_page'],
    nextStep:
      'Confirm whether AG 20 should remain indexed as review-only table guidance and whether the blank separator should be called out explicitly in the review index.',
  },
]

export const ag20BatchDefinitions = Object.fromEntries(
  ag20BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg20Batch(spec)]),
)
