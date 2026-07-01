const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const sourceTitle = 'Regulation 213 First Amendment'
const sourceReference =
  'New York State Department of Financial Services First Amendment to 11 NYCRR 103 (Insurance Regulation 213)'
const defaultNonLearnerNotes =
  'Certified amendment text is review-only. Keep page locators primary, treat the source as regulatory text, and do not promote any item.'

const makeReg213Amendment1TextBatch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 213 First Amendment controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_213_first_amendment',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only certified-amendment slice so the wording stays narrow and reviewable.`,
    processingIntentNotes:
      spec.processingIntentNotes ??
      'Certified amendment workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText:
      spec.batchSummaryText ?? `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This certified amendment slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small Reg 213 amendment batch. Keep the work review-first, preserve the page locator, treat the source as certified regulatory text, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'page_locator_primary',
        message:
          'The amendment should stay page-locator anchored because the text page is the source of record for exact wording.',
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
          'Page locators should remain the primary anchor for the certified amendment because the source is a 24-page regulatory PDF.',
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
          'Should the First Amendment remain indexed as a stand-alone amendment-history source, or should a later cleanup step group it with the other Reg-213 amendment files?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
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
          'The certified amendment should remain anchored by a page locator because the text page is the source of record for exact wording.',
        recommendedAction: 'Keep the page locator visible instead of overclaiming exact wording.',
        evidence:
          'The source is a 24-page regulatory PDF and the controlled runner should preserve page-level references for this source family.',
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
          'The amendment uses an OCR/text layer, and the final certification page is a scanned image-only page.',
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
          'The review packet keeps the page-image wording backstop visible because the amendment text can still wrap awkwardly.',
      },
      {
        checkId: 'certified-amendment-status-tracked',
        status: 'passed',
        details:
          'The review packet keeps the certified-amendment status visible so the source is not mistaken for companion guidance.',
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
        versionDate: '2020-02-11',
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
        authorityLevel: 'regulatory_text',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: defaultNonLearnerNotes,
      },
    ],
  }
}

const reg213Amendment1TextBatchSpecs = [
  {
    plannedBatchId: 'batch-260',
    batchSlug: 'reg213-amendment1-text-opening-text',
    sourceId: 'reg213-amendment1-text-opening-text',
    filename: 'Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf',
    sourceTitle: 'Regulation 213 First Amendment',
    sourceReference:
      'New York State Department of Financial Services First Amendment to 11 NYCRR 103 (Insurance Regulation 213)',
    batchTitle: 'opening text and early section updates',
    pageWindow: [1, 5],
    sectionReference: 'First Amendment title, authority text, and sections 103.1-103.5 openers',
    citationText: 'FIRST AMENDMENT TO 11 NYCRR 103 (INSURANCE REGULATION 213)',
    summary:
      'The opening pages introduce the First Amendment, add section 103.1, and begin the section 103.4 / 103.5 changes.',
    summaryLead: 'The opening text and early section updates',
    keywords: [
      'Reg 213',
      'First Amendment',
      'certified amendment',
      'section 103.1',
      'section 103.4',
      'section 103.5',
      'New York',
    ],
    notes: 'Pages 1-5 only; title, authority text, and early section updates.',
    sourceNotes: 'Pages 1-5 only; opening text and early section updates.',
    reviewPacketNotes: 'Keep the opening amendment text separate from the reserve-method pages and the certification page.',
    nextStep:
      'Move to the reserve-method updates on pages 6-11 while keeping the opening text narrow.',
    flagType: 'certified_amendment_slice',
    flagMessage:
      'The certified amendment text should remain review-only as regulatory context and not be promoted as learner-facing content.',
    topicIssueType: 'certified_amendment_boundary',
    topicIssueDetails:
      'The opening text should stay separate from the reserve-method pages and from the other Regulation 213 addenda.',
    topicRecommendedAction: 'Preserve the opening text on pages 1-5 and stop before the reserve-method updates begin.',
    topicIssueMessage:
      'The certified amendment opening text should remain separate from the reserve-method pages and the other Regulation 213 addenda.',
    topicIssueEvidence: 'Pages 1-5 contain the First Amendment title, authority text, section 103.1, section 103.4, and the section 103.5 openers.',
    validationCheckId: 'reg213-amendment1-text-opening-text-coverage',
    validationCheckDetails:
      'The opening text stayed confined to the planned page-1-through-5 window and kept the opening amendments visible.',
    reviewFlags: [
      'certified_regulatory_text',
      'state_specific_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the First Amendment title, authority text, and early section updates as a narrow review-only regulatory-text slice.',
  },
  {
    plannedBatchId: 'batch-261',
    batchSlug: 'reg213-amendment1-text-reserve-updates',
    sourceId: 'reg213-amendment1-text-reserve-updates',
    filename: 'Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf',
    sourceTitle: 'Regulation 213 First Amendment',
    sourceReference:
      'New York State Department of Financial Services First Amendment to 11 NYCRR 103 (Insurance Regulation 213)',
    batchTitle: 'reserve-method updates',
    pageWindow: [6, 11],
    sectionReference: 'Section 103.6 reserve-method updates, phase-in changes, and related cross-references',
    citationText: '§  103.6',
    summary:
      'The middle pages carry the reserve-method updates, phase-in changes, and related cross-references.',
    summaryLead: 'The reserve-method updates',
    keywords: [
      'Reg 213',
      'First Amendment',
      'certified amendment',
      'section 103.6',
      'phase-in',
      'Valuation Manual',
      'New York',
    ],
    notes: 'Pages 6-11 only; reserve-method updates and phase-in changes.',
    sourceNotes: 'Pages 6-11 only; reserve-method updates and phase-in changes.',
    reviewPacketNotes: 'Keep the reserve-method pages separate from the opening text and the assumption-mechanics pages.',
    nextStep:
      'Move to the account-value and assumption mechanics on pages 12-16 while keeping the reserve-method pages narrow.',
    flagType: 'reserve_method_update_slice',
    flagMessage:
      'The reserve-method updates should remain review-only as regulatory context and not be promoted as learner-facing content.',
    topicIssueType: 'reserve_method_boundary',
    topicIssueDetails:
      'The reserve-method pages should stay separate from the opening text and from the assumption-mechanics pages.',
    topicRecommendedAction: 'Preserve the reserve-method pages on pages 6-11 and stop before the account-value mechanics begin.',
    topicIssueMessage:
      'The reserve-method updates should remain separate from the opening text, the assumption-mechanics pages, and the other Regulation 213 addenda.',
    topicIssueEvidence: 'Pages 6-11 contain the section 103.6 reserve-method updates, phase-in changes, and related cross-references.',
    validationCheckId: 'reg213-amendment1-text-reserve-updates-coverage',
    validationCheckDetails:
      'The reserve-method pages stayed confined to the planned page-6-through-11 window and kept the reserve updates visible.',
    reviewFlags: [
      'certified_regulatory_text',
      'state_specific_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the reserve-method updates, phase-in changes, and related cross-references as a narrow review-only regulatory-text slice.',
  },
  {
    plannedBatchId: 'batch-262',
    batchSlug: 'reg213-amendment1-text-assumption-mechanics',
    sourceId: 'reg213-amendment1-text-assumption-mechanics',
    filename: 'Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf',
    sourceTitle: 'Regulation 213 First Amendment',
    sourceReference:
      'New York State Department of Financial Services First Amendment to 11 NYCRR 103 (Insurance Regulation 213)',
    batchTitle: 'account-value and assumption mechanics',
    pageWindow: [12, 16],
    sectionReference: 'Section 103.6 account-value mechanics, assumption mechanics, and related projection rules',
    citationText: 'Assumptions used to calculate the accumulated net revenue',
    summary:
      'The mid-source pages carry the account-value mechanics, assumption mechanics, and related projection rules.',
    summaryLead: 'The account-value and assumption mechanics',
    keywords: [
      'Reg 213',
      'First Amendment',
      'certified amendment',
      'account value',
      'margins',
      'assumptions',
      'discount rate',
      'New York',
    ],
    notes: 'Pages 12-16 only; account-value mechanics and assumption mechanics.',
    sourceNotes: 'Pages 12-16 only; account-value mechanics and assumption mechanics.',
    reviewPacketNotes: 'Keep the account-value mechanics separate from the withdrawal mechanics and the closeout pages.',
    nextStep:
      'Move to the withdrawal and option-value mechanics on pages 17-19 while keeping the account-value slice narrow.',
    flagType: 'assumption_mechanics_slice',
    flagMessage:
      'The assumption-mechanics pages should remain review-only as regulatory context and not be promoted as learner-facing content.',
    topicIssueType: 'assumption_mechanics_boundary',
    topicIssueDetails:
      'The account-value mechanics should stay separate from the withdrawal mechanics and from the factor-table closeout.',
    topicRecommendedAction: 'Preserve the account-value and assumption-mechanics pages on pages 12-16 and stop before the withdrawal mechanics begin.',
    topicIssueMessage:
      'The account-value mechanics should remain separate from the withdrawal mechanics, the factor-table closeout, and the other Regulation 213 addenda.',
    topicIssueEvidence: 'Pages 12-16 contain the account-value mechanics, assumption mechanics, and related projection rules.',
    validationCheckId: 'reg213-amendment1-text-assumption-mechanics-coverage',
    validationCheckDetails:
      'The account-value and assumption-mechanics pages stayed confined to the planned page-12-through-16 window and kept the mechanics visible.',
    reviewFlags: [
      'certified_regulatory_text',
      'state_specific_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the account-value mechanics, assumption mechanics, and related projection rules as a narrow review-only regulatory-text slice.',
  },
  {
    plannedBatchId: 'batch-263',
    batchSlug: 'reg213-amendment1-text-withdrawal-option-floor',
    sourceId: 'reg213-amendment1-text-withdrawal-option-floor',
    filename: 'Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf',
    sourceTitle: 'Regulation 213 First Amendment',
    sourceReference:
      'New York State Department of Financial Services First Amendment to 11 NYCRR 103 (Insurance Regulation 213)',
    batchTitle: 'withdrawal and option-value mechanics',
    pageWindow: [17, 19],
    sectionReference: 'Section 103.6 withdrawal mechanics, index assumptions, and option-value floor',
    citationText: 'Option value floor',
    summary:
      'The late-section pages carry the withdrawal mechanics, index assumptions, and option-value floor.',
    summaryLead: 'The withdrawal and option-value mechanics',
    keywords: [
      'Reg 213',
      'First Amendment',
      'certified amendment',
      'withdrawals',
      'index assumptions',
      'option value floor',
      'contract holder behavior',
      'New York',
    ],
    notes: 'Pages 17-19 only; withdrawal mechanics and option-value floor.',
    sourceNotes: 'Pages 17-19 only; withdrawal mechanics and option-value floor.',
    reviewPacketNotes: 'Keep the withdrawal mechanics separate from the factor-table closeout and the certification page.',
    nextStep:
      'Move to the factor tables and sections 103.7 / 103.8 closeout on pages 20-23 while keeping the withdrawal slice narrow.',
    flagType: 'option_value_slice',
    flagMessage:
      'The withdrawal and option-value pages should remain review-only as regulatory context and not be promoted as learner-facing content.',
    topicIssueType: 'option_value_boundary',
    topicIssueDetails:
      'The withdrawal mechanics should stay separate from the factor tables and the certification page.',
    topicRecommendedAction: 'Preserve the withdrawal and option-value mechanics on pages 17-19 and stop before the closeout pages begin.',
    topicIssueMessage:
      'The withdrawal mechanics should remain separate from the factor-table closeout, the certification page, and the other Regulation 213 addenda.',
    topicIssueEvidence: 'Pages 17-19 contain the withdrawal mechanics, index assumptions, and option-value floor.',
    validationCheckId: 'reg213-amendment1-text-withdrawal-option-floor-coverage',
    validationCheckDetails:
      'The withdrawal and option-value pages stayed confined to the planned page-17-through-19 window and kept the mechanics visible.',
    reviewFlags: [
      'certified_regulatory_text',
      'state_specific_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the withdrawal mechanics, index assumptions, and option-value floor as a narrow review-only regulatory-text slice.',
  },
  {
    plannedBatchId: 'batch-264',
    batchSlug: 'reg213-amendment1-text-factor-tables-closeout',
    sourceId: 'reg213-amendment1-text-factor-tables-closeout',
    filename: 'Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf',
    sourceTitle: 'Regulation 213 First Amendment',
    sourceReference:
      'New York State Department of Financial Services First Amendment to 11 NYCRR 103 (Insurance Regulation 213)',
    batchTitle: 'factor tables and closeout',
    pageWindow: [20, 23],
    sectionReference: 'Factor tables and the section 103.7 / 103.8 closeout text',
    citationText: 'Factor Table F',
    summary:
      'The closeout pages carry Factor Table F, section 103.7, and section 103.8.',
    summaryLead: 'The factor tables and closeout text',
    keywords: [
      'Reg 213',
      'First Amendment',
      'certified amendment',
      'Factor Table F',
      'section 103.7',
      'section 103.8',
      'reinsurance',
      'New York',
    ],
    notes: 'Pages 20-23 only; factor tables and closing reserve rules.',
    sourceNotes: 'Pages 20-23 only; factor tables and closing reserve rules.',
    reviewPacketNotes: 'Keep the factor tables and closeout text separate from the certification page.',
    nextStep:
      'Move to the scanned certification and publication notice on page 24 while keeping the closeout pages narrow.',
    flagType: 'closeout_slice',
    flagMessage:
      'The factor-table and closeout pages should remain review-only as regulatory context and not be promoted as learner-facing content.',
    topicIssueType: 'closeout_boundary',
    topicIssueDetails:
      'The factor-table pages should stay separate from the certification page.',
    topicRecommendedAction: 'Preserve the factor tables and closeout pages on pages 20-23 and stop before page 24 begins.',
    topicIssueMessage:
      'The factor-table closeout should remain separate from the certification page and the other Regulation 213 addenda.',
    topicIssueEvidence: 'Pages 20-23 contain Factor Table F and the section 103.7 / 103.8 closeout text.',
    validationCheckId: 'reg213-amendment1-text-factor-tables-closeout-coverage',
    validationCheckDetails:
      'The factor-table and closeout pages stayed confined to the planned page-20-through-23 window and kept the closeout visible.',
    reviewFlags: [
      'certified_regulatory_text',
      'state_specific_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the factor tables and closing section 103.7 / 103.8 text as a narrow review-only regulatory-text slice.',
  },
  {
    plannedBatchId: 'batch-265',
    batchSlug: 'reg213-amendment1-text-certification',
    sourceId: 'reg213-amendment1-text-certification',
    filename: 'Reg-213-11-NYCRR-S103-Amendment-1-rf213a1text.pdf',
    sourceTitle: 'Regulation 213 First Amendment',
    sourceReference:
      'New York State Department of Financial Services First Amendment to 11 NYCRR 103 (Insurance Regulation 213)',
    batchTitle: 'certification and publication notice',
    pageWindow: [24, 24],
    sectionReference: 'Certification and publication notice',
    citationText: 'I, Linda A. Lacewell, Superintendent of Financial Services, do hereby certify',
    summary:
      'The final page confirms the First Amendment and carries the publication notice in a scanned image-only layout.',
    summaryLead: 'The certification page and publication notice',
    keywords: [
      'Reg 213',
      'First Amendment',
      'certification',
      'publication notice',
      'State Register',
      'Linda A. Lacewell',
      'New York',
    ],
    notes: 'Page 24 only; scanned certification and publication notice.',
    sourceNotes: 'Page 24 only; scanned certification and publication notice.',
    reviewPacketNotes: 'Keep the certification page separate from the amendment text on pages 1-23.',
    nextStep:
      'Confirm whether the First Amendment should later be grouped with the other amendment-history PDFs or remain a stand-alone regulatory-text unit.',
    flagType: 'certification_notice_slice',
    flagMessage:
      'The certification and publication notice should remain review-only as regulatory context and not be promoted as learner-facing content.',
    topicIssueType: 'certification_boundary',
    topicIssueDetails:
      'The certification page should stay separate from the amendment text and from the other Regulation 213 addenda.',
    topicRecommendedAction: 'Preserve the certification page and do not widen back into the closeout text.',
    topicIssueMessage:
      'The certification language should remain separate from the amendment text and the other Regulation 213 addenda.',
    topicIssueEvidence: 'Page 24 contains the scanned certification and publication notice.',
    validationCheckId: 'reg213-amendment1-text-certification-coverage',
    validationCheckDetails:
      'The certification page stayed confined to the planned page-24 window and kept the certification visible.',
    reviewFlags: [
      'certified_regulatory_text',
      'state_specific_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the scanned certification and publication notice as a narrow review-only regulatory-text slice.',
  },
]

export const reg213Amendment1TextBatchDefinitions = Object.fromEntries(
  reg213Amendment1TextBatchSpecs.map((spec) => {
    const batch = makeReg213Amendment1TextBatch(spec)
    return [spec.plannedBatchId, batch]
  }),
)
