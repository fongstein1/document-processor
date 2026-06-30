const rawSourceFile = 'Practice Notes/AAA - C3 Phase 2 - Sep 2006 - life_c3.8.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle = 'C3 Phase 2 practice note'
const sourceReference = 'American Academy of Actuaries practice note, September 2006'
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
    batchProfile: 'practice_note_c3_phase_2',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only companion-guidance slice so the C3 Phase 2 boundary stays narrow and reviewable.`,
    processingIntentNotes:
      'Practice-note workflow proof only. This batch stays review-only, source-bound, and excluded from learner-facing or app-ready outputs.',
    batchSummaryText: `Batch ${spec.plannedBatchId} remains review-only. ${spec.summaryLead} stays unpromoted.`,
    batchSummaryNotes: 'No learner-facing approval is granted.',
    reviewPacketReason: `This companion-guidance batch is intentionally limited to ${spec.batchTitle} and is retained for review-only analysis.`,
    reviewPacketNextStep:
      spec.nextStep ?? 'Proceed to the next section boundary in the practice note.',
    reviewerNotes:
      'Practice-note batch only. Keep the work review-first, preserve source-bound locators, and do not promote any item.',
    reviewPacketFlags: [
      {
        flagId: `flag-${spec.sourceId}`,
        severity: spec.flagSeverity ?? 'medium',
        sourceId: spec.sourceId,
        itemId,
        flagType: spec.flagType,
        flagMessage: spec.flagMessage,
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
        versionDate: '2006-09',
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

const c3Phase2PracticeNoteBatchSpecs = [
  {
    plannedBatchId: 'batch-222',
    batchSlug: 'c3-phase-2-222-opening-guidance',
    sourceId: 'c3-opening-guidance',
    batchTitle: 'opening guidance and products-covered slice',
    summaryLead:
      'Front matter, products covered, and common practice guidance keep the note framed as companion guidance',
    pageWindow: [1, 12],
    sectionReference: 'Front matter, products covered, and common practice guidance',
    citationText: 'Practice Note for the Application of C-3 Phase II',
    keywords: ['C-3 Phase II', 'practice note', 'companion guidance', 'products covered'],
    notes:
      'Front matter, disclaimer, products covered, and common practice guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 1-12 only; title pages, disclaimer, TOC, products covered, and common practice guidance.',
    reviewFlags: [
      'non_binding_practice_note',
      'caveat_or_companion_guidance',
      'cross_reference_mapping',
      'boundary_control_window',
    ],
    flagType: 'companion_guidance',
    flagMessage:
      'Keep the non-binding caveat visible while the opening guidance stays separate from the model-comparison section.',
    issueType: 'companion_guidance',
    issueMessage:
      'The opening slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the opening guidance out of learner-facing output.',
    issueEvidence:
      'Pages 1-12 cover the title matter, disclaimer, products covered, and common practice guidance.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-223',
    batchSlug: 'c3-phase-2-223-model-differences',
    sourceId: 'c3-model-differences',
    batchTitle: 'VA RBC vs VACARVM differences and model granularity slice',
    summaryLead:
      'The model-difference and starting-asset language should stay together while the comparison layer is in view',
    pageWindow: [13, 25],
    sectionReference: 'VA RBC vs VACARVM differences, model granularity, and starting assets',
    citationText: 'Section 3 - Consistency and Differences Between VA RBC and VACARVM Models',
    keywords: ['VA RBC', 'VACARVM', 'model granularity', 'starting assets', 'AVR', 'IMR'],
    notes:
      'VA RBC vs VACARVM comparison, model granularity, and starting-asset guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 13-25 only; Section 3, Section 4, and Section 5 boundary material.',
    reviewFlags: [
      'regulatory_requirement',
      'calculation_structure',
      'formula_context',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'boundary_review',
    flagMessage:
      'Keep the comparison and starting-asset material review-only and do not overread it as a binding rule.',
    issueType: 'comparison_boundary',
    issueMessage:
      'The comparison layer should stay source-bound and not be promoted.',
    issueAction: 'Keep the model-difference material out of learner-facing output.',
    issueEvidence:
      'Pages 13-25 cover the VA RBC / VACARVM comparison, granularity, and starting assets.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-224',
    batchSlug: 'c3-phase-2-224-scenarios-economics',
    sourceId: 'c3-scenarios-and-economics',
    batchTitle: 'scenario-generation and calibration slice',
    summaryLead:
      'The scenario-generation material should stay together as the first stochastic-modeling slice',
    pageWindow: [26, 33],
    sectionReference: 'Scenario generation, calibration, fund modeling, and economic assumptions',
    citationText: 'Section 6 - Details on Scenarios / Scenario Generators / Economic Assumptions',
    keywords: ['scenario generation', 'calibration', 'fund modeling', 'economic assumptions'],
    notes:
      'Scenario-generation, calibration, and fund-modeling guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 26-33 only; Section 6 scenario generation and calibration guidance.',
    reviewFlags: [
      'scenario_or_stochastic_requirement',
      'asset_modeling_judgment',
      'formula_context',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'scenario_review',
    flagMessage:
      'Keep the calibration and fund-modeling guidance review-only and preserve the boundary to the assumption section.',
    issueType: 'scenario_boundary',
    issueMessage:
      'The scenario-generation slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the scenario-calibration material out of learner-facing output.',
    issueEvidence:
      'Pages 26-33 cover the scenario-generator and fund-modeling guidance.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-225',
    batchSlug: 'c3-phase-2-225-assumption-framework',
    sourceId: 'c3-assumption-framework',
    batchTitle: 'prudent-best-estimate and assumption framework slice',
    summaryLead:
      'The assumption framework should stay narrow before the revenue-sharing and interpolation material begins',
    pageWindow: [34, 40],
    sectionReference: 'Prudent best estimate, discount rate, and core assumption setting',
    citationText: 'Section 7 - Details on Actuarial/Modeling Assumptions',
    keywords: ['prudent best estimate', 'discount rate', 'assumptions', 'margin'],
    notes:
      'Prudent-best-estimate framework and core assumption-setting retained as review-only companion guidance.',
    sourceNotes:
      'Pages 34-40 only; Section 7 assumption framework opening.',
    reviewFlags: [
      'prescribed_assumption',
      'company_or_prudent_estimate_assumption',
      'calculation_structure',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'assumption_review',
    flagMessage:
      'Keep the assumption-setting framework source-bound and do not overstate it as a universal rule.',
    issueType: 'assumption_boundary',
    issueMessage:
      'The prudent-best-estimate slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the assumption framework out of learner-facing output.',
    issueEvidence:
      'Pages 34-40 cover prudent best estimate, discount rates, and core assumption setting.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-226',
    batchSlug: 'c3-phase-2-226-assumption-closeout',
    sourceId: 'c3-assumption-closeout',
    batchTitle: 'revenue-sharing and interpolation closeout slice',
    summaryLead:
      'The revenue-sharing and interpolation material should stay together while the valuation-date bridge is in view',
    pageWindow: [41, 50],
    sectionReference: 'Revenue sharing, negative assets, interpolation, and informed projection',
    citationText: 'Section 7 - Details on Actuarial/Modeling Assumptions (continued)',
    keywords: ['revenue sharing', 'interpolation', 'informed projection', 'negative assets'],
    notes:
      'Revenue-sharing closeout, negative-asset handling, interpolation, and informed projection retained as review-only companion guidance.',
    sourceNotes:
      'Pages 41-50 only; Section 7 closeout and valuation-date bridging details.',
    reviewFlags: [
      'calculation_structure',
      'formula_context',
      'boundary_control_window',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'bridge_review',
    flagMessage:
      'Keep the revenue-sharing bridge and interpolation mechanics review-only and do not widen the slice.',
    issueType: 'bridge_boundary',
    issueMessage:
      'The interpolation and informed-projection material stays review-only and should not be repackaged as a promotion candidate.',
    issueAction: 'Keep the valuation-date bridge out of learner-facing output.',
    issueEvidence:
      'Pages 41-50 cover the revenue-sharing closeout and interpolation / informed projection methods.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-227',
    batchSlug: 'c3-phase-2-227-am-standard-scenario',
    sourceId: 'c3-alternative-methodology-standard-scenario',
    batchTitle: 'alternative methodology and standard scenario opener',
    summaryLead:
      'The AM / Standard Scenario relationship should stay readable before the risk-control tail begins',
    pageWindow: [51, 60],
    sectionReference: 'Alternative Methodology and Standard Scenario opener',
    citationText: 'Section 8 - Details on Alternative Methodology / Section 9 - Details on Standard Scenario',
    keywords: ['alternative methodology', 'standard scenario', 'GC', 'CA', 'AAR'],
    notes:
      'Alternative Methodology and Standard Scenario opener retained as review-only companion guidance.',
    sourceNotes:
      'Pages 51-60 only; Section 8 and the opening of Section 9.',
    reviewFlags: [
      'reserve_method_structure',
      'calculation_structure',
      'definition_or_terminology',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    flagType: 'method_review',
    flagMessage:
      'Keep the alternative-methodology and standard-scenario relationship visible without widening into the hedge tail.',
    issueType: 'method_boundary',
    issueMessage:
      'The AM / Standard Scenario slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the AM / Standard Scenario opener out of learner-facing output.',
    issueEvidence:
      'Pages 51-60 cover the AM and the opening standard-scenario questions.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-228',
    batchSlug: 'c3-phase-2-228-risk-controls',
    sourceId: 'c3-standard-scenario-risk-controls',
    batchTitle: 'standard scenario tail, reinsurance, and hedging entry slice',
    pageWindow: [61, 70],
    sectionReference: 'Standard Scenario tail, reinsurance, and hedging entry point',
    citationText: 'Section 10 - Treatment of Reinsurance / Section 11 - Treatment of Hedging',
    keywords: ['reinsurance', 'hedging', 'risk-neutral scenarios', 'approved hedges'],
    notes:
      'Standard-scenario tail, reinsurance, and hedging guidance retained as review-only companion guidance.',
    sourceNotes:
      'Pages 61-70 only; section 9 tail and section 10-11 risk-control material.',
    reviewFlags: [
      'reinsurance',
      'hedging_or_risk_mitigation',
      'scenario_or_stochastic_requirement',
      'calculation_structure',
      'cross_reference_mapping',
    ],
    flagType: 'risk_control_review',
    flagMessage:
      'Keep the reinsurance and hedging mechanics contiguous and stop before the certification layer.',
    issueType: 'risk_control_boundary',
    issueMessage:
      'The reinsurance / hedge-credit slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the risk-control material out of learner-facing output.',
    issueEvidence:
      'Pages 61-70 cover reinsurance, hedging, and the beginning of the hedge-effectiveness discussion.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-229',
    batchSlug: 'c3-phase-2-229-certification-documentation',
    sourceId: 'c3-certification-documentation',
    batchTitle: 'certification and documentation slice',
    summaryLead:
      'The C-3 Phase I consistency discussion, certification, and documentation layer should stay together',
    pageWindow: [71, 80],
    sectionReference: 'C-3 Phase I consistency, certification, and documentation requirements',
    citationText: 'Section 12 - Consistency Between VA RBC and C-3 Phase I Models / Section 13 - Details on Certification & Required Documentation',
    keywords: ['certification', 'documentation', 'peer review', 'reliance'],
    notes:
      'Certification, documentation, and C-3 Phase I consistency retained as review-only companion guidance.',
    sourceNotes:
      'Pages 71-80 only; sections 11-13 reporting / documentation material.',
    reviewFlags: [
      'reporting_requirement',
      'documentation_expectation',
      'governance_or_control_expectation',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'documentation_review',
    flagMessage:
      'Keep the certification and documentation material review-only and do not merge it into a promotional output.',
    issueType: 'documentation_boundary',
    issueMessage:
      'The certification / documentation slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the certification and documentation material out of learner-facing output.',
    issueEvidence:
      'Pages 71-80 cover the C-3 Phase I consistency discussion, certification, and documentation expectations.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-230',
    batchSlug: 'c3-phase-2-230-closeout',
    sourceId: 'c3-glossary-appendix-closeout',
    batchTitle: 'peer review, glossary, appendix Q&A, and closeout slice',
    summaryLead:
      'The appendix and closeout material should end the source cleanly at page 93',
    pageWindow: [81, 93],
    sectionReference: 'Peer review, glossary, appendix Q&A, and closing boundary',
    citationText: 'Sections 14-15 and Appendix - C-3 Phase II Implementation Questions and Answers',
    keywords: ['peer review', 'glossary', 'appendix', 'closeout'],
    notes:
      'Peer review, glossary, appendix Q&A, and closing boundary retained as review-only companion guidance.',
    sourceNotes:
      'Pages 81-93 only; sections 14-15 and appendix closeout.',
    reviewFlags: [
      'background_content',
      'caveat_or_companion_guidance',
      'boundary_control_window',
      'cross_reference_mapping',
      'non_binding_practice_note',
    ],
    flagType: 'closeout_review',
    flagMessage:
      'Keep the appendix and glossary material review-only and do not widen the source family.',
    issueType: 'closeout_boundary',
    issueMessage:
      'The peer-review and appendix closeout should remain summary-only and review-only.',
    issueAction: 'Keep the closeout material out of learner-facing output.',
    issueEvidence:
      'Pages 81-93 cover peer review, the glossary, and the appendix Q&A closeout.',
    reviewStatus: 'needs_human_review',
  },
]

export const c3Phase2PracticeNoteBatchDefinitions = Object.fromEntries(
  c3Phase2PracticeNoteBatchSpecs.map((spec) => [spec.plannedBatchId, makeBatch(spec)]),
)

