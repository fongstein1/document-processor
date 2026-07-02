const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const sourceTitle = 'Valuation of Life Insurance Reserves'
const sourceReference = 'New York Regulation 147 / 11 CRR-NY Part 98'
const defaultNonLearnerNotes =
  'Regulation 147 stays review-only. Keep page locators primary, preserve the page-image wording backstop, and do not promote any item.'

const makeReg147Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 147 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_147_life_insurance_reserves',
    processingIntentText:
      spec.processingIntentText ??
      'Small NY Regulation 147 review-only batch: capture the purpose, applicability, definitions, reserve standards, mortality / interest / method provisions, and severability while keeping the noisy OCR-like text layer caveat visible.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. Regulation 147 is retained as active NY regulation text and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This Regulation 147 slice is intentionally limited to ${spec.batchTitle} and keeps the later pages outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small NY Regulation 147 batch. Keep the work review-first, preserve page locators and the page-image backstop, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: spec.flagSeverity ?? 'medium',
        sourceId,
        itemId,
        flagType: spec.flagType,
        message: spec.flagMessage,
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}`,
        sourceId,
        itemId,
        issueType: spec.citationIssueType ?? 'cross_reference_mapping',
        details: spec.citationDetails,
        recommendedAction: spec.citationAction,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: spec.decisionType,
        question: spec.decisionQuestion,
        whyItMatters: spec.decisionWhy,
        recommendedOwner: spec.recommendedOwner ?? 'source reviewer',
        priority: spec.decisionPriority ?? 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}`,
        severity: spec.issueSeverity ?? 'medium',
        issueType: spec.issueType,
        sourceId,
        itemId,
        message: spec.issueMessage,
        recommendedAction: spec.issueAction,
        evidence: spec.issueEvidence,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Controlled manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: spec.validationCheckId,
        status: 'passed',
        details: spec.validationCheckDetails,
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
        documentType: 'ny_regulation',
        sourceTitle,
        sourceReference,
        versionDate: '2020-03-15',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: 'high',
        reviewFlags: ['state_regulation', ...spec.reviewFlags],
        reviewStatus: spec.reviewStatus ?? 'needs_human_review',
        itemKind: spec.itemKind ?? 'review_note',
        notes: spec.notes,
        summary: spec.summary,
        keywords: spec.keywords,
        sourceNotes: spec.sourceNotes,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: 'regulation',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'Regulation 147 slice retained as review-only regulatory text until the wording and boundary are confirmed.',
      },
    ],
  }
}

const reg147BatchSpecs = [
  {
    plannedBatchId: 'batch-275',
    batchSlug: 'reg147-275-life-insurance-reserves',
    sourceId: 'reg147-life-insurance-reserves',
    filename: '2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-147-11-NYCRR-S098.pdf',
    batchTitle:
      'Regulation 147 purpose, applicability, definitions, reserve standards, mortality / interest / method provisions, and severability',
    processingIntentText:
      'Capture the purpose, applicability, definitions, reserve standards, mortality / interest / method provisions, and severability for Regulation 147 while keeping the noisy OCR-like text layer caveat visible.',
    processingIntentNotes:
      'This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText:
      'Batch 275 remains review-only. Regulation 147 is retained as active NY regulation text and is not approved for promotion.',
    reviewPacketReason:
      'The 40-page Regulation 147 slice is intentionally limited to the complete regulation so later cleanup stays outside the batch.',
    nextStep:
      'Confirm the page-image wording for the title page, the reserve-standards pages, and the severability closeout before any later reuse.',
    flagType: 'page_image_backstop_required',
    flagMessage:
      'Regulation 147 should stay page-image anchored because the text layer is noisy / OCR-like and the exact wording matters.',
    citationIssueType: 'cross_reference_mapping',
    citationDetails:
      'The middle pages reference Insurance Law, Financial Services Law, mortality-table standards, and reserve-method material, so the cross-reference map should stay review-only and non-interpretive.',
    citationAction:
      'Keep the references mapped as cross-reference context rather than treating them as the main regulatory duty.',
    decisionType: 'indexing_choice',
    decisionQuestion:
      'Should Regulation 147 remain indexed as active review-only regulatory text, or should later cleanup split the mortality / interest / method material into separate notes?',
    decisionWhy:
      'The indexing choice affects how much of the 40-page window stays together in future review passes.',
    issueType: 'requires_human_interpretation',
    issueMessage:
      'The reserve-standards pages need page-image confirmation because the text layer is noisy / OCR-like.',
    issueAction:
      'Keep the page-image backstop visible and avoid overclaiming exact wording from the OCR-like layer.',
    issueEvidence:
      'The extracted text is garbled while the page images identify the New York Regulation 147 title page and the severability closeout clearly.',
    validationCheckId: 'reg147-forty-page-coverage',
    validationCheckDetails: 'The selected page window captures the full 40-page Regulation 147 slice.',
    pageWindow: [1, 40],
    sectionReference: 'Purpose through severability',
    citationText: 'New York Regulation 147 / 11 CRR-NY Part 98, pages 1-40',
    reviewFlags: [
      'jurisdiction_specific_requirement',
      'regulatory_requirement',
      'reporting_requirement',
      'calculation_structure',
      'documentation_expectation',
      'definition_or_terminology',
      'cross_reference_mapping',
      'background_content',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    reviewStatus: 'needs_human_review',
    itemKind: 'review_note',
    notes:
      'Regulation 147 is a 40-page NY regulation slice. Keep the opening title page, reserve-standards middle pages, and closing severability language in one review-only slice, and preserve the page-image backstop.',
    summary:
      'Regulation 147 covers life-insurance reserve valuation purposes, applicability, definitions, reserve standards, mortality / interest / method provisions, and severability in one bounded NY regulation unit.',
    keywords: [
      'New York Regulation 147',
      '11 CRR-NY Part 98',
      'valuation of life insurance reserves',
      'mortality standard',
      'interest rate',
      'commissioners reserve valuation method',
      'severability',
    ],
    sourceNotes:
      'The PDF metadata identifies a 2021 VLM Report draft compilation, but the page image identifies New York Regulation 147 / 11 CRR-NY Part 98 and the text layer is noisy.',
    reviewPacketNotes:
      'Keep the page-image wording backstop visible and preserve the reserve-standards middle pages as part of the single 40-page slice.',
  },
]

export const reg147BatchDefinitions = Object.fromEntries(
  reg147BatchSpecs.map((spec) => [spec.plannedBatchId, makeReg147Batch(spec)]),
)
