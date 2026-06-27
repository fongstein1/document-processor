const rawSourceFile =
  'Actuarial Guidelines/AG 01 - Valuation of Policies in Which the Net Premium Exceeds the Gross Premium.pdf'
const sourceFamilyId = 'actuarial_guidelines'
const sourceTitle = 'AG 01 - Valuation of Policies in Which the Net Premium Exceeds the Gross Premium'
const sourceReference = 'Actuarial Guideline I'
const defaultNonLearnerNotes =
  'Single-page guideline slice retained as review-only until the indexing choice is explicitly confirmed.'

const makeAg01Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 01 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag01_single_page_guideline',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only guideline slice so the valuation-net-premium interpretation stays narrow and reviewable.`,
    processingIntentNotes:
      'Guideline workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This single-page AG 01 guideline is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 01 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
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

const ag01BatchSpecs = [
  {
    plannedBatchId: 'batch-077',
    batchSlug: 'ag01-077-net-premium',
    sourceId: 'ag01-net-premium-interpretation',
    batchTitle: 'valuation net premium / gross premium interpretation',
    summaryLead:
      'AG 01 clarifies the Standard Valuation Law treatment for policies whose valuation net premiums exceed the actual gross premium collected and keeps the interpretive boundary review-only',
    pageWindow: [1, 1],
    sectionReference: 'AG 01: Valuation net premium / gross premium interpretation',
    citationText:
      'The purpose of this guideline is to clarify the intent of the Standard Valuation Law with respect to the valuation of policies whose valuation net premiums exceed the actual gross premium collected.',
    summary:
      'AG 01 explains that the guideline exists to clarify the intent of the Standard Valuation Law for policies whose valuation net premiums exceed the actual gross premium collected, and it preserves the review-only interpretive boundary on the page.',
    keywords: ['AG 01', 'valuation net premium', 'gross premium', 'Standard Valuation Law'],
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
      'The single-page valuation-net-premium interpretation should remain review-only until the indexing choice is confirmed.',
    citationDetails:
      'The page contains the full guideline, including the valuation-net-premium purpose statement and the gross-premium comparison.',
    citationAction:
      'Keep the AG 01 page review-only and do not collapse the Standard Valuation Law cross-reference into learner-facing output.',
    decisionType: 'indexing_choice',
    decisionQuestion:
      'Should AG 01 stay indexed as a standalone interpretive note, or should it be cross-linked to the underlying Standard Valuation Law text in a later cleanup step?',
    decisionWhy:
      'The page is a concise interpretation with a live cross-reference, so the index choice affects future review and promotion decisions.',
    issueType: 'text_extraction_quality',
    issueMessage:
      'The page is a one-page encoded PDF, so human review should confirm the wording and the indexing choice before any later promotion decision.',
    issueAction:
      'Keep review-only and preserve the page locator; verify the wording against the page image if exact phrasing matters.',
    issueEvidence:
      'Page 1 contains the entire guideline, and the extracted text layer shows encoding noise in the OCR-like output.',
    validationCheckId: 'ag01-single-page-coverage',
    validationCheckDetails: 'The selected page captures the full AG 01 guideline.',
    nextStep:
      'Confirm whether AG 01 should stay as a standalone caveat note or be cross-linked to the underlying Standard Valuation Law section.',
  },
]

export const ag01BatchDefinitions = Object.fromEntries(
  ag01BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg01Batch(spec)]),
)
