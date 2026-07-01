const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const sourceTitle = 'Regulation 213 Fourth Amendment'
const sourceReference =
  'New York State Department of Financial Services Fourth Amendment to 11 NYCRR 103 (Insurance Regulation 213)'
const defaultNonLearnerNotes =
  'Certified amendment text is review-only. Keep page locators primary, treat the amendment as regulatory text, and do not promote any item.'

const makeReg213Amendment4Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 213 Fourth Amendment controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_213_fourth_amendment',
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
          'Page locators should remain the primary anchor for the certified amendment because the source is a three-page regulatory PDF.',
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
          'Should the Fourth Amendment remain indexed as a stand-alone amendment-history source, or should a later cleanup step group it with the other Reg-213 amendment files?',
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
          'The source is a three-page regulatory PDF and the controlled runner should preserve page-level references for this source family.',
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
          'The amendment is a text-based PDF with page-image wording available as the backstop.',
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
        versionDate: '2023-02-10',
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

const reg213Amendment4BatchSpecs = [
  {
    plannedBatchId: 'batch-255',
    batchSlug: 'reg213-amendment4-amendment-text',
    sourceId: 'reg213-amendment4-amendment-text',
    filename: 'Reg-213-amend4_text.pdf',
    sourceTitle: 'Regulation 213 Fourth Amendment',
    sourceReference:
      'New York State Department of Financial Services Fourth Amendment to 11 NYCRR 103 (Insurance Regulation 213)',
    batchTitle: 'amendment text and section updates',
    pageWindow: [1, 2],
    sectionReference: 'Fourth Amendment title, footnote revision, and section updates',
    citationText: 'FOURTH AMENDMENT TO 11 NYCRR 103 (INSURANCE REGULATION 213)',
    summary:
      'The first two pages frame the Fourth Amendment, update the valuation-manual footnote, and keep the revised section language review-only.',
    summaryLead: 'The amendment text and section updates',
    keywords: [
      'Reg 213',
      'Fourth Amendment',
      'certified amendment',
      'Valuation Manual',
      'footnote revision',
      'section updates',
      'New York',
    ],
    notes: 'Pages 1-2 only; title, footnote revision, and section updates.',
    sourceNotes: 'Pages 1-2 only; Fourth Amendment text and section updates.',
    reviewPacketNotes: 'Keep the amendment text separate from the certification page.',
    nextStep:
      'Move to the certification and publication notice on page 3 while keeping the amendment text narrow.',
    flagType: 'certified_amendment_slice',
    flagMessage:
      'The certified amendment text should remain review-only as regulatory context and not be promoted as learner-facing content.',
    topicIssueType: 'certified_amendment_boundary',
    topicIssueDetails:
      'The amendment text should stay separate from the certification page and from the core Regulation 213 wave.',
    topicRecommendedAction: 'Preserve the amendment text on pages 1-2 and stop before the certification page begins.',
    topicIssueMessage:
      'The certified amendment text should remain separate from the certification page and the other Regulation 213 addenda.',
    topicIssueEvidence: 'Pages 1-2 contain the Fourth Amendment title, footnote revision, and section updates.',
    validationCheckId: 'reg213-amendment4-amendment-text-coverage',
    validationCheckDetails:
      'The amendment text stayed confined to the planned page-1-through-2 window and kept the revisions visible.',
    reviewFlags: [
      'certified_regulatory_text',
      'state_specific_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the Fourth Amendment title, footnote revision, and section updates as a narrow review-only regulatory-text slice.',
  },
  {
    plannedBatchId: 'batch-256',
    batchSlug: 'reg213-amendment4-certification',
    sourceId: 'reg213-amendment4-certification',
    filename: 'Reg-213-amend4_text.pdf',
    sourceTitle: 'Regulation 213 Fourth Amendment',
    sourceReference:
      'New York State Department of Financial Services Fourth Amendment to 11 NYCRR 103 (Insurance Regulation 213)',
    batchTitle: 'certification and publication notice',
    pageWindow: [3, 3],
    sectionReference: 'Certification and publication notice',
    citationText: 'I, Adrienne A. Harris, Superintendent of Financial Services, do hereby certify that the foregoing is the Fourth Amendment...',
    summary:
      'The certification page confirms the Fourth Amendment, references the publication notice, and keeps the certification language review-only.',
    summaryLead: 'The certification page and publication notice',
    keywords: [
      'Reg 213',
      'Fourth Amendment',
      'certification',
      'publication notice',
      'State Register',
      'New York',
    ],
    notes: 'Page 3 only; certification and publication notice.',
    sourceNotes: 'Page 3 only; certification language and publication notice.',
    reviewPacketNotes: 'Keep the certification page separate from the amendment text on pages 1-2.',
    nextStep:
      'Confirm whether the Fourth Amendment should later be grouped with the other amendment-history PDFs or remain a stand-alone regulatory-text unit.',
    flagType: 'certification_notice_slice',
    flagMessage:
      'The certification and publication notice should remain review-only as regulatory context and not be promoted as learner-facing content.',
    topicIssueType: 'certification_boundary',
    topicIssueDetails:
      'The certification page should stay separate from the amendment text and from the other Regulation 213 addenda.',
    topicRecommendedAction: 'Preserve the certification page and do not widen back into the amendment text.',
    topicIssueMessage:
      'The certification language should remain separate from the amendment text and the other Regulation 213 addenda.',
    topicIssueEvidence: 'Page 3 contains the certification language and the publication notice.',
    validationCheckId: 'reg213-amendment4-certification-coverage',
    validationCheckDetails:
      'The certification page stayed confined to the planned page-3 window and kept the certification visible.',
    reviewFlags: [
      'certified_regulatory_text',
      'state_specific_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the certification and publication notice as a narrow review-only regulatory-text slice.',
  },
]

export const reg213Amendment4BatchDefinitions = Object.fromEntries(
  reg213Amendment4BatchSpecs.map((spec) => {
    const batch = makeReg213Amendment4Batch(spec)
    return [spec.plannedBatchId, batch]
  }),
)
