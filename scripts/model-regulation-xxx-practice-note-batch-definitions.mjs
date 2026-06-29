const rawSourceFile = 'Practice Notes/AAA - Model Regulation XXX - Dec 2006.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle = 'Model Regulation XXX practice note'
const sourceReference = 'American Academy of Actuaries practice note, December 2006'
const defaultNonLearnerNotes =
  'Practice-note slice retained as review-only companion guidance until the wave is explicitly expanded.'

const makeBatch = (spec) => {
  const pageStart = spec.pageWindow[0]
  const pageEnd = spec.pageWindow[1]
  const titleLower = spec.batchTitle.toLowerCase()
  const itemId = `item-${spec.sourceId}-${spec.batchSlug}`

  return {
    batchName: `Practice-note batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'practice_note_model_regulation_xxx',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only companion-guidance slice so the Model Regulation XXX boundary stays narrow and reviewable.`,
    processingIntentNotes:
      'Practice-note workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This companion-guidance batch is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep:
      spec.nextStep ?? 'Proceed to the next section boundary in the practice note.',
    reviewerNotes:
      'Small practice-note batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${spec.sourceId}`,
        severity: spec.flagSeverity ?? 'medium',
        sourceId: spec.sourceId,
        itemId,
        flagType: spec.flagType,
        message: spec.flagMessage,
        notes: 'Keep review-only and do not promote.',
      },
    ],
    reviewPacketCitationIssues: [
      {
        issueId: `citation-${spec.sourceId}`,
        sourceId: spec.sourceId,
        itemId,
        issueType: spec.citationIssueType ?? 'boundary_control_window',
        details:
          spec.citationDetails ??
          `The ${titleLower} slice spans pages ${pageStart}-${pageEnd} and should remain visible in review.`,
        recommendedAction:
          spec.citationAction ?? `Keep ${titleLower} review-only and do not merge it forward.`,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${spec.sourceId}`,
        decisionType: spec.decisionType ?? 'scope_split',
        question:
          spec.decisionQuestion ??
          `Should ${titleLower} stay as one batch, or should the next batch split the boundary further?`,
        whyItMatters:
          spec.decisionWhy ?? 'The practice-note wave should stay narrow and reviewable.',
        recommendedOwner: spec.recommendedOwner ?? 'source reviewer',
        priority: spec.decisionPriority ?? 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${spec.sourceId}`,
        severity: spec.issueSeverity ?? 'medium',
        issueType: spec.issueType ?? 'implementation_guidance',
        sourceId: spec.sourceId,
        itemId,
        message:
          spec.issueMessage ?? `The ${titleLower} slice is intentionally narrow and should stay review-only.`,
        recommendedAction:
          spec.issueAction ?? `Keep the ${titleLower} out of learner-facing output.`,
        evidence: spec.issueEvidence ?? `Pages ${pageStart}-${pageEnd} cover ${titleLower}.`,
      },
    ],
    validationChecks: [
      {
        checkId: 'batch-manifest-guardrails',
        status: 'passed',
        details: 'Practice-note manifest blocks learner-facing promotion and app-ready export.',
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
        sourceId: spec.sourceId,
        relativePath: rawSourceFile,
        sourceFamilyId,
        documentType: 'practice_note',
        sourceTitle,
        sourceReference,
        versionDate: '2006-12',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText,
        confidence: spec.confidence ?? 'high',
        reviewFlags: spec.reviewFlags,
        reviewStatus: spec.reviewStatus ?? 'draft_candidate',
        itemKind: 'chunk',
        notes: spec.notes,
        summary: spec.summaryLead,
        keywords: spec.keywords,
        sourceNotes: spec.sourceNotes,
        artifactProcessingStatus: 'inventoried',
        inventoryProcessingStatus: 'inventoried',
        authorityLevel: spec.authorityLevel ?? 'supporting_guidance',
        reviewPacketNotes: spec.reviewPacketNotes ?? spec.notes,
        reviewPacketIssueCount: 1,
        reviewPacketProcessingStatus: 'inventoried',
        nonLearnerFacingNotes: spec.nonLearnerFacingNotes ?? defaultNonLearnerNotes,
      },
    ],
  }
}

const modelRegulationXXXPracticeNoteBatchSpecs = [
  {
    plannedBatchId: 'batch-192',
    batchSlug: 'mrx-192-front-matter-scope',
    sourceId: 'mrx-front-matter-scope',
    batchTitle: 'front matter and early scope slice',
    summaryLead:
      'Front matter, disclaimer, introduction, early scope guidance, and group-life boundary questions frame the practice note as companion guidance for Model Regulation XXX',
    pageWindow: [1, 7],
    sectionReference: 'Introduction, Section 1 Purpose/Scope, and the early Section 3.1 regulatory-requirement questions',
    citationText:
      'This practice note has not been promulgated by the Actuarial Standards Board, nor is it binding on any actuary.',
    keywords: ['practice note', 'Model Regulation XXX', 'non-binding', 'ASOP 40', 'scope'],
    notes:
      'Front matter, disclaimer, introduction, and early scope questions retained as review-only companion guidance.',
    sourceNotes:
      'Pages 1-7 only; title pages, disclaimer, introduction, scope, and early regulatory requirements.',
    reviewFlags: ['background_content', 'caveat_or_companion_guidance', 'cross_reference_mapping', 'boundary_control_window'],
    flagType: 'companion_guidance',
    flagMessage:
      'The front matter and introduction are non-binding companion guidance and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'model-regulation-xxx-front-matter-coverage',
    validationCheckDetails:
      'The selected pages capture the disclaimer, scope, and early regulatory guidance.',
    nextStep:
      'Move to X-factor selection, classing, credibility, and approximation material at pages 8-12.',
    issueType: 'opening_boundary',
    issueMessage:
      'The opening and Section 3.1 material should stay separate from the X-factor selection sections.',
    issueAction: 'Preserve the opening window and stop before X-factor selection begins.',
    issueEvidence:
      'Pages 1-7 cover the title pages, disclaimer, introduction, scope, and first regulatory questions.',
    reviewPacketNotes:
      'Keep the opening companion-guidance text separate from the later X-factor, reinsurance, and secondary-guarantee sections.',
  },
  {
    plannedBatchId: 'batch-193',
    batchSlug: 'mrx-193-x-factor-selection',
    sourceId: 'mrx-x-factor-selection',
    batchTitle: 'X-factor selection and approximation slice',
    summaryLead:
      'X-factor selection, classing, credibility, and mortality-distribution / approximation methods explain how actuaries form and support X factors',
    pageWindow: [8, 12],
    sectionReference: 'Section 3.5 Selection of X Factors and the related mortality-distribution discussion',
    citationText: 'Section 3.5 Selection of X Factors',
    keywords: ['X factors', 'credibility', 'mortality', 'approximation', 'Model Regulation XXX'],
    notes:
      'X-factor selection, classing, and approximation methods retained as review-only companion guidance.',
    sourceNotes:
      'Pages 8-12 only; X-factor selection, credibility, mortality-distribution methods, and approximation examples.',
    reviewFlags: ['regulatory_requirement', 'definition_or_terminology', 'calculation_structure', 'formula_context', 'requires_human_interpretation'],
    flagType: 'x_factor_selection',
    flagMessage:
      'The X-factor selection discussion contains important actuarial judgment and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'model-regulation-xxx-x-factor-coverage',
    validationCheckDetails:
      'The selected pages capture the X-factor selection logic and the mortality-distribution / approximation material.',
    nextStep:
      'Move to reinsurance, mean reserve / tax reserve handling, substandard policy discussion, and AG XXXVIII questions at pages 13-18.',
    issueType: 'selection_boundary',
    issueMessage:
      'The X-factor selection and approximation material should stay separate from reinsurance and secondary-guarantee material.',
    issueAction:
      'Keep the approximation / selection window narrow and stop before the later reinsurance section begins.',
    issueEvidence:
      'Pages 8-12 cover selection of X factors, credibility, and mortality-distribution / approximation discussion.',
    reviewPacketNotes:
      'Keep the X-factor logic review-only and do not let it absorb the later reinsurance or secondary-guarantee material.',
  },
  {
    plannedBatchId: 'batch-194',
    batchSlug: 'mrx-194-reinsurance-secondary-guarantee',
    sourceId: 'mrx-reinsurance-secondary-guarantee',
    batchTitle: 'reinsurance and secondary-guarantee slice',
    summaryLead:
      'Reinsurance, mean reserve / tax reserve handling, substandard policy discussion, and AG XXXVIII secondary-guarantee questions close out the note',
    pageWindow: [13, 18],
    sectionReference: 'Section 3.7.2 Reinsurance through the closing AG XXXVIII / secondary-guarantee questions',
    citationText: 'Section 3.7.2 Reinsurance',
    keywords: ['reinsurance', 'mean reserve', 'tax reserve', 'secondary guarantee', 'AG XXXVIII'],
    notes:
      'Later reinsurance, reserve, and secondary-guarantee material retained as review-only companion guidance.',
    sourceNotes:
      'Pages 13-18 only; example, reinsurance, mean reserve, tax reserve, substandard policy, and AG XXXVIII questions.',
    reviewFlags: ['reinsurance', 'calculation_structure', 'cross_reference_mapping', 'background_content', 'boundary_control_window', 'requires_human_interpretation'],
    flagType: 'reinsurance_boundary',
    flagMessage:
      'The reinsurance, reserve, and secondary-guarantee discussion should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'model-regulation-xxx-reinsurance-coverage',
    validationCheckDetails:
      'The selected pages capture the reinsurance, reserve, and AG XXXVIII / secondary-guarantee material without leaving the source boundary.',
    nextStep:
      'After this source is complete, move to the next safe source unit in the remaining practice-note inventory.',
    issueType: 'closing_boundary',
    issueMessage:
      'The closing material should stay separate from any later practice note or source family.',
    issueAction: 'Keep the closing boundary explicit and do not merge it into a later source unit.',
    issueEvidence:
      'Pages 13-18 cover the later reinsurance, reserve, tax reserve, and AG XXXVIII secondary-guarantee questions.',
    reviewPacketNotes:
      'Keep the closing material review-only and do not merge it into any later practice note.',
  },
]

export const modelRegulationXXXPracticeNoteBatchDefinitions = Object.fromEntries(
  modelRegulationXXXPracticeNoteBatchSpecs.map((spec) => [
    spec.plannedBatchId,
    makeBatch(spec),
  ]),
)
