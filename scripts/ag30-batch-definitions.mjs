const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 30 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg30Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 30 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag30_plan_type_gic_guidance',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 30 review-only batch: capture the plan-type and GIC guidance and keep the encoded wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 30 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 30 guideline slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 30 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 30 has an encoded text layer on the opening page, so the text should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the first page contains encoding noise.',
        notes: 'Keep the image backstop visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-plan-type`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'plan_type_assumption',
        message:
          'The plan-type assumption and C-3-risk framing should remain visible as review-only context.',
        notes: 'Keep the plan-type boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 30 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-plan-type-boundary`,
        sourceId,
        itemId,
        issueType: 'plan_type_assumption',
        details:
          'The plan-type language should stay review-only until a human confirms how the guideline applies to benefit-responsive GICs.',
        recommendedAction:
          'Keep the plan-type / policyholder wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-governance-context`,
        sourceId,
        itemId,
        issueType: 'governance_or_control_expectation',
        details:
          'The certificate-of-intent and administration language should stay review-only until a human confirms how the control evidence should be interpreted.',
        recommendedAction:
          'Keep the insurer-administration language inside the same narrow review window.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 30 remain indexed as review-only plan-type guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full two-page file remain a single review window, or should a later cleanup split the background material from the operational requirements?',
        whyItMatters: 'The page window controls how much context is exposed in each review packet.',
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
          'The AG 30 text layer is encoded on the opening page, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer on page 1 is encoded, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-plan-type-boundary`,
        severity: 'medium',
        issueType: 'plan_type_assumption',
        sourceId,
        itemId,
        message:
          'The plan-type and C-3-risk language stays at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the plan-type / policyholder wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline discusses benefit-responsive GICs, plan provisions, insurer administration, and periodic review of actual experience.',
      },
      {
        issueId: `issue-${sourceId}-governance-context`,
        severity: 'medium',
        issueType: 'governance_or_control_expectation',
        sourceId,
        itemId,
        message:
          'The certificate-of-intent and administration language remains contextual and should not be promoted.',
        recommendedAction:
          'Keep the insurer-administration language within the same narrow review window.',
        evidence:
          'The guideline says the valuation actuary must be satisfied that the provisions are administered as designed and may obtain a certificate of intent.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag30-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 30 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 30 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'plan-type-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the plan-type and control language as review-only context.',
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
          'AG 30 slice retained as review-only guidance until the plan-type wording and control boundary are confirmed.',
      },
    ],
  }
}

const ag30BatchSpecs = [
  {
    plannedBatchId: 'batch-112',
    batchSlug: 'ag30-112-plan-type-gic-guidance',
    sourceId: 'ag30-plan-type-gic-guidance',
    filename:
      'AG 30 - Guideline for the Application of Plan Type to Guaranteed Interest Contracts (GICs) With Benefit Responsive Payment Provisions Used to Fund Emp.pdf',
    sourceTitle:
      'AG 30 - Guideline for the Application of Plan Type to Guaranteed Interest Contracts (GICs) With Benefit Responsive Payment Provisions Used to Fund Employee Benefit Plans',
    sourceReference: 'Actuarial Guideline XXX',
    batchTitle: 'plan type and GIC guidance slice',
    pageWindow: [1, 2],
    sectionReference:
      'AG 30 pages 1-2: plan type background, benefit-responsive GIC payment provisions, C-3 risk reduction, insurer administration, and periodic review boundary.',
    citationText:
      'The withdrawal of funds at book value for the purpose of redirecting or withdrawing an employee investment shall be considered a withdrawal by the policyholder unless the underlying plan or GIC contain written provisions which are designed to reduce the C-3 risk to the insurance company.',
    summary:
      'AG 30 explains when benefit-responsive GIC withdrawals count as policyholder withdrawals, what plan provisions can reduce C-3 risk, how the valuation actuary should verify insurer administration, and how periodic experience review supports the plan type assumption.',
    keywords: [
      'AG 30',
      'Actuarial Guideline XXX',
      'GIC',
      'benefit responsive payment provisions',
      'plan type',
      'policyholder',
      'C-3 risk',
      'certificate of intent',
      'valuation actuary',
      'employee benefit plans',
    ],
    notes:
      'Two-page guideline; the opening page contains encoding noise, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; pages 1-2 stay together and the encoded opening page should not widen the batch.',
    summaryLead:
      'AG 30 frames plan type treatment for benefit-responsive GICs funding employee benefit plans.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'plan_type_assumption'],
    reviewPacketNotes: 'Opening AG 30 slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the plan-type boundary before any later indexing choice.',
  },
]

export const ag30BatchDefinitions = Object.fromEntries(
  ag30BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg30Batch(spec)]),
)
