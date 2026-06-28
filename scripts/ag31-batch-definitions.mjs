const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 31 stays review-only. Keep the page-image wording backstop visible and do not promote any item.'

const makeAg31Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 31 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag31_policy_form_approval_caveat',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 31 review-only batch: capture the policy-form approval caveat and keep the encoded wording review-only.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 31 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 31 guideline slice is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 31 guideline batch. Keep the work review-first, preserve the page locator, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'ocr_text_layer',
        message:
          'AG 31 has an encoded text layer, so the text should stay review-only until the page image is confirmed.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-page-image`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'page_image_backstop',
        message:
          'The page image should remain the wording backstop because the page contains encoding noise.',
        notes: 'Keep the image backstop visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-policy-form`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'policy_form_approval_caveat',
        message:
          'The policy-form approval caveat should remain visible as review-only context.',
        notes: 'Keep the policy-form boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-image-confirmation`,
        sourceId,
        itemId,
        issueType: 'page_image_confirmation',
        details:
          'The page-image wording should be confirmed before anyone treats AG 31 as an indexing candidate.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
      },
      {
        issueId: `citation-${sourceId}-policy-form-boundary`,
        sourceId,
        itemId,
        issueType: 'policy_form_approval_caveat',
        details:
          'The policy-form approval caveat should stay review-only until a human confirms how the guideline applies to reserve issues.',
        recommendedAction:
          'Keep the policy-form / reserve wording inside the same narrow review window.',
      },
      {
        issueId: `citation-${sourceId}-annual-statement-context`,
        sourceId,
        itemId,
        issueType: 'cross_reference_mapping',
        details:
          'The annual-statement and reserve context should stay review-only until a human confirms how the cross reference should be interpreted.',
        recommendedAction:
          'Keep the annual-statement context inside the same narrow review window.',
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 31 remain indexed as review-only policy-form approval caveat guidance, or should it be linked only as a context note?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the full one-page file remain a single review window, or should a later cleanup split the caveat from the background explanation?',
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
          'The AG 31 text layer is encoded, and the page-image wording should remain a visible review note.',
        recommendedAction:
          'Keep the planned page window together and preserve the page-image backstop note.',
        evidence:
          'The OCR/text layer is encoded, so the page image should be checked against the extracted wording.',
      },
      {
        issueId: `issue-${sourceId}-policy-form-boundary`,
        severity: 'medium',
        issueType: 'policy_form_approval_caveat',
        sourceId,
        itemId,
        message:
          'The policy-form approval caveat stays at the context level and should not be treated as the full mechanics set.',
        recommendedAction:
          'Keep the policy-form / reserve wording review-only until a human confirms the guideline interpretation.',
        evidence:
          'The guideline says adoption of the reserve guideline does not imply endorsement of policy-form approval, and the annual statement must still reflect appropriate reserves.',
      },
      {
        issueId: `issue-${sourceId}-annual-statement-context`,
        severity: 'medium',
        issueType: 'cross_reference_mapping',
        sourceId,
        itemId,
        message:
          'The annual-statement and reserve language remains contextual and should not be promoted.',
        recommendedAction:
          'Keep the annual-statement context within the same narrow review window.',
        evidence:
          'The guideline discusses annual statements filed in each state and the need for appropriate reserves even when a policy form has not been approved.',
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag31-page-window-coverage',
        status: 'passed',
        details: 'The selected page window captures the planned AG 31 slice.',
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 31 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'page-image-backstop-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the encoded-text caveat.',
      },
      {
        checkId: 'policy-form-context-tracked',
        status: 'passed',
        details: 'The review packet keeps the policy-form and control language as review-only context.',
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
          'AG 31 slice retained as review-only guidance until the policy-form wording and reserve boundary are confirmed.',
      },
    ],
  }
}

const ag31BatchSpecs = [
  {
    plannedBatchId: 'batch-113',
    batchSlug: 'ag31-113-policy-form-approval',
    sourceId: 'ag31-policy-form-approval-caveat',
    filename: 'AG 31 - Valuation Issues vs Policy Form Approval.pdf',
    sourceTitle: 'AG 31 - Valuation Issues vs Policy Form Approval',
    sourceReference: 'Actuarial Guideline XXXI',
    batchTitle: 'policy-form approval caveat slice',
    pageWindow: [1, 1],
    sectionReference:
      'AG 31 page 1: policy-form approval caveat, annual-statement reserve context, and the closing boundary note.',
    citationText:
      'The adoption of an Actuarial Guideline by the NAIC Life and Health Actuarial Task Force dealing with a reserve issue associated with a particular policy form or benefit does not represent an endorsement for the approval of the particular policy form or benefit.',
    summary:
      'AG 31 clarifies that adopting an actuarial guideline on reserve issues for a particular policy form or benefit does not imply approval of that form or benefit, while also reminding filers that annual statements must reflect appropriate reserves for all policy forms and associated benefits.',
    keywords: [
      'AG 31',
      'Actuarial Guideline XXXI',
      'policy form',
      'approval',
      'reserve issues',
      'annual statement',
      'benefits',
      'reserve context',
    ],
    notes:
      'Single-page guideline; the text layer is noisy / encoded, so the page image should remain the wording backstop.',
    sourceNotes:
      'Active guidance; page 1 stays together as a review-only slice and the encoded text should not widen the batch.',
    summaryLead:
      'AG 31 clarifies that reserve guidance is not policy-form approval.',
    reviewFlags: ['ocr_text_layer', 'page_image_backstop', 'policy_form_approval_caveat'],
    reviewPacketNotes: 'Opening AG 31 slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the page-image wording and the policy-form approval boundary before any later indexing choice.',
  },
]

export const ag31BatchDefinitions = Object.fromEntries(
  ag31BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg31Batch(spec)]),
)
