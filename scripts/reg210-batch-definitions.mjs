const rawSourceFolder = 'NY Regulations'
const sourceFamilyId = 'ny_regulations'
const sourceTitle = 'Life Insurance and Annuity Non-Guaranteed Elements'
const sourceReference = '11 NYCRR Part 48 (Insurance Regulation 210)'
const defaultNonLearnerNotes =
  'Regulation 210 stays review-only. Keep page locators and line references primary, and do not promote any item.'

const makeReg210Batch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`

  return {
    batchName: `Regulation 210 controlled batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'ny_regulation_210_non_guaranteed_elements',
    processingIntentText:
      spec.processingIntentText ??
      'Small NY Regulation 210 review-only batch: capture the non-guaranteed-elements opening guidance and keep later sections outside the batch.',
    processingIntentNotes: spec.processingIntentNotes ?? defaultNonLearnerNotes,
    batchSummaryText:
      spec.batchSummaryText ??
      'Batch remains review-only. Regulation 210 is retained as review-only regulatory text and is not approved for promotion.',
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This Regulation 210 slice is intentionally limited to ${spec.batchTitle} and keeps the next section outside the batch.`,
    reviewPacketNextStep: spec.nextStep,
    reviewerNotes:
      'Small NY Regulation 210 batch. Keep the work review-first, preserve page locators and line references, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${sourceId}`,
        severity: 'medium',
        sourceId,
        itemId,
        flagType: 'paragraph_locator_primary',
        message:
          'Regulation 210 should stay page-locator anchored because the runner is expected to preserve line references for this text source.',
        notes: 'Keep review-only and do not promote.',
      },
      {
        flagId: `flag-${sourceId}-line-reference`,
        severity: 'low',
        sourceId,
        itemId,
        flagType: 'line_references_expected',
        message:
          'Line references should be preserved for this PDF path; page locators remain the primary anchor.',
        notes: 'Keep the page-locator anchor visible as a review note.',
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
          'Page locators should remain the primary anchor for Regulation 210 because the source is a PDF and the runner should preserve line references.',
        recommendedAction:
          'Keep the planned page window together and preserve the locator in the review packet.',
      },
      {
        issueId: `citation-${sourceId}-line-reference-gap`,
        sourceId,
        itemId,
        issueType: 'line_references_expected',
        details:
          'Line references should be preserved for this PDF source, so page locators remain the practical review anchor.',
        recommendedAction:
          'Keep the page locator visible and avoid overclaiming exact line wording.',
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
          'Should Regulation 210 remain indexed as active review-only regulatory guidance, or should it later be linked only as a context note if later amendments supersede it?',
        whyItMatters: 'The indexing choice affects future review and promotion decisions.',
        recommendedOwner: 'processor owner',
        priority: 'high',
      },
      {
        decisionId: `decision-${sourceId}-paragraph-window-split`,
        decisionType: 'boundary_check',
        question:
          'Should the current page-window split remain the canonical regeneration boundary, or should later cleanup rebalance the filing and records sections?',
        whyItMatters: 'The page window controls how much context is exposed in the review packet.',
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
          'The Regulation 210 slice should remain anchored by page locators because the runner is expected to preserve line references.',
        recommendedAction:
          'Keep the page locator visible instead of overclaiming exact line wording.',
        evidence:
          'The source is a PDF and the controlled runner should preserve line-level references for this source family.',
      },
      {
        issueId: `issue-${sourceId}-line-reference-gap`,
        severity: 'medium',
        issueType: 'line_references_expected',
        sourceId,
        itemId,
        message:
          'Line references should be preserved for this PDF source, so the page locator should remain the review anchor.',
        recommendedAction:
          'Keep the page locator visible and avoid overclaiming exact line wording.',
        evidence:
          'Regulation 210 is a text-based PDF source and the controlled runner should preserve line-level references for this source family.',
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
        checkId: 'reg210-page-window-coverage',
        status: 'passed',
        details: `The selected page window captures the planned Regulation 210 ${spec.batchTitle}.`,
      },
      {
        checkId: 'source-reference-coverage',
        status: 'passed',
        details: 'The Regulation 210 slice carries a source reference and a page locator.',
      },
      {
        checkId: 'line-reference-gap-tracked',
        status: 'passed',
        details: 'The review packet keeps page locators primary because line references should be preserved.',
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
        documentType: 'ny_regulation',
        sourceTitle,
        sourceReference,
        versionDate: '2018-03-19',
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
        authorityLevel: 'regulation',
        reviewPacketNotes: spec.reviewPacketNotes,
        reviewPacketIssueCount: 3,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes:
          'Regulation 210 slice retained as review-only regulatory text until the wording and boundary are confirmed.',
      },
    ],
  }
}

const reg210BatchSpecs = [
  {
    plannedBatchId: 'batch-186',
    batchSlug: 'reg210-186-opening-purpose-scope-definitions',
    sourceId: 'reg210-opening-purpose-scope-definitions',
    filename: 'Reg-210-11-NYCRR-S048.pdf',
    sourceTitle: 'Life Insurance and Annuity Non-Guaranteed Elements',
    sourceReference: '11 NYCRR Part 48 (Insurance Regulation 210)',
    batchTitle: 'opening title, purpose, scope, and definitions slice',
    pageWindow: [1, 3],
    sectionReference: 'Section 48.0 Purpose, scope, and unfair trade practice; opening definitions',
    citationText: 'Section 48.0 Purpose, scope, and unfair trade practice.',
    summary:
      "Opening title, purpose, scope, and definitions establish Regulation 210's non-guaranteed-elements framework for life insurance and annuity contracts, while the trailing blank page remains boundary context only.",
    keywords: ['Reg 210', 'non-guaranteed elements', 'purpose', 'scope', 'definitions', 'life insurance', 'annuity contracts'],
    notes: 'Opening title/purpose/scope/definitions slice; keep the blank trailing page out of the batch.',
    sourceNotes: 'Pages 1-3 only; title page plus purpose/scope/definitions window.',
    reviewPacketNotes: 'Keep the opening regulatory text separate from the qualification and filing sections.',
    nextStep:
      'Move to qualified actuary standards, board-approved criteria, and non-guaranteed elements at pages 4-6 while keeping the opening window narrow.',
    flagType: 'opening_boundary',
    flagMessage: 'The opening title, purpose, scope, and definitions slice should remain review-only.',
    topicIssueType: 'opening_boundary',
    topicIssueDetails:
      'The opening material should stay separate from the later qualification and filing sections.',
    topicRecommendedAction: 'Preserve the opening window and stop before the qualified actuary section begins.',
    topicIssueMessage:
      'The opening title, purpose, scope, and definitions slice should remain separate from the qualification and filing sections.',
    topicIssueEvidence:
      'Pages 1-3 contain the title page, purpose, scope, and opening definition material.',
    topicValidationDetails: 'The opening window stayed confined to the planned page range and the blank trailing page was left out of the batch.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'regulatory_requirement', 'definition_or_terminology', 'background_content'],
  },
  {
    plannedBatchId: 'batch-187',
    batchSlug: 'reg210-187-criteria-non-guaranteed-elements',
    sourceId: 'reg210-criteria-non-guaranteed-elements',
    filename: 'Reg-210-11-NYCRR-S048.pdf',
    sourceTitle: 'Life Insurance and Annuity Non-Guaranteed Elements',
    sourceReference: '11 NYCRR Part 48 (Insurance Regulation 210)',
    batchTitle: 'qualified actuary, board-approved criteria, and non-guaranteed elements slice',
    pageWindow: [4, 6],
    sectionReference: 'Sections 48.1-48.3: qualified actuary, board-approved criteria, and non-guaranteed elements',
    citationText: 'An insurer shall establish board-approved criteria for determining non-guaranteed charges or benefits.',
    summary:
      'Qualified actuary requirements, board-approved criteria, and the substantive rules for determining non-guaranteed elements explain how insurers should apply and justify changes to charges and benefits.',
    keywords: ['Reg 210', 'qualified actuary', 'board-approved criteria', 'non-guaranteed elements', 'anticipated experience factors', 'pricing cells'],
    notes: 'Criteria and non-guaranteed-elements slice; keep filing and records for a later batch.',
    sourceNotes: 'Pages 4-6 only; qualification criteria and criteria-based determination window.',
    reviewPacketNotes: 'Keep the criteria text separate from the filing and records section.',
    nextStep:
      'Move to filing and records requirements at pages 7-9 while keeping the criteria window narrow.',
    flagType: 'criteria_boundary',
    flagMessage:
      'The qualified actuary, board-approved criteria, and non-guaranteed-elements slice should remain review-only.',
    topicIssueType: 'criteria_boundary',
    topicIssueDetails:
      'The criteria slice should stay separate from the later filing and records material.',
    topicRecommendedAction: 'Preserve the criteria window and keep the filing section out of this batch.',
    topicIssueMessage:
      'The qualified actuary, board-approved criteria, and non-guaranteed-elements slice should remain separate from the filing section.',
    topicIssueEvidence: 'Pages 4-6 contain the qualified actuary standards, criteria, and non-guaranteed-elements material.',
    topicValidationDetails:
      'The criteria window stayed confined to the planned page range and did not absorb filing and records material.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'regulatory_requirement', 'governance_or_control_expectation', 'company_or_prudent_estimate_assumption'],
  },
  {
    plannedBatchId: 'batch-188',
    batchSlug: 'reg210-188-filing-records-closeout',
    sourceId: 'reg210-filing-records-closeout',
    filename: 'Reg-210-11-NYCRR-S048.pdf',
    sourceTitle: 'Life Insurance and Annuity Non-Guaranteed Elements',
    sourceReference: '11 NYCRR Part 48 (Insurance Regulation 210)',
    batchTitle: 'filing and records closeout slice',
    pageWindow: [7, 9],
    sectionReference: 'Section 48.4 Filing and records requirements',
    citationText: 'An insurer shall obtain an actuarial memorandum signed and dated by a qualified actuary.',
    summary:
      'Filing and records requirements cover actuarial memoranda, annual adverse-change filings, superintendent access to records, and retention of written documentation, then stop before the blank trailing page.',
    keywords: ['Reg 210', 'filing', 'records', 'actuarial memorandum', 'qualified actuary', 'retention'],
    notes: 'Filing and records closeout; keep the blank trailing page out of the batch.',
    sourceNotes: 'Pages 7-9 only; filing and records window.',
    reviewPacketNotes: 'Keep the closing records text separate from any later NY regulation file.',
    nextStep:
      'Confirm that the source ends cleanly at page 9 and treat page 10 as blank boundary context only.',
    flagType: 'records_boundary',
    flagMessage: 'The filing and records closeout slice should remain review-only.',
    topicIssueType: 'records_boundary',
    topicIssueDetails:
      'The filing and records closeout should remain separate from any future NY regulation source.',
    topicRecommendedAction: 'Preserve the closing boundary and stop at the end of the source.',
    topicIssueMessage:
      'The filing and records closeout slice should remain separate from any later NY regulation file.',
    topicIssueEvidence: 'Pages 7-9 contain the filing and records requirements.',
    topicValidationDetails:
      'The filing window stayed confined to the planned page range and remained separate from the blank trailing page.',
    reviewFlags: ['text_source', 'paragraph_locator_primary', 'regulatory_requirement', 'reporting_requirement', 'documentation_expectation'],
  },
]

export const reg210BatchDefinitions = Object.fromEntries(
  reg210BatchSpecs.map((spec) => {
    const batch = makeReg210Batch(spec)
    return [spec.plannedBatchId, batch]
  }),
)
