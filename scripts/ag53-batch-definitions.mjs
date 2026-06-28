const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 53 stays review-only. Keep page locators primary and line references are not expected, and do not promote any item.'

const makeAg53Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 53 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag53_life_insurer_asset_adequacy_analysis',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 53 review-only batch: capture the life-insurer reserve adequacy guidance and keep later guideline files outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 53 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 53 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the next guideline outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 53 guideline batch. Keep the work review-first, preserve page locators, keep the page-image wording backstop visible if exact wording matters, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'page_locator_primary',
        message:
          'AG 53 should stay page-locator anchored because the runner is not expected to produce stable line references.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-line-reference`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'line_references_are_not_expected',
        message:
          'Line references are not expected for this PDF runner path; page locators remain the primary anchor.',
        notes: 'Keep the page-locator anchor visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-topic`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: spec.flagType,
        message: spec.flagMessage,
        notes: 'Keep the topic boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-locator-primary`,
        sourceId,
        itemId,
        issueType: 'page_locator_primary',
        details:
          'Page locators should remain the primary anchor for AG 53 because the runner does not emit stable line references for this PDF source.',
        recommendedAction:
          'Keep the planned page window together and preserve the locator in the review packet.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-gap`,
        sourceId,
        itemId,
        issueType: 'line_references_are_not_expected',
        details:
          'Line references are not expected for this PDF runner path, so the page locator is the practical review anchor.',
        recommendedAction:
          'Keep the page locator visible and avoid overclaiming exact line wording.',
      },
      {
        issueId: `citation-${sourceId}-topic-boundary`,
        sourceId,
        itemId,
        issueType: spec.topicIssueType,
        details: spec.topicIssueDetails,
        recommendedAction: spec.topicRecommendedAction,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 53 remain indexed as active review-only guidance, or should it later be linked only as a context note once future guidance supersedes it?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current 1-2 / 3-5 / 6-7 split remain the canonical regeneration boundary, or should later cleanup rebalance the reporting and appendix section?',
        whyItMatters: 'The page window controls how much context is exposed in the review packet.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-page-locator-primary`,
        severity: 'medium',
        issueType: 'page_locator_primary',
        sourceId,
        itemId,
        message:
          'The AG 53 slice should remain anchored by page locators because the runner does not emit stable line references.',
        recommendedAction:
          'Keep the page locator visible instead of overclaiming exact line wording.',
        evidence:
          'The source is a PDF and the controlled runner uses page-based extraction for this source family.',
      },
      {
        issueId: `issue-${sourceId}-line-reference-gap`,
        severity: 'medium',
        issueType: 'line_references_are_not_expected',
        sourceId,
        itemId,
        message:
          'Line references are not expected for this PDF runner path, so the page locator should remain the review anchor.',
        recommendedAction:
          'Keep the page locator visible and avoid overclaiming exact line wording.',
        evidence:
          'AG 53 is a PDF source and the controlled runner uses page-based extraction for this source family.',
      },
      {
        issueId: `issue-${sourceId}-topic-boundary`,
        severity: 'medium',
        issueType: spec.topicIssueType,
        sourceId,
        itemId,
        message: spec.topicIssueMessage,
        recommendedAction: spec.topicRecommendedAction,
        evidence: spec.topicIssueEvidence,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag53-page-window-coverage',
        status: 'passed',
        details: `The selected page window captures the planned AG 53 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 53 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'line-reference-gap-tracked',
        status: 'passed',
        details: 'The review packet keeps page locators primary because line references are not expected.',
      },
      {
        checkId: 'topic-context-tracked',
        status: 'passed',
        details: spec.topicValidationDetails,
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
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: spec.reviewPacketIssueCount ?? 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 53 slice retained as review-only guidance until the wording and boundary are confirmed.',
      },
    ],
  }
}

const ag53BatchSpecs = [
  {
    plannedBatchId: 'batch-165',
    batchSlug: 'ag53-165-background-scope-definitions',
    sourceId: 'ag53-background-scope-definitions',
    filename: 'AG 53-AAT as adopted by LATF-20220616.pdf',
    sourceTitle: 'Application of the Valuation Manual for Testing the Adequacy of Life Insurer Reserves',
    sourceReference: 'Actuarial Guideline AAT',
    batchTitle: 'background, scope, and definitions slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 53 pages 1-2: background, purpose, scope thresholds, and projected high net yield asset definitions.',
    citationText:
      'This Guideline is intended to provide uniform guidance and clarification of requirements for the appropriate support of certain assumptions for asset adequacy analysis performed by life insurers.',
    summary:
      'AG 53 establishes the life-insurer reserve adequacy guidance, its scope thresholds, and key projected-high-net-yield-asset definitions before the modeling section begins.',
    keywords: [
      'AG 53',
      'Actuarial Guideline AAT',
      'life insurer reserves',
      'asset adequacy analysis',
      'scope',
      'definitions',
      'VM-30',
      'projected high net yield assets',
    ],
    notes:
      'Opening background, scope, and definition window; keep the page locators primary and treat line references as not expected for this PDF source.',
    sourceNotes: 'Active guidance; later guideline files remain out of scope for this wave.',
    reviewFlags: ['page_locator_primary', 'line_references_are_not_expected', 'background', 'scope', 'definitions'],
    reviewPacketNotes: 'AG 53 opening slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the opening guidance and whether the scope thresholds should stay grouped with the projected-high-net-yield-asset definitions before expanding the source.',
    flagType: 'opening_scope_caveat',
    flagMessage:
      'The opening background and scope guidance should remain review-only until the later modeling sections are reconciled.',
    topicIssueType: 'opening_scope_boundary',
    topicIssueDetails:
      'The opening background, scope, and definitions should stay separate from the later asset-adequacy modeling section.',
    topicRecommendedAction:
      'Keep the page 1-2 slice review-only and do not widen it into the later modeling pages.',
    topicIssueMessage: 'The opening guidance should not absorb the later asset-adequacy modeling section.',
    topicIssueEvidence:
      'Pages 1-2 contain the background, purpose, scope thresholds, and projected-high-net-yield-asset definitions.',
    topicValidationDetails: 'The selected page window captures the AG 53 opening slice.',
  },
  {
    plannedBatchId: 'batch-166',
    batchSlug: 'ag53-166-asset-adequacy-considerations',
    sourceId: 'ag53-asset-adequacy-considerations',
    filename: 'AG 53-AAT as adopted by LATF-20220616.pdf',
    sourceTitle: 'Application of the Valuation Manual for Testing the Adequacy of Life Insurer Reserves',
    sourceReference: 'Actuarial Guideline AAT',
    batchTitle: 'asset adequacy considerations and modeling slice',
    pageWindow: [3, 5],
    sectionReference:
      'AG 53 pages 3-5: asset adequacy considerations, modeling expectations, fair value, reinsurance modeling, borrowing, and sensitivity-test entry points.',
    citationText:
      'A detailed explanation describing the relationship between the expected gross returns from the assets and the associated investment and market risks should be provided.',
    summary:
      'AG 53 sets out asset adequacy considerations, modeling expectations, fair value, reinsurance modeling, borrowing, and the sensitivity-test entry points.',
    keywords: [
      'AG 53',
      'Actuarial Guideline AAT',
      'asset adequacy',
      'modeling',
      'fair value',
      'reinsurance',
      'borrowing',
      'sensitivity tests',
    ],
    notes:
      'Modeling slice; keep the page locators primary and treat line references as not expected for this PDF source.',
    sourceNotes: 'Active guidance; later guideline files remain out of scope for this wave.',
    reviewFlags: [
      'page_locator_primary',
      'line_references_are_not_expected',
      'asset_adequacy',
      'modeling',
      'reinsurance',
      'borrowing',
    ],
    reviewPacketNotes: 'AG 53 modeling slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the modeling slice and whether the fair-value, reinsurance, and borrowing material should stay grouped before expanding the source.',
    flagType: 'modeling_boundary_caveat',
    flagMessage:
      'The asset-adequacy modeling guidance should remain review-only until the sensitivity-test and appendix material is reconciled.',
    topicIssueType: 'modeling_boundary',
    topicIssueDetails:
      'The asset adequacy considerations should stay separate from the reporting, review, and appendix benchmark material.',
    topicRecommendedAction:
      'Keep the page 3-5 slice review-only and do not widen it into the later reporting pages.',
    topicIssueMessage: 'The modeling slice should not absorb the reporting, review, and appendix benchmark material.',
    topicIssueEvidence:
      'Pages 3-5 contain the asset adequacy considerations, modeling expectations, fair value, reinsurance modeling, borrowing, and the sensitivity-test entry points.',
    topicValidationDetails: 'The selected page window captures the AG 53 modeling slice.',
  },
  {
    plannedBatchId: 'batch-167',
    batchSlug: 'ag53-167-reporting-review-appendix',
    sourceId: 'ag53-reporting-review-appendix',
    filename: 'AG 53-AAT as adopted by LATF-20220616.pdf',
    sourceTitle: 'Application of the Valuation Manual for Testing the Adequacy of Life Insurer Reserves',
    sourceReference: 'Actuarial Guideline AAT',
    batchTitle: 'reporting, review, templates, and appendix benchmark slice',
    pageWindow: [6, 7],
    sectionReference:
      'AG 53 pages 6-7: sensitivity attribution, reporting, review, templates, and Appendix I benchmark material.',
    citationText:
      'The documentation, sensitivity test results, and attribution analysis referenced above are to be incorporated as a separate, easily identifiable section of the actuarial memorandum required by VM-30 or as a standalone document.',
    summary:
      'AG 53 closes with sensitivity attribution, reporting, review, templates, and the appendix benchmark material.',
    keywords: [
      'AG 53',
      'Actuarial Guideline AAT',
      'reporting',
      'review',
      'templates',
      'Appendix I',
      'benchmark',
      'VAWG',
    ],
    notes:
      'Reporting and appendix slice; keep the page locators primary and treat line references as not expected for this PDF source.',
    sourceNotes: 'Active guidance; later guideline files remain out of scope for this wave.',
    reviewFlags: ['page_locator_primary', 'line_references_are_not_expected', 'reporting', 'review', 'templates', 'appendix'],
    reviewPacketNotes: 'AG 53 reporting and appendix slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the reporting and appendix slice and whether the benchmark table should stay grouped before moving on to the next guideline file.',
    flagType: 'reporting_boundary_caveat',
    flagMessage:
      'The reporting and appendix benchmark guidance should remain review-only until the final closeout boundary is confirmed.',
    topicIssueType: 'reporting_boundary',
    topicIssueDetails:
      'The reporting, review, and template guidance should stay separate from the earlier modeling material.',
    topicRecommendedAction:
      'Keep the page 6-7 slice review-only and treat it as the closing boundary for AG 53.',
    topicIssueMessage: 'The reporting slice should not absorb earlier AG 53 modeling material.',
    topicIssueEvidence:
      'Pages 6-7 contain the reporting, review, templates, and Appendix I benchmark material.',
    topicValidationDetails: 'The selected page window captures the AG 53 reporting and appendix slice.',
  },
]

export const ag53BatchDefinitions = Object.fromEntries(
  ag53BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg53Batch(spec)]),
)
