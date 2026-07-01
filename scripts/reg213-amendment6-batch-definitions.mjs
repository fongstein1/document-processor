const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const sourceTitle = 'Regulation 213 Sixth Amendment'
const sourceReference =
  'New York State Department of Financial Services proposed Sixth Amendment to 11 NYCRR 103 (Insurance Regulation 213)'
const defaultNonLearnerNotes =
  'Proposed amendment text is review-only. Keep page locators primary, treat the amendment as proposed rule text, and do not promote any item.'

const makeReg213Amendment6Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 213 Sixth Amendment controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_213_sixth_amendment',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only proposed amendment slice so the wording stays narrow and reviewable.`,
    processingIntentNotes:
      spec.processingIntentNotes ??
      'Proposed amendment workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText:
      spec.batchSummaryText ?? `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This proposed amendment slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small Reg 213 amendment batch. Keep the work review-first, preserve the page locator, treat the source as proposed amendment text, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'page_locator_primary',
        message:
          'The amendment should stay page-locator anchored because the one-page text layer is the source of record for exact wording.',
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
          'Page locators should remain the primary anchor for the proposed amendment because the source is a one-page regulatory PDF.',
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
          'Should the proposed Sixth Amendment remain indexed as a stand-alone amendment-history source, or should a later cleanup step group it with the other Reg-213 amendment files?',
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
          'The proposed amendment should remain anchored by a page locator because the one-page text is the source of record for exact wording.',
        recommendedAction: 'Keep the page locator visible instead of overclaiming exact wording.',
        evidence:
          'The source is a one-page regulatory PDF and the controlled runner should preserve page-level references for this source family.',
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
        checkId: 'proposed-amendment-status-tracked',
        status: 'passed',
        details:
          'The review packet keeps the proposed-amendment status visible so the source is not mistaken for adopted rule text.',
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
        versionDate: '2026-07-01',
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

const reg213Amendment6BatchSpecs = [
  {
    plannedBatchId: 'batch-248',
    batchSlug: 'reg213-amendment6-proposed-text',
    sourceId: 'reg213-amendment6-proposed-text',
    filename: 'Reg-213-amend6_text.pdf',
    sourceTitle: 'Regulation 213 Sixth Amendment',
    sourceReference:
      'New York State Department of Financial Services proposed Sixth Amendment to 11 NYCRR 103 (Insurance Regulation 213)',
    batchTitle: 'proposed text and footnote revision',
    pageWindow: [1, 1],
    sectionReference: 'Proposed Sixth Amendment title, adoption framing, and footnote revision',
    citationText: 'PROPOSED SIXTH AMENDMENT TO 11 NYCRR 103 (INSURANCE REGULATION 213)',
    summary:
      'The one-page proposed amendment frames the Sixth Amendment, adopts the updated valuation-manual footnote, and keeps the revised language review-only.',
    keywords: [
      'Reg 213',
      'Sixth Amendment',
      'proposed amendment',
      'Valuation Manual',
      'footnote revision',
      'New York',
    ],
    notes: 'One-page proposed amendment; keep the core regulation and FAQ addendum out of the batch.',
    sourceNotes: 'Page 1 only; proposed amendment title and footnote revision.',
    reviewPacketNotes: 'Keep the proposed amendment separate from the core Regulation 213 wave and the FAQ addendum.',
    nextStep:
      'Confirm whether the proposed amendment should later be grouped with the other amendment-history PDFs or remain a stand-alone regulatory-text unit.',
    flagType: 'proposed_amendment_slice',
    flagMessage:
      'The proposed amendment text should remain review-only as regulatory context and not be promoted as adopted rule text.',
    topicIssueType: 'proposed_amendment_boundary',
    topicIssueDetails:
      'The one-page proposed amendment should stay separate from the core Regulation 213 wave and the FAQ addendum.',
    topicRecommendedAction: 'Preserve the one-page proposed amendment as its own review-only source unit.',
    topicIssueMessage:
      'The proposed amendment text should remain separate from the core Regulation 213 wave and the FAQ addendum.',
    topicIssueEvidence: 'Page 1 contains the proposed Sixth Amendment title and the footnote revision.',
    validationCheckId: 'reg213-amendment6-proposed-text-coverage',
    validationCheckDetails: 'The proposed amendment page stayed confined to the planned one-page window and kept the revision visible.',
    reviewFlags: [
      'proposed_regulatory_text',
      'state_specific_requirement',
      'documentation_expectation',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    processingIntentText:
      'Capture the proposed Sixth Amendment title and footnote revision as a narrow review-only regulatory-text slice.',
  },
]

export const reg213Amendment6BatchDefinitions = Object.fromEntries(
  reg213Amendment6BatchSpecs.map((spec) => {
    const batch = makeReg213Amendment6Batch(spec)
    return [spec.plannedBatchId, batch]
  }),
)
