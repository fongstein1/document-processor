const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 24 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg24Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 24 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag24_variable_life_nonforfeiture_values',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 24 review-only batch: capture the variable-life nonforfeiture guideline slice and keep the OCR-noisy wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 24 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 24 guideline slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 24 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 24 is OCR-noisy, so the text layer should stay review-only until the page image is confirmed.',
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
          'The page-image wording should be confirmed before anyone treats AG 24 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 24 remain indexed as review-only variable-life nonforfeiture guidance, or should it be linked only as a context note?',
        whyItMatters:
          'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page splits remain as the default review windows, or should a later cleanup split the guideline differently?',
        whyItMatters:
          'The page windows control how much formula context is exposed in each review packet.',
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
          'The AG 24 text layer is noisy, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep each planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR text layer is encoded/noisy and the guideline title / nonforfeiture wording should be checked against the page image.',
      },
      {
        issueId: `issue-${sourceId}-formula-context`,
        severity: 'medium',
        issueType: 'formula_context',
        sourceId,
        itemId,
        message:
          'The charge formulas and paid-up-benefit language are formula-heavy enough that a human reviewer should confirm the interpretation.',
        recommendedAction:
          'Keep the formula context visible and do not widen the batch just because the text is dense.',
        evidence:
          'The guideline includes retrospective, prospective, charge-cap, and paid-up-benefit formulas across the page windows.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag24-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 24 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 24 slice carries a source reference and a page locator.',
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
          'AG 24 slice retained as review-only guidance until the page-image wording and formula boundaries are confirmed.',
      },
    ],
  }
}

const ag24BatchSpecs = [
  {
    plannedBatchId: 'batch-102',
    batchSlug: 'ag24-102-overview-retrospective',
    sourceId: 'ag24-variable-life-nonforfeiture-values',
    filename: 'AG 24 - Guideline for Variable Life Non-Forfeiture Values.pdf',
    sourceTitle: 'AG 24 - Guideline for Variable Life Non-Forfeiture Values',
    sourceReference: 'Actuarial Guideline XXIV',
    batchTitle: 'overview and retrospective-method slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 24 Sections A and B: definitions, valuation rate, net cash surrender value, and retrospective method',
    citationText:
      'Minimum cash surrender values for variable life insurance policies shall be determined separately for the basic policy and any benefits and riders for which premiums are paid separately.',
    summary:
      'AG 24 opens with the variable life nonforfeiture framework, the core definitions, and the retrospective method used to determine minimum cash surrender values.',
    keywords: [
      'AG 24',
      'Actuarial Guideline XXIV',
      'variable life non-forfeiture values',
      'valuation rate',
      'net cash surrender value',
      'cash surrender value',
      'policy value',
      'retrospective method',
    ],
    notes:
      'Two-page opening slice; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Current guideline; pages 1-2 stay together as a review-only slice and the OCR noise should not widen the batch.',
    summaryLead: 'AG 24 opens with the variable life nonforfeiture framework and the retrospective method.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop'],
    reviewPacketNotes: 'Opening AG 24 slice remains review-only.',
    reviewPacketIssueCount: 2,
    nextStep:
      'Confirm the opening method and the page-2 boundary before the prospective-method slice runs.',
  },
  {
    plannedBatchId: 'batch-103',
    batchSlug: 'ag24-103-prospective-charge-framework',
    sourceId: 'ag24-variable-life-nonforfeiture-values',
    filename: 'AG 24 - Guideline for Variable Life Non-Forfeiture Values.pdf',
    sourceTitle: 'AG 24 - Guideline for Variable Life Non-Forfeiture Values',
    sourceReference: 'Actuarial Guideline XXIV',
    batchTitle: 'prospective-method and charge-framework slice',
    pageWindow: [3, 4],
    sectionReference:
      'AG 24 prospective method and charge framework: present value structure and policy-value charges',
    citationText:
      'The minimum cash surrender value available on a date as of which interest is credited to the policy shall be equal to [1] - [2] - [3] - [4].',
    summary:
      'AG 24 defines the prospective method and frames the policy-value charges that feed the cash surrender calculation.',
    keywords: [
      'AG 24',
      'Actuarial Guideline XXIV',
      'prospective method',
      'present value of future benefits',
      'present value of future adjusted premiums',
      'service charges',
      'administrative charges',
      'acquisition and other charges',
      'deferred acquisition charges',
      'CPI',
    ],
    notes:
      'Two-page middle slice; the formula-heavy wording should stay review-only until the page image confirms the charge framework.',
    sourceNotes:
      'Current guideline; pages 3-4 stay together as a review-only slice and the OCR noise should not widen the batch.',
    summaryLead:
      'AG 24 continues with the prospective method and the policy-value charge framework.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop'],
    reviewPacketNotes: 'Prospective-method AG 24 slice remains review-only.',
    reviewPacketIssueCount: 2,
    nextStep:
      'Confirm the charge framing and the page-4 boundary before the maximum-charge slice runs.',
  },
  {
    plannedBatchId: 'batch-104',
    batchSlug: 'ag24-104-charge-caps-paid-up-benefits',
    sourceId: 'ag24-variable-life-nonforfeiture-values',
    filename: 'AG 24 - Guideline for Variable Life Non-Forfeiture Values.pdf',
    sourceTitle: 'AG 24 - Guideline for Variable Life Non-Forfeiture Values',
    sourceReference: 'Actuarial Guideline XXIV',
    batchTitle: 'charge-caps and paid-up-benefits slice',
    pageWindow: [5, 6],
    sectionReference:
      'AG 24 surrender-charge caps, deferred acquisition charges, and paid-up nonforfeiture benefits',
    citationText:
      'The maximum allowable surrender charge for any year shall be the maximum initial surrender charge multiplied by l[x+t]/l[x].',
    summary:
      'AG 24 closes with the surrender-charge caps, the deferred acquisition charge language, and the minimum paid-up nonforfeiture benefit requirement.',
    keywords: [
      'AG 24',
      'Actuarial Guideline XXIV',
      'surrender charge',
      'deferred acquisition charges',
      'maximum allowable surrender charge',
      'paid-up nonforfeiture benefit',
      'secondary guarantees',
      'substandard mortality',
      'minimum paid-up benefits',
    ],
    notes:
      'Closing two-page slice; the formula-heavy wording and paid-up-benefit language should remain review-only.',
    sourceNotes:
      'Current guideline; pages 5-6 stay together as a review-only slice and the OCR noise should not widen the batch.',
    summaryLead:
      'AG 24 closes with the surrender-charge caps and the paid-up nonforfeiture benefit requirement.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'formula_context'],
    reviewPacketNotes: 'Closing AG 24 slice remains review-only.',
    reviewPacketIssueCount: 2,
    nextStep:
      'Confirm the formula wording and the closing page-6 boundary before any later cleanup pass.',
  },
]

export const ag24BatchDefinitions = Object.fromEntries(
  ag24BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg24Batch(spec)]),
)
