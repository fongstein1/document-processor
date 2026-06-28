const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 49 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg49Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 49 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag49_index_based_interest',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 49 review-only batch: capture the index-based-interest illustration guidance and keep AG 50 outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 49 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 49 guideline slice is intentionally limited to ${spec.batchTitle} and keeps AG 50 outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 49 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 49 has an encoding-noisy text layer, so the text should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the guideline text is encoding-noisy and line references are not expected.',
        notes: 'Keep the image backstop visible as a review note.',
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
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 49 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 49 text layer, so page locators should remain the primary anchor.',
        recommendedAction:
          'Keep the page locator and page-image wording backstop visible instead of overclaiming exact line wording.',
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
          'Should AG 49 remain indexed as review-only guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page window remain a single review-only slice, or should later cleanup split the opening guidance from the mechanics and disclosure context?',
        whyItMatters: 'The page window controls how much context is exposed in the review packet.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-page-image-confirmation`,
        severity: 'medium',
        issueType: 'page_image_confirmation',
        sourceId,
        itemId,
        message:
          'The AG 49 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence: 'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-line-reference-unavailable`,
        severity: 'low',
        issueType: 'line_reference_unavailable',
        sourceId,
        itemId,
        message:
          'Stable line references are not expected, so page locators should remain the primary review anchor.',
        recommendedAction:
          'Keep the page locator and page-image wording backstop visible instead of overclaiming exact line wording.',
        evidence: 'The source is an encoded 4-page PDF and the text layer does not support stable line mapping.',
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
        checkId: 'ag49-page-window-coverage',
        status: 'passed',
        details: `The selected page window captures the planned AG 49 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 49 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'line-reference-unavailable',
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
          'AG 49 slice retained as review-only guidance until the wording and AG 50 boundary are confirmed.',
      },
    ],
  }
}

const ag49BatchSpecs = [
  {
    plannedBatchId: 'batch-157',
    batchSlug: 'ag49-157-background-applicability-definitions',
    sourceId: 'ag49-background-applicability',
    filename:
      'AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest.pdf',
    sourceTitle:
      'AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest',
    sourceReference: 'Actuarial Guideline XLIX',
    batchTitle: 'background, applicability, and opening definitions slice',
    pageWindow: [1, 1],
    sectionReference: 'AG 49 page 1: background, effective dates, scope, and opening definitions.',
    citationText: 'This guideline provides uniform guidance for policies with index-based interest.',
    summary:
      'AG 49 explains why uniform guidance is needed for index-based-interest policies and sets the effective dates, scope, and opening definitions that frame the illustration rules.',
    keywords: ['AG 49', 'Actuarial Guideline XLIX', 'background', 'effective date', 'scope', 'definitions', 'Model 582'],
    notes:
      'Opening background / effective-date / scope window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 50 remains out of scope for this wave.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'effective_date', 'scope', 'definitions'],
    reviewPacketNotes: 'AG 49 opening slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and whether the opening definitions should stay grouped with later benchmark-index setup before expanding the source.',
    flagType: 'opening_scope_caveat',
    flagMessage:
      'The opening guidance, effective dates, scope, and definitions should remain review-only until the page image is confirmed.',
    topicIssueType: 'opening_scope_boundary',
    topicIssueDetails:
      'The opening guidance and definitions should stay separate from the later benchmark-account and disclosure sections.',
    topicRecommendedAction:
      'Keep the page 1 slice review-only and do not widen it into the later AG 49 pages.',
    topicIssueMessage: 'The opening guidance should not absorb later AG 49 sections.',
    topicIssueEvidence: 'Page 1 contains the background, effective-date, scope, and opening definitions text.',
    topicValidationDetails: 'The selected page captures the opening AG 49 guidance slice.',
  },
  {
    plannedBatchId: 'batch-158',
    batchSlug: 'ag49-158-benchmark-account-current-scale-policy-loans',
    sourceId: 'ag49-benchmark-account-current-scale',
    filename:
      'AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest.pdf',
    sourceTitle:
      'AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest',
    sourceReference: 'Actuarial Guideline XLIX',
    batchTitle: 'benchmark account, disciplined current scale, and policy-loan slice',
    pageWindow: [2, 3],
    sectionReference:
      'AG 49 pages 2-3: benchmark-index account rules, disciplined current scale, policy loans, and opening additional standards.',
    citationText:
      'If the insurer offers an applicable Benchmark Index Account with the illustrated policy, the illustration actuary shall use the current annual cap for the applicable Benchmark Index Account in 7.A.',
    summary:
      'AG 49 limits the illustrated scale and disciplined current scale with benchmark-index account rules, addresses policy loans, and begins the additional standards section.',
    keywords: ['AG 49', 'benchmark index account', 'disciplined current scale', 'policy loans', 'additional standards', 'annual cap'],
    notes:
      'Opening mechanics / scale / policy-loan window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 50 remains out of scope for this wave.',
    reviewFlags: [
      'ocr_text_layer',
      'page_image_backstop',
      'benchmark_index_account',
      'disciplined_current_scale',
      'policy_loan',
      'additional_standards',
    ],
    reviewPacketNotes: 'AG 49 benchmark-account and scale slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the benchmark-account and policy-loan wording and whether the opening additional-standards context needs a later cleanup slice before widening the source.',
    flagType: 'benchmark_scale_caveat',
    flagMessage:
      'The benchmark-index account, disciplined current scale, policy-loan, and opening additional-standards guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'benchmark_scale_boundary',
    topicIssueDetails:
      'The benchmark-index account rules and policy-loan material should stay separate from the opening guidance and the closing alternate-scale disclosures.',
    topicRecommendedAction:
      'Keep the page 2-3 slice review-only and do not widen it into AG 49 page 4.',
    topicIssueMessage: 'The benchmark-account and scale window should not absorb the page-4 closing material.',
    topicIssueEvidence:
      'Pages 2-3 contain the benchmark-index account rules, disciplined current scale, policy-loan limits, and opening additional standards.',
    topicValidationDetails: 'The selected pages capture the AG 49 benchmark-account and scale slice.',
  },
  {
    plannedBatchId: 'batch-159',
    batchSlug: 'ag49-159-alternate-scale-disclosures',
    sourceId: 'ag49-alternate-scale-disclosures',
    filename:
      'AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest.pdf',
    sourceTitle:
      'AG 49 - The Application of the Life Illustrations Model Regulation to Policies With Index-Based Interest',
    sourceReference: 'Actuarial Guideline XLIX',
    batchTitle: 'alternate scale, disclosure tables, and closing boundary slice',
    pageWindow: [4, 4],
    sectionReference: 'AG 49 page 4: alternate scale, disclosure tables, and closing boundary.',
    citationText: 'A ledger using the Alternate Scale shall be shown alongside the ledger using the illustrated scale with equal prominence.',
    summary:
      'AG 49 closes with alternate-scale display requirements and disclosure tables comparing credited rates and historical index changes.',
    keywords: ['AG 49', 'alternate scale', 'disclosure tables', 'equal prominence', 'historical index changes', 'closing boundary'],
    notes:
      'Closing alternate-scale / disclosure window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 50 remains out of scope for this wave.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'alternate_scale', 'disclosure_tables', 'closing_boundary'],
    reviewPacketNotes: 'AG 49 alternate-scale disclosure slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the closing disclosure wording and whether any later cleanup should isolate extra disclosure context before moving to AG 50.',
    flagType: 'alternate_scale_caveat',
    flagMessage:
      'The alternate-scale ledger and disclosure-table guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'alternate_scale_boundary',
    topicIssueDetails:
      'The closing alternate-scale disclosures should stay separate from the earlier benchmark-account and current-scale material.',
    topicRecommendedAction:
      'Keep the page 4 slice review-only and treat it as the closing boundary before AG 50.',
    topicIssueMessage: 'The closing disclosure slice should not absorb later AG 50 material.',
    topicIssueEvidence: 'Page 4 contains the alternate-scale ledger and disclosure-table text.',
    topicValidationDetails: 'The selected page captures the AG 49 closing alternate-scale slice.',
  },
]

export const ag49BatchDefinitions = Object.fromEntries(
  ag49BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg49Batch(spec)]),
)
