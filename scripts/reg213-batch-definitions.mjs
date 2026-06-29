const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const sourceTitle = 'Regulation 213'
const sourceReference = '11 NYCRR Part 103 (Insurance Regulation 213)'
const defaultNonLearnerNotes =
  'Regulation 213 stays review-only. Keep page locators primary, treat the OCR layer cautiously, and do not promote any item.'

const makeReg213Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 213 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_213_principle_based_reserving',
    processingIntentText:
      spec.processingIntentText ??
      'Small NY Regulation 213 review-only batch: capture the regulation slice and keep later pages outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. Regulation 213 is retained as review-only regulatory text and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This Regulation 213 slice is intentionally limited to ${spec.batchTitle} and keeps the next section outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small NY Regulation 213 batch. Keep the work review-first, preserve page locators, treat OCR cautiously, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'page_locator_primary',
        message:
          'Regulation 213 should stay page-locator anchored because the OCR text layer is noisy and page images are the backstop.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image-backstop`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'page_image_wording_backstop',
        message:
          'The wording should be confirmed against the page image before anyone treats the text as exact.',
        notes: 'Keep the page-image backstop visible as a review note.',
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
          'Page locators should remain the primary anchor for Regulation 213 because the source has a noisy OCR text layer.',
        recommendedAction:
          'Keep the planned page window together and preserve the locator in the review packet.',
      },
      {
        issueId: `citation-${sourceId}-page-image-backstop`,
        sourceId,
        itemId,
        issueType: 'page_image_wording_backstop',
        details:
          'The wording should be confirmed against the page image before anyone treats the text as exact.',
        recommendedAction:
          'Keep the page image wording backstop visible and avoid overclaiming exact wording from the OCR layer.',
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
          'Should Regulation 213 remain indexed as active review-only regulatory guidance, or should it later be linked only as context if later amendment-history material supersedes it?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page-window split remain the canonical regeneration boundary, or should later cleanup rebalance the opening, middle, and closing sections?',
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
          'The Regulation 213 slice should remain anchored by page locators because the OCR layer is noisy.',
        recommendedAction:
          'Keep the page locator visible instead of overclaiming exact line wording.',
        evidence:
          'The source is a PDF and the controlled runner should preserve page-level references for this source family.',
      },
      {
        issueId: `issue-${sourceId}-page-image-backstop`,
        severity: 'medium',
        issueType: 'page_image_wording_backstop',
        sourceId,
        itemId,
        message:
          'The wording should be confirmed against the page image before anyone treats the OCR text as exact.',
        recommendedAction:
          'Keep the page-image backstop visible and avoid overclaiming exact wording from the OCR layer.',
        evidence:
          'Regulation 213 is a text-based PDF source with a noisy OCR layer and page-image wording should be treated as the backstop.',
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
        checkId: 'reg213-page-window-coverage',
        status: 'passed',
        details: `The selected page window captures the planned Regulation 213 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The Regulation 213 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet keeps the page-image wording backstop visible because the OCR layer is noisy.',
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
        documentType: 'ny_regulation',
        sourceTitle,
        sourceReference,
        versionDate: 'unknown',
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
        authorityLevel: 'regulation',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'Regulation 213 slice retained as review-only regulatory text until the wording and boundary are confirmed.',
      },
    ],
  }
}

const reg213BatchSpecs = [
  {
    plannedBatchId: 'batch-189',
    batchSlug: 'reg213-189-opening-scope-definitions',
    sourceId: 'reg213-opening-scope-definitions',
    filename: '2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-213-11-NYCRR-S103.pdf',
    sourceTitle: 'Regulation 213',
    sourceReference: '11 NYCRR Part 103 (Insurance Regulation 213)',
    batchTitle: 'opening title, scope, applicability, and early definitions slice',
    pageWindow: [1, 9],
    sectionReference: 'Opening title, scope, applicability, and early definitions',
    citationText: 'Regulation 213 opening title, scope, applicability, and early definitions.',
    summary:
      'Opening pages establish the regulation frame and early definitions for Regulation 213, while the noisy OCR text layer should remain page-image-backed.',
    keywords: ['Reg 213', 'state regulation', 'scope', 'applicability', 'definitions', 'New York', 'page-image backstop'],
    notes: 'Opening title/scope/definitions slice; keep the rest of the file out of the batch.',
    sourceNotes: 'Pages 1-9 only; opening regulation frame.',
    reviewPacketNotes: 'Keep the opening regulatory frame separate from the middle requirements.',
    nextStep:
      'Move to core requirements and control language at pages 10-18 while keeping the opening window narrow.',
    flagType: 'opening_boundary',
    flagMessage: 'The opening title, scope, applicability, and early definitions slice should remain review-only.',
    topicIssueType: 'opening_boundary',
    topicIssueDetails:
      'The opening material should stay separate from the later core requirements and closing boundary.',
    topicRecommendedAction: 'Preserve the opening window and stop before the middle requirements begin.',
    topicIssueMessage:
      'The opening title, scope, applicability, and early definitions slice should remain separate from the core requirements.',
    topicIssueEvidence:
      'Pages 1-9 contain the opening regulatory frame and early definitions for Regulation 213.',
    topicValidationDetails:
      'The opening window stayed confined to the planned page range and the OCR layer stayed page-image-backed.',
    reviewFlags: ['text_source', 'page_locator_primary', 'page_image_wording_backstop', 'state_regulation', 'jurisdiction_specific_requirement', 'regulatory_requirement'],
  },
  {
    plannedBatchId: 'batch-190',
    batchSlug: 'reg213-190-core-requirements-control-language',
    sourceId: 'reg213-core-requirements-control-language',
    filename: '2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-213-11-NYCRR-S103.pdf',
    sourceTitle: 'Regulation 213',
    sourceReference: '11 NYCRR Part 103 (Insurance Regulation 213)',
    batchTitle: 'core requirements and control language slice',
    pageWindow: [10, 18],
    sectionReference: 'Core requirements, control language, and middle-file governance / reporting material',
    citationText: 'Regulation 213 core requirements and control language.',
    summary:
      'The middle pages carry the core regulatory directives, control language, and any filing or governance material, while the OCR layer remains noisy enough to keep the page-image backstop visible.',
    keywords: ['Reg 213', 'core requirements', 'governance', 'reporting', 'documentation', 'New York', 'page-image backstop'],
    notes: 'Core requirements and control language slice; keep the opening and closing slices out of the batch.',
    sourceNotes: 'Pages 10-18 only; middle requirements and control language.',
    reviewPacketNotes: 'Keep the middle requirements separate from the opening pages and the closing boundary.',
    nextStep:
      'Move to closing requirements and end-of-source boundary at pages 19-27 while keeping the middle window narrow.',
    flagType: 'middle_boundary',
    flagMessage: 'The core requirements and control language slice should remain review-only.',
    topicIssueType: 'middle_boundary',
    topicIssueDetails:
      'The core requirements should stay separate from the opening and closing sections of the regulation.',
    topicRecommendedAction: 'Preserve the middle window and stop before the closing requirements begin.',
    topicIssueMessage:
      'The core requirements and control language slice should remain separate from the opening and closing sections.',
    topicIssueEvidence:
      'Pages 10-18 contain the middle-file regulatory directives and control language.',
    topicValidationDetails:
      'The middle window stayed confined to the planned page range and remained page-image-backed.',
    reviewFlags: ['text_source', 'page_locator_primary', 'page_image_wording_backstop', 'state_regulation', 'jurisdiction_specific_requirement', 'regulatory_requirement'],
  },
  {
    plannedBatchId: 'batch-191',
    batchSlug: 'reg213-191-closing-boundary',
    sourceId: 'reg213-closing-boundary',
    filename: '2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-213-11-NYCRR-S103.pdf',
    sourceTitle: 'Regulation 213',
    sourceReference: '11 NYCRR Part 103 (Insurance Regulation 213)',
    batchTitle: 'closing requirements and end-of-source boundary slice',
    pageWindow: [19, 27],
    sectionReference: 'Closing requirements and the end-of-source boundary',
    citationText: 'Regulation 213 closing requirements and end-of-source boundary.',
    summary:
      'The final pages carry the closing regulatory requirements and end the source at page 27, while amendment-history files in the folder remain out of scope for this wave.',
    keywords: ['Reg 213', 'closing boundary', 'records', 'retention', 'New York', 'page-image backstop'],
    notes: 'Closing requirements and boundary slice; keep amendment-history files out of the batch.',
    sourceNotes: 'Pages 19-27 only; closing requirements and end-of-source boundary.',
    reviewPacketNotes: 'Keep the closing requirements separate from the amendment-history files in the folder.',
    nextStep:
      'Confirm that the source ends at page 27 and keep any amendment / FAQ files out of scope for this wave.',
    flagType: 'closing_boundary',
    flagMessage: 'The closing requirements and end-of-source boundary slice should remain review-only.',
    topicIssueType: 'closing_boundary',
    topicIssueDetails:
      'The closing requirements should stay separate from any amendment-history file in the same folder.',
    topicRecommendedAction: 'Preserve the closing boundary and do not widen into the amendment files.',
    topicIssueMessage:
      'The closing requirements and end-of-source boundary slice should remain separate from any amendment-history file in the same folder.',
    topicIssueEvidence:
      'Pages 19-27 contain the closing requirements and the end-of-source boundary.',
    topicValidationDetails:
      'The closing window stayed confined to the planned page range and ended at page 27.',
    reviewFlags: ['text_source', 'page_locator_primary', 'page_image_wording_backstop', 'state_regulation', 'jurisdiction_specific_requirement', 'regulatory_requirement'],
  },
]

export const reg213BatchDefinitions = Object.fromEntries(
  reg213BatchSpecs.map((spec) => {
    const batch = makeReg213Batch(spec)
    return [spec.plannedBatchId, batch]
  }),
)
