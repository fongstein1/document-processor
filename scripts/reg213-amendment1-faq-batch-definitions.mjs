const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const sourceTitle = 'Regulation 213 Amendment No. 1 FAQ'
const sourceReference =
  'New York State Department of Financial Services Life Bureau Guidance Note (July 21, 2020)'
const defaultNonLearnerNotes =
  'FAQ guidance is companion-only. Keep page locators primary, treat the note as non-binding implementation context, and do not promote any item.'

const makeReg213Amendment1FaqBatch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 213 Amendment No. 1 FAQ controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_213_amendment_1_faq',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only FAQ slice so the companion guidance stays narrow and reviewable.`,
    processingIntentNotes:
      spec.processingIntentNotes ??
      'FAQ workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText:
      spec.batchSummaryText ??
      `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This FAQ slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small Reg 213 FAQ batch. Keep the work review-first, preserve the page locator, treat the FAQ as companion-only, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'page_locator_primary',
        message:
          'The FAQ should stay page-locator anchored because the text layer is readable but the wrapped Q&A formatting can still mislead exact wording.',
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
          'Page locators should remain the primary anchor for the FAQ because the source is a PDF guidance note with wrapped Q&A formatting.',
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
          'Keep the page image wording backstop visible and avoid overclaiming exact wording from the text layer.',
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
          'Should the Regulation 213 FAQ remain indexed as companion-only guidance linked to the core regulation, or should a later cleanup step group it with a broader amendment-history wave?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page-window split remain the canonical regeneration boundary, or should later cleanup rebalance the opening, middle, and closing question groups?',
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
          'The FAQ slice should remain anchored by page locators because the wrapped Q&A text can make exact wording easy to overread.',
        recommendedAction: 'Keep the page locator visible instead of overclaiming exact wording.',
        evidence:
          'The source is a PDF guidance note and the controlled runner should preserve page-level references for this source family.',
      },
      {
        issueId: `issue-${sourceId}-page-image-backstop`,
        severity: 'medium',
        issueType: 'page_image_wording_backstop',
        sourceId,
        itemId,
        message:
          'The wording should be confirmed against the page image before anyone treats the text as exact.',
        recommendedAction:
          'Keep the page-image backstop visible and avoid overclaiming exact wording from the text layer.',
        evidence:
          'The FAQ is a text-based PDF guidance note with page-image wording available as the backstop.',
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
        details: 'Controlled manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: spec.validationCheckId,
        status: 'passed',
        details: spec.validationCheckDetails,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The selected page carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details:
          'The review packet keeps the page-image wording backstop visible because the FAQ text can still wrap awkwardly.',
      },
      {
        checkId: 'companion-guidance-caveat-tracked',
        status: 'passed',
        details:
          'The review packet keeps the companion-only, non-binding guidance caveat visible for this FAQ source.',
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
        documentType: 'regulatory_guidance',
        sourceTitle,
        sourceReference,
        versionDate: '2020-07-21',
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
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: defaultNonLearnerNotes,
      },
    ],
  }
}

const reg213Amendment1FaqBatchSpecs = [
  {
    plannedBatchId: 'batch-245',
    batchSlug: 'reg213-amendment1-faq-245-opening-caveats',
    sourceId: 'reg213-amendment1-faq-opening-caveats',
    filename: 'Reg-213-11-NYCRR-S103-Amendment-1-FAQ.pdf',
    sourceTitle: 'Regulation 213 Amendment No. 1 FAQ',
    sourceReference: 'New York State Department of Financial Services Life Bureau Guidance Note (July 21, 2020)',
    batchTitle: 'opening guidance, caveats, and early implementation slice',
    pageWindow: [1, 1],
    sectionReference: 'Opening guidance note, disclaimer language, and early implementation questions',
    citationText: 'The Department has compiled the following list of frequently asked questions.',
    summary:
      'The opening page sets out the guidance note caveat and answers the small company exemption, phase-in, deferral request, and timing questions while keeping the note companion-only.',
    keywords: [
      'Reg 213',
      'DFS',
      'guidance note',
      'small company exemption',
      'phase-in',
      'deferral request',
      'New York',
    ],
    notes: 'Opening caveat and implementation slice; keep the rest of the FAQ out of the batch.',
    sourceNotes: 'Page 1 only; opening guidance note and early questions.',
    reviewPacketNotes: 'Keep the opening FAQ caveat separate from the methodology and closeout pages.',
    nextStep:
      'Move to the grading-methodology and reserve-structure guidance at page 2 while keeping the opening page narrow.',
    flagType: 'opening_guidance_slice',
    flagMessage:
      'The opening guidance and early implementation questions should remain review-only as companion guidance.',
    topicIssueType: 'opening_guidance_boundary',
    topicIssueDetails:
      'The opening page should stay separate from the later grading-methodology and closeout questions.',
    topicRecommendedAction: 'Preserve the opening page and stop before the methodology page begins.',
    topicIssueMessage:
      'The opening guidance and early implementation questions should remain separate from the later FAQ pages.',
    topicIssueEvidence: 'Page 1 contains the guidance note caveat and the early implementation questions.',
    topicValidationDetails: 'The opening page stayed confined to the planned page range and kept the caveat visible.',
    validationCheckId: 'reg213-amendment1-faq-opening-guidance-coverage',
    validationCheckDetails: 'The opening page stayed confined to the planned page range and kept the caveat visible.',
    reviewFlags: [
      'caveat_or_companion_guidance',
      'jurisdiction_specific_requirement',
      'reporting_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the opening guidance note, caveat language, and early implementation questions as a narrow review-only FAQ slice.',
  },
  {
    plannedBatchId: 'batch-246',
    batchSlug: 'reg213-amendment1-faq-246-methodology',
    sourceId: 'reg213-amendment1-faq-methodology',
    filename: 'Reg-213-11-NYCRR-S103-Amendment-1-FAQ.pdf',
    sourceTitle: 'Regulation 213 Amendment No. 1 FAQ',
    sourceReference: 'New York State Department of Financial Services Life Bureau Guidance Note (July 21, 2020)',
    batchTitle: 'grading methodology and reporting slice',
    pageWindow: [2, 2],
    sectionReference: 'Grading methodology and reporting / reserve-structure questions',
    citationText:
      'The Department does not intend to amend Regulation 213 to allow companies to use the NAIC grading methodology.',
    summary:
      'The middle page addresses the NAIC grading methodology, valuation-interest-rate publication, VM-20 supplement blanks, the AOMR question, Regulation 126, and deficiency reserves while keeping the FAQ companion-only.',
    keywords: [
      'Reg 213',
      'grading methodology',
      'VM-20',
      'Regulation 126',
      'deficiency reserves',
      'valuation interest rate',
      'New York',
    ],
    notes: 'Methodology and reporting slice; keep the opening and closing pages out of the batch.',
    sourceNotes: 'Page 2 only; methodology and reserve-structure answers.',
    reviewPacketNotes: 'Keep the middle methodology answers separate from the opening and closing FAQ pages.',
    nextStep:
      'Move to the later-adoption and phase-in reporting questions on page 3 while keeping the methodology page narrow.',
    flagType: 'methodology_guidance_slice',
    flagMessage:
      'The grading methodology and reserve-structure answers should remain review-only as companion guidance.',
    topicIssueType: 'methodology_boundary',
    topicIssueDetails:
      'The methodology page should stay separate from the opening caveat page and the closing adoption page.',
    topicRecommendedAction: 'Preserve the methodology page and stop before the closeout page begins.',
    topicIssueMessage:
      'The grading methodology and reserve-structure answers should remain separate from the opening and closeout FAQ pages.',
    topicIssueEvidence: 'Page 2 contains the grading methodology, rate publication, supplement, and reserve questions.',
    topicValidationDetails: 'The middle page stayed confined to the planned page range and kept the caveat visible.',
    validationCheckId: 'reg213-amendment1-faq-methodology-coverage',
    validationCheckDetails: 'The middle page stayed confined to the planned page range and kept the caveat visible.',
    reviewFlags: [
      'caveat_or_companion_guidance',
      'regulatory_requirement',
      'reporting_requirement',
      'documentation_expectation',
      'cross_reference_mapping',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the grading methodology, publication, supplement, AOMR, Reg 126, and deficiency-reserve guidance as one review-only FAQ slice.',
  },
  {
    plannedBatchId: 'batch-247',
    batchSlug: 'reg213-amendment1-faq-247-closeout',
    sourceId: 'reg213-amendment1-faq-closeout',
    filename: 'Reg-213-11-NYCRR-S103-Amendment-1-FAQ.pdf',
    sourceTitle: 'Regulation 213 Amendment No. 1 FAQ',
    sourceReference: 'New York State Department of Financial Services Life Bureau Guidance Note (July 21, 2020)',
    batchTitle: 'later adoption, phase-in reporting, and closeout slice',
    pageWindow: [3, 3],
    sectionReference: 'Later adoption, phase-in reporting, hedging, and end-of-source boundary',
    citationText:
      'This is likely the approach the Department will take; however, each subsequent adoption will require further discussion.',
    summary:
      'The closing page addresses later adoption of annual updates, the phase-in reporting question, the hedging question, and the end-of-source boundary while keeping the companion-guidance caveat explicit.',
    keywords: [
      'Reg 213',
      'phase-in',
      'AG43',
      'VM-31',
      'hedging',
      'later adoption',
      'New York',
    ],
    notes: 'Closeout slice; keep the phase-in, hedging, and boundary questions together.',
    sourceNotes: 'Page 3 only; later adoption and closeout questions.',
    reviewPacketNotes: 'Keep the closing questions separate from the opening caveat and methodology pages.',
    nextStep:
      'Confirm that the FAQ ends on page 3 and keep any other amendment-history file in the folder out of scope for this wave.',
    flagType: 'closeout_guidance_slice',
    flagMessage:
      'The later adoption, phase-in reporting, and hedging answers should remain review-only as companion guidance.',
    topicIssueType: 'closeout_boundary',
    topicIssueDetails:
      'The closing questions should stay separate from the opening and methodology pages and should end at page 3.',
    topicRecommendedAction: 'Preserve the closing page and do not widen into the rest of the folder.',
    topicIssueMessage:
      'The later adoption, phase-in reporting, and hedging answers should remain separate from the earlier FAQ pages.',
    topicIssueEvidence: 'Page 3 contains the later-adoption, phase-in, hedging, and closeout questions.',
    topicValidationDetails: 'The closing page stayed confined to the planned page range and kept the caveat visible.',
    validationCheckId: 'reg213-amendment1-faq-closeout-coverage',
    validationCheckDetails: 'The closing page stayed confined to the planned page range and kept the caveat visible.',
    reviewFlags: [
      'caveat_or_companion_guidance',
      'regulatory_requirement',
      'reporting_requirement',
      'documentation_expectation',
      'cross_reference_mapping',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the later adoption, phase-in reporting, hedging, and closeout guidance as one narrow review-only FAQ slice.',
  },
]

export const reg213Amendment1FaqBatchDefinitions = Object.fromEntries(
  reg213Amendment1FaqBatchSpecs.map((spec) => {
    const batch = makeReg213Amendment1FaqBatch(spec)
    return [spec.plannedBatchId, batch]
  }),
)
