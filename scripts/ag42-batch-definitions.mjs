const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 42 stays review-only. Keep the page-image wording backstop visible, prefer page locators when line references are unavailable, and do not promote any item.'

const makeAg42Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 42 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag42_preferred_mortality_tables',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 42 review-only batch: capture preferred-mortality-table guidance and keep later guideline files outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 42 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 42 guideline slice is intentionally limited to ${spec.batchTitle} and keeps later guideline files outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 42 guideline batch. Keep the work review-first, preserve the page locator, treat the page image as the wording backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 42 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
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
        flagId: `flag-${sourceId}-mortality`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'preferred_mortality_caveat',
        message:
          'The preferred-mortality selection and periodic-assessment guidance should remain visible as review-only context.',
        notes: 'Keep the boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 42 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-unavailable`,
        sourceId,
        itemId,
        issueType: 'line_reference_unavailable',
        details:
          'Stable line references are not expected for the encoded AG 42 text layer, so page locators should remain the primary anchor.',
        recommendedAction:
          'Keep the page locator and page-image wording backstop visible instead of overclaiming exact line wording.',
      },
      {
        issueId: `citation-${sourceId}-preferred-mortality-boundary`,
        sourceId,
        itemId,
        issueType: 'calculation_structure',
        details:
          'The preferred-mortality guidance should stay review-only until a human confirms how the guideline interpretation should be applied.',
        recommendedAction:
          'Keep the selection and reporting-language wording inside the same narrow review window.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 42 remain indexed as review-only preferred-mortality guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the 4-page file remain two review-only slices, or should a later cleanup split the setup page group from the assessment/disclosure page group?',
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
          'The AG 42 text layer is encoded, and the page-image wording should remain a visible review note.',
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
          'The source is an encoded 4-page PDF and the text layer does not support stable line mapping.',
      },
      {
        issueId: `issue-${sourceId}-preferred-mortality-boundary`,
        severity: 'medium',
        issueType: 'calculation_structure',
        sourceId,
        itemId,
        message:
          'The preferred-mortality guidance stays at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the selection and reporting-language wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses background interpretation, scope, definitions, assessment, and annual disclosures.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag42-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 42 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 42 slice carries a source reference and a page locator.',
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
        checkId: 'preferred-mortality-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the preferred-mortality material as review-only context.',
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
          'AG 42 slices retained as review-only guidance until the wording and any later guideline boundary are confirmed.',
      },
    ],
  }
}

const ag42BatchSpecs = [
  {
    plannedBatchId: 'batch-138',
    batchSlug: 'ag42-138-setup-slice',
    sourceId: 'ag42-preferred-mortality-tables',
    filename:
      'AG 42 - The Application of the Model Regulation Permitting the Recognition of Preferred Mortality Tables for Use in Determining Minimum Reserve Liabil.pdf',
    sourceTitle:
      'AG 42 - The Application of the Model Regulation Permitting the Recognition of Preferred Mortality Tables for Use in Determining Minimum Reserve Liabilities',
    sourceReference: 'Actuarial Guideline XLII',
    batchTitle: 'background, scope, definitions, and selection-criteria slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 42 pages 1-2: purpose, effective date, scope, definitions, and initial preferred-mortality selection / certification criteria.',
    citationText:
      'The purpose of this Guideline is to provide rules and guidance to appointed actuaries in the selection of the proper set of mortality rates.',
    summary:
      'AG 42 establishes the preferred-mortality framework, the effective-date and scope rules, the initial definition set, and the certification criteria for the selected mortality table.',
    keywords: [
      'AG 42',
      'Actuarial Guideline XLII',
      'preferred mortality tables',
      'mortality rates',
      'certification',
      'selection criteria',
      'definitions',
    ],
    notes:
      'Two-page background / scope / definitions window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; later guideline files remain out of scope.',
    summaryLead: 'AG 42 establishes the preferred-mortality framework.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'preferred_mortality_caveat'],
    reviewPacketNotes: 'Background, scope, and selection slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and whether a later guideline file needs a separate boundary note before indexing.',
  },
  {
    plannedBatchId: 'batch-139',
    batchSlug: 'ag42-139-assessment-disclosure-slice',
    sourceId: 'ag42-preferred-mortality-tables',
    filename:
      'AG 42 - The Application of the Model Regulation Permitting the Recognition of Preferred Mortality Tables for Use in Determining Minimum Reserve Liabil.pdf',
    sourceTitle:
      'AG 42 - The Application of the Model Regulation Permitting the Recognition of Preferred Mortality Tables for Use in Determining Minimum Reserve Liabilities',
    sourceReference: 'Actuarial Guideline XLII',
    batchTitle: 'periodic assessment and disclosure slice',
    pageWindow: [3, 4],
    sectionReference:
      'AG 42 pages 3-4: periodic assessment of anticipated mortality and communications/disclosures.',
    citationText:
      'The appointed actuary shall provide to the commissioner an annual certification that, as of the valuation date, the anticipated mortality experience of each Class of business meets the criteria.',
    summary:
      'AG 42 requires annual reassessment of anticipated mortality, periodic testing, and annual certification and reporting support for the preferred-mortality table election.',
    keywords: [
      'AG 42',
      'Actuarial Guideline XLII',
      'preferred mortality tables',
      'annual certification',
      'annual report',
      'credibility',
      'periodic assessment',
      'disclosure',
    ],
    notes:
      'Two-page periodic assessment / disclosure window; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; later guideline files remain out of scope.',
    summaryLead: 'AG 42 requires annual reassessment and disclosure support.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'preferred_mortality_caveat'],
    reviewPacketNotes: 'Periodic assessment and disclosure slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and whether a later guideline file needs a separate boundary note before indexing.',
  },
]

export const ag42BatchDefinitions = Object.fromEntries(
  ag42BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg42Batch(spec)]),
)
