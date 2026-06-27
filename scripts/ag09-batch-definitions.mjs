const rawSourceFolder = 'Actuarial Guidelines'
const rawSourceRoot = 'D:\\Work\\AI Projects\\NAIC Valuation Manual Course'
const sourceFamilyId = 'actuarial_guidelines'
const domainId = 'naic_regulatory'
const defaultNonLearnerNotes =
  'AG 09 family guideline slices stay review-only. Keep each slice source-bound, preserve the page locator, and do not promote any item.'

const makeAg09Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  return {
    batchName: `AG 09 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag09_guideline_family',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 09 family pilot: capture the short guideline slice and keep the classification / mortality-table language review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. The AG 09 slice is retained for exception-first review, but it is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 09 slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 09 batch only. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
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
        issueType: 'encoded_text_layer',
        details: spec.citationIssueDetails,
        recommendedAction:
          'Keep the page locator and do not widen the batch because of text-layer noise.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: 'indexing_choice',
        question: spec.decisionQuestion,
        whyItMatters: spec.decisionWhy,
        recommendedOwner: 'processor owner',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}`,
        severity: 'medium',
        issueType: 'text_layer_noise',
        sourceId,
        itemId,
        message: spec.issueMessage,
        recommendedAction: spec.issueAction,
        evidence: spec.evidence,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag09-page-coverage',
        status: 'passed',
        details: spec.pageCoverageDetails,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 09 slice carries a source reference and a page locator.',
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
        reviewPacketNotes: 'Interpretive slice remains review-only.',
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'AG 09 slice retained as review-only until the indexing choice is confirmed.',
      },
    ],
  }
}

const ag09BatchSpecs = [
  {
    plannedBatchId: 'batch-084',
    batchSlug: 'ag09-084-form-classification',
    sourceId: 'ag09-form-classification',
    filename:
      'AG 09 - Form Classification of Individual Single Premium Annuities for Application of the Valuation and Nonforfeiture Laws.pdf',
    sourceTitle:
      'AG 09 - Form Classification of Individual Single Premium Annuities for Application of the Valuation and Nonforfeiture Laws',
    sourceReference: 'Actuarial Guideline IX',
    batchTitle: 'form classification',
    pageWindow: [1, 1],
    sectionReference:
      'AG 09: Form Classification of Individual Single Premium Annuities for Application of the Valuation and Nonforfeiture Laws',
    citationText:
      'Textually for the purposes of the applicable Valuation and Nonforfeiture Laws, an individual single premium annuity shall be considered to be immediate, as opposed to deferred, provided the first annuity payment is due not more than thirteen months from the annuity issue date.',
    summary:
      'AG 09 classifies individual single premium annuities as immediate rather than deferred when the first payment is due within thirteen months, while preserving the review-only boundary on the single page.',
    keywords: [
      'AG 09',
      'single premium annuities',
      'immediate annuities',
      'deferred annuities',
      'Valuation Laws',
      'Nonforfeiture Laws',
    ],
    notes:
      'One-page interpretive slice; keep review-only and stop at the page boundary.',
    sourceNotes: 'One page only; keep the OCR/title mismatch visible.',
    summaryLead:
      'AG 09 classifies single premium annuities as immediate rather than deferred when the payment timing test is met.',
    flagType: 'definition_or_terminology',
    flagMessage:
      'The form-classification wording and title/OCR mismatch should stay review-only.',
    citationIssueDetails:
      'The page text refers to immediate annuities while the filename references single premium annuities; confirm wording against the page image before any later promotion decision.',
    decisionQuestion:
      'Should AG 09 stay indexed as a standalone form-classification note, or should it be cross-linked to later annuity classification guidance in a cleanup step?',
    decisionWhy:
      'The indexing choice affects future review and promotion decisions.',
    issueMessage:
      'The AG 09 text layer is encoded/noisy and the title text should be confirmed against the page image.',
    issueAction:
      'Keep the one-page slice review-only and confirm wording before any later promotion decision.',
    evidence:
      'Page 1 shows an OCR/title mismatch and the immediate-annuity classification wording.',
    pageCoverageDetails:
      'The selected page captures the full AG 09 guideline.',
    reviewPacketReason:
      'This one-page AG 09 guideline is intentionally limited to the form-classification note and is retained for review-only analysis.',
    nextStep:
      'Confirm whether AG 09 should stay as a standalone form-classification note or be cross-linked to the underlying annuity classification guidance.',
    reviewFlags: [
      'guidance',
      'definition_or_terminology',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
  },
  {
    plannedBatchId: 'batch-085',
    batchSlug: 'ag09-085-structured-settlements',
    sourceId: 'ag09-substandard-structured-settlements',
    filename:
      'AG 09-A - Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Structured Settlements.pdf',
    sourceTitle:
      'AG 09-A - Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Structured Settlements',
    sourceReference: 'Actuarial Guideline IX-A',
    batchTitle: 'structured-settlement mortality tables',
    pageWindow: [1, 2],
    sectionReference:
      'AG 09-A: Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Structured Settlements',
    citationText:
      'The Standard Valuation Law permits modifications of annuity mortality tables. Solely for the purpose of valuing periodic benefits arising from settlements of various forms of claims pertaining to court settlements or out of court settlements from tort actions, such as arising from accidents or medical malpractice.',
    summary:
      'AG 09-A describes when substandard annuity mortality tables may be used for structured-settlement impaired-life valuations while preserving the review-only boundary on the short companion note.',
    keywords: [
      'AG 09-A',
      'substandard annuity mortality tables',
      'structured settlements',
      'impaired lives',
      'Standard Valuation Law',
    ],
    notes:
      'Two-page interpretive slice; keep review-only and stop at the page boundary.',
    sourceNotes: 'Two pages only; keep the mortality-table caveat visible.',
    summaryLead:
      'AG 09-A explains the structured-settlement use of substandard annuity mortality tables.',
    flagType: 'prescribed_assumption',
    flagMessage:
      'The mortality-table language affects the valuation assumption choice and should stay review-only.',
    citationIssueDetails:
      'The short PDF text layer is noisy enough that the wording should be confirmed against the page images before any later promotion decision.',
    decisionQuestion:
      'Should AG 09-A stay indexed as a standalone structured-settlement note, or should it be cross-linked to later mortality-table guidance in a cleanup step?',
    decisionWhy:
      'The indexing choice affects future review and promotion decisions.',
    issueMessage:
      'The AG 09-A text layer is encoded/noisy and should be confirmed against the page images.',
    issueAction:
      'Keep the two-page slice review-only and confirm wording before any later promotion decision.',
    evidence:
      'Pages 1-2 show encoded text for the structured-settlement mortality-table guidance.',
    pageCoverageDetails:
      'The selected pages capture the full AG 09-A guideline.',
    reviewPacketReason:
      'This two-page AG 09-A guideline is intentionally limited to the structured-settlement note and is retained for review-only analysis.',
    nextStep:
      'Confirm whether AG 09-A should stay as a standalone structured-settlement note or be cross-linked to the underlying mortality-table guidance.',
    reviewFlags: [
      'guidance',
      'prescribed_assumption',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
  },
  {
    plannedBatchId: 'batch-086',
    batchSlug: 'ag09-086-clarification-of-methods',
    sourceId: 'ag09-clarification-of-methods',
    filename:
      'AG 09-B - Clarification of methods for immediate and deferred annuities and structured sttlement contracts.pdf',
    sourceTitle:
      'AG 09-B - Clarification of methods for immediate and deferred annuities and structured settlement contracts',
    sourceReference: 'Actuarial Guideline IX-B',
    batchTitle: 'clarification of methods',
    pageWindow: [1, 4],
    sectionReference:
      'AG 09-B: Clarification of methods under Standard Valuation Law for individual single premium immediate annuities, deferred payments, some deferred annuities, and structured settlements contracts',
    citationText:
      'Solely for the purpose of applying the Standard Valuation Law, an annuity shall be considered as a series of payments not less frequently than annually over five years or more wherein the payments in any one contract or calendar year at the option of the contract owner may vary according to any one or more standards defined in the contract.',
    summary:
      'AG 09-B clarifies how the Standard Valuation Law treats annuity methods across immediate and deferred forms while preserving the review-only boundary on the four-page note.',
    keywords: [
      'AG 09-B',
      'Standard Valuation Law',
      'immediate annuities',
      'deferred annuities',
      'structured settlement contracts',
      'clarification of methods',
    ],
    notes:
      'Four-page interpretive slice; keep review-only and stop at the page boundary.',
    sourceNotes: 'Four pages only; keep the methods clarification visible.',
    summaryLead:
      'AG 09-B clarifies the Standard Valuation Law method treatment across immediate and deferred annuities.',
    flagType: 'formula_context',
    flagMessage:
      'The methods clarification affects the valuation context and should stay review-only.',
    citationIssueDetails:
      'The text layer is noisy enough that the wording should be confirmed against the page images before any later promotion decision.',
    decisionQuestion:
      'Should AG 09-B stay indexed as a standalone methods clarification note, or should it be cross-linked to later annuity guidance in a cleanup step?',
    decisionWhy:
      'The indexing choice affects future review and promotion decisions.',
    issueMessage:
      'The AG 09-B text layer is encoded/noisy and should be confirmed against the page images.',
    issueAction:
      'Keep the four-page slice review-only and confirm wording before any later promotion decision.',
    evidence:
      'Pages 1-4 show encoded text for the methods clarification note.',
    pageCoverageDetails:
      'The selected pages capture the full AG 09-B guideline.',
    reviewPacketReason:
      'This four-page AG 09-B guideline is intentionally limited to the methods clarification note and is retained for review-only analysis.',
    nextStep:
      'Confirm whether AG 09-B should stay as a standalone methods clarification note or be cross-linked to the underlying annuity guidance.',
    reviewFlags: [
      'guidance',
      'formula_context',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
  },
  {
    plannedBatchId: 'batch-087',
    batchSlug: 'ag09-087-immediate-annuity-mortality-tables',
    sourceId: 'ag09-substandard-immediate-annuities',
    filename:
      'AG 09-C - Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Individual Single Premium Immediate Annuities.pdf',
    sourceTitle:
      'AG 09-C - Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Individual Single Premium Immediate Annuities',
    sourceReference: 'Actuarial Guideline IX-C',
    batchTitle: 'immediate-annuity mortality tables',
    pageWindow: [1, 3],
    sectionReference:
      'AG 09-C: Use of Substandard Annuity Mortality Tables in Valuing Impaired Lives Under Individual Single Premium Immediate Annuities',
    citationText:
      'The NAIC model Standard Valuation Law, Section 4a, A 2, permits modifications of annuity mortality tables approved by the commissioner. In states which have adopted this or similar Standard Valuation Law language, this guideline provides for modifications of annuity mortality tables solely for the purpose of valuing individual single premium immediate annuities.',
    summary:
      'AG 09-C describes when substandard annuity mortality tables may be used for impaired lives under individual single premium immediate annuities while preserving the review-only boundary on the short companion note.',
    keywords: [
      'AG 09-C',
      'substandard annuity mortality tables',
      'immediate annuities',
      'impaired lives',
      'Standard Valuation Law',
    ],
    notes:
      'Three-page interpretive slice; keep review-only and stop at the page boundary.',
    sourceNotes: 'Three pages only; keep the mortality-table caveat visible.',
    summaryLead:
      'AG 09-C explains the immediate-annuity use of substandard annuity mortality tables.',
    flagType: 'prescribed_assumption',
    flagMessage:
      'The mortality-table language affects the valuation assumption choice and should stay review-only.',
    citationIssueDetails:
      'The text layer is noisy enough that the wording should be confirmed against the page images before any later promotion decision.',
    decisionQuestion:
      'Should AG 09-C stay indexed as a standalone immediate-annuity note, or should it be cross-linked to later mortality-table guidance in a cleanup step?',
    decisionWhy:
      'The indexing choice affects future review and promotion decisions.',
    issueMessage:
      'The AG 09-C text layer is encoded/noisy and should be confirmed against the page images.',
    issueAction:
      'Keep the three-page slice review-only and confirm wording before any later promotion decision.',
    evidence:
      'Pages 1-3 show encoded text for the immediate-annuity mortality-table guidance.',
    pageCoverageDetails:
      'The selected pages capture the full AG 09-C guideline.',
    reviewPacketReason:
      'This three-page AG 09-C guideline is intentionally limited to the immediate-annuity note and is retained for review-only analysis.',
    nextStep:
      'Confirm whether AG 09-C should stay as a standalone immediate-annuity note or be cross-linked to the underlying mortality-table guidance.',
    reviewFlags: [
      'guidance',
      'prescribed_assumption',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
  }
]

export const ag09BatchDefinitions = Object.fromEntries(
  ag09BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg09Batch(spec)]),
)
