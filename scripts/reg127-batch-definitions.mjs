const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const sourceTitle = 'Market-Value Adjustments; Withdrawal Charges, Availability of Cash Values'
const sourceReference = 'New York Regulation 127 / 11 CRR-NY Part 44'
const defaultNonLearnerNotes =
  'Regulation 127 stays review-only. Keep page locators primary, preserve the page-image wording backstop, and do not promote any item.'

const makeReg127Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 127 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_127_market_value_adjustments',
    processingIntentText:
      spec.processingIntentText ??
      'Small NY Regulation 127 review-only batch: capture the purpose, legislative background, plan of operations, asset maintenance, noncompliance, and severability while keeping the noisy OCR-like text layer caveat visible.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. Regulation 127 is retained as active NY regulation text and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This Regulation 127 slice is intentionally limited to ${spec.batchTitle} and keeps the later pages outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small NY Regulation 127 batch. Keep the work review-first, preserve page locators and the page-image backstop, and do not promote any item.',
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
          'Regulation 127 slice retained as review-only regulatory text until the wording and boundary are confirmed.',
      },
    ],
  }
}

const reg127BatchSpecs = [
  {
    plannedBatchId: 'batch-269',
    batchSlug: 'reg127-269-market-value-adjustments',
    sourceId: 'reg127-market-value-adjustments',
    filename: '2021 VLM Report_DRAFT-(1-27-2020) with academy Updates V1-Reg-127-11-NYCRR-S044.pdf',
    batchTitle:
      'Regulation 127 purpose, legislative background, plan of operations, asset maintenance, noncompliance, and severability',
    processingIntentText:
      'Capture the purpose, legislative background, plan of operations, asset maintenance, noncompliance, and severability for Regulation 127 while keeping the noisy OCR-like text layer caveat visible.',
    processingIntentNotes:
      'This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText:
      'Batch 269 remains review-only. Regulation 127 is retained as active NY regulation text and is not approved for promotion.',
    reviewPacketReason:
      'The 20-page Regulation 127 slice is intentionally limited to the complete regulation so later cleanup stays outside the batch.',
    nextStep:
      'Confirm the page-image wording for the title page and the severability closeout before any later reuse.',
    flagType: 'page_image_backstop_required',
    flagMessage:
      'Regulation 127 should stay page-image anchored because the text layer is noisy / OCR-like and the exact wording matters.',
    citationIssueType: 'cross_reference_mapping',
    citationDetails:
      'The middle pages reference Insurance Law sections and market-value-adjustment concepts, so the cross-reference map should stay review-only and non-interpretive.',
    citationAction:
      'Keep the references mapped as cross-reference context rather than treating them as the main regulatory duty.',
    decisionType: 'indexing_choice',
    decisionQuestion:
      'Should Regulation 127 remain indexed as active review-only regulatory text, or should later cleanup split the noncompliance and severability material into a separate note?',
    decisionWhy:
      'The indexing choice affects how much of the 20-page window stays together in future review passes.',
    issueType: 'requires_human_interpretation',
    issueMessage:
      'The opening pages and the noncompliance section need page-image confirmation because the text layer is noisy / OCR-like.',
    issueAction:
      'Keep the page-image backstop visible and avoid overclaiming exact wording from the OCR-like layer.',
    issueEvidence:
      'The extracted text is garbled while the page images identify the New York Regulation 127 title page and the severability closeout clearly.',
    validationCheckId: 'reg127-twenty-page-coverage',
    validationCheckDetails: 'The selected page window captures the full 20-page Regulation 127 slice.',
    pageWindow: [1, 20],
    sectionReference: 'Purpose through severability',
    citationText: 'New York Regulation 127 / 11 CRR-NY Part 44, pages 1-20',
    reviewFlags: [
      'jurisdiction_specific_requirement',
      'regulatory_requirement',
      'reporting_requirement',
      'documentation_expectation',
      'governance_or_control_expectation',
      'asset_modeling_judgment',
      'calculation_structure',
      'cross_reference_mapping',
      'background_content',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    reviewStatus: 'needs_human_review',
    itemKind: 'review_note',
    notes:
      'Regulation 127 is a 20-page NY regulation slice. Keep the opening title page, the midsection on market-value adjustments and noncompliance, and the closing severability language in one review-only slice, and preserve the page-image backstop.',
    summary:
      'Regulation 127 covers market-value adjustments, withdrawal charges, cash values, noncompliance, and severability in one bounded NY regulation unit.',
    keywords: [
      'New York Regulation 127',
      '11 CRR-NY Part 44',
      'market-value adjustment',
      'withdrawal charges',
      'cash values',
      'severability',
    ],
    sourceNotes:
      'The PDF metadata identifies a 2021 VLM Report draft compilation, but the page image identifies New York Regulation 127 / 11 CRR-NY Part 44 and the text layer is noisy.',
    reviewPacketNotes:
      'Keep the page-image wording backstop visible and preserve the noncompliance and severability pages as part of the single 20-page slice.',
  },
]

export const reg127BatchDefinitions = Object.fromEntries(
  reg127BatchSpecs.map((spec) => [spec.plannedBatchId, makeReg127Batch(spec)]),
)
