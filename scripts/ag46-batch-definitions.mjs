const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 46 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg46Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 46 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag46_segment_length_interpretation',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 46 review-only batch: capture the segment-length interpretation guideline and keep AG 47 outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ?? 'Batch remains review-only. AG 46 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 46 guideline slice is intentionally limited to ${spec.batchTitle} and keeps AG 47 outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 46 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 46 has an encoding-noisy text layer, so the text should stay review-only until the page image is confirmed.',
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
          'The page-image wording should be confirmed before anyone treats AG 46 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 46 text layer, so page locators should remain the primary anchor.',
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
          'Should AG 46 remain indexed as review-only guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page window remain a single review-only slice, or should a later cleanup split the opening guidance from the recalculation boundary?',
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
          'The AG 46 text layer is encoded, and the page-image wording should remain a visible review note.',
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
        evidence: 'The source is an encoded 3-page PDF and the text layer does not support stable line mapping.',
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
        checkId: 'ag46-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 46 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 46 slice carries a source reference and a page locator.',
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
          'AG 46 slice retained as review-only guidance until the wording and AG 47 boundary are confirmed.',
      },
    ],
  }
}

const ag46BatchSpecs = [
  {
    plannedBatchId: 'batch-152',
    batchSlug: 'ag46-152-scope-recalculation',
    sourceId: 'ag46-segment-length-interpretation',
    filename:
      'AG 46 - Interpretation of the Calculation of the Segment Length with Respect to the Life Insurance Policies Model Regulation Upon a Change in the Valu.pdf',
    sourceTitle:
      'AG 46 - Interpretation of the Calculation of the Segment Length with Respect to the Life Insurance Policies Model Regulation Upon a Change in the Valuation Mortality Rates Subsequent to Issue',
    sourceReference: 'Actuarial Guideline XLVI',
    batchTitle: 'scope and recalculation slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 46 pages 1-2: scope, background, calculation context, and segment-length framing.',
    citationText:
      "Some states have revised their regulation permitting the use of the 2001 CSO Preferred Class Structure Mortality Table so that, at the company's option, it may be used to value a policy on a plan that was previously approved for issue based on valuation using the 2001 CSO Mortality Table.",
    summary:
      'AG 46 interprets the calculation of segment length when valuation mortality rates change after issue and keeps the guidance review-only on pages 1-2.',
    keywords: [
      'AG 46',
      'Actuarial Guideline XLVI',
      'segment length interpretation',
      'valuation mortality rates',
      'change after issue',
      'recalculation',
    ],
    notes:
      'Opening background / formula / recalculation window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 47 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'scope_formula_context', 'recalculation_boundary'],
    reviewPacketNotes: 'Scope, formula, and recalculation slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and whether any later batch should isolate additional recalculation context before expanding the source.',
    flagType: 'scope_formula_caveat',
    flagMessage:
      'The opening scope, formula, and recalculation guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'recalculation_boundary',
    topicIssueDetails:
      'The opening guidance and recalculation context should stay separate from any later guideline or companion material.',
    topicRecommendedAction:
      'Keep the page 1-2 slice review-only and do not widen it into AG 47.',
    topicIssueMessage:
      'The opening guidance should not absorb any later source.',
    topicIssueEvidence:
      'Pages 1-2 contain the scope, background, formula language, and recalculation text.',
    topicValidationDetails:
      'The selected pages capture the opening AG 46 guidance slice.',
  },
]

export const ag46BatchDefinitions = Object.fromEntries(
  ag46BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg46Batch(spec)]),
)
