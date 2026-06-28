const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 37 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg37Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 37 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag37_variable_life_gmdb_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 37 review-only batch: capture variable-life GMDB reserve guidance and keep the AG 38 boundary separate.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 37 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 37 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the AG 38 boundary outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 37 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 37 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
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
        flagId: `flag-${sourceId}-gmdb-reserve`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'gmdb_reserve_caveat',
        message:
          'The GMDB reserve assumptions and effective-date material should remain visible as review-only context.',
        notes: 'Keep the reserve-entry boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 37 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-gmdb-reserve-boundary`,
        sourceId,
        itemId,
        issueType: 'reserve_method_structure',
        details:
          'The GMDB reserve guidance should stay review-only until a human confirms how the guideline interpretation should be applied.',
        recommendedAction:
          'Keep the reserve-entry wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-ag38-boundary`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The AG 38 guidance follows after the AG 37 slice and should stay out of scope for this batch.',
        recommendedAction:
          'Keep the AG 38 boundary outside the AG 37 batch and leave the later guideline for a separate plan.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 37 remain indexed as review-only GMDB reserve guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full six-page file remain a three-window review pass, or should a later cleanup split the background from the reserve-entry and effective-date material?',
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
          'The AG 37 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoding-noisy, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-gmdb-reserve-boundary`,
        severity: 'medium',
        issueType: 'reserve_method_structure',
        sourceId,
        itemId,
        message:
          'The GMDB reserve guidance stays at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the reserve-entry wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses GMDB revenues, term cost, the 1/3-Asset Drop, AALR, and effective-date application.',
      },
      {
        issueId: `issue-${sourceId}-ag38-boundary`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The AG 38 guidance follows after the AG 37 slice and should remain out of scope.',
        recommendedAction:
          'Keep the AG 38 boundary outside the AG 37 batch and leave the later guideline for a separate plan.',
        evidence:
          'AG 38 is the next guideline in the folder listing and is not part of this batch.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag37-page-window-coverage',
        status: 'passed',
        details: 'The selected page windows capture the planned AG 37 slices.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 37 slices carry a source reference and page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'gmdb-reserve-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the GMDB reserve material as review-only context.',
      },
      {
        checkId: 'ag38-boundary-tracked',
        status: 'passed',
        details: 'The review packet keeps AG 38 outside the AG 37 batch.',
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
          'AG 37 slices retained as review-only guidance until the wording and AG 38 boundary are confirmed.',
      },
    ],
  }
}

const ag37BatchSpecs = [
  {
    plannedBatchId: 'batch-127',
    batchSlug: 'ag37-127-background-scope',
    sourceId: 'ag37-gmdb-reserves',
    filename: 'AG 37 - Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits.pdf',
    sourceTitle: 'AG 37 - Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits',
    sourceReference: 'Actuarial Guideline XXXVII',
    batchTitle: 'background and scope slice',
    pageWindow: [1, 3],
    sectionReference:
      'AG 37 pages 1-3: background, purpose, scope, and early projection-assumption framing for GMDB reserves.',
    citationText:
      "This guideline's primary focus is to clarify the appropriate projection assumptions and methodologies used to determine statutory reserve liabilities for Guaranteed Minimum Death Benefits offered with variable life insurance products.",
    summary:
      'AG 37 introduces the GMDB reserve guidance, explains the regulatory framing, and keeps the opening scope and background material separate from the reserve-entry mechanics.',
    keywords: [
      'AG 37',
      'Actuarial Guideline XXXVII',
      'GMDB',
      'variable life insurance',
      'projection assumptions',
      'methodologies',
      'scope',
      'background',
    ],
    notes:
      'Three-page background window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the background window stays together and AG 38 remains out of scope.',
    summaryLead: 'AG 37 introduces GMDB reserve guidance.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'background_scope_caveat'],
    reviewPacketNotes: 'Background and scope slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 38 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-128',
    batchSlug: 'ag37-128-definitions-reserve-entry',
    sourceId: 'ag37-gmdb-reserves',
    filename: 'AG 37 - Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits.pdf',
    sourceTitle: 'AG 37 - Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits',
    sourceReference: 'Actuarial Guideline XXXVII',
    batchTitle: 'definitions and reserve-entry slice',
    pageWindow: [4, 5],
    sectionReference:
      'AG 37 pages 4-5: GMDB Revenue, Term cost, 1/3-Asset Drop, Attained Age Level Reserves, and the reserve-entry mechanics.',
    citationText:
      'The GMDB reserve should be adequate to cover the GMDB death claims for the next year in all but the most extreme circumstances so that the regulatory authorities can be assured the company will not run into financial trouble from this source before the next annual statement is filed.',
    summary:
      'AG 37 defines the GMDB reserve inputs and opens the attained-age-level reserve entry point that drives the contract valuation method.',
    keywords: [
      'AG 37',
      'Actuarial Guideline XXXVII',
      'GMDB Revenue',
      'Term cost',
      '1/3-Asset Drop',
      'Attained Age Level Reserves',
      'reserve entry',
      'definitions',
    ],
    notes:
      'Two-page definition and reserve-entry window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the reserve-entry window stays together and AG 38 remains out of scope.',
    summaryLead: 'AG 37 defines GMDB reserve inputs and the reserve-entry method.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'gmdb_reserve_caveat'],
    reviewPacketNotes: 'Definitions and reserve-entry slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 38 boundary before any later indexing choice.',
  },
  {
    plannedBatchId: 'batch-129',
    batchSlug: 'ag37-129-effective-date-closeout',
    sourceId: 'ag37-gmdb-reserves',
    filename: 'AG 37 - Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits.pdf',
    sourceTitle: 'AG 37 - Variable Life Insurance Reserves for Guaranteed Minimum Death Benefits',
    sourceReference: 'Actuarial Guideline XXXVII',
    batchTitle: 'effective-date closeout slice',
    pageWindow: [6, 6],
    sectionReference:
      'AG 37 page 6: effective date, retroactive application, grade-in-period language, and residue closeout material.',
    citationText:
      'This guideline affects all variable life insurance contracts issued.',
    summary:
      'AG 37 closes with the effective-date and retroactive-application boundary for the GMDB reserve guidance.',
    keywords: [
      'AG 37',
      'Actuarial Guideline XXXVII',
      'effective date',
      'retroactive application',
      'grade in period',
      'residue',
      'closeout',
    ],
    notes:
      'Single-page closeout window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; the effective-date window stays together and AG 38 remains out of scope.',
    summaryLead: 'AG 37 closes with the effective-date language.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'effective_date_caveat'],
    reviewPacketNotes: 'Effective-date closeout slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the AG 38 boundary before any later indexing choice.',
  },
]

export const ag37BatchDefinitions = Object.fromEntries(
  ag37BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg37Batch(spec)]),
)
