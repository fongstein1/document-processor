const rawSourceFolder = 'Actuarial Guidelines'
const sourceFamilyId = 'actuarial_guidelines'
const defaultNonLearnerNotes =
  'AG 54 stays review-only. Keep paragraph locators and line references primary, and do not promote any item.'

const makeAg54Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `AG 54 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ag54_ilva_nonforfeiture_requirements',
    processingIntentText:
      spec.processingIntentText ??
      'Tiny AG 54 review-only batch: capture the ILVA nonforfeiture guidance and keep later guideline files outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. AG 54 is retained as review-only guidance and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This AG 54 guideline slice is intentionally limited to ${spec.batchTitle} and keeps the next guideline outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small AG 54 guideline batch. Keep the work review-first, preserve paragraph locators and line references, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'paragraph_locator_primary',
        message:
          'AG 54 should stay paragraph-locator anchored because the runner is expected to preserve line references for this text source.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-line-reference`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'line_references_expected',
        message:
          'Line references should be preserved for this Word source path; paragraph locators remain the primary anchor.',
        notes: 'Keep the paragraph-locator anchor visible as a review note.',
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
        issueId: `citation-${sourceId}-paragraph-locator-primary`,
        sourceId,
        itemId,
        issueType: 'paragraph_locator_primary',
        details:
          'Paragraph locators should remain the primary anchor for AG 54 because the source is a text-based Word draft and the runner should preserve line references.',
        recommendedAction:
          'Keep the planned paragraph window together and preserve the locator in the review packet.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-gap`,
        sourceId,
        itemId,
        issueType: 'line_references_expected',
        details:
          'Line references should be preserved for this text source, so paragraph locators remain the practical review anchor.',
        recommendedAction:
          'Keep the paragraph locator visible and avoid overclaiming exact line wording.',
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
          'Should AG 54 remain indexed as active review-only guidance, or should it later be linked only as a context note once future guidance supersedes it?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-paragraph-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current 1-18 / 19-40 / 41-56 split remain the canonical regeneration boundary, or should later cleanup rebalance the methodology and filing sections?',
        whyItMatters: 'The paragraph window controls how much context is exposed in the review packet.',
        recommendedOwner: 'source reviewer',
        priority: 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}-paragraph-locator-primary`,
        severity: 'medium',
        issueType: 'paragraph_locator_primary',
        sourceId,
        itemId,
        message:
          'The AG 54 slice should remain anchored by paragraph locators because the runner is expected to preserve line references.',
        recommendedAction:
          'Keep the paragraph locator visible instead of overclaiming exact line wording.',
        evidence:
          'The source is a Word document and the controlled runner should preserve line-level references for this source family.',
      },
      {
        issueId: `issue-${sourceId}-line-reference-gap`,
        severity: 'medium',
        issueType: 'line_references_expected',
        sourceId,
        itemId,
        message:
          'Line references should be preserved for this text source, so the paragraph locator should remain the review anchor.',
        recommendedAction:
          'Keep the paragraph locator visible and avoid overclaiming exact line wording.',
        evidence:
          'AG 54 is a text-based Word source and the controlled runner should preserve line-level references for this source family.',
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
        checkId: 'ag54-paragraph-window-coverage',
        status: 'passed',
        details: `The selected paragraph window captures the planned AG 54 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The AG 54 slice carries a source reference and a paragraph locator.',
      },
      {
        checkId: 'line-reference-gap-tracked',
        status: 'passed',
        details: 'The review packet keeps paragraph locators primary because line references should be preserved.',
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
        paragraphWindow: spec.paragraphWindow,
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
          'AG 54 slice retained as review-only guidance until the wording and boundary are confirmed.',
      },
    ],
  }
}

const ag54BatchSpecs = [
  {
    plannedBatchId: 'batch-168',
    batchSlug: 'ag54-168-background-scope-definitions',
    sourceId: 'ag54-background-scope-definitions',
    filename: 'AG 54-Indexed Linked Variable Annuities (ILVA) Nonforfeiture as adopted by LATF-20221211.docx',
    sourceTitle: 'Nonforfeiture Requirements for Index-Linked Variable Annuity Products',
    sourceReference: 'Actuarial Guideline LIV',
    batchTitle: 'background, scope, principles, and definitions slice',
    paragraphWindow: [1, 18],
    sectionReference:
      'AG 54 paragraphs 1-18: disclaimer, background, scope, principles, and core definitions.',
    citationText:
      'The purpose of this guideline is to specify the conditions under which an Index-Linked Variable Annuity (ILVA) is consistent with the definition of a variable annuity and exempt from Model 805 and specify nonforfeiture requirements consistent with variable annuities.',
    summary:
      'AG 54 establishes the ILVA nonforfeiture guidance, its scope, and the core definitions that drive the remainder of the guideline.',
    keywords: [
      'AG 54',
      'Actuarial Guideline LIV',
      'ILVA',
      'nonforfeiture',
      'Model 805',
      'Model 250',
      'scope',
      'definitions',
    ],
    notes:
      'Opening background, scope, and definition window; keep paragraph locators primary and preserve line references for this text source.',
    sourceNotes:
      'LATF-adopted draft guidance not yet adopted by the NAIC committees; retain the disclaimer as a review-only caveat.',
    reviewFlags: ['paragraph_locator_primary', 'line_references_expected', 'background', 'scope', 'definitions'],
    reviewPacketNotes: 'AG 54 opening slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the opening guidance and whether the scope thresholds should stay grouped with the ILVA definitions before expanding the source.',
    flagType: 'opening_scope_caveat',
    flagMessage:
      'The opening background and scope guidance should remain review-only until the methodology section is reconciled.',
    topicIssueType: 'opening_scope_boundary',
    topicIssueDetails:
      'The opening background, scope, and definitions should stay separate from the later methodology section.',
    topicRecommendedAction:
      'Keep the paragraph 1-18 slice review-only and do not widen it into the later methodology pages.',
    topicIssueMessage: 'The opening guidance should not absorb the later methodology section.',
    topicIssueEvidence:
      'Paragraphs 1-18 contain the disclaimer, background, scope, principles, and core definitions.',
    topicValidationDetails: 'The selected paragraph window captures the AG 54 opening slice.',
  },
  {
    plannedBatchId: 'batch-169',
    batchSlug: 'ag54-169-methodology-consistency',
    sourceId: 'ag54-methodology-consistency',
    filename: 'AG 54-Indexed Linked Variable Annuities (ILVA) Nonforfeiture as adopted by LATF-20221211.docx',
    sourceTitle: 'Nonforfeiture Requirements for Index-Linked Variable Annuity Products',
    sourceReference: 'Actuarial Guideline LIV',
    batchTitle: 'methodology and consistency slice',
    paragraphWindow: [19, 40],
    sectionReference:
      'AG 54 paragraphs 19-40: interim values, hypothetical portfolio methodology, market-value adjustment context, and consistency testing.',
    citationText:
      'Interim Values must be materially consistent with the value of the Hypothetical Portfolio over the Index Strategy Term less a provision for the cost attributable to reasonably expected or actual Trading Costs at the time the Interim Value is calculated.',
    summary:
      'AG 54 describes the Hypothetical Portfolio methodology, the interim-value consistency requirement, and the supporting valuation assumptions and testing expectations.',
    keywords: [
      'AG 54',
      'Actuarial Guideline LIV',
      'Hypothetical Portfolio',
      'Interim Value',
      'Trading Cost',
      'market value adjustment',
      'fair value',
      'consistency testing',
    ],
    notes:
      'Methodology and consistency window; keep paragraph locators primary and preserve line references for this text source.',
    sourceNotes:
      'LATF-adopted draft guidance not yet adopted by the NAIC committees; retain the disclaimer as a review-only caveat.',
    reviewFlags: ['paragraph_locator_primary', 'line_references_expected', 'methodology', 'consistency', 'valuation'],
    reviewPacketNotes: 'AG 54 methodology slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the methodology and consistency rules before widening into the filing and certification material.',
    flagType: 'methodology_boundary_caveat',
    flagMessage:
      'The methodology guidance should remain review-only until the filing section is reconciled.',
    topicIssueType: 'methodology_boundary',
    topicIssueDetails:
      'The methodology slice should stay separate from the filing, certification, and effective-date material.',
    topicRecommendedAction:
      'Keep the paragraph 19-40 slice review-only and do not widen it into the later filing material.',
    topicIssueMessage: 'The methodology slice should not absorb the filing and certification material.',
    topicIssueEvidence:
      'Paragraphs 19-40 contain the methodology, interim-value, and consistency-testing material.',
    topicValidationDetails: 'The selected paragraph window captures the AG 54 methodology slice.',
  },
  {
    plannedBatchId: 'batch-170',
    batchSlug: 'ag54-170-filing-certification-effective-date',
    sourceId: 'ag54-filing-certification-effective-date',
    filename: 'AG 54-Indexed Linked Variable Annuities (ILVA) Nonforfeiture as adopted by LATF-20221211.docx',
    sourceTitle: 'Nonforfeiture Requirements for Index-Linked Variable Annuity Products',
    sourceReference: 'Actuarial Guideline LIV',
    batchTitle: 'filing, certification, descriptions, and effective date slice',
    paragraphWindow: [41, 56],
    sectionReference:
      'AG 54 paragraphs 41-56: actuarial memorandum and certification requirements, descriptions, and effective date.',
    citationText:
      'The company must provide an actuarial memorandum with each ILVA product filing that includes the following:',
    summary:
      'AG 54 closes with the actuarial memorandum, certification, description, and effective-date guidance that governs ILVA filings.',
    keywords: [
      'AG 54',
      'Actuarial Guideline LIV',
      'actuarial memorandum',
      'actuarial certification',
      'effective date',
      'Model 250',
      'filing',
      'documentation',
    ],
    notes:
      'Filing, certification, and effective-date closeout; keep paragraph locators primary and preserve line references for this text source.',
    sourceNotes:
      'LATF-adopted draft guidance not yet adopted by the NAIC committees; retain the disclaimer as a review-only caveat.',
    reviewFlags: ['paragraph_locator_primary', 'line_references_expected', 'reporting', 'documentation', 'effective_date'],
    reviewPacketNotes: 'AG 54 filing and closeout slice remains review-only.',
    reviewPacketIssueCount: 3,
    nextStep:
      'Confirm the filing and certification requirements and whether the effective date should stay grouped with the benchmark descriptions before expanding the source.',
    flagType: 'filing_boundary_caveat',
    flagMessage:
      'The filing guidance should remain review-only until the effective-date and description material is reconciled.',
    topicIssueType: 'filing_boundary',
    topicIssueDetails:
      'The filing slice should stay separate from the earlier methodology material.',
    topicRecommendedAction:
      'Keep the paragraph 41-56 slice review-only and treat it as the closing boundary for AG 54.',
    topicIssueMessage: 'The filing slice should not absorb earlier methodology material.',
    topicIssueEvidence:
      'Paragraphs 41-56 contain the memorandum, certification, descriptions, and effective date.',
    topicValidationDetails: 'The selected paragraph window captures the AG 54 filing and closeout slice.',
  },
]

export const ag54BatchDefinitions = Object.fromEntries(
  ag54BatchSpecs.map((spec) => [spec.plannedBatchId, makeAg54Batch(spec)]),
)
