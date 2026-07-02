const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const sourceTitle = 'AG 38 - CRVM for UL from 2021 Law Manual'
const sourceReference = 'Actuarial Guideline XXXVIII / 2021 Law Manual reprint'

const ag38LawManualReprintBatchSpecs = [
  {
    plannedBatchId: 'batch-280',
    batchSlug: 'ag38-law-manual-reprint-280',
    sourceId: 'ag38-law-manual-reprint',
    filename: 'AG 38 - CRVM for UL-from 2021 Law Manual.pdf',
    batchTitle:
      'AG 38 Law Manual reprint background, examples, deterministic reserve mechanics, opinion / representation material, and closeout',
    nextStep:
      'Confirm the companion reprint relationship against the active AG 38 review index before any later reuse.',
    pageWindow: [1, 23],
    sectionReference: 'Background through closeout',
    citationText: 'Actuarial Guideline XXXVIII / 2021 Law Manual reprint, pages 1-23',
    summary:
      'The AG 38 Law Manual reprint covers Model 830 application background, guarantee examples, deterministic reserve mechanics, opinion and company-representation material, and closeout in one bounded companion source.',
    keywords: [
      'AG 38',
      'Law Manual reprint',
      'Model 830',
      'universal life',
      'deterministic reserve',
      'guarantees',
      'actuarial opinion',
    ],
  },
]

const makeAg38LawManualReprintBatch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 38 Law Manual reprint controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag38_law_manual_reprint',
    processingIntentText:
      'Capture the AG 38 Law Manual reprint as a separate companion review-only source and keep the duplicate/reprint caveat visible.',
    processingIntentNotes:
      'This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText:
      'Batch 280 remains review-only. The AG 38 Law Manual reprint is retained as companion-only evidence and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason:
      'This AG 38 Law Manual reprint slice is intentionally limited to the complete 23-page companion source.',
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 38 Law Manual reprint batch. Keep the work review-first, preserve page locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'duplicate_reprint_source',
        message:
          'The active AG 38 PDF already has tracked review artifacts; this Law Manual reprint should stay companion-only until a human confirms the relationship.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop for any exact comparison against the active AG 38 source.',
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
          'The Law Manual reprint should be compared against the already-indexed active AG 38 source before any later reuse.',
        recommendedAction:
          'Keep the reprint indexed as companion-only evidence and do not merge it into the active AG 38 handoff automatically.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: 'duplicate_source_disposition',
        question:
          'Should the AG 38 Law Manual reprint remain a separate companion index, or should a later reviewer reconcile it with the active AG 38 source?',
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
          'The reprint relationship and any wording differences from the active AG 38 PDF need human confirmation.',
        recommendedAction:
          'Keep the duplicate/reprint caveat visible and avoid promoting or merging the source automatically.',
        evidence:
          'The page images identify a 2021 Law Manual reprint of Actuarial Guideline XXXVIII, while the active AG 38 PDF already has tracked review artifacts.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Controlled manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag38-law-manual-reprint-twenty-three-page-coverage',
        status: 'passed',
        details: 'The selected page window captures the full 23-page AG 38 Law Manual reprint slice.',
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
          'calculation_structure',
          'formula_context',
          'prescribed_assumption',
          'company_or_prudent_estimate_assumption',
          'reporting_requirement',
          'documentation_expectation',
          'governance_or_control_expectation',
          'definition_or_terminology',
          'cross_reference_mapping',
          'background_content',
          'boundary_control_window',
          'requires_human_interpretation',
        ],
        reviewStatus: 'needs_human_review',
        itemKind: 'review_note',
        notes:
          'AG 38 Law Manual reprint retained as a separate companion source. Keep it review-only and do not merge with the active AG 38 handoff without human review.',
        summary: spec.summary,
        keywords: spec.keywords,
        sourceNotes:
          'This source is a 2021 Law Manual reprint of AG 38 material and is intentionally separated from the active AG 38 PDF already processed in batches 130-133.',
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'guideline',
        reviewPacketNotes:
          'Keep the duplicate/reprint caveat visible and preserve the 23-page boundary.',
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 38 Law Manual reprint retained as review-only companion evidence until the duplicate-source relationship is confirmed.',
      },
    ],
  }
}

export const ag38LawManualReprintBatchDefinitions = Object.fromEntries(
  ag38LawManualReprintBatchSpecs.map((spec) => [
    spec.plannedBatchId,
    makeAg38LawManualReprintBatch(spec),
  ]),
)
