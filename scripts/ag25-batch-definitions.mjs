const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 25 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg25Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 25 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag25_indexed_increasing_death_benefits',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 25 review-only batch: capture the indexed increasing death-benefits guideline slice and keep the OCR-noisy wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 25 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 25 guideline slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 25 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 25 is OCR-noisy, so the text layer should stay review-only until the page image is confirmed.',
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
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 25 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 25 remain indexed as review-only indexed-death-benefits guidance, or should it be linked only as a context note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full three-page file remain a single review window, or should a later cleanup split the low-amount exception into its own note?',
        whyItMatters:
          'The page window controls how much formula context is exposed in each review packet.',
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
          'The AG 25 text layer is noisy, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR text layer is encoded/noisy and the guideline title / indexed-death-benefits wording should be checked against the page image.',
      },
      {
        issueId: `issue-${sourceId}-formula-context`,
        severity: 'medium',
        issueType: 'formula_context',
        sourceId,
        itemId,
        message:
          'The annual-increase and threshold language are formula-heavy enough that a human reviewer should confirm the interpretation.',
        recommendedAction:
          'Keep the formula context visible and do not widen the batch just because the text is dense.',
        evidence:
          'The guideline includes CPI-based increase assumptions, cash value accumulation test references, and a low-amount exception.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag25-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 25 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 25 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the OCR/page-image caveat.',
      },
      {
        checkId: 'formula-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the formula-heavy language as review-only context.',
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
        reviewPacketIssueCount: spec.reviewPacketIssueCount ?? 2,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 25 slice retained as review-only guidance until the page-image wording and formula boundaries are confirmed.',
      },
    ],
  }
}

const ag25BatchSpecs = [
  {
    plannedBatchId: 'batch-105',
    batchSlug: 'ag25-105-indexed-increasing-death-benefits',
    sourceId: 'ag25-guaranteed-increasing-death-benefits-index',
    filename:
      'AG 25 - Guideline for Calculation of Minimum Reserves and Minimum Non-Forfeiture Values for Policies with Guaranteed Increasing Death Benefits Based o.pdf',
    sourceTitle:
      'AG 25 - Guideline for Calculation of Minimum Reserves and Minimum Non-Forfeiture Values for Policies with Guaranteed Increasing Death Benefits Based on an Index',
    sourceReference: 'Actuarial Guideline XXV',
    batchTitle: 'indexed increasing death-benefits slice',
    pageWindow: [1, 3],
    sectionReference:
      'AG 25 Sections I and II: indexed increasing death benefits, CPI-based annual increase assumptions, and low-amount exception',
    citationText:
      'For a policy where premiums are fixed in amount at issue which provides for whole life insurance with the amount of death benefit adjusted periodically with the Consumer Price Index or another cost of living index, the value of the minimum reserve at any time shall be based on the maximum valuation interest rate for the year of issue and an acceptable mortality table for life insurance statutory reserves.',
    summary:
      'AG 25 opens with the indexed increasing death-benefits framework, CPI-adjusted annual increase assumptions, and the low-amount policy exception.',
    keywords: [
      'AG 25',
      'Actuarial Guideline XXV',
      'guaranteed increasing death benefits',
      'Consumer Price Index',
      'cash value accumulation test',
      'annual increase',
      'threshold amount',
      'maximum valuation interest rate',
    ],
    notes:
      'Three-page guideline; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Current guideline; pages 1-3 stay together as a review-only slice and the OCR noise should not widen the batch.',
    summaryLead:
      'AG 25 opens with the index-based increasing death-benefits framework and the low-amount policy exception.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'formula_context'],
    reviewPacketNotes: 'Opening AG 25 slice remains review-only.',
    reviewPacketIssueCount: 2,
    nextStep:
      'Confirm the indexed increase assumptions and the page-3 closure before any later cleanup pass.',
  },
]

export const ag25BatchDefinitions = Object.fromEntries(
  ag25BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg25Batch(spec)]),
)
