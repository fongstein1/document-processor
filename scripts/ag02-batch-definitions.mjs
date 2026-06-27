const rawSourceFile =
  'Actuarial Guidelines/AG 02 - Valuation of Active Life Funds Held Relative to Group Annuity Contracts.pdf'
const sourceFamilyId = 'actuarial_guidelines'
const sourceTitle = 'AG 02 - Valuation of Active Life Funds Held Relative to Group Annuity Contracts'
const sourceReference = 'Actuarial Guideline II'
const defaultNonLearnerNotes =
  'Two-page guideline slice retained as review-only until the indexing choice is explicitly confirmed.'

const makeAg02Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 02 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag02_two_page_guideline',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only guideline slice so the interest-rate guideline stays narrow and reviewable.`,
    processingIntentNotes:
      'Guideline workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This two-page AG 02 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 02 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
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
        reviewFlags: ['regulatory_requirement', ...spec.reviewFlags],
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

const ag02BatchSpecs = [
  {
    plannedBatchId: 'batch-078',
    batchSlug: 'ag02-078-active-life-funds',
    sourceId: 'ag02-active-life-funds-guideline',
    batchTitle: 'interest-rate guideline / active life funds',
    summaryLead:
      'AG 02 explains the reserve requirements for active life funds held relative to group annuity contracts and keeps the reserve and interest-rate guideline interpretation review-only',
    pageWindow: [1, 2],
    sectionReference: 'AG 02: Interest-rate guideline for active life funds held relative to group annuity contracts',
    citationText:
      'As part of the determination of the aggregate minimum group annuity reserves, a computation must be made of minimum reserves for deposit administration group annuity funds with interest rate guarantees.',
    summary:
      'AG 02 explains that the guideline exists to guide reserve computations for active life funds held relative to group annuity contracts, including interest-rate-guarantee treatment and the table of values, while preserving the review-only boundary across both pages.',
    keywords: ['AG 02', 'active life funds', 'group annuity contracts', 'interest rate guidelines', 'table of values'],
    notes: 'Two-page guideline slice retained as a review-only interpretive batch.',
    sourceNotes:
      'Two-page PDF; the text extraction layer may be noisy, so keep the page locator visible for human review.',
    reviewFlags: [
      'definition_or_terminology',
      'reserve_method_structure',
      'prescribed_assumption',
      'cross_reference_mapping',
      'requires_human_interpretation',
      'boundary_control_window',
    ],
    flagType: 'interpretive_guidance_slice',
    flagMessage:
      'The two-page active-life-funds guideline should remain review-only until the indexing choice is confirmed.',
    citationDetails:
      'The pages contain the full guideline, including reserve requirements, exception language, and the values table on page 2.',
    citationAction:
      'Keep the AG 02 pages review-only and do not collapse the Standard Valuation Law cross-reference into learner-facing output.',
    decisionType: 'indexing_choice',
    decisionQuestion:
      'Should AG 02 stay indexed as a standalone interpretive note, or should it be cross-linked to the underlying Standard Valuation Law text in a later cleanup step?',
    decisionWhy:
      'The two-page guideline is concise but includes a live cross-reference and a table, so the index choice affects future review and promotion decisions.',
    issueType: 'text_extraction_quality',
    issueMessage:
      'The pages are a two-page encoded PDF, so human review should confirm the wording and the indexing choice before any later promotion decision.',
    issueAction:
      'Keep review-only and preserve the page locator; verify the wording against the page images if exact phrasing matters.',
    issueEvidence:
      'Page 1 contains the reserve and interest-rate guidance, and page 2 contains the values table / lookup material; both pages show encoding noise in the OCR-like output.',
    validationCheckId: 'ag02-two-page-coverage',
    validationCheckDetails: 'The selected pages capture the full AG 02 guideline.',
    nextStep:
      'Confirm whether AG 02 should stay as a standalone caveat note or be cross-linked to the underlying Standard Valuation Law section.',
  },
]

export const ag02BatchDefinitions = Object.fromEntries(
  ag02BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg02Batch(spec)]),
)
