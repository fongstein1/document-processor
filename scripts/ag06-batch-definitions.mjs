const rawSourceFile =
  'Actuarial Guidelines/AG 06 - Interpretation Regarding Use of Single or Joint Life Mortality Tables.pdf'
const sourceFamilyId = 'actuarial_guidelines'
const sourceTitle = 'AG 06 - Interpretation Regarding Use of Single or Joint Life Mortality Tables'
const sourceReference = 'Actuarial Guideline VI'
const defaultNonLearnerNotes =
  'Two-page guideline slice retained as review-only until the indexing choice is explicitly confirmed.'

const makeAg06Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 06 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag06_two_page_guideline',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only guideline slice so the single-or-joint-life mortality-table guidance stays narrow and reviewable.`,
    processingIntentNotes:
      'Guideline workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This two-page AG 06 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 06 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
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
        details: 'The selected pages carry a source reference and a page locator.',
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
        relativePath: rawSourceFile,
        sourceFamilyId,
        documentType: 'actuarial_guideline',
        sourceTitle,
        sourceReference,
        versionDate: null,
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: 'high',
        reviewFlags: Array.from(new Set(['regulatory_requirement', ...spec.reviewFlags])),
        reviewStatus: spec.reviewStatus ?? 'needs_human_review',
        itemKind: spec.itemKind ?? 'review_note',
        notes: spec.notes,
        summary: spec.summary,
        keywords: spec.keywords,
        sourceNotes: spec.sourceNotes,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: spec.authorityLevel ?? 'guidance',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: spec.nonLearnerFacingNotes ?? defaultNonLearnerNotes,
      },
    ],
  }
}

const ag06BatchSpecs = [
  {
    plannedBatchId: 'batch-081',
    batchSlug: 'ag06-081-single-joint-life-tables',
    sourceId: 'ag06-single-joint-life-tables',
    batchTitle: 'interpretation regarding use of single or joint life mortality tables',
    summaryLead:
      'AG 06 explains how single or joint life mortality tables apply to reserve and nonforfeiture calculations and keeps the interpretation review-only',
    pageWindow: [1, 2],
    sectionReference:
      'AG 06: Interpretation regarding use of single or joint life mortality tables',
    citationText:
      'The Standard Valuation Law and the Standard Nonforfeiture Law for Life Insurance apply to policies which provide joint life insurance benefits as well as to policies which provide single life insurance benefits.',
    summary:
      'AG 06 explains how single or joint life mortality tables affect the expense allowance and reserve/nonforfeiture calculations, while preserving the review-only boundary across both pages.',
    keywords: [
      'AG 06',
      'single life',
      'joint life',
      'mortality tables',
      'expense allowances',
      'modified net premium',
      'adjusted premium',
      'reserves',
      'nonforfeiture values',
    ],
    notes: 'Two-page guideline slice retained as a review-only interpretive batch.',
    sourceNotes:
      'Two-page PDF; the text extraction layer may be noisy, so keep the page locator visible for human review.',
    reviewFlags: [
      'formula_context',
      'definition_or_terminology',
      'cross_reference_mapping',
      'requires_human_interpretation',
      'boundary_control_window',
    ],
    flagType: 'interpretive_guidance_slice',
    flagMessage:
      'The two-page single-or-joint-life mortality-table guideline should remain review-only until the indexing choice is confirmed.',
    citationDetails:
      'The pages contain the single-life and joint-life mortality-table framing and the alternative assumptions for expense allowances and premium calculations.',
    citationAction:
      'Keep the AG 06 pages review-only and do not collapse the interpretation note into learner-facing output.',
    decisionType: 'indexing_choice',
    decisionQuestion:
      'Should AG 06 stay indexed as a standalone interpretive note, or should it be cross-linked to the underlying single-life and joint-life calculation guidance in a later cleanup step?',
    decisionWhy:
      'The two-page guideline is concise but includes live mortality-table selection language, so the index choice affects future review and promotion decisions.',
    issueType: 'text_extraction_quality',
    issueMessage:
      'The pages are a two-page encoded PDF, so human review should confirm the wording and the indexing choice before any later promotion decision.',
    issueAction:
      'Keep review-only and preserve the page locator; verify the wording against the page images if exact phrasing matters.',
    issueEvidence:
      'Page 1 states the single-life / joint-life interpretation and page 2 explains the expense-allowance treatment; both pages show encoding noise in the OCR-like output.',
    validationCheckId: 'ag06-two-page-coverage',
    validationCheckDetails: 'The selected pages capture the full AG 06 guideline.',
    nextStep:
      'Confirm whether AG 06 should stay as a standalone caveat note or be cross-linked to the underlying single-life and joint-life calculation guidance.',
  },
]

export const ag06BatchDefinitions = Object.fromEntries(
  ag06BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg06Batch(spec)]),
)

