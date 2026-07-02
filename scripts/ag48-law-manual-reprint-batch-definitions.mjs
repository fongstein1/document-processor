const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const sourceTitle = 'AG 48 - AOMR for Reinsurers from 2021 Law Manual'
const sourceReference = 'Actuarial Guideline XLVIII / 2021 Law Manual reprint'

const ag48LawManualReprintBatchSpecs = [
  {
    plannedBatchId: 'batch-278',
    batchSlug: 'ag48-law-manual-reprint-278',
    sourceId: 'ag48-law-manual-reprint',
    filename: 'AG 48 - AOMR for Reinsurers-from 2021 Law Manual.pdf',
    batchTitle:
      'AG 48 Law Manual reprint background, authority/scope, reinsurance/security method, opinion/memorandum material, effective date, and sunset provision',
    nextStep:
      'Confirm the companion reprint relationship against the active AG 48 review index before any later reuse.',
    pageWindow: [1, 16],
    sectionReference: 'Background through sunset provision',
    citationText: 'Actuarial Guideline XLVIII / 2021 Law Manual reprint, pages 1-16',
    summary:
      'The AG 48 Law Manual reprint covers reinsurance reserve-financing background, covered-policy scope, security and actuarial method material, opinion and memorandum requirements, effective-date language, and the sunset provision in one bounded companion source.',
    keywords: [
      'AG 48',
      'Law Manual reprint',
      'reinsurance',
      'primary security',
      'actuarial method',
      'actuarial opinion',
      'sunset provision',
    ],
  },
]

const makeAg48LawManualReprintBatch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 48 Law Manual reprint controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag48_law_manual_reprint',
    processingIntentText:
      'Capture the AG 48 Law Manual reprint as a separate companion review-only source and keep the duplicate/reprint caveat visible.',
    processingIntentNotes:
      'This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText:
      'Batch 278 remains review-only. The AG 48 Law Manual reprint is retained as companion-only evidence and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This AG 48 Law Manual reprint slice is intentionally limited to the complete 16-page companion source.',
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 48 Law Manual reprint batch. Keep the work review-first, preserve page locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'duplicate_reprint_source',
        message:
          'The active AG 48 PDF already has tracked review artifacts; this Law Manual reprint should stay companion-only until a human confirms the relationship.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop for any exact comparison against the active AG 48 source.',
        notes: 'Keep the image backstop visible as a review note.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-duplicate-reprint`,
        sourceId,
        itemId,
        issueType: 'duplicate_source_check',
        details:
          'The Law Manual reprint should be compared against the already-indexed active AG 48 source before any later reuse.',
        recommendedAction:
          'Keep the reprint indexed as companion-only evidence and do not merge it into the active AG 48 handoff automatically.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: 'duplicate_source_disposition',
        question:
          'Should the AG 48 Law Manual reprint remain a separate companion index, or should a later reviewer reconcile it with the active AG 48 source?',
        whyItMatters:
          'The duplicate/reprint disposition affects whether later review uses this as corroborating evidence or a separate source record.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}`,
        severity: 'medium',
        issueType: 'requires_human_interpretation',
        sourceId,
        itemId,
        message:
          'The reprint relationship and any wording differences from the active AG 48 PDF need human confirmation.',
        recommendedAction:
          'Keep the duplicate/reprint caveat visible and avoid promoting or merging the source automatically.',
        evidence:
          'The page images identify a 2021 Law Manual reprint of Actuarial Guideline XLVIII, while the active AG 48 PDF already has tracked review artifacts.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Controlled manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag48-law-manual-reprint-sixteen-page-coverage',
        status: 'passed',
        details: 'The selected page window captures the full 16-page AG 48 Law Manual reprint slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The selected page carries a source reference and a page locator.',
      },
      {
        checkId: 'unresolved-issues-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the open review items.',
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
        sourceTitle,
        sourceReference,
        versionDate: '2021',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: 'high',
        reviewFlags: [
          'actuarial_guideline',
          'companion_reprint',
          'duplicate_source_check',
          'regulatory_requirement',
          'reserve_method_structure',
          'reinsurance',
          'calculation_structure',
          'definition_or_terminology',
          'cross_reference_mapping',
          'background_content',
          'boundary_control_window',
          'requires_human_interpretation',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'AG 48 Law Manual reprint retained as a separate companion source. Keep it review-only and do not merge with the active AG 48 handoff without human review.',
        summary: spec.summary,
        keywords: spec.keywords,
        sourceNotes:
          'This source is a 2021 Law Manual reprint of AG 48 material and is intentionally separated from the active AG 48 PDF already processed in batches 154-156.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'guideline',
        reviewPacketNotes:
          'Keep the duplicate/reprint caveat visible and preserve the 16-page boundary.',
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 48 Law Manual reprint retained as review-only companion evidence until the duplicate-source relationship is confirmed.',
      },
    ],
  }
}

export const ag48LawManualReprintBatchDefinitions = Object.fromEntries(
  ag48LawManualReprintBatchSpecs.map((spec) => [
    spec.plannedBatchId,
    makeAg48LawManualReprintBatch(spec),
  ]),
)
