const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 34 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg34Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 34 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag34_vamgdb_reserves_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 34 review-only batch: capture variable-annuity MGDB reserve guidance and keep the AG 35 boundary separate.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 34 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 34 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the AG 35 boundary outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 34 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 34 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the guideline text is encoding-noisy.',
        notes: 'Keep the image backstop visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-mortality-tables`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'mortality_table_caveat',
        message:
          'The mortality tables and appendix material should remain visible as review-only context.',
        notes: 'Keep the table-driven boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 34 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-mortality-basis-boundary`,
        sourceId,
        itemId,
        issueType: 'reserve_method_structure',
        details:
          'The mortality basis and asset-adequacy requirements should stay review-only until a human confirms how the guideline interpretation should be applied.',
        recommendedAction:
          'Keep the mortality-basis / asset-adequacy wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-ag35-boundary`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The AG 35 guidance follows after the AG 34 slice and should stay out of scope for this batch.',
        recommendedAction:
          'Keep the AG 35 boundary outside the AG 34 batch and leave the later guideline for a separate plan.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 34 remain indexed as review-only MGDB reserve guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full eleven-page file remain a three-window review pass, or should a later cleanup split the methodology from the table-heavy appendix material?',
        whyItMatters: 'The page window controls how much context is exposed in each review packet.',
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
          'The AG 34 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-mortality-basis-boundary`,
        severity: 'medium',
        issueType: 'reserve_method_structure',
        sourceId,
        itemId,
        message:
          'The mortality basis and asset-adequacy guidance stay at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the mortality-basis / asset-adequacy wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses mortality tables, asset adequacy analysis, and table-driven reserve inputs.',
      },
      {
        issueId: `issue-${sourceId}-ag35-boundary`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The AG 35 guidance follows after the AG 34 slice and should remain out of scope.',
        recommendedAction:
          'Keep the AG 35 boundary outside the AG 34 batch and leave the later guideline for a separate plan.',
        evidence:
          'AG 35 is the next guideline in the folder listing and is not part of this batch.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag34-page-window-coverage',
        status: 'passed',
        details: 'The selected page windows capture the planned AG 34 slices.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 34 slices carry a source reference and page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'mortality-table-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the mortality-table and appendix material as review-only context.',
      },
      {
        checkId: 'ag35-boundary-tracked',
        status: 'passed',
        details: 'The review packet keeps AG 35 outside the AG 34 batch.',
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
          'AG 34 slices retained as review-only guidance until the wording and AG 35 boundary are confirmed.',
      },
    ],
  }
}

const ag34BatchSpecs = [
  {
    plannedBatchId: 'batch-117',
    batchSlug: 'ag34-117-foundation-methodology',
    sourceId: 'ag34-mgdb-reserves',
    filename: 'AG 34 - Variable Annuity Minimum Guaranteed Death Benefit Reserves.pdf',
    sourceTitle: 'AG 34 - Variable Annuity Minimum Guaranteed Death Benefit Reserves',
    sourceReference: 'Actuarial Guideline XXXIV',
    batchTitle: 'foundation and reserve-methodology slice',
    pageWindow: [1, 3],
    sectionReference:
      'AG 34 pages 1-3: background information, purpose, scope, definitions, and reserve-method foundation.',
    citationText:
      'The purpose of this Actuarial Guideline is to interpret the standards for the valuation of reserves for Minimum Guaranteed Death Benefits included in variable annuity contracts.',
    summary:
      'AG 34 explains how CARVM applies to variable annuity contracts with minimum guaranteed death benefits, including the separate reserve, integrated reserve, and general reserve framing.',
    keywords: [
      'AG 34',
      'Actuarial Guideline XXXIV',
      'MGDB',
      'variable annuity',
      'separate reserve',
      'integrated reserve',
      'reserve methodology',
      'definitions',
    ],
    notes:
      'Three-page foundation window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the foundation window stays together and AG 35 remains out of scope.',
    summaryLead: 'AG 34 defines MGDB reserve methodology.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'reserve_method_structure_caveat'],
    reviewPacketNotes: 'Foundation slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 35 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-118',
    batchSlug: 'ag34-118-mortality-asset-adequacy',
    sourceId: 'ag34-mgdb-reserves',
    filename: 'AG 34 - Variable Annuity Minimum Guaranteed Death Benefit Reserves.pdf',
    sourceTitle: 'AG 34 - Variable Annuity Minimum Guaranteed Death Benefit Reserves',
    sourceReference: 'Actuarial Guideline XXXIV',
    batchTitle: 'mortality basis and asset-adequacy slice',
    pageWindow: [4, 6],
    sectionReference:
      'AG 34 pages 4-6: mortality basis, asset adequacy analysis requirement, effective date, and the immediate-drop / gross-assumed-returns table.',
    citationText:
      'The appointed actuary shall perform a standalone asset adequacy analysis of the total reserve held for all of the contracts falling within the scope of this Guideline.',
    summary:
      'AG 34 adds the mortality basis, standalone asset adequacy requirement, effective-date closeout, and the immediate-drop / gross-assumed-returns table that feeds the reserve calculation.',
    keywords: [
      'AG 34',
      'Actuarial Guideline XXXIV',
      'mortality basis',
      'asset adequacy analysis',
      'effective date',
      'immediate drop percentages',
      'gross assumed returns',
    ],
    notes:
      'Three-page mechanics window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the mortality and asset-adequacy window stays together and AG 35 remains out of scope.',
    summaryLead: 'AG 34 adds the mortality and asset-adequacy framework.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'mortality_adequacy_caveat'],
    reviewPacketNotes: 'Mortality / asset-adequacy slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 35 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-119',
    batchSlug: 'ag34-119-mortality-tables-appendix',
    sourceId: 'ag34-mgdb-reserves',
    filename: 'AG 34 - Variable Annuity Minimum Guaranteed Death Benefit Reserves.pdf',
    sourceTitle: 'AG 34 - Variable Annuity Minimum Guaranteed Death Benefit Reserves',
    sourceReference: 'Actuarial Guideline XXXIV',
    batchTitle: 'mortality tables and appendix slice',
    pageWindow: [7, 11],
    sectionReference:
      'AG 34 pages 7-11: female and male mortality tables by age-last-birthday and age-nearest-birthday basis, plus Appendix II asset-class descriptions.',
    citationText:
      'The mortality basis used to discount projected death benefits is the 1983 Group Annuity Mortality Basic Table increased by 10% for margins and contingencies, without projection.',
    summary:
      'AG 34 includes the mortality tables used for the MGDB reserve calculation and the Appendix II asset-class descriptions that support the assumed return structure.',
    keywords: [
      'AG 34',
      'Actuarial Guideline XXXIV',
      'mortality tables',
      'age last birthday',
      'age nearest birthday',
      'Appendix II',
      'asset classes',
      'assumed returns',
    ],
    notes:
      'Five-page appendix window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the appendix tables stay together and AG 35 remains out of scope.',
    summaryLead: 'AG 34 closes with mortality tables and asset-class descriptions.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'mortality_table_caveat'],
    reviewPacketNotes: 'Mortality table and appendix slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 35 boundary before any later indexing choice.',
  },
]

export const ag34BatchDefinitions = Object.fromEntries(
  ag34BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg34Batch(spec)]),
)
