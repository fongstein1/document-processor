const rawSourceFile =
  'Actuarial Guidelines/AG 03 - Definition of the Term Maturity Value in the Standard Nonforfeiture Law of Individual Deferred Annuities.pdf'
const sourceFamilyId = 'actuarial_guidelines'
const sourceTitle = 'AG 03 - Definition of the Term Maturity Value in the Standard Nonforfeiture Law of Individual Deferred Annuities'
const sourceReference = 'Actuarial Guideline III'
const defaultNonLearnerNotes =
  'Single-page guideline slice retained as review-only until the indexing choice is explicitly confirmed.'

const makeAg03Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 03 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag03_single_page_guideline',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only guideline slice so the maturity-value interpretation stays narrow and reviewable.`,
    processingIntentNotes:
      'Guideline workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This single-page AG 03 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 03 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
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

const ag03BatchSpecs = [
  {
    plannedBatchId: 'batch-076',
    batchSlug: 'ag03-076-maturity-value',
    sourceId: 'ag03-maturity-value-interpretation',
    batchTitle: 'maturity-value interpretation',
    summaryLead:
      'AG 03 clarifies the maturity-value treatment for cash surrender benefits and preserves the Section 4 cross-reference as review-only',
    pageWindow: [1, 1],
    sectionReference: 'AG 03: Minimum cash surrender benefit / maturity value interpretation',
    citationText:
      'For purposes of calculating cash surrender values prior to maturity, the term "maturity value" shall mean the cash surrender value at maturity.',
    summary:
      'AG 03 explains that when cash surrender benefits are paid, they should grade into maturity value using the contract-rate / Section 6 framework and clarifies that maturity value means cash surrender value at maturity for prior-to-maturity calculations.',
    keywords: ['AG 03', 'maturity value', 'cash surrender value', 'Standard Nonforfeiture Law', 'Section 4'],
    notes: 'Single-page guideline slice retained as a review-only interpretive batch.',
    sourceNotes:
      'Single-page PDF; the text extraction layer may be noisy, so keep the page locator visible for human review.',
    reviewFlags: [
      'definition_or_terminology',
      'cross_reference_mapping',
      'requires_human_interpretation',
      'boundary_control_window',
    ],
    flagType: 'interpretive_guidance_slice',
    flagMessage:
      'The single-page maturity-value interpretation should remain review-only until the indexing choice is confirmed.',
    citationDetails:
      'The page contains the full guideline, including the maturity-value definition and the cash-surrender-value treatment.',
    citationAction:
      'Keep the AG 03 page review-only and do not collapse the Section 4 / maturity-value cross-reference into learner-facing output.',
    decisionType: 'indexing_choice',
    decisionQuestion:
      'Should AG 03 stay indexed as a standalone interpretive note, or should it be cross-linked to the underlying nonforfeiture-law section in a later cleanup step?',
    decisionWhy:
      'The page is a concise interpretation with a live cross-reference, so the index choice affects future review and promotion decisions.',
    issueType: 'text_extraction_quality',
    issueMessage:
      'The page is a one-page encoded PDF, so human review should confirm the wording and the indexing choice before any later promotion decision.',
    issueAction:
      'Keep review-only and preserve the page locator; verify the wording against the page image if exact phrasing matters.',
    issueEvidence:
      'Page 1 contains the entire guideline, and the extracted text layer shows encoding noise in the OCR-like output.',
    validationCheckId: 'ag03-single-page-coverage',
    validationCheckDetails: 'The selected page captures the full AG 03 guideline.',
    nextStep:
      'Confirm whether AG 03 should stay as a standalone caveat note or be cross-linked to the underlying nonforfeiture-law section.',
  },
]

export const ag03BatchDefinitions = Object.fromEntries(
  ag03BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg03Batch(spec)]),
)
