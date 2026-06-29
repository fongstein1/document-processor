const rawSourceFile = 'Practice Notes/AAA - Model_Governance_PN_042017.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle = 'Model Governance: Some Considerations for Practicing Life Actuaries'
const sourceReference = 'American Academy of Actuaries practice note, April 2017'
const defaultNonLearnerNotes =
  'Practice-note slice retained as review-only until the wave is explicitly expanded.'

const makeModelGovernancePracticeNoteBatch = (spec) => {
  const sourceId = spec.sourceId
  const itemId = `item-${sourceId}-${spec.batchSlug}`
  const pageStart = spec.pageWindow[0]
  const pageEnd = spec.pageWindow[1]
  const batchTitleLower = spec.batchTitle.toLowerCase()

  return {
    batchName: `Practice-note batch ${spec.plannedBatchId} - ${spec.batchTitle}`,
    batchSlug: spec.batchSlug,
    batchProfile: 'practice_note_model_governance',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only companion-guidance slice so the model-governance boundary stays narrow and reviewable.`,
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
        issueType: spec.citationIssueType ?? 'boundary_control_window',
        details:
          spec.citationDetails ??
          `The ${batchTitleLower} slice spans pages ${pageStart}-${pageEnd} and should remain visible in review.`,
        recommendedAction:
          spec.citationAction ?? `Keep ${batchTitleLower} review-only and do not merge it forward.`,
      },
    ],
    reviewPacketHumanDecisions: [
      {
        decisionId: `decision-${sourceId}`,
        decisionType: spec.decisionType ?? 'scope_split',
        question:
          spec.decisionQuestion ??
          `Should ${batchTitleLower} stay as one batch, or should the next batch split the boundary further?`,
        whyItMatters:
          spec.decisionWhy ?? 'The practice-note wave should stay narrow and reviewable.',
        recommendedOwner: spec.recommendedOwner ?? 'source reviewer',
        priority: spec.decisionPriority ?? 'medium',
      },
    ],
    unresolvedIssues: [
      {
        issueId: `issue-${sourceId}`,
        severity: spec.issueSeverity ?? 'medium',
        issueType: spec.issueType ?? 'implementation_guidance',
        sourceId,
        itemId,
        message:
          spec.issueMessage ?? `The ${batchTitleLower} slice is intentionally narrow and should stay review-only.`,
        recommendedAction:
          spec.issueAction ?? `Keep the ${batchTitleLower} out of learner-facing output.`,
        evidence:
          spec.issueEvidence ?? `Pages ${pageStart}-${pageEnd} cover ${batchTitleLower}.`,
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
        sourceId,
        relativePath: rawSourceFile,
        sourceFamilyId,
        documentType: 'practice_note',
        sourceTitle,
        sourceReference,
        versionDate: '2017-04',
        pageWindow: spec.pageWindow,
        sectionReference: spec.sectionReference,
        citationText: spec.citationText ?? spec.sectionReference,
        confidence: 'high',
        reviewFlags: [
          'core_vm_course',
          'supporting_guidance',
          'companion_guidance',
          'non_binding_guidance',
          ...(spec.reviewFlags ?? []),
        ],
        reviewStatus: spec.reviewStatus ?? 'needs_human_review',
        itemKind: spec.itemKind ?? 'chunk',
        notes: spec.notes,
        summary: spec.summary ?? spec.summaryLead,
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

const modelGovernancePracticeNoteBatchSpecs = [
  {
    plannedBatchId: 'batch-183',
    batchSlug: 'mg-183-front-matter-intro',
    sourceId: 'mg-front-matter-intro',
    batchTitle: 'front matter and introduction / model-development opener',
    summaryLead:
      'Front matter, disclaimer, introduction, model definition, and development overview frame model governance as companion guidance for PBR implementers',
    pageWindow: [1, 7],
    sectionReference: 'Front matter, introduction, model, and model development',
    citationText: 'This practice note is not binding upon any actuary.',
    keywords: ['model governance', 'practice note', 'non-binding', 'PBR', 'model development'],
    notes:
      'Front matter, disclaimer, introduction, model, and development overview retained as review-only companion guidance.',
    sourceNotes:
      'Pages 1-7 only; title pages, disclaimer, introduction, table of contents, model definition, and development opener.',
    reviewFlags: ['background_content', 'caveat_or_companion_guidance', 'cross_reference_mapping', 'boundary_control_window'],
    flagType: 'companion_guidance',
    flagMessage:
      'The front matter and introduction are non-binding companion guidance and should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'model-governance-front-matter-coverage',
    validationCheckDetails:
      'The selected pages capture the front matter and early model-development overview.',
    nextStep:
      'Move to model governance policy, model risk, governance, and validation at pages 8-14 while keeping the opening window narrow.',
    issueType: 'opening_boundary',
    issueMessage:
      'The front matter and introduction should stay separate from the governance/control sections.',
    issueAction: 'Preserve the opening window and stop before governance policy begins.',
    issueEvidence:
      'Pages 1-7 cover the title pages, disclaimer, introduction, model definition, and early development material.',
    reviewPacketNotes:
      'Keep the opening companion-guidance text separate from the later governance and validation sections.',
  },
  {
    plannedBatchId: 'batch-184',
    batchSlug: 'mg-184-governance-controls',
    sourceId: 'mg-governance-controls',
    batchTitle: 'model governance, controls, and validation',
    summaryLead:
      'Model governance policy, model risk, governance, controls, and validation provide implementation guidance for oversight and monitoring',
    pageWindow: [8, 14],
    sectionReference: 'Sections 3-7 model governance policy and standards through validation',
    citationText: 'Define and document responsibilities',
    keywords: ['model governance', 'controls', 'validation', 'model risk', 'practice note'],
    notes:
      'Governance and control section retained as review-only companion guidance.',
    sourceNotes:
      'Pages 8-14 only; roles, controls, model risk, validation, and validation-output guidance.',
    reviewFlags: ['governance_or_control_expectation', 'documentation_expectation', 'cross_reference_mapping', 'requires_human_interpretation'],
    flagType: 'governance_controls',
    flagMessage:
      'The governance, controls, and validation discussion should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'model-governance-controls-coverage',
    validationCheckDetails:
      'The selected pages capture governance, control, and validation guidance without absorbing documentation closeout.',
    nextStep:
      'Move to validation-governance relationship, documentation, references, and definitions at pages 15-18.',
    issueType: 'governance_boundary',
    issueMessage:
      'The governance and validation slice should stay separate from the documentation closeout.',
    issueAction:
      'Keep the governance / controls window narrow and stop before the documentation closeout.',
    issueEvidence:
      'Pages 8-14 cover policy, model risk, governance, controls, and validation.',
    reviewPacketNotes:
      'Keep the governance and controls text separate from the closing documentation and references.',
  },
  {
    plannedBatchId: 'batch-185',
    batchSlug: 'mg-185-validation-documentation',
    sourceId: 'mg-validation-documentation',
    batchTitle: 'validation, documentation, references, and definitions',
    summaryLead:
      'Validation-governance relationship, documentation for multiple audiences, references, and definitions close out the note',
    pageWindow: [15, 18],
    sectionReference: 'Sections 7-9 validation-governance relationship through definitions',
    citationText: 'A documented model governance framework will often formally establish enterprise standards',
    keywords: ['model governance', 'validation', 'documentation', 'definitions', 'practice note'],
    notes:
      'Closing validation and documentation material retained as review-only companion guidance.',
    sourceNotes:
      'Pages 15-18 only; governance relationship, documentation discussion, references, and definitions.',
    reviewFlags: ['documentation_expectation', 'definition_or_terminology', 'cross_reference_mapping', 'boundary_control_window', 'requires_human_interpretation'],
    flagType: 'validation_documentation',
    flagMessage:
      'The validation, documentation, and definitions closeout should remain review-only.',
    decisionType: 'scope_split',
    validationCheckId: 'model-governance-validation-documentation-coverage',
    validationCheckDetails:
      'The selected pages capture the closing validation and documentation material.',
    nextStep:
      'Confirm that the source ends cleanly here and decide whether any later practice note should be planned next.',
    issueType: 'closing_boundary',
    issueMessage:
      'The closing validation and documentation slice should stay separate from any later practice note file.',
    issueAction: 'Preserve the closing boundary and stop at the end of the source.',
    issueEvidence:
      'Pages 15-18 cover the validation-governance relationship, documentation guidance, references, and definitions.',
    reviewPacketNotes:
      'Keep the closing validation and documentation text separate from any later practice note source.',
  },
]

export const modelGovernancePracticeNoteBatchDefinitions = Object.fromEntries(
  modelGovernancePracticeNoteBatchSpecs.map((spec) => [spec.plannedBatchId, makeModelGovernancePracticeNoteBatch(spec)]),
)

