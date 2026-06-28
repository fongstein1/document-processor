const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 41 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg41Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 41 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag41_nonforfeiture_projection',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 41 review-only batch: capture projected nonforfeiture-benefit guidance and keep later guideline files outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 41 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 41 guideline slice is intentionally limited to ${spec.batchTitle} and keeps later guideline files outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 41 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 41 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
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
        flagId: `flag-${sourceId}-projection`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'projection_caveat',
        message:
          'The projected nonforfeiture-benefit rule and valuation-date assumptions should remain visible as review-only context.',
        notes: 'Keep the projection boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 41 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 41 text layer, so page locators should remain the primary anchor.',
        recommendedAction:
          'Keep the page locator and page-image wording backstop visible instead of overclaiming exact line wording.',
      },
      {
        issueId: `citation-${sourceId}-projection-boundary`,
        sourceId,
        itemId,
        issueType: 'calculation_structure',
        details:
          'The projected nonforfeiture-benefit guidance should stay review-only until a human confirms how the guideline interpretation should be applied.',
        recommendedAction:
          'Keep the projection-language wording inside the same narrow review window.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 41 remain indexed as review-only nonforfeiture-projection guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the 2-page file remain a single review-only slice, or should a later cleanup split the background/scope page from the projection-rule page?',
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
          'The AG 41 text layer is encoded, and the page-image wording should remain a visible review note.',
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
        evidence:
          'The source is an encoded 2-page PDF and the text layer does not support stable line mapping.',
      },
      {
        issueId: `issue-${sourceId}-projection-boundary`,
        severity: 'medium',
        issueType: 'calculation_structure',
        sourceId,
        itemId,
        message:
          'The projected nonforfeiture-benefit guidance stays at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the projection-language wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses background interpretation, scope, text, applicability, and valuation-date assumptions.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag41-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 41 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 41 slice carries a source reference and a page locator.',
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
        checkId: 'projection-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the projected nonforfeiture-benefit material as review-only context.',
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
          'AG 41 slices retained as review-only guidance until the wording and any later guideline boundary are confirmed.',
      },
    ],
  }
}

const ag41BatchSpecs = [
  {
    plannedBatchId: 'batch-137',
    batchSlug: 'ag41-137-projection-slice',
    sourceId: 'ag41-projection-benefits',
    filename:
      'AG 41 - Projection of Guaranteed Nonforfeiture Benefits Under CARVM.pdf',
    sourceTitle:
      'AG 41 - Projection of Guaranteed Nonforfeiture Benefits Under CARVM',
    sourceReference: 'Actuarial Guideline XLI',
    batchTitle: 'background, scope, and projected nonforfeiture-benefit slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 41 pages 1-2: background, scope, text, applicability, and valuation-date assumptions.',
    citationText:
      'This Guideline applies to contracts subject to CARVM and the Standard Nonforfeiture Law for Individual Deferred Annuities (SNLIDA).',
    summary:
      'AG 41 projects guaranteed nonforfeiture benefits under CARVM, keeps the valuation-date assumptions review-only, and stays narrow enough to remain a single slice.',
    keywords: [
      'AG 41',
      'Actuarial Guideline XLI',
      'nonforfeiture benefits',
      'CARVM',
      'SNLIDA',
      'valuation date',
      'projection',
      'assumptions',
    ],
    notes:
      'Two-page background / scope / projection window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; later guideline files remain out of scope.',
    summaryLead: 'AG 41 projects guaranteed nonforfeiture benefits under CARVM.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'projection_caveat'],
    reviewPacketNotes: 'Background, scope, and projection slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and whether a later guideline file needs a separate boundary note before indexing.',
  },
]

export const ag41BatchDefinitions = Object.fromEntries(
  ag41BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg41Batch(spec)]),
)
