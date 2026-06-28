const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 50 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg50Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 50 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag50_idi_claim_reserves',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 50 review-only batch: capture the disability-income claim-reserve guidance and keep the next guideline outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 50 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 50 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the next guideline outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 50 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 50 has an encoding-noisy text layer, so the text should stay review-only until the page image is confirmed.',
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
          'The page-image wording should be confirmed before anyone treats AG 50 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 50 text layer, so page locators should remain the primary anchor.',
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
          'Should AG 50 remain indexed as review-only guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page window remain a single review-only slice, or should later cleanup split the opening guidance from the calculation and exemption context?',
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
          'The AG 50 text layer is encoded, and the page-image wording should remain a visible review note.',
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
        checkId: 'ag50-page-window-coverage',
        status: 'passed',
        details: `The selected page window captures the planned AG 50 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 50 slice carries a source reference and a page locator.',
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
          'AG 50 slice retained as review-only guidance until the wording and the closing boundary are confirmed.',
      },
    ],
  }
}

const ag50BatchSpecs = [
  {
    plannedBatchId: 'batch-160',
    batchSlug: 'ag50-160-background-purpose',
    sourceId: 'ag50-background-purpose',
    filename:
      'AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table.pdf',
    sourceTitle:
      'AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table',
    sourceReference: 'Actuarial Guideline L',
    batchTitle: 'background and purpose slice',
    pageWindow: [1, 1],
    sectionReference: 'AG 50 page 1: background and purpose for the 2013 IDI Valuation Table guidance.',
    citationText:
      'The purpose of this actuarial guideline is to provide instructions for the use of the 2013 IDI Valuation Table.',
    summary:
      'AG 50 explains why the 2013 IDI Valuation Table is the standard for claim reserves and frames the purpose of the guideline before the calculation mechanics begin.',
    keywords: ['AG 50', 'Actuarial Guideline L', 'background', 'purpose', '2013 IDI Valuation Table', 'claim reserves'],
    notes:
      'Opening background and purpose window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; later guideline files remain out of scope for this wave.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'background', 'purpose'],
    reviewPacketNotes: 'AG 50 opening slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and whether the opening background should stay grouped with the later credibility and exemption material before expanding the source.',
    flagType: 'opening_scope_caveat',
    flagMessage:
      'The opening background and purpose guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'opening_scope_boundary',
    topicIssueDetails:
      'The opening background and purpose guidance should stay separate from the later credibility, A/E, and exemption sections.',
    topicRecommendedAction:
      'Keep the page 1 slice review-only and do not widen it into the later AG 50 pages.',
    topicIssueMessage: 'The opening guidance should not absorb later AG 50 sections.',
    topicIssueEvidence: 'Page 1 contains the background and purpose text for the 2013 IDI Valuation Table guidance.',
    topicValidationDetails: 'The selected page captures the opening AG 50 guidance slice.',
  },
  {
    plannedBatchId: 'batch-161',
    batchSlug: 'ag50-161-credibility-ae-lag',
    sourceId: 'ag50-credibility-ae-lag',
    filename:
      'AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table.pdf',
    sourceTitle:
      'AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table',
    sourceReference: 'Actuarial Guideline L',
    batchTitle: 'credibility, A/E ratio, lag period, and monthly indemnity slice',
    pageWindow: [2, 3],
    sectionReference:
      'AG 50 pages 2-3: credibility weighting, claim termination ratios, lag period, monthly indemnity, and company experience rules.',
    citationText:
      'Z is a credibility weighting factor, between 0 and 1, developed for each duration group.',
    summary:
      'AG 50 sets the credibility framework for company experience, defines the A/E ratio and related measurement guidance, and explains the lag-period and monthly-indemnity rules.',
    keywords: ['AG 50', 'credibility weighting', 'A/E ratio', 'lag period', 'monthly indemnity', 'company experience'],
    notes:
      'Calculation / experience-measurement window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; later guideline files remain out of scope for this wave.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'credibility_weighting', 'ae_ratio', 'lag_period', 'monthly_indemnity'],
    reviewPacketNotes: 'AG 50 credibility and experience slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the credibility-weighting and A/E wording and whether the lag-period guidance should stay grouped with the monthly-indemnity measurement before widening the source.',
    flagType: 'experience_measurement_caveat',
    flagMessage:
      'The credibility, A/E, lag-period, and monthly-indemnity guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'experience_measurement_boundary',
    topicIssueDetails:
      'The credibility and experience-measurement guidance should stay separate from the opening background and the closing exemption page.',
    topicRecommendedAction:
      'Keep the page 2-3 slice review-only and do not widen it into AG 50 page 4.',
    topicIssueMessage: 'The credibility and experience-measurement window should not absorb the closing exemption material.',
    topicIssueEvidence:
      'Pages 2-3 contain the credibility weighting factor, A/E ratio guidance, lag period, and monthly indemnity material.',
    topicValidationDetails: 'The selected pages capture the AG 50 credibility and experience-measurement slice.',
  },
  {
    plannedBatchId: 'batch-162',
    batchSlug: 'ag50-162-company-definition-exemption',
    sourceId: 'ag50-company-definition-exemption',
    filename:
      'AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table.pdf',
    sourceTitle:
      'AG 50 - The Application of Company Experience in the Calculation of Claim Reserves Under the 2013 Individual Disability Income Valuation Table',
    sourceReference: 'Actuarial Guideline L',
    batchTitle: 'company definition, own-experience exemption, and closing boundary slice',
    pageWindow: [4, 4],
    sectionReference:
      'AG 50 page 4: company definition, own-experience measurement exemption, and closing boundary.',
    citationText:
      'In the above paragraphs, the term company refers to a single company or a group of legally related companies subject to the same claim management.',
    summary:
      'AG 50 closes by defining company for the measurement rules and setting the own-experience measurement exemption that ends the short guideline.',
    keywords: ['AG 50', 'company definition', 'own experience', 'measurement exemption', 'closing boundary'],
    notes:
      'Closing company-definition / exemption window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes: 'Active guidance; later guideline files remain out of scope for this wave.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'company_definition', 'own_experience_measurement_exemption', 'closing_boundary'],
    reviewPacketNotes: 'AG 50 company-definition and exemption slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the company-definition wording and whether the exemption should stay grouped with the preceding measurement rules before moving beyond AG 50.',
    flagType: 'closing_exemption_caveat',
    flagMessage:
      'The company-definition and own-experience exemption guidance should remain review-only until the page image is confirmed.',
    topicIssueType: 'closing_exemption_boundary',
    topicIssueDetails:
      'The closing company-definition and exemption material should stay separate from the earlier credibility and lag-period material.',
    topicRecommendedAction:
      'Keep the page 4 slice review-only and treat it as the closing boundary for AG 50.',
    topicIssueMessage: 'The closing exemption slice should not absorb earlier AG 50 mechanics.',
    topicIssueEvidence: 'Page 4 contains the company definition and own-experience measurement exemption text.',
    topicValidationDetails: 'The selected page captures the AG 50 closing exemption slice.',
  },
]

export const ag50BatchDefinitions = Object.fromEntries(
  ag50BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg50Batch(spec)]),
)
