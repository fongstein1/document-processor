const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 48 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg48Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 48 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag48_reinsurance_opinion_memorandum',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 48 review-only batch: capture the reinsurance opinion/memorandum requirements and keep later guideline material out of the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 48 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 48 guideline slice is intentionally limited to ${spec.batchTitle} and keeps later guideline material out of the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 48 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 48 has an encoding-noisy text layer, so the text should stay review-only until the page image is confirmed.',
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
          'The page-image wording should be confirmed before anyone treats AG 48 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 48 text layer, so page locators should remain the primary anchor.',
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
          'Should AG 48 remain indexed as review-only guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page window remain a single review-only slice, or should later cleanup split the opening guidance from the security, method, opinion, and sunset context?',
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
          'The AG 48 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
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
        evidence:
          'The source is an encoded 12-page PDF and the text layer does not support stable line mapping.',
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
        checkId: 'ag48-page-window-coverage',
        status: 'passed',
        details: `The selected page window captures the planned AG 48 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 48 slice carries a source reference and a page locator.',
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
          'AG 48 slice retained as review-only guidance until the wording and later-guideline boundary are confirmed.',
      },
    ],
  }
}

const ag48BatchSpecs = [
  {
    plannedBatchId: 'batch-154',
    batchSlug: 'ag48-154-authority-scope',
    sourceId: 'ag48-reinsurance-authority-scope',
    filename:
      'AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuati.pdf',
    sourceTitle:
      'AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuation of Life Insurance Policies Model Regulation (Model 830)',
    sourceReference: 'Actuarial Guideline XLVIII',
    batchTitle: 'authority, scope, and reinsurance framing slice',
    pageWindow: [1, 4],
    sectionReference: 'AG 48 pages 1-4: title, authority, scope, and initial reinsurance framing.',
    citationText:
      'Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuation of Life Insurance Policies Model Regulation.',
    summary:
      'AG 48 explains the authority, scope, and initial reinsurance framing for the opinion and memorandum requirements and keeps the opening language review-only on pages 1-4.',
    keywords: ['AG 48', 'Actuarial Guideline XLVIII', 'reinsurance', 'authority', 'scope', 'Model 830'],
    notes:
      'Opening background / authority / scope window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the 2021 Law Manual reprint stays out of scope for this wave.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'authority_scope', 'reinsurance_scope'],
    reviewPacketNotes: 'AG 48 opening slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and keep the authority/scope framing separate from later reinsurance-method language.',
    flagType: 'authority_scope_caveat',
    flagMessage:
      'The opening authority, scope, and reinsurance framing should remain review-only until the page image is confirmed.',
    topicIssueType: 'authority_scope_boundary',
    topicIssueDetails:
      'The opening guidance and reinsurance framing should stay separate from the later security/method and opinion/memorandum sections.',
    topicRecommendedAction:
      'Keep the page 1-4 slice review-only and do not widen it into later AG 48 pages.',
    topicIssueMessage: 'The opening guidance should not absorb later AG 48 sections.',
    topicIssueEvidence: 'Pages 1-4 contain the authority, scope, and initial reinsurance framing.',
    topicValidationDetails: 'The selected pages capture the opening AG 48 authority/scope slice.',
  },
  {
    plannedBatchId: 'batch-155',
    batchSlug: 'ag48-155-security-method',
    sourceId: 'ag48-reinsurance-security-method',
    filename:
      'AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuati.pdf',
    sourceTitle:
      'AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuation of Life Insurance Policies Model Regulation (Model 830)',
    sourceReference: 'Actuarial Guideline XLVIII',
    batchTitle: 'security, primary-security, and actuarial-method slice',
    pageWindow: [5, 8],
    sectionReference: 'AG 48 pages 5-8: exemptions, definitions, primary security, and actuarial method.',
    citationText: 'AG 48 pages 5-8',
    summary:
      'AG 48 defines the reinsurance exemptions, primary security concepts, and actuarial method rules while staying review-only on pages 5-8.',
    keywords: [
      'AG 48',
      'Actuarial Guideline XLVIII',
      'reinsurance',
      'primary security',
      'actuarial method',
      'Model 785',
      'Model 787',
    ],
    notes:
      'Opening security / method window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the 2021 Law Manual reprint stays out of scope for this wave.',
    reviewFlags: [
      'ocr_text_layer',
      'page_image_backstop',
      'reinsurance_exemption',
      'primary_security',
      'actuarial_method',
    ],
    reviewPacketNotes: 'AG 48 security and method slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the primary-security wording and keep the security/method window separate from the opinion and memorandum requirements.',
    flagType: 'security_method_caveat',
    flagMessage:
      'The reinsurance exemptions, primary-security concepts, and actuarial-method guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'security_method_boundary',
    topicIssueDetails:
      'The exemptions, definitions, primary security, and actuarial-method material should stay separate from the opening authority/scope pages and the opinion/memorandum section.',
    topicRecommendedAction:
      'Keep the page 5-8 slice review-only and do not widen it into later AG 48 pages.',
    topicIssueMessage: 'The security/method window should not absorb later AG 48 sections.',
    topicIssueEvidence: 'Pages 5-8 contain the exemption, definition, primary-security, and actuarial-method text.',
    topicValidationDetails: 'The selected pages capture the AG 48 security and method slice.',
  },
  {
    plannedBatchId: 'batch-156',
    batchSlug: 'ag48-156-opinion-memorandum-sunset',
    sourceId: 'ag48-opinion-memorandum-sunset',
    filename:
      'AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuati.pdf',
    sourceTitle:
      'AG 48 - Actuarial Opinion and Memorandum Requirements for the Reinsurance of Policies Required to be Valued under Sections 6 and 7 of the NAIC Valuation of Life Insurance Policies Model Regulation (Model 830)',
    sourceReference: 'Actuarial Guideline XLVIII',
    batchTitle: 'opinion, memorandum, and sunset slice',
    pageWindow: [9, 12],
    sectionReference:
      'AG 48 pages 9-12: opinion and memorandum requirements, additional requirements, and sunset boundary.',
    citationText: 'AG 48 pages 9-12',
    summary:
      'AG 48 states the actuarial opinion and memorandum requirements, additional requirements, and the sunset boundary while staying review-only on pages 9-12.',
    keywords: ['AG 48', 'Actuarial Guideline XLVIII', 'actuarial opinion', 'memorandum', 'sunset', 'Model 830'],
    notes:
      'Closing opinion / memorandum / sunset window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the 2021 Law Manual reprint stays out of scope for this wave.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'opinion_memorandum', 'sunset_boundary'],
    reviewPacketNotes: 'AG 48 opinion and memorandum slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the opinion and memorandum wording and keep the sunset boundary separate from any later guideline cleanup.',
    flagType: 'opinion_memorandum_caveat',
    flagMessage:
      'The opinion, memorandum, and sunset guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'opinion_memorandum_boundary',
    topicIssueDetails:
      'The opinion and memorandum requirements should stay separate from the earlier reinsurance-method sections and from any later guideline cleanup.',
    topicRecommendedAction:
      'Keep the page 9-12 slice review-only and do not widen it beyond the sunset boundary.',
    topicIssueMessage: 'The closing guidance should not absorb later material.',
    topicIssueEvidence: 'Pages 9-12 contain the opinion, memorandum, additional-requirements, and sunset text.',
    topicValidationDetails: 'The selected pages capture the AG 48 opinion and memorandum slice.',
  },
]

export const ag48BatchDefinitions = Object.fromEntries(
  ag48BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg48Batch(spec)]),
)
