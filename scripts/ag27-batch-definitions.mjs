const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 27 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg27Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 27 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: spec.batchProfile,
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 27 review-only batch: capture the accelerated-benefits guideline slice and keep the OCR-noisy wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 27 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 27 guideline slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 27 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 27 is OCR-noisy, so the text layer should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the text layer is noisy / encoded.',
        notes: 'Keep the image backstop visible as a review note.',
      },
    ],
    reviewPacketCitationIssues: spec.reviewPacketCitationIssues,
    reviewPacketHumanDecisions: spec.reviewPacketHumanDecisions,
    unresolvedIssues: spec.unresolvedIssues,
    validationChecks: spec.validationChecks,
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
        reviewPacketIssueCount: spec.reviewPacketIssueCount ?? 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 27 slice retained as review-only guidance until the wording and boundaries are confirmed.',
      },
    ],
  }
}

const ag27BatchSpecs = [
  {
    plannedBatchId: 'batch-107',
    batchSlug: 'ag27-107-overview-reserve-framing',
    sourceId: 'ag27-accelerated-benefits-overview',
    batchProfile: 'ag27_accelerated_benefits_overview',
    filename: 'AG 27 - Actuarial Guideline for Accelerated Benefits.pdf',
    sourceTitle: 'AG 27 - Actuarial Guideline for Accelerated Benefits',
    sourceReference: 'Actuarial Guideline XXVII',
    batchTitle: 'overview and reserve framing slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 27 pages 1-2: accelerated-benefits overview, non-discounted acceleration, actuarially discounted acceleration, and reserve framing',
    citationText:
      'This guideline is designed to cover the actuarial aspects of accelerated benefits.',
    summary:
      'AG 27 opens with the three accelerated-benefit categories and the reserve framing for non-discounted acceleration and actuarially discounted acceleration.',
    keywords: [
      'AG 27',
      'Actuarial Guideline XXVII',
      'accelerated benefits',
      'non-discounted acceleration',
      'actuarially discounted acceleration',
      'reserve structure',
      'life insurance',
    ],
    notes:
      'Two-page opening slice; keep the page image as the wording backstop because the text layer is noisy / encoded.',
    sourceNotes:
      'Opening guideline slice; keep pages 1-2 together and do not widen into the interest-accrual section.',
    summaryLead:
      'AG 27 opens with the three accelerated-benefit categories and the basic reserve framing.',
    reviewFlags: [
      'ocr_text_layer',
      'page_image_backstop',
      'reserve_method_structure',
      'cross_reference_mapping',
    ],
    reviewPacketNotes: 'Opening AG 27 slice remains review-only.',
    reviewPacketIssueCount: 2,
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-ag27-overview-page-image',
        sourceId: 'ag27-accelerated-benefits-overview',
        itemId: 'item-ag27-accelerated-benefits-overview-ag27-107-overview-reserve-framing',
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats the opening accelerated-benefits overview as an indexing candidate.',
        recommendedAction:
          'Keep pages 1-2 together and preserve the page-image backstop note.',
      },
      {
        issueId: 'citation-ag27-overview-reserve-frame',
        sourceId: 'ag27-accelerated-benefits-overview',
        itemId: 'item-ag27-accelerated-benefits-overview-ag27-107-overview-reserve-framing',
        issueType: 'reserve_structure_confirmation',
        details:
          'The opening reserve framing distinguishes non-discounted acceleration from actuarially discounted acceleration and should stay review-only.',
        recommendedAction:
          'Keep the reserve framing as a summary-only boundary slice until later review confirms the wording.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-ag27-overview-window',
        decisionType: 'boundary_check',
        question:
          'Should pages 1-2 remain one review window, or should the opening reserve framing be split from the descriptive overview?',
        whyItMatters:
          'The opening slice needs to stay narrow enough that later interest-accrual material remains separate.',
        recommendedOwner: 'source reviewer',
        priority: 'high',
      },
      {
        decisionId: 'decision-ag27-overview-indexing',
        decisionType: 'indexing_choice',
        question:
          'Should the opening accelerated-benefits overview remain review-only guidance, or should it become a later indexing candidate after page-image confirmation?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-ag27-overview-page-image',
        severity: 'medium',
        issueType: 'page_image_confirmation',
        sourceId: 'ag27-accelerated-benefits-overview',
        itemId: 'item-ag27-accelerated-benefits-overview-ag27-107-overview-reserve-framing',
        message:
          'The AG 27 text layer is noisy, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep pages 1-2 together and preserve the page-image backstop note.',
        evidence:
          'The opening guideline text describes the three categories of accelerated benefits and the reserve framing.',
      },
      {
        issueId: 'issue-ag27-overview-reserve-frame',
        severity: 'medium',
        issueType: 'reserve_method_structure',
        sourceId: 'ag27-accelerated-benefits-overview',
        itemId: 'item-ag27-accelerated-benefits-overview-ag27-107-overview-reserve-framing',
        message:
          'The reserve discussion stays at the structure level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the reserve framing review-only until the later interest-accrual and lien slices are reviewed.',
        evidence:
          'Pages 1-2 cover non-discounted acceleration, actuarially discounted acceleration, and the reserve framing.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag27-overview-coverage',
        status: 'passed',
        details: 'The selected pages capture the AG 27 overview and reserve framing slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 27 opening slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the OCR/page-image caveat.',
      },
      {
        checkId: 'reserve-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the reserve framing as review-only context.',
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
  },
  {
    plannedBatchId: 'batch-108',
    batchSlug: 'ag27-108-interest-accrual',
    sourceId: 'ag27-interest-accrual-approach',
    batchProfile: 'ag27_interest_accrual',
    filename: 'AG 27 - Actuarial Guideline for Accelerated Benefits.pdf',
    sourceTitle: 'AG 27 - Actuarial Guideline for Accelerated Benefits',
    sourceReference: 'Actuarial Guideline XXVII',
    batchTitle: 'interest accrual slice',
    pageWindow: [3, 3],
    sectionReference:
      'AG 27 page 3: interest accrual approach to financing acceleration of benefits and the rate-method disclosure boundary',
    citationText:
      'The insurer accrues an interest charge on the accelerated benefit to account for lost investment income from the date of acceleration to the date of death.',
    summary:
      'AG 27 page 3 explains the interest accrual approach, including how interest may be accrued, paid periodically, or offset against the remaining death benefit, and how the rate method should be disclosed.',
    keywords: [
      'AG 27',
      'Actuarial Guideline XXVII',
      'interest accrual',
      'financing acceleration',
      'actuarial memorandum',
      'rate method',
      'remaining death benefit',
    ],
    notes:
      'Single-page interest-accrual slice; keep the page image as the wording backstop because the text layer is noisy / encoded.',
    sourceNotes:
      'Interest-accrual page only; keep the rate-method disclosure separate from the lien mechanics on pages 4-5.',
    summaryLead:
      'AG 27 page 3 covers the interest-accrual approach and the disclosure boundary for the rate method.',
    reviewFlags: [
      'ocr_text_layer',
      'page_image_backstop',
      'formula_context',
      'documentation_expectation',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    reviewPacketNotes: 'Interest-accrual AG 27 slice remains review-only.',
    reviewPacketIssueCount: 2,
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-ag27-interest-rate-method',
        sourceId: 'ag27-interest-accrual-approach',
        itemId: 'item-ag27-interest-accrual-approach-ag27-108-interest-accrual',
        issueType: 'documentation_expectation',
        details:
          'The rider, policy form, or actuarial memorandum should specify the interest-rate method clearly before anyone treats it as an indexing candidate.',
        recommendedAction:
          'Keep the rate-method disclosure as review-only and do not widen the batch into the lien mechanics.',
      },
      {
        issueId: 'citation-ag27-interest-boundary',
        sourceId: 'ag27-interest-accrual-approach',
        itemId: 'item-ag27-interest-accrual-approach-ag27-108-interest-accrual',
        issueType: 'boundary_split',
        details:
          'Page 3 stays with the interest accrual approach and should not absorb the lien mechanics that start on page 4.',
        recommendedAction:
          'Keep pages 3 and 4 in separate slices so the interest treatment remains review-only.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-ag27-interest-method',
        decisionType: 'documentation_check',
        question:
          'Should the rate-method disclosure remain review-only until the contract or actuarial memorandum wording is confirmed?',
        whyItMatters:
          'The disclosure language affects whether the interest approach can be safely summarized or indexed later.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: 'decision-ag27-interest-boundary',
        decisionType: 'boundary_check',
        question:
          'Should page 3 remain isolated from the lien mechanics on pages 4-5, or does any context need to be carried forward?',
        whyItMatters:
          'The next batch needs a clean transition into the lien mechanics without backfilling page 4.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-ag27-interest-rate-method',
        severity: 'medium',
        issueType: 'documentation_expectation',
        sourceId: 'ag27-interest-accrual-approach',
        itemId: 'item-ag27-interest-accrual-approach-ag27-108-interest-accrual',
        message:
          'The interest-rate method needs to be specified clearly in the contract or memorandum and should stay review-only.',
        recommendedAction:
          'Keep the rate-method language visible and do not treat it as learner-facing output.',
        evidence:
          'Page 3 says the interest-rate method used for discounting must be specified and included in the actuarial memorandum.',
      },
      {
        issueId: 'issue-ag27-interest-formula-context',
        severity: 'medium',
        issueType: 'formula_context',
        sourceId: 'ag27-interest-accrual-approach',
        itemId: 'item-ag27-interest-accrual-approach-ag27-108-interest-accrual',
        message:
          'The interest accrual approach has formula-like treatment and should stay review-only until the wording is confirmed.',
        recommendedAction:
          'Keep the page as a narrow boundary slice and avoid merging it with the lien mechanics.',
        evidence:
          'Page 3 discusses accrual until death, periodic payment, offset against remaining death benefit, and reserve treatment.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag27-interest-coverage',
        status: 'passed',
        details: 'The selected page captures the AG 27 interest accrual slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 27 interest slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the OCR/page-image caveat.',
      },
      {
        checkId: 'interest-method-tracked',
        status: 'passed',
        details: 'The review packet keeps the rate-method language as review-only context.',
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
  },
  {
    plannedBatchId: 'batch-109',
    batchSlug: 'ag27-109-lien-mechanics',
    sourceId: 'ag27-benefit-payment-liens',
    batchProfile: 'ag27_benefit_payment_liens',
    filename: 'AG 27 - Actuarial Guideline for Accelerated Benefits.pdf',
    sourceTitle: 'AG 27 - Actuarial Guideline for Accelerated Benefits',
    sourceReference: 'Actuarial Guideline XXVII',
    batchTitle: 'lien mechanics and closing boundary slice',
    pageWindow: [4, 5],
    sectionReference:
      'AG 27 pages 4-5: benefit payment liens, premium and loan interactions, RPU / ETI alternatives, and the general-considerations closing boundary',
    citationText:
      'The presence of a lien against the policy does not require a pro-rata reduction in the policy premiums or other values.',
    summary:
      'AG 27 closes with benefit payment lien mechanics, including premium and loan interactions, RPU and ETI alternatives, termination and reinstatement behavior, and the general-considerations closing boundary.',
    keywords: [
      'AG 27',
      'Actuarial Guideline XXVII',
      'benefit payment lien',
      'RPU',
      'ETI',
      'policy loans',
      'termination',
      'reinstatement',
    ],
    notes:
      'Two-page lien-mechanics slice; keep the page image as the wording backstop because the text layer is noisy / encoded.',
    sourceNotes:
      'Lien mechanics and closing boundary only; keep the general-considerations language together and do not widen into AG 28.',
    summaryLead:
      'AG 27 pages 4-5 cover lien mechanics, policy-loan interactions, and the closing general-considerations boundary.',
    reviewFlags: [
      'ocr_text_layer',
      'page_image_backstop',
      'calculation_structure',
      'cross_reference_mapping',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    reviewPacketNotes: 'Lien-mechanics AG 27 slice remains review-only.',
    reviewPacketIssueCount: 3,
    reviewPacketCitationIssues: [
      {
        issueId: 'citation-ag27-lien-options',
        sourceId: 'ag27-benefit-payment-liens',
        itemId: 'item-ag27-benefit-payment-liens-ag27-109-lien-mechanics',
        issueType: 'calculation_structure',
        details:
          'The lien treatment includes multiple allowable methods, so the wording should stay review-only until the page image is confirmed.',
        recommendedAction:
          'Keep the lien options visible and do not turn the slice into learner-facing guidance.',
      },
      {
        issueId: 'citation-ag27-lien-boundary',
        sourceId: 'ag27-benefit-payment-liens',
        itemId: 'item-ag27-benefit-payment-liens-ag27-109-lien-mechanics',
        issueType: 'boundary_split',
        details:
          'Pages 4-5 close the AG 27 file and should not widen into AG 28 or any later guideline.',
        recommendedAction:
          'Keep the closing boundary visible and do not widen the batch beyond the AG 27 file.',
      },
      {
        issueId: 'citation-ag27-lien-review-only',
        sourceId: 'ag27-benefit-payment-liens',
        itemId: 'item-ag27-benefit-payment-liens-ag27-109-lien-mechanics',
        issueType: 'page_image_confirmation',
        details:
          'The closing general-considerations language should be confirmed against the page image before any indexing choice is made.',
        recommendedAction:
          'Keep the page-image backstop visible and preserve the review-only status.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: 'decision-ag27-lien-method',
        decisionType: 'calculation_check',
        question:
          'Should the lien mechanics remain review-only until the policyholder option language and loan interactions are confirmed?',
        whyItMatters:
          'The lien treatment has multiple options and should not be over-interpreted from a narrow excerpt.',
        recommendedOwner: 'source reviewer',
        priority: 'high',
      },
      {
        decisionId: 'decision-ag27-lien-boundary',
        decisionType: 'boundary_check',
        question:
          'Should pages 4-5 remain the final AG 27 slice, or should the general-considerations text be split from the lien mechanics on a later cleanup pass?',
        whyItMatters:
          'The closing boundary controls whether the batch stays reviewable and portable.',
        recommendedOwner: 'processor owner',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: 'issue-ag27-lien-options',
        severity: 'medium',
        issueType: 'calculation_structure',
        sourceId: 'ag27-benefit-payment-liens',
        itemId: 'item-ag27-benefit-payment-liens-ag27-109-lien-mechanics',
        message:
          'The lien method options are detailed enough that a human reviewer should confirm the interpretation.',
        recommendedAction:
          'Keep the lien mechanics review-only until the wording is confirmed.',
        evidence:
          'Pages 4-5 discuss no pro-rata reduction, death-benefit deductions, RPU / ETI options, loans, termination, reinstatement, and premium handling.',
      },
      {
        issueId: 'issue-ag27-lien-boundary',
        severity: 'medium',
        issueType: 'boundary_control_window',
        sourceId: 'ag27-benefit-payment-liens',
        itemId: 'item-ag27-benefit-payment-liens-ag27-109-lien-mechanics',
        message:
          'The closing general-considerations section should stay visible as the final AG 27 boundary and should not spill into AG 28.',
        recommendedAction:
          'Keep the closing boundary together and stop at the end of page 5.',
        evidence: 'Pages 4-5 contain the benefit payment lien rules and the general considerations closing material.',
      },
      {
        issueId: 'issue-ag27-lien-page-image',
        severity: 'low',
        issueType: 'page_image_confirmation',
        sourceId: 'ag27-benefit-payment-liens',
        itemId: 'item-ag27-benefit-payment-liens-ag27-109-lien-mechanics',
        message:
          'The page-image wording should remain the backstop because the text layer is noisy / encoded.',
        recommendedAction:
          'Preserve the page-image backstop note in the review packet and unresolved-issues summary.',
        evidence: 'Page 4 opens the lien section and page 5 closes the general-considerations boundary.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag27-lien-coverage',
        status: 'passed',
        details: 'The selected pages capture the AG 27 lien mechanics and closing boundary slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 27 lien slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the OCR/page-image caveat.',
      },
      {
        checkId: 'lien-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the lien mechanics and closing boundary as review-only context.',
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
  },
]

export const ag27BatchDefinitions = Object.fromEntries(
  ag27BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg27Batch(spec)]),
)
