const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 47 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg47Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 47 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag47_claim_reserve_company_experience',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 47 review-only batch: capture the company-experience claim-reserve guideline and keep AG 48 outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 47 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 47 guideline slice is intentionally limited to ${spec.batchTitle} and keeps AG 48 outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 47 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 47 has an encoding-noisy text layer, so the text should stay review-only until the page image is confirmed.',
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
          'The page-image wording should be confirmed before anyone treats AG 47 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 47 text layer, so page locators should remain the primary anchor.',
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
          'Should AG 47 remain indexed as review-only guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page window remain a single review-only slice, or should a later cleanup split the background from the credibility and lag-period context?',
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
          'The AG 47 text layer is encoded, and the page-image wording should remain a visible review note.',
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
        checkId: 'ag47-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 47 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 47 slice carries a source reference and a page locator.',
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
          'AG 47 slice retained as review-only guidance until the wording and AG 48 boundary are confirmed.',
      },
    ],
  }
}

const ag47BatchSpecs = [
  {
    plannedBatchId: 'batch-153',
    batchSlug: 'ag47-153-claim-reserve-company-experience',
    sourceId: 'ag47-group-ltd-claim-reserves',
    filename:
      'AG 47 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2012 Group Long-Term Disability Valuation Table.pdf',
    sourceTitle:
      'AG 47 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2012 Group Long-Term Disability Valuation Table',
    sourceReference: 'Actuarial Guideline XLVII',
    batchTitle: 'claim-reserve company-experience slice',
    pageWindow: [1, 4],
    sectionReference:
      'AG 47 pages 1-4: background, company-experience claim-reserve calculation, credibility, and lag-period framing.',
    citationText:
      'The 2012 Group Long-Term Disability (GLTD) Valuation Table, as included in the Health Insurance Reserves Model Regulation (#10), is the valuation standard to replace the Commissioner\'s Group Disability Table 1987 (CGDT87 Table) with a new one based on the GLTD 2008 Table.',
    summary:
      'AG 47 explains how company experience can be used in the calculation of claim reserves under the 2012 GLTD valuation table and keeps the credibility and lag-period language review-only on pages 1-4.',
    keywords: [
      'AG 47',
      'Actuarial Guideline XLVII',
      'group long-term disability',
      'claim reserves',
      'company experience',
      'credibility',
    ],
    notes:
      'Opening background / calculation / credibility / lag-period window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 48 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'claim_reserve_calculation', 'credibility', 'lag_period'],
    reviewPacketNotes: 'Claim-reserve company-experience slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and whether any later cleanup should isolate additional credibility or lag-period context before expanding the source.',
    flagType: 'claim_reserve_caveat',
    flagMessage:
      'The opening claim-reserve, credibility, and lag-period guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'claim_reserve_boundary',
    topicIssueDetails:
      'The opening guidance and calculation context should stay separate from any later guideline or companion material.',
    topicRecommendedAction:
      'Keep the page 1-4 slice review-only and do not widen it into AG 48.',
    topicIssueMessage:
      'The opening guidance should not absorb any later source.',
    topicIssueEvidence:
      'Pages 1-4 contain the background, claim-reserve calculation, credibility, and lag-period text.',
    topicValidationDetails:
      'The selected pages capture the opening AG 47 guidance slice.',
  },
]

export const ag47BatchDefinitions = Object.fromEntries(
  ag47BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg47Batch(spec)]),
)
