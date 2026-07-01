const rawSourceFile = 'Practice Notes/AAA - C3 Phase 2 and AG 43 - March 2011.pdf'
const sourceFamilyId = 'practice_notes'
const sourceTitle = 'C3 Phase 2 / AG 43 March 2011 practice note'
const sourceReference = 'Practice Note for the Application of C-3 Phase II and Actuarial Guideline XLIII, March 2011'
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
    batchProfile: 'practice_note_c3_phase_2_ag43_2011',
    processingIntentText:
      spec.processingIntentText ??
      `Capture ${spec.batchTitle} as a review-only companion-guidance slice so the March 2011 C3 Phase II / AG 43 boundary stays narrow and reviewable.`,
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
        message: spec.flagMessage,
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
          spec.issueMessage ??
          `The ${titleLower} slice is intentionally narrow and should stay review-only.`,
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
        checkId: spec.validationCheckId ?? `${spec.sourceId}-coverage`,
        status: 'passed',
        details:
          spec.validationCheckDetails ??
          `The selected pages capture the ${spec.batchTitle} and stay review-only.`,
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
        versionDate: '2011-03',
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

const c3Phase2Ag43March2011PracticeNoteBatchSpecs = [
  {
    plannedBatchId: 'batch-231',
    batchSlug: 'c3-phase-2-231-opening-guidance',
    sourceId: 'c3-2011-opening-guidance',
    batchTitle: 'opening guidance and common-practice slice',
    summaryLead:
      'Front matter, products covered, and common practice guidance keep the note framed as companion guidance',
    pageWindow: [1, 12],
    sectionReference: 'Front matter, disclaimer, products covered, and common practice guidance',
    citationText:
      'Practice Note for the Application of C-3 Phase II and Actuarial Guideline XLIII',
    keywords: ['C-3 Phase II', 'AG 43', 'practice note', 'companion guidance', 'products covered'],
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
      'Keep the non-binding caveat visible while the opening guidance stays separate from the comparison section.',
    issueType: 'companion_guidance',
    issueMessage: 'The opening slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the opening guidance out of learner-facing output.',
    issueEvidence:
      'Pages 1-12 cover the title matter, disclaimer, products covered, and common practice guidance.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-232',
    batchSlug: 'c3-phase-2-232-model-differences',
    sourceId: 'c3-2011-model-differences',
    batchTitle: 'comparison of C-3 Phase I, C-3 Phase II, and AG 43 requirements',
    summaryLead:
      'The comparison layer should stay source-bound while the tax-basis and AVR / IMR differences remain in view',
    pageWindow: [13, 21],
    sectionReference: 'C-3 Phase I / C-3 Phase II / AG 43 differences',
    citationText:
      'Section 3 - Similarities and Differences Between C-3 Phase I, C-3 Phase II and AG 43 Requirements',
    keywords: ['C-3 Phase I', 'C-3 Phase II', 'AG 43', 'TAR', 'CTE', 'AVR', 'IMR'],
    notes:
      'Comparison of C-3 Phase I, C-3 Phase II, and AG 43 retained as review-only companion guidance.',
    sourceNotes:
      'Pages 13-21 only; section 3 comparison material.',
    reviewFlags: [
      'regulatory_requirement',
      'calculation_structure',
      'formula_context',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'boundary_review',
    flagMessage:
      'Keep the comparison and standalone-basis material review-only and do not overread it as binding law.',
    issueType: 'comparison_boundary',
    issueMessage: 'The comparison layer should stay source-bound and not be promoted.',
    issueAction: 'Keep the comparison material out of learner-facing output.',
    issueEvidence:
      'Pages 13-21 cover the C-3 Phase I / C-3 Phase II / AG 43 comparison and early scope / tax-basis differences.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-233',
    batchSlug: 'c3-phase-2-233-model-types-starting-assets',
    sourceId: 'c3-2011-model-types-starting-assets',
    batchTitle: 'model types, granularity, and starting assets slice',
    summaryLead:
      'The model-type and starting-asset language should stay together while the granularity discussion is still in view',
    pageWindow: [22, 29],
    sectionReference: 'Types of models / granularity and starting-assets discussion',
    citationText: 'Sections 4 and 5 - Types of Models/Granularity / Details on Starting Assets',
    keywords: ['model granularity', 'starting assets', 'integrated models', 'non-integrated models'],
    notes:
      'Model-types and starting-assets discussion retained as review-only companion guidance.',
    sourceNotes: 'Pages 22-29 only; sections 4 and 5 boundary material.',
    reviewFlags: [
      'calculation_structure',
      'asset_modeling_judgment',
      'formula_context',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'model_review',
    flagMessage:
      'Keep the model-type and starting-asset material review-only and do not widen the boundary.',
    issueType: 'model_boundary',
    issueMessage:
      'The model-types / starting-assets slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the model-types and starting-assets material out of learner-facing output.',
    issueEvidence: 'Pages 22-29 cover model granularity and starting-assets guidance.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-234',
    batchSlug: 'c3-phase-2-234-scenarios-economics',
    sourceId: 'c3-2011-scenarios-economics',
    batchTitle: 'scenario-generation and calibration slice',
    summaryLead:
      'The scenario-generation material should stay together as the first stochastic-modeling slice',
    pageWindow: [30, 39],
    sectionReference: 'Scenario generators, calibration, fund modeling, and economic assumptions',
    citationText: 'Section 6 - Details on Scenarios / Scenario Generators / Economic Assumptions',
    keywords: ['calibration points', 'scenario generators', 'S&P 500', 'fund modeling'],
    notes:
      'Scenario-generation and calibration guidance retained as review-only companion guidance.',
    sourceNotes: 'Pages 30-39 only; section 6 scenario-generation and calibration guidance.',
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
    issueEvidence: 'Pages 30-39 cover the scenario-generator and fund-modeling guidance.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-235',
    batchSlug: 'c3-phase-2-235-assumption-framework',
    sourceId: 'c3-2011-assumption-framework',
    batchTitle: 'actuarial/modeling assumptions opening slice',
    summaryLead:
      'The assumption framework should stay narrow before the revenue-sharing bridge begins',
    pageWindow: [40, 47],
    sectionReference: 'Actuarial/modeling assumptions opening slice',
    citationText: 'Section 7 - Details on Actuarial/Modeling Assumptions',
    keywords: ['mortality', 'lapse', 'withdrawal', 'annuitization', 'expense', 'tax', 'discount rate'],
    notes:
      'Opening assumption framework retained as review-only companion guidance.',
    sourceNotes: 'Pages 40-47 only; section 7 assumption-framework opening.',
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
      'Pages 40-47 cover prudent-best-estimate style assumptions, discounting, and core assumption setting.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-236',
    batchSlug: 'c3-phase-2-236-assumption-closeout',
    sourceId: 'c3-2011-assumption-closeout',
    batchTitle: 'assumption closeout and revenue-sharing bridge slice',
    summaryLead:
      'The revenue-sharing and interpolation material should stay together while the valuation-date bridge is in view',
    pageWindow: [48, 55],
    sectionReference: 'Assumption closeout, revenue-sharing bridge, and interpolation details',
    citationText: 'Section 7 - Details on Actuarial/Modeling Assumptions (continued)',
    keywords: ['revenue sharing', 'interpolation', 'informed projection', 'valuation-date bridge'],
    notes:
      'Assumption closeout, revenue-sharing bridge, and interpolation retained as review-only companion guidance.',
    sourceNotes: 'Pages 48-55 only; section 7 closeout and valuation-date bridging details.',
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
      'Pages 48-55 cover the revenue-sharing closeout and interpolation / informed projection methods.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-237',
    batchSlug: 'c3-phase-2-237-am-opener',
    sourceId: 'c3-2011-alternative-methodology',
    batchTitle: 'Alternative Method / Methodology opener slice',
    summaryLead:
      'The AM / Standard Scenario relationship should stay readable before the risk-control tail begins',
    pageWindow: [56, 59],
    sectionReference: 'Alternative Method / Methodology opener',
    citationText: 'Section 8 - Details on Alternative Method/Methodology (AM)',
    keywords: ['Alternative Method', 'Standard Scenario', 'GC', 'CA', 'AAR'],
    notes:
      'Alternative Method opener retained as review-only companion guidance.',
    sourceNotes: 'Pages 56-59 only; section 8 opener.',
    reviewFlags: [
      'reserve_method_structure',
      'calculation_structure',
      'definition_or_terminology',
      'boundary_control_window',
      'requires_human_interpretation',
    ],
    flagType: 'method_review',
    flagMessage:
      'Keep the Alternative Method opener separate so it does not pull in the Standard Scenario tail.',
    issueType: 'method_boundary',
    issueMessage: 'The AM opener is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the AM opener out of learner-facing output.',
    issueEvidence: 'Pages 56-59 cover the Alternative Method / Methodology opener.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-238',
    batchSlug: 'c3-phase-2-238-standard-scenario',
    sourceId: 'c3-2011-standard-scenario',
    batchTitle: 'standard scenario mechanics and tail-risk closeout slice',
    summaryLead:
      'The Standard Scenario material should stay intact before reinsurance begins',
    pageWindow: [60, 80],
    sectionReference: 'Standard Scenario mechanics and tail-risk closeout',
    citationText: 'Section 9 - Details on Standard Scenario',
    keywords: ['standard scenario', 'approved hedges', 'hedge credit', 'tail risk'],
    notes:
      'Standard Scenario mechanics and tail-risk closeout retained as review-only companion guidance.',
    sourceNotes: 'Pages 60-80 only; section 9 Standard Scenario material.',
    reviewFlags: [
      'scenario_or_stochastic_requirement',
      'calculation_structure',
      'formula_context',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'scenario_review',
    flagMessage:
      'Keep the Standard Scenario material intact before the reinsurance section begins.',
    issueType: 'scenario_boundary',
    issueMessage:
      'The Standard Scenario slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the Standard Scenario material out of learner-facing output.',
    issueEvidence: 'Pages 60-80 cover Standard Scenario mechanics and tail-risk closeout.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-239',
    batchSlug: 'c3-phase-2-239-reinsurance',
    sourceId: 'c3-2011-reinsurance',
    batchTitle: 'reinsurance treatment slice',
    summaryLead:
      'The reinsurance treatment slice should stay contiguous while the net-vs-gross reserve discussion remains in view',
    pageWindow: [81, 87],
    sectionReference: 'Treatment of reinsurance',
    citationText: 'Section 10 - Treatment of Reinsurance',
    keywords: ['reinsurance', 'net reserve', 'gross reserve', 'Appendix 2'],
    notes:
      'Treatment of reinsurance retained as review-only companion guidance.',
    sourceNotes: 'Pages 81-87 only; section 10 reinsurance material.',
    reviewFlags: [
      'reinsurance',
      'calculation_structure',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'reinsurance_review',
    flagMessage:
      'Keep the reinsurance treatment contiguous and separate from hedging.',
    issueType: 'reinsurance_boundary',
    issueMessage: 'The reinsurance slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the reinsurance material out of learner-facing output.',
    issueEvidence: 'Pages 81-87 cover the treatment of reinsurance.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-240',
    batchSlug: 'c3-phase-2-240-hedging',
    sourceId: 'c3-2011-hedging',
    batchTitle: 'hedging treatment slice',
    summaryLead:
      'The hedging slice should remain review-only while hedge-effectiveness and risk-neutral language remain in view',
    pageWindow: [88, 98],
    sectionReference: 'Treatment of hedging',
    citationText: 'Section 11 - Treatment of Hedging',
    keywords: ['hedging', 'hedge effectiveness', 'risk-neutral scenarios', 'hedging strategy'],
    notes:
      'Treatment of hedging retained as review-only companion guidance.',
    sourceNotes: 'Pages 88-98 only; section 11 hedging material.',
    reviewFlags: [
      'hedging_or_risk_mitigation',
      'scenario_or_stochastic_requirement',
      'calculation_structure',
      'cross_reference_mapping',
    ],
    flagType: 'hedging_review',
    flagMessage:
      'Keep hedge mechanics review-only and do not generalize the examples.',
    issueType: 'hedging_boundary',
    issueMessage: 'The hedging slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the hedging material out of learner-facing output.',
    issueEvidence: 'Pages 88-98 cover the treatment of hedging.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-241',
    batchSlug: 'c3-phase-2-241-certification-documentation',
    sourceId: 'c3-2011-certification-documentation',
    batchTitle: 'certification and required documentation slice',
    summaryLead:
      'The certification and documentation layer should stay together before the reserve-allocation discussion begins',
    pageWindow: [99, 104],
    sectionReference: 'Certification and required documentation',
    citationText: 'Section 12 - Details on Certification & Required Documentation',
    keywords: ['certification', 'documentation', 'model validation', 'disclosure'],
    notes:
      'Certification and required documentation retained as review-only companion guidance.',
    sourceNotes: 'Pages 99-104 only; section 12 certification / documentation material.',
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
    issueEvidence: 'Pages 99-104 cover the certification and required documentation guidance.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-242',
    batchSlug: 'c3-phase-2-242-allocation',
    sourceId: 'c3-2011-allocation',
    batchTitle: 'aggregate-reserve allocation slice',
    summaryLead:
      'The reserve-allocation mechanics should stay narrow and source-bound',
    pageWindow: [105, 106],
    sectionReference: 'Allocation of the aggregate reserves to the contract level',
    citationText: 'Section 13 - Allocation of the Aggregate Reserves to the Contract Level',
    keywords: ['SSR', 'SSA', 'CTEA', 'allocation', 'Appendix 6'],
    notes:
      'Aggregate-reserve allocation retained as review-only companion guidance.',
    sourceNotes: 'Pages 105-106 only; section 13 allocation material.',
    reviewFlags: [
      'calculation_structure',
      'formula_context',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'allocation_review',
    flagMessage: 'Keep the allocation example narrow and source-bound.',
    issueType: 'allocation_boundary',
    issueMessage: 'The allocation slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the allocation material out of learner-facing output.',
    issueEvidence: 'Pages 105-106 cover allocation of aggregate reserves to the contract level.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-243',
    batchSlug: 'c3-phase-2-243-peer-review',
    sourceId: 'c3-2011-peer-review',
    batchTitle: 'peer review and working-with-a-peer-reviewer slice',
    summaryLead:
      'The peer-review checklist material should stay together while the controls and review role remain in view',
    pageWindow: [107, 112],
    sectionReference: 'Peer review and working with a peer reviewer',
    citationText: 'Section 14 - Peer Review and Working with a Peer Reviewer',
    keywords: ['peer review', 'model validation', 'internal controls', 'checklist'],
    notes:
      'Peer review and reviewer guidance retained as review-only companion guidance.',
    sourceNotes: 'Pages 107-112 only; section 14 peer-review material.',
    reviewFlags: [
      'governance_or_control_expectation',
      'documentation_expectation',
      'background_content',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'peer_review',
    flagMessage: 'Keep the peer-review checklist material as companion guidance only.',
    issueType: 'peer_review_boundary',
    issueMessage: 'The peer-review slice is intentionally narrow and should stay review-only.',
    issueAction: 'Keep the peer-review material out of learner-facing output.',
    issueEvidence: 'Pages 107-112 cover peer review and working with a peer reviewer.',
    reviewStatus: 'needs_human_review',
  },
  {
    plannedBatchId: 'batch-244',
    batchSlug: 'c3-phase-2-244-revenue-sharing',
    sourceId: 'c3-2011-revenue-sharing',
    batchTitle: 'revenue sharing closeout slice',
    summaryLead:
      'The revenue-sharing closeout should end the source cleanly while the margin and control language remain in view',
    pageWindow: [113, 122],
    sectionReference: 'Revenue sharing closeout',
    citationText: 'Section 15 - Revenue Sharing',
    keywords: ['revenue sharing', 'margin', 'controlled income', 'applicable expenses'],
    notes:
      'Revenue sharing closeout retained as review-only companion guidance.',
    sourceNotes: 'Pages 113-122 only; section 15 revenue-sharing material.',
    reviewFlags: [
      'calculation_structure',
      'formula_context',
      'prescribed_assumption',
      'company_or_prudent_estimate_assumption',
      'cross_reference_mapping',
      'requires_human_interpretation',
    ],
    flagType: 'revenue_sharing_review',
    flagMessage:
      'Keep the closing revenue-sharing section review-only and do not widen the source family.',
    issueType: 'revenue_sharing_boundary',
    issueMessage:
      'The revenue-sharing closeout should remain summary-only and review-only.',
    issueAction: 'Keep the closeout material out of learner-facing output.',
    issueEvidence: 'Pages 113-122 cover the revenue-sharing closeout and final section boundary.',
    reviewStatus: 'needs_human_review',
  },
]

export const c3Phase2Ag43March2011PracticeNoteBatchDefinitions = Object.fromEntries(
  c3Phase2Ag43March2011PracticeNoteBatchSpecs.map((spec) => [spec.plannedBatchId, makeBatch(spec)]),
)
