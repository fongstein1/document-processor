const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 44 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg44Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 44 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag44_group_term_life_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 44 review-only batch: capture the group-term-life waiver-of-premium slice and keep AG 45 outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ?? 'Batch remains review-only. AG 44 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 44 guideline slice is intentionally limited to ${spec.batchTitle} and keeps AG 45 outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 44 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 44 has an encoding-noisy text layer, so the text should stay review-only until the page image is confirmed.',
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
          'The page-image wording should be confirmed before anyone treats AG 44 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 44 text layer, so page locators should remain the primary anchor.',
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
          'Should AG 44 remain indexed as review-only group-term-life guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page window remain a single review-only slice, or should a later cleanup split the background from the attachment tables?',
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
          'The AG 44 text layer is encoded, and the page-image wording should remain a visible review note.',
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
        evidence: 'The source is an encoded 7-page PDF and the text layer does not support stable line mapping.',
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
        checkId: 'ag44-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 44 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 44 slice carries a source reference and a page locator.',
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
          'AG 44 slices retained as review-only guidance until the wording and AG 45 boundary are confirmed.',
      },
    ],
  }
}

const ag44BatchSpecs = [
  {
    plannedBatchId: 'batch-149',
    batchSlug: 'ag44-149-background-scope-experience',
    sourceId: 'ag44-background-scope-experience',
    filename: 'AG 44 - Group Term Life Waiver of Premium Disabled Lives Reserves.pdf',
    sourceTitle: 'AG 44 - Group Term Life Waiver of Premium Disabled Lives Reserves',
    sourceReference: 'Actuarial Guideline XLIV',
    batchTitle: 'background, scope, definitions, and reserve-calculation opener slice',
    pageWindow: [1, 3],
    sectionReference:
      'AG 44 pages 1-3: background, scope, definitions, company experience, and the reserve-calculation opener.',
    citationText:
      'The purpose of this Actuarial Guideline (Guideline) is to determine the minimum standard of valuation for group term life waiver of premium disabled life benefits and to recognize the 2005 Group Term Life Waiver (GTLW) Mortality and Recovery Tables.',
    summary:
      'AG 44 opens with the valuation purpose, scope, definitions, and company-experience guidance for group term life waiver of premium disabled life reserves.',
    keywords: [
      'AG 44',
      'Actuarial Guideline XLIV',
      'group term life',
      'waiver of premium',
      'disabled life reserves',
      'scope',
      'definitions',
      'company experience',
    ],
    notes:
      'Opening background / scope / definitions window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 45 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'scope_definitions', 'reserve_method_context'],
    reviewPacketNotes: 'Background, scope, and company-experience slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and whether the attachment tables should remain split from the opening guidance.',
    flagType: 'scope_experience_caveat',
    flagMessage:
      'The opening background, scope, and company-experience guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'scope_boundary',
    topicIssueDetails:
      'The opening guidance and company-experience material should stay separate from the attachment tables.',
    topicRecommendedAction:
      'Keep the page 1-3 slice review-only and do not widen it into pages 4-7.',
    topicIssueMessage:
      'The opening guidance should not absorb the attachment tables.',
    topicIssueEvidence:
      'Pages 1-3 contain the opening background, scope, definitions, company-experience review, and reserve-calculation opener.',
    topicValidationDetails:
      'The selected pages capture the opening AG 44 background and company-experience slice.',
  },
  {
    plannedBatchId: 'batch-150',
    batchSlug: 'ag44-150-attachment-tables',
    sourceId: 'ag44-attachment-tables',
    filename: 'AG 44 - Group Term Life Waiver of Premium Disabled Lives Reserves.pdf',
    sourceTitle: 'AG 44 - Group Term Life Waiver of Premium Disabled Lives Reserves',
    sourceReference: 'Actuarial Guideline XLIV',
    batchTitle: 'attachment tables and closing boundary slice',
    pageWindow: [4, 7],
    sectionReference:
      'AG 44 pages 4-7: Attachment A-D mortality and recovery tables and the closing boundary.',
    citationText:
      'ATTACHMENT A 2005 GTLW Mortality and Recovery Tables Graduated Death Rates (1,000Q[X]) Select Period (duration 9 months to 10 years) MALES...',
    summary:
      'AG 44 attachments A-D present the GTLW mortality and recovery tables that support the disabled-life reserve calculation.',
    keywords: [
      'AG 44',
      'attachment A',
      'attachment B',
      'attachment C',
      'attachment D',
      'mortality table',
      'recovery table',
      'disabled life reserves',
    ],
    notes:
      'Attachment-table window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; AG 45 remains out of scope.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'mortality_tables', 'table_heavy'],
    reviewPacketNotes: 'Attachment tables and closing boundary slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the table headings and stop cleanly at the AG 45 boundary.',
    flagType: 'table_attachment_backstop',
    flagMessage:
      'The attachment tables should remain review-only until the page image is confirmed.',
    topicIssueType: 'table_boundary',
    topicIssueDetails:
      'The attachment tables should stay separate from the opening background and stop cleanly at the end of the file.',
    topicRecommendedAction:
      'Keep the page 4-7 slice review-only and do not widen it beyond the closing boundary.',
    topicIssueMessage:
      'The attachment tables should not bleed into AG 45.',
    topicIssueEvidence:
      'Pages 4-7 contain Attachment A-D mortality and recovery tables and the closing boundary before AG 45.',
    topicValidationDetails:
      'The selected pages capture the attachment tables and closing boundary slice.',
  },
]

export const ag44BatchDefinitions = Object.fromEntries(
  ag44BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg44Batch(spec)]),
)
