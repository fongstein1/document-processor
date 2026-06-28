const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 51 stays review-only. Keep page locators primary, keep the future VM-30 incorporation note visible, and do not promote any item.'

const makeAg51Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 51 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag51_ltc_asset_adequacy_testing',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 51 review-only batch: capture the LTC asset-adequacy guidance and keep later guideline files outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 51 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 51 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the next guideline outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 51 guideline batch. Keep the work review-first, preserve the page locator, keep the future VM-30 incorporation note visible, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'page_locator_primary',
        message:
          'AG 51 should stay page-locator anchored because the runner is not expected to produce stable line references.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-vm30-note`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'future_vm30_incorporation_note',
        message:
          'The future VM-30 incorporation note should remain visible as review-only context rather than a repeal or replacement signal.',
        notes: 'Keep the future-incorporation note visible as a review note.',
      },
      {
        flagId: `flag-${sourceId}-topic`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: spec.flagType,
        message: spec.flagMessage,
        notes: 'Keep the topic boundary explicit and review-only.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${sourceId}-page-locator-primary`,
        sourceId,
        itemId,
        issueType: 'page_locator_primary',
        details:
          'Page locators should remain the primary anchor for AG 51 because the runner does not emit stable line references for this PDF source.',
        recommendedAction:
          'Keep the planned page window together and preserve the locator in the review packet.',
      },
      {
        issueId: `citation-${sourceId}-future-vm30-note`,
        sourceId,
        itemId,
        issueType: 'future_vm30_incorporation_note',
        details:
          'AG 51 states that the guideline will cease when the corresponding VM-30 requirements become effective; that note should stay visible but not be misread as a current repeal.',
        recommendedAction:
          'Keep the future-incorporation note visible and treat AG 51 as active review-only guidance until replacement text exists.',
      },
      {
        issueId: `citation-${sourceId}-topic-boundary`,
        sourceId,
        itemId,
        issueType: spec.topicIssueType,
        details: spec.topicIssueDetails,
        recommendedAction: spec.topicRecommendedAction,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}-indexing-disposition`,
        decisionType: 'indexing_choice',
        question:
          'Should AG 51 remain indexed as active review-only guidance, or should it later be linked only as a context note once the VM-30 replacement text becomes effective?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-page-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current 1-3 / 4-5 split remain the canonical regeneration boundary, or should later cleanup rebalance the documentation section?',
        whyItMatters: 'The page window controls how much context is exposed in the review packet.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-page-locator-primary`,
        severity: 'medium',
        issueType: 'page_locator_primary',
        sourceId,
        itemId,
        message:
          'The AG 51 slice should remain anchored by page locators because the runner does not emit stable line references.',
        recommendedAction:
          'Keep the page locator visible instead of overclaiming exact line wording.',
        evidence:
          'The source is a PDF and the controlled runner uses page-based extraction for this source family.',
      },
      {
        issueId: `issue-${sourceId}-future-vm30-note`,
        severity: 'medium',
        issueType: 'future_vm30_incorporation_note',
        sourceId,
        itemId,
        message:
          'The future VM-30 incorporation note should stay visible as context, but it should not be mistaken for a current repeal or replacement.',
        recommendedAction:
          'Keep the note visible and treat AG 51 as active review-only guidance until replacement text exists.',
        evidence:
          'AG 51 explicitly says the guideline will cease when corresponding VM-30 requirements become effective.',
      },
      {
        issueId: `issue-${sourceId}-topic-boundary`,
        severity: 'medium',
        issueType: spec.topicIssueType,
        sourceId,
        itemId,
        message: spec.topicIssueMessage,
        recommendedAction: spec.topicRecommendedAction,
        evidence: spec.topicIssueEvidence,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Pilot manifest blocks learner-facing promotion and app-ready export.',
      },
      {
        checkId: 'ag51-page-window-coverage',
        status: 'passed',
        details: `The selected page window captures the planned AG 51 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 51 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'future-vm30-note-tracked',
        status: 'passed',
        details: 'The review packet and unresolved-issues summary both capture the future VM-30 incorporation note.',
      },
      {
        checkId: 'page-locator-primary',
        status: 'passed',
        details: 'The review packet keeps page locators primary because line references are not expected.',
      },
      {
        checkId: 'topic-context-tracked',
        status: 'passed',
        details: spec.topicValidationDetails,
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
          'AG 51 slice retained as review-only guidance until the wording and boundary are confirmed.',
      },
    ],
  }
}

const ag51BatchSpecs = [
  {
    plannedBatchId: 'batch-163',
    batchSlug: 'ag51-163-background-scope-definitions',
    sourceId: 'ag51-background-scope-definitions',
    filename: 'AG 51-AAT for LTC from 2021 Valuation Law Manual.pdf',
    sourceTitle: 'AG 51-AAT for LTC from 2021 Valuation Law Manual',
    sourceReference: 'Actuarial Guideline LI',
    batchTitle: 'background, scope, and definitions slice',
    pageWindow: [1, 3],
    sectionReference:
      'AG 51 pages 1-3: background, effective date, authority, scope, projected-high-net-yield-asset definitions, exclusions, and the closing part of the asset-adequacy framing.',
    citationText:
      'This Guideline is intended to provide uniform guidance and clarification of requirements for the appropriate support of certain assumptions for the asset adequacy testing applied to a company’s LTC block of contracts.',
    summary:
      'AG 51 establishes the LTC asset-adequacy-testing guidance, its effective date, scope, and key definitions before the memorandum documentation section begins.',
    keywords: [
      'AG 51',
      'Actuarial Guideline LI',
      'LTC',
      'asset adequacy analysis',
      'scope',
      'definitions',
      'VM-25',
      'VM-30',
    ],
    notes:
      'Opening background, scope, and definition window; keep the future VM-30 incorporation note visible and preserve the page locator as the main anchor.',
    sourceNotes: 'Active guidance; later guideline files remain out of scope for this wave.',
    reviewFlags: ['page_locator_primary', 'future_vm30_incorporation_note', 'background', 'scope', 'definitions'],
    reviewPacketNotes: 'AG 51 opening slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the future-incorporation note and whether the opening background should stay grouped with the later projected-high-net-yield-asset definitions before expanding the source.',
    flagType: 'opening_scope_caveat',
    flagMessage:
      'The opening background and scope guidance should remain review-only until the future-incorporation note is reconciled.',
    topicIssueType: 'opening_scope_boundary',
    topicIssueDetails:
      'The opening background, scope, and definitions should stay separate from the later memorandum documentation section.',
    topicRecommendedAction:
      'Keep the page 1-3 slice review-only and do not widen it into the later documentation pages.',
    topicIssueMessage: 'The opening guidance should not absorb the memorandum documentation section.',
    topicIssueEvidence:
      'Pages 1-3 contain the background, effective date, authority, scope, and projected-high-net-yield-asset definitions.',
    topicValidationDetails: 'The selected page window captures the AG 51 opening slice.',
  },
  {
    plannedBatchId: 'batch-164',
    batchSlug: 'ag51-164-documentation-closeout',
    sourceId: 'ag51-documentation-closeout',
    filename: 'AG 51-AAT for LTC from 2021 Valuation Law Manual.pdf',
    sourceTitle: 'AG 51-AAT for LTC from 2021 Valuation Law Manual',
    sourceReference: 'Actuarial Guideline LI',
    batchTitle: 'documentation requirements and closeout slice',
    pageWindow: [4, 5],
    sectionReference:
      'AG 51 pages 4-5: memorandum documentation requirements, rate increase documentation, and the closing LTC asset-adequacy guidance.',
    citationText:
      'The documentation requirements below are to be incorporated as a separate section of the appointed actuary’s Actuarial Memorandum required by the VM-30 or in a special Actuarial Memorandum containing LTC-specific information.',
    summary:
      'AG 51 requires LTC asset-adequacy analysis documentation in the appointed actuary’s memorandum and closes with the rate-increase and changed-assumption reporting rules.',
    keywords: [
      'AG 51',
      'Actuarial Guideline LI',
      'documentation',
      'Actuarial Memorandum',
      'mortality',
      'voluntary lapse',
      'morbidity',
      'investment returns',
      'rate increases',
    ],
    notes:
      'Documentation closeout window; keep the page locator primary and preserve the future VM-30 incorporation note as review-only context.',
    sourceNotes: 'Active guidance; later guideline files remain out of scope for this wave.',
    reviewFlags: ['page_locator_primary', 'future_vm30_incorporation_note', 'documentation', 'memorandum', 'closeout'],
    reviewPacketNotes: 'AG 51 documentation slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm whether the documentation section should stay grouped as one closing slice before moving on to the next guideline file.',
    flagType: 'documentation_boundary_caveat',
    flagMessage:
      'The documentation and memorandum closeout guidance should remain review-only until the closeout boundary is confirmed.',
    topicIssueType: 'documentation_boundary',
    topicIssueDetails:
      'The documentation requirements should stay separate from the opening background and scope material on pages 1-3.',
    topicRecommendedAction:
      'Keep the page 4-5 slice review-only and treat it as the closing boundary for AG 51.',
    topicIssueMessage: 'The documentation slice should not absorb earlier AG 51 background material.',
    topicIssueEvidence:
      'Pages 4-5 contain the separate memorandum documentation requirements, rate-increase documentation, and closing guidance.',
    topicValidationDetails: 'The selected page window captures the AG 51 documentation and closeout slice.',
  },
]

export const ag51BatchDefinitions = Object.fromEntries(
  ag51BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg51Batch(spec)]),
)
